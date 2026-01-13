// lib/products/europosters.ts
import europostersProductsRaw from '../../public/posters/products-europosters.json';

export interface EuropostersVariant {
    type: 'afis' | 'canvas' | 'tapet' | 'autocolant';
    title: string; // Titlu specific variantei (ex: "Frați Pe Viață - Canvas")
    description: string; // Descriere specifică variantei
    slug: string;
    price: number;
    route: string;
    configurator: string;
}

export interface EuropostersBaseProduct {
    id: string;
    base_id: string;
    title: string; // Titlul de bază (fără "Afiș", "Canvas", etc.)
    original_name: string;
    description: string;
    image: string;
    category: string;
    subcategory: string;
    genre?: string;
    tags: string[];
    metadata: {
        seo_title: string;
        seo_description: string;
        alt_text: string;
        original_url: string;
        source_image: string;
        subcategoryLabel?: string;
        originalCategory?: string;
    };
    variants: EuropostersVariant[];
}

interface RawEuropostersProduct {
    id: string;
    base_id?: string;
    variant_type: 'afis' | 'canvas' | 'tapet' | 'autocolant';
    title: string;
    original_name: string;
    description: string;
    image: string;
    category: string;
    subcategory: string;
    genre?: string; // Added genre field
    price: number;
    currency: string;
    slug: string;
    route: string;
    configurator: string;
    tags: string[];
    metadata: {
        seo_title: string;
        seo_description: string;
        alt_text: string;
        original_url: string;
        source_image: string;
    };
    related_variants: Array<{
        type: string;
        slug: string;
    }>;
}

const rawProducts = europostersProductsRaw as RawEuropostersProduct[];

