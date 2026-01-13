// Flayere (Flyers) products - extracted from extraProducts.ts
// This file contains all flyer-related products

function slugify(input: string): string {
    let s = input.replace(/^Flayer\s+/i, "").trim();
    const map: Record<string, string> = {
        "ă": "a", "â": "a", "î": "i", "ș": "s", "ş": "s", "ț": "t", "ţ": "t",
        "Ă": "a", "Â": "a", "Î": "i", "Ș": "s", "Ş": "s", "Ț": "t", "Ţ": "t",
    };
    s = s.replace(/[ăâîșşțţĂÂÎȘŞȚŢ]/g, ch => map[ch] ?? ch);
    s = s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return s;
}

// Note: This is a starter list. Full list should be extracted from extraProducts.ts
const FLAYERE_LABELS: string[] = [
    "Flayer firmă",
    "Flayer promovare",
    "Flayer publicitar",
    "Flayer restaurant",
    "Flayer fast food",
    "Flayer cafenea",
    "Flayer salon înfrumusețare",
    "Flayer frizerie",
    "Flayer coafor",
    "Flayer service auto",
    "Flayer evenimente",
    "Flayer nuntă",
    "Flayer botez",
    "Flayer petrecere",
    "Flayer concert",
    "Flayer festival",
    "Flayer ofertă specială",
    "Flayer reducere",
    "Flayer promoție",
    "Flayer Black Friday",
];

export const FLAYERE_PRODUCTS: any[] = FLAYERE_LABELS.map((label) => {
    const clean = label.replace(/^Flayer\s+/i, "");
    const slug = slugify(clean);
    return {
        id: `flayere-${slug}`,
        slug,
        routeSlug: slug,
        title: label,
        description: `Flayer personalizat – ${clean}.`,
        priceBase: 50,
        currency: "RON",
        tags: ["flayere", "pliante"],
        metadata: { category: "flayere" },
    };
});
