const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'lib', 'products', 'canvas-products.ts');
const content = fs.readFileSync(filePath, 'utf8');

console.log("File length:", content.length);
console.log("First 500 chars snippet:");
console.log(content.slice(0, 500));

const id = "canvas-5";
const idRegex = new RegExp(`"id":\\s*"${id}",`);
console.log(`Searching for ID: ${id} with regex: ${idRegex}`);
const match = idRegex.exec(content);
console.log("Match found?", !!match);
if (match) {
    console.log("Match index:", match.index);
    console.log("Match string:", match[0]);
} else {
    // Try simpleIndexOf
    console.log("Simple indexOf check:", content.indexOf(`"id": "canvas-5"`));
}
