import { notFound } from "next/navigation";
import { Suspense } from "react";
import ProductJsonLd from "@/components/ProductJsonLd";
import { resolveProductForRequestedSlug, getAllProductSlugsByCategory } from "@/lib/products";
import SignageConfigurator from "@/components/SignageConfigurator";

type Props = { params: Promise<{ slug?: string[] }> };

export async function generateStaticParams() {
    const slugs = getAllProductSlugsByCategory("semnalistică");
    return slugs.map((slug) => ({ slug: [slug] }));
}

export async function generateMetadata({ params }: Props) {
    const resolved = await params;
    const raw = (resolved?.slug ?? []).join("/");
    const { product, isFallback } = await resolveProductForRequestedSlug(String(raw), "semnalistică");
    if (!product) return {};

    return {
        title: product.seo?.title || `${product.title} | Tablou`,
        description: product.seo?.description || product.description,
        openGraph: {
            title: product.seo?.title || product.title,
            description: product.description,
            images: product.images
        },
        ...(isFallback ? { robots: { index: false, follow: true } } : {})
    };
}

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
    const resolved = await params;
    const slugParts: string[] = resolved?.slug ?? [];
    const joinedSlug = slugParts.join("/");

    const { product } = await resolveProductForRequestedSlug(String(joinedSlug), "semnalistică");

    if (!product) return notFound();

    const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/semnalistica/${joinedSlug}`;

    return (
        <>
            <ProductJsonLd product={product} url={url} />

            <main className="min-h-screen bg-gray-50">
                <Suspense fallback={<div className="h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>}>
                    <SignageConfigurator product={product as any} />
                </Suspense>
            </main>
        </>
    );
}
