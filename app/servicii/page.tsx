import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowRight, Settings, Zap, ClipboardCheck, Sparkles } from 'lucide-react';
import { SERVICII_DATA } from '@/lib/seo/serviciiData';

export const metadata: Metadata = {
    title: 'Servicii și Finisaje Profesional de Print',
    description: 'De la tăiere pe contur la laminare UV și sisteme de prindere. Descoperă serviciile noastre de finisare premium pentru orice tip de print.',
  alternates: { canonical: 'https://www.tablou.net/servicii' }
};

export default function ServiciiIndex() {
    return (
        <div className="min-h-screen bg-[#fafbfc] selection:bg-emerald-500 selection:text-white">
            {/* Hero */}
            <div className="pt-32 pb-24 bg-white border-b border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
                
                <div className="container mx-auto px-6 relative z-10 text-center lg:text-left">
                    <div className="max-w-4xl mx-auto lg:mx-0">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg font-black text-[10px] uppercase tracking-widest mb-6 border border-emerald-100 italic">
                            <Sparkles size={14} /> STANDARD DE CALITATE
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-8 uppercase italic">
                            Finisaje de <br /> <span className="text-emerald-500 not-italic uppercase">Înaltă Precizie.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0 italic opacity-80">
                            Detalii care fac diferența. Un print bun are nevoie de un finisaj impecabil pentru a rezista și a impresiona.
                        </p>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="py-24 container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {SERVICII_DATA.map((srv) => (
                        <Link
                            key={srv.id}
                            href={`/servicii/${srv.slug}`}
                            className="group bg-white rounded-[3rem] border border-slate-100 p-10 hover:shadow-2xl hover:border-emerald-200 transition-all duration-500 hover:-translate-y-2 flex flex-col items-center text-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 group-hover:w-2 transition-all" />
                            
                            <div className="w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center text-emerald-500 mb-8 border border-slate-50 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm group-hover:rotate-6">
                                <Settings size={36} strokeWidth={2.5} />
                            </div>
                            
                            <h3 className="text-2xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors mb-4 uppercase tracking-tighter italic">
                                {srv.name.split(' (')[0]}
                            </h3>
                            
                            <p className="text-slate-500 text-lg font-medium leading-relaxed mb-10 italic">
                                {srv.description}
                            </p>

                            <div className="grid grid-cols-2 gap-4 w-full mb-10 text-left">
                                {srv.processSteps.slice(0, 2).map((step, i) => (
                                    <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-transparent">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Pasul 0{i+1}</p>
                                        <p className="font-bold text-slate-700 text-sm italic tracking-tight">{step.step}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest group-hover:bg-emerald-500 transition-all active:scale-95 shadow-xl shadow-slate-950/20 group-hover:shadow-emerald-500/30">
                                Vezi Detalii <ArrowRight size={16} />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <section className="py-32 bg-slate-900 text-white mx-4 md:mx-6 rounded-[4rem] mb-20 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500 rounded-full blur-[160px]" />
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase mb-6 italic leading-none">
                        GATA PENTRU <br /> <span className="text-emerald-500 not-italic">MONTAJ IMEDIAT.</span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto font-medium text-lg mb-12 italic">
                        Livrăm printuri finisate complet, gata de utilizare. Fără bătăi de cap, fără improvizate.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/" className="px-10 py-5 bg-emerald-500 text-white rounded-2xl font-black text-lg hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 uppercase italic tracking-tighter">
                            Alege Produsul <Zap size={20} fill="white" className="inline ml-2" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
