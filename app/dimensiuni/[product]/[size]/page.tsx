import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import {
    getDimProduct,
    getSize,
    parseSizeSlug,
    getNeighborSizes,
    getPopularSizes,
    dimensionUrl,
    isDimensionProduct,
} from "@/lib/seo/dimensionPages";
import { getDimensionPricing, formatLei } from "@/lib/seo/dimensionPricing";
import { buildDimensionContent, brandKeyFromName, getLocalityLinks } from "@/lib/seo/dimensionContent";
import { WhatsAppBar, WhatsAppButton } from "@/components/seo/WhatsAppBar";
import { judetDimensionUrl, isJudetDimSize } from "@/lib/seo/judetDimensionPages";
import { JUDETE_FULL_DATA } from "@/lib/localitati";

// Paginile se randează la cerere și se păstrează în cache o săptămână.
// Vizibil: titlu, preț, WhatsApp, tabel de prețuri, date pe scurt. Textul lung
// (utilizare, fișier, întrebări) stă în secțiuni pliate: rămâne în HTML pentru
// Google, dar nu îngroapă prețul și butonul.
export const revalidate = 604800;

// Fara ISR aici: 8.336 de pagini x ~125 KB ar umple discul serverului (40 GB, ~12 GB liberi).
type Params = { product: string; size: string };

const BASE_URL = String(siteConfig.url || "").toLowerCase().replace(/\/$/, "");
const BRAND = brandKeyFromName(siteConfig.name);

function resolve(params: Params) {
    const productId = String(params.product || "").toLowerCase();
    if (!isDimensionProduct(productId)) return null;
    const parsed = parseSizeSlug(params.size);
    if (!parsed) return null;
    const size = getSize(productId, parsed.w, parsed.h);
    const cfg = getDimProduct(productId);
    if (!size || !cfg) return null;
    const pricing = getDimensionPricing(productId, size.w, size.h);
    if (!pricing) return null;
    const content = buildDimensionContent({ brand: BRAND, productId, size, pricing });
    if (!content) return null;
    return { productId, size, cfg, pricing, content };
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
    const p = await params;
    const r = resolve(p);
    if (!r) return {};
    const url = `${BASE_URL}${dimensionUrl(r.productId, r.size.w, r.size.h)}`;
    return {
        title: { absolute: r.content.metaTitle },
        description: r.content.metaDescription,
        alternates: { canonical: url },
        openGraph: {
            title: r.content.metaTitle,
            description: r.content.metaDescription,
            url,
            siteName: siteConfig.name,
            locale: "ro_RO",
            type: "website",
            images: r.cfg.image ? [{ url: `${BASE_URL}${r.cfg.image}` }] : undefined,
        },
        robots: { index: true, follow: true },
    };
}

