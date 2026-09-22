import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { COMPARISONS } from "@/lib/seo/comparisons";

export const revalidate = 604800;
const BASE_URL = String(siteConfig.url || "").toLowerCase().replace(/\/$/, "");

export const metadata: Metadata = {
    title: { absolute: `Comparații de materiale și produse de print | ${siteConfig.name}` },
    description: "Frontlit 440 sau 510, banner sau mesh, Forex, alucobond sau plexiglas, canvas cu sau fără șasiu, flyere pe hârtie sau carton: diferențele reale și prețurile comparate pentru aceleași mărimi.",
    alternates: { canonical: `${BASE_URL}/comparatii` },
};

export default function ComparisonsIndex() {
    return (
        <div className="min-h-screen bg-white">
            <div className="pt-24 pb-12 border-b border-slate-100">
                <div className="container mx-auto px-6 max-w-5xl">
                    <nav className="text-[10px] font-black text-slate-400 mb-6 flex gap-3 items-center uppercase tracking-widest"><Link href="/" className="hover:text-emerald-600 transition-colors">Acasă</Link><span>/</span><span className="text-slate-900">Comparații</span></nav>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tighter">Ce material <span className="text-emerald-500">aleg?</span></h1>
                    <p className="text-lg text-slate-500 max-w-3xl">Comparații scurte între variantele pe care le confundă cel mai des clienții, cu avantaje, dezavantaje, situația potrivită pentru fiecare și prețurile calculate pentru aceleași mărimi sau tiraje.</p>
                </div>
            </div>
            <section className="py-14">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {COMPARISONS.map((c) => (
                            <Link key={c.slug} href={`/comparatii/${c.slug}`} className="rounded-[2rem] border border-slate-200 p-6 md:p-8 hover:border-emerald-500 hover:shadow-xl transition-all">
                                <div className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">{c.options.map((o) => o.name).join(" · ")}</div>
                                <h2 className="text-2xl font-black text-slate-900 mb-3">{c.title}</h2>
                                <p className="text-sm text-slate-600 leading-relaxed">{c.verdict}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
