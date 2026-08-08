"use client";

import { useState } from "react";
import Link from "next/link";

interface BillingOrder {
    id: string;
    orderNo: number;
    total: number | string;
    createdAt: string;
    invoiceLink?: string | null;
    status: string;
    billing?: {
        company?: string;
        cui?: string;
        regCom?: string;
    };
    items?: Array<{
        name: string;
        qty: number;
    }>;
}

interface BillingSectionProps {
    orders: BillingOrder[];
}

export default function BillingSection({ orders }: BillingSectionProps) {
    const [filter, setFilter] = useState<"all" | "invoiced" | "pending">("all");

    const filteredOrders = orders.filter(order => {
        if (filter === "invoiced") return order.invoiceLink;
        if (filter === "pending") return !order.invoiceLink && order.status !== "canceled";
        return true;
    });

    const stats = {
        totalInvoiced: orders.filter(o => o.invoiceLink).length,
        totalPending: orders.filter(o => !o.invoiceLink && o.status !== "canceled").length,
        totalAmount: orders.reduce((sum, o) => sum + (typeof o.total === 'number' ? o.total : parseFloat(o.total?.toString() || '0')), 0),
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-emerald-200 dark:border-emerald-700">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalInvoiced}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Facturi emise</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-amber-200 dark:border-amber-700">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalPending}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">În așteptare</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-green-200 dark:border-green-700">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">
                                {new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(stats.totalAmount)}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total facturat</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${filter === "all" ? "bg-emerald-600 text-white shadow-lg" : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"}`}>Toate</button>
                <button onClick={() => setFilter("invoiced")} className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${filter === "invoiced" ? "bg-emerald-600 text-white shadow-lg" : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"}`}>Cu factură</button>
                <button onClick={() => setFilter("pending")} className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${filter === "pending" ? "bg-emerald-600 text-white shadow-lg" : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"}`}>Fără factură</button>
            </div>

            <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
                        <p className="text-gray-500 dark:text-gray-400">Nu există facturi pentru acest filtru</p>
                    </div>
                ) : (
                    filteredOrders.map((order) => (
                        <div key={order.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-lg font-bold text-slate-900 dark:text-white">Comandă #{order.orderNo}</span>
                                        {order.invoiceLink ? <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">Facturată</span> : <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">Fără factură</span>}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">{new Date(order.createdAt).toLocaleDateString('ro-RO')}</div>
                                </div>
                                <div className="flex gap-2">
                                    {order.invoiceLink ? (
                                        <a href={order.invoiceLink} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-emerald-600 text-white rounded-xl">Descarcă factură</a>
                                    ) : <div className="px-4 py-2 bg-gray-100 text-gray-500 rounded-xl text-sm">Factură indisponibilă</div>}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

