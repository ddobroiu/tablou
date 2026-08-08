import Link from "next/link";
import Stripe from "stripe";
import { getOrderNoByStripeSession } from "@/lib/orderStore";
import ConversionTracker from "@/components/ConversionTracker";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PageProps = {
    searchParams: Promise<{ session_id?: string }>;
};

// Helper pentru branding (similar cu cel din email)
function getBranding(source?: string | null) {
    const s = source?.toLowerCase() || '';
    if (s.includes('prynt.ro')) return { name: 'Prynt', home: 'https://www.prynt.ro' };
    if (s.includes('euprint.ro')) return { name: 'EuPrint', home: 'https://www.euprint.ro' };
    if (s.includes('adbanner.ro')) return { name: 'AdBanner', home: 'https://www.adbanner.ro' };
    if (s.includes('tablou.net')) return { name: 'Tablou', home: 'https://www.tablou.net' };
    if (s.includes('visionboard.ro')) return { name: 'VisionBoard', home: 'https://www.visionboard.ro' };
    return { name: 'Tablou', home: '/' };
}

export async function generateMetadata({ searchParams }: PageProps) {
    // Putem încerca să deducem, dar metadata e server-side static-ish. 
    // Totuși, pt un server component, putem face fetch.
    return {
        title: "Plată Reușită", // Fallback generic, greu de făcut dinamic perfect fără sesiune aici direct
        robots: { index: false, follow: false },
    };
}

export default async function StripeSuccessPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const sessionId = params?.session_id;

    let orderNo: string | number | null = null;
    let paymentStatus: string = "În curs de verificare...";
    let source: string | null = null;
    let branding = { name: 'Tablou', home: '/' };

    if (sessionId && process.env.STRIPE_SECRET_KEY) {
        try {
            const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
            const session = await stripe.checkout.sessions.retrieve(sessionId);

            paymentStatus = session.payment_status === 'paid' ? 'Plătit' :
                session.payment_status === 'unpaid' ? 'Neplătit' : 'În curs';

            source = session.metadata?.source || null;
            branding = getBranding(source);

            // Încercăm să luăm nr comenzii
            const looked = await getOrderNoByStripeSession(sessionId);
            if (looked) orderNo = looked;

        } catch (e) {
            console.error(e);
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 sm:pt-32 pb-12 flex items-center justify-center px-4">
            <ConversionTracker orderNo={orderNo} />
            <div className="max-w-2xl w-full">
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-2xl shadow-emerald-500/5 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-emerald-500"></div>

                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8 transform rotate-3 shadow-inner">
                        <svg className="w-10 h-10 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight italic">Plată realizată cu succes!</h1>
                    <p className="text-slate-600 dark:text-slate-400 mb-10 max-w-md mx-auto font-medium">
                        Îți mulțumim pentru plată. Comanda ta a intrat în rândul pentru producție {branding.name !== 'Tablou' ? `la ${branding.name} ` : ''}și va fi expediată în cel mai scurt timp.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl p-5">
                            <div className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Nr. Comandă</div>
                            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                                #{orderNo || 'se alocă...'}
                            </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl p-5">
                            <div className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Status Plată</div>
                            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                                {paymentStatus}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href={branding.home} className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition shadow-xl shadow-slate-900/10 dark:shadow-white/5">
                            Înapoi pe {branding.name}
                        </a>
                        <Link href="/account?tab=orders" className="px-10 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                            Contul meu
                        </Link>
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <span>© {new Date().getFullYear()} {branding.name}.ro</span>
                        <div className="flex gap-4">
                            <span className="text-emerald-500">Securizat Stripe</span>
                            <span>Procesare Rapidă</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

