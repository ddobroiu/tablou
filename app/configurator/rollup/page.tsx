import ConfiguratorDispatcher from "@/components/configurator/ConfiguratorDispatcher";
import ProductSchema from "@/components/ProductSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FAQSchema from "@/components/FAQSchema";
import { Metadata } from 'next';
import { Suspense } from "react";

export const metadata: Metadata = {
    title: 'Rollup Banner Personalizat pentru Evenimente | Tablou',
    description: 'Sistem rollup cu casetă din aluminiu, print HD și geantă de transport inclusă. Perfect pentru nunți, botezuri, aniversări sau standuri expoziționale. Preț instant.',
    keywords: ['rollup banner personalizat', 'rollup nunta', 'rollup eveniment', 'banner retractabil', 'rollup pret', 'tablou'],
    alternates: {
        canonical: '/configurator/rollup',
    },
};

export default function RollupPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Se încarcă configuratorul Rollup...</div>}>
            <BreadcrumbSchema
                items={[
                    { name: "Acasă", item: "/" },
                    { name: "Configuratoare", item: "/configurator" },
                    { name: "Rollup Banner", item: "/configurator/rollup" }
                ]}
            />
            <ProductSchema
                name="Rollup Banner Personalizat"
                description="Sistem rollup cu casetă din aluminiu, print HD și geantă de transport inclusă — pentru evenimente private sau standuri expoziționale."
                image="/products/rollup/rollup-1.webp"
                url="/configurator/rollup"
                price="150.00"
            />
            <div className="pt-20">
                <h1 className="sr-only">Rollup Banner Personalizat</h1>
                <ConfiguratorDispatcher configuratorId="rollup" />

                <FAQSchema
                    faqs={[
                        {
                            question: "Ce dimensiune aleg pentru un rollup de nuntă sau aniversare?",
                            answer: "Dimensiunea clasică 85 x 200 cm e cea mai ceruta — ușor de transportat și suficient de vizibil pentru un colț foto sau un panou de bun venit la eveniment. Pentru un fundal de poze mai amplu, mergem până la 150 x 200 cm."
                        },
                        {
                            question: "Se poate refolosi caseta cu un print nou, pentru un alt eveniment?",
                            answer: "Da — poți comanda doar materialul printat nou și îl montezi pe caseta existentă, sau ne trimiți sistemul complet și îl reîncărcăm noi cu tensiunea corectă în fabrică."
                        },
                        {
                            question: "Rezistă un rollup afară, la o nuntă în curte sau grădină?",
                            answer: "Nu este recomandat pentru exterior fără protecție — sistemele rollup sunt ușoare (sub 3 kg) și tija se poate răsturna la vânt. Pentru evenimente în aer liber, poziționează-l la adăpost (cort, foaier) sau alege un sistem X-Banner cu greutăți."
                        },
                        {
                            question: "Beneficiez de reducere dacă comand mai multe rollup-uri?",
                            answer: "Da, pentru comenzi de peste 10-15 bucăți (utile la evenimente cu mai multe zone foto sau standuri), coșul de cumpărături calculează automat discount-uri de scalare."
                        }
                    ]}
                />

                {/* SEO CONTENT SECTION — conținut unic Tablou */}
                <section className="bg-white py-16 mt-16 border-t border-slate-100">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                                Un rollup pentru evenimentul tău, nu doar pentru un stand
                            </h2>
                            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                                Colț foto la nuntă, panou de bun venit la botez, fundal pentru majorat sau reuniune de familie — sau, la fel de bine, un <strong className="text-orange-600">stand expozițional profesional</strong>. Ridicat și gata de folosit în sub 30 de secunde.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-orange-500 pb-2 inline-block">De ce iese diferit</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Material polipropilenă, stă drept</strong>
                                            <span className="text-slate-600 text-sm">Nu folosim PVC subțire, care se curbează pe margini în timp — materialul PP cu spate alb rămâne perfect întins la fotografii.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Sistem stabil, cu tălpi duble</strong>
                                            <span className="text-slate-600 text-sm">Caseta din aluminiu are arc calibrat și bază cu tălpi duble — stă bine chiar și în zone cu mai mulți invitați care trec pe lângă el.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Geantă de transport inclusă</strong>
                                            <span className="text-slate-600 text-sm">Vine preasamblat, într-o husă cu fermoar — îl arunci în portbagaj și e gata de montat direct la locația evenimentului.</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
                                <h3 className="text-2xl font-bold text-slate-800 mb-6">Cum pregătești grafica</h3>
                                <p className="text-slate-600 mb-4 leading-relaxed">
                                    Lasă o zonă moartă de minim 5-10 cm în partea de jos a designului — acești centimetri rămân prinși în rolă, invizibili odată ce rollup-ul e ridicat și tensionat.
                                </p>
                                <p className="text-slate-600 leading-relaxed font-bold">
                                    Pune elementele importante (nume, dată, mesaj) în partea superioară a compoziției, acolo unde privirea invitaților se duce natural.
                                </p>
                            </div>
                        </div>

                        {/* SEO FAQ Structured Schema */}
                        <div className="mt-16 border-t border-slate-200 pt-16">
                            <h3 className="text-3xl font-black text-slate-900 mb-8 text-center uppercase">Întrebări Frecvente Rollup Banner</h3>
                            <div className="space-y-6 max-w-3xl mx-auto">
                                {[
                                    {
                                        q: "Ce dimensiune aleg pentru un rollup de nuntă sau aniversare?",
                                        a: "Dimensiunea clasică 85 x 200 cm e cea mai ceruta — ușor de transportat și suficient de vizibil pentru un colț foto sau un panou de bun venit la eveniment. Pentru un fundal de poze mai amplu, mergem până la 150 x 200 cm."
                                    },
                                    {
                                        q: "Se poate refolosi caseta cu un print nou, pentru un alt eveniment?",
                                        a: "Da — poți comanda doar materialul printat nou și îl montezi pe caseta existentă, sau ne trimiți sistemul complet și îl reîncărcăm noi cu tensiunea corectă în fabrică."
                                    },
                                    {
                                        q: "Rezistă un rollup afară, la o nuntă în curte sau grădină?",
                                        a: "Nu este recomandat pentru exterior fără protecție — sistemele rollup sunt ușoare (sub 3 kg) și tija se poate răsturna la vânt. Pentru evenimente în aer liber, poziționează-l la adăpost (cort, foaier) sau alege un sistem X-Banner cu greutăți."
                                    },
                                    {
                                        q: "Beneficiez de reducere dacă comand mai multe rollup-uri?",
                                        a: "Da, pentru comenzi de peste 10-15 bucăți (utile la evenimente cu mai multe zone foto sau standuri), coșul de cumpărături calculează automat discount-uri de scalare."
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
