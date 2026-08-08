import React from "react";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { euFundsProducts } from "@/lib/products/eu-funds-products";
import ProductStructuredData from "@/components/ProductStructuredData";
import EUProductDispatcher from "@/components/configurator/EUProductDispatcher";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const { slug } = await params;
    const product = euFundsProducts.find((p) => p.slug === slug);

    if (!product) {
        return {
            title: 'Produs Negăsit',
        };
    }

    const previousImages = (await parent).openGraph?.images || [];

    return {
        title: `${product.title} - Kit Vizibilitate Fonduri E`,
        description: product.description.substring(0, 160),
        openGraph: {
            title: product.title,
            description: product.description.substring(0, 200),
            images: [
                product.image,
                ...previousImages,
            ],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: product.title,
            description: product.description.substring(0, 200),
            images: [product.image],
        },
    };
}

export default async function ProgramFinantarePage({ params }: Props) {
    const { slug } = await params;
    const product = euFundsProducts.find(p => p.slug === slug);

    if (!product) {
        return notFound();
    }

    // Parse price safely. It might be "De la 250 LEI" or number.
    let priceValue = "0";
    let priceCurrency = "RON";

    if (typeof product.price === 'number') {
        priceValue = String(product.price);
    } else {
        // Assume string "De la 250 LEI"
        const matches = String(product.price).match(/(\d+)/);
        if (matches && matches[0]) {
            priceValue = matches[0];
        }
        if (String(product.price).includes('EUR') || String(product.price).includes('€')) {
            priceCurrency = 'EUR';
        }
    }

    return (
        <div className="pt-20">
            <ProductStructuredData product={{
                name: product.title,
                description: product.description,
                image: product.image,
                sku: product.id,
                offers: {
                    price: priceValue,
                    priceCurrency: priceCurrency,
                    availability: "https://schema.org/InStock",
                    url: `https://www.tablou.net/programe-finantare/${product.slug}`
                }
            }} />

            <EUProductDispatcher product={product} />
        </div>
    );
}
