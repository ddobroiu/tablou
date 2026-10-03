/**
 * Specializarea celor 6 site-uri de print: care site e „acasă” pentru fiecare
 * familie de produse.
 *
 * FIȘIER IDENTIC ÎN TOATE CELE 6 REPO-URI (shopprint, prynt, euprint, homeprint,
 * adbanner, tablou). Dacă îl schimbi, copiază-l identic peste tot; site-ul curent
 * se deduce din siteConfig.url, nu dintr-o constantă locală.
 *
 * De ce: aceeași pagină /judet/{judet}/{localitate}/{produs} există pe toate cele
 * 6 site-uri, cu același șablon. Google vede ~300.000 de pagini aproape identice
 * pe fiecare domeniu și indexează doar câteva sute. Fiecare familie de produse are
 * acum un singur site „acasă”; pe celelalte 5 site-uri pagina rămâne live și
 * legată intern, dar rel=canonical trimite la aceeași cale de pe site-ul acasă.
 *
 * Regula de canonical (vezi localProductCanonical):
 *  - produsul se recunoaște (slug scurt din CONFIGURATORS_REGISTRY sau aliasul
 *    lui /configurator/...), fără segment de variantă → canonical = site-ul acasă
 *    + calea scurtă /judet/{judet}/{localitate}/{cheie}. Calea există pe toate
 *    site-urile (registrul de configuratoare și lista de localități sunt identice
 *    în cele 6 repo-uri) și are același conținut (același șablon, același motor
 *    de preț), deci e o canonicalizare între pagini echivalente.
 *  - orice altceva (produse necunoscute, variante /banner/frontlit, campanii SEO)
 *    → canonical pe sine, ca înainte.
 *
 * Aceeași hartă decide și paginile de dimensiune standard (/dimensiuni/{produs}/{L}x{H}).
 *
 * Alegerea site-ului acasă (confirmată din siteConfig.headerNav / descrierea fiecărui site):
 *  - adbanner.ro  „Bannere, mesh și folii pentru publicitate outdoor” → banner,
 *    banner-verso, mesh, rollup, window-graphics
 *  - tablou.net   „tablouri canvas din fotografiile tale” → canvas
 *  - homeprint.ro „fototapet personalizat, tablouri canvas, postere” → tapet
 *    (canvas rămâne la tablou.net, care e construit doar pe canvas)
 *  - prynt.ro     „Textile & merch” + „Print mic” → afise, pliante, flayere,
 *    carti-vizita, tricouri, hanorace, sepci
 *  - euprint.ro   „Fonduri UE” + „Panouri & plăci” (PVC forex = panouri
 *    temporare, alucobond = plăci permanente) → fonduri-eu, pvc-forex, alucobond
 *  - shopprint.ro catalogul complet, „Panouri rigide” → autocolante, plexiglass,
 *    carton, polipropilena, semnalistica
 */

/**
 * OPRIT (decizie 30.09.2026, pe datele din Search Console 20-28.09): canonicalul
 * între site-uri ar fi mutat ~37% din clicurile organice de print (ex. „pliante
 * personalizate” e pe poziția 2 pe tablou.net și 70 pe prynt.ro, site-ul „acasă”).
 * Cât e false, fiecare site e canonical pe sine și își pune toate produsele în
 * sitemap. Harta PRODUCT_HOME rămâne pentru un test pe un singur produs.
 */
export const CROSS_SITE_CANONICAL = false;

export type SiteKey = "shopprint" | "prynt" | "euprint" | "homeprint" | "adbanner" | "tablou";

/** Originea canonică (https + www, fără slash final) a fiecărui site. */
export const SITE_ORIGINS: Record<SiteKey, string> = {
    shopprint: "https://www.shopprint.ro",
    prynt: "https://www.prynt.ro",
    euprint: "https://www.euprint.ro",
    homeprint: "https://www.homeprint.ro",
    adbanner: "https://www.adbanner.ro",
    tablou: "https://www.tablou.net",
};

