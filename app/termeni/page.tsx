import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import LegalDocument, { type LegalSection } from "@/components/legal/LegalDocument";
import { ANPC_SAL_URL, COMPANY, CONTACT_EMAIL, VAT_NOTE_SENTENCE } from "@/lib/company";
import { siteConfig } from "@/lib/siteConfig";
import { FREE_SHIPPING_THRESHOLD, MAX_RAMBURS_LIMIT } from "@/lib/paymentRules";

export const metadata: Metadata = {
    title: "Termeni și condiții",
    description: `Termenii și condițiile de vânzare pentru comenzile plasate pe ${siteConfig.domain.toLowerCase()}: comandă, grafică, prețuri, plată, livrare, conformitate, retragere și reclamații.`,
    alternates: { canonical: "/termeni" },
};

const site = siteConfig.domain.toLowerCase();
const mail = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;

const sections: LegalSection[] = [
    {
        id: "operator",
        title: "Cine suntem și ce reglementează acest document",
        body: (
            <>
                <p>
                    Site-ul <strong>{site}</strong> (denumit în continuare „Site-ul”) este operat de <strong>{COMPANY.legalName}</strong>,
                    cu sediul social în {COMPANY.address.full}, CUI {COMPANY.cui}, nr. de ordine în Registrul Comerțului {COMPANY.regCom},
                    EUID {COMPANY.euid}, societate neplătitoare de TVA, înregistrată în sistemul RO e-Factura (denumită în continuare
                    „Vânzătorul”, „noi”). Ne puteți contacta la {mail}.
                </p>
                <p>
                    Acești termeni și condiții („Termenii”) se aplică tuturor comenzilor plasate pe Site de persoane fizice („consumatori”)
                    sau de persoane juridice și alte entități („clienți profesioniști”) și, împreună cu informațiile afișate pe pagina
                    produsului, în coș și în confirmarea comenzii, formează contractul la distanță dintre dumneavoastră și Vânzător.
                    Vă rugăm să îi citiți înainte de a plasa o comandă. Plasarea comenzii este posibilă numai după bifarea confirmării că ați
                    citit și acceptați Termenii și <Link href="/confidentialitate">Politica de confidențialitate</Link>.
                </p>
                <p>
                    Contractul se încheie în limba română și este guvernat de legea română, în special de Codul civil, Legea nr. 365/2002
                    privind comerțul electronic, OUG nr. 34/2014 privind drepturile consumatorilor în cadrul contractelor încheiate cu
                    profesioniștii, OUG nr. 140/2021 privind anumite aspecte referitoare la contractele de vânzare de bunuri și
                    OG nr. 21/1992 privind protecția consumatorilor. Nicio prevedere a acestor Termeni nu limitează drepturile pe care
                    consumatorii le au în baza legii.
                </p>
            </>
        ),
    },
    {
        id: "produse",
        title: "Produsele",
        body: (
            <>
                <p>
                    Pe Site vindem produse tipărite și produse personalizate (de exemplu bannere, mesh, autocolante, afișe, flyere, pliante,
                    cărți de vizită, panouri rigide, tablouri canvas, fototapet, textile personalizate, semnalistică). Distingem două categorii:
                </p>
                <ul>
                    <li>
                        <strong>Produse personalizate</strong> – realizate după specificațiile dumneavoastră: cu grafica, fotografiile,
                        textul sau logo-ul încărcate ori transmise de dumneavoastră, pe dimensiunile, materialele și finisajele alese în
                        configurator, sau realizate de noi după indicațiile dumneavoastră. Marea majoritate a produselor de pe Site intră în
                        această categorie.
                    </li>
                    <li>
                        <strong>Produse standard (nepersonalizate)</strong> – produse cu conținut și format prestabilite de noi, care nu
                        sunt modificate la cererea dumneavoastră (de exemplu anumite modele gata definite, vândute exact cum sunt prezentate).
                    </li>
                </ul>
                <p>
                    Imaginile de prezentare, previzualizările din configurator și simulările de montaj au rol ilustrativ. Culorile pot
                    diferi ușor de cele de pe ecran (ecranele afișează în RGB, iar tiparul se face în CMYK, pe materiale cu texturi și
                    grade de absorbție diferite). Asemenea diferențe, în limitele toleranțelor uzuale de tipar, nu reprezintă lipsă de
                    conformitate. La fel, toleranțele de tăiere și de dimensiune uzuale în producția tipografică (de regulă câțiva
                    milimetri, respectiv până la 1–2% la formatele mari) nu constituie defecte.
                </p>
            </>
        ),
    },
    {
        id: "comanda",
        title: "Plasarea comenzii și încheierea contractului",
        body: (
            <>
                <ol>
                    <li>Configurați produsul (dimensiuni, material, cantitate, finisaje) și, după caz, încărcați grafica; prețul se afișează înainte de adăugarea în coș.</li>
                    <li>În coș verificați produsele, cantitățile și prețul; puteți corecta orice eroare de introducere a datelor înainte de trimiterea comenzii.</li>
                    <li>Completați datele de livrare și de facturare, alegeți metoda de livrare și de plată și bifați acceptarea Termenilor.</li>
                    <li>Apăsați butonul de plasare a comenzii (comandă cu obligație de plată). La plata cu cardul sunteți redirecționat către pagina securizată a procesatorului de plăți.</li>
                </ol>
                <p>
                    După plasare primiți pe e-mail confirmarea de înregistrare a comenzii, cu rezumatul produselor, prețului și
                    condițiilor. Contractul se consideră încheiat la momentul transmiterii acestei confirmări. Comanda și factura
                    rămân disponibile în contul dumneavoastră (dacă aveți cont) și în e-mailurile primite.
                </p>
                <p>
                    Putem refuza sau anula o comandă, cu informarea dumneavoastră și restituirea integrală a oricărei sume achitate, dacă:
                    datele furnizate sunt incomplete sau vădit false; grafica încalcă legea sau drepturile unor terți (vezi secțiunea 4);
                    fișierele nu pot fi tipărite și nu primim fișiere corecte într-un termen rezonabil; produsul nu mai poate fi realizat
                    din motive tehnice ori de aprovizionare; prețul afișat este rezultatul unei erori materiale evidente.
                </p>
            </>
        ),
    },
    {
        id: "grafica",
        title: "Grafica: încărcare, verificare, aprobare și drepturi",
        body: (
            <>
                <h3>4.1. Fișierele trimise de dumneavoastră</h3>
                <p>
                    Grafica se tipărește așa cum o transmiteți și cum ați poziționat-o în configurator. Recomandările tehnice (rezoluție,
                    format, margini de siguranță, spațiu pentru capse sau tiv) sunt afișate în configurator și pe paginile produselor.
                    Efectuăm o verificare tehnică de bază a fișierelor (format, rezoluție aparentă, încadrare) și vă contactăm pe e-mail
                    dacă observăm o problemă evidentă. Verificarea nu include corectura textelor: <strong>răspunderea pentru conținut,
                    ortografie, date de contact, cifre, culori alese și încadrare vă aparține</strong>. Nu răspundem pentru rezultate
                    datorate calității fișierului furnizat (de exemplu imagini la rezoluție mică, pixelate sau cu elemente prea aproape
                    de margine), dacă v-am avertizat sau dacă problema reiese din fișierul transmis.
                </p>
                <h3>4.2. Grafica realizată de noi</h3>
                <p>
                    Dacă ați comandat realizarea sau adaptarea graficii de către noi, vă trimitem pe e-mail o machetă (bun de tipar).
                    Producția începe numai după aprobarea ei de către dumneavoastră, în scris (e-mail). După aprobare, răspunderea pentru
                    conținutul machetei aprobate vă aparține. Numărul de revizii incluse este cel indicat la comandarea serviciului.
                </p>
                <h3>4.3. Drepturile asupra imaginilor, textelor și logo-urilor</h3>
                <p>
                    Prin încărcarea sau transmiterea oricărui material (fotografii, ilustrații, texte, logo-uri, mărci, personaje, fonturi
                    etc.) declarați și garantați că sunteți titularul drepturilor de autor, al drepturilor asupra mărcilor și al
                    oricăror alte drepturi necesare ori că aveți acordul titularilor, precum și acordul persoanelor care apar în imagini,
                    pentru reproducerea materialelor pe produsul comandat. Vă asumați întreaga răspundere față de terți pentru
                    conținutul transmis și ne veți despăgubi pentru orice pretenție, amendă sau prejudiciu cauzate de încălcarea acestor
                    drepturi, în limitele legii. Ne rezervăm dreptul de a refuza tipărirea materialelor care, în mod vădit, încalcă legea,
                    drepturile unor terți sau bunele moravuri (de exemplu conținut care incită la ură sau violență, conținut pornografic,
                    contrafaceri).
                </p>
                <p>
                    Folosim fișierele numai pentru realizarea comenzii, pentru eventuale recomenzi solicitate de dumneavoastră și pentru
                    soluționarea reclamațiilor. Nu le publicăm și nu le folosim în scopuri de promovare fără acordul dumneavoastră
                    prealabil.
                </p>
            </>
        ),
    },
    {
        id: "preturi",
        title: "Prețuri",
        body: (
            <>
                <p>
                    Prețurile sunt afișate în lei (RON). <strong>{VAT_NOTE_SENTENCE}</strong> {COMPANY.legalName} nu este înregistrată
                    în scopuri de TVA, astfel că prețurile afișate sunt prețuri finale, fără TVA adăugat, iar facturile se emit fără TVA.
                </p>
                <p>
                    Costul livrării se calculează în funcție de greutatea, dimensiunile și destinația coletului și se afișează separat
                    în coș, înainte de plasarea comenzii; totalul de plată include toate costurile. Pentru comenzile cu valoarea
                    produselor de cel puțin {FREE_SHIPPING_THRESHOLD} lei livrarea este gratuită, dacă nu se indică altfel la momentul
                    comenzii. Serviciile opționale (de exemplu realizarea graficii, montajul, finisajele speciale) se afișează și se
                    taxează separat, numai dacă le alegeți.
                </p>
                <p>
                    Prețul aplicabil este cel afișat la momentul plasării comenzii. Putem modifica oricând prețurile afișate pe Site,
                    fără ca modificarea să afecteze comenzile deja confirmate. În cazul unei erori materiale evidente de preț vă vom
                    informa, iar dumneavoastră puteți alege între confirmarea comenzii la prețul corect și anularea ei, cu restituirea
                    integrală a sumelor achitate. Codurile de reducere se aplică în condițiile anunțate la emiterea lor și nu se cumulează,
                    dacă nu se prevede altfel.
                </p>
            </>
        ),
    },
    {
        id: "plata",
        title: "Metode de plată",
        body: (
            <>
                <p>Metodele de plată disponibile pentru o comandă se afișează în pagina de finalizare a comenzii:</p>
                <ul>
                    <li>
                        <strong>Card bancar online</strong> – procesat securizat prin Stripe (Stripe Payments Europe Ltd.). Nu primim și
                        nu stocăm datele cardului dumneavoastră. Comanda intră în producție după confirmarea plății.
                    </li>
                    <li>
                        <strong>Ordin de plată (transfer bancar)</strong> – datele contului se afișează la finalizarea comenzii și în
                        e-mailul de confirmare. Producția începe după încasarea sumei, cu excepția situațiilor convenite altfel (de
                        exemplu autorități contractante cu plata la termen).
                    </li>
                    <li>
                        <strong>Ramburs (numerar sau card la curier, după caz)</strong> – disponibil numai pentru livrări în România și
                        pentru comenzi de cel mult {MAX_RAMBURS_LIMIT} lei, dacă apare ca opțiune în checkout. Plata se face
                        curierului, la primirea coletului.
                    </li>
                </ul>
                <p>
                    Refuzul nejustificat de a primi un colet cu plata ramburs, pentru un produs realizat la comandă, ne cauzează un
                    prejudiciu (materiale și manoperă consumate, transport dus-întors), pe care îl putem solicita în condițiile legii.
                </p>
            </>
        ),
    },
    {
        id: "facturare",
        title: "Facturare",
        body: (
            <p>
                Emitem factura fiscală pe baza datelor de facturare introduse de dumneavoastră în comandă (persoană fizică sau persoană
                juridică). Factura se transmite pe e-mail, prin serviciul de facturare Oblio, și, acolo unde legea o cere, se raportează
                în sistemul național RO e-Factura. Factura nu conține TVA, Vânzătorul nefiind plătitor de TVA. Vă rugăm să verificați
                datele de facturare înainte de plasarea comenzii; corectarea unei facturi deja transmise în RO e-Factura este posibilă
                numai în condițiile legii (de exemplu prin stornare și reemitere).
            </p>
        ),
    },
    {
        id: "productie-livrare",
        title: "Termene de producție și livrare",
        body: (
            <>
                <p>
                    Termenul estimat de producție și livrare este cel afișat pe pagina produsului și în coș la momentul comenzii și curge
                    de la confirmarea comenzii, respectiv de la confirmarea plății (card, ordin de plată) și, dacă e cazul, de la
                    primirea fișierelor corecte sau aprobarea machetei. Termenele sunt exprimate în zile lucrătoare. În lipsa unui alt
                    termen convenit, livrarea se face în cel mult 30 de zile de la încheierea contractului.
                </p>
                <p>
                    Livrarea se face prin curier (DPD România și partenerii săi pentru livrările externe), la adresa indicată sau, dacă
                    ați ales această opțiune, la un locker ori punct de ridicare DPD. Detaliile privind zonele de livrare, costurile,
                    recepția coletului și coletele deteriorate sunt descrise în <Link href="/politica-retur">Politica de livrare și retur</Link>,
                    care face parte din acești Termeni.
                </p>
                <p>
                    Dacă nu putem respecta termenul estimat, vă informăm pe e-mail. Dacă livrarea nu se face nici în termenul suplimentar
                    stabilit împreună (sau în termenul esențial convenit), aveți dreptul să rezoluționați contractul și să primiți
                    înapoi, fără întârziere, toate sumele achitate.
                </p>
            </>
        ),
    },
    {
        id: "risc",
        title: "Transferul proprietății și al riscului",
        body: (
            <p>
                Proprietatea asupra produselor se transferă la momentul plății integrale. Pentru consumatori, riscul de pierdere sau
                deteriorare a produselor se transferă în momentul în care dumneavoastră sau o persoană indicată de dumneavoastră (alta
                decât curierul) intrați în posesia fizică a produselor. Pentru clienții profesioniști, riscul se transferă la
                predarea coletului către curier, cu excepția cazului în care s-a convenit altfel în scris.
            </p>
        ),
    },
    {
        id: "conformitate",
        title: "Conformitatea produselor și garanția legală",
        body: (
            <>
                <p>
                    Răspundem pentru orice lipsă de conformitate a produselor care există la momentul livrării și se manifestă în
                    termen de 2 ani de la livrare, în condițiile OUG nr. 140/2021. Produsul este conform dacă corespunde descrierii,
                    specificațiilor alese la comandă și fișierului aprobat, are calitățile și durabilitatea obișnuite pentru produsele de
                    același tip și este însoțit de instrucțiunile necesare (de exemplu de montaj sau de întreținere).
                </p>
                <p>
                    În caz de neconformitate, aveți dreptul, în ordinea și în condițiile prevăzute de lege: la aducerea produsului în
                    conformitate (în cazul produselor tipărite, de regulă prin refacerea și reexpedierea lor, fără costuri pentru
                    dumneavoastră), iar dacă aceasta nu este posibilă, este disproporționată ori nu se realizează într-un termen
                    rezonabil, la reducerea proporțională a prețului sau la rezoluțiunea contractului, cu restituirea prețului.
                </p>
                <p>
                    Vă rugăm să ne semnalați neconformitatea cât mai curând după ce o constatați (legea prevede informarea vânzătorului
                    în termen de 2 luni de la data constatării), pe e-mail la {mail} sau prin pagina <Link href="/reclamatii">Reclamații</Link>,
                    cu numărul comenzii, descrierea problemei și fotografii ale produsului și ale ambalajului. Pentru a putea sesiza
                    eventualele daune de transport la curier, este util să verificați coletul la primire. Nu constituie neconformitate:
                    erorile din fișierele sau textele transmise ori aprobate de dumneavoastră, diferențele de culoare și toleranțele
                    tehnice uzuale descrise la secțiunea 2, uzura normală și deteriorările produse prin montaj, utilizare sau depozitare
                    necorespunzătoare.
                </p>
                <p>
                    Pentru clienții profesioniști, răspunderea noastră pentru neconformitate este limitată la refacerea produsului sau,
                    dacă aceasta nu este posibilă, la restituirea prețului produsului neconform, iar produsele trebuie verificate și
                    eventualele neconformități aparente sesizate în cel mult 5 zile lucrătoare de la primire.
                </p>
            </>
        ),
    },
    {
        id: "retragere",
        title: "Dreptul de retragere (consumatori)",
        body: (
            <>
                <h3>11.1. Produse personalizate – dreptul de retragere nu se aplică</h3>
                <p>
                    Potrivit <strong>art. 16 lit. c) din OUG nr. 34/2014</strong>, dreptul de retragere nu se aplică în cazul furnizării
                    de produse confecționate după specificațiile prezentate de consumator sau personalizate în mod clar. Toate produsele
                    realizate cu grafica, fotografiile, textul sau logo-ul dumneavoastră ori pe dimensiunile, materialele și opțiunile
                    alese de dumneavoastră în configurator sunt astfel de produse: ele sunt produse special pentru dumneavoastră și nu
                    pot fi revândute altcuiva. <strong>Pentru ele nu vă puteți retrage din contract după plasarea comenzii</strong>. Vă
                    informăm despre această excepție pe pagina de finalizare a comenzii, înainte de a o plasa. Dacă produsul personalizat
                    este neconform, beneficiați în continuare de toate drepturile din secțiunea 10.
                </p>
                <p>
                    Dacă doriți să modificați sau să anulați o comandă personalizată, scrieți-ne imediat la {mail}: cât timp producția
                    nu a început, vom anula comanda și vom restitui integral suma achitată; după începerea producției, anularea nu mai
                    este posibilă.
                </p>
                <h3>11.2. Produse standard (nepersonalizate) – 14 zile</h3>
                <p>
                    Pentru produsele standard aveți dreptul să vă retrageți din contract, fără a preciza motivele și fără penalități, în
                    termen de <strong>14 zile</strong> de la ziua în care dumneavoastră sau o persoană indicată de dumneavoastră (alta
                    decât curierul) intrați în posesia fizică a produselor (pentru o comandă cu mai multe produse livrate separat, de
                    la primirea ultimului produs). Pentru a vă exercita dreptul, trebuie să ne informați cu privire la decizia de
                    retragere printr-o declarație neechivocă, înainte de expirarea termenului, în oricare dintre modurile următoare:
                </p>
                <ul>
                    <li>online, prin funcția <Link href="/retragere-contract">Retragere din contract</Link> (primiți imediat confirmarea pe e-mail);</li>
                    <li>pe e-mail, la {mail}, folosind, dacă doriți, <Link href="/formular-retragere">modelul de formular de retragere</Link> (utilizarea lui nu este obligatorie);</li>
                    <li>prin poștă, la sediul social: {COMPANY.legalName}, {COMPANY.address.full}.</li>
                </ul>
                <p>
                    <strong>Efectele retragerii.</strong> Vă restituim toate sumele primite, inclusiv costul livrării inițiale (cu
                    excepția costurilor suplimentare generate de alegerea unei alte modalități de livrare decât cea standard, cea mai
                    ieftină oferită), fără întârzieri nejustificate și în cel mult 14 zile de la data la care am fost informați despre
                    decizia de retragere. Rambursarea se face prin aceeași metodă de plată folosită la comandă (pentru plata ramburs,
                    prin transfer bancar în contul indicat de dumneavoastră), fără comisioane pentru dumneavoastră. Putem amâna
                    rambursarea până la primirea produselor sau a dovezii expedierii lor, oricare survine prima.
                </p>
                <p>
                    <strong>Returnarea produselor.</strong> Trebuie să ne trimiteți produsele fără întârzieri nejustificate și în cel
                    mult 14 zile de la comunicarea deciziei de retragere, la adresa pe care v-o comunicăm pe e-mail.{" "}
                    <strong>Costul direct al returnării produselor este suportat de dumneavoastră.</strong> Răspundeți numai pentru
                    diminuarea valorii produselor rezultată din manipularea lor altfel decât este necesar pentru determinarea naturii,
                    calităților și funcționării lor (de exemplu produse montate, lipite, decupate sau deteriorate).
                </p>
            </>
        ),
    },
    {
        id: "reclamatii",
        title: "Reclamații și soluționarea litigiilor",
        body: (
            <>
                <p>
                    Reclamațiile se transmit pe e-mail la {mail} sau conform procedurii din pagina <Link href="/reclamatii">Reclamații</Link>.
                    Confirmăm primirea și răspundem în cel mult 30 de zile calendaristice, de regulă mult mai repede.
                </p>
                <p>
                    Dacă nu ajungem la o soluție amiabilă, consumatorii se pot adresa Autorității Naționale pentru Protecția
                    Consumatorilor (ANPC) sau pot apela la procedurile de soluționare alternativă a litigiilor (SAL), conform
                    informațiilor de pe <a href={ANPC_SAL_URL} target="_blank" rel="noopener noreferrer">anpc.ro/ce-este-sal</a>. Litigiile
                    care nu se soluționează amiabil sunt de competența instanțelor române; consumatorii pot sesiza și instanța de la
                    domiciliul lor, în condițiile legii.
                </p>
            </>
        ),
    },
    {
        id: "cont",
        title: "Contul de client și utilizarea Site-ului",
        body: (
            <>
                <p>
                    Puteți comanda cu sau fără cont. Dacă vă creați un cont (inclusiv automat, la cererea dumneavoastră, la plasarea
                    comenzii, sau prin autentificarea cu Google), sunteți responsabil pentru păstrarea confidențialității datelor de
                    acces și pentru activitatea din cont. Ne puteți cere oricând ștergerea contului, în condițiile descrise în Politica
                    de confidențialitate.
                </p>
                <p>
                    Conținutul Site-ului (texte, imagini proprii, elemente grafice, cod, configuratoare) ne aparține sau este folosit cu
                    licență și nu poate fi copiat ori reutilizat fără acordul nostru scris. Nu este permisă utilizarea Site-ului în
                    scopuri frauduloase, extragerea automată de date sau orice acțiune care îi afectează funcționarea.
                </p>
            </>
        ),
    },
    {
        id: "raspundere",
        title: "Răspundere și forță majoră",
        body: (
            <p>
                Nu răspundem pentru neexecutarea sau executarea cu întârziere a obligațiilor cauzată de forță majoră ori caz fortuit
                (de exemplu calamități, întreruperi generale ale serviciilor de curierat sau de furnizare a utilităților, decizii ale
                autorităților). Pentru clienții profesioniști, răspunderea noastră totală în legătură cu o comandă este limitată la
                valoarea comenzii respective și nu acoperă beneficiul nerealizat sau prejudiciile indirecte. Aceste limitări nu se
                aplică în cazul dolului sau culpei grave și nu restrâng drepturile consumatorilor prevăzute de lege.
            </p>
        ),
    },
    {
        id: "modificari",
        title: "Modificarea Termenilor",
        body: (
            <p>
                Putem actualiza acești Termeni; versiunea și data intrării în vigoare sunt afișate în partea de sus a paginii. Fiecărei
                comenzi i se aplică versiunea în vigoare la data plasării ei, pe care o acceptați explicit în pagina de finalizare a
                comenzii. Pentru orice întrebare despre acești Termeni ne puteți scrie la {mail}.
            </p>
        ),
    },
];

export default function TermeniPage() {
    return (
        <LegalDocument
            title="Termeni și condiții"
            currentHref="/termeni"
            intro={
                <p>
                    Condițiile în care vindem produsele tipărite și personalizate prezentate pe {site}. Pe scurt: prețurile sunt finale
                    (furnizorul nu este plătitor de TVA), produsele realizate după specificațiile dumneavoastră nu pot fi returnate prin
                    dreptul de retragere, dar beneficiază de garanția legală de conformitate, iar pentru produsele standard aveți 14
                    zile de retragere.
                </p>
            }
            sections={sections}
        />
    );
}
