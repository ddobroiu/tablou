
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/stickermania/banners-stickermania.json');

const priceMap = {
    "1x0.5m": 55,
    "0.5mx1m": 55,       // normalized version of 1x0.5m (reversed)
    "1.5x0.75m": 93,
    "0.75mx1.5m": 93,    // normalized reversed
    "2x1m": 165,
    "1mx2m": 165,        // normalized reversed
    "3x1.5m": 371.25,
    "1.5mx3m": 371.25    // normalized reversed
};

// Normalize size strings to match keys (remove spaces, lowercase)
function normalizeSize(sizeStr) {
    // Convert "0-5m-x-1m" -> "0.5x1m"
    // Convert "1m x 0.5m" -> "1x0.5m"
    let s = sizeStr.toLowerCase().replace(/\s+/g, '');

    // Handle stickermania slug format (e.g. 0-5m-x-1m)
    if (s.includes('-x-')) {
        s = s.replace(/-x-/g, 'x'); // 0-5m x 1m
        // Replace remaining dashes between numbers with dots (for decimals)
        // Except for the 'x' separator and 'm' suffix
        s = s.replace(/(\d)-(\d)/g, '$1.$2');
        s = s.replace(/-/g, '.'); // catch-all for remaining dashes if any logic missed
    }

    // Normalize decimal points if needed (remove trailing zeros if implemented, but here just ensure structure)
    return s;
}

try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    let products = JSON.parse(rawData);
    let updatedCount = 0;

    products = products.map(product => {
        let updatedVariants = false;

        if (product.metadata && product.metadata.variants) {
            product.metadata.variants = product.metadata.variants.map(variant => {
                const nSize = normalizeSize(variant.size);

                // Try direct match or key normalization match
                let matchedPrice = null;
                for (const key in priceMap) {
                    const nKey = normalizeSize(key);
                    // Debug logs
                    // console.log(`Comparing variant: ${nSize} vs key: ${nKey}`);

                    if (nSize === nKey || nSize.split('x').reverse().join('x') === nKey) {
                        matchedPrice = priceMap[key];
                        break;
                    }
                }

                if (matchedPrice !== null) {
                    variant.price = matchedPrice;
                    updatedVariants = true;
                } else {
                    // Fallback: Calculate based on area if no direct match
                    // Standard price derived from 2x1m = 165 RON => ~82.5 RON/sqm
                    // But checking 1x0.5m = 55 RON => 110 RON/sqm
                    // Let's use a standard rate close to the user's request:
                    // 1x2 = 165 -> 82.5
                    // 1.5x3 = 371.25 -> 82.5

                    const widthMatch = nSize.match(/([\d\.]+)m/);
                    const heightMatch = nSize.match(/x([\d\.]+)m/);

                    if (widthMatch && heightMatch) {
                        const w = parseFloat(widthMatch[1]);
                        const h = parseFloat(heightMatch[1]);
                        const area = w * h;
                        const price = area * 82.5;

                        variant.price = parseFloat(price.toFixed(2));
                        updatedVariants = true;
                        // console.log(`Calculated price for ${nSize}: ${variant.price}`);
                    } else {
                        console.log(`No match and could not calculate for: ${variant.size} -> ${nSize}`);
                    }
                }
                return variant;
            });
        }

        if (updatedVariants) {
            updatedCount++;
            // Update main price to be the price of the first variant (usually smallest)
            if (product.metadata.variants.length > 0) {
                // Find min price
                const prices = product.metadata.variants.map(v => v.price);
                product.price = Math.min(...prices);
            }
        }
        return product;
    });

    fs.writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf8');
    console.log(`Successfully updated prices for ${updatedCount} products.`);

} catch (err) {
    console.error("Error updating prices:", err);
    process.exit(1);
}
