"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { spintax } from "@/lib/seo/spintax";

interface LocalFaqProps {
    productTitle: string;
    locName: string;
    judetName: string;
}

const FAQItem = ({ question, answer, isOpen, onClick }: { question: string, answer: string, isOpen: boolean, onClick: () => void }) => {
    return (
        <div className="border-b border-slate-100 last:border-0">
            <button
                onClick={onClick}
                className="w-full flex items-center justify-between text-left py-5 focus:outline-none group"
            >
                <span className="text-slate-900 font-bold text-lg group-hover:text-emerald-600 transition-colors tracking-tight">
                    {question}
                </span>
                <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-500' : ''}`}
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
                        <div className="text-slate-500 leading-relaxed text-base pb-6 font-medium">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export function LocalFaq({ productTitle, locName, judetName }: LocalFaqProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    
    // Seed spintax for unique text in each locality
    const seed = `${locName}-${productTitle}`;

    const faqs = [
        {
            question: `Livrăm ${productTitle.toLowerCase()} în localitatea ${locName}?`,
            answer: spintax(`{Da,Tablou livrează ${productTitle.toLowerCase()} în ${locName} și în tot județul ${judetName}.|Absolut! Expediem rapid prin curier direct în ${locName} oricare dintre materialele noastre publicitare.} {Timpul de transport este de aproximativ 24h de la finalizarea producției.|Coletul ajunge la ușa ta în condiții de maximă siguranță, ambalat profesional.}`, `${seed}-q1`)
        },
        {
            question: `Cât costă livrarea pentru ${productTitle.toLowerCase()} în județul ${judetName}?`,
            answer: spintax(`{Costul transportului pentru ${productTitle.toLowerCase()} este optimizat prin parteneriatele noastre cu firmele de curierat.|Oferim tarife competitive pentru expedierea în ${locName}, județul ${judetName}.} {Prețul exact al transportului se calculează în pagina de checkout în funcție de greutatea pachetului.|Poți vedea costul de livrare imediat ce adaugi produsul în coș.}`, `${seed}-q2`)
        },
        {
            question: `Pot primi factură pe firmă din ${locName}?`,
            answer: spintax(`{Desigur, emitem factură fiscală pentru societăți comerciale, PFA sau instituții publice din ${locName}.|Toate comenzile sunt însoțite de factură fiscală conform legislației în vigoare.} {Trebuie doar să completezi datele de facturare în ultimul pas al comenzii online.|Poți salva datele firmei tale în contul de client pentru comenzi viitoare rapide.}`, `${seed}-q3`)
        },
        {
            question: `Cum se realizează producția?`,
            answer: spintax(`{Deținem parc tehnologic de ultimă generație în București, de unde expediem către ${locName}.|Suntem producători direcți, ceea ce ne permite să controlăm calitatea și să oferim cele mai mici prețuri.} {Utilizăm cerneluri UV și materiale premium pentru toate produsele livrate în județul ${judetName}.|Fiecare comandă trece prin verificare DTP manuală înainte de a intra în fluxul de producție.}`, `${seed}-q4`)
        }
    ];

    return (
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
    );
}
