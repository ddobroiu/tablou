import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { MapPin, ArrowRight, Zap, ShieldCheck, Truck } from 'lucide-react';
import { getJudetBySlug } from '@/lib/localitati';

export const metadata: Metadata = {
    title: 'Print & Publicitate pe Sectoare în București',
    description: 'Servicii rapide de tipar digital în București. Livrare în toate sectoarele: Sector 1, 2, 3, 4, 5 și 6. Producție proprie, preț instant.',
    alternates: { canonical: 'https://www.tablou.net/sectoare-bucuresti' }
};

export default function SectoareBucurestiPage() {
    const bucuresti = getJudetBySlug('bucuresti');
    const sectoare = bucuresti?.localitati.filter(l => l.name.startsWith('Sector')) || [];

    const sectorImages: Record<string, string> = {
        'sector-1': '/products/banner/banner-1.webp',
        'sector-2': '/products/banner/banner-1.webp',
        'sector-3': '/products/banner/banner-1.webp',
        'sector-4': '/products/banner/banner-1.webp',
        'sector-5': '/products/banner/banner-1.webp',
        'sector-6': '/products/banner/banner-1.webp',
    };

    return (
        <div className="min-h-screen bg-white selection:bg-emerald-500 selection:text-white">
            {/* Dark Hero */}
            <div className="pt-32 pb-24 bg-slate-900 text-white relative overflow-hidden rounded-b-[4rem]">
                 {/* Subtle grid pattern background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/10 to-transparent blur-3xl pointer-events-none"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                            <MapPin size={12} /> Prezență Urbană
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.8] mb-8">
                            Bucureștiul <br /> <span className="text-emerald-500 italic">Printează cu Noi.</span>
                        </h1>
                        <p className="text-xl text-slate-400 font-medium leading-relaxed mb-10">
                            Acoperim toate cele 6 sectoare din București cu livrare ultra-rapidă și aceleași standarde industriale de calitate. Alege sectorul tău pentru soluții locale.
                        </p>
                    </div>
                </div>
            </div>

            {/* Sectors Grid */}
            <div className="py-24 container mx-auto px-6 -mt-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sectoare.map((s) => (
                        <Link 
                            key={s.slug} 
                            href={`/judet/bucuresti/${s.slug}`}
                            className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl hover:shadow-2xl hover:border-emerald-200 transition-all duration-500 flex flex-col h-full"
                        >
                            <div className="aspect-[16/10] relative overflow-hidden bg-slate-50">
                                {sectorImages[s.slug] ? (
                                    <Image 
                                        src={sectorImages[s.slug]} 
                                        alt={s.name} 
                                        fill 
                                        className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-100">
                                        <MapPin size={64} />
                                    </div>
                                )}
                                <div className="absolute top-6 left-6">
                                     <div className="bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full text-white text-[10px] font-black uppercase tracking-widest border border-white/10">
                                        Online 24/7
                                     </div>
                                </div>
                            </div>
                            <div className="p-10">
                                <h3 className="text-3xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors mb-4">{s.name}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-8">Print de bannere, autocolante, canvas și materiale de marketing cu livrare express în {s.name}.</p>
                                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                    <span className="text-xs font-black uppercase text-emerald-500 tracking-widest">Vezi Configurări &rarr;</span>
                                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                        <ArrowRight size={18} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Why Bucuresti */}
            <section className="py-32 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-10 leading-tight">Avantajul Tablou <br /> în București</h2>
                            <div className="space-y-12">
                                {[
                                    { icon: Zap, title: "Livrare Premium", desc: "Corespondenții noștri logistici asigură că materialele tale ajung în Sectorul respectiv în timp util, ambalate perfect." },
                                    { icon: ShieldCheck, title: "Verificare DTP", desc: "Trimite-ne fișierele și echipa noastră tehnică le va verifica gratuit pentru erori de dimensiune sau rezoluție." },
                                    { icon: Truck, title: "Ridicare Personală", desc: "Dacă ești în grabă, poți alege să ridici materialele direct de la punctele noastre de producție din hub-ul logistic." }
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-6 group">
                                        <div className="w-16 h-16 bg-white border border-slate-200 text-emerald-500 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
                                            <step.icon size={28} strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold mb-2 text-slate-900">{step.title}</h4>
                                            <p className="text-slate-500 leading-relaxed font-medium">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative rounded-[3rem] overflow-hidden aspect-square rotate-3 border-8 border-white shadow-2xl">
                             <Image src="/products/banner/banner-1.webp" alt="Tablou Bucharest Hub" fill className="object-cover" />
                             <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
