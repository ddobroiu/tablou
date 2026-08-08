import { Suspense } from 'react';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import ProductSchema from "@/components/ProductSchema";
import FAQSchema from "@/components/FAQSchema";

const Canvas8MartieConfigurator = dynamic(() => import('@/components/configurator/Canvas8MartieConfigurator'));

import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
    title: "Canvas 8 Martie Personalizat - Cadou pentru Mama sau Soție | Tablou",
    description: "Creează un cadou memorabil de 8 Martie. Tablou canvas personalizat cu fotografia și mesajul tău pentru mama, soție sau iubită. Calitate premium, preț instant.",
    keywords: ['8 martie', 'canvas 8 martie', 'cadou ziua femeii', 'cadou mama', 'tablou canvas personalizat', 'tablou'],
    alternates: {
        canonical: 'https://www.tablou.net/configurator/canvas-8-martie',
    },
};

export default function Canvas8MartiePage() {
    const breadcrumbItems = [
        { label: 'Configuratoare', href: '/shop' },
        { label: 'Canvas 8 Martie', href: '/configurator/canvas-8-martie' }
    ];

    return (
        <div className="pt-24 max-w-7xl mx-auto px-4">
            <Breadcrumbs items={breadcrumbItems} />
            <ProductSchema
                name="Canvas 8 Martie Personalizat"
                description="Tablou canvas personalizat cu fotografia și mesajul tău, cadou pentru mama, soție sau iubită de 8 Martie."
                image="/products/canvas/canvas-1.webp"
                url="/configurator/canvas-8-martie"
                price="55.00"
            />
            <Suspense fallback={<div className="min-h-[60svh] flex items-center justify-center">Se încarcă configuratorul de 8 Martie...</div>}>
                <div className="min-h-screen bg-transparent pb-20">
                    <Canvas8MartieConfigurator />
                </div>
            </Suspense>

            <FAQSchema
                faqs={[
                    {
                        question: "Ce poză se potrivește cel mai bine pentru un cadou de 8 Martie?",
                        answer: "O poză cu mama, soția sau iubita ta — o amintire dragă, o poză de familie sau chiar un moment recent. Alege fișierul original, nu unul salvat de pe WhatsApp, ca tabloul să iasă clar."
                    },
                    {
                        question: "Pot adăuga un mesaj sau text pe lângă poză?",
                        answer: "Da, configuratorul permite adăugarea unui text scurt (o urare, o dată, un mesaj) alături de fotografie, pentru un cadou și mai personal."
                    },
                    {
                        question: "Cât de repede ajunge comanda înainte de 8 Martie?",
                        answer: "Producția durează aproximativ 24h lucrătoare, plus livrarea prin curier — recomandăm să comanzi cu câteva zile înainte, mai ales aproape de dată, când volumul de comenzi crește."
                    },
                    {
                        question: "Vine gata de dăruit sau trebuie înrămat separat?",
                        answer: "Vine complet finisat, cu pânza întinsă pe șasiu de lemn și agățătoare montată — îl scoți din cutie și e gata de oferit sau agățat direct pe perete."
                    }
                ]}
            />

            {/* SEO CONTENT SECTION — conținut unic Tablou */}
            <section className="bg-white py-16 mt-16 border-t border-slate-100 rounded-3xl">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                            Un cadou de 8 Martie care nu se aruncă a doua zi
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            În loc de flori care se ofilesc, un <strong className="text-emerald-600">tablou canvas cu poza ei</strong> rămâne pe perete ani întregi. Alegi fotografia, adaugi un mesaj dacă vrei, iar noi îl transformăm într-un tablou de galerie gata de dăruit.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-emerald-500 pb-2 inline-block">Pentru cine funcționează</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                    <div>
                                        <strong className="block text-slate-900">Cadou pentru mama sau bunica</strong>
                                        <span className="text-slate-600 text-sm">O poză de familie sau din copilărie, transformată într-un tablou pe care îl va privi zilnic.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                    <div>
                                        <strong className="block text-slate-900">Cadou pentru soție sau iubită</strong>
                                        <span className="text-slate-600 text-sm">O poză de cuplu, cu un mesaj scurt adăugat direct pe tablou, pentru un cadou memorabil.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                    <div>
                                        <strong className="block text-slate-900">Cadou de la colegi pentru colega din birou</strong>
                                        <span className="text-slate-600 text-sm">O poză de echipă sau un mesaj de mulțumire, ca alternativă la florile clasice de 8 Martie.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
                            <h3 className="text-2xl font-bold text-slate-800 mb-6">Cum alegi poza potrivită</h3>
                            <p className="text-slate-600 mb-4 leading-relaxed">
                                Folosește poza originală, nu una salvată de pe rețele sociale, unde calitatea scade la comprimare. Cu cât fișierul e mai mare, cu atât tabloul iese mai clar, chiar și la dimensiuni generoase.
                            </p>
                            <p className="text-slate-600 leading-relaxed font-bold">
                                Pânza se întinde manual, cu atenție, deci recomandăm comanda cu câteva zile înainte de 8 Martie, mai ales dacă vrei livrare garantată la timp.
                            </p>
                        </div>
                    </div>

                    <div className="mt-16 border-t border-slate-200 pt-16">
                        <h3 className="text-3xl font-black text-slate-900 mb-8 text-center uppercase">Întrebări Frecvente</h3>
                        <div className="space-y-6 max-w-3xl mx-auto">
                            {[
                                {
                                    q: "Ce poză se potrivește cel mai bine pentru un cadou de 8 Martie?",
                                    a: "O poză cu mama, soția sau iubita ta — o amintire dragă, o poză de familie sau chiar un moment recent. Alege fișierul original, nu unul salvat de pe WhatsApp, ca tabloul să iasă clar."
                                },
                                {
                                    q: "Pot adăuga un mesaj sau text pe lângă poză?",
                                    a: "Da, configuratorul permite adăugarea unui text scurt (o urare, o dată, un mesaj) alături de fotografie, pentru un cadou și mai personal."
                                },
                                {
                                    q: "Cât de repede ajunge comanda înainte de 8 Martie?",
                                    a: "Producția durează aproximativ 24h lucrătoare, plus livrarea prin curier — recomandăm să comanzi cu câteva zile înainte, mai ales aproape de dată, când volumul de comenzi crește."
                                },
                                {
                                    q: "Vine gata de dăruit sau trebuie înrămat separat?",
                                    a: "Vine complet finisat, cu pânza întinsă pe șasiu de lemn și agățătoare montată — îl scoți din cutie și e gata de oferit sau agățat direct pe perete."
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
    );
}
