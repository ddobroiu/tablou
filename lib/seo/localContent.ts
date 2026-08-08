import { JudetProfile, getJudetProfile } from "./judetProfiles";

/**
 * Generator de conținut pentru paginile județ/localitate/produs, care înlocuiește
 * spintax-ul (rotație mecanică de cuvinte) cu text compus din date REALE care
 * variază de la o pagină la alta: profilul factual al județului (industrie
 * locală, geografie, reper), numele localității și produsul cerut. Variația nu
 * vine dintr-un pool de sinonime aleatorii, ci din combinarea unor fapte diferite
 * pentru fiecare combinație județ×localitate×produs.
 *
 * `brand` selectează setul de conectori (voce de brand, stabilită în Faza 3)
 * folosiți pentru a lega faptele într-o propoziție — nu schimbă faptele în sine.
 */

export type BrandKey = "shopprint" | "adbanner" | "euprint" | "prynt" | "tablou";

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
  /** conectori pentru propoziția principală (hero), cu placeholder-e {produs}/{localitate} */
  heroOpeners: string[];
  /** propoziție de închidere care menționează livrarea, adaptată pe tierLivrare */
  deliveryClosers: Record<"apropiat" | "mediu" | "distant", string>;
  /** prefix pentru meta description */
  descPrefix: string;
};

const BRAND_VOICES: Record<BrandKey, BrandVoice> = {
  shopprint: {
    heroOpeners: [
      "Realizăm {produs} pentru clienți din {localitate} și din tot județul {judet}, direct din producție proprie.",
      "ShopPrint livrează {produs} personalizat în {localitate} — configurare online, producție proprie, fără intermediari.",
      "Cei din {localitate} comandă {produs} direct la ShopPrint — configurator online și producție rapidă.",
    ],
    deliveryClosers: {
      apropiat: "Fiind aproape de hub-ul nostru de producție, livrarea în {localitate} durează de regulă doar 24h.",
      mediu: "Livrarea către {localitate} durează în medie 24-48h prin curier.",
      distant: "Chiar dacă {localitate} e mai departe de hub-ul nostru, livrarea prin curier ajunge de regulă în 48h.",
    },
    descPrefix: "Comandă",
  },
  adbanner: {
    heroOpeners: [
      "Afacerile din {localitate} aleg AdBanner pentru {produs} — comandă azi, gata rapid.",
      "Producem {produs} pentru clienți din {localitate} și din județul {judet}, cu focus pe publicitate outdoor.",
      "AdBanner echipează afacerile din {localitate} cu {produs} rezistent și vizibil de departe.",
    ],
    deliveryClosers: {
      apropiat: "Fiind aproape de producție, {produs} ajunge în {localitate} de regulă în 24h.",
      mediu: "Livrare prin curier în {localitate} în 24-48h, ca să nu pierzi timp de business.",
      distant: "Deși {localitate} e mai departe, ne organizăm să livrăm rapid, de regulă în 48h.",
    },
    descPrefix: "Comandă rapid",
  },
  euprint: {
    heroOpeners: [
      "Realizăm {produs} pentru clienți din {localitate}, inclusiv panouri conforme pentru proiecte cu finanțare europeană.",
      "EuPrint livrează {produs} în {localitate} și în tot județul {judet}, la preț accesibil.",
      "Clienții din {localitate} apelează la EuPrint pentru {produs} rapid și conform normelor.",
    ],
    deliveryClosers: {
      apropiat: "Livrare rapidă în {localitate}, de regulă în 24h.",
      mediu: "Livrăm în {localitate} în 24-48h prin curier.",
      distant: "Livrăm și în {localitate}, de regulă în 48h prin curier.",
    },
    descPrefix: "Comandă la preț accesibil",
  },
  prynt: {
    heroOpeners: [
      "Cei din {localitate} își transformă pozele în {produs} cu Prynt — cadou personalizat, print de calitate foto.",
      "Prynt realizează {produs} pentru clienți din {localitate} și din județul {judet}, din poza ta preferată.",
      "Comandă {produs} personalizat din {localitate} — Prynt printează exact ce ai imaginat.",
    ],
    deliveryClosers: {
      apropiat: "Livrăm în {localitate} de regulă în 24h, perfect pentru cadouri de ultim moment.",
      mediu: "Livrare în {localitate} în 24-48h prin curier.",
      distant: "Livrăm și în {localitate}, de regulă în 48h prin curier.",
    },
    descPrefix: "Transformă poza ta în",
  },
  tablou: {
    heroOpeners: [
      "Cei din {localitate} își transformă amintirile în {produs} cu Tablou — decor personalizat, print de calitate galerie.",
      "Tablou realizează {produs} pentru clienți din {localitate} și din județul {judet}, pornind chiar de la poza ta preferată.",
      "Comandă {produs} personalizat din {localitate} — Tablou printează exact amintirea pe care vrei să o păstrezi pe perete.",
    ],
    deliveryClosers: {
      apropiat: "Livrăm în {localitate} de regulă în 24h, perfect pentru un cadou de suflet pregătit din timp.",
      mediu: "Livrare în {localitate} în 24-48h prin curier, ambalat cu grijă.",
      distant: "Livrăm și în {localitate}, de regulă în 48h prin curier, ambalat cu grijă.",
    },
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

/** Alege o frază factuală despre județ, relevantă pentru tipul de produs. */
function pickFactualNote(judet: JudetProfile, judetName: string, productSlug: string): string {
  const isOutdoor = OUTDOOR_SENSITIVE_PRODUCTS.has(productSlug);
  if (isOutdoor) {
    return `În ${judet.regiune === "București" ? "București" : `județul ${judetName}`}, ${judet.notaGeografica}.`;
  }
  const industrie = judet.industrii[0];
  return `Zona e cunoscută pentru ${industrie}, iar ${judet.reper} e unul dintre reperele locale.`;
}

export type LocalContentInput = {
  brand: BrandKey;
  productTitle: string;
  productSlug: string;
  locName: string;
  judetSlug: string;
  judetName: string;
};

export type LocalContentOutput = {
  heroText: string;
  description: string;
};

export function buildLocalContent(input: LocalContentInput): LocalContentOutput {
  const { brand, productTitle, productSlug, locName, judetSlug, judetName } = input;
  const voice = BRAND_VOICES[brand];
  const judetProfile = getJudetProfile(judetSlug);

  const produsLower = productTitle.toLowerCase();
  const seedParts = [locName, productSlug];

  const opener = pickDeterministic(voice.heroOpeners, seedParts)
    .replace(/\{produs\}/g, produsLower)
    .replace(/\{localitate\}/g, locName)
    .replace(/\{judet\}/g, judetName);

  const tier = judetProfile?.tierLivrare ?? "mediu";
  const closer = voice.deliveryClosers[tier]
    .replace(/\{produs\}/g, produsLower)
    .replace(/\{localitate\}/g, locName);

  const factualNote = judetProfile
    ? pickFactualNote(judetProfile, judetName, productSlug)
    : "";

  const heroText = [opener, factualNote, closer].filter(Boolean).join(" ");

  const descriptionCore = judetProfile
    ? `${voice.descPrefix} ${produsLower} în ${locName} (${judetName}). ${judetProfile.notaGeografica.charAt(0).toUpperCase()}${judetProfile.notaGeografica.slice(1)}.`
    : `${voice.descPrefix} ${produsLower} în ${locName} (${judetName}). Producție proprie, livrare rapidă.`;

  const description = descriptionCore.length > 160
    ? `${descriptionCore.slice(0, 157)}...`
    : descriptionCore;

  return { heroText, description };
}
