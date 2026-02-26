import React from "react";
import Link from "next/link";
import { getJudetBySlug, getAllJudeteSlugs } from "@/lib/localitati";
import { siteConfig } from "@/lib/siteConfig";
import Script from "next/script";
import { notFound } from "next/navigation";
import { PRODUCTS, getProducts } from "@/lib/products";
import Image from "next/image";

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

    const allProducts = await getProducts();
    const validProducts = allProducts.filter((p: any) => !p.id?.startsWith("fallback-") && (p.images?.length > 0 || p.image));
    const configurators = validProducts.filter((p: any) => p.metadata?.category === "configuratoare");

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

    const groupedLocalities = data.localitati.reduce((acc, loc) => {
        const letter = loc.name.charAt(0).toUpperCase();
        if (!acc[letter]) acc[letter] = [];
        acc[letter].push(loc);
        return acc;
    }, {} as Record<string, typeof data.localitati>);

    const sortedLetters = Object.keys(groupedLocalities).sort((a, b) => a.localeCompare(b, "ro"));

    return (
        <main className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-6 py-10 pt-24 lg:px-8">
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

                <div className="mb-24">
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-8 border-b border-slate-200 pb-4">
                        1. Cele mai Căutate Configuratoare pentru Județul {data.name}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {configurators.map((p: any) => {
                            const rootSlug = (p.routeSlug && !p.routeSlug.includes('/')) ? p.routeSlug : (p.routeSlug || p.slug || p.id);
                            const productUrl = `/${rootSlug}`;

                            return (
                                <Link href={productUrl} key={p.id} className="group bg-white border-2 border-slate-100 rounded-3xl overflow-hidden hover:border-orange-500 hover:shadow-2xl hover:-translate-y-1 transition duration-300 flex flex-col relative text-left">
                                    <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-black px-3 py-1 rounded-full z-10 shadow-lg uppercase tracking-wider">
                                        Configurabil
                                    </div>
                                    <div className="aspect-[4/3] relative bg-slate-100 overflow-hidden">
                                        <Image
                                            src={p.image || p.images?.[0] || '/placeholder.png'}
                                            alt={`${p.title} - Livrare în Județul ${data.name}`}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col bg-gradient-to-b from-white to-slate-50">
                                        <h2 className="text-xl font-black text-slate-900 mb-3 group-hover:text-orange-600 leading-tight">{p.title}</h2>
                                        <p className="text-sm text-slate-500 line-clamp-3 mb-6">
                                            {p.description || `Livrăm și montăm ${p.title} în tot județul ${data.name}. Configurează exact pe dimensiunile tale.`}
                                        </p>
                                        <div className="mt-auto flex justify-between items-center px-4 py-3 bg-slate-900 text-white rounded-xl font-bold group-hover:bg-orange-600 transition-colors">
                                            <span className="text-xs">Vezi pret &rarr;</span>
                                            <span className="text-xs uppercase tracking-widest opacity-80">Online</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <section className="mb-24">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center space-x-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-full mb-4">
                            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            <span className="font-bold text-sm tracking-widest uppercase">Acoperire 100%</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">
                            Rețeaua noastră din <span className="text-orange-500">{data.name}</span>
                        </h2>
                        <p className="text-slate-500 mt-4 text-lg max-w-2xl mx-auto">Selectează localitatea ta din indexul alfabetic de mai jos pentru a accesa produsele și detaliile specifice zonei tale.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {sortedLetters.map(letter => (
                            <div key={letter} className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                <h3 className="text-4xl font-black text-slate-200 mb-6 border-b border-slate-200/60 pb-4">{letter}</h3>
                                <ul className="space-y-3">
                                    {groupedLocalities[letter].sort((a, b) => a.name.localeCompare(b.name, "ro")).map(loc => (
                                        <li key={loc.slug}>
                                            <Link href={`/judet/${data.slug}/${loc.slug}`} className="group flex items-center text-slate-600 hover:text-orange-600 transition-colors">
                                                <div className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-orange-500 group-hover:scale-150 mr-3 transition-all duration-300"></div>
                                                <span className="font-bold text-sm">{loc.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
