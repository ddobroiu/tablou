import ConfiguratorDispatcher from "@/components/configurator/ConfiguratorDispatcher";
import { Metadata } from 'next';
import { Suspense } from "react";

export const metadata: Metadata = {
    title: 'Configurator Panouri Alucobond (Dibond)',
    description: 'Debitări și personalizare panouri compozite din aluminiu (Alucobond/Dibond). Ideale pentru semnalistică rigidă durabilă. Print UV direct.',
    keywords: ['alucobond', 'dibond', 'panouri aluminiu', 'semnalistica rigida', 'tablou', 'print uv alucobond'],
    alternates: {
        canonical: '/configurator/materiale/alucobond',
    },
};

export default function AlucobondPage() {
    return (
        <div className="pt-20">
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">Se încarcă configuratorul Alucobond...</div>}>
                <ConfiguratorDispatcher configuratorId="configuratoare-alucobond" />
            </Suspense>
        </div>
    );
}
