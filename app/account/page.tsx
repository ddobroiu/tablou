import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AccountClientPage from "./AccountClientPage";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
    const session = await getAuthSession();

    if (!session?.user) {
        return (
            <div className="mx-auto max-w-3xl px-6 py-16 text-center">
                <h1 className="text-2xl font-bold mb-4 text-slate-900">Contul meu</h1>
                <p className="text-gray-500 mb-6">Pentru a accesa istoricul comenzilor, te rugăm să te autentifici.</p>
                <Link href="/login" className="inline-block bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition">
                    Mergi la autentificare
                </Link>
            </div>
        );
    }

    const userId = (session.user as any).id as string;
    const userEmail = session.user.email;

    const whereCondition: any = {
        OR: [
            { userId: userId },
        ],
        // Filtrare strictă pentru a afișa doar comenzile plasate pe acest site (Tablou.net)
        AND: [
            { source: 'Tablou.net' }
        ]
    };

    if (userEmail) {
        // Also match by email in shipping address or potential billing fields if feasible,
        // but in new schema we might just rely on userId or maybe match json fields.
        // Simplifying to userId for now or manual email match.
    }

    try {
        const orderRecords = await prisma.order.findMany({
            where: whereCondition,
            orderBy: { createdAt: "desc" },
            include: { items: true },
            take: 50,
        });

        const orders = orderRecords.map((o) => {
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
            };
        });

        return (
            <div className="container mx-auto px-4 py-8">
                <AccountClientPage orders={orders} />
            </div>
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

