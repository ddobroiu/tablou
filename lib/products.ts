import { generatedCanvasSeoProducts, generatedPnrrSeoProducts, generatedPublicitareSeoProducts } from "./products/seo-mass-keywords";
import { generateSeoForProduct } from "./seoTemplates";
import { getLandingInfo } from "./landingData";
import { bannerProducts } from "./products/banner-products";
import { canvasProducts } from "./products/canvas-products";
import { euFundsProducts } from "./products/eu-funds-products";
import { printCenterProducts } from "./products/signage-products-printcenter";
import { configuratorProducts } from "./products/configurator-products";
import { seoCampaignProducts } from "./products/seo-campaign-products";
export type MaterialOption = {
  id: string;
  name: string;
  priceModifier: number;
  description: string;
  recommendedFor: string[];
  key?: string;
  label?: string;
};

export const MATERIAL_OPTIONS: MaterialOption[] = [
  { id: "frontlit-440", key: "frontlit-440", name: "Frontlit 440 g/mp (standard)", label: "Frontlit 440 g/mp (standard)", description: "Material rezistent pentru exterior", priceModifier: 0, recommendedFor: [] },
  { id: "frontlit-510", key: "frontlit-510", name: "Frontlit 510 g/mp (durabil)", label: "Frontlit 510 g/mp (durabil)", description: "Mai gros, pentru expuneri îndelungate", priceModifier: 0.1, recommendedFor: [] },
  { id: "couche-150", key: "couche-150", name: "Hârtie couché 150 g/mp", label: "Hârtie couché 150 g/mp", description: "Hârtie pentru interior și pliante", priceModifier: 0, recommendedFor: ["pliante"] },
  { id: "couche-170", key: "couche-170", name: "Hârtie couché 170 g/mp", label: "Hârtie couché 170 g/mp", description: "Hârtie premium pentru pliante/catalog", priceModifier: 0.12, recommendedFor: ["pliante"] },
  { id: "pp-5mm", key: "pp-5mm", name: "PVC 5mm", label: "PVC 5mm", description: "Material rigid pentru indoor/outdoor", priceModifier: 0.15, recommendedFor: ["decor", "materiale-rigide"] },
];

export type Product = {
  id: string;
  sku?: string;
  slug?: string;
  routeSlug?: string;
  title: string;
  description?: string;
  images?: string[];
  priceBase?: number;
  width_cm?: number;
  height_cm?: number;
  minWidthCm?: number;
  minHeightCm?: number;
  currency?: string;
  tags?: string[];
  seo?: { title?: string; description?: string };
  metadata?: {
    category?: string;
    subcategory?: string;
    isSignage?: boolean;
    signageVariants?: any[];
    isMultiVariant?: boolean;
    variants?: Array<{
      type: 'afis' | 'canvas' | 'tapet' | 'autocolant';
      title: string;
      description: string;
      slug: string;
      price: number;
      route: string;
      configurator: string;
    } | {
      size: string;
      price: number;
      id: string;
    } | {
      name: string;
      price: number;
    }>;
    [key: string]: any;
  };
  materials?: MaterialOption[];
  contentHtml?: string;
};

function normalizeImagePaths(imgs?: string[]): string[] | undefined {
  if (!imgs) return undefined;
  return imgs.map((src) => String(src));
}

// Mapare prima poză din fiecare configurator pentru fallback
const CONFIGURATOR_FIRST_IMAGES: Record<string, string> = {
  'canvas': '/products/canvas/canvas-1.webp',
  'rollup': '/products/rollup/rollup-1.webp',
  'window-graphics': '/products/window-graphics/window-graphics-1.webp',
  'pliante': '/products/pliante/pliante-1.webp',
  'plexiglass': '/products/materiale/plexiglass/plexiglass-1.webp',
  'pvc-forex': '/products/materiale/pvc-forex/pvc-forex-1.webp',
  'alucobond': '/products/materiale/alucobond/alucobond-1.webp',
  'polipropilena': '/products/master/placi-polipropilena-alveolara-canalit-ieftine.png',
};

