import ConfiguratorDispatcher from "@/components/configurator/ConfiguratorDispatcher";
import ProductSchema from "@/components/ProductSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FAQSchema from "@/components/FAQSchema";
import { Metadata } from 'next';
import { Suspense } from "react";

export const metadata: Metadata = {
    title: 'Pliante Personalizate - Pliere Z-fold, C-fold | Tablou',
    description: 'Comandă pliante publicitare personalizate. Diverse tipuri de împăturire, hârtie premium 115g-250g. Preț instant și livrare rapidă.',
    keywords: ['pliante personalizate', 'broșuri', 'print pliante', 'tablou', 'flyere îndoite', 'marketing offline', 'pliante ieftine'],
    alternates: {
        canonical: '/configurator/pliante',
    },
};

export default function PliantePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Se încarcă configuratorul Pliante...</div>}>
            <div className="pt-20">
                <h1 className="sr-only">Pliante și Broșuri Personalizate</h1>
                <BreadcrumbSchema
                    items={[
                        { name: "Acasă", item: "/" },
                        { name: "Configuratoare", item: "/configurator" },
                        { name: "Pliante", item: "/configurator/pliante" }
                    ]}
                />
                <ProductSchema
                    name="Pliante și Broșuri Personalizate"
                    description="Pliante publicitare personalizate, cu tipuri de împăturire Z-fold, C-fold sau Window, pe hârtie premium 115g-250g."
                    image="/products/pliante/pliante-1.webp"
                    url="/configurator/pliante"
                    price="1.00"
                />
                <ConfiguratorDispatcher configuratorId="pliante" />

                <FAQSchema
                    faqs={[
                        {
                            question: "Care este deosebirea dintre flyer și pliant?",
                            answer: "Flyerul este o coală simplă, neîndoită. Pliantul pleacă tot de la o coală plată, dar este trecut printr-un echipament de fălțuire care o îndoaie în două sau trei (Z-fold, C-fold, acordeon), generând mai multe pagini vizibil separate, ca la o mini-broșură."
                        },
                        {
                            question: "Pliurile sunt drepte, sau necesită atenție la finisare?",
                            answer: "Predăm produsul finit — folosim biguire mecanică (un proces care slăbește fibra hârtiei), pentru ca hârtiile groase să se plieze la unghi drept, fără să crape la curbură."
                        },
                        {
                            question: "Pentru ce se folosesc de obicei pliantele?",
                            answer: "Broșuri de prezentare, liste de prețuri, cataloage rapide sau materiale de informare care au nevoie de mai multe pagini decât încape pe un singur flyer."
                        }
                    ]}
                />

                {/* SEO CONTENT SECTION */}
                <section className="bg-white py-16 mt-16 border-t border-slate-100">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                                Pliante și Broșuri (Z-fold, C-fold, Window)
                            </h2>
                            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                                Pliante cu îndoiri duble sau triple, tipizate pentru o prezentare mai amplă decât un flyer simplu. Ideale pentru <strong className="text-orange-600">broșuri de informare, liste de prețuri</strong> sau cataloage rapide.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-orange-500 pb-2 inline-block">Rolul unui Pliant bine executat:</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Creează poveste (Storytelling)</strong>
                                            <span className="text-slate-600 text-sm">Spre deosebire de un fluturaș standard (vizualizare brutală), Pliantul forțează omul să depună un efort de "descoperire". Acțiunea de Despăturire e un declanșator psihologic pentru ca interesul să fie menținut de la prima pagină la ofertele din interior.</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
                                <h3 className="text-2xl font-bold text-slate-800 mb-6">Pregătire pliuri</h3>
                                <p className="text-slate-600 mb-4 leading-relaxed">
                                    Atenție din nou la marginile de tăiere (Bleed de 3-5mm pe contur) iar laturile ce urmează a fi ascunse / îndoite pe interior trebuie făcute pe ecran cu fix 1mm - 2mm mai scurte decât fețele frontale, pentru ca pagina să nu agațe atunci când se va plia definitiv!
                                </p>
                            </div>
                        </div>

                        {/* SEO FAQ Structured Schema */}
                        <div className="mt-16 border-t border-slate-200 pt-16">
                            <h3 className="text-3xl font-black text-slate-900 mb-8 text-center uppercase">Întrebări Frecvente Pliante</h3>
                            <div className="space-y-6 max-w-3xl mx-auto">
                                {[
                                    {
                                        q: "Care este deosebirea dintre flyer și pliant?",
                                        a: "Flyerul este o coală simplă, neîndoită. Pliantul pleacă tot de la o coală plată, dar este trecut printr-un echipament de fălțuire care o îndoaie în două sau trei (Z-fold, C-fold, acordeon), generând mai multe pagini vizibil separate, ca la o mini-broșură."
                                    },
                                    {
                                        q: "Pliurile sunt drepte, sau necesită atenție la finisare?",
                                        a: "Predăm produsul finit — folosim biguire mecanică (un proces care slăbește fibra hârtiei), pentru ca hârtiile groase să se plieze la unghi drept, fără să crape la curbură."
                                    },
                                    {
                                        q: "Pentru ce se folosesc de obicei pliantele?",
                                        a: "Broșuri de prezentare, liste de prețuri, cataloage rapide sau materiale de informare care au nevoie de mai multe pagini decât încape pe un singur flyer."
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
