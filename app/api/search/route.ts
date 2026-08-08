import { NextResponse } from 'next/server';
import { canvasProducts } from '@/lib/products/canvas-products';
import { bannerProducts } from '@/lib/products/banner-products';
import { BANNER_SEO_DATA } from '@/lib/seo/bannerData';

// Combine products for search
const allProducts = [
    ...canvasProducts.map(p => ({ 
        ...p, 
        type: 'canvas', 
        linkCategory: 'canvas-product',
        displayCategory: 'Canvas'
    })),
    ...bannerProducts.map(p => ({ 
        ...p, 
        type: 'banner', 
        linkCategory: 'banner-product',
        displayCategory: 'Bannere'
    })),
    ...Object.values(BANNER_SEO_DATA).map(item => ({
        id: item.key,
        slug: item.key,
        title: item.title,
        description: item.shortDescription,
        images: item.images,
        image: item.images?.[0] || '',
        price: '49',
        category: 'bannere',
        linkCategory: 'bannere',
        displayCategory: 'Bannere',
        tags: [item.key, 'banner', 'publicitate']
    }))
];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || '';
    const limit = parseInt(searchParams.get('limit') || '8');

    if (!query || query.length < 2) {
        return NextResponse.json({ results: [], total: 0, query, category: '' });
    }

    // Filter products
    const filtered = allProducts.filter(product => {
        const titleMatch = product.title?.toLowerCase().includes(query);
        const tagsMatch = product.tags?.some((t: string) => t.toLowerCase().includes(query));
        const descMatch = product.description?.toLowerCase().includes(query);

        return titleMatch || tagsMatch || descMatch;
    });

    // Score based on relevance
    const scored = filtered.map(product => {
        let score = 0;
        const titleLower = product.title.toLowerCase();

        if (titleLower === query) score += 100; // Exact match
        if (titleLower.startsWith(query)) score += 50; // Starts with
        if (titleLower.includes(query)) score += 20; // Contains
        if (product.tags?.some((t: string) => t.toLowerCase() === query)) score += 10; // Tag exact match

        return { ...product, score };
    });

    // Sort by score
    scored.sort((a, b) => b.score - a.score);

    // Slice for pagination/limit
    const results = scored.slice(0, limit).map(p => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        description: p.description || '',
        images: (p as any).images && (p as any).images.length > 0 ? (p as any).images : [p.image],
        category: p.linkCategory, // Return the actual route category
        displayCategory: (p as any).displayCategory || p.category,
        priceBase: parseFloat(String(p.price || '0').replace(',', '.').replace(/[^\d.]/g, '')),
        score: p.score
    }));

    return NextResponse.json({
        results,
        total: filtered.length,
        query,
        category: ''
    });
}
