import { Facebook, Instagram, Mail, Music } from "lucide-react";

export const siteConfig = {
    name: "Tablou",
    domain: "tablou.net",
    url: "https://www.tablou.net",
    description: "Tablou.net - Tablouri Canvas Personalizate din Fotografiile Tale.",
    email: "contact@tablou.net",
    phone: "0750 473 111",
    address: "Jud. Buzău, Sat Topliceni, Com. Topliceni, G Topliceni, nr. 214",
    // --- MENIUL PRINCIPAL (HEADER) ---
    headerNav: [
        {
            href: "/decor",
            label: "Tablouri Canvas",
            // icon: Image,
            children: [
                { href: "/configurator/canvas", label: "Canvas Personalizat" },
                { href: "/configurator/tapet", label: "Fototapet Personalizat" },
            ],
        },
        {
            href: "/publicitar",
            label: "Publicitar",
            // icon: Tag,
            children: [
                { href: "/configurator/banner", label: "Banner" },
                { href: "/configurator/banner-verso", label: "Banner Față Verso" },
                { href: "/configurator/mesh", label: "Mesh publicitar" },
                { href: "/configurator/autocolante", label: "Autocolante" },
                { href: "/configurator/carti-vizita", label: "Cărți de vizită" },
                { href: "/configurator/afise", label: "Afișe" },
                { href: "/configurator/flayere", label: "Flyere" },
                { href: "/configurator/pliante", label: "Pliante" },
                { href: "/configurator/rollup", label: "Rollup" },
                { href: "/configurator/window-graphics", label: "Window Graphics" },
            ],
        },
        {
            href: "/materiale",
            label: "Materiale",
            // icon: LayoutGrid,
            children: [
                { href: "/materiale/carton", label: "Carton" },
                { href: "/materiale/plexiglass", label: "Plexiglas" },
                { href: "/materiale/alucobond", label: "Alucobond" },
                { href: "/materiale/polipropilena", label: "Polipropilenă" },
                { href: "/materiale/pvc-forex", label: "PVC Forex" },
            ],
        },
        {
            href: "#",
            label: "Textile",
            children: [
                { href: "/tricouri", label: "Tricouri" },
                { href: "/hanorace", label: "Hanorace" },
                { href: "/sepci", label: "Șepci" },
            ],
        },

        {
            href: "#",
            label: "Fonduri UE",
            // icon: Star,
            children: [
                { href: "/fonduri-pnrr", label: "Fonduri PNRR" },
                { href: "/fonduri-regio", label: "Fonduri REGIO" },
                { href: "/fonduri-nationale", label: "Fonduri Naționale" },
            ],
        },
        {
            href: "/shop",
            label: "Shop",
            children: [
                { href: "/configuratoare", label: "Configuratoare" },
                { href: "/shop/bannere", label: "Bannere" },
                { href: "/shop/canvas", label: "Tablouri Canvas" },
                { href: "/shop/fonduri-europene", label: "Kituri Fonduri UE" },
            ],
            highlight: true,
        },
    ],
    socialLinks: [
        {
            title: "Facebook",
            href: "https://www.facebook.com/tablou.net/",
            icon: Facebook,
        },
        {
            title: "Instagram",
            href: "https://www.instagram.com/tablou.net",
            icon: Instagram,
        },
        {
            title: "TikTok",
            href: "https://www.tiktok.com/@tablou.net",
            icon: Music,
        },
        {
            title: "Email",
            href: "mailto:contact@tablou.net",
            icon: Mail,
        },
    ],
    business: {
        legalName: "TABLOU DIGITAL SRL",
        tradeName: "Tablou",
        cui: "RO12345678", // Placeholder - are nevoie de CUI real înainte de lansare
        address: {
            fullAddress: "Jud. Buzău, Sat Topliceni, Com. Topliceni, G Topliceni, nr. 214",
            city: "Topliceni",
            county: "Buzău",
            postalCode: "127634",
        },
        contact: {
            email: "contact@tablou.net",
            phone: "0750 473 111",
        },
    },
    shipping: {
        provider: "DPD",
        standardDelivery: {
            service: "Standard",
            price: 24,
            currency: "RON",
        },
    },
    returnPolicy: {
        returnPeriod: "14 zile",
    },
    ogImage: "/logo.png",
};
