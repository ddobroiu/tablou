"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, User, Menu } from "lucide-react";
import { useCart } from "@/components/CartContext";

const MobileBottomNav = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const pathname = usePathname();
  const { items } = useCart();
  
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Don't show on admin or checkout pages to avoid clutter
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/checkout")) {
    return null;
  }

  const navItems = [
    {
      label: "Acasă",
      href: "/",
      icon: Home,
    },
    {
      label: "Categorii",
      href: "#",
      icon: ShoppingBag,
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        onMenuClick();
      }
    },
    {
      label: "Coș",
      href: "/cart",
      icon: ShoppingBag,
      badge: cartCount,
    },
    {
      label: "Cont",
      href: "/account",
      icon: User,
    },
  ];

  return (
    <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-[420px] z-[990]">
      <nav className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] px-6 py-3.5">
        <ul className="flex items-center justify-between gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            const Content = (
              <div className="flex flex-col items-center gap-1 group active:scale-95 transition-all">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 relative ${
                    isActive
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-110"
                      : "text-slate-400 hover:bg-white/5"
                  }`}
                >
                  <Icon size={22} strokeWidth={isActive ? 3 : 2.5} />
                  {(item.badge ?? 0) > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-900 animate-in zoom-in duration-300">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[9px] font-black uppercase tracking-[0.05em] transition-colors duration-300 ${
                    isActive ? "text-white" : "text-slate-500"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            );

            return (
              <li key={item.label} className="relative flex-1">
                {item.onClick ? (
                  <button onClick={item.onClick} className="w-full">
                    {Content}
                  </button>
                ) : (
                  <Link href={item.href} className="w-full">
                    {Content}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default MobileBottomNav;
