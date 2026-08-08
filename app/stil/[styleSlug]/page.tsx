import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { STILURI_DATA } from '@/lib/seo/stiluriData';
import { SeoStyleLanding } from '@/components/SeoStyleLanding';

interface Props {
    params: Promise<{ styleSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { styleSlug } = await params;
    const style = STILURI_DATA.find(s => s.slug === styleSlug);
    
    if (!style) return {};

    const title = `${style.title}`;
    const description = `${style.description} Transformă-ți spațiul cu un ${style.name.toLowerCase()} de excepție. Imprimare HD pe canvas, postere și materiale rigide la cea mai înaltă calitate.`;

    return {
        title,
        description,
        alternates: {
            canonical: `https://www.tablou.net/stil/${styleSlug}`
        },
        openGraph: {
            title,
            description,
            images: [{ url: style.image }]
        }
    };
}

export default async function StylePage({ params }: Props) {
    const { styleSlug } = await params;
    const data = STILURI_DATA.find(s => s.slug === styleSlug);
    
    if (!data) notFound();

    return <SeoStyleLanding style={data} />;
}

export async function generateStaticParams() {
    return STILURI_DATA.map((s) => ({
        styleSlug: s.slug,
    }));
}
