import React, { Suspense } from "react";
import ConfiguratorPlexiglass from "@/components/ConfiguratorPlexiglass";
import ProductJsonLd from "@/components/ProductJsonLd";

export const metadata = {
    title: "Print pe Plexiglas | Plăci Acrilice Transparente/Albe",
    description: "Plexiglas printat UV. Aspect premium, sticlă acrilică. Disponibil transparent sau alb, diverse grosimi.",
    alternates: { canonical: "/sticla-acrilica" },
};

export default async function PlexiglassPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { artworkUrl } = await searchParams;
    const url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.tablou.net"}/sticla-acrilica`;
    const productImage = "/products/materiale/plexiglass/plexiglass-1.webp";

    const product = {
        title: "Print pe Sticlă Acrilică",
        description: "Plăci acrilice premium, transparente sau albe, printate UV la calitate fotografică.",
        images: [productImage],
        priceBase: 120,
        currency: "RON",
        slug: "sticla-acrilica"
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <ProductJsonLd
                product={product as any}
                url={url}
                brand="Tablou.net"
            />

            <Suspense fallback={<div className="h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>}>
                <ConfiguratorPlexiglass productSlug="sticla-acrilica" initialArtworkUrl={typeof artworkUrl === 'string' ? artworkUrl : undefined} />
            </Suspense>
        </main>
    );
}
