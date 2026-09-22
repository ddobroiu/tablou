import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { getQtyProduct, parseQtySlug, getQtyPricing, qtyUrl, getRegistryEntry } from "@/lib/seo/quantityPages";
import { buildQtyContent, brandKeyFromName } from "@/lib/seo/quantityContent";
import { formatLei } from "@/lib/seo/dimensionPricing";
import { getLocalityLinks } from "@/lib/seo/dimensionContent";
import { WhatsAppBar, WhatsAppButton } from "@/components/seo/WhatsAppBar";

export const revalidate = 604800;

type Params = { product: string; slug: string };
const BASE_URL = String(siteConfig.url || "").toLowerCase().replace(/\/$/, "");
const BRAND = brandKeyFromName(siteConfig.name);

function resolve(p: Params) {
    const product = getQtyProduct(String(p.product || "").toLowerCase());
    if (!product) return null;
    const parsed = parseQtySlug(product, p.slug);
    if (!parsed) return null;
    const pricing = getQtyPricing(product, parsed.format, parsed.qty);
    if (!pricing) return null;
    const cfg = getRegistryEntry(product.id);
    const content = buildQtyContent({ brand: BRAND, product, format: parsed.format, qty: parsed.qty, pricing });
    return { product, format: parsed.format, qty: parsed.qty, pricing, cfg, content };
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
    const r = resolve(await params);
    if (!r) return {};
    const url = `${BASE_URL}${qtyUrl(r.product, r.format, r.qty)}`;
    return {
        title: { absolute: r.content.metaTitle },
        description: r.content.metaDescription,
        alternates: { canonical: url },
        openGraph: { title: r.content.metaTitle, description: r.content.metaDescription, url, siteName: siteConfig.name, locale: "ro_RO", type: "website", images: r.cfg?.image ? [{ url: `${BASE_URL}${r.cfg.image}` }] : undefined },
        robots: { index: true, follow: true },
    };
}

