import { Suspense } from 'react';
import BannerConfigurator from "@/components/configurator/BannerConfigurator";
import ProductSchema from "@/components/ProductSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FAQSchema from "@/components/FAQSchema";
import { Metadata } from 'next';
import { SeoDimensionsLinks } from '@/components/SeoDimensionsLinks';

export const metadata: Metadata = {
  title: 'Banner Personalizat pentru Orice Ocazie - Configurator Online | Tablou',
  description: 'Bannere personalizate pentru evenimente, aniversări, deschideri de afacere sau reclame — configurezi online, alegi dimensiunea, vezi prețul instant. Livrare 24-48h.',
  keywords: ['banner personalizat', 'banner eveniment', 'banner aniversare', 'configurator banner online', 'tablou'],
  alternates: {
    canonical: '/configurator/banner',
  },
  openGraph: {
    title: 'Banner Personalizat pentru Orice Ocazie | Tablou',
    description: 'Alege dimensiunea, vezi prețul, comandă online.',
    images: ['/products/banner/banner-1.webp'],
  }
};

export default function BannerPage() {
  return (
    <div className="pt-20">
      <h1 className="sr-only">Banner Personalizat pentru Orice Ocazie - Configurator Online Print Outdoor</h1>
      <BreadcrumbSchema
        items={[
          { name: "Acasă", item: "/" },
          { name: "Configuratoare", item: "/configurator" },
          { name: "Bannere Publicitare", item: "/configurator/banner" }
        ]}
      />
      <ProductSchema
        name="Banner Publicitar Personalizat"
        description="Banner personalizat pe material frontlit, tiv și capse incluse. Potrivit pentru evenimente, aniversări sau reclame de afaceri."
        image="/products/banner/banner-1.webp"
        url="/configurator/banner"
        price="45.00"
      />
      <Suspense fallback={<div className="min-h-[60svh] flex items-center justify-center">Se încarcă configuratorul...</div>}>
        <BannerConfigurator />
      </Suspense>

      <FAQSchema
        faqs={[
          {
            question: "Pot face un banner pentru o petrecere sau aniversare, nu doar pentru firmă?",
            answer: "Da, sigur. Configuratorul funcționează la fel indiferent de ce ai de sărbătorit — aniversare, nuntă, majorat sau deschidere de afacere. Alegi dimensiunea potrivită locului unde îl montezi și trimiți designul tău sau textul dorit."
          },
          {
            question: "Cât de mic sau mare poate fi bannerul?",
            answer: "De la un banner de masă, de câteva zeci de centimetri, până la unul de câțiva metri pentru o fațadă — prețul se calculează pe metru pătrat, cu un minim facturabil de 1 mp."
          },
          {
            question: "Vine gata de agățat sau trebuie să cumpăr eu accesorii?",
            answer: "Vine gata de montat: tiv cusut pe margini și capse metalice din 30 în 30cm, incluse fără cost suplimentar — ai nevoie doar de sfoară sau coliere de plastic."
          },
          {
            question: "În câte zile îl primesc, dacă am eveniment în weekend?",
            answer: "Producția e rapidă (cerneala UV se usucă instant), iar livrarea prin curier durează de regulă 24-48h de la aprobarea designului — planifică-ți comanda cu câteva zile înainte de eveniment, ca să ai rezervă de timp."
          }
        ]}
      />

      {/* SEO CONTENT SECTION — conținut unic Tablou */}
      <section className="bg-white py-16 mt-16 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              Un banner pentru orice ai de sărbătorit sau anunțat
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Nu e doar pentru afaceri: <strong className="text-emerald-600">bannerul personalizat</strong> e la fel de potrivit pentru o petrecere, o aniversare surpriză sau un anunț "De vânzare" — configurezi rapid, vezi prețul și primești produsul acasă.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-emerald-500 pb-2 inline-block">Ce primești</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                  <div>
                    <strong className="block text-slate-900">Culori vii, care nu se șterg din poze</strong>
                    <span className="text-slate-600 text-sm">Print UV de rezoluție înaltă — arată bine și în fotografiile de la eveniment, nu doar în realitate.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                  <div>
                    <strong className="block text-slate-900">Gata de montat, fără scule</strong>
                    <span className="text-slate-600 text-sm">Tiv și capse incluse — îl agăți cu o sfoară în câteva minute, fie la petrecere, fie la vitrină.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                  <div>
                    <strong className="block text-slate-900">Orice dimensiune, un singur preț clar</strong>
                    <span className="text-slate-600 text-sm">Alegi lățimea și înălțimea în configurator și vezi prețul pe loc, indiferent cât de mare sau mic e bannerul.</span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Idei pentru ce poți folosi un banner personalizat</h3>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Aniversări și majorate, banner de "Bun venit acasă", deschideri de afacere, anunțuri "De vânzare"/"De închiriat", standuri la evenimente locale — practic orice moment în care vrei un mesaj mare, vizibil de departe.
              </p>
              <p className="text-slate-600 leading-relaxed font-bold">
                Sfat: dacă vrei text pe banner, lasă 5 cm liberi pe margini, ca literele să nu ajungă exact unde montăm capsele.
              </p>
            </div>
          </div>

          <div className="mt-16 border-t border-slate-200 pt-16">
            <h3 className="text-3xl font-black text-slate-900 mb-8 text-center uppercase">Întrebări Frecvente</h3>
            <div className="space-y-6 max-w-3xl mx-auto">
              {[
                {
                  q: "Pot face un banner pentru o petrecere sau aniversare, nu doar pentru firmă?",
                  a: "Da, sigur. Configuratorul funcționează la fel indiferent de ce ai de sărbătorit — aniversare, nuntă, majorat sau deschidere de afacere. Alegi dimensiunea potrivită locului unde îl montezi și trimiți designul tău sau textul dorit."
                },
                {
                  q: "Cât de mic sau mare poate fi bannerul?",
                  a: "De la un banner de masă, de câteva zeci de centimetri, până la unul de câțiva metri pentru o fațadă — prețul se calculează pe metru pătrat, cu un minim facturabil de 1 mp."
                },
                {
                  q: "Vine gata de agățat sau trebuie să cumpăr eu accesorii?",
                  a: "Vine gata de montat: tiv cusut pe margini și capse metalice din 30 în 30cm, incluse fără cost suplimentar — ai nevoie doar de sfoară sau coliere de plastic."
                },
                {
                  q: "În câte zile îl primesc, dacă am eveniment în weekend?",
                  a: "Producția e rapidă (cerneala UV se usucă instant), iar livrarea prin curier durează de regulă 24-48h de la aprobarea designului — planifică-ți comanda cu câteva zile înainte de eveniment, ca să ai rezervă de timp."
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
            productId="banner"
            productName="Banner Frontlit"
            currentW={100}
            currentH={100}
          />
        </div>
      </section>
    </div>
  );
}
