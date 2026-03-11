export const canvasSeoKeywords = [
    "tablou canvas personalizat", "canvas personalizat", "tablouri canvas personalizate",
    "tablou personalizat pe panza", "tablou panza personalizat", "tablouri pe panza personalizate",
    "tablou personalizat canvas", "tablou cu poza", "tablouri panza personalizate",
    "tablou pe panza personalizat", "tablou poza", "tablouri personalizate pe panza",
    "tablou canvas personalizat ieftin", "tablou vertical", "canvas personalizate",
    "tablou cu poza personalizata", "poze canvas", "tablou personalizat panza",
    "poza tablou", "canvas tablou personalizat", "poza canvas", "tablou cu poze personalizat",
    "printare canvas", "tablou pe pânză", "tablou canvas personalizate",
    "comanda tablou personalizat", "tablou pe panza canvas", "canvas bucatarie",
    "tablouri cu poza", "tablouri din panza", "canvas poze", "print canvas",
    "tablou panza", "tablou personalizat ieftin", "tablou mafia", "print pe panza",
    "tablou panza canvas", "tablou pe panza cu poza", "tablouri verticale",
    "tablouri pe panza canvas", "tablouri personalizate canvas", "tablou poza personalizat",
    "tablou antonio montana", "tablou cu poza ta", "print pe canvas",
    "tablouri canvas personalizat", "tablou canvas poza", "tablou godfather",
    "tablouri canvas bucatarie", "tablou the godfather", "tablouri cu poza ta",
    "printare tablouri canvas", "tablou canvas bucatarie", "tablou pe panza",
    "tablou canva", "tablouri panza canvas", "tablou pentru birou", "tablou print",
    "tablou canvas ieftin", "print tablou", "tablou pt dormitor", "picturi canvas",
    "tablou mare personalizat", "tablou din panza", "tablou de panza",
    "tony montana tablou", "tablou joker", "poze pe canvas", "tablou orizontal",
    "tablouri pt bucatarii", "tablou personalizate", "tablouri pe panza pret",
    "tablou buze", "tablou pt bucatarie", "tablou canvas pe panza", "printare pe panza",
    "tablou pe canvas", "inramare poze", "tablouri panza", "tablouri personalizate panza"
];

export const pnrrSeoKeywords = [
    "placute informative start up nation", "autocolant pnrr", "autocolante pnrr",
    "placute start up nation", "panou pnrr", "placa permanenta pnrr", "panou temporar pnrr",
    "afis pnrr", "afis program", "etichete autocolante pnrr", "panou fonduri europene",
    "comunicat de presa incepere proiect pnrr", "comunicat de presa pnrr",
    "comunicat de presa finalizare proiect", "manual identitate vizuala pnrr"
];

function generateSlug(str) {
    if(!str) return '';
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

function titleCase(str) {
    if(!str) return '';
    return str.toLowerCase().split(' ').map(word => {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
}

export const generatedCanvasSeoProducts = canvasSeoKeywords.map((kw, index) => {
    return {
        id: "seo-canvas-gen-" + index,
        slug: generateSlug(kw) + "-ieftin-calitate-premium",
        routeSlug: "configurator/canvas",
        title: titleCase(kw),
        description: `Alege ${kw} pentru un decor impresionant sau un cadou memorabil. Calitate premium, print UV la nivel fotografic pe panza din bumbac suta la suta. Culori vii, rezistente in timp, cu livrare rapida direct la tine acasa!`,
        image: "/products/canvas/canvas-1.webp",
        price: "De la 39 LEI",
        category: "Campanii SEO",
        tags: [kw, "tablou canvas", "print pe panza", "decoratiuni interioare"],
        metadata: { isSeoCampaign: true }
    };
});

export const generatedPnrrSeoProducts = pnrrSeoKeywords.map((kw, index) => {
    return {
        id: "seo-pnrr-gen-" + index,
        slug: generateSlug(kw) + "-obligatoriu",
        routeSlug: "fonduri-pnrr",
        title: titleCase(kw),
        description: `Servicii dedicate pentru ${kw}. Asiguram conformitatea stricta cu manualul de identitate vizuala. Productie rapida, materiale rezistente si respectarea normelor europene obligatorii.`,
        image: "/products/fonduri/pnrr-1.webp",
        price: "De la 150 LEI",
        category: "Campanii SEO",
        tags: [kw, "fonduri europene", "pnrr", "vizibilitate"],
        metadata: { isSeoCampaign: true }
    };
});
