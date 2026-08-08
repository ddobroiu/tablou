"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Zap, MessageCircle, Star, ShieldCheck, Truck, Award, Sparkles, Ruler, ChevronRight, Info, CheckCircle2, ChevronDown, HelpCircle } from "lucide-react";
import { spintax } from "@/lib/seo/spintax";
import { useRouter } from "next/navigation";
import { CONFIGURATORS_REGISTRY } from "@/lib/configurators-registry";
import { motion, AnimatePresence } from "framer-motion";

interface SeoDimensionLandingProps {
    productId: string;
    productName: string;
    w: number;
    h: number;
}

const FAQItem = ({ question, answer, isOpen, onClick }: { question: string, answer: string, isOpen: boolean, onClick: () => void }) => {
    return (
        <div className="border-b border-slate-100 last:border-0">
            <button
                onClick={onClick}
                className="w-full flex items-center justify-between text-left py-5 focus:outline-none group"
            >
                <span className="text-slate-900 font-bold text-lg group-hover:text-emerald-600 transition-colors tracking-tight">
                    {question}
                </span>
                <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-500' : ''}`}
                />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="text-slate-500 leading-relaxed text-base pb-6 font-medium">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export function SeoDimensionLanding({ productId, productName, w, h }: SeoDimensionLandingProps) {
    const router = useRouter();
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
    
    const onStartConfig = () => {
        router.push(window.location.pathname + "?step=config");
        window.scrollTo(0, 0);
    };
    
    // Find active product from registry
    const activeProduct = CONFIGURATORS_REGISTRY.find(p => p.id === productId);
    const productImage = activeProduct?.image || `/products/${productId}/${productId}-1.webp`;
    const [imgSrc, setImgSrc] = useState(productImage);
    
    // Dynamic text for dimensions
    const heroText = spintax(`{Producem|Realizăm|Tipărim} ${productName.toLowerCase()} la dimensiunea fixă de ${w}x${h} cm {pentru impact maxim|cu precizie milimetrică}. {Fiecare|Orice} ${productName.toLowerCase()} de ${w}x${h} cm este {făcut să reziste|verificat manual} și {gata de montat|livrat rapid} prin Tablou.`, `${productId}-${w}x${h}`);

    const highlights = [
        { title: "Precizie 100%", desc: `Dimensiuni exacte de ${w}x${h} cm.` },
        { title: "Print HD", desc: "Rezoluție fotografică ultra-clară." },
        { title: "Rezistent UV", desc: "Cerneluri care nu se decolorează la soare." },
        { title: "Livrare 24h", desc: "Expediere rapidă în toată țara." }
    ];

    const dimensionFaqs = [
        {
            question: `Cât costă un ${productName.toLowerCase()} de ${w}x${h} cm?`,
            answer: spintax(`{Prețul pentru un ${productName.toLowerCase()} de ${w}x${h} cm se calculează instantaneu în configuratorul nostru online.|Costul este afișat imediat ce alegi materialul și finisajele dorite pentru formatul ${w}x${h} cm.} {De regulă, producem la cele mai competitive prețuri din piață, oferind și reduceri de volum.|Tablou îți oferă cel mai bun raport calitate-preț pentru acest format standard.}`, `${productId}-${w}x${h}-price`)
        },
        {
            question: `În cât timp este gata comanda pentru formatul ${w}x${h} cm?`,
            answer: spintax(`{Orice ${productName.toLowerCase()} de ${w}x${h} cm intră în producție imediat după confirmarea graficii.|Termenul de execuție pentru dimensiunea ${w}x${h} cm este de 24-48 ore lucrătoare.} {Livrarea se face prin curier rapid în toată România, astfel încât să primești pachetul cât mai repede.|Expediem rapid prin curier direct la adresa ta, oriunde în țară.}`, `${productId}-${w}x${h}-time`)
        },
        {
            question: `Ce rezoluție trebuie să aibă grafica pentru ${w}x${h} cm?`,
            answer: spintax(`{Pentru un rezultat impecabil la ${w}x${h} cm, recomandăm o rezoluție de minim 150 DPI la dimensiunea reală.|Grafica pentru ${productName.toLowerCase()} ${w}x${h} cm este verificată gratuit de echipa noastră înainte de printare.} {Dacă fișierul nu este bun, te vom contacta imediat pentru a-l corecta.|Ne asigurăm că totul este perfect înainte de a apăsa butonul de print.}`, `${productId}-${w}x${h}-res`)
        },
        {
            question: `Se poate monta ușor acest ${productName.toLowerCase()}?`,
            answer: spintax(`{Da, formatul ${w}x${h} cm este ușor de manipulat și montat.|Dimensiunea de ${w}x${h} cm este una dintre cele mai populare datorită ușurinței în montaj.} {Putem adăuga finisaje precum capse sau buzunare pentru a facilita instalarea.|Include finisaje premium care fac instalarea să fie o joacă de copii.}`, `${productId}-${w}x${h}-mount`)
        }
    ];

    // Filter registry for other products (excluding current one)
    const otherProducts = CONFIGURATORS_REGISTRY.filter(p => p.id !== productId).slice(0, 12);

    return (
        <div className="bg-[#fafafc] min-h-screen">
            {/* HERO SECTION */}
            <div className="w-full bg-white border-b border-slate-100 overflow-hidden relative">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full" />

                <div className="max-w-7xl mx-auto px-4 py-12 md:py-24 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
                        <div className="flex-1 order-2 lg:order-1 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-900 rounded-full text-white font-black text-[10px] uppercase tracking-[0.2em] mb-8 border border-slate-800 shadow-xl">
                                <Ruler size={14} className="text-emerald-400" /> Format Standard: {w}x{h} CM
                            </div>
                            <h1 className="text-5xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-8 uppercase">
                                {productName} <br />
                                <span className="text-emerald-500">{w}X{h} CM</span>
                            </h1>
                            <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed mb-6 max-w-2xl mx-auto lg:mx-0">
                                {heroText}
                            </p>

                            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-10 flex items-start gap-4 max-w-xl mx-auto lg:mx-0 text-left">
                                <div className="p-2 bg-emerald-500 text-white rounded-lg shrink-0">
                                    <Sparkles size={18} />
                                </div>
                                <div>
                                    <h4 className="text-emerald-900 font-black text-sm uppercase tracking-tight leading-none mb-1">Dimensiune Personalizată?</h4>
                                    <p className="text-emerald-700 text-xs font-medium leading-tight">Putem realiza acest produs la absolut <strong className="font-black">ORICE</strong> dimensiune ai nevoie, chiar dacă nu este în tabelul de mai jos.</p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center lg:justify-start">
                                <button onClick={onStartConfig} className="px-10 py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-500 transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95 group">
                                    <Zap size={22} className="fill-current" /> CONFIGUREAZĂ ONLINE
                                </button>
                                <a href={`https://wa.me/40750473111?text=Bună%20ziua,%20mă%20interesează%20${encodeURIComponent(productName)}%20la%20dimensiunea%20${w}x${h}%20cm`} target="_blank" className="px-10 py-5 bg-white text-slate-900 border-2 border-slate-200 rounded-2xl font-black text-lg hover:border-emerald-500 hover:text-emerald-600 transition-all flex items-center justify-center gap-3 shadow-sm active:scale-95">
                                    <MessageCircle size={22} /> WHATSAPP
                                </a>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                {highlights.map((h, i) => (
                                    <div key={i} className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1.5 text-emerald-600 font-black text-[10px] uppercase tracking-wider text-left lg:text-left">
                                            <CheckCircle2 size={12} /> {h.title}
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-none text-left lg:text-left">{h.desc}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 order-1 lg:order-2 w-full max-w-[600px] lg:max-w-none">
                            <div className="relative group flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-blue-500/5 rounded-full blur-[100px] opacity-60" />
                                <div className="relative w-full aspect-square flex items-center justify-center p-4">
                                    <Image 
                                        src={imgSrc} 
                                        alt={`${productName} ${w}x${h} cm`} 
                                        fill
                                        className="object-contain relative z-10 drop-shadow-[0_20px_40px_rgba(0,0,0,0.1)] group-hover:scale-105 transition-transform duration-700 ease-out" 
                                        onError={() => setImgSrc('/products/banner/banner-1.webp')}
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        priority
                                    />
                                    <div className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-white/40 backdrop-blur-sm rounded-full border border-white/20">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest text-left">Vizualizare 1:1</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SPECS & INFO SECTION */}
            <div className="max-w-7xl mx-auto px-4 py-24">
                <div className="flex flex-col md:flex-row gap-16 items-center">
                    <div className="flex-1">
                        <h2 className="text-3xl md:text-6xl font-black text-slate-900 mb-8 tracking-tighter uppercase leading-[0.95]">
                            DETALII TEHNICE <br/> {productName} <span className="text-emerald-500">{w}X{h} CM</span>
                        </h2>
                        <div className="space-y-6 max-w-xl text-left">
                            <p className="text-lg text-slate-500 font-medium leading-relaxed">
                                Fiecare {productName.toLowerCase()} la formatul {w}x{h} cm este optimizat pentru a oferi cea mai bună experiență de vizualizare. Utilizăm suporturi de print selectate special pentru această dimensiune, asigurând stabilitate și durabilitate.
                            </p>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[ `Format optim ${w}x${h} cm`, "Finisaje premium incluse", "Rezistență outdoor 3-5 ani", "Control de calitate la livrare", "Cerneluri non-toxice ECO", "Suport montaj opțional" ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between aspect-square md:aspect-auto md:h-64">
                            <Truck size={32} className="text-emerald-500 mb-4" />
                            <div className="text-left">
                                <h3 className="text-xl font-black text-slate-900 uppercase mb-2 leading-none tracking-tight">Livrăm în 24h</h3>
                                <p className="text-slate-400 text-xs font-medium leading-tight text-left">Producție accelerată pentru orice comandă plasată azi.</p>
                            </div>
                        </div>
                        <div className="bg-slate-950 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl flex flex-col justify-between aspect-square md:aspect-auto md:h-64">
                            <Award size={32} className="text-emerald-400 mb-4" />
                            <div className="text-left">
                                <h3 className="text-xl font-black text-white uppercase mb-2 leading-none tracking-tight text-emerald-400">Garanție Tablou</h3>
                                <p className="text-slate-500 text-xs font-medium leading-tight text-left">Dacă nu ești 100% mulțumit, îți returnăm banii.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Explore Other Products - MOVED HIGHER */}
            <div className="bg-white py-24 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">
                            <Zap size={14} className="text-emerald-500" /> EXPLOREAZĂ TOATĂ GAMA
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Configuratoare Online</h2>
                        <p className="text-slate-500 mt-4 font-medium italic">Vezi toate produsele noastre cu preț instant.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
                        {CONFIGURATORS_REGISTRY.map((config) => {
                            const rpSlug = config.slug || config.id;
                            if (rpSlug === productId) return null;

                            return (
                                <Link
                                    key={config.id}
                                    href={`/configurator/${rpSlug}`}
                                    className="group relative flex flex-col items-center text-center rounded-[2rem] border border-slate-200/60 transition-all duration-500 overflow-hidden hover:border-emerald-400 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.15)] hover:-translate-y-2 bg-white h-full"
                                >
                                    <div className="w-full aspect-square relative bg-slate-50 border-b border-slate-100 flex items-center justify-center overflow-hidden">
                                        {config.image ? (
                                            <Image
                                                src={config.image}
                                                alt={config.name}
                                                fill
                                                className="object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                                                sizes="150px"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-200 animate-pulse flex items-center justify-center text-slate-400 font-black uppercase text-[10px] tracking-widest">Imagine Lipsă</div>
                                        )}
                                        <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/[0.03] transition-colors duration-500" />
                                    </div>

                                    <div className="p-5 w-full flex-1 flex flex-col items-center justify-center bg-white relative">
                                        <h4 className="font-black text-[10px] md:text-xs leading-tight tracking-tight transition-all duration-300 text-slate-800 group-hover:text-emerald-600 uppercase italic tracking-tighter">
                                            {config.name}
                                        </h4>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Dimension FAQ Section */}
            <div className="bg-white py-24 border-t border-slate-100">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">
                            <HelpCircle size={14} className="text-emerald-500" /> SUPORT CONFIGURARE {w}x{h}
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Întrebări Frecvente</h2>
                        <p className="text-slate-500 mt-4 font-medium italic">Tot ce trebuie să știi despre comanda ta de {productName.toLowerCase()} la {w}x{h} cm.</p>
                    </div>
                    
                    <div className="bg-slate-50/50 rounded-[3rem] p-8 md:p-12 border border-slate-100">
                        {dimensionFaqs.map((faq, i) => (
                            <FAQItem 
                                key={i} 
                                question={faq.question} 
                                answer={faq.answer} 
                                isOpen={openFaqIndex === i} 
                                onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* DIMENSION GRID */}
            <div className="bg-slate-50 py-24 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 text-left lg:text-center">
                    <div className="mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter uppercase leading-none">ALTE DIMENSIUNI PENTRU {productName}</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto font-medium">Alege formatul care se potrivește cel mai bine spațiului tău.</p>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-3">
                        {[
                            // Square formats
                            {w: 20, h: 20}, {w: 30, h: 30}, {w: 40, h: 40}, {w: 50, h: 50}, {w: 60, h: 60}, {w: 80, h: 80}, {w: 100, h: 100}, {w: 150, h: 150},
                            // Small/Medium Landscape
                            {w: 30, h: 20}, {w: 40, h: 30}, {w: 60, h: 40}, {w: 80, h: 60}, {w: 90, h: 60}, {w: 100, h: 70}, {w: 120, h: 80}, {w: 150, h: 100},
                            // Small/Medium Portrait
                            {w: 20, h: 30}, {w: 30, h: 40}, {w: 40, h: 60}, {w: 60, h: 80}, {w: 60, h: 90}, {w: 70, h: 100}, {w: 80, h: 120}, {w: 100, h: 150},
                            // Long Banners (Landscape)
                            {w: 200, h: 50}, {w: 300, h: 50}, {w: 400, h: 50}, {w: 200, h: 100}, {w: 300, h: 100}, {w: 400, h: 100}, {w: 500, h: 100}, {w: 200, h: 150}, {w: 300, h: 150}, {w: 400, h: 150}, {w: 500, h: 150}, {w: 600, h: 200},
                            // Standard A-series approximations (cm)
                            {w: 21, h: 30}, {w: 30, h: 42}, {w: 42, h: 60}, {w: 60, h: 84}, {w: 84, h: 119}, {w: 100, h: 140}
                        ].filter(dim => dim.w !== w || dim.h !== h).map((dim, i) => (
                            <Link key={i} href={`/configurator/${productId}-${dim.w}x${dim.h}`} className="px-2 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-emerald-600 hover:border-emerald-500 transition-all text-[10px] md:text-xs font-black text-center shadow-sm uppercase tracking-tighter">
                                {dim.w}x{dim.h} CM
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA FOOTER */}
            <div className="bg-white py-24 border-t border-slate-100 relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter uppercase leading-[0.9]">LANSEAZĂ COMANDA <br/> PENTRU {w}X{h} CM</h2>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={onStartConfig} className="px-12 py-6 bg-slate-950 text-white rounded-2xl font-black text-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95"> <Zap size={24} fill="white" /> CONFIGURATOR </button>
                        <a href="https://wa.me/40750473111" className="px-12 py-6 bg-[#25D366] text-white rounded-2xl font-black text-xl hover:bg-[#128C7E] transition-all flex items-center justify-center gap-3 shadow-xl shadow-green-500/10 active:scale-95"> <MessageCircle size={24} fill="white" /> WHATSAPP </a>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Footer */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-100 md:hidden z-[60] flex gap-3 shadow-2xl">
                <button onClick={onStartConfig} className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-black text-sm uppercase flex items-center justify-center gap-2"> <Zap size={16} fill="white" /> Configurează </button>
                <a href="https://wa.me/40750473111" className="flex-1 bg-[#25D366] text-white py-4 rounded-xl font-black text-sm uppercase flex items-center justify-center gap-2"> <MessageCircle size={18} fill="white" /> WhatsApp </a>
            </div>
            <div className="h-24 md:hidden" />
        </div>
    );
}
