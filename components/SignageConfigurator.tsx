"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/ToastProvider";
import { ShoppingCart, Check, ChevronDown, Package, Ruler, ShieldCheck, MessageCircle, Info, Sparkles, Plus, Minus, X, Layers, UploadCloud } from "lucide-react";
import DeliveryEstimation from "./DeliveryEstimation";
import RelatedProducts from "./RelatedProducts";
import Reviews from "./Reviews";
import FaqAccordion from "./FaqAccordion";
import { QA } from "@/types";
import QuickNav from "@/components/QuickNav";

/* --- UI COMPONENTS (MATCHING CONFIGURATORS) --- */
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

const OptionButton = ({ active, onClick, title, subtitle, icon: Icon }: { active: boolean; onClick: () => void; title: string; subtitle?: string; icon?: any }) => (
    <button
        type="button"
        onClick={onClick}
        className={`w-full text-left p-3 rounded-lg border-2 transition-all text-sm flex items-center justify-between ${active
            ? "border-indigo-600 bg-indigo-50 shadow-sm"
            : "border-gray-300 bg-white hover:border-gray-400"
            }`}
    >
        <div className="flex items-center gap-3">
            {Icon && <Icon className={`w-5 h-5 ${active ? 'text-indigo-600' : 'text-gray-500'}`} />}
            <div>
                <div className={`font-bold ${active ? 'text-indigo-900' : 'text-gray-800'}`}>{title}</div>
                {subtitle && <div className="text-xs text-gray-600 mt-0.5">{subtitle}</div>}
            </div>
        </div>
        {active && <Check className="w-5 h-5 text-indigo-600" />}
    </button>
);

const signageFaqs: QA[] = [
    { question: "Care este diferența dintre Autocolant și Panou PVC?", answer: "Autocolantul este o folie adezivă flexibilă care se aplică pe suprafețe netede. Panoul PVC este un material rigid (placă) de diverse grosimi, care poate fi montat mecanic sau cu bandă dublu-adezivă pe orice suprafață." },
    { question: "Pot folosi aceste indicatoare la exterior?", answer: "Da, toate materialele noastre (PVC, Autocolant, Plexiglas) sunt rezistente la intemperii și UV. Pentru durabilitate maximă folosim print UV direct sau laminare protectoare." },
    { question: "Cum se montează panourile rigide?", answer: "Panourile pot fi găurite ușor pentru montaj cu holsuruburi, pot fi prinse cu coliere de plastic pe garduri sau lipite cu silicon/bandă dublu-adezivă pe suprafețe plane." },
    { question: "Sunt incluse sistemele de prindere?", answer: "Produsele se livrează ca atare, gata de montaj. Opțiunile de găurire sau accesorii de prindere pot fi solicitate la cererea de ofertă personalizată." }
];

interface Variant {
    id: string;
    size: string;
    material: string;
    price: number;
    sku?: string;
}

interface Props {
    product: {
        id: string;
        title: string;
        images: string[];
        description: string;
        metadata: {
            signageVariants: Variant[];
            category: string;
            subcategory: string;
        };
    };
}

const PRO_DESIGN_FEE = 49;

const formatMoneyDisplay = (amount: number) => new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON" }).format(amount);

