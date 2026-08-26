import React, { Suspense } from "react";
import Link from "next/link";
import CanvasConfigurator from "@/components/CanvasConfigurator";
import { getProductBySlug } from "@/lib/products";
import ProductJsonLd from "@/components/ProductJsonLd";
import FAQSchema from "@/components/FAQSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { CANVAS_CONSTANTS } from "@/lib/pricing";

export const metadata = {
  title: "Tablouri Canvas Personalizate | Print pe Pânză | Magazin Online",
  description: "Transformă pozele tale în tablouri canvas de galerie. Print de calitate pe pânză bumbac/poliester, întinsă manual pe șasiu de lemn, cu 3 tipuri de margine (albă, oglindă, răsfrântă) și dimensiuni de la 30x40 la 100x120 cm sau personalizate. Ghid complet de alegere a dimensiunii, rezoluției și cadoului potrivit. Livrare rapidă în toată România.",
  keywords: [
    "tablouri canvas",
    "canvas personalizat",
    "print pe pânză",
    "tablouri foto",
    "canvas pe șasiu",
    "decorațiuni perete",
    "cadouri personalizate",
    "pânză bumbac poliester",
    "ghid tablouri canvas",
    "dimensiuni tablou canvas",
    "margine canvas oglindă răsfrântă",
    "canvas cu ramă",
    "canvas fără ramă"
  ],
  alternates: { canonical: "/canvas" },
  openGraph: {
    title: "Tablouri Canvas Personalizate | Print pe Pânză | Magazin Online",
    description: "Transformă pozele tale în tablouri canvas de galerie. Print pe pânză bumbac/poliester, întinsă manual pe șasiu de lemn, cu 3 tipuri de margine și dimensiuni de la 30x40 la 100x120 cm sau personalizate. Ghid de dimensiuni, rezoluție și cadou potrivit.",
    images: [{
      url: "/products/canvas/canvas-1.webp",
      width: 1200,
      height: 630,
      alt: "Tablouri canvas personalizate"
    }]
  }
};

