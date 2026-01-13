import React, { useState, useEffect } from "react";
import { Ruler, Minus, Plus, ArrowRight, TrendingUp } from "lucide-react";
import { ConfigState } from "./types";
import { formatMoneyDisplay } from "@/lib/pricing";

interface StepDimensionsProps {
    currentStep: number;
    selectedConfig: any;
    state: ConfigState;
    setState: React.Dispatch<React.SetStateAction<ConfigState>>;
    upsellOpportunity: any;
    handleNext: () => void;
    handleBack: () => void;
}

export const StepDimensions = ({ currentStep, selectedConfig, state, setState, upsellOpportunity, handleNext, handleBack }: StepDimensionsProps) => {
    // Local state for inputs to allow typing freely
    const [widthText, setWidthText] = useState(String(state.width));
    const [heightText, setHeightText] = useState(String(state.height));
    const [qtyText, setQtyText] = useState(String(state.quantity));

    // Sync local state when props change (e.g. from presets or upsell click)
    useEffect(() => {
        setWidthText(String(state.width));
    }, [state.width]);

    useEffect(() => {
        setHeightText(String(state.height));
    }, [state.height]);

    useEffect(() => {
        setQtyText(String(state.quantity));
    }, [state.quantity]);

    if (currentStep !== 2 || !selectedConfig) return null;

    return (
        <div className="space-y-6 animate-fade-in">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Ruler size={16} /> Dimensiuni & Cantitate
            </h3>

            {/* Presets if available */}
            {selectedConfig.dimensions.presets && selectedConfig.dimensions.presets.length > 0 ? (
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Formate Standard</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {selectedConfig.dimensions.presets.map((p: any) => (
                            <button
                                key={p.label}
                                onClick={() => {
                                    setState(prev => ({
                                        ...prev,
                                        width: p.width,
                                        height: p.height,
                                        // Reset options that depend on size if needed
                                    }));
                                }}
                                className={`p-3 border-2 rounded-xl text-sm font-bold transition-all ${state.width === p.width && state.height === p.height
                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-md'
                                    : 'border-slate-100 hover:border-slate-300 text-slate-700'
                                    }`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lățime (cm)</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={widthText}
                            onChange={e => {
                                const val = e.target.value.replace(/\D/g, '');
                                setWidthText(val);
                                if (val) {
                                    setState(prev => ({ ...prev, width: parseInt(val, 10) }));
                                }
                            }}
                            className="w-full h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 font-bold text-slate-900 outline-none focus:border-indigo-600 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Înălțime (cm)</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={heightText}
                            onChange={e => {
                                const val = e.target.value.replace(/\D/g, '');
                                setHeightText(val);
                                if (val) {
                                    setState(prev => ({ ...prev, height: parseInt(val, 10) }));
                                }
                            }}
                            className="w-full h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 font-bold text-slate-900 outline-none focus:border-indigo-600 transition-all"
                        />
                    </div>
                </div>
            )}

            <div className="col-span-1 sm:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Cantitate</label>
                <div className="flex">
                    <button
                        onClick={() => {
                            const newQty = Math.max(1, state.quantity - 1);
                            setState(prev => ({ ...prev, quantity: newQty }));
                        }}
                        className="p-3 bg-slate-100 rounded-l-xl hover:bg-slate-200"
                    >
                        <Minus size={20} />
                    </button>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={qtyText}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            setQtyText(val);
                            if (val) {
                                setState(prev => ({ ...prev, quantity: parseInt(val, 10) }));
                            }
                        }}
                        className="w-full h-14 bg-slate-50 border-2 border-slate-100 rounded-none px-6 font-bold text-slate-900 outline-none focus:border-indigo-600 transition-all text-center"
                    />
                    <button
                        onClick={() => {
                            const newQty = state.quantity + 1;
                            setState(prev => ({ ...prev, quantity: newQty }));
                        }}
                        className="p-3 bg-slate-100 rounded-r-xl hover:bg-slate-200"
                    >
                        <Plus size={20} />
                    </button>
                </div>

                {/* UPSELL ALERT */}
                {upsellOpportunity && (
                    <div
                        className="mt-3 p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-lg cursor-pointer hover:bg-amber-100 transition-colors flex gap-2 sm:gap-3 items-start touch-manipulation"
                        onClick={() => {
                            setState(prev => ({ ...prev, quantity: upsellOpportunity.requiredQty }));
                        }}
                    >
                        <TrendingUp className="text-amber-600 w-5 h-5 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-sm text-amber-900 font-bold">
                                Reducere de Volum Disponibilă!
                            </p>
                            <p className="text-xs text-amber-800 mt-1">
                                Dacă alegi <strong>{upsellOpportunity.requiredQty} buc</strong>, prețul scade la <strong>{formatMoneyDisplay(upsellOpportunity.newUnitPrice)}/buc</strong>.
                                <span className="block mt-0.5 font-semibold text-amber-700">
                                    Economisești {upsellOpportunity.discountPercent}% la prețul per unitate!
                                </span>
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex gap-4">
                <button onClick={handleBack} className="w-1/3 h-14 rounded-2xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all">Înapoi</button>
                <button onClick={handleNext} className="flex-1 h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-bold text-white shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2">Pasul Următor <ArrowRight size={18} /></button>
            </div>
        </div>
    );
};
