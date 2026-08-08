"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/ToastProvider";
import { ShoppingCart, Info, ChevronDown, X, UploadCloud, MessageCircle, Check } from "lucide-react";
import DeliveryEstimation from "./DeliveryEstimation";
import FaqAccordion from "./FaqAccordion";
import { QA } from "@/types";
import {
  calculateFonduriEUPrice,
  getFonduriEUGroups,
  formatMoneyDisplay,
  type PriceInputFonduriEU
} from "@/lib/pricing";

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

const TabButtonSEO = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick} className={`flex-1 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${active ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 hover:border-gray-300'}`}>
    {children}
  </button>
);

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const SelectGroup = ({ label, options, value, onChange }: { label: string, options: { id: string, label: string, price: number }[], value: string, onChange: (val: string) => void }) => (
  <div className="mb-4">
    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{label}</label>
    <select
      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white dark:bg-slate-900 text-gray-800"
      value={value || "none"}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map(opt => (
        <option key={opt.id} value={opt.id}>
          {opt.label} {opt.price > 0 ? `(+${formatMoneyDisplay(opt.price)})` : ""}
        </option>
      ))}
    </select>
  </div>
);

function FonduriTypeSwitch() {
  const pathname = usePathname();
  const isPnrr = !!pathname && pathname.includes("/fonduri-pnrr");
  const isRegio = !!pathname && pathname.includes("/fonduri-regio");
  const isNationale = !!pathname && pathname.includes("/fonduri-nationale");

  return (
    <div className="inline-flex rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:bg-slate-900 p-1 shadow-sm mb-6">
      <Link
        href="/fonduri-pnrr"
        className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all inline-flex items-center justify-center ${isPnrr ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50'}`}
      >
        PNRR
      </Link>
      <Link
        href="/fonduri-regio"
        className={`ml-1 px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all inline-flex items-center justify-center ${isRegio ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50'}`}
      >
        REGIO
      </Link>
      <Link
        href="/fonduri-nationale"
        className={`ml-1 px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all inline-flex items-center justify-center ${isNationale ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50'}`}
      >
        Naționale
      </Link>
    </div>
  );
}

const GALLERY = [
  "/products/master/pachet-vizibilitate-fonduri-europene-pnrr.png",
  "/products/afise/afise-1.webp",
  "/products/banner/banner-1.webp",
] as const;

export default function FonduriEUConfigurator({ productSlug }: { productSlug?: string }) {
  const { addItem } = useCart();
  const toast = useToast();

  const [selections, setSelections] = useState<Record<string, string>>({
    comunicat: "none",
    bannerSite: "none",
    afisInformativ: "none",
    autoMici: "none",
    autoMari: "none",
    panouTemporar: "none",
    placaPermanenta: "none"
  });

  const [orderNotes, setOrderNotes] = useState("");
  const [activeTab, setActiveTab] = useState("descriere");
  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeImage, setActiveImage] = useState<string>(GALLERY[0]);
  const [activeStep, setActiveStep] = useState(1);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    setActiveImage(GALLERY[activeIndex]);
  }, [activeIndex]);

  const isRegio = useMemo(() => {
    if (!productSlug) {
      if (typeof window !== 'undefined') {
        return window.location.pathname.includes('regio');
      }
      return false;
    }
    return productSlug.includes('regio');
  }, [productSlug]);

  const groups = useMemo(() => getFonduriEUGroups(isRegio || false), [isRegio]);

  const priceData = useMemo(() => calculateFonduriEUPrice({ selections, isRegio: isRegio || false }), [selections, isRegio]);
  const displayedTotal = priceData.finalPrice;

  const summaryStep1 = useMemo(() => {
    const s = [];
    if (selections.comunicat !== 'none') s.push('Comunicat');
    if (selections.bannerSite !== 'none') s.push('Banner Site');
    return s.length ? s.join(", ") : "Digital & Presă";
  }, [selections]);

  const summaryStep2 = useMemo(() => {
    const s = [];
    if (selections.afisInformativ !== 'none') s.push('Afiș');
    if (selections.autoMici !== 'none' || selections.autoMari !== 'none') s.push('Autocolante');
    return s.length ? s.join(", ") : "Materiale Informare";
  }, [selections]);

  const summaryStep3 = useMemo(() => {
    const s = [];
    if (selections.panouTemporar !== 'none') s.push('Panou');
    if (selections.placaPermanenta !== 'none') s.push('Placă');
    return s.length ? s.join(", ") : "Panouri & Plăci";
  }, [selections]);

  const handleSelectionChange = (key: string, value: string) => {
    setSelections(prev => ({ ...prev, [key]: value }));
  };

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
    if (displayedTotal <= 0) {
      toast.warning("Selectați cel puțin o opțiune.");
      return;
    }

    const selectedItems = Object.entries(selections)
      .filter(([_, val]) => val !== "none")
      .map(([key, val]) => {
        const group = groups[key as keyof typeof groups];
        const opt = group?.options.find(o => o.id === val);
        return `${group?.title}: ${opt?.label}`;
      });

    addItem({
      id: `fonduri-eu-${Date.now()}`,
      productId: "fonduri-eu",
      slug: "fonduri-eu",
      title: "Kit Vizibilitate Fonduri EU",
      price: displayedTotal,
      quantity: 1,
      metadata: {
        "Configurație": selectedItems.join(" | "),
        "Note": orderNotes,
        artworkUrl,
      },
    });
    toast.success("Adăugat în coș!");
  }

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* GALERIE STÂNGA */}
          <div className="lg:sticky top-24 h-max space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-800 overflow-hidden">
              <div className="aspect-square bg-gray-50">
                <img src={activeImage} alt="Kit Fonduri EU" className="h-full w-full object-cover" />
              </div>
              <div className="p-2 grid grid-cols-4 gap-2">
                {GALLERY.map((src, i) => (
                  <button key={src} onClick={() => setActiveIndex(i)} className={`relative rounded-lg aspect-square overflow-hidden border-2 transition-all ${activeIndex === i ? "border-emerald-600 shadow-sm" : "border-transparent opacity-60 hover:opacity-100"}`}>
                    <img src={src} alt="Thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CONFIGURATOR DREAPTA */}
          <div>
            <header className="mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">Kit Vizibilitate Fonduri EU</h1>
                <FonduriTypeSwitch />
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-600 dark:text-gray-400">Personalizează kitul conform manualului de identitate vizuală.</p>
                <button onClick={() => setDetailsOpen(true)} className="inline-flex items-center text-sm px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors whitespace-nowrap ml-4">
                  <Info size={16} /><span className="ml-2">Detalii</span>
                </button>
              </div>
            </header>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-800 px-4 mb-8">
              <AccordionStep stepNumber={1} title="Digital & Presă" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                <div className="py-2">
                  <SelectGroup
                    label="Comunicat de presă"
                    options={groups.comunicat.options}
                    value={selections.comunicat}
                    onChange={(v) => handleSelectionChange("comunicat", v)}
                  />
                  <SelectGroup
                    label="Banner Site"
                    options={groups.bannerSite.options}
                    value={selections.bannerSite}
                    onChange={(v) => handleSelectionChange("bannerSite", v)}
                  />
                </div>
              </AccordionStep>

              <AccordionStep stepNumber={2} title="Afișe & Autocolante" summary={summaryStep2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)}>
                <div className="py-2">
                  <SelectGroup
                    label="Afiș Informativ (A4/A3/A2)"
                    options={groups.afisInformativ.options}
                    value={selections.afisInformativ}
                    onChange={(v) => handleSelectionChange("afisInformativ", v)}
                  />
                  <SelectGroup
                    label="Autocolante Mici (Set)"
                    options={groups.autoMici.options}
                    value={selections.autoMici}
                    onChange={(v) => handleSelectionChange("autoMici", v)}
                  />
                  <SelectGroup
                    label="Autocolante Mari (Set)"
                    options={groups.autoMari.options}
                    value={selections.autoMari}
                    onChange={(v) => handleSelectionChange("autoMari", v)}
                  />
                </div>
              </AccordionStep>

              <AccordionStep stepNumber={3} title="Panouri & Plăci" summary={summaryStep3} isOpen={activeStep === 3} onClick={() => setActiveStep(3)} isLast={true}>
                <div className="py-2">
                  <SelectGroup
                    label="Panou Temporar"
                    options={groups.panouTemporar.options}
                    value={selections.panouTemporar}
                    onChange={(v) => handleSelectionChange("panouTemporar", v)}
                  />
                  <SelectGroup
                    label="Placă Permanentă"
                    options={groups.placaPermanenta.options}
                    value={selections.placaPermanenta}
                    onChange={(v) => handleSelectionChange("placaPermanenta", v)}
                  />
                </div>
              </AccordionStep>
            </div>

            <div className="static mt-8 lg:static bg-white dark:bg-slate-900/95 backdrop-blur-md lg:bg-white dark:bg-slate-900 lg:backdrop-blur-none border-t lg:border border-gray-200 dark:border-slate-800 lg:rounded-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] lg:shadow-lg p-4 lg:p-6 transition-all">
              <div className="flex flex-col gap-4">
                <button onClick={handleAddToCart} className="w-full py-4 text-lg font-bold bg-emerald-600 text-white rounded-xl shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-emerald-500/20">
                  <ShoppingCart size={24} />
                  Adaugă în Coș
                </button>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-2 px-1">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Total estimat</span>
                    <span className="text-2xl font-black text-gray-900 dark:text-white leading-none">{formatMoneyDisplay(displayedTotal)}</span>
                  </div>
                  <DeliveryEstimation />
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <a
                    href={`https://wa.me/40750473111?text=Buna%20ziua,%20ma%20intereseaza%20Kitul%20Vizibilitate%20Fonduri%20EU`}
                    target="_blank"
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-sm transition-all shadow-sm"
                  >
                    <MessageCircle size={18} />
                    WhatsApp
                  </a>
                  <button
                    onClick={() => window.location.href = '/contact'}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-800 hover:bg-black text-white rounded-xl font-bold text-sm transition-all shadow-sm"
                  >
                    <Info size={18} />
                    Cerere Ofertă
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12"><ProductTabs productSlug="fonduri-eu" /></div>
      </div>

      {detailsOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setDetailsOpen(false)}>
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8" onClick={e => e.stopPropagation()}>
            <button className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 dark:text-gray-400" onClick={() => setDetailsOpen(false)}><X size={24} /></button>
            <h3 className="text-2xl font-bold mb-4">Detalii Kit Fonduri EU</h3>
            <div className="prose dark:prose-invert prose-sm text-gray-600 dark:text-gray-400">
              <p>Acest kit este conceput pentru a satisface cerințele obligatorii de vizibilitate pentru proiectele finanțate prin instrumente europene (PNRR, REGIO, etc.).</p>
              <ul>
                <li>Respectăm Manualul de Identitate Vizuală (fonturi, culori, logo-uri).</li>
                <li>Realizăm macheta grafică gratuit după plasarea comenzii.</li>
                <li>Materiale rezistente la exterior (UV, ploaie).</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const ProductTabs = ({ productSlug }: { productSlug: string }) => {
  const [activeTab, setActiveTab] = useState("descriere");
  const faqs = [
    { question: "Sunt materialele conforme?", answer: "Da, garantăm respectarea manualului de identitate vizuală obligatoriu." },
    { question: "Cum trimit datele proiectului?", answer: "Vă vom contacta după comandă pentru a prelua titlul, codul SMIS și restul detaliilor necesare." },
  ];
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-800 overflow-hidden">
      <nav className="flex border-b border-gray-200 dark:border-slate-800">
        <TabButtonSEO active={activeTab === "descriere"} onClick={() => setActiveTab("descriere")}>Descriere</TabButtonSEO>
        <TabButtonSEO active={activeTab === "faq"} onClick={() => setActiveTab("faq")}>FAQ</TabButtonSEO>
      </nav>
      <div className="p-8 lg:p-12">
        {activeTab === "descriere" && (
          <div className="prose dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold mb-4">Soluție completă pentru beneficiari</h2>
            <p>Toate elementele de vizibilitate într-un singur loc. Ne ocupăm de layout, producție și livrare rapidă.</p>
          </div>
        )}
        {activeTab === "faq" && <FaqAccordion qa={faqs} />}
      </div>
    </div>
  );
};



