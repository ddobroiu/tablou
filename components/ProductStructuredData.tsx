import Script from "next/script";

interface ProductStructuredDataProps {
    product: {
        name: string;
        description: string;
        image: string;
        sku: string;
        brand?: string;
        offers?: {
            price: string | number;
            priceCurrency: string;
            availability: "https://schema.org/InStock" | "https://schema.org/OutOfStock" | "https://schema.org/PreOrder";
            url?: string;
        };
        aggregateRating?: {
            ratingValue: number;
            reviewCount: number;
        };
    };
}

export default function ProductStructuredData({ product }: ProductStructuredDataProps) {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": product.description,
        "image": product.image,
        "sku": product.sku,
        "brand": {
            "@type": "Brand",
            "name": product.brand || "Tablou.net",
        },
        "offers": (product.offers?.price === "0" || product.offers?.price === 0) 
            ? {
                "@type": "AggregateOffer",
                "url": product.offers?.url,
                "priceCurrency": product.offers?.priceCurrency || "RON",
                "lowPrice": "25.00",
                "highPrice": "4000.00",
                "offerCount": "100",
                "availability": product.offers?.availability || "https://schema.org/InStock"
            }
            : {
                "@type": "Offer",
                "url": product.offers?.url,
                "priceCurrency": product.offers?.priceCurrency || "RON",
                "price": product.offers?.price,
                "availability": product.offers?.availability || "https://schema.org/InStock",
                "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                "itemCondition": "https://schema.org/NewCondition",
                "hasMerchantReturnPolicy": {
                    "@type": "MerchantReturnPolicy",
                    "applicableCountry": "RO",
                    "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
                    "merchantReturnDays": 14,
                    "returnMethod": "https://schema.org/ReturnByMail"
                }
            },
        ...(product.aggregateRating ? {
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": product.aggregateRating.ratingValue,
                "reviewCount": product.aggregateRating.reviewCount,
            },
        } : {}),
    };

    return (
        <Script
            id={`product-jsonld-${product.sku}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    );
}
