"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { ShoppingCart, Info, X, UploadCloud, MessageCircle, TrendingUp, PencilRuler } from "lucide-react";
import Link from 'next/link';
import DeliveryEstimation from "./DeliveryEstimation";
import FaqAccordion from "./FaqAccordion";
import { QA } from "@/types/configurator";
import { calculateBusinessCardPrice, getBusinessCardUpsell, formatMoneyDisplay } from "@/lib/pricing";

const GALLERY_BASE = [
    "/products/carti-vizita/carti-vizita-1.webp",
    "/products/carti-vizita/carti-vizita-2.webp",
    "/products/carti-vizita/carti-vizita-3.webp",
    "/products/carti-vizita/carti-vizita-4.webp"
];

// Map card type to the best preview image
const TYPE_IMAGE_MAP: Record<string, string> = {
    "standard":      "/products/carti-vizita/carti-vizita-1.webp",
    "plastic":       "/products/carti-vizita/carti-vizita-2.webp",
    "transparente":  "/products/carti-vizita/carti-vizita-3.webp",
    "lemn":          "/products/carti-vizita/carti-vizita-4.webp",
    "metalice":      "/products/carti-vizita/carti-vizita-2.webp",
};

const productFaqs: QA[] = [
    { question: "Ce înseamnă plastifiere Soft Touch?", answer: "Este un finisaj premium mat, foarte fin la atingere, care oferă senzația de catifea. Conferă cărților de vizită o notă luxoasă." },
    { question: "Cum pregătesc fișierul grafic?", answer: "Dimensiunea brută (cu bleed) trebuie să fie 94x54 mm (pentru tăiere la 90x50 mm). Toate fonturile trebuie convertite la curbe, iar culorile în format CMYK." },
    { question: "Cât durează execuția pentru cărțile de vizită din plastic sau metalice?", answer: "Pentru cărțile din carton standard/premium 24-48h. Pentru materiale speciale (plastic translucid, lemn, metalic) timpul de producție este de 4-7 zile lucrătoare." }
];

import { AccordionStep } from "./ui/AccordionStep";
import { TabButtonSEO } from "./ui/TabButtonSEO";
import { NumberInput } from "./ui/NumberInput";
import { OptionButton } from "./ui/OptionButton";
import { TabButton } from "./ui/TabButton";

