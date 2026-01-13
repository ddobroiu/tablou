const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'lib', 'products', 'canvas-products.ts');

const products = {
    "canvas-5": {
        title: "Economisește Apa - Artă Modernă",
        description: "Adaugă un strop de culoare și mesaj cu tabloul 'Economisește Apa'. O lucrare vibrantă semnată de Sabrina Seck, perfectă pentru un decor modern.\\n\\n✨ Detalii Operă\\nTitlu Oficial: Save Water\\nAnul Creației: 2023\\nStil: Pop Art Modern\\n\\n🚚 Livrare Rapidă & Instalare Ușoară\\nProdusul ajunge la tine gata de montat. Pânza este întinsă profesional pe șasiu de lemn, iar sistemul de prindere este inclus.\\n\\n🛡️ Garanție Extinsă\\nCalitate garantată pe viață. Folosim cerneală rezistentă la UV, astfel culorile rămân vii peste 100 de ani. Dacă nu ești mulțumit, ai 30 de zile drept de retur.\\n\\n🌱 Eco-Friendly\\nMateriale prietenoase cu mediul, lemn certificat FSC și imprimare fără mirosuri toxice."
    },
    "canvas-6": {
        title: "Rățoiul Afacerist - Ediție Limitată",
        description: "Ediție Limitată! Doar 30 de piese disponibile.\\n\\nRățoiul Afacerist știe că norocul nu există, doar munca grea contează. O piesă motivațională perfectă pentru birou sau living.\\n\\n✨ Povestea Lucrării\\nTitlu: ALL HUSTLE\\nAn: 2021\\nConcept: Succes prin determinare.\\n\\n💎 Calitate Premium\\nImprimare de înaltă rezoluție pe pânză Fine Art de 330g/mp. Șasiul din lemn masiv de 2cm asigură durabilitatea în timp.\\n\\n📦 Gata de Pus pe Perete\\nVine complet echipat cu sistem de prindere. Scoate-l din cutie și transformă-ți camera instantaneu.\\n\\n🛡️ Satisfacție Garantată\\n30 de zile retur gratuit și garanție 100 de ani la culori."
    },
    "canvas-7": {
        title: "Rățoiul Fără Bani - Artă Pop",
        description: "Ediție Limitată! Un reminder haios dar serios: Fără bani, nu e amuzant.\\n\\nO interpretare modernă a clasicului Scrooge, perfectă pentru cei care apreciază arta urbană și mesajele puternice.\\n\\n✨ Design Unic\\nCreat de artiști internaționali, acest canvas aduce un vibe exclusivist oricărui spațiu.\\n\\n✨ Materiale de Top\\nPânză bumbac+poliester rezistentă la apă și zgârieturi. Întinsă manual pe cadru de lemn certificat.\\n\\n✨ Comandă Fără Griji\\nLivrare rapidă prin curier, ambalare securizată și drept de retur 30 de zile."
    },
    "canvas-8": {
        title: "Totul Începe Cu Un Vis - Motivațional",
        description: "Visele mari încep cu primul pas. Acest tablou este inspirația ta zilnică.\\n\\nUn design alb-negru elegant, cu accente subtile, care se potrivește în orice birou modern sau dormitor.\\n\\n✨ Specificații\\nPrint HD pe canvas fin.\\nȘasiu din lemn de molid uscat, profile 2x3 cm.\\nImaginea continuă pe margini (efect oglindă).\\n\\n✨ De ce 3DView?\\nSuntem dedicați calității. Folosim tehnologie de ultimă oră pentru culori profunde și detalii clare."
    },
    "canvas-9": {
        title: "Mai Mulți Bani, Mai Multă Distracție",
        description: "O continuare a seriei de succes, acest tablou surprinde esența lifestyle-ului opulent. \\n\\n'More Money, More Funny' - un motto pentru cei care țintesc sus.\\n\\n🎨 Detalii Tehnice\\nTehnică: Digital Art Print\\nSuport: Pânză Canvas 330g\\nCadru: Lemn FSC, grosime 2cm\\n\\n🌟 Recenzii\\nClienții noștri adoră culorile vibrante și calitatea execuției. Vezi și tu diferența!"
    },
    "canvas-10": {
        title: "Lupul De Pe Wall Street - American Dream",
        description: "Inspirat din celebrul film, acest tablou este simbolul ambiției supreme. Jordan Belfort în elementul său.\\n\\nIdeal pentru birouri, săli de ședințe sau camera unui antreprenor.\\n\\n🖼️ Caracteristici\\nImprimare Full HD pe canvas texturat.\\nCulori intense, negru profund.\\nRezistent la soare și umezeală ușoară.\\nLivrare rapidă în toată țara."
    },
    "canvas-11": {
        title: "Mergi Ca Un Șef - Atitudine de Lider",
        description: "Atitudinea este totul. 'Walk Like A Boss' îți amintește zilnic să pășești cu încredere.\\n\\nO piesă statement, care combină personaje iconice cu un mesaj modern despre succes.\\n\\n✔️ Canvas Bumbac 100% Calitate Muzeală\\n✔️ Șasiu Lemn Masiv\\n✔️ Print Eco-Friendly\\n✔️ Gata de agățat"
    },
    "canvas-12": {
        title: "Se Mai Întâmplă (Shit Happens) - Donald",
        description: "Chiar și cei mai buni au zile proaste. Important e să treci peste cu umor!\\n\\nUn tablou amuzant cu Donald, care aduce un zâmbet oricui îl privește. Perfect pentru a destinde atmosfera.\\n\\nCalitate garantată, culori care nu se estompează și o pânză care rezistă generații.\\nComandă acum!"
    },
    "canvas-13": {
        title: "Chapeau - Eleganță și Stil",
        description: "'Chapeau!' - Un gest de respect pentru o realizare de excepție. Inspirat de Marele Gatsby, acest tablou emană eleganță.\\n\\nTonuri calde, stil vintage modernizat.\\n\\nIdeal pentru: Living, Bibliotecă, Birou.\\nMaterial: Canvas Premium 330g.\\nMontaj: Gata de agățat."
    },
    "canvas-14": {
        title: "Rățoiul Regal 2.0 - Lux Suprem",
        description: "Varianta 2.0 a celebrului Royal Duck. Mai mult lux, mai mult stil.\\n\\nO piesă care atrage toate privirile. Domină camera cu prezența sa regală.\\n\\nFabricat în România cu materiale premium din Germania.\\nGaranție de calitate și satisfacție."
    },
    "canvas-15": {
        title: "Rățoiul Crypto - Investitorul Digital",
        description: "Bitcoin, Ethereum, To The Moon! 🚀\\n\\nPentru pasionații de crypto, acest tablou este trofeul suprem. Un simbol al succesului în era digitală.\\n\\nPrint de extremă definiție pe pânză texturată.\\nRezistență UV și la ștergere.\\nCadoul perfect pentru orice investitor."
    },
    "canvas-16": {
        title: "Mentalitatea e Totul - Tigrul Succesului",
        description: "Putere. Focus. Determinare. Privirea tigrului îți amintește că totul depinde de tine.\\n\\nUn tablou motivațional puternic, în nuanțe de alb-negru cu ochi albaștri pătrunzători.\\n\\nDecorează cu stil și inspirație.\\nProdus premium, finisat manual."
    },
    "canvas-17": {
        title: "Îmi Creez Singur Norocul - Motivație Pură",
        description: "\\\"I don't get lucky, I make my own luck.\\\" O declarație de independență și forță.\\n\\nAcest tablou nu este doar un decor, ci un manifest.\\n\\nRealizat pe pânză de calitate superioară, cu șasiu rezistent care nu se deformează în timp.\\nInvestește în spațiul tău, investește în mindset-ul tău."
    },
    "canvas-18": {
        title: "Munca Bate Talentul - Determinare",
        description: "Talentul e bun, dar munca e vitală. 'Hard Work Beats Talent' este doza ta zilnică de motivație.\\n\\nUn contrast puternic între fondul negru și textul alb/colorat, care iese în evidență pe orice perete.\\n\\nCalitate nemțească, asamblat cu mândrie în România.\\nLivrare rapidă și sigură."
    },
    "canvas-19": {
        title: "Gânditorul Rebel - Mickey Art",
        description: "O reinterpretare amuzantă și rebelă a 'Gânditorului'. Mickey într-o ipostază neconvențională.\\n\\nArta Pop Modernă la tine acasă. Culori vii, detalii sharp.\\n\\nTransformă un perete banal într-un punct de atracție.\\nComandă cu încredere - calitate premium garantată."
    },
    "canvas-20": {
        title: "Iepurașul Jucăuș - Stil Pop Art",
        description: "Bugs Bunny într-o ipostază de 'Playboy'. Umor, stil și culoare.\\n\\nUn tablou vibrant care adaugă personalitate camerei tale.\\nPerfect pentru fanii Pop Art și desene animate clasice.\\n\\nMateriale de top, rezistență la apă și UV."
    },
    "canvas-21": {
        title: "Jokerul Creativ - Artă Abstractă",
        description: "Why so serious? Jokerul într-o explozie de creativitate și culori.\\n\\nUn portret fascinant care captează haosul și geniul personajului.\\n\\nCalitate garantată, pânză întinsă perfect pe cadru de lemn.\\nLivreare rapidă la ușa ta."
    },
    "canvas-22": {
        title: "Rățoiul Miliardar - Viață de Lux",
        description: "Scrooge McDuck și muntele său de bani. Simbolul bogăției supreme.\\n\\nUn tablou care inspiră succes financiar și abundență.\\n\\nPrint de calitate superioară, rezistent în timp.\\nInvestește în decorul tău cu o piesă de artă modernă."
    },
    "canvas-23": {
        title: "Taurul Financiar - Simbolul Bursei",
        description: "Taurul de pe Wall Street, simbolul optimismului și creșterii financiare.\\n\\nO piesă indispensabilă pentru orice trader sau investitor.\\n\\nCanvas premium, finisaje de lux, gata de pus pe perete.\\nSuccesul începe cu mentalitatea potrivită!"
    }
};

