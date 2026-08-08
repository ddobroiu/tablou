/**
 * scripts/seo-optimizer.js
 * Script to rewrite product titles and descriptions to avoid duplicate content penalties.
 */
const fs = require('fs');
const path = require('path');

const STICKERMANIA_PATH = path.join(__dirname, '../public/stickermania/products-stickermania.json');
const EUROPOSTERS_PATH = path.join(__dirname, '../public/posters/products-europosters.json');
const CANVAS_PATH = path.join(__dirname, '../public/canvas/products-r2-optimized.json');
const STICKY_PATH = path.join(__dirname, '../public/stickers/products-sticky.json');

// Synonyms for Signage
const INDICATOR_SYNONYMS = ['Panou Semnalizare', 'Plăcuță', 'Indicator', 'Afișaj Protect', 'Semnalistică', 'Sticker', 'Abțibild'];
const DESCRIPTION_TEMPLATES = [
    "Asigură conformitatea și siguranța în locația ta cu un [TITLE] de top. Realizat din materiale durabile, rezistente la UV și intemperii.",
    "Alege un [TITLE] profesional pentru o vizibilitate maximă. Ideal pentru utilizare în interior sau exterior, disponibil pe suport PVC sau autocolant.",
    "Semnalizează corect zonele de risc cu acest [TITLE]. Produs de înaltă calitate, tăiat precis și printat cu tehnologie UV de ultimă oră.",
    "Soluție completă de semnalistică: [TITLE]. Design clar, culori vibrante și rezistență îndelungată în orice mediu de lucru.",
    "Optimizează siguranța la locul de muncă folosind [TITLE]. Un element esențial pentru orice spațiu comercial sau industrial modern.",
    "Indicator durabil [TITLE], conceput pentru a rezista ani de zile fără a se decolora. Fabricat conform standardelor europene.",
    "Mesaj clar și vizibilitate sportită cu [TITLE]. Montaj ușor pe orice suprafață netedă sau rigidă.",
    "Produs premium din gama noastră de securitate: [TITLE]. Rezistent la apă, zgârieturi și expunere solară prelungită.",
    "Îmbunătățește organizarea spațiului tău cu acest [TITLE] de înaltă definiție. Culori intense și finisaj profesional.",
    "Design standardizat și execuție impecabilă pentru [TITLE]. Alege calitatea Prynt pentru proiectul tău de semnalizare."
];

// Synonyms for Posters/Decor
const POSTER_SYNONYMS = ['Tablou Decorativ', 'Poster Art', 'Afiș Modern', 'Decor Perete', 'Piesă de Artă'];
const POSTER_TEMPLATES = [
    "Redecorează-ți casa cu acest [TITLE], o piesă ce aduce un plus de personalitate oricărei camere. Calitate premium garantată.",
    "Transformă atmosfera oricărui spațiu cu [TITLE]. O alegere excelentă pentru iubitorii de design și estetică modernă.",
    "Descoperă colecția noastră: [TITLE]. Printat pe materiale de înaltă rezoluție pentru detalii incredibile și culori ce nu se deolorează.",
    "O piesă centrală pentru peretele tău - [TITLE]. Adaugă eleganță și stil cu acest model unic din gama Prynt.",
    "Creează un punct focal impresionant în living sau dormitor cu [TITLE]. Artă modernă accesibilă la un click distanță.",
    "Estetică rafinată și detalii vibrante: [TITLE]. Perfect pentru a dărui un suflu nou decorului tău interior.",
    "Inspiră-te zilnic dintr-o atmosferă creativă alături de [TITLE]. Realizat cu tehnologie de printare eco-friendly.",
    "Un mix perfect între stil și durabilitate, [TITLE] este soluția ideală pentru o reîmprospătare rapidă a casei.",
    "Adu arta mai aproape de tine cu [TITLE]. Fiecare detaliu este redat cu o claritate excepțională pe suport profesional.",
    "Eleganță discretă sau impact vizual puternic? [TITLE] oferă ambele avantaje pentru un design interior reușit."
];

