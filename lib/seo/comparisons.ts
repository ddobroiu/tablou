// Pagini de comparație (/comparatii/{slug}): două-trei variante de produs sau
// material puse față în față, cu diferențele reale din registru și prețurile
// din motorul configuratorului pentru aceleași mărimi sau tiraje. Textul e
// scris de mână, o singură dată, pentru fiecare comparație; prețurile se
// calculează la randare.
import { getDimensionPricing } from "./dimensionPricing";
import { getSize, dimensionUrl } from "./dimensionPages";
import { QTY_PRODUCTS, getQtyPricing, qtyUrl } from "./quantityPages";

export type ComparisonOption = {
    name: string;
    /** produs pe dimensiuni + cheia variantei din dimensionPricing, sau produs la cantitate + cheia variantei din quantityPages */
    dim?: { productId: string; variantKey: string };
    qty?: { productSlug: string; formatKey: string; variantKey: string };
    /** puncte forte, scrise pentru comparație */
    pros: string[];
    cons: string[];
    bestFor: string;
};

export type Comparison = {
    slug: string;
    title: string;
    question: string;
    intro: string;
    options: ComparisonOption[];
    /** mărimi (cm) pentru tabelul de prețuri la produse pe dimensiuni */
    sizes?: Array<[number, number]>;
    /** cantități pentru tabelul de prețuri la produse la tiraj */
    quantities?: number[];
    verdict: string;
    faq: Array<{ q: string; a: string }>;
};

