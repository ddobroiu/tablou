import { Metadata } from 'next';
import ConfiguratorShopClient from "@/components/ConfiguratorShopClient";

export const metadata: Metadata = {
    title: 'Configuratoare Online',
    description: 'Alege produsul dorit și configurează-l online: bannere, autocolante, tablouri canvas, afișe, roll-up și multe altele. Preț instant.',
    keywords: ['configurator print', 'bannere online', 'autocolant personalizat', 'canvas editor', 'tablou'],
    alternates: {
        canonical: '/shop/configuratoare',
    },
};

export default function ConfiguratorShopPage() {
    return <ConfiguratorShopClient />;
}
