import ConfiguratorDispatcher from "@/components/configurator/ConfiguratorDispatcher";
import { Metadata } from 'next';
import { Suspense } from "react";

export const metadata: Metadata = {
    title: 'Configurator Display Carton (Ondulat / Fagure',
    description: 'Comandă plăci și display-uri din carton personalizate. Soluții eco-friendly din carton ondulat sau fagure, tăiate la dimensiune și printate UV.',
    keywords: ['carton ondulat', 'carton fagure', 'display carton', 'eco-friendly print', 'tablou', 'debitare carton'],
    alternates: {
        canonical: '/configurator/materiale/carton',
    },
};

export default function CartonPage() {
    return (
        <div className="pt-20">
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">Se încarcă configuratorul de carton...</div>}>
                <ConfiguratorDispatcher configuratorId="configuratoare-carton" />
            </Suspense>
        </div>
    );
}
