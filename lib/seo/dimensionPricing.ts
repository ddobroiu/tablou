// Prețuri pentru paginile de dimensiune, calculate cu ACELAȘI motor ca
// configuratoarele (lib/pricing.ts), nu cu tabele separate care ar putea
// diverge. Fiecare produs are câteva variante uzuale (material / grosime /
// finisaj) și un set de cantități la care afișăm prețul.
import {
    calculateBannerPrice,
    calculateBannerVersoPrice,
    calculateAutocolantePrice,
    calculateCanvasPrice,
    calculateTapetPrice,
    calculateWindowGraphicsPrice,
    calculatePlexiglassPrice,
    calculatePVCForexPrice,
    calculateAlucobondPrice,
    calculateCartonPrice,
    calculatePolipropilenaPrice,
    calculatePosterPrice,
    calculateRollupPrice,
    calculatePliantePrice,
    calculateFlyerPrice,
    calculateBusinessCardPrice,
    roundMoney,
} from "@/lib/pricing";

export type PriceVariant = {
    key: string;
    label: string;
    note?: string;
    recommended?: boolean;
    /** Preț TOTAL pentru `qty` bucăți de w×h cm. */
    total: (w: number, h: number, qty: number) => number;
};

export type VariantPrices = {
    key: string;
    label: string;
    note?: string;
    recommended?: boolean;
    rows: Array<{ qty: number; total: number; unit: number }>;
};

export type DimensionPricing = {
    quantities: number[];
    variants: VariantPrices[];
    /** Cel mai mic preț unitar la cantitatea minimă, pe varianta recomandată. */
    fromPrice: number;
    /** Eticheta variantei recomandate. */
    fromLabel: string;
    /** Preț unitar pe varianta recomandată la fiecare cantitate. */
    recommended: VariantPrices;
    /** Suprafața unei bucăți, m². */
    sqmPerUnit: number;
};

const DEFAULT_QTY = [1, 2, 5, 10];

const QUANTITIES: Record<string, number[]> = {
    autocolante: [1, 5, 10, 25],
    "window-graphics": [1, 2, 5, 10],
    afise: [1, 10, 50, 100],
    rollup: [1, 2, 5, 10],
    pliante: [100, 500, 1000, 2500],
    flayere: [100, 500, 1000, 5000],
    "carti-vizita": [100, 200, 500, 1000],
};

function presetSizeKey(w: number, h: number): string | null {
    const map: Record<string, string> = {
        "30x42": "A3", "42x59": "A2", "59x84": "A1", "84x119": "A0", "70x100": "S5", "100x140": "S7",
        "21x30": "A4", "15x21": "A5", "11x15": "A6", "21x10": "21x10",
    };
    return map[`${w}x${h}`] ?? null;
}

