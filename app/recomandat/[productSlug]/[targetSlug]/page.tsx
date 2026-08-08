import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { SeoIntentLanding } from '@/components/SeoIntentLanding';
import { CONFIGURATORS_REGISTRY } from '@/lib/configurators-registry';
import { INTENT_LABELS, PRODUCT_INTENTS } from '@/lib/seo/intents';
import { INDUSTRIE_DATA } from '@/lib/seo/industriiData';

interface Props {
    params: Promise<{ productSlug: string; targetSlug: string }>;
}

import { MATERIALE_DATA } from '@/lib/seo/materialeData';

const TARGET_MAPPING: Record<string, string> = {
    'cabinete-medicale': 'medical',
    'clinici': 'medical',
    'doctori': 'medical',
    'restaurante': 'horeca',
    'cafenele': 'horeca',
    'hoteluri': 'horeca',
    'agentii-imobiliare': 'imobiliare',
    'dezvoltatori': 'imobiliare',
    'scoli': 'educatie',
    'universitati': 'educatie',
    'gradinite': 'educatie',
    'sali-fitness': 'sport',
    'sali-sport': 'sport',
    'mesh': 'banner-mesh',
    'frontlit': 'banner-frontlit',
    'sablat': 'autocolant-sablat',
};

function getTargetInfo(slug: string) {
    const normalized = slug.startsWith('pentru-') ? slug.replace('pentru-', '') : slug;
    const finalSlug = TARGET_MAPPING[normalized] || normalized;
    
    // 1. Try Materiale Data (High Priority)
    const material = MATERIALE_DATA.find(m => m.slug === finalSlug || m.id === finalSlug);
    if (material) return { slug: finalSlug, label: material.name.split(' (')[0] };

    // 2. Try Intent Labels
    let label = INTENT_LABELS[finalSlug];
    if (label) return { slug: finalSlug, label };

    // 3. Try Industries
    const industry = INDUSTRIE_DATA.find(i => i.slug === finalSlug);
    if (industry) return { slug: finalSlug, label: industry.name.split(' (')[0] };

    return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { productSlug, targetSlug } = await params;
    const product = CONFIGURATORS_REGISTRY.find(p => (p.slug || p.id) === productSlug);
    if (!product) return {};

    const info = getTargetInfo(targetSlug);
    if (!info) return {};

    const title = `${product.name} pentru ${info.label}`;
    const description = `Soluții dedicate de print: ${product.name.toLowerCase()} special concepute pentru ${info.label}. Preț instant, calitate premium și livrare rapidă.`;

    return { 
        title,
        description,
        alternates: { canonical: `https://www.tablou.net/recomandat/${productSlug}/${targetSlug}` }
    };
}

export default async function RecomandatPage({ params }: Props) {
    const { productSlug, targetSlug } = await params;
    const product = CONFIGURATORS_REGISTRY.find(p => (p.slug || p.id) === productSlug);
    if (!product) notFound();

    const info = getTargetInfo(targetSlug);
    if (!info) notFound();

    return (
        <SeoIntentLanding 
            productId={product.id}
            productName={product.name}
            intent={info.slug}
            intentLabel={info.label}
        />
    );
}

import { MARKETING_INTENTS } from '@/lib/seo/intents';

export async function generateStaticParams() {
    const params: { productSlug: string; targetSlug: string }[] = [];

    CONFIGURATORS_REGISTRY.forEach((product) => {
        // 1. Existing intents
        const productIntents = PRODUCT_INTENTS[product.id] || [];
        productIntents.forEach((intent) => {
            params.push({ productSlug: product.slug, targetSlug: intent });
            params.push({ productSlug: product.id, targetSlug: `pentru-${intent}` });
        });

        // 2. Global Marketing Intents
        MARKETING_INTENTS.forEach((m) => {
            params.push({ productSlug: product.slug, targetSlug: m });
        });

        // 3. Materials relevant to this product
        MATERIALE_DATA.filter(mat => mat.relatedProductId === product.id).forEach((mat) => {
            params.push({ productSlug: product.slug, targetSlug: mat.slug });
            // Handle common shortened slugs
            if (mat.slug.includes('banner-')) {
                params.push({ productSlug: product.slug, targetSlug: mat.slug.replace('banner-', '') });
            }
        });
    });

    INDUSTRIE_DATA.forEach((ind) => {
        CONFIGURATORS_REGISTRY.slice(0, 3).forEach((prod) => {
            params.push({ productSlug: prod.slug, targetSlug: ind.slug });
            params.push({ productSlug: prod.slug, targetSlug: `pentru-${ind.slug}` });
        });
    });

    return params;
}
