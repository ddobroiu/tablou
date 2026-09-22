// Conținutul paginilor de dimensiune (/dimensiuni/{produs}/{L}x{H}).
//
// Textul e compus din DATE care se schimbă de la o mărime la alta: suprafață,
// greutate, număr de capse, rezoluția fișierului, prețul la fiecare cantitate,
// forma de livrare, clasa de mărime (mic / mediu / mare / foarte mare) și
// proporția (pătrat / dreptunghi / panoramic). Nu folosim spintax: două pagini
// diferă pentru că numerele și recomandările diferă, nu pentru că am rotit
// sinonime.
//
// `brand` alege vocea și ordinea secțiunilor, ca cele 7 site-uri ale rețelei
// să nu publice aceeași pagină cuvânt cu cuvânt.
import { getDimProduct, namedFormatFor, DimSize } from "./dimensionPages";
import { DimensionPricing, formatLei } from "./dimensionPricing";

export type BrandKey = "adbanner" | "anexa1" | "euprint" | "homeprint" | "prynt" | "shopprint" | "tablou";

export function brandKeyFromName(name: string): BrandKey {
    const k = String(name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    const known: BrandKey[] = ["adbanner", "anexa1", "euprint", "homeprint", "prynt", "shopprint", "tablou"];
    return (known.find((b) => k.startsWith(b)) ?? "shopprint") as BrandKey;
}

export type SectionId = "price" | "facts" | "usage" | "file" | "mounting" | "faq" | "neighbors" | "localities";

export type DimensionFact = { label: string; value: string; detail?: string };

export type DimensionContent = {
    metaTitle: string;
    metaDescription: string;
    h1: string;
    subtitle: string;
    intro: string[];
    facts: DimensionFact[];
    usage: { heading: string; paragraphs: string[] };
    file: { heading: string; items: string[] };
    mounting: { heading: string; paragraphs: string[] };
    faq: Array<{ q: string; a: string }>;
    sections: SectionId[];
    priceHeading: string;
    priceIntro: string;
    neighborsHeading: string;
    localitiesHeading: string;
    ctaLabel: string;
    productLabel: string;
    sizeLabel: string;
};

type SizeClass = "mic" | "mediu" | "mare" | "foarte-mare";
type Aspect = "patrat" | "aproape-patrat" | "dreptunghi" | "panoramic";
type Orientation = "landscape" | "portrait" | "square";

type ProductInfo = {
    shortName: string;          // "Banner PVC"
    article: "un" | "o";         // un banner / o placă
    noun: string;               // "banner", "placă de plexiglas"
    outdoor: boolean;
    /** g/m² pentru varianta recomandată; null când nu e relevant */
    gsm: number | null;
    weightNote?: string;
    /** DPI minim cerut pentru fișier la scară 1:1 */
    dpi: number;
    bleedMm: number;
    fileNote: string;
    usage: Record<SizeClass, string>;
    mounting: string[];
    delivery: (w: number, h: number) => string;
    extraFacts?: (w: number, h: number) => DimensionFact[];
};

const PRODUCTS: Record<string, ProductInfo> = {
    banner: {
        shortName: "Banner PVC", article: "un", noun: "banner", outdoor: true, gsm: 440, dpi: 150, bleedMm: 0,
        fileNote: "Nu e nevoie de bleed la banner, dar ține textele la cel puțin 5 cm de margine, în zona tivului și a capselor.",
        usage: {
            mic: "Sub jumătate de metru pătrat, bannerul lucrează ca o etichetă mare: pe ușa magazinului, pe un stand, pe gardul unui șantier mic sau ca tăbliță „de vânzare” ori „de închiriat”. La această suprafață prețul pe metru pătrat e mai mare, pentru că tăierea și finisarea costă la fel ca la un banner mare, așa că merită să comanzi mai multe bucăți odată.",
            mediu: "E formatul clasic pentru vitrină, balcon sau intrarea unui magazin: se citește de la 10-20 m și se prinde în patru până la opt capse sau cu bandă pe un cadru. Încape pe majoritatea fațadelor de parter fără să acopere ferestrele.",
            mare: "E un format de fațadă și de gard: textul principal se vede de la 30-50 m dacă literele au cel puțin 15-20 cm. Se prinde prin capse, la fiecare 50 cm, și la exterior trebuie întins uniform ca să nu fluture.",
            "foarte-mare": "Peste 6 m² bannerul devine o suprafață mare pe care vântul apasă serios: recomandăm găuri de vânt sau, pentru fațade și schele, trecerea la mesh microperforat. Se livrează în sul; la această mărime se manevrează în doi.",
        },
        mounting: [
            "Pe cadru sau gard: prin capse, cu coliere de plastic sau sârmă, întins pe toate laturile.",
            "Pe perete: cu tub metalic sus și jos (buzunar cusut) sau cu șuruburi și șaibe late prin capse.",
            "Temporar, la interior: bandă dublu adezivă pe spatele bannerului fără finisaje.",
        ],
        delivery: (w, h) => (Math.max(w, h) >= 300 ? "în sul, ca să nu se cuteze printul" : "pliat, într-un colet compact"),
    },
    "banner-verso": {
        shortName: "Banner față-verso", article: "un", noun: "banner blockout", outdoor: true, gsm: 650, dpi: 150, bleedMm: 0,
        fileNote: "Trimite două fișiere (față și verso). Dacă designul continuă de pe o față pe alta, oglindește-l pe verso.",
        usage: {
            mic: "Un banner față-verso mic se folosește ca semn suspendat: deasupra unui raion, la o casă de marcat, pe un culoar de mall sau ca steag pe o consolă, unde trebuie citit din ambele sensuri de mers.",
            mediu: "E formatul tipic pentru afișaj suspendat în centre comerciale, pe stâlpii de iluminat (cu brațe) sau ca separator de spațiu la evenimente: un singur banner acoperă ambele direcții de trafic.",
            mare: "La această mărime bannerul blockout se suspendă de tavan în hale, la târguri și în parcări acoperite, sau se prinde între doi stâlpi peste o alee. Stratul opac din mijloc face ca o față să nu se vadă prin cealaltă chiar în contralumină.",
            "foarte-mare": "Suprafețele mari suspendate trebuie prinse pe toate laturile și, la exterior, au nevoie de găuri de vânt. Materialul de 650 g/m² e mai greu decât un frontlit, deci calculează greutatea totală pentru punctele de prindere.",
        },
        mounting: [
            "Suspendat: tub sau bară în buzunarul de sus, prindere în capse pe laterale ca să nu se răsucească.",
            "Pe brațe de stâlp: capse pe laturile scurte, tije prin buzunare sus și jos.",
            "Ca separator: cablu întins prin capse, ancorat la ambele capete.",
        ],
        delivery: (w, h) => (Math.max(w, h) >= 300 ? "în sul" : "pliat, într-un colet compact"),
    },
    mesh: {
        shortName: "Mesh publicitar", article: "un", noun: "mesh", outdoor: true, gsm: 370, dpi: 100, bleedMm: 0,
        fileNote: "Mesh-ul e microperforat, deci detaliile fine se pierd: folosește litere mari și contraste puternice, fără text sub 5 cm.",
        usage: {
            mic: "Un mesh mic are rost doar acolo unde vântul e problema: pe un gard de plasă, pe balustrada unui balcon sau pe o schelă de reparații mărunte. Pentru afișaj obișnuit la această mărime, un banner frontlit e mai ieftin și mai contrastant.",
            mediu: "Pe garduri de șantier și pe balustrade, mesh-ul lasă aerul să treacă și nu smulge prinderea la prima furtună. Se citește bine de la distanță medie, deși perforațiile reduc puțin saturația culorilor.",
            mare: "E formatul de schelă și de fațadă: acoperă lucrarea, ține praful și reclama în același timp și rezistă la vânt fără găuri suplimentare. Prinderea se face la fiecare capsă, pe toate laturile.",
            "foarte-mare": "La suprafețe foarte mari, mesh-ul e singura opțiune sigură pe fațade și schele: presiunea vântului trece prin material. Se livrează în sul; se fixează cu coliere la fiecare capsă.",
        },
        mounting: [
            "Pe schelă: coliere de plastic prin fiecare capsă, la fiecare 50 cm, întins pe toată suprafața.",
            "Pe gard de plasă: sârmă sau coliere, cu tivul spre exterior ca să nu se destrame.",
            "Pe cadru metalic: cabluri elastice prin capse, ca la un banner obișnuit.",
        ],
        delivery: (w, h) => (Math.max(w, h) >= 200 ? "în sul" : "pliat, într-un colet compact"),
    },
    autocolante: {
        shortName: "Autocolant", article: "un", noun: "autocolant", outdoor: true, gsm: null, dpi: 150, bleedMm: 3,
        fileNote: "Pentru tăiere pe contur (print + cut) trimite conturul ca traseu vectorial într-un layer separat.",
        usage: {
            mic: "Sub jumătate de metru pătrat vorbim de etichete, stickere de produs, semne pentru uși și logo-uri pe vitrină. La bucăți mici comanda se face de regulă în serie: prețul pe bucată scade vizibil de la 10-25 de bucăți în sus.",
            mediu: "Format tipic pentru colantarea unei vitrine, a unui panou de reclamă existent sau a unei uși de sticlă. Se aplică ud (apă cu puțin detergent) ca să poată fi repoziționat înainte de presare.",
            mare: "La această mărime autocolantul acoperă o vitrină întreagă sau o latură de dubă. Se aplică cu racletă, de la centru spre margini, și e bine să fie laminat dacă stă la exterior.",
            "foarte-mare": "Suprafețele foarte mari se împart în benzi de maximum 137 cm (lățimea rolei) cu suprapunere de 1 cm. Se aplică pe suprafață curată și la temperatură peste 10 °C.",
        },
        mounting: [
            "Aplicare uscată pentru bucăți mici, cu folie de transfer pentru literele decupate.",
            "Aplicare udă (apă și o picătură de detergent) pe sticlă și suprafețe mari, apoi presare cu racletă de la centru spre margini.",
            "Suprafața trebuie curată, uscată și degresată; la exterior, laminarea dublează durata de viață.",
        ],
        delivery: (w, h) => (Math.max(w, h) >= 100 ? "în sul, cu folia protejată" : "plat, între două cartoane"),
        extraFacts: (w) => (w > 137 ? [{ label: "Împărțire în benzi", value: `${Math.ceil(w / 137)} benzi`, detail: "lățimea rolei e 137 cm; benzile se aplică cu suprapunere de 1 cm" }] : []),
    },
    canvas: {
        shortName: "Canvas printat", article: "o", noun: "pânză canvas printată", outdoor: false, gsm: 360, dpi: 150, bleedMm: 0,
        fileNote: "Varianta fără șasiu se livrează ca pânză printată, rulată, la dimensiunea comandată. Dacă vrei tabloul gata de agățat, alege în configurator varianta cu șasiu, la dimensiuni fixe.",
        usage: {
            mic: "O pânză canvas printată la această mărime se întinde ușor pe un șasiu mic sau se pune într-o ramă cu paspartu; e formatul tipic pentru portrete de familie și cadouri. Se livrează rulată, într-un tub, și se împachetează ușor.",
            mediu: "E mărimea clasică pentru deasupra canapelei sau a patului. Pânza printată se livrează rulată; fotografia trebuie să aibă subiectul clar, pentru că detaliile fine se văd de la 1-2 m.",
            mare: "La această mărime pânza devine piesa centrală a camerei: hol de intrare, perete de living, recepție de birou. Rulată în tub, e ușor de transportat; la întindere are nevoie de un șasiu cu traversă ca să rămână plană în timp.",
            "foarte-mare": "Formatele foarte mari se livrează rulate, în tub rigid, și se întind pe loc; merită gândite ca triptic dacă peretele sau scara nu permit o singură piesă.",
        },
        mounting: [
            "Pânza se poate întinde pe șasiu la orice atelier de înrămare sau se pune în ramă cu sticlă.",
            "Nu expune canvasul la soare direct sau la umezeală constantă (baie).",
        ],
        delivery: () => "rulată, în tub",
    },
    tapet: {
        shortName: "Fototapet", article: "un", noun: "fototapet", outdoor: false, gsm: null, dpi: 100, bleedMm: 50,
        fileNote: "Măsoară peretele în trei puncte și comandă cu 5 cm în plus pe fiecare latură; surplusul se taie la lipire.",
        usage: {
            mic: "Un fototapet mic acoperă o nișă, o ușă, spatele unei biblioteci sau un perete de deasupra biroului. E cea mai ieftină cale de a schimba un colț de cameră fără vopsit.",
            mediu: "Format de perete parțial: capul patului, zona de deasupra canapelei sau spatele recepției. Se livrează în benzi verticale care se aliniază după model.",
            mare: "Acoperă un perete întreg de dormitor sau living. Recomandăm varianta non-adezivă, lipită cu clei, pentru pereți care nu sunt perfect netezi, și varianta adezivă pe gips-carton finisat.",
            "foarte-mare": "Pentru pereți foarte mari (birouri, spații comerciale, holuri), tapetul se livrează în benzi numerotate. Verifică plafonul și pardoseala: dacă nu sunt paralele, pune surplus pe verticală.",
        },
        mounting: [
            "Non-adeziv: clei de tapet aplicat pe perete, benzi montate cap la cap, fără suprapunere.",
            "Autoadeziv: se dezlipește hârtia de protecție treptat, de sus în jos, presând cu racletă moale.",
            "Peretele trebuie neted, uscat și grunduit; tapetul nu acoperă fisuri sau denivelări.",
        ],
        delivery: () => "în sul, în tub de carton",
        extraFacts: (w) => [{ label: "Benzi", value: `${Math.max(1, Math.ceil(w / 100))} ${Math.ceil(w / 100) === 1 ? "bandă" : "benzi"}`, detail: "benzi verticale de aproximativ 1 m lățime, numerotate" }],
    },
    "window-graphics": {
        shortName: "Folie perforată pentru geam", article: "o", noun: "folie one-way", outdoor: true, gsm: null, dpi: 100, bleedMm: 5,
        fileNote: "Jumătate din suprafață e perforată, deci textele sub 4 cm și liniile subțiri nu se citesc; folosește fundaluri pline și litere groase.",
        usage: {
            mic: "O folie perforată mică acoperă un geam de ușă sau un ochi de vitrină: reclamă spre stradă, vizibilitate spre interior. Merge și pe luneta unei mașini.",
            mediu: "E formatul unei vitrine de magazin obișnuite sau al unui geam de birou: din exterior se vede reclama, din interior lumina și strada rămân vizibile.",
            mare: "Acoperă vitrine mari și fațade de sticlă; se livrează pe bucăți de maximum 137 cm lățime, aliniate după model. Laminarea protejează printul de ploaie și de spălare.",
            "foarte-mare": "Suprafețe vitrate întregi (showroom, birouri pe colț) se acoperă în benzi numerotate. Din exterior fațada devine un singur afiș; din interior se vede afară ca printr-o plasă fină.",
        },
        mounting: [
            "Se aplică pe exteriorul geamului, pe sticlă curată și uscată, cu racletă de la centru spre margini.",
            "Marginile se sigilează cu laminare sau bandă transparentă ca să nu intre apa în perforații.",
            "Efectul one-way funcționează ziua; noaptea, cu lumina aprinsă în interior, folia devine vizibilă din afară.",
        ],
        delivery: (w, h) => (Math.max(w, h) >= 100 ? "în sul" : "plat, între două cartoane"),
        extraFacts: (w) => (w > 137 ? [{ label: "Împărțire în benzi", value: `${Math.ceil(w / 137)} benzi`, detail: "lățimea rolei e 137 cm" }] : []),
    },
    plexiglass: {
        shortName: "Placă plexiglas printată", article: "o", noun: "placă de plexiglas", outdoor: true, gsm: null, dpi: 150, bleedMm: 3,
        fileNote: "La plexiglas transparent printul se face pe spate, în oglindă, ca să fie protejat de placă; specifică dacă vrei un strat alb sub culori.",
        usage: {
            mic: "Plăcuțe de ușă, tăblițe de birou, etichete premium de raft și rame pentru meniuri: plexiglasul mic se fixează cu distanțiere metalice și arată ca un obiect finisat, nu ca un afiș.",
            mediu: "E mărimea firmelor de intrare, a panourilor de recepție și a display-urilor de produs. Se fixează pe distanțiere sau se așază pe suport; grosimea de 3 mm e suficientă pentru interior.",
            mare: "Panouri de recepție, totemuri de interior și firme luminoase: la această suprafață recomandăm minimum 4-5 mm grosime ca placa să nu se curbeze, plus prindere în cel puțin șase puncte.",
            "foarte-mare": "Plăcile foarte mari se taie din coli de 400 × 200 cm și cântăresc mult; au nevoie de structură de susținere și de transport pe paletă. Gândește panoul în module dacă trebuie urcat pe scări.",
        },
        mounting: [
            "Pe perete: găuri la colțuri și distanțiere metalice (13-25 mm), care țin placa la 2 cm de perete.",
            "În casetă luminoasă: plexiglas alb opac, care difuzează lumina uniform.",
            "Se livrează cu folie de protecție pe ambele fețe; se scoate după montaj.",
        ],
        delivery: (w, h) => (Math.max(w, h) >= 150 ? "plat, pe paletă, cu folie de protecție" : "plat, în cutie cu colțare"),
    },
    "pvc-forex": {
        shortName: "Placă PVC Forex printată", article: "o", noun: "placă Forex", outdoor: true, gsm: null, dpi: 150, bleedMm: 3,
        fileNote: "Culorile pline pe toată suprafața se printează UV direct; pentru text mic pe fond alb, Forex-ul mat dă cel mai bun contrast.",
        usage: {
            mic: "Tăblițe de birou, indicatoare de ușă, semne „împinge / trage”, etichete de raft rigide: Forex-ul mic e ieftin, ușor și se prinde cu bandă dublu adezivă.",
            mediu: "E placa standard de firmă pentru intrare, indicator de direcție, panou de informare într-un magazin sau la o expoziție. La 3 mm rămâne dreaptă și se prinde cu șuruburi sau adeziv.",
            mare: "Panou de firmă, panou de șantier, fundal de stand: la peste 1 m pe latură recomandăm 5 mm grosime sau un cadru pe spate ca să nu se curbeze la soare.",
            "foarte-mare": "Plăcile mari se taie din coli de 305 × 205 cm; peste această mărime se îmbină pe cadru. Pentru exterior permanent, alucobondul rezistă mai bine la căldură decât Forex-ul.",
        },
        mounting: [
            "Pe perete: șuruburi cu cap lat prin găuri pre-forate sau distanțiere.",
            "Temporar: bandă dublu adezivă sau adeziv de montaj, pe suprafață curată.",
            "Pe gard sau stâlp: coliere prin găuri la colțuri.",
        ],
        delivery: (w, h) => (Math.max(w, h) >= 150 ? "plat, pe paletă" : "plat, în cutie"),
    },
    alucobond: {
        shortName: "Panou alucobond printat", article: "un", noun: "panou alucobond", outdoor: true, gsm: null, dpi: 150, bleedMm: 3,
        fileNote: "Panoul se poate freza pe contur; trimite forma ca traseu vectorial dacă vrei altceva decât dreptunghi.",
        usage: {
            mic: "Plăcuțe de firmă la intrare, numere de casă, etichete de aparate și plăcuțe pentru sedii de firmă: alucobondul mic arată ca metal masiv și nu se degradează la soare.",
            mediu: "Firma de la intrare, panoul de la poartă sau indicatorul de pe fațadă: aluminiul compozit rezistă peste 10 ani la exterior, pe distanțiere sau direct pe perete.",
            mare: "Panouri de fațadă, totemuri și panouri publicitare permanente. Placa e rigidă și nu se deformează, dar la peste 1,5 m pe latură are nevoie de o structură de prindere pe spate.",
            "foarte-mare": "Panourile foarte mari se taie din coli de 305 × 205 cm și se livrează pe segmente. Se livrează pe paletă, cu folie de protecție.",
        },
        mounting: [
            "Pe perete: distanțiere metalice sau șuruburi prin găuri pre-forate, la colțuri și pe laturile lungi.",
            "Pe structură: nituri sau șuruburi autoforante într-un cadru de aluminiu.",
            "Panoul se poate freza în V și îndoi pentru litere volumetrice și casete.",
        ],
        delivery: (w, h) => (Math.max(w, h) >= 150 ? "plat, pe paletă, cu folie de protecție" : "plat, în cutie cu colțare"),
    },
    carton: {
        shortName: "Placă de carton printată", article: "o", noun: "placă de carton", outdoor: false, gsm: null, dpi: 150, bleedMm: 3,
        fileNote: "Cartonul absoarbe puțin cerneala; fondurile foarte închise ies mai mate decât pe PVC.",
        usage: {
            mic: "Semne de masă, plăcuțe pentru evenimente, etichete de raft și display-uri mici: cartonul e cel mai ieftin material rigid și se reciclează după eveniment.",
            mediu: "Panouri pentru standuri, afișe rigide pentru interior, fundaluri de fotografie la evenimente: se sprijină pe șevalet sau se prinde cu bandă, fără șuruburi.",
            mare: "Formatele mari se folosesc pentru decor de eveniment și standuri de expoziție de câteva zile. Cartonul fagure de 10 mm rămâne drept la această mărime; cel ondulat se poate curba.",
            "foarte-mare": "Doar pentru interior și pentru perioade scurte: cartonul nu rezistă la umezeală. Pentru panouri mari și durabile alege polipropilena sau Forex-ul.",
        },
        mounting: [
            "Pe șevalet sau pe suport de podea, fără găuri.",
            "Pe perete: bandă dublu adezivă sau cârlige pe spate.",
            "Ferit de umezeală și de soare direct.",
        ],
        delivery: () => "plat, în cutie",
    },
    polipropilena: {
        shortName: "Panou polipropilenă printat", article: "un", noun: "panou de polipropilenă", outdoor: true, gsm: null, dpi: 150, bleedMm: 3,
        fileNote: "Structura alveolară se vede ușor în contralumină; pentru un aspect uniform alege un fond deschis.",
        usage: {
            mic: "Semne mici de exterior: „de vânzare”, „proaspăt vopsit”, indicatoare pentru parcare sau pentru evenimente. Se prind pe gard cu coliere sau pe țăruș în pământ.",
            mediu: "E panoul clasic de agenție imobiliară, de șantier sau de afișaj electoral: ușor, impermeabil, se prinde cu coliere prin găuri și rezistă câteva sezoane afară.",
            mare: "Panouri de șantier, indicatoare de eveniment și display-uri reutilizabile: la peste 1 m pe latură se prinde în cel puțin șase puncte ca să nu vibreze în vânt.",
            "foarte-mare": "Formatele mari au nevoie de cadru; panoul e ușor, dar suprafața prinde vânt. Pentru afișaj permanent la această mărime, alucobondul e mai stabil.",
        },
        mounting: [
            "Pe gard sau stâlp: coliere de plastic prin găuri date la colțuri.",
            "În pământ: pe țăruși de lemn sau metal prinși cu șuruburi.",
            "Pe perete: șuruburi cu șaibe late sau bandă dublu adezivă la interior.",
        ],
        delivery: () => "plat, în cutie",
    },
    afise: {
        shortName: "Afiș", article: "un", noun: "afiș", outdoor: false, gsm: 150, dpi: 300, bleedMm: 3,
        fileNote: "PDF cu 3 mm bleed pe fiecare latură; la A1 și A0 sunt suficiente 150 DPI.",
        usage: {
            mic: "Format de raft, de avizier și de vitrină mică; se tipărește în tiraje mari la preț de bucată foarte mic.",
            mediu: "Format de vitrină, de panou de interior și de eveniment; blueback-ul e alegerea pentru lipit pe panouri stradale.",
            mare: "Afiș de expoziție, de cinema sau de campanie; se livrează în tub ca să nu se cuteze.",
            "foarte-mare": "Formatele mari se folosesc pentru panouri stradale și expoziții; pentru exterior permanent alege bannerul.",
        },
        mounting: ["Pe vitrină: bandă dublu adezivă transparentă sau ventuze.", "Pe avizier și panouri: piuneze sau clei de afișaj (blueback).", "În ramă: cu paspartu, la formatele standard."],
        delivery: (w, h) => (Math.max(w, h) >= 59 ? "în tub, rulat" : "plat, între cartoane"),
    },
    rollup: {
        shortName: "Roll-up", article: "un", noun: "roll-up", outdoor: false, gsm: 440, dpi: 150, bleedMm: 0,
        fileNote: "Ține textele importante în treimea de sus a printului; partea de jos, sub 60 cm, e acoperită adesea de mese sau de public.",
        usage: {
            mic: "Roll-up-ul compact merge la conferințe și în magazine, unde spațiul e strâmt.",
            mediu: "E formatul standard de stand, recepție și eveniment: se desface în 30 de secunde și intră în geanta livrată.",
            mare: "Lățimile mari se folosesc ca fundal de prezentare sau ca perete de stand din două-trei bucăți alăturate.",
            "foarte-mare": "Pentru pereți întregi de stand, combină mai multe roll-up-uri de aceeași lățime.",
        },
        mounting: ["Se desface în 30 de secunde: scoți piciorul, ridici catargul, agăți printul.", "Doar interior sau exterior fără vânt și ploaie.", "Printul se poate înlocui, caseta rămâne."],
        delivery: () => "în geantă de transport, gata de folosit",
    },
    pliante: {
        shortName: "Pliant", article: "un", noun: "pliant", outdoor: false, gsm: 135, dpi: 300, bleedMm: 3,
        fileNote: "Fișier deschis, cu bleed de 3 mm și liniile de big marcate; textul la minimum 5 mm de pliuri.",
        usage: {
            mic: "Format de buzunar, ideal pentru meniuri și prezentări scurte distribuite la ghișeu.",
            mediu: "Formatul clasic de prezentare a serviciilor, pliat în două sau în trei.",
            mare: "Format de broșură de prezentare, cu spațiu pentru fotografii mari.",
            "foarte-mare": "Pentru mai multe pagini, alege o broșură capsată în loc de pliant.",
        },
        mounting: ["Se distribuie la ghișeu, în plicuri sau pe stand.", "Hârtia de 135-170 g se pliază curat; peste 200 g e nevoie de big."],
        delivery: () => "în cutii, pliate, gata de distribuit",
    },
    flayere: {
        shortName: "Flyer", article: "un", noun: "flyer", outdoor: false, gsm: 135, dpi: 300, bleedMm: 3,
        fileNote: "PDF cu bleed de 3 mm; textul la minimum 3 mm de linia de tăiere.",
        usage: {
            mic: "Format de distribuție stradală și de cutie poștală, în tiraje de sute sau mii de bucăți.",
            mediu: "Format de promoție de magazin și de invitație la eveniment.",
            mare: "Format de afiș mic, pentru avizier și vitrină.",
            "foarte-mare": "Pentru formate mai mari, vezi afișele.",
        },
        mounting: ["Distribuție stradală, în cutii poștale, la casă sau în pachetele de livrare."],
        delivery: () => "în cutii, gata de distribuit",
    },
    "carti-vizita": {
        shortName: "Cărți de vizită", article: "o", noun: "carte de vizită", outdoor: false, gsm: 350, dpi: 300, bleedMm: 3,
        fileNote: "PDF cu bleed de 3 mm, texte la minimum 3 mm de tăiere, fonturi convertite în curbe.",
        usage: {
            mic: "Format standard de carte de vizită, care încape în orice portofel și suport de birou.",
            mediu: "Format standard de carte de vizită.",
            mare: "Format standard de carte de vizită.",
            "foarte-mare": "Format standard de carte de vizită.",
        },
        mounting: ["Se livrează tăiate la format, în cutii de câte 100."],
        delivery: () => "în cutii de câte 100, tăiate la format",
    },
};

type BrandVoice = {
    brandName: string;
    angle: string;
    intro: (p: ProductInfo, size: string, sizeClassText: string, fromPrice: string) => string[];
    sections: SectionId[];
    priceHeading: string;
    usageHeading: string;
    fileHeading: string;
    mountingHeading: string;
    neighborsHeading: string;
    localitiesHeading: string;
    ctaLabel: string;
    descPrefix: string;
};

const VOICES: Record<BrandKey, BrandVoice> = {
    adbanner: {
        brandName: "AdBanner",
        angle: "publicitate outdoor",
        intro: (p, size, cls, from) => [
            `${cap(p.article)} ${p.noun} de ${size} cm este ${cls}. AdBanner îl produce în atelier propriu, cu preț calculat pe suprafață: de la ${from} pe bucată, cu grafica ta, fără costuri ascunse.`,
            "Mai jos ai prețurile la fiecare cantitate, greutatea și numărul de capse, rezoluția la care trebuie trimis fișierul și unde se folosește de obicei această mărime.",
        ],
        sections: ["price", "facts", "usage", "file", "faq", "neighbors", "localities"],
        priceHeading: "Preț calculat pentru",
        usageHeading: "Unde se folosește această mărime",
        fileHeading: "Fișierul pentru print",
        mountingHeading: "Montaj",
        neighborsHeading: "Dimensiuni apropiate",
        localitiesHeading: "Livrăm în toată țara",
        ctaLabel: "Configurează și comandă",
        descPrefix: "Comandă",
    },
    anexa1: {
        brandName: "Anexa1",
        angle: "panouri rigide și semnalistică",
        intro: (p, size, cls, from) => [
            `Fișă de produs pentru ${p.noun} ${size} cm, ${cls}: preț de la ${from} pe bucată, cu specificațiile de material, greutate și fișier listate mai jos.`,
            "Anexa1 lucrează cu firme și instituții care au nevoie de dimensiuni exacte și de un preț clar înainte de comandă; totul se configurează online, cu grafica ta.",
        ],
        sections: ["facts", "price", "file", "usage", "faq", "neighbors", "localities"],
        priceHeading: "Listă de preț pentru",
        usageHeading: "Aplicații tipice",
        fileHeading: "Specificații fișier",
        mountingHeading: "Sisteme de prindere",
        neighborsHeading: "Alte dimensiuni din gamă",
        localitiesHeading: "Livrare națională",
        ctaLabel: "Deschide configuratorul",
        descPrefix: "Fișă tehnică și preț:",
    },
    euprint: {
        brandName: "EuPrint",
        angle: "materiale pentru proiecte cu finanțare",
        intro: (p, size, cls, from) => [
            `${cap(p.article)} ${p.noun} de ${size} cm, ${cls}, costă de la ${from} pe bucată la EuPrint, cu grafica ta și prețul calculat automat pe suprafață.`,
            "Această mărime apare des în proiectele cu finanțare europeană și națională (panouri temporare, plăci permanente, afișe de informare), unde dimensiunea e stabilită de manualul de identitate; mai jos ai datele de care ai nevoie ca să o comanzi corect.",
        ],
        sections: ["price", "usage", "facts", "file", "faq", "neighbors", "localities"],
        priceHeading: "Prețuri pentru",
        usageHeading: "Pentru ce se folosește",
        fileHeading: "Cum pregătești fișierul",
        mountingHeading: "Montaj și amplasare",
        neighborsHeading: "Dimensiuni înrudite",
        localitiesHeading: "Livrăm oriunde în România",
        ctaLabel: "Comandă online",
        descPrefix: "Comandă la preț accesibil",
    },
    homeprint: {
        brandName: "HomePrint",
        angle: "decor și print pentru casă",
        intro: (p, size, cls, from) => [
            `Dacă ai măsurat peretele sau spațiul și ai ajuns la ${size} cm, ${p.noun} de la HomePrint costă de la ${from}, cu poza sau grafica ta.`,
            `E ${cls}; mai jos vezi cum arată în cameră, cât cântărește și ce rezoluție trebuie să aibă fotografia ca să iasă clară la această mărime.`,
        ],
        sections: ["usage", "price", "file", "facts", "faq", "neighbors", "localities"],
        priceHeading: "Cât costă",
        usageHeading: "Cum arată în spațiu",
        fileHeading: "Ce rezoluție trebuie să aibă poza",
        mountingHeading: "Cum se montează",
        neighborsHeading: "Mărimi apropiate",
        localitiesHeading: "Livrare la domiciliu",
        ctaLabel: "Încarcă poza și comandă",
        descPrefix: "Personalizează",
    },
    prynt: {
        brandName: "Prynt",
        angle: "print personalizat și merch",
        intro: (p, size, cls, from) => [
            `${cap(p.noun)} ${size} cm la Prynt: de la ${from} pe bucată, ${cls}, gata în ${"{turnaround}"}.`,
            "Încarci grafica, alegi materialul și vezi prețul pe loc. Mai jos ai prețurile pe cantități, dimensiunea fișierului în pixeli și recomandările pentru această mărime.",
        ],
        sections: ["price", "file", "usage", "facts", "faq", "neighbors", "localities"],
        priceHeading: "Prețul pentru",
        usageHeading: "La ce e bună mărimea asta",
        fileHeading: "Fișierul tău",
        mountingHeading: "Montaj rapid",
        neighborsHeading: "Alte mărimi",
        localitiesHeading: "Livrare prin curier",
        ctaLabel: "Personalizează acum",
        descPrefix: "Personalizează",
    },
    shopprint: {
        brandName: "ShopPrint",
        angle: "tipografie online",
        intro: (p, size, cls, from) => [
            `${cap(p.article)} ${p.noun} de ${size} cm se comandă online la ShopPrint de la ${from} pe bucată; e ${cls}, produs în tipografie proprie și livrat prin curier.`,
            "Pagina de mai jos strânge tot ce trebuie să știi înainte de comandă: prețul la 1, 2, 5 și 10 bucăți, greutatea și cum se pregătește fișierul.",
        ],
        sections: ["price", "facts", "file", "usage", "faq", "neighbors", "localities"],
        priceHeading: "Prețuri",
        usageHeading: "Utilizări frecvente",
        fileHeading: "Pregătirea fișierului",
        mountingHeading: "Montaj",
        neighborsHeading: "Dimensiuni apropiate",
        localitiesHeading: "Livrăm în toate județele",
        ctaLabel: "Comandă online",
        descPrefix: "Comandă",
    },
    tablou: {
        brandName: "Tablou",
        angle: "tablouri și decor din fotografii",
        intro: (p, size, cls, from) => [
            `${cap(p.noun)} de ${size} cm, ${cls}: de la ${from} cu fotografia ta, printată la Tablou.net.`,
            "Mai jos vezi ce rezoluție trebuie să aibă poza ca să iasă clară la această mărime, cât cântărește produsul final și cât costă la mai multe bucăți.",
        ],
        sections: ["file", "price", "usage", "facts", "faq", "neighbors", "localities"],
        priceHeading: "Preț pentru",
        usageHeading: "Unde se potrivește",
        fileHeading: "Rezoluția pozei",
        mountingHeading: "Montaj pe perete",
        neighborsHeading: "Mărimi apropiate",
        localitiesHeading: "Livrare în toată țara",
        ctaLabel: "Încarcă poza",
        descPrefix: "Comandă",
    },
};

function cap(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function sizeClassOf(sqm: number): SizeClass {
    if (sqm < 0.5) return "mic";
    if (sqm < 2) return "mediu";
    if (sqm < 6) return "mare";
    return "foarte-mare";
}

function aspectOf(w: number, h: number): Aspect {
    const r = Math.max(w, h) / Math.min(w, h);
    if (r === 1) return "patrat";
    if (r < 1.4) return "aproape-patrat";
    if (r < 2.5) return "dreptunghi";
    return "panoramic";
}

function orientationOf(w: number, h: number): Orientation {
    if (w === h) return "square";
    return w > h ? "landscape" : "portrait";
}

function sizeClassText(cls: SizeClass, sqm: number, aspect: Aspect, orientation: Orientation): string {
    const clsText: Record<SizeClass, string> = {
        mic: "un format mic",
        mediu: "un format mediu",
        mare: "un format mare",
        "foarte-mare": "un format foarte mare",
    };
    const aspectText: Record<Aspect, string> = {
        patrat: "pătrat",
        "aproape-patrat": "aproape pătrat",
        dreptunghi: orientation === "landscape" ? "dreptunghiular, orizontal" : "dreptunghiular, vertical",
        panoramic: orientation === "landscape" ? "panoramic, tip bandă orizontală" : "vertical alungit, tip stâlp",
    };
    return `${clsText[cls]}, ${aspectText[aspect]}, de ${fmtSqm(sqm)} m²`;
}

function fmtSqm(v: number): string {
    return new Intl.NumberFormat("ro-RO", { maximumFractionDigits: 2 }).format(Math.round(v * 100) / 100);
}

function fmtKg(kg: number): string {
    if (kg < 1) return `${Math.round(kg * 1000)} g`;
    return `${new Intl.NumberFormat("ro-RO", { maximumFractionDigits: 1 }).format(Math.round(kg * 10) / 10)} kg`;
}

function pxAt(cm: number, dpi: number): number {
    return Math.round((cm / 2.54) * dpi);
}

function fmtInt(n: number): string {
    return new Intl.NumberFormat("ro-RO").format(n);
}

/** Greutatea aproximativă a unei bucăți, kg. */
function weightKg(productId: string, w: number, h: number): { kg: number; note: string } | null {
    const sqm = (w / 100) * (h / 100);
    switch (productId) {
        case "banner": return { kg: sqm * 0.44, note: "Frontlit 440 g/m²" };
        case "banner-verso": return { kg: sqm * 0.65, note: "Blockout 650 g/m²" };
        case "mesh": return { kg: sqm * 0.37, note: "mesh 370 g/m²" };
        case "canvas": return { kg: sqm * 0.36, note: "pânză polyester 360 g/m², fără șasiu" };
        case "plexiglass": return { kg: sqm * 1.19 * 3, note: "plexiglas 3 mm, densitate 1,19 g/cm³" };
        case "pvc-forex": return { kg: sqm * 0.55 * 3, note: "Forex 3 mm, aproximativ 0,55 g/cm³" };
        case "alucobond": return { kg: sqm * 3.8, note: "alucobond 3 mm, 3,8 kg/m²" };
        case "carton": return { kg: sqm * 0.5, note: "carton ondulat, aproximativ 500 g/m²" };
        case "polipropilena": return { kg: sqm * 0.75, note: "polipropilenă 4 mm, 750 g/m²" };
        case "afise": return { kg: sqm * 0.15, note: "hârtie 150 g/m²" };
        case "rollup": return { kg: 3.5, note: "casetă de aluminiu cu print, conform fișei" };
        default: return null;
    }
}

const TOP_CITIES: Array<{ judet: string; loc: string; name: string }> = [
    { judet: "bucuresti", loc: "bucuresti", name: "București" },
    { judet: "cluj", loc: "cluj-napoca", name: "Cluj-Napoca" },
    { judet: "timis", loc: "timisoara", name: "Timișoara" },
    { judet: "iasi", loc: "iasi", name: "Iași" },
    { judet: "constanta", loc: "constanta", name: "Constanța" },
    { judet: "dolj", loc: "craiova", name: "Craiova" },
    { judet: "brasov", loc: "brasov", name: "Brașov" },
    { judet: "galati", loc: "galati", name: "Galați" },
    { judet: "prahova", loc: "ploiesti", name: "Ploiești" },
    { judet: "bihor", loc: "oradea", name: "Oradea" },
    { judet: "braila", loc: "braila", name: "Brăila" },
    { judet: "arad", loc: "arad", name: "Arad" },
    { judet: "sibiu", loc: "sibiu", name: "Sibiu" },
    { judet: "bacau", loc: "bacau", name: "Bacău" },
    { judet: "arges", loc: "pitesti", name: "Pitești" },
    { judet: "mures", loc: "targu-mures", name: "Târgu Mureș" },
    { judet: "ilfov", loc: "voluntari", name: "Voluntari" },
    { judet: "suceava", loc: "suceava", name: "Suceava" },
];

/** 8 orașe, rotite după mărime ca să nu aibă toate paginile aceleași link-uri. */
export function getLocalityLinks(productId: string, w: number, h: number): Array<{ href: string; name: string }> {
    const start = (w * 7 + h * 3) % TOP_CITIES.length;
    const out: Array<{ href: string; name: string }> = [];
    for (let i = 0; i < 8; i++) {
        const c = TOP_CITIES[(start + i) % TOP_CITIES.length];
        out.push({ href: `/judet/${c.judet}/${c.loc}/${productId}`, name: c.name });
    }
    return out;
}

export function getProductInfo(productId: string): ProductInfo | undefined {
    return PRODUCTS[productId];
}

export function buildDimensionContent(input: {
    brand: BrandKey;
    productId: string;
    size: DimSize;
    pricing: DimensionPricing;
}): DimensionContent | null {
    const { brand, productId, size, pricing } = input;
    const info = PRODUCTS[productId];
    const cfg = getDimProduct(productId);
    if (!info || !cfg) return null;
    const voice = VOICES[brand];

    const { w, h } = size;
    const sqm = (w / 100) * (h / 100);
    const cls = sizeClassOf(sqm);
    const aspect = aspectOf(w, h);
    const orientation = orientationOf(w, h);
    const sizeStr = `${w}x${h}`;
    const named = size.label && !/landscape/.test(size.label) ? size.label : namedFormatFor(w, h);
    const sizeLabel = named ? `${w}×${h} cm (${named})` : `${w}×${h} cm`;
    const from = formatLei(pricing.fromPrice);
    const turnaround = cfg.turnaroundTime || "2-4 zile lucrătoare";
    const clsText = sizeClassText(cls, sqm, aspect, orientation);
    const isPreset = cfg.dimensions.type === "preset";

    // ---- fapte calculate
    const facts: DimensionFact[] = [];
    facts.push({ label: "Dimensiune", value: `${w} × ${h} cm`, detail: named ? `format ${named}` : `${orientation === "landscape" ? "orizontal" : orientation === "portrait" ? "vertical" : "pătrat"}, raport ${ratioText(w, h)}` });
    if (!isPreset || productId === "afise") {
        facts.push({ label: "Suprafață", value: `${fmtSqm(sqm)} m²`, detail: sqm < 0.5 ? "sub 0,5 m²: prețul pe m² include un adaos pentru formate mici" : `prețul se calculează pe ${fmtSqm(sqm)} m² per bucată` });
    }
    const wt = weightKg(productId, w, h);
    if (wt) facts.push({ label: "Greutate", value: `~${fmtKg(wt.kg)}`, detail: wt.note + (info.weightNote ? `; ${info.weightNote}` : "") });
    if (["banner", "banner-verso", "mesh"].includes(productId)) {
        const perimeter = 2 * (w + h);
        const grommets = Math.max(4, Math.ceil(perimeter / 50));
        facts.push({ label: "Capse", value: `${grommets} capse`, detail: `la pasul standard de 50 cm, pe un perimetru de ${fmtInt(perimeter)} cm` });
        const letter = Math.max(5, Math.round(h * 0.5));
        facts.push({ label: "Litere", value: `până la ${letter} cm`, detail: `un rând de text cu litere de ${letter} cm se citește de la ~${Math.round(letter * 3)} m` });
    }
    if (productId === "canvas") {
        facts.push({ label: "Variantă", value: "fără șasiu", detail: "pânza printată, rulată; varianta cu șasiu (gata de agățat) are dimensiuni fixe, în configurator" });
    }
    facts.push({ label: "Fișier la 1:1", value: `${fmtInt(pxAt(w, info.dpi))} × ${fmtInt(pxAt(h, info.dpi))} px`, detail: `la ${info.dpi} DPI, scara 1:1` });
    facts.push({ label: "Producție", value: turnaround, detail: `se livrează ${info.delivery(w, h)}` });
    if (info.extraFacts) facts.push(...info.extraFacts(w, h));

    // ---- intro
    const intro = voice.intro(info, sizeStr, clsText, from).map((s) => s.replace("{turnaround}", turnaround));

    // ---- utilizare
    const usageParas = [info.usage[cls]];
    usageParas.push(aspectAdvice(productId, aspect, orientation, w, h));

    // ---- fișier
    const fileItems: string[] = [];
    fileItems.push(`Trimite fișierul la scară 1:1, ${w} × ${h} cm, la minimum ${info.dpi} DPI: ${fmtInt(pxAt(w, info.dpi))} × ${fmtInt(pxAt(h, info.dpi))} pixeli.`);
    if (Math.max(w, h) >= 300) {
        fileItems.push(`La formate de peste 3 m poți trimite și la 72 DPI (${fmtInt(pxAt(w, 72))} × ${fmtInt(pxAt(h, 72))} px); de la distanța de citire diferența nu se vede.`);
    }
    if (info.bleedMm > 0 && productId !== "tapet") {
        fileItems.push(`Adaugă bleed de ${info.bleedMm} mm pe fiecare latură: documentul devine ${fmtMm(w * 10 + 2 * info.bleedMm)} × ${fmtMm(h * 10 + 2 * info.bleedMm)} mm.`);
    }
    fileItems.push(info.fileNote);
    fileItems.push(...(cfg.technicalSpecs ?? []).filter((s) => /Fișiere|Profil|CMYK|Rezoluție/i.test(s)).slice(0, 2));

    // ---- FAQ
    const rec = pricing.recommended;
    const q1 = rec.rows[0];
    const qLast = rec.rows[rec.rows.length - 1];
    const faq: Array<{ q: string; a: string }> = [];
    faq.push({
        q: `Cât costă ${info.article} ${info.noun} de ${w}x${h} cm?`,
        a: q1.unit > qLast.unit
            ? `${formatLei(q1.unit)} pentru o bucată pe varianta ${rec.label.toLowerCase()}, cu grafica ta. La ${qLast.qty} bucăți prețul ajunge la ${formatLei(qLast.unit)} pe bucată (${formatLei(qLast.total)} în total). Prețul se calculează automat în configurator pentru orice combinație de material și finisaje.`
            : `${formatLei(q1.unit)} pe bucată pe varianta ${rec.label.toLowerCase()}, cu grafica ta; ${qLast.qty} bucăți costă ${formatLei(qLast.total)}. Prețul se calculează automat în configurator pentru orice combinație de material și finisaje.`,
    });
    if (sqm < 0.5 && !isPreset) {
        faq.push({
            q: `De ce e prețul pe m² mai mare la ${w}x${h} cm decât la un format mare?`,
            a: `Sub 0,5 m² intervin costuri fixe de pregătire, tăiere și finisare care nu depind de mărime, așa că prețul pe metru pătrat include un adaos pentru formate mici. Dacă ai nevoie de mai multe bucăți, comandă-le împreună: suprafața totală crește și adaosul scade sau dispare.`,
        });
    } else if (rec.rows.length > 1 && q1.unit > qLast.unit) {
        faq.push({
            q: `Scade prețul dacă comand mai multe bucăți de ${w}x${h} cm?`,
            a: `Da. Prețul pe bucată scade de la ${formatLei(q1.unit)} la o bucată până la ${formatLei(qLast.unit)} la ${qLast.qty} bucăți, pentru că tarifele pe metru pătrat scad pe praguri de suprafață totală.`,
        });
    }
    if (wt) {
        faq.push({
            q: `Cât cântărește ${info.article} ${info.noun} de ${w}x${h} cm?`,
            a: `Aproximativ ${fmtKg(wt.kg)} (${wt.note}). Se livrează ${info.delivery(w, h)}, prin curier, în ${turnaround} de la confirmarea graficii.`,
        });
    }
    faq.push({
        q: `Ce rezoluție trebuie să aibă fișierul pentru ${w}x${h} cm?`,
        a: `La scară 1:1 și ${info.dpi} DPI, ${fmtInt(pxAt(w, info.dpi))} × ${fmtInt(pxAt(h, info.dpi))} pixeli. ${info.fileNote}`,
    });
    if (["banner", "banner-verso", "mesh"].includes(productId)) {
        const grommets = Math.max(4, Math.ceil((2 * (w + h)) / 50));
        faq.push({
            q: `Câte capse are un banner de ${w}x${h} cm?`,
            a: `La pasul standard de 50 cm rezultă ${grommets} capse pe perimetrul de ${fmtInt(2 * (w + h))} cm, plus tiv pe toate laturile. ${sqm >= 6 ? "La această suprafață recomandăm găuri de vânt sau mesh pentru exterior." : "Dacă vrei alt pas sau buzunar pentru tub, scrie în observațiile comenzii."}`,
        });
    }
    if (cfg.faq && cfg.faq.length > 0 && productId !== "canvas") {
        const extra = cfg.faq[(w + h) % cfg.faq.length];
        if (extra && !faq.some((f) => f.q === extra.q)) faq.push({ q: extra.q, a: extra.a });
    }

    // ---- meta
    const metaTitle = `${info.shortName} ${w}x${h} cm – preț de la ${from} | ${voice.brandName}`;
    const metaDescription = trimTo(
        `${voice.descPrefix} ${info.noun} ${w}x${h} cm (${fmtSqm(sqm)} m²) de la ${from}/buc, ${formatLei(qLast.unit)}/buc la ${qLast.qty} buc. ${wt ? `~${fmtKg(wt.kg)}, ` : ""}fișier ${fmtInt(pxAt(w, info.dpi))}×${fmtInt(pxAt(h, info.dpi))} px, gata în ${turnaround}.`,
        158,
    );

    return {
        metaTitle,
        metaDescription,
        h1: `${info.shortName} ${w}×${h} cm`,
        subtitle: `${cap(clsText)}. Preț de la ${from} pe bucată, cu grafica ta, produs în ${turnaround}.`,
        intro,
        facts,
        usage: { heading: voice.usageHeading, paragraphs: usageParas },
        file: { heading: voice.fileHeading, items: fileItems },
        mounting: { heading: voice.mountingHeading, paragraphs: info.mounting },
        faq,
        sections: voice.sections,
        priceHeading: voice.priceHeading,
        priceIntro: `Prețurile de mai jos sunt calculate cu același motor ca în configurator, pentru ${w} × ${h} cm, cu grafica ta (fără taxa de design). TVA inclus.`,
        neighborsHeading: voice.neighborsHeading,
        localitiesHeading: voice.localitiesHeading,
        ctaLabel: voice.ctaLabel,
        productLabel: info.shortName,
        sizeLabel,
    };
}

function ratioText(w: number, h: number): string {
    const g = gcd(w, h);
    const a = w / g;
    const b = h / g;
    if (a <= 20 && b <= 20) return `${a}:${b}`;
    const r = w / h;
    return `${new Intl.NumberFormat("ro-RO", { maximumFractionDigits: 2 }).format(Math.round(r * 100) / 100)}:1`;
}

function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
}

function fmtMm(mm: number): string {
    return fmtInt(Math.round(mm));
}

function trimTo(s: string, max: number): string {
    if (s.length <= max) return s;
    return s.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
}

function aspectAdvice(productId: string, aspect: Aspect, orientation: Orientation, w: number, h: number): string {
    const isBannerLike = ["banner", "banner-verso", "mesh"].includes(productId);
    const isDecor = ["canvas", "tapet"].includes(productId);
    if (aspect === "panoramic") {
        if (orientation === "landscape") {
            return isBannerLike
                ? `Proporția de ${ratioText(w, h)} e o bandă orizontală: pune mesajul pe un singur rând, cu logo-ul la un capăt și contactul la celălalt. Textul pe două rânduri ar ajunge la litere de sub ${Math.round(h / 3)} cm, greu de citit de departe.`
                : isDecor
                    ? `Formatul panoramic de ${ratioText(w, h)} se potrivește deasupra canapelei sau a patului, cu o fotografie de peisaj sau un montaj din mai multe poze pe orizontală.`
                    : `Formatul de bandă orizontală (${ratioText(w, h)}) e tipic pentru indicatoare, frize și panouri de deasupra ușii, cu text pe un singur rând.`;
        }
        return isBannerLike
            ? `Formatul vertical alungit (${ratioText(w, h)}) se folosește pe stâlpi, lângă uși sau ca steag pe consolă; textul se pune pe rânduri scurte, unul sub altul, sau rotit pe verticală.`
            : isDecor
                ? `Formatul vertical alungit se potrivește pe pereți înguști, între ferestre sau uși, cu o fotografie portret sau un detaliu de peisaj tăiat pe înălțime.`
                : `Formatul vertical alungit (${ratioText(w, h)}) e tipic pentru totemuri și indicatoare de lângă uși, cu informația ordonată de sus în jos.`;
    }
    if (aspect === "patrat" || aspect === "aproape-patrat") {
        return isBannerLike
            ? `Formatul ${aspect === "patrat" ? "pătrat" : "aproape pătrat"} lasă loc pentru logo sus, mesaj la mijloc și contact jos, pe trei zone egale; e ușor de citit de la orice unghi.`
            : isDecor
                ? `Formatul ${aspect === "patrat" ? "pătrat" : "aproape pătrat"} merge bine pentru portrete strânse, poze de pe telefon și seturi de mai multe piese aliniate pe același perete.`
                : `Formatul ${aspect === "patrat" ? "pătrat" : "aproape pătrat"} se folosește pentru plăcuțe, pictograme și panouri cu logo centrat.`;
    }
    // dreptunghi
    return orientation === "landscape"
        ? isBannerLike
            ? `Proporția de ${ratioText(w, h)} permite două rânduri de text lizibile de la distanță, plus logo; e formatul cel mai comod de compus pentru majoritatea reclamelor.`
            : isDecor
                ? `Proporția de ${ratioText(w, h)} e apropiată de cadrul unei fotografii obișnuite (3:2 sau 4:3), deci poza se folosește aproape fără tăieturi.`
                : `Proporția de ${ratioText(w, h)}, orizontală, e formatul obișnuit de panou de firmă și de afișaj informativ.`
        : isBannerLike
            ? `Formatul vertical de ${ratioText(w, h)} se folosește pe stâlpi, pe laterala intrării sau pe garduri înalte; textul se așază pe rânduri scurte.`
            : isDecor
                ? `Formatul vertical de ${ratioText(w, h)} e potrivit pentru portrete și fotografii de pe telefon, care sunt oricum verticale.`
                : `Formatul vertical de ${ratioText(w, h)} e tipic pentru afișe, indicatoare de ușă și totemuri de interior.`;
}
