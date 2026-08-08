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

    // Helper to filter materials for Afise based on size constraints
    const filteredMaterials = React.useMemo(() => {
        if (state.selectedId !== 'afise') return availableMaterials;

        // Find which preset matches current width/height
        const selectedPreset = selectedConfig.dimensions.presets?.find((p: any) =>
            (Math.abs(p.width - state.width) < 0.1 && Math.abs(p.height - state.height) < 0.1) ||
            (Math.abs(p.height - state.width) < 0.1 && Math.abs(p.width - state.height) < 0.1)
        );

        if (!selectedPreset) return availableMaterials;

        if (selectedPreset.label === 'A3') {
            // A3 is only available for Whiteback and generic paper materials
            return availableMaterials.filter((m: any) =>
                !['blueback_115', 'satin_170', 'foto_220'].includes(m.id)
            );
        }

        return availableMaterials;
    }, [state.selectedId, state.width, state.height, availableMaterials, selectedConfig.dimensions.presets]);

    // Handle material auto-reset if current material becomes unavailable for newly selected size
    React.useEffect(() => {
        if (state.selectedId === 'afise') {
            const isMatAvailable = filteredMaterials.some((m: any) => m.id === state.materialId);
            if (!isMatAvailable && filteredMaterials.length > 0) {
                // Default to first available
                setState(prev => ({ ...prev, materialId: filteredMaterials[0].id }));
            }
        }
    }, [filteredMaterials, state.materialId, state.selectedId, setState]);

    return (
        <div className="space-y-6 animate-fade-in">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                <Layers size={16} /> Opțiuni & Finisaje
            </h3>

            {/* Product Specific Configs */}
            <div className="space-y-6">
                {/* Material Selection */}
                {availableMaterials.length > 1 && (
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Layers size={14} /> Materialul Produsului
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {filteredMaterials.map((mat: any) => (
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
                                            <span className="font-bold text-slate-900 dark:text-white text-sm">{mat.name}</span>
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
                        <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-3xl flex items-start gap-4 shadow-premium-sm">
                            <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                                <Info className="text-indigo-500" size={20} />
                            </div>
                            <div className="text-[11px] leading-relaxed">
                                <p className="font-extrabold text-indigo-900 mb-1 text-sm">Finisaje Standard Incluse</p>
                                <p className="text-indigo-700/80 font-bold">Tiv perimetral de rezistență și capse metalice la 50cm distanță. Sunt incluse în prețul afișat.</p>
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
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">Găuri de vânt</p>
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
                        {state.selectedId === 'carton' && (
                            <>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Box size={14} /> Tip Carton
                                </h3>
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    {[
                                        { id: 'ondulat', name: 'Ondulat', desc: 'Hârtie' },
                                        { id: 'reciclat', name: 'Fagure', desc: 'Masiv' }
                                    ].map(type => (
                                        <button
                                            key={type.id}
                                            onClick={() => setState(prev => ({
                                                ...prev,
                                                options: {
                                                    ...prev.options,
                                                    materialType: type.id,
                                                    thickness_mm: type.id === 'ondulat' ? 3 : 10
                                                }
                                            }))}
                                            className={`p-4 rounded-2xl border-2 transition-all text-left flex items-center gap-3 ${state.options.materialType === type.id || (!state.options.materialType && type.id === 'ondulat') ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-sm' : 'border-slate-100 bg-white text-slate-500 hover:border-indigo-200'}`}
                                        >
                                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${state.options.materialType === type.id || (!state.options.materialType && type.id === 'ondulat') ? 'border-indigo-600 bg-indigo-600' : 'border-slate-200'}`}>
                                                {(state.options.materialType === type.id || (!state.options.materialType && type.id === 'ondulat')) && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm leading-tight text-slate-900 dark:text-white">{type.name}</p>
                                                <p className="text-[10px] text-slate-500">{type.desc}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}

                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Box size={14} /> {state.selectedId === 'carton' ? 'Specificație Grosime' : 'Grosime Material'}
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {[1, 1.5, 2, 3, 4, 5, 6, 8, 10, 16].filter(t => {
                                if (state.selectedId === 'alucobond') return [3, 4].includes(t);
                                if (state.selectedId === 'carton') {
                                    if (state.options.materialType === 'reciclat') return [10, 16].includes(t);
                                    return [1.5, 3, 5].includes(t);
                                }
                                if (state.selectedId === 'plexiglass') return [2, 3, 4, 5, 6, 8, 10].includes(t);
                                if (state.selectedId === 'pvc-forex') return [1, 2, 3, 4, 5, 6, 8, 10].includes(t);
                                if (state.selectedId === 'polipropilena') return [3, 4, 5].includes(t);
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

                {/* Color Selection for Alucobond */}
                {state.selectedId === 'alucobond' && (
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Sparkles size={14} /> Culoare Panou
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            {["Alb", "Argintiu (Silver)", "Antracit (Gri Închis)", "Negru", "Rosu", "Albastru", "Verde", "Galben", "Brushed (Aluminiu Perișat)"].map(color => (
                                <button
                                    key={color}
                                    onClick={() => setState(prev => ({ ...prev, options: { ...prev.options, color: color } }))}
                                    className={`p-4 rounded-2xl border-2 font-bold text-xs transition-all text-left flex items-center gap-3 ${state.options.color === color ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-sm' : 'border-slate-100 bg-white text-slate-500 hover:border-indigo-200'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${state.options.color === color ? 'border-indigo-600 bg-indigo-600' : 'border-slate-200'}`}>
                                        {state.options.color === color && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                    </div>
                                    {color}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Lamination & Cutting for Stickers */}
                {['autocolante', 'stickers-labels', 'window-graphics'].includes(state.selectedId!) && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="pt-4 border-t border-slate-100">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Layers size={14} className="text-indigo-500" /> Opțiuni Producție
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button
                                    onClick={() => setState(prev => ({ ...prev, options: { ...prev.options, print_type: 'print_cut' } }))}
                                    className={`p-4 rounded-2xl border-2 text-left transition-all ${state.options.print_type === 'print_cut' || !state.options.print_type ? 'border-indigo-600 bg-indigo-50 shadow-sm' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
                                >
                                    <div className="font-bold text-sm text-slate-900 dark:text-white">Print + Cut</div>
                                    <div className="text-[10px] text-slate-500 mt-1">Tăiere pe orice formă (standard)</div>
                                </button>
                                <button
                                    onClick={() => setState(prev => ({ ...prev, options: { ...prev.options, print_type: 'print_only' } }))}
                                    className={`p-4 rounded-2xl border-2 text-left transition-all ${state.options.print_type === 'print_only' ? 'border-indigo-600 bg-indigo-50 shadow-sm' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
                                >
                                    <div className="font-bold text-sm text-slate-900 dark:text-white">Doar Print (-20%)</div>
                                    <div className="text-[10px] text-slate-500 mt-1">Tăiere dreptunghiulară, fără contur</div>
                                </button>
                            </div>
                        </div>

                        <div className="pt-2">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Finisaj Protecție</h4>
                            <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${state.options.laminated ? 'border-indigo-600 bg-indigo-50 shadow-sm' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                                    checked={state.options.laminated || false}
                                    onChange={(e) => setState(prev => ({ ...prev, options: { ...prev.options, laminated: e.target.checked } }))}
                                />
                                <div>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">Laminare Premium (+10%)</span>
                                    <p className="text-[10px] text-slate-500 mt-0.5">Protecție extra UV, apă și rezistență la zgârieturi.</p>
                                </div>
                            </label>
                        </div>
                    </div>
                )}



                {/* Fonduri EU - Kit Vision UI */}
                {state.selectedId === 'fonduri-eu' && (
                    <div className="space-y-8">
                        <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-3xl flex items-start gap-4 shadow-premium-sm">
                            <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                                <Info className="text-indigo-500" size={20} />
                            </div>
                            <div className="text-[11px] leading-relaxed">
                                <p className="font-extrabold text-indigo-900 mb-1 text-sm">Configurare Pachet Vizibilitate</p>
                                <p className="text-indigo-700/80 font-bold">Selectează elementele necesare proiectului tău. Toate materialele sunt conforme cu manualul de identitate vizuală obligatoriu.</p>
                            </div>
                        </div>

                        {/* Group 1: Online & Publicitate */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Scan size={14} /> Publicitate & Online
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {selectedConfig.options.filter((o: any) => ['comunicat', 'bannerSite'].includes(o.id)).map((option: any) => (
                                    <div key={option.id} className="space-y-3 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{option.name}</label>
                                        <div className="flex flex-col gap-2">
                                            {option.values.map((val: string) => (
                                                <button
                                                    key={val}
                                                    onClick={() => setState(prev => ({ ...prev, options: { ...prev.options, [option.id]: val } }))}
                                                    className={`p-3 rounded-xl border-2 text-xs font-bold transition-all text-left flex items-center gap-3 ${state.options[option.id] === val || (!state.options[option.id] && (val === 'Fără comunicat' || val === 'Fără banner')) ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-50 bg-slate-50 dark:bg-slate-800/50 text-slate-500 hover:border-indigo-200'}`}
                                                >
                                                    <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${state.options[option.id] === val || (!state.options[option.id] && (val === 'Fără comunicat' || val === 'Fără banner')) ? 'border-indigo-600 bg-indigo-600' : 'border-slate-200'}`}>
                                                        {(state.options[option.id] === val || (!state.options[option.id] && (val === 'Fără comunicat' || val === 'Fără banner'))) && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                                    </div>
                                                    {val}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Group 2: Afise & Stickers */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <StickyNote size={14} /> Afișe & Autocolante
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {selectedConfig.options.filter((o: any) => ['afisInformativ', 'autoMici', 'autoMari'].includes(o.id)).map((option: any) => (
                                    <div key={option.id} className="space-y-3 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{option.name}</label>
                                        <div className="flex flex-col gap-2">
                                            {option.values.map((val: string) => (
                                                <button
                                                    key={val}
                                                    onClick={() => setState(prev => ({ ...prev, options: { ...prev.options, [option.id]: val } }))}
                                                    className={`p-3 rounded-xl border-2 text-xs font-bold transition-all text-left flex items-center gap-3 ${state.options[option.id] === val || (!state.options[option.id] && (val === 'Fără afiș' || val === 'Nu')) ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-50 bg-slate-50 dark:bg-slate-800/50 text-slate-500 hover:border-indigo-200'}`}
                                                >
                                                    <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${state.options[option.id] === val || (!state.options[option.id] && (val === 'Fără afiș' || val === 'Nu')) ? 'border-indigo-600 bg-indigo-600' : 'border-slate-200'}`}>
                                                        {(state.options[option.id] === val || (!state.options[option.id] && (val === 'Fără afiș' || val === 'Nu'))) && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                                    </div>
                                                    {val}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Group 3: Panouri & Placi */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Box size={14} /> Panouri & Plăci
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {selectedConfig.options.filter((o: any) => ['panouTemporar', 'placaPermanenta'].includes(o.id)).map((option: any) => (
                                    <div key={option.id} className="space-y-3 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{option.name}</label>
                                        <div className="flex flex-col gap-2">
                                            {option.values.map((val: string) => (
                                                <button
                                                    key={val}
                                                    onClick={() => setState(prev => ({ ...prev, options: { ...prev.options, [option.id]: val } }))}
                                                    className={`p-3 rounded-xl border-2 text-xs font-bold transition-all text-left flex items-center gap-3 ${state.options[option.id] === val || (!state.options[option.id] && (val === 'Nu')) ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-50 bg-slate-50 dark:bg-slate-800/50 text-slate-500 hover:border-indigo-200'}`}
                                                >
                                                    <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${state.options[option.id] === val || (!state.options[option.id] && (val === 'Nu')) ? 'border-indigo-600 bg-indigo-600' : 'border-slate-200'}`}>
                                                        {(state.options[option.id] === val || (!state.options[option.id] && (val === 'Nu'))) && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                                    </div>
                                                    {val}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Program Selection */}
                        <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 space-y-4">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <LayoutTemplate size={14} /> Programul de Finanțare
                            </h3>
                            <select
                                value={state.options.program || ""}
                                onChange={(e) => setState(prev => ({ ...prev, options: { ...prev.options, program: e.target.value } }))}
                                className="w-full h-14 bg-white border-2 border-slate-100 rounded-2xl px-6 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-600 transition-all appearance-none"
                            >
                                <option value="">Alege Programul...</option>
                                {['PNRR', 'FEADR', 'POCU', 'Regio', 'Altul'].map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {selectedConfig.category === 'textile' && (
                    <div className="space-y-6">
                        {/* Color Selection */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Sparkles size={14} /> Culoare Produs
                            </h3>
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                                {[
                                    { name: 'Alb', hex: '#FFFFFF', border: true },
                                    { name: 'Negru', hex: '#000000' },
                                    { name: 'Albastru Marin', hex: '#000080' },
                                    { name: 'Albastru Regal', hex: '#4169E1' },
                                    { name: 'Rosu', hex: '#FF0000' },
                                    { name: 'Gri Inchis', hex: '#333333' },
                                    { name: 'Portocaliu', hex: '#FFA500' },
                                    { name: 'Verde sticla', hex: '#006400' },
                                    { name: 'Galben', hex: '#FFFF00' }
                                ].map(color => (
                                    <button
                                        key={color.name}
                                        onClick={() => setState(prev => ({ ...prev, options: { ...prev.options, color: color.name } }))}
                                        className={`group relative flex flex-col items-center gap-2 transition-all`}
                                        title={color.name}
                                    >
                                        <div
                                            className={`w-10 h-10 rounded-full border-2 transition-all ${state.options.color === color.name ? 'ring-2 ring-indigo-500 ring-offset-2 scale-110' : 'border-slate-100 hover:scale-105'}`}
                                            style={{ backgroundColor: color.hex, borderColor: color.border ? '#e2e8f0' : 'transparent' }}
                                        />
                                        <span className={`text-[9px] font-bold text-center leading-tight ${state.options.color === color.name ? 'text-indigo-600' : 'text-slate-400'}`}>
                                            {color.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Print Position */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <LayoutTemplate size={14} /> Poziție Imprimare
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                {[
                                    { id: 'fata', name: 'Doar Față', icon: FileImage },
                                    { id: 'spate', name: 'Doar Spate', icon: FileImage },
                                    { id: 'fata_si_spate', name: 'Față + Spate (+20 RON)', icon: LayoutTemplate }
                                ].map(pos => (
                                    <button
                                        key={pos.id}
                                        onClick={() => setState(prev => ({ ...prev, options: { ...prev.options, printPosition: pos.id } }))}
                                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 text-center ${state.options.printPosition === pos.id || (!state.options.printPosition && pos.id === 'fata') ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' : 'border-slate-50 bg-slate-50 dark:bg-slate-800/50 text-slate-500 hover:border-indigo-200'}`}
                                    >
                                        <pos.icon size={20} className={state.options.printPosition === pos.id || (!state.options.printPosition && pos.id === 'fata') ? 'text-indigo-600' : 'text-slate-400'} />
                                        <span className="font-bold text-[11px]">{pos.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {state.selectedId === 'carti-vizita' && (
                    <div className="space-y-6">
                        {/* Two Sided Print */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <LayoutTemplate size={14} /> Tipărire
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { id: false, name: 'Doar Față', icon: FileImage },
                                    { id: true, name: 'Față-Verso (+60%)', icon: LayoutTemplate }
                                ].map(opt => (
                                    <button
                                        key={String(opt.id)}
                                        onClick={() => setState(prev => ({ ...prev, options: { ...prev.options, twoSided: opt.id } }))}
                                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 text-center ${!!state.options.twoSided === !!opt.id ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' : 'border-slate-50 bg-slate-50 dark:bg-slate-800/50 text-slate-500 hover:border-indigo-200'}`}
                                    >
                                        <opt.icon size={20} className={!!state.options.twoSided === !!opt.id ? 'text-indigo-600' : 'text-slate-400'} />
                                        <span className="font-bold text-[11px]">{opt.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Finishing Addons */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Sparkles size={14} /> Finisaje Opționale
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <button
                                    onClick={() => setState(prev => ({ ...prev, options: { ...prev.options, roundedCorners: !prev.options.roundedCorners } }))}
                                    className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 text-left ${state.options.roundedCorners ? 'border-indigo-600 bg-white text-indigo-600 shadow-premium-sm' : 'border-slate-100 bg-white text-slate-500 hover:border-indigo-200'}`}
                                >
                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${state.options.roundedCorners ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-200'}`}>
                                        {state.options.roundedCorners && <Check size={14} strokeWidth={4} />}
                                    </div>
                                    <span className="font-bold text-xs flex-1">Colțuri Rotunjite (+0.20 lei)</span>
                                </button>
                                <button
                                    onClick={() => setState(prev => ({ ...prev, options: { ...prev.options, specialShape: !prev.options.specialShape } }))}
                                    className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 text-left ${state.options.specialShape ? 'border-indigo-600 bg-white text-indigo-600 shadow-premium-sm' : 'border-slate-100 bg-white text-slate-500 hover:border-indigo-200'}`}
                                >
                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${state.options.specialShape ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-200'}`}>
                                        {state.options.specialShape && <Check size={14} strokeWidth={4} />}
                                    </div>
                                    <span className="font-bold text-xs flex-1">Decupare Formă Specială (+0.20 lei)</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Double Sided for Marketing (Excluding Pliante) */}
                {['flayere', 'flyers', 'brochures', 'carton', 'plexiglass'].includes(state.selectedId!) && (
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <LayoutTemplate size={14} /> Tipărire
                        </h3>
                        {state.selectedId === 'carton' && state.options.materialType === 'reciclat' ? (
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 text-[10px] font-bold text-slate-500 italic">
                                * Imprimarea față-verso pentru carton fagure se stabilește la cerere.
                            </div>
                        ) : state.selectedId === 'plexiglass' && state.materialId === 'plexi-alb' ? (
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 text-[10px] font-bold text-slate-500 italic">
                                * Imprimarea față-verso nu este disponibilă pentru plexiglas alb (opac).
                            </div>
                        ) : (
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
                        )}
                    </div>
                )}

                {/* Filtered Registry Options for unhandled cases */}
                {selectedConfig.options.filter((o: any) =>
                    !['finisaje', 'artwork', 'grafica', 'material', 'materialtype', 'printdouble', 'frame', 'design', 'tip rama', 'laminated', 'lamination', 'print_type', 'type', 'folds', 'tip pliuri', 'sides', 'sides_count', 'thickness', 'grosime', 'thickness_mm', 'twosided', 'grosime_material', 'print', 'color', 'culoare', 'comunicat', 'bannersite', 'afisinformativ', 'automici', 'automari', 'panoutemporar', 'placapermanenta', 'program'].includes(o.id.toLowerCase()) &&
                    !o.name.toLowerCase().includes('design') &&
                    !o.name.toLowerCase().includes('grafic') &&
                    !o.name.toLowerCase().includes('față/verso') &&
                    !o.name.toLowerCase().includes('fata/verso') &&
                    !o.name.toLowerCase().includes('grosime') &&
                    !o.name.toLowerCase().includes('culoare') &&
                    !o.name.toLowerCase().includes('ramă')
                ).map((option: any) => (
                    <div key={option.id} className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100">
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
                                            : 'border-slate-100 bg-white text-slate-600 dark:text-slate-400'
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
                                className="w-full h-14 bg-white border-2 border-slate-100 rounded-2xl px-6 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-600 transition-all appearance-none"
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
                <button onClick={handleBack} className="w-1/3 h-14 rounded-2xl border-2 border-slate-200 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:bg-slate-800 transition-all">Înapoi</button>
                <button onClick={handleNext} className="flex-1 h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-bold text-white shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2">
                    Pasul Final <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
};
