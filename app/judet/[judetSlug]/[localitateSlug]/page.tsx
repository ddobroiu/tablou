import React from "react";
import Link from "next/link";
import { getLocalitateBySlug, getJudetBySlug } from "@/lib/localitati";
import { siteConfig } from "@/lib/siteConfig";
import Script from "next/script";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/products";
import Image from "next/image";
import SeoNetwork from "@/components/seo/SeoNetwork";

export async function generateMetadata({ params }: { params: Promise<{ judetSlug: string, localitateSlug: string }> }) {
    const { judetSlug, localitateSlug } = await params;
    const loc = getLocalitateBySlug(judetSlug, localitateSlug);
    const judet = getJudetBySlug(judetSlug);

    if (!loc || !judet) return {};

    const title = `Producție Publicitară în ${loc.name}, ${judet.name} - Tablou`;
    const description = `Comandă bannere publicitare, mesh-uri, autocolante și materiale printate cu livrare direct în ${loc.name} (${judet.name}). Producător direct, rezistență la exterior.`;

    const routeUrl = `https://tablou.net/judet/${judet.slug}/${loc.slug}`;

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
    };
}

export default async function LocalitatePage({ params }: { params: Promise<{ judetSlug: string, localitateSlug: string }> }) {
    const { judetSlug, localitateSlug } = await params;
    const loc = getLocalitateBySlug(judetSlug, localitateSlug);
    const judet = getJudetBySlug(judetSlug);

    if (!loc || !judet) notFound();

    const base = siteConfig.url;
    const allProducts = await getProducts();
    // Excludem fallbacks pentru un aspect mai curat
    const validProducts = allProducts.filter((p: any) => !p.id?.startsWith("fallback-") && (p.images?.length > 0 || p.image));

    const configurators = validProducts.filter((p: any) => p.metadata?.category !== "banner" || !p.metadata?.isSeoCampaign).slice(0, 8);
    const seoProducts = validProducts.filter((p: any) => p.metadata?.isSeoCampaign);

    const localSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": `Print și Publicitate Tablou ${loc.name}`,
        "provider": {
            "@type": "LocalBusiness",
            "name": "Tablou",
            "url": `${base}/judet/${judet.slug}/${loc.slug}`,
            "areaServed": {
                "@type": "City",
                "name": loc.name
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-24">
            <Script
                id="local-schema-city"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        localSchema,
                        {
                            "@context": "https://schema.org",
                            "@type": "BreadcrumbList",
                            "itemListElement": [
                                { "@type": "ListItem", "position": 1, "name": "Acasă", "item": "https://tablou.net/" },
                                { "@type": "ListItem", "position": 2, "name": judet.name, "item": `https://tablou.net/judet/${judet.slug}` },
                                { "@type": "ListItem", "position": 3, "name": loc.name }
                            ]
                        }
                    ])
                }}
            />

            <div className="container mx-auto px-4 sm:px-6">
                <nav className="text-sm font-medium text-slate-500 mb-8 flex gap-2 items-center">
                    <Link href="/judet" className="hover:text-orange-500 transition-colors">Județe</Link> /
                    <Link href={`/judet/${judet.slug}`} className="hover:text-orange-500 transition-colors">{judet.name}</Link> /
                    <span className="text-slate-900">{loc.name}</span>
                </nav>

                <header className="mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                        Configurează și Personalizează în <br /> <span className="text-orange-600">{loc.name} ({judet.name})</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl leading-relaxed">
                        Sistemele noastre de configurare îți permit să comanzi exact dimensiunea și opțiunile dorite. Totul cu livrare rapidă direct în localitatea ta.
                    </p>
                </header>

                <div className="mb-24">
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-8 border-b border-slate-200 pb-4">
                        1. Personalizare la Comandă (Configurează Dimensiuni)
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {configurators.map((p: any) => {
                            const cleanSlug = p.slug || p.id;
                            const productUrl = `/judet/${judet.slug}/${loc.slug}/${cleanSlug}`;

                            return (
                                <Link href={productUrl} key={p.id} className="group bg-white border-2 border-slate-100 rounded-3xl overflow-hidden hover:border-orange-500 hover:shadow-2xl hover:-translate-y-1 transition duration-300 flex flex-col relative">
                                    <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-black px-3 py-1 rounded-full z-10 shadow-lg uppercase tracking-wider">
                                        Configurabil
                                    </div>
                                    <div className="aspect-[4/3] relative bg-slate-100 overflow-hidden">
                                        <Image
                                            src={p.image || p.images?.[0] || '/placeholder.png'}
                                            alt={`${p.title} ${loc.name} montaj inclus`}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col bg-gradient-to-b from-white to-slate-50">
                                        <h2 className="text-xl font-black text-slate-900 mb-3 group-hover:text-orange-600 leading-tight">{p.title}</h2>
                                        <p className="text-sm text-slate-500 line-clamp-3 mb-6">
                                            {p.description || `Personalizare și print ${p.title} pentru afacerea ta din ${loc.name}. Configurează exact pe dimensiunile tale.`}
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

                {/* SEO SILO LINKS */}
                <div className="mt-20 border-t border-slate-200 pt-10">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Căutări frecvente în {loc.name} ({judet.name})</h3>
                    <div className="flex flex-wrap gap-2">
                        {seoProducts.map((p: any) => (
                            <Link
                                key={p.id}
                                href={`/judet/${judet.slug}/${loc.slug}/${p.slug || p.id}`}
                                className="text-xs bg-slate-100 hover:bg-orange-100 hover:text-orange-700 text-slate-500 py-2 px-4 rounded-full transition-colors border border-slate-200/50"
                            >
                                {p.title}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <SeoNetwork 
                judetSlug={judet.slug} 
                judetName={judet.name} 
                locSlug={loc.slug} 
                locName={loc.name} 
                currentDomain="tablou.net" 
            />
        </div>
    );
}
