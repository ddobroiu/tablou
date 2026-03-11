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

const DIACRITICS_OVERRIDE: Record<string, string> = {
    'CIUCSANGEORGIU': 'Ciucsângeorgiu',
    'BUCURESTI': 'București',
    'IASI': 'Iași',
    'CONSTANTA': 'Constanța',
    'GALATI': 'Galați',
    'TIMISOARA': 'Timișoara',
    'BRASOV': 'Brașov',
    'PLOIESTI': 'Ploiești',
    'BRAILA': 'Brăila',
    'ORADEA': 'Oradea',
    'BACAU': 'Bacău',
    'PITESTI': 'Pitești',
    'ARAD': 'Arad',
    'SIBIU': 'Sibiu',
    'TARGU MURES': 'Târgu Mureș',
    'BAIA MARE': 'Baia Mare',
    'BUZAU': 'Buzău',
    'BOTOSANI': 'Botoșani',
    'SATU MARE': 'Satu Mare',
    'RAMNICU VALCEA': 'Râmnicu Vâlcea',
    'DROBETA-TURNU SEVERIN': 'Drobeta-Turnu Severin',
    'SUCEAVA': 'Suceava',
    'PIATRA NEAMT': 'Piatra Neamț',
    'TARGU JIU': 'Târgu Jiu',
    'TARGOVISTE': 'Târgoviște',
    'FOCSANI': 'Focșani',
    'BISTRITA': 'Bistrița',
    'RESITA': 'Reșița',
    'TULCEA': 'Tulcea',
    'SLATINA': 'Slatina',
    'CALARASI': 'Călărași',
    'GIURGIU': 'Giurgiu',
    'ALBA IULIA': 'Alba Iulia',
    'DEVA': 'Deva',
    'HUNEDOARA': 'Hunedoara',
    'ZALAU': 'Zalău',
    'SFANTU GHEORGHE': 'Sfântu Gheorghe',
    'VASLUI': 'Vaslui',
    'SLOBOZIA': 'Slobozia',
    'ALEXANDRIA': 'Alexandria',
    'MIERCUREA CIUC': 'Miercurea Ciuc',
};

export function formatLocationName(name: string) {
    if (!name) return "";
    const upper = name.toUpperCase();
    if (DIACRITICS_OVERRIDE[upper]) return DIACRITICS_OVERRIDE[upper];

    if (name === upper) {
        return name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    return name;
}
