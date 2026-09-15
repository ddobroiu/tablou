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
        title: 'Catalog - Tablouri Canvas, Fototapet și Print Personalizat',
        description: 'Tot catalogul Tablou.net: tablouri canvas din poza ta și modele gata făcute, fototapet, tricouri și hanorace personalizate, afișe, autocolante, bannere, roll-up-uri, semnalistică și kituri pentru fonduri UE. Preț calculat pe loc.',
        keywords: ['tablouri canvas', 'tablouri personalizate', 'modele tablouri canvas', 'fototapet', 'tricouri personalizate', 'bannere online', 'afise', 'tablou.net'],
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
