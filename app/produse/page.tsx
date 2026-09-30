import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs";
import { CATALOG_CATEGORIES, getCatalogProductsByCategory } from "@/lib/catalog";
import { formatMoneyDisplay } from "@/lib/pricing";
import { siteConfig } from "@/lib/siteConfig";

export const revalidate = 604800;

export const metadata: Metadata = {
  title: "Catalog produse – sisteme de afișaj, steaguri, papetărie, promoționale",
  description:
    "Sisteme de afișaj, steaguri și drapele, rame și suporturi, papetărie, promoționale, decor și panouri de șantier, cu prețuri afișate și comandă online.",
  alternates: { canonical: `${siteConfig.url}/produse` },
};

export default function CatalogIndexPage() {
  const cats = CATALOG_CATEGORIES.map((c) => {
    const list = getCatalogProductsByCategory(c.slug);
    return {
      ...c,
      count: list.length,
      image: list[0]?.images[0],
      from: list.length ? Math.min(...list.map((p) => p.priceFrom)) : 0,
    };
  }).filter((c) => c.count > 0);

  return (
    <main className="bg-slate-50 min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <Breadcrumbs items={[{ label: "Produse", href: "/produse" }]} />
        <header className="mt-6 mb-8 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Catalog produse</h1>
          <p className="mt-3 text-slate-600 leading-relaxed">
            Pe lângă configuratoarele de bannere, panouri și print, găsești aici produse cu variante și prețuri fixe: sisteme de afișaj pentru târguri, steaguri, rame, papetărie, promoționale și decor.
          </p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cats.map((c) => (
            <Link
              key={c.slug}
              href={`/produse/${c.slug}`}
              className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {c.image && (
                <div className="relative aspect-[4/3] bg-white">
                  <Image src={c.image} alt={c.name} fill className="object-contain p-4" sizes="(max-width: 640px) 100vw, 33vw" />
                </div>
              )}
              <div className="p-5">
                <h2 className="text-lg font-bold text-slate-900 group-hover:underline">{c.name}</h2>
                <p className="text-sm text-slate-600 mt-2 line-clamp-3">{c.intro}</p>
                <p className="text-sm text-slate-500 mt-3">
                  {c.count} produse · de la {formatMoneyDisplay(c.from)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
