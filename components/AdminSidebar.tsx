"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    ShoppingCart,
    Users,
    LogOut,
    ArrowLeft,
    Menu,
    X,
    FileText,
    MessageSquare,
    Receipt
} from "lucide-react";

const menuItems = [
    { href: "/admin/orders", label: "Comenzi", icon: ShoppingCart, disabled: false },
    { href: "/admin/editare", label: "Editare", icon: FileText, disabled: false },
    // { href: "/admin/offers", label: "Oferte", icon: Receipt, disabled: true },
    // { href: "/admin/users", label: "Clienți", icon: Users, disabled: true },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-50 p-3 bg-zinc-900/90 backdrop-blur-md border border-white/10 rounded-xl text-white lg:hidden shadow-xl min-w-11 min-h-11 flex items-center justify-center touch-manipulation active:scale-95 transition-transform"
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside
                className={`fixed top-0 left-0 h-full w-[280px] sm:w-72 bg-[#09090b]/95 backdrop-blur-xl border-r border-white/10 z-50 transition-transform duration-300 ease-out lg:translate-x-0 safe-area-inset-left ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex flex-col h-full p-4 sm:p-6 pb-safe">
                    <div className="mb-10 px-2 flex items-center gap-3">
                        <div className="relative w-40 h-12 bg-white/5 rounded-lg p-1">
                            <Image
                                src="/logo.png"
                                alt="Tablou Admin"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>

                    <nav className="flex-1 space-y-2 overflow-y-auto">
                        {menuItems.map((item) => {
                            const isActive = pathname.startsWith(item.href);
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.label}
                                    href={item.disabled ? "#" : item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 min-h-12 touch-manipulation ${item.disabled
                                        ? "opacity-40 cursor-not-allowed text-zinc-500 hover:bg-transparent"
                                        : isActive
                                            ? "bg-green-600 text-white shadow-lg shadow-green-900/40"
                                            : "text-zinc-400 hover:text-white hover:bg-white/5 active:bg-white/10"
                                        }`}
                                >
                                    <Icon size={18} className={isActive ? "text-white" : "text-zinc-500 group-hover:text-green-400 transition-colors"} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-auto pt-4 sm:pt-6 border-t border-white/5 space-y-2">
                        <Link
                            href="/"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all group min-h-12 touch-manipulation active:bg-white/10"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            Înapoi la Site
                        </Link>

                        <div className="w-full px-4 py-1">
                            <form action="/api/auth/signout" method="POST">
                                <button
                                    type="submit"
                                    className="w-full flex items-center gap-3 text-sm font-medium text-red-400 hover:text-red-300 transition-colors text-left min-h-10 touch-manipulation"
                                >
                                    <LogOut size={18} />
                                    Delogare
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
