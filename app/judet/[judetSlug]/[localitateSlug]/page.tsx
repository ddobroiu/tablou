import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getLocalitateBySlug, getJudetBySlug } from "@/lib/localitati";
import { CONFIGURATORS_REGISTRY } from "@/lib/configurators-registry";
import { isIndexableLocality } from "@/lib/seo/indexableLocalities";

// Seeded random for deterministic Spintax & Ratings
function getSeededRandom(seedStr: string) {
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
        hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const x = Math.sin(hash++) * 10000;
    return x - Math.floor(x);
}

export async function generateMetadata({ params }: { params: Promise<{ judetSlug: string, localitateSlug: string }> }) {
    const { judetSlug, localitateSlug } = await params;
    const loc = getLocalitateBySlug(judetSlug, localitateSlug);
    const judet = getJudetBySlug(judetSlug);

    if (!loc || !judet) return {};

    const title = `Tipografie & Print în ${loc.name}`;
    const description = `Comandă bannere, autocolante și materiale publicitare personalizate în ${loc.name}. Producție directă în 24-48h, prețuri competitive și livrare rapidă în tot județul ${judet.name}.`;

    const routeUrl = `https://www.tablou.net/judet/${judet.slug}/${loc.slug}`;

    // Only the curated towns are index candidates. The rest stay live and
    // crawlable (follow keeps link equity flowing) but noindex.
    const indexable = isIndexableLocality(judet.slug, loc.slug);

    return {
        title,
        description,
        keywords: `print ${loc.name}, publicitate ${loc.name}, bannere ${loc.name}, materiale promotionale ${loc.name}, tipografie ${loc.name}`,
        openGraph: {
            title,
            description,
            url: routeUrl,
            siteName: 'Tablou',
            locale: 'ro_RO',
            type: 'website',
        },
        alternates: { canonical: routeUrl },
        robots: indexable
            ? { index: true, follow: true }
            : { index: false, follow: true },
    };
}

