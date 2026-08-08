"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/ToastProvider";
import { Ruler, Layers, Plus, Minus, ShoppingCart, Info, ChevronDown, X, UploadCloud, Upload, TrendingUp, Percent, MessageCircle } from "lucide-react";
import { NumberInput } from "@/components/ui/NumberInput";

import DeliveryEstimation from "./DeliveryEstimation";
import FaqAccordion from "./FaqAccordion";
import Reviews from "./Reviews";
import SmartNewsletterPopup from "./SmartNewsletterPopup";
import { useUserActivityTracking } from "@/hooks/useAbandonedCartCapture";
import QuickNav from "@/components/QuickNav";
import { QA } from "@/types";
import {
  calculateTapetPrice,
  getTapetUpsell,
  TAPET_CONSTANTS,
  formatMoneyDisplay,
  type PriceInputTapet
} from "@/lib/pricing";

const GALLERY_BASE = ["/products/tapet/tapet-1.webp", "/products/tapet/tapet-2.webp", "/products/tapet/tapet-3.webp", "/products/tapet/tapet-4.webp"] as const;

/* --- UI COMPONENTS --- */
const AccordionStep = ({ stepNumber, title, summary, isOpen, onClick, children, isLast = false }: { stepNumber: number; title: string; summary: string; isOpen: boolean; onClick: () => void; children: React.ReactNode; isLast?: boolean; }) => (
  <div className="relative pl-12">
    <div className="absolute top-5 left-0 flex flex-col items-center h-full">
      <span className={`flex items-center justify-center w-8 h-8 rounded-full text-md font-bold transition-colors ${isOpen ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-slate-800 dark:text-gray-300'}`}>{stepNumber}</span>
      {!isLast && <div className="w-px grow bg-slate-100 dark:bg-slate-800 mt-2"></div>}
    </div>
    <div className="flex-1">
      <button type="button" className="w-full flex items-center justify-between py-5 text-left" onClick={onClick}>
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h2>
          {!isOpen && <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{summary}</p>}
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100 pb-5" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  </div>
);

const productFaqs: QA[] = [
  { question: "Ce material folosiți pentru tapet?", answer: "Folosim tapet Dreamscape Vinilic, un material premium din țesătură de poliester cu un coating vinilic, cu o grosime de 400 g/mp. Este ideal pentru un decor interior de înaltă calitate." },
  { question: "Care este diferența dintre varianta cu și fără adeziv?", answer: "Varianta standard necesită aplicarea unui adeziv pentru tapet pe perete. Varianta cu adeziv are un strat auto-adeziv pe spate, similar cu un autocolant, facilitând montajul." },
  { question: "Pot comanda o grafică personalizată?", answer: "Da, puteți încărca propria grafică sau puteți opta pentru serviciul nostru de design profesional, contra unui cost suplimentar de 200 RON." },
];

const TabButtonSEO = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (<button onClick={onClick} className={`flex-1 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${active ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 hover:border-gray-300'}`}>{children}</button>);


function OptionButton({ active, onClick, title, subtitle }: { active: boolean; onClick: () => void; title: string; subtitle?: string; }) {
  return <button type="button" onClick={onClick} className={`w-full text-left p-3 rounded-lg border-2 transition-all text-sm ${active ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" : "border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-gray-400 dark:hover:border-slate-600"}`}><div className="font-bold text-gray-800 dark:text-white">{title}</div>{subtitle && <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{subtitle}</div>}</button>;
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode; }) {
  return <button type="button" onClick={onClick} className={`px-4 py-2 text-sm font-semibold transition-colors rounded-t-lg ${active ? "border-b-2 border-emerald-600 text-emerald-600 bg-emerald-50" : "text-gray-500 hover:text-gray-800"}`}>{children}</button>;
}

type Props = { productSlug?: string; initialWidth?: number; initialHeight?: number; productImage?: string; isCustomImage?: boolean; productTitle?: string; productDescription?: string };

