"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { euFundsProducts } from "@/lib/products/eu-funds-products";
import { ArrowRight, ChevronRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EuFundsShopPage() {
    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Header / Hero */}
            <div className="bg-slate-900 text-white pt-32 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-5xl font-black mb-4">
                        Kituri Vizibilitate Fonduri Europene
                    </h1>
                    <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-8">
                        Soluții complete de vizibilitate și publicitate pentru proiecte PNRR, POR, POCU, Start-Up Nation și altele.
                        Garanție 100% conformitate cu manualul de identitate vizuală.
                    </p>
                    <div className="flex justify-center gap-4">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                            <CheckCircle2 size={18} /> Conformitate Garantată
                        </div>
                        <div className="flex items-center gap-2 text-emerald-400 font-bold bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                            <CheckCircle2 size={18} /> Livrare Rapidă
                        </div>
                    </div>
                </div>
            </div>

            {/* Breadcrumbs */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-3 text-sm text-gray-500 flex items-center gap-2">
                    <Link href="/" className="hover:text-emerald-600">Home</Link>
                    <ChevronRight size={14} />
                    <span className="font-semibold text-slate-900">Fonduri Europene</span>
                </div>
            </div>

            {/* Products Grid */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {euFundsProducts.map((product) => (
                        <div key={product.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col hover:-translate-y-1">
                            {/* Image Area */}
                            <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                                <Image
                                    src={product.image}
                                    alt={product.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-3 left-3">
                                    <span className="bg-emerald-600/90 backdrop-blur text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow-sm">
                                        {product.program}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex flex-col flex-1">
                                <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight group-hover:text-emerald-600 transition-colors">
                                    {product.title}
                                </h3>
                                <p className="text-sm text-gray-500 mb-4 line-clamp-3 leading-relaxed">
                                    {product.description}
                                </p>

                                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                    <div>
                                        <span className="text-xs text-gray-400 font-bold uppercase block">Preț de la</span>
                                        <span className="font-black text-lg text-slate-800">{typeof product.price === 'number' ? `${product.price} LEI` : product.price}</span>
                                    </div>
                                    <Link href={`/programe-finantare/${product.slug}`}>
                                        <Button size="sm" className="rounded-full bg-slate-900 hover:bg-emerald-600 transition-colors">
                                            Configurează <ArrowRight size={14} className="ml-1" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

