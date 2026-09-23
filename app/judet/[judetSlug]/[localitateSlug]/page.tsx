import { siteConfig } from "@/lib/siteConfig";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getLocalitateBySlug, getJudetBySlug } from "@/lib/localitati";
import { CONFIGURATORS_REGISTRY } from "@/lib/configurators-registry";

// Toate localitățile au pagină: nu pre-generăm nimic, se randează la cerere din
// lib/seo/ro_localitati.json. Restrângerea la o listă "curată" (plus
// dynamicParams = false) scotea ~13.000 de pagini care aduceau trafic organic.

export async function generateMetadata({ params }: { params: Promise<{ judetSlug: string, localitateSlug: string }> }) {
    const { judetSlug, localitateSlug } = await params;
    const loc = getLocalitateBySlug(judetSlug, localitateSlug);
    const judet = getJudetBySlug(judetSlug);

    if (!loc || !judet) return {};

    const title = `Tablouri Canvas din Poza Ta în ${loc.name}`;
    const description = `Comandă tablouri canvas personalizate, colaje foto și seturi de 3 cu livrare în ${loc.name}, județul ${judet.name}. Șasiu de lemn inclus, poza verificată gratuit, gata în 2-4 zile. Tot aici: fototapet, tricouri, afișe, bannere și panouri rigide.`;

    const routeUrl = `${siteConfig.url}/judet/${judet.slug}/${loc.slug}`;

    return {
        title,
        description,
        keywords: `tablou canvas ${loc.name}, tablouri personalizate ${loc.name}, canvas din poza ${loc.name}, fototapet ${loc.name}, print ${loc.name}`,
        openGraph: {
            title,
            description,
            url: routeUrl,
            siteName: 'Tablou.net',
            locale: 'ro_RO',
            type: 'website',
        },
        alternates: { canonical: routeUrl },
        robots: { index: true, follow: true },
    };
}

