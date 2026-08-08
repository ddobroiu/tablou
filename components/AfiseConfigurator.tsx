"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/ToastProvider";
import Image from "next/image";
import { Ruler, Layers, Plus, Minus, ShoppingCart, Info, ChevronDown, X, UploadCloud, MessageCircle, TrendingUp, Percent } from "lucide-react";
import { NumberInput } from "@/components/ui/NumberInput";

import DeliveryEstimation from "./DeliveryEstimation";
import FaqAccordion from "./FaqAccordion";
import Reviews from "./Reviews";

import QuickNav from "@/components/QuickNav";
import RelatedProducts from "./RelatedProducts";
import { useUserActivityTracking } from "@/hooks/useAbandonedCartCapture";
import { QA } from "@/types";
import {
  calculatePosterPrice,
  getAfiseUpsell,
  AFISE_CONSTANTS,
  formatMoneyDisplay,
  type PriceInputAfise
} from "@/lib/pricing";

const GALLERY_BASE = ["/products/afise/afise-1.webp", "/products/afise/afise-2.webp", "/products/afise/afise-3.webp", "/products/afise/afise-4.webp"] as const;

const afiseFaqs: QA[] = [
  { question: "Ce tipuri de hârtie pot alege?", answer: "Oferim o varietate de hârtii, de la cele subțiri (150g) pentru volume mari, la cartoane de 300g pentru un aspect premium. De asemenea, avem materiale speciale precum Blueback pentru lipire pe panouri sau hârtie foto." },
  { question: "Care este diferența dintre Blueback și Whiteback?", answer: "Hârtia Blueback are spatele albastru și este opacă, fiind ideală pentru lipirea peste alte afișe. Whiteback are spatele alb și este folosită pentru postere de interior." },
  { question: "Ce înseamnă preț în funcție de tiraj?", answer: "Prețul pe bucata scade pe măsură ce comandați o cantitate mai mare. Puteți vedea exact prețul unitar calculat în sumarul comenzii." },
  { question: "Cât durează producția?", answer: "Producția durează 1-2 zile lucrătoare. Livrarea prin curier rapid mai adaugă încă 1-2 zile, în funcție de localitatea de destinație." },
  { question: "Cum trimit grafica?", answer: "Încărcați fișierul direct în configurator. Acceptăm formate PDF, AI, CDR, TIFF sau JPG la rezoluție bună (300 dpi recomandat)." },
];

/* --- UI COMPONENTS --- */
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

const ProductTabs = ({ productSlug, productDescription }: { productSlug: string; productDescription?: string }) => {
  const [activeTab, setActiveTab] = useState("descriere");
  const faqs: QA[] = [
    { question: "Ce tipuri de hârtie pot alege?", answer: "Oferim o varietate de hârtii, de la cele subțiri (150g) pentru volume mari, la cartoane de 300g pentru un aspect premium. De asemenea, avem materiale speciale precum Blueback pentru lipire pe panouri sau hârtie foto." },
    { question: "Care este diferența dintre Blueback și Whiteback?", answer: "Hârtia Blueback are spatele albastru și este opacă, fiind ideală pentru lipirea peste alte afișe. Whiteback are spatele alb și este folosită pentru postere de interior." },
    { question: "Ce înseamnă preț în funcție de tiraj?", answer: "Prețul pe bucată scade pe măsură ce comandați o cantitate mai mare. Puteți vedea exact prețul unitar calculat în sumarul comenzii." },
  ];
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-800">
      <nav className="border-b border-gray-200 dark:border-slate-800 flex">
        <TabButtonSEO active={activeTab === "descriere"} onClick={() => setActiveTab("descriere")}>Descriere</TabButtonSEO>
        <TabButtonSEO active={activeTab === "recenzii"} onClick={() => setActiveTab("recenzii")}>Recenzii</TabButtonSEO>
        <TabButtonSEO active={activeTab === "faq"} onClick={() => setActiveTab("faq")}>FAQ</TabButtonSEO>
      </nav>
      <div className="p-6">
        {activeTab === 'descriere' && <div className="prose dark:prose-invert max-w-none text-sm">{productDescription ? <p>{productDescription}</p> : <><h3>Afișe și Postere Personalizate</h3><p>Promovează-ți evenimentele sau ofertele cu afișe de înaltă calitate, imprimate pe o gamă variată de materiale. Alege dimensiunea și hârtia potrivită pentru mesajul tău.</p></>}</div>}
        {activeTab === 'recenzii' && <Reviews productSlug={productSlug} />}
        {activeTab === 'faq' && <FaqAccordion qa={faqs} />}
      </div>
    </div>
  );
};

