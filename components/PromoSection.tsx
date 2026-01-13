"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Zap, Code2, MessageCircle, Printer, ArrowLeft, ArrowRight, Home, Box, Image, Music, Newspaper } from "lucide-react";

export default function PromoSection() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const t = (key: string) => {
        const texts: Record<string, string> = {
            "promo.badge": "ECOSISTEM & PARTENERI",
            "promo.title": "Soluții Digitale Complete",
            "promo.subtitle": "Descoperă proiectele noastre și partenerii de încredere.",
            "promo.eweb.desc": "Agenție de dezvoltare software de elită. Transformăm ideile complexe în platforme scalabile și profitabile.",
            "promo.chatbill.desc": "Revoluție în facturare prin WhatsApp. Scapi de birocrație printr-o simplă conversație AI.",
            "promo.prynt.desc": "Lider în print digital de mari dimensiuni. Calitate premium pentru vizibilitate maximă a brandului tău.",
            "promo.randari.desc": "Platformă AI de randări fotorealiste. Transformăm schițele arhitecturale în simulări 3D spectaculoase.",
            "promo.view3d.desc": "Generare obiecte 3D din fotografii. Transformăm imaginile 2D în modele 3D interactive și realiste.",
            "promo.mp5.desc": "Melodii personalizate prin AI. Transformăm povestea ta într-o piesă muzicală unică, compusă special pentru tine.",
            "promo.anuntul.desc": "Portal de știri și informații în timp real. Sursa ta de încredere pentru noutăți de ultimă oră și analize profunde.",
        };
        return texts[key] || key;
    };

    const components = [
        { id: "eweb", component: <EWebCard t={t} /> },
        { id: "chatbill", component: <ChatBillCard t={t} /> },
        { id: "prynt", component: <PryntCard t={t} /> },
        { id: "randari", component: <Randari3DCard t={t} /> },
        { id: "view3d", component: <View3DAICard t={t} /> },
        { id: "mp5", component: <MP5Card t={t} /> },
        { id: "anuntul", component: <AnuntulCard t={t} /> },
    ];

    const nextSlide = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % components.length);
    };

    const prevSlide = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + components.length) % components.length);
    };

    return (
        <section id="portofoliu" className="relative py-24 overflow-hidden bg-slate-950">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[0.7rem] font-bold text-slate-400 uppercase tracking-widest mb-4">
                            {t("promo.badge")}
                        </span>

                        {/* Utilizăm div în loc de h2 pentru a evita style override din globals.css care forțează culoarea neagră */}
                        <div className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter">
                            {t("promo.title")}
                        </div>

                        <div className="text-xl text-slate-300 font-light max-w-2xl mx-auto">
                            {t("promo.subtitle")}
                        </div>
                    </motion.div>
                </div>

                <div className="relative group">
                    <div className="overflow-hidden py-10">
                        <div className="flex justify-center items-stretch gap-6 transition-all duration-500">
                            <AnimatePresence mode="popLayout" initial={false}>
                                {[0, 1, 2].map((offset) => {
                                    const itemIndex = (currentIndex + offset) % components.length;
                                    return (
                                        <motion.div
                                            key={`${components[itemIndex].id}-${currentIndex}`}
                                            initial={{ opacity: 0, scale: 0.9, x: direction > 0 ? 50 : -50 }}
                                            animate={{ opacity: 1, scale: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.9, x: direction > 0 ? -50 : 50 }}
                                            transition={{ duration: 0.4, ease: "easeOut" }}
                                            className={`${offset === 0 ? "flex" : "hidden lg:flex"} w-full max-w-sm flex-1`}
                                        >
                                            <div className="w-full h-full flex items-stretch">
                                                {components[itemIndex].component}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    </div>

                    <button
                        onClick={prevSlide}
                        className="absolute left-0 lg:-left-12 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-indigo-400 transition-all z-20 backdrop-blur-md opacity-0 group-hover:opacity-100 hidden md:block"
                    >
                        <ArrowLeft size={24} />
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-0 lg:-right-12 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-indigo-400 transition-all z-20 backdrop-blur-md opacity-0 group-hover:opacity-100 hidden md:block"
                    >
                        <ArrowRight size={24} />
                    </button>

                    <div className="flex md:hidden justify-center gap-4 mt-4">
                        <button onClick={prevSlide} className="p-3 rounded-full bg-white/5 border border-white/10 text-white">
                            <ArrowLeft size={20} />
                        </button>
                        <button onClick={nextSlide} className="p-3 rounded-full bg-white/5 border border-white/10 text-white">
                            <ArrowRight size={20} />
                        </button>
                    </div>

                    <div className="flex justify-center gap-2 mt-8">
                        {components.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setDirection(i > currentIndex ? 1 : -1);
                                    setCurrentIndex(i);
                                }}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? "w-8 bg-indigo-500" : "w-2 bg-white/20"}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// --- SUB-COMPONENTE ---

function EWebCard({ t }: { t: (k: string) => string }) {
    const [codeStep, setCodeStep] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => {
            setCodeStep((prev) => (prev + 1) % 6);
        }, 2000);
        return () => clearInterval(timer);
    }, []);

    const codeLines = [
        { text: "> npm install e-web-core", color: "#fff" },
        { text: "> verifying dependencies...", color: "#6b7280" },
        { text: "> [success] packages installed", color: "#4ade80" },
        { text: "> npm run build", color: "#fff" },
        { text: "> optimizing production build...", color: "#eab308" },
        { text: "> [ready] compiled in 800ms", color: "#6366f1" },
    ];

    return (
        <motion.a
            href="https://e-web.ro"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card block h-full overflow-hidden"
            style={{
                background: "linear-gradient(145deg, rgba(20, 20, 30, 0.8), rgba(99, 102, 241, 0.1))",
                borderColor: "rgba(99, 102, 241, 0.3)",
            }}
            whileHover={{ scale: 1.02, borderColor: "rgba(99, 102, 241, 0.6)" }}
        >
            <div className="p-8">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 mb-6">
                    <Code2 size={24} className="text-indigo-400" />
                </div>
                {/* Changed h3 to div */}
                <div className="text-2xl font-bold text-white mb-3 tracking-tight">E-web.ro</div>
                <div className="text-slate-300 text-sm leading-relaxed mb-6">{t("promo.eweb.desc")}</div>
            </div>
            <div className="bg-black/50 p-6 font-mono text-xs border-t border-white/5 h-48 flex flex-col justify-end gap-2">
                <div className="flex gap-1.5 mb-2">
                    {["#ef4444", "#fbbf24", "#22c55e"].map((c) => (
                        <div key={c} style={{ background: c }} className="w-2 h-2 rounded-full" />
                    ))}
                </div>
                {codeLines.map((line, i) => (
                    <motion.div key={i} style={{ color: line.color }} initial={{ opacity: 0 }} animate={{ opacity: i <= codeStep ? 1 : 0 }}>
                        {line.text}
                    </motion.div>
                ))}
                <div className="text-indigo-400">➜ _</div>
            </div>
        </motion.a>
    );
}

