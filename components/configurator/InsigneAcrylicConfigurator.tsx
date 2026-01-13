// @ts-nocheck
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

import { acrylicProducts } from "../../lib/products/acrylic-products";

const acrylicFaqs: QA[] = [
    { question: "Ce este sticla acrilică?", answer: "Sticla acrilică (plexiglass) este un material premium care oferă o claritate superioară sticlei clasice, fiind în același timp mult mai ușoară și rezistentă la impact." },
    { question: "Tabloul vine gata de agățat?", answer: "Da, tablourile pe sticlă acrilică vin cu un sistem de prindere invizibil montat pe spate, care oferă un efect de 'plutire' pe perete." },
];

interface Props {
    productSlug: string;
}

export default function InsigneAcrylicConfigurator({ productSlug }: Props) {
    const { addItem } = useCart();

    const product = useMemo(() => {
        const rawProduct = acrylicProducts.find((p: any) => p.slug === productSlug);
        if (!rawProduct) return null;
        return {
            ...rawProduct,
            title: rawProduct.title.replace(/DOTCOMCANVAS®/g, '').trim()
        };
    }, [productSlug]);

    const PREMIUM_DESCRIPTION = `Colectia Insigne Art: Tablouri premium pe sticlă acrilică.`;

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold">Produsul nu a fost găsit.</h2>
                <Link href="/shop/acrylic" className="text-indigo-600 hover:underline mt-4 inline-block">Înapoi la colecție</Link>
            </div>
        );
    }

    const PORTRAIT_DIMENSIONS = ["40x50 cm", "50x70 cm", "60x90 cm", "90x120 cm"];
    const LANDSCAPE_DIMENSIONS = ["50x40 cm", "70x50 cm", "90x60 cm", "120x90 cm"];
    const SQUARE_DIMENSIONS = ["40x40 cm", "60x60 cm", "80x80 cm", "100x100 cm"];
    const ROUND_DIMENSIONS = ["∅ 30 cm", "∅ 40 cm", "∅ 50 cm", "∅ 70 cm"];
    const PANORAMIC_DIMENSIONS = ["30x60 cm", "40x80 cm", "50x100 cm", "60x120 cm"];

    const isLandscapeProduct = product.orientation === 'Landscape' || product.orientation === 'Quer';
    const isPortraitProduct = product.orientation === 'Portret' || product.orientation === 'Portrait' || product.orientation === 'Hoch';
    const isSquareProduct = product.orientation === 'Pătrat' || product.orientation === 'square';
    const isRoundProduct = product.shape === 'Round' || product.orientation === 'Round' || product.orientation === 'Circular' || product.title.toLowerCase().includes('rotund') || product.tags.some((t: string) => t.toLowerCase() === 'round' || t.toLowerCase() === 'rotund');
    const isPanoramicProduct = product.orientation === 'Panoramic';

    const availableDimensions = useMemo(() => {
        if (isPanoramicProduct) return PANORAMIC_DIMENSIONS;
        if (isRoundProduct) return ROUND_DIMENSIONS;
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

    const [selectedImage, setSelectedImage] = useState<string>(product.image);

    useEffect(() => {
        setSelectedImage(product.image);
    }, [product.image]);

    const galleryImages = useMemo(() => {
        const images = product.images && product.images.length > 0 ? product.images : [product.image];
        if (!images.includes(product.image)) {
            return [product.image, ...images];
        }
        return images;
    }, [product]);

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
        if (isRoundProduct) {
            if (dimStr === "∅ 30") return 159;
            if (dimStr === "∅ 40") return 199;
            if (dimStr === "∅ 50") return 259;
            if (dimStr === "∅ 70") return 349;
        }
        return 399;
    }, [selectedDimension, isPortraitProduct, isLandscapeProduct, isSquareProduct, isPanoramicProduct, isRoundProduct]);

    useEffect(() => {
        if (!availableDimensions.includes(selectedDimension)) {
            setSelectedDimension(availableDimensions[0]);
        }
    }, [availableDimensions, selectedDimension]);

    const shareUrl = "https://tablou.net"; // Placeholder

    const [quantity, setQuantity] = useState(1);
    const [viewMode, setViewMode] = useState<'gallery' | '3d'>('gallery');
    const [activeProductTab, setActiveProductTab] = useState<'descriere' | 'reviews' | 'faq'>('descriere');

    const handleAddToCart = () => {
        addItem({
            id: `insigne-acrylic-${product.id}-${Date.now()}`,
            productId: product.id,
            title: product.title,
            price: priceRON,
            quantity: quantity,
            metadata: {
                "Dimensiune": selectedDimension,
                "Material": "Sticlă Acrilică 3mm",
                "Imagine": selectedImage,
                "Tip": "Insigne Art"
            }
        });
        alert("Produs adăugat în coș!");
    };

    const totalPrice = priceRON * quantity;

    return (
        <div className="bg-white min-h-screen pb-20">
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
                        <div className="aspect-square relative bg-white flex items-center justify-center p-4">
                            <img src={selectedImage} alt={product.title} className="w-full h-full object-cover rounded-lg shadow-lg" />
                        </div>
                        {galleryImages.length > 1 && (
                            <div className="grid grid-cols-4 gap-2 pt-0">
                                {galleryImages.map((img, idx) => (
                                    <button key={idx} onClick={() => setSelectedImage(img)} className={`aspect-square relative rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-indigo-600' : 'border-transparent'}`}>
                                        <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <header className="mb-6">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-2">{product.title}</h1>
                            <span className="text-4xl font-black text-indigo-600 tracking-tighter">{formatMoneyDisplay(totalPrice)}</span>
                        </header>

                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8 space-y-8">
                            <div className="grid grid-cols-2 gap-3">
                                {availableDimensions.map((dim, idx) => (
                                    <button key={dim} onClick={() => setSelectedDimension(dim)} className={`p-4 border-2 rounded-xl font-bold ${selectedDimension === dim ? "border-indigo-600 bg-indigo-50 text-indigo-600" : "border-gray-100"}`}>
                                        {dim}
                                    </button>
                                ))}
                            </div>
                            <button onClick={handleAddToCart} className="w-full py-4 bg-indigo-600 text-white rounded-xl shadow-lg font-bold hover:bg-indigo-700">Adaugă în Coș</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
