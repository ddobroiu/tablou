// Pagini de preț pe cantitate: /preturi/{produs}/{format}-{cantitate}-buc
//
// Pentru produsele vândute la tiraj (flyere, pliante, cărți de vizită, afișe,
// textile, roll-up, etichete autocolante) oamenii caută "1000 flyere A5 preț",
// "500 cărți de vizită", "50 tricouri personalizate". Fiecare pagină răspunde
// cu prețul calculat de motorul configuratorului (lib/pricing.ts) pentru
// exact acea cantitate, pragurile reale de discount, greutatea coletului
// calculată din gramaj și specificațiile de fișier. Nimic nu e inventat:
// datele vin din registru și din motorul de prețuri.
import { CONFIGURATORS_REGISTRY } from "@/lib/configurators-registry";
import {
    calculateFlyerPrice,
    calculatePliantePrice,
    calculateBusinessCardPrice,
    calculatePosterPrice,
    calculateTextilePrice,
    calculateRollupPrice,
    calculateAutocolantePrice,
    roundMoney,
} from "@/lib/pricing";

export type QtyFormat = {
    key: string;          // segment din URL: "a5", "standard", "85x200", "fata"
    label: string;        // "A5 (148 × 210 mm)"
    short: string;        // "A5"
    /** dimensiuni în mm, când au sens */
    wMm?: number;
    hMm?: number;
    /** gramajul hârtiei pentru varianta recomandată, g/m² */
    gsm?: number;
    /** greutate fixă pe bucată, kg (roll-up) */
    unitKg?: number;
};

export type QtyVariant = {
    key: string;
    label: string;
    note?: string;
    recommended?: boolean;
    total: (format: QtyFormat, qty: number) => number;
};

export type QtyProduct = {
    id: string;                 // id din CONFIGURATORS_REGISTRY
    slug: string;               // segment URL: "flayere"
    name: string;               // "Flyere"
    unit: string;               // "flyere", "cărți de vizită"
    unitSingular: string;       // "flyer"
    formatLabel: string;        // "Format", "Material", "Lățime", "Print"
    formats: QtyFormat[];
    quantities: number[];
    variants: QtyVariant[];
    /** produs textil / obiect, nu hârtie */
    kind: "hartie" | "textil" | "sistem" | "folie";
};

const A = (short: string, w: number, h: number, gsm: number): QtyFormat => ({ key: short.toLowerCase(), label: `${short} (${w} × ${h} mm)`, short, wMm: w, hMm: h, gsm });

