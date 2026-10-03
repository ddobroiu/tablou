import trafficPaths from "./searchTrafficPaths.json";
import { JUDET_LOCALITY_SLUGS } from "./mainTowns";
import { JUDETE_FULL_DATA } from "@/lib/localitati";
import { PRODUCT_HOME, siteKeyFromOrigin, resolveLocalProductKey } from "./siteSpecialization";

/** Sitemap editorial: orase principale + URL-uri cu afisari reale in Search Console.
 * Paginile omise raman accesibile si indexabile; nu retragem pagini cu trafic.
 * Nu schimba canonicalul intre domenii. */
export const PRIORITY_CONTENT_VERSION = "2026-10-03";

export function priorityCountyPaths(county: string, origin: string, extraProducts: string[] = []): string[] {
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
    paths.add(key ? `/judet/${county}/${parts[2]}/${key}` : `/${parts.slice(0, 3).concat(tail).join("/")}`);
  }
  return [...paths];
}
