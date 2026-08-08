export interface IndustryData {
    id: string;
    name: string;
    slug: string;
    title: string;
    description: string;
    longDescription: string;
    benefits: string[];
    recommendedProducts: string[]; // Slugs from configurators
    image: string;
}

export const INDUSTRIE_DATA: IndustryData[] = [
    {
        id: 'horeca',
        name: 'HoReCa (Restaurante, Cafenele, Hoteluri)',
        slug: 'horeca',
        title: 'Soluții de Print și Publicitate pentru HoReCa',
        description: 'Meniuri, bannere terasă, stickere vitrine și sisteme de afișaj special concepute pentru succesul afacerii tale în ospitalitate.',
        longDescription: 'Sectorul HoReCa necesită materiale publicitare de înaltă calitate care să reziste la trafic intens și intemperii (pentru terase). Tablou oferă soluții complete, de la meniuri personalizate și note de plată, până la bannere de mari dimensiuni și decoruri de interior cu tapet personalizat.',
        benefits: [
            'Materiale rezistente la apă și pete (pentru meniuri)',
            'Print UV cu culori vibrante pentru apetit vizual',
            'Livrare rapidă pentru lansări și evenimente',
            'Design grafic profesional la cerere'
        ],
        recommendedProducts: ['banner', 'pliante', 'tapet', 'autocolante'],
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'real-estate',
        name: 'Imobiliare (Real Estate)',
        slug: 'imobiliare',
        title: 'Printuri Publicitare pentru Agenții Imobiliare și Dezvoltatori',
        description: 'Bannere "De Vânzare", panouri de șantier, mesh-uri uriașe pentru clădiri și mape de prezentare premium.',
        longDescription: 'Vizibilitatea este cheia în imobiliare. Un banner bine plasat sau un mesh pe o clădire în construcție poate atrage sute de potențiali clienți. Tablou produce bannere rezistente la vânt și soare, ideale pentru expunere pe termen lung.',
        benefits: [
            'Mesh-uri rezistente la rafale de vânt',
            'Capse și tiv întărit inclus gratuit',
            'Panouri de șantier conforme cu legislația',
            'Mape de prezentare cu buzunar pentru contracte'
        ],
        recommendedProducts: ['banner', 'banner-verso', 'afise', 'rollup'],
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'medical',
        name: 'Sănătate și Farmacii (Medical)',
        slug: 'medical',
        title: 'Soluții de Semnalistică și Print pentru Clinici și Farmacii',
        description: 'Stickere informative, panouri de plexiglass, indicatoare direcționale și materiale de protecție personalizate.',
        longDescription: 'Clinicile medicale și farmaciile au nevoie de o comunicare clară și de un aspect profesional care să inspire încredere. Oferim sisteme de afișaj din plexiglass, colantări de geamuri cu folie sablată și stickere pentru distanțare sau informare.',
        benefits: [
            'Materiale ușor de dezinfectat (Plexiglass/PVC)',
            'Aspect premium care inspiră igienă și încredere',
            'Stickere pentru geamuri tip "One Way Vision"',
            'Sisteme de afișaj elegante pentru recepții'
        ],
        recommendedProducts: ['plexiglass', 'window-graphics', 'autocolante', 'pvc-forex'],
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'events',
        name: 'Organizare Evenimente și Târguri',
        slug: 'evenimente',
        title: 'Sisteme Expoziționale și Printuri pentru Evenimente',
        description: 'Roll-up-uri, pop-up walls, desk-uri promoționale și invitații premium pentru evenimente corporate sau private.',
        longDescription: 'Fie că participi la un târg internațional sau organizezi o lansare de produs, prezența ta trebuie să fie impecabilă. Tablou oferă sisteme retractabile portabile și printuri de mari dimensiuni cu montaj ușor.',
        benefits: [
            'Sisteme ușoare și portabile cu geantă inclusă',
            'Timp de producție record (24-48h)',
            'Print pe materiale "No-Curl" care nu se ondulează',
            'Personalizare 100% pe orice dimensiune'
        ],
        recommendedProducts: ['rollup', 'banner', 'canvas', 'afise'],
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'retail',
        name: 'Retail și Magazine',
        slug: 'retail',
        title: 'Publicitate în Punctul de Vânzare (POS) pentru Retail',
        description: 'Stickere de podea, decorarea vitrinelor, etichete de produs și panouri publicitare luminoase.',
        longDescription: 'Atrage clienții în magazin cu vitrine spectaculoase. Tablou oferă soluții de colantare integrală a vitrinelor, stickere promoționale temporare pentru reduceri și sisteme de afișaj indoor din Forex sau Carton Plume.',
        benefits: [
            'Stickere de podea cu laminare anti-derapantă',
            'Folie decorativă pentru vitrine cu tăiere pe contur',
            'Prețuri de volum pentru lanțuri de magazine',
            'Laminare UV pentru protecție împotriva zgârieturilor'
        ],
        recommendedProducts: ['autocolante', 'window-graphics', 'carton', 'pvc-forex'],
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'educatie',
        name: 'Educație (Școli, Universități, Grădinițe)',
        slug: 'educatie',
        title: 'Materiale Educaționale și Publicitare pentru Instituții de Învățământ',
        description: 'Panouri informative, bannere pentru festivități, diplome personalizate și materiale de branding pentru școli și universități.',
        longDescription: 'Instituțiile de învățământ au nevoie de materiale clare, colorate și durabile. De la bannere pentru zilele porților deschise, la panouri de orientare în campus, afișe motivaționale sau diplome premium – Tablou asigură calitate la prețuri accesibile pentru bugetele academice.',
        benefits: [
            'Prețuri speciale pentru comenzi instituționale și de volum',
            'Diplome și certificate imprimate pe carton premium 350g',
            'Bannere și pliante pentru zilele porților deschise',
            'Livrare coordonată conform calendarului școlar'
        ],
        recommendedProducts: ['afise', 'banner', 'pliante', 'carti-vizita'],
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'auto',
        name: 'Auto (Dealeri, Service-uri, Spălătorii)',
        slug: 'auto',
        title: 'Publicitate și Branding pentru Industria Auto',
        description: 'Stickere auto, bannere de showroom, decorare flotă, panouri de prețuri și materiale pentru promovarea afacerilor din industria auto.',
        longDescription: 'Un showroom auto bine branduit inspiră încredere și atrage cumpărători. Tablou oferă soluții complete de branding auto: de la wrapping parțial al mașinilor de serviciu, la bannere mari pentru fațadele showroom-urilor și stickere de preț pentru vehicule.',
        benefits: [
            'Folii auto premium rezistente la UV și spălătorii',
            'Bannere pentru showroom-uri rezistente 3-5 ani',
            'Stickere de preț și specificații tehnice',
            'Decorare flotă cu logo și date de contact'
        ],
        recommendedProducts: ['autocolante', 'banner', 'window-graphics', 'afise'],
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'sport',
        name: 'Sport și Fitness (Săli, Cluburi Sportive)',
        slug: 'sport',
        title: 'Publicitate pentru Săli de Sport, Fitness și Cluburi Sportive',
        description: 'Bannere de sponsorizare, numere de concurs, tricouri personalizate și materiale de branding pentru cluburi și competiții sportive.',
        longDescription: 'Brandingul unui club sportiv sau al unui eveniment de competiție trebuie să transmită energie și profesionalism. Tablou produce bannere de sponsorizare, tricouri și șepci personalizate, numere de concurs rezistente la transpirație și intemperii, panouri de afișaj pentru rezultate.',
        benefits: [
            'Tricouri și șepci personalizate prin transfer termic sau serigrafie',
            'Bannere de start/finish rezistente la intemperii',
            'Numere de concurs din materiale rigide sau textile',
            'Print pe mesh pentru ventilație la bannere de tribune'
        ],
        recommendedProducts: ['banner', 'autocolante', 'rollup', 'afise'],
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'constructii',
        name: 'Construcții și Arhitectură',
        slug: 'constructii',
        title: 'Panouri de Șantier și Materiale Publicitare pentru Construcții',
        description: 'Mesh-uri uriașe pentru clădiri în construcție, panouri de șantier legale, indicatoare de siguranță și materiale de prezentare a proiectelor.',
        longDescription: 'Un șantier activ este și un spațiu publicitar excelent. Tablou furnizează oricât de mari panouri de protecție/publicitate din mesh rezistent la vânt, indicatoare de siguranță conforme ISCIR și materiale de prezentare pentru viitorii cumpărători sau investitori.',
        benefits: [
            'Mesh rezistent la vânt cu densitate 65-260 g/m²',
            'Panouri de șantier conforme legislației în vigoare',
            'Indicatoare de siguranță cerințe SSM & PSI',
            'Vizualizări 3D imprimate pentru prezentarea proiectelor'
        ],
        recommendedProducts: ['banner', 'banner-verso', 'autocolante', 'afise'],
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'beauty',
        name: 'Beauty & Wellness (Saloane, SPA, Clinici Estetice)',
        slug: 'beauty',
        title: 'Materiale de Marketing pentru Saloane de Înfrumusețare și SPA',
        description: 'Rollup-uri elegante, pliante de servicii, carduri cadou și decorarea vitrinelor pentru saloane de înfrumusețare, SPA și clinici estetice.',
        longDescription: 'În industria beauty, prima impresie este totul. Materialele tale de marketing trebuie să reflecte aceleași standarde de eleganță și rafinament pe care le oferi clienților. Tablou creează rollup-uri premium, pliante cu finisaje de lux (laminare soft-touch, folie UV) și carduri cadou care fac diferența.',
        benefits: [
            'Laminare Soft-Touch și folie UV pentru efecte premium',
            'Carduri cadou tipărite pe plastic sau carton 400g',
            'Pliante de servicii cu prețuri pe carton lucios',
            'Rollup-uri portabile pentru participarea la târguri de beauty'
        ],
        recommendedProducts: ['rollup', 'pliante', 'carti-vizita', 'afise'],
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'alimentar',
        name: 'Alimentar și Food (Magazine, Brutării, Patiserii)',
        slug: 'alimentar',
        title: 'Materiale Publicitare pentru Industria Alimentară',
        description: 'Etichete de produse, bannere promoționale, meniuri și decorarea vitrinelor pentru magazine alimentare, brutării și patiserii.',
        longDescription: 'Atractivitatea vizuală este crucială în vânzarea produselor alimentare. Tablou produce etichete alimentare certificate, bannere pentru promoții sezoniere, tablouri canvas apetisante pentru decorarea spațiului și meniuri din materiale rezistente la manipulare frecventă.',
        benefits: [
            'Etichete alimentare cu certificare pentru contact indirect cu alimente',
            'Bannere promoționale sezoniere cu tipar rapid 24h',
            'Meniuri din carton plastifiat rezistent la umiditate',
            'Decoruri de interior cu tablouri canvas apetisante'
        ],
        recommendedProducts: ['autocolante', 'pliante', 'banner', 'canvas'],
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'ong',
        name: 'ONG-uri, Fundații și Instituții Publice',
        slug: 'ong',
        title: 'Materiale de Comunicare pentru ONG-uri și Instituții',
        description: 'Materiale de campanie, bannere pentru strângere de fonduri, echipamente expoziționale și materiale informative pentru organizații non-profit.',
        longDescription: 'ONG-urile și instituțiile publice au nevoie de materiale de comunicare impactante, dar cu bugete adesea limitate. Tablou oferă prețuri speciale pentru organizații fără scop lucrativ și fonduri europene PNRR/AFIR, asigurând vizibilitate maximă cu costuri optimizate.',
        benefits: [
            'Prețuri speciale pentru organizații non-profit',
            'Materiale conforme cerințelor AFIR, PNRR și Regio',
            'Bannere informative pentru campanii sociale',
            'Kituri complete de comunicare pentru proiecte europene'
        ],
        recommendedProducts: ['banner', 'afise', 'rollup', 'pliante'],
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'turism',
        name: 'Turism și Agenții de Turism',
        slug: 'turism',
        title: 'Materiale Turistice și Publicitare pentru Agenții de Turism',
        description: 'Pliante de destinații, rollup-uri pentru bookingfair, bannere de hoteluri și materiale de prezentare pentru locații turistice.',
        longDescription: 'Industria turismului concurează vizual în fiecare punct de vânzare. Fie că ești o pensiune montană sau o agenție de turism națională, materialele de promovare trebuie să transpună experiența pe hârtie. Tablou produce pliante de călătorie, rollup-uri pentru târguri și bannere mari pentru locații.',
        benefits: [
            'Pliante pliabile complex (triunghi, acordeon) pentru destinații',
            'Canvas foto din locații turistice pentru decorarea spațiilor',
            'Rollup-uri pentru participarea la WorldTravel Market și ITB',
            'Hărți și ghiduri turistice tipărite în tiraje mari'
        ],
        recommendedProducts: ['pliante', 'flayere', 'rollup', 'canvas'],
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'it-startup',
        name: 'IT, Tech și Startup-uri',
        slug: 'it-startup',
        title: 'Branding și Print pentru Companii IT și Startup-uri',
        description: 'Materiale minimaliste de branding, merchandise personalizat, standuri de conferință și materiale de prezentare pentru companii tech.',
        longDescription: 'Startup-urile și companiile tech au nevoie de un branding coerent și modern care să impresioneze investitorii și clienții. Tablou produce rollup-uri pentru conferințe, merchandise de echipă (tricouri, șepci, agende) și prezentări premium pentru pitch-uri.',
        benefits: [
            'Design modern și minimalist conform trendurilor tech',
            'Merchandise personalizat pentru team building-uri',
            'Materiale de prezentare premium pentru investitori',
            'Rollup-uri și standuri pentru conferințe și hackathoane'
        ],
        recommendedProducts: ['rollup', 'carti-vizita', 'afise', 'banner'],
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'fonduri-europene',
        name: 'Fonduri Europene (PNRR, AFIR, Regio)',
        slug: 'fonduri-europene',
        title: 'Materiale Obligatorii pentru Proiecte cu Fonduri Europene',
        description: 'Panouri informative, autocolante și bannere obligatorii conform cerințelor PNRR, AFIR, Regio și alte programe de finanțare europeană.',
        longDescription: 'Proiectele finanțate din fonduri europene au obligații clare de vizibilitate: panouri informative la locul implementării, autocolante explicative și materiale de comunicare conforme ghidurilor Comisiei Europene. Tablou cunoaște toate cerințele și produce materiale conforme de la prima comandă.',
        benefits: [
            'Conformitate garantată cu ghidurile de vizibilitate UE',
            'Modele pre-aprobate de AFIR, PNRR și AM Regio',
            'Panou informativ rezistent 5+ ani la intemperii',
            'Livrat cu documentația de conformitate pentru dosarul tehnic'
        ],
        recommendedProducts: ['banner', 'autocolante', 'afise', 'pliante'],
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'agricultura',
        name: 'Agricultură și Ferme',
        slug: 'agricultura',
        title: 'Soluții de Print pentru Agricultură și Ferme',
        description: 'Panouri de identificare tarle, etichete saci semințe, bannere pentru silozuri și semnalistică de fermă.',
        longDescription: 'Agricultura modernă are nevoie de identificare clară și branding. Tablou produce bannere mari pentru silozuri, panouri rezistente la intemperii pentru marcarea terenurilor și etichete durabile pentru produse agroalimentare.',
        benefits: [
            'Materiale rezistente la soare și ploaie (protecție UV)',
            'Panouri de identificare conform normelor APIA',
            'Etichete pentru saci și ambalaje rezistente la umiditate',
            'Sisteme de afișaj pentru puncte de vânzare la poarta fermei'
        ],
        recommendedProducts: ['banner', 'pvc-forex', 'autocolante', 'afise'],
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'logistica',
        name: 'Transport și Logistică',
        slug: 'logistica',
        title: 'Semnalistică Depozite și Branding Flotă Logistică',
        description: 'Stickere pentru camioane, panouri de protecția muncii, semnalistică pentru rafturi și depozite.',
        longDescription: 'Eficiența în logistică pleacă de la o semnalizare corectă. Realizăm marcaje de podea rezistente la stivuitoare, panouri de orientare în depozit și branding complet pentru flote auto prin autocolante auto de înaltă calitate.',
        benefits: [
            'Marcaje de podea ultra-rezistente cu laminare brută',
            'Stickere auto rezistente la spălări repetate',
            'Panouri de protecția muncii (SSM) și PSI',
            'Sisteme de numerotare rafturi și zone logistice'
        ],
        recommendedProducts: ['autocolante', 'pvc-forex', 'banner', 'afise'],
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'pet-shop',
        name: 'Pet Shops și Cabinete Veterinare',
        slug: 'pet-shop',
        title: 'Publicitate pentru Pet Shops și Servicii Veterinare',
        description: 'Decorare vitrine cu animale, etichete rafturi, tablouri canvas cu pacienți fericiți și cărți de vizită.',
        longDescription: 'Creează o atmosferă prietenoasă în cabinetul tău veterinar sau pet shop. Oferim soluții de colantare vitrine cu imagini de înaltă rezoluție, tablouri canvas pentru decor interior și materiale promoționale pentru posesorii de animale.',
        benefits: [
            'Colantări vitrine cu imagini calde și primitoare',
            'Tablouri canvas personalizate pentru decor cabinet',
            'Carduri de fidelitate și programări premium',
            'Bannere promoționale pentru oferte sezoniere'
        ],
        recommendedProducts: ['window-graphics', 'canvas', 'carti-vizita', 'pliante'],
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'servicii-profesionale',
        name: 'Servicii Profesionale (Avocați, Contabili, Consultanți)',
        slug: 'servicii-profesionale',
        title: 'Materiale de Branding pentru Birouri de Avocatură și Consultanță',
        description: 'Plăcuțe de uși din plexiglass, mape de prezentare premium, cărți de vizită cu finisaje de lux.',
        longDescription: 'În serviciile profesionale, detaliile fac diferența. Oferim plăcuțe elegante din plexiglass pentru intrarea în sediu, mape de prezentare pentru documente oficiale și cărți de vizită care impun respect prin calitate și finisaj.',
        benefits: [
            'Plăcuțe gravate sau printate UV pe plexiglass/metal',
            'Mape de prezentare cu suport de CD/Card inclus',
            'Cărți de vizită pe cartoane speciale 400g+',
            'Sisteme de afișaj indoor minimaliste și sobre'
        ],
        recommendedProducts: ['plexiglass', 'carti-vizita', 'pliante', 'rollup'],
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'entertainment',
        name: 'Entertainment (Cluburi, Săli de Jocuri, Cinema)',
        slug: 'entertainment',
        title: 'Printuri de Mare Impact pentru Hub-uri de Distracție',
        description: 'Bannere mesh pentru fațade, afișe de eveniment neon, stickere fosforescente și panouri luminoase.',
        longDescription: 'Entertainment-ul trăiește prin impact vizual. Realizăm afișe de mari dimensiuni pentru concerte, autocolante pentru decorarea sălilor de jocuri și mesh-uri iluminate pentru fațadele cluburilor sau cinematografelor.',
        benefits: [
            'Culori neon și contrast ridicat pentru vizibilitate nocturnă',
            'Materiale rezistente la foc pentru interior (certificare B1)',
            'Print rapid 24h pentru evenimente de ultim moment',
            'Stickere personalizate pentru promoții și giveaway-uri'
        ],
        recommendedProducts: ['afise', 'banner', 'autocolante', 'window-graphics'],
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'home-garden',
        name: 'Grădinărit și Peisagistică',
        slug: 'home-garden',
        title: 'Branding pentru Companii de Peisagistică și Centre de Grădinărit',
        description: 'Etichete pentru plante, panouri informative de exterior, branding utilaje și flayere de servicii.',
        longDescription: 'Centrele de grădinărit au nevoie de semnalistică clară care să reziste la umiditate ridicată. Producem etichete de preț rezistente la apă, panouri de prezentare a proiectelor de amenajare și branding pentru mașinile de intervenție.',
        benefits: [
            'Etichete din plastic rezistente la apă și soare',
            'Pliante cu portofoliu de grădini amenajate',
            'Branding reflectorizant pentru utilaje de lucru',
            'Panouri informative pentru pepiniere și centre garden'
        ],
        recommendedProducts: ['autocolante', 'pliante', 'banner', 'pvc-forex'],
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'fashion',
        name: 'Modă și Textile (Fashion)',
        slug: 'fashion',
        title: 'Printuri de Calitate pentru Showroom-uri și Branduri de Modă',
        description: 'Lookbook-uri, decorare vitrine premium, etichete textile și sisteme de branding pentru industria fashion.',
        longDescription: 'Imaginea este esențială în fashion. Producem materiale care scot în evidență texturile și culorile colecțiilor tale: de la afișe HD pentru magazine, la colantări de vitrine cu folii speciale și lookbook-uri printate pe cartoane de lux.',
        benefits: [
            'Redare fidelă a culorilor (Color Matching)',
            'Finisaje de lux (laminare mată, emboss, lac selectiv)',
            'Sisteme de afișaj elegante tip "Light-box"',
            'Autocolante pentru vitrine cu tăiere computerizată'
        ],
        recommendedProducts: ['afise', 'window-graphics', 'carti-vizita', 'pliante'],
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'industrial',
        name: 'Industrial și Producție',
        slug: 'industrial',
        title: 'Semnalistică Industrială și Marcare Spații de Producție',
        description: 'Panouri de protecția muncii, marcaje utilaje, diagrame de flux și semnalistică pentru fabrici.',
        longDescription: 'Siguranța și organizarea sunt prioritare în mediul industrial. Tablou furnizează panouri rigide din PVC sau metal, marcaje reflectorizante pentru zone periculoase și instrucțiuni de utilizare a utilajelor rezistente la uleiuri și temperaturi.',
        benefits: [
            'Materiale ignifuge și rezistente chimic',
            'Marcaje reflectorizante de înaltă vizibilitate',
            'Panouri SSM/PSI conforme cu normele europene',
            'Print pe suporturi rigide (Alucobond, PVC)'
        ],
        recommendedProducts: ['pvc-forex', 'autocolante', 'banner', 'afise'],
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'banking',
        name: 'Bănci și Instituții Financiare',
        slug: 'banking',
        title: 'Sisteme de Afișaj și Branding pentru Sectorul Bancar',
        description: 'Display-uri de interior, panouri de curs valutar, stickere de securitate și materiale de promoție bancară.',
        longDescription: 'Instituțiile financiare necesită o prezentare sobră și profesională. Realizăm sisteme de afișaj din plexiglass pentru birourile de relații clienți, colantări de geamuri pentru intimitate și materiale de prezentare a ofertelor de creditare.',
        benefits: [
            'Sisteme de afișaj magnetice sau cu click pentru schimbarea rapidă a ofertelor',
            'Folie sablată ("Frosted") pentru confidențialitate pe geamuri',
            'Mape de prezentare și broșuri pe hârtie premium',
            'Stickere de securitate și informare reglementate'
        ],
        recommendedProducts: ['plexiglass', 'window-graphics', 'pliante', 'rollup'],
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'religious',
        name: 'Organizații Religioase și Comunități',
        slug: 'religios',
        title: 'Materiale de Informare și Branding pentru Lăcașuri de Cult',
        description: 'Bannere pentru hramuri, panouri de informare, cărți de rugăciuni și diplome onorifice.',
        longDescription: 'Sprijinim comunitățile religioase cu materiale de comunicare demne și accesibile. Realizăm bannere pentru sărbători mari, panouri de informare pentru enoriași și sisteme de afișaj pentru evenimente comunitare.',
        benefits: [
            'Prețuri adaptate pentru parohii și organizații non-profit',
            'Bannere mari pentru exterior rezistente la condiții meteo',
            'Diplome de ctitorie printate pe materiale speciale',
            'Pliante și broșuri cu grafică sobră'
        ],
        recommendedProducts: ['banner', 'afise', 'pliante', 'canvas'],
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'public-admin',
        name: 'Administrație Publică (Primării, Consilii)',
        slug: 'administratie-publica',
        title: 'Servicii de Print pentru Instituții Publice și Administrație locală',
        description: 'Panouri de investiții, hărți de oraș, sisteme de afișaj stradal și materiale pentru evenimente locale.',
        longDescription: 'Administrația publică are nevoie de comunicare transparentă și de materiale care să reziste în spațiul public. Realizăm panouri de investiții obligatorii, hărți turistice pentru panouri stradale și sisteme de afișaj pentru centre de relații cu cetățenii.',
        benefits: [
            'Certificări de calitate conforme cu cerințele de licitație',
            'Sisteme de afișaj anti-vandalism',
            'Panouri de șantier și investiții reglementate',
            'Hărți de mari dimensiuni pe suporturi durabile'
        ],
        recommendedProducts: ['pvc-forex', 'banner', 'afise', 'autocolante'],
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'interior-design',
        name: 'Design Interior și Arhitectură',
        slug: 'design-interior',
        title: 'Printuri Personalizate pentru Proiecte de Design și Arhitectură',
        description: 'Tapet personalizat, tablouri canvas de mari dimensiuni, panouri decorative și prezentări de proiect.',
        longDescription: 'Arhitecții și designerii de interior găsesc la noi partenerul ideal pentru personalizarea spațiilor. Realizăm tapet cu orice model la rezoluție fotografică, tablouri canvas pentru galerii de artă și panouri ornamentale din plexiglass sau Forex.',
        benefits: [
            'Tapet custom cu texturi variate (pânză, piele, nisip)',
            'Print pe pânză canvas de bumbac cu șasiu de lemn',
            'Panouri din plexiglass transparent sau colorat în masă',
            'Mostre de material gratuite pentru testarea culorilor'
        ],
        recommendedProducts: ['tapet', 'canvas', 'plexiglass', 'pvc-forex'],
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'ecommerce',
        name: 'E-commerce și Branduri Online',
        slug: 'ecommerce',
        title: 'Materiale de Branding pentru Magazine Online',
        description: 'Etichete pentru colete, "thank you cards", stickere pentru ambalaje și materiale promoționale.',
        longDescription: 'Un magazin online are nevoie de o experiență de "unboxing" memorabilă. Tablou produce "thank you cards" personalizate, stickere cu logo pentru sigilarea cutiilor și flyere promoționale pentru retenția clienților.',
        benefits: [
            'Etichete autocolante livrate la rolă sau în coală',
            'Thank you cards cu design premium și urări personalizate',
            'Flyere cu coduri de reducere pentru următoarea comandă',
            'Termene de livrare foarte scurte pentru campanii fulger'
        ],
        recommendedProducts: ['autocolante', 'flayere', 'pliante', 'carti-vizita'],
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'wedding',
        name: 'Nunți și Evenimente Festive',
        slug: 'nunti-evenimente',
        title: 'Printuri Festive: Nunți, Botezuri și Petreceri Private',
        description: 'Photo corners, floor stickers, invitații speciale și place cards personalizate.',
        longDescription: 'Transformă orice eveniment într-o amintire de neuitat. Realizăm fundaluri foto (photo corners) de mari dimensiuni, stickere de podea pentru ringul de dans, panouri de bun venit și invitații cu finisaje deosebite.',
        benefits: [
            'Design grafic personalizat conform tematicii evenimentului',
            'Stickere de podea care nu alunecă și nu lasă urme',
            'Panouri de bun venit pe suport rigid (Forex/Plexi)',
            'Mărturii și etichete personalizate pentru sticle'
        ],
        recommendedProducts: ['banner', 'autocolante', 'canvas', 'afise'],
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'reseller',
        name: 'Agenții de Publicitate și Reselleri',
        slug: 'reseller-white-label',
        title: 'Servicii de Print White-Label pentru Agenții și Reselleri',
        description: 'Parteneriat strategic pentru agenții: prețuri de producție, livrare neutră și control total de calitate.',
        longDescription: 'Ești agenție de publicitate sau broker de print? Primești acces la prețuri preferențiale de volum și livrare "white-label" direct la clienții tăi, fără datele noastre pe colet. Controlăm calitatea fiecărui print pentru ca brandul tău să strălucească.',
        benefits: [
            'Prețuri speciale de reseller negociate în funcție de volum',
            'Livrare neutră (fără branding Tablou pe ambalaj)',
            'Asistență tehnică dedicată pentru fișiere complexe',
            'Prioritate în fluxul de producție pentru termene strânse'
        ],
        recommendedProducts: ['banner', 'rollup', 'autocolante', 'afise'],
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'political',
        name: 'Campanii Politice și Alegeri',
        slug: 'campanii-politice',
        title: 'Materiale pentru Campanii Electorale și Informare Politică',
        description: 'Bannere stradale, pliante electorale, mesh-uri de mari dimensiuni și sisteme de afișaj.',
        longDescription: 'În campaniile electorale, viteza și vizibilitatea sunt lege. Tablou livrează volume uriașe de pliante, flyere și bannere stradale întrun timp record. Toate materialele sunt conforme cu legislația privind finanțarea campaniilor electorale.',
        benefits: [
            'Capacitate de producție pentru tiraje de milioane de pliante',
            'Livrare națională coordonată în toate orașele și comunele',
            'Bannere și mesh-uri cu certificate de conformitate',
            'Transparență totală în facturare pentru rapoartele AEP'
        ],
        recommendedProducts: ['pliante', 'banner', 'afise', 'flayere'],
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'cleaning',
        name: 'Servicii de Curățenie și Facility Management',
        slug: 'curatenie-mentenanta',
        title: 'Publicitate pentru Firme de Curățenie și Mentenanță',
        description: 'Branding uniforme, magnetici auto, pliante de servicii și stickere "spațiu igienizat".',
        longDescription: 'O firmă de curățenie trebuie să emane încredere și profesionalism. Realizăm stickere "Igienizat" pentru toalete sau spații publice, branding pentru mașinile de intervenție și pliante cu listele de prețuri pentru servicii rezidențiale sau corporate.',
        benefits: [
            'Stickere care se dezlipesc ușor fără a lăsa reziduuri',
            'Magnetici auto pentru branding temporar pe mașini',
            'Pliante cu tarife servicii pe hârtie lucioasă',
            'Ecusoane și branding pentru echipamentul de lucru'
        ],
        recommendedProducts: ['autocolante', 'pliante', 'carti-vizita', 'flayere'],
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'security',
        name: 'Securitate și Supraveghere',
        slug: 'securitate-paza',
        title: 'Elemente de Identitate Vizuală pentru Firme de Pază și Securitate',
        description: 'Stickere "Obiectiv Supravegheat", panouri metalice de avertizare, branding vehicule intervenție.',
        longDescription: 'Semnalizarea prezenței sistemelor de securitate este o metodă de prevenție. Producem stickere de înaltă rezistență pentru vitrine, panouri rezistente la intemperii pentru garduri și branding reflectorizant pentru mașinile de intervenție rapidă.',
        benefits: [
            'Stickere cu adeziv puternic pentru expunere outdoor',
            'Panouri din PVC sau aluminiu cu print UV durabil',
            'Branding auto cu folii reflectorizante 3M/Oracal',
            'Materiale conforme cu legea pazei și protecției'
        ],
        recommendedProducts: ['autocolante', 'pvc-forex', 'afise', 'banner'],
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'tattoo',
        name: 'Tatuaje și Body Art (Tattoo Studios)',
        slug: 'tatuaje-piercing',
        title: 'Semnalistică și Print pentru Saloane de Tatuaje',
        description: 'Stickere pentru vitrine, afișe de portofoliu, pânză canvas cu modele și cărți de vizită premium.',
        longDescription: 'Saloanele de tatuaje au nevoie de un branding vizual puternic și artistic. Oferim pânze canvas la rezoluție înaltă pentru expunerea modelelor proprii, folii sablate pentru intimitatea clienților în timpul procedurilor și roll-up-uri pentru convenții de tatuaje.',
        benefits: [
            'Print HD pe pânză canvas cu culori ultra-fidele',
            'Folie sablată pentru intimitate în zona de lucru',
            'Rollup-uri ușor de transportat la convenții',
            'Stickere cu tăiere pe contur pentru branding echipamente'
        ],
        recommendedProducts: ['canvas', 'window-graphics', 'rollup', 'autocolante'],
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'recrutare',
        name: 'Recrutare și HR (Agenții, Office)',
        slug: 'recrutare-hr',
        title: 'Materiale Publicitare pentru Agenții de Recrutare și HR',
        description: 'Bannere tip "Angajăm", roll-up-uri pentru târguri de joburi și sisteme de afișaj birou.',
        longDescription: 'Atrage talentele potrivite cu o prezență impecabilă. Producem roll-up-uri cu grafică curată pentru târguri de carieră, bannere de mari dimensiuni pentru campanii de recrutare masivă și materiale de birou personalizate pentru angajați.',
        benefits: [
            'Bannere de recrutare ultra-vizibile (mesh sau frontlit)',
            'Rollup-uri premium pentru târguri de cariere',
            'Pliante de prezentare beneficii angajați',
            'Sisteme de orientare (Wayfinding) în interiorul clădirilor de birouri'
        ],
        recommendedProducts: ['rollup', 'banner', 'pliante', 'afise'],
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'florarii',
        name: 'Florării și Industrii Creative',
        slug: 'florarii-cadouri',
        title: 'Etichete și Printuri pentru Florării și Magazine de Cadouri',
        description: 'Etichete pentru buchete, banderole personalizate, stickere de ambalaj și carduri cadou.',
        longDescription: 'Florăriile necesită o prezentare delicată și caldă. Producem etichete rezistente la umiditate pentru ghivece, banderole din hârtie fină pentru buchete și stickere cu logo pentru sigilarea ambalajelor elegante.',
        benefits: [
            'Etichete rezistente la apă și umiditate ridicată',
            'Stickere cu adeziv special pentru hârtie de ambalat',
            'Carduri de felicitare personalizate pe cartoane texturate',
            'Tablouri canvas cu decoruri florale pentru ambient'
        ],
        recommendedProducts: ['autocolante', 'carti-vizita', 'canvas', 'pliante'],
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'cofetarii',
        name: 'Cofetării, Patiserii și Simigerii',
        slug: 'cofetarii-patiserii',
        title: 'Soluții de Print pentru Cofetării și Laboratoare Deserturi',
        description: 'Meniuri vitrină, etichete preț, colantare vitrine cu deserturi apetisante și ambalaje.',
        longDescription: 'În cofetărie, aspectul vinde. Oferim printuri HD pentru vitrine care fac trecătorii să poftească, etichete de produs care respectă normele de siguranță și meniuri rezistente la manipulare.',
        benefits: [
            'Printuri apetisante cu culori "delicioase" pe vitrine',
            'Etichete de preț micuțe și elegante',
            'Sisteme de afișaj tip meniu-bord',
            'Tablouri de decor interior cu specific dulce'
        ],
        recommendedProducts: ['window-graphics', 'autocolante', 'canvas', 'pliante'],
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'veterinar',
        name: 'Veterinar și Farmacii Animale',
        slug: 'veterinar-medical',
        title: 'Semnalistică pentru Cabinete Veterinare și Farmacii Pet',
        description: 'Indicatoare "Urfgențe", plăcuțe plexiglass, stickere geam și fișe de observație.',
        longDescription: 'Clinicile veterinare au nevoie de un aspect profesional și curat. Realizăm plăcuțe de uși din plexiglass, panouri informative de interior și stickere de geam cu servicii medicale veterinare.',
        benefits: [
            'Materiale igienice și rezistente la dezinfectanți',
            'Plăcuțe plexiglass elegante pentru uși cabinet',
            'Sisteme de afișaj interschimbabile pentru orar',
            'Stickere cu recomandări post-operatorii'
        ],
        recommendedProducts: ['plexiglass', 'autocolante', 'window-graphics', 'carti-vizita'],
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'gaming',
        name: 'Gaming, E-sports și Săli PC',
        slug: 'gaming-esports',
        title: 'Branding pentru Săli de Gaming și Centre E-sports',
        description: 'Stickere unități PC, tapet tematic, roll-up-uri pentru turnee și afișe de mari dimensiuni.',
        longDescription: 'Sălile de gaming trăiesc prin atmosferă și iluminare. Realizăm tapet personalizat cu personaje din jocuri, stickere translucide pentru zonele RGB și elemente de branding pentru stațiile de joc.',
        benefits: [
            'Tapet personalizat cu grafică de jocuri video',
            'Stickere translucide pentru efecte de lumină',
            'Rollup-uri de dimensiuni mari pentru turnee',
            'Mesh-uri fațadă cu impact vizual deosebit'
        ],
        recommendedProducts: ['tapet', 'autocolante', 'rollup', 'afise'],
        image: '/products/banner/banner-1.webp'
    },
    {
        id: 'arhitectura',
        name: 'Arhitectură și Proiectare',
        slug: 'arhitectura-proiectare',
        title: 'Materiale de Prezentare pentru Birouri de Arhitectură',
        description: 'Panouri de proiecte, portofolii de lux, roll-up-uri pentru prezentări urbanistice.',
        longDescription: 'Arhitecții au nevoie de o precizie milimetrică a culorilor și detaliilor. Producem panouri de prezentare proiect pe suport rigid (PVC/Forex), flyere de lux pentru portofoliu și mape de prezentare elegante.',
        benefits: [
            'Precizie absolută a liniilor și textelor mici',
            'Panouri rigide pentru concursuri de arhitectură',
            'Printuri pe formate mari de tip planșă urbanistică',
            'Mapă de prezentare premium cu logo embosat'
        ],
        recommendedProducts: ['pvc-forex', 'pliante', 'rollup', 'carti-vizita'],
        image: '/products/banner/banner-1.webp'
    }
];
