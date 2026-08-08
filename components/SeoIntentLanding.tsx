"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Zap, MessageCircle, Sparkles, ShieldCheck, Truck, Star, Award, ChevronRight, Info, CheckCircle2, HelpCircle } from "lucide-react";
import { spintax } from "@/lib/seo/spintax";
import { useRouter } from "next/navigation";
import MasterConfigurator from "@/components/MasterConfigurator";

interface SeoIntentLandingProps {
    productId: string;
    productName: string;
    intent: string;
    intentLabel: string;
}

export function SeoIntentLanding({ productId, productName, intent, intentLabel }: SeoIntentLandingProps) {
    const router = useRouter();
    
    const onStartConfig = () => {
        router.push(window.location.pathname + "?step=config");
        window.scrollTo(0, 0);
    };
    const productImage = `/products/${productId}/${productId}-1.webp`;
    const [imgSrc, setImgSrc] = useState(productImage);

    const heroText = spintax(`{Realizăm|Producem|Tipărim} ${productName.toLowerCase()} pentru ${intentLabel.toLowerCase()} la {cea mai înaltă calitate|standarde profesionale}. {Fiecare detaliu|Fiecare comandă} de ${intentLabel.toLowerCase()} este tratată cu {maximă atenție|precizie} pentru a asigura un {rezultat de impact|aspect impecabil}.`, `${intent}-head`);

    const features = [
        { 
            title: "Calitate Premium", 
            desc: `Producem ${productName.toLowerCase()} folosind tehnologie de ultimă generație pentru culori vii și rezistență sporită.`,
            icon: <Sparkles className="text-emerald-500" />
        },
        { 
            title: "Design Dedicat", 
            desc: `Opțiuni de personalizare specifice pentru ${intentLabel.toLowerCase()}, gata să atragă atenția clienților tăi.`,
            icon: <Award className="text-blue-500" />
        },
        { 
            title: "Livrare Rapidă", 
            desc: "Comandă online și primești produsul tău în cel mai scurt timp, oriunde în țară, prin curier rapid.",
            icon: <Truck className="text-amber-500" />
        }
    ];

    return (
        <div className="bg-[#fafafc] min-h-screen">
            {/* HERO SECTION */}
            <div className="w-full bg-white border-b border-slate-100 overflow-hidden relative">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full" />

                <div className="max-w-7xl mx-auto px-4 py-12 md:py-24 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
                        <div className="flex-1 order-2 lg:order-1 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 rounded-full text-emerald-600 font-black text-xs uppercase tracking-widest mb-6 border border-emerald-100 shadow-sm">
                                <Sparkles size={14} className="animate-pulse" /> Soluții Dedicate: {intentLabel}
                            </div>
                            
                            <h1 className="text-4xl md:text-7xl font-black text-slate-900 leading-[0.95] tracking-tighter mb-8 uppercase">
                                {productName} <br />
                                <span className="text-emerald-500">PENTRU {intentLabel}</span>
                            </h1>

                            <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0">
                                {heroText}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center lg:justify-start">
                                <button onClick={onStartConfig} className="px-10 py-5 bg-slate-950 text-white rounded-2xl font-black text-lg hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 shadow-2xl hover:shadow-emerald-500/20 active:scale-95 group">
                                    <Zap size={22} className="fill-current group-hover:animate-pulse" /> CONFIGUREAZĂ ACUM
                                </button>
                                <a href={`https://wa.me/40750473111?text=Bună%20ziua,%20mă%20interesează%20${encodeURIComponent(productName)}%20pentru%20${encodeURIComponent(intentLabel)}`} target="_blank" className="px-10 py-5 bg-white text-slate-900 border-2 border-slate-200 rounded-2xl font-black text-lg hover:border-emerald-500 hover:text-emerald-600 transition-all flex items-center justify-center gap-3 shadow-sm active:scale-95 group">
                                    <MessageCircle size={22} className="group-hover:text-emerald-500" /> CERE OFERTĂ
                                </a>
                            </div>

                            <div className="flex flex-wrap justify-center lg:justify-start gap-8 opacity-70">
                                <div className="flex items-center gap-2"><ShieldCheck size={18} className="text-emerald-500" /><span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Garanție Calitate</span></div>
                                <div className="flex items-center gap-2"><Truck size={18} className="text-slate-900" /><span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Livrare 24-48h</span></div>
                                <div className="flex items-center gap-2"><Star size={18} className="text-amber-500 fill-amber-500" /><span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Design Premium</span></div>
                            </div>
                        </div>

                        <div className="flex-1 order-1 lg:order-2 w-full max-w-[600px] lg:max-w-none">
                            <div className="relative group flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-blue-500/5 rounded-full blur-[120px] opacity-40 group-hover:opacity-100 transition-opacity duration-1000" />
                                <div className="relative w-full aspect-square flex items-center justify-center p-4">
                                    <Image 
                                        src={imgSrc} 
                                        alt={`${productName} ${intentLabel}`} 
                                        fill
                                        className="object-contain relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.12)] group-hover:scale-105 transition-transform duration-700 ease-out" 
                                        onError={() => setImgSrc('/products/banner/banner-1.webp')}
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        priority
                                    />
                                    <div className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-white/40 backdrop-blur-sm rounded-full border border-white/20">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Vizualizare 1:1</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* OTHER PRODUCTS SECTION - MOVED HIGHER */}
            <div className="max-w-[1440px] mx-auto px-4 py-24 border-b border-slate-100 bg-white">
                <div className="text-center mb-16 px-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">
                        <Zap size={14} className="text-emerald-500" /> EXPLOREAZĂ TOATĂ GAMA
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Configuratoare Online</h2>
                    <p className="text-slate-500 mt-4 font-medium italic">Vezi toate produsele noastre cu preț instant.</p>
                </div>

                <div className="container mx-auto">
                    <MasterConfigurator />
                </div>
            </div>

            {/* PREMIUM FEATURES SECTION - REDESIGNED */}
            <div className="py-32 bg-slate-50 relative overflow-hidden">
                {/* Visual background accents */}
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full" />

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="text-center mb-24">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-white rounded-full border border-slate-100 shadow-sm text-slate-400 text-[10px] font-black uppercase tracking-[0.25em] mb-6">
                            <ShieldCheck size={16} className="text-emerald-500" /> Standard de Calitate Tablou
                        </div>
                        <h2 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9] mb-8">
                            Excelență în Print <br/>
                            <span className="text-emerald-500 italic">PENTRU {intentLabel}</span>
                        </h2>
                        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed italic opacity-80">
                            Fiecare comandă trece prin 3 puncte de control. Nu livrăm doar produse, livrăm perfecțiune vizuală.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { 
                                title: "CALITATE PREMIUM", 
                                desc: `Producem ${productName.toLowerCase()} folosind tehnologie de ultimă generație pentru culori vii și rezistență sporită peste ani.`,
                                icon: <Sparkles />,
                                color: "text-emerald-500",
                                bg: "bg-emerald-50",
                                glow: "shadow-emerald-500/10",
                            },
                            { 
                                title: "DESIGN DEDICAT", 
                                desc: `Configurații și finisaje special gândite pentru ${intentLabel.toLowerCase()} pentru a capta atenția oricărui privitor.`,
                                icon: <Award />,
                                color: "text-blue-500",
                                bg: "bg-blue-50",
                                glow: "shadow-blue-500/10",
                            },
                            { 
                                title: "LIVRARE RAPIDĂ", 
                                desc: "Producție accelerată în 24-48h. Ambalare de protecție pentru transport securizat oriunde în țară.",
                                icon: <Truck />,
                                color: "text-amber-500",
                                bg: "bg-amber-50",
                                glow: "shadow-amber-500/10",
                            }
                        ].map((f, i) => (
                            <div key={i} className={`group bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-xl ${f.glow} hover:shadow-2xl hover:-translate-y-3 transition-all duration-700 relative overflow-hidden h-full flex flex-col`}>
                                {/* Decorative Number */}
                                <div className="absolute top-0 right-0 -mr-4 -mt-4 text-9xl font-black text-slate-50/50 italic pointer-events-none group-hover:text-emerald-50 transition-colors duration-700 select-none">
                                    0{i + 1}
                                </div>
                                
                                <div className={`w-16 h-16 rounded-2xl ${f.bg} ${f.color} flex items-center justify-center mb-10 border border-white shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                                    {React.cloneElement(f.icon as React.ReactElement, { size: 32, strokeWidth: 2.5 })}
                                </div>
                                
                                <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tight leading-none italic group-hover:text-emerald-600 transition-colors uppercase">
                                    {f.title}
                                </h3>
                                
                                <p className="text-slate-500 text-base leading-relaxed font-medium flex-1">
                                    {f.desc}
                                </p>

                                <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase text-slate-300 tracking-[0.2em]">Verificat Tablou</span>
                                    <div className={`w-2 h-2 rounded-full ${f.color.replace('text-', 'bg-')} animate-pulse`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* SEO DESCRIPTIVE TEXT SECTION */}
            <div className="bg-slate-50 py-24 border-t border-slate-100">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex items-center gap-3 text-emerald-600 mb-6">
                        <Info size={24} />
                        <span className="font-black uppercase tracking-[0.2em] text-sm">Ghid de Comandă: {intentLabel}</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 tracking-tighter uppercase leading-none">
                        Tot ce trebuie să știi despre <br className="hidden md:block"/> {productName} pentru {intentLabel}
                    </h2>
                    <div className="prose prose-slate max-w-none">
                        <p className="text-lg text-slate-500 font-medium leading-relaxed mb-6">
                            {spintax(`{Atunci când alegi|Dacă ești în căutarea unor} ${productName.toLowerCase()} pentru {scopul de|nevoia ta de} ${intentLabel.toLowerCase()}, {calitatea materialelor|rezistența printului} este {esențială|prioritară}. La Tablou, {folosim tehnologii de ultimă oră|ne asigurăm} că fiecare ${productName.toLowerCase()} {respectă cele mai înalte standarde|arată impecabil}.`, `${intent}-seo-1`)}
                        </p>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed mb-6">
                            {spintax(`{Producția noastră|Echipa noastră tehnică} {este optimizată|se ocupă special} de comenzile de ${intentLabel.toLowerCase()}, oferind {finisaje premium|detalii de excepție} care {atrag privirea|durează în timp}. {Fiecare produs|Fiecare comandă} trece printr-un {control riguros al calității|proces de verificare amănunțit} înainte de livrare.`, `${intent}-seo-2`)}
                        </p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                            {[
                                `Materiale premium selectate pentru ${intentLabel}`,
                                "Print UV rezistent la raze solare și intemperii",
                                "Culori vibrante cu redare fidelă a detaliilor",
                                "Timp record de producție și livrare rapidă",
                                "Asistență tehnică pentru verificarea fișierelor",
                                "Ambalare sigură pentru transport fără riscuri"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* FAQ SECTION */}
            <div className="bg-white py-24 border-t border-slate-100">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">
                            <HelpCircle size={14} className="text-emerald-500" /> SUPORT ȘI CLARITATE
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Întrebări Frecvente</h2>
                        <p className="text-slate-500 mt-4 font-medium italic">Tot ce trebuie să știi despre comanda ta de {productName.toLowerCase()} pentru {intentLabel.toLowerCase()}.</p>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: `Cât durează producția pentru ${productName.toLowerCase()} de ${intentLabel.toLowerCase()}?`,
                                a: `De regulă, timpul de execuție este de 24-48 de ore din momentul confirmării graficii. Suntem echipați pentru a gestiona comenzi urgente pentru evenimente de tip ${intentLabel.toLowerCase()}.`
                            },
                            {
                                q: `Pot folosi aceste ${productName.toLowerCase()} în exterior?`,
                                a: `Da, folosim cerneluri rezistente la raze UV și materiale durabile, ceea ce le face ideale atât pentru interior, cât și pentru expunere outdoor prelungită.`
                            },
                            {
                                q: `Cum livrați produsele de ${intentLabel.toLowerCase()}?`,
                                a: "Livrăm prin curier rapid oriunde în țară, ambalând produsele în tuburi de protecție sau cutii ranforsate pentru a evita orice deteriorare pe durata transportului."
                            },
                            {
                                q: "Aveți nevoie de un format special de fișier?",
                                a: "Acceptăm majoritatea formatelor grafice (PDF, TIFF, AI, JPEG de înaltă rezoluție). Echipa noastră verifică gratuit fișierele trimise pentru a ne asigura că rezultatul de print va fi optim."
                            }
                        ].map((faq, i) => (
                            <div key={i} className="group bg-slate-50 rounded-3xl p-8 hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200">
                                <h3 className="text-lg font-black text-slate-900 mb-4 flex items-start gap-3">
                                    <span className="text-emerald-500">Q:</span> {faq.q}
                                </h3>
                                <div className="pl-8 text-slate-500 font-medium leading-relaxed">
                                    {faq.a}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA SECTION */}
            <div className="bg-slate-950 py-24 relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-6xl font-black text-white mb-8 tracking-tighter uppercase">GATA SĂ LANSEZI <br/> PROIECTUL TĂU?</h2>
                    <p className="text-emerald-400/80 text-lg md:text-xl mb-12 font-medium max-w-2xl mx-auto uppercase tracking-widest">Configurează acum online sau vorbește cu un specialist pe WhatsApp pentru o ofertă personalizată.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={onStartConfig} className="px-12 py-6 bg-emerald-600 text-white rounded-2xl font-black text-xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20 active:scale-95"> <Zap size={24} fill="white" /> CONFIGURATOR </button>
                        <a href="https://wa.me/40750473111" className="px-12 py-6 bg-white/10 text-white rounded-2xl font-black text-xl hover:bg-white/20 transition-all flex items-center justify-center gap-3 backdrop-blur-md active:scale-95"> <MessageCircle size={24} fill="white" /> WHATSAPP </a>
                    </div>
                </div>
                <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/20 blur-[120px] rounded-full" />
                    <div className="absolute top-1/4 right-0 -translate-x-1/4 w-[300px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full" />
                </div>
            </div>

            {/* Sticky Mobile Footer */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-100 md:hidden z-[60] flex gap-3 shadow-2xl">
                <button onClick={onStartConfig} className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-black text-sm uppercase flex items-center justify-center gap-2"> <Zap size={16} fill="white" /> Configurează </button>
                <a href="https://wa.me/40750473111" className="flex-1 bg-[#25D366] text-white py-4 rounded-xl font-black text-sm uppercase flex items-center justify-center gap-2"> <MessageCircle size={18} fill="white" /> WhatsApp </a>
            </div>
            <div className="h-24 md:hidden" />
        </div>
    );
}
