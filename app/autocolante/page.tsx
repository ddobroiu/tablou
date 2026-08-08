import React, { Suspense } from "react";
import AutocolanteConfigurator from "@/components/AutocolanteConfigurator";
import { getProductBySlug } from "@/lib/products";
import ProductJsonLd from "@/components/ProductJsonLd";

export const metadata = {
  title: "Autocolante Personalizate | Print & Decupaj p | Magazin Online",
  description: "Autocolante PVC, etichete și stickere personalizate. Rezistente la exterior, opțiuni de laminare și tăiere pe contur. Comandă online! Adeziv puternic și durabil. Comandă materiale publicitare customizate. Tehnologie avansată și finisaje impecabile, design direct din browser.",
  keywords: [
    "autocolante personalizate",
    "stickere vinyl",
    "etichete adezive",
    "autocolante exterior",
    "decupaj pe contur",
    "autocolante PVC",
    "laminare autocolante",
    "adeziv puternic"
  ],
  alternates: { canonical: "/autocolante" },
  openGraph: {
    title: "Autocolante Personalizate | Print & Decupaj p | Magazin Online",
    description: "Autocolante PVC, etichete și stickere personalizate. Rezistente la exterior, opțiuni de laminare și tăiere pe contur. Comandă online! Comandă materiale publicitare customizate. Tehnologie avansată și finisaje impecabile, design direct din browser.",
    images: [{
      url: "/products/autocolante/autocolante-1.webp",
      width: 1200,
      height: 630,
      alt: "Autocolante personalizate PVC"
    }]
  }
};

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function AutocolantePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const product = getProductBySlug("autocolante");
  const resolvedSearchParams = await searchParams;
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.tablou.net"}/autocolante`;

  const image = typeof resolvedSearchParams.image === 'string' ? resolvedSearchParams.image : undefined;

  return (
    <main className="min-h-screen bg-gray-50">
      {product && <ProductJsonLd product={product} url={url} />}

      <Suspense fallback={<div className="h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>}>
        <AutocolanteConfigurator productSlug="autocolante" productImage={image} />
      </Suspense>

      {/* MASSIVE SEO CONTENT SECTION - TABLOU PREMIUM */}
      <section className="bg-white py-16 mt-16 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              Autocolante PVC și Stickere Ales, Tăiate pe Contur
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              La <strong className="text-indigo-600">Tablou.net</strong> oferim soluții de colantare profesionale, decupate exact după forma graficii tale. Durabilitate extremă la soare și intemperii datorită echipamentelor UV sau laminării suplimentare opționale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-indigo-500 pb-2 inline-block">Calitatea Produselor Noastre</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-indigo-100 text-indigo-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                  <div>
                    <strong className="block text-slate-900">Adeziv Permanent Extra-Strong</strong>
                    <span className="text-slate-600 text-sm">Autocolantul nostru polimeric / monomeric este selectat din game de top (precum Oracal/Avery), asigurând o lipire sigură pe vitrine, mașini, laptopuri sau ambalaje de produse.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-indigo-100 text-indigo-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                  <div>
                    <strong className="block text-slate-900">Tăiere pe Contur Perfectă (Cut & Kiss Cut)</strong>
                    <span className="text-slate-600 text-sm">Deseori, vrei ca sticker-ul tău să aibă forma unui logo rotund, oval sau asimetric. Folosim cuttere-plotter cu senzor optic de mare precizie care urmăresc un contur vectorial furnizat de tine.</span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Pregătirea Graficii (DTP)</h3>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Recomandăm formatul hibrid <strong className="text-black">PDF Vectorial</strong>. Trimiteți grafica principală la rezoluție de minim 300dpi, iar conturul de tăiere (Cut Contour) trebuie să fie desenat cu linii vectoriale separate (culoare spot) într-un strat deasupra graficii.
              </p>
              <p className="text-slate-600 leading-relaxed text-sm">
                Nu uitați de Bleed (margine de tăiere): asigurați-vă că fundalul colorat se extinde cu min 2mm dincolo de linia de decupare mecanică pentru a evita marginile albe inestetice.
              </p>
            </div>
          </div>

          <div className="mt-16 border-t border-slate-200 pt-16">
            <h3 className="text-3xl font-black text-slate-900 mb-8 text-center uppercase">Cele Mai Frecvente Întrebări</h3>
            <div className="space-y-6 max-w-3xl mx-auto">
              {[
                {
                  q: "Pot printa autocolant transparent?",
                  a: "Absolut! Suportăm o gamă extrem de variată de folii: de la autocolant alb (mat/lucios), la folie transparentă (unde culorile devin ușor translucide - ideal pentru design vitraliu / ferestre), și ajungând până la blockout."
                },
                {
                  q: "Cât rezistă afară / la UV?",
                  a: "Un tipar clasic fără laminare pe baza cernelurilor noastre HD rezistă cu succes la decolorare solară între 1-3 ani. Adăugând o opțiune de Laminare Lichidă sau cu Folie, prelungim viața colantului, și îl facem și rezistent la spălări auto abrazive."
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