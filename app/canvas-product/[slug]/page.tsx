import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { canvasProducts } from '@/lib/products/canvas-products';
import ConfiguratorDispatcher from "@/components/configurator/ConfiguratorDispatcher";
import { Suspense } from 'react';
import ProductStructuredData from '@/components/ProductStructuredData';
import Breadcrumbs from '@/components/Breadcrumbs';
import { prisma } from '@/lib/prisma';

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const { slug } = await params;
    const product = canvasProducts.find((p) => p.slug === slug);

    if (!product) {
        return {
            title: 'Produs Negăsit',
        };
    }

    const previousImages = (await parent).openGraph?.images || [];

    const baseUrl = "https://www.tablou.net";
    const canonicalUrl = `${baseUrl}/canvas-product/${product.slug}`;

    return {
        title: `${product.title} Canvas Personalizat`,
        description: product.description.substring(0, 160),
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: `${product.title}`,
            description: product.description.substring(0, 200),
            url: canonicalUrl,
            images: [
                {
                    url: product.image,
                    width: 800,
                    height: 800,
                    alt: product.title,
                },
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

export default async function CanvasProductPage({ params }: Props) {
    const { slug } = await params;
    // console.log(`Debug: accessing product page for slug: ${slug}`);

    // Check if products are loaded
    // console.log(`Debug: total products loaded: ${canvasProducts.length}`);

    // 1. Exact match
    let product = canvasProducts.find((p) => p.slug === slug);

    // 2. Fallback: Loose match (if user has extra prefix like 'canvas-' or missing parts)
    if (!product) {
        // console.log(`Debug: Exact match failed. Trying loose match...`);
        product = canvasProducts.find((p) => slug.includes(p.slug) || p.slug.includes(slug));
    }

    // console.log(`Debug: found product: ${product ? product.id : 'null'}`);

    if (!product) {
        console.error(`Error: Product not found for slug: ${slug}`);
        notFound();
    }

    // Parse price for Schema
    // format "79,00 €" -> 79.00
    const priceString = product.price ? product.price.replace(',', '.').replace(/[^\d.]/g, '') : "0";

    // Fetch review stats
    let aggregateRating;
    try {
        const aggs = await prisma.review.aggregate({
            where: { productSlug: product.slug },
            _avg: { rating: true },
            _count: { rating: true }
        });
        if (aggs._count.rating > 0) {
            aggregateRating = {
                ratingValue: aggs._avg.rating || 0,
                reviewCount: aggs._count.rating
            };
        }
    } catch (e) { }

    const breadcrumbItems = [
        { label: 'Produse', href: '/shop' },
        { label: 'Tablouri Canvas', href: '/shop/canvas' },
        { label: product.title, href: `/canvas-product/${product.slug}` }
    ];

    return (
        <div className="pt-24 max-w-7xl mx-auto px-4">
            <Breadcrumbs items={breadcrumbItems} />
            <ProductStructuredData product={{
                name: product.title,
                description: product.description,
                image: product.image,
                sku: product.id,
                offers: {
                    price: priceString,
                    priceCurrency: "EUR", // The source data seems to be in Euro based on formatting
                    availability: "https://schema.org/InStock",
                    url: `https://www.tablou.net/canvas-product/${product.slug}`
                },
                aggregateRating
            }} />

            <Suspense fallback={<div className="min-h-[60svh] flex items-center justify-center">Se încarcă produsul...</div>}>
                <ConfiguratorDispatcher
                    configuratorId="canvas"
                    productSlug={product.slug} // Pass the CORRECT found slug to the configurator
                    productImage={product.image}
                />
            </Suspense>
        </div>
    );
}