let content = fs.readFileSync(filePath, 'utf8');
let count = 0;

for (const [id, data] of Object.entries(products)) {
    // Regex to find the block for this ID
    // Look for "id": "canvas-X" ... "title": "OLD" ... "description": "OLD"
    // We act safely by finding the position of the ID, then searching forward for the nearest "title": key.

    const idRegex = new RegExp(`"id":\\s*"${id}",`);
    const match = idRegex.exec(content);

    if (match) {
        const startIndex = match.index;

        // Search for title after ID
        const titleRegex = /"title":\s*"(.*?)"/;
        // We slice content from startIndex to find the next title
        const searchString = content.slice(startIndex);
        const titleMatch = titleRegex.exec(searchString);

        if (titleMatch) {
            // Create global regex replacement only for this specific occurrence
            // Constructing a regex that matches "id": "ID" ... "title": "OLD" might be complex for variable distance.
            // Easiest is to split the content, replace, join. But that's heavy.
            // Let's use string manipulation with indices.

            const absoluteTitleStart = startIndex + titleMatch.index;
            // Re-verify it's the `title` for THIS object and not the next one?
            // Check if `id` comes again before `title`.
            const nextId = /"id":/.exec(searchString.slice(0, titleMatch.index));
            if (!nextId) {
                // Safe to replace
                const fullMatchString = titleMatch[0];
                const replacementString = `"title": "${data.title}"`;

                // Using string replacement on the slice is risky unless we know it's unique.
                // Let's assume unique enough or just use the indices to patch string.

                // Better approach: Regex Replace with Callback that checks ID? No.

                // Let's use simple string replace of the sub-block if possible.
                // Or just use the original content replacement approach but targeting the EXACT substring found.

                content = content.slice(0, absoluteTitleStart) + replacementString + content.slice(absoluteTitleStart + fullMatchString.length);
                count++;
            }
        }

        // Re-search for description (content changed, so index shifted? Yes! Need to handle shift)
        // To avoid shift issues, let's just do another pass or track offset.
        // Easier: Do it in one go or reload content? No, just use `count` logic later?
        // Actually, just looping is fine if we start from top? No, shift ruins indices.
        // Let's just do search again based on ID.
    }
}

// Rewind and do a second pass for descriptions to avoid complex index math?
// Or just do intelligent replacement.
// Let's iterate keys again, re-reading "content" variable.

for (const [id, data] of Object.entries(products)) {
    const idRegex = new RegExp(`"id":\\s*"${id}",`);
    const match = idRegex.exec(content);

    if (match) {
        const startIndex = match.index;
        const searchString = content.slice(startIndex);

        // Update Description
        const descRegex = /"description":\s*"((?:[^"\\]|\\.)*)"/;
        const descMatch = descRegex.exec(searchString);

        if (descMatch) {
            const nextId = /"id":/.exec(searchString.slice(0, descMatch.index));
            if (!nextId) {
                const absoluteDescStart = startIndex + descMatch.index;
                const fullMatchString = descMatch[0];
                const replacementString = `"description": "${data.description}"`;

                content = content.slice(0, absoluteDescStart) + replacementString + content.slice(absoluteDescStart + fullMatchString.length);
                count++;
            }
        }
    }
}


fs.writeFileSync(filePath, content, 'utf8');
console.log(`Updated ${count} fields (titles/descriptions) in canvas-products.ts`);
