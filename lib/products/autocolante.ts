// Autocolante (Stickers) products
// This module handles sticker products generation

export const AUTOCOLANTE_PRODUCTS = (() => {
    const items: any[] = [];

    // Common sticker types
    const types = [
        "Autocolant personalizat",
        "Autocolant logo firmă",
        "Autocolant geam magazin",
        "Autocolant mașină",
        "Autocolant laptop",
        "Autocolant telefon",
        "Autocolant perete",
        "Autocolant vitrina",
        "Autocolant outdoor",
        "Autocolant indoor",
    ];

    types.forEach((type, index) => {
        const slug = type.toLowerCase()
            .replace(/ă/g, "a").replace(/â/g, "a").replace(/î/g, "i")
            .replace(/ș/g, "s").replace(/ț/g, "t")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

        items.push({
            id: `autocolante-${index + 1}`,
            slug,
            routeSlug: slug,
            title: type,
            description: `${type} - print de calitate pe vinil rezistent.`,
            priceBase: 5,
            currency: "RON",
            tags: ["autocolante", "stickere"],
            metadata: { category: "autocolante" },
        });
    });

    return items;
})();
