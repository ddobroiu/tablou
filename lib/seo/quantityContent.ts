// Conținutul paginilor de preț pe cantitate (/preturi/{produs}/{format}-{n}-buc).
// Totul e derivat din date: prețul la această cantitate și la vecine, pragul
// de la care scade prețul pe bucată, greutatea coletului din gramaj × suprafață,
// dimensiunile formatului, specificațiile de fișier din registru și termenul de
// producție (2-4 zile lucrătoare pe toate produsele).
import { QtyFormat, QtyPricing, QtyProduct, getRegistryEntry } from "./quantityPages";
import { formatLei } from "./dimensionPricing";
import { brandKeyFromName, brandMetaTitle, BrandKey } from "./dimensionContent";

export { brandKeyFromName };

export type QtyContent = {
    metaTitle: string;
    metaDescription: string;
    h1: string;
    subtitle: string;
    intro: string[];
    facts: Array<{ label: string; value: string; detail?: string }>;
    usage: { heading: string; paragraphs: string[] };
    file: { heading: string; items: string[] };
    faq: Array<{ q: string; a: string }>;
    priceHeading: string;
    ladderHeading: string;
    neighborsHeading: string;
    localitiesHeading: string;
    ctaLabel: string;
    sections: Array<"price" | "ladder" | "facts" | "usage" | "file" | "faq" | "neighbors" | "localities">;
};

type RunClass = "mic" | "mediu" | "mare";

function runClassOf(product: QtyProduct, qty: number): RunClass {
    const qs = product.quantities;
    const idx = qs.indexOf(qty);
    if (idx <= 1) return "mic";
    if (idx >= qs.length - 2) return "mare";
    return "mediu";
}

