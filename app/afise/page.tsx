import React, { Suspense } from "react";
import AfiseConfigurator from "@/components/AfiseConfigurator";
import { getProductBySlug } from "@/lib/products";
import ProductJsonLd from "@/components/ProductJsonLd";

export const metadata = {
  title: "Afișe și Postere Personalizate | A4, A3, A2, | Magazin Online",
  description: "Print afișe publicitare la rezoluție înaltă. Hârtie foto, blueback sau whiteback. Configurează dimensiunea și tirajul online. Prețuri competitive și livrare rapidă. Comandă materiale publicitare customizate. Tehnologie avansată și finisaje impecabile, design direct din browser.",
  keywords: [
    "afișe publicitare",
    "postere personalizate",
    "tipar afișe",
    "afișe A4 A3 A2 A1",
    "print postere",
    "afișe evenimente",
    "materiale promoționale",
    "hârtie foto blueback"
  ],
  alternates: { canonical: "/afise" },
  openGraph: {
    title: "Afișe și Postere Personalizate | A4, A3, A2, | Magazin Online",
    description: "Print afișe publicitare la rezoluție înaltă. Hârtie foto, blueback sau whiteback. Configurează dimensiunea și tirajul online. Comandă materiale publicitare customizate. Tehnologie avansată și finisaje impecabile, design direct din browser.",
    images: [{
      url: "/products/afise/afise-1.webp",
      width: 1200,
      height: 630,
      alt: "Afișe și postere personalizate"
    }]
  }
};

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function AfisePage({ searchParams }: Props) {
  const product = getProductBySlug("afise");
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.tablou.net"}/afise`;

  const image = typeof searchParams.image === 'string' ? searchParams.image : undefined;

  return (
    <main className="min-h-screen bg-gray-50">
      {product && <ProductJsonLd product={product} url={url} />}

      <Suspense fallback={<div className="h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>}>
        <AfiseConfigurator productSlug="afise" productImage={image} />
      </Suspense>

      {/* MASSIVE SEO CONTENT SECTION - TABLOU PREMIUM */}
      <section className="bg-white py-16 mt-16 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              Afișe și Postere Publicitare de Impact
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Tipar de mari dimensiuni la claritate fotografică. La <strong className="text-indigo-600">Tablou.net</strong>, realizăm afișe, postere și printuri indoor/outdoor care mențin un nivel ridicat al calității indiferent de tiraj sau mărime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-indigo-500 pb-2 inline-block">Materiale Ales Dedicate</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-indigo-100 text-indigo-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                  <div>
                    <strong className="block text-slate-900">Hârtie Blue-Back pentru Outdoor</strong>
                    <span className="text-slate-600 text-sm">Spatele albastru blochează lumina, garantând opacitate 100%. Astfel, noile afișe pot fi lipite direct peste panourile mai vechi pe stradă, fără să transpară grafica anterioară.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-indigo-100 text-indigo-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                  <div>
                    <strong className="block text-slate-900">Hârtie White-Back / Foto Indoor</strong>
                    <span className="text-slate-600 text-sm">Ideală pentru spații închise, hypermaketuri sau săli de spectacol. Stratificarea specială reflectă perfect culorile și atrage atenția imediat la reclame iluminate.</span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Reguli de Design (DTP)</h3>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Un afiș excelent are nevoie de un design aerisit, un titlu (Headline) de mari dimensiuni lizibil de la depărtare și informații structurate.
              </p>
              <p className="text-slate-600 leading-relaxed text-sm">
                Vă rugăm să pregătiți fișierele la o rezoluție de minim 150 - 300 DPI, format PDF sau TIFF (CMYK), iar textele critice să nu ajungă prea aproape de marginea de debitare brutală (lăsați bleed 3mm - 5mm).
              </p>
            </div>
          </div>

          <div className="mt-16 border-t border-slate-200 pt-16">
            <h3 className="text-3xl font-black text-slate-900 mb-8 text-center uppercase">Cele Mai Frecvente Întrebări</h3>
            <div className="space-y-6 max-w-3xl mx-auto">
              {[
                {
                  q: "Există o comandă minimă pentru afișe stradale?",
                  a: "La Tablou, adaptăm oferta: echipamentele noastre de producție permit atât un exemplar de test, unicat (de exeplu A0, A1), cât și sute de afișe (A3 sau A2) calculate la volume avantajoase!"
                },
                {
                  q: "Cu ce produs se lipesc aceste afișe?",
                  a: "Pentru poster indoor se pot folosi rame speciale Click-Frame. Afișele de exterior se lipesc cel mai frecvent pe panouri din OSB, zidărie sau plastic utilizând aracet industrial sau un adeziv tapet ecologic standard."
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