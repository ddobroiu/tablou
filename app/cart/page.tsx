"use client";

import { useCart } from "@/components/CartContext";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { getEstimatedShippingCost } from "@/lib/shippingUtils";

const DEFAULT_IMAGES: Record<string, string> = {
    'canvas': '/products/canvas/canvas-1.webp',
    'banner': '/products/banner/banner-1.webp',
    'banner-verso': '/products/banner/banner-2.webp',
    'mesh': '/products/mesh/mesh_publicitar_personalizat.jpg',
    'autocolante': '/products/autocolante/autocolante-1.webp',
    'afise': '/products/afise/afise-1.webp',
    'tapet': '/products/tapet/tapet-1.webp',
    'rollup': '/products/rollup/rollup-1.webp',
    'window-graphics': '/products/window-graphics/window-graphics-1.webp',
    'pliante': '/products/pliante/pliante-1.webp',
    'flayere': '/products/flayere/flayere-1.webp',
    'fonduri-eu': '/products/master/pachet-vizibilitate-fonduri-europene-pnrr.png',
    'plexiglass': '/products/materiale/plexiglass/plexiglass-1.webp',
    'pvc-forex': '/products/materiale/pvc-forex/pvc-forex-1.webp',
    'alucobond': '/products/materiale/alucobond/alucobond-1.webp',
    'polipropilena': '/products/master/placi-polipropilena-alveolara-canalit-ieftine.png',
};

