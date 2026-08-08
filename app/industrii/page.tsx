"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
    ArrowRight, TrendingUp, ShieldCheck, Zap, Users, Search, 
    Layers, MousePointer2, Sparkles, Filter 
} from 'lucide-react';
import { INDUSTRIE_DATA } from '@/lib/seo/industriiData';

// Accent colors per industry for visual variety
const INDUSTRY_ACCENTS: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    horeca:             { bg: 'bg-orange-50',   text: 'text-orange-600',  border: 'border-orange-200', glow: 'shadow-orange-500/10' },
    imobiliare:         { bg: 'bg-blue-50',     text: 'text-blue-600',    border: 'border-blue-200',   glow: 'shadow-blue-500/10' },
    medical:            { bg: 'bg-teal-50',     text: 'text-teal-600',    border: 'border-teal-200',   glow: 'shadow-teal-500/10' },
    evenimente:         { bg: 'bg-purple-50',   text: 'text-purple-600',  border: 'border-purple-200', glow: 'shadow-purple-500/10' },
    retail:             { bg: 'bg-pink-50',     text: 'text-pink-600',    border: 'border-pink-200',   glow: 'shadow-pink-500/10' },
    educatie:           { bg: 'bg-yellow-50',   text: 'text-yellow-600',  border: 'border-yellow-200', glow: 'shadow-yellow-500/10' },
    auto:               { bg: 'bg-slate-50',    text: 'text-slate-600',   border: 'border-slate-200',  glow: 'shadow-slate-500/10' },
    sport:              { bg: 'bg-red-50',      text: 'text-red-600',     border: 'border-red-200',    glow: 'shadow-red-500/10' },
    constructii:        { bg: 'bg-amber-50',    text: 'text-amber-600',   border: 'border-amber-200',  glow: 'shadow-amber-500/10' },
    beauty:             { bg: 'bg-rose-50',     text: 'text-rose-600',    border: 'border-rose-200',   glow: 'shadow-rose-500/10' },
    alimentar:          { bg: 'bg-lime-50',     text: 'text-lime-600',    border: 'border-lime-200',   glow: 'shadow-lime-500/10' },
    ong:                { bg: 'bg-cyan-50',     text: 'text-cyan-600',    border: 'border-cyan-200',   glow: 'shadow-cyan-500/10' },
    turism:             { bg: 'bg-sky-50',      text: 'text-sky-600',     border: 'border-sky-200',    glow: 'shadow-sky-500/10' },
    'it-startup':       { bg: 'bg-indigo-50',   text: 'text-indigo-600',  border: 'border-indigo-200', glow: 'shadow-indigo-500/10' },
    'fonduri-europene': { bg: 'bg-emerald-50',  text: 'text-emerald-600', border: 'border-emerald-200', glow: 'shadow-emerald-500/10' },
    'tatuaje-piercing': { bg: 'bg-stone-50',    text: 'text-stone-600',   border: 'border-stone-200',  glow: 'shadow-stone-500/10' },
    'recrutare-hr':     { bg: 'bg-violet-50',   text: 'text-violet-600',  border: 'border-violet-200', glow: 'shadow-violet-500/10' },
};

// Default for any missing mapping
const DEFAULT_ACCENT = { bg: 'bg-slate-50', text: 'text-slate-900', border: 'border-slate-100', glow: 'shadow-slate-500/5' };

