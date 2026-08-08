"use client";

import React from "react";
import Link from "next/link";
import { 
    Zap, MessageCircle, Sparkles, ShieldCheck, Truck, 
    Layers, Info, CheckCircle2, HelpCircle, ArrowRight,
    Scale, FileText, AlertCircle, Award
} from "lucide-react";
import { RegulatoryData } from "@/lib/seo/reglementariData";
import { useRouter } from "next/navigation";
import MasterConfigurator from "@/components/MasterConfigurator";

interface SeoRegulatoryLandingProps {
    data: RegulatoryData;
}

export function SeoRegulatoryLanding({ data }: SeoRegulatoryLandingProps) {
    const router = useRouter();
    
    const onStartConfig = () => {
        router.push(`/configurator/${data.relatedProductId}`);
        window.scrollTo(0, 0);
    };

    return (
        <div className="bg-white min-h-screen selection:bg-emerald-100">
            {/* OFFICIAL WHITE HERO */}
            <div className="w-full relative py-20 border-b border-slate-100 bg-[#f8fafc]">
                <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="flex-1 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-sm">
                                <ShieldCheck size={14} className="text-emerald-500" /> CONFORMITATE {data.lawReference}
                            </div>
                            
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6 uppercase tracking-tighter italic">
                                {data.name} <br />
                                <span className="text-emerald-500 not-italic">STANDARD {new Date().getFullYear()}</span>
                            </h1>

                            <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0">
                                {data.description} Soluții profesionale de semnalizare, complet omologate și conforme cu normele legislative din România.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center lg:justify-start">
                                <button 
                                    onClick={onStartConfig}
                                    className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 uppercase tracking-widest"
                                >
                                    <Zap size={18} /> CONFIGURARE RAPIDĂ
                                </button>
                                <a 
                                    href="https://wa.me/40750473111"
                                    className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold text-sm hover:border-emerald-500 hover:text-emerald-500 transition-all flex items-center justify-center gap-2 active:scale-95 uppercase tracking-widest"
                                >
                                    <MessageCircle size={18} /> WHATSAPP DIRECT
                                </a>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 opacity-80">
                                {data.standardSpecs.slice(0, 4).map((spec: string, i: number) => (
                                    <div key={i} className="text-left border-l-2 border-emerald-500 pl-4">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{spec.split(': ')[0]}</p>
                                        <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">{spec.split(': ')[1] || spec}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 w-full max-w-[500px] lg:max-w-none">
                            <div className="relative p-6 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl overflow-hidden">
                                <img 
                                    src={data.image} 
                                    alt={data.name} 
                                    className="w-full h-auto object-contain drop-shadow-lg"
                                />
                                <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg">
                                    CERTIFICAT ISO
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* TECHNICAL DETAILS - WHITE CLEAN */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg text-slate-400 text-[9px] font-black uppercase tracking-widest mb-6">
                                <Award size={14} /> OMOLOGARE ȘI SIGURANȚĂ
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase mb-6 leading-tight">Specificații <br /> <span className="text-emerald-500 italic">conform normei.</span></h2>
                            <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10 max-w-xl">
                                Fiecare element de semnalistică este produs folosind substraturi de înaltă densitate și pigmenți rezistenți UV, asigurând vizibilitatea și conformitatea cerută de inspectori.
                            </p>
                            
                            <div className="space-y-4">
                                {data.requirements.map((req: string, i: number) => (
                                    <div key={i} className="flex gap-4 items-center p-6 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-emerald-200 transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-white text-emerald-500 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
                                            <CheckCircle2 size={20} />
                                        </div>
                                        <p className="text-base font-black uppercase tracking-tight text-slate-800 italic">{req}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="bg-[#f8fafc] border border-slate-100 p-10 md:p-16 rounded-[3.5rem] relative overflow-hidden">
                            <h3 className="text-xl font-black uppercase tracking-widest mb-10 text-slate-900 flex items-center gap-3 italic">
                                <Info size={24} className="text-emerald-500" /> Detalii Tehnice:
                            </h3>
                            <div className="space-y-4">
                                {data.standardSpecs.map((spec: string, i: number) => (
                                    <div key={i} className="flex justify-between items-center py-4 border-b border-slate-200/50">
                                        <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">{spec.split(': ')[0]}</span>
                                        <span className="text-slate-900 font-black text-sm uppercase italic tracking-tighter">{spec.split(': ')[1] || spec}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* QUICK NAV Hub - WHITE */}
            <div className="py-24 bg-[#f8fafc] border-y border-slate-100">
                <div className="max-w-[1440px] mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-400 text-[9px] font-black uppercase tracking-widest mb-4 shadow-sm">
                            <Layers size={14} /> CATALOG COMPLET
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-tight italic">Sisteme de <span className="text-emerald-500 not-italic">Semnalizare.</span></h2>
                    </div>
                    
                    <div className="bg-white border border-slate-100 rounded-[3rem] shadow-sm p-4 overflow-hidden">
                        <MasterConfigurator />
                    </div>
                </div>
            </div>

            {/* FAQ SECTION - WHITE CLEAN */}
            <div className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg text-slate-400 text-[9px] font-black uppercase tracking-widest mb-4">
                            <HelpCircle size={14} className="text-emerald-500" /> INFO CONFORMITATE
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-tight">Întrebări Frecvente</h2>
                    </div>

                    <div className="space-y-4 px-4 text-left">
                        {[
                            { q: `Este materialul conform cu ${data.lawReference}?`, a: `Da, folosim exclusiv standardele cromatice și simbolurile ISO impuse de ${data.lawReference}. Panourile rezultate sunt gata pentru inspecțiile oficiale.` },
                            { q: "Ce grosime ar trebui să aleg pentru un panou de șantier?", a: "Legea recomandă o vizibilitate sporită. Recomandăm PVC de 5mm pentru panouri sub 1 metru și Banner 510g pentru dimensiuni mai mari (mash-uri)." },
                            { q: "Oferiți și servicii de instalare?", a: "Produsele noastre vin cu soluție de fixare rapidă inclusă (bandă dublu-adezivă profesională). Pentru sisteme complexe, livrăm toate accesoriile necesare." },
                            { q: "Cât de repede primesc panourile în caz de control?", a: "Dacă grafica este confirmată urgent, producția poate fi finalizată în 24 de ore, asigurând livrarea rapidă prin curier." }
                        ].map((faq, i) => (
                            <div key={i} className="bg-slate-50 p-8 rounded-2xl border border-slate-100 group hover:border-emerald-200 transition-all">
                                <h4 className="text-base font-black text-slate-900 mb-4 flex items-start gap-3 uppercase tracking-tight italic">
                                    <span className="text-emerald-500">{i+1}.</span> {faq.q}
                                </h4>
                                <div className="pl-6 text-slate-500 text-sm font-medium leading-relaxed border-l border-slate-200 group-hover:border-emerald-500 transition-colors">
                                    {faq.a}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* FOOTER TRUST - WHITE */}
            <div className="py-20 bg-[#f8fafc] border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="text-center group border border-slate-100 p-10 rounded-3xl bg-white shadow-sm hover:border-emerald-500 transition-all">
                            <div className="w-12 h-12 bg-slate-50 text-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                <ShieldCheck size={24} />
                            </div>
                            <h4 className="text-base font-black text-slate-900 mb-2 uppercase italic tracking-tighter">100% Conform Legii</h4>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Respecăm normele în vigoare.</p>
                        </div>
                        <div className="text-center group border border-slate-100 p-10 rounded-3xl bg-white shadow-sm hover:border-emerald-500 transition-all">
                            <div className="w-12 h-12 bg-slate-50 text-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                <Award size={24} />
                            </div>
                            <h4 className="text-base font-black text-slate-900 mb-2 uppercase italic tracking-tighter">Certificare Tehnică</h4>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Materiale originale verificate.</p>
                        </div>
                        <div className="text-center group border border-slate-100 p-10 rounded-3xl bg-white shadow-sm hover:border-emerald-500 transition-all">
                            <div className="w-12 h-12 bg-slate-50 text-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                <Truck size={24} />
                            </div>
                            <h4 className="text-base font-black text-slate-900 mb-2 uppercase italic tracking-tighter">Transport Protejat</h4>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Livrare securizată rapidă.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
