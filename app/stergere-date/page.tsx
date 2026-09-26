import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import LegalDocument, { type LegalSection } from "@/components/legal/LegalDocument";
import { COMPANY, CONTACT_EMAIL } from "@/lib/company";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
    title: "Ștergerea datelor personale",
    description: `Cum cereți ștergerea contului și a datelor personale prelucrate de ${siteConfig.domain.toLowerCase()} (art. 17 GDPR) și ce date trebuie păstrate conform legii.`,
    alternates: { canonical: "/stergere-date" },
};

const subject = encodeURIComponent("Cerere GDPR - ștergere date");
const mail = <a href={`mailto:${CONTACT_EMAIL}?subject=${subject}`}>{CONTACT_EMAIL}</a>;

const sections: LegalSection[] = [
    {
        id: "cerere",
        title: "Cum cereți ștergerea",
        body: (
            <>
                <p>
                    Trimiteți-ne un e-mail la {mail}, de pe adresa asociată contului sau comenzilor, cu mențiunea „Cerere GDPR –
                    ștergere date”. Precizați dacă doriți ștergerea contului, a fișierelor grafice încărcate, dezabonarea de la
                    newsletter sau ștergerea tuturor datelor. Puteți trimite cererea și prin poștă, la {COMPANY.legalName},{" "}
                    {COMPANY.address.full}.
                </p>
                <p>
                    Dacă cererea vine de pe altă adresă decât cea din cont, vă putem cere informații suplimentare pentru a vă confirma
                    identitatea, ca să nu ștergem datele altcuiva.
                </p>
            </>
        ),
    },
    {
        id: "termen",
        title: "Termen de răspuns",
        body: (
            <p>
                Răspundem gratuit, în cel mult o lună de la primirea cererii; pentru cereri complexe termenul se poate prelungi cu
                încă două luni, cu informarea dumneavoastră. Vă confirmăm pe e-mail ce date am șters.
            </p>
        ),
    },
    {
        id: "exceptii",
        title: "Ce date nu putem șterge imediat",
        body: (
            <>
                <p>Potrivit art. 17 alin. (3) GDPR, păstrăm, chiar după cerere, numai datele de care avem nevoie pentru:</p>
                <ul>
                    <li>îndeplinirea obligațiilor legale: facturile și documentele justificative ale comenzilor se păstrează 10 ani (Legea contabilității nr. 82/1991);</li>
                    <li>comenzile în curs de producție sau livrare, garanția de conformitate și reclamațiile deschise;</li>
                    <li>constatarea, exercitarea sau apărarea unor drepturi în justiție.</li>
                </ul>
                <p>
                    Aceste date nu mai sunt folosite în alte scopuri și se șterg la expirarea termenelor. Detalii în{" "}
                    <Link href="/confidentialitate#pastrare">Politica de confidențialitate</Link>.
                </p>
            </>
        ),
    },
    {
        id: "plangere",
        title: "Dacă nu sunteți mulțumit",
        body: (
            <p>
                Puteți depune o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP),{" "}
                <a href="https://www.dataprotection.ro" target="_blank" rel="noopener noreferrer">www.dataprotection.ro</a>.
            </p>
        ),
    },
];

export default function StergereDatePage() {
    return (
        <LegalDocument
            title="Ștergerea datelor personale"
            currentHref="/stergere-date"
            intro={<p>Aveți dreptul să cereți ștergerea datelor personale (art. 17 GDPR). Iată cum o faceți și ce trebuie să păstrăm conform legii.</p>}
            sections={sections}
            showToc={false}
        />
    );
}
