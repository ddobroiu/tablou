import { Suspense } from 'react';
import ConfiguratorDispatcher from "@/components/configurator/ConfiguratorDispatcher";
import ProductSchema from "@/components/ProductSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FAQSchema from "@/components/FAQSchema";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Șapcă Personalizată cu Text sau Logo - Cadou Unic | Tablou',
    description: 'Personalizează o șapcă cu textul, inițialele sau logo-ul tău. Print DTF rezistent la spălare și soare, mai multe culori, livrare rapidă. Idee de cadou pentru orice ocazie.',
    keywords: ['sapca personalizata', 'sapca cu text', 'cadou personalizat barbati', 'print dtf sapca', 'tablou'],
    alternates: {
        canonical: '/configurator/sepci',
    },
    openGraph: {
        title: 'Șapcă Personalizată cu Text sau Logo | Tablou',
        description: 'Alege culoarea, adaugă textul tău, comandă online.',
        images: ['/placeholder.png'],
    }
};

export default function SepciConfigPage() {
    return (
        <div className="pt-20">
            <BreadcrumbSchema
                items={[
                    { name: "Acasă", item: "/" },
                    { name: "Configuratoare", item: "/configurator" },
                    { name: "Șepci Personalizate", item: "/configurator/sepci" }
                ]}
            />
            <ProductSchema
                name="Șapcă Personalizată cu Text sau Logo"
                description="Șapcă personalizată cu textul sau logo-ul tău, print DTF rezistent la spălare și soare — idee de cadou pentru orice ocazie."
                image="/placeholder.png"
                url="/configurator/sepci"
                price="45.00"
            />
            <Suspense fallback={<div className="min-h-[60svh] flex items-center justify-center">Se încarcă configuratorul...</div>}>
                <ConfiguratorDispatcher configuratorId="sepci" />
            </Suspense>

            <FAQSchema
                faqs={[
                    {
                        question: "Pot pune doar text, fără logo sau imagine?",
                        answer: "Da — mulți clienți aleg doar un nume, o poreclă, o dată sau un mesaj scurt. Configuratorul îți permite să alegi fontul și poziția textului direct pe șapcă."
                    },
                    {
                        question: "Se șterge printul la spălare sau la soare?",
                        answer: "Nu, tehnologia DTF pe care o folosim rezistă bine la spălări repetate și la expunere solară — culorile rămân vii mult timp după prima purtare."
                    },
                    {
                        question: "Ce ocazii se potrivesc pentru o șapcă personalizată?",
                        answer: "Aniversări, majorate, cadouri pentru tată sau prieten, evenimente sportive de familie, sau pur și simplu un accesoriu cu un mesaj care contează pentru tine."
                    },
                    {
                        question: "Cât durează comanda?",
                        answer: "Producție rapidă (DTF nu are timp de uscare îndelungat), livrare prin curier de regulă în 24-48h."
                    }
                ]}
            />

            <section className="bg-white py-16 mt-16 border-t border-slate-100">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                            O șapcă cu mesajul tău, nu un model de raft
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            Alege culoarea, adaugă <strong className="text-emerald-600">text sau logo propriu</strong>, iar printul DTF rezistă la spălări repetate și soare — perfectă ca accesoriu zilnic sau cadou personalizat.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-emerald-500 pb-2 inline-block">Ce poți personaliza</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                    <div>
                                        <strong className="block text-slate-900">Text, inițiale sau logo</strong>
                                        <span className="text-slate-600 text-sm">Alegi ce anume vrei să apară — un nume, o dată, un mesaj sau propriul tău design.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                    <div>
                                        <strong className="block text-slate-900">Print DTF rezistent</strong>
                                        <span className="text-slate-600 text-sm">Nu crapă și nu se decolorează la spălări repetate, spre deosebire de broderie ieftină sau print termic simplu.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                    <div>
                                        <strong className="block text-slate-900">Comandă unică sau în set</strong>
                                        <span className="text-slate-600 text-sm">O singură șapcă pentru tine sau mai multe identice pentru un grup de prieteni/familie.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
                            <h3 className="text-2xl font-bold text-slate-800 mb-6">Idei de personalizare</h3>
                            <p className="text-slate-600 mb-4 leading-relaxed">
                                Numele sau porecla ta, o dată importantă, mesaj amuzant pentru un prieten, sau logo-ul unei afaceri mici — configuratorul funcționează la fel indiferent de ce vrei să scrii.
                            </p>
                            <p className="text-slate-600 leading-relaxed font-bold">
                                Pentru cel mai bun rezultat, folosește text scurt și clar — se citește mai bine de la distanță decât un paragraf lung.
                            </p>
                        </div>
                    </div>

                    <div className="mt-16 border-t border-slate-200 pt-16">
                        <h3 className="text-3xl font-black text-slate-900 mb-8 text-center uppercase">Întrebări Frecvente</h3>
                        <div className="space-y-6 max-w-3xl mx-auto">
                            {[
                                {
                                    q: "Pot pune doar text, fără logo sau imagine?",
                                    a: "Da — mulți clienți aleg doar un nume, o poreclă, o dată sau un mesaj scurt. Configuratorul îți permite să alegi fontul și poziția textului direct pe șapcă."
                                },
                                {
                                    q: "Se șterge printul la spălare sau la soare?",
                                    a: "Nu, tehnologia DTF pe care o folosim rezistă bine la spălări repetate și la expunere solară — culorile rămân vii mult timp după prima purtare."
                                },
                                {
                                    q: "Ce ocazii se potrivesc pentru o șapcă personalizată?",
                                    a: "Aniversări, majorate, cadouri pentru tată sau prieten, evenimente sportive de familie, sau pur și simplu un accesoriu cu un mesaj care contează pentru tine."
                                },
                                {
                                    q: "Cât durează comanda?",
                                    a: "Producție rapidă (DTF nu are timp de uscare îndelungat), livrare prin curier de regulă în 24-48h."
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
