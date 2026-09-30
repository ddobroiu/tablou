import "server-only";
import fs from "node:fs";
import path from "node:path";

/**
 * Date reale pe localitate / județ pentru paginile /judet/...
 *
 * FIȘIER IDENTIC ÎN TOATE CELE 6 REPO-URI.
 *
 * Sursa: _deploy/seo-localitati/ (firms.json din BazaDate, orders.json,
 * localities.json cu diacritice / populație / vecini), împărțită pe județ de
 * scripts/split-seo-localitati.mjs în lib/seo/data/judete/{judet}.json. Fiecare
 * pagină citește doar fișierul județului ei, pe server (fs), cu un cache mic în
 * memorie; nimic nu ajunge în bundle-ul de client.
 *
 * Când fișierul lipsește (sau localitatea lipsește din el), funcțiile întorc
 * undefined și paginile NU afișează nimic în plus: fără text de umplutură.
 * Orice cifră afișată vine de aici, cu sursa și data ei.
 *
 * Formatul unui fișier de județ (scris de script, vezi CountyFile):
 * {
 *   "judet": "alba",
 *   "version": "2026-09-29",                                   // data datelor (lastmod în sitemap)
 *   "sources": { "siruta": "Sursa: INS, SIRUTA 2026", "population": "Sursa: INS, Recensământul 2021",
 *                "osm": { "text": "© OpenStreetMap contributors", "url": "https://www.openstreetmap.org/copyright" },
 *                "firms": "Sursa: BazaDate, date la 2026-09-29", "orders": "..." },
 *   "county": { "name": "Alba", "population": 325941, "municipii": 4, "orase": 7, "comune": 67,
 *               "seat": { "name": "Alba Iulia", "slug": "alba-iulia" },
 *               "firms": { "count": 12345, "topSections": [{ "label": "Comerț" }] },
 *               "orders": { "count": 17, "since": "2026-03-10" } },      // doar de la 5 comenzi în sus
 *   "localities": {
 *     "abrud-sat": { "name": "Abrud-Sat", "type": "localitate-componenta", "typeLabel": "localitate componentă a orașului",
 *                    "siruta": 1179, "postalCode": "515101", "population": 992,
 *                    "uat": { "name": "Orașul Abrud", "seat": "Abrud", "seatSlug": "abrud" },
 *                    "hasCoords": true, "distanceToCountySeatKm": 46,
 *                    "nearest": [{ "slug": "abrud", "name": "Abrud", "km": 0.9 }],
 *                    "firms": { "count": 4 } },
 *     "avramesti": { "name": "Avrămești", "ambiguous": true }   // omonime în județ: doar denumirea
 *   }
 * }
 * Comenzile NU există pe localitate (confidențialitate), doar pe județ, de la 5 în sus.
 * Distanțele sunt în linie dreaptă, din coordonatele OpenStreetMap.
 */

export type FirmSection = { label: string; count?: number };
export type FirmStats = { count: number; topSections?: FirmSection[] };

export type NearbyRef = { slug: string; judet?: string; name?: string; km?: number };

export type LocalityData = {
    name?: string;
    /** Omonime în județ: slug-ul nu poate fi atribuit sigur; se folosește doar denumirea. */
    ambiguous?: boolean;
    type?: string;
    typeLabel?: string;
    siruta?: number;
    postalCode?: string;
    postalCodeNote?: string;
    population?: number;
    populationNote?: string;
    uat?: { name: string; kind?: string; seat?: string; seatSlug?: string; population?: number; localitiesCount?: number };
    hasCoords?: boolean;
    distanceToCountySeatKm?: number;
    distanceToBucurestiKm?: number;
    nearest?: NearbyRef[];
    firms?: FirmStats;
};

export type CountyData = {
    name?: string;
    auto?: string;
    region?: string;
    population?: number;
    municipii?: number;
    orase?: number;
    comune?: number;
    sirutaLocalities?: number;
    seat?: { name: string; slug?: string; population?: number };
    firms?: FirmStats;
    /** Comenzi livrate în județ; prezent doar când count ≥ 5. */
    orders?: { count: number; since?: string };
};

export type SourceLink = { text: string; url?: string };

export type CountyFile = {
    judet: string;
    version?: string;
    sources?: { siruta?: string; population?: string; osm?: SourceLink; firms?: string; orders?: string };
    county?: CountyData;
    localities?: Record<string, LocalityData>;
};

/** Pragul sub care nu afișăm comenzi pe județ (confidențialitate). */
export const MIN_COUNTY_ORDERS = 5;

/** Data conținutului paginilor de localitate când nu există date (lastmod stabil în sitemap). */
export const LOCALITY_CONTENT_VERSION = "2026-09-29";

const DATA_DIR = path.join(process.cwd(), "lib", "seo", "data", "judete");
const SLUG_RE = /^[a-z0-9-]{1,64}$/;
const MAX_CACHED = 8;
const _cache = new Map<string, CountyFile | null>();

