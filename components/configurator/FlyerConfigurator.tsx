"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { Plus, Minus, ShoppingCart, Info, ChevronDown, X, UploadCloud, MessageCircle, TrendingUp, PencilRuler } from "lucide-react";
import Link from 'next/link';
import DeliveryEstimation from "./DeliveryEstimation";
import FaqAccordion from "./FaqAccordion";
import { QA } from "@/types/configurator";
import {
    calculateFlyerPrice,
    getFlyerUpsell,
    FLYER_CONSTANTS,
    formatMoneyDisplay,
    type PriceInputFlyer
} from "@/lib/pricing";

const GALLERY_BASE = [
    "/products/flayere/flayere-1.webp",
    "/products/flayere/flayere-2.webp"
] as const;

const productFaqs: QA[] = [
    { question: "Ce dimensiuni sunt disponibile?", answer: "Standard: A6, A5 și variante personalizate (21×10 cm)." },
    { question: "Pot alege față/dos?", answer: "Da — selectați opțiunea 'Două fețe' pentru imprimare față-verso." },
    { question: "Care este timpul de livrare?", answer: "De regulă, flyerele sunt gata de livrare în 2-3 zile lucrătoare de la confirmarea graficii." },
];

import { AccordionStep } from "./ui/AccordionStep";
import { TabButtonSEO } from "./ui/TabButtonSEO";
import { NumberInput } from "./ui/NumberInput";
import { TabButton } from "./ui/TabButton";

