import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Produsele unei comenzi, pentru formularul de retragere (retur partial: clientul alege
// produsele si cantitatile). Raspundem doar daca emailul e cel de pe comanda, ca nimeni sa
// nu poata vedea comenzile altcuiva ghicind numere.
export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => ({}));
    const orderNo = Number(String(body?.orderRef || "").replace(/\D/g, ""));
    const email = String(body?.email || "").trim().toLowerCase();
    if (!orderNo || !email.includes("@")) {
        return NextResponse.json({ error: "Completează numărul comenzii și emailul." }, { status: 400 });
    }
    const order = await prisma.order.findFirst({
        where: { orderNo, type: "order" },
        select: { orderNo: true, createdAt: true, shippingAddress: true, items: { select: { id: true, name: true, quantity: true } } },
    });
    const orderEmail = String((order?.shippingAddress as any)?.email || "").trim().toLowerCase();
    if (!order || !orderEmail || orderEmail !== email) {
        return NextResponse.json({ error: "Nu am găsit o comandă cu acest număr și acest email." }, { status: 404 });
    }
    return NextResponse.json({
        orderNo: order.orderNo,
        date: order.createdAt.toISOString(),
        items: order.items.map((i) => ({ id: i.id, name: i.name, qty: i.quantity })),
    });
}
