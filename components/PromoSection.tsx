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
            "promo.subtitle": "Descoperă proiectele noaste și partenerii noștri de încredere.",
            "promo.eweb.desc": "Dezvoltare software de elită. Transformăm ideile complexe în platforme scalabile.",
            "promo.chatbill.desc": "Facturare prin WhatsApp. Scapi de birocrație printr-o simplă conversație AI.",
            "promo.tablou.desc": "Tablouri canvas și printuri foto personalizate, direct din producție proprie.",
            "promo.randari.desc": "Platformă AI de randări. Transformăm schițele în simulări 3D spectaculoase.",
            "promo.prynt.desc2": "Cea mai mare tipografie online din România pentru printuri personalizate.",
        };
        return texts[key] || key;
    };

    const components = [
        { id: "tablou", component: <MainShopCard t={t} /> },
        { id: "eweb", component: <EWebCard t={t} /> },
        { id: "chatbill", component: <ChatBillCard t={t} /> },
        { id: "prynt", component: <PryntCard t={t} /> },
        { id: "randari", component: <Randari3DCard t={t} /> },
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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[0.7rem] font-bold text-emerald-400 uppercase tracking-widest mb-4">
                            {t("promo.badge")}
                        </span>

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
                        className="absolute left-0 lg:-left-12 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-emerald-400 transition-all z-20 backdrop-blur-md opacity-0 group-hover:opacity-100 hidden md:block"
                    >
                        <ArrowLeft size={24} />
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-0 lg:-right-12 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-emerald-400 transition-all z-20 backdrop-blur-md opacity-0 group-hover:opacity-100 hidden md:block"
                    >
                        <ArrowRight size={24} />
                    </button>

                    <div className="flex justify-center gap-2 mt-8">
                        {components.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setDirection(i > currentIndex ? 1 : -1);
                                    setCurrentIndex(i);
                                }}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? "w-8 bg-emerald-500" : "w-2 bg-white/20"}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function MainShopCard({ t }: { t: (k: string) => string }) {
    return (
        <motion.div
            className="glass-card block h-full overflow-hidden"
            style={{
                background: "linear-gradient(145deg, rgba(20, 30, 20, 0.8), rgba(16, 163, 74, 0.1))",
                borderColor: "rgba(16, 185, 129, 0.3)",
            }}
            whileHover={{ scale: 1.02, borderColor: "rgba(52, 211, 153, 0.6)" }}
        >
            <div className="p-8">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-6">
                    <Printer size={24} className="text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-3 tracking-tight">Prynt.ro</div>
                <div className="text-slate-300 text-sm leading-relaxed mb-6">{t("promo.prynt.desc")}</div>
            </div>
            <div className="bg-[#0f1612] h-48 border-t border-white/5 relative overflow-hidden flex items-center justify-center">
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="text-emerald-500/20 font-black text-6xl"
                >
                    PRYNT
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent" />
            </div>
        </motion.div>
    );
}

function EWebCard({ t }: { t: (k: string) => string }) {
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
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-6">
                    <Code2 size={24} className="text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-3 tracking-tight">E-web.ro</div>
                <div className="text-slate-300 text-sm leading-relaxed mb-6">{t("promo.eweb.desc")}</div>
            </div>
            <div className="bg-black/50 p-6 font-mono text-xs border-t border-white/5 h-48 flex flex-col justify-end gap-2">
                <div className="text-emerald-400">➜ npm run deploy</div>
                <div className="text-slate-500">optimizing assets...</div>
                <div className="text-green-400">Done.</div>
            </div>
        </motion.a>
    );
}

function ChatBillCard({ t }: { t: (k: string) => string }) {
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
                <div className="text-2xl font-bold text-white mb-3 tracking-tight">ChatBill.ro</div>
                <div className="text-slate-300 text-sm leading-relaxed mb-6">{t("promo.chatbill.desc")}</div>
            </div>
            <div className="bg-[#0b141a] p-6 h-48 border-t border-white/5 flex flex-col justify-end">
                <div className="bg-green-800 text-white rounded-lg p-2 text-[0.7rem] self-end mb-2">Generați factura?</div>
                <div className="bg-neutral-800 text-slate-200 rounded-lg p-2 text-[0.7rem] self-start">Factura generată cu succes!</div>
            </div>
        </motion.a>
    );
}

function PryntCard({ t }: { t: (k: string) => string }) {
    return (
        <motion.a
            href="https://prynt.ro"
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
                <div className="text-2xl font-bold text-white mb-3 tracking-tight">Prynt.ro</div>
                <div className="text-slate-300 text-sm leading-relaxed mb-6">{t("promo.prynt.desc2")}</div>
                {/* Real sibling site in the family — intentionally kept as Prynt.ro */}
            </div>
            <div className="bg-[#0f0f16] h-48 border-t border-white/5 flex items-center justify-center">
                <div className="w-4/5 h-20 bg-pink-500/20 border-2 border-pink-500 flex items-center justify-center text-pink-500 font-bold">PRINT PREMIUM</div>
            </div>
        </motion.a>
    );
}

function Randari3DCard({ t }: { t: (k: string) => string }) {
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
                <div className="text-2xl font-bold text-white mb-3 tracking-tight">Randari3D.ro</div>
                <div className="text-slate-300 text-sm leading-relaxed mb-6">{t("promo.randari.desc")}</div>
            </div>
            <div className="bg-slate-900 h-48 border-t border-white/5 flex items-center justify-center">
                <div className="w-24 h-24 border-2 border-cyan-500/50 rotate-45 flex items-center justify-center">
                    <div className="w-16 h-16 border border-cyan-500/20" />
                </div>
            </div>
        </motion.a>
    );
}

