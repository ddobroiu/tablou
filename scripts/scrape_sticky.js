
const fs = require('fs');
const path = require('path');
const https = require('https');

const OUTPUT_FILE = path.join(__dirname, '../public/stickers/products-sticky.json');
const BASE_URL = 'https://www.sticky-art.ro/catalog/stickere-semnalistica-67';

// Sleep helper to avoid 429
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simple fetch wrapper
const fetchUrl = (url) => {
    return new Promise((resolve, reject) => {
        const req = https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        }, (res) => {
            if (res.statusCode !== 200) {
                // If 301/302 redirect
                if (res.statusCode > 300 && res.statusCode < 400 && res.headers.location) {
                    return fetchUrl(res.headers.location).then(resolve).catch(reject);
                }
                return reject(new Error(`Status Code: ${res.statusCode}`));
            }
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        });
        req.on('error', reject);
    });
};

// Main scraper function
async function scrape() {
    let allProducts = [];

    // Load existing
    if (fs.existsSync(OUTPUT_FILE)) {
        allProducts = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
        console.log(`Loaded ${allProducts.length} existing products.`);
    }

    // Determine starting ID index
    let nextId = allProducts.length + 1;

    // Loop through pages
    for (let page = 1; page <= 9; page++) {
        const url = page === 1 ? BASE_URL : `${BASE_URL}/p${page}`;
        console.log(`Scraping page ${page}: ${url}`);

        try {
            const html = await fetchUrl(url);

            // Regex to find product blocks
            // Looking for pattern: <div class="grid-inner"> ... <a href="LINK"> ... <img ... src="IMG" ... alt="TITLE"> ... class="price">PRICE<
            // This is a rough estimation. We'll do global matches for the image part which seems distinctive.

            // Pattern for Image and Title and Link
            // <a href="https://www.sticky-art.ro/cumpara/..." title="...">
            // <img src="..." class="grid-image__image" alt="...">

            const productRegex = /<a[^>]+href="([^"]+)"[^>]*>[\s\S]*?<img[^>]+src="([^"]+)"[^>]+alt="([^"]+)"/g;
            let match;
            let count = 0;

            while ((match = productRegex.exec(html)) !== null) {
                const link = match[1];
                const image = match[2];
                const title = match[3];

                // Basic cleaning
                if (!link.includes('sticky-art.ro')) continue; // Skip external ads if any

                // Check if exists
                const exists = allProducts.some(p => p.title === title || p.slug === link.split('/').pop());
                if (!exists) {
                    // Extract Dimensions from Title if possible
                    let width = 20;
                    let height = 30;

                    // Simple regex for dim
                    const dimMatch = title.match(/(\d+)x(\d+)/i);
                    if (dimMatch) {
                        width = parseInt(dimMatch[1]);
                        height = parseInt(dimMatch[2]);
                    }

                    // Default Price (can't reliably parse from regex without complex DOM logic, usually around 15-25)
                    const price = 15.0;

                    allProducts.push({
                        id: `sticky-${nextId++}`,
                        title: title,
                        image: image,
                        price: price,
                        slug: link.split('/').pop().replace('.html', ''),
                        category: "Stickere",
                        subcategory: "Semnalistică", // Default fallback
                        width_cm: width,
                        height_cm: height
                    });
                    count++;
                }
            }

            console.log(`Found ${count} new products on page ${page}.`);

            // Wait 2 seconds to be nice
            await sleep(2000);

        } catch (err) {
            console.error(`Failed to scrape page ${page}:`, err.message);
            // If 429, we stop
            if (err.message.includes('429')) break;
        }
    }

    // Save
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allProducts, null, 2));
    console.log(`Total products now: ${allProducts.length}`);
}

scrape();
