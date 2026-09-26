import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import LegalDocument, { type LegalSection } from "@/components/legal/LegalDocument";
import PrintButton from "@/components/legal/PrintButton";
import { COMPANY, CONTACT_EMAIL } from "@/lib/company";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
    title: "Formular de retragere",
    description: `Modelul de formular de retragere din contract (Anexa nr. 1 lit. B la OUG nr. 34/2014) pentru comenzile ${siteConfig.domain.toLowerCase()}.`,
    alternates: { canonical: "/formular-retragere" },
};

const mail = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;
const blank = <span className="inline-block min-w-[12rem] border-b border-dotted border-slate-400">&nbsp;</span>;

const sections: LegalSection[] = [
    {
        id: "cand",
        title: "Când se aplică dreptul de retragere",
        body: (
            <>
                <p>
                    Ca și consumator, vă puteți retrage din contract în 14 zile de la primirea <strong>produselor standard
                    (nepersonalizate)</strong>, fără a indica motivul. Detaliile (termene, rambursare, costul returului) sunt în{" "}
                    <Link href="/termeni#retragere">Termeni și condiții</Link> și în <Link href="/politica-retur">Politica de livrare și retur</Link>.
                </p>
                <p>
                    <strong>Dreptul de retragere nu se aplică produselor personalizate</strong> – realizate după specificațiile
                    dumneavoastră (cu grafica, fotografiile, textul sau logo-ul dumneavoastră ori pe dimensiunile și opțiunile alese de
                    dumneavoastră) – conform art. 16 lit. c) din OUG nr. 34/2014. Pentru produsele neconforme folosiți pagina{" "}
                    <Link href="/reclamatii">Reclamații</Link>.
                </p>
            </>
        ),
    },
    {
        id: "cum",
        title: "Cum transmiteți decizia de retragere",
        body: (
            <ul>
                <li>online, prin funcția <Link href="/retragere-contract">Retragere din contract</Link> – cea mai rapidă variantă, cu confirmare imediată pe e-mail;</li>
                <li>pe e-mail, la {mail}, completând modelul de mai jos sau printr-o altă declarație neechivocă;</li>
                <li>prin poștă, la {COMPANY.legalName}, {COMPANY.address.full}.</li>
            </ul>
        ),
    },
    {
        id: "model",
        title: "Model de formular de retragere",
        body: (
            <>
                <p className="text-sm text-slate-500">
                    (completați și returnați acest formular numai dacă doriți să vă retrageți din contract; utilizarea lui nu este
                    obligatorie – Anexa nr. 1 lit. B la OUG nr. 34/2014)
                </p>
                <div className="mt-4 space-y-4 rounded-xl border border-slate-300 p-5">
                    <p>
                        Către: <strong>{COMPANY.legalName}</strong>, {COMPANY.address.full}, e-mail: {CONTACT_EMAIL}
                    </p>
                    <p>
                        Vă informez/informăm (*) prin prezenta cu privire la retragerea mea/noastră (*) din contractul referitor la
                        vânzarea următoarelor produse (*): {blank}
                    </p>
                    <p>Numărul comenzii: {blank}</p>
                    <p>Comandate la data (*) {blank} / primite la data (*) {blank}</p>
                    <p>Numele consumatorului (consumatorilor): {blank}</p>
                    <p>Adresa consumatorului (consumatorilor): {blank}</p>
                    <p>Contul IBAN pentru rambursare (numai pentru comenzile plătite ramburs): {blank}</p>
                    <p>Semnătura consumatorului (consumatorilor) (doar în cazul în care acest formular este notificat pe hârtie): {blank}</p>
                    <p>Data: {blank}</p>
                    <p className="text-sm text-slate-500">(*) Se elimină mențiunea inutilă.</p>
                </div>
                <div className="mt-4">
                    <PrintButton />
                </div>
            </>
        ),
    },
];

export default function FormularRetragerePage() {
    return (
        <LegalDocument
            title="Formular de retragere"
            currentHref="/formular-retragere"
            intro={<p>Modelul oficial de formular pentru exercitarea dreptului de retragere din contractele încheiate la distanță.</p>}
            sections={sections}
            showToc={false}
        />
    );
}