export const COMPARISONS: Comparison[] = [
    {
        slug: "frontlit-440-vs-510",
        title: "Frontlit 440 g/m² sau 510 g/m² pentru banner",
        question: "Ce material aleg pentru banner: 440 sau 510 g/m²?",
        intro: "Ambele sunt PVC frontlit, printate la fel, cu tiv și capse incluse. Diferența e grosimea și rezistența în timp: 440 g/m² e standardul pentru campanii de până la un an, 510 g/m² rezistă mai mult la soare și vânt și costă cu 10% mai mult.",
        options: [
            { name: "Frontlit 440 g/m²", dim: { productId: "banner", variantKey: "frontlit-440" }, pros: ["Cel mai mic preț pe m²", "Rezistență 6-12 luni la exterior", "Mai ușor, se pliază compact"], cons: ["Se decolorează mai repede la soare puternic", "Mai sensibil la vânt pe formate mari"], bestFor: "promoții, evenimente, bannere de sezon" },
            { name: "Frontlit 510 g/m²", dim: { productId: "banner", variantKey: "frontlit-510" }, pros: ["Rezistență 12-24 luni la exterior", "Mai rigid, ține mai bine pe cadru", "Print la fel de bun"], cons: ["+10% la preț", "Mai greu la formate mari"], bestFor: "fațade, garduri de șantier, afișaj permanent" },
        ],
        sizes: [[200, 100], [300, 100], [400, 200]],
        verdict: "Pentru sub un an de expunere, 440 g/m². Pentru fațade și tot ce stă afară mai mult de un an, 510 g/m²: diferența de 10% e mai mică decât costul unei reprintări.",
        faq: [
            { q: "Se vede diferența de calitate a printului?", a: "Nu: printul e identic, la aceeași rezoluție. Diferența e în material, nu în imagine." },
            { q: "Tivul și capsele sunt incluse la ambele?", a: "Da, la ambele materiale, cu capse la pasul standard." },
        ],
    },
    {
        slug: "banner-vs-mesh",
        title: "Banner frontlit sau mesh microperforat",
        question: "Banner plin sau mesh: ce pun pe fațadă, schelă sau gard?",
        intro: "Bannerul frontlit e plin, cu culori saturate, și prinde vânt. Mesh-ul e țesut microperforat de 370 g/m², lasă aerul să treacă și rezistă pe suprafețe mari expuse; culorile sunt puțin mai puțin saturate, iar detaliile fine se pierd în perforații.",
        options: [
            { name: "Banner frontlit 440 g/m²", dim: { productId: "banner", variantKey: "frontlit-440" }, pros: ["Culori saturate, detalii fine", "Opac: fundalul nu se vede prin el", "Preț mic pe m²"], cons: ["Prinde vânt: pe suprafețe mari are nevoie de găuri de vânt", "Pe schele poate smulge prinderea"], bestFor: "vitrine, garduri mici, evenimente, interior" },
            { name: "Mesh 370 g/m²", dim: { productId: "mesh", variantKey: "mesh-370" }, pros: ["Vântul trece prin material", "Potrivit pentru schele, fațade, garduri de plasă", "Tiv și capse incluse"], cons: ["Culori mai puțin saturate", "Text sub 5 cm greu de citit", "Nu e opac"], bestFor: "schele, fațade, suprafețe peste 6 m² la exterior" },
        ],
        sizes: [[300, 100], [400, 200], [500, 300]],
        verdict: "Sub 6 m² și la adăpost de vânt: banner. Pe schele, fațade și orice suprafață mare expusă: mesh.",
        faq: [
            { q: "Pot pune găuri de vânt la banner în loc de mesh?", a: "Da, găurile de vânt (+10%) reduc presiunea, dar pe schele și fațade mari mesh-ul rămâne soluția sigură." },
            { q: "Mesh-ul se vede din ambele părți?", a: "Este semi-transparent: din spate se ghicește imaginea, dar nu e făcut pentru citire din ambele părți." },
        ],
    },
    {
        slug: "forex-vs-alucobond-vs-plexiglas",
        title: "PVC Forex, alucobond sau plexiglas pentru plăci și panouri",
        question: "Din ce material fac placa de firmă sau panoul?",
        intro: "Trei materiale rigide, trei bugete. Forex-ul e PVC expandat, ușor și ieftin, bun la interior și la exterior temporar. Alucobondul e aluminiu compozit, cel mai rezistent la exterior, pentru firme și fațade. Plexiglasul e acrilic, transparent sau alb, pentru un aspect premium și casete luminoase.",
        options: [
            { name: "PVC Forex 3 mm", dim: { productId: "pvc-forex", variantKey: "forex-3" }, pros: ["Cel mai mic preț", "Ușor, se prinde cu adeziv sau șuruburi", "Bun la interior și exterior temporar"], cons: ["Se poate curba la soare pe formate mari", "Aspect mai simplu"], bestFor: "panouri de informare, indicatoare, standuri, firme temporare" },
            { name: "Alucobond 3 mm", dim: { productId: "alucobond", variantKey: "alu-3" }, pros: ["Rezistență 10+ ani la exterior", "Rigid, nu se deformează", "Se poate freza pentru litere"], cons: ["Preț mai mare", "Mai greu, are nevoie de prindere solidă"], bestFor: "firme de exterior, fațade, totemuri permanente" },
            { name: "Plexiglas alb 3 mm", dim: { productId: "plexiglass", variantKey: "alb-3" }, pros: ["Aspect premium, lucios", "Difuzează lumina în casete luminoase", "Print UV direct"], cons: ["Cel mai scump", "Fragil la lovituri, se zgârie"], bestFor: "plăci de firmă la intrare, recepții, casete luminoase" },
        ],
        sizes: [[50, 30], [100, 50], [150, 100]],
        verdict: "Temporar sau interior: Forex. Exterior permanent: alucobond. Aspect premium și lumină din spate: plexiglas.",
        faq: [
            { q: "Care rezistă cel mai bine la soare?", a: "Alucobondul: aluminiu compozit, rezistență UV de peste 10 ani. Forex-ul se poate curba la căldură pe formate mari; plexiglasul rezistă bine, dar se zgârie." },
            { q: "Ce grosime aleg?", a: "3 mm pentru formate până la 1 m pe latură; 5 mm (Forex) sau 4 mm (alucobond) pentru formate mai mari sau exterior expus." },
        ],
    },
    {
        slug: "canvas-cu-sasiu-vs-fara-sasiu",
        title: "Canvas cu șasiu sau fără șasiu",
        question: "Comand canvasul întins pe șasiu sau doar pânza printată?",
        intro: "Cu șasiu: pânza vine întinsă pe lemn, cu margine oglindită și sistem de prindere, gata de agățat, la dimensiuni fixe. Fără șasiu: primești doar pânza printată, rulată, la orice dimensiune, pe care o întinzi sau o înrămezi tu, la un atelier local.",
        options: [
            { name: "Canvas fără șasiu (pânză rulată)", dim: { productId: "canvas", variantKey: "canvas-360" }, pros: ["Orice dimensiune", "Se transportă ușor, în tub", "Poți alege ulterior tipul de șasiu sau ramă"], cons: ["Nu e gata de agățat", "Costul întinderii la atelier se adaugă"], bestFor: "formate atipice, cadouri trimise departe, cine are atelier de înrămare aproape" },
            { name: "Canvas cu șasiu", pros: ["Gata de agățat, cu sistem de prindere", "Margine oglindită, aspect de galerie", "Discount de la 2 bucăți identice"], cons: ["Dimensiuni fixe, din listă", "Volum mai mare la transport"], bestFor: "tablouri pentru acasă, cadouri, seturi" },
        ],
        sizes: [[60, 40], [90, 60], [120, 80]],
        verdict: "Pentru un tablou gata de pus pe perete, cu șasiu. Pentru o dimensiune atipică sau dacă îl înrămezi tu, fără șasiu.",
        faq: [
            { q: "Prețul variantei cu șasiu unde îl văd?", a: "În configuratorul de canvas, la „Cu șasiu”, alegi forma și dimensiunea din listă și prețul apare pe loc." },
            { q: "Pânza fără șasiu are margine oglindită?", a: "Pânza se printează la dimensiunea comandată; dacă vrei margine de întindere, scrie în observațiile comenzii." },
        ],
    },
    {
        slug: "flyere-135g-vs-carton-250g",
        title: "Flyere pe hârtie 135 g sau carton 250 g",
        question: "Flyerele le fac pe hârtie subțire sau pe carton?",
        intro: "Hârtia couché de 135 g e standardul de distribuție: ieftină, subțire, se împarte cu sutele. Cartonul de 250 g e rigid, se simte în mână și rezistă în buzunar: pentru flyere date personal, invitații și cupoane care trebuie păstrate.",
        options: [
            { name: "Couché 135 g, față-verso", qty: { productSlug: "flayere", formatKey: "a5", variantKey: "135-fata-verso" }, pros: ["Cel mai mic preț pe bucată", "Ușor: tirajele mari cântăresc puțin", "Print lucios, culori vii"], cons: ["Se îndoaie ușor", "Aspect de „fluturaș”"], bestFor: "distribuție stradală, cutii poștale, promoții" },
            { name: "Carton 250 g, față-verso", qty: { productSlug: "flayere", formatKey: "a5", variantKey: "250-fata-verso" }, pros: ["Rigid, se păstrează", "Aspect premium", "Bun pentru cupoane și invitații"], cons: ["+20% la preț", "Colet mai greu la tiraje mari"], bestFor: "invitații, cupoane, flyere date în mână" },
        ],
        quantities: [250, 1000, 5000],
        verdict: "Distribuție în masă: 135 g. Ceva ce vrei să fie păstrat: 250 g.",
        faq: [
            { q: "Ce format aleg?", a: "A6 pentru cutii poștale și distribuție stradală, A5 pentru promoții cu mai mult text, DL pentru plicuri și meniuri de livrare." },
            { q: "Cât cântărește un tiraj?", a: "1.000 de flyere A5 pe 135 g au ~4,2 kg; pe 250 g, ~7,8 kg. Pagina fiecărui tiraj arată greutatea exactă." },
        ],
    },
    {
        slug: "carti-de-vizita-carton-vs-plastic",
        title: "Cărți de vizită pe carton sau pe plastic",
        question: "Carton clasic sau plastic PVC pentru cărțile de vizită?",
        intro: "Cartonul de 350 g e standardul: ieftin, se scrie pe el, arată bine mat sau lucios. Plasticul PVC de 0,5 mm rezistă ani în portofel, nu se îndoaie și nu se pătează, la un preț pe bucată de câteva ori mai mare, deci se comandă în tiraje mai mici.",
        options: [
            { name: "Carton 350 g", qty: { productSlug: "carti-vizita", formatKey: "carton", variantKey: "o-fata" }, pros: ["Preț mic, tiraje mari", "Se poate scrie pe el", "Mat sau lucios"], cons: ["Se îndoaie și se pătează în timp"], bestFor: "toată echipa, cabinete, agenți care împart multe" },
            { name: "Plastic PVC 0,5 mm", qty: { productSlug: "carti-vizita", formatKey: "plastic", variantKey: "o-fata" }, pros: ["Rezistă ani de zile", "Aspect de card bancar", "Impermeabil"], cons: ["Preț pe bucată mai mare", "Nu se scrie pe el"], bestFor: "management, vânzări, cine dă puține și vrea să rămână" },
        ],
        quantities: [100, 200, 500],
        verdict: "Pentru volum, carton. Pentru cei câțiva oameni care reprezintă firma, plastic.",
        faq: [
            { q: "Pot face față-verso pe amândouă?", a: "Da, la ambele materiale; la plastic printul e pe o față sau pe două, la alegere." },
            { q: "Colțuri rotunjite?", a: "Opțiune la ambele, +0,20 lei pe bucată." },
        ],
    },
    {
        slug: "autocolant-vs-window-graphics",
        title: "Autocolant normal sau folie perforată (window graphics) pe vitrină",
        question: "Ce pun pe geam: autocolant plin sau folie perforată?",
        intro: "Autocolantul plin (folie economică sau transparentă) acoperă complet zona printată: din interior nu se vede prin el. Folia perforată (window graphics) are 50% găuri: din exterior se vede reclama, din interior se vede strada. Ambele se aplică pe sticlă și se laminează la nevoie.",
        options: [
            { name: "Autocolant folie economică", dim: { productId: "autocolante", variantKey: "oracal-3641" }, pros: ["Culori pline, opac", "Preț mai mic pe m²", "Tăiere pe contur"], cons: ["Blochează vederea și lumina", "Pe vitrine mari întunecă spațiul"], bestFor: "logo, program, texte, benzi decorative pe vitrină" },
            { name: "Window graphics (folie perforată)", dim: { productId: "window-graphics", variantKey: "perforat-140" }, pros: ["Se vede din interior spre exterior", "Acoperă vitrine întregi fără să întunece", "Reclamă pe toată suprafața"], cons: ["Text mic ilizibil", "Noaptea cu lumină înăuntru se vede din afară", "Se aplică pe bucăți de max. 137 cm"], bestFor: "vitrine mari, geamuri de birou, lunete auto" },
        ],
        sizes: [[100, 100], [137, 150], [100, 200]],
        verdict: "Elemente mici pe geam: autocolant. Geamul întreg acoperit, fără să pierzi lumina: folie perforată.",
        faq: [
            { q: "Cât rezistă la exterior?", a: "Ambele rezistă la exterior; laminarea prelungește durata și protejează printul de spălare." },
            { q: "Se dezlipesc fără urme?", a: "Folia removabilă (Oracal 621) da; folia economică lasă adeziv după mai mulți ani, care se curăță cu solvent." },
        ],
    },
    {
        slug: "tapet-mat-vs-autoadeziv",
        title: "Fototapet mat (cu clei) sau autoadeziv",
        question: "Ce fototapet aleg: clasic cu clei sau autoadeziv?",
        intro: "Tapetul mat clasic se lipește cu clei de tapet, iartă pereții imperfecți și e cu 10% mai ieftin. Tapetul autoadeziv are adezivul integrat, repoziționabil, se montează fără clei și se dă jos mai ușor, dar cere perete neted și bine grunduit.",
        options: [
            { name: "Tapet mat, non-adeziv", dim: { productId: "tapet", variantKey: "tapet-mat" }, pros: ["Preț mai mic", "Acoperă mici imperfecțiuni", "Montaj clasic, cunoscut de orice zugrav"], cons: ["Ai nevoie de clei", "Se dă jos mai greu"], bestFor: "pereți întregi, locuințe proprietate, montaj de zugrav" },
            { name: "Tapet autoadeziv", dim: { productId: "tapet", variantKey: "tapet-adeziv" }, pros: ["Fără clei, repoziționabil", "Se dezlipește curat", "Bun pentru chirie și birouri"], cons: ["+10%", "Cere perete neted, grunduit"], bestFor: "chirie, birouri, pereți de gips-carton finisat" },
        ],
        sizes: [[200, 250], [300, 250], [400, 280]],
        verdict: "Perete propriu, imperfect: mat cu clei. Chirie sau perete perfect neted: autoadeziv.",
        faq: [
            { q: "Cum se livrează?", a: "În benzi verticale numerotate, rulate în tub, cu 5 cm surplus pe fiecare latură dacă ai comandat cu margine." },
            { q: "Pot comanda dimensiunea exactă a peretelui?", a: "Da, introduci lățimea și înălțimea în configurator; recomandăm 5 cm în plus pe fiecare latură." },
        ],
    },
    {
        slug: "rollup-85-vs-100-vs-120",
        title: "Roll-up 85, 100 sau 120 cm lățime",
        question: "Ce lățime de roll-up aleg?",
        intro: "Toate au 200 cm înălțime, casetă de aluminiu și geantă. 85 cm e standardul de conferință și recepție, 100 cm dă mai mult spațiu pentru text, 120 și 150 cm se folosesc ca fundal de stand sau de poze.",
        options: [
            { name: "Roll-up 85×200 cm", qty: { productSlug: "rollup", formatKey: "85x200", variantKey: "rollup" }, pros: ["Cel mai ieftin", "Încape în orice mașină", "Formatul standard"], cons: ["Spațiu limitat pentru text"], bestFor: "recepții, conferințe, lângă pupitru" },
            { name: "Roll-up 100×200 cm", qty: { productSlug: "rollup", formatKey: "100x200", variantKey: "rollup" }, pros: ["Mai mult spațiu, se citește de mai departe", "Bun ca fundal"], cons: ["Puțin mai greu"], bestFor: "standuri, prezentări, fundal de poze" },
            { name: "Roll-up 120×200 cm", qty: { productSlug: "rollup", formatKey: "120x200", variantKey: "rollup" }, pros: ["Perete de stand din 2-3 bucăți", "Impact vizual mare"], cons: ["Preț mai mare", "Mai greu de transportat"], bestFor: "târguri, expoziții, evenimente mari" },
        ],
        quantities: [1, 2, 5],
        verdict: "Recepție și conferință: 85. Stand și fundal: 100 sau 120.",
        faq: [
            { q: "Pot schimba printul mai târziu?", a: "Da, caseta rămâne; comanzi doar reprintul." },
            { q: "Se poate folosi afară?", a: "Doar temporar, fără vânt și ploaie." },
        ],
    },
    {
        slug: "afise-hartie-150-vs-blueback-vs-carton-300",
        title: "Afișe pe hârtie 150 g, blueback sau carton 300 g",
        question: "Pe ce hârtie tipăresc afișele?",
        intro: "Hârtia lucioasă de 150 g e standardul pentru interior. Blueback-ul de 115 g are spatele albastru opac: se lipește pe panouri stradale fără să se vadă afișul de dedesubt. Cartonul de 300 g stă drept în suporturi și rame, fără să se onduleze.",
        options: [
            { name: "Hârtie 150 g lucioasă", qty: { productSlug: "afise", formatKey: "a2", variantKey: "150-lucios" }, pros: ["Preț mic", "Culori vii", "Tiraje mari"], cons: ["Nu rezistă la exterior", "Se ondulează în suport"], bestFor: "vitrine, aviziere, localuri" },
            { name: "Blueback 115 g", qty: { productSlug: "afise", formatKey: "a2", variantKey: "blueback-115" }, pros: ["Opac: acoperă afișul vechi", "Făcut pentru lipit cu clei pe panouri"], cons: ["Mai subțire, doar pentru lipit"], bestFor: "afișaj stradal, panouri, campanii" },
            { name: "Carton 300 g lucios", qty: { productSlug: "afise", formatKey: "a2", variantKey: "300-lucios" }, pros: ["Rigid, stă drept", "Aspect premium"], cons: ["Preț dublu față de 150 g", "Nu se lipește pe panouri"], bestFor: "suporturi de podea, rame, expoziții" },
        ],
        quantities: [10, 50, 100],
        verdict: "Interior obișnuit: 150 g. Lipit afară: blueback. În suport sau ramă: carton 300 g.",
        faq: [
            { q: "Ce format se folosește pe panourile stradale?", a: "De obicei A2 și A1; verifică dimensiunea panourilor din orașul tău." },
            { q: "Cum se livrează formatele mari?", a: "A1 și A0 rulate, în tub; A3 și A2 plat, între cartoane." },
        ],
    },
];

