// "De la X lei" pentru un produs, din același motor de prețuri ca în
// configurator: cea mai mică valoare pe bucată dintre mărimile populare
// (produse pe dimensiuni) sau prețul pe bucată la primul tiraj (produse la
// cantitate). Folosit în titluri și meta description, unde un preț concret
// crește rata de click; nimic nu e estimat manual.
import { getPopularSizes, isDimensionProduct } from "./dimensionPages";
import { getDimensionPricing, formatLei } from "./dimensionPricing";
import { QTY_PRODUCTS, getQtyPricing } from "./quantityPages";

export type FromPrice = { price: number; text: string; basis: string };

const _cache = new Map<string, FromPrice | null>();

export function getFromPrice(productIds: Array<string | undefined | null>): FromPrice | null {
    for (const raw of productIds) {
        const id = String(raw || "").toLowerCase();
        if (!id) continue;
        if (_cache.has(id)) {
            const c = _cache.get(id) ?? null;
            if (c) return c;
            continue;
        }
        let result: FromPrice | null = null;
        if (isDimensionProduct(id)) {
            let best: { price: number; label: string; w: number; h: number } | null = null;
            for (const s of getPopularSizes(id, 6)) {
                const p = getDimensionPricing(id, s.w, s.h);
                if (p && p.fromPrice > 0 && (!best || p.fromPrice < best.price)) best = { price: p.fromPrice, label: p.fromLabel, w: s.w, h: s.h };
            }
            if (best) result = { price: best.price, text: formatLei(best.price), basis: `${best.w}×${best.h} cm, ${best.label}` };
        }
        if (!result) {
            const q = QTY_PRODUCTS.find((p) => p.id === id || p.slug === id);
            if (q) {
                const pr = getQtyPricing(q, q.formats[0], q.quantities[0]);
                if (pr) result = { price: pr.recommended.unit, text: formatLei(pr.recommended.unit), basis: `${q.quantities[0]} buc, ${q.formats[0].short}` };
            }
        }
        _cache.set(id, result);
        if (result) return result;
    }
    return null;
}
