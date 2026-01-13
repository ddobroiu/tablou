"use client";

import React from 'react';
import { MousePointerClick, Settings2, Truck, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
    const steps = [
        {
            id: 1,
            icon: <MousePointerClick size={32} />,
            title: "1. Alegi Produsul",
            description: "Explorează gama noastră completă și selectează materialul publicitar de care ai nevoie.",
            color: "bg-blue-50 text-blue-600 border-blue-100"
        },
        {
            id: 2,
            icon: <Settings2 size={32} />,
            title: "2. Configurezi Online",
            description: "Introduci dimensiunile, alegi finisajele și vezi prețul calculat instant. Încarci grafica direct.",
            color: "bg-indigo-50 text-indigo-600 border-indigo-100"
        },
        {
            id: 3,
            icon: <Truck size={32} />,
            title: "3. Livrare Rapidă",
            description: "Noi producem comanda prioritar și o expediem prin curier rapid direct la ușa ta.",
            color: "bg-emerald-50 text-emerald-600 border-emerald-100"
        }
    ];

    return (
        <section className="py-16 bg-white border-b border-slate-100">
            <div className="container mx-auto px-4">

                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Simplu, Rapid, Online</h2>
                    <p className="text-slate-500 text-lg">
                        Am simplificat procesul de comandă pentru ca tu să economisești timp.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Arrow Connectors (Desktop Only) */}
                    <div className="hidden md:block absolute top-12 left-1/3 w-1/3 h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent -translate-x-1/2 z-0" />
                    <div className="hidden md:block absolute top-12 right-1/3 w-1/3 h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent translate-x-1/2 z-0" />

                    {steps.map((step, index) => (
                        <div key={step.id} className="relative z-10 flex flex-col items-center text-center group">
                            <div className={`w-24 h-24 rounded-3xl ${step.color} border-2 flex items-center justify-center mb-6 shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:shadow-md`}>
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                            <p className="text-slate-500 leading-relaxed max-w-sm">
                                {step.description}
                            </p>

                            {/* Mobile Arrow for visual flow */}
                            {index < steps.length - 1 && (
                                <div className="md:hidden py-6 text-slate-300">
                                    <ArrowRight size={24} className="rotate-90" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
