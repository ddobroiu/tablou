export const dynamic = 'force-dynamic';

import { notFound } from "next/navigation";
import { Suspense } from "react";
import ProductJsonLd from "@/components/ProductJsonLd";
import { resolveProductForRequestedSlug, getAllProductSlugsByCategory } from "@/lib/products";
import type { Product } from "@/lib/products";
import CanvasConfigurator from "@/components/CanvasConfigurator";
import { prisma } from "@/lib/prisma";
import { getLandingInfo } from "@/lib/landingData";

type Props = { params: Promise<{ slug: string[] }> };

export async function generateStaticParams() {
  const slugs = getAllProductSlugsByCategory("canvas");
  return slugs.map((slug) => ({ slug: [slug] }));
}

export async function generateMetadata({ params }: Props) {
  const resolved = await params;
  const slugPath = (resolved?.slug ?? []).join("/");

  // 1. Check for programmatic SEO landing first
  const landingSEO = getLandingInfo("canvas", slugPath);
  if (landingSEO) {
    return {
      title: landingSEO.seoTitle || landingSEO.title,
      description: landingSEO.seoDescription || landingSEO.shortDescription,
      openGraph: {
        title: landingSEO.seoTitle || landingSEO.title,
        description: landingSEO.shortDescription,
        images: landingSEO.images || ["/products/canvas/canvas-1.webp"]
      },
    };
  }

  // 2. Fallback to standard products
  const { product, isFallback } = await resolveProductForRequestedSlug(String(slugPath), "canvas");
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

export default async function Page({ params, searchParams }: { params: Promise<{ slug: string[] }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolved = await params;
  const resolvedSearchParams = await searchParams;
  const slugParts: string[] = resolved?.slug ?? [];
  const joinedSlug = slugParts.join("/");

  // 1. Check for programmatic SEO landing
  const landingSEO = getLandingInfo("canvas", joinedSlug);

  let product: any;
  let initialWidth: number | null = null;
  let initialHeight: number | null = null;

  if (landingSEO) {
    product = {
      id: landingSEO.key,
      slug: landingSEO.key,
      title: landingSEO.title,
      description: landingSEO.shortDescription,
      images: landingSEO.images || ["/products/canvas/canvas-1.webp"],
      contentHtml: landingSEO.contentHtml,
      metadata: { type: 'custom' }
    };
  } else {
    // 2. Fallback to standard products
    const result = await resolveProductForRequestedSlug(String(joinedSlug), "canvas");
    product = result.product;
    initialWidth = (result.initialWidth as number | null) ?? null;
    initialHeight = (result.initialHeight as number | null) ?? null;
  }

  if (!product) return notFound();

  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/canvas/${joinedSlug}`;

  // LOGICA IMAGINE
  // 1. Imagine din URL (prioritară)
  const urlImage = typeof resolvedSearchParams.image === 'string' ? resolvedSearchParams.image : undefined;
  const urlTitle = typeof resolvedSearchParams.title === 'string' ? resolvedSearchParams.title : undefined;

  // 2. Fallback
  const slugKey = String(product.slug ?? product.id ?? "").toLowerCase();
  const genericSet = new Set<string>(["/products/banner/banner-1.webp", "/products/banner/banner-2.webp", "/products/banner/banner-3.webp", "/products/banner/banner-4.webp", "/placeholder.png"]);
  const imgs = product.images ?? [];
  let img = imgs.find((x: string) => !!x && slugKey && x.toLowerCase().includes(slugKey));
  if (!img) img = imgs.find((x: string) => !!x && !genericSet.has(x.toLowerCase())) ?? imgs[0] ?? "/products/banner/banner-1.webp";

  const finalImage = urlImage || img;

  // Determinăm titlul: dacă e produs multi-variant, căutăm varianta Canvas
  let finalTitle = product.title;
  if (product.metadata?.isMultiVariant && product.metadata?.variants) {
    const canvasVariant = (product.metadata.variants as any[]).find((v: any) => v.type === 'canvas');
    if (canvasVariant) {
      finalTitle = canvasVariant.title;
    }
  }
  if (urlTitle) finalTitle = urlTitle; // URL title are prioritate maximă

  const isCustomImage = !!urlImage;

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
  } catch (e) {
    // ignore
  }

  return (
    <>
      <ProductJsonLd
        product={(product as Product)}
        url={url}
        ratingValue={ratingValue}
        reviewCount={reviewCount}
      />

      <main className="min-h-screen bg-gray-50">
        <Suspense fallback={<div className="h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>}>
          <CanvasConfigurator
            productSlug={product.slug ?? product.routeSlug}
            initialWidth={initialWidth ?? undefined}
            initialHeight={initialHeight ?? undefined}
            productImage={finalImage}
            productTitle={finalTitle}
            productDescription={product.description}
          />
        </Suspense>

        {product.contentHtml && (
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