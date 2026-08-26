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
  {
    slug: "cum-alegi-poza-de-familie-pentru-tablou-canvas-mare",
    source: "tablou.net",
    title: "Cum alegi o poză de familie pentru un tablou canvas mare: rezoluție, cadraj, lumină — ghid fără termeni tehnici",
    description: "Ai zeci de poze de familie în telefon și nu știi pe care s-o pui pe un canvas mare de living? Ghid practic, fără jargon foto, ca să alegi poza care chiar arată bine mărită.",
    date: "2026-05-19T09:00:00.000Z",
    author: "Echipa Tablou.net",
    tags: ["poză de familie", "canvas mare", "ghid cumpărare", "decor living", "tablou.net"],
    hero: "/blog/poza-familie-canvas-mare.jpg",
    contentHtml: `
      <p>Ai o galerie întreagă de poze de familie în telefon și trebuie să alegi una singură pentru un canvas mare de living. Toate arată bine pe ecran, dar știi din experiență (sau din povestea unui prieten) că nu orice poză "arată bine pe telefon" iese la fel de bine mărită pe un perete de 90x120 cm. Vestea bună: nu ai nevoie de cunoștințe de fotografie ca să alegi corect. Ai nevoie doar să te uiți la poză cu trei întrebări simple în minte — cine trebuie să se vadă clar, cum cade lumina, și dacă poza "ține" atunci când o privești mărită.</p>

      <h2 class="text-2xl font-bold mt-12 mb-6">Întrebarea 1: cine trebuie să fie clar vizibil în poză?</h2>
      <p>Într-o poză de familie cu 5-6 persoane, aproape mereu una sau două fețe sunt puțin întoarse, cu ochii închiși sau parțial acoperite de altcineva din cadru. Pe un telefon, la dimensiune mică, nu observi asta — creierul "completează" automat ce lipsește. Mărit pe un canvas de un metru lățime, orice detaliu de genul acesta devine vizibil imediat.</p>
      <ul class="list-disc pl-6 space-y-2 my-6">
        <li><b>Verificare rapidă:</b> mărește poza pe calculator (nu pe telefon) la dimensiune mare pe ecran și uită-te rând pe rând la fiecare față din cadru. Dacă toate sunt clare, cu ochii deschiși și orientate spre cameră sau natural într-o direcție, poza e un candidat bun.</li>
        <li><b>Dacă una singură persoană nu iese bine:</b> nu renunța automat — verifică dacă ai o altă poză din aceeași serie (majoritatea telefoanelor fac mai multe cadre la rând) unde exact persoana respectivă arată mai bine.</li>
      </ul>

      <h2 class="text-2xl font-bold mt-12 mb-6">Întrebarea 2: cum cade lumina pe fețe?</h2>
      <p>Nu ai nevoie de termeni tehnici ca să recunoști o poză bine luminată — ai nevoie doar să te uiți dacă fețele au umbre dure (nas, pomeți, bărbie foarte întunecate față de restul feței) sau dacă totul e cam plat și fără contrast, semn că poza a fost făcută cu blitz direct, de aproape. Ambele situații se văd mult mai accentuat pe un format mare decât pe ecranul unui telefon.</p>
      <ul class="list-disc pl-6 space-y-2 my-6">
        <li><b>Semn bun:</b> lumină uniformă pe fețe, fără umbre dure, culori naturale ale pielii (nu prea gălbui, nu prea albăstrui) — de obicei poze făcute lângă o fereastră sau afară, într-o zi înnorată sau la umbră.</li>
        <li><b>Semn de atenție:</b> poze făcute cu soare puternic direct în față (ochii mijiți, umbre dure sub nas) sau cu blitz de telefon în interior, seara (fețe albite, fundal foarte întunecat) — pot ieși pe canvas, dar cu un contrast mai dur decât te aștepți.</li>
      </ul>

      <h2 class="text-2xl font-bold mt-12 mb-6">Întrebarea 3: cum arată cadrul, nu doar oamenii din el?</h2>
      <p>O poză de familie foarte bună ca amintire (toată lumea râde, momentul e autentic) nu e automat și o poză bună pentru un tablou canvas mare, dacă fundalul e aglomerat — o bucătărie plină de vase, o stradă cu multe mașini, alți oameni străini în plan secund. Pe un format mare, ochiul rătăcește spre acele detalii din fundal în loc să rămână pe familia ta.</p>
      <ul class="list-disc pl-6 space-y-2 my-6">
        <li><b>Fundal simplu:</b> perete neutru, cer, iarbă, apă, nisip — orice fundal fără prea multe detalii concurente ajută subiectul principal să iasă în evidență pe formatul mare.</li>
        <li><b>Fundal aglomerat, dar poza e prea bună ca s-o pierzi:</b> nu-i nicio problemă — alege pur și simplu un format mai apropiat de cadru (mai puțin lat) sau discută cu noi despre o decupare care elimină din marginile aglomerate, păstrând familia în centru.</li>
      </ul>

      <h2 class="text-2xl font-bold mt-12 mb-6">Un test simplu, fără nicio aplicație: privește poza de la 2 metri</h2>
      <p>Cel mai practic truc, valabil pentru orice poză pe care ești pe cale s-o alegi: pune telefonul sau ecranul calculatorului la o distanță de 2-2,5 metri de tine (cam cât e distanța reală de la canapea până la peretele unde va sta canvasul) și privește poza de acolo. Dacă la acea distanță toate fețele se disting clar și poza încă "spune ceva", e un semn bun. Dacă la 2 metri deja pare neclară sau greu de citit, aceeași senzație se va accentua pe un canvas fizic de dimensiuni mari.</p>

      <h2 class="text-2xl font-bold mt-12 mb-6">Rezoluția, pe scurt, fără cifre complicate</h2>
      <p>Nu trebuie să calculezi nimic — încarcă poza direct în configuratorul nostru și alege dimensiunea de canvas la care te gândești. Dacă fișierul e prea mic pentru acel format, sistemul te avertizează automat înainte să plasezi comanda, cu o explicație simplă despre ce dimensiune de canvas s-ar potrivi mai bine acelei poze. Nu ai nevoie să știi ce înseamnă "rezoluție" sau "pixeli" — configuratorul face verificarea în locul tău.</p>

      <h2 class="text-2xl font-bold mt-12 mb-6">Când ai mai multe poze aproape identice, cum alegi una singură?</h2>
      <p>La o ședință foto de familie sau la o sărbătoare, de obicei rămâi cu 10-20 de poze foarte asemănătoare. În loc să te chinui să le compari una câte una pe ecran mic, trimite-le pe toate pe un ecran mai mare (calculator sau televizor, dacă are opțiunea) și elimină rapid pe rând pe cele cu cineva care clipește, cu priviri în altă parte decât camera, sau cu compoziție ciudată (cineva tăiat pe jumătate din cadru). De regulă rămâi, după acest proces de eliminare, cu 2-3 favorite reale — și din acelea alegi finala uitându-te la lumină și la fundal, așa cum am descris mai sus.</p>

      <div class="my-10 p-8 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-2xl">
        <h3 class="text-emerald-900 font-bold mb-2">Pe scurt, cele 3 verificări înainte să comanzi:</h3>
        <p class="text-emerald-800 italic">Fețele clare și fără ochi închiși, lumină uniformă fără umbre dure, fundal simplu care nu distrage atenția de la familie. Dacă poza trece de toate trei, ai un candidat foarte bun pentru un canvas mare.</p>
      </div>
    `,
  },
  {
    slug: "galerie-de-perete-aranjare-tablouri-canvas",
    source: "tablou.net",
    title: "Galerie de perete: cum aranjezi mai multe tablouri canvas împreună, cu șabloane simple de aranjare",
    description: "Un perete gol devine o galerie de familie cu 3-6 tablouri canvas aranjate corect. Trei șabloane simple, cu distanțe și înălțimi exacte, ca să nu greșești la găurit.",
    date: "2026-06-02T09:00:00.000Z",
    author: "Echipa Tablou.net",
    tags: ["galerie de perete", "aranjare tablouri", "decor interior", "canvas multiplu", "tablou.net"],
    hero: "/blog/galerie-perete-canvas.jpg",
    contentHtml: `
      <p>Un singur tablou canvas, oricât de reușit, poate arăta singuratic pe un perete lung. O galerie de perete — mai multe tablouri canvas aranjate împreună — umple spațiul cu personalitate și îți dă ocazia să pui laolaltă poze din momente diferite, nu doar una singură. Problema, în practică, e că "aranjare frumoasă" sună subiectiv și mulți oameni amână proiectul de teamă să nu găurească peretele degeaba. Nu trebuie să fie complicat — sunt doar câteva șabloane simple care funcționează aproape garantat.</p>

      <h2 class="text-2xl font-bold mt-12 mb-6">De ce o galerie de tablouri arată adesea mai bine decât unul singur, mare</h2>
      <p>Un canvas foarte mare, pe un perete lung, are nevoie de o poză cu compoziție puternică și rezoluție foarte bună ca să "umple" bine spațiul fără să pară gol pe la margini. O galerie de 3-6 tablouri mai mici rezolvă asta natural: fiecare piesă are propriul ei subiect, iar per total, spațiul e umplut vizual chiar dacă fiecare tablou în parte e de dimensiune moderată (30x40 cm, 40x60 cm). În plus, poți combina poze din perioade diferite (o nuntă, un copil mic, o vacanță recentă) fără ca asta să pară incoerent, atât timp cât respecți un șablon de aranjare consistent.</p>

      <h2 class="text-2xl font-bold mt-12 mb-6">Șablonul 1: rândul unic, aceeași înălțime</h2>
      <p>Cel mai simplu și cel mai sigur șablon: 3-5 tablouri de aceeași înălțime (chiar dacă lățimile diferă — un portret lângă un peisaj, de exemplu), aliniate pe un singur rând orizontal, cu centrul fiecărui tablou la aceeași înălțime de la podea. E ideal pentru holuri, coridoare sau deasupra unei console/comode lungi.</p>
      <ul class="list-disc pl-6 space-y-2 my-6">
        <li><b>Distanța între tablouri:</b> 5-8 cm între margini, constant pe tot rândul — nu mai puțin (arată aglomerat), nu mai mult de 10-12 cm (arată ca piese separate, nu ca un set).</li>
        <li><b>Înălțimea centrului:</b> aproximativ 145-150 cm de la podea până la centrul fiecărui tablou, standard folosit în muzee și galerii pentru a se potrivi cu nivelul natural al privirii unui adult.</li>
      </ul>

      <h2 class="text-2xl font-bold mt-12 mb-6">Șablonul 2: grid simetric (2x2 sau 3x3)</h2>
      <p>Tablouri identice ca dimensiune, aranjate într-un grid perfect simetric — 4 tablouri în format 2x2 sau 9 tablouri în 3x3. Funcționează foarte bine cu poze din aceeași ședință foto sau cu aceeași temă (de exemplu 4 poze din aceeași vacanță, sau 4 poze cu fiecare membru al familiei, la aceeași dimensiune). Efectul e ordonat, aproape arhitectural — potrivit pentru living modern sau birou.</p>
      <ul class="list-disc pl-6 space-y-2 my-6">
        <li><b>Distanța constantă:</b> 5-6 cm între toate tablourile, atât pe orizontală cât și pe verticală — cheia acestui șablon e consistența perfectă a spațiilor, altfel se pierde efectul de grid.</li>
        <li><b>Sfat practic:</b> comandă toate piesele grid-ului la aceeași dimensiune (de exemplu patru bucăți de 40x40 cm) — diferențele mici de mărime, invizibile separat, devin vizibile imediat într-un grid simetric.</li>
      </ul>

      <h2 class="text-2xl font-bold mt-12 mb-6">Șablonul 3: aranjarea liberă ("salon"), pentru cine nu vrea simetrie perfectă</h2>
      <p>Tablouri de dimensiuni diferite, aranjate organic în jurul unui punct central, fără reguli stricte de aliniere — genul de perete plin de amintiri pe care îl vezi în case cu multă istorie de familie. Pare mai greu de planificat, dar există un truc simplu: alege un tablou "ancoră" (cel mai mare din set) și poziționează-l aproximativ la centru, apoi adaugă celelalte piese în jurul lui, urmărind să echilibrezi vizual stânga cu dreapta și sus cu jos, fără să te forțezi să alinieri marginile perfect.</p>
      <ul class="list-disc pl-6 space-y-2 my-6">
        <li><b>Regulă de bază:</b> distanța minimă între orice două tablouri, chiar și în aranjarea liberă, ar trebui să fie de minimum 5 cm — sub acea distanță, ochiul le percepe ca fiind lipite accidental, nu ca o compoziție intenționată.</li>
        <li><b>Tablou ancoră:</b> alege pentru piesa centrală cea mai puternică poză din set (cea cu cea mai bună compoziție sau cea mai importantă emoțional) — restul pieselor se organizează vizual în jurul ei.</li>
      </ul>

      <h2 class="text-2xl font-bold mt-12 mb-6">Cum planifici aranjarea înainte să dai o singură gaură în perete</h2>
      <p>Trucul folosit de aproape toți cei care montează o galerie de perete pentru prima dată: decupezi din hârtie de ambalaj sau ziar dreptunghiuri exact la dimensiunea fiecărui tablou comandat și le lipești temporar pe perete cu bandă adezivă, în aranjamentul ales. Poți muta, ajusta distanțele și verifica din diverse unghiuri ale camerei înainte să bați vreun cui. Abia după ce ești mulțumit de aranjament, marchezi cu creion poziția exactă a fiecărui colț și treci la montaj efectiv.</p>

      <h2 class="text-2xl font-bold mt-12 mb-6">O greșeală frecventă: prea sus pe perete</h2>
      <p>Cea mai comună greșeală la o galerie nouă e montarea prea sus, la înălțimea la care "pare corect" din picioare, dar nu și din poziția în care stai de obicei în cameră (așezat pe canapea, de exemplu). Regula celor 145-150 cm până la centrul compoziției, menționată la șablonul 1, se aplică și galeriilor cu mai multe piese — calculează centrul întregii compoziții (nu al fiecărui tablou individual) la acea înălțime, apoi distribuie restul pieselor în jurul lui.</p>

      <div class="my-10 p-8 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-2xl">
        <h3 class="text-emerald-900 font-bold mb-2">Cel mai sigur punct de plecare:</h3>
        <p class="text-emerald-800 italic">Dacă e prima ta galerie de perete, alege șablonul 1 (rândul unic, aceeași înălțime) — e cel mai iertător la mici greșeli de aliniere și arată bine aproape garantat, chiar dacă distanțele nu sunt milimetrice.</p>
      </div>
    `,
  },
  {
    slug: "tablou-canvas-alb-negru-sau-color",
    source: "tablou.net",
    title: "Tablou canvas alb-negru sau color? Când alegi fiecare variantă, în funcție de decor",
    description: "Aceeași poză poate arăta complet diferit pe canvas, în funcție de alegerea alb-negru sau color. Ghid practic despre când merită fiecare variantă, în funcție de stilul camerei.",
    date: "2026-06-16T09:00:00.000Z",
    author: "Echipa Tablou.net",
    tags: ["alb-negru", "canvas color", "decor interior", "stil foto", "ghid cumpărare", "tablou.net"],
    hero: "/blog/canvas-alb-negru-color.jpg",
    contentHtml: `
      <p>O întrebare pe care o primim des în configurator: aceeași poză, dar oare arată mai bine în alb-negru sau păstrată în culorile originale? Nu există un răspuns universal valabil — depinde de poza în sine, dar mai ales de camera unde va atârna tabloul. Alb-negru și color spun povești diferite pe perete, iar alegerea corectă ține mai mult de decor decât de "modă".</p>

      <h2 class="text-2xl font-bold mt-12 mb-6">Ce face alb-negru cu o poză</h2>
      <p>Eliminând culoarea, alb-negru mută atenția privitorului direct pe formă, expresie și contrast — practic, pe emoția din poză, nu pe contextul din jurul ei. O poză de familie în alb-negru pare automat mai "atemporală", pentru că nu mai poți lega imaginea de o anumită modă vestimentară sau de o culoare de perete la modă într-un anumit an. E motivul pentru care multe portrete de familie sau poze de cuplu arată surprinzător de bine în alb-negru, chiar dacă poza originală color nu părea nimic special.</p>
      <ul class="list-disc pl-6 space-y-2 my-6">
        <li><b>Alb-negru funcționează foarte bine pentru:</b> portrete, poze cu expresii puternice (râs, emoție evidentă), poze cu multă textură (riduri, mâini, material de haine), și poze unde culorile din fundal sunt cam haotice sau nu se potrivesc bine între ele.</li>
      </ul>

      <h2 class="text-2xl font-bold mt-12 mb-6">Ce păstrează color, pe care alb-negru îl pierde</h2>
      <p>Culoarea păstrează exact atmosfera reală a momentului — cerul de la apus într-o poză de vacanță, rochia de o anumită culoare de la o nuntă, verdele proaspăt al ierbii dintr-o poză de primăvară cu copiii. Dacă acele detalii de culoare contează pentru amintirea respectivă, transformarea în alb-negru le elimină definitiv, chiar dacă rezultatul arată "artistic".</p>
      <ul class="list-disc pl-6 space-y-2 my-6">
        <li><b>Color funcționează foarte bine pentru:</b> peisaje, poze de vacanță, poze cu copii mici (unde culorile vii ale hainelor sau jucăriilor fac parte din farmecul pozei), și orice poză unde vrei să recreezi exact atmosfera reală a momentului, nu o versiune stilizată a ei.</li>
      </ul>

      <h2 class="text-2xl font-bold mt-12 mb-6">În funcție de stilul camerei unde va sta tabloul</h2>
      <p>Aici intervine partea practică, cea care contează cel mai mult în alegerea finală. Un tablou nu trăiește izolat — trăiește pe un perete, lângă o anumită paletă de culori a camerei.</p>
      <ul class="list-disc pl-6 space-y-2 my-6">
        <li><b>Decor minimalist, tonuri neutre (alb, gri, bej, lemn deschis):</b> alb-negru se integrează aproape întotdeauna perfect, fără să intre în conflict cu nicio culoare din cameră. E alegerea "sigură" pentru un living modern, minimalist.</li>
        <li><b>Decor colorat, cu accente vii (pernele, covorul, pereți colorați):</b> un canvas color poate prelua și accentua acele culori din cameră, creând o legătură vizuală între tablou și restul decorului — de exemplu o poză de vacanță cu multă apă turcoaz, într-o cameră cu accente similare.</li>
        <li><b>Decor clasic, cald (lemn închis, tonuri de maro, crem):</b> ambele variante funcționează, dar alb-negru cu ramă simplă neagră sau naturală tinde să arate mai "de galerie", în timp ce color cu tonuri calde se armonizează natural cu lemnul închis.</li>
      </ul>

      <h2 class="text-2xl font-bold mt-12 mb-6">Combinarea alb-negru și color în aceeași galerie de perete</h2>
      <p>Dacă plănuiești o galerie de perete cu mai multe tablouri (vezi și ghidul nostru dedicat aranjării mai multor tablouri împreună), un truc simplu care funcționează aproape mereu: toate piesele în alb-negru, cu o singură excepție color ca "punct de accent" — de exemplu 4 poze alb-negru și una singură color, care devine automat punctul central al compoziției fără niciun efort suplimentar. Amestecul aleatoriu, jumătate-jumătate, fără un plan clar, tinde să arate neintenționat mai degrabă decât stilizat.</p>

      <h2 class="text-2xl font-bold mt-12 mb-6">Când alb-negru "salvează" o poză cu probleme de culoare</h2>
      <p>Poze vechi, scanate de pe hârtie, sau poze făcute în interior cu lumină artificială galbenă au adesea un ton de culoare ciudat — prea gălbui, prea verzui, greu de corectat perfect. În aceste cazuri, alb-negru e adesea alegerea practică cea mai bună: elimină complet problema de culoare, în loc să încerci s-o corectezi și să riști un rezultat nenatural. E motivul pentru care multe poze de familie vechi, moștenite de la bunici, arată mai bine transformate în alb-negru decât păstrate în culorile originale, adesea decolorate de trecerea timpului.</p>

      <h2 class="text-2xl font-bold mt-12 mb-6">Nu trebuie să decizi definitiv înainte să vezi rezultatul</h2>
      <p>În configuratorul nostru poți previzualiza poza atât în varianta color originală, cât și transformată în alb-negru, înainte de a plasa comanda. Recomandarea noastră practică: dacă ești nehotărât, uită-te la ambele variante direct pe ecran, la dimensiunea reală a canvasului ales — diferența de impact între cele două variante devine mult mai clară la dimensiune mare decât pe o poză mică, de previzualizare.</p>

      <div class="my-10 p-8 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-2xl">
        <h3 class="text-emerald-900 font-bold mb-2">Regulă simplă de decizie:</h3>
        <p class="text-emerald-800 italic">Dacă în poză culoarea "spune ceva" important despre moment (locul, sezonul, o culoare specifică) — păstreaz-o color. Dacă poza e mai degrabă despre oameni și emoție, iar fundalul sau culorile nu adaugă nimic esențial — încearcă alb-negru, se potrivește aproape mereu cu orice stil de decor.</p>
      </div>
    `,
  },
];

