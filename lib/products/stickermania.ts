import stickermaniaProductsRaw from '../../public/stickermania/products-stickermania.json';
import type { Product } from '../products';

export interface StickermaniaVariant {
    id: string;
    size: string;
    material: string;
    price: number;
    sku?: string;
}

export interface StickermaniaProduct {
    id: string;
    title: string;
    image: string;
    priceBase: number;
    category: string;
    subcategory: string;
    subcategoryLabel: string;
    slug: string;
    routePrefix: string;
    variants: StickermaniaVariant[];
    metadata: {
        original_url: string;
        source: string;
        original_title: string;
    };
}

// Încarcă datele din JSON
import rawData from "../../public/stickermania/products-stickermania.json";
import bannersRawData from "../../public/stickermania/banners-stickermania.json";

export function getStickermaniaProducts(): StickermaniaProduct[] {
    return rawData as StickermaniaProduct[];
}

export function getStickermaniaBanners(): any[] {
    return bannersRawData;
}

export function convertStickermaniaToProduct(sm: StickermaniaProduct): Product {
    const description = (sm as any).description || `Indicator semnalistică de înaltă calitate: ${sm.title}. Disponibil în diverse dimensiuni și materiale (autocolant, PVC).`;

    return {
        id: sm.id,
        slug: sm.slug,
        routeSlug: `semnalistica/${sm.slug}`,
        title: sm.title,
        description: description,
        images: [sm.image],
        priceBase: sm.priceBase,
        currency: "RON",
        tags: ["semnalistică", "stickermania", sm.subcategory.toLowerCase()],
        metadata: {
            category: sm.category,
            subcategory: sm.subcategory,
            subcategoryLabel: sm.subcategoryLabel,
            isSignage: true,
            signageVariants: sm.variants,
            original_url: sm.metadata.original_url
        }
    };
}

export function convertStickermaniaBannerToProduct(banner: any): Product {
    return {
        id: banner.id,
        slug: banner.slug,
        routeSlug: `banner/${banner.slug}`,
        title: banner.title,
        description: banner.description,
        images: banner.images,
        priceBase: banner.price,
        currency: "RON",
        tags: ["banner", "bannere", "stickermania", "vanzari", "inchirieri"],
        metadata: {
            category: "bannere",
            subcategory: "vanzari-inchirieri",
            type: "banner-predefinit",
            variants: banner.metadata.variants,
            original_url: banner.metadata.original_url
        },
        contentHtml: banner.description
    };
}
