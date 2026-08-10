import { JUDETE_DATA } from "./judeteData";

export type BlogPost = {
  slug: string;
  source?: string;
  title: string;
  description: string;
  date: string; // ISO date
  author?: string;
  tags: string[];
  hero?: string;
  contentHtml: string;
};

const STATIC_POSTS: BlogPost[] = [
  {
    slug: "ce-dimensiune-canvas-aleg-pentru-fiecare-camera",
    source: "tablou.net",
    title: "Ce dimensiune de tablou canvas alegi, în funcție de cameră și de perete",
    description: "Un canvas prea mic se pierde pe perete, unul prea mare aglomerează camera. Ghid practic de dimensiuni pe living, dormitor, hol și birou, cu exemple concrete de distanțe de vizionare.",
    date: "2026-03-10T09:00:00.000Z",
    author: "Echipa Tablou.net",
    tags: ["canvas", "dimensiuni", "decor interior", "ghid cumpărare", "tablou.net"],
    hero: "/blog/dimensiune-canvas.jpg",
    contentHtml: `
      <p>Cea mai frecventă greșeală la comanda unui tablou canvas nu este alegerea pozei, ci alegerea dimensiunii. O poză minunată, printată prea mic, devine un detaliu pierdut pe un perete gol. Aceeași poză, printată prea mare pe un perete îngust dintr-un hol, aglomerează spațiul. Regula de bază e simplă: dimensiunea canvasului trebuie raportată la distanța de la care îl privești în mod normal, nu la cât de mare e peretele.</p>

      <h2 class="text-2xl font-bold mt-12 mb-6">Regula rapidă: distanța de vizionare împărțită la 2-3</h2>
      <p>Măsoară (aproximativ, din ochi e suficient) de la câți metri stai de obicei în fața peretelui respectiv. Lățimea canvasului, în centimetri, ar trebui să fie undeva între jumătate și o treime din acea distanță exprimată în centimetri.</p>
      <ul class="list-disc pl-6 space-y-2 my-6">
        <li><b>Canapea la 2,5-3 metri de perete (living):</b> canvas de <b>80x120 cm</b> sau <b>90x120 cm</b> se vede bine, fără să domine complet camera.</li>
        <li><b>Pat la 1,5-2 metri de perete (dormitor):</b> <b>60x90 cm</b> sau <b>70x100 cm</b> e zona ideală — suficient de prezent, dar nu apăsător deasupra patului.</li>
        <li><b>Hol sau coridor îngust, privit din mers:</b> <b>40x60 cm</b> sau <b>50x70 cm</b>, eventual în serie de 2-3 tablouri mai mici în loc de unul singur uriaș.</li>
        <li><b>Birou sau spațiu de lucru, privit de la birou:</b> <b>30x40 cm</b> sau <b>40x60 cm</b> — suficient de vizibil de aproape, fără să încarce vizual un spațiu deja plin de alte obiecte.</li>
      </ul>

      <h2 class="text-2xl font-bold mt-12 mb-6">Perete gol vs. perete cu mobilier</h2>
      <p>Pe un perete complet gol (fără canapea, comodă sau tăblie de pat dedesubt), un singur canvas trebuie să acopere aproximativ 60-75% din lățimea zonei vizibile ca să nu pară "rătăcit". Pe un perete cu mobilier dedesubt (canapea, comodă, birou), regula se schimbă: lățimea canvasului ar trebui să fie cam 2/3 din lățimea mobilierului de dedesubt — un canvas mai lat decât canapeaua arată dezechilibrat, unul mult mai îngust pare accidental, nu intenționat.</p>

      <div class="my-10 p-8 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-2xl">
        <h3 class="text-emerald-900 font-bold mb-2">Exemplu concret:</h3>
        <p class="text-emerald-800 italic">Canapea de 200 cm lățime în living → canvas ideal între 120-140 cm lățime (dacă vrei un singur tablou mare) sau două tablouri de 60-70 cm așezate unul lângă altul, cu un spațiu de 5-8 cm între ele.</p>
      </div>

      <h2 class="text-2xl font-bold mt-12 mb-6">Când alegi mai multe tablouri mici în loc de unul mare</h2>
      <p>Un perete lung (dincolo de o canapea de colț, de exemplu) se pretează mai bine la un set de 2-3 tablouri de aceeași înălțime decât la un singur format uriaș, care ar necesita o poză cu rezoluție foarte mare ca să nu iasă neclară. Setul de tablouri are și avantajul că poți combina orientări diferite (portret + peisaj) fără să pară dezordonat, atât timp cât păstrezi aceeași înălțime pentru toate piesele din set.</p>

      <p>Dacă nu ești sigur ce dimensiune se potrivește, cel mai simplu test e cu bandă de hârtie sau cu o coală de ziar lipită temporar pe perete, în conturul dimensiunii pe care o iei în calcul — te ajută să vezi imediat dacă "trage ochiul" spre acel perete sau se pierde.</p>
    `,
  },
  {
    slug: "margine-alba-oglinda-sau-rasfranta-canvas",
    source: "tablou.net",
    title: "Margine albă, oglindă sau răsfrântă? Cele 3 tipuri de finisaj pentru canvas, explicate cu exemple",
    description: "Alegerea marginii canvasului nu e doar estetică — depinde de ce se întâmplă la marginea pozei tale. Ghid practic ca să nu tai din chip fără să vrei.",
    date: "2026-03-24T09:00:00.000Z",
    author: "Echipa Tablou.net",
    tags: ["canvas", "margine oglindă", "margine răsfrântă", "finisaj", "tablou.net"],
    hero: "/blog/margine-canvas.jpg",
    contentHtml: `
      <p>Un tablou canvas nu se printează plat, ca o foaie de hârtie — pânza se întinde pe un șasiu de lemn și se prinde pe muchii, la fel ca o pânză de pictură clasică. Asta înseamnă că marginile canvasului (aproximativ 3-4 cm pe fiecare latură) trebuie umplute cu ceva, iar la Tablou.net poți alege între trei variante: margine albă, margine oglindă și margine răsfrântă (wrap). Alegerea greșită poate tăia din subiectul pozei tale exact acolo unde nu vrei.</p>

      <h2 class="text-2xl font-bold mt-12 mb-6">Margine albă — cea mai sigură pentru poze cu subiect central</h2>
      <p>Pe margini rămâne o bandă albă, iar imaginea propriu-zisă e vizibilă doar pe partea din față a canvasului. Nimic din poză nu se pierde pe lateralele șasiului. E alegerea corectă când subiectul principal (o față, un obiect important) ajunge foarte aproape de marginea cadrului — orice altă variantă ar "mânca" din el pe muchie.</p>
      <ul class="list-disc pl-6 space-y-2 my-6">
        <li><b>Alege margine albă dacă:</b> ai o poză de portret cu fața aproape de margine, un document sau o ilustrație cu text/detalii importante lângă margine, sau vrei pur și simplu un aspect mai "de galerie", cu chenar clasic.</li>
      </ul>

      <h2 class="text-2xl font-bold mt-12 mb-6">Margine oglindă — imaginea "se răsucește" natural pe lateral</h2>
      <p>Pe muchiile șasiului se printează o versiune oglindită (în oglindă) a marginii imaginii, astfel încât privind tabloul din lateral să nu vezi o tăietură bruscă, ci o continuare vizuală naturală. Funcționează foarte bine la peisaje, texturi, fundaluri neuniforme (cer, apă, iarbă) unde nu contează exact ce se vede pe muchie, cât faptul că nu arată "tăiat".</p>
      <ul class="list-disc pl-6 space-y-2 my-6">
        <li><b>Alege margine oglindă dacă:</b> poza ta e un peisaj, o textură abstractă, sau orice imagine fără un subiect clar chiar lângă margine — cerul, marea, un gard viu se "răsucesc" natural fără să pară stranii pe lateral.</li>
      </ul>

      <h2 class="text-2xl font-bold mt-12 mb-6">Margine răsfrântă (wrap) — imaginea reală continuă pe lateral</h2>
      <p>Aici imaginea originală se extinde fizic pe muchiile șasiului, deci ce vezi pe lateral e o bucată reală din poza ta, nu o oglindire artificială. E cea mai "curată" variantă vizual — nu există nicio linie de întrerupere între față și lateral —, dar are un cost: acea bucată din margine dispare de pe fața canvasului, pentru că se folosește la înfășurarea pe șasiu.</p>
      <ul class="list-disc pl-6 space-y-2 my-6">
        <li><b>Alege margine răsfrântă dacă:</b> poza ta are spațiu liber generos în jurul subiectului principal (fundal simplu, mult cer sau perete gol în jurul persoanei) — poți "sacrifica" acea margine fără să pierzi nimic important.</li>
        <li><b>Evită dacă:</b> subiectul principal ocupă tot cadrul, edge to edge — riști ca răsfrântura să taie exact din ce vrei să vezi.</li>
      </ul>

      <div class="my-10 p-8 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-2xl">
        <h3 class="text-emerald-900 font-bold mb-2">Regulă simplă de decizie:</h3>
        <p class="text-emerald-800 italic">Uită-te la marginile pozei tale (cei 3-4 cm din exterior, pe toate laturile). Dacă acolo e ceva important (față, text, obiect) → margine albă. Dacă e ceva neutru și repetitiv (cer, textură) → margine oglindă sau răsfrântă, după gust.</p>
      </div>
    `,
  },
  {
    slug: "cum-pregatesti-o-poza-de-telefon-pentru-print-mare",
    source: "tablou.net",
    title: "Poza de pe telefon arată bine pe ecran, dar iese neclară pe canvas mare? Iată de ce și cum eviți asta",
    description: "Rezoluția care arată perfect pe un telefon de 6 inch nu înseamnă automat că arată bine și pe un canvas de 80x120 cm. Explicăm simplu ce contează cu adevărat înainte să comanzi.",
    date: "2026-04-07T09:00:00.000Z",
    author: "Echipa Tablou.net",
    tags: ["rezoluție poză", "print canvas", "calitate imagine", "ghid foto", "tablou.net"],
    hero: "/blog/rezolutie-poza-canvas.jpg",
    contentHtml: `
      <p>Cea mai frecventă întrebare pe care o primim: "Poza asta e suficient de bună pentru un canvas mare?" Răspunsul scurt: depinde mai puțin de câte "megapixeli" are telefonul tău și mai mult de trei lucruri concrete pe care le poți verifica singur în 30 de secunde, înainte să comanzi.</p>

      <h2 class="text-2xl font-bold mt-12 mb-6">1. Verifică dimensiunea reală a fișierului, nu doar cum arată pe ecran</h2>
      <p>Un telefon modern face poze de 3000-4000 pixeli lățime în mod normal — suficient pentru majoritatea dimensiunilor de canvas. Problema apare quando poza a trecut printr-o aplicație de mesagerie (WhatsApp, Facebook Messenger) înainte să ajungă la tine: aceste aplicații comprimă automat imaginile la trimitere, reducându-le uneori la sub 1000 pixeli lățime — suficient pentru a arăta bine pe ecranul telefonului, dar nu și pentru un print mare.</p>
      <ul class="list-disc pl-6 space-y-2 my-6">
        <li><b>Regulă practică:</b> pentru un canvas de până la 60x90 cm ai nevoie de minimum 2000 pixeli pe latura lungă a pozei. Pentru formate peste 80x120 cm, ideal 3000+ pixeli.</li>
        <li><b>Cum verifici:</b> deschide poza pe calculator (nu pe telefon) și uită-te la proprietăți/dimensiuni — dacă vezi ceva de genul "960x1280", e prea mică pentru un format mare; dacă vezi "3024x4032" (tipic pentru un iPhone recent), ești în regulă.</li>
        <li><b>Cea mai sigură sursă:</b> ia poza direct din galeria telefonului sau dintr-un email/link de Google Drive/iCloud, nu dintr-o conversație de WhatsApp sau un story de Instagram salvat pe telefon.</li>
      </ul>

      <h2 class="text-2xl font-bold mt-12 mb-6">2. Zoom la 100% înainte să încarci</h2>
      <p>Chiar dacă rezoluția e suficient de mare pe hârtie, o poză poate fi ușor neclară din start (mișcare la declanșare, focus greșit). Cel mai bun test: deschide poza pe calculator și dă zoom la 100% (nu "fit to screen"). Dacă la 100% textul sau detaliile fine arată neclare deja pe ecran, vor arăta la fel sau mai rău pe canvas — un canvas mare nu "repară" o poză neclară, doar mărește problema.</p>

      <h2 class="text-2xl font-bold mt-12 mb-6">3. Ce zonă din poză va fi vizibilă, după decupare</h2>
      <p>Multe poze nu au exact proporția canvasului dorit (de exemplu o poză 4:3 pe un canvas pătrat 1:1). Configuratorul nostru îți arată o previzualizare reală a decupării înainte de finalizare — verifică mereu acolo dacă rămân în cadru elementele importante (fețe, orizontul, obiectele centrale). Dacă previzualizarea taie ceva important, cea mai simplă soluție e să alegi o dimensiune de canvas cu proporție mai apropiată de poza originală, în loc să forțezi o decupare agresivă.</p>

      <div class="my-10 p-8 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-2xl">
        <h3 class="text-emerald-900 font-bold mb-2">Sfat rapid:</h3>
        <p class="text-emerald-800 italic">Dacă ai dubii, încarcă poza direct în configurator și uită-te la avertismentul de calitate — dacă rezoluția e prea mică pentru dimensiunea aleasă, sistemul te anunță înainte să plasezi comanda, nu după ce ai primit tabloul acasă.</p>
      </div>
    `,
  },
  {
    slug: "tablou-canvas-cadou-personalizat-ocazii",
    source: "tablou.net",
    title: "Tablou canvas ca și cadou: pentru ce ocazii chiar contează și cum alegi poza potrivită",
    description: "Un tablou canvas e cadoul care rămâne pe perete ani de zile — spre deosebire de multe cadouri de ocazie. Ghid practic pentru alegerea pozei și a formatului, în funcție de eveniment.",
    date: "2026-04-21T09:00:00.000Z",
    author: "Echipa Tablou.net",
    tags: ["cadou personalizat", "canvas foto", "nuntă", "aniversare", "tablou.net"],
    hero: "/blog/canvas-cadou.jpg",
    contentHtml: `
      <p>Diferența dintre un cadou uitat într-un sertar și unul care rămâne pe peretele cuiva ani de zile stă, de obicei, în două decizii: poza aleasă și dimensiunea potrivită pentru locul unde probabil va atârna. Un canvas personalizat funcționează cel mai bine când nu doar "arată bine", ci spune ceva concret despre relația dintre tine și persoana căreia îi este destinat.</p>

      <h2 class="text-2xl font-bold mt-12 mb-6">Nuntă sau aniversare de cuplu</h2>
      <p>Cea mai sigură alegere nu e neapărat cea mai recentă poză de cuplu, ci una cu compoziție simplă — fundal curat, fără prea multe alte persoane sau obiecte în cadru, ideal cu spațiu liber în jurul cuplului (util și pentru o eventuală margine răsfrântă, dacă vrei acel finisaj fără linii vizibile). Formatul <b>60x90 cm</b> sau <b>70x100 cm</b> funcționează foarte bine pentru un dormitor sau living de cuplu tânăr, care de obicei nu are pereți foarte mari.</p>

      <h2 class="text-2xl font-bold mt-12 mb-6">Cadou pentru părinți sau bunici</h2>
      <p>Aici funcționează cel mai bine o poză cu nepoții sau cu întreaga familie, nu neapărat cea mai "artistică" fotografie, ci una autentică — genul de poză pe care ai vrea s-o vezi în fiecare zi. Dimensiunea depinde de unde va sta: pentru holul unei case (unde se trece rapid pe lângă ea) un format mediu, <b>50x70 cm</b>, funcționează perfect; pentru livingul principal, poți merge mai mare, <b>80x120 cm</b>.</p>

      <h2 class="text-2xl font-bold mt-12 mb-6">Cadou pentru un coleg sau șef care se mută la un birou nou</h2>
      <p>Aici formatul cu ramă (opțiunea "canvas cu ramă" din configurator) e adesea mai potrivit decât canvasul clasic pe șasiu — arată mai formal, se potrivește mai bine pe un perete de birou decât un format mare de living. Alege o poză neutră (peisaj, arhitectură, o poză de echipă de la un eveniment recent) mai degrabă decât una foarte personală.</p>

      <h2 class="text-2xl font-bold mt-12 mb-6">Cât de aproape de dată trebuie să comanzi?</h2>
      <p>Livrarea standard e de 24-48h din momentul confirmării graficii, dar recomandăm cel puțin 4-5 zile lucrătoare înainte de eveniment ca marjă de siguranță pentru livrarea curierului, mai ales dacă evenimentul e într-un weekend. Dacă vrei să surprinzi pe cineva chiar de ziua evenimentului, verifică din timp opțiunile de livrare rapidă disponibile la finalizarea comenzii.</p>

      <div class="my-10 p-8 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-2xl">
        <h3 class="text-emerald-900 font-bold mb-2">Idee simplă care funcționează mereu:</h3>
        <p class="text-emerald-800 italic">Dacă nu ești sigur pe ce poză să mizezi, alege una în care persoana cadorisită zâmbește natural, nu una pozată — cadourile foto cu momente spontane rezistă mult mai bine testul timpului pe un perete decât pozele de studio.</p>
      </div>
    `,
  },
  {
    slug: "canvas-cu-rama-vs-canvas-clasic-pe-sasiu",
    source: "tablou.net",
    title: "Canvas cu ramă sau canvas clasic pe șasiu? Diferența nu e doar estetică",
    description: "Cele două variante de canvas de la Tablou.net arată diferit, se montează diferit și au prețuri diferite. Explicăm clar când merită fiecare.",
    date: "2026-05-05T09:00:00.000Z",
    author: "Echipa Tablou.net",
    tags: ["canvas cu ramă", "șasiu lemn", "montaj tablou", "ghid produs", "tablou.net"],
    hero: "/blog/canvas-rama-vs-clasic.jpg",
    contentHtml: `
      <p>În configuratorul Tablou.net găsești două moduri de a comanda un tablou canvas: pe <b>șasiu clasic de lemn</b> (varianta tradițională, gata de agățat direct pe perete) sau <b>cu ramă</b> (canvasul montat într-o ramă suplimentară, la dimensiuni prestabilite). Nu una e "mai bună" decât cealaltă — sunt gândite pentru situații diferite.</p>

      <h2 class="text-2xl font-bold mt-12 mb-6">Canvas clasic pe șasiu — varianta flexibilă</h2>
      <p>Pânza se întinde și se capsează direct pe un șasiu de lemn masiv, iar tabloul rezultat se agață direct pe perete, fără altă ramă. Avantajul principal: poți alege orice dimensiune, de la 30x30 cm până la formate mari peste 100x120 cm, cu preț calculat pe metru pătrat, plus costul șasiului per metru liniar de perimetru. E varianta standard pentru living, dormitor, birou — practic orice spațiu unde vrei un aspect modern, fără chenar vizibil.</p>

      <h2 class="text-2xl font-bold mt-12 mb-6">Canvas cu ramă — varianta la dimensiuni fixe, aspect mai formal</h2>
      <p>Aici canvasul e montat într-o ramă suplimentară, la dimensiuni prestabilite (de la 30x40 cm până la 100x120 cm, în format dreptunghiular sau pătrat). Prețul se calculează diferit — pe bază de tabel de prețuri fixe per dimensiune, cu discount automat la cantități mai mari (de la 2 bucăți în sus). E alegerea potrivită când:</p>
      <ul class="list-disc pl-6 space-y-2 my-6">
        <li>Vrei un aspect mai clasic/formal — potrivit pentru cabinete medicale, birouri, recepții.</li>
        <li>Comanzi mai multe bucăți la aceeași dimensiune — discountul de cantitate face diferența de preț relevantă.</li>
        <li>Vrei o piesă "gata de expus", fără să te preocupe grosimea șasiului sau modul în care arată din lateral.</li>
      </ul>

      <h2 class="text-2xl font-bold mt-12 mb-6">Ce înseamnă "reducere pe cantitate" la varianta cu ramă</h2>
      <p>Prețul per bucată scade automat pe măsură ce comanzi mai multe tablouri identice ca dimensiune — de la 2 până la 5 bucăți prețul scade puțin, de la 6 până la 15 bucăți scade semnificativ, iar peste 40 de bucăți ajunge la cel mai mic preț per unitate din grilă. Asta face varianta cu ramă foarte eficientă pentru comenzi de tip corporate (aceeași imagine, mai multe filiale) sau pentru cadouri multiple la un eveniment (nuntă, botez) unde vrei aceeași poză în mai multe exemplare.</p>

      <div class="my-10 p-8 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-2xl">
        <h3 class="text-emerald-900 font-bold mb-2">Pe scurt:</h3>
        <p class="text-emerald-800 italic">O singură piesă, dimensiune la alegere, aspect modern → canvas clasic pe șasiu. Mai multe piese identice sau aspect mai formal, la o dimensiune din grilă → canvas cu ramă.</p>
      </div>
    `,
  },
];

