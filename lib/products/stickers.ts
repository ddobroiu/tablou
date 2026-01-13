import stickersRaw from '../../public/stickers/products-sticky.json';
import type { Product } from '../products';

export interface StickyProduct {
    id: string;
    title: string;
    image: string;
    price: number;
    slug: string;
    category: string;
    subcategory: string;
}

// Helper pentru extragerea dimensiunilor din titlu
function extractDimensions(title: string): { width: number, height: number } | null {
    // Caută pattern-uri de genul "20x30", "300x200mm", "10 x 30 cm"
    const dimRegex = /(\d{1,4})[\sxX×]+(\d{1,4})(?:\s*(mm|cm|m))?/;
    const match = title.match(dimRegex);

    if (match) {
        let w = parseFloat(match[1]);
        let h = parseFloat(match[2]);
        const unit = match[3] ? match[3].toLowerCase() : 'cm'; // Default cm dacă nu e specificat

        if (unit === 'mm') { w /= 10; h /= 10; }
        else if (unit === 'm') { w *= 100; h *= 100; }

        return { width: w, height: h };
    }

    // Formate standard
    if (/\bA4\b/i.test(title)) return { width: 21, height: 29.7 };
    if (/\bA3\b/i.test(title)) return { width: 29.7, height: 42 };
    if (/\bA5\b/i.test(title)) return { width: 14.8, height: 21 };

    return null;
}

export const GET_STICKY_PRODUCTS = (stickersRaw as StickyProduct[]).map((item) => {
    const dims = extractDimensions(item.title) || { width: 20, height: 30 }; // Fallback default
    const sizeStr = `${dims.width}x${dims.height}cm`;

    return {
        id: item.id,
        slug: item.slug,
        routeSlug: item.slug,
        title: item.title,
        description: `Semnalistică: ${item.title}. Disponibil ca Autocolant sau Placă PVC Rigidă.`,
        images: [item.image],
        priceBase: item.price,
        currency: "RON",
        width_cm: dims.width,
        height_cm: dims.height,
        tags: ["stickere", "semnalistica", item.subcategory.toLowerCase()],
        metadata: {
            category: "Semnalistică", // Changed to generic Semnalistica to trigger correct card logic
            subcategory: item.subcategory,
            isSignage: true, // IMPORTANT: Triggers Signage Configurator
            detectedWidth: dims.width,
            detectedHeight: dims.height,
            signageVariants: [
                {
                    id: `${item.id}-auto`,
                    size: sizeStr,
                    material: "autocolant",
                    price: item.price
                },
                {
                    id: `${item.id}-pvc`,
                    size: sizeStr,
                    material: "placa-pvc-3mm",
                    price: item.price * 2
                }
            ]
        }
    } as Product;
});
