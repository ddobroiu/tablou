"use client";

import React, { useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/ToastProvider";
import { OptionButton } from "./ui/OptionButton";
import { NumberInput } from "./ui/NumberInput";

const TabButton = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-bold transition-all border-b-2 ${
            active ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300'
        }`}
    >
        {children}
    </button>
);

const TabButtonSEO = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
        onClick={onClick}
        className={`flex-1 py-3 px-4 text-sm font-bold transition-colors ${
            active ? 'bg-white text-emerald-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-300'
        }`}
    >
        {children}
    </button>
);
import { 
    Plus, 
    Minus, 
    ShoppingCart, 
    Info, 
    Check,
    ChevronDown, 
    X, 
    UploadCloud, 
    MessageCircle, 
    TrendingUp,
    CheckCircle2,
    Truck,
    ShieldCheck,
    ChevronRight,
    Sparkles,
    Ruler,
    Percent,
    PencilRuler
} from "lucide-react";
import Link from "next/link";
import { bannerProducts } from "@/lib/products/banner-products";
import DeliveryEstimation from "./DeliveryEstimation";
import { calculateBannerPrice, formatMoneyDisplay, BANNER_CONSTANTS, getBannerUpsell, type PriceInputBanner } from "@/lib/pricing";
import FaqAccordion from "./FaqAccordion";
import { QA } from "@/types/configurator";
import Reviews from "@/components/Reviews";
import ProductJsonLd from "@/components/ProductJsonLd";
import Image from "next/image";
import QuickNav from "@/components/QuickNav";
import PopularDesigns from "@/components/PopularDesigns";
import { getLandingInfo } from "@/lib/landingData";

const bannerFaqs: QA[] = [
    { question: "Ce materiale sunt disponibile?", answer: "Oferim Frontlit 440g (Standard) și Frontlit 510g (Premium), ambele fiind materiale PVC durabile, special concepute pentru uz exterior." },
    { question: "Ce finisaje sunt incluse?", answer: "Toate bannerele vin cu tiv de rezistență pe tot perimetrul și capse metalice de prindere." },
    { question: "Cât durează producția?", answer: "Producția durează în mod normal 1-2 zile lucrătoare." },
];

const PREDEFINED_DIMENSIONS = [
    { label: "100x50 cm", w: 100, h: 50 },
    { label: "150x50 cm", w: 150, h: 50 },
    { label: "200x50 cm", w: 200, h: 50 },
    { label: "300x50 cm", w: 300, h: 50 },
    { label: "100x75 cm", w: 100, h: 75 },
    { label: "150x75 cm", w: 150, h: 75 },
    { label: "100x100 cm", w: 100, h: 100 },
    { label: "150x100 cm", w: 150, h: 100 },
    { label: "200x100 cm", w: 200, h: 100 },
    { label: "300x100 cm", w: 300, h: 100 },
    { label: "400x100 cm", w: 400, h: 100 },
    { label: "300x150 cm", w: 300, h: 150 },
    { label: "400x150 cm", w: 400, h: 150 },
];

const AccordionStep = ({ stepNumber, title, summary, isOpen, onClick, children, isLast = false }: { stepNumber: number; title: string; summary: string; isOpen: boolean; onClick: () => void; children: React.ReactNode; isLast?: boolean; }) => (
    <div className="relative pl-12">
        <div className="absolute top-5 left-0 flex flex-col items-center h-full">
            <span className={`flex items-center justify-center w-8 h-8 rounded-full text-md font-bold transition-colors ${isOpen ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700 dark:text-gray-300'}`}>{stepNumber}</span>
            {!isLast && <div className="w-px grow bg-gray-200 mt-2"></div>}
        </div>
        <div className="flex-1">
            <button type="button" className="w-full flex items-center justify-between py-5 text-left focus:outline-none" onClick={onClick}>
                <div>
                    <h2 className="text-lg font-bold text-gray-800">{title}</h2>
                    {!isOpen && <p className="text-sm text-gray-500 truncate max-w-[200px] sm:max-w-md">{summary}</p>}
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
            </button>
            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100 pb-5" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">{children}</div>
            </div>
        </div>
    </div>
);

interface Props {
    productSlug: string;
    renderOnlyConfigurator?: boolean;
}

function StockBannerModeLinks() {
    const pathname = usePathname() || "";
    const isVerso = pathname.includes("banner-verso");
    const isMesh = pathname.includes("/mesh");
    const isBannerProductPath =
        pathname === "/configurator/banner" ||
        /^\/configurator\/banner-/.test(pathname);
    const isFace = !isVerso && !isMesh && isBannerProductPath;

    return (
        <div className="inline-flex flex-wrap gap-1 rounded-lg border border-gray-300 bg-white p-1 shadow-sm shrink-0">
            <Link
                href="/configurator/banner"
                className={`px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all ${isFace ? "bg-emerald-600 text-white shadow-md" : "text-gray-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
            >
                O față
            </Link>
            <Link
                href="/configurator/banner-verso"
                className={`px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all ${isVerso ? "bg-emerald-600 text-white shadow-md" : "text-gray-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
            >
                Față-verso
            </Link>
            <Link
                href="/configurator/mesh"
                className={`px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all ${isMesh ? "bg-emerald-600 text-white shadow-md" : "text-gray-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
            >
                Mesh
            </Link>
        </div>
    );
}

export default function StockBannerConfigurator({ productSlug, renderOnlyConfigurator }: Props) {
    const { addItem } = useCart();
    const { success } = useToast();

    const product = useMemo(() => {
        const found = bannerProducts.find(p => p.slug === productSlug);
        if (found) return found;

        const landingInfo = getLandingInfo("bannere", productSlug);
        if (landingInfo) {
            return {
                id: landingInfo.key,
                slug: landingInfo.key,
                title: landingInfo.title,
                description: landingInfo.shortDescription,
                image: landingInfo.images?.[0] || "/products/banner/banner-personalizat-acces-parcare-nu-blocati_6107382.jpg",
                price: 49,
                category: "Bannere",
                tags: ["seo", "banner", landingInfo.key]
            };
        }
        return undefined;
    }, [productSlug]);

    const [width, setWidth] = useState(200);
    const [height, setHeight] = useState(100);
    const [material, setMaterial] = useState<"frontlit_440" | "frontlit_510">("frontlit_440");
    const [bannerType, setBannerType] = useState<"single" | "double">("single");
    const [wantWindHoles, setWantWindHoles] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [activeProductTab, setActiveProductTab] = useState<'descriere' | 'recenzii' | 'faq'>('descriere');
    const [activeStep, setActiveStep] = useState(1);
    const [customText, setCustomText] = useState("");
    const [designOption, setDesignOption] = useState<'standard' | 'upload'>('standard');
    const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    if (!product) return null;

    const priceData = useMemo(() => {
        const input: PriceInputBanner = {
            width_cm: width,
            height_cm: height,
            quantity: quantity,
            material: material,
            banner_type: bannerType,
            want_wind_holes: wantWindHoles,
            want_hem_and_grommets: true,
            designOption: "upload"
        };
        const price = calculateBannerPrice(input);
        const upsell = getBannerUpsell(input);
        return { ...price, upsell };
    }, [width, height, quantity, material, bannerType, wantWindHoles]);

    const handleAddToCart = () => {
        addItem({
            id: `stock-banner-${product.id}-${width}x${height}-${Date.now()}`,
            productId: 'banner',
            title: `${product.title} - ${width}x${height} cm`,
            price: priceData.finalPrice / quantity,
            quantity: quantity,
            metadata: {
                "Dimensiune": `${width}x${height} cm`,
                "Tip": bannerType === 'double' ? "Față-Verso" : "O singură față",
                "Material": material === 'frontlit_510' ? "Frontlit 510g (Premium)" : "Frontlit 440g (Standard)",
                "Finisaje": `Tiv + Capse${wantWindHoles ? ' + Găuri de Vânt' : ''}`,
                "Imagine": product.image,
                "Text Personalizat": customText || "-",
                "Optiune Grafica": designOption === 'standard' ? 'Model Standard' : 'Fisier Proprie',
                ...(designOption === 'upload' && artworkUrl ? { "Fisier": artworkUrl } : {}),
            }
        });
        success("Produsul a fost adăugat în coș!");
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            if (res.ok) {
                const data = await res.json();
                setArtworkUrl(data.url);
            } else {
                setArtworkUrl(URL.createObjectURL(file));
            }
        } catch (err) {
            setArtworkUrl(URL.createObjectURL(file));
        } finally {
            setUploading(false);
        }
    };

    const summaryStep1 = `${width}x${height} cm, ${quantity} buc.`;
    const summaryStep2 = `${bannerType === 'double' ? 'Față-Verso, ' : ''}${material === 'frontlit_510' ? 'Premium' : 'Standard'}${wantWindHoles ? ', cu găuri' : ''}`;
    const summaryStep3 = designOption === 'standard' ? 'Model Standard' : 'Grafică Proprie';

    return (
        <div className="bg-slate-50 dark:bg-slate-800 min-h-screen pb-20 w-full max-w-full overflow-x-hidden box-border">
            <ProductJsonLd
                name={product.title.replace(/^Banner Banner /i, 'Banner ')}
                description={product.description}
                image={product.image}
                price={priceData.finalPrice}
                sku={product.id}
                url={`https://www.tablou.net/banner-product/${product.slug}`}
            />

            <div className={`container mx-auto ${renderOnlyConfigurator ? 'px-0' : 'px-4'} py-8 lg:py-16`}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    <div className="lg:sticky lg:top-24 h-max w-full">
                        <div className="bg-white sm:rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden relative group">
                            <div className="aspect-square relative bg-white flex items-center justify-center p-4">
                                <Image 
                                    src={product.image} 
                                    alt={product.title} 
                                    fill 
                                    className="object-contain p-4 sm:p-8"
                                    priority 
                                />
                            </div>
                        </div>
                    </div>

                    <div className={`${renderOnlyConfigurator ? 'w-full' : 'px-4 sm:px-0 w-full'}`}>
                        {!renderOnlyConfigurator && (
                            <header className="mb-6 sm:mb-8">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3 sm:mb-4">
                                    <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight break-words">
                                        {product.title.replace(/^Banner Banner /i, 'Banner ').replace(/^Banner Banner/i, 'Banner')}
                                    </h1>
                                    <StockBannerModeLinks />
                                </div>
                                <p className="text-xs sm:text-sm text-gray-500">Configurează dimensiunile și comandă online în câteva minute.</p>
                            </header>
                        )}

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 px-4 py-2 mb-8">
                            <AccordionStep stepNumber={1} title="Alege Dimensiunea" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                                 <div className="space-y-6">
                                     <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-300">
                                         <div>
                                             <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Lungime (cm)</label>
                                             <div className="flex bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                                                 <input 
                                                     type="number" 
                                                     value={width} 
                                                     onChange={(e) => setWidth(Math.max(1, parseInt(e.target.value) || 0))}
                                                     className="w-full text-center py-4 text-xl font-bold text-slate-900 dark:text-white bg-transparent focus:outline-none"
                                                 />
                                             </div>
                                         </div>
                                         <div>
                                             <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Înălțime (cm)</label>
                                             <div className="flex bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                                                 <input 
                                                     type="number" 
                                                     value={height} 
                                                     onChange={(e) => setHeight(Math.max(1, parseInt(e.target.value) || 0))}
                                                     className="w-full text-center py-4 text-xl font-bold text-slate-900 dark:text-white bg-transparent focus:outline-none"
                                                 />
                                             </div>
                                         </div>
                                     </div>
                                     
                                     <div className="pt-2">
                                         <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Modele Predefinite</label>
                                         <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                             {PREDEFINED_DIMENSIONS.map((dim, idx) => (
                                                 <button 
                                                     key={idx} 
                                                     onClick={() => { setWidth(dim.w); setHeight(dim.h); }} 
                                                     className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg border font-bold text-[10px] sm:text-xs transition-all ${width === dim.w && height === dim.h ? "border-emerald-600 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-100" : "border-gray-200 dark:border-slate-800 bg-white text-gray-500 hover:border-gray-300"}`}
                                                 >
                                                     {dim.label}
                                                 </button>
                                             ))}
                                         </div>
                                     </div>

                                     <div className="pt-2">
                                         <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">Telefon / Indicații (Opțional)</label>
                                         <input type="text" value={customText} onChange={(e) => setCustomText(e.target.value)} placeholder="Ex: nr. telefon, text dorit..." className="w-full p-4 border border-gray-200 dark:border-slate-800 rounded-xl text-sm bg-slate-50 dark:bg-slate-800" />
                                     </div>

                                     <div className="pt-2">
                                         <NumberInput label="Cantitate (bucăți)" value={quantity} onChange={setQuantity} />
                                     </div>

                                 </div>
                             </AccordionStep>

                            <AccordionStep stepNumber={2} title="Material & Finisaje" summary={summaryStep2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)}>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <OptionButton active={material === "frontlit_440"} onClick={() => setMaterial("frontlit_440")} title="440g Standard" subtitle="Economic" />
                                        <OptionButton active={material === "frontlit_510"} onClick={() => setMaterial("frontlit_510")} title="510g Premium" subtitle="Rezistent" />
                                    </div>
                                    <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl cursor-pointer">
                                        <input type="checkbox" checked={wantWindHoles} onChange={e => setWantWindHoles(e.target.checked)} className="w-5 h-5 text-emerald-600 rounded" />
                                        <span className="text-sm font-bold">Adaugă găuri de vânt</span>
                                    </label>
                                </div>
                            </AccordionStep>

                            <AccordionStep stepNumber={3} title="Grafică" summary={summaryStep3} isOpen={activeStep === 3} onClick={() => setActiveStep(3)} isLast={true}>
                                <div className="space-y-4">
                                    {/* Editor Online button removed from here, moved to tabs below */}

                                        <div className="flex -mb-px overflow-x-auto no-scrollbar">
                                            <TabButton active={designOption === 'standard'} onClick={() => setDesignOption('standard')}>Standard</TabButton>
                                            <TabButton active={designOption === 'upload'} onClick={() => setDesignOption('upload')}>Încărcare Machetă</TabButton>
                                            <Link 
                                                href={`/editor?w=${width}&h=${height}`}
                                                className="px-4 py-2 text-sm font-bold transition-all rounded-t-lg bg-orange-600 text-white hover:bg-orange-700 flex items-center gap-2 shrink-0 ml-auto"
                                            >
                                                <PencilRuler size={14} />
                                                Editor Online
                                            </Link>
                                        </div>

                                    {designOption === 'standard' && (
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm border border-slate-200">
                                            <p className="text-gray-600 dark:text-gray-400 mb-2">Se va folosi modelul din imaginea de prezentare.</p>
                                        </div>
                                    )}

                                    {designOption === 'upload' && (
                                        <div className="space-y-3">
                                            <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-xl appearance-none cursor-pointer hover:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                                <UploadCloud className="w-8 h-8 text-gray-400 mb-1" />
                                                <span className="font-medium text-gray-600 dark:text-gray-400">Apasă pentru a încărca fișierul</span>
                                                <input type="file" className="hidden" onChange={handleFileUpload} />
                                            </label>
                                            {artworkUrl && <p className="text-emerald-600 font-bold text-center text-sm">Grafică proprie recepționată!</p>}
                                        </div>
                                    )}
                                </div>
                            </AccordionStep>
                        </div>

                        <div className="mt-8 bg-white lg:rounded-2xl border lg:border-gray-200 dark:border-slate-800 lg:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] p-4 lg:p-6 mb-24 lg:mb-0">
                            <div className="flex flex-col gap-4">
                                <button onClick={handleAddToCart} className="w-full py-4 text-lg font-bold bg-emerald-600 text-white rounded-xl shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-emerald-500/20">
                                    <ShoppingCart size={24} className="shrink-0" />
                                    <span>Adaugă în Coș</span>
                                </button>

                                <div className="flex flex-col gap-1 w-full border-t border-gray-100 pt-3 mt-1">
                                    <div className="flex flex-row justify-between items-center w-full gap-2">
                                        <div className="flex flex-col items-start leading-none">
                                            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Preț Total</span>
                                            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{formatMoneyDisplay(priceData.finalPrice)}</span>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <DeliveryEstimation />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* STICKY BOTTOM BAR FOR MOBILE */}
                        <div className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 pb-safe animate-in slide-in-from-bottom duration-300 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)]">
                            <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
                                <div className="flex flex-col leading-none">
                                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Total Plată</span>
                                    <span className="text-xl font-black text-slate-900 dark:text-white">{formatMoneyDisplay(priceData.finalPrice)}</span>
                                </div>
                                <button 
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all text-sm"
                                >
                                    <ShoppingCart size={18} strokeWidth={2.5} />
                                    Adaugă
                                </button>
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

                <div className="mt-16 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <nav className="flex border-b border-gray-100 bg-slate-50 dark:bg-slate-800/50">
                        <TabButtonSEO active={activeProductTab === "descriere"} onClick={() => setActiveProductTab("descriere")}>Descriere</TabButtonSEO>
                        <TabButtonSEO active={activeProductTab === "recenzii"} onClick={() => setActiveProductTab("recenzii")}>Recenzii</TabButtonSEO>
                        <TabButtonSEO active={activeProductTab === "faq"} onClick={() => setActiveProductTab("faq")}>FAQ</TabButtonSEO>
                    </nav>
                    <div className="p-8">
                        {activeProductTab === 'descriere' && (
                            <div className="prose dark:prose-invert max-w-none text-sm text-gray-600 dark:text-gray-400">
                                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-4">{product.title}</h3>
                                <p>{product.description}</p>
                                <ul className="mt-4 list-disc pl-5">
                                    <li>Print UV durabil la exterior</li>
                                    <li>Tiv și capse incluse</li>
                                    <li>Material PVC Frontlit premium</li>
                                </ul>
                            </div>
                        )}
                        {activeProductTab === 'recenzii' && <Reviews productSlug={productSlug} />}
                        {activeProductTab === 'faq' && <FaqAccordion qa={bannerFaqs} />}
                    </div>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="p-6 bg-white rounded-2xl border border-gray-100 text-center">
                        <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                        <h4 className="font-bold text-sm">Garanție UV</h4>
                    </div>
                    <div className="p-6 bg-white rounded-2xl border border-gray-100 text-center">
                        <Truck className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                        <h4 className="font-bold text-sm">Livrare 24h</h4>
                    </div>
                    <div className="p-6 bg-white rounded-2xl border border-gray-100 text-center">
                        <Check className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                        <h4 className="font-bold text-sm">Finisaje Incluse</h4>
                    </div>
                    <div className="p-6 bg-white rounded-2xl border border-gray-100 text-center">
                        <MessageCircle className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                        <h4 className="font-bold text-sm">Suport 24/7</h4>
                    </div>
                </div>

                {!renderOnlyConfigurator && (
                     <>
                        <div className="mt-20">
                            <QuickNav title="Alte Produse" />
                        </div>
                        <div className="mt-16">
                            <PopularDesigns currentSlug={product.slug} products={bannerProducts} />
                        </div>
                     </>
                )}
            </div>
        </div>
    );
}
