"use client";

import Link from "next/link";
import { Package } from "lucide-react";
import AccountOrderCard from "@/components/AccountOrderCard";

interface Order {
    id: string;
    orderNo: number;
    createdAt: string;
    status?: string | null;
    awbNumber?: string | null;
    awbCarrier?: string | null;
    invoiceLink?: string | null;
    total: number;
    itemsCount?: number;
}

export default function AccountOrdersList({ orders }: { orders: Order[] }) {
    if (orders.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-14 text-center">
                <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600"><Package size={22} /></span>
                <h3 className="mt-4 font-semibold text-slate-900">Nu ai încă nicio comandă</h3>
                <p className="mt-1 text-sm text-slate-500">Alege un produs, vezi prețul pe loc și comanzi în câteva minute.</p>
                <Link href="/configuratoare" className="mt-5 inline-flex rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500">
                    Vezi produsele
                </Link>
            </div>
        );
    }
    return (
        <ul className="space-y-3">
            {orders.map((order) => (
                <AccountOrderCard key={order.id} order={order} />
            ))}
        </ul>
    );
}
