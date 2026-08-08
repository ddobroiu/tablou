import { Metadata } from 'next';
import LivrareClient from "@/components/LivrareClient";

export const metadata: Metadata = {
    title: 'Livrare și Transport',
    description: 'Află detalii despre modalitățile de livrare, costuri de transport și timpii de execuție pentru produsele Tablou. Livrare rapidă în 1-2 zile lucrătoare în...',
    keywords: ['livrare', 'transport', 'costuri livrare', 'tablou', 'timp executie'],
    alternates: {
        canonical: '/livrare',
    },
};

export default function LivrarePage() {
    return <LivrareClient />;
}