const USAGE: Record<string, Record<RunClass, string>> = {
    flayere: {
        mic: "Un tiraj mic de flyere acoperă o promoție de weekend, o deschidere de magazin sau un eveniment local: se împart la ușă, se pun la casă și în pachetele de livrare. Prețul pe bucată e mai mare decât la tiraje mari, dar comanda se amortizează din prima zi de campanie.",
        mediu: "E tirajul obișnuit pentru o campanie de o lună: distribuție stradală, cutii poștale dintr-un cartier, flyere puse în comenzile livrate. La această cantitate prețul pe bucată a scăzut deja vizibil față de 100 de bucăți.",
        mare: "Tirajele mari se fac pentru distribuție în cutii poștale pe zone întregi, pentru lanțuri de magazine sau pentru campanii care țin un sezon. Prețul pe bucată ajunge la cel mai mic prag; verifică textul de două ori, pentru că o greșeală se multiplică de mii de ori.",
    },
    pliante: {
        mic: "Un tiraj mic de pliante e potrivit pentru o prezentare de firmă, un meniu de restaurant sau un cabinet: se dau în mână, la recepție sau la întâlniri. Pliantul spune mai mult decât un flyer, deci merită hârtie mai groasă.",
        mediu: "E cantitatea tipică pentru târguri, expoziții și campanii de prezentare a serviciilor: pliante la stand, în mape de prezentare și în pachetele trimise clienților.",
        mare: "Tirajele mari de pliante se folosesc pentru catalog de servicii distribuit prin poștă sau pentru mai multe puncte de lucru. La această cantitate hârtia de 115-135 g ține prețul jos, iar cea de 170 g dă un pliant care se simte solid în mână.",
    },
    "carti-vizita": {
        mic: "O sută-două de cărți de vizită ajung unei persoane pentru câteva luni de întâlniri. E cantitatea potrivită când vrei să testezi un design sau când comanzi pentru un singur angajat.",
        mediu: "Cinci sute de cărți de vizită acoperă o echipă mică sau un an de networking intens pentru o persoană. Prețul pe bucată scade față de 100-200, deci merită comandate odată pentru toți colegii.",
        mare: "Peste o mie de bucăți se comandă pentru firme cu mai mulți angajați sau pentru evenimente unde se distribuie multe. La această cantitate prețul pe bucată e cel mai mic; păstrează același layout și schimbă doar numele.",
    },
    afise: {
        mic: "Câteva afișe se folosesc pentru vitrina magazinului, avizierul blocului sau un eveniment de o seară. La formate mari (A1, A0) se livrează în tub, ca să nu se cuteze.",
        mediu: "Zeci de afișe acoperă o campanie de cartier: vitrine, panouri de afișaj, stâlpi de evenimente. Blueback-ul e alegerea pentru lipit pe panouri stradale, hârtia de 150 g pentru interior.",
        mare: "Sute de afișe se tipăresc pentru campanii de oraș, lanțuri de magazine sau turnee de evenimente. Prețul pe bucată scade pe praguri de cantitate, deci comandă tirajul întreg odată.",
    },
    tricouri: {
        mic: "Zece-douăzeci de tricouri acoperă o echipă mică, un eveniment de familie sau un stand de târg. De la 10 bucăți se aplică deja discount de volum.",
        mediu: "Treizeci-cincizeci de tricouri sunt tirajul tipic pentru o firmă cu mai multe puncte de lucru, o tabără sau o echipă sportivă. De la 30 de bucăți prețul pe bucată scade cu 15%, de la 50 cu 20%.",
        mare: "Peste o sută de tricouri se comandă pentru festivaluri, promoții cu personal temporar sau uniforme pentru toată firma. Prețul pe bucată e la pragul maxim de discount; trimite lista de mărimi odată cu comanda.",
    },
    hanorace: {
        mic: "Zece-douăzeci de hanorace acoperă o echipă mică sau un grup de prieteni; de la 10 bucăți se aplică discount de volum.",
        mediu: "Treizeci-cincizeci de hanorace se comandă pentru echipe sportive, clase de absolvenți sau uniforme de iarnă; de la 30 de bucăți prețul scade cu 15%, de la 50 cu 20%.",
        mare: "O sută de hanorace înseamnă uniforme pentru toată firma sau merch pentru un eveniment mare; prețul pe bucată e la pragul maxim de discount.",
    },
    sepci: {
        mic: "Zece-douăzeci de șepci acoperă un stand, o echipă de promoteri sau un cadou pentru colegi; de la 10 bucăți se aplică discount de volum.",
        mediu: "Treizeci-cincizeci de șepci se comandă pentru evenimente de vară, echipe de teren sau uniforme; de la 30 de bucăți prețul scade cu 15%, de la 50 cu 20%.",
        mare: "Peste o sută de șepci se comandă pentru festivaluri și campanii de promovare; prețul pe bucată e la pragul maxim de discount.",
    },
    rollup: {
        mic: "Unul sau două roll-up-uri acoperă recepția, un stand mic sau o prezentare: se desfac în 30 de secunde și intră în geanta livrată.",
        mediu: "Cinci roll-up-uri înseamnă un perete de stand din bucăți alăturate sau câte unul pentru fiecare punct de lucru; de la 6 bucăți prețul pe bucată scade.",
        mare: "Zece-douăzeci de roll-up-uri se comandă pentru rețele de magazine, conferințe cu mai multe săli sau echipe de vânzări din teren; prețul pe bucată ajunge la pragul cel mai mic.",
    },
    autocolante: {
        mic: "Cincizeci-o sută de etichete acoperă un lot mic de produse, borcane de casă sau un eveniment. La bucăți mici intră în preț și tăierea pe contur a fiecărei etichete.",
        mediu: "Câteva sute de etichete sunt tirajul obișnuit pentru producători mici, cofetării, ateliere: etichete de produs, sigilii pentru pachete, stickere pentru ambalaj.",
        mare: "Mii de etichete se comandă pentru serii de producție sau pentru mai multe sortimente; prețul pe bucată scade cu suprafața totală comandată, iar laminarea protejează printul de frecare și umezeală.",
    },
};

const FILE_NOTES: Record<string, string[]> = {
    flayere: ["PDF cu 3 mm de bleed pe fiecare latură și textul la cel puțin 3 mm de linia de tăiere.", "Imagini la 300 DPI, culori CMYK, fonturi convertite în curbe."],
    pliante: ["Fișier deschis (A4, 297 × 210 mm) cu 3 mm de bleed și liniile de big marcate; textul la cel puțin 5 mm de pliuri.", "Imagini la 300 DPI, culori CMYK, fonturi convertite în curbe."],
    "carti-vizita": ["PDF cu 3 mm de bleed pe fiecare latură, textul la cel puțin 3 mm de tăiere, fonturi convertite în curbe.", "Pentru față-verso trimite ambele fețe în același fișier sau în două fișiere numite clar."],
    afise: ["PDF cu 3 mm de bleed pe fiecare latură.", "Minim 300 DPI la A3-A2 și 150 DPI la A1-A0, culori CMYK."],
    tricouri: ["Grafica ca PNG cu fundal transparent sau vector (AI, PDF, SVG), la dimensiunea reală a printului.", "Trimite lista de mărimi și culori odată cu comanda."],
    hanorace: ["Grafica ca PNG cu fundal transparent sau vector (AI, PDF, SVG), la dimensiunea reală a printului.", "Trimite lista de mărimi și culori odată cu comanda."],
    sepci: ["Logo vector (AI, PDF, SVG) sau PNG la rezoluție mare; zona de print pe față e mică, deci detaliile fine se pierd.", "Trimite culorile dorite odată cu comanda."],
    rollup: ["Fișier la scară 1:1 la minimum 150 DPI; ține textele importante în treimea de sus.", "Partea de jos, sub 60 cm, e acoperită adesea de mese sau de public."],
    autocolante: ["Pentru tăiere pe contur trimite conturul ca traseu vectorial într-un layer separat.", "Imagini la 300 DPI, CMYK; fonturi convertite în curbe."],
};

