import React from "react";
import Link from "next/link";
import { getJudetBySlug } from "@/lib/localitati";
import { getProducts } from "@/lib/products";
import { notFound } from "next/navigation";
import { MapPin, ArrowRight } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ judetSlug: string }> }) {
    const { judetSlug } = await params;
    const judet = getJudetBySlug(judetSlug);
    if (!judet) return {};

    const title = `Tablouri Canvas din Poza Ta, Livrate în Județul ${judet.name}`;
    const description = `Tablouri canvas personalizate, colaje foto și seturi de 3, cu șasiu de lemn inclus, livrate prin curier în județul ${judet.name}. Din același atelier: fototapet, tricouri, afișe, bannere și panouri rigide, cu preț calculat pe loc.`;

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
        // Canvasul din poza clientului primul, apoi fototapetul și textilele,
        // apoi restul catalogului pentru firme.
        const order = ['configurator-canvas', 'configurator-tapet', 'configurator-tricouri', 'configurator-hanorace', 'configurator-sepci', 'configurator-afise', 'configurator-banner', 'configurator-rollup', 'configurator-autocolant'];
        const idxA = order.indexOf(a.id);
        const idxB = order.indexOf(b.id);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        return idxA !== -1 ? -1 : idxB !== -1 ? 1 : 0;
    });

    // Indexul județului listează toate localitățile lui, nu doar reședința.
    const targetLocalities = judet.localitati.map((loc) => ({ loc }));
    const primaryLocalitySlug = judet.localitati[0]?.slug;
    const primaryLocalityName = targetLocalities[0]?.loc.name || judet.localitati[0]?.name;

    const faq = [
        {
            q: `Livrați tablouri canvas în tot județul ${judet.name}?`,
            a: `Da. Tablourile pleacă din atelierul nostru din Buzău prin curier, ambalate cu colțare de protecție și folie, către orice adresă din județul ${judet.name}. Livrarea durează de regulă o zi după ce tabloul iese din producție.`
        },
        {
            q: `Cum comand un tablou din poza mea pentru ${primaryLocalityName}?`,
            a: "Încarci fotografia în configurator, alegi formatul și vezi pe loc prețul și cum arată pe pânză. Verificăm gratuit rezoluția pozei înainte de print, iar tabloul vine gata întins pe șasiu de lemn, cu sistem de agățat montat."
        },
        {
            q: `Pot comanda și materiale pentru firmă în județul ${judet.name}?`,
            a: "Da. Același atelier printează fototapet, tricouri și hanorace personalizate, afișe, pliante, bannere, roll-up-uri și panouri rigide. Fiecare produs are configurator cu preț calculat din dimensiuni și cantitate."
        }
    ];

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
                            "mainEntity": faq.map((f) => ({
                                "@type": "Question",
                                "name": f.q,
                                "acceptedAnswer": { "@type": "Answer", "text": f.a }
                            }))
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
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                        <div className="min-w-0">
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">
                                Tablouri canvas în <span className="text-emerald-500">{judet.name}</span>
                            </h1>
                            <p className="text-lg text-slate-500 mt-4 max-w-2xl">
                                Poza ta, printată pe pânză și întinsă pe șasiu de lemn, livrată prin curier oriunde în județul {judet.name}. Alege localitatea pentru pagina ei, sau încarcă poza direct în configurator.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 shrink-0">
                            <Link
                                href="/configurator/canvas"
                                className="inline-flex items-center justify-center px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest bg-emerald-600 text-white hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20 active:scale-[0.99]"
                            >
                                Încarcă poza
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest border-2 border-slate-200 bg-white text-slate-900 hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm active:scale-[0.99]"
                            >
                                Cere ofertă
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-16">
                {/* Configurators Grid */}
                <div className="mb-20">
                    <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">Ce printăm pentru {judet.name}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {configurators.map((p, i) => (
                            <Link
                                href={`/judet/${judet.slug}/${primaryLocalitySlug}/${p.routeSlug || p.slug || p.id}`}
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
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Livrare în {judet.name}</h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-4 gap-x-8">
                        {targetLocalities.map(({ loc }) => (
                            <Link
                                key={loc.slug}
                                href={`/judet/${judet.slug}/${loc.slug}`}
                                className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors py-1 flex items-center justify-between group"
                            >
                                {loc.name}
                                <span className="opacity-0 group-hover:opacity-100 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full transition-all">VEZI</span>
                            </Link>
                        ))}
                    </div>
                    <p className="text-sm text-slate-500 mt-10">
                        Livrăm prin curier în toate localitățile din județul {judet.name}, nu doar în cele de mai sus. Comanda se face din orice configurator, cu adresa ta de livrare.
                    </p>
                </div>
            </div>

        </div>
    );
}
