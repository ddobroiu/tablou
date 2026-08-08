import ConfiguratorCartiVizita from "@/components/configurator/ConfiguratorCartiVizita";
import { Metadata } from 'next';
import { Suspense } from "react";

export const metadata: Metadata = {
    title: 'Configurator Cărți de Vizită Personalizate',
    description: 'Comandă online cărți de vizită premium din carton, plastic, lemn sau metal. Diverse modele și opțiuni: colțuri rotunjite, plastifiere soft-touch. Livrare rapidă.',
    keywords: ['carti de vizita', 'print carti de vizita', 'personalizate', 'business cards', 'carton', 'plastic'],
    alternates: {
        canonical: '/carti-vizita',
    },
};

export default function CartiVizitaPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Se încarcă configuratorul de cărți de vizită...</div>}>
            <div className="pt-20">
                <ConfiguratorCartiVizita />

                <section className="bg-white py-16 mt-16 border-t border-slate-100">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                                Cărți de Vizită Premium
                            </h2>
                            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                                Transformă prima impresie într-una memorabilă. Realizăm <strong className="text-orange-600">cărți de vizită de o calitate excepțională</strong> cu opțiuni complete de finisare: plastifiere mată sau lucioasă, colțuri rotunjite și tăieri pe formă.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-orange-500 pb-2 inline-block">Materiale Disponibile</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Carton Standard (350g/mp)</strong>
                                            <span className="text-slate-600 text-sm">Grosime optimă, culori netede, perfect pentru tiraje mari și campanii corporate unde eleganța rezonabilă întâlnește prețul scăzut.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Plastic Transparent / Mat</strong>
                                            <span className="text-slate-600 text-sm">O alternativă luxoasă de excepție rezistentă aproape nelimitat în timp la frecare și apă. Impact imposibil de trecut cu vederea.</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
                                <h3 className="text-2xl font-bold text-slate-800 mb-6">Specificații și Grafică</h3>
                                <p className="text-slate-600 mb-4 leading-relaxed">
                                    Dimensiunea finală standard recomandată pe plan intern este de <strong className="text-indigo-600">90x50 mm</strong> sau formatul bancar la <strong className="text-indigo-600">85x54 mm</strong>. Dimensiunea brută (bleed-ul) se lasă întotdeauna cu minim +2mm de jur împrejur.
                                </p>
                                <p className="text-slate-600 leading-relaxed font-bold">
                                    Pregătește documentele PDF CMYK convertind fonturile la curbe (create outlines) pentru cele mai precise rezultate pe stațiile noastre DTP.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </Suspense>
    );
}
