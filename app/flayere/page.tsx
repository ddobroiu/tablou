import React, { Suspense } from "react";
import FlyerConfigurator from "@/components/FlyerConfigurator";
import { getProductBySlug } from "@/lib/products";
import ProductJsonLd from "@/components/ProductJsonLd";

export const metadata = {
  title: "Flyere Ieftine | A6, A5, DL | Tipografie Online | Magazin Online",
  description: "Comandă flyere pentru promovare stradală sau evenimente. Prețuri mici, tiraje flexibile și livrare rapidă. Hârtie 130g, 170g, 250g mat sau lucios. Comandă materiale publicitare customizate. Tehnologie avansată și finisaje impecabile, design direct din browser.",
  keywords: [
    "flyere ieftine",
    "flyere A6 A5 DL",
    "tipar flyere",
    "flyere promovare",
    "flyere evenimente",
    "tipografie online",
    "flyere personalizate",
    "hârtie mat lucios"
  ],
  alternates: { canonical: "/flayere" },
  openGraph: {
    title: "Flyere Ieftine | A6, A5, DL | Tipografie Online | Magazin Online",
    description: "Comandă flyere pentru promovare stradală sau evenimente. Prețuri mici, tiraje flexibile și livrare rapidă. Comandă materiale publicitare customizate. Tehnologie avansată și finisaje impecabile, design direct din browser.",
    images: [{
      url: "/products/flayere/flayere-1.webp",
      width: 1200,
      height: 630,
      alt: "Flyere ieftine A6 A5 DL"
    }]
  }
};

export default async function FlayerePage() {
  const product = getProductBySlug("flayere"); // Sau "flyer" depinde de cum e în products.ts
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.tablou.net"}/flayere`;

  return (
    <main className="min-h-screen bg-gray-50">
      {product && <ProductJsonLd product={product} url={url} />}

      <Suspense fallback={<div className="h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>}>
        <FlyerConfigurator productSlug="flayere" />
      </Suspense>

      {/* MASSIVE SEO CONTENT SECTION - TABLOU PREMIUM */}
      <section className="bg-white py-16 mt-16 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              Imprimare Flyere și Fluturași Publicitari
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Cea mai eficientă metodă de <strong className="text-indigo-600">marketing direct și promovare locală</strong>. Tipărim pe hârtie premium la tiraje mici și mari. Distribuie-le și crește-ți vânzările chiar de mâine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-indigo-500 pb-2 inline-block">De ce flyerele încă funcționează?</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-indigo-100 text-indigo-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                  <div>
                    <strong className="block text-slate-900">Cost redus, Impact Major</strong>
                    <span className="text-slate-600 text-sm">Cu un efort minimal (ca și preț unitar / bucată), atingeți fizic o audiență garantată (în cutii poștale sau mânate trecătorilor), fără teama că adblocker-ul le ascunde reclama.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-indigo-100 text-indigo-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                  <div>
                    <strong className="block text-slate-900">Formate Ușoare (A5 / A6)</strong>
                    <span className="text-slate-600 text-sm">Flyer-ul A6 este ușor de pus într-un buzunar, ideal pentru o ofertă rapidă (cod voucher de reducere), în timp ce un flyer A5 sau DL (1/3 din A4) are suficientă proporție pentru Meniul unei Pizzerii.</span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Regula principală de Design DTP</h3>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Gândește fața Flyer-ului sub ideea unei "oferte de neegalat". Omul citește maxim 2 secunde un fluturaș înainte de a decide dacă să îl rețină. Atrage-l vizual cu promisiuni mari, și pe verso scrii condițiile, adresa și meniul!
              </p>
            </div>
          </div>

          <div className="mt-16 border-t border-slate-200 pt-16">
            <h3 className="text-3xl font-black text-slate-900 mb-8 text-center uppercase">Întrebări Frecvente Flyere</h3>
            <div className="space-y-6 max-w-3xl mx-auto">
              {[
                {
                  q: "Pe ce suport de hârtie se fac?",
                  a: "În general folosim foi Cretate, fie Lucioase sau Mate, cu gramaje plecând de la 130g/150g (economice/stradale) până la formate rigide, cartonate, de 250g-300g (pentru tichete sau vouchere valoroase)."
                },
                {
                  q: "Pot printa față/verso color?",
                  a: "Da, tehnologia digitală actuală face ca prețul de imprimare față-verso color (4+4 culori CMYK) să fie aproape echivalent cu printul cu o o față simplă, adăugând valoare informațională clientului tău."
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
    </main>
  );
}