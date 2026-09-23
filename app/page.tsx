import Script from 'next/script';
import Link from 'next/link';
import { Metadata } from 'next';
import Image from 'next/image';
import { ArrowRight, Upload, Ruler, Sun, Sofa, MapPin, CheckCircle2, Phone, Gift, Heart, Truck } from "lucide-react";
import { siteConfig } from '@/lib/siteConfig';
import { CONFIGURATORS_REGISTRY } from '@/lib/configurators-registry';
import PromoSection from '@/components/PromoSection';

export const metadata: Metadata = {
  authors: [{ name: 'Echipa Tablou.net', url: 'https://www.tablou.net' }],
  title: 'Tablouri Canvas din Poza Ta, Gata de Agățat | Tablou.net',
  description: 'Tablou.net transformă fotografiile tale în tablouri canvas: un singur tablou, colaj, set de 3 sau canvas pe șasiu, pentru nuntă, botez, aniversări și cadouri pentru părinți. Șasiu de lemn inclus, margine oglindită, verificăm rezoluția pozei gratuit. Printăm în același atelier și fototapet, afișe, bannere, textile, panouri rigide și kituri fonduri UE. Livrare în toată România.',
  keywords: ['tablou canvas', 'tablou din poza', 'tablouri canvas personalizate', 'canvas nunta', 'canvas botez', 'colaj foto canvas', 'set 3 tablouri', 'cadou personalizat foto', 'tablou.net'],
  other: {
    "article:published_time": "2024-01-01T08:00:00+02:00",
    "article:modified_time": "2026-09-11T09:00:00+02:00"
  },
  alternates: {
    canonical: 'https://www.tablou.net',
  },
  openGraph: {
    title: 'Tablou.net — Poza ta, pe pânză, pe perete',
    description: 'Tablouri canvas din fotografiile tale: un tablou, colaj sau set de 3. Șasiu de lemn inclus, verificare rezoluție gratuită, livrare în toată România.',
    url: 'https://www.tablou.net',
    siteName: 'Tablou.net',
    locale: 'ro_RO',
    type: 'website',
    images: [
      {
        url: '/products/canvas/canvas-1.webp',
        width: 1200,
        height: 630,
        alt: 'Tablou canvas personalizat dintr-o fotografie, montat pe perete',
      }
    ],
  },
};

const ACCENT = '#B8385A';

const FAQ = [
  {
    q: "Ce rezoluție trebuie să aibă poza ca să iasă bine pe canvas?",
    a: "Pentru un tablou de 40×60 cm ajunge o poză de minimum 2000×3000 pixeli, adică orice fotografie făcută cu un telefon din ultimii ani. Regula noastră e 100-150 dpi la dimensiunea finală. După ce încarci poza, configuratorul îți spune pe loc dacă e prea mică pentru formatul ales și îți propune unul potrivit; un coleg mai verifică o dată fișierul înainte de print."
  },
  {
    q: "În cât timp primesc tabloul acasă?",
    a: "Printul, întinsul pe șasiu și uscarea durează 2-4 zile lucrătoare, iar curierul mai adaugă de regulă o zi. Dacă tabloul e cadou cu dată fixă, scrie-ne data la comentariile comenzii și îți confirmăm dacă putem intra la termen."
  },
  {
    q: "Cum se agață tabloul? Am nevoie de ramă sau de scule?",
    a: "Nu. Pânza vine gata întinsă pe șasiu de lemn, cu marginile oglindite, iar pe spate are un sistem de agățat montat de noi. Îți trebuie un cui sau un șurub în perete. Rama de lemn (neagră, albă sau natur) e opțională și se alege din configurator."
  },
  {
    q: "Pot returna un tablou personalizat dacă nu-mi place?",
    a: "Un tablou printat cu poza ta nu se poate revinde, așa că legea nu prevede retur de 14 zile pentru produse personalizate. Dacă însă tabloul ajunge deteriorat sau printul are un defect din vina noastră, îl refacem gratuit. Poza cu problema ne ajunge pe e-mail, iar noul tablou pleacă în câteva zile."
  },
  {
    q: "Puteți ambala tabloul ca pentru cadou și livra direct la persoana respectivă?",
    a: "Da. Tabloul se pune la comandă în adresa destinatarului, iar factura se trimite pe e-mail-ul tău, nu în colet. Ambalăm cu colțare de protecție și folie, iar la cerere adăugăm o felicitare cu mesajul tău scris în câmpul de observații."
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": FAQ.map((f) => ({
    "@type": "Question",
    "name": f.q,
    "acceptedAnswer": { "@type": "Answer", "text": f.a }
  }))
};