export default function CartPage() {
    const { items, removeItem, updateQuantity, cartTotal, cartCount } = useCart();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    if (items.length === 0) {
        return (
            <div className="min-h-[80vh] bg-slate-50 flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="relative z-10 bg-white p-16 rounded-[3rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col items-center max-w-2xl w-full">
                    <div className="w-28 h-28 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-10 text-slate-300 relative">
                        <ShoppingBag size={42} strokeWidth={1.5} />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black mb-6 tracking-tight text-slate-900">Coșul tău este gol</h1>
                    <p className="text-slate-500 mb-12 max-w-sm text-lg font-medium leading-relaxed">Nu ai adăugat încă niciun produs. Explorează portofoliul nostru pentru a găsi produsele potrivite.</p>
                    <Link
                        href="/shop"
                        className="bg-slate-950 text-white px-10 h-16 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center gap-3 shadow-xl shadow-slate-900/10 hover:shadow-emerald-500/20"
                    >
                        Mergi la Produse <ArrowRight size={18} strokeWidth={2.5} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-[104px] pb-32">
            <div className="container mx-auto px-4 lg:px-8 max-w-[1400px]">
                <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-12 text-slate-900">Coșul Tău</h1>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                    {/* Items List */}
                    <div className="xl:col-span-2 space-y-6">
                        {items.map((item) => (
                            <div key={item.id} className="flex flex-col md:flex-row gap-8 bg-white border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] p-6 rounded-[2.5rem] group hover:shadow-[0_15px_50px_-15px_rgba(0,0,0,0.1)] transition-all duration-500">
                                {/* Product Image */}
                                <div className="w-full md:w-48 aspect-[4/3] md:aspect-square relative bg-slate-50 rounded-[1.5rem] overflow-hidden border border-slate-100/50">
                                    {(() => {
                                        // 1. Uploaded Image
                                        const uploaded = item.metadata?.artworkUrl;
                                        if (uploaded) return <Image src={uploaded} alt="Artwork" fill className="object-cover transition-transform duration-700 group-hover:scale-105 mix-blend-multiply" />;

                                        // 2. Explicit or Metadata Image
                                        const explicit = (item as any).image || (item as any).imageUrl || item.metadata?.image || item.metadata?.Imagine;
                                        if (explicit) return <Image src={explicit} alt="Produs" fill className="object-cover p-4 transition-transform duration-700 group-hover:scale-105" />;

                                        // 3. Fallback Registry Type
                                        const pid = item.productId || '';
                                        let def = DEFAULT_IMAGES[pid] || DEFAULT_IMAGES[pid.split('-')[0]];
                                        if (!def && pid.includes('banner')) def = DEFAULT_IMAGES['banner'];

                                        if (def) return <Image src={def} alt="Produs" fill className="object-cover p-4 transition-transform duration-700 group-hover:scale-105" />;

                                        return <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs font-black uppercase tracking-widest">FOTO</div>;
                                    })()}
                                </div>

                                {/* Item Info */}
                                <div className="flex-1 flex flex-col justify-between py-2">
                                    <div>
                                        <div className="flex justify-between items-start mb-3 gap-4">
                                            <h3 className="text-2xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 tracking-tight leading-snug">{item.title || 'Produs'}</h3>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={18} strokeWidth={2} />
                                            </button>
                                        </div>

                                        {/* Options Display form metadata */}
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {item.metadata && Object.entries(item.metadata)
                                                .filter(([key]) => !['artworkUrl', 'artworkUrlVerso', 'textDesign', 'textDesignVerso', 'designOption', 'width', 'height', 'width_cm', 'height_cm'].includes(key))
                                                .map(([key, value]) => (
                                                    <span key={key} className="text-[10px] font-bold uppercase tracking-widest text-slate-600 bg-slate-100/80 px-4 py-2 rounded-xl">
                                                        <span className="text-slate-400 font-medium mr-1">{key}:</span> <span className="text-slate-900">{typeof value === 'object' ? JSON.stringify(value) : value}</span>
                                                    </span>
                                                ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex items-center gap-4 bg-slate-50 rounded-2xl p-1.5 border border-slate-200">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm border border-slate-100 hover:text-emerald-500 hover:border-emerald-200 transition-colors"
                                            >
                                                <Minus size={16} strokeWidth={2.5} />
                                            </button>
                                            <span className="w-6 text-center font-black text-slate-900 text-lg">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm border border-slate-100 hover:text-emerald-500 hover:border-emerald-200 transition-colors"
                                            >
                                                <Plus size={16} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                        <div className="text-2xl font-black text-slate-900 tracking-tight">
                                            {(item.price * item.quantity).toFixed(2)} Lei
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary Card */}
                    <div className="relative">
                        <div className="sticky top-32 bg-white border border-slate-100/60 p-10 rounded-[3rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full -mr-20 -mt-20 pointer-events-none"></div>

                            <h2 className="text-2xl font-black mb-10 tracking-tight text-slate-900">Sumar Comandă</h2>

                            {(() => {
                                const shippingCost = cartTotal >= 500 ? 0 : getEstimatedShippingCost('RO', items);
                                const finalTotal = cartTotal + shippingCost;

                                return (
                                    <div className="space-y-6 mb-12 relative z-10">
                                        <div className="flex justify-between items-center text-slate-500 font-medium text-lg">
                                            <span>Subtotal</span>
                                            <span className="font-black text-slate-900">{cartTotal.toFixed(2)} Lei</span>
                                        </div>
                                        <div className="flex justify-between text-slate-500 items-center">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-lg">Livrare</span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">România</span>
                                            </div>
                                            {shippingCost === 0 ? (
                                                <span className="font-black text-emerald-500 uppercase text-xs tracking-widest bg-emerald-50 px-3 py-1.5 rounded-lg">Gratis</span>
                                            ) : (
                                                <span className="font-black text-slate-900">{shippingCost.toFixed(2)} Lei</span>
                                            )}
                                        </div>
                                        <div className="h-px bg-slate-100 my-8"></div>
                                        <div className="flex justify-between items-end">
                                            <span className="font-black text-xl text-slate-500 uppercase tracking-widest">Total</span>
                                            <span className="font-black text-5xl text-slate-900 tracking-tighter leading-none">{finalTotal.toFixed(2)} Lei</span>
                                        </div>
                                    </div>
                                );
                            })()}

                            <Link
                                href="/checkout"
                                className="relative z-10 w-full h-16 bg-slate-950 hover:bg-emerald-500 text-white rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10 hover:shadow-emerald-500/20 uppercase tracking-[0.2em]"
                            >
                                Finalizare <ArrowRight size={18} strokeWidth={2.5} />
                            </Link>

                            <p className="mt-8 text-[10px] text-slate-400 text-center uppercase tracking-widest font-bold">Plată securizată prin Stripe & Netopia</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
