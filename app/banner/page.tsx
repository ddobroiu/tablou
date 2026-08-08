import React, { Suspense } from "react";
import BannerConfigurator from "@/components/BannerConfigurator";
import { getProductBySlug } from "@/lib/products"; // Import corectat
import ProductJsonLd from "@/components/ProductJsonLd";

export const metadata = {
  title: "Bannere Publicitare Personalizate | Print Out | Magazin Online",
  description: "Configurează online bannere publicitare (frontlit). Prețuri de la 9€/mp, finisaje incluse (tiv, capse). Livrare rapidă în toată țara. Rezistente la UV și vreme. Comandă materiale publicitare customizate. Tehnologie avansată și finisaje impecabile, design direct din browser.",
  keywords: [
    "bannere publicitare",
    "bannere PVC",
    "bannere outdoor",
    "bannere personalizate",
    "tipar bannere",
    "bannere rezistente",
    "publicitate exterior",
    "bannere tivite capsate",
    "frontlit banner"
  ],
  alternates: { canonical: "/banner" },
  openGraph: {
    title: "Bannere Publicitare Personalizate | Print Out | Magazin Online",
    description: "Configurează online bannere publicitare (frontlit). Prețuri de la 9€/mp, finisaje incluse (tiv, capse). Livrare rapidă în toată țara. Comandă materiale publicitare customizate. Tehnologie avansată și finisaje impecabile, design direct din browser.",
    images: [{
      url: "/products/banner/banner-1.webp",
      width: 1200,
      height: 630,
      alt: "Bannere publicitare outdoor rezistente"
    }]
  }
};

export default async function BannerPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const product = getProductBySlug("banner");
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.tablou.net"}/banner`;

  const sp = await searchParams;
  const imageParam = sp?.image;
  const image = typeof imageParam === 'string' ? imageParam : undefined;

  return (
    <main className="min-h-screen bg-gray-50">
      {product && <ProductJsonLd product={product} url={url} />}

      {/* FIX: Suspense pentru configurator */}
      <Suspense fallback={<div className="h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>}>
        <BannerConfigurator productSlug="banner" productImage={image} />
      </Suspense>

      {/* MASSIVE SEO CONTENT SECTION - TABLOU PREMIUM */}
      <section className="bg-white py-16 mt-16 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              Bannere Publicitare la Standarde Ales
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              La <strong className="text-indigo-600">Tablou.net</strong>, nu facem compromisuri. Bannerele noastre sunt realizate din material PVC Frontlit premium de 510g/mp, imprimat cu cerneluri certificate care garantează culori vibrante, o durabilitate excepțională și detalii pe care doar brandurile de top le cer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-indigo-500 pb-2 inline-block">De ce un Banner Tablou face diferența?</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-indigo-100 text-indigo-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                  <div>
                    <strong className="block text-slate-900">Densitate și Finisaj Luxury</strong>
                    <span className="text-slate-600 text-sm">Uităm de marginile franjurate sau materialele subțiri care flutură excesiv și se deteriorează în primul sezon. Frontlitul de 510g oferă o stabilitate mecanică excelentă.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-indigo-100 text-indigo-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                  <div>
                    <strong className="block text-slate-900">Precizie Cromatică Pantone</strong>
                    <span className="text-slate-600 text-sm">Pentru agenții, dezvoltatori imobiliari și branduri auto, nuanța exactă este critică. Calibrăm vizual fiecare comandă pentru o reproducere fidelă a identității tale vizuale.</span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Standardul Nostru de Finisaj</h3>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Refuzăm livrarea de produse neterminate. Fiecare banner comandat online include <strong>fără costuri ascunse</strong>: tiv solid executat termic perimetral pentru anti-rupere și capse metalice de oțel plasate matematic la 30-50 cm.
              </p>
              <p className="text-slate-600 leading-relaxed font-bold text-sm">
                Rezultatul este un mesh publicitar care se ancorează perfect întins, aidoma unei pânze de tablou luxury.
              </p>
            </div>
          </div>

          <div className="mt-16 border-t border-slate-200 pt-16">
            <h3 className="text-3xl font-black text-slate-900 mb-8 text-center uppercase">Cele Mai Frecvente Întrebări</h3>
            <div className="space-y-6 max-w-3xl mx-auto">
              {[
                {
                  q: "Care este lățimea maximă dintr-o singură coală de print?",
                  a: "La Tablou.net utlizăm echipamente cu deschidere mare (3.2m), putând printa dintr-o singură bucată reclame imense, fără niciun fel de sudură inestetică."
                },
                {
                  q: "Grafica mea trebuie trimisă într-un format special?",
                  a: "Da, operăm la standarde profesionale. Acceptăm .PDF, .EPS sau .TIFF în CMYK (fără profile de culoare embedded care alterează nuanțele pe print)."
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