export const QTY_PRODUCTS: QtyProduct[] = [
    {
        id: "flayere", slug: "flayere", name: "Flyere", unit: "flyere", unitSingular: "flyer", formatLabel: "Format", kind: "hartie",
        formats: [A("A6", 105, 148, 135), A("A5", 148, 210, 135), { key: "dl", label: "DL (210 × 100 mm)", short: "DL", wMm: 210, hMm: 100, gsm: 135 }],
        quantities: [100, 250, 500, 1000, 2500, 5000],
        variants: [
            { key: "135-fata", label: "Couché 135 g, print pe o față", recommended: true, total: (f, q) => calculateFlyerPrice({ sizeKey: flyerKey(f), quantity: q, twoSided: false, paperWeightKey: "135", designOption: "upload" }).finalPrice },
            { key: "135-fata-verso", label: "Couché 135 g, față-verso", total: (f, q) => calculateFlyerPrice({ sizeKey: flyerKey(f), quantity: q, twoSided: true, paperWeightKey: "135", designOption: "upload" }).finalPrice },
            { key: "250-fata-verso", label: "Carton 250 g, față-verso", note: "carton rigid, +20%", total: (f, q) => calculateFlyerPrice({ sizeKey: flyerKey(f), quantity: q, twoSided: true, paperWeightKey: "250", designOption: "upload" }).finalPrice },
        ],
    },
    {
        id: "pliante", slug: "pliante", name: "Pliante", unit: "pliante", unitSingular: "pliant", formatLabel: "Pliere", kind: "hartie",
        formats: [
            { key: "simplu", label: "A4 pliat în două (1 big, închis 148 × 210 mm)", short: "pliat în două", wMm: 297, hMm: 210, gsm: 170 },
            { key: "fereastra", label: "A4 pliat fereastră (2 biguri)", short: "fereastră", wMm: 297, hMm: 210, gsm: 170 },
            { key: "paralel", label: "A4 pliat în trei (3 biguri, închis 99 × 210 mm)", short: "pliat în trei", wMm: 297, hMm: 210, gsm: 170 },
            { key: "fluture", label: "A4 pliat fluture (4 biguri)", short: "fluture", wMm: 297, hMm: 210, gsm: 170 },
        ],
        quantities: [100, 250, 500, 1000, 2500, 5000],
        variants: [
            { key: "115", label: "Hârtie 115 g", total: (f, q) => calculatePliantePrice({ weight: "115", quantity: q, fold: f.key as any, designOption: "upload" }).finalPrice },
            { key: "135", label: "Hârtie 135 g", total: (f, q) => calculatePliantePrice({ weight: "135", quantity: q, fold: f.key as any, designOption: "upload" }).finalPrice },
            { key: "170", label: "Hârtie 170 g", recommended: true, total: (f, q) => calculatePliantePrice({ weight: "170", quantity: q, fold: f.key as any, designOption: "upload" }).finalPrice },
            { key: "250", label: "Carton 250 g", total: (f, q) => calculatePliantePrice({ weight: "250", quantity: q, fold: f.key as any, designOption: "upload" }).finalPrice },
        ],
    },
    {
        id: "carti-vizita", slug: "carti-vizita", name: "Cărți de vizită", unit: "cărți de vizită", unitSingular: "carte de vizită", formatLabel: "Material", kind: "hartie",
        formats: [
            { key: "carton", label: "Carton 350 g (90 × 50 mm)", short: "carton 350 g", wMm: 90, hMm: 50, gsm: 350 },
            { key: "plastic", label: "Plastic PVC 0,5 mm (85 × 54 mm)", short: "plastic PVC", wMm: 85, hMm: 54 },
            { key: "lemn", label: "Furnir de lemn (90 × 50 mm)", short: "furnir de lemn", wMm: 90, hMm: 50 },
            { key: "metal", label: "Metal (85 × 54 mm)", short: "metal", wMm: 85, hMm: 54 },
        ],
        quantities: [100, 200, 500, 1000, 2000],
        variants: [
            { key: "o-fata", label: "Print pe o față", recommended: true, total: (f, q) => calculateBusinessCardPrice({ type: bcType(f), quantity: q, twoSided: false, designOption: "upload" }).finalPrice },
            { key: "fata-verso", label: "Print față-verso", total: (f, q) => calculateBusinessCardPrice({ type: bcType(f), quantity: q, twoSided: true, designOption: "upload" }).finalPrice },
            { key: "fata-verso-rotunjite", label: "Față-verso, colțuri rotunjite", total: (f, q) => calculateBusinessCardPrice({ type: bcType(f), quantity: q, twoSided: true, roundedCorners: true, designOption: "upload" }).finalPrice },
        ],
    },
    {
        id: "afise", slug: "afise", name: "Afișe", unit: "afișe", unitSingular: "afiș", formatLabel: "Format", kind: "hartie",
        formats: [A("A3", 297, 420, 150), A("A2", 420, 594, 150), A("A1", 594, 841, 150), A("A0", 841, 1189, 150), { key: "50x70", label: "50 × 70 cm", short: "50×70 cm", wMm: 500, hMm: 700, gsm: 150 }, { key: "70x100", label: "70 × 100 cm", short: "70×100 cm", wMm: 700, hMm: 1000, gsm: 150 }],
        quantities: [1, 10, 50, 100, 250, 500],
        variants: [
            { key: "150-lucios", label: "Hârtie 150 g lucioasă", recommended: true, total: (f, q) => calculatePosterPrice({ size: posterKey(f), material: "paper_150_lucioasa", quantity: q, designOption: "upload" }).finalPrice },
            { key: "blueback-115", label: "Blueback 115 g (outdoor, opac pe spate)", total: (f, q) => calculatePosterPrice({ size: posterKey(f), material: "blueback_115", quantity: q, designOption: "upload" }).finalPrice },
            { key: "300-lucios", label: "Carton 300 g lucios", total: (f, q) => calculatePosterPrice({ size: posterKey(f), material: "paper_300_lucioasa", quantity: q, designOption: "upload" }).finalPrice },
        ],
    },
    {
        id: "tricouri", slug: "tricouri", name: "Tricouri personalizate", unit: "tricouri", unitSingular: "tricou", formatLabel: "Print", kind: "textil",
        formats: [{ key: "fata", label: "Print pe față", short: "print pe față" }, { key: "fata-spate", label: "Print față și spate", short: "print față și spate" }],
        quantities: [10, 20, 30, 50, 100, 250],
        variants: [
            { key: "basic", label: "Tricou basic din bumbac", recommended: true, total: (f, q) => calculateTextilePrice({ type: "tricouri", model: "basic", quantity: q, size: "M", color: "alb", printPosition: f.key === "fata" ? "fata" : "fata_si_spate", designOption: "upload" }).finalPrice },
            { key: "polo", label: "Tricou polo piqué", total: (f, q) => calculateTextilePrice({ type: "tricouri", model: "polo_pique", quantity: q, size: "M", color: "alb", printPosition: f.key === "fata" ? "fata" : "fata_si_spate", designOption: "upload" }).finalPrice },
        ],
    },
    {
        id: "hanorace", slug: "hanorace", name: "Hanorace personalizate", unit: "hanorace", unitSingular: "hanorac", formatLabel: "Print", kind: "textil",
        formats: [{ key: "fata", label: "Print pe față", short: "print pe față" }, { key: "fata-spate", label: "Print față și spate", short: "print față și spate" }],
        quantities: [10, 20, 30, 50, 100],
        variants: [
            { key: "hanorac", label: "Hanorac din bumbac", recommended: true, total: (f, q) => calculateTextilePrice({ type: "hanorace", quantity: q, size: "M", color: "negru", printPosition: f.key === "fata" ? "fata" : "fata_si_spate", designOption: "upload" }).finalPrice },
        ],
    },
    {
        id: "sepci", slug: "sepci", name: "Șepci personalizate", unit: "șepci", unitSingular: "șapcă", formatLabel: "Print", kind: "textil",
        formats: [{ key: "logo", label: "Print / broderie logo față", short: "logo față" }],
        quantities: [10, 20, 30, 50, 100, 250],
        variants: [
            { key: "sapca", label: "Șapcă cu logo", recommended: true, total: (_f, q) => calculateTextilePrice({ type: "sepci", quantity: q, size: "M", color: "negru", printPosition: "fata", designOption: "upload" }).finalPrice },
        ],
    },
    {
        id: "rollup", slug: "rollup", name: "Roll-up", unit: "roll-up-uri", unitSingular: "roll-up", formatLabel: "Lățime", kind: "sistem",
        formats: [
            { key: "85x200", label: "85 × 200 cm", short: "85×200 cm", wMm: 850, hMm: 2000, unitKg: 3.5 },
            { key: "100x200", label: "100 × 200 cm", short: "100×200 cm", wMm: 1000, hMm: 2000, unitKg: 3.5 },
            { key: "120x200", label: "120 × 200 cm", short: "120×200 cm", wMm: 1200, hMm: 2000, unitKg: 3.5 },
            { key: "150x200", label: "150 × 200 cm", short: "150×200 cm", wMm: 1500, hMm: 2000, unitKg: 3.5 },
        ],
        quantities: [1, 2, 5, 10, 20],
        variants: [
            { key: "rollup", label: "Sistem aluminiu + print Blueback 440 g, geantă inclusă", recommended: true, total: (f, q) => calculateRollupPrice({ width_cm: (f.wMm ?? 850) / 10, quantity: q, designOption: "upload" }).finalPrice },
        ],
    },
    {
        id: "autocolante", slug: "etichete-autocolante", name: "Etichete autocolante", unit: "etichete", unitSingular: "etichetă", formatLabel: "Dimensiune", kind: "folie",
        formats: [
            { key: "5x5", label: "5 × 5 cm", short: "5×5 cm", wMm: 50, hMm: 50 },
            { key: "7x7", label: "7 × 7 cm", short: "7×7 cm", wMm: 70, hMm: 70 },
            { key: "10x10", label: "10 × 10 cm", short: "10×10 cm", wMm: 100, hMm: 100 },
            { key: "10x15", label: "10 × 15 cm", short: "10×15 cm", wMm: 100, hMm: 150 },
            { key: "15x20", label: "15 × 20 cm", short: "15×20 cm", wMm: 150, hMm: 200 },
            { key: "20x30", label: "20 × 30 cm", short: "20×30 cm", wMm: 200, hMm: 300 },
        ],
        quantities: [50, 100, 250, 500, 1000, 2500],
        variants: [
            { key: "economic", label: "Folie economică (Oracal 3641), tăiate pe contur", recommended: true, total: (f, q) => calculateAutocolantePrice({ width_cm: (f.wMm ?? 50) / 10, height_cm: (f.hMm ?? 50) / 10, quantity: q, material: "oracal_3641", print_type: "print_cut", laminated: false, transfer_film: false, designOption: "upload" }).finalPrice },
            { key: "economic-laminat", label: "Folie economică, laminate", note: "recomandat la exterior și pe produse spălate", total: (f, q) => calculateAutocolantePrice({ width_cm: (f.wMm ?? 50) / 10, height_cm: (f.hMm ?? 50) / 10, quantity: q, material: "oracal_3641", print_type: "print_cut", laminated: true, transfer_film: false, designOption: "upload" }).finalPrice },
            { key: "transparent", label: "Folie transparentă", total: (f, q) => calculateAutocolantePrice({ width_cm: (f.wMm ?? 50) / 10, height_cm: (f.hMm ?? 50) / 10, quantity: q, material: "oracal_transparent", print_type: "print_cut", laminated: false, transfer_film: false, designOption: "upload" }).finalPrice },
        ],
    },
];