const CANVAS_FAQS = [
  {
    q: "Din ce este făcută pânza canvas?",
    a: "Pânză canvas din bumbac tratat, groasă și texturată fin, capabilă să redea detaliile cu o acuratețe asemănătoare picturilor clasice — nu un material sintetic subțire."
  },
  {
    q: "Ce este tehnica gallery wrap și de ce nu se vede o ramă exterioară?",
    a: "Gallery wrap înseamnă că pânza se întinde peste marginile șasiului (grosime de aproximativ 2 cm), acoperind complet lateralele — tabloul are volum și poate fi agățat direct, fără o ramă exterioară suplimentară."
  },
  {
    q: "Ce tipuri de margine (finisaj) pot alege pentru canvas?",
    a: "Trei variante: margine albă (bandă albă pe lateral, imaginea rămâne intactă), margine oglindă (marginea imaginii se reflectă pe lateral, fără linie de întrerupere) și margine răsfrântă/wrap (imaginea reală continuă fizic pe lateral). Alegerea depinde de ce se află la marginea pozei tale."
  },
  {
    q: "Ce dimensiune de canvas aleg pentru living, dormitor sau hol?",
    a: "Orientativ: 80×120 cm sau 90×120 cm pentru living (canapea la 2,5-3 m), 60×90 cm sau 70×100 cm pentru dormitor (deasupra patului), și 40×60 cm sau 50×70 cm pentru hol sau spații mai înguste."
  },
  {
    q: "Ce rezoluție trebuie să aibă poza pentru un canvas mare?",
    a: "Minimum 2000 pixeli pe latura lungă pentru formate până la 60×90 cm, și ideal 3000+ pixeli pentru formate peste 80×120 cm. Configuratorul verifică automat fișierul încărcat și te avertizează dacă rezoluția e prea mică pentru dimensiunea aleasă."
  },
  {
    q: "Ce format de fișier accepți pentru poză?",
    a: "JPG, PNG sau TIFF. Recomandăm poza originală, direct din galeria telefonului sau dintr-un email/Drive, nu una descărcată dintr-o conversație de WhatsApp, unde imaginea e comprimată automat."
  },
  {
    q: "Care e diferența dintre canvas cu ramă și canvas clasic pe șasiu?",
    a: "Canvas-ul clasic pe șasiu acceptă orice dimensiune personalizată și are aspect modern, fără chenar vizibil. Canvas-ul cu ramă vine la dimensiuni prestabilite, cu preț calculat din tabel și discount automat de la 2 bucăți identice comandate, util pentru comenzi corporate sau cadouri multiple."
  },
  {
    q: "Pot comanda dimensiuni personalizate?",
    a: "Da — la varianta fără ramă introduci direct în configurator lățimea și înălțimea dorite, în centimetri, fără să fii limitat la o listă fixă de formate."
  },
  {
    q: "Cât durează producția și livrarea?",
    a: "Pânza se întinde manual, deci producția durează aproximativ 24h lucrătoare, plus livrarea prin curier — de regulă tabloul ajunge acasă în 24-48h. Pentru un eveniment programat (nuntă, aniversare), recomandăm să comanzi cu cel puțin 4-5 zile lucrătoare înainte."
  },
  {
    q: "Cum întrețin și curăț un tablou canvas?",
    a: "Culorile fiind stabilizate, praful se șterge pur și simplu cu o cârpă moale, uscată din microfibră sau un pămătuf. Evită apa sau substanțele chimice agresive de curățare."
  },
  {
    q: "Șasiul este inclus în preț? Ce grosime are?",
    a: "Da, toate tablourile canvas vin montate pe șasiu din lemn de rășinoase, cu grosime de 2 cm sau 4 cm la alegere, gata de atârnat, cu sistem de prindere metalic inclus."
  },
  {
    q: "Se potrivește un tablou canvas ca idee de cadou?",
    a: "Este unul dintre cele mai apreciate cadouri personalizate — pentru nunți, aniversări, cadouri pentru părinți sau bunici, ori pentru un coleg care se mută la un birou nou. Rămâne pe perete ani de zile, spre deosebire de multe cadouri de ocazie."
  },
  {
    q: "Canvas sau plexiglas — care e diferența?",
    a: "Canvas-ul are aspect mat, texturat, asemănător unei picturi, e ușor și fără reflexii de sticlă. Plexiglasul are luciu și transparență asemănătoare sticlei, cu efect de adâncime — culorile par să „plutească” în placă, dar e mai rigid și mai formal ca aspect."
  },
  {
    q: "Pot comanda mai multe tablouri pentru o galerie de perete?",
    a: "Da — poți comanda mai multe piese la dimensiuni diferite sau identice și le poți aranja împreună pe un perete, folosind un șablon simplu (rând unic, grid simetric sau aranjare liberă)."
  },
  {
    q: "Aleg poza alb-negru sau color pentru canvas?",
    a: "Alb-negru funcționează bine pentru portrete și poze cu expresii puternice, dând un aspect atemporal. Color păstrează atmosfera reală a momentului (cer, verdeață, culori de la eveniment) — configuratorul îți permite să previzualizezi ambele variante înainte de comandă."
  },
];