export default function ConfiguratorCartiVizita({ productImage }: { productImage?: string }) {
    const { addItem } = useCart();

    const MIN_QTY = 100;

    // Add placeholder check and map to local images if missing
    const defaultImage = "/products/carti-vizita/carti-vizita-1.webp";
    const baseImage = productImage && !productImage.includes("placeholder") ? productImage : defaultImage;
    const GALLERY = useMemo(() => [baseImage, ...GALLERY_BASE.filter(img => img !== baseImage)], [baseImage]);

    const [input, setInput] = useState<{
        type: "standard" | "plastic" | "transparente" | "lemn" | "metalice",
        size: "standard" | "card_bancar",
        quantity: number,
        twoSided: boolean,
        roundedCorners: boolean,
        specialShape: boolean,
        designOption: "upload" | "pro"
    }>({
        type: "standard",
        size: "standard",
        quantity: 100,
        twoSided: true,
        roundedCorners: false,
        specialShape: false,
        designOption: "upload"
    });

    const [activeImage, setActiveImage] = useState<string>(GALLERY[0]);
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const [detailsOpen, setDetailsOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(1);
    const [activeProductTab, setActiveProductTab] = useState<'descriere' | 'faq'>('descriere');

    const updateInput = <K extends keyof typeof input>(k: K, v: typeof input[K]) => setInput((p) => ({ ...p, [k]: v }));
    const setQty = (v: number) => updateInput("quantity", Math.max(MIN_QTY, Math.floor(v)));

    const priceData = useMemo(() => calculateBusinessCardPrice(input), [input]);
    const displayedTotal = priceData.finalPrice;

    const upsellOpportunity = useMemo(() => getBusinessCardUpsell(input), [input]);

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
            alert("Prețul trebuie calculat."); return;
        }

        const unitPrice = Math.round((displayedTotal / input.quantity) * 100) / 100;
        const uniqueId = `carti-vizita-${Date.now()}`;
        const matLabels = {
            "standard": "Carton Premium 350g",
            "plastic": "Plastic Opac",
            "transparente": "Plastic Transparent",
            "lemn": "Lemn / Furnir Eco",
            "metalice": "Metalic Premium"
        };
        const sizeLabel = input.size === "standard" ? "Standard (9×5 cm)" : "Card Bancar (85×54 mm)";
        const title = `Cărți de Vizită - ${matLabels[input.type]} - ${sizeLabel}`;

        addItem({
            id: uniqueId,
            productId: 'carti-vizita',
            title: title,
            price: unitPrice,
            quantity: input.quantity,
            metadata: {
                "Material": matLabels[input.type],
                "Dimensiune": sizeLabel,
                "Print": input.twoSided ? "Față/Verso" : "O sigură față",
                "Colțuri rotunjite": input.roundedCorners ? "Da" : "Nu",
                "Decupaj Special (Ștanță)": input.specialShape ? "Da" : "Nu",
                "Grafică": input.designOption === 'pro' ? 'Design Pro' : 'Grafică proprie',
                "artworkUrl": artworkUrl,
            },
        });
        alert("Adăugat în coș!");
    }

    useEffect(() => {
        const id = setInterval(() => setActiveIndex((i) => (i + 1) % GALLERY.length), 5000);
        return () => clearInterval(id);
    }, [GALLERY.length]);

    useEffect(() => setActiveImage(GALLERY[activeIndex]), [activeIndex, GALLERY]);

    // Update preview image when card type changes
    useEffect(() => {
        const img = TYPE_IMAGE_MAP[input.type];
        if (img) {
            setActiveImage(img);
            const idx = GALLERY.indexOf(img);
            if (idx >= 0) setActiveIndex(idx);
        }
    }, [input.type]);

    const sizeLabel = input.size === "standard" ? "9×5 cm" : "85×54 mm";
    const summaryStep1 = `${sizeLabel}, ${input.quantity} bucăți`;
    const matLabels = { "standard": "Carton 350g", "plastic": "Plastic", "transparente": "Transparente", "lemn": "Lemn", "metalice": "Metalice" };
    const summaryStep2 = matLabels[input.type];

    return (
        <main className="bg-slate-50 dark:bg-slate-800 min-h-screen">
            <div className="container mx-auto px-4 py-8 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* STÂNGA - VIZUAL */}
                    <div className="lg:sticky top-24 h-max space-y-6">
                        <div className="bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-gray-200 dark:border-slate-800 overflow-hidden">
                            <div className="aspect-square relative flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-800">
                                <img src={activeImage} alt="Cărți de Vizită" className="max-h-full max-w-full object-contain filter drop-shadow-xl" />
                            </div>
                            <div className="p-2 grid grid-cols-4 gap-2 border-t border-gray-100">
                                {GALLERY.map((src, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveIndex(i)}
                                        className={`relative rounded-lg aspect-square overflow-hidden border-2 transition-all ${activeIndex === i ? "border-emerald-600 shadow-md scale-105" : "border-transparent opacity-70 hover:opacity-100"}`}
                                    >
                                        <img src={src} alt="Miniatura" loading="lazy" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* DREAPTA - CONFIGURATOR */}
                    <div>
                        <header className="mb-6">
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Configurează Cărți de Vizită</h2>
                            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Prima impresie contează. Creează cărți de vizită memorabile pe suport de carton premium, plastic, lemn sau metal.</p>
                        </header>

                        <div className="bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-gray-200 dark:border-slate-800 px-4 mb-8">
                            <AccordionStep stepNumber={1} title="Dimensiune & Cantitate" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Dimensiune</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <OptionButton
                                            active={input.size === "standard"}
                                            onClick={() => updateInput("size", "standard")}
                                            title="Standard"
                                            subtitle="9×5 cm"
                                        />
                                        <OptionButton
                                            active={input.size === "card_bancar"}
                                            onClick={() => updateInput("size", "card_bancar")}
                                            title="Card Bancar"
                                            subtitle="85×54 mm"
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Tiraj dorit (bucăți)</label>
                                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                        {[100, 200, 500, 1000, 2500].map(qty => (
                                            <OptionButton
                                                key={qty}
                                                active={input.quantity === qty}
                                                onClick={() => setQty(qty)}
                                                title={`${qty}`}
                                                subtitle="buc"
                                            />
                                        ))}
                                    </div>
                                    <div className="mt-4">
                                        <NumberInput label="Cantitate personalizată" value={input.quantity} onChange={setQty} step={50} min={MIN_QTY} />
                                    </div>
                                </div>
                                {upsellOpportunity && (
                                    <div
                                        className="mt-3 p-3 sm:p-4 bg-emerald-50 border border-emerald-200 rounded-lg cursor-pointer hover:bg-emerald-100 transition-colors flex gap-3 items-center group relative w-full"
                                        onClick={() => setQty(upsellOpportunity.requiredQty)}
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

                            <AccordionStep stepNumber={2} title="Material și Finisaje" summary={summaryStep2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)}>
                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tip Material</label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        <OptionButton active={input.type === "standard"} onClick={() => updateInput("type", "standard")} title="Carton Premium" subtitle="350g mat/lucios" />
                                        <OptionButton active={input.type === "plastic"} onClick={() => updateInput("type", "plastic")} title="Plastic" subtitle="Durabilitate top" />
                                        <OptionButton active={input.type === "transparente"} onClick={() => updateInput("type", "transparente")} title="Transparente" subtitle="Efect sticlă" />
                                        <OptionButton active={input.type === "lemn"} onClick={() => updateInput("type", "lemn")} title="Lemn / Furnir" subtitle="Eco-friendly" />
                                        <OptionButton active={input.type === "metalice"} onClick={() => updateInput("type", "metalice")} title="Metalice" subtitle="Lux absolut" />
                                    </div>
                                </div>
                                <div className="space-y-4 pt-4 border-t border-gray-100">
                                    <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${input.twoSided ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 dark:bg-slate-800 border-gray-200 dark:border-slate-800 hover:bg-gray-100'}`}>
                                        <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" checked={input.twoSided} onChange={(e) => updateInput("twoSided", e.target.checked)} />
                                        <div>
                                            <span className="block text-sm font-bold text-slate-900 dark:text-white">Imprimare Față-Verso</span>
                                            <span className="block text-xs text-gray-500">Design distribuit pe ambele fețe ale cărții</span>
                                        </div>
                                    </label>
                                    <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${input.roundedCorners ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 dark:bg-slate-800 border-gray-200 dark:border-slate-800 hover:bg-gray-100'}`}>
                                        <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" checked={input.roundedCorners} onChange={(e) => updateInput("roundedCorners", e.target.checked)} />
                                        <div>
                                            <span className="block text-sm font-bold text-slate-900 dark:text-white">Colțuri Rotunjite</span>
                                            <span className="block text-xs text-gray-500">Decupaj fin pentru colțuri, oferă eleganță vizuală</span>
                                        </div>
                                    </label>
                                    <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${input.specialShape ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 dark:bg-slate-800 border-gray-200 dark:border-slate-800 hover:bg-gray-100'}`}>
                                        <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" checked={input.specialShape} onChange={(e) => updateInput("specialShape", e.target.checked)} />
                                        <div>
                                            <span className="block text-sm font-bold text-slate-900 dark:text-white">Decupare Formă Specială</span>
                                            <span className="block text-xs text-gray-500">Ștanțare / formă agățată, rotundă sau contur logo</span>
                                        </div>
                                    </label>
                                </div>
                            </AccordionStep>

                            <AccordionStep stepNumber={3} title="Grafică" summary={input.designOption === 'upload' ? 'Am grafica mea' : 'Vreau Grafician'} isOpen={activeStep === 3} onClick={() => setActiveStep(3)} isLast={true}>
                                <div>
                                    {/* Editor Online button removed from here, moved to tabs below */}

                                        <div className="flex -mb-px overflow-x-auto no-scrollbar">
                                            <TabButton active={input.designOption === 'upload'} onClick={() => updateInput("designOption", 'upload')}>Am Grafică</TabButton>
                                            <TabButton active={input.designOption === 'pro'} onClick={() => updateInput("designOption", 'pro')}>Vreau Design Pro</TabButton>
                                            <Link 
                                                href={`/editor?w=9&h=5&product=business-cards`}
                                                className="px-4 py-2 text-sm font-bold transition-all rounded-t-lg bg-orange-600 text-white hover:bg-orange-700 flex items-center gap-2 shrink-0 ml-auto"
                                            >
                                                <PencilRuler size={14} />
                                                Editor Online
                                            </Link>
                                        </div>

                                    {input.designOption === 'upload' && (
                                        <div className="space-y-3">
                                            <label className="flex flex-col items-center justify-center w-full h-32 px-4 bg-white border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-emerald-400 transition-colors">
                                                <UploadCloud className="w-8 h-8 text-gray-400 mb-1" />
                                                <span className="font-medium text-gray-600 dark:text-gray-400">Încarcă Machetă (PDF/CDR/Ai)</span>
                                                <input type="file" className="hidden" onChange={e => handleArtworkFileInput(e.target.files?.[0] ?? null)} />
                                            </label>
                                            {uploading && <p className="text-sm text-emerald-600 mt-2">Se încarcă...</p>}
                                            {artworkUrl && <p className="text-sm text-green-600 font-semibold mt-2">Grafică recepționată!</p>}
                                            
                                            <p className="text-xs text-gray-500 mt-2"><Info size={12} className="inline mr-1" /> PDF, minim 300 DPI, format CMYK.</p>
                                        </div>
                                    )}

                                    {input.designOption === 'pro' && (
                                        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">
                                            <p className="font-semibold text-lg mb-1">Serviciu Premium de Design</p>
                                            <p>Designerii noștri vor concepe o grafică excepțională de la zero (Cost fix design adăugat pe comandă). Veți fi sunat pentru aprobarea graficii înainte de tipar.</p>
                                        </div>
                                    )}
                                </div>
                            </AccordionStep>
                        </div>

                        {/* TOTAL & ADD TO CART */}
                        <div className="static mt-8 z-40 lg:static bg-white/95 backdrop-blur-md lg:bg-white lg:backdrop-blur-none border-t lg:border border-gray-200 dark:border-slate-800 lg:rounded-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] lg:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] p-4 lg:p-6 transition-all">
                            <div className="flex flex-col gap-4">
                                <button onClick={handleAddToCart} className="w-full py-4 text-lg font-bold bg-emerald-600 text-white rounded-xl shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 active:scale-95">
                                    <ShoppingCart size={24} />
                                    Adaugă în Coș
                                </button>

                                <div className="flex flex-row justify-between items-center w-full gap-2 pt-1 mt-1 border-t border-gray-100">
                                    <div className="flex flex-col items-start leading-none">
                                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Total comandă</span>
                                        <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{formatMoneyDisplay(displayedTotal)}</span>
                                        <span className="text-xs text-green-600 font-bold mt-1">~ {formatMoneyDisplay(displayedTotal / input.quantity)}/buc</span>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <DeliveryEstimation />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* BUTOANE SECUNDARE */}
                        <div className="mt-4 lg:mt-6 bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl border border-slate-200 p-4">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 text-center font-medium">Cantități uriașe sau efecte speciale (Folio)?</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <a
                                    href="https://wa.me/40750473111?text=Buna%20ziua,%20ma%20intereseaza%20o%20oferta%20pentru%20carti%20de%20vizita."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] transition-all duration-200"
                                >
                                    <MessageCircle size={18} />
                                    <span className="text-sm">Vorbim pe WhatsApp</span>
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

                {/* INFO SECTION */}
                <div className="mt-8 lg:mt-12 bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-gray-200 dark:border-slate-800 overflow-hidden">
                    <nav className="border-b border-gray-200 dark:border-slate-800 flex overflow-x-auto">
                        <TabButtonSEO active={activeProductTab === "descriere"} onClick={() => setActiveProductTab("descriere")}>Descriere Materiale</TabButtonSEO>
                        <TabButtonSEO active={activeProductTab === "faq"} onClick={() => setActiveProductTab("faq")}>Întrebări Frecvente</TabButtonSEO>
                    </nav>

                    <div className="p-6 lg:p-8">
                        {activeProductTab === 'descriere' && (
                            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Materiale Excepționale pentru Cărți de Vizită</h2>
                                <p className="leading-relaxed mb-6">
                                    Pe lângă cartonul standard impecabil, oferim suporturi din materiale de nișă pentru afaceri unde detaliul și calitatea premium dictează totul.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-xl font-bold text-emerald-900 mb-3">Materiale Neconvenționale</h3>
                                        <ul className="space-y-2 list-disc pl-5">
                                            <li><strong>Cărți din Plastic:</strong> Grosime de 0.5 - 0.7mm, identice la atingere cu un card bancar. Rezistă la apă, la îndoire și la rupere.</li>
                                            <li><strong>Plastic Transparent:</strong> O carte de vizită "de sticlă". Grafica imprimată pe o parte, lăsând restul cardului clar-transparent pentru un efect de surpriză garantat.</li>
                                            <li><strong>Lemn / Furnir:</strong> Dedicate profesiilor eco / arthitecture. Material subțire printat UV care conferă prospețime și inovație.</li>
                                            <li><strong>Metalic:</strong> Suport din aluminiu periat auriu sau argintiu pentru membri VIP sau cluburi cu un statut excepțional.</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-emerald-900 mb-3">Finisaje Optionale</h3>
                                        <p className="mb-2"><strong>Plastifierea Soft-Touch:</strong> Un strat absolut obligatoriu pentru cărțile cu multă cerneală. Împiedică amprentele, conferă matifiere extremă și este fină la atingere.</p>
                                        <p><strong>Colțuri Rotunjite:</strong> Elimină șifonarea rapidă a colțurilor în portofel și face prezentarea mai elegantă.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeProductTab === 'faq' && <FaqAccordion qa={productFaqs} />}
                    </div>
                </div>
            </div>
        </main>
    );
}


