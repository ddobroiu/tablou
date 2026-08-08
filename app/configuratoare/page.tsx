import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { ArrowRight, Settings, Zap, ShieldCheck, Box } from 'lucide-react';
import { CONFIGURATORS_REGISTRY } from '@/lib/configurators-registry';

export const metadata: Metadata = {
    title: 'Configuratoare Online Print - Calculator de Preț',
    description: 'Folosește configuratoarele noastre online pentru bannere, autocolante, canvas și materiale publicitare. Calculează prețul instant și comandă personalizat.',
    alternates: { canonical: 'https://www.tablou.net/configuratoare' }
};

export default function ConfiguratoarePage() {
    return (
        <div className="min-h-screen bg-slate-50 selection:bg-emerald-500 selection:text-white">
            {/* Hero Section */}
            <div className="pt-32 pb-20 bg-white border-b border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-emerald-50/50 to-transparent blur-3xl pointer-events-none"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-100">
                            <Zap size={12} fill="currentColor" /> Producție Directă
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-8">
                            Control Total. <br /> <span className="text-emerald-500 italic">Calculator de Preț.</span>
                        </h1>
                        <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl">
                            Alege produsul dorit și configurează-l exact pe dimensiunile tale. Sistemul nostru calculează prețul pe loc, incluzând finisajele și materialele selectate.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="py-20 container mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {CONFIGURATORS_REGISTRY.map((p, index) => {
                        // Calculate starting price from bands if available
                        const startPrice = p.pricing?.bands?.[0]?.price;
                        const priceUnit = p.pricing?.type === 'per_sqm' ? 'mp' : 'buc';
                        const displayPrice = startPrice ? `De la ${startPrice} LEI/${priceUnit}` : p.turnaroundTime;

                        return (
                            <Link 
                                key={p.id} 
                                href={p.url || `/configurator/${p.slug || p.id}`}
                                className="group flex flex-col h-full"
                            >
                                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-emerald-200 transition-all duration-500 flex flex-col h-full overflow-hidden relative">
                                    {/* Image Container */}
                                    <div className="aspect-square relative bg-slate-50/50 p-8 flex items-center justify-center overflow-hidden">
                                        <Image 
                                            src={p.image || '/placeholder.png'} 
                                            alt={p.name}
                                            fill
                                            className="object-contain p-8 group-hover:scale-110 transition-transform duration-700"
                                            priority={index < 4}
                                            loading={index < 4 ? undefined : "lazy"}
                                        />
                                        <div className="absolute top-4 right-4 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                            <div className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-emerald-500">
                                                <Settings size={20} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-8 flex flex-col flex-1">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">{p.category}</span>
                                            <div className="h-1 w-1 bg-slate-200 rounded-full" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{displayPrice}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight mb-4">
                                            {p.name}
                                        </h3>
                                        <p className="text-slate-400 text-sm font-medium line-clamp-3 leading-relaxed mb-8">
                                            {p.description}
                                        </p>

                                        <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                                            <span className="text-xs font-black uppercase text-slate-900 tracking-widest">Configurează &rarr;</span>
                                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all transform group-hover:rotate-12">
                                                <ArrowRight size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Features Bar */}
            <div className="py-20 bg-slate-900 text-white mx-4 md:mx-6 mb-20 rounded-[4rem] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-10">
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500 rounded-full blur-[150px]"></div>
                </div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
                                <Zap size={32} />
                            </div>
                            <h4 className="text-2xl font-black mb-4">Calcul Instant</h4>
                            <p className="text-slate-400">Prețul se modifică în timp real pe măsură ce schimbi dimensiunile sau opțiunile.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6">
                                <ShieldCheck size={32} />
                            </div>
                            <h4 className="text-2xl font-black mb-4">Garanție Calitate</h4>
                            <p className="text-slate-400">Folosim doar materiale premium și print UV de înaltă rezoluție 1440 DPI.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center mb-6">
                                <Box size={32} />
                            </div>
                            <h4 className="text-2xl font-black mb-4">Livrare Rapidă</h4>
                            <p className="text-slate-400">Toate comenzile sunt expediate prin DPD Express în 24-48 de ore de la comandă.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
