// Fapte reale despre fiecare configurator, pentru paginile /judet/{judet}/{localitate}/{produs}.
// Sursa: motorul de prețuri (lib/pricing.ts: formate, materiale, grosimi, limite), completat cu
// regulile stabilite de proprietar: producție 2-4 zile lucrătoare la tot, bannerele au mereu
// tiv și capse, canvas cu sau fără șasiu. Fără afirmații de marketing (fără „producție proprie”,
// „print UV”, garanții în ani) și fără opțiuni care nu se pot comanda.
// Fișierul e identic pe toate site-urile; vocea vine din siteConfig.name.

import { JUDET_LOCALITY_SLUGS } from "./mainTowns";

export type ProductFacts = {
  /** Ce este produsul, 1-2 propoziții. */
  what: string;
  /** Caracteristici verificabile, afișate ca listă. */
  specs: string[];
  /** Utilizări obișnuite. */
  uses: string[];
  /** Cum se trimite grafica. */
  artwork: string;
  /** Legătură spre produsul cu care e confundat des, cu diferența explicată. */
  related?: { slug: string; name: string; text: string };
};

const BANNER_ART = "Grafica se încarcă direct în configurator (PDF, AI, PSD sau JPG) și o vezi așezată pe dimensiunea aleasă înainte de comandă.";
const PAPER_ART = "Încarci fișierul în configurator, la formatul ales; un PDF cu 3 mm margine de tăiere pe fiecare latură iese cel mai bine.";
const RIGID_ART = "Încarci grafica în configurator și o vezi pe placa de dimensiunea aleasă; pentru text mic, un PDF vectorial păstrează marginile clare.";

