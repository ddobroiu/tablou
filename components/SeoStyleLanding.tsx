"use client";

import React from "react";
import Link from "next/link";
import { 
    Zap, MessageCircle, Sparkles, ShieldCheck, Truck, 
    Layers, Info, CheckCircle2, HelpCircle, ArrowRight,
    Palette, MapPin, MousePointer2, Star
} from "lucide-react";
import { StyleData } from "@/lib/seo/stiluriData";
import { useRouter } from "next/navigation";
import MasterConfigurator from "@/components/MasterConfigurator";

interface SeoStyleLandingProps {
    style: StyleData;
}

export function SeoStyleLanding({ style }: SeoStyleLandingProps) {
    const router = useRouter();
    
    const onStartConfig = () => {
        router.push(`/configurator/${style.relatedProductId}`);
        window.scrollTo(0, 0);
    };

    return (
        <div className="bg-white min-h-screen selection:bg-emerald-100 selection:text-emerald-900">
            {/* CLEAN MINIMALIST HERO */}
            <div className="w-full relative py-20 md:py-32 border-b border-slate-100 bg-[#fbfbfd]">
                <div className="absolute inset-0 opacity-40 pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                
                <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="flex-1 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-sm">
                                <Palette size={14} className="text-emerald-500" /> CURATOR DESIGN {style.name}
                            </div>
                            
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight mb-6 uppercase tracking-tighter">
                                {style.name} <br />
                                <span className="text-emerald-500 italic lowercase font-medium tracking-normal text-3xl md:text-5xl border-b-2 border-emerald-500/20">estetică și rafinament</span>
                            </h1>

                            <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0">
                                {style.description} Create special pentru a adăuga o notă de eleganță oricărui spațiu contemporan.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center lg:justify-start">
                                <button 
                                    onClick={onStartConfig}
                                    className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-emerald-500 transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95 uppercase tracking-widest"
                                >
                                    <Zap size={18} /> CONFIGURARE ONLINE
                                </button>
                                <a 
                                    href="https://wa.me/40750473111"
                                    className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold text-sm hover:border-emerald-500 hover:text-emerald-500 transition-all flex items-center justify-center gap-3 active:scale-95 uppercase tracking-widest"
                                >
                                    <MessageCircle size={18} /> CONTACT WHATSAPP
                                </a>
                            </div>

                            <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                                {style.keyElements.map((el: string, i: number) => (
                                    <span key={i} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-md text-[9px] font-bold text-slate-400 tracking-widest uppercase">
                                        {el}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 w-full max-w-[500px] lg:max-w-none">
                            <div className="relative p-3 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl">
                                <div className="rounded-[2rem] overflow-hidden aspect-square">
                                    <img 
                                        src={style.image} 
                                        alt={style.name} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute -bottom-6 -left-6 p-6 bg-white border border-slate-100 shadow-2xl rounded-2xl hidden md:block max-w-[200px]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Star size={14} className="text-emerald-500 fill-emerald-500" />
                                        <span className="text-[8px] font-black uppercase text-slate-400">CALITATE PREMIUM</span>
                                    </div>
                                    <p className="text-xs font-bold text-slate-800 leading-tight">Materiale selectate manual pentru {style.name}.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ARTISTIC KEY ELEMENTS - CLEAN */}
            <div className="py-24 bg-white border-b border-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {style.keyElements.map((el: string, i: number) => (
                                    <div key={i} className="p-8 bg-[#fafbfc] rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all group">
                                        <div className="w-10 h-10 bg-white border border-slate-100 text-emerald-500 rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                            <CheckCircle2 size={20} />
                                        </div>
                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-2">{el}</h4>
                                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Atribut Selecționat</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="order-1 lg:order-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg text-slate-400 text-[9px] font-black uppercase tracking-widest mb-6">
                                <Layers size={14} /> FILOZOFIA DESIGNULUI
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase mb-6 leading-tight">Anatomia <br /> <span className="text-emerald-500 italic">vizuală a stilului.</span></h2>
                            <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10 max-w-xl">
                                {style.longDescription}
                            </p>
                            <button onClick={onStartConfig} className="px-8 py-4 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-slate-900 transition-all uppercase tracking-widest flex items-center gap-2">
                                Începe Acum <Zap size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MATCHING SPACES - WHITE */}
            <div className="py-24 bg-[#fbfbfd]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-400 text-[9px] font-black uppercase tracking-widest mb-4 shadow-sm">
                            <MapPin size={14} /> AMPLASAMENT RECOMANDAT
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-tight mb-4">Unde se potrivește?</h2>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {style.matchingSpaces.map((space: string, i: number) => (
                            <div key={i} className="p-8 bg-white border border-slate-100 rounded-2xl text-center hover:border-emerald-500 transition-all group shadow-sm">
                                <h4 className="text-base font-black text-slate-900 uppercase tracking-tight group-hover:text-emerald-500 transition-colors leading-none">{space}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CONFIGURATOR PREVIEW - CLEAN WHITE */}
            <div className="py-24 bg-white">
                <div className="max-w-[1440px] mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg text-slate-400 text-[9px] font-black uppercase tracking-widest mb-4">
                            <MousePointer2 size={16} className="text-emerald-500" /> CATALOG ACTUALIZAT {new Date().getFullYear()}
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-tight">Produsul tău, <span className="text-emerald-500 italic">stilul tău.</span></h2>
                    </div>
                    
                    <div className="bg-white border border-slate-100 rounded-[3rem] shadow-sm overflow-hidden">
                        <MasterConfigurator />
                    </div>
                </div>
            </div>

            {/* STYLE FAQ - MINIMALIST */}
            <div className="py-24 bg-[#fbfbfd] border-t border-slate-100">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-16 px-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-400 text-[9px] font-black uppercase tracking-widest mb-4">
                            <HelpCircle size={14} className="text-emerald-500" /> SUPORT DETALII
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-tight">Întrebări Frecvente</h2>
                    </div>

                    <div className="space-y-4 px-4">
                        { [
                            { q: `Cum pot fi sigur că designul meu se pliază pe stilul ${style.name.toLowerCase()}?`, a: `Dacă nu ai propria ta grafică, poți cere ajutorul echipei noastre de DTP pe WhatsApp. Ne asigurăm că orice element (font, culori) respectă estetica ${style.name.toLowerCase()} selectată.` },
                            { q: "Ce tip de material recomandați pentru acest stil?", a: `Pentru stilul ${style.name.toLowerCase()}, recomandăm de obicei suporturi cu finisaj mat (canvas bumbac sau PVC mat) pentru a evita reflexiile inestetice și a păstra o notă elegantă.` },
                            { q: "Puteți crea un colaj pentru acest stil?", a: "Da! Putem armoniza mai multe imagini într-un colaj care să respecte aceeași paletă cromatică și stilistică pentru un impact maxim pe un perete mare." },
                            { q: "Imaginile mele pierd din calitate la printare?", a: "Toate fișierele trimise sunt evaluate automat pentru rezoluție. Dacă imaginea este prea „mică”, te contactăm imediat pentru o alternativă sau optimizare." }
                        ].map((faq: { q: string; a: string }, i: number) => (
                            <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all group">
                                <h4 className="text-base font-black text-slate-900 mb-4 flex items-start gap-3 uppercase tracking-tight">
                                    <span className="text-emerald-500">{i+1}.</span> {faq.q}
                                </h4>
                                <div className="pl-6 text-slate-500 text-sm font-medium leading-relaxed border-l border-slate-100 group-hover:border-emerald-500 transition-colors">
                                    {faq.a}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* TRUST FOOTER - REFINED WHITE */}
            <div className="bg-white py-20 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: ShieldCheck, label: "Verificare 1:1", desc: "Calitate CONTROLATĂ" },
                            { icon: Truck, label: "Ambalare Lux", desc: "Protecție TOTALĂ" },
                            { icon: Palette, label: "Culori LatEx", desc: "Eco-Friendly HD" },
                            { icon: Sparkles, label: "Finisaj Manual", desc: "Atenție la Detalii" }
                        ].map((item: any, i: number) => (
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
