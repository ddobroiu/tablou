import { dotComAcrylicProducts, type AcrylicProduct as BaseProduct } from "./dotcom-acrylic-products";
// @ts-ignore
import insigneData from "./insigneart-products.json";

export type AcrylicProduct = BaseProduct;

const mapInsigneToAcrylic = (p: any): AcrylicProduct => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    titleOriginal: p.title,
    description: p.description,
    descriptionOriginal: p.description,
    image: p.image,
    imageAlt: p.title,
    imageOriginal: p?.images?.[0] || p.image,
    sourceUrl: p.sourceUrl,
    price: p.price,
    dimensions: p.dimensions || [],
    categories: p.categories || [],
    tags: p.tags || [],
    category: p.category || "sticlă-acrilică",
    material: "Sticlă Acrilică 3mm",
    scrapedAt: p.scrapedAt,
    orientation: p.orientation,
    images: p.images || [],
    shape: p.shape
});

const insigneProducts: AcrylicProduct[] = (insigneData as any[]).map(mapInsigneToAcrylic);

const allProducts: AcrylicProduct[] = [...dotComAcrylicProducts, ...insigneProducts];

// Cache categories for performance
const AVAILABLE_CATEGORIES = Array.from(new Set(allProducts.flatMap(p => p.categories)))
    .filter(c => c && c.length > 2)
    .sort();

export const getAcrylicProducts = async ({
    page = 1,
    limit = 24,
    category = "Toate",
    orientation = "Toate",
    search = ""
}: {
    page?: number;
    limit?: number;
    category?: string;
    orientation?: string;
    search?: string;
}) => {
    let filtered = allProducts;

    // 1. Filter by Category
    if (category && category !== "Toate") {
        filtered = filtered.filter(p => p.categories.includes(category));
    }

    // 2. Filter by Orientation
    if (orientation && orientation !== "Toate") {
        filtered = filtered.filter(p => {
            // Simple check, or reuse the robust logic from Grid if moved to shared util
            // For speed, check if raw orientation matches or use simple heuristic
            if (p.shape === 'Rotund' || p.orientation === 'Round') return orientation === 'Rotund';
            if (p.orientation === 'Pătrat' || p.orientation === 'Square') return orientation === 'Pătrat';
            if (p.orientation === 'Panoramic') return orientation === 'Panoramic';

            // Fallback text check
            return p.orientation === orientation;
        });
    }

    // 3. Search
    if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(p =>
            p.title.toLowerCase().includes(q) ||
            p.id.toLowerCase().includes(q)
        );
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;

    // 4. Return Paginated Slice (Lite Version)
    const products = filtered.slice(start, end).map(p => ({
        ...p,
        description: "", // Strip heavy text for grid
        descriptionOriginal: "",
        images: [] // Strip extra images
    }));

    return {
        products,
        total,
        totalPages,
        currentPage: page,
        categories: ["Toate", ...AVAILABLE_CATEGORIES]
    };
};

export const acrylicProducts = allProducts; // Keep for backward compatibility if needed
