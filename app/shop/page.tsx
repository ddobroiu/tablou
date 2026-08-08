import React, { Suspense } from "react";
import ShopPageContent from "./ShopPageContent";
import { Metadata } from 'next';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ category?: string }> }): Promise<Metadata> {
    const { category } = await searchParams;

    if (category?.toLowerCase() === 'semnalistica') {
        return {
            title: 'Semnalistică și Indicatoare PVC/Autocolant',
            description: 'Cumpără indicatoare de securitate, semnalistică rutieră, SSM și PSI. Produse din PVC, Autocolant sau Dibond cu rezistență maximă. Prețuri directe de producător.',
            keywords: ['semnalistica', 'indicatoare pvc', 'semne protectia muncii', 'indicatoare ssm', 'indicatoare psi', 'semnalistica magazine'],
            alternates: { canonical: '/shop?category=semnalistica' },
        };
    }

    return {
        title: 'Shop - Toate Produsele și Serviciile',
        description: 'Explorează gama noastră completă de produse de tipar digital: de la tablouri canvas și acrilice, până la bannere publicitare, autocolante și semnalistică.',
        keywords: ['shop print', 'tablou produse', 'bannere online', 'tablouri personalizate', 'autocolante vinyl', 'rollup', 'afise'],
        alternates: { canonical: '/shop' },
    };
}

import Breadcrumbs from '@/components/Breadcrumbs';

export default function ShopPage() {
    return (
        <div className="pt-24 max-w-7xl mx-auto px-4">
            <Breadcrumbs items={[{ label: 'Magazin', href: '/shop' }]} />
            <Suspense fallback={<div className="container py-20 text-center">Se încarcă produsele...</div>}>
                <ShopPageContent />
            </Suspense>
        </div>
    );
}
