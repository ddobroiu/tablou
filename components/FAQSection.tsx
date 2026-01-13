"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';

// Custom Accordion Component to avoid dependency issues
const FAQItem = ({ question, answer, isOpen, onClick }: { question: string, answer: string, isOpen: boolean, onClick: () => void }) => {
    return (
        <div className="border-b border-slate-100 last:border-0">
            <button
                onClick={onClick}
                className="w-full flex items-center justify-between text-left py-4 focus:outline-none group"
            >
                <span className="text-slate-900 font-bold text-base lg:text-lg group-hover:text-indigo-600 transition-colors">
                    {question}
                </span>
                <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`}
                />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="text-slate-600 leading-relaxed text-base pb-4">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: "În cât timp livrați comanda?",
            answer: "Termenul standard de producție este de 24-48 de ore lucrătoare de la confirmarea bunului de tipar ('BT'). Livrarea prin curier mai durează, de regulă, încă 24 de ore. Pentru urgențe, scrie-ne pe WhatsApp!"
        },
        {
            question: "Cum trimit fișierele pentru print?",
            answer: "Cel mai simplu este să le încarci direct în configuratorul online când plasezi comanda (acceptăm PDF, TIFF, JPEG). Dacă fișierele sunt foarte mari (>500MB), poți folosi WeTransfer și ne trimiți link-ul pe email sau WhatsApp."
        },
        {
            question: "Pot returna produsele personalizate?",
            answer: "Produsele personalizate cu grafica clientului nu pot fi returnate conform legii, deoarece nu pot fi revândute. Însă, garantăm calitatea! Dacă există un defect de producție sau o greșeală din partea noastră, vom refa comanda gratuit sau îți returnăm banii."
        },
        {
            question: "Verificați fișierele înainte de print?",
            answer: "Da! Toate fișierele sunt verificate manual de echipa noastră de graficieni. Dacă rezoluția este slabă sau există probleme de bleed/margini, te vom contacta înainte de a pune comanda în lucru."
        },
        {
            question: "Primesc factură pentru firmă?",
            answer: "Desigur. Îți poți introduce datele firmei în pagina de checkout. Factura se emite automat și o primești pe email, dar o poți descărca și oricând din contul tău de client."
        }
    ];

    return (
        <section className="py-16 lg:py-24 bg-slate-50 border-t border-slate-200">
            <div className="container mx-auto px-4 max-w-4xl">

                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-bold uppercase shadow-sm mb-4">
                        <HelpCircle size={14} />
                        <span>Suport & Ajutor</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">Întrebări Frecvente</h2>
                    <p className="text-slate-500 text-lg">
                        Răspunsuri la cele mai comune nelămuriri pentru o experiență fără griji.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
                    <div className="w-full">
                        {faqs.map((faq, index) => (
                            <FAQItem
                                key={index}
                                question={faq.question}
                                answer={faq.answer}
                                isOpen={openIndex === index}
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
