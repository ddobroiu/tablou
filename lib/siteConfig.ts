import { Facebook, Instagram, Mail, Music } from "lucide-react";

export const siteConfig = {
    name: "Tablou",
    domain: "tablou.net",
    url: "https://www.tablou.net",
    description: "Tablou.net face tablouri canvas din fotografiile tale: un tablou, colaj, set de 3 sau canvas cu ramă, pentru nuntă, botez, aniversări și cadouri pentru părinți. Șasiu de lemn inclus, poza verificată gratuit, livrare în toată România. În același atelier printăm fototapet, textile, afișe, bannere, panouri rigide și kituri fonduri UE.",
    email: "contact@tablou.net",
    phone: "0750 473 111",
    address: "Jud. Buzău, Sat Topliceni, Com. Topliceni, G Topliceni, nr. 214",
    // --- MENIUL PRINCIPAL (HEADER) ---
    // Grupare pentru brandul Tablou.net: canvasul din poza clientului primul,
    // apoi cadouri/textile, apoi tot catalogul pentru firme. Fiecare href are
    // un folder real sub app/ (sau un redirect din next.config.ts).
    headerNav: [
        {
            href: "/configurator/canvas",
            label: "Tablouri canvas",
            children: [
                { href: "/configurator/canvas", label: "Canvas din poza ta" },
                { href: "/configurator/canvas-colaj-foto", label: "Colaj foto pe canvas" },
                { href: "/configurator/canvas-nunta", label: "Canvas de nuntă" },
                { href: "/configurator/canvas-botez", label: "Canvas de botez" },
                { href: "/configurator/canvas-8-martie", label: "Canvas de 8 Martie" },
                { href: "/configurator/canvas-martisor", label: "Canvas de Mărțișor" },
                { href: "/shop/canvas", label: "Modele gata făcute" },
                { href: "/configurator/tapet", label: "Fototapet din poza ta" },
            ],
        },
        {
            href: "/configurator/tricouri",
            label: "Cadouri & textile",
            children: [
                { href: "/configurator/tricouri", label: "Tricouri personalizate" },
                { href: "/configurator/hanorace", label: "Hanorace personalizate" },
                { href: "/configurator/sepci", label: "Șepci personalizate" },
                { href: "/configurator/autocolante", label: "Autocolante" },
            ],
        },
        {
            href: "/configurator/banner",
            label: "Pentru firme",
            children: [
                { href: "/configurator/banner", label: "Banner PVC" },
                { href: "/configurator/banner-verso", label: "Banner față-verso" },
                { href: "/configurator/mesh", label: "Mesh publicitar" },
                { href: "/configurator/rollup", label: "Roll-up" },
                { href: "/configurator/window-graphics", label: "Window graphics" },
                { href: "/configurator/afise", label: "Afișe" },
                { href: "/configurator/pliante", label: "Pliante" },
                { href: "/configurator/flayere", label: "Flyere" },
                { href: "/configurator/carti-vizita", label: "Cărți de vizită" },
                { href: "/shop/bannere", label: "Bannere gata făcute" },
                { href: "/seap", label: "Achiziții SEAP / SICAP" },
            ],
        },
        {
            href: "/configurator/materiale/pvc-forex",
            label: "Panouri rigide",
            children: [
                { href: "/configurator/materiale/pvc-forex", label: "PVC Forex" },
                { href: "/configurator/materiale/plexiglass", label: "Plexiglas" },
                { href: "/configurator/materiale/alucobond", label: "Alucobond" },
                { href: "/configurator/materiale/carton", label: "Carton plume" },
                { href: "/configurator/materiale/polipropilena", label: "Polipropilenă" },
                { href: "/material", label: "Ghid materiale" },
            ],
        },
        {
            href: "/fonduri-pnrr",
            label: "Fonduri UE",
            children: [
                { href: "/fonduri-pnrr", label: "Fonduri PNRR" },
                { href: "/fonduri-regio", label: "Fonduri REGIO" },
                { href: "/fonduri-nationale", label: "Fonduri Naționale" },
                { href: "/shop/fonduri-europene", label: "Kituri gata făcute" },
            ],
        },
        {
            href: "/configuratoare",
            label: "Preț instant",
            children: [
                { href: "/configuratoare", label: "Toate configuratoarele" },
                { href: "/shop", label: "Catalog complet" },
                { href: "/livrare", label: "Livrare și termene" },
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
