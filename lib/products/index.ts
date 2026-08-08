// Main products index - imports all product modules
// This keeps the codebase organized and maintainable

import { SCRAPED_CANVAS_PRODUCTS } from './canvas';
import { euFundsProducts } from './eu-funds';

/**
 * All products combined from different modules
 * Each module handles its own category of products
 * 
 * Current modules:
 * - Canvas: 750 products (scraped from arthub.ro)
 * - EU Funds: Visibility kits
 */
export const ALL_EXTRA_PRODUCTS = [
    ...SCRAPED_CANVAS_PRODUCTS,
    ...euFundsProducts,
];

// Re-export individual modules for direct access if needed
export { SCRAPED_CANVAS_PRODUCTS } from './canvas';
export { euFundsProducts } from './eu-funds';

// Export total count for debugging
export const PRODUCTS_COUNT = {
    canvas: SCRAPED_CANVAS_PRODUCTS.length,
    euFunds: euFundsProducts.length,
    total: ALL_EXTRA_PRODUCTS.length,
};
