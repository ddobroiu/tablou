"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react';

const HERO_ITEMS = [
    {
        id: 'banner',
        title: 'Bannere Publicitare',
        subtitle: 'Format Mare. Calitate Ultra HD.',
        description: 'Bannere outdoor rezistente la intemperii. Printate la rezoluție fotografică pentru impact stradal maxim.',
        image: '/products/banner/banner-1.webp',
        link: '/configurator/banner',
        accent: 'bg-emerald-500',
        badge: 'Outdoor'
    },
    {
        id: 'fonduri-eu',
        title: 'Kituri Fonduri EU',
        subtitle: 'Conform manualului de identitate.',
        description: 'Panouri, plăci și autocolante reglementate pentru proiecte PNRR, Regio. Aprobare sigură.',
        image: '/products/master/pachet-vizibilitate-fonduri-europene-pnrr.png',
        link: '/fonduri-pnrr',
        accent: 'bg-emerald-600',
        badge: 'Instituțional'
    },
    {
        id: 'autocolante',
        title: 'Autocolante & Stickere',
        subtitle: 'Decupaj digital precis pe contur.',
        description: 'Forme personalizate, rezistență UV excepțională și culori vibrante, gata de aplicare.',
        image: '/products/autocolante/autocolante-1.webp',
        link: '/configurator/autocolante',
        accent: 'bg-pink-500',
        badge: 'Custom'
    },
    {
        id: 'rollup',
        title: 'Roll-up Banners',
        subtitle: 'Impact vizual oriunde mergi.',
        description: 'Sisteme expoziționale premium. Portabilitate maximă, montaj rapid în 30 de secunde.',
        image: '/products/rollup/rollup-1.webp',
        link: '/configurator/rollup',
        accent: 'bg-emerald-500',
        badge: 'Expo'
    },
    {
        id: 'canvas',
        title: 'Tablouri Canvas',
        subtitle: 'Artă pe pânză veritabilă.',
        description: 'Transformă fotografiile în veritabile opere de artă. Pânză bumbac întinsă expert pe șasiu de lemn.',
        image: 'https://pub-5e0f8c0a4c03499b92d64adf2a42dd22.r2.dev/canvas/gutscheincode-für-dotcomcanvas-1.png',
        link: '/configurator/canvas',
        accent: 'bg-amber-500',
        badge: 'Decor'
    }
];

export default function HeroCarousel() {
    const [activeSlide, setActiveSlide] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleNext = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setActiveSlide((prev) => (prev + 1) % HERO_ITEMS.length);
        setTimeout(() => setIsAnimating(false), 600);
    };

    const handlePrev = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setActiveSlide((prev) => (prev - 1 + HERO_ITEMS.length) % HERO_ITEMS.length);
        setTimeout(() => setIsAnimating(false), 600);
    };

    useEffect(() => {
        const interval = setInterval(handleNext, 7000);
        return () => clearInterval(interval);
    }, [isAnimating]);

    const current = HERO_ITEMS[activeSlide];

    return (
        <section className="relative w-full h-[85vh] min-h-[600px] max-h-[900px] bg-slate-950 overflow-hidden isolate selection:bg-white selection:text-black">
            {/* Background Image Layer */}
            {HERO_ITEMS.map((item, idx) => (
                <div 
                    key={item.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === activeSlide ? 'opacity-100 z-0' : 'opacity-0 -z-10'}`}
                >
                    <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover scale-105"
                        priority={idx === 0}
                        {...(idx === 0 ? { fetchPriority: "high" } : {})}
                        sizes="(max-width: 768px) 100vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-slate-950/80 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
                </div>
            ))}

            {/* Glowing Accent Layer */}
            <div className={`absolute top-0 right-0 w-3/4 h-3/4 blur-[160px] opacity-30 rounded-full transition-colors duration-1000 ${current.accent} -z-0 translate-x-1/3 -translate-y-1/3`} />

            <div className="container relative z-10 mx-auto px-4 h-full flex flex-col justify-center">
                <div className="max-w-4xl pt-20">
                    
                    {/* Badge */}
                    <div className="overflow-hidden mb-6">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md animate-fade-in-up">
                            <span className={`w-2 h-2 rounded-full ${current.accent} animate-pulse`} />
                            <span className="text-white/80 text-xs font-bold tracking-[0.2em] uppercase">{current.badge} • Print Digital</span>
                        </div>
                    </div>

                    {/* Typography */}
                    <div className="space-y-3 md:space-y-4 mb-8 md:mb-10 min-h-[180px] md:min-h-[220px]">
                        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[6rem] font-black text-white leading-[1.05] tracking-tight">
                            {current.title.split(' ').map((word, i) => (
                                <span key={i} className="block lg:inline-block mr-4 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                                    {word}
                                </span>
                            ))}
                        </h1>
                        <p className="text-lg sm:text-xl md:text-3xl font-light text-slate-300 tracking-tight animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                            {current.subtitle}
                        </p>
                        <p className="text-slate-400 max-w-xl text-sm md:text-lg animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                            {current.description}
                        </p>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 md:gap-5 items-start sm:items-center animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                        <Link 
                            href={current.link} 
                            className="group relative inline-flex w-full sm:w-auto items-center justify-center px-6 md:px-8 py-4 md:py-5 font-bold text-white bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl overflow-hidden transition-all hover:bg-white hover:text-black hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <span className="relative z-10 flex items-center gap-2 text-sm md:text-base">
                                Configurează Produs <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                        
                        <div className="flex items-center gap-6 px-4 py-5">
                            <button onClick={handlePrev} className="text-white/50 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                                <ChevronLeft size={28} />
                            </button>
                            <div className="flex gap-2">
                                {HERO_ITEMS.map((_, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setActiveSlide(idx)}
                                        className={`h-1.5 rounded-full transition-all duration-500 ${idx === activeSlide ? 'w-8 bg-white' : 'w-2 bg-white/20 hover:bg-white/40'}`}
                                    />
                                ))}
                            </div>
                            <button onClick={handleNext} className="text-white/50 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                                <ChevronRight size={28} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom fading edge */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-50 to-transparent z-10" />
        </section>
    );
}

