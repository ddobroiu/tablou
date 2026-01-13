"use client";

import React, { useState } from "react";
import { X, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PromoTopBar() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="relative bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900 border-b border-indigo-700/50">
            <div className="container mx-auto px-4 h-10 flex items-center justify-center sm:justify-between">

                {/* Mobile / Centrat: Mesaj Principal */}
                <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-white/90">
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200">
                        <Sparkles size={12} className="text-yellow-400" />
                        <span className="font-bold text-white">NOU</span>
                    </span>
                    <span>
                        Livrăm oriunde în țară în 24-48h!
                        <span className="hidden sm:inline text-indigo-300 mx-2">•</span>
                        <span className="hidden sm:inline">Transport Gratuit la peste 500 Lei</span>
                    </span>
                </div>

                {/* Desktop: Link & Close */}
                <div className="hidden sm:flex items-center gap-6">
                    <button
                        onClick={() => setIsVisible(false)}
                        className="text-indigo-400 hover:text-white transition-colors"
                        aria-label="Închide bara promoțională"
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}
