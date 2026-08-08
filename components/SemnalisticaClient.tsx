"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { signageProducts } from "@/lib/products/signage-products";
import { ArrowRight, ChevronRight, CheckCircle2, Search, Filter, AlertTriangle } from "lucide-react";

export default function SemnalisticaClient() {
    const [categoryFilter, setCategoryFilter] = useState("Toate");
    const [searchQuery, setSearchQuery] = useState("");

    // Extract categories
    const categories = useMemo(() => {
        const cats = new Set(signageProducts.map(p => p.category));
        return ["Toate", ...Array.from(cats).sort()];
    }, []);

    // Filter products
    const filteredProducts = useMemo(() => {
        return signageProducts.filter(product => {
            const matchesCategory = categoryFilter === "Toate" || product.category === categoryFilter;
            const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCategory && matchesSearch;
        });
    }, [categoryFilter, searchQuery]);

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Header / Hero */}
            <div className="bg-amber-500 text-slate-900 pt-32 pb-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/caution-stripes.png')] opacity-10"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="inline-flex items-center justify-center p-3 bg-white/20 backdrop-blur rounded-full mb-6 text-white">
                        <AlertTriangle size={32} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black mb-4 text-white">
                        Semnalistică & Protecția Muncii
                    </h1>
                    <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-8 font-medium">
                        Indicatoare obligatorii, de avertizare, interdicție și informare.
                        Conforme cu normele PSI și SSM.
                    </p>
                    <div className="flex justify-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2 text-slate-900 font-bold bg-white px-4 py-2 rounded-full shadow-lg">
                            <CheckCircle2 size={18} className="text-green-600" /> Material PVC/Autocolant
                        </div>
                        <div className="flex items-center gap-2 text-slate-900 font-bold bg-white px-4 py-2 rounded-full shadow-lg">
                            <CheckCircle2 size={18} className="text-green-600" /> Rezistente Outdoor
                        </div>
                        <div className="flex items-center gap-2 text-slate-900 font-bold bg-white px-4 py-2 rounded-full shadow-lg">
                            <CheckCircle2 size={18} className="text-green-600" /> Livrare Rapidă
                        </div>
                    </div>
                </div>
            </div>

            {/* Breadcrumbs */}
            <div className="bg-white border-b border-gray-200 sticky top-[72px] z-30 shadow-sm">
                <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                        <Link href="/" className="hover:text-amber-600 font-medium">Home</Link>
                        <ChevronRight size={14} />
                        <Link href="/shop" className="hover:text-amber-600 font-medium">Shop</Link>
                        <ChevronRight size={14} />
                        <span className="font-bold text-slate-900">Semnalistică</span>
                    </div>

                    {/* Search & Filter */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Caută indicator..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none w-full sm:w-64"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none w-full sm:w-auto appearance-none bg-white cursor-pointer font-medium"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="container mx-auto px-4 py-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        {categoryFilter === "Toate" ? "Toate Indicatoarele" : categoryFilter}
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full font-bold">{filteredProducts.length}</span>
                    </h2>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <AlertTriangle size={48} className="mx-auto text-slate-300 mb-4" />
                        <p className="text-lg font-medium">Nu am găsit niciun produs conform criteriilor.</p>
                        <button
                            className="mt-4 text-amber-600 font-bold hover:underline"
                            onClick={() => { setCategoryFilter("Toate"); setSearchQuery(""); }}
                        >
                            Resetează filtrele
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <Link href={`/semnalistica-product/${product.slug}`} key={product.id} className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-amber-300 hover:-translate-y-1 h-full">
                                {/* Image Area */}
                                <div className="relative aspect-square bg-white border-b border-slate-100 p-4 flex items-center justify-center overflow-hidden">
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={product.image}
                                            alt={product.title}
                                            fill
                                            className="object-contain group-hover:scale-105 transition-transform duration-500"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    </div>
                                    <div className="absolute top-3 left-3">
                                        <span className="bg-slate-900/5 text-slate-600 text-[10px] font-bold px-2 py-1 rounded border border-slate-200 uppercase tracking-wide">
                                            {product.dimensions}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex flex-col flex-1">
                                    <div className="mb-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1 block">
                                            {product.category}
                                        </span>
                                        <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-amber-600 transition-colors line-clamp-2 min-h-[2.5em]">
                                            {product.title}
                                        </h3>
                                    </div>

                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase">Preț</span>
                                            <span className="text-lg font-black text-slate-900">{product.price.toFixed(2)} Lei</span>
                                        </div>
                                        <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-sm">
                                            <ArrowRight size={18} strokeWidth={2.5} />
                                        </button>
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
