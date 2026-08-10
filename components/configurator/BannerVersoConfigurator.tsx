"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { Plus, Minus, ShoppingCart, Info, ChevronDown, X, UploadCloud, Image as ImageIcon, Ruler, PlayCircle, TrendingUp, Percent, MessageCircle, PencilRuler } from "lucide-react";
import DeliveryEstimation from "./DeliveryEstimation";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from 'next/link';
import FaqAccordion from "./FaqAccordion";
import DynamicBannerPreview from "./DynamicBannerPreview";
import ArtworkRatioPreview from "./ArtworkRatioPreview";
import {
    calculateBannerVersoPrice,
    getBannerVersoUpsell,
    BANNER_VERSO_CONSTANTS,
    formatMoneyDisplay,
    roundMoney,
    type PriceInputBannerVerso
} from "@/lib/pricing";
import { PopularDimensions } from "./PopularDimensions";

import { AccordionStep } from "./ui/AccordionStep";
import { TabButtonSEO } from "./ui/TabButtonSEO";
import { NumberInput } from "./ui/NumberInput";
import { TabButton } from "./ui/TabButton";

/* --- TYPES --- */
type QA = { question: string; answer: string; };

/* --- FAQs SPECIFIC PRODUSULUI --- */
const productFaqs: QA[] = [
    { question: "Ce material este folosit pentru bannerele față-verso?", answer: "Folosim material tip Blockout (650g/mp), special conceput pentru a bloca lumina, asigurând vizibilitate perfectă a graficii pe ambele fețe." },
    { question: "Care este diferența de preț față de cel cu o singură față?", answer: "Bannerele față-verso sunt calculate cu o bază de preț de aproximativ 1.5x față de cele standard, datorită materialului mai scump și procesului de imprimare mai complex." },
    { question: "Finisajele sunt incluse în preț?", answer: "Da, tivul de rezistență perimetral și capsele metalice sunt incluse standard. Puteți opta și pentru găuri de vânt." },
    { question: "Pot avea grafică diferită pe față și pe verso?", answer: "Da. Puteți alege să încărcați două grafici diferite sau să solicitați un design profesional separat pentru fiecare față, cu o taxă suplimerară (100 RON pentru grafică diferită)." },
    { question: "Cât durează producția și livrarea?", answer: "Producția durează în mod normal 1-3 zile lucrătoare. Livrarea prin curier rapid mai adaugă încă 1-2 zile, în funcție de localitatea de destinație." },
];

