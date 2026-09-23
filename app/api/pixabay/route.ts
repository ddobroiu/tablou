import { NextResponse } from 'next/server';

/**
 * Căutare imagini/vectori Pixabay pentru editorul online.
 * - cheia stă doar pe server (PIXABAY_API_KEY)
 * - imaginea folosită în design e varianta mare (1280px), servită prin /api/proxy-image
 *   ca să fie same-origin (CSP + CORS la export), previzualizarea rămâne directă
 * - rezultatele se cachează 1h (Pixabay cere caching pe 24h pentru trafic mare)
 */
export const runtime = 'nodejs';

type PixabayHit = {
    id: number;
    tags: string;
    previewURL: string;
    webformatURL: string;
    largeImageURL?: string;
    imageWidth?: number;
    imageHeight?: number;
    user?: string;
    pageURL?: string;
};

function proxied(url: string): string {
    return `/api/proxy-image?url=${encodeURIComponent(url)}`;
}

async function searchPixabay(params: URLSearchParams): Promise<{ hits: PixabayHit[]; total: number; status: number }> {
    const res = await fetch(`https://pixabay.com/api/?${params.toString()}`, { next: { revalidate: 3600 } });
    if (!res.ok) return { hits: [], total: 0, status: res.status };
    const data = await res.json().catch(() => ({}));
    return { hits: Array.isArray(data?.hits) ? data.hits : [], total: Number(data?.totalHits || 0), status: 200 };
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get('q') || '').trim().slice(0, 100);
    const transparent = searchParams.get('transparent') === 'true';
    const orientation = searchParams.get('orientation') || 'all';
    const imageType = ['photo', 'vector', 'illustration', 'all'].includes(searchParams.get('type') || '') ? (searchParams.get('type') as string) : 'photo';
    const page = Math.max(1, Math.min(50, parseInt(searchParams.get('page') || '1', 10) || 1));
    const apiKey = process.env.PIXABAY_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: 'Biblioteca de imagini nu este configurată momentan. Folosește „Încarcă” pentru pozele tale.' }, { status: 500 });
    }
    if (!query) return NextResponse.json({ hits: [] });

    const base = new URLSearchParams({
        key: apiKey,
        q: query,
        image_type: imageType,
        safesearch: 'true',
        page: String(page),
        per_page: '40',
    });
    if (transparent) base.set('colors', 'transparent');
    if (orientation === 'horizontal' || orientation === 'vertical') base.set('orientation', orientation);

    try {
        // Întâi în română, apoi fallback pe engleză (indexul englez e mult mai bogat).
        const ro = new URLSearchParams(base);
        ro.set('lang', 'ro');
        let result = await searchPixabay(ro);
        if (result.status === 429) {
            return NextResponse.json({ error: 'Prea multe căutări într-un interval scurt. Încearcă din nou în câteva secunde.' }, { status: 429 });
        }
        if (result.hits.length === 0) {
            result = await searchPixabay(base);
        }

        const hits = result.hits.map((hit) => {
            const full = hit.largeImageURL || hit.webformatURL;
            return {
                id: String(hit.id),
                url: proxied(full),
                preview: hit.previewURL,
                tags: hit.tags,
                width: hit.imageWidth,
                height: hit.imageHeight,
                author: hit.user,
                source: hit.pageURL,
            };
        });

        return NextResponse.json(
            { hits, total: result.total, page },
            { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } }
        );
    } catch (error) {
        console.error('Pixabay search error:', error);
        return NextResponse.json({ error: 'Nu am putut contacta biblioteca de imagini. Încearcă din nou.' }, { status: 502 });
    }
}
