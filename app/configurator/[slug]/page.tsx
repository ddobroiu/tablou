import { Suspense } from 'react';
import Script from 'next/script';
import { siteConfig } from '@/lib/siteConfig';
import ConfiguratorDispatcher from "@/components/configurator/ConfiguratorDispatcher";
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SeoDimensionsLinks } from '@/components/SeoDimensionsLinks';
import { INTENT_LABELS } from '@/lib/seo/intents';
import { SeoIntentLanding } from '@/components/SeoIntentLanding';
import { SeoDimensionLanding } from '@/components/SeoDimensionLanding';
import SeoProductContent from '@/components/seo/SeoProductContent';

interface Props {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Regex to match "product-WxH" (e.g., banner-100x50, canvas-40x60)
const SLUG_PATTERN = /^([a-z-]+)-(\d+)x(\d+)$/i;

const PRODUCT_NAMES: Record<string, string> = {
    'banner': 'Banner Frontlit',
    'banner-verso': 'Banner Față-Verso',
    'mesh': 'Mesh publicitar',
    'afise': 'Afiș HD',
    'autocolante': 'Autocolant',
    'canvas': 'Tablou Canvas',
    'tapet': 'Tapet Personalizat',
    'rollup': 'Sistem Roll-up',
    'window-graphics': 'Sticker Geam',
    'pliante': 'Pliant',
    'flayere': 'Flyer / Fluturaș',
    'plexiglass': 'Plexiglass',
    'pvc-forex': 'PVC Forex',
    'alucobond': 'Alucobond',
    'fonduri-eu': 'Panou Fonduri Europene',
    'polipropilena': 'Placă Polipropilenă',
    'carton': 'Placă Carton',
    'carti-vizita': 'Cărți de Vizită',
    'tricouri': 'Tricou Personalizat',
    'hanorace': 'Hanorac Personalizat',
    'sepci': 'Șapcă Personalizată',
};

function parseSlug(slug: string) {
    if (!slug) return null;
    
    // 1. Try WxH pattern: /^([a-z-]+)-(\d+)x(\d+)$/i
    const match = slug.match(SLUG_PATTERN);
    if (match) {
        let [_, fullProductId, w, h] = match;
        
        // Find the most specific base product ID from PRODUCT_NAMES that starts the fullProductId
        // Example: 'banner-spalatorie-haine' -> 'banner' is the base product
        let baseProductId = "";
        let productSlugFragment = "";
        
        // Sort keys by length descending to match longest possible base name (e.g., 'banner-verso' over 'banner')
        const sortedKeys = Object.keys(PRODUCT_NAMES).sort((a, b) => b.length - a.length);
        
        for (const key of sortedKeys) {
            if (fullProductId === key) {
                baseProductId = key;
                break;
            } else if (fullProductId.startsWith(`${key}-`)) {
                baseProductId = key;
                productSlugFragment = fullProductId.replace(`${key}-`, '');
                break;
            }
        }
        
        if (baseProductId) {
            return { 
                productId: baseProductId, 
                productName: PRODUCT_NAMES[baseProductId], 
                productSlug: productSlugFragment || undefined,
                w: parseInt(w), 
                h: parseInt(h) 
            };
        }
        
        // Fallback to original logic if no base found
        return { productId: fullProductId, productName: fullProductId, w: parseInt(w), h: parseInt(h) };
    }
    
    // 2. Try Intent pattern (e.g., product-intent)
    for (const productId of Object.keys(PRODUCT_NAMES)) {
        if (slug.startsWith(`${productId}-`)) {
            const intent = slug.replace(`${productId}-`, '');
            if (INTENT_LABELS[intent]) {
                return {
                    productId,
                    productName: PRODUCT_NAMES[productId],
                    intent,
                    intentLabel: INTENT_LABELS[intent]
                };
            }
        }
    }
    
    return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const parsed = parseSlug(slug);
    
    if (!parsed) {
        return {
            title: "Configurator Personalizat",
            description: "Personalizează produsul tău la dimensiunea dorită cu Tablou."
        };
    }

    if (parsed.intent) {
        const title = `${parsed.productName} ${parsed.intentLabel}`;
        const description = `Comandă ${parsed.productName} pentru ${parsed.intentLabel}. Modele gata de personalizat, print premium și livrare rapidă prin Tablou.net.`;
        return {
            title,
            description,
            keywords: [parsed.productId, parsed.intent, parsed.intentLabel, 'print personalizat', 'tablou'],
        };
    }

    const title = `${parsed.productName} ${parsed.w}x${parsed.h}`;
    const description = `Comandă ${parsed.productName} la dimensiunea fixă de ${parsed.w}x${parsed.h} cm. Producător direct, preț calculat instant, print HD rezistent UV și livrare rapidă în 24-48h. Personalizează acum formatul ${parsed.w}x${parsed.h} cm pe Tablou.net!`;

    return {
        title,
        description,
        keywords: [
            `${parsed.productName} ${parsed.w}x${parsed.h}`, 
            `${parsed.productId} ${parsed.w}x${parsed.h} cm`, 
            'print personalizat online', 
            'tablou', 
            'pret instant print',
            'producator bannere'
        ],
    };
}

export default async function DynamicConfiguratorPage({ params, searchParams: sParamsPromise }: Props) {
    const { slug } = await params;
    const searchParams = await sParamsPromise;
    const step = searchParams.step as string;
    
    const parsed = parseSlug(slug);
    if (!parsed) return notFound();

    const isConfigStep = step === 'config';
    const hasIntent = !!parsed.intent;

    // Show landing page if there's an intent and we're not yet on config step
    if (hasIntent && !isConfigStep) {
        return (
            <>
                <SeoIntentLanding 
                    productId={parsed.productId}
                    productName={parsed.productName}
                    intent={parsed.intent!}
                    intentLabel={parsed.intentLabel!}
                />
                <div className="hidden">
                    <SeoDimensionsLinks 
                        productId={parsed.productId} 
                        productName={parsed.productName} 
                        currentW={parsed.w || 100} 
                        currentH={parsed.h || 100} 
                    />
                </div>
            </>
        );
    }

    // NEW: Show landing page for specific dimensions if not yet on config step
    if (parsed.w && parsed.h && !isConfigStep) {
        return (
            <>
                <SeoDimensionLanding 
                    productId={parsed.productId}
                    productName={parsed.productName}
                    w={parsed.w}
                    h={parsed.h}
                />
                <div className="hidden">
                    <SeoDimensionsLinks 
                        productId={parsed.productId} 
                        productName={parsed.productName} 
                        currentW={parsed.w} 
                        currentH={parsed.h} 
                    />
                </div>
            </>
        );
    }

    const displayName = parsed.intent ? `${parsed.productName} - ${parsed.intentLabel}` : `${parsed.productName} ${parsed.w}x${parsed.h} cm`;

    // Agentic SEO: Inject dynamic Product Schema
    const productSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": displayName,
        "description": parsed.intent ? `Comandă ${parsed.productName} curat, personalizat pentru ${parsed.intentLabel}. Print digital la o calitate excepțională.` : `${parsed.productName} la dimensiunea ${parsed.w}x${parsed.h} cm. Produs la rezoluție de înaltă performanță (HP Latex/UV).`,
        "image": `${siteConfig.url}/simbol.png`,
        "brand": {
            "@type": "Brand",
            "name": "Tablou"
        },
        "offers": {
            "@type": "Offer",
            "url": `${siteConfig.url}/configurator/${slug}`,
            "priceCurrency": "RON",
            "price": "45.00", 
            "priceValidUntil": "2027-12-31",
            "availability": "https://schema.org/InStock"
        }
    };

    return (
        <div className="pt-20">
            <Script
                id={`schema-${slug}`}
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
            />
            <h1 className="sr-only">{displayName}</h1>
            <Suspense fallback={<div className="min-h-[60svh] flex items-center justify-center font-bold text-slate-900">Se încarcă configuratorul...</div>}>
                <ConfiguratorDispatcher 
                    configuratorId={parsed.productId} 
                    productSlug={parsed.productSlug}
                    initialWidth={parsed.w}
                    initialHeight={parsed.h}
                    intent={parsed.intent}
                />
            </Suspense>
            <SeoProductContent productName={parsed.productName} productId={parsed.productId} />
            <div className="container mx-auto px-4 mt-20">
                <SeoDimensionsLinks 
                    productId={parsed.productId} 
                    productName={parsed.productName} 
                    currentW={parsed.w || 100} 
                    currentH={parsed.h || 100} 
                />
            </div>
        </div>
    );
}
