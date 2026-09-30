import { JudetProfile, getJudetProfile } from "./judetProfiles";
import { getTargetLocalitiesForJudet } from "./targetLocalities";

/**
 * Generator de conținut pentru paginile județ/localitate/produs, care înlocuiește
 * spintax-ul (rotație mecanică de cuvinte) cu text compus din date REALE care
 * variază de la o pagină la alta: profilul factual al județului (industrie
 * locală, geografie, reper), numele localității și produsul cerut.
 *
 * FIȘIER IDENTIC ÎN TOATE CELE 6 REPO-URI.
 * Regulă: nimic inventat. Fără prezență locală („partener local”, „clienții din
 * X ne aleg”), fără producție „proprie”/„atelier propriu”, fără apropiere de un
 * atelier. Termenul real: 2-4 zile lucrătoare până la livrare, producție inclusă.
 *
 * `brand` selectează setul de conectori (voce de brand) folosiți pentru a lega
 * faptele într-o propoziție — nu schimbă faptele în sine.
 */

export type BrandKey = "shopprint" | "adbanner" | "euprint" | "prynt" | "homeprint" | "tablou";

/** Produse la care rezistența UV/vânt a materialului contează vizibil (outdoor). */
const OUTDOOR_SENSITIVE_PRODUCTS = new Set([
  "banner",
  "banner-verso",
  "mesh",
  "autocolante",
  "window-graphics",
  "rollup",
  "pvc-forex",
  "alucobond",
  "polipropilena",
  "plexiglass",
]);

type BrandVoice = {
  /** conectori pentru propoziția principală (hero), cu placeholder-e {produs}/{localitate}/{judet} */
  heroOpeners: string[];
  /** prefix pentru meta description */
  descPrefix: string;
};

/** O singură propoziție (paginile localitate extrag fraza din mijloc după „.”). */
const DELIVERY_CLOSER =
  "Comanda ajunge prin curier în {localitate} în 2-4 zile lucrătoare, producție inclusă.";

const BRAND_VOICES: Record<BrandKey, BrandVoice> = {
  shopprint: {
    heroOpeners: [
      "Comanzi {produs} online la ShopPrint, cu livrare prin curier în {localitate} și în tot județul {judet}.",
      "ShopPrint livrează {produs} personalizat în {localitate}: configurezi online și vezi prețul înainte de comandă.",
      "Pentru o adresă din {localitate}, {produs} se configurează online la ShopPrint, cu prețul calculat pe loc.",
    ],
    descPrefix: "Comandă",
  },
  adbanner: {
    heroOpeners: [
      "Comanzi {produs} de la AdBanner cu livrare în {localitate}, pentru publicitate și semnalistică de exterior.",
      "AdBanner livrează {produs} în {localitate} și în județul {judet}, cu focus pe publicitate outdoor.",
      "Configurezi {produs} online la AdBanner și îl primești prin curier în {localitate}.",
    ],
    descPrefix: "Comandă rapid",
  },
  homeprint: {
    heroOpeners: [
      "Comanzi {produs} pentru casă sau birou de la HomePrint, cu livrare prin curier în {localitate}.",
      "HomePrint livrează {produs} în {localitate} și în tot județul {judet}, cu prețul calculat online.",
      "Configurezi {produs} online la HomePrint și îl primești prin curier în {localitate}.",
    ],
    descPrefix: "Comandă",
  },
  euprint: {
    heroOpeners: [
      "Pentru beneficiarii de fonduri europene din {localitate} realizăm {produs} conform Manualului de Identitate Vizuală, alături de panourile, plăcile și autocolantele obligatorii ale proiectului.",
      "EuPrint livrează {produs} în {localitate} și în tot județul {judet}, cu bun de tipar verificat pe cerințele programului de finanțare.",
      "Pentru proiecte PNRR, Programul Regional sau AFIR din {localitate} poți comanda la EuPrint {produs}, alături de restul materialelor de vizibilitate.",
    ],
    descPrefix: "Pentru proiecte cu fonduri europene și nu numai, comandă",
  },
  prynt: {
    heroOpeners: [
      "Pentru echipe și firme din {localitate}, Prynt livrează {produs} în pachete de la 10 bucăți, cu preț calculat pe loc.",
      "Prynt livrează {produs} pentru firme, evenimente și festivaluri din {localitate} și din județul {judet}.",
      "Ai nevoie de {produs} pentru echipa sau evenimentul tău din {localitate}? Configurezi online, vezi prețul și comanzi în două minute.",
    ],
    descPrefix: "Comandă pentru echipa ta",
  },
  tablou: {
    heroOpeners: [
      "Îți transformi amintirile în {produs} cu Tablou, cu livrare prin curier în {localitate}.",
      "Tablou realizează {produs} pornind chiar de la poza ta preferată și îl livrează în {localitate}, județul {judet}.",
      "Comandă {produs} personalizat cu livrare în {localitate} — Tablou printează exact amintirea pe care vrei să o păstrezi pe perete.",
    ],
    descPrefix: "Transformă o amintire în",
  },
};