const FORMATS = [
  { name: "Pătrat", size: "30×30 · 50×50 cm", where: "Deasupra noptierei, pe hol, în grupuri de 2-4 pe același perete.", href: "/configurator/canvas-50x50", ratio: "aspect-square" },
  { name: "Landscape", size: "60×40 · 80×60 · 100×70 cm", where: "Deasupra canapelei sau a patului: lățimea tabloului la 2/3 din lățimea mobilei.", href: "/configurator/canvas-80x60", ratio: "aspect-[4/3]" },
  { name: "Portret", size: "40×60 · 60×80 cm", where: "Portrete de familie, poze de la nuntă, pereți înguști lângă ușă sau fereastră.", href: "/configurator/canvas-40x60", ratio: "aspect-[3/4]" },
  { name: "Panoramic", size: "120×40 · 150×50 cm", where: "Peisaje de vacanță, fotografii de grup, peretele lung din living sau birou.", href: "/configurator/canvas-120x40", ratio: "aspect-[3/1]" },
  { name: "Set de 3", size: "3 × 40×60 cm", where: "O poză tăiată în trei sau trei poze din aceeași zi, cu 3-5 cm între panouri.", href: "/configurator/canvas", ratio: "aspect-[4/3]" },
];

const OCCASIONS = [
  { label: "Nuntă", desc: "Poza de la altar sau de la primul dans, pe pânză, pentru dormitor.", href: "/configurator/canvas-nunta", icon: Heart },
  { label: "Botez", desc: "Prima poză a bebelușului, în format pătrat, pentru camera lui.", href: "/configurator/canvas-botez", icon: Gift },
  { label: "Aniversare", desc: "Un colaj cu momentele anului, cadou pentru soț, soție sau prieten.", href: "/configurator/canvas-cadou-aniversare", icon: Gift },
  { label: "Cadou pentru părinți", desc: "Toți nepoții pe un singur canvas mare, pentru livingul bunicilor.", href: "/configurator/canvas-familie", icon: Heart },
  { label: "Colaj de familie", desc: "6-12 poze aranjate automat într-un singur tablou.", href: "/configurator/canvas-colaj-foto", icon: Gift },
  { label: "Birou și living", desc: "Peisaje, arhitectură sau modele gata făcute din galeria noastră.", href: "/shop/canvas", icon: Sofa },
];

const WALL_TIPS = [
  { icon: Ruler, title: "Centrul tabloului la 145-150 cm", desc: "Adică la înălțimea ochilor unui adult care stă în picioare. Pe holuri și în dormitor se coboară cu 5-10 cm, pentru că te uiți la el așezat sau din pat." },
  { icon: Sofa, title: "15-25 cm deasupra canapelei", desc: "Dacă îl pui mai sus, tabloul „plutește” și nu mai pare legat de mobilă. Lățimea ideală e între jumătate și două treimi din lățimea canapelei sau a patului." },
  { icon: Sun, title: "Ferește-l de soarele direct", desc: "Cernelurile latex pe care le folosim rezistă ani buni la lumină, dar niciun print nu iubește soarele de la amiază pe geam. Pereții laterali față de fereastră sunt cei mai buni." },
];

