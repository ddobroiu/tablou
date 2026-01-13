import { Suspense } from "react";
import CanvasConfigurator from "@/components/CanvasConfigurator";
import { siteConfig } from "@/lib/siteConfig";

export const metadata = {
    title: "Configurator Tablou Canvas | " + siteConfig.name,
    description: "Configurează-ți propriul tablou canvas online. Alege dimensiunea, încarcă poza și comandă rapid. Calitate premium, livrare în 24-48 ore.",
};

export default async function CanvasPage({
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
                        Tablou <span className="text-indigo-600">Canvas</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Transformă fotografiile tale în opere de artă. Imprimare de înaltă rezoluție pe pânză canvas, întinsă pe șasiu de lemn tratat.
                    </p>
                </div>

                <Suspense fallback={<div className="min-h-[60svh] flex items-center justify-center">Se încarcă configuratorul...</div>}>
                    <CanvasConfigurator initialArtworkUrl={typeof artworkUrl === 'string' ? artworkUrl : undefined} />
                </Suspense>
            </div>
        </main>
    );
}
