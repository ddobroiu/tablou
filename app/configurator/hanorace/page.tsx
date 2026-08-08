import { Suspense } from 'react';
import ConfiguratorDispatcher from "@/components/configurator/ConfiguratorDispatcher";
import ProductSchema from "@/components/ProductSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FAQSchema from "@/components/FAQSchema";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Configurator Hanorace Personalizate',
    description: 'Personalizează-ți hanoracul cu designul sau logo-ul tău. Hanorace groase, bumbac amestec de top, print DTF rezistent la spălări, livrare rapidă.',
    keywords: ['hanorac personalizat', 'configurator hanorace', 'print dtf', 'hanorac gros', 'hanorace la comanda'],
    alternates: {
        canonical: '/configurator/hanorace',
    },
    openGraph: {
        title: 'Configurator Hanorace Personalizate',
        description: 'Personalizează-ți hanoracul online. Calitate premium, călduros.',
        images: ['/placeholder.png'],
    }
};

export default function HanoracePage() {
    return (
        <div className="pt-20">
            <BreadcrumbSchema
                items={[
                    { name: "Acasă", item: "/" },
                    { name: "Configuratoare", item: "/configurator" },
                    { name: "Hanorace Personalizate", item: "/configurator/hanorace" }
                ]}
            />
            <ProductSchema
                name="Hanorace Personalizate"
                description="Hanorace personalizate premium folosing tipar DTF, foarte rezistente și călduroase. Alege culoarea și mărimea dorită."
                image="/placeholder.png"
                url="/configurator/hanorace"
                price="120.00"
            />
            <Suspense fallback={<div className="min-h-[60svh] flex items-center justify-center">Se încarcă configuratorul...</div>}>
                <ConfiguratorDispatcher configuratorId="hanorace" />
            </Suspense>

            <FAQSchema
                faqs={[
                    {
                        question: "Pot pune o poză, nu doar text sau un design grafic?",
                        answer: "Da — poți încărca o fotografie sau un colaj și îl transformăm în printul hanoracului, la fel de simplu ca un design grafic sau text."
                    },
                    {
                        question: "Se potrivesc hanorace identice pentru cuplu sau grup de prieteni?",
                        answer: "Da, mulți clienți comandă hanorace matching — pentru cuplu, familie sau un grup de prieteni, cu același design sau variații mici (nume diferite, de exemplu)."
                    },
                    {
                        question: "Rezistă printul la spălări repetate?",
                        answer: "Da, folosim tehnologie DTF, care nu crapă și nu se decolorează după multe spălări — mult mai durabilă decât printul termic ieftin, la fel ca la tricourile și șepcile noastre personalizate."
                    },
                    {
                        question: "Ce grosime au hanoracele?",
                        answer: "Folosim hanorace groase, din bumbac amestec de calitate, potrivite pentru purtat toată sezonul rece — nu se subțiază și nu se deformează la spălare."
                    }
                ]}
            />

            <section className="bg-white py-16 mt-16 border-t border-slate-100">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                            Un hanorac cu povestea ta, nu un model de raft
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            Realizăm <strong className="text-orange-600">hanorace groase personalizate</strong> de cea mai înaltă calitate, care nu se deformează după spălare. Idee de cadou sau ținută matching pentru cuplu, familie sau prieteni.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-orange-500 pb-2 inline-block">Idei de personalizare</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                    <div>
                                        <strong className="block text-slate-900">Hanorace matching pentru cuplu sau prieteni</strong>
                                        <span className="text-slate-600 text-sm">Design identic sau variații mici — nume, inițiale sau o dată importantă pentru fiecare persoană.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                    <div>
                                        <strong className="block text-slate-900">Cadou personalizat pentru cineva drag</strong>
                                        <span className="text-slate-600 text-sm">Un mesaj, o poză sau un desen — hanoracul devine un cadou mult mai personal decât unul cumpărat gata făcut.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                    <div>
                                        <strong className="block text-slate-900">Print DTF rezistent la purtare zilnică</strong>
                                        <span className="text-slate-600 text-sm">Nu crapă și nu se decolorează la spălări repetate, spre deosebire de broderia ieftină sau printul termic simplu.</span>
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
                                Pentru text, folosește un mesaj scurt — arată mai bine pe hanorac decât un paragraf lung.
                            </p>
                        </div>
                    </div>

                    <div className="mt-16 border-t border-slate-200 pt-16">
                        <h3 className="text-3xl font-black text-slate-900 mb-8 text-center uppercase">Întrebări Frecvente</h3>
                        <div className="space-y-6 max-w-3xl mx-auto">
                            {[
                                {
                                    q: "Pot pune o poză, nu doar text sau un design grafic?",
                                    a: "Da — poți încărca o fotografie sau un colaj și îl transformăm în printul hanoracului, la fel de simplu ca un design grafic sau text."
                                },
                                {
                                    q: "Se potrivesc hanorace identice pentru cuplu sau grup de prieteni?",
                                    a: "Da, mulți clienți comandă hanorace matching — pentru cuplu, familie sau un grup de prieteni, cu același design sau variații mici (nume diferite, de exemplu)."
                                },
                                {
                                    q: "Rezistă printul la spălări repetate?",
                                    a: "Da, folosim tehnologie DTF, care nu crapă și nu se decolorează după multe spălări — mult mai durabilă decât printul termic ieftin, la fel ca la tricourile și șepcile noastre personalizate."
                                },
                                {
                                    q: "Ce grosime au hanoracele?",
                                    a: "Folosim hanorace groase, din bumbac amestec de calitate, potrivite pentru purtat toată sezonul rece — nu se subțiază și nu se deformează la spălare."
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
