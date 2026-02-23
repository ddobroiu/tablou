import roLocalitati from './seo/ro_localitati.json';

export type Localitate = {
    name: string;
    slug: string;
};

export type Judet = {
    name: string;
    slug: string;
    localitati: Localitate[];
};

export const JUDETE_FULL_DATA: Judet[] = roLocalitati as Judet[];

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
