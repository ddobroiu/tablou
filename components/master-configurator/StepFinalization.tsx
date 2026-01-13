import React, { useRef } from "react";
import { Check, UploadCloud, Type, Palette, ArrowRight, ShoppingCart, FileText } from "lucide-react";
import { pdf } from '@react-pdf/renderer';
import { OfferPDF } from "@/components/OfferPDF";
import { ConfigState } from "./types";
import { formatMoneyDisplay } from "@/lib/pricing";
import DeliveryEstimation from "@/components/DeliveryEstimation";

interface StepFinalizationProps {
    currentStep: number;
    selectedConfig: any;
    state: ConfigState;
    setState: React.Dispatch<React.SetStateAction<ConfigState>>;
    totalPrice: number;
    handleBack: () => void;
    handleAddToCart: () => void;
    handleArtworkUpload: (file: File) => Promise<void>;
    handleArtworkUploadVerso: (file: File) => Promise<void>;
    uploading: boolean;
    uploadError: string | null;
}

export const StepFinalization = ({
    currentStep,
    selectedConfig,
    state,
    setState,
    totalPrice,
    handleBack,
    handleAddToCart,
    handleArtworkUpload,
    handleArtworkUploadVerso,
    uploading,
    uploadError
}: StepFinalizationProps) => {

    // Refs for file inputs to reset them if needed, though mostly handled by change event
    const fileInputRef = useRef<HTMLInputElement>(null);
    const fileInputRefVerso = useRef<HTMLInputElement>(null);

    if (currentStep !== 4 || !selectedConfig) return null;

    const selectedMaterial = selectedConfig.materials.find((m: any) => m.id === state.materialId);

    return (
        <div className="animate-fade-in space-y-8">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Check size={16} /> Finalizare & Comandă
            </h3>

            {/* Design Choice */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Opțiuni Grafică</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
                    <button
                        onClick={() => setState(prev => ({ ...prev, designOption: 'upload' }))}
                        className={`p-3 rounded-xl border-2 font-bold text-xs transition-all flex flex-col items-center gap-2 ${state.designOption === 'upload' ? 'border-indigo-600 bg-white text-indigo-600 shadow-sm' : 'border-slate-100 bg-white text-slate-500'}`}
                    >
                        <UploadCloud size={20} />
                        Am Grafica Mea
                    </button>
                    <button
                        onClick={() => setState(prev => ({ ...prev, designOption: 'text_only' }))}
                        className={`p-3 rounded-xl border-2 font-bold text-xs transition-all flex flex-col items-center gap-2 ${state.designOption === 'text_only' ? 'border-indigo-600 bg-white text-indigo-600 shadow-sm' : 'border-slate-100 bg-white text-slate-500'}`}
                    >
                        <Type size={20} />
                        Doar Text
                    </button>
                    <button
                        onClick={() => setState(prev => ({ ...prev, designOption: 'pro' }))}
                        className={`p-3 rounded-xl border-2 font-bold text-xs transition-all flex flex-col items-center gap-2 ${state.designOption === 'pro' ? 'border-indigo-600 bg-white text-indigo-600 shadow-sm' : 'border-slate-100 bg-white text-slate-500'}`}
                    >
                        <Palette size={20} />
                        Vreau Design Pro
                    </button>
                </div>

                {state.designOption === 'upload' && (
                    <div className="space-y-4 animate-fade-in">
                        {/* Față */}
                        <div className="border-2 border-dashed border-indigo-200 rounded-2xl p-6 bg-indigo-50/50 hover:bg-indigo-50 transition-colors text-center">
                            <input
                                ref={fileInputRef}
                                type="file"
                                id="file-upload"
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files?.[0]) handleArtworkUpload(e.target.files[0]);
                                }}
                            />
                            <label htmlFor="file-upload" className="cursor-pointer block">
                                <UploadCloud className="mx-auto text-indigo-400 mb-2" size={32} />
                                <span className="font-bold text-indigo-900 block">Încarcă Fișierul (Față)</span>
                                <span className="text-xs text-indigo-600/80 block mt-1">PDF, TIFF, CDR, AI, EPS, JPG (min. 150dpi)</span>
                            </label>
                            {state.artworkUrl && (
                                <div className="mt-4 bg-white p-3 rounded-xl border border-indigo-100 flex items-center gap-3 text-left">
                                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                                        <Check size={16} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-indigo-900 truncate">Fișier încărcat cu succes</p>
                                        <p className="text-[10px] text-indigo-500 truncate">{state.artworkUrl.split('/').pop()}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Verso (dacă e cazul) */}
                        {((state.selectedId === 'banner-verso') || (state.options.twoSided)) && (
                            <div className="border-2 border-dashed border-indigo-200 rounded-2xl p-6 bg-indigo-50/50 hover:bg-indigo-50 transition-colors text-center">
                                <input
                                    ref={fileInputRefVerso}
                                    type="file"
                                    id="file-upload-verso"
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) handleArtworkUploadVerso(e.target.files[0]);
                                    }}
                                />
                                {state.options.same_graphic === false || state.options.twoSided ? (
                                    <>
                                        <label htmlFor="file-upload-verso" className="cursor-pointer block">
                                            <UploadCloud className="mx-auto text-indigo-400 mb-2" size={32} />
                                            <span className="font-bold text-indigo-900 block">Încarcă Fișierul (Verso)</span>
                                        </label>
                                        {state.artworkUrlVerso && (
                                            <div className="mt-4 bg-white p-3 rounded-xl border border-indigo-100 flex items-center gap-3 text-left">
                                                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                                                    <Check size={16} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold text-indigo-900 truncate">Fișier Verso încărcat</p>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-xs text-indigo-600 font-bold">Se va folosi aceeași grafică și pe verso.</p>
                                )}
                            </div>
                        )}

                        {uploading && <p className="text-center text-xs font-bold text-indigo-600 animate-pulse">Se încarcă fișierul...</p>}
                        {uploadError && <p className="text-center text-xs font-bold text-red-500">{uploadError}</p>}
                    </div>
                )}

                {state.designOption === 'text_only' && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700">Text pentru imprimare</label>
                            <textarea
                                value={state.textDesign}
                                onChange={(e) => setState(prev => ({ ...prev, textDesign: e.target.value }))}
                                className="w-full min-h-[100px] p-4 rounded-xl border-2 border-slate-200 focus:border-indigo-600 outline-none text-sm font-medium resize-y"
                                placeholder="Scrie aici textul dorit..."
                            />
                        </div>
                    </div>
                )}

                {state.designOption === 'pro' && (
                    <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-center">
                        <p className="text-sm font-bold text-indigo-900">Un designer Prynt te va contacta pentru a stabili detaliile.</p>
                        <p className="text-xs text-indigo-600 mt-1">Costul de design este inclus în prețul afișat.</p>
                    </div>
                )}
            </div>

            {/* Final Summary Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h4 className="font-bold text-slate-900 mb-1">{selectedConfig.name}</h4>
                    <p className="text-sm text-slate-500">
                        {state.width} x {state.height} cm • {state.quantity} buc
                        {selectedMaterial && ` • ${selectedMaterial.name}`}
                    </p>
                </div>
                <div className="p-6 space-y-4">
                    <DeliveryEstimation />
                    <div className="flex items-end justify-between pt-4 border-t border-slate-100">
                        <div>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Total Estimativ</p>
                            <p className="text-3xl font-black text-slate-900">{formatMoneyDisplay(totalPrice)}</p>
                            <p className="text-xs text-slate-400 font-medium">+ TVA</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-500 mb-1">Preț per bucată</p>
                            <p className="font-bold text-slate-900">{formatMoneyDisplay(totalPrice / state.quantity)}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <button onClick={handleBack} className="w-14 h-14 shrink-0 rounded-2xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center">
                    <ArrowRight size={20} className="rotate-180" />
                </button>

                <button
                    onClick={async () => {
                        try {
                            // Construct item object similar to AddToCart
                            const itemData = {
                                title: selectedConfig.name,
                                quantity: state.quantity,
                                price: totalPrice / state.quantity, // Unit price
                                width_cm: state.width,
                                height_cm: state.height,
                                metadata: {
                                    ...state.options,
                                    material: selectedConfig.materials?.find((m: any) => m.id === state.materialId)?.name,
                                    designOption: state.designOption
                                }
                            };

                            const blob = await pdf(<OfferPDF items={[itemData]} shipping={25} />).toBlob();
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = `Oferta_Prynt_${selectedConfig.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        } catch (error) {
                            console.error("PDF Gen Error:", error);
                            alert("A apărut o eroare la generarea ofertei PDF.");
                        }
                    }}
                    className="flex-1 h-14 rounded-2xl border-2 border-indigo-100 bg-indigo-50/50 text-indigo-700 font-bold hover:bg-indigo-100 hover:border-indigo-200 transition-all flex items-center justify-center gap-2"
                >
                    <FileText size={20} />
                    <span className="hidden sm:inline">Descarcă Ofertă</span>
                    <span className="sm:hidden">Ofertă</span>
                </button>

                <button
                    onClick={handleAddToCart}
                    className="flex-[2] h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-bold text-white shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 group"
                >
                    <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                    Adaugă în Coș
                </button>
            </div>
        </div>
    );
};
