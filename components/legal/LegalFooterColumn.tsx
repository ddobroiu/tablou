import React from "react";
import Link from "next/link";
import { LEGAL_LINKS } from "@/lib/company";
import CookieSettingsLink from "@/components/legal/CookieSettingsLink";

/** Coloana „Legal” din subsol: toate documentele legale + setările cookie (fără limită de link-uri). */
export default function LegalFooterColumn({
    title = "Legal",
    className = "lg:col-span-2",
    titleClassName = "text-white text-xs font-bold uppercase tracking-widest mb-4",
    listClassName = "space-y-1.5 text-[13px]",
    linkClassName = "hover:text-amber-400 transition-colors",
    extraLinks = [],
}: {
    title?: string;
    className?: string;
    titleClassName?: string;
    listClassName?: string;
    linkClassName?: string;
    extraLinks?: { href: string; label: string }[];
}) {
    return (
        <div className={className}>
            <h4 className={titleClassName}>{title}</h4>
            <ul className={listClassName}>
                {[...LEGAL_LINKS, ...extraLinks].map((l) => (
                    <li key={l.href}>
                        <Link href={l.href} className={linkClassName}>
                            {l.label}
                        </Link>
                    </li>
                ))}
                <li>
                    <CookieSettingsLink className={`text-left ${linkClassName}`} />
                </li>
            </ul>
        </div>
    );
}
