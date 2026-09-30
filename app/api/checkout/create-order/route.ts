import { NextRequest, NextResponse } from 'next/server';
import { fulfillOrder } from '@/lib/orderService';
import { optOut } from '@/lib/mail-optout';
import { checkDiscountCode } from '@/lib/discount-server';
import { LEGAL_VERSION } from '@/lib/company';
import { getAuthSession } from '@/lib/auth';
import { clientIp, tiktokCheckoutMetadata } from '@/lib/tiktok-events';
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

export async function POST(req: NextRequest) {
    try {
        const orderData = await req.json();
        // Acordul pentru marketing (din bannerul de cookie-uri, trimis de pagina de checkout): numai cu el
        // trimitem comanda platita catre TikTok Events API (lib/tiktok-events.ts); nu se salveaza in comanda
        const tiktokMarketing = orderData.tiktokConsent === true;
        delete orderData.tiktokConsent;
        // Vizitatorul din tracking-ul propriu (www.shopprint.ro/t.js): leaga comanda de sursa vizitei
        const ptVid = req.cookies.get('_pt_vid')?.value;
        if (ptVid && /^[a-f0-9]{32}$/i.test(ptVid)) orderData.marketing = { ...(orderData.marketing || {}), vid: ptVid.toLowerCase() };
        const referer = req.headers.get('referer') || '';
        const source = String(
            orderData.source ||
            (referer.includes('tablou.net')
                    ? 'tablou.net'
                    : referer.includes('euprint.ro')
                        ? 'euprint.ro'
                        : 'tablou.net')
        ).toLowerCase();
        // Emailuri automate (lib/mail-auto): checkout-ul arată anunțul și căsuța „nu vreau” (Legea 506/2004 art. 12).
        // Doar comenzile din checkout-ul nou (mailOptOut trimis explicit) primesc mailOptIn; refuzul intră în MailOptOut.
        if (typeof orderData.mailOptOut === 'boolean') {
            const refuza = orderData.mailOptOut;
            orderData.marketing = { ...(orderData.marketing || {}), mailOptIn: !refuza };
            if (refuza) void optOut(orderData.address?.email, source, 'checkout').catch(() => {});
        }
        delete orderData.mailOptOut;

        const session = await getAuthSession();
        // @ts-ignore
        const userId = session?.user?.id || null;

        const paymentMethod = orderData.paymentMethod || 'cash_on_delivery';

        // Codul de reducere se verifică aici, pe server; suma trimisă de browser nu contează.
        // Reducerea (doar pe produse) ajunge în Stripe (cupon), în factura Oblio și în totalul comenzii (lib/orderService.ts).
        const rawDiscountCode = typeof orderData.discountCode === 'string' ? orderData.discountCode.trim() : '';
        delete orderData.discountCode;
        delete orderData.discountAmount;
        delete orderData.discount;
        if (rawDiscountCode) {
            const productsSubtotal = (orderData.items || []).reduce(
                (s: number, it: any) => s + Number(it.unitAmount ?? it.price ?? 0) * Number(it.quantity ?? 1),
                0
            );
            const chk = await checkDiscountCode(rawDiscountCode, productsSubtotal);
            if (!chk.ok) return NextResponse.json({ error: chk.error }, { status: 400 });
            orderData.discount = { code: chk.code, amount: chk.amount };
            orderData.marketing = { ...(orderData.marketing || {}), discount: orderData.discount };
        }

        if (!orderData?.address || !orderData?.billing || !orderData?.items) {
            return NextResponse.json({ error: 'Date de comandă invalide.' }, { status: 400 });
        }

        // Acceptarea Termenilor și a Politicii de confidențialitate este obligatorie; o datăm pe server.
        if (orderData.acceptTerms !== true) {
            return NextResponse.json({ error: 'Trebuie să accepți Termenii și condițiile și Politica de confidențialitate.' }, { status: 400 });
        }
        orderData.termsAcceptedAt = new Date().toISOString();
        orderData.termsVersion = LEGAL_VERSION;

        const transformedAddress = {
            nume_prenume: [orderData.address.firstName || '', orderData.address.lastName || ''].join(' ').trim() || orderData.address.nume_prenume || '',
            email: orderData.address.email || '',
            telefon: orderData.address.phone || orderData.address.telefon || '',
            judet: orderData.address.county || orderData.address.judet || '',
            localitate: orderData.address.city || orderData.address.localitate || '',
            strada_nr: orderData.address.street || orderData.address.strada_nr || '',
            postCode: orderData.address.postalCode || orderData.address.postCode || '',
            country: orderData.address.country || 'RO',
            // Livrare la locker / punct DPD ales in checkout
            ...(orderData.address.deliveryType === 'dpd_point' && Number(orderData.address.dpdOfficeId) > 0 && {
                deliveryType: 'dpd_point',
                dpdOfficeId: Number(orderData.address.dpdOfficeId),
                dpdOfficeName: String(orderData.address.dpdOfficeName || '').slice(0, 120),
            }),
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
            // Reducerea validată mai sus: cupon Stripe de unică folosință cu suma exactă
            let stripeDiscounts: { coupon: string }[] | undefined;
            if (orderData.discount?.amount > 0) {
                const coupon = await stripe.coupons.create({
                    amount_off: Math.round(orderData.discount.amount * 100),
                    currency: 'ron',
                    duration: 'once',
                    max_redemptions: 1,
                    name: `Reducere ${orderData.discount.code}`.slice(0, 40),
                    metadata: { group: 'print', code: orderData.discount.code },
                });
                stripeDiscounts = [{ coupon: coupon.id }];
            }

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
                ...(stripeDiscounts ? { discounts: stripeDiscounts } : {}),
                success_url: `${origin}/checkout/success/stripe?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${origin}/checkout`,
                // Tagged on the payment too: the Stripe account is shared by several sites
                payment_intent_data: { metadata: { group: 'print', project: 'tablou', source } },
                metadata: {
                    source: source,
                    group: 'print',
                    project: 'tablou',
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
                    marketing: JSON.stringify(orderData.marketing || {}).slice(0, 500),
                    // TikTok Events API: acord + _ttp/ttclid/IP/browser, numai cu acord pentru marketing (altfel gol)
                    ...tiktokCheckoutMetadata({
                        marketing: tiktokMarketing,
                        ttp: req.cookies.get('_ttp')?.value,
                        ttclid: req.cookies.get('tt_ttclid')?.value,
                        ip: clientIp(req.headers),
                        userAgent: req.headers.get('user-agent'),
                    }),
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
            const paymentType = paymentMethod === 'bank_transfer' ? 'OP' : 'Ramburs';
            try {
                const { invoiceLink, orderNo, orderId } = await fulfillOrder(
                    { ...orderData, userId, cart: orderData.items, source },
                    paymentType
                );


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
