export interface EUFundProduct {
    id: string;
    slug: string;
    title: string;
    description: string;
    image: string;
    price: number | string;
    category: string;
    tags: string[];
    program: string; // e.g. "PNRR", "POR"
}

export const euFundsProducts: EUFundProduct[] = [
    {
        id: "eu-pnrr-digitalizare",
        slug: "kit-vizibilitate-pnrr-digitalizare-imm",
        title: "Kit Vizibilitate PNRR - Digitalizare IMM",
        description: "Kit complet pentru proiecte PNRR Digitalizare. Include placă permanentă, autocolante și comunicat de presă conform manualului de identitate vizuală.",
        image: "/products/fonduri/pachet-complet-pnrr-comununicate-de-presa-plus-pachet-print-identitate-vizuala.png",
        price: "De la 250 LEI",
        category: "PNRR",
        tags: ["pnrr", "digitalizare", "kit"],
        program: "PNRR"
    },
    {
        id: "eu-startup-nation",
        slug: "kit-vizibilitate-startup-nation",
        title: "Kit Vizibilitate Start-Up Nation",
        description: "Set complet materiale vizibilitate pentru Start-Up Nation. Placă informativă și autocolante echipamente.",
        image: "/products/fonduri/Placute-start-up-Nation-2022-Craiova.jpg.webp", // Placeholder
        price: "De la 200 LEI",
        category: "Start-Up Nation",
        tags: ["startup", "nation", "antreprenoriat"],
        program: "Start-Up Nation"
    },
    {
        id: "eu-femeia-antreprenor",
        slug: "kit-vizibilitate-femeia-antreprenor",
        title: "Kit Vizibilitate Femeia Antreprenor",
        description: "Materiale obligatorii pentru programul Femeia Antreprenor. Asigură conformitatea și vizibilitatea proiectului.",
        image: "/products/fonduri/pnrr-1.webp", // Placeholder
        price: "De la 200 LEI",
        category: "Femeia Antreprenor",
        tags: ["femeia", "antreprenor", "kit"],
        program: "Femeia Antreprenor"
    },
    {
        id: "eu-por-regional",
        slug: "kit-vizibilitate-por-program-regional",
        title: "Kit Vizibilitate POR (Program Regional)",
        description: "Panouri temporare și plăci permanente pentru proiecte de infrastructură și construcții prin POR.",
        image: "/products/fonduri/regio-1.png", // Placeholder
        price: "De la 350 LEI",
        category: "POR",
        tags: ["por", "regio", "infrastructura"],
        program: "POR"
    },
    {
        id: "eu-pocu-capital-uman",
        slug: "kit-vizibilitate-pocu",
        title: "Kit Vizibilitate POCU / Capital Uman",
        description: "Vizibilitate pentru proiecte de resurse umane și formare profesională.",
        image: "/products/fonduri/pnrr-1.webp", // Placeholder
        price: "De la 150 LEI",
        category: "POCU",
        tags: ["pocu", "training", "hr"],
        program: "POCU"
    },
    {
        id: "eu-microgranturi",
        slug: "kit-vizibilitate-microgranturi",
        title: "Kit Vizibilitate Microgranturi",
        description: "Soluție rapidă și economică pentru beneficiarii de microgranturi. Sticker și afiș A3.",
        image: "/products/fonduri/pnrr-1.webp", // Placeholder
        price: "De la 100 LEI",
        category: "Microgranturi",
        tags: ["microgranturi", "horeca", "imm"],
        program: "Microgranturi"
    },
    {
        id: "eu-popam-agricol",
        slug: "kit-vizibilitate-popam-afires",
        title: "Kit Vizibilitate POPAM / AFIR",
        description: "Panouri și plăci pentru proiecte agricole și dezvoltare rurală (AFIR/POPAM).",
        image: "/products/fonduri/AFIR_PLACUTA_FEADR-2024dr.jpg", // Placeholder
        price: "De la 300 LEI",
        category: "Agricultură",
        tags: ["afir", "popam", "agricultura"],
        program: "POPAM"
    },
    {
        id: "eu-poim-infrastructura",
        slug: "kit-vizibilitate-poim",
        title: "Kit Vizibilitate POIM",
        description: "Panouri de mari dimensiuni pentru proiecte de infrastructură mare (apă, canal, transport).",
        image: "/products/fonduri/AutocolantViziune2020v15.jpg", // Placeholder
        price: "De la 500 LEI",
        category: "POIM",
        tags: ["poim", "mare", "infrastructura"],
        program: "POIM"
    },
    {
        id: "eu-digitalizare-ong",
        slug: "kit-vizibilitate-digitalizare-ong",
        title: "Kit Vizibilitate Digitalizare ONG",
        description: "Pachet special pentru ONG-uri care accesează fonduri de digitalizare.",
        image: "/products/fonduri/pachet-complet-pnrr-comununicate-de-presa-plus-pachet-print-identitate-vizuala.png", // Placeholder
        price: "De la 200 LEI",
        category: "PNRR",
        tags: ["ong", "digitalizare", "pnrr"],
        program: "PNRR"
    },
    {
        id: "eu-acvacultura",
        slug: "kit-vizibilitate-pop-acvacultura",
        title: "Kit Vizibilitate POP (Pescuit)",
        description: "Materiale specifice Programului Operațional pentru Pescuit și Afaceri Maritime.",
        image: "/products/fonduri/pnrr-1.webp",
        price: "De la 250 LEI",
        category: "Agricultură",
        tags: ["pop", "peste", "acvacultura"],
        program: "POP"
    },
    // --- PRODUSE INDIVIDUALE PNRR (sets) ---
    {
        id: "set-autocolant-pnrr-general-mic",
        slug: "set-20-autocolante-pnrr-general",
        title: "Set 20 Autocolante PNRR - General",
        description: "Set 20 bucăți autocolante standard pentru proiecte PNRR. PVC rezistent. Dimensiuni conform manual.",
        image: "/products/fonduri/pnrr-1.webp",
        price: 49,
        category: "PNRR",
        tags: ["pnrr", "autocolante", "set"],
        program: "PNRR"
    },
    {
        id: "set-autocolant-pnrr-general-mare",
        slug: "set-3-autocolante-pnrr-30x30",
        title: "Set 3 Autocolante PNRR - 30x30cm",
        description: "Set 3 bucăți autocolante mari (30x30cm) pentru vizibilitate proiecte PNRR (utilaje, panouri).",
        image: "/products/fonduri/pnrr-1.webp",
        price: 49,
        category: "PNRR",
        tags: ["pnrr", "autocolante", "mare"],
        program: "PNRR"
    },
    {
        id: "set-autocolant-pnrr-digitalizare",
        slug: "set-20-autocolante-pnrr-digitalizare-imm",
        title: "Set 20 Autocolante PNRR - Digitalizare IMM",
        description: "Set 20 autocolante speciale pentru proiectul Digitalizare IMM (Componenta 9). Pentru laptopuri/echipamente IT.",
        image: "/products/fonduri/pnrr-1.webp",
        price: 49,
        category: "PNRR",
        tags: ["pnrr", "digitalizare", "it"],
        program: "PNRR - Digitalizare"
    },
    {
        id: "set-autocolant-pnrr-educatie",
        slug: "set-20-autocolante-pnrr-educatie-scoli",
        title: "Set 20 Autocolante PNRR - Dotări Școli (C15)",
        description: "Set 20 autocolante pentru mobilier și echipamente școlare achiziționate prin PNRR Educație.",
        image: "/products/fonduri/pnrr-1.webp",
        price: 49,
        category: "PNRR",
        tags: ["pnrr", "educatie", "scoli"],
        program: "PNRR - Educație"
    },
    {
        id: "set-autocolant-pnrr-fondul-local",
        slug: "set-3-autocolante-pnrr-fondul-local",
        title: "Set 3 Autocolante PNRR - Fondul Local (C10)",
        description: "Set 3 autocolante mari pentru proiecte de reabilitare/construcție prin Fondul Local.",
        image: "/products/fonduri/pnrr-1.webp",
        price: 49,
        category: "PNRR",
        tags: ["pnrr", "constructii", "local"],
        program: "PNRR - Fondul Local"
    },
    {
        id: "set-autocolant-pnrr-sanatate",
        slug: "set-20-autocolante-pnrr-sanatate",
        title: "Set 20 Autocolante PNRR - Sănătate (C12)",
        description: "Set 20 autocolante pentru echipamente medicale și dotări spitale prin PNRR Sănătate.",
        image: "/products/fonduri/pnrr-1.webp",
        price: 49,
        category: "PNRR",
        tags: ["pnrr", "sanatate", "medical"],
        program: "PNRR - Sănătate"
    },
    // --- PLĂCI PERMANENTE PNRR (image: pnrr-2.webp) ---
    {
        id: "placa-permanenta-pnrr-a2",
        slug: "placa-permanenta-pnrr-a2-42x60",
        title: "Placă Permanentă PNRR - A2 (42x60cm)",
        description: "Placă informativă permanentă pentru proiecte PNRR. Format A2, material rigid rezistent la exterior (Bond/Plexiglas).",
        image: "/products/fonduri/pnrr-2.webp",
        price: 200, // Din pricing.ts
        category: "PNRR",
        tags: ["pnrr", "placa", "permanenta", "a2"],
        program: "PNRR - Plăci"
    },
    {
        id: "placa-permanenta-pnrr-80x50",
        slug: "placa-permanenta-pnrr-80x50",
        title: "Placă Permanentă PNRR - 80x50cm",
        description: "Placă informativă standard pentru proiecte PNRR. Dimensiune 80x50cm, obligatorie pentru majoritatea proiectelor de investiții.",
        image: "/products/fonduri/pnrr-2.webp",
        price: 290, // Din pricing.ts
        category: "PNRR",
        tags: ["pnrr", "placa", "permanenta", "standard"],
        program: "PNRR - Plăci"
    },
    {
        id: "placa-permanenta-pnrr-150x100",
        slug: "placa-permanenta-pnrr-150x100",
        title: "Placă Permanentă PNRR - 150x100cm",
        description: "Placă informativă de mari dimensiuni pentru proiecte PNRR de infrastructură majoră. 150x100cm.",
        image: "/products/fonduri/pnrr-2.webp",
        price: 550, // Din pricing.ts
        category: "PNRR",
        tags: ["pnrr", "placa", "permanenta", "mare"],
        program: "PNRR - Plăci"
    },
    // --- AUTOCOLANTE PNRR MODEL 2 (image: pnrr-4.jpg) ---
    {
        id: "set-autocolant-pnrr-model2-mic",
        slug: "set-20-autocolante-pnrr-model-2",
        title: "Set 20 Autocolante PNRR (Model 2)",
        description: "Set 20 bucăți autocolante PNRR - varianta grafică alternativă. PVC rezistent, print UV.",
        image: "/products/fonduri/pnrr-4.jpg",
        price: 49,
        category: "PNRR",
        tags: ["pnrr", "autocolante", "model2"],
        program: "PNRR"
    },
    {
        id: "set-autocolant-pnrr-model2-mare",
        slug: "set-3-autocolante-pnrr-30x30-model-2",
        title: "Set 3 Autocolante PNRR 30x30cm (Model 2)",
        description: "Set 3 bucăți autocolante mari 30x30cm PNRR - varianta grafică alternativă.",
        image: "/products/fonduri/pnrr-4.jpg",
        price: 49,
        category: "PNRR",
        tags: ["pnrr", "autocolante", "mare", "model2"],
        program: "PNRR"
    },
    // --- AUTOCOLANTE REGIO (image: regio-1.png) ---
    {
        id: "set-autocolant-regio-mic",
        slug: "set-20-autocolante-regio-program-regional",
        title: "Set 20 Autocolante REGIO (Program Regional)",
        description: "Set 20 bucăți autocolante pentru proiecte finanțate prin Programul Regional (REGIO). PVC rezistent.",
        image: "/products/fonduri/regio-1.png",
        price: 49,
        category: "REGIO",
        tags: ["regio", "autocolante", "set", "regional"],
        program: "REGIO"
    },
    {
        id: "set-autocolant-regio-mare",
        slug: "set-3-autocolante-regio-30x30",
        title: "Set 3 Autocolante REGIO 30x30cm",
        description: "Set 3 bucăți autocolante mari 30x30cm pentru proiecte REGIO.",
        image: "/products/fonduri/regio-1.png",
        price: 49,
        category: "REGIO",
        tags: ["regio", "autocolante", "mare", "regional"],
        program: "REGIO"
    },
    // --- AFIȘE REGIO (image: afis-a-3-regio-nord-est.jpg) ---
    {
        id: "afis-regio-a3",
        slug: "afis-a3-program-regional-regio",
        title: "Afiș A3 Program Regional (REGIO)",
        description: "Afiș informativ format A3 pentru proiecte regionale (REGIO). Hârtie 200g, print color.",
        image: "/products/fonduri/afis-a-3-regio-nord-est.jpg",
        price: 49,
        category: "REGIO",
        tags: ["regio", "afis", "a3", "regional"],
        program: "REGIO"
    },
    {
        id: "afis-regio-nord-est",
        slug: "afis-a3-regio-nord-est",
        title: "Afiș A3 REGIO - Nord-Est",
        description: "Afiș A3 pentru proiecte desfășurate în regiunea Nord-Est.",
        image: "/products/fonduri/afis-a-3-regio-nord-est.jpg",
        price: 49,
        category: "REGIO",
        tags: ["regio", "nord-est", "afis"],
        program: "REGIO - Nord-Est"
    },
    {
        id: "afis-regio-sud",
        slug: "afis-a3-regio-sud-muntenia",
        title: "Afiș A3 REGIO - Sud Muntenia",
        description: "Afiș A3 pentru proiecte desfășurate în regiunea Sud Muntenia.",
        image: "/products/fonduri/afis-a-3-regio-nord-est.jpg",
        price: 49,
        category: "REGIO",
        tags: ["regio", "sud", "afis"],
        program: "REGIO - Sud"
    },
    {
        id: "afis-regio-centru",
        slug: "afis-a3-regio-centru",
        title: "Afiș A3 REGIO - Centru",
        description: "Afiș A3 pentru proiecte desfășurate în regiunea Centru.",
        image: "/products/fonduri/afis-a-3-regio-nord-est.jpg",
        price: 49,
        category: "REGIO",
        tags: ["regio", "centru", "afis"],
        program: "REGIO - Centru"
    },
    {
        id: "afis-regio-vest",
        slug: "afis-a3-regio-vest",
        title: "Afiș A3 REGIO - Vest",
        description: "Afiș A3 pentru proiecte desfășurate în regiunea Vest.",
        image: "/products/fonduri/afis-a-3-regio-nord-est.jpg",
        price: 49,
        category: "REGIO",
        tags: ["regio", "vest", "afis"],
        program: "REGIO - Vest"
    },
    // --- AFIȘ PROGRAM SĂNĂTATE (image: Afis-A3-caps_452x640-program-sanatate.jpg) ---
    {
        id: "afis-program-sanatate-a3",
        slug: "afis-a3-program-sanatate",
        title: "Afiș A3 - Program Sănătate",
        description: "Afiș informativ format A3 pentru proiecte din Programul Sănătate. Hârtie 200g, print color.",
        image: "/products/fonduri/Afis-A3-caps_452x640-program-sanatate.jpg",
        price: 49,
        category: "Sănătate",
        tags: ["sanatate", "afis", "a3", "medical"],
        program: "Program Sănătate"
    },
    // --- PLĂCI AFIR (image: AFIR_PLACUTA_FEADR-2024dr.jpg) ---
    {
        id: "placa-afir-general",
        slug: "placa-afisare-proiect-afir-feadr-50x70",
        title: "Placă AFIR / FEADR - 50x70cm (General)",
        description: "Placă informativă standard pentru proiecte finanțate prin AFIR (FEADR). Dimensiune 50x70cm, material rigid exterior.",
        image: "/products/fonduri/AFIR_PLACUTA_FEADR-2024dr.jpg",
        price: 290,
        category: "Agricultură",
        tags: ["afir", "feadr", "placa", "agricultura"],
        program: "AFIR"
    },
    {
        id: "placa-afir-tanarul-fermier",
        slug: "placa-afir-tanarul-fermier-50x70",
        title: "Placă AFIR - Tânărul Fermier (50x70cm)",
        description: "Placă informativă obligatorie pentru proiectul 'Tânărul Fermier' (Instalarea tinerilor fermieri).",
        image: "/products/fonduri/AFIR_PLACUTA_FEADR-2024dr.jpg",
        price: 290,
        category: "Agricultură",
        tags: ["afir", "tanarul", "fermier", "agricultura"],
        program: "AFIR - Tânărul Fermier"
    },
    {
        id: "placa-afir-micul-fermier",
        slug: "placa-afir-micul-fermier-50x70",
        title: "Placă AFIR - Micul Fermier (50x70cm)",
        description: "Placă informativă pentru proiectul 'Micul Fermier' (Dezvoltarea fermelor mici).",
        image: "/products/fonduri/AFIR_PLACUTA_FEADR-2024dr.jpg",
        price: 290,
        category: "Agricultură",
        tags: ["afir", "micul", "fermier", "agricultura"],
        program: "AFIR - Micul Fermier"
    },
    {
        id: "placa-afir-modernizare",
        slug: "placa-afir-modernizare-exploatatii-50x70",
        title: "Placă AFIR - Modernizare Exploatații (50x70cm)",
        description: "Placă informativă pentru proiecte de modernizare exploatații agricole și pomicole.",
        image: "/products/fonduri/AFIR_PLACUTA_FEADR-2024dr.jpg",
        price: 290,
        category: "Agricultură",
        tags: ["afir", "modernizare", "exploatatii", "agricultura"],
        program: "AFIR - Modernizare"
    },
    {
        id: "set-autocolant-afir-15x21",
        slug: "set-5-autocolante-afir-15x21",
        title: "Set 5 Autocolante AFIR - 15x21cm",
        description: "Set 5 bucăți autocolante AFIR, dimensiune 15x21cm. PVC rezistent exterior.",
        image: "/products/fonduri/AFIR_PLACUTA_FEADR-2024dr.jpg",
        price: 49,
        category: "Agricultură",
        tags: ["afir", "autocolante", "set", "agricultura"],
        program: "AFIR"
    },
    // --- AFIȘE AFIR (image: afis-afir-dr-leader.jpg) ---
    {
        id: "afis-afir-general",
        slug: "afis-a3-afir-feadr-dr",
        title: "Afiș A3 AFIR / FEADR - General",
        description: "Afiș informativ format A3 pentru proiecte AFIR (FEADR).",
        image: "/products/fonduri/afis-afir-dr-leader.jpg",
        price: 49,
        category: "Agricultură",
        tags: ["afir", "afis", "a3", "agricultura"],
        program: "AFIR"
    },
    {
        id: "afis-afir-leader",
        slug: "afis-a3-afir-leader-gal",
        title: "Afiș A3 AFIR - LEADER / GAL",
        description: "Afiș informativ A3 pentru proiecte finanțate prin axa LEADER (GAL).",
        image: "/products/fonduri/afis-afir-dr-leader.jpg",
        price: 49,
        category: "Agricultură",
        tags: ["afir", "leader", "gal", "afis"],
        program: "AFIR - LEADER"
    },
    // --- AUTOCOLANTE PROGRAM SĂNĂTATE (image: autocolante-nord-est.png) ---
    {
        id: "set-autocolant-sanatate-mic",
        slug: "set-20-autocolante-program-sanatate",
        title: "Set 20 Autocolante Program Sănătate",
        description: "Set 20 bucăți autocolante pentru proiecte din Programul Sănătate. PVC rezistent.",
        image: "/products/fonduri/autocolante-nord-est.png",
        price: 49,
        category: "Sănătate",
        tags: ["sanatate", "autocolante", "set", "medical"],
        program: "Program Sănătate"
    },
    {
        id: "set-autocolant-sanatate-mare",
        slug: "set-3-autocolante-program-sanatate-30x30",
        title: "Set 3 Autocolante Program Sănătate 30x30cm",
        description: "Set 3 bucăți autocolante mari 30x30cm pentru proiecte Program Sănătate.",
        image: "/products/fonduri/autocolante-nord-est.png",
        price: 49,
        category: "Sănătate",
        tags: ["sanatate", "autocolante", "mare", "medical"],
        program: "Program Sănătate"
    },
    // --- AUTOCOLANTE SITUAȚII DE URGENȚĂ (image: AutocolantViziune2020v15.jpg) ---
    {
        id: "set-autocolant-isu-mic",
        slug: "set-20-autocolante-situatii-urgenta-viziune-2020",
        title: "Set 20 Autocolante Situații de Urgență (Viziune 2020)",
        description: "Set 20 bucăți autocolante pentru proiecte IGSU / DSU (Viziune 2020).",
        image: "/products/fonduri/AutocolantViziune2020v15.jpg",
        price: 49,
        category: "Situații de Urgență",
        tags: ["isu", "dsu", "viziune2020", "autocolante"],
        program: "POIM - Viziune 2020"
    },
    {
        id: "set-autocolant-isu-mare",
        slug: "set-3-autocolante-situatii-urgenta-30x30",
        title: "Set 3 Autocolante Situații de Urgență 30x30cm",
        description: "Set 3 bucăți autocolante mari pentru echipamente situații de urgență.",
        image: "/products/fonduri/AutocolantViziune2020v15.jpg",
        price: 49,
        category: "Situații de Urgență",
        tags: ["isu", "dsu", "mare", "autocolante"],
        program: "POIM - Viziune 2020"
    },
    // --- PACHETE COMPLETE PNRR (image: pachet-complet-pnrr-comununicate-de-presa-plus-pachet-print-identitate-vizuala.png) ---
    {
        id: "pachet-complet-pnrr-identitate",
        slug: "pachet-complet-pnrr-comunicat-print-vizibilitate",
        title: "Pachet Complet PNRR - Identitate Vizuală + Print",
        description: "Soluție completă pentru proiecte PNRR: comunicat de presă (start/final) + set materiale printate (placă permanentă, autocolante, afișe). Asigură conformitatea 100%.",
        image: "/products/fonduri/pachet-complet-pnrr-comununicate-de-presa-plus-pachet-print-identitate-vizuala.png",
        price: "De la 490 LEI",
        category: "PNRR",
        tags: ["pnrr", "pachet", "complet", "comunicat"],
        program: "PNRR - Pachet Complet"
    },
    // --- PACHET PAT (image: PACHET-PAT-–-Programul-Asistenta-Tehnica-pachet-complet-identitate-vizuala.png) ---
    {
        id: "pachet-pat-asistenta-tehnica",
        slug: "pachet-pat-programul-asistenta-tehnica-identitate",
        title: "Pachet PAT - Programul Asistență Tehnică",
        description: "Kit complet identitate vizuală pentru Programul Asistență Tehnică (PAT). Include materiale obligatorii de vizibilitate și publicitate.",
        image: "/products/fonduri/PACHET-PAT-–-Programul-Asistenta-Tehnica-pachet-complet-identitate-vizuala.png",
        price: "De la 450 LEI",
        category: "Asistență Tehnică",
        tags: ["pat", "asistenta", "tehnica", "pachet"],
        program: "PAT - Asistență Tehnică"
    },
    // --- PACHET PEO (image: PACHET-PEO-–-Programul-Educatie-si-Ocupare-pachet-identitate-vizauala.png) ---
    {
        id: "pachet-peo-educatie-ocupare",
        slug: "pachet-peo-programul-educatie-si-ocupare",
        title: "Pachet PEO - Programul Educație și Ocupare",
        description: "Kit complet identitate vizuală pentru Programul Educație și Ocupare (PEO). Asigură vizibilitatea proiectelor de formare și ocupare.",
        image: "/products/fonduri/PACHET-PEO-–-Programul-Educatie-si-Ocupare-pachet-identitate-vizauala.png",
        price: "De la 450 LEI",
        category: "Educație & Ocupare",
        tags: ["peo", "educatie", "ocupare", "pachet"],
        program: "PEO"
    },
    // --- PACHET PDD (image: PDD-–-Programul-Dezvoltare-Durabila-pachet-identitate-vizuala-1.png) ---
    {
        id: "pachet-pdd-dezvoltare-durabila",
        slug: "pachet-pdd-programul-dezvoltare-durabila",
        title: "Pachet PDD - Programul Dezvoltare Durabilă",
        description: "Kit complet materiale vizibilitate pentru Programul Dezvoltare Durabilă (PDD).",
        image: "/products/fonduri/PDD-–-Programul-Dezvoltare-Durabila-pachet-identitate-vizuala-1.png",
        price: "De la 450 LEI",
        category: "Dezvoltare Durabilă",
        tags: ["pdd", "dezvoltare", "durabila", "pachet"],
        program: "PDD"
    },
    // --- PACHET PIDS (image: PIDS-–-Programul-Incluziune-si-Demnitate-Sociala-identirtate-vizuala-comunicate-si-print.png) ---
    {
        id: "pachet-pids-incluziune-sociala",
        slug: "pachet-pids-programul-incluziune-si-demnitate-sociala",
        title: "Pachet PIDS - Programul Incluziune și Demnitate Socială",
        description: "Kit complet materiale vizibilitate pentru Programul Incluziune și Demnitate Socială (PIDS).",
        image: "/products/fonduri/PIDS-–-Programul-Incluziune-si-Demnitate-Sociala-identirtate-vizuala-comunicate-si-print.png",
        price: "De la 450 LEI",
        category: "Incluziune Socială",
        tags: ["pids", "incluziune", "sociala", "pachet"],
        program: "PIDS"
    },
    // --- PLĂCI PNRR INFRASTRUCTURĂ (image: placa-permanenta-infrastructura-rutiera-pnrr-1-scaled.jpg) ---
    {
        id: "placa-permanenta-pnrr-infrastructura-rutiera",
        slug: "placa-permanenta-pnrr-infrastructura-rutiera",
        title: "Placă Permanentă PNRR - Infrastructură Rutieră",
        description: "Placă permanentă de mari dimensiuni pentru proiecte de infrastructură rutieră finanțate prin PNRR.",
        image: "/products/fonduri/placa-permanenta-infrastructura-rutiera-pnrr-1-scaled.jpg",
        price: 550, // Mare dimensiune typically
        category: "PNRR",
        tags: ["pnrr", "placa", "permanenta", "infrastructura", "rutiera"],
        program: "PNRR - Infrastructură"
    },
    // --- PACHET PCIDIF (image: Programul-Crestere-Inteligenta-Digitalizare-si-Instrumente-Financiare-program-identitate-vizuala.png) ---
    {
        id: "pachet-pcidif-crestere-inteligenta",
        slug: "pachet-pcidif-programul-crestere-inteligenta-digitalizare",
        title: "Pachet PCIDIF - Creștere Inteligentă și Digitalizare",
        description: "Kit complet materiale vizibilitate pentru Programul Creștere Inteligentă, Digitalizare și Instrumente Financiare (PCIDIF).",
        image: "/products/fonduri/Programul-Crestere-Inteligenta-Digitalizare-si-Instrumente-Financiare-program-identitate-vizuala.png",
        price: "De la 450 LEI",
        category: "Digitalizare & Creștere",
        tags: ["pcidif", "digitalizare", "crestere", "inteligenta", "pachet"],
        program: "PCIDIF"
    },
    // --- PACHET PT (image: PT-–-Programul-Transport-pachet-identitate-vizuala-print.png) ---
    {
        id: "pachet-pt-transport",
        slug: "pachet-pt-programul-transport-identitate",
        title: "Pachet PT - Programul Transport",
        description: "Kit complet identitate vizuală pentru Programul Transport (PT). Asigură vizibilitatea proiectelor de infrastructură de transport.",
        image: "/products/fonduri/PT-–-Programul-Transport-pachet-identitate-vizuala-print.png",
        price: "De la 450 LEI",
        category: "Transport",
        tags: ["pt", "programul", "transport", "pachet", "infrastructura"],
        program: "PT - Transport"
    },
    // --- PRODUSE NOI (Extindere Catalog) ---
    // PEO
    {
        id: "set-autocolant-peo-mic",
        slug: "set-20-autocolante-peo-educatie-ocupare",
        title: "Set 20 Autocolante PEO - Educație și Ocupare",
        description: "Set 20 autocolante pentru proiecte PEO. Grafică conformă manualului de identitate vizuală.",
        image: "/products/fonduri/PACHET-PEO-–-Programul-Educatie-si-Ocupare-pachet-identitate-vizauala.png",
        price: 49,
        category: "Educație & Ocupare",
        tags: ["peo", "autocolante", "set"],
        program: "PEO"
    },
    {
        id: "placa-permanenta-peo",
        slug: "placa-permanenta-peo-50x70",
        title: "Placă Permanentă PEO - 50x70cm",
        description: "Placă informativă permanentă pentru proiecte PEO. Dimensiune 50x70cm, material rigid.",
        image: "/products/fonduri/PACHET-PEO-–-Programul-Educatie-si-Ocupare-pachet-identitate-vizauala.png",
        price: 290,
        category: "Educație & Ocupare",
        tags: ["peo", "placa", "permanenta"],
        program: "PEO"
    },
    // PIDS
    {
        id: "set-autocolant-pids-mic",
        slug: "set-20-autocolante-pids-incluziune",
        title: "Set 20 Autocolante PIDS - Incluziune Socială",
        description: "Set 20 autocolante pentru proiecte PIDS. Grafică conformă manualului de identitate vizuală.",
        image: "/products/fonduri/PIDS-–-Programul-Incluziune-si-Demnitate-Sociala-identirtate-vizuala-comunicate-si-print.png",
        price: 49,
        category: "Incluziune Socială",
        tags: ["pids", "autocolante", "set"],
        program: "PIDS"
    },
    {
        id: "placa-permanenta-pids",
        slug: "placa-permanenta-pids-50x70",
        title: "Placă Permanentă PIDS - 50x70cm",
        description: "Placă informativă permanentă pentru proiecte PIDS. Dimensiune 50x70cm, material rigid.",
        image: "/products/fonduri/PIDS-–-Programul-Incluziune-si-Demnitate-Sociala-identirtate-vizuala-comunicate-si-print.png",
        price: 290,
        category: "Incluziune Socială",
        tags: ["pids", "placa", "permanenta"],
        program: "PIDS"
    },
    // PT (Transport)
    {
        id: "set-autocolant-pt-mic",
        slug: "set-20-autocolante-pt-transport",
        title: "Set 20 Autocolante Programul Transport",
        description: "Set 20 autocolante pentru proiecte PT. Grafică conformă manualului de identitate vizuală.",
        image: "/products/fonduri/PT-–-Programul-Transport-pachet-identitate-vizuala-print.png",
        price: 49,
        category: "Transport",
        tags: ["pt", "autocolante", "set"],
        program: "PT - Transport"
    },
    {
        id: "placa-permanenta-pt",
        slug: "placa-permanenta-pt-150x100",
        title: "Placă Permanentă PT - 150x100cm",
        description: "Panou informativ permanent mare (150x100cm) pentru proiecte de infrastructură Programul Transport.",
        image: "/products/fonduri/PT-–-Programul-Transport-pachet-identitate-vizuala-print.png",
        price: 550,
        category: "Transport",
        tags: ["pt", "placa", "permanenta", "mare"],
        program: "PT - Transport"
    },
    // PDD (Dezvoltare Durabila)
    {
        id: "set-autocolant-pdd-mic",
        slug: "set-20-autocolante-pdd-dezvoltare-durabila",
        title: "Set 20 Autocolante PDD - Dezvoltare Durabilă",
        description: "Set 20 autocolante pentru proiecte PDD. Grafică conformă manualului.",
        image: "/products/fonduri/PDD-–-Programul-Dezvoltare-Durabila-pachet-identitate-vizuala-1.png",
        price: 49,
        category: "Dezvoltare Durabilă",
        tags: ["pdd", "autocolante", "set"],
        program: "PDD"
    },
    {
        id: "placa-permanenta-pdd",
        slug: "placa-permanenta-pdd-80x50",
        title: "Placă Permanentă PDD - 80x50cm",
        description: "Placă informativă permanentă PDD. Dimensiune 80x50cm, material rigid.",
        image: "/products/fonduri/PDD-–-Programul-Dezvoltare-Durabila-pachet-identitate-vizuala-1.png",
        price: 290,
        category: "Dezvoltare Durabilă",
        tags: ["pdd", "placa", "permanenta"],
        program: "PDD"
    },
    // PCIDIF
    {
        id: "set-autocolant-pcidif-mic",
        slug: "set-20-autocolante-pcidif",
        title: "Set 20 Autocolante PCIDIF",
        description: "Set 20 autocolante pentru proiecte PCIDIF (Digitalizare/Cercetare).",
        image: "/products/fonduri/Programul-Crestere-Inteligenta-Digitalizare-si-Instrumente-Financiare-program-identitate-vizuala.png",
        price: 49,
        category: "Digitalizare & Creștere",
        tags: ["pcidif", "autocolante", "set"],
        program: "PCIDIF"
    },
    {
        id: "placa-permanenta-pcidif",
        slug: "placa-permanenta-pcidif-a2",
        title: "Placă Permanentă PCIDIF - A2",
        description: "Placă informativă permanentă PCIDIF. Format A2 (42x60cm).",
        image: "/products/fonduri/Programul-Crestere-Inteligenta-Digitalizare-si-Instrumente-Financiare-program-identitate-vizuala.png",
        price: 200,
        category: "Digitalizare & Creștere",
        tags: ["pcidif", "placa", "permanenta", "a2"],
        program: "PCIDIF"
    },
    // Program Sanatate - Placa
    {
        id: "placa-permanenta-sanatate",
        slug: "placa-permanenta-program-sanatate-80x50",
        title: "Placă Permanentă Program Sănătate - 80x50cm",
        description: "Placă informativă pentru proiecte din domeniul sănătății. 80x50cm.",
        image: "/products/fonduri/autocolante-nord-est.png",
        price: 290,
        category: "Sănătate",
        tags: ["sanatate", "placa", "permanenta"],
        program: "Program Sănătate"
    },
    // REGIO - Placa
    {
        id: "placa-permanenta-regio",
        slug: "placa-permanenta-regio-80x50",
        title: "Placă Permanentă REGIO - 80x50cm",
        description: "Placă informativă standard pentru Programul Regional (REGIO).",
        image: "/products/fonduri/regio-1.png",
        price: 290,
        category: "REGIO",
        tags: ["regio", "placa", "permanenta"],
        program: "REGIO"
    },
    // --- PROGRAME REGIONALE 2021-2027 (PR) ---
    {
        id: "kit-pr-nord-est",
        slug: "kit-vizibilitate-pr-nord-est-2021-2027",
        title: "Kit Vizibilitate PR Nord-Est 2021-2027",
        description: "Kit complet pentru proiecte finanțate prin Programul Regional Nord-Est 2021-2027. Panouri, plăci, autocolante.",
        image: "/products/fonduri/regio-1.png",
        price: "De la 250 LEI",
        category: "Programe Regionale",
        tags: ["pr", "nord-est", "regional", "2021-2027", "kit"],
        program: "PR Nord-Est"
    },
    {
        id: "kit-pr-sud-est",
        slug: "kit-vizibilitate-pr-sud-est-2021-2027",
        title: "Kit Vizibilitate PR Sud-Est 2021-2027",
        description: "Kit complet pentru proiecte finanțate prin Programul Regional Sud-Est 2021-2027.",
        image: "/products/fonduri/regio-1.png",
        price: "De la 250 LEI",
        category: "Programe Regionale",
        tags: ["pr", "sud-est", "regional", "2021-2027", "kit"],
        program: "PR Sud-Est"
    },
    {
        id: "kit-pr-sud-muntenia",
        slug: "kit-vizibilitate-pr-sud-muntenia-2021-2027",
        title: "Kit Vizibilitate PR Sud-Muntenia 2021-2027",
        description: "Kit complet pentru proiecte finanțate prin Programul Regional Sud-Muntenia 2021-2027.",
        image: "/products/fonduri/regio-1.png",
        price: "De la 250 LEI",
        category: "Programe Regionale",
        tags: ["pr", "sud-muntenia", "regional", "2021-2027", "kit"],
        program: "PR Sud-Muntenia"
    },
    {
        id: "kit-pr-sud-vest-oltenia",
        slug: "kit-vizibilitate-pr-sud-vest-oltenia-2021-2027",
        title: "Kit Vizibilitate PR Sud-Vest Oltenia 2021-2027",
        description: "Kit complet pentru proiecte finanțate prin Programul Regional Sud-Vest Oltenia 2021-2027.",
        image: "/products/fonduri/regio-1.png",
        price: "De la 250 LEI",
        category: "Programe Regionale",
        tags: ["pr", "sud-vest", "oltenia", "regional", "2021-2027", "kit"],
        program: "PR Sud-Vest Oltenia"
    },
    {
        id: "kit-pr-vest",
        slug: "kit-vizibilitate-pr-vest-2021-2027",
        title: "Kit Vizibilitate PR Vest 2021-2027",
        description: "Kit complet pentru proiecte finanțate prin Programul Regional Vest 2021-2027.",
        image: "/products/fonduri/regio-1.png",
        price: "De la 250 LEI",
        category: "Programe Regionale",
        tags: ["pr", "vest", "regional", "2021-2027", "kit"],
        program: "PR Vest"
    },
    {
        id: "kit-pr-nord-vest",
        slug: "kit-vizibilitate-pr-nord-vest-2021-2027",
        title: "Kit Vizibilitate PR Nord-Vest 2021-2027",
        description: "Kit complet pentru proiecte finanțate prin Programul Regional Nord-Vest 2021-2027.",
        image: "/products/fonduri/regio-1.png",
        price: "De la 250 LEI",
        category: "Programe Regionale",
        tags: ["pr", "nord-vest", "regional", "2021-2027", "kit"],
        program: "PR Nord-Vest"
    },
    {
        id: "kit-pr-centru",
        slug: "kit-vizibilitate-pr-centru-2021-2027",
        title: "Kit Vizibilitate PR Centru 2021-2027",
        description: "Kit complet pentru proiecte finanțate prin Programul Regional Centru 2021-2027.",
        image: "/products/fonduri/regio-1.png",
        price: "De la 250 LEI",
        category: "Programe Regionale",
        tags: ["pr", "centru", "regional", "2021-2027", "kit"],
        program: "PR Centru"
    },
    {
        id: "kit-pr-bucuresti-ilfov",
        slug: "kit-vizibilitate-pr-bucuresti-ilfov-2021-2027",
        title: "Kit Vizibilitate PR București-Ilfov 2021-2027",
        description: "Kit complet pentru proiecte finanțate prin Programul Regional București-Ilfov 2021-2027.",
        image: "/products/fonduri/regio-1.png",
        price: "De la 250 LEI",
        category: "Programe Regionale",
        tags: ["pr", "bucuresti", "ilfov", "regional", "2021-2027", "kit"],
        program: "PR București-Ilfov"
    },

    // --- INTERVENȚII AFIR / PNDR ---
    {
        id: "kit-afir-dr-30",
        slug: "kit-vizibilitate-afir-dr-30-tanarul-fermier",
        title: "Kit Vizibilitate AFIR - DR-30 Tânărul Fermier",
        description: "Kit complet (Placă + Autocolante) pentru intervenția DR-30 Instalarea Tinerilor Fermieri.",
        image: "/products/fonduri/AFIR_PLACUTA_FEADR-2024dr.jpg",
        price: "De la 290 LEI",
        category: "Agricultură",
        tags: ["afir", "dr30", "tanarul", "fermier", "kit"],
        program: "AFIR - DR-30"
    },
    {
        id: "kit-afir-dr-22",
        slug: "kit-vizibilitate-afir-dr-22-investitii",
        title: "Kit Vizibilitate AFIR - DR-22 Investiții",
        description: "Kit complet pentru intervenția DR-22 Investiții în exploatații agricole și pomicole.",
        image: "/products/fonduri/AFIR_PLACUTA_FEADR-2024dr.jpg",
        price: "De la 290 LEI",
        category: "Agricultură",
        tags: ["afir", "dr22", "investitii", "agricole", "kit"],
        program: "AFIR - DR-22"
    },
    {
        id: "kit-afir-dr-27",
        slug: "kit-vizibilitate-afir-dr-27-infrastructura",
        title: "Kit Vizibilitate AFIR - DR-27 Infrastructură",
        description: "Kit complet pentru intervenția DR-27 Infrastructură de acces agricolă și silvică.",
        image: "/products/fonduri/AFIR_PLACUTA_FEADR-2024dr.jpg",
        price: "De la 450 LEI",
        category: "Agricultură",
        tags: ["afir", "dr27", "infrastructura", "rurala", "kit"],
        program: "AFIR - DR-27"
    },

    // --- PROIECTE SPECIALE / ADR / MIPE ---
    {
        id: "kit-mipe-digitalizare",
        slug: "kit-vizibilitate-mipe-digitalizare-imm-ajutor-stat",
        title: "Kit MIPE - Digitalizare IMM (Ajutor de Stat)",
        description: "Materiale vizibilitate pentru Ajutorul de stat pentru digitalizarea IMM-urilor (MIPE).",
        image: "/products/fonduri/pachet-complet-pnrr-comununicate-de-presa-plus-pachet-print-identitate-vizuala.png",
        price: "De la 200 LEI",
        category: "Digitalizare",
        tags: ["mipe", "digitalizare", "imm", "ajutor", "stat", "kit"],
        program: "MIPE - Digitalizare"
    },
    {
        id: "kit-adr-digitalizare-admin",
        slug: "kit-vizibilitate-adr-digitalizare-administratie",
        title: "Kit ADR - Digitalizarea Administrației Publice",
        description: "Kit vizibilitate pentru proiecte de digitalizare a administrației publice locale (ADR).",
        image: "/products/fonduri/pachet-complet-pnrr-comununicate-de-presa-plus-pachet-print-identitate-vizuala.png",
        price: "De la 250 LEI",
        category: "Digitalizare",
        tags: ["adr", "digitalizare", "administratie", "publica", "kit"],
        program: "ADR - Digitalizare"
    },
    {
        id: "kit-adr-smart-city",
        slug: "kit-vizibilitate-adr-smart-city",
        title: "Kit Vizibilitate ADR - Smart City",
        description: "Materiale de vizibilitate și promovare pentru proiecte de tip Smart City finanțate prin ADR.",
        image: "/products/fonduri/pachet-complet-pnrr-comununicate-de-presa-plus-pachet-print-identitate-vizuala.png",
        price: "De la 250 LEI",
        category: "Smart City",
        tags: ["adr", "smart", "city", "kit"],
        program: "ADR - Smart City"
    },
    {
        id: "kit-adr-dezvoltare-imm",
        slug: "kit-vizibilitate-adr-dezvoltare-imm",
        title: "Kit ADR - Dezvoltarea IMM-urilor",
        description: "Kit vizibilitate pentru proiecte de dezvoltare a IMM-urilor gestionate de ADR.",
        image: "/products/fonduri/pachet-complet-pnrr-comununicate-de-presa-plus-pachet-print-identitate-vizuala.png",
        price: "De la 200 LEI",
        category: "Dezvoltare IMM",
        tags: ["adr", "dezvoltare", "imm", "kit"],
        program: "ADR - IMM"
    },
    {
        id: "placa-permanenta-pot",
        slug: "placa-permanenta-pot",
        title: "Placă Permanentă Programul Operațional Transport (POT)",
        description: "Placă informativă permanentă pentru proiecte Programul Operațional Transport (POT). Material rigid, rezistent la exterior.",
        image: "/products/fonduri/PT-–-Programul-Transport-pachet-identitate-vizuala-print.png",
        price: 290,
        category: "Transport",
        tags: ["pot", "placa", "permanenta", "eu"],
        program: "Programul Operațional Transport (POT)"
    },
    {
        id: "autocolante-pot",
        slug: "set-autocolante-pot",
        title: "Set Autocolante Programul Operațional Transport (POT)",
        description: "Set autocolante obligatorii pentru echipamente/utilaje achiziționate prin Programul Operațional Transport (POT).",
        image: "/products/fonduri/PT-–-Programul-Transport-pachet-identitate-vizuala-print.png",
        price: 49,
        category: "Transport",
        tags: ["pot", "autocolante", "set", "eu"],
        program: "Programul Operațional Transport (POT)"
    },
    {
        id: "afis-pot",
        slug: "afis-a3-pot",
        title: "Afiș A3 Programul Operațional Transport (POT)",
        description: "Afiș informativ A3 pentru proiecte Programul Operațional Transport (POT). Hârtie 200g, print color.",
        image: "/products/fonduri/PT-–-Programul-Transport-pachet-identitate-vizuala-print.png",
        price: 49,
        category: "Transport",
        tags: ["pot", "afis", "a3", "eu"],
        program: "Programul Operațional Transport (POT)"
    },
    {
        id: "placa-permanenta-poat",
        slug: "placa-permanenta-poat",
        title: "Placă Permanentă Programul Asistență Tehnică (POAT)",
        description: "Placă informativă permanentă pentru proiecte Programul Asistență Tehnică (POAT). Material rigid, rezistent la exterior.",
        image: "/products/fonduri/PACHET-PAT-–-Programul-Asistenta-Tehnica-pachet-complet-identitate-vizuala.png",
        price: 290,
        category: "Asistență Tehnică",
        tags: ["poat", "placa", "permanenta", "eu"],
        program: "Programul Asistență Tehnică (POAT)"
    },
    {
        id: "autocolante-poat",
        slug: "set-autocolante-poat",
        title: "Set Autocolante Programul Asistență Tehnică (POAT)",
        description: "Set autocolante obligatorii pentru echipamente/utilaje achiziționate prin Programul Asistență Tehnică (POAT).",
        image: "/products/fonduri/PACHET-PAT-–-Programul-Asistenta-Tehnica-pachet-complet-identitate-vizuala.png",
        price: 49,
        category: "Asistență Tehnică",
        tags: ["poat", "autocolante", "set", "eu"],
        program: "Programul Asistență Tehnică (POAT)"
    },
    {
        id: "afis-poat",
        slug: "afis-a3-poat",
        title: "Afiș A3 Programul Asistență Tehnică (POAT)",
        description: "Afiș informativ A3 pentru proiecte Programul Asistență Tehnică (POAT). Hârtie 200g, print color.",
        image: "/products/fonduri/PACHET-PAT-–-Programul-Asistenta-Tehnica-pachet-complet-identitate-vizuala.png",
        price: 49,
        category: "Asistență Tehnică",
        tags: ["poat", "afis", "a3", "eu"],
        program: "Programul Asistență Tehnică (POAT)"
    },
    {
        id: "placa-permanenta-pr-nord-est",
        slug: "placa-permanenta-pr-nord-est",
        title: "Placă Permanentă PR Nord-Est 2021-2027",
        description: "Placă informativă permanentă pentru proiecte PR Nord-Est 2021-2027. Material rigid, rezistent la exterior.",
        image: "/products/fonduri/regio-1.png",
        price: 290,
        category: "Programe Regionale",
        tags: ["prnordest", "placa", "permanenta", "eu"],
        program: "PR Nord-Est 2021-2027"
    },
    {
        id: "autocolante-pr-nord-est",
        slug: "set-autocolante-pr-nord-est",
        title: "Set Autocolante PR Nord-Est 2021-2027",
        description: "Set autocolante obligatorii pentru echipamente/utilaje achiziționate prin PR Nord-Est 2021-2027.",
        image: "/products/fonduri/regio-1.png",
        price: 49,
        category: "Programe Regionale",
        tags: ["prnordest", "autocolante", "set", "eu"],
        program: "PR Nord-Est 2021-2027"
    },
    {
        id: "afis-pr-nord-est",
        slug: "afis-a3-pr-nord-est",
        title: "Afiș A3 PR Nord-Est 2021-2027",
        description: "Afiș informativ A3 pentru proiecte PR Nord-Est 2021-2027. Hârtie 200g, print color.",
        image: "/products/fonduri/regio-1.png",
        price: 49,
        category: "Programe Regionale",
        tags: ["prnordest", "afis", "a3", "eu"],
        program: "PR Nord-Est 2021-2027"
    },
    {
        id: "placa-permanenta-pr-sud-est",
        slug: "placa-permanenta-pr-sud-est",
        title: "Placă Permanentă PR Sud-Est 2021-2027",
        description: "Placă informativă permanentă pentru proiecte PR Sud-Est 2021-2027. Material rigid, rezistent la exterior.",
        image: "/products/fonduri/regio-1.png",
        price: 290,
        category: "Programe Regionale",
        tags: ["prsudest", "placa", "permanenta", "eu"],
        program: "PR Sud-Est 2021-2027"
    },
    {
        id: "autocolante-pr-sud-est",
        slug: "set-autocolante-pr-sud-est",
        title: "Set Autocolante PR Sud-Est 2021-2027",
        description: "Set autocolante obligatorii pentru echipamente/utilaje achiziționate prin PR Sud-Est 2021-2027.",
        image: "/products/fonduri/regio-1.png",
        price: 49,
        category: "Programe Regionale",
        tags: ["prsudest", "autocolante", "set", "eu"],
        program: "PR Sud-Est 2021-2027"
    },
    {
        id: "afis-pr-sud-est",
        slug: "afis-a3-pr-sud-est",
        title: "Afiș A3 PR Sud-Est 2021-2027",
        description: "Afiș informativ A3 pentru proiecte PR Sud-Est 2021-2027. Hârtie 200g, print color.",
        image: "/products/fonduri/regio-1.png",
        price: 49,
        category: "Programe Regionale",
        tags: ["prsudest", "afis", "a3", "eu"],
        program: "PR Sud-Est 2021-2027"
    },
    {
        id: "placa-permanenta-pr-sud-muntenia",
        slug: "placa-permanenta-pr-sud-muntenia",
        title: "Placă Permanentă PR Sud-Muntenia 2021-2027",
        description: "Placă informativă permanentă pentru proiecte PR Sud-Muntenia 2021-2027. Material rigid, rezistent la exterior.",
        image: "/products/fonduri/regio-1.png",
        price: 290,
        category: "Programe Regionale",
        tags: ["prsudmuntenia", "placa", "permanenta", "eu"],
        program: "PR Sud-Muntenia 2021-2027"
    },
    {
        id: "autocolante-pr-sud-muntenia",
        slug: "set-autocolante-pr-sud-muntenia",
        title: "Set Autocolante PR Sud-Muntenia 2021-2027",
        description: "Set autocolante obligatorii pentru echipamente/utilaje achiziționate prin PR Sud-Muntenia 2021-2027.",
        image: "/products/fonduri/regio-1.png",
        price: 49,
        category: "Programe Regionale",
        tags: ["prsudmuntenia", "autocolante", "set", "eu"],
        program: "PR Sud-Muntenia 2021-2027"
    },
    {
        id: "afis-pr-sud-muntenia",
        slug: "afis-a3-pr-sud-muntenia",
        title: "Afiș A3 PR Sud-Muntenia 2021-2027",
        description: "Afiș informativ A3 pentru proiecte PR Sud-Muntenia 2021-2027. Hârtie 200g, print color.",
        image: "/products/fonduri/regio-1.png",
        price: 49,
        category: "Programe Regionale",
        tags: ["prsudmuntenia", "afis", "a3", "eu"],
        program: "PR Sud-Muntenia 2021-2027"
    },
    {
        id: "placa-permanenta-pr-sud-vest-oltenia",
        slug: "placa-permanenta-pr-sud-vest-oltenia",
        title: "Placă Permanentă PR Sud-Vest Oltenia 2021-2027",
        description: "Placă informativă permanentă pentru proiecte PR Sud-Vest Oltenia 2021-2027. Material rigid, rezistent la exterior.",
        image: "/products/fonduri/regio-1.png",
        price: 290,
        category: "Programe Regionale",
        tags: ["prsudvestoltenia", "placa", "permanenta", "eu"],
        program: "PR Sud-Vest Oltenia 2021-2027"
    },
    {
        id: "autocolante-pr-sud-vest-oltenia",
        slug: "set-autocolante-pr-sud-vest-oltenia",
        title: "Set Autocolante PR Sud-Vest Oltenia 2021-2027",
        description: "Set autocolante obligatorii pentru echipamente/utilaje achiziționate prin PR Sud-Vest Oltenia 2021-2027.",
        image: "/products/fonduri/regio-1.png",
        price: 49,
        category: "Programe Regionale",
        tags: ["prsudvestoltenia", "autocolante", "set", "eu"],
        program: "PR Sud-Vest Oltenia 2021-2027"
    },
    {
        id: "afis-pr-sud-vest-oltenia",
        slug: "afis-a3-pr-sud-vest-oltenia",
        title: "Afiș A3 PR Sud-Vest Oltenia 2021-2027",
        description: "Afiș informativ A3 pentru proiecte PR Sud-Vest Oltenia 2021-2027. Hârtie 200g, print color.",
        image: "/products/fonduri/regio-1.png",
        price: 49,
        category: "Programe Regionale",
        tags: ["prsudvestoltenia", "afis", "a3", "eu"],
        program: "PR Sud-Vest Oltenia 2021-2027"
    },
    {
        id: "placa-permanenta-pr-vest",
        slug: "placa-permanenta-pr-vest",
        title: "Placă Permanentă PR Vest 2021-2027",
        description: "Placă informativă permanentă pentru proiecte PR Vest 2021-2027. Material rigid, rezistent la exterior.",
        image: "/products/fonduri/regio-1.png",
        price: 290,
        category: "Programe Regionale",
        tags: ["prvest", "placa", "permanenta", "eu"],
        program: "PR Vest 2021-2027"
    },
    {
        id: "autocolante-pr-vest",
        slug: "set-autocolante-pr-vest",
        title: "Set Autocolante PR Vest 2021-2027",
        description: "Set autocolante obligatorii pentru echipamente/utilaje achiziționate prin PR Vest 2021-2027.",
        image: "/products/fonduri/regio-1.png",
        price: 49,
        category: "Programe Regionale",
        tags: ["prvest", "autocolante", "set", "eu"],
        program: "PR Vest 2021-2027"
    },
    {
        id: "afis-pr-vest",
        slug: "afis-a3-pr-vest",
        title: "Afiș A3 PR Vest 2021-2027",
        description: "Afiș informativ A3 pentru proiecte PR Vest 2021-2027. Hârtie 200g, print color.",
        image: "/products/fonduri/regio-1.png",
        price: 49,
        category: "Programe Regionale",
        tags: ["prvest", "afis", "a3", "eu"],
        program: "PR Vest 2021-2027"
    },
    {
        id: "placa-permanenta-pr-nord-vest",
        slug: "placa-permanenta-pr-nord-vest",
        title: "Placă Permanentă PR Nord-Vest 2021-2027",
        description: "Placă informativă permanentă pentru proiecte PR Nord-Vest 2021-2027. Material rigid, rezistent la exterior.",
        image: "/products/fonduri/regio-1.png",
        price: 290,
        category: "Programe Regionale",
        tags: ["prnordvest", "placa", "permanenta", "eu"],
        program: "PR Nord-Vest 2021-2027"
    },
    {
        id: "autocolante-pr-nord-vest",
        slug: "set-autocolante-pr-nord-vest",
        title: "Set Autocolante PR Nord-Vest 2021-2027",
        description: "Set autocolante obligatorii pentru echipamente/utilaje achiziționate prin PR Nord-Vest 2021-2027.",
        image: "/products/fonduri/regio-1.png",
        price: 49,
        category: "Programe Regionale",
        tags: ["prnordvest", "autocolante", "set", "eu"],
        program: "PR Nord-Vest 2021-2027"
    },
    {
        id: "afis-pr-nord-vest",
        slug: "afis-a3-pr-nord-vest",
        title: "Afiș A3 PR Nord-Vest 2021-2027",
        description: "Afiș informativ A3 pentru proiecte PR Nord-Vest 2021-2027. Hârtie 200g, print color.",
        image: "/products/fonduri/regio-1.png",
        price: 49,
        category: "Programe Regionale",
        tags: ["prnordvest", "afis", "a3", "eu"],
        program: "PR Nord-Vest 2021-2027"
    },
    {
        id: "placa-permanenta-pr-centru",
        slug: "placa-permanenta-pr-centru",
        title: "Placă Permanentă PR Centru 2021-2027",
        description: "Placă informativă permanentă pentru proiecte PR Centru 2021-2027. Material rigid, rezistent la exterior.",
        image: "/products/fonduri/regio-1.png",
        price: 290,
        category: "Programe Regionale",
        tags: ["prcentru", "placa", "permanenta", "eu"],
        program: "PR Centru 2021-2027"
    },
    {
        id: "autocolante-pr-centru",
        slug: "set-autocolante-pr-centru",
        title: "Set Autocolante PR Centru 2021-2027",
        description: "Set autocolante obligatorii pentru echipamente/utilaje achiziționate prin PR Centru 2021-2027.",
        image: "/products/fonduri/regio-1.png",
        price: 49,
        category: "Programe Regionale",
        tags: ["prcentru", "autocolante", "set", "eu"],
        program: "PR Centru 2021-2027"
    },
    {
        id: "afis-pr-centru",
        slug: "afis-a3-pr-centru",
        title: "Afiș A3 PR Centru 2021-2027",
        description: "Afiș informativ A3 pentru proiecte PR Centru 2021-2027. Hârtie 200g, print color.",
        image: "/products/fonduri/regio-1.png",
        price: 49,
        category: "Programe Regionale",
        tags: ["prcentru", "afis", "a3", "eu"],
        program: "PR Centru 2021-2027"
    },
    {
        id: "placa-permanenta-pr-bucuresti-ilfov",
        slug: "placa-permanenta-pr-bucuresti-ilfov",
        title: "Placă Permanentă PR București-Ilfov 2021-2027",
        description: "Placă informativă permanentă pentru proiecte PR București-Ilfov 2021-2027. Material rigid, rezistent la exterior.",
        image: "/products/fonduri/regio-1.png",
        price: 290,
        category: "Programe Regionale",
        tags: ["prbucurestiilfov", "placa", "permanenta", "eu"],
        program: "PR București-Ilfov 2021-2027"
    },
    {
        id: "autocolante-pr-bucuresti-ilfov",
        slug: "set-autocolante-pr-bucuresti-ilfov",
        title: "Set Autocolante PR București-Ilfov 2021-2027",
        description: "Set autocolante obligatorii pentru echipamente/utilaje achiziționate prin PR București-Ilfov 2021-2027.",
        image: "/products/fonduri/regio-1.png",
        price: 49,
        category: "Programe Regionale",
        tags: ["prbucurestiilfov", "autocolante", "set", "eu"],
        program: "PR București-Ilfov 2021-2027"
    },
    {
        id: "afis-pr-bucuresti-ilfov",
        slug: "afis-a3-pr-bucuresti-ilfov",
        title: "Afiș A3 PR București-Ilfov 2021-2027",
        description: "Afiș informativ A3 pentru proiecte PR București-Ilfov 2021-2027. Hârtie 200g, print color.",
        image: "/products/fonduri/regio-1.png",
        price: 49,
        category: "Programe Regionale",
        tags: ["prbucurestiilfov", "afis", "a3", "eu"],
        program: "PR București-Ilfov 2021-2027"
    },
    {
        id: "placa-permanenta-afir-dr-30",
        slug: "placa-permanenta-afir-dr-30",
        title: "Placă Permanentă AFIR - DR-30 Tânărul Fermier",
        description: "Placă informativă permanentă pentru proiecte AFIR - DR-30 Tânărul Fermier. Material rigid, rezistent la exterior.",
        image: "/products/fonduri/AFIR_PLACUTA_FEADR-2024dr.jpg",
        price: 290,
        category: "Agricultură",
        tags: ["afirdr30", "placa", "permanenta", "eu"],
        program: "AFIR - DR-30 Tânărul Fermier"
    },
    {
        id: "autocolante-afir-dr-30",
        slug: "set-autocolante-afir-dr-30",
        title: "Set Autocolante AFIR - DR-30 Tânărul Fermier",
        description: "Set autocolante obligatorii pentru echipamente/utilaje achiziționate prin AFIR - DR-30 Tânărul Fermier.",
        image: "/products/fonduri/AFIR_PLACUTA_FEADR-2024dr.jpg",
        price: 49,
        category: "Agricultură",
        tags: ["afirdr30", "autocolante", "set", "eu"],
        program: "AFIR - DR-30 Tânărul Fermier"
    },
    {
        id: "afis-afir-dr-30",
        slug: "afis-a3-afir-dr-30",
        title: "Afiș A3 AFIR - DR-30 Tânărul Fermier",
        description: "Afiș informativ A3 pentru proiecte AFIR - DR-30 Tânărul Fermier. Hârtie 200g, print color.",
        image: "/products/fonduri/AFIR_PLACUTA_FEADR-2024dr.jpg",
        price: 49,
        category: "Agricultură",
        tags: ["afirdr30", "afis", "a3", "eu"],
        program: "AFIR - DR-30 Tânărul Fermier"
    },
    {
        id: "placa-permanenta-afir-dr-22",
        slug: "placa-permanenta-afir-dr-22",
        title: "Placă Permanentă AFIR - DR-22 Investiții",
        description: "Placă informativă permanentă pentru proiecte AFIR - DR-22 Investiții. Material rigid, rezistent la exterior.",
        image: "/products/fonduri/AFIR_PLACUTA_FEADR-2024dr.jpg",
        price: 290,
        category: "Agricultură",
        tags: ["afirdr22", "placa", "permanenta", "eu"],
        program: "AFIR - DR-22 Investiții"
    },
    {
        id: "autocolante-afir-dr-22",
        slug: "set-autocolante-afir-dr-22",
        title: "Set Autocolante AFIR - DR-22 Investiții",
        description: "Set autocolante obligatorii pentru echipamente/utilaje achiziționate prin AFIR - DR-22 Investiții.",
        image: "/products/fonduri/AFIR_PLACUTA_FEADR-2024dr.jpg",
        price: 49,
        category: "Agricultură",
        tags: ["afirdr22", "autocolante", "set", "eu"],
        program: "AFIR - DR-22 Investiții"
    },
    {
        id: "afis-afir-dr-22",
        slug: "afis-a3-afir-dr-22",
        title: "Afiș A3 AFIR - DR-22 Investiții",
        description: "Afiș informativ A3 pentru proiecte AFIR - DR-22 Investiții. Hârtie 200g, print color.",
        image: "/products/fonduri/AFIR_PLACUTA_FEADR-2024dr.jpg",
        price: 49,
        category: "Agricultură",
        tags: ["afirdr22", "afis", "a3", "eu"],
        program: "AFIR - DR-22 Investiții"
    },
    {
        id: "placa-permanenta-afir-dr-27",
        slug: "placa-permanenta-afir-dr-27",
        title: "Placă Permanentă AFIR - DR-27 Infrastructură",
        description: "Placă informativă permanentă pentru proiecte AFIR - DR-27 Infrastructură. Material rigid, rezistent la exterior.",
        image: "/products/fonduri/AFIR_PLACUTA_FEADR-2024dr.jpg",
        price: 290,
        category: "Agricultură",
        tags: ["afirdr27", "placa", "permanenta", "eu"],
        program: "AFIR - DR-27 Infrastructură"
    },
    {
        id: "autocolante-afir-dr-27",
        slug: "set-autocolante-afir-dr-27",
        title: "Set Autocolante AFIR - DR-27 Infrastructură",
        description: "Set autocolante obligatorii pentru echipamente/utilaje achiziționate prin AFIR - DR-27 Infrastructură.",
        image: "/products/fonduri/AFIR_PLACUTA_FEADR-2024dr.jpg",
        price: 49,
        category: "Agricultură",
        tags: ["afirdr27", "autocolante", "set", "eu"],
        program: "AFIR - DR-27 Infrastructură"
    },
    {
        id: "afis-afir-dr-27",
        slug: "afis-a3-afir-dr-27",
        title: "Afiș A3 AFIR - DR-27 Infrastructură",
        description: "Afiș informativ A3 pentru proiecte AFIR - DR-27 Infrastructură. Hârtie 200g, print color.",
        image: "/products/fonduri/AFIR_PLACUTA_FEADR-2024dr.jpg",
        price: 49,
        category: "Agricultură",
        tags: ["afirdr27", "afis", "a3", "eu"],
        program: "AFIR - DR-27 Infrastructură"
    },
    {
        id: "placa-permanenta-mipe-digitalizare",
        slug: "placa-permanenta-mipe-digitalizare",
        title: "Placă Permanentă MIPE - Digitalizare IMM",
        description: "Placă informativă permanentă pentru proiecte MIPE - Digitalizare IMM. Material rigid, rezistent la exterior.",
        image: "/products/fonduri/pachet-complet-pnrr-comununicate-de-presa-plus-pachet-print-identitate-vizuala.png",
        price: 290,
        category: "Digitalizare",
        tags: ["mipedigitalizare", "placa", "permanenta", "eu"],
        program: "MIPE - Digitalizare IMM"
    },
    {
        id: "autocolante-mipe-digitalizare",
        slug: "set-autocolante-mipe-digitalizare",
        title: "Set Autocolante MIPE - Digitalizare IMM",
        description: "Set autocolante obligatorii pentru echipamente/utilaje achiziționate prin MIPE - Digitalizare IMM.",
        image: "/products/fonduri/pachet-complet-pnrr-comununicate-de-presa-plus-pachet-print-identitate-vizuala.png",
        price: 49,
        category: "Digitalizare",
        tags: ["mipedigitalizare", "autocolante", "set", "eu"],
        program: "MIPE - Digitalizare IMM"
    },
    {
        id: "afis-mipe-digitalizare",
        slug: "afis-a3-mipe-digitalizare",
        title: "Afiș A3 MIPE - Digitalizare IMM",
        description: "Afiș informativ A3 pentru proiecte MIPE - Digitalizare IMM. Hârtie 200g, print color.",
        image: "/products/fonduri/pachet-complet-pnrr-comununicate-de-presa-plus-pachet-print-identitate-vizuala.png",
        price: 49,
        category: "Digitalizare",
        tags: ["mipedigitalizare", "afis", "a3", "eu"],
        program: "MIPE - Digitalizare IMM"
    },
    {
        id: "placa-permanenta-adr-digitalizare-admin",
        slug: "placa-permanenta-adr-digitalizare-admin",
        title: "Placă Permanentă ADR - Digitalizare Administrație",
        description: "Placă informativă permanentă pentru proiecte ADR - Digitalizare Administrație. Material rigid, rezistent la exterior.",
        image: "/products/fonduri/pachet-complet-pnrr-comununicate-de-presa-plus-pachet-print-identitate-vizuala.png",
        price: 290,
        category: "Digitalizare",
        tags: ["adrdigitalizareadmin", "placa", "permanenta", "eu"],
        program: "ADR - Digitalizare Administrație"
    },
    {
        id: "autocolante-adr-digitalizare-admin",
        slug: "set-autocolante-adr-digitalizare-admin",
        title: "Set Autocolante ADR - Digitalizare Administrație",
        description: "Set autocolante obligatorii pentru echipamente/utilaje achiziționate prin ADR - Digitalizare Administrație.",
        image: "/products/fonduri/pachet-complet-pnrr-comununicate-de-presa-plus-pachet-print-identitate-vizuala.png",
        price: 49,
        category: "Digitalizare",
        tags: ["adrdigitalizareadmin", "autocolante", "set", "eu"],
        program: "ADR - Digitalizare Administrație"
    },
    {
        id: "afis-adr-digitalizare-admin",
        slug: "afis-a3-adr-digitalizare-admin",
        title: "Afiș A3 ADR - Digitalizare Administrație",
        description: "Afiș informativ A3 pentru proiecte ADR - Digitalizare Administrație. Hârtie 200g, print color.",
        image: "/products/fonduri/pachet-complet-pnrr-comununicate-de-presa-plus-pachet-print-identitate-vizuala.png",
        price: 49,
        category: "Digitalizare",
        tags: ["adrdigitalizareadmin", "afis", "a3", "eu"],
        program: "ADR - Digitalizare Administrație"
    },
    {
        id: "placa-permanenta-adr-smart-city",
        slug: "placa-permanenta-adr-smart-city",
        title: "Placă Permanentă ADR - Smart City",
        description: "Placă informativă permanentă pentru proiecte ADR - Smart City. Material rigid, rezistent la exterior.",
        image: "/products/fonduri/pachet-complet-pnrr-comununicate-de-presa-plus-pachet-print-identitate-vizuala.png",
        price: 290,
        category: "Smart City",
        tags: ["adrsmartcity", "placa", "permanenta", "eu"],
        program: "ADR - Smart City"
    },
    {
        id: "autocolante-adr-smart-city",
        slug: "set-autocolante-adr-smart-city",
        title: "Set Autocolante ADR - Smart City",
        description: "Set autocolante obligatorii pentru echipamente/utilaje achiziționate prin ADR - Smart City.",
        image: "/products/fonduri/pachet-complet-pnrr-comununicate-de-presa-plus-pachet-print-identitate-vizuala.png",
        price: 49,
        category: "Smart City",
        tags: ["adrsmartcity", "autocolante", "set", "eu"],
        program: "ADR - Smart City"
    },
    {
        id: "afis-adr-smart-city",
        slug: "afis-a3-adr-smart-city",
        title: "Afiș A3 ADR - Smart City",
        description: "Afiș informativ A3 pentru proiecte ADR - Smart City. Hârtie 200g, print color.",
        image: "/products/fonduri/pachet-complet-pnrr-comununicate-de-presa-plus-pachet-print-identitate-vizuala.png",
        price: 49,
        category: "Smart City",
        tags: ["adrsmartcity", "afis", "a3", "eu"],
        program: "ADR - Smart City"
    },
    {
        id: "placa-permanenta-adr-imm",
        slug: "placa-permanenta-adr-imm",
        title: "Placă Permanentă ADR - Dezvoltare IMM",
        description: "Placă informativă permanentă pentru proiecte ADR - Dezvoltare IMM. Material rigid, rezistent la exterior.",
        image: "/products/fonduri/pachet-complet-pnrr-comununicate-de-presa-plus-pachet-print-identitate-vizuala.png",
        price: 290,
        category: "Dezvoltare IMM",
        tags: ["adrimm", "placa", "permanenta", "eu"],
        program: "ADR - Dezvoltare IMM"
    },
    {
        id: "autocolante-adr-imm",
        slug: "set-autocolante-adr-imm",
        title: "Set Autocolante ADR - Dezvoltare IMM",
        description: "Set autocolante obligatorii pentru echipamente/utilaje achiziționate prin ADR - Dezvoltare IMM.",
        image: "/products/fonduri/pachet-complet-pnrr-comununicate-de-presa-plus-pachet-print-identitate-vizuala.png",
        price: 49,
        category: "Dezvoltare IMM",
        tags: ["adrimm", "autocolante", "set", "eu"],
        program: "ADR - Dezvoltare IMM"
    },
    {
        id: "afis-adr-imm",
        slug: "afis-a3-adr-imm",
        title: "Afiș A3 ADR - Dezvoltare IMM",
        description: "Afiș informativ A3 pentru proiecte ADR - Dezvoltare IMM. Hârtie 200g, print color.",
        image: "/products/fonduri/pachet-complet-pnrr-comununicate-de-presa-plus-pachet-print-identitate-vizuala.png",
        price: 49,
        category: "Dezvoltare IMM",
        tags: ["adrimm", "afis", "a3", "eu"],
        program: "ADR - Dezvoltare IMM"
    },
    {
        id: "comunicat-pot",
        slug: "comunicat-presa-pot",
        title: "Comunicat de Presă Programul Operațional Transport (POT)",
        description: "Redactare și publicare comunicat de presă pentru proiecte Programul Operațional Transport (POT). Include dovadă publicare.",
        image: "/products/fonduri/PT-–-Programul-Transport-pachet-identitate-vizuala-print.png",
        price: 490,
        category: "Transport",
        tags: ["pot", "comunicat", "presa", "eu"],
        program: "Programul Operațional Transport (POT)"
    },
    {
        id: "comunicat-poat",
        slug: "comunicat-presa-poat",
        title: "Comunicat de Presă Programul Asistență Tehnică (POAT)",
        description: "Redactare și publicare comunicat de presă pentru proiecte Programul Asistență Tehnică (POAT). Include dovadă publicare.",
        image: "/products/fonduri/PACHET-PAT-–-Programul-Asistenta-Tehnica-pachet-complet-identitate-vizuala.png",
        price: 490,
        category: "Asistență Tehnică",
        tags: ["poat", "comunicat", "presa", "eu"],
        program: "Programul Asistență Tehnică (POAT)"
    },
    {
        id: "comunicat-pr-nord-est",
        slug: "comunicat-presa-pr-nord-est",
        title: "Comunicat de Presă PR Nord-Est 2021-2027",
        description: "Redactare și publicare comunicat de presă pentru proiecte PR Nord-Est 2021-2027. Include dovadă publicare.",
        image: "/products/fonduri/regio-1.png",
        price: 490,
        category: "Programe Regionale",
        tags: ["prnordest", "comunicat", "presa", "eu"],
        program: "PR Nord-Est 2021-2027"
    },
    {
        id: "comunicat-pr-sud-est",
        slug: "comunicat-presa-pr-sud-est",
        title: "Comunicat de Presă PR Sud-Est 2021-2027",
        description: "Redactare și publicare comunicat de presă pentru proiecte PR Sud-Est 2021-2027. Include dovadă publicare.",
        image: "/products/fonduri/regio-1.png",
        price: 490,
        category: "Programe Regionale",
        tags: ["prsudest", "comunicat", "presa", "eu"],
        program: "PR Sud-Est 2021-2027"
    },
    {
        id: "comunicat-pr-sud-muntenia",
        slug: "comunicat-presa-pr-sud-muntenia",
        title: "Comunicat de Presă PR Sud-Muntenia 2021-2027",
        description: "Redactare și publicare comunicat de presă pentru proiecte PR Sud-Muntenia 2021-2027. Include dovadă publicare.",
        image: "/products/fonduri/regio-1.png",
        price: 490,
        category: "Programe Regionale",
        tags: ["prsudmuntenia", "comunicat", "presa", "eu"],
        program: "PR Sud-Muntenia 2021-2027"
    },
    {
        id: "comunicat-pr-sud-vest-oltenia",
        slug: "comunicat-presa-pr-sud-vest-oltenia",
        title: "Comunicat de Presă PR Sud-Vest Oltenia 2021-2027",
        description: "Redactare și publicare comunicat de presă pentru proiecte PR Sud-Vest Oltenia 2021-2027. Include dovadă publicare.",
        image: "/products/fonduri/regio-1.png",
        price: 490,
        category: "Programe Regionale",
        tags: ["prsudvestoltenia", "comunicat", "presa", "eu"],
        program: "PR Sud-Vest Oltenia 2021-2027"
    },
    {
        id: "comunicat-pr-vest",
        slug: "comunicat-presa-pr-vest",
        title: "Comunicat de Presă PR Vest 2021-2027",
        description: "Redactare și publicare comunicat de presă pentru proiecte PR Vest 2021-2027. Include dovadă publicare.",
        image: "/products/fonduri/regio-1.png",
        price: 490,
        category: "Programe Regionale",
        tags: ["prvest", "comunicat", "presa", "eu"],
        program: "PR Vest 2021-2027"
    },
    {
        id: "comunicat-pr-nord-vest",
        slug: "comunicat-presa-pr-nord-vest",
        title: "Comunicat de Presă PR Nord-Vest 2021-2027",
        description: "Redactare și publicare comunicat de presă pentru proiecte PR Nord-Vest 2021-2027. Include dovadă publicare.",
        image: "/products/fonduri/regio-1.png",
        price: 490,
        category: "Programe Regionale",
        tags: ["prnordvest", "comunicat", "presa", "eu"],
        program: "PR Nord-Vest 2021-2027"
    },
    {
        id: "comunicat-pr-centru",
        slug: "comunicat-presa-pr-centru",
        title: "Comunicat de Presă PR Centru 2021-2027",
        description: "Redactare și publicare comunicat de presă pentru proiecte PR Centru 2021-2027. Include dovadă publicare.",
        image: "/products/fonduri/regio-1.png",
        price: 490,
        category: "Programe Regionale",
        tags: ["prcentru", "comunicat", "presa", "eu"],
        program: "PR Centru 2021-2027"
    },
    {
        id: "comunicat-pr-bucuresti-ilfov",
        slug: "comunicat-presa-pr-bucuresti-ilfov",
        title: "Comunicat de Presă PR București-Ilfov 2021-2027",
        description: "Redactare și publicare comunicat de presă pentru proiecte PR București-Ilfov 2021-2027. Include dovadă publicare.",
        image: "/products/fonduri/regio-1.png",
        price: 490,
        category: "Programe Regionale",
        tags: ["prbucurestiilfov", "comunicat", "presa", "eu"],
        program: "PR București-Ilfov 2021-2027"
    },
    {
        id: "comunicat-afir-dr-30",
        slug: "comunicat-presa-afir-dr-30",
        title: "Comunicat de Presă AFIR - DR-30 Tânărul Fermier",
        description: "Redactare și publicare comunicat de presă pentru proiecte AFIR - DR-30 Tânărul Fermier. Include dovadă publicare.",
        image: "/products/fonduri/AFIR_PLACUTA_FEADR-2024dr.jpg",
        price: 490,
        category: "Agricultură",
        tags: ["afirdr30", "comunicat", "presa", "eu"],
        program: "AFIR - DR-30 Tânărul Fermier"
    },
    {
        id: "comunicat-afir-dr-22",
        slug: "comunicat-presa-afir-dr-22",
        title: "Comunicat de Presă AFIR - DR-22 Investiții",
        description: "Redactare și publicare comunicat de presă pentru proiecte AFIR - DR-22 Investiții. Include dovadă publicare.",
        image: "/products/fonduri/AFIR_PLACUTA_FEADR-2024dr.jpg",
        price: 490,
        category: "Agricultură",
        tags: ["afirdr22", "comunicat", "presa", "eu"],
        program: "AFIR - DR-22 Investiții"
    },
    {
        id: "comunicat-afir-dr-27",
        slug: "comunicat-presa-afir-dr-27",
        title: "Comunicat de Presă AFIR - DR-27 Infrastructură",
        description: "Redactare și publicare comunicat de presă pentru proiecte AFIR - DR-27 Infrastructură. Include dovadă publicare.",
        image: "/products/fonduri/AFIR_PLACUTA_FEADR-2024dr.jpg",
        price: 490,
        category: "Agricultură",
        tags: ["afirdr27", "comunicat", "presa", "eu"],
        program: "AFIR - DR-27 Infrastructură"
    },
    {
        id: "comunicat-mipe-digitalizare",
        slug: "comunicat-presa-mipe-digitalizare",
        title: "Comunicat de Presă MIPE - Digitalizare IMM",
        description: "Redactare și publicare comunicat de presă pentru proiecte MIPE - Digitalizare IMM. Include dovadă publicare.",
        image: "/products/fonduri/pachet-complet-pnrr-comununicate-de-presa-plus-pachet-print-identitate-vizuala.png",
        price: 490,
        category: "Digitalizare",
        tags: ["mipedigitalizare", "comunicat", "presa", "eu"],
        program: "MIPE - Digitalizare IMM"
    },
    {
        id: "comunicat-adr-digitalizare-admin",
        slug: "comunicat-presa-adr-digitalizare-admin",
        title: "Comunicat de Presă ADR - Digitalizare Administrație",
        description: "Redactare și publicare comunicat de presă pentru proiecte ADR - Digitalizare Administrație. Include dovadă publicare.",
        image: "/products/fonduri/pachet-complet-pnrr-comununicate-de-presa-plus-pachet-print-identitate-vizuala.png",
        price: 490,
        category: "Digitalizare",
        tags: ["adrdigitalizareadmin", "comunicat", "presa", "eu"],
        program: "ADR - Digitalizare Administrație"
    },
    {
        id: "comunicat-adr-smart-city",
        slug: "comunicat-presa-adr-smart-city",
        title: "Comunicat de Presă ADR - Smart City",
        description: "Redactare și publicare comunicat de presă pentru proiecte ADR - Smart City. Include dovadă publicare.",
        image: "/products/fonduri/pachet-complet-pnrr-comununicate-de-presa-plus-pachet-print-identitate-vizuala.png",
        price: 490,
        category: "Smart City",
        tags: ["adrsmartcity", "comunicat", "presa", "eu"],
        program: "ADR - Smart City"
    },
    {
        id: "comunicat-adr-imm",
        slug: "comunicat-presa-adr-imm",
        title: "Comunicat de Presă ADR - Dezvoltare IMM",
        description: "Redactare și publicare comunicat de presă pentru proiecte ADR - Dezvoltare IMM. Include dovadă publicare.",
        image: "/products/fonduri/pachet-complet-pnrr-comununicate-de-presa-plus-pachet-print-identitate-vizuala.png",
        price: 490,
        category: "Dezvoltare IMM",
        tags: ["adrimm", "comunicat", "presa", "eu"],
        program: "ADR - Dezvoltare IMM"
    },
    {
        id: "panou-temporar-pot",
        slug: "panou-temporar-pot",
        title: "Panou Temporar Programul Operațional Transport (POT)",
        description: "Panou temporar de șantier pentru proiecte Programul Operațional Transport (POT). Material rezistent la exterior, print UV. Diverse dimensiuni disponibile.",
        image: "/products/fonduri/PT-–-Programul-Transport-pachet-identitate-vizuala-print.png",
        price: 290,
        category: "Transport",
        tags: ["pot", "panou", "temporar", "eu"],
        program: "Programul Operațional Transport (POT)"
    },
    {
        id: "panou-temporar-poat",
        slug: "panou-temporar-poat",
        title: "Panou Temporar Programul Asistență Tehnică (POAT)",
        description: "Panou temporar de șantier pentru proiecte Programul Asistență Tehnică (POAT). Material rezistent la exterior, print UV. Diverse dimensiuni disponibile.",
        image: "/products/fonduri/PACHET-PAT-–-Programul-Asistenta-Tehnica-pachet-complet-identitate-vizuala.png",
        price: 290,
        category: "Asistență Tehnică",
        tags: ["poat", "panou", "temporar", "eu"],
        program: "Programul Asistență Tehnică (POAT)"
    },
    {
        id: "panou-temporar-pr-nord-est",
        slug: "panou-temporar-pr-nord-est",
        title: "Panou Temporar PR Nord-Est 2021-2027",
        description: "Panou temporar de șantier pentru proiecte PR Nord-Est 2021-2027. Material rezistent la exterior, print UV. Diverse dimensiuni disponibile.",
        image: "/products/fonduri/regio-1.png",
        price: 290,
        category: "Programe Regionale",
        tags: ["prnordest", "panou", "temporar", "eu"],
        program: "PR Nord-Est 2021-2027"
    },
    {
        id: "panou-temporar-pr-sud-est",
        slug: "panou-temporar-pr-sud-est",
        title: "Panou Temporar PR Sud-Est 2021-2027",
        description: "Panou temporar de șantier pentru proiecte PR Sud-Est 2021-2027. Material rezistent la exterior, print UV. Diverse dimensiuni disponibile.",
        image: "/products/fonduri/regio-1.png",
        price: 290,
        category: "Programe Regionale",
        tags: ["prsudest", "panou", "temporar", "eu"],
        program: "PR Sud-Est 2021-2027"
    },
    {
        id: "panou-temporar-pr-sud-muntenia",
        slug: "panou-temporar-pr-sud-muntenia",
        title: "Panou Temporar PR Sud-Muntenia 2021-2027",
        description: "Panou temporar de șantier pentru proiecte PR Sud-Muntenia 2021-2027. Material rezistent la exterior, print UV. Diverse dimensiuni disponibile.",
        image: "/products/fonduri/regio-1.png",
        price: 290,
        category: "Programe Regionale",
        tags: ["prsudmuntenia", "panou", "temporar", "eu"],
        program: "PR Sud-Muntenia 2021-2027"
    },
    {
        id: "panou-temporar-pr-sud-vest-oltenia",
        slug: "panou-temporar-pr-sud-vest-oltenia",
        title: "Panou Temporar PR Sud-Vest Oltenia 2021-2027",
        description: "Panou temporar de șantier pentru proiecte PR Sud-Vest Oltenia 2021-2027. Material rezistent la exterior, print UV. Diverse dimensiuni disponibile.",
        image: "/products/fonduri/regio-1.png",
        price: 290,
        category: "Programe Regionale",
        tags: ["prsudvestoltenia", "panou", "temporar", "eu"],
        program: "PR Sud-Vest Oltenia 2021-2027"
    },
    {
        id: "panou-temporar-pr-vest",
        slug: "panou-temporar-pr-vest",
        title: "Panou Temporar PR Vest 2021-2027",
        description: "Panou temporar de șantier pentru proiecte PR Vest 2021-2027. Material rezistent la exterior, print UV. Diverse dimensiuni disponibile.",
        image: "/products/fonduri/regio-1.png",
        price: 290,
        category: "Programe Regionale",
        tags: ["prvest", "panou", "temporar", "eu"],
        program: "PR Vest 2021-2027"
    },
    {
        id: "panou-temporar-pr-nord-vest",
        slug: "panou-temporar-pr-nord-vest",
        title: "Panou Temporar PR Nord-Vest 2021-2027",
        description: "Panou temporar de șantier pentru proiecte PR Nord-Vest 2021-2027. Material rezistent la exterior, print UV. Diverse dimensiuni disponibile.",
        image: "/products/fonduri/regio-1.png",
        price: 290,
        category: "Programe Regionale",
        tags: ["prnordvest", "panou", "temporar", "eu"],
        program: "PR Nord-Vest 2021-2027"
    },
    {
        id: "panou-temporar-pr-centru",
        slug: "panou-temporar-pr-centru",
        title: "Panou Temporar PR Centru 2021-2027",
        description: "Panou temporar de șantier pentru proiecte PR Centru 2021-2027. Material rezistent la exterior, print UV. Diverse dimensiuni disponibile.",
        image: "/products/fonduri/regio-1.png",
        price: 290,
        category: "Programe Regionale",
        tags: ["prcentru", "panou", "temporar", "eu"],
        program: "PR Centru 2021-2027"
    },
    {
        id: "panou-temporar-pr-bucuresti-ilfov",
        slug: "panou-temporar-pr-bucuresti-ilfov",
        title: "Panou Temporar PR București-Ilfov 2021-2027",
        description: "Panou temporar de șantier pentru proiecte PR București-Ilfov 2021-2027. Material rezistent la exterior, print UV. Diverse dimensiuni disponibile.",
        image: "/products/fonduri/regio-1.png",
        price: 290,
        category: "Programe Regionale",
        tags: ["prbucurestiilfov", "panou", "temporar", "eu"],
        program: "PR București-Ilfov 2021-2027"
    },
    {
        id: "panou-temporar-afir-dr-30",
        slug: "panou-temporar-afir-dr-30",
        title: "Panou Temporar AFIR - DR-30 Tânărul Fermier",
        description: "Panou temporar de șantier pentru proiecte AFIR - DR-30 Tânărul Fermier. Material rezistent la exterior, print UV. Diverse dimensiuni disponibile.",
        image: "/products/fonduri/AFIR_PLACUTA_FEADR-2024dr.jpg",
        price: 290,
        category: "Agricultură",
        tags: ["afirdr30", "panou", "temporar", "eu"],
        program: "AFIR - DR-30 Tânărul Fermier"
    },
    {
        id: "panou-temporar-afir-dr-22",
        slug: "panou-temporar-afir-dr-22",
        title: "Panou Temporar AFIR - DR-22 Investiții",
        description: "Panou temporar de șantier pentru proiecte AFIR - DR-22 Investiții. Material rezistent la exterior, print UV. Diverse dimensiuni disponibile.",
        image: "/products/fonduri/AFIR_PLACUTA_FEADR-2024dr.jpg",
        price: 290,
        category: "Agricultură",
        tags: ["afirdr22", "panou", "temporar", "eu"],
        program: "AFIR - DR-22 Investiții"
    },
    {
        id: "panou-temporar-afir-dr-27",
        slug: "panou-temporar-afir-dr-27",
        title: "Panou Temporar AFIR - DR-27 Infrastructură",
        description: "Panou temporar de șantier pentru proiecte AFIR - DR-27 Infrastructură. Material rezistent la exterior, print UV. Diverse dimensiuni disponibile.",
        image: "/products/fonduri/AFIR_PLACUTA_FEADR-2024dr.jpg",
        price: 290,
        category: "Agricultură",
        tags: ["afirdr27", "panou", "temporar", "eu"],
        program: "AFIR - DR-27 Infrastructură"
    },
    {
        id: "panou-temporar-mipe-digitalizare",
        slug: "panou-temporar-mipe-digitalizare",
        title: "Panou Temporar MIPE - Digitalizare IMM",
        description: "Panou temporar de șantier pentru proiecte MIPE - Digitalizare IMM. Material rezistent la exterior, print UV. Diverse dimensiuni disponibile.",
        image: "/products/fonduri/pachet-complet-pnrr-comununicate-de-presa-plus-pachet-print-identitate-vizuala.png",
        price: 290,
        category: "Digitalizare",
        tags: ["mipedigitalizare", "panou", "temporar", "eu"],
        program: "MIPE - Digitalizare IMM"
    },
    {
        id: "panou-temporar-adr-digitalizare-admin",
        slug: "panou-temporar-adr-digitalizare-admin",
        title: "Panou Temporar ADR - Digitalizare Administrație",
        description: "Panou temporar de șantier pentru proiecte ADR - Digitalizare Administrație. Material rezistent la exterior, print UV. Diverse dimensiuni disponibile.",
        image: "/products/fonduri/pachet-complet-pnrr-comununicate-de-presa-plus-pachet-print-identitate-vizuala.png",
        price: 290,
        category: "Digitalizare",
        tags: ["adrdigitalizareadmin", "panou", "temporar", "eu"],
        program: "ADR - Digitalizare Administrație"
    },
    {
        id: "panou-temporar-adr-smart-city",
        slug: "panou-temporar-adr-smart-city",
        title: "Panou Temporar ADR - Smart City",
        description: "Panou temporar de șantier pentru proiecte ADR - Smart City. Material rezistent la exterior, print UV. Diverse dimensiuni disponibile.",
        image: "/products/fonduri/pachet-complet-pnrr-comununicate-de-presa-plus-pachet-print-identitate-vizuala.png",
        price: 290,
        category: "Smart City",
        tags: ["adrsmartcity", "panou", "temporar", "eu"],
        program: "ADR - Smart City"
    },
    {
        id: "panou-temporar-adr-imm",
        slug: "panou-temporar-adr-imm",
        title: "Panou Temporar ADR - Dezvoltare IMM",
        description: "Panou temporar de șantier pentru proiecte ADR - Dezvoltare IMM. Material rezistent la exterior, print UV. Diverse dimensiuni disponibile.",
        image: "/products/fonduri/pachet-complet-pnrr-comununicate-de-presa-plus-pachet-print-identitate-vizuala.png",
        price: 290,
        category: "Dezvoltare IMM",
        tags: ["adrimm", "panou", "temporar", "eu"],
        program: "ADR - Dezvoltare IMM"
    },
];
