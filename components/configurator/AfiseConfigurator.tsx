"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { Plus, Minus, ShoppingCart, Info, ChevronDown, X, UploadCloud, MessageCircle, Box, Image as ImageIcon } from "lucide-react";
import Script from "next/script";
import DeliveryEstimation from "./DeliveryEstimation";
import FaqAccordion from "./FaqAccordion";
import { QA } from "@/types/configurator";
import {
    calculatePosterPrice,
    AFISE_CONSTANTS,
    formatMoneyDisplay,
    type PriceInputAfise
} from "@/lib/pricing";

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



export default function AfiseConfigurator({ productSlug, initialWidth, initialHeight, productImage, initialArtworkUrl }: { productSlug?: string; initialWidth?: number; initialHeight?: number; productImage?: string; initialArtworkUrl?: string }) {
    const { addItem } = useCart();
    const GALLERY = useMemo(() => productImage ? [productImage, ...GALLERY_BASE] : GALLERY_BASE, [productImage]);
    const [size, setSize] = useState<string>("A2");
    const [material, setMaterial] = useState<string>("whiteback_150_material");
    const [quantity, setQuantity] = useState<number>(50);
    const [activeProductTab, setActiveProductTab] = useState("descriere");
    const [designOption, setDesignOption] = useState<"upload" | "pro">("upload");

    const [artworkUrl, setArtworkUrl] = useState<string | null>(initialArtworkUrl || null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [activeImage, setActiveImage] = useState<string>(GALLERY[0]);

    // 3D View State
    const [viewMode, setViewMode] = useState<'gallery' | '3d'>(initialArtworkUrl ? '3d' : 'gallery');
    const modelViewerRef = React.useRef<any>(null);

    // Update active image if initial artwork is provided
    useEffect(() => {
        if (initialArtworkUrl) {
            setActiveImage(initialArtworkUrl);
        }
    }, [initialArtworkUrl]);

    // 3D Scaling Logic
    // Base model is assumed to be A2 (approx 42x59.4cm) or similar.
    // We'll normalize scale based on 1 unit = 1 meter or relative to a base size.
    // Let's assume the GLB is roughly sized ~0.42m x 0.59m.
    // If not, we can adjust. For now, we scale based on ratio relative to A2.
    const getScale = (s: string) => {
        // Dimension Map in cm
        const dims: Record<string, [number, number]> = {
            "A0": [84.1, 118.9],
            "A1": [59.4, 84.1],
            "A2": [42.0, 59.4],
            "A3": [29.7, 42.0],
            "A4": [21.0, 29.7],
            "50x70": [50, 70],
            "70x100": [70, 100],
        };
        const [w, h] = dims[s] || [42.0, 59.4];
        // Base is A2 (42 x 59.4)
        // If the model is 1:1 scale in meters, 0.42 x 0.594
        // We just scale relative to A2
        const baseW = 42.0;
        const baseH = 59.4;
        return `${w / baseW} ${h / baseH} 1`;
    };
    const currentScale = getScale(size);

    // Apply Texture Logic
    useEffect(() => {
        const viewer = modelViewerRef.current;
        if (!viewer || viewMode !== '3d') return;

        const img = artworkUrl || activeImage;
        if (!img) return;

        const updateTexture = async () => {
            try {
                if (!viewer.model) {
                    await new Promise(resolve => viewer.addEventListener('load', resolve, { once: true }));
                }
                if (viewer.model) {
                    const texture = await viewer.createTexture(img);
                    const material = viewer.model.materials[0];
                    if (material && material.pbrMetallicRoughness) {
                        material.pbrMetallicRoughness.baseColorTexture.setTexture(texture);
                        // Try clamp to edge if needed
                        if (texture.sampler) {
                            try {
                                texture.sampler.setWrapS(33071);
                                texture.sampler.setWrapT(33071);
                            } catch (e) { }
                        }
                    }
                }
            } catch (e) {
                console.error("Texture swap error", e);
            }
        };
        updateTexture();
    }, [viewMode, activeImage, artworkUrl]);

    useEffect(() => {
        if (artworkUrl || viewMode === '3d') return;
        setActiveImage(GALLERY[activeIndex]);
    }, [activeIndex, GALLERY, artworkUrl, viewMode]);

    const [detailsOpen, setDetailsOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(1);

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
            setActiveImage(data.url);
            setViewMode('3d');
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
        if (viewMode === '3d' || artworkUrl) return;
        const id = setInterval(() => {
            setActiveIndex((i) => (i + 1) % GALLERY.length);
        }, 5000);
        return () => clearInterval(id);
    }, [GALLERY.length, viewMode, artworkUrl]);

    return (
        <main className="bg-gray-50 min-h-screen">
            <Script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js" />
            <div className="container mx-auto px-4 py-8 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* STÂNGA - VIZUAL */}
                    <div className="lg:sticky top-24 h-max space-y-6">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">

                            {/* Tabs Switcher for Gallery/3D */}
                            <div className="flex border-b border-gray-100 overflow-x-auto">
                                <button
                                    onClick={() => setViewMode('gallery')}
                                    className={`flex-1 py-3 min-w-20 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${viewMode === 'gallery' ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    <ImageIcon size={16} /> Galerie
                                </button>
                                <button
                                    onClick={() => setViewMode('3d')}
                                    className={`flex-1 py-3 min-w-20 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${viewMode === '3d' ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    <Box size={16} /> Vedere 3D
                                </button>
                            </div>

                            <div className="aspect-square relative flex items-center justify-center bg-white">
                                {viewMode === 'gallery' ? (
                                    <div className="w-full h-full p-4 flex items-center justify-center">
                                        <img src={activeImage} alt="Afiș" className="max-h-full max-w-full object-contain" />
                                    </div>
                                ) : (
                                    <div className="w-full h-full bg-slate-50 relative">
                                        <model-viewer
                                            ref={modelViewerRef}
                                            src="/products/afise/afise.glb"
                                            alt="Model 3D Afiș"
                                            shadow-intensity="1"
                                            camera-controls
                                            auto-rotate
                                            ar
                                            scale={currentScale}
                                            style={{ width: '100%', height: '100%' }}
                                        >
                                            <button slot="ar-button" className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-lg flex items-center gap-2 transition-transform active:scale-95">
                                                <Box size={18} />
                                                AR
                                            </button>
                                        </model-viewer>
                                    </div>
                                )}
                            </div>

                            {viewMode === 'gallery' && (
                                <div className="p-2 grid grid-cols-4 gap-2 border-t border-gray-100 bg-white">
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
                            )}
                        </div>
                    </div>

                    {/* DREAPTA - CONFIGURATOR */}
                    <div>
                        <header className="mb-6">
                            <div className="flex justify-between items-center gap-4 mb-3">
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Configurator Afișe</h1>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-gray-600 text-sm sm:text-base">Personalizează opțiunile în 3 pași simpli.</p>
                                <button type="button" onClick={() => setDetailsOpen(true)} className="inline-flex items-center text-sm px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-gray-700 font-medium">
                                    <Info size={16} /><span className="ml-2">Detalii</span>
                                </button>
                            </div>
                        </header>

                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-4 mb-8">
                            <AccordionStep stepNumber={1} title="Dimensiune & Tiraj" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Dimensiune</label>
                                        <select value={size} onChange={(e) => setSize(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                            {AFISE_CONSTANTS.SIZES.map(s => <option key={s.key} value={s.key}>{s.label} — {s.dims}</option>)}
                                        </select>
                                    </div>
                                    <NumberInput label="Tiraj (buc)" value={quantity} onChange={setQuantity} step={1} />
                                </div>
                            </AccordionStep>

                            <AccordionStep stepNumber={2} title="Material" summary={summaryStep2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)}>
                                <div className="grid grid-cols-2 gap-2">
                                    {AFISE_CONSTANTS.MATERIALS.filter(m => isMaterialVisibleForSize(m.key, size)).map(m => (
                                        <OptionButton key={m.key} active={material === m.key} onClick={() => setMaterial(m.key)} title={m.label} subtitle={m.description} />
                                    ))}
                                </div>
                            </AccordionStep>

                            <AccordionStep stepNumber={3} title="Grafică" summary={summaryStep3} isOpen={activeStep === 3} onClick={() => setActiveStep(3)} isLast={true}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                                    <OptionButton active={designOption === "upload"} onClick={() => setDesignOption("upload")} title="Am Grafică" subtitle="Încarc fișierul" />
                                    <OptionButton active={designOption === "pro"} onClick={() => setDesignOption("pro")} title="Vreau Grafică" subtitle={`Cost: ${formatMoneyDisplay(priceData.proFee)}`} />
                                </div>
                                {designOption === 'upload' && (
                                    <div>
                                        <label className="flex flex-col items-center justify-center w-full h-32 px-4 bg-white border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-400 transition-colors">
                                            <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                                            <span className="font-medium text-gray-600">Apasă pentru a încărca</span>
                                            <input type="file" className="hidden" onChange={e => handleArtworkFileInput(e.target.files?.[0] ?? null)} />
                                        </label>
                                        {uploading && <p className="text-sm text-blue-600 mt-2">Se încarcă...</p>}
                                        {uploadError && <p className="text-sm text-red-600 mt-2">{uploadError}</p>}
                                        {artworkUrl && !uploadError && <p className="text-sm text-green-600 font-semibold mt-2">Grafică încărcată!</p>}
                                    </div>
                                )}
                                {designOption === 'pro' && (
                                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 text-sm text-blue-800">
                                        <p className="font-semibold">Serviciu de Grafică Profesională</p>
                                        <p>Cost: <strong>{formatMoneyDisplay(priceData.proFee)}</strong>. Veți fi contactat pentru detalii.</p>
                                    </div>
                                )}
                            </AccordionStep>
                        </div>

                        {/* TOTAL & ADD TO CART */}
                        <div className="sticky bottom-0 z-40 lg:static bg-white/95 backdrop-blur-md lg:bg-white lg:backdrop-blur-none border-t lg:border border-gray-200 lg:rounded-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] lg:shadow-lg p-4 lg:p-6 transition-all">
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
                            <div className="prose max-w-none text-gray-700">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Afișe și Postere Personalizate</h2>
                                <p className="text-lg leading-relaxed mb-6">
                                    Promovează-ți evenimentele sau ofertele cu afișe de înaltă calitate, imprimate pe o gamă variată de materiale. Alege dimensiunea și hârtia potrivită pentru mesajul tău.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">Materiale & Calitate</h3>
                                        <ul className="space-y-2 list-disc pl-5">
                                            <li><strong>Whiteback:</strong> Hârtie standard pentru interior, excelentă pentru postere.</li>
                                            <li><strong>Blueback:</strong> Hârtie opacă pentru exterior, ideală pentru panotaj.</li>
                                            <li><strong>Hârtie Foto:</strong> Culori vibrante și finisaj lucios pentru proiecte premium.</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">Tiraje & Tiraje</h3>
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
                        <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors" onClick={() => setDetailsOpen(false)} aria-label="Închide"><X size={20} className="text-gray-600" /></button>
                        <div className="p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Detalii Afișe</h3>
                            <div className="space-y-6 text-gray-700 text-sm sm:text-base">
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-2">Materiale Disponibile</h4>
                                    <p>Alegeți dintr-o gamă variată de hârtii și cartoane, de la cele standard de 150g, la materiale premium precum hârtia foto de 220g sau cartonul de 300g.</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-2">Specificații Tehnice</h4>
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
