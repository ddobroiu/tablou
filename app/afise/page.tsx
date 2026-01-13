import React from "react";
import AfiseConfigurator from "@/components/configurator/AfiseConfigurator";
import { siteConfig } from "@/lib/siteConfig";

export const metadata = {
    title: "Configurator Afișe & Postere | " + siteConfig.name,
    description: "Personalizează-ți propriile afișe și postere online. Alege dimensiunea (A3, A2, A1, A0), materialul și cantitatea. Calitate premium, livrare rapidă.",
};

export default async function AfisePage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { artworkUrl } = await searchParams;

    return (
        <main className="min-h-screen bg-slate-50 pt-24 pb-20">
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter uppercase mb-4">
                        Afișe <span className="text-indigo-600">& Postere</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Print de înaltă rezoluție pe hârtie premium. Formate standard sau dimensiuni personalizate pentru impact maxim.
                    </p>
                </div>

                <AfiseConfigurator initialArtworkUrl={typeof artworkUrl === 'string' ? artworkUrl : undefined} />
            </div>
        </main>
    );
}
