"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/siteConfig";
import { COMPANY, CONTACT_EMAIL } from "@/lib/company";
import FooterLegal from "@/components/legal/FooterLegal";
import LegalFooterColumn from "@/components/legal/LegalFooterColumn";
import { MapPin, Mail, Clock } from "lucide-react";
import { usePathname } from "next/navigation";

const PRODUCT_LINKS = [
    { href: "/configurator/canvas", label: "Tablouri canvas din poza ta" },
    { href: "/configurator/canvas-colaj-foto", label: "Colaj foto pe canvas" },
    { href: "/shop/canvas", label: "Modele de tablouri gata făcute" },
    { href: "/configurator/tapet", label: "Fototapet personalizat" },
    { href: "/configurator/tricouri", label: "Tricouri, hanorace, șepci" },
    { href: "/configurator/autocolante", label: "Autocolante" },
    { href: "/configurator/afise", label: "Afișe, pliante, flyere" },
    { href: "/configurator/carti-vizita", label: "Cărți de vizită" },
    { href: "/configurator/banner", label: "Bannere, mesh, roll-up" },
    { href: "/configurator/window-graphics", label: "Window graphics" },
    { href: "/configurator/materiale/pvc-forex", label: "Panouri rigide" },
    { href: "/fonduri-pnrr", label: "Kituri fonduri UE" },
];

const GUIDE_LINKS = [
    { href: "/#format", label: "Ce format aleg pentru perete" },
    { href: "/blog", label: "Ghiduri foto și decor" },
    { href: "/material", label: "Pânză, hârtie, materiale" },
    { href: "/servicii", label: "Rame și finisaje" },
    { href: "/stil", label: "Stiluri de tablouri" },
    { href: "/judet", label: "Livrare pe județe" },
    { href: "/dimensiuni", label: "Prețuri pe dimensiuni" },
    { href: "/preturi", label: "Prețuri pe cantități" },
    { href: "/comparatii", label: "Ce material aleg" },
    { href: "/sectoare-bucuresti", label: "Sectoare București" },
];

const COMPANY_LINKS = [
    { href: "/despre-noi", label: "Despre Tablou.net" },
    { href: "/industrii", label: "Print pentru firme, pe industrii" },
    { href: "/seap", label: "Achiziții SEAP / SICAP" },
    { href: "/contact", label: "Ofertă pentru volume mari" },
    { href: "/livrare", label: "Livrare și termene" },
    { href: "/urmareste-comanda", label: "Status comandă" },
    { href: "/noutati", label: "Noutăți" },
];


export default function Footer() {
    const pathname = usePathname();

    if (pathname?.startsWith("/admin") || pathname === "/editor") return null;


    return (
        <footer className="bg-[#FBF7F2] text-stone-600 relative isolate border-t border-stone-200 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#B8385A]/60 to-transparent" />

            <div className="container mx-auto px-6 lg:px-12 !max-w-7xl py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 mb-8">
                    {/* Brand */}
                    <div className="lg:col-span-4 flex flex-col gap-4">
                        <Link href="/" className="inline-block relative group">
                            <div className="relative h-8 flex items-center">
                                <Image
                                    src="/logo.png"
                                    alt="Tablou.net"
                                    width={144}
                                    height={32}
                                    className="h-8 w-auto object-contain object-left"
                                    loading="lazy"
                                />
                            </div>
                        </Link>
                        <p className="text-sm text-stone-600 leading-relaxed max-w-sm">
                            Tablouri canvas din fotografiile tale, printate în atelier propriu și livrate în toată țara.
                        </p>
                        <div className="space-y-3 text-sm">
                            <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-3 hover:text-stone-900 transition-colors">
                                <Mail size={16} className="text-[#B8385A] shrink-0" />
                                <span>{CONTACT_EMAIL}</span>
                            </a>
                            <div className="flex items-center gap-3">
                                <Clock size={16} className="text-[#B8385A] shrink-0" />
                                <span>Luni - Vineri 09:00 - 18:00</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin size={16} className="text-[#B8385A] shrink-0 mt-0.5" />
                                <span>{COMPANY.address.full}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 pt-1">
                            {siteConfig.socialLinks.filter((l) => l.title !== "Twitter" && l.title !== "Email").map((link) => (
                                <Link
                                    key={link.title}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={link.title}
                                    className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-600 hover:text-white hover:bg-[#B8385A] hover:border-[#B8385A] transition-colors"
                                >
                                    <link.icon size={14} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <FooterColumn title="Produse" links={PRODUCT_LINKS} />
                    <FooterColumn title="Ghiduri" links={GUIDE_LINKS} />
                    <FooterColumn title="Firme & instituții" links={COMPANY_LINKS} />
                    <LegalFooterColumn className="lg:col-span-2" titleClassName="text-stone-900 text-xs font-bold uppercase tracking-widest mb-4" listClassName="space-y-1.5 text-[13px]" linkClassName="hover:text-[#B8385A] transition-colors" extraLinks={[{ href: "/harta-site", label: "Harta site" }]} />
                </div>

                {/* Bottom Bar */}
                <div className="pt-6 border-t border-stone-200 text-xs text-stone-500">
                    <FooterLegal showLinks={false} linkClassName="hover:text-[#B8385A] transition-colors" />
                </div>
            </div>
        </footer>
    );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
    return (
        <div className="lg:col-span-2">
            <h4 className="text-stone-900 text-xs font-bold uppercase tracking-widest mb-4">{title}</h4>
            <ul className="space-y-1.5 text-[13px]">
                {[...links.filter((l) => l.href === "/judet" || l.href === "/dimensiuni" || l.href === "/preturi"), ...links.filter((l) => l.href !== "/judet" && l.href !== "/dimensiuni" && l.href !== "/preturi")].slice(0, 6).map((l) => (
                    <li key={l.href}>
                        <Link href={l.href} className="hover:text-[#B8385A] transition-colors">
                            {l.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
