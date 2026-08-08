"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { Plus, Minus, ShoppingCart, Info, ChevronDown, X, UploadCloud, MessageCircle, TrendingUp, Percent, PencilRuler } from "lucide-react";
import Link from 'next/link';
import Image from "next/image";
import DeliveryEstimation from "./DeliveryEstimation";
import FaqAccordion from "./FaqAccordion";
import { QA } from "@/types/configurator";
import {
    calculatePosterPrice,
    AFISE_CONSTANTS,
    formatMoneyDisplay,
    type PriceInputAfise,
    getAfiseUpsell
} from "@/lib/pricing";
import ProductJsonLd from "@/components/ProductJsonLd";
import { PopularDimensions } from "./PopularDimensions";

const GALLERY_BASE = [
    "/products/afise/afise-1.webp",
    "/products/afise/afise-2.webp"
] as const;

const afiseFaqs: QA[] = [
    { question: "Ce tipuri de hârtie pot alege?", answer: "Oferim o varietate de hârtii, de la cele subțiri (150g) pentru volume mari, la cartoane de 300g pentru un aspect premium. De asemenea, avem materiale speciale precum Blueback pentru lipire pe panouri sau hârtie foto." },
    { question: "Care este diferența dintre Blueback și Whiteback?", answer: "Hârtia Blueback are spatele albastru și este opacă, fiind ideală pentru lipirea peste alte afișe. Whiteback are spatele alb și este folosită pentru postere de interior." },
    { question: "Ce înseamnă preț în funcție de tiraj?", answer: "Prețul pe bucata scade pe măsură ce comandați o cantitate mai mare. Puteți vedea exact prețul unitar calculat în sumarul comenzii." },
    { question: "Cât durează producția?", answer: "Producția durează 1-2 zile lucrătoare. Livrarea prin curier rapid mai adaugă încă 1-2 zile, în funcție de localitatea de destinație." },
    { question: "Cum trimit grafica?", answer: "Încărcați fișierul direct în configurator. Acceptăm formate PDF, AI, CDR, TIFF sau JPG la rezoluție bună (300 dpi recomandat)." },
];

import { AccordionStep } from "./ui/AccordionStep";
import { TabButtonSEO } from "./ui/TabButtonSEO";
import { NumberInput } from "./ui/NumberInput";
import { OptionButton } from "./ui/OptionButton";

