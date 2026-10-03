import { priorityCountyPaths } from "./priorityLocalities";
import { JUDETE_FULL_DATA } from "@/lib/localitati";
import { siteConfig } from "@/lib/siteConfig";
import { isHomeSite } from "@/lib/seo/siteSpecialization";
import { standardSizesFor } from "@/lib/seo/standardSizes";
import { DIMENSION_PRODUCT_IDS, getSize, dimensionUrl } from "@/lib/seo/dimensionPages";
import { countyLastmod } from "@/lib/seo/localityData";

/**
 * Sitemap-uri pe județ + sitemap-ul dimensiunilor standard.
 *
 * FIȘIER IDENTIC ÎN TOATE CELE 6 REPO-URI.
 *
 *   /server-sitemap/judet-{judet}[-{n}]   pagina județului, localitățile prioritare
 *                                         și paginile localitate × produs pentru
 *                                         produsele al căror site ACASĂ e acesta
 *                                         (vezi siteSpecialization.ts); ≤ 45.000 URL-uri
 *                                         pe fișier, partea n pornește de la 1.
 *   /server-sitemap/dimensiuni-standard  /dimensiuni, /dimensiuni/{produs} și
 *                                         mărimile standard, doar pentru produsele acasă.
 *
 * Intră doar pagini indexabile, cu canonical pe ele însele și răspuns 200: fără
 * aliasurile /configurator/..., fără paginile canonicalizate pe alt site, fără
 * mărimile ne-standard (noindex).
 *
 * ID-urile vechi (/server-sitemap/{n}-{m}, dimensions-{n}, judet-dimensiuni)
 * răspund 410 Gone: erau anunțate doar din indexul /sitemap.xml, care nu le mai
 * listează, iar un redirect de la un sitemap copil la index ar fi un index în
 * index, pe care Google nu îl acceptă.
 */

const MAX_URLS_PER_SITEMAP = 45000;
/** Data conținutului paginilor de dimensiune standard (lastmod stabil). */
export const SIZE_CONTENT_VERSION = "2026-09-29";

function baseUrl(): string {
    return String(siteConfig.url || "").replace(/\/+$/, "").toLowerCase();
}

type Opts = {
    /**
     * Slug-uri suplimentare /judet/{j}/{l}/{slug} care sunt indexabile și cu
     * canonical pe ele însele pe acest site (de ex. familiile din catalogul /produse).
     */
    extraLocalProductSlugs?: string[];
};

function partsFor(county: string, opts?: Opts): number {
    return Math.max(1, Math.ceil(priorityCountyPaths(county, baseUrl(), opts?.extraLocalProductSlugs).length / (MAX_URLS_PER_SITEMAP - 1)));
}

/** ID-urile copil pe care le anunță indexul /sitemap.xml pentru județe. */
export function countySitemapIds(opts?: Opts): string[] {
    const ids: string[] = [];
    for (const j of JUDETE_FULL_DATA) {
        const parts = partsFor(j.slug, opts);
        ids.push(`judet-${j.slug}`);
        for (let p = 2; p <= parts; p++) ids.push(`judet-${j.slug}-${p}`);
    }
    return ids;
}

export const STANDARD_SIZES_SITEMAP_ID = "dimensiuni-standard";

function node(loc: string, lastmod: string, changefreq: string, priority: string): string {
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
}

function urlset(body: string): Response {
    return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}</urlset>`, {
        headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate",
        },
    });
}

function gone(): Response {
    return new Response("Gone", { status: 410, headers: { "Content-Type": "text/plain", "Cache-Control": "public, max-age=86400" } });
}

function parseCountyId(id: string): { slug: string; part: number } | undefined {
    const m = /^judet-([a-z0-9-]+?)(?:-(\d+))?$/.exec(id);
    if (!m) return undefined;
    // "satu-mare" nu are sufix numeric; "judet-alba-2" = partea 2
    const direct = JUDETE_FULL_DATA.find((j) => j.slug === `${m[1]}${m[2] ? `-${m[2]}` : ""}`);
    if (direct) return { slug: direct.slug, part: 1 };
    const j = JUDETE_FULL_DATA.find((x) => x.slug === m[1]);
    if (!j) return undefined;
    return { slug: j.slug, part: m[2] ? parseInt(m[2], 10) : 1 };
}

function countySitemap(slug: string, part: number, opts?: Opts): Response | null {
    const j = JUDETE_FULL_DATA.find((x) => x.slug === slug);
    if (!j) return null;
    const parts = partsFor(j.slug, opts);
    if (part < 1 || part > parts) return null;
    const base = baseUrl();
    const paths = priorityCountyPaths(j.slug, base, opts?.extraLocalProductSlugs);
    const perPart = MAX_URLS_PER_SITEMAP - 1;
    const slice = paths.slice((part - 1) * perPart, part * perPart);
    const lastmod = countyLastmod(j.slug);
    let body = "";
    if (part === 1) body += node(`${base}/judet/${j.slug}`, lastmod, "monthly", "0.6");
    for (const path of slice) body += node(`${base}${path}`, lastmod, "monthly", "0.5");
    return urlset(body);
}

function standardSizesSitemap(): Response {
    const base = baseUrl();
    let body = node(`${base}/dimensiuni`, SIZE_CONTENT_VERSION, "monthly", "0.7");
    for (const pid of DIMENSION_PRODUCT_IDS) {
        if (!isHomeSite(pid, base)) continue;
        body += node(`${base}/dimensiuni/${pid}`, SIZE_CONTENT_VERSION, "monthly", "0.6");
        for (const s of standardSizesFor(pid)) {
            if (!getSize(pid, s.w, s.h)) continue;
            body += node(`${base}${dimensionUrl(pid, s.w, s.h)}`, SIZE_CONTENT_VERSION, "monthly", "0.6");
        }
    }
    return urlset(body);
}

/**
 * Tratează ID-urile noi și pe cele retrase; întoarce null pentru orice alt ID
 * (main, comparatii, preturi, ... rămân la ruta existentă).
 */
export function handleSeoSitemap(id: string | undefined, opts?: Opts): Response | null {
    const s = String(id || "");
    if (s === STANDARD_SIZES_SITEMAP_ID) return standardSizesSitemap();
    if (/^\d+-\d+$/.test(s) || /^dimensions-\d+$/.test(s) || s === "judet-dimensiuni") return gone();
    const c = parseCountyId(s);
    if (c) return countySitemap(c.slug, c.part, opts) ?? new Response("Not found", { status: 404 });
    if (s.startsWith("judet-")) return new Response("Not found", { status: 404 });
    return null;
}

/** Numărul de URL-uri din sitemap-urile de județ și de dimensiuni (pentru verificări). */
export function seoSitemapCounts(opts?: Opts): { counties: number; localities: number; localProducts: number; standardSizes: number } {
    const base = baseUrl();
    let localities = 0;
    let localProducts = 0;
    for (const j of JUDETE_FULL_DATA) {
        for (const path of priorityCountyPaths(j.slug, base, opts?.extraLocalProductSlugs)) {
            if (path.split("/").filter(Boolean).length === 3) localities++;
            else localProducts++;
        }
    }
    let standardSizes = 0;
    for (const pid of DIMENSION_PRODUCT_IDS) {
        if (!isHomeSite(pid, base)) continue;
        standardSizes += 1 + standardSizesFor(pid).filter((s) => getSize(pid, s.w, s.h)).length;
    }
    return { counties: JUDETE_FULL_DATA.length, localities, localProducts, standardSizes: standardSizes + 1 };
}
