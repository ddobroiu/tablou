import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tablou.net';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/_next/',

        // transactional / private areas
        '/account',
        '/account/',
        '/cart',
        '/cart/',
        '/checkout',
        '/checkout/',
        '/login',
        '/login/',
        '/thank-you',
        '/thank-you/',
        '/urmareste-comanda',
        '/urmareste-comanda/',
      ],
    },
    host: baseUrl,
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