export default async function DimensionPage({ params }: { params: Promise<Params> }) {
    const p = await params;
    const r = resolve(p);
    if (!r) notFound();
    const { productId, size, cfg, pricing, content } = r;
    const { w, h } = size;
    const url = `${BASE_URL}${dimensionUrl(productId, w, h)}`;
    const neighbors = getNeighborSizes(productId, w, h, 8);
    const popular = getPopularSizes(productId, 6).filter((s) => !(s.w === w && s.h === h));
    const localities = getLocalityLinks(productId, w, h).slice(0, 6);
    const judete = isJudetDimSize(productId, w, h) ? JUDETE_FULL_DATA.filter((j) => j.slug !== "bucuresti").slice((w + h) % 30, (w + h) % 30 + 8) : [];
    const configuratorHref = `${cfg.url}?w=${w}&h=${h}`;
    const waMessage = `Bună ziua, aș dori o ofertă pentru ${content.productLabel.toLowerCase()} ${w}x${h} cm.`;

    const jsonLd = [
        {
            "@context": "https://schema.org",
            "@type": "Product",
            name: `${content.productLabel} ${w}x${h} cm`,
            description: content.metaDescription,
            image: cfg.image ? `${BASE_URL}${cfg.image}` : undefined,
            brand: { "@type": "Brand", name: siteConfig.name },
            offers: { "@type": "Offer", url, priceCurrency: "RON", price: pricing.fromPrice.toFixed(2), availability: "https://schema.org/InStock", itemCondition: "https://schema.org/NewCondition" },
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "Acasă", item: `${BASE_URL}/` },
                { "@type": "ListItem", position: 2, name: "Dimensiuni", item: `${BASE_URL}/dimensiuni` },
                { "@type": "ListItem", position: 3, name: content.productLabel, item: `${BASE_URL}/dimensiuni/${productId}` },
                { "@type": "ListItem", position: 4, name: `${w}×${h} cm` },
            ],
        },
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: content.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        },
    ];

    return (
        <div className="min-h-screen bg-white pb-24 lg:pb-0">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            {/* Sus: titlu, preț, WhatsApp, configurator */}
            <div className="pt-24 pb-10 border-b border-slate-100">
                <div className="container mx-auto px-6">
                    <nav className="text-[10px] font-black text-slate-400 mb-5 flex flex-wrap gap-3 items-center uppercase tracking-widest">
                        <Link href="/" className="hover:text-emerald-600 transition-colors">Acasă</Link>
                        <span>/</span>
                        <Link href="/dimensiuni" className="hover:text-emerald-600 transition-colors">Dimensiuni</Link>
                        <span>/</span>
                        <Link href={`/dimensiuni/${productId}`} className="hover:text-emerald-600 transition-colors">{content.productLabel}</Link>
                        <span>/</span>
                        <span className="text-slate-900">{w}×{h} cm</span>
                    </nav>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        <div className="lg:col-span-7 min-w-0">
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-3 tracking-tighter">
                                {content.productLabel} <span className="text-emerald-500">{w}×{h} cm</span>
                            </h1>
                            <p className="text-lg text-slate-500 mb-6">{content.subtitle}</p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <WhatsAppButton message={waMessage}>Cere ofertă pe WhatsApp</WhatsAppButton>
                                <Link href={configuratorHref} className="inline-flex items-center justify-center px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-700 transition-all">
                                    {content.ctaLabel}
                                </Link>
                            </div>
                            <p className="text-xs text-slate-400 mt-4">Răspundem pe WhatsApp luni-vineri, 09:00-18:00. Producție {cfg.turnaroundTime}, livrare prin curier în toată țara.</p>
                        </div>
                        <div className="lg:col-span-5 flex gap-5 items-center lg:justify-end">
                            {cfg.image && (
                                <div className="relative w-28 h-28 sm:w-40 sm:h-40 rounded-3xl overflow-hidden border border-slate-100 bg-slate-50 shrink-0">
                                    <Image src={cfg.image} alt={`${content.productLabel} ${w}x${h} cm`} fill className="object-cover" sizes="160px" />
                                </div>
                            )}
                            <div>
                                <div className="text-[10px] uppercase tracking-widest font-black text-slate-400">de la</div>
                                <div className="text-4xl sm:text-5xl font-black text-slate-900 leading-none">{formatLei(pricing.fromPrice)}</div>
                                <div className="text-xs text-slate-500 mt-2">/ buc, TVA inclus · {pricing.fromLabel}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabel de prețuri */}
            <section className="py-12 border-b border-slate-100">
                <div className="container mx-auto px-6">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter mb-2">{content.priceHeading} {content.productLabel.toLowerCase()} {w}×{h} cm</h2>
                    <p className="text-sm text-slate-500 mb-6">Calculat cu același motor ca în configurator, cu grafica ta. TVA inclus.</p>
                    <div className="overflow-x-auto rounded-3xl border border-slate-200">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="text-left px-5 py-3 font-black text-slate-700">Variantă</th>
                                    {pricing.quantities.map((q) => <th key={q} className="text-right px-5 py-3 font-black text-slate-700 whitespace-nowrap">{q} buc</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {pricing.variants.map((v) => (
                                    <tr key={v.key} className={`border-t border-slate-100 ${v.recommended ? "bg-emerald-50/40" : ""}`}>
                                        <td className="px-5 py-3 align-top">
                                            <div className="font-bold text-slate-900">{v.label}</div>
                                            {v.note && <div className="text-xs text-slate-500 mt-0.5">{v.note}</div>}
                                        </td>
                                        {v.rows.map((row) => (
                                            <td key={row.qty} className="px-5 py-3 text-right align-top whitespace-nowrap">
                                                <div className="font-black text-slate-900">{formatLei(row.unit)}<span className="text-slate-400 font-medium"> / buc</span></div>
                                                <div className="text-xs text-slate-500">{formatLei(row.total)} total</div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Date pe scurt */}
            <section className="py-12 border-b border-slate-100 bg-slate-50">
                <div className="container mx-auto px-6">
                    <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {content.facts.map((f) => (
                            <div key={f.label} className="bg-white rounded-2xl border border-slate-200 p-4">
                                <dt className="text-[10px] uppercase tracking-widest font-black text-slate-400">{f.label}</dt>
                                <dd className="text-lg font-black text-slate-900 mt-1 leading-tight">{f.value}</dd>
                                {f.detail && <dd className="text-[11px] text-slate-500 mt-1 leading-snug">{f.detail}</dd>}
                            </div>
                        ))}
                    </dl>
                </div>
            </section>

            {/* Detalii pliate: utilizare, fișier, întrebări */}
            <section className="py-12 border-b border-slate-100">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="rounded-3xl border border-slate-200 divide-y divide-slate-100">
                        <details className="group px-6 py-5">
                            <summary className="cursor-pointer list-none font-bold text-slate-900 text-lg flex justify-between gap-4"><span>{content.usage.heading}</span><span className="text-slate-400 group-open:rotate-45 transition-transform text-2xl leading-none">+</span></summary>
                            <div className="mt-3 space-y-3">
                                {content.intro.map((t, i) => <p key={`i${i}`} className="text-slate-600 leading-relaxed">{t}</p>)}
                                {content.usage.paragraphs.map((t, i) => <p key={i} className="text-slate-600 leading-relaxed">{t}</p>)}
                                {cfg.useCases && cfg.useCases.length > 0 && (
                                    <ul className="flex flex-wrap gap-2 pt-1">{cfg.useCases.map((u) => <li key={u} className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">{u}</li>)}</ul>
                                )}
                            </div>
                        </details>
                        <details className="group px-6 py-5">
                            <summary className="cursor-pointer list-none font-bold text-slate-900 text-lg flex justify-between gap-4"><span>{content.file.heading}</span><span className="text-slate-400 group-open:rotate-45 transition-transform text-2xl leading-none">+</span></summary>
                            <ul className="mt-3 space-y-2">{content.file.items.map((t, i) => <li key={i} className="text-slate-600 leading-relaxed pl-4 border-l-2 border-emerald-500">{t}</li>)}</ul>
                        </details>
                        {content.faq.map((f, i) => (
                            <details key={i} className="group px-6 py-5">
                                <summary className="cursor-pointer list-none font-bold text-slate-900 text-lg flex justify-between gap-4"><span>{f.q}</span><span className="text-slate-400 group-open:rotate-45 transition-transform text-2xl leading-none">+</span></summary>
                                <p className="text-slate-600 leading-relaxed mt-3">{f.a}</p>
                            </details>
                        ))}
                    </div>
                    <div className="mt-8 flex flex-col sm:flex-row gap-3">
                        <WhatsAppButton message={waMessage}>Întreabă pe WhatsApp</WhatsAppButton>
                        <Link href={configuratorHref} className="inline-flex items-center justify-center px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest border-2 border-slate-200 bg-white text-slate-900 hover:border-emerald-500 hover:text-emerald-600 transition-all">{content.ctaLabel}: {w}×{h} cm</Link>
                    </div>
                </div>
            </section>

            {/* Alte dimensiuni + localități, compact */}
            <section className="py-12 bg-slate-50">
                <div className="container mx-auto px-6">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight mb-3">{content.neighborsHeading}</h2>
                    <div className="flex flex-wrap gap-2 mb-6">
                        {neighbors.map((s) => <Link key={`${s.w}x${s.h}`} href={dimensionUrl(productId, s.w, s.h)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-900 hover:text-white transition-all">{s.w}×{s.h} cm</Link>)}
                        {popular.map((s) => <Link key={`p${s.w}x${s.h}`} href={dimensionUrl(productId, s.w, s.h)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-900 hover:text-white transition-all">{s.w}×{s.h} cm{s.label ? ` · ${s.label}` : ""}</Link>)}
                        <Link href={`/dimensiuni/${productId}`} className="px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-black hover:bg-emerald-600 hover:text-white transition-all">Toate dimensiunile →</Link>
                    </div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight mb-3">{content.localitiesHeading}</h2>
                    <div className="flex flex-wrap gap-2">
                        {localities.map((l) => <Link key={l.href} href={l.href} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-900 hover:text-white transition-all">{content.productLabel} în {l.name}</Link>)}
                        <Link href="/judet" className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-900 hover:text-white transition-all">Toate județele →</Link>
                    </div>
                    {judete.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {judete.map((j) => <Link key={j.slug} href={judetDimensionUrl(j.slug, productId, w, h)} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-900 hover:text-white transition-all">{w}×{h} cm în {j.name}</Link>)}
                        </div>
                    )}
                </div>
            </section>

            <WhatsAppBar message={waMessage} price={`${formatLei(pricing.fromPrice)} / buc`} />
        </div>
    );
}