export default function AfiseConfigurator({ productSlug, initialWidth, initialHeight, productImage }: { productSlug?: string; initialWidth?: number; initialHeight?: number; productImage?: string }) {
    const { addItem } = useCart();
    const GALLERY = useMemo(() => productImage ? [productImage, ...GALLERY_BASE] : GALLERY_BASE, [productImage]);
    const [size, setSize] = useState<string>("A2");
    const [material, setMaterial] = useState<string>("whiteback_150_material");
    const [quantity, setQuantity] = useState<number>(50);
    const [activeProductTab, setActiveProductTab] = useState("descriere");
    const [designOption, setDesignOption] = useState<"upload" | "pro">("upload");

    const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [activeImage, setActiveImage] = useState<string>(GALLERY[0]);

    useEffect(() => {
        setActiveImage(GALLERY[activeIndex]);
    }, [activeIndex, GALLERY]);

    const [detailsOpen, setDetailsOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(1);

    // EFFECT: Handle initial props from Editor
    useEffect(() => {
        if (productImage) {
            setArtworkUrl(productImage);
            setActiveImage(productImage);
            setDesignOption('upload');
        }
        if (initialWidth && initialHeight) {
            // No easy way to match A2/A3 from numbers alone, 
            // but we can at least show the image
        }
    }, [productImage, initialWidth, initialHeight]);

    // Helper: Check validity of material for current size
    function isMaterialVisibleForSize(mKey: string, sKey: string) {
        if (mKey.startsWith("paper_")) return true;
        const matTable = AFISE_CONSTANTS.PRICE_TABLE[mKey];
        return !!(matTable && matTable[sKey]);
    }

    // Reset material if not available for new size
    useEffect(() => {
        if (!isMaterialVisibleForSize(material, size)) {
            setMaterial("whiteback_150_material");
        }
    }, [size, material]);

    // Pricing Calculation
    const priceData = useMemo(() => calculatePosterPrice({ size, material, quantity, designOption }), [size, material, quantity, designOption]);
    const displayedTotal = priceData.finalPrice;
    const upsellOpportunity = useMemo(() => getAfiseUpsell({ size, material, quantity, designOption }), [size, material, quantity, designOption]);

    const handleArtworkFileInput = async (file: File | null) => {
        setArtworkUrl(null);
        setUploadError(null);
        if (!file) return;
        try {
            setUploading(true);
            const form = new FormData();
            form.append("file", file);
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
            alert("Combinație invalidă.");
            return;
        }

        const selectedMaterialLabel = AFISE_CONSTANTS.MATERIALS.find(m => m.key === material)?.label || material;
        const selectedSizeLabel = AFISE_CONSTANTS.SIZES.find(s => s.key === size)?.label || size;

        addItem({
            id: `afise-${Date.now()}`,
            productId: 'afise',
            title: `Afiș ${selectedSizeLabel} - ${selectedMaterialLabel}`,
            price: Math.round((displayedTotal / quantity) * 100) / 100,
            quantity,
            metadata: {
                "Dimensiune": selectedSizeLabel,
                "Material": selectedMaterialLabel,
                "Tiraj": `${quantity} buc`,
                "Grafică": designOption === 'pro' ? "Vreau grafică" : "Grafică proprie",
                "artworkUrl": artworkUrl,
            },
        });
        alert("Adăugat în coș!");
    }

    const summaryStep1 = `${AFISE_CONSTANTS.SIZES.find(s => s.key === size)?.label}, ${quantity} buc.`;
    const summaryStep2 = AFISE_CONSTANTS.MATERIALS.find(m => m.key === material)?.label || "Selectat";
    const summaryStep3 = designOption === 'upload' ? 'Grafică proprie' : 'Design Pro';

    useEffect(() => {
        if (artworkUrl) return;
        const id = setInterval(() => {
            setActiveIndex((i) => (i + 1) % GALLERY.length);
        }, 5000);
        return () => clearInterval(id);
    }, [GALLERY.length, artworkUrl]);

    return (
        <main className="bg-slate-50 dark:bg-slate-800 min-h-screen">
            <ProductJsonLd
                name="Afișe și Postere Personalizate"
                description="Promovează-ți evenimentele sau ofertele cu afișe de înaltă calitate, imprimate pe o gamă variată de materiale. Alege dimensiunea și hârtia potrivită pentru mesajul tău."
                image={activeImage}
                price={displayedTotal}
                sku="afise-personalizate"
                url={typeof window !== 'undefined' ? window.location.href : "https://www.tablou.net/configurator/afise"}
            />
            <div className="container mx-auto px-4 py-8 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* STÂNGA - VIZUAL */}
                    <div className="lg:sticky top-24 h-max space-y-6">
                        <div className="bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-gray-200 dark:border-slate-800 overflow-hidden">
                            <div className="aspect-square relative flex items-center justify-center p-4">
                                <Image 
                                    src={activeImage} 
                                    alt="Afiș" 
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
                                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white">Configurator Afișe</h2>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Personalizează opțiunile în 3 pași simpli.</p>
                                <button type="button" onClick={() => setDetailsOpen(true)} className="inline-flex items-center text-sm px-3 py-1.5 border border-gray-300 rounded hover:bg-slate-50 dark:bg-slate-800 transition-colors text-gray-700 dark:text-gray-300 font-medium">
                                    <Info size={16} /><span className="ml-2">Detalii</span>
                                </button>
                            </div>
                        </header>

                        <div className="bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-gray-200 dark:border-slate-800 px-4 mb-8">
                            <AccordionStep stepNumber={1} title="Dimensiune & Tiraj" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Dimensiune</label>
                                        <select value={size} onChange={(e) => setSize(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
                                            {AFISE_CONSTANTS.SIZES.map((s: any) => <option key={s.key} value={s.key}>{s.label} — {s.dims}</option>)}
                                        </select>
                                    </div>
                                    <NumberInput label="Tiraj (buc)" value={quantity} onChange={setQuantity} step={1} />
                                    {upsellOpportunity && (
                                        <div
                                            className="mt-3 p-3 sm:p-4 bg-emerald-50 border border-emerald-200 rounded-lg cursor-pointer hover:bg-emerald-100 transition-colors flex gap-3 items-center group relative md:col-span-2"
                                            onClick={() => setQuantity(upsellOpportunity.requiredQty)}
                                        >
                                            <TrendingUp className="text-emerald-600 w-5 h-5 shrink-0" />
                                            <div className="flex-1">
                                                <p className="text-sm text-emerald-900 font-bold">
                                                    Reducere de Volum Disponibilă!
                                                </p>
                                                <p className="text-xs text-emerald-800 mt-1">
                                                    Dacă alegi <strong>{upsellOpportunity.requiredQty} buc</strong>, prețul scade la <strong>{formatMoneyDisplay(upsellOpportunity.newUnitPrice)}/buc</strong>.
                                                </p>
                                            </div>
                                            <div className="ml-auto flex flex-col items-end gap-2 shrink-0">
                                                <div className="flex items-center justify-center bg-white rounded-md px-2 py-0.5 shadow-sm border border-emerald-100">
                                                    <span className="text-xs font-bold text-emerald-600">-{upsellOpportunity.discountPercent}%</span>
                                                </div>
                                                <button type="button" className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-md font-bold shadow-sm group-hover:bg-emerald-700 transition-colors">
                                                    Aplică
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </AccordionStep>

                            <AccordionStep stepNumber={2} title="Material" summary={summaryStep2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)}>
                                <div className="grid grid-cols-2 gap-2">
                                    {AFISE_CONSTANTS.MATERIALS.filter((m: any) => isMaterialVisibleForSize(m.key, size)).map((m: any) => (
                                        <OptionButton key={m.key} active={material === m.key} onClick={() => setMaterial(m.key)} title={m.label} subtitle={m.description} />
                                    ))}
                                </div>
                            </AccordionStep>

                            <AccordionStep stepNumber={3} title="Grafică" summary={summaryStep3} isOpen={activeStep === 3} onClick={() => setActiveStep(3)} isLast={true}>
                                <div>
                                    {/* Editor Online button removed from here, moved to options below */}

                                    <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
                                        <div className="flex-1 min-w-[120px]">
                                            <OptionButton active={designOption === "upload"} onClick={() => setDesignOption("upload")} title="Am Grafică" subtitle="Încarc fișierul" />
                                        </div>
                                        <div className="flex-1 min-w-[120px]">
                                            <OptionButton active={designOption === "pro"} onClick={() => setDesignOption("pro")} title="Vreau Grafică" subtitle={`Design Pro`} />
                                        </div>
                                        <Link 
                                            href={`/editor?w=${size === 'A3' ? 29.7 : size === 'A2' ? 42 : size === 'A1' ? 59.4 : size === 'A0' ? 84.1 : size === 'S5' ? 50 : 70}&h=${size === 'A3' ? 42 : size === 'A2' ? 59.4 : size === 'A1' ? 84.1 : size === 'A0' ? 118.9 : size === 'S5' ? 70 : 100}&product=afise`}
                                            className="flex-1 min-w-[120px] p-3 rounded-xl border-2 border-orange-600 bg-orange-600 text-white flex flex-col items-center justify-center text-center gap-1 hover:bg-orange-700 transition-all transition-all"
                                        >
                                            <PencilRuler size={16} />
                                            <span className="text-xs font-bold leading-tight uppercase">Editor Online</span>
                                        </Link>
                                    </div>
                                    {designOption === 'upload' && (
                                        <div>
                                            <label className="flex flex-col items-center justify-center w-full h-32 px-4 bg-white border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-emerald-400 transition-colors">
                                                <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                                                <span className="font-medium text-gray-600 dark:text-gray-400">Apasă pentru a încărca</span>
                                                <input type="file" className="hidden" onChange={e => handleArtworkFileInput(e.target.files?.[0] ?? null)} />
                                            </label>
                                            {uploading && <p className="text-sm text-emerald-600 mt-2">Se încarcă...</p>}
                                            {uploadError && <p className="text-sm text-red-600 mt-2">{uploadError}</p>}
                                            {artworkUrl && !uploadError && <p className="text-sm text-green-600 font-semibold mt-2">Grafică încărcată!</p>}
                                        </div>
                                    )}
                                    {designOption === 'pro' && (
                                        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">
                                            <p className="font-semibold">Serviciu de Grafică Profesională</p>
                                            <p>Cost: <strong>{formatMoneyDisplay(priceData.proFee)}</strong>. Veți fi contactat pentru detalii.</p>
                                        </div>
                                    )}
                                </div>
                            </AccordionStep>
                        </div>

                        {/* TOTAL & ADD TO CART */}
                        {/* TOTAL & ADD TO CART - Sticky Mobile */}
                        {/* TOTAL & ADD TO CART - Sticky Mobile */}
                        <div className="relative z-40 lg:static bg-white lg:bg-white lg:backdrop-blur-none border-t lg:border border-gray-200 dark:border-slate-800 lg:rounded-2xl lg:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] p-4 lg:p-6 transition-all mt-8">
                            <div className="flex flex-col gap-4">
                                <button onClick={handleAddToCart} className="w-full py-4 text-lg font-bold bg-emerald-600 text-white rounded-xl shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 active:scale-95 animate-pulse-slow">
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
                            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Afișe și Postere Personalizate</h2>
                                <p className="text-lg leading-relaxed mb-6">
                                    Promovează-ți evenimentele sau ofertele cu afișe de înaltă calitate, imprimate pe o gamă variată de materiale. Alege dimensiunea și hârtia potrivită pentru mesajul tău.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Materiale & Calitate</h3>
                                        <ul className="space-y-2 list-disc pl-5">
                                            <li><strong>Whiteback:</strong> Hârtie standard pentru interior, excelentă pentru postere.</li>
                                            <li><strong>Blueback:</strong> Hârtie opacă pentru exterior, ideală pentru panotaj.</li>
                                            <li><strong>Hârtie Foto:</strong> Culori vibrante și finisaj lucios pentru proiecte premium.</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Tiraje & Tiraje</h3>
                                        <p>Indiferent dacă ai nevoie de 10 bucăți sau 10.000, tehnologia noastră de print offset și digital asigură cel mai mic preț per unitate pentru volumul tău.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeProductTab === 'faq' && <FaqAccordion qa={afiseFaqs} />}
                    </div>
                </div>
            </div>

            {detailsOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setDetailsOpen(false)}>
                    <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                        <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors" onClick={() => setDetailsOpen(false)} aria-label="Închide"><X size={20} className="text-gray-600 dark:text-gray-400" /></button>
                        <div className="p-8">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Detalii Afișe</h3>
                            <div className="space-y-6 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">Materiale Disponibile</h4>
                                    <p>Alegeți dintr-o gamă variată de hârtii și cartoane, de la cele standard de 150g, la materiale premium precum hârtia foto de 220g sau cartonul de 300g.</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">Specificații Tehnice</h4>
                                    <p>Afișele sunt imprimate color (policromie-CMYK) la o calitate superioară (300 dpi). Fișiere recomandate: PDF, AI, JPG.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}


