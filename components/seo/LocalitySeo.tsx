import React from "react";
import Link from "next/link";
import { getFromPrice, type FromPrice } from "@/lib/seo/fromPrice";
import { isDimensionProduct } from "@/lib/seo/dimensionPages";
import {
    getLocalityData,
    getCountyData,
    getCountySources,
    type FirmStats,
} from "@/lib/seo/localityData";

/**
 * Blocuri SEO pentru paginile /judet/...: fire de navigare (cu BreadcrumbList),
 * date structurate care reflectă exact ce e pe pagină, date reale pe
 * localitate/județ (doar când există, cu sursa și data) și legături interne.
 *
 * FIȘIER IDENTIC ÎN TOATE CELE 6 REPO-URI.
 * Regulă: nimic inventat. Fără date → componenta nu randează nimic.
 */

// ---------------------------------------------------------------- breadcrumbs

export type Crumb = { name: string; href?: string };

/** Fir de navigare vizibil + BreadcrumbList cu exact aceleași elemente. */
export function Breadcrumbs({
    items,
    siteUrl,
    className,
    linkClassName,
    currentClassName,
}: {
    items: Crumb[];
    siteUrl: string;
    className?: string;
    linkClassName?: string;
    currentClassName?: string;
}) {
    const base = siteUrl.replace(/\/+$/, "");
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.name,
            ...(c.href ? { item: `${base}${c.href}` } : {}),
        })),
    };
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <nav aria-label="Breadcrumb" className={className}>
                {items.map((c, i) => (
                    <React.Fragment key={`${i}-${c.name}`}>
                        {i > 0 && <span aria-hidden className="opacity-40">/</span>}
                        {c.href && i < items.length - 1 ? (
                            <Link href={c.href} className={linkClassName}>{c.name}</Link>
                        ) : (
                            <span aria-current={i === items.length - 1 ? "page" : undefined} className={currentClassName}>{c.name}</span>
                        )}
                    </React.Fragment>
                ))}
            </nav>
        </>
    );
}

// ------------------------------------------------------------------- prețuri

/**
 * Prețul „de la” pe care pagina îl arată efectiv: pentru produsele pe
 * dimensiuni e minimul din LocalSizePrices (aceleași mărimi populare, același
 * motor), pentru restul e cel din FromPriceNote. Folosit și în Offer.
 */
export function visibleFromPrice(productIds: Array<string | undefined | null>): { price: FromPrice; shownBy: "sizes" | "note" } | null {
    const ids = productIds.map((x) => String(x || "").toLowerCase()).filter(Boolean);
    const dimId = ids.find((x) => isDimensionProduct(x));
    if (dimId) {
        const p = getFromPrice([dimId]);
        return p ? { price: p, shownBy: "sizes" } : null;
    }
    const p = getFromPrice(ids);
    return p ? { price: p, shownBy: "note" } : null;
}

/** Linia de preț pentru produsele fără tabel de mărimi (textile, kituri); altfel nimic. */
export function FromPriceNote({ productIds, className }: { productIds: Array<string | undefined | null>; className?: string }) {
    const v = visibleFromPrice(productIds);
    if (!v || v.shownBy !== "note") return null;
    return (
        <p className={className ?? "mb-8 text-base text-slate-700"}>
            Preț de la <b className="text-slate-900">{v.price.text}</b> / buc ({v.price.basis}), calculat cu același motor ca în configurator.
        </p>
    );
}

// ------------------------------------------------------------ date structurate

/**
 * Product/Offer + Service (areaServed: localitate, județ) + FAQPage pentru o
 * pagină localitate × produs. Offer apare doar dacă prețul e afișat pe pagină.
 * Fără recenzii sau note: nu există.
 */