export default async function QuantityPage({ params }: { params: Promise<Params> }) {
    const r = resolve(await params);
    if (!r) notFound();
    const { product, format, qty, pricing, cfg, content } = r;
    const url = `${BASE_URL}${qtyUrl(product, format, qty)}`;
    const otherQty = product.quantities.filter((q) => q !== qty);
    const otherFormats = product.formats.filter((f) => f.key !== format.key);
    const localities = getLocalityLinks(product.id, qty, format.wMm ?? 1).slice(0, 6);
    const ctaHref = cfg?.url || `/${product.id}`;
    const waMessage = `Bună ziua, aș dori o ofertă pentru ${content.h1}.`;
    const fmtLabel = product.kind === "textil" ? `cu ${format.short}` : format.short;

    const jsonLd = [
        { "@context": "https://schema.org", "@type": "Product", name: content.h1, description: content.metaDescription, image: cfg?.image ? `${BASE_URL}${cfg.image}` : undefined, brand: { "@type": "Brand", name: siteConfig.name }, offers: { "@type": "Offer", url, priceCurrency: "RON", price: pricing.recommended.total.toFixed(2), availability: "https://schema.org/InStock" } },
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
            { "@type": "ListItem", position: 1, name: "Acasă", item: `${BASE_URL}/` },
            { "@type": "ListItem", position: 2, name: "Prețuri pe cantități", item: `${BASE_URL}/preturi` },
            { "@type": "ListItem", position: 3, name: product.name, item: `${BASE_URL}/preturi/${product.slug}` },
            { "@type": "ListItem", position: 4, name: content.h1 },
        ] },
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: content.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    ];

    return (
        <div className="min-h-screen bg-white pb-24 lg:pb-0">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <div className="pt-24 pb-10 border-b border-slate-100">
                <div className="container mx-auto px-6">
                    <nav className="text-[10px] font-black text-slate-400 mb-5 flex flex-wrap gap-3 items-center uppercase tracking-widest">
                        <Link href="/" className="hover:text-emerald-600 transition-colors">Acasă</Link><span>/</span>
                        <Link href="/preturi" className="hover:text-emerald-600 transition-colors">Prețuri pe cantități</Link><span>/</span>
                        <Link href={`/preturi/${product.slug}`} className="hover:text-emerald-600 transition-colors">{product.name}</Link><span>/</span>
                        <span className="text-slate-900">{content.h1}</span>
                    </nav>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        <div className="lg:col-span-7 min-w-0">
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-3 tracking-tighter">{qty} <span className="text-emerald-500">{product.unit}</span> {fmtLabel}</h1>
                            <p className="text-lg text-slate-500 mb-6">{content.subtitle}</p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <WhatsAppButton message={waMessage}>Cere ofertă pe WhatsApp</WhatsAppButton>
                                <Link href={ctaHref} className="inline-flex items-center justify-center px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-700 transition-all">{content.ctaLabel}</Link>
                            </div>
                            <p className="text-xs text-slate-400 mt-4">Răspundem pe WhatsApp luni-vineri, 09:00-18:00. Producție 2-4 zile lucrătoare, livrare prin curier în toată țara.</p>
                        </div>
                        <div className="lg:col-span-5 flex gap-5 items-center lg:justify-end">
                            {cfg?.image && <div className="relative w-28 h-28 sm:w-40 sm:h-40 rounded-3xl overflow-hidden border border-slate-100 bg-slate-50 shrink-0"><Image src={cfg.image} alt={content.h1} fill className="object-cover" sizes="160px" /></div>}
                            <div>
                                <div className="text-[10px] uppercase tracking-widest font-black text-slate-400">total, {qty} buc</div>
                                <div className="text-4xl sm:text-5xl font-black text-slate-900 leading-none">{formatLei(pricing.recommended.total)}</div>
                                <div className="text-xs text-slate-500 mt-2">{formatLei(pricing.recommended.unit)} / buc · {pricing.recommended.label}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="py-12 border-b border-slate-100">
                <div className="container mx-auto px-6">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter mb-2">{content.priceHeading} {content.h1.toLowerCase()}</h2>
                    <p className="text-sm text-slate-500 mb-6">Calculat cu același motor ca în configurator, cu grafica ta. TVA inclus.</p>
                    <div className="overflow-x-auto rounded-3xl border border-slate-200">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50"><tr><th className="text-left px-5 py-3 font-black text-slate-700">Variantă</th><th className="text-right px-5 py-3 font-black text-slate-700">Pe bucată</th><th className="text-right px-5 py-3 font-black text-slate-700">Total {qty} buc</th></tr></thead>
                            <tbody>
                                {pricing.variants.map((v) => (
                                    <tr key={v.key} className={`border-t border-slate-100 ${v.recommended ? "bg-emerald-50/40" : ""}`}>
                                        <td className="px-5 py-3"><div className="font-bold text-slate-900">{v.label}</div>{v.note && <div className="text-xs text-slate-500 mt-0.5">{v.note}</div>}</td>
                                        <td className="px-5 py-3 text-right font-black text-slate-900 whitespace-nowrap">{formatLei(v.unit)}</td>
                                        <td className="px-5 py-3 text-right font-black text-slate-900 whitespace-nowrap">{formatLei(v.total)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mt-8 mb-3">{content.ladderHeading}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        {pricing.ladder.map((row) => (
                            <Link key={row.qty} href={qtyUrl(product, format, row.qty)} className={`rounded-2xl border p-4 transition-all ${row.qty === qty ? "border-emerald-500 bg-emerald-50/40 shadow" : "border-slate-200 bg-white hover:border-emerald-500"}`}>
                                <div className="text-[10px] uppercase tracking-widest font-black text-slate-400">{row.qty} buc</div>
                                <div className="text-xl font-black text-slate-900 mt-1">{formatLei(row.unit)}<span className="text-xs font-medium text-slate-400"> / buc</span></div>
                                <div className="text-xs text-slate-500 mt-1">{formatLei(row.total)} total</div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-12 border-b border-slate-100 bg-slate-50">
                <div className="container mx-auto px-6">
                    <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {content.facts.map((f) => (
                            <div key={f.label} className="bg-white rounded-2xl border border-slate-200 p-4"><dt className="text-[10px] uppercase tracking-widest font-black text-slate-400">{f.label}</dt><dd className="text-lg font-black text-slate-900 mt-1 leading-tight">{f.value}</dd>{f.detail && <dd className="text-[11px] text-slate-500 mt-1 leading-snug">{f.detail}</dd>}</div>
                        ))}
                    </dl>
                </div>
            </section>

            <section className="py-12 border-b border-slate-100">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="rounded-3xl border border-slate-200 divide-y divide-slate-100">
                        <details className="group px-6 py-5">
                            <summary className="cursor-pointer list-none font-bold text-slate-900 text-lg flex justify-between gap-4"><span>{content.usage.heading}</span><span className="text-slate-400 group-open:rotate-45 transition-transform text-2xl leading-none">+</span></summary>
                            <div className="mt-3 space-y-3">{content.intro.map((t, i) => <p key={`i${i}`} className="text-slate-600 leading-relaxed">{t}</p>)}{content.usage.paragraphs.map((t, i) => <p key={i} className="text-slate-600 leading-relaxed">{t}</p>)}</div>
                        </details>
                        <details className="group px-6 py-5">
                            <summary className="cursor-pointer list-none font-bold text-slate-900 text-lg flex justify-between gap-4"><span>{content.file.heading}</span><span className="text-slate-400 group-open:rotate-45 transition-transform text-2xl leading-none">+</span></summary>
                            <ul className="mt-3 space-y-2">{content.file.items.map((t, i) => <li key={i} className="text-slate-600 leading-relaxed pl-4 border-l-2 border-emerald-500">{t}</li>)}</ul>
                        </details>
                        {content.faq.map((f, i) => (
                            <details key={i} className="group px-6 py-5"><summary className="cursor-pointer list-none font-bold text-slate-900 text-lg flex justify-between gap-4"><span>{f.q}</span><span className="text-slate-400 group-open:rotate-45 transition-transform text-2xl leading-none">+</span></summary><p className="text-slate-600 leading-relaxed mt-3">{f.a}</p></details>
                        ))}
                    </div>
                    <div className="mt-8 flex flex-col sm:flex-row gap-3">
                        <WhatsAppButton message={waMessage}>Întreabă pe WhatsApp</WhatsAppButton>
                        <Link href={ctaHref} className="inline-flex items-center justify-center px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest border-2 border-slate-200 bg-white text-slate-900 hover:border-emerald-500 hover:text-emerald-600 transition-all">{content.ctaLabel}</Link>
                    </div>
                </div>
            </section>

            <section className="py-12 bg-slate-50">
                <div className="container mx-auto px-6">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight mb-3">{content.neighborsHeading}</h2>
                    <div className="flex flex-wrap gap-2 mb-6">
                        {otherQty.map((q) => <Link key={q} href={qtyUrl(product, format, q)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-900 hover:text-white transition-all">{q} {product.unit} {product.kind === "textil" ? "" : format.short}</Link>)}
                        {otherFormats.map((f) => <Link key={f.key} href={qtyUrl(product, f, qty)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-900 hover:text-white transition-all">{qty} {product.unit} {product.kind === "textil" ? `cu ${f.short}` : f.short}</Link>)}
                        <Link href={`/preturi/${product.slug}`} className="px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-black hover:bg-emerald-600 hover:text-white transition-all">Toate prețurile →</Link>
                    </div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight mb-3">{content.localitiesHeading}</h2>
                    <div className="flex flex-wrap gap-2">
                        {localities.map((l) => <Link key={l.href} href={l.href} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-900 hover:text-white transition-all">{product.name} în {l.name}</Link>)}
                        <Link href="/judet" className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-900 hover:text-white transition-all">Toate județele →</Link>
                    </div>
                </div>
            </section>

            <WhatsAppBar message={waMessage} price={formatLei(pricing.recommended.total)} label={`total, ${qty} buc`} />
        </div>
    );
}
