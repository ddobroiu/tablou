import ConfiguratorDispatcher from "@/components/configurator/ConfiguratorDispatcher";
import ProductSchema from "@/components/ProductSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FAQSchema from "@/components/FAQSchema";
import { Metadata } from 'next';
import { Suspense } from "react";

export const metadata: Metadata = {
    title: 'Panouri Polipropilenă pentru Proiecte Personale și Grădină | Tablou',
    description: 'Panouri ușoare din polipropilenă celulară, rezistente la apă — perfecte pentru indicatoare de grădină, panouri de eveniment sau proiecte DIY de casă. Preț instant.',
    keywords: ['panou polipropilena personal', 'indicator gradina personalizat', 'panou eveniment diy', 'akyplac', 'tablou'],
};

export default function PolipropilenaPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Se încarcă configuratorul Polipropilenă...</div>}>
            <div className="pt-20">
                <h1 className="sr-only">Panouri Polipropilenă pentru Proiecte Personale și Grădină</h1>
                <BreadcrumbSchema
                    items={[
                        { name: "Acasă", item: "/" },
                        { name: "Materiale", item: "/materiale" },
                        { name: "Polipropilenă Celulară", item: "/materiale/polipropilena" }
                    ]}
                />
                <ProductSchema
                    name="Panou Polipropilenă Celulară pentru Proiecte Personale"
                    description="Panou ușor și rezistent la apă din polipropilenă celulară, potrivit pentru indicatoare de grădină, panouri de eveniment sau proiecte DIY."
                    image="/products/master/placi-polipropilena-alveolara-canalit-ieftine.png"
                    url="/materiale/polipropilena"
                    price="25.00"
                />
                <ConfiguratorDispatcher configuratorId="polipropilena" />

                <FAQSchema
                    faqs={[
                        {
                            question: "Se potrivește pentru un indicator de grădină sau curte?",
                            answer: "Da — fiind rezistent la apă și ușor, e ideal pentru indicatoare montate afară (numărul casei, direcții, panouri decorative de grădină) care rămân neschimbate ani la rând."
                        },
                        {
                            question: "Pot face un panou pentru o petrecere sau eveniment de familie?",
                            answer: "Sigur — panourile de bun venit, indicatoare de parcare la nuntă sau afișe de eveniment ies bine pe acest material, fiind ușor de transportat și montat."
                        },
                        {
                            question: "Se taie ușor dacă vreau o formă personalizată?",
                            answer: "Da, materialul se pretează la tăiere pe contur — poți cere o formă diferită de dreptunghi standard, ideal pentru proiecte creative."
                        },
                        {
                            question: "Cât durează comanda?",
                            answer: "Producție rapidă prin print UV, livrare prin curier de regulă în 24-48h — bun de planificat cu câteva zile înainte de eveniment."
                        }
                    ]}
                />

                {/* SEO CONTENT SECTION — conținut unic Tablou */}
                <section className="bg-white py-16 mt-16 border-t border-slate-100">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                                Nu e doar pentru firme — merge și pentru proiectele tale
                            </h2>
                            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                                Polipropilena celulară e <strong className="text-emerald-600">ușoară și rezistentă la apă</strong> — perfectă pentru indicatoare de grădină, panouri de eveniment sau orice proiect DIY care stă afară, la soare și ploaie.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-emerald-500 pb-2 inline-block">Idei de proiecte personale</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Indicator numărul casei sau al străzii</strong>
                                            <span className="text-slate-600 text-sm">Rămâne neschimbat afară ani la rând, fără să se decoloreze sau deformeze de la umezeală.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Panouri pentru nuntă sau botez</strong>
                                            <span className="text-slate-600 text-sm">Indicatoare de parcare, direcții sau panouri decorative la intrare — ușor de transportat și montat rapid.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Decor de grădină, formă personalizată</strong>
                                            <span className="text-slate-600 text-sm">Se poate tăia pe contur, nu doar dreptunghi — bun pentru siluete sau forme creative.</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
                                <h3 className="text-2xl font-bold text-slate-800 mb-6">Ce grosime să alegi</h3>
                                <p className="text-slate-600 mb-4 leading-relaxed">
                                    3mm e suficient pentru panouri mici, montate protejat. Pentru panouri mai mari sau expuse direct la vânt, 5mm rezistă mai bine.
                                </p>
                                <p className="text-slate-600 leading-relaxed font-bold">
                                    Sfat de montaj: fixează din mai multe puncte, nu doar din colțuri, ca panoul să nu se îndoaie la vânt.
                                </p>
                            </div>
                        </div>

                        <div className="mt-16 border-t border-slate-200 pt-16">
                            <h3 className="text-3xl font-black text-slate-900 mb-8 text-center uppercase">Întrebări Frecvente</h3>
                            <div className="space-y-6 max-w-3xl mx-auto">
                                {[
                                    {
                                        q: "Se potrivește pentru un indicator de grădină sau curte?",
                                        a: "Da — fiind rezistent la apă și ușor, e ideal pentru indicatoare montate afară (numărul casei, direcții, panouri decorative de grădină) care rămân neschimbate ani la rând."
                                    },
                                    {
                                        q: "Pot face un panou pentru o petrecere sau eveniment de familie?",
                                        a: "Sigur — panourile de bun venit, indicatoare de parcare la nuntă sau afișe de eveniment ies bine pe acest material, fiind ușor de transportat și montat."
                                    },
                                    {
                                        q: "Se taie ușor dacă vreau o formă personalizată?",
                                        a: "Da, materialul se pretează la tăiere pe contur — poți cere o formă diferită de dreptunghi standard, ideal pentru proiecte creative."
                                    },
                                    {
                                        q: "Cât durează comanda?",
                                        a: "Producție rapidă prin print UV, livrare prin curier de regulă în 24-48h — bun de planificat cu câteva zile înainte de eveniment."
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
