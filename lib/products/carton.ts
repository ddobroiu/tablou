// Carton (Cardboard) products
// This module handles cardboard material products

export const CARTON_PRODUCTS = (() => {
    const items: any[] = [];

    // Cardboard product types
    const types = [
        "Carton pliat personalizat",
        "Carton ondulat",
        "Carton compact",
        "Carton display",
        "Carton cutie",
        "Carton ambalaj",
        "Carton prezentare",
        "Carton expunere",
    ];

    types.forEach((type, index) => {
        const slug = type.toLowerCase()
            .replace(/ă/g, "a").replace(/â/g, "a").replace(/î/g, "i")
            .replace(/ș/g, "s").replace(/ț/g, "t")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

        items.push({
            id: `carton-${index + 1}`,
            slug,
            routeSlug: slug,
            title: type,
            description: `${type} - material rezistent pentru diverse aplicații.`,
            priceBase: 30,
            currency: "RON",
            tags: ["carton", "materiale"],
            metadata: { category: "carton" },
        });
    });

    return items;
})();
