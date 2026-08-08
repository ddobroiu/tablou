import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getLocalitateBySlug, getJudetBySlug } from "@/lib/localitati";
import { getProductBySlug, getProducts } from "@/lib/products";
import Script from "next/script";
import { ShieldCheck, Zap, Truck, MessageCircle, Star, Info, HelpCircle, MapPin, ArrowRight, ChevronLeft, ChevronRight, Globe, Award, Sparkles, CheckCircle2 } from "lucide-react";
import { CONFIGURATORS_REGISTRY } from "@/lib/configurators-registry";
import { buildLocalContent } from "@/lib/seo/localContent";
import { LocalFaq } from "@/components/LocalFaq";

import { MATERIALE_DATA } from "@/lib/seo/materialeData";
import { REGLEMENTARI_DATA } from "@/lib/seo/reglementariData";
import { STILURI_DATA } from "@/lib/seo/stiluriData";
import { INTENT_LABELS } from "@/lib/seo/intents";

function getTargetInfo(slug: string) {
    const normalized = slug.startsWith('pentru-') ? slug.replace('pentru-', '') : slug;
    
    // 1. Material
    const material = MATERIALE_DATA.find(m => m.slug === normalized || m.id === normalized);
    if (material) return { label: material.name.split(' (')[0] };

    // 2. Intent
    let label = INTENT_LABELS[normalized];
    if (label) return { label };

    // 3. Style / Regulation
    const style = STILURI_DATA.find(s => s.slug === normalized);
    if (style) return { label: style.name };
    
    const reg = REGLEMENTARI_DATA.find(r => r.slug === normalized);
    if (reg) return { label: reg.name };

    return null;
}

export async function generateMetadata({ params }: { params: Promise<{ judetSlug: string, localitateSlug: string, productSlug: string[] }> }) {
    const { judetSlug, localitateSlug, productSlug } = await params;
    const baseSlug = productSlug[0];
    const targetSlug = productSlug[1];

    const loc = getLocalitateBySlug(judetSlug, localitateSlug);
    const judet = getJudetBySlug(judetSlug);
    const product = getProductBySlug(baseSlug);

    if (!loc || !judet || !product) return {};

    const targetInfo = targetSlug ? getTargetInfo(targetSlug) : null;
    const productTitle = targetInfo ? `${product.title} ${targetInfo.label}` : product.title;

    const title = `Print ${productTitle} în ${loc.name}`;
    const { description } = buildLocalContent({
        brand: "tablou",
        productTitle,
        productSlug: baseSlug,
        locName: loc.name,
        judetSlug: judet.slug,
        judetName: judet.name,
    });

    const routeUrl = `https://www.tablou.net/judet/${judet.slug}/${loc.slug}/${productSlug.join('/')}`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: routeUrl,
            images: [(product as any).image || '/placeholder.png'],
        },
        alternates: { canonical: routeUrl }
    };
}

