import React, { Suspense } from "react";
import ConfiguratorDispatcher from "@/components/configurator/ConfiguratorDispatcher";
import ProductSchema from "@/components/ProductSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FAQSchema from "@/components/FAQSchema";

export const metadata = {
    title: 'Banner Față-Verso pentru Evenimente - Blockout | Tablou',
    description: 'Banner printat pe ambele fețe, material 100% opac, perfect pentru un banner de intrare la petrecere, suspendat sau perpendicular pe stradă. Preț instant.',
    keywords: ['banner fata-verso', 'banner petrecere', 'banner blockout', 'banner eveniment doua fete', 'tablou'],
    alternates: { canonical: "/configurator/banner-verso" },
};

export default function BannerVersoPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Se încarcă configuratorul Banner Verso...</div>}>
            <div className="pt-20">
                <h1 className="sr-only">Banner Față-Verso pentru Evenimente</h1>
                <BreadcrumbSchema
                    items={[
                        { name: "Acasă", item: "/" },
                        { name: "Configuratoare", item: "/configurator" },
                        { name: "Banner Față-Verso", item: "/configurator/banner-verso" }
                    ]}
                />
                <ProductSchema
                    name="Banner Față-Verso Blockout"
                    description="Banner printat pe ambele fețe, material 100% opac — perfect pentru un banner de intrare la eveniment, vizibil din ambele direcții."
                    image="/products/master/banner-blockout-personalizat-dubla-fata.png"
                    url="/configurator/banner-verso"
                    price="45.00"
                />
                <ConfiguratorDispatcher configuratorId="banner-verso" />

                {/* SEO CONTENT SECTION — conținut unic Tablou */}
                <section className="bg-white py-16 mt-16 border-t border-slate-100">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                                Un banner vizibil din ambele părți, la intrarea evenimentului
                            </h2>
                            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                                Dacă bannerul tău atârnă suspendat sau se vede din ambele sensuri (intrare la petrecere, panou perpendicular pe stradă), un banner obișnuit nu e suficient. <strong className="text-orange-600">Materialul Blockout (dublă față)</strong> e 100% opac — grafica de pe o parte nu se vede prin cealaltă.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-orange-500 pb-2 inline-block">De ce merită un banner blockout</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Structură complet opacă</strong>
                                            <span className="text-slate-600 text-sm">O peliculă neagră între cele două straturi de material blochează fizic lumina — chiar cu soarele în spate, grafica din cealaltă parte nu „transpare".</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Un singur banner, două mesaje</strong>
                                            <span className="text-slate-600 text-sm">La intrarea la o petrecere sau nuntă cu banner suspendat, invitații îl văd la fel de clar venind din ambele direcții.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Material rezistent, mai gros</strong>
                                            <span className="text-slate-600 text-sm">Fiind ranforsat pentru cele două straturi, rezistă bine la vânt dacă bannerul e montat afară, la petrecere în curte sau grădină.</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
                                <h3 className="text-2xl font-bold text-slate-800 mb-6">Cum pregătești comanda</h3>
                                <p className="text-slate-600 mb-4 leading-relaxed">
                                    Pentru că tipărim pe ambele părți ale aceluiași material, specifică la comandă dacă vrei <strong className="text-black">grafică identică</strong> pe ambele fețe sau <strong className="text-black">fețe diferite</strong> (util dacă ai un mesaj pentru sosire și altul pentru plecare).
                                </p>
                                <p className="text-slate-600 leading-relaxed font-bold text-sm">
                                    Încarcă fișierul ca PDF cu 2 pagini — pagina 1 pentru fața vizibilă la intrare, pagina 2 pentru spate.
                                </p>
                            </div>
                        </div>

                        {/* SEO FAQ Structured Schema */}
                        <div className="mt-16 border-t border-slate-200 pt-16">
                            <h3 className="text-3xl font-black text-slate-900 mb-8 text-center uppercase">Întrebări Frecvente Blockout Față-Verso</h3>
                            <div className="space-y-6 max-w-3xl mx-auto">
                                {[
                                    {
                                        q: "Materialul este mai gros sau mai greu decât un banner normal?",
                                        a: "Da, materialul blockout are de obicei o greutate mai mare (între 500g și 610g/mp), fiind ranforsat pentru stabilitate mai bună la vânt puternic."
                                    },
                                    {
                                        q: "Ce finisaje sunt incluse?",
                                        a: "La fel ca la bannerele clasice, primești gratuit capse pe tot perimetrul de prindere, iar la cerere putem adăuga buzunare (sus și jos) pentru a introduce o rangă de întindere, dacă bannerul se montează suspendat tip steag."
                                    },
                                    {
                                        q: "Se potrivește pentru o petrecere sau eveniment privat?",
                                        a: "Da — mai ales dacă bannerul se montează la intrare, suspendat, sau perpendicular pe alee, unde va fi văzut din ambele sensuri de mișcare a invitaților."
                                    },
                                    {
                                        q: "Cât durează comanda?",
                                        a: "Producție de regulă în 24-48h lucrătoare, plus livrarea prin curier — planifică din timp dacă ai un eveniment cu dată fixă."
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
                <FAQSchema
                    faqs={[
                        {
                            question: "Materialul este mai gros sau mai greu decât un banner normal?",
                            answer: "Da, materialul blockout are de obicei o greutate mai mare (între 500g și 610g/mp), fiind ranforsat pentru stabilitate mai bună la vânt puternic."
                        },
                        {
                            question: "Ce finisaje sunt incluse?",
                            answer: "La fel ca la bannerele clasice, primești gratuit capse pe tot perimetrul de prindere, iar la cerere putem adăuga buzunare (sus și jos) pentru a introduce o rangă de întindere, dacă bannerul se montează suspendat tip steag."
                        },
                        {
                            question: "Se potrivește pentru o petrecere sau eveniment privat?",
                            answer: "Da — mai ales dacă bannerul se montează la intrare, suspendat, sau perpendicular pe alee, unde va fi văzut din ambele sensuri de mișcare a invitaților."
                        },
                        {
                            question: "Cât durează comanda?",
                            answer: "Producție de regulă în 24-48h lucrătoare, plus livrarea prin curier — planifică din timp dacă ai un eveniment cu dată fixă."
                        }
                    ]}
                />
            </div>
        </Suspense>
    );
}
