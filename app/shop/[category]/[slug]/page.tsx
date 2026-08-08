import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import ConfiguratorDispatcher from "@/components/configurator/ConfiguratorDispatcher";
import { Suspense } from 'react';
import ProductStructuredData from '@/components/ProductStructuredData';
import { getLandingInfo, listAllLandingRoutes } from '@/lib/landingData';
import Breadcrumbs from '@/components/Breadcrumbs';

type Props = {
    params: Promise<{ category: string; slug: string }>;
};

// Map URL categories to internal keys if needed
const categoryMap: Record<string, string> = {
    'pliante': 'pliante',
    'autocolante': 'autocolante',
    'afise': 'afise',
    'tapet': 'tapet',
    'materiale': 'materiale',
    'fonduri-pnrr': 'fonduri-pnrr',
    // ... add others as needed
};

export async function generateStaticParams() {
    const routes = listAllLandingRoutes();
    return routes
        .filter(r => r.category !== 'bannere' && r.category !== 'canvas')
        .map((r) => ({
            category: r.category,
            slug: r.slug,
        }));
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const { category, slug } = await params;
    const internalCategory = categoryMap[category] || category;
    const landingSEO = getLandingInfo(internalCategory, slug);

    if (!landingSEO) {
        return { title: 'Produs Negăsit' };
    }

    const title = landingSEO.seoTitle || landingSEO.title;
    const description = (landingSEO.seoDescription || landingSEO.shortDescription).substring(0, 160);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.tablou.net";
    const canonicalUrl = `${baseUrl}/shop/${category}/${slug}`;

    return {
        title: `${title}`,
        description,
        alternates: { canonical: canonicalUrl },
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            images: landingSEO.images?.[0] ? [{ url: landingSEO.images[0] }] : [],
        }
    };
}

export default async function GenericLandingPage({ params }: Props) {
    const { category, slug } = await params;
    const internalCategory = categoryMap[category] || category;
    const landingSEO = getLandingInfo(internalCategory, slug);

    if (!landingSEO) {
        notFound();
    }

    const breadcrumbItems = [
        { label: 'Produse', href: '/shop' },
        { label: category.charAt(0).toUpperCase() + category.slice(1), href: `/shop/${category}` },
        { label: landingSEO.title, href: `/shop/${category}/${slug}` }
    ];

    // Map category to a valid configuratorId
    // Pliante usually uses 'pliante', tapet uses 'tapet', etc.
    let configuratorId = internalCategory;
    if (configuratorId === 'fonduri-pnrr' || configuratorId === 'fonduri') configuratorId = 'fonduri-eu';

    return (
        <div className="pt-24 max-w-7xl mx-auto px-4">
            <Breadcrumbs items={breadcrumbItems} />

            <div className="mb-8 mt-6">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                    {landingSEO.title}
                </h1>
                <p className="text-xl text-slate-500 mt-4 leading-relaxed max-w-3xl">
                    {landingSEO.shortDescription}
                </p>
            </div>

            <ProductStructuredData product={{
                name: landingSEO.title,
                description: landingSEO.shortDescription,
                image: landingSEO.images?.[0] || "",
                sku: landingSEO.key,
                offers: {
                    price: "0", // Programmatic SEO pages often don't have a fixed price until configured
                    priceCurrency: "RON",
                    availability: "https://schema.org/InStock",
                    url: `https://www.tablou.net/shop/${category}/${slug}`
                }
            }} />

            <Suspense fallback={<div className="min-h-[60svh] flex items-center justify-center">Se încarcă...</div>}>
                <ConfiguratorDispatcher
                    configuratorId={configuratorId}
                    productSlug={slug}
                />
            </Suspense>

            {landingSEO.contentHtml && (
                <section className="py-16 bg-white border-t border-gray-100 mt-12">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <article
                            className="prose prose-lg prose-indigo mx-auto"
                            dangerouslySetInnerHTML={{ __html: landingSEO.contentHtml }}
                        />
                    </div>
                </section>
            )}
        </div>
    );
}
