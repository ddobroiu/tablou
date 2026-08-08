import { Suspense } from 'react';
import ConfiguratorDispatcher from "@/components/configurator/ConfiguratorDispatcher";
import ProductSchema from "@/components/ProductSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FAQSchema from "@/components/FAQSchema";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Kit Vizibilitate Fonduri Europene - PNRR, Regio | Tablou',
    description: 'Comandă kitul obligatoriu de vizibilitate pentru proiecte finanțate prin Fonduri Europene (PNRR, Regio, POC). Panouri, plăci și autocolante conforme manualului de identitate vizuală.',
    keywords: ['fonduri europene', 'vizibilitate pnrr', 'panouri santier', 'placi permanente', 'autocolante fonduri europene', 'tablou'],
    alternates: {
        canonical: '/configurator/fonduri-eu',
    },
};

export default function FonduriEUPage() {
    return (
        <>
            <div className="pt-20">
                <h1 className="sr-only">Kit Vizibilitate Fonduri Europene - PNRR, Regio, POC</h1>
                <BreadcrumbSchema
                    items={[
                        { name: "Acasă", item: "/" },
                        { name: "Configuratoare", item: "/configurator" },
                        { name: "Fonduri Europene", item: "/configurator/fonduri-eu" }
                    ]}
                />
                <ProductSchema
                    name="Kit Vizibilitate Fonduri Europene"
                    description="Panouri, plăci permanente și autocolante de vizibilitate pentru proiecte finanțate prin fonduri europene, conforme manualului de identitate vizuală."
                    image="/products/master/pachet-vizibilitate-fonduri-europene-pnrr.png"
                    url="/configurator/fonduri-eu"
                    price="120.00"
                />
                <Suspense fallback={<div className="min-h-[60svh] flex items-center justify-center">Se încarcă configuratorul de fonduri europene...</div>}>
                    <ConfiguratorDispatcher configuratorId="fonduri-eu" />
                </Suspense>

                <FAQSchema
                    faqs={[
                        {
                            question: "Ce materiale sunt obligatorii pentru un proiect cu finanțare europeană?",
                            answer: "În funcție de program și valoarea finanțării, cel mai frecvent sunt cerute: un panou temporar de șantier (pe durata implementării), o placă sau autocolant permanent (după finalizare) și, pentru proiecte mai mari, comunicate de presă."
                        },
                        {
                            question: "De unde știu ce dimensiuni și elemente grafice trebuie să conțină panoul?",
                            answer: "Fiecare program de finanțare are propriul manual de identitate vizuală (MIV), publicat de autoritatea de management, care specifică dimensiunile minime, logo-urile obligatorii și textele standard."
                        },
                        {
                            question: "Puteți realiza panoul după manualul specific programului meu?",
                            answer: "Da — configuratorul acoperă cele mai comune programe (PNRR, Regio, POC). Dacă ai un manual de identitate vizuală specific, ni-l poți trimite la comandă pentru conformitate exactă."
                        }
                    ]}
                />

                {/* CONȚINUT INFORMATIV — Tablou */}
                <section className="bg-white py-16 mt-16 border-t border-slate-100">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                                Materiale de vizibilitate conforme, pentru proiecte cu finanțare europeană
                            </h2>
                            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                                Dacă derulezi un proiect finanțat din fonduri europene, ai obligația de a semnala public finanțarea primită, conform manualului de identitate vizuală al programului. Producem <strong className="text-orange-600">panouri temporare, plăci permanente și autocolante</strong> la specificațiile cerute.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-orange-500 pb-2 inline-block">Ce include, de regulă, un kit</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Panou temporar de șantier</strong>
                                            <span className="text-slate-600 text-sm">Afișat pe durata implementării proiectului, la locul de desfășurare.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Placă permanentă sau autocolant</strong>
                                            <span className="text-slate-600 text-sm">Montată după finalizarea proiectului, pentru semnalizare pe termen lung.</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
                                <h3 className="text-2xl font-bold text-slate-800 mb-6">Cum comanzi corect</h3>
                                <p className="text-slate-600 mb-4 leading-relaxed">
                                    Specifică programul de finanțare (PNRR, Regio, POC etc.) și, dacă ai la dispoziție, manualul de identitate vizuală — folosim aceste informații pentru a genera materialul conform cerințelor.
                                </p>
                            </div>
                        </div>

                        <div className="mt-16 border-t border-slate-200 pt-16">
                            <h3 className="text-3xl font-black text-slate-900 mb-8 text-center uppercase">Întrebări Frecvente</h3>
                            <div className="space-y-6 max-w-3xl mx-auto">
                                {[
                                    {
                                        q: "Ce materiale sunt obligatorii pentru un proiect cu finanțare europeană?",
                                        a: "În funcție de program și valoarea finanțării, cel mai frecvent sunt cerute: un panou temporar de șantier (pe durata implementării), o placă sau autocolant permanent (după finalizare) și, pentru proiecte mai mari, comunicate de presă."
                                    },
                                    {
                                        q: "De unde știu ce dimensiuni și elemente grafice trebuie să conțină panoul?",
                                        a: "Fiecare program de finanțare are propriul manual de identitate vizuală (MIV), publicat de autoritatea de management, care specifică dimensiunile minime, logo-urile obligatorii și textele standard."
                                    },
                                    {
                                        q: "Puteți realiza panoul după manualul specific programului meu?",
                                        a: "Da — configuratorul acoperă cele mai comune programe (PNRR, Regio, POC). Dacă ai un manual de identitate vizuală specific, ni-l poți trimite la comandă pentru conformitate exactă."
                                    }
                                ].map((faq, idx) => (
                                    <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                                        <h4 className="font-bold text-lg text-slate-900 mb-2">{faq.q}</h4>
                                        <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
