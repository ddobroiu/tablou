"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import {
    ShoppingCart, Info, Check, Truck, ShieldCheck, ArrowLeft,
    MessageCircle, ChevronRight, Sparkles, Settings2, Box, Image as ImageIcon
} from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import ProductCarousel from '@/components/ProductCarousel';
import DeliveryEstimation from "./DeliveryEstimation";
import { formatMoneyDisplay } from "@/lib/pricing";
import { TabButtonSEO } from "./ui/TabButtonSEO";
import FaqAccordion from "./FaqAccordion";
import { QA } from "@/types";
import Reviews from "@/components/Reviews";
import ProductJsonLd from "@/components/ProductJsonLd";

// Product data import
import { acrylicProducts } from "../../lib/products/acrylic-products";

const acrylicFaqs: QA[] = [
    { question: "Ce este sticla acrilică?", answer: "Sticla acrilică (plexiglass) este un material premium care oferă o claritate superioară sticlei clasice, fiind în același timp mult mai ușoară și rezistentă la impact." },
    { question: "Tabloul vine gata de agățat?", answer: "Da, tablourile pe sticlă acrilică vin cu un sistem de prindere invizibil montat pe spate, care oferă un efect de 'plutire' pe perete." },
    { question: "Cum se curăță tabloul?", answer: "Se recomandă curățarea cu o lavetă din microfibră moale și apă sau soluții speciale pentru plastic. Evitați alcoolul sau substanțele abrazive." },
    { question: "Culorile sunt rezistente?", answer: "Da, imprimarea se face direct pe spatele sticlei acrilice folosind tehnologie UV de ultimă generație, asigurând rezistență totală la decolorare." },
];

interface Props {
    productSlug: string;
}