type Judet = { name: string; slug: string; localities: string[] };

function hashSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

const COUNTY_PRODUCT_CATALOG = [
  { label: "Bannere Publicitare", desc: "Ideale pentru promovare outdoor durabilă, rezistente la intemperii." },
  { label: "Autocolante Personalizate", desc: "Decupate la formă, gata de aplicat pe orice suprafață." },
  { label: "Pliante și Flyere", desc: "Pentru o comunicare directă cu potențialii clienți." },
  { label: "Canvas și Tablouri", desc: "Transformă orice spațiu într-unul modern și personal." },
  { label: "Panouri Rigide (PVC / Plexiglass / Alucobond)", desc: "Semnalistică premium, rezistentă în timp." },
  { label: "Rollup-uri", desc: "Portabile, ideale pentru târguri și evenimente." },
  { label: "Tricouri și Hanorace Personalizate", desc: "Print de calitate pe textile, pentru echipe și evenimente." },
];

function pickRotating<T>(arr: T[], offset: number, count: number): T[] {
  const out: T[] = [];
  for (let i = 0; i < count; i++) out.push(arr[(offset + i) % arr.length]);
  return out;
}

function buildCountyPost(j: Judet, index: number, siteName: string, shortName: string): BlogPost {
  // Salted with siteName so the same județ doesn't render byte-identical
  // copy across every site in the network (duplicate content across domains).
  const seed = hashSeed(`${siteName}::${j.slug}`);
  const variant = seed % 6;
  const localityOffset = seed % j.localities.length;
  const productOffset = seed % COUNTY_PRODUCT_CATALOG.length;
  const mainLocality = j.localities[localityOffset];
  const otherLocalities = j.localities.filter((l) => l !== mainLocality);
  const products = pickRotating(COUNTY_PRODUCT_CATALOG, productOffset, Math.min(4, COUNTY_PRODUCT_CATALOG.length));
  const productListHtml = products.map((p) => `<li><b>${p.label}:</b> ${p.desc}</li>`).join("\n");
  const date = new Date(2023, 11, 23, 15, index).toISOString();
  const tags = [j.name.toLowerCase(), "print digital", j.slug];
  const slug = `servicii-print-judet-${j.slug}`;
  const author = `Echipa ${shortName}`;

  if (variant === 0) {
    return {
      slug,
      title: `Print și materiale publicitare cu livrare rapidă în ${mainLocality} și tot județul ${j.name}`,
      description: `Comandă online bannere, autocolante și materiale publicitare cu livrare rapidă în ${mainLocality}${otherLocalities.length ? `, ${otherLocalities.slice(0, 2).join(", ")}` : ""} și restul județului ${j.name}.`,
      date, author, tags,
      contentHtml: `
        <p>Dacă ești din ${mainLocality} sau din altă localitate din județul <b>${j.name}</b> și ai nevoie de materiale publicitare rapid, nu mai e nevoie să cauți un atelier local — configurezi online, plasezi comanda și primești coletul direct la adresă, fără drumuri și fără telefoane.</p>
        <h2>Livrare în toate localitățile din ${j.name}</h2>
        <p>Livrăm regulat comenzi în ${mainLocality}${otherLocalities.length ? `, dar și în ${otherLocalities.join(", ")}` : ""}. Curierul preia coletul direct de la noi din producție, fără intermediari.</p>
        <h2>Ce poți comanda:</h2>
        <ul>${productListHtml}</ul>
        <p>Configuratorul online îți arată prețul exact înainte să plasezi comanda — introduci dimensiunile, alegi materialul și vezi costul final, fără surprize la livrare.</p>
      `
    };
  }
  if (variant === 1) {
    return {
      slug,
      title: `De ce afacerile din ${j.name} aleg print digital de calitate, nu doar cel mai ieftin`,
      description: `Tehnologie de print digital, materiale rezistente și finisaje corecte pentru afacerile din județul ${j.name} — nu doar cel mai mic preț.`,
      date, author, tags,
      contentHtml: `
        <p>În județul <b>${j.name}</b>, ca oriunde altundeva, diferența dintre un banner care arată bine 6 luni și unul care se decolorează în 6 săptămâni stă în calitatea materialului și a cernelii folosite, nu neapărat în preț.</p>
        <h2>Tehnologie de print, nu doar "printăm orice"</h2>
        <p>Folosim echipamente de print digital calibrate pentru culori fidele și rezistență UV — relevant mai ales pentru materialele expuse afară, indiferent dacă ești în ${mainLocality} sau în altă zonă din ${j.name}.</p>
        <h2>Ce producem la calitate constantă:</h2>
        <ul>${productListHtml}</ul>
        <p>Verifică prin configuratorul online exact ce materiale sunt disponibile pentru fiecare produs și alege în funcție de unde va fi expus (interior/exterior), nu doar după preț.</p>
      `
    };
  }
  if (variant === 2) {
    return {
      slug,
      title: `Cum comanzi materiale publicitare online din ${j.name}, în 3 pași`,
      description: `Ghid rapid pentru a comanda print personalizat din județul ${j.name}: alegi produsul, configurezi online, primești livrarea la adresă.`,
      date, author, tags,
      contentHtml: `
        <p>Dacă n-ai mai comandat print online până acum, procesul e mai simplu decât pare — mai ales dacă ești din ${j.name} și vrei să eviți drumul până la un atelier fizic.</p>
        <h2>Pasul 1: Alegi produsul</h2>
        <p>Din categoriile disponibile — ${products.map((p) => p.label).join(", ")} — alegi ce ai nevoie.</p>
        <h2>Pasul 2: Configurezi online</h2>
        <p>Introduci dimensiunile, alegi materialul și, dacă vrei, încarci propria grafică. Prețul se actualizează instant, deci știi exact cât plătești înainte de a comanda.</p>
        <h2>Pasul 3: Primești livrarea</h2>
        <p>Coletul ajunge prin curier direct la adresa ta din ${mainLocality} sau din orice altă localitate din județul ${j.name}, fără să fie nevoie să te deplasezi.</p>
      `
    };
  }
  if (variant === 3) {
    return {
      slug,
      title: `Ce comandă cel mai des o afacere mică din ${j.name} când are nevoie de print`,
      description: `De la bannere pentru deschidere până la autocolante pentru vitrină — ce materiale publicitare comandă frecvent afacerile locale din județul ${j.name}.`,
      date, author, tags,
      contentHtml: `
        <p>Fie că ai un magazin în ${mainLocality}, un restaurant sau un service auto undeva în județul <b>${j.name}</b>, nevoile de print se repetă: ceva vizibil de la distanță, ceva pentru interior, și eventual material promoțional pentru clienți.</p>
        <h2>Cele mai comandate materiale pentru afaceri locale:</h2>
        <ul>${productListHtml}</ul>
        <p>Nu ai nevoie de o comandă mare pentru a începe — poți comanda o singură piesă pentru a testa calitatea înainte de a comanda pentru toate punctele de lucru din ${otherLocalities[0] || j.name} sau din restul județului.</p>
      `
    };
  }
  if (variant === 4) {
    return {
      slug,
      title: `Întrebări frecvente despre comenzile de print din județul ${j.name}`,
      description: `Răspunsuri scurte la cele mai frecvente întrebări despre print online, livrare și materiale disponibile pentru clienții din județul ${j.name}.`,
      date, author, tags,
      contentHtml: `
        <h2>Livrați și în ${mainLocality}?</h2>
        <p>Da, livrăm prin curier în ${mainLocality} și în toate localitățile din județul ${j.name}${otherLocalities.length ? `, inclusiv ${otherLocalities.slice(0, 2).join(" și ")}` : ""}.</p>
        <h2>Cât durează producția?</h2>
        <p>De regulă 2-4 zile lucrătoare, în funcție de produs și cantitate, plus timpul de livrare al curierului până la adresa ta.</p>
        <h2>Ce pot comanda?</h2>
        <ul>${productListHtml}</ul>
        <h2>Pot vedea prețul înainte să comand?</h2>
        <p>Da — configuratorul online calculează prețul exact în timp real, pe măsură ce alegi dimensiunile și materialul.</p>
      `
    };
  }
  return {
    slug,
    title: `Atelier local sau print online? Ce merită pentru clienții din ${j.name}`,
    description: `Comparație rapidă între un atelier de print local din județul ${j.name} și comanda online, pentru materiale publicitare personalizate.`,
    date, author, tags,
    contentHtml: `
      <p>Dacă ești din ${j.name} și cauți unde să comanzi materiale publicitare, ai practic două variante: un atelier local sau o comandă online. Fiecare are avantaje, dar depinde ce contează mai mult pentru tine.</p>
      <h2>Atelierul local din ${mainLocality}</h2>
      <p>Avantaj clar: poți vedea materialul fizic înainte să plătești și poți discuta față în față. Dezavantaj: program limitat, prețuri uneori negociate ad-hoc, stoc limitat de materiale.</p>
      <h2>Comanda online</h2>
      <p>Configurator disponibil oricând, preț fix și transparent, o gamă mai largă de materiale decât în orice atelier fizic din ${j.name}, livrare directă la adresă în ${mainLocality} sau oriunde altundeva în județ.</p>
      <h2>Ce poți comanda online:</h2>
      <ul>${productListHtml}</ul>
    `
  };
}

const COUNTY_POSTS: BlogPost[] = JUDETE_DATA.map((j, index) => buildCountyPost(j, index, "tablou.net", "Tablou"));

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
