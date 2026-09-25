import { siteConfig } from "@/lib/siteConfig";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Phone, Truck, Upload, MousePointerClick } from "lucide-react";
import { getLocalitateBySlug, getJudetBySlug } from "@/lib/localitati";
import { CONFIGURATORS_REGISTRY } from "@/lib/configurators-registry";
import { getSiblingLocalitySlugs } from "@/lib/seo/indexableLocalities";
import { buildLocalContent } from "@/lib/seo/localContent";
import { getJudetProfile } from "@/lib/seo/judetProfiles";
import { getFromPrice } from "@/lib/seo/fromPrice";
import { WhatsAppBar, WhatsAppButton } from "@/components/seo/WhatsAppBar";

// Pagina unei localitati: scurta si clara, cu butoanele la vedere din primul ecran.
// Textul unic vine din faptele reale ale judetului (lib/seo/localContent.ts), nu din umplutura.
// Intrebarile frecvente sunt afisate pe pagina, identice cu cele din datele structurate.

type Params = { params: Promise<{ judetSlug: string; localitateSlug: string }> };

// Cele mai comandate, afisate primele si in cardul din primul ecran
const TOP = ["canvas", "tapet", "afise", "autocolante", "banner", "rollup", "plexiglass", "pvc-forex"];

function orderedProducts() {
    const rank = (id: string) => (TOP.includes(id) ? TOP.indexOf(id) : TOP.length);
    return [...CONFIGURATORS_REGISTRY].sort((a, b) => rank(a.id) - rank(b.id));
}

function faqFor(locName: string, judetName: string, tier: string | undefined) {
    const livrare =
        tier === "apropiat"
            ? "de regulă a doua zi după ce comanda e gata"
            : tier === "distant"
                ? "în 1-2 zile lucrătoare după ce comanda e gata"
                : "în 24-48 de ore după ce comanda e gata";
    return [
        {
            q: `Cât durează până primesc comanda în ${locName}?`,
            a: `Producem în 1-3 zile lucrătoare, apoi curierul DPD o aduce la adresa ta din ${locName}, ${livrare}.`,
        },
        {
            q: "Cum aflu prețul?",
            a: "Alegi produsul, introduci dimensiunea și cantitatea, iar prețul apare imediat, fără cerere de ofertă. Pentru comenzi mari ne scrii pe WhatsApp.",
        },
        {
            q: "Pot plăti la livrare?",
            a: `Da. Poți plăti cu cardul online, prin transfer bancar sau ramburs, la curier, când primești coletul în ${locName}.`,
        },
        {
            q: "Ce fac dacă nu am grafică?",
            a: `O facem noi, pe baza textului și a logo-ului tău. Iar dacă ai grafica ta, vezi înainte de comandă cum se încadrează pe dimensiunea aleasă. Livrăm oriunde în județul ${judetName}.`,
        },
    ];
}

export async function generateMetadata({ params }: Params) {
    const { judetSlug, localitateSlug } = await params;
    const loc = getLocalitateBySlug(judetSlug, localitateSlug);
    const judet = getJudetBySlug(judetSlug);
    if (!loc || !judet) return {};

    const from = getFromPrice(["canvas"]);
    const title = `Tablouri canvas în ${loc.name}${from ? ` – canvas de la ${from.text}` : ""}`;
    const description = `Tablouri canvas din poze, colaje și seturi, cu livrare în ${loc.name}, jud. ${judet.name}. Preț calculat pe loc, producție în 1-3 zile, plată la livrare.`;
    const routeUrl = `${siteConfig.url}/judet/${judet.slug}/${loc.slug}`;

    return {
        title,
        description,
        openGraph: { title, description, url: routeUrl, siteName: "Tablou.net", locale: "ro_RO", type: "website" },
        alternates: { canonical: routeUrl },
        robots: { index: true, follow: true },
    };
}

