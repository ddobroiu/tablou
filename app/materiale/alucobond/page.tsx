import ConfiguratorDispatcher from "@/components/configurator/ConfiguratorDispatcher";
import ProductSchema from "@/components/ProductSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FAQSchema from "@/components/FAQSchema";
import { Metadata } from 'next';
import { Suspense } from "react";

export const metadata: Metadata = {
    title: 'Alucobond (Dibond) Personalizat - Panouri Aluminiu | Tablou',
    description: 'Comandă panouri compozite din aluminiu (Alucobond/Dibond). Rezistență maximă la exterior, planeitate perfectă, aspect premium. Print UV direct. Preț instant.',
    keywords: ['alucobond personalizat', 'dibond', 'panouri aluminiu', 'placa compozita aluminiu', 'tablou'],
    alternates: {
        canonical: '/materiale/alucobond',
    },
};

export default function AlucobondPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Se încarcă configuratorul Alucobond...</div>}>
            <div className="pt-20">
                <h1 className="sr-only">Alucobond (Dibond) Personalizat</h1>
                <BreadcrumbSchema
                    items={[
                        { name: "Acasă", item: "/" },
                        { name: "Materiale", item: "/materiale" },
                        { name: "Alucobond", item: "/materiale/alucobond" }
                    ]}
                />
                <ProductSchema
                    name="Panou Alucobond (Dibond) Personalizat"
                    description="Panou compozit din aluminiu, printat UV direct sau cu folie laminată — rezistență ridicată la exterior și aspect premium."
                    image="/products/master/panouri-alucobond-dibond-compozit-aluminiu-personalizat.png"
                    url="/materiale/alucobond"
                    price="60.00"
                />
                <ConfiguratorDispatcher configuratorId="alucobond" />

                <FAQSchema
                    faqs={[
                        {
                            question: "Ce este alucobondul și de ce e mai scump decât alte plăci?",
                            answer: "Este un panou compozit cu două fețe subțiri de aluminiu și un nucleu de polietilenă la mijloc. Rezultă o placă foarte plană, rigidă și rezistentă la intemperii, care nu se deformează la soare — de aceea costă mai mult decât un PVC expandat simplu."
                        },
                        {
                            question: "Cât rezistă afară, la exterior?",
                            answer: "Cu o durată de viață estimată la peste 10 ani, e printre cele mai durabile materiale rigide pentru semnalistică sau firme exterioare expuse permanent la soare și ploaie."
                        },
                        {
                            question: "Se poate personaliza cu orice design?",
                            answer: "Da, aplicăm fie folie adezivă laminată cu imaginea ta, cășerată pe placă, fie print UV direct pe suprafață, în funcție de rezoluția și rezistența dorite."
                        }
                    ]}
                />

                <section className="bg-white py-16 mt-16 border-t border-slate-100">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                                Panouri Alucobond pentru exterior
                            </h2>
                            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                                Placă compozită din <strong className="text-orange-600">aluminiu</strong>, perfect plană și rezistentă la intemperii — pentru firme luminoase, panouri de exterior sau proiecte care trebuie să arate impecabil ani la rând.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-orange-500 pb-2 inline-block">Ce îl diferențiază</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Planeitate perfectă</strong>
                                            <span className="text-slate-600 text-sm">Nu se ondulează sau curbă la căldură, spre deosebire de plăcile PVC expandate mai subțiri.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Rezistență ridicată la exterior</strong>
                                            <span className="text-slate-600 text-sm">Suportă expunere directă la soare și ploaie ani la rând, fără decolorare vizibilă.</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
                                <h3 className="text-2xl font-bold text-slate-800 mb-6">Grosimi disponibile</h3>
                                <p className="text-slate-600 mb-4 leading-relaxed">
                                    Cel mai comun este 3mm pentru panouri de firmă sau semnalistică. Pentru piese mari, autoportante sau supuse la vânt puternic, recomandăm grosimi mai mari.
                                </p>
                            </div>
                        </div>

                        <div className="mt-16 border-t border-slate-200 pt-16">
                            <h3 className="text-3xl font-black text-slate-900 mb-8 text-center uppercase">Întrebări Frecvente Alucobond</h3>
                            <div className="space-y-6 max-w-3xl mx-auto">
                                {[
                                    {
                                        q: "Ce este alucobondul și de ce e mai scump decât alte plăci?",
                                        a: "Este un panou compozit cu două fețe subțiri de aluminiu și un nucleu de polietilenă la mijloc. Rezultă o placă foarte plană, rigidă și rezistentă la intemperii, care nu se deformează la soare — de aceea costă mai mult decât un PVC expandat simplu."
                                    },
                                    {
                                        q: "Cât rezistă afară, la exterior?",
                                        a: "Cu o durată de viață estimată la peste 10 ani, e printre cele mai durabile materiale rigide pentru semnalistică sau firme exterioare expuse permanent la soare și ploaie."
                                    },
                                    {
                                        q: "Se poate personaliza cu orice design?",
                                        a: "Da, aplicăm fie folie adezivă laminată cu imaginea ta, cășerată pe placă, fie print UV direct pe suprafață, în funcție de rezoluția și rezistența dorite."
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
