"use client";

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { canvasProducts } from '@/lib/products/canvas-products';

interface ProductCarouselProps {
    title?: string;
    currentSlug?: string;
    limit?: number;
    products?: any[];
    linkBase?: string;
}

export default function ProductCarousel({ title = "Te-ar putea interesa și...", currentSlug, limit = 8, products = canvasProducts, linkBase = "shop/canvas" }: ProductCarouselProps) {
    const displayProducts = useMemo(() => {
        // Filter out current product and get random or first N products
        let filtered = products.filter(p => p.slug !== currentSlug);
        return filtered.slice(0, limit);
    }, [currentSlug, limit, products]);

    if (displayProducts.length === 0) return null;

    return (
        <section className="py-16 border-t border-gray-100 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Sparkles className="text-emerald-500" size={24} />
                        {title}
                    </h2>
                    <Link href="/shop/canvas" className="text-emerald-600 font-bold text-sm hover:underline flex items-center gap-1">
                        Vezi toate modelele <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="relative">
                    {/* Gradient masks for scroll indication */}
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

                    <div className="flex overflow-x-auto pb-8 gap-6 snap-x py-2 px-1 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                        {displayProducts.map((product) => (
                            <div
                                key={product.id}
                                className="flex-none w-[280px] snap-center group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                            >
                                <Link href={`/${linkBase}/${product.slug}`} className="block h-full flex flex-col">
                                    <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                                        <Image
                                            src={product.image}
                                            alt={product.title}
                                            fill
                                            sizes="280px"
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        {product.price && (
                                            <div className="absolute bottom-3 right-3">
                                                <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] font-black px-2 py-1 rounded-md shadow-sm">
                                                    DE LA 79 LEI
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 flex flex-col flex-grow">
                                        <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-emerald-600 transition-colors mb-1">
                                            {product.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                                            {product.category}
                                        </p>
                                        <div className="mt-auto pt-3 border-t border-gray-50">
                                            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                                Configurează <ArrowRight size={12} />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
