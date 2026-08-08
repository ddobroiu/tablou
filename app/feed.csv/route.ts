import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/products';
import { siteConfig } from '@/lib/siteConfig';
import {
    formatMerchantPriceAttributeStrict,
    includeProductInMerchantFeed,
    merchantDescription,
    merchantFeedTitle,
    merchantImageLink,
    merchantPriceRON,
    merchantProductCanonicalLink,
    merchantStandardShippingOffer,
} from '@/lib/merchantFeed';
import { googleProductCategoryId } from '@/lib/merchantGoogleCategory';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const products = (await getProducts()).filter(includeProductInMerchantFeed);
        const baseUrl = (siteConfig.url || 'https://www.tablou.net').replace(/\/$/, '');
        const shippingOffer = merchantStandardShippingOffer();

        const headers = [
            'id',
            'title',
            'description',
            'link',
            'image_link',
            'additional_image_link',
            'availability',
            'price',
            'brand',
            'condition',
            'google_product_category',
            'product_type',
            'identifier_exists',
            'mpn',
            'shipping',
        ];

        const escapeCsv = (field: string | number | undefined | null): string => {
            if (field === undefined || field === null) return '';
            const stringField = String(field);
            if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
                return `"${stringField.replace(/"/g, '""')}"`;
            }
            return stringField;
        };

        const rows = products
            .map((product) => {
                const priceNum = merchantPriceRON(product);
                if (priceNum === null || priceNum <= 0) return null;

                const link = merchantProductCanonicalLink(product, baseUrl);
                const imgs = product.images || [];
                const imageLink = merchantImageLink(imgs[0], baseUrl);
                const additionalImage =
                    imgs.length > 1 ? merchantImageLink(imgs[1], baseUrl) : '';

                const currency = product.currency || 'RON';
                const price = formatMerchantPriceAttributeStrict(priceNum, currency);
                const feedTitle = merchantFeedTitle(product.title, String(product.id));
                const description = merchantDescription(product.description, feedTitle);
                const productType =
                    product.metadata?.category || product.metadata?.subcategory || 'Print digital';
                const gpc = googleProductCategoryId(product);

                return [
                    escapeCsv(product.id),
                    escapeCsv(feedTitle),
                    escapeCsv(description),
                    escapeCsv(link),
                    escapeCsv(imageLink),
                    escapeCsv(additionalImage || ''),
                    'in_stock',
                    escapeCsv(price),
                    escapeCsv(siteConfig.name),
                    'new',
                    escapeCsv(gpc),
                    escapeCsv(String(productType)),
                    'no',
                    escapeCsv(product.sku || product.id),
                    escapeCsv(shippingOffer.csvCell),
                ].join(',');
            })
            .filter(Boolean) as string[];

        const csvContent = [headers.join(','), ...rows].join('\n');

        return new NextResponse(csvContent, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': 'attachment; filename="products_feed.csv"',
                'Cache-Control': 's-maxage=3600, stale-while-revalidate',
            },
        });
    } catch (error) {
        console.error('Error generating CSV feed:', error);
        return new NextResponse('Error generating CSV feed', { status: 500 });
    }
}
