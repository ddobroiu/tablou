import { prisma } from './prisma';

export interface Address {
    nume_prenume: string;
    email: string;
    telefon: string;
    judet: string;
    localitate: string;
    strada_nr: string;
    postCode?: string;
    bloc?: string;
    scara?: string;
    etaj?: string;
    ap?: string;
    interfon?: string;
    country?: string;
}

export interface Billing {
    tip_factura: 'persoana_fizica' | 'companie' | 'persoana_juridica';
    cui?: string;
    reg_com?: string;
    denumire_companie?: string;
    name?: string;
    email?: string;
    telefon?: string;
    judet?: string;
    localitate?: string;
    strada_nr?: string;
    country?: string;
}

export interface StoredOrderItem {
    name: string;
    qty: number;
    unit: number;
    total: number;
    artworkUrl?: string | null;
    metadata?: any;
}

export interface StoredOrder {
    id: string;
    orderNo: number;
    status: string;
    paymentMethod: string;
    total: number;
    shippingFee: number;
    invoiceLink?: string | null;
    address: Address;
    billing: Billing;
    items: StoredOrderItem[];
    stripeSessionId?: string | null;
    marketing?: any;
    createdAt: Date;
    updatedAt: Date;
    userId?: string | null;
    awbNumber?: string | null;
    awbCarrier?: string | null;
    source?: string | null;
}

export interface MarketingInfo {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmContent?: string;
    utmTerm?: string;
    gclid?: string;
    fbclid?: string;
    referrer?: string;
    landingPage?: string;
    userAgent?: string;
}

function mapDatabaseOrder(r: any): StoredOrder | null {
    if (!r) return null;

    let shippingAddress: Address = {} as Address;
    try {
        shippingAddress = (typeof r.shippingAddress === 'string' ? JSON.parse(r.shippingAddress) : (r.shippingAddress || {})) as Address;
    } catch (e) {
        console.error(`[OrderStore] Error parsing shippingAddress for order ${r.id}:`, e);
    }

    let billingAddress: Billing = {} as Billing;
    try {
        billingAddress = (typeof r.billingAddress === 'string' ? JSON.parse(r.billingAddress) : (r.billingAddress || {})) as Billing;
    } catch (e) {
        console.error(`[OrderStore] Error parsing billingAddress for order ${r.id}:`, e);
    }

    return {
        id: r.id,
        orderNo: r.orderNo,
        status: r.status,
        paymentMethod: r.paymentMethod,
        total: Number(r.totalAmount || 0),
        shippingFee: Number(r.shippingFee || 0),
        invoiceLink: r.invoiceUrl,
        address: shippingAddress,
        billing: billingAddress,
        items: (r.items || []).map((it: any) => ({
            name: it.name,
            qty: it.quantity,
            unit: Number(it.price || 0),
            total: Number(it.total || 0),
            artworkUrl: it.artworkUrl,
            metadata: it.metadata as any
        })),
        stripeSessionId: r.stripeSessionId,
        marketing: r.marketing,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        userId: r.userId,
        awbNumber: r.awbNumber,
        awbCarrier: r.awbCarrier,
        source: r.source
    };
}

export async function appendOrder(data: {
    paymentType: 'Ramburs' | 'OP' | 'Card';
    address: Address;
    billing: Billing;
    items: { name: string; qty: number; unit: number; total: number; artworkUrl?: string | null; metadata?: any }[];
    shippingFee: number;
    total: number;
    invoiceLink?: string | null;
    marketing?: MarketingInfo;
    userId?: string | null;
    stripeSessionId?: string;
    source?: string;
}): Promise<StoredOrder> {
    const { address, billing, items, shippingFee, total, paymentType, invoiceLink, marketing, userId, stripeSessionId, source } = data;

    try {
        const saved = await prisma.order.create({
            data: {
                userId: userId || undefined,
                status: 'pending',
                paymentMethod: paymentType,
                stripeSessionId: stripeSessionId || undefined,
                totalAmount: total,
                shippingFee,
                invoiceUrl: invoiceLink || undefined,
                shippingAddress: address as any,
                billingAddress: billing as any,
                marketing: marketing as any,
                source: source || 'Tablou.net',
                items: {
                    create: items.map((it) => ({
                        name: it.name,
                        quantity: it.qty,
                        price: it.unit,
                        total: it.total,
                        artworkUrl: it.artworkUrl || undefined,
                        metadata: it.metadata || {},
                    })),
                },
            },
            include: {
                items: true,
            },
        });

        return mapDatabaseOrder(saved)!;
    } catch (error) {
        console.error('[OrderStore] Eroare salvare comandă în DB:', error);
        throw error;
    }
}

export async function getOrderById(id: string): Promise<StoredOrder | null> {
    const r = await prisma.order.findUnique({
        where: { id },
        include: { items: true },
    });
    return mapDatabaseOrder(r);
}

export const getOrder = getOrderById;

export async function listOrders(limit = 200): Promise<StoredOrder[]> {
    try {
        const recs = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: { items: true },
        });
        return recs.map(r => mapDatabaseOrder(r)).filter(Boolean) as StoredOrder[];
    } catch (error) {
        console.error('[OrderStore] Error in listOrders:', error);
        return [];
    }
}

export async function listOffers(limit = 100): Promise<StoredOrder[]> {
    try {
        const recs = await prisma.order.findMany({
            where: { type: "offer" },
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: { items: true },
        });
        return recs.map(r => mapDatabaseOrder(r)).filter(Boolean) as StoredOrder[];
    } catch (error) {
        console.error('[OrderStore] Error in listOffers:', error);
        return [];
    }
}

export async function getOrdersByUserId(userId: string): Promise<StoredOrder[]> {
    const recs = await prisma.order.findMany({
        where: { userId },
        include: { items: true },
        orderBy: { createdAt: 'desc' },
    });
    return recs.map(r => mapDatabaseOrder(r)!);
}

export async function getOrderNoByStripeSession(sessionId: string): Promise<number | undefined> {
    try {
        const order = await prisma.order.findUnique({
            where: { stripeSessionId: sessionId },
            select: { orderNo: true }
        });
        return order?.orderNo;
    } catch {
        return undefined;
    }
}
