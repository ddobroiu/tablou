import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { MATERIALE_DATA } from '@/lib/seo/materialeData';
import { SeoMaterialLanding } from '@/components/SeoMaterialLanding';

interface Props {
    params: Promise<{ materialSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { materialSlug } = await params;
    const material = MATERIALE_DATA.find(m => m.slug === materialSlug);
    
    if (!material) return {};

    const title = `${material.title}`;
    const description = `${material.description} Comandă online ${material.name.toLowerCase()} de calitate premium. Producător direct, preț instant și livrare rapidă.`;

    return {
        title,
        description,
        alternates: {
            canonical: `https://www.tablou.net/material/${materialSlug}`
        },
        openGraph: {
            title,
            description,
            images: [{ url: material.image }]
        }
    };
}

export default async function MaterialPage({ params }: Props) {
    const { materialSlug } = await params;
    const material = MATERIALE_DATA.find(m => m.slug === materialSlug);
    
    if (!material) notFound();

    return <SeoMaterialLanding material={material} />;
}

export async function generateStaticParams() {
    return MATERIALE_DATA.map((mat) => ({
        materialSlug: mat.slug,
    }));
}
