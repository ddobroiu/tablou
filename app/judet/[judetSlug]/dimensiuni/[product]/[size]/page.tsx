import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { getJudetBySlug } from "@/lib/localitati";
import { getJudetProfile } from "@/lib/seo/judetProfiles";
import { getDimProduct, getSize, parseSizeSlug, dimensionUrl } from "@/lib/seo/dimensionPages";
import { getDimensionPricing, formatLei } from "@/lib/seo/dimensionPricing";
import { buildDimensionContent, brandKeyFromName } from "@/lib/seo/dimensionContent";
import { isJudetDimSize, getTopSizes, judetDimensionUrl, JUDET_DIM_PRODUCTS } from "@/lib/seo/judetDimensionPages";
import { getTargetLocalitiesForJudet } from "@/lib/seo/targetLocalities";
import { WhatsAppBar, WhatsAppButton } from "@/components/seo/WhatsAppBar";

export const revalidate = 604800;

export const dynamicParams = true;
// Paginile se randează la cerere și rămân în cache (ISR) până la revalidate.
export function generateStaticParams() {
    return [];
}
type Params = { judetSlug: string; product: string; size: string };
const BASE_URL = String(siteConfig.url || "").toLowerCase().replace(/\/$/, "");
const BRAND = brandKeyFromName(siteConfig.name);

const TIER_TEXT: Record<string, string> = {
    apropiat: "livrăm prin curier, județul fiind aproape de atelierul nostru din județul Buzău",
    mediu: "livrăm prin curier în toată țara, inclusiv în toate localitățile județului",
    distant: "livrăm prin curier în toată țara, inclusiv în toate localitățile județului",
};

function resolve(p: Params) {
    const judet = getJudetBySlug(String(p.judetSlug || "").toLowerCase());
    const productId = String(p.product || "").toLowerCase();
    const parsed = parseSizeSlug(p.size);
    if (!judet || !parsed || !isJudetDimSize(productId, parsed.w, parsed.h)) return null;
    const size = getSize(productId, parsed.w, parsed.h);
    const cfg = getDimProduct(productId);
    if (!size || !cfg) return null;
    const pricing = getDimensionPricing(productId, size.w, size.h);
    if (!pricing) return null;
    const content = buildDimensionContent({ brand: BRAND, productId, size, pricing });
    if (!content) return null;
    return { judet, productId, size, cfg, pricing, content, profile: getJudetProfile(judet.slug) };
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
    const r = resolve(await params);
    if (!r) return {};
    const { judet, productId, size, pricing, content } = r;
    const url = `${BASE_URL}${judetDimensionUrl(judet.slug, productId, size.w, size.h)}`;
    const title = `${content.productLabel} ${size.w}x${size.h} cm în ${judet.name} – de la ${formatLei(pricing.fromPrice)} | ${siteConfig.name}`;
    const description = `${content.productLabel} ${size.w}x${size.h} cm livrat în județul ${judet.name}: de la ${formatLei(pricing.fromPrice)}/buc, ${formatLei(pricing.recommended.rows[pricing.recommended.rows.length - 1].unit)}/buc la ${pricing.recommended.rows[pricing.recommended.rows.length - 1].qty} buc. Producție 2-4 zile lucrătoare, apoi curier.`.slice(0, 158);
    return { title: { absolute: title }, description, alternates: { canonical: url }, openGraph: { title, description, url, siteName: siteConfig.name, locale: "ro_RO", type: "website" }, robots: { index: true, follow: true } };
}

