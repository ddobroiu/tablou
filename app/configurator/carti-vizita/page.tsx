import ConfiguratorDispatcher from "@/components/configurator/ConfiguratorDispatcher";
import ProductSchema from "@/components/ProductSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FAQSchema from "@/components/FAQSchema";
import { Metadata } from 'next';
import { Suspense } from "react";

export const metadata: Metadata = {
    title: 'Cărți de Vizită Personalizate pentru Freelanceri | Tablou',
    description: 'Cărți de vizită premium din carton sau plastic, cu plastifiere soft-touch și colțuri rotunjite. Ideale pentru freelanceri, meșteșugari și afaceri mici pornite de acasă.',
    keywords: ['carti de vizita personalizate', 'carti de vizita freelancer', 'business cards afacere mica', 'carti vizita plastic', 'tablou'],
    alternates: {
        canonical: '/configurator/carti-vizita',
    },
};

export default function CartiVizitaPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Se încarcă configuratorul de cărți de vizită...</div>}>
            <div className="pt-20">
                <h1 className="sr-only">Cărți de Vizită Personalizate</h1>
                <BreadcrumbSchema
                    items={[
                        { name: "Acasă", item: "/" },
                        { name: "Configuratoare", item: "/configurator" },
                        { name: "Cărți de Vizită", item: "/configurator/carti-vizita" }
                    ]}
                />
                <ProductSchema
                    name="Cărți de Vizită Personalizate"
                    description="Cărți de vizită premium din carton sau plastic, cu opțiuni de finisare soft-touch — potrivite pentru freelanceri și afaceri mici."
                    image="/products/carti-vizita/carti-vizita-1.webp"
                    url="/configurator/carti-vizita"
                    price="0.50"
                />
                <ConfiguratorDispatcher configuratorId="carti-vizita" />

                <FAQSchema
                    faqs={[
                        {
                            question: "Are sens o carte de vizită dacă abia îmi pornesc afacerea de acasă?",
                            answer: "Da — pentru meșteșugari, cofetari, tunsori la domiciliu sau orice freelancer, o carte de vizită dă un aer profesional imediat, chiar dacă lucrezi singur, fără birou fizic."
                        },
                        {
                            question: "Care este cantitatea minimă de comandă?",
                            answer: "Comanda minimă este de 100 de bucăți pe model grafic — suficient pentru a începe, fără să investești într-un tiraj foarte mare de la început."
                        },
                        {
                            question: "Pot printa pe ambele fețe?",
                            answer: "Da, alegi în configurator print pe o față (4+0) sau față-verso (4+4) — util dacă vrei pe spate un cod QR către portofoliul tău sau programul de lucru."
                        },
                        {
                            question: "Ce este plastifierea Soft-Touch și merită?",
                            answer: "E o peliculă catifelată la atingere, mai plăcută decât plastifierea mată standard și mai rezistentă la amprente — un mic detaliu care face cartea de vizită să pară mai scumpă decât e."
                        }
                    ]}
                />

                <section className="bg-white py-16 mt-16 border-t border-slate-100">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                                O carte de vizită serioasă, chiar dacă lucrezi de acasă
                            </h2>
                            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                                Pentru freelanceri, meșteșugari sau o afacere mică pornită din pasiune — o <strong className="text-orange-600">carte de vizită bine făcută</strong> cântărește la fel de mult ca la o firmă mare. Carton sau plastic, cu finisaje la alegere.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-orange-500 pb-2 inline-block">Materiale disponibile</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Carton standard (350g/mp)</strong>
                                            <span className="text-slate-600 text-sm">Grosime plăcută la atingere, culori curate — varianta cea mai la îndemână pentru un tiraj de start.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Plastic transparent sau mat</strong>
                                            <span className="text-slate-600 text-sm">O variantă memorabilă, rezistentă la apă și frecare — bună dacă vrei ca oamenii chiar să-și amintească de tine.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Colțuri rotunjite sau tăiere pe formă</strong>
                                            <span className="text-slate-600 text-sm">Un detaliu simplu care diferențiază cartea ta de vizită de teancul standard cu colțuri drepte.</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
                                <h3 className="text-2xl font-bold text-slate-800 mb-6">Specificații și grafică</h3>
                                <p className="text-slate-600 mb-4 leading-relaxed">
                                    Dimensiunea standard recomandată este <strong className="text-emerald-600">90x50 mm</strong> sau formatul bancar <strong className="text-emerald-600">85x54 mm</strong>. Lasă un bleed de minim +2mm de jur împrejur ca să nu apară margini albe la tăiere.
                                </p>
                                <p className="text-slate-600 leading-relaxed font-bold">
                                    Trimite fișierul PDF în CMYK, cu fonturile transformate în curbe, pentru cele mai precise rezultate.
                                </p>
                            </div>
                        </div>

                        {/* FAQ Visual Section */}
                        <div className="mt-16 border-t border-slate-200 pt-16">
                            <h3 className="text-3xl font-black text-slate-900 mb-8 text-center uppercase">Întrebări Frecvente Cărți de Vizită</h3>
                            <div className="space-y-6 max-w-3xl mx-auto">
                                {[
                                    {
                                        q: "Are sens o carte de vizită dacă abia îmi pornesc afacerea de acasă?",
                                        a: "Da — pentru meșteșugari, cofetari, tunsori la domiciliu sau orice freelancer, o carte de vizită dă un aer profesional imediat, chiar dacă lucrezi singur, fără birou fizic."
                                    },
                                    {
                                        q: "Care este cantitatea minimă de comandă?",
                                        a: "Comanda minimă este de 100 de bucăți pe model grafic — suficient pentru a începe, fără să investești într-un tiraj foarte mare de la început."
                                    },
                                    {
                                        q: "Pot printa pe ambele fețe?",
                                        a: "Da, alegi în configurator print pe o față (4+0) sau față-verso (4+4) — util dacă vrei pe spate un cod QR către portofoliul tău sau programul de lucru."
                                    },
                                    {
                                        q: "Ce este plastifierea Soft-Touch și merită?",
                                        a: "E o peliculă catifelată la atingere, mai plăcută decât plastifierea mată standard și mai rezistentă la amprente — un mic detaliu care face cartea de vizită să pară mai scumpă decât e."
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