export function getVariants(productId: string): PriceVariant[] {
    switch (productId) {
        case "banner":
            return [
                {
                    key: "frontlit-440", label: "Frontlit 440 g/m², fără finisaje", recommended: true,
                    total: (w, h, q) => calculateBannerPrice({ width_cm: w, height_cm: h, quantity: q, material: "frontlit_440", banner_type: "single", want_wind_holes: false, want_hem_and_grommets: false, designOption: "upload" }).finalPrice,
                },
                {
                    key: "frontlit-440-capse", label: "Frontlit 440 g/m², tiv și capse", note: "+10% față de varianta fără finisaje",
                    total: (w, h, q) => calculateBannerPrice({ width_cm: w, height_cm: h, quantity: q, material: "frontlit_440", banner_type: "single", want_wind_holes: false, want_hem_and_grommets: true, designOption: "upload" }).finalPrice,
                },
                {
                    key: "frontlit-510-capse", label: "Frontlit 510 g/m², tiv și capse", note: "material premium, 12-24 luni la exterior",
                    total: (w, h, q) => calculateBannerPrice({ width_cm: w, height_cm: h, quantity: q, material: "frontlit_510", banner_type: "single", want_wind_holes: false, want_hem_and_grommets: true, designOption: "upload" }).finalPrice,
                },
            ];
        case "banner-verso":
            return [
                {
                    key: "blockout-650", label: "Blockout 650 g/m², print față-verso, tiv și capse", recommended: true,
                    total: (w, h, q) => calculateBannerVersoPrice({ width_cm: w, height_cm: h, quantity: q, want_wind_holes: false, same_graphic: true, designOption: "upload" }).finalPrice,
                },
                {
                    key: "blockout-650-vant", label: "Blockout 650 g/m², cu găuri de vânt", note: "+10%",
                    total: (w, h, q) => calculateBannerVersoPrice({ width_cm: w, height_cm: h, quantity: q, want_wind_holes: true, same_graphic: true, designOption: "upload" }).finalPrice,
                },
            ];
        case "mesh":
            return [
                {
                    key: "mesh-370", label: "Mesh microperforat 370 g/m², tiv și capse", recommended: true,
                    total: (w, h, q) => calculateBannerPrice({ width_cm: w, height_cm: h, quantity: q, material: "mesh", banner_type: "single", want_wind_holes: false, want_hem_and_grommets: true, designOption: "upload" }).finalPrice,
                },
            ];
        case "autocolante":
            return [
                {
                    key: "oracal-3641", label: "Folie economică (Oracal 3641), print + cut", recommended: true,
                    total: (w, h, q) => calculateAutocolantePrice({ width_cm: w, height_cm: h, quantity: q, material: "oracal_3641", print_type: "print_cut", laminated: false, transfer_film: false, designOption: "upload" }).finalPrice,
                },
                {
                    key: "oracal-3641-laminat", label: "Folie economică, print + cut, laminată", note: "recomandat la exterior și pe podele",
                    total: (w, h, q) => calculateAutocolantePrice({ width_cm: w, height_cm: h, quantity: q, material: "oracal_3641", print_type: "print_cut", laminated: true, transfer_film: false, designOption: "upload" }).finalPrice,
                },
                {
                    key: "oracal-621", label: "Folie removabilă (Oracal 621)", note: "se dezlipește fără urme",
                    total: (w, h, q) => calculateAutocolantePrice({ width_cm: w, height_cm: h, quantity: q, material: "oracal_621", print_type: "print_cut", laminated: false, transfer_film: false, designOption: "upload" }).finalPrice,
                },
                {
                    key: "oracal-970", label: "Folie auto (Oracal 970)",
                    total: (w, h, q) => calculateAutocolantePrice({ width_cm: w, height_cm: h, quantity: q, material: "oracal_970", print_type: "print_cut", laminated: false, transfer_film: false, designOption: "upload" }).finalPrice,
                },
                {
                    key: "oracal-transparent", label: "Folie transparentă, pentru sticlă",
                    total: (w, h, q) => calculateAutocolantePrice({ width_cm: w, height_cm: h, quantity: q, material: "oracal_transparent", print_type: "print_cut", laminated: false, transfer_film: false, designOption: "upload" }).finalPrice,
                },
            ];
        case "canvas":
            return [
                {
                    key: "canvas-360", label: "Pânză canvas printată, fără șasiu (rulată)", note: "varianta cu șasiu, gata de agățat, are dimensiuni fixe în configurator", recommended: true,
                    total: (w, h, q) => calculateCanvasPrice({ width_cm: w, height_cm: h, quantity: q, edge_type: "mirror", designOption: "upload", frameType: "none" }).finalPrice,
                },
            ];
        case "tapet":
            return [
                {
                    key: "tapet-mat", label: "Tapet mat, fără adeziv", recommended: true,
                    total: (w, h, q) => calculateTapetPrice({ width_cm: w, height_cm: h, quantity: q, want_adhesive: false, designOption: "upload" }).finalPrice,
                },
                {
                    key: "tapet-adeziv", label: "Tapet autoadeziv repoziționabil", note: "+10%",
                    total: (w, h, q) => calculateTapetPrice({ width_cm: w, height_cm: h, quantity: q, want_adhesive: true, designOption: "upload" }).finalPrice,
                },
            ];
        case "window-graphics":
            return [
                {
                    key: "perforat-140", label: "Folie perforată PVC 140 µ (50/50), print + cut", recommended: true,
                    total: (w, h, q) => calculateWindowGraphicsPrice({ width_cm: w, height_cm: h, quantity: q, designOption: "upload", print_type: "print_cut", laminated: false }).finalPrice,
                },
                {
                    key: "perforat-140-laminat", label: "Folie perforată, laminată", note: "+10%",
                    total: (w, h, q) => calculateWindowGraphicsPrice({ width_cm: w, height_cm: h, quantity: q, designOption: "upload", print_type: "print_cut", laminated: true }).finalPrice,
                },
            ];
        case "plexiglass":
            return [
                {
                    key: "alb-3", label: "Plexiglas alb opac 3 mm, print UV", recommended: true,
                    total: (w, h, q) => calculatePlexiglassPrice({ width_cm: w, height_cm: h, quantity: q, material: "alb", thickness_mm: 3, print_double: false, designOption: "upload" }).finalPrice,
                },
                {
                    key: "transparent-3", label: "Plexiglas transparent 3 mm, print pe o față",
                    total: (w, h, q) => calculatePlexiglassPrice({ width_cm: w, height_cm: h, quantity: q, material: "transparent", thickness_mm: 3, print_double: false, designOption: "upload" }).finalPrice,
                },
                {
                    key: "transparent-5", label: "Plexiglas transparent 5 mm, print pe o față",
                    total: (w, h, q) => calculatePlexiglassPrice({ width_cm: w, height_cm: h, quantity: q, material: "transparent", thickness_mm: 5, print_double: false, designOption: "upload" }).finalPrice,
                },
            ];
        case "pvc-forex":
            return [
                { key: "forex-3", label: "PVC Forex 3 mm", recommended: true, total: (w, h, q) => calculatePVCForexPrice({ width_cm: w, height_cm: h, quantity: q, thickness_mm: 3, designOption: "upload" }).finalPrice },
                { key: "forex-5", label: "PVC Forex 5 mm", total: (w, h, q) => calculatePVCForexPrice({ width_cm: w, height_cm: h, quantity: q, thickness_mm: 5, designOption: "upload" }).finalPrice },
                { key: "forex-10", label: "PVC Forex 10 mm", total: (w, h, q) => calculatePVCForexPrice({ width_cm: w, height_cm: h, quantity: q, thickness_mm: 10, designOption: "upload" }).finalPrice },
            ];
        case "alucobond":
            return [
                { key: "alu-3", label: "Alucobond 3 mm, alb", recommended: true, total: (w, h, q) => calculateAlucobondPrice({ width_cm: w, height_cm: h, quantity: q, thickness_mm: 3, color: "Alb", designOption: "upload" }).finalPrice },
                { key: "alu-4", label: "Alucobond 4 mm, alb", total: (w, h, q) => calculateAlucobondPrice({ width_cm: w, height_cm: h, quantity: q, thickness_mm: 4, color: "Alb", designOption: "upload" }).finalPrice },
            ];
        case "carton":
            return [
                { key: "ondulat-e", label: "Carton ondulat micro-ondulă E, print pe o față", recommended: true, total: (w, h, q) => calculateCartonPrice({ width_cm: w, height_cm: h, quantity: q, material: "ondulat", ondula: "E", designOption: "upload" }).finalPrice },
                { key: "ondulat-3b", label: "Carton ondulat 3 mm (3B), print pe o față", total: (w, h, q) => calculateCartonPrice({ width_cm: w, height_cm: h, quantity: q, material: "ondulat", ondula: "3B", designOption: "upload" }).finalPrice },
                { key: "fagure-10", label: "Carton fagure (honeycomb) 10 mm", total: (w, h, q) => calculateCartonPrice({ width_cm: w, height_cm: h, quantity: q, material: "reciclat", reciclatBoard: "board10", designOption: "upload" }).finalPrice },
            ];
        case "polipropilena":
            return [
                { key: "pp-3", label: "Polipropilenă alveolară 3 mm", total: (w, h, q) => calculatePolipropilenaPrice({ width_cm: w, height_cm: h, quantity: q, thickness_mm: 3, designOption: "upload" }).finalPrice },
                { key: "pp-4", label: "Polipropilenă alveolară 4 mm", recommended: true, total: (w, h, q) => calculatePolipropilenaPrice({ width_cm: w, height_cm: h, quantity: q, thickness_mm: 4, designOption: "upload" }).finalPrice },
                { key: "pp-5", label: "Polipropilenă alveolară 5 mm", total: (w, h, q) => calculatePolipropilenaPrice({ width_cm: w, height_cm: h, quantity: q, thickness_mm: 5, designOption: "upload" }).finalPrice },
            ];
        case "afise":
            return [
                { key: "hartie-150", label: "Hârtie 150 g lucioasă", recommended: true, total: (w, h, q) => { const k = presetSizeKey(w, h); return k ? calculatePosterPrice({ size: k, material: "paper_150_lucioasa", quantity: q, designOption: "upload" }).finalPrice : 0; } },
                { key: "blueback-115", label: "Blueback 115 g (outdoor, opac pe spate)", total: (w, h, q) => { const k = presetSizeKey(w, h); return k ? calculatePosterPrice({ size: k, material: "blueback_115", quantity: q, designOption: "upload" }).finalPrice : 0; } },
                { key: "carton-300", label: "Carton 300 g lucios", total: (w, h, q) => { const k = presetSizeKey(w, h); return k ? calculatePosterPrice({ size: k, material: "paper_300_lucioasa", quantity: q, designOption: "upload" }).finalPrice : 0; } },
            ];
        case "rollup":
            return [
                { key: "rollup", label: "Sistem roll-up aluminiu + print Blueback 440 g, geantă inclusă", recommended: true, total: (w, _h, q) => calculateRollupPrice({ width_cm: w, quantity: q, designOption: "upload" }).finalPrice },
            ];
        case "pliante":
            return [
                { key: "135-simplu", label: "Hârtie 135 g, un big (pliere simplă)", recommended: true, total: (_w, _h, q) => calculatePliantePrice({ weight: "135", quantity: q, fold: "simplu", designOption: "upload" }).finalPrice },
                { key: "170-paralel", label: "Hârtie 170 g, trei biguri (pliere paralelă)", total: (_w, _h, q) => calculatePliantePrice({ weight: "170", quantity: q, fold: "paralel", designOption: "upload" }).finalPrice },
            ];
        case "flayere":
            return [
                { key: "135-fata", label: "Couché 135 g, print pe o față", recommended: true, total: (w, h, q) => { const k = presetSizeKey(w, h); return k ? calculateFlyerPrice({ sizeKey: k, quantity: q, twoSided: false, paperWeightKey: "135", designOption: "upload" }).finalPrice : 0; } },
                { key: "135-fata-verso", label: "Couché 135 g, față-verso", total: (w, h, q) => { const k = presetSizeKey(w, h); return k ? calculateFlyerPrice({ sizeKey: k, quantity: q, twoSided: true, paperWeightKey: "135", designOption: "upload" }).finalPrice : 0; } },
                { key: "250-fata-verso", label: "Carton 250 g, față-verso", total: (w, h, q) => { const k = presetSizeKey(w, h); return k ? calculateFlyerPrice({ sizeKey: k, quantity: q, twoSided: true, paperWeightKey: "250", designOption: "upload" }).finalPrice : 0; } },
            ];
        case "carti-vizita":
            return [
                { key: "standard", label: "Carton 350 g, print pe o față", recommended: true, total: (_w, _h, q) => calculateBusinessCardPrice({ type: "standard", quantity: q, twoSided: false, designOption: "upload" }).finalPrice },
                { key: "standard-fv", label: "Carton 350 g, față-verso", total: (_w, _h, q) => calculateBusinessCardPrice({ type: "standard", quantity: q, twoSided: true, designOption: "upload" }).finalPrice },
                { key: "plastic", label: "Plastic PVC 0,5 mm", total: (_w, _h, q) => calculateBusinessCardPrice({ type: "plastic", quantity: q, twoSided: false, designOption: "upload" }).finalPrice },
            ];
        default:
            return [];
    }
}

