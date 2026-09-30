// Familiile din catalog care primesc pagini pe localități: /judet/{judet}/{localitate}/{familie}.
// Pagini pe familie (nu pe fiecare din cele ~550 de produse): o pagină utilă per localitate și
// tip de produs, cu produsele și prețurile reale ale familiei, fără sute de mii de pagini aproape identice.
// Fișierul nu importă data.json, ca să poată fi folosit și în sitemap-ul index fără cost.

import type { CatalogCategorySlug } from "./types";
import { siteConfig } from "@/lib/siteConfig";

export interface CatalogFamily {
  slug: string;
  /** Denumire la plural, pentru titluri: „X-bannere în Cluj-Napoca”. */
  name: string;
  category: CatalogCategorySlug;
  /** Grupele din data.json (câmpul `group`) care intră în familie. */
  groups: string[];
  /** Ce este și la ce folosește, fără date inventate (vine din descrierile produselor). */
  about: string;
  /** Cine cumpără de obicei; se combină cu profilul județului. */
  buyers: string[];
  /** Precizare importantă pentru client, afișată și în FAQ. */
  note?: string;
}

const ALL_FAMILIES: CatalogFamily[] = [
  {
    slug: "x-banner",
    name: "X-bannere",
    category: "sisteme-de-afisaj",
    groups: ["X-bannere"],
    about: "X-bannerul este un stativ ușor, cu brațe în formă de X care întind un banner cu capse. Se montează și se strânge în câteva secunde și se transportă în geantă.",
    buyers: ["magazine și showroom-uri", "organizatori de evenimente", "firme care participă la târguri", "școli și instituții"],
    note: "Stativul se vinde fără banner; bannerul cu capse se comandă separat din configuratorul de banner.",
  },
  {
    slug: "pop-up-textil",
    name: "Pereți pop-up textili",
    category: "sisteme-de-afisaj",
    groups: ["Pereți pop-up textili", "Green screen"],
    about: "Peretele pop-up textil are un sistem din aluminiu peste care se trage o husă textilă imprimată, pe o față sau pe ambele. Există variante drepte, curbe și green screen, în lungimi de la 2 la 10 m.",
    buyers: ["expozanți la târguri", "organizatori de conferințe", "studiouri foto și video", "branduri care fac lansări"],
  },
  {
    slug: "people-stopper",
    name: "People stopper",
    category: "sisteme-de-afisaj",
    groups: ["People stopper"],
    about: "People stopper-ul este un panou stradal cu ramă pentru afișe, așezat pe trotuar sau în fața intrării, care se schimbă rapid ca o ramă click.",
    buyers: ["restaurante și cafenele", "magazine de cartier", "agenții imobiliare", "saloane și clinici"],
    note: "Rama se vinde fără afiș; afișul se comandă separat din configuratorul de afișe.",
  },
  {
    slug: "steaguri-beachflag",
    name: "Steaguri beachflag",
    category: "steaguri-si-drapele",
    groups: ["Steaguri beachflag"],
    about: "Steagul beachflag, în formă de lacrimă sau de pană, vine cu sistemul din aluminiu, printul personalizat, baza în cruce și colacul pentru apă, în mai multe mărimi.",
    buyers: ["benzinării și spălătorii auto", "dealeri auto", "organizatori de evenimente sportive", "magazine cu parcare proprie"],
  },
  {
    slug: "corturi-personalizate",
    name: "Corturi personalizate",
    category: "sisteme-de-afisaj",
    groups: ["Corturi personalizate"],
    about: "Cortul publicitar pliabil se imprimă cu grafica ta și se folosește la evenimente în aer liber, târguri și promoții, în dimensiunile 3 x 3, 3 x 4 și 3 x 6 m.",
    buyers: ["organizatori de festivaluri", "producători la târguri și piețe", "echipe de promoții", "cluburi sportive"],
  },
  {
    slug: "casete-luminoase",
    name: "Casete luminoase",
    category: "sisteme-de-afisaj",
    groups: ["Casete luminoase"],
    about: "Caseta luminoasă textilă are iluminare LED și print textil pe ambele fețe, care se schimbă ușor datorită prinderii cu bandă de silicon.",
    buyers: ["standuri de expoziție", "showroom-uri", "centre comerciale", "recepții de hoteluri și birouri"],
  },
  {
    slug: "desk-promotional",
    name: "Desk-uri promoționale",
    category: "sisteme-de-afisaj",
    groups: ["Desk-uri de prezentare"],
    about: "Desk-ul pliabil de prezentare are grafică textilă iluminată cu LED și se asamblează rapid, fără unelte, pentru recepții și standuri.",
    buyers: ["expozanți la târguri", "echipe de sampling", "recepții de evenimente", "lansări de produs"],
  },
  {
    slug: "drapele",
    name: "Drapele",
    category: "steaguri-si-drapele",
    groups: ["Europa", "America", "Asia", "Africa", "Oceania", "Antarctica și teritorii"],
    about: "Drapelele sunt din poliester 100%, imprimate prin sublimare și cusute pe margini, în mărimi de la 15 x 21 cm la 200 x 300 cm, cu tiv pentru lance, carabine sau capse.",
    buyers: ["primării și instituții publice", "școli", "ambasade și firme cu parteneri străini", "cluburi sportive și suporteri"],
  },
  {
    slug: "rame-click",
    name: "Rame click",
    category: "rame-si-suporturi",
    groups: ["Rame click", "Rame click suspendate", "Rame magnetice"],
    about: "Ramele click și ramele magnetice țin afișe în format A și B, pe perete sau suspendate, iar afișul se schimbă fără să dai rama jos.",
    buyers: ["magazine și vitrine", "clinici și farmacii", "școli și instituții", "clădiri de birouri"],
  },
  {
    slug: "suporturi-pliante",
    name: "Suporturi pentru pliante și meniuri",
    category: "rame-si-suporturi",
    groups: ["Suporturi broșuri", "Standuri meniu și info", "Suporturi plexiglas"],
    about: "Suporturile pentru broșuri, standurile de meniu și suporturile de plexiglas țin la vedere pliante, meniuri și prețuri, pe tejghea sau pe podea.",
    buyers: ["restaurante și hoteluri", "recepții", "agenții de turism", "cabinete medicale"],
  },
  {
    slug: "panouri-de-santier",
    name: "Panouri de șantier",
    category: "panouri-si-semnalizare",
    groups: ["Panouri de șantier"],
    about: "Panoul de șantier și panoul PNRR se tipăresc cu datele proiectului tău, pe PVC de 3 sau 5 mm ori pe alucobond de 3 mm, în mai multe dimensiuni.",
    buyers: ["constructori", "beneficiari de autorizații de construire", "primării cu proiecte finanțate", "firme cu proiecte PNRR"],
  },
  {
    slug: "agende-personalizate",
    name: "Agende și notebook-uri",
    category: "papetarie-si-birou",
    groups: ["Agende", "Notebook-uri"],
    about: "Agendele A4 și A5 și notebook-urile A5 vin în mai multe culori, iar agendele pot fi personalizate cu logo prin imprimare UV color.",
    buyers: ["firme care fac cadouri de sfârșit de an", "organizatori de conferințe", "școli și universități", "echipe de vânzări"],
  },
  {
    slug: "blocnotes-personalizate",
    name: "Blocnotesuri personalizate",
    category: "papetarie-si-birou",
    groups: ["Blocnotesuri"],
    about: "Blocnotesul personalizat are copertă tipărită color, 30 de file de 80 g/m², în format A5 sau A4, cu interior netipărit, alb-negru sau color. Comanda minimă e de 10 bucăți.",
    buyers: ["hoteluri și săli de conferință", "firme pentru birou și evenimente", "agenții de marketing", "cabinete și clinici"],
  },
  {
    slug: "coli-cu-antet",
    name: "Coli cu antet",
    category: "papetarie-si-birou",
    groups: ["Coli cu antet"],
    about: "Colile cu antet se tipăresc pe hârtie de 80 g/m², în policromie, cu opțiune de culoare specială sau timbru sec, de la 500 de bucăți.",
    buyers: ["firme și cabinete de avocatură", "notariate și contabili", "instituții publice", "ONG-uri"],
  },
  {
    slug: "printare-documente",
    name: "Printare documente A4 și A3",
    category: "papetarie-si-birou",
    groups: ["Printare A4 / A3"],
    about: "Printăm documente A4, A3 și A3+, color sau alb-negru, pe o față sau față-verso, pe hârtie de la 80 la 300 g/m² sau pe autocolant, cu reducere de la 200 de bucăți.",
    buyers: ["studenți și profesori", "firme pentru materiale de lucru", "organizatori de cursuri", "asociații"],
  },
  {
    slug: "banner-backlit",
    name: "Banner backlit și filme pentru casete",
    category: "materiale-print",
    groups: ["Bannere și filme backlit"],
    about: "Bannerul backlit, filmul backlit și filmul blockout se folosesc în casete și panouri iluminate din spate. Prețul se calculează pe metru pătrat, după dimensiunile tale.",
    buyers: ["firme de reclame", "magazine cu casete luminoase", "benzinării", "centre comerciale"],
  },
  {
    slug: "mochete-si-presuri",
    name: "Mochete și preșuri personalizate",
    category: "materiale-print",
    groups: ["Mochete și preșuri"],
    about: "Mocheta și preșurile se imprimă prin sublimare, în policromie, cu logo sau mesaj. Mocheta se vinde la metru pătrat, iar preșurile în trei mărimi.",
    buyers: ["magazine și showroom-uri", "hoteluri", "standuri de expoziție", "birouri cu recepție"],
  },
  {
    slug: "perne-decorative",
    name: "Perne decorative",
    category: "decor-pentru-casa",
    groups: ["Perne decorative"],
    about: "Pernele decorative au modele imprimate gata create, de la acuarele la motive grafice, potrivite pentru canapea, dormitor sau ca idee de cadou.",
    buyers: ["cei care își renovează casa", "cafenele și pensiuni", "cumpărători de cadouri", "birouri cu zone de relaxare"],
  },
  {
    slug: "placute-braille",
    name: "Plăcuțe indicatoare Braille",
    category: "panouri-si-semnalizare",
    groups: ["Plăcuțe Braille"],
    about: "Plăcuțele Braille indică toaletele, lifturile, scările și ieșirile, pentru persoanele cu deficiențe de vedere.",
    buyers: ["instituții publice", "clădiri de birouri", "hoteluri și restaurante", "școli și spitale"],
  },
];

