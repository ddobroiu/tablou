import React from "react";
import { Package } from "lucide-react";
import { ConfigState } from "./types";
import { formatMoneyDisplay } from "@/lib/pricing";
import DeliveryEstimation from "@/components/DeliveryEstimation";

interface PreviewPanelProps {
    currentStep: number;
    selectedConfig: any | null;
    state: ConfigState;
    totalPrice: number;
    customPreviewImage?: string;
}

export const PreviewPanel = ({ currentStep, selectedConfig, state, totalPrice, customPreviewImage }: PreviewPanelProps) => {

    // Default empty state
    if (!state.selectedId || !selectedConfig) {
        return (
            <div className="hidden lg:flex w-[40%] bg-slate-50 dark:bg-slate-800/50 p-8 flex-col items-center justify-center text-center min-h-[400px] border-l border-slate-100">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <Package className="text-slate-300" size={48} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Configurează Produsul</h3>
                <p className="text-slate-500 max-w-xs mx-auto">Alege din stânga tipul de produs pentru a începe configurarea.</p>
            </div>
        );
    }

    const selectedMaterial = selectedConfig.materials?.find((m: any) => m.id === state.materialId);

    return (
        <div className="hidden lg:flex w-[40%] flex-col border-l border-slate-100 bg-slate-50 dark:bg-slate-800/30 p-8 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />

            <div className="flex-1 flex flex-col justify-between h-full space-y-8 sticky top-6">

                {/* Visual Preview */}
                <div className="relative aspect-square w-full max-w-[350px] mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/50 border-4 border-white ring-1 ring-slate-100 flex items-center justify-center overflow-hidden group">
                    {/* Dynamic Preview Logic */}
                    {(() => {
                        // Check if we should show the product image (Step 3 - Options)
                        const shouldShowProductImage = currentStep === 3;

                        // Define helper to get product image path
                        const getProductImage = () => {
                            if (!selectedConfig) return null;
                            const { slug, category, id } = selectedConfig;
                            if (id === 'banner-verso') return '/products/banner/verso/banner-verso-1.webp';
                            if (category === 'rigid') return `/products/materiale/${slug}/${slug}-1.webp`;
                            return `/products/${slug}/${slug}-1.webp`;
                        };

                        const productImg = customPreviewImage || getProductImage();


                        // Step 4: Finalization
                        if (currentStep === 4) {
                            if (state.artworkUrl) {
                                return <img src={state.artworkUrl} alt="Preview" className="w-full h-full object-contain" />;
                            }
                            if (productImg) {
                                return (
                                    <img
                                        src={productImg}
                                        alt={selectedConfig.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                    />
                                );
                            }
                        }

                        // Step 3: Options - Prioritize Product Image
                        if (shouldShowProductImage && productImg) {
                            return (
                                <img
                                    src={productImg}
                                    alt={selectedConfig.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            );
                        }

                        // Default Visualizer Logic
                        if (state.artworkUrl) {
                            return <img src={state.artworkUrl} alt="Preview" className="w-full h-full object-contain" />;
                        }

                        return (
                            <div className="w-full h-full flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-800/50">
                                {(() => {
                                    const maxWidth = 240;
                                    const maxHeight = 240;
                                    const ratio = state.width / state.height;
                                    let w, h;

                                    if (ratio >= 1) {
                                        w = maxWidth;
                                        h = maxWidth / ratio;
                                        if (h > maxHeight) {
                                            h = maxHeight;
                                            w = maxHeight * ratio;
                                        }
                                    } else {
                                        h = maxHeight;
                                        w = maxHeight * ratio;
                                        if (w > maxWidth) {
                                            w = maxWidth;
                                            h = maxWidth / ratio;
                                        }
                                    }

                                    return (
                                        <div className="relative flex items-center justify-center transition-all duration-500 ease-out" style={{ width: w, height: h }}>
                                            {/* Product Shape */}
                                            <div className="absolute inset-0 border-2 border-indigo-500 bg-indigo-50 rounded-lg shadow-sm flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                                                <div className="text-center opacity-50">
                                                    <span className="text-[10px] font-black uppercase text-indigo-300 tracking-widest">{state.width > state.height ? 'Landscape' : state.width < state.height ? 'Portret' : 'Pătrat'}</span>
                                                </div>
                                            </div>

                                            {/* Width Label (Top) */}
                                            <div className="absolute -top-6 left-0 w-full flex items-center justify-center">
                                                <div className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm whitespace-nowrap z-10">
                                                    {state.width} cm
                                                </div>
                                                <div className="absolute top-1/2 left-0 w-full h-px bg-slate-300 -z-0"></div>
                                                <div className="absolute top-1/2 left-0 w-px h-2 bg-slate-300 -translate-y-1/2"></div>
                                                <div className="absolute top-1/2 right-0 w-px h-2 bg-slate-300 -translate-y-1/2"></div>
                                            </div>

                                            {/* Height Label (Left) */}
                                            <div className="absolute top-0 -left-6 h-full flex items-center justify-center">
                                                <div className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm whitespace-nowrap z-10 -rotate-90">
                                                    {state.height} cm
                                                </div>
                                                <div className="absolute left-1/2 top-0 h-full w-px bg-slate-300 -z-0"></div>
                                                <div className="absolute left-1/2 top-0 h-px w-2 bg-slate-300 -translate-x-1/2"></div>
                                                <div className="absolute left-1/2 bottom-0 h-px w-2 bg-slate-300 -translate-x-1/2"></div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        );
                    })()}
                </div>

                {/* Badge */}
                <div className="absolute top-6 right-6 bg-slate-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                    Previzualizare
                </div>
            </div>

            {/* Summary Card (Right Side) */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white/50 shadow-lg shadow-slate-200/50 space-y-6">
                <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-lg mb-1">{selectedConfig.name}</h3>
                    <div className="flex flex-wrap gap-2">
                        <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border border-indigo-100">
                            {state.width} x {state.height} cm ({state.width > state.height ? 'Landscape' : state.width < state.height ? 'Portret' : 'Pătrat'})
                        </span>
                        <span className="bg-slate-100 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border border-slate-200">
                            {state.quantity} buc
                        </span>
                    </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-dashed border-slate-200">
                    {selectedMaterial && (
                        <div className="flex justify-between items-start text-xs">
                            <span className="text-slate-500">Material</span>
                            <span className="font-bold text-slate-900 dark:text-white text-right max-w-[150px]">{selectedMaterial.name}</span>
                        </div>
                    )}

                    {/* Display active options based on strict whitelist */}
                    {(() => {
                        const whitelist = (() => {
                            switch (state.selectedId) {
                                case 'banner':
                                case 'mesh':
                                    return ['want_wind_holes', 'want_hem_and_grommets'];
                                case 'banner-verso':
                                    return ['want_wind_holes', 'artwork_distribution'];
                                case 'canvas':
                                    return state.options.frameType === 'framed' ? ['frameType', 'framedShape', 'framedSize'] : ['frameType'];
                                case 'autocolante':
                                case 'stickers-labels':
                                    return ['print_type', 'laminated', 'material'];
                                case 'pvc-forex':
                                case 'alucobond':
                                    return ['thickness_mm', 'color'];
                                case 'plexiglass':
                                    return ['thickness_mm', 'color', 'twoSided'];
                                case 'polipropilena':
                                    return ['thickness_mm'];
                                case 'carton':
                                    return ['thickness_mm', 'ondula'];
                                case 'flayere':
                                case 'flyers':
                                    return ['paperWeightKey', 'twoSided'];
                                case 'pliante':
                                case 'brochures':
                                    return ['paperWeightKey', 'fold'];
                                case 'tapet':
                                    return ['want_adhesive'];
                                default:
                                    return [];
                            }
                        })();

                        return Object.entries(state.options).map(([key, value]) => {
                            if (!whitelist.includes(key)) return null;
                            if (!value || value === false) return null;

                            let label = key;
                            let displayValue = String(value);

                            switch (key) {
                                case 'want_hem_and_grommets':
                                    label = "Finisaje";
                                    displayValue = "Tiv + Capse";
                                    break;
                                case 'want_wind_holes':
                                    label = "Găuri de Vânt";
                                    displayValue = "Da";
                                    break;
                                case 'thickness_mm':
                                    label = "Grosime";
                                    displayValue = `${value} mm`;
                                    break;
                                case 'color':
                                    label = "Culoare";
                                    break;
                                case 'laminated':
                                    label = "Laminare";
                                    displayValue = "Da (+10%)";
                                    break;
                                case 'print_type':
                                    label = "Tip Print";
                                    displayValue = value === 'print_only' ? 'Doar Print' : 'Print + Cut';
                                    break;
                                case 'twoSided':
                                    label = "Față-Verso";
                                    displayValue = value ? 'Da' : 'Nu';
                                    break;
                                case 'paperWeightKey':
                                    label = "Grosime Hârtie";
                                    displayValue = `${value}g`;
                                    break;
                                case 'frameType':
                                    label = "Ramă";
                                    displayValue = value === 'framed' ? 'Cu Ramă' : 'Fără Ramă';
                                    break;
                                case 'framedShape':
                                    label = "Formă Ramă";
                                    displayValue = value === 'square' ? 'Pătrat' : 'Dreptunghi';
                                    break;
                                case 'framedSize':
                                    label = "Dimensiune Ramă";
                                    displayValue = value.toString().replace('x', '×') + ' cm';
                                    break;
                                case 'fold':
                                    label = "Împăturire";
                                    const foldLabels: Record<string, string> = { simplu: "1 big (Simplu)", fereastra: "2 biguri (Fereastră)", paralel: "3 biguri (Paralel)", fluture: "4 biguri (Fluture)" };
                                    displayValue = foldLabels[String(value)] || String(value);
                                    break;
                                case 'want_adhesive':
                                    label = "Adeziv";
                                    displayValue = "Autocolant";
                                    break;
                                case 'artwork_distribution':
                                    label = "Tip Grafică";
                                    displayValue = value === 'identical' ? 'Identică' : 'Diferită';
                                    break;
                                default:
                                    label = key.replace(/_/g, ' ');
                            }

                            return (
                                <div key={key} className="flex justify-between items-start text-xs">
                                    <span className="text-slate-500 capitalize">{label}</span>
                                    <span className="font-bold text-slate-900 dark:text-white text-right">{displayValue}</span>
                                </div>
                            );
                        });
                    })()}
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-4">
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Total Estimativ</p>
                            <div className="flex flex-col">
                                <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{formatMoneyDisplay(totalPrice)}</span>
                                <span className="text-xs text-slate-400 font-bold">(TVA inclus)</span>
                            </div>
                        </div>
                    </div>

                    <DeliveryEstimation />
                </div>
            </div>
        </div>
    );
};