const TabButtonSEO = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (<button onClick={onClick} className={`flex-1 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${active ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 hover:border-gray-300'}`}>{children}</button>);


function OptionButton({ active, onClick, title, subtitle }: { active: boolean; onClick: () => void; title: string; subtitle?: string; }) {
  return <button type="button" onClick={onClick} className={`w-full text-left p-3 rounded-lg border-2 transition-all text-sm ${active ? "border-emerald-600 bg-emerald-50" : "border-gray-300 bg-white hover:border-gray-400"}`}><div className="font-bold text-gray-800">{title}</div>{subtitle && <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{subtitle}</div>}</button>;
}

export default function AfiseConfigurator({ productSlug, initialWidth, initialHeight, productImage, productTitle, productDescription }: { productSlug?: string; initialWidth?: number; initialHeight?: number; productImage?: string; productTitle?: string; productDescription?: string }) {
  const { addItem } = useCart();
  const GALLERY = useMemo(() => productImage ? [productImage, ...GALLERY_BASE.slice(1)] : GALLERY_BASE, [productImage]);
  const [size, setSize] = useState<string>("A2");
  const [material, setMaterial] = useState<string>("whiteback_150_material");
  const [quantity, setQuantity] = useState<number>(50);
  const [activeProductTab, setActiveProductTab] = useState("descriere");
  // Setează dimensiuni inițiale dacă sunt furnizate
  useEffect(() => {
    if (initialWidth) {
      // Poți folosi initialWidth pentru logica custom (ex: setare dimensiune)
      // Exemplu: setSize('custom') sau altă logică specifică
    }
    if (initialHeight) {
      // Similar pentru initialHeight
    }
  }, [initialWidth, initialHeight]);
  const [designOption, setDesignOption] = useState<"upload" | "pro">("upload");

  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeImage, setActiveImage] = useState<string>(GALLERY[0] || "/placeholder.png");

  useEffect(() => {
    if (GALLERY.length > 0 && !activeImage) {
      setActiveImage(GALLERY[0]);
    }
  }, [GALLERY, activeImage]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [userEmail, setUserEmail] = useState<string>('');
  const toast = useToast();

  // Helper: Check validity of material for current size
  function isMaterialVisibleForSize(mKey: string, sKey: string) {
    // Materialele de hârtie standard sunt disponibile pe toate formatele
    if (mKey.startsWith("paper_")) return true;

    // Pentru materiale speciale (blueback, satin etc), verificăm în tabela de prețuri
    const matTable = AFISE_CONSTANTS.PRICE_TABLE[mKey];
    return !!(matTable && matTable[sKey]);
  }

  // Reset material if not available for new size
  useEffect(() => {
    if (!isMaterialVisibleForSize(material, size)) {
      setMaterial("paper_150_lucioasa");
    }
  }, [size, material]);

  // Pricing Calculation
  const priceData = useMemo(() => calculatePosterPrice({ size, material, quantity, designOption }), [size, material, quantity, designOption]);
  const displayedTotal = priceData.finalPrice;

  const upsellOpportunity = useMemo(() => {
    return getAfiseUpsell({ size, material, quantity, designOption });
  }, [size, material, quantity, designOption]);

  // Auto-capture abandoned carts
  const cartData = useMemo(() => ({
    configuratorId: 'afise',
    email: userEmail,
    configuration: { size, material, quantity, designOption, artworkUrl },
    price: displayedTotal,
    quantity: quantity
  }), [userEmail, size, material, quantity, designOption, artworkUrl, displayedTotal]);

  useUserActivityTracking(cartData);

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
    } catch (e: any) {
      setUploadError(e?.message ?? "Eroare la upload");
    } finally {
      setUploading(false);
    }
  };

  function handleAddToCart() {
    if (displayedTotal <= 0) {
      toast.warning("Combinație invalidă.");
      return;
    }

    const selectedMaterialLabel = AFISE_CONSTANTS.MATERIALS.find(m => m.key === material)?.label || material;
    const selectedSizeLabel = AFISE_CONSTANTS.SIZES.find(s => s.key === size)?.label || size;

    addItem({
      id: `${productSlug ?? 'afise'}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      productId: productSlug ?? "afise",
      slug: productSlug ?? "afise",
      title: `Afiș ${selectedSizeLabel} - ${selectedMaterialLabel}`,
      price: displayedTotal / quantity,
      quantity,
      metadata: {
        "Dimensiune": selectedSizeLabel,
        "Material": selectedMaterialLabel,
        "Tiraj": `${quantity} buc`,
        "Grafică": designOption === 'pro' ? "Vreau grafică" : "Grafică proprie",
        ...(designOption === 'pro' && { "Cost grafică": formatMoneyDisplay(priceData.proFee) }),
        artworkUrl,
      },
    });

  }

  const summaryStep1 = `${AFISE_CONSTANTS.SIZES.find(s => s.key === size)?.label}, ${quantity} buc.`;
  const summaryStep2 = AFISE_CONSTANTS.MATERIALS.find(m => m.key === material)?.label || "Selectat";
  const summaryStep3 = designOption === 'upload' ? 'Grafică proprie' : 'Design Pro';

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % GALLERY.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setActiveImage(GALLERY[activeIndex]);
  }, [activeIndex, GALLERY]);

  useEffect(() => {
    // Dacă utilizatorul a venit cu o imagine specifică, poate nu vrem slideshow automat?
    // Sau dacă vrem, trebuie să ne asigurăm că folosim galeria curentă.
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % GALLERY.length);
    }, 3000);
    return () => clearInterval(id);
  }, [GALLERY]);

  return (
    <main className="bg-slate-50 dark:bg-slate-800 min-h-screen">
      <div className="container mx-auto px-4 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="lg:sticky top-24 h-max space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-800 overflow-hidden">
              <div className="aspect-square bg-slate-50 dark:bg-slate-800 relative flex items-center justify-center overflow-hidden">
                <Image 
                  src={activeImage} 
                  alt="Afiș" 
                  fill
                  className="object-cover" 
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
              <div className="p-2 grid grid-cols-4 gap-2">
                {GALLERY.map((src, i) => (
                  <button 
                    key={src} 
                    onClick={() => setActiveIndex(i)} 
                    className={`relative rounded-lg aspect-square overflow-hidden ${activeIndex === i ? "ring-2 ring-offset-2 ring-emerald-500" : "hover:opacity-80"}`}
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
            </div>
          </div>
          <div>
            <header className="mb-6">
              <div className="flex justify-between items-center gap-4 mb-3"><h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">{productTitle || "Configurator Afișe"}</h1></div>
              <div className="flex justify-between items-center">
                <p className="text-gray-600 dark:text-gray-400">Personalizează opțiunile în 3 pași simpli.</p>
                <button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline inline-flex items-center text-sm px-3 py-1.5">
                  <Info size={16} /><span className="ml-2">Detalii</span>
                </button>
              </div>
            </header>
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-800 px-4">
              <AccordionStep stepNumber={1} title="Dimensiune & Tiraj" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="field-label">Dimensiune</label>
                    <select value={size} onChange={(e) => setSize(e.target.value)} className="input w-full mt-2">
                      {AFISE_CONSTANTS.SIZES.map((s: any) => <option key={s.key} value={s.key}>{s.label} — {s.dims}</option>)}
                    </select>
                  </div>
                  <NumberInput label="Tiraj (buc)" value={quantity} onChange={setQuantity} />
                </div>
                {upsellOpportunity && (
                  <div
                    className="mt-3 p-3 sm:p-4 bg-emerald-50 border border-emerald-200 rounded-lg cursor-pointer hover:bg-emerald-100 transition-colors flex gap-3 items-center group relative"
                    onClick={() => setQuantity(upsellOpportunity.requiredQty)}
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
              </AccordionStep>
              <AccordionStep stepNumber={2} title="Material" summary={summaryStep2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)}>
                <div className="grid grid-cols-2 gap-2">
                  {AFISE_CONSTANTS.MATERIALS.filter(m => isMaterialVisibleForSize(m.key, size)).map(m => (
                    <OptionButton key={m.key} active={material === m.key} onClick={() => setMaterial(m.key)} title={m.label} subtitle={m.description} />
                  ))}
                </div>
              </AccordionStep>
              <AccordionStep stepNumber={3} title="Grafică" summary={summaryStep3} isOpen={activeStep === 3} onClick={() => setActiveStep(3)} isLast={true}>
                {productImage ? (
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-20 h-20 relative rounded-lg bg-white p-1 border border-slate-200 shadow-sm shrink-0 overflow-hidden">
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
                        <p className="font-bold text-slate-800 dark:text-slate-200 text-sm leading-tight mb-1">{productTitle || "Imagine selectată din galerie"}</p>
                        <p className="text-xs text-slate-500">Vom imprima acest model.</p>
                      </div>
                    </div>

                    <div className="border-t border-slate-200 pt-3">
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Vrei să schimbi grafica?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setDesignOption("upload")}
                          className={`flex-1 py-2 px-3 rounded-lg border text-sm font-semibold transition-colors ${designOption === 'upload' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-slate-50 dark:bg-slate-800'}`}
                        >
                          Încărcare Fișier
                        </button>
                        <button
                          onClick={() => setDesignOption("pro")}
                          className={`flex-1 py-2 px-3 rounded-lg border text-sm font-semibold transition-colors ${designOption === 'pro' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-slate-50 dark:bg-slate-800'}`}
                        >
                          Vreau Grafică
                        </button>
                      </div>
                      {designOption !== 'upload' && designOption !== 'pro' && (
                        <p className="text-xs text-slate-400 mt-2 italic">Selectează o opțiune de mai sus pentru a înlocui modelul standard.</p>
                      )}
                    </div>

                    {/* CONDITIONAL RENDER FOR OVERRIDE OPTIONS */}
                    {(designOption === 'upload' || designOption === 'pro') && (
                      <div className="mt-4 pt-4 border-t border-slate-200 animate-fade-in-up">
                        {designOption === 'upload' && (
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

                        {designOption === 'pro' && (
                          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">
                            <p className="font-semibold">Serviciu de Grafică Profesională</p>
                            <p>Cost: <strong>{formatMoneyDisplay(priceData.proFee)}</strong>. Veți fi contactat pentru detalii.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                      <OptionButton active={designOption === "upload"} onClick={() => setDesignOption("upload")} title="Am Grafică" subtitle="Încarc fișierul" />
                      <OptionButton active={designOption === "pro"} onClick={() => setDesignOption("pro")} title="Vreau Grafică" subtitle={`Cost: ${formatMoneyDisplay(priceData.proFee)}`} />
                    </div>
                    {designOption === 'upload' && (
                      <div className="mt-4">
                        <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                          <span className="flex items-center space-x-2">
                            <UploadCloud className="w-6 h-6 text-gray-600 dark:text-gray-400" /><span className="font-medium text-gray-600 dark:text-gray-400">Apasă pentru a încărca</span>
                          </span>
                          <input type="file" name="file_upload" className="hidden" onChange={e => handleArtworkFileInput(e.target.files?.[0] ?? null)} />
                        </label>
                        {uploading && <p className="text-sm text-emerald-600">Se încarcă...</p>}
                        {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
                        {artworkUrl && !uploadError && <p className="text-sm text-green-600 font-semibold">Grafică încărcată!</p>}
                      </div>
                    )}
                    {designOption === 'pro' && (
                      <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">
                        <p className="font-semibold">Serviciu de Grafică Profesională</p>
                        <p>Cost: <strong>{formatMoneyDisplay(priceData.proFee)}</strong>. Veți fi contactat pentru detalii.</p>
                      </div>
                    )}
                  </>
                )}
              </AccordionStep>
            </div>
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
                  href="https://wa.me/40750473111?text=Ma%20intereseaza%20configuratorul%20afise"
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
                {productDescription && <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed text-base lg:text-lg">{productDescription}</p>}
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Afișe și Postere Personalizate</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Promovează-ți evenimentele sau ofertele cu afișe de înaltă calitate, imprimate pe o gamă variată de materiale.
                  Alege dimensiunea și hârtia potrivită pentru mesajul tău.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Materiale & Calitate</h3>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-start">
                        <span className="text-emerald-600 mr-2">✓</span>
                        <span><strong>Whiteback 150g-300g:</strong> Hârtie standard pentru postere de interior, de la subțire la carton gros</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-emerald-600 mr-2">✓</span>
                        <span><strong>Blueback:</strong> Hârtie opacă cu spate albastru, ideală pentru lipire pe panouri outdoor</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-emerald-600 mr-2">✓</span>
                        <span><strong>Hârtie Foto 220g:</strong> Finish lucios pentru imagini de impact maxim</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">De ce să alegi afișele noastre?</h3>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span><strong>Print Offset & Digital:</strong> Calitate fotografică garantată</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span><strong>Reduceri la Volum:</strong> Prețul scade automat la cantități mari</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span><strong>Livrare Rapidă:</strong> Producție 1-2 zile + curier express</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* 4 SIMBOLURI */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Print Offset & Digital</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Calitate fotografică pe hârtie premium 150-350g</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Materiale Diverse</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">De la hârtie standard la foto lucioasă sau blueback outdoor</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Prețuri Mici, Cantități Mari</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Reduceri automate la comenzi mai mari, calcul instant</p>
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
                      <p className="text-sm text-gray-600 dark:text-gray-400">Producție rapidă + curier național express</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* TAB RECENZII */}
            {activeProductTab === 'recenzii' && <Reviews productSlug={productSlug || 'afise'} />}

            {/* TAB FAQ */}
            {activeProductTab === 'faq' && <FaqAccordion qa={afiseFaqs} />}
          </div>
        </div>
      </div>

      {/* NAVIGARE RAPIDĂ */}
      <div className="container mx-auto px-4 mt-12 mb-8">
        <QuickNav title="Vrei să personalizezi alt produs?" />
      </div>



      {/* Related Products Section */}
      <RelatedProducts category="afise" />

      {detailsOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setDetailsOpen(false)}>
          <div className="relative z-10 w-full max-w-2xl bg-white text-slate-900 dark:text-white rounded-2xl shadow-lg border border-gray-200 dark:border-slate-800 p-8" onClick={e => e.stopPropagation()}>
            <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100" onClick={() => setDetailsOpen(false)} aria-label="Închide"><X size={20} className="text-gray-600 dark:text-gray-400" /></button>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Detalii Afișe</h3>
            <div className="prose dark:prose-invert prose-sm prose-slate max-w-none">
              <h4>Materiale Disponibile</h4>
              <p>Alegeți dintr-o gamă variată de hârtii și cartoane, de la cele standard de 150g, la materiale premium precum hârtia foto de 220g sau cartonul de 300g. Pentru aplicații outdoor sau pe panouri, recomandăm hârtia Blueback.</p>
              <h4>Specificații Tehnice</h4>
              <p>Afișele sunt imprimate color (policromie) la o calitate superioară. Pentru o acuratețe maximă a culorilor, vă rugăm să trimiteți grafica în format CMYK. Rezoluția recomandată este de 300 dpi.</p>
              <h4>Serviciu de Grafică</h4>
              <p>Dacă nu aveți un design pregătit, echipa noastră vă stă la dispoziție pentru a crea o machetă profesională. Costul pentru acest serviciu este fix.</p>
            </div>
          </div>
        </div>
      )}


    </main>
  );
}

