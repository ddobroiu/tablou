import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import LegalDocument, { type LegalSection } from "@/components/legal/LegalDocument";
import { ANPC_SAL_URL, CONTACT_EMAIL } from "@/lib/company";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
    title: "Reclamații",
    description: `Cum trimiteți o reclamație pentru o comandă ${siteConfig.domain.toLowerCase()}, în cât timp răspundem și unde vă puteți adresa dacă nu suntem de acord.`,
    alternates: { canonical: "/reclamatii" },
};

const subject = encodeURIComponent("Reclamație comanda nr. ");
const mail = <a href={`mailto:${CONTACT_EMAIL}?subject=${subject}`}>{CONTACT_EMAIL}</a>;

const sections: LegalSection[] = [
    {
        id: "cum",
        title: "Cum trimiteți o reclamație",
        body: (
            <>
                <p>Scrieți-ne la {mail} și includeți, pentru a o putea rezolva repede:</p>
                <ul>
                    <li>numărul comenzii și numele de pe comandă;</li>
                    <li>descrierea problemei (de exemplu produs deteriorat la transport, defect de tipar sau de material, produs diferit de cel comandat, produs lipsă, întârziere);</li>
                    <li>fotografii clare ale produsului, ale defectului și ale ambalajului (inclusiv eticheta AWB, dacă problema ține de transport);</li>
                    <li>soluția pe care o preferați (refacere, înlocuire, reducere de preț, restituirea banilor).</li>
                </ul>
                <p>
                    Pentru a vă retrage din contractul privind un produs standard folosiți <Link href="/retragere-contract">Retragere
                    din contract</Link> sau <Link href="/formular-retragere">formularul de retragere</Link>. Pentru cereri privind
                    datele personale vedeți <Link href="/confidentialitate#drepturi">Politica de confidențialitate</Link>.
                </p>
            </>
        ),
    },
    {
        id: "termene",
        title: "Cum și în cât timp răspundem",
        body: (
            <>
                <p>
                    Confirmăm primirea reclamației pe e-mail și vă comunicăm soluția în cel mult <strong>30 de zile calendaristice</strong>{" "}
                    (de regulă în 1–3 zile lucrătoare). Dacă produsul este neconform, îl refacem și îl reexpediem fără costuri pentru
                    dumneavoastră sau, dacă refacerea nu este posibilă, vă oferim reducerea prețului ori restituirea banilor, conform
                    secțiunii „Conformitatea produselor” din <Link href="/termeni#conformitate">Termeni și condiții</Link>.
                </p>
                <p>
                    Nu vă cerem, de regulă, returnarea produsului neconform; dacă avem nevoie de el pentru verificare sau pentru dosarul
                    de daună la curier, costul transportului îl suportăm noi.
                </p>
            </>
        ),
    },
    {
        id: "anpc",
        title: "Dacă nu sunteți mulțumit de răspuns",
        body: (
            <ul>
                <li>
                    Vă puteți adresa <strong>Autorității Naționale pentru Protecția Consumatorilor (ANPC)</strong> – <a href="https://anpc.ro" target="_blank" rel="noopener noreferrer">anpc.ro</a>,
                    inclusiv prin formularul de sesizare de pe site-ul ANPC.
                </li>
                <li>
                    Puteți apela la <strong>soluționarea alternativă a litigiilor (SAL)</strong>, conform informațiilor ANPC:{" "}
                    <a href={ANPC_SAL_URL} target="_blank" rel="noopener noreferrer">anpc.ro/public/ce-este-sal</a>.
                </li>
                <li>Vă puteți adresa instanțelor judecătorești competente din România.</li>
            </ul>
        ),
    },
];

export default function ReclamatiiPage() {
    return (
        <LegalDocument
            title="Reclamații"
            currentHref="/reclamatii"
            intro={<p>Dacă ceva nu este în regulă cu o comandă, spuneți-ne: o rezolvăm cât mai repede.</p>}
            sections={sections}
            showToc={false}
        />
    );
}
