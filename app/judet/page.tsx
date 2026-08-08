import React from "react";
import Link from "next/link";
import { getJudete } from "@/lib/localitati";
import { MapPin, ArrowRight } from "lucide-react";

export const metadata = {
    title: "Toate Județele din România",
    description: "Configurator și producție materiale publicitare cu livrare națională. Alege județul tău pentru detalii specifice și transport rapid.",
};

export default function JudetePage() {
    const judete = getJudete().sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Header */}
            <div className="border-b border-slate-100 mb-12">
                <div className="container mx-auto px-6 py-16">
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4">
                         Prezență <span className="text-emerald-500">Națională</span>
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl">
                        Suntem prezenți în toate județele din România cu servicii profesionale de tipar digital și livrare express prin curier. Alege județul tău pentru a începe.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6">
                <div className="bg-slate-50 rounded-[2.5rem] p-10 md:p-16 border border-slate-100">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-12">
                        {judete.map((judet) => (
                            <Link
                                key={judet.slug}
                                href={`/judet/${judet.slug}`}
                                className="group flex items-center justify-between py-2 border-b border-slate-200/50 hover:border-emerald-500 transition-all"
                            >
                                <span className="text-lg font-black text-slate-700 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">
                                    {judet.name}
                                </span>
                                <ArrowRight className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" size={18} />
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Info Text */}
                <div className="mt-20 max-w-3xl">
                    <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tight">Servicii de Tipografie la Nivel Național</h2>
                    <p className="text-slate-600 leading-relaxed mb-6">
                        Tablou.net utilizează o rețea logistică avansată pentru a asigura livrarea materialelor publicitare în orice localitate din România. 
                        Indiferent că ești un brand național sau o mică afacere locală, oferim aceeași calitate industrială a printului UV și termene de execuție rapide.
                    </p>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-emerald-600 font-bold uppercase tracking-widest text-xs">
                            <MapPin size={16} /> Toate Județele
                        </div>
                        <div className="w-px h-4 bg-slate-200"></div>
                        <div className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">
                            Livrare în 24-48 ore
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
