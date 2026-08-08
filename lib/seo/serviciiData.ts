export interface ServiceData {
    id: string;
    slug: string;
    name: string;
    title: string;
    description: string;
    longDescription: string;
    benefits: string[];
    processSteps: { step: string; desc: string }[];
    idealFor: string[];
    relatedProductId: string;
    image: string;
}

export const SERVICII_DATA: ServiceData[] = [
    {
        id: 'taiere-contur',
        slug: 'taiere-pe-contur',
        name: 'Tăiere pe Contur (Cutter-Plotter)',
        title: 'Stickere cu Tăiere pe Contur Computerizată - Orice Formă',
        description: 'Decupăm autocolantele exact după forma design-ului tău, de la logo-uri la stickere auto.',
        longDescription: 'Tăierea pe contur (sau tăierea pe formă) se realizează cu ajutorul sistemelor de cutter-plotter de înaltă precizie. Această tehnologie permite decuparea autocolantelor imprimate după orice urmă vectorială, oferind libertate totală de design pentru stickere, logo-uri de fațadă sau elemente grafice complexe.',
        benefits: [
            'Precizie milimetrică a decupării',
            'Potrivit pentru orice formă geometrică sau neregulată',
            'Sistem de citire optică a markerelor de print',
            'Finisaj profesional fără margini albe inestetice'
        ],
        processSteps: [
            { step: 'Pregătire Fișier', desc: 'Crearea conturului vectorial (CutContour) în fișierul de design.' },
            { step: 'Printare', desc: 'Imprimarea graficii împreună cu semnele de potrivire optică.' },
            { step: 'Laminare', desc: 'Opțional, aplicarea foliei de protecție pentru durabilitate.' },
            { step: 'Tăiere Digitală', desc: 'Senzorul laser citește poziția și decupează materialul.' }
        ],
        idealFor: ['Stickere Logo', 'Etichete produs', 'Grafică pentru mașină', 'Decor vitrine'],
        relatedProductId: 'autocolante',
        image: '/products/autocolante/autocolante-1.webp'
    },
    {
        id: 'tiv-capse',
        slug: 'tiv-si-capse-bannere',
        name: 'Tiv și Capse (Gata de montaj)',
        title: 'Bannere Publicitare cu Tiv și Capse Perimetrale',
        description: 'Finisaj complet pentru instalare rapidă și rezistență sporită la tracțiune.',
        longDescription: 'Finisajul cu tiv și capse este standardul în producția de bannere outdoor. Tivul se realizează prin lipirea marginilor prin termosudură, dublând grosimea materialului în zona de prindere. Capsele galvanizate permit ancorarea bannerului cu șoricei sau sfoară pe garduri, fațade sau cadre metalice.',
        benefits: [
            'Rezistență maximă la solicitările vântului',
            'Aspect îngrijit și profesional al marginilor',
            'Montaj extrem de rapid și intuitiv',
            'Protecție împotriva deșirării materialului'
        ],
        processSteps: [
            { step: 'Printare Banner', desc: 'Imprimarea pe formatul brut (cu supra-măsură).' },
            { step: 'Termosudură', desc: 'Lipseala la cald a marginilor pentru formarea tivului.' },
            { step: 'Perforare', desc: 'Decuparea orificiilor pentru capse la distanțe egale.' },
            { step: 'Capsare', desc: 'Aplicarea inelelor metalice galvanizate de prindere.' }
        ],
        idealFor: ['Bannere stradale', 'Mesh-uri clădiri', 'Panouri gard', 'Backdrops evenimente'],
        relatedProductId: 'banner',
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'laminare',
        slug: 'laminare-printuri',
        name: 'Laminare Mată/Lucioasă',
        title: 'Laminare Profesională pentru Protecție UV și Mecanică',
        description: 'Crește durata de viață a printului și oferă un aspect premium lucios sau mat anti-reflex.',
        longDescription: 'Laminarea reprezintă aplicarea unei folii polimerice transparente peste suprafața printată. Aceasta îndeplinește două roluri cruciale: protejează cerneala împotriva zecuirii și degradării cauzate de razele UV și oferă o rezistență mecanică sporită la zgârieturi, praf sau umiditate.',
        benefits: [
            'Protecție UV - culorile rămân vii peste ani',
            'Rezistență mecanică la zgârieturi și frecare',
            'Efect vizual premium (Mat sau Lucios)',
            'Ușurează procesul de curățare al materialului'
        ],
        processSteps: [
            { step: 'Printare HD', desc: 'Imprimarea graficii pe materialul suport.' },
            { step: 'Uscare', desc: 'Așteptarea evaporării solventului pentru o aderență optimă.' },
            { step: 'Laminare la Rece', desc: 'Aplicarea foliei prin presiune cu ajutorul utilajului dedicat.' },
            { step: 'Finisare', desc: 'Tăierea finală la dimensiunea dorită.' }
        ],
        idealFor: ['Stickere auto', 'Meniuri restaurant', 'Semnalistică de mână', 'Vitrine comerciale'],
        relatedProductId: 'autocolante',
        image: '/products/autocolante/autocolante-1.webp'
    },
    {
        id: 'sisteme-prindere',
        slug: 'sisteme-prindere-si-montaj',
        name: 'Sisteme de Prindere',
        title: 'Sisteme de Montaj: Profile Aluminiu și Distanțieri Plexiglass',
        description: 'Soluții elegante pentru fixarea panourilor rigide și a signalisticii de birou.',
        longDescription: 'Modul în care este montat un panou face diferența între un proiect reușit și unul amator. Oferim distanțieri metalici (chrome, negri, satin) pentru plăci de plexiglass și profile tip "H" sau "U" din aluminiu pentru plăci de PVC sau Alucobond, asigurând un aspect modern și profesional.',
        benefits: [
            'Efect 3D spectaculos prin distanțare de perete',
            'Finisaje de lux (Inox, Aluminiu eloxat)',
            'Sisteme sigure care previn căderea accidentală',
            'Aspect curat și minimalist'
        ],
        processSteps: [
            { step: 'Măsurare', desc: 'Determinarea punctelor de prindere perimetrale.' },
            { step: 'Găurire CNC', desc: 'Perforarea placării rigide pentru potrivirea distanțierilor.' },
            { step: 'Fixare Perete', desc: 'Montarea bazei metalice pe suprafața suport.' },
            { step: 'Așezare Panou', desc: 'Fixarea finală a capetelor estetice ale sistemului.' }
        ],
        idealFor: ['Plăci sediu firmă', 'Meniuri perete', 'Panouri direcționale', 'Signalistică birouri'],
        relatedProductId: 'plexiglass',
        image: '/products/materiale/plexiglass/plexiglass-1.webp'
    }
];
