export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getProducts, Product } from '@/lib/products';
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

export async function GET() {
    try {
        const products = (await getProducts()).filter(includeProductInMerchantFeed);

        const baseUrl = (siteConfig.url || 'https://www.tablou.net').replace(/\/$/, '');
        const shippingOffer = merchantStandardShippingOffer();

        const feedItems = products
            .map((product) => mapProductToXml(product, baseUrl, shippingOffer))
            .filter((block): block is string => Boolean(block));

        const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${baseUrl}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    ${feedItems.join('')}
  </channel>
</rss>`;

        return new NextResponse(xml, {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 's-maxage=3600, stale-while-revalidate',
            },
        });
    } catch (error) {
        console.error('Error generating product feed:', error);
        return new NextResponse('Error generating feed', { status: 500 });
    }
}

function escapeXml(unsafe: string | undefined): string {
    if (!unsafe) return '';
    return unsafe.replace(/[<>&'"]/g, (c) => {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
            default: return c;
        }
    });
}

function mapProductToXml(product: Product, baseUrl: string, shippingOffer: ReturnType<typeof merchantStandardShippingOffer>): string | null {
    const priceNum = merchantPriceRON(product);
    if (priceNum === null || priceNum <= 0) {
        return null;
    }

    const link = merchantProductCanonicalLink(product, baseUrl);
    const imgs = product.images || [];
    const imageLink = merchantImageLink(imgs[0], baseUrl);
    const additionalImage =
        imgs.length > 1 ? merchantImageLink(imgs[1], baseUrl) : '';

    const currency = product.currency || 'RON';
    const price = formatMerchantPriceAttributeStrict(priceNum, currency);
    const feedTitle = merchantFeedTitle(product.title, String(product.id));
    const description = merchantDescription(product.description, feedTitle);
    const gpc = googleProductCategoryId(product);
    const productType = product.metadata?.category || 'Print digital';

    return `
    <item>
      <g:id>${escapeXml(product.id)}</g:id>
      <g:title>${escapeXml(feedTitle)}</g:title>
      <g:description>${escapeXml(description)}</g:description>
      <g:link>${escapeXml(link)}</g:link>
      <g:image_link>${escapeXml(imageLink)}</g:image_link>
      ${additionalImage ? `<g:additional_image_link>${escapeXml(additionalImage)}</g:additional_image_link>` : ''}
      <g:condition>new</g:condition>
      <g:availability>in_stock</g:availability>
      <g:price>${escapeXml(price)}</g:price>
      <g:brand>${escapeXml(siteConfig.name)}</g:brand>
      <g:google_product_category>${escapeXml(gpc)}</g:google_product_category>
      <g:product_type>${escapeXml(String(productType))}</g:product_type>
      <g:identifier_exists>no</g:identifier_exists>
      <g:mpn>${escapeXml(product.sku || product.id)}</g:mpn>
      <g:shipping>
        <g:country>${escapeXml(shippingOffer.country)}</g:country>
        <g:service>${escapeXml(shippingOffer.service)}</g:service>
        <g:price>${escapeXml(shippingOffer.priceAttribute)}</g:price>
      </g:shipping>
    </item>
  `;
}
