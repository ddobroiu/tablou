"use client";

import React, { useState, useMemo } from "react";
import {
    Package, Ruler, Check, Layers
} from "lucide-react";
import { CONFIGURATORS_REGISTRY } from "@/lib/configurators-registry";
import {
    calculateBannerPrice,
    calculateBannerVersoPrice,
    calculatePosterPrice,
    calculateAutocolantePrice,
    calculateCanvasPrice,
    calculateTapetPrice,
    calculateRollupPrice,
    calculateWindowGraphicsPrice,
    calculatePliantePrice,
    getCanvasUpsell,
    calculateFlyerPrice,
    calculateAlucobondPrice,
    calculatePVCForexPrice,
    calculatePlexiglassPrice,
    calculateFonduriEUPrice,
    calculateCartonPrice,
    calculatePolipropilenaPrice,
    getAutocolanteUpsell,
    getBannerUpsell,
    getBannerVersoUpsell
} from '@/lib/pricing';
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/ToastProvider";

// Imported Components
import { ConfigState, STEPS } from "./master-configurator/types";
import { Header } from "./master-configurator/Header";
import { InfoBar } from "./master-configurator/InfoBar";
import { StepProductSelection } from "./master-configurator/StepProductSelection";
import { StepDimensions } from "./master-configurator/StepDimensions";
import { StepOptions } from "./master-configurator/StepOptions";
import { StepFinalization } from "./master-configurator/StepFinalization";
import { PreviewPanel } from "./master-configurator/PreviewPanel";

