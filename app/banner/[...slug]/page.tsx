export const dynamic = 'force-dynamic';

import { notFound } from "next/navigation";
import { Suspense } from "react"; // <--- IMPORT OBLIGATORIU
import ProductJsonLd from "@/components/ProductJsonLd";
import { resolveProductForRequestedSlug, getAllProductSlugsByCategory } from "@/lib/products";
import type { Product } from "@/lib/products";
import BannerConfigurator from "@/components/BannerConfigurator";
import SaleRentBannerConfigurator from "@/components/SaleRentBannerConfigurator";
import { prisma } from "@/lib/prisma";
import { getLandingInfo } from "@/lib/landingData";

type Props = { params: Promise<{ slug: string[] }> };

export async function generateStaticParams() {
  const slugs = getAllProductSlugsByCategory("banner");
  return slugs.map((slug) => ({ slug: [slug] }));
}

export async function generateMetadata({ params }: Props) {
  const resolved = await params;
  const slugPath = (resolved?.slug ?? []).join("/");

  // 1. Check for programmatic SEO landing first
  const landingSEO = getLandingInfo("bannere", slugPath);
  if (landingSEO) {
    return {
      title: landingSEO.seoTitle || landingSEO.title,
      description: landingSEO.seoDescription || landingSEO.shortDescription,
      openGraph: {
        title: landingSEO.seoTitle || landingSEO.title,
        description: landingSEO.shortDescription,
        images: landingSEO.images || ["/products/banner/banner-1.webp"]
      },
    };
  }

  // 2. Fallback to standard products
  const { product, isFallback } = await resolveProductForRequestedSlug(String(slugPath), "banner");
  if (!product) return {};

  const metadata: any = {
    title: product.seo?.title || `${product.title} | Tablou`,
    description: product.seo?.description || product.description,
    openGraph: {
      title: product.seo?.title || product.title,
      description: product.description,
      images: product.images
    },
  };
  if (isFallback) metadata.robots = { index: false, follow: true };
  return metadata;
}

export default async function Page({ params }: Props) {
  const resolved = await params;
  const slugParts: string[] = resolved?.slug ?? [];
  const joinedSlug = slugParts.join("/");

  // 1. Check for programmatic SEO landing first
  const landingSEO = getLandingInfo("bannere", joinedSlug);

  let product: any;
  let initialWidth: number | null = null;
  let initialHeight: number | null = null;

  if (landingSEO) {
    product = {
      id: landingSEO.key,
      slug: landingSEO.key,
      title: landingSEO.title,
      description: landingSEO.shortDescription,
      images: landingSEO.images || ["/products/banner/banner-1.webp"],
      contentHtml: landingSEO.contentHtml,
      metadata: { type: 'custom' }
    };
  } else {
    // 2. Fallback to standard products
    const result = await resolveProductForRequestedSlug(String(joinedSlug), "banner");
    product = result.product;
    initialWidth = (result.initialWidth as number | null) ?? null;
    initialHeight = (result.initialHeight as number | null) ?? null;
  }

  if (!product) return notFound();

  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/banner/${joinedSlug}`;

  // LOGICA IMAGINE ROBUSTĂ
  const slugKey = String(product.slug ?? product.id ?? "").toLowerCase();
  const genericSet = new Set<string>(["/products/banner/banner-1.webp", "/products/banner/banner-2.webp", "/products/banner/banner-3.webp", "/products/banner/banner-4.webp", "/placeholder.png"]);
  const imgs = product.images ?? [];
  let img = imgs.find((x: string) => !!x && slugKey && x.toLowerCase().includes(slugKey));
  if (!img) img = imgs.find((x: string) => !!x && !genericSet.has(x.toLowerCase())) ?? imgs[0] ?? "/products/banner/banner-1.webp";

  // Fetch review stats
  let ratingValue: number | undefined;
  let reviewCount: number | undefined;
  try {
    const pSlug = product.slug ?? product.routeSlug;
    if (pSlug) {
      const aggs = await prisma.review.aggregate({
        where: { productSlug: pSlug },
        _avg: { rating: true },
        _count: { rating: true }
      });
      if (aggs._count.rating > 0) {
        ratingValue = aggs._avg.rating || 0;
        reviewCount = aggs._count.rating;
      }
    }
  } catch (e) { }

  return (
    <>
      <ProductJsonLd
        product={(product as Product)}
        url={url}
        ratingValue={ratingValue}
        reviewCount={reviewCount}
      />
      <main className="min-h-screen bg-gray-50">
        {product.metadata?.type !== 'banner-predefinit' && (
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          }>
            <BannerConfigurator
              productSlug={product.slug ?? product.routeSlug}
              initialWidth={initialWidth ?? undefined}
              initialHeight={initialHeight ?? undefined}
              productImage={img}
            />
          </Suspense>
        )}

        {product.metadata?.type === 'banner-predefinit' && (
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          }>
            <SaleRentBannerConfigurator
              product={product}
            />
          </Suspense>
        )}

        {/* ... contentHtml ... */}

        {product.contentHtml && product.metadata?.type !== 'banner-predefinit' && (
          <section className="py-16 bg-white border-t border-gray-100">
            <div className="container mx-auto px-4 max-w-4xl">
              <article
                className="prose prose-lg prose-indigo mx-auto prose-h2:text-3xl prose-h2:font-bold prose-h3:text-xl prose-img:rounded-xl"
                dangerouslySetInnerHTML={{ __html: product.contentHtml }}
              />
            </div>
          </section>
        )}
      </main>
    </>
  );
}