export default async function LocalitatePage({ params }: { params: Promise<{ judetSlug: string, localitateSlug: string }> }) {
    const { judetSlug, localitateSlug } = await params;
    const loc = getLocalitateBySlug(judetSlug, localitateSlug);
    const judet = getJudetBySlug(judetSlug);

    if (!loc || !judet) notFound();

    // Canvasul primul, apoi decor/textile, apoi restul catalogului.
    const configurators = [
        ...CONFIGURATORS_REGISTRY.filter((c) => c.category === 'decor'),
        ...CONFIGURATORS_REGISTRY.filter((c) => c.category === 'textile'),
        ...CONFIGURATORS_REGISTRY.filter((c) => c.category !== 'decor' && c.category !== 'textile'),
    ];
    const siblingLocalities = judet.localitati.filter((l) => l.slug !== loc.slug);

    const faq = [
        {
            q: `Cât durează până primesc tabloul în ${loc.name}?`,
            a: "Printul, întinsul pe șasiu și uscarea durează 2-4 zile lucrătoare, iar curierul mai adaugă de regulă o zi. Dacă tabloul e cadou cu dată fixă, scrie-ne data în comentariile comenzii și îți confirmăm dacă putem intra la termen."
        },
        {
            q: "Ce rezoluție trebuie să aibă poza?",
            a: "Pentru un tablou de 40×60 cm ajunge o fotografie de minimum 2000×3000 pixeli, adică orice poză făcută cu un telefon din ultimii ani. Configuratorul îți spune pe loc dacă poza e prea mică pentru formatul ales, iar un coleg o mai verifică o dată înainte de print."
        },
        {
            q: `Puteți livra tabloul direct la persoana care primește cadoul, în ${loc.name}?`,
            a: "Da. Pui la comandă adresa destinatarului, iar factura se trimite pe e-mailul tău, nu în colet. Ambalăm cu colțare de protecție și folie, iar la cerere adăugăm o felicitare cu mesajul tău."
        },
        {
            q: `Ce altceva printați pentru ${loc.name}?`,
            a: "Din același atelier pleacă fototapet din poza ta, tricouri, hanorace și șepci personalizate, afișe, pliante, cărți de vizită, bannere, roll-up-uri, autocolante și panouri rigide. Fiecare produs are configurator cu preț calculat instant."
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            <script
                id="local-schema-city"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        {
                            "@context": "https://schema.org",
                            "@type": "Service",
                            "name": `Tablouri canvas personalizate Tablou.net ${loc.name}`,
                            "provider": {
                                "@type": "LocalBusiness",
                                "name": "Tablou.net",
                                "url": `${siteConfig.url}/judet/${judet.slug}/${loc.slug}`,
                                "areaServed": { "@type": "City", "name": loc.name }
                            }
                        },
                        {
                            "@context": "https://schema.org",
                            "@type": "BreadcrumbList",
                            "itemListElement": [
                                { "@type": "ListItem", "position": 1, "name": "Acasă", "item": `${siteConfig.url}/` },
                                { "@type": "ListItem", "position": 2, "name": judet.name, "item": `${siteConfig.url}/judet/${judet.slug}` },
                                { "@type": "ListItem", "position": 3, "name": loc.name }
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
            <div className="pt-24 pb-12 border-b border-slate-100">
                <div className="container mx-auto px-6">
                    <nav className="text-[10px] font-black text-slate-400 mb-6 flex gap-3 items-center uppercase tracking-widest">
                        <Link href="/judet" className="hover:text-emerald-600 transition-colors">Județe</Link>
                        <span>/</span>
                        <Link href={`/judet/${judet.slug}`} className="hover:text-emerald-600 transition-colors">{judet.name}</Link>
                        <span>/</span>
                        <span className="text-slate-900">{loc.name}</span>
                    </nav>
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                        <div className="min-w-0">
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tighter">
                                Tablouri canvas <span className="text-emerald-500">{loc.name}</span>
                            </h1>
                            <p className="text-lg text-slate-500 max-w-2xl">
                                O poză din telefon, printată pe pânză și întinsă pe șasiu de lemn, livrată prin curier în <span className="text-slate-900 font-bold">{loc.name}</span>. Un singur tablou, colaj sau set de 3, pentru nuntă, botez, aniversări sau cadou pentru părinți.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 shrink-0">
                            <Link
                                href={`/judet/${judet.slug}/${loc.slug}/canvas`}
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

            {/* Main Content - Configurators */}
            <section className="py-40">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6">Ce printăm pentru <span className="text-emerald-500">{loc.name}</span></h2>
                        <div className="h-2 w-24 bg-emerald-500 mx-auto rounded-full mb-8"></div>
                        <p className="text-xl text-slate-500 font-light max-w-2xl mx-auto">Tablourile canvas sunt primele, dar același atelier face și fototapetul, tricourile, afișele și bannerele. Fiecare produs are configurator cu preț calculat pe loc.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                        {configurators.map((p) => {
                            const cleanSlug = p.slug || p.id;
                            const productUrl = `/judet/${judet.slug}/${loc.slug}/${cleanSlug}`;

                            return (
                                <Link
                                    href={productUrl}
                                    key={p.id}
                                    className="group flex flex-col items-center text-center space-y-8"
                                >
                                    <div className="w-full aspect-square bg-slate-50 rounded-[4rem] overflow-hidden border border-slate-100 group-hover:border-emerald-500 group-hover:shadow-2xl group-hover:-translate-y-4 transition-all duration-700 relative">
                                        <Image
                                            src={p.image || '/placeholder.png'}
                                            alt={`${p.name} personalizat în ${loc.name}, județul ${judet.name} - Tablou.net`}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                        />
                                        <div className="absolute bottom-6 left-6 right-6">
                                             <div className="bg-white/90 backdrop-blur-md text-slate-900 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all">
                                                Configurează &rarr;
                                             </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors mb-2">{p.name}</h3>
                                        <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Preț de producător</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Local Trust Section */}
            <section className="py-40 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-emerald-500/5 rounded-full blur-[200px]"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center max-w-5xl">
                    <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-16 leading-[0.8]">
                        Gata de agățat, <br /> <span className="text-emerald-500 italic">ambalat ca pentru cadou</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-left">
                        {[
                            { title: "Șasiu de lemn inclus", text: "Pânza vine întinsă pe șasiu de lemn uscat, cu marginile oglindite și sistem de agățat montat pe spate. Îți trebuie doar un cui." },
                            { title: "Poza verificată gratuit", text: "Fiecare fotografie e deschisă de un om înainte de print. Dacă e prea mică pentru formatul ales, îți spunem înainte, nu după." },
                            { title: `Livrare în ${loc.name}`, text: "Tabloul pleacă prin curier cu colțare de protecție și folie, cu AWB pe e-mail. Factura vine pe e-mail, nu în colet, când e cadou." }
                        ].map((item, i) => (
                            <div key={i} className="space-y-6">
                                <div className="text-emerald-500 font-black text-4xl">0{i+1}.</div>
                                <h3 className="text-2xl font-bold">{item.title}</h3>
                                <p className="text-slate-400 text-lg font-light leading-relaxed">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Other Localities List */}
            {siblingLocalities.length > 0 && (
                <section className="py-32 bg-slate-50">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-slate-200 pb-16">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Tablouri canvas în județul {judet.name}</h2>
                                <p className="text-slate-500 mt-2 font-medium">Livrăm tablouri personalizate și în localitățile vecine:</p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {siblingLocalities.slice(0, 8).map(l => (
                                    <Link
                                        key={l.slug}
                                        href={`/judet/${judet.slug}/${l.slug}`}
                                        className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl text-sm font-black hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                                    >
                                        {l.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

        </div>
    );
}
