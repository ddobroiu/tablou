// Punctele DPD din Romania (lockere si oficii), pentru livrarea la punct din checkout.
// Lista vine de la DPD (POST /location/office) si se tine 12 ore in memorie.
// Un punct apare doar daca incape coletul comenzii (dimensiuni si greutate).
import { calculateShippingParams, determinePackingType, extractDimensions } from "./shippingUtils";

export type DpdPoint = {
    id: number;
    type: "APT" | "OFFICE";   // APT = locker
    name: string;
    address: string;
    city: string;
    postCode: string;
    lat: number;
    lng: number;
    dims: [number, number, number]; // cm, crescator
    maxKg: number;
    cod: boolean;                   // se poate plati la ridicare (cash sau card)
};

let cache: { at: number; points: DpdPoint[] } | null = null;

const title = (s: string) => s.toLowerCase().replace(/(^|[\s-])\S/g, (m) => m.toUpperCase());

export async function getDpdPoints(): Promise<DpdPoint[]> {
    if (cache && Date.now() - cache.at < 12 * 3_600_000) return cache.points;
    const res = await fetch("https://api.dpd.ro/v1/location/office", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: process.env.DPD_USERNAME, password: process.env.DPD_PASSWORD, language: "RO", countryId: 642 }),
        cache: "no-store",
    });
    const body = await res.json();
    const points: DpdPoint[] = (body?.offices ?? [])
        .filter((o: any) => (o.type === "APT" || o.type === "OFFICE") && o.address?.x && o.address?.y && o.pickUpAllowed !== false)
        .map((o: any) => {
            const d = o.maxParcelDimensions || {};
            return {
                id: Number(o.id),
                type: o.type,
                name: title(String(o.name || "").replace(/\s*\((outdoor|indoor) locker\)\s*/i, "")),
                address: String(o.address?.fullAddressString || "").replace(/^[^\]]*\]\s*/, ""),
                city: title(String(o.address?.siteName || "")),
                postCode: String(o.address?.postCode || ""),
                lat: Number(o.address.y),
                lng: Number(o.address.x),
                dims: [Number(d.width) || 0, Number(d.height) || 0, Number(d.depth) || 0].sort((a, b) => a - b) as [number, number, number],
                maxKg: Number(o.maxParcelWeight) || 0,
                cod: Boolean(o.cashPaymentAllowed || o.cardPaymentAllowed),
            };
        });
    if (points.length) cache = { at: Date.now(), points };
    return points;
}

// Coletul comenzii: cea mai mare cutie (dimensiuni crescatoare), greutatea si volumul total
export function estimateParcel(items: any[]) {
    let biggest: [number, number, number] = [0, 0, 0];
    let kg = 0;
    let volume = 0;
    for (const item of items || []) {
        const q = Number(item.quantity || item.qty || 1);
        const { w, h } = extractDimensions(item);
        let box: [number, number, number];
        let weight: number;
        if (w > 0 && h > 0) {
            const type = determinePackingType(item.slug || item.productId || item.name || item.title || "", item);
            const r = calculateShippingParams({ width: w, height: h, quantity: q, type });
            box = [r.packageDimensions.length, r.packageDimensions.width, r.packageDimensions.height].sort((a, b) => a - b) as [number, number, number];
            weight = r.billingWeight;
        } else {
            const name = String(item.slug || item.name || item.title || "").toLowerCase();
            // rollup-urile si standurile nu intra in lockere; tiparul mic (flyere, carti de vizita) intra
            if (/rollup|roll-up|pop-up|spider|x-banner/.test(name)) { box = [15, 15, 90]; weight = 3 * q; }
            // tipar mic (flyere, pliante, carti de vizita, stickere): ~6 g si ~0,15 mm pe bucata, in cutii A4
            else { box = [Math.max(3, Math.ceil(q * 0.015)), 25, 35].sort((m, n) => m - n) as [number, number, number]; weight = Math.max(0.3, 0.006 * q); }
        }
        if (box[2] > biggest[2] || box[1] > biggest[1]) biggest = box.map((v, i) => Math.max(v, biggest[i])) as [number, number, number];
        kg += weight;
        volume += box[0] * box[1] * box[2];
    }
    return { biggest, kg, volume };
}

export function fitsIn(point: DpdPoint, parcel: ReturnType<typeof estimateParcel>) {
    const [a, b, c] = point.dims;
    const [x, y, z] = parcel.biggest;
    if (!a || !b || !c) return false;
    return x <= a && y <= b && z <= c && parcel.kg <= point.maxKg && parcel.volume <= a * b * c * 0.9;
}
