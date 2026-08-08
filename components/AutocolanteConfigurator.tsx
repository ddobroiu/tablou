"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/ToastProvider";
import { Ruler, Layers, Plus, Minus, ShoppingCart, Info, ChevronDown, X, UploadCloud, TrendingUp, Percent, MessageCircle } from "lucide-react";
import { NumberInput } from "@/components/ui/NumberInput";

import DeliveryEstimation from "./DeliveryEstimation";
import { usePathname, useRouter } from "next/navigation";
import FaqAccordion from "./FaqAccordion";
import Reviews from "./Reviews";
import SmartNewsletterPopup from "./SmartNewsletterPopup";
import RelatedProducts from "./RelatedProducts";
import QuickNav from "@/components/QuickNav";
import { useUserActivityTracking } from "@/hooks/useAbandonedCartCapture";
import { QA } from "@/types";
import {
  calculateAutocolantePrice,
  getAutocolanteUpsell,
  AUTOCOLANTE_CONSTANTS,
  formatMoneyDisplay,
  type PriceInputAutocolante,
  type AutocolantesMaterialKey
} from "@/lib/pricing";

const GALLERY_BASE = [
  "/products/autocolante/autocolante-1.webp",
  "/products/autocolante/autocolante-2.webp",
  "/products/autocolante/autocolante-3.webp",
  "/products/autocolante/autocolante-4.webp"
] as const;

/* --- FAQs SPECIFIC PRODUSULUI --- */
const productFaqs: QA[] = [
  { question: "Care este diferența dintre hârtie și vinyl?", answer: "Hârtia este economică și potrivită pentru interior sau etichete de produs de scurtă durată. Vinyl-ul (PVC) este plastic, rezistent la apă și rupere, ideal pentru exterior sau produse care intră în contact cu umezeala." },
  { question: "Ce înseamnă 'Die-cut' (tăiere pe contur)?", answer: "Die-cut înseamnă că autocolantul este tăiat exact pe forma graficii tale (ex: rotund, stea, formă liberă), nu doar dreptunghiular. Este perfect pentru logo-uri și forme personalizate." },
  { question: "Laminarea este necesară?", answer: "Laminarea adaugă un strat de protecție transparent. Recomandăm laminarea pentru autocolantele expuse la soare, frecare sau umezeală intensă, pentru a prelungi durata de viață." },
  { question: "Pe ce suprafețe pot aplica autocolantele?", answer: "Autocolantele noastre aderă excelent pe sticlă, metal, plastic, lemn vopsit, pereți netezi. Pentru suprafețe cu texturi rugose sau poroase (cărămidă, beton nefinisit), recomandăm testare prealabilă." },
  { question: "Cât timp rezistă autocolantele în exterior?", answer: "Cu material vinyl și laminare, autocolantele rezistă 5-7 ani în exterior, păstrându-și culorile vibrante datorită cernelurilor UV-rezistente." },
];

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



const TabButtonSEO = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (<button onClick={onClick} className={`flex-1 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${active ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 hover:border-gray-300'}`}>{children}</button>);


function OptionButton({ active, onClick, title, subtitle }: { active: boolean; onClick: () => void; title: string; subtitle?: string; }) {
  return <button type="button" onClick={onClick} className={`w-full text-left p-3 rounded-lg border-2 transition-all text-sm ${active ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" : "border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-gray-400 dark:hover:border-slate-600"}`}><div className="font-bold text-gray-800 dark:text-white">{title}</div>{subtitle && <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{subtitle}</div>}</button>;
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode; }) {
  return <button type="button" onClick={onClick} className={`px-4 py-2 text-sm font-semibold transition-colors rounded-t-lg ${active ? "border-b-2 border-emerald-600 text-emerald-600 bg-emerald-50" : "text-gray-500 hover:text-gray-800"}`}>{children}</button>;
}

type Props = { productSlug?: string; initialWidth?: number; initialHeight?: number; productImage?: string; isCustomImage?: boolean; productTitle?: string; productDescription?: string };

