"use client";

import React from "react";
import Link from "next/link";
import { 
    Zap, MessageCircle, Sparkles, ShieldCheck, Truck, 
    Layers, Info, CheckCircle2, HelpCircle, ArrowRight,
    MousePointer2, Settings, ClipboardList, Star, Palette
} from "lucide-react";
import { ServiceData } from "@/lib/seo/serviciiData";
import { useRouter } from "next/navigation";
import MasterConfigurator from "@/components/MasterConfigurator";

interface SeoServiceLandingProps {
    service: ServiceData;
}

export function SeoServiceLanding({ service }: SeoServiceLandingProps) {
    const router = useRouter();
    
    const onStartConfig = () => {
        router.push(`/configurator/${service.relatedProductId}`);
        window.scrollTo(0, 0);
    };

    return (
        <div className="bg-white min-h-screen selection:bg-emerald-100 selection:text-emerald-900">
            {/* CLEAN WHITE SERVICE HERO */}
            <div className="w-full relative py-20 border-b border-slate-100 bg-[#fbfbfd]">
                <div className="absolute inset-0 opacity-30 pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                
                <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="flex-1 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-sm">
                                <Sparkles size={14} className="text-emerald-500" /> SERVICII PROFESIONALE
                            </div>
                            
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6 uppercase tracking-tighter italic">
                                {service.name} <br />
                                <span className="text-emerald-500 not-italic">CALITATE GARANTATĂ</span>
                            </h1>

                            <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0">
                                {service.description} Transformăm ideile tale în realitate cu tehnologie de ultimă generație și o atenție deosebită la detalii.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center lg:justify-start">
                                <button 
                                    onClick={onStartConfig}
                                    className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 uppercase tracking-widest"
                                >
                                    <Zap size={18} /> CONFIGURARE ONLINE
                                </button>
                                <a 
                                    href="https://wa.me/40750473111"
                                    className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold text-sm hover:border-emerald-500 hover:text-emerald-500 transition-all flex items-center justify-center gap-2 active:scale-95 uppercase tracking-widest"
                                >
                                    <MessageCircle size={18} /> WHATSAPP DIRECT
                                </a>
                            </div>

                            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                                {service.benefits.map((feat: string, i: number) => (
                                    <span key={i} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-md text-[9px] font-bold text-slate-400 tracking-widest uppercase">
                                        {feat}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 w-full max-w-[500px] lg:max-w-none">
                            <div className="relative p-3 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl">
                                <div className="rounded-[2rem] overflow-hidden aspect-video">
                                    <img 
                                        src={service.image} 
                                        alt={service.name} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SERVICE PROCESS - WHITE CLEAN */}
            <div className="py-24 bg-white border-b border-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {service.benefits.map((feat: string, i: number) => (
                                    <div key={i} className="p-8 bg-[#fafbfc] rounded-2xl border border-slate-100 group hover:border-emerald-200 transition-all">
                                        <div className="w-10 h-10 bg-white border border-slate-100 text-emerald-500 rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                            <CheckCircle2 size={20} />
                                        </div>
                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-2">{feat}</h4>
                                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Atribut Serviciu</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="order-1 lg:order-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg text-slate-400 text-[9px] font-black uppercase tracking-widest mb-6">
                                <Layers size={14} /> FLUX DE LUCRU
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase mb-6 leading-tight">Proces Tehnic <br /> <span className="text-emerald-500 italic">și rigoare.</span></h2>
                            <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10 max-w-xl">
                                {service.longDescription}
                            </p>
                            <button onClick={onStartConfig} className="px-8 py-4 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-slate-900 transition-all uppercase tracking-widest flex items-center gap-2">
                                Configurează Comanda <Zap size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* PROCESS STEPS */}
            {service.processSteps && service.processSteps.length > 0 && (
                <div className="py-24 bg-[#fbfbfd]">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4 italic">Etapele realizării:</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {service.processSteps.map((step: { step: string; desc: string }, i: number) => (
                                <div key={i} className="relative group">
                                    <div className="absolute -top-4 -left-4 w-10 h-10 bg-slate-900 text-white flex items-center justify-center font-black rounded-full z-10 group-hover:bg-emerald-500 transition-colors">
                                        {i+1}
                                    </div>
                                    <div className="p-8 bg-white border border-slate-100 rounded-2xl shadow-sm h-full group-hover:border-emerald-200 transition-all">
                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-3">{step.step}</h4>
                                        <p className="text-xs text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* CONFIGURATOR PREVIEW - CLEAN WHITE */}
            <div className="py-24 bg-white">
                <div className="max-w-[1440px] mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-400 text-[9px] font-black uppercase tracking-widest mb-4 shadow-sm">
                            <MousePointer2 size={16} className="text-emerald-500" /> CATALOG DIGITAL ACTUALIZAT
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-tight italic">Personalizare <span className="text-emerald-500 not-italic">și Print.</span></h2>
                    </div>
                    
                    <div className="bg-white border border-slate-100 rounded-[3rem] shadow-sm p-4 overflow-hidden">
                        <MasterConfigurator />
                    </div>
                </div>
            </div>

            {/* FAQ SECTION - WHITE CLEAN */}
            <div className="py-24 bg-[#fbfbfd] border-t border-slate-100">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-400 text-[9px] font-black uppercase tracking-widest mb-4 shadow-sm">
                            <HelpCircle size={14} className="text-emerald-500" /> SUPORT ACTIV
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-tight">Întrebări Frecvente</h2>
                    </div>

                    <div className="space-y-4 px-4">
                        {[
                            { q: `Care este timpul de execuție pentru ${service.name.toLowerCase()}?`, a: "Majoritatea serviciilor noastre sunt finalizate în 24-48 de ore de la confirmarea bunului de tipar (BT), în funcție de volumul comenzii." },
                            { q: "Pot trimite grafica mea proprie?", a: "Absolut! În configurator poți încărca direct fișierul tău (PDF, TIFF, JPG la 300dpi). Dacă ai nevoie de ajustări, echipa noastră DTP te poate ajuta pe WhatsApp." },
                            { q: "Oferiți factură pentru firme?", a: "Toate comenzile sunt însoțite de factură fiscală. Poți introduce datele firmei tale direct la finalizarea comenzii în platformă." },
                            { q: "Cum se face livrarea produselor?", a: "Livrăm oriunde în România prin curierat rapid (Fan Courier sau SameDay). Produsele sunt ambalate în tuburi rigide sau cutii de protecție pentru a evita orice deteriorare." }
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
                            { icon: ShieldCheck, label: "Calitate Premium", desc: "Control Riguros 1:1" },
                            { icon: Truck, label: "Expediere Rapidă", desc: "Livrare prin Curier" },
                            { icon: Palette, label: "Tehnologie Latex", desc: "Culori Eco Vibrante" },
                            { icon: Sparkles, label: "Finisaje Manuale", desc: "Atenție la Detalii" }
                        ].map((item, i) => (
                            <div key={i} className="text-center group flex flex-col items-center">
                                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-emerald-500 mb-4 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                    <item.icon size={20} />
                                </div>
                                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1">{item.label}</h4>
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
