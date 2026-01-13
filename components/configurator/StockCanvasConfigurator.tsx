// @ts-nocheck
"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import {
    ShoppingCart,
    Info,
    Check,
    Truck,
    ShieldCheck,
    ArrowLeft,
    MessageCircle,
    ChevronRight,
    Sparkles,
    Settings2,
    Box,
    Image as ImageIcon
} from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { canvasProducts } from "@/lib/products/canvas-products";
import ProductCarousel from '@/components/ProductCarousel';
import DeliveryEstimation from "./DeliveryEstimation";
import { formatMoneyDisplay } from "@/lib/pricing";
import { TabButtonSEO } from "./ui/TabButtonSEO";
import FaqAccordion from "./FaqAccordion";
import { QA } from "@/types/configurator";
import Reviews from "@/components/Reviews";
import { X } from "lucide-react";

const canvasFaqs: QA[] = [
    { question: "Ce material folosiți pentru tablouri?", answer: "Folosim Canvas Fine Art - pânză realizată prin combinația de bumbac și poliester, 330 g/mp, pentru imprimări de cea mai bună calitate. Materialul nu se cutează iar la tăiere țesătura nu se destramă." },
    { question: "Tabloul vine gata de agățat?", answer: "Da, pânza este întinsă pe un șasiu din lemn uscat, cu margine oglindită (imaginea continuă pe laterale). Tabloul include sistem de prindere și este gata de pus pe perete imediat ce îl scoateți din cutie." },
    { question: "Pânza se decolorează în timp?", answer: "Nu, folosim tehnologie de printare HD cu cerneluri rezistente la UV. Culorile rămân vibrante zeci de ani dacă tabloul este expus în interior." },
    { question: "Pot curăța tabloul?", answer: "Pânza poate fi ștearsă ușor de praf cu o lavetă uscată sau foarte puțin umezită cu apă. Nu folosiți substanțe chimice sau detergenți abrazivi." },
];

interface Props {
    productSlug: string;
}

