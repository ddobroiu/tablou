import React from "react";
import Link from "next/link";
import { JUDETE_FULL_DATA } from "@/lib/localitati";
import { siteConfig } from "@/lib/siteConfig";
import { MapPin, ArrowRight, Flag, ShieldCheck, Zap, BarChart } from "lucide-react";

export const metadata = {
    title: "Producție Publicitară & Banners în orice județ - Tablou",
    description: "Livrăm bannere publicitare, mesh-uri, autocolante și sisteme de afișaj în orice județ din România. Comandă online cu livrare rapidă.",
    keywords: "adbanner, bannere romania, print judete, mesh publicitar, autocolante",
    alternates: { canonical: "/judet" },
};

export default function JudetePage() {
    const base = siteConfig.url;

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-slate-900 pt-32 pb-20 md:pt-44 md:pb-36">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-orange-500 rounded-full blur-[150px] -mr-96 -mt-96"></div>
                    <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-slate-500 rounded-full blur-[150px] -ml-96 -mb-96"></div>
                </div>

                <div className="container relative z-10 px-6 mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-xs font-bold text-orange-400 border border-orange-400/20 rounded-full bg-orange-400/5 uppercase tracking-[0.2em]">
                        <Flag size={14} />
                        <span>Acoperire Națională Tablou</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-8 leading-[0.85]">
                        Outdoor Print <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-500">
                            Fără Limite
                        </span>
                    </h1>
                    <p className="text-lg md:text-2xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
                        Suntem furnizorul tău strategic pentru outdoor. Printăm și livrăm materiale rezistente oriunde în România, direct de la sursă.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl px-6 mx-auto -mt-16 mb-32 relative z-20">
                {/* Features bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    {[
                        { icon: ShieldCheck, title: "Rezistență 3 Ani+", text: "Cerneală UV și materiale heavy-duty", color: "text-orange-500" },
                        { icon: Zap, title: "Expediere Prioritară", text: "Producție rapidă în regim de urgență", color: "text-yellow-500" },
                        { icon: BarChart, title: "Impact Vizual Maxim", text: "Culori vibrante pentru business-ul tău", color: "text-slate-400" }
                    ].map((item, i) => (
                        <div key={i} className="flex items-start gap-6 p-10 bg-white border border-slate-100 rounded-[3rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] hover:border-orange-500/30 transition-all duration-300">
                            <div className={`p-4 rounded-2xl bg-slate-50 ${item.color}`}>
                                <item.icon size={28} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                                <p className="text-slate-500 text-sm font-light leading-relaxed">{item.text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight lowercase"><span className="text-orange-600">toate</span> județele</h2>
                        <div className="w-16 h-2 bg-orange-600 rounded-full mt-2"></div>
                    </div>
                    <div className="text-slate-400 font-medium tracking-widest uppercase text-xs">
                        Distribuție în {JUDETE_FULL_DATA.length} regiuni
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
                    {JUDETE_FULL_DATA.map((judet) => (
                        <Link
                            key={judet.slug}
                            href={`/judet/${judet.slug}`}
                            className="group relative h-44 p-10 bg-white border border-slate-200 rounded-[3rem] hover:border-orange-500 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 flex flex-col items-center justify-center text-center overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-[5] transition-transform duration-700"></div>

                            <MapPin className="text-slate-300 group-hover:text-orange-500 mb-5 transition-colors duration-500" size={24} />
                            <h3 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors uppercase tracking-widest text-xs leading-none">{judet.name}</h3>
                            <ArrowRight className="mt-6 text-orange-600 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" size={16} />
                        </Link>
                    ))}
                </div>
            </div>

            <section className="max-w-7xl px-6 mx-auto pb-40">
                <div className="bg-orange-600 rounded-[4rem] p-12 md:p-24 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-1/2 left-0 w-full h-[500px] bg-white/5 skew-y-6 pointer-events-none"></div>

                    <div className="max-w-3xl relative z-10">
                        <h2 className="text-4xl md:text-6xl font-black mb-10 leading-tight tracking-tight">Echipa ta pentru <br /> Proiecte de Outdoor.</h2>
                        <p className="text-xl text-orange-100 mb-12 leading-relaxed font-light">
                            De la consultanță tehnică la execuție și livrare rapidă, Tablou este partenerul care te ajută să fii vizibil oriunde în România.
                        </p>
                        <Link href="/contact" className="px-14 py-6 bg-white text-orange-600 rounded-3xl font-black text-lg hover:scale-105 transition-all shadow-xl shadow-orange-900/10 inline-block">
                            Cere o Ofertă Acum
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
