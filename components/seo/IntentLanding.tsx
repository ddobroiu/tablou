import React from "react";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/siteConfig";
import { CONFIGURATORS_REGISTRY } from "@/lib/configurators-registry";
import { getIntentSpec, MARKETING_CONTENT } from "@/lib/seo/intentContent";
import { getDimensionPricing, formatLei } from "@/lib/seo/dimensionPricing";
import { getSize, dimensionUrl, isDimensionProduct, getPopularSizes } from "@/lib/seo/dimensionPages";
import { QTY_PRODUCTS, getQtyPricing, qtyUrl } from "@/lib/seo/quantityPages";
import { WhatsAppBar, WhatsAppButton } from "@/components/seo/WhatsAppBar";

/**
 * Pagina de intenție (/configurator/{produs}-{intenție}), randată pe server:
 * text scris pentru situația respectivă (lib/seo/intentContent.ts), prețuri
 * reale pentru mărimile sau tirajele tipice, WhatsApp și configurator.
 * Textul lung stă pliat; nimic din pagină nu e generat prin rotație de cuvinte.
 */
export function IntentLanding({ productId, productName, intent, intentLabel, configHref }: { productId: string; productName: string; intent: string; intentLabel: string; configHref: string }) {
    const cfg = CONFIGURATORS_REGISTRY.find((c) => c.id === productId);
    const spec = getIntentSpec(productId, intent);
    const marketing = MARKETING_CONTENT[intent];
    const title = spec?.title ?? marketing?.title(productName) ?? `${productName} ${intentLabel}`;
    const lead = spec?.lead ?? marketing?.lead(productName) ?? `${productName} pentru ${intentLabel.toLowerCase()}, cu grafica ta, produs în 2-4 zile lucrătoare.`;
    const tips = spec?.tips ?? marketing?.tips ?? [];
    const pick = marketing?.pick ?? "default";

    // Prețuri: mărimi (produse pe dimensiuni) sau tiraje (produse la cantitate)
    type Row = { label: string; href: string; price: number; note: string };
    const rows: Row[] = [];
    const dimProduct = isDimensionProduct(productId) ? productId : null;
    const qtyProduct = QTY_PRODUCTS.find((p) => p.id === productId);
    if (dimProduct) {
        const sizes = (spec?.sizes ?? getPopularSizes(dimProduct, 3).map((s) => [s.w, s.h] as [number, number])).filter(([w, h]) => getSize(dimProduct, w, h));
        for (const [w, h] of sizes) {
            const p = getDimensionPricing(dimProduct, w, h);
            if (!p) continue;
            const variant = pick === "cheapest" ? [...p.variants].sort((a, b) => a.rows[0].unit - b.rows[0].unit)[0] : pick === "premium" ? [...p.variants].sort((a, b) => b.rows[0].unit - a.rows[0].unit)[0] : p.recommended;
            rows.push({ label: `${w}×${h} cm`, href: dimensionUrl(dimProduct, w, h), price: variant.rows[0].unit, note: variant.label });
        }
    } else if (qtyProduct) {
        const format = qtyProduct.formats.find((f) => f.key === spec?.format) ?? qtyProduct.formats[0];
        const qtys = (spec?.qty ?? qtyProduct.quantities.slice(0, 3)).filter((q) => qtyProduct.quantities.includes(q));
        for (const q of qtys) {
            const p = getQtyPricing(qtyProduct, format, q);
            if (!p) continue;
            const variant = pick === "cheapest" ? [...p.variants].sort((a, b) => a.unit - b.unit)[0] : pick === "premium" ? [...p.variants].sort((a, b) => b.unit - a.unit)[0] : p.recommended;
            rows.push({ label: `${q} buc ${qtyProduct.kind === "textil" ? `(${format.short})` : format.short}`, href: qtyUrl(qtyProduct, format, q), price: variant.total, note: `${formatLei(variant.unit)} / buc · ${variant.label}` });
        }
    }
    const from = rows.length ? Math.min(...rows.map((r) => (qtyProduct ? r.price / parseInt(r.label) : r.price))) : null;
    const waMessage = `Bună ziua, aș dori o ofertă pentru ${title.toLowerCase()}.`;
    const image = cfg?.image;

    return (
        <div className="min-h-screen bg-white pb-24 lg:pb-0">
            <div className="pt-24 pb-10 border-b border-slate-100">
                <div className="container mx-auto px-6">
                    <nav className="text-[10px] font-black text-slate-400 mb-5 flex flex-wrap gap-3 items-center uppercase tracking-widest">
                        <Link href="/" className="hover:text-emerald-600 transition-colors">Acasă</Link><span>/</span>
                        <Link href={cfg?.url || "/"} className="hover:text-emerald-600 transition-colors">{productName}</Link><span>/</span>
                        <span className="text-slate-900">{intentLabel}</span>
                    </nav>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        <div className="lg:col-span-7 min-w-0">
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tighter">{title}</h1>
                            <p className="text-lg text-slate-600 leading-relaxed mb-6">{lead}</p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <WhatsAppButton message={waMessage}>Cere ofertă pe WhatsApp</WhatsAppButton>
                                <Link href={configHref} className="inline-flex items-center justify-center px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-700 transition-all">Configurează online</Link>
                            </div>
                            <p className="text-xs text-slate-400 mt-4">Răspundem pe WhatsApp luni-vineri, 09:00-18:00. Producție 2-4 zile lucrătoare, livrare prin curier în toată țara.</p>
                        </div>
                        <div className="lg:col-span-5 flex gap-5 items-center lg:justify-end">
                            {image && <div className="relative w-28 h-28 sm:w-40 sm:h-40 rounded-3xl overflow-hidden border border-slate-100 bg-slate-50 shrink-0"><Image src={image} alt={title} fill className="object-cover" sizes="160px" /></div>}
                            {from !== null && (
                                <div>
                                    <div className="text-[10px] uppercase tracking-widest font-black text-slate-400">de la</div>
                                    <div className="text-4xl sm:text-5xl font-black text-slate-900 leading-none">{formatLei(from)}</div>
                                    <div className="text-xs text-slate-500 mt-2">/ buc, TVA inclus, cu grafica ta</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {rows.length > 0 && (
                <section className="py-12 border-b border-slate-100">
                    <div className="container mx-auto px-6">
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter mb-2">{qtyProduct ? "Tiraje uzuale și prețuri" : "Mărimi uzuale și prețuri"}</h2>
                        <p className="text-sm text-slate-500 mb-6">Calculate cu același motor ca în configurator. Fiecare rând deschide pagina cu toate variantele.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {rows.map((r) => (
                                <Link key={r.href} href={r.href} className="rounded-3xl border border-slate-200 p-5 hover:border-emerald-500 hover:shadow-xl transition-all">
                                    <div className="text-lg font-black text-slate-900">{r.label}</div>
                                    <div className="text-2xl font-black text-emerald-700 mt-2">{formatLei(r.price)}</div>
                                    <div className="text-xs text-slate-500 mt-1">{r.note}</div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {tips.length > 0 && (
                <section className="py-12 border-b border-slate-100 bg-slate-50">
                    <div className="container mx-auto px-6 max-w-4xl">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tighter mb-5">Sfaturi pentru {intentLabel.toLowerCase()}</h2>
                        <ul className="space-y-3">{tips.map((t, i) => <li key={i} className="text-slate-600 leading-relaxed pl-4 border-l-2 border-emerald-500">{t}</li>)}</ul>
                        {cfg?.faq && cfg.faq.length > 0 && (
                            <div className="mt-8 rounded-3xl border border-slate-200 bg-white divide-y divide-slate-100">
                                {cfg.faq.map((f, i) => (
                                    <details key={i} className="group px-6 py-5"><summary className="cursor-pointer list-none font-bold text-slate-900 flex justify-between gap-4"><span>{f.q}</span><span className="text-slate-400 group-open:rotate-45 transition-transform text-2xl leading-none">+</span></summary><p className="text-slate-600 leading-relaxed mt-3">{f.a}</p></details>
                                ))}
                            </div>
                        )}
                        <div className="mt-8 flex flex-col sm:flex-row gap-3">
                            <WhatsAppButton message={waMessage}>Întreabă pe WhatsApp</WhatsAppButton>
                            <Link href={configHref} className="inline-flex items-center justify-center px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest border-2 border-slate-200 bg-white text-slate-900 hover:border-emerald-500 hover:text-emerald-600 transition-all">Configurează online</Link>
                        </div>
                    </div>
                </section>
            )}

            <WhatsAppBar message={waMessage} price={from !== null ? `${formatLei(from)} / buc` : undefined} />
        </div>
    );
}
