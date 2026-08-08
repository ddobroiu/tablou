import { Suspense } from 'react';
import ConfiguratorDispatcher from "@/components/configurator/ConfiguratorDispatcher";
import ProductSchema from "@/components/ProductSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FAQSchema from "@/components/FAQSchema";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Kit Vizibilitate PNRR & Fonduri Europene | Tablou',
    description: 'Toate materialele obligatorii de vizibilitate pentru PNRR, Regio, POC. Panouri șantier, plăci permanente, autocolante și comunicate de presă conform MIV.',
    keywords: ['fonduri europene', 'vizibilitate pnrr', 'panouri santier', 'placi permanente', 'comunicat de presa fonduri', 'tablou'],
    alternates: {
        canonical: '/configurator/fonduri-pnrr',
    },
};

export default function FonduriPNRRPage() {
    return (
        <div className="pt-20">
            <h1 className="sr-only">Kit Vizibilitate PNRR și Fonduri Europene</h1>
            <BreadcrumbSchema
                items={[
                    { name: "Acasă", item: "/" },
                    { name: "Configuratoare", item: "/configurator" },
                    { name: "Fonduri PNRR", item: "/configurator/fonduri-pnrr" }
                ]}
            />
            <ProductSchema
                name="Kit Vizibilitate PNRR"
                description="Panouri de șantier, plăci permanente, autocolante și materiale de comunicare pentru proiecte finanțate prin PNRR, conforme manualului de identitate vizuală."
                image="/products/master/pachet-vizibilitate-fonduri-europene-pnrr.png"
                url="/configurator/fonduri-pnrr"
                price="120.00"
            />
            <Suspense fallback={<div className="min-h-[60svh] flex items-center justify-center text-slate-500 font-medium">Se încarcă configuratorul de fonduri...</div>}>
                <ConfiguratorDispatcher configuratorId="configurator-fonduri" />
            </Suspense>

            <FAQSchema
                faqs={[
                    {
                        question: "Ce diferă la vizibilitatea PNRR față de alte programe europene (Regio, POC)?",
                        answer: "Principiile sunt similare, dar PNRR are propriul manual de identitate vizuală, cu sigla și textele specifice programului — diferă de logo-urile și formatările folosite la fondurile structurale clasice."
                    },
                    {
                        question: "Trebuie și comunicat de presă, nu doar panou fizic?",
                        answer: "Pentru multe proiecte PNRR, da — pe lângă panoul de șantier și placa permanentă, e cerut și un comunicat de presă la începutul și/sau finalul implementării, conform ghidului specific."
                    },
                    {
                        question: "Pot comanda doar placa permanentă, fără tot pachetul?",
                        answer: "Da, configuratorul permite alegerea separată a fiecărui element — panou temporar, placă permanentă sau autocolant — în funcție de etapa proiectului tău."
                    }
                ]}
            />

            {/* CONȚINUT INFORMATIV — Tablou */}
            <section className="bg-white py-16 mt-16 border-t border-slate-100">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                            Materiale de vizibilitate pentru proiecte PNRR
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            Beneficiarii de fonduri prin <strong className="text-orange-600">Planul Național de Redresare și Reziliență</strong> au obligația de a semnala public finanțarea primită. Producem panourile, plăcile și autocolantele conforme manualului de identitate vizuală (MIV) al programului.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-orange-500 pb-2 inline-block">Materiale disponibile</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                    <div>
                                        <strong className="block text-slate-900">Panou de șantier temporar</strong>
                                        <span className="text-slate-600 text-sm">Pentru afișare pe durata implementării proiectului.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                    <div>
                                        <strong className="block text-slate-900">Placă permanentă sau autocolant</strong>
                                        <span className="text-slate-600 text-sm">Montată la finalul proiectului, pentru semnalizare pe termen lung.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                    <div>
                                        <strong className="block text-slate-900">Materiale pentru comunicate de presă</strong>
                                        <span className="text-slate-600 text-sm">Elemente grafice conforme, dacă ghidul programului tău le solicită.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
                            <h3 className="text-2xl font-bold text-slate-800 mb-6">Cum comanzi corect</h3>
                            <p className="text-slate-600 mb-4 leading-relaxed">
                                Trimite-ne, dacă ai la dispoziție, manualul de identitate vizuală specific proiectului tău PNRR — îl folosim pentru a genera materialul exact conform cerințelor de finanțare.
                            </p>
                        </div>
                    </div>

                    <div className="mt-16 border-t border-slate-200 pt-16">
                        <h3 className="text-3xl font-black text-slate-900 mb-8 text-center uppercase">Întrebări Frecvente</h3>
                        <div className="space-y-6 max-w-3xl mx-auto">
                            {[
                                {
                                    q: "Ce diferă la vizibilitatea PNRR față de alte programe europene (Regio, POC)?",
                                    a: "Principiile sunt similare, dar PNRR are propriul manual de identitate vizuală, cu sigla și textele specifice programului — diferă de logo-urile și formatările folosite la fondurile structurale clasice."
                                },
                                {
                                    q: "Trebuie și comunicat de presă, nu doar panou fizic?",
                                    a: "Pentru multe proiecte PNRR, da — pe lângă panoul de șantier și placa permanentă, e cerut și un comunicat de presă la începutul și/sau finalul implementării, conform ghidului specific."
                                },
                                {
                                    q: "Pot comanda doar placa permanentă, fără tot pachetul?",
                                    a: "Da, configuratorul permite alegerea separată a fiecărui element — panou temporar, placă permanentă sau autocolant — în funcție de etapa proiectului tău."
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
