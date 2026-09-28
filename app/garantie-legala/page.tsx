import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import LegalDocument, { type LegalSection } from "@/components/legal/LegalDocument";
import GarantieLegalaNotice, {
    GARANTIE_EUROPA_LABEL,
    GARANTIE_EUROPA_URL,
    GARANTIE_NOTICE_PNG,
    GARANTIE_NOTICE_SVG,
    GARANTIE_PAGE_HREF,
} from "@/components/legal/GarantieLegalaNotice";
import { COMPANY, CONTACT_EMAIL } from "@/lib/company";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
    title: "Garanția legală de conformitate – drepturile dumneavoastră",
    description: `Notificarea armonizată UE privind garanția legală de conformitate de minimum 2 ani pentru produsele cumpărate de pe ${siteConfig.domain.toLowerCase()} și cum vă exercitați drepturile.`,
    alternates: { canonical: GARANTIE_PAGE_HREF },
};

const subject = encodeURIComponent("Garanție legală – comanda nr. ");
const mail = <a href={`mailto:${CONTACT_EMAIL}?subject=${subject}`}>{CONTACT_EMAIL}</a>;
const europa = (
    <a href={GARANTIE_EUROPA_URL} target="_blank" rel="noopener noreferrer">
        {GARANTIE_EUROPA_LABEL}
    </a>
);

const sections: LegalSection[] = [
    {
        id: "notificare",
        title: "Notificarea oficială a Uniunii Europene",
        body: (
            <>
                <figure className="mx-auto max-w-2xl">
                    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                        <GarantieLegalaNotice />
                    </div>
                    <figcaption className="mt-3 text-center text-sm text-slate-600">
                        Notificarea armonizată privind garanția legală de conformitate (Regulamentul de punere în aplicare (UE)
                        2025/1960). Mai multe informații, aceeași adresă ca a codului QR: {europa}.
                    </figcaption>
                </figure>
                <p className="mt-4 text-center text-sm">
                    <a href={GARANTIE_NOTICE_SVG} target="_blank" rel="noopener noreferrer">
                        Deschideți notificarea la dimensiune completă (SVG)
                    </a>{" "}
                    ·{" "}
                    <a href={GARANTIE_NOTICE_PNG} target="_blank" rel="noopener noreferrer">
                        PNG
                    </a>
                </p>
            </>
        ),
    },
    {
        id: "ce-este",
        title: "Ce înseamnă garanția legală de conformitate",
        body: (
            <>
                <p>
                    Pentru toate produsele pe care le cumpărați de la noi ca <strong>consumator</strong> beneficiați de garanția legală
                    de conformitate prevăzută de <strong>OUG nr. 140/2021</strong>: răspundem pentru orice lipsă de conformitate care
                    există la momentul livrării și se manifestă în termen de <strong>cel puțin 2 ani</strong> de la livrare. Garanția
                    legală este <strong>gratuită</strong>, se aplică automat, fără vreo formalitate sau cost suplimentar, și nu poate
                    fi limitată ori exclusă prin contract.
                </p>
                <p>
                    Dacă produsul nu corespunde descrierii sau specificațiilor comandate ori nu funcționează așa cum ar trebui, aveți
                    dreptul la aducerea lui în conformitate, <strong>gratuit</strong> (reparare sau înlocuire; la produsele tipărite, de
                    regulă, refacerea și reexpedierea lor), iar dacă aceasta nu este posibilă ori nu se face într-un termen rezonabil,
                    la <strong>reducerea prețului</strong> sau la <strong>restituirea integrală a prețului</strong>. Detaliile sunt în
                    secțiunea <Link href="/termeni#conformitate">Conformitatea produselor și garanția legală</Link> din Termeni și condiții.
                </p>
            </>
        ),
    },
    {
        id: "personalizate",
        title: "Produsele personalizate au și ele garanție legală",
        body: (
            <p>
                Produsele realizate după specificațiile dumneavoastră (grafică, text, fotografii, dimensiuni sau opțiuni alese de
                dumneavoastră) sunt exceptate de la dreptul de retragere de 14 zile (art. 16 lit. c din OUG nr. 34/2014), dar{" "}
                <strong>beneficiază pe deplin de garanția legală de conformitate</strong>: dacă au defecte de material sau de
                execuție ori nu corespund comenzii și fișierului aprobat, le refacem sau vă restituim banii, conform celor de mai sus.
            </p>
        ),
    },
    {
        id: "cum",
        title: "Cum vă exercitați drepturile la noi",
        body: (
            <>
                <ol>
                    <li>
                        Scrieți-ne cât mai curând după ce constatați problema (legea prevede informarea vânzătorului în termen de
                        2 luni de la constatare), pe e-mail la {mail}. E-mailul este singurul nostru canal oficial de contact.
                    </li>
                    <li>
                        Indicați numărul comenzii și atașați <strong>dovada cumpărării</strong> (factura primită pe e-mail, confirmarea
                        comenzii sau un extras de cont), o descriere a problemei și fotografii ale produsului și ale ambalajului.
                    </li>
                    <li>
                        Vă răspundem și vă propunem soluția; de regulă nu este nevoie să returnați produsul neconform, iar dacă îl
                        solicităm pentru verificare, transportul este pe costul nostru.
                    </li>
                </ol>
                <p>
                    Vedeți și <Link href="/politica-retur">Livrare și retur</Link> și <Link href="/reclamatii">Reclamații</Link>.
                </p>
                <p>
                    Vânzătorul și cel care răspunde de garanția legală este <strong>{COMPANY.legalName}</strong>, CUI {COMPANY.cui},
                    cu sediul în {COMPANY.address.full}, e-mail {mail}.
                </p>
            </>
        ),
    },
    {
        id: "informatii",
        title: "Informații oficiale",
        body: (
            <p>
                Informațiile Comisiei Europene despre garanții, pentru fiecare țară din UE, sunt pe portalul Your Europe: {europa}.
                Pe lângă garanția legală, vânzătorii și producătorii pot oferi garanții comerciale, care se aplică independent de ea
                și nu o restrâng.
            </p>
        ),
    },
];

export default function GarantieLegalaPage() {
    return (
        <LegalDocument
            title="Garanția legală de conformitate"
            intro={
                <p>
                    Drepturile dumneavoastră de garanție legală: produsele cumpărate de pe {siteConfig.domain.toLowerCase()} beneficiază
                    de <strong>garanția legală de conformitate de minimum 2 ani</strong>, gratuită, conform OUG nr. 140/2021. Mai jos
                    găsiți notificarea oficială a Uniunii Europene și pașii prin care vă exercitați drepturile.
                </p>
            }
            sections={sections}
            currentHref={GARANTIE_PAGE_HREF}
            showToc={false}
        />
    );
}
