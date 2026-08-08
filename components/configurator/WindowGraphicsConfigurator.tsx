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
    calculateWindowGraphicsPrice,
    getWindowGraphicsUpsell,
    WINDOW_GRAPHICS_CONSTANTS,
    formatMoneyDisplay,
    type PriceInputWindowGraphics
} from "@/lib/pricing";

const GALLERY_BASE = [
    "/products/window-graphics/window-graphics-1.webp",
    "/products/window-graphics/window-graphics-2.webp"
] as const;

const productFaqs: QA[] = [
    { question: "Ce este folia perforată pentru ferestre?", answer: "Este o folie PVC specială cu perforații (raport 50% printabil / 50% transparent) care permite vizibilitatea dinspre interior spre exterior, dar oferă suprafață de print pe exterior." },
    { question: "Cum se aplică?", answer: "Aplicarea se face doar uscat, pe suprafețe curate de sticlă. Nu necesită apă sau soluții speciale." },
    { question: "Cât rezistă?", answer: "Durabilitate până la 3 ani, rezistentă la UV și intemperii. Adezivul removabil permite îndepărtarea fără urme semnificative." },
];

import { AccordionStep } from "./ui/AccordionStep";
import { TabButtonSEO } from "./ui/TabButtonSEO";
import { NumberInput } from "./ui/NumberInput";
import { TabButton } from "./ui/TabButton";
import StickerModeSwitchInline from "./StickerModeSwitchInline";

