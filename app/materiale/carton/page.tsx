import ConfiguratorDispatcher from "@/components/configurator/ConfiguratorDispatcher";
import ProductSchema from "@/components/ProductSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FAQSchema from "@/components/FAQSchema";
import { Metadata } from 'next';
import { Suspense } from "react";

export const metadata: Metadata = {
    title: 'Carton Personalizat - Ondulat și Fagure (Honeycomb) | Tablou',
    description: 'Comandă plăci din carton ondulat sau fagure personalizate. Soluții eco-friendly, ușoare, pentru display-uri, panouri temporare sau semnalistică indoor. Preț instant.',
    keywords: ['carton personalizat', 'carton ondulat', 'carton fagure', 'display carton', 'panou carton usor', 'tablou'],
    alternates: {
        canonical: '/materiale/carton',
    },
};

export default function CartonPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Se încarcă configuratorul Carton...</div>}>
            <div className="pt-20">
                <h1 className="sr-only">Carton Personalizat (Ondulat & Fagure)</h1>
                <BreadcrumbSchema
                    items={[
                        { name: "Acasă", item: "/" },
                        { name: "Materiale", item: "/materiale" },
                        { name: "Carton", item: "/materiale/carton" }
                    ]}
                />
                <ProductSchema
                    name="Placă Carton Personalizat"
                    description="Plăci din carton ondulat sau fagure (honeycomb), ușoare și eco-friendly, personalizate pentru display-uri sau panouri temporare."
                    image="/products/master/panouri-carton-plume-foam-board-personalizat.png"
                    url="/materiale/carton"
                    price="15.00"
                />
                <ConfiguratorDispatcher configuratorId="carton" />

                <FAQSchema
                    faqs={[
                        {
                            question: "Care e diferența dintre carton ondulat și carton fagure?",
                            answer: "Cartonul ondulat clasic are un miez cu valuri, e mai economic și potrivit pentru panouri mici sau temporare. Cartonul fagure (honeycomb) are un miez structurat în celule hexagonale, e mai rigid și mai plan, potrivit pentru display-uri mai mari."
                        },
                        {
                            question: "Rezistă la umezeală?",
                            answer: "Nu este un material pentru exterior — cartonul absoarbe umezeala și se poate deforma. E gândit pentru interior: display-uri de magazin, standuri temporare sau panouri de eveniment."
                        },
                        {
                            question: "De ce să aleg carton în loc de PVC sau alucobond?",
                            answer: "E mult mai ușor și mai economic, ideal pentru materiale folosite o singură dată sau pentru o perioadă scurtă (lansare de produs, targ, eveniment temporar), unde nu are sens o investiție în material rigid permanent."
                        }
                    ]}
                />

                <section className="bg-white py-16 mt-16 border-t border-slate-100">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                                Carton personalizat pentru display-uri și panouri temporare
                            </h2>
                            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                                Material <strong className="text-orange-600">ușor și economic</strong>, potrivit pentru display-uri de interior, standuri temporare sau panouri de eveniment care nu au nevoie de rigiditatea unui material permanent.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-orange-500 pb-2 inline-block">Tipuri disponibile</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Carton ondulat</strong>
                                            <span className="text-slate-600 text-sm">Varianta clasică, economică, pentru panouri mici sau materiale de o singură folosire.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Carton fagure (honeycomb)</strong>
                                            <span className="text-slate-600 text-sm">Mai rigid și mai plan, bun pentru display-uri de dimensiuni mai mari.</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
                                <h3 className="text-2xl font-bold text-slate-800 mb-6">De reținut</h3>
                                <p className="text-slate-600 mb-4 leading-relaxed">
                                    Recomandat exclusiv pentru interior — nu rezistă la umezeală sau expunere prelungită la exterior.
                                </p>
                            </div>
                        </div>

                        <div className="mt-16 border-t border-slate-200 pt-16">
                            <h3 className="text-3xl font-black text-slate-900 mb-8 text-center uppercase">Întrebări Frecvente Carton</h3>
                            <div className="space-y-6 max-w-3xl mx-auto">
                                {[
                                    {
                                        q: "Care e diferența dintre carton ondulat și carton fagure?",
                                        a: "Cartonul ondulat clasic are un miez cu valuri, e mai economic și potrivit pentru panouri mici sau temporare. Cartonul fagure (honeycomb) are un miez structurat în celule hexagonale, e mai rigid și mai plan, potrivit pentru display-uri mai mari."
                                    },
                                    {
                                        q: "Rezistă la umezeală?",
                                        a: "Nu este un material pentru exterior — cartonul absoarbe umezeala și se poate deforma. E gândit pentru interior: display-uri de magazin, standuri temporare sau panouri de eveniment."
                                    },
                                    {
                                        q: "De ce să aleg carton în loc de PVC sau alucobond?",
                                        a: "E mult mai ușor și mai economic, ideal pentru materiale folosite o singură dată sau pentru o perioadă scurtă (lansare de produs, targ, eveniment temporar), unde nu are sens o investiție în material rigid permanent."
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
