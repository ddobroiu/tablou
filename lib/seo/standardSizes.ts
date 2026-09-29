/**
 * Dimensiuni STANDARD per produs: singurele pagini /dimensiuni/{produs}/{L}x{H}
 * care se indexează și intră în sitemap (pe site-ul acasă al produsului, vezi
 * lib/seo/siteSpecialization.ts). Restul grilei (~8.300 de mărimi) rămâne live,
 * cu noindex,follow, fără sitemap.
 *
 * FIȘIER IDENTIC ÎN TOATE CELE 6 REPO-URI. Fără importuri de server: e folosit și
 * din componente client (SeoDimensionsLinks e randat în ConfiguratorDispatcher).
 *
 * Lista e scurtă intenționat: formatele pe care oamenii le caută sau le comandă
 * efectiv (ISO A pentru hârtie, formatele de roll-up din configurator, bannere
 * 1-5 m × 0,5-2 m, rapoartele foto uzuale pentru canvas, tăieturile uzuale din
 * plăci). Căutările din GSC (16 luni, toate site-urile): „afise a3”, „afise a2”,
 * „afiș 50×70 cm”, „mini roll up a3”, „plexiglas 200x100”, „plexiglas 150 x 100”.
 * Orice mărime de aici trebuie să existe în grila motorului de preț
 * (lib/seo/dimensionPages.ts → getSize); cele care nu există sunt ignorate la rulare.
 */

import { sizeCanonical } from "@/lib/seo/siteSpecialization";
import { getSize, getPopularSizes, type DimSize } from "@/lib/seo/dimensionPages";

export const STANDARD_SIZES: Record<string, Array<[number, number]>> = {
    // Bannere: lățimi de 1-5 m pe înălțimi de 0,5-2 m (fațade, garduri, evenimente)
    banner: [[100, 50], [150, 100], [200, 100], [300, 100], [400, 100], [500, 100], [300, 150], [300, 200], [400, 200]],
    "banner-verso": [[100, 50], [150, 100], [200, 100], [300, 100], [300, 200]],
    // Mesh: schele și fațade
    mesh: [[300, 100], [300, 200], [400, 200], [500, 200], [500, 300]],
    // Roll-up: formatele din configurator
    rollup: [[85, 200], [100, 200], [120, 200], [150, 200]],
    // Folie de vitrină: lățimea maximă a rolei e 137 cm
    "window-graphics": [[60, 90], [100, 100], [100, 150], [100, 200], [120, 200]],
    // Canvas: rapoartele foto uzuale (2:3, 3:4, 1:1)
    canvas: [[20, 30], [30, 40], [30, 30], [40, 40], [40, 60], [50, 50], [50, 70], [60, 40], [60, 80], [60, 90], [70, 100], [80, 120], [100, 100], [100, 150]],
    // Fototapet: pereți de 2-4 m lățime la înălțimea uzuală de 250 cm
    tapet: [[200, 250], [250, 250], [300, 250], [350, 250], [400, 250]],
    // Hârtie: ISO A și formatele de afiș din configurator
    afise: [[30, 42], [42, 59], [59, 84], [84, 119], [70, 100], [100, 140]],
    pliante: [[21, 30], [15, 21], [11, 15]],
    flayere: [[11, 15], [15, 21], [21, 10]],
    "carti-vizita": [[9, 5]],
    // Autocolante: etichete mici și formatele A
    autocolante: [[10, 10], [20, 20], [30, 30], [21, 30], [30, 42], [50, 50], [100, 50], [100, 100]],
    // Plăci rigide: tăieturi uzuale, inclusiv 200x100 și 150x100 căutate în GSC
    plexiglass: [[20, 30], [30, 40], [40, 60], [50, 70], [60, 90], [70, 100], [100, 50], [100, 100], [150, 100], [200, 100]],
    "pvc-forex": [[21, 30], [30, 42], [50, 70], [70, 100], [100, 50], [100, 100], [150, 100], [200, 100], [300, 200]],
    alucobond: [[40, 30], [60, 40], [100, 50], [100, 70], [100, 100], [150, 100], [200, 100]],
    carton: [[30, 42], [42, 59], [50, 70], [59, 84], [70, 100], [100, 140]],
    polipropilena: [[30, 42], [42, 59], [50, 70], [60, 40], [70, 100], [100, 100], [100, 200]],
};

const _set = new Map<string, Set<string>>();

function keySet(productId: string): Set<string> {
    let s = _set.get(productId);
    if (!s) {
        s = new Set((STANDARD_SIZES[productId] ?? []).map(([w, h]) => `${w}x${h}`));
        _set.set(productId, s);
    }
    return s;
}

/** True când mărimea e în lista standard a produsului. */
export function isStandardSize(productId: string, w: number, h: number): boolean {
    return keySet(String(productId || "").toLowerCase()).has(`${w}x${h}`);
}

/** Mărimile standard ale produsului, în ordinea din listă. */
export function standardSizesFor(productId: string): Array<{ w: number; h: number }> {
    return (STANDARD_SIZES[String(productId || "").toLowerCase()] ?? []).map(([w, h]) => ({ w, h }));
}

/**
 * Metadatele de indexare pentru /dimensiuni/{produs}/{L}x{H}:
 *  - mărime standard → index; canonical pe site-ul acasă al produsului (aceeași cale)
 *  - orice altă mărime → noindex,follow; canonical pe ea însăși; nu intră în sitemap
 */
export function sizePageIndexing(
    currentOrigin: string,
    productId: string,
    w: number,
    h: number,
    path: string,
): { canonical: string; robots: { index: boolean; follow: boolean } } {
    const origin = String(currentOrigin || "").replace(/\/+$/, "").toLowerCase();
    if (!isStandardSize(productId, w, h)) return { canonical: `${origin}${path}`, robots: { index: false, follow: true } };
    return { canonical: sizeCanonical(origin, productId, path).url, robots: { index: true, follow: true } };
}

/** Mărimile standard care există în grila de preț (cu eticheta din grilă, ex. „A3”). */
export function getStandardSizes(productId: string): DimSize[] {
    const pid = String(productId || "").toLowerCase();
    return standardSizesFor(pid)
        .map((s) => getSize(pid, s.w, s.h))
        .filter((s): s is DimSize => Boolean(s));
}

/** Întâi mărimile standard, apoi cele populare, fără dubluri; pentru blocurile de legături. */
export function standardFirstSizes(productId: string, max = 12): DimSize[] {
    const out: DimSize[] = [];
    const seen = new Set<string>();
    for (const s of [...getStandardSizes(productId), ...getPopularSizes(productId, max)]) {
        const k = `${s.w}x${s.h}`;
        if (seen.has(k)) continue;
        seen.add(k);
        out.push(s);
        if (out.length >= max) break;
    }
    return out;
}