export default async function ProductLocalityPage({ params }: { params: Promise<{ judetSlug: string, localitateSlug: string, productSlug: string[] }> }) {
    const { judetSlug, localitateSlug, productSlug } = await params;
    const loc = getLocalitateBySlug(judetSlug, localitateSlug);
    const judet = getJudetBySlug(judetSlug);

    // Greedy Product Resolution for multi-segment slugs (e.g. banner-product/xxx)
    let productResolved = getProductBySlug(productSlug.join('/'));
    let baseSlug = productSlug.join('/');
    let targetSlug = null;

    if (!productResolved && productSlug.length > 1) {
        // Fallback: product is the first segment, second segment is the modifier (material/intent)
        baseSlug = productSlug[0];
        productResolved = getProductBySlug(baseSlug);
        targetSlug = productSlug[1];
    }

    const product = productResolved;
    if (!loc || !judet || !product) notFound();

    const targetInfo = targetSlug ? getTargetInfo(targetSlug) : null;
    const productTitle = targetInfo ? `${product.title} ${targetInfo.label}` : product.title;

    const productImage = (product as any).image || ((product as any).images?.[0]) || "/products/banner/banner-1.webp";
    
    let shopUrl = (product as any).routeSlug || (product as any).slug || product.id;
    if (!shopUrl.startsWith('/') && !shopUrl.startsWith('http')) {
        shopUrl = `/${shopUrl}`;
    }

    if (!shopUrl.startsWith('/configurator') && !shopUrl.startsWith('/shop') && !shopUrl.startsWith('/banner-product') && !shopUrl.startsWith('/semnalistica-product')) {
        if (baseSlug.includes('banner')) shopUrl = '/configurator/banner';
        else if (baseSlug.includes('canvas')) shopUrl = '/configurator/canvas';
        else if (baseSlug.includes('pliante') || baseSlug.includes('fluturas')) shopUrl = '/configurator/pliante';
        else if (baseSlug.includes('afis') || baseSlug.includes('poster')) shopUrl = '/configurator/afise';
        else if (baseSlug.includes('autocolant') || baseSlug.includes('sticker')) shopUrl = '/configurator/autocolante';
        else if (baseSlug.includes('rollup')) shopUrl = '/configurator/rollup';
        else if (baseSlug.includes('tapet')) shopUrl = '/configurator/tapet';
        else if (baseSlug.includes('window-graphics')) shopUrl = '/configurator/window-graphics';
        else if (baseSlug.includes('fonduri') || baseSlug.includes('pnrr')) shopUrl = '/configurator/fonduri-pnrr';
        else if (baseSlug.includes('tricou') || baseSlug.includes('textile')) shopUrl = '/configurator/tricouri';
        else if (baseSlug.includes('hanorac')) shopUrl = '/configurator/hanorace';
        else if (baseSlug.includes('sapca') || baseSlug.includes('sepci')) shopUrl = '/configurator/sepci';
    }

    const productCategoryKey = shopUrl.startsWith('/configurator/') ? shopUrl.replace('/configurator/', '') : baseSlug;
    const { heroText } = buildLocalContent({
        brand: "tablou",
        productTitle,
        productSlug: productCategoryKey,
        locName: loc.name,
        judetSlug: judet.slug,
        judetName: judet.name,
    });

    return (
        <div className="bg-[#fafafc] min-h-screen font-sans overflow-x-hidden w-full max-w-full box-border">
            <script
                id={`schema-${judetSlug}-${localitateSlug}-${productSlug.join('-')}`}
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        {
                            "@context": "https://schema.org/",
                            "@type": "Product",
                            "name": `${productTitle} - Livrare în ${loc.name}`,
                            "image": productImage,
                            "description": `Printăm și livrăm ${productTitle} în ${loc.name}, ${judet.name}. Calitate premium UV.`,
                            "brand": { "@type": "Brand", "name": "Tablou" },
                            "manufacturer": { "@type": "Organization", "name": "Tablou", "url": "https://www.tablou.net" },
                        }
                    ])
                }}
            />

            {/* Premium Header Space */}
            <div className="w-full bg-white border-b border-slate-100 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-slate-400 mb-8 uppercase tracking-[0.2em]">
                        <Link href="/judet" className="hover:text-emerald-500 transition-colors">Județe</Link> 
                        <span className="opacity-30">/</span>
                        <Link href={`/judet/${judet.slug}`} className="hover:text-slate-900 transition-colors">{judet.name}</Link>
                        <span className="opacity-30">/</span>
                        <Link href={`/judet/${judet.slug}/${loc.slug}`} className="hover:text-slate-900 transition-colors">{loc.name}</Link>
                    </nav>

                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 items-start">
                        {/* LEFT: Product Info */}
                        <div className="flex-1 w-full order-2 lg:order-1 lg:pt-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full text-emerald-600 font-black text-[10px] uppercase tracking-widest mb-6 border border-emerald-100 italic">
                                <Award size={12} /> Partener Local {loc.name}
                            </div>
                            
                            <h1 className="text-3xl min-[390px]:text-4xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tighter mb-6 uppercase italic break-words">
                                {productTitle} <br />
                                <span className="text-emerald-500 not-italic uppercase tracking-tighter shadow-sm whitespace-normal">în {loc.name}</span>
                            </h1>

                            <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed mb-10 max-w-2xl italic opacity-80">
                                {heroText}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                <Link 
                                    href={shopUrl} 
                                    className="px-10 py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-500 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-emerald-500/20 active:scale-95 group uppercase italic tracking-tighter"
                                >
                                    <Zap size={22} className="fill-current group-hover:animate-pulse" />
                                    CONFIGUREAZĂ ONLINE
                                </Link>
                                <a 
                                    href={`https://wa.me/40750473111?text=Bună%20ziua,%20as%20dori%20mai%20multe%20detalii%20despre%20${encodeURIComponent(product.title)}%20în%20${encodeURIComponent(loc.name)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-10 py-5 bg-white text-slate-900 border-2 border-slate-200 rounded-2xl font-black text-lg hover:border-emerald-500 hover:text-emerald-600 transition-all flex items-center justify-center gap-3 shadow-sm active:scale-95 group uppercase italic tracking-tighter"
                                >
                                    <MessageCircle size={22} className="group-hover:text-emerald-500" />
                                    WHATSAPP
                                </a>
                            </div>

                            <div className="flex flex-wrap gap-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-emerald-500">
                                        <Truck size={20} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Livrare rapidă<br/>{loc.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-amber-500">
                                        <Star size={20} className="fill-current" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Materiale<br/>Certificate</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-blue-500">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Garanție<br/>Print UV</span>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Visual Asset - Product Image First on Mobile */}
                        <div className="flex-1 w-full order-1 lg:order-2 mb-8 lg:mb-0">
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500/20 to-transparent rounded-[3rem] blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
                                <div className="relative aspect-square bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center justify-center p-8 overflow-hidden">
                                    <Image 
                                        src={productImage} 
                                        alt={product.title} 
                                        width={800} 
                                        height={800} 
                                        className="w-full h-full object-contain drop-shadow-2xl translate-y-4 group-hover:translate-y-0 transition-transform duration-700" 
                                    />
                                    {/* Local info badge */}
                                    <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-white/50 shadow-lg flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-xs font-black text-slate-900 uppercase">Producție activă {judet.name}</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-emerald-600">24H Livrare</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section - MODERN REDESIGN */}
            <div className="bg-slate-950 py-32 relative overflow-hidden">
                {/* Background decorative stuff */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-64 bg-emerald-500/10 blur-[120px] rounded-full" />
                
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 rounded-full text-emerald-400 font-black text-[10px] uppercase tracking-[0.2em] mb-6 border border-emerald-500/20">
                            <ShieldCheck size={14} /> Certificare Calitate Tablou
                        </div>
                        <h2 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tighter uppercase leading-[0.9] max-w-4xl mx-auto">
                            Standardul Premium în <span className="text-emerald-400">{loc.name}</span>
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
                            Nu facem compromisuri. Fiecare comandă de {product.title.toLowerCase()} expediată în județul {judet.name} trece printr-un control riguros sub semnătura Tablou.
                        </p>
                    </div>
    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { title: "Culori Vibrante", desc: "Folosim echipamente de ultimă generație cu cerneluri rezistente la raze UV și intemperii, garantate pentru ani de zile.", icon: <Sparkles size={28} />, color: "emerald" },
                            { title: "Suport Tehnic", desc: "Echipa noastră te ajută cu verificarea graficii, optimizarea fișierelor și sfaturi pentru cel mai bun rezultat final.", icon: <Globe size={28} />, color: "blue" },
                            { title: "Preț de Fabrică", desc: "Suntem producători direcți (fără intermediari), garantându-ți cel mai bun raport calitate-preț din România.", icon: <Zap size={28} className="fill-current" />, color: "amber" }
                        ].map((f, i) => (
                            <div key={i} className="group relative">
                                <div className="absolute inset-0 bg-emerald-500/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                <div className="relative h-full bg-white/5 backdrop-blur-sm p-10 rounded-[2.5rem] border border-white/10 hover:border-emerald-500/30 transition-all duration-500 flex flex-col">
                                    <div className={`w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center mb-8 text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500`}>
                                        {f.icon}
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight group-hover:text-emerald-400 transition-colors">{f.title}</h3>
                                    <p className="text-slate-500 leading-relaxed font-bold text-sm">{f.desc}</p>
                                    
                                    <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between opacity-50 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Verificat Tablou</span>
                                        <CheckCircle2 size={14} className="text-emerald-500/40 group-hover:text-emerald-400 transition-colors" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Other Products Section - MOVED HIGHER */}
            <div className="max-w-7xl mx-auto px-4 py-24">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">
                        <Zap size={14} className="text-emerald-500" /> TOATE CONFIGURATOARELE
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Produse în {loc.name}</h2>
                    <p className="text-slate-500 mt-4 font-medium italic">Vezi toată gama de produse disponibile cu livrare rapidă.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                    {CONFIGURATORS_REGISTRY.slice(0, 18).map((config) => {
                        const rpSlug = config.slug || config.id;
                        if (rpSlug === baseSlug) return null;

                        return (
                            <Link
                                key={config.id}
                                href={`/judet/${judet.slug}/${loc.slug}/${rpSlug}`}
                                className="group relative flex flex-col items-center text-center rounded-[2rem] border border-slate-200/60 transition-all duration-500 overflow-hidden hover:border-emerald-400 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.15)] hover:-translate-y-2 bg-white h-full"
                            >
                                <div className="w-full aspect-square relative bg-slate-50 border-b border-slate-100 flex items-center justify-center overflow-hidden">
                                    {config.image ? (
                                        <img
                                            src={config.image}
                                            alt={config.name}
                                            className="w-[70%] h-[70%] object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-slate-200 animate-pulse flex items-center justify-center text-slate-400 font-black uppercase text-[10px] tracking-widest">Imagine Lipsă</div>
                                    )}
                                    <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/[0.03] transition-colors duration-500" />
                                </div>

                                <div className="p-4 w-full flex-1 flex flex-col items-center justify-center bg-white relative">
                                    <h4 className="font-black text-[10px] md:text-xs leading-tight tracking-tight transition-all duration-300 text-slate-800 group-hover:text-emerald-600 uppercase italic tracking-tighter">
                                        {config.name}
                                    </h4>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Proximity Network */}
            <div className="bg-slate-900 py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                        <div>
                            <p className="text-emerald-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-3">Rețeaua Națională</p>
                            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase leading-[1]">Alte locații din județul {judet.name}</h2>
                        </div>
                        <Link href={`/judet/${judet.slug}`} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-all backdrop-blur-md">
                            Vezi tot județul
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {judet.localitati.filter(l => l.slug !== loc.slug).slice(0, 18).map((l, i) => (
                            <Link
                                key={l.slug}
                                href={`/judet/${judet.slug}/${l.slug}/${productSlug.join('/')}`}
                                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white hover:bg-white/10 hover:border-emerald-500/50 transition-all text-xs font-bold truncate text-center"
                            >
                                {product.title.split(' ')[0]} {l.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Local FAQ Section */}
            <div className="bg-white py-24 border-t border-slate-100">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">
                            <HelpCircle size={14} className="text-emerald-500" /> SUPORT LOCAL {loc.name.toUpperCase()}
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Întrebări Frecvente</h2>
                        <p className="text-slate-500 mt-4 font-medium italic">Tot ce trebuie să știi despre comanda ta de {productTitle.toLowerCase()} în {loc.name}.</p>
                    </div>
                    
                    <div className="bg-slate-50/50 rounded-[3rem] p-8 md:p-12 border border-slate-100">
                        <LocalFaq 
                            productTitle={productTitle} 
                            locName={loc.name} 
                            judetName={judet.name}
                        />
                    </div>
                </div>
            </div>

            {/* Mobile Sticky CTA */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 flex gap-3 md:hidden z-50">
                <Link 
                    href={shopUrl}
                    className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2"
                >
                    <Zap size={16} fill="white" /> Configurează
                </Link>
                <a 
                    href={`https://wa.me/40750473111?text=Buna%20ziua,%20as%20dori%20mai%20multe%20detalii%20despre%20${encodeURIComponent(product.title)}%20in%20${encodeURIComponent(loc.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#25D366] text-white py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                >
                    <MessageCircle size={18} fill="white" /> WhatsApp
                </a>
            </div>
            {/* Spacing for mobile sticky footer */}
            <div className="h-24 md:hidden"></div>
        </div>
    );
}
