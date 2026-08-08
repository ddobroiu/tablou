import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import ConfiguratorDispatcher from "@/components/configurator/ConfiguratorDispatcher";
import { Suspense } from 'react';
import ProductStructuredData from '@/components/ProductStructuredData';
import { getLandingInfo, listAllLandingRoutes } from '@/lib/landingData';
import Breadcrumbs from '@/components/Breadcrumbs';

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
    const routes = listAllLandingRoutes();
    return routes
        .filter(r => r.category === 'bannere')
        .map((r) => ({
            slug: r.slug,
        }));
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const { slug } = await params;
    const landingSEO = getLandingInfo("bannere", slug);

    if (!landingSEO) {
        return { title: 'Banner Personalizat' };
    }

    const title = landingSEO.seoTitle || landingSEO.title;
    const description = (landingSEO.seoDescription || landingSEO.shortDescription).substring(0, 160);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.tablou.net";
    const canonicalUrl = `${baseUrl}/bannere/${slug}`;

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

export default async function BannereLandingPage({ params }: Props) {
    const { slug } = await params;
    const landingSEO = getLandingInfo("bannere", slug);

    if (!landingSEO) {
        notFound();
    }

    const breadcrumbItems = [
        { label: 'Produse', href: '/shop' },
        { label: 'Bannere', href: '/shop/bannere' },
        { label: landingSEO.title, href: `/bannere/${slug}` }
    ];

    return (
        <div className="pt-16 md:pt-24 max-w-7xl mx-auto px-4 overflow-x-hidden w-full box-border">
            <div className="w-full overflow-hidden">
                <Breadcrumbs items={breadcrumbItems} />
            </div>

            <div className="mb-8 mt-6 w-full">
                <h1 className="text-xl min-[360px]:text-2xl min-[390px]:text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight break-words whitespace-normal uppercase">
                    {landingSEO.title}
                </h1>
                <p className="text-base md:text-xl text-slate-500 mt-4 leading-relaxed max-w-3xl">
                    {landingSEO.shortDescription}
                </p>
            </div>

            <ProductStructuredData product={{
                name: landingSEO.title,
                description: landingSEO.shortDescription,
                image: landingSEO.images?.[0] || "",
                sku: landingSEO.key,
                offers: {
                    price: "49",
                    priceCurrency: "RON",
                    availability: "https://schema.org/InStock",
                    url: `https://www.tablou.net/bannere/${slug}`
                }
            }} />

            <Suspense fallback={<div className="min-h-[60svh] flex items-center justify-center">Se încarcă...</div>}>
                <ConfiguratorDispatcher
                    configuratorId="banner"
                    productSlug={slug}
                    renderOnlyConfigurator={true}
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
