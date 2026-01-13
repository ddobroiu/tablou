"use client";
import React, { useMemo, useState, useEffect, useRef } from "react";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/ToastProvider";
import { Ruler, Layers, Plus, Minus, ShoppingCart, Info, ChevronDown, X, UploadCloud, Frame, TrendingUp, Percent, MessageCircle, Box, Image as ImageIcon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import DeliveryEstimation from "./DeliveryEstimation";
import FaqAccordion from "./FaqAccordion";
import Reviews from "./Reviews";
import SmartNewsletterPopup from "./SmartNewsletterPopup";
import RelatedProducts from "./RelatedProducts";
import QuickNav from "@/components/QuickNav";
import { useUserActivityTracking } from "@/hooks/useAbandonedCartCapture";
import Script from "next/script";
import { QA } from "@/types";
import {
  calculateCanvasPrice,
  getCanvasUpsell,
  CANVAS_CONSTANTS,
  formatMoneyDisplay,
  type PriceInputCanvas
} from "@/lib/pricing";

const GALLERY = [
  "/products/canvas/canvas-1.webp",
  "/products/canvas/canvas-2.webp",
  "/products/canvas/canvas-3.webp",
] as const;

const canvasFaqs: QA[] = [
  { question: "Ce este canvasul Fine Art?", answer: "Este o pânză texturată de calitate superioară, similară celei folosite de pictori profesioniști. Imprimarea se face cu cerneală eco-solvent rezistentă la UV." },
  { question: "Șasiul este inclus în preț?", answer: "Da, toate tablourile canvas vin montate pe șasiu din lemn de rășinoase, cu grosime de 2cm sau 4cm la alegere, gata de atârnat." },
  { question: "Cum se montează pe perete?", answer: "Fiecare tablou vine cu sistem de atârnare pe spate. Pur și simplu agățați-l de un cui sau șurub în perete." },
  { question: "Rezistă la umiditate?", answer: "Canvasul este tratat cu spray protector care oferă rezistență bună, dar recomandăm evitarea expunerii directe la apă sau umiditate extremă." },
  { question: "Pot comanda dimensiuni custom?", answer: "Da, acceptăm dimensiuni personalizate. Contactați-ne pentru o ofertă specială." },
];




/* --- UI COMPONENTS --- */
const AccordionStep = ({ stepNumber, title, summary, isOpen, onClick, children, isLast = false }: { stepNumber: number; title: string; summary: string; isOpen: boolean; onClick: () => void; children: React.ReactNode; isLast?: boolean; }) => (
  <div className="relative pl-14">
    <div className="absolute top-0 left-0 flex flex-col items-center h-full">
      <div className={`flex items-center justify-center w-10 h-10 rounded-2xl text-md font-bold transition-all duration-300 ${isOpen ? 'bg-indigo-600 text-white shadow-premium scale-110' : 'bg-slate-100 text-slate-500'}`}>
        {stepNumber}
      </div>
      {!isLast && <div className={`w-0.5 grow mt-2 transition-colors duration-500 ${isOpen ? 'bg-indigo-200' : 'bg-slate-100'}`}></div>}
    </div>
    <div className="flex-1">
      <button type="button" className="w-full flex items-center justify-between py-4 text-left group" onClick={onClick}>
        <div className="transition-all duration-300">
          <h2 className={`text-xl font-bold tracking-tight transition-colors ${isOpen ? 'text-indigo-600' : 'text-slate-800'}`}>{title}</h2>
          {!isOpen && <p className="text-sm text-slate-500 font-medium mt-0.5">{summary}</p>}
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-indigo-50 text-indigo-600 rotate-180' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>
      <div className={`grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "grid-rows-[1fr] opacity-100 pb-8" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  </div>
);

const productFaqs: QA[] = [
  { question: "Ce material folosiți pentru tablouri?", answer: "Folosim Canvas Fine Art - pânză realizată prin combinația de bumbac și poliester, 330 g/mp, pentru imprimări de cea mai bună calitate. Materialul nu se cutează iar la tăiere țesătura nu se destramă." },
  { question: "Tabloul vine gata de agățat?", answer: "Da, pânza este întinsă pe un șasiu din lemn uscat, cu margine oglindită (imaginea continuă pe laterale). Tabloul include sistem de prindere și este gata de pus pe perete imediat ce îl scoateți din cutie." },
  { question: "Pentru ce tipuri de imagini este recomandat?", answer: "Canvas Fine Art este ideal pentru reproduceri de opere de artă, tablouri, portrete, peisaje, decor teatru și film, colaje și decorări speciale de interior." },
];

const TabButtonSEO = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (<button onClick={onClick} className={`flex-1 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${active ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>{children}</button>);

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const inc = (d: number) => onChange(Math.max(1, value + d));
  return <div><label className="field-label">{label}</label><div className="flex"><button onClick={() => inc(-1)} className="p-3 bg-gray-100 rounded-l-lg hover:bg-gray-200" aria-label={`Scade ${label.toLowerCase()}`}><Minus size={16} /></button><input type="number" value={value} onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 1))} className="input text-center w-full rounded-none border-x-0" /><button onClick={() => inc(1)} className="p-3 bg-gray-100 rounded-r-lg hover:bg-gray-200" aria-label={`Creşte ${label.toLowerCase()}`}><Plus size={16} /></button></div></div>;
}

