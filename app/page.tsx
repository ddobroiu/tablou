import Script from 'next/script';
import Link from 'next/link';
import { Metadata } from 'next';
import Image from 'next/image';
import { ArrowRight, Upload, Ruler, Truck, ShieldCheck, Sparkles, Phone } from "lucide-react";
import { siteConfig } from '@/lib/siteConfig';
import { CONFIGURATORS_REGISTRY } from '@/lib/configurators-registry';

import dynamic from 'next/dynamic';

const FAQSection = dynamic(() => import("@/components/FAQSection"), { ssr: true });

export const metadata: Metadata = {
  authors: [{ name: 'Echipa Tablou.net', url: 'https://www.tablou.net' }],
  title: 'Tablouri Canvas Personalizate din Fotografiile Tale | Tablou.net',
  description: 'Transformă orice fotografie într-un tablou canvas de calitate galerie. Configurator online cu previzualizare reală, șasiu de lemn inclus, margine oglindită automată. Livrare 24-48h.',
  keywords: ['tablou canvas', 'tablouri canvas personalizate', 'print foto canvas', 'tablou din poza mea', 'cadou personalizat foto', 'tablou pe panza'],
  other: {
    "article:published_time": "2026-08-08T08:00:00+02:00",
    "article:modified_time": "2026-08-08T08:00:00+02:00"
  },
  alternates: {
    canonical: 'https://www.tablou.net',
  },
  openGraph: {
    title: 'Tablou.net — Fotografiile tale, transformate în tablouri canvas',
    description: 'Configurator online, previzualizare reală, șasiu de lemn inclus. Livrare 24-48h.',
    url: 'https://www.tablou.net',
    siteName: 'Tablou.net',
    locale: 'ro_RO',
    type: 'website',
    images: [
      {
        url: '/products/canvas/canvas-1.webp',
        width: 1200,
        height: 630,
        alt: 'Tablou.net - Tablouri Canvas Personalizate',
      }
    ],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Ce rezoluție trebuie să aibă poza mea?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Recomandăm minimum 150 DPI la dimensiunea finală a tabloului. Configuratorul te avertizează automat dacă poza încărcată e prea mică pentru dimensiunea aleasă, înainte să plasezi comanda."
      }
    },
    {
      "@type": "Question",
      "name": "Ce înseamnă margine oglindită?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Imaginea se extinde automat pe laterale (2cm), astfel încât tabloul să nu aibă margini albe pe șasiu — efectul e continuu, ca într-o galerie."
      }
    },
    {
      "@type": "Question",
      "name": "În cât timp primesc tabloul?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Producția durează 3-5 zile lucrătoare de la confirmarea comenzii, plus timpul de livrare prin curier (de regulă 24h suplimentar)."
      }
    }
  ]
};

const processSteps = [
  {
    icon: Upload,
    title: "Încarci poza",
    desc: "Orice fotografie de pe telefon sau calculator — configuratorul îți arată în timp real cum va arăta pe pânză.",
  },
  {
    icon: Ruler,
    title: "Alegi dimensiunea",
    desc: "De la un tablou mic de birou până la o piesă centrală de living. Șasiu de lemn inclus, gata de agățat.",
  },
  {
    icon: Truck,
    title: "Livrăm în 3-5 zile",
    desc: "Printat pe pânză textilă 360g, ambalat cu protecție specială, livrare națională prin curier.",
  },
];

