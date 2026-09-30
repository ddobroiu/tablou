import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import {
  CATALOG_CATEGORIES,
  catalogProductUrl,
  getCatalogCategory,
  getCatalogProductsByCategory,
  type CatalogCategorySlug,
} from "@/lib/catalog";
import { formatMoneyDisplay } from "@/lib/pricing";
import { siteConfig } from "@/lib/siteConfig";
import { SITE_GROUP_INTROS } from "@/lib/catalog/siteIntros";

export const revalidate = 604800;

type Props = { params: Promise<{ categorie: string }> };

export function generateStaticParams() {
  return CATALOG_CATEGORIES.map((c) => ({ categorie: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorie } = await params;
  const cat = getCatalogCategory(categorie);
  if (!cat) return { title: "Categorie negăsită" };
  return {
    title: `${cat.name} – prețuri și comandă online`,
    description: cat.intro.slice(0, 158),
    alternates: { canonical: `${siteConfig.url}/produse/${cat.slug}` },
  };
}

export default async function CatalogCategoryPage({ params }: Props) {
  const { categorie } = await params;
  const cat = getCatalogCategory(categorie);
  if (!cat) notFound();
  const products = getCatalogProductsByCategory(cat.slug as CatalogCategorySlug);

  // Grupăm pe subgrupe când există (ex. drapelele pe continente).
  const groups = new Map<string, typeof products>();
  for (const p of products) {
    const g = p.group ?? "";
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push(p);
  }

  return (
    <main className="bg-slate-50 min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <Breadcrumbs
          items={[
            { label: "Produse", href: "/produse" },
            { label: cat.name, href: `/produse/${cat.slug}` },
          ]}
        />
        <header className="mt-6 mb-8 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">{cat.name}</h1>
          <p className="mt-3 text-slate-600 leading-relaxed">{cat.intro}</p>
          <p className="mt-2 text-sm text-slate-500">{products.length} produse</p>
        </header>

        {groups.size > 1 && (
          <nav className="mb-8 flex flex-wrap gap-2" aria-label="Subcategorii">
            {[...groups.keys()].map((g) => (
              <a key={g} href={`#${encodeURIComponent(g || "altele")}`} className="px-3 py-1.5 rounded-full bg-white border border-slate-300 text-sm text-slate-700 hover:border-slate-500">
                {g || "Altele"} ({groups.get(g)!.length})
              </a>
            ))}
          </nav>
        )}

        {[...groups.entries()].map(([g, list]) => (
          <section key={g} id={encodeURIComponent(g || "altele")} className="mb-10 scroll-mt-24">
            {groups.size > 1 && <h2 className="text-xl font-bold text-slate-900 mb-4">{g || "Altele"}</h2>}
            {g && SITE_GROUP_INTROS[siteConfig.name]?.[g] && (
              <p className="mb-5 max-w-3xl text-slate-700 leading-relaxed">{SITE_GROUP_INTROS[siteConfig.name][g]}</p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {list.map((p) => (
                <Link
                  key={p.slug}
                  href={catalogProductUrl(p)}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-square bg-white">
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
          </section>
        ))}
      </div>
    </main>
  );
}
