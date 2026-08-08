"use client";
// components/BannerConfigurator.tsx

import { NumberInput } from "@/components/ui/NumberInput";
import React, { useMemo, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/ToastProvider";
import { Plus, Minus, ShoppingCart, Info, ChevronDown, X, UploadCloud, Image as ImageIcon, Ruler, AlertTriangle, Link as LinkIcon, PlayCircle, TrendingUp, Percent, MessageCircle, PencilRuler } from "lucide-react";
import DeliveryEstimation from "./DeliveryEstimation";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from 'next/link';
import FaqAccordion from "./FaqAccordion";
import Reviews from "./Reviews";
import DynamicBannerPreview from "./DynamicBannerPreview";
import ArtworkRatioPreview from "./ArtworkRatioPreview";

import dynamic from 'next/dynamic';
const RelatedProducts = dynamic(() => import('./RelatedProducts'), { ssr: false });
import {
  calculateBannerPrice,
  getBannerUpsell, // <--- IMPORT NOU: Logica centralizată
  BANNER_CONSTANTS,
  formatMoneyDisplay,
  roundMoney,
  type PriceInputBanner
} from "@/lib/pricing";
import { QA } from "@/types";
import MobilePriceBar from "./MobilePriceBar";

import useAbandonedCart from "@/hooks/useAbandonedCart";
import { useUserActivityTracking } from "@/hooks/useAbandonedCartCapture";
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
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-800">
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

function BannerModeSwitchInline() {
  const pathname = usePathname() || "";
  const isVerso = pathname.includes("banner-verso");
  const isMesh = pathname.includes("/mesh");
  const isFace = !isVerso && !isMesh && pathname.includes("/banner");

  return (
    <div className="inline-flex flex-wrap gap-1 rounded-lg border border-gray-300 bg-white p-1 shadow-sm">
      <Link
        href="/banner"
        className={`px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all inline-flex items-center justify-center ${isFace ? "bg-emerald-600 text-white shadow-md" : "text-gray-600 dark:text-gray-400 hover:bg-slate-50 dark:bg-slate-800"}`}
      >
        O față
      </Link>
      <Link
        href="/banner-verso"
        className={`px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all inline-flex items-center justify-center ${isVerso ? "bg-emerald-600 text-white shadow-md" : "text-gray-600 dark:text-gray-400 hover:bg-slate-50 dark:bg-slate-800"}`}
      >
        Față-verso
      </Link>
      <Link
        href="/configurator/mesh"
        className={`px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all inline-flex items-center justify-center ${isMesh ? "bg-emerald-600 text-white shadow-md" : "text-gray-600 dark:text-gray-400 hover:bg-slate-50 dark:bg-slate-800"}`}
      >
        Mesh
      </Link>
    </div>
  );
}


function OptionButton({ active, onClick, title, subtitle }: { active: boolean; onClick: () => void; title: string; subtitle?: string; }) {
  return <button type="button" onClick={onClick} className={`w-full text-left p-3 rounded-lg border-2 transition-all text-sm ${active ? "border-emerald-600 bg-emerald-50" : "border-gray-300 bg-white hover:border-gray-400"}`}><div className="font-bold text-gray-800">{title}</div>{subtitle && <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{subtitle}</div>}</button>;
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode; }) {
  return <button type="button" onClick={onClick} className={`px-4 py-2 text-sm font-semibold transition-colors rounded-t-lg ${active ? "border-b-2 border-emerald-600 text-emerald-600 bg-emerald-50" : "text-gray-500 hover:text-gray-800"}`}>{children}</button>;
}

type Props = { productSlug?: string; initialWidth?: number; initialHeight?: number; productImage?: string; renderOnlyConfigurator?: boolean; imageUrl?: string | null };

type ViewMode = 'gallery' | 'shape';

