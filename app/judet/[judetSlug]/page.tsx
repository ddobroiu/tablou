import { siteConfig } from "@/lib/siteConfig";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, Check, MapPin, Phone, Truck } from "lucide-react";
import { getJudetBySlug, getJudete } from "@/lib/localitati";
import { CONFIGURATORS_REGISTRY } from "@/lib/configurators-registry";
import { getJudetProfile } from "@/lib/seo/judetProfiles";
import { getFromPrice } from "@/lib/seo/fromPrice";
import { JUDET_LOCALITY_SLUGS } from "@/lib/seo/mainTowns";
import { WhatsAppBar, WhatsAppButton } from "@/components/seo/WhatsAppBar";

export const revalidate = 86400;
export const dynamicParams = true;
export function generateStaticParams() {
    return getJudete().map((j) => ({ judetSlug: j.slug }));
}

type Params = { params: Promise<{ judetSlug: string }> };

const TOP = ["canvas", "tapet", "afise", "autocolante", "banner", "rollup", "plexiglass", "pvc-forex"];

export async function generateMetadata({ params }: Params) {
    const { judetSlug } = await params;
    const judet = getJudetBySlug(judetSlug);
    if (!judet) return {};
    const from = getFromPrice(["canvas"]);
    const title = `Tablouri canvas în județul ${judet.name}${from ? ` – canvas de la ${from.text}` : ""}`;
    const description = `Tablouri canvas din poze, colaje și seturi, cu livrare în toate cele ${judet.localitati.length} localități din județul ${judet.name}. Preț calculat pe loc, plată la livrare.`;
    return { title, description, alternates: { canonical: `${siteConfig.url}/judet/${judetSlug}` } };
}

