"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/ToastProvider";
import { Ruler, Layers, Plus, Minus, ShoppingCart, Info, ChevronDown, X, UploadCloud, Upload, TrendingUp, Percent, MessageCircle } from "lucide-react";
import DeliveryEstimation from "./DeliveryEstimation";
import FaqAccordion from "./FaqAccordion";
import Reviews from "./Reviews";
import SmartNewsletterPopup from "./SmartNewsletterPopup";
import { useUserActivityTracking } from "@/hooks/useAbandonedCartCapture";
import QuickNav from "@/components/QuickNav";
import { QA } from "@/types";
import { NumberInput } from "@/components/ui/NumberInput";
import {
  calculateWindowGraphicsPrice,
  getWindowGraphicsUpsell,
  WINDOW_GRAPHICS_CONSTANTS,
  formatMoneyDisplay,
  type PriceInputWindowGraphics
} from "@/lib/pricing";

const GALLERY = [
  "/products/window-graphics/window-graphics-1.webp",
  "/products/window-graphics/window-graphics-2.webp",
  "/products/window-graphics/window-graphics-3.webp",
  "/products/window-graphics/window-graphics-4.webp"
] as const;

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

const ProductTabs = ({ productSlug }: { productSlug: string }) => {
  const [activeTab, setActiveTab] = useState("descriere");
  const faq: QA[] = [
    { question: "Ce este folia perforată pentru ferestre?", answer: "Este o folie PVC specială cu perforații (raport 50% printabil / 50% transparent) care permite vizibilitatea dinspre interior spre exterior, dar oferă suprafață de print pe exterior." },
    { question: "Cum se aplică?", answer: "Aplicarea se face doar uscat, pe suprafețe curate de sticlă. Nu necesită apă sau soluții speciale." },
    { question: "Cât rezistă?", answer: "Durabilitate până la 3 ani, rezistentă la UV și intemperii. Adezivul removabil permite îndepărtarea fără urme." },
  ];
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-800">
      <nav className="border-b border-gray-200 dark:border-slate-800 flex">
        <TabButtonSEO active={activeTab === "descriere"} onClick={() => setActiveTab("descriere")}>Descriere</TabButtonSEO>
        <TabButtonSEO active={activeTab === "recenzii"} onClick={() => setActiveTab("recenzii")}>Recenzii</TabButtonSEO>
        <TabButtonSEO active={activeTab === "faq"} onClick={() => setActiveTab("faq")}>FAQ</TabButtonSEO>
      </nav>
      <div className="p-6">
        {activeTab === 'descriere' && (
          <div className="prose dark:prose-invert max-w-none text-sm">
            <h3>Window Graphics - Folie Perforată Ferestre</h3>
            <p>Folie PVC specială cu perforații, ideală pentru publicitate pe ferestre și vitrine. Vizibilitate unidirecțională perfectă!</p>
            <h4>Specificații Tehnice</h4>
            <ul>
              <li><strong>Grosime:</strong> 140 microni</li>
              <li><strong>Adeziv:</strong> Poliacrilic removabil, transparent</li>
              <li><strong>Suprafață:</strong> Albă lucioasă (exterior) / Neagră (interior)</li>
              <li><strong>Raport perforații:</strong> 50% printabil / 50% transparent</li>
              <li><strong>Durabilitate:</strong> Până la 3 ani</li>
              <li><strong>Aplicare:</strong> Doar uscat</li>
            </ul>
            <h4>Aplicații</h4>
            <ul>
              <li>Vitrine magazine și showroom-uri</li>
              <li>Ferestre birouri și sedii</li>
              <li>Autovehicule comerciale (geamuri laterale/spate)</li>
              <li>Publicitate outdoor cu vizibilitate interioară</li>
            </ul>
          </div>
        )}
        {activeTab === 'recenzii' && <Reviews productSlug={productSlug} />}
        {activeTab === 'faq' && <FaqAccordion qa={faq} />}
      </div>
    </div>
  );
};

const TabButtonSEO = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (<button onClick={onClick} className={`flex-1 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${active ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 hover:border-gray-300'}`}>{children}</button>);


function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode; }) {
  return <button type="button" onClick={onClick} className={`px-4 py-2 text-sm font-semibold transition-colors rounded-t-lg ${active ? "border-b-2 border-emerald-600 text-emerald-600 bg-emerald-50" : "text-gray-500 hover:text-gray-800"}`}>{children}</button>;
}

type Props = { productSlug?: string; initialWidth?: number; initialHeight?: number; productImage?: string };

