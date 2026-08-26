/**
 * Curated, commercially-relevant towns per judet (municipii/orase).
 * Only these locality pages are submitted to Google and left indexable — the
 * remaining ~13,000 villages stay live and linkable for users, but are marked
 * noindex so Google stops treating near-identical variants as index candidates.
 * Kept in sync with app/server-sitemap/[id]/route.ts.
 */
export const INDEXABLE_LOCALITY_SLUGS: Record<string, string[]> = {
    alba: ['alba-iulia', 'sebes', 'aiud', 'blaj', 'cugir', 'campeni', 'ocna-mures'],
    arad: ['arad', 'ineu', 'lipova', 'chisineu-cris', 'santana'],
    arges: ['pitesti', 'curtea-de-arges', 'campulung', 'mioveni', 'topoloveni'],
    bacau: ['bacau', 'onesti', 'moinesti', 'comanesti', 'buhusi', 'targu-ocna'],
    bihor: ['oradea', 'salonta', 'marghita', 'beius', 'alesd'],
    'bistrita-nasaud': ['bistrita', 'beclean', 'nasaud'],
    botosani: ['botosani', 'dorohoi', 'saveni'],
    braila: ['braila', 'ianca', 'insuratei'],
    brasov: ['brasov', 'fagaras', 'sacele', 'codlea', 'zarnesti', 'rupea', 'predeal'],
    bucuresti: ['bucuresti', 'sector-1', 'sector-2', 'sector-3', 'sector-4', 'sector-5', 'sector-6'],
    buzau: ['buzau', 'ramnicu-sarat', 'nehoiu', 'pogoanele'],
    calarasi: ['calarasi', 'oltenita', 'budesti'],
    'caras-severin': ['resita', 'caransebes', 'oravita', 'bocsa', 'otelu-rosu'],
    cluj: ['cluj-napoca', 'turda', 'dej', 'campia-turzii', 'gherla', 'huedin'],
    constanta: ['constanta', 'medgidia', 'mangalia', 'navodari', 'cernavoda', 'techirghiol', 'eforie-nord', 'ovidiu', 'murfatlar'],
    covasna: ['sfantu-gheorghe', 'targu-secuiesc', 'covasna', 'baraolt'],
    dambovita: ['targoviste', 'moreni', 'pucioasa', 'gaesti', 'titu'],
    dolj: ['craiova', 'bailesti', 'calafat', 'filiasi', 'segarcea'],
    galati: ['galati', 'tecuci', 'targu-bujor'],
    giurgiu: ['giurgiu', 'bolintin-vale'],
    gorj: ['targu-jiu', 'motru', 'rovinari', 'targu-carbunesti', 'bumbesti-jiu'],
    harghita: ['miercurea-ciuc', 'odorheiu-secuiesc', 'gheorgheni', 'toplita', 'cristuru-secuiesc'],
    hunedoara: ['deva', 'hunedoara', 'petrosani', 'orastie', 'brad', 'vulcan', 'lupeni', 'simeria', 'calan', 'hateg'],
    ialomita: ['slobozia', 'fetesti', 'urziceni', 'tandarei'],
    iasi: ['iasi', 'pascani', 'harlau', 'targu-frumos'],
    ilfov: ['voluntari', 'buftea', 'otopeni', 'pantelimon', 'bragadiru', 'popesti-leordeni', 'chitila', 'magurele', 'chiajna'],
    maramures: ['baia-mare', 'sighetu-marmatiei', 'borsa', 'viseu-de-sus', 'targu-lapus'],
    mehedinti: ['drobeta-turnu-severin', 'orsova', 'strehaia'],
    mures: ['targu-mures', 'reghin', 'sighisoara', 'tarnaveni', 'ludus', 'sovata'],
    neamt: ['piatra-neamt', 'roman', 'targu-neamt', 'bicaz'],
    olt: ['slatina', 'caracal', 'bals', 'corabia', 'draganesti-olt'],
    prahova: ['ploiesti', 'campina', 'sinaia', 'busteni', 'comarnic', 'mizil', 'baicoi', 'valenii-de-munte'],
    salaj: ['zalau', 'jibou', 'simleu-silvaniei', 'cehu-silvaniei'],
    'satu-mare': ['satu-mare', 'carei', 'negresti-oas', 'tasnad'],
    sibiu: ['sibiu', 'medias', 'cisnadie', 'avrig', 'agnita', 'copsa-mica'],
    suceava: ['suceava', 'falticeni', 'radauti', 'campulung-moldovenesc', 'vatra-dornei', 'gura-humorului', 'siret'],
    teleorman: ['alexandria', 'rosiori-de-vede', 'turnu-magurele', 'zimnicea'],
    timis: ['timisoara', 'lugoj', 'sannicolau-mare', 'jimbolia', 'buzias', 'faget'],
    tulcea: ['tulcea', 'macin', 'babadag', 'isaccea'],
    valcea: ['ramnicu-valcea', 'dragasani', 'horezu', 'babeni'],
    vaslui: ['vaslui', 'barlad', 'husi', 'negresti'],
    vrancea: ['focsani', 'adjud', 'panciu', 'odobesti'],
};

/** True when a judet/locality pair is one of the curated, indexable towns. */
export function isIndexableLocality(judetSlug: string, localitateSlug: string): boolean {
    const list = INDEXABLE_LOCALITY_SLUGS[String(judetSlug || "").toLowerCase()];
    return Array.isArray(list) && list.includes(String(localitateSlug || "").toLowerCase());
}