export default async function JudetPage({ params }: Params) {
    const { judetSlug } = await params;
    const judet = getJudetBySlug(judetSlug);
    if (!judet) notFound();

    const profile = getJudetProfile(judet.slug);
    const mainSlugs = JUDET_LOCALITY_SLUGS[judet.slug] ?? [];
    const mainTowns = mainSlugs
        .map((s) => judet.localitati.find((l) => l.slug === s))
        .filter((l): l is NonNullable<typeof l> => Boolean(l));
    // Produsele trimit la pagina produsului din resedinta judetului (primul oras principal)
    const seat = mainTowns[0] ?? judet.localitati[0];
    const products = TOP.map((id) => CONFIGURATORS_REGISTRY.find((p) => p.id === id)).filter((p): p is NonNullable<typeof p> => Boolean(p));
    const byLetter = new Map<string, typeof judet.localitati>();
    for (const l of judet.localitati) {
        const k = l.name.charAt(0).toUpperCase();
        byLetter.set(k, [...(byLetter.get(k) ?? []), l]);
    }
    const faq = [
        { q: `Livrați în tot județul ${judet.name}?`, a: `Da, în toate cele ${judet.localitati.length} de localități, prin curier DPD, la adresă. Plătești cu cardul, prin transfer sau la livrare.` },
        { q: "Cum comand?", a: "Alegi produsul, introduci dimensiunea și cantitatea, încarci grafica și vezi cum se încadrează. Prețul apare imediat, fără cerere de ofertă." },
        { q: "În cât timp primesc comanda?", a: "Producem în 1-3 zile lucrătoare, iar curierul livrează de regulă în 24-48 de ore după aceea." },
    ];
    const waMessage = `Bună ziua! Aș dori o ofertă pentru tablouri canvas cu livrare în județul ${judet.name}.`;
    const bannerFrom = getFromPrice(["canvas"]);

    return (
        <div className="bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        {
                            "@context": "https://schema.org",
                            "@type": "BreadcrumbList",
                            itemListElement: [
                                { "@type": "ListItem", position: 1, name: "Acasă", item: `${siteConfig.url}/` },
                                { "@type": "ListItem", position: 2, name: "Județe", item: `${siteConfig.url}/judet` },
                                { "@type": "ListItem", position: 3, name: judet.name, item: `${siteConfig.url}/judet/${judet.slug}` },
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

            <section className="border-b border-slate-100 bg-gradient-to-b from-emerald-50/60 to-white">
                <div className="container mx-auto px-4 py-8 sm:px-6 lg:py-14">
                    <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-xs text-slate-500">
                        <Link href="/judet" className="hover:text-emerald-700">Județe</Link>
                        <span aria-hidden>/</span>
                        <span className="text-slate-800">{judet.name}</span>
                    </nav>
                    <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                        <Truck size={14} /> Livrare în {judet.localitati.length} de localități
                    </p>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                        Tablouri canvas în județul <span className="text-emerald-600">{judet.name}</span>
                    </h1>
                    <p className="mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
                        Tablouri canvas din fotografiile tale, colaje și seturi, livrate la adresă oriunde în județ.
                        {profile && ` Zonă cunoscută pentru ${profile.industrii.slice(0, 2).join(" și ")}; ${profile.reper} e unul dintre reperele ei.`}
                    </p>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <a href="#localitati" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-7 py-4 text-base font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-500">
                            <MapPin size={18} /> Alege localitatea ta
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
            </section>

            <section className="py-12 sm:py-16">
                <div className="container mx-auto px-4 sm:px-6">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Cele mai comandate în județul {judet.name}</h2>
                    <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
                        {products.map((p) => {
                            const from = getFromPrice([p.id]);
                            return (
                                <Link key={p.id} href={`/judet/${judet.slug}/${seat.slug}/${p.slug || p.id}`}
                                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg">
                                    <span className="relative aspect-[4/3] bg-slate-100">
                                        <Image src={p.image || "/placeholder.png"} alt={`${p.name} în județul ${judet.name}`} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" />
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

            <section id="localitati" className="scroll-mt-20 bg-slate-50 py-12 sm:py-16">
                <div className="container mx-auto px-4 sm:px-6">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Alege localitatea</h2>
                    {mainTowns.length > 0 && (
                        <div className="mt-6 flex flex-wrap gap-2">
                            {mainTowns.map((l) => (
                                <Link key={l.slug} href={`/judet/${judet.slug}/${l.slug}`}
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-white px-4 py-2.5 font-semibold text-slate-900 hover:border-emerald-400 hover:text-emerald-700">
                                    <MapPin size={15} className="text-emerald-600" /> {l.name}
                                </Link>
                            ))}
                        </div>
                    )}
                    <details className="group mt-6 rounded-2xl border border-slate-200 bg-white">
                        <summary className="flex cursor-pointer list-none items-center justify-between p-5 font-semibold text-slate-900">
                            Toate cele {judet.localitati.length} de localități din județul {judet.name}
                            <span className="text-emerald-600 transition group-open:rotate-45" aria-hidden>+</span>
                        </summary>
                        <div className="space-y-4 border-t border-slate-100 p-5">
                            {[...byLetter.entries()].map(([letter, list]) => (
                                <div key={letter} className="flex gap-4">
                                    <span className="w-6 shrink-0 font-bold text-emerald-600">{letter}</span>
                                    <p className="text-sm leading-7 text-slate-600">
                                        {list.map((l, i) => (
                                            <React.Fragment key={l.slug}>
                                                {i > 0 && <span className="text-slate-300"> · </span>}
                                                <Link href={`/judet/${judet.slug}/${l.slug}`} className="hover:text-emerald-700">{l.name}</Link>
                                            </React.Fragment>
                                        ))}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </details>
                </div>
            </section>

            <section className="py-12 pb-28 sm:py-16 lg:pb-16">
                <div className="container mx-auto max-w-3xl px-4 sm:px-6">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Întrebări despre comenzile din județul {judet.name}</h2>
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

            <WhatsAppBar message={waMessage} price={bannerFrom?.text} label="canvas de la" />
        </div>
    );
}
