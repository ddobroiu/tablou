"use client";

import React, { useMemo, useState } from "react";
import { useCart } from "@/components/CartContext";
import { ShoppingCart, Heart, Sparkles, Image as ImageIcon, Check, UploadCloud, MessageSquare } from "lucide-react";
import { calculateCanvas8MartiePrice, CANVAS_8_MARTIE_CONSTANTS, formatMoneyDisplay, type PriceInputCanvas8Martie } from "@/lib/pricing";
import { OptionButton } from "./ui/OptionButton";
import { NumberInput } from "./ui/NumberInput";
import { AccordionStep } from "./ui/AccordionStep";

type Props = { productSlug?: string; productImage?: string };

export default function Canvas8MartieConfigurator({ productImage }: Props) {
    const { addItem } = useCart();

    const [input, setInput] = useState<PriceInputCanvas8Martie>({
        sizeKey: "40x60",
        quantity: 1,
        customText: "",
        designOption: "upload",
    });

    const [artworkUrl, setArtworkUrl] = useState<string | null>(productImage || null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [activeStep, setActiveStep] = useState(1);

    const priceData = useMemo(() => calculateCanvas8MartiePrice(input), [input]);

    const updateInput = <K extends keyof PriceInputCanvas8Martie>(k: K, v: PriceInputCanvas8Martie[K]) =>
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

        const uniqueId = `canvas-8-martie-${Date.now()}`;
        const sizeLabel = CANVAS_8_MARTIE_CONSTANTS.SIZES.find(s => s.key === input.sizeKey)?.label;

        let title = `Tablou Canvas 8 Martie ${sizeLabel}`;

        addItem({
            id: uniqueId,
            productId: 'canvas-8-martie',
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

    const summaryStep1 = CANVAS_8_MARTIE_CONSTANTS.SIZES.find(s => s.key === input.sizeKey)?.label || "";
    const summaryStep2 = `${input.quantity} buc.`;
    const summaryStep3 = input.customText ? "Text adăugat" : "Fără text special";

    return (
        <main className="bg-rose-50/30 min-h-screen">
            <div className="container mx-auto px-4 py-8 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* STÂNGA - VIZUAL */}
                    <div className="lg:sticky top-24 h-max space-y-6">
                        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-rose-100 overflow-hidden">
                            <div className="relative bg-slate-50 dark:bg-slate-800 flex flex-col items-center justify-center p-6 sm:p-10 group">
                                {/* SIMPLIFIED PREVIEW */}
                                <div className="relative w-full max-w-sm bg-white shadow-xl rounded-xl overflow-hidden animate-in fade-in duration-500">
                                    {artworkUrl ? (
                                        <div className="relative">
                                            <img
                                                src={artworkUrl}
                                                alt="Previzualizare"
                                                className="w-full h-auto object-contain block"
                                            />
                                            <button
                                                onClick={() => document.getElementById('photo-upload-input')?.click()}
                                                className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] hover:bg-rose-600 hover:text-white transition-all group/btn"
                                            >
                                                <UploadCloud size={20} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => document.getElementById('photo-upload-input')?.click()}
                                            className="w-full aspect-square flex flex-col items-center justify-center p-12 border-4 border-dashed border-rose-100 rounded-xl hover:bg-rose-50 hover:border-rose-300 transition-all duration-300"
                                        >
                                            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mb-6 text-rose-500">
                                                {uploading ? (
                                                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-rose-500 border-t-transparent"></div>
                                                ) : (
                                                    <UploadCloud size={40} />
                                                )}
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Încarcă Fotografia</h3>
                                            <p className="text-gray-500 text-sm max-w-xs text-center">Apasă aici pentru a alege poza pe care dorești să o transformăm în tablou.</p>
                                        </button>
                                    )}
                                </div>

                                <input
                                    id="photo-upload-input"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => handleArtworkFileInput(e.target.files?.[0] || null)}
                                />
                            </div>

                            <div className="bg-rose-600 p-4 text-white text-center font-bold flex items-center justify-center gap-2">
                                <Sparkles size={18} /> Cadoul perfect pentru Ziua Femeii
                            </div>
                        </div>
                    </div>

                    {/* DREAPTA - CONFIGURATOR */}
                    <div>
                        <header className="mb-8">
                            <div className="flex items-center gap-2 mb-2 text-rose-600 font-bold text-sm tracking-wide uppercase">
                                <Heart size={16} fill="currentColor" /> Ediție Specială 8 Martie
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-3">Canvas Personalizat 8 Martie</h1>
                            <p className="text-gray-600 dark:text-gray-400">Surprinde-o cu un cadou unic. Transformă o amintire dragă într-un tablou canvas de excepție.</p>
                        </header>

                        <div className="space-y-4 mb-8">
                            <AccordionStep stepNumber={1} title="Alege Dimensiunea" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                                <div className="grid grid-cols-2 gap-3 pb-2">
                                    {CANVAS_8_MARTIE_CONSTANTS.SIZES.map((s: any) => (
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

                            <AccordionStep stepNumber={3} title="Mesaj Personalizat (Opțional)" summary={summaryStep3} isOpen={activeStep === 3} onClick={() => setActiveStep(3)}>
                                <div className="pb-2 space-y-4">
                                    <div className="relative">
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Textul tău pentru ea</label>
                                        <div className="relative">
                                            <textarea
                                                className="w-full p-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-rose-600 focus:ring-0 transition-all text-slate-900 dark:text-white font-medium placeholder:text-gray-300 min-h-[100px]"
                                                placeholder="Ex: La mulți ani, mamă!, Te iubim!, 8 Martie 2026..."
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
                                        * Mesajul va fi adăugat cu un font elegant la baza tabloului.
                                    </p>
                                </div>
                            </AccordionStep>
                        </div>

                        {/* SUMAR PREȚ & ADD TO CART */}
                        <div className="bg-white rounded-3xl p-6 shadow-xl border border-rose-50 mt-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total de plată</div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-black text-slate-900 dark:text-white">{formatMoneyDisplay(priceData.finalPrice)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 sm:flex-none group relative bg-rose-600 hover:bg-rose-700 text-white px-10 py-5 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] shadow-rose-200 overflow-hidden"
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

