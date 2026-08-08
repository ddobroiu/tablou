import ConfiguratorDispatcher from "@/components/configurator/ConfiguratorDispatcher";
import ProductSchema from "@/components/ProductSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FAQSchema from "@/components/FAQSchema";
import { Metadata } from 'next';
import { Suspense } from "react";

export const metadata: Metadata = {
    title: 'Poză pe Plexiglas - Print Acrilic Personalizat, Cadou | Tablou',
    description: 'Poza ta preferată printată pe plexiglas transparent, cu efect de adâncime și luciu de sticlă. Cadou deosebit sau placă decorativă personalizată. Print UV, grosimi 2-10mm.',
    keywords: ['poza pe plexiglas', 'print acrilic personalizat', 'placa plexiglas cadou', 'plexiglas transparent poza', 'tablou'],
};

export default function PlexiglassPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Se încarcă configuratorul Plexiglas...</div>}>
            <div className="pt-20">
                <h1 className="sr-only">Poză pe Plexiglas - Print Acrilic Personalizat</h1>
                <BreadcrumbSchema
                    items={[
                        { name: "Acasă", item: "/" },
                        { name: "Materiale", item: "/materiale" },
                        { name: "Plexiglas", item: "/materiale/plexiglass" }
                    ]}
                />
                <ProductSchema
                    name="Poză pe Plexiglas Personalizat"
                    description="Poza ta preferată printată pe plexiglas transparent, cu efect de adâncime — cadou deosebit sau placă decorativă personalizată."
                    image="/products/master/placi-plexiglass-transparent-personalizat-print-uv.png"
                    url="/materiale/plexiglass"
                    price="45.00"
                />
                <ConfiguratorDispatcher configuratorId="plexiglass" />

                <FAQSchema
                    faqs={[
                        {
                            question: "De ce arată o poză pe plexiglas mai bine decât un print normal?",
                            answer: "Transparența materialului dă un efect de adâncime și un luciu asemănător sticlei — culorile par să „plutească” în interiorul plăcii, un efect pe care hârtia sau canvasul nu îl pot reda."
                        },
                        {
                            question: "Se potrivește ca idee de cadou?",
                            answer: "Da — este un cadou puțin mai neobișnuit decât un tablou clasic, potrivit pentru aniversări, nunți sau ca placă decorativă cu o poză de familie, un citat sau un logo personal."
                        },
                        {
                            question: "Pot face și o placă cu nume sau text, nu doar poză?",
                            answer: "Sigur — plăcuțe personalizate cu nume, un citat sau un mesaj sunt la fel de populare, atât ca decor de birou sau casă, cât și ca mic cadou."
                        },
                        {
                            question: "Ce grosime aleg?",
                            answer: "Pentru o placă decorativă de birou sau perete, 3-5mm este suficient. Pentru piese mai mari sau care stau libere pe un suport, recomandăm 8-10mm pentru rigiditate."
                        }
                    ]}
                />

                {/* SEO CONTENT SECTION — conținut unic Tablou */}
                <section className="bg-white py-16 mt-16 border-t border-slate-100">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                                Poza ta, cu efectul de adâncime al sticlei
                            </h2>
                            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                                Plexiglasul <strong className="text-emerald-600">transparent, printat UV direct</strong>, dă pozelor un aer premium — culorile par să plutească în placă, nu doar tipărite pe o suprafață plată. Un cadou sau o piesă decorativă diferită de un tablou obișnuit.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-emerald-500 pb-2 inline-block">Idei de folosire</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Cadou cu o poză de familie sau cuplu</strong>
                                            <span className="text-slate-600 text-sm">Un cadou de aniversare sau nuntă care iese din tiparul tabloului clasic — luciu și adâncime vizuală în plus.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Plăcuță personalizată cu nume sau citat</strong>
                                            <span className="text-slate-600 text-sm">Decor de birou, un mesaj motivațional sau un citat preferat, gata de pus pe un suport pe masă.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div>
                                            <strong className="block text-slate-900">Placă decorativă sau semn personalizat</strong>
                                            <span className="text-slate-600 text-sm">Pentru casă (numărul locuinței, un logo personal) sau ca semn distinctiv la un mic birou/atelier.</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
                                <h3 className="text-2xl font-bold text-slate-800 mb-6">Ce poză se pretează cel mai bine</h3>
                                <p className="text-slate-600 mb-4 leading-relaxed">
                                    Fotografiile cu contrast bun și culori vii ies cel mai spectaculos pe plexiglas transparent, datorită efectului de luminozitate al materialului.
                                </p>
                                <p className="text-slate-600 leading-relaxed font-bold">
                                    Debitarea se face CNC, la dimensiunea exactă cerută — inclusiv forme personalizate, nu doar dreptunghi standard.
                                </p>
                            </div>
                        </div>

                        {/* SEO FAQ Structured Schema */}
                        <div className="mt-16 border-t border-slate-200 pt-16">
                            <h3 className="text-3xl font-black text-slate-900 mb-8 text-center uppercase">Întrebări Frecvente Plexiglas</h3>
                            <div className="space-y-6 max-w-3xl mx-auto">
                                {[
                                    {
                                        q: "De ce arată o poză pe plexiglas mai bine decât un print normal?",
                                        a: "Transparența materialului dă un efect de adâncime și un luciu asemănător sticlei — culorile par să „plutească” în interiorul plăcii, un efect pe care hârtia sau canvasul nu îl pot reda."
                                    },
                                    {
                                        q: "Se potrivește ca idee de cadou?",
                                        a: "Da — este un cadou puțin mai neobișnuit decât un tablou clasic, potrivit pentru aniversări, nunți sau ca placă decorativă cu o poză de familie, un citat sau un logo personal."
                                    },
                                    {
                                        q: "Pot face și o placă cu nume sau text, nu doar poză?",
                                        a: "Sigur — plăcuțe personalizate cu nume, un citat sau un mesaj sunt la fel de populare, atât ca decor de birou sau casă, cât și ca mic cadou."
                                    },
                                    {
                                        q: "Ce grosime aleg?",
                                        a: "Pentru o placă decorativă de birou sau perete, 3-5mm este suficient. Pentru piese mai mari sau care stau libere pe un suport, recomandăm 8-10mm pentru rigiditate."
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
