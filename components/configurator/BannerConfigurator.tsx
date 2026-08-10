"use client";
// components/configurator/BannerConfigurator.tsx

import { NumberInput } from "./ui/NumberInput";
import React, { useMemo, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/ToastProvider";
import { Plus, Minus, ShoppingCart, Info, ChevronDown, X, UploadCloud, Image as ImageIcon, Ruler, AlertTriangle, Link as LinkIcon, PlayCircle, TrendingUp, Percent, MessageCircle, PencilRuler } from "lucide-react";
import DeliveryEstimation from "./DeliveryEstimation";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from 'next/link';
import FaqAccordion from "./FaqAccordion";
import Reviews from "../Reviews"; // Adjusted path
import DynamicBannerPreview from "./DynamicBannerPreview";
import ArtworkRatioPreview from "./ArtworkRatioPreview";

import dynamic from 'next/dynamic';
const RelatedProducts = dynamic(() => import('../RelatedProducts'), { ssr: false }); // Adjusted path and usage if needed
import {
    calculateBannerPrice,
    getBannerUpsell,
    BANNER_CONSTANTS,
    formatMoneyDisplay,
    roundMoney,
    type PriceInputBanner
} from "@/lib/pricing";
import { QA } from "@/types";

import useAbandonedCart from "@/hooks/useAbandonedCart";
import { useUserActivityTracking } from "@/hooks/useAbandonedCartCapture";
import { PopularDimensions } from "./PopularDimensions";
import QuickNav from "@/components/QuickNav";

/* --- SUB-COMPONENTS --- */
const AccordionStep = ({ stepNumber, title, summary, isOpen, onClick, children, isLast = false }: { stepNumber: number; title: string; summary: string; isOpen: boolean; onClick: () => void; children: React.ReactNode; isLast?: boolean; }) => (
    <div className="relative pl-12">
        <div className="absolute top-5 left-0 flex flex-col items-center h-full">
            <span className={`flex items-center justify-center w-8 h-8 rounded-full text-md font-bold transition-colors ${isOpen ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700 dark:text-gray-300'}`}>{stepNumber}</span>
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

const bannerFaqs: QA[] = [
    { question: "Ce materiale sunt disponibile?", answer: "Oferim Frontlit 440g (Standard) și Frontlit 510g (Premium), ambele fiind materiale PVC durabile, special concepute pentru uz exterior." },
    { question: "Ce finisaje sunt incluse?", answer: "Toate bannerele vin cu tiv de rezistență pe tot perimetrul și capse metalice de prindere, aplicate de obicei la o distanță de 50 cm una de cealaltă." },
    { question: "Cum trimit grafica pentru imprimare?", answer: "Puteți încărca fișierul grafic direct în configurator, în pasul 3. Acceptăm formate precum PDF, AI, CDR, TIFF sau JPG la o rezoluție bună." },
    { question: "Cât durează producția și livrarea?", answer: "Producția durează în mod normal 1-2 zile lucrătoare. Livrarea prin curier rapid mai adaugă încă 1-2 zile, în funcție de localitatea de destinație." },
    { question: "Bannerele sunt rezistente la exterior?", answer: "Da, absolut. Materialele folosite sunt special tratate pentru a rezista la apă, vânt și radiații UV, asigurând o durată de viață îndelungată." },
];

const ProductTabs = ({ productSlug }: { productSlug: string }) => {
    const [activeTab, setActiveTab] = useState("descriere");
    return (
        <div className="bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-gray-200 dark:border-slate-800">
            <nav className="border-b border-gray-200 dark:border-slate-800 flex">
                <TabButtonSEO active={activeTab === "descriere"} onClick={() => setActiveTab("descriere")}>Descriere</TabButtonSEO>
                <TabButtonSEO active={activeTab === "recenzii"} onClick={() => setActiveTab("recenzii")}>Recenzii</TabButtonSEO>
                <TabButtonSEO active={activeTab === "faq"} onClick={() => setActiveTab("faq")}>FAQ</TabButtonSEO>
            </nav>
            <div className="p-6">
                {activeTab === 'descriere' && (
                    <div className="prose dark:prose-invert max-w-none text-sm text-gray-600 dark:text-gray-400">
                        <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-2">Bannere Publicitare Outdoor (Frontlit)</h3>
                        <p className="mb-4">
                            <strong>Atrageți toate privirile cu bannere imprimate la rezoluție fotografică.</strong> Fie că dorești să anunți o promoție, o deschidere de magazin sau să îți faci brandul cunoscut, bannerele noastre personalizate sunt soluția ideală pentru vizibilitate maximă la un cost eficient.
                        </p>

                        <h4 className="text-slate-900 dark:text-white font-semibold mt-4 mb-2">Materiale & Calitate</h4>
                        <ul className="list-disc pl-5 space-y-1 mb-4">
                            <li><strong>Frontlit 440g (Standard):</strong> Un material PVC flexibil și economic, perfect pentru campanii pe termen scurt și mediu.</li>
                            <li><strong>Frontlit 510g (Premium):</strong> Varianta "Coated" (turnată), mult mai rezistentă la rupere și diferențe de temperatură (iarnă/vară), recomandată pentru expunere îndelungată.</li>
                        </ul>

                        <h4 className="text-slate-900 dark:text-white font-semibold mt-4 mb-2">De ce să alegi bannerele noastre?</h4>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Rezistență UV și Apă:</strong> Folosim cerneluri Eco-Solvent de ultimă generație care nu se decolorează.</li>
                            <li><strong>Finisaje Incluse:</strong> Tivul perimetral și capsele de prindere sunt incluse standard în preț.</li>
                            <li><strong>Orice Dimensiune:</strong> Putem realiza bannere de la mici dimensiuni până la formate gigant (prin termosudare).</li>
                        </ul>
                    </div>
                )}
                {activeTab === 'recenzii' && <Reviews productSlug={productSlug} />}
                {activeTab === 'faq' && <FaqAccordion qa={bannerFaqs} />}
            </div>
        </div>
    );
};

const TabButtonSEO = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (<button onClick={onClick} className={`flex-1 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${active ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 hover:border-gray-300'}`}>{children}</button>);

const ProductTabsIntegrated = ({ productSlug }: { productSlug: string }) => {
    const [activeTab, setActiveTab] = useState("recenzii");
    return (
        <div>
            <nav className="border-b border-gray-200 dark:border-slate-800 flex">
                <TabButtonSEO active={activeTab === "recenzii"} onClick={() => setActiveTab("recenzii")}>Recenzii</TabButtonSEO>
                <TabButtonSEO active={activeTab === "faq"} onClick={() => setActiveTab("faq")}>FAQ</TabButtonSEO>
            </nav>
            <div className="py-6">
                {activeTab === 'recenzii' && <Reviews productSlug={productSlug} />}
                {activeTab === 'faq' && <FaqAccordion qa={bannerFaqs} />}
            </div>
        </div>
    );
};

const meshFaqs: QA[] = [
    {
        question: "Ce este mesh-ul publicitar?",
        answer: "Plasă microperforată de 370 g/m² (țesătură 1.000 D × 1.000 D / 12 × 12), rezistentă la rupere și intemperii. Perforațiile lasă aerul să treacă — soluția potrivită pentru fațade mari, clădiri în reabilitare, garduri de șantier sau bannere suspendate.",
    },
    { question: "Ce finisaje sunt incluse?", answer: "Tiv perimetral și capse metalice de prindere, incluse în preț." },
    { question: "Cum trimit grafica?", answer: "Încărci fișierul în pasul Grafică (PDF, AI, CDR, TIFF sau JPG la rezoluție potrivită)." },
];

const MESH_PRESENTATION_VIDEO_ID = "1Y6osfnjqhM";

const MESH_GALLERY_IMAGES = [
    "/products/mesh/mesh_publicitar_personalizat.jpg",
    "/products/mesh/mesh_publicitar_tivcapse.jpg",
] as const;

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


function OptionButton({ active, onClick, title, subtitle }: { active: boolean; onClick: () => void; title: string; subtitle?: string; }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${active
                ? "border-slate-950 bg-emerald-50/50 ring-1 ring-slate-950 shadow-md"
                : "border-gray-200 dark:border-slate-800 bg-white hover:border-gray-300 hover:bg-slate-50 dark:bg-slate-800"
                }`}
        >
            <div className={`font-bold transition-colors ${active ? "text-emerald-500" : "text-gray-800"}`}>{title}</div>
            {subtitle && <div className={`text-xs mt-1 transition-colors ${active ? "text-slate-950/80" : "text-gray-500"}`}>{subtitle}</div>}
        </button>
    );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode; }) {
    return <button type="button" onClick={onClick} className={`px-4 py-2 text-sm font-semibold transition-colors rounded-t-lg ${active ? "border-b-2 border-slate-950 text-slate-950 bg-emerald-50" : "text-gray-500 hover:text-gray-800"}`}>{children}</button>;
}

type Props = { productSlug?: string; initialWidth?: number; initialHeight?: number; productImage?: string; renderOnlyConfigurator?: boolean; imageUrl?: string | null; intent?: string; productKind?: "banner" | "mesh" };

type ViewMode = 'gallery' | 'shape';

/* --- MAIN COMPONENT --- */
export default function BannerConfigurator({ productSlug, initialWidth: initW, initialHeight: initH, productImage, renderOnlyConfigurator = false, intent, productKind = "banner" }: Props) {
    const { addItem } = useCart();
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [input, setInput] = useState<PriceInputBanner>(() => {
        const pW = searchParams.get("w");
        const pH = searchParams.get("h");
        const pQ = searchParams.get("q");
        const pMat = searchParams.get("mat");
        const pWind = searchParams.get("wind");
        const pHem = searchParams.get("hem");
        const isMesh = productKind === "mesh";

        return {
            width_cm: pW ? parseFloat(pW) : (initW ?? 0),
            height_cm: pH ? parseFloat(pH) : (initH ?? 0),
            quantity: pQ ? parseInt(pQ) : 1,
            material: isMesh ? "mesh" : pMat === "510" ? "frontlit_510" : "frontlit_440",
            want_wind_holes: isMesh ? false : pWind === "1",
            want_hem_and_grommets: pHem !== "0",
            designOption: "upload"
        };
    });

    const [lengthText, setLengthText] = useState(input.width_cm ? String(input.width_cm) : "");
    const [heightText, setHeightText] = useState(input.height_cm ? String(input.height_cm) : "");

    const galleryImages = useMemo(() => {
        if (productKind === "mesh") {
            if (productImage) {
                const rest = MESH_GALLERY_IMAGES.filter((src) => src !== productImage);
                return [productImage, ...rest];
            }
            return [...MESH_GALLERY_IMAGES];
        }
        return productImage
            ? [productImage, "/products/banner/banner-1.webp", "/products/banner/banner-2.webp", "/products/banner/banner-3.webp"]
            : ["/products/banner/banner-1.webp", "/products/banner/banner-2.webp", "/products/banner/banner-3.webp", "/products/banner/banner-4.webp"];
    }, [productImage, productKind]);

    const [viewMode, setViewMode] = useState<ViewMode>(() => {
        const t = searchParams.get('tab');
        if (t === 'shape') return 'shape';
        return 'gallery';
    });

    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [activeImage, setActiveImage] = useState<string>(galleryImages[0]);
    const [videoOpen, setVideoOpen] = useState(false);
    const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const [textDesign, setTextDesign] = useState<string>("");
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(1);
    const [activeProductTab, setActiveProductTab] = useState("descriere");
    const toast = useToast();

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
            if (intent === 'de-vanzare' || intent === 'de-inchiriat') {
                updateInput('width_cm', 200);
                updateInput('height_cm', 100);
                setLengthText("200");
                setHeightText("100");
                setTextDesign(intent === 'de-vanzare' ? "DE VÂNZARE" : "DE ÎNCHIRIAT");
                updateInput('designOption', 'text_only');
            } else if (intent === 'capse-dese') {
                updateInput('want_hem_and_grommets', true);
            } else if (intent === 'buzunare') {
                updateInput('want_hem_and_grommets', false);
            } else if (intent === 'santier') {
                if (productKind !== "mesh") {
                    updateInput("material", "frontlit_510");
                }
                setTextDesign("ȘANTIER ÎN LUCRU\nAccesul Interzis!");
                updateInput("designOption", "text_only");
            }
        }
    }, [productImage, initW, initH, intent, productKind]);

    // Email marketing hooks
    const [userEmail, setUserEmail] = useState<string>("");

    const priceData = useMemo(() => calculateBannerPrice(input), [input]);
    const displayedTotal = priceData.finalPrice;

    // Auto-capture abandoned carts
    const cartData = useMemo(() => ({
        configuratorId: productKind === "mesh" ? "mesh" : "banner",
        email: userEmail,
        configuration: { ...input, artworkUrl, textDesign },
        price: displayedTotal,
        quantity: input.quantity
    }), [userEmail, input, artworkUrl, textDesign, displayedTotal, productKind]);

    useUserActivityTracking(cartData);

    // --- UPSELL LOGIC (NOU: Centralizat) ---
    const upsellOpportunity = useMemo(() => {
        return getBannerUpsell(input);
    }, [input]);

    const updateInput = <K extends keyof PriceInputBanner>(k: K, v: PriceInputBanner[K]) => setInput((p) => ({ ...p, [k]: v }));
    const setQty = (v: number) => updateInput("quantity", Math.max(1, Math.floor(v)));

    // --- FUNCTII NOI PENTRU INPUT FLEXIBIL (Decimal) ---
    const handleDimChange = (val: string, setter: (v: string) => void, field: "width_cm" | "height_cm") => {
        // Permite cifre și un singur punct sau virgulă (convertit în punct)
        let v = val.replace(/,/g, '.');

        // Validăm doar caracterele permise, dar lăsăm userul să scrie (ex "10." e valid temporar)
        if (!/^[0-9]*\.?[0-9]*$/.test(v)) {
            return; // Ignoră caracterele invalide
        }

        setter(v); // Actualizăm UI-ul imediat

        const num = parseFloat(v);
        // Actualizăm prețul doar dacă e număr valid
        if (!isNaN(num)) {
            updateInput(field, num);
            if (num > 0) setViewMode('shape');
        } else if (v === "") {
            updateInput(field, 0);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams();
            if (input.width_cm > 0) params.set("w", input.width_cm.toString());
            if (input.height_cm > 0) params.set("h", input.height_cm.toString());
            if (input.quantity > 1) params.set("q", input.quantity.toString());
            if (productKind === "mesh") {
                params.set("mat", "mesh");
            } else if (input.material === "frontlit_510") {
                params.set("mat", "510");
            }
            if (input.want_wind_holes) params.set("wind", "1");
            if (!input.want_hem_and_grommets) params.set("hem", "0");

            // Keep existing params just in case (like image)
            // Actually replace might wipe them if not careful, but we only set specific keys
            // It's safer to merge with existing searchParams but `pathname` + new `params` string replaces everything.
            // Let's preserve image param if it exists in current URL
            const current = new URLSearchParams(window.location.search);
            if (current.has('image')) params.set('image', current.get('image')!);
            if (current.has('title')) params.set('title', current.get('title')!);
            if (current.has('step')) params.set('step', current.get('step')!);
            if (current.has('intent')) params.set('intent', current.get('intent')!);

            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        }, 500);

        return () => clearTimeout(timer);
    }, [input, pathname, router, productKind]);

    // EFFECT MOCKUP PREDEFINIT
    useEffect(() => {
        if (productImage) {
            setActiveImage(productImage);
            // Setăm imaginea ca artwork pentru a fi vizibilă în preview ca "grafică selectată"
            setArtworkUrl(productImage);
            // Opțional: setăm designOption pe 'upload' implicit pentru a arăta că există deja o grafică,
            // deși tehnic e "predefinită", se comportă ca un fișier uploadat
            setInput(prev => ({ ...prev, designOption: 'upload' }));
        }
    }, [productImage]);

    const handleArtworkFileInput = async (file: File | null) => {
        setArtworkUrl(null);
        setUploadError(null);

        if (!file) return;
        try {
            const previewUrl = URL.createObjectURL(file);
            setArtworkUrl(previewUrl);
            setViewMode('gallery');
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
        if (!input.width_cm || !input.height_cm) {
            toast?.warning("Te rugăm să completezi lungimea și înălțimea.");
            return;
        }
        if (displayedTotal <= 0) {
            toast?.warning("Prețul trebuie calculat înainte de a adăuga în coș.");
            return;
        }
        const unitPrice = roundMoney(displayedTotal / input.quantity);
        const pid = productKind === "mesh" ? "mesh" : productSlug ?? "banner";
        const uniqueId = `${pid}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        const title =
            productKind === "mesh"
                ? `Mesh publicitar - ${input.width_cm}x${input.height_cm} cm`
                : `Banner personalizat - ${input.width_cm}x${input.height_cm} cm`;

        addItem({
            id: uniqueId,
            productId: productKind === "mesh" ? productSlug ?? "mesh" : productSlug ?? "banner-generic",
            slug: productKind === "mesh" ? productSlug ?? "mesh" : productSlug ?? "generic-banner",
            title,
            width: input.width_cm,
            height: input.height_cm,
            price: unitPrice,
            quantity: input.quantity,
            currency: "RON",
            metadata: {
                "Material":
                    productKind === "mesh"
                        ? "Mesh microperforat"
                        : input.material === "frontlit_510"
                          ? "Frontlit 510g (Premium)"
                          : "Frontlit 440g (Standard)",
                "Finisaje":
                    productKind === "mesh"
                        ? "Tiv și capse (inclus)"
                        : `Tiv și capse, ${input.want_wind_holes ? "cu găuri de vânt" : "fără găuri de vânt"}`,
                "Grafică": input.designOption === 'pro' ? 'Vreau grafică' : input.designOption === 'text_only' ? 'Doar text' : 'Grafică proprie',
                designOption: input.designOption,
                ...(input.designOption === 'pro' && { "Cost grafică": formatMoneyDisplay(BANNER_CONSTANTS.PRO_DESIGN_FEE) }),
                // Trimitem artworkUrl și textDesign pentru salvare în DB (backend le extrage)
                artworkUrl,
                textDesign: input.designOption === 'text_only' ? textDesign : undefined,
            },
        });
    }

    useEffect(() => {
        if (viewMode !== 'gallery' || artworkUrl) return;
        const id = setInterval(() => {
            setActiveIndex((i) => {
                const next = (i + 1) % galleryImages.length;
                setActiveImage(galleryImages[next]);
                return next;
            });
        }, 3000);
        return () => clearInterval(id);
    }, [galleryImages, viewMode, artworkUrl]);

    const canAdd = displayedTotal > 0 && input.width_cm > 0 && input.height_cm > 0;
    const summaryStep1 = input.width_cm > 0 && input.height_cm > 0 ? `${input.width_cm}×${input.height_cm} cm, ${input.quantity} buc.` : "Alege dimensiuni";
    const summaryStep2 =
        productKind === "mesh"
            ? "Mesh microperforat, tiv și capse"
            : `${input.material === "frontlit_510" ? "Premium" : "Standard"}, ${input.want_wind_holes ? "cu găuri de vânt" : "fără găuri de vânt"}`;
    const summaryStep3 = input.designOption === 'upload' ? 'Grafică proprie' : input.designOption === 'text_only' ? 'Doar text' : 'Design Pro';

    return (
        <main className={renderOnlyConfigurator ? "" : "bg-slate-50 dark:bg-slate-800 min-h-screen"}>
            {/* Container cu padding responsive */}
            <div className={`container mx-auto ${renderOnlyConfigurator ? 'px-0' : 'px-4'} py-6 lg:py-16`}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

                    {/* STÂNGA - ZONA VIZUALĂ */}
                    <div className="lg:sticky top-24 h-max space-y-6 lg:space-y-8">
                        <div className="bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-gray-200 dark:border-slate-800 overflow-hidden">


                            {/* TABS VIEW MODE */}
                            <div className="flex border-b border-gray-100 overflow-x-auto">
                                <button
                                    onClick={() => setViewMode('gallery')}
                                    className={`flex-1 py-3 min-w-20 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${viewMode === 'gallery' ? 'text-emerald-600 bg-emerald-50 border-b-2 border-emerald-600' : 'text-gray-500 hover:bg-slate-50 dark:bg-slate-800'}`}
                                >
                                    <ImageIcon size={16} />
                                    <span className="hidden sm:inline">Galerie</span>
                                </button>
                                <button
                                    onClick={() => setViewMode('shape')}
                                    className={`flex-1 py-3 min-w-20 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${viewMode === 'shape' ? 'text-emerald-600 bg-emerald-50 border-b-2 border-emerald-600' : 'text-gray-500 hover:bg-slate-50 dark:bg-slate-800'}`}
                                >
                                    <Ruler size={16} />
                                    <span className="hidden sm:inline">Schiță Tehnică</span>
                                </button>
                            </div>

                            {/* ZONA IMAGINE / SCHIȚĂ */}
                            <div className={`relative bg-white flex items-center justify-center aspect-square w-full`}>
                                {viewMode === 'gallery' && (
                                    <div className="relative w-full h-full flex items-center justify-center p-4">
                                        {/* Dacă avem imagine de produs (predefinită), o afișăm direct */}
                                        {productImage ? (
                                            <Image 
                                                src={productImage} 
                                                alt="Banner" 
                                                fill
                                                className="object-contain animate-in fade-in duration-300" 
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                                priority
                                            />
                                        ) : artworkUrl ? (
                                            <Image 
                                                src={artworkUrl} 
                                                alt="Grafică Încărcată" 
                                                fill
                                                className="object-contain animate-in fade-in duration-300 shadow-md rounded-lg" 
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                                priority
                                            />
                                        ) : (
                                            <Image 
                                                src={activeImage} 
                                                alt="Banner" 
                                                fill
                                                className="object-cover animate-in fade-in duration-300" 
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                                priority
                                            />
                                        )}

                                        {productKind === "mesh" && (
                                            <div className="absolute bottom-4 right-4 z-30">
                                                <button
                                                    type="button"
                                                    onClick={() => setVideoOpen(true)}
                                                    aria-label="Vezi video prezentare mesh"
                                                    className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-bold shadow-lg hover:bg-red-700 transform hover:-translate-y-0.5 transition-all"
                                                >
                                                    <PlayCircle className="w-5 h-5 text-white" />
                                                    <span>Vezi Video Prezentare</span>
                                                </button>
                                            </div>
                                        )}

                                    </div>
                                )}

                                {viewMode === 'shape' && (
                                    <div className="h-full w-full p-4 animate-in fade-in slide-in-from-bottom-4 duration-300 bg-zinc-50 flex items-center justify-center">
                                        <DynamicBannerPreview
                                            width={input.width_cm}
                                            height={input.height_cm}
                                            hasGrommets={input.want_hem_and_grommets}
                                            hasWindHoles={productKind === "mesh" ? false : input.want_wind_holes}
                                            previewVariant={productKind === "mesh" ? "mesh" : "solid"}
                                            imageUrl={null}
                                        />
                                        <div className="absolute bottom-4 left-0 w-full text-center text-xs text-gray-400">
                                            Vizualizare tehnică (cote și finisaje)
                                        </div>
                                    </div>
                                )}


                            </div>

                            {/* THUMBNAILS GALERIE (Visible only in gallery mode) */}
                            {!productImage && viewMode === 'gallery' && (
                                <div className="p-2 grid grid-cols-4 gap-2 border-t border-gray-100">
                                    {galleryImages.map((src, i) => (
                                        <button
                                            key={src}
                                            onClick={() => {
                                                setActiveImage(src);
                                                setActiveIndex(i);
                                                if (artworkUrl) setArtworkUrl(null);
                                            }}
                                            className={`relative rounded-lg aspect-square overflow-hidden ${activeIndex === i && !artworkUrl ? "ring-2 ring-offset-2 ring-emerald-500" : "hover:opacity-80"}`}
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
                            )}
                        </div>
                    </div>

                    {/* DREAPTA - CONFIGURATOR */}
                    <div className={`${renderOnlyConfigurator ? 'w-full' : 'px-4 sm:px-0 w-full'}`}>
                        {!renderOnlyConfigurator && (
                            <header className="mb-6 sm:mb-8">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3 sm:mb-4">
                                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                                        {productKind === "mesh" ? "Configurator Mesh" : "Configurator Banner"}
                                    </h2>
                                    <BannerModeSwitchInline />
                                </div>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                                    <p className="text-xs sm:text-base text-gray-600 dark:text-gray-400">Personalizează opțiunile în 3 pași simpli.</p>
                                    <button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline inline-flex items-center text-sm px-3 py-2 min-h-10 touch-manipulation">
                                        <Info size={16} />
                                        <span className="ml-2">Detalii</span>
                                    </button>
                                </div>
                            </header>
                        )}
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-gray-200 dark:border-slate-800 px-3 sm:px-4">
                            <AccordionStep stepNumber={1} title="Dimensiuni & Cantitate" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                                {/* OPTIMIZARE MOBIL: Grid responsiv pentru dimensiuni */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 px-1">Lungime (cm)</label>
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            value={lengthText}
                                            onFocus={(e) => e.target.select()}
                                            onChange={(e) => handleDimChange(e.target.value, setLengthText, "width_cm")}
                                            placeholder="200"
                                            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm text-lg font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 px-1">Înălțime (cm)</label>
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            value={heightText}
                                            onFocus={(e) => e.target.select()}
                                            onChange={(e) => handleDimChange(e.target.value, setHeightText, "height_cm")}
                                            placeholder="100"
                                            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm text-lg font-medium"
                                        />
                                    </div>
                                    <div className="col-span-1 sm:col-span-2">
                                        <NumberInput label="Cantitate" value={input.quantity} onChange={setQty} />

                                        {/* --- UPSELL ALERT (NOU: Folosește logica centralizată) --- */}
                                        {upsellOpportunity && (
                                            <div
                                                className="mt-3 p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-lg cursor-pointer hover:bg-amber-100 transition-colors flex gap-2 sm:gap-3 items-start touch-manipulation"
                                                onClick={() => updateInput("quantity", upsellOpportunity.requiredQty)}
                                            >
                                                <TrendingUp className="text-amber-600 w-5 h-5 mt-0.5 shrink-0" />
                                                <div>
                                                    <p className="text-sm text-amber-900 font-bold">
                                                        Reducere de Volum Disponibilă!
                                                    </p>
                                                    <p className="text-xs text-amber-800 mt-1">
                                                        Dacă alegi <strong>{upsellOpportunity.requiredQty} buc</strong>, prețul scade la <strong>{formatMoneyDisplay(upsellOpportunity.newUnitPrice)}/buc</strong>.
                                                        <span className="block mt-0.5 font-semibold text-amber-700">
                                                            Economisești {upsellOpportunity.discountPercent}% la prețul per unitate!
                                                        </span>
                                                    </p>
                                                </div>
                                                <div className="ml-auto flex flex-col justify-center items-center bg-white rounded-lg px-2 py-1 shadow-sm border border-amber-100">
                                                    <Percent className="w-4 h-4 text-amber-600 mb-0.5" />
                                                    <span className="text-xs font-bold text-amber-600">-{upsellOpportunity.discountPercent}%</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </AccordionStep>
                            <AccordionStep stepNumber={2} title="Material & Finisaje" summary={summaryStep2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)}>
                                {productKind === "mesh" ? (
                                    <>
                                        <div className="mb-4 p-3 sm:p-4 bg-emerald-50/60 dark:bg-emerald-950/25 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                                            <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">Mesh microperforat — 370 g/m²</p>
                                            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                                                Țesătură 1.000 D × 1.000 D / 12 × 12. Rezistent la rupere, vânt, ploaie și soare.
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                                Perforațiile permit trecerea aerului — recomandat la panouri foarte mari, fațade în reabilitare și bannere suspendate.
                                            </p>
                                        </div>
                                        <div className="mb-4 p-3 sm:p-4 bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-800 rounded-lg">
                                            <p className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200">
                                                Finisaje incluse: tiv perimetral și capse metalice de prindere.
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <label className="field-label mb-2 text-sm sm:text-base">Material</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                            <OptionButton active={input.material === "frontlit_440"} onClick={() => updateInput("material", "frontlit_440")} title="Frontlit 440g" subtitle="Standard" />
                                            <OptionButton active={input.material === "frontlit_510"} onClick={() => updateInput("material", "frontlit_510")} title="Frontlit 510g" subtitle="Premium" />
                                        </div>
                                        <div className="mb-4 p-3 sm:p-4 bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-800 rounded-lg">
                                            <p className="text-xs sm:text-sm font-semibold text-gray-800">
                                                Finisaje Standard: Tiv perimetral și capse metalice de prindere (incluse în preț).
                                            </p>
                                        </div>
                                        <label className="flex items-center gap-3 py-2 cursor-pointer touch-manipulation">
                                            <input type="checkbox" className="checkbox w-5 h-5" checked={input.want_wind_holes} onChange={(e) => updateInput("want_wind_holes", e.target.checked)} />
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Adaugă găuri de vânt</span>
                                        </label>
                                    </>
                                )}
                            </AccordionStep>
                            <AccordionStep stepNumber={3} title="Grafică" summary={summaryStep3} isOpen={activeStep === 3} onClick={() => setActiveStep(3)} isLast={true}>
                                <div>
                                    {/* Editor Online button removed from here, moved to tabs below */}

                                    {productImage ? (
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-20 h-20 rounded-lg bg-white p-1 border border-slate-200 shadow-sm shrink-0 relative overflow-hidden">
                                                    <Image 
                                                        src={productImage} 
                                                        alt="Model" 
                                                        fill
                                                        className="object-cover rounded" 
                                                        sizes="80px"
                                                    />
                                                </div>
                                                <div>
                                                    <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-xs font-bold mb-1">MODEL SELECTAT</span>
                                                    <p className="font-bold text-slate-800 dark:text-slate-200 text-sm leading-tight mb-1">Imagine selectată din galerie</p>
                                                    <p className="text-xs text-slate-500">Vom imprima acest model.</p>
                                                </div>
                                            </div>

                                            <div className="border-t border-slate-200 pt-3">
                                                <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Vrei să schimbi grafica?</p>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => updateInput("designOption", "upload")}
                                                        className={`flex-1 py-2 px-3 rounded-lg border text-sm font-semibold transition-colors ${input.designOption === 'upload' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-slate-50 dark:bg-slate-800'}`}
                                                    >
                                                        Încărcare Fișier
                                                    </button>
                                                    <button
                                                        onClick={() => { setArtworkUrl(null); updateInput("designOption", "text_only"); }}
                                                        className={`flex-1 py-2 px-3 rounded-lg border text-sm font-semibold transition-colors ${input.designOption === 'text_only' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-slate-50 dark:bg-slate-800'}`}
                                                    >
                                                        Doar Text
                                                    </button>
                                                </div>
                                                {input.designOption !== 'upload' && input.designOption !== 'text_only' && (
                                                    <p className="text-xs text-slate-400 mt-2 italic">Selectează o opțiune de mai sus pentru a înlocui modelul standard.</p>
                                                )}
                                            </div>

                                            {/* CONDITIONAL RENDER FOR OVERRIDE OPTIONS */}
                                            {(input.designOption === 'upload' || input.designOption === 'text_only') && (
                                                <div className="mt-4 pt-4 border-t border-slate-200 animate-fade-in-up">
                                                    {input.designOption === 'upload' && (
                                                        <div className="space-y-3">
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Încarcă fișierul tău nou:</p>
                                                            <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                                                                <span className="flex items-center space-x-2"><UploadCloud className="w-6 h-6 text-gray-600 dark:text-gray-400" /><span className="font-medium text-gray-600 dark:text-gray-400">Apasă pentru a încărca</span></span>
                                                                <input type="file" name="file_upload" className="hidden" onChange={e => handleArtworkFileInput(e.target.files?.[0] ?? null)} />
                                                            </label>
                                                            {uploading && <p className="text-sm text-emerald-600">Se încarcă...</p>}
                                                            {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
                                                            {artworkUrl && !uploadError && <p className="text-sm text-green-600 font-semibold">Fișier nou încărcat cu succes!</p>}
                                                        </div>
                                                    )}

                                                    {input.designOption === 'text_only' && (
                                                        <div className="space-y-3">
                                                            <label className="field-label">Introdu textul nou:</label>
                                                            <textarea className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm text-base min-h-24 text-gray-800 bg-white" rows={3} value={textDesign} onChange={e => setTextDesign(e.target.value)} placeholder="Ex: NOUL TEXT AICI..."></textarea>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex -mb-px overflow-x-auto no-scrollbar">
                                                <TabButton active={input.designOption === 'upload'} onClick={() => updateInput("designOption", 'upload')}>Am Grafică</TabButton>
                                                <TabButton active={input.designOption === 'text_only'} onClick={() => { setArtworkUrl(null); updateInput("designOption", 'text_only'); }}>Doar Text</TabButton>
                                                <TabButton active={input.designOption === 'pro'} onClick={() => updateInput("designOption", 'pro')}>Vreau Grafică</TabButton>
                                                <Link 
                                                    href={`/editor?w=${input.width_cm}&h=${input.height_cm}&product=banner`}
                                                    className="px-4 py-2 text-sm font-bold transition-all rounded-t-lg bg-orange-600 text-white hover:bg-orange-700 flex items-center gap-2 shrink-0 ml-auto"
                                                >
                                                    <PencilRuler size={14} />
                                                    Editor Online
                                                </Link>
                                            </div>

                                            {input.designOption === 'upload' && (
                                                <div className="space-y-3">
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">Încarcă fișierul tău (PDF, JPG, TIFF, etc.).</p>
                                                    <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none active:bg-slate-50 dark:bg-slate-800">
                                                        <span className="flex items-center space-x-2">
                                                            <UploadCloud className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                                                            <span className="font-medium text-gray-600 dark:text-gray-400">Apasă pentru a încărca</span>
                                                        </span>
                                                        <input type="file" name="file_upload" className="hidden" onChange={e => handleArtworkFileInput(e.target.files?.[0] ?? null)} />
                                                    </label>
                                                    {uploading && <p className="text-sm text-emerald-600">Se încarcă...</p>}
                                                    {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
                                                    {artworkUrl && !uploadError && <p className="text-sm text-green-600 font-semibold">Grafică încărcată cu succes!</p>}
                                                </div>
                                            )}

                                            {input.designOption === 'text_only' && (
                                                <div className="space-y-3">
                                                    <label className="field-label text-sm sm:text-base">Introdu textul dorit</label>
                                                    <textarea className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm text-base min-h-24 text-gray-800 bg-white touch-manipulation" rows={3} value={textDesign} onChange={e => setTextDesign(e.target.value)} placeholder="ex: PROMOTIE, REDUCERI, etc."></textarea>
                                                </div>
                                            )}

                                            {input.designOption === 'pro' && (
                                                <div className="p-3 sm:p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-800">
                                                    <p className="font-semibold">Serviciu de Grafică Profesională</p>
                                                    <p>Vei primi pe email o simulare pentru confirmare. Cost: <strong>{formatMoneyDisplay(BANNER_CONSTANTS.PRO_DESIGN_FEE)}</strong>.</p>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </AccordionStep>
                        </div>

                        {/* BARĂ STATICĂ JOS */}
                        <div className="relative bg-white border lg:rounded-2xl lg:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border-gray-200 dark:border-slate-800 p-3 sm:p-4 lg:p-6 mt-8 mb-24 lg:mb-0">
                            <div className="flex flex-col gap-3">
                                <button onClick={handleAddToCart} className="w-full py-4 text-lg font-bold bg-emerald-600 text-white rounded-xl shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-emerald-500/20">
                                    <ShoppingCart size={24} className="shrink-0" />
                                    <span>Adaugă în Coș</span>
                                </button>
                                <div className="flex flex-row justify-between items-center w-full gap-2 pt-2 mt-1 border-t border-gray-100">
                                    <div className="flex flex-col items-start leading-none">
                                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Preț Total</span>
                                        <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{formatMoneyDisplay(displayedTotal)}</span>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <DeliveryEstimation />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* STICKY BOTTOM BAR FOR MOBILE */}
                        <div className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 pb-safe animate-in slide-in-from-bottom duration-300 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)]">
                            <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
                                <div className="flex flex-col leading-none">
                                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Total Plată</span>
                                    <span className="text-xl font-black text-slate-900 dark:text-white">{formatMoneyDisplay(displayedTotal)}</span>
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
                        <div className="mt-4 lg:mt-6 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 text-center font-medium">Ai nevoie de ajutor sau o ofertă personalizată?</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <a
                                    href={`https://wa.me/40750473111?text=${encodeURIComponent(productKind === "mesh" ? "Mă interesează configuratorul mesh" : "Mă interesează configuratorul banner")}`}
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



                {/* SECȚIUNE DESCRIERE & FEATURES - FULL WIDTH JOS */}
                <div className="mt-8 lg:mt-12 bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-gray-200 dark:border-slate-800">
                    {/* TABURI SUS */}
                    <nav className="border-b border-gray-200 dark:border-slate-800 flex">
                        <TabButtonSEO active={activeProductTab === "descriere"} onClick={() => setActiveProductTab("descriere")}>Descriere</TabButtonSEO>
                        <TabButtonSEO active={activeProductTab === "recenzii"} onClick={() => setActiveProductTab("recenzii")}>Recenzii</TabButtonSEO>
                        <TabButtonSEO active={activeProductTab === "faq"} onClick={() => setActiveProductTab("faq")}>FAQ</TabButtonSEO>
                    </nav>

                    <div className="p-6 lg:p-8">
                        {/* TAB DESCRIERE */}
                        {activeProductTab === 'descriere' && (
                            <>
                                {productKind === "mesh" ? (
                                    <>
                                        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-4">Mesh publicitar</h2>
                                        <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed text-base lg:text-lg">
                                            Print color la dimensiuni mari, cu tiv și capse incluse. Material de 370 g/m², conceput pentru montaj prelungit la exterior.
                                        </p>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Rezistență la rupere</h3>
                                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                                                    Gramaj <strong>370 g/m²</strong> și densitate de țesătură <strong>1.000 D × 1.000 D / 12 × 12</strong> — face față cu brio tensiunilor mecanice și intemperiilor (vânt, ploaie, soare).
                                                </p>
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 mt-6">Design anti-vânt</h3>
                                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                                    Microperforațiile permit trecerea aerului și a unei părți din lumină, reducând presiunea pe structura de prindere. Soluția sigură pentru panouri publicitare uriașe, acoperirea clădirilor în reabilitare sau bannere stradale suspendate.
                                                </p>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Unde îl folosești</h3>
                                                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                                                    <li className="flex items-start">
                                                        <span className="text-emerald-600 font-bold mr-2 mt-1">•</span>
                                                        <span>Fațade și panouri publicitare de mari dimensiuni</span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <span className="text-emerald-600 font-bold mr-2 mt-1">•</span>
                                                        <span>Clădiri în reabilitare — mesh pe schele</span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <span className="text-emerald-600 font-bold mr-2 mt-1">•</span>
                                                        <span>Garduri de șantier și bannere suspendate pe stradă</span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <span className="text-emerald-600 font-bold mr-2 mt-1">✓</span>
                                                        <span><strong>Finisaje incluse:</strong> tiv perimetral și capse de prindere</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-4">Bannere Publicitare Outdoor (Frontlit)</h2>
                                        <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed text-base lg:text-lg">
                                            Atrageți toate privirile cu bannere imprimate la rezoluție fotografică. Fie că dorești să anunți o promoție, o deschidere de magazin sau să îți faci brandul cunoscut, bannerele noastre personalizate sunt soluția ideală pentru vizibilitate maximă la un cost eficient.
                                        </p>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Materiale & Calitate</h3>
                                                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                                                    <li className="flex items-start">
                                                        <span className="text-emerald-600 font-bold mr-2 mt-1">•</span>
                                                        <span><strong>Frontlit 440g (Standard):</strong> Un material PVC flexibil și economic, perfect pentru campanii pe termen scurt și mediu.</span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <span className="text-emerald-600 font-bold mr-2 mt-1">•</span>
                                                        <span><strong>Frontlit 510g (Premium):</strong> Varianta "Coated" (turnată), mult mai rezistentă la rupere și diferențe de temperatură (iarnă/vară), recomandată pentru expunere îndelungată.</span>
                                                    </li>
                                                </ul>
                                            </div>

                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">De ce să alegi bannerele noastre?</h3>
                                                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                                                    <li className="flex items-start">
                                                        <span className="text-emerald-600 font-bold mr-2 mt-1">✓</span>
                                                        <span><strong>Rezistență UV și Apă:</strong> Folosim cerneluri Eco-Solvent de ultimă generație care nu se decolorează.</span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <span className="text-emerald-600 font-bold mr-2 mt-1">✓</span>
                                                        <span><strong>Finisaje Incluse:</strong> Tivul perimetral și capsele de prindere sunt incluse standard în preț.</span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <span className="text-emerald-600 font-bold mr-2 mt-1">✓</span>
                                                        <span><strong>Orice Dimensiune:</strong> Putem realiza bannere de la mici dimensiuni până la formate gigant (prin termosudare).</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-6 border-b border-gray-200 dark:border-slate-800">
                                    <div className="flex items-start gap-4">
                                        <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-purple-600 flex items-center justify-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)]">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Print UV Full-Color</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Imprimare fotografică de înaltă rezoluție</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)]">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Rezistent Ploaie & Soare</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Material Frontlit tratat UV</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)]">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Orice Dimensiune</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">De la mici la formate gigant</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)]">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Livrare Rapidă</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Producție și expediere în 24-48h</p>
                                        </div>
                                    </div>

                                </div>

                                <div className="bg-emerald-50 rounded-xl p-6 sm:p-8 border border-emerald-100 flex flex-col md:flex-row items-center gap-6 justify-between mt-8">
                                    <div className="flex-1 text-center md:text-left">
                                        <h4 className="text-emerald-900 text-xl font-black mb-2 flex items-center justify-center md:justify-start gap-3">
                                            <MessageCircle className="w-6 h-6 text-emerald-600" />
                                            Ai întrebări tehnice sau proiecte giganți?
                                        </h4>
                                        <p className="text-emerald-800/80 font-medium">
                                            Suntem aici să te ajutăm! Contactează-ne direct pe WhatsApp pentru consultanță rapidă, prețuri pentru formate atipice sau suport grafic.
                                        </p>
                                    </div>
                                    <a
                                        href="https://wa.me/40750473111?text=Buna%20ziua!%20Am%20o%20intrebare%20despre%20bannere..."
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="shrink-0 flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 hover:-translate-y-1 transition-all uppercase tracking-wider"
                                    >
                                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.29-4.143c1.559.925 3.31 1.411 5.099 1.412 5.484 0 9.947-4.463 9.949-9.947 0-2.659-1.036-5.158-2.915-7.038-1.88-1.88-4.379-2.915-7.037-2.915-5.485 0-9.95 4.463-9.952 9.948-.001 1.932.553 3.82 1.605 5.421l-.992 3.626 3.71-.973zm11.334-6.203c-.308-.154-1.822-.899-2.104-.1002-.284-.102-.488-.254-.718-.102-.232.152-.916.899-1.123 1.144-.207.244-.414.275-.722.121-.308-.154-1.301-.48-2.479-1.531-.917-.818-1.536-1.83-1.715-2.138-.179-.308-.019-.475.135-.628.14-.138.308-.359.461-.538.154-.179.206-.308.308-.513.102-.206.051-.385-.026-.538-.077-.154-.718-1.731-.984-2.372-.259-.623-.524-.538-.722-.548-.198-.011-.424-.013-.651-.013-.226 0-.594.085-.904.424-.309.339-1.183 1.157-1.183 2.822 0 1.666 1.213 3.273 1.383 3.498.17.226 2.387 3.646 5.783 5.11 3.396 1.464 3.396.976 4.013.917.617-.06 1.822-.744 2.08-.1426.258-.702.258-1.303.181-1.426-.077-.123-.284-.198-.592-.352z" />
                                        </svg>
                                        Vorbește cu un specialist
                                    </a>
                                </div>
                            </>
                        )}

                        {/* TAB RECENZII */}
                        {activeProductTab === 'recenzii' && (
                            <Reviews productSlug={productSlug ?? (productKind === "mesh" ? "mesh" : "banner-generic")} />
                        )}

                        {/* TAB FAQ */}
                        {activeProductTab === 'faq' && (
                            <FaqAccordion qa={productKind === "mesh" ? meshFaqs : bannerFaqs} />
                        )}
                    </div>
                </div>
            </div>



            {/* NAVIGARE RAPIDĂ (ÎNTRE DESCRIERE ȘI RELATED) */}
            <div className="container mx-auto px-4 mt-12 mb-8">
                <QuickNav title="Vrei să personalizezi alt produs?" />
            </div>

            {/* Related Products Section */}
            <RelatedProducts category="bannere" />

            {videoOpen && productKind === "mesh" && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300"
                    onClick={() => setVideoOpen(false)}
                >
                    <div
                        className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="absolute top-4 right-4 text-white/70 hover:text-white z-20 bg-black/60 hover:bg-black/80 rounded-full p-2 transition-all backdrop-blur-sm"
                            onClick={() => setVideoOpen(false)}
                            aria-label="Închide video"
                        >
                            <X size={24} />
                        </button>
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube-nocookie.com/embed/${MESH_PRESENTATION_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
                            title="Video prezentare mesh publicitar"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                        />
                    </div>
                </div>
            )}
        </main>
    );
}