const PARENT_CATEGORY_MAP: Record<string, string> = {
    // === PERSONAJE & VEDETE (Divertisment, Idoli, Fantezie) ===
    'rihanna': 'Personaje & Vedete', 'lady-gaga': 'Personaje & Vedete', 'ariana-grande': 'Personaje & Vedete',
    'dua-lipa': 'Personaje & Vedete', 'stray-kids': 'Personaje & Vedete', 'taylor-swift': 'Personaje & Vedete',
    'queen': 'Personaje & Vedete', 'metallica': 'Personaje & Vedete', 'billie-eilish': 'Personaje & Vedete',
    'kurt-cobain': 'Personaje & Vedete', 'guns-n-roses': 'Personaje & Vedete', 'the-beatles': 'Personaje & Vedete',
    'michael-jackson': 'Personaje & Vedete', 'lana-del-rey': 'Personaje & Vedete', 'elvis-presley': 'Personaje & Vedete',
    'bts': 'Personaje & Vedete', 'blackpink': 'Personaje & Vedete', 'eminem': 'Personaje & Vedete',
    '2pac': 'Personaje & Vedete', 'bob-marley': 'Personaje & Vedete', 'david-bowie': 'Personaje & Vedete',
    'radiohead': 'Personaje & Vedete', 'travis-scott': 'Personaje & Vedete', 'ozzy-osbourne': 'Personaje & Vedete',
    'led-zeppelin': 'Personaje & Vedete', 'linkin-park': 'Personaje & Vedete', 'rocky': 'Personaje & Vedete',
    'sean-connery': 'Personaje & Vedete', 'che-guevara': 'Personaje & Vedete', 'audrey-hepburn': 'Personaje & Vedete',
    'celebrități': 'Personaje & Vedete', 'vedete': 'Personaje & Vedete', 'portrete-de-staruri-muzicale': 'Personaje & Vedete',
    'gaming': 'Personaje & Vedete', 'minecraft': 'Personaje & Vedete', 'fortnite': 'Personaje & Vedete',
    'elden-ring': 'Personaje & Vedete', 'godzilla': 'Personaje & Vedete', 'dragon-ball-z': 'Personaje & Vedete',
    'demon-slayer': 'Personaje & Vedete', 'jujutsu-kaisen': 'Personaje & Vedete', 'berserk': 'Personaje & Vedete',
    'sonic': 'Personaje & Vedete', 'dark-souls': 'Personaje & Vedete', 'god-of-war': 'Personaje & Vedete',
    'world-of-tanks': 'Personaje & Vedete', 'mortal-kombat': 'Personaje & Vedete', 'super-mario': 'Personaje & Vedete',
    'star-wars': 'Personaje & Vedete', 'stăpânul-inelelor': 'Personaje & Vedete', 'matrix': 'Personaje & Vedete',
    'harry-potter': 'Personaje & Vedete', 'game-of-thrones': 'Personaje & Vedete', 'one-piece': 'Personaje & Vedete',
    'naruto': 'Personaje & Vedete', 'studio-ghibli': 'Personaje & Vedete', 'disney': 'Personaje & Vedete',
    'marvel': 'Personaje & Vedete', 'dc-comics': 'Personaje & Vedete', 'pulp-fiction': 'Personaje & Vedete',
    'fight-club': 'Personaje & Vedete', 'stranger-things': 'Personaje & Vedete', 'breaking-bad': 'Personaje & Vedete',
    'filme-și-seriale-cult': 'Personaje & Vedete', 'filme-si-seriale': 'Personaje & Vedete', 'horror': 'Personaje & Vedete',
    'celebrities': 'Personaje & Vedete', 'fantezie-&-sci-fi': 'Personaje & Vedete', 'fantezie': 'Personaje & Vedete',
    'expresul-de-la-hogwarts': 'Personaje & Vedete', 'hobbit': 'Personaje & Vedete', 'hermione-granger': 'Personaje & Vedete',
    'animale-fantastice': 'Personaje & Vedete', 'vineri-13': 'Personaje & Vedete', 'matrix-reloaded': 'Personaje & Vedete',
    'alfred-hitchcock': 'Personaje & Vedete', 'frida-kahlo': 'Personaje & Vedete', 'portrete': 'Personaje & Vedete',

    // === SPORT & AUTO (Energie, Vitează, Mașini) ===
    'fotbal': 'Sport & Auto', 'sport': 'Sport & Auto', 'box': 'Sport & Auto',
    'rugby': 'Sport & Auto', 'baschet': 'Sport & Auto', 'tenis': 'Sport & Auto',
    'ciclism': 'Sport & Auto', 'golf': 'Sport & Auto', 'formula-1': 'Sport & Auto',
    'f1': 'Sport & Auto', 'porsche': 'Sport & Auto', 'ferrari': 'Sport & Auto',
    'lamborghini': 'Sport & Auto', 'bmw': 'Sport & Auto', 'mercedes': 'Sport & Auto',
    'vw-volkswagen': 'Sport & Auto', 'mașini': 'Sport & Auto', 'masini': 'Sport & Auto',
    'moto': 'Sport & Auto', 'motociclete': 'Sport & Auto', 'avioane': 'Sport & Auto',
    'ilustrații-sportive': 'Sport & Auto', 'curse-si-soferi-legendari': 'Sport & Auto',
    'trenuri': 'Sport & Auto', 'cycling': 'Sport & Auto', 'estetică-sportivă': 'Sport & Auto',
    'route-66': 'Sport & Auto', 'masini-de-epoca': 'Sport & Auto', 'curse': 'Sport & Auto',

    // === NATURĂ & ANIMALE (Faună, Peisaje, Cosmos) ===
    'safari': 'Natură & Animale', 'animale': 'Natură & Animale', 'nature': 'Natură & Animale',
    'peisaje': 'Natură & Animale', 'natură-&-peisaj': 'Natură & Animale', 'wildlife': 'Natură & Animale',
    'mare-și-plaje': 'Natură & Animale', 'ocean': 'Natură & Animale', 'paradis-tropical': 'Natură & Animale',
    'munți': 'Natură & Animale', 'răsărit-și-apus': 'Natură & Animale', 'copaci': 'Natură & Animale',
    'flori': 'Natură & Animale', 'plante': 'Natură & Animale', 'grădină': 'Natură & Animale',
    'caini': 'Natură & Animale', 'pisici': 'Natură & Animale', 'cai': 'Natură & Animale',
    'elefanți': 'Natură & Animale', 'leis': 'Natură & Animale', 'lei': 'Natură & Animale',
    'tigri': 'Natură & Animale', 'vulpi': 'Natură & Animale', 'lupi': 'Natură & Animale',
    'pasări': 'Natură & Animale', 'păsări': 'Natură & Animale', 'birds': 'Natură & Animale',
    'bufnițe': 'Natură & Animale', 'serpi': 'Natură & Animale', 'șerpi': 'Natură & Animale',
    'reptile': 'Natură & Animale', 'insecte': 'Natură & Animale', 'fluturi': 'Natură & Animale',
    'girafe': 'Natură & Animale', 'ursi': 'Natură & Animale', 'urși': 'Natură & Animale',
    'pinguini': 'Natură & Animale', 'balene': 'Natură & Animale', 'macro': 'Natură & Animale',
    'cosmos': 'Natură & Animale', 'space': 'Natură & Animale', 'sistemul-solar': 'Natură & Animale',
    'zen-&-spa': 'Natură & Animale', 'mini-zoo': 'Natură & Animale', 'flomingo': 'Natură & Animale',
    'flamingo': 'Natură & Animale', 'papagali': 'Natură & Animale', 'monkey': 'Natură & Animale',
    'ursi-maro': 'Natură & Animale', 'urși-maro': 'Natură & Animale', 'ursi-polari': 'Natură & Animale',
    'urși-polari': 'Natură & Animale', 'animale-salbatice': 'Natură & Animale', 'animale-sălbatice': 'Natură & Animale',
    'pisici-amuzante': 'Natură & Animale', 'zebre': 'Natură & Animale', 'veverițe': 'Natură & Animale',
    'veverite': 'Natură & Animale', 'pisici-salbatice': 'Natură & Animale', 'pisică-sălbatică': 'Natură & Animale',
    'feline-carnivore': 'Natură & Animale', 'seaworld': 'Natură & Animale', 'broaște': 'Natură & Animale',
    'căprioară': 'Natură & Animale', 'highland-cattle': 'Natură & Animale', 'păuni': 'Natură & Animale',
    'pantere': 'Natură & Animale', 'universul': 'Natură & Animale', 'aer': 'Natură & Animale',
    'păsări-marine-alca': 'Natură & Animale', 'iarbă-pampas': 'Natură & Animale', 'naturalismul': 'Natură & Animale',

    // === CĂLĂTORII & ORAȘE (Destinații, Arhitectură, Hărți) ===
    'orașe': 'Călătorii & Orașe', 'orase': 'Călătorii & Orașe', 'arhitectură': 'Călătorii & Orașe',
    'hărți': 'Călătorii & Orașe', 'map': 'Călătorii & Orașe', 'harti': 'Călătorii & Orașe',
    'vintage-maps': 'Călătorii & Orașe', 'călătorie-în-jurul-lumii': 'Călătorii & Orașe',
    'new-york': 'Călătorii & Orașe', 'paris': 'Călătorii & Orașe', 'tokyo': 'Călătorii & Orașe',
    'london': 'Călătorii & Orașe', 'amsterdam': 'Călătorii & Orașe', 'barcelona': 'Călătorii & Orașe',
    'italy': 'Călătorii & Orașe', 'france': 'Călătorii & Orașe', 'japan': 'Călătorii & Orașe',
    'china': 'Călătorii & Orașe', 'africa': 'Călătorii & Orașe', 'travel': 'Călătorii & Orașe',
    'cities': 'Călătorii & Orașe', 'poduri': 'Călătorii & Orașe', 'zgârie-nori': 'Călătorii & Orașe',
    'perspectivă': 'Călătorii & Orașe', 'spania': 'Călătorii & Orașe', 'străzi': 'Călătorii & Orașe',
    'harta-lumii': 'Călătorii & Orașe', 'frumusețea-arhitecturii': 'Călătorii & Orașe', 'clădiri': 'Călătorii & Orașe',

    // === ARTĂ & STIL (Abstract, Modern, Design, Texturi) ===
    'vintage': 'Artă & Stil', 'retro-&-vintage': 'Artă & Stil', 'abstract': 'Artă & Stil',
    'modern-art': 'Artă & Stil', 'pop-art': 'Artă & Stil', 'minimalism': 'Artă & Stil',
    'fashion': 'Artă & Stil', 'ilustrații': 'Artă & Stil', 'art-&-design': 'Artă & Stil',
    'reproduceri': 'Artă & Stil', 'picturi-faimoase': 'Artă & Stil', 'vincent-van-gogh': 'Artă & Stil',
    'gustav-klimt': 'Artă & Stil', 'claude-monet': 'Artă & Stil', 'banksy': 'Artă & Stil',
    'bauhaus': 'Artă & Stil', 'copii': 'Artă & Stil', 'kids': 'Artă & Stil',
    'mâncare-și-băutură': 'Artă & Stil', 'food-&-drink': 'Artă & Stil', 'coffee': 'Artă & Stil',
    'wine': 'Artă & Stil', 'cocktails': 'Artă & Stil', 'quotes': 'Artă & Stil',
    'motivation': 'Artă & Stil', 'mesaje': 'Artă & Stil', 'typography': 'Artă & Stil',
    'alb-&-negru': 'Artă & Stil', 'black-&-white': 'Artă & Stil', 'geometrie': 'Artă & Stil',
    '3d-abstract': 'Artă & Stil', 'explozie-de-culoare': 'Artă & Stil', 'graffiti-&-street-art': 'Artă & Stil',
    'minimalist': 'Artă & Stil', 'colaje': 'Artă & Stil', 'avangardă': 'Artă & Stil',
    'pentru-dormitor': 'Artă & Stil', 'pentru-baie': 'Artă & Stil', 'pentru-hol': 'Artă & Stil',
    'pentru-bucătărie': 'Artă & Stil', 'modă': 'Artă & Stil', 'women-power': 'Artă & Stil',
    'cranii-și-schelete': 'Artă & Stil', 'spirituality': 'Artă & Stil', 'meditație': 'Artă & Stil',
    'creștinătate': 'Artă & Stil', 'zen': 'Artă & Stil', 'ilustratii': 'Artă & Stil',
};





