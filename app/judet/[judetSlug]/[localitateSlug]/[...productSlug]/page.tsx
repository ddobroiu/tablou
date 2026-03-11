import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getLocalitateBySlug, getJudetBySlug } from "@/lib/localitati";
import { getProductBySlug, getProducts } from "@/lib/products";
import Script from "next/script";
import SeoNetwork from "@/components/seo/SeoNetwork";

// Seeded random for deterministic Spintax & Ratings
function getSeededRandom(seedStr: string) {
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
        hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const x = Math.sin(hash++) * 10000;
    return x - Math.floor(x);
}

export async function generateMetadata({ params }: { params: Promise<{ judetSlug: string, localitateSlug: string, productSlug: string[] }> }) {
    const { judetSlug, localitateSlug, productSlug } = await params;
    const productSlugStr = Array.isArray(productSlug) ? productSlug.join('/') : productSlug;

    const loc = getLocalitateBySlug(judetSlug, localitateSlug);
    const judet = getJudetBySlug(judetSlug);
    const product = getProductBySlug(productSlugStr);

    if (!loc || !judet || !product) return {};

    const title = `Print ${product.title} în ${loc.name}, Județul ${judet.name} | Tablou`;
    const description = `Comandă online ${product.title.toLowerCase()} personalizat, cu livrare rapidă direct în ${loc.name} (${judet.name}). Rezistență maximă, print profesional, finisaje incluse.`;

    const routeUrl = `https://tablou.net/judet/${judet.slug}/${loc.slug}/${productSlugStr}`;

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

export default async function ProductLocalityPage({ params }: { params: Promise<{ judetSlug: string, localitateSlug: string, productSlug: string[] }> }) {
    const { judetSlug, localitateSlug, productSlug } = await params;
    const productSlugStr = Array.isArray(productSlug) ? productSlug.join('/') : productSlug;

    const loc = getLocalitateBySlug(judetSlug, localitateSlug);
    const judet = getJudetBySlug(judetSlug);
    const product = getProductBySlug(productSlugStr);

    if (!loc || !judet || !product) notFound();

    const productImage = (product as any).image || ((product as any).images?.[0]) || "/placeholder.png";
    const shopUrl = `/${(product as any).routeSlug || (product as any).slug || product.id}`;

    // Cross-Linking: Get recommended products
    const allProducts = await getProducts();
    const recommendedProducts = allProducts
        .filter(p => p.id !== product.id)
        .sort((a, b) => getSeededRandom(a.id + loc.slug + product.id) - 0.5)
        .slice(0, 4);

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-24">
            <div className="container mx-auto px-4 sm:px-6">
                {/* Breadcrumb */}
                <nav className="text-sm font-medium text-slate-500 mb-12 flex flex-wrap gap-2 items-center">
                    <Link href="/judet" className="hover:text-orange-500 transition-colors">Județe</Link> /
                    <Link href={`/judet/${judet.slug}`} className="hover:text-orange-500 transition-colors">{judet.name}</Link> /
                    <Link href={`/judet/${judet.slug}/${loc.slug}`} className="hover:text-orange-500 transition-colors">{loc.name}</Link> /
                    <span className="text-slate-900 font-bold">{product.title}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
                    {/* Imagini */}
                    <div className="w-full">
                        <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl bg-white border border-slate-100">
                            <Image
                                src={productImage}
                                alt={`${product.title} ${loc.name} montaj inclus`}
                                fill
                                className="object-cover"
                                priority
                                fetchPriority="high"
                            />
                            <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl px-6 py-3 flex items-center gap-3 border border-orange-500/20">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="font-bold text-slate-900">Livrăm în {loc.name}</span>
                            </div>
                        </div>
                    </div>

                    {/* Conținut SEO & Call to Action */}
                    <div className="w-full flex flex-col justify-center">
                        <div className="inline-block px-4 py-2 bg-orange-100 text-orange-700 font-bold text-xs uppercase tracking-widest rounded-full mb-6 w-max">
                            Tablouri & Canvas {judet.name}
                        </div>

                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tight">
                            Comandă <span className="text-orange-500">{product.title}</span> în <span className="underline decoration-orange-500/30 underline-offset-8">{loc.name}</span>
                        </h1>

                        <p className="text-xl text-slate-600 mb-10 leading-relaxed font-light">
                            {(() => {
                                const isFonduri = productSlugStr.includes('pnrr') || productSlugStr.includes('regional') || productSlugStr.includes('adr') || productSlugStr.includes('fonduri') || productSlugStr.includes('program') || productSlugStr.includes('panou') || productSlugStr.includes('autocolant') || productSlugStr.includes('placa');
                                const isComunicat = productSlugStr.includes('comunicat');

                                if (isFonduri || isComunicat) {
                                    const fonduriVariations = [
                                        <React.Fragment key="f1">Aveți un proiect finanțat prin <strong>PNRR sau Programul Regional</strong> la <strong>{loc.name}</strong>? Asigurăm vizibilitatea obligatorie prin <strong>{product.title}</strong> conform MIV, plus publicitatea obligatorie (<strong>comunicat de presă</strong>) integrată. Livrăm rapid în județul {judet.name}.</React.Fragment>,
                                        <React.Fragment key="f2">Pentru proiectul dvs. din <strong>{loc.name}</strong>, oferim soluția premium: <strong>{product.title}</strong> optimizate pentru fonduri europene și <strong>publicarea comunicatului de presă</strong> obligatoriu. Producem materiale rezistente UV direct în hub-ul central.</React.Fragment>,
                                        <React.Fragment key="f3">Respectați normele de transparență PNRR/PR în <strong>{loc.name}, județul {judet.name}</strong> comandând setul de vizibilitate. De la <strong>comunicat de presă</strong> la <strong>{product.title}</strong> (plăci, panouri, autocolante), le livrăm pe toate rapid prin curier.</React.Fragment>
                                    ];
                                    const fSeedIndex = Math.floor(getSeededRandom(loc.name + productSlugStr + "fonduri") * fonduriVariations.length);
                                    return fonduriVariations[fSeedIndex];
                                }

                                const variations = [
                                    <React.Fragment key="v1">Cauți un furnizor de încredere pentru <strong>{product.title}</strong> în <strong>{loc.name}, județul {judet.name}</strong>? Suntem producători direcți: printăm cu tehnologie de ultimă generație și trimitem produsele finisate, gata de expunere, prin curier direct la ușa ta.</React.Fragment>,
                                    <React.Fragment key="v2">Ai nevoie de <strong>{product.title}</strong> personalizat livrat rapid în <strong>{loc.name} ({judet.name})</strong>? Realizăm la comandă tablouri și materiale deco premium cu print de înaltă rezoluție, totul expediat direct din hub-ul nostru tehnologic.</React.Fragment>,
                                    <React.Fragment key="v3">Comandă online <strong>{product.title}</strong> pentru casa sau afacerea ta din <strong>{loc.name}, județul {judet.name}</strong>! Te bucuri de prețuri de producător, execuție rapidă și rezistență îndelungată a culorilor, cu livrare sigură prin rețeaua națională DPD.</React.Fragment>
                                ];
                                const seedIndex = Math.floor(getSeededRandom(loc.name + product.title) * variations.length);
                                return variations[seedIndex];
                            })()}
                        </p>

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
                                    Calitate Premium
                                </h4>
                                <p className="text-sm text-slate-500 line-clamp-2">Culori vibrante și rezistență uimitoare în timp.</p>
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 flex items-center gap-2 mb-2">
                                    <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Livrare {loc.name}
                                </h4>
                                <p className="text-sm text-slate-500 line-clamp-2">Producție directă și expediere 24-48h.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Industry Specific Solutions Hub */}
            <div className="container mx-auto px-4 sm:px-6 mt-32 border-t border-slate-200 pt-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Soluții Deco în {loc.name}</h2>
                    <div className="h-1 w-16 bg-orange-500 mx-auto mt-4 rounded-full"></div>
                    <p className="text-slate-500 mt-4 max-w-2xl mx-auto">Alege pachetul de vizibilitate sau decor optim pentru spațiul tău din județul {judet.name}.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {(() => {
                        const industryProducts = allProducts.filter(p =>
                            (p as any).metadata?.isSeoCampaign &&
                            p.id !== product.id &&
                            !p.id.includes('pret') && !p.id.includes('ieftin')
                        ).slice(0, 8);

                        return industryProducts.map(ip => (
                            <Link
                                key={ip.id}
                                href={`/judet/${judet.slug}/${loc.slug}/${(ip as any).routeSlug || (ip as any).slug || ip.id}`}
                                className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-orange-500 hover:shadow-xl transition-all text-sm font-bold flex items-center justify-between group shadow-sm"
                            >
                                <span className="text-slate-700 group-hover:text-orange-600 transition-colors">{ip.title.replace('Tablou ', '').replace('Canvas ', '')}</span>
                                <span className="text-orange-500 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">&rarr;</span>
                            </Link>
                        ));
                    })()}
                </div>
            </div>

            {/* Local Advantage section */}
            <div className="container mx-auto px-4 sm:px-6 mt-32">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all border-b-4 border-b-orange-500">
                        <h3 className="text-xl font-black text-slate-900 mb-4 uppercase">Experiență locală în {loc.name}</h3>
                        <p className="text-slate-600 leading-relaxed">
                            {(() => {
                                const variations = [
                                    `Am livrat peste ${Math.floor(50 + getSeededRandom(loc.name) * 450)} proiecte deco în zona ${loc.name}. Cunoaștem gusturile locale și oferim soluții adaptate pentru județul ${judet.name}.`,
                                    `Suntem partenerul preferat al clienților din ${loc.name} pentru ${product.title}. Calitatea printului nostru garantează un aspect premium oricărei încăperi.`,
                                    `Echipa noastră monitorizează constant standardele de calitate pentru toate tablourile livrate în ${loc.name}.`
                                ];
                                return variations[Math.floor(getSeededRandom(loc.slug + "exp") * variations.length)];
                            })()}
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all border-b-4 border-b-green-500">
                        <h3 className="text-xl font-black text-slate-900 mb-4 uppercase">Specificații Tehnice {product.title}</h3>
                        <p className="text-slate-600 leading-relaxed">
                            {(() => {
                                const variations = [
                                    `Folosim pânză de bumbac 100% și șasiu din lemn de pin uscat. Rezistența culorilor este garantată pe viață la interior.`,
                                    `Printul este realizat la rezoluție de 1440 DPI, oferind detalii incredibile pentru orice ${product.title}. Tehnologia noastră asigură culori naturale.`,
                                    `Fiecare ${product.title} comandat pentru ${loc.name} trece printr-un proces riguros de verificare a calității înainte de ambalare.`
                                ];
                                return variations[Math.floor(getSeededRandom(loc.slug + "tech") * variations.length)];
                            })()}
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all border-b-4 border-b-blue-500">
                        <h3 className="text-xl font-black text-slate-900 mb-4 uppercase">Logistica Jud. {judet.name}</h3>
                        <p className="text-slate-600 leading-relaxed">
                            {(() => {
                                const variations = [
                                    `Livrarea în ${loc.name} se face prin rețeaua DPD. Timpul mediu de tranzit este de 24h de la finalizarea producției.`,
                                    `Am optimizat rutele de transport către ${loc.name} pentru a reduce costurile. Tablourile tale ajung în siguranță, ambalate corespunzător.`,
                                    `Asigurăm transport securizat direct la ușa ta din ${loc.name} sau în orice punct din județul ${judet.name}.`
                                ];
                                return variations[Math.floor(getSeededRandom(loc.slug + "log") * variations.length)];
                            })()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Reviews section */}
            <div className="container mx-auto px-4 sm:px-6 mt-32">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Ce spun clienții din {loc.name}</h2>
                    <div className="h-1 w-16 bg-orange-500 mx-auto mt-4 rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(() => {
                        const names = ["Andrei M.", "Elena Popescu", "Mihai Ionescu", "Cosmin G.", "Ramona B.", "Stefan Radu", "Iulia D.", "Alexandru V."];
                        const texts = [
                            `Calitate excelentă pentru ${product.title}. A ajuns în ${loc.name} mai rapid decât mă așteptam.`,
                            `Am comandat pentru casa mea din ${judet.name} și sunt foarte mulțumită de culori. Recomand!`,
                            `Profesionalism și promptitudine. Tabloul arată impecabil montat în living-ul din ${loc.name}.`,
                            `Cea mai bună ofertă de preț pentru ${product.title} pe care am găsit-o online.`,
                            `Printul chiar face diferența. Arată superb pe peretele din ${loc.name}.`,
                            `Recomand cu încredere. Proces simplu de configurare și livrare fără probleme în județul ${judet.name}.`
                        ];
                        const reviews = [];
                        for (let i = 0; i < 3; i++) {
                            const nIndex = Math.floor(getSeededRandom(loc.name + product.id + i) * names.length);
                            const tIndex = Math.floor(getSeededRandom(product.id + loc.name + (i + 5)) * texts.length);
                            reviews.push({ name: names[nIndex], text: texts[tIndex] });
                        }
                        return reviews.map((rev, idx) => (
                            <div key={idx} className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                <div className="flex text-orange-500 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                    ))}
                                </div>
                                <p className="italic text-slate-600 mb-4 whitespace-pre-line leading-relaxed">"{rev.text}"</p>
                                <p className="font-black text-slate-900 text-sm">— {rev.name}, Locuitor {loc.name}</p>
                            </div>
                        ));
                    })()}
                </div>
            </div>

            {/* FAQ Section */}
            <div className="container mx-auto px-4 sm:px-6 mt-32">
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
                            a: `Folosim imprimante UV de înaltă rezoluție cu uscare instantanee, ceea ce asigură o rezistență enormă la zgârieturi, raze UV (decolorare) și ploaie. Ideal pentru expunere deco.`
                        },
                        {
                            q: `Oferiți garanție și pentru comenzile din județul ${judet.name}?`,
                            a: `Sigur. Indiferent că sunteți din ${loc.name} sau orice altă zonă din ${judet.name}, toate produsele pleacă verificate strict calitativ din centrul nostru de producție.`
                        }
                    ].map((faq, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:border-orange-200">
                            <h3 className="font-bold text-lg text-slate-900 mb-2">{faq.q}</h3>
                            <p className="text-slate-600">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Localities listing section */}
            <div className="container mx-auto px-4 sm:px-6 mt-24 border-t border-slate-200 pt-16">
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Efectuăm livrări {product.title} și în alte localități din {judet.name}</h2>
                    <p className="text-slate-500 mt-2">Dacă vrei să comanzi în altă parte decât {loc.name}, onorăm servicii în zonele următoare:</p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                    {(() => {
                        const allLocs = judet.localitati.filter(l => l.slug !== loc.slug);
                        const shuffled = [...allLocs].sort((a, b) => getSeededRandom(a.slug + productSlugStr) - 0.5);
                        const selection = shuffled.slice(0, 4);
                        return selection.map((otherLoc) => (
                            <Link
                                key={otherLoc.slug}
                                href={`/judet/${judet.slug}/${otherLoc.slug}/${productSlugStr}`}
                                className="bg-white border border-slate-200 text-slate-600 hover:text-white hover:bg-orange-600 hover:border-orange-600 px-4 py-2 rounded-xl text-sm font-black transition-all"
                            >
                                {product.title} {otherLoc.name}
                            </Link>
                        ));
                    })()}
                </div>
            </div>

            {/* Recommended Products */}
            <div className="container mx-auto px-4 sm:px-6 mt-24 border-t border-slate-200 pt-16">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Clienții din {loc.name} au comandat și</h2>
                    <div className="h-1 w-16 bg-orange-500 mx-auto mt-4 rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {recommendedProducts.map(rp => {
                        const rpImage = (rp as any).image || ((rp as any).images?.[0]) || "/placeholder.png";
                        const rpSlug = (rp as any).routeSlug || rp.slug || rp.id;
                        return (
                            <Link
                                key={rp.id}
                                href={`/judet/${judet.slug}/${loc.slug}/${rpSlug}`}
                                className="group bg-white border border-slate-100 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 block"
                            >
                                <div className="aspect-[4/3] relative w-full overflow-hidden bg-slate-50">
                                    <Image src={rpImage} fill className="object-cover group-hover:scale-105 transition-transform duration-500" alt={rp.title} />
                                </div>
                                <div className="p-6">
                                    <h3 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors mb-2 text-lg">{rp.title}</h3>
                                    <p className="text-slate-500 text-sm line-clamp-2">{rp.description}</p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Structured Schema */}
            <Script
                id={`schema-${judetSlug}-${localitateSlug}-${productSlugStr}`}
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        {
                            "@context": "https://schema.org/",
                            "@type": "Product",
                            "name": `${product.title} - Livrare în ${loc.name}`,
                            "image": productImage,
                            "description": `Printăm și livrăm ${product.title} în ${loc.name}, ${judet.name}. Calitate premium.`,
                            "brand": { "@type": "Brand", "name": "Tablou" },
                            "manufacturer": { "@type": "Organization", "name": "Tablou", "url": "https://tablou.net" },
                            "offers": {
                                "@type": "Offer",
                                "priceCurrency": (product as any).currency || "RON",
                                "price": (product as any).priceBase || (product as any).price || "49",
                                "availability": "https://schema.org/InStock",
                                "areaServed": { "@type": "City", "name": loc.name }
                            }
                        },
                        {
                            "@context": "https://schema.org",
                            "@type": "BreadcrumbList",
                            "itemListElement": [
                                { "@type": "ListItem", "position": 1, "name": "Acasă", "item": "https://tablou.net/" },
                                { "@type": "ListItem", "position": 2, "name": judet.name, "item": `https://tablou.net/judet/${judet.slug}` },
                                { "@type": "ListItem", "position": 3, "name": loc.name, "item": `https://tablou.net/judet/${judet.slug}/${loc.slug}` },
                                { "@type": "ListItem", "position": 4, "name": product.title }
                            ]
                        }
                    ])
                }}
            />

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
