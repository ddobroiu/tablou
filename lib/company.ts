import { TIKTOK_PIXEL_ID } from "./tiktok";

// Datele operatorului (comerciantului) și constantele legale ale site-ului.
// SINGURA sursă pentru identificarea firmei: subsol, contact, pagini legale, JSON-LD,
// checkout, PDF-uri. Aceleași date pe toate site-urile de print (aceeași firmă).
export const COMPANY = {
    legalName: "CULOAREA DIN VIAȚA SA S.R.L.",
    /** Pentru PDF-uri cu fonturi fără diacritice (Helvetica în @react-pdf). */
    legalNameAscii: "CULOAREA DIN VIATA SA S.R.L.",
    cui: "44820819",
    regCom: "J2021001108100",
    euid: "ROONRC.J2021001108100",
    address: {
        street: "Sat Topliceni nr. 214",
        locality: "Topliceni",
        commune: "Com. Topliceni",
        county: "Buzău",
        postalCode: "127630",
        country: "România",
        countryCode: "RO",
        full: "Sat Topliceni nr. 214, Com. Topliceni, jud. Buzău, 127630, România",
        fullAscii: "Sat Topliceni nr. 214, Com. Topliceni, jud. Buzau, 127630, Romania",
    },
    /** Firma NU este înregistrată în scopuri de TVA. */
    vatPayer: false,
    /** Înregistrată în sistemul național RO e-Factura. */
    eFactura: true,
} as const;

/** Adresa de e-mail de contact a site-ului curent (singurul canal oficial de contact). */
export const CONTACT_EMAIL = "contact@tablou.net";

/** Mențiunea de TVA care însoțește orice preț afișat. */
export const VAT_NOTE = "preț final; furnizorul nu este plătitor de TVA";
/** Aceeași mențiune, cu majusculă la început (pentru etichete și propoziții de sine stătătoare). */
export const VAT_NOTE_SENTENCE = "Preț final; furnizorul nu este plătitor de TVA.";
/** Pentru PDF-uri fără diacritice. */
export const VAT_NOTE_ASCII = "Pret final; furnizorul nu este platitor de TVA.";

/** Versiunea documentelor legale (Termeni, Confidențialitate, Cookies, Livrare și retur). */
export const LEGAL_VERSION = "2026-09-29";
export const LEGAL_EFFECTIVE_DATE = "29 septembrie 2026";

/** Link-uri legale folosite în subsol, checkout și în paginile legale. */
export const LEGAL_LINKS = [
    { href: "/termeni", label: "Termeni și condiții" },
    { href: "/politica-retur", label: "Livrare și retur" },
    { href: "/garantie-legala", label: "Garanția legală de conformitate" },
    { href: "/confidentialitate", label: "Politica de confidențialitate" },
    { href: "/politica-cookies", label: "Politica de cookies" },
    { href: "/formular-retragere", label: "Formular de retragere" },
    { href: "/retragere-contract", label: "Retragere online din contract" },
    { href: "/reclamatii", label: "Reclamații" },
] as const;

/** ANPC – Soluționarea Alternativă a Litigiilor (Ordinul ANPC nr. 449/2022). */
export const ANPC_SAL_URL = "https://anpc.ro/ce-este-sal/";

/** Nota din checkout despre excepția de la dreptul de retragere (art. 16 lit. c OUG 34/2014). */
export const PERSONALIZED_WITHDRAWAL_NOTE =
    "Produsele realizate după specificațiile tale (grafică, text, dimensiuni sau opțiuni alese de tine) sunt personalizate: pentru ele nu se aplică dreptul de retragere de 14 zile (art. 16 lit. c din OUG nr. 34/2014). Rămân valabile garanția legală de conformitate și dreptul de a reclama produsele neconforme.";

/**
 * Câmpurile de TVA pentru produsele trimise la Oblio.
 * Firma nu e plătitoare de TVA, așa că nu forțăm cota „Normala”: Oblio aplică regimul
 * setat pe firmă (fără TVA). OBLIO_VAT_NAME poate forța o cotă anume, dacă va fi nevoie.
 */
export function oblioVatFields(): { vatName?: string } {
    const forced = process.env.OBLIO_VAT_NAME?.trim();
    if (forced) return { vatName: forced };
    return COMPANY.vatPayer ? { vatName: "Normala" } : {};
}

/** Asistentul de chat AI afișat pe site (OpenAI); descris în politicile de confidențialitate și cookies. */
export const HAS_AI_CHAT = false;

/**
 * Scripturile de statistică și marketing ale site-ului. Se încarcă NUMAI după consimțământ
 * (vezi components/CookieConsent.tsx) și sunt descrise în Politica de cookies.
 */
export const TRACKING: {
    ga4Ids: string[];
    googleAdsIds: string[];
    gtmId?: string;
    metaPixelId?: string;
    tiktokPixelId?: string;
    /** Statistica proprie a site-urilor de print (www.shopprint.ro/t.js, cookie first-party _pt_vid). */
    siteAnalyticsSrc?: string;
} = {
    ga4Ids: ["G-NZ9X76TF43"],
    googleAdsIds: [],
    siteAnalyticsSrc: "https://www.shopprint.ro/t.js",
    tiktokPixelId: TIKTOK_PIXEL_ID,
};
