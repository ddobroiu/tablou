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
    "tablou pe canvas", "inramare poze", "tablouri panza", "tablouri personalizate panza",
    "tablouri mari dormitor", "tablou canvas personalizat ieftin"
];

export const pnrrSeoKeywords = [
    "placute informative start up nation", "autocolant pnrr", "autocolante pnrr",
    "placute start up nation", "panou pnrr", "placa permanenta pnrr", "panou temporar pnrr",
    "afis pnrr", "afis program", "etichete autocolante pnrr", "panou fonduri europene",
    "comunicat de presa incepere proiect pnrr", "comunicat de presa pnrr",
    "comunicat de presa finalizare proiect", "manual identitate vizuala pnrr",
    "panou pnrr editabil", "anunt obligatoriu finalizare proiect",
    "comunicat obligatoriu finalizare proiect", "adauga comunitat de presa finalizare proiect",
    "start up nation"
];

export const publicitareSeoKeywords = [
    "stickere auto iasi", "comanda pliante online", "afise a2", "stickere personalizate iasi",
    "pliante personalizate", "autocolante geamuri pret", "plexiglas cluj", "stickere personalizate cluj",
    "tipografie online", "printare fotografii cluj", "banner vrei sa fii sotia mea", "mesh personalizat",
    "plianteieftine.ro", "afis publicitar model", "regio print", "afiș model",
    "plexiglas opac", "banner gard", "plexiglas la comanda", "autocolant personalizat geam",
    "bannere cluj", "autocolante pentru școală", "autocolant geam personalizat",
    "bannere publicitare cluj", "alucobond ieftin", "fluturasi publicitari modele",
    "autocolante adr", "autocolante cluj", "panou stradal pret", "publicitate iasi",
    "promovare auto", "pliante publicitare", "suport reclama stradala", "autocolante ieftine",
    "printare bannere,tablouri canvas , fotografii,postere etichete personalizate onesti",
    "shopprint", "euprint", "adbanner", "anuntul"
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

export const generatedPublicitareSeoProducts = publicitareSeoKeywords.map((kw, index) => {
    let route = "configurator/banner";
    if (kw.includes("pliant") || kw.includes("fluturas")) route = "configurator/pliante";
    if (kw.includes("autocolant") || kw.includes("sticker")) route = "configurator/autocolant";
    if (kw.includes("afis") || kw.includes("poster")) route = "configurator/afise";
    if (kw.includes("plexiglas")) route = "materiale/plexiglass";
    if (kw.includes("alucobond")) route = "materiale/alucobond";
    if (kw.includes("fotografii") || kw.includes("canvas")) route = "configurator/canvas";
    if (kw.includes("mesh")) route = "configurator/banner";

    return {
        id: "seo-pub-gen-" + index,
        slug: generateSlug(kw) + "-online-ieftin",
        routeSlug: route,
        title: titleCase(kw),
        description: `Servicii profesionale online pentru ${kw}. Garantam cel mai bun raport calitate-pret, materiale premium rezistente la UV si livrare intotdeauna la timp in locatia ta.`,
        image: "/images/generic-banner.jpg",
        price: "De la 25 LEI",
        category: "Campanii SEO",
        tags: [kw, "productie publicitara", "print", "publicitate"],
        metadata: { isSeoCampaign: true }
    };
});
