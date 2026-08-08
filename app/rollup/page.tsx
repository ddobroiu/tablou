import RollupConfigurator from "@/components/RollupConfigurator";
import type { Metadata } from "next";
import ProductJsonLd from "@/components/ProductJsonLd";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Rollup Banner - Sistem Retractabil Ales | Magazin Online",
  description:
    "Rollup banner profesional cu casetă aluminiu și print Blueback 440g. Dimensiuni: 85cm, 100cm, 120cm, 150cm. Portabil, montaj rapid, perfect pentru evenimente și expoziții.",
  keywords: [
    "rollup banner",
    "roll up",
    "banner retractabil",
    "sistem rollup",
    "afisaj portabil",
    "banner expoziție",
    "rollup profesional",
    "banner evenimente",
    "caseta aluminiu",
    "blueback 440g",
  ],
  alternates: { canonical: "/rollup" },
  openGraph: {
    title: "Rollup Banner - Sistem Retractabil Ales | Magazin Online",
    description:
      "Banner retractabil profesional cu casetă aluminiu. Include print Blueback 440g și geantă transport. Montaj rapid, fără unelte.",
    images: [{
      url: "/products/rollup/rollup-1.webp",
      width: 1200,
      height: 630,
      alt: "Rollup banner retractabil profesional"
    }],
    type: "website",
  },
};

export default async function RollupPage() {
  const productSlug = "rollup";
  let ratingValue: number | undefined;
  let reviewCount: number | undefined;

  try {
    const aggs = await prisma.review.aggregate({
      where: { productSlug },
      _avg: { rating: true },
      _count: { rating: true }
    });
    if (aggs._count.rating > 0) {
      ratingValue = aggs._avg.rating || 0;
      reviewCount = aggs._count.rating;
    }
  } catch (e) {
    // ignore
  }

  return (
    <>
      <ProductJsonLd
        name="Rollup Banner"
        description="Rollup banner profesional cu casetă aluminiu și print Blueback 440g. Dimensiuni: 85cm, 100cm, 120cm, 150cm."
        image="/products/rollup/rollup-1.webp"
        url="https://www.tablou.net/rollup"
        product={{
          slug: productSlug,
          id: productSlug,
          title: "Rollup Banner | Magazin Online",
          description: "Rollup banner profesional Comandă materiale publicitare customizate. Tehnologie avansată și finisaje impecabile, design direct din browser.",
          priceBase: 99, // default lowest price
          images: ["/products/rollup/rollup-1.webp"],
          routeSlug: "rollup"
        }}
        ratingValue={ratingValue}
        reviewCount={reviewCount}
      />
      <RollupConfigurator productSlug={productSlug} />

      {/* MASSIVE SEO CONTENT SECTION - TABLOU PREMIUM */}
      <section className="bg-white py-16 mt-16 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              Sisteme Expoziționale Roll-Up Ales
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Singurele momente când brandul nu se observă la un eveniment? Cele în care standul arată inexpresiv. Prin materialul inovator Blueback utilizat la sistemele retractabile, <strong className="text-indigo-600">Tablou.net</strong> livrează afișaje care rețin formatele drepte perfect – esențial pentru un impact estetic impecabil.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-indigo-500 pb-2 inline-block">Mecanica unui Branding Elegant</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-indigo-100 text-indigo-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                  <div>
                    <strong className="block text-slate-900">Zero "Curling Edge" (Margini îndoite)</strong>
                    <span className="text-slate-600 text-sm">Știi roll-up-urile acelea ieftine, a căror folie se adună inestetic pe părți? Am eliminat acest coșmar. Printăm exlusiv pe folie specială din polipropilenă care stă întinsă pefect vertical pe tot parcursul zilei de expoziție.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-indigo-100 text-indigo-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                  <div>
                    <strong className="block text-slate-900">Casetă Hardware Stabilă</strong>
                    <span className="text-slate-600 text-sm">Cutia de bază este prelucrată din carcasă solidă de aluminiu, nu din plastic fragil, dotată cu tălpi duble reglabile, asigurând verticalitatea perfectă chiar și în holuri aglomerate ale conferințelor.</span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Totul Înclus în Preț</h3>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Ce comanzi, este exact ceea ce expui. Pachetul Roll-Up Tablou este complet: mecanism heavy-duty din aluminiu, folia imprimată cu logo-ul/serviciile tale și o <strong>geantă textilă de transport tip oxford (padded)</strong>.
              </p>
              <p className="text-slate-600 leading-relaxed font-bold text-sm">
                Montajul și demontajul se realizează extrem de discret (sub 60 de secunde), permițându-i oricărui delegat VIP din companie să seteze standul.
              </p>
            </div>
          </div>

          <div className="mt-16 border-t border-slate-200 pt-16">
            <h3 className="text-3xl font-black text-slate-900 mb-8 text-center uppercase">FAQ Sisteme RollUp Rollup</h3>
            <div className="space-y-6 max-w-3xl mx-auto">
              {[
                {
                  q: "Pot refolosi sistemul dacă schimb identitatea vizuală a campaniei?",
                  a: "Da. Modulul de casetă permite schimbarea rezervei printate de către o echipă tehnică, reducând substanțial costurile viitoare."
                },
                {
                  q: "Ce rezoluție recomandați pentru fotografiile afișajului?",
                  a: "Fiind privit de aproape, de la înălțimea vizitatorului, detaliile contează. Se cer imagini minime la 150 - 300 DPI reale și formatare în spectrul CMYK. Astfel se evită orice aberații ale cromaticii fine."
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
    </>
  );
}
