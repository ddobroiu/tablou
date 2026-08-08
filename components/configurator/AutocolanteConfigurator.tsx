"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { Ruler, Layers, Plus, Minus, ShoppingCart, Info, ChevronDown, X, UploadCloud, TrendingUp, Percent, MessageCircle, PencilRuler } from "lucide-react";
import Link from 'next/link';
import DeliveryEstimation from "./DeliveryEstimation";
import { usePathname, useRouter } from "next/navigation";
import FaqAccordion from "./FaqAccordion";
import { QA } from "@/types/configurator";
import { useUserActivityTracking } from "@/hooks/useAbandonedCartCapture";
import {
    calculateAutocolantePrice,
    getAutocolanteUpsell,
    AUTOCOLANTE_CONSTANTS,
    formatMoneyDisplay,
    type PriceInputAutocolante,
    type AutocolantesMaterialKey
} from "@/lib/pricing";
import ProductJsonLd from "@/components/ProductJsonLd";

const GALLERY_BASE = [
    "/products/autocolante/autocolante-1.webp",
    "/products/autocolante/autocolante-2.webp"
] as const;

/* --- FAQs SPECIFIC PRODUSULUI --- */
const productFaqs: QA[] = [
    { question: "Care este diferența dintre hârtie și vinyl?", answer: "Hârtia este economică și potrivită pentru interior sau etichete de produs de scurtă durată. Vinyl-ul (PVC) este plastic, rezistent la apă și rupere, ideal pentru exterior sau produse care intră în contact cu umezeala." },
    { question: "Ce înseamnă 'Die-cut' (tăiere pe contur)?", answer: "Die-cut înseamnă că autocolantul este tăiat exact pe forma graficii tale (ex: rotund, stea, formă liberă), nu doar dreptunghiular. Este perfect pentru logo-uri și forme personalizate." },
    { question: "Laminarea este necesară?", answer: "Laminarea adaugă un strat de protecție transparent. Recomandăm laminarea pentru autocolantele expuse la soare, frecare sau umezeală intensă, pentru a prelungi durata de viață." },
    { question: "Pe ce suprafețe pot aplica autocolantele?", answer: "Autocolantele noastre aderă excelent pe sticlă, metal, plastic, lemn vopsit, pereți netezi. Pentru suprafețe cu texturi rugose sau poroase (cărămidă, beton nefinisit), recomandăm testare prealabilă." },
    { question: "Cât timp rezistă autocolantele în exterior?", answer: "Cu material vinyl și laminare, autocolantele rezistă 5-7 ani în exterior, păstrându-și culorile vibrante datorită cernelurilor UV-rezistente." },
];

import { AccordionStep } from "./ui/AccordionStep";
import { TabButtonSEO } from "./ui/TabButtonSEO";
import { NumberInput } from "./ui/NumberInput";
import { OptionButton } from "./ui/OptionButton";
import { TabButton } from "./ui/TabButton";
import StickerModeSwitchInline from "./StickerModeSwitchInline";

type Props = { productSlug?: string; initialWidth?: number; initialHeight?: number; productImage?: string, intent?: string };

