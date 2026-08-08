// Script pentru a genera produse canvas din JSON pentru integrare în shop
const fs = require('fs');
const path = require('path');

// Citește produsele canvas
const canvasProducts = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../public/canvas/products.json'), 'utf-8')
);

console.log(`📊 Total produse canvas găsite: ${canvasProducts.length}`);

// Categorii pentru canvas
const categories = {
    'Abstracte': [],
    'Flori': [],
    'Peisaje': [],
    'Auriu': [],
    'Aripi': [],
    'Fashion': [],
    'Altele': []
};

// Clasifică produsele
canvasProducts.forEach(product => {
    const name = product.name.toLowerCase();
    let categorized = false;

    if (name.includes('abstract')) {
        categories['Abstracte'].push(product);
        categorized = true;
    }
    if (name.includes('flower') || name.includes('lily') || name.includes('magnol') ||
        name.includes('daisy') || name.includes('poppy') || name.includes('rose') ||
        name.includes('bouquet') || name.includes('floral')) {
        categories['Flori'].push(product);
        categorized = true;
    }
    if (name.includes('mountain') || name.includes('tatra') || name.includes('sea') ||
        name.includes('nature') || name.includes('landscape') || name.includes('beach') ||
        name.includes('lake') || name.includes('forest')) {
        categories['Peisaje'].push(product);
        categorized = true;
    }
    if (name.includes('gold') || name.includes('golden')) {
        categories['Auriu'].push(product);
        categorized = true;
    }
    if (name.includes('angel') || name.includes('wings')) {
        categories['Aripi'].push(product);
        categorized = true;
    }
    if (name.includes('lips') || name.includes('eyeliner') || name.includes('fashion') ||
        name.includes('makeup')) {
        categories['Fashion'].push(product);
        categorized = true;
    }

    if (!categorized) {
        categories['Altele'].push(product);
    }
});

// Afișează statistici
console.log('\n📈 Statistici pe categorii:');
Object.entries(categories).forEach(([cat, products]) => {
    console.log(`  • ${cat}: ${products.length} produse`);
});

// Generează produse pentru extraProducts.ts
const generatedProducts = [];

Object.entries(categories).forEach(([categoryName, products]) => {
    if (products.length === 0) return;

    // Creează un produs reprezentativ pentru fiecare categorie
    const firstProduct = products[0];
    const slug = `canvas-${categoryName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

    generatedProducts.push({
        id: slug,
        slug: slug,
        routeSlug: slug,
        title: `Tablouri Canvas ${categoryName}`,
        description: `Descoperă ${products.length} modele unice de tablouri canvas ${categoryName.toLowerCase()}. Print de calitate pe pânză premium, întinsă pe șasiu de lemn.`,
        images: [firstProduct.image],
        priceBase: 79,
        currency: 'RON',
        tags: ['canvas', categoryName.toLowerCase(), 'tablouri', 'print'],
        metadata: {
            category: 'Canvas',
            subcategory: categoryName,
            productCount: products.length,
            allProducts: products
        }
    });
});

// Salvează rezultatul
const output = {
    products: generatedProducts,
    totalProducts: canvasProducts.length,
    categories: Object.keys(categories).map(cat => ({
        name: cat,
        count: categories[cat].length
    }))
};

fs.writeFileSync(
    path.join(__dirname, 'canvas-products-generated.json'),
    JSON.stringify(output, null, 2),
    'utf-8'
);

console.log(`\n✅ Generat ${generatedProducts.length} produse canvas pentru shop`);
console.log(`📁 Salvat în: canvas-products-generated.json`);

// Generează și codul TypeScript
const tsCode = `// Auto-generated canvas products
export const CANVAS_PRODUCTS = ${JSON.stringify(generatedProducts, null, 2)};
`;

fs.writeFileSync(
    path.join(__dirname, 'canvasProducts.ts'),
    tsCode,
    'utf-8'
);

console.log(`📄 Generat și: canvasProducts.ts\n`);