export default function WindowGraphicsConfigurator({ initialWidth: initW, initialHeight: initH, productImage }: { initialWidth?: number; initialHeight?: number; productImage?: string }) {
    const { addItem } = useCart();
    const GALLERY = useMemo(() => productImage ? [productImage, ...GALLERY_BASE] : GALLERY_BASE, [productImage]);

    const [input, setInput] = useState<PriceInputWindowGraphics>({
        width_cm: initW ?? 100,
        height_cm: initH ?? 100,
        quantity: 1,
        designOption: "upload",
        print_type: "print_cut",
        laminated: false,
    });

    const [lengthText, setLengthText] = useState(initW ? String(initW) : "100");
    const [heightText, setHeightText] = useState(initH ? String(initH) : "100");

    const [activeImage, setActiveImage] = useState<string>(GALLERY[0]);
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const [detailsOpen, setDetailsOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(1);
    const [activeProductTab, setActiveProductTab] = useState<'descriere' | 'faq'>('descriere');

    // EFFECT: Handle initial props from Editor
    useEffect(() => {
        if (productImage) {
            setArtworkUrl(productImage);
            setActiveImage(productImage);
            updateInput('designOption', 'upload');
        }
        if (initW && initH) {
            setInput(prev => ({ ...prev, width_cm: initW, height_cm: initH }));
            setLengthText(String(initW));
            setHeightText(String(initH));
        }
    }, [productImage, initW, initH]);

    // Pricing
    const priceData = useMemo(() => calculateWindowGraphicsPrice(input), [input]);
    const displayedTotal = priceData.finalPrice;

    const upsellOpportunity = useMemo(() => getWindowGraphicsUpsell(input), [input]);

    const updateInput = <K extends keyof PriceInputWindowGraphics>(k: K, v: PriceInputWindowGraphics[K]) => setInput((p) => ({ ...p, [k]: v }));
    const setQty = (v: number) => updateInput("quantity", Math.max(1, Math.floor(v)));

    const handleDimChange = (val: string, setter: (v: string) => void, field: "width_cm" | "height_cm") => {
        let v = val.replace(/,/g, '.');
        if (!/^[0-9]*\.?[0-9]*$/.test(v)) return;
        setter(v);
        const num = parseFloat(v);
        if (!isNaN(num)) {
            updateInput(field, num);
        } else if (v === "") {
            updateInput(field, 0);
        }
    };

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
        if (!input.width_cm || !input.height_cm) {
            alert("Introduceți dimensiunile vitrinei.");
            return;
        }
        if (displayedTotal <= 0) {
            alert("Prețul trebuie calculat.");
            return;
        }

        const unitPrice = Math.round((displayedTotal / input.quantity) * 100) / 100;
        const uniqueId = `window-graphics-${Date.now()}`;
        const title = `Window Graphics - ${input.width_cm}x${input.height_cm} cm`;

        addItem({
            id: uniqueId,
            productId: 'window-graphics',
            title: title,
            price: unitPrice,
            quantity: input.quantity,
            metadata: {
                "Dimensiune": `${input.width_cm}x${input.height_cm} cm`,
                "Material": "Folie Perforată One-Way Vision",
                "Tip Producție": input.print_type === 'print_cut' ? 'Print + Cut' : 'Doar Print',
                "Laminare": input.laminated ? 'Da' : 'Nu',
                "Grafică": input.designOption === 'pro' ? 'Design Pro' : 'Grafică proprie',
                "artworkUrl": artworkUrl,
                "width": input.width_cm,
                "height": input.height_cm,
            },
        });
        alert("Adăugat în coș!");
    }

    useEffect(() => {
        if (artworkUrl) return;
        const id = setInterval(() => setActiveIndex((i) => (i + 1) % GALLERY.length), 5000);
        return () => clearInterval(id);
    }, [GALLERY.length, artworkUrl]);

    useEffect(() => setActiveImage(GALLERY[activeIndex]), [activeIndex, GALLERY]);

    const summaryStep1 = input.width_cm > 0 && input.height_cm > 0 ? `${input.width_cm}x${input.height_cm} cm` : "Alege";
    const summaryStep2 = `${input.print_type === 'print_cut' ? 'Print+Cut' : 'Doar Print'}${input.laminated ? ', Laminat' : ''}`;
    const summaryStep3 = input.designOption === 'upload' ? 'Grafică proprie' : 'Design Pro';

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
                                    alt="Window Graphics" 
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
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
                                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">Configurator Window Graphics</h2>
                                <StickerModeSwitchInline />
                            </div>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Folie perforată One-Way Vision pentru vitrine și geamuri auto.</p>
                                <button type="button" onClick={() => setDetailsOpen(true)} className="inline-flex items-center text-sm px-3 py-1.5 border border-gray-300 rounded hover:bg-slate-50 dark:bg-slate-800 transition-colors text-gray-700 dark:text-gray-300 font-medium">
                                    <Info size={16} /><span className="ml-2">Detalii</span>
                                </button>
                            </div>
                        </header>

                        <div className="bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-gray-200 dark:border-slate-800 px-4 mb-8">
                            <AccordionStep stepNumber={1} title="Dimensiuni & Cantitate" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Lungime (cm)</label>
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            value={lengthText}
                                            onFocus={(e) => e.target.select()}
                                            onChange={(e) => handleDimChange(e.target.value, setLengthText, "width_cm")}
                                            placeholder="100"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Înălțime (cm)</label>
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            value={heightText}
                                            onFocus={(e) => e.target.select()}
                                            onChange={(e) => handleDimChange(e.target.value, setHeightText, "height_cm")}
                                            placeholder="100"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                </div>
                                <NumberInput label="Cantitate (buc)" value={input.quantity} onChange={setQty} step={1} />

                                {upsellOpportunity && (
                                    <div
                                        className="mt-3 p-3 sm:p-4 bg-emerald-50 border border-emerald-200 rounded-lg cursor-pointer hover:bg-emerald-100 transition-colors flex gap-3 items-center group relative"
                                        onClick={() => updateInput("quantity", upsellOpportunity.requiredQty)}
                                    >
                                        <TrendingUp className="text-emerald-600 w-5 h-5 shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-sm text-emerald-900 font-bold">Reducere de Volum!</p>
                                            <p className="text-xs text-emerald-800 mt-1">
                                                Alege <strong>{upsellOpportunity.requiredQty} mp</strong> și prețul scade la <strong>{formatMoneyDisplay(upsellOpportunity.newUnitPrice)}/mp</strong>.
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

                            <AccordionStep stepNumber={2} title="Opțiuni Producție" summary={summaryStep2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tip producție</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => updateInput("print_type", "print_cut")}
                                                className={`p-3 border-2 rounded-xl text-left transition-all ${input.print_type === "print_cut" ? "border-emerald-600 bg-emerald-50" : "border-gray-200 dark:border-slate-800 hover:border-emerald-200"}`}
                                            >
                                                <p className="font-bold text-slate-900 dark:text-white text-sm">Print + Cut</p>
                                                <p className="text-xs text-gray-500">Tăiere pe contur (cut)</p>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => updateInput("print_type", "print_only")}
                                                className={`p-3 border-2 rounded-xl text-left transition-all ${input.print_type === "print_only" ? "border-emerald-600 bg-emerald-50" : "border-gray-200 dark:border-slate-800 hover:border-emerald-200"}`}
                                            >
                                                <p className="font-bold text-slate-900 dark:text-white text-sm">Doar Print</p>
                                                <p className="text-xs text-gray-500 text-emerald-600 font-medium">Reducere -20%</p>
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Finisaj Protecție</label>
                                        <label className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer hover:bg-slate-50 dark:bg-slate-800 transition-all border-gray-200 dark:border-slate-800">
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300"
                                                checked={input.laminated}
                                                onChange={(e) => updateInput("laminated", e.target.checked)}
                                            />
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white text-sm">Laminare (+10%)</p>
                                                <p className="text-xs text-gray-500">Protecție UV și la zgârieturi. Recomandat!</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </AccordionStep>

                            <AccordionStep stepNumber={3} title="Grafică" summary={summaryStep3} isOpen={activeStep === 3} onClick={() => setActiveStep(3)} isLast={true}>
                                <div>
                                    {/* Editor Online button removed from here, moved to tabs below */}

                                        <div className="flex -mb-px overflow-x-auto no-scrollbar">
                                            <TabButton active={input.designOption === 'upload'} onClick={() => updateInput("designOption", 'upload')}>Am Grafică</TabButton>
                                            <TabButton active={input.designOption === 'pro'} onClick={() => updateInput("designOption", 'pro')}>Vreau Grafică</TabButton>
                                            <Link 
                                                href={`/editor?w=${input.width_cm}&h=${input.height_cm}&product=window-graphics`}
                                                className="px-4 py-2 text-sm font-bold transition-all rounded-t-lg bg-orange-600 text-white hover:bg-orange-700 flex items-center gap-2 shrink-0 ml-auto"
                                            >
                                                <PencilRuler size={14} />
                                                Editor Online
                                            </Link>
                                        </div>

                                    {input.designOption === 'upload' && (
                                        <div className="space-y-3">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Încarcă fișierul (PDF, AI, JPG). Rezoluție recomandată: 150 DPI.</p>
                                            <label className="flex flex-col items-center justify-center w-full h-32 px-4 bg-white border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-emerald-400 transition-colors">
                                                <UploadCloud className="w-8 h-8 text-gray-400 mb-1" />
                                                <span className="font-medium text-gray-600 dark:text-gray-400">Încarcă fișierul</span>
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
                                            <p>Cost: <strong>{formatMoneyDisplay(WINDOW_GRAPHICS_CONSTANTS.PRO_DESIGN_FEE)}</strong>. Un designer se va ocupa de proiectul tău.</p>
                                        </div>
                                    )}

                                </div>
                            </AccordionStep>
                        </div>

                        {/* TOTAL & ADD TO CART */}
                        {/* TOTAL & ADD TO CART - Sticky Mobile */}
                        {/* TOTAL & ADD TO CART - Sticky Mobile */}
                        <div className="static mt-8 z-40 lg:static bg-white/95 backdrop-blur-md lg:bg-white lg:backdrop-blur-none border-t lg:border border-gray-200 dark:border-slate-800 lg:rounded-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] lg:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] p-4 lg:p-6 transition-all">
                            <div className="flex flex-col gap-4">
                                <button onClick={handleAddToCart} className="w-full py-4 text-lg font-bold bg-emerald-600 text-white rounded-xl shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 active:scale-95 animate-pulse-slow">
                                    <ShoppingCart size={24} />
                                    Adaugă în Coș
                                </button>

                                <div className="flex flex-col gap-1 w-full border-t border-gray-100 pt-2 mt-2">
                                    <div className="flex flex-row justify-between items-center w-full gap-2">
                                        <div className="flex flex-col items-start leading-none">
                                            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Preț Total</span>
                                            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{formatMoneyDisplay(displayedTotal)}</span>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <DeliveryEstimation />
                                        </div>
                                    </div>
                                    {priceData.total_sqm > 0 && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            Suprafață: {priceData.total_sqm.toFixed(2)} mp × {priceData.pricePerSqm} lei/mp
                                        </p>
                                    )}
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
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Window Graphics - Folie Perforată Vitrine</h2>
                                <p className="leading-relaxed mb-6">
                                    Window Graphics este soluția ideală pentru publicitatea pe vitrine. Datorită perforațiilor speciale, persoanele din interior pot vedea perfect afară, în timp ce de la exterior se vede doar grafica imprimată.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Material & Tehnologie</h3>
                                        <ul className="space-y-2 list-disc pl-5">
                                            <li><strong>One-Way Vision:</strong> Efect oglindă inversat.</li>
                                            <li><strong>Protecție UV:</strong> Culori rezistente la soare timp îndelungat.</li>
                                            <li><strong>Removabilitate:</strong> Se îndepărtează fără a lăsa urme de adeziv greu de curățat.</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Recomandări</h3>
                                        <p>Ideal pentru magazine, farmacii, sedii de bănci sau geamuri spate/laterale ale autovehiculelor comerciale.</p>
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
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Specificații Window Graphics</h3>
                            <div className="space-y-6 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">Vizibilitate Unidirecțională</h4>
                                    <p>Folia are un raport de perforare de 50/50, ceea ce înseamnă că jumătate din suprafață este printabilă iar jumătate este reprezentată de micro-găuri prin care trece lumina.</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">Întreținere</h4>
                                    <p>Se poate curăța cu soluții standard de geamuri, dar recomandăm evitarea jetului de apă cu presiune mare la spălătoriile auto pe marginile foliei.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}