type Voice = { brandName: string; opener: (p: QtyProduct, qty: number, fmt: string, from: string) => string; sections: QtyContent["sections"]; priceHeading: string; ladderHeading: string; usageHeading: string; fileHeading: string; neighborsHeading: string; localitiesHeading: string; ctaLabel: string; descPrefix: string };

const VOICES: Record<BrandKey, Voice> = {
    adbanner: { brandName: "AdBanner", opener: (p, q, f, from) => `${q} ${p.unit} ${f} costă ${from} la AdBanner, cu grafica ta, produse în 2-4 zile lucrătoare și livrate prin curier.`, sections: ["price", "ladder", "facts", "usage", "file", "faq", "neighbors", "localities"], priceHeading: "Preț pentru", ladderHeading: "Cum scade prețul cu cantitatea", usageHeading: "Pentru ce ajunge tirajul ăsta", fileHeading: "Fișierul pentru print", neighborsHeading: "Alte cantități și formate", localitiesHeading: "Livrăm în toată țara", ctaLabel: "Comandă în configurator", descPrefix: "Comandă" },
    anexa1: { brandName: "Anexa1", opener: (p, q, f, from) => `Listă de preț pentru ${q} ${p.unit} ${f}: ${from} la Anexa1, cu grafica ta, producție în 2-4 zile lucrătoare.`, sections: ["facts", "price", "ladder", "file", "usage", "faq", "neighbors", "localities"], priceHeading: "Listă de preț pentru", ladderHeading: "Praguri de cantitate", usageHeading: "Utilizare tipică", fileHeading: "Specificații fișier", neighborsHeading: "Alte cantități din gamă", localitiesHeading: "Livrare națională", ctaLabel: "Deschide configuratorul", descPrefix: "Listă de preț:" },
    euprint: { brandName: "EuPrint", opener: (p, q, f, from) => `${q} ${p.unit} ${f} costă ${from} la EuPrint; pentru proiectele cu finanțare, tirajul și formatul sunt stabilite de planul de comunicare, iar prețul e calculat automat.`, sections: ["price", "usage", "ladder", "facts", "file", "faq", "neighbors", "localities"], priceHeading: "Preț pentru", ladderHeading: "Prețul pe bucată la fiecare tiraj", usageHeading: "Pentru ce se folosește", fileHeading: "Cum pregătești fișierul", neighborsHeading: "Alte tiraje", localitiesHeading: "Livrăm oriunde în România", ctaLabel: "Comandă online", descPrefix: "Comandă la preț accesibil" },
    homeprint: { brandName: "HomePrint", opener: (p, q, f, from) => `Dacă ai nevoie de ${q} ${p.unit} ${f}, la HomePrint costă ${from}, cu grafica ta, gata în 2-4 zile lucrătoare.`, sections: ["price", "usage", "facts", "ladder", "file", "faq", "neighbors", "localities"], priceHeading: "Cât costă", ladderHeading: "Cât economisești la tiraj mai mare", usageHeading: "Pentru ce ajung", fileHeading: "Ce fișier trimiți", neighborsHeading: "Alte cantități", localitiesHeading: "Livrare la domiciliu", ctaLabel: "Comandă online", descPrefix: "Comandă" },
    prynt: { brandName: "Prynt", opener: (p, q, f, from) => `${q} ${p.unit} ${f} la Prynt: ${from} cu grafica ta, produse în 2-4 zile lucrătoare.`, sections: ["price", "ladder", "file", "usage", "facts", "faq", "neighbors", "localities"], priceHeading: "Prețul pentru", ladderHeading: "Discount de volum", usageHeading: "La ce e bun tirajul ăsta", fileHeading: "Fișierul tău", neighborsHeading: "Alte cantități", localitiesHeading: "Livrare prin curier", ctaLabel: "Personalizează acum", descPrefix: "Personalizează" },
    shopprint: { brandName: "ShopPrint", opener: (p, q, f, from) => `${q} ${p.unit} ${f} se comandă online la ShopPrint cu ${from}, cu grafica ta, produse în tipografie proprie în 2-4 zile lucrătoare.`, sections: ["price", "facts", "ladder", "file", "usage", "faq", "neighbors", "localities"], priceHeading: "Prețuri", ladderHeading: "Praguri de preț", usageHeading: "Utilizări frecvente", fileHeading: "Pregătirea fișierului", neighborsHeading: "Alte cantități și formate", localitiesHeading: "Livrăm în toate județele", ctaLabel: "Comandă online", descPrefix: "Comandă" },
    tablou: { brandName: "Tablou", opener: (p, q, f, from) => `${q} ${p.unit} ${f} costă ${from} la Tablou.net, cu grafica ta, produse în 2-4 zile lucrătoare.`, sections: ["price", "ladder", "usage", "facts", "file", "faq", "neighbors", "localities"], priceHeading: "Preț pentru", ladderHeading: "Prețul pe bucată la fiecare cantitate", usageHeading: "Pentru ce ajung", fileHeading: "Fișierul tău", neighborsHeading: "Alte cantități", localitiesHeading: "Livrare în toată țara", ctaLabel: "Comandă online", descPrefix: "Comandă" },
};

