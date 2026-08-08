import React, { Suspense } from "react";
import CanvasConfigurator from "@/components/CanvasConfigurator";
import { getProductBySlug } from "@/lib/products";
import ProductJsonLd from "@/components/ProductJsonLd";

export const metadata = {
  title: "Tablouri Canvas Personalizate | Print pe Pânză | Magazin Online",
  description: "Transformă pozele tale în tablouri canvas. Print de calitate pe pânză bumbac/poliester, întinsă pe șasiu de lemn. Livrare rapidă în toată România. Comandă materiale publicitare customizate. Tehnologie avansată și finisaje impecabile, design direct din browser.",
  keywords: [
    "tablouri canvas",
    "canvas personalizat",
    "print pe pânză",
    "tablouri foto",
    "canvas pe șasiu",
    "decorațiuni perete",
    "cadouri personalizate",
    "pânză bumbac poliester"
  ],
  alternates: { canonical: "/canvas" },
  openGraph: {
    title: "Tablouri Canvas Personalizate | Print pe Pânză | Magazin Online",
    description: "Transformă pozele tale în tablouri canvas. Print de calitate pe pânză bumbac/poliester, întinsă pe șasiu de lemn. Comandă materiale publicitare customizate. Tehnologie avansată și finisaje impecabile, design direct din browser.",
    images: [{
      url: "/products/canvas/canvas-1.webp",
      width: 1200,
      height: 630,
      alt: "Tablouri canvas personalizate"
    }]
  }
};

export default async function CanvasPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const product = getProductBySlug("canvas");
  const resolvedSearchParams = await searchParams;
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.tablou.net"}/canvas`;

  const image = typeof resolvedSearchParams.image === 'string' ? resolvedSearchParams.image : undefined;
  const title = typeof resolvedSearchParams.title === 'string' ? resolvedSearchParams.title : undefined;

  return (
    <main className="min-h-screen bg-gray-50">
      {product && <ProductJsonLd product={product} url={url} />}

      <Suspense fallback={<div className="h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>}>
        <CanvasConfigurator productSlug="canvas" productImage={image} productTitle={title} />
      </Suspense>

      {/* MASSIVE SEO CONTENT SECTION - TABLOU PREMIUM */}
      <section className="bg-white py-16 mt-16 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              Tablouri Canvas Personalizate - Calitate de Galerie
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Transformăm amintirile tale în opere de artă veritabile. La <strong className="text-indigo-600">Tablou.net</strong>, printăm pe pânză canvas din bumbac tratat, folosind echipamente de înaltă rezoluție, și montăm manual pe șasiu din lemn uscat, gata de agățat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-indigo-500 pb-2 inline-block">De ce să ne alegi pe noi?</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-indigo-100 text-indigo-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                  <div>
                    <strong className="block text-slate-900">Pânză Ales Bumbac</strong>
                    <span className="text-slate-600 text-sm">Nu folosim material sintetic subțire. Canvas-ul nostru este gros, texturat fin, capabil să redea detaliile cu o acuratețe uimitoare asemănătoare picturilor clasice.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-indigo-100 text-indigo-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                  <div>
                    <strong className="block text-slate-900">Șasiu de Lemn Tratat</strong>
                    <span className="text-slate-600 text-sm">Structura din lemn de pin este stabilă în timp. Pânza este tensionată perfect mecanic, fixată și vine cu sistem de prindere metalic gratuit.</span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Cadoul Ideal, Perfect pentru Decor</h3>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Fotografiile de la nuntă, momentele speciale din vacanțe sau portretele de familie merită expuse cu mândrie. Tabloul pe pânză canvas aduce o notă de eleganță oricărui perete, fie acasă, fie în birouri moderne.
              </p>
              <p className="text-slate-600 leading-relaxed font-bold text-sm">
                Trimite o imagine la de minim 2MB (rezoluție mare) și lasă experții tăi în DTP să se ocupe de o încadrare perfectă, inclusiv acoperirea marginilor 3D invizibile!
              </p>
            </div>
          </div>

          <div className="mt-16 border-t border-slate-200 pt-16">
            <h3 className="text-3xl font-black text-slate-900 mb-8 text-center uppercase">Cele Mai Frecvente Întrebări</h3>
            <div className="space-y-6 max-w-3xl mx-auto">
              {[
                {
                  q: "Cum se întreține un tablou canvas?",
                  a: "Este foarte simplu: culorile fiind polimerizate / stabilizate ecologic, praful se poate șterge pur și simplu cu o cârpă moale, uscată din microfibră sau un pămătuf. Evitați apă sau substanțe chimice agresive de curățare."
                },
                {
                  q: "Pânza se continuă și pe marginile laterale (3D effect)?",
                  a: "Da, tehnica utilizată de noi este (Gallery Wrap), unde marginile tabloului (grosimea de aprox. 2cm) sunt îmbrăcate complet din imaginea trimisă, oferind volum fără a fi nevoie de o ramă exterioară suplimentară."
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