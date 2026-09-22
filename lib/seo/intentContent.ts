// Conținut pentru paginile de intenție /configurator/{produs}-{intenție}
// (ex. banner-de-vanzare, afise-concert, canvas-nunta, autocolante-program-
// functionare). Fiecare combinație are un text scris de mână, specific
// situației, plus mărimile sau tirajele pe care le comandă de obicei clienții
// pentru ea; prețurile pentru acestea se calculează la randare cu motorul
// configuratorului (lib/pricing.ts), nu sunt scrise aici.
//
// Regula: fără afirmații despre firmă care nu sunt confirmate (termen 2-4 zile
// lucrătoare, tiv și capse incluse la bannere, fără montaj). Sfaturile sunt
// despre produs și utilizare, nu promisiuni comerciale.

export type IntentSpec = {
    /** titlul paginii (H1), fără numele localității */
    title: string;
    /** 2-3 propoziții despre situația concretă */
    lead: string;
    /** mărimi tipice (cm) pentru produse pe dimensiuni; trebuie să existe în grila lib/seo/dimensionPages.ts */
    sizes?: Array<[number, number]>;
    /** cantități tipice pentru produse la tiraj; formatul se ia din lib/seo/quantityPages.ts */
    qty?: number[];
    /** cheia formatului din quantityPages (ex. "a5", "carton", "85x200"); implicit primul */
    format?: string;
    /** 2-4 sfaturi practice, specifice intenției */
    tips: string[];
};

