import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowRight, Settings, Zap, ShieldCheck } from 'lucide-react';
import { MATERIALE_DATA } from '@/lib/seo/materialeData';

export const metadata: Metadata = {
    title: 'Materiale și Suporturi de Print',
    description: 'Descoperă gama completă de materiale de print: Banner Mesh, Autocolant Sablat, Blueback, Plexiglass Opal. Specificații tehnice și utilizări recomandate.',
  alternates: { canonical: 'https://www.tablou.net/material' }
};

export default function MaterialeIndex() {
    return (
        <div className="min-h-screen bg-slate-50 selection:bg-emerald-500 selection:text-white">
            {/* Hero */}
            <div className="pt-32 pb-20 bg-white border-b border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-emerald-50/50 to-transparent blur-3xl pointer-events-none"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-3xl">
                        <p className="text-emerald-600 font-bold uppercase tracking-[0.2em] text-sm mb-4">Ghid de Materiale</p>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-8 uppercase italic">
                            Suporturi de <br /> <span className="text-emerald-500 not-italic">Print Premium.</span>
                        </h1>
                        <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl">
                            Nu toate materialele sunt create egal. Alege suportul potrivit proiectului tău, de la fațade de bloc la vitrine de lux.
                        </p>
                    </div>
                </div>
            </div>

            {/* Materials Grid */}
            <div className="py-20 container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {MATERIALE_DATA.map((mat) => (
                        <Link
                            key={mat.id}
                            href={`/material/${mat.slug}`}
                            className="group bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-emerald-200 hover:-translate-y-2 transition-all duration-500 flex flex-col h-full overflow-hidden"
                        >
                            <div className="h-48 bg-slate-50 border-b border-slate-50 overflow-hidden p-8 flex items-center justify-center">
                                <img 
                                    src={mat.image} 
                                    alt={mat.name} 
                                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                            <div className="p-8 flex flex-col flex-1">
                                <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">
                                    <Settings size={12} className="text-emerald-500" /> Specificații Profesionale
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors mb-3 leading-tight italic uppercase">
                                    {mat.name.split(' (')[0]}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
                                    {mat.description}
                                </p>

                                <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                                    <span className="text-xs font-black uppercase text-slate-400 tracking-widest group-hover:text-emerald-500 transition-colors">
                                        Vezi detalii tehnice
                                    </span>
                                    <div className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
                                        <ArrowRight size={18} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Trust Banner */}
            <section className="py-24 bg-slate-950 text-white mx-6 rounded-[3rem] mb-20 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full" />
                <div className="container mx-auto px-10 relative z-10 text-center">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-8 italic">
                        Calitate <span className="text-emerald-500">Garantată.</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
                        <div className="flex flex-col items-center">
                            <Zap className="text-emerald-500 mb-4" size={32} />
                            <h4 className="font-bold text-lg mb-2">Print UV HD</h4>
                            <p className="text-slate-500 text-sm">Culori vibrante cu rezistență maximă la raze solare.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <ShieldCheck className="text-emerald-500 mb-4" size={32} />
                            <h4 className="font-bold text-lg mb-2">DTP Verificat</h4>
                            <p className="text-slate-500 text-sm">Verificăm manual proporțiile și rezoluția fișierelor.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <Settings className="text-emerald-500 mb-4" size={32} />
                            <h4 className="font-bold text-lg mb-2">Debitări Precise</h4>
                            <p className="text-slate-500 text-sm">Finisaje mecanice sau laser la milimetru.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
