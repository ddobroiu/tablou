"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { configuratorProducts } from "@/lib/products/configurator-products";
import { ArrowRight, ChevronRight, Search, Settings, Sliders } from "lucide-react";

export default function ConfiguratorShopClient() {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredProducts = useMemo(() => {
        return configuratorProducts.filter(product => {
            const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesSearch;
        });
    }, [searchQuery]);

    return (
        <div className="bg-slate-50 dark:bg-slate-800 min-h-screen pb-20">
            {/* Hero */}
            <div className="bg-slate-900 text-white pt-32 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500 text-white mb-6 shadow-lg shadow-emerald-500/20">
                        <Sliders size={32} />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
                        Configuratoare Online
                    </h1>
                    <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
                        Alege produsul, introdu dimensiunile și personalizează finisajele.
                        Vezi prețul instant și comandă online.
                    </p>
                </div>
            </div>

            {/* Breadcrumbs */}
            <div className="bg-white border-b border-gray-200 dark:border-slate-800 sticky top-[72px] z-30 shadow-sm">
                <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                        <Link href="/" className="hover:text-emerald-600">Home</Link>
                        <ChevronRight size={14} />
                        <Link href="/shop" className="hover:text-emerald-600">Shop</Link>
                        <ChevronRight size={14} />
                        <span className="font-semibold text-slate-900 dark:text-white">Configuratoare</span>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Caută produs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none w-full md:w-64"
                        />
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="container mx-auto px-4 py-12">
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <p>Nu am găsit niciun configurator.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <Link href={`/${product.routeSlug}`} key={product.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:-translate-y-1 h-full">
                                <div className="relative aspect-[3/2] bg-gray-100 overflow-hidden border-b border-gray-50">
                                    <Image
                                        src={product.image}
                                        alt={product.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 left-3">
                                        <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide shadow-sm">
                                            Configurabil
                                        </span>
                                    </div>
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <span className="bg-white text-slate-900 dark:text-white font-bold px-4 py-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2">
                                            Start Configurare <Settings size={14} />
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 transition-colors">
                                        {product.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 mb-6 line-clamp-2 leading-relaxed">
                                        {product.description}
                                    </p>
                                    <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                                        <div>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Preț de la</span>
                                            <span className="font-bold text-slate-800 dark:text-slate-200">{product.price}</span>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-emerald-500/25">
                                            <ArrowRight size={18} />
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

