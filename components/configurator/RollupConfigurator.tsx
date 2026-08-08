"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { Plus, Minus, ShoppingCart, Info, ChevronDown, X, UploadCloud, MessageCircle, TrendingUp, PencilRuler } from "lucide-react";
import Link from 'next/link';
import Image from "next/image";
import DeliveryEstimation from "./DeliveryEstimation";
import FaqAccordion from "./FaqAccordion";
import { QA } from "@/types/configurator";
import {
    calculateRollupPrice,
    ROLLUP_CONSTANTS,
    formatMoneyDisplay,
    type PriceInputRollup,
    getRollupUpsell
} from "@/lib/pricing";
import { PopularDimensions } from "./PopularDimensions";

const GALLERY_BASE = [
    "/products/rollup/rollup-1.webp",
    "/products/rollup/rollup-2.webp"
] as const;

const productFaqs: QA[] = [
    { question: "Ce este un rollup banner?", answer: "Roll-up (sau banner retractabil) este un sistem de afișaj portabil perfect pentru evenimente, expoziții, prezentări. Se rulează și se derulează ușor într-o casetă din aluminiu." },
    { question: "Ce include prețul?", answer: "Prețul include caseta din aluminiu de calitate premium, printuri pe material Blueback 440g și geantă de transport." },
    { question: "Cum se montează?", answer: "Extrem de simplu: scoți din geantă, tragi printul în sus și îl fixezi pe bara de susținere. Montaj în mai puțin de 1 minut!" },
];

import { AccordionStep } from "./ui/AccordionStep";
import { TabButtonSEO } from "./ui/TabButtonSEO";
import { NumberInput } from "./ui/NumberInput";
import { TabButton } from "./ui/TabButton";

type Props = { productSlug?: string; initialWidth?: number; productImage?: string };