const ProductTabs = ({ productSlug }: { productSlug: string }) => {
    const [activeTab, setActiveTab] = useState("descriere");
    const bannerFaqs: QA[] = [
        { question: "Ce material este folosit pentru bannerele față-verso?", answer: "Folosim material tip Blockout (650g/mp), special conceput pentru a bloca lumina, asigurând vizibilitate perfectă a graficii pe ambele fețe." },
        { question: "Care este diferența de preț față de cel cu o singură față?", answer: "Bannerele față-verso sunt calculate cu o bază de preț de aproximativ 1.5x față de cele standard, datorită materialului mai scump și procesului de imprimare mai complex." },
        { question: "Finisajele sunt incluse în preț?", answer: "Da, tivul de rezistență perimetral și capsele metalice sunt incluse standard. Puteți opta și pentru găuri de vânt." },
        { question: "Pot avea grafică diferită pe față și pe verso?", answer: "Da. Puteți alege să încărcați două grafici diferite sau să solicitați un design profesional separat pentru fiecare față, cu o taxă suplimentară (100 RON pentru grafică diferită)." },
        { question: "Cât durează producția și livrarea?", answer: "Producția durează în mod normal 1-3 zile lucrătoare. Livrarea prin curier rapid mai adaugă încă 1-2 zile, în funcție de localitatea de destinație." },
    ];
    return (
        <div className="bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-gray-200 dark:border-slate-800">
            <nav className="border-b border-gray-200 dark:border-slate-800 flex">
                <TabButtonSEO active={activeTab === "descriere"} onClick={() => setActiveTab("descriere")}>Descriere</TabButtonSEO>
                <TabButtonSEO active={activeTab === "faq"} onClick={() => setActiveTab("faq")}>FAQ</TabButtonSEO>
            </nav>
            <div className="p-6">
                {activeTab === 'descriere' && (
                    <div className="prose dark:prose-invert max-w-none text-sm text-gray-600 dark:text-gray-400">
                        <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-2">Bannere Publicitare Față-Verso (Blockout)</h3>
                        <p className="mb-4">
                            <strong>Vizibilitate maximă în ambele direcții de mers.</strong> Bannerele Blockout sunt realizate dintr-un material special, opac, care împiedică trecerea luminii, asigurând vizibilitate perfectă a graficii pe ambele fețe. Soluția ideală pentru expunerea perpendiculară pe sensul de mers (ex: pe stâlpi sau balcoane).
                        </p>

                        <h4 className="text-slate-900 dark:text-white font-semibold mt-4 mb-2">Materiale & Calitate</h4>
                        <ul className="list-disc pl-5 space-y-1 mb-4">
                            <li><strong>Blockout 650g:</strong> Material PVC foarte gros, cu inserție neagră la interior, care blochează lumina. Imprimare la rezoluție fotografică pe ambele fețe.</li>
                        </ul>

                        <h4 className="text-slate-900 dark:text-white font-semibold mt-4 mb-2">De ce să alegi bannerele noastre față-verso?</h4>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Opacitate 100%:</strong> Grație stratului de blocare, nu veți avea probleme de 'ghosting' (vizibilitatea textului de pe partea opusă).</li>
                            <li><strong>Rezistență UV și Apă:</strong> Folosim cerneluri Eco-Solvent de ultimă generație care nu se decolorează.</li>
                            <li><strong>Finisaje Incluse:</strong> Tivul perimetral și capsele de prindere sunt incluse standard în preț.</li>
                        </ul>
                    </div>
                )}
                {activeTab === 'faq' && <FaqAccordion qa={bannerFaqs} />}
            </div>
        </div>
    );
};

