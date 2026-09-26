import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import LegalDocument, { type LegalSection } from "@/components/legal/LegalDocument";
import { COMPANY, CONTACT_EMAIL } from "@/lib/company";
import { siteConfig } from "@/lib/siteConfig";
import { FREE_SHIPPING_THRESHOLD, MAX_RAMBURS_LIMIT } from "@/lib/paymentRules";
import { DPD_COUNTRIES } from "@/lib/shippingUtils";

export const metadata: Metadata = {
    title: "Politica de livrare și retur",
    description: `Cum livrăm comenzile ${siteConfig.domain.toLowerCase()} (curier DPD, costuri, termene) și cum funcționează retururile: produse personalizate, produse standard, produse neconforme.`,
    alternates: { canonical: "/politica-retur" },
};

const mail = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;
const foreignCountries = DPD_COUNTRIES.filter((c) => c.code !== "RO").map((c) => c.name).join(", ");

const sections: LegalSection[] = [
    {
        id: "curier",
        title: "Cum livrăm",
        body: (
            <>
                <p>
                    Livrăm prin curier <strong>DPD România</strong> (iar în afara României prin rețeaua DPD și partenerii acesteia),
                    la adresa indicată în comandă sau, dacă alegeți această opțiune în checkout, la un <strong>locker ori punct de
                    ridicare DPD</strong> selectat pe hartă (doar punctele în care încape coletul). După predarea coletului primiți pe
                    e-mail numărul AWB; statusul comenzii îl puteți urmări în contul dumneavoastră sau în pagina{" "}
                    <Link href="/urmareste-comanda">Status comandă</Link>.
                </p>
                <p>
                    Livrăm în toată România. În afara României livrăm în: {foreignCountries}, numai pentru coletele care se încadrează
                    în limitele de greutate și dimensiuni ale curierului (verificarea se face automat în checkout) și numai cu plata
                    online.
                </p>
            </>
        ),
    },
    {
        id: "costuri",
        title: "Costul livrării",
        body: (
            <>
                <p>
                    Costul livrării depinde de greutatea, dimensiunile de ambalare și destinația coletului și se afișează în coș și în
                    pagina de finalizare a comenzii, înainte de plasarea ei. Pentru comenzile cu valoarea produselor de cel puțin{" "}
                    <strong>{FREE_SHIPPING_THRESHOLD} lei</strong>, livrarea este gratuită, dacă nu se indică altfel în checkout.
                    Plata ramburs (la curier) este disponibilă numai în România, pentru comenzi de cel mult {MAX_RAMBURS_LIMIT} lei.
                </p>
                <p>Prețurile și costul livrării sunt finale; furnizorul nu este plătitor de TVA.</p>
            </>
        ),
    },
    {
        id: "termene",
        title: "Termene",
        body: (
            <p>
                Termenul estimat (producție + livrare) este afișat pe pagina produsului și în coș și curge de la confirmarea comenzii
                și a plății și, după caz, de la primirea fișierelor corecte sau aprobarea machetei. De regulă, curierul livrează în 1–2
                zile lucrătoare de la predare în România și în câteva zile lucrătoare în celelalte țări. În lipsa unui alt termen
                convenit, livrarea se face în cel mult 30 de zile de la încheierea contractului. Dacă apare o întârziere, vă anunțăm
                pe e-mail; drepturile dumneavoastră în caz de nelivrare sunt descrise în <Link href="/termeni#productie-livrare">Termeni și condiții</Link>.
            </p>
        ),
    },
    {
        id: "receptie",
        title: "Recepția coletului și coletele deteriorate",
        body: (
            <>
                <p>
                    Vă recomandăm să verificați starea exterioară a coletului în prezența curierului. Dacă ambalajul este vizibil
                    deteriorat, cereți curierului întocmirea unui proces-verbal de constatare sau refuzați coletul și anunțați-ne. Dacă
                    observați deteriorări după deschiderea coletului, trimiteți-ne cât mai repede, la {mail}, fotografii ale produsului
                    și ale ambalajului, împreună cu numărul comenzii, ca să putem deschide dosarul de daună la curier și să refacem
                    produsele.
                </p>
                <p>
                    Aceste recomandări ne ajută să rezolvăm rapid problema și nu vă limitează drepturile legale: produsele deteriorate
                    la transport sunt tratate ca neconforme, iar riscul transportului îl suportăm noi până la primirea coletului de
                    către dumneavoastră (pentru consumatori).
                </p>
            </>
        ),
    },
    {
        id: "personalizate",
        title: "Retur – produse personalizate",
        body: (
            <>
                <p>
                    Produsele realizate după specificațiile dumneavoastră (cu grafica, fotografiile, textul sau logo-ul dumneavoastră
                    ori pe dimensiunile și opțiunile alese de dumneavoastră) <strong>nu pot fi returnate în baza dreptului de retragere</strong>,
                    conform art. 16 lit. c) din OUG nr. 34/2014, deoarece sunt realizate special pentru dumneavoastră. Această
                    excepție vă este adusă la cunoștință în pagina de finalizare a comenzii, înainte de plasarea ei.
                </p>
                <p>
                    Dacă un produs personalizat este neconform (defect de material sau de tipar, alt produs decât cel comandat,
                    deteriorat la transport, diferit de fișierul aprobat), îl refacem și îl reexpediem fără costuri pentru dumneavoastră
                    sau, dacă refacerea nu este posibilă, vă restituim prețul, conform secțiunii „Conformitatea produselor” din{" "}
                    <Link href="/termeni#conformitate">Termeni și condiții</Link>. Trimiteți-ne reclamația conform paginii{" "}
                    <Link href="/reclamatii">Reclamații</Link>. De regulă nu este nevoie să returnați produsul neconform; dacă îl
                    solicităm înapoi pentru verificare, costul transportului îl suportăm noi.
                </p>
            </>
        ),
    },
    {
        id: "standard",
        title: "Retur – produse standard (nepersonalizate)",
        body: (
            <>
                <p>
                    Pentru produsele standard, consumatorii se pot retrage din contract în <strong>14 zile</strong> de la primirea
                    produselor, fără a indica motivul. Procedura:
                </p>
                <ol>
                    <li>
                        Ne comunicați decizia de retragere în termenul de 14 zile: online, prin{" "}
                        <Link href="/retragere-contract">Retragere din contract</Link> (confirmare imediată pe e-mail), sau pe e-mail la{" "}
                        {mail}, folosind eventual <Link href="/formular-retragere">modelul de formular de retragere</Link>, ori prin poștă
                        la {COMPANY.address.full}.
                    </li>
                    <li>Vă transmitem pe e-mail adresa de retur. Puteți returna și doar o parte dintre produse.</li>
                    <li>
                        Trimiteți produsele în cel mult 14 zile de la comunicarea retragerii, bine ambalate, cu curierul ales de
                        dumneavoastră. <strong>Costul transportului de retur este suportat de dumneavoastră.</strong>
                    </li>
                    <li>
                        Vă rambursăm toate sumele plătite pentru produsele returnate, inclusiv costul livrării standard inițiale, în cel
                        mult 14 zile de la primirea comunicării de retragere, prin aceeași metodă de plată (pentru ramburs, prin transfer
                        în contul indicat). Putem amâna rambursarea până primim produsele sau dovada expedierii lor.
                    </li>
                </ol>
                <p>
                    Răspundeți pentru diminuarea valorii produselor cauzată de manipularea lor altfel decât pentru verificarea naturii,
                    caracteristicilor și funcționării (de exemplu produse montate, lipite, decupate sau deteriorate).
                </p>
            </>
        ),
    },
    {
        id: "clienti-profesionisti",
        title: "Clienți persoane juridice",
        body: (
            <p>
                Dreptul de retragere este prevăzut de lege numai pentru consumatori (persoane fizice care acționează în scopuri din
                afara activității lor profesionale). Pentru comenzile persoanelor juridice, retururile sunt posibile numai pentru
                produse neconforme, în condițiile din <Link href="/termeni#conformitate">Termeni și condiții</Link>.
            </p>
        ),
    },
];

export default function PoliticaReturPage() {
    return (
        <LegalDocument
            title="Politica de livrare și retur"
            currentHref="/politica-retur"
            intro={
                <p>
                    Livrăm prin curier DPD, la adresă sau la locker/punct DPD. Produsele personalizate nu se returnează prin dreptul de
                    retragere (art. 16 lit. c OUG 34/2014), dar le refacem gratuit dacă sunt neconforme; produsele standard pot fi
                    returnate în 14 zile.
                </p>
            }
            sections={sections}
        />
    );
}