function fmtKg(kg: number): string {
    if (kg < 1) return `${Math.round(kg * 1000)} g`;
    return `${new Intl.NumberFormat("ro-RO", { maximumFractionDigits: 1 }).format(Math.round(kg * 10) / 10)} kg`;
}
function fmtInt(n: number): string {
    return new Intl.NumberFormat("ro-RO").format(n);
}
function trimTo(s: string, max: number): string {
    return s.length <= max ? s : s.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
}

/** Greutatea tirajului, kg: gramaj × suprafață × bucăți (hârtie) sau greutate fixă (roll-up). */
function batchWeight(format: QtyFormat, qty: number, variantKey: string): { kg: number; note: string } | null {
    if (format.unitKg) return { kg: format.unitKg * qty, note: `~${fmtKg(format.unitKg)} pe bucată, casetă cu print, conform fișei` };
    if (format.gsm && format.wMm && format.hMm) {
        const gsm = variantKey.startsWith("250") ? 250 : variantKey.startsWith("300") ? 300 : variantKey.startsWith("115") ? 115 : variantKey.startsWith("135") ? 135 : variantKey.startsWith("170") ? 170 : variantKey.startsWith("blueback") ? 115 : format.gsm;
        const sqm = (format.wMm / 1000) * (format.hMm / 1000);
        return { kg: (gsm * sqm * qty) / 1000, note: `${gsm} g/m² × ${new Intl.NumberFormat("ro-RO", { maximumFractionDigits: 4 }).format(sqm)} m² × ${fmtInt(qty)} buc` };
    }
    return null;
}