function flyerKey(f: QtyFormat): string {
    return f.key === "dl" ? "21x10" : f.short;
}
function posterKey(f: QtyFormat): string {
    if (f.key === "50x70") return "S5";
    if (f.key === "70x100") return "S7";
    return f.short;
}
function bcType(f: QtyFormat): string {
    return f.key === "carton" ? "standard" : f.key === "metal" ? "metalice" : f.key;
}

export function getQtyProduct(slug: string): QtyProduct | undefined {
    return QTY_PRODUCTS.find((p) => p.slug === slug);
}

export function getRegistryEntry(productId: string) {
    return CONFIGURATORS_REGISTRY.find((c) => c.id === productId);
}

export function qtySlug(format: QtyFormat, qty: number): string {
    return `${format.key}-${qty}-buc`;
}

export function qtyUrl(product: QtyProduct, format: QtyFormat, qty: number): string {
    return `/preturi/${product.slug}/${qtySlug(format, qty)}`;
}

export function parseQtySlug(product: QtyProduct, slug: string): { format: QtyFormat; qty: number } | null {
    const m = /^(.+)-(\d+)-buc$/.exec(String(slug || ""));
    if (!m) return null;
    const format = product.formats.find((f) => f.key === m[1]);
    const qty = parseInt(m[2], 10);
    if (!format || !product.quantities.includes(qty)) return null;
    return { format, qty };
}

