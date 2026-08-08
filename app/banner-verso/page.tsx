import React, { Suspense } from "react";
import BannerVersoConfigurator from "@/components/BannerVersoConfigurator";
import { getProductBySlug } from "@/lib/products";
import ProductJsonLd from "@/components/ProductJsonLd";

export const metadata = {
  title: "Banner Față-Verso (Blockout) | Print Double Sided",
  description: "Bannere printate pe ambele fețe (blockout). Ideale pentru vizibilitate stradală maximă. Material opac rezistent.",
  alternates: { canonical: "/banner-verso" },
};

export default async function BannerVersoPage() {
  const product = getProductBySlug("banner-verso");
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.tablou.net"}/banner-verso`;

  return (
    <main className="min-h-screen bg-gray-50">
      {product && <ProductJsonLd product={product} url={url} />}

      <Suspense fallback={<div className="h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>}>
        <BannerVersoConfigurator productSlug="banner-verso" />
      </Suspense>

      {/* MASSIVE SEO CONTENT SECTION - TABLOU PREMIUM */}
      <section className="bg-white py-16 mt-16 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              Bannere Față-Verso: Opacitate și Vizibilitate Absolută
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Folosind polimerizarea blockout premium, <strong className="text-indigo-600">Tablou.net</strong> creează steaguri și bannere stradale perpendiculare care redefinesc ideea de vizibilitate din orice unghi a brandului tău de lux.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-indigo-500 pb-2 inline-block">De ce să alegi Blockout pentru exterior?</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-indigo-100 text-indigo-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                  <div>
                    <strong className="block text-slate-900">Zonă Carbon Opacă</strong>
                    <span className="text-slate-600 text-sm">Materialul are un miez din carbon invizibil la exterior, care barează efectiv razele de soare. Razele UV puternice nu vor translumina bannerul, garantând vizualizarea perfectă a ambelor grafice distincte simultan, fără „interferență optică”.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-indigo-100 text-indigo-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                  <div>
                    <strong className="block text-slate-900">Construcție Heavy-Duty</strong>
                    <span className="text-slate-600 text-sm">Fabricate având un drapaj excelent, aceste produse stau întinse ferm, ideale pentru steagurile de marcaj auto sau semnalizarea parcărilor corporative de grad A.</span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Pregătirea PDF-ului pentru Print</h3>
              <p className="text-slate-600 mb-4 leading-relaxed">
                La cerințele clienților noștri corporativi, configuratorul suportă încărcarea de grafică complexă. Poți avea un mesaj promoțional pe <strong>Față</strong> și o hartă de localizare pe <strong>Spate</strong>.
              </p>
              <p className="text-slate-600 leading-relaxed font-bold">
                Îți vom cere PDF-ul generat ca fișier Multipagină (Page 1 + Page 2) pentru a asigura trasabilitatea impecabilă pe parcursul tiparului!
              </p>
            </div>
          </div>

          <div className="mt-16 border-t border-slate-200 pt-16">
            <h3 className="text-3xl font-black text-slate-900 mb-8 text-center uppercase">Aspecte Tehnice</h3>
            <div className="space-y-6 max-w-3xl mx-auto">
              {[
                {
                  q: "E nevoie de buzunar sau fante de vânt?",
                  a: "Un banner montat „tip steag” va necesita de obicei buzunare (sus/jos) pentru fixarea pe brațul stradal metalic. Tablou realizează buzunare la cerere folosind tehnică de mare tenacitate la lipitura termică."
                },
                {
                  q: "Puteți asigura fidelitatea culorilor pe ambele fețe?",
                  a: "Absolut. Mașinile industriale folosite utilizează software avansat de aliniere și profile de culoare stricte, oferind aceeași profunzime cromatică (CMYK) pe fața 1 cât și pe fața 2."
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