function OptionButton({ active, onClick, title, subtitle }: { active: boolean; onClick: () => void; title: string; subtitle?: string; }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 relative overflow-hidden ${active
        ? "border-indigo-600 bg-indigo-50/50 shadow-md scale-[1.02]"
        : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-soft"
        }`}
    >
      <div className={`font-bold transition-colors ${active ? "text-indigo-700" : "text-slate-800"}`}>{title}</div>
      {subtitle && <div className={`text-xs mt-1 transition-colors ${active ? "text-indigo-600" : "text-slate-500"}`}>{subtitle}</div>}
      {active && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></div>}
    </button>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode; }) {
  return <button type="button" onClick={onClick} className={`px-4 py-2 text-sm font-semibold transition-colors rounded-t-lg ${active ? "border-b-2 border-indigo-600 text-indigo-600 bg-indigo-50" : "text-gray-500 hover:text-gray-800"}`}>{children}</button>;
}

type Props = {
  productSlug?: string;
  initialWidth?: number;
  initialHeight?: number;
  productImage?: string;
  productTitle?: string;
  productDescription?: string;
  initialArtworkUrl?: string;
};

/* --- MAIN COMPONENT --- */
export default function CanvasConfigurator({
  productSlug,
  initialWidth: initW,
  initialHeight: initH,
  productImage,
  productTitle,
  productDescription,
  initialArtworkUrl
}: Props) {
  const { addItem } = useCart();
  const GALLERY = useMemo(() => productImage ? [productImage, "/products/canvas/canvas-1.webp", "/products/canvas/canvas-2.webp", "/products/canvas/canvas-3.webp"] : ["/products/canvas/canvas-1.webp", "/products/canvas/canvas-2.webp", "/products/canvas/canvas-3.webp", "/products/canvas/canvas-4.webp"], [productImage]);
  const [input, setInput] = useState<PriceInputCanvas>({
    width_cm: initW ?? 0,
    height_cm: initH ?? 0,
    quantity: 1,
    edge_type: "mirror", // implicit și fix: oglindită
    designOption: "upload",
    frameType: "framed", // implicit: cu ramă
    framedSize: "30x40", // dimensiune implicită pentru opțiunea cu ramă
    framedShape: "rectangle", // formă implicită: dreptunghi
  });

  const [lengthText, setLengthText] = useState(initW ? String(initW) : "");
  const [heightText, setHeightText] = useState(initH ? String(initH) : "");

  const [activeImage, setActiveImage] = useState<string>(GALLERY[0]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'gallery' | '3d'>('gallery');

  const modelViewerRef = useRef<any>(null);

  const [artworkUrl, setArtworkUrl] = useState<string | null>(initialArtworkUrl || null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState((productImage || initialArtworkUrl) ? 2 : 1);
  const [activeProductTab, setActiveProductTab] = useState<'descriere' | 'recenzii' | 'faq'>('descriere');
  const [userEmail, setUserEmail] = useState<string>('');
  const [isTextureLoaded, setIsTextureLoaded] = useState(false);

  // Switch to 3D if artwork is provided
  useEffect(() => {
    if (initialArtworkUrl) {
      setViewMode('3d');
      setActiveImage(initialArtworkUrl);

      // Auto-determine orientation if possible
      const img = new Image();
      img.src = initialArtworkUrl;
      img.onload = () => {
        const ratio = img.width / img.height;
        setImageAspectRatio(ratio);
        if (ratio > 1.05) setOrientation('landscape');
        else if (ratio < 0.95) setOrientation('portrait');
        else setOrientation('square');
      };
    }
  }, [initialArtworkUrl]);

  // State for image aspect ratio
  const [imageAspectRatio, setImageAspectRatio] = useState<number>(0);

  // New State for Explicit Orientation Selector
  const [orientation, setOrientation] = useState<'portrait' | 'landscape' | 'square'>('portrait');

  const toast = useToast();

  // Pricing
  const priceData = useMemo(() => calculateCanvasPrice(input), [input]);
  const displayedTotal = priceData.finalPrice;

  // Upsell Logic (doar pentru Fără Ramă)
  const upsellOpportunity = useMemo(() => {
    const result = getCanvasUpsell(input);
    console.log('🔍 CANVAS UPSELL DEBUG:', { input, result, frameType: input.frameType });
    return result;
  }, [input]);

  // Auto-capture abandoned carts
  const cartData = useMemo(() => ({
    configuratorId: 'canvas',
    email: userEmail,
    configuration: input,
    price: displayedTotal,
    quantity: input.quantity
  }), [userEmail, input, displayedTotal]);

  useUserActivityTracking(cartData);

  const updateInput = <K extends keyof PriceInputCanvas>(k: K, v: PriceInputCanvas[K]) => setInput((p) => ({ ...p, [k]: v }));
  const setQty = (v: number) => updateInput("quantity", Math.max(1, Math.floor(v)));
  const onChangeLength = (v: string) => { const d = v.replace(/\D/g, ""); setLengthText(d); updateInput("width_cm", d === "" ? 0 : parseInt(d, 10)); };
  const onChangeHeight = (v: string) => { const d = v.replace(/\D/g, ""); setHeightText(d); updateInput("height_cm", d === "" ? 0 : parseInt(d, 10)); };





  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const url = new URL(window.location.origin + window.location.pathname);
    if (artworkUrl) url.searchParams.set('artworkUrl', artworkUrl);
    url.searchParams.set('w', input.width_cm.toString());
    url.searchParams.set('h', input.height_cm.toString());
    url.searchParams.set('type', input.frameType === 'none' ? 'none' : 'framed');
    url.searchParams.set('orient', orientation);
    if (input.framedSize) url.searchParams.set('framedSize', input.framedSize);
    if (input.framedShape) url.searchParams.set('framedShape', input.framedShape);
    url.searchParams.set('autoAr', 'true');
    return url.toString();
  }, [artworkUrl, input.width_cm, input.height_cm, input.frameType, input.framedSize, input.framedShape, orientation]);

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
      setActiveImage(data.url); // Show immediately

      // Determine Aspect Ratio of uploaded image
      const img = new Image();
      img.src = data.url;
      img.onload = () => {
        const ratio = img.width / img.height;
        setImageAspectRatio(ratio);
        // Auto-set orientation based on image
        if (ratio > 1.05) {
          setOrientation('landscape');
          updateInput("framedShape", "rectangle");
        } else if (ratio < 0.95) {
          setOrientation('portrait');
          updateInput("framedShape", "rectangle");
        } else {
          setOrientation('square');
          updateInput("framedShape", "square");
        }
      };

      setViewMode('3d'); // Auto-switch to 3D
    } catch (e: any) {
      setUploadError(e?.message ?? "Eroare la upload");
    } finally {
      setUploading(false);
    }
  };

  function handleAddToCart() {
    // Validare pentru opțiunea cu ramă
    if (input.frameType === "framed") {
      if (!input.framedSize) {
        toast?.warning("Selectați o dimensiune.");
        return;
      }
    } else {
      // Validare pentru opțiunea fără ramă (dimensiuni personalizate)
      if (!input.width_cm || !input.height_cm) {
        toast?.warning("Introduceți dimensiunile.");
        return;
      }
    }

    if (displayedTotal <= 0) {
      toast?.warning("Prețul trebuie calculat.");
      return;
    }

    const unitPrice = Math.round((displayedTotal / input.quantity) * 100) / 100;
    const uniqueId = `${productSlug ?? 'canvas'}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    let title = "";
    // Calculate final export dimensions based on orientation
    let exportW = 0;
    let exportH = 0;

    if (input.frameType === "framed") {
      const [d1, d2] = (input.framedSize || "0x0").split("x").map(Number);
      const short = Math.min(d1, d2);
      const long = Math.max(d1, d2);

      if (orientation === 'landscape') { exportW = long; exportH = short; }
      else if (orientation === 'portrait') { exportW = short; exportH = long; }
      else { exportW = short; exportH = short; } // square

      const shapeLabel = orientation === "square" ? "Pătrat" : "Dreptunghi";
      title = `Tablou Canvas cu Ramă ${shapeLabel} ${exportW}×${exportH} cm`;
    } else {
      exportW = input.width_cm;
      exportH = input.height_cm;
      title = `Tablou Canvas ${exportW}×${exportH} cm`;
    }

    if (productTitle) {
      title = `${productTitle} - ${input.frameType === "framed" ? (exportW + "x" + exportH + " cm") : (exportW + "x" + exportH + " cm")}`;
    }

    const edgeLabels = { white: "Albă", mirror: "Oglindită", wrap: "Continuată (Wrap)" };

    addItem({
      id: uniqueId,
      productId: productSlug ?? "canvas",
      slug: (productSlug && !productSlug.includes("/")) ? `canvas/${productSlug}` : (productSlug || "canvas"),
      title,
      width: exportW,
      height: exportH,
      price: unitPrice,
      quantity: input.quantity,
      currency: "RON",
      metadata: {
        "Tip": input.frameType === "framed" ? "Cu Ramă" : "Fără Ramă",
        ...(input.frameType === "framed" && { "Formă": input.framedShape === "square" ? "Pătrat" : "Dreptunghi" }),
        "Grafică": input.designOption === 'pro' ? 'Vreau grafică' : 'Grafică proprie',
        ...(productTitle && { "Model": productTitle }),
        ...(input.designOption === 'pro' && { "Cost grafică": formatMoneyDisplay(CANVAS_CONSTANTS.PRO_DESIGN_FEE) }),
        artworkUrl: artworkUrl || productImage,
      },
    });
    toast?.success("Produs adăugat în coș");
  }
  // --- 3D MODEL SELECTION & SCALING ---
  // --- 3D MODEL SELECTION & SCALING ---
  // Definim modelele si dimensiunile lor de baza pentru scalare corecta

  // FOLOSIM Landscape pentru ambele (Portrait si Landscape) si doar il scalam diferit.
  // Asta rezolva problema texturii rotite daca modelul "portrait" avea UV-uri proaste.
  let modelSrc = "/products/canvas/canvas_landscape.glb";
  let baseW = 60;
  let baseH = 40;

  // Calculate dimensions for 3D view based on orientation
  let currentW = input.width_cm || 40; // Fallback visualizare
  let currentH = input.height_cm || 60; // Fallback visualizare

  if (input.frameType === "framed" && input.framedSize) {
    const [d1, d2] = input.framedSize.split('x').map(x => parseInt(x));
    const short = Math.min(d1, d2);
    const long = Math.max(d1, d2);

    if (orientation === 'landscape') { currentW = long; currentH = short; }
    else if (orientation === 'portrait') { currentW = short; currentH = long; }
    else { currentW = short; currentH = short; }
  }

  // Override pentru specifice
  if (orientation === 'square') {
    modelSrc = "/products/canvas/canvas_patrat.glb";
    baseW = 40;
    baseH = 40;
  }
  // Pentru Portrait si Landscape ramane modelSrc setat initial (landscape.glb)
  // Scaling-ul se va ocupa de forma.

  // Calcul factori scalare - SIMPLIFICAT (fara normalizare vizuala care poate ascunde modelul)
  const scaleX = currentW / baseW;
  const scaleY = currentH / baseH;
  const scaleZ = 1;

  const scaleString = `${scaleX} ${scaleY} ${scaleZ}`;

  // Resetam cheia viewer-ului cand schimbam fisierul sursa ca sa forteze reincarcarea
  const viewerKey = `viewer-${orientation}-${modelSrc}`;

  // --- 3D TEXTURE APPLIER ---
  useEffect(() => {
    const viewer = modelViewerRef.current;
    if (!viewer) return;

    const updateTexture = async () => {
      try {
        setIsTextureLoaded(false); // Start loading
        const sourceImg = artworkUrl;
        if (!sourceImg) {
          setIsTextureLoaded(true);
          return;
        }

        // No programmatic rotation - revert to direct texture application
        const finalImg = sourceImg;

        if (!viewer.model) {
          // Wait for load if not ready
          await new Promise(resolve => viewer.addEventListener('load', resolve, { once: true }));
        }

        if (viewer.model) {
          // Apply texture to the main material
          const texture = await viewer.createTexture(finalImg);
          const material = viewer.model.materials[0];

          if (material && material.pbrMetallicRoughness) {
            material.pbrMetallicRoughness.baseColorTexture.setTexture(texture);

            if (texture.sampler) {
              try {
                // @ts-ignore
                texture.sampler.setWrapS(33071); // ClampToEdge
                // @ts-ignore
                texture.sampler.setWrapT(33071);
              } catch (err) {
                // ignore
              }
            }
          }
        }
        setIsTextureLoaded(true); // Finish loading
      } catch (e) {
        console.error("Texture error:", e);
        setIsTextureLoaded(true); // Finish anyway to unblock
      }
    };

    if (viewMode === '3d') {
      updateTexture();
    }
  }, [activeImage, artworkUrl, viewMode, modelSrc]); // Re-run when modelSrc changes

  const summaryStep1 = input.frameType === "framed" ? "Cu Ramă" : "Fără Ramă";
  const summaryStep2 = input.frameType === "framed"
    ? `${input.framedShape === "square" ? "Pătrat" : "Dreptunghi"} ${input.framedSize?.replace("x", "×")} cm, ${input.quantity} buc.`
    : (input.width_cm > 0 && input.height_cm > 0 ? `${input.width_cm}×${input.height_cm} cm, ${input.quantity} buc.` : "Alege dimensiuni");
  const summaryStep3 = input.designOption === 'upload' ? 'Grafică proprie' : 'Design Pro';


  return (
    <main className="bg-gray-50 min-h-screen">
      <Script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js" />
      <div className="container mx-auto px-4 py-10 lg:py-16">
        <input
          type="file"
          id="photo-upload-input"
          className="hidden"
          onChange={e => handleArtworkFileInput(e.target.files?.[0] ?? null)}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* ... inside the component render ... */}

          <div className="lg:sticky top-24 h-max space-y-8 animate-slide-up">
            <div className="bg-white rounded-[2rem] shadow-elevated border border-slate-100 overflow-hidden">

              {/* Tabs Switcher */}
              <div className="flex border-b border-gray-100 overflow-x-auto">
                <button
                  onClick={() => setViewMode('gallery')}
                  className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${viewMode === 'gallery' ? 'text-indigo-600 bg-indigo-50/50 border-b-2 border-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  <ImageIcon size={18} /> Galerie
                </button>
                <button
                  onClick={() => setViewMode('3d')}
                  className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${viewMode === '3d' ? 'text-indigo-600 bg-indigo-50/50 border-b-2 border-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  <Box size={18} /> Vedere 3D
                </button>
              </div>

              <div className="aspect-square relative bg-slate-50">
                {viewMode === 'gallery' ? (
                  <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                    <img src={activeImage} alt="Canvas" className="h-full w-full object-contain transition-transform duration-700 hover:scale-110" />
                  </div>
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center relative">
                    {/* @ts-ignore */}
                    <model-viewer
                      key={viewerKey}
                      ref={modelViewerRef}
                      src={modelSrc}
                      alt="Model 3D Tablou Canvas"
                      shadow-intensity="1"
                      camera-controls
                      ar
                      ar-modes="webxr scene-viewer quick-look"
                      tone-mapping="neutral"
                      scale={scaleString}
                      style={{ width: '100%', height: '100%' }}
                    >

                      <button
                        slot="ar-button"
                        disabled={!isTextureLoaded}
                        className={`absolute bottom-4 right-4 font-bold py-2 px-4 rounded-full shadow-lg flex items-center gap-2 transition-transform active:scale-95 z-20 ${!isTextureLoaded ? 'bg-gray-400 cursor-not-allowed opacity-70 text-gray-100' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                      >
                        {!isTextureLoaded ? <span className="animate-spin text-lg">⏳</span> : <Box size={18} />}
                        {isTextureLoaded ? 'Vezi în AR' : 'Se încarcă...'}
                      </button>
                    </model-viewer>

                    {!artworkUrl && (
                      <div className="absolute inset-0 bg-slate-50/80 backdrop-blur-[4px] z-30 flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-4 text-indigo-600">
                          <UploadCloud size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Simularea 3D necesită o poză</h3>
                        <p className="text-sm text-gray-600 max-w-[240px]">
                          Încarcă propria ta fotografie pentru a vizualiza tabloul personalizat în 3D și Realitate Augmentată.
                        </p>
                        <button
                          onClick={() => document.getElementById('photo-upload-input')?.click()}
                          className="mt-6 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95 text-sm"
                        >
                          ÎNCARCĂ POZA ACUM
                        </button>
                      </div>
                    )}

                    {/* QR Code for AR (Mobile Sync) - Visible on Desktop */}
                    <div className="absolute bottom-4 right-4 z-20 hidden lg:block">
                      <div className="bg-white/95 backdrop-blur-xl p-3 rounded-2xl border-2 border-emerald-100 shadow-[0_8px_32px_rgba(0,0,0,0.12)] group/qr transition-all hover:scale-105 hover:border-emerald-300">
                        <div className="flex flex-col items-center gap-2">
                          <div className="bg-white p-1.5 rounded-xl border border-gray-100 shadow-inner">
                            <QRCodeSVG
                              value={shareUrl}
                              size={85}
                              level="H"
                              includeMargin={false}
                              imageSettings={{
                                src: "/favicon.ico",
                                x: undefined,
                                y: undefined,
                                height: 14,
                                width: 14,
                                excavate: true,
                              }}
                            />
                          </div>
                          <div className="text-center">
                            <div className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Vezi în AR</div>
                            <div className="text-[7px] font-bold text-gray-400 uppercase tracking-tighter">Scan pt. Mobil</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* THUMBNAILS - ONLY IN GALLERY MODE */}
              {viewMode === 'gallery' && (
                <div className="p-4 grid grid-cols-4 gap-3 bg-white border-t border-slate-100">
                  {GALLERY.map((src, i) => (
                    <button
                      key={src}
                      onClick={() => setActiveIndex(i)}
                      className={`relative rounded - xl aspect - square overflow - hidden transition - all duration - 300 ${activeIndex === i ? "ring-2 ring-indigo-500 ring-offset-2 scale-95 shadow-lg" : "hover:opacity-80 hover:scale-105"} `}
                    >
                      <img src={src} alt="Thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div> {/* Start Right Column */}
            <header className="mb-6">
              <div className="flex justify-between items-center gap-4 mb-3">
                <h1 className="text-3xl font-extrabold text-gray-900">{productTitle || "Configurator Canvas"}</h1>
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-red-500 text-white font-bold text-sm animate-pulse">
                  🔥 -20% REDUCERE
                </span>
              </div>
              <div className="flex justify-between items-center"><p className="text-gray-600">Personalizează tabloul în 3 pași simpli.</p><button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline inline-flex items-center text-sm px-3 py-1.5"><Info size={16} /><span className="ml-2">Detalii</span></button></div>
            </header>



            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-4">
              {/* Pas 1: Tip Canvas (Cu Ramă / Fără Ramă) */}
              <AccordionStep stepNumber={1} title="Tip Canvas" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                <div className="mb-4">
                  <label className="field-label mb-3">Selectează tipul de canvas</label>
                  <div className="grid grid-cols-2 gap-3">
                    <OptionButton
                      active={input.frameType === "framed"}
                      onClick={() => updateInput("frameType", "framed")}
                      title="Cu Ramă"
                      subtitle="Dimensiuni prestabilite"
                    />
                    <OptionButton
                      active={input.frameType === "none"}
                      onClick={() => updateInput("frameType", "none")}
                      title="Fără Ramă"
                      subtitle="Dimensiuni personalizate"
                    />
                  </div>
                </div>
              </AccordionStep>

              {/* Pas 2: Formă & Dimensiuni */}
              <AccordionStep stepNumber={2} title="Formă & Dimensiuni" summary={summaryStep2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)}>
                {/* Pentru Cu Ramă */}
                {input.frameType === "framed" && (
                  <>
                    <div className="mb-6">
                      <label className="field-label mb-3">Formă</label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => { setOrientation('portrait'); updateInput("framedShape", "rectangle"); }}
                          className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${orientation === 'portrait' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-slate-300'}`}
                        >
                          <div className="w-6 h-8 border-2 border-current rounded-sm"></div>
                          <span className="text-xs font-bold">Portret</span>
                        </button>
                        <button
                          onClick={() => { setOrientation('landscape'); updateInput("framedShape", "rectangle"); }}
                          className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${orientation === 'landscape' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-slate-300'}`}
                        >
                          <div className="w-8 h-6 border-2 border-current rounded-sm"></div>
                          <span className="text-xs font-bold">Landscape</span>
                        </button>
                        <button
                          onClick={() => { setOrientation('square'); updateInput("framedShape", "square"); }}
                          className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${orientation === 'square' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-slate-300'}`}
                        >
                          <div className="w-6 h-6 border-2 border-current rounded-sm"></div>
                          <span className="text-xs font-bold">Pătrat</span>
                        </button>
                      </div>
                    </div>

                    {/* Dimensiuni în funcție de formă */}
                    <div className="mb-4 animate-fade-in">
                      <label className="field-label mb-3">Dimensiune</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {Object.keys(orientation === 'square' ? CANVAS_CONSTANTS.FRAMED_PRICES_SQUARE : CANVAS_CONSTANTS.FRAMED_PRICES_RECTANGLE).map((sizeKey) => {
                          // Display Logic: 
                          // Key is usually "Small x Large" (e.g. 20x30).
                          // If landscape, show "30x20". 
                          const [s1, s2] = sizeKey.split('x').map(Number);
                          let label = sizeKey;
                          if (orientation === 'landscape') {
                            // Show max x min
                            label = `${Math.max(s1, s2)}×${Math.min(s1, s2)}`;
                          } else if (orientation === 'portrait') {
                            // Show min x max
                            label = `${Math.min(s1, s2)}×${Math.max(s1, s2)}`;
                          } else {
                            label = sizeKey.replace('x', '×');
                          }

                          return (
                            <button
                              key={sizeKey}
                              type="button"
                              onClick={() => updateInput("framedSize", sizeKey)}
                              className={`px-3 py-2 rounded-lg border-2 text-sm font-semibold transition-all ${input.framedSize === sizeKey
                                ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                                } `}
                            >
                              {label} cm
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Cantitate */}
                    <div>
                      <NumberInput label="Cantitate" value={input.quantity} onChange={setQty} />
                    </div>
                  </>
                )}

                {/* Pentru Fără Ramă - Dimensiuni Personalizate */}
                {input.frameType === "none" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><label className="field-label">Lățime (cm)</label><input type="text" inputMode="numeric" value={lengthText} onChange={(e) => onChangeLength(e.target.value)} placeholder="40" className="input" /></div>
                      <div><label className="field-label">Înălțime (cm)</label><input type="text" inputMode="numeric" value={heightText} onChange={(e) => onChangeHeight(e.target.value)} placeholder="60" className="input" /></div>
                    </div>
                    <div>
                      <NumberInput label="Cantitate" value={input.quantity} onChange={setQty} />

                      {/* UPSELL ALERT (doar pentru Fără Ramă) */}
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
                )}
              </AccordionStep>

              {/* Pas 3: Grafică */}
              <AccordionStep stepNumber={3} title="Grafică" summary={summaryStep3} isOpen={activeStep === 3} onClick={() => setActiveStep(3)} isLast={true}>
                <div>
                  {productImage ? (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-20 h-20 rounded-lg bg-white p-1 border border-slate-200 shadow-sm shrink-0">
                          <img src={productImage} alt="Model" className="w-full h-full object-cover rounded" />
                        </div>
                        <div>
                          <span className="inline-block px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-xs font-bold mb-1">MODEL SELECTAT</span>
                          <p className="font-bold text-slate-800 text-sm leading-tight mb-1">{productTitle}</p>
                          <p className="text-xs text-slate-500">Vom imprima acest model.</p>
                        </div>
                      </div>

                      <div className="border-t border-slate-200 pt-3">
                        <p className="text-sm font-bold text-gray-700 mb-2">Vrei să schimbi grafica?</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateInput("designOption", "upload")}
                            className={`flex - 1 py - 2 px - 3 rounded - lg border text - sm font - semibold transition - colors ${input.designOption === 'upload' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'} `}
                          >
                            Încărcare Fișier
                          </button>
                          <button
                            onClick={() => updateInput("designOption", "pro")}
                            className={`flex - 1 py - 2 px - 3 rounded - lg border text - sm font - semibold transition - colors ${input.designOption === 'pro' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'} `}
                          >
                            Colaj / Editare
                          </button>
                        </div>
                        {input.designOption !== 'upload' && input.designOption !== 'pro' && (
                          <p className="text-xs text-slate-400 mt-2 italic">Selectează o opțiune de mai sus pentru a înlocui modelul standard.</p>
                        )}
                      </div>

                      {/* CONDITIONAL RENDER FOR OVERRIDE OPTIONS */}
                      {(input.designOption === 'upload' || input.designOption === 'pro') && (
                        <div className="mt-4 pt-4 border-t border-slate-200 animate-fade-in-up">
                          {input.designOption === 'upload' && (
                            <div className="space-y-3">
                              <p className="text-sm text-gray-600 font-medium">Încarcă fotografia ta nouă (JPG, PNG, TIFF):</p>
                              <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                                <span className="flex items-center space-x-2"><UploadCloud className="w-6 h-6 text-gray-600" /><span className="font-medium text-gray-600">Apasă pentru a încărca</span></span>
                                <input type="file" name="file_upload" className="hidden" onChange={e => handleArtworkFileInput(e.target.files?.[0] ?? null)} />
                              </label>
                              {uploading && <p className="text-sm text-indigo-600">Se încarcă...</p>}
                              {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
                              {artworkUrl && !uploadError && <p className="text-sm text-green-600 font-semibold">Fotografie nouă încărcată!</p>}
                            </div>
                          )}

                          {input.designOption === 'pro' && (
                            <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200 text-sm text-indigo-800">
                              <p className="font-semibold">Serviciu Editare / Colaj</p>
                              <p>Cost: <strong>{formatMoneyDisplay(CANVAS_CONSTANTS.PRO_DESIGN_FEE)}</strong>. Designerii noștri pot crea un colaj sau retușa grafica nouă.</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="mb-4 border-b border-gray-200">
                        <div className="flex -mb-px">
                          <TabButton active={input.designOption === 'upload'} onClick={() => updateInput("designOption", 'upload')}>Am Fotografie</TabButton>
                          <TabButton active={input.designOption === 'pro'} onClick={() => updateInput("designOption", 'pro')}>Colaj / Editare</TabButton>
                        </div>
                      </div>

                      {input.designOption === 'upload' && (
                        <div className="space-y-3">
                          <p className="text-sm text-gray-600">Încarcă fotografia ta (JPG, PNG, TIFF).</p>
                          <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                            <span className="flex items-center space-x-2"><UploadCloud className="w-6 h-6 text-gray-600" /><span className="font-medium text-gray-600">Apasă pentru a încărca</span></span>
                            <input type="file" name="file_upload" className="hidden" onChange={e => handleArtworkFileInput(e.target.files?.[0] ?? null)} />
                          </label>
                          {uploading && <p className="text-sm text-indigo-600">Se încarcă...</p>}
                          {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
                          {artworkUrl && !uploadError && <p className="text-sm text-green-600 font-semibold">Fotografie încărcată!</p>}
                        </div>
                      )}

                      {input.designOption === 'pro' && (
                        <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200 text-sm text-indigo-800">
                          <p className="font-semibold">Serviciu Editare / Colaj</p>
                          <p>Cost: <strong>{formatMoneyDisplay(CANVAS_CONSTANTS.PRO_DESIGN_FEE)}</strong>. Designerii noștri pot crea un colaj, retușa fotografia sau adăuga text.</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </AccordionStep>
            </div>
            <div className="sticky bottom-0 lg:static bg-white/90 lg:bg-white backdrop-blur-xl lg:backdrop-blur-none border-t lg:border lg:rounded-3xl shadow-elevated border-slate-200/50 py-6 lg:p-8 lg:mt-12 animate-slide-up">
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 mb-6 text-center shadow-sm">
                <p className="text-indigo-600 font-bold text-sm tracking-tight">🎉 Reducere specială 20% aplicată la toate tablourile canvas!</p>
              </div>
              <div className="flex flex-col gap-6">
                <button onClick={handleAddToCart} className="btn-premium w-full py-5 text-xl font-bold tracking-tight shadow-indigo-200 group">
                  <ShoppingCart size={24} className="group-hover:translate-x-1 transition-transform" />
                  <span className="ml-2">Adaugă în Coș</span>
                </button>
                <div className="flex flex-row justify-between items-center w-full gap-2 border-t border-slate-100 pt-3 mt-2">
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Preț Total</span>
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tighter">{formatMoneyDisplay(displayedTotal)}</span>
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
                  href="https://wa.me/40750473111?text=Ma%20intereseaza%20configuratorul%20canvas"
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

        {/* INFO SECTION - MATCHING SHOPPRINT STYLE */}
        <div className="mt-8 lg:mt-12 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <nav className="border-b border-gray-200 flex overflow-x-auto">
            <TabButtonSEO active={activeProductTab === "descriere"} onClick={() => setActiveProductTab("descriere")}>Descriere</TabButtonSEO>
            <TabButtonSEO active={activeProductTab === "recenzii"} onClick={() => setActiveProductTab("recenzii")}>Recenzii</TabButtonSEO>
            <TabButtonSEO active={activeProductTab === "faq"} onClick={() => setActiveProductTab("faq")}>FAQ</TabButtonSEO>
          </nav>

          <div className="p-6 lg:p-8">
            {activeProductTab === 'descriere' && (
              <div className="prose max-w-none text-gray-700">
                {productDescription && (
                  <div className="mb-6 pb-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-3">Concept</h2>
                    <p className="text-lg leading-relaxed">{productDescription}</p>
                  </div>
                )}

                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tablouri Canvas Fine Art</h2>
                <p className="text-lg leading-relaxed mb-6">
                  Transformă fotografiile preferate în opere de artă. Tablourile noastre sunt imprimate la rezoluție înaltă pe pânză Canvas Fine Art și întinse manual pe un șasiu solid din lemn.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Materiale & Calitate</h3>
                    <ul className="space-y-2 list-disc pl-5 text-sm sm:text-base">
                      <li><strong>Pânză Fine Art:</strong> Mix bumbac-poliester 330g/mp pentru detalii clare.</li>
                      <li><strong>Șasiu Lemn:</strong> Cadru rezistent din brad, profil 2x4cm.</li>
                      <li><strong>Margine Oglindită:</strong> Imaginea continuă pe lateral pentru efect 3D (galerie).</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Gata de Agățat</h3>
                    <p className="text-sm sm:text-base">Fiecare tablou este asamblat manual și include sistemul de prindere pe perete. Primești tabloul gata de expus, fără nicio pregătire suplimentară.</p>
                  </div>
                </div>
              </div>
            )}

            {activeProductTab === 'recenzii' && <Reviews productSlug={productSlug || 'canvas'} />}

            {activeProductTab === 'faq' && <FaqAccordion qa={productFaqs} />}
          </div>
        </div>
      </div>

      {detailsOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setDetailsOpen(false)}>
          <div className="relative z-10 w-full max-w-2xl bg-white text-slate-900 rounded-2xl shadow-lg border border-gray-200 p-8" onClick={e => e.stopPropagation()}>
            <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100" onClick={() => setDetailsOpen(false)}><X size={20} className="text-gray-600" /></button>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Detalii Canvas Fine Art</h3>
            <div className="prose prose-sm prose-slate max-w-none">
              <h4>Material Canvas Fine Art</h4>
              <p>Pânză realizată prin combinația de bumbac și poliester pentru imprimări de cea mai bună calitate. Materialul nu se cutează iar la tăiere țesătura nu se destramă.</p>
              <ul>
                <li><strong>Grosime:</strong> 330 g/mp</li>
                <li><strong>Dimensiuni rolă:</strong> lățime 1.03, 1.26, 1.55, 3.10 m; lungime 50 m</li>
              </ul>
              <h4>Finisaj</h4>
              <p>Margine oglindită standard - imaginea continuă pe lateralele șasiului pentru un aspect profesional.</p>
              <h4>Șasiu</h4>
              <p>Lemn de brad uscat, profil 2×4 cm, rezistent la deformare. Pânza este întinsă manual pentru o tensiune perfectă.</p>
            </div>
          </div>
        </div>
      )}

      {/* Smart Newsletter Popup */}
      <SmartNewsletterPopup
        onSubscribe={(email) => setUserEmail(email)}
        delay={30}
      />

      {/* NAVIGARE RAPIDĂ (ÎNTRE DESCRIERE ȘI RELATED) */}
      <div className="container mx-auto px-4 mt-12 mb-8">
        <QuickNav title="Vrei să personalizezi alt produs?" />
      </div>


    </main>
  );
}
