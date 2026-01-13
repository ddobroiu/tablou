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
}

export const PreviewPanel = ({ currentStep, selectedConfig, state, totalPrice }: PreviewPanelProps) => {

    // Default empty state
    if (!state.selectedId || !selectedConfig) {
        return (
            <div className="hidden lg:flex w-[40%] bg-slate-50/50 p-8 flex-col items-center justify-center text-center min-h-[400px] border-l border-slate-100">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <Package className="text-slate-300" size={48} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Configurează Produsul</h3>
                <p className="text-slate-500 max-w-xs mx-auto">Alege din stânga tipul de produs pentru a începe configurarea.</p>
            </div>
        );
    }

    const selectedMaterial = selectedConfig.materials?.find((m: any) => m.id === state.materialId);

    return (
        <div className="hidden lg:flex w-[40%] flex-col border-l border-slate-100 bg-slate-50/30 p-8 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />

            <div className="flex-1 flex flex-col justify-between h-full space-y-8 sticky top-6">

                {/* Visual Preview (Simplified Placeholder for now) */}
                <div className="relative aspect-square w-full max-w-[350px] mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/50 border-4 border-white ring-1 ring-slate-100 flex items-center justify-center overflow-hidden group">
                    {/* Dynamic Preview Logic would go here - e.g. displaying uploaded image on a 3D canvas */}
                    {state.artworkUrl ? (
                        <img src={state.artworkUrl} alt="Preview" className="w-full h-full object-contain" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center p-8 bg-slate-50/50">
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
                    )}

                    {/* Badge */}
                    <div className="absolute top-6 right-6 bg-slate-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                        Previzualizare
                    </div>
                </div>

                {/* Summary Card (Right Side) */}
                <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white/50 shadow-lg shadow-slate-200/50 space-y-6">
                    <div>
                        <h3 className="font-extrabold text-slate-900 text-lg mb-1">{selectedConfig.name}</h3>
                        <div className="flex flex-wrap gap-2">
                            <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border border-indigo-100">
                                {state.width} x {state.height} cm ({state.width > state.height ? 'Landscape' : state.width < state.height ? 'Portret' : 'Pătrat'})
                            </span>
                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border border-slate-200">
                                {state.quantity} buc
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-dashed border-slate-200">
                        {selectedMaterial && (
                            <div className="flex justify-between items-start text-xs">
                                <span className="text-slate-500">Material</span>
                                <span className="font-bold text-slate-900 text-right max-w-[150px]">{selectedMaterial.name}</span>
                            </div>
                        )}

                        {/* Display other active options */}
                        {Object.entries(state.options).map(([key, value]) => {
                            // 1. FILTER: Exclude technical, empty, or false values
                            if (!value || value === false) return null;

                            // 2. FILTER: Exclude defaults that don't apply to the current product
                            const isBanner = state.selectedId === 'banner' || state.selectedId === 'mesh' || state.selectedId === 'banner-verso';
                            if (isBanner) {
                                if (['thickness_mm', 'color', 'paperWeightKey', 'frameType', 'edge_type', 'laminated', 'print_type', 'twoSided', 'fold'].includes(key)) return null;
                                if (key === 'want_hem_and_grommets') {
                                    // Special handling for standard finishing
                                    return (
                                        <div key={key} className="flex justify-between items-start text-xs">
                                            <span className="text-slate-500">Finisaje</span>
                                            <span className="font-bold text-slate-900 text-right">Tiv + Capse</span>
                                        </div>
                                    );
                                }
                            }

                            const isRigid = ['pvc-forex', 'alucobond', 'plexiglass', 'polipropilena', 'carton'].includes(state.selectedId || '');
                            if (isRigid) {
                                if (['paperWeightKey', 'frameType', 'edge_type', 'fold', 'want_hem_and_grommets', 'want_wind_holes'].includes(key)) return null;
                            }

                            // 3. MAP: Translate keys to Romanian
                            const labelMap: Record<string, string> = {
                                want_wind_holes: "Găuri de Vânt",
                                thickness_mm: "Grosime",
                                color: "Culoare",
                                laminated: "Laminare",
                                print_type: "Tip Print",
                                twoSided: "Față-Verso",
                                paperWeightKey: "Grosime Hârtie",
                                frameType: "Tip Ramă",
                                edge_type: "Margine",
                                fold: "Împăturire"
                            };

                            const displayLabel = labelMap[key] || key.replace(/_/g, ' ');

                            // 4. FORMAT: Translate values
                            let displayValue = String(value);
                            if (value === true) displayValue = "Da";
                            if (key === 'thickness_mm') displayValue += " mm";
                            if (key === 'print_type') displayValue = value === 'print_only' ? 'Doar Print' : 'Print + Cut';
                            if (key === 'twoSided') displayValue = value ? 'Da' : 'Nu';
                            if (key === 'paperWeightKey') displayValue += "g";

                            return (
                                <div key={key} className="flex justify-between items-start text-xs">
                                    <span className="text-slate-500 capitalize">{displayLabel}</span>
                                    <span className="font-bold text-slate-900 text-right">{displayValue}</span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <div className="flex items-end justify-between mb-4">
                            <div>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Total Estimativ</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-black text-slate-900 tracking-tight">{formatMoneyDisplay(totalPrice)}</span>
                                    <span className="text-xs text-slate-400 font-bold">+ TVA</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-3">
                            <DeliveryEstimation />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
