import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { CheckCircle2, Star } from 'lucide-react';
import { INDUSTRIE_DATA } from '@/lib/seo/industriiData';
import { CONFIGURATORS_REGISTRY } from '@/lib/configurators-registry';

export async function generateMetadata({ params }: { params: Promise<{ industrySlug: string }> }): Promise<Metadata> {
    const { industrySlug } = await params;
    const ind = INDUSTRIE_DATA.find(i => i.slug === industrySlug);
    if (!ind) return {};

    return {
        title: `${ind.title} Industry`,
        description: ind.description,
        alternates: { canonical: `https://www.tablou.net/industrii/${ind.slug}` }
    };
}

export default async function IndustryPage({ params }: { params: Promise<{ industrySlug: string }> }) {
    const { industrySlug } = await params;
    const ind = INDUSTRIE_DATA.find(i => i.slug === industrySlug);
    if (!ind) notFound();

    const isRecommended = (slug: string) => ind.recommendedProducts.includes(slug);

    // Sort: recommended products first, then the rest
    const allProducts = [...CONFIGURATORS_REGISTRY].sort((a, b) => {
        const aRec = isRecommended(a.slug || a.id) ? 1 : 0;
        const bRec = isRecommended(b.slug || b.id) ? 1 : 0;
        return bRec - aRec;
    });

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": `Ce produse de print sunt recomandate pentru industria ${ind.name.split(' (')[0]}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Pentru ${ind.name.split(' (')[0]}, recomandăm în special ${ind.recommendedProducts.join(', ')}, deoarece aceste materiale oferă vizibilitate maximă și durabilitate specifică acestui domeniu.`
                }
            },
            {
                "@type": "Question",
                "name": `Cât durează execuția materialelor pentru ${ind.name.split(' (')[0]}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Execuția majorității produselor (bannere, autocolante, rollup-uri) se realizează în 24-48 de ore lucrătoare de la confirmarea graficii."
                }
            },
            {
                "@type": "Question",
                "name": `Oferiți prețuri preferențiale pentru comenzi de volum în sectorul ${ind.name.split(' (')[0]}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Da, Tablou oferă soluții personalizate și pachete de preț avantajoase pentru companii din industria ${ind.name.split(' (')[0]} care au nevoi recurente sau volume mari de print.`
                }
            }
        ]
    };

    return (
        <div className="min-h-screen bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            {/* Split Hero */}
            <div className="relative pt-24 min-h-[70vh] flex items-center overflow-hidden">
                <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                    <div>
                        <Link href="/industrii" className="inline-flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-widest mb-8 hover:gap-3 transition-all">
                            &larr; Toate Industriile
                        </Link>
                        <h1 className="text-5xl md:text-[5.5rem] font-black text-slate-900 tracking-tighter leading-[0.8] mb-8">
                            {ind.name.split(' (')[0]} <br />
                            <span className="text-emerald-500 italic">Soluții Expert.</span>
                        </h1>
                        <p className="text-xl text-slate-600 font-medium leading-relaxed mb-10 max-w-xl">
                            {ind.longDescription}
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="#produse" className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-emerald-600 transition-all uppercase tracking-widest shadow-xl">
                                Catalog Complet de Produse
                            </Link>
                            <a
                                href={`https://wa.me/40750473111?text=${encodeURIComponent(`Bună ziua, vă contactez pentru soluții de print pentru industria ${ind.name.split(' (')[0]}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-10 py-5 rounded-2xl font-black text-lg transition-all uppercase tracking-widest shadow-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                                WhatsApp
                            </a>
                        </div>
                    </div>
                    <div className="relative aspect-square lg:aspect-auto lg:h-[600px] rounded-[3rem] overflow-hidden shadow-2xl rotate-2">
                        <Image
                            src="/tablou.webp"
                            alt={`${ind.name.split(' (')[0]} - Tablou`}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent" />
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <section className="py-32 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {ind.benefits.map((benefit, i) => (
                            <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                    <CheckCircle2 size={24} />
                                </div>
                                <p className="text-lg font-bold text-slate-800 leading-tight">{benefit}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ALL Products Grid - recommended first */}
            <section id="produse" className="py-24">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.8]">
                            Toate materialele <br /> <span className="text-emerald-500">pentru {ind.slug}.</span>
                        </h2>
                        <p className="text-slate-500 mt-6 max-w-xl mx-auto font-medium">
                            Produsele marcate cu{' '}
                            <span className="inline-flex items-center gap-1 text-amber-500 font-bold">
                                <Star size={14} fill="currentColor" /> Recomandat
                            </span>{' '}
                            sunt cele mai utilizate în domeniu.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
                        {allProducts.map((p) => {
                            const productUrl = `/industrii/${ind.slug}/${p.slug || p.id}`;
                            const image = p.image || '/placeholder.png';
                            const rec = isRecommended(p.slug || p.id);

                            return (
                                <Link href={productUrl} key={p.id} className="group flex flex-col">
                                    <div className={`aspect-square relative rounded-[2.5rem] overflow-hidden border transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-2xl ${rec ? 'bg-emerald-50 border-emerald-200 group-hover:border-emerald-400' : 'bg-slate-50 border-slate-100 group-hover:border-slate-300'}`}>
                                        <Image
                                            src={image}
                                            alt={p.name}
                                            fill
                                            className="object-contain p-8 group-hover:scale-110 transition-transform duration-700"
                                        />

                                        {/* Recommended badge */}
                                        {rec && (
                                            <div className="absolute top-3 left-3 flex items-center gap-1 bg-amber-400 text-slate-900 px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wide shadow-sm">
                                                <Star size={10} fill="currentColor" /> Recomandat
                                            </div>
                                        )}

                                        {/* Hover overlay */}
                                        <div className="absolute bottom-3 left-3 right-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                            <div className="bg-white/95 backdrop-blur-md py-2.5 rounded-xl text-center font-black text-[9px] uppercase tracking-widest text-slate-900 shadow-lg">
                                                Configurează &rarr;
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 px-1">
                                        <h3 className={`text-sm md:text-base font-black transition-colors leading-tight tracking-tight ${rec ? 'text-slate-900 group-hover:text-emerald-600' : 'text-slate-700 group-hover:text-slate-900'}`}>
                                            {p.name}
                                        </h3>
                                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">{p.category}</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="pb-32 container mx-auto px-6">
                <div className="bg-slate-950 rounded-[4rem] p-12 md:p-32 text-center relative overflow-hidden isolate">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#10b98111_0%,transparent_70%)] -z-10"></div>
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-8 leading-[0.9]">
                            Vrei un pachet personalizat <br /> <span className="text-emerald-400">pentru afacerea ta?</span>
                        </h2>
                        <p className="text-slate-400 text-lg md:text-xl font-medium mb-12">
                            Dacă ai nevoie de o ofertă de volum sau soluții complete de branding, echipa noastră te poate ajuta.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href="/contact" className="bg-white text-slate-950 px-10 py-5 rounded-2xl font-black text-lg hover:bg-emerald-400 transition-all uppercase tracking-widest">
                                Discută cu un Expert
                            </Link>
                            <a href="https://wa.me/40750473111" className="bg-emerald-500 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-emerald-600 transition-all uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg">
                                WhatsApp Instant
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
