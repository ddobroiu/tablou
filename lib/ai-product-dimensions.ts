/** Dimensiuni cm pentru produse cu format preset (afișe, flyere etc.). */

export const AFISE_SIZE_CM: Record<string, { width: number; height: number }> = {
    A3: { width: 29.7, height: 42 },
    A2: { width: 42, height: 59.4 },
    A1: { width: 59.4, height: 84.1 },
    A0: { width: 84.1, height: 118.9 },
    S5: { width: 50, height: 70 },
    S7: { width: 70, height: 100 },
};

export function getAfiseDimensionsCm(size: string): { width: number; height: number } {
    return AFISE_SIZE_CM[size] ?? AFISE_SIZE_CM.A2;
}

export const FLYER_SIZE_CM: Record<string, { width: number; height: number }> = {
    A6: { width: 10.5, height: 14.8 },
    A5: { width: 14.8, height: 21 },
    A4: { width: 21, height: 29.7 },
    DL: { width: 21, height: 9.9 },
};

export function getFlyerDimensionsCm(sizeKey: string): { width: number; height: number } {
    return FLYER_SIZE_CM[sizeKey] ?? FLYER_SIZE_CM.A4;
}

export const PLIANTE_SIZE_CM = { width: 21, height: 29.7 };
export const CARTI_VIZITA_SIZE_CM = { width: 9, height: 5 };

/** Zonă maximă print DTF pe șapcă (panou frontal — nu dimensiunea obiectului). */
export const SEPCI_DTF_PRINT_ZONE_CM = { width: 12, height: 6 };

/** Zonă print față tricou (DTF). */
export const TRICOU_DTF_PRINT_ZONE_CM = { width: 28, height: 35 };

/** Zonă print față hanorac (DTF). */
export const HANORAC_DTF_PRINT_ZONE_CM = { width: 30, height: 38 };

export function getTextileAiPrintDimensionsCm(type: "tricouri" | "hanorace" | "sepci"): {
    width: number;
    height: number;
} {
    if (type === "sepci") return { ...SEPCI_DTF_PRINT_ZONE_CM };
    if (type === "hanorace") return { ...HANORAC_DTF_PRINT_ZONE_CM };
    return { ...TRICOU_DTF_PRINT_ZONE_CM };
}

export type AiDimensionsInput = {
    product?: string;
    productKind?: string;
    widthCm?: number;
    heightCm?: number;
    sizeKey?: string;
};

/**
 * Dimensiuni trimise la AI — zona de print, nu obiectul fizic întreg.
 * Dacă configuratorul trimite width/height reale, le folosim; altfel preset pe produs.
 */
export function resolveAiGraphicDimensionsCm(input: AiDimensionsInput): {
    width: number;
    height: number;
} {
    const w = Number(input.widthCm) || 0;
    const h = Number(input.heightCm) || 0;

    if (input.product === "sepci" || input.productKind === "sepci") {
        return getTextileAiPrintDimensionsCm("sepci");
    }
    if (input.product === "business-cards") {
        return { ...CARTI_VIZITA_SIZE_CM };
    }
    if (input.product === "flyere" && input.sizeKey) {
        return getFlyerDimensionsCm(input.sizeKey);
    }
    if (input.product === "afise" && input.sizeKey) {
        return getAfiseDimensionsCm(input.sizeKey);
    }
    if (input.product === "pliante") {
        return { ...PLIANTE_SIZE_CM };
    }
    if (input.product === "rollup" && w > 0) {
        return { width: w, height: 200 };
    }
    if (w > 0 && h > 0) {
        return { width: w, height: h };
    }

    return { width: 21, height: 29.7 };
}
