import { CONFIGURATORS_REGISTRY } from "@/lib/configurators-registry";

/** Numele produsului așa cum apare în configurator ("Banner PVC (Frontlit)" -> "Banner PVC"). */
export function getProductDisplayName(candidates: Array<string | undefined>, fallback: string): string {
    for (const c of candidates) {
        if (!c) continue;
        const id = String(c).replace(/^configurator\//, "").replace(/^configurator-/, "");
        const cfg = CONFIGURATORS_REGISTRY.find((x) => x.id === id || x.slug === id);
        if (cfg?.name) {
            const clean = cfg.name.replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s+/g, " ").trim();
            if (clean) return clean;
        }
    }
    return (fallback || "").replace(/^Print\s+/i, "").trim();
}

/** Titlu meta pentru pagina produs × localitate, formulat diferit pe fiecare brand. */
export function localProductTitle(brand: string, productTitle: string, locName: string, fromText: string): string {
    switch (brand) {
        case "adbanner":
            return `${productTitle} în ${locName} – de la ${fromText}, printat în 2-4 zile`;
        case "anexa1":
            return `${productTitle} ${locName}: preț de la ${fromText}, producție 2-4 zile`;
        case "euprint":
            return `${productTitle} pentru ${locName} – de la ${fromText}, gata în 2-4 zile lucrătoare`;
        case "homeprint":
            return `${productTitle} în ${locName} – de la ${fromText}, comandă online`;
        case "prynt":
            return `${productTitle} ${locName} – preț de la ${fromText}, producție 2-4 zile`;
        case "tablou":
            return `${productTitle} livrat în ${locName} – de la ${fromText}, gata în 2-4 zile`;
        default:
            return `${productTitle} în ${locName} – de la ${fromText}, gata în 2-4 zile`;
    }
}