/**
 * Cheia produsului (slug scurt din CONFIGURATORS_REGISTRY, plus „semnalistica”)
 * → site-ul acasă. Fiecare cheie are exact un site acasă.
 */
export const PRODUCT_HOME: Record<string, SiteKey> = {
    // outdoor → adbanner
    banner: "adbanner",
    "banner-verso": "adbanner",
    mesh: "adbanner",
    rollup: "adbanner",
    "window-graphics": "adbanner",
    // canvas → tablou
    canvas: "tablou",
    // decor interior → homeprint
    tapet: "homeprint",
    // print mic + textile → prynt
    afise: "prynt",
    pliante: "prynt",
    flayere: "prynt",
    "carti-vizita": "prynt",
    tricouri: "prynt",
    hanorace: "prynt",
    sepci: "prynt",
    // fonduri UE + panourile cerute de ele → euprint
    "fonduri-eu": "euprint",
    "pvc-forex": "euprint",
    alucobond: "euprint",
    // restul catalogului → shopprint
    autocolante: "shopprint",
    plexiglass: "shopprint",
    carton: "shopprint",
    polipropilena: "shopprint",
    semnalistica: "shopprint",
};

/** Toate cheile de produs care au pagină localitate × produs în sitemap (pe site-ul acasă). */
export const LOCAL_PRODUCT_KEYS: string[] = Object.keys(PRODUCT_HOME);

/**
 * Căile vechi (routeSlug din lib/products/configurator-products.ts) care duc la
 * același produs ca slug-ul scurt. Sitemap-ul vechi le publica pe acestea, iar
 * paginile se legau între ele cu slug-ul scurt: două URL-uri pentru aceeași pagină.
 */
const ALIASES: Record<string, string> = {
    "materiale/pvc-forex": "pvc-forex",
    "materiale/alucobond": "alucobond",
    "materiale/plexiglass": "plexiglass",
    "materiale/carton": "carton",
    "materiale/polipropilena": "polipropilena",
    "configurator/tablou-canvas": "canvas",
    "flyere": "flayere",
    "configurator/flyere": "flayere",
    "configurator/autocolant": "autocolante",
    "configurator/signage": "semnalistica",
    "configurator/banner": "banner",
    "configurator/banner-verso": "banner-verso",
    "configurator/mesh": "mesh",
    "configurator/autocolante": "autocolante",
    "configurator/canvas": "canvas",
    "configurator/afise": "afise",
    "configurator/pliante": "pliante",
    "configurator/flayere": "flayere",
    "configurator/rollup": "rollup",
    "configurator/tapet": "tapet",
    "configurator/window-graphics": "window-graphics",
    "configurator/semnalistica": "semnalistica",
    "configurator/fonduri-pnrr": "fonduri-eu",
    "configurator/fonduri-eu": "fonduri-eu",
    "configurator/materiale/pvc-forex": "pvc-forex",
    "configurator/materiale/carton": "carton",
    "configurator/materiale/plexiglass": "plexiglass",
    "configurator/materiale/alucobond": "alucobond",
    "configurator/materiale/polipropilena": "polipropilena",
    "configurator/tricouri": "tricouri",
    "configurator/hanorace": "hanorace",
    "configurator/sepci": "sepci",
    "configurator/carti-vizita": "carti-vizita",
};

function normOrigin(url: string | undefined | null): string {
    return String(url || "").trim().replace(/\/+$/, "").toLowerCase();
}

