/**
 * Localitățile sunt TOATE pagini reale și indexabile pe Tablou.net.
 *
 * Paginile de localitate sunt cele care aduc traficul organic, așa că nu mai
 * există o listă "curată" care le taie: orice localitate din
 * lib/seo/ro_localitati.json are pagină, e indexabilă și apare în sitemap
 * (vezi app/server-sitemap/[id]/route.ts, paginat pe județ).
 *
 * Funcțiile rămân exportate pentru compatibilitate cu paginile care le
 * importă; `isIndexableLocality` confirmă doar că localitatea există în
 * județul dat.
 */
import { JUDETE_FULL_DATA } from "@/lib/localitati";

let _bySlug: Record<string, string[]> | null = null;

function index(): Record<string, string[]> {
    if (_bySlug) return _bySlug;
    const out: Record<string, string[]> = {};
    for (const judet of JUDETE_FULL_DATA) {
        out[judet.slug.toLowerCase()] = judet.localitati.map((l) => l.slug.toLowerCase());
    }
    _bySlug = out;
    return out;
}

/** True când localitatea există în județul dat (toate sunt indexabile). */
export function isIndexableLocality(judetSlug: string, localitateSlug: string): boolean {
    const list = index()[String(judetSlug || "").toLowerCase()];
    return Array.isArray(list) && list.includes(String(localitateSlug || "").toLowerCase());
}

/**
 * Alte localități din același județ, pentru cross-link intern între pagini
 * reale (exclude localitatea curentă). Rotim lista pornind de la poziția
 * localității curente, ca să nu afișeze toate paginile din județ exact
 * aceleași vecine în aceeași ordine.
 */
export function getSiblingLocalitySlugs(judetSlug: string, currentLocSlug: string, max = 4): string[] {
    const list = index()[String(judetSlug || "").toLowerCase()];
    if (!Array.isArray(list) || list.length <= 1) return [];

    const others = list.filter((s) => s !== currentLocSlug);
    if (others.length <= max) return others;

    const startIndex = list.indexOf(currentLocSlug);
    const offset = startIndex >= 0 ? startIndex % others.length : 0;
    return [...others.slice(offset), ...others.slice(0, offset)].slice(0, max);
}