export function LocalProductJsonLd({
    name,
    description,
    image,
    url,
    siteName,
    siteUrl,
    serviceType,
    locName,
    judetName,
    productIds,
    faqs,
}: {
    name: string;
    description: string;
    image?: string;
    url: string;
    siteName: string;
    siteUrl: string;
    serviceType: string;
    locName: string;
    judetName: string;
    productIds: Array<string | undefined | null>;
    faqs?: Array<{ question: string; answer: string }>;
}) {
    const from = visibleFromPrice(productIds);
    const county = { "@type": "AdministrativeArea", name: `Județul ${judetName}` };
    const provider = { "@type": "Organization", name: siteName, url: siteUrl };
    const data: Record<string, unknown>[] = [
        {
            "@context": "https://schema.org",
            "@type": "Product",
            name,
            description,
            ...(image ? { image: [image.startsWith("/") ? `${siteUrl.replace(/\/+$/, "")}${image}` : image] } : {}),
            brand: { "@type": "Brand", name: siteName },
            ...(from
                ? {
                      offers: {
                          "@type": "Offer",
                          url,
                          priceCurrency: "RON",
                          price: from.price.price.toFixed(2),
                          availability: "https://schema.org/MadeToOrder",
                          itemCondition: "https://schema.org/NewCondition",
                          seller: provider,
                      },
                  }
                : {}),
        },
        {
            "@context": "https://schema.org",
            "@type": "Service",
            name,
            serviceType,
            provider,
            areaServed: [{ "@type": "Place", name: locName, containedInPlace: county }, county],
            url,
        },
    ];
    if (faqs && faqs.length) {
        data.push({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
        });
    }
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}


// ------------------------------------------------------------- date reale

const RO_MONTHS = ["ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie"];

function fmtInt(n: number): string {
    return Math.round(n).toLocaleString("ro-RO");
}

function fmtKm(n: number): string {
    return n.toLocaleString("ro-RO", { maximumFractionDigits: 1 });
}

function monthYear(iso: string | undefined): string | undefined {
    const m = /^(\d{4})-(\d{2})/.exec(String(iso || ""));
    if (!m) return undefined;
    const month = RO_MONTHS[Number(m[2]) - 1];
    return month ? `${month} ${m[1]}` : undefined;
}

export type SourceKey = "siruta" | "population" | "osm" | "firms" | "orders";

/** Nota discretă cu sursele folosite efectiv (OpenStreetMap cu link, cerință ODbL). */
export function SourceNote({ judetSlug, keys, prefix, className }: { judetSlug: string; keys: SourceKey[]; prefix?: string; className?: string }) {
    const src = getCountySources(judetSlug) ?? {};
    const parts: React.ReactNode[] = [];
    for (const k of [...new Set(keys)]) {
        const v = src[k];
        if (!v) continue;
        if (typeof v === "string") parts.push(<span key={k}>{v}</span>);
        else parts.push(v.url ? <a key={k} href={v.url} rel="noopener noreferrer" target="_blank" className="underline hover:text-slate-600">{v.text}</a> : <span key={k}>{v.text}</span>);
    }
    if (!prefix && parts.length === 0) return null;
    return (
        <p className={className ?? "mt-3 text-[11px] leading-snug text-slate-400"}>
            {prefix}
            {parts.map((p, i) => (
                <React.Fragment key={i}>{(i > 0 || prefix) && " · "}{p}</React.Fragment>
            ))}
        </p>
    );
}

function firmsSentence(f: FirmStats): React.ReactNode {
    const sections = (f.topSections ?? []).map((s) => s.label).filter(Boolean);
    return (
        <>
            <b className="text-slate-900">{fmtInt(f.count)}</b> {f.count === 1 ? "firmă activă" : "firme active"}
            {sections.length > 0 && <>; cele mai multe în: {sections.join(", ")}</>}
        </>
    );
}

type Row = { key: string; label: string; value: React.ReactNode; source: SourceKey };

function FactsList({ rows }: { rows: Row[] }) {
    return (
        <dl className="mt-4 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
            {rows.map((r) => (
                <div key={r.key}>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{r.label}</dt>
                    <dd className="mt-0.5 text-slate-700">{r.value}</dd>
                </div>
            ))}
        </dl>
    );
}

/**
 * Date reale despre localitate: tip și unitate administrativă (SIRUTA), cod poștal,
 * populație (RPL 2021), distanța până la reședința de județ (OSM), firme (BazaDate).
 * Nimic dacă lipsesc sau dacă slug-ul are omonime în județ.
 */
