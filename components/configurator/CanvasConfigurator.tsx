"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/components/CartContext";
import { Plus, Minus, ShoppingCart, Info, ChevronDown, X, UploadCloud, MessageCircle, TrendingUp, Box, Image as ImageIcon, Sparkles, Settings2, FileText, Truck, Shield, HelpCircle, Star, Palette, Trash2, PencilRuler } from "lucide-react";
import Link from 'next/link';
import ProductCarousel from '@/components/ProductCarousel';
import DeliveryEstimation from "./DeliveryEstimation";
import FaqAccordion from "./FaqAccordion";
import { QA } from "@/types/configurator";
import Script from "next/script";
import { QRCodeSVG } from "qrcode.react";
import {
    calculateCanvasPrice,
    getCanvasUpsell,
    CANVAS_CONSTANTS,
    formatMoneyDisplay,
    type PriceInputCanvas
} from "@/lib/pricing";
import { PopularDimensions } from "./PopularDimensions";

const GALLERY_BASE = [
    "/products/canvas/canvas-1.webp",
    "/products/canvas/canvas-2.webp"
] as const;

const productFaqs: QA[] = [
    { question: "Ce material folosiți pentru tablouri?", answer: "Folosim Canvas Fine Art - pânză realizată prin combinația de bumbac și poliester, 330 g/mp, pentru imprimări de cea mai bună calitate. Materialul nu se cutează iar la tăiere țesătura nu se destramă." },
    { question: "Tabloul vine gata de agățat?", answer: "Da, pânza este întinsă pe un șasiu din lemn uscat, cu margine oglindită (imaginea continuă pe laterale). Tabloul include sistem de prindere și este gata de pus pe perete imediat ce îl scoateți din cutie." },
    { question: "Pentru ce tipuri de imagini este recomandat?", answer: "Canvas Fine Art este ideal pentru reproduceri de opere de artă, tablouri, portrete, peisaje, colaje și decorări speciale de interior." },
];

import { AccordionStep } from "./ui/AccordionStep";
import { TabButtonSEO } from "./ui/TabButtonSEO";
import { NumberInput } from "./ui/NumberInput";
import { OptionButton } from "./ui/OptionButton";
import { TabButton } from "./ui/TabButton";


// Declare custom element for TypeScript
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
                src?: string;
                poster?: string;
                alt?: string;
                'shadow-intensity'?: string;
                'camera-controls'?: boolean | string;
                'auto-rotate'?: boolean | string;
                ar?: boolean | string;
                'ar-modes'?: string;
                'tone-mapping'?: string;
                scale?: string;
                'camera-orbit'?: string;
                'min-camera-orbit'?: string;
                'max-camera-orbit'?: string;
            }, HTMLElement>;
        }
    }
}


type Props = { productSlug?: string; initialWidth?: number; initialHeight?: number; productImage?: string, intent?: string };

