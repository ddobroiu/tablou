import trafficPaths from "./searchTrafficPaths.json";
import { JUDET_LOCALITY_SLUGS } from "./mainTowns";
import { JUDETE_FULL_DATA } from "@/lib/localitati";
import { PRODUCT_HOME, siteKeyFromOrigin, resolveLocalProductKey } from "./siteSpecialization";
import { getProductBySlug } from "@/lib/products";
import { getCatalogFamily } from "@/lib/catalog/families";
import { MATERIALE_DATA } from "./materialeData";
import { INTENT_LABELS } from "./intents";
import { STILURI_DATA } from "./stiluriData";
import { REGLEMENTARI_DATA } from "./reglementariData";

/** Sitemap editorial: orase principale + URL-uri cu afisari reale in Search Console.
 * Paginile omise raman accesibile si indexabile; nu retragem pagini cu trafic.
 * Nu schimba canonicalul intre domenii. */
export const PRIORITY_CONTENT_VERSION = "2026-10-03";
const cache = new Map<string, string[]>();

export function validLocalProduct(tail: string[]): boolean {
  if (!tail.length || resolveLocalProductKey(tail)) return true;
  if (tail.length === 1 && getCatalogFamily(tail[0])) return true;
  if (getProductBySlug(tail.join("/"))) return true;
  if (tail.length !== 2 || !getProductBySlug(tail[0])) return false;
  const target = tail[1].replace(/^pentru-/, "");
  return Boolean(INTENT_LABELS[target] || MATERIALE_DATA.some((m) => m.slug === target || m.id === target)
    || STILURI_DATA.some((s) => s.slug === target) || REGLEMENTARI_DATA.some((r) => r.slug === target));
}

export function priorityCountyPaths(county: string, origin: string, extraProducts: string[] = []): string[] {
  const cacheKey = `${origin}|${county}|${extraProducts.join(",")}`;
  const saved = cache.get(cacheKey);
  if (saved) return saved;
  const judet = JUDETE_FULL_DATA.find((j) => j.slug === county);
  if (!judet) return [];
  const valid = new Set(judet.localitati.map((l) => l.slug));
  const site = siteKeyFromOrigin(origin);
  const products = [...Object.entries(PRODUCT_HOME).filter(([, home]) => home === site).map(([key]) => key), ...extraProducts];
  const paths = new Set<string>();
  for (const slug of JUDET_LOCALITY_SLUGS[county] ?? []) {
    if (!valid.has(slug)) continue;
    paths.add(`/judet/${county}/${slug}`);
    for (const product of products) paths.add(`/judet/${county}/${slug}/${product}`);
  }
  for (const path of trafficPaths) {
    const parts = path.split("/").filter(Boolean);
    if (parts[0] !== "judet" || parts[1] !== county || !valid.has(parts[2])) continue;
    const tail = parts.slice(3);
    if (tail.length > 1 && ["ieftin", "pret", "preturi", "personalizat", "personalizate"].includes(tail[tail.length - 1])) tail.pop();
    const key = resolveLocalProductKey(tail);
    if (!validLocalProduct(tail)) continue; // URL-uri vechi cu trafic, dar produse retrase / 404.
    paths.add(key ? `/judet/${county}/${parts[2]}/${key}` : `/${parts.slice(0, 3).concat(tail).join("/")}`);
  }
  const result = [...paths];
  cache.set(cacheKey, result);
  return result;
}
