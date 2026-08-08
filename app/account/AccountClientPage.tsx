"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import SignOutButton from "@/components/SignOutButton";
import AccountOrdersList from "@/components/AccountOrdersList";
import AccountNavTab from "@/components/AccountNavTab";
import BillingSection from "@/components/BillingSection";
import AddressesManager from "@/components/AddressesManager";
import PaymentMethodsManager from "@/components/PaymentMethodsManager";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import AccountDetailsForm from "@/components/AccountDetailsForm";
import FavoritesManager from "@/components/FavoritesManager";

interface AccountClientPageProps {
    orders?: any[];
    billing?: any;
}

export default function AccountClientPage({ orders = [] }: AccountClientPageProps) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [tab, setTab] = useState<'profile' | 'orders' | 'billing' | 'addresses' | 'payment-methods' | 'favorites' | 'security'>('profile');

    useEffect(() => {
        if (status === "unauthenticated") router.push("/login");
    }, [status, router]);

    useEffect(() => {
        const tabParam = searchParams.get('tab');
        if (tabParam === 'orders') setTab('orders');
        else if (tabParam === 'profile') setTab('profile');
    }, [searchParams]);

    const handleTabChange = (newTab: 'profile' | 'orders' | 'billing' | 'addresses' | 'payment-methods' | 'favorites' | 'security') => {
        setTab(newTab);
        const url = new URL(window.location.href);
        url.searchParams.set('tab', newTab);
        window.history.pushState({}, '', url);
    };

    if (status === "loading") return <div className="p-10 text-center text-gray-600">Se încarcă...</div>;
    if (!session) return null;

    const stats = {
        totalOrders: orders.length,
        activeOrders: orders.filter((o: any) => ['active', 'processing', 'in_progress'].includes(o.status || '')).length,
        totalSpent: orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0),
    };

    return (
        <div className="min-h-screen bg-white py-4 sm:py-8 px-4 pt-24 sm:pt-28">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="md:w-16 md:h-16 w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 via-purple-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-xl">
                                {(session.user?.name?.[0] || session.user?.email?.[0] || "U").toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-black">
                                    Bun venit, {session.user?.name || "Client"}!
                                </h1>
                                <p className="text-sm sm:text-base text-gray-700 mt-1">
                                    <span className="font-semibold text-black">{session.user?.email}</span>
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            <div className="bg-white rounded-xl p-3 sm:p-4 border-2 border-gray-200 shadow-sm">
                                <p className="text-2xl font-bold text-black">{stats.totalOrders}</p>
                                <p className="text-xs text-gray-600">Comenzi totale</p>
                            </div>
                            <div className="bg-white rounded-xl p-3 sm:p-4 border-2 border-gray-200 shadow-sm">
                                <p className="text-2xl font-bold text-black">{stats.activeOrders}</p>
                                <p className="text-xs text-gray-600">În progres</p>
                            </div>
                            <div className="bg-white rounded-xl p-3 sm:p-4 border-2 border-gray-200 shadow-sm">
                                <p className="text-lg font-bold text-black">
                                    {new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(stats.totalSpent)}
                                </p>
                                <p className="text-xs text-gray-600">Total cheltuit</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <SignOutButton />
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    <aside className="w-full lg:w-72 shrink-0">
                        <AccountNavTab activeTab={tab} onTabChange={handleTabChange} />
                    </aside>

                    <main className="flex-1 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-lg border-2 border-gray-200">
                        {tab === 'profile' && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold">Profilul meu</h2>
                                <AccountDetailsForm />
                            </div>
                        )}

                        {tab === 'billing' && (
                            <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-bold text-black dark:text-white">Facturi & Plăți</h2>
                                            <p className="text-gray-700 dark:text-gray-400">Istoric financiar și facturi descărcabile</p>
                                        </div>
                                    </div>
                                    <BillingSection orders={orders} />
                                </div>
                            </div>
                        )}

                        {tab === 'addresses' && (
                            <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-bold text-black dark:text-white">Adrese de livrare</h2>
                                            <p className="text-gray-700 dark:text-gray-400">Gestionează adresele tale de livrare</p>
                                        </div>
                                    </div>
                                    <AddressesManager />
                                </div>
                            </div>
                        )}

                        {tab === 'payment-methods' && (
                            <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
                                <PaymentMethodsManager />
                            </div>
                        )}

                        {tab === 'favorites' && (
                            <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
                                <FavoritesManager />
                            </div>
                        )}

                        {tab === 'security' && (
                            <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-bold text-black dark:text-white">Securitate</h2>
                                            <p className="text-gray-700 dark:text-gray-400">Gestionează setările de securitate ale contului</p>
                                        </div>
                                    </div>
                                    <ChangePasswordForm />
                                </div>
                            </div>
                        )}
                        {tab === 'orders' && (
                            <AccountOrdersList orders={orders} />
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

