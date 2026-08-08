import { NextRequest, NextResponse } from 'next/server';
import { fulfillOrder } from '@/lib/orderService';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';
import { getEstimatedShippingCost } from '@/lib/shippingUtils';
import {
    FREE_SHIPPING_THRESHOLD,
    computeCheckoutTotal,
    validateCheckoutPaymentMethod,
} from '@/lib/paymentRules';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function forwardToShopprint(payload: any) {
    const url = process.env.SHOPPRINT_ORDER_INGEST_URL;
    const secret = process.env.ORDER_INGEST_SECRET;
    if (!url || !secret) return;

    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 8000);
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${secret}`,
            },
            body: JSON.stringify(payload),
            signal: controller.signal,
        });
        if (!res.ok) {
            const txt = await res.text().catch(() => '');
            console.warn(`[OrderForward] Shopprint ingest failed (${res.status})`, txt);
        }
    } catch (e) {
        console.warn('[OrderForward] Failed forwarding to shopprint:', e);
    } finally {
        clearTimeout(t);
    }
}

export async function POST(req: NextRequest) {
    try {
        const orderData = await req.json();
        const referer = req.headers.get('referer') || '';
        const source = String(
            orderData.source ||
            (referer.includes('visionboard.ro')
                ? 'visionboard.ro'
                : referer.includes('tablou.net')
                    ? 'tablou.net'
                    : referer.includes('euprint.ro')
                        ? 'euprint.ro'
                        : 'tablou.net')
        ).toLowerCase();

        const session = await getAuthSession();
        // @ts-ignore
        const userId = session?.user?.id || null;

        const paymentMethod = orderData.paymentMethod || 'cash_on_delivery';

        if (!orderData?.address || !orderData?.billing || !orderData?.items) {
            return NextResponse.json({ error: 'Date de comandă invalide.' }, { status: 400 });
        }

        const transformedAddress = {
            nume_prenume: [orderData.address.firstName || '', orderData.address.lastName || ''].join(' ').trim() || orderData.address.nume_prenume || '',
            email: orderData.address.email || '',
            telefon: orderData.address.phone || orderData.address.telefon || '',
            judet: orderData.address.county || orderData.address.judet || '',
            localitate: orderData.address.city || orderData.address.localitate || '',
            strada_nr: orderData.address.street || orderData.address.strada_nr || '',
            postCode: orderData.address.postalCode || orderData.address.postCode || '',
        };

        const isBillingCompany = orderData.billing.type === 'company' || orderData.billing.tip_factura === 'persoana_juridica';
        const transformedBilling = {
            tip_factura: isBillingCompany ? ('persoana_juridica' as const) : ('persoana_fizica' as const),
            name: isBillingCompany ? undefined : [orderData.billing.firstName || '', orderData.billing.lastName || ''].join(' ').trim() || orderData.billing.name || '',
            email: orderData.billing.email || transformedAddress.email,
            telefon: orderData.billing.phone || orderData.billing.telefon || transformedAddress.telefon,
            denumire_companie: isBillingCompany ? (orderData.billing.companyName || orderData.billing.denumire_companie || '') : undefined,
            cui: isBillingCompany ? (orderData.billing.cui || '') : undefined,
            reg_com: isBillingCompany ? (orderData.billing.regCom || orderData.billing.reg_com || '') : undefined,
            judet: orderData.billing.county || orderData.billing.judet || transformedAddress.judet,
            localitate: orderData.billing.city || orderData.billing.localitate || transformedAddress.localitate,
            strada_nr: orderData.billing.street || orderData.billing.strada_nr || transformedAddress.strada_nr,
            postCode: orderData.billing.postalCode || orderData.billing.postCode || transformedAddress.postCode,
        };

        orderData.address = transformedAddress;
        orderData.billing = transformedBilling;

        const orderTotal = computeCheckoutTotal(orderData);
        const paymentError = validateCheckoutPaymentMethod(
            paymentMethod,
            orderTotal,
            orderData.address?.country
        );
        if (paymentError) {
            return NextResponse.json({ error: paymentError }, { status: 400 });
        }

        if (paymentMethod === 'card') {
            const { items } = orderData;
            const subtotal = items.reduce((s: number, it: any) => s + (Number(it.unitAmount ?? it.price ?? 0) * Number(it.quantity ?? 1)), 0);
            const costLivrare = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : getEstimatedShippingCost(orderData.address?.country || 'RO', items);

            const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
            const secret = process.env.STRIPE_SECRET_KEY;

            if (!secret) return NextResponse.json({ error: 'STRIPE_SECRET_KEY missing' }, { status: 500 });

            const stripe = new Stripe(secret);

            const session = await stripe.checkout.sessions.create({
                mode: 'payment',
                payment_method_types: ['card'],
                customer_email: transformedAddress.email || undefined,
                line_items: [
                    ...items.map((item: any) => ({
                        price_data: {
                            currency: 'ron',
                            product_data: { name: item.name },
                            unit_amount: Math.round((item.unitAmount || item.price) * 100),
                        },
                        quantity: item.quantity,
                    })),
                    {
                        price_data: {
                            currency: 'ron',
                            product_data: { name: 'Cost Livrare' },
                            unit_amount: Math.round(costLivrare * 100),
                        },
                        quantity: 1,
                    },
                ],
                success_url: `${origin}/checkout/success/stripe?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${origin}/checkout`,
                metadata: {
                    source: source,
                    address_email: transformedAddress.email,
                    name: transformedAddress.nume_prenume,
                    phone: transformedAddress.telefon,
                    userId: userId || '',
                    cart_items: JSON.stringify(items.map((i: any) => ({
                        productId: i.productId || i.id, // Ensure ID is saved
                        name: i.name,
                        quantity: i.quantity,
                        price: i.unitAmount || i.price,
                        options: i.options,
                        dimensions: i.dimensions
                    })).slice(0, 4000)), // Limit just in case
                    marketing: JSON.stringify(orderData.marketing || {}).slice(0, 500)
                }
            });

            // Salvăm datele comenzii ca PendingCheckout pentru a le recupera în Webhook
            await prisma.pendingCheckout.create({
                data: {
                    sessionId: session.id,
                    checkoutData: orderData as any, // Salvăm tot obiectul JSON
                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expiră în 24h
                }
            });

            return NextResponse.json({ url: session.url });
        } else {
            // Ramburs / OP
            try {
                const { invoiceLink, orderNo, orderId } = await fulfillOrder(
                    { ...orderData, userId, cart: orderData.items, source },
                    'Ramburs'
                );

                // Forward către ShopPrint (hub admin)
                await forwardToShopprint({
                    source,
                    paymentType: 'Ramburs',
                    paymentMethod,
                    address: orderData.address,
                    billing: orderData.billing,
                    items: orderData.items,
                    marketing: orderData.marketing,
                });

                return NextResponse.json({
                    success: true,
                    message: 'Comandă plasată!',
                    invoiceLink: invoiceLink ?? null,
                    orderNo: orderNo ?? null,
                    orderId: orderId ?? null,
                });
            } catch (error: any) {
                console.error('Order Error:', error);
                return NextResponse.json({ error: 'Eroare la procesarea comenzii.' }, { status: 500 });
            }
        }
    } catch (error: any) {
        return NextResponse.json({ error: 'Eroare internă.' }, { status: 500 });
    }
}
