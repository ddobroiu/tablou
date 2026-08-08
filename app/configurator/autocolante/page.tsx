import { Suspense } from 'react';
import ConfiguratorDispatcher from "@/components/configurator/ConfiguratorDispatcher";
import ProductSchema from "@/components/ProductSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FAQSchema from "@/components/FAQSchema";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Stickere Personalizate pentru Laptop, Sticlă și Decor | Tablou',
    description: 'Creează-ți propriile stickere personalizate — pentru laptop, sticlă de apă, jurnal sau decor. Tăiere pe contur, forme oricât de complexe, comandă online.',
    keywords: ['stickere personalizate', 'autocolante laptop', 'stickere decor', 'tablou', 'stickere design propriu'],
    alternates: {
        canonical: '/configurator/autocolante',
    },
};

export default function AutocolantePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Se încarcă configuratorul de autocolante...</div>}>
            <div className="pt-20">
                <h1 className="sr-only">Stickere Personalizate pentru Laptop, Sticlă și Decor</h1>
                <BreadcrumbSchema
                    items={[
                        { name: "Acasă", item: "/" },
                        { name: "Configuratoare", item: "/configurator" },
                        { name: "Autocolante Personalizate", item: "/configurator/autocolante" }
                    ]}
                />
                <ProductSchema
                    name="Stickere Personalizate"
                    description="Stickere personalizate pe vinyl Oracal, tăiate pe contur — pentru laptop, sticlă, jurnal sau decor, din designul tău."
                    image="/products/autocolante/autocolante-1.webp"
                    url="/configurator/autocolante"
                    price="35.00"
                />
                <ConfiguratorDispatcher configuratorId="autocolante" />

                <FAQSchema
                    faqs={[
                        {
                            question: "Pot să-mi fac propriul design de sticker, chiar dacă nu sunt designer?",
                            answer: "Da — încarci orice imagine sau desen, chiar și un scan de pe hârtie, iar noi ne ocupăm de curățarea și tăierea pe contur. Nu ai nevoie de fișier vectorial perfect."
                        },
                        {
                            question: "Se lipesc bine pe laptop sau sticlă, fără să lase urme?",
                            answer: "Da, adezivul e permanent dar de calitate — nu lasă reziduuri groase la dezlipire și nu atacă suprafața pe care e aplicat."
                        },
                        {
                            question: "Pot comanda un singur sticker, ca test?",
                            answer: "Da, poți începe cu o cantitate mică — perfect dacă vrei să testezi un design înainte să comanzi mai multe pentru prieteni sau ca set de colecție."
                        },
                        {
                            question: "Rezistă la spălat, dacă le pun pe sticla de apă?",
                            answer: "Cu print UV impermeabil, da — și dacă alegi laminare, rezistă și mai bine la frecare și spălări repetate."
                        }
                    ]}
                />

                {/* SEO CONTENT SECTION — conținut unic Tablou */}
                <section className="bg-white py-16 mt-16 border-t border-slate-100">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                                Stickerele tale, exact cum le-ai imaginat
                            </h2>
                            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                                Pentru laptop, sticlă de apă, jurnal sau pur și simplu ca hobby — <strong className="text-emerald-600">tăiem orice formă</strong> pe vinyl Oracal, din desenul sau poza ta, fără minim de comandă mare.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-emerald-500 pb-2 inline-block">Ce poți face cu ele</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Sticker individual, formă complexă</strong>
                                            <span className="text-slate-600 text-sm">Tăiere pe contur digitală, care urmărește exact marginile desenului — nu doar un dreptunghi cu fundal alb.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Set de stickere pentru cadou</strong>
                                            <span className="text-slate-600 text-sm">Comandă mai multe modele diferite deodată — idee simpată de cadou pentru cineva pasionat de un anumit stil.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Rezistă la manevrare zilnică</strong>
                                            <span className="text-slate-600 text-sm">Laminare opțională pentru sticlele de apă sau lucrurile pe care le atingi des — nu se decojesc rapid.</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
                                <h3 className="text-2xl font-bold text-slate-800 mb-6">Nu ai fișier "perfect"? Nu-i nimic</h3>
                                <p className="text-slate-600 mb-4 leading-relaxed">
                                    Ideal e un fișier vectorial (.PDF, .AI, .EPS), dar dacă ai doar o poză, un scan sau un desen făcut de mână, îl trimiți așa cum e.
                                </p>
                                <p className="text-slate-600 leading-relaxed">
                                    Echipa noastră de DTP curăță conturul și pregătește linia de tăiere gratuit, ca stickerul să iasă exact pe forma dorită.
                                </p>
                            </div>
                        </div>

                        <div className="mt-16 border-t border-slate-200 pt-16">
                            <h3 className="text-3xl font-black text-slate-900 mb-8 text-center uppercase">Întrebări Frecvente</h3>
                            <div className="space-y-6 max-w-3xl mx-auto">
                                {[
                                    {
                                        q: "Pot să-mi fac propriul design de sticker, chiar dacă nu sunt designer?",
                                        a: "Da — încarci orice imagine sau desen, chiar și un scan de pe hârtie, iar noi ne ocupăm de curățarea și tăierea pe contur. Nu ai nevoie de fișier vectorial perfect."
                                    },
                                    {
                                        q: "Se lipesc bine pe laptop sau sticlă, fără să lase urme?",
                                        a: "Da, adezivul e permanent dar de calitate — nu lasă reziduuri groase la dezlipire și nu atacă suprafața pe care e aplicat."
                                    },
                                    {
                                        q: "Pot comanda un singur sticker, ca test?",
                                        a: "Da, poți începe cu o cantitate mică — perfect dacă vrei să testezi un design înainte să comanzi mai multe pentru prieteni sau ca set de colecție."
                                    },
                                    {
                                        q: "Rezistă la spălat, dacă le pun pe sticla de apă?",
                                        a: "Cu print UV impermeabil, da — și dacă alegi laminare, rezistă și mai bine la frecare și spălări repetate."
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