function parsePrice(price: string | number | null | undefined): number {
  if (typeof price === "number") return price;
  if (!price) return 0;
  const str = String(price);
  const match = str.match(/(\d+([.,]\d+)?)/);
  if (match) {
    return parseFloat(match[1].replace(',', '.'));
  }
  return 0;
}

// --- PRODUCT AGGREGATION ---

const bannerProductsMapped: Product[] = bannerProducts.map(p => ({
  id: p.id,
  slug: p.slug,
  routeSlug: `banner-product/${p.slug}`, // Assuming route structure
  title: p.title,
  description: p.description,
  images: [p.image],
  priceBase: parsePrice(p.price),
  currency: "RON",
  tags: p.tags,
  metadata: { category: "bannere", type: p.metadata?.type, variants: p.metadata?.variants }
}));

const canvasProductsMapped: Product[] = canvasProducts.map(p => {
  const isEuro = p.price?.includes("€");
  const rawPrice = parsePrice(p.price);
  // Convert EUR to RON if needed (approx 1 EUR = 5 RON)
  const priceVal = isEuro ? Math.ceil(rawPrice * 5) : rawPrice;

  const canvasSubcategory = (() => {
    const raw = String((p as any).category ?? "").trim();
    if (!raw) return "";
    let label = raw.replace(/-/g, " ").replace(/\s+/g, " ").trim();
    label = label.charAt(0).toUpperCase() + label.slice(1);
    label = label.replace(/\bSi\b/g, "Și").replace(/\bsi\b/g, "și");
    return label;
  })();

  return {
    id: p.id,
    slug: p.slug,
    routeSlug: `canvas-product/${p.slug}`, // Fixed route
    title: p.title,
    description: p.description,
    images: [p.image],
    priceBase: priceVal,
    currency: "RON",
    tags: p.tags,
    metadata: { category: "canvas", subcategory: canvasSubcategory, originalData: p }
  };
});

const euFundsProductsMapped: Product[] = euFundsProducts.map(p => ({
  id: p.id,
  slug: p.slug,
  routeSlug: `configurator/fonduri-eu?program=${p.program}&slug=${p.slug}`, // Fixed to point to configurator
  title: p.title,
  description: p.description,
  images: [p.image],
  priceBase: parsePrice(p.price),
  currency: "RON",
  tags: p.tags,
  metadata: { category: "fonduri-europene", program: p.program }
}));



const printCenterProductsMapped: Product[] = printCenterProducts.map(p => ({
  id: p.id,
  slug: p.slug,
  routeSlug: `semnalistica-product/${p.slug}`, // Fixed route
  title: p.title,
  description: p.description,
  images: [p.image],
  priceBase: parsePrice(p.price),
  currency: "RON",
  tags: p.tags,
  metadata: { category: "semnalistica", variants: p.variants }
}));

const configuratorProductsMapped: Product[] = configuratorProducts.map(p => ({
  id: p.id,
  slug: p.slug,
  routeSlug: p.routeSlug,
  title: p.title,
  description: p.description,
  images: [p.image],
  priceBase: parsePrice(p.price),
  currency: "RON",
  tags: p.tags,
  metadata: { category: "configuratoare" }
}));


const seoCampaignProductsMapped: Product[] = seoCampaignProducts.map(p => ({
  id: p.id,
  slug: p.slug,
  routeSlug: p.routeSlug, // This points to the configurator URL directly
  title: p.title,
  description: p.description,
  images: [p.image],
  priceBase: parsePrice(p.price),
  currency: "RON",
  tags: p.tags,
  metadata: { category: "campanii-seo", isSeo: true, isSeoCampaign: true }
}));









