import React from "react";
import { Package, Ruler, UploadCloud, Sparkles } from "lucide-react";

export const Header = () => {
    return (
        <div className="text-center mb-16 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl -z-10" />

            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight relative inline-block">
                Simplu. Rapid. <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Online.</span>
                <Sparkles className="absolute -top-6 -right-8 text-amber-400 w-8 h-8 animate-bounce-slow" />
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-12">
                Am simplificat procesul de comandă pentru ca tu să economisești timp.
            </p>

            <div className="flex flex-col md:flex-row justify-center items-start md:items-center gap-8 md:gap-12 max-w-5xl mx-auto text-left md:text-center mt-12 bg-white/60 backdrop-blur-sm p-6 rounded-3xl border border-white/50 shadow-sm">
                <div className="flex-1 flex items-center md:flex-col md:items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
                        <Package size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg mb-1">1. Alegi Produsul</h3>
                        <p className="text-sm text-slate-500 leading-tight">Explorează gama noastră completă și selectează materialul publicitar de care ai nevoie.</p>
                    </div>
                </div>

                <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-slate-200 to-transparent" />

                <div className="flex-1 flex items-center md:flex-col md:items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 shrink-0">
                        <Ruler size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg mb-1">2. Configurezi Online</h3>
                        <p className="text-sm text-slate-500 leading-tight">Introduci dimensiunile, alegi finisajele și vezi prețul calculat instant. Încarci grafica direct.</p>
                    </div>
                </div>

                <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-slate-200 to-transparent" />

                <div className="flex-1 flex items-center md:flex-col md:items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                        <UploadCloud size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg mb-1">3. Livrare Rapidă</h3>
                        <p className="text-sm text-slate-500 leading-tight">Noi producem comanda prioritar și o expediem prin curier rapid direct la ușa ta.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