export default async function LocalitatePage({ params }: { params: Promise<{ judetSlug: string, localitateSlug: string }> }) {
    const { judetSlug, localitateSlug } = await params;
    const loc = getLocalitateBySlug(judetSlug, localitateSlug);
    const judet = getJudetBySlug(judetSlug);

    if (!loc || !judet) notFound();

    const configurators = CONFIGURATORS_REGISTRY;

    return (
        <div className="min-h-screen bg-white">
            <script
                id="local-schema-city"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        {
                            "@context": "https://schema.org",
                            "@type": "Service",
                            "name": `Print și Publicitate Tablou ${loc.name}`,
                            "provider": {
                                "@type": "LocalBusiness",
                                "name": "Tablou",
                                "url": `https://www.tablou.net/judet/${judet.slug}/${loc.slug}`,
                                "areaServed": { "@type": "City", "name": loc.name }
                            }
                        },
                        {
                            "@context": "https://schema.org",
                            "@type": "BreadcrumbList",
                            "itemListElement": [
                                { "@type": "ListItem", "position": 1, "name": "Acasă", "item": "https://www.tablou.net/" },
                                { "@type": "ListItem", "position": 2, "name": judet.name, "item": `https://www.tablou.net/judet/${judet.slug}` },
                                { "@type": "ListItem", "position": 3, "name": loc.name }
                            ]
                        },
                        {
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            "mainEntity": [
                                {
                                    "@type": "Question",
                                    "name": `Ce servicii de print sunt disponibile în ${loc.name}?`,
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": `În ${loc.name} oferim servicii complete de tipar digital: bannere publicitare, tablouri canvas, autocolante, rollup-uri și materiale rigide, toate cu livrare rapidă direct la adresa ta.`
                                    }
                                },
                                {
                                    "@type": "Question",
                                    "name": `Cât durează livrarea în ${loc.name}?`,
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Comenzile sunt produse în 24-48 de ore și expediate prin DPD Express, ajungând de regulă în ziua următoare finalizării producției."
                                    }
                                },
                                {
                                    "@type": "Question",
                                    "name": "Cum pot vedea prețurile pentru produsele mele?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Alege orice produs din lista de mai sus și folosește configuratorul online. Prețul se calculează instantaneu pe baza dimensiunilor și opțiunilor tale."
                                    }
                                }
                            ]
                        }
                    ])
                }}
            />

            {/* Premium Header/Nav */}
            {/* Simple Header - No Hero */}
            <div className="pt-24 pb-12 border-b border-slate-100">
                <div className="container mx-auto px-6">
                    <nav className="text-[10px] font-black text-slate-400 mb-6 flex gap-3 items-center uppercase tracking-widest">
                        <Link href="/judet" className="hover:text-emerald-600 transition-colors">Județe</Link> 
                        <span>/</span>
                        <Link href={`/judet/${judet.slug}`} className="hover:text-emerald-600 transition-colors">{judet.name}</Link> 
                        <span>/</span>
                        <span className="text-slate-900">{loc.name}</span>
                    </nav>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tighter">
                        Print & Publicitate <span className="text-emerald-500">{loc.name}</span>
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl">
                        Producție și livrare rapidă materiale publicitare în <span className="text-slate-900 font-bold">{loc.name}</span>. Alege produsele dorite și configurează-le online.
                    </p>
                </div>
            </div>

            {/* Main Content - Configurators */}
            <section className="py-40">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6">Produse <span className="text-emerald-500">Configurabile</span></h2>
                        <div className="h-2 w-24 bg-emerald-500 mx-auto rounded-full mb-8"></div>
                        <p className="text-xl text-slate-500 font-light max-w-2xl mx-auto">Sistemele noastre de configurare îți permit să alegi dimensiuni, finisaje și materiale specifice, cu preț calculat instant.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                        {configurators.map((p: any) => {
                            const cleanSlug = p.slug || p.id;
                            const productUrl = `/judet/${judet.slug}/${loc.slug}/${cleanSlug}`;

                            return (
                                <Link 
                                    href={productUrl} 
                                    key={p.id} 
                                    className="group flex flex-col items-center text-center space-y-8"
                                >
                                    <div className="w-full aspect-square bg-slate-50 rounded-[4rem] overflow-hidden border border-slate-100 group-hover:border-emerald-500 group-hover:shadow-2xl group-hover:-translate-y-4 transition-all duration-700 relative">
                                        <Image
                                            src={p.image || '/placeholder.png'}
                                            alt={`${p.name} personalizat în ${loc.name}, județul ${judet.name} - Tablou`}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                        />
                                        <div className="absolute bottom-6 left-6 right-6">
                                             <div className="bg-white/90 backdrop-blur-md text-slate-900 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all">
                                                Configurează &rarr;
                                             </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors mb-2">{p.name}</h3>
                                        <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Preț de Producător</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Local Trust Section */}
            <section className="py-40 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-emerald-500/5 rounded-full blur-[200px]"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center max-w-5xl">
                    <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-16 leading-[0.8]">
                        Parteneriat Local <br /> <span className="text-emerald-500 italic">fără Intermediari</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-left">
                        {[
                            { title: "Livrare DPD", text: `Toate produsele comandate în ${loc.name} sunt expediate prioritar prin curier rapid.` },
                            { title: "Calitate UV", text: "Printăm la rezoluție maximă cu rezistență 5 ani la exterior și intemperii." },
                            { title: "Echipa Tehnică", text: "Oferim suport pentru fișierele de print și consultanță în alegerea materialelor." }
                        ].map((item, i) => (
                            <div key={i} className="space-y-6">
                                <div className="text-emerald-500 font-black text-4xl">0{i+1}.</div>
                                <h3 className="text-2xl font-bold">{item.title}</h3>
                                <p className="text-slate-400 text-lg font-light leading-relaxed">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Other Localities List */}
            <section className="py-32 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-slate-200 pb-16">
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Tipografie în Județul {judet.name}</h2>
                            <p className="text-slate-500 mt-2 font-medium">Livrăm materiale personalizate și în localitățile vecine:</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {judet.localitati.filter(l => l.slug !== loc.slug).slice(0, 8).map(l => (
                                <Link
                                    key={l.slug}
                                    href={`/judet/${judet.slug}/${l.slug}`}
                                    className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl text-sm font-black hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                                >
                                    {l.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
