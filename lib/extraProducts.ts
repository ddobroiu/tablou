// lib/extraProducts.ts
// Extra products (raw) generated from user-provided list.
// Combined with ALL_EXTRA_PRODUCTS from modular structure
import { ALL_EXTRA_PRODUCTS } from './products/index';

/**
 * Slugify function to create clean URLs from titles
 */
export function slugify(input: string): string {
  let s = input.replace(/^Tablou\s+canvas\s+/i, "").trim();
  // Normalize common diacritics/accents
  const map: Record<string, string> = {
    "ă": "a", "â": "a", "î": "i", "ș": "s", "ş": "s", "ț": "t", "ţ": "t",
    "Ă": "a", "Â": "a", "Î": "i", "Ș": "s", "Ş": "s", "Ț": "t", "Ţ": "t",
    "é": "e", "è": "e", "ê": "e", "ë": "e",
    "á": "a", "à": "a", "ä": "a", "ã": "a",
    "í": "i", "ì": "i", "ï": "i",
    "ó": "o", "ò": "o", "ö": "o", "ô": "o",
    "ú": "u", "ù": "u", "ü": "u", "û": "u",
    "ç": "c", "ñ": "n",
  };
  s = s.replace(/[\u0103\u00E2\u00EE\u0219\u015F\u021B\u0163\u0102\u00C2\u00CE\u0218\u015E\u021A\u0162\u00E9\u00E8\u00EA\u00EB\u00E1\u00E0\u00E4\u00E3\u00EE\u00ED\u00EC\u00EF\u00F3\u00F2\u00F6\u00F4\u00FA\u00F9\u00FC\u00FB\u00E7\u00F1]/g, ch => map[ch] ?? ch);
  s = s
    .toLowerCase()
    .replace(/&/g, " si ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return s;
}

// All products from the removed categories (afise, autocolante, bannere, carton, flayere, tapet) have been removed.
// We only retain remaining products from the modular index (currently only Canvas).
export const EXTRA_PRODUCTS_RAW: any[] = ALL_EXTRA_PRODUCTS;
