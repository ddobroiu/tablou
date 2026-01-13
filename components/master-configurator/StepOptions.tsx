import React from "react";
import { Layers, Check, Box, Scan, StickyNote, FileImage, LayoutTemplate, Sparkles, Flag, Info, ArrowRight } from "lucide-react";
import { ConfigState } from "./types";

interface StepOptionsProps {
    currentStep: number;
    selectedConfig: any;
    state: ConfigState;
    setState: React.Dispatch<React.SetStateAction<ConfigState>>;
    handleNext: () => void;
    handleBack: () => void;
}

export const StepOptions = ({ currentStep, selectedConfig, state, setState, handleNext, handleBack }: StepOptionsProps) => {
    if (currentStep !== 3 || !selectedConfig) return null;

    const availableMaterials = selectedConfig.materials || [];

    return (
        <div className="space-y-6 animate-fade-in">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Layers size={16} /> Opțiuni & Finisaje
            </h3>

            {/* Product Specific Configs */}
            <div className="space-y-6">
                {/* Material Selection */}
                {availableMaterials.length > 1 && (
                    <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Layers size={14} /> Materialul Produsului
                        </h3>
                        <div className="grid grid-cols-1 gap-2">
                            {availableMaterials.map((mat: any) => (
                                <button
                                    key={mat.id}
                                    onClick={() => setState(prev => ({ ...prev, materialId: mat.id }))}
                                    className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-4 text-left ${state.materialId === mat.id ? 'border-indigo-600 bg-white shadow-premium-sm' : 'border-slate-100 bg-white hover:border-indigo-200'}`}
                                >
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${state.materialId === mat.id ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200'}`}>
                                        {state.materialId === mat.id && <Check size={14} strokeWidth={4} />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-slate-900 text-sm">{mat.name}</span>
                                            {mat.recommended && (
                                                <span className="bg-emerald-100 text-emerald-700 text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-tighter">Recomandat</span>
                                            )}
                                        </div>
                                        <span className="text-[10px] text-slate-500 line-clamp-1">{mat.description}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* BANNER SPECIFIC: Premium UI for Finishings */}
                {(state.selectedId === 'banner' || state.selectedId === 'banner-verso') && (
                    <div className="space-y-3">
                        <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl flex items-start gap-4 shadow-premium-sm">
                            <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                                <Info className="text-blue-500" size={20} />
                            </div>
                            <div className="text-[11px] leading-relaxed">
                                <p className="font-extrabold text-blue-900 mb-1 text-sm">Finisaje Standard Incluse</p>
                                <p className="text-blue-700/80 font-bold">Tiv perimetral de rezistență și capse metalice la 50cm distanță. Sunt incluse în prețul afișat.</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setState(prev => ({ ...prev, options: { ...prev.options, want_wind_holes: !prev.options.want_wind_holes } }))}
                            className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-4 group ${state.options.want_wind_holes ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100 bg-white hover:border-indigo-200'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${state.options.want_wind_holes ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
                                    <Flag size={20} />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-slate-900">Găuri de Vânt (Mesh)</p>
                                    <p className="text-[10px] text-slate-500">Recomandat pentru expunere în zone cu curenți puternici.</p>
                                </div>
                            </div>
                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${state.options.want_wind_holes ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200'}`}>
                                {state.options.want_wind_holes && <Check size={14} strokeWidth={4} />}
                            </div>
                        </button>
                    </div>
                )}

                {/* Thickness for Rigids - Premium Mode */}
                {['pvc-forex', 'alucobond', 'plexiglass', 'carton', 'polipropilena'].includes(state.selectedId!) && (
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Box size={14} /> Grosime Material
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {[1, 2, 3, 5, 10].filter(t => {
                                if (state.selectedId === 'alucobond') return [3, 4].includes(t);
                                if (state.selectedId === 'carton') return [3, 5].includes(t);
                                return true;
                            }).map(t => (
                                <button
                                    key={t}
                                    onClick={() => setState(prev => ({ ...prev, options: { ...prev.options, thickness_mm: t } }))}
                                    className={`h-14 rounded-2xl border-2 font-bold text-sm transition-all flex items-center justify-center gap-2 ${state.options.thickness_mm === t ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-sm' : 'border-slate-100 bg-white text-slate-500 hover:border-indigo-200'}`}
                                >
                                    {t} <span className="text-[10px] opacity-60">mm</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Lamination & Cutting for Stickers */}
                {['autocolante', 'stickers-labels', 'window-graphics'].includes(state.selectedId!) && (
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tip producție</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                            <button
                                onClick={() => setState(prev => ({ ...prev, options: { ...prev.options, print_type: 'print_cut' } }))}
                                className={`w-full text-left p-3 rounded-xl border-2 transition-all flex flex-col gap-1 ${state.options.print_type === 'print_cut' || !state.options.print_type ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                            >
                                <div className="font-bold text-sm text-slate-900">Print + Cut</div>
                                <div className="text-xs text-slate-500">Tăiere pe contur (standard)</div>
                            </button>
                            <button
                                onClick={() => setState(prev => ({ ...prev, options: { ...prev.options, print_type: 'print_only' } }))}
                                className={`w-full text-left p-3 rounded-xl border-2 transition-all flex flex-col gap-1 ${state.options.print_type === 'print_only' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                            >
                                <div className="font-bold text-sm text-slate-900">Doar Print (-20%)</div>
                                <div className="text-xs text-slate-500">Fără tăiere, reducere 20%</div>
                            </button>
                        </div>

                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">Finisaj</h3>
                        <button
                            onClick={() => setState(prev => ({ ...prev, options: { ...prev.options, laminated: !prev.options.laminated } }))}
                            className={`w-full text-left p-3 rounded-xl border-2 transition-all flex items-start gap-3 ${state.options.laminated ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                        >
                            <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${state.options.laminated ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'}`}>
                                {state.options.laminated && <Check size={14} strokeWidth={3} />}
                            </div>
                            <div>
                                <div className="font-bold text-sm text-slate-900">Laminare (+10%)</div>
                                <div className="text-xs text-slate-500">Protecție extra UV și zgârieturi</div>
                            </div>
                        </button>
                    </div>
                )}

                {/* Double Sided & Paper for Marketing */}
                {['flayere', 'flyers', 'pliante', 'brochures'].includes(state.selectedId!) && (
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipărire & Hârtie</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setState(prev => ({ ...prev, options: { ...prev.options, twoSided: false } }))}
                                className={`p-4 rounded-2xl border-2 font-bold text-xs transition-all flex flex-col items-center gap-1 ${!state.options.twoSided ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 bg-white text-slate-500'}`}
                            >
                                <FileImage size={18} />
                                Doar Față
                            </button>
                            <button
                                onClick={() => setState(prev => ({ ...prev, options: { ...prev.options, twoSided: true } }))}
                                className={`p-4 rounded-2xl border-2 font-bold text-xs transition-all flex flex-col items-center gap-1 ${state.options.twoSided ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 bg-white text-slate-500'}`}
                            >
                                <LayoutTemplate size={18} />
                                Față-Verso
                            </button>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Grosime Hârtie</label>
                            <div className="flex flex-wrap gap-2">
                                {['115', '130', '170', '250', '350'].map(g => (
                                    <button
                                        key={g}
                                        onClick={() => setState(prev => ({ ...prev, options: { ...prev.options, paperWeightKey: g } }))}
                                        className={`flex-1 min-w-[60px] h-10 rounded-xl border-2 font-bold text-xs transition-all ${state.options.paperWeightKey === g ? 'border-indigo-600 bg-white text-indigo-600 shadow-sm' : 'border-transparent bg-white/50 text-slate-500 hover:border-slate-200'}`}
                                    >
                                        {g}g
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Filtered Registry Options for unhandled cases */}
                {selectedConfig.options.filter((o: any) =>
                    !['finisaje', 'artwork', 'grafica', 'material', 'frame', 'design', 'tip rama', 'laminated', 'lamination', 'print_type', 'type'].includes(o.id.toLowerCase()) &&
                    !o.name.toLowerCase().includes('design') &&
                    !o.name.toLowerCase().includes('grafic') &&
                    !o.name.toLowerCase().includes('ramă')
                ).map((option: any) => (
                    <div key={option.id} className="space-y-4 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Sparkles size={14} /> {option.name}
                        </label>

                        {option.type === 'radio' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {option.values?.map((val: string) => (
                                    <button
                                        key={val}
                                        onClick={() => setState(prev => ({ ...prev, options: { ...prev.options, [option.id]: val } }))}
                                        className={`p-4 rounded-2xl border-2 font-bold text-xs transition-all text-left flex items-center gap-3 ${state.options[option.id] === val ? 'border-indigo-600 bg-white text-indigo-600 shadow-sm' : 'border-slate-100 bg-white text-slate-500 hover:border-indigo-200'}`}
                                    >
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${state.options[option.id] === val ? 'border-indigo-600 bg-indigo-600' : 'border-slate-200'}`}>
                                            {state.options[option.id] === val && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                        </div>
                                        {val}
                                    </button>
                                ))}
                            </div>
                        )}

                        {option.type === 'checkbox' && (
                            <div className="grid grid-cols-1 gap-2">
                                {option.values?.map((val: string) => (
                                    <button
                                        key={val}
                                        onClick={() => {
                                            const current = state.options[option.id] || [];
                                            const isSelected = Array.isArray(current) ? current.includes(val) : current === val;
                                            let next;
                                            if (!isSelected) {
                                                next = [...(Array.isArray(current) ? current : [current]), val];
                                            } else {
                                                next = (Array.isArray(current) ? current : [current]).filter((v: any) => v !== val);
                                            }
                                            setState(prev => ({ ...prev, options: { ...prev.options, [option.id]: next } }));
                                        }}
                                        className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${(Array.isArray(state.options[option.id]) ? state.options[option.id].includes(val) : state.options[option.id] === val)
                                            ? 'border-indigo-600 bg-white text-indigo-600 font-bold shadow-sm'
                                            : 'border-slate-100 bg-white text-slate-600'
                                            }`}
                                    >
                                        <span className="text-sm">{val}</span>
                                        <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${(Array.isArray(state.options[option.id]) ? state.options[option.id].includes(val) : state.options[option.id] === val)
                                            ? 'border-indigo-600 bg-indigo-600 text-white'
                                            : 'border-slate-200'
                                            }`}>
                                            {(Array.isArray(state.options[option.id]) ? state.options[option.id].includes(val) : state.options[option.id] === val) && <Check size={12} strokeWidth={4} />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {option.type === 'select' && (
                            <select
                                value={state.options[option.id] || ""}
                                onChange={(e) => setState(prev => ({
                                    ...prev,
                                    options: { ...prev.options, [option.id]: e.target.value }
                                }))}
                                className="w-full h-14 bg-white border-2 border-slate-100 rounded-2xl px-6 text-sm font-bold text-slate-900 outline-none focus:border-indigo-600 transition-all appearance-none"
                            >
                                <option value="">Alege {option.name}...</option>
                                {option.values?.map((val: string) => (
                                    <option key={val} value={val}>{val}</option>
                                ))}
                            </select>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex gap-4">
                <button onClick={handleBack} className="w-1/3 h-14 rounded-2xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all">Înapoi</button>
                <button onClick={handleNext} className="flex-1 h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-bold text-white shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2">
                    Pasul Final <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
};
