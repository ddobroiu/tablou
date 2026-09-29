import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import LegalDocument, { type LegalSection } from "@/components/legal/LegalDocument";
import { COMPANY, CONTACT_EMAIL, HAS_AI_CHAT, TRACKING } from "@/lib/company";
import { siteConfig } from "@/lib/siteConfig";
import { CLARITY_ID } from "@/lib/clarity";

export const metadata: Metadata = {
    title: "Politica de confidențialitate",
    description: `Cum prelucrează ${COMPANY.legalName} datele personale ale clienților și vizitatorilor ${siteConfig.domain.toLowerCase()}, conform GDPR: scopuri, temeiuri, destinatari, durate de păstrare și drepturi.`,
    alternates: { canonical: "/confidentialitate" },
};

const site = siteConfig.domain.toLowerCase();
const mail = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;
const hasGoogleMarketing = TRACKING.googleAdsIds.length > 0 || !!TRACKING.gtmId;

const sections: LegalSection[] = [
    {
        id: "operator",
        title: "Operatorul de date și datele de contact",
        body: (
            <>
                <p>
                    Operatorul datelor dumneavoastră personale prelucrate prin site-ul <strong>{site}</strong> este{" "}
                    <strong>{COMPANY.legalName}</strong>, cu sediul social în {COMPANY.address.full}, CUI {COMPANY.cui}, nr. de ordine
                    în Registrul Comerțului {COMPANY.regCom}, EUID {COMPANY.euid} („noi”).
                </p>
                <p>
                    Pentru orice întrebare privind datele personale sau pentru exercitarea drepturilor ne puteți scrie la {mail} ori prin
                    poștă, la adresa sediului social. Nu am desemnat un responsabil cu protecția datelor (DPO), nefiind obligați de
                    art. 37 din Regulamentul (UE) 2016/679 („GDPR”); solicitările privind datele personale sunt tratate direct de
                    conducerea societății.
                </p>
                <p>
                    Această politică se aplică vizitatorilor site-ului, clienților (persoane fizice) și persoanelor de contact ale
                    clienților persoane juridice. Ea este întocmită în temeiul art. 13 și 14 GDPR și al Legii nr. 190/2018.
                </p>
            </>
        ),
    },
    {
        id: "date",
        title: "Ce date prelucrăm",
        body: (
            <ul>
                <li><strong>Date de identificare și contact:</strong> nume și prenume, adresă de e-mail, număr de telefon (necesar curierului pentru livrare).</li>
                <li><strong>Date de livrare și facturare:</strong> adresa de livrare sau lockerul/punctul DPD ales, adresa de facturare; pentru persoane juridice: denumire, CUI, nr. Registrul Comerțului și datele persoanei de contact.</li>
                <li><strong>Datele comenzii:</strong> produse, configurații, prețuri, metoda de plată, statusul plății și al livrării, numărul AWB, factura, momentul acceptării Termenilor și condițiilor și versiunea acceptată.</li>
                <li><strong>Fișiere și conținut transmise de dumneavoastră:</strong> grafica, fotografiile și textele încărcate pentru tipar, care pot conține date personale (de exemplu imaginea unor persoane).</li>
                <li><strong>Datele contului:</strong> e-mail, parolă (stocată doar criptografic, ca hash), adrese salvate, istoricul comenzilor; la autentificarea cu Google, numele, adresa de e-mail și identificatorul contului Google.</li>
                <li><strong>Plata cu cardul:</strong> datele cardului sunt introduse exclusiv pe pagina procesatorului Stripe; noi primim doar confirmarea plății, suma și identificatorul tranzacției.</li>
                <li><strong>Corespondența:</strong> mesajele trimise prin formularul de contact, e-mail sau WhatsApp, cererile de retragere și reclamațiile.</li>
                <li><strong>Date tehnice și de utilizare:</strong> adresa IP, tipul de browser și dispozitiv, paginile vizitate, sursa vizitei, jurnale de securitate; statisticile și datele de marketing se colectează numai cu consimțământul dumneavoastră (vezi <Link href="/politica-cookies">Politica de cookies</Link>).</li>
            </ul>
        ),
    },
    {
        id: "scopuri",
        title: "Scopurile și temeiurile prelucrării",
        body: (
            <table>
                <thead>
                    <tr>
                        <th>Scop</th>
                        <th>Temei juridic (art. 6 alin. 1 GDPR)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Preluarea, producția și livrarea comenzii; comunicările despre comandă (confirmare, machetă, status, AWB)</td><td>lit. b) – executarea contractului sau demersuri la cererea dumneavoastră înainte de încheierea lui</td></tr>
                    <tr><td>Procesarea plății și prevenirea fraudelor la plată</td><td>lit. b) – executarea contractului; lit. f) – interesul legitim de a preveni fraudele</td></tr>
                    <tr><td>Emiterea facturii, raportarea în RO e-Factura, evidența contabilă și arhivarea</td><td>lit. c) – obligații legale (Codul fiscal, Legea contabilității nr. 82/1991, legislația RO e-Factura)</td></tr>
                    <tr><td>Soluționarea cererilor de retragere, a reclamațiilor și a solicitărilor privind garanția de conformitate</td><td>lit. c) – obligații legale (OUG 34/2014, OUG 140/2021); lit. b)</td></tr>
                    <tr><td>Dovada acceptării Termenilor și condițiilor (data, ora și versiunea acceptată)</td><td>lit. f) – interesul legitim de a putea dovedi condițiile contractuale; lit. c)</td></tr>
                    <tr><td>Crearea și administrarea contului de client (la cererea dumneavoastră)</td><td>lit. b) – executarea contractului privind contul</td></tr>
                    <tr><td>Răspunsul la mesajele trimise prin formularul de contact, e-mail sau WhatsApp</td><td>lit. b) dacă mesajul privește o comandă sau o ofertă; altfel lit. f) – interesul legitim de a răspunde solicitărilor</td></tr>
                    <tr><td>Newsletter și oferte comerciale pe e-mail</td><td>lit. a) – consimțământ, pe care îl puteți retrage oricând prin linkul de dezabonare sau pe e-mail</td></tr>
                    <tr><td>Reamintirea unei configurări sau a unui coș nefinalizat, pentru clienții autentificați</td><td>lit. f) – interesul legitim de a vă ajuta să finalizați comanda începută; vă puteți opune oricând (link în e-mail sau pe e-mail la noi)</td></tr>
                    <tr><td>Statistici de trafic și măsurarea eficienței reclamelor (cookie-uri și tehnologii similare neesențiale)</td><td>lit. a) – consimțământ (art. 4 alin. 5 din Legea nr. 506/2004), exprimat prin bannerul de cookie-uri</td></tr>
                    <tr><td>Securitatea site-ului, prevenirea abuzurilor, jurnale tehnice</td><td>lit. f) – interesul legitim de a asigura funcționarea și securitatea serviciului</td></tr>
                    <tr><td>Constatarea, exercitarea sau apărarea unor drepturi în justiție</td><td>lit. f) – interesul legitim</td></tr>
                </tbody>
            </table>
        ),
    },
    {
        id: "obligativitate",
        title: "Este obligatorie furnizarea datelor?",
        body: (
            <p>
                Datele marcate ca obligatorii în formularul de comandă (nume, e-mail, telefon, adresa de livrare și datele de facturare)
                sunt necesare pentru încheierea și executarea contractului și pentru emiterea facturii; fără ele nu putem prelua
                comanda. Crearea unui cont, abonarea la newsletter și acceptarea cookie-urilor neesențiale sunt opționale și nu
                condiționează plasarea comenzii.
            </p>
        ),
    },
    {
        id: "grafica",
        title: "Fișierele grafice și fotografiile încărcate",
        body: (
            <p>
                Folosim fișierele încărcate numai pentru realizarea produsului comandat, pentru recomenzile solicitate de dumneavoastră
                și pentru soluționarea eventualelor reclamații. Dacă fișierele conțin imaginea sau datele altor persoane, sunteți
                responsabil să aveți acordul acestora sau un alt temei legal pentru a ni le transmite spre tipărire. Nu publicăm și nu
                folosim fișierele dumneavoastră în scopuri de promovare fără acordul dumneavoastră expres.
            </p>
        ),
    },
    {
        id: "destinatari",
        title: "Cui transmitem datele",
        body: (
            <>
                <p>
                    Nu vindem datele personale. Le transmitem numai în măsura necesară scopurilor de mai sus, către următoarele categorii de
                    destinatari, cu care avem, unde este cazul, contracte de prelucrare a datelor:
                </p>
                <ul>
                    <li><strong>Curierat:</strong> DPD România S.R.L. și, pentru livrările externe, partenerii rețelei DPD – nume, telefon, e-mail, adresa de livrare sau punctul DPD ales, conținutul coletului.</li>
                    <li><strong>Plăți cu cardul:</strong> Stripe Payments Europe, Ltd. (Irlanda) – datele necesare procesării plății; Stripe acționează ca operator independent pentru anumite prelucrări (de exemplu prevenirea fraudei, obligații financiare).</li>
                    <li><strong>Facturare:</strong> Oblio Software S.R.L. (România), platforma de facturare pe care o folosim, și Agenția Națională de Administrare Fiscală (ANAF), prin sistemul RO e-Factura – datele de facturare și valoarea comenzii.</li>
                    <li><strong>Trimiterea e-mailurilor:</strong> Resend (Plus Five Five, Inc., SUA) – adresa de e-mail și conținutul mesajelor tranzacționale (confirmări, facturi, statusuri) și, dacă v-ați abonat, al newsletterului.</li>
                    <li><strong>Găzduire și stocare:</strong> Hetzner Online GmbH (Germania) – serverele pe care rulează site-ul și baza de date; Cloudinary Ltd. – stocarea și livrarea imaginilor, inclusiv a fișierelor grafice încărcate.</li>
                    <li><strong>Autentificare cu Google</strong> (opțional): Google Ireland Limited – dacă alegeți să vă conectați cu contul Google.</li>
                    <li><strong>Comunicare pe WhatsApp</strong> (dacă ne scrieți acolo): Meta Platforms Ireland Limited (WhatsApp) – numărul de telefon și mesajele; unele răspunsuri pot fi pregătite cu ajutorul unui asistent automat (OpenAI), sub supravegherea noastră.</li>
                    {HAS_AI_CHAT && (
                        <li><strong>Asistentul de chat de pe site:</strong> OpenAI (SUA) – mesajele scrise în chat, pentru generarea răspunsurilor. Asistentul este un sistem de inteligență artificială, iar răspunsurile lui pot conține erori; vă rugăm să nu scrieți în chat date sensibile. Păstrăm conversațiile cel mult 12 luni, pentru a vă putea răspunde și pentru a îmbunătăți răspunsurile.</li>
                    )}
                    <li><strong>Servicii de inteligență artificială</strong> (numai pentru funcțiile care le folosesc, de exemplu generarea sau adaptarea automată a unei grafici la cererea dumneavoastră): OpenAI (SUA) și Google (Gemini) – textul și imaginile trimise în acest scop.</li>
                    {TRACKING.ga4Ids.length > 0 && (
                        <li><strong>Statistici (numai cu consimțământ):</strong> Google Ireland Limited (Google Analytics 4).</li>
                    )}
                    {CLARITY_ID && (
                        <li><strong>Statistici, hărți de interacțiune și înregistrări de sesiune (numai cu consimțământ):</strong> Microsoft Corporation (Microsoft Clarity, SUA) – interacțiunile cu paginile (clicuri, derulare, mișcări), cu conținutul introdus mascat; nu se folosește pe paginile de cont, autentificare, coș și plată. Transferul în SUA se face în baza EU-U.S. Data Privacy Framework.</li>
                    )}
                    {hasGoogleMarketing && (
                        <li><strong>Marketing (numai cu consimțământ):</strong> Google Ireland Limited (Google Ads, Google Tag Manager).</li>
                    )}
                    {TRACKING.metaPixelId && (
                        <li><strong>Marketing (numai cu consimțământ):</strong> Meta Platforms Ireland Limited (Meta Pixel).</li>
                    )}
                    {TRACKING.tiktokPixelId && (
                        <li><strong>Marketing / reclame (numai cu consimțământ):</strong> TikTok Technology Limited (Irlanda) – TikTok Pixel: identificatori din cookie-uri (_ttp), paginile vizitate, adăugările în coș și comenzile finalizate (numărul și valoarea comenzii, fără nume, e-mail sau telefon), pentru măsurarea eficienței reclamelor TikTok și retargeting. Cookie-urile de marketing se folosesc numai cu consimțământul dumneavoastră, pe care îl puteți retrage oricând din „Setări cookie-uri”. Datele pot fi transferate în afara UE, în baza clauzelor contractuale standard.</li>
                    )}
                    {TRACKING.siteAnalyticsSrc && (
                        <li><strong>Statistica proprie a site-urilor noastre (numai cu consimțământ):</strong> scriptul de măsurare a vizitelor găzduit pe shopprint.ro, operat de noi; datele se stochează pe serverele noastre și sunt folosite și în platforma noastră internă de monitorizare mydashboard.ro.</li>
                    )}
                    <li><strong>Hărți:</strong> la alegerea unui locker sau punct DPD, harta se încarcă de la OpenStreetMap Foundation, care primește adresa IP a dispozitivului.</li>
                    <li><strong>Monitorizare tehnică:</strong> platforma internă mydashboard.ro primește alerte despre erorile de comandă, plată sau facturare, care pot conține adresa de e-mail a clientului afectat, pentru a putea remedia rapid problema.</li>
                    <li><strong>Autorități și consultanți:</strong> autorități publice (ANAF, ANPC, instanțe, organe de cercetare), atunci când legea ne obligă, precum și contabili, auditori sau avocați, obligați la confidențialitate.</li>
                </ul>
                <p>
                    Pentru clienții persoane juridice, datele firmei se completează automat pe baza CUI din serviciul public al ANAF.
                </p>
            </>
        ),
    },
    {
        id: "transferuri",
        title: "Transferuri în afara Spațiului Economic European",
        body: (
            <p>
                Unii furnizori (de exemplu Stripe, Resend, Cloudinary, OpenAI, Google, Meta, Microsoft, TikTok) pot prelucra date în Statele Unite ale
                Americii sau în alte țări din afara SEE. Aceste transferuri se fac numai cu garanții adecvate: decizia de adecvare a
                Comisiei Europene pentru companiile certificate în cadrul EU-U.S. Data Privacy Framework și/sau clauzele contractuale
                standard aprobate de Comisia Europeană, împreună cu măsurile suplimentare oferite de furnizori. Ne puteți cere pe
                e-mail informații despre garanțiile aplicabile unui anumit transfer.
            </p>
        ),
    },
    {
        id: "pastrare",
        title: "Cât timp păstrăm datele",
        body: (
            <ul>
                <li><strong>Facturi și documentele justificative ale comenzilor:</strong> 10 ani de la încheierea exercițiului financiar (Legea contabilității nr. 82/1991).</li>
                <li><strong>Datele comenzii, corespondența, cererile de retragere și reclamațiile:</strong> pe durata contractului și a garanției legale, apoi pe durata termenului general de prescripție de 3 ani, pentru apărarea drepturilor, dacă nu trebuie păstrate mai mult ca documente contabile.</li>
                <li><strong>Fișierele grafice încărcate:</strong> cât este necesar pentru producție, recomenzi și reclamații, dar nu mai mult de 24 de luni de la livrare, dacă nu ne cereți ștergerea mai devreme (după livrare) sau păstrarea lor mai îndelungată.</li>
                <li><strong>Contul de client:</strong> până la ștergerea contului la cererea dumneavoastră; datele comenzilor rămân păstrate conform termenelor de mai sus.</li>
                <li><strong>Newsletter:</strong> până la dezabonare sau retragerea consimțământului.</li>
                <li><strong>Configurări și coșuri nefinalizate:</strong> cel mult 90 de zile.</li>
                <li><strong>Mesajele trimise prin formularul de contact sau WhatsApp care nu privesc o comandă:</strong> cel mult 12 luni.</li>
                <li><strong>Cookie-uri și date de statistică:</strong> conform duratelor din <Link href="/politica-cookies">Politica de cookies</Link>.</li>
                <li><strong>Jurnale tehnice și de securitate:</strong> de regulă cel mult 6 luni.</li>
            </ul>
        ),
    },
    {
        id: "drepturi",
        title: "Drepturile dumneavoastră",
        body: (
            <>
                <p>În condițiile GDPR, aveți următoarele drepturi:</p>
                <ul>
                    <li>dreptul de acces la datele prelucrate și de a primi o copie a lor (art. 15);</li>
                    <li>dreptul la rectificarea datelor inexacte sau incomplete (art. 16);</li>
                    <li>dreptul la ștergerea datelor („dreptul de a fi uitat”), în limitele art. 17 – de exemplu nu putem șterge datele pe care legea ne obligă să le păstrăm (facturile);</li>
                    <li>dreptul la restricționarea prelucrării (art. 18);</li>
                    <li>dreptul la portabilitatea datelor furnizate de dumneavoastră și prelucrate automat pe bază de contract sau consimțământ (art. 20);</li>
                    <li>dreptul de opoziție la prelucrările întemeiate pe interesul legitim, inclusiv, oricând, la prelucrarea în scop de marketing direct (art. 21);</li>
                    <li>dreptul de a vă retrage oricând consimțământul (newsletter, cookie-uri neesențiale), fără a afecta legalitatea prelucrării anterioare – pentru cookie-uri, din linkul „Setări cookie-uri” din subsolul site-ului;</li>
                    <li>dreptul de a nu face obiectul unei decizii bazate exclusiv pe prelucrare automată care să producă efecte juridice (art. 22). Nu luăm astfel de decizii.</li>
                </ul>
                <p>
                    Cererile se trimit la {mail} (puteți folosi și pagina <Link href="/stergere-date">Ștergerea datelor</Link>). Răspundem
                    gratuit, în cel mult o lună de la primire; termenul poate fi prelungit cu încă două luni pentru cereri complexe, cu
                    informarea dumneavoastră. Putem cere informații suplimentare pentru a vă confirma identitatea.
                </p>
                <p>
                    Aveți și dreptul de a depune o plângere la <strong>Autoritatea Națională de Supraveghere a Prelucrării Datelor cu
                    Caracter Personal (ANSPDCP)</strong>, B-dul G-ral. Gheorghe Magheru nr. 28-30, sector 1, cod poștal 010336, București,{" "}
                    <a href="https://www.dataprotection.ro" target="_blank" rel="noopener noreferrer">www.dataprotection.ro</a>, e-mail
                    anspdcp@dataprotection.ro, precum și de a vă adresa instanței competente.
                </p>
            </>
        ),
    },
    {
        id: "securitate",
        title: "Securitatea datelor",
        body: (
            <p>
                Aplicăm măsuri tehnice și organizatorice adecvate: conexiuni criptate (HTTPS/TLS), parole stocate numai sub formă de
                hash, acces la date limitat la persoanele care au nevoie de ele pentru îndeplinirea comenzilor, plăți procesate exclusiv
                de un procesator certificat PCI DSS, copii de siguranță. În cazul unei încălcări a securității datelor care prezintă
                un risc ridicat pentru dumneavoastră, vă vom informa conform art. 34 GDPR.
            </p>
        ),
    },
    {
        id: "minori",
        title: "Minori",
        body: (
            <p>
                Site-ul nu se adresează persoanelor sub 16 ani, iar comenzile pot fi plasate numai de persoane cu capacitate deplină de
                exercițiu sau de reprezentanții lor. Dacă aflăm că am colectat date ale unui minor fără acordul părintelui, le ștergem.
            </p>
        ),
    },
    {
        id: "modificari",
        title: "Modificarea politicii",
        body: (
            <p>
                Putem actualiza această politică pentru a reflecta schimbări ale legislației sau ale serviciilor. Versiunea și data
                intrării în vigoare sunt afișate în partea de sus a paginii; modificările importante le anunțăm pe site sau pe e-mail.
            </p>
        ),
    },
];

export default function ConfidentialitatePage() {
    return (
        <LegalDocument
            title="Politica de confidențialitate"
            currentHref="/confidentialitate"
            intro={
                <p>
                    Ce date personale prelucrăm când vizitați {site} sau comandați de la noi, de ce, cui le transmitem, cât le păstrăm și
                    ce drepturi aveți (informare conform art. 13 GDPR).
                </p>
            }
            sections={sections}
        />
    );
}
