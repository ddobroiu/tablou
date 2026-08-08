import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { listAllLandingRoutes } from './lib/landingData';

// Build canonical slug set from landing catalog (normalized hyphen form)
const canonicalSlugs = new Set(listAllLandingRoutes().map((r) => String(r.slug).toLowerCase()));

const JUDETE_SLUGS = [
    "alba", "arad", "arges", "bacau", "bihor", "bistrita-nasaud", "botosani", "brasov", "braila", "buzau",
    "caras-severin", "calarasi", "cluj", "constanta", "covasna", "dambovita", "dolj", "galati", "giurgiu",
    "gorj", "harghita", "hunedoara", "ialomita", "iasi", "ilfov", "maramures", "mehedinti", "mures",
    "neamt", "olt", "prahova", "satu-mare", "salaj", "sibiu", "suceava", "teleorman", "timis", "tulcea",
    "vaslui", "valcea", "vrancea"
];

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // 1. WordPress Legacy Redirects (/YYYY/MM/DD/slug)
  const wpRegex = /^\/(\d{4})\/(\d{2})\/(\d{2})\/(.+)$/;
  const wpMatch = pathname.match(wpRegex);
  if (wpMatch) {
      const slug = wpMatch[4].toLowerCase();
      for (const jSlug of JUDETE_SLUGS) {
          if (slug.includes(jSlug)) {
              return NextResponse.redirect(new URL(`/judet/${jSlug}`, req.url), { status: 301 });
          }
      }
      return NextResponse.redirect(new URL('/shop', req.url), { status: 301 });
  }

  // 2. URL Normalization (Modern Pattern)
  if (pathname !== pathname.toLowerCase() || pathname.includes('_') || (pathname.length > 1 && pathname.endsWith('/') && !pathname.startsWith('/api'))) {
      const normalized = pathname.toLowerCase().replace(/_/g, '-').replace(/\/+$/, '') || '/';
      if (normalized !== pathname) {
          return NextResponse.redirect(new URL(normalized, req.url), { status: 301 });
      }
  }

  // 3. CORS handling for API routes
  if (pathname.startsWith('/api')) {
    const origin = req.headers.get('origin') || '';
    const allowedOrigin = origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1') ? origin : process.env.NEXT_PUBLIC_ALLOWED_ORIGIN || '';
    
    if (req.method === 'OPTIONS') {
      const headers = new Headers();
      if (allowedOrigin) headers.set('Access-Control-Allow-Origin', allowedOrigin);
      else headers.set('Access-Control-Allow-Origin', '*');
      headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
      headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      return new NextResponse(null, { status: 204, headers });
    }
    
    const res = NextResponse.next();
    if (allowedOrigin) res.headers.set('Access-Control-Allow-Origin', allowedOrigin);
    else res.headers.set('Access-Control-Allow-Origin', '*');
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res;
  }

  // 4. Static / Special Routes Bypass
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/images') ||
    pathname === '/robots.txt' ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/account') ||
    pathname.startsWith('/products') ||
    pathname.startsWith('/dashboard')
  ) {
    return NextResponse.next();
  }

  // 5. Landing Pages Rewrites / Canonical Protection
  const trimmed = pathname.replace(/^\/+/,'').replace(/\/+$/,'');
  if (!trimmed) return NextResponse.next();
  
  const parts = trimmed.split('/');
  const first = parts[0];
  const rest = parts.slice(1).join('/');
  const firstNormalized = String(first).toLowerCase().replace(/_/g, '-');

  if (canonicalSlugs.has(firstNormalized)) {
    const canonical = '/' + firstNormalized + (rest ? '/' + rest : '');
    if (pathname === canonical) return NextResponse.next();
    
    const target = req.nextUrl.clone();
    target.pathname = canonical;
    target.search = req.nextUrl.search;
    return NextResponse.rewrite(target);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|products|images|static).*)'],
};