/* --- MAIN COMPONENT --- */
export default function TapetConfigurator({ productSlug, productImage, isCustomImage, productTitle, productDescription }: Props) {
  const { addItem } = useCart();
  const GALLERY = useMemo(() => productImage ? [productImage, ...GALLERY_BASE.slice(1)] : GALLERY_BASE, [productImage]);
  const [input, setInput] = useState<PriceInputTapet>({
    width_cm: 0,
    height_cm: 0,
    quantity: 1,
    want_adhesive: false,
    designOption: "upload",
  });

  const [lengthText, setLengthText] = useState("");
  const [heightText, setHeightText] = useState("");

  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [activeStep, setActiveStep] = useState(1);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeProductTab, setActiveProductTab] = useState<'descriere' | 'recenzii' | 'faq'>('descriere');
  const toast = useToast();

  const [activeIndex, setActiveIndex] = useState<number>(0);
  type GalleryImage = typeof GALLERY[number];
  const [activeImage, setActiveImage] = useState<GalleryImage>(GALLERY[0]);

  // Pricing
  const priceData = useMemo(() => calculateTapetPrice(input), [input]);
  const displayedTotal = priceData.finalPrice;

  // Upsell Logic
  const upsellOpportunity = useMemo(() => getTapetUpsell(input), [input]);

  const updateInput = <K extends keyof PriceInputTapet>(k: K, v: PriceInputTapet[K]) => setInput((p) => ({ ...p, [k]: v }));
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
    if (!input.width_cm || !input.height_cm) {
      toast.warning("Introduceți dimensiunile peretelui."); return;
    }
    if (displayedTotal <= 0) {
      toast.warning("Prețul trebuie calculat."); return;
    }

    const unitPrice = Math.round((displayedTotal / input.quantity) * 100) / 100;
    const uniqueId = `${productSlug ?? 'tapet'}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    addItem({
      id: uniqueId,
      productId: productSlug ?? "tapet",
      slug: productSlug ?? "tapet",
      title: `Tapet personalizat ${input.width_cm}x${input.height_cm} cm`,
      price: unitPrice,
      quantity: input.quantity,
      currency: "RON",
      metadata: {
        "Dimensiune": `${input.width_cm}x${input.height_cm} cm`,
        "Suprafață": `${priceData.total_sqm} mp`,
        "Finisaj": input.want_adhesive ? "Auto-adeziv" : "Standard (fără adeziv)",
        "Grafică": input.designOption === 'pro' ? 'Vreau grafică' : 'Grafică proprie',
        ...(input.designOption === 'pro' && { "Cost grafică": formatMoneyDisplay(TAPET_CONSTANTS.PRO_DESIGN_FEE) }),
        artworkUrl,
      },
    });
  }

  useEffect(() => {
    const id = setInterval(() => setActiveIndex((i) => (i + 1) % GALLERY.length), 3000);
    return () => clearInterval(id);
  }, [GALLERY]);
  useEffect(() => setActiveImage(GALLERY[activeIndex]), [activeIndex, GALLERY]);

  const summaryStep1 = input.width_cm > 0 && input.height_cm > 0 ? `${input.width_cm}x${input.height_cm}cm` : "Alege";
  const summaryStep2 = input.want_adhesive ? "Auto-adeziv" : "Standard";
  const summaryStep3 = input.designOption === 'upload' ? 'Grafică proprie' : 'Design Pro';

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="lg:sticky top-24 h-max space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-800 overflow-hidden">
              <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                <img src={activeImage} alt="Tapet" className="h-full w-full object-cover" />
              </div>
              <div className="p-2 grid grid-cols-4 gap-2">
                {GALLERY.map((src, i) => <button key={src} onClick={() => setActiveIndex(i)} className={`relative rounded-lg aspect-square ${activeIndex === i ? "ring-2 ring-offset-2 ring-emerald-500" : "hover:opacity-80"}`} aria-label={`Selectează imaginea ${i + 1} pentru tapet`}><img src={src} alt="Thumb" className="w-full h-full object-cover" /></button>)}
              </div>
            </div>
          </div>
          <div>
            <header className="mb-6">
              <div className="flex justify-between items-center gap-4 mb-3"><h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{productTitle || "Configurator Tapet"}</h1></div>
              <div className="flex justify-between items-center"><p className="text-gray-600 dark:text-gray-400">Personalizează peretele în 3 pași simpli.</p><button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline inline-flex items-center text-sm px-3 py-1.5"><Info size={16} /><span className="ml-2">Detalii</span></button></div>
            </header>
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-800 px-4">
              <AccordionStep stepNumber={1} title="Dimensiuni Perete" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="field-label">Lățime (cm)</label><input type="text" inputMode="numeric" value={lengthText} onChange={(e) => onChangeLength(e.target.value)} placeholder="ex: 300" className="input" /></div>
                  <div><label className="field-label">Înălțime (cm)</label><input type="text" inputMode="numeric" value={heightText} onChange={(e) => onChangeHeight(e.target.value)} placeholder="ex: 250" className="input" /></div>
                  <div className="md:col-span-2">
                    <NumberInput label="Nr. Pereți (identici)" value={input.quantity} onChange={setQty} />

                    {/* UPSELL ALERT */}
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
              </AccordionStep>

              <AccordionStep stepNumber={2} title="Tip Material" summary={summaryStep2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)}>
                <div className="grid grid-cols-2 gap-2">
                  <OptionButton active={!input.want_adhesive} onClick={() => updateInput("want_adhesive", false)} title="Standard" subtitle="Aplicare cu adeziv" />
                  <OptionButton active={input.want_adhesive} onClick={() => updateInput("want_adhesive", true)} title="Auto-adeziv" subtitle="Fără adeziv separat" />
                </div>
              </AccordionStep>

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
                          <p className="font-bold text-slate-800 dark:text-slate-200 text-sm leading-tight mb-1">{productTitle || "Imagine selectată din galerie"}</p>
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
                            Vreau Grafică
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
                              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Încarcă fișierul tău nou:</p>
                              <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white dark:bg-slate-900 border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                                <span className="flex items-center space-x-2"><UploadCloud className="w-6 h-6 text-gray-600 dark:text-gray-400" /><span className="font-medium text-gray-600 dark:text-gray-400">Apasă pentru a încărca</span></span>
                                <input type="file" name="file_upload" className="hidden" onChange={e => handleArtworkFileInput(e.target.files?.[0] ?? null)} />
                              </label>
                              {uploading && <p className="text-sm text-emerald-600">Se încarcă...</p>}
                              {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
                              {artworkUrl && !uploadError && <p className="text-sm text-green-600 font-semibold">Fișier nou încărcat cu succes!</p>}
                            </div>
                          )}

                          {input.designOption === 'pro' && (
                            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">
                              <p className="font-semibold">Serviciu de Grafică Profesională</p>
                              <p>Cost: <strong>{formatMoneyDisplay(TAPET_CONSTANTS.PRO_DESIGN_FEE)}</strong>. Veți fi contactat pentru detalii.</p>
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
                          <TabButton active={input.designOption === 'pro'} onClick={() => updateInput("designOption", 'pro')}>Vreau Grafică</TabButton>
                        </div>
                      </div>

                      {input.designOption === 'upload' && (
                        <div className="space-y-3">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Încarcă fotografia ta (JPG, TIFF, rezoluție mare).</p>
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
                          <p className="font-semibold">Serviciu de Design</p>
                          <p>Cost: <strong>{formatMoneyDisplay(TAPET_CONSTANTS.PRO_DESIGN_FEE)}</strong>. Designerii noștri vor căuta imaginea perfectă sau vor crea un model personalizat.</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </AccordionStep>
            </div>
            <div className="static mt-8 lg:static bg-white dark:bg-slate-900/80 lg:bg-white dark:bg-slate-900/80 dark:lg:bg-slate-900 backdrop-blur-sm lg:backdrop-blur-none border-t-2 lg:border lg:rounded-2xl lg:shadow-lg border-gray-200 dark:border-slate-800 py-4 lg:p-6 lg:mt-8">
              <div className="flex flex-col gap-3">
                <button onClick={handleAddToCart} className="w-full py-4 text-lg font-bold bg-emerald-600 text-white rounded-xl shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-emerald-500/20">
                  <ShoppingCart size={24} />
                  Adaugă în Coș
                </button>
                <div className="flex flex-row justify-between items-center w-full gap-2 pt-1 mt-1 border-t border-gray-100">
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Preț Total</span>
                    <span className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{formatMoneyDisplay(displayedTotal)}</span>
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
                  href="https://wa.me/40750473111?text=Ma%20intereseaza%20configuratorul%20tapet"
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
          <nav className="border-b border-gray-200 dark:border-slate-800 flex">
            <button onClick={() => setActiveProductTab('descriere')} className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${activeProductTab === 'descriere' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300'}`}>Descriere</button>
            <button onClick={() => setActiveProductTab('recenzii')} className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${activeProductTab === 'recenzii' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300'}`}>Recenzii</button>
            <button onClick={() => setActiveProductTab('faq')} className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${activeProductTab === 'faq' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300'}`}>FAQ</button>
          </nav>

          <div className="p-6 lg:p-8">

            {activeProductTab === 'descriere' && (
              <>
                {productDescription && <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed text-base lg:text-lg">{productDescription}</p>}

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tapet Personalizat Dreamscape Vinilic</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Creați un ambient unic cu tapetul nostru personalizat. Ideal pentru spații rezidențiale, birouri sau comerciale, tapetul Dreamscape Vinilic transformă orice perete într-o operă de artă. Imprimat la calitate fotografică, este rezistent și ușor de întreținut.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Materiale & Calitate</h3>
                    <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 mt-1">✓</span>
                        <span><strong>Dreamscape Vinilic</strong> - țesătură poliester + coating vinilic 400 g/mp</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 mt-1">✓</span>
                        <span><strong>Print HD</strong> - imprimare fotografică, culori vibrante</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 mt-1">✓</span>
                        <span><strong>Textil non-woven</strong> - rezistent, lavabil, ecologic</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 mt-1">✓</span>
                        <span><strong>Cu sau fără adeziv</strong> - alegi varianta potrivită pentru tine</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">De ce să alegi Tapet?</h3>
                    <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 mt-1">✓</span>
                        <span>Dimensiuni personalizate - măsurăm exact peretele tău</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 mt-1">✓</span>
                        <span>Montaj ușor DIY - cu sau fără adeziv inclus</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 mt-1">✓</span>
                        <span>Perfect pentru decor interior rezidențial sau comercial</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 mt-1">✓</span>
                        <span>Livrare în fâșii numerotate pentru îmbinare perfectă</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Print HD Personalizat</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Orice imagine, rezoluție fotografică, design unic</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Material Textil Premium</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Tapet textil non-woven, rezistent și ecologic</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Dimensiuni Personalizate</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Măsurăm exact peretele tău, fără limite</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Montaj Ușor</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Include adeziv special, montare rapidă DIY</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeProductTab === 'recenzii' && <Reviews productSlug={productSlug || 'tapet'} />}

            {activeProductTab === 'faq' && <FaqAccordion qa={productFaqs} />}
          </div>
        </div>
      </div>

      {/* NAVIGARE RAPIDĂ */}
      <div className="container mx-auto px-4 mt-12 mb-8">
        <QuickNav title="Vrei să personalizezi alt produs?" />
      </div>

      {detailsOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setDetailsOpen(false)}>
          <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl shadow-lg border border-gray-200 dark:border-slate-800 p-8" onClick={e => e.stopPropagation()}>
            <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100" onClick={() => setDetailsOpen(false)} aria-label="Închide detaliile produsului"><X size={20} className="text-gray-600 dark:text-gray-400" /></button>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Detalii Tapet</h3>
            <div className="prose dark:prose-invert prose-sm prose-slate max-w-none">
              <h4>Material Premium</h4>
              <p>Tapet Dreamscape Vinilic, textură fină, 400 g/mp. Lavabil și rezistent.</p>
              <h4>Aplicație</h4>
              <p>Se livrează în fâșii numerotate, cu suprapunere de 2cm pentru îmbinare perfectă (double-cut).</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