/**
 * Detectează subcategoria din URL-ul original
 */
function detectSubcategory(originalUrl: string): string {
    const url = originalUrl.toLowerCase();

    // Mapare keywords → subcategorii
    const subcategoryMap: Record<string, string> = {
        'landscape': 'landscapes',
        'mountain': 'landscapes',
        'beach': 'landscapes',
        'forest': 'landscapes',
        'nature': 'landscapes',
        'desert': 'landscapes',
        'portrait': 'portraits',
        'face': 'portraits',
        'woman': 'portraits',
        'man': 'portraits',
        'people': 'portraits',
        'abstract': 'abstract',
        'geometric': 'abstract',
        'marble': 'abstract',
        'animal': 'animals',
        'dog': 'animals',
        'cat': 'animals',
        'bird': 'animals',
        'wolf': 'animals',
        'flower': 'flowers',
        'rose': 'flowers',
        'lily': 'flowers',
        'tulip': 'flowers',
        'magnolia': 'flowers',
        'poppy': 'flowers',
        'city': 'urban',
        'building': 'urban',
        'architecture': 'urban',
        'amsterdam': 'urban',
        'paris': 'urban',
        'york': 'urban',
    };

    for (const [keyword, subcategory] of Object.entries(subcategoryMap)) {
        if (url.includes(keyword)) {
            return subcategory;
        }
    }

    return 'general';
}

