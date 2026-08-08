import { Metadata } from 'next';
import BannereClient from "@/components/BannereClient";

export const metadata: Metadata = {
    title: 'Bannere Publicitare - Modele Predefinite',
    description: 'Alege dintr-o gamă variată de modele de bannere publicitare pentru afacerea ta. Imobiliare, Auto, HoReCa și multe altele. Print outdoor rezistent cu tiv și...',
    keywords: ['bannere publicitare', 'modele bannere', 'print outdoor', 'banner imobiliare', 'banner auto', 'tablou'],
    alternates: {
        canonical: '/shop/bannere',
    },
};

import Breadcrumbs from '@/components/Breadcrumbs';

export default function BannersShopPage() {
    return (
        <div className="pt-24 max-w-7xl mx-auto px-4">
            <Breadcrumbs items={[{ label: 'Produse', href: '/shop' }, { label: 'Bannere', href: '/shop/bannere' }]} />
            <BannereClient />
        </div>
    );
}