export default async function LocalitatePage({ params }: Params) {
    const { judetSlug, localitateSlug } = await params;
    const loc = getLocalitateBySlug(judetSlug, localitateSlug);
    const judet = getJudetBySlug(judetSlug);
    if (!loc || !judet) notFound();

    const profile = getJudetProfile(judet.slug);
    // Din textul generat pastram doar fraza cu faptul real despre zona (face pagina unica)
    const generated = buildLocalContent({
        brand: "tablou",
        productTitle: "tablouri canvas",
        productSlug: "print",
        locName: loc.name,
        locSlug: loc.slug,
        judetSlug: judet.slug,
        judetName: judet.name,
    }).heroText.split(/(?<=\.)\s+/);
    const localFact = generated.length >= 3 ? generated.slice(1, -1).join(" ") : "";
    const intro = `Tablouri canvas din fotografiile tale, colaje și seturi, livrate la adresa ta din ${loc.name}. ${localFact}`.trim();
    const products = orderedProducts();
    const top = products.filter((p) => TOP.slice(0, 3).includes(p.id));
    const faq = faqFor(loc.name, judet.name, profile?.tierLivrare);
    const neighbours = getSiblingLocalitySlugs(judet.slug, loc.slug, 12)
        .map((slug) => judet.localitati.find((l) => l.slug === slug))
        .filter((l): l is NonNullable<typeof l> => Boolean(l));
    const bannerFrom = getFromPrice(["canvas"]);
    const pageUrl = `${siteConfig.url}/judet/${judet.slug}/${loc.slug}`;
    const waMessage = `Bună ziua! Aș dori o ofertă pentru tablouri canvas cu livrare în ${loc.name}, jud. ${judet.name}.`;

    return (
        <div className="bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        {
                            "@context": "https://schema.org",
                            "@type": "Service",
                            name: `Tablouri canvas în ${loc.name}`,
                            serviceType: "Tablouri canvas",
                            areaServed: { "@type": "City", name: loc.name, containedInPlace: { "@type": "AdministrativeArea", name: `Județul ${judet.name}` } },
                            provider: { "@type": "Organization", name: "Tablou.net", url: siteConfig.url, telephone: siteConfig.phone },
                            url: pageUrl,
                        },
                        {
                            "@context": "https://schema.org",
                            "@type": "BreadcrumbList",
                            itemListElement: [
                                { "@type": "ListItem", position: 1, name: "Acasă", item: `${siteConfig.url}/` },
                                { "@type": "ListItem", position: 2, name: "Județe", item: `${siteConfig.url}/judet` },
                                { "@type": "ListItem", position: 3, name: judet.name, item: `${siteConfig.url}/judet/${judet.slug}` },
                                { "@type": "ListItem", position: 4, name: loc.name, item: pageUrl },
                            ],
                        },
                        {
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
                        },
                    ]),
                }}
            />

            {/* Primul ecran: ce oferim, in 2 randuri, si butoanele */}
            <section className="border-b border-slate-100 bg-gradient-to-b from-emerald-50/60 to-white">
                <div className="container mx-auto grid gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:py-14">
                    <div>
                        <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                            <Link href="/judet" className="hover:text-emerald-700">Județe</Link>
                            <span aria-hidden>/</span>
                            <Link href={`/judet/${judet.slug}`} className="hover:text-emerald-700">{judet.name}</Link>
                            <span aria-hidden>/</span>
                            <span className="text-slate-800">{loc.name}</span>
                        </nav>
                        <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                            <Truck size={14} /> Livrăm în {loc.name}, jud. {judet.name}
                        </p>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                            Tablouri canvas în <span className="text-emerald-600">{loc.name}</span>
                        </h1>
                        <p className="mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">{intro}</p>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                            <a href="#produse" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-7 py-4 text-base font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-500">
                                Vezi produsele și prețurile <ArrowRight size={18} />
                            </a>
                            <WhatsAppButton message={waMessage} className="!rounded-2xl !px-7 !py-4 !text-base !normal-case !tracking-normal">
                                Cere ofertă pe WhatsApp
                            </WhatsAppButton>
                        </div>
                        <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-emerald-700">
                            <Phone size={15} /> sau sună la {siteConfig.phone}
                        </a>

                        <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-700">
                            {["Preț calculat pe loc", "Producție în 1-3 zile", "Plată la livrare", "Livrare DPD"].map((t) => (
                                <li key={t} className="inline-flex items-center gap-1.5"><Check size={16} className="text-emerald-600" /> {t}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Cele mai comandate, cu pret: al doilea buton din primul ecran */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5">
                        <p className="mb-3 text-sm font-semibold text-slate-900">Cele mai comandate în {loc.name}</p>
                        <ul className="divide-y divide-slate-100">
                            {top.map((p) => {
                                const from = getFromPrice([p.id]);
                                return (
                                    <li key={p.id}>
                                        <Link href={`/judet/${judet.slug}/${loc.slug}/${p.slug || p.id}`} className="group flex items-center gap-3 py-3">
                                            <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                                                <Image src={p.image || "/placeholder.png"} alt="" fill sizes="56px" className="object-cover" />
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                <span className="block truncate font-semibold text-slate-900 group-hover:text-emerald-700">{p.name}</span>
                                                {from && <span className="text-sm text-slate-500">de la <b className="text-slate-900">{from.text}</b></span>}
                                            </span>
                                            <span className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white group-hover:bg-emerald-500">Comandă</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Toate produsele */}
            <section id="produse" className="scroll-mt-20 py-12 sm:py-16">
                <div className="container mx-auto px-4 sm:px-6">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Produse cu livrare în {loc.name}</h2>
                    <p className="mt-2 text-slate-600">Alegi dimensiunea și vezi prețul imediat.</p>
                    <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
                        {products.map((p) => {
                            const from = getFromPrice([p.id]);
                            return (
                                <Link key={p.id} href={`/judet/${judet.slug}/${loc.slug}/${p.slug || p.id}`}
                                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg">
                                    <span className="relative aspect-[4/3] bg-slate-100">
                                        <Image src={p.image || "/placeholder.png"} alt={`${p.name} în ${loc.name}`} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" />
                                    </span>
                                    <span className="flex flex-1 flex-col p-3 sm:p-4">
                                        <h3 className="text-sm font-semibold text-slate-900 sm:text-base">{p.name}</h3>
                                        {from && <span className="mt-0.5 text-xs text-slate-500 sm:text-sm">de la <b className="text-slate-900">{from.text}</b></span>}
                                        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">
                                            Configurează <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
                                        </span>
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Cum comanzi: 3 pasi */}
            <section className="bg-slate-50 py-12 sm:py-16">
                <div className="container mx-auto px-4 sm:px-6">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Cum comanzi din {loc.name}</h2>
                    <ol className="mt-8 grid gap-4 sm:grid-cols-3">
                        {[
                            { icon: MousePointerClick, t: "Alegi produsul", d: "Dimensiune, material, cantitate. Prețul apare pe loc." },
                            { icon: Upload, t: "Încarci grafica", d: "Vezi cum se încadrează. Sau o facem noi." },
                            { icon: Truck, t: `Primești în ${loc.name}`, d: "Curier DPD la adresă. Plătești și la livrare." },
                        ].map((s, i) => (
                            <li key={s.t} className="rounded-2xl border border-slate-200 bg-white p-5">
                                <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-600 text-white"><s.icon size={20} /></span>
                                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-emerald-700">Pasul {i + 1}</p>
                                <h3 className="mt-1 font-semibold text-slate-900">{s.t}</h3>
                                <p className="mt-1 text-sm text-slate-600">{s.d}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {/* Intrebari frecvente (aceleasi ca in datele structurate) */}
            <section className="py-12 sm:py-16">
                <div className="container mx-auto max-w-3xl px-4 sm:px-6">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Întrebări despre comenzile din {loc.name}</h2>
                    <div className="mt-6 divide-y divide-slate-200 rounded-2xl border border-slate-200">
                        {faq.map((f, i) => (
                            <details key={f.q} className="group p-5" open={i === 0}>
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900">
                                    {f.q}
                                    <span className="text-emerald-600 transition group-open:rotate-45" aria-hidden>+</span>
                                </summary>
                                <p className="mt-2 text-slate-600">{f.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Localitati vecine */}
            {neighbours.length > 0 && (
                <section className="border-t border-slate-100 bg-slate-50 py-12 pb-28 sm:py-16 lg:pb-16">
                    <div className="container mx-auto px-4 sm:px-6">
                        <h2 className="text-xl font-bold text-slate-900">Livrăm și în alte localități din județul {judet.name}</h2>
                        <div className="mt-5 flex flex-wrap gap-2">
                            {neighbours.map((l) => (
                                <Link key={l.slug} href={`/judet/${judet.slug}/${l.slug}`}
                                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:border-emerald-300 hover:text-emerald-700">
                                    {l.name}
                                </Link>
                            ))}
                            <Link href={`/judet/${judet.slug}`} className="rounded-full px-4 py-2 text-sm font-semibold text-emerald-700 hover:underline">
                                Tot județul {judet.name} →
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Pe telefon: butonul ramane mereu la vedere */}
            <WhatsAppBar message={waMessage} price={bannerFrom?.text} label="canvas de la" />
        </div>
    );
}
