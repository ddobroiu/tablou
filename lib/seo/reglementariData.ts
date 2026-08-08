export interface RegulatoryData {
    id: string;
    slug: string;
    name: string;
    lawReference: string; // The specific law (e.g. HG 971/2006)
    title: string;
    description: string;
    longDescription: string;
    requirements: string[];
    standardSpecs: string[];
    relatedProductId: string;
    image: string;
}

export const REGLEMENTARI_DATA: RegulatoryData[] = [
    {
        id: 'ssm',
        slug: 'panouri-ssm-protectia-muncii',
        name: 'Panouri SSM (Protecția Muncii)',
        lawReference: 'HG 971/2006',
        title: 'Panouri și Indicatoare SSM Obligatorii - Protecția Muncii',
        description: 'Seturi complete de indicatoare de securitate conform normelor europene.',
        longDescription: 'Conform Hotărârii de Guvern nr. 971/2006, orice spațiu de lucru trebuie semnalizat corespunzător pentru a preveni accidentele. Producem indicatoare SSM pe suport rigid (PVC) sau autocolant, folosind culorile și simbolurile standardizate (galben pentru avertizare, roșu pentru interdicție, albastru pentru obligativitate).',
        requirements: [
            'Simboluri grafice standardizate ISO',
            'Vizibilitate sporită de la distanță',
            'Rezistență la praf și umiditate',
            'Materiale ignifuge conform normelor ISU'
        ],
        standardSpecs: [
            'Suport: PVC 3mm sau Autocolant',
            'Dimensiuni: A4 (20x30cm), A3 (30x40cm) sau Custom',
            'Cerneală: Rezistentă la decolorare chimică',
            'Montaj: Bandă dublu-adezivă inclusă'
        ],
        relatedProductId: 'pvc-forex',
        image: '/products/materiale/pvc-forex/pvc-forex-1.webp'
    },
    {
        id: 'isu-urgenta',
        slug: 'semnalistica-urgenta-isu',
        name: 'Semnalistică de Urgență (ISU)',
        lawReference: 'Legea 307/2006 (ISU)',
        title: 'Indicatoare de Urgență, Evacuare și Ieșire (Fosforescente)',
        description: 'Semnalizări fotoluminescente vizibile în întuneric total pentru evacuare sigură.',
        longDescription: 'Siguranța la incendiu (ISU) impune folosirea semnalizărilor fotoluminescente pentru căile de evacuare. Acestea se încarcă de la lumina ambientală și strălucesc intens în caz de pană de curent sau fum dens, ghidând personalul către cea mai apropiată ieșire.',
        requirements: [
            'Material fotoluminiscent (strălucește în întuneric)',
            'Montaj obligatoriu la înălțimea de 1.5 - 2m',
            'Săgeți de direcționare stânga/dreapta clear',
            'Identificarea punctelor de hidratare și stingătoare'
        ],
        standardSpecs: [
            'Material: PVC Fotoluminiscent 1mm',
            'Autonomie: Până la 8-12 ore în întuneric',
            'Standard: Respectă normele de siguranță ISU',
            'Vizibilitate: Minim 10 metri'
        ],
        relatedProductId: 'pvc-forex',
        image: '/products/materiale/pvc-forex/pvc-forex-1.webp'
    },
    {
        id: 'panou-santier',
        slug: 'panou-identificare-santier-pds',
        name: 'Panou de Șantier (PDS)',
        lawReference: 'Legea 50/1991',
        title: 'Panou de Identificare a Investiției (PDS) - Obligatoriu Șantier',
        description: 'Afișaj obligatoriu la orice punct de lucru cu autorizație de construire.',
        longDescription: 'Orice derulare de lucrări de construcții sau renovări impune afișarea unui Panou de Identificare a Șantierului (PDS). Acesta trebuie să conțină date despre beneficiar, proiectant, constructor și termenele de execuție, fiind verificat constant de autoritățile de control (ISC).',
        requirements: [
            'Dimensiune minimă obligatorie 90x60cm',
            'Datele beneficiarului și ale constructorului',
            'Numărul autorizației de construire',
            'Termenul de începere și finalizare'
        ],
        standardSpecs: [
            'Suport: PVC 5mm sau Banner rezistent',
            'Rezistență: 100% Outdoor (UV, Vânt)',
            'Format: Standard PDS legal',
            'Livrări: Disponibil cu printare date incluse'
        ],
        relatedProductId: 'banner',
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'identificare-cladiri',
        slug: 'placute-identificare-cladiri',
        name: 'Plăcuțe Identificare Clădiri',
        lawReference: 'Reglementări Locale / Primării',
        title: 'Plăcuțe Număr Casă și Identificare Sediu Firmă',
        description: 'Numere de imobil și plăci profesionale pentru fațade clădiri rezidențiale sau birouri.',
        longDescription: 'Identificarea clară a clădirilor este esențială pentru logistică, servicii de urgență și aspectul urbanistic. Realizăm plăcuțe de număr casă și identificare sediu din materiale premium (Alucobond, Plexiglass, PVC) care rezistă zeci de ani expuse direct la exterior.',
        requirements: [
            'Design elegant și lizibilitate maximă',
            'Rezistență la coroziune și intemperii',
            'Disponibilitate pe culori variate (auriu, satin)',
            'Sisteme de prindere decorative'
        ],
        standardSpecs: [
            'Bază: Alucobond (Sandwich Aluminiu) 3mm',
            'Grafică: Print UV direct pe substrat',
            'Garanție: Minim 5 ani la exterior',
            'Accesorii: Distanțieri metalici opționali'
        ],
        relatedProductId: 'alucobond',
        image: '/products/materiale/alucobond/alucobond-1.webp'
    }
];