export function getDimensionPricing(productId: string, w: number, h: number): DimensionPricing | null {
    const variants = getVariants(productId);
    if (variants.length === 0) return null;
    const quantities = QUANTITIES[productId] ?? DEFAULT_QTY;

    const computed: VariantPrices[] = variants.map((v) => ({
        key: v.key,
        label: v.label,
        note: v.note,
        recommended: v.recommended,
        rows: quantities.map((qty) => {
            const total = roundMoney(v.total(w, h, qty));
            return { qty, total, unit: roundMoney(total / qty) };
        }),
    })).filter((v) => v.rows.every((r) => r.total > 0));

    if (computed.length === 0) return null;
    const recommended = computed.find((v) => v.recommended) ?? computed[0];
    return {
        quantities,
        variants: computed,
        fromPrice: recommended.rows[0].unit,
        fromLabel: recommended.label,
        recommended,
        sqmPerUnit: roundMoney((w / 100) * (h / 100)),
    };
}

export function formatLei(v: number): string {
    const rounded = Math.round(v * 100) / 100;
    const hasDecimals = Math.abs(rounded - Math.round(rounded)) > 0.004;
    return new Intl.NumberFormat("ro-RO", { minimumFractionDigits: hasDecimals ? 2 : 0, maximumFractionDigits: 2 }).format(rounded) + " lei";
}
