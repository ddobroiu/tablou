import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Truck, MapPin } from "lucide-react";
import { nearbyLocalities } from "@/lib/seo/localProductFacts";
import type { Judet, Localitate } from "@/lib/localitati";
import { catalogProductUrl, getCatalogCategory } from "@/lib/catalog";
import { familyLocalContent, familyLocalUrl, otherFamilies } from "@/lib/catalog/localSeo";
import type { CatalogFamily } from "@/lib/catalog/families";
import { formatMoneyDisplay } from "@/lib/pricing";
import { siteConfig } from "@/lib/siteConfig";

const whatsappNumber = siteConfig.phone.replace(/\D/g, "").replace(/^0/, "40");

/** Pagina unei familii din catalog într-o localitate: /judet/{judet}/{localitate}/{familie}. */
export default function CatalogLocalityPage({ family, loc, judet }: { family: CatalogFamily; loc: Localitate; judet: Judet }) {
  const place = { locName: loc.name, locSlug: loc.slug, judetName: judet.name, judetSlug: judet.slug };
  const { list, from, paragraphs, faqs } = familyLocalContent(family, place);
  const category = getCatalogCategory(family.category);
  const pageUrl = `${siteConfig.url}${familyLocalUrl(family, place)}`;
  const shown = list.slice(0, 12);

  const siblings = nearbyLocalities(judet.slug, judet.localitati, loc.slug, 12);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Acasă", item: `${siteConfig.url}/` },
        { "@type": "ListItem", position: 2, name: judet.name, item: `${siteConfig.url}/judet/${judet.slug}` },
        { "@type": "ListItem", position: 3, name: loc.name, item: `${siteConfig.url}/judet/${judet.slug}/${loc.slug}` },
        { "@type": "ListItem", position: 4, name: family.name, item: pageUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${family.name} ${loc.name}`,
      itemListElement: shown.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${siteConfig.url}${catalogProductUrl(p)}`,
        name: p.title,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
    },
  ];

  return (
    <main className="bg-slate-50 min-h-screen pt-24 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container mx-auto px-4 max-w-7xl">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500" aria-label="Breadcrumb">
          <Link href="/judet" className="hover:text-slate-900">Județe</Link>
          <span>/</span>
          <Link href={`/judet/${judet.slug}`} className="hover:text-slate-900">{judet.name}</Link>
          <span>/</span>
          <Link href={`/judet/${judet.slug}/${loc.slug}`} className="hover:text-slate-900">{loc.name}</Link>
          <span>/</span>
          <span className="text-slate-900">{family.name}</span>
        </nav>

        <header className="mt-6 grid gap-8 lg:grid-cols-5 items-start">
          <div className="lg:col-span-3">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
              {family.name} în {loc.name}
            </h1>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed">{paragraphs[0]}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-4 py-2 text-emerald-800 font-semibold">
                de la {from}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-4 py-2 text-slate-700 text-sm">
                <Truck size={16} /> Producție 2-4 zile lucrătoare, livrare prin curier în {loc.name}
              </span>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href={`#modele`}
                className="inline-flex justify-center items-center px-6 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-700"
              >
                Vezi modelele și prețurile
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Bună ziua, mă interesează ${family.name.toLowerCase()} cu livrare în ${loc.name}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] text-white font-bold hover:bg-[#1da851]"
              >
                <MessageCircle size={18} /> Întreabă pe WhatsApp
              </a>
            </div>
          </div>
          {list[0] && (
            <div className="lg:col-span-2 relative aspect-square rounded-3xl bg-white border border-slate-200 overflow-hidden">
              <Image src={list[0].images[0]} alt={`${family.name} ${loc.name}`} fill className="object-contain p-6" sizes="(max-width: 1024px) 100vw, 40vw" priority />
            </div>
          )}
        </header>

        <section id="modele" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            {list.length === 1 ? "Produsul" : `Modele disponibile (${list.length})`}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {shown.map((p) => (
              <Link
                key={p.slug}
                href={catalogProductUrl(p)}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-square">
                  <Image src={p.images[0]} alt={p.title} fill className="object-contain p-3" sizes="(max-width: 640px) 50vw, 25vw" loading="lazy" />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 group-hover:underline">{p.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    de la {formatMoneyDisplay(p.priceFrom)}
                    {p.unit !== "buc" ? ` / ${p.unit}` : ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          {list.length > shown.length && category && (
            <p className="mt-4">
              <Link href={`/produse/${category.slug}`} className="text-emerald-700 font-semibold hover:underline">
                Vezi toate cele {list.length} modele în {category.name.toLowerCase()}
              </Link>
            </p>
          )}
        </section>

        <section className="mt-14 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              {family.name} cu livrare în {loc.name}, județul {judet.name}
            </h2>
            <div className="space-y-4 text-slate-700 leading-relaxed">
              {paragraphs.slice(1).map((t, i) => (
                <p key={i}>{t}</p>
              ))}
              {family.note && <p className="font-medium text-slate-900">{family.note}</p>}
            </div>
          </div>
          <aside className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 h-fit">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Prețuri de pornire</h2>
            <ul className="divide-y divide-slate-100 text-sm">
              {shown.slice(0, 8).map((p) => (
                <li key={p.slug} className="py-2 flex justify-between gap-3">
                  <Link href={catalogProductUrl(p)} className="text-slate-700 hover:underline line-clamp-1">{p.title}</Link>
                  <span className="font-semibold text-slate-900 whitespace-nowrap">{formatMoneyDisplay(p.priceFrom)}</span>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        <section className="mt-14 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Întrebări frecvente</h2>
          <div className="divide-y divide-slate-200">
            {faqs.map((f, i) => (
              <details key={f.question} className="group py-4" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900">
                  {f.question}
                  <span className="text-emerald-600 transition group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <p className="mt-2 text-slate-600 leading-relaxed">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {siblings.length > 0 && (
          <section className="mt-14">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <MapPin size={20} /> {family.name} și în alte localități din județul {judet.name}
            </h2>
            <div className="flex flex-wrap gap-2">
              {siblings.map((s) => (
                <Link
                  key={s.slug}
                  href={familyLocalUrl(family, { judetSlug: judet.slug, locSlug: s.slug })}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm text-slate-700 hover:border-slate-500"
                >
                  {family.name} {s.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-14">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Alte produse cu livrare în {loc.name}</h2>
          <div className="flex flex-wrap gap-2">
            {otherFamilies(family).map((f) => (
              <Link
                key={f.slug}
                href={familyLocalUrl(f, place)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm text-slate-700 hover:border-slate-500"
              >
                {f.name}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