export default function FlyerConfigurator({ productImage }: { productImage?: string }) {
    const { addItem } = useCart();
    const GALLERY = useMemo(() => productImage ? [productImage, ...GALLERY_BASE] : GALLERY_BASE, [productImage]);

    const MIN_QTY = 100;

    const [sizeKey, setSizeKey] = useState(FLYER_CONSTANTS.SIZES[0].key);
    const [quantity, setQuantity] = useState<number>(100);
    const [twoSided, setTwoSided] = useState<boolean>(false);
    const [paperWeightKey, setPaperWeightKey] = useState(FLYER_CONSTANTS.PAPER_WEIGHTS[0].key);
    const [designOption, setDesignOption] = useState<"upload" | "pro">("upload");

    const setQty = (v: number) => setQuantity(Math.max(MIN_QTY, Math.floor(v)));

    useEffect(() => {
        if (quantity < MIN_QTY) setQuantity(MIN_QTY);
    }, [quantity]);

    const [activeImage, setActiveImage] = useState<string>(GALLERY[0]);
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const [detailsOpen, setDetailsOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(1);
    const [activeProductTab, setActiveProductTab] = useState<'descriere' | 'faq'>('descriere');

    // Pricing
    const priceData = useMemo(() => calculateFlyerPrice({ sizeKey, quantity, twoSided, paperWeightKey, designOption } as PriceInputFlyer), [sizeKey, quantity, twoSided, paperWeightKey, designOption]);
    const displayedTotal = priceData.finalPrice;

    const upsellOpportunity = useMemo(() => {
        return getFlyerUpsell({ sizeKey, quantity, twoSided, paperWeightKey, designOption } as PriceInputFlyer);
    }, [sizeKey, quantity, twoSided, paperWeightKey, designOption]);

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

        const unitPrice = Math.round((displayedTotal / quantity) * 100) / 100;
        const uniqueId = `flyere-${Date.now()}`;
        const selectedSizeLabel = FLYER_CONSTANTS.SIZES.find(s => s.key === sizeKey)?.label || sizeKey;
        const title = `Flyer ${selectedSizeLabel}, ${twoSided ? 'Față-Verso' : 'Față'}`;

        addItem({
            id: uniqueId,
            productId: 'flayere',
            title: title,
            price: unitPrice,
            quantity: quantity,
            metadata: {
                "Dimensiune": selectedSizeLabel,
                "Față-Verso": twoSided ? "Da" : "Nu",
                "Hârtie": FLYER_CONSTANTS.PAPER_WEIGHTS.find(p => p.key === paperWeightKey)?.label || paperWeightKey,
                "Grafică": designOption === 'pro' ? 'Design Pro' : 'Grafică proprie',
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

    const summaryStep1 = `${sizeKey}, ${paperWeightKey}g`;
    const summaryStep2 = `${twoSided ? 'Față-Verso' : 'O singură față'}`;
    const summaryStep3 = designOption === 'upload' ? 'Grafică proprie' : 'Design Pro';

    return (
        <main className="bg-slate-50 dark:bg-slate-800 min-h-screen">
            <div className="container mx-auto px-4 py-8 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* STÂNGA - VIZUAL */}
                    <div className="lg:sticky top-24 h-max space-y-6">
                        <div className="bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-gray-200 dark:border-slate-800 overflow-hidden">
                            <div className="aspect-square relative flex items-center justify-center p-4">
                                <img src={activeImage} alt="Flyere" className="max-h-full max-w-full object-contain" />
                            </div>
                            <div className="p-2 grid grid-cols-4 gap-2 border-t border-gray-100">
                                {GALLERY.map((src, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveIndex(i)}
                                        className={`relative rounded-lg aspect-square overflow-hidden border-2 transition-all ${activeIndex === i ? "border-emerald-600 shadow-md" : "border-transparent opacity-70 hover:opacity-100"}`}
                                    >
                                        <img src={src} alt="Miniatura" loading="lazy" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* DREAPTA - CONFIGURATOR */}
                    <div>
                        <header className="mb-6">
                                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Configurator Flyere</h2>
                            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Flyere publicitare la prețuri imbatabile cu tiraje flexibile.</p>
                        </header>

                        <div className="bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-gray-200 dark:border-slate-800 px-4 mb-8">
                            <AccordionStep stepNumber={1} title="Dimensiune & Hârtie" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Dimensiune</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {FLYER_CONSTANTS.SIZES.map((s: any) => (
                                                <button
                                                    key={s.key}
                                                    onClick={() => setSizeKey(s.key)}
                                                    className={`py-2 text-xs font-bold border-2 rounded-lg transition-all ${sizeKey === s.key ? 'border-slate-950 bg-emerald-50 text-emerald-500' : 'border-gray-300 bg-white hover:border-gray-400'}`}
                                                >
                                                    {s.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Hârtie</label>
                                        <div className="grid grid-cols-1 gap-2">
                                            {FLYER_CONSTANTS.PAPER_WEIGHTS.map((p: any) => (
                                                <button
                                                    key={p.key}
                                                    onClick={() => setPaperWeightKey(p.key)}
                                                    className={`py-2 px-3 text-xs font-bold border-2 rounded-lg transition-all ${paperWeightKey === p.key ? 'border-slate-950 bg-emerald-50 text-emerald-500' : 'border-gray-300 bg-white hover:border-gray-400'}`}
                                                >
                                                    {p.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </AccordionStep>

                            <AccordionStep stepNumber={2} title="Tiraj & Imprimare" summary={summaryStep2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <NumberInput label="Cantitate (buc)" value={quantity} onChange={setQty} step={10} min={MIN_QTY} />
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Pagini</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button onClick={() => setTwoSided(false)} className={`py-3 rounded-lg border-2 text-sm font-bold ${!twoSided ? 'border-slate-950 bg-emerald-50 text-emerald-500' : 'border-gray-300 bg-white hover:border-gray-400'}`}>Față</button>
                                            <button onClick={() => setTwoSided(true)} className={`py-3 rounded-lg border-2 text-sm font-bold ${twoSided ? 'border-slate-950 bg-emerald-50 text-emerald-500' : 'border-gray-300 bg-white hover:border-gray-400'}`}>Față-Verso</button>
                                        </div>
                                    </div>
                                </div>

                                {upsellOpportunity && (
                                    <div
                                        className="mt-3 p-3 sm:p-4 bg-emerald-50 border border-emerald-200 rounded-lg cursor-pointer hover:bg-emerald-100 transition-colors flex gap-3 items-center group relative w-full"
                                        onClick={() => setQty(upsellOpportunity.requiredQty)}
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
                            </AccordionStep>

                            <AccordionStep stepNumber={3} title="Grafică" summary={summaryStep3} isOpen={activeStep === 3} onClick={() => setActiveStep(3)} isLast={true}>
                                <div>
                                    {/* Editor Online button removed from here, moved to tabs below */}

                                        <div className="flex -mb-px overflow-x-auto no-scrollbar">
                                            <TabButton active={designOption === 'upload'} onClick={() => setDesignOption('upload')}>Am Grafică</TabButton>
                                            <TabButton active={designOption === 'pro'} onClick={() => setDesignOption('pro')}>Vreau Grafică</TabButton>
                                            <Link 
                                                href={`/editor?w=${sizeKey === 'A6' ? 10.5 : sizeKey === 'A5' ? 14.8 : 21}&h=${sizeKey === 'A6' ? 14.8 : sizeKey === 'A5' ? 21 : 10}&product=flyere`}
                                                className="px-4 py-2 text-sm font-bold transition-all rounded-t-lg bg-orange-600 text-white hover:bg-orange-700 flex items-center gap-2 shrink-0 ml-auto"
                                            >
                                                <PencilRuler size={14} />
                                                Editor Online
                                            </Link>
                                        </div>

                                    {designOption === 'upload' && (
                                        <div className="space-y-3">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Încarcă fișierul de print (PDF/TIFF High-Res).</p>
                                            <label className="flex flex-col items-center justify-center w-full h-32 px-4 bg-white border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-emerald-400 transition-colors">
                                                <UploadCloud className="w-8 h-8 text-gray-400 mb-1" />
                                                <span className="font-medium text-gray-600 dark:text-gray-400">Încarcă fișierul</span>
                                                <input type="file" className="hidden" onChange={e => handleArtworkFileInput(e.target.files?.[0] ?? null)} />
                                            </label>
                                            {uploading && <p className="text-sm text-slate-950 mt-2">Se încarcă...</p>}
                                            {uploadError && <p className="text-sm text-red-600 mt-2">{uploadError}</p>}
                                            {artworkUrl && !uploadError && <p className="text-sm text-green-600 font-semibold mt-2">Grafică încărcată!</p>}
                                            
                                        </div>
                                    )}

                                    {designOption === 'pro' && (
                                        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">
                                            <p className="font-semibold">Serviciu Design Profesional</p>
                                            <p>Cost: <strong>{formatMoneyDisplay(priceData.proFee)}</strong>. Un designer va realiza macheta flyerului tău.</p>
                                        </div>
                                    )}
                                </div>
                            </AccordionStep>
                        </div>

                        {/* TOTAL & ADD TO CART - Standardized Layout */}
                        <div className="static mt-8 z-40 lg:static bg-white/95 backdrop-blur-md lg:bg-white lg:backdrop-blur-none border-t lg:border border-gray-200 dark:border-slate-800 lg:rounded-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] lg:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] p-4 lg:p-6 transition-all mt-8">
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
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Flyere Personalizate - Impact Vizual la Cost Redus</h2>
                                <p className="leading-relaxed mb-6">
                                    Flyerele rămân una dintre cele mai economice și eficiente metode de a promova o afacere, un eveniment sau o campanie locală. Printate pe hârtie de calitate, acestea atrag atenția instantaneu.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Specificații & Calitate</h3>
                                        <ul className="space-y-2 list-disc pl-5">
                                            <li><strong>Hârtie Lucrioasă:</strong> 115g, 135g sau 170g pentru un aspect vibrant.</li>
                                            <li><strong>Dimensiuni:</strong> A6 (compact), A5 (standard) și 21x10 cm (DL - tip meniu).</li>
                                            <li><strong>Cromatica:</strong> Tipar electronic/offset CMYK de mare fidelitate.</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Utilizări</h3>
                                        <p>Distribuție stradală, inserții în cutii poștale, flyere lăsate pe recepții sau în spații comerciale partenere.</p>
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
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Sfaturi Pregătire Grafică</h3>
                            <div className="space-y-6 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">Zona de Siguranță</h4>
                                    <p>Plasați toate elementele grafice importante (logo, text, contact) la cel puțin 3mm distanță de marginea finală a flyerului.</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">Format Recomandat</h4>
                                    <p>Pentru cea mai bună calitate, trimiteți fișiere PDF (CMYK) cu bleed inclus.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}


