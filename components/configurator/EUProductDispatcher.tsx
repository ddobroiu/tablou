"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { EUFundProduct } from "@/lib/products/eu-funds-products";
import ConfiguratorDispatcher from "./ConfiguratorDispatcher";

const EUStickerConfigurator = dynamic(() => import("./EUStickerConfigurator"));
const EUPosterConfigurator = dynamic(() => import("./EUPosterConfigurator"));
const EUPlaqueConfigurator = dynamic(() => import("./EUPlaqueConfigurator"));

interface Props {
    product: EUFundProduct;
}

export default function EUProductDispatcher({ product }: Props) {
    // Dispatcher logic based on product type
    // If it's a sticker set (autocolant)
    if (product.tags.includes("autocolante")) {
        return <EUStickerConfigurator product={product} />;
    }

    // If it's a poster (afis)
    if (product.tags.includes("afis")) {
        return <EUPosterConfigurator product={product} />;
    }

    // If it's a plaque (placa)
    if (product.tags.includes("placa") || product.tags.includes("panou")) {
        return <EUPlaqueConfigurator product={product} />;
    }

    // Default to main configurator (Packages / Kits)
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Se încarcă configuratorul...</div>}>
            <ConfiguratorDispatcher
                configuratorId="fonduri-eu"
                productSlug={product.slug}
            />
        </Suspense>
    );
}

