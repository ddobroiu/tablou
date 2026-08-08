"use client";

import React from "react";
import Link from "next/link";
import { 
    Zap, MessageCircle, Sparkles, ShieldCheck, Truck, 
    Layers, Info, CheckCircle2, HelpCircle, ArrowRight,
    Settings, Target, Award, Palette
} from "lucide-react";
import { MaterialData } from "@/lib/seo/materialeData";
import { useRouter } from "next/navigation";
import MasterConfigurator from "@/components/MasterConfigurator";

interface SeoMaterialLandingProps {
    material: MaterialData;
}

export function SeoMaterialLanding({ material }: SeoMaterialLandingProps) {
    const router = useRouter();
    
    const onStartConfig = () => {
        router.push(`/configurator/${material.relatedProductId}`);
        window.scrollTo(0, 0);
    };

    return (
        <div className="bg-white min-h-screen selection:bg-emerald-100 selection:text-emerald-900">
            {/* CLEAN ARCHITECTURAL HERO */}
            <div className="w-full relative py-20 border-b border-slate-100 bg-[#f8fafc]">
                <div className="absolute inset-0 opacity-40 pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                
                <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="flex-1 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-sm">
                                <Info size={14} className="text-emerald-500" /> RESURSĂ TEHNICĂ {material.name}
                            </div>
                            
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6 uppercase tracking-tighter italic">
                                {material.name} <br />
                                <span className="text-emerald-500 not-italic">SPECIFICAȚII PREMIUM</span>
                            </h1>

                            <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0">
                                {material.description} O soluție de înaltă performanță, selectată pentru durabilitate și o redare cromatică excepțională.
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
                                    <MessageCircle size={18} /> CONSULTANȚĂ WHATSAPP
                                </a>
                            </div>

                            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
                                {material.technicalSpecs.slice(0, 2).map((spec: { label: string; value: string }, i: number) => (
                                    <div key={i} className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{spec.label}</p>
                                        <p className="text-xs font-black text-slate-800 uppercase italic">{spec.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 w-full max-w-[500px] lg:max-w-none">
                            <div className="relative p-6 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl overflow-hidden">
                                <img 
                                    src={material.image} 
                                    alt={material.name} 
                                    className="w-full h-auto object-contain drop-shadow-lg"
                                />
                                <div className="absolute top-4 right-4 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg">
                                    PRODUS ORIGINAL
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* TECHNICAL DEEP DIVE - WHITE */}
            <div className="py-24 bg-white border-b border-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg text-slate-400 text-[9px] font-black uppercase tracking-widest mb-6">
                                <Layers size={14} /> ANALIZĂ MATERIAL
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase mb-6 leading-tight">Performanță <br /> <span className="text-emerald-500 italic">fără compromis.</span></h2>
                            <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10 max-w-xl">
                                {material.description}
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {material.benefits.map((benefit: string, i: number) => (
                                    <div key={i} className="flex gap-4 items-center p-6 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-emerald-200 transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-white text-emerald-500 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
                                            <CheckCircle2 size={20} />
                                        </div>
                                        <p className="text-sm font-black uppercase tracking-tight text-slate-800 italic">{benefit}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="bg-[#f8fafc] border border-slate-100 p-10 md:p-16 rounded-[3.5rem] relative overflow-hidden shadow-sm">
                            <h3 className="text-xl font-black uppercase tracking-widest mb-10 text-slate-900 flex items-center gap-3 italic">
                                <Settings size={24} className="text-emerald-500" /> Parametri Tehnici:
                            </h3>
                            <div className="space-y-4">
                                {material.technicalSpecs.map((spec: { label: string; value: string }, i: number) => (
                                    <div key={i} className="flex justify-between items-center py-4 border-b border-slate-200/50">
                                        <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">{spec.label}</span>
                                        <span className="text-slate-900 font-black text-sm uppercase italic tracking-tighter">{spec.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* USAGE HUB - WHITE */}
            <div className="py-24 bg-[#f8fafc]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-400 text-[9px] font-black uppercase tracking-widest mb-4 shadow-sm">
                            <ArrowRight size={14} className="text-emerald-500" /> APLICAȚII RECOMANDATE
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-tight italic">Unde utilizăm <span className="text-emerald-500 not-italic">{material.name}?</span></h2>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {material.idealFor.map((use: string, i: number) => (
                            <div key={i} className="p-8 bg-white border border-slate-100 rounded-2xl text-center hover:border-emerald-500 transition-all group shadow-sm">
                                <h4 className="text-base font-black text-slate-900 uppercase tracking-tight group-hover:text-emerald-500 transition-colors leading-none">{use}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* MASTER CONFIGURATOR Hub - WHITE */}
            <div className="py-24 bg-white border-t border-slate-100">
                <div className="max-w-[1440px] mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg text-slate-400 text-[9px] font-black uppercase tracking-widest mb-4 shadow-sm">
                            <Layers size={14} className="text-emerald-500" /> CATALOG COMPLET PRODUSE
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-tight italic">Materiale la <span className="text-emerald-500 not-italic">Nivel Expert.</span></h2>
                    </div>
                    
                    <div className="bg-white border border-slate-100 rounded-[3rem] shadow-sm p-4 overflow-hidden">
                        <MasterConfigurator />
                    </div>
                </div>
            </div>

            {/* MATERIAL FAQ - WHITE CLEAN */}
            <div className="py-24 bg-[#f8fafc] border-t border-slate-100">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-16 px-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-400 text-[9px] font-black uppercase tracking-widest mb-4 shadow-sm">
                            <HelpCircle size={14} className="text-emerald-500" /> SUPORT TEHNIC
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-tight">Întrebări Frecvente</h2>
                    </div>

                    <div className="space-y-4 px-4 text-left">
                        {[
                            { q: `Cât de rezistent este materialul ${material.name.toLowerCase()} la exterior?`, a: "Toate materialele noastre sunt tratate pentru rezistență UV și intemperii. Durata medie de viață în condiții de exterior depinde de expunerea la soare, variind între 2 și 5 ani." },
                            { q: "Pot comanda o dimensiune atipică?", a: "Absolut! În configuratorul online poți introduce dimensiunile exacte de care ai nevoie (lățime și înălțime), iar prețul se va calcula instantaneu." },
                            { q: "Ce tip de fișier trebuie să trimit pentru print?", a: "Recomandăm fișiere vectoriale (PDF, EPS) sau grafică raster de înaltă rezoluție (TIFF, JPG) la minim 150-300 dpi la scara 1:1." },
                            { q: "Oferiți mostre de material?", a: "Putem trimite un catalog de mostre fizice pe bază de cerere pentru clienții B2B care doresc să verifice textura și opacitatea materialelor înainte de o comandă mare." }
                        ].map((faq, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all group shadow-sm">
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
            <div className="py-20 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: ShieldCheck, label: "Testat Industrial", desc: "Standarde de Calitate" },
                            { icon: Truck, label: "Logisitică Rapidă", desc: "Livrare Securizată" },
                            { icon: Palette, label: "Cromatism HD", desc: "Cerneluri Latex Eco" },
                            { icon: Sparkles, label: "Control Calitate", desc: "Verificare 1:1" }
                        ].map((item, i) => (
                            <div key={i} className="text-center group flex flex-col items-center">
                                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-emerald-500 mb-4 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                    <item.icon size={20} />
                                </div>
                                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1">{item.label}</h4>
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
