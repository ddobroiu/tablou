import { Suspense } from 'react';
import ConfiguratorDispatcher from "@/components/configurator/ConfiguratorDispatcher";
import ProductSchema from "@/components/ProductSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FAQSchema from "@/components/FAQSchema";
import { Metadata } from 'next';
import { SeoDimensionsLinks } from '@/components/SeoDimensionsLinks';

export const metadata: Metadata = {
    title: "Tablou Canvas din Poza Ta - Cadou Personalizat | Tablou",
    description: "Transformă poza ta preferată într-un tablou canvas pe pânză 100% bumbac, cu șasiu din lemn natural. Cadou personalizat pentru orice ocazie, gata de agățat pe perete.",
    keywords: ['tablou canvas personalizat', 'cadou personalizat din poza', 'tablou foto pe panza', 'tablou', 'cadou aniversare'],
};

export default function CanvasPage() {
    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: "Acasă", item: "/" },
                    { name: "Configuratoare", item: "/configurator" },
                    { name: "Tablouri Canvas", item: "/configurator/canvas" }
                ]}
            />
            <ProductSchema
                name="Tablou Canvas Personalizat din Poza Ta"
                description="Poza ta preferată, transformată în tablou canvas pe pânză 100% bumbac și șasiu din lemn natural — cadou personalizat gata de agățat."
                image="/products/canvas/canvas-1.webp"
                url="/configurator/canvas"
                price="55.00"
            />
            <div className="pt-20">
                <h1 className="sr-only">Tablou Canvas Personalizat din Poza Ta</h1>
                <Suspense fallback={<div className="min-h-[60svh] flex items-center justify-center">Se încarcă configuratorul...</div>}>
                    <ConfiguratorDispatcher configuratorId="canvas" />
                </Suspense>

                <FAQSchema
                    faqs={[
                        {
                            question: "Ce poză ar trebui să aleg pentru cel mai bun rezultat?",
                            answer: "Alege poza originală, direct din telefon sau aparatul foto — nu una descărcată de pe WhatsApp sau Facebook, unde calitatea scade vizibil. Cu cât fișierul e mai mare (peste 2-3 MB), cu atât tabloul iese mai clar."
                        },
                        {
                            question: "Se potrivește ca idee de cadou?",
                            answer: "Este unul dintre cele mai apreciate cadouri personalizate — pentru aniversări, nunți, Valentine's Day, ziua mamei sau pur și simplu ca amintire. Vine gata înrămat, pregătit de agățat direct din cutie."
                        },
                        {
                            question: "De ce nu se vede rama pe margini?",
                            answer: "Pânza se întinde peste marginile șasiului (gallery wrap), acoperind lateralele — efectul e de tablou de galerie, fără o ramă vizibilă separată."
                        },
                        {
                            question: "Cât durează până primesc tabloul?",
                            answer: "Pânza se întinde manual, cu atenție, deci producția durează aproximativ 24h lucrătoare, plus livrarea prin curier — de regulă tabloul ajunge acasă în 24-48h."
                        }
                    ]}
                />

                {/* SEO CONTENT SECTION — conținut unic Tablou */}
                <section className="bg-white py-16 mt-16 border-t border-slate-100">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                                Poza ta preferată, transformată în tablou de galerie
                            </h2>
                            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                                Tablou e specializat în cadouri personalizate din poze — printăm pe <strong className="text-emerald-600">pânză 100% bumbac</strong>, întinsă pe șasiu din lemn natural uscat, exact ca la o pictură adevărată, nu pe un banner PVC subțire.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-emerald-500 pb-2 inline-block">De ce iese diferit</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Pânză texturată, nu print lucios</strong>
                                            <span className="text-slate-600 text-sm">Canvas 100% bumbac sau mix, 350-400g/mp — culorile ies mate, cu textura specifică unei picturi, nu ca o fotografie plastifiată.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Nu se deformează în timp</strong>
                                            <span className="text-slate-600 text-sm">Șasiul e din lemn uscat special, ca să nu se "burtească" din cauza umidității din casă — pânza rămâne întinsă perfect ani la rând.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Gata de dăruit sau agățat</strong>
                                            <span className="text-slate-600 text-sm">Vine cu agățătoare montată — îl scoți din cutie și îl pui direct pe perete, sau îl oferi cadou exact așa cum arată.</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
                                <h3 className="text-2xl font-bold text-slate-800 mb-6">Cum alegi poza potrivită</h3>
                                <p className="text-slate-600 mb-4 leading-relaxed">
                                    Folosește poza originală, nu una salvată de pe rețele sociale (acolo calitatea scade mult la comprimare). Ideal, peste 2-3 MB — cu cât fișierul e mai mare, cu atât tabloul iese mai clar, chiar și la dimensiuni mari.
                                </p>
                                <p className="text-slate-600 leading-relaxed font-bold">
                                    Atenție la cadraj: pânza se împăturește pe marginea șasiului (~2-3 cm) — evită să pui fețele persoanelor exact pe marginea extremă a fotografiei.
                                </p>
                            </div>
                        </div>

                        <div className="mt-16 border-t border-slate-200 pt-16">
                            <h3 className="text-3xl font-black text-slate-900 mb-8 text-center uppercase">Întrebări Frecvente</h3>
                            <div className="space-y-6 max-w-3xl mx-auto">
                                {[
                                    {
                                        q: "Ce poză ar trebui să aleg pentru cel mai bun rezultat?",
                                        a: "Alege poza originală, direct din telefon sau aparatul foto — nu una descărcată de pe WhatsApp sau Facebook, unde calitatea scade vizibil. Cu cât fișierul e mai mare (peste 2-3 MB), cu atât tabloul iese mai clar."
                                    },
                                    {
                                        q: "Se potrivește ca idee de cadou?",
                                        a: "Este unul dintre cele mai apreciate cadouri personalizate — pentru aniversări, nunți, Valentine's Day, ziua mamei sau pur și simplu ca amintire. Vine gata înrămat, pregătit de agățat direct din cutie."
                                    },
                                    {
                                        q: "De ce nu se vede rama pe margini?",
                                        a: "Pânza se întinde peste marginile șasiului (gallery wrap), acoperind lateralele — efectul e de tablou de galerie, fără o ramă vizibilă separată."
                                    },
                                    {
                                        q: "Cât durează până primesc tabloul?",
                                        a: "Pânza se întinde manual, cu atenție, deci producția durează aproximativ 24h lucrătoare, plus livrarea prin curier — de regulă tabloul ajunge acasă în 24-48h."
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
                <SeoDimensionsLinks
                    productId="canvas"
                    productName="Tablou Canvas"
                    currentW={40}
                    currentH={60}
                />
            </div>
        </>
    );
}