const FRAMED_SIZES = Object.keys(CANVAS_CONSTANTS.FRAMED_PRICES_RECTANGLE);

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
      <BreadcrumbSchema
        items={[
          { name: "Acasă", item: "/" },
          { name: "Tablouri Canvas", item: "/canvas" }
        ]}
      />
      <FAQSchema faqs={CANVAS_FAQS.map((f) => ({ question: f.q, answer: f.a }))} />

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

          {/* Tipuri de margine / finisaj */}
          <div className="mt-16 border-t border-slate-200 pt-16">
            <h3 className="text-3xl font-black text-slate-900 mb-4 text-center uppercase">Trei Tipuri de Finisaj pentru Margini</h3>
            <p className="text-slate-600 text-center max-w-2xl mx-auto mb-10">
              Pânza se întinde pe șasiu, deci marginile laterale (2-4 cm) trebuie umplute cu ceva. Alege în configurator varianta potrivită, în funcție de ce se află chiar la marginea pozei tale.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-lg text-slate-900 mb-2">Margine albă</h4>
                <p className="text-slate-600 text-sm leading-relaxed">O bandă albă acoperă lateralele șasiului, iar imaginea rămâne intactă pe toată fața tabloului. Cea mai sigură alegere când o față sau un detaliu important ajunge aproape de marginea pozei.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-lg text-slate-900 mb-2">Margine oglindă</h4>
                <p className="text-slate-600 text-sm leading-relaxed">Marginea imaginii se reflectă pe lateralele șasiului, fără linie de întrerupere vizibilă. Ideală pentru peisaje, texturi sau fundaluri neuniforme (cer, apă, iarbă).</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-lg text-slate-900 mb-2">Margine răsfrântă (wrap)</h4>
                <p className="text-slate-600 text-sm leading-relaxed">Poza reală se continuă fizic pe lateralele șasiului — cea mai "curată" variantă vizual, dar acea bucată din margine dispare de pe fața tabloului.</p>
              </div>
            </div>
            <p className="text-center mt-8">
              <Link href="/blog/margine-alba-oglinda-sau-rasfranta-canvas" className="text-indigo-600 font-bold hover:underline">Ghid complet: cum alegi marginea potrivită pozei tale →</Link>
            </p>
          </div>

          {/* Dimensiuni pe camere */}
          <div className="mt-16 border-t border-slate-200 pt-16">
            <h3 className="text-3xl font-black text-slate-900 mb-4 text-center uppercase">Ce Dimensiune Aleg, În Funcție de Cameră</h3>
            <p className="text-slate-600 text-center max-w-2xl mx-auto mb-10">
              Dimensiunea potrivită depinde de distanța de la care privești peretele, nu de cât de mare e camera. Reper rapid, pe tipuri de spații:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <strong className="block text-slate-900 mb-1">Living (canapea, 2,5-3 m)</strong>
                <span className="text-slate-600 text-sm">80×120 cm sau 90×120 cm</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <strong className="block text-slate-900 mb-1">Dormitor (deasupra patului)</strong>
                <span className="text-slate-600 text-sm">60×90 cm sau 70×100 cm</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <strong className="block text-slate-900 mb-1">Hol / coridor îngust</strong>
                <span className="text-slate-600 text-sm">40×60 cm sau 50×70 cm</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <strong className="block text-slate-900 mb-1">Birou / spațiu de lucru</strong>
                <span className="text-slate-600 text-sm">30×40 cm sau 40×60 cm</span>
              </div>
            </div>
            <p className="text-center">
              <Link href="/blog/ce-dimensiune-canvas-aleg-pentru-fiecare-camera" className="text-indigo-600 font-bold hover:underline">Ghid complet de dimensiuni, cu exemple și reguli de calcul →</Link>
            </p>
          </div>

          {/* Tabel dimensiuni disponibile */}
          <div className="mt-16 border-t border-slate-200 pt-16">
            <h3 className="text-3xl font-black text-slate-900 mb-4 text-center uppercase">Dimensiuni Disponibile</h3>
            <p className="text-slate-600 text-center max-w-2xl mx-auto mb-10">
              <strong>Canvas cu ramă</strong> vine în dimensiuni prestabilite, gata de expus. <strong>Canvas fără ramă (clasic pe șasiu)</strong> acceptă orice dimensiune personalizată, introdusă direct în configurator.
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-w-4xl mx-auto">
              {FRAMED_SIZES.map((size) => (
                <div key={size} className="bg-slate-50 border border-slate-200 rounded-xl py-3 text-center font-bold text-slate-700 text-sm">
                  {size.replace("x", "×")} cm
                </div>
              ))}
            </div>
            <p className="text-slate-500 text-sm text-center mt-6">Disponibile și în format pătrat, de la 30×30 până la 100×100 cm. Pentru comenzi de la 2 bucăți identice, prețul per bucată scade automat.</p>
          </div>

          {/* Rezolutie foto */}
          <div className="mt-16 border-t border-slate-200 pt-16">
            <h3 className="text-3xl font-black text-slate-900 mb-8 text-center uppercase">Ce Rezoluție Trebuie Să Aibă Poza</h3>
            <div className="max-w-3xl mx-auto space-y-4 text-slate-600 leading-relaxed">
              <p>Nu contează câți "megapixeli" are telefonul tău, ci dimensiunea reală a fișierului pe care îl încarci. Reper practic:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Pentru canvas până la <strong>60×90 cm</strong>: minimum 2000 pixeli pe latura lungă a pozei.</li>
                <li>Pentru formate peste <strong>80×120 cm</strong>: ideal 3000+ pixeli pe latura lungă.</li>
              </ul>
              <p>Cea mai sigură sursă e poza originală, direct din galeria telefonului sau dintr-un email/Google Drive — nu una descărcată dintr-o conversație de WhatsApp sau dintr-un story salvat, unde aplicațiile comprimă automat imaginea. Configuratorul de mai sus verifică automat rezoluția și te avertizează dacă fișierul e prea mic pentru dimensiunea aleasă.</p>
            </div>
            <p className="text-center mt-6">
              <Link href="/blog/cum-pregatesti-o-poza-de-telefon-pentru-print-mare" className="text-indigo-600 font-bold hover:underline">Cum verifici rezoluția pozei în 30 de secunde →</Link>
            </p>
          </div>

          {/* Canvas vs plexiglas */}
          <div className="mt-16 border-t border-slate-200 pt-16">
            <h3 className="text-3xl font-black text-slate-900 mb-8 text-center uppercase">Canvas sau Plexiglas? Ce Aleg</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-lg text-slate-900 mb-2">Canvas pe șasiu</h4>
                <p className="text-slate-600 text-sm leading-relaxed">Aspect mat, texturat, asemănător unei picturi clasice. Ușor, gata de agățat direct, fără reflexii de sticlă — potrivit pentru living, dormitor, cadouri de familie.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-lg text-slate-900 mb-2">Plexiglas</h4>
                <p className="text-slate-600 text-sm leading-relaxed">Transparență și luciu asemănător sticlei, cu efect de adâncime — culorile par să „plutească” în placă. Mai rigid și mai formal ca aspect, potrivit pentru birouri sau piese decorative moderne.</p>
              </div>
            </div>
            <p className="text-center mt-6">
              <Link href="/materiale/plexiglass" className="text-indigo-600 font-bold hover:underline">Vezi și opțiunea poză pe plexiglas →</Link>
            </p>
          </div>

          {/* Cadou + canvas cu rama vs clasic */}
          <div className="mt-16 border-t border-slate-200 pt-16 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-indigo-500 pb-2 inline-block mb-4">Cadoul potrivit pentru orice ocazie</h3>
              <p className="text-slate-600 leading-relaxed mb-4">De la nunți și aniversări, până la cadouri pentru părinți sau colegi, un tablou canvas rămâne pe perete ani de zile — spre deosebire de multe cadouri de ocazie. Contează mai ales poza aleasă și dimensiunea potrivită locului unde va atârna.</p>
              <Link href="/blog/tablou-canvas-cadou-personalizat-ocazii" className="text-indigo-600 font-bold hover:underline">Ghid pe ocazii: nuntă, părinți, colegi →</Link>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-indigo-500 pb-2 inline-block mb-4">Cu ramă sau clasic pe șasiu?</h3>
              <p className="text-slate-600 leading-relaxed mb-4">Canvas-ul clasic pe șasiu se potrivește oricărei dimensiuni și are un aspect modern, fără chenar vizibil. Varianta cu ramă vine la dimensiuni fixe, cu discount automat de la 2 bucăți în sus — utilă pentru comenzi corporate sau cadouri multiple identice.</p>
              <Link href="/blog/canvas-cu-rama-vs-canvas-clasic-pe-sasiu" className="text-indigo-600 font-bold hover:underline">Diferența explicată pe larg →</Link>
            </div>
          </div>

          {/* Citeste si - linkuri interne blog */}
          <div className="mt-16 border-t border-slate-200 pt-16">
            <h3 className="text-3xl font-black text-slate-900 mb-8 text-center uppercase">Citește și</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/blog/tablou-canvas-alb-negru-sau-color" className="block bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                <strong className="block text-slate-900 mb-2">Alb-negru sau color?</strong>
                <span className="text-slate-600 text-sm">Când merită fiecare variantă, în funcție de stilul camerei.</span>
              </Link>
              <Link href="/blog/galerie-de-perete-aranjare-tablouri-canvas" className="block bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                <strong className="block text-slate-900 mb-2">Galerie de perete</strong>
                <span className="text-slate-600 text-sm">Trei șabloane simple pentru a aranja mai multe tablouri împreună.</span>
              </Link>
              <Link href="/blog/cum-alegi-poza-de-familie-pentru-tablou-canvas-mare" className="block bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                <strong className="block text-slate-900 mb-2">Alegerea pozei de familie</strong>
                <span className="text-slate-600 text-sm">Rezoluție, cadraj și lumină, explicate fără termeni tehnici.</span>
              </Link>
            </div>
          </div>

          {/* Livrare nationala */}
          <div className="mt-16 border-t border-slate-200 pt-16 text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Livrare în toată România</h3>
            <p className="text-slate-600 max-w-2xl mx-auto mb-4">Trimitem tablouri canvas prin curier în toate județele țării, indiferent dacă ești într-un oraș mare sau într-o localitate mai mică.</p>
            <Link href="/judet" className="text-indigo-600 font-bold hover:underline">Verifică livrarea pentru județul tău →</Link>
          </div>

          <div className="mt-16 border-t border-slate-200 pt-16">
            <h3 className="text-3xl font-black text-slate-900 mb-8 text-center uppercase">Cele Mai Frecvente Întrebări</h3>
            <div className="space-y-6 max-w-3xl mx-auto">
              {CANVAS_FAQS.map((faq, idx) => (
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