export const LOCAL_PRODUCT_FACTS: Record<string, ProductFacts> = {
  banner: {
    what: "Bannerul PVC este printat pe prelată Frontlit, se tăie la orice dimensiune în centimetri și vine cu tiv și capse pe margine, gata de prins cu soricei sau coliere.",
    specs: [
      "Material: Frontlit 440 g/mp sau Frontlit 510 g/mp, mai gros",
      "Tiv și capse incluse la fiecare banner",
      "Găuri de vânt opționale, pentru bannerele montate în bătaia vântului",
      "Orice dimensiune, la centimetru; prețul pe mp scade la suprafețe mari",
      "Livrat pliat; bannerele lungi, de peste 3 m, pleacă în sul",
    ],
    uses: ["fațade și garduri", "deschideri de magazin și reduceri", "evenimente și festivaluri", "anunțuri de vânzare sau închiriere"],
    artwork: BANNER_ART,
    related: { slug: "mesh", name: "banner mesh", text: "Pentru schele și suprafețe mari expuse la vânt, mesh-ul microperforat lasă aerul să treacă." },
  },
  "banner-verso": {
    what: "Bannerul față-verso se printează pe Blockout, o prelată cu strat opac la mijloc, așa că grafica de pe o față nu se vede prin cealaltă.",
    specs: [
      "Material: Blockout 650 g/mp, opac",
      "Aceeași grafică pe ambele fețe sau grafici diferite pe față și pe verso",
      "Tiv și capse incluse",
      "Găuri de vânt opționale",
      "Orice dimensiune, la centimetru",
    ],
    uses: ["bannere suspendate în spații comerciale", "afișaj stradal văzut din ambele sensuri", "separatoare la evenimente"],
    artwork: "Pentru grafici diferite încarci două fișiere, unul pentru față și unul pentru verso; configuratorul le arată pe amândouă.",
    related: { slug: "banner", name: "banner PVC", text: "Dacă bannerul se vede dintr-o singură parte, bannerul PVC simplu costă mai puțin." },
  },
  mesh: {
    what: "Mesh-ul este o plasă PVC microperforată: printul se vede de la distanță, iar vântul trece prin material, așa că fațada sau schela nu preia forța unei prelate pline.",
    specs: [
      "Material: mesh 370 g/mp, microperforat",
      "Tiv și capse incluse",
      "Orice dimensiune, la centimetru",
      "Livrat în sul la dimensiuni mari",
    ],
    uses: ["schele și șantiere", "garduri perforate", "fațade mari expuse la vânt"],
    artwork: BANNER_ART,
    related: { slug: "banner", name: "banner PVC", text: "Pentru suprafețe mici sau ferite de vânt, bannerul Frontlit plin are culori mai dense." },
  },
  afise: {
    what: "Afișele se printează în formatele standard pentru avizier, vitrină sau panou stradal, pe hârtie aleasă după locul în care stau.",
    specs: [
      "Formate: A3, A2, A1, A0, 50×70 cm și 70×100 cm",
      "Hârtie 150 g lucioasă sau mată, carton 300 g lucios sau mat",
      "Blueback 115 g pentru exterior, opac pe spate; Whiteback 150 g pentru interior",
      "Satin 170 g și hârtie foto 220 g pentru imagini",
      "Livrate în tub la formatele mari",
    ],
    uses: ["vitrine și avizier", "evenimente și concerte", "panouri stradale cu afișe lipite", "campanii în magazin"],
    artwork: PAPER_ART,
  },
  autocolante: {
    what: "Autocolantele se printează pe folie vinyl Oracal și se livrează fie tăiate pe contur, fie tăiate dreptunghiular, fără contur.",
    specs: [
      "Folie economică, folie auto, folie cu adeziv removabil sau folie transparentă pentru sticlă",
      "Print + tăiere pe contur sau doar print, tăiat dreptunghiular",
      "Laminare opțională, pentru exterior și suprafețe atinse des",
      "Orice dimensiune; prețul se calculează pe suprafață",
    ],
    uses: ["vitrine și uși", "mașini și utilitare", "etichete de produs", "pereți și decor"],
    artwork: "Pentru tăiere pe contur încarci grafica cu conturul vectorial (AI sau PDF); pentru print simplu ajunge un JPG sau PNG la rezoluție bună.",
  },
  canvas: {
    what: "Canvasul este un print pe pânză, în două variante: întins pe șasiu de lemn, gata de agățat, sau doar pânza printată, rulată.",
    specs: [
      "Cu șasiu: șasiu de lemn de 2 cm, dimensiuni fixe, imaginea continuă pe laterale (margine oglindită)",
      "Fără șasiu: pânza printată, livrată rulată, la orice dimensiune",
      "Formate dreptunghiulare și pătrate",
    ],
    uses: ["fotografii de familie", "cadouri personalizate", "decor pentru casă și birou"],
    artwork: "Încarci fotografia în configurator și vezi exact ce parte intră pe față și ce trece pe laterale.",
  },
  tapet: {
    what: "Fototapetul se printează la dimensiunea exactă a peretelui, cu imaginea sau grafica ta.",
    specs: [
      "Tapet fără adeziv, care se lipește cu adeziv de tapet",
      "Tapet cu adeziv integrat",
      "Dimensiune la centimetru, după măsurile peretelui",
    ],
    uses: ["living și dormitor", "camere de copii", "birouri și recepții", "fundal pentru fotografie"],
    artwork: "Încarci imaginea și introduci lățimea și înălțimea peretelui; configuratorul arată cum se încadrează imaginea.",
  },
  rollup: {
    what: "Roll-up-ul este un stand retractabil: bannerul printat se strânge în caseta de jos și se desface în câteva secunde.",
    specs: [
      "Lățimi: 85 cm, 100 cm, 120 cm și 150 cm",
      "Casetă din aluminiu, cu printul inclus",
      "Geantă de transport",
      "Pentru interior sau exterior ferit de vânt și ploaie",
    ],
    uses: ["târguri și expoziții", "conferințe și prezentări", "recepții și magazine"],
    artwork: PAPER_ART,
  },
  "window-graphics": {
    what: "Folia perforată one-way vision acoperă geamul cu grafică la exterior, iar din interior se vede în continuare afară.",
    specs: [
      "Folie PVC perforată, aplicată pe fața exterioară a geamului",
      "Print + tăiere pe contur sau doar print",
      "Laminare opțională",
      "Efectul funcționează ziua, când interiorul e mai întunecat decât exteriorul",
    ],
    uses: ["vitrine de magazin", "geamuri de birou", "luneta mașinii"],
    artwork: "Încarci grafica la dimensiunea geamului; textul mic se pierde printre perforații, așa că merg mai bine literele mari.",
  },
  pliante: {
    what: "Pliantul este o foaie A4 împăturită, cu mai multe panouri de text, potrivită când ai de prezentat servicii, meniuri sau prețuri.",
    specs: [
      "Format deschis 297×210 mm (A4)",
      "Împăturire: 1 big (simplu), 2 biguri (fereastră), 3 biguri (paralel) sau 4 biguri (fluture)",
      "Hârtie de la 115 g la 250 g",
      "Prețul pe bucată scade la tiraje mari",
    ],
    uses: ["meniuri de restaurant", "prezentări de servicii", "broșuri informative", "materiale pentru evenimente"],
    artwork: PAPER_ART,
    related: { slug: "flayere", name: "flayere", text: "Dacă mesajul încape pe o foaie simplă, neîmpăturită, flayerele sunt mai ieftine la tiraj mare." },
  },
  flayere: {
    what: "Flayerul este o foaie simplă, neîmpăturită, pentru mesaje scurte: o ofertă, un eveniment, un cupon.",
    specs: [
      "Formate: A6 (105×148 mm), A5 (148×210 mm) și 21×10 cm",
      "Hârtie 135 g sau carton 250 g",
      "Printat pe o față sau față-verso",
      "Prețul pe bucată scade la tiraje mari",
    ],
    uses: ["împărțit pe stradă", "pus la casă sau pe tejghea", "invitații la evenimente", "cupoane de reducere"],
    artwork: PAPER_ART,
    related: { slug: "pliante", name: "pliante", text: "Dacă ai nevoie de mai mult spațiu, pliantul A4 împăturit are până la 10 panouri de text." },
  },
  "fonduri-eu": {
    what: "Kitul de vizibilitate cuprinde materialele de informare cerute beneficiarilor de fonduri europene, alese pe program și pe etapa proiectului.",
    specs: [
      "Programe: PNRR, FEADR, POCU, Regio și altele",
      "Comunicat de presă la începerea și/sau finalizarea proiectului",
      "Afiș informativ A4, A3 sau A2",
      "Autocolante în seturi și panou temporar sau placă permanentă, în mai multe dimensiuni",
    ],
    uses: ["începerea unui proiect finanțat", "finalizarea proiectului", "echipamente cumpărate din fonduri"],
    artwork: "Completezi datele proiectului în configurator, iar macheta se face după ghidul de identitate vizuală al programului.",
  },
  plexiglass: {
    what: "Plăcile din plexiglas se printează și se taie la dimensiunea cerută, pentru firme și display-uri cu aspect curat.",
    specs: [
      "Plexiglas alb, 2-5 mm, sau transparent, 2-10 mm",
      "Transparentul se poate printa pe o față sau față-verso",
      "Dimensiune maximă 400×200 cm",
      "Livrat cu folie de protecție",
    ],
    uses: ["plăcuțe de firmă de interior", "display-uri de produs", "separatoare și panouri decorative"],
    artwork: RIGID_ART,
  },
  "pvc-forex": {
    what: "PVC-ul expandat (forex) este o placă albă, ușoară și rigidă, pe care printul stă direct, fără ramă.",
    specs: [
      "Grosimi: 1, 2, 3, 4, 5, 6, 8 și 10 mm",
      "Dimensiune maximă 200×300 cm",
      "Tăiat la dimensiunea cerută",
    ],
    uses: ["plăcuțe și indicatoare", "panouri de informare", "standuri de expoziție"],
    artwork: RIGID_ART,
  },
  alucobond: {
    what: "Alucobondul este un panou compozit din două foi de aluminiu cu miez, rigid și făcut pentru exterior pe termen lung.",
    specs: [
      "Grosimi: 3 mm sau 4 mm",
      "Culori panou: alb, argintiu, antracit, negru, roșu, albastru, verde, galben, aluminiu periat",
      "Dimensiune maximă 300×150 cm",
    ],
    uses: ["firme și plăcuțe de exterior", "totemuri", "panouri de fațadă"],
    artwork: RIGID_ART,
  },
  carton: {
    what: "Panourile din carton sunt ușoare și ieftine, pentru afișaj de interior pe termen scurt.",
    specs: [
      "Carton ondulat (E, 3B, 3C, 5BC), printat pe o față sau pe ambele",
      "Placă din carton reciclat de 10 mm sau 16 mm",
      "Dimensiune maximă 400×200 cm",
      "Pentru interior; umezeala strică materialul",
    ],
    uses: ["expoziții temporare", "prezentări și evenimente", "standuri în magazin"],
    artwork: RIGID_ART,
  },
  polipropilena: {
    what: "Polipropilena alveolară este o placă de plastic ușoară, cu canale interioare, care nu se înmoaie la ploaie.",
    specs: [
      "Grosimi: 3, 4 sau 5 mm",
      "Dimensiune maximă 200×300 cm",
      "Rezistentă la apă",
    ],
    uses: ["panouri „de vânzare” sau „de închiriat”", "indicatoare de șantier", "afișaj la evenimente în aer liber"],
    artwork: RIGID_ART,
  },
  tricouri: {
    what: "Tricourile se personalizează cu logo, text sau imagine, pe față, pe spate sau pe ambele părți.",
    specs: [
      "Modele: tricou clasic, tricou cu guler în V și tricou polo",
      "Print pe față, pe spate sau pe ambele părți",
      "Mărimi de la XS la 3XL",
      "Preț mai mic pe bucată de la 10 bucăți",
    ],
    uses: ["echipament pentru firmă", "evenimente și echipe", "cadouri"],
    artwork: "Încarci logo-ul sau imaginea în configurator și îl poziționezi pe tricou; un PNG cu fundal transparent iese cel mai curat.",
  },
  hanorace: {
    what: "Hanoracele se personalizează cu logo, text sau imagine, pe față, pe spate sau pe ambele părți.",
    specs: [
      "Print pe față, pe spate sau pe ambele părți",
      "Mărimi de la XS la 3XL",
      "Preț mai mic pe bucată de la 10 bucăți",
    ],
    uses: ["echipament pentru firmă", "echipe și cluburi", "cadouri"],
    artwork: "Încarci logo-ul sau imaginea în configurator și îl poziționezi pe hanorac; un PNG cu fundal transparent iese cel mai curat.",
  },
  sepci: {
    what: "Șepcile se personalizează cu logo sau text, în față.",
    specs: [
      "Șapcă cu 5 sau 6 panouri, reglabilă",
      "Preț mai mic pe bucată de la 10 bucăți",
    ],
    uses: ["evenimente de vară", "echipamente de echipă", "materiale promoționale"],
    artwork: "Încarci logo-ul în configurator; un PNG cu fundal transparent iese cel mai curat.",
  },
  "carti-vizita": {
    what: "Cărțile de vizită se tipăresc pe carton sau pe materiale speciale, pe o față sau față-verso.",
    specs: [
      "Carton 350 g, mat sau lucios",
      "Plastic PVC, PVC transparent, furnir de lemn sau metal",
      "Față sau față-verso, colțuri rotunjite opționale",
      "Prețul pe bucată scade la tiraje mari",
    ],
    uses: ["întâlniri de afaceri", "recepție și tejghea", "carduri de programare"],
    artwork: PAPER_ART,
  },
};

