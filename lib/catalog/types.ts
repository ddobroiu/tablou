// Catalogul de produse gata definite (sisteme de afișaj, steaguri, rame, papetărie etc.).
// Datele stau în lib/catalog/data.json și se citesc doar pe server (lib/catalog/index.ts);
// fișierul de față e comun server/client: tipuri, categorii și calculul de preț.

export type CatalogKind = "variant" | "sqm" | "qty";
export type ArtworkNeed = "required" | "optional" | "none";

export interface CatalogOption {
  name: string;
  values: string[];
}

/** Variantă cu preț fix: `o` are câte o valoare pentru fiecare opțiune, în ordinea din `options`. */
export interface CatalogVariant {
  o: string[];
  p: number;
}

/** Material vândut pe m²: prețul pe m² depinde de suprafața totală a comenzii. */
export interface SqmMaterial {
  name: string;
  /** Praguri de suprafață totală (m²); `max: null` = fără limită. */
  bands: { max: number | null; price: number }[];
}

export interface SqmSpec {
  materials: SqmMaterial[];
  maxWidthCm?: number;
  maxHeightCm?: number;
}

/** Produs vândut pe bucată, cu preț unitar pe praguri de cantitate. */
export interface QtySpec {
  minQty: number;
  /** Cantitatea minimă de la care se aplică fiecare coloană de preț. */
  tiers: number[];
  /** Câte un rând pentru fiecare combinație de opțiuni; `null` = combinație indisponibilă. */
  rows: { o: string[]; p: (number | null)[] }[];
}

export interface CatalogProduct {
  slug: string;
  category: CatalogCategorySlug;
  /** Subgrupă pentru filtrare în listă (ex. continentul la drapele). */
  group?: string;
  title: string;
  short: string;
  description: string;
  specs: string[];
  images: string[];
  artwork: ArtworkNeed;
  kind: CatalogKind;
  priceFrom: number;
  /** Unitatea prețului afișat „de la”: buc, m², coală etc. */
  unit: string;
  options: CatalogOption[];
  variants?: CatalogVariant[];
  sqm?: SqmSpec;
  qty?: QtySpec;
}

export type CatalogCategorySlug =
  | "sisteme-de-afisaj"
  | "steaguri-si-drapele"
  | "materiale-print"
  | "rame-si-suporturi"
  | "papetarie-si-birou"
  | "promotionale"
  | "decor-pentru-casa"
  | "panouri-si-semnalizare";

export interface CatalogCategory {
  slug: CatalogCategorySlug;
  name: string;
  intro: string;
}

export const CATALOG_CATEGORIES: CatalogCategory[] = [
  {
    slug: "sisteme-de-afisaj",
    name: "Sisteme de afișaj",
    intro: "X-bannere, pereți pop-up textili, people stopper, corturi personalizate, casete luminoase și desk-uri de prezentare pentru târguri, evenimente și puncte de vânzare.",
  },
  {
    slug: "steaguri-si-drapele",
    name: "Steaguri și drapele",
    intro: "Steaguri beachflag cu grafica ta, drapele naționale pentru peste 270 de țări și teritorii și drapelul Uniunii Europene, în mai multe mărimi și variante de prindere.",
  },
  {
    slug: "materiale-print",
    name: "Materiale print pe m²",
    intro: "Banner backlit, film backlit și blockout pentru casete luminoase, mochetă și preșuri personalizate. Prețul se calculează pe suprafață, după dimensiunile tale.",
  },
  {
    slug: "rame-si-suporturi",
    name: "Rame și suporturi",
    intro: "Rame click, rame magnetice, suporturi de plexiglas, suporturi pentru broșuri, standuri de meniu, șevalete, distanțieri și suporturi pentru plăcuțe de ușă.",
  },
  {
    slug: "papetarie-si-birou",
    name: "Papetărie și birou",
    intro: "Agende, notebook-uri, blocnotesuri personalizate, coli cu antet, calendare și printare A4/A3 color sau alb-negru.",
  },
  {
    slug: "promotionale",
    name: "Promoționale",
    intro: "Sacoșe din bumbac, stick-uri USB, bandane tubulare, șorțuri de bucătărie, roata norocului și alte produse pentru campanii și evenimente.",
  },
  {
    slug: "decor-pentru-casa",
    name: "Decor pentru casă",
    intro: "Perne decorative, fotolii bean bag și covorașe imprimate, cu modele gata create.",
  },
  {
    slug: "panouri-si-semnalizare",
    name: "Panouri și semnalizare",
    intro: "Panouri de șantier și panouri PNRR, plăcuțe indicatoare Braille și semnalizare pentru stingătoare.",
  },
];

export function getCatalogCategory(slug: string): CatalogCategory | undefined {
  return CATALOG_CATEGORIES.find((c) => c.slug === slug);
}

export function catalogProductUrl(p: Pick<CatalogProduct, "category" | "slug">): string {
  return `/produse/${p.category}/${p.slug}`;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function findVariant(p: CatalogProduct, selection: string[]): CatalogVariant | undefined {
  return p.variants?.find((v) => v.o.every((val, i) => val === selection[i]));
}

/**
 * Preț pentru un material pe m², cu aceeași regulă ca la bannerele din configurator:
 * prețul pe m² vine din pragul suprafeței totale, iar suprafețele foarte mici
 * (sub 0,5 m² în total) au prețul pe m² majorat.
 */
export function sqmPrice(material: SqmMaterial, widthCm: number, heightCm: number, quantity: number) {
  if (widthCm <= 0 || heightCm <= 0 || quantity <= 0) return { total: 0, unit: 0, perSqm: 0, totalSqm: 0 };
  const sqmPerUnit = (widthCm / 100) * (heightCm / 100);
  const totalSqm = round2(sqmPerUnit * quantity);
  const band = material.bands.find((b) => b.max === null || totalSqm <= b.max) ?? material.bands[material.bands.length - 1];
  let perSqm = band.price;
  if (totalSqm < 0.1) perSqm *= 5;
  else if (totalSqm < 0.2) perSqm *= 4;
  else if (totalSqm < 0.3) perSqm *= 3;
  else if (totalSqm < 0.4) perSqm *= 2;
  else if (totalSqm < 0.5) perSqm *= 1.5;
  const total = round2(totalSqm * perSqm);
  return { total, unit: round2(total / quantity), perSqm: round2(perSqm), totalSqm };
}

/** Preț unitar pentru un produs pe praguri de cantitate; `null` dacă combinația nu există. */
export function qtyUnitPrice(spec: QtySpec, selection: string[], quantity: number): number | null {
  const row = spec.rows.find((r) => r.o.every((val, i) => val === selection[i]));
  if (!row) return null;
  let idx = 0;
  spec.tiers.forEach((min, i) => {
    if (quantity >= min) idx = i;
  });
  return row.p[idx] ?? null;
}
