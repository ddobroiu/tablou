import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy pentru imaginile din bibliotecile externe folosite în editorul online.
 * Le servește same-origin (trec de CSP și pot fi exportate fără probleme CORS).
 * Doar hosturi cunoscute, ca să nu fie un proxy deschis.
 */
export const runtime = 'nodejs';

const ALLOWED_HOSTS = [
    'pixabay.com',
    'cdn.pixabay.com',
    'res.cloudinary.com',
    'images.unsplash.com',
];

function hostAllowed(hostname: string): boolean {
    return ALLOWED_HOSTS.some((h) => hostname === h || hostname.endsWith(`.${h}`));
}

export async function GET(request: NextRequest) {
    const raw = request.nextUrl.searchParams.get('url');
    if (!raw) return new NextResponse('Missing URL parameter', { status: 400 });

    let target: URL;
    try {
        target = new URL(raw);
    } catch {
        return new NextResponse('Invalid URL', { status: 400 });
    }
    if (target.protocol !== 'https:' || !hostAllowed(target.hostname)) {
        return new NextResponse('Host not allowed', { status: 403 });
    }

    try {
        const response = await fetch(target.toString(), {
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; EditorOnline/1.0)' },
            next: { revalidate: 86400 },
        });
        if (!response.ok) {
            return new NextResponse(`Failed to fetch image: ${response.statusText}`, { status: response.status });
        }
        const contentType = response.headers.get('content-type') || 'image/jpeg';
        if (!contentType.startsWith('image/')) {
            return new NextResponse('Not an image', { status: 415 });
        }
        const buffer = await response.arrayBuffer();
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (error) {
        console.error('Proxy image error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
