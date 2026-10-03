import { priorityCountyPaths } from "./priorityLocalities";
import { resolveLocalProductKey } from "./siteSpecialization";

/** Acoperirea comerciala ramane nationala. Indexam doar selectia publicata
 * in sitemap: orase principale, produse de specialitate in orasul principal
 * al judetului si URL-uri valide cu vizibilitate istorica in Search Console.
 * Nu depinde de user-agent, nu blocheaza cumpararea si nu schimba canonicalul.
 * Extinderile se fac dupa verificarea continutului util si a rezultatelor GSC. */
const countySets = new Map<string, Set<string>>();
export function isIndexableLocalPage(origin: string, county: string, locality: string, product: string[] = []): boolean {
  const cacheKey = `${origin}|${county}`;
  let paths = countySets.get(cacheKey);
  if (!paths) {
    paths = new Set(priorityCountyPaths(county, origin));
    countySets.set(cacheKey, paths);
  }
  const key = resolveLocalProductKey(product);
  const suffix = key || product.join("/");
  return paths.has(`/judet/${county}/${locality}${suffix ? `/${suffix}` : ""}`);
}
