"use client";

import React, { useState } from "react";
import { useCart } from "@/components/CartContext";
import { ShoppingCart, Check, ArrowRight, ShieldCheck, MessageCircle, Info, Maximize } from "lucide-react";
import DeliveryEstimation from "./DeliveryEstimation";
import { formatMoneyDisplay } from "@/lib/pricing";
import { EUFundProduct } from "@/lib/products/eu-funds-products";
import Link from "next/link";
import Image from "next/image";
import { NumberInput } from "./ui/NumberInput";

interface Props {
    product: EUFundProduct;
}

const SIZES = [
    { id: "a2", label: "Placă A2 (Standard)", price: 200, desc: "Format 42x60cm. Material rigid." },
    { id: "50x70", label: "Placă 50x70cm / 80x50cm", price: 290, desc: "Format Mediu. Conform manualelor." },
    { id: "150x100", label: "Panou 150x100cm", price: 550, desc: "Format Mare. Pentru proiecte de infrastructură." },
    { id: "200x150", label: "Panou 200x150cm (Temporar)", price: 700, desc: "Panou Șantier Temporar." },
    { id: "300x200", label: "Panou 300x200cm (Temporar)", price: 1190, desc: "Panou Șantier Gigant." },
];

export default function EUPlaqueConfigurator({ product }: Props) {
    const { addItem } = useCart();

    // Try to guess default size based on product slug
    const initialSize = product.slug.includes("50x70") ? "50x70" :
        product.slug.includes("80x50") ? "80x50" :
            product.slug.includes("150x100") ? "150x100" :
                "a2";

    const [selectedSize, setSelectedSize] = useState(initialSize);
    const [quantity, setQuantity] = useState(1);

    const currentSizeOption = SIZES.find(s => s.id === selectedSize) || SIZES[1];
    const price = currentSizeOption.price * quantity;

    const handleAddToCart = () => {
        addItem({
            id: `${product.id}-${selectedSize}-${Date.now()}`,
            productId: product.id,
            title: `${product.title} - ${currentSizeOption.label}`,
            price: price,
            quantity: 1,
            metadata: {
                "Dimensiune": currentSizeOption.label,
                "Program": product.program,
                "Descriere": currentSizeOption.desc
            }
        });
    };

    return (
        <main className="bg-white min-h-screen pb-20">
            <div className="container mx-auto px-4 py-8 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Left: Image & Info */}
                    <div>
                        <div className="relative aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-gray-100 mb-6">
                            <Image
                                src={product.image}
                                alt={product.title}
                                fill
                                className="object-contain p-4 bg-white"
                            />
                            <div className="absolute top-4 left-4">
                                <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                    {product.program}
                                </span>
                            </div>
                        </div>

                        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 mb-4">
                            <h3 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
                                <ShieldCheck size={20} />
                                Material Premium Garantat
                            </h3>
                            <ul className="text-sm text-emerald-800 space-y-1 ml-5 list-disc">
                                <li>Material rigid (Plexiglass/Dibond/Forex)</li>
                                <li>Rezistență UV min. 3-5 ani</li>
                                <li>Print direct sau caserat (în funcție de dimensiune)</li>
                                <li>Finisaje profesionale</li>
                            </ul>
                        </div>
                    </div>

                    {/* Right: Configurator */}
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{product.title}</h1>
                        <p className="text-gray-500 mb-6">{product.description}</p>

                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl mb-8 flex gap-3 items-start">
                            <div className="mt-1 text-amber-600 shrink-0">
                                <Info size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-amber-900">Notă Importantă - Grafică & Conformitate</p>
                                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                                    Imaginea produsului este cu titlu de prezentare.
                                    <strong> Garantăm 100% respectarea Manualului de Identitate Vizuală</strong> specific programului dumneavoastră ({product.program}).
                                    Vom solicita detaliile proiectului după plasarea comenzii pentru a realiza grafica corectă.
                                </p>
                            </div>
                        </div>

                        {/* Size Selector */}
                        <div className="mb-8">
                            <label className="block text-sm font-bold text-slate-900 dark:text-white mb-3">Dimensiune Placă Permanentă</label>
                            <div className="grid grid-cols-1 gap-3">
                                {SIZES.map((size) => (
                                    <button
                                        key={size.id}
                                        onClick={() => setSelectedSize(size.id)}
                                        className={`text-left p-4 rounded-xl border-2 transition-all flex justify-between items-center group
                    ${selectedSize === size.id
                                                ? "border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600"
                                                : "border-gray-200 dark:border-slate-800 hover:border-emerald-300 hover:bg-slate-50 dark:bg-slate-800"}`}
                                    >
                                        <div>
                                            <div className={`font-bold ${selectedSize === size.id ? "text-emerald-700" : "text-slate-900 dark:text-white"}`}>
                                                {size.label}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">{size.desc}</div>
                                        </div>
                                        <div className="font-bold text-lg text-slate-900 dark:text-white">
                                            {size.price} LEI
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="mb-8">
                            <NumberInput label="Cantitate" value={quantity} onChange={setQuantity} />
                        </div>

                        {/* Footer Actions */}
                        <div className="bg-white border-t border-gray-100 pt-6">
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <div className="text-sm text-gray-500 mb-1">Preț Total</div>
                                    <div className="text-4xl font-black text-slate-900 dark:text-white">{formatMoneyDisplay(price)}</div>
                                </div>
                                <DeliveryEstimation />
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleAddToCart}
                                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-lg shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] shadow-emerald-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart size={22} />
                                    Adaugă în Coș
                                </button>

                                <Link href="/configurator/fonduri-eu" className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-center transition-colors flex items-center justify-center gap-2">
                                    Vezi Kitul Complet (Configurator Principal) <ArrowRight size={18} />
                                </Link>

                                {/* BUTOANE SECUNDARE - WHATSAPP ȘI CERERE OFERTĂ */}
                                <div className="mt-6 bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl border border-slate-200 p-4">
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 text-center font-medium">Ai nevoie de ajutor sau o ofertă personalizată?</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <a
                                            href={`https://wa.me/40750473111?text=Buna%20ziua,%20ma%20intereseaza%20o%20oferta%20pentru%20${encodeURIComponent(product.title)}.`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] transition-all duration-200"
                                        >
                                            <MessageCircle size={18} />
                                            <span className="text-sm">WhatsApp</span>
                                        </a>
                                        <button
                                            type="button"
                                            onClick={() => window.location.href = '/contact'}
                                            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] transition-all duration-200"
                                        >
                                            <Info size={18} />
                                            <span className="text-sm">Cerere Ofertă</span>
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