export function getComparison(slug: string): Comparison | undefined {
    return COMPARISONS.find((c) => c.slug === slug);
}

export type PriceCell = { label: string; href: string; price: number | null };

/** Prețul fiecărei opțiuni pentru fiecare mărime / cantitate a comparației. */
export function getComparisonPrices(c: Comparison): { columns: string[]; rows: Array<{ option: string; cells: PriceCell[] }> } {
    const columns: string[] = [];
    const rows: Array<{ option: string; cells: PriceCell[] }> = [];
    if (c.sizes) {
        for (const [w, h] of c.sizes) columns.push(`${w}×${h} cm`);
        for (const o of c.options) {
            const cells: PriceCell[] = c.sizes.map(([w, h]) => {
                if (!o.dim || !getSize(o.dim.productId, w, h)) return { label: `${w}×${h}`, href: "", price: null };
                const p = getDimensionPricing(o.dim.productId, w, h);
                const v = p?.variants.find((x) => x.key === o.dim!.variantKey) ?? p?.recommended;
                return { label: `${w}×${h}`, href: dimensionUrl(o.dim.productId, w, h), price: v ? v.rows[0].unit : null };
            });
            rows.push({ option: o.name, cells });
        }
    } else if (c.quantities) {
        for (const q of c.quantities) columns.push(`${q} buc`);
        for (const o of c.options) {
            const cells: PriceCell[] = c.quantities.map((q) => {
                if (!o.qty) return { label: `${q}`, href: "", price: null };
                const prod = QTY_PRODUCTS.find((p) => p.slug === o.qty!.productSlug);
                const fmt = prod?.formats.find((f) => f.key === o.qty!.formatKey);
                if (!prod || !fmt || !prod.quantities.includes(q)) return { label: `${q}`, href: "", price: null };
                const p = getQtyPricing(prod, fmt, q);
                const v = p?.variants.find((x) => x.key === o.qty!.variantKey) ?? p?.recommended;
                return { label: `${q}`, href: qtyUrl(prod, fmt, q), price: v ? v.total : null };
            });
            rows.push({ option: o.name, cells });
        }
    }
    return { columns, rows };
}
