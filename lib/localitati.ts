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

// Denumirile din ro_localitati.json sunt cu MAJUSCULE și fără diacritice.
// Le normalizăm o singură dată, la încărcare, ca să apară corect în titluri,
// H1, descrieri și date structurate ("Cluj-Napoca", nu "CLUJ-NAPOCA").
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
    'CLUJ-NAPOCA': 'Cluj-Napoca',
    'RAMNICU SARAT': 'Râmnicu Sărat',
    'TARGU SECUIESC': 'Târgu Secuiesc',
    'TARGU NEAMT': 'Târgu Neamț',
    'SIGHISOARA': 'Sighișoara',
    'MEDIAS': 'Mediaș',
    'FAGARAS': 'Făgăraș',
    'CAMPINA': 'Câmpina',
    'CAMPULUNG': 'Câmpulung',
    'CURTEA DE ARGES': 'Curtea de Argeș',
    'HUSI': 'Huși',
    'BARLAD': 'Bârlad',
    'PASCANI': 'Pașcani',
    'ROMAN': 'Roman',
    'ONESTI': 'Onești',
    'TURDA': 'Turda',
    'DEJ': 'Dej',
    'BISTRITA-NASAUD': 'Bistrița-Năsăud',
    'CARAS-SEVERIN': 'Caraș-Severin',
    'ARGES': 'Argeș',
    'DAMBOVITA': 'Dâmbovița',
    'IALOMITA': 'Ialomița',
    'MARAMURES': 'Maramureș',
    'MEHEDINTI': 'Mehedinți',
    'MURES': 'Mureș',
    'NEAMT': 'Neamț',
    'SALAJ': 'Sălaj',
    'TIMIS': 'Timiș',
    'VALCEA': 'Vâlcea',
};

// Particule care rămân cu literă mică în interiorul denumirii ("Bascenii de Jos").
const LOWER_PARTICLES = new Set(['de', 'din', 'la', 'pe', 'cu', 'sub', 'lui', 'al', 'si', 'sau']);

function capitalize(word: string): string {
    return word ? word.charAt(0).toUpperCase() + word.slice(1) : word;
}

export function formatLocationName(name: string): string {
    if (!name) return "";
    const upper = name.toUpperCase();
    if (DIACRITICS_OVERRIDE[upper]) return DIACRITICS_OVERRIDE[upper];
    if (name !== upper) return name; // deja scris corect
    return name
        .toLowerCase()
        .split(' ')
        .map((word, i) =>
            word
                .split('-')
                .map((part) => (i > 0 && LOWER_PARTICLES.has(part) ? part : capitalize(part)))
                .join('-')
        )
        .join(' ');
}

export const JUDETE_FULL_DATA: Judet[] = (roLocalitati as Judet[]).map((j) => ({
    name: formatLocationName(j.name),
    slug: j.slug,
    localitati: j.localitati.map((l) => ({ name: formatLocationName(l.name), slug: l.slug })),
}));

export function getJudete(): Judet[] {
    return JUDETE_FULL_DATA;
}

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