export const INTENT_CONTENT: Record<string, Record<string, IntentSpec>> = {
    banner: {
        "de-vanzare": {
            title: "Banner „De vânzare”",
            lead: "Un banner de vânzare se citește din mașină, deci textul trebuie să fie scurt: „DE VÂNZARE”, numărul de telefon și, opțional, suprafața sau prețul. Formatele de 200×100 și 300×100 cm sunt cele mai comandate pentru garduri și balcoane.",
            sizes: [[100, 70], [200, 100], [300, 100]],
            tips: ["Litere de cel puțin 15 cm pentru telefon, ca să se citească de la 20-30 m.", "Fond alb sau galben cu text roșu sau negru: contrastul contează mai mult decât designul.", "Tivul și capsele sunt incluse; prinde bannerul la fiecare capsă ca să nu fluture."],
        },
        "de-inchiriat": {
            title: "Banner „De închiriat”",
            lead: "Pentru spații comerciale și apartamente, bannerul de închiriat stă de obicei pe balcon sau în vitrină, luni întregi. Frontlit 510 g/m² rezistă mai bine la soare dacă anunțul rămâne afișat peste vară.",
            sizes: [[100, 50], [150, 100], [200, 100]],
            tips: ["Pune suprafața (mp) și numărul de telefon; restul detaliilor se dau la telefon.", "La balcoane, formatul 200×100 cm acoperă balustrada fără să atârne.", "Dacă bannerul stă la vitrină, interior, ajunge Frontlit 440 g/m²."],
        },
        "deschidere-magazin": {
            title: "Banner deschidere magazin",
            lead: "Bannerul de deschidere se montează cu câteva zile înainte și rămâne 2-4 săptămâni: „Deschidem în curând”, apoi „Am deschis”. Formatul se alege după fațadă: 300×100 cm deasupra ușii, 400×150 cm pe o fațadă lată.",
            sizes: [[300, 100], [400, 150], [500, 100]],
            tips: ["Comandă două bannere din aceeași grafică: unul „Deschidem în curând”, unul „Am deschis”, ca să nu reprintezi.", "Logo-ul mare, data deschiderii și o singură ofertă de lansare.", "Produs în 2-4 zile lucrătoare; ia în calcul și curierul când stabilești data."],
        },
        electoral: {
            title: "Banner electoral",
            lead: "Bannerele electorale se comandă în serie, în aceleași dimensiuni, pentru mai multe locații. Prețul pe metru pătrat scade cu suprafața totală, deci comanda pentru toate punctele odată iese mai ieftin decât pe bucăți.",
            sizes: [[200, 100], [300, 150], [400, 200]],
            tips: ["Verifică cerințele legale de marcare (candidat, partid, cod de identificare) înainte de a trimite grafica.", "Aceeași grafică pe toate formatele, scalată; textul principal la cel puțin 20 cm înălțime.", "La suprafețe mari expuse vântului, alege găuri de vânt sau mesh."],
        },
        promotie: {
            title: "Banner pentru promoție",
            lead: "Un banner de promoție trăiește câteva săptămâni, deci contează prețul și viteza, nu durata materialului. Frontlit 440 g/m² e suficient; formatele de vitrină (200×100 cm) și de fațadă (300×100 cm) acoperă majoritatea cazurilor.",
            sizes: [[100, 70], [200, 100], [300, 100]],
            tips: ["Un singur mesaj: produsul și reducerea, cu cifra cea mai mare pe banner.", "Pune perioada promoției, ca să poți reprinta la următoarea campanie.", "Bannerul de interior nu are nevoie de găuri de vânt."],
        },
        reducere: {
            title: "Banner reduceri",
            lead: "Bannerele de reduceri se refolosesc sezon de sezon dacă nu au date pe ele: „REDUCERI până la 50%” merge la fiecare campanie. Printul frontlit se rulează și se păstrează fără probleme între sezoane.",
            sizes: [[150, 100], [200, 100], [300, 100]],
            tips: ["Fără date pe banner, ca să-l poți refolosi.", "Procentul cel mai mare ocupă jumătate din suprafață.", "Roșu pe alb sau alb pe roșu: cea mai citită combinație pentru reduceri."],
        },
        santier: {
            title: "Banner de șantier",
            lead: "Pe garduri de șantier bannerul stă luni de zile, la vânt și ploaie: contează materialul (Frontlit 510 g/m²) și prinderea în toate capsele. Pentru fațade întregi și schele, mesh-ul microperforat rezistă mai bine la vânt decât bannerul plin.",
            sizes: [[300, 100], [400, 150], [500, 200]],
            tips: ["Panoul de identificare a investiției are conținut impus de lege: verifică lista de informații obligatorii.", "Pe garduri lungi, comandă mai multe bannere de 300×100 cm în loc de unul foarte lung.", "La suprafețe peste 6 m² expuse, alege găuri de vânt sau mesh."],
        },
        publicitar: {
            title: "Banner publicitar",
            lead: "Bannerul publicitar clasic, pentru fațade, evenimente și garduri: print full color pe frontlit, cu tiv și capse incluse. Prețul se calculează pe suprafață, cu reduceri pe praguri de metri pătrați.",
            sizes: [[200, 100], [300, 100], [400, 200]],
            tips: ["Trimite fișierul la scară 1:1, minim 150 DPI; la peste 3 m e suficient 72 DPI.", "Ține textul la 5 cm de margine, în afara zonei de tiv și capse.", "Pentru exterior pe termen lung, Frontlit 510 g/m²."],
        },
        buzunare: {
            title: "Banner cu buzunare (pentru tub)",
            lead: "Bannerul cu buzunare cusute sus și jos se montează pe tub sau bară, întins drept, fără capse vizibile: potrivit pentru afișaj suspendat, standuri și fațade unde vrei un aspect curat. Menționează buzunarele în observațiile comenzii.",
            sizes: [[100, 200], [150, 250], [200, 100]],
            tips: ["Scrie în observații diametrul tubului pe care îl folosești, ca buzunarul să fie cusut pe măsură.", "Formatele verticale (100×200 cm) sunt cele mai des cerute pentru afișaj suspendat.", "Fără text în zona buzunarelor: primii și ultimii 8-10 cm."],
        },
        "capse-dese": {
            title: "Banner cu capse dese",
            lead: "Capsele standard sunt la ~50 cm; pentru garduri expuse la vânt sau pentru bannere lungi se cer capse mai dese, care distribuie tensiunea și nu lasă bannerul să se rupă la colțuri. Menționează pasul dorit în observații.",
            sizes: [[300, 100], [500, 100], [400, 150]],
            tips: ["Cu cât bannerul e mai lung, cu atât capsele dese contează mai mult.", "Prinde toate capsele, nu doar colțurile, altfel se rupe la primul vânt.", "Pentru vânt puternic, găurile de vânt sau mesh-ul ajută mai mult decât capsele."],
        },
    },
    afise: {
        concert: {
            title: "Afișe pentru concert",
            lead: "Afișele de concert se lipesc pe panouri stradale și în localuri, deci se comandă la tiraj și pe hârtie potrivită: blueback (opac pe spate) pentru afișaj stradal, hârtie lucioasă pentru interior. A2 e formatul de panou, A3 cel de local.",
            qty: [50, 100, 250],
            format: "a2",
            tips: ["Numele artistului și data ocupă două treimi din afiș; restul se citește de aproape.", "Blueback-ul nu lasă să se vadă afișul de dedesubt când e lipit peste.", "Comandă și A3 pentru localuri și vitrine, din aceeași grafică."],
        },
        eveniment: {
            title: "Afișe pentru evenimente și petreceri",
            lead: "Pentru un eveniment local ajung câteva zeci de afișe A3 și A2: vitrine, aviziere, localuri partenere. Hârtia de 150 g e standardul; pentru afișaj stradal, blueback.",
            qty: [10, 50, 100],
            format: "a3",
            tips: ["Data, ora și locul, în ordinea asta, cu litere mari.", "Un QR code spre bilete sau eveniment scutește textul mic.", "Tiraj mai mare, preț pe bucată mai mic: verifică pragurile de mai jos."],
        },
        electoral: {
            title: "Afișe electorale",
            lead: "Afișele electorale se tipăresc în tiraje mari, în formatele acceptate pe panourile de afișaj, de obicei A2 și A1. Blueback-ul e hârtia potrivită pentru lipit pe panouri stradale.",
            qty: [100, 250, 500],
            format: "a2",
            tips: ["Verifică dimensiunile admise de autoritatea locală pentru panourile de afișaj electoral.", "Elementele de identificare obligatorii merg pe fiecare afiș.", "Comandă tot tirajul odată: prețul pe bucată scade pe praguri."],
        },
        promotie: {
            title: "Afișe pentru promoții",
            lead: "Afișele de promoție se schimbă des, deci contează tirajul mic și prețul: A3 și A2 pe hârtie de 150 g, pentru vitrine, raioane și puncte de vânzare.",
            qty: [10, 50, 100],
            format: "a3",
            tips: ["Produsul, prețul nou și perioada, nimic altceva.", "Aceeași grafică în A3 (raion) și A2 (vitrină).", "Carton 300 g dacă afișul stă în suport de podea."],
        },
        film: {
            title: "Afișe de film",
            lead: "Afișele de film pentru cinematografe, cluburi de film și proiecții în aer liber se tipăresc în formate mari, pe hârtie lucioasă sau foto, cu imagine plină.",
            qty: [10, 50, 100],
            format: "a1",
            tips: ["Imaginea trebuie să aibă minim 150 DPI la formatul final; la A1 înseamnă ~3.500 × 5.000 px.", "Hârtia lucioasă dă culori mai saturate; cea mată nu reflectă luminile.", "Formatele mari se livrează în tub."],
        },
        conferinta: {
            title: "Afișe pentru conferințe",
            lead: "La conferințe și seminarii afișele se pun pe aviziere, în holurile universităților și la intrare: A3 și A2 pe hârtie de 150 g, în tiraje de zeci de bucăți.",
            qty: [10, 50, 100],
            format: "a3",
            tips: ["Tema, data, locul și linkul de înscriere, cu QR code.", "Logo-urile partenerilor în bandă jos, la aceeași înălțime.", "Pentru standul din hol, un roll-up din aceeași grafică."],
        },
        oferta: {
            title: "Afișe cu ofertă specială",
            lead: "Afișul de ofertă e cel mai schimbat material dintr-un magazin: se comandă în tiraj mic, des, în A3 pentru raioane și A2 pentru vitrină.",
            qty: [10, 50, 100],
            format: "a3",
            tips: ["Prețul vechi tăiat, prețul nou mare.", "Perioada ofertei jos, cu litere mici, obligatoriu.", "Carton 300 g dacă afișul stă în suport de masă."],
        },
        "happy-hour": {
            title: "Afișe Happy Hour",
            lead: "Pentru baruri și cafenele: afișe A3 cu intervalul orar și oferta, în vitrină, la bar și în toaletă. Se comandă în tiraje mici, cu grafică schimbată sezonier.",
            qty: [10, 50, 100],
            format: "a3",
            tips: ["Intervalul orar cu litere mari, oferta dedesubt.", "Hârtie lucioasă pentru vitrină, mată pentru interior cu lumini directe.", "A4 din aceeași grafică pentru mese, în rame."],
        },
        horeca: {
            title: "Afișe pentru restaurante și cafenele",
            lead: "Meniuri de zi, oferte de sezon, evenimente din local: afișele HoReCa se schimbă des și se tipăresc în A3 și A2, pe hârtie de 150 g sau carton 300 g pentru suporturi.",
            qty: [10, 50, 100],
            format: "a3",
            tips: ["Poze de produs mari, text puțin.", "Carton 300 g pentru suporturile de pe mese și de la intrare.", "Pentru vitrina exterioară, blueback sau autocolant, nu hârtie simplă."],
        },
    },
    canvas: {
        nunta: {
            title: "Canvas de nuntă",
            lead: "Fotografia de la nuntă pe pânză canvas, cu șasiu de lemn, gata de agățat, e cadoul clasic pentru miri sau pentru părinți. Formatele de 60×40 și 90×60 cm merg pe pereții de dormitor și living; 120×80 cm devine piesa centrală.",
            sizes: [[60, 40], [90, 60], [120, 80]],
            tips: ["Alege o poză cu mirii în centru și spațiu în jur, ca marginea oglindită să nu taie nimic important.", "Poza originală de la fotograf, nu din WhatsApp: rezoluția contează la formate mari.", "Pentru cadou, comandă cu o săptămână înainte: producție 2-4 zile lucrătoare plus curier."],
        },
        botez: {
            title: "Canvas de botez",
            lead: "Portretul bebelușului pe canvas, în formate mici și medii (40×30, 60×40 cm), pentru camera copilului sau ca amintire pentru nași. Pânza mată nu reflectă lumina și arată bine în orice cameră.",
            sizes: [[40, 30], [60, 40], [80, 60]],
            tips: ["Pozele de aproape, cu fundal simplu, ies cel mai bine pe canvas.", "Un set de trei canvasuri mici (30×30 cm) din poze diferite e o alternativă la un tablou mare.", "Data și numele pot fi adăugate pe poză înainte de print."],
        },
        familie: {
            title: "Canvas cu poza de familie",
            lead: "Poza de familie pe canvas e formatul de living: 90×60 sau 120×80 cm deasupra canapelei, în orientare orizontală. Se livrează întins pe șasiu de lemn, cu sistem de prindere, gata de agățat.",
            sizes: [[90, 60], [120, 80], [150, 100]],
            tips: ["Orizontal pentru poze de grup, vertical pentru portrete.", "Măsoară peretele: tabloul ar trebui să aibă 2/3 din lățimea canapelei.", "La formate mari, șasiul are traversă ca pânza să rămână întinsă."],
        },
        peisaj: {
            title: "Canvas cu peisaj",
            lead: "Peisajele merg pe formate panoramice sau late: 120×60, 150×100 cm, pentru living, birou sau hol. Poza proprie din concediu sau o fotografie de peisaj cu rezoluție mare.",
            sizes: [[100, 50], [120, 80], [150, 100]],
            tips: ["Panoramele se decupează pe orizontală din poze normale, fără să piardă calitate.", "Un set de trei canvasuri pătrate din același peisaj (triptic) umple un perete lat.", "Verifică rezoluția: minim 150 DPI la mărimea finală."],
        },
        "cadou-aniversare": {
            title: "Canvas cadou de aniversare",
            lead: "Cadoul care nu se strică și nu se pierde: o poză bună pe canvas, în format mediu (60×40 cm), într-o cutie, gata de agățat. Ajunge prin curier în 2-4 zile lucrătoare de la confirmarea graficii.",
            sizes: [[40, 30], [60, 40], [90, 60]],
            tips: ["Pentru cadou, alege o poză în care persoana e în prim-plan.", "Un colaj de mai multe poze pe același canvas spune o poveste.", "Comandă cu cel puțin o săptămână înainte de zi."],
        },
        "colaj-foto": {
            title: "Canvas colaj foto",
            lead: "Mai multe poze pe un singur canvas: grilă de 4, 6 sau 9 poze pe format mare (90×60, 120×80 cm). Fiecare poză trebuie să aibă rezoluție bună la mărimea la care apare pe pânză.",
            sizes: [[90, 60], [120, 80], [100, 100]],
            tips: ["Alege poze cu aceeași orientare, ca grila să fie curată.", "Pe format pătrat (100×100 cm) grila de 9 poze e cea mai echilibrată.", "Trimite pozele originale; noi le așezăm în grilă la opțiunea de design."],
        },
        abstract: {
            title: "Canvas abstract",
            lead: "Grafică abstractă sau fotografie de detaliu (texturi, culori, apă, frunze) pe canvas, în formate mari și seturi de două-trei piese: potrivit pentru birouri, recepții și livinguri moderne.",
            sizes: [[100, 100], [120, 80], [150, 100]],
            tips: ["Culori din paleta camerei: două-trei tonuri, nu mai multe.", "Seturile de trei canvasuri egale se agață la 5-8 cm distanță.", "Fișierele vectoriale sau la rezoluție mare nu se pixelează la formate mari."],
        },
        modern: {
            title: "Canvas modern pentru living",
            lead: "Formate mari, orientare orizontală, fotografie cu contrast sau grafică minimalistă: canvasul modern e piesa de deasupra canapelei sau a patului, la 120×80 sau 150×100 cm.",
            sizes: [[120, 80], [150, 100], [100, 100]],
            tips: ["Un singur tablou mare arată mai bine decât mai multe mici pe un perete gol.", "Marginea oglindită dă efect de galerie fără ramă.", "Măsoară peretele înainte: tabloul se centrează la înălțimea ochilor."],
        },
    },
    autocolante: {
        "program-functionare": {
            title: "Autocolant program de funcționare",
            lead: "Programul de funcționare se aplică pe ușa sau vitrina magazinului, din folie tăiată pe contur sau autocolant dreptunghiular. Formatele obișnuite sunt 20×30 și 30×40 cm; folia transparentă lasă geamul curat în jurul textului.",
            sizes: [[20, 30], [30, 40], [40, 60]],
            tips: ["Zilele într-o coloană, orele în alta; litere de minim 2 cm.", "Folie transparentă pe geam sau folie albă pe ușă metalică.", "Comandă și un al doilea autocolant pentru „Închis / Deschis” din aceeași grafică."],
        },
        "logo-firma": {
            title: "Autocolant cu logo de firmă",
            lead: "Logo-ul firmei tăiat pe contur, pentru vitrină, ușă, mașină sau echipamente: la formate mici se comandă în serie, la formate mari câte unul-două pentru vitrină.",
            sizes: [[20, 20], [50, 50], [100, 100]],
            tips: ["Trimite logo-ul vectorial (AI, PDF, SVG) pentru tăiere curată pe contur.", "Pe vitrină, logo-ul se aplică din exterior; pe mașină, laminat.", "Pentru serii (etichete cu logo) vezi prețurile pe cantități la etichete autocolante."],
        },
        geamuri: {
            title: "Autocolante pentru geamuri",
            lead: "Pe geam, folia transparentă lasă lumina să treacă și arată doar grafica; folia albă acoperă complet. Pentru vitrine întregi, benzile se aplică una lângă alta, cu maximum 137 cm lățime pe bandă.",
            sizes: [[50, 70], [100, 100], [137, 200]],
            tips: ["Aplicare udă (apă cu o picătură de detergent) pentru poziționare ușoară.", "Măsoară geamul și scade 1 cm pe fiecare latură.", "Pentru vizibilitate dinăuntru spre afară, alege folia perforată (window graphics)."],
        },
        decorativ: {
            title: "Autocolante decorative",
            lead: "Decorațiuni pentru perete, mobilă sau vitrină: forme tăiate pe contur, în formate de la 30 cm până la un perete întreg. Folia removabilă se dezlipește fără urme, potrivită pentru chirie sau decor sezonier.",
            sizes: [[30, 30], [60, 90], [100, 150]],
            tips: ["Folie removabilă (Oracal 621) pentru perete zugrăvit.", "Formele complexe au nevoie de contur vectorial.", "Peretele trebuie neted și curat; pe glet proaspăt nu se lipește."],
        },
        perete: {
            title: "Autocolante de perete",
            lead: "Texte, logo-uri și grafică pentru pereții de birou, sală de așteptare sau cameră de copil, în formate de 60×90 până la 137×200 cm. Folia removabilă protejează vopseaua.",
            sizes: [[60, 90], [100, 150], [137, 200]],
            tips: ["Pe vopsea lavabilă folia se lipește bine; pe var, nu.", "Textele lungi se livrează pe folie de transfer, ca literele să rămână aliniate.", "Măsoară peretele și lasă 5 cm liberi până la colțuri."],
        },
        vinyl: {
            title: "Autocolante vinyl",
            lead: "Vinylul (folia PVC) e materialul standard pentru autocolante de interior și exterior: se printează, se taie pe contur și se laminează la nevoie. Trei folii uzuale: economică, removabilă și auto.",
            sizes: [[10, 10], [30, 40], [100, 100]],
            tips: ["Economic pentru interior și exterior scurt; auto pentru vehicule; removabil pentru chirie.", "Laminarea dublează durata de viață la exterior.", "Sub 30 cm pe latură, prețul include tăierea pe contur a fiecărei piese."],
        },
        promotie: {
            title: "Autocolante pentru promoții",
            lead: "„Reduceri”, „-50%”, „Nou”: autocolante de vitrină și de raft, în serie, pe folie economică. Se comandă în zeci de bucăți pentru toate punctele de vânzare.",
            sizes: [[20, 20], [30, 30], [50, 70]],
            tips: ["Cercuri și forme simple ies cel mai ieftin la tăiere.", "Comandă tot tirajul odată: prețul scade cu suprafața totală.", "Folie removabilă dacă vitrina se schimbă la fiecare campanie."],
        },
        transparent: {
            title: "Autocolante transparente",
            lead: "Folia transparentă se folosește pe sticlă: logo, program, texte, fără fundal alb în jur. Pe fundal transparent culorile deschise se văd slab, deci textele se fac în culori închise sau cu contur.",
            sizes: [[20, 30], [50, 70], [100, 100]],
            tips: ["Textele albe pe folie transparentă au nevoie de un strat alb suplimentar; scrie în observații.", "Aplicare din exterior pentru vizibilitate maximă din stradă.", "Pe geam dublu, aplică pe sticla exterioară."],
        },
        lucios: {
            title: "Autocolante lucioase",
            lead: "Finisajul lucios dă culori saturate și rezistă bine la spălare: potrivit pentru etichete de produs, stickere promoționale și vitrine. Laminarea lucioasă îl protejează la exterior.",
            sizes: [[10, 10], [20, 30], [50, 70]],
            tips: ["Lucios pentru poze și culori vii; mat pentru texte și lumină directă.", "La etichete de produs, laminarea evită zgârierea la transport.", "Serii mari: vezi prețurile pe cantități la etichete."],
        },
        mat: {
            title: "Autocolante mate",
            lead: "Finisajul mat nu reflectă lumina: potrivit pentru vitrine expuse la soare, semnalistică de interior și etichete elegante. Se obține prin laminare mată peste printul standard.",
            sizes: [[20, 30], [30, 40], [50, 70]],
            tips: ["Cere laminare mată în observații.", "Culorile ies puțin mai puțin saturate decât la lucios; alege contrast mai mare.", "Pe semnalistică de interior, mat + font gros = cea mai bună lizibilitate."],
        },
        "window-graphics": {
            title: "Autocolante window graphics (folie perforată)",
            lead: "Folia perforată acoperă geamul cu reclamă și lasă vederea dinăuntru spre afară. Se folosește pe vitrine, geamuri de birou și luneta mașinilor, pe bucăți de maximum 137 cm lățime.",
            sizes: [[100, 100], [137, 150], [137, 200]],
            tips: ["Texte mari și fundaluri pline: jumătate din suprafață e perforată.", "Laminarea protejează perforațiile de apă.", "Efectul funcționează ziua; noaptea cu lumină înăuntru se vede din exterior."],
        },
        imobiliare: {
            title: "Autocolante pentru agenții imobiliare",
            lead: "Oferte pe vitrina agenției, „Vândut” peste panouri, logo pe mașinile de teren: agențiile comandă autocolante în serie, pe folie economică sau removabilă, în formate de 30×40 și 50×70 cm.",
            sizes: [[30, 40], [50, 70], [100, 70]],
            tips: ["Autocolant „VÂNDUT” / „ÎNCHIRIAT” în serie, pe folie removabilă, pentru panouri.", "Pentru vitrină, folie transparentă cu logo și program.", "Pe mașini, folie auto laminată."],
        },
    },
    rollup: {
        expozitie: {
            title: "Roll-up pentru expoziții și târguri",
            lead: "La un stand de târg roll-up-ul e fundalul și mesajul în același timp: 85×200 cm lângă masă, 100×200 sau 120×200 cm ca perete de stand. Se desface în 30 de secunde și intră în geanta livrată.",
            qty: [1, 2, 5],
            format: "100x200",
            tips: ["Logo și mesaj în treimea de sus; partea de jos e acoperită de masă și de oameni.", "Două-trei roll-up-uri alăturate formează un perete continuu.", "Printul se poate înlocui, caseta rămâne."],
        },
        conferinta: {
            title: "Roll-up pentru conferințe",
            lead: "La conferințe roll-up-ul stă lângă pupitru, la intrare și în zona de cafea: formatul standard 85×200 cm, în două-trei bucăți cu aceeași grafică.",
            qty: [1, 2, 5],
            format: "85x200",
            tips: ["Tema conferinței, data și logo-urile partenerilor, atât.", "Fundal deschis, ca să nu se piardă în lumina de scenă.", "Comandă și un al doilea pentru zona foto."],
        },
        prezentare: {
            title: "Roll-up de prezentare",
            lead: "Pentru prezentări de produs, lansări și întâlniri cu clienții: un roll-up cu produsul și trei argumente. Formatul 85×200 cm încape în orice mașină și se montează singur.",
            qty: [1, 2, 5],
            format: "85x200",
            tips: ["O poză de produs mare, trei beneficii, contact.", "Text lizibil de la 3 m: litere de minim 3 cm.", "Fișier la 1:1, minim 150 DPI."],
        },
        eveniment: {
            title: "Roll-up pentru evenimente",
            lead: "La nunți, botezuri și evenimente corporate roll-up-ul e panoul de întâmpinare sau fundalul de poze: 100×200 cm pentru fundal, 85×200 cm la intrare.",
            qty: [1, 2, 5],
            format: "100x200",
            tips: ["Pentru fundal de poze, două roll-up-uri de 100×200 cm alăturate.", "Numele evenimentului și data, mari, sus.", "Doar interior sau exterior fără vânt."],
        },
        receptie: {
            title: "Roll-up pentru recepție",
            lead: "În recepția firmei sau a cabinetului, un roll-up cu serviciile și programul înlocuiește un panou fix și se mută ușor. Formatul 85×200 cm e cel mai des folosit.",
            qty: [1, 2, 5],
            format: "85x200",
            tips: ["Lista de servicii pe rânduri scurte, cu prețuri dacă se schimbă rar.", "Grafică luminoasă, în culorile brandului.", "Printul se poate reface când se schimbă programul; caseta rămâne."],
        },
    },
    pliante: {
        meniu: {
            title: "Pliante meniu",
            lead: "Meniul de restaurant sau de livrare pe pliant A4 pliat în două sau în trei, pe hârtie de 170 g sau carton 250 g, care rezistă la mânuire. Se comandă în tiraje de 250-1000 de bucăți.",
            qty: [250, 500, 1000],
            format: "paralel",
            tips: ["Carton 250 g pentru meniurile de pe masă; 135-170 g pentru cele de livrare.", "Prețurile pe o singură coloană, aliniate la dreapta.", "Poze de produs pe fața exterioară, lista pe interior."],
        },
        servicii: {
            title: "Pliante de prezentare servicii",
            lead: "Pliantul de servicii se dă la întâlniri și la recepție: A4 pliat în trei, pe hârtie de 170 g, cu serviciile pe interior și contactul pe spate. Tirajul obișnuit e 500-1000 de bucăți.",
            qty: [250, 500, 1000],
            format: "paralel",
            tips: ["Un serviciu pe fiecare panou interior, cu un titlu și trei rânduri.", "Fața exterioară: logo, o promisiune, telefon.", "Hârtie 170 g: nu se îndoaie în mapă."],
        },
        prezentare: {
            title: "Pliante de prezentare firmă",
            lead: "Prezentarea firmei pe un pliant A4 pliat în două sau în trei: cine ești, ce faci, cum te contactează. Tiraj mediu, hârtie de 170 g sau carton 250 g pentru senzația de calitate.",
            qty: [250, 500, 1000],
            format: "simplu",
            tips: ["Pliat în două pentru prezentări cu poze mari; în trei pentru liste de servicii.", "Carton 250 g pentru pliante date personal, la întâlniri.", "Fișier deschis cu 3 mm bleed și liniile de big marcate."],
        },
        oferta: {
            title: "Pliante cu oferte",
            lead: "Oferta lunii pe pliant, distribuită în cutii poștale sau la ieșirea din magazin: tiraj mare, hârtie de 115-135 g, pliat în două. Prețul pe bucată scade vizibil peste 1000 de bucăți.",
            qty: [500, 1000, 2500],
            format: "simplu",
            tips: ["Hârtie 115-135 g pentru distribuție; nu are rost carton.", "Perioada ofertei pe copertă.", "Verifică prețurile de două ori: tirajul multiplică orice greșeală."],
        },
        turism: {
            title: "Pliante turistice",
            lead: "Pentru pensiuni, agenții și obiective turistice: pliant A4 pliat în trei, cu poze mari, harta și contactul. Hârtia de 170 g rezistă în mână și în raftul de la recepție.",
            qty: [500, 1000, 2500],
            format: "paralel",
            tips: ["O poză mare pe copertă, harta pe spate.", "Tiraj pentru tot sezonul: prețul pe bucată scade la 1000+.", "Pliat în trei intră în suporturile standard de la recepții."],
        },
        horeca: {
            title: "Pliante pentru restaurante și cafenele",
            lead: "Meniu de livrare, oferte de sezon, evenimente din local: pliantul HoReCa se schimbă des, deci se comandă în tiraje medii, pe hârtie de 135-170 g.",
            qty: [250, 500, 1000],
            format: "paralel",
            tips: ["Meniul de livrare pliat în trei încape în plicul comenzii.", "Carton 250 g pentru meniurile de pe masă.", "Poze de produs pe fața exterioară."],
        },
    },
    tricouri: {
        personalizat: {
            title: "Tricouri personalizate",
            lead: "Tricouri din bumbac cu grafica ta, printate pe față sau pe față și spate. Prețul pe bucată scade de la 10 bucăți (-10%), 30 (-15%) și 50 (-20%).",
            qty: [10, 30, 50],
            format: "fata",
            tips: ["PNG cu fundal transparent sau vector, la dimensiunea reală a printului.", "Trimite lista de mărimi odată cu comanda.", "Print pe spate: +20 lei pe bucată la varianta basic."],
        },
        cadou: {
            title: "Tricouri cadou personalizate",
            lead: "Un tricou cu poza sau textul potrivit e cadoul rapid: se comandă și o singură bucată, gata în 2-4 zile lucrătoare. Pentru grupuri (petrecere a burlacilor, aniversare), de la 10 bucăți intră discountul.",
            qty: [10, 20, 30],
            format: "fata",
            tips: ["Pozele se printează bine dacă au rezoluție mare și fundal simplu.", "Textele scurte, cu litere groase, se citesc mai bine pe tricou.", "Comandă cu o săptămână înainte de eveniment."],
        },
        echipa: {
            title: "Tricouri pentru echipă",
            lead: "Tricouri pentru echipa firmei, echipa sportivă sau voluntari: logo pe piept și nume sau număr pe spate, în 20-50 de bucăți, cu mărimi mixte.",
            qty: [20, 30, 50],
            format: "fata-spate",
            tips: ["Logo mic pe piept stânga, mesaj sau nume mare pe spate.", "Lista de mărimi și culori pe fiecare bucată, într-un tabel.", "De la 30 de bucăți, -15%; de la 50, -20%."],
        },
        eveniment: {
            title: "Tricouri pentru evenimente",
            lead: "Tricouri pentru festivaluri, tabere, teambuilding și promoții: tiraje de 30-250 de bucăți, cu aceeași grafică, în mărimi mixte. Prețul pe bucată ajunge la pragul maxim de discount de la 50.",
            qty: [30, 50, 100],
            format: "fata",
            tips: ["Culori de tricou în ton cu evenimentul; grafica cu 1-2 culori iese cel mai curat.", "Comandă cu 10% mărimi în plus pentru înlocuiri.", "Producție 2-4 zile lucrătoare de la confirmarea graficii."],
        },
        funny: {
            title: "Tricouri cu mesaje amuzante",
            lead: "Texte și glume pe tricou, pentru cadouri și petreceri: se comandă de la o bucată, cu textul tău sau cu grafica ta. Pentru grupuri (burlacii, aniversări) de la 10 bucăți intră discountul.",
            qty: [10, 20, 30],
            format: "fata",
            tips: ["Text mare, font gros, două culori maximum.", "Trimite textul exact, cu diacritice, ca să nu apară greșeli.", "Aceeași grafică pe mai multe culori de tricou nu costă în plus."],
        },
    },
    "carti-vizita": {
        standard: {
            title: "Cărți de vizită standard",
            lead: "Cărți de vizită pe carton de 350 g, 90×50 mm, mate sau lucioase, în tiraje de 100-1000 de bucăți. Formatul standard încape în orice portofel și suport.",
            qty: [100, 500, 1000],
            format: "carton",
            tips: ["Numele și funcția pe față, contactul pe spate sau totul pe o față.", "Fonturi convertite în curbe, 3 mm bleed.", "De la 500 de bucăți prețul pe bucată scade vizibil."],
        },
        premium: {
            title: "Cărți de vizită premium",
            lead: "Pentru cine vrea o carte de vizită care se ține minte: plastic PVC, furnir de lemn sau metal, cu print pe o față sau față-verso. Se comandă în tiraje mai mici, 100-500 de bucăți.",
            qty: [100, 200, 500],
            format: "plastic",
            tips: ["Plasticul rezistă în portofel ani de zile.", "Lemnul și metalul au tiraj mic și preț pe bucată mai mare; comandă pentru persoanele-cheie.", "Design minimal: materialul e mesajul."],
        },
        avocat: {
            title: "Cărți de vizită pentru avocați",
            lead: "Cabinetele de avocatură comandă cărți de vizită sobre: carton de 350 g mat, tipar pe o față sau față-verso, fără elemente grafice încărcate. Tiraje de 200-500 de bucăți pe avocat.",
            qty: [200, 500, 1000],
            format: "carton",
            tips: ["Nume, titlu (avocat, avocat definitiv), barou, contact.", "Fundal alb sau crem, un singur font.", "Aceeași grafică pentru toți avocații din cabinet, schimbând doar numele."],
        },
        doctor: {
            title: "Cărți de vizită pentru medici",
            lead: "Cărți de vizită pentru cabinete medicale și clinici: specialitatea, programul și telefonul de programări, pe carton de 350 g. Se dau pacienților, deci tirajele sunt mari: 500-1000 de bucăți.",
            qty: [200, 500, 1000],
            format: "carton",
            tips: ["Telefonul de programări cu litere mari.", "Spatele cardului: program sau spațiu pentru următoarea programare.", "Carton mat, ca să se poată scrie pe el cu pixul."],
        },
        constructii: {
            title: "Cărți de vizită pentru construcții",
            lead: "Pentru firme de construcții, instalatori și meseriași: cărți de vizită robuste, pe carton de 350 g sau plastic, cu serviciile principale și telefonul. Se împart pe șantier, deci tiraj mare.",
            qty: [200, 500, 1000],
            format: "carton",
            tips: ["Trei servicii principale și telefonul, atât.", "Plasticul rezistă în buzunarul salopetei.", "Colțuri rotunjite ca să nu se îndoaie."],
        },
        salon: {
            title: "Cărți de vizită pentru saloane",
            lead: "Saloanele de înfrumusețare folosesc cartea de vizită și ca fișă de programare: pe față datele salonului, pe spate spațiu pentru data și ora următoarei vizite. Tiraje de 500-1000, față-verso.",
            qty: [200, 500, 1000],
            format: "carton",
            tips: ["Față-verso, cu spate pentru programări, pe carton mat.", "Instagram-ul salonului, vizibil.", "Colțuri rotunjite pentru un aspect mai fin."],
        },
        imobiliare: {
            title: "Cărți de vizită pentru agenți imobiliari",
            lead: "Agenții imobiliari împart cărți de vizită la fiecare vizionare: carton de 350 g, față-verso, cu poza agentului și telefonul. Tiraje de 500-1000 de bucăți pe agent.",
            qty: [200, 500, 1000],
            format: "carton",
            tips: ["Poza agentului pe față: se ține minte mai ușor.", "Telefon și WhatsApp mari, restul mic.", "Aceeași grafică pentru toată agenția, schimbând poza și numele."],
        },
    },
    plexiglass: {
        avocat: {
            title: "Placă plexiglas pentru cabinet de avocatură",
            lead: "Placa de la intrarea cabinetului, pe plexiglas de 3-5 mm cu print UV, prinsă în distanțiere metalice: formate de 30×20 sau 40×30 cm, cu numele cabinetului, avocații și programul.",
            sizes: [[30, 20], [40, 30], [60, 40]],
            tips: ["Plexiglas transparent cu print pe spate pentru aspect de sticlă, sau alb opac pentru contrast.", "Distanțierele metalice țin placa la 2 cm de perete.", "Text negru sau auriu pe fundal deschis: cel mai lizibil pe hol."],
        },
        doctor: {
            title: "Placă plexiglas pentru cabinet medical",
            lead: "Plăcuța cabinetului medical: numele medicului, specialitatea, programul și telefonul de programări, pe plexiglas de 3 mm, 30×20 sau 40×30 cm, cu distanțiere.",
            sizes: [[30, 20], [40, 30], [60, 40]],
            tips: ["Specialitatea și programul cu litere mari; restul mic.", "Alb opac pentru contrast maxim pe hol.", "Se livrează cu folie de protecție; se scoate după fixare."],
        },
        "placa-sediu": {
            title: "Placă de sediu din plexiglas",
            lead: "Placa de sediu de firmă, obligatorie la intrare: denumirea, CUI-ul și programul, pe plexiglas de 3-5 mm, 30×20 până la 60×40 cm, prinsă în distanțiere. Print UV direct, rezistent la exterior.",
            sizes: [[30, 20], [40, 30], [60, 40]],
            tips: ["Verifică textul obligatoriu (denumire, CUI, program) înainte de comandă.", "Pentru exterior, 5 mm grosime și distanțiere inoxidabile.", "Alb opac se vede mai bine pe fațade închise."],
        },
        transparent: {
            title: "Plexiglas transparent printat",
            lead: "Plexiglasul transparent cu print UV pe spate arată ca sticla gravată: potrivit pentru plăci de firmă, panouri de recepție și display-uri de produs, în formate de la 30×20 la 100×70 cm.",
            sizes: [[40, 30], [60, 40], [100, 70]],
            tips: ["Printul se face pe spate, în oglindă, ca să fie protejat de placă.", "Pentru culori vii pe transparent cere strat alb sub print.", "Grosime de 5 mm la peste 60 cm pe latură."],
        },
        alb: {
            title: "Plexiglas alb printat",
            lead: "Plexiglasul alb opac dă contrast maxim și e materialul pentru casete luminoase și plăci de firmă cu iluminare din spate: formate de 40×30 până la 100×70 cm, grosime 3-5 mm.",
            sizes: [[40, 30], [60, 40], [100, 70]],
            tips: ["Alb opac difuzează uniform lumina LED din casetă.", "Print UV direct pe față.", "Se taie din coli de 400×200 cm; peste, în module."],
        },
    },
};

