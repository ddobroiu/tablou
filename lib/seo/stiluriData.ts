export interface StyleData {
    id: string;
    slug: string;
    name: string;
    title: string;
    description: string;
    longDescription: string;
    keyElements: string[];
    matchingSpaces: string[];
    relatedProductId: string;
    image: string;
}

export const STILURI_DATA: StyleData[] = [
    {
        id: 'minimalist',
        slug: 'design-minimalist',
        name: 'Design Minimalist',
        title: 'Print în Stil Minimalist - Design Modern și Curat',
        description: 'Esențialul transformat în artă. Culori neutre și linii fine pentru spații aerisite.',
        longDescription: 'Designul minimalist se concentrează pe conceptul "less is more". Folosind o paletă de culori restrânsă și compoziții echilibrate, produsele noastre în stil minimalist sunt ideale pentru interioarele contemporane care respiră liniște și ordine. Printurile pe canvas sau posterele minimaliste transformă orice perete într-o declarație de rafinament.',
        keyElements: [
            'Paletă de culori neutră (Alb, Negru, Bej)',
            'Tipografie curată și spațiată',
            'Compoziții asimetrice echilibrate',
            'Focus pe un singur element central'
        ],
        matchingSpaces: ['Birouri IT', 'Apartamente moderne', 'Showroom-uri', 'Zone de recepție'],
        relatedProductId: 'canvas',
        image: '/products/canvas/canvas-1.webp'
    },
    {
        id: 'retro-vintage',
        slug: 'design-retro-vintage',
        name: 'Retro / Vintage',
        title: 'Print Stil Retro și Vintage - Nostalgie și Căldură',
        description: 'Adu farmecul epocilor trecute în prezent cu printuri texturate și culori calde.',
        longDescription: 'Stilul retro și vintage celebrează estetica deceniilor trecute. Cu texturi ce imită patina timpului, culori saturate dar "arse" de soare și grafică inspirată din afișele publicitare vechi, acest stil adaugă personalitate și o notă de nostalgie oricărui proiect de decorare sau branding.',
        keyElements: [
            'Texturi de uzură și granulație foto',
            'Culori calde (Ocru, Cafeniu, Roșu stins)',
            'Ilustrații hand-drawn și logo-uri clasice',
            'Fonturi serif cu personalitate'
        ],
        matchingSpaces: ['Cafenele concept', 'Barbershop-uri', 'Restaurante tradiționale', 'Locuințe boeme'],
        relatedProductId: 'tricouri',
        image: '/products/master/tricouri-personalizate-bumbac-print-digital-online.png'
    },
    {
        id: 'industrial',
        slug: 'stil-industrial',
        name: 'Stil Industrial',
        title: 'Decor și Print în Stil Industrial - Brut și Autentic',
        description: 'Inspirat din mansardele New Yorkeze: metal, beton și texturi brute.',
        longDescription: 'Stilul industrial este definit de expunerea materialelor brute și a elementelor structurale. Printurile noastre pe suporturi rigide (Alucobond, Plexiglass) cu grafică tehnică sau hărți urbane sunt perfecte pentru spații cu pereți din cărămidă aparentă sau beton, oferind un look modern, nefinisat dar extrem de stilat.',
        keyElements: [
            'Contrast ridicat și tonuri metalice',
            'Grafică inspirată din blueprint-uri și scheme',
            'Montaj cu distanțieri metalici vizibili',
            'Utilizarea materialelor rigide (Sandwich Aluminiu)'
        ],
        matchingSpaces: ['Hub-uri creative', 'Loft-uri', 'Garaje auto premium', 'Spații Co-working'],
        relatedProductId: 'alucobond',
        image: '/products/materiale/alucobond/alucobond-1.webp'
    },
    {
        id: 'motivator',
        slug: 'design-motivator',
        name: 'Design Motivator',
        title: 'Print Motivator pentru Succes - Energie și Inspirație',
        description: 'Puterea cuvintelor transformată în vizual. Ideal pentru birouri de performanță și săli de sport.',
        longDescription: 'Mediul în care lucrezi sau te antrenezi îți influențează direct starea de spirit. Designul motivator folosește citate puternice, imagini cu peisaje de vis sau sportivi de performanță pentru a menține focusul și energia la cote maxime. Perfect pentru canvas-uri mari în săli de ședințe sau postere în zone de fitness.',
        keyElements: [
            'Citate inspiraționale cu impact vizual',
            'Imagini landcape sau abstracte dinamice',
            'Tipografie bold, impunătoare',
            'Culori care transmit energie (Verde, Portocaliu)'
        ],
        matchingSpaces: ['Săli de fitness', 'Săli de conferințe', 'Startups', 'Camere de studiu'],
        relatedProductId: 'canvas',
        image: '/products/canvas/canvas-1.webp'
    },
    {
        id: 'abstract',
        slug: 'design-abstract',
        name: 'Design Abstract',
        title: 'Artă Abstractă pe Canvas - Explozie de Culoare și Formă',
        description: 'Dincolo de figurativ. Imagini care stimulează imaginația și completează decorul.',
        longDescription: 'Arta abstractă nu are nevoie de explicații, ci de simțire. Printurile noastre abstracte folosesc forme geometrice, pete de culoare și texturi digitale pentru a crea puncte focale spectaculoase în orice încăpere. Ideal pentru cei care doresc un decor unic, care să nu distragă atenția dar să adauge valoare estetică imensă.',
        keyElements: [
            'Explozii de culori complementare',
            'Geometrie sacră și forme libere',
            'Echilibru vizual non-figurativ',
            'Print pe pânză canvas mată'
        ],
        matchingSpaces: ['Living-uri moderne', 'Hoteluri de lux', 'Cabinete private', 'Coridoare lungi'],
        relatedProductId: 'canvas',
        image: '/products/canvas/canvas-1.webp'
    }
];
