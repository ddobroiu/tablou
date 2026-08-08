"use client";

import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/components/CartContext";
import { ShoppingCart, Info, ChevronDown, X, UploadCloud, MessageCircle, Check, PlayCircle } from "lucide-react";
import DeliveryEstimation from "./DeliveryEstimation";
import FaqAccordion from "./FaqAccordion";
import { QA } from "@/types/configurator";
import {
    calculateFonduriEUPrice,
    getFonduriEUGroups,
    formatMoneyDisplay
} from "@/lib/pricing";

import { AccordionStep } from "./ui/AccordionStep";
import { TabButtonSEO } from "./ui/TabButtonSEO";
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const SelectGroup = ({ label, options, value, onChange }: { label: string, options: { id: string, label: string, price: number }[], value: string, onChange: (val: string) => void }) => (
    <div className="mb-4">
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <select
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-gray-800"
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

import { euFundsProducts } from "@/lib/products/eu-funds-products";

function FonduriTypeSwitch() {
    const pathname = usePathname();
    const isPnrr = !!pathname && (pathname.includes("/fonduri-pnrr") || pathname.includes("/configurator/fonduri-eu"));
    const isRegio = !!pathname && pathname.includes("/fonduri-regio");
    const isNationale = !!pathname && pathname.includes("/fonduri-nationale");

    return (
        <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1 shadow-sm">
            <Link
                href="/fonduri-pnrr"
                className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all inline-flex items-center justify-center ${isPnrr ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-slate-50 dark:bg-slate-800'}`}
            >
                PNRR
            </Link>
            <Link
                href="/fonduri-regio"
                className={`ml-1 px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all inline-flex items-center justify-center ${isRegio ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-slate-50 dark:bg-slate-800'}`}
            >
                REGIO
            </Link>
            <Link
                href="/fonduri-nationale"
                className={`ml-1 px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all inline-flex items-center justify-center ${isNationale ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-slate-50 dark:bg-slate-800'}`}
            >
                Naționale
            </Link>
        </div>
    );
}

const GALLERY_BASE = [
    "/products/fonduri/pnrr-1.webp",
    "/products/fonduri/pnrr-2.webp",
    "/products/fonduri/pnrr-3.jpg",
    "/products/fonduri/pnrr-4.jpg"
] as const;

const fonduriFaqs: QA[] = [
    { question: "Sunt materialele conforme cu manualul de identitate?", answer: "Da, respectăm cu strictețe manualul de identitate vizuală pentru fiecare program (PNRR, Regio, etc.), folosind fonturile, culorile și elementele grafice obligatorii." },
    { question: "Ce include comunicatul de presă?", answer: "Serviciul include redactarea textului, publicarea acestuia și oferirea dovezii de publicare cu confirmarea unui trafic de minim 3.000 de vizitatori unici (astfel se respectă rigorile multor finanțări)." },
    { question: "Panourile sunt rezistente la exterior?", answer: "Da, panourile temporare și plăcile permanente sunt realizate din materiale rezistente la intemperii (PVC Forex, Bond sau Banner) și printate cu cerneală UV." },
];

export default function FonduriEUConfigurator({ productSlug }: { productSlug?: string }) {
    const { addItem } = useCart();

    // Determine current product
    const currentProduct = useMemo(() => {
        if (!productSlug) return null;
        return euFundsProducts.find(p => p.slug === productSlug);
    }, [productSlug]);

    const GALLERY = useMemo(() => {
        if (currentProduct?.image && !GALLERY_BASE.includes(currentProduct.image as any)) {
            return [currentProduct.image, ...GALLERY_BASE];
        }
        return GALLERY_BASE;
    }, [currentProduct]);

    // State
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
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [activeImage, setActiveImage] = useState<string>(GALLERY[0]);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(1);

    useEffect(() => {
        if (currentProduct) {
            setSelections(prev => {
                const next = { ...prev };
                // Reset defaults to ensure clean slate for specific product
                // next.comunicat = "none"; next.bannerSite = "none"; next.afisInformativ = "none"; 
                // next.autoMici = "none"; next.autoMari = "none"; next.panouTemporar = "none"; next.placaPermanenta = "none";

                if (currentProduct.tags.includes("comunicat")) next.comunicat = "start";
                if (currentProduct.tags.includes("placa")) next.placaPermanenta = "80x50";
                if (currentProduct.tags.includes("panou")) next.panouTemporar = "80x50";
                if (currentProduct.tags.includes("afis") && currentProduct.tags.includes("a3")) next.afisInformativ = "A3";
                if (currentProduct.tags.includes("autocolante")) next.autoMici = "10x10-20";

                return next;
            });

            if (currentProduct.tags.includes("comunicat")) setActiveStep(1);
            else if (currentProduct.tags.includes("afis") || currentProduct.tags.includes("autocolante")) setActiveStep(2);
            else if (currentProduct.tags.includes("placa") || currentProduct.tags.includes("panou")) setActiveStep(3);
        }
    }, [currentProduct]);

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
        return productSlug.includes('regio') || currentProduct?.category?.toLowerCase().includes('regionale');
    }, [productSlug, currentProduct]);

    const groups = useMemo(() => getFonduriEUGroups(isRegio || false), [isRegio]);

    // Pricing
    const priceData = useMemo(() => calculateFonduriEUPrice({ selections, isRegio: isRegio || false }), [selections, isRegio]);
    const displayedTotal = priceData.finalPrice;

    // Summaries
    const summaryStep1 = useMemo(() => {
        const parts = [];
        if (selections.comunicat !== "none") parts.push("Comunicat");
        if (selections.bannerSite !== "none") parts.push("Banner");
        return parts.length ? parts.join(", ") : "Digital & Presă";
    }, [selections]);

    const summaryStep2 = useMemo(() => {
        const parts = [];
        if (selections.afisInformativ !== "none") parts.push("Afiș");
        if (selections.autoMici !== "none" || selections.autoMari !== "none") parts.push("Autocolante");
        return parts.length ? parts.join(", ") : "Materiale Informare";
    }, [selections]);

    const summaryStep3 = useMemo(() => {
        const parts = [];
        if (selections.panouTemporar !== "none") parts.push("Panouri");
        if (selections.placaPermanenta !== "none") parts.push("Placă");
        return parts.length ? parts.join(", ") : "Panouri & Plăci";
    }, [selections]);

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
            alert("Vă rugăm selectați cel puțin un element pentru kit.");
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
            productId: 'fonduri-eu',
            title: "Kit Vizibilitate Fonduri EU",
            price: displayedTotal,
            quantity: 1,
            metadata: {
                "Configurație": selectedItems.join(" | "),
                "Note": orderNotes,
                artworkUrl: artworkUrl,
            },
        });
    }

    return (
        <main className="bg-white min-h-screen">
            <div className="container mx-auto px-4 py-8 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* STÂNGA - GALERIE */}
                    <div className="lg:sticky top-24">
                        <div className="bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-gray-200 dark:border-slate-800 overflow-hidden">
                            <div className="aspect-square bg-gray-100">
                                <Image 
                                    src={activeImage} 
                                    className="w-full h-full object-cover" 
                                    alt={currentProduct?.title || "Vizibilitate Fonduri EU"} 
                                    width={600}
                                    height={600}
                                    priority
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                            <div className="p-2 grid grid-cols-4 gap-2">
                                {GALLERY.map((src, i) => (
                                    <button
                                        key={src}
                                        onClick={() => setActiveIndex(i)}
                                        className={`relative rounded-lg aspect-square overflow-hidden border-2 transition-all ${activeIndex === i ? "border-emerald-600 shadow-md" : "border-transparent opacity-60 hover:opacity-100"}`}
                                    >
                                        <Image 
                                            src={src} 
                                            alt={`Miniatură ${i + 1} - ${currentProduct?.title || "Kit Fonduri"}`} 
                                            fill
                                            className="w-full h-full object-cover" 
                                            sizes="100px"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* DREAPTA - CONFIGURATOR */}
                    <div>
                        <header className="mb-4 sm:mb-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4">
                                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white">{currentProduct ? currentProduct.title : "Kit Vizibilitate Fonduri EU"}</h2>
                                <FonduriTypeSwitch />
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{currentProduct ? currentProduct.description : "Personalizează pachetul de vizibilitate obligatoriu."}</p>
                                <button type="button" onClick={() => setDetailsOpen(true)} className="inline-flex items-center text-sm px-3 py-1.5 border border-gray-300 rounded hover:bg-slate-50 dark:bg-slate-800 transition-colors text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap ml-4">
                                    <Info size={16} /><span className="ml-2">Detalii</span>
                                </button>
                            </div>
                        </header>

                        <div className="bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-gray-200 dark:border-slate-800 px-4 mb-8">
                            <AccordionStep stepNumber={1} title="Publicitate & Online" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                                <div className="py-2">
                                    <SelectGroup
                                        label="Comunicat de presă"
                                        options={groups.comunicat.options}
                                        value={selections.comunicat}
                                        onChange={(v) => setSelections(p => ({ ...p, comunicat: v }))}
                                    />
                                    <SelectGroup
                                        label="Banner site (Digital)"
                                        options={groups.bannerSite.options}
                                        value={selections.bannerSite}
                                        onChange={(v) => setSelections(p => ({ ...p, bannerSite: v }))}
                                    />
                                </div>
                            </AccordionStep>

                            <AccordionStep stepNumber={2} title="Afișe & Autocolante" summary={summaryStep2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)}>
                                <div className="py-2">
                                    <SelectGroup
                                        label="Afiș Informativ (Interior)"
                                        options={groups.afisInformativ.options}
                                        value={selections.afisInformativ}
                                        onChange={(v) => setSelections(p => ({ ...p, afisInformativ: v }))}
                                    />
                                    <SelectGroup
                                        label="Autocolante Mici (Set)"
                                        options={groups.autoMici.options}
                                        value={selections.autoMici}
                                        onChange={(v) => setSelections(p => ({ ...p, autoMici: v }))}
                                    />
                                    <SelectGroup
                                        label="Autocolante Mari (Set)"
                                        options={groups.autoMari.options}
                                        value={selections.autoMari}
                                        onChange={(v) => setSelections(p => ({ ...p, autoMari: v }))}
                                    />
                                </div>
                            </AccordionStep>

                            <AccordionStep stepNumber={3} title="Panouri & Plăci" summary={summaryStep3} isOpen={activeStep === 3} onClick={() => setActiveStep(3)} isLast={true}>
                                <div className="py-2">
                                    <SelectGroup
                                        label="Panou Temporar"
                                        options={groups.panouTemporar.options}
                                        value={selections.panouTemporar}
                                        onChange={(v) => setSelections(p => ({ ...p, panouTemporar: v }))}
                                    />
                                    <SelectGroup
                                        label="Placă Permanentă"
                                        options={groups.placaPermanenta.options}
                                        value={selections.placaPermanenta}
                                        onChange={(v) => setSelections(p => ({ ...p, placaPermanenta: v }))}
                                    />
                                </div>
                            </AccordionStep>
                        </div>

                        <div className="static mt-8 z-40 lg:static bg-white/95 backdrop-blur-md lg:bg-white lg:backdrop-blur-none border-t lg:border border-gray-200 dark:border-slate-800 lg:rounded-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] lg:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] p-4 lg:p-6 transition-all">
                            <div className="flex flex-col gap-4">
                                <button onClick={handleAddToCart} className="w-full py-4 text-lg font-bold bg-emerald-600 text-white rounded-xl shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 active:scale-95 animate-pulse-slow">
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
                                    href={`https://wa.me/40750473111?text=Buna%20ziua,%20ma%20intereseaza%20o%20oferta%20pentru%20Kit%20Fonduri%20EU.`}
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
                </div >

                {/* TABS SECȚIUNE */}
                < div className="mt-12 lg:mt-16 bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-gray-200 dark:border-slate-800 overflow-hidden" >
                    <nav className="flex border-b border-gray-200 dark:border-slate-800">
                        <TabButtonSEO active={activeTab === "descriere"} onClick={() => setActiveTab("descriere")}>Descriere</TabButtonSEO>
                        <TabButtonSEO active={activeTab === "faq"} onClick={() => setActiveTab("faq")}>FAQ</TabButtonSEO>
                    </nav>
                    <div className="p-6 lg:p-12">
                        {activeTab === "descriere" && (
                            <div className="prose dark:prose-invert max-w-none">
                                <h2 className="text-2xl font-bold mb-4">Soluție completă pentru beneficiarii de fonduri europene</h2>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                                    Oferim toate elementele obligatorii de vizibilitate conform manualelor oficiale de identitate vizuală (PNRR, REGIO, POC, etc.).
                                    Fie că ai nevoie de panouri de șantier, plăci permanente pentru recepție sau comunicate de presă, kitul nostru asigură conformitatea 100%.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                                    <div className="flex gap-4 p-6 rounded-xl bg-slate-50 dark:bg-slate-800 border border-gray-100">
                                        <div className="w-12 h-12 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
                                            <Check className="text-white" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Garanție Conformitate</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug">Respectăm fonturile, culorile și elementele grafice obligatorii conform ghidului vizual.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 p-6 rounded-xl bg-slate-50 dark:bg-slate-800 border border-gray-100">
                                        <div className="w-12 h-12 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
                                            <Check className="text-white" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Grafică Inclusă</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug">Realizăm gratuit machetele pe baza datelor furnizate (titlu proiect, cod SMIS, etc.).</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === "faq" && <FaqAccordion qa={fonduriFaqs} />}
                    </div>
                </div >
            </div >

            {/* MODAL DETALII */}
            {
                detailsOpen && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setDetailsOpen(false)}>
                        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 sm:p-10" onClick={e => e.stopPropagation()}>
                            <button className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 dark:text-gray-400" onClick={() => setDetailsOpen(false)}>
                                <X size={24} />
                            </button>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Informații Kit Vizibilitate</h3>
                            <div className="prose dark:prose-invert prose-sm text-gray-600 dark:text-gray-400">
                                <p>Toate proiectele finanțate prin instrumente structurale ale Uniunii Europene sunt obligate să asigure măsuri de transparență și comunicare.</p>
                                <ul>
                                    <li><strong>Panourile temporare:</strong> Se instalează la locația proiectului pe durata execuției.</li>
                                    <li><strong>Plăcile permanente:</strong> Se montează după finalizarea proiectului (maxim 3 luni).</li>
                                    <li><strong>Comunicatele de presă:</strong> Sunt necesare la începutul și la finalul implementării.</li>
                                </ul>
                                <p className="mt-4 font-bold text-slate-900 dark:text-white">Pas următor:</p>
                                <p>După plasarea comenzii, un specialist vă va contacta pentru a prelua datele proiectului și a vă trimite machetele grafice spre aprobare.</p>
                            </div>
                        </div>
                    </div>
                )
            }
        </main >
    );
}

