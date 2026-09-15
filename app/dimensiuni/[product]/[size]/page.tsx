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

// Paginile se randează la cerere și se păstrează în cache o săptămână: nu au
// nimic dinamic (fără DB), doar calcule din registru și motorul de prețuri.
export const revalidate = 604800;

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
    const neighbors = getNeighborSizes(productId, w, h, 10);
    const popular = getPopularSizes(productId, 8).filter((s) => !(s.w === w && s.h === h));
    const localities = getLocalityLinks(productId, w, h);
    const configuratorHref = `${cfg.url}?w=${w}&h=${h}`;
    const phoneDigits = String(siteConfig.phone || "").replace(/\D/g, "");
    const waNumber = phoneDigits.startsWith("0") ? `4${phoneDigits}` : phoneDigits;

    const jsonLd = [
        {
            "@context": "https://schema.org",
            "@type": "Product",
            name: `${content.productLabel} ${w}x${h} cm`,
            description: content.metaDescription,
            image: cfg.image ? `${BASE_URL}${cfg.image}` : undefined,
            brand: { "@type": "Brand", name: siteConfig.name },
            offers: {
                "@type": "Offer",
                url,
                priceCurrency: "RON",
                price: pricing.fromPrice.toFixed(2),
                availability: "https://schema.org/InStock",
                itemCondition: "https://schema.org/NewCondition",
            },
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
            mainEntity: content.faq.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
        },
    ];

    const sectionBlocks: Record<string, React.ReactNode> = {
        price: (
            <section key="price" className="py-16 border-b border-slate-100">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-3">
                        {content.priceHeading} {content.productLabel.toLowerCase()} {w}×{h} cm
                    </h2>
                    <p className="text-slate-500 mb-8 max-w-3xl">{content.priceIntro}</p>
                    <div className="overflow-x-auto rounded-3xl border border-slate-200">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="text-left px-5 py-4 font-black text-slate-700">Variantă</th>
                                    {pricing.quantities.map((q) => (
                                        <th key={q} className="text-right px-5 py-4 font-black text-slate-700 whitespace-nowrap">{q} buc</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {pricing.variants.map((v) => (
                                    <tr key={v.key} className={`border-t border-slate-100 ${v.recommended ? "bg-emerald-50/40" : ""}`}>
                                        <td className="px-5 py-4 align-top">
                                            <div className="font-bold text-slate-900">{v.label}</div>
                                            {v.note && <div className="text-xs text-slate-500 mt-1">{v.note}</div>}
                                            {v.recommended && <div className="text-[10px] uppercase tracking-widest font-black text-emerald-600 mt-2">recomandat</div>}
                                        </td>
                                        {v.rows.map((row) => (
                                            <td key={row.qty} className="px-5 py-4 text-right align-top whitespace-nowrap">
                                                <div className="font-black text-slate-900">{formatLei(row.unit)}<span className="text-slate-400 font-medium"> / buc</span></div>
                                                <div className="text-xs text-slate-500">{formatLei(row.total)} total</div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <Link
                            href={configuratorHref}
                            className="inline-flex items-center justify-center px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest bg-emerald-600 text-white hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20"
                        >
                            {content.ctaLabel}: {w}×{h} cm
                        </Link>
                        {waNumber && (
                            <a
                                href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Bună ziua, aș dori o ofertă pentru ${content.productLabel.toLowerCase()} ${w}x${h} cm.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest border-2 border-slate-200 bg-white text-slate-900 hover:border-emerald-500 hover:text-emerald-600 transition-all"
                            >
                                Întreabă pe WhatsApp
                            </a>
                        )}
                    </div>
                </div>
            </section>
        ),
        facts: (
            <section key="facts" className="py-16 border-b border-slate-100 bg-slate-50">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-8">Date tehnice pentru {w}×{h} cm</h2>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {content.facts.map((f) => (
                            <div key={f.label} className="bg-white rounded-3xl border border-slate-200 p-6">
                                <dt className="text-[10px] uppercase tracking-widest font-black text-slate-400">{f.label}</dt>
                                <dd className="text-2xl font-black text-slate-900 mt-2">{f.value}</dd>
                                {f.detail && <dd className="text-sm text-slate-500 mt-2 leading-relaxed">{f.detail}</dd>}
                            </div>
                        ))}
                    </dl>
                </div>
            </section>
        ),
        usage: (
            <section key="usage" className="py-16 border-b border-slate-100">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-6">{content.usage.heading}</h2>
                    {content.usage.paragraphs.map((t, i) => (
                        <p key={i} className="text-lg text-slate-600 leading-relaxed mb-5">{t}</p>
                    ))}
                    {cfg.useCases && cfg.useCases.length > 0 && (
                        <ul className="mt-6 flex flex-wrap gap-2">
                            {cfg.useCases.map((u) => (
                                <li key={u} className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">{u}</li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>
        ),
        file: (
            <section key="file" className="py-16 border-b border-slate-100 bg-slate-50">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-6">{content.file.heading}</h2>
                    <ul className="space-y-4">
                        {content.file.items.map((t, i) => (
                            <li key={i} className="flex gap-4 text-slate-600 leading-relaxed">
                                <span className="shrink-0 w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center mt-0.5">{i + 1}</span>
                                <span>{t}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        ),
        mounting: (
            <section key="mounting" className="py-16 border-b border-slate-100">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-6">{content.mounting.heading}</h2>
                    <ul className="space-y-3">
                        {content.mounting.paragraphs.map((t, i) => (
                            <li key={i} className="text-slate-600 leading-relaxed pl-5 border-l-4 border-emerald-500">{t}</li>
                        ))}
                    </ul>
                </div>
            </section>
        ),
        faq: (
            <section key="faq" className="py-16 border-b border-slate-100 bg-slate-50">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-8">Întrebări despre {content.productLabel.toLowerCase()} {w}×{h} cm</h2>
                    <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100">
                        {content.faq.map((f, i) => (
                            <details key={i} className="group px-6 py-5" open={i === 0}>
                                <summary className="cursor-pointer list-none font-bold text-slate-900 text-lg flex justify-between gap-4">
                                    <span>{f.q}</span>
                                    <span className="text-slate-400 group-open:rotate-45 transition-transform text-2xl leading-none">+</span>
                                </summary>
                                <p className="text-slate-600 leading-relaxed mt-3">{f.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>
        ),
        neighbors: (
            <section key="neighbors" className="py-16 border-b border-slate-100">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-3">{content.neighborsHeading}</h2>
                    <p className="text-slate-500 mb-8">Aceeași lățime sau înălțime, un pas mai mică sau mai mare, plus orientarea inversă.</p>
                    <div className="flex flex-wrap gap-3">
                        {neighbors.map((s) => (
                            <Link key={`${s.w}x${s.h}`} href={dimensionUrl(productId, s.w, s.h)} className="px-5 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl text-sm font-black hover:bg-slate-900 hover:text-white transition-all">
                                {s.w}×{s.h} cm
                            </Link>
                        ))}
                    </div>
                    {popular.length > 0 && (
                        <>
                            <h3 className="text-xl font-black text-slate-900 mt-12 mb-4">Cele mai comandate dimensiuni de {content.productLabel.toLowerCase()}</h3>
                            <div className="flex flex-wrap gap-3">
                                {popular.map((s) => (
                                    <Link key={`${s.w}x${s.h}`} href={dimensionUrl(productId, s.w, s.h)} className="px-5 py-3 bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl text-sm font-bold hover:bg-slate-900 hover:text-white transition-all">
                                        {s.w}×{s.h} cm{s.label ? ` · ${s.label}` : ""}
                                    </Link>
                                ))}
                                <Link href={`/dimensiuni/${productId}`} className="px-5 py-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-sm font-black hover:bg-emerald-600 hover:text-white transition-all">
                                    Toate dimensiunile →
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </section>
        ),
        localities: (
            <section key="localities" className="py-16 bg-slate-50">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-3">{content.localitiesHeading}</h2>
                    <p className="text-slate-500 mb-8">{content.productLabel} {w}×{h} cm se livrează prin curier în orice localitate; câteva pagini locale:</p>
                    <div className="flex flex-wrap gap-3">
                        {localities.map((l) => (
                            <Link key={l.href} href={l.href} className="px-5 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl text-sm font-bold hover:bg-slate-900 hover:text-white transition-all">
                                {content.productLabel} în {l.name}
                            </Link>
                        ))}
                        <Link href="/judet" className="px-5 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl text-sm font-bold hover:bg-slate-900 hover:text-white transition-all">
                            Toate județele →
                        </Link>
                    </div>
                </div>
            </section>
        ),
    };

    return (
        <div className="min-h-screen bg-white">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <div className="pt-24 pb-12 border-b border-slate-100">
                <div className="container mx-auto px-6">
                    <nav className="text-[10px] font-black text-slate-400 mb-6 flex flex-wrap gap-3 items-center uppercase tracking-widest">
                        <Link href="/" className="hover:text-emerald-600 transition-colors">Acasă</Link>
                        <span>/</span>
                        <Link href="/dimensiuni" className="hover:text-emerald-600 transition-colors">Dimensiuni</Link>
                        <span>/</span>
                        <Link href={`/dimensiuni/${productId}`} className="hover:text-emerald-600 transition-colors">{content.productLabel}</Link>
                        <span>/</span>
                        <span className="text-slate-900">{w}×{h} cm</span>
                    </nav>
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                        <div className="min-w-0 max-w-3xl">
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tighter">
                                {content.productLabel} <span className="text-emerald-500">{w}×{h} cm</span>
                            </h1>
                            <p className="text-lg text-slate-500 mb-6">{content.subtitle}</p>
                            {content.intro.map((t, i) => (
                                <p key={i} className="text-slate-600 leading-relaxed mb-3">{t}</p>
                            ))}
                        </div>
                        <div className="shrink-0 flex flex-col gap-4 lg:items-end">
                            {cfg.image && (
                                <div className="relative w-full lg:w-72 aspect-[4/3] rounded-3xl overflow-hidden border border-slate-100 bg-slate-50">
                                    <Image src={cfg.image} alt={`${content.productLabel} ${w}x${h} cm`} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 288px" />
                                </div>
                            )}
                            <div className="text-right">
                                <div className="text-[10px] uppercase tracking-widest font-black text-slate-400">de la</div>
                                <div className="text-4xl font-black text-slate-900">{formatLei(pricing.fromPrice)}<span className="text-base text-slate-400 font-medium"> / buc</span></div>
                                <div className="text-xs text-slate-500 mt-1">{pricing.fromLabel}</div>
                            </div>
                            <Link
                                href={configuratorHref}
                                className="inline-flex items-center justify-center px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest bg-emerald-600 text-white hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20"
                            >
                                {content.ctaLabel}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {content.sections.map((id) => sectionBlocks[id] ?? null)}
        </div>
    );
}
