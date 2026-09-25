import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AccountClientPage from "./AccountClientPage";
import { trackAwbs } from "@/lib/dpdTracking";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
    const session = await getAuthSession();

    if (!session?.user) {
        return (
            <div className="min-h-[70vh] bg-slate-50 px-4 pb-16 pt-28">
                <div className="mx-auto max-w-md rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
                    <h1 className="text-2xl font-bold text-slate-900">Contul meu</h1>
                    <p className="mt-2 text-slate-500">Intră în cont ca să vezi comenzile, facturile și unde e coletul.</p>
                    <Link href="/login" className="mt-6 inline-flex w-full justify-center rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-500">
                        Intră în cont
                    </Link>
                </div>
            </div>
        );
    }

    const userId = (session.user as any).id as string;
    const userEmail = session.user.email;

    // Comenzile clientului de pe acest site: cele facute din cont si, daca emailul contului e
    // verificat (ex. autentificare Google), si cele plasate fara cont cu acelasi email.
    // Fara verificare nu legam dupa email: altfel oricine si-ar face cont cu emailul altcuiva.
    const account = await prisma.user.findUnique({ where: { id: userId }, select: { emailVerified: true } });
    const emails = userEmail && account?.emailVerified ? [...new Set([userEmail, userEmail.toLowerCase()])] : [];
    const whereCondition: any = {
        source: { equals: 'tablou.net', mode: 'insensitive' },
        type: 'order',
        OR: [
            { userId },
            ...emails.map((email) => ({ shippingAddress: { path: ['email'], equals: email } })),
        ],
    };

    try {
        const orderRecords = await prisma.order.findMany({
            where: whereCondition,
            orderBy: { createdAt: "desc" },
            include: { items: true },
            take: 50,
        });

        // Starea coletelor, direct de la DPD (doar comenzile clientului care au AWB)
        const tracks = await trackAwbs(
            orderRecords.map((o) => (o.awbNumber && o.awbNumber !== '0' ? String(o.awbNumber) : '')).filter(Boolean),
        ).catch(() => new Map());

        const orders = orderRecords.map((o) => {
            const t = o.awbNumber ? tracks.get(String(o.awbNumber)) : undefined;
            // Map Prisma Order to frontend Order interface
            const items = (o.items || []).map((it) => ({
                name: it.name,
                qty: it.quantity,
                unit: Number(it.price),
                total: Number(it.price) * it.quantity,
            }));

            return {
                id: o.id,
                orderNo: Number(o.orderNo),
                createdAt: o.createdAt.toISOString(),
                status: o.status,
                canceledAt: o.canceledAt ? o.canceledAt.toISOString() : null,
                total: Number(o.totalAmount),
                paymentType: o.paymentMethod,
                items,
                itemsCount: items.length,
                awbNumber: o.awbNumber ? String(o.awbNumber) : null,
                awbCarrier: o.awbCarrier || null,
                invoiceLink: o.invoiceUrl || null,
                shippingFee: Number(o.shippingFee ?? 0),
                delivery: t ? { state: t.state, text: t.text, at: t.at } : null,
            };
        });

        return (
            <AccountClientPage orders={orders} />
        );

    } catch (error) {
        console.error("Eroare la preluarea comenzilor:", error);
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    Nu s-au putut încărca comenzile momentan. Te rugăm să încerci mai târziu.
                </div>
            </div>
        );
    }
}

