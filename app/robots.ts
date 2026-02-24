import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || 'https://www.tablou.ro';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/checkout/',
                    '/account/',
                    '/admin/',
                    '/login/',
                    '/register/',
                    '/thank-you/',
                    '/search/'
                ],
            }
        ],
        sitemap: `${baseUrl.replace(/\/$/, '')}/sitemap.xml`,
    };
}