export default function Home() {
  const canvasConfig = CONFIGURATORS_REGISTRY.find(c => c.id === 'canvas');
  const otherConfigs = CONFIGURATORS_REGISTRY.filter(c => c.id !== 'canvas');

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF6F0] selection:bg-[#B45309] selection:text-white">
      <Script
        id="home-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* HERO */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <p className="text-[#B45309] font-semibold tracking-wide text-sm">Tablou.net</p>
                <div className="h-4 w-px bg-stone-300"></div>
                <a href={`tel:${siteConfig.phone.replace(/\s+/g, '').replace(/^0/, '+40')}`} className="text-stone-600 font-semibold text-sm hover:text-[#B45309] transition-colors flex items-center gap-1">
                  <Phone size={14} />
                  {siteConfig.phone}
                </a>
              </div>
              <h1 className="font-[family-name:var(--font-fraunces)] text-4xl md:text-5xl lg:text-6xl text-stone-900 leading-[1.08] mb-6">
                Poza aceea pe care o iubești.<br className="hidden md:block" />
                Pe perete, nu doar în telefon.
              </h1>
              <p className="text-stone-600 text-lg md:text-xl max-w-xl leading-relaxed">
                Tablouri canvas printate din fotografiile tale, cu previzualizare reală înainte să comanzi. Șasiu de lemn inclus, gata de agățat.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link href={canvasConfig?.url || "/configurator/canvas"} className="inline-flex items-center justify-center gap-2 bg-stone-900 text-white font-semibold px-7 py-4 rounded-full hover:bg-[#B45309] transition-colors">
                  Creează-ți tabloul
                  <ArrowRight size={18} />
                </Link>
                <Link href="#alte-produse" className="inline-flex items-center justify-center gap-2 bg-transparent text-stone-700 font-semibold px-7 py-4 rounded-full border border-stone-300 hover:border-stone-900 transition-colors">
                  Alte produse personalizate
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-stone-500">
                <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-[#B45309]" /> Verificare fișier gratuită</span>
                <span className="flex items-center gap-2"><Sparkles size={16} className="text-[#B45309]" /> Margine oglindită automată</span>
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_40px_80px_-30px_rgba(28,25,23,0.35)] bg-stone-200">
                <Image
                  src="/products/canvas/canvas-1.webp"
                  alt="Tablou canvas personalizat pe perete"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg px-5 py-4 hidden sm:block border border-stone-100">
                <p className="text-stone-900 font-semibold text-sm">Șasiu lemn inclus</p>
                <p className="text-stone-500 text-xs">gata de agățat din cutie</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-white py-16 md:py-20 border-y border-stone-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {processSteps.map((step, i) => (
              <div key={i} className="flex flex-col items-start">
                <div className="w-12 h-12 rounded-full bg-[#B45309]/10 text-[#B45309] flex items-center justify-center mb-4">
                  <step.icon size={22} strokeWidth={2} />
                </div>
                <p className="text-xs font-semibold text-stone-400 mb-1">Pasul {i + 1}</p>
                <h3 className="font-[family-name:var(--font-fraunces)] text-xl text-stone-900 mb-2">{step.title}</h3>
                <p className="text-stone-500 leading-relaxed text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CANVAS GALLERY STRIP */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-2xl mb-10">
            <p className="text-[#B45309] font-semibold uppercase tracking-[0.15em] text-xs mb-3">Idei de la clienți</p>
            <h2 className="font-[family-name:var(--font-fraunces)] text-3xl md:text-4xl text-stone-900">Fiecare tablou pornește de la o poză reală.</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {['canvas-1', 'canvas-2', 'canvas-3', 'canvas-4'].map((img) => (
              <div key={img} className="relative aspect-square rounded-xl overflow-hidden bg-stone-200 group">
                <Image
                  src={`/products/canvas/${img}.webp`}
                  alt="Exemplu tablou canvas personalizat"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OTHER PRODUCTS */}
      <section id="alte-produse" className="bg-white py-16 md:py-24 border-t border-stone-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-2xl mb-10">
            <p className="text-[#B45309] font-semibold uppercase tracking-[0.15em] text-xs mb-3">Mai mult decât canvas</p>
            <h2 className="font-[family-name:var(--font-fraunces)] text-3xl md:text-4xl text-stone-900">Alte produse personalizate</h2>
            <p className="text-stone-500 mt-3">Aceeași echipă de producție, pentru cadouri și materiale personalizate din aceeași poză sau logo.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {otherConfigs.map((config, index) => (
              <Link
                key={config.id}
                href={config.url || `/configurator/${config.slug}`}
                className="group relative flex flex-col items-center text-center rounded-2xl border border-stone-200 overflow-hidden hover:border-[#B45309]/40 hover:shadow-lg transition-all duration-300 bg-white"
              >
                <div className="w-full aspect-square relative bg-stone-50 border-b border-stone-100 flex items-center justify-center overflow-hidden">
                  {config.image ? (
                    <Image
                      src={config.image}
                      alt={config.name}
                      fill
                      className="object-contain p-6 md:p-8 transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                      loading={index < 8 ? undefined : "lazy"}
                    />
                  ) : (
                    <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-400 text-xs">Imagine indisponibilă</div>
                  )}
                </div>
                <div className="p-4 w-full">
                  <h4 className="font-semibold text-sm text-stone-800 group-hover:text-[#B45309] transition-colors">
                    {config.name}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FAQSection />

      {/* CTA */}
      <section className="container mx-auto px-4 mt-4 mb-16 md:mb-24 max-w-7xl">
        <div className="relative rounded-3xl overflow-hidden bg-stone-900 p-10 md:p-20 text-center">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-[family-name:var(--font-fraunces)] text-3xl md:text-5xl text-white mb-6 leading-tight">
              Ai o poză care merită mai mult decât un ecran?
            </h2>
            <Link href={canvasConfig?.url || "/configurator/canvas"} className="inline-flex items-center justify-center gap-2 bg-[#B45309] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#9A4508] transition-colors text-base">
              Începe cu poza ta
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
