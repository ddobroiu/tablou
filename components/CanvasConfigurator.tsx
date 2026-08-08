"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/ToastProvider";
import { Ruler, Layers, Plus, Minus, ShoppingCart, Info, ChevronDown, X, UploadCloud, Frame, TrendingUp, Percent, MessageCircle } from "lucide-react";
import { NumberInput } from "@/components/ui/NumberInput";

import DeliveryEstimation from "./DeliveryEstimation";
import FaqAccordion from "./FaqAccordion";
import Reviews from "./Reviews";
import SmartNewsletterPopup from "./SmartNewsletterPopup";
import RelatedProducts from "./RelatedProducts";
import QuickNav from "@/components/QuickNav";
import { useUserActivityTracking } from "@/hooks/useAbandonedCartCapture";
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
      <div className={`flex items-center justify-center w-10 h-10 rounded-2xl text-md font-bold transition-all duration-300 ${isOpen ? 'bg-emerald-600 text-white shadow-emerald-500/30 shadow-lg scale-110' : 'bg-slate-100 text-slate-500'}`}>
        {stepNumber}
      </div>
      {!isLast && <div className={`w-0.5 grow mt-2 transition-colors duration-500 ${isOpen ? 'bg-emerald-200' : 'bg-slate-100'}`}></div>}
    </div>
    <div className="flex-1">
      <button type="button" className="w-full flex items-center justify-between py-4 text-left group" onClick={onClick}>
        <div className="transition-all duration-300">
          <h2 className={`text-xl font-bold tracking-tight transition-colors ${isOpen ? 'text-emerald-600' : 'text-slate-800 dark:text-slate-200'}`}>{title}</h2>
          {!isOpen && <p className="text-sm text-slate-500 font-medium mt-0.5">{summary}</p>}
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-emerald-50 text-emerald-600 rotate-180' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-slate-100'}`}>
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

const TabButtonSEO = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (<button onClick={onClick} className={`flex-1 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${active ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 hover:border-gray-300'}`}>{children}</button>);


function OptionButton({ active, onClick, title, subtitle }: { active: boolean; onClick: () => void; title: string; subtitle?: string; }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 relative overflow-hidden ${active
        ? "border-emerald-600 bg-emerald-50/50 shadow-md scale-[1.02]"
        : "border-slate-200 bg-white dark:bg-slate-900 hover:border-slate-300 hover:shadow-soft"
        }`}
    >
      <div className={`font-bold transition-colors ${active ? "text-emerald-700" : "text-slate-800 dark:text-slate-200"}`}>{title}</div>
      {subtitle && <div className={`text-xs mt-1 transition-colors ${active ? "text-emerald-600" : "text-slate-500"}`}>{subtitle}</div>}
      {active && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></div>}
    </button>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode; }) {
  return <button type="button" onClick={onClick} className={`px-4 py-2 text-sm font-semibold transition-colors rounded-t-lg ${active ? "border-b-2 border-emerald-600 text-emerald-600 bg-emerald-50" : "text-gray-500 hover:text-gray-800"}`}>{children}</button>;
}

type Props = {
  productSlug?: string;
  initialWidth?: number;
  initialHeight?: number;
  productImage?: string;
  productTitle?: string;
  productDescription?: string;
};

/* --- MAIN COMPONENT --- */
export default function CanvasConfigurator({
  productSlug,
  initialWidth: initW,
  initialHeight: initH,
  productImage,
  productTitle,
  productDescription
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

  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(productImage ? 2 : 1);
  const [activeProductTab, setActiveProductTab] = useState<'descriere' | 'recenzii' | 'faq'>('descriere');
  const [userEmail, setUserEmail] = useState<string>('');
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
    if (productTitle) {
      // Dacă e un produs specific, folosim titlul lui
      title = `${productTitle} - ${input.frameType === "framed" ? (input.framedSize + " cm") : (input.width_cm + "x" + input.height_cm + " cm")}`;
    } else if (input.frameType === "framed") {
      const [w, h] = (input.framedSize || "").split("x");
      const shapeLabel = input.framedShape === "square" ? "Pătrat" : "Dreptunghi";
      title = `Tablou Canvas cu Ramă ${shapeLabel} ${w}×${h} cm`;
    } else {
      title = `Tablou Canvas ${input.width_cm}×${input.height_cm} cm`;
    }

    const edgeLabels = { white: "Albă", mirror: "Oglindită", wrap: "Continuată (Wrap)" };

    addItem({
      id: uniqueId,
      productId: productSlug ?? "canvas",
      slug: (productSlug && !productSlug.includes("/")) ? `canvas/${productSlug}` : (productSlug || "canvas"),
      title,
      width: input.frameType === "framed" ? parseInt((input.framedSize || "").split("x")[0]) : input.width_cm,
      height: input.frameType === "framed" ? parseInt((input.framedSize || "").split("x")[1]) : input.height_cm,
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
        "Margine": input.edge_type === 'mirror' ? 'Oglindită (Mirror)' : 'Albă',
      },
    });
    toast?.success("Produs adăugat în coș");
  }

  useEffect(() => {
    const id = setInterval(() => setActiveIndex((i) => (i + 1) % GALLERY.length), 3000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => setActiveImage(GALLERY[activeIndex]), [activeIndex]);

  const summaryStep1 = input.frameType === "framed" ? "Cu Ramă" : "Fără Ramă";
  const summaryStep2 = input.frameType === "framed"
    ? `${input.framedShape === "square" ? "Pătrat" : "Dreptunghi"} ${input.framedSize?.replace("x", "×")} cm, ${input.quantity} buc.`
    : (input.width_cm > 0 && input.height_cm > 0 ? `${input.width_cm}×${input.height_cm} cm, ${input.quantity} buc.` : "Alege dimensiuni");
  const summaryStep3 = input.designOption === 'upload' ? 'Grafică proprie' : 'Design Pro';

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* ... inside the component render ... */}

          <div className="lg:sticky top-24 h-max space-y-8 animate-slide-up">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-elevated border border-slate-100 overflow-hidden">
              <div className="aspect-square bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                <div className="relative">
                  <img src={activeImage} alt="Canvas" className="max-h-full max-w-full object-contain transition-transform duration-700 hover:scale-110 shadow-2xl" />
                  {input.edge_type === 'white' && (
                    <>
                      {/* Fold marks for white border */}
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-slate-400 -translate-x-1 -translate-y-1"></div>
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-slate-400 translate-x-1 -translate-y-1"></div>
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-slate-400 -translate-x-1 translate-y-1"></div>
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-slate-400 translate-x-1 translate-y-1"></div>

                      {/* Side marks */}
                      <div className="absolute top-1/2 left-0 w-3 h-0.5 bg-slate-400/50 -translate-x-4"></div>
                      <div className="absolute top-1/2 right-0 w-3 h-0.5 bg-slate-400/50 translate-x-4"></div>
                      <div className="absolute top-0 left-1/2 w-0.5 h-3 bg-slate-400/50 -translate-y-4"></div>
                      <div className="absolute bottom-0 left-1/2 w-0.5 h-3 bg-slate-400/50 translate-y-4"></div>

                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                        Semne Delimitare Pliere
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="p-4 grid grid-cols-4 gap-3 bg-white">
                {GALLERY.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => setActiveIndex(i)}
                    className={`relative rounded-xl aspect-square overflow-hidden transition-all duration-300 ${activeIndex === i ? "ring-2 ring-emerald-500 ring-offset-2 scale-95 shadow-lg" : "hover:opacity-80 hover:scale-105"}`}
                  >
                    <img src={src} alt="Thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <header className="mb-6">
              <div className="flex justify-between items-center gap-4 mb-3">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{productTitle || "Configurator Canvas"}</h1>
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-red-500 text-white font-bold text-sm animate-pulse">
                  🔥 -20% REDUCERE
                </span>
              </div>
              <div className="flex justify-between items-center"><p className="text-gray-600 dark:text-gray-400">Personalizează tabloul în 3 pași simpli.</p><button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline inline-flex items-center text-sm px-3 py-1.5"><Info size={16} /><span className="ml-2">Detalii</span></button></div>
            </header>

            {/* Banner Galerie Modele */}
            <div className="mb-6 bg-gradient-to-r from-purple-50 via-pink-50 to-emerald-50 border-2 border-purple-200 rounded-xl p-4 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">🎨 Caută inspirație?</h3>
                  <p className="text-xs text-gray-800 font-bold">Explorează peste 10.000 de modele de tablouri canvas în galeria noastră</p>
                </div>
                <a
                  href="/shop?category=Canvas"
                  className="shrink-0 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  Vezi Modele →
                </a>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-800 px-4">
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
                    {/* Selector Formă - REMOVED (Only Rectangle supported) */}
                    {/* <div className="mb-4">...</div> */}

                    {/* Dimensiuni în funcție de formă */}
                    <div className="mb-4">
                      <label className="field-label mb-3">Dimensiune</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {Object.keys(CANVAS_CONSTANTS.FRAMED_PRICES_RECTANGLE).map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => updateInput("framedSize", size)}
                            className={`px-3 py-2 rounded-lg border-2 text-sm font-semibold transition-all ${input.framedSize === size
                              ? "border-emerald-600 bg-emerald-50 text-emerald-600"
                              : "border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:bg-slate-900 text-gray-700 dark:text-gray-300 hover:border-gray-400"
                              }`}
                          >
                            {size.replace("x", "×")} cm
                          </button>
                        ))}
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
                          className="mt-3 p-3 sm:p-4 bg-emerald-50 border border-emerald-200 rounded-lg cursor-pointer hover:bg-emerald-100 transition-colors flex gap-3 items-center group relative touch-manipulation"
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
                            <div className="flex items-center justify-center bg-white dark:bg-slate-900 rounded-md px-2 py-0.5 shadow-sm border border-emerald-100">
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
                )}
              </AccordionStep>

              {/* Pas 3: Grafică */}
              <AccordionStep stepNumber={3} title="Grafică" summary={summaryStep3} isOpen={activeStep === 3} onClick={() => setActiveStep(3)} isLast={true}>
                <div>
                  {productImage ? (
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-20 h-20 rounded-lg bg-white dark:bg-slate-900 p-1 border border-slate-200 shadow-sm shrink-0">
                          <img src={productImage} alt="Model" className="w-full h-full object-cover rounded" />
                        </div>
                        <div>
                          <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-xs font-bold mb-1">MODEL SELECTAT</span>
                          <p className="font-bold text-slate-800 dark:text-slate-200 text-sm leading-tight mb-1">{productTitle}</p>
                          <p className="text-xs text-slate-500">Vom imprima acest model.</p>
                        </div>
                      </div>

                      <div className="border-t border-slate-200 pt-3">
                        <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Vrei să schimbi grafica?</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateInput("designOption", "upload")}
                            className={`flex-1 py-2 px-3 rounded-lg border text-sm font-semibold transition-colors ${input.designOption === 'upload' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white dark:bg-slate-900 border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-gray-50'}`}
                          >
                            Încărcare Fișier
                          </button>
                          <button
                            onClick={() => updateInput("designOption", "pro")}
                            className={`flex-1 py-2 px-3 rounded-lg border text-sm font-semibold transition-colors ${input.designOption === 'pro' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white dark:bg-slate-900 border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-gray-50'}`}
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
                              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Încarcă fotografia ta nouă (JPG, PNG, TIFF):</p>
                              <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white dark:bg-slate-900 border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                                <span className="flex items-center space-x-2"><UploadCloud className="w-6 h-6 text-gray-600 dark:text-gray-400" /><span className="font-medium text-gray-600 dark:text-gray-400">Apasă pentru a încărca</span></span>
                                <input type="file" name="file_upload" className="hidden" onChange={e => handleArtworkFileInput(e.target.files?.[0] ?? null)} />
                              </label>
                              {uploading && <p className="text-sm text-emerald-600">Se încarcă...</p>}
                              {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
                              {artworkUrl && !uploadError && <p className="text-sm text-green-600 font-semibold">Fotografie nouă încărcată!</p>}
                            </div>
                          )}

                          {input.designOption === 'pro' && (
                            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">
                              <p className="font-semibold">Serviciu Editare / Colaj</p>
                              <p>Cost: <strong>{formatMoneyDisplay(CANVAS_CONSTANTS.PRO_DESIGN_FEE)}</strong>. Designerii noștri pot crea un colaj sau retușa grafica nouă.</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="mb-4 border-b border-gray-200 dark:border-slate-800">
                        <div className="flex -mb-px">
                          <TabButton active={input.designOption === 'upload'} onClick={() => updateInput("designOption", 'upload')}>Am Fotografie</TabButton>
                          <TabButton active={input.designOption === 'pro'} onClick={() => updateInput("designOption", 'pro')}>Colaj / Editare</TabButton>
                        </div>
                      </div>

                      {input.designOption === 'upload' && (
                        <div className="space-y-3">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Încarcă fotografia ta (JPG, PNG, TIFF).</p>
                          <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white dark:bg-slate-900 border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                            <span className="flex items-center space-x-2"><UploadCloud className="w-6 h-6 text-gray-600 dark:text-gray-400" /><span className="font-medium text-gray-600 dark:text-gray-400">Apasă pentru a încărca</span></span>
                            <input type="file" name="file_upload" className="hidden" onChange={e => handleArtworkFileInput(e.target.files?.[0] ?? null)} />
                          </label>
                          {uploading && <p className="text-sm text-emerald-600">Se încarcă...</p>}
                          {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
                          {artworkUrl && !uploadError && <p className="text-sm text-green-600 font-semibold">Fotografie încărcată!</p>}
                        </div>
                      )}

                      {input.designOption === 'pro' && (
                        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">
                          <p className="font-semibold">Serviciu Editare / Colaj</p>
                          <p>Cost: <strong>{formatMoneyDisplay(CANVAS_CONSTANTS.PRO_DESIGN_FEE)}</strong>. Designerii noștri pot crea un colaj, retușa fotografia sau adăuga text.</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </AccordionStep>
            </div>
            {/* PREȚ ȘI ADĂUGARE ÎN COȘ - STICKY PE MOBIL */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 p-4 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] lg:static lg:p-8 lg:mt-12 lg:bg-white dark:bg-slate-900 lg:backdrop-blur-none lg:border lg:rounded-3xl lg:shadow-elevated lg:border-slate-200/50 animate-slide-up">
              <div className="hidden lg:block bg-emerald-600/5 border border-emerald-600/10 rounded-2xl p-4 mb-6 text-center backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-600/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <p className="text-emerald-700 font-bold text-sm tracking-tight relative z-10">🎉 Reducere specială 20% aplicată la toate tablourile canvas!</p>
              </div>
              <div className="flex flex-col gap-4 lg:gap-6">
                <div className="flex flex-row justify-between items-center w-full gap-4 lg:border-t lg:border-slate-100 lg:pt-5 lg:mt-2 order-2 lg:order-2">
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] mb-1 lg:mb-1.5 ml-0.5">Preț Configurație</span>
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{formatMoneyDisplay(displayedTotal)}</span>
                  </div>
                  <div className="flex-shrink-0">
                    <DeliveryEstimation />
                  </div>
                </div>
                <button 
                  onClick={handleAddToCart} 
                  className="btn-primary w-full py-4 lg:py-5 text-lg lg:text-xl font-black tracking-tight shadow-emerald-500/20 hover:shadow-emerald-500/30 group relative overflow-hidden order-1 lg:order-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                  <ShoppingCart size={24} className="group-hover:translate-x-1 transition-transform relative z-10 hidden sm:block" />
                  <span className="relative z-10">Adaugă în Coș</span>
                </button>
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

        {/* SECȚIUNE DESCRIERE & FEATURES - FULL WIDTH JOS */}
        <div className="mt-8 lg:mt-12 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-800">
          <nav className="border-b border-gray-200 dark:border-slate-800 flex w-full text-center">
            <button onClick={() => setActiveProductTab('descriere')} className={`flex-1 px-4 py-3 font-medium text-sm transition-colors border-b-2 ${activeProductTab === 'descriere' ? 'border-emerald-600 text-emerald-600 bg-emerald-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 hover:bg-gray-50'}`}>Descriere</button>
            <button onClick={() => setActiveProductTab('recenzii')} className={`flex-1 px-4 py-3 font-medium text-sm transition-colors border-b-2 ${activeProductTab === 'recenzii' ? 'border-emerald-600 text-emerald-600 bg-emerald-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 hover:bg-gray-50'}`}>Recenzii</button>
            <button onClick={() => setActiveProductTab('faq')} className={`flex-1 px-4 py-3 font-medium text-sm transition-colors border-b-2 ${activeProductTab === 'faq' ? 'border-emerald-600 text-emerald-600 bg-emerald-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 hover:bg-gray-50'}`}>FAQ</button>
          </nav>

          <div className="p-6 lg:p-8">

            {activeProductTab === 'descriere' && (
              <>
                {productDescription && (
                  <div className="mb-8 pb-8 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Despre acest model</h2>
                    <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{productDescription}</p>
                  </div>
                )}

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tablouri Canvas Fine Art</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Transformă fotografiile preferate în opere de artă autentice. Tablourile noastre sunt imprimate la rezoluție înaltă pe pânză Canvas Fine Art și întinse manual pe șasiu de lemn.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Materiale & Calitate</h3>
                    <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 mt-1">✓</span>
                        <span><strong>Canvas Fine Art</strong> - pânză bumbac + poliester 330 g/mp</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 mt-1">✓</span>
                        <span><strong>Șasiu lemn</strong> - cadru din lemn de rășinoase, rezistent</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 mt-1">✓</span>
                        <span><strong>Margine oglindită</strong> - imaginea continuă pe laterale</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 mt-1">✓</span>
                        <span><strong>Spray protector UV</strong> - finisaj museum grade</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">De ce să alegi Canvas?</h3>
                    <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 mt-1">✓</span>
                        <span>Reproduceri opere de artă la calitate muzeală</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 mt-1">✓</span>
                        <span>Tablouri și portrete pentru decorare premium</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 mt-1">✓</span>
                        <span>Gata de agățat - sistem de prindere inclus</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 mt-1">✓</span>
                        <span>Livrare în siguranță - ambalaj protectiv special</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Pânză Fine Art</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Textilă de calitate premium, imprimare rezistentă</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Șasiu Lemn Masiv</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Cadru din lemn de rășinoase, gata de atârnat</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Finisaj Museum</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Spray protector UV, culorile rezistă ani de zile</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Ambalaj Protecție</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Livrare în siguranță, cutie carton specială</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeProductTab === 'recenzii' && <Reviews productSlug={productSlug || 'canvas'} />}

            {activeProductTab === 'faq' && <FaqAccordion qa={productFaqs} />}
          </div>
        </div>
      </div>

      {detailsOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setDetailsOpen(false)}>
          <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl shadow-lg border border-gray-200 dark:border-slate-800 p-8" onClick={e => e.stopPropagation()}>
            <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100" onClick={() => setDetailsOpen(false)}><X size={20} className="text-gray-600 dark:text-gray-400" /></button>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Detalii Canvas Fine Art</h3>
            <div className="prose dark:prose-invert prose-sm prose-slate max-w-none">
              <h4>Material Canvas Fine Art</h4>
              <p>Pânză realizată prin combinația de bumbac și poliester pentru imprimări de cea mai bună calitate. Materialul nu se cutează iar la tăiere țesătura nu se destramă.</p>
              <ul>
                <li><strong>Grosime:</strong> 330 g/mp</li>
                <li><strong>Dimensiuni rolă:</strong> lățime 1.03, 1.26, 1.55, 3.10 m; lungime 50 m</li>
              </ul>
              <h4>Finisaj</h4>
              <p>Marginea tabloului este finisată conform selecției tale (Oglindită sau Albă cu semne de pliere).</p>
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

      {/* Related Products Section */}
      <RelatedProducts category="canvas" />
    </div>
  );
}



