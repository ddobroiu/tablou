const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'lib', 'products', 'canvas-products.ts');
let content = fs.readFileSync(filePath, 'utf8');

const phrasesToRemove = [
    "Comandă fără riscuri! Beneficiezi de 30 de zile drept de retur și garanție pe termen lung. Îți dorim cumpărături plăcute!",
    "Beneficiezi de 30 de zile drept de retur",
    "30 de zile drept de retur",
    "Comandă fără niciun risc!",
    "Dacă nu ești mulțumit, serviciul nostru de relații cu clienții îți stă la dispoziție.",
    "Cu drag,\\nEchipa shopprint",
    "Cu drag, Echipa shopprint"
];

let count = 0;

phrasesToRemove.forEach(phrase => {
    // Escape special regex chars if any, but simplistic check is string replace
    while (content.includes(phrase)) {
        content = content.replace(phrase, "");
        count++;
    }
});

// Also cleaner regex for lingering newlines after removal
content = content.replace(/\n\n\n+/g, "\n\n");

fs.writeFileSync(filePath, content, 'utf8');
console.log(`Removed ${count} instances of risk/return phrases.`);
