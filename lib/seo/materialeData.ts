export interface MaterialData {
    id: string;
    slug: string;
    name: string;
    title: string;
    description: string;
    longDescription: string;
    benefits: string[];
    technicalSpecs: { label: string; value: string }[];
    idealFor: string[];
    relatedProductId: string; // The base configurator to link to
    image: string;
}

export const MATERIALE_DATA: MaterialData[] = [
    {
        id: 'mesh',
        slug: 'banner-mesh',
        name: 'Banner Mesh (Perforat)',
        title: 'Print Banner Mesh Personalizat - Rezistent la Vânt',
        description: 'Ideal pentru suprafețe mari expuse la vânt: clădiri, garduri, schele.',
        longDescription: 'Bannerul Mesh este un material special perforat care permite trecerea aerului, prevenind efectul de velă. Este soluția standard pentru reclamele de mari dimensiuni (mash-uri) montate pe fațadele clădirilor sau în zone cu curenți de aer puternici.',
        benefits: [
            'Permite trecerea aerului și luminii',
            'Greutate redusă față de bannerul clasic',
            'Rezistență ridicată la rupere și intemperii',
            'Print UV de înaltă rezoluție'
        ],
        technicalSpecs: [
            { label: 'Greutate', value: '270g - 340g / mp' },
            { label: 'Lățime maximă dintr-o bucată', value: '3.2 metri' },
            { label: 'Finisaj recomandat', value: 'Tiv perimetral și capse la 50cm' },
            { label: 'Durată viață exterior', value: '2-4 ani' }
        ],
        idealFor: ['Fațade clădiri', 'Schele șantier', 'Garduri perimetrale', 'Evenimente outdoor'],
        relatedProductId: 'banner',
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'sablat',
        slug: 'autocolant-sablat',
        name: 'Autocolant Sablat',
        title: 'Autocolant Sablat pentru Vitrine și Geamuri Birouri',
        description: 'Efect de sticlă mată pentru intimitate și design elegant în birouri.',
        longDescription: 'Autocolantul sablat (sau folia de sablare) transformă geamurile transparente în suprafețe mate, translucide. Acesta permite trecerea luminii, dar blochează vizibilitatea directă, fiind ideal pentru compartimentări de birouri, săli de ședință sau vitrine comerciale.',
        benefits: [
            'Oferă intimitate fără a bloca lumina naturală',
            'Aspect premium de sablare chimică a sticlei',
            'Poate fi decupat computerizat (logo-uri, dungi)',
            'Ușor de curățat și întreținut'
        ],
        technicalSpecs: [
            { label: 'Tip material', value: 'PVC polimeric/monomeric' },
            { label: 'Transmisie lumină', value: 'Aprox. 70%' },
            { label: 'Aplicare', value: 'Umedă sau uscată' },
            { label: 'Utilizare', value: 'Interior și Exterior' }
        ],
        idealFor: ['Săli de ședință', 'Cabinete medicale', 'Vitrine showroom', 'Decor locuințe'],
        relatedProductId: 'autocolante',
        image: '/products/autocolante/autocolante-1.webp'
    },
    {
        id: 'frontlit',
        slug: 'banner-frontlit',
        name: 'Banner Frontlit (Standard)',
        title: 'Print Banner Frontlit Premium - Mat sau Lucios',
        description: 'Cel mai popular material pentru bannere de exterior și interior.',
        longDescription: 'Bannerul frontlit este un material flexibil din PVC cu inserție de poliester, opac și foarte rezistent. Este materialul de bază pentru panouri publicitare, afișaj stradal și semnalistică temporară.',
        benefits: [
            'Raport calitate-preț imbatabil',
            'Redare excelentă a culorilor',
            'Rezistent la soare, ploaie și îngheț',
            'Versatil: se poate tăia, lipi sau capsă'
        ],
        technicalSpecs: [
            { label: 'Greutate standard', value: '440g - 510g / mp' },
            { label: 'Textură', value: 'Mată (anti-reflex) sau Lucioasă' },
            { label: 'Rezistență temperatură', value: '-20°C la +70°C' },
            { label: 'Lățime maximă rolă', value: '3.2 metri' }
        ],
        idealFor: ['Panouri stradale', 'Reclame gard', 'Cadru metalic', 'Backdrop eveniment'],
        relatedProductId: 'banner',
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'blueback',
        slug: 'hartie-blueback',
        name: 'Hârtie Blueback',
        title: 'Print Afișe Blueback pentru Panotaj Stradal (Billboard)',
        description: 'Hârtie specială pentru afișaj exterior, rezistentă la apă și adezivi.',
        longDescription: 'Hârtia Blueback este un suport de print optimizat pentru billboard-uri și afișaj stradal pe panouri rigide. Spatele de culoare albastră previne transparența, astfel încât noul afiș să poată fi aplicat peste unul vechi fără a se vedea grafica anterioară.',
        benefits: [
            'Opacitate 100% datorită spatelui albastru',
            'Rezistență la umiditate și dilatare',
            'Prindere ușoară cu adeziv special de poster',
            'Cost foarte scăzut pentru campanii mari'
        ],
        technicalSpecs: [
            { label: 'Gramaj', value: '115g - 120g / mp' },
            { label: 'Aplicare', value: 'Cu adeziv tip pastă' },
            { label: 'Utilizare', value: 'Campanii outdoor pe termen scurt' },
            { label: 'Rezoluție print', value: 'Standard Billboard (360-720 dpi)' }
        ],
        idealFor: ['Panouri Billboard (4x3m)', 'Afișaj stradal temporar', 'Postere electorale', 'Panouri șantier'],
        relatedProductId: 'afise',
        image: '/products/afise/afise-1.webp'
    },
    {
        id: 'plexialb',
        slug: 'plexiglass-opal',
        name: 'Plexiglass Opal (Alb)',
        title: 'Placă Plexiglass Opal pentru Reclame Luminoase',
        description: 'Difuzie perfectă a luminii pentru firme și casete luminoase.',
        longDescription: 'Plexiglass-ul opal este o placă acrilică albă, semi-transparentă, special concepută pentru a difuza lumina în mod egal pe toată suprafața ei. Este materialul preferat pentru fețele casetelor luminoase și elementelor de signalistică interior.',
        benefits: [
            'Difuzie uniformă a LED-urilor fără puncte de lumină',
            'Rezistență UV (nu se îngălbenește)',
            'Poate fi debitat laser în orice formă',
            'Aspect lucios și elegant'
        ],
        technicalSpecs: [
            { label: 'Transmisie lumină', value: 'Aprox. 30% - 45%' },
            { label: 'Grosimi disponibile', value: '2mm - 10mm' },
            { label: 'Greutate', value: 'Jumătate din greutatea sticlei' },
            { label: 'Rezistență impact', value: 'De 10 ori mai mare decât sticla' }
        ],
        idealFor: ['Casete luminoase', 'Litere volumetrice', 'Logouri iluminate interior', 'Mobilier expozițional'],
        relatedProductId: 'plexiglass',
        image: '/products/materiale/plexiglass/plexiglass-1.webp'
    }
];
