export type Localitate = {
    name: string;
    slug: string;
};

export type Judet = {
    name: string;
    slug: string;
    localitati: Localitate[];
};

let _fullData: Judet[] | null = null;

function getFullData(): Judet[] {
    if (!_fullData) {
        // Lazy load to hide from Turbopack static tracing
        const roLocalitati = require('./seo/ro_localitati.json');
        _fullData = roLocalitati as Judet[];
    }
    return _fullData;
}

export const JUDETE_FULL_DATA: Judet[] = getFullData();

export function getJudetBySlug(judetSlug: string): Judet | undefined {
    return JUDETE_FULL_DATA.find((j) => j.slug === judetSlug);
}

export function getLocalitateBySlug(judetSlug: string, locSlug: string): Localitate | undefined {
    const judet = getJudetBySlug(judetSlug);
    if (!judet) return undefined;
    return judet.localitati.find((l) => l.slug === locSlug);
}

export function getAllJudeteSlugs(): string[] {
    return JUDETE_FULL_DATA.map((j) => j.slug);
}

export function getAllLocalitatiForJudet(judetSlug: string): Localitate[] {
    const judet = getJudetBySlug(judetSlug);
    return judet?.localitati || [];
}
