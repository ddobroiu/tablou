import ConfiguratorDispatcher from "@/components/configurator/ConfiguratorDispatcher";
import { Metadata } from 'next';
import { Suspense } from "react";

export const metadata: Metadata = {
    title: 'Configurator Plexiglas (Sticlă Acrilică)',
    description: 'Comandă plăci de plexiglas transparente sau albe, debitate la dimensiune. Print UV de înaltă calitate, grosimi 3mm-10mm. Calcul preț instant.',
    keywords: ['plexiglass', 'plexiglas transparent', 'sticlă acrilică', 'print uv plexiglas', 'tablou', 'plăcuțe firmă'],
    alternates: {
        canonical: '/configurator/materiale/plexiglass',
    },
};

export default function PlexiglassPage() {
    return (
        <div className="pt-20">
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">Se încarcă configuratorul Plexiglas...</div>}>
                <ConfiguratorDispatcher configuratorId="configuratoare-plexiglass" />
            </Suspense>
        </div>
    );
}
