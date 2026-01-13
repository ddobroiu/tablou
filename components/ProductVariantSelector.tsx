"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Check, Image as ImageIcon, Frame, Wallpaper, StickyNote, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductVariant {
    type: 'afis' | 'canvas' | 'tapet' | 'autocolant';
    title: string;
    description?: string;
    slug: string;
    price: number;
    route: string;
    configurator: string;
}

interface ProductVariantSelectorProps {
    productTitle: string;
    productImage: string;
    variants: ProductVariant[];
    onClose: () => void;
}

const VARIANT_INFO = {
    afis: {
        name: 'Afiș Premium',
        icon: StickyNote,
        description: 'Hârtie foto mată/lucioasă, ideală pentru înrămat.',
        gradient: 'from-blue-500 to-cyan-500',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-700'
    },
    canvas: {
        name: 'Tablou Canvas',
        icon: Frame,
        description: 'Pânză bumbac întinsă pe șasiu de lemn. Gata de agățat.',
        gradient: 'from-purple-600 to-pink-600',
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-700'
    },
    tapet: {
        name: 'Fototapet',
        icon: Wallpaper,
        description: 'Transformă complet peretele cu acest design impresionant.',
        gradient: 'from-emerald-500 to-teal-600',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        text: 'text-emerald-700'
    },
    autocolant: {
        name: 'Autocolant',
        icon: Sparkles,
        description: 'Sticker autoadeziv decorativ pentru suprafețe netede.',
        gradient: 'from-orange-500 to-amber-500',
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-700'
    }
};

export default function ProductVariantSelector({
    productTitle,
    productImage,
    variants,
    onClose
}: ProductVariantSelectorProps) {

    const [mounted, setMounted] = useState(false);
    const [hoveredVariant, setHoveredVariant] = useState<ProductVariant | null>(null);

    useEffect(() => {
        setMounted(true);
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleVariantClick = (variant: ProductVariant) => {
        const url = new URL(variant.route, window.location.origin);
        if (productImage) url.searchParams.set('image', productImage);
        if (variant.title) url.searchParams.set('title', variant.title);
        window.location.href = url.toString();
    };

    if (!mounted) return null;

    const displayTitle = hoveredVariant?.title || productTitle;

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 font-sans">
                {/* Backdrop cu Blur */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                />

                {/* Modal Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
                    transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                    className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] ring-1 ring-slate-900/5"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-50 p-2 bg-white/80 hover:bg-white backdrop-blur-md rounded-full text-slate-800 hover:text-red-500 transition-all shadow-lg hover:rotate-90 duration-300"
                    >
                        <X size={24} strokeWidth={2.5} />
                    </button>

                    {/* LEFT SIDE: Image Preview */}
                    <div className="md:w-5/12 lg:w-1/2 relative h-56 md:h-auto bg-slate-100 overflow-hidden group">
                        <img
                            src={productImage}
                            alt={displayTitle}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-90" />

                        <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-10">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 mb-4 text-xs font-bold tracking-widest uppercase bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-indigo-300 shadow-sm transition-all duration-300">
                                <ArrowRight size={12} className={hoveredVariant ? "rotate-0" : "rotate-90"} /> {hoveredVariant ? hoveredVariant.type.toUpperCase() : "Model Premium"}
                            </span>
                            <h2 className="text-2xl lg:text-3xl font-bold leading-tight drop-shadow-md mb-2 min-h-[4rem] transition-all duration-300">
                                {displayTitle}
                            </h2>
                            <p className="text-slate-300 text-sm font-medium line-clamp-2 opacity-90 transition-opacity duration-300">
                                {hoveredVariant?.description || "Alege varianta perfectă pentru spațiul tău. Calitate premium garantată."}
                            </p>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Options */}
                    <div className="flex-1 p-6 lg:p-10 overflow-y-auto bg-white">
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                                Configurează produsul
                            </h3>
                            <p className="text-slate-500 text-sm uppercase font-bold tracking-wider">
                                Alege suportul dorit
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {variants.map((variant, index) => {
                                const info = (VARIANT_INFO as any)[variant.type];
                                const Icon = info.icon;

                                return (
                                    <motion.button
                                        key={variant.type}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.08 }}
                                        onMouseEnter={() => setHoveredVariant(variant)}
                                        onMouseLeave={() => setHoveredVariant(null)}
                                        onClick={() => handleVariantClick(variant)}
                                        className="group relative flex items-center gap-5 p-4 rounded-2xl border-2 border-slate-100 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 bg-white text-left w-full overflow-hidden"
                                    >
                                        {/* Hover Gradient Background */}
                                        <div className={`absolute inset-0 bg-gradient-to-r ${info.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                                        {/* Icon Container */}
                                        <div className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${info.bg} ${info.text}`}>
                                            <Icon size={28} strokeWidth={1.5} />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-bold text-lg text-slate-900 group-hover:text-indigo-900 transition-colors truncate pr-2">
                                                    {info.name}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500 group-hover:text-slate-600 transition-colors line-clamp-1">
                                                {info.description}
                                            </p>
                                        </div>

                                        {/* Price Badge */}
                                        <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:border-indigo-100 group-hover:text-indigo-600 transition-all shadow-sm">
                                            <span className="text-xs font-bold text-slate-400 uppercase">de la</span>
                                            <span className="font-bold text-slate-900">{variant.price} lei</span>
                                        </div>

                                        {/* Arrow Action (Hidden by default, shown on hover) */}
                                        {/* <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100">
                                            <ArrowRight size={24} strokeWidth={2.5} />
                                        </div> */}
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Footer Note */}
                        <div className="mt-8 pt-6 border-t border-slate-50 flex justify-center">
                            <div className="inline-flex items-center gap-6 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
                                    <Check size={14} className="text-green-500 stroke-[3]" />
                                    <span>Livrare 24-48h</span>
                                </div>
                                <div className="w-px h-3 bg-slate-300" />
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
                                    <Check size={14} className="text-green-500 stroke-[3]" />
                                    <span>Retur 14 zile</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    );
}
