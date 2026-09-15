import { Metadata } from 'next';
import ConfiguratorShopClient from "@/components/ConfiguratorShopClient";

export const metadata: Metadata = {
    title: 'Configuratoare Online - Canvas, Fototapet, Textile și Print',
    description: 'Alege produsul și configurează-l online: tablouri canvas din poza ta, fototapet, tricouri și hanorace, afișe, autocolante, bannere, roll-up și panouri rigide. Preț calculat instant, comandă în două minute.',
    keywords: ['configurator canvas', 'tablou din poza', 'configurator fototapet', 'tricouri personalizate', 'configurator print', 'tablou.net'],
    alternates: {
        canonical: '/shop/configuratoare',
    },
};

export default function ConfiguratorShopPage() {
    return <ConfiguratorShopClient />;
}
