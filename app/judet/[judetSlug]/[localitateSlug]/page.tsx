import React from "react";
import Link from "next/link";
import { getLocalitateBySlug, getJudetBySlug } from "@/lib/localitati";
import { siteConfig } from "@/lib/siteConfig";
import Script from "next/script";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/products";
import Image from "next/image";

export async function generateMetadata({ params }: { params: Promise<{ judetSlug: string, localitateSlug: string }> }) {
    const { judetSlug, localitateSlug } = await params;
    const loc = getLocalitateBySlug(judetSlug, localitateSlug);
    const judet = getJudetBySlug(judetSlug);

    if (!loc || !judet) return {};

    const title = `Producție Publicitară în ${loc.name}, ${judet.name} - Tablou`;
    const description = `Comandă bannere publicitare, mesh-uri, autocolante și materiale printate cu livrare direct în ${loc.name} (${judet.name}). Producător direct, rezistență la exterior.`;

    const routeUrl = `https://tablou.ro/judet/${judet.slug}/${loc.slug}`;

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
        <main className="min-h-screen bg-slate-50 pt-24 pb-24">
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
                                { "@type": "ListItem", "position": 1, "name": "Acasă", "item": "https://tablou.ro/" },
                                { "@type": "ListItem", "position": 2, "name": judet.name, "item": `https://tablou.ro/judet/${judet.slug}` },
                                { "@type": "ListItem", "position": 3, "name": loc.name }
                            ]
                        }
                    ])
                }}
            />

            <div className="container">
                <nav className="text-sm font-medium text-slate-500 mb-8 flex gap-2 items-center">
                    <Link href="/judet" className="hover:text-orange-500 transition-colors">Județe</Link> /
                    <Link href={`/judet/${judet.slug}`} className="hover:text-orange-500 transition-colors">{judet.name}</Link> /
                    <span className="text-slate-900">{loc.name}</span>
                </nav>

                <header className="mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                        Materiale Publicitare în <br /> <span className="text-orange-600">{loc.name} ({judet.name})</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl leading-relaxed">
                        Producem la calitate superioară și expediem direct prin DPD în localitatea ta. Selectează produsul de mai jos pentru detalii specifice.
                    </p>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {validProducts.map((p: any) => {
                        const rootSlug = p.routeSlug || p.slug || p.id;
                        const productUrl = `/judet/${judet.slug}/${loc.slug}/${rootSlug}`;

                        return (
                            <Link href={productUrl} key={p.id} className="group bg-white border border-slate-200 rounded-3xl overflow-hidden hover:border-orange-500 hover:shadow-2xl transition duration-300 flex flex-col">
                                <div className="aspect-[4/3] relative bg-slate-100 overflow-hidden">
                                    <Image
                                        src={p.image || p.images?.[0] || '/placeholder.png'}
                                        alt={p.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h2 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-orange-600">{p.title} {loc.name}</h2>
                                    <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                                        {p.description || `Personalizare și print ${p.title} pentru afacerea ta din ${loc.name}.`}
                                    </p>
                                    <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center text-sm font-bold">
                                        <span className="text-slate-400">Vezi preturi</span>
                                        <span className="text-orange-500">Comandă în {loc.name} &rarr;</span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
