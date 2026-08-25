import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ArrowRight, CheckCircle2, MessageCircle, Zap } from 'lucide-react';
import { INDUSTRIE_DATA } from '@/lib/seo/industriiData';
import { CONFIGURATORS_REGISTRY } from '@/lib/configurators-registry';
import { siteConfig } from '@/lib/siteConfig';

// Spintax helper - seed salted with the site domain so the same industry/product
// slug doesn't render identical copy across every site in the network.
function spintax(text: string, seed: string) {
    const matches = text.match(/\{[^{}]+\}/g);
    if (!matches) return text;

    const salted = `${siteConfig.domain}::${seed}`;
    let hash = 0;
    for (let i = 0; i < salted.length; i++) {
        hash = salted.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    let result = text;
    matches.forEach((match) => {
        const choices = match.slice(1, -1).split('|');
        const index = Math.abs(hash) % choices.length;
        result = result.replace(match, choices[index]);
    });
    return result;
}

export async function generateMetadata({ params }: { params: Promise<{ industrySlug: string, productSlug: string }> }): Promise<Metadata> {
    const { industrySlug, productSlug } = await params;
    const ind = INDUSTRIE_DATA.find(i => i.slug === industrySlug);
    const prod = CONFIGURATORS_REGISTRY.find(p => (p.slug || p.id) === productSlug);
    
    if (!ind || !prod) return {};

    const title = `${prod.name} pentru ${ind.name.split(' (')[0]} | Tablou`;
    const description = `Comandă ${prod.name.toLowerCase()} personalizate special pentru ${ind.name.split(' (')[0]}. Producție rapidă 24-48h, calitate UV și prețuri de producător.`;

    return {
        title,
        description,
        alternates: { canonical: `https://www.tablou.net/industrii/${ind.slug}/${productSlug}` }
    };
}

export default async function IndustryProductPage({ params }: { params: Promise<{ industrySlug: string, productSlug: string }> }) {
    const { industrySlug, productSlug } = await params;
    const ind = INDUSTRIE_DATA.find(i => i.slug === industrySlug);
    const prod = CONFIGURATORS_REGISTRY.find(p => (p.slug || p.id) === productSlug);
    
    if (!ind || !prod) notFound();

    const industryName = ind.name.split(' (')[0];
    const productName = prod.name;
    const seed = `${industrySlug}-${productSlug}`;

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": `De ce să alegi ${productName} pentru afacerea ta din sectorul ${industryName}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Produsele noastre tip ${productName} sunt optimizate pentru nevoile specifice din ${industryName}, oferind atât estetica necesară cât și durabilitatea cerută de acest domeniu de activitate.`
                }
            },
            {
                "@type": "Question",
                "name": `Cât costă ${productName.toLowerCase()} personalizate pentru ${industryName}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Prețul se calculează în funcție de dimensiuni și cantitate. Folosește configuratorul nostru online pentru a vedea prețul exact instantaneu.`
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

            <div className="pt-24 pb-12 border-b border-slate-100">
                <div className="container mx-auto px-6">
                    <nav className="text-[10px] font-black text-slate-400 mb-6 flex gap-3 items-center uppercase tracking-widest">
                        <Link href="/industrii" className="hover:text-emerald-600">Industrii</Link> 
                        <span>/</span>
                        <Link href={`/industrii/${ind.slug}`} className="hover:text-emerald-600">{industryName}</Link> 
                        <span>/</span>
                        <span className="text-slate-900">{productName}</span>
                    </nav>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h1 className="text-4xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter leading-[0.9]">
                                {productName} <br />
                                <span className="text-emerald-500 italic">pentru {industryName}</span>
                            </h1>
                            <p className="text-xl text-slate-500 mb-10 leading-relaxed">
                                {spintax(`{Realizăm|Producem|Oferim} ${productName.toLowerCase()} {premium|de calitate superioară|personalizate} adaptate {perfect|ideal} pentru cerințele sectorului ${industryName}. {Livrare rapidă în 24-48h direct din producția noastră.|Comandă online și beneficiezi de prețuri de producător.}`, seed)}
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link 
                                    href={prod.url} 
                                    className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-emerald-600 transition-all uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl"
                                >
                                    Configurează Acum
                                    <ArrowRight size={20} />
                                </Link>
                                <a 
                                    href={`https://wa.me/40750473111?text=${encodeURIComponent(`Bună ziua, doresc detalii despre ${productName} pentru ${industryName}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-emerald-500 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-emerald-600 transition-all uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg"
                                >
                                    <MessageCircle size={22} />
                                    WhatsApp
                                </a>
                            </div>
                        </div>
                        <div className="relative aspect-square bg-slate-50 rounded-[3rem] overflow-hidden border border-slate-100 shadow-xl p-12">
                            <Image 
                                src={prod.image || '/placeholder.png'} 
                                alt={`${productName} personalizat pentru ${industryName}`}
                                fill
                                className="object-contain p-12"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Industry Specific Benefits */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <p className="text-emerald-600 font-black uppercase tracking-widest text-xs mb-4 underline decoration-emerald-200 decoration-4 underline-offset-4">De ce Tablou?</p>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Alegerea Inteligentă pentru <br/> <span className="text-emerald-500 italic">{industryName}</span></h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {ind.benefits.map((benefit, i) => (
                            <div key={i} className="flex gap-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 items-start">
                                <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-slate-900 mb-2">{benefit}</p>
                                    <p className="text-sm text-slate-500 leading-relaxed">Optimizat special pentru fluxul de lucru și cerințele de marketing ale afacerilor tip {industryName}.</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Technical Detail */}
            <section className="py-24">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                            <div className="flex items-center gap-4 text-emerald-600">
                                <Zap fill="currentColor" size={24} />
                                <span className="font-black uppercase tracking-widest text-sm">Specificații Tehnice</span>
                            </div>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-[0.8]">Print de înaltă <br/> <span className="text-emerald-500">rezoluție 1440 DPI.</span></h2>
                            <ul className="space-y-4">
                                {[
                                    `Materiale rezistente la UV și intemperii (outdoor)`,
                                    `Cei mai buni timpi de producție pentru ${industryName}`,
                                    `Cerneluri ecologice certificate pentru spații interioare`,
                                    `Posibilitatea de personalizare la milimetru`
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-600 font-medium">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32 transition-all group-hover:bg-emerald-500/20" />
                           <h3 className="text-3xl font-black mb-6 italic tracking-tighter">Ai un proiect complex?</h3>
                           <p className="text-slate-400 mb-10 text-lg leading-relaxed font-medium">Pentru volume mari sau pachete complete de semnalistică pentru {industryName}, oferim consultanță gratuită și prețuri negociate de volum.</p>
                           <Link href="/contact" className="inline-block bg-white text-slate-900 px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-lg">
                               Solicită Ofertă Personalizată &rarr;
                           </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export async function generateStaticParams() {
    const params: { industrySlug: string, productSlug: string }[] = [];
    INDUSTRIE_DATA.forEach(ind => {
        CONFIGURATORS_REGISTRY.forEach(prod => {
            params.push({
                industrySlug: ind.slug,
                productSlug: prod.slug || prod.id
            });
        });
    });
    return params;
}
