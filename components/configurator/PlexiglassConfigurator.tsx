"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { Plus, Minus, ShoppingCart, Info, ChevronDown, X, UploadCloud, MessageCircle, TrendingUp, Percent } from "lucide-react";
import DeliveryEstimation from "./DeliveryEstimation";
import FaqAccordion from "./FaqAccordion";
import { QA } from "@/types";
import {
    calculatePlexiglassPrice,
    getPlexiglassUpsell,
    PLEXIGLASS_CONSTANTS,
    formatMoneyDisplay,
    type PriceInputPlexiglass
} from "@/lib/pricing";

const GALLERY_BASE = [
    "/products/materiale/plexiglass/plexiglass-1.webp",
    "/products/materiale/plexiglass/plexiglass-2.webp",
    "/products/materiale/plexiglass/plexiglass-3.webp",
    "/products/materiale/plexiglass/plexiglass-4.webp"
] as const;

const productFaqs: QA[] = [
    { question: "Ce este plexiglasul?", answer: "Plexiglasul (PMMA) este un material plastic transparent sau opac, foarte rigid, cunoscut și sub numele de sticlă acrilică. Este mult mai ușor și mai rezistent la impact decât sticla clasică." },
    { question: "Ce înseamnă print cu alb selectiv?", answer: "Pentru plexiglasul transparent, printăm un strat de cerneală albă sub grafică pentru a conferi opacitate culorilor. Fără acest strat, culorile ar fi translucide." },
    { question: "Se poate debita pe contur?", answer: "Da, putem tăia placa pe orice formă dorită (CNC sau Laser), însă pentru comenzi standard prin site livrăm forme rectangulare." },
];

import { AccordionStep } from "./ui/AccordionStep";
import { TabButtonSEO } from "./ui/TabButtonSEO";
import { NumberInput } from "./ui/NumberInput";
import { OptionButton } from "./ui/OptionButton";
import { TabButton } from "./ui/TabButton";

