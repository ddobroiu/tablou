// Canvas products from scraped arthub.ro data with REAL// Produsele optimizate pentru R2 (Cloudflare)
import canvasProductsRaw from '../../public/canvas/products-r2-optimized.json';

interface CanvasProductRaw {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    subcategory: string;
    tags: string[];
    price: number;
    currency: string;
    slug: string;
    original_name: string;
    metadata: {
        seo_title: string;
        seo_description: string;
        alt_text: string;
        original_url: string;
        source_image?: string;
    };
}



// Mapare categorii arthub -> categorii user-friendly (Păstrăm pentru consistență la afișare dacă e nevoie, dar JSON-ul are deja structura bună)
const CATEGORY_LABELS: Record<string, string> = {
    'abstracte': 'Abstracte',
    'alimente': 'Alimente',
    'animale': 'Animale',
    'copii': 'Copii',
    'fashion': 'Fashion',
    'femei': 'Femei',
    'feng-shui': 'Feng Shui',
    'flori': 'Flori',
    'harti': 'Hărți',
    'masini': 'Mașini',
    'moderne': 'Moderne',
    'orase': 'Orașe',
    'peisaje': 'Peisaje',
    'reproduceri': 'Reproduceri',
    'science-fiction': 'Science Fiction',
    'sport': 'Sport',
};

// Mapare subcategorii -> labels user-friendly (opțional, dar păstrăm compatibilitatea)
const SUBCATEGORY_LABELS: Record<string, string> = {
    // Aici ar veni lista lungă, dar putem face un fallback inteligent
};

// Generate individual canvas products for shop
export const SCRAPED_CANVAS_PRODUCTS = (canvasProductsRaw as CanvasProductRaw[]).map((item) => {
    // Data is already optimized in JSON!
    const mainCategory = item.category || 'moderne';
    const subCategory = item.subcategory || 'diverse';

    // Labels user-friendly
    const categoryLabel = CATEGORY_LABELS[mainCategory] || mainCategory.charAt(0).toUpperCase() + mainCategory.slice(1);

    // Subcategory label formatting fallback if map missing
    const subcategoryLabel = subCategory
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    return {
        id: item.id,
        slug: item.slug,
        routeSlug: item.slug,
        title: item.title,
        description: item.description,
        images: [item.image],
        priceBase: item.price,
        currency: item.currency,
        tags: item.tags,
        metadata: {
            category: 'Canvas',
            subcategory: categoryLabel,
            arthubCategory: mainCategory,
            arthubSubcategory: subCategory,
            subcategoryLabel: subcategoryLabel,
            originalUrl: item.metadata.original_url,
            sourceImage: item.metadata.source_image,
            seoTitle: item.metadata.seo_title,
            seoDescription: item.metadata.seo_description,
            altText: item.metadata.alt_text
        }
    };
});
