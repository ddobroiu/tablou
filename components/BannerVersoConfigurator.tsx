"use client";
import React, { useState, useMemo } from "react";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/ToastProvider";
import { ShoppingCart, Check, ChevronDown, Package, ShieldCheck, Ruler, Sparkles, MessageCircle, Info, Minus, Plus, UploadCloud, Layers } from "lucide-react";
import DeliveryEstimation from "./DeliveryEstimation";
import Reviews from "./Reviews";
import FaqAccordion from "./FaqAccordion";
import Link from "next/link";
import RelatedProducts from "./RelatedProducts";
import QuickNav from "@/components/QuickNav";
import { formatMoneyDisplay, calculateBannerVersoPrice, getBannerVersoUpsell, BANNER_VERSO_CONSTANTS, type PriceInputBannerVerso, roundMoney } from "@/lib/pricing";

const AccordionStep = ({ stepNumber, title, summary, isOpen, onClick, children, isLast = false }: { stepNumber: number; title: string; summary: string; isOpen: boolean; onClick: () => void; children: React.ReactNode; isLast?: boolean; }) => (
    <div className="relative pl-12">
        <div className="absolute top-5 left-0 flex flex-col items-center h-full">
            <span className={`flex items-center justify-center w-8 h-8 rounded-full text-md font-bold transition-colors ${isOpen ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>{stepNumber}</span>
            {!isLast && <div className="w-px grow bg-gray-200 mt-2"></div>}
        </div>
        <div className="flex-1">
            <button type="button" className="w-full flex items-center justify-between py-5 text-left" onClick={onClick}>
                <div>
                    <h2 className="text-lg font-bold text-gray-800">{title}</h2>
                    {!isOpen && <p className="text-sm text-gray-500 truncate">{summary}</p>}
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
            </button>
            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100 pb-5" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">{children}</div>
            </div>
        </div>
    </div>
);

const TabButtonSEO = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button onClick={onClick} className={`flex-1 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-all ${active ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>{children}</button>
);

const OptionButton = ({ active, onClick, title, subtitle }: { active: boolean; onClick: () => void; title: string; subtitle?: string; }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`w-full text-left p-3 rounded-lg border-2 transition-all text-sm ${active ? "border-indigo-600 bg-indigo-50" : "border-gray-300 bg-white hover:border-gray-400"}`}
        >
            <div className="font-bold text-gray-800">{title}</div>
            {subtitle && <div className="text-xs text-gray-600 mt-1">{subtitle}</div>}
        </button>
    );
};

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
    const inc = (d: number) => onChange(Math.max(1, value + d));
    return (
        <div>
            <label className="field-label">{label}</label>
            <div className="flex">
                <button onClick={() => inc(-1)} className="p-3 bg-gray-100 rounded-l-lg hover:bg-gray-200" aria-label="Scade cantitatea">
                    <Minus size={16} />
                </button>
                <input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 1))}
                    className="input text-center w-full rounded-none border-x-0"
                    min="1"
                />
                <button onClick={() => inc(1)} className="p-3 bg-gray-100 rounded-r-lg hover:bg-gray-200" aria-label="Creste cantitatea">
                    <Plus size={16} />
                </button>
            </div>
        </div>
    );
}

interface PredefinedBannerVariant {
    size: string;
    price: number;
    id: number | string;
}

interface Props {
    productSlug?: string;
    initialWidth?: number;
    initialHeight?: number;
    productImage?: string;
    product?: any; // Fallback
}

