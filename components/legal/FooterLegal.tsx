import React from "react";
import Link from "next/link";
import { ANPC_SAL_URL, COMPANY, CONTACT_EMAIL, LEGAL_LINKS } from "@/lib/company";
import { siteConfig } from "@/lib/siteConfig";
import CookieSettingsLink from "@/components/legal/CookieSettingsLink";

/**
 * Bara legală din subsol: identificarea operatorului, documentele legale, setările cookie
 * și link-ul ANPC SAL (Ordinul ANPC nr. 449/2022). Moștenește culorile subsolului.
 */
export default function FooterLegal({
    linkClassName = "hover:underline underline-offset-2",
    showLinks = true,
}: {
    linkClassName?: string;
    /** false când subsolul are deja o coloană cu documentele legale (LegalFooterColumn) */
    showLinks?: boolean;
}) {
    return (
        <div className="space-y-4 text-xs leading-relaxed">
            {showLinks && (
            <nav aria-label="Informații legale">
                <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
                    {LEGAL_LINKS.map((l) => (
                        <li key={l.href}>
                            <Link href={l.href} className={linkClassName}>
                                {l.label}
                            </Link>
                        </li>
                    ))}
                    <li>
                        <CookieSettingsLink className={linkClassName} />
                    </li>
                </ul>
            </nav>
            )}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <p>
                    &copy; {new Date().getFullYear()} {siteConfig.domain.toLowerCase()} este operat de{" "}
                    <strong className="font-semibold">{COMPANY.legalName}</strong> · CUI {COMPANY.cui} · Nr. Reg. Com. {COMPANY.regCom} ·
                    EUID {COMPANY.euid} · Sediul social: {COMPANY.address.full} · Neplătitor de TVA · E-mail:{" "}
                    <a href={`mailto:${CONTACT_EMAIL}`} className={linkClassName}>
                        {CONTACT_EMAIL}
                    </a>
                </p>
                <a
                    href={ANPC_SAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 transition-opacity hover:opacity-80"
                    title="ANPC – Soluționarea Alternativă a Litigiilor"
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/250x50-icon-anpc-sal.webp"
                        alt="ANPC – Soluționarea Alternativă a Litigiilor (SAL)"
                        width={200}
                        height={40}
                        className="h-10 w-auto"
                        loading="lazy"
                    />
                </a>
            </div>
        </div>
    );
}