/** Site-ul curent, dedus din originea lui (siteConfig.url). */
export function siteKeyFromOrigin(origin: string | undefined | null): SiteKey | undefined {
    const o = normOrigin(origin).replace(/^https?:\/\//, "").replace(/^www\./, "");
    for (const [key, url] of Object.entries(SITE_ORIGINS) as Array<[SiteKey, string]>) {
        if (url.replace(/^https:\/\/www\./, "") === o) return key;
    }
    return undefined;
}

/**
 * Cheia produsului pentru segmentele de după localitate, sau undefined dacă
 * pagina nu e o pagină simplă localitate × produs (variantă, produs necunoscut).
 */
export function resolveLocalProductKey(productSlug: string[] | string): string | undefined {
    let path = (Array.isArray(productSlug) ? productSlug.join("/") : String(productSlug || ""))
        .toLowerCase()
        .replace(/^\/+|\/+$/g, "");
    if (!path) return undefined;
    const unprefixed = path.replace(/^configurator\//, "");
    const simple = unprefixed.replace(/\/(ieftin|pret|preturi|personalizat|personalizate)$/, "");
    if (PRODUCT_HOME[simple] || ALIASES[simple]) path = unprefixed;
    const withoutQualifier = path.replace(/\/(ieftin|pret|preturi|personalizat|personalizate)$/, "");
    if (PRODUCT_HOME[withoutQualifier] || ALIASES[withoutQualifier]) path = withoutQualifier;
    if (PRODUCT_HOME[path]) return path;
    return ALIASES[path];
}

export function homeSiteFor(productKey: string): SiteKey | undefined {
    return PRODUCT_HOME[productKey];
}

/** True când site-ul curent e acasă pentru produs. Produs necunoscut → false. */
export function isHomeSite(productKey: string, currentOrigin: string): boolean {
    const home = PRODUCT_HOME[productKey];
    if (!CROSS_SITE_CANONICAL) return !!home;
    return !!home && home === siteKeyFromOrigin(currentOrigin);
}

/** Calea scurtă, canonică, a unei pagini localitate × produs. */
export function localProductPath(judetSlug: string, locSlug: string, productKey: string): string {
    return `/judet/${judetSlug}/${locSlug}/${productKey}`;
}

/**
 * URL-ul canonical al unei pagini localitate × produs.
 * `self` = true când canonicalul e pe site-ul curent și pe calea cerută (pagina
 * e indexabilă aici și intră în sitemap).
 */
export function localProductCanonical(
    currentOrigin: string,
    judetSlug: string,
    locSlug: string,
    productSlug: string[] | string,
): { url: string; self: boolean } {
    const origin = normOrigin(currentOrigin);
    const requested = Array.isArray(productSlug) ? productSlug.join("/") : String(productSlug || "");
    const selfUrl = `${origin}/judet/${judetSlug}/${locSlug}/${requested}`;
    const key = resolveLocalProductKey(productSlug);
    if (!key) return { url: selfUrl, self: true };
    const home = CROSS_SITE_CANONICAL ? PRODUCT_HOME[key] : undefined;
    const homeOrigin = home ? SITE_ORIGINS[home] : origin;
    const url = `${homeOrigin}${localProductPath(judetSlug, locSlug, key)}`;
    return { url, self: url === selfUrl };
}

/** Cheile de produs pentru care site-ul curent e acasă (pentru sitemap). */
export function homeProductKeys(currentOrigin: string): string[] {
    if (!CROSS_SITE_CANONICAL) return LOCAL_PRODUCT_KEYS;
    const site = siteKeyFromOrigin(currentOrigin);
    return LOCAL_PRODUCT_KEYS.filter((k) => PRODUCT_HOME[k] === site);
}

/**
 * Canonical pentru o pagină de dimensiune (/dimensiuni/{produs}/{L}x{H}) pe care
 * o considerăm standard: site-ul acasă al produsului, aceeași cale.
 */
export function sizeCanonical(currentOrigin: string, productId: string, path: string): { url: string; self: boolean } {
    const origin = normOrigin(currentOrigin);
    const home = CROSS_SITE_CANONICAL ? PRODUCT_HOME[productId] : undefined;
    const homeOrigin = home ? SITE_ORIGINS[home] : origin;
    const url = `${homeOrigin}${path}`;
    return { url, self: url === `${origin}${path}` };
}
