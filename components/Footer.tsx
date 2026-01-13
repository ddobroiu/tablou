"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/siteConfig";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Sparkles } from "lucide-react";

export default function Footer() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.querySelector('input[name="email"]') as HTMLInputElement)?.value || "";
    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data?.message || "Te-ai abonat cu succes!");
        (form.querySelector('input[name="email"]') as HTMLInputElement).value = "";
      } else {
        setStatus("error");
        setMessage(data?.message || "A apărut o eroare.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Eroare conexiune.");
    }

    if (status === 'success') {
      setTimeout(() => { setStatus("idle"); setMessage(""); }, 5000);
    }
  };

  const linkClass = "text-slate-400 hover:text-white transition-colors text-sm";

  return (
    <footer className="bg-slate-950 text-slate-200 pt-16 sm:pt-20 lg:pt-24 pb-12 border-t border-slate-900">
      <div className="container mx-auto px-4 sm:px-6">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-16">

          {/* 1. Brand & Socials */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-block">
              <img
                src="/logo.png"
                alt={siteConfig.name}
                className="h-8 w-auto object-contain brightness-0 invert opacity-80"
              />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Tablou.net este destinația ta pentru print de calitate premium.
              Transformăm amintirile tale în obiecte de decor durabile și impresionante.
            </p>
            <div className="flex items-center gap-4">
              {siteConfig.socialLinks.filter(l => l.title !== "Twitter").map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
                >
                  <link.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* 2. Navigation Columns */}
          <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-6">Produse</h3>
              <ul className="space-y-4">
                <li><Link href="/canvas" className={linkClass}>Canvas</Link></li>
                <li><Link href="/afise" className={linkClass}>Postere</Link></li>
                <li><Link href="/sticla-acrilica" className={linkClass}>Sticlă Acrilică</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-6">Colecții</h3>
              <ul className="space-y-4">
                <li><Link href="/shop/canvas" className={linkClass}>Colecție Canvas</Link></li>
                <li><Link href="/shop/acrylic" className={linkClass}>Colecție Sticlă Acrilică</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-6">Suport</h3>
              <ul className="space-y-4">
                <li><Link href="/urmareste-comanda" className={linkClass}>Status Comandă</Link></li>
                <li><Link href="/livrare" className={linkClass}>Livrare & Retur</Link></li>
                <li><Link href="/contact" className={linkClass}>Contact</Link></li>
                <li><Link href="/blog" className={linkClass}>Blog</Link></li>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-6">Legal</h3>
              <ul className="space-y-4">
                <li><Link href="/termeni" className={linkClass}>Termeni & Condiții</Link></li>
                <li><Link href="/confidentialitate" className={linkClass}>Confidențialitate</Link></li>
                <li><Link href="/politica-cookies" className={linkClass}>Cookies</Link></li>
              </ul>
            </div>
          </div>

          {/* 3. Newsletter */}
          <div className="lg:col-span-3">
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-6">Noutăți</h3>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Abonează-te pentru oferte speciale și noutăți despre produse.
            </p>
            <form className="flex flex-col gap-3" onSubmit={handleNewsletterSubmit}>
              <div className="relative">
                <Input
                  type="email"
                  name="email"
                  placeholder="Adresa de email"
                  required
                  className="bg-slate-900 border-slate-800 focus:border-indigo-500/50 h-12 text-sm rounded-lg text-white placeholder:text-slate-600 w-full"
                  disabled={status === "loading"}
                />
              </div>
              <Button type="submit" className="w-full bg-indigo-600 text-white hover:bg-indigo-500 h-11 text-sm font-semibold rounded-lg" disabled={status === "loading"}>
                {status === "loading" ? "..." : "Abonează-te"}
              </Button>
            </form>
            {status !== "idle" && (
              <p className={`mt-2 text-xs font-medium ${status === "success" ? "text-emerald-400" : "text-red-400"}`}>
                {message}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} {siteConfig.name}. Toate drepturile rezervate.</p>
          </div>

          <div className="flex items-center gap-6 opacity-60 hover:opacity-100 transition-opacity">
            <a href="https://anpc.ro/ce-este-sal/" target="_blank" rel="noopener noreferrer">
              <Image src="/250x50_icon_ANPC-SAL.webp" alt="ANPC SAL" width={100} height={20} className="h-5 w-auto" />
            </a>
            <a href="https://consumer-redress.ec.europa.eu/index_ro" target="_blank" rel="noopener noreferrer">
              <Image src="/250x50_icon_ANPC-SOL.webp" alt="ANPC SOL" width={100} height={20} className="h-5 w-auto" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
