import React from "react";
import Link from "next/link";
import { getJudetBySlug, getAllJudeteSlugs } from "@/lib/localitati";
import { siteConfig } from "@/lib/siteConfig";
import Script from "next/script";
import { notFound } from "next/navigation";
import { PRODUCTS, getProducts } from "@/lib/products";

export async function generateStaticParams() {
    return getAllJudeteSlugs().map((slug) => ({ judetSlug: slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ judetSlug: string }> }) {
    const { judetSlug } = await params;
    const data = getJudetBySlug(judetSlug);

    if (!data) return {};

    const cityName = data.localitati[0] ? data.localitati[0].name : data.name;

    const title = `Print Bannere & Mesh ${data.name} - Publicitate Outdoor Tablou`;
    const description = `Livrăm în județul ${data.name} (în ${cityName} și restul județului) bannere publicitare personalizate, mesh-uri și autocolante. Calitate garantată și livrare rapidă.`;

    const routeUrl = `https://tablou.ro/judet/${data.slug}`;

    return {
        title,
        description,
        keywords: `print ${data.name}, bannere ${data.name}, mesh publicitar ${data.name}, publicitate outdoor ${data.name}, autocolante ${data.name}`,
        openGraph: {
            title,
            description,
            url: routeUrl,
            siteName: 'Tablou',
            locale: 'ro_RO',
            type: 'website',
        },
        alternates: { canonical: routeUrl },
    };
}

export default async function JudetPage({ params }: { params: Promise<{ judetSlug: string }> }) {
    const { judetSlug } = await params;
    const data = getJudetBySlug(judetSlug);

    if (!data) notFound();

    const base = siteConfig.url;

    // Aici selectăm rapid 4 mari servicii pentru prezentarea head-ului județului
    const services = [
        {
            name: `Bannere Outdoor ${data.name}`,
            slug: "bannere-publicitare",
            desc: "Material Frontlit 440g/510g, rezistent la intemperii, livrare rapidă în tot județul.",
            price: "de la 49 RON"
        },
        {
            name: `Mesh Publicitar ${data.name}`,
            slug: "mesh-publicitar",
            desc: "Ideal pentru fațade de bloc sau garduri mari. Material perforat rezistent la vânt.",
            price: "de la 55 RON"
        },
        {
            name: `Autocolant Printat ${data.name}`,
            slug: "autocolant-pvc",
            desc: "Pentru vitrine, mașini sau panouri publicitare. Lucios sau mat, rezistent UV.",
            price: "de la 65 RON"
        },
        {
            name: `Sisteme Afișaj ${data.name}`,
            slug: "sisteme-afisaj",
            desc: "Roll-up-uri, X-Bannere și Pop-up Walls pentru evenimentele din județ.",
            price: "de la 185 RON"
        },
    ];

    const localSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": `Print și Publicitate Tablou ${data.name}`,
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "112"
        },
        "provider": {
            "@type": "LocalBusiness",
            "name": "Tablou.ro",
            "url": `${base}/judet/${data.slug}`,
            "areaServed": {
                "@type": "AdministrativeArea",
                "name": `Județul ${data.name}`
            }
        }
    };

    return (
        <main className="container py-10 pt-24 min-h-screen bg-white">
            <Script
                id="local-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        localSchema,
                        {
                            "@context": "https://schema.org",
                            "@type": "BreadcrumbList",
                            "itemListElement": [
                                { "@type": "ListItem", "position": 1, "name": "Acasă", "item": "https://tablou.ro/" },
                                { "@type": "ListItem", "position": 2, "name": data.name }
                            ]
                        }
                    ])
                }}
            />

            <header className="mb-16 border-b border-slate-100 pb-16">
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tighter">
                    Producție Bannere & Print <br /> în <span className="text-orange-500">Județul {data.name}</span>
                </h1>
                <p className="text-2xl text-slate-500 leading-relaxed max-w-4xl font-medium">
                    Dacă ai nevoie de vizibilitate în județul {data.name}, Tablou este soluția ta. Livrăm rapid în orice localitate din județ materiale publicitare de înaltă rezistență.
                </p>
            </header>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
                {services.map((service) => (
                    <div key={service.slug} className="flex flex-col p-10 bg-slate-900 text-white rounded-[2rem] hover:bg-orange-600 transition-all duration-300 group shadow-xl">
                        <h3 className="text-2xl font-black mb-4 tracking-tight group-hover:scale-105 transition-transform origin-left">{service.name}</h3>
                        <p className="text-slate-400 group-hover:text-white/90 mb-8 flex-1 leading-relaxed">{service.desc}</p>
                        <div className="flex flex-col gap-6">
                            <span className="text-orange-500 group-hover:text-white font-black text-2xl tracking-tighter">{service.price}</span>
                            <Link href={`/shop`} className="text-center bg-white text-slate-900 px-8 py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-slate-100 transition shadow-lg inline-block">
                                Comandă Online
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            <section className="mb-24 text-center">
                <h2 className="text-3xl font-black mb-12 text-slate-900 uppercase tracking-tighter">Alege localitatea ta din {data.name}</h2>
                <div className="flex flex-wrap justify-center gap-4">
                    {data.localitati.map((loc) => (
                        <Link href={`/judet/${data.slug}/${loc.slug}`} key={loc.slug} className="px-5 py-3 bg-white border border-slate-300 rounded-xl text-slate-700 text-sm font-bold hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors shadow-sm">
                            {loc.name.toUpperCase()}
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}