export default function PlexiglassConfigurator({ initialWidth: initW, initialHeight: initH, productImage, productSlug }: { initialWidth?: number; initialHeight?: number; productImage?: string; productSlug?: string }) {
    const { addItem } = useCart();
    const GALLERY = useMemo(() => {
        if (!productImage) return GALLERY_BASE;
        if ((GALLERY_BASE as unknown as string[]).includes(productImage)) return GALLERY_BASE;
        return [productImage, ...GALLERY_BASE];
    }, [productImage]);

    const isFromShop = !!(productImage && productSlug && productSlug !== "plexiglass");

    const [input, setInput] = useState<PriceInputPlexiglass>({
        width_cm: initW ?? 50,
        height_cm: initH ?? 50,
        quantity: 1,
        material: "alb",
        thickness_mm: 3,
        print_double: false,
        designOption: "upload",
    });

    const [lengthText, setLengthText] = useState(initW ? String(initW) : "50");
    const [heightText, setHeightText] = useState(initH ? String(initH) : "50");

    const [activeImage, setActiveImage] = useState<string>(GALLERY[0]);
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const [detailsOpen, setDetailsOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(1);
    const [activeProductTab, setActiveProductTab] = useState<'descriere' | 'faq'>('descriere');

    const availableThickness = useMemo(() =>
        input.material === "alb" ? PLEXIGLASS_CONSTANTS.THICKNESS.ALB : PLEXIGLASS_CONSTANTS.THICKNESS.TRANSPARENT,
        [input.material]);

    const updateInput = <K extends keyof PriceInputPlexiglass>(k: K, v: PriceInputPlexiglass[K]) => setInput((p) => ({ ...p, [k]: v }));

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

    const priceData = useMemo(() => calculatePlexiglassPrice(input), [input]);
    const displayedTotal = priceData.finalPrice;

    const upsellOpportunity = useMemo(() => {
        return getPlexiglassUpsell(input);
    }, [input]);

    function handleAddToCart() {
        if (!input.width_cm || !input.height_cm) {
            alert("Introduceți dimensiunile plăcii."); return;
        }
        if (displayedTotal <= 0) {
            alert("Prețul trebuie calculat."); return;
        }

        const unitPrice = Math.round((displayedTotal / input.quantity) * 100) / 100;
        const uniqueId = `plexiglass-${Date.now()}`;
        const matLabel = input.material === "alb" ? "Plexiglas Alb" : "Plexiglas Transparent";
        const title = `${matLabel} ${input.thickness_mm}mm - ${input.width_cm}x${input.height_cm} cm`;

        addItem({
            id: uniqueId,
            productId: 'plexiglass',
            title: title,
            price: unitPrice,
            quantity: input.quantity,
            metadata: {
                "Dimensiune": `${input.width_cm}x${input.height_cm} cm`,
                "Grosime": `${input.thickness_mm} mm`,
                "Print": input.print_double ? "Față-Verso (+Alb Selectiv)" : "O singură față",
                "Grafică": input.designOption === 'pro' ? 'Design Pro' : 'Grafică proprie',
                "artworkUrl": artworkUrl,
                "width": input.width_cm,
                "height": input.height_cm,
            },
        });
        alert("Adăugat în coș!");
    }

    useEffect(() => {
        const id = setInterval(() => setActiveIndex((i) => (i + 1) % GALLERY.length), 5000);
        return () => clearInterval(id);
    }, [GALLERY.length]);

    useEffect(() => setActiveImage(GALLERY[activeIndex]), [activeIndex, GALLERY]);

    const summaryStep1 = input.width_cm > 0 && input.height_cm > 0 ? `${input.width_cm}x${input.height_cm} cm` : "Alege";
    const summaryStep2 = `${input.material === "alb" ? "Alb" : "Transparent"}, ${input.thickness_mm}mm`;
    const summaryStep3 = input.designOption === 'pro' ? 'Design Pro' : 'Grafică proprie';

    return (
        <main className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-8 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* STÂNGA - VIZUAL */}
                    <div className="lg:sticky top-24 h-max space-y-6">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                            <div className="aspect-square relative flex items-center justify-center p-4">
                                <img src={activeImage} alt="Plexiglas" className="max-h-full max-w-full object-contain" />
                            </div>
                            <div className="p-2 grid grid-cols-4 gap-2 border-t border-gray-100">
                                {GALLERY.map((src, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveIndex(i)}
                                        className={`relative rounded-lg aspect-square overflow-hidden border-2 transition-all ${activeIndex === i ? "border-blue-600 shadow-md" : "border-transparent opacity-70 hover:opacity-100"}`}
                                    >
                                        <img src={src} alt="Thumb" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* DREAPTA - CONFIGURATOR */}
                    <div>
                        <header className="mb-6">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">Configurator Plexiglas</h1>
                            <p className="text-gray-600 text-sm sm:text-base">Sticlă acrilică premium, transparentă sau albă, debitată la dimensiune.</p>
                        </header>

                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-4 mb-8">
                            <AccordionStep stepNumber={1} title="Dimensiuni & Cantitate" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Lungime (cm)</label>
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            value={lengthText}
                                            onChange={(e) => handleDimChange(e.target.value, setLengthText, "width_cm")}
                                            placeholder="50"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Înălțime (cm)</label>
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            value={heightText}
                                            onChange={(e) => handleDimChange(e.target.value, setHeightText, "height_cm")}
                                            placeholder="50"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <NumberInput label="Cantitate" value={input.quantity} onChange={(v) => updateInput("quantity", v)} step={1} />
                                {upsellOpportunity && (
                                    <div
                                        className="mt-3 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors flex gap-3 items-center group relative"
                                        onClick={() => updateInput("quantity", upsellOpportunity.requiredQty)}
                                    >
                                        <TrendingUp className="text-blue-600 w-5 h-5 shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-sm text-blue-900 font-bold">
                                                Reducere de Volum Disponibilă!
                                            </p>
                                            <p className="text-xs text-blue-800 mt-1">
                                                Dacă alegi <strong>{upsellOpportunity.requiredQty} buc</strong>, prețul scade la <strong>{formatMoneyDisplay(upsellOpportunity.newUnitPrice)}/buc</strong>.
                                            </p>
                                        </div>
                                        <div className="ml-auto flex flex-col items-end gap-2 shrink-0">
                                            <div className="flex items-center justify-center bg-white rounded-md px-2 py-0.5 shadow-sm border border-blue-100">
                                                <span className="text-xs font-bold text-blue-600">-{upsellOpportunity.discountPercent}%</span>
                                            </div>
                                            <button type="button" className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-md font-bold shadow-sm group-hover:bg-blue-700 transition-colors">
                                                Aplică
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </AccordionStep>

                            <AccordionStep stepNumber={2} title="Material & Grosime" summary={summaryStep2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Tip Material</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <OptionButton active={input.material === "alb"} onClick={() => updateInput("material", "alb")} title="Alb" subtitle="Opac" />
                                            <OptionButton active={input.material === "transparent"} onClick={() => updateInput("material", "transparent")} title="Transparent" subtitle="Clar" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Grosime (mm)</label>
                                        <select className="w-full p-3 border border-gray-300 rounded-lg bg-white" value={input.thickness_mm} onChange={(e) => updateInput("thickness_mm", parseFloat(e.target.value))}>
                                            {availableThickness.map(t => <option key={t} value={t}>{t} mm</option>)}
                                        </select>
                                    </div>
                                </div>
                                {input.material === "transparent" && (
                                    <label className="flex items-center gap-3 py-2 cursor-pointer">
                                        <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={input.print_double} onChange={(e) => updateInput("print_double", e.target.checked)} />
                                        <span className="text-sm font-bold text-gray-700">Imprimare Față-Verso (cu Alb Selectiv)</span>
                                    </label>
                                )}
                            </AccordionStep>

                            <AccordionStep stepNumber={3} title="Grafică" summary={summaryStep3} isOpen={activeStep === 3} onClick={() => setActiveStep(3)} isLast={true}>
                                <div>
                                    {isFromShop ? (
                                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl mb-4">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-20 h-20 rounded-lg bg-white p-1 border border-slate-200 shadow-sm shrink-0">
                                                    <img src={productImage} alt="Model" className="w-full h-full object-cover rounded" />
                                                </div>
                                                <div>
                                                    <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-bold mb-1">MODEL SELECTAT</span>
                                                    <p className="font-bold text-slate-800 text-sm leading-tight mb-1">Imagine selectată din shop</p>
                                                    <p className="text-xs text-slate-500">Vom imprima acest model.</p>
                                                </div>
                                            </div>
                                            <div className="border-t border-slate-200 pt-3">
                                                <p className="text-sm font-bold text-gray-700 mb-2">Vrei să schimbi grafica?</p>
                                                <div className="flex gap-2">
                                                    <button onClick={() => updateInput("designOption", "upload")} className={`flex-1 py-2 px-3 rounded-lg border text-sm font-semibold transition-colors ${input.designOption === 'upload' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}>Încărcare Machetă</button>
                                                    <button onClick={() => updateInput("designOption", "text_only")} className={`flex-1 py-2 px-3 rounded-lg border text-sm font-semibold transition-colors ${input.designOption === 'text_only' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}>Doar Text</button>
                                                </div>
                                            </div>
                                            {(input.designOption === 'upload' || input.designOption === 'text_only') && (
                                                <div className="mt-4 pt-4 border-t border-slate-200">
                                                    {input.designOption === 'upload' && (
                                                        <div className="space-y-3">
                                                            <label className="flex flex-col items-center justify-center w-full h-32 px-4 bg-white border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-400 transition-colors">
                                                                <UploadCloud className="w-8 h-8 text-gray-400 mb-1" />
                                                                <span className="font-medium text-gray-600">Încarcă Machetă Nouă</span>
                                                                <input type="file" className="hidden" onChange={e => handleArtworkFileInput(e.target.files?.[0] ?? null)} />
                                                            </label>
                                                        </div>
                                                    )}
                                                    {input.designOption === 'text_only' && (
                                                        <div className="space-y-3">
                                                            <textarea className="w-full p-3 border border-gray-300 rounded-lg" rows={3} onChange={() => { }} placeholder="Introdu textul dorit..."></textarea>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            <div className="mb-4 border-b border-gray-200">
                                                <div className="flex -mb-px">
                                                    <TabButton active={input.designOption === 'upload'} onClick={() => updateInput("designOption", 'upload')}>Am Grafică</TabButton>
                                                    <TabButton active={input.designOption === 'text_only'} onClick={() => updateInput("designOption", 'text_only')}>Doar Text</TabButton>
                                                    <TabButton active={input.designOption === 'pro'} onClick={() => updateInput("designOption", 'pro')}>Vreau Grafică</TabButton>
                                                </div>
                                            </div>

                                            {input.designOption === 'upload' && (
                                                <div className="space-y-3">
                                                    <label className="flex flex-col items-center justify-center w-full h-32 px-4 bg-white border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-400 transition-colors">
                                                        <UploadCloud className="w-8 h-8 text-gray-400 mb-1" />
                                                        <span className="font-medium text-gray-600">Încarcă Machetă (PDF/AI)</span>
                                                        <input type="file" className="hidden" onChange={e => handleArtworkFileInput(e.target.files?.[0] ?? null)} />
                                                    </label>
                                                    {uploading && <p className="text-sm text-blue-600 mt-2">Se încarcă...</p>}
                                                    {artworkUrl && <p className="text-sm text-blue-600 font-semibold mt-2">Fișier pregătit!</p>}
                                                </div>
                                            )}

                                            {input.designOption === 'pro' && (
                                                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 text-sm text-blue-800">
                                                    <p className="font-semibold">Serviciu Design Profesional</p>
                                                    <p>Cost: <strong>{formatMoneyDisplay(PLEXIGLASS_CONSTANTS.PRO_DESIGN_FEE)}</strong>. Creăm grafica perfectă pentru placa ta.</p>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </AccordionStep>
                        </div>

                        {/* TOTAL & ADD TO CART */}
                        <div className="sticky bottom-0 z-40 lg:static bg-white/95 backdrop-blur-md lg:bg-white lg:backdrop-blur-none border-t lg:border border-gray-200 lg:rounded-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] lg:shadow-lg p-4 lg:p-6 transition-all mt-8">
                            <div className="flex flex-col gap-4">
                                <button onClick={handleAddToCart} className="w-full py-4 text-lg font-bold bg-blue-600 text-white rounded-xl shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-95 animate-pulse-slow">
                                    <ShoppingCart size={24} />
                                    Adaugă în Coș
                                </button>

                                <div className="flex flex-row justify-between items-center w-full gap-2 pt-1 mt-1 border-t border-gray-100">
                                    <div className="flex flex-col items-start leading-none">
                                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Preț Total</span>
                                        <span className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tighter">{formatMoneyDisplay(displayedTotal)}</span>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <DeliveryEstimation />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* BUTOANE SECUNDARE - WHATSAPP ȘI CERERE OFERTĂ */}
                        <div className="mt-4 lg:mt-6 bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl border border-slate-200 p-4">
                            <p className="text-xs text-gray-600 mb-3 text-center font-medium">Ai nevoie de ajutor sau o ofertă personalizată?</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <a
                                    href="https://wa.me/40750473111?text=Buna%20ziua,%20ma%20intereseaza%20o%20oferta."
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

                {/* INFO SECTION */}
                <div className="mt-8 lg:mt-12 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <nav className="border-b border-gray-200 flex overflow-x-auto">
                        <TabButtonSEO active={activeProductTab === "descriere"} onClick={() => setActiveProductTab("descriere")}>Descriere</TabButtonSEO>
                        <TabButtonSEO active={activeProductTab === "faq"} onClick={() => setActiveProductTab("faq")}>FAQ</TabButtonSEO>
                    </nav>

                    <div className="p-6 lg:p-8">
                        {activeProductTab === 'descriere' && (
                            <div className="prose max-w-none text-gray-700 text-sm sm:text-base">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Plexiglas (Sticlă Acrilică) - Eleganță și Durabilitate</h2>
                                <p className="leading-relaxed mb-6">
                                    Plexiglasul este materialul ideal pentru aplicații care necesită aspectul sticlei, dar cu o rezistență mult mai mare la spargere. Este utilizat la scară largă în signalistică office, panouri decorative și elemente de display pentru magazine.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">Materiale & Finisaj</h3>
                                        <ul className="space-y-2 list-disc pl-5">
                                            <li><strong>Plexiglas Transparent:</strong> Aspect cristalin, perfect pentru plăcuțe de firmă montate pe distanțieri.</li>
                                            <li><strong>Plexiglas Alb:</strong> Opac, ideal pentru panouri luminoase sau fundaluri contrastante.</li>
                                            <li><strong>Print UV Direct:</strong> Tehnologie de imprimare cu cerneluri care se usucă instant sub lumina UV, oferind o aderență excelentă.</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">Recomandări Montaj</h3>
                                        <p>Plăcile de plexiglas pot fi găurite pentru a fi prinse în distanțieri metalici sau pot fi lipite cu bandă dublu adezivă transparentă pe suprafețe netede.</p>
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
                        <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors" onClick={() => setDetailsOpen(false)} aria-label="Închide"><X size={20} className="text-gray-600" /></button>
                        <div className="p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Specificații Tehnice Plexiglas</h3>
                            <div className="space-y-6 text-gray-700 text-sm sm:text-base">
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-2">Transparență vs Opacitate</h4>
                                    <p>Plexiglasul transparent are o transmisie a luminii de aprox. 92%, fiind identic vizual cu sticla. Cel alb este complet opac.</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-2">Întreținere</h4>
                                    <p>Curățarea se face doar cu cârpă moale din microfibră și apă cu săpun sau soluții dedicate plasticului. EVITAȚI alcoolul, deoarece poate produce micro-fisuri (crazing) pe suprafață.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