const QUALITY = [
  { title: "Pânză 360 g/mp", desc: "Pânză textilă poliester cu textură fină, print latex fără miros, culori stabile în interior." },
  { title: "Șasiu de lemn uscat", desc: "Șipci de lemn uscat, îmbinate la colț și cu pene de tensionare, ca pânza să nu se destindă în timp." },
  { title: "Margine oglindită", desc: "Continuăm imaginea pe laterale, ca să nu pierzi nimic din poză și să nu ai margini albe." },
  { title: "Rezoluție verificată", desc: "Fiecare poză e deschisă de un om înainte de print. Dacă e prea mică, îți spunem înainte, nu după." },
];

function startPrice(p: (typeof CONFIGURATORS_REGISTRY)[number]): string | null {
  const band = p.pricing?.bands?.[0]?.price;
  const base = p.pricing?.basePricePerSqm;
  const price = band ?? base;
  if (!price) return null;
  const unit = p.pricing?.type === 'per_sqm' ? 'lei/mp' : 'lei/buc';
  return `de la ${price} ${unit}`;
}

const GROUP_LABEL: Record<string, string> = {
  decor: 'Decor și cadouri',
  textile: 'Textile personalizate',
  outdoor: 'Publicitate exterior',
  indoor: 'Publicitate interior',
  vinyl: 'Autocolante și folii',
  events: 'Evenimente',
  print: 'Tipar hârtie',
  publicitar: 'Tipar hârtie',
  rigid: 'Panouri rigide',
  institutional: 'Fonduri UE',
};

