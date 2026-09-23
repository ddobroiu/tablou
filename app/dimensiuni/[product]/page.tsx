import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import {
    getDimProduct,
    getSizesForProduct,
    getPopularSizes,
    dimensionUrl,
    isDimensionProduct,
    DIMENSION_PRODUCT_IDS,
} from "@/lib/seo/dimensionPages";
import { getDimensionPricing, formatLei } from "@/lib/seo/dimensionPricing";
import { getProductInfo } from "@/lib/seo/dimensionContent";

export const revalidate = 604800;

export const dynamicParams = true;
// Paginile se randează la cerere și rămân în cache (ISR) până la revalidate.
export function generateStaticParams() {
    return [];
}
const BASE_URL = String(siteConfig.url || "").toLowerCase().replace(/\/$/, "");

export async function generateMetadata({ params }: { params: Promise<{ product: string }> }): Promise<Metadata> {
    const { product } = await params;
    const productId = String(product || "").toLowerCase();
    const cfg = getDimProduct(productId);
    const info = getProductInfo(productId);
    if (!isDimensionProduct(productId) || !cfg || !info) return {};
    const sizes = getSizesForProduct(productId);
    const title = `${info.shortName}: prețuri pe dimensiuni (${sizes.length} formate) | ${siteConfig.name}`;
    const description = `Toate dimensiunile de ${info.noun} cu preț calculat: de la ${cfg.dimensions.minWidth ?? ""}${cfg.dimensions.type === "custom" ? `×${cfg.dimensions.minHeight} cm până la ${cfg.dimensions.maxWidth}×${Math.min(cfg.dimensions.maxHeight ?? 500, 500)} cm` : " formate standard"}. Greutate, rezoluție fișier și montaj pentru fiecare mărime.`;
    const url = `${BASE_URL}/dimensiuni/${productId}`;
    return {
        title: { absolute: title },
        description,
        alternates: { canonical: url },
        openGraph: { title, description, url, siteName: siteConfig.name, locale: "ro_RO", type: "website" },
    };
}

export default async function DimensionProductIndex({ params }: { params: Promise<{ product: string }> }) {
    const { product } = await params;
    const productId = String(product || "").toLowerCase();
    const cfg = getDimProduct(productId);
    const info = getProductInfo(productId);
    if (!isDimensionProduct(productId) || !cfg || !info) notFound();

    const sizes = getSizesForProduct(productId);
    const popular = getPopularSizes(productId, 12);
    const widths = [...new Set(sizes.map((s) => s.w))].sort((a, b) => a - b);
    const byWidth = new Map<number, typeof sizes>();
    for (const s of sizes) {
        const arr = byWidth.get(s.w) ?? [];
        arr.push(s);
        byWidth.set(s.w, arr);
    }
    const otherProducts = DIMENSION_PRODUCT_IDS.filter((id) => id !== productId)
        .map((id) => ({ id, info: getProductInfo(id) }))
        .filter((x) => x.info);

    const popularWithPrice = popular.map((s) => ({ s, price: getDimensionPricing(productId, s.w, s.h)?.fromPrice ?? 0 }));

    return (
        <div className="min-h-screen bg-white">
            <div className="pt-24 pb-12 border-b border-slate-100">
                <div className="container mx-auto px-6">
                    <nav className="text-[10px] font-black text-slate-400 mb-6 flex flex-wrap gap-3 items-center uppercase tracking-widest">
                        <Link href="/" className="hover:text-emerald-600 transition-colors">Acasă</Link>
                        <span>/</span>
                        <Link href="/dimensiuni" className="hover:text-emerald-600 transition-colors">Dimensiuni</Link>
                        <span>/</span>
                        <span className="text-slate-900">{info.shortName}</span>
                    </nav>
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                        <div className="max-w-3xl">
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tighter">
                                {info.shortName} <span className="text-emerald-500">pe dimensiuni</span>
                            </h1>
                            <p className="text-lg text-slate-500 mb-4">{cfg.description}</p>
                            <p className="text-slate-600 leading-relaxed">
                                {sizes.length} formate cu pagină proprie: preț la mai multe cantități, greutate, rezoluția fișierului și recomandări de montaj pentru fiecare mărime.
                                {cfg.dimensions.type === "custom" && ` Dimensiuni de la ${cfg.dimensions.minWidth}×${cfg.dimensions.minHeight} cm până la ${cfg.dimensions.maxWidth}×${Math.min(cfg.dimensions.maxHeight ?? 500, 500)} cm; orice altă mărime se poate introduce direct în configurator.`}
                            </p>
                        </div>
                        {cfg.image && (
                            <div className="relative w-full lg:w-72 aspect-[4/3] rounded-3xl overflow-hidden border border-slate-100 bg-slate-50 shrink-0">
                                <Image src={cfg.image} alt={info.shortName} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 288px" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <section className="py-16 border-b border-slate-100">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-8">Cele mai căutate dimensiuni</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {popularWithPrice.map(({ s, price }) => (
                            <Link key={`${s.w}x${s.h}`} href={dimensionUrl(productId, s.w, s.h)} className="group rounded-3xl border border-slate-200 p-5 hover:border-emerald-500 hover:shadow-xl transition-all">
                                <div className="text-2xl font-black text-slate-900 group-hover:text-emerald-600">{s.w}×{s.h} cm</div>
                                {s.label && <div className="text-xs text-slate-500 mt-1">{s.label}</div>}
                                {price > 0 && <div className="text-sm font-bold text-slate-600 mt-3">de la {formatLei(price)}</div>}
                            </Link>
                        ))}
                    </div>
                    <div className="mt-8">
                        <Link href={cfg.url} className="inline-flex items-center justify-center px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest bg-emerald-600 text-white hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20">
                            Altă dimensiune? Deschide configuratorul
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-16 border-b border-slate-100 bg-slate-50">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-3">Toate dimensiunile, după lățime</h2>
                    <p className="text-slate-500 mb-10">Lățime × înălțime, în centimetri. Fiecare link deschide pagina cu prețul și datele tehnice ale mărimii.</p>
                    <div className="space-y-8">
                        {widths.map((wv) => (
                            <div key={wv}>
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">Lățime {wv} cm</h3>
                                <div className="flex flex-wrap gap-2">
                                    {(byWidth.get(wv) ?? []).sort((a, b) => a.h - b.h).map((s) => (
                                        <Link key={`${s.w}x${s.h}`} href={dimensionUrl(productId, s.w, s.h)} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-900 hover:text-white transition-all">
                                            {s.w}×{s.h}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="container mx-auto px-6">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter mb-6">Alte produse pe dimensiuni</h2>
                    <div className="flex flex-wrap gap-3">
                        {otherProducts.map((x) => (
                            <Link key={x.id} href={`/dimensiuni/${x.id}`} className="px-5 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl text-sm font-bold hover:bg-slate-900 hover:text-white transition-all">
                                {x.info!.shortName}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