export default function RollupConfigurator({ productSlug, initialWidth: initW, productImage }: Props) {
    const { addItem } = useCart();
    const GALLERY = useMemo(() => productImage ? [productImage, ...GALLERY_BASE] : GALLERY_BASE, [productImage]);

    const [input, setInput] = useState<PriceInputRollup>({
        width_cm: initW ?? 85,
        quantity: 1,
        designOption: "upload",
    });

    const [activeImage, setActiveImage] = useState<string>(GALLERY[0]);
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const [detailsOpen, setDetailsOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(1);
    const [activeProductTab, setActiveProductTab] = useState<'descriere' | 'faq'>('descriere');

    // Pricing
    const priceData = useMemo(() => calculateRollupPrice(input), [input]);
    const upsellData = useMemo(() => getRollupUpsell(input), [input]);
    const displayedTotal = priceData.finalPrice;

    const updateInput = <K extends keyof PriceInputRollup>(k: K, v: PriceInputRollup[K]) => setInput((p) => ({ ...p, [k]: v }));
    const setQty = (v: number) => updateInput("quantity", Math.max(1, Math.floor(v)));

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
        if (displayedTotal <= 0) {
            alert("Prețul trebuie calculat.");
            return;
        }

        const unitPrice = Math.round((displayedTotal / input.quantity) * 100) / 100;
        const uniqueId = `rollup-${Date.now()}`;
        const title = `Rollup Banner ${input.width_cm}x200 cm`;

        addItem({
            id: uniqueId,
            productId: 'rollup',
            title: title,
            price: unitPrice,
            quantity: input.quantity,
            metadata: {
                "Dimensiune": `${input.width_cm}x200 cm`,
                "Pachet": "Casetă + Print + Geantă",
                "Grafică": input.designOption === 'pro' ? 'Design Pro' : 'Grafică proprie',
                "artworkUrl": artworkUrl,
            },
        });
        alert("Adăugat în coș!");
    }

    useEffect(() => {
        const id = setInterval(() => setActiveIndex((i) => (i + 1) % GALLERY.length), 5000);
        return () => clearInterval(id);
    }, [GALLERY.length]);

    useEffect(() => setActiveImage(GALLERY[activeIndex]), [activeIndex, GALLERY]);

    const widthLabel = ROLLUP_CONSTANTS.SIZES.find(s => s.width_cm === input.width_cm)?.label || `${input.width_cm} cm`;
    const summaryStep1 = `${widthLabel}, ${input.quantity} buc.`;
    const summaryStep2 = input.designOption === 'upload' ? 'Grafică proprie' : 'Design Pro';

    return (
        <main className="bg-slate-50 dark:bg-slate-800 min-h-screen">
            <div className="container mx-auto px-4 py-8 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* STÂNGA - VIZUAL */}
                    <div className="lg:sticky top-24 h-max space-y-6">
                        <div className="bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-gray-200 dark:border-slate-800 overflow-hidden">
                            <div className="aspect-square relative flex items-center justify-center p-4">
                                <Image 
                                    src={activeImage} 
                                    alt="Rollup" 
                                    fill
                                    className="object-contain" 
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    priority
                                />
                            </div>
                            <div className="p-2 grid grid-cols-4 gap-2 border-t border-gray-100">
                                {GALLERY.map((src, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveIndex(i)}
                                        className={`relative rounded-lg aspect-square overflow-hidden border-2 transition-all ${activeIndex === i ? "border-emerald-600 shadow-md" : "border-transparent opacity-70 hover:opacity-100"}`}
                                    >
                                        <Image 
                                            src={src} 
                                            alt="Miniatura" 
                                            fill
                                            className="object-cover" 
                                            sizes="100px"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* DREAPTA - CONFIGURATOR */}
                    <div>
                        <header className="mb-6">
                            <div className="flex justify-between items-center gap-4 mb-3">
                                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white">Configurator Rollup Banner</h2>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Sistem portabil profesional - gata de expoziție în 1 minut.</p>
                                <button type="button" onClick={() => setDetailsOpen(true)} className="inline-flex items-center text-sm px-3 py-1.5 border border-gray-300 rounded hover:bg-slate-50 dark:bg-slate-800 transition-colors text-gray-700 dark:text-gray-300 font-medium">
                                    <Info size={16} /><span className="ml-2">Detalii</span>
                                </button>
                            </div>
                        </header>

                        <div className="bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-gray-200 dark:border-slate-800 px-4 mb-8">
                            <AccordionStep stepNumber={1} title="Dimensiune & Cantitate" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                                <div className="mb-4">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Selectează lățimea</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {ROLLUP_CONSTANTS.SIZES.map(size => (
                                            <button
                                                key={size.width_cm}
                                                onClick={() => updateInput("width_cm", size.width_cm)}
                                                className={`p-3 border-2 rounded-lg transition-all text-center ${input.width_cm === size.width_cm
                                                    ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm"
                                                    : "border-gray-200 dark:border-slate-800 bg-white hover:border-gray-300"
                                                    }`}
                                            >
                                                <div className="font-bold text-lg">{size.width_cm}</div>
                                                <div className="text-[10px] uppercase font-bold text-gray-500">cm</div>
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2 italic">* Înălțimea este standard de 200 cm pentru toate modelele.</p>
                                </div>
                                <NumberInput label="Cantitate (buc)" value={input.quantity} onChange={setQty} step={1} />
                                {upsellData && (
                                    <div
                                        className="mt-3 p-3 sm:p-4 bg-emerald-50 border border-emerald-200 rounded-lg cursor-pointer hover:bg-emerald-100 transition-colors flex gap-3 items-center group relative w-full"
                                        onClick={() => setQty(upsellData.requiredQty)}
                                    >
                                        <TrendingUp className="text-emerald-600 w-5 h-5 shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-sm text-emerald-900 font-bold">
                                                Reducere de Volum Disponibilă!
                                            </p>
                                            <p className="text-xs text-emerald-800 mt-1">
                                                Dacă alegi <strong>{upsellData.requiredQty} buc</strong>, prețul scade la <strong>{formatMoneyDisplay(upsellData.newUnitPrice)}/buc</strong>.
                                            </p>
                                        </div>
                                        <div className="ml-auto flex flex-col items-end gap-2 shrink-0">
                                            <div className="flex items-center justify-center bg-white rounded-md px-2 py-0.5 shadow-sm border border-emerald-100">
                                                <span className="text-xs font-bold text-emerald-600">-{upsellData.discountPercent}%</span>
                                            </div>
                                            <button type="button" className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-md font-bold shadow-sm group-hover:bg-emerald-700 transition-colors">
                                                Aplică
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </AccordionStep>

                            <AccordionStep stepNumber={2} title="Grafică" summary={summaryStep2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)} isLast={true}>
                                <div>
                                    {/* Editor Online button removed from here, moved to tabs below */}

                                        <div className="flex -mb-px overflow-x-auto no-scrollbar">
                                            <TabButton active={input.designOption === 'upload'} onClick={() => updateInput("designOption", 'upload')}>Am Grafică</TabButton>
                                            <TabButton active={input.designOption === 'pro'} onClick={() => updateInput("designOption", 'pro')}>Vreau Grafică</TabButton>
                                            <Link 
                                                href={`/editor?w=${input.width_cm}&h=200&product=rollup`}
                                                className="px-4 py-2 text-sm font-bold transition-all rounded-t-lg bg-orange-600 text-white hover:bg-orange-700 flex items-center gap-2 shrink-0 ml-auto"
                                            >
                                                <PencilRuler size={14} />
                                                Editor Online
                                            </Link>
                                        </div>

                                    {input.designOption === 'upload' && (
                                        <div className="space-y-3">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Încarcă fișierul tău (PDF, AI, JPG). Dimensiune: {input.width_cm}x200cm.</p>
                                            <label className="flex flex-col items-center justify-center w-full h-32 px-4 bg-white border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-emerald-400 transition-colors">
                                                <UploadCloud className="w-8 h-8 text-gray-400 mb-1" />
                                                <span className="font-medium text-gray-600 dark:text-gray-400">Selectează fișierul</span>
                                                <input type="file" className="hidden" onChange={e => handleArtworkFileInput(e.target.files?.[0] ?? null)} />
                                            </label>
                                            {uploading && <p className="text-sm text-emerald-600 mt-2">Se încarcă...</p>}
                                            {uploadError && <p className="text-sm text-red-600 mt-2">{uploadError}</p>}
                                            {artworkUrl && !uploadError && <p className="text-sm text-green-600 font-semibold mt-2">Grafică încărcată!</p>}
                                            
                                        </div>
                                    )}

                                    {input.designOption === 'pro' && (
                                        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">
                                            <p className="font-semibold">Serviciu Design Profesional</p>
                                            <p>Cost: <strong>{formatMoneyDisplay(ROLLUP_CONSTANTS.PRO_DESIGN_FEE)}</strong>. Echipa noastră va realiza designul pentru bannerul tău.</p>
                                        </div>
                                    )}

                                </div>
                            </AccordionStep>
                        </div>

                        {/* TOTAL & ADD TO CART - Standardized Layout */}
                        <div className="relative z-40 lg:static bg-white lg:bg-white lg:backdrop-blur-none border-t lg:border border-gray-200 dark:border-slate-800 lg:rounded-2xl lg:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] p-4 lg:p-6 transition-all mt-8">
                            <div className="flex flex-col gap-4">
                                <button onClick={handleAddToCart} className="w-full py-4 text-lg font-bold bg-emerald-600 text-white rounded-xl shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 active:scale-95">
                                    <ShoppingCart size={24} />
                                    Adaugă în Coș
                                </button>

                                <div className="flex flex-row justify-between items-center w-full gap-2 pt-1 mt-1 border-t border-gray-100">
                                    <div className="flex flex-col items-start leading-none">
                                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Preț Total</span>
                                        <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{formatMoneyDisplay(displayedTotal)}</span>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <DeliveryEstimation />
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500 font-medium border-t border-gray-50 pt-2">
                                    Include: Casetă aluminiu + Print HD Blueback + Geantă transport
                                </div>
                            </div>
                        </div>

                        {/* BUTOANE SECUNDARE - WHATSAPP ȘI CERERE OFERTĂ */}
                        <div className="mt-4 lg:mt-6 bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl border border-slate-200 p-4">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 text-center font-medium">Ai nevoie de ajutor sau o ofertă personalizată?</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <a
                                    href="https://wa.me/40750473111?text=Buna%20ziua,%20ma%20intereseaza%20o%20oferta."
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

                {/* INFO SECTION */}
                <div className="mt-8 lg:mt-12 bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-gray-200 dark:border-slate-800 overflow-hidden">
                    <nav className="border-b border-gray-200 dark:border-slate-800 flex overflow-x-auto">
                        <TabButtonSEO active={activeProductTab === "descriere"} onClick={() => setActiveProductTab("descriere")}>Descriere</TabButtonSEO>
                        <TabButtonSEO active={activeProductTab === "faq"} onClick={() => setActiveProductTab("faq")}>FAQ</TabButtonSEO>
                    </nav>

                    <div className="p-6 lg:p-8">
                        {activeProductTab === 'descriere' && (
                            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Rollup Banner - Soluția Profesională pentru Expoziții</h2>
                                <p className="leading-relaxed mb-6">
                                    Bannere-ul de tip rollup este cel mai popular sistem de afișaj portabil. Ușor, elegant și extrem de simplu de utilizat, acesta oferă o vizibilitate maximă brandului tău la orice eveniment.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Sistem Complet</h3>
                                        <ul className="space-y-2 list-disc pl-5">
                                            <li><strong>Casetă Aluminiu:</strong> Rezistentă, cu picioare de susținere robuste.</li>
                                            <li><strong>Material Blueback:</strong> Print HD pe material opac care nu se curbează.</li>
                                            <li><strong>Portabilitate:</strong> Vine cu geantă de transport inclusă.</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Utilizări Recomandate</h3>
                                        <p>Perfect pentru conferințe, târguri comerciale, showroom-uri, recepții, evenimente corporate sau prezentări de produs punctuale.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeProductTab === 'faq' && <FaqAccordion qa={productFaqs} />}
                    </div>
                </div>
            </div>

            {detailsOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setDetailsOpen(false)}>
                    <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                        <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors" onClick={() => setDetailsOpen(false)} aria-label="Închide"><X size={20} className="text-gray-600 dark:text-gray-400" /></button>
                        <div className="p-8">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
                                Detalii Tehnice Rollup
                                <a 
                                    href="https://wa.me/40750473111?text=Buna%20ziua,%20am%20o%20intrebare%20tehnica%20despre%20rollup..."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
                                >
                                    <MessageCircle size={18} />
                                    WhatsApp
                                </a>
                            </h3>
                            <div className="space-y-6 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">Print de Înaltă Rezoluție</h4>
                                    <p>Imprimăm la 1440 DPI pe material polipropilenă specială cu spate gri/albastru (opac), asigurând culori vibrante și block-out total al luminii din spate.</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">Casetă & Mecanism</h4>
                                    <p>Caseta din aluminiu eloxat are un mecanism de rulare cu arc pretensionat, garantând o utilizare îndelungată fără blocaje. Geanta are protecție interioară pentru casetă.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}