/** Fișierul județului sau undefined. Cache LRU mic: paginile unui județ vin de obicei în rafale. */
export function getCountyFile(judetSlug: string): CountyFile | undefined {
    const slug = String(judetSlug || "").toLowerCase();
    if (!SLUG_RE.test(slug)) return undefined;
    if (_cache.has(slug)) {
        const hit = _cache.get(slug) ?? null;
        _cache.delete(slug);
        _cache.set(slug, hit);
        return hit ?? undefined;
    }
    let data: CountyFile | null = null;
    try {
        const raw = fs.readFileSync(path.join(DATA_DIR, `${slug}.json`), "utf8");
        const parsed = JSON.parse(raw) as CountyFile;
        if (parsed && typeof parsed === "object") data = parsed;
    } catch {
        data = null;
    }
    _cache.set(slug, data);
    while (_cache.size > MAX_CACHED) {
        const oldest = _cache.keys().next().value;
        if (oldest === undefined) break;
        _cache.delete(oldest);
    }
    return data ?? undefined;
}

export function getLocalityData(judetSlug: string, locSlug: string): LocalityData | undefined {
    const file = getCountyFile(judetSlug);
    const d = file?.localities?.[String(locSlug || "").toLowerCase()];
    return d && typeof d === "object" ? d : undefined;
}

export function getCountyData(judetSlug: string): CountyData | undefined {
    const c = getCountyFile(judetSlug)?.county;
    if (!c) return undefined;
    const orders = c.orders && c.orders.count >= MIN_COUNTY_ORDERS ? c.orders : undefined;
    return { ...c, orders };
}

/** Sursele și data fișierului județului, pentru nota discretă de sub blocuri. */
export function getCountySources(judetSlug: string): CountyFile["sources"] | undefined {
    return getCountyFile(judetSlug)?.sources;
}

/** Data datelor județului (YYYY-MM-DD) sau versiunea fixă a conținutului. */
export function countyLastmod(judetSlug: string): string {
    const v = getCountyFile(judetSlug)?.version;
    return v && /^\d{4}-\d{2}-\d{2}$/.test(v) && v > LOCALITY_CONTENT_VERSION ? v : LOCALITY_CONTENT_VERSION;
}

/**
 * Localitatea cu denumirea cu diacritice, când datele o au ("Vălișoara", nu
 * "Valisoara"). Slug-ul rămâne neschimbat.
 */
export function withDisplayName<T extends { name: string; slug: string }>(judetSlug: string, loc: T | undefined): T | undefined {
    if (!loc) return loc;
    const name = getLocalityData(judetSlug, loc.slug)?.name;
    return name && name.trim() ? { ...loc, name: name.trim() } : loc;
}

export type NearbyLink = { slug: string; judetSlug: string; name: string; km?: number };

/**
 * Localități apropiate: întâi cele mai apropiate din date (cu distanța în linie
 * dreaptă, OSM), apoi localitățile din aceeași comună/oraș, apoi vecinii
 * alfabetici din județ.
 * `all` = lista localităților județului (JUDETE_FULL_DATA), `resolveName`
 * dă numele pentru vecinii din alt județ.
 */
export function nearbyLocalities(
    judetSlug: string,
    all: Array<{ slug: string; name: string }>,
    currentSlug: string,
    max = 12,
    resolveName?: (judetSlug: string, locSlug: string) => string | undefined,
): NearbyLink[] {
    const out: NearbyLink[] = [];
    const seen = new Set<string>([`${judetSlug}/${currentSlug}`]);
    const bySlug = new Map(all.map((l) => [l.slug, l]));
    const push = (j: string, slug: string, name: string | undefined, km?: number) => {
        const k = `${j}/${slug}`;
        if (!name || seen.has(k) || out.length >= max) return;
        seen.add(k);
        const display = getLocalityData(j, slug)?.name?.trim() || name;
        out.push({ slug, judetSlug: j, name: display, km });
    };

    const data = getLocalityData(judetSlug, currentSlug);
    for (const n of data?.nearest ?? []) {
        if (!n || !n.slug) continue;
        const j = n.judet || judetSlug;
        const name = j === judetSlug ? bySlug.get(n.slug)?.name ?? n.name : resolveName?.(j, n.slug) ?? n.name;
        push(j, n.slug, name, typeof n.km === "number" ? n.km : undefined);
    }

    // Aceeași unitate administrativă (comună / oraș): reședința ei, apoi celelalte localități.
    if (data?.uat?.name) {
        if (data.uat.seatSlug) push(judetSlug, data.uat.seatSlug, bySlug.get(data.uat.seatSlug)?.name);
        const file = getCountyFile(judetSlug);
        for (const [slug, d] of Object.entries(file?.localities ?? {})) {
            if (d?.uat?.name === data.uat.name) push(judetSlug, slug, bySlug.get(slug)?.name);
        }
    }

    const i = all.findIndex((l) => l.slug === currentSlug);
    for (let d = 1; out.length < max && d < all.length; d++) {
        if (i >= 0) {
            const a = all[i + d];
            const b = all[i - d];
            if (a) push(judetSlug, a.slug, a.name);
            if (b) push(judetSlug, b.slug, b.name);
        } else {
            const a = all[d - 1];
            if (a) push(judetSlug, a.slug, a.name);
        }
    }
    return out;
}
