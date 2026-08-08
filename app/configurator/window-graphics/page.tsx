import ConfiguratorDispatcher from "@/components/configurator/ConfiguratorDispatcher";
import ProductSchema from "@/components/ProductSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FAQSchema from "@/components/FAQSchema";
import { Metadata } from 'next';
import { Suspense } from "react";

export const metadata: Metadata = {
    title: 'Folie Geam Perforată Personalizată - One-Way Vision | Tablou',
    description: 'Folie perforată personalizată pentru geamul casei, al mașinii sau vitrina afacerii tale. Vezi afară fără să fii văzut înăuntru, cu protecție UV suplimentară. Preț instant.',
    keywords: ['folie geam personalizata', 'folie one way vision', 'folie confidentialitate geam', 'sticker luneta masina', 'window graphics', 'tablou'],
    alternates: {
        canonical: '/configurator/window-graphics',
    },
};

export default function WindowGraphicsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Se încarcă configuratorul Window Graphics...</div>}>
            <div className="pt-20">
                <h1 className="sr-only">Folie Geam Perforată Personalizată - One-Way Vision</h1>
                <BreadcrumbSchema
                    items={[
                        { name: "Acasă", item: "/" },
                        { name: "Configuratoare", item: "/configurator" },
                        { name: "Window Graphics", item: "/configurator/window-graphics" }
                    ]}
                />
                <ProductSchema
                    name="Folie Geam Perforată Personalizată"
                    description="Folie perforată one-way vision, personalizată cu designul tău — pentru geamul casei, luneta mașinii sau vitrina unei afaceri mici."
                    image="/products/window-graphics/Window-Graphics-1.webp"
                    url="/configurator/window-graphics"
                    price="40.00"
                />
                <ConfiguratorDispatcher configuratorId="window-graphics" />

                <FAQSchema
                    faqs={[
                        {
                            question: "Se poate pune pe geamul de la balcon sau de la o cameră de la parter?",
                            answer: "Da — este o folosire foarte comună. Din interior vezi afară normal, iar din stradă trecătorii nu pot vedea în casă, ceea ce oferă intimitate fără să blochezi complet lumina naturală."
                        },
                        {
                            question: "Merge și pe luneta sau geamurile mașinii?",
                            answer: "Da, este una dintre aplicațiile principale — poți personaliza luneta cu un design propriu, păstrând vizibilitatea din interior spre exterior. Verifică totuși reglementările RAR privind gradul de vizibilitate admis."
                            },
                        {
                            question: "Cum se comportă efectul one-way noaptea?",
                            answer: "Efectul depinde de contrastul de lumină — noaptea, dacă în interior e mai luminos decât afară, rolurile se inversează și cei de afară pot vedea în casă. Pentru intimitate constantă seara, se recomandă și o draperie ușoară."
                        },
                        {
                            question: "Se poate lamina pentru curățare mai ușoară?",
                            answer: "Da, la cerere folia poate fi laminată cu o peliculă transparentă care sigilează microperforațiile, utilă dacă geamul se curăță des cu apă și detergent."
                        }
                    ]}
                />

                {/* SEO CONTENT SECTION — conținut unic Tablou */}
                <section className="bg-white py-16 mt-16 border-t border-slate-100">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                                Intimitate acasă, fără să blochezi lumina
                            </h2>
                            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                                Folia perforată <strong className="text-orange-600">one-way vision</strong> te lasă să vezi afară perfect, în timp ce din stradă nu se vede înăuntru. Bună pentru geamul de la parter, balcon sau baie, dar și pentru luneta mașinii sau vitrina unei afaceri mici.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-orange-500 pb-2 inline-block">Cum funcționează efectul</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Mii de microperforații, 50/50</strong>
                                            <span className="text-slate-600 text-sm">Materialul are jumătate suprafață printată, jumătate găurele minuscule — din exterior se vede designul, din interior treci practic prin el cu privirea.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Protecție UV și mai puțină căldură</strong>
                                            <span className="text-slate-600 text-sm">Pe lângă intimitate, folia reduce radiația solară directă — camera rămâne mai răcoroasă vara, iar mobila se decolorează mai greu.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Design propriu, nu doar model comercial</strong>
                                            <span className="text-slate-600 text-sm">Poză, ilustrație sau doar un model geometric discret — orice design poate deveni folia ta personalizată.</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
                                <h3 className="text-2xl font-bold text-slate-800 mb-6">Ce să eviți la design</h3>
                                <p className="text-slate-600 mb-4 leading-relaxed">
                                    Aproximativ 30-50% din suprafață este perforată fizic — zone considerate „goale" din punct de vedere vizual.
                                </p>
                                <p className="text-slate-600 leading-relaxed font-bold">
                                    Evită textele foarte mici sau detaliile fine — există riscul ca literele mici sau punctuația să cadă exact peste o perforație și să dispară din imagine.
                                </p>
                            </div>
                        </div>

                        {/* SEO FAQ Structured Schema */}
                        <div className="mt-16 border-t border-slate-200 pt-16">
                            <h3 className="text-3xl font-black text-slate-900 mb-8 text-center uppercase">Întrebări Frecvente Window Graphics</h3>
                            <div className="space-y-6 max-w-3xl mx-auto">
                                {[
                                    {
                                        q: "Se poate pune pe geamul de la balcon sau de la o cameră de la parter?",
                                        a: "Da — este o folosire foarte comună. Din interior vezi afară normal, iar din stradă trecătorii nu pot vedea în casă, ceea ce oferă intimitate fără să blochezi complet lumina naturală."
                                    },
                                    {
                                        q: "Merge și pe luneta sau geamurile mașinii?",
                                        a: "Da, este una dintre aplicațiile principale — poți personaliza luneta cu un design propriu, păstrând vizibilitatea din interior spre exterior. Verifică totuși reglementările RAR privind gradul de vizibilitate admis."
                                    },
                                    {
                                        q: "Cum se comportă efectul one-way noaptea?",
                                        a: "Efectul depinde de contrastul de lumină — noaptea, dacă în interior e mai luminos decât afară, rolurile se inversează și cei de afară pot vedea în casă. Pentru intimitate constantă seara, se recomandă și o draperie ușoară."
                                    },
                                    {
                                        q: "Se poate lamina pentru curățare mai ușoară?",
                                        a: "Da, la cerere folia poate fi laminată cu o peliculă transparentă care sigilează microperforațiile, utilă dacă geamul se curăță des cu apă și detergent."
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
