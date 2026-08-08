/**
 * Simple Spintax system to generate unique variations of text.
 * Example input: "{Livrare|Expediere} rapidă în {oraș}."
 */
export function spintax(text: string, seed: string = ""): string {
    const random = getSeededRandom(seed);
    
    return text.replace(/{([^{}]+)}/g, (_, choice) => {
        const parts = choice.split('|');
        const index = Math.floor(random * parts.length);
        return parts[index];
    });
}

function getSeededRandom(seedStr: string) {
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
        hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const x = Math.sin(hash++) * 10000;
    return x - Math.floor(x);
}

export const SEO_TEMPLATES = {
    productLocality: [
      "{Cauti|Ai nevoie de} {produs} în {localitate}? Tablou este {partenerul tau|sursa ta} de {incredere|calitate}.",
      "Echipa noastra {produce|imprima} {produs} la {pret de producator|preturi competitive} cu {livrare rapida|expediere imediata} în {localitate}.",
      "{localitate} beneficiaza acum de {cea mai buna tehnologie|tehnologie de ultima ora} UV pentru {produs} personalizat.",
    ]
};
