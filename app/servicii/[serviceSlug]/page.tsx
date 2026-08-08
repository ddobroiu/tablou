import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { SERVICII_DATA } from '@/lib/seo/serviciiData';
import { SeoServiceLanding } from '@/components/SeoServiceLanding';

interface Props {
    params: Promise<{ serviceSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { serviceSlug } = await params;
    const service = SERVICII_DATA.find(s => s.slug === serviceSlug);
    
    if (!service) return {};

    const title = `${service.title}`;
    const description = `${service.description} Alege calitatea Tablou pentru finisaje de înaltă precizie: ${service.name.toLowerCase()}. Producător direct, rezultate impecabile.`;

    return {
        title,
        description,
        alternates: {
            canonical: `https://www.tablou.net/servicii/${serviceSlug}`
        },
        openGraph: {
            title,
            description,
            images: [{ url: service.image }]
        }
    };
}

export default async function ServicePage({ params }: Props) {
    const { serviceSlug } = await params;
    const service = SERVICII_DATA.find(s => s.slug === serviceSlug);
    
    if (!service) notFound();

    return <SeoServiceLanding service={service} />;
}

export async function generateStaticParams() {
    return SERVICII_DATA.map((srv) => ({
        serviceSlug: srv.slug,
    }));
}