/* --- MAIN COMPONENT --- */
export default function WindowGraphicsConfigurator({ productSlug, initialWidth: initW, initialHeight: initH, productImage }: Props) {
  const { addItem } = useCart();
  const GALLERY_IMAGES = useMemo(() => productImage ? [productImage, ...GALLERY] : GALLERY, [productImage]);

  const [input, setInput] = useState<PriceInputWindowGraphics>({
    width_cm: initW ?? 0,
    height_cm: initH ?? 0,
    quantity: 1,
    designOption: "upload",
    print_type: "print_cut",
    laminated: false,
  });

  const [lengthText, setLengthText] = useState(initW ? String(initW) : "");
  const [heightText, setHeightText] = useState(initH ? String(initH) : "");

  const [activeImage, setActiveImage] = useState<string>(GALLERY[0] || "/placeholder.png");
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    if (GALLERY_IMAGES.length > 0 && !activeImage) {
      setActiveImage(GALLERY_IMAGES[0]);
    }
  }, [GALLERY_IMAGES, activeImage]);

  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [userEmail, setUserEmail] = useState<string>('');
  const toast = useToast();

  // Pricing
  const priceData = useMemo(() => calculateWindowGraphicsPrice(input), [input]);
  const displayedTotal = priceData.finalPrice;

  // Upsell Logic
  const upsellOpportunity = useMemo(() => getWindowGraphicsUpsell(input), [input]);

  // Auto-capture abandoned carts
  const cartData = useMemo(() => ({
    configuratorId: 'window-graphics',
    email: userEmail,
    configuration: { ...input, artworkUrl },
    price: displayedTotal,
    quantity: input.quantity
  }), [userEmail, input, artworkUrl, displayedTotal]);

  useUserActivityTracking(cartData);

  const updateInput = <K extends keyof PriceInputWindowGraphics>(k: K, v: PriceInputWindowGraphics[K]) => setInput((p) => ({ ...p, [k]: v }));
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
      toast.warning("Te rugăm să introduci dimensiunile.");
      return;
    }
    if (displayedTotal <= 0) {
      toast.warning("Prețul trebuie calculat.");
      return;
    }

    const unitPrice = Math.round((displayedTotal / input.quantity) * 100) / 100;
    const uniqueId = `${productSlug ?? 'window-graphics'}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const title = `Window Graphics - ${input.width_cm}x${input.height_cm} cm`;

    addItem({
      id: uniqueId,
      productId: productSlug ?? "window-graphics",
      slug: productSlug ?? "window-graphics",
      title,
      width: input.width_cm,
      height: input.height_cm,
      price: unitPrice,
      quantity: input.quantity,
      currency: "RON",
      metadata: {
        "Material": "Folie PVC perforată 140μ",
        "Dimensiuni": `${input.width_cm} x ${input.height_cm} cm`,
        "Suprafață totală": `${priceData.total_sqm.toFixed(2)} mp`,
        "Preț/mp": `${priceData.pricePerSqm} lei`,
        "Tip Producție": input.print_type === 'print_cut' ? 'Print + Cut' : 'Doar Print',
        "Laminare": input.laminated ? 'Da' : 'Nu',
        "Grafică": input.designOption === 'pro' ? 'Design Pro' : 'Grafică proprie',
        ...(input.designOption === 'pro' && { "Cost grafică": formatMoneyDisplay(WINDOW_GRAPHICS_CONSTANTS.PRO_DESIGN_FEE) }),
        artworkUrl,
      },
    });
    toast.success("Produs adăugat în coș!");
  }

  useEffect(() => {
    const id = setInterval(() => setActiveIndex((i) => (i + 1) % GALLERY_IMAGES.length), 3000);
    return () => clearInterval(id);
  }, [GALLERY_IMAGES.length]);
  useEffect(() => setActiveImage(GALLERY_IMAGES[activeIndex]), [activeIndex, GALLERY_IMAGES]);

  const summaryStep1 = input.width_cm > 0 && input.height_cm > 0 ? `${input.width_cm}x${input.height_cm}cm, ${input.quantity} buc.` : "Alege";
  const summaryStep2 = `${input.print_type === 'print_cut' ? 'Print+Cut' : 'Doar Print'}${input.laminated ? ', Laminat' : ''}`;
  const summaryStep3 = input.designOption === 'upload' ? 'Grafică proprie' : 'Design Pro';

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="lg:sticky top-24 h-max space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-800 overflow-hidden">
              <div className="aspect-square"><img src={activeImage} alt="Window Graphics" className="h-full w-full object-cover" /></div>
              <div className="p-2 grid grid-cols-4 gap-2">
                {GALLERY_IMAGES.map((src, i) => <button key={src} onClick={() => setActiveIndex(i)} className={`relative rounded-lg aspect-square ${activeIndex === i ? "ring-2 ring-offset-2 ring-emerald-500" : "hover:opacity-80"}`}><img src={src} alt="Thumb" className="w-full h-full object-cover" /></button>)}
              </div>
            </div>
          </div>
          <div>
            <header className="mb-6">
              <div className="flex justify-between items-center gap-4 mb-3"><h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Configurator Window Graphics</h1></div>
              <div className="flex justify-between items-center"><p className="text-gray-600 dark:text-gray-400">Folie perforată pentru ferestre - vizibilitate perfectă!</p><button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline inline-flex items-center text-sm px-3 py-1.5"><Info size={16} /><span className="ml-2">Detalii</span></button></div>
            </header>
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-800 px-4">
              <AccordionStep stepNumber={1} title="Dimensiuni & Cantitate" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="field-label">Lungime (cm)</label><input type="text" inputMode="numeric" value={lengthText} onChange={(e) => onChangeLength(e.target.value)} placeholder="100" className="input" /></div>
                  <div><label className="field-label">Înălțime (cm)</label><input type="text" inputMode="numeric" value={heightText} onChange={(e) => onChangeHeight(e.target.value)} placeholder="100" className="input" /></div>
                  <div className="md:col-span-2">
                    <NumberInput label="Cantitate" value={input.quantity} onChange={setQty} />

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

              <AccordionStep stepNumber={2} title="Opțiuni Producție" summary={summaryStep2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)}>
                <div className="space-y-4">
                  <div>
                    <label className="field-label mb-2">Tip producție</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => updateInput("print_type", "print_cut")}
                        className={`p-3 border-2 rounded-xl text-left transition-all ${input.print_type === "print_cut" ? "border-emerald-600 bg-emerald-50" : "border-gray-200 dark:border-slate-800 hover:border-emerald-200"}`}
                      >
                        <p className="font-bold text-gray-900 dark:text-white text-sm">Print + Cut</p>
                        <p className="text-xs text-gray-500">Tăiere pe contur dreptunghiular</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => updateInput("print_type", "print_only")}
                        className={`p-3 border-2 rounded-xl text-left transition-all ${input.print_type === "print_only" ? "border-emerald-600 bg-emerald-50" : "border-gray-200 dark:border-slate-800 hover:border-emerald-200"}`}
                      >
                        <p className="font-bold text-gray-900 dark:text-white text-sm">Doar Print</p>
                        <p className="text-xs text-gray-500 text-emerald-600 font-medium">Reducere -20%</p>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="field-label mb-2">Finisaj Protecție</label>
                    <label className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-all border-gray-200 dark:border-slate-800">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300"
                        checked={input.laminated}
                        onChange={(e) => updateInput("laminated", e.target.checked)}
                      />
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">Laminare (+10%)</p>
                        <p className="text-xs text-gray-500">Protecție UV și la zgârieturi. Recomandat!</p>
                      </div>
                    </label>
                  </div>
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
                              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Încarcă fișierul tău nou (PDF, JPG, PNG, AI, CDR):</p>
                              <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white dark:bg-slate-900 border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                                <div className="flex flex-col items-center space-y-2"><UploadCloud className="w-8 h-8 text-gray-400" /><span className="font-medium text-gray-600 dark:text-gray-400">Selectează fișier</span><span className="text-xs text-gray-500">sau trage și plasează aici</span></div>
                                <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.ai,.cdr,.svg" onChange={(e) => handleArtworkFileInput(e.target.files?.[0] || null)} />
                              </label>
                              {uploading && <p className="text-sm text-emerald-600">Se încarcă...</p>}
                              {artworkUrl && <p className="text-sm text-green-600">✓ Fișier nou încărcat cu succes</p>}
                              {uploadError && <p className="text-sm text-red-600">Eroare: {uploadError}</p>}
                            </div>
                          )}

                          {input.designOption === 'pro' && (
                            <div className="space-y-3">
                              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                                <p className="text-sm text-emerald-800"><strong>Design profesional:</strong> Echipa noastră va crea design-ul conform specificațiilor tale.</p>
                                <p className="text-sm text-emerald-600 mt-2">Cost grafică: <strong>{formatMoneyDisplay(WINDOW_GRAPHICS_CONSTANTS.PRO_DESIGN_FEE)}</strong></p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="mb-4 border-b border-gray-200 dark:border-slate-800">
                        <div className="flex -mb-px">
                          <TabButton active={input.designOption === 'upload'} onClick={() => updateInput("designOption", 'upload')}>Am Grafică</TabButton>
                          <TabButton active={input.designOption === 'pro'} onClick={() => updateInput("designOption", 'pro')}>Vreau Grafică</TabButton>
                        </div>
                      </div>

                      {input.designOption === 'upload' && (
                        <div className="space-y-3">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Încarcă fișierul tău (PDF, JPG, PNG, AI, CDR).</p>
                          <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white dark:bg-slate-900 border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                            <div className="flex flex-col items-center space-y-2"><UploadCloud className="w-8 h-8 text-gray-400" /><span className="font-medium text-gray-600 dark:text-gray-400">Selectează fișier</span><span className="text-xs text-gray-500">sau trage și plasează aici</span></div>
                            <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.ai,.cdr,.svg" onChange={(e) => handleArtworkFileInput(e.target.files?.[0] || null)} />
                          </label>
                          {uploading && <p className="text-sm text-emerald-600">Se încarcă...</p>}
                          {artworkUrl && <p className="text-sm text-green-600">✓ Fișier încărcat cu succes</p>}
                          {uploadError && <p className="text-sm text-red-600">Eroare: {uploadError}</p>}
                        </div>
                      )}

                      {input.designOption === 'pro' && (
                        <div className="space-y-3">
                          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                            <p className="text-sm text-emerald-800"><strong>Design profesional:</strong> Echipa noastră va crea design-ul conform specificațiilor tale.</p>
                            <p className="text-sm text-emerald-600 mt-2">Cost grafică: <strong>{formatMoneyDisplay(WINDOW_GRAPHICS_CONSTANTS.PRO_DESIGN_FEE)}</strong></p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </AccordionStep>
            </div>

            <div className="static mt-8 lg:static bg-white dark:bg-slate-900/95 lg:bg-white dark:bg-slate-900 backdrop-blur-md lg:backdrop-blur-none border-t-2 lg:border lg:rounded-2xl lg:shadow-lg border-gray-200 dark:border-slate-800 p-3 sm:p-4 lg:p-6 lg:mt-8 safe-area-inset-bottom">
              <div className="flex flex-col gap-3">
                <button onClick={handleAddToCart} className="btn-primary w-full py-4 text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200">
                  <ShoppingCart size={24} />
                  <span className="ml-2">Adaugă în Coș</span>
                </button>
                <div className="flex flex-col gap-1 w-full border-t border-gray-100 pt-2 mt-2">
                  <div className="flex flex-row justify-between items-center w-full gap-2">
                    <div className="flex flex-col items-start leading-none">
                      <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Preț Total</span>
                      <span className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{formatMoneyDisplay(displayedTotal)}</span>
                    </div>
                    <div className="flex-shrink-0">
                      <DeliveryEstimation />
                    </div>
                  </div>
                  {priceData.total_sqm > 0 && (
                    <p className="text-xs text-gray-500">
                      Suprafață: {priceData.total_sqm.toFixed(2)} mp × {priceData.pricePerSqm} lei/mp
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* BUTOANE SECUNDARE - WHATSAPP ȘI CERERE OFERTĂ */}
            <div className="mt-4 lg:mt-6 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 text-center font-medium">Ai nevoie de ajutor sau o ofertă personalizată?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="https://wa.me/40750473111?text=Ma%20intereseaza%20configuratorul%20window-graphics"
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

            {/* SECȚIUNE FEATURES - 4 ICONIȚE */}
            <div className="mt-8 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-800 p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Folie One-Way Vision</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Vezi din interior, vizibilitate totală din exterior</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Rezistent Intemperii</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Material premium pentru exterior, 3-5 ani garanție</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Montaj Profesional</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Opțional - echipa noastră montează perfect</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Impact Vizual Maxim</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Perfect pentru magazine, birouri, vitrine</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECȚIUNE TABS - FULL WIDTH JOS */}
        <div className="mt-8 lg:mt-12"><ProductTabs productSlug={productSlug || 'window-graphics'} /></div>
      </div>
      {/* NAVIGARE RAPIDĂ */}
      <div className="container mx-auto px-4 mt-12 mb-8">
        <QuickNav title="Vrei să personalizezi alt produs?" />
      </div>

      <SmartNewsletterPopup />
      {detailsOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setDetailsOpen(false)}>
          <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-800 p-6 sm:p-8 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 bg-gray-50" onClick={() => setDetailsOpen(false)} aria-label="Închide">
              <X size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 pr-8">Detalii Window Graphics</h3>
            <div className="prose dark:prose-invert prose-sm max-w-none text-gray-600 dark:text-gray-400">
              <h3>Specificații Window Graphics</h3>
              <ul>
                <li><strong>Material:</strong> Folie PVC perforată 140 microni</li>
                <li><strong>Adeziv:</strong> Poliacrilic removabil, transparent</li>
                <li><strong>Culori:</strong> Alb lucios (exterior) / Negru (interior)</li>
                <li><strong>Raport perforații:</strong> 50% printabil / 50% transparent</li>
                <li><strong>Aplicare:</strong> Doar uscat, fără apă</li>
                <li><strong>Durabilitate:</strong> Până la 3 ani outdoor</li>
                <li><strong>Dimensiuni rolă:</strong> 137cm lățime × 50m lungime</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