export function buildQtyContent(input: { brand: BrandKey; product: QtyProduct; format: QtyFormat; qty: number; pricing: QtyPricing }): QtyContent {
    const { brand, product, format, qty, pricing } = input;
    const voice = VOICES[brand];
    const cfg = getRegistryEntry(product.id);
    const rec = pricing.recommended;
    const from = formatLei(rec.total);
    const fmtText = product.kind === "textil" ? `cu ${format.short}` : format.short;
    const runClass = runClassOf(product, qty);
    const ladder = pricing.ladder;
    const here = ladder.find((r) => r.qty === qty);
    const cheaper = ladder.filter((r) => r.qty > qty && here && r.unit < here.unit);
    const nextBreak = cheaper[0];
    const weight = batchWeight(format, qty, rec.key);

    const facts: QtyContent["facts"] = [];
    facts.push({ label: "Cantitate", value: `${fmtInt(qty)} buc`, detail: `${formatLei(rec.unit)} pe bucată pe varianta ${rec.label.toLowerCase()}` });
    if (format.wMm && format.hMm) facts.push({ label: product.formatLabel, value: format.short, detail: `${fmtInt(format.wMm)} × ${fmtInt(format.hMm)} mm${format.gsm ? `, ${format.gsm} g/m² la varianta recomandată` : ""}` });
    else facts.push({ label: product.formatLabel, value: format.label });
    if (weight) facts.push({ label: "Greutate colet", value: `~${fmtKg(weight.kg)}`, detail: weight.note });
    if (nextBreak) facts.push({ label: "Următorul prag", value: `${fmtInt(nextBreak.qty)} buc`, detail: `prețul pe bucată scade la ${formatLei(nextBreak.unit)} (${formatLei(nextBreak.total)} în total)` });
    facts.push({ label: "Producție", value: "2-4 zile lucrătoare", detail: "apoi livrare prin curier, în toată țara" });

    const usageParas = [USAGE[product.id]?.[runClass] ?? ""].filter(Boolean);
    if (cfg?.useCases?.length) usageParas.push(`Folosit des pentru: ${cfg.useCases.slice(0, 4).join(", ").toLowerCase()}.`);

    const fileItems = [...(FILE_NOTES[product.id] ?? [])];

    const faq: QtyContent["faq"] = [
        { q: `Cât costă ${fmtInt(qty)} ${product.unit} ${fmtText}?`, a: `${from} în total, adică ${formatLei(rec.unit)} pe bucată, pe varianta ${rec.label.toLowerCase()}, cu grafica ta. ${pricing.variants.length > 1 ? `Celelalte variante: ${pricing.variants.filter((v) => v.key !== rec.key).map((v) => `${v.label.toLowerCase()} ${formatLei(v.total)}`).join("; ")}.` : ""} Prețul e calculat de același motor ca în configurator.` },
    ];
    if (nextBreak) faq.push({ q: `Merită să comand mai multe de ${fmtInt(qty)}?`, a: `De la ${fmtInt(nextBreak.qty)} bucăți prețul pe bucată scade de la ${formatLei(rec.unit)} la ${formatLei(nextBreak.unit)}; ${fmtInt(nextBreak.qty)} ${product.unit} costă ${formatLei(nextBreak.total)} în total.` });
    else if (ladder.length > 1 && here && here.unit <= Math.min(...ladder.map((r) => r.unit))) faq.push({ q: `Scade prețul dacă comand mai multe de ${fmtInt(qty)}?`, a: `La ${fmtInt(qty)} bucăți ești deja la cel mai mic preț pe bucată din listă (${formatLei(rec.unit)}). Pentru tiraje mai mari cere o ofertă pe WhatsApp.` });
    if (weight) faq.push({ q: `Cât cântărește coletul cu ${fmtInt(qty)} ${product.unit}?`, a: `Aproximativ ${fmtKg(weight.kg)} (${weight.note}). Se livrează prin curier în 2-4 zile lucrătoare de la confirmarea graficii.` });
    faq.push({ q: `Ce fișier trimit pentru ${product.unit} ${fmtText}?`, a: fileItems.join(" ") });
    if (cfg?.faq?.length) {
        const extra = cfg.faq[qty % cfg.faq.length];
        if (extra) faq.push({ q: extra.q, a: extra.a });
    }

    const metaTitle = brandMetaTitle(brand, `${fmtInt(qty)} ${product.unit} ${fmtText}`, from, voice.brandName);
    const metaDescription = trimTo(`${voice.descPrefix} ${fmtInt(qty)} ${product.unit} ${fmtText}: ${from} (${formatLei(rec.unit)}/buc) pe ${rec.label.toLowerCase()}. ${nextBreak ? `De la ${fmtInt(nextBreak.qty)} buc: ${formatLei(nextBreak.unit)}/buc. ` : ""}Producție 2-4 zile lucrătoare, livrare prin curier.`, 158);

    return {
        metaTitle,
        metaDescription,
        h1: `${fmtInt(qty)} ${product.unit} ${fmtText}`,
        subtitle: `${from} în total, ${formatLei(rec.unit)} pe bucată, cu grafica ta. Produse în 2-4 zile lucrătoare.`,
        intro: [voice.opener(product, qty, fmtText, from)],
        facts,
        usage: { heading: voice.usageHeading, paragraphs: usageParas },
        file: { heading: voice.fileHeading, items: fileItems },
        faq,
        priceHeading: voice.priceHeading,
        ladderHeading: voice.ladderHeading,
        neighborsHeading: voice.neighborsHeading,
        localitiesHeading: voice.localitiesHeading,
        ctaLabel: voice.ctaLabel,
        sections: voice.sections,
    };
}
