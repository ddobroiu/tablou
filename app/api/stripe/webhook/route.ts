import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { fulfillOrder } from '../../../../lib/orderService';
import { mapStripeSessionToOrder } from '../../../../lib/orderStore';
import { prisma } from '../../../../lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Do not create Stripe client at module load; build may not provide env

export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature') || '';
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('[Stripe Webhook] Missing STRIPE_WEBHOOK_SECRET');
    return NextResponse.json({ error: 'Missing webhook secret' }, { status: 500 });
  }
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    console.error('[Stripe Webhook] Missing STRIPE_SECRET_KEY');
    return NextResponse.json({ error: 'Missing Stripe secret key' }, { status: 500 });
  }
  const stripe = new Stripe(secret);

  let event: Stripe.Event;
  try {
    const buf = Buffer.from(await req.arrayBuffer());
    event = stripe.webhooks.constructEvent(buf, signature, webhookSecret);
  } catch (err: any) {
    console.error('[Stripe Webhook] Signature verify failed:', err?.message || err);
    return NextResponse.json({ error: `Webhook Error: ${err?.message || 'invalid signature'}` }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      // FILTRARE DUPĂ SURSĂ
      if (session.metadata?.source !== 'tablou.net') {
        console.log(`[Tablou Webhook] Ignored event for source: ${session.metadata?.source || 'unknown'}`);
        return NextResponse.json({ received: true, ignored: true });
      }

      if (!session.metadata) {
        console.error('[Stripe Webhook] Metadata lipsă pe session');
        return NextResponse.json({ received: true, warning: 'metadata-missing' });
      }

      let orderData;

      // Încercăm să găsim datele complete în DB (PendingCheckout)
      try {
        const pending = await prisma.pendingCheckout.findUnique({
          where: { sessionId: session.id },
        });

        if (pending && pending.checkoutData) {
          orderData = pending.checkoutData as any;

          // Dacă am găsit, ștergem datele temporare
          await prisma.pendingCheckout.delete({ where: { id: pending.id } }).catch(() => { });
        }
      } catch (dbErr: any) {
        console.error('[Stripe Webhook] Eroare citire pending checkout:', dbErr);
      }

      // Fallback la metadata (dacă există date parțiale)
      if (!orderData) {
        console.warn('[Tablou Webhook] PendingCheckout not found, falling back to metadata.');
        orderData = {
          cart: session.metadata.cart_items ? JSON.parse(session.metadata.cart_items) : [], // Adaptat la ce am pus în create-session
          address: { email: session.metadata.address_email }, // Metadata e foarte limitat acum
          billing: {},
          marketing: session.metadata.marketing ? JSON.parse(session.metadata.marketing) : undefined,
        };
      }

      // NU aruncăm dacă Oblio pică – comanda merge oricum
      const result = await fulfillOrder(orderData, 'Card');
      try {
        if (result?.orderNo && result?.orderId && session.id) {
          await mapStripeSessionToOrder(session.id, result.orderId, result.orderNo);
        }
      } catch (e) {
        console.warn('[Stripe Webhook] session->order map failed:', (e as any)?.message || e);
      }
    }
  } catch (err: any) {
    console.error('[Stripe Webhook] Handler error:', err?.message || err);
  }

  return NextResponse.json({ received: true });
}