function BannerModeSwitchInline() {
    const pathname = usePathname() || "";
    const isVerso = pathname.includes("banner-verso");
    const isMesh = pathname.includes("/mesh");
    const isBannerFacePath =
        pathname === "/configurator/banner" ||
        /^\/configurator\/banner-/.test(pathname) ||
        pathname === "/banner" ||
        /^\/banner\//.test(pathname);
    const isFace = !isVerso && !isMesh && isBannerFacePath;

    return (
        <div className="inline-flex flex-wrap gap-1 rounded-lg border border-gray-300 bg-white p-1 shadow-sm">
            <Link
                href="/configurator/banner"
                className={`px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all inline-flex items-center justify-center ${isFace ? "bg-emerald-600 text-white shadow-md" : "text-gray-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
            >
                O față
            </Link>
            <Link
                href="/configurator/banner-verso"
                className={`px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all inline-flex items-center justify-center ${isVerso ? "bg-emerald-600 text-white shadow-md" : "text-gray-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
            >
                Față-verso
            </Link>
            <Link
                href="/configurator/mesh"
                className={`px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all inline-flex items-center justify-center ${isMesh ? "bg-emerald-600 text-white shadow-md" : "text-gray-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
            >
                Mesh
            </Link>
        </div>
    );
}

type Props = { productSlug?: string; initialWidth?: number; initialHeight?: number; productImage?: string; renderOnlyConfigurator?: boolean; imageUrl?: string | null };
type ViewMode = 'gallery' | 'shape';

/* --- MAIN COMPONENT --- */
export default function BannerVersoConfigurator({ productSlug, initialWidth: initW, initialHeight: initH, productImage, renderOnlyConfigurator = false }: Props) {
    const { addItem } = useCart();
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    // --- 1. INITIALIZARE STATE DIN URL SAU DEFAULT ---
    const [input, setInput] = useState<PriceInputBannerVerso>(() => {
        const pW = searchParams.get("w");
        const pH = searchParams.get("h");
        const pQ = searchParams.get("q");
        const pWind = searchParams.get("wind");
        const pSame = searchParams.get("same");

        return {
            width_cm: pW ? parseInt(pW) : (initW ?? 0),
            height_cm: pH ? parseInt(pH) : (initH ?? 0),
            quantity: pQ ? parseInt(pQ) : 1,
            want_wind_holes: pWind === '1',
            same_graphic: pSame !== '0',
            designOption: "upload"
        };
    });

    const [lengthText, setLengthText] = useState(input.width_cm ? String(input.width_cm) : "");
    const [heightText, setHeightText] = useState(input.height_cm ? String(input.height_cm) : "");

    const galleryImages = useMemo(() => productImage ? [productImage, "/products/banner/verso/banner-verso-1.webp", "/products/banner/verso/banner-verso-2.webp", "/products/banner/verso/banner-verso-3.webp"] : ["/products/banner/verso/banner-verso-1.webp", "/products/banner/verso/banner-verso-2.webp", "/products/banner/verso/banner-verso-3.webp", "/products/banner/verso/banner-verso-4.webp"], [productImage]);

    const [viewMode, setViewMode] = useState<ViewMode>('gallery');

    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [activeImage, setActiveImage] = useState<string>(galleryImages[0]);

    // --- VIDEO STATE ---


    const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
    const [artworkUrlVerso, setArtworkUrlVerso] = useState<string | null>(null);
    const [textDesign, setTextDesign] = useState<string | null>(null);
    const [textDesignVerso, setTextDesignVerso] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const [detailsOpen, setDetailsOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(1);
    const [activeProductTab, setActiveProductTab] = useState("descriere");
    const [userEmail, setUserEmail] = useState<string>('');

    const priceData = useMemo(() => calculateBannerVersoPrice(input), [input]);
    const displayedTotal = priceData.finalPrice;

    // --- UPSELL LOGIC (NOU) ---
    const upsellOpportunity = useMemo(() => {
        return getBannerVersoUpsell(input);
    }, [input]);

    const updateInput = <K extends keyof PriceInputBannerVerso>(k: K, v: PriceInputBannerVerso[K]) => setInput((p) => ({ ...p, [k]: v }));
    const setQty = (v: number) => updateInput("quantity", Math.max(1, Math.floor(v)));

    const onChangeLength = (v: string) => {
        const d = v.replace(/\D/g, "");
        setLengthText(d);
        updateInput("width_cm", d === "" ? 0 : parseInt(d, 10));
    };
    const onChangeHeight = (v: string) => {
        const d = v.replace(/\D/g, "");
        setHeightText(d);
        updateInput("height_cm", d === "" ? 0 : parseInt(d, 10));
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams();
            if (input.width_cm > 0) params.set("w", input.width_cm.toString());
            if (input.height_cm > 0) params.set("h", input.height_cm.toString());
            if (input.quantity > 1) params.set("q", input.quantity.toString());
            if (input.want_wind_holes) params.set("wind", "1");
            if (!input.same_graphic) params.set("same", "0");

            // Preserve crucial SEO params
            const current = new URLSearchParams(window.location.search);
            if (current.has('step')) params.set("step", current.get("step")!);
            if (current.has('intent')) params.set("intent", current.get("intent")!);
            if (current.has('image')) params.set("image", current.get("image")!);
            if (current.has('title')) params.set("title", current.get("title")!);

            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        }, 500);

        return () => clearTimeout(timer);
    }, [input, pathname, router]);

    const handleArtworkFileInput = async (file: File | null, side: 'front' | 'verso' = 'front') => {
        setUploadError(null);

        if (side === 'front') setArtworkUrl(null); else setArtworkUrlVerso(null);

        if (!file) return;
        try {
            const previewUrl = URL.createObjectURL(file);
            if (side === 'front' || input.same_graphic) {
                setArtworkUrl(previewUrl);
                setViewMode('gallery');
            } else {
                setArtworkUrlVerso(previewUrl);
            }

            setUploading(true);
            const form = new FormData();
            form.append("file", file);
            form.append("side", side);
            const res = await fetch("/api/upload", { method: "POST", body: form });
            if (!res.ok) throw new Error("Upload eșuat pentru " + (side === 'front' ? 'față' : 'verso'));
            const data = await res.json();

            if (side === 'front' || input.same_graphic) {
                setArtworkUrl(data.url);
            } else {
                setArtworkUrlVerso(data.url);
            }
        } catch (e: any) {
            setUploadError(e?.message ?? ("Eroare la upload pentru " + (side === 'front' ? 'față' : 'verso')));
        } finally {
            setUploading(false);
        }
    };

    function handleAddToCart() {
        if (!input.width_cm || !input.height_cm) {
            alert("Te rugăm să completezi lungimea și înălțimea.");
            return;
        }
        if (displayedTotal <= 0) {
            alert("Prețul trebuie calculat înainte de a adăuga în coș.");
            return;
        }

        const unitPrice = roundMoney(displayedTotal / input.quantity);
        const uniqueId = `banner-verso-${Date.now()}`;
        const title = `Banner Față-Verso - ${input.width_cm}x${input.height_cm} cm`;

        const graphicMeta = input.designOption === 'pro'
            ? 'Vreau grafică'
            : input.designOption === 'text_only'
                ? 'Doar text'
                : 'Grafică proprie';

        const graphicsDetail = input.same_graphic ? "Identică" : "Diferită";

        // Build Record<string, string> for selectedOptions
        const selectedOptions: Record<string, string> = {
            "Dimensiune": `${input.width_cm}x${input.height_cm} cm`,
            "Material": "Blockout (Față-Verso)",
            "Finisaje": `Tiv și capse, ${input.want_wind_holes ? "cu găuri de vânt" : "fără găuri de vânt"}`,
            "Grafică": `${graphicMeta} (${graphicsDetail})`,
        };

        if (input.designOption === 'pro') {
            selectedOptions["Cost grafică"] = formatMoneyDisplay(priceData.proFee);
        }
        if (!input.same_graphic && input.designOption !== 'pro') {
            selectedOptions["Taxă Grafică Diferită"] = formatMoneyDisplay(BANNER_VERSO_CONSTANTS.FEES.DIFF_GRAPHICS);
        }
        if (artworkUrl) selectedOptions["Artwork URL"] = artworkUrl;
        if (!input.same_graphic && artworkUrlVerso) selectedOptions["Artwork URL Verso"] = artworkUrlVerso;
        if (input.designOption === 'text_only' && textDesign) selectedOptions["Text Design"] = textDesign;
        if (!input.same_graphic && input.designOption === 'text_only' && textDesignVerso) selectedOptions["Text Design Verso"] = textDesignVerso;

        addItem({
            id: uniqueId,
            productId: 'banner-verso',
            title: title,
            price: unitPrice,
            quantity: input.quantity,
            metadata: {
                ...selectedOptions,
                artworkUrl: artworkUrl,
                artworkUrlVerso: artworkUrlVerso,
                textDesign: textDesign,
                textDesignVerso: textDesignVerso,
                width: input.width_cm,
                height: input.height_cm,
            },
        });
        alert("Produs adăugat în coș");
    }

    useEffect(() => {
        if (viewMode !== 'gallery' || artworkUrl) return;

        const id = setInterval(() => {
            setActiveIndex((i) => {
                const next = (i + 1) % galleryImages.length;
                return next;
            });
        }, 3000);
        return () => clearInterval(id);
    }, [galleryImages, viewMode, artworkUrl]);

    useEffect(() => {
        setActiveImage(galleryImages[activeIndex]);
    }, [activeIndex, galleryImages]);

    const canAdd = displayedTotal > 0 && input.width_cm > 0 && input.height_cm > 0;
    const summaryStep1 = input.width_cm > 0 && input.height_cm > 0 ? `${input.width_cm}x${input.height_cm}cm, ${input.quantity} buc.` : "Alege";
    const summaryStep2 = `Blockout, ${input.want_wind_holes ? "cu găuri" : "fără găuri"}`;
    const summaryStep3 = input.designOption === 'upload' ? `Grafică proprie (${input.same_graphic ? 'Identică' : 'Diferită'})` : input.designOption === 'text_only' ? `Doar text (${input.same_graphic ? 'Identic' : 'Diferit'})` : `Design Pro (${input.same_graphic ? 'Identic' : 'Diferit'})`;

    // --- HELPER COMPONENTS RENDER ---
    const renderUploadSection = (side: 'Față' | 'Verso', currentUrl: string | null, handleFile: (f: File | null) => Promise<void>) => (
        <div className="space-y-3 p-4 border border-gray-200 dark:border-slate-800 rounded-lg">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{side}</p>
            <label className="flex flex-col items-center justify-center w-full h-24 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                <span className="flex items-center space-x-2">
                    <UploadCloud className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="font-medium text-gray-600 dark:text-gray-400">Apasă pentru a încărca</span>
                </span>
                <input type="file" name={`file_upload_${side}`} className="hidden" onChange={e => handleFile(e.target.files?.[0] ?? null)} />
            </label>
            {uploading && <p className="text-sm text-emerald-600">Se încarcă...</p>}
            {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
            {currentUrl && !uploadError && <p className="text-sm text-green-600 font-semibold">Grafică {side} încărcată cu succes!</p>}
        </div>
    );

    const renderTextOnlySection = (side: 'Față' | 'Verso', currentText: string | null, handleTextChange: (e: any) => void) => (
        <div className="space-y-3 p-4 border border-gray-200 dark:border-slate-800 rounded-lg">
            <label className="field-label">{side} - Introdu textul dorit</label>
            <textarea
                className="input"
                rows={3}
                value={currentText || ''}
                onChange={handleTextChange}
                placeholder="ex: PROMOTIE, REDUCERI, etc."
            />
        </div>
    );

    return (
        <main className={renderOnlyConfigurator ? "" : "bg-slate-50 dark:bg-slate-800 min-h-screen"}>
            <div className="container mx-auto px-4 py-10 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* STÂNGA - ZONA VIZUALĂ */}
                    <div className="lg:sticky top-24 h-max space-y-8">
                        <div className="bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-gray-200 dark:border-slate-800 overflow-hidden">

                            <div className="flex border-b border-gray-100 overflow-x-auto">
                                <button
                                    onClick={() => setViewMode('gallery')}
                                    className={`flex-1 py-3 min-w-20 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${viewMode === 'gallery' ? 'text-slate-950 bg-emerald-50 border-b-2 border-slate-950' : 'text-gray-500 hover:bg-slate-50 dark:bg-slate-800'}`}
                                >
                                    <ImageIcon size={16} />
                                    <span className="hidden sm:inline">Galerie</span>
                                </button>
                                <button
                                    onClick={() => setViewMode('shape')}
                                    className={`flex-1 py-3 min-w-20 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${viewMode === 'shape' ? 'text-slate-950 bg-emerald-50 border-b-2 border-slate-950' : 'text-gray-500 hover:bg-slate-50 dark:bg-slate-800'}`}
                                >
                                    <Ruler size={16} />
                                    <span className="hidden sm:inline">Schiță Tehnică</span>
                                </button>
                            </div>

                            <div className="aspect-square relative bg-white">
                                {viewMode === 'gallery' && (
                                    <>
                                        <div className="h-full w-full flex items-center justify-center p-4">
                                            <img src={activeImage} alt="Banner Față-Verso" className="max-h-full max-w-full object-contain animate-in fade-in duration-300" />
                                        </div>

                                    </>
                                )}

                                {viewMode === 'shape' && (
                                    <div className="h-full w-full p-4 animate-in fade-in slide-in-from-bottom-4 duration-300 bg-zinc-50">
                                        <DynamicBannerPreview
                                            width={input.width_cm}
                                            height={input.height_cm}
                                            hasGrommets={true}
                                            hasWindHoles={input.want_wind_holes}
                                            imageUrl={null}
                                        />
                                        <div className="absolute bottom-4 left-0 w-full text-center text-xs text-gray-400">
                                            Vizualizare tehnică (cote și finisaje)
                                        </div>
                                    </div>
                                )}
                            </div>

                            {viewMode === 'gallery' && (
                                <div className="p-2">
                                    <div className="grid grid-cols-4 gap-2">
                                        {galleryImages.map((src, i) => (
                                            <button key={src} onClick={() => setActiveIndex(i)} className={`relative rounded-lg aspect-square ${activeIndex === i ? "ring-2 ring-offset-2 ring-emerald-500" : "hover:opacity-80"}`}><img src={src} alt="Miniatura" loading="lazy" className="w-full h-full object-cover" /></button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* DREAPTA - CONFIGURATOR */}
                    <div>
                        <header className="mb-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">Configurator Banner Față-Verso</h2>
                                <BannerModeSwitchInline />
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-gray-600 dark:text-gray-400">Personalizează opțiunile în 3 pași simpli.</p>
                                <button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline inline-flex items-center text-sm px-3 py-1.5">
                                    <Info size={16} />
                                    <span className="ml-2">Detalii</span>
                                </button>
                            </div>
                        </header>
                        <div className="bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-gray-200 dark:border-slate-800 px-4">
                            <AccordionStep stepNumber={1} title="Dimensiuni & Cantitate" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Lungime (cm)</label><input type="text" inputMode="decimal" value={lengthText} onFocus={(e) => e.target.select()} onChange={(e) => onChangeLength(e.target.value)} placeholder="200" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900" /></div>
                                    <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Înălțime (cm)</label><input type="text" inputMode="decimal" value={heightText} onFocus={(e) => e.target.select()} onChange={(e) => onChangeHeight(e.target.value)} placeholder="100" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900" /></div>
                                    <div className="md:col-span-2">
                                        <NumberInput label="Cantitate" value={input.quantity} onChange={setQty} step={1} />

                                        {/* --- UPSELL ALERT (NOU) --- */}
                                        {upsellOpportunity && (
                                            <div
                                                className="mt-3 p-3 sm:p-4 bg-emerald-50 border border-emerald-200 rounded-lg cursor-pointer hover:bg-emerald-100 transition-colors flex gap-3 items-center group relative"
                                                onClick={() => updateInput("quantity", upsellOpportunity.requiredQty)}
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
                                </div>
                            </AccordionStep>
                            {/* Pasul 2 adaptat pentru Verso (material fix) */}
                            <AccordionStep stepNumber={2} title="Material & Finisaje" summary={summaryStep2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)}>
                                <p className="field-label mb-2 font-bold">Material: Blockout 650g</p>
                                <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                                    <p className="text-sm text-emerald-800">
                                        Bannerele Față-Verso sunt realizate exclusiv din material Blockout 650g, special conceput pentru opacitate 100%. Finisajele (tiv și capse) sunt incluse.
                                    </p>
                                </div>
                                <label className="flex items-center gap-3 py-2 cursor-pointer"><input type="checkbox" className="checkbox" checked={input.want_wind_holes} onChange={(e) => updateInput("want_wind_holes", e.target.checked)} /><span className="text-sm font-medium text-gray-700 dark:text-gray-300">Adaugă găuri pentru vânt</span></label>
                            </AccordionStep>
                            <AccordionStep stepNumber={3} title="Grafică" summary={summaryStep3} isOpen={activeStep === 3} onClick={() => setActiveStep(3)} isLast={true}>
                                <div>
                                    <div className="mb-4">
                                        {/* NOU: Selector Grafică Identică / Diferită (Buton Switch) */}
                                        <div className="mb-4 p-4 rounded-lg border border-gray-300 bg-white shadow-sm">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-semibold text-gray-800">
                                                    Tip Grafică:
                                                </span>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={!input.same_graphic} // TRUE = Grafica Diferă
                                                        onChange={(e) => updateInput("same_graphic", !e.target.checked)} // Când este bifat, sameGraphic devine FALSE
                                                    />
                                                    {/* Switch UI */}
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>

                                                    {/* Text Indicator */}
                                                    <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        {input.same_graphic ? "Identică (Aceeași pe ambele fețe)" : "Diferită (Fețe diferite)"}
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Editor Online button removed from here, moved to tabs below */}

                                        <div className="flex -mb-px overflow-x-auto no-scrollbar">
                                            <TabButton active={input.designOption === 'upload'} onClick={() => updateInput("designOption", 'upload')}>Am Grafică</TabButton>
                                            <TabButton active={input.designOption === 'text_only'} onClick={() => updateInput("designOption", 'text_only')}>Doar Text</TabButton>
                                            <TabButton active={input.designOption === 'pro'} onClick={() => updateInput("designOption", 'pro')}>Vreau Grafică</TabButton>
                                            <Link 
                                                href={`/editor?w=${input.width_cm}&h=${input.height_cm}&product=banner-verso`}
                                                className="px-4 py-2 text-sm font-bold transition-all rounded-t-lg bg-orange-600 text-white hover:bg-orange-700 flex items-center gap-2 shrink-0 ml-auto"
                                            >
                                                <PencilRuler size={14} />
                                                Editor Online
                                            </Link>
                                        </div>

                                    {input.designOption === 'upload' && (
                                        <div className={`space-y-3 ${!input.same_graphic ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : ''}`}>
                                            <p className={`text-sm text-gray-600 dark:text-gray-400 ${!input.same_graphic ? 'md:col-span-2' : ''}`}>Încarcă fișierul/fișierele tale (PDF, JPG, TIFF, etc.).</p>

                                            {renderUploadSection('Față', artworkUrl, (f) => handleArtworkFileInput(f, 'front'))}

                                            {!input.same_graphic && renderUploadSection('Verso', artworkUrlVerso, (f) => handleArtworkFileInput(f, 'verso'))}

                                        </div>
                                    )}

                                    {input.designOption === 'text_only' && (
                                        <div className={`space-y-3 ${!input.same_graphic ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : ''}`}>
                                            {renderTextOnlySection('Față', textDesign, e => setTextDesign(e.target.value))}

                                            {!input.same_graphic && renderTextOnlySection('Verso', textDesignVerso, e => setTextDesignVerso(e.target.value))}

                                        </div>
                                    )}

                                    {input.designOption === 'pro' && (
                                        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">
                                            <p className="font-semibold">Serviciu de Grafică Profesională</p>
                                            <p>O echipă de designeri va crea o propunere grafică pentru tine. Vei primi pe email o simulare pentru confirmare. Cost:
                                                <strong>
                                                    {input.same_graphic
                                                        ? formatMoneyDisplay(BANNER_VERSO_CONSTANTS.FEES.PRO_SAME)
                                                        : formatMoneyDisplay(BANNER_VERSO_CONSTANTS.FEES.PRO_DIFF)}
                                                </strong>.
                                            </p>
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
                                    <span className="flex items-center gap-2">
                                        <Info size={18} />
                                        <span className="text-sm">Cerere Ofertă</span>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECȚIUNE FEATURES - FULL WIDTH JOS */}
                <div className="mt-8 lg:mt-12"><ProductTabs productSlug="banner-verso" /></div>

                {detailsOpen && (
                    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setDetailsOpen(false)}>
                        <div className="relative z-10 w-full max-w-2xl bg-white text-slate-900 dark:text-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-gray-200 dark:border-slate-800 p-8" onClick={e => e.stopPropagation()}>
                            <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100" onClick={() => setDetailsOpen(false)} aria-label="Închide">
                                <X size={20} className="text-gray-600 dark:text-gray-400" />
                            </button>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Detalii Produs: Banner Față-Verso</h3>
                            <div className="prose dark:prose-invert prose-sm prose-slate max-w-none">
                                <h4>Materiale & Durabilitate</h4>
                                <ul>
                                    <li><strong>Blockout 650g:</strong> Material PVC flexibil și foarte rezistent, cu strat opac (negru) la interior, ideal pentru imprimarea față-verso fără ca imaginea de pe o parte să se vadă pe cealaltă.</li>
                                    <li><strong>Imprimare Eco-Solvent:</strong> Cerneluri rezistente la UV și apă, asigurând o durată de viață îndelungată la exterior.</li>
                                </ul>
                                <h4>Finisaje Incluse</h4>
                                <ul>
                                    <li><strong>Tiv de Rezistență:</strong> Toate bannerele sunt tivite pe margine pentru a preveni ruperea și a crește durabilitatea.</li>
                                    <li><strong>Capse Metalice:</strong> Inele metalice aplicate la aproximativ 50 cm distanță, pentru o instalare ușoară și sigură.</li>
                                    <li><strong>Găuri pentru Vânt (Opțional):</strong> Perforații speciale care permit vântului să treacă, reducând presiunea asupra bannerului și prelungind durata de viață în zonele expuse.</li>
                                </ul>
                                <h4>Specificații Grafică</h4>
                                <ul>
                                    <li>Formate acceptate: PDF, AI, CDR, TIFF, JPG.</li>
                                    <li>Rezoluție recomandată: Minimum 150 dpi la scara 1:1.</li>
                                    <li>Mod de culoare: CMYK.</li>
                                    <li>Puteți alege ca grafica să fie **Identică** sau **Diferită** pe cele două fețe.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}


            </div>
        </main>
    );
}


