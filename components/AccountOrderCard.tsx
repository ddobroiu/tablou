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
    // Starea coletului de la DPD (vezi lib/dpdTracking.ts)
    delivery?: { state: string; text: string; at: string | null } | null;
}

function trackingUrl(awb: string | null | undefined, carrier: string | null | undefined): string | null {
    if (!awb || awb === "0") return null;
    const a = encodeURIComponent(awb);
    const c = (carrier || "").toLowerCase();
    if (c.includes("fan")) return `https://www.fancourier.ro/awb-tracking/?awb=${a}`;
    if (c.includes("sameday")) return `https://sameday.ro/awb-tracking/?awb=${a}`;
    return `https://tracking.dpd.ro/?shipmentNumber=${a}&language=ro`;
}

// Etapele comenzii: plasata -> in lucru -> expediata (are AWB) -> livrata
function stepOf(o: Order) {
    if (o.delivery?.state === "livrat") return 3;
    if (o.status === "fulfilled" && !o.awbNumber) return 3;
    if (o.awbNumber && o.awbNumber !== "0") return 2;
    if (o.status === "active" || o.status === "processing" || o.status === "in_progress") return 1;
    return 0;
}
const STEPS = ["Plasată", "În lucru", "Expediată", "Livrată"];

// Ce ii spunem clientului despre colet, pe scurt
const DELIVERY_LABEL: Record<string, { label: string; tone: string }> = {
    inregistrat: { label: "Coletul e pregătit, așteaptă curierul", tone: "bg-slate-50 text-slate-700" },
    nepreluat: { label: "Coletul e pregătit, așteaptă curierul", tone: "bg-slate-50 text-slate-700" },
    tranzit: { label: "Coletul e pe drum", tone: "bg-sky-50 text-sky-900" },
    in_livrare: { label: "Curierul îl aduce azi", tone: "bg-indigo-50 text-indigo-900" },
    livrat: { label: "Coletul a fost livrat", tone: "bg-emerald-50 text-emerald-900" },
    problema: { label: "Curierul nu a putut livra: te va contacta", tone: "bg-amber-50 text-amber-900" },
    retur: { label: "Coletul se întoarce la noi", tone: "bg-rose-50 text-rose-900" },
};

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

            {awbUrl && !canceled && (() => {
                const d = DELIVERY_LABEL[order.delivery?.state ?? ""] ?? { label: "Coletul a fost predat curierului", tone: "bg-emerald-50 text-emerald-900" };
                const when = order.delivery?.at
                    ? new Date(order.delivery.at).toLocaleString("ro-RO", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Bucharest" })
                    : null;
                return (
                    <a href={awbUrl} target="_blank" rel="noopener noreferrer" className={`mt-4 block rounded-xl px-4 py-3 text-sm hover:brightness-95 ${d.tone}`}>
                        <span className="flex items-center justify-between gap-3">
                            <span className="inline-flex items-center gap-2 font-semibold"><Truck size={16} /> {d.label}</span>
                            <span className="shrink-0 font-semibold">Urmărește →</span>
                        </span>
                        <span className="mt-1 block text-xs opacity-80">
                            {order.delivery?.text ?? "Detaliile apar pe pagina DPD."}{when ? ` · ${when}` : ""} · AWB <span className="font-mono">{order.awbNumber}</span>
                        </span>
                    </a>
                );
            })()}

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