export default async function JudetDimensionPage({ params }: { params: Promise<Params> }) {
    const r = resolve(await params);
    if (!r) notFound();
    const { judet, productId, size, cfg, pricing, content, profile } = r;
    const { w, h } = size;
    const url = `${BASE_URL}${judetDimensionUrl(judet.slug, productId, w, h)}`;
    const waMessage = `Bună ziua, aș dori o ofertă pentru ${content.productLabel.toLowerCase()} ${w}x${h} cm, livrat în județul ${judet.name}.`;
    const otherSizes = getTopSizes(productId).filter((s) => !(s.w === w && s.h === h));
    const otherProducts = JUDET_DIM_PRODUCTS.filter((id) => id !== productId).slice(0, 8);
    const seatLocs = getTargetLocalitiesForJudet(judet.slug).slice(0, 1).map((m) => m.loc);
    const localities = [...seatLocs, ...judet.localitati.filter((l) => !seatLocs.some((s) => s.slug === l.slug)).slice(0, 7)];
    const tier = profile?.tierLivrare ?? "mediu";

    const jsonLd = [
        { "@context": "https://schema.org", "@type": "Product", name: `${content.productLabel} ${w}x${h} cm`, description: content.metaDescription, image: cfg.image ? `${BASE_URL}${cfg.image}` : undefined, brand: { "@type": "Brand", name: siteConfig.name }, offers: { "@type": "Offer", url, priceCurrency: "RON", price: pricing.fromPrice.toFixed(2), availability: "https://schema.org/InStock", areaServed: { "@type": "AdministrativeArea", name: `Județul ${judet.name}` } } },
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Acasă", item: `${BASE_URL}/` }, { "@type": "ListItem", position: 2, name: "Județe", item: `${BASE_URL}/judet` }, { "@type": "ListItem", position: 3, name: judet.name, item: `${BASE_URL}/judet/${judet.slug}` }, { "@type": "ListItem", position: 4, name: `${content.productLabel} ${w}×${h} cm` }] },
    ];

    return (
        <div className="min-h-screen bg-white pb-24 lg:pb-0">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <div className="pt-24 pb-10 border-b border-slate-100">
                <div className="container mx-auto px-6">
                    <nav className="text-[10px] font-black text-slate-400 mb-5 flex flex-wrap gap-3 items-center uppercase tracking-widest">
                        <Link href="/judet" className="hover:text-emerald-600 transition-colors">Județe</Link><span>/</span>
                        <Link href={`/judet/${judet.slug}`} className="hover:text-emerald-600 transition-colors">{judet.name}</Link><span>/</span>
                        <Link href={dimensionUrl(productId, w, h)} className="hover:text-emerald-600 transition-colors">{content.productLabel} {w}×{h} cm</Link>
                    </nav>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        <div className="lg:col-span-7 min-w-0">
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-3 tracking-tighter">{content.productLabel} {w}×{h} cm <span className="text-emerald-500">în {judet.name}</span></h1>
                            <p className="text-lg text-slate-500 mb-5">{content.subtitle}</p>
                            {profile && (
                                <p className="text-slate-600 leading-relaxed mb-6">
                                    În județul {judet.name} ({profile.regiune}) cererea vine mai ales din {profile.industrii.slice(0, 2).join(" și ")}; {profile.notaGeografica}. Producem în 2-4 zile lucrătoare, iar {TIER_TEXT[tier]}.
                                </p>
                            )}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <WhatsAppButton message={waMessage}>Cere ofertă pe WhatsApp</WhatsAppButton>
                                <Link href={`${cfg.url}?w=${w}&h=${h}`} className="inline-flex items-center justify-center px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-700 transition-all">{content.ctaLabel}</Link>
                            </div>
                        </div>
                        <div className="lg:col-span-5 flex gap-5 items-center lg:justify-end">
                            {cfg.image && <div className="relative w-28 h-28 sm:w-40 sm:h-40 rounded-3xl overflow-hidden border border-slate-100 bg-slate-50 shrink-0"><Image src={cfg.image} alt={`${content.productLabel} ${w}x${h} cm`} fill className="object-cover" sizes="160px" /></div>}
                            <div><div className="text-[10px] uppercase tracking-widest font-black text-slate-400">de la</div><div className="text-4xl sm:text-5xl font-black text-slate-900 leading-none">{formatLei(pricing.fromPrice)}</div><div className="text-xs text-slate-500 mt-2">/ buc, TVA inclus · {pricing.fromLabel}</div></div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="py-12 border-b border-slate-100">
                <div className="container mx-auto px-6">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter mb-2">Preț {content.productLabel.toLowerCase()} {w}×{h} cm, livrat în {judet.name}</h2>
                    <p className="text-sm text-slate-500 mb-6">Calculat cu același motor ca în configurator, cu grafica ta. TVA inclus; transportul se calculează la comandă.</p>
                    <div className="overflow-x-auto rounded-3xl border border-slate-200">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50"><tr><th className="text-left px-5 py-3 font-black text-slate-700">Variantă</th>{pricing.quantities.map((q) => <th key={q} className="text-right px-5 py-3 font-black text-slate-700 whitespace-nowrap">{q} buc</th>)}</tr></thead>
                            <tbody>{pricing.variants.map((v) => <tr key={v.key} className={`border-t border-slate-100 ${v.recommended ? "bg-emerald-50/40" : ""}`}><td className="px-5 py-3"><div className="font-bold text-slate-900">{v.label}</div>{v.note && <div className="text-xs text-slate-500 mt-0.5">{v.note}</div>}</td>{v.rows.map((row) => <td key={row.qty} className="px-5 py-3 text-right whitespace-nowrap"><div className="font-black text-slate-900">{formatLei(row.unit)}<span className="text-slate-400 font-medium"> / buc</span></div><div className="text-xs text-slate-500">{formatLei(row.total)} total</div></td>)}</tr>)}</tbody>
                        </table>
                    </div>
                </div>
            </section>

            <section className="py-12 border-b border-slate-100 bg-slate-50">
                <div className="container mx-auto px-6">
                    <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">{content.facts.map((f) => <div key={f.label} className="bg-white rounded-2xl border border-slate-200 p-4"><dt className="text-[10px] uppercase tracking-widest font-black text-slate-400">{f.label}</dt><dd className="text-lg font-black text-slate-900 mt-1 leading-tight">{f.value}</dd>{f.detail && <dd className="text-[11px] text-slate-500 mt-1 leading-snug">{f.detail}</dd>}</div>)}</dl>
                </div>
            </section>

            <section className="py-12 border-b border-slate-100">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="rounded-3xl border border-slate-200 divide-y divide-slate-100">
                        <details className="group px-6 py-5"><summary className="cursor-pointer list-none font-bold text-slate-900 text-lg flex justify-between gap-4"><span>{content.usage.heading}</span><span className="text-slate-400 group-open:rotate-45 transition-transform text-2xl leading-none">+</span></summary><div className="mt-3 space-y-3">{content.usage.paragraphs.map((t, i) => <p key={i} className="text-slate-600 leading-relaxed">{t}</p>)}</div></details>
                        <details className="group px-6 py-5"><summary className="cursor-pointer list-none font-bold text-slate-900 text-lg flex justify-between gap-4"><span>{content.file.heading}</span><span className="text-slate-400 group-open:rotate-45 transition-transform text-2xl leading-none">+</span></summary><ul className="mt-3 space-y-2">{content.file.items.map((t, i) => <li key={i} className="text-slate-600 leading-relaxed pl-4 border-l-2 border-emerald-500">{t}</li>)}</ul></details>
                        {content.faq.slice(0, 4).map((f, i) => <details key={i} className="group px-6 py-5"><summary className="cursor-pointer list-none font-bold text-slate-900 text-lg flex justify-between gap-4"><span>{f.q}</span><span className="text-slate-400 group-open:rotate-45 transition-transform text-2xl leading-none">+</span></summary><p className="text-slate-600 leading-relaxed mt-3">{f.a}</p></details>)}
                    </div>
                </div>
            </section>

            <section className="py-12 bg-slate-50">
                <div className="container mx-auto px-6">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight mb-3">Alte mărimi de {content.productLabel.toLowerCase()} în {judet.name}</h2>
                    <div className="flex flex-wrap gap-2 mb-6">
                        {otherSizes.map((s) => <Link key={`${s.w}x${s.h}`} href={judetDimensionUrl(judet.slug, productId, s.w, s.h)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-900 hover:text-white transition-all">{s.w}×{s.h} cm</Link>)}
                        <Link href={`/dimensiuni/${productId}`} className="px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-black hover:bg-emerald-600 hover:text-white transition-all">Toate dimensiunile →</Link>
                    </div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight mb-3">Alte produse {w}×{h} cm în {judet.name}</h2>
                    <div className="flex flex-wrap gap-2 mb-6">
                        {otherProducts.map((id) => { const s = getTopSizes(id)[0]; const c = getDimProduct(id); return s && c ? <Link key={id} href={judetDimensionUrl(judet.slug, id, s.w, s.h)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-900 hover:text-white transition-all">{c.name} {s.w}×{s.h}</Link> : null; })}
                    </div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight mb-3">Localități din {judet.name}</h2>
                    <div className="flex flex-wrap gap-2">
                        {localities.map((l) => <Link key={l.slug} href={`/judet/${judet.slug}/${l.slug}/${productId}`} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-900 hover:text-white transition-all">{content.productLabel} în {l.name}</Link>)}
                        <Link href={`/judet/${judet.slug}`} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-900 hover:text-white transition-all">Tot județul →</Link>
                    </div>
                </div>
            </section>

            <WhatsAppBar message={waMessage} price={`${formatLei(pricing.fromPrice)} / buc`} />
        </div>
    );
}