/* --- MAIN COMPONENT --- */
export default function AutocolanteConfigurator({ productSlug, initialWidth: initW, initialHeight: initH, productImage, isCustomImage, productTitle, productDescription }: Props) {
  const { addItem } = useCart();
  const GALLERY = useMemo(() => productImage ? [productImage, ...GALLERY_BASE.slice(1)] : GALLERY_BASE, [productImage]);

  const getMinQty = (widthCm: number, heightCm: number) => {
    if (widthCm > 0 && heightCm > 0 && widthCm <= 10 && heightCm <= 10) return 50;
    return 1;
  };

  const [input, setInput] = useState<PriceInputAutocolante>({
    width_cm: initW ?? 0,
    height_cm: initH ?? 0,
    quantity: 1,
    material: "oracal_3641",
    print_type: "print_cut",
    laminated: false,
    transfer_film: false,
    designOption: "upload",
  });



  const [lengthText, setLengthText] = useState(initW && initW > 0 ? String(initW) : "");
  const [heightText, setHeightText] = useState(initH && initH > 0 ? String(initH) : "");

  const [activeImage, setActiveImage] = useState<string>(GALLERY[0] || "/placeholder.png");
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    if (GALLERY.length > 0 && !activeImage) {
      setActiveImage(GALLERY[0]);
    }
  }, [GALLERY, activeImage]);

  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [textDesign, setTextDesign] = useState<string>("");

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [activeProductTab, setActiveProductTab] = useState("descriere");
  const [userEmail, setUserEmail] = useState<string>('');
  const toast = useToast();

  // Pricing
  const priceData = useMemo(() => calculateAutocolantePrice(input), [input]);
  const displayedTotal = priceData.finalPrice;

  // Upsell Logic
  const upsellOpportunity = useMemo(() => {
    const result = getAutocolanteUpsell(input);
    console.log('🔍 AUTOCOLANTE UPSELL DEBUG:', { input, result });
    return result;
  }, [input]);

  // Auto-capture abandoned carts
  const cartData = useMemo(() => ({
    configuratorId: 'autocolante',
    email: userEmail,
    configuration: { ...input, artworkUrl, textDesign },
    price: displayedTotal,
    quantity: input.quantity
  }), [userEmail, input, artworkUrl, textDesign, displayedTotal]);

  useUserActivityTracking(cartData);

  const updateInput = <K extends keyof PriceInputAutocolante>(k: K, v: PriceInputAutocolante[K]) => setInput((p) => ({ ...p, [k]: v }));
  const setQty = (v: number) => {
    const minQty = getMinQty(input.width_cm, input.height_cm);
    updateInput("quantity", Math.max(minQty, Math.floor(v)));
  };
  const onChangeLength = (v: string) => { const d = v.replace(/\D/g, ""); setLengthText(d); updateInput("width_cm", d === "" ? 0 : parseInt(d, 10)); };
  const onChangeHeight = (v: string) => { const d = v.replace(/\D/g, ""); setHeightText(d); updateInput("height_cm", d === "" ? 0 : parseInt(d, 10)); };

  useEffect(() => {
    const minQty = getMinQty(input.width_cm, input.height_cm);
    if (input.quantity < minQty) {
      updateInput("quantity", minQty);
    }
  }, [input.width_cm, input.height_cm]);

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
      toast.warning("Te rugăm să introduci dimensiunile.");
      return;
    }
    if (displayedTotal <= 0) {
      toast.warning("Prețul trebuie calculat.");
      return;
    }

    const materialDef = AUTOCOLANTE_CONSTANTS.MATERIALS.find(m => m.key === input.material);
    const materialLabel = materialDef?.label || input.material;
    const unitPrice = Math.round((displayedTotal / input.quantity) * 100) / 100;
    const uniqueId = `${productSlug ?? 'autocolante'}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const title = `Autocolant ${materialLabel} - ${input.width_cm}x${input.height_cm} cm`;

    addItem({
      id: uniqueId,
      productId: productSlug ?? "autocolante",
      slug: productSlug ?? "autocolante",
      title,
      width: input.width_cm,
      height: input.height_cm,
      price: unitPrice,
      quantity: input.quantity,
      currency: "RON",
      metadata: {
        "Material": materialLabel,
        "Tip producție": input.print_type === "print_only" ? "Doar Print (-20%)" : "Print + Cut",
        "Laminare": input.laminated ? "Da (+40%)" : "Nu",
        "Folie de transfer": input.transfer_film ? "Da (+20%)" : "Nu",
        "Dimensiuni": `${input.width_cm} x ${input.height_cm} cm`,
        "Suprafață totală": `${priceData.total_sqm.toFixed(2)} mp`,
        "Preț/mp": `${priceData.pricePerSqm} lei`,
        "Grafică": input.designOption === 'pro' ? 'Vreau grafică' : input.designOption === 'text_only' ? 'Doar text' : 'Grafică proprie',
        ...(input.designOption === 'pro' && { "Cost grafică": formatMoneyDisplay(AUTOCOLANTE_CONSTANTS.PRO_DESIGN_FEE) }),
        artworkUrl,
        textDesign: input.designOption === 'text_only' ? textDesign : undefined,
      },
    });
  }

  useEffect(() => {
    const id = setInterval(() => setActiveIndex((i) => (i + 1) % GALLERY.length), 3000);
    return () => clearInterval(id);
  }, [GALLERY]);
  useEffect(() => setActiveImage(GALLERY[activeIndex]), [activeIndex, GALLERY]);

  const summaryStep1 = input.width_cm > 0 && input.height_cm > 0 ? `${input.width_cm}x${input.height_cm}cm, ${input.quantity} buc.` : "Alege";
  const materialDef = AUTOCOLANTE_CONSTANTS.MATERIALS.find(m => m.key === input.material);
  const printTypeLabel = input.print_type === "print_only" ? "Doar Print (-20%)" : "Print + Cut";
  const laminatedLabel = input.laminated ? ", Laminat (+40%)" : "";
  const transferLabel = input.transfer_film ? ", Folie transfer (+20%)" : "";
  const summaryStep2 = `${materialDef?.label.split(' — ')[0] || input.material}, ${printTypeLabel}${laminatedLabel}${transferLabel}`;
  const summaryStep3 = input.designOption === 'upload' ? 'Grafică proprie' : input.designOption === 'text_only' ? 'Doar text' : 'Design Pro';

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="lg:sticky top-24 h-max space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-800 overflow-hidden">
              <div className="aspect-square bg-gray-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                <img src={activeImage} alt="Autocolant" className="h-full w-full object-cover" />
              </div>
              <div className="p-2 grid grid-cols-4 gap-2">
                {GALLERY.map((src, i) => <button key={src} onClick={() => setActiveIndex(i)} className={`relative rounded-lg aspect-square ${activeIndex === i ? "ring-2 ring-offset-2 ring-emerald-500" : "hover:opacity-80"}`}><img src={src} alt="Thumb" className="w-full h-full object-cover" /></button>)}
              </div>
            </div>
          </div>
          <div>
            <header className="mb-6">
              <div className="flex justify-between items-center gap-4 mb-3"><h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{productTitle || "Configurator Autocolante"}</h1></div>
              <div className="flex justify-between items-center"><p className="text-gray-600 dark:text-gray-400">Personalizează opțiunile în 3 pași simpli.</p><button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline inline-flex items-center text-sm px-3 py-1.5"><Info size={16} /><span className="ml-2">Detalii</span></button></div>
            </header>
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-800 px-4">
              <AccordionStep stepNumber={1} title="Dimensiuni & Cantitate" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="field-label">Lungime (cm)</label><input type="text" inputMode="numeric" value={lengthText} onChange={(e) => onChangeLength(e.target.value)} placeholder="10" className="input" /></div>
                  <div><label className="field-label">Înălțime (cm)</label><input type="text" inputMode="numeric" value={heightText} onChange={(e) => onChangeHeight(e.target.value)} placeholder="10" className="input" /></div>
                  <div className="md:col-span-2">
                    <NumberInput label="Cantitate" value={input.quantity} onChange={setQty} min={getMinQty(input.width_cm, input.height_cm)} />

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
              <AccordionStep stepNumber={2} title="Material & Tip Print" summary={summaryStep2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)}>
                <label className="field-label mb-2">Tip folie Oracal</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                  {AUTOCOLANTE_CONSTANTS.MATERIALS.map((mat) => {
                    const [name, desc] = mat.label.split(' — ');
                    return (
                      <OptionButton
                        key={mat.key}
                        active={input.material === mat.key}
                        onClick={() => updateInput("material", mat.key as AutocolantesMaterialKey)}
                        title={name}
                        subtitle={desc}
                      />
                    );
                  })}
                </div>
                <label className="field-label mb-2">Tip producție</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                  <OptionButton
                    active={input.print_type === "print_cut"}
                    onClick={() => updateInput("print_type", "print_cut")}
                    title="Print + Cut"
                    subtitle="Tăiere pe contur (standard)"
                  />
                  <OptionButton
                    active={input.print_type === "print_only"}
                    onClick={() => updateInput("print_type", "print_only")}
                    title="Doar Print (-20%)"
                    subtitle="Fără tăiere, reducere 20%"
                  />
                </div>
                <label className="field-label mb-2">Finisaj</label>
                <label className="flex items-center gap-3 p-3 border-2 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                  <input type="checkbox" className="checkbox" checked={input.laminated} onChange={(e) => updateInput("laminated", e.target.checked)} />
                  <div>
                    <span className="text-sm font-bold text-gray-800 dark:text-white">Laminare (+40%)</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Protecție extra UV și zgârieturi</p>
                  </div>
                </label>
                <label className="mt-2 flex items-center gap-3 p-3 border-2 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                  <input type="checkbox" className="checkbox" checked={input.transfer_film} onChange={(e) => updateInput("transfer_film", e.target.checked)} />
                  <div>
                    <span className="text-sm font-bold text-gray-800 dark:text-white">Folie de transfer (+20%)</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Aplicare ușoară (recomandat pentru texte/logo)</p>
                  </div>
                </label>
              </AccordionStep>
              <AccordionStep stepNumber={3} title="Grafică" summary={summaryStep3} isOpen={activeStep === 3} onClick={() => setActiveStep(3)} isLast={true}>
                <div>
                  <div className="mb-4 border-b border-gray-200 dark:border-slate-800">
                    <div className="flex -mb-px">
                      {!productImage && <TabButton active={input.designOption === 'upload'} onClick={() => updateInput("designOption", 'upload')}>Am Grafică</TabButton>}
                      {!productImage && <TabButton active={input.designOption === 'text_only'} onClick={() => updateInput("designOption", 'text_only')}>Doar Text</TabButton>}
                      {!productImage && <TabButton active={input.designOption === 'pro'} onClick={() => updateInput("designOption", 'pro')}>Vreau Grafică</TabButton>}
                    </div>
                  </div>

                  {productImage ? (
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-20 h-20 rounded-lg bg-white dark:bg-slate-900 p-1 border border-slate-200 shadow-sm shrink-0">
                          <img src={productImage} alt="Model" className="w-full h-full object-cover rounded" />
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
                            className={`flex-1 py-2 px-3 rounded-lg border text-sm font-semibold transition-colors ${input.designOption === 'upload' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white dark:bg-slate-900 border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-gray-50'}`}
                          >
                            Încărcare Fișier
                          </button>
                          <button
                            onClick={() => updateInput("designOption", "text_only")}
                            className={`flex-1 py-2 px-3 rounded-lg border text-sm font-semibold transition-colors ${input.designOption === 'text_only' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white dark:bg-slate-900 border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-gray-50'}`}
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
                              <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white dark:bg-slate-900 border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
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
                      {input.designOption === 'upload' && (
                        <div className="space-y-3">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Încarcă fișierul tău (PDF, JPG, PNG, AI, CDR).</p>
                          <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white dark:bg-slate-900 border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                            <span className="flex items-center space-x-2"><UploadCloud className="w-6 h-6 text-gray-600 dark:text-gray-400" /><span className="font-medium text-gray-600 dark:text-gray-400">Apasă pentru a încărca</span></span>
                            <input type="file" name="file_upload" className="hidden" onChange={e => handleArtworkFileInput(e.target.files?.[0] ?? null)} />
                          </label>
                          {uploading && <p className="text-sm text-emerald-600">Se încarcă...</p>}
                          {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
                          {artworkUrl && !uploadError && <p className="text-sm text-green-600 font-semibold">Grafică încărcată cu succes!</p>}
                        </div>
                      )}

                      {input.designOption === 'text_only' && (
                        <div className="space-y-3">
                          <label className="field-label">Introdu textul dorit</label>
                          <textarea className="input" rows={3} value={textDesign} onChange={e => setTextDesign(e.target.value)} placeholder="Ex: ETICHETA PRODUS, PROMOȚIE, etc."></textarea>
                        </div>
                      )}

                      {input.designOption === 'pro' && (
                        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">
                          <p className="font-semibold">Serviciu de Grafică Profesională</p>
                          <p>Cost: <strong>{formatMoneyDisplay(AUTOCOLANTE_CONSTANTS.PRO_DESIGN_FEE)}</strong>. Un designer te va contacta pentru detalii.</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </AccordionStep>
            </div>
            <div className="static mt-8 lg:static bg-white dark:bg-slate-900/80 lg:bg-white dark:bg-slate-900/80 dark:lg:bg-slate-900 backdrop-blur-sm lg:backdrop-blur-none border-t-2 lg:border lg:rounded-2xl lg:shadow-lg border-gray-200 dark:border-slate-800 py-4 lg:p-6 lg:mt-8">
              <div className="flex flex-col gap-3">
                <button onClick={handleAddToCart} className="btn-primary w-full py-4 text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200">
                  <ShoppingCart size={24} />
                  <span className="ml-2">Adaugă în Coș</span>
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
                  href="https://wa.me/40750473111?text=Ma%20intereseaza%20configuratorul%20autocolante"
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

        {/* SECȚIUNE FEATURES - FULL WIDTH JOS */}
        <div className="mt-8 lg:mt-12 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-800">
          <nav className="border-b border-gray-200 dark:border-slate-800 flex">
            <TabButtonSEO active={activeProductTab === "descriere"} onClick={() => setActiveProductTab("descriere")}>Descriere</TabButtonSEO>
            <TabButtonSEO active={activeProductTab === "recenzii"} onClick={() => setActiveProductTab("recenzii")}>Recenzii</TabButtonSEO>
            <TabButtonSEO active={activeProductTab === "faq"} onClick={() => setActiveProductTab("faq")}>FAQ</TabButtonSEO>
          </nav>

          <div className="p-6 lg:p-8">
            {activeProductTab === 'descriere' && (
              <>
                {productDescription && <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed text-base lg:text-lg">{productDescription}</p>}
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">Autocolante și Etichete Personalizate</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed text-base lg:text-lg">
                  Personalizează orice suprafață cu autocolantele noastre de înaltă calitate. Disponibile pe hârtie sau vinyl, cu opțiuni de laminare și tăiere pe contur. Perfecte pentru branding, marketing, decorare sau etichete de produs.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Materiale & Calitate</h3>
                    <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                      <li className="flex items-start">
                        <span className="text-emerald-600 font-bold mr-2 mt-1">•</span>
                        <span><strong>Hârtie (Mată/Lucioasă):</strong> Ideală pentru etichete de interior, ambalaje de produs, cutii. Soluție economică pentru aplicații de scurtă durată.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-emerald-600 font-bold mr-2 mt-1">•</span>
                        <span><strong>Vinyl Cast (PVC):</strong> Material plastic premium, rezistent la apă, rupere și UV. Ideal pentru exterior sau produse expuse la umezeală. Durabilitate 5-7 ani.</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">De ce să alegi autocolantele noastre?</h3>
                    <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                      <li className="flex items-start">
                        <span className="text-emerald-600 font-bold mr-2 mt-1">✓</span>
                        <span><strong>Tăiere la Contur (Die-Cut):</strong> Plotter digital de precizie pentru orice formă custom.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-emerald-600 font-bold mr-2 mt-1">✓</span>
                        <span><strong>Laminare Protectoare:</strong> Strat transparent UV-rezistent care prelungește durata de viață.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-emerald-600 font-bold mr-2 mt-1">✓</span>
                        <span><strong>Aplicații Multiple:</strong> Etichete de produs, stickere auto, decorare gadget-uri, marketing și promoții.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Vinyl Cast Premium</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Material profesional, rezistent 5-7 ani exterior</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Tăiere la Contur</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Opțional - orice formă custom, plotter digital de precizie</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Rezistent Apă & UV</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Laminare protectoare, ideal interior/exterior</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Orice Dimensiune</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">De la mini-stickere până la foi mari personalizate</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeProductTab === 'recenzii' && <Reviews productSlug={productSlug || 'autocolante'} />}
            {activeProductTab === 'faq' && <FaqAccordion qa={productFaqs} />}
          </div>
        </div>
      </div>

      {detailsOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setDetailsOpen(false)}>
          <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl shadow-lg border border-gray-200 dark:border-slate-800 p-8" onClick={e => e.stopPropagation()}>
            <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100" onClick={() => setDetailsOpen(false)}><X size={20} className="text-gray-600 dark:text-gray-400" /></button>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Detalii Autocolante</h3>
            <div className="prose dark:prose-invert prose-sm prose-slate max-w-none">
              <h4>Materiale</h4>
              <ul>
                <li><strong>Hârtie (Mată/Lucioasă):</strong> Ideală pentru etichete de interior, ambalaje de produs, cutii. Economică.</li>
                <li><strong>Vinyl (PVC):</strong> Material plastic rezistent la rupere, apă și UV. Ideal pentru exterior sau produse expuse la umezeală.</li>
              </ul>
              <h4>Finisaje</h4>
              <ul>
                <li><strong>Laminare:</strong> Strat protector transparent aplicat peste print. Mărește rezistența la zgârieturi și decolorare.</li>
                <li><strong>Die-cut:</strong> Tăiere pe contur neregulat (nu doar dreptunghiular).</li>
              </ul>
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
      <RelatedProducts category="autocolante" />
    </div>
  );
}