function pickDeterministic<T>(arr: T[], seedParts: string[]): T {
  const key = seedParts.join("|");
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return arr[hash % arr.length];
}

/** True doar pentru orașul reședință de județ (primul din lista curată) —
 *  Ilfov nu are reședință proprie (consiliul județean e în București), deci
 *  e exclus explicit ca să nu facem o afirmație greșită. */
function isJudetSeat(judetSlug: string, locSlug: string): boolean {
  if (!locSlug || judetSlug === "ilfov") return false;
  const list = getTargetLocalitiesForJudet(judetSlug);
  return list.length > 0 && list[0].loc.slug === locSlug;
}

/** Alege o frază factuală despre județ (nu despre localitate: profilul e pe
 *  județ, deci nu atribuim satului industria sau reperul județului). */
function pickFactualNote(judet: JudetProfile, judetName: string, productSlug: string, locSlug: string, locName: string): string {
  const isBuc = judet.regiune === "București";
  const isOutdoor = OUTDOOR_SENSITIVE_PRODUCTS.has(productSlug);
  if (isOutdoor) {
    return `În ${isBuc ? "București" : `județul ${judetName}`}, ${judet.notaGeografica}.`;
  }
  const industrie = pickDeterministic(judet.industrii, [locSlug, productSlug]);
  const area = isBuc ? "București" : `Județul ${judetName}`;
  if (isJudetSeat(judet.slug, locSlug)) {
    return `${locName} este reședința județului ${judetName}, județ cunoscut pentru ${industrie}; ${judet.reper} e unul dintre reperele sale.`;
  }
  return `${area} e cunoscut pentru ${industrie}, iar ${judet.reper} e unul dintre reperele sale.`;
}

export type LocalContentInput = {
  brand: BrandKey;
  productTitle: string;
  productSlug: string;
  locName: string;
  locSlug: string;
  judetSlug: string;
  judetName: string;
};

export type LocalContentOutput = {
  heroText: string;
  description: string;
};

export function buildLocalContent(input: LocalContentInput): LocalContentOutput {
  const { brand, productTitle, productSlug, locName, locSlug, judetSlug, judetName } = input;
  const voice = BRAND_VOICES[brand];
  const judetProfile = getJudetProfile(judetSlug);

  const produsLower = productTitle.toLowerCase();
  const seedParts = [locName, productSlug];

  const opener = pickDeterministic(voice.heroOpeners, seedParts)
    .replace(/\{produs\}/g, produsLower)
    .replace(/\{localitate\}/g, locName)
    .replace(/\{judet\}/g, judetName);

  const closer = DELIVERY_CLOSER.replace(/\{localitate\}/g, locName);

  const factualNote = judetProfile
    ? pickFactualNote(judetProfile, judetName, productSlug, locSlug, locName)
    : "";

  const heroText = [opener, factualNote, closer].filter(Boolean).join(" ");

  const descriptionCore = judetProfile
    ? `${voice.descPrefix} ${produsLower} în ${locName} (${judetName}). ${judetProfile.notaGeografica.charAt(0).toUpperCase()}${judetProfile.notaGeografica.slice(1)}.`
    : `${voice.descPrefix} ${produsLower} în ${locName} (${judetName}). Preț calculat online, livrare prin curier.`;

  const description = descriptionCore.length > 160
    ? `${descriptionCore.slice(0, 157)}...`
    : descriptionCore;

  return { heroText, description };
}
