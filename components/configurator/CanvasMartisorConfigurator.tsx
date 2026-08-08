"use client";

import React, { useMemo, useState } from "react";
import { useCart } from "@/components/CartContext";
import { ShoppingCart, Heart, Sparkles, Image as ImageIcon, Check, UploadCloud, MessageSquare } from "lucide-react";
import { calculateCanvasMartisorPrice, CANVAS_MARTISOR_CONSTANTS, formatMoneyDisplay, type PriceInputCanvasMartisor } from "@/lib/pricing";
import { OptionButton } from "./ui/OptionButton";
import { NumberInput } from "./ui/NumberInput";
import { AccordionStep } from "./ui/AccordionStep";

type Props = { productSlug?: string; productImage?: string };

export default function CanvasMartisorConfigurator({ productImage }: Props) {
    const { addItem } = useCart();

    const [input, setInput] = useState<PriceInputCanvasMartisor>({
        sizeKey: "40x60",
        quantity: 1,
        customText: "",
        designOption: "upload",
    });

    const [artworkUrl, setArtworkUrl] = useState<string | null>(productImage || null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [activeStep, setActiveStep] = useState(1);

    const priceData = useMemo(() => calculateCanvasMartisorPrice(input), [input]);

    const updateInput = <K extends keyof PriceInputCanvasMartisor>(k: K, v: PriceInputCanvasMartisor[K]) =>
        setInput((p) => ({ ...p, [k]: v }));

    const handleArtworkFileInput = async (file: File | null) => {
        setArtworkUrl(null); setUploadError(null);
        if (!file) return;
        try {
            setUploading(true);
            const form = new FormData(); form.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: form });
            if (!res.ok) throw new Error("Upload eșuat");
            const data = await res.json();
            setArtworkUrl(data.url);
        } catch (e: any) {
            setUploadError(e?.message ?? "Eroare la upload");
        } finally {
            setUploading(false);
        }
    };

    function handleAddToCart() {
        if (!artworkUrl) {
            alert("Vă rugăm să încărcați o fotografie.");
            return;
        }

        const uniqueId = `canvas-martisor-${Date.now()}`;
        const sizeLabel = CANVAS_MARTISOR_CONSTANTS.SIZES.find(s => s.key === input.sizeKey)?.label;

        let title = `Tablou Canvas Personalizat ${sizeLabel}`;

        addItem({
            id: uniqueId,
            productId: 'canvas-martisor',
            title: title,
            price: priceData.unitPrice,
            quantity: input.quantity,
            metadata: {
                "Dimensiune": sizeLabel,
                "Text Personalizat": input.customText || "Fără text",
                "artworkUrl": artworkUrl,
            },
        });
        alert("Adăugat în coș!");
    }

    const summaryStep1 = CANVAS_MARTISOR_CONSTANTS.SIZES.find(s => s.key === input.sizeKey)?.label || "";
    const summaryStep2 = `${input.quantity} buc.`;
    const summaryStep3 = input.customText ? "Text adăugat" : "Fără text special";

    return (
        <main className="bg-slate-50 dark:bg-slate-800 min-h-screen">
            <div className="container mx-auto px-4 py-8 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* STÂNGA - VIZUAL */}
                    <div className="lg:sticky top-24 h-max space-y-6">
                        <div className="bg-white rounded-3xl shadow-xl border border-red-100 overflow-hidden">
                            <div className="aspect-square relative bg-white flex items-center justify-center p-8 group">
                                {artworkUrl ? (
                                    <div className="relative">
                                        <div className="relative z-10 shadow-2xl border-4 border-white rounded-sm overflow-hidden transform hover:scale-105 transition-transform max-w-full">
                                            <img src={artworkUrl} alt="Canvas Personalizat" className="w-[400px] h-auto object-contain" />
                                            {input.customText && (
                                                <div className="absolute bottom-4 left-0 right-0 text-center px-4">
                                                    <span className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded text-sm font-medium">
                                                        {input.customText}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-center p-12">
                                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 text-red-500 animate-pulse">
                                            <ImageIcon size={40} />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Încarcă Fotografia Ta</h3>
                                        <p className="text-gray-500 max-w-xs">Alege o imagine clară pentru un print de excepție pe canvas.</p>
                                        <button
                                            onClick={() => document.getElementById('photo-upload-input')?.click()}
                                            className="mt-8 px-8 py-3 bg-red-600 text-white font-bold rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] hover:bg-red-700 transition-all active:scale-95"
                                        >
                                            ALEGE POZA
                                        </button>
                                    </div>
                                )}

                                <input
                                    id="photo-upload-input"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => handleArtworkFileInput(e.target.files?.[0] || null)}
                                />
                            </div>

                            <div className="bg-red-600 p-4 text-white text-center font-bold flex items-center justify-center gap-2">
                                <Sparkles size={18} /> Calitate Premium garantată de tablou.net
                            </div>
                        </div>
                    </div>

                    {/* DREAPTA - CONFIGURATOR */}
                    <div>
                        <header className="mb-8">
                            <div className="flex items-center gap-2 mb-2 text-red-600 font-bold text-sm tracking-wide uppercase">
                                <Heart size={16} fill="currentColor" /> Oferte Speciale
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-3">Tablou Canvas Personalizat</h1>
                            <p className="text-gray-600 dark:text-gray-400">Transformă amintirile în artă. Configurează-ți tabloul rapid și simplu.</p>
                        </header>

                        <div className="space-y-4 mb-8">
                            <AccordionStep stepNumber={1} title="Alege Dimensiunea" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                                <div className="grid grid-cols-2 gap-3 pb-2">
                                    {CANVAS_MARTISOR_CONSTANTS.SIZES.map((s: any) => (
                                        <OptionButton
                                            key={s.key}
                                            active={input.sizeKey === s.key}
                                            onClick={() => updateInput("sizeKey", s.key)}
                                            title={s.label}
                                            subtitle={`${s.basePrice} RON`}
                                        />
                                    ))}
                                </div>
                            </AccordionStep>

                            <AccordionStep stepNumber={2} title="Cantitate" summary={summaryStep2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)}>
                                <div className="pb-2">
                                    <NumberInput
                                        label="Număr de bucăți"
                                        value={input.quantity}
                                        onChange={(v) => updateInput("quantity", v)}
                                    />
                                </div>
                            </AccordionStep>

                            <AccordionStep stepNumber={3} title="Adaugă un Text (Opțional)" summary={summaryStep3} isOpen={activeStep === 3} onClick={() => setActiveStep(3)}>
                                <div className="pb-2 space-y-4">
                                    <div className="relative">
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Textul tău personalizat</label>
                                        <div className="relative">
                                            <textarea
                                                className="w-full p-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-red-600 focus:ring-0 transition-all text-slate-900 dark:text-white font-medium placeholder:text-gray-300 min-h-[100px]"
                                                placeholder="Ex: Te iubesc!, La mulți ani!, 2026..."
                                                value={input.customText}
                                                onFocus={(e) => e.target.select()}
                                                onChange={(e) => updateInput("customText", e.target.value)}
                                            />
                                            <div className="absolute right-4 bottom-4 text-gray-300">
                                                <MessageSquare size={20} />
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight leading-relaxed">
                                        * Textul va fi adăugat estetic la baza tabloului sau conform indicațiilor tale.
                                    </p>
                                </div>
                            </AccordionStep>
                        </div>

                        {/* SUMAR PREȚ & ADD TO CART */}
                        <div className="bg-white rounded-3xl p-6 shadow-xl border border-red-50 sticky bottom-4 z-40">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total spre plată</div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-black text-slate-900 dark:text-white">{formatMoneyDisplay(priceData.finalPrice)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 sm:flex-none group relative bg-red-600 hover:bg-red-700 text-white px-10 py-5 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] shadow-red-200 overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                        <ShoppingCart size={22} /> ADAUGĂ ÎN COȘ
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

