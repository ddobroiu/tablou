import React, { useState, useEffect } from "react";
import { Ruler, ArrowRight, TrendingUp, Info } from "lucide-react";
import { ConfigState } from "./types";
import { formatMoneyDisplay, CANVAS_CONSTANTS } from "@/lib/pricing";
import { NumberInput } from "@/components/configurator/ui/NumberInput";

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
    // Sync local state when props change (e.g. from presets or upsell click)
    useEffect(() => {
        setWidthText(String(state.width));
    }, [state.width]);

    useEffect(() => {
        setHeightText(String(state.height));
    }, [state.height]);

    if (currentStep !== 2 || !selectedConfig) return null;

    return (
        <div className="space-y-6 animate-fade-in">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                <Ruler size={16} /> Dimensiuni & Cantitate
            </h3>

            {/* Presets if available - OR Canvas Framed Logic */}
            {(selectedConfig.id === 'canvas') ? (
                <div className="space-y-6">
                    {/* CANVAS FRAME SWITCH */}
                    <div className="bg-slate-50 dark:bg-slate-800 p-1 rounded-xl flex border border-slate-200">
                        <button
                            onClick={() => setState(prev => ({ ...prev, options: { ...prev.options, frameType: 'none', formattedSize: undefined } }))}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${(!state.options.frameType || state.options.frameType === 'none') ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-300'}`}
                        >
                            Fără Ramă (Custom)
                        </button>
                        <button
                            onClick={() => setState(prev => ({ ...prev, options: { ...prev.options, frameType: 'framed', framedShape: prev.options.framedShape || 'rectangle' } }))}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${(state.options.frameType === 'framed') ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-300'}`}
                        >
                            Cu Ramă (Standard)
                        </button>
                    </div>

                    {state.options.frameType === 'framed' ? (
                        <div className="space-y-4">
                            {/* Shape Selector */}
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Formă</label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setState(prev => ({ ...prev, options: { ...prev.options, framedShape: 'rectangle', framedSize: undefined } }))}
                                        className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all ${state.options.framedShape === 'rectangle' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600 dark:text-slate-400'}`}
                                    >
                                        Dreptunghi
                                    </button>
                                    <button
                                        onClick={() => setState(prev => ({ ...prev, options: { ...prev.options, framedShape: 'square', framedSize: undefined } }))}
                                        className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all ${state.options.framedShape === 'square' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600 dark:text-slate-400'}`}
                                    >
                                        Pătrat
                                    </button>
                                </div>
                            </div>

                            {/* Size Buttons */}
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Dimensiune (cm)</label>
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                    {Object.keys(
                                        state.options.framedShape === 'square'
                                            ? CANVAS_CONSTANTS.FRAMED_PRICES_SQUARE
                                            : CANVAS_CONSTANTS.FRAMED_PRICES_RECTANGLE
                                    ).map(size => (
                                        <button
                                            key={size}
                                            onClick={() => {
                                                const [w, h] = size.split('x').map(Number);
                                                setState(prev => ({
                                                    ...prev,
                                                    width: w,
                                                    height: h,
                                                    options: { ...prev.options, framedSize: size }
                                                }));
                                            }}
                                            className={`py-2 rounded-lg border text-xs font-bold transition-all ${state.options.framedSize === size ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500' : 'border-slate-200 bg-white text-slate-600 dark:text-slate-400 hover:border-indigo-300'}`}
                                        >
                                            {size.replace('x', '×')}
                                        </button>
                                    ))}
                                </div>
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
                                    className="w-full h-14 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 rounded-2xl px-6 font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-600 transition-all"
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
                                    className="w-full h-14 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 rounded-2xl px-6 font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-600 transition-all"
                                />
                            </div>
                        </div>
                    )}
                </div>
            ) : (state.selectedId === 'carti-vizita') ? (
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Alege Formatul</label>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { width: 9, height: 5, label: '90 x 50 mm (Standard)' },
                            { width: 8.5, height: 5.5, label: '84 x 54 mm (European)' }
                        ].map(p => (
                            <button
                                key={p.label}
                                onClick={() => setState(prev => ({ ...prev, width: p.width, height: p.height }))}
                                className={`p-4 border-2 rounded-2xl text-xs font-bold transition-all text-center ${state.width === p.width && state.height === p.height
                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                                    : 'border-slate-100 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                                    }`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (selectedConfig.category === 'textile') ? (
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                        {selectedConfig.id === 'sepci' ? 'Mărime Universală' : 'Alege Mărimea'}
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {selectedConfig.id === 'sepci' ? (
                            <div className="col-span-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 rounded-2xl text-center font-bold text-slate-900 dark:text-white text-sm">
                                Universală (Reglabilă)
                            </div>
                        ) : (
                            ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map(size => (
                                <button
                                    key={size}
                                    onClick={() => setState(prev => ({ ...prev, options: { ...prev.options, size } }))}
                                    className={`py-3 rounded-xl border-2 font-bold text-sm transition-all ${state.options.size === size || (!state.options.size && size === 'M') ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-sm' : 'border-slate-100 bg-white text-slate-500 hover:border-indigo-200'}`}
                                >
                                    {size}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            ) : (selectedConfig.id === 'pliante') ? (
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-center gap-4">
                    <Info className="text-blue-600 shrink-0" size={24} />
                    <div>
                        <h4 className="font-bold text-blue-900 text-sm">Format Deschis: A4 Standard (29.7 x 21 cm)</h4>
                        <p className="text-xs text-blue-700 mt-1">Toate pliantele pornesc de la formatul A4 landscape și sunt împăturite ulterior conform selecției de la pasul următor.</p>
                    </div>
                </div>
            ) : selectedConfig.dimensions.presets && selectedConfig.dimensions.presets.length > 0 ? (
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
                                    : 'border-slate-100 hover:border-slate-300 text-slate-700 dark:text-slate-300'
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
                            className="w-full h-14 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 rounded-2xl px-6 font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-600 transition-all"
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
                            className="w-full h-14 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 rounded-2xl px-6 font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-600 transition-all"
                        />
                    </div>
                </div>
            )}

            <div className="col-span-1 sm:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Cantitate</label>

                {state.selectedId === 'carti-vizita' && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {[100, 200, 300, 500, 1000].map(q => (
                            <button
                                key={q}
                                onClick={() => setState(prev => ({ ...prev, quantity: q }))}
                                className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${state.quantity === q ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 bg-white text-slate-500 hover:border-indigo-200'}`}
                            >
                                {q} buc
                            </button>
                        ))}
                    </div>
                )}

                <NumberInput
                    label=""
                    value={state.quantity}
                    onChange={(q) => setState((prev) => ({ ...prev, quantity: q }))}
                />

                {/* UPSELL ALERT */}
                {upsellOpportunity && (
                    <div
                        className="mt-3 p-3 sm:p-4 bg-indigo-50 border border-indigo-200 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors flex gap-2 sm:gap-3 items-center group relative w-full"
                        onClick={() => {
                            setState(prev => ({ ...prev, quantity: upsellOpportunity.requiredQty }));
                        }}
                    >
                        <TrendingUp className="text-indigo-600 w-5 h-5 shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm text-indigo-900 font-bold">
                                Reducere de Volum Disponibilă!
                            </p>
                            <p className="text-xs text-indigo-800 mt-1">
                                Dacă alegi <strong>{upsellOpportunity.requiredQty} buc</strong>, prețul scade la <strong>{formatMoneyDisplay(upsellOpportunity.newUnitPrice)}/buc</strong>.
                            </p>
                        </div>
                        <div className="ml-auto flex flex-col items-end gap-2 shrink-0">
                            <div className="flex items-center justify-center bg-white rounded-md px-2 py-0.5 shadow-sm border border-indigo-100">
                                <span className="text-xs font-bold text-indigo-600">-{upsellOpportunity.discountPercent}%</span>
                            </div>
                            <button type="button" className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-md font-bold shadow-sm group-hover:bg-indigo-700 transition-colors">
                                Aplică
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex gap-4">
                <button onClick={handleBack} className="w-1/3 h-14 rounded-2xl border-2 border-slate-200 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:bg-slate-800 transition-all">Înapoi</button>
                <button onClick={handleNext} className="flex-1 h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-bold text-white shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2">Pasul Următor <ArrowRight size={18} /></button>
            </div>
        </div>
    );
};
