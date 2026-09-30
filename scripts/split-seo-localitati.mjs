#!/usr/bin/env node
/**
 * Împarte datele SEO pe localitate (din _deploy/seo-localitati/) în câte un
 * fișier pe județ: lib/seo/data/judete/{judet}.json, citit pe server de
 * lib/seo/localityData.ts (nimic nu ajunge în bundle-ul de client).
 *
 * FIȘIER IDENTIC ÎN TOATE CELE 6 REPO-URI. Rulează din rădăcina repo-ului:
 *   node scripts/split-seo-localitati.mjs [--geo-only] [dir-sursă]
 * dir-sursă implicit: ../../_deploy/seo-localitati (față de rădăcina repo-ului).
 * --geo-only: doar localities.json + counties.json (fără firms.json / orders.json).
 *
 * Intrări:
 *  - localities.json { sources, localities: { "judet/loc": { name, type, typeLabel, siruta,
 *                      postalCode|postalCodeNote, population|populationNote, uat{...},
 *                      lat, lon, distanceToCountySeatKm|distanceToBucurestiKm, nearest[{slug,name,km}],
 *                      homonymsInCounty? } } }
 *  - counties.json   { counties: { judet: { name, auto, regiuneDezvoltare, population,
 *                      municipii, orase, comune, sirutaLocalities, countySeat{name,slug,population} } } }
 *  - firms.json      { site: { "judet/loc": {...} }, judete: { judet: {...} }, citare }
 *  - orders.json     pe județ; se păstrează DOAR totalul pe județ și doar de la 5 comenzi în sus
 *
 * Reguli (proprietar): nimic inventat; fiecare cifră are sursa ei; comenzi doar pe
 * județ (≥ 5), niciodată pe localitate; la localitățile cu omonime în județ
 * (slug-ul nu poate fi atribuit sigur) păstrăm doar denumirea.
 * Scriptul nu afișează date, doar numărători.
 */
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const GEO_ONLY = args.includes("--geo-only");
const ROOT = process.cwd();
const SRC = path.resolve(args.find((a) => !a.startsWith("--")) || path.join(ROOT, "..", "..", "_deploy", "seo-localitati"));
const OUT = path.join(ROOT, "lib", "seo", "data", "judete");
const MIN_ORDERS = 5;

// Etichetele de sursă afișate pe pagini (cerute de proprietar).
const SOURCES = {
    siruta: "Sursa: INS, SIRUTA 2026",
    population: "Sursa: INS, Recensământul 2021",
    osm: { text: "© OpenStreetMap contributors", url: "https://www.openstreetmap.org/copyright" },
};

function readJson(name) {
    const p = path.join(SRC, name);
    if (!fs.existsSync(p)) return undefined;
    return JSON.parse(fs.readFileSync(p, "utf8"));
}

const num = (v) => (typeof v === "number" && Number.isFinite(v) ? v : typeof v === "string" && /^\d+(\.\d+)?$/.test(v) ? Number(v) : undefined);
const str = (v) => (typeof v === "string" && v.trim() ? v.trim() : undefined);
const pick = (o, keys) => {
    if (!o || typeof o !== "object") return undefined;
    for (const k of keys) if (o[k] !== undefined && o[k] !== null) return o[k];
    return undefined;
};
const clean = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));

function normFirms(v) {
    if (v === undefined || v === null) return undefined;
    const count = typeof v === "number" ? v : num(pick(v, ["firmeActive", "count", "active", "firme", "total", "n"]));
    if (count === undefined) return undefined;
    const rawSections = typeof v === "object" ? pick(v, ["top3Domenii", "topSections", "top", "sections", "sectiuni", "caen", "top3"]) : undefined;
    const topSections = Array.isArray(rawSections)
        ? rawSections
              .map((s) => (typeof s === "string" ? { label: s } : clean({ label: str(pick(s, ["domeniu", "label", "name", "denumire", "title"])), count: num(pick(s, ["count", "n", "firme", "total"])) })))
              .filter((s) => s.label)
              .slice(0, 3)
        : undefined;
    return clean({ count, topSections: topSections && topSections.length ? topSections : undefined });
}

function normOrders(v) {
    const count = typeof v === "number" ? v : num(pick(v, ["count", "orders", "comenzi", "total", "n"]));
    const since = typeof v === "object" ? str(pick(v, ["since", "from", "first", "start", "de_la"])) : undefined;
    if (count === undefined || count < MIN_ORDERS) return undefined;
    return clean({ count, since: since ? since.slice(0, 10) : undefined });
}

