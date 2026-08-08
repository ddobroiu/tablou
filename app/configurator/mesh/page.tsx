import { Suspense } from 'react';
import ConfiguratorDispatcher from "@/components/configurator/ConfiguratorDispatcher";
import ProductSchema from "@/components/ProductSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FAQSchema from "@/components/FAQSchema";
import { Metadata } from 'next';
import { SeoDimensionsLinks } from '@/components/SeoDimensionsLinks';

export const metadata: Metadata = {
  title: 'Mesh publicitar personalizat - Configurator online',
  description: 'Comandă mesh publicitar la dimensiuni custom. Tiv și capse incluse. Livrare rapidă în toată țara.',
  keywords: ['mesh publicitar', 'banner mesh', 'configurator mesh', 'print mesh', 'fațade mesh', 'tablou'],
  alternates: {
    canonical: '/configurator/mesh',
  },
  openGraph: {
    title: 'Configurator Mesh publicitar',
    description: 'Mesh publicitar la dimensiuni tale, configurare și comandă online.',
    images: ['/products/mesh/mesh_publicitar_personalizat.jpg'],
  }
};

export default function MeshConfiguratorPage() {
  return (
    <div className="pt-20">
      <h1 className="sr-only">Mesh publicitar personalizat - configurator online print outdoor</h1>
      <BreadcrumbSchema
        items={[
          { name: "Acasă", item: "/" },
          { name: "Configuratoare", item: "/configurator" },
          { name: "Mesh publicitar", item: "/configurator/mesh" }
        ]}
      />
      <ProductSchema
        name="Mesh publicitar personalizat"
        description="Mesh publicitar pentru exterior. Tiv și capse incluse. Configurare online la dimensiunile tale."
        image="/products/mesh/mesh_publicitar_personalizat.jpg"
        url="/configurator/mesh"
        price="45.00"
      />
      <Suspense fallback={<div className="min-h-[60svh] flex items-center justify-center">Se încarcă configuratorul...</div>}>
        <ConfiguratorDispatcher configuratorId="mesh" />
      </Suspense>

      <FAQSchema
        faqs={[
          {
            question: "Pentru ce se folosește mesh-ul?",
            answer: "Pentru reclame mari la exterior: fațade de clădiri în renovare, garduri de șantier, schele și alte zone expuse la vânt puternic."
          },
          {
            question: "De ce mesh și nu banner PVC clasic pe o fațadă?",
            answer: "Fiind microperforat, mesh-ul lasă vântul să treacă parțial prin material, în loc să se comporte ca o pânză de velă — reduce mult riscul de rupere sau smulgere din prindere la suprafețe mari și înalte."
          },
          {
            question: "Ce finisaje sunt incluse?",
            answer: "Tiv perimetral și capse metalice de prindere, incluse în prețul afișat în configurator."
          },
          {
            question: "Cum trimit grafica?",
            answer: "Încarci fișierul în pasul Grafică din configurator (PDF, AI, CDR, TIFF sau JPG la rezoluție potrivită)."
          }
        ]}
      />

      <section className="bg-white py-16 mt-16 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              Mesh publicitar la comandă
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Mesh <strong className="text-orange-600">370 g/m²</strong>, microperforat și rezistent la vânt — pentru fațade, reabilitări, garduri și panouri uriașe. Configurezi dimensiunile și comanzi online.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-orange-500 pb-2 inline-block">De ce mesh, nu banner clasic</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                  <div>
                    <strong className="block text-slate-900">Microperforat, rezistent la vânt</strong>
                    <span className="text-slate-600 text-sm">Vântul trece parțial prin material, în loc să-l umfle ca pe o velă — esențial pentru suprafețe mari, montate sus, pe schele sau fațade.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                  <div>
                    <strong className="block text-slate-900">Finisaje incluse</strong>
                    <span className="text-slate-600 text-sm">Tiv perimetral și capse metalice, gata de montat direct pe schelă sau gard, fără costuri ascunse.</span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Pregătirea comenzii</h3>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Introdu dimensiunile exacte ale suprafeței de acoperit — mesh-ul se croiește la comandă, cu tiv și capse pe tot perimetrul.
              </p>
              <p className="text-slate-600 leading-relaxed font-bold">
                Trimite grafica în format CMYK, la rezoluție potrivită pentru vizualizare de la distanță.
              </p>
            </div>
          </div>

          <div className="mt-16 border-t border-slate-200 pt-16 mb-16">
            <h3 className="text-3xl font-black text-slate-900 mb-8 text-center uppercase">Întrebări Frecvente Mesh</h3>
            <div className="space-y-6 max-w-3xl mx-auto">
              {[
                {
                  q: "Pentru ce se folosește mesh-ul?",
                  a: "Pentru reclame mari la exterior: fațade de clădiri în renovare, garduri de șantier, schele și alte zone expuse la vânt puternic."
                },
                {
                  q: "De ce mesh și nu banner PVC clasic pe o fațadă?",
                  a: "Fiind microperforat, mesh-ul lasă vântul să treacă parțial prin material, în loc să se comporte ca o pânză de velă — reduce mult riscul de rupere sau smulgere din prindere la suprafețe mari și înalte."
                },
                {
                  q: "Ce finisaje sunt incluse?",
                  a: "Tiv perimetral și capse metalice de prindere, incluse în prețul afișat în configurator."
                },
                {
                  q: "Cum trimit grafica?",
                  a: "Încarci fișierul în pasul Grafică din configurator (PDF, AI, CDR, TIFF sau JPG la rezoluție potrivită)."
                }
              ].map((faq, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                  <h4 className="font-bold text-lg text-slate-900 mb-2">{faq.q}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          <SeoDimensionsLinks
            productId="mesh"
            productName="Mesh publicitar"
            currentW={100}
            currentH={100}
          />
        </div>
      </section>
    </div>
  );
}
