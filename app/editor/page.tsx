"use client";

import React, { useState, useRef } from "react";
import {
    Upload,
    Sparkles,
    Wand2,
    ArrowRight,
    Loader2,
    CheckCircle2,
    Image as ImageIcon,
    RotateCcw,
    Zap,
    Smile,
    ShieldCheck,
    Package,
    Layers,
    Frame
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useToast } from "@/components/ToastProvider";
import BeforeAfterSlider from 'react-before-after-slider-component';
import 'react-before-after-slider-component/dist/build.css';

export default function AIEditorPage() {
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [currentAction, setCurrentAction] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const toast = useToast();

    const handleFileUpload = async (file: File) => {
        if (!file) return;

        // Check if it's an image
        if (!file.type.startsWith("image/")) {
            toast.error("Vă rugăm să încărcați o imagine.");
            return;
        }

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Încărcarea a eșuat");

            const data = await response.json();
            setOriginalImage(data.url);
            setResultImage(null);
            setCurrentAction(null);
            toast.success("Imagine încărcată cu succes!");
        } catch (err) {
            console.error(err);
            toast.error("Eroare la încărcarea imaginii.");
        } finally {
            setUploading(false);
        }
    };

    const processImage = async (action: "restore" | "caricature") => {
        if (!originalImage) return;

        try {
            setProcessing(true);
            setCurrentAction(action);

            const response = await fetch("/api/editor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    imageUrl: originalImage,
                    action,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Procesarea a eșuat");
            }

            const data = await response.json();
            console.log("AI Response Data:", data);

            // A very aggressive function to find any string starting with http in an object/array
            const findUrl = (obj: any): string | null => {
                if (typeof obj === 'string' && obj.startsWith('http')) return obj;
                if (obj && typeof obj === 'object') {
                    for (const key in obj) {
                        const result = findUrl(obj[key]);
                        if (result) return result;
                    }
                }
                return null;
            };

            const finalUrl = findUrl(data.url);

            if (!finalUrl) {
                console.error("Failed to extract URL from:", data);
                // Reveal more of the response for debugging
                const errorInfo = JSON.stringify(data).substring(0, 300);
                throw new Error(`Nu am găsit un link valid în răspunsul AI. Primit: ${errorInfo}...`);
            }

            setResultImage(finalUrl);
            toast.success("Imagine procesată cu succes!");
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Eroare la procesarea AI.");
        } finally {
            setProcessing(false);
        }
    };

    const reset = () => {
        setOriginalImage(null);
        setResultImage(null);
        setCurrentAction(null);
    };

    return (
        <main className="min-h-screen bg-slate-50 pt-24 pb-20">
            <div className="container-width">
                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold tracking-widest uppercase mb-4 shadow-sm border border-indigo-100">
                            <Sparkles size={14} className="animate-pulse" />
                            Powered by AI Technology
                        </span>
                        <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6 uppercase">
                            Editor <span className="text-indigo-600">Inteligent</span>
                        </h1>
                        <p className="text-lg text-slate-600 leading-relaxed font-medium">
                            Transformă-ți fotografiile vechi în amintiri clare sau creează caricaturi distractive
                            folosind cele mai noi modele de Inteligență Artificială.
                        </p>
                    </motion.div>
                </div>

                {/* Main Content Area */}
                <div className="max-w-6xl mx-auto">
                    {!originalImage ? (
                        /* PHASE 1: UPLOAD */
                        <motion.div
                            layoutId="main-card"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-[2.5rem] shadow-premium border border-slate-100 p-12 text-center"
                        >
                            <div
                                onClick={() => !uploading && fileInputRef.current?.click()}
                                className="group relative border-4 border-dashed border-slate-100 rounded-[2rem] p-16 transition-all duration-300 hover:border-indigo-200 hover:bg-slate-50 cursor-pointer overflow-hidden"
                            >
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300">
                                        {uploading ? <Loader2 size={40} className="animate-spin" /> : <Upload size={40} />}
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                        {uploading ? "Se încarcă imaginea..." : "Încarcă o fotografie"}
                                    </h3>
                                    <p className="text-slate-500 font-medium">
                                        Drag and drop sau click pentru a alege un fișier
                                    </p>
                                    <p className="text-xs text-slate-400 mt-4 uppercase tracking-widest font-bold">
                                        Suportă: JPG, PNG, WEBP
                                    </p>
                                </div>
                                {/* Background Decor */}
                                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-50 rounded-full opacity-50 blur-3xl transition-all duration-500 group-hover:bg-indigo-100" />
                                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-purple-50 rounded-full opacity-50 blur-3xl transition-all duration-500 group-hover:bg-purple-100" />
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                            />
                        </motion.div>
                    ) : (
                        /* PHASE 2 & 3: ACTION / RESULT */
                        <div className="grid lg:grid-cols-12 gap-8">
                            {/* Image Preview Card */}
                            <motion.div
                                layoutId="main-card"
                                className="lg:col-span-8 bg-white rounded-[2.5rem] shadow-premium border border-slate-100 overflow-hidden"
                            >
                                <div className="p-8">

                                    <div className="relative rounded-[1.5rem] overflow-hidden bg-slate-100 shadow-inner group flex items-center justify-center min-h-[300px] lg:min-h-[500px]">
                                        <AnimatePresence mode="wait">
                                            {!resultImage ? (
                                                <motion.img
                                                    key="original"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    src={originalImage || ""}
                                                    alt="Original"
                                                    className="max-w-full max-h-full object-contain"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center py-4">
                                                    <div className="relative shadow-2xl rounded-lg overflow-hidden max-w-full">
                                                        <BeforeAfterSlider
                                                            firstImage={{ imageUrl: resultImage }}
                                                            secondImage={{ imageUrl: originalImage || "" }}
                                                        // The component usually follows the daughter image size
                                                        />
                                                        <div className="absolute bottom-4 right-4 flex gap-2 z-20">
                                                            <a
                                                                href={resultImage}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-[10px] font-black text-slate-900 border border-slate-200 hover:bg-white transition-all shadow-lg uppercase tracking-widest"
                                                            >
                                                                Deschide HD
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </AnimatePresence>

                                        {/* Processing Overlay */}
                                        <AnimatePresence>
                                            {processing && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center"
                                                >
                                                    <div className="relative w-24 h-24 mb-6">
                                                        <motion.div
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                            className="w-full h-full border-4 border-indigo-400 border-t-transparent rounded-full"
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <Sparkles className="text-white w-10 h-10 animate-pulse" />
                                                        </div>
                                                    </div>
                                                    <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
                                                        Transformare AI în curs
                                                    </h3>
                                                    <p className="text-indigo-200 font-medium">
                                                        Modelele noastre optimizează pixelii pentru cel mai bun rezultat...
                                                    </p>
                                                    {/* Progress Line */}
                                                    <div className="w-full max-w-xs mt-8 h-1 bg-white/20 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ x: "-100%" }}
                                                            animate={{ x: "100%" }}
                                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                                            className="w-1/2 h-full bg-gradient-to-r from-transparent via-indigo-400 to-transparent"
                                                        />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Overlay Badges */}
                                        <div className="absolute top-4 left-4 flex gap-2">
                                            <span className="px-3 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                                                {!resultImage ? "Original" : "Rezultat AI"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Controls below image */}
                                    <div className="flex items-center justify-between mt-6">
                                        <button
                                            onClick={reset}
                                            className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-sm transition-colors uppercase tracking-widest"
                                        >
                                            <RotateCcw size={16} />
                                            Încarcă altă poză
                                        </button>
                                        {resultImage && (
                                            <div className="flex gap-2">
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                    <CheckCircle2 size={14} className="text-green-500" />
                                                    Procesat cu succes
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Sidebar: Actions & Shop */}
                            <div className="lg:col-span-4 space-y-6">
                                {!resultImage ? (
                                    /* STEP 2: CHOOSE ACTION */
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4 flex items-center gap-2">
                                            <Wand2 className="text-indigo-600" size={24} />
                                            Alege magia
                                        </h3>

                                        <ActionCard
                                            title="Actualizare Foto"
                                            desc="Transformă poza veche sau neclară într-o imagine HD modernă."
                                            icon={<Zap className="text-amber-500" />}
                                            onClick={() => processImage("restore")}
                                            disabled={processing}
                                            isActive={currentAction === "restore"}
                                            color="amber"
                                        />

                                        <ActionCard
                                            title="Caricatură AI"
                                            desc="Transformă portretul tău într-o caricatură digitală plină de viață."
                                            icon={<Smile className="text-indigo-600" />}
                                            onClick={() => processImage("caricature")}
                                            disabled={processing}
                                            isActive={currentAction === "caricature"}
                                            color="indigo"
                                        />
                                    </div>
                                ) : (
                                    /* STEP 3: SHOPPING OPTIONS */
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-4"
                                    >
                                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4 flex items-center gap-2">
                                            <Package className="text-indigo-600" size={24} />
                                            Ce facem cu ea?
                                        </h3>

                                        <p className="text-sm text-slate-500 font-medium mb-4 text-balance">
                                            Superb! Rezultatul este gata. Alege suportul pe care vrei să-l personalizezi:
                                        </p>

                                        <ProductCard
                                            href={`/canvas?artworkUrl=${encodeURIComponent(resultImage)}`}
                                            title="Tablou Canvas"
                                            desc="Textură clasică, aspect premium."
                                            icon={<ImageIcon size={20} />}
                                            price="De la 29 RON"
                                        />

                                        <ProductCard
                                            href={`/sticla-acrilica?artworkUrl=${encodeURIComponent(resultImage)}`}
                                            title="Sticlă Acrilică"
                                            desc="Profunzime modernă, culori vii."
                                            icon={<Layers size={20} />}
                                            price="De la 45 RON"
                                        />

                                        <ProductCard
                                            href={`/afise?artworkUrl=${encodeURIComponent(resultImage)}`}
                                            title="Poster High-End"
                                            desc="Print clar pe hârtie fotografică."
                                            icon={<Frame size={20} />}
                                            price="De la 19 RON"
                                        />

                                        <button
                                            onClick={() => setResultImage(null)}
                                            className="w-full py-4 text-xs font-black text-indigo-600 uppercase tracking-[0.2em] border-2 border-dashed border-indigo-100 rounded-2xl hover:bg-indigo-50 hover:border-indigo-200 transition-all"
                                        >
                                            Încearcă alt efect
                                        </button>
                                    </motion.div>
                                )}

                                {/* Benefits Card */}
                                <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden group">
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-6">
                                            <ShieldCheck className="text-indigo-400" />
                                            <h4 className="font-bold uppercase tracking-widest text-sm">Garanția Tablou.net</h4>
                                        </div>
                                        <ul className="space-y-4">
                                            <li className="flex gap-3 text-xs leading-relaxed text-slate-300">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1 shrink-0" />
                                                <span>Verificare manuală a calității pentru fiecare comandă.</span>
                                            </li>
                                            <li className="flex gap-3 text-xs leading-relaxed text-slate-300">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1 shrink-0" />
                                                <span>Livrare rapidă prin curier în 24-48 ore.</span>
                                            </li>
                                        </ul>
                                    </div>
                                    {/* Subtle Glow */}
                                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-all" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

function ActionCard({ title, desc, icon, onClick, disabled, isActive, color }: any) {
    const highlightColors: any = {
        amber: "group-hover:text-amber-600",
        indigo: "group-hover:text-indigo-600",
    };

    const borderColors: any = {
        amber: "hover:border-amber-400 hover:bg-amber-50",
        indigo: "hover:border-indigo-400 hover:bg-indigo-50",
    };

    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={`w-full text-left p-6 rounded-[2rem] border-2 transition-all duration-300 group flex items-start gap-4 ${isActive
                ? "border-indigo-600 bg-indigo-50 shadow-md"
                : "border-slate-100 bg-white hover:shadow-soft " + borderColors[color]
                } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
            <div className={`p-4 rounded-2xl bg-slate-50 transition-colors duration-300 ${isActive ? "bg-white shadow-sm" : "group-hover:bg-white"
                }`}>
                {React.cloneElement(icon as any, { className: highlightColors[color] })}
            </div>
            <div>
                <h4 className="font-black text-slate-900 uppercase tracking-tight mb-1">{title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{desc}</p>
            </div>
            <div className="ml-auto">
                <ArrowRight size={20} className={`text-slate-200 transition-all duration-300 ${isActive ? "text-indigo-600 translate-x-1" : "group-hover:text-indigo-400 group-hover:translate-x-1"
                    }`} />
            </div>
        </button>
    );
}

function ProductCard({ href, title, desc, icon, price }: any) {
    return (
        <Link
            href={href}
            className="block w-full text-left p-5 rounded-[1.5rem] border border-slate-100 bg-white hover:border-indigo-200 hover:shadow-soft transition-all duration-300 group relative overflow-hidden"
        >
            <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all">
                    {icon}
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                        <h4 className="font-bold text-slate-900 text-sm uppercase tracking-tight">{title}</h4>
                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{price}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium leading-none">{desc}</p>
                </div>
            </div>
            <div className="absolute right-0 top-0 h-full w-1 translate-x-1 bg-indigo-600 transition-transform group-hover:translate-x-0" />
        </Link>
    );
}
