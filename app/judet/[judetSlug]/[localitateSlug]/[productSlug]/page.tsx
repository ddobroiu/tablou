import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getLocalitateBySlug, getJudetBySlug } from "@/lib/localitati";
import { getProductBySlug } from "@/lib/products";
import Script from "next/script";

export async function generateMetadata({ params }: { params: Promise<{ judetSlug: string, localitateSlug: string, productSlug: string }> }) {
    const { judetSlug, localitateSlug, productSlug } = await params;
    const loc = getLocalitateBySlug(judetSlug, localitateSlug);
    const judet = getJudetBySlug(judetSlug);
    const product = getProductBySlug(productSlug);

    if (!loc || !judet || !product) return {};

    const title = `Print ${product.title} în ${loc.name}, Județul ${judet.name} | Tablou`;
    const description = `Comandă online ${product.title.toLowerCase()} personalizat, cu livrare rapidă direct în ${loc.name} (${judet.name}). Rezistență maximă, print profesional, finisaje incluse.`;

    return {
        title,
        description,
        keywords: `${product.title} ${loc.name}, print ${(product as any).slug || product.id} ${loc.name}, productie ${product.title} ${judet.name}, comanda online ${loc.name}`,
    };
}

// Nu folosim generateStaticParams aici pentru a preveni crash-ul la build (avem ~420,000 pagini teoretice).
// Next.js le va randa On-Demand.

export default async function ProductLocalityPage({ params }: { params: Promise<{ judetSlug: string, localitateSlug: string, productSlug: string }> }) {
    const { judetSlug, localitateSlug, productSlug } = await params;

    const loc = getLocalitateBySlug(judetSlug, localitateSlug);
    const judet = getJudetBySlug(judetSlug);
    const product = getProductBySlug(productSlug);

    if (!loc || !judet || !product) notFound();

    const productImage = (product as any).image || ((product as any).images?.[0]) || "/placeholder.png";
    const shopUrl = `/${(product as any).routeSlug || (product as any).slug || product.id}`;

    return (
        <main className="min-h-screen bg-slate-50 pt-24 pb-24">
            <div className="container max-w-6xl">
                {/* Breadcrumb */}
                <nav className="text-sm font-medium text-slate-500 mb-12 flex flex-wrap gap-2 items-center">
                    <Link href="/judet" className="hover:text-orange-500 transition-colors">Județe</Link> /
                    <Link href={`/judet/${judet.slug}`} className="hover:text-orange-500 transition-colors">{judet.name}</Link> /
                    <Link href={`/judet/${judet.slug}/${loc.slug}`} className="hover:text-orange-500 transition-colors">{loc.name}</Link> /
                    <span className="text-slate-900 font-bold">{product.title}</span>
                </nav>

                <div className="flex flex-col lg:flex-row gap-16 items-start">

                    {/* Imagini */}
                    <div className="w-full lg:w-1/2">
                        <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl bg-white border border-slate-100">
                            <Image
                                src={productImage}
                                alt={`Print ${product.title} în ${loc.name}`}
                                fill
                                className="object-cover"
                                priority
                            />

                            {/* Livrare Badge Overlay */}
                            <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl px-6 py-3 flex items-center gap-3 border border-orange-500/20">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="font-bold text-slate-900">Livrăm în {loc.name}</span>
                            </div>
                        </div>
                    </div>

                    {/* Conținut SEO & Call to Action */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center">
                        <div className="inline-block px-4 py-2 bg-orange-100 text-orange-700 font-bold text-xs uppercase tracking-widest rounded-full mb-6 w-max">
                            Producție Publicitară {judet.name}
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tight">
                            Comandă <span className="text-orange-500">{product.title}</span> în <span className="underline decoration-orange-500/30 underline-offset-8">{loc.name}</span>
                        </h1>

                        <p className="text-xl text-slate-600 mb-10 leading-relaxed font-light">
                            Cauți un furnizor de încredere pentru <strong>{product.title}</strong> în <strong>{loc.name}, județul {judet.name}</strong>?
                            Suntem producători direcți: printăm cu tehnologie UV de ultimă generație și trimitem produsele finisate, gata de montaj, prin curier direct la ușa ta.
                        </p>

                        {product.description && (
                            <div className="mb-10 text-slate-500 prose">
                                <p>{product.description}</p>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 mb-16">
                            <Link href={shopUrl} className="flex-1 bg-slate-900 text-white text-center py-5 rounded-2xl font-black text-lg hover:bg-orange-600 transition-all shadow-xl shadow-slate-900/10 uppercase tracking-widest">
                                Configurează Produsul &rarr;
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200">
                            <div>
                                <h4 className="font-black text-slate-900 flex items-center gap-2 mb-2">
                                    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    Cerneală UV
                                </h4>
                                <p className="text-sm text-slate-500 line-clamp-2">Rezistență uimitoare la ploaie, soare și zgârieturi.</p>
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 flex items-center gap-2 mb-2">
                                    <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Livrare DPD {loc.name}
                                </h4>
                                <p className="text-sm text-slate-500 line-clamp-2">Producție directă și expediere 24-48h.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Structured Schema */}
            <Script
                id={`schema-${judetSlug}-${localitateSlug}-${productSlug}`}
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org/",
                        "@type": "Product",
                        "name": `${product.title} - Livrare în ${loc.name}`,
                        "image": productImage,
                        "description": `Printăm și livrăm ${product.title} în ${loc.name}, ${judet.name}. Calitate premium UV.`,
                        "brand": {
                            "@type": "Brand",
                            "name": "Tablou"
                        },
                        "offers": {
                            "@type": "Offer",
                            "priceCurrency": (product as any).currency || "RON",
                            "price": (product as any).priceBase || (product as any).price || "49",
                            "availability": "https://schema.org/InStock",
                            "areaServed": {
                                "@type": "City",
                                "name": loc.name
                            }
                        }
                    })
                }}
            />
        </main>
    );
}