export function getLocalProductFacts(ids: Array<string | undefined | null>): { slug: string; facts: ProductFacts } | null {
  for (const id of ids) {
    if (!id) continue;
    const key = id.replace(/^\/?(configurator\/)?/, "");
    if (LOCAL_PRODUCT_FACTS[key]) return { slug: key, facts: LOCAL_PRODUCT_FACTS[key] };
  }
  return null;
}

/**
 * Localitățile legate de pe o pagină: întâi orașele principale ale județului, apoi vecinii
 * alfabetici ai localității curente. Fiecare localitate primește astfel legături de la pagini
 * apropiate în listă, nu doar primele 18 din județ, iar Google ajunge la toate.
 */
export function nearbyLocalities<T extends { slug: string }>(judetSlug: string, all: T[], currentSlug: string, max = 18): T[] {
  const bySlug = new Map(all.map((l) => [l.slug, l]));
  const out: T[] = [];
  const seen = new Set([currentSlug]);
  const push = (l?: T) => {
    if (l && !seen.has(l.slug) && out.length < max) { seen.add(l.slug); out.push(l); }
  };
  for (const s of JUDET_LOCALITY_SLUGS[judetSlug] || []) push(bySlug.get(s));
  const i = all.findIndex((l) => l.slug === currentSlug);
  for (let d = 1; out.length < max && d < all.length; d++) {
    if (i >= 0) { push(all[i + d]); push(all[i - d]); }
    else push(all[d - 1]);
  }
  return out;
}
