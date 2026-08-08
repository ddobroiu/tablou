const fs = require('fs');
const path = require('path');

const inputFile = path.join(process.cwd(), 'public/canvas/products.json');
const outputFile = path.join(process.cwd(), 'public/canvas/products-with-categories.json');

// Dicționar de termeni pentru traducere
const DICTIONARY = {
    // Culori și Adjective
    'Red': 'Roșu', 'Blue': 'Albastru', 'Green': 'Verde', 'Yellow': 'Galben',
    'Orange': 'Portocaliu', 'Purple': 'Mov', 'Black': 'Negru', 'White': 'Alb',
    'Pink': 'Roz', 'Grey': 'Gri', 'Gray': 'Gri', 'Gold': 'Auriu', 'Golden': 'Auriu',
    'Silver': 'Argintiu', 'Brown': 'Maro', 'Cream': 'Crem', 'Beige': 'Bej',
    'Dark': 'Întunecat', 'Light': 'Luminos', 'Bright': 'Strălucitor',
    'Colorful': 'Colorat', 'Vintage': 'Vintage', 'Modern': 'Modern',
    'Abstract': 'Abstract', 'Geometric': 'Geometric', 'Minimalist': 'Minimalist',
    'Beautiful': 'Frumos', 'Pretty': 'Drăguț', 'Cute': 'Drăguț', 'Big': 'Mare',
    'Small': 'Mic', 'Old': 'Vechi', 'New': 'Nou', 'Fresh': 'Proaspăt',
    'Dirty': 'Murdar', 'Clean': 'Curat', 'Wet': 'Ud', 'Dry': 'Uscat',
    'Majestic': 'Maiestuos', 'Stunning': 'Uimitor', 'Nice': 'Plăcut',

    // Natură & Peisaje
    'Lake': 'Lac', 'River': 'Râu', 'Sea': 'Mare', 'Ocean': 'Ocean',
    'Mountain': 'Munte', 'Mountains': 'Munți', 'Hill': 'Deal', 'Field': 'Câmp',
    'Forest': 'Pădure', 'Woods': 'Pădure', 'Tree': 'Copac', 'Trees': 'Copaci',
    'Leaf': 'Frunză', 'Leaves': 'Frunze', 'Flower': 'Floare', 'Flowers': 'Flori',
    'Rose': 'Trandafir', 'Roses': 'Trandafiri', 'Lily': 'Crin', 'Lilies': 'Crini',
    'Orchid': 'Orhidee', 'Tulip': 'Lalea', 'Daisy': 'Margaretă', 'Daisies': 'Margarete',
    'Peony': 'Bujor', 'Sunflower': 'Floarea Soarelui', 'Poppy': 'Mac',
    'Garden': 'Grădină', 'Meadow': 'Pajiște', 'Park': 'Parc', 'Nature': 'Natură',
    'Sky': 'Cer', 'Cloud': 'Nor', 'Clouds': 'Nori', 'Sun': 'Soare', 'Moon': 'Lună',
    'Sunset': 'Apus', 'Sunrise': 'Răsărit', 'Rain': 'Ploaie', 'Snow': 'Zăpadă',
    'Winter': 'Iarnă', 'Spring': 'Primăvară', 'Summer': 'Vară', 'Autumn': 'Toamnă',
    'Fall': 'Toamnă', 'Water': 'Apă', 'Waterfall': 'Cascadă', 'Beach': 'Plajă',
    'Island': 'Insulă', 'Sand': 'Nisip', 'Stone': 'Piatră', 'Stones': 'Pietre',
    'Rock': 'Stâncă', 'Rocks': 'Stânci',

    // Animale
    'Animal': 'Animal', 'Animals': 'Animale', 'Cat': 'Pisică', 'Dog': 'Câine',
    'Wolf': 'Lup', 'Wolves': 'Lupi', 'Lion': 'Leu', 'Tiger': 'Tigru',
    'Bear': 'Urs', 'Elephant': 'Elefant', 'Horse': 'Cal', 'Horses': 'Cai',
    'Bird': 'Pasăre', 'Birds': 'Păsări', 'Eagle': 'Vultur', 'Owl': 'Bufniță',
    'Parrot': 'Papagal', 'Butterfly': 'Fluture', 'Butterflies': 'Fluturi',
    'Fish': 'Pește', 'Deer': 'Căprioară', 'Fox': 'Vulpe', 'Rabbit': 'Iepure',
    'Dragon': 'Dragon',

    // Orașe & Arhitectură
    'City': 'Oraș', 'Town': 'Oraș', 'Village': 'Sat', 'Urban': 'Urban',
    'Building': 'Clădire', 'Buildings': 'Clădiri', 'House': 'Casă', 'Street': 'Stradă',
    'Bridge': 'Pod', 'Tower': 'Turn', 'Castle': 'Castel', 'Church': 'Biserică',
    'Map': 'Hartă', 'World': 'Lume', 'Country': 'Țară',
    'New York': 'New York', 'Paris': 'Paris', 'London': 'Londra', 'Rome': 'Roma',
    'Venice': 'Veneția', 'Italy': 'Italia', 'France': 'Franța', 'Spain': 'Spania',

    // Obiecte & Diverse
    'Car': 'Mașină', 'Cars': 'Mașini', 'Bike': 'Bicicletă', 'Bicycle': 'Bicicletă',
    'Ship': 'Corabie', 'Boat': 'Barcă', 'Plane': 'Avion', 'Train': 'Tren',
    'Coffee': 'Cafea', 'Tea': 'Ceai', 'Cup': 'Ceașcă', 'Fruit': 'Fruct',
    'Food': 'Mâncare', 'Drink': 'Băutură', 'Wine': 'Vin', 'Glass': 'Pahar',
    'Book': 'Carte', 'Music': 'Muzică', 'Art': 'Artă', 'Painting': 'Pictură',
    'Drawing': 'Desen', 'Sketch': 'Schiță', 'Portrait': 'Portret',
    'Woman': 'Femeie', 'Women': 'Femei', 'Girl': 'Fată', 'Man': 'Bărbat',
    'Boy': 'Băiat', 'Baby': 'Bebeluș', 'Face': 'Față', 'Body': 'Corp',
    'Eye': 'Ochi', 'Eyes': 'Ochi', 'Lips': 'Buze', 'Hand': 'Mână',
    'Love': 'Dragoste', 'Heart': 'Inimă', 'Peace': 'Pace', 'Dream': 'Vis',
    'Flying': 'În Zbor', 'Running': 'Alergând', 'Sitting': 'Stând', 'Standing': 'În Picioare',
    'Walking': 'Mergând', 'Dancing': 'Dansând', 'Sleeping': 'Dormind',
    'Playing': 'Jucându-se', 'Singing': 'Cântând', 'Smiling': 'Zâmbind',
    'Happy': 'Fericit', 'Sad': 'Trist', 'Angry': 'Furios', 'Calm': 'Calm',
    'Wild': 'Sălbatic', 'Domestic': 'Domestic', 'Free': 'Liber',
    'Young': 'Tânăr', 'Adult': 'Adult',

    // Noi adăugiri
    'View': 'Vedere', 'On': 'Pe', 'Wood': 'Lemn', 'Angel': 'Înger', 'Wings': 'Aripi',
    'Wing': 'Aripă', 'Golden': 'Auriu', 'Silver': 'Argintiu', 'Drăguț': 'Drăguț',
    'Funny': 'Amuzant', 'Sweet': 'Dulce', 'Cute': 'Drăguț',
    'After': 'După', 'Afternoon': 'După-amiază', 'Morning': 'Dimineața',
    'Evening': 'Seara', 'Night': 'Noaptea', 'Midnight': 'Miezul Nopții'
};

