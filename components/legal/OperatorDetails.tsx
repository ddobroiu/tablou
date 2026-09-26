import React from "react";
import { COMPANY, CONTACT_EMAIL } from "@/lib/company";
import { siteConfig } from "@/lib/siteConfig";

/** Datele de identificare ale operatorului (Legea 365/2002, OUG 34/2014). */
export default function OperatorDetails({
    title = "Datele operatorului",
    tone = "light",
}: {
    title?: string;
    tone?: "light" | "dark";
}) {
    const dark = tone === "dark";
    return (
        <div
            className={
                dark
                    ? "rounded-xl border border-white/10 bg-white/5 p-5 text-sm leading-relaxed text-slate-300"
                    : "rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm leading-relaxed text-slate-700"
            }
        >
            <p className={dark ? "mb-2 font-semibold text-white" : "mb-2 font-semibold text-slate-900"}>{title}</p>
            <p>
                Site-ul {siteConfig.domain.toLowerCase()} este operat de <strong className={dark ? "text-white" : "text-slate-900"}>{COMPANY.legalName}</strong>
            </p>
            <ul className="mt-2 space-y-0.5">
                <li>Sediul social: {COMPANY.address.full}</li>
                <li>CUI: {COMPANY.cui}</li>
                <li>Nr. de ordine în Registrul Comerțului: {COMPANY.regCom}</li>
                <li>EUID: {COMPANY.euid}</li>
                <li>Neplătitor de TVA · înregistrată în sistemul RO e-Factura</li>
                <li>
                    E-mail:{" "}
                    <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className={dark ? "font-medium text-emerald-400 underline underline-offset-2" : "font-medium text-emerald-700 underline underline-offset-2"}
                    >
                        {CONTACT_EMAIL}
                    </a>
                </li>
            </ul>
        </div>
    );
}
