import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { acrylicProducts } from '@/lib/products/acrylic-products';
import ConfiguratorDispatcher from "@/components/configurator/ConfiguratorDispatcher";
import { Suspense } from 'react';

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const product = acrylicProducts.find((p) => p.slug === slug);

    if (!product) {
        return {
            title: 'Produs Negăsit',
        };
    }

    return {
        title: `${product.title} - Tablou Sticlă Acrilică Premium | ShopPrint.ro`,
        description: product.description,
    };
}

export default async function AcrylicProductPage({ params }: Props) {
    const { slug } = await params;

    let product = acrylicProducts.find((p) => p.slug === slug);

    if (!product) {
        // Fallback loose match
        product = acrylicProducts.find((p) => slug.includes(p.slug) || p.slug.includes(slug));
    }

    if (!product) {
        notFound();
    }

    return (
        <div className="pt-20">
            <Suspense fallback={<div className="min-h-[60svh] flex items-center justify-center">Se încarcă produsul...</div>}>
                <ConfiguratorDispatcher
                    configuratorId={product.id.startsWith('ins-') ? 'insigne-acrylic' : 'acrylic'}
                    productSlug={product.slug}
                    productImage={product.image}
                />
            </Suspense>
        </div>
    );
}
