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
    const localities = getLocalityLinks(product.id, qty, format.wMm ?? 1);
    const ctaHref = cfg?.url || `/${product.id}`;
    const phoneDigits = String(siteConfig.phone || "").replace(/\D/g, "");
    const waNumber = phoneDigits.startsWith("0") ? `4${phoneDigits}` : phoneDigits;

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

    const blocks: Record<string, React.ReactNode> = {
        price: (
            <section key="price" className="py-14 border-b border-slate-100">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-3">{content.priceHeading} {content.h1.toLowerCase()}</h2>
                    <p className="text-slate-500 mb-8 max-w-3xl">Prețuri calculate cu același motor ca în configurator, cu grafica ta (fără taxa de design). TVA inclus.</p>
                    <div className="overflow-x-auto rounded-3xl border border-slate-200">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50"><tr><th className="text-left px-5 py-4 font-black text-slate-700">Variantă</th><th className="text-right px-5 py-4 font-black text-slate-700">Pe bucată</th><th className="text-right px-5 py-4 font-black text-slate-700">Total {qty} buc</th></tr></thead>
                            <tbody>
                                {pricing.variants.map((v) => (
                                    <tr key={v.key} className={`border-t border-slate-100 ${v.recommended ? "bg-emerald-50/40" : ""}`}>
                                        <td className="px-5 py-4"><div className="font-bold text-slate-900">{v.label}</div>{v.note && <div className="text-xs text-slate-500 mt-1">{v.note}</div>}{v.recommended && <div className="text-[10px] uppercase tracking-widest font-black text-emerald-600 mt-2">recomandat</div>}</td>
                                        <td className="px-5 py-4 text-right font-black text-slate-900 whitespace-nowrap">{formatLei(v.unit)}</td>
                                        <td className="px-5 py-4 text-right font-black text-slate-900 whitespace-nowrap">{formatLei(v.total)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <Link href={ctaHref} className="inline-flex items-center justify-center px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest bg-emerald-600 text-white hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20">{content.ctaLabel}</Link>
                        {waNumber && <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Bună ziua, aș dori o ofertă pentru ${content.h1}.`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest border-2 border-slate-200 bg-white text-slate-900 hover:border-emerald-500 hover:text-emerald-600 transition-all">Întreabă pe WhatsApp</a>}
                    </div>
                </div>
            </section>
        ),
        ladder: (
            <section key="ladder" className="py-14 border-b border-slate-100 bg-slate-50">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-3">{content.ladderHeading}</h2>
                    <p className="text-slate-500 mb-8">{pricing.recommended.label}, {product.formatLabel.toLowerCase()} {format.short}.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        {pricing.ladder.map((row) => (
                            <Link key={row.qty} href={qtyUrl(product, format, row.qty)} className={`rounded-2xl border p-4 transition-all ${row.qty === qty ? "border-emerald-500 bg-white shadow-lg" : "border-slate-200 bg-white hover:border-emerald-500"}`}>
                                <div className="text-[10px] uppercase tracking-widest font-black text-slate-400">{row.qty} buc</div>
                                <div className="text-xl font-black text-slate-900 mt-1">{formatLei(row.unit)}<span className="text-xs font-medium text-slate-400"> / buc</span></div>
                                <div className="text-xs text-slate-500 mt-1">{formatLei(row.total)} total</div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        ),
        facts: (
            <section key="facts" className="py-14 border-b border-slate-100">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-8">Pe scurt</h2>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {content.facts.map((f) => (
                            <div key={f.label} className="bg-slate-50 rounded-3xl border border-slate-200 p-6"><dt className="text-[10px] uppercase tracking-widest font-black text-slate-400">{f.label}</dt><dd className="text-2xl font-black text-slate-900 mt-2">{f.value}</dd>{f.detail && <dd className="text-sm text-slate-500 mt-2 leading-relaxed">{f.detail}</dd>}</div>
                        ))}
                    </dl>
                </div>
            </section>
        ),
        usage: (
            <section key="usage" className="py-14 border-b border-slate-100 bg-slate-50">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-6">{content.usage.heading}</h2>
                    {content.usage.paragraphs.map((t, i) => <p key={i} className="text-lg text-slate-600 leading-relaxed mb-5">{t}</p>)}
                </div>
            </section>
        ),
        file: (
            <section key="file" className="py-14 border-b border-slate-100">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-6">{content.file.heading}</h2>
                    <ul className="space-y-4">{content.file.items.map((t, i) => <li key={i} className="flex gap-4 text-slate-600 leading-relaxed"><span className="shrink-0 w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center mt-0.5">{i + 1}</span><span>{t}</span></li>)}</ul>
                </div>
            </section>
        ),
        faq: (
            <section key="faq" className="py-14 border-b border-slate-100 bg-slate-50">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-8">Întrebări frecvente</h2>
                    <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100">
                        {content.faq.map((f, i) => (
                            <details key={i} className="group px-6 py-5" open={i === 0}><summary className="cursor-pointer list-none font-bold text-slate-900 text-lg flex justify-between gap-4"><span>{f.q}</span><span className="text-slate-400 group-open:rotate-45 transition-transform text-2xl leading-none">+</span></summary><p className="text-slate-600 leading-relaxed mt-3">{f.a}</p></details>
                        ))}
                    </div>
                </div>
            </section>
        ),
        neighbors: (
            <section key="neighbors" className="py-14 border-b border-slate-100">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-6">{content.neighborsHeading}</h2>
                    <div className="flex flex-wrap gap-3 mb-8">
                        {otherQty.map((q) => <Link key={q} href={qtyUrl(product, format, q)} className="px-5 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl text-sm font-black hover:bg-slate-900 hover:text-white transition-all">{q} {product.unit} {product.kind === "textil" ? "" : format.short}</Link>)}
                    </div>
                    {otherFormats.length > 0 && (
                        <div className="flex flex-wrap gap-3">
                            {otherFormats.map((f) => <Link key={f.key} href={qtyUrl(product, f, qty)} className="px-5 py-3 bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl text-sm font-bold hover:bg-slate-900 hover:text-white transition-all">{qty} {product.unit} {product.kind === "textil" ? `cu ${f.short}` : f.short}</Link>)}
                            <Link href={`/preturi/${product.slug}`} className="px-5 py-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-sm font-black hover:bg-emerald-600 hover:text-white transition-all">Toate prețurile la {product.name.toLowerCase()} →</Link>
                        </div>
                    )}
                </div>
            </section>
        ),
        localities: (
            <section key="localities" className="py-14 bg-slate-50">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-6">{content.localitiesHeading}</h2>
                    <div className="flex flex-wrap gap-3">
                        {localities.map((l) => <Link key={l.href} href={l.href} className="px-5 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl text-sm font-bold hover:bg-slate-900 hover:text-white transition-all">{product.name} în {l.name}</Link>)}
                        <Link href="/judet" className="px-5 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl text-sm font-bold hover:bg-slate-900 hover:text-white transition-all">Toate județele →</Link>
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
                        <Link href="/" className="hover:text-emerald-600 transition-colors">Acasă</Link><span>/</span>
                        <Link href="/preturi" className="hover:text-emerald-600 transition-colors">Prețuri pe cantități</Link><span>/</span>
                        <Link href={`/preturi/${product.slug}`} className="hover:text-emerald-600 transition-colors">{product.name}</Link><span>/</span>
                        <span className="text-slate-900">{content.h1}</span>
                    </nav>
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                        <div className="min-w-0 max-w-3xl">
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tighter">{qty} <span className="text-emerald-500">{product.unit}</span> {product.kind === "textil" ? `cu ${format.short}` : format.short}</h1>
                            <p className="text-lg text-slate-500 mb-6">{content.subtitle}</p>
                            {content.intro.map((t, i) => <p key={i} className="text-slate-600 leading-relaxed mb-3">{t}</p>)}
                        </div>
                        <div className="shrink-0 flex flex-col gap-4 lg:items-end">
                            {cfg?.image && <div className="relative w-full lg:w-72 aspect-[4/3] rounded-3xl overflow-hidden border border-slate-100 bg-slate-50"><Image src={cfg.image} alt={content.h1} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 288px" /></div>}
                            <div className="text-right"><div className="text-[10px] uppercase tracking-widest font-black text-slate-400">total, {qty} buc</div><div className="text-4xl font-black text-slate-900">{formatLei(pricing.recommended.total)}</div><div className="text-xs text-slate-500 mt-1">{formatLei(pricing.recommended.unit)} / buc · {pricing.recommended.label}</div></div>
                            <Link href={ctaHref} className="inline-flex items-center justify-center px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest bg-emerald-600 text-white hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20">{content.ctaLabel}</Link>
                        </div>
                    </div>
                </div>
            </div>
            {content.sections.map((id) => blocks[id] ?? null)}
        </div>
    );
}
