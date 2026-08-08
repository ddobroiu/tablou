import { NextRequest, NextResponse } from 'next/server';
import { fulfillOrder } from '../../../../lib/orderService';
import { getAuthSession } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const orderData = await req.json();
    const referer = req.headers.get('referer') || '';
    let source = orderData.source;
    if (!source) {
      if (referer.includes('visionboard.ro')) source = 'visionboard.ro';
      else if (referer.includes('prynt.ro')) source = 'prynt.ro';
      else if (referer.includes('euprint.ro')) source = 'euprint.ro';
      else if (referer.includes('adbanner.ro')) source = 'adbanner.ro';
      else if (referer.includes('tablou.net')) source = 'tablou.net';
      else if (referer.includes('pliant.net')) source = 'pliant.net';
      else source = 'Tablou.net';
    }

    const session = await getAuthSession();
    const userId = session?.user ? (session.user as any).id : null;

    // Extragem metoda de plată din request (default Ramburs dacă nu e setat)
    const paymentMethod = orderData.paymentMethod || 'Ramburs';

    console.log(`[API /order/create] Placing order. User: ${userId || 'GUEST'}, Method: ${paymentMethod}`);

    if (!orderData?.address || !orderData?.billing || !orderData?.cart) {
      return NextResponse.json({ success: false, message: 'Date de comandă invalide.' }, { status: 400 });
    }

    // Trimitem paymentMethod corect către fulfillOrder
    const { invoiceLink, orderNo } = await fulfillOrder({ ...orderData, userId, source }, paymentMethod);

    return NextResponse.json({
      success: true,
      message: 'Comanda a fost procesată!',
      invoiceLink: invoiceLink ?? null,
      orderNo: orderNo ?? null,
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error: any) {
    console.error('[API /order/create] EROARE:', error?.message || error);
    return NextResponse.json({ success: false, message: 'Eroare internă.' }, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}