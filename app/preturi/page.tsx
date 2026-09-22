import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { QTY_PRODUCTS, getQtyPricing, qtyUrl, getRegistryEntry } from "@/lib/seo/quantityPages";
import { formatLei } from "@/lib/seo/dimensionPricing";

export const revalidate = 604800;
const BASE_URL = String(siteConfig.url || "").toLowerCase().replace(/\/$/, "");

export const metadata: Metadata = {
    title: { absolute: `Prețuri pe cantități: flyere, pliante, cărți de vizită, afișe, textile | ${siteConfig.name}` },
    description: "Cât costă 100, 500 sau 1000 de flyere, pliante, cărți de vizită, afișe, tricouri, roll-up-uri sau etichete: prețuri calculate de motorul configuratorului, cu pragurile de discount, greutatea coletului și specificațiile de fișier.",
    alternates: { canonical: `${BASE_URL}/preturi` },
};

export default function PreturiIndex() {
    return (
        <div className="min-h-screen bg-white">
            <div className="pt-24 pb-12 border-b border-slate-100">
                <div className="container mx-auto px-6">
                    <nav className="text-[10px] font-black text-slate-400 mb-6 flex gap-3 items-center uppercase tracking-widest"><Link href="/" className="hover:text-emerald-600 transition-colors">Acasă</Link><span>/</span><span className="text-slate-900">Prețuri pe cantități</span></nav>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tighter">Prețuri <span className="text-emerald-500">pe cantități</span></h1>
                    <p className="text-lg text-slate-500 max-w-3xl">Cât costă un tiraj concret: 500 de flyere A5, 1000 de cărți de vizită, 50 de tricouri, 10 roll-up-uri. Fiecare pagină are prețul calculat de motorul configuratorului, pragul de la care scade prețul pe bucată, greutatea coletului și fișierul de trimis. Producție 2-4 zile lucrătoare.</p>
                </div>
            </div>
            <section className="py-14">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {QTY_PRODUCTS.map((p) => {
                            const cfg = getRegistryEntry(p.id);
                            const f = p.formats[0];
                            return (
                                <div key={p.slug} className="rounded-[2rem] border border-slate-200 p-6 md:p-8 hover:border-emerald-500 hover:shadow-xl transition-all">
                                    <div className="flex gap-5 items-start">
                                        {cfg?.image && <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0"><Image src={cfg.image} alt={p.name} fill className="object-cover" sizes="96px" /></div>}
                                        <div className="min-w-0"><Link href={`/preturi/${p.slug}`} className="text-2xl font-black text-slate-900 hover:text-emerald-600 transition-colors">{p.name}</Link><p className="text-sm text-slate-500 mt-1">{p.formats.length} {p.formatLabel.toLowerCase() === "format" ? "formate" : "variante"} · {p.quantities.length} cantități</p></div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-6">
                                        {p.quantities.map((q) => { const pr = getQtyPricing(p, f, q); return pr ? <Link key={q} href={qtyUrl(p, f, q)} className="px-3 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-900 hover:text-white transition-all">{q} buc {p.kind === "textil" ? "" : f.short} · {formatLei(pr.recommended.total)}</Link> : null; })}
                                        <Link href={`/preturi/${p.slug}`} className="px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-black hover:bg-emerald-600 hover:text-white transition-all">toate →</Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-10"><Link href="/dimensiuni" className="font-bold text-emerald-700 hover:underline">Cauți un preț pe dimensiune (banner 3×1 m, autocolant 50×70)? Vezi prețurile pe dimensiuni →</Link></div>
                </div>
            </section>
        </div>
    );
}