export default function CanvasConfigurator({ productSlug, initialWidth: initW, initialHeight: initH, productImage, intent }: Props) {
    const { addItem } = useCart();
    const searchParams = useSearchParams();

    // Parse URL params or use props/defaults
    const paramW = searchParams.get('w') ? parseInt(searchParams.get('w')!) : null;
    const paramH = searchParams.get('h') ? parseInt(searchParams.get('h')!) : null;
    const paramType = searchParams.get('type');

    const startW = paramW || initW || 40;
    const startH = paramH || initH || 60;

    const GALLERY = useMemo(() => productImage ? [productImage, ...GALLERY_BASE] : GALLERY_BASE, [productImage]);

    // Determine initial state based on start dimensions
    let initOrientation: 'portrait' | 'landscape' | 'square' = 'portrait';
    let initFramedShape: "rectangle" | "square" = "rectangle";
    let initFramedSize = "30x40";

    const sMin = Math.min(startW, startH);
    const sMax = Math.max(startW, startH);
    const sizeKey = `${sMin}x${sMax}`;

    if (startW === startH) {
        initOrientation = 'square';
        initFramedShape = 'square';
        // @ts-ignore
        if (CANVAS_CONSTANTS.FRAMED_PRICES_SQUARE[sizeKey]) {
            initFramedSize = sizeKey;
        } else {
            initFramedSize = "40x40"; // Fallback square
        }
    } else {
        if (startW > startH) initOrientation = 'landscape';
        // @ts-ignore
        if (CANVAS_CONSTANTS.FRAMED_PRICES_RECTANGLE[sizeKey]) {
            initFramedSize = sizeKey;
        }
    }

    const [input, setInput] = useState<PriceInputCanvas>({
        width_cm: startW,
        height_cm: startH,
        quantity: 1,
        edge_type: "mirror",
        designOption: "upload",
        frameType: (paramType === 'none') ? 'none' : 'framed',
        framedSize: initFramedSize,
        framedShape: initFramedShape,
    });

    const [lengthText, setLengthText] = useState(initW ? String(initW) : "40");
    const [heightText, setHeightText] = useState(initH ? String(initH) : "60");

    const [activeImage, setActiveImage] = useState<string>(GALLERY[0]);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [viewMode, setViewMode] = useState<'gallery' | '3d'>('gallery');

    const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const [detailsOpen, setDetailsOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(1);
    const [activeProductTab, setActiveProductTab] = useState<'descriere' | 'faq'>('descriere');

    // EFFECT: Handle initial props, Editor, and Intents
    useEffect(() => {
        if (productImage) {
            setArtworkUrl(productImage);
            setActiveImage(productImage);
            setViewMode('3d');
            updateInput('designOption', 'upload');
        }
        
        // Dimensions from props
        if (initW || initH) {
            setInput(prev => ({ 
                ...prev, 
                width_cm: initW || prev.width_cm, 
                height_cm: initH || prev.height_cm 
            }));
            if (initW) setLengthText(String(initW));
            if (initH) setHeightText(String(initH));
        }

        // Handle Intents (Decor & Professions)
        if (intent) {
            if (intent.includes('rama')) {
                updateInput('frameType', 'framed');
                // Could also set specific framedSize if we wanted
            } else if (intent === 'nunta' || intent === 'botez' || intent === 'familie') {
                updateInput('frameType', 'framed');
                updateInput('framedSize', '50x70');
                setOrientation('portrait');
            } else if (intent === 'colaj-foto') {
                updateInput('width_cm', 100);
                updateInput('height_cm', 70);
                setOrientation('landscape');
            }
        }
    }, [productImage, initW, initH, intent]);

    // Texture Control State
    const [textureZoom, setTextureZoom] = useState(1);
    const [textureX, setTextureX] = useState(0.5);
    const [textureY, setTextureY] = useState(0.5);
    const [showTextureControls, setShowTextureControls] = useState(false);

    // New State for Explicit Orientation Selector
    const [orientation, setOrientation] = useState<'portrait' | 'landscape' | 'square'>(initOrientation);

    // Pricing
    const priceData = useMemo(() => calculateCanvasPrice(input), [input]);
    const displayedTotal = priceData.finalPrice;

    // Upsell Logic
    const upsellOpportunity = useMemo(() => {
        return getCanvasUpsell(input);
    }, [input]);

    const [isArtLoaded, setIsArtLoaded] = useState(false);

    const updateInput = <K extends keyof PriceInputCanvas>(k: K, v: PriceInputCanvas[K]) => setInput((p) => ({ ...p, [k]: v }));
    const setQty = (v: number) => updateInput("quantity", Math.max(1, Math.floor(v)));

    const shareUrl = useMemo(() => {
        if (typeof window === 'undefined') return '';
        const url = new URL(window.location.origin + window.location.pathname);
        if (artworkUrl) url.searchParams.set('artworkUrl', artworkUrl);
        url.searchParams.set('w', input.width_cm.toString());
        url.searchParams.set('h', input.height_cm.toString());
        url.searchParams.set('type', input.frameType === 'none' ? 'none' : 'framed');
        url.searchParams.set('orient', orientation);
        if (input.framedSize) url.searchParams.set('framedSize', input.framedSize);
        if (input.framedShape) url.searchParams.set('framedShape', input.framedShape);
        url.searchParams.set('autoAr', 'true');
        return url.toString();
    }, [artworkUrl, input.width_cm, input.height_cm, input.frameType, input.framedSize, input.framedShape, orientation]);

    const [showArAutoLaunch, setShowArAutoLaunch] = useState(false);

    useEffect(() => {
        const urlArtwork = searchParams.get('artworkUrl');
        const autoAr = searchParams.get('autoAr');
        const paramW = searchParams.get('w');
        const paramH = searchParams.get('h');
        const paramType = searchParams.get('type');
        const paramSize = searchParams.get('framedSize');
        const paramOrient = searchParams.get('orient');
        const paramShape = searchParams.get('framedShape');

        if (urlArtwork) {
            setArtworkUrl(urlArtwork);
            setViewMode('3d');
        }

        if (paramW && paramH) {
            const w = parseInt(paramW);
            const h = parseInt(paramH);
            if (!isNaN(w) && !isNaN(h)) {
                setInput(prev => ({ ...prev, width_cm: w, height_cm: h }));
                setLengthText(w.toString());
                setHeightText(h.toString());
            }
        }

        if (paramType) {
            updateInput("frameType", paramType as any);
        }

        if (paramSize) {
            updateInput("framedSize", paramSize);
        }

        if (paramOrient) {
            setOrientation(paramOrient as any);
        }

        if (paramShape) {
            updateInput("framedShape", paramShape as any);
        }

        if (autoAr === 'true' && urlArtwork) {
            setShowArAutoLaunch(true);
        }
    }, [searchParams]);

    const handleDimChange = (val: string, setter: (v: string) => void, field: "width_cm" | "height_cm") => {
        let v = val.replace(/,/g, '.');
        if (!/^[0-9]*\.?[0-9]*$/.test(v)) return;
        setter(v);
        const num = parseFloat(v);
        if (!isNaN(num)) {
            updateInput(field, num);
        } else if (v === "") {
            updateInput(field, 0);
        }
    };

    const handleArtworkFileInput = async (file: File | null) => {
        setArtworkUrl(null); setUploadError(null);
        if (!file) return;
        try {
            setUploading(true);
            const form = new FormData(); form.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: form });
            if (!res.ok) throw new Error("Upload eșuat");
            const data = await res.json();
            setArtworkUrl(data.url);
        } catch (e: any) {
            setUploadError(e?.message ?? "Eroare la upload");
        } finally {
            setUploading(false);
        }
    };

    function handleAddToCart() {
        if (input.frameType === "framed") {
            if (!input.framedSize) {
                alert("Selectați o dimensiune.");
                return;
            }
        } else {
            if (!input.width_cm || !input.height_cm) {
                alert("Introduceți dimensiunile.");
                return;
            }
        }

        if (displayedTotal <= 0) {
            alert("Prețul trebuie calculat.");
            return;
        }

        const unitPrice = Math.round((displayedTotal / input.quantity) * 100) / 100;
        const uniqueId = `canvas-${Date.now()}`;

        let exportW = 0;
        let exportH = 0;
        let title = "";

        if (input.frameType === "framed") {
            const [d1, d2] = (input.framedSize || "0x0").split("x").map(Number);
            const short = Math.min(d1, d2);
            const long = Math.max(d1, d2);

            if (orientation === 'landscape') { exportW = long; exportH = short; }
            else if (orientation === 'portrait') { exportW = short; exportH = long; }
            else { exportW = short; exportH = short; }

            const shapeLabel = orientation === "square" ? "Pătrat" : "Dreptunghi";
            title = `Tablou Canvas cu Ramă ${shapeLabel} ${exportW}×${exportH} cm`;
        } else {
            exportW = input.width_cm;
            exportH = input.height_cm;
            title = `Tablou Canvas ${exportW}×${exportH} cm`;
        }

        addItem({
            id: uniqueId,
            productId: 'canvas',
            title: title,
            price: unitPrice,
            quantity: input.quantity,
            metadata: {
                "Tip": input.frameType === "framed" ? "Cu Ramă" : "Fără Ramă",
                "Grafică": input.designOption === 'pro' ? 'Vreau grafică' : 'Grafică proprie',
                "artworkUrl": artworkUrl,
                "width": exportW,
                "height": exportH,
                "Margine": input.edge_type === 'mirror' ? 'Oglindită (Mirror)' : 'Albă',
            },
        });
        alert("Adăugat în coș!");
    }

    useEffect(() => {
        if (artworkUrl) return;
        const id = setInterval(() => setActiveIndex((i) => (i + 1) % GALLERY.length), 5000);
        return () => clearInterval(id);
    }, [GALLERY.length, artworkUrl]);

    useEffect(() => setActiveImage(GALLERY[activeIndex]), [activeIndex, GALLERY]);

    const summaryStep1 = input.frameType === "framed" ? "Cu Ramă" : "Fără Ramă";
    const summaryStep2 = input.frameType === "framed"
        ? `${input.framedShape === "square" ? "Pătrat" : "Dreptunghi"} ${input.framedSize?.replace("x", "×")} cm, ${input.quantity} buc.`
        : (input.width_cm > 0 && input.height_cm > 0 ? `${input.width_cm}×${input.height_cm} cm, ${input.quantity} buc.` : "Alege dimensiuni");
    const summaryStep3 = input.designOption === 'upload' ? 'Grafică proprie' : 'Design Pro';

    const modelViewerRef = useRef<any>(null);

    // Calculate currentW/currentH earlier for use in texture logic
    let currentW = input.width_cm || 40;
    let currentH = input.height_cm || 60;

    if (input.frameType === "framed" && input.framedSize) {
        const [d1, d2] = input.framedSize.split('x').map(x => parseInt(x));
        const short = Math.min(d1, d2);
        const long = Math.max(d1, d2);

        if (orientation === 'landscape') { currentW = long; currentH = short; }
        else if (orientation === 'portrait') { currentW = short; currentH = long; }
        else { currentW = short; currentH = short; }
    }

    // --- 3D TEXTURE APPLIER ---
    useEffect(() => {
        const viewer = modelViewerRef.current;
        if (!viewer) return;

        const updateTexture = async () => {
            try {
                const sourceImg = artworkUrl;
                if (!sourceImg) return;

                if (!viewer.model) {
                    await new Promise(resolve => viewer.addEventListener('load', resolve, { once: true }));
                }

                // 1. Load Source Image
                const img = new Image();
                img.crossOrigin = "Anonymous";
                // If it's a local uploaded path, it's fine. If external, might need proxy?
                // Uploaded files are usually relative local paths or blob URLs.
                // activeImage could be external relative path.
                img.src = sourceImg;
                await new Promise((r, e) => { img.onload = r; img.onerror = e; });

                // 2. Crop/Scale Canvas
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                if (!ctx) return;

                const size = 1024;
                canvas.width = size;
                canvas.height = size;

                // 3. Calculate Crop Area based on Zoom & Aspect Ratio
                const targetRatio = currentW / currentH;
                const imgRatio = img.width / img.height;

                let vw, vh;

                // Logic: MATCH ASPECT RATIO of the PRODUCT
                if (targetRatio > imgRatio) {
                    // Target wider -> Fit to Width
                    const baseW = img.width;
                    const baseH = baseW / targetRatio;
                    vw = baseW / textureZoom;
                    vh = baseH / textureZoom;
                } else {
                    // Target taller -> Fit to Height
                    const baseH = img.height;
                    const baseW = baseH * targetRatio;
                    vw = baseW / textureZoom;
                    vh = baseH / textureZoom;
                }

                const sx = (img.width * textureX) - (vw / 2);
                const sy = (img.height * textureY) - (vh / 2);

                // FLIP HORIZONTALLY to fix mirroring issue on 3D model
                ctx.translate(size, 0);
                ctx.scale(-1, 1);

                // Draw transformed crop to square texture (Model UV will stretch it back to correct shape)
                ctx.drawImage(img, sx, sy, vw, vh, 0, 0, size, size);

                const blob = await new Promise<Blob | null>(r => canvas.toBlob(r, 'image/jpeg', 0.9));
                if (!blob) return;

                const finalUrl = URL.createObjectURL(blob);

                // 4. Set Texture
                if (viewer.model) {
                    const texture = await viewer.createTexture(finalUrl);
                    const material = viewer.model.materials[0];

                    if (material && material.pbrMetallicRoughness) {
                        material.pbrMetallicRoughness.baseColorTexture.setTexture(texture);
                    }
                    URL.revokeObjectURL(finalUrl);
                    setIsArtLoaded(true);
                }
            } catch (e) {
                console.error("Texture error:", e);
                setIsArtLoaded(true); // Fail safe to allow interaction even if texture fails
            }
        };

        if (viewMode === '3d') {
            updateTexture();
        } else {
            setIsArtLoaded(false); // Reset if not in 3D mode
        }
    }, [activeImage, artworkUrl, viewMode, textureZoom, textureX, textureY, currentW, currentH]);

    // --- 3D MODEL SELECTION & SCALING ---
    // Definim modelele si dimensiunile lor de baza pentru scalare corecta

    // FOLOSIM Landscape pentru ambele (Portrait si Landscape) si doar il scalam diferit.
    // Asta rezolva problema texturii rotite daca modelul "portrait" avea UV-uri proaste.
    let modelSrc = "/products/canvas/canvas_landscape.glb";
    let baseW = 60;
    let baseH = 40;

    // Dimensions currentW and currentH are already calculated above for texture logic.

    // Calculate dimensions for 3D view based on orientation
    // (Logic moved up)

    // Override pentru specifice
    if (orientation === 'square') {
        modelSrc = "/products/canvas/canvas_patrat.glb";
        baseW = 40;
        baseH = 40;
    }
    // Pentru Portrait si Landscape ramane modelSrc setat initial (landscape.glb)
    // Scaling-ul se va ocupa de forma.

    // Calcul factori scalare - SIMPLIFICAT (fara normalizare vizuala care poate ascunde modelul)
    const scaleX = currentW / baseW;
    const scaleY = currentH / baseH;
    const scaleZ = 1;

    const scaleString = `${scaleX} ${scaleY} ${scaleZ}`;

    // Resetam cheia viewer-ului cand schimbam fisierul sursa ca sa forteze reincarcarea
    const viewerKey = `viewer-${orientation}-${modelSrc}`;

    // Dynamic Camera Orbit Calculation
    // Larger canvases need the camera to be further away to fit in view
    // Base distance ~3m for average canvas. Scale roughly by max dimension ratio.
    const maxDim = Math.max(currentW, currentH);
    // Base 60cm -> ~1m orbit? 
    // Let's approximate: 1.5m is good for 50-60cm.
    // For 150cm (2.5x bigger), we need maybe 2.5m+.
    // Formula: basic_dist + (maxDim / 100)
    // Default model-viewer behavior is "auto", but for scaled objects it might not adapt initial framing perfectly on non-uniform scales.
    // Let's forcefully set 'camera-orbit' if needed, OR just rely on 'min-camera-orbit' to prevent clipping.
    // Actually, 'min-camera-orbit' prevents getting TOO CLOSE.

    // Better approach: Let model-viewer handle "auto" with bounds? 
    // User says "vine prea in fata" (comes too close in front).
    // This usually means the near clipping plane clips it, or it fills screen too much.
    // We can set 'min-field-of-view' or adjust 'camera-orbit'.

    // Let's try dynamic interpolation for radius
    // 40cm -> 1.5m
    // 200cm -> 4m
    const orbitRadius = 1.2 + (maxDim / 60);
    const cameraOrbit = `45deg 55deg ${orbitRadius}m`;

    return (
        <main className="bg-slate-50 dark:bg-slate-800 min-h-screen">
            <Script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js" />

            <div className="container mx-auto px-4 py-8 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* STÂNGA - VIZUAL */}
                    <div className="lg:sticky top-24 h-max space-y-6">
                        <div className="bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-gray-200 dark:border-slate-800 overflow-hidden">

                            {/* Tabs Switcher - ... existing ... */}
                            <div className="flex border-b border-gray-100 overflow-x-auto">
                                <button
                                    onClick={() => setViewMode('gallery')}
                                    className={`flex-1 py-3 min-w-20 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${viewMode === 'gallery' ? 'text-emerald-600 bg-emerald-50 border-b-2 border-emerald-600' : 'text-gray-500 hover:bg-slate-50 dark:bg-slate-800'}`}
                                >
                                    <ImageIcon size={16} /> Galerie
                                </button>
                                <button
                                    onClick={() => setViewMode('3d')}
                                    className={`flex-1 py-3 min-w-20 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${viewMode === '3d' ? 'text-emerald-600 bg-emerald-50 border-b-2 border-emerald-600' : 'text-gray-500 hover:bg-slate-50 dark:bg-slate-800'}`}
                                >
                                    <Box size={16} /> Vedere 3D
                                </button>
                            </div>

                            <div className="aspect-square relative bg-white">
                                {viewMode === 'gallery' ? (
                                    <div className="relative w-full h-full flex items-center justify-center p-4 overflow-hidden">
                                        <div className="relative">
                                            <img src={activeImage} alt="Canvas" className="max-h-full max-w-full object-contain shadow-2xl" />
                                            {input.edge_type === 'white' && (
                                                <>
                                                    {/* Fold marks for white border */}
                                                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-slate-400 -translate-x-1 -translate-y-1"></div>
                                                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-slate-400 translate-x-1 -translate-y-1"></div>
                                                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-slate-400 -translate-x-1 translate-y-1"></div>
                                                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-slate-400 translate-x-1 translate-y-1"></div>
                                                    
                                                    {/* Side marks */}
                                                    <div className="absolute top-1/2 left-0 w-3 h-0.5 bg-slate-400/50 -translate-x-4"></div>
                                                    <div className="absolute top-1/2 right-0 w-3 h-0.5 bg-slate-400/50 translate-x-4"></div>
                                                    <div className="absolute top-0 left-1/2 w-0.5 h-3 bg-slate-400/50 -translate-y-4"></div>
                                                    <div className="absolute bottom-0 left-1/2 w-0.5 h-3 bg-slate-400/50 translate-y-4"></div>

                                                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                                                        Semne Delimitare Pliere
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full h-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center relative group/viewer">
                                        {/* @ts-ignore */}
                                        <model-viewer
                                            key={viewerKey}
                                            ref={modelViewerRef}
                                            src={modelSrc}
                                            alt="Model 3D Tablou Canvas"
                                            shadow-intensity="1"
                                            camera-controls
                                            ar
                                            ar-modes="webxr scene-viewer quick-look"
                                            tone-mapping="neutral"
                                            scale={scaleString}
                                            camera-orbit={cameraOrbit}
                                            min-camera-orbit="auto auto 1m"
                                            max-camera-orbit="auto auto 10m"
                                            style={{ width: '100%', height: '100%' }}
                                        >
                                            <button slot="ar-button" className="absolute bottom-4 left-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-full shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] flex items-center gap-2 transition-transform active:scale-95 z-20">
                                                <Box size={18} />
                                                Vezi în AR
                                            </button>
                                        {/* @ts-ignore */}
                                        </model-viewer>

                                        {!artworkUrl && (
                                            <div className="absolute inset-0 bg-slate-50 dark:bg-slate-800/80 backdrop-blur-[4px] z-30 flex flex-col items-center justify-center p-6 text-center">
                                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-4 text-emerald-600">
                                                    <UploadCloud size={32} />
                                                </div>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Simularea 3D necesită o poză</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-[240px]">
                                                    Încarcă propria ta fotografie pentru a vizualiza tabloul personalizat în 3D și Realitate Augmentată.
                                                </p>
                                                <button
                                                    onClick={() => document.getElementById('photo-upload-input')?.click()}
                                                    className="mt-6 px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] hover:bg-emerald-700 transition-all active:scale-95 text-sm"
                                                >
                                                    ÎNCARCĂ POZA ACUM
                                                </button>
                                            </div>
                                        )}

                                        <button
                                            onClick={() => setShowTextureControls(!showTextureControls)}
                                            className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white backdrop-blur rounded-full border border-gray-200 dark:border-slate-800 shadow-sm z-20 text-gray-600 dark:text-gray-400"
                                            title="Ajustează Imaginea"
                                        >
                                            <Settings2 size={18} />
                                        </button>

                                        {/* QR Code for AR (Mobile Sync) - Visible on Desktop */}
                                        <div className="absolute bottom-4 right-4 z-20 hidden lg:block">
                                            <div className="bg-white/95 backdrop-blur-xl p-3 rounded-2xl border-2 border-emerald-100 shadow-[0_8px_32px_rgba(0,0,0,0.12)] group/qr transition-all hover:scale-105 hover:border-emerald-300">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="bg-white p-1.5 rounded-xl border border-gray-100 shadow-inner">
                                                        <QRCodeSVG
                                                            value={shareUrl}
                                                            size={85}
                                                            level="H"
                                                            includeMargin={false}
                                                            imageSettings={{
                                                                src: "/favicon.ico",
                                                                x: undefined,
                                                                y: undefined,
                                                                height: 14,
                                                                width: 14,
                                                                excavate: true,
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Vezi în AR</div>
                                                        <div className="text-[7px] font-bold text-gray-400 uppercase tracking-tighter">Scan pt. Mobil</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* TEXTURE CONTROLS - PANEL */}
                                        {showTextureControls && (
                                            <div className="absolute top-14 right-4 w-60 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-gray-200 dark:border-slate-800 shadow-xl z-30">
                                                <div className="space-y-4">
                                                    <div>
                                                        <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                                                            <span>Zoom</span>
                                                            <span>{Math.round((textureZoom - 1) * 100)}%</span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min="1"
                                                            max="3"
                                                            step="0.01"
                                                            value={textureZoom}
                                                            onChange={(e) => setTextureZoom(parseFloat(e.target.value))}
                                                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-bold text-gray-500 mb-1 block">Poziție X</label>
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="1"
                                                            step="0.01"
                                                            value={textureX}
                                                            onChange={(e) => setTextureX(parseFloat(e.target.value))}
                                                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-bold text-gray-500 mb-1 block">Poziție Y</label>
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="1"
                                                            step="0.01"
                                                            value={textureY}
                                                            onChange={(e) => setTextureY(parseFloat(e.target.value))}
                                                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                                        />
                                                    </div>
                                                    <div className="pt-2 text-[10px] text-gray-400 text-center leading-tight">
                                                        Ajustează imaginea pentru a încadra corect tabloul și a elimina fundalul din poză.
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* THUMBNAILS - ONLY IN GALLERY MODE */}
                            {viewMode === 'gallery' && (
                                <div className="p-2 grid grid-cols-4 gap-2 border-t border-gray-100 bg-white">
                                    {GALLERY.map((src, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveIndex(i)}
                                            className={`relative rounded-lg aspect-square overflow-hidden border-2 transition-all ${activeIndex === i ? "border-emerald-600 shadow-md" : "border-transparent opacity-70 hover:opacity-100"}`}
                                        >
                                            <img src={src} alt="Miniatura" loading="lazy" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* DREAPTA - CONFIGURATOR */}
                    <div>
                        <header className="mb-6">
                            <div className="flex justify-between items-center gap-4 mb-3">
                                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white">Canvas Personalizat</h2>
                                <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-red-600 text-white font-bold text-xs animate-pulse shadow-md">
                                    🔥 -20% REDUCERE
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Personalizează tabloul în 3 pași simpli.</p>
                                <button type="button" onClick={() => setDetailsOpen(true)} className="inline-flex items-center text-sm px-3 py-1.5 border border-gray-300 rounded hover:bg-slate-50 dark:bg-slate-800 transition-colors text-gray-700 dark:text-gray-300 font-medium">
                                    <Info size={16} /><span className="ml-2">Detalii</span>
                                </button>
                            </div>
                        </header>

                        <div className="bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-gray-200 dark:border-slate-800 px-4 mb-8">
                            <AccordionStep stepNumber={1} title="Tip Tablou" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                                <div className="mb-4">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Selectează tipul</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <OptionButton
                                            active={input.frameType === "framed"}
                                            onClick={() => updateInput("frameType", "framed")}
                                            title="Cu Ramă"
                                            subtitle="Dimensiuni fixe"
                                        />
                                        <OptionButton
                                            active={input.frameType === "none"}
                                            onClick={() => updateInput("frameType", "none")}
                                            title="Fără Ramă"
                                            subtitle="Dimensiuni custom"
                                        />
                                    </div>
                                </div>
                            </AccordionStep>

                            <AccordionStep stepNumber={2} title="Formă & Dimensiuni" summary={summaryStep2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)}>
                                {input.frameType === "framed" && (
                                    <>
                                        <div className="mb-4">
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Formă</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                <button
                                                    onClick={() => { setOrientation('portrait'); updateInput("framedShape", "rectangle"); }}
                                                    className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${orientation === 'portrait' ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-slate-200 hover:border-slate-300'}`}
                                                >
                                                    <div className="w-6 h-8 border-2 border-current rounded-sm"></div>
                                                    <span className="text-xs font-bold">Portret</span>
                                                </button>
                                                <button
                                                    onClick={() => { setOrientation('landscape'); updateInput("framedShape", "rectangle"); }}
                                                    className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${orientation === 'landscape' ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-slate-200 hover:border-slate-300'}`}
                                                >
                                                    <div className="w-8 h-6 border-2 border-current rounded-sm"></div>
                                                    <span className="text-xs font-bold">Landscape</span>
                                                </button>
                                                <button
                                                    onClick={() => { setOrientation('square'); updateInput("framedShape", "square"); }}
                                                    className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${orientation === 'square' ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-slate-200 hover:border-slate-300'}`}
                                                >
                                                    <div className="w-6 h-6 border-2 border-current rounded-sm"></div>
                                                    <span className="text-xs font-bold">Pătrat</span>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Dimensiune</label>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                                {(orientation === "square"
                                                    ? Object.keys(CANVAS_CONSTANTS.FRAMED_PRICES_SQUARE)
                                                    : Object.keys(CANVAS_CONSTANTS.FRAMED_PRICES_RECTANGLE)
                                                ).map((sizeKey) => {
                                                    const [s1, s2] = sizeKey.split('x').map(Number);
                                                    let label = sizeKey;
                                                    if (orientation === 'landscape') {
                                                        label = `${Math.max(s1, s2)}×${Math.min(s1, s2)}`;
                                                    } else if (orientation === 'portrait') {
                                                        label = `${Math.min(s1, s2)}×${Math.max(s1, s2)}`;
                                                    } else {
                                                        label = sizeKey.replace('x', '×');
                                                    }

                                                    return (
                                                        <button
                                                            key={sizeKey}
                                                            type="button"
                                                            onClick={() => updateInput("framedSize", sizeKey)}
                                                            className={`px-3 py-2 rounded-lg border-2 text-xs font-bold transition-all ${input.framedSize === sizeKey
                                                                ? "border-emerald-600 bg-emerald-50 text-emerald-600 shadow-sm"
                                                                : "border-gray-200 dark:border-slate-800 bg-white text-gray-600 dark:text-gray-400 hover:border-gray-300"
                                                                }`}
                                                        >
                                                            {label} cm
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {input.frameType === "none" && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Lățime (cm)</label>
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                value={lengthText}
                                                onFocus={(e) => e.target.select()}
                                                onChange={(e) => handleDimChange(e.target.value, setLengthText, "width_cm")}
                                                placeholder="40"
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Înălțime (cm)</label>
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                value={heightText}
                                                onFocus={(e) => e.target.select()}
                                                onChange={(e) => handleDimChange(e.target.value, setHeightText, "height_cm")}
                                                placeholder="60"
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                            />
                                        </div>
                                    </div>
                                )}

                                <NumberInput label="Cantitate" value={input.quantity} onChange={setQty} step={1} />

                                {input.frameType === "none" && upsellOpportunity && (
                                    <div
                                        className="mt-3 p-3 sm:p-4 bg-emerald-50 border border-emerald-200 rounded-lg cursor-pointer hover:bg-emerald-100 transition-colors flex gap-3 items-center group relative"
                                        onClick={() => updateInput("quantity", upsellOpportunity.requiredQty)}
                                    >
                                        <TrendingUp className="text-emerald-600 w-5 h-5 shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-sm text-emerald-900 font-bold">Reducere de Volum!</p>
                                            <p className="text-xs text-emerald-800 mt-1">
                                                Alege <strong>{upsellOpportunity.requiredQty} buc</strong> și prețul scade la <strong>{formatMoneyDisplay(upsellOpportunity.newUnitPrice)}/buc</strong>.
                                            </p>
                                        </div>
                                        <div className="ml-auto flex flex-col items-end gap-2 shrink-0">
                                            <div className="flex items-center justify-center bg-white rounded-md px-2 py-0.5 shadow-sm border border-emerald-100">
                                                <span className="text-xs font-bold text-emerald-600">-{upsellOpportunity.discountPercent}%</span>
                                            </div>
                                            <button type="button" className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-md font-bold shadow-sm group-hover:bg-emerald-700 transition-colors">
                                                Aplică
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </AccordionStep>

                            <AccordionStep stepNumber={3} title="Grafică" summary={summaryStep3} isOpen={activeStep === 3} onClick={() => setActiveStep(3)} isLast={true}>
                                <div>
                                    {/* Editor Online button removed from here, moved to tabs below */}

                                        <div className="flex -mb-px overflow-x-auto no-scrollbar">
                                            <TabButton active={input.designOption === 'upload'} onClick={() => updateInput("designOption", 'upload')}>Am Foto</TabButton>
                                            <TabButton active={input.designOption === 'pro'} onClick={() => updateInput("designOption", 'pro')}>Colaj / Editare</TabButton>
                                            <Link 
                                                href={`/editor?w=${currentW}&h=${currentH}&product=canvas`}
                                                className="px-4 py-2 text-sm font-bold transition-all rounded-t-lg bg-orange-600 text-white hover:bg-orange-700 flex items-center gap-2 shrink-0 ml-auto"
                                            >
                                                <PencilRuler size={14} />
                                                Editor Online
                                            </Link>
                                        </div>

                                    {input.designOption === 'upload' && (
                                        <div className="space-y-3">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Încarcă fotografia ta (JPG, PNG, TIFF).</p>
                                            <label className="flex flex-col items-center justify-center w-full h-32 px-4 bg-white border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-emerald-400 transition-colors">
                                                <UploadCloud className="w-8 h-8 text-gray-400 mb-1" />
                                                <span className="font-medium text-gray-600 dark:text-gray-400">Încarcă fotografia</span>
                                                <input type="file" id="photo-upload-input" className="hidden" onChange={e => handleArtworkFileInput(e.target.files?.[0] ?? null)} />
                                            </label>
                                            {uploading && <p className="text-sm text-emerald-600 mt-2">Se încarcă...</p>}
                                            {uploadError && <p className="text-sm text-red-600 mt-2">{uploadError}</p>}
                                            {artworkUrl && !uploadError && <p className="text-sm text-green-600 font-semibold mt-2">Grafică încărcată!</p>}
                                            
                                        </div>
                                    )}

                                    {input.designOption === 'pro' && (
                                        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">
                                            <p className="font-semibold">Serviciu de Editare / Colaj</p>
                                            <p>Cost: <strong>{formatMoneyDisplay(CANVAS_CONSTANTS.PRO_DESIGN_FEE)}</strong>. Designerii noștri pot retușa fotografia sau crea un colaj profesional.</p>
                                        </div>
                                    )}
                                </div>
                            </AccordionStep>
                        </div>

                        {/* TOTAL & ADD TO CART */}
                        <div className="static mt-8 z-40 lg:static bg-white/95 backdrop-blur-md lg:bg-white lg:backdrop-blur-none border-t lg:border border-gray-200 dark:border-slate-800 lg:rounded-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] lg:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] p-4 lg:p-6 transition-all">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-2 lg:p-3 mb-4 text-center">
                                <p className="text-red-700 font-bold text-xs sm:text-sm">🎉 Reducere specială 20% aplicată automat!</p>
                            </div>
                            <div className="flex flex-col gap-4">
                                <button onClick={handleAddToCart} className="w-full py-4 text-lg font-bold bg-emerald-600 text-white rounded-xl shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 active:scale-95">
                                    <ShoppingCart size={24} />
                                    Adaugă în Coș
                                </button>

                                <div className="flex flex-row justify-between items-center w-full gap-2 pt-1 mt-1 border-t border-gray-100">
                                    <div className="flex flex-col items-start leading-none">
                                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Preț Total</span>
                                        <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{formatMoneyDisplay(displayedTotal)}</span>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <DeliveryEstimation />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* BUTOANE SECUNDARE - WHATSAPP ȘI CERERE OFERTĂ */}
                        <div className="mt-4 lg:mt-6 bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl border border-slate-200 p-4">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 text-center font-medium">Ai nevoie de ajutor sau o ofertă personalizată?</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <a
                                    href="https://wa.me/40750473111?text=Buna%20ziua,%20ma%20intereseaza%20o%20oferta."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] transition-all duration-200"
                                >
                                    <MessageCircle size={18} />
                                    <span className="text-sm">WhatsApp</span>
                                </a>
                                <button
                                    type="button"
                                    onClick={() => window.location.href = '/contact'}
                                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] transition-all duration-200"
                                >
                                    <Info size={18} />
                                    <span className="text-sm">Cerere Ofertă</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* INFO SECTION */}
                <div className="mt-8 lg:mt-12 bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-gray-200 dark:border-slate-800 overflow-hidden">
                    <nav className="border-b border-gray-200 dark:border-slate-800 flex overflow-x-auto">
                        <TabButtonSEO active={activeProductTab === "descriere"} onClick={() => setActiveProductTab("descriere")}>Descriere</TabButtonSEO>
                        <TabButtonSEO active={activeProductTab === "faq"} onClick={() => setActiveProductTab("faq")}>FAQ</TabButtonSEO>
                    </nav>

                    <div className="p-6 lg:p-8">
                        {activeProductTab === 'descriere' && (
                            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Tablouri Canvas Fine Art</h2>
                                <p className="text-lg leading-relaxed mb-6">
                                    Transformă fotografiile preferate în opere de artă. Tablourile noastre sunt imprimate la rezoluție înaltă pe pânză Canvas Fine Art și întinse manual pe un șasiu solid din lemn.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Materiale & Calitate</h3>
                                        <ul className="space-y-2 list-disc pl-5 text-sm sm:text-base">
                                            <li><strong>Pânză Fine Art:</strong> Mix bumbac-poliester 330g/mp pentru detalii clare.</li>
                                            <li><strong>Șasiu Lemn:</strong> Cadru rezistent din brad, profil 2x4cm.</li>
                                            <li><strong>Margine Oglindită:</strong> Imaginea continuă pe lateral pentru efect 3D (galerie).</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Gata de Agățat</h3>
                                        <p className="text-sm sm:text-base">Fiecare tablou este asamblat manual și include sistemul de prindere pe perete. Primești tabloul gata de expus, fără nicio pregătire suplimentară.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeProductTab === 'faq' && <FaqAccordion qa={productFaqs} />}
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4 lg:px-8 mt-16 mb-24">
                <ProductCarousel title="Design-uri Populare" />
            </div>

            {detailsOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setDetailsOpen(false)}>
                    <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                        <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors" onClick={() => setDetailsOpen(false)} aria-label="Închide"><X size={20} className="text-gray-600 dark:text-gray-400" /></button>
                        <div className="p-8">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Informații Tablouri Canvas</h3>
                            <div className="space-y-6 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">Pânză & Imprimare</h4>
                                    <p>Folosim cerneluri pe bază de apă (Eco-Solvent) sigure pentru interior, care păstrează intensitatea culorilor zeci de ani. Textura pânzei adaugă profunzime oricărei fotografii.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showArAutoLaunch && (
                <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white">
                    <div className="w-24 h-24 bg-emerald-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] mb-8 animate-pulse">
                        <Box size={48} />
                    </div>
                    <h2 className="text-2xl font-black mb-4 uppercase tracking-tighter">Vederea AR este gata!</h2>
                    <p className="text-gray-300 mb-10 max-w-xs text-sm leading-relaxed">
                        {!isArtLoaded ? "Se încarcă și se prelucrează fotografia ta..." : "Am configurat tabloul cu dimensiunea selectată. Apasă pe butonul de mai jos pentru a-l vedea în camera ta."}
                    </p>
                    <button
                        disabled={!isArtLoaded}
                        onClick={() => {
                            setShowArAutoLaunch(false);
                            modelViewerRef.current?.activateAR();
                        }}
                        className={`w-full max-w-xs py-4 font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 text-lg ${!isArtLoaded ? 'bg-gray-600 cursor-not-allowed opacity-50' : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white'}`}
                    >
                        {
                            !isArtLoaded ? <><span className="animate-spin text-xl">⏳</span> Se pregătește...</> : <><Box size={24} /> PORNEȘTE AR</>
                        }
                    </button>
                    <button
                        onClick={() => setShowArAutoLaunch(false)}
                        className="mt-6 text-gray-400 text-xs font-bold hover:text-white transition-colors"
                    >
                        Înapoi la configurator
                    </button>
                </div>
            )}
        </main>
    );
}


