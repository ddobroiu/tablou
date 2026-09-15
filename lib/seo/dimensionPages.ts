// Pagini de dimensiune: /dimensiuni/{produs}/{L}x{H}
//
// Câte o pagină pentru fiecare combinație produs × dimensiune din grila de
// mai jos. Grila nu e "toate combinațiile matematic posibile", ci pașii pe
// care îi caută oamenii (din 10 în 10 cm până la 3 m, din 25 în 25 cm peste)
// plus formatele cu nume (A0-A4, B0-B2, roll-up). Fiecare pagină are prețuri,
// greutate, rezoluție de fișier și recomandări calculate pentru mărimea ei,
// deci conținutul diferă real de la o pagină la alta, nu doar titlul.
//
// Doar dimensiunile din grilă au pagină. Orice altă combinație dă 404, ca
// să nu existe un spațiu infinit de URL-uri de crawl-uit.
import { CONFIGURATORS_REGISTRY } from "@/lib/configurators-registry";

export type DimSize = { w: number; h: number; label?: string };

/** Produse cu dimensiuni libere (lățime × înălțime în cm). */
export const CUSTOM_DIM_PRODUCTS = [
    "banner",
    "banner-verso",
    "mesh",
    "autocolante",
    "canvas",
    "tapet",
    "window-graphics",
    "plexiglass",
    "pvc-forex",
    "alucobond",
    "carton",
    "polipropilena",
] as const;

/** Produse cu formate fixe (presetările din registru). */
export const PRESET_DIM_PRODUCTS = ["afise", "rollup", "pliante", "flayere", "carti-vizita"] as const;

export const DIMENSION_PRODUCT_IDS: string[] = [...CUSTOM_DIM_PRODUCTS, ...PRESET_DIM_PRODUCTS];

/** Autocolantele și foliile pot avea până la 50 m pe lungimea rolei; paginile merg până aici. */
const HEIGHT_CAP_CM = 500;

/** Formate cu nume, în cm rotunjiți (paginile lucrează în cm întregi). */
export const NAMED_FORMATS: Array<{ w: number; h: number; label: string }> = [
    { w: 21, h: 30, label: "A4" },
    { w: 30, h: 42, label: "A3" },
    { w: 42, h: 59, label: "A2" },
    { w: 59, h: 84, label: "A1" },
    { w: 84, h: 119, label: "A0" },
    { w: 50, h: 70, label: "B2" },
    { w: 70, h: 100, label: "B1" },
    { w: 100, h: 140, label: "B0" },
    { w: 85, h: 200, label: "format roll-up" },
    { w: 100, h: 200, label: "format roll-up lat" },
];

export function getDimProduct(productId: string) {
    return CONFIGURATORS_REGISTRY.find((c) => c.id === productId || c.slug === productId);
}

export function isDimensionProduct(productId: string): boolean {
    return DIMENSION_PRODUCT_IDS.includes(productId);
}

/** Pașii de dimensiune între min și max: 10 cm până la 300, 25 cm peste. */
export function sizeSteps(min: number, max: number): number[] {
    const out = new Set<number>();
    const first = Math.ceil(min / 10) * 10;
    for (let v = first; v <= Math.min(max, 300); v += 10) out.add(v);
    for (let v = 325; v <= max; v += 25) out.add(v);
    out.add(min);
    out.add(max);
    return [...out].filter((v) => v >= min && v <= max && Number.isInteger(v)).sort((a, b) => a - b);
}

const _sizeCache = new Map<string, DimSize[]>();
const _sizeIndex = new Map<string, Map<string, DimSize>>();

export function sizeKey(w: number, h: number): string {
    return `${w}x${h}`;
}

/** Toate dimensiunile cu pagină pentru un produs. */
export function getSizesForProduct(productId: string): DimSize[] {
    const cached = _sizeCache.get(productId);
    if (cached) return cached;

    const cfg = getDimProduct(productId);
    const result: DimSize[] = [];
    const seen = new Set<string>();
    const push = (s: DimSize) => {
        const k = sizeKey(s.w, s.h);
        if (seen.has(k)) return;
        seen.add(k);
        result.push(s);
    };

    if (cfg && (CUSTOM_DIM_PRODUCTS as readonly string[]).includes(productId) && cfg.dimensions.type === "custom") {
        const d = cfg.dimensions;
        const minW = d.minWidth ?? 10;
        const maxW = d.maxWidth ?? 500;
        const minH = d.minHeight ?? 10;
        const maxH = Math.min(d.maxHeight ?? 500, HEIGHT_CAP_CM);
        const ws = sizeSteps(minW, maxW);
        const hs = sizeSteps(minH, maxH);
        for (const w of ws) for (const h of hs) push({ w, h });
        for (const f of NAMED_FORMATS) {
            if (f.w >= minW && f.w <= maxW && f.h >= minH && f.h <= maxH) push({ w: f.w, h: f.h, label: f.label });
            if (f.h >= minW && f.h <= maxW && f.w >= minH && f.w <= maxH) push({ w: f.h, h: f.w, label: `${f.label} landscape` });
        }
    } else if (cfg && (PRESET_DIM_PRODUCTS as readonly string[]).includes(productId) && cfg.dimensions.type === "preset") {
        for (const p of cfg.dimensions.presets ?? []) {
            push({ w: roundCm(p.width), h: roundCm(p.height), label: p.label });
        }
    }

    _sizeCache.set(productId, result);
    _sizeIndex.set(productId, new Map(result.map((s) => [sizeKey(s.w, s.h), s])));
    return result;
}