export function LocalityFacts({ judetSlug, locSlug, locName, className }: { judetSlug: string; locSlug: string; locName: string; className?: string }) {
    const d = getLocalityData(judetSlug, locSlug);
    if (!d || d.ambiguous) return null;
    const county = getCountyData(judetSlug);
    const rows: Row[] = [];
    if (d.typeLabel) rows.push({ key: "type", label: "Tip", value: d.typeLabel, source: "siruta" });
    if (d.uat?.name && d.uat.name !== locName) {
        const seatLink = d.uat.seatSlug && d.uat.seatSlug !== locSlug;
        rows.push({
            key: "uat",
            label: "Unitate administrativă",
            value: seatLink ? <Link href={`/judet/${judetSlug}/${d.uat.seatSlug}`} className="text-emerald-700 hover:underline">{d.uat.name}</Link> : d.uat.name,
            source: "siruta",
        });
    }
    if (d.siruta) rows.push({ key: "siruta", label: "Cod SIRUTA", value: String(d.siruta), source: "siruta" });
    if (d.postalCode) rows.push({ key: "postal", label: "Cod poștal", value: d.postalCode, source: "siruta" });
    else if (d.postalCodeNote) rows.push({ key: "postal", label: "Cod poștal", value: d.postalCodeNote, source: "siruta" });
    if (typeof d.population === "number" && d.population > 0) {
        rows.push({ key: "pop", label: "Populație (1 decembrie 2021)", value: `${fmtInt(d.population)} locuitori`, source: "population" });
    } else if (d.populationNote) {
        rows.push({ key: "pop", label: "Populație (1 decembrie 2021)", value: d.populationNote, source: "population" });
    }
    if (typeof d.distanceToBucurestiKm === "number") {
        rows.push({ key: "dist", label: "Distanța până la București", value: `~${fmtKm(d.distanceToBucurestiKm)} km în linie dreaptă`, source: "osm" });
    } else if (typeof d.distanceToCountySeatKm === "number" && county?.seat?.name && county.seat.slug !== locSlug) {
        rows.push({ key: "dist", label: `Distanța până la ${county.seat.name}`, value: `~${fmtKm(d.distanceToCountySeatKm)} km în linie dreaptă`, source: "osm" });
    }
    if (d.firms && d.firms.count > 0) rows.push({ key: "firms", label: `Firme înregistrate în ${locName}`, value: firmsSentence(d.firms), source: "firms" });
    if (rows.length === 0) return null;
    return (
        <section className={className ?? "border-t border-slate-100 bg-white py-10"}>
            <div className="container mx-auto max-w-4xl px-4 sm:px-6">
                <h2 className="text-xl font-bold text-slate-900">Date despre {locName}</h2>
                <FactsList rows={rows} />
                <SourceNote judetSlug={judetSlug} keys={rows.map((r) => r.source)} />
            </div>
        </section>
    );
}

/** Date reale pe județ: reședință, populație, structură administrativă, firme, comenzi (doar de la 5 în sus). */
export function CountyFacts({ judetSlug, judetName, className }: { judetSlug: string; judetName: string; className?: string }) {
    const c = getCountyData(judetSlug);
    if (!c) return null;
    const rows: Row[] = [];
    if (c.seat?.name) {
        rows.push({
            key: "seat",
            label: "Reședința județului",
            value: c.seat.slug ? <Link href={`/judet/${judetSlug}/${c.seat.slug}`} className="text-emerald-700 hover:underline">{c.seat.name}</Link> : c.seat.name,
            source: "siruta",
        });
    }
    if (typeof c.population === "number" && c.population > 0) rows.push({ key: "pop", label: "Populație (1 decembrie 2021)", value: `${fmtInt(c.population)} locuitori`, source: "population" });
    const adm = [
        typeof c.municipii === "number" ? `${c.municipii} ${c.municipii === 1 ? "municipiu" : "municipii"}` : undefined,
        typeof c.orase === "number" ? `${c.orase} ${c.orase === 1 ? "oraș" : "orașe"}` : undefined,
        typeof c.comune === "number" ? `${c.comune} ${c.comune === 1 ? "comună" : "comune"}` : undefined,
    ].filter(Boolean);
    if (adm.length) rows.push({ key: "adm", label: "Unități administrative", value: adm.join(", "), source: "siruta" });
    if (c.firms && c.firms.count > 0) rows.push({ key: "firms", label: `Firme înregistrate în județul ${judetName}`, value: firmsSentence(c.firms), source: "firms" });
    if (c.orders) {
        const since = monthYear(c.orders.since);
        rows.push({
            key: "orders",
            label: "Comenzi cu livrare în județ",
            value: <><b className="text-slate-900">{fmtInt(c.orders.count)}</b>{since ? `, din ${since} până acum` : ""}</>,
            source: "orders",
        });
    }
    if (rows.length === 0) return null;
    return (
        <section className={className ?? "border-t border-slate-100 bg-white py-10"}>
            <div className="container mx-auto max-w-4xl px-4 sm:px-6">
                <h2 className="text-xl font-bold text-slate-900">Județul {judetName} în cifre</h2>
                <FactsList rows={rows} />
                <SourceNote judetSlug={judetSlug} keys={rows.map((r) => r.source)} />
            </div>
        </section>
    );
}
