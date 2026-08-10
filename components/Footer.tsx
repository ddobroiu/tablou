"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/siteConfig";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {
    const pathname = usePathname();

    if (pathname?.startsWith("/admin") || pathname === "/editor") return null;

    return (
        <footer className="bg-white text-slate-700 py-14 relative isolate border-t border-slate-200/60 overflow-hidden">
            {/* CMYK strip */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-[linear-gradient(90deg,var(--color-cyan),var(--color-magenta),var(--color-yellow))]"></div>
            {/* Thin hairline */}
            <div className="absolute top-[3px] left-0 w-full h-px bg-slate-200/70"></div>
            
            <div className="container mx-auto px-6 lg:px-12 !max-w-7xl">
                
                {/* Main Grid: 4 columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12">
                    
                    {/* Brand Info */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <Link href="/" className="inline-block relative group">
                            <div className="relative w-36 h-8 transition-all duration-300">
                                <Image
                                    src="/logo.png"
                                    alt="Tablou Logo"
                                    width={144}
                                    height={32}
                                    className="object-contain"
                                    loading="lazy"
                                />
                            </div>
                        </Link>
                        
                        <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
                            Soluții premium de print digital și producție publicitară la nivel național.
                        </p>

                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                            <span className="px-3 py-1.5 rounded-full border border-slate-200/70 bg-slate-50">CMYK ready</span>
                            <span className="px-3 py-1.5 rounded-full border border-slate-200/70 bg-slate-50">DTP verificare</span>
                            <span className="px-3 py-1.5 rounded-full border border-slate-200/70 bg-slate-50">24–48h</span>
                        </div>
                    </div>

                    {/* Links: Production */}
                     <div className="lg:col-span-2">
                        <h4 className="text-slate-900 text-sm font-semibold tracking-tight mb-4">Producție</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/configuratoare" className="hover:text-slate-950 transition-colors">Configuratoare</Link></li>
                            <li><Link href="/shop" className="hover:text-slate-950 transition-colors">Catalog Shop</Link></li>
                            <li><Link href="/seap" className="hover:text-slate-950 transition-colors">Publicitate SEAP</Link></li>
                            <li><Link href="/contact" className="hover:text-slate-950 transition-colors">Comenzi B2B</Link></li>
                        </ul>
                    </div>
                    
                    {/* Links: Info */}
                    <div className="lg:col-span-2">
                        <h4 className="text-slate-900 text-sm font-semibold tracking-tight mb-4">Informații</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/despre-noi" className="hover:text-slate-950 transition-colors">Despre Noi</Link></li>
                            <li><Link href="/urmareste-comanda" className="hover:text-slate-950 transition-colors">Status Comandă</Link></li>
                            <li><Link href="/livrare" className="hover:text-slate-950 transition-colors">Livrare</Link></li>
                            <li><Link href="/termeni" className="hover:text-slate-950 transition-colors">Termeni</Link></li>
                            <li><Link href="/confidentialitate" className="hover:text-slate-950 transition-colors">Confidențialitate</Link></li>
                            <li><Link href="/politica-retur" className="hover:text-slate-950 transition-colors">Politica de Retur</Link></li>
                            <li><Link href="/retragere-contract" className="hover:text-slate-950 transition-colors">Retrage-te din Contract</Link></li>
                            <li><Link href="/noutati" className="hover:text-slate-950 transition-colors">Noutăți</Link></li>
                        </ul>
                    </div>

                    {/* Links: Expertiza */}
                    <div className="lg:col-span-2">
                        <h4 className="text-slate-900 text-sm font-semibold tracking-tight mb-4">Expertiză</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/material" className="hover:text-slate-950 transition-colors">Materiale</Link></li>
                            <li><Link href="/servicii" className="hover:text-slate-950 transition-colors">Servicii & Finisaje</Link></li>
                            <li><Link href="/norme" className="hover:text-slate-950 transition-colors">Norme & Reglementări</Link></li>
                            <li><Link href="/stil" className="hover:text-slate-950 transition-colors">Stiluri de Design</Link></li>
                            <li><Link href="/industrii" className="hover:text-slate-950 transition-colors">Industrii</Link></li>
                            <li><Link href="/judet" className="hover:text-slate-950 transition-colors">Toate Județele</Link></li>
                        </ul>
                    </div>

                    {/* Contact Details */}
                    <div className="lg:col-span-2">
                        <h4 className="text-slate-900 text-sm font-semibold tracking-tight mb-4">Contact</h4>
                        <div className="space-y-4 text-sm">
                            <div className="flex gap-3">
                                <MapPin size={16} className="text-slate-900 shrink-0 mt-0.5" />
                                <span className="text-slate-700">Com. Topliceni, nr. 214, Jud. Buzău</span>
                            </div>
                            <div className="flex gap-3">
                                <Phone size={16} className="text-slate-900 shrink-0 mt-0.5" />
                                <a href={`tel:${siteConfig.phone.replace(/\s+/g, '').replace(/^0/, '+40')}`} className="hover:text-slate-950 transition-colors text-slate-700">{siteConfig.phone}</a>
                            </div>
                            <div className="flex gap-3">
                                <Mail size={16} className="text-slate-900 shrink-0 mt-0.5" />
                                <a href="mailto:contact@Tablou.net" className="hover:text-slate-950 transition-colors text-slate-700">contact@Tablou.net</a>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-4 mt-6">
                            {siteConfig.socialLinks.filter(l => l.title !== "Twitter").map((link) => (
                                <Link
                                    key={link.title}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={link.title}
                                    className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-700 hover:text-white hover:bg-slate-950 hover:border-slate-950 transition-colors"
                                >
                                    <link.icon size={14} />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-6 border-t border-slate-200/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
                    <p className="text-slate-600">&copy; {new Date().getFullYear()} {siteConfig.name}. Toate drepturile rezervate.</p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        {/* Official ANPC Badges */}
                        <div className="flex items-center gap-2">
                            <a href="https://anpc.ro/ce-este-sal/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                                <span className="inline-flex items-center justify-center h-10 px-2 rounded-lg border border-slate-200/70 bg-slate-50">
                                    <img src="/250x50_icon_ANPC-SAL.webp" alt="Solutionarea Alternativa a Litigiilor" width={200} height={40} className="h-8 w-auto" loading="lazy" />
                                </span>
                            </a>
                            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                                <span className="inline-flex items-center justify-center h-10 px-2 rounded-lg border border-slate-200/70 bg-slate-50">
                                    <img src="/250x50_icon_ANPC-SOL.webp" alt="Solutionarea Online a Litigiilor" width={200} height={40} className="h-8 w-auto" loading="lazy" />
                                </span>
                            </a>
                        </div>
                        
                        <span className="hidden md:inline mx-2 text-slate-300">•</span>
                        
                        {/* Partners */}
                        <div className="flex items-center gap-4 text-[10px] font-semibold tracking-tight text-slate-500">
                            <a href="https://www.prynt.ro" target="_blank" className="hover:text-slate-950 transition-colors">Prynt.ro</a>
                            <a href="https://www.adbanner.ro" target="_blank" className="hover:text-slate-950 transition-colors">AdBanner</a>
                            <span className="text-slate-300">|</span>
                            <a href="https://e-web.ro" target="_blank" className="text-slate-500 hover:text-slate-950 transition-colors">Site realizat de e-web.ro</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