/* --- MAIN COMPONENT --- */
export default function BannerConfigurator({ productSlug, initialWidth: initW, initialHeight: initH, productImage, renderOnlyConfigurator = false }: Props) {

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

    return {
      width_cm: pW ? parseFloat(pW) : (initW ?? 0),
      height_cm: pH ? parseFloat(pH) : (initH ?? 0),
      quantity: pQ ? parseInt(pQ) : 1,
      material: pMat === '510' ? "frontlit_510" : "frontlit_440",
      want_wind_holes: pWind === '1',
      want_hem_and_grommets: pHem !== '0',
      designOption: "upload"
    };
  });

  // State local pentru a permite tastarea flexibilă (ex: "10." apoi "10.5")
  const [lengthText, setLengthText] = useState(input.width_cm ? String(input.width_cm) : "");
  const [heightText, setHeightText] = useState(input.height_cm ? String(input.height_cm) : "");

  const galleryImages = useMemo(() => productImage ? [productImage, "/products/banner/banner-1.webp", "/products/banner/banner-2.webp", "/products/banner/banner-3.webp"] : ["/products/banner/banner-1.webp", "/products/banner/banner-2.webp", "/products/banner/banner-3.webp", "/products/banner/banner-4.webp"], [productImage]);

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const t = searchParams.get('tab');
    if (t === 'shape') return 'shape';
    return 'gallery';
  });

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeImage, setActiveImage] = useState<string>(galleryImages[0]);
  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [textDesign, setTextDesign] = useState<string>("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [activeProductTab, setActiveProductTab] = useState("descriere");
  const toast = useToast();

  // Email marketing hooks
  const [userEmail, setUserEmail] = useState<string>("");

  const priceData = useMemo(() => calculateBannerPrice(input), [input]);
  const displayedTotal = priceData.finalPrice;

  // Auto-capture abandoned carts
  const cartData = useMemo(() => ({
    configuratorId: 'banner',
    email: userEmail,
    configuration: { ...input, artworkUrl, textDesign },
    price: displayedTotal,
    quantity: input.quantity
  }), [userEmail, input, artworkUrl, textDesign, displayedTotal]);

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
      if (input.material === 'frontlit_510') params.set("mat", "510");
      if (input.want_wind_holes) params.set("wind", "1");
      if (!input.want_hem_and_grommets) params.set("hem", "0");

      // Keep existing params just in case (like image)
      // Actually replace might wipe them if not careful, but we only set specific keys
      // It's safer to merge with existing searchParams but `pathname` + new `params` string replaces everything.
      // Let's preserve image param if it exists in current URL
      const current = new URLSearchParams(window.location.search);
      if (current.has('image')) params.set('image', current.get('image')!);
      if (current.has('title')) params.set('title', current.get('title')!);

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(timer);
  }, [input, pathname, router]);

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
    const uniqueId = `${productSlug ?? 'banner'}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const title = `Banner personalizat - ${input.width_cm}x${input.height_cm} cm`;

    addItem({
      id: uniqueId,
      productId: productSlug ?? "banner-generic",
      slug: productSlug ?? "generic-banner",
      title,
      width: input.width_cm,
      height: input.height_cm,
      price: unitPrice,
      quantity: input.quantity,
      currency: "RON",
      metadata: {
        "Material": input.material === 'frontlit_510' ? "Frontlit 510g (Premium)" : "Frontlit 440g (Standard)",
        "Finisaje": `Tiv și capse, ${input.want_wind_holes ? "cu găuri de vânt" : "fără găuri de vânt"}`,
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
  const summaryStep1 = input.width_cm > 0 && input.height_cm > 0 ? `${input.width_cm}x${input.height_cm}cm, ${input.quantity} buc.` : "Alege";
  const summaryStep2 = `${input.material === 'frontlit_510' ? "Premium" : "Standard"}, ${input.want_wind_holes ? "cu găuri" : "fără găuri"}`;
  const summaryStep3 = input.designOption === 'upload' ? 'Grafică proprie' : input.designOption === 'text_only' ? 'Doar text' : 'Design Pro';

  return (
    <main className={renderOnlyConfigurator ? "" : "bg-slate-50 dark:bg-slate-800 min-h-screen"}>
      {/* Container cu padding responsive */}
      <div className="container mx-auto px-4 py-6 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* STÂNGA - ZONA VIZUALĂ */}
          <div className="lg:sticky top-24 h-max space-y-6 lg:space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-800 overflow-hidden">


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


                  </div>
                )}

                {viewMode === 'shape' && (
                  <div className="h-full w-full p-4 animate-in fade-in slide-in-from-bottom-4 duration-300 bg-zinc-50 flex items-center justify-center">
                    <DynamicBannerPreview
                      width={input.width_cm}
                      height={input.height_cm}
                      hasGrommets={input.want_hem_and_grommets}
                      hasWindHoles={input.want_wind_holes}
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
          <div>
            <header className="mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-3">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white">Configurator Banner</h1>
                <BannerModeSwitchInline />
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Personalizează opțiunile în 3 pași simpli.</p>
                <button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline inline-flex items-center text-sm px-3 py-2 min-h-10 touch-manipulation">
                  <Info size={16} />
                  <span className="ml-2">Detalii</span>
                </button>
              </div>
            </header>
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-slate-800 px-3 sm:px-4">
              <AccordionStep stepNumber={1} title="Dimensiuni & Cantitate" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                {/* OPTIMIZARE MOBIL: Grid responsiv pentru dimensiuni */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="field-label text-sm sm:text-base">Lungime (cm)</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={lengthText}
                      onChange={(e) => handleDimChange(e.target.value, setLengthText, "width_cm")}
                      placeholder="200"
                      className="input min-h-12 text-base touch-manipulation"
                    />
                  </div>
                  <div>
                    <label className="field-label text-sm sm:text-base">Înălțime (cm)</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={heightText}
                      onChange={(e) => handleDimChange(e.target.value, setHeightText, "height_cm")}
                      placeholder="100"
                      className="input min-h-12 text-base touch-manipulation"
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
              </AccordionStep>
              <AccordionStep stepNumber={3} title="Grafică" summary={summaryStep3} isOpen={activeStep === 3} onClick={() => setActiveStep(3)} isLast={true}>
                <div>
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
                            onClick={() => updateInput("designOption", "text_only")}
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
                              <textarea className="input" rows={3} value={textDesign} onChange={e => setTextDesign(e.target.value)} placeholder="Ex: NOUL TEXT AICI..."></textarea>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="mb-4 border-b border-gray-200 dark:border-slate-800">
                        <div className="flex -mb-px overflow-x-auto no-scrollbar">
                          <TabButton active={input.designOption === 'upload'} onClick={() => updateInput("designOption", 'upload')}>Am Grafică</TabButton>
                          <TabButton active={input.designOption === 'text_only'} onClick={() => updateInput("designOption", 'text_only')}>Doar Text</TabButton>
                          <TabButton active={input.designOption === 'pro'} onClick={() => updateInput("designOption", 'pro')}>Vreau Grafică</TabButton>
                        </div>
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
                          <textarea className="input min-h-20 text-base touch-manipulation" rows={3} value={textDesign} onChange={e => setTextDesign(e.target.value)} placeholder="ex: PROMOTIE, REDUCERI, etc."></textarea>
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

            {/* BARĂ STATICĂ/STICKY */}
            <div className="relative bg-white border lg:rounded-2xl lg:shadow-lg border-gray-200 dark:border-slate-800 p-4 lg:p-6 mt-8">
              <div className="flex flex-col gap-3">
                <button onClick={handleAddToCart} className="btn-primary w-full py-4 text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200">
                  <ShoppingCart size={24} />
                  <span className="ml-2">Adaugă în Coș</span>
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
            <div className="mt-4 lg:mt-6 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 text-center font-medium">Ai nevoie de ajutor sau o ofertă personalizată?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="https://wa.me/40750473111?text=Ma%20intereseaza%20configuratorul%20banner"
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

        <MobilePriceBar totalPrice={displayedTotal} onAddToCart={handleAddToCart} isVisible={true} />

        {/* SECȚIUNE DESCRIERE & FEATURES - FULL WIDTH JOS */}
        <div className="mt-8 lg:mt-12 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-800">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-6 border-b border-gray-200 dark:border-slate-800">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-purple-600 flex items-center justify-center shadow-lg">
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
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
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
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
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
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Livrare Rapidă</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Producție în 1-2 zile</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* TAB RECENZII */}
            {activeProductTab === 'recenzii' && <Reviews productSlug="banner" />}

            {/* TAB FAQ */}
            {activeProductTab === 'faq' && <FaqAccordion qa={bannerFaqs} />}
          </div>
        </div>
      </div>

      {detailsOpen && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setDetailsOpen(false)}>
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-200 dark:border-slate-800 p-6 sm:p-8 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 bg-slate-50 dark:bg-slate-800" onClick={() => setDetailsOpen(false)} aria-label="Închide">
              <X size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 pr-8">Detalii Produs: Banner (Frontlit)</h3>
            <div className="prose dark:prose-invert prose-sm max-w-none text-gray-600 dark:text-gray-400">
              <h4 className="text-slate-900 dark:text-white">Materiale & Durabilitate</h4>
              <ul>
                <li><strong>Frontlit 440g (Standard):</strong> Material PVC flexibil și rezistent, ideal pentru o gamă largă de aplicații outdoor. Imprimare la calitate foto.</li>
                <li><strong>Frontlit 510g (Premium):</strong> O versiune mai groasă și mai durabilă, perfectă pentru utilizare pe termen lung sau în condiții meteo mai aspre.</li>
              </ul>
              <h4 className="text-slate-900 dark:text-white">Finisaje Incluse</h4>
              <ul>
                <li><strong>Tiv de Rezistență:</strong> Toate bannerele sunt tivite pe margine pentru a preveni ruperea și a crește durabilitatea.</li>
                <li><strong>Capse Metalice:</strong> Inele metalice aplicate la aproximativ 50 cm distanță, pentru o instalare ușoară și sigură.</li>
              </ul>
              <h4 className="text-slate-900 dark:text-white">Specificații Grafică</h4>
              <ul>
                <li>Formate acceptate: PDF, AI, CDR, TIFF, JPG.</li>
                <li>Rezoluție recomandată: Minimum 150 dpi la scara 1:1.</li>
                <li>Mod de culoare: CMYK.</li>
              </ul>
            </div>
          </div>
        </div>
      )}



      {/* NAVIGARE RAPIDĂ (ÎNTRE DESCRIERE ȘI RELATED) */}
      <div className="container mx-auto px-4 mt-12 mb-8">
        <QuickNav title="Vrei să personalizezi alt produs?" />
      </div>

      {/* Related Products Section */}
      <RelatedProducts category="bannere" />
    </main>
  );
}