const massSeoProductsMapped_LOCAL: Product[] = [...generatedCanvasSeoProducts, ...generatedPnrrSeoProducts, ...generatedPublicitareSeoProducts].map((p) => ({
  id: p.id,
  slug: p.slug,
  routeSlug: p.routeSlug,
  title: p.title,
  description: p.description,
  images: [p.image],
  priceBase: typeof parsePrice === 'function' ? parsePrice(p.price) : (typeof p.price === 'number' ? p.price : 49),
  currency: "RON",
  tags: p.tags,
  metadata: { category: "campanii-seo", isSeo: true, isSeoCampaign: true }
}));

export const PRODUCTS: Product[] = [
  ...bannerProductsMapped,
  ...canvasProductsMapped,
  ...euFundsProductsMapped,
  ...printCenterProductsMapped,
  ...configuratorProductsMapped,
  ...seoCampaignProductsMapped,
  ...massSeoProductsMapped_LOCAL
];

export async function getProducts(): Promise<Product[]> {
  return PRODUCTS;
}

export function getAllProductSlugs(): string[] {
  return PRODUCTS.map((p) => String(p.routeSlug ?? p.slug ?? p.id));
}

export function getAllProductSlugsByCategory(category: string): string[] {
  const cat = String(category || "").toLowerCase();
  return PRODUCTS.filter((p) => String(p.metadata?.category ?? "").toLowerCase() === cat).map((p) =>
    String(p.routeSlug ?? p.slug ?? p.id)
  );
}

export function getProductBySlug(slug: string | undefined): Product | undefined {
  if (!slug) return undefined;
  const s = String(slug).toLowerCase().trim();
  const segments = s.split("/").map((x) => x.trim()).filter(Boolean);
  const lastSegment = segments.length ? segments[segments.length - 1] : s;

  const OVERRIDES: Record<string, string> = {
    'banner': 'configurator-banner',
    'bannere': 'configurator-banner',
    'banner-verso': 'configurator-banner-verso',
    'afise': 'configurator-afise',
    'autocolante': 'configurator-autocolant',
    'canvas': 'configurator-canvas',
    'pliante': 'configurator-pliante',
    'flyere': 'configurator-pliante',
    'flayere': 'configurator-pliante',
    'rollup': 'configurator-rollup',
    'tapet': 'configurator-tapet',
    'window-graphics': 'configurator-window-graphics',
    'semnalistica': 'configurator-semnalistica',
    'fonduri-eu': 'configurator-fonduri',
    'tricouri': 'configurator-tricouri',
    'configurator/tricouri': 'configurator-tricouri',
    'hanorace': 'configurator-hanorace',
    'configurator/hanorace': 'configurator-hanorace',
    'sepci': 'configurator-sepci',
    'configurator/sepci': 'configurator-sepci'
  };

  if (OVERRIDES[s]) {
    const overrideProduct = PRODUCTS.find(p => p.id === OVERRIDES[s]);
    if (overrideProduct) return overrideProduct;
  }

  for (const p of PRODUCTS) {
    const id = String(p.id ?? "").toLowerCase();
    const sl = String(p.slug ?? "").toLowerCase();
    const rs = String(p.routeSlug ?? "").toLowerCase();
    if (s === id || s === sl || s === rs) return p;
    if (lastSegment === id || lastSegment === sl || lastSegment === rs) return p;
  }

  for (const p of PRODUCTS) {
    const sl = String(p.slug ?? "").toLowerCase();
    const rs = String(p.routeSlug ?? "").toLowerCase();
    if (rs && lastSegment === rs) return p;
    if (sl && lastSegment === sl) return p;
  }

  for (const p of PRODUCTS) {
    const tags = (p.tags ?? []).map((t) => String(t).toLowerCase());
    if (tags.includes(lastSegment) || tags.includes(s)) return p;

    // For slugs with hyphens that try to match tags with spaces (e.g. banner-de-vanzare)
    const cleanS = s.replace(/-/g, ' ');
    const cleanLast = lastSegment.replace(/-/g, ' ');
    if (tags.includes(cleanS) || tags.includes(cleanLast)) return p;
  }

  for (const p of PRODUCTS) {
    const title = String(p.title ?? "").toLowerCase();
    if (title.includes(s) || title.includes(lastSegment)) return p;
  }

  return undefined;
}

