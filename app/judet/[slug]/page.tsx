import React from "react";
import Link from "next/link";
import { JUDETE_DATA } from "@/lib/judeteData";
import { siteConfig } from "@/lib/siteConfig";
import Script from "next/script";

export async function generateStaticParams() {
    return JUDETE_DATA.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const data = JUDETE_DATA.find((j) => j.slug === slug);

    if (!data) return {};

    const cityName = data.localities[0] || data.name;

    const title = `Tablouri Canvas & Plexiglas ${data.name} - Calitate Premium Tablou.net`;
    const description = `Comandă tablouri personalizate în județul ${data.name}. Livrare rapidă în ${cityName}, ${data.localities.slice(1, 3).join(", ")}. Canvas, postere și plexiglas la preț de atelier.`;

    return {
        title,
        description,
        keywords: `tablou canvas ${data.name}, tablou plexiglas ${data.name}, postere personalizate ${data.name}, cadouri personalizate ${data.name}`,
        alternates: { canonical: `/judet/${data.slug}` },
    };
}

export default async function JudetPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const data = JUDETE_DATA.find((j) => j.slug === slug);

    if (!data) return <div className="container py-20 text-center font-serif italic text-2xl">Județul nu a fost găsit.</div>;

    const base = siteConfig.url;

    const services = [
        {
            name: `Tablouri Canvas în ${data.name}`,
            slug: "canvas",
            desc: "Imprimare pe pânză bumbac 100%, întinsă pe șasiu din lemn de brad. Culori rezistente 100 de ani.",
            price: "de la 79 RON"
        },
        {
            name: `Tablouri Plexiglas ${data.name}`,
            slug: "sticla-acrilica",
            desc: "Efect de profunzime uluitor și aspect modern. Imprimare directă pe sticlă acrilică (plexiglas).",
            price: "de la 129 RON"
        },
        {
            name: `Postere & Afișe ${data.name}`,
            slug: "afise",
            desc: "Hârtie foto premium mată sau lucioasă. Ideale pentru înrămare sau decor modern.",
            price: "de la 49 RON"
        },
        {
            name: `Configurator Artă AI`,
            slug: "editor",
            desc: "Generează artă unică folosind AI și transform-o într-un tablou livrat în județul tău.",
            price: "Înceracă acum"
        },
    ];

    const localSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": `Tablouri și Cadouri Personalizate Tablou.net ${data.name}`,
        "provider": {
            "@type": "LocalBusiness",
            "name": "Tablou.net",
            "url": `${base}/judet/${data.slug}`,
            "areaServed": {
                "@type": "AdministrativeArea",
                "name": `Județul ${data.name}`
            }
        }
    };

    return (
        <main className="pt-24 min-h-screen bg-white">
            <Script
                id="local-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }}
            />

            <div className="max-w-7xl mx-auto px-6 pb-24">
                <header className="mb-20 text-center">
                    <div className="inline-block mb-6 px-4 py-1 border border-slate-900 rounded-full text-xs uppercase tracking-[0.3em] font-medium">
                        Livrare în {data.name}
                    </div>
                    <h1 className="text-4xl md:text-7xl font-serif text-slate-900 mb-8 italic tracking-tight">
                        Amintirile tale devin artă în <span className="underline decoration-slate-200 underline-offset-8 decoration-4">{data.name}</span>
                    </h1>
                    <p className="text-2xl text-slate-500 leading-relaxed max-w-4xl mx-auto font-light">
                        Decorăm pereții caselor și birourilor din {data.name} de peste 10 ani. Expediem în maximă siguranță comenzi către <strong>{data.localities.join(", ")}</strong> și în orice localitate din județ.
                    </p>
                </header>

                <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
                    {services.map((service) => (
                        <div key={service.slug} className="flex flex-col p-8 bg-white border border-slate-100 rounded-3xl hover:border-slate-900 hover:shadow-2xl transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                            <h3 className="text-xl font-bold mb-4 relative z-10">{service.name}</h3>
                            <p className="text-sm text-slate-500 mb-8 flex-1 leading-relaxed relative z-10">{service.desc}</p>
                            <div className="flex flex-col gap-6 relative z-10">
                                <span className="text-slate-900 font-serif italic text-2xl">{service.price}</span>
                                <Link href={`/${service.slug}`} className="text-center bg-slate-900 text-white px-8 py-4 rounded-2xl font-medium hover:bg-slate-800 transition shadow-lg inline-block">
                                    Încarcă fotografie
                                </Link>
                            </div>
                        </div>
                    ))}
                </section>

                <section className="bg-slate-50 p-16 rounded-[4rem] mb-32 relative overflow-hidden">
                    <div className="relative z-10 lg:flex items-center gap-20">
                        <div className="lg:w-1/2">
                            <h2 className="text-4xl font-serif mb-8 italic">Peste 50.000 de povești printate</h2>
                            <p className="text-lg text-slate-500 leading-relaxed mb-10">Fie că ești din {data.localities[0]} sau din orice alt sat din județul {data.name}, calitatea rămâne aceeași. Folosim doar pânză de bumbac canvas premium și vopsele eco-solvent, sigure pentru camera copilului.</p>
                            <div className="grid grid-cols-2 gap-8 text-center md:text-left">
                                <div>
                                    <span className="block text-4xl font-serif mb-2">100%</span>
                                    <span className="text-xs uppercase tracking-widest text-slate-400">Bumbac Natural</span>
                                </div>
                                <div>
                                    <span className="block text-4xl font-serif mb-2">PRO</span>
                                    <span className="text-xs uppercase tracking-widest text-slate-400">Șasiu Lemn Brad</span>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2 mt-12 lg:mt-0 grid grid-cols-2 gap-4">
                            <div className="aspect-square bg-slate-200 rounded-3xl animate-pulse"></div>
                            <div className="aspect-square bg-slate-300 rounded-3xl translate-y-8 animate-pulse"></div>
                        </div>
                    </div>
                </section>

                <section className="mb-20">
                    <h2 className="text-3xl font-serif mb-12 text-center italic">Localități din județul {data.name} unde livrăm</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {data.localities.map((loc) => (
                            <span key={loc} className="px-6 py-3 bg-white border border-slate-100 rounded-2xl text-slate-600 text-sm font-medium shadow-sm hover:border-slate-900 transition flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-slate-900"></span>
                                {loc}
                            </span>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