const COUNTY_POSTS: BlogPost[] = JUDETE_DATA.map((j, index) => ({
  slug: `servicii-print-judet-${j.slug}`,
  title: `Servicii de print în județul ${j.name} - Tablou.net`,
  description: `Găsește soluții de print profesional în județul ${j.name}. Livrăm rapid bannere, autocolante și pliante în ${j.localities.join(', ')} și localitățile învecinate.`,
  date: new Date(2024, 8, 1 + (index * 6), 9 + (index % 8), (index * 7) % 60).toISOString(),
  author: "Echipa Tablou",
  tags: [j.name.toLowerCase(), "print digital", "bannere", j.slug],
  contentHtml: `
    <p>Dacă ai nevoie de materiale publicitare de impact în județul <b>${j.name}</b>, Tablou.net este soluția ta modernă și rapidă. Oferim servicii de print digital de înaltă calitate, optimizate pentru vizibilitate maximă.</p>

    <h2>Livrare rapidă în ${j.name}</h2>
    <p>Sistemul nostru de logistică asigură livrarea comenzilor tale în cel mai scurt timp în localități precum: ${j.localities.join(', ')}.</p>

    <h2>Produse disponibile:</h2>
    <ul>
      <li><b>Bannere Publicitare:</b> Ideale pentru promovare outdoor durabilă.</li>
      <li><b>Autocolante Personalizate:</b> Decupate la formă, gata de aplicat.</li>
      <li><b>Pliante și Flyere:</b> Pentru o comunicare directă cu potențialii clienți.</li>
      <li><b>Canvas și Tablouri:</b> Transformă sediul într-un spațiu modern.</li>
      <li><b>Panouri Rigide:</b> Din plexiglass sau PVC, pentru semnalistică premium.</li>
    </ul>

    <p>Folosește configuratorul nostru online pentru a calcula prețul instant. Selectezi materialul, introduci dimensiunile și plasezi comanda fără telefoane sau e-mailuri inutile. Calitatea Tablou.net este acum disponibilă pentru orice afacere din <b>${j.name}</b>!</p>
  `
}));

export const POSTS: BlogPost[] = [...STATIC_POSTS, ...COUNTY_POSTS];

export function getAllPosts() {
  return POSTS.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string) {
  return POSTS.find((p) => p.slug === slug);
}

export function getAllTags() {
  const tags = new Set<string>();
  POSTS.forEach((p) => p.tags.forEach((t) => tags.add(t)));
  return Array.from(tags);
}

export function getAllBlogSlugs() {
  return POSTS.map((p) => p.slug);
}
