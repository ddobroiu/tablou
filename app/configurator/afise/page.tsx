import ConfiguratorDispatcher from "@/components/configurator/ConfiguratorDispatcher";
import ProductSchema from "@/components/ProductSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FAQSchema from "@/components/FAQSchema";
import { Metadata } from 'next';
import { Suspense } from "react";
import { SeoDimensionsLinks } from '@/components/SeoDimensionsLinks';

export const metadata: Metadata = {
    title: 'Poster Personalizat pentru Cameră sau Petrecere | Tablou',
    description: 'Printează un poster din poza sau designul tău — pentru cameră, ca decor de perete sau ca afiș mare la o petrecere privată. Formate A3 până la A0, hârtie foto sau Blueback outdoor.',
    keywords: ['poster personalizat', 'afis personalizat petrecere', 'poster camera decor', 'print poster online', 'afis a3 a2 a1 a0', 'tablou'],
    alternates: {
        canonical: '/configurator/afise',
    },
};

export default function AfisePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Se încarcă configuratorul de afișe...</div>}>
            <div className="pt-20">
                <h1 className="sr-only">Poster și Afiș Personalizat pentru Cameră sau Petrecere</h1>
                <BreadcrumbSchema
                    items={[
                        { name: "Acasă", item: "/" },
                        { name: "Configuratoare", item: "/configurator" },
                        { name: "Afișe și Postere", item: "/configurator/afise" }
                    ]}
                />
                <ProductSchema
                    name="Poster și Afiș Personalizat"
                    description="Poster personalizat din poza sau designul tău, pentru decor de cameră sau ca afiș mare la un eveniment privat — formate A3 până la A0."
                    image="/products/afise/afise-1.webp"
                    url="/configurator/afise"
                    price="15.00"
                />
                <ConfiguratorDispatcher configuratorId="afise" />

                <FAQSchema
                    faqs={[
                        {
                            question: "Ce format aleg pentru un poster de cameră?",
                            answer: "Pentru decor de perete în casă, A3 sau A2 sunt cele mai populare — se înrămează ușor și arată bine la înălțimea ochilor. Pentru un perete gol mare sau ca piesă centrală, A1 are impact vizual mai puternic."
                        },
                        {
                            question: "Pot printa un afiș mare pentru intrarea la o petrecere sau aniversare?",
                            answer: "Da — pentru afișe mari de exterior sau intrare (bun venit la nuntă, majorat, botez), recomandăm hârtia Blueback, rezistentă la umezeală, care nu transpare și rezistă bine dacă e lipită sau expusă câteva ore afară."
                        },
                        {
                            question: "Ce diferență e între hârtia foto și Blueback?",
                            answer: "Hârtia foto/whiteback (150-200g) e gândită pentru interior — culori clare, potrivită pentru rame sau panouri de expoziție. Blueback (115g, spate albastru) e pentru exterior — rezistă la umezeală și nu lasă imaginea să transpară dacă lipești peste alt poster."
                        },
                        {
                            question: "Cât durează comanda?",
                            answer: "Producție rapidă prin print digital, de regulă gata în 24h lucrătoare, plus livrarea prin curier — util dacă ai un eveniment programat peste câteva zile."
                        }
                    ]}
                />

                {/* SEO CONTENT SECTION — conținut unic Tablou */}
                <section className="bg-white py-16 mt-16 border-t border-slate-100">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                                Un poster cu care chiar vrei să-ți decorezi peretele
                            </h2>
                            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                                Poza ta, un citat preferat sau designul propriu, transformat într-un <strong className="text-orange-600">poster de la A3 până la A0</strong>. Perfect pentru camera ta, dar și pentru un afiș mare la intrarea unei petreceri sau aniversări private.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-orange-500 pb-2 inline-block">Idei de folosire</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Decor de cameră sau birou</strong>
                                            <span className="text-slate-600 text-sm">Hârtie foto mată sau lucioasă, gata de înrămat — un poster cu poza ta preferată, un citat sau un print artistic ales de tine.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Afiș pentru petrecere sau eveniment privat</strong>
                                            <span className="text-slate-600 text-sm">Bun venit la nuntă, panou pentru majorat, afiș pentru botez — dimensiuni mari (A1, A0), vizibile de la distanță.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Afiș pentru club, teatru sau conferință</strong>
                                            <span className="text-slate-600 text-sm">Formatele mari (A2-A0) rămân opțiunea potrivită și pentru promovare stradală sau vitrine, la calitate identică.</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
                                <h3 className="text-2xl font-bold text-slate-800 mb-6">Ce hârtie să alegi</h3>
                                <p className="text-slate-600 mb-4 leading-relaxed">
                                    Pentru interior (cameră, birou, panouri expoziționale), alege hârtia foto/whiteback — culori clare, se mulează bine în rame click-frame. Pentru exterior sau afișe lipite pe o suprafață (intrare petrecere, vitrină), Blueback rezistă la umezeală și nu transpare.
                                </p>
                                <p className="text-slate-600 leading-relaxed font-bold">
                                    Trimite fișierul în format CMYK (.PDF, .TIFF), la cel puțin 150-300 dpi, cu fonturile transformate în curbe pentru cel mai bun rezultat.
                                </p>
                            </div>
                        </div>

                        {/* SEO FAQ Structured Schema */}
                        <div className="mt-16 border-t border-slate-200 pt-16">
                            <h3 className="text-3xl font-black text-slate-900 mb-8 text-center uppercase">Întrebări Frecvente Postere și Afișe</h3>
                            <div className="space-y-6 max-w-3xl mx-auto">
                                {[
                                    {
                                        q: "Ce format aleg pentru un poster de cameră?",
                                        a: "Pentru decor de perete în casă, A3 sau A2 sunt cele mai populare — se înrămează ușor și arată bine la înălțimea ochilor. Pentru un perete gol mare sau ca piesă centrală, A1 are impact vizual mai puternic."
                                    },
                                    {
                                        q: "Pot printa un afiș mare pentru intrarea la o petrecere sau aniversare?",
                                        a: "Da — pentru afișe mari de exterior sau intrare (bun venit la nuntă, majorat, botez), recomandăm hârtia Blueback, rezistentă la umezeală, care nu transpare și rezistă bine dacă e lipită sau expusă câteva ore afară."
                                    },
                                    {
                                        q: "Ce diferență e între hârtia foto și Blueback?",
                                        a: "Hârtia foto/whiteback (150-200g) e gândită pentru interior — culori clare, potrivită pentru rame sau panouri de expoziție. Blueback (115g, spate albastru) e pentru exterior — rezistă la umezeală și nu lasă imaginea să transpară dacă lipești peste alt poster."
                                    },
                                    {
                                        q: "Cât durează comanda?",
                                        a: "Producție rapidă prin print digital, de regulă gata în 24h lucrătoare, plus livrarea prin curier — util dacă ai un eveniment programat peste câteva zile."
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
                <SeoDimensionsLinks
                    productId="afise"
                    productName="Poster HD"
                    currentW={50}
                    currentH={70}
                />
            </div>
        </Suspense>
    );
}
