// Conținutul paginilor /judet/{judet}/{localitate}/{familie} pentru familiile din catalog.
// Textul e compus din date reale: produsele și prețurile familiei, profilul județului
// (lib/seo/judetProfiles.ts) și faptele fixe ale magazinului (producție 2-4 zile lucrătoare).
import type { Metadata } from "next";
import { CATALOG_PRODUCTS } from "./index";
import { CATALOG_FAMILIES, type CatalogFamily } from "./families";
import type { CatalogProduct } from "./types";
import { getJudetProfile } from "@/lib/seo/judetProfiles";
import { formatMoneyDisplay } from "@/lib/pricing";
import { siteConfig } from "@/lib/siteConfig";

export { CATALOG_FAMILIES, getCatalogFamily } from "./families";

const hash = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

export function familyProducts(f: CatalogFamily): CatalogProduct[] {
  return CATALOG_PRODUCTS.filter((p) => p.category === f.category && p.group && f.groups.includes(p.group));
}

export function familyFromPrice(f: CatalogFamily): number {
  const list = familyProducts(f);
  return list.length ? Math.min(...list.map((p) => p.priceFrom)) : 0;
}

// Paragraful de ofertă, formulat diferit pe fiecare site.
const OFFER: Record<string, string> = {
  AdBanner: "Aici ai {modele} din familie, cu prețurile la vedere, de la {pret}. Alegi modelul potrivit pentru locul în care îl expui, îl pui în coș și îl primești în {loc}.",
  EuPrint: "Pagina listează {modele} din familie, cu prețuri de la {pret}, pe care le poți folosi direct într-o referință de achiziție. Comanda se plasează online, cu factură pe instituție sau firmă, și se livrează în {loc}.",
  HomePrint: "Ai la un loc {modele}, de la {pret}, ca să alegi ce se potrivește în camera ta. Pui modelul în coș și îl primești acasă, în {loc}.",
  Prynt: "Găsești {modele} din familie, de la {pret}. Alegi varianta pentru echipa sau evenimentul tău, o comanzi online și o primești în {loc}.",
  ShopPrint: "Pe această pagină găsești {modele} din familie, cu prețurile afișate, de la {pret}. Compari variantele, o adaugi în coș pe cea potrivită și primești comanda la adresa ta din {loc}.",
  Tablou: "Aici sunt {modele}, de la {pret}. Alegi ce ți se potrivește pentru casă sau pentru un cadou și primești comanda în {loc}.",
};

type Place = { locName: string; locSlug: string; judetName: string; judetSlug: string };

export function familyLocalUrl(f: CatalogFamily, pl: Pick<Place, "judetSlug" | "locSlug">): string {
  return `/judet/${pl.judetSlug}/${pl.locSlug}/${f.slug}`;
}

export function familyLocalMetadata(f: CatalogFamily, pl: Place): Metadata {
  const list = familyProducts(f);
  const from = formatMoneyDisplay(familyFromPrice(f));
  const url = `${siteConfig.url}${familyLocalUrl(f, pl)}`;
  const title = `${f.name} ${pl.locName} – de la ${from}`;
  const description = `${f.name} cu livrare prin curier în ${pl.locName}, județul ${pl.judetName}. ${list.length} ${list.length === 1 ? "produs" : "modele"}, de la ${from}. Livrare în 2-4 zile lucrătoare.`.slice(0, 158);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, images: list[0] ? [list[0].images[0]] : [] },
    robots: { index: true, follow: true },
  };
}

export function familyLocalContent(f: CatalogFamily, pl: Place) {
  const list = familyProducts(f);
  const from = formatMoneyDisplay(familyFromPrice(f));
  const profile = getJudetProfile(pl.judetSlug);
  const h = hash(`${pl.judetSlug}/${pl.locSlug}/${f.slug}`);
  const b1 = f.buyers[h % f.buyers.length];
  const b2 = f.buyers[(h + 1 + ((h >>> 4) % (f.buyers.length - 1))) % f.buyers.length];
  const lowerName = f.name.charAt(0).toLowerCase() + f.name.slice(1);

  const local = profile
    ? `Județul ${pl.judetName}, din ${profile.regiune}, e cunoscut pentru ${profile.industrii[h % profile.industrii.length]}. În ${pl.locName} și în restul județului, ${lowerName} sunt utile pentru ${b1} și pentru ${b2}.`
    : `În ${pl.locName} și în restul județului ${pl.judetName}, ${lowerName} sunt utile pentru ${b1} și pentru ${b2}.`;

  const models = list.length === 1 ? "produsul" : `toate cele ${list.length} modele`;
  const offer = (OFFER[siteConfig.name] ?? OFFER.ShopPrint)
    .replace("{modele}", models).replace("{pret}", from).replace(/\{loc\}/g, pl.locName);

  const delivery = `Comanda ajunge în ${pl.locName} prin curier în 2-4 zile lucrătoare, la adresă sau la un punct de ridicare. Costul livrării îl vezi în coș, înainte să plasezi comanda, iar plata se poate face cu cardul, prin transfer sau ramburs, la curier.`;

  const hasArtwork = list.some((p) => p.artwork !== "none");
  const faqs = [
    {
      question: `Livrați ${lowerName} în ${pl.locName}?`,
      answer: `Da. Trimitem prin curier la orice adresă din ${pl.locName} și din județul ${pl.judetName}, iar comanda ajunge în 2-4 zile lucrătoare.`,
    },
    {
      question: `Cât costă ${lowerName}?`,
      answer: `Prețurile pornesc de la ${from} și depind de model, mărime și cantitate. Toate prețurile sunt afișate pe pagina fiecărui produs; costul livrării apare în coș.`,
    },
    ...(hasArtwork
      ? [{
          question: "Cum vă trimit grafica?",
          answer: `O încarci direct pe pagina produsului, la comandă, sau ne-o trimiți după plasarea comenzii, pe e-mail la ${siteConfig.email} sau pe WhatsApp, cu numărul comenzii.`,
        }]
      : []),
    ...(f.note ? [{ question: "Ce include prețul?", answer: f.note }] : []),
    {
      question: `Pot primi factură pe firmă?`,
      answer: "Da. Completezi datele firmei la finalizarea comenzii și factura se emite pe firmă, PFA sau instituție.",
    },
  ];

  return { list, from, paragraphs: [f.about, local, offer, delivery], faqs, profile };
}

/** Celelalte familii, pentru legături interne din aceeași localitate. */
export function otherFamilies(f: CatalogFamily): CatalogFamily[] {
  return CATALOG_FAMILIES.filter((x) => x.slug !== f.slug);
}