export async function resolveProductForRequestedSlug(requestedSlug: string, category?: string) {
  const raw = String(requestedSlug || "").toLowerCase().trim();
  const segments = raw.split("/").map((s) => s.trim()).filter(Boolean);

  const dimExactRegex = /^(\d{1,5})[xX×-](\d{1,5})$/;
  const dimAnywhereRegex = /(\d{1,5})[xX×-](\d{1,5})/;

  let width: number | undefined;
  let height: number | undefined;
  const remaining: string[] = [];

  for (const seg of segments) {
    const mExact = seg.match(dimExactRegex);
    if (mExact && width === undefined && height === undefined) {
      width = Number(mExact[1]);
      height = Number(mExact[2]);
      continue;
    }

    const mAny = seg.match(dimAnywhereRegex);
    if (mAny && width === undefined && height === undefined) {
      width = Number(mAny[1]);
      height = Number(mAny[2]);
      const cleaned = seg.replace(mAny[0], "").replace(/(^[-_]+|[-_]+$)/g, "").trim();
      if (cleaned) remaining.push(cleaned);
      continue;
    }
    remaining.push(seg);
  }

  const cleanedSlug = remaining.join("/") || raw;

  if (category) {
    const landingCatMap: Record<string, string> = {
      "banner": "bannere",
      "autocolante": "autocolante",
      "afise": "afise",
      "canvas": "canvas",
      "pliante": "pliante",
      "flayere": "pliante",
      "materiale": "materiale_rigide",
    };

    const landingCategory = landingCatMap[category] || category;
    const landingInfo = getLandingInfo(landingCategory, cleanedSlug) || getLandingInfo(landingCategory, raw);

    if (landingInfo) {
      const baseProductSlug = landingInfo.productRouteSlug || category;
      const baseProduct = getProductBySlug(baseProductSlug) || getProductBySlug(category);

      const hybridProduct: Product = {
        ...(baseProduct || {}),
        id: `landing-${landingInfo.key}`,
        slug: cleanedSlug,
        routeSlug: cleanedSlug,
        title: landingInfo.title,
        description: landingInfo.shortDescription,
        seo: {
          title: landingInfo.seoTitle,
          description: landingInfo.seoDescription
        },
        contentHtml: landingInfo.contentHtml,
        images: landingInfo.images ? normalizeImagePaths(landingInfo.images) : (baseProduct?.images || []),
        priceBase: baseProduct?.priceBase ?? 0,
        currency: baseProduct?.currency ?? "RON",
        materials: baseProduct?.materials ?? [],
        metadata: { ...(baseProduct?.metadata || {}), category, isLanding: true }
      } as Product;

      return {
        product: hybridProduct,
        initialWidth: width ?? hybridProduct.width_cm ?? null,
        initialHeight: height ?? hybridProduct.height_cm ?? null,
        isFallback: false
      };
    }
  }

  function categoryLookup(candidate: string | undefined): { product?: Product; initialWidth?: number | null; initialHeight?: number | null; isFallback?: boolean } | null {
    if (!category || !candidate) return null;
    const slugCandidate = String(candidate).toLowerCase().trim();
    const candidates = PRODUCTS.filter((p) => {
      const pCat = String(p.metadata?.category ?? "").toLowerCase();
      const reqCat = String(category).toLowerCase();
      return pCat === reqCat;
    });

    for (const p of candidates) {
      const ids = [String(p.id ?? ""), String(p.slug ?? ""), String(p.routeSlug ?? "")].map((x) => x.toLowerCase());
      if (ids.includes(slugCandidate) || ids.some((id) => id && slugCandidate.split("/").pop() === id)) {
        return {
          product: p,
          initialWidth: p.width_cm ?? p.minWidthCm ?? null,
          initialHeight: p.height_cm ?? p.minHeightCm ?? null,
          isFallback: false,
        };
      }
    }
    return null;
  }

  if (category) {
    const catResClean = categoryLookup(cleanedSlug);
    if (catResClean) return catResClean;
    const catResRaw = categoryLookup(raw);
    if (catResRaw) return catResRaw;
  }

  const productClean = getProductBySlug(cleanedSlug);
  if (productClean) {
    return {
      product: productClean,
      initialWidth: productClean.width_cm ?? productClean.minWidthCm ?? null,
      initialHeight: productClean.height_cm ?? productClean.minHeightCm ?? null,
      isFallback: false,
    };
  }

  const productRaw = getProductBySlug(raw);
  if (productRaw) {
    return {
      product: productRaw,
      initialWidth: productRaw.width_cm ?? productRaw.minWidthCm ?? null,
      initialHeight: productRaw.height_cm ?? productRaw.minHeightCm ?? null,
      isFallback: false,
    };
  }

  if (typeof width === "number" && typeof height === "number") {
    const w = width;
    const h = height;
    const fallback: Product = {
      id: `fallback-${w}x${h}`,
      slug: `fallback-${w}x${h}`,
      routeSlug: `${w}x${h}`,
      title: `Produs ${w}x${h} cm`,
      description: `Produs personalizat ${w}x${h} cm — configurează dimensiuni și finisaje.`,
      images: ["/products/banner/banner-1.webp"],
      priceBase: 0,
      currency: "RON",
      tags: ["fallback", "personalizat"],
      metadata: { category: category ?? "bannere" },
    };
    return { product: fallback, initialWidth: w, initialHeight: h, isFallback: true };
  }

  if (category) {
    const CATEGORY_FALLBACK: Record<string, { title: string; image: string; defaultSlug: string }> = {
      pliante: { title: "Pliante personalizate", image: "/products/pliante/pliante-1.webp", defaultSlug: "pliante" },
      canvas: { title: "Canvas personalizat", image: "/products/canvas/canvas-1.webp", defaultSlug: "canvas" },
      autocolante: { title: "Autocolante personalizate", image: "/products/autocolante/autocolante-1.webp", defaultSlug: "autocolante" },
      flyer: { title: "Flyere personalizate", image: "/products/pliante/pliante-1.webp", defaultSlug: "flyer" },
      flayere: { title: "Flyere personalizate", image: "/products/pliante/pliante-1.webp", defaultSlug: "flayere" },
      banner: { title: "Banner personalizat", image: "/products/banner/banner-1.webp", defaultSlug: "banner" },
      bannere: { title: "Banner personalizat", image: "/products/banner/banner-1.webp", defaultSlug: "banner" },
      afise: { title: "Afișe personalizate", image: "/products/afise/afise-1.webp", defaultSlug: "afise" },
      tapet: { title: "Tapet personalizat", image: "/products/tapet/tapet-1.webp", defaultSlug: "tapet" },
      carton: { title: "Carton personalizat", image: "/products/banner/banner-1.webp", defaultSlug: "carton" },
    };

    const catKey = String(category || "").toLowerCase();
    const info = CATEGORY_FALLBACK[catKey] ?? { title: `${category} - Produs personalizat`, image: "/images/generic-banner.jpg", defaultSlug: category ?? "product" };

    const fallback: Product = {
      id: `fallback-${catKey}`,
      slug: `fallback-${catKey}`,
      routeSlug: cleanedSlug || info.defaultSlug,
      title: info.title,
      description: `Configurați ${info.title.toLowerCase()} — completați dimensiunile și opțiunile.`,
      images: [info.image],
      priceBase: 0,
      currency: "RON",
      tags: [catKey],
      metadata: { category: catKey },
    };
    return { product: fallback, initialWidth: null, initialHeight: null, isFallback: true };
  }

  return { product: undefined, initialWidth: null, initialHeight: null, isFallback: false };
}