export default function StockAcrylicConfigurator({ productSlug }: Props) {
    const { addItem } = useCart();

    // Fallback product if not found
    const product = useMemo(() => {
        const rawProduct = acrylicProducts.find((p: any) => p.slug === productSlug);
        if (!rawProduct) return null;

        return {
            ...rawProduct,
            title: rawProduct.title.replace(/DOTCOMCANVAS®/g, '').trim()
        };
    }, [productSlug]);

    const PREMIUM_DESCRIPTION = `Transformă-ți spațiul într-o galerie de artă modernă cu acest tablou premium pe sticlă acrilică (plexiglass) de 3mm. Datorită tehnologiei de imprimare UV direct la sursă, imaginea prinde viață cu o profunzime incredibilă și culori extrem de vibrante.

Caracteristici Principale:
• Efect de profunzime: Grosimea sticlei oferă un aspect luxos și modern.
• Culori HD Ultra-Vibrante: Tehnologie de imprimare de ultimă generație pentru detalii perfecte.
• Rezistență Totală: Material rezistent la raze UV (nu se decolorează) și la umiditate.
• Gata de montat: Vine cu un sistem de prindere invizibil pe spate care oferă un efect spectaculos de "plutire" pe perete.

Ideal pentru livinguri moderne, birouri sau spații comerciale elegante, acest tablou este o piesă centrală de design care va atrage toate privirile.`;

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold">Produsul nu a fost găsit.</h2>
                <Link href="/shop/acrylic" className="text-indigo-600 hover:underline mt-4 inline-block">
                    Înapoi la colecție
                </Link>
            </div>
        );
    }

    const PORTRAIT_DIMENSIONS = ["40x50 cm", "50x70 cm", "60x90 cm", "90x120 cm"];
    const LANDSCAPE_DIMENSIONS = ["50x40 cm", "70x50 cm", "90x60 cm", "120x90 cm"];
    const SQUARE_DIMENSIONS = ["40x40 cm", "60x60 cm", "80x80 cm", "100x100 cm"];
    const PANORAMIC_DIMENSIONS = ["30x60 cm", "40x80 cm", "50x100 cm", "60x120 cm"];

    const isLandscapeProduct = product.orientation === 'Landscape' || product.orientation === 'Quer';
    const isPortraitProduct = product.orientation === 'Portret' || product.orientation === 'Portrait' || product.orientation === 'Hoch';
    const isSquareProduct = product.orientation === 'Pătrat' || product.orientation === 'square';
    const isPanoramicProduct = product.orientation === 'Panoramic';

    const availableDimensions = useMemo(() => {
        if (isPanoramicProduct) return PANORAMIC_DIMENSIONS;
        if (isSquareProduct) return SQUARE_DIMENSIONS;
        if (isLandscapeProduct) return LANDSCAPE_DIMENSIONS;
        if (isPortraitProduct) return PORTRAIT_DIMENSIONS;

        if (product.dimensions && product.dimensions.length > 0) {
            const d = product.dimensions[0].toLowerCase();
            if (d.includes('x')) {
                const [w, h] = d.split('x').map((s: any) => parseInt(s.replace(/\D/g, '')));
                if (w === h) return SQUARE_DIMENSIONS;
                if (w > h * 1.8) return PANORAMIC_DIMENSIONS;
                if (w > h) return LANDSCAPE_DIMENSIONS;
            }
        }
        return PORTRAIT_DIMENSIONS;
    }, [isLandscapeProduct, isPortraitProduct, isSquareProduct, isPanoramicProduct, product.dimensions]);

    const [selectedDimension, setSelectedDimension] = useState<string>(availableDimensions[0]);

    const priceRON = useMemo(() => {
        const dimStr = selectedDimension.toLowerCase().replace(' cm', '');
        if (isPortraitProduct || isLandscapeProduct) {
            if (dimStr === "50x40" || dimStr === "40x50") return 189;
            if (dimStr === "70x50" || dimStr === "50x70") return 249;
            if (dimStr === "90x60" || dimStr === "60x90") return 299;
            if (dimStr === "120x90" || dimStr === "90x120") return 389;
        }
        if (isSquareProduct) {
            if (dimStr === "40x40") return 169;
            if (dimStr === "60x60") return 239;
            if (dimStr === "80x80") return 289;
            if (dimStr === "100x100") return 369;
        }
        if (isPanoramicProduct) {
            if (dimStr === "30x60") return 179;
            if (dimStr === "40x80") return 269;
            if (dimStr === "50x100") return 289;
            if (dimStr === "60x120") return 349;
        }
        return 399;
    }, [selectedDimension, isPortraitProduct, isLandscapeProduct, isSquareProduct, isPanoramicProduct]);

    useEffect(() => {
        if (!availableDimensions.includes(selectedDimension)) {
            setSelectedDimension(availableDimensions[0]);
        }
    }, [availableDimensions, selectedDimension]);

    const shareUrl = useMemo(() => {
        if (typeof window === 'undefined') return '';
        const url = new URL(`${window.location.origin}/acrylic-product/${productSlug}`);
        url.searchParams.set('dim', selectedDimension);
        url.searchParams.set('autoAr', 'true');
        return url.toString();
    }, [selectedDimension, productSlug]);

    const [quantity, setQuantity] = useState(1);
    const [viewMode, setViewMode] = useState<'gallery' | '3d'>('gallery');
    const [activeProductTab, setActiveProductTab] = useState<'descriere' | 'reviews' | 'faq'>('descriere');

    const modelViewerRef = useRef<any>(null);
    const [isTextureLoaded, setIsTextureLoaded] = useState(false);
    const [showTextureControls, setShowTextureControls] = useState(false);
    const [textureZoom, setTextureZoom] = useState(1.25);
    const [textureX, setTextureX] = useState(0.5);
    const [textureY, setTextureY] = useState(0.5);

    useEffect(() => {
        if (isPanoramicProduct) setTextureZoom(1.20);
        else if (isPortraitProduct) setTextureZoom(1.25);
        else if (isLandscapeProduct) setTextureZoom(1.20);
        else setTextureZoom(1.25);
    }, [isPanoramicProduct, isPortraitProduct, isLandscapeProduct]);

    const [currentW, currentH] = useMemo(() => {
        const match = selectedDimension.match(/(\d+)[x×](\d+)/);
        if (match) {
            return [parseInt(match[1]), parseInt(match[2])];
        }
        return [40, 60];
    }, [selectedDimension]);

    const dSmall = Math.min(currentW, currentH);
    const dBig = Math.max(currentW, currentH);
    let displayW = dSmall;
    let displayH = dBig;

    if (Math.abs(dSmall - dBig) < 1) {
        displayW = dSmall; displayH = dSmall;
    } else {
        if (isLandscapeProduct || isPanoramicProduct) { displayW = dBig; displayH = dSmall; }
        else { displayW = dSmall; displayH = dBig; }
    }

    let modelSrc = "/products/materiale/plexiglass/sticla_landscape_stoc.glb";
    let baseW = 60; let baseH = 40;

    if (Math.abs(displayW - displayH) < 1) {
        modelSrc = "/products/canvas/canvas_patrat_stoc.glb";
        baseW = 40; baseH = 40;
    } else if (isPanoramicProduct) {
        modelSrc = "/products/canvas/canvas_panoramic_stoc.glb";
        baseW = 60; baseH = 30;
    } else if (displayH > displayW) {
        modelSrc = "/products/canvas/canvas_portret_stoc.glb";
        baseW = 40; baseH = 60;
    } else {
        modelSrc = "/products/materiale/plexiglass/sticla_landscape_stoc.glb";
        baseW = 60; baseH = 40;
    }

    const scaleX = displayW / baseW;
    const scaleY = displayH / baseH;
    const scaleString = `${scaleX} ${scaleY} 1`;
    const viewerKey = `viewer-acrylic-${modelSrc}-${selectedDimension}`;

    useEffect(() => {
        if (viewMode === '3d') {
            calculateAndApplyTexture(displayW, displayH);
        }
    }, [product.image, viewMode, viewerKey, displayW, displayH, textureZoom, textureX, textureY]);

    const calculateAndApplyTexture = async (targetW: number, targetH: number) => {
        const viewer = modelViewerRef.current;
        if (!viewer) return;
        try {
            const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(product.image)}`;
            const img = new Image(); img.crossOrigin = "Anonymous"; img.src = proxyUrl;
            await new Promise(r => img.onload = r);
            const canvas = document.createElement("canvas"); const ctx = canvas.getContext("2d");
            if (!ctx) return;
            const size = 1024; canvas.width = size; canvas.height = size;
            const targetRatio = targetW / targetH; const imgRatio = img.width / img.height;
            let vw, vh;
            if (targetRatio > imgRatio) { const bW = img.width; const bH = bW / targetRatio; vw = bW / textureZoom; vh = bH / textureZoom; }
            else { const bH = img.height; const bW = bH * targetRatio; vw = bW / textureZoom; vh = bH / textureZoom; }
            const sx = (img.width * textureX) - (vw / 2); const sy = (img.height * textureY) - (vh / 2);
            ctx.save(); ctx.translate(size / 2, size / 2);
            if (targetH > targetW) ctx.rotate(-Math.PI / 2);
            ctx.scale(-1, 1);
            ctx.drawImage(img, sx, sy, vw, vh, -size / 2, -size / 2, size, size);
            ctx.restore();
            const blob = await new Promise<Blob | null>(r => canvas.toBlob(r, 'image/jpeg', 0.9));
            if (!blob) return;
            const croppedUrl = URL.createObjectURL(blob);
            if (!viewer.model) await new Promise(resolve => viewer.addEventListener('load', resolve, { once: true }));
            const texture = await viewer.createTexture(croppedUrl);
            const material = viewer.model.materials[0];
            if (material) material.pbrMetallicRoughness.baseColorTexture.setTexture(texture);
            URL.revokeObjectURL(croppedUrl); setIsTextureLoaded(true);
        } catch (e) {
            console.error("3D Texture error:", e); setIsTextureLoaded(true);
        }
    };

    const maxDim = Math.max(displayW, displayH);
    const orbitRadius = 1.2 + (maxDim / 60);
    const cameraOrbit = `45deg 55deg ${orbitRadius}m`;
    const totalPrice = priceRON * quantity;
    const handleAddToCart = () => {
        addItem({
            id: `stock-acrylic-${product.id}-${Date.now()}`, productId: product.id, title: product.title, price: priceRON, quantity: quantity,
            metadata: { "Dimensiune": selectedDimension, "Material": "Sticlă Acrilică 3mm", "Imagine": product.image, "Tip": "Sticlă Acrilică" }
        });
        alert("Produs adăugat în coș!");
    };

    return (
        <div className="bg-white min-h-screen pb-20">
            <ProductJsonLd name={product.title} description={PREMIUM_DESCRIPTION} image={product.image} price={priceRON} sku={product.id} url={shareUrl} />
            <Script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js" />
            <div className="container mx-auto px-4 py-4">
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Link href="/" className="hover:text-indigo-600">Home</Link>
                    <ChevronRight size={14} />
                    <Link href="/shop/acrylic" className="hover:text-indigo-600">Shop / Sticlă Acrilică</Link>
                    <ChevronRight size={14} />
                    <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.title}</span>
                </nav>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    <div className="lg:sticky lg:top-24 h-max space-y-4">
                        <div className="pb-4 border-b border-gray-100">
                            <div className="flex border-b border-gray-100 bg-gray-50/50">
                                <button onClick={() => setViewMode('gallery')} className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${viewMode === 'gallery' ? 'text-indigo-600 bg-white border-b-2 border-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                                    <ImageIcon size={18} /> Foto
                                </button>
                                <button onClick={() => setViewMode('3d')} className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${viewMode === '3d' ? 'text-indigo-600 bg-white border-b-2 border-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                                    <Box size={18} /> 3D Preview
                                </button>
                            </div>
                            <div className="aspect-[4/5] sm:aspect-square relative bg-white">
                                {viewMode === 'gallery' ? (
                                    <div className="w-full h-full relative group">
                                        <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-white/90 backdrop-blur-md text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5 border border-indigo-100">
                                                <Sparkles size={14} /> LUXURY ACRYLIC
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full h-full bg-slate-50 flex items-center justify-center relative group/viewer">
                                        <model-viewer key={viewerKey} ref={modelViewerRef} src={modelSrc} poster={product.image} alt="Model 3D Tablou Acrilic" shadow-intensity="1" camera-controls ar ar-modes="webxr scene-viewer quick-look" tone-mapping="neutral" scale={scaleString} camera-orbit={cameraOrbit} min-camera-orbit="auto auto 1m" max-camera-orbit="auto auto 10m" style={{ width: '100%', height: '100%' } as any}>
                                            <button slot="ar-button" disabled={!isTextureLoaded} className={`absolute bottom-4 left-4 font-bold py-2 px-4 rounded-full shadow-lg flex items-center gap-2 transition-transform active:scale-95 z-20 ${!isTextureLoaded ? 'bg-gray-400 cursor-not-allowed opacity-70 text-gray-100' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
                                                {!isTextureLoaded ? <span className="animate-spin text-lg">⏳</span> : <Box size={18} />}
                                                {isTextureLoaded ? 'Vezi în AR' : 'Se încarcă...'}
                                            </button>
                                        </model-viewer>
                                        <button onClick={() => setShowTextureControls(!showTextureControls)} className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white backdrop-blur rounded-full border border-gray-200 shadow-sm z-20 text-gray-600" title="Ajustează Imaginea"><Settings2 size={18} /></button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div>
                        <header className="mb-6">
                            <div className="flex justify-between items-center gap-4 mb-3">
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">{product.title}</h1>
                                <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-red-600 text-white font-bold text-[10px] sm:text-xs animate-pulse shadow-md whitespace-nowrap">🔥 -20% REDUCERE</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-gray-600 text-sm">Sticlă Acrilică 3mm - Efect de profunzime</p>
                                <span className="text-xs text-indigo-600 font-bold flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded"><Check size={14} /> În stoc</span>
                            </div>
                        </header>
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8 space-y-8">
                            <div className="pb-6 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                                <span className="text-4xl font-black text-indigo-600 tracking-tighter">{formatMoneyDisplay(totalPrice)}</span>
                                <Link href="/sticla-acrilica" className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors border border-indigo-100 group">
                                    <Sparkles size={14} className="text-yellow-500 group-hover:scale-110 transition-transform" />
                                    VREI CU POZA TA?
                                </Link>
                            </div>
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-gray-900 uppercase tracking-widest flex justify-between"><span>Alege Dimensiunea</span></label>
                                <div className="grid grid-cols-2 gap-3">
                                    {availableDimensions.map((dim, idx) => {
                                        const labels = ["M", "L", "XL", "XXL"];
                                        return (
                                            <button key={dim} onClick={() => setSelectedDimension(dim)} className={`relative py-4 px-4 rounded-xl border-2 font-bold transition-all flex flex-col items-center justify-center gap-1 ${selectedDimension === dim ? "border-indigo-600 bg-indigo-50 text-indigo-600 shadow-sm" : "border-gray-100 bg-white text-gray-600 hover:border-gray-200"}`}>
                                                <span className="text-[10px] uppercase tracking-widest opacity-60">Mărimea {labels[idx]}</span>
                                                <span className="text-sm">{dim}</span>
                                                {selectedDimension === dim && (<div className="absolute -top-2 -right-2 bg-indigo-600 text-white rounded-full p-0.5 shadow-sm"><Check size={12} /></div>)}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="space-y-4 pt-4">
                                <button onClick={handleAddToCart} className="w-full py-4 text-lg font-bold bg-indigo-600 text-white rounded-xl shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 active:scale-95"><ShoppingCart size={24} /> Adaugă în Coș</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-8 lg:mt-16 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <nav className="border-b border-gray-200 flex">
                        <TabButtonSEO active={activeProductTab === "descriere"} onClick={() => setActiveProductTab("descriere")}>Descriere</TabButtonSEO>
                        <TabButtonSEO active={activeProductTab === "reviews"} onClick={() => setActiveProductTab("reviews")}>Recenzii</TabButtonSEO>
                        <TabButtonSEO active={activeProductTab === "faq"} onClick={() => setActiveProductTab("faq")}>FAQ</TabButtonSEO>
                    </nav>
                    <div className="p-6 lg:p-8">
                        {activeProductTab === 'descriere' && (
                            <div className="prose max-w-none text-gray-700">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wider border-b pb-2 inline-block border-indigo-500">Detalii Produs</h3>
                                <div className="whitespace-pre-line leading-relaxed mb-8 text-base lg:text-lg italic text-gray-600">{PREMIUM_DESCRIPTION}</div>
                            </div>
                        )}
                        {activeProductTab === 'reviews' && <Reviews productSlug={product.slug} />}
                        {activeProductTab === 'faq' && <FaqAccordion qa={acrylicFaqs} />}
                    </div>
                </div>
                <div className="mt-8 lg:mt-16">
                    <ProductCarousel title="Alte tablouri pe sticlă acrilică" currentSlug={product.slug} products={acrylicProducts} linkBase="acrylic-product" />
                </div>
            </div>
        </div>
    );
}
