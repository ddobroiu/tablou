import { Metadata } from 'next';
import { Suspense } from 'react';
import StockCanvasConfigurator from '@/components/configurator/StockCanvasConfigurator';
import { canvasProducts } from '@/lib/products/canvas-products';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const product = canvasProducts.find((p) => p.slug === slug);

    if (!product) {
        return {
            title: 'Produs inexistent | Tablou.net',
            description: 'Acest produs nu mai face parte din oferta noastră.',
        };
    }

    return {
        title: `${product.title} | Tablou Canvas Premium`,
        description: product.descriptionOriginal?.slice(0, 160) || `Tablou canvas ${product.title} personalizabil. Calitate premium, livrare rapidă.`,
        openGraph: {
            title: product.title,
            description: product.descriptionOriginal?.slice(0, 160),
            images: [product.image],
        },
    };
}

// Generate static params for all products to improve build performance and SEO
export async function generateStaticParams() {
    return canvasProducts.map((product) => ({
        slug: product.slug,
    }));
}

export default async function CanvasProductPage({ params }: Props) {
    const { slug } = await params;

    return (
        <Suspense fallback={<div className="min-h-[60svh] flex items-center justify-center">Se încarcă produsul...</div>}>
            <StockCanvasConfigurator productSlug={slug} />
        </Suspense>
    );
}