/**
 * Grupează produsele Europosters după base_id și creează produse unificate
 */
export function getEuropostersBaseProducts(): EuropostersBaseProduct[] {
    const grouped = new Map<string, RawEuropostersProduct[]>();

    // Grupăm după base_id
    rawProducts.forEach(product => {
        if (!product || !product.id) return;

        let baseId = product.base_id;
        if (!baseId) {
            const parts = product.id.split('-');
            if (parts.length >= 2) baseId = `${parts[0]}-${parts[1]}`;
            else baseId = product.id;
        }

        if (!grouped.has(baseId)) {
            grouped.set(baseId, []);
        }
        grouped.get(baseId)!.push(product);
    });

    // Creăm produse de bază cu toate variantele
    const baseProducts: EuropostersBaseProduct[] = [];

    grouped.forEach((variants, baseId) => {
        // Luăm primul produs pentru datele de bază
        const first = variants[0];

        // TITLUL: Folosim titlul deja prelucrat din JSON (care poate fi deja optimizat SEO)
        // Eliminăm doar sufixele de variantă dacă au mai rămas
        const baseTitle = first.title
            .replace(/\s*-\s*(Afiș|Canvas|Tapet|Autocolant)\s*$/i, '')
            .trim();

        const rawSubcategory = (first.subcategory && first.subcategory !== 'europosters')
            ? first.subcategory
            : detectSubcategory(first.metadata?.original_url || "");

        let subcategoryDisplay = '';
        let subcategoryLabel = ''; // Level 3

        const mappedParent = PARENT_CATEGORY_MAP[rawSubcategory.toLowerCase().replace(/\s+/g, '-')] || PARENT_CATEGORY_MAP[rawSubcategory.toLowerCase()];

        if (mappedParent) {
            subcategoryDisplay = mappedParent;
            subcategoryLabel = rawSubcategory.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        } else {
            subcategoryDisplay = 'Diverse';
            subcategoryLabel = rawSubcategory.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
            if (subcategoryLabel.toLowerCase() === 'europosters' || subcategoryLabel.toLowerCase() === 'general') {
                const genre = first.genre || null;
                subcategoryLabel = genre ? genre.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Diverse';
            }
        }

        baseProducts.push({
            id: baseId,
            base_id: baseId,
            title: baseTitle,
            original_name: first.original_name,
            description: first.description || 'Produs decorativ premium disponibil în multiple variante.',
            image: first.image,
            category: 'Modele', // HARDCODED ROOT CATEGORY
            subcategory: subcategoryDisplay, // Level 2
            genre: undefined,
            tags: [...first.tags, 'modele', subcategoryDisplay.toLowerCase(), subcategoryLabel.toLowerCase(), first.genre].filter(Boolean) as string[],
            metadata: {
                ...first.metadata,
                originalCategory: 'art-photo',
                subcategoryLabel: subcategoryLabel || undefined, // Level 3
            },
            variants: variants.map(v => {
                const typeNameMap: Record<string, string> = {
                    'afis': 'Afiș',
                    'canvas': 'Tablou Canvas',
                    'tapet': 'Tapet',
                    'autocolant': 'Autocolant'
                };
                const typeName = typeNameMap[v.variant_type] || v.variant_type;
                const categoryClean = rawSubcategory.replace(/-/g, ' ');
                const categoryDisplay = categoryClean.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

                const customDescription = `Descoperă ${v.title}, o piesă de artă ${categoryDisplay} perfectă pentru decorul tău. Realizat din materiale eco-friendly, acest ${typeName} redă fidel nuanțele vii și rezistente la UV.`;

                return {
                    type: v.variant_type,
                    title: v.title,
                    description: customDescription,
                    slug: v.slug,
                    price: v.price,
                    route: v.route,
                    configurator: v.configurator
                };
            })
        });
    });

    return baseProducts;
}

/**
 * Returnează un produs de bază după ID
 */
export function getEuropostersBaseProductById(id: string): EuropostersBaseProduct | undefined {
    return getEuropostersBaseProducts().find(p => p.id === id || p.base_id === id);
}

/**
 * Convertește un produs Europosters de bază în formatul Product standard
 */
export function convertEuropostersBaseToProduct(ep: EuropostersBaseProduct) {
    return {
        id: ep.id,
        slug: ep.base_id,
        routeSlug: ep.base_id,
        title: ep.title,
        description: ep.description,
        images: [ep.image],
        priceBase: ep.variants.length > 0 ? Math.min(...ep.variants.map(v => v.price)) : 0, // Cel mai mic preț
        currency: 'RON',
        tags: [...ep.tags, 'europosters', 'multi-variant', 'modele'],
        seo: {
            title: ep.metadata?.seo_title,
            description: ep.metadata?.seo_description
        },
        metadata: {
            category: ep.category, // Categorie reală din breadcrumbs
            subcategory: ep.subcategory,
            subcategoryLabel: ep.metadata?.subcategoryLabel,
            original_name: ep.original_name,
            variants: ep.variants,
            isMultiVariant: true
        }
    };
}
