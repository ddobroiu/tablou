import React from "react";
import Link from "next/link";
import { JUDETE_DATA } from "@/lib/judeteData";
import { siteConfig } from "@/lib/siteConfig";
import { MapPin, ArrowRight, ShieldCheck, Truck, Sparkles } from "lucide-react";

export const metadata = {
    title: "Tablouri Canvas & Plexiglas cu livrare în toată România - Tablou.net",
    description: "Transformă-ți fotografiile în artă. Livrăm tablouri canvas, afișe și sticlă acrilică personalizată în orice județ din România. Calitate muzeală.",
    keywords: "tablouri canvas romania, tablouri personalizate, print digital, livrare judete",
    alternates: { canonical: "/judet" },
};

export default function JudetePage() {
    const base = siteConfig.url;

    return (
        <main className="min-h-screen bg-slate-50/20">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-white pt-32 pb-24 md:pt-48 md:pb-40 border-b border-slate-100">
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-slate-900 rounded-full blur-[160px] -mt-96"></div>
                </div>

                <div className="container relative z-10 px-6 mx-auto text-center">
                    <div className="inline-flex items-center gap-3 px-5 py-2 mb-10 text-[10px] font-bold text-slate-500 border border-slate-200 rounded-full bg-slate-50 uppercase tracking-[0.3em]">
                        <Sparkles size={12} />
                        <span>Artă fără frontiere</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-serif text-slate-900 mb-10 italic leading-[0.9]">
                        Amintirile tale, <br />
                        <span className="text-slate-400">în orice colț al țării.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto font-light leading-relaxed">
                        Livrăm emoție înrămată indiferent de județ. Calitate muzeală, ambalare premium și transport securizat până la ușa ta.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl px-6 mx-auto -mt-16 mb-40 relative z-20">
                {/* Features bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-24">
                    {[
                        { icon: ShieldCheck, title: "Calitate Muzeală", text: "Materiale premium ce rezistă zeci de ani", color: "text-slate-900" },
                        { icon: Truck, title: "Ambalare de Siguranță", text: "Protecție multi-strat pentru fiecare piesă", color: "text-slate-700" },
                        { icon: Sparkles, title: "Garanția Tablou.net", text: "Verificare la livrare pentru liniștea ta", color: "text-slate-500" }
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center text-center gap-6 p-12 bg-white/80 backdrop-blur-xl border border-slate-100 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.03)] hover:shadow-2xl transition-all duration-500">
                            <div className={`p-5 rounded-full bg-slate-50 ${item.color}`}>
                                <item.icon size={28} />
                            </div>
                            <div>
                                <h3 className="text-xl font-medium text-slate-900 mb-3">{item.title}</h3>
                                <p className="text-slate-500 text-sm font-light leading-relaxed">{item.text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 border-b border-slate-100 pb-12">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-serif text-slate-900 lowercase italic">Alege regiunea</h2>
                        <p className="text-slate-400 mt-4 font-light tracking-wide uppercase text-xs">Deservim toate cele {JUDETE_DATA.length} județe din România</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                    {JUDETE_DATA.map((judet) => (
                        <Link
                            key={judet.slug}
                            href={`/judet/${judet.slug}`}
                            className="group relative h-48 p-12 bg-white border border-slate-100 rounded-[3rem] hover:border-slate-900 hover:shadow-2xl transition-all duration-700 flex flex-col items-center justify-center text-center overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-900/5 rounded-full -mr-12 -mt-12 group-hover:scale-[6] transition-transform duration-1000"></div>

                            <MapPin className="text-slate-200 group-hover:text-slate-900 mb-6 transition-colors duration-500" size={24} />
                            <h3 className="font-medium text-slate-800 group-hover:text-slate-900 transition-all uppercase tracking-[0.2em] text-[10px] leading-tight">{judet.name}</h3>
                            <ArrowRight className="mt-6 text-slate-900 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-700" size={16} />
                        </Link>
                    ))}
                </div>
            </div>

            <section className="max-w-7xl px-6 mx-auto pb-40">
                <div className="bg-slate-900 rounded-[4rem] p-16 md:p-32 text-center text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_bottom,rgba(255,255,255,0.2),transparent)]"></div>

                    <div className="max-w-4xl relative z-10 mx-auto">
                        <h2 className="text-4xl md:text-7xl font-serif mb-12 italic leading-[1.1] tracking-tight">O piesă de artă <br /> merită respect.</h2>
                        <p className="text-xl text-slate-400 mb-16 leading-relaxed font-light max-w-2xl mx-auto">
                            De la alegerea pânzei până la întinderea pe șasiu și livrarea securizată,
                            fiecare etapă este tratată cu obsesie pentru detaliu.
                        </p>
                        <div className="flex flex-wrap justify-center gap-10">
                            <Link href="/contact" className="px-14 py-6 bg-white text-slate-900 rounded-full font-medium hover:bg-slate-100 transition-all shadow-2xl hover:-translate-y-1">
                                Solicită Consultanță
                            </Link>
                            <Link href="/shop" className="px-14 py-6 bg-transparent border border-white/20 text-white rounded-full font-medium hover:bg-white/5 transition-all">
                                Vezi Colecția
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
