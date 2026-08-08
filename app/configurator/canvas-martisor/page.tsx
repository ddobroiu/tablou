import { Suspense } from 'react';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import ProductSchema from "@/components/ProductSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FAQSchema from "@/components/FAQSchema";

const CanvasMartisorConfigurator = dynamic(() => import('@/components/configurator/CanvasMartisorConfigurator'));

export const metadata: Metadata = {
    title: "Canvas Mărțișor Personalizat - Cadou de 1 Martie | Tablou",
    description: "Creează un cadou de mărțișor deosebit. Tablou canvas personalizat cu fotografia și textul tău, disponibil în dimensiuni mari pentru un impact maxim.",
    keywords: ['martisor', 'canvas martisor', 'cadou 1 martie', 'martisor personalizat', 'tablou canvas', 'tablou'],
    alternates: {
        canonical: '/configurator/canvas-martisor',
    },
};

export default function CanvasMartisorPage() {
    return (
        <>
            <div className="pt-20">
                <BreadcrumbSchema
                    items={[
                        { name: "Acasă", item: "/" },
                        { name: "Configuratoare", item: "/configurator" },
                        { name: "Canvas Mărțișor", item: "/configurator/canvas-martisor" }
                    ]}
                />
                <ProductSchema
                    name="Canvas Mărțișor Personalizat"
                    description="Tablou canvas personalizat cu fotografia și textul tău, cadou de mărțișor pentru 1 Martie."
                    image="/products/canvas/canvas-1.webp"
                    url="/configurator/canvas-martisor"
                    price="55.00"
                />
                <Suspense fallback={<div className="min-h-[60svh] flex items-center justify-center">Se încarcă configuratorul de mărțișoare...</div>}>
                    <div className="min-h-screen bg-transparent pb-20">
                        <CanvasMartisorConfigurator />
                    </div>
                </Suspense>

                <FAQSchema
                    faqs={[
                        {
                            question: "Un tablou canvas chiar ține loc de mărțișor tradițional?",
                            answer: "Nu înlocuiește micul mărțișor cu șnur roșu-alb, dar funcționează excelent ca un cadou suplimentar, mai personal, pentru 1 Martie — o poză sau un mesaj care rămâne pe perete, nu doar o zi."
                        },
                        {
                            question: "Ce dimensiune aleg pentru un cadou de mărțișor?",
                            answer: "Pentru un cadou de birou sau cameră, un format mediu e suficient. Dacă vrei impact vizual mai mare, configuratorul oferă și dimensiuni generoase, potrivite pentru un perete de living."
                        },
                        {
                            question: "Pot pune doar text, fără poză?",
                            answer: "Da, poți alege o compoziție doar cu un mesaj sau o urare de 1 Martie, fără fotografie — util dacă vrei un cadou simplu, dar tot personalizat."
                        },
                        {
                            question: "Cât durează livrarea înainte de 1 Martie?",
                            answer: "Producția durează aproximativ 24h lucrătoare, plus livrarea prin curier — recomandăm comanda cu câteva zile înainte, mai ales aproape de dată."
                        }
                    ]}
                />

                {/* SEO CONTENT SECTION — conținut unic Tablou */}
                <section className="bg-white py-16 mt-16 border-t border-slate-100">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                                Un mărțișor care rămâne pe perete, nu doar o zi
                            </h2>
                            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                                Pe lângă micul mărțișor tradițional, un <strong className="text-emerald-600">tablou canvas personalizat</strong> cu poza sau mesajul tău de 1 Martie e un cadou care rămâne mult timp, nu doar o zi de primăvară.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-emerald-500 pb-2 inline-block">Idei de cadou</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Pentru colege sau prietene</strong>
                                            <span className="text-slate-600 text-sm">O alternativă mai personală la florile sau bomboanele clasice de 1 Martie.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Pentru mama, bunica sau soră</strong>
                                            <span className="text-slate-600 text-sm">O poză de familie sau un mesaj scurt de primăvară, transformate într-un tablou de dăruit.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Cadou surpriză pentru fiica sau nepoata ta</strong>
                                            <span className="text-slate-600 text-sm">Un tablou vesel, cu textul sau poza aleasă de tine, potrivit pentru camera unui copil sau adolescent.</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
                                <h3 className="text-2xl font-bold text-slate-800 mb-6">Cum alegi fișierul potrivit</h3>
                                <p className="text-slate-600 mb-4 leading-relaxed">
                                    Dacă adaugi o poză, folosește fișierul original, nu unul salvat de pe rețele sociale — calitatea scade la comprimare, iar tabloul poate ieși neclar.
                                </p>
                                <p className="text-slate-600 leading-relaxed font-bold">
                                    Pentru un mesaj scurt de 1 Martie, textul clar și concis arată mai bine pe tablou decât un paragraf lung.
                                </p>
                            </div>
                        </div>

                        <div className="mt-16 border-t border-slate-200 pt-16">
                            <h3 className="text-3xl font-black text-slate-900 mb-8 text-center uppercase">Întrebări Frecvente</h3>
                            <div className="space-y-6 max-w-3xl mx-auto">
                                {[
                                    {
                                        q: "Un tablou canvas chiar ține loc de mărțișor tradițional?",
                                        a: "Nu înlocuiește micul mărțișor cu șnur roșu-alb, dar funcționează excelent ca un cadou suplimentar, mai personal, pentru 1 Martie — o poză sau un mesaj care rămâne pe perete, nu doar o zi."
                                    },
                                    {
                                        q: "Ce dimensiune aleg pentru un cadou de mărțișor?",
                                        a: "Pentru un cadou de birou sau cameră, un format mediu e suficient. Dacă vrei impact vizual mai mare, configuratorul oferă și dimensiuni generoase, potrivite pentru un perete de living."
                                    },
                                    {
                                        q: "Pot pune doar text, fără poză?",
                                        a: "Da, poți alege o compoziție doar cu un mesaj sau o urare de 1 Martie, fără fotografie — util dacă vrei un cadou simplu, dar tot personalizat."
                                    },
                                    {
                                        q: "Cât durează livrarea înainte de 1 Martie?",
                                        a: "Producția durează aproximativ 24h lucrătoare, plus livrarea prin curier — recomandăm comanda cu câteva zile înainte, mai ales aproape de dată."
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