/** Intenții generale (ieftin, rapid, premium...) valabile pentru orice produs. */
export const MARKETING_CONTENT: Record<string, { title: (product: string) => string; lead: (product: string) => string; tips: string[]; pick: "cheapest" | "premium" | "default" }> = {
    ieftin: { title: (p) => `${p} ieftin`, lead: (p) => `Cel mai mic preț pentru ${p.toLowerCase()} se obține alegând materialul standard și comandând mai multe bucăți odată: prețul pe bucată scade pe praguri de cantitate sau de suprafață. Mai jos, prețurile reale pentru varianta cea mai ieftină.`, tips: ["Materialul standard, fără finisaje suplimentare.", "Comandă tot tirajul odată, nu pe bucăți.", "Grafica proprie: taxa de design se plătește doar dacă o cerem noi."], pick: "cheapest" },
    "pret-mic": { title: (p) => `${p} la preț mic`, lead: (p) => `Prețul pentru ${p.toLowerCase()} se calculează automat pe suprafață sau pe cantitate, fără ofertă la telefon. Varianta standard, în tiraj mai mare, dă cel mai mic preț pe bucată.`, tips: ["Vezi tabelul de prețuri de mai jos pentru mărimile uzuale.", "Prețul scade de la praguri: 5, 20, 50 m² sau 500, 1000 buc.", "Fără costuri ascunse: TVA inclus."], pick: "cheapest" },
    rapid: { title: (p) => `${p} rapid`, lead: (p) => `Termenul de producție pentru ${p.toLowerCase()} este de 2-4 zile lucrătoare de la confirmarea graficii, la care se adaugă curierul. Comanda cu fișier corect (dimensiune, rezoluție) pornește în producție imediat.`, tips: ["Trimite fișierul la dimensiunea finală, ca să nu pierdem o zi cu corecturi.", "Scrie pe WhatsApp dacă ai un termen fix; îți spunem pe loc dacă se poate.", "Livrarea prin curier durează de obicei 1-2 zile lucrătoare."], pick: "default" },
    urgent: { title: (p) => `${p} urgent`, lead: (p) => `Pentru ${p.toLowerCase()} urgent, cel mai important e fișierul: dacă e corect, producția pornește în aceeași zi și durează 2-4 zile lucrătoare. Scrie-ne pe WhatsApp cu termenul tău înainte să comanzi.`, tips: ["Fișier la 1:1, PDF sau JPG, minim 150 DPI.", "Alege materialul standard: nu așteaptă aprovizionare.", "Spune-ne data la care ai nevoie; confirmăm dacă e realist."], pick: "default" },
    premium: { title: (p) => `${p} premium`, lead: (p) => `Varianta premium pentru ${p.toLowerCase()}: materialul mai gros sau mai rezistent din configurator, cu aceleași termene. Mai jos, prețurile pentru varianta premium la mărimile uzuale.`, tips: ["Material premium: durată de viață mai mare la exterior.", "Grafică la rezoluție mare, ca materialul să conteze.", "Pentru proiecte mari, cere ofertă pe WhatsApp."], pick: "premium" },
    lux: { title: (p) => `${p} de lux`, lead: (p) => `Pentru ${p.toLowerCase()} cu aspect de lux contează materialul și finisajul: varianta premium din configurator, grafică simplă și culori puține.`, tips: ["Materialul premium și un design minimal.", "Culori închise, contrast mare, fonturi subțiri.", "Comandă o mostră la o bucată înainte de tiraj."], pick: "premium" },
    hd: { title: (p) => `${p} HD`, lead: (p) => `Printul pentru ${p.toLowerCase()} se face la rezoluție înaltă; calitatea finală depinde de fișier: minim 150 DPI la dimensiunea finală pentru formate mari, 300 DPI pentru tipar.`, tips: ["Poze originale, nu din WhatsApp sau Facebook.", "Vectori pentru logo și text.", "Verificăm fișierul înainte de print și te anunțăm dacă e prea mic."], pick: "default" },
    profesional: { title: (p) => `${p} profesional`, lead: (p) => `${p} pentru firme: prețuri calculate transparent, fișier verificat înainte de producție, factură și livrare prin curier în toată țara. Mai jos, prețurile pentru mărimile și tirajele uzuale.`, tips: ["Trimite grafica în format vectorial sau la rezoluție mare.", "Comandă pentru toate punctele de lucru odată.", "Factura se emite automat la comandă."], pick: "default" },
    calitate: { title: (p) => `${p} de calitate`, lead: (p) => `Calitatea la ${p.toLowerCase()} vine din material și din fișier: materialul standard din configurator, printat la rezoluție înaltă, cu grafica ta verificată înainte de producție.`, tips: ["Materialul premium pentru exterior de durată.", "Fișier la rezoluția cerută.", "Mostră la o bucată pentru tiraje mari."], pick: "default" },
    online: { title: (p) => `${p} online`, lead: (p) => `Comanzi ${p.toLowerCase()} online: alegi dimensiunea sau cantitatea, încarci grafica, vezi prețul pe loc și plătești cu cardul sau prin transfer. Producție 2-4 zile lucrătoare, livrare prin curier.`, tips: ["Prețul se calculează instant în configurator.", "Grafica se încarcă direct în comandă.", "Status comandă și factură în cont."], pick: "default" },
    personalizat: { title: (p) => `${p} personalizat`, lead: (p) => `${p} cu grafica, textul sau poza ta, la dimensiunea sau cantitatea de care ai nevoie. Prețul se calculează pe loc; mai jos sunt mărimile și tirajele cele mai comandate.`, tips: ["Încarcă fișierul tău sau cere design în configurator.", "Orice dimensiune între limitele produsului.", "Mostră la o bucată pentru tiraje mari."], pick: "default" },
};

export function getIntentSpec(productId: string, intent: string): IntentSpec | null {
    return INTENT_CONTENT[productId]?.[intent] ?? null;
}
