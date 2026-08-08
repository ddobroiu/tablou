"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import Image from "next/image";
import { ShoppingCart, Info, Check, MessageCircle, X, ExternalLink, ChevronDown } from "lucide-react";
import DeliveryEstimation from "./DeliveryEstimation";
import { signageProducts } from "@/lib/products/signage-products";
import { formatMoneyDisplay } from "@/lib/pricing";
import { NumberInput } from "./ui/NumberInput";

const DIMENSIONS = [
    { label: "Standard (vezi descriere)", value: "standard", multiplier: 1 },
    { label: "A4 (21 x 29.7 cm)", value: "a4", multiplier: 1.5 },
    { label: "A3 (29.7 x 42 cm)", value: "a3", multiplier: 2.5 },
    { label: "30 x 40 cm", value: "30x40", multiplier: 3 },
    { label: "50 x 70 cm", value: "50x70", multiplier: 6 },
] as const;
interface SignageConfiguratorProps {
    productSlug?: string;
}

export default function SignageConfigurator({ productSlug: propSlug }: SignageConfiguratorProps = {}) {
    const searchParams = useSearchParams();
    const productSlug = propSlug || searchParams.get('product');
    const { addItem } = useCart();

    // Determine current product
    const currentProduct = useMemo(() => {
        if (!productSlug) return null;
        return signageProducts.find(p => p.slug === productSlug);
    }, [productSlug]);

    const [quantity, setQuantity] = useState(1);
    const [selectedDim, setSelectedDim] = useState<typeof DIMENSIONS[number]>(DIMENSIONS[0]);
    
    // Support for variants (PrintCenter products)
    const hasVariants = !!(currentProduct && currentProduct.variants && currentProduct.variants.length > 0);
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

    // Group variants by material if possible
    const groupedVariants = useMemo(() => {
        if (!hasVariants || !currentProduct?.variants) return null;
        
        const groups: Record<string, typeof currentProduct.variants> = {};
        currentProduct.variants.forEach(v => {
            const material = v.name.split(' / ')[0] || 'Altele';
            if (!groups[material]) groups[material] = [];
            groups[material].push(v);
        });
        return groups;
    }, [hasVariants, currentProduct]);

    const [activeMaterial, setActiveMaterial] = useState<string | null>(null);

    useEffect(() => {
        if (groupedVariants) {
            setActiveMaterial(Object.keys(groupedVariants)[0]);
        }
    }, [groupedVariants]);

    // Price calculation
    const itemPrice = useMemo(() => {
        if (!currentProduct) return 0;
        if (hasVariants && currentProduct.variants) {
            return currentProduct.variants[selectedVariantIndex]?.price || currentProduct.price;
        }
        return currentProduct.price * selectedDim.multiplier;
    }, [currentProduct, hasVariants, selectedVariantIndex, selectedDim]);

    const finalPrice = itemPrice * quantity;

    function handleAddToCart() {
        if (!currentProduct) return;

        const variantName = hasVariants && currentProduct.variants 
            ? currentProduct.variants[selectedVariantIndex].name 
            : selectedDim.label;

        addItem({
            id: `signage-${currentProduct.id}-${hasVariants ? 'v'+selectedVariantIndex : selectedDim.value}-${Date.now()}`,
            productId: currentProduct.id,
            title: `Semnalistica: ${currentProduct.title}`,
            price: itemPrice,
            quantity: quantity,
            metadata: {
                "Opțiune Selectată": variantName,
                "Dimensiune Originală": currentProduct.dimensions,
                "Categorie": currentProduct.category,
                ...(hasVariants ? { "Tip": "Listă Variante" } : { "Tip": "Configurabil" })
            },
            image: currentProduct.image
        });
    }

    if (!currentProduct && productSlug) {
        return <div className="p-10 text-center">Produsul nu a fost găsit.</div>;
    }

    if (!currentProduct) {
        return <div className="p-10 text-center">Niciun produs selectat.</div>;
    }

    return (
        <main className="bg-slate-50 dark:bg-slate-800 min-h-screen py-10">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* Left: Image & Info */}
                    <div className="w-full lg:w-1/2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 sticky top-24">
                        <div className="aspect-square relative flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden mb-6 border border-slate-100">
                            <Image
                                src={currentProduct.image}
                                alt={currentProduct.title}
                                fill
                                className="object-contain hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-100">
                                <span className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Categorie</span>
                                <span className="font-bold text-slate-900 dark:text-white">{currentProduct.category}</span>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-100">
                                <span className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">ID Produs</span>
                                <span className="font-bold text-slate-900 dark:text-white">#{currentProduct.id}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Configurator */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-6">
                        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                            <div className="mb-6">
                                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-3">Produs în Stoc</span>
                                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight">{currentProduct.title}</h2>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">{currentProduct.description}</p>
                                
                                <div className="flex flex-wrap gap-3 mb-4">
                                    <a href="https://wa.me/40750473111" target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex justify-center items-center bg-[#25D366] text-white font-bold px-4 py-2.5 rounded-xl hover:bg-[#128C7E] transition-all text-xs uppercase tracking-wide">
                                        WhatsApp
                                    </a>
                                    <Link href="/contact" className="flex-1 inline-flex justify-center items-center bg-slate-100 text-slate-800 dark:text-slate-200 font-bold px-4 py-2.5 rounded-xl hover:bg-slate-200 transition-all text-xs uppercase tracking-wide border border-slate-200">
                                        Cere Ofertă
                                    </Link>
                                </div>
                            </div>

                            <hr className="my-8 border-slate-100" />

                            {/* Configuration Logic */}
                            {hasVariants && groupedVariants && currentProduct.variants ? (
                                <div className="space-y-8">
                                    {/* Material Tabs */}
                                    <div>
                                        <label className="block text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.15em] mb-4">1. Alege Materialul</label>
                                        <div className="flex flex-wrap gap-2">
                                            {Object.keys(groupedVariants).map((mat) => (
                                                <button
                                                    key={mat}
                                                    onClick={() => setActiveMaterial(mat)}
                                                    className={`px-6 py-3 rounded-full text-sm font-black transition-all border ${activeMaterial === mat 
                                                        ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200" 
                                                        : "bg-white text-slate-600 dark:text-slate-400 border-slate-200 hover:border-slate-400"}`}
                                                >
                                                    {mat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Variant List for active material */}
                                    {activeMaterial && (
                                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                            <label className="block text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.15em] mb-4">2. Alege Dimensiunea</label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {groupedVariants[activeMaterial].map((variant) => {
                                                    const vIndex = currentProduct.variants!.indexOf(variant);
                                                    const sizeLabel = variant.name.split(' / ')[1] || variant.name;
                                                    return (
                                                        <button
                                                            key={variant.name}
                                                            onClick={() => setSelectedVariantIndex(vIndex)}
                                                            className={`p-4 rounded-2xl border text-left transition-all group relative overflow-hidden ${selectedVariantIndex === vIndex 
                                                                ? "border-emerald-500 bg-emerald-50/30 ring-2 ring-emerald-500/20" 
                                                                : "border-slate-100 bg-slate-50 dark:bg-slate-800/30 hover:border-slate-300 hover:bg-white"}`}
                                                        >
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="font-black text-slate-900 dark:text-white text-sm group-hover:text-emerald-600 transition-colors">{sizeLabel}</span>
                                                                {selectedVariantIndex === vIndex && <Check size={16} className="text-emerald-500" />}
                                                            </div>
                                                            <span className="block text-xs font-bold text-slate-500">{formatMoneyDisplay(variant.price)}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Default Dimension Selector for non-variant products */
                                <div className="mb-6">
                                    <label className="block text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.15em] mb-4">Alege Dimensiunea</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {DIMENSIONS.map((dim) => (
                                            <button
                                                key={dim.value}
                                                onClick={() => setSelectedDim(dim)}
                                                className={`p-4 rounded-2xl border text-left transition-all group relative ${selectedDim.value === dim.value 
                                                    ? "border-emerald-500 bg-emerald-50/30 ring-2 ring-emerald-500/20" 
                                                    : "border-slate-100 bg-slate-50 dark:bg-slate-800/30 hover:border-slate-300 hover:bg-white"}`}
                                            >
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-black text-slate-900 dark:text-white text-sm">{dim.label}</span>
                                                    {selectedDim.value === dim.value && <Check size={16} className="text-emerald-500" />}
                                                </div>
                                                {dim.multiplier > 1 ? (
                                                    <span className="text-xs font-bold text-emerald-600 block">
                                                        +{formatMoneyDisplay(currentProduct.price * (dim.multiplier - 1))}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs font-bold text-slate-400 block">Preț de bază</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
                                <NumberInput label="Cantitate" value={quantity} onChange={setQuantity} />
                                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50">
                                    <DeliveryEstimation />
                                </div>
                            </div>
                        </div>

                        {/* Custom Configuration Links */}
                        <div className="bg-slate-900 rounded-3xl p-6 shadow-xl text-white">
                            <h3 className="font-black text-lg mb-2 flex items-center gap-2">
                                <Info size={20} className="text-emerald-400" />
                                Ai nevoie de altceva?
                            </h3>
                            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                                Putem produce semne pe orice material (Plexiglass, Alucobond, etc.) și la orice dimensiune dorești.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <a
                                    href="/configurator/autocolante"
                                    className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/10 hover:bg-white/20 transition-all text-sm font-bold group"
                                >
                                    <span>Configurator Autocolante</span>
                                    <ExternalLink size={14} className="opacity-50 group-hover:opacity-100" />
                                </a>
                                <a
                                    href="/materiale/pvc-forex"
                                    className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/10 hover:bg-white/20 transition-all text-sm font-bold group"
                                >
                                    <span>Configurator PVC/Plăci</span>
                                    <ExternalLink size={14} className="opacity-50 group-hover:opacity-100" />
                                </a>
                            </div>
                        </div>

                        {/* Sticky Action Footer */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20 flex flex-col sm:flex-row items-center justify-between gap-6 sticky bottom-4 z-40">
                            <div>
                                <span className="block text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">Preț Total</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="block text-4xl font-black text-slate-900 dark:text-white">{formatMoneyDisplay(finalPrice)}</span>
                                    <span className="text-xs font-bold text-slate-400 uppercase">TVA inclus</span>
                                </div>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                className="w-full sm:w-auto px-10 py-5 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 text-lg"
                            >
                                <ShoppingCart size={22} />
                                Adaugă în Coș
                            </button>
                        </div>

                        {/* Contact Assist */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                            <a
                                href={`https://wa.me/40750473111?text=Buna%20ziua,%20ma%20intereseaza%20o%20oferta%20pentru%20${currentProduct.title}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-3 bg-[#25D366] text-white font-black py-4 rounded-2xl shadow-lg shadow-green-500/20 hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all text-xs uppercase tracking-widest"
                            >
                                <MessageCircle size={20} />
                                WhatsApp Suport
                            </a>
                            <button
                                type="button"
                                onClick={() => window.location.href = '/contact'}
                                className="flex items-center justify-center gap-3 bg-slate-100 text-slate-900 dark:text-white font-black py-4 rounded-2xl hover:bg-slate-200 transition-all text-xs uppercase tracking-widest border border-slate-200"
                            >
                                <Info size={20} />
                                Cerere Ofertă
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}
