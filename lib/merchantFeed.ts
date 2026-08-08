import type { Product } from "@/lib/products";
import { siteConfig } from "@/lib/siteConfig";

const MERCHANT_IMAGE_EXT = /\.(jpe?g|png|gif)(\?|#|$)/i;

/** Pagini SEO generate în masă — excluse din Merchant Center (limită articole + duplicate). */
const MASS_SEO_ID = /^seo-(canvas|pnrr|pub)-gen-/i;

export function includeProductInMerchantFeed(product: Product): boolean {
  return !MASS_SEO_ID.test(String(product.id || ""));
}

function roundMoney(n: number): number {
  return Math.round(n * 100) / 100;
}

function minVariantPriceRON(product: Product): number | null {
  const variants = product.metadata?.variants;
  if (!Array.isArray(variants)) return null;
  let min: number | null = null;
  for (const v of variants) {
    const raw = (v as { price?: number }).price;
    if (typeof raw !== "number" || !Number.isFinite(raw) || raw <= 0) continue;
    min = min === null ? raw : Math.min(min, raw);
  }
  return min !== null ? roundMoney(min) : null;
}

export function merchantPriceRON(product: Product): number | null {
  const base =
    typeof product.priceBase === "number" && Number.isFinite(product.priceBase)
      ? product.priceBase
      : 0;
  if (base > 0) return roundMoney(base);
  const fromVariants = minVariantPriceRON(product);
  if (fromVariants !== null && fromVariants > 0) return fromVariants;
  return null;
}

export function merchantImageLink(
  imageCandidate: string | undefined,
  baseUrl: string
): string {
  const base = baseUrl.replace(/\/$/, "");
  const fallback = `${base}/logo.png`;

  if (!imageCandidate || !String(imageCandidate).trim()) {
    return fallback;
  }

  let url = String(imageCandidate).trim();
  if (url.startsWith("//")) url = `https:${url}`;
  else if (url.startsWith("/")) url = `${base}${url}`;
  else if (!/^https?:\/\//i.test(url)) url = `${base}/${url}`;

  if (MERCHANT_IMAGE_EXT.test(url)) return url;

  if (/\.avif(\?|#|$)/i.test(url)) {
    return fallback;
  }

  if (/\.webp(\?|#|$)/i.test(url)) {
    const asJpg = url.replace(/\.webp(\?|#|$)/i, ".jpg$1");
    if (asJpg !== url && MERCHANT_IMAGE_EXT.test(asJpg)) return asJpg;
    const asPng = url.replace(/\.webp(\?|#|$)/i, ".png$1");
    if (asPng !== url && MERCHANT_IMAGE_EXT.test(asPng)) return asPng;
  }

  return fallback;
}

export function formatMerchantPriceAttribute(price: number, currency: string): string {
  const cur = (currency || "RON").toUpperCase();
  return `${roundMoney(price)} ${cur}`;
}

export function formatMerchantPriceAttributeStrict(price: number, currency: string): string {
  const cur = (currency || "RON").toUpperCase();
  return `${roundMoney(price).toFixed(2)} ${cur}`;
}

const MAX_DESC = 5000;
const MAX_MERCHANT_TITLE = 150;

export function merchantFeedTitle(title: string | undefined, fallback: string): string {
  const raw = (title && String(title).trim()) || String(fallback || "").trim() || "Produs";
  const oneLine = raw.replace(/\r\n|\n|\r/g, " ").replace(/\s+/g, " ").trim();
  return oneLine.length <= MAX_MERCHANT_TITLE ? oneLine : oneLine.slice(0, MAX_MERCHANT_TITLE);
}

export function merchantDescription(text: string | undefined, fallback: string): string {
  const raw = (text && String(text).trim()) || fallback;
  const oneLine = raw.replace(/\r\n|\n|\r/g, " ").replace(/\s+/g, " ").trim();
  return oneLine.length <= MAX_DESC ? oneLine : oneLine.slice(0, MAX_DESC - 1) + "…";
}

export type MerchantProductLike = {
  priceBase?: number;
  metadata?: Product["metadata"];
  price?: string | number | null;
};

function parseFirstPositiveNumber(text: string): number | null {
  const m = String(text).match(/(\d+([.,]\d+)?)/);
  if (!m) return null;
  const n = parseFloat(m[1].replace(",", "."));
  if (!Number.isFinite(n) || n <= 0) return null;
  return roundMoney(n);
}

export function coerceMerchantPriceFromUnknown(
  input: MerchantProductLike | null | undefined
): number | null {
  if (!input) return null;
  const fromProduct = merchantPriceRON(input as Product);
  if (fromProduct !== null) return fromProduct;
  if (typeof input.price === "number" && Number.isFinite(input.price) && input.price > 0) {
    return roundMoney(input.price);
  }
  if (typeof input.price === "string" && input.price.trim()) {
    return parseFirstPositiveNumber(input.price);
  }
  return null;
}

export function absoluteShopUrl(href: string | undefined, baseUrl: string): string {
  const base = baseUrl.replace(/\/$/, "");
  if (!href || !href.trim()) return base;
  const h = href.trim();
  if (h.startsWith("//")) return `https:${h}`;
  if (/^https?:\/\//i.test(h)) return h;
  return `${base}${h.startsWith("/") ? h : `/${h}`}`;
}

export function merchantProductCanonicalLink(product: Product, baseUrl: string): string {
  const base = baseUrl.replace(/\/$/, "");
  const rs = product.routeSlug;
  if (rs) {
    if (rs.startsWith("http")) return rs;
    const path = rs.startsWith("/") ? rs : `/${rs}`;
    return `${base}${path}`;
  }
  return `${base}/shop/product/${encodeURIComponent(String(product.slug || product.id))}`;
}

export function normalizeMerchantImageList(
  raw: string | string[] | undefined,
  baseUrl: string
): string[] {
  const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
  const out = list
    .filter((s) => s && String(s).trim())
    .map((s) => merchantImageLink(String(s), baseUrl));
  if (out.length === 0) return [merchantImageLink(undefined, baseUrl)];
  return out;
}

export type MerchantShippingOffer = {
  country: string;
  service: string;
  priceAttribute: string;
  csvCell: string;
};

export function merchantStandardShippingOffer(): MerchantShippingOffer {
  const std = siteConfig.shipping?.standardDelivery;
  const price =
    typeof std?.price === "number" && Number.isFinite(std.price) && std.price >= 0
      ? std.price
      : 24;
  const cur = (std?.currency || "RON").toUpperCase();
  const priceAttribute = formatMerchantPriceAttributeStrict(price, cur);
  const service = String(std?.service || "Standard").trim() || "Standard";
  return {
    country: "RO",
    service,
    priceAttribute,
    csvCell: `RO:::${priceAttribute}`,
  };
}
