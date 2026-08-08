import ConfiguratorDispatcher from "@/components/configurator/ConfiguratorDispatcher";
import ProductSchema from "@/components/ProductSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FAQSchema from "@/components/FAQSchema";
import { Metadata } from 'next';
import { Suspense } from "react";

export const metadata: Metadata = {
    title: 'Flyere Personalizate pentru Evenimente Locale | Tablou',
    description: 'Comandă flyere ieftine pentru un eveniment de familie, vânzare de garaj, meditații sau cursuri locale. Formate A6, A5, DL, tiraje mici sau mari, livrare rapidă.',
    keywords: ['flyere personalizate', 'flyere eveniment local', 'flyere ieftine', 'print flyere', 'flyer meditatii', 'tablou'],
    alternates: {
        canonical: '/configurator/flayere',
    },
};

export default function FlyerePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Se încarcă configuratorul Flyere...</div>}>
            <div className="pt-20">
                <h1 className="sr-only">Flyere și Fluturași Personalizați</h1>
                <BreadcrumbSchema
                    items={[
                        { name: "Acasă", item: "/" },
                        { name: "Configuratoare", item: "/configurator" },
                        { name: "Flyere", item: "/configurator/flayere" }
                    ]}
                />
                <ProductSchema
                    name="Flyere Personalizate"
                    description="Flyere ieftine, pe hârtie premium, pentru evenimente locale, vânzări de garaj, meditații sau cursuri — formate A6, A5, DL."
                    image="/products/flayere/flayere-1.webp"
                    url="/configurator/flayere"
                    price="0.30"
                />
                <ConfiguratorDispatcher configuratorId="flayere" />

                <FAQSchema
                    faqs={[
                        {
                            question: "Merită flyere pentru un eveniment mic, local?",
                            answer: "Da — pentru o vânzare de garaj, un curs de meditații, o repetiție de cor sau un eveniment de cartier, flyerele puse fizic la vecini sau la magazinul din colț ajung la oameni care nu te caută online."
                        },
                        {
                            question: "Ce format aleg pentru un anunț simplu vs. o ofertă mai detaliată?",
                            answer: "Flyerul A6 e ușor de pus în buzunar, bun pentru un anunț scurt cu dată și adresă. A5 sau DL au loc suficient pentru un program de meditații, un meniu sau detalii complete de contact."
                        },
                        {
                            question: "Pe ce hârtie se printează?",
                            answer: "În general folosim hârtie cretată, lucioasă sau mată, de la 130-150g (economică, pentru distribuire stradală) până la 250-300g (mai rigidă, pentru afișe de mână sau invitații simple)."
                        },
                        {
                            question: "Pot printa color pe ambele fețe?",
                            answer: "Da, printul față-verso color (4+4) costă aproape la fel ca o singură față — util dacă vrei detalii pe verso (hartă, program, condiții)."
                        }
                    ]}
                />

                {/* SEO CONTENT SECTION — conținut unic Tablou */}
                <section className="bg-white py-16 mt-16 border-t border-slate-100">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                                Flyere pentru lucrurile mici, locale, ale tale
                            </h2>
                            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                                Nu ai nevoie de o campanie de marketing ca să ai nevoie de <strong className="text-orange-600">flyere bine făcute</strong>. O vânzare de garaj, meditații pentru copii din cartier, un curs local sau un eveniment de familie — toate merg mai bine cu un flyer pus la vedere.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-orange-500 pb-2 inline-block">Unde chiar funcționează</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Vânzare de garaj sau curte</strong>
                                            <span className="text-slate-600 text-sm">Câteva flyere lipite la intrarea în scară sau la magazinul de cartier aduc mai multă lume decât o postare pierdută online.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Meditații, cursuri sau ateliere locale</strong>
                                            <span className="text-slate-600 text-sm">Un flyer clar, cu program și contact, funcționează foarte bine în cutiile poștale din zona ta.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Eveniment de familie sau cartier</strong>
                                            <span className="text-slate-600 text-sm">Serbare, strângere de fonduri, petrecere de cartier — flyerul rămâne cel mai simplu mod de a anunța vecinii.</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
                                <h3 className="text-2xl font-bold text-slate-800 mb-6">Regula principală de design</h3>
                                <p className="text-slate-600 mb-4 leading-relaxed">
                                    Oamenii citesc maxim 2 secunde un flyer înainte să decidă dacă îl păstrează. Pune informația esențială (ce, când, unde) mare și clar, iar detaliile suplimentare pe verso.
                                </p>
                            </div>
                        </div>

                        {/* SEO FAQ Structured Schema */}
                        <div className="mt-16 border-t border-slate-200 pt-16">
                            <h3 className="text-3xl font-black text-slate-900 mb-8 text-center uppercase">Întrebări Frecvente Flyere</h3>
                            <div className="space-y-6 max-w-3xl mx-auto">
                                {[
                                    {
                                        q: "Merită flyere pentru un eveniment mic, local?",
                                        a: "Da — pentru o vânzare de garaj, un curs de meditații, o repetiție de cor sau un eveniment de cartier, flyerele puse fizic la vecini sau la magazinul din colț ajung la oameni care nu te caută online."
                                    },
                                    {
                                        q: "Ce format aleg pentru un anunț simplu vs. o ofertă mai detaliată?",
                                        a: "Flyerul A6 e ușor de pus în buzunar, bun pentru un anunț scurt cu dată și adresă. A5 sau DL au loc suficient pentru un program de meditații, un meniu sau detalii complete de contact."
                                    },
                                    {
                                        q: "Pe ce hârtie se printează?",
                                        a: "În general folosim hârtie cretată, lucioasă sau mată, de la 130-150g (economică, pentru distribuire stradală) până la 250-300g (mai rigidă, pentru afișe de mână sau invitații simple)."
                                    },
                                    {
                                        q: "Pot printa color pe ambele fețe?",
                                        a: "Da, printul față-verso color (4+4) costă aproape la fel ca o singură față — util dacă vrei detalii pe verso (hartă, program, condiții)."
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
