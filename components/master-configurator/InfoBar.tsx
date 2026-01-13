import React from "react";
import { Check, Info, Package } from "lucide-react";

export const InfoBar = () => {
    return (
        <div className="mt-8 flex flex-wrap justify-center gap-8 lg:gap-16">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600"><Check size={20} /></div>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Garanție Calitate</span>
            </div>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><Info size={20} /></div>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Verificare Grafică Gratis</span>
            </div>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600"><Package size={20} /></div>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Ambalare Premium</span>
            </div>
        </div>
    );
};
