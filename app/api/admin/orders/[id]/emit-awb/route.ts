import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminSession } from '@/lib/adminSession';
import { createShipment, printExtended, trackingUrlForAwb } from '@/lib/dpdService';
import { sendEmail } from '@/lib/email';
import { calculateShippingParams, determinePackingType } from '@/lib/shippingUtils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get('admin_auth')?.value;
    const session = verifyAdminSession(token);
    if (!session) return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
    if (!order) return NextResponse.json({ ok: false, message: 'Order not found' }, { status: 404 });

    const addressRaw = order.shippingAddress;
    const address = typeof addressRaw === 'object' && addressRaw !== null ? (addressRaw as any) : JSON.parse((addressRaw as string) || '{}');
    let serviceId = Number(process.env.DPD_DEFAULT_SERVICE_ID || 2505);

    // Configurare Țări DPD (ISO Numeric)
    const COUNTRY_IDS: Record<string, number> = {
      'RO': 642, 'HU': 348, 'BG': 100, 'GR': 300, 'PL': 616,
      'CZ': 203, 'SK': 703, 'SI': 705, 'IT': 380, 'ES': 724,
      'FR': 250, 'DE': 276, 'AT': 40, 'BE': 56, 'HR': 191,
      'NL': 528, 'PT': 620, 'DK': 208, 'SE': 752, 'FI': 246
    };

    const countryCode = (address.country || 'RO').toUpperCase();
    const countryId = COUNTRY_IDS[countryCode] || 642; // default RO

    // Ajustare pentru intern vs internațional
    if (countryCode !== 'RO') {
      serviceId = 2303; // DPD Classic International
    }

    if (!serviceId) return NextResponse.json({ ok: false, message: 'DPD serviceId unavailable' }, { status: 500 });

    // Build shipment
    const contentDesc = (order.items || []).map((it: any) => `${it.name} x${it.qty}`).join(', ').slice(0, 70) || 'Materiale tipar';

    // Ramburs permis doar in RO
    const isRambursValid = (order.paymentMethod === 'Ramburs' || order.paymentMethod === 'cash_on_delivery') && countryCode === 'RO';
    const codAmount = isRambursValid ? Math.max(0, Number(order.totalAmount || 0)) : 0;

    const senderClientId = process.env.DPD_SENDER_CLIENT_ID ? Number(process.env.DPD_SENDER_CLIENT_ID) : undefined;

    const shipment: any = {
      sender: senderClientId ? { clientId: senderClientId } : undefined,
      recipient: {
        clientName: address?.nume_prenume || address?.nume || (order as any).user?.name || 'Client',
        contactName: address?.nume_prenume || address?.nume || (order as any).user?.name || 'Client',
        email: address?.email || (order as any).user?.email || undefined,
        phone1: { number: address?.telefon || (order as any).user?.phone || undefined },
        privatePerson: true,
        address: {
          countryId: countryId,
          siteName: address?.localitate,
          postCode: address?.postCode,
          addressNote: `${address?.strada_nr || ''}, ${address?.localitate || ''}, ${address?.judet || ''}, ${countryCode}`
        },
      },
      service: { serviceId, autoAdjustPickupDate: true },
      content: { parcelsCount: 1, totalWeight: 1, contents: contentDesc, package: 'Pachet' },
      payment: { courierServicePayer: 'SENDER' },
    };

    // Calculate dynamic weight...
    // (rest of the weight calculation logic)
    let calculatedWeight = 1;
    if (order.items && order.items.length > 0) {
      let totalW = 0;
      for (const item of order.items) {
        const meta = (item as any).metadata || {};
        const quantity = (item as any).quantity || (item as any).qty || 1;

        const width = parseFloat(meta.width || '0') || 0;
        const height = parseFloat(meta.height || '0') || 0;

        if (width > 0 && height > 0) {
          const slug = (item as any).slug || (item as any).name || '';
          const packingType = determinePackingType(slug, item);
          const params = calculateShippingParams({
            width, height, quantity, type: packingType
          });
          totalW += params.billingWeight;
        } else {
          totalW += (0.5 * quantity);
        }
      }
      if (totalW > 0) calculatedWeight = parseFloat(totalW.toFixed(2));
    }

    // Update shipment weight
    shipment.content.totalWeight = calculatedWeight;

    if (codAmount > 0) {
      shipment.service.additionalServices = { cod: { amount: codAmount, currencyCode: 'RON' } };
    }

    console.log('[emit-awb] Creating shipment for order:', order.orderNo, 'with weight:', calculatedWeight);

    // Create shipment via DPD service
    const created = await createShipment(shipment);
    if ((created as any)?.error || !created?.id) {
      const dpdError = (created as any)?.error;
      const errorMsg = dpdError?.message || dpdError?.context || 'Eroare creare expediție';
      console.error('[emit-awb] DPD Error:', dpdError);
      return NextResponse.json({ 
        ok: false, 
        message: `DPD: ${errorMsg}`, 
        raw: created 
      }, { status: 400 });
    }

    const shipmentId = created.id!;
    const parcels = created.parcels || [];

    // Optional: print label PDF (try to generate label before saving)
    let base64: string | undefined;
    let labelFileName: string | undefined;
    try {
      const r = await printExtended({ paperSize: 'A6', parcels: parcels.map((p: any) => ({ id: p.id })), format: 'pdf' });
      base64 = r.base64;
      if (base64) labelFileName = `DPD_${shipmentId}.pdf`;
    } catch (e) {
      console.warn('[emit-awb] print label failed', (e as any)?.message || e);
    }

    // Save AWB to order, include label if generated
    try {
      const updateData: any = { awbNumber: shipmentId, awbCarrier: 'DPD' };
      if (base64) {
        updateData.awbLabelBase64 = base64;
        updateData.awbLabelFileName = labelFileName;
      }
      await prisma.order.update({ where: { id: order.id }, data: updateData });
      try {
        const { revalidatePath } = await import('next/cache');
        revalidatePath('/admin/orders');
        revalidatePath('/admin/users');
      } catch (re) {
        console.warn('[revalidate] emit-awb failed', (re as any)?.message || re);
      }
    } catch (e) {
      console.error('DB Error saving AWB', (e as any)?.message || e);
    }

    // Email client with AWB and label
    try {
      const trackingUrl = trackingUrlForAwb(shipmentId);
      if (address?.email || (order as any).user?.email) {
        const subject = `AWB DPD ${shipmentId}`;
        const html = `<p>Bună ${address?.nume_prenume || (order as any).user?.name || ''},</p><p>Am emis AWB-ul: <strong>${shipmentId}</strong>.</p><p>Urmărește livrarea: <a href="${trackingUrl}">${trackingUrl}</a></p>`;
        await sendEmail({
          from: process.env.EMAIL_FROM || 'contact@Tablou.net',
          to: address?.email || (order as any).user?.email,
          subject,
          html,
          attachments: base64 ? [{ filename: `DPD_${shipmentId}.pdf`, content: Buffer.from(base64, 'base64') }] : undefined,
        });
      }
    } catch (e) {
      console.warn('[emit-awb] email failed', (e as any)?.message || e);
    }

    const trackingUrl = trackingUrlForAwb(shipmentId);
    return NextResponse.json({ ok: true, shipmentId, awb: String(shipmentId), trackingUrl, hasLabel: !!base64 });
  } catch (e: any) {
    console.error('[API /admin/orders/[id]/emit-awb] Error:', e?.message || e);
    return NextResponse.json({ ok: false, message: 'Eroare internă' }, { status: 500 });
  }
}
