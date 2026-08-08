"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { bannerProducts } from "@/lib/products/banner-products";
import { ArrowRight, ChevronRight, CheckCircle2, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BannereClient() {
    const [categoryFilter, setCategoryFilter] = useState("Toate");
    const [searchQuery, setSearchQuery] = useState("");

    // Extract categories
    const categories = useMemo(() => {
        const cats = new Set(bannerProducts.map(p => p.category));
        return ["Toate", ...Array.from(cats).sort()];
    }, []);

    // Filter products
    const filteredProducts = useMemo(() => {
        return bannerProducts.filter(product => {
            const matchesCategory = categoryFilter === "Toate" || product.category === categoryFilter;
            const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCategory && matchesSearch;
        });
    }, [categoryFilter, searchQuery]);

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Header / Hero */}
            <div className="bg-slate-900 text-white pt-32 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-5xl font-black mb-4">
                        Bannere Publicitare - Modele Predefinite
                    </h1>
                    <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-8">
                        Alege dintr-o gamă variată de modele pentru afacerea ta. Imobiliare, Auto, HoReCa și multe altele.
                        Personalizează dimensiunile și comandă online!
                    </p>
                    <div className="flex justify-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                            <CheckCircle2 size={18} /> Print Outdoor
                        </div>
                        <div className="flex items-center gap-2 text-emerald-400 font-bold bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                            <CheckCircle2 size={18} /> Tiv & Capse Incluse
                        </div>
                        <div className="flex items-center gap-2 text-emerald-400 font-bold bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                            <CheckCircle2 size={18} /> Livrare Rapidă
                        </div>
                    </div>
                </div>
            </div>

            {/* Breadcrumbs */}
            <div className="bg-white border-b border-gray-200 sticky top-[72px] z-30">
                <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                        <Link href="/" className="hover:text-emerald-600">Home</Link>
                        <ChevronRight size={14} />
                        <span className="font-semibold text-slate-900">Bannere</span>
                    </div>

                    {/* Search & Filter */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Caută model..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none w-full sm:w-64"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none w-full sm:w-auto appearance-none bg-white cursor-pointer"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Default Configurator CTA */}
            <div className="container mx-auto px-4 mt-8">
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-6 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-bold mb-2">Nu găsești modelul potrivit?</h2>
                        <p className="text-emerald-100">Folosește configuratorul standard și încarcă propria ta grafică sau creează una de la zero.</p>
                    </div>
                    <Link href="/configurator/banner">
                        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 h-11 px-8 bg-white text-emerald-700 hover:bg-emerald-50 font-bold shadow-md">
                            Creează de la Zero <ArrowRight className="ml-2" />
                        </button>
                    </Link>
                </div>
            </div>

            {/* Products Grid */}
            <div className="container mx-auto px-4 py-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900">
                        {categoryFilter === "Toate" ? "Toate Modelele" : categoryFilter}
                        <span className="ml-2 text-sm font-normal text-gray-500">({filteredProducts.length})</span>
                    </h2>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <p>Nu am găsit niciun banner conform criteriilor.</p>
                        <Button variant="link" onClick={() => { setCategoryFilter("Toate"); setSearchQuery(""); }}>Resetează filtrele</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <Link href={`/banner-product/${product.slug}`} key={product.id} className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1 h-full">
                                {/* Image Area */}
                                <div className="relative aspect-[3/2] bg-gray-100 overflow-hidden border-b border-gray-50">
                                    <Image
                                        src={product.image}
                                        alt={product.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                    <div className="absolute top-3 left-3">
                                        <span className="bg-slate-900/80 backdrop-blur text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide shadow-sm">
                                            {product.category}
                                        </span>
                                    </div>
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <span className="bg-white text-slate-900 font-bold px-4 py-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2">
                                            Configurează <ArrowRight size={14} />
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug group-hover:text-emerald-600 transition-colors line-clamp-2">
                                        {product.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed">
                                        {product.description}
                                    </p>

                                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                        <div>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase block">Preț</span>
                                            <span className="font-bold text-sm text-slate-800">{product.price}</span>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                            <ChevronRight size={16} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

