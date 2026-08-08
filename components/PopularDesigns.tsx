"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { bannerProducts } from "@/lib/products/banner-products";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

interface Product {
    id: string;
    slug: string;
    title: string;
    image: string;
    category: string;
    price: string | number;
    tags?: string[];
}

interface PopularDesignsProps {
    title?: string;
    maxProducts?: number;
    currentSlug?: string;
    products?: any[]; // Allow generic structure but assume compatible fields
}

export default function PopularDesigns({
    title = "Design-uri Populare",
    maxProducts = 12,
    currentSlug,
    products = bannerProducts
}: PopularDesignsProps) {

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
        }
    };

    // Filter out current product if any and take max items
    const displayProducts = (products || [])
        .filter(p => p.slug !== currentSlug)
        .slice(0, maxProducts);

    if (displayProducts.length === 0) return null;

    return (
        <section className="w-full bg-gradient-to-br from-slate-50 to-white py-12 border-t border-slate-200 mt-12 overflow-hidden">
            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <span className="w-1 h-6 bg-emerald-600 rounded-full inline-block"></span>
                            {title}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1 pl-3">Alege un model gata făcut pentru afacerea ta.</p>
                    </div>

                    <div className="hidden sm:flex gap-2">
                        <button
                            onClick={scrollLeft}
                            className="p-2 rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-slate-50 hover:border-gray-300 transition-all shadow-sm"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={scrollRight}
                            className="p-2 rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-slate-50 hover:border-gray-300 transition-all shadow-sm"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Carousel */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scroll-smooth hide-scrollbar"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {displayProducts.map((product) => (
                        <Link
                            href={`/configurator/banner?productSlug=${product.slug}`}
                            key={product.id}
                            className="group min-w-[260px] w-[260px] sm:min-w-[300px] sm:w-[300px] bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1 block shrink-0"
                        >
                            <div className="relative aspect-[3/2] bg-gray-100 overflow-hidden border-b border-gray-50">
                                <Image
                                    src={product.image}
                                    alt={product.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    sizes="300px"
                                />
                                <div className="absolute top-2 left-2">
                                    <span className="bg-slate-900/80 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                                        {product.category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-sm font-bold text-slate-900 mb-1 leading-tight group-hover:text-emerald-600 transition-colors line-clamp-2 min-h-[2.5em]">
                                    {product.title}
                                </h3>
                                <div className="mt-2 pt-2 border-t border-gray-50 flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-500">{product.price}</span>
                                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                        Configurează <ArrowRight size={12} />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {/* View All Card */}
                    <Link href="/shop/bannere" className="min-w-[150px] bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-2 hover:bg-slate-200 hover:border-slate-400 transition-all shrink-0 text-gray-500 hover:text-gray-800">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                            <Sparkles size={20} />
                        </div>
                        <span className="font-bold text-sm">Vezi Toate</span>
                    </Link>
                </div>

                <div className="mt-6 text-center sm:hidden">
                    <Link href="/shop/bannere" className="text-emerald-600 font-bold text-sm flex items-center justify-center gap-1">
                        Vezi toate modelele <ArrowRight size={14} />
                    </Link>
                </div>

            </div>
        </section>
    );
}

