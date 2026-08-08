import ConfiguratorDispatcher from "@/components/configurator/ConfiguratorDispatcher";
import ProductSchema from "@/components/ProductSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FAQSchema from "@/components/FAQSchema";
import { Metadata } from 'next';
import { Suspense } from "react";

export const metadata: Metadata = {
    title: 'Fototapet Personalizat din Poza Ta - Decor Cameră | Tablou',
    description: 'Transformă un perete din camera ta, a copilului sau din living cu un fototapet din poza sau designul tău. Material vinilic lavabil, print HD, croit exact pe măsura peretelui.',
    keywords: ['fototapet personalizat', 'tapet din poza', 'tapet camera copil', 'tapet living personalizat', 'decor perete poza', 'tablou'],
    alternates: {
        canonical: '/configurator/tapet',
    },
};

export default function TapetPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Se încarcă configuratorul de tapet...</div>}>
            <div className="pt-20">
                <h1 className="sr-only">Fototapet Personalizat din Poza Ta</h1>
                <BreadcrumbSchema
                    items={[
                        { name: "Acasă", item: "/" },
                        { name: "Configuratoare", item: "/configurator" },
                        { name: "Tapet Personalizat", item: "/configurator/tapet" }
                    ]}
                />
                <ProductSchema
                    name="Fototapet Personalizat"
                    description="Fototapet vinilic lavabil, printat cu poza sau designul tău, croit pe măsura exactă a peretelui — pentru cameră, living sau camera copiilor."
                    image="/products/tapet/tapet-1.webp"
                    url="/configurator/tapet"
                    price="80.00"
                />
                <ConfiguratorDispatcher configuratorId="tapet" />

                <FAQSchema
                    faqs={[
                        {
                            question: "Pot folosi o poză de-a mea pentru un perete întreg?",
                            answer: "Da, dar imaginea trebuie să fie de rezoluție mare — o poză obișnuită de telefon, la mărire pe un perete întreg, va ieși neclară. Pentru rezultate bune folosim și arhive foto de calitate, dacă nu ai o poză proprie suficient de mare."
                        },
                        {
                            question: "Se potrivește pentru camera unui copil?",
                            answer: "Este una dintre cele mai apreciate folosiri — un perete cu tematica preferată a copilului (spațiu, animale, personaje) transformă camera fără să fie nevoie de zugrăvit sau renovare."
                        },
                        {
                            question: "Din câte bucăți vine tapetul pentru un perete mare?",
                            answer: "Materialul vine pe role de 1.05m sau 1.37m lățime, deci pentru un perete de câțiva metri primești designul împărțit în fâșii verticale, cu o mică suprapunere marcată pentru montaj fără linii vizibile."
                        },
                        {
                            question: "Cum se montează și se curăță ulterior?",
                            answer: "Se aplică cu adeziv pe perete curat și amorsat, ca la o vopsea. Fiind lavabil, se curăță ușor cu buretele, fără produse chimice agresive — practic pentru camere de copii sau bucătării."
                        }
                    ]}
                />

                {/* SEO CONTENT SECTION — conținut unic Tablou */}
                <section className="bg-white py-16 mt-16 border-t border-slate-100">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                                Un perete cu poza sau ideea ta, nu un model din magazin
                            </h2>
                            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                                Fototapetul e felul cel mai rapid de a transforma un perete gol — <strong className="text-emerald-600">poza ta preferată</strong>, o hartă, o tematică pentru camera copilului sau o textură discretă pentru living. Material vinilic lavabil, croit exact pe măsura peretelui tău.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-emerald-500 pb-2 inline-block">Idei de folosire acasă</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Perete de accent în living sau dormitor</strong>
                                            <span className="text-slate-600 text-sm">O poză de familie mărită, un peisaj sau o textură discretă (piatră, lemn) — fără să repictezi toată camera.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Camera copilului, pe tematica lui preferată</strong>
                                            <span className="text-slate-600 text-sm">Spațiu, dinozauri, personaje sau harta lumii — transformi camera într-un decor, nu doar un perete pictat.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Fără tipare repetitive de la bricolaj</strong>
                                            <span className="text-slate-600 text-sm">Nu ești limitat la modele standard — designul e croit special pentru suprafața și proiectul tău, fără pierderi.</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
                                <h3 className="text-2xl font-bold text-slate-800 mb-6">Cum măsori peretele corect</h3>
                                <p className="text-slate-600 mb-4 leading-relaxed">
                                    Când introduci lățimea și înălțimea camerei tale în configurator, adaugă 3-5 cm în plus, perimetral. Niciun perete nu e perfect drept din construcție, iar acea marjă te ajută mult la tăietura finală, la fața locului.
                                </p>
                                <p className="text-slate-600 leading-relaxed font-bold">
                                    Materialul e vinilic, de minim 350g, lavabil — se curăță cu buretele, ideal pentru camere cu risc de pete (bucătărie, hol, camera copiilor).
                                </p>
                            </div>
                        </div>

                        {/* SEO FAQ Structured Schema */}
                        <div className="mt-16 border-t border-slate-200 pt-16">
                            <h3 className="text-3xl font-black text-slate-900 mb-8 text-center uppercase">Întrebări Frecvente Fototapet</h3>
                            <div className="space-y-6 max-w-3xl mx-auto">
                                {[
                                    {
                                        q: "Pot folosi o poză de-a mea pentru un perete întreg?",
                                        a: "Da, dar imaginea trebuie să fie de rezoluție mare — o poză obișnuită de telefon, la mărire pe un perete întreg, va ieși neclară. Pentru rezultate bune folosim și arhive foto de calitate, dacă nu ai o poză proprie suficient de mare."
                                    },
                                    {
                                        q: "Se potrivește pentru camera unui copil?",
                                        a: "Este una dintre cele mai apreciate folosiri — un perete cu tematica preferată a copilului (spațiu, animale, personaje) transformă camera fără să fie nevoie de zugrăvit sau renovare."
                                    },
                                    {
                                        q: "Din câte bucăți vine tapetul pentru un perete mare?",
                                        a: "Materialul vine pe role de 1.05m sau 1.37m lățime, deci pentru un perete de câțiva metri primești designul împărțit în fâșii verticale, cu o mică suprapunere marcată pentru montaj fără linii vizibile."
                                    },
                                    {
                                        q: "Cum se montează și se curăță ulterior?",
                                        a: "Se aplică cu adeziv pe perete curat și amorsat, ca la o vopsea. Fiind lavabil, se curăță ușor cu buretele, fără produse chimice agresive — practic pentru camere de copii sau bucătării."
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
        </Suspense>
    );
}
