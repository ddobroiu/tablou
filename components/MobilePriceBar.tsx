"use client";

import React from "react";
import { ShoppingCart, Zap } from "lucide-react";
import { formatMoneyDisplay } from "@/lib/pricing";

interface MobilePriceBarProps {
    totalPrice: number;
    onAddToCart: () => void;
    isVisible: boolean;
}

export default function MobilePriceBar({ totalPrice, onAddToCart, isVisible }: MobilePriceBarProps) {
    if (!isVisible) return null;

    return (
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3 flex items-center justify-between xl:hidden z-[1000] animate-in slide-in-from-bottom duration-300 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
            <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Plată</span>
                <span className="text-xl font-black text-slate-900 tracking-tighter leading-none">
                    {formatMoneyDisplay(totalPrice)}
                </span>
            </div>
            
            <button
                onClick={onAddToCart}
                className="px-6 py-3.5 bg-emerald-600 text-white rounded-xl font-black text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all uppercase italic tracking-tighter"
            >
                <Zap size={18} className="fill-current" />
                ADAUGĂ
            </button>
        </div>
    );
}
