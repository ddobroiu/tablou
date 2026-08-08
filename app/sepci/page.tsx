import React, { Suspense } from "react";
import TextileConfigurator from "@/components/TextileConfigurator";
import { getProductBySlug } from "@/lib/products";
import ProductJsonLd from "@/components/ProductJsonLd";

export const metadata = {
    title: "Șepci Personalizate Online - Print DTF | Magazin Online",
    description: "Personalizează șepci de calitate cu design-ul sau logo-ul tău. Imprimare DTF rezistentă, culori vibrante, livrare rapidă în toată țara. Comandă materiale publicitare customizate. Tehnologie avansată și finisaje impecabile, design direct din browser.",
    keywords: [
        "sepci personalizate",
        "print dtf",
        "sepci bumbac",
        "tablou",
        "cadouri personalizate"
    ],
    alternates: { canonical: "/sepci" },
    openGraph: {
        title: "Șepci Personalizate | Print DTF Ales | Magazin Online",
        description: "Personalizează șepci premium. Print DTF de înaltă rezistență. Ideal pentru firmă, evenimente sau cadouri. Comandă materiale publicitare customizate. Tehnologie avansată și finisaje impecabile, design direct din browser.",
        images: [{
            url: "/products/banner/banner-1.webp",
            width: 1200,
            height: 630,
            alt: "Șepci Personalizate"
        }]
    }
};

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function SepciPage({ searchParams }: Props) {
    const sParams = await searchParams;
    const product = getProductBySlug("configurator-sepci");
    const url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.tablou.net"}/sepci`;

    const image = typeof sParams.image === 'string' ? sParams.image : undefined;

    return (
        <main className="min-h-screen bg-slate-50 pt-20">
            {product && <ProductJsonLd name={product.title} description={product.description} image={product.images?.[0]} price={60} url={url} />}

            <Suspense fallback={<div className="h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div></div>}>
                <h1 className="sr-only">Șepci Personalizate</h1>
                <TextileConfigurator type="sepci" productSlug="configurator-sepci" productImage={image} />
            </Suspense>

            <section className="bg-white py-16 mt-16 border-t border-slate-100">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                            Șepci Personalizate Ales
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            La <strong className="text-emerald-600">Tablou.net</strong>, realizăm șepci personalizate folosind tipar DTF de înaltă calitate, care rezistă excelent în timp, cu materiale rezistente și culori vibrante.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}

