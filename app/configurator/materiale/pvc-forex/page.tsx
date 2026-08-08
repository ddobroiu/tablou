import ConfiguratorDispatcher from "@/components/configurator/ConfiguratorDispatcher";
import { Metadata } from 'next';
import { Suspense } from "react";

export const metadata: Metadata = {
    title: 'Configurator PVC Forex (Expandat)',
    description: 'Comandă plăci PVC Forex personalizate, debitate la dimensiune. Grosimi 3mm, 5mm, 10mm. Print UV rezistent la exterior. Calcul preț pe loc.',
    keywords: ['pvc forex', 'forex personalizat', 'print forex', 'panouri pvc', 'tablou', 'signalistica'],
    alternates: {
        canonical: '/configurator/materiale/pvc-forex',
    },
};

export default function PVCForexPage() {
    return (
        <div className="pt-20">
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">Se încarcă configuratorul PVC Forex...</div>}>
                <ConfiguratorDispatcher configuratorId="pvc-forex" />
            </Suspense>
        </div>
    );
}
