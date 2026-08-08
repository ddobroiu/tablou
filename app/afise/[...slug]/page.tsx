export const dynamic = 'force-dynamic';

import { notFound } from "next/navigation";
import { Suspense } from "react";
import ProductJsonLd from "@/components/ProductJsonLd";
import { resolveProductForRequestedSlug, getAllProductSlugsByCategory } from "@/lib/products";
import type { Product } from "@/lib/products";
import AfiseConfigurator from "@/components/AfiseConfigurator";

type Props = { params: Promise<{ slug?: string[] }> };

export async function generateStaticParams() {
  const slugs = getAllProductSlugsByCategory("afise");
  return slugs.map((slug) => ({ slug: [slug] }));
}

export async function generateMetadata({ params }: Props) {
  try {
    const resolved = await params;
    const raw = (resolved?.slug ?? []).join("/");
    const { product, isFallback } = await resolveProductForRequestedSlug(String(raw), "afise");
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
  } catch (error) {
    console.error("Error generating metadata for afise:", error);
    return {
      title: "Produs",
      description: "Produs personalizat Tablou."
    };
  }
}

export default async function Page({ params, searchParams }: { params: Promise<{ slug?: string[] }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  try {
    const resolved = await params;
    const resolvedSearchParams = await searchParams;
    const slugParts: string[] = resolved?.slug ?? [];
    const joinedSlug = slugParts.join("/");

    const { product, initialWidth, initialHeight } = await resolveProductForRequestedSlug(String(joinedSlug), "afise");

    if (!product) return notFound();

    const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/afise/${joinedSlug}`;

    // LOGICA IMAGINE
    // 1. Dacă avem imagine în URL (din Shop), o folosim pe aia cu prioritate maximă
    const urlImage = typeof resolvedSearchParams.image === 'string' ? resolvedSearchParams.image : undefined;
    const urlTitle = typeof resolvedSearchParams.title === 'string' ? resolvedSearchParams.title : undefined;

    // 2. Fallback la logica existentă dacă nu avem imagine în URL
    const slugKey = String(product.slug ?? product.id ?? "").toLowerCase();
    const genericSet = new Set<string>(["/products/banner/banner-1.webp", "/products/banner/banner-2.webp", "/products/banner/banner-3.webp", "/products/banner/banner-4.webp", "/placeholder.png"]);
    const imgs = product.images ?? [];
    let img = imgs.find((x) => !!x && slugKey && x.toLowerCase().includes(slugKey));
    if (!img) img = imgs.find((x) => !!x && !genericSet.has(x.toLowerCase())) ?? imgs[0] ?? "/products/banner/banner-1.webp";

    // Imaginea finală transmisă configuratorului
    const finalImage = urlImage || img;

    // Determinăm titlul și descrierea: dacă e produs multi-variant, căutăm varianta Afiș
    let finalTitle = product.title;
    let finalDescription = product.description;
    if (product.metadata?.isMultiVariant && product.metadata?.variants) {
      const afisVariant = (product.metadata.variants as any[]).find((v: any) => v.type === 'afis');
      if (afisVariant) {
        finalTitle = afisVariant.title;
        finalDescription = afisVariant.description;
      }
    }

    // URL title are prioritate dacă există (pentru produse "virtuale" din shop)
    if (urlTitle) finalTitle = urlTitle;

    return (
      <>
        <ProductJsonLd product={(product as Product)} url={url} />

        <main className="min-h-screen bg-gray-50">
          <Suspense fallback={<div className="h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>}>
            <AfiseConfigurator
              productSlug="afise"
              initialWidth={initialWidth ?? undefined}
              initialHeight={initialHeight ?? undefined}
              productImage={finalImage}
              productTitle={finalTitle}
              productDescription={finalDescription}
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
  } catch (error) {
    console.error("Error rendering page for afise:", error);
    return notFound();
  }
}