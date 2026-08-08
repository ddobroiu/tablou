"use client";

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import {
    FileImage, StickyNote, ScrollText, LayoutTemplate, Layers, Box, ScanLine, Package, Frame, Flag, ChevronLeft, ChevronRight, type LucideIcon,
    Printer, Image as ImageIcon, Map, Building2, Ticket, Grid3X3, Shirt, Circle, Wind
} from 'lucide-react';

// Modern, curated color palettes for each item type to replace generic Tailwind colors
const QUICK_NAV_ITEMS: { name: string; icon: LucideIcon; href: string; gradient: string; iconColor: string; shadow: string }[] = [
    { name: "Toate Produsele", icon: Grid3X3, href: "/configuratoare", gradient: "from-slate-800 to-slate-950", iconColor: "text-white", shadow: "shadow-slate-300" },
    { name: "Bannere", icon: FileImage, href: "/configurator/banner", gradient: "from-emerald-500 to-green-600", iconColor: "text-white", shadow: "shadow-emerald-200" },
    { name: "Autocolante", icon: StickyNote, href: "/configurator/autocolante", gradient: "from-green-400 to-emerald-600", iconColor: "text-white", shadow: "shadow-green-200" },
    { name: "Tapet", icon: ScrollText, href: "/configurator/tapet", gradient: "from-emerald-600 to-teal-700", iconColor: "text-white", shadow: "shadow-emerald-300" },
    { name: "Afișe", icon: LayoutTemplate, href: "/configurator/afise", gradient: "from-green-500 to-emerald-600", iconColor: "text-white", shadow: "shadow-green-200" },
    { name: "Canvas", icon: Frame, href: "/configurator/canvas", gradient: "from-emerald-400 to-green-500", iconColor: "text-white", shadow: "shadow-emerald-200" },
    { name: "Pliante", icon: Layers, href: "/configurator/pliante", gradient: "from-green-600 to-emerald-700", iconColor: "text-white", shadow: "shadow-green-300" },
    { name: "Flyere", icon: Ticket, href: "/configurator/flayere", gradient: "from-emerald-500 to-teal-600", iconColor: "text-white", shadow: "shadow-emerald-200" },
    { name: "Banner Verso", icon: Layers, href: "/configurator/banner-verso", gradient: "from-green-700 to-emerald-800", iconColor: "text-white", shadow: "shadow-green-400" },
    { name: "Mesh", icon: Wind, href: "/configurator/mesh", gradient: "from-teal-500 to-emerald-700", iconColor: "text-white", shadow: "shadow-teal-200" },
    { name: "Rollup", icon: ScanLine, href: "/configurator/rollup", gradient: "from-emerald-400 to-cyan-600", iconColor: "text-white", shadow: "shadow-emerald-200" },
    { name: "Window Graphics", icon: ImageIcon, href: "/configurator/window-graphics", gradient: "from-green-400 to-teal-500", iconColor: "text-white", shadow: "shadow-green-200" },
    { name: "PVC Forex", icon: Box, href: "/materiale/pvc-forex", gradient: "from-emerald-800 to-slate-900", iconColor: "text-white", shadow: "shadow-emerald-400" },
    { name: "Plexiglass", icon: Grid3X3, href: "/materiale/plexiglass", gradient: "from-emerald-300 to-cyan-500", iconColor: "text-white", shadow: "shadow-emerald-100" },
    { name: "Alucobond", icon: Building2, href: "/materiale/alucobond", gradient: "from-emerald-900 to-zinc-900", iconColor: "text-white", shadow: "shadow-emerald-500" },
    { name: "Carton", icon: Package, href: "/materiale/carton", gradient: "from-green-800 to-emerald-900", iconColor: "text-white", shadow: "shadow-green-500" },
    { name: "Polipropilenă", icon: Layers, href: "/materiale/polipropilena", gradient: "from-emerald-200 to-green-400", iconColor: "text-white", shadow: "shadow-emerald-50" },
    { name: "PNRR", icon: Flag, href: "/configurator/fonduri-eu", gradient: "from-emerald-600 to-emerald-900", iconColor: "text-white", shadow: "shadow-emerald-300" },
    { name: "Tricouri", icon: Shirt, href: "/tricouri", gradient: "from-emerald-500 to-emerald-600", iconColor: "text-white", shadow: "shadow-emerald-200" },
    { name: "Hanorace", icon: Shirt, href: "/hanorace", gradient: "from-emerald-600 to-purple-700", iconColor: "text-white", shadow: "shadow-emerald-300" },
    { name: "Șepci", icon: Circle, href: "/sepci", gradient: "from-purple-500 to-pink-600", iconColor: "text-white", shadow: "shadow-purple-200" },
    { name: "Cărți Vizită", icon: Ticket, href: "/configurator/carti-vizita", gradient: "from-amber-400 to-orange-500", iconColor: "text-white", shadow: "shadow-amber-200" },
    { name: "Semnalistică", icon: StickyNote, href: "/configurator/semnalistica", gradient: "from-blue-500 to-indigo-600", iconColor: "text-white", shadow: "shadow-blue-200" },
    { name: "Industrii", icon: Building2, href: "/industrii", gradient: "from-indigo-500 to-purple-600", iconColor: "text-white", shadow: "shadow-indigo-200" },
    { name: "Sectoare", icon: Map, href: "/sectoare-bucuresti", gradient: "from-emerald-500 to-teal-600", iconColor: "text-white", shadow: "shadow-emerald-200" },
];

export default function QuickNav({ title }: { title?: string }) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showControls, setShowControls] = useState(false);

    // Check if controls should be visible
    useEffect(() => {
        if (!scrollContainerRef.current) return;

        const observer = new ResizeObserver(() => {
            if (scrollContainerRef.current) {
                const { scrollWidth, clientWidth } = scrollContainerRef.current;
                setShowControls(scrollWidth > clientWidth);
            }
        });

        observer.observe(scrollContainerRef.current);
        return () => observer.disconnect();
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="relative py-8 overflow-hidden">
            {/* Title Section with enhanced typography */}
            {title && (
                <div className="text-center mb-8 px-4">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight inline-block relative">
                        {title}
                        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-emerald-500 rounded-full"></span>
                    </h3>
                </div>
            )}

            <div className="max-w-[1400px] mx-auto px-2 relative group">

                {/* Navigation Controls - Hidden on mobile, visible on hover desktop */}
                {showControls && (
                    <>
                        <button
                            onClick={() => scroll('left')}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/50 flex items-center justify-center text-slate-700 hover:text-emerald-600 hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100 hidden sm:flex"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft size={22} strokeWidth={2.5} />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/50 flex items-center justify-center text-slate-700 hover:text-emerald-600 hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100 hidden sm:flex"
                            aria-label="Scroll right"
                        >
                            <ChevronRight size={22} strokeWidth={2.5} />
                        </button>
                    </>
                )}

                {/* Main Scrollable Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto gap-4 py-6 px-4 scrollbar-hide snap-x touch-pan-x pb-8"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                >
                    {QUICK_NAV_ITEMS.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="group/card flex-shrink-0 snap-center sm:snap-start flex flex-col items-center gap-3 transition-all transform hover:-translate-y-1"
                        >
                            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg ${item.shadow} group-hover/card:shadow-xl group-hover/card:shadow-emerald-200/50 transition-all duration-300 relative overflow-hidden`}>
                                {/* Subtle sheen effect */}
                                <div className="absolute inset-0 bg-white/20 translate-y-full skew-y-12 group-hover/card:translate-y-0 transition-transform duration-500 ease-out"></div>

                                <item.icon className={`w-7 h-7 sm:w-8 sm:h-8 ${item.iconColor} drop-shadow-md relative z-10 transform group-hover/card:scale-110 transition-transform duration-300`} strokeWidth={1.5} />
                            </div>

                            <span className="text-xs sm:text-sm font-bold text-slate-600 group-hover/card:text-emerald-600 text-center leading-tight max-w-[80px] sm:max-w-[100px] transition-colors">
                                {item.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

