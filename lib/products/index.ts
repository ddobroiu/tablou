// Main products index - imports all product modules
// This keeps the codebase organized and maintainable

import { SCRAPED_CANVAS_PRODUCTS } from './canvas';

/**
 * All products combined from different modules
 * Each module handles its own category of products
 * 
 * Current modules:
 * - Canvas: 750 products (scraped from arthub.ro)
 */
export const ALL_EXTRA_PRODUCTS = [
    ...SCRAPED_CANVAS_PRODUCTS,
];

// Re-export individual modules for direct access if needed
export { SCRAPED_CANVAS_PRODUCTS } from './canvas';

// Export total count for debugging
export const PRODUCTS_COUNT = {
    canvas: SCRAPED_CANVAS_PRODUCTS.length,
    total: ALL_EXTRA_PRODUCTS.length,
};