export default function AutocolanteConfigurator({ productSlug, initialWidth: initW, initialHeight: initH, productImage, intent }: Props) {
    const { addItem } = useCart();
    const GALLERY = useMemo(() => productImage ? [productImage, ...GALLERY_BASE] : GALLERY_BASE, [productImage]);

    const getMinQty = (widthCm: number, heightCm: number) => {
        if (widthCm > 0 && heightCm > 0 && widthCm <= 10 && heightCm <= 10) return 50;
        return 1;
    };

    const [input, setInput] = useState<PriceInputAutocolante>({
        width_cm: initW ?? 10,
        height_cm: initH ?? 10,
        quantity: 1,
        material: "oracal_3641",
        print_type: "print_cut",
        laminated: false,
        transfer_film: false,
        designOption: "upload",
    });

    const [lengthText, setLengthText] = useState(initW ? String(initW) : "10");
    const [heightText, setHeightText] = useState(initH ? String(initH) : "10");

    const [activeImage, setActiveImage] = useState<string>(GALLERY[0]);
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [textDesign, setTextDesign] = useState<string>("");

    const [detailsOpen, setDetailsOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(1);
    const [activeProductTab, setActiveProductTab] = useState("descriere");

    // EFFECT: Handle initial props and Intents
    useEffect(() => {
        if (productImage) {
            setArtworkUrl(productImage);
            setActiveImage(productImage);
            updateInput('designOption', 'upload');
        }
        
        // Handle dimensions from props
        if (initW || initH) {
            setInput(prev => ({ 
                ...prev, 
                width_cm: initW || prev.width_cm, 
                height_cm: initH || prev.height_cm 
            }));
            if (initW) setLengthText(String(initW));
            if (initH) setHeightText(String(initH));
        }

        // Handle Intense (Technicals & Professions)
        if (intent) {
            if (intent === 'transparent' || intent === 'lucios') {
                updateInput('material', intent === 'transparent' ? 'oracal_transparent' : 'oracal_3641'); // Default glossy / transparent
            } else if (intent === 'mat') {
                updateInput('material', 'oracal_621'); // Example mapping for mat
            } else if (intent === 'window-graphics') {
                updateInput('material', 'oracal_3641');
                updateInput('print_type', 'print_cut');
            } else if (intent === 'imobiliare') {
                updateInput('width_cm', 100);
                updateInput('height_cm', 50);
                setLengthText("100");
                setHeightText("50");
                setTextDesign("DE VÂNZARE");
                updateInput('designOption', 'text_only');
            }
        }
    }, [productImage, initW, initH, intent]);

    const [userEmail, setUserEmail] = useState<string>('');

    // Pricing
    const priceData = useMemo(() => calculateAutocolantePrice(input), [input]);
    const displayedTotal = priceData.finalPrice;

    // Upsell Logic
    const upsellOpportunity = useMemo(() => {
        return getAutocolanteUpsell(input);
    }, [input]);

    // Abandoned Cart Tracking
    const cartData = useMemo(() => ({
        configuratorId: 'autocolante',
        email: userEmail,
        configuration: { ...input, artworkUrl, textDesign },
        price: displayedTotal,
        quantity: input.quantity
    }), [userEmail, input, artworkUrl, textDesign, displayedTotal]);

    useUserActivityTracking(cartData);

    const updateInput = <K extends keyof PriceInputAutocolante>(k: K, v: PriceInputAutocolante[K]) => setInput((p) => ({ ...p, [k]: v }));
    const setQty = (v: number) => {
        const minQty = getMinQty(input.width_cm, input.height_cm);
        updateInput("quantity", Math.max(minQty, Math.floor(v)));
    };

    useEffect(() => {
        const minQty = getMinQty(input.width_cm, input.height_cm);
        if (input.quantity < minQty) {
            updateInput("quantity", minQty);
        }
    }, [input.width_cm, input.height_cm]);

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
            alert("Te rugăm să introduci dimensiunile.");
            return;
        }
        if (displayedTotal <= 0) {
            alert("Prețul trebuie calculat.");
            return;
        }

        const materialDef = AUTOCOLANTE_CONSTANTS.MATERIALS.find(m => m.key === input.material);
        const materialLabel = materialDef?.label || input.material;
        const unitPrice = Math.round((displayedTotal / input.quantity) * 100) / 100;
        const uniqueId = `autocolante-${Date.now()}`;
        const title = `Autocolant ${materialLabel} - ${input.width_cm}x${input.height_cm} cm`;

        addItem({
            id: uniqueId,
            productId: 'autocolante',
            title: title,
            price: unitPrice,
            quantity: input.quantity,
            metadata: {
                "Material": materialLabel,
                "Tip producție": input.print_type === "print_only" ? "Doar Print (-20%)" : "Print + Cut",
                "Laminare": input.laminated ? "Da (+40%)" : "Nu",
                "Folie de transfer": input.transfer_film ? "Da (+20%)" : "Nu",
                "Grafică": input.designOption === 'pro' ? 'Vreau grafică' : input.designOption === 'text_only' ? 'Doar text' : 'Grafică proprie',
                "artworkUrl": artworkUrl,
                "textDesign": textDesign,
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

    const minQty = getMinQty(input.width_cm, input.height_cm);
    const summaryStep1 = input.width_cm > 0 && input.height_cm > 0 ? `${input.width_cm}x${input.height_cm}cm, ${input.quantity} buc.` : "Alege";
    const materialDef = AUTOCOLANTE_CONSTANTS.MATERIALS.find(m => m.key === input.material);
    const printTypeLabel = input.print_type === "print_only" ? "Doar Print (-20%)" : "Print + Cut";
    const laminatedLabel = input.laminated ? ", Laminat (+40%)" : "";
    const transferLabel = input.transfer_film ? ", Folie transfer (+20%)" : "";
    const summaryStep2 = `${materialDef?.label.split(' — ')[0] || input.material}, ${printTypeLabel}${laminatedLabel}${transferLabel}`;
    const summaryStep3 = input.designOption === 'upload' ? 'Grafică proprie' : input.designOption === 'text_only' ? 'Doar text' : 'Design Pro';

    return (
        <main className="bg-slate-50 dark:bg-slate-800 min-h-screen">
            <ProductJsonLd
                name="Autocolante și Etichete Personalizate"
                description="Personalizează orice suprafață cu autocolantele noastre de înaltă calitate. Disponibile pe hârtie sau vinyl, cu opțiuni de laminare și tăiere pe contur."
                image={activeImage}
                price={displayedTotal}
                sku="autocolante-personalizate"
                url={typeof window !== 'undefined' ? window.location.href : "https://www.tablou.net/configurator/autocolante"}
            />
            <div className="container mx-auto px-4 py-8 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* STÂNGA - VIZUAL */}
                    <div className="lg:sticky top-24 h-max space-y-6">
                        <div className="bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-gray-200 dark:border-slate-800 overflow-hidden">
                            <div className="aspect-square relative flex items-center justify-center p-4">
                                <img src={activeImage} alt="Autocolante" className="max-h-full max-w-full object-contain" />
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
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
                                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">Configurator Autocolante</h2>
                                <StickerModeSwitchInline />
                            </div>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Personalizează opțiunile în 3 pași simpli.</p>
                                <button type="button" onClick={() => setDetailsOpen(true)} className="inline-flex items-center text-sm px-3 py-1.5 border border-gray-300 rounded hover:bg-slate-50 dark:bg-slate-800 transition-colors text-gray-700 dark:text-gray-300 font-medium">
                                    <Info size={16} /><span className="ml-2">Detalii</span>
                                </button>
                            </div>
                        </header>

                        <div className="bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-gray-200 dark:border-slate-800 px-4 mb-8">
                            <AccordionStep stepNumber={1} title="Dimensiuni & Cantitate" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Lungime (cm)</label>
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            value={lengthText}
                                            onFocus={(e) => e.target.select()}
                                            onChange={(e) => handleDimChange(e.target.value, setLengthText, "width_cm")}
                                            placeholder="10"
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
                                            placeholder="10"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <NumberInput label="Cantitate" value={input.quantity} onChange={setQty} min={minQty} />

                                        {upsellOpportunity && (
                                            <div
                                                className="mt-3 p-3 sm:p-4 bg-emerald-50 border border-emerald-200 rounded-lg cursor-pointer hover:bg-emerald-100 transition-colors flex gap-3 items-center group relative"
                                                onClick={() => updateInput("quantity", upsellOpportunity.requiredQty)}
                                            >
                                                <TrendingUp className="text-emerald-600 w-5 h-5 shrink-0" />
                                                <div className="flex-1">
                                                    <p className="text-sm text-emerald-900 font-bold">Reducere de Volum!</p>
                                                    <p className="text-xs text-emerald-800 mt-1">
                                                        Alege <strong>{upsellOpportunity.requiredQty} buc</strong> și prețul scade la <strong>{formatMoneyDisplay(upsellOpportunity.newUnitPrice)}/buc</strong>.
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
                                </div>
                            </AccordionStep>

                            <AccordionStep stepNumber={2} title="Material & Tip Print" summary={summaryStep2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)}>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tip folie Oracal</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                                    {AUTOCOLANTE_CONSTANTS.MATERIALS.map((mat) => {
                                        const [name, desc] = mat.label.split(' — ');
                                        return (
                                            <OptionButton
                                                key={mat.key}
                                                active={input.material === mat.key}
                                                onClick={() => updateInput("material", mat.key as AutocolantesMaterialKey)}
                                                title={name}
                                                subtitle={desc}
                                            />
                                        );
                                    })}
                                </div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tip producție</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                                    <OptionButton
                                        active={input.print_type === "print_cut"}
                                        onClick={() => updateInput("print_type", "print_cut")}
                                        title="Print + Cut"
                                        subtitle="Tăiere pe contur (standard)"
                                    />
                                    <OptionButton
                                        active={input.print_type === "print_only"}
                                        onClick={() => updateInput("print_type", "print_only")}
                                        title="Doar Print (-20%)"
                                        subtitle="Fără tăiere, reducere 20%"
                                    />
                                </div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Finisaj</label>
                                <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-slate-50 dark:bg-slate-800 transition-colors">
                                    <input type="checkbox" className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500" checked={input.laminated} onChange={(e) => updateInput("laminated", e.target.checked)} />
                                    <div>
                                        <span className="text-sm font-bold text-gray-800">Laminare (+40%)</span>
                                        <p className="text-xs text-gray-500">Protecție extra UV și zgârieturi</p>
                                    </div>
                                </label>
                                <label className="mt-2 flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-slate-50 dark:bg-slate-800 transition-colors">
                                    <input type="checkbox" className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500" checked={input.transfer_film} onChange={(e) => updateInput("transfer_film", e.target.checked)} />
                                    <div>
                                        <span className="text-sm font-bold text-gray-800">Folie de transfer (+20%)</span>
                                        <p className="text-xs text-gray-500">Aplicare ușoară (recomandat pentru texte/logo)</p>
                                    </div>
                                </label>
                            </AccordionStep>

                            <AccordionStep stepNumber={3} title="Grafică" summary={summaryStep3} isOpen={activeStep === 3} onClick={() => setActiveStep(3)} isLast={true}>
                                <div>
                                    {/* Editor Online button removed from here, moved to tabs below */}

                                        <div className="flex -mb-px overflow-x-auto no-scrollbar">
                                            <TabButton active={input.designOption === 'upload'} onClick={() => updateInput("designOption", 'upload')}>Am Grafică</TabButton>
                                            <TabButton active={input.designOption === 'text_only'} onClick={() => updateInput("designOption", 'text_only')}>Doar Text</TabButton>
                                            <TabButton active={input.designOption === 'pro'} onClick={() => updateInput("designOption", 'pro')}>Vreau Grafică</TabButton>
                                            <Link 
                                                href={`/editor?w=${input.width_cm}&h=${input.height_cm}&product=autocolante`}
                                                className="px-4 py-2 text-sm font-bold transition-all rounded-t-lg bg-orange-600 text-white hover:bg-orange-700 flex items-center gap-2 shrink-0 ml-auto"
                                            >
                                                <PencilRuler size={14} />
                                                Editor Online
                                            </Link>
                                        </div>

                                    {input.designOption === 'upload' && (
                                        <div className="space-y-3">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Încarcă fișierul tău (PDF, JPG, PNG, AI, CDR).</p>
                                            <label className="flex flex-col items-center justify-center w-full h-32 px-4 bg-white border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-emerald-400 transition-colors">
                                                <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                                                <span className="font-medium text-gray-600 dark:text-gray-400">Apasă pentru a încărca</span>
                                                <input type="file" className="hidden" onChange={e => handleArtworkFileInput(e.target.files?.[0] ?? null)} />
                                            </label>
                                            {uploading && <p className="text-sm text-emerald-600">Se încarcă...</p>}
                                            {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
                                            {artworkUrl && !uploadError && <p className="text-sm text-green-600 font-semibold">Grafică încărcată!</p>}
                                            
                                        </div>
                                    )}

                                    {input.designOption === 'text_only' && (
                                        <div className="space-y-3">
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Introdu textul dorit</label>
                                            <textarea className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm text-base min-h-24 text-gray-800 bg-white" rows={3} value={textDesign} onChange={e => setTextDesign(e.target.value)} placeholder="Ex: ETICHETA PRODUS, PROMOȚIE, etc."></textarea>
                                        </div>
                                    )}

                                    {input.designOption === 'pro' && (
                                        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">
                                            <p className="font-semibold">Serviciu de Grafică Profesională</p>
                                            <p>Cost: <strong>{formatMoneyDisplay(AUTOCOLANTE_CONSTANTS.PRO_DESIGN_FEE)}</strong>. Un designer te va contacta pentru detalii.</p>
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
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Autocolante și Etichete Personalizate</h2>
                                <p className="text-lg leading-relaxed mb-6">
                                    Personalizează orice suprafață cu autocolantele noastre de înaltă calitate. Disponibile pe hârtie sau vinyl, cu opțiuni de laminare și tăiere pe contur.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Materiale & Calitate</h3>
                                        <ul className="space-y-2 list-disc pl-5">
                                            <li><strong>Hârtie:</strong> Soluție economică pentru etichete de interior și ambalaje.</li>
                                            <li><strong>Vinyl PVC:</strong> Rezistent la apă, UV și rupere. Ideal pentru exterior (5-7 ani).</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Finisaje Premium</h3>
                                        <ul className="space-y-2 list-disc pl-5">
                                            <li><strong>Tăiere la Contur:</strong> Forme personalizate cu plotter digital de precizie.</li>
                                            <li><strong>Laminare:</strong> Strat de protecție extra împotriva soarelui și zgârieturilor.</li>
                                        </ul>
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
                        <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors" onClick={() => setDetailsOpen(false)}><X size={20} className="text-gray-600 dark:text-gray-400" /></button>
                        <div className="p-8">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Informații Tehnice Autocolante</h3>
                            <div className="space-y-6 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">Tipuri de Materiale</h4>
                                    <p>Folosim exclusiv materiale din gama ORACAL pentru o aderență superioară și durabilitate în timp. Vinyl-ul este recomandat pentru exterior, în timp ce hârtia este ideală pentru etichete promoționale.</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">Laminare</h4>
                                    <p>Laminarea crește durata de viață a culorilor cu până la 50% și oferă o protecție mecanică excelentă împotriva zgârieturilor ușoare.</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">Grafică & Pregătire</h4>
                                    <p>Pentru tăiere pe contur (Print+Cut), vă recomandăm să furnizați fișiere vectoriale (PDF, AI) cu trasa de tăiere definită clar.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}


