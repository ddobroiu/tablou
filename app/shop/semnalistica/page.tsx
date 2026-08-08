import { Metadata } from 'next';
import SemnalisticaClient from "@/components/SemnalisticaClient";

export const metadata: Metadata = {
    title: 'Semnalistică & Protecția Muncii | Magazin Sho',
    description: 'Comandă online indicatoare SSM, PSI, de avertizare, interdicție și informare. Produse conforme, rezistente la exterior, disponibile pe PVC sau autocolant.',
    keywords: ['semnalistică ssm', 'indicatoare psi', 'semne avertizare', 'panouri protectia muncii', 'indicatoare interdictie'],
    alternates: {
        canonical: '/shop/semnalistica',
    },
};

export default function SignageShopPage() {
    return <SemnalisticaClient />;
}