export default function SignageConfigurator({ product }: Props) {
    const { addItem } = useCart();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<"descriere" | "recenzii" | "faq">("descriere");
    const [quantity, setQuantity] = useState(1);
    const [customSizeModal, setCustomSizeModal] = useState(false);
    const [activeStep, setActiveStep] = useState(1);
    const [detailsOpen, setDetailsOpen] = useState(false);

    // Custom Graphics State
    const [designOption, setDesignOption] = useState<'standard' | 'upload' | 'pro' | 'text_only'>('standard');
    const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [textDesign, setTextDesign] = useState<string>("");

    const variants = product.metadata.signageVariants || [];
    const GALLERY = product.images.length > 0 ? product.images : ["/placeholder.png"];
    const [activeImage, setActiveImage] = useState<string>(GALLERY[0]);
    const [activeIndex, setActiveIndex] = useState<number>(0);

    /* --- VARIANT LOGIC --- */
    const materials = useMemo(() => {
        const set = new Set(variants.map(v => v.material));
        return Array.from(set);
    }, [variants]);

    const [selectedMaterial, setSelectedMaterial] = useState(materials[0] || "");

    const sizes = useMemo(() => {
        return variants.filter(v => v.material === selectedMaterial);
    }, [variants, selectedMaterial]);

    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(sizes[0] || null);

    // Sync variant
    useEffect(() => {
        const newSizes = variants.filter(v => v.material === selectedMaterial);
        if (newSizes.length > 0) {
            // Try to keep same size selection if possible
            const sameSize = newSizes.find(v => v.size === selectedVariant?.size);
            setSelectedVariant(sameSize || newSizes[0]);
        }
    }, [selectedMaterial, variants]);

    // Gallery rotation

    // Gallery rotation
    useEffect(() => {
        if (designOption === 'standard') {
            setActiveImage(GALLERY[activeIndex]);
        }
    }, [activeIndex, GALLERY, designOption]);

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


    const handleAddToCart = () => {
        if (!selectedVariant) return;

        let finalPrice = selectedVariant.price * quantity;
        if (designOption === 'pro') finalPrice += PRO_DESIGN_FEE;

        addItem({
            id: selectedVariant.id,
            title: product.title,
            price: finalPrice / quantity, // UNIT PRICE
            quantity: quantity,
            metadata: {
                productImage: product.images[0],
                dimensiune: selectedVariant.size,
                material: selectedVariant.material,
                sku: selectedVariant.sku,
                category: product.metadata.category,
                subcategory: product.metadata.subcategory,
                "Opțiune Grafică": designOption === 'standard' ? 'Model Standard' : (designOption === 'upload' ? 'Grafică Proprie' : (designOption === 'text_only' ? 'Doar Text' : 'Vreau Grafică')),
                ...(designOption === 'text_only' && { "Text Personalizat": textDesign }),
                ...(designOption === 'upload' && { "Fișier": artworkUrl }),
                ...(designOption === 'pro' && { "Cost Grafică": formatMoneyDisplay(PRO_DESIGN_FEE) })
            }
        });
        showToast("Produs adăugat în coș!", "success");
    };

    const materialLabels: Record<string, string> = {
        'autocolant': 'Autocolant Sticker',
        'placa-pvc-2mm': 'Placă PVC 2mm',
        'placa-pvc-3mm': 'Panou PVC 3mm (Rigid)',
        'placa-pvc-5mm': 'Panou PVC 5mm (Rigid)',
        'banner': 'Banner (Prelată)',
        'aluminiu-compozit': 'Aluminiu Compozit',
        'plexiglas': 'Plexiglas Premium'
    };

    const materialDescs: Record<string, string> = {
        'autocolant': 'Folie adezivă flexibilă aplicabilă pe orice suprafață netedă.',
        'placa-pvc-3mm': 'Material plastic rigid, rezistent la exterior, grosime 3mm.',
        'placa-pvc-5mm': 'Material plastic rigid, extra-rezistent, grosime 5mm.',
    };

    const summaryStep1 = selectedMaterial ? (materialLabels[selectedMaterial] || selectedMaterial) : "Alege";
    const summaryStep2 = selectedVariant ? `${selectedVariant.size}, ${quantity} buc` : "Alege Dimensiunea";
    const summaryStep3 = designOption === 'standard' ? 'Model Standard' : (designOption === 'upload' ? 'Grafică Proprie' : (designOption === 'text_only' ? 'Doar Text' : 'Vreau Grafică'));

    const totalPrice = (selectedVariant ? selectedVariant.price * quantity : 0) + (designOption === 'pro' ? PRO_DESIGN_FEE : 0);

    return (
        <main className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-10 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* LEFT: GALLERY */}
                    <div className="lg:sticky top-24 h-max space-y-8">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                            <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                                <img src={activeImage} alt={product.title} className="h-full w-full object-contain" />
                            </div>
                            {GALLERY.length > 1 && (
                                <div className="p-2 grid grid-cols-4 gap-2">
                                    {GALLERY.map((src, i) => <button key={src} onClick={() => setActiveIndex(i)} className={`relative rounded-lg aspect-square ${activeIndex === i ? "ring-2 ring-offset-2 ring-indigo-500" : "hover:opacity-80"}`}><img src={src} alt="Thumb" className="w-full h-full object-cover" /></button>)}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: CONFIGURATOR */}
                    <div>
                        <header className="mb-6">
                            <div className="flex justify-between items-center gap-4 mb-3">
                                <div>
                                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{product.metadata.category}</span>
                                    <h1 className="text-3xl font-extrabold text-gray-900 mt-1">{product.title}</h1>
                                </div>
                            </div>
                            <div className="flex justify-between items-center"><p className="text-gray-600">Configurează produsul în 2 pași.</p><button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline inline-flex items-center text-sm px-3 py-1.5"><Info size={16} /><span className="ml-2">Detalii</span></button></div>
                        </header>

                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-4">

                            {/* STEP 1: MATERIAL */}
                            <AccordionStep stepNumber={1} title="Alege Materialul" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                                {/* Material Selector - Improved */}
                                <div className="grid grid-cols-1 gap-2">
                                    {materials.map((m) => (
                                        <OptionButton
                                            key={m}
                                            active={selectedMaterial === m}
                                            onClick={() => setSelectedMaterial(m)}
                                            title={materialLabels[m] || m}
                                            subtitle={materialDescs[m] || "Material standard de înaltă calitate."}
                                            icon={m.includes('pvc') ? Package : (m.includes('autocolant') ? Layers : ShieldCheck)}
                                        />
                                    ))}
                                </div>
                            </AccordionStep>

                            {/* STEP 2: SIZE & QTY */}
                            <AccordionStep stepNumber={2} title="Dimensiune & Cantitate" summary={summaryStep2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)}>
                                <div className="grid grid-cols-1 gap-4">
                                    <label className="field-label">Dimensiuni Disponibile</label>
                                    <div className="flex flex-wrap gap-2">
                                        {sizes.map((v) => (
                                            <button
                                                key={v.id}
                                                onClick={() => setSelectedVariant(v)}
                                                className={`px-4 py-3 rounded-lg border-2 transition-all font-bold text-sm ${selectedVariant?.id === v.id
                                                    ? "border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm"
                                                    : "border-gray-200 hover:border-gray-300 text-gray-700 bg-white"
                                                    }`}
                                            >
                                                {v.size}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setCustomSizeModal(true)}
                                            className="px-4 py-3 rounded-lg border-2 border-dashed border-indigo-200 bg-indigo-50/50 text-indigo-600 hover:bg-indigo-100 hover:border-indigo-300 transition-all font-bold text-sm flex items-center gap-2"
                                        >
                                            <Ruler size={16} />
                                            <span>Altă Dimensiune?</span>
                                        </button>
                                    </div>

                                    <div className="mt-4">
                                        <NumberInput label="Cantitate" value={quantity} onChange={setQuantity} />
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
                                                    <img src={GALLERY[0]} alt="Model" className="w-full h-full object-cover rounded" />
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
                                                    <textarea className="input" rows={3} value={textDesign} onChange={e => setTextDesign(e.target.value)} placeholder="Ex: Textul pentru indicator..."></textarea>
                                                </div>
                                            )}

                                            {designOption === 'pro' && (
                                                <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200 text-sm text-indigo-800">
                                                    <p className="font-semibold">Serviciu de Grafică Profesională</p>
                                                    <p>Cost: <strong>{formatMoneyDisplay(PRO_DESIGN_FEE)}</strong>. Un designer te va contacta.</p>
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
                                    <p className="text-3xl font-extrabold text-gray-900">{formatMoneyDisplay(totalPrice)}</p>
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
                                    href={`https://wa.me/40750473111?text=Ma%20intereseaza%20produsul%20${encodeURIComponent(product.title)}`}
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
                                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">{product.title}</h2>
                                <p className="text-gray-700 mb-6 leading-relaxed text-base lg:text-lg">{product.description}</p>

                                {/* INFO SPECIFICE MATERIAL */}
                                {selectedMaterial && (
                                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-2">Despre {materialLabels[selectedMaterial]}</h3>
                                            <p className="text-sm text-gray-600">{materialDescs[selectedMaterial] || "Material profesional, rezistent și durabil."}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-gray-700"><Check className="text-green-500 w-4 h-4" /> Rezistent la apă și UV</div>
                                            <div className="flex items-center gap-2 text-sm text-gray-700"><Check className="text-green-500 w-4 h-4" /> Print de înaltă rezoluție</div>
                                            <div className="flex items-center gap-2 text-sm text-gray-700"><Check className="text-green-500 w-4 h-4" /> Gata de montaj</div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {activeTab === 'recenzii' && <Reviews productSlug={product.id} />}
                        {activeTab === 'faq' && <FaqAccordion qa={signageFaqs} />}
                    </div>
                </div>

                {/* NAVIGARE RAPIDĂ */}
                <div className="mt-12 mb-8">
                    <QuickNav title="Vrei să personalizezi alt produs?" />
                </div>
            </div>

            {/* CUSTOM SIZE MODAL */}
            {customSizeModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setCustomSizeModal(false)}>
                    <div className="relative z-10 w-full max-w-2xl bg-white text-slate-900 rounded-2xl shadow-lg border border-gray-200 p-8" onClick={e => e.stopPropagation()}>
                        <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100" onClick={() => setCustomSizeModal(false)}><X size={20} className="text-gray-600" /></button>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Dimensiune Personalizată</h3>
                        <p className="text-gray-600 mb-8">
                            Pentru dimensiuni atipice, alege tipul de material dorit și te vom redirecționa către configuratorul avansat, unde poți introduce orice dimensiune (L x H).
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                onClick={() => window.location.href = `/autocolante?image=${encodeURIComponent(product.images[0])}&title=${encodeURIComponent(product.title)}`}
                                className="flex flex-col items-center p-6 rounded-2xl border-2 border-emerald-100 bg-emerald-50/50 hover:bg-emerald-100 hover:border-emerald-300 transition-all group"
                            >
                                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Layers size={24} />
                                </div>
                                <span className="font-bold text-lg text-emerald-900">Autocolant</span>
                                <span className="text-xs text-emerald-600 font-semibold mt-1">Sticker Flexibil</span>
                            </button>

                            <button
                                onClick={() => window.location.href = `/materiale/pvc-forex?image=${encodeURIComponent(product.images[0])}&title=${encodeURIComponent(product.title)}`}
                                className="flex flex-col items-center p-6 rounded-2xl border-2 border-indigo-100 bg-indigo-50/50 hover:bg-indigo-100 hover:border-indigo-300 transition-all group"
                            >
                                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Package size={24} />
                                </div>
                                <span className="font-bold text-lg text-indigo-900">Panou Rigid</span>
                                <span className="text-xs text-indigo-600 font-semibold mt-1">PVC / Forex</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {detailsOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setDetailsOpen(false)}>
                    <div className="relative z-10 w-full max-w-2xl bg-white text-slate-900 rounded-2xl shadow-lg border border-gray-200 p-8" onClick={e => e.stopPropagation()}>
                        <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100" onClick={() => setDetailsOpen(false)}><X size={20} className="text-gray-600" /></button>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Detalii Tehnice</h3>
                        <div className="prose prose-sm prose-slate max-w-none">
                            <h4>Materiale</h4>
                            <ul>
                                <li><strong>Autocolant:</strong> Folie adezivă, aplicare pe suprafețe netede.</li>
                                <li><strong>PVC Forex:</strong> Placă rigidă PVC, rezistentă și ușoară.</li>
                                <li><strong>Plexiglas:</strong> Sticlă acrilică premium, lucioasă.</li>
                            </ul>
                            <h4>Montaj</h4>
                            <ul>
                                <li>Toate plăcile rigide pot fi găurite sau lipite cu silicon/bandă dublu adezivă.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
