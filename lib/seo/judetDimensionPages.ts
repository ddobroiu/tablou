// Pagini județ × produs × dimensiune populară:
//   /judet/{judet}/dimensiuni/{produs}/{L}x{H}
// Doar top 5 mărimi per produs (nu toată grila), pentru căutări de tipul
// „banner 3x1 Cluj” sau „canvas 60x40 Iași”. Conținutul = datele reale ale
// dimensiunii (preț, greutate, fișier) + profilul factual al județului
// (industrii locale, notă geografică, reper, nivel de livrare), nu text rotit.
import { JUDETE_FULL_DATA } from "@/lib/localitati";
import { CUSTOM_DIM_PRODUCTS, getPopularSizes, getSize, DimSize } from "./dimensionPages";

export const JUDET_DIM_PRODUCTS: string[] = [...CUSTOM_DIM_PRODUCTS];
export const JUDET_DIM_SIZES_PER_PRODUCT = 5;

const _top = new Map<string, DimSize[]>();
export function getTopSizes(productId: string): DimSize[] {
    const c = _top.get(productId);
    if (c) return c;
    const sizes = getPopularSizes(productId, JUDET_DIM_SIZES_PER_PRODUCT);
    _top.set(productId, sizes);
    return sizes;
}

export function isJudetDimSize(productId: string, w: number, h: number): boolean {
    return JUDET_DIM_PRODUCTS.includes(productId) && !!getSize(productId, w, h) && getTopSizes(productId).some((s) => s.w === w && s.h === h);
}

export function judetDimensionUrl(judetSlug: string, productId: string, w: number, h: number): string {
    return `/judet/${judetSlug}/dimensiuni/${productId}/${w}x${h}`;
}

export function getAllJudetDimensionEntries(): Array<{ judetSlug: string; productId: string; w: number; h: number }> {
    const out: Array<{ judetSlug: string; productId: string; w: number; h: number }> = [];
    for (const j of JUDETE_FULL_DATA) {
        for (const pid of JUDET_DIM_PRODUCTS) {
            for (const s of getTopSizes(pid)) out.push({ judetSlug: j.slug, productId: pid, w: s.w, h: s.h });
        }
    }
    return out;
}
