import React from "react";
import Link from "next/link";
import { JUDETE_DATA } from "@/lib/judeteData";
import { siteConfig } from "@/lib/siteConfig";

export const metadata = {
    title: "Tablouri Canvas & Plexiglas cu livrare în toată România - Tablou.net",
    description: "Transformă-ți fotografiile în artă. Livrăm tablouri canvas, afișe și sticlă acrilică personalizată în orice județ din România. Calitate muzeală.",
    keywords: "tablouri canvas romania, tablouri personalizate, print digital, livrare judete",
    alternates: { canonical: "/judet" },
};

export default function JudetePage() {
    const base = siteConfig.url;

    return (
        <main className="pt-24 min-h-screen bg-[#fafafa]">
            <div className="max-w-7xl mx-auto px-6 pb-24">
                <header className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-serif text-slate-900 mb-6 italic">Arta ajunge în casa ta</h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto font-light">Livrăm amintiri înrămate în orice colț al României. Alege județul tău pentru detalii despre livrare și oferte locale.</p>
                </header>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {JUDETE_DATA.map((judet) => (
                        <Link key={judet.slug} href={`/judet/${judet.slug}`} className="group p-10 bg-white border border-slate-100 rounded-3xl hover:border-slate-900 hover:shadow-2xl transition-all text-center">
                            <h3 className="text-lg font-medium text-slate-800 group-hover:tracking-widest transition-all uppercase">{judet.name}</h3>
                            <div className="h-px w-8 bg-slate-200 mx-auto mt-4 group-hover:w-full transition-all duration-500"></div>
                        </Link>
                    ))}
                </div>

                <section className="mt-32 grid md:grid-cols-2 gap-12 items-center bg-white p-12 rounded-[3.5rem] shadow-sm">
                    <div>
                        <h2 className="text-3xl font-serif mb-6 italic">Grijă maximă la transport</h2>
                        <p className="text-slate-500 leading-relaxed mb-8">Fiecare tablou este ambalat manual folosind folie cu bule, colțare de protecție și carton dublu-stratificat. Colaborăm cu cei mai buni curieri pentru a ne asigura că piesa ta de artă ajunge intactă, indiferent de județ.</p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">01</span>
                                <span className="font-medium">Ambalare Premium Multi-Strat</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">02</span>
                                <span className="font-medium">Asigurare completă a coletului</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">03</span>
                                <span className="font-medium">Verificare la livrare</span>
                            </div>
                        </div>
                    </div>
                    <div className="aspect-square bg-slate-100 rounded-[2.5rem] overflow-hidden flex items-center justify-center text-6xl shadow-inner">
                        🚚
                    </div>
                </section>
            </div>
        </main>
    );
}