function roundCm(v: number): number {
    return Math.round(v);
}

export function getSize(productId: string, w: number, h: number): DimSize | undefined {
    getSizesForProduct(productId);
    return _sizeIndex.get(productId)?.get(sizeKey(w, h));
}

/** Parsează "300x100" din URL. */
export function parseSizeSlug(slug: string): { w: number; h: number } | null {
    const m = /^(\d{1,4})x(\d{1,4})$/.exec(String(slug || ""));
    if (!m) return null;
    return { w: parseInt(m[1], 10), h: parseInt(m[2], 10) };
}

export function dimensionUrl(productId: string, w: number, h: number): string {
    return `/dimensiuni/${productId}/${w}x${h}`;
}

/** Numele formatului cu nume pentru o dimensiune, dacă există (A3, B2 ...). */
export function namedFormatFor(w: number, h: number): string | undefined {
    const f = NAMED_FORMATS.find((x) => (x.w === w && x.h === h) || (x.w === h && x.h === w));
    return f?.label;
}

/** Vecinii unei dimensiuni: aceeași lățime ± un pas, aceeași înălțime ± un pas,
 *  orientarea inversă și dublul/jumătatea la aceeași proporție. */
export function getNeighborSizes(productId: string, w: number, h: number, max = 10): DimSize[] {
    const all = getSizesForProduct(productId);
    if (all.length === 0) return [];
    const ws = [...new Set(all.map((s) => s.w))].sort((a, b) => a - b);
    const hs = [...new Set(all.map((s) => s.h))].sort((a, b) => a - b);
    const wi = ws.indexOf(w);
    const hi = hs.indexOf(h);
    const candidates: Array<[number, number]> = [];
    if (wi > 0) candidates.push([ws[wi - 1], h]);
    if (wi >= 0 && wi < ws.length - 1) candidates.push([ws[wi + 1], h]);
    if (hi > 0) candidates.push([w, hs[hi - 1]]);
    if (hi >= 0 && hi < hs.length - 1) candidates.push([w, hs[hi + 1]]);
    candidates.push([h, w]);
    candidates.push([w * 2, h * 2]);
    candidates.push([w / 2, h / 2]);
    if (wi > 1) candidates.push([ws[wi - 2], h]);
    if (wi >= 0 && wi < ws.length - 2) candidates.push([ws[wi + 2], h]);
    if (hi > 1) candidates.push([w, hs[hi - 2]]);
    if (hi >= 0 && hi < hs.length - 2) candidates.push([w, hs[hi + 2]]);

    const out: DimSize[] = [];
    const seen = new Set<string>([sizeKey(w, h)]);
    for (const [cw, ch] of candidates) {
        const s = getSize(productId, cw, ch);
        if (!s) continue;
        const k = sizeKey(s.w, s.h);
        if (seen.has(k)) continue;
        seen.add(k);
        out.push(s);
        if (out.length >= max) break;
    }
    return out;
}

/** Dimensiunile cele mai căutate pentru un produs (pentru index și link-uri). */
export function getPopularSizes(productId: string, max = 12): DimSize[] {
    const all = getSizesForProduct(productId);
    const popularKeys = [
        "100x50", "100x70", "100x100", "150x100", "200x100", "250x100", "300x100", "400x100", "500x100",
        "200x80", "300x80", "300x150", "400x150", "300x200", "400x200", "500x200", "200x150",
        "50x50", "60x40", "70x50", "80x60", "90x60", "120x80", "60x90", "70x100", "100x140",
        "30x30", "40x40", "40x30", "50x70", "30x42", "42x59", "59x84", "84x119", "21x30",
        "137x300", "137x200", "137x100", "100x200", "85x200", "120x200", "150x200",
        "20x20", "20x30", "30x20", "10x10", "10x20", "20x10",
    ];
    const out: DimSize[] = [];
    for (const k of popularKeys) {
        const [w, h] = k.split("x").map(Number);
        const s = getSize(productId, w, h);
        if (s) out.push(s);
        if (out.length >= max) break;
    }
    if (out.length < max) {
        for (const s of all) {
            if (out.includes(s)) continue;
            out.push(s);
            if (out.length >= max) break;
        }
    }
    return out;
}

/** Toate URL-urile de dimensiune (pentru sitemap). */
export function getAllDimensionEntries(): Array<{ productId: string; w: number; h: number }> {
    const out: Array<{ productId: string; w: number; h: number }> = [];
    for (const pid of DIMENSION_PRODUCT_IDS) {
        for (const s of getSizesForProduct(pid)) out.push({ productId: pid, w: s.w, h: s.h });
    }
    return out;
}

/** Câte URL-uri încap într-un fișier de sitemap de dimensiuni; index și
 *  generator folosesc aceeași constantă. */
export const DIMENSION_URLS_PER_SITEMAP = 20000;

export function getDimensionSitemapParts(): number {
    return Math.max(1, Math.ceil(getAllDimensionEntries().length / DIMENSION_URLS_PER_SITEMAP));
}
