import React from "react";
import Image from "next/image";
import { Package, ArrowRightLeft, Flag, Frame, FileImage, StickyNote, Presentation, BookOpen, FileText, Layers, PanelTop, Square, Scan, ScrollText } from "lucide-react";
import { CONFIGURATORS_REGISTRY } from "@/lib/configurators-registry";
import { ConfigState } from "./types";

interface StepProductSelectionProps {
    currentStep: number;
    state: ConfigState;
    onSelect: (id: string) => void;
}

// Map IDs to specific images in public/products/master
const IMAGE_MAP: Record<string, string> = {
    'carti-vizita': 'https://www.printcenter.ro/admin/imagini/categorii/1-35.png',
    'autocolante': '/products/master/autocolante.png',
    'stickers-labels': '/products/master/autocolante.png',
    'canvas': '/products/master/canvas.png',
    'flayere': '/products/master/flayere.png',
    'flyers': '/products/master/flayere.png',
    'fonduri-eu': '/products/master/fonduri.png',
    'pliante': '/products/master/pliante.png',
    'brochures': '/products/master/pliante.png',
    'rollup': '/products/master/rollup.png',
    'roll-up': '/products/master/rollup.png',
    'window-graphics': '/products/master/window-graphics.png',
};

export const StepProductSelection = ({ currentStep, state, onSelect }: StepProductSelectionProps) => {
    if (currentStep !== 1) return null;

    return (
        <div className="animate-fade-in space-y-6">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                <Package size={16} /> Alege Tipul Produsului
            </h3>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {CONFIGURATORS_REGISTRY.map((config) => {
                    const isSelected = state.selectedId === config.id;
                    const imageUrl = IMAGE_MAP[config.id];

                    // Fallback Icon Logic
                    let IconComponent = Package;
                    let iconColorData = "text-slate-500 bg-slate-100";
                    let gradient = "from-slate-50 to-slate-100";

                    if (!imageUrl) {
                        if (config.id.includes('banner')) {
                            IconComponent = config.id.includes('verso') ? ArrowRightLeft : Flag;
                            iconColorData = "text-orange-600 bg-orange-100";
                            gradient = "from-orange-50 to-orange-100/50";
                        } else if (['afise', 'posters'].includes(config.id)) {
                            IconComponent = FileImage;
                            iconColorData = "text-blue-600 bg-blue-100";
                            gradient = "from-blue-50 to-blue-100/50";
                        } else if (['rigid', 'alucobond', 'plexiglass', 'forex'].some(k => config.category.includes(k) || config.id.includes(k))) {
                            IconComponent = config.id.includes('plexi') ? Layers : config.id.includes('alucobond') ? PanelTop : Square;
                            iconColorData = "text-slate-700 dark:text-slate-300 bg-slate-200";
                        } else if (config.id === 'carton') {
                            IconComponent = Package;
                            iconColorData = "text-amber-700 bg-amber-100";
                        } else if (config.id === 'tapet') {
                            IconComponent = ScrollText;
                            iconColorData = "text-purple-600 bg-purple-100";
                        }
                    }

                    return (
                        <button
                            key={config.id}
                            onClick={() => onSelect(config.id)}
                            className={`group relative flex flex-col items-center text-center rounded-3xl border transition-all duration-300 overflow-hidden
                                ${isSelected
                                    ? 'border-indigo-600 bg-indigo-50/30 ring-2 ring-indigo-500 ring-offset-2'
                                    : 'border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:-translate-y-1 bg-white'
                                }
                            `}
                        >
                            {/* Visual Area: Image or Icon */}
                            <div className="w-full aspect-[4/3] relative bg-slate-50 dark:bg-slate-800 border-b border-slate-100 overflow-hidden">
                                {imageUrl ? (
                                    <Image
                                        src={imageUrl}
                                        alt={config.name}
                                        fill
                                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                    />
                                ) : (
                                    <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${gradient}`}>
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${iconColorData} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                            <IconComponent size={32} strokeWidth={1.5} />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Label Area */}
                            <div className="p-4 w-full flex-1 flex flex-col items-center justify-center bg-white">
                                <h4 className={`font-bold text-sm leading-tight transition-colors ${isSelected ? 'text-indigo-700' : 'text-slate-900 dark:text-white group-hover:text-indigo-700'}`}>
                                    {config.name}
                                </h4>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