function normLocality(v) {
    if (!v || typeof v !== "object") return {};
    const name = str(v.name);
    // Omonime în județ: slug-ul nu poate fi atribuit sigur unei singure localități SIRUTA.
    if (Array.isArray(v.homonymsInCounty) && v.homonymsInCounty.length) return clean({ name, ambiguous: true });
    const uat = v.uat && typeof v.uat === "object"
        ? clean({ name: str(v.uat.name), kind: str(v.uat.kind), seat: str(v.uat.seat), seatSlug: str(v.uat.seatSlug), population: num(v.uat.population), localitiesCount: num(v.uat.localitiesCount) })
        : undefined;
    const nearest = Array.isArray(v.nearest)
        ? v.nearest
              .map((n) => clean({ slug: str(n?.slug), judet: str(n?.judet), name: str(n?.name), km: num(n?.km) }))
              .filter((n) => n.slug && /^[a-z0-9-]+$/.test(n.slug))
              .slice(0, 12)
        : undefined;
    return clean({
        name,
        type: str(v.type),
        typeLabel: str(v.typeLabel),
        siruta: num(v.siruta),
        postalCode: str(v.postalCode),
        postalCodeNote: str(v.postalCodeNote),
        population: num(v.population),
        populationNote: str(v.populationNote),
        uat: uat && uat.name ? uat : undefined,
        hasCoords: typeof v.lat === "number" && typeof v.lon === "number" ? true : undefined,
        distanceToCountySeatKm: num(v.distanceToCountySeatKm),
        distanceToBucurestiKm: num(v.distanceToBucurestiKm),
        nearest: nearest && nearest.length ? nearest : undefined,
    });
}

function normCounty(c) {
    if (!c || typeof c !== "object") return undefined;
    const seat = c.countySeat && typeof c.countySeat === "object" ? clean({ name: str(c.countySeat.name), slug: str(c.countySeat.slug), population: num(c.countySeat.population) }) : undefined;
    return clean({
        name: str(c.name),
        auto: str(c.auto),
        region: str(c.regiuneDezvoltare),
        population: num(c.population),
        municipii: num(c.municipii),
        orase: num(c.orase),
        comune: num(c.comune),
        sirutaLocalities: num(c.sirutaLocalities),
        seat: seat && seat.name ? seat : undefined,
    });
}

const dateIn = (s) => (typeof s === "string" ? (s.match(/\d{4}-\d{2}-\d{2}/) || [])[0] : undefined);

const ro = JSON.parse(fs.readFileSync(path.join(ROOT, "lib", "seo", "ro_localitati.json"), "utf8"));
const locs = readJson("localities.json");
const counties = readJson("counties.json");
const firms = GEO_ONLY ? undefined : readJson("firms.json");
const orders = GEO_ONLY ? undefined : readJson("orders.json");

const locsMap = (locs && locs.localities) || {};
const countiesMap = (counties && (counties.counties || counties.judete)) || {};
const firmsSite = (firms && (firms.site || firms.localitati)) || {};
const firmsJudete = (firms && (firms.judete || firms.counties)) || {};
const firmsCitare = firms && typeof firms.citare === "string" ? firms.citare : undefined;
const ordersByJudet = (orders && (orders.judete || orders.counties || orders)) || {};
const ordersCitare = orders && typeof orders.citare === "string" ? orders.citare : undefined;

const version = [dateIn(locs?.generatedAt), dateIn(counties?.generatedAt), dateIn(firmsCitare), dateIn(ordersCitare)].filter(Boolean).sort().pop();

fs.mkdirSync(OUT, { recursive: true });
let files = 0, withGeo = 0, ambiguous = 0, withFirms = 0, countiesWithOrders = 0;

for (const j of ro) {
    const localities = {};
    for (const l of j.localitati) {
        const key = `${j.slug}/${l.slug}`;
        const d = normLocality(locsMap[key]);
        if (d.ambiguous) ambiguous++;
        else if (Object.keys(d).length > 1) withGeo++;
        const f = normFirms(firmsSite[key]);
        if (f) { d.firms = f; withFirms++; }
        if (Object.keys(d).length) localities[l.slug] = d;
    }
    const county = clean({ ...(normCounty(countiesMap[j.slug]) || {}), firms: normFirms(firmsJudete[j.slug]), orders: normOrders(ordersByJudet[j.slug]) });
    if (county.orders) countiesWithOrders++;
    if (!Object.keys(localities).length && !Object.keys(county).length) continue;
    const sources = clean({ ...SOURCES, firms: firmsCitare, orders: ordersCitare });
    const out = clean({ judet: j.slug, version, sources, county, localities });
    fs.writeFileSync(path.join(OUT, `${j.slug}.json`), JSON.stringify(out));
    files++;
}

console.log(`Scris ${files} fișiere de județ în ${path.relative(ROOT, OUT)}; localități cu date geo: ${withGeo}, omonime (doar denumirea): ${ambiguous}, cu firme: ${withFirms}, județe cu comenzi (≥${MIN_ORDERS}): ${countiesWithOrders}; versiune: ${version || "-"}${GEO_ONLY ? " (--geo-only)" : ""}`);
