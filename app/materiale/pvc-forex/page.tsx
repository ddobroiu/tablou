import ConfiguratorDispatcher from "@/components/configurator/ConfiguratorDispatcher";
import ProductSchema from "@/components/ProductSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FAQSchema from "@/components/FAQSchema";
import { Metadata } from 'next';
import { Suspense } from "react";

export const metadata: Metadata = {
    title: 'PVC Forex Personalizat - Panouri Publicitare | Tablou',
    description: 'Personalizează panouri din PVC expandat (Forex). Material ușor și rigid, ideal pentru semnalistică outdoor și indoor. Grosimi 3-10mm. Calcul preț pe loc.',
    keywords: ['pvc forex personalizat', 'panouri publicitare', 'pvc expandat', 'placi pvc semnalistica', 'tablou'],
    alternates: {
        canonical: '/materiale/pvc-forex',
    },
};

export default function PVCForexPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Se încarcă configuratorul PVC Forex...</div>}>
            <div className="pt-20">
                <h1 className="sr-only">PVC Forex Personalizat</h1>
                <BreadcrumbSchema
                    items={[
                        { name: "Acasă", item: "/" },
                        { name: "Materiale", item: "/materiale" },
                        { name: "PVC Forex", item: "/materiale/pvc-forex" }
                    ]}
                />
                <ProductSchema
                    name="Placă PVC Forex Personalizată"
                    description="Panou din PVC expandat, ușor și rigid, personalizat prin print UV direct sau folie laminată — pentru semnalistică indoor și outdoor."
                    image="/products/master/placi-pvc-forex-personalizat-print-uv.png"
                    url="/materiale/pvc-forex"
                    price="20.00"
                />
                <ConfiguratorDispatcher configuratorId="pvc-forex" />

                <FAQSchema
                    faqs={[
                        {
                            question: "Ce grosime aleg pentru un panou de exterior?",
                            answer: "Pentru panouri mici, montate protejat, 3mm este suficient. Pentru panouri mai mari sau expuse direct vântului, recomandăm 5-10mm, pentru rigiditate mai bună."
                        },
                        {
                            question: "Rezistă afară, la ploaie și soare?",
                            answer: "Da, PVC-ul expandat este rezistent la umezeală și potrivit pentru exterior, dar la expunere solară intensă și îndelungată se poate decolora ușor în timp — pentru durabilitate maximă pe termen lung, alucobondul e o variantă superioară."
                        },
                        {
                            question: "Cum se personalizează placa?",
                            answer: "Fie prin print UV direct pe suprafață, fie cu folie adezivă laminată aplicată pe placă — alegerea depinde de rezistența și finisajul dorit."
                        }
                    ]}
                />

                <section className="bg-white py-16 mt-16 border-t border-slate-100">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                                PVC Forex pentru semnalistică ușoară și rigidă
                            </h2>
                            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                                Panou din <strong className="text-orange-600">PVC expandat</strong>, ușor de manevrat și montat, potrivit pentru panouri indicatoare, semnalistică interioară sau exterioară protejată.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-orange-500 pb-2 inline-block">Ce trebuie să știi</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Ușor și rigid</strong>
                                            <span className="text-slate-600 text-sm">Se manevrează și se montează ușor, fără să fie fragil la ambalare sau transport.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Cost accesibil</strong>
                                            <span className="text-slate-600 text-sm">Mai economic decât alucobondul, potrivit pentru semnalistică ce nu are nevoie de durabilitate de peste 10 ani.</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
                                <h3 className="text-2xl font-bold text-slate-800 mb-6">Ce grosime să alegi</h3>
                                <p className="text-slate-600 mb-4 leading-relaxed">
                                    3mm pentru panouri mici sau montate protejat, 5-10mm pentru panouri mai mari sau expuse direct vântului.
                                </p>
                            </div>
                        </div>

                        <div className="mt-16 border-t border-slate-200 pt-16">
                            <h3 className="text-3xl font-black text-slate-900 mb-8 text-center uppercase">Întrebări Frecvente PVC Forex</h3>
                            <div className="space-y-6 max-w-3xl mx-auto">
                                {[
                                    {
                                        q: "Ce grosime aleg pentru un panou de exterior?",
                                        a: "Pentru panouri mici, montate protejat, 3mm este suficient. Pentru panouri mai mari sau expuse direct vântului, recomandăm 5-10mm, pentru rigiditate mai bună."
                                    },
                                    {
                                        q: "Rezistă afară, la ploaie și soare?",
                                        a: "Da, PVC-ul expandat este rezistent la umezeală și potrivit pentru exterior, dar la expunere solară intensă și îndelungată se poate decolora ușor în timp — pentru durabilitate maximă pe termen lung, alucobondul e o variantă superioară."
                                    },
                                    {
                                        q: "Cum se personalizează placa?",
                                        a: "Fie prin print UV direct pe suprafață, fie cu folie adezivă laminată aplicată pe placă — alegerea depinde de rezistența și finisajul dorit."
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
