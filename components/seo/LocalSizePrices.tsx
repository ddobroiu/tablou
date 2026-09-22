import React from "react";
import Link from "next/link";
import { getPopularSizes, dimensionUrl, isDimensionProduct, getDimProduct } from "@/lib/seo/dimensionPages";
import { getDimensionPricing, formatLei } from "@/lib/seo/dimensionPricing";

/**
 * Prețuri reale pentru mărimile populare ale unui produs, calculate cu motorul
 * configuratorului. Folosit pe paginile de localitate × produs ca omul care
 * ajunge din Google să vadă un preț concret înainte de a deschide
 * configuratorul, nu doar un buton.
 */
export function LocalSizePrices({ productIds, locName }: { productIds: string[]; locName?: string }) {
    const productId = productIds.map((x) => String(x || "").toLowerCase()).find((x) => isDimensionProduct(x));
    if (!productId) return null;
    const cfg = getDimProduct(productId);
    if (!cfg) return null;
    const sizes = getPopularSizes(productId, 6)
        .map((s) => ({ s, pricing: getDimensionPricing(productId, s.w, s.h) }))
        .filter((x) => x.pricing && x.pricing.fromPrice > 0);
    if (sizes.length === 0) return null;
    const cheapest = Math.min(...sizes.map((x) => x.pricing!.fromPrice));

    return (
        <div className="mb-10 rounded-3xl border border-slate-200 bg-white p-5 md:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
                <div>
                    <div className="text-[10px] uppercase tracking-widest font-black text-slate-400">Prețuri calculate, cu grafica ta</div>
                    <div className="text-2xl font-black text-slate-900">
                        de la {formatLei(cheapest)} <span className="text-sm font-medium text-slate-500">/ buc, TVA inclus</span>
                    </div>
                </div>
                <div className="text-xs text-slate-500">{cfg.turnaroundTime}{locName ? `, apoi curier în ${locName}` : ""}</div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {sizes.map(({ s, pricing }) => (
                    <Link
                        key={`${s.w}x${s.h}`}
                        href={dimensionUrl(productId, s.w, s.h)}
                        className="group rounded-2xl border border-slate-200 px-4 py-3 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all"
                    >
                        <div className="text-sm font-black text-slate-900 group-hover:text-emerald-700">{s.w}×{s.h} cm{s.label ? <span className="text-slate-400 font-medium"> · {s.label}</span> : null}</div>
                        <div className="text-xs text-slate-500">de la <span className="font-bold text-slate-700">{formatLei(pricing!.fromPrice)}</span></div>
                    </Link>
                ))}
            </div>
            <div className="mt-3 text-xs text-slate-500">
                Altă mărime? <Link href={`/dimensiuni/${productId}`} className="font-bold text-emerald-700 hover:underline">toate dimensiunile</Link> sau introdu-o direct în configurator.
            </div>
        </div>
    );
}