function transformTitle(original, synonyms) {
    let title = original;
    // Remove common starting words to re-inject synonyms
    title = title.replace(/^(Indicator|Panou|Placuta|Afis|Tablou|Sticker)\s+/i, '');

    const synonym = synonyms[Math.floor(Math.random() * synonyms.length)];
    const formats = [
        `${synonym} - ${title}`,
        `${title} (${synonym})`,
        `${synonym}: ${title}`,
        `Prynt: ${title} - ${synonym}`
    ];

    return formats[Math.floor(Math.random() * formats.length)];
}

function transformDescription(title, templates) {
    const template = templates[Math.floor(Math.random() * templates.length)];
    return template.replace('[TITLE]', title);
}

function processStickermania() {
    if (!fs.existsSync(STICKERMANIA_PATH)) return;
    const data = JSON.parse(fs.readFileSync(STICKERMANIA_PATH, 'utf8'));
    const processed = data.map(p => {
        const newTitle = transformTitle(p.title, INDICATOR_SYNONYMS);
        return {
            ...p,
            title: newTitle,
            description: transformDescription(newTitle, DESCRIPTION_TEMPLATES)
        };
    });
    fs.writeFileSync(STICKERMANIA_PATH, JSON.stringify(processed, null, 2));
    console.log(`Updated ${processed.length} Stickermania products.`);
}

function processEuroposters() {
    if (!fs.existsSync(EUROPOSTERS_PATH)) return;
    const data = JSON.parse(fs.readFileSync(EUROPOSTERS_PATH, 'utf8'));
    const processed = data.map(p => {
        const newTitle = transformTitle(p.title, POSTER_SYNONYMS);
        const desc = transformDescription(newTitle, POSTER_TEMPLATES);
        return {
            ...p,
            title: newTitle,
            description: desc,
            metadata: {
                ...p.metadata,
                seo_title: `${newTitle} | Magazin Prynt`,
                seo_description: desc
            }
        };
    });
    fs.writeFileSync(EUROPOSTERS_PATH, JSON.stringify(processed, null, 2));
    console.log(`Updated ${processed.length} Europosters products.`);
}

function processCanvas() {
    if (!fs.existsSync(CANVAS_PATH)) return;
    const data = JSON.parse(fs.readFileSync(CANVAS_PATH, 'utf8'));
    const processed = data.map(p => {
        const newTitle = transformTitle(p.title, POSTER_SYNONYMS);
        const desc = transformDescription(newTitle, POSTER_TEMPLATES);
        return {
            ...p,
            title: newTitle,
            description: desc,
            metadata: {
                ...p.metadata,
                seo_title: `${newTitle} | Magazin Prynt`,
                seo_description: desc
            }
        };
    });
    fs.writeFileSync(CANVAS_PATH, JSON.stringify(processed, null, 2));
    console.log(`Updated ${processed.length} Canvas products.`);
}

function processStickyArt() {
    if (!fs.existsSync(STICKY_PATH)) return;
    const data = JSON.parse(fs.readFileSync(STICKY_PATH, 'utf8'));
    const processed = data.map(p => {
        const newTitle = transformTitle(p.title, INDICATOR_SYNONYMS);
        return {
            ...p,
            title: newTitle,
            description: transformDescription(newTitle, DESCRIPTION_TEMPLATES)
        };
    });
    fs.writeFileSync(STICKY_PATH, JSON.stringify(processed, null, 2));
    console.log(`Updated ${processed.length} Sticky-Art products.`);
}

async function run() {
    try {
        processStickermania();
        processEuroposters();
        processCanvas();
        processStickyArt();
        console.log('SEO Optimization complete!');
    } catch (err) {
        console.error('Error during SEO optimization:', err);
    }
}

run();
