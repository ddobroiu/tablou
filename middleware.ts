import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const JUDETE_SLUGS = [
    "alba", "arad", "arges", "bacau", "bihor", "bistrita-nasaud", "botosani", "brasov", "braila", "buzau",
    "caras-severin", "calarasi", "cluj", "constanta", "covasna", "dambovita", "dolj", "galati", "giurgiu",
    "gorj", "harghita", "hunedoara", "ialomita", "iasi", "ilfov", "maramures", "mehedinti", "mures",
    "neamt", "olt", "prahova", "satu-mare", "salaj", "sibiu", "suceava", "teleorman", "timis", "tulcea",
    "vaslui", "valcea", "vrancea"
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Detect old WordPress date-based URLs: /YYYY/MM/DD/slug
    const wpRegex = /^\/(\d{4})\/(\d{2})\/(\d{2})\/(.+)$/;
    const match = pathname.match(wpRegex);

    if (match) {
        const slug = match[4].toLowerCase();

        // Try to find a county in the slug
        for (const jSlug of JUDETE_SLUGS) {
            if (slug.includes(jSlug)) {
                return NextResponse.redirect(new URL(`/judet/${jSlug}`, request.url), { status: 301 });
            }
        }

        // Specific category redirects for Tablou.net
        if (slug.includes('canvas') || slug.includes('tablou') || slug.includes('pictura')) return NextResponse.redirect(new URL('/shop/canvas', request.url), { status: 301 });
        if (slug.includes('personalizat') || slug.includes('foto')) return NextResponse.redirect(new URL('/configurator/canvas', request.url), { status: 301 });

        return NextResponse.redirect(new URL('/blog', request.url), { status: 301 });
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