export default function StockCanvasConfigurator({ productSlug }: Props) {
    const { addItem } = useCart();
    const searchParams = useSearchParams();

    const product = useMemo(() => {
        return canvasProducts.find(p => p.slug === productSlug);
    }, [productSlug]);

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold">Produsul nu a fost găsit.</h2>
                <Link href="/shop/canvas" className="text-emerald-600 hover:underline mt-4 inline-block">
                    Înapoi la colecție
                </Link>
            </div>
        );
    }

    // Precise Dimension Lists by Orientation (Using User's Preferred Order)
    const PORTRAIT_DIMENSIONS = ["40x50 cm", "50x70 cm", "60x90 cm", "90x120 cm"];
    const LANDSCAPE_DIMENSIONS = ["50x40 cm", "70x50 cm", "90x60 cm", "120x90 cm"];
    const SQUARE_DIMENSIONS = ["40x40 cm", "60x60 cm", "80x80 cm", "100x100 cm"];
    const PANORAMIC_DIMENSIONS = ["30x60 cm", "40x80 cm", "50x100 cm", "60x120 cm"];

    // Detect Orientation from Product Data
    const isLandscapeProduct = product.orientation === 'Landscape' || product.orientation === 'Quer';
    const isPortraitProduct = product.orientation === 'Portret' || product.orientation === 'Portrait' || product.orientation === 'Hoch';
    const isSquareProduct = product.orientation === 'Pătrat' || product.orientation === 'square';
    const isPanoramicProduct = product.orientation === 'Panoramic';

    // Determine available dimensions based STRICTLY on explicit orientation
    const availableDimensions = useMemo(() => {
        if (isPanoramicProduct) return PANORAMIC_DIMENSIONS;
        if (isSquareProduct) return SQUARE_DIMENSIONS;
        if (isLandscapeProduct) return LANDSCAPE_DIMENSIONS;
        if (isPortraitProduct) return PORTRAIT_DIMENSIONS;

        // Fallback for Standard or Undetected: check first dimension of product if exists
        if (product.dimensions && product.dimensions.length > 0) {
            const d = product.dimensions[0].toLowerCase();
            if (d.includes('x')) {
                const [w, h] = d.split('x').map(s => parseInt(s.replace(/\D/g, '')));
                if (w === h) return SQUARE_DIMENSIONS;
                if (w > h * 1.8) return PANORAMIC_DIMENSIONS;
                if (w > h) return LANDSCAPE_DIMENSIONS;
            }
        }
        return PORTRAIT_DIMENSIONS; // Default fallback
    }, [isLandscapeProduct, isPortraitProduct, isSquareProduct, isPanoramicProduct, product.dimensions]);

    // State for selection - initialize with first available
    const [selectedDimension, setSelectedDimension] = useState<string>(availableDimensions[0]);

    // Lookup Table for Prices (as requested by user)
    const priceRON = useMemo(() => {
        const dimStr = selectedDimension.toLowerCase().replace(' cm', '');

        // standard (Portrait & Landscape)
        if (isPortraitProduct || isLandscapeProduct) {
            // M, L, XL, XXL
            if (dimStr === "50x40" || dimStr === "40x50") return 119;
            if (dimStr === "70x50" || dimStr === "50x70") return 169;
            if (dimStr === "90x60" || dimStr === "60x90" || dimStr === "90x70" || dimStr === "70x90") return 269;
            if (dimStr === "120x90" || dimStr === "90x120") return 389;
        }

        // Square
        if (isSquareProduct) {
            if (dimStr === "40x40") return 109;
            if (dimStr === "60x60") return 189;
            if (dimStr === "80x80") return 279;
            if (dimStr === "100x100") return 349;
        }

        // Panoramic
        if (isPanoramicProduct) {
            if (dimStr === "30x60") return 129;
            if (dimStr === "40x80") return 189;
            if (dimStr === "50x100") return 289;
            if (dimStr === "60x120") return 339;
        }

        return 249; // Global standard fallback
    }, [selectedDimension, isPortraitProduct, isLandscapeProduct, isSquareProduct, isPanoramicProduct]);

    // Sync selection if list changes
    useEffect(() => {
        if (!availableDimensions.includes(selectedDimension)) {
            setSelectedDimension(availableDimensions[0]);
        }
    }, [availableDimensions, selectedDimension]);

    const shareUrl = useMemo(() => {
        if (typeof window === 'undefined') return '';
        const url = new URL(`${window.location.origin}/shop/canvas/${productSlug}`);
        url.searchParams.set('dim', selectedDimension);
        url.searchParams.set('autoAr', 'true');
        return url.toString();
    }, [selectedDimension, productSlug]);

    useEffect(() => {
        const dim = searchParams.get('dim');
        const autoAr = searchParams.get('autoAr');

        if (dim && availableDimensions.includes(dim)) {
            setSelectedDimension(dim);
        }

        if (autoAr === 'true') {
            setViewMode('3d');
            // Scroll to top/viewer might be useful if page is long
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [searchParams, availableDimensions]);

    const [quantity, setQuantity] = useState(1);
    const [viewMode, setViewMode] = useState<'gallery' | '3d'>('gallery');
    const [activeProductTab, setActiveProductTab] = useState<'descriere' | 'reviews' | 'faq'>('descriere');

    // 3D Visual Logic
    const modelViewerRef = useRef<any>(null);
    const [textureZoom, setTextureZoom] = useState(
        isPanoramicProduct ? 1.20 :
            isPortraitProduct ? 1.25 :
                isLandscapeProduct ? 1.20 :
                    1.25
    );

    // Sync zoom when orientation changes
    useEffect(() => {
        if (isPanoramicProduct) setTextureZoom(1.20);
        else if (isPortraitProduct) setTextureZoom(1.25);
        else if (isLandscapeProduct) setTextureZoom(1.20);
        else setTextureZoom(1.25);
    }, [isPanoramicProduct, isPortraitProduct, isLandscapeProduct]);
    const [textureX, setTextureX] = useState(0.5);
    const [textureY, setTextureY] = useState(0.5);
    const [showTextureControls, setShowTextureControls] = useState(false);
    const [isTextureLoaded, setIsTextureLoaded] = useState(false);

    // Determine Orientation for Model from Image
    const [isLandscapeImage, setIsLandscapeImage] = useState(true);

    useEffect(() => {
        const check = async () => {
            const img = new Image();
            img.src = `/api/proxy-image?url=${encodeURIComponent(product.image)}`;
            img.onload = () => {
                setIsLandscapeImage(img.width >= img.height);
            };
        };
        check();
    }, [product.image]);

    // Calculate Physical Display Dimensions for 3D
    const [currentW, currentH] = useMemo(() => {
        const match = selectedDimension.match(/(\d+)[x×](\d+)/);
        if (match) {
            return [parseInt(match[1]), parseInt(match[2])];
        }
        return [40, 60];
    }, [selectedDimension]);

    // Adjust for visual representation (swap if needed)
    const dSmall = Math.min(currentW, currentH);
    const dBig = Math.max(currentW, currentH);

    let displayW = dSmall;
    let displayH = dBig; // Default Portrait layout

    if (Math.abs(dSmall - dBig) < 1) {
        displayW = dSmall;
        displayH = dSmall;
    } else {
        // Priority orientation check
        if (isLandscapeProduct || isPanoramicProduct) {
            displayW = dBig;
            displayH = dSmall;
        } else if (isPortraitProduct) {
            displayW = dSmall;
            displayH = dBig;
        } else {
            // Fallback to image aspect ratio if no explicit orientation
            if (isLandscapeImage) {
                displayW = dBig;
                displayH = dSmall;
            } else {
                displayW = dSmall;
                displayH = dBig;
            }
        }
    }

    // Select Model - Using New Stock Specific Variants - NEED TO ENSURE MODELS EXIST IN TABLOU (/public/products/canvas/)
    // Assuming user will copy them or they exist. If not, this will show error. User said "fix cum avem la shopprint".
    // Select Model - Using available models in tablou public folder
    let modelSrc = "/products/canvas/canvas_landscape.glb";
    let baseW = 60;
    let baseH = 40;

    if (Math.abs(displayW - displayH) < 1) {
        modelSrc = "/products/canvas/canvas_patrat.glb";
        baseW = 40;
        baseH = 40;
    } else if (isPanoramicProduct) {
        // Fallback to landscape as panoramic model is missing
        modelSrc = "/products/canvas/canvas_landscape.glb";
        baseW = 60;
        baseH = 40;
    } else if (displayH > displayW) {
        modelSrc = "/products/canvas/canvas_portret.glb";
        baseW = 40;
        baseH = 60;
    } else {
        modelSrc = "/products/canvas/canvas_landscape.glb";
        baseW = 60;
        baseH = 40;
    }

    const scaleX = displayW / baseW;
    const scaleY = displayH / baseH;
    const scaleString = `${scaleX} ${scaleY} 1`;
    const viewerKey = `viewer-${modelSrc}-${selectedDimension}-${isLandscapeImage}`;

    // Camera Orbit
    const maxDim = Math.max(displayW, displayH);
    const orbitRadius = 1.2 + (maxDim / 60);
    const cameraOrbit = `45deg 55deg ${orbitRadius}m`;

    const activeW = displayW;
    const activeH = displayH;

    // --- 3D TEXTURE APPLIER ---
    useEffect(() => {
        if (viewMode === '3d') {
            calculateAndApplyTexture(activeW, activeH);
        }
    }, [product.image, viewMode, viewerKey, textureZoom, textureX, textureY, activeW, activeH]);

    const calculateAndApplyTexture = async (targetW: number, targetH: number) => {
        const viewer = modelViewerRef.current;
        if (!viewer) return;

        try {
            // Use direct url if possible, or simple proxy if needed. 
            // In tablou, images might be on R2? product.image is full URL.
            // If CORS issue, use proxy. Shopprint used /api/proxy-image.
            // I'll assume direct access or I need to create proxy-image route?
            // To be safe, I'll use product.image directly first. If CORS fails, user will notify.
            // Use proxy to avoid CORS issues
            const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(product.image)}`;
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = proxyUrl;
            await new Promise((r, j) => { img.onload = r; img.onerror = j; });

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const size = 1024;
            canvas.width = size;
            canvas.height = size;

            const targetRatio = targetW / targetH;
            const imgRatio = img.width / img.height;

            let vw, vh;

            if (targetRatio > imgRatio) {
                const baseW = img.width;
                const baseH = baseW / targetRatio;
                vw = baseW / textureZoom;
                vh = baseH / textureZoom;
            } else {
                const baseH = img.height;
                const baseW = baseH * targetRatio;
                vw = baseW / textureZoom;
                vh = baseH / textureZoom;
            }

            const sx = (img.width * textureX) - (vw / 2);
            const sy = (img.height * textureY) - (vh / 2);

            ctx.save();
            ctx.translate(size / 2, size / 2);

            if (targetH > targetW) {
                ctx.rotate(-Math.PI / 2);
            }

            ctx.scale(-1, 1);
            ctx.drawImage(img, sx, sy, vw, vh, -size / 2, -size / 2, size, size);
            ctx.restore();

            const blob = await new Promise<Blob | null>(r => canvas.toBlob(r, 'image/jpeg', 0.9));
            if (!blob) return;

            const croppedUrl = URL.createObjectURL(blob);

            if (!viewer.model) {
                await new Promise(resolve => viewer.addEventListener('load', resolve, { once: true }));
            }

            const texture = await viewer.createTexture(croppedUrl);
            const material = viewer.model.materials[0];
            if (material) {
                material.pbrMetallicRoughness.baseColorTexture.setTexture(texture);
            }
            URL.revokeObjectURL(croppedUrl);
            setIsTextureLoaded(true);

        } catch (e) {
            console.error("Crop error:", e);
            setIsTextureLoaded(true); // Failsafe
        }
    }

    const totalPrice = priceRON * quantity;

    const handleAddToCart = () => {
        addItem({
            id: `stock-${product.id}-${Date.now()}`,
            productId: product.id,
            title: product.title,
            price: priceRON,
            quantity: quantity,
            metadata: {
                "Dimensiune": selectedDimension,
                "Material": product.material,
                "Imagine": product.image,
                "Tip": "Produs din Stoc"
            }
        });
        // Remove alert, toast is handled in CartContext usually
    };

    return (
        <div className="bg-white min-h-screen pb-20">
            <Script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js" />

            <div className="container mx-auto px-4 py-4">
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Link href="/" className="hover:text-emerald-600">Home</Link>
                    <ChevronRight size={14} />
                    <Link href="/shop/canvas" className="hover:text-emerald-600">Colecție Canvas</Link>
                    <ChevronRight size={14} />
                    <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.title}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* LEFT COLUMN - VIEWER */}
                    <div className="lg:sticky lg:top-24 h-max space-y-4">
                        <div className="pb-4 border-b border-gray-100">
                            <div className="flex border-b border-gray-100 bg-gray-50/50">
                                <button
                                    onClick={() => setViewMode('gallery')}
                                    className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${viewMode === 'gallery' ? 'text-emerald-600 bg-white border-b-2 border-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <ImageIcon size={18} /> Foto
                                </button>
                                <button
                                    onClick={() => setViewMode('3d')}
                                    className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${viewMode === '3d' ? 'text-emerald-600 bg-white border-b-2 border-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <Box size={18} /> 3D Preview
                                </button>
                            </div>

                            <div className="aspect-[4/5] sm:aspect-square relative bg-white">
                                {viewMode === 'gallery' ? (
                                    <div className="w-full h-full relative group">
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-white/90 backdrop-blur-md text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5 border border-emerald-100">
                                                <Sparkles size={14} />
                                                CALITATE PREMIUM
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full h-full bg-slate-50 flex items-center justify-center relative group/viewer">
                                        <model-viewer
                                            key={viewerKey}
                                            ref={modelViewerRef}
                                            src={modelSrc}
                                            poster={product.image}
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
                                            <button
                                                slot="ar-button"
                                                disabled={!isTextureLoaded}
                                                className={`absolute bottom-4 left-4 font-bold py-2 px-4 rounded-full shadow-lg flex items-center gap-2 transition-transform active:scale-95 z-20 ${!isTextureLoaded ? 'bg-gray-400 cursor-not-allowed opacity-70 text-gray-100' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
                                            >
                                                {!isTextureLoaded ? <span className="animate-spin text-lg">⏳</span> : <Box size={18} />}
                                                {isTextureLoaded ? 'Vezi în AR' : 'Se încarcă...'}
                                            </button>
                                        </model-viewer>

                                        <button
                                            onClick={() => setShowTextureControls(!showTextureControls)}
                                            className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white backdrop-blur rounded-full border border-gray-200 shadow-sm z-20 text-gray-600"
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

                                        {showTextureControls && (
                                            <div className="absolute top-14 right-4 w-60 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-gray-200 shadow-xl z-30">
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
                                                        <label className="text-xs font-bold text-gray-500 mb-1 block">Poziție X ({textureX.toFixed(2)})</label>
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
                                                        <label className="text-xs font-bold text-gray-500 mb-1 block">Poziție Y ({textureY.toFixed(2)})</label>
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
                                                        Ajustează imaginea pentru a încadra corect tabloul.
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN - CONFIGURATOR */}
                    <div>
                        <header className="mb-6">
                            <div className="flex justify-between items-center gap-4 mb-3">
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                                    {product.title}
                                </h1>
                                <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-red-600 text-white font-bold text-[10px] sm:text-xs animate-pulse shadow-md whitespace-nowrap">
                                    🔥 -20% REDUCERE
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-gray-600 text-sm">
                                    Tablou Canvas Premium - Gata de expus
                                </p>
                                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded">
                                    <Check size={14} /> În stoc
                                </span>
                            </div>
                        </header>

                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8 space-y-8">
                            {/* Preț */}
                            <div className="pb-6 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                                <span className="text-4xl font-black text-emerald-600 tracking-tighter">
                                    {formatMoneyDisplay(totalPrice)}
                                </span>
                                <Link
                                    href="/canvas"
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors border border-emerald-100 group"
                                >
                                    <Sparkles size={14} className="text-yellow-500 group-hover:scale-110 transition-transform" />
                                    VREI CU POZA TA?
                                </Link>
                            </div>

                            {/* Dimensiuni */}
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-gray-900 uppercase tracking-widest flex justify-between">
                                    <span>Alege Dimensiunea</span>
                                    <span className="text-[10px] text-gray-400 normal-case font-medium">Selectează mărimea dorită</span>
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {availableDimensions.map((dim, idx) => {
                                        const labels = ["M", "L", "XL", "XXL"];
                                        return (
                                            <button
                                                key={dim}
                                                onClick={() => setSelectedDimension(dim)}
                                                className={`relative py-4 px-4 rounded-xl border-2 font-bold transition-all flex flex-col items-center justify-center gap-1 ${selectedDimension === dim
                                                    ? "border-emerald-600 bg-emerald-50 text-emerald-600 shadow-sm"
                                                    : "border-gray-100 bg-white text-gray-600 hover:border-gray-200"}`}
                                            >
                                                <span className="text-[10px] uppercase tracking-widest opacity-60">Mărimea {labels[idx]}</span>
                                                <span className="text-sm">{dim}</span>
                                                {selectedDimension === dim && (
                                                    <div className="absolute -top-2 -right-2 bg-emerald-600 text-white rounded-full p-0.5 shadow-sm">
                                                        <Check size={12} />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Cantitate */}
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-gray-900 uppercase tracking-widest">
                                    Cantitate
                                </label>
                                <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-200 w-max">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg transition-colors text-gray-600 font-bold"
                                    >
                                        -
                                    </button>
                                    <span className="w-12 text-center font-bold text-gray-900">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg transition-colors text-gray-600 font-bold"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Butoane Acțiune */}
                            <div className="space-y-4 pt-4">
                                <button
                                    onClick={handleAddToCart}
                                    className="w-full py-4 text-lg font-bold bg-blue-600 text-white rounded-xl shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-95"
                                >
                                    <ShoppingCart size={24} />
                                    Adaugă în Coș
                                </button>

                                <div className="mt-4 lg:mt-6 bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl border border-slate-200 p-4">
                                    <p className="text-xs text-gray-600 mb-3 text-center font-medium">Ai nevoie de ajutor sau o ofertă personalizată?</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <a
                                            href={`https://wa.me/40750473111?text=Buna%20ziua,%20ma%20intereseaza%20produsul%20${encodeURIComponent(product.title)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                                        >
                                            <MessageCircle size={18} />
                                            <span className="text-sm">WhatsApp</span>
                                        </a>
                                        <Link
                                            href="/contact"
                                            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                                        >
                                            <Info size={18} />
                                            <span className="text-sm">Întreabă</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center shrink-0">
                                        <Truck size={20} className="text-emerald-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-900">Livrare Rapidă</h4>
                                        <p className="text-[10px] text-gray-500"><DeliveryEstimation /></p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                                        <ShieldCheck size={20} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-900">Calitate Premium</h4>
                                        <p className="text-[10px] text-gray-500">Pânză Fine Art {product.material}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* INFO SECTION - Tabbed Layout (Now Full Width) */}
                <div className="mt-8 lg:mt-16 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <nav className="border-b border-gray-200 flex overflow-x-auto">
                        <TabButtonSEO active={activeProductTab === "descriere"} onClick={() => setActiveProductTab("descriere")}>Descriere</TabButtonSEO>
                        <TabButtonSEO active={activeProductTab === "reviews"} onClick={() => setActiveProductTab("reviews")}>Recenzii</TabButtonSEO>
                        <TabButtonSEO active={activeProductTab === "faq"} onClick={() => setActiveProductTab("faq")}>FAQ</TabButtonSEO>
                    </nav>

                    <div className="p-6 lg:p-8">
                        {activeProductTab === 'descriere' && (
                            <div className="prose max-w-none text-gray-700">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wider">Detalii Produs</h3>
                                <div className="whitespace-pre-line leading-relaxed mb-8">
                                    {product.description || product.descriptionOriginal || "Nu există descriere pentru acest produs."}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 pt-8">
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-4">Materiale & Calitate</h4>
                                        <ul className="space-y-3">
                                            <li className="flex gap-2">
                                                <Check size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                                                <span>Printare HD rezistentă la UV (nu se decolorează)</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <Check size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                                                <span>Întins manual pe șasiu din lemn natural de brad (profil 2 cm)</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <Check size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                                                <span>Margine oglindită - imaginea continuă pe laterale</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-4">Servicii Incluse</h4>
                                        <ul className="space-y-3">
                                            <li className="flex gap-2">
                                                <Check size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                                                <span>Verificare manuală a fișierului</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <Check size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                                                <span>Include sistem de prindere profesional</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <Check size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                                                <span>Lăcuire ecologică pentru protece sporită</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeProductTab === 'reviews' && (
                            <Reviews productSlug={product.slug} />
                        )}

                        {activeProductTab === 'faq' && (
                            <FaqAccordion qa={canvasFaqs} />
                        )}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-16 pb-20">
                <ProductCarousel title="Alte modele similare" currentSlug={productSlug} />
            </div>
        </div>
    );
}
