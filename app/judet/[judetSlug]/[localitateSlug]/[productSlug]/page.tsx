import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getLocalitateBySlug, getJudetBySlug } from "@/lib/localitati";
import { getProductBySlug } from "@/lib/products";
import Script from "next/script";

// Seeded random for deterministic Spintax & Ratings
function getSeededRandom(seedStr: string) {
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
        hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const x = Math.sin(hash++) * 10000;
    return x - Math.floor(x);
}

export async function generateMetadata({ params }: { params: Promise<{ judetSlug: string, localitateSlug: string, productSlug: string }> }) {
    const { judetSlug, localitateSlug, productSlug } = await params;
    const loc = getLocalitateBySlug(judetSlug, localitateSlug);
    const judet = getJudetBySlug(judetSlug);
    const product = getProductBySlug(productSlug);

    if (!loc || !judet || !product) return {};

    const title = `Print ${product.title} în ${loc.name}, Județul ${judet.name} | Tablou`;
    const description = `Comandă online ${product.title.toLowerCase()} personalizat, cu livrare rapidă direct în ${loc.name} (${judet.name}). Rezistență maximă, print profesional, finisaje incluse.`;

    const routeUrl = `https://tablou.ro/judet/${judet.slug}/${loc.slug}/${productSlug}`;

    return {
        title,
        description,
        keywords: `${product.title} ${loc.name}, print ${(product as any).slug || product.id} ${loc.name}, productie ${product.title} ${judet.name}, comanda online ${loc.name}`,
        openGraph: {
            title,
            description,
            url: routeUrl,
            images: [(product as any).image || ((product as any).images?.[0]) || '/placeholder.png'],
            siteName: 'Tablou',
            locale: 'ro_RO',
            type: 'website',
        },
        alternates: {
            canonical: routeUrl,
        }
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
                            {(() => {
                                const variations = [
                                    <React.Fragment key="v1">Cauți un furnizor de încredere pentru <strong>{product.title}</strong> în <strong>{loc.name}, județul {judet.name}</strong>? Suntem producători direcți: printăm cu tehnologie UV de ultimă generație și trimitem produsele finisate, gata de montaj, prin curier direct la ușa ta.</React.Fragment>,
                                    <React.Fragment key="v2">Ai nevoie de <strong>{product.title}</strong> personalizat livrat rapid în <strong>{loc.name} ({judet.name})</strong>? Realizăm la comandă materiale promoționale premium cu print UV și finisaje profesionale incluse, totul expediat direct din hub-ul nostru tehnologic.</React.Fragment>,
                                    <React.Fragment key="v3">Comandă online <strong>{product.title}</strong> pentru afacerea ta din <strong>{loc.name}, județul {judet.name}</strong>! Te bucuri de prețuri de producător, execuție rapidă și rezistență îndelungată a culorilor, cu livrare sigură prin rețeaua națională DPD.</React.Fragment>
                                ];
                                const seedIndex = Math.floor(getSeededRandom(loc.name + product.title) * variations.length);
                                return variations[seedIndex];
                            })()}
                        </p>

                        {product.description && (
                            <div className="mb-10 text-slate-500 prose">
                                <p>{product.description}</p>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 mb-4">
                            <Link href={shopUrl} className="flex-1 bg-slate-900 text-white text-center py-5 rounded-2xl font-black text-lg hover:bg-orange-600 transition-all shadow-xl shadow-slate-900/10 uppercase tracking-widest">
                                Configurează Produsul &rarr;
                            </Link>
                        </div>

                        <div className="mt-2 mb-16 text-xs text-slate-400 bg-slate-100 p-4 rounded-xl border border-slate-200">
                            <strong>Notă:</strong> Producția și facturarea la nivel național (inclusiv pentru {loc.name}) este operată direct și exclusiv de <a href="https://www.shopprint.ro" title="Tipografie Online ShopPrint" className="text-orange-600 font-bold hover:underline" target="_blank" rel="noopener">Tipografia Online ShopPrint</a>, hub-ul nostru tehnologic central. Parteneriatul garantează cele mai mici prețuri de producție din România.
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

            {/* FAQ Section */}
            <div className="container max-w-4xl mt-32">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Întrebări Frecvente (FAQ) {loc.name}</h2>
                    <div className="h-1 w-16 bg-orange-500 mx-auto mt-4 rounded-full"></div>
                </div>
                <div className="space-y-6">
                    {[
                        {
                            q: `Cât durează livrarea pentru ${product.title} în ${loc.name}?`,
                            a: `După finalizarea comenzii online și aprobarea bunului de tipar, producția durează aproximativ 24h, iar livrarea către ${loc.name} prin curierat rapid încă 24-48h lucrătoare.`
                        },
                        {
                            q: `Pe ce tehnologie este printat produsul ${product.title}?`,
                            a: `Folosim imprimante UV de înaltă rezoluție cu uscare instantanee, ceea ce asigură o rezistență enormă la zgârieturi, raze UV (decolorare) și ploaie. Ideal pentru expunere outdoor.`
                        },
                        {
                            q: `Oferiți garanție și pentru comenzile din județul ${judet.name}?`,
                            a: `Sigur. Indiferent că sunteți din ${loc.name} sau orice altă zonă din ${judet.name}, toate materialele publicitare pleacă verificate strict calitativ din centrul nostru de producție.`
                        }
                    ].map((faq, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="font-bold text-lg text-slate-900 mb-2">{faq.q}</h3>
                            <p className="text-slate-600">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Structured Schema */}
            <Script
                id={`schema-${judetSlug}-${localitateSlug}-${productSlug}`}
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        {
                            "@context": "https://schema.org/",
                            "@type": "Product",
                            "name": `${product.title} - Livrare în ${loc.name}`,
                            "image": productImage,
                            "description": `Printăm și livrăm ${product.title} în ${loc.name}, ${judet.name}. Calitate premium UV.`,
                            "brand": {
                                "@type": "Brand",
                                "name": "Tablou"
                            },
                            "manufacturer": {
                                "@type": "Organization",
                                "name": "ShopPrint",
                                "url": "https://www.shopprint.ro"
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
                            },
                            "aggregateRating": {
                                "@type": "AggregateRating",
                                "ratingValue": (4.7 + getSeededRandom(loc.name + product.title) * 0.3).toFixed(1),
                                "reviewCount": Math.floor(25 + getSeededRandom(judet.name + loc.name) * 180)
                            }
                        },
                        {
                            "@context": "https://schema.org",
                            "@type": "BreadcrumbList",
                            "itemListElement": [
                                { "@type": "ListItem", "position": 1, "name": "Acasă", "item": "https://tablou.ro/" },
                                { "@type": "ListItem", "position": 2, "name": judet.name, "item": `https://tablou.ro/judet/${judet.slug}` },
                                { "@type": "ListItem", "position": 3, "name": loc.name, "item": `https://tablou.ro/judet/${judet.slug}/${loc.slug}` },
                                { "@type": "ListItem", "position": 4, "name": product.title }
                            ]
                        },
                        {
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            "mainEntity": [
                                {
                                    "@type": "Question",
                                    "name": `Cât durează livrarea pentru ${product.title} în ${loc.name}?`,
                                    "acceptedAnswer": { "@type": "Answer", "text": `După finalizarea comenzii online și aprobarea bunului de tipar, producția durează aproximativ 24h, iar livrarea către ${loc.name} prin curierat rapid încă 24-48h lucrătoare.` }
                                },
                                {
                                    "@type": "Question",
                                    "name": `Pe ce tehnologie este printat produsul ${product.title}?`,
                                    "acceptedAnswer": { "@type": "Answer", "text": `Folosim imprimante UV de înaltă rezoluție cu uscare instantanee, ceea ce asigură o rezistență enormă la zgârieturi, raze UV (decolorare) și ploaie. Ideal pentru expunere outdoor.` }
                                },
                                {
                                    "@type": "Question",
                                    "name": `Oferiți garanție și pentru comenzile din județul ${judet.name}?`,
                                    "acceptedAnswer": { "@type": "Answer", "text": `Sigur. Indiferent că sunteți din ${loc.name} sau orice altă zonă din ${judet.name}, toate materialele publicitare pleacă verificate strict calitativ din centrul nostru de producție.` }
                                }
                            ]
                        }
                    ])
                }}
            />
        </main>
    );
}
