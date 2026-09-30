// Doar pentru server (pagini, sitemap, feed): data.json e mare și nu trebuie să ajungă în bundle-ul clientului.
import data from "./data.json";
import { CATALOG_CATEGORIES, catalogProductUrl, type CatalogCategorySlug, type CatalogProduct } from "./types";

export * from "./types";

export const CATALOG_PRODUCTS = data as unknown as CatalogProduct[];

const BY_KEY = new Map(CATALOG_PRODUCTS.map((p) => [`${p.category}/${p.slug}`, p]));

export function getCatalogProduct(category: string, slug: string): CatalogProduct | undefined {
  return BY_KEY.get(`${category}/${slug}`);
}

export function getCatalogProductsByCategory(category: CatalogCategorySlug): CatalogProduct[] {
  return CATALOG_PRODUCTS.filter((p) => p.category === category);
}

export function catalogCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const c of CATALOG_CATEGORIES) counts[c.slug] = 0;
  for (const p of CATALOG_PRODUCTS) counts[p.category] = (counts[p.category] ?? 0) + 1;
  return counts;
}

/** Produse înrudite: aceeași subgrupă întâi, apoi restul categoriei. */
export function relatedCatalogProducts(p: CatalogProduct, limit = 8): CatalogProduct[] {
  const same = CATALOG_PRODUCTS.filter((x) => x.category === p.category && x.slug !== p.slug);
  const first = same.filter((x) => p.group && x.group === p.group);
  const rest = same.filter((x) => !(p.group && x.group === p.group));
  return [...first, ...rest].slice(0, limit);
}

/** Forma generică din lib/products.ts, pentru feed-ul Google Merchant. */
export function catalogAsProducts() {
  return CATALOG_PRODUCTS.map((p) => ({
    id: `cat-${p.slug}`,
    slug: p.slug,
    routeSlug: catalogProductUrl(p).slice(1),
    title: p.title,
    description: `${p.short} ${p.description.split("\n\n")[0]}`,
    images: p.images,
    priceBase: p.priceFrom,
    currency: "RON",
    tags: [p.category],
    metadata: { category: p.category },
  }));
}
