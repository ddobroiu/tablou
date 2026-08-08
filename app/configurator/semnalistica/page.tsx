import { Suspense } from 'react';
import SignageConfigurator from "@/components/configurator/SignageConfigurator";
import ProductSchema from "@/components/ProductSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FAQSchema from "@/components/FAQSchema";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Semnalistică și Panouri Indicatoare Personalizate | Tablou',
    description: 'Comandă online semnalistică și panouri indicatoare. Protectia muncii (SSM/SU), șantier, rutiere sau direcționale. PVC, Bond sau Plexiglass. Preț instant.',
    keywords: ['semnalistica', 'panouri indicatoare', 'semne protectia muncii', 'panouri direcționale', 'semnalistică interioară', 'tablou'],
    alternates: {
        canonical: '/configurator/semnalistica',
    },
};

export default function Page() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Se încarcă...</div>}>
            <div className="pt-20">
                <h1 className="sr-only">Semnalistică și Panouri Indicatoare</h1>
                <BreadcrumbSchema
                    items={[
                        { name: "Acasă", item: "/" },
                        { name: "Configuratoare", item: "/configurator" },
                        { name: "Semnalistică", item: "/configurator/semnalistica" }
                    ]}
                />
                <ProductSchema
                    name="Semnalistică și Panouri Indicatoare"
                    description="Panouri indicatoare personalizate pentru protecția muncii, șantier sau direcționale, din PVC, Alucobond sau Plexiglass."
                    image="/products/master/placi-pvc-forex-personalizat-print-uv.png"
                    url="/configurator/semnalistica"
                    price="35.00"
                />
                <FAQSchema
                    faqs={[
                        {
                            question: "Care este diferența dintre PVC (Forex) și Alucobond (Dibond)?",
                            answer: "Placa Forex este spumă PVC expandată — ușoară, economică, potrivită pentru montaj pe pereți sau garduri, cu durată de viață de aproximativ 2-4 ani afară. Alucobondul are două fețe de aluminiu cu un nucleu de polietilenă — nu se ondulează la soare și durează peste 10 ani."
                        },
                        {
                            question: "Plăcile sunt reflectorizante, ca semnele de circulație?",
                            answer: "Materialul standard printat la noi este opac (mat sau lucios). Pentru semnalistică rutieră reflectorizantă (folie microprismatică), avem nevoie de o solicitare separată, cu preț personalizat."
                        },
                        {
                            question: "Cum pot tăia placa printată acasă?",
                            answer: "Plăcile subțiri de Forex (până în 3mm) se pot ajusta cu un cutter ascuțit și o riglă metalică. Plăcile de Alucobond sau Plexiglass necesită unealtă electrică sau CNC — recomandăm să comanzi direct pe dimensiunea finală."
                        }
                    ]}
                />
                <SignageConfigurator />

                {/* MASSIVE SEO CONTENT SECTION */}
                <section className="bg-white py-16 mt-16 border-t border-slate-100">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                                Semnalistică și Panouri de Protecția Muncii
                            </h2>
                            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                                Conformitate totală și vizibilitate maximă. Fabricăm <strong className="text-orange-600">panouri indicatoare pentru SSM/SU, panouri de avizare șantier, semne rutiere sau piloni direcționali</strong>. Soluții rigide premium din PVC, Forex, Alucobond sau Plexiglass.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-orange-500 pb-2 inline-block">Procesul nostru de fabricație rigidă:</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Aplicare Autocolant Laminat</strong>
                                            <span className="text-slate-600 text-sm">Pentru majoritatea panourilor tipărim folie adezivă la o rezoluție fotorealistă, o laminăm (pentru protecție UV și anti-zgârieturi mecanică), iar apoi este cașerată (lipită pe presă) direct pe placa suport aleasă de tine.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Direct Print UV (Flatbed)</strong>
                                            <span className="text-slate-600 text-sm">Pentru serii mari sau plăci ce necesită rezistență industrială directă, jetul de cerneală industrial aplică culoarea direct pe placa de Komatex / Alucobond și se polimerizează sub raze ultraviolete.</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
                                <h3 className="text-2xl font-bold text-slate-800 mb-6">Reguli privind Semnalistica de Șantier</h3>
                                <p className="text-slate-600 mb-4 leading-relaxed">
                                    Conform legislației, panourile obligatorii de tip "Șantier în Lucru - Investiție" trebuie să aibă de regulă <strong className="text-black">dimensiunea minimă de 90x60cm sau 120x90cm</strong>, iar fontul de titlu trebuie să fie lizibil. Alege din variantele noastre Forex de măcar 3mm - 5mm grosime pentru ca placa să reziste prinsă pe gard!
                                </p>
                            </div>
                        </div>

                        {/* SEO FAQ Structured Schema */}
                        <div className="mt-16 border-t border-slate-200 pt-16">
                            <h3 className="text-3xl font-black text-slate-900 mb-8 text-center uppercase">Întrebări Frecvente Semnalistică</h3>
                            <div className="space-y-6 max-w-3xl mx-auto">
                                {[
                                    {
                                        q: "Care este diferența dintre PVC (Forex) și Alucobond (Dibond)?",
                                        a: "Placa Forex este spumă PVC expandată — ușoară, economică, potrivită pentru montaj pe pereți sau garduri, cu durată de viață de aproximativ 2-4 ani afară. Alucobondul are două fețe de aluminiu cu un nucleu de polietilenă — nu se ondulează la soare și durează peste 10 ani."
                                    },
                                    {
                                        q: "Plăcile sunt reflectorizante, ca semnele de circulație?",
                                        a: "Materialul standard printat la noi este opac (mat sau lucios). Pentru semnalistică rutieră reflectorizantă (folie microprismatică), avem nevoie de o solicitare separată, cu preț personalizat."
                                    },
                                    {
                                        q: "Cum pot tăia placa printată acasă?",
                                        a: "Plăcile subțiri de Forex (până în 3mm) se pot ajusta cu un cutter ascuțit și o riglă metalică. Plăcile de Alucobond sau Plexiglass necesită unealtă electrică sau CNC — recomandăm să comanzi direct pe dimensiunea finală."
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
