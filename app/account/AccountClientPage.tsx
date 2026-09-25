"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { CreditCard, Heart, LogOut, MapPin, Package, Plus, Receipt, Shield, ShoppingBag, User, Wallet, Clock } from "lucide-react";
import AccountOrdersList from "@/components/AccountOrdersList";
import BillingSection from "@/components/BillingSection";
import AddressesManager from "@/components/AddressesManager";
import PaymentMethodsManager from "@/components/PaymentMethodsManager";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import AccountDetailsForm from "@/components/AccountDetailsForm";
import FavoritesManager from "@/components/FavoritesManager";

type Tab = "profile" | "orders" | "billing" | "addresses" | "payment-methods" | "favorites" | "security";

const NAV: { id: Tab; label: string; icon: typeof User; hint: string }[] = [
    { id: "orders", label: "Comenzile mele", icon: Package, hint: "Stare, AWB, facturi" },
    { id: "billing", label: "Facturi", icon: Receipt, hint: "Descarcă facturile" },
    { id: "addresses", label: "Adrese", icon: MapPin, hint: "Livrare și facturare" },
    { id: "favorites", label: "Favorite", icon: Heart, hint: "Produse salvate" },
    { id: "payment-methods", label: "Plată", icon: CreditCard, hint: "Metode salvate" },
    { id: "profile", label: "Profil", icon: User, hint: "Nume, telefon" },
    { id: "security", label: "Securitate", icon: Shield, hint: "Parolă" },
];
const TABS = NAV.map((n) => n.id);

interface AccountClientPageProps {
    orders?: any[];
}

const fmtRON = (n: number) => new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON", maximumFractionDigits: 0 }).format(n);

export default function AccountClientPage({ orders = [] }: AccountClientPageProps) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    // Clientul vine de obicei pentru comenzi: le aratam primele cand exista
    const [tab, setTab] = useState<Tab>(orders.length > 0 ? "orders" : "profile");

    useEffect(() => {
        if (status === "unauthenticated") router.push("/login");
    }, [status, router]);

    useEffect(() => {
        const t = searchParams.get("tab") as Tab | null;
        if (t && TABS.includes(t)) setTab(t);
    }, [searchParams]);

    const go = (t: Tab) => {
        setTab(t);
        const url = new URL(window.location.href);
        url.searchParams.set("tab", t);
        window.history.pushState({}, "", url);
    };

    if (status === "loading") {
        return <div className="mx-auto max-w-6xl px-4 pb-16 pt-28 text-center text-slate-500">Se încarcă contul…</div>;
    }
    if (!session) return null;

    const name = session.user?.name || session.user?.email?.split("@")[0] || "Client";
    const active = orders.filter((o: any) => ["pending", "active", "processing", "in_progress"].includes(o.status || "")).length;
    const spent = orders.filter((o: any) => o.status !== "canceled").reduce((s: number, o: any) => s + (o.total || 0), 0);
    const current = NAV.find((n) => n.id === tab)!;

    return (
        <div className="min-h-screen bg-slate-50 pb-16 pt-24 sm:pt-28">
            <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6">
                {/* Antet: salut, cifre, comanda noua */}
                <section className="overflow-hidden rounded-3xl bg-slate-900 text-white">
                    <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-4">
                            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-xl font-bold">
                                {name.charAt(0).toUpperCase()}
                            </span>
                            <div className="min-w-0">
                                <h1 className="truncate text-2xl font-bold sm:text-3xl">Bună, {name}!</h1>
                                <p className="truncate text-sm text-slate-400">{session.user?.email}</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Link href="/configuratoare" className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-400">
                                <Plus size={16} /> Comandă nouă
                            </Link>
                            <button onClick={() => signOut({ callbackUrl: "/" })} className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/15">
                                <LogOut size={16} /> Ieși din cont
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10">
                        {[
                            { icon: ShoppingBag, label: "Comenzi", value: String(orders.length) },
                            { icon: Clock, label: "În lucru", value: String(active) },
                            { icon: Wallet, label: "Total", value: fmtRON(spent) },
                        ].map((s) => (
                            <div key={s.label} className="flex flex-col items-center gap-1 px-2 py-4 text-center sm:flex-row sm:justify-center sm:gap-3">
                                <s.icon size={18} className="text-emerald-400" />
                                <span className="text-lg font-bold tabular-nums sm:text-xl">{s.value}</span>
                                <span className="text-xs text-slate-400">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
                    {/* Meniu: coloana pe desktop, benzi care se deruleaza pe telefon */}
                    <nav aria-label="Contul meu" className="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:overflow-visible lg:px-0">
                        <ul className="flex gap-2 lg:sticky lg:top-28 lg:flex-col lg:gap-1">
                            {NAV.map((n) => {
                                const on = n.id === tab;
                                return (
                                    <li key={n.id} className="shrink-0">
                                        <button
                                            onClick={() => go(n.id)}
                                            aria-current={on ? "page" : undefined}
                                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition lg:py-3 ${on
                                                ? "bg-white font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200"
                                                : "text-slate-600 hover:bg-white hover:text-slate-900"
                                                }`}
                                        >
                                            <n.icon size={18} className={on ? "text-emerald-600" : "text-slate-400"} />
                                            <span className="whitespace-nowrap">{n.label}</span>
                                            {n.id === "orders" && orders.length > 0 && (
                                                <span className="ml-auto hidden rounded-full bg-slate-100 px-2 text-xs text-slate-600 lg:inline">{orders.length}</span>
                                            )}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Continutul sectiunii */}
                    <main className="min-w-0 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-8">
                        <header className="mb-6">
                            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{current.label}</h2>
                            <p className="text-sm text-slate-500">{current.hint}</p>
                        </header>
                        {tab === "orders" && <AccountOrdersList orders={orders} />}
                        {tab === "billing" && <BillingSection orders={orders} />}
                        {tab === "addresses" && <AddressesManager />}
                        {tab === "favorites" && <FavoritesManager />}
                        {tab === "payment-methods" && <PaymentMethodsManager />}
                        {tab === "profile" && <AccountDetailsForm />}
                        {tab === "security" && <ChangePasswordForm />}
                    </main>
                </div>
            </div>
        </div>
    );
}
