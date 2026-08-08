import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { REGLEMENTARI_DATA } from '@/lib/seo/reglementariData';
import { SeoRegulatoryLanding } from '@/components/SeoRegulatoryLanding';

interface Props {
    params: Promise<{ regSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { regSlug } = await params;
    const data = REGLEMENTARI_DATA.find(r => r.slug === regSlug);
    
    if (!data) return {};

    const title = `${data.title}`;
    const description = `${data.description} Comandă semnalistică conformă cu ${data.lawReference}. Producător direct, livrare rapidă și materiale omologate durabile.`;

    return {
        title,
        description,
        alternates: {
            canonical: `https://www.tablou.net/norme/${regSlug}`
        },
        openGraph: {
            title,
            description,
            images: [{ url: data.image }]
        }
    };
}

export default async function RegulatoryPage({ params }: Props) {
    const { regSlug } = await params;
    const data = REGLEMENTARI_DATA.find(r => r.slug === regSlug);
    
    if (!data) notFound();

    return <SeoRegulatoryLanding data={data} />;
}

export async function generateStaticParams() {
    return REGLEMENTARI_DATA.map((reg) => ({
        regSlug: reg.slug,
    }));
}
