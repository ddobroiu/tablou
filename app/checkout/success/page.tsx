import Link from "next/link";
import Stripe from "stripe";
import { getOrderNoByStripeSession } from "@/lib/orderStore";
import ConversionTracker from "@/components/ConversionTracker";
import {
    BANK_TRANSFER_BENEFICIARY,
    BANK_TRANSFER_BANK_NAME,
    BANK_TRANSFER_IBAN,
} from "@/lib/paymentRules";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = {
    title: "Comandă Finalizată",
    robots: { index: false, follow: false },
};

type PageProps = {
    searchParams: Promise<{ session_id?: string; o?: string; pm?: string }>;
};

export default async function SuccessPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const sessionId = params?.session_id;
    const qsOrder = params?.o;
    const paymentMethod = params?.pm; // 'OP', 'Ramburs', 'Card'

    let orderNo: string | number | null = qsOrder || null;
    let paymentStatus: string | null = null;

    if (!orderNo && sessionId) {
        try {
            const looked = await getOrderNoByStripeSession(sessionId);
            if (looked) orderNo = looked;
        } catch { }
    }

    if (sessionId && process.env.STRIPE_SECRET_KEY) {
        try {
            const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
            const session = await stripe.checkout.sessions.retrieve(sessionId);
            paymentStatus = session.payment_status === 'paid' ? 'Plătit' :
                session.payment_status === 'unpaid' ? 'Neplătit' :
                    session.payment_status === 'no_payment_required' ? 'Fără plată' : 'În curs';
        } catch { }
    }

    // fallback labels
    if (!paymentStatus) {
        if (paymentMethod === 'OP') paymentStatus = 'Așteptare transfer';
        else if (paymentMethod === 'Ramburs') paymentStatus = 'Plată la livrare';
        else if (sessionId) paymentStatus = 'Verificare...';
    }

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 sm:pt-32 pb-12 flex items-center justify-center px-4">
            <ConversionTracker orderNo={orderNo} />
            <div className="max-w-2xl w-full">
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-2xl shadow-emerald-500/5 text-center relative overflow-hidden">
                    {/* Background accent */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-emerald-500"></div>

                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8 transform rotate-3 shadow-inner">
                        <svg className="w-10 h-10 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight italic">Comanda ta este pe drum!</h1>
                    <p className="text-slate-600 dark:text-slate-400 mb-10 max-w-md mx-auto font-medium">
                        Îți mulțumim pentru încredere. Am început deja să pregătim produsele tale pentru producție.
                    </p>

                    {/* Order Details Card */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 transition-all hover:border-emerald-500/30">
                            <div className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Număr Comandă</div>
                            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                                #{orderNo || (sessionId ? 'se alocă...' : '—')}
                            </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 transition-all hover:border-emerald-500/30">
                            <div className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Status Plată</div>
                            <div className={`text-xl font-bold ${paymentStatus === 'Plătit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200'}`}>
                                {paymentStatus || 'Confirmată'}
                            </div>
                        </div>
                    </div>

                    {/* Bank Transfer Details (if OP) */}
                    {paymentMethod === 'OP' && (
                        <div className="mb-10 text-left bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl p-6 sm:p-8">
                            <h3 className="text-emerald-900 dark:text-emerald-300 font-black text-lg mb-4 flex items-center gap-2">
                                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                Detalii Transfer Bancar
                            </h3>
                            <div className="space-y-4 text-sm font-medium">
                                <div className="flex justify-between items-center border-b border-emerald-200/30 pb-3">
                                    <span className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">Beneficiar</span>
                                    <span className="text-slate-900 dark:text-white font-black text-right">{BANK_TRANSFER_BENEFICIARY}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-emerald-200/30 pb-3">
                                    <span className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">Banca</span>
                                    <span className="text-slate-900 dark:text-white font-black">{BANK_TRANSFER_BANK_NAME}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-emerald-200/30 pb-3">
                                    <span className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">IBAN (RON)</span>
                                    <span className="text-emerald-600 dark:text-emerald-400 font-black text-xs sm:text-sm select-all">{BANK_TRANSFER_IBAN}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">Referință</span>
                                    <span className="px-3 py-1 bg-white dark:bg-slate-800 rounded-lg text-emerald-600 dark:text-emerald-300 font-black border border-emerald-200/50">Comanda #{orderNo || '...'}</span>
                                </div>
                            </div>
                            <p className="mt-6 text-xs text-emerald-800/60 dark:text-emerald-400/60 text-center font-bold">
                                * Te rugăm să trimiți dovada plății la contact@Tablou.net pentru procesare imediată.
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/" className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition shadow-xl shadow-slate-900/10 dark:shadow-white/5">
                            Prima pagină
                        </Link>
                        <Link href="/account?tab=orders" className="px-10 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                            Contul meu
                        </Link>
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <span>© {new Date().getFullYear()} Tablou.net</span>
                        <div className="flex gap-4">
                            <span className="text-emerald-500">Securizat SSL</span>
                            <span>Suport 24/7</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

