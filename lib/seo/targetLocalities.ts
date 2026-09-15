// Tablou.net locality strategy (agreed Sept 2026): ONE page set per județ
// reședință plus București and its six sectors - 48 localities, not the ~13k
// entries in lib/seo/ro_localitati.json and not the old ~220-town list. Each
// page carries real local content; the list is frozen so Google can settle on
// it. Do not widen it without a measured reason.
//
// Matching is by (județ slug, locality name) so a village that happens to share
// the reședință's name in another județ (Slobozia, Giurgiu, Suceava ...) is not
// pulled in. Ilfov has no reședință, so Voluntari (its largest oraș) stands in.
import { JUDETE_FULL_DATA, Judet, Localitate } from "@/lib/localitati";

export const TARGET_LOCALITIES: Array<{ judet: string; name: string }> = [
    { judet: "alba", name: "Alba Iulia" },
    { judet: "arad", name: "Arad" },
    { judet: "arges", name: "Pitești" },
    { judet: "bacau", name: "Bacău" },
    { judet: "bihor", name: "Oradea" },
    { judet: "bistrita-nasaud", name: "Bistrița" },
    { judet: "botosani", name: "Botoșani" },
    { judet: "braila", name: "Brăila" },
    { judet: "brasov", name: "Brașov" },
    { judet: "bucuresti", name: "București" },
    { judet: "buzau", name: "Buzău" },
    { judet: "calarasi", name: "Călărași" },
    { judet: "caras-severin", name: "Reșița" },
    { judet: "cluj", name: "Cluj-Napoca" },
    { judet: "constanta", name: "Constanța" },
    { judet: "covasna", name: "Sfântu Gheorghe" },
    { judet: "dambovita", name: "Târgoviște" },
    { judet: "dolj", name: "Craiova" },
    { judet: "galati", name: "Galați" },
    { judet: "giurgiu", name: "Giurgiu" },
    { judet: "gorj", name: "Târgu Jiu" },
    { judet: "harghita", name: "Miercurea Ciuc" },
    { judet: "hunedoara", name: "Deva" },
    { judet: "ialomita", name: "Slobozia" },
    { judet: "iasi", name: "Iași" },
    { judet: "ilfov", name: "Voluntari" },
    { judet: "maramures", name: "Baia Mare" },
    { judet: "mehedinti", name: "Drobeta-Turnu Severin" },
    { judet: "mures", name: "Târgu Mureș" },
    { judet: "neamt", name: "Piatra Neamț" },
    { judet: "olt", name: "Slatina" },
    { judet: "prahova", name: "Ploiești" },
    { judet: "salaj", name: "Zalău" },
    { judet: "satu-mare", name: "Satu Mare" },
    { judet: "sibiu", name: "Sibiu" },
    { judet: "suceava", name: "Suceava" },
    { judet: "teleorman", name: "Alexandria" },
    { judet: "timis", name: "Timișoara" },
    { judet: "tulcea", name: "Tulcea" },
    { judet: "valcea", name: "Râmnicu Vâlcea" },
    { judet: "vaslui", name: "Vaslui" },
    { judet: "vrancea", name: "Focșani" },
];

export function normalizeLocName(s: string): string {
    return (s || "")
        .toString()
        .normalize("NFD")
        .replace(new RegExp("[̀-ͯ]", "g"), "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
}

export type MatchedLocality = { judet: Judet; loc: Localitate };

let _cache: MatchedLocality[] | null = null;

/**
 * Resolves TARGET_LOCALITIES against JUDETE_FULL_DATA (case/diacritics-insensitive,
 * within the named județ only). For București the six sector entries are added
 * as separate landing pages. The reședință always comes first in its județ's
 * list, which lib/seo/localContent.ts relies on.
 */
export function getTargetLocalities(): MatchedLocality[] {
    if (_cache) return _cache;

    const result: MatchedLocality[] = [];

    for (const target of TARGET_LOCALITIES) {
        const judet = JUDETE_FULL_DATA.find((j) => j.slug === target.judet);
        if (!judet) continue;

        const wanted = normalizeLocName(target.name);
        const loc = judet.localitati.find((l) => normalizeLocName(l.name) === wanted);
        if (loc) result.push({ judet, loc });

        if (target.judet === "bucuresti") {
            for (const sector of judet.localitati) {
                if (/^sector[1-6]$/.test(normalizeLocName(sector.name))) {
                    result.push({ judet, loc: sector });
                }
            }
        }
    }

    _cache = result;
    return result;
}

/**
 * Curated localities for a single județ (by slug) - used to gate internal
 * links / page generation so pages only fan out to the sitemap-listed set,
 * not the full ro_localitati.json dataset for that județ.
 */
export function getTargetLocalitiesForJudet(judetSlug: string): MatchedLocality[] {
    return getTargetLocalities().filter((m) => m.judet.slug === judetSlug);
}
