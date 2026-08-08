import React, { Suspense } from "react";
import TapetConfigurator from "@/components/TapetConfigurator";
import { getProductBySlug } from "@/lib/products";
import ProductJsonLd from "@/components/ProductJsonLd";

export const metadata = {
  title: "Tapet Personalizat | Print Fototapet la Comandă | Magazin Online",
  description: "Decorează pereții cu tapet personalizat. Dimensiuni la comandă, materiale premium, adeziv opțional. Rezoluție înaltă și culori vibrante. Comandă materiale publicitare customizate. Tehnologie avansată și finisaje impecabile, design direct din browser.",
  keywords: [
    "tapet personalizat",
    "fototapet",
    "tapet la comandă",
    "decor pereți",
    "tapet dimensiuni mari",
    "print tapet",
    "materiale premium",
    "adeziv tapet"
  ],
  alternates: { canonical: "/tapet" },
  openGraph: {
    title: "Tapet Personalizat | Print Fototapet la Comandă | Magazin Online",
    description: "Decorează pereții cu tapet personalizat. Dimensiuni la comandă, materiale premium, adeziv opțional. Comandă materiale publicitare customizate. Tehnologie avansată și finisaje impecabile, design direct din browser.",
    images: [{
      url: "/products/tapet/tapet-1.webp",
      width: 1200,
      height: 630,
      alt: "Tapet personalizat fototapet"
    }]
  }
};

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function TapetPage({ searchParams }: Props) {
  const product = getProductBySlug("tapet");
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.tablou.net"}/tapet`;

  const image = typeof searchParams.image === 'string' ? searchParams.image : undefined;

  return (
    <main className="min-h-screen bg-gray-50">
      {product && <ProductJsonLd product={product} url={url} />}

      <Suspense fallback={<div className="h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>}>
        <TapetConfigurator productSlug="tapet" productImage={image} />
      </Suspense>
    </main>
  );
}