import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowRight, Scale, ShieldCheck, FileText, Award } from 'lucide-react';
import { REGLEMENTARI_DATA } from '@/lib/seo/reglementariData';

export const metadata: Metadata = {
    title: 'Norme și Semnalistică Obligatorie',
    description: 'Indicatoare SSM, Panouri PDS de Șantier și Semnalistică ISU conform legii. Producem sisteme de identificare și securitate omologate.',
  alternates: { canonical: 'https://www.tablou.net/norme' }
};

export default function NormeIndex() {
    return (
        <div className="min-h-screen bg-white selection:bg-emerald-500 selection:text-white">
            {/* Regulatory Hero */}
            <div className="pt-32 pb-24 border-b border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 border-l border-slate-100 pointer-events-none" />
                
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto lg:mx-0">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white rounded-lg font-black text-[10px] uppercase tracking-widest mb-6 italic shadow-xl">
                            <Scale size={14} className="text-emerald-500" /> DEPARTAMENT CONFORMITATE
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-8 uppercase italic">
                            Semnalistică <br /> <span className="text-emerald-500 not-italic uppercase tracking-tighter">Legislație & Norme.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0 italic">
                            Produse create special pentru a respecta reglementările în vigoare. SSM, ISU și PDS - calibrate exact pe normele ITM și Primăriei.
                        </p>
                    </div>
                </div>
            </div>

            {/* Regulatory List */}
            <div className="py-24 container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-12">
                    {REGLEMENTARI_DATA.map((reg) => (
                        <Link
                            key={reg.id}
                            href={`/norme/${reg.slug}`}
                            className="group bg-white rounded-[4rem] border border-slate-100 p-12 hover:shadow-2xl hover:border-emerald-200 transition-all duration-700 hover:-translate-y-2 flex flex-col justify-between relative overflow-hidden h-full"
                        >
                            <span className="absolute top-0 right-0 py-2 px-6 bg-slate-50 text-[10px] font-black uppercase text-slate-300 tracking-[0.3em] group-hover:bg-emerald-500 group-hover:text-white transition-all italic">
                                {reg.lawReference}
                            </span>
                            
                            <div className="flex-1">
                                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mb-8 border border-slate-50 group-hover:bg-slate-950 group-hover:text-emerald-400 transition-all shadow-sm">
                                    <FileText size={32} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors mb-4 uppercase tracking-tighter italic">
                                    {reg.name}
                                </h3>
                                <p className="text-slate-500 text-lg font-medium leading-relaxed mb-10 italic">
                                    {reg.description}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-10 border-t border-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-xs font-black uppercase text-slate-400 tracking-widest group-hover:text-slate-950 transition-colors">
                                        Vezi Normative
                                    </span>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-950 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                                    <ArrowRight size={22} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Regulatory Trust Icons */}
            <div className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
                        <div className="flex flex-col items-center">
                            <ShieldCheck className="text-emerald-500 mb-4" size={48} />
                            <h4 className="font-black uppercase tracking-widest text-sm mb-2">ITM CONFORM</h4>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-tight">Respectăm regulile ITM</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <Award className="text-emerald-500 mb-4" size={48} />
                            <h4 className="font-black uppercase tracking-widest text-sm mb-2">ISU OMOLOGAT</h4>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-tight">Materiale Ignifuge</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <Scale className="text-emerald-500 mb-4" size={48} />
                            <h4 className="font-black uppercase tracking-widest text-sm mb-2">LEGEA 50/1991</h4>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-tight">Panouri PDS Legale</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <FileText className="text-emerald-500 mb-4" size={48} />
                            <h4 className="font-black uppercase tracking-widest text-sm mb-2">HG 971/2006</h4>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-tight">Culori Standard ISO</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