function translateName(englishName) {
    if (!englishName) return '';

    let words = englishName.split(' ');
    let translatedWords = words.map(word => {
        let cleanWord = word.replace(/[^\w\s]/gi, '');
        let key = Object.keys(DICTIONARY).find(k => k.toLowerCase() === cleanWord.toLowerCase());

        if (key) {
            return word.replace(cleanWord, DICTIONARY[key]);
        }
        return word;
    });

    // 1. Caz specific: "Name View" -> "Vedere Name"
    if (translatedWords.length >= 2 && translatedWords[translatedWords.length - 1] === 'Vedere') {
        const popped = translatedWords.pop();
        translatedWords.unshift(popped);
    }

    // 2. Logică pentru inversare Adjectiv + Substantiv (doar pentru 2 cuvinte momentan)
    if (translatedWords.length === 2) {
        const w1 = words[0];

        const isW1Adj = ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Big', 'Small', 'Golden', 'Silver', 'Happy', 'Sad', 'Cute', 'Drăguț', 'Auriu', 'Argintiu', 'Angel', 'Înger'].some(c => w1.includes(c) || translatedWords[0].includes(c));

        if (isW1Adj) {
            return translatedWords.reverse().join(' ');
        }
    }

    return translatedWords.join(' ');
}

console.log('Reading from:', inputFile);

try {
    if (!fs.existsSync(inputFile)) {
        throw new Error(`Fișierul ${inputFile} nu există!`);
    }

    const products = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
    console.log(`Am găsit ${products.length} produse.`);

    const processed = products.map(p => {
        let cat = 'moderne';
        let sub = 'diverse';

        // Încercăm să extragem categoria reală din URL-ul imaginii sursă
        if (p.sourceImage) {
            try {
                const decodedBg = decodeURIComponent(p.sourceImage);
                const matches = decodedBg.match(/tablouri-canvas\/([^\/]+)\/([^\/]+)\//);

                if (matches && matches.length >= 3) {
                    cat = matches[1];
                    sub = matches[2];
                }
            } catch (e) {
                // Ignorăm erori de decodare
            }
        }

        // Curățăm categoriile
        cat = cat.replace(/-/g, '-').toLowerCase();
        sub = sub.replace(/-/g, '-').toLowerCase();

        return {
            ...p,
            name_ro: translateName(p.name),
            arthubCategory: cat,
            arthubSubcategory: sub
        };
    });

    fs.writeFileSync(outputFile, JSON.stringify(processed, null, 2), 'utf8');
    console.log(`✅ Succes! Am extras categoriile REALE și am tradus numele pentru ${processed.length} produse.`);

} catch (error) {
    console.error('❌ Eroare:', error.message);
}