// Ce familii primesc pagini pe localități pe fiecare site, după profilul lui. Produsele rămân
// toate în /produse pe toate site-urile; doar paginile locale diferă, ca site-urile să nu
// publice aceleași ~250.000 de pagini.
const SITE_FAMILIES: Record<string, string[]> = {
  AdBanner: ["x-banner", "pop-up-textil", "people-stopper", "steaguri-beachflag", "corturi-personalizate", "casete-luminoase", "banner-backlit", "panouri-de-santier", "drapele"],
  EuPrint: ["panouri-de-santier", "placute-braille", "coli-cu-antet", "printare-documente", "agende-personalizate", "blocnotes-personalizate", "drapele", "rame-click", "suporturi-pliante"],
  HomePrint: ["perne-decorative", "mochete-si-presuri", "casete-luminoase"],
  Prynt: ["agende-personalizate", "blocnotes-personalizate", "coli-cu-antet", "printare-documente", "desk-promotional", "steaguri-beachflag", "corturi-personalizate", "perne-decorative"],
  ShopPrint: ALL_FAMILIES.map((f) => f.slug),
  Tablou: ["perne-decorative", "casete-luminoase", "rame-click"],
};

const siteSlugs = new Set(SITE_FAMILIES[siteConfig.name] ?? ALL_FAMILIES.map((f) => f.slug));
export const CATALOG_FAMILIES: CatalogFamily[] = ALL_FAMILIES.filter((f) => siteSlugs.has(f.slug));

const BY_SLUG = new Map(CATALOG_FAMILIES.map((f) => [f.slug, f]));

export function getCatalogFamily(slug: string | undefined): CatalogFamily | undefined {
  return slug ? BY_SLUG.get(slug) : undefined;
}
