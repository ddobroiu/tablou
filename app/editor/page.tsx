import ConfiguratorClient from '@/components/VisionboardConfigurator/ConfiguratorClient';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: "Editor Online - Creează Design Personalizat",
    description: "Creează-ți propriul design folosind editorul nostru interactiv Tablou. Adaugă fotografii, texte și elemente grafice pentru bannere, tablouri și multe altele.",
};

export default function EditorPage() {
    return (
        <div style={{ height: '100vh', overflow: 'hidden' }}>
            <Suspense fallback={<div className="flex items-center justify-center h-full bg-slate-900 text-white font-black italic">Încărcare Editor Tablou...</div>}>
                <ConfiguratorClient />
            </Suspense>
        </div>
    )
}