export type QtyPricing = {
    variants: Array<{ key: string; label: string; note?: string; recommended?: boolean; total: number; unit: number }>;
    recommended: { key: string; label: string; total: number; unit: number };
    /** prețul pe bucată al variantei recomandate la fiecare cantitate din listă */
    ladder: Array<{ qty: number; total: number; unit: number }>;
};

export function getQtyPricing(product: QtyProduct, format: QtyFormat, qty: number): QtyPricing | null {
    const variants = product.variants
        .map((v) => {
            const total = roundMoney(v.total(format, qty));
            return { key: v.key, label: v.label, note: v.note, recommended: v.recommended, total, unit: roundMoney(total / qty) };
        })
        .filter((v) => v.total > 0);
    if (variants.length === 0) return null;
    const rec = variants.find((v) => v.recommended) ?? variants[0];
    const recDef = product.variants.find((v) => v.key === rec.key)!;
    const ladder = product.quantities.map((q) => {
        const total = roundMoney(recDef.total(format, q));
        return { qty: q, total, unit: roundMoney(total / q) };
    }).filter((r) => r.total > 0);
    return { variants, recommended: rec, ladder };
}

export function getAllQtyEntries(): Array<{ product: QtyProduct; format: QtyFormat; qty: number }> {
    const out: Array<{ product: QtyProduct; format: QtyFormat; qty: number }> = [];
    for (const p of QTY_PRODUCTS) {
        for (const f of p.formats) {
            for (const q of p.quantities) {
                if (getQtyPricing(p, f, q)) out.push({ product: p, format: f, qty: q });
            }
        }
    }
    return out;
}
