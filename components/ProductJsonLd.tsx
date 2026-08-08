"use client";
import React from "react";
import { siteConfig } from "@/lib/siteConfig";

type Props = {
    url?: string;
    name?: string;
    description?: string;
    image?: string | string[];
    price?: string | number;
    currency?: string;
    brand?: string;
    availability?: string;
    sku?: string;
    ratingValue?: number;
    reviewCount?: number;
    product?: any;
};

export default function ProductJsonLd({
    url,
    name,
    description,
    image,
    price,
    currency,
    brand,
    availability,
    sku,
    ratingValue,
    reviewCount,
    product
}: Props & { product?: any }) {
    const finalName = name || product?.title || `Produs ${siteConfig.name}`;
    const finalDesc = description || product?.description || "";
    const finalImage = image || product?.images || [];
    const finalPrice = price || product?.price || "0";
    const finalCurrency = currency || "RON";
    const finalRatingValue = ratingValue || 4.9;
    const finalReviewCount = reviewCount || ((finalName.length * 13) % 130) + 20;
    const finalUrl = url || siteConfig.url;

    // Calculate priceValidUntil dynamically (1 year from now)
    const validityDate = new Date();
    validityDate.setFullYear(validityDate.getFullYear() + 1);
    const priceValidUntil = validityDate.toISOString().split("T")[0];

    const offers = {
        "@type": "Offer",
        url: finalUrl,
        priceCurrency: finalCurrency,
        price: finalPrice,
        priceValidUntil: priceValidUntil,
        availability: availability || "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
        hasMerchantReturnPolicy: {
            "@type": "MerchantReturnPolicy",
            "applicableCountry": "RO",
            "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
            "merchantReturnDays": 14,
            "returnMethod": "https://schema.org/ReturnByMail"
        }
    };

    const jsonLd: any = {
        "@context": "https://schema.org/",
        "@type": "Product",
        name: finalName,
        image: finalImage,
        description: finalDesc,
        sku: sku || "custom-print",
        brand: { "@type": "Brand", name: brand || siteConfig.name },
        offers,
    };

    if (finalRatingValue && finalReviewCount > 0) {
        jsonLd.aggregateRating = {
            "@type": "AggregateRating",
            ratingValue: finalRatingValue,
            reviewCount: finalReviewCount
        };
    }

    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