export default function MasterConfigurator() {
    const { addItem } = useCart();
    const { showToast } = useToast();
    const [currentStep, setCurrentStep] = useState(1);
    const [state, setState] = useState<ConfigState>({
        selectedId: null,
        width: 100,
        height: 100,
        quantity: 1,
        materialId: '',
        options: {
            thickness_mm: 3,
            color: 'Alb',
            want_wind_holes: false,
            laminated: false,
            print_type: 'print_cut' as const,
            twoSided: false,
            paperWeightKey: '130',
            frameType: 'none' as const,
            edge_type: 'mirror',
            want_hem_and_grommets: true, // Standard pentru bannere
        } as Record<string, any>,
        designOption: 'standard',
        artworkUrl: null,
        artworkUrlVerso: null,
        textDesign: "",
        textDesignVerso: "",
    });

    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const selectedConfig = useMemo(() => {
        return CONFIGURATORS_REGISTRY.find(c => c.id === state.selectedId) || null;
    }, [state.selectedId]);

    // Set Defaults when config changes
    React.useEffect(() => {
        if (selectedConfig) {
            setState(prev => ({
                ...prev,
                materialId: selectedConfig.materials?.[0]?.id || '',
                // Reset dimensions if preset exists
                width: selectedConfig.dimensions.presets?.[0]?.width || prev.width,
                height: selectedConfig.dimensions.presets?.[0]?.height || prev.height,
            }));
        }
    }, [selectedConfig]);

    // Price Calculation Logic
    const upsellOpportunity = useMemo(() => {
        if (!state.selectedId) return null;

        const designOpt = state.designOption === 'pro' ? 'pro' : 'upload';

        if (state.selectedId === 'canvas') {
            return getCanvasUpsell({
                width_cm: state.width,
                height_cm: state.height,
                quantity: state.quantity,
                edge_type: 'mirror',
                frameType: state.options.frameType || 'framed',
                framedSize: state.options.framedSize,
                framedShape: state.options.framedShape || 'rectangle',
                designOption: designOpt as any
            });
        }

        if (['autocolante', 'stickers-labels'].includes(state.selectedId)) {
            return getAutocolanteUpsell({
                width_cm: state.width,
                height_cm: state.height,
                quantity: state.quantity,
                material: (state.materialId?.replace('-', '_') || 'oracal_641') as any,
                print_type: state.options.print_type || 'print_cut',
                laminated: state.options.laminated || false,
                designOption: state.designOption === 'standard' ? 'upload' : state.designOption as any
            });
        }

        if (state.selectedId === 'banner' || state.selectedId === 'mesh') {
            return getBannerUpsell({
                width_cm: state.width,
                height_cm: state.height,
                quantity: state.quantity,
                material: (state.materialId === 'frontlit-510' ? 'frontlit_510' : 'frontlit_440') as any,
                want_wind_holes: state.options.want_wind_holes || false,
                want_hem_and_grommets: true,
                designOption: state.designOption === 'standard' ? 'upload' : state.designOption as any
            });
        }

        if (state.selectedId === 'banner-verso') {
            return getBannerVersoUpsell({
                width_cm: state.width,
                height_cm: state.height,
                quantity: state.quantity,
                want_wind_holes: state.options.want_wind_holes || false,
                same_graphic: state.options.same_graphic !== false,
                designOption: state.designOption === 'standard' ? 'upload' : state.designOption as any
            });
        }

        return null;
    }, [state.selectedId, state.width, state.height, state.quantity, state.options, state.designOption, state.materialId]);

    const totalPrice = useMemo(() => {
        if (!selectedConfig || !state.selectedId) return 0;

        const designOpt = state.designOption === 'standard' ? 'upload' : state.designOption;

        try {
            switch (state.selectedId) {
                case 'banner':
                case 'mesh':
                    return calculateBannerPrice({
                        width_cm: state.width,
                        height_cm: state.height,
                        quantity: state.quantity,
                        material: (state.materialId === 'frontlit-510' ? 'frontlit_510' : 'frontlit_440') as any,
                        want_wind_holes: state.options.want_wind_holes || false,
                        want_hem_and_grommets: true, // Standard pentru bannere
                        designOption: designOpt as any
                    }).finalPrice;

                case 'banner-verso':
                    return calculateBannerVersoPrice({
                        width_cm: state.width,
                        height_cm: state.height,
                        quantity: state.quantity,
                        want_wind_holes: state.options.want_wind_holes || false,
                        same_graphic: state.options.same_graphic !== false, // default true
                        designOption: designOpt as any
                    }).finalPrice;

                case 'alucobond':
                    return calculateAlucobondPrice({
                        width_cm: state.width,
                        height_cm: state.height,
                        quantity: state.quantity,
                        thickness_mm: state.options.thickness_mm || 3,
                        color: state.options.color || 'Alb',
                        designOption: (designOpt === 'text_only' ? 'text_only' : designOpt === 'pro' ? 'pro' : 'upload') as any
                    }).finalPrice;

                case 'pvc-forex':
                    return calculatePVCForexPrice({
                        width_cm: state.width,
                        height_cm: state.height,
                        quantity: state.quantity,
                        thickness_mm: state.options.thickness_mm || 3,
                        designOption: (designOpt === 'text_only' ? 'text_only' : designOpt === 'pro' ? 'pro' : 'upload') as any
                    }).finalPrice;

                case 'plexiglass':
                    return calculatePlexiglassPrice({
                        width_cm: state.width,
                        height_cm: state.height,
                        quantity: state.quantity,
                        material: (state.materialId === 'plexi-alb' ? 'alb' : 'transparent') as any,
                        thickness_mm: state.options.thickness_mm || 3,
                        print_double: state.options.twoSided || false,
                        designOption: (designOpt === 'text_only' ? 'text_only' : designOpt === 'pro' ? 'pro' : 'upload') as any
                    }).finalPrice;

                case 'autocolante':
                case 'stickers-labels':
                    return calculateAutocolantePrice({
                        width_cm: state.width,
                        height_cm: state.height,
                        quantity: state.quantity,
                        material: (state.materialId?.replace('-', '_') || 'oracal_641') as any,
                        print_type: state.options.print_type || 'print_cut',
                        laminated: state.options.laminated || false,
                        designOption: designOpt as any
                    }).finalPrice;

                case 'canvas':
                    return calculateCanvasPrice({
                        width_cm: state.width,
                        height_cm: state.height,
                        quantity: state.quantity,
                        edge_type: 'mirror',
                        frameType: state.options.frameType || 'framed',
                        framedSize: state.options.framedSize,
                        framedShape: state.options.framedShape || 'rectangle',
                        designOption: (designOpt === 'pro' ? 'pro' : 'upload') as any
                    }).finalPrice;

                case 'flayere':
                case 'flyers':
                    const flyerPreset = selectedConfig.dimensions.presets?.find(p => p.width === state.width && p.height === state.height);
                    return calculateFlyerPrice({
                        sizeKey: flyerPreset?.label || 'A6',
                        quantity: state.quantity,
                        twoSided: state.options.twoSided || false,
                        paperWeightKey: state.options.paperWeightKey || '130',
                        designOption: (designOpt === 'pro' ? 'pro' : 'upload') as any
                    }).finalPrice;

                case 'pliante':
                case 'brochures':
                    const pliantPreset = selectedConfig.dimensions.presets?.find(p => p.width === state.width && p.height === state.height);
                    return calculatePliantePrice({
                        weight: (state.options.paperWeightKey || '130') as any,
                        quantity: state.quantity,
                        fold: (state.options.fold || 'simplu') as any,
                        designOption: (designOpt === 'pro' ? 'pro' : 'upload') as any
                    }).finalPrice;

                case 'afise':
                case 'posters':
                    const posterPreset = selectedConfig.dimensions.presets?.find(p => p.width === state.width && p.height === state.height);
                    return calculatePosterPrice({
                        size: posterPreset?.label || 'A3',
                        material: (state.materialId.replace('-', '_') || 'paper_150_lucioasa') as any,
                        quantity: state.quantity,
                        designOption: (designOpt === 'pro' ? 'pro' : 'upload') as any
                    }).finalPrice;

                case 'tapet':
                    return calculateTapetPrice({
                        width_cm: state.width,
                        height_cm: state.height,
                        quantity: state.quantity,
                        want_adhesive: state.materialId === 'tapet-adeziv',
                        designOption: (designOpt === 'pro' ? 'pro' : 'upload') as any
                    }).finalPrice;

                case 'rollup':
                case 'roll-up':
                    const rollupPreset = selectedConfig.dimensions.presets?.find(p => p.width === state.width);
                    return calculateRollupPrice({
                        width_cm: rollupPreset?.width || 85,
                        quantity: state.quantity,
                        designOption: (designOpt === 'pro' ? 'pro' : 'upload') as any
                    }).finalPrice;

                case 'window-graphics':
                    return calculateWindowGraphicsPrice({
                        width_cm: state.width,
                        height_cm: state.height,
                        quantity: state.quantity,
                        designOption: (designOpt === 'pro' ? 'pro' : 'upload') as any
                    }).finalPrice;

                case 'fonduri-eu':
                    return calculateFonduriEUPrice({
                        selections: state.options
                    }).finalPrice;

                case 'carton':
                    return calculateCartonPrice({
                        width_cm: state.width,
                        height_cm: state.height,
                        quantity: state.quantity,
                        material: 'ondulat',
                        ondula: state.options.thickness_mm === 5 ? '5BC' : '3B',
                        designOption: designOpt as any
                    }).finalPrice;

                case 'polipropilena':
                    return calculatePolipropilenaPrice({
                        width_cm: state.width,
                        height_cm: state.height,
                        quantity: state.quantity,
                        thickness_mm: state.options.thickness_mm || 3,
                        designOption: designOpt as any
                    }).finalPrice;

                default:
                    // Fallback simpler calculation
                    const area = (state.width * state.height) / 10000;
                    const basePrice = selectedConfig.pricing.bands?.find(b => area <= b.max)?.price || 20;
                    return basePrice * area * state.quantity;
            }
        } catch (e) {
            console.error("Pricing Error:", e);
            return 0;
        }
    }, [selectedConfig, state]);

    const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 4));
    const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handleArtworkUpload = async (file: File) => {
        setUploading(true);
        setUploadError(null);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('/api/upload-artwork', {
                method: 'POST',
                body: formData
            });
            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();
            setState(prev => ({ ...prev, artworkUrl: data.url }));
        } catch (err: any) {
            setUploadError("Eroare la încărcare. Încercați din nou.");
        } finally {
            setUploading(false);
        }
    };

    const handleArtworkUploadVerso = async (file: File) => {
        setUploading(true);
        setUploadError(null);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('/api/upload-artwork', {
                method: 'POST',
                body: formData
            });
            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();
            setState(prev => ({ ...prev, artworkUrlVerso: data.url }));
        } catch (err: any) {
            setUploadError("Eroare la încărcare. Încercați din nou.");
        } finally {
            setUploading(false);
        }
    };

    const handleAddToCart = () => {
        if (!selectedConfig) return;

        const cartMetadata: Record<string, any> = {
            "Material": selectedConfig.materials?.find((m: any) => m.id === state.materialId)?.name,
            "Grafică": state.designOption === 'pro' ? 'Design Profesional' : state.designOption === 'text_only' ? 'Doar Text' : 'Grafică Proprie',
        };

        if (state.designOption === 'text_only') {
            cartMetadata["Text Personalizare"] = state.textDesign;
        }

        // Add relevant options to metadata
        Object.entries(state.options).forEach(([key, value]) => {
            if (value && value !== false) {
                cartMetadata[key.charAt(0).toUpperCase() + key.slice(1)] = value;
            }
        });

        if (state.artworkUrl) cartMetadata["Fișier Grafică"] = state.artworkUrl;
        if (state.artworkUrlVerso) cartMetadata["Fișier Grafică Verso"] = state.artworkUrlVerso;

        addItem({
            id: `${state.selectedId}-${Date.now()}`,
            productId: state.selectedId!,
            slug: selectedConfig.slug,
            title: selectedConfig.name,
            width: state.width,
            height: state.height,
            price: Math.round(totalPrice / state.quantity),
            quantity: state.quantity,
            currency: 'RON',
            metadata: {
                ...cartMetadata,
                artworkUrl: state.artworkUrl,
                artworkUrlVerso: state.artworkUrlVerso,
                textDesign: state.textDesign,
                textDesignVerso: state.textDesignVerso,
                designOption: state.designOption
            }
        });

        showToast("Adăugat în coș!", "success");
    };

    return (
        <section className="py-12 lg:py-20 bg-slate-50 relative overflow-hidden">
            {/* Background elements for "coolness" */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 -right-24 w-80 h-80 bg-purple-500 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                <Header />

                {/* Main Configurator Container */}
                <div className="bg-white rounded-[2.5rem] shadow-premium border border-slate-200/60 overflow-hidden flex flex-col lg:flex-row min-h-[600px] transition-all">

                    {/* LEFT SIDE: CONTROLS */}
                    <div className={`${currentStep === 1 ? 'w-full' : 'flex-1 lg:w-[60%]'} p-6 lg:p-12 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col transition-all duration-500`}>

                        {/* Progressive Steps */}
                        <div className={`flex items-center justify-between mb-12 relative ${currentStep === 1 ? 'max-w-3xl mx-auto w-full' : ''}`}>
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 -z-10" />
                            {STEPS.map((step) => (
                                <button
                                    key={step.id}
                                    onClick={() => state.selectedId && setCurrentStep(step.id)}
                                    disabled={!state.selectedId && step.id > 1}
                                    className={`flex flex-col items-center gap-2 transition-all relative ${currentStep >= step.id ? 'text-indigo-600' : 'text-slate-400'}`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${currentStep >= step.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border-slate-200'}`}>
                                        <step.icon size={18} />
                                    </div>
                                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">{step.name}</span>
                                    {currentStep === step.id && (
                                        <div className="absolute -bottom-4 w-12 h-1 bg-indigo-600 rounded-t-full" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* STEP 1: PRODUCT SELECTION */}
                        <StepProductSelection
                            currentStep={currentStep}
                            state={state}
                            onSelect={(id) => {
                                setState(prev => ({ ...prev, selectedId: id }));
                                setCurrentStep(2);
                            }}
                        />

                        {/* STEP 2: DIMENSIONS */}
                        <StepDimensions
                            currentStep={currentStep}
                            selectedConfig={selectedConfig}
                            state={state}
                            setState={setState}
                            upsellOpportunity={upsellOpportunity}
                            handleNext={handleNext}
                            handleBack={handleBack}
                        />

                        {/* STEP 3: OPTIONS & FEATURES */}
                        <StepOptions
                            currentStep={currentStep}
                            selectedConfig={selectedConfig}
                            state={state}
                            setState={setState}
                            handleNext={handleNext}
                            handleBack={handleBack}
                        />

                        {/* STEP 4: FINALIZATION */}
                        <StepFinalization
                            currentStep={currentStep}
                            selectedConfig={selectedConfig}
                            state={state}
                            setState={setState}
                            totalPrice={totalPrice}
                            handleBack={handleBack}
                            handleAddToCart={handleAddToCart}
                            handleArtworkUpload={handleArtworkUpload}
                            handleArtworkUploadVerso={handleArtworkUploadVerso}
                            uploading={uploading}
                            uploadError={uploadError}
                        />

                    </div>

                    {/* RIGHT SIDE: PREVIEW & SUMMARY (40%) - Hidden on Step 1 */}
                    {currentStep > 1 && (
                        <PreviewPanel
                            currentStep={currentStep}
                            selectedConfig={selectedConfig}
                            state={state}
                            totalPrice={totalPrice}
                        />
                    )}

                </div>

                <InfoBar />

            </div>
        </section>
    );
}
