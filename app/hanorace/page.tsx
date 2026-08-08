import React, { Suspense } from "react";
import TextileConfigurator from "@/components/TextileConfigurator";
import { getProductBySlug } from "@/lib/products";
import ProductJsonLd from "@/components/ProductJsonLd";

export const metadata = {
    title: "Hanorace Personalizate - Print DTF | Magazin Online",
    description: "Personalizează hanorace groase din bumbac cu design-ul tău. Imprimare DTF rezistentă, culori vibrante, materiale premium. Comandă online rapid. Comandă materiale publicitare customizate. Tehnologie avansată și finisaje impecabile, design direct din browser.",
    keywords: [
        "hanorace personalizate",
        "print dtf",
        "hanorace bumbac",
        "haine personalizate",
        "tablou"
    ],
    alternates: { canonical: "/hanorace" },
    openGraph: {
        title: "Hanorace Personalizate | Print DTF Ales | Magazin Online",
        description: "Hanorace premium, groase, personalizate cu designul tău. Calitate maximă a printului DTF. Comandă materiale publicitare customizate. Tehnologie avansată și finisaje impecabile, design direct din browser.",
        images: [{
            url: "/products/banner/banner-1.webp",
            width: 1200,
            height: 630,
            alt: "Hanorace Personalizate"
        }]
    }
};

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function HanoracePage({ searchParams }: Props) {
    const sParams = await searchParams;
    const product = getProductBySlug("configurator-hanorace");
    const url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.tablou.net"}/hanorace`;

    const image = typeof sParams.image === 'string' ? sParams.image : undefined;

    return (
        <main className="min-h-screen bg-slate-50 pt-20">
            {product && <ProductJsonLd name={product.title} description={product.description} image={product.images?.[0]} price={140} url={url} />}

            <Suspense fallback={<div className="h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div></div>}>
                <h1 className="sr-only">Hanorace Personalizate</h1>
                <TextileConfigurator type="hanorace" productSlug="configurator-hanorace" productImage={image} />
            </Suspense>

            <section className="bg-white py-16 mt-16 border-t border-slate-100">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                            Hanorace Personalizate Groase
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            La <strong className="text-emerald-600">Tablou.net</strong>, realizăm hanorace Ales groase (peste 300g), foarte călduroase și confortabile, printate digital folosind utilaje DTF de mare viteză și precizie!
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}

