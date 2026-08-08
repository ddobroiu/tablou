import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { signageProducts } from '@/lib/products/signage-products';
import SignageConfigurator from "@/components/configurator/SignageConfigurator";
import { Suspense } from 'react';
import ProductStructuredData from '@/components/ProductStructuredData';

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const { slug } = await params;
    const product = signageProducts.find((p) => p.slug === slug);

    if (!product) {
        return {
            title: 'Produs Negăsit',
        };
    }

    const previousImages = (await parent).openGraph?.images || [];

    return {
        title: `${product.title} - Semnalistică`,
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

export default async function SignageProductPage({ params }: Props) {
    const { slug } = await params;

    // 1. Exact match
    const product = signageProducts.find((p) => p.slug === slug);

    if (!product) {
        notFound();
    }

    // Price is number in signageProducts
    const priceString = product.price.toString();

    return (
        <div className="pt-20">
            <ProductStructuredData product={{
                name: product.title,
                description: product.description,
                image: product.image,
                sku: product.id,
                offers: {
                    price: priceString,
                    priceCurrency: "RON",
                    availability: "https://schema.org/InStock",
                    url: `https://www.tablou.net/semnalistica-product/${product.slug}`
                }
            }} />

            <Suspense fallback={<div className="min-h-[60svh] flex items-center justify-center">Se încarcă produsul...</div>}>
                <SignageConfigurator
                    productSlug={product.slug}
                />
            </Suspense>
        </div>
    );
}