export default function BannerVersoConfigurator({ productSlug, initialWidth, initialHeight, productImage, product }: Props) {
    const { addItem } = useCart();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<"descriere" | "recenzii" | "faq">("descriere");
    const [quantity, setQuantity] = useState(1);
    const [activeStep, setActiveStep] = useState(1);
    
    // Simplification: We assume variants are passed via product prop or we might need to fetch them if strictly needed.
    // Ideally we usage a similar logic to SaleRentBannerConfigurator regarding variants.
    // Since I don't have the variants list here, I will try to use product.metadata.variants if available, or define some defaults.
    const variants: PredefinedBannerVariant[] = product?.metadata?.variants || [
        { id: 1, size: "1x1m", price: 100 },
        { id: 2, size: "2x1m", price: 200 },
        { id: 3, size: "3x1m", price: 300 },
        { id: 4, size: "4x1m", price: 400 },
        { id: 5, size: "5x1m", price: 500 },
    ];

    const [selectedVariantId, setSelectedVariantId] = useState<string | number | null>(variants[0]?.id || null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [customText, setCustomText] = useState("");
    const [wantWindHoles, setWantWindHoles] = useState(false);
    const [sameGraphic, setSameGraphic] = useState(true);

    // Design options state
    const [designOption, setDesignOption] = useState<'standard' | 'upload' | 'text_only' | 'pro'>('standard');
    const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [textDesign, setTextDesign] = useState("");

    const selectedVariant = variants.find(v => v.id === selectedVariantId) || variants[0];
    const image = productImage || product?.images?.[0] || "/placeholder.png";
    const title = product?.title || "Banner Față-Verso";
    const description = product?.description || "Banner printat pe ambele fețe (Blockout).";

    // Format size for display
    const formatSize = (sizeSlug: string) => {
        return sizeSlug.replace(/-/g, '.').replace('.x.', ' x ').replace(/m/g, 'm').toUpperCase();
    };

    // --- ADVANCED PRICING LOGIC ---
    const priceData = useMemo(() => {
        if (!selectedVariant) return { finalPrice: 0, oldTotalPrice: 0, discountPercent: 0, upsellMessage: null as string | null };

        let width_cm = 0;
        let height_cm = 0;

        try {
            let s = selectedVariant.size.toLowerCase().replace(/[m\s]/g, '');
            s = s.replace(/-x-/g, 'x').replace(/-x/g, 'x').replace(/x-/g, 'x');
            const [wPart, hPart] = s.split('x');

            if (wPart && hPart) {
                const wClean = wPart.replace(/-/g, '.');
                const hClean = hPart.replace(/-/g, '.');
                width_cm = parseFloat(wClean) * 100;
                height_cm = parseFloat(hClean) * 100;
            }
        } catch (e) {
            console.error("Error parsing dimensions:", selectedVariant.size);
        }

        const input: PriceInputBannerVerso = {
            width_cm,
            height_cm,
            quantity,
            want_wind_holes: wantWindHoles,
            same_graphic: sameGraphic,
            designOption: designOption === "standard" ? "text_only" : designOption // Map 'standard' to something calculated or handle separately
        };
        // Fix: Standard option usually means text only or upload but without specific file yet. 
        // In calculation logic, 'standard' isn't a type. Let's assume 'text_only' for price parity base or 'upload'.
        // Actually SaleRentBanner used 'upload' for base calculation.
        
        const calcInput: PriceInputBannerVerso = {
             ...input,
             designOption: (designOption === 'standard' || designOption === 'upload') ? 'upload' : designOption as any
        };

        const calculated = calculateBannerVersoPrice(calcInput);

        // Calculate "Old Price" (Base Price * Quantity)
        const baseInput = { ...calcInput, quantity: 1 };
        const baseCalculated = calculateBannerVersoPrice(baseInput);
        const oldTotalPrice = baseCalculated.finalPrice * quantity;

        const finalPrice = calculated.finalPrice;

        let discountPercent = 0;
        if (oldTotalPrice > 0 && oldTotalPrice > finalPrice) {
            discountPercent = Math.round(((oldTotalPrice - finalPrice) / oldTotalPrice) * 100);
        }

        // UPSELL LOGIC
        const upsell = getBannerVersoUpsell(calcInput);
        const upsellMessage = upsell?.hasUpsell ? upsell.message : null;

        return { finalPrice, oldTotalPrice, discountPercent, upsellMessage };
    }, [selectedVariant, quantity, wantWindHoles, sameGraphic, designOption]);

    const { finalPrice: totalPrice, oldTotalPrice, discountPercent, upsellMessage } = priceData;

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

    const handleAddToCart = () => {
        if (!selectedVariant) return;
        const sizeDisplay = formatSize(selectedVariant.size);

        addItem({
            id: `banner-verso-${selectedVariant.id}-${sameGraphic ? 'same' : 'diff'}-${wantWindHoles ? 'wind' : 'nowind'}-${designOption}`,
            title: title,
            price: totalPrice / quantity,
            quantity: quantity,
            metadata: {
                "Dimensiune": sizeDisplay,
                "Material": "Blockout (Față-Verso)",
                "Finisaje": `Tiv + Capse${wantWindHoles ? ' + Găuri de Vânt' : ''}`,
                "Grafică": sameGraphic ? "Identică pe ambele fețe" : "Diferită (Față/Verso)",
                "Tip": "Banner Față-Verso",
                "Text Personalizat": customText || "-",
                "Opțiune Grafică": designOption === 'standard' ? 'Model Standard' : (designOption === 'upload' ? 'Grafică Proprie' : (designOption === 'text_only' ? 'Doar Text' : 'Vreau Grafică')),
                ...(designOption === 'text_only' && { "Text Design": textDesign }),
                ...(designOption === 'upload' && artworkUrl && { "Fișier": artworkUrl }),
                ...(discountPercent > 0 ? { "Discount Volum": `${discountPercent}%` } : {})
            }
        });
        showToast("Produsul a fost adăugat în coș!", "success");
    };

    const summaryStep1 = selectedVariant ? `Dimensiune: ${formatSize(selectedVariant.size)}` : "Alege";
    const summaryStep2 = `Blockout${wantWindHoles ? ', cu găuri' : ''}${sameGraphic ? ', Grafică Identică' : ', Grafică Diferită'}`;
    const summaryStep3 = designOption === 'standard' ? 'Model Standard' : (designOption === 'upload' ? 'Grafică Proprie' : (designOption === 'text_only' ? 'Doar Text' : 'Vreau Grafică'));

    return (
        <main className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-10 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* LEFT: GALLERY */}
                    <div className="lg:sticky top-24 h-max space-y-8">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                            <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                                <img src={image} alt={title} className="h-full w-full object-contain" />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: CONFIGURATOR */}
                    <div>
                        <header className="mb-6">
                            <div className="flex justify-between items-center gap-4 mb-3">
                                <div>
                                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Banner Față-Verso</span>
                                    <h1 className="text-3xl font-extrabold text-gray-900 mt-1">{title}</h1>
                                </div>
                            </div>
                            <div className="flex justify-between items-center"><p className="text-gray-600">Configurează produsul în 3 pași.</p><button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline inline-flex items-center text-sm px-3 py-1.5"><Info size={16} /><span className="ml-2">Detalii</span></button></div>
                        </header>

                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-4">

                            {/* STEP 1: DIMENSIONS */}
                            <AccordionStep stepNumber={1} title="Alege Dimensiunea" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                                <div className="grid grid-cols-1 gap-4">
                                    <label className="field-label">Dimensiuni Disponibile</label>
                                    <div className="flex flex-wrap gap-2">
                                        {variants.map((v) => (
                                            <button
                                                key={v.id}
                                                onClick={() => setSelectedVariantId(v.id)}
                                                className={`px-4 py-3 rounded-lg border-2 transition-all font-bold text-sm ${selectedVariantId === v.id
                                                    ? "border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm"
                                                    : "border-gray-200 hover:border-gray-300 text-gray-700 bg-white"
                                                    }`}
                                            >
                                                {formatSize(v.size)}
                                            </button>
                                        ))}

                                        <Link
                                            href={`/contact?subject=Oferta%20Custom%20Banner%20Verso`}
                                            className="px-4 py-3 rounded-lg border-2 border-dashed border-indigo-200 bg-indigo-50/50 text-indigo-600 hover:bg-indigo-100 hover:border-indigo-300 transition-all font-bold text-sm flex items-center gap-2"
                                        >
                                            <Ruler size={16} />
                                            <span>Altă Dimensiune?</span>
                                        </Link>
                                    </div>

                                    <div className="mt-4">
                                        <div className="mb-4">
                                            <label className="field-label mb-2 block">Textul Tău (Opțional)</label>
                                            <input
                                                type="text"
                                                value={customText}
                                                onChange={(e) => setCustomText(e.target.value)}
                                                placeholder="Ex: 07xx xxx xxx / SPATIU DE ÎNCHIRIAT"
                                                className="input w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-gray-800 placeholder:text-gray-400"
                                            />
                                        </div>

                                        <NumberInput label="Cantitate" value={quantity} onChange={setQuantity} />

                                        {upsellMessage && (
                                            <div className="mt-3 p-3 bg-indigo-50 border border-indigo-100 rounded-lg flex gap-3 animate-in fade-in duration-300">
                                                <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                                                <div className="text-sm text-indigo-900">
                                                    <p className="font-bold mb-0.5">Reducere de Volum Disponibilă!</p>
                                                    <p>{upsellMessage}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </AccordionStep>

                            {/* STEP 2: FINISHES */}
                            <AccordionStep stepNumber={2} title="Material & Opțiuni" summary={summaryStep2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)} isLast={true}>
                                <div className="space-y-4">
                                    
                                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-100 rounded text-indigo-700">
                                                <Layers size={20} />
                                            </div>
                                            <div>
                                                <span className="text-sm font-bold text-gray-800">Material Blockout (Opac)</span>
                                                <p className="text-xs text-gray-500">Material special care nu permite trecerea luminii, pentru print față-verso.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <OptionButton 
                                            active={sameGraphic}
                                            onClick={() => setSameGraphic(true)}
                                            title="Grafică Identică"
                                            subtitle="Față = Verso"
                                        />
                                        <OptionButton 
                                            active={!sameGraphic}
                                            onClick={() => setSameGraphic(false)}
                                            title="Grafică Diferită"
                                            subtitle="Față ≠ Verso"
                                        />
                                    </div>

                                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="checkbox w-5 h-5 text-indigo-600 focus:ring-indigo-500 rounded border-gray-300"
                                                checked={wantWindHoles}
                                                onChange={(e) => setWantWindHoles(e.target.checked)}
                                            />
                                            <div>
                                                <span className="text-sm font-bold text-gray-800">Adaugă Găuri de Vânt (Mesh)</span>
                                                <p className="text-xs text-gray-500">Recomandat pentru expunere la vânt.</p>
                                            </div>
                                        </label>
                                    </div>

                                    <div className="flex items-start gap-3 p-3 bg-blue-50 text-blue-800 rounded-lg text-xs">
                                        <Info className="w-4 h-4 mt-0.5 shrink-0" />
                                        <p>Include tiv perimetral și capse de prindere.</p>
                                    </div>
                                </div>
                            </AccordionStep>

                             {/* STEP 3: GRAPHICS */}
                             <AccordionStep stepNumber={3} title="Grafică" summary={summaryStep3} isOpen={activeStep === 3} onClick={() => setActiveStep(3)} isLast={true}>
                                <div>
                                    {designOption === 'standard' ? (
                                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-20 h-20 rounded-lg bg-white p-1 border border-slate-200 shadow-sm shrink-0">
                                                    <img src={image} alt="Model" className="w-full h-full object-cover rounded" />
                                                </div>
                                                <div>
                                                    <span className="inline-block px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-bold mb-1">STANDARD</span>
                                                    <p className="font-bold text-slate-800 text-sm leading-tight mb-1">Modelul din imagine</p>
                                                    <p className="text-xs text-slate-500">Vom imprima exact acest model.</p>
                                                </div>
                                            </div>
                                            <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-sm">
                                                <span className="text-gray-600 font-medium">Dorești altă grafică?</span>
                                                <button
                                                    onClick={() => setDesignOption('upload')}
                                                    className="text-indigo-600 font-bold hover:underline"
                                                >
                                                    Schimbă Grafica
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="mb-4 border-b border-gray-200">
                                                <div className="flex -mb-px overflow-x-auto">
                                                    <button onClick={() => setDesignOption('standard')} className="flex-1 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors border-transparent text-gray-400 hover:text-gray-600">Standard</button>
                                                    <button onClick={() => setDesignOption('upload')} className={`flex-1 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${designOption === 'upload' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Încarcă</button>
                                                    <button onClick={() => setDesignOption('text_only')} className={`flex-1 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${designOption === 'text_only' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Text</button>
                                                    <button onClick={() => setDesignOption('pro')} className={`flex-1 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${designOption === 'pro' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Pro</button>
                                                </div>
                                            </div>

                                            {designOption === 'upload' && (
                                                <div className="space-y-3">
                                                    <p className="text-sm text-gray-600">Încarcă fișierul tău (PDF, JPG, AI, CDR).</p>
                                                    <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                                                        <span className="flex items-center space-x-2"><UploadCloud className="w-6 h-6 text-gray-600" /><span className="font-medium text-gray-600">Apasă pentru a încărca</span></span>
                                                        <input type="file" name="file_upload" className="hidden" onChange={e => handleArtworkFileInput(e.target.files?.[0] ?? null)} />
                                                    </label>
                                                    {uploading && <p className="text-sm text-indigo-600">Se încarcă...</p>}
                                                    {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
                                                    {artworkUrl && !uploadError && <p className="text-sm text-green-600 font-semibold">Fișier încărcat!</p>}
                                                </div>
                                            )}

                                            {designOption === 'text_only' && (
                                                <div className="space-y-3">
                                                    <label className="field-label">Introdu textul dorit</label>
                                                    <textarea className="input" rows={3} value={textDesign} onChange={e => setTextDesign(e.target.value)} placeholder="Ex: Textul pentru banner..."></textarea>
                                                </div>
                                            )}

                                            {designOption === 'pro' && (
                                                <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200 text-sm text-indigo-800">
                                                    <p className="font-semibold">Serviciu de Grafică Profesională</p>
                                                    {/* We can dynamically show price if available or general message */}
                                                    <p>Un designer te va contacta pentru realizarea graficii.</p>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </AccordionStep>
                        </div>

                        {/* STICKY BOTTOM BAR */}
                        <div className="sticky bottom-0 lg:static bg-white/80 lg:bg-white backdrop-blur-sm lg:backdrop-blur-none border-t-2 lg:border lg:rounded-2xl lg:shadow-lg border-gray-200 py-4 lg:p-6 lg:mt-8 z-30">
                            <div className="flex flex-col gap-3">
                                <button onClick={handleAddToCart} disabled={!selectedVariant} className="btn-primary w-full py-4 text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                    <ShoppingCart size={24} />
                                    <span className="ml-2">Adaugă în Coș</span>
                                </button>
                                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-2">
                                    <div className="flex flex-col">
                                        {discountPercent > 0 && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-400 line-through font-medium">{formatMoneyDisplay(oldTotalPrice)}</span>
                                                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">-{discountPercent}% Reducere</span>
                                            </div>
                                        )}
                                        <p className="text-3xl font-extrabold text-gray-900">{formatMoneyDisplay(totalPrice)}</p>
                                    </div>
                                    <div className="lg:ml-auto">
                                        <DeliveryEstimation />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* WHATSAPP & INFO */}
                        <div className="mt-4 lg:mt-6 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 text-center font-medium">Ai nevoie de ajutor sau o ofertă personalizată?</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <a
                                    href={`https://wa.me/40750473111?text=Ma%20intereseaza%20produsul%20${encodeURIComponent(title)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                                >
                                    <MessageCircle size={18} />
                                    <span className="text-sm">WhatsApp</span>
                                </a>
                                <button
                                    type="button"
                                    onClick={() => window.location.href = '/contact'}
                                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                                >
                                    <Info size={18} />
                                    <span className="text-sm">Cerere Ofertă</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TABS SECTION */}
                <div className="mt-8 lg:mt-12 bg-white rounded-2xl shadow-lg border border-gray-200">
                    <nav className="border-b border-gray-200 flex">
                        <TabButtonSEO active={activeTab === "descriere"} onClick={() => setActiveTab("descriere")}>Descriere</TabButtonSEO>
                        <TabButtonSEO active={activeTab === "recenzii"} onClick={() => setActiveTab("recenzii")}>Recenzii</TabButtonSEO>
                        <TabButtonSEO active={activeTab === "faq"} onClick={() => setActiveTab("faq")}>FAQ</TabButtonSEO>
                    </nav>

                    <div className="p-6 lg:p-8">
                        {activeTab === 'descriere' && (
                            <>
                                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">{title}</h2>
                                <div className="prose prose-sm prose-slate max-w-none text-base lg:text-lg text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: description }} />

                                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-2">Detalii Tehnice</h3>
                                        <p className="text-sm text-gray-600">Banner Blockout (Opac) cu print pe ambele fețe. Vizibilitate maximă.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-gray-700"><Check className="text-green-500 w-4 h-4" /> Material Blockout (Nu trece lumina)</div>
                                        <div className="flex items-center gap-2 text-sm text-gray-700"><Check className="text-green-500 w-4 h-4" /> Print Față-Verso</div>
                                        <div className="flex items-center gap-2 text-sm text-gray-700"><Check className="text-green-500 w-4 h-4" /> Finisaje incluse (tiv + capse)</div>
                                    </div>
                                </div>
                            </>
                        )}
                        {activeTab === "recenzii" && <Reviews productSlug={productSlug} />}
                        {activeTab === "faq" && <FaqAccordion qa={[{ question: "Cât durează livrarea?", answer: "De obicei 24-48h lucrătoare." }]} />}
                    </div>
                </div>

                {/* NAVIGARE RAPIDĂ */}
                <div className="mt-12 mb-8">
                    <QuickNav title="Vrei să personalizezi alt produs?" />
                </div>

                {/* RELATED PRODUCTS SECTION */}
                <RelatedProducts
                    category={product?.metadata?.category || "bannere"}
                    title="Alte Produse"
                    maxProducts={12}
                />
            </div>
        </main>
    );
}
