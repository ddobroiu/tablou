"use client";

import React, { useState } from "react";
import { useCart } from "@/components/CartContext";
import { ShoppingCart, Check, ArrowRight, FileText, MessageCircle, Info } from "lucide-react";
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
    { id: "a4", label: "Afiș A4 (Mic)", price: 39, desc: "Format 210 x 297 mm. Ideal pentru aviziere." },
    { id: "a3", label: "Afiș A3 (Standard)", price: 49, desc: "Format 297 x 420 mm. Hârtie 200g, print digital." },
    { id: "a2", label: "Afiș A2 (Mare)", price: 79, desc: "Format 420 x 594 mm. Vizibilitate extinsă." },
];

export default function EUPosterConfigurator({ product }: Props) {
    const { addItem } = useCart();
    const [selectedSize, setSelectedSize] = useState("a3");
    const [quantity, setQuantity] = useState(1);

    const currentSizeOption = SIZES.find(s => s.id === selectedSize) || SIZES[0];
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
                "Specificatii": currentSizeOption.desc
            }
        });
    };

    return (
        <main className="bg-white min-h-screen pb-20">
            <div className="container mx-auto px-4 py-8 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Left: Image */}
                    <div>
                        <div className="relative aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-gray-100 mb-6">
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
                        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex flex-col items-center text-center">
                            <MessageCircle size={32} className="text-emerald-600 mb-3" />
                            <h3 className="font-bold text-emerald-900 mb-2">
                                Ai întrebări despre conformitate?
                            </h3>
                            <p className="text-sm text-emerald-800 mb-4">
                                Suntem specialiști în proiecte cu finanțare europeană. Contactează-ne pe WhatsApp pentru consultanță gratuită.
                            </p>
                            <a 
                                href={`https://wa.me/40750473111?text=Buna%20ziua,%20am%20o%20intrebare%20despre%20conformitatea%20pentru%20${encodeURIComponent(product.title)}.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
                            >
                                Contact WhatsApp
                            </a>
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
                            <label className="block text-sm font-bold text-slate-900 dark:text-white mb-3">Dimensiune Afiș</label>
                            <div className="grid grid-cols-1 gap-3">
                                {SIZES.map((size) => (
                                    <button
                                        key={size.id}
                                        onClick={() => setSelectedSize(size.id)}
                                        className={`text-left p-4 rounded-xl border-2 transition-all flex justify-between items-center group
                    ${selectedSize === size.id
                                                ? "border-slate-950 bg-emerald-50 ring-1 ring-slate-950"
                                                : "border-gray-200 dark:border-slate-800 hover:border-emerald-300 hover:bg-slate-50 dark:bg-slate-800"}`}
                                    >
                                        <div>
                                            <div className={`font-bold ${selectedSize === size.id ? "text-emerald-500" : "text-slate-900 dark:text-white"}`}>
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
                                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-lg shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] shadow-slate-950/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart size={22} />
                                    Adaugă în Coș
                                </button>

                                <div className="relative my-4">
                                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                        <div className="w-full border-t border-gray-200 dark:border-slate-800"></div>
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="bg-white px-3 text-sm text-gray-500">sau</span>
                                    </div>
                                </div>

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