export default function Home() {
  const canvas = CONFIGURATORS_REGISTRY.find((c) => c.slug === 'canvas');
  const canvasHref = canvas?.url || '/configurator/canvas';
  const products = [
    ...CONFIGURATORS_REGISTRY.filter((c) => c.category === 'decor'),
    ...CONFIGURATORS_REGISTRY.filter((c) => c.category === 'textile'),
    ...CONFIGURATORS_REGISTRY.filter((c) => c.category !== 'decor' && c.category !== 'textile'),
  ];
  const phoneHref = `tel:${siteConfig.phone.replace(/\s+/g, '').replace(/^0/, '+40')}`;

  return (
    <div className="flex flex-col min-h-screen bg-[#FBF7F2] text-stone-800 selection:bg-[#B8385A] selection:text-white">
      <Script
        id="home-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* HERO: photo first */}
      <section className="pt-16 pb-12 md:pt-24 md:pb-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                <div className="col-span-2 relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-200 shadow-[0_30px_60px_-30px_rgba(41,37,36,0.45)]">
                  <Image
                    src="/products/canvas/canvas-1.webp"
                    alt="Tablou canvas mare, printat dintr-o fotografie de familie, montat deasupra canapelei"
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 66vw, 40vw"
                  />
                </div>
                <div className="flex flex-col gap-3 md:gap-4">
                  <div className="relative flex-1 rounded-2xl overflow-hidden bg-stone-200">
                    <Image src="/products/canvas/canvas-2.webp" alt="Tablou canvas pătrat cu poză de la botez" fill className="object-cover" sizes="(max-width: 1024px) 33vw, 20vw" />
                  </div>
                  <div className="relative flex-1 rounded-2xl overflow-hidden bg-stone-200">
                    <Image src="/products/canvas/canvas-3.webp" alt="Tablou canvas portret cu poză de la nuntă" fill className="object-cover" sizes="(max-width: 1024px) 33vw, 20vw" />
                  </div>
                </div>
                <div className="col-span-3 relative aspect-[3/1] rounded-2xl overflow-hidden bg-stone-200">
                  <Image src="/products/canvas/canvas-4.webp" alt="Set de trei tablouri canvas panoramice pe peretele din living" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 60vw" />
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur rounded-full px-3 py-1.5 text-xs font-semibold text-stone-800">
                    Set de 3 · aceeași poză, trei panouri
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 order-1 lg:order-2">
              <p className="text-[#B8385A] font-semibold text-sm tracking-wide mb-4">Tablouri canvas din pozele tale</p>
              <h1 className="font-[family-name:var(--font-fraunces)] text-4xl md:text-5xl xl:text-[3.4rem] text-stone-900 leading-[1.08] mb-5">
                O poză din telefon. Un tablou pe perete, peste câteva zile.
              </h1>
              <p className="text-stone-600 text-lg leading-relaxed mb-8">
                Încarci fotografia, alegi formatul și vezi pe loc cum arată pe pânză. Noi o printăm, o întindem pe șasiu de lemn și o trimitem gata de agățat, ție sau direct celui care primește cadoul.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href={canvasHref} className="inline-flex items-center justify-center gap-2 bg-[#B8385A] text-white font-semibold px-7 py-4 rounded-full hover:bg-[#9E2E4C] transition-colors">
                  <Upload size={18} /> Încarcă poza
                </Link>
                <a href={phoneHref} className="inline-flex items-center justify-center gap-2 bg-white text-stone-800 font-semibold px-7 py-4 rounded-full border border-stone-200 hover:border-stone-400 transition-colors">
                  <Phone size={16} /> {siteConfig.phone}
                </a>
              </div>
              <ul className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-stone-600">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} style={{ color: ACCENT }} /> Șasiu de lemn inclus</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} style={{ color: ACCENT }} /> Poza verificată gratuit</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} style={{ color: ACCENT }} /> Gata în 2-4 zile</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SIZE GUIDE */}
      <section id="format" className="bg-white border-y border-stone-100 py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-2xl mb-10">
            <p className="text-[#B8385A] font-semibold uppercase tracking-[0.15em] text-xs mb-3">Alege formatul</p>
            <h2 className="font-[family-name:var(--font-fraunces)] text-3xl md:text-4xl text-stone-900">Formatul se alege după perete, nu după poză.</h2>
            <p className="text-stone-600 mt-3">Poza se decupează în configurator pentru orice format. Mai jos sunt dimensiunile pe care le comandă cel mai des clienții noștri și locul în care stau bine.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
            {FORMATS.map((f) => (
              <Link key={f.name} href={f.href} className="group rounded-2xl border border-stone-200 bg-[#FBF7F2] p-4 hover:border-[#B8385A]/50 hover:shadow-md transition-all flex flex-col">
                <div className="h-24 flex items-center justify-center mb-4">
                  <div className={`${f.ratio} ${f.ratio === 'aspect-[3/1]' ? 'w-full' : f.ratio === 'aspect-[3/4]' ? 'h-full' : 'w-3/4'} bg-white border-2 border-stone-800 shadow-[4px_4px_0_0_#d6d3d1] group-hover:border-[#B8385A] transition-colors`} />
                </div>
                <h3 className="font-bold text-stone-900">{f.name}</h3>
                <p className="text-xs font-semibold text-stone-500 mt-1">{f.size}</p>
                <p className="text-sm text-stone-600 leading-snug mt-3 flex-1">{f.where}</p>
                <span className="inline-flex items-center gap-1 text-[#B8385A] text-sm font-semibold mt-4 group-hover:gap-2 transition-all">Configurează <ArrowRight size={14} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* OCCASIONS */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div className="max-w-2xl">
              <p className="text-[#B8385A] font-semibold uppercase tracking-[0.15em] text-xs mb-3">Ocazii</p>
              <h2 className="font-[family-name:var(--font-fraunces)] text-3xl md:text-4xl text-stone-900">Pentru cine e tabloul?</h2>
            </div>
            <Link href="/configurator/canvas-8-martie" className="text-sm font-semibold text-stone-600 hover:text-[#B8385A] inline-flex items-center gap-1">
              Vezi și canvasul de 8 Martie și de Mărțișor <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {OCCASIONS.map((o) => (
              <Link key={o.label} href={o.href} className="group flex items-start gap-4 rounded-2xl bg-white border border-stone-200 p-5 hover:border-[#B8385A]/50 hover:shadow-md transition-all">
                <div className="w-11 h-11 rounded-full bg-[#B8385A]/10 text-[#B8385A] flex items-center justify-center shrink-0">
                  <o.icon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 group-hover:text-[#B8385A] transition-colors">{o.label}</h3>
                  <p className="text-sm text-stone-600 leading-snug mt-1">{o.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WALL TIPS */}
      <section className="bg-stone-900 text-white py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <p className="text-[#F0A5B8] font-semibold uppercase tracking-[0.15em] text-xs mb-3">Cum arată pe perete</p>
              <h2 className="font-[family-name:var(--font-fraunces)] text-3xl md:text-4xl leading-tight mb-5">Trei reguli pe care le spunem la telefon oricui ne întreabă „unde îl pun?”</h2>
              <p className="text-stone-400 leading-relaxed">Le-am strâns din sutele de poze cu tablouri montate pe care ni le-au trimis clienții. Nu sunt legi, dar când sunt respectate, tabloul arată ca în magazin.</p>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mt-8 border border-white/10">
                <Image src="/products/tapet/tapet-1.webp" alt="Perete de living cu tablou canvas montat deasupra canapelei, la înălțimea corectă" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 40vw" loading="lazy" />
              </div>
            </div>
            <div className="lg:col-span-7">
              <ol className="space-y-5">
                {WALL_TIPS.map((t, i) => (
                  <li key={t.title} className="flex gap-5 rounded-2xl bg-white/5 border border-white/10 p-5 md:p-6">
                    <div className="w-11 h-11 rounded-full bg-[#B8385A] text-white flex items-center justify-center shrink-0 font-bold">{i + 1}</div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight mb-1 flex items-center gap-2"><t.icon size={18} className="text-[#F0A5B8]" /> {t.title}</h3>
                      <p className="text-stone-400 text-sm leading-relaxed">{t.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <Link href="/blog" className="text-[#F0A5B8] font-semibold hover:underline">Mai multe ghiduri pe blog</Link>
                <span className="text-stone-600">·</span>
                <Link href="/configurator/tapet" className="text-[#F0A5B8] font-semibold hover:underline">Vrei tot peretele? Fototapet din poza ta</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PromoSection />

      {/* FULL PRODUCT GRID */}
      <section id="produse" className="bg-white border-y border-stone-100 py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div className="max-w-2xl">
              <p className="text-[#B8385A] font-semibold uppercase tracking-[0.15em] text-xs mb-3">Tot ce printăm</p>
              <h2 className="font-[family-name:var(--font-fraunces)] text-3xl md:text-4xl text-stone-900">Același atelier face și fototapetul, tricourile, afișele și bannerele.</h2>
              <p className="text-stone-600 mt-3">Fiecare produs are configurator cu preț calculat pe loc, din dimensiuni și cantitate. Prețurile de mai jos sunt cele de pornire, cu TVA.</p>
            </div>
            <Link href="/configuratoare" className="inline-flex items-center gap-2 text-[#B8385A] font-semibold text-sm hover:gap-3 transition-all">
              Toate configuratoarele <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {products.map((p, index) => {
              const price = startPrice(p);
              return (
                <Link
                  key={p.id}
                  href={p.url || `/configurator/${p.slug}`}
                  className="group flex items-center gap-4 rounded-2xl border border-stone-200 bg-[#FBF7F2] p-3 hover:border-[#B8385A]/50 hover:bg-white transition-colors"
                >
                  <div className="relative w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-xl overflow-hidden bg-white border border-stone-100">
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-contain p-1.5 transition-transform duration-500 group-hover:scale-105"
                        sizes="96px"
                        loading={index < 3 ? undefined : "lazy"}
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">{GROUP_LABEL[p.category] || p.category}</p>
                    <h3 className="font-bold text-stone-900 leading-tight group-hover:text-[#B8385A] transition-colors truncate">{p.name}</h3>
                    <div className="mt-1.5 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs">
                      {price ? <span className="text-[#B8385A] font-semibold">{price}</span> : <span />}
                      <span className="text-stone-400 whitespace-nowrap shrink-0">{p.turnaroundTime.replace(" lucrătoare", "")}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* QUALITY STRIP */}
      <section className="py-14 md:py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {QUALITY.map((q) => (
              <div key={q.title} className="rounded-2xl bg-white border border-stone-200 p-5">
                <CheckCircle2 size={20} className="text-[#B8385A] mb-3" />
                <h3 className="font-bold text-stone-900 mb-1">{q.title}</h3>
                <p className="text-sm text-stone-600 leading-snug">{q.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCAL DELIVERY */}
      <section className="pb-16 md:pb-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="rounded-3xl bg-white border border-stone-200 p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-3">
                <MapPin size={20} className="text-[#B8385A]" />
                <h2 className="font-[family-name:var(--font-fraunces)] text-2xl md:text-3xl text-stone-900">Livrăm în toată România, ambalat ca pentru cadou</h2>
              </div>
              <p className="text-stone-600 leading-relaxed">
                Tablourile pleacă din atelierul nostru din județul Buzău prin curier, cu colțare de protecție și folie, către orice reședință de județ și toate sectoarele Bucureștiului. Livrare {siteConfig.shipping.standardDelivery.price} lei, gratuită peste 500 lei, în 2-4 zile lucrătoare după ce iese din producție.
              </p>
            </div>
            <div className="lg:col-span-5">
              <ul className="space-y-2 text-sm text-stone-700 mb-5">
                <li className="flex gap-2"><Truck size={16} className="text-[#B8385A] shrink-0 mt-0.5" /> AWB pe e-mail și SMS de la curier în ziua livrării</li>
                <li className="flex gap-2"><Gift size={16} className="text-[#B8385A] shrink-0 mt-0.5" /> Factura pe e-mail, nu în colet, când e cadou</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#B8385A] shrink-0 mt-0.5" /> Plată cu cardul, transfer sau ramburs</li>
              </ul>
              <div className="flex flex-wrap gap-3 text-sm">
                <Link href="/judet" className="text-[#B8385A] font-semibold hover:underline">Pe județe</Link>
                <span className="text-stone-300">·</span>
                <Link href="/sectoare-bucuresti" className="text-[#B8385A] font-semibold hover:underline">Sectoare București</Link>
                <span className="text-stone-300">·</span>
                <Link href="/livrare" className="text-[#B8385A] font-semibold hover:underline">Termene și costuri</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white border-t border-stone-100 py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <p className="text-[#B8385A] font-semibold uppercase tracking-[0.15em] text-xs mb-3">Întrebări frecvente</p>
          <h2 className="font-[family-name:var(--font-fraunces)] text-3xl md:text-4xl text-stone-900 mb-8">Ce ne întreabă clienții înainte să încarce poza</h2>
          <div className="divide-y divide-stone-200 border-y border-stone-200">
            {FAQ.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none text-stone-900 font-semibold">
                  <span>{f.q}</span>
                  <span className="text-[#B8385A] text-xl leading-none group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-stone-600 text-sm leading-relaxed mt-3 pr-8">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-12 md:py-20 max-w-7xl">
        <div className="relative rounded-3xl overflow-hidden bg-[#B8385A] p-8 md:p-16 text-center text-white">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-[family-name:var(--font-fraunces)] text-3xl md:text-5xl leading-tight mb-4">Ai deja poza. Restul durează două minute.</h2>
            <p className="text-white/85 mb-8">Fără cont, fără program de editat. Încarci, alegi formatul, vezi prețul și comanzi.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={canvasHref} className="inline-flex justify-center items-center gap-2 bg-white text-[#B8385A] font-bold px-8 py-4 rounded-full hover:bg-stone-100 transition-colors">
                <Upload size={18} /> Încarcă poza
              </Link>
              <Link href="/shop/canvas" className="inline-flex justify-center items-center gap-2 bg-white/15 text-white font-semibold px-8 py-4 rounded-full border border-white/30 hover:bg-white/25 transition-colors">
                Nu am o poză, vreau un model gata făcut
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
