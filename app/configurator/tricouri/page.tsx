import { Suspense } from 'react';
import ConfiguratorDispatcher from "@/components/configurator/ConfiguratorDispatcher";
import ProductSchema from "@/components/ProductSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FAQSchema from "@/components/FAQSchema";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Tricou Personalizat cu Text sau Poză - Cadou Unic | Tablou',
    description: 'Creează-ți propriul tricou cu text, poză sau design. Bumbac 100%, print DTF rezistent la spălare, mai multe mărimi și culori. Idee de cadou sau ținută de grup.',
    keywords: ['tricou personalizat', 'tricou cu poza', 'cadou personalizat', 'print dtf tricou', 'tablou'],
    alternates: {
        canonical: '/configurator/tricouri',
    },
    openGraph: {
        title: 'Tricou Personalizat cu Text sau Poză | Tablou',
        description: 'Alege designul, mărimea, comandă online.',
        images: ['/placeholder.png'],
    }
};

export default function TricouriPage() {
    return (
        <div className="pt-20">
            <BreadcrumbSchema
                items={[
                    { name: "Acasă", item: "/" },
                    { name: "Configuratoare", item: "/configurator" },
                    { name: "Tricouri Personalizate", item: "/configurator/tricouri" }
                ]}
            />
            <ProductSchema
                name="Tricou Personalizat cu Text sau Poză"
                description="Tricou din bumbac 100%, personalizat cu text, poză sau design propriu, print DTF rezistent la spălare."
                image="/placeholder.png"
                url="/configurator/tricouri"
                price="50.00"
            />
            <Suspense fallback={<div className="min-h-[60svh] flex items-center justify-center">Se încarcă configuratorul...</div>}>
                <ConfiguratorDispatcher configuratorId="tricouri" />
            </Suspense>

            <FAQSchema
                faqs={[
                    {
                        question: "Pot pune o poză, nu doar text sau design grafic?",
                        answer: "Da — poți încărca o fotografie (de familie, de eveniment, un colaj) și o transformăm în printul tricoului, la fel de ușor ca un design grafic."
                    },
                    {
                        question: "Rezistă printul la spălări repetate?",
                        answer: "Da, folosim tehnologie DTF, care nu crapă și nu se decolorează după multe spălări — mult mai durabilă decât printul termic ieftin."
                    },
                    {
                        question: "Pot comanda tricouri identice pentru un grup (petrecere burlaci, eveniment de familie)?",
                        answer: "Da, poți configura aceeași comandă în mai multe mărimi și exemplare — util pentru tricouri de grup la evenimente."
                    },
                    {
                        question: "Ce mărimi sunt disponibile?",
                        answer: "Configuratorul oferă mărimile standard, de la S la XXL — alegi direct la comandă, fără costuri suplimentare."
                    }
                ]}
            />

            <section className="bg-white py-16 mt-16 border-t border-slate-100">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                            Un tricou cu povestea ta, nu un model de raft
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            Text, poză sau design propriu — pe <strong className="text-emerald-600">bumbac 100%</strong>, cu print DTF rezistent la spălări repetate. Perfect ca ținută de grup sau cadou personalizat.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-emerald-500 pb-2 inline-block">Idei de personalizare</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                    <div>
                                        <strong className="block text-slate-900">Tricou cu poză de familie sau eveniment</strong>
                                        <span className="text-slate-600 text-sm">Transformă o fotografie preferată în printul tricoului — cadou personal, nu unul generic.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                    <div>
                                        <strong className="block text-slate-900">Set de tricouri pentru eveniment</strong>
                                        <span className="text-slate-600 text-sm">Petrecere burlaci/burlăcițe, aniversare, tricouri de familie la vacanță — comenzi multiple identice.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                    <div>
                                        <strong className="block text-slate-900">Print care rezistă la purtare zilnică</strong>
                                        <span className="text-slate-600 text-sm">DTF nu crapă și nu se decolorează după multe spălări, spre deosebire de printul termic simplu.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
                            <h3 className="text-2xl font-bold text-slate-800 mb-6">Ce fișier să folosești</h3>
                            <p className="text-slate-600 mb-4 leading-relaxed">
                                O poză originală, direct din telefon, iese mai clar decât una salvată de pe rețele sociale, unde calitatea scade la comprimare.
                            </p>
                            <p className="text-slate-600 leading-relaxed font-bold">
                                Pentru text, folosește un mesaj scurt — arată mai bine pe tricou decât un paragraf lung.
                            </p>
                        </div>
                    </div>

                    <div className="mt-16 border-t border-slate-200 pt-16">
                        <h3 className="text-3xl font-black text-slate-900 mb-8 text-center uppercase">Întrebări Frecvente</h3>
                        <div className="space-y-6 max-w-3xl mx-auto">
                            {[
                                {
                                    q: "Pot pune o poză, nu doar text sau design grafic?",
                                    a: "Da — poți încărca o fotografie (de familie, de eveniment, un colaj) și o transformăm în printul tricoului, la fel de ușor ca un design grafic."
                                },
                                {
                                    q: "Rezistă printul la spălări repetate?",
                                    a: "Da, folosim tehnologie DTF, care nu crapă și nu se decolorează după multe spălări — mult mai durabilă decât printul termic ieftin."
                                },
                                {
                                    q: "Pot comanda tricouri identice pentru un grup (petrecere burlaci, eveniment de familie)?",
                                    a: "Da, poți configura aceeași comandă în mai multe mărimi și exemplare — util pentru tricouri de grup la evenimente."
                                },
                                {
                                    q: "Ce mărimi sunt disponibile?",
                                    a: "Configuratorul oferă mărimile standard, de la S la XXL — alegi direct la comandă, fără costuri suplimentare."
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
