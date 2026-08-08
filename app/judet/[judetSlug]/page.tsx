import React from "react";
import Link from "next/link";
import { getJudetBySlug } from "@/lib/localitati";
import { getProducts } from "@/lib/products";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";
import Script from "next/script";

export async function generateMetadata({ params }: { params: Promise<{ judetSlug: string }> }) {
    const { judetSlug } = await params;
    const judet = getJudetBySlug(judetSlug);
    if (!judet) return {};

    const title = `Producție Publicitară în Județul ${judet.name}`;
    const description = `Livrăm materiale publicitare, bannere și tablouri canvas în tot județul ${judet.name}. Vezi lista localităților și produsele noastre de top.`;

    return {
        title,
        description,
        alternates: {
            canonical: `https://www.tablou.net/judet/${judetSlug}`
        }
    };
}

export default async function JudetPage({ params }: { params: Promise<{ judetSlug: string }> }) {
    const { judetSlug } = await params;
    const judet = getJudetBySlug(judetSlug);
    if (!judet) notFound();

    const products = await getProducts();
    const configurators = products.filter(p => 
        p.metadata?.category?.toLowerCase() === 'configuratoare'
    ).sort((a, b) => {
        const order = ['configurator-banner', 'configurator-rollup', 'configurator-autocolant', 'configurator-canvas'];
        const idxA = order.indexOf(a.id);
        const idxB = order.indexOf(b.id);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        return idxA !== -1 ? -1 : 1;
    });

    return (
        <div className="bg-white min-h-screen pb-20">
            <script
                id={`schema-judet-${judetSlug}`}
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        {
                            "@context": "https://schema.org",
                            "@type": "BreadcrumbList",
                            "itemListElement": [
                                { "@type": "ListItem", "position": 1, "name": "Acasă", "item": "https://www.tablou.net/" },
                                { "@type": "ListItem", "position": 2, "name": "Județe", "item": "https://www.tablou.net/judet" },
                                { "@type": "ListItem", "position": 3, "name": judet.name }
                            ]
                        },
                        {
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            "mainEntity": [
                                {
                                    "@type": "Question",
                                    "name": `Tablou livrează în tot județul ${judet.name}?`,
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": `Da, livrăm materiale publicitare și print digital în toate localitățile din județul ${judet.name} prin curierat rapid DPD Express.`
                                    }
                                },
                                {
                                    "@type": "Question",
                                    "name": `Cum pot comanda bannere sau canvas în ${judet.name}?`,
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Comanda se face direct online. Alegeți produsul, introduceți dimensiunile dorite în configurator și finalizați comanda. Producția începe imediat după confirmarea graficii."
                                    }
                                }
                            ]
                        }
                    ])
                }}
            />
            {/* Simple Header - No Hero */}
            <div className="border-b border-slate-100">
                <div className="container mx-auto px-6 py-12">
                     <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-6 uppercase tracking-wider">
                        <Link href="/judet" className="hover:text-slate-900 transition-colors">Județe</Link> 
                        <span>/</span>
                        <span className="text-slate-900">{judet.name}</span>
                    </nav>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">
                        Producție Publicitară <span className="text-emerald-500">{judet.name}</span>
                    </h1>
                    <p className="text-lg text-slate-500 mt-4 max-w-2xl">
                        Alege localitatea ta pentru a vedea oferta personalizată și timpul de livrare estimat prin DPD Express.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 py-16">
                {/* Configurators Grid */}
                <div className="mb-20">
                    <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">Sisteme de Configurare în {judet.name}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {configurators.map((p, i) => (
                            <Link 
                                href={`/judet/${judet.slug}/${judet.localitati[0].slug}/${p.routeSlug || p.slug || p.id}`}
                                key={i}
                                className="group bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:bg-white hover:shadow-xl transition-all"
                            >
                                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">{p.title}</h3>
                                <p className="text-xs text-slate-500 uppercase font-bold tracking-widest flex items-center gap-2">
                                    Vezi detalii <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Localities Index */}
                <div className="bg-slate-50 rounded-[2.5rem] p-10 md:p-16 border border-slate-100">
                    <div className="flex items-center gap-4 mb-12">
                        <MapPin className="text-emerald-500" size={32} />
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Index Localități {judet.name}</h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-4 gap-x-8">
                        {judet.localitati.map((loc) => (
                            <Link
                                key={loc.name}
                                href={`/judet/${judet.slug}/${loc.slug}`}
                                className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors py-1 flex items-center justify-between group"
                            >
                                {loc.name}
                                <span className="opacity-0 group-hover:opacity-100 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full transition-all">VEZI</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}
