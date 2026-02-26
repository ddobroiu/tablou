"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { siteConfig } from "@/lib/siteConfig";
import { ChevronDown, Menu, X, User, LogOut, Package, Settings, MapPin, CreditCard, Heart, ShieldCheck } from "lucide-react";
// 1. IMPORTĂM WIDGETUL DE CART
import CartWidget from "./CartWidget";
import SearchBox from "./SearchBox";
import HeaderFreeShipping from "./HeaderFreeShipping";

// --- SUB-COMPONENTS ---

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="relative font-bold text-slate-900 group px-4 py-2 hover:bg-slate-900 hover:text-white rounded-full transition-all duration-200 uppercase text-sm tracking-wide"
  >
    {children}
  </Link>
);

const DesktopNav = () => {
  return (
    <nav className="hidden lg:flex items-center gap-4 justify-center py-2">
      {siteConfig.headerNav.map((item) =>
        (item as any).children ? (
          <div key={item.label} className="relative group">
            <button
              className="flex items-center gap-1 font-bold text-slate-900 px-4 py-2 hover:bg-slate-900 hover:text-white rounded-full transition-all duration-200 uppercase text-sm tracking-wide cursor-pointer"
              aria-haspopup="true"
              aria-expanded="false"
            >
              {item.label}
              <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
            </button>
            {/* Dropdown Container */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-56 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 ease-out z-50">
              <div className="bg-white/80 dark:bg-zinc-900/90 backdrop-blur-xl rounded-2xl shadow-elevated border border-slate-200/50 dark:border-zinc-800 p-2 overflow-hidden">
                {(item as any).children.map((child: any) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-zinc-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <NavLink key={(item as any).href} href={(item as any).href}>
            {item.label}
          </NavLink>
        )
      )}
    </nav>
  );
};

const MobileNav = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [openSub, setOpenSub] = useState<string | null>(null);

  // Nu apelăm setState direct într-un effect; dacă meniul e închis, tratăm sub-meniul ca "nul" la randare
  const visibleOpenSub = isOpen ? openSub : null;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
        onClick={onClose}
        role="presentation"
        style={{ willChange: 'opacity' }}
      />
      <div
        className={`fixed top-0 left-0 h-full w-[85%] max-w-[340px] bg-white border-r border-slate-200 shadow-2xl z-[1000] transition-transform duration-300 ease-out lg:hidden ${isOpen ? "translate-x-0 visible" : "-translate-x-full invisible"
          }`}
        style={{ willChange: 'transform', transform: isOpen ? 'translateX(0) translateZ(0)' : 'translateX(-100%) translateZ(0)' }}
      >
        <div className="flex flex-col h-full">
          {/* Header mobil */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <Link href="/" className="flex items-center" onClick={onClose}>
              <img
                src="/logo.png"
                alt={siteConfig.name}
                className="h-7 w-auto object-contain"
              />
            </Link>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-all" aria-label="Închide meniul">
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {siteConfig.headerNav.map((item) => (
                <li key={item.label} className="border-b border-slate-50 pb-3 last:border-0">
                  {(item as any).children ? (
                    <div className="rounded-lg overflow-hidden">
                      <button
                        onClick={() => setOpenSub(openSub === item.label ? null : item.label)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold rounded-lg transition-all ${visibleOpenSub === item.label ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'}`}
                        aria-label={`${visibleOpenSub === item.label ? 'Închide' : 'Deschide'} submeniul ${item.label}`}
                        aria-expanded={visibleOpenSub === item.label}
                      >
                        {item.label}
                        <ChevronDown size={18} className={`transition-transform duration-200 ${visibleOpenSub === item.label ? "rotate-180 text-indigo-600" : "text-slate-400"}`} />
                      </button>
                      <div className={`grid transition-all duration-200 ease-in-out ${visibleOpenSub === item.label ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                        <div className="overflow-hidden bg-slate-50/50">
                          {(item as any).children.map((child: any) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={onClose}
                              className="flex items-center py-3 pl-8 pr-4 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={(item as any).href}
                      onClick={onClose}
                      className="flex items-center px-4 py-3 text-sm font-semibold rounded-lg text-slate-700 hover:bg-slate-50 transition-all"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer with Contact - SĂ APARĂ CA LA SHOPPRINT */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <a
              href="https://wa.me/40750473111"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 py-3 bg-[#25D366] text-white rounded-xl font-bold text-sm shadow-lg shadow-green-100 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.29-4.143c1.559.925 3.31 1.411 5.099 1.412 5.484 0 9.947-4.463 9.949-9.947 0-2.659-1.036-5.158-2.915-7.038-1.88-1.88-4.379-2.915-7.037-2.915-5.485 0-9.95 4.463-9.952 9.948-.001 1.932.553 3.82 1.605 5.421l-.992 3.626 3.71-.973zm11.334-6.203c-.308-.154-1.822-.899-2.104-.1002-.284-.102-.488-.254-.718-.102-.232.152-.916.899-1.123 1.144-.207.244-.414.275-.722.121-.308-.154-1.301-.48-2.479-1.531-.917-.818-1.536-1.83-1.715-2.138-.179-.308-.019-.475.135-.628.14-.138.308-.359.461-.538.154-.179.206-.308.308-.513.102-.206.051-.385-.026-.538-.077-.154-.718-1.731-.984-2.372-.259-.623-.524-.538-.722-.548-.198-.011-.424-.013-.651-.013-.226 0-.594.085-.904.424-.309.339-1.183 1.157-1.183 2.822 0 1.666 1.213 3.273 1.383 3.498.17.226 2.387 3.646 5.783 5.11 3.396 1.464 3.396.976 4.013.917.617-.06 1.822-.744 2.08-.1426.258-.702.258-1.303.181-1.426-.077-.123-.284-.198-.592-.352z" />
              </svg>
              WhatsApp Contact
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

const HeaderActions = () => {
  // 2. Nu mai avem nevoie de useCart aici, CartWidget se ocupă de logică
  const { data: session } = useSession();
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  // Închide dropdown-ul când se face click în afară
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      // Verificăm dacă click-ul este în afara dropdown-ului
      // DAR nu pe un link din dropdown (pentru a permite navigarea)
      if (isAccountOpen && !target.closest('.account-dropdown')) {
        setIsAccountOpen(false);
      }
    };

    if (isAccountOpen) {
      // Folosim capture phase pentru a prinde evenimentul înainte
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isAccountOpen]);

  return (
    <div className="flex items-center gap-4">
      {/* WhatsApp Support Link */}
      <a
        href="https://wa.me/40750473111"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 text-zinc-400 hover:text-[#25D366] transition-colors hidden sm:flex items-center gap-2"
      >
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.29-4.143c1.559.925 3.31 1.411 5.099 1.412 5.484 0 9.947-4.463 9.949-9.947 0-2.659-1.036-5.158-2.915-7.038-1.88-1.88-4.379-2.915-7.037-2.915-5.485 0-9.95 4.463-9.952 9.948-.001 1.932.553 3.82 1.605 5.421l-.992 3.626 3.71-.973zm11.334-6.203c-.308-.154-1.822-.899-2.104-.1002-.284-.102-.488-.254-.718-.102-.232.152-.916.899-1.123 1.144-.207.244-.414.275-.722.121-.308-.154-1.301-.48-2.479-1.531-.917-.818-1.536-1.83-1.715-2.138-.179-.308-.019-.475.135-.628.14-.138.308-.359.461-.538.154-.179.206-.308.308-.513.102-.206.051-.385-.026-.538-.077-.154-.718-1.731-.984-2.372-.259-.623-.524-.538-.722-.548-.198-.011-.424-.013-.651-.013-.226 0-.594.085-.904.424-.309.339-1.183 1.157-1.183 2.822 0 1.666 1.213 3.273 1.383 3.498.17.226 2.387 3.646 5.783 5.11 3.396 1.464 3.396.976 4.013.917.617-.06 1.822-.744 2.08-.1426.258-.702.258-1.303.181-1.426-.077-.123-.284-.198-.592-.352z" />
        </svg>
        <span className="text-xs font-bold uppercase tracking-tight">0750 473 111</span>
      </a>

      {/* Account Dropdown */}
      {session?.user ? (
        <div className="relative account-dropdown">
          <button
            className="flex items-center gap-2 px-3 py-2 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95"
            aria-label="Cont"
            onClick={() => setIsAccountOpen(!isAccountOpen)}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-black shadow-lg">
              {(session.user.name?.[0] || session.user.email?.[0] || "U").toUpperCase()}
            </div>
            <div className="hidden lg:block text-left mr-1">
              <p className="text-[10px] uppercase tracking-widest font-black text-zinc-400 leading-none mb-1">Contul meu</p>
              <p className="text-sm font-bold text-slate-900 dark:text-zinc-200 leading-none truncate max-w-[100px]">
                {session?.user?.name?.split(' ')[0] || 'Client'}
              </p>
            </div>
            <ChevronDown size={14} className={`text-zinc-400 transition-transform duration-300 ${isAccountOpen ? 'rotate-180 text-indigo-500' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          <div className={`absolute top-full right-0 w-64 pt-2 transition-all duration-200 ease-out z-60 ${isAccountOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'
            }`}>
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden ring-1 ring-black/5">
              {/* User Header */}
              <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 bg-gradient-to-br from-zinc-50/50 to-white dark:from-zinc-800/30 dark:to-zinc-900">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-indigo-500/20 shadow-xl">
                    {(session.user.name?.[0] || session.user.email?.[0] || "U").toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-black text-zinc-900 dark:text-white truncate uppercase tracking-tighter leading-none mb-1">
                      {session.user.name || 'Utilizator'}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate font-medium">
                      {session.user.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-2 space-y-0.5">
                <div className="px-3 pt-2 pb-1 text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Activitate</div>

                <Link
                  href="/account?tab=orders"
                  onClick={() => setIsAccountOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Package size={16} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  Comenzile mele
                </Link>

                <Link
                  href="/account?tab=favorites"
                  onClick={() => setIsAccountOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-rose-600 dark:hover:text-rose-400 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Heart size={16} className="text-rose-600 dark:text-rose-400" />
                  </div>
                  Favorite
                </Link>

                <div className="px-3 pt-4 pb-1 text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Setări Cont</div>

                <Link
                  href="/account"
                  onClick={() => setIsAccountOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <User size={16} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  Profilul meu
                </Link>

                <Link
                  href="/account?tab=addresses"
                  onClick={() => setIsAccountOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MapPin size={16} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  Adrese livrare
                </Link>
              </div>

              <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 mt-1 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-white bg-zinc-900 hover:bg-red-600 transition-all shadow-lg active:scale-95"
                >
                  <LogOut size={16} />
                  Delogare
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Link href="/login" className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all shadow-md active:scale-95" aria-label="Cont">
          <User size={20} />
          <span className="hidden sm:inline font-bold">Login</span>
        </Link>
      )}

      {/* 3. AICI AM ÎNLOCUIT VECHIUL LINK CU COMPONENTA NOUĂ */}
      <CartWidget />
    </div>
  );
};

export default function Header() {
  // FORCE RELOAD - iconițele și logo-ul TREBUIE să fie vizibile
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-500 ${scrolled
          ? "bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5 shadow-premium"
          : "bg-white dark:bg-black border-b border-transparent"
          }`}
        style={{ pointerEvents: 'auto', isolation: 'isolate' }}
      >
        {/* PRIMUL RÂND: Logo, Căutare, Cont + Coș */}
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800">
          {/* Left: Mobile Toggle & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-900"
              aria-label="Deschide meniul"
            >
              <Menu size={28} />
            </button>
            <Link href="/" className="flex items-center group">
              <img
                src="/logo.png"
                alt={siteConfig.name}
                className="h-10 max-h-10 w-auto max-w-[140px] object-contain"
              />
            </Link>
          </div>

          {/* Center: Branding / Tagline or Empty */}


          {/* Right: Actions */}
          <HeaderActions />
        </div>

        {/* AL DOILEA RÂND: Meniu de navigare */}
        <div className="hidden lg:block border-b border-zinc-100 dark:border-zinc-800">
          <div className="container mx-auto px-4 sm:px-6">
            <DesktopNav />
          </div>
        </div>
      </header>

      <MobileNav isOpen={isMobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}