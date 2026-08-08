import ConfiguratorDispatcher from "@/components/configurator/ConfiguratorDispatcher";
import { Metadata } from 'next';
import { Suspense } from "react";

export const metadata: Metadata = {
    title: 'Configurator Plăci Polipropilenă (PP)',
    description: 'Material sintetic flexibil și rezistent la rupere. Ideal pentru sisteme de afișaj suspendate, roll-up sau etichete rigide. Print UV premium.',
    keywords: ['polipropilena', 'placa pp', 'material sintetic', 'print uv polipropilena', 'tablou', 'afisaj flexibil'],
    alternates: {
        canonical: '/configurator/materiale/polipropilena',
    },
};

export default function PolipropilenaPage() {
    return (
        <div className="pt-20">
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">Se încarcă configuratorul de polipropilenă...</div>}>
                <ConfiguratorDispatcher configuratorId="configuratoare-polipropilena" />
            </Suspense>
        </div>
    );
}