export default function IndustriiPage() {
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('Toate');

    const categories = ['Toate', 'Business', 'Horeca', 'Retail', 'Servicii', 'Industrial', 'Specializat'];

    const filteredIndustries = useMemo(() => {
        return INDUSTRIE_DATA.filter(ind => {
            const matchesSearch = ind.name.toLowerCase().includes(search.toLowerCase()) || 
                                 ind.description.toLowerCase().includes(search.toLowerCase());
            
            if (activeCategory === 'Toate') return matchesSearch;
            
            // Basic category mapping logic
            const slug = ind.slug;
            if (activeCategory === 'Business' && ['imobiliare', 'it-startup', 'banking', 'servicii-profesionale', 'recrutare-hr'].includes(slug)) return matchesSearch;
            if (activeCategory === 'Horeca' && ['horeca', 'alimentar', 'cofetarii-patiserii', 'turism'].includes(slug)) return matchesSearch;
            if (activeCategory === 'Retail' && ['retail', 'fashion', 'ecommerce', 'florarii-cadouri'].includes(slug)) return matchesSearch;
            if (activeCategory === 'Servicii' && ['beauty', 'medical', 'veterinar-medical', 'securitate-paza', 'curatenie-mentenanta', 'tattoo-piercing'].includes(slug)) return matchesSearch;
            if (activeCategory === 'Industrial' && ['industrial', 'logistica', 'constructii', 'agricultura'].includes(slug)) return matchesSearch;
            if (activeCategory === 'Specializat' && ['educatie', 'ong', 'fonduri-europene', 'campanii-politice', 'religios', 'administratie-publica'].includes(slug)) return matchesSearch;

            return false;
        });
    }, [search, activeCategory]);

    return (
        <div className="min-h-screen bg-[#fafafb] selection:bg-emerald-500 selection:text-white">
            {/* STUNNING HERO */}
            <div className="pt-32 pb-24 bg-white border-b border-slate-100 relative overflow-hidden">
                {/* Visual elements */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full -mr-48 -mt-48 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full -ml-32 -mb-32" />
                
                <div className="container mx-auto px-4 relative z-10 text-center lg:text-left">
                    <div className="flex flex-col lg:flex-row gap-12 items-center">
                        <div className="flex-1 max-w-4xl mx-auto lg:mx-0">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em] mb-6 border border-emerald-100">
                                <Sparkles size={14} className="animate-bounce" /> EXPERTIZA CARE FACE DIFERENȚA
                            </div>
                            
                            <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-8 uppercase">
                                SOLUȚII DE PRINT <br /> 
                                <span className="text-emerald-500 italic">PENTRU ORICE DOMENIU.</span>
                            </h1>
                            
                            <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                De la clinici medicale la showroom-uri auto, oferim semnalistică și materiale publicitare optimizate pentru succesul afacerii tale.
                            </p>
                        </div>
                        
                        {/* Stats / Interactive Pill */}
                        <div className="hidden lg:flex flex-col gap-4">
                            {[
                                { count: INDUSTRIE_DATA.length, label: 'Industrii Acoperite', icon: Layers },
                                { count: '1000+', label: 'Proiecte Custom', icon: MousePointer2 },
                                { count: '24h', label: 'Timp Producție', icon: Zap },
                            ].map((stat, i) => (
                                <div key={i} className="flex items-center gap-4 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 min-w-[280px] hover:translate-x-2 transition-transform duration-500">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-emerald-500 border border-slate-100">
                                        <stat.icon size={22} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-slate-900 leading-none mb-1">{stat.count}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* SEARCH & FILTER BAR - STICKY-ISH */}
            <div className="sticky top-20 z-40 py-6 bg-[#fafafb]/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
                <div className="container mx-auto px-4 flex flex-col md:flex-row gap-6 items-center justify-between">
                    {/* Search Input */}
                    <div className="relative w-full md:max-w-md group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                        <input 
                            type="text"
                            placeholder="Caută industria ta (ex: Medical, Retail...)"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white border-2 border-slate-100 hover:border-slate-200 focus:border-emerald-500 rounded-2xl py-4 pl-14 pr-6 font-bold text-slate-900 outline-none transition-all shadow-sm"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide no-scrollbar">
                        <Filter size={16} className="text-slate-400 hidden md:block mr-2" />
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest whitespace-nowrap transition-all ${
                                    activeCategory === cat 
                                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10' 
                                    : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* RESULTS GRID */}
            <div className="py-20 container mx-auto px-4">
                {filteredIndustries.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredIndustries.map((ind) => {
                            const accent = INDUSTRY_ACCENTS[ind.slug] ?? DEFAULT_ACCENT;
                            
                            return (
                                <Link
                                    key={ind.id}
                                    href={`/industrii/${ind.slug}`}
                                    className={`group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl ${accent.glow} hover:border-emerald-200 hover:-translate-y-2 transition-all duration-500 flex flex-col h-full overflow-hidden`}
                                >
                                    {/* Image Wrapper */}
                                    <div className="relative h-48 w-full overflow-hidden bg-slate-50 border-b border-slate-50">
                                        <img 
                                            src={ind.image} 
                                            alt={ind.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100"
                                        />
                                        <div className={`absolute top-4 left-4 inline-flex items-center px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] ${accent.bg} ${accent.text} border ${accent.border} backdrop-blur-md shadow-sm`}>
                                            {ind.slug.includes('-') ? ind.slug.split('-')[0] : 'Expertiză'}
                                        </div>
                                    </div>

                                    <div className="p-8 flex flex-col flex-1">
                                        <h3 className="text-xl font-black text-slate-800 group-hover:text-emerald-600 transition-colors mb-4 uppercase tracking-tighter leading-tight italic">
                                            {ind.name.split(' (')[0]}
                                        </h3>
                                        <p className="text-slate-500 text-xs font-bold leading-relaxed mb-6 flex-1 italic">
                                            {ind.description}
                                        </p>

                                        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                            <div className="flex -space-x-2">
                                                {[0, 1, 2].map(n => (
                                                    <div key={n} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-400">
                                                        {n + 1}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 shadow-sm">
                                                <ArrowRight size={18} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-40">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                            <Search size={40} />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 uppercase">Ups! Nu am găsit rezultate.</h3>
                        <p className="text-slate-500 mt-2 font-medium">Încearcă alte cuvinte cheie sau resetează filtrele.</p>
                        <button 
                            onClick={() => { setSearch(''); setActiveCategory('Toate'); }}
                            className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 transition-colors"
                        >
                            Vezi toate industriile
                        </button>
                    </div>
                )}
            </div>

            {/* CUSTOM SOLUTIONS CTA */}
            <div className="container mx-auto px-4 pb-20">
                <div className="bg-slate-950 rounded-[4rem] p-12 md:p-24 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 blur-[160px] rounded-full -mr-96 -mt-96" />
                    
                    <div className="max-w-4xl relative z-10">
                        <p className="text-emerald-400 font-black uppercase tracking-[0.2em] text-xs mb-6">Proiecte Strategice</p>
                        <h2 className="text-4xl md:text-7xl font-black text-white leading-[0.95] tracking-tighter mb-10 uppercase">
                            NU GĂSEȘTI DOMENIUL TĂU? <br />
                            <span className="text-emerald-500 italic">CREĂM SOLUȚII CUSTOM.</span>
                        </h2>
                        <p className="text-xl text-slate-400 font-medium leading-relaxed mb-12 max-w-2xl">
                            Avem capacitatea tehnică de a dezvolta proiecte complexe de semnalistică pentru orice tip de afacere sau instituție. Vorbește direct cu un specialist.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6">
                            <Link href="/contact" className="px-12 py-6 bg-emerald-500 text-white rounded-2xl font-black text-xl hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 text-center">
                                SOLICITĂ OCONSULTANȚĂ &rarr;
                            </Link>
                            <a href="https://wa.me/40750473111" className="px-12 py-6 bg-white/5 text-white border border-white/10 backdrop-blur-md rounded-2xl font-black text-xl hover:bg-white/10 transition-all text-center">
                                WHATSAPP
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
