import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { DIMENSION_PRODUCT_IDS, getDimProduct, getSizesForProduct, getPopularSizes, dimensionUrl } from "@/lib/seo/dimensionPages";
import { getDimensionPricing, formatLei } from "@/lib/seo/dimensionPricing";
import { getProductInfo } from "@/lib/seo/dimensionContent";

export const revalidate = 604800;

const BASE_URL = String(siteConfig.url || "").toLowerCase().replace(/\/$/, "");

export const metadata: Metadata = {
    title: { absolute: `Prețuri pe dimensiuni: bannere, autocolante, canvas, panouri | ${siteConfig.name}` },
    description: "Pagini cu preț calculat pentru fiecare dimensiune de banner, mesh, autocolant, canvas, tapet, folie pentru geam și panou rigid: greutate, rezoluție fișier, montaj și prețul la mai multe cantități.",
    alternates: { canonical: `${BASE_URL}/dimensiuni` },
};

export default function DimensionsIndex() {
    const products = DIMENSION_PRODUCT_IDS
        .map((id) => ({ id, cfg: getDimProduct(id), info: getProductInfo(id), sizes: getSizesForProduct(id) }))
        .filter((p) => p.cfg && p.info && p.sizes.length > 0);
    const total = products.reduce((s, p) => s + p.sizes.length, 0);

    return (
        <div className="min-h-screen bg-white">
            <div className="pt-24 pb-12 border-b border-slate-100">
                <div className="container mx-auto px-6">
                    <nav className="text-[10px] font-black text-slate-400 mb-6 flex gap-3 items-center uppercase tracking-widest">
                        <Link href="/" className="hover:text-emerald-600 transition-colors">Acasă</Link>
                        <span>/</span>
                        <span className="text-slate-900">Dimensiuni</span>
                    </nav>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tighter">
                        Prețuri <span className="text-emerald-500">pe dimensiuni</span>
                    </h1>
                    <p className="text-lg text-slate-500 max-w-3xl">
                        {total} de formate cu pagină proprie, pentru {products.length} produse. Fiecare pagină are prețul calculat cu motorul configuratorului la mai multe cantități, greutatea, rezoluția fișierului și recomandări de montaj pentru mărimea respectivă.
                    </p>
                </div>
            </div>

            <section className="py-16">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {products.map((p) => {
                            const popular = getPopularSizes(p.id, 6);
                            return (
                                <div key={p.id} className="rounded-[2rem] border border-slate-200 p-6 md:p-8 hover:border-emerald-500 hover:shadow-xl transition-all">
                                    <div className="flex gap-5 items-start">
                                        {p.cfg!.image && (
                                            <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                                                <Image src={p.cfg!.image} alt={p.info!.shortName} fill className="object-cover" sizes="96px" />
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <Link href={`/dimensiuni/${p.id}`} className="text-2xl font-black text-slate-900 hover:text-emerald-600 transition-colors">
                                                {p.info!.shortName}
                                            </Link>
                                            <p className="text-sm text-slate-500 mt-1">{p.sizes.length} formate · {p.cfg!.turnaroundTime}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-6">
                                        {popular.map((s) => {
                                            const price = getDimensionPricing(p.id, s.w, s.h)?.fromPrice ?? 0;
                                            return (
                                                <Link key={`${s.w}x${s.h}`} href={dimensionUrl(p.id, s.w, s.h)} className="px-3 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-900 hover:text-white transition-all">
                                                    {s.w}×{s.h}{price > 0 ? ` · ${formatLei(price)}` : ""}
                                                </Link>
                                            );
                                        })}
                                        <Link href={`/dimensiuni/${p.id}`} className="px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-black hover:bg-emerald-600 hover:text-white transition-all">
                                            toate →
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-10"><Link href="/preturi" className="font-bold text-emerald-700 hover:underline">Cauți prețul unui tiraj (500 flyere, 1000 cărți de vizită, 50 tricouri)? Vezi prețurile pe cantități →</Link></div>
                </div>
            </section>
        </div>
    );
}
