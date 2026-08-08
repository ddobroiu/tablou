import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowRight, Palette, Sparkles, Star } from 'lucide-react';
import { STILURI_DATA } from '@/lib/seo/stiluriData';

export const metadata: Metadata = {
    title: 'Stiluri de Design și Inspirație Print',
    description: 'Explorează stilurile moderne de design interior și publicitar pentru proiectul tău: Minimalist, Retro, Industrial, Motivator și Abstract.',
  alternates: { canonical: 'https://www.tablou.net/stil' }
};

export default function StiluriIndex() {
    return (
        <div className="min-h-screen bg-white">
            {/* Style Hero */}
            <div className="pt-32 pb-24 border-b border-slate-100 relative overflow-hidden text-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#10b98111_0%,transparent_50%)]" />
                
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 text-slate-400 rounded-full font-black text-[10px] uppercase tracking-widest mb-6 border border-slate-100 shadow-sm">
                            <Palette size={14} className="text-emerald-500" /> CURATOR DESIGN VIZUAL
                        </div>
                        <h1 className="text-6xl md:text-9xl font-black text-slate-900 tracking-tighter leading-[0.8] mb-8 uppercase italic">
                            Alege Stilul <br /> <span className="text-emerald-500 not-italic uppercase tracking-tighter">Care Te Definește.</span>
                        </h1>
                        <p className="text-2xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto italic opacity-80">
                            Fiecare spațiu are o poveste. Începe-o pe a ta cu printuri care se integrează perfect în decorul tău.
                        </p>
                    </div>
                </div>
            </div>

            {/* Style List */}
            <div className="py-24 container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {STILURI_DATA.map((style) => (
                        <Link
                            key={style.id}
                            href={`/stil/${style.slug}`}
                            className="group relative h-[600px] bg-slate-900 rounded-[4rem] overflow-hidden border-8 border-white shadow-2xl transition-all duration-700 hover:-translate-y-4"
                        >
                            <img 
                                src={style.image} 
                                alt={style.name} 
                                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/20 to-slate-950" />
                            
                            <div className="absolute bottom-10 left-10 right-10 z-10">
                                <div className="flex items-center gap-2 mb-3">
                                    <Star size={16} className="text-emerald-400 fill-emerald-400" />
                                    <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">COLECȚIA RECOMANDATĂ</span>
                                </div>
                                <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-4 leading-none">
                                    {style.name}
                                </h3>
                                <p className="text-slate-300 font-medium mb-8 italic line-clamp-2">
                                    {style.description}
                                </p>
                                
                                <div className="w-16 h-16 rounded-full bg-white text-slate-950 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-xl">
                                    <ArrowRight size={24} />
                                </div>
                            </div>
                        </Link>
                    ))}
                    
                    {/* CUSTOM STYLE CALLOUT */}
                    <div className="bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-200 p-12 flex flex-col justify-center items-center text-center group h-[600px]">
                        <div className="w-20 h-20 rounded-3xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 mb-8 group-hover:text-emerald-500 group-hover:border-emerald-500 group-hover:rotate-12 transition-all">
                            <Sparkles size={40} />
                        </div>
                        <h3 className="text-3xl font-black text-slate-400 uppercase italic tracking-tighter mb-4 leading-none group-hover:text-slate-900 transition-colors">Stilul Tău <br /> Unic</h3>
                        <p className="text-slate-400 font-medium italic mb-8 group-hover:text-slate-500 transition-colors">Ai propriul design sau vrei o adaptare custom? Suntem gata de print!</p>
                        <Link href="/" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-500 transition-all active:scale-95 shadow-xl">Lansează Configurator</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
