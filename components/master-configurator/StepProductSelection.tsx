import React from "react";
import { Package, ArrowRightLeft, Flag, Frame, FileImage, StickyNote, Presentation, BookOpen, FileText, Layers, PanelTop, Square, Scan } from "lucide-react";
import { CONFIGURATORS_REGISTRY } from "@/lib/configurators-registry";
import { ConfigState } from "./types";

interface StepProductSelectionProps {
    currentStep: number;
    state: ConfigState;
    onSelect: (id: string) => void;
}

export const StepProductSelection = ({ currentStep, state, onSelect }: StepProductSelectionProps) => {
    if (currentStep !== 1) return null;

    return (
        <div className="animate-fade-in space-y-6">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                <Package size={16} /> Alege Tipul Produsului
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {CONFIGURATORS_REGISTRY.map((config) => {
                    // Icon Mapping
                    let IconComponent = Package;
                    let iconColorData = "text-slate-500 bg-slate-100";
                    let gradient = "from-slate-50 to-slate-100";

                    if (config.id.includes('banner')) {
                        IconComponent = config.id.includes('verso') ? ArrowRightLeft : Flag;
                        iconColorData = "text-orange-600 bg-orange-100";
                        gradient = "from-orange-50 to-orange-100/50";
                    } else if (config.id === 'canvas') {
                        IconComponent = Frame;
                        iconColorData = "text-amber-600 bg-amber-100";
                        gradient = "from-amber-50 to-amber-100/50";
                    } else if (['afise', 'posters'].includes(config.id)) {
                        IconComponent = FileImage;
                        iconColorData = "text-blue-600 bg-blue-100";
                        gradient = "from-blue-50 to-blue-100/50";
                    } else if (['autocolante', 'stickers'].includes(config.id)) {
                        IconComponent = StickyNote;
                        iconColorData = "text-green-600 bg-green-100";
                        gradient = "from-green-50 to-green-100/50";
                    } else if (['rollup', 'pliant'].includes(config.id)) {
                        IconComponent = config.id === 'rollup' ? Presentation : BookOpen;
                        iconColorData = "text-purple-600 bg-purple-100";
                        gradient = "from-purple-50 to-purple-100/50";
                    } else if (['window', 'graphics'].some(k => config.id.includes(k))) {
                        IconComponent = Scan;
                        iconColorData = "text-cyan-600 bg-cyan-100";
                    } else if (['rigid', 'alucobond', 'plexiglass', 'forex'].some(k => config.category.includes(k) || config.id.includes(k))) {
                        IconComponent = config.id.includes('plexi') ? Layers : config.id.includes('alucobond') ? PanelTop : Square;
                        iconColorData = "text-slate-700 bg-slate-200";
                    } else if (config.id === 'flayere') {
                        IconComponent = FileText;
                        iconColorData = "text-pink-600 bg-pink-100";
                        gradient = "from-pink-50 to-pink-100/50";
                    }

                    const isSelected = state.selectedId === config.id;

                    return (
                        <button
                            key={config.id}
                            onClick={() => onSelect(config.id)}
                            className={`group relative p-3 sm:p-5 rounded-2xl border transition-all duration-300 text-left flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-start gap-3 sm:gap-4 h-full
                                ${isSelected
                                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500 ring-offset-2'
                                    : 'border-slate-200 hover:border-indigo-300 hover:shadow-lg hover:-translate-y-1 bg-white'
                                }
                            `}
                        >
                            {/* Background Gradient on Hover */}
                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`} />

                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-sm ${iconColorData} group-hover:scale-110 duration-300`}>
                                <IconComponent size={24} strokeWidth={2} />
                            </div>

                            <div className="flex-1 min-w-0 text-center sm:text-left">
                                <div className="flex items-center justify-center sm:justify-between mb-1">
                                    <h4 className={`font-bold text-xs sm:text-sm leading-tight transition-colors line-clamp-2 sm:line-clamp-none ${isSelected ? 'text-indigo-700' : 'text-slate-900 group-hover:text-indigo-700'}`}>
                                        {config.name}
                                    </h4>
                                </div>
                                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed transition-colors group-hover:text-slate-600 hidden lg:block">
                                    {config.description}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
