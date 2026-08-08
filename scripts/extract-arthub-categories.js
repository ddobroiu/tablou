// Script to extract real categories from arthub.ro URLs
const fs = require('fs');
const path = require('path');

// Read products.json
const productsPath = path.join(__dirname, '../public/canvas/products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

// Extract categories from sourceImage URLs
const categoryMap = new Map();

products.forEach(product => {
    if (product.sourceImage) {
        // Decode URL first
        const decodedUrl = decodeURIComponent(product.sourceImage);

        // Extract path from URL: /produse-amazon/tablouri-canvas/CATEGORY/SUBCATEGORY/
        const match = decodedUrl.match(/tablouri-canvas\/([^\/]+)\/([^\/]+)\//);
        if (match) {
            const mainCategory = match[1];
            const subCategory = match[2];

            if (!categoryMap.has(mainCategory)) {
                categoryMap.set(mainCategory, new Set());
            }
            categoryMap.get(mainCategory).add(subCategory);

            // Add to product
            product.arthubCategory = mainCategory;
            product.arthubSubcategory = subCategory;
        }
    }
});

// Display categories
console.log('\n📊 CATEGORII ARTHUB.RO:\n');
const categories = Array.from(categoryMap.entries()).sort();
let totalSubcategories = 0;

categories.forEach(([category, subcategories]) => {
    totalSubcategories += subcategories.size;
    console.log(`\n🎨 ${category.toUpperCase()} (${subcategories.size} subcategorii):`);
    Array.from(subcategories).sort().forEach(sub => {
        const count = products.filter(p =>
            p.arthubCategory === category && p.arthubSubcategory === sub
        ).length;
        console.log(`   - ${sub}: ${count} produse`);
    });
});

// Save updated products with categories
const outputPath = path.join(__dirname, '../public/canvas/products-with-categories.json');
fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));

console.log(`\n✅ Salvat în: ${outputPath}`);
console.log(`\n📊 STATISTICI:`);
console.log(`   - ${categories.length} categorii principale`);
console.log(`   - ${totalSubcategories} subcategorii totale`);
console.log(`   - ${products.length} produse`);
