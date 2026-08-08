import React, { Suspense } from "react";
import FlyerConfigurator from "@/components/FlyerConfigurator";
import { getProductBySlug } from "@/lib/products";
import ProductJsonLd from "@/components/ProductJsonLd";

export const metadata = {
  title: "Flyere Personalizate | Print Rapid & Calitate",
  description: "Configurează online flyere pentru afacerea ta. Alege dimensiunea (A6, A5, DL), grosimea hârtiei și cantitatea. Preț instant și livrare rapidă.",
  keywords: [
    "flyere personalizate",
    "print flyere",
    "flyere A6",
    "flyere A5",
    "flyere DL",
    "fluturasi publicitari",
    "tipar flyere online"
  ],
  alternates: { canonical: "/configurator/flyere" },
};

export default async function FlyerConfiguratorPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const product = getProductBySlug("configurator-flyere") || getProductBySlug("flyere");
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.tablou.net"}/configurator/flyere`;

  const sp = await searchParams;
  const imageParam = sp?.image;
  const image = typeof imageParam === 'string' ? imageParam : undefined;

  return (
    <div className="w-full">
      {product && <ProductJsonLd product={product} url={url} />}

      <Suspense fallback={<div className="h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div></div>}>
        <FlyerConfigurator productSlug="flyere" productImage={image} />
      </Suspense>
    </div>
  );
}
