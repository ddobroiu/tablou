"use client";

import Link from "next/link";
import { Check, FileText, Truck, Upload } from "lucide-react";
import OrderDetails from "@/components/OrderDetails";
import ReorderButton from "@/components/ReorderButton";

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

function trackingUrl(awb: string | null | undefined, carrier: string | null | undefined): string | null {
    if (!awb || awb === "0") return null;
    const a = encodeURIComponent(awb);
    const c = (carrier || "").toLowerCase();
    if (c.includes("fan")) return `https://www.fancourier.ro/awb-tracking/?awb=${a}`;
    if (c.includes("sameday")) return `https://sameday.ro/awb-tracking/?awb=${a}`;
    return `https://tracking.dpd.ro/?shipmentNumber=${a}&language=ro`;
}

// Etapele comenzii: plasata -> in lucru -> expediata (are AWB) -> finalizata
function stepOf(o: Order) {
    if (o.status === "fulfilled") return 3;
    if (o.awbNumber && o.awbNumber !== "0") return 2;
    if (o.status === "active" || o.status === "processing" || o.status === "in_progress") return 1;
    return 0;
}
const STEPS = ["Plasată", "În lucru", "Expediată", "Finalizată"];

export default function AccountOrderCard({ order }: { order: Order }) {
    const canceled = order.status === "canceled";
    const step = stepOf(order);
    const awbUrl = trackingUrl(order.awbNumber, order.awbCarrier);
    const date = new Date(order.createdAt).toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" });
    const total = new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON" }).format(order.total);

    return (
        <li className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <p className="font-semibold text-slate-900">Comanda #{order.orderNo}</p>
                    <p className="text-sm text-slate-500">
                        {date}{order.itemsCount ? ` · ${order.itemsCount} ${order.itemsCount === 1 ? "produs" : "produse"}` : ""}
                    </p>
                </div>
                <p className="text-lg font-bold tabular-nums text-slate-900">{total}</p>
            </div>

            {/* Unde e comanda */}
            {canceled ? (
                <p className="mt-4 inline-flex rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">Comandă anulată</p>
            ) : (
                <ol className="mt-4 grid grid-cols-4 gap-1" aria-label="Stadiul comenzii">
                    {STEPS.map((s, i) => (
                        <li key={s} className="min-w-0">
                            <span className={`block h-1.5 rounded-full ${i <= step ? "bg-emerald-500" : "bg-slate-200"}`} />
                            <span className={`mt-1.5 flex items-center gap-1 truncate text-[11px] sm:text-xs ${i === step ? "font-semibold text-slate-900" : i < step ? "text-emerald-700" : "text-slate-400"}`}>
                                {i < step && <Check size={12} className="shrink-0" />} {s}
                            </span>
                        </li>
                    ))}
                </ol>
            )}

            {awbUrl && !canceled && (
                <a href={awbUrl} target="_blank" rel="noopener noreferrer"
                    className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900 hover:bg-emerald-100">
                    <span className="inline-flex items-center gap-2"><Truck size={16} /> Coletul e pe drum · AWB <b className="font-mono">{order.awbNumber}</b></span>
                    <span className="font-semibold">Urmărește →</span>
                </a>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
                <OrderDetails order={order} />
                <ReorderButton orderId={order.id} variant="secondary" />
                {order.invoiceLink && (
                    <a href={order.invoiceLink} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                        <FileText size={15} /> Factura
                    </a>
                )}
                <Link href={`/account/orders/${order.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    <Upload size={15} /> Grafica
                </Link>
                <Link href={`/retragere-contract?order=${encodeURIComponent(String(order.orderNo))}`}
                    className="ml-auto text-xs text-slate-400 hover:text-slate-600 hover:underline">
                    Retragere din contract
                </Link>
            </div>
        </li>
    );
}