function ChatBillCard({ t }: { t: (k: string) => string }) {
    const [messages, setMessages] = useState<any[]>([]);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        const runSequence = async () => {
            setMessages([{ id: 1, type: "bot", text: "Salut! Trimite detalii factura." }]);
            await new Promise((r) => setTimeout(r, 1500));
            setMessages((p) => [...p, { id: 2, type: "user", text: "Servicii web, 2500 RON." }]);
            await new Promise((r) => setTimeout(r, 1000));
            setIsTyping(true);
            await new Promise((r) => setTimeout(r, 2000));
            setIsTyping(false);
            setMessages((p) => [...p, { id: 3, type: "bot-file", text: "Factura_F024.pdf" }]);
        };
        runSequence();
        const int = setInterval(runSequence, 8000);
        return () => clearInterval(int);
    }, []);

    return (
        <motion.a
            href="https://chatbill.ro"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card block h-full overflow-hidden"
            style={{
                background: "linear-gradient(145deg, rgba(20, 25, 20, 0.8), rgba(34, 197, 94, 0.1))",
                borderColor: "rgba(34, 197, 94, 0.3)",
            }}
            whileHover={{ scale: 1.02, borderColor: "rgba(34, 197, 94, 0.6)" }}
        >
            <div className="p-8">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20 mb-6">
                    <MessageCircle size={24} className="text-green-400" />
                </div>
                {/* Changed h3 to div */}
                <div className="text-2xl font-bold text-white mb-3 tracking-tight">ChatBill.ro</div>
                <div className="text-slate-300 text-sm leading-relaxed mb-6">{t("promo.chatbill.desc")}</div>
            </div>
            <div className="bg-[#0b141a] p-6 h-48 border-t border-white/5 flex flex-col">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/5">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                        <Zap size={14} fill="white" />
                    </div>
                    <div className="text-[0.7rem]">
                        <div className="text-white font-bold">ChatBill AI</div>
                        <div className="text-green-500">online</div>
                    </div>
                </div>
                <div className="flex flex-col gap-2 overflow-hidden justify-end flex-1 pb-2 font-sans">
                    <AnimatePresence>
                        {messages.map((m) => (
                            <motion.div
                                key={m.id}
                                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className={`p-2 rounded-lg text-[0.7rem] max-w-[80%] ${m.type === "user" ? "bg-green-800 text-white self-end" : "bg-neutral-800 text-slate-200"
                                    }`}
                            >
                                {m.type === "bot-file" ? <div className="flex items-center gap-2 font-bold"><Zap size={12} /> {m.text}</div> : m.text}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {isTyping && <div className="text-[0.6rem] text-slate-500 italic">ChatBill scrie...</div>}
                </div>
            </div>
        </motion.a>
    );
}

function PryntCard({ t }: { t: (k: string) => string }) {
    return (
        <motion.a
            href="https://AdBanner.ro"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card block h-full overflow-hidden"
            style={{
                background: "linear-gradient(145deg, rgba(30, 20, 25, 0.8), rgba(236, 72, 153, 0.1))",
                borderColor: "rgba(236, 72, 153, 0.3)",
            }}
            whileHover={{ scale: 1.02, borderColor: "rgba(236, 72, 153, 0.6)" }}
        >
            <div className="p-8">
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20 mb-6">
                    <Printer size={24} className="text-pink-400" />
                </div>
                {/* Changed h3 to div */}
                <div className="text-2xl font-bold text-white mb-3 tracking-tight">AdBanner.ro</div>
                <div className="text-slate-300 text-sm leading-relaxed mb-6">{t("promo.prynt.desc")}</div>
            </div>
            <div className="bg-[#0f0f16] h-48 border-t border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-8 bg-neutral-800 flex items-center px-4 justify-between z-10 border-b border-white/5">
                    <span className="text-[0.5rem] font-mono text-slate-500 uppercase tracking-widest">Printer Status: Printing...</span>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </div>
                <motion.div
                    animate={{ y: ["-50%", "0%"] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 pt-8"
                >
                    <div className="w-full h-full flex flex-col items-center gap-4 py-10">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-4/5 h-32 bg-pink-500 border-x-4 border-white flex items-center justify-center font-black text-white text-xl shadow-lg">
                                SALE 50%
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.a>
    );
}

function Randari3DCard({ t }: { t: (k: string) => string }) {
    const [step, setStep] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => {
            setStep((prev) => (prev + 1) % 2);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <motion.a
            href="https://www.randari3d.ro"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card block h-full overflow-hidden"
            style={{
                background: "linear-gradient(145deg, rgba(20, 25, 30, 0.8), rgba(0, 243, 255, 0.1))",
                borderColor: "rgba(0, 243, 255, 0.3)",
            }}
            whileHover={{ scale: 1.02, borderColor: "rgba(0, 243, 255, 0.6)" }}
        >
            <div className="p-8">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 mb-6">
                    <Home size={24} className="text-cyan-400" />
                </div>
                {/* Changed h3 to div */}
                <div className="text-2xl font-bold text-white mb-3 tracking-tight">Randari3D.ro</div>
                <div className="text-slate-300 text-sm leading-relaxed mb-6">{t("promo.randari.desc")}</div>
            </div>
            <div className="bg-slate-900 h-48 border-t border-white/5 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-40">
                    <svg className="w-full h-full p-4 text-cyan-500/30" viewBox="0 0 100 100">
                        <rect x="10" y="20" width="80" height="60" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        <line x1="10" y1="20" x2="50" y2="10" stroke="currentColor" strokeWidth="0.5" />
                        <line x1="90" y1="20" x2="50" y2="10" stroke="currentColor" strokeWidth="0.5" />
                        <line x1="50" y1="10" x2="50" y2="80" stroke="currentColor" strokeWidth="0.1" />
                    </svg>
                </div>
                <motion.div
                    animate={{ left: ["0%", "100%", "0%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_15px_rgba(0,243,255,0.8)] z-20"
                />
                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-gradient-to-br from-slate-200 to-white flex items-center justify-center p-4 z-10"
                        >
                            <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-slate-300">
                                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 to-indigo-600 opacity-20" />
                                <div className="flex flex-col h-full bg-white shadow-inner">
                                    <div className="h-2/3 bg-slate-100 flex items-center justify-center">
                                        <div className="w-16 h-16 rounded-full bg-cyan-100 animate-pulse" />
                                    </div>
                                    <div className="flex-1 p-2 space-y-1">
                                        <div className="h-1 bg-slate-200 w-3/4" />
                                        <div className="h-1 bg-slate-200 w-1/2" />
                                    </div>
                                </div>
                                <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/80 text-[0.4rem] text-cyan-400 rounded font-black">AI RENDERED</div>
                            </div>
                        </motion.div>
                    ) : null}
                </AnimatePresence>
                <div className="z-10 text-[0.6rem] font-bold text-cyan-400/50 uppercase tracking-widest mt-32">Processing AI Vector...</div>
            </div>
        </motion.a>
    );
}

function View3DAICard({ t }: { t: (k: string) => string }) {
    return (
        <motion.a
            href="https://3dview.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card block h-full overflow-hidden"
            style={{
                background: "linear-gradient(145deg, rgba(20, 20, 35, 0.8), rgba(168, 85, 247, 0.1))",
                borderColor: "rgba(168, 85, 247, 0.3)",
            }}
            whileHover={{ scale: 1.02, borderColor: "rgba(168, 85, 247, 0.6)" }}
        >
            <div className="p-8">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 mb-6">
                    <Box size={24} className="text-purple-400" />
                </div>
                {/* Changed h3 to div */}
                <div className="text-2xl font-bold text-white mb-3 tracking-tight">3DView.ai</div>
                <div className="text-slate-300 text-sm leading-relaxed mb-6">{t("promo.view3d.desc")}</div>
            </div>
            <div className="bg-slate-950 h-48 border-t border-white/5 relative overflow-hidden flex items-center justify-around px-6">
                <div className="relative w-16 h-16 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center overflow-hidden group/photo">
                    <Image size={24} className="text-purple-400/50" />
                    <motion.div
                        animate={{ y: ["100%", "-100%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-x-0 h-0.5 bg-purple-400 shadow-[0_0_10px_purple] z-10"
                    />
                </div>
                <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{ x: [0, 40], opacity: [0, 1, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5, ease: "linear" }}
                            className="w-1 h-1 bg-purple-400 rounded-full"
                        />
                    ))}
                </div>
                <div className="w-24 h-24 relative" style={{ perspective: '800px' }}>
                    <motion.div
                        animate={{ rotateY: 360, rotateX: 20 }}
                        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                        className="w-full h-full flex items-center justify-center"
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        <div className="w-12 h-12 border-2 border-purple-400/80 relative shadow-[0_0_20px_purple]">
                            <div className="absolute inset-0 bg-purple-500/20 backdrop-blur-sm" />
                            <div className="absolute -top-6 -left-6 w-12 h-12 border border-purple-400/40" style={{ transform: 'translateZ(24px)' }} />
                            <div className="absolute -bottom-6 -right-6 w-12 h-12 border border-purple-400/40" style={{ transform: 'translateZ(-24px)' }} />
                        </div>
                    </motion.div>
                    <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 text-[0.5rem] font-bold text-purple-400/50 uppercase tracking-[0.2em]">Generating Mesh...</div>
                </div>
            </div>
        </motion.a>
    );
}

function MP5Card({ t }: { t: (k: string) => string }) {
    const bars = Array.from({ length: 15 }, (_, i) => i);
    return (
        <motion.a
            href="https://www.mp5.ro"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card block h-full overflow-hidden"
            style={{
                background: "linear-gradient(145deg, rgba(20, 20, 30, 0.8), rgba(249, 115, 22, 0.1))",
                borderColor: "rgba(249, 115, 22, 0.3)",
            }}
            whileHover={{ scale: 1.02, borderColor: "rgba(249, 115, 22, 0.6)" }}
        >
            <div className="p-8">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 mb-6">
                    <Music size={24} className="text-orange-400" />
                </div>
                {/* Changed h3 to div */}
                <div className="text-2xl font-bold text-white mb-3 tracking-tight">MP5.ro</div>
                <div className="text-slate-300 text-sm leading-relaxed mb-6">{t("promo.mp5.desc")}</div>
            </div>
            <div className="bg-slate-950 h-48 border-t border-white/5 relative overflow-hidden flex flex-col items-center justify-center gap-4">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 rounded-full border-2 border-dashed border-orange-500/30 flex items-center justify-center"
                >
                    <div className="w-12 h-12 rounded-full border border-orange-500/50 flex items-center justify-center bg-orange-500/5">
                        <div className="w-2 h-2 rounded-full bg-orange-400" />
                    </div>
                </motion.div>
                <div className="flex items-end gap-1 h-12">
                    {bars.map((i) => (
                        <motion.div
                            key={i}
                            animate={{
                                height: [
                                    Math.random() * 40 + 10,
                                    Math.random() * 40 + 10,
                                    Math.random() * 40 + 10
                                ]
                            }}
                            transition={{
                                duration: 0.5 + Math.random(),
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="w-1.5 bg-orange-500/80 rounded-t-sm"
                        />
                    ))}
                </div>
                <div className="absolute top-2 right-4 text-[0.5rem] font-bold text-orange-400/50 uppercase tracking-widest">Mastering AI Audio...</div>
            </div>
        </motion.a>
    );
}

function AnuntulCard({ t }: { t: (k: string) => string }) {
    const news = [
        "E-Web lansează noi soluții AI...",
        "ChatBill simplifică facturarea...",
        "MP5 revolutionează muzica...",
        "Randări 3D ultra-realiste...",
    ];
    return (
        <motion.a
            href="https://anuntul.net"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card block h-full overflow-hidden"
            style={{
                background: "linear-gradient(145deg, rgba(20, 20, 30, 0.8), rgba(59, 130, 246, 0.1))",
                borderColor: "rgba(59, 130, 246, 0.3)",
            }}
            whileHover={{ scale: 1.02, borderColor: "rgba(59, 130, 246, 0.6)" }}
        >
            <div className="p-8">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 mb-6">
                    <Newspaper size={24} className="text-blue-400" />
                </div>
                {/* Changed h3 to div */}
                <div className="text-2xl font-bold text-white mb-3 tracking-tight">Anuntul.net</div>
                <div className="text-slate-300 text-sm leading-relaxed mb-6">{t("promo.anuntul.desc")}</div>
            </div>
            <div className="bg-slate-950 h-48 border-t border-white/5 relative overflow-hidden flex flex-col p-4">
                <div className="flex items-center gap-2 mb-4">
                    <div className="px-2 py-0.5 bg-red-600 text-[0.5rem] font-bold text-white rounded animate-pulse">LIVE</div>
                    <div className="text-[0.6rem] text-slate-500 font-mono tracking-widest uppercase">Global Feed</div>
                </div>
                <div className="flex-1 flex flex-col gap-3 font-serif">
                    {news.map((item, i) => (
                        <motion.div
                            key={i}
                            animate={{ opacity: [0, 1, 0, 1], x: [10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, delay: i * 2 }}
                            className="flex items-start gap-3 border-l-2 border-blue-500/30 pl-3 py-1"
                        >
                            <div className="flex-1">
                                <div className="h-1 bg-slate-800 w-1/4 mb-1" />
                                <div className="text-[0.7rem] text-slate-300 font-bold leading-tight">{item}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-blue-600/20 h-6 flex items-center overflow-hidden border-t border-blue-500/20">
                    <motion.div
                        animate={{ x: ["100%", "-100%"] }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="whitespace-nowrap text-[0.6rem] text-blue-300 font-black uppercase tracking-widest"
                    >
                        BREAKING NEWS: e-Web ecosistemul digital care redefinește viitorul tehnologiei în România • 3DView.ai revoluționează modelarea 3D •
                    </motion.div>
                </div>
            </div>
        </motion.a>
    );
}
