
import Link from "next/link";
import { ArrowRight, Home, LayoutGrid, Printer, Image as ImageIcon, FileText, Sparkles } from "lucide-react";

export default function NotFound() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 pt-32 pb-20 overflow-hidden relative">
            {/* Background Decorations */}
            <div className="absolute top-1/4 -right-20 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

            <div className="max-w-4xl w-full relative z-10 text-center">
                <div className="mb-8 relative inline-block">
                    <h1 className="text-[180px] md:text-[240px] font-black leading-none tracking-tighter text-slate-900/5 dark:text-white/5 select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-8 rounded-[40px] shadow-2xl transform -rotate-2">
                            <Sparkles size={48} className="text-emerald-600 mb-4 mx-auto animate-bounce" />
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Pagina nu a fost găsită</h2>
                            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto text-sm font-medium">
                                Se pare că linkul accesat nu mai există sau a fost mutat într-o locație nouă.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-12">
                    <p className="text-slate-900 dark:text-white font-black uppercase tracking-widest text-xs mb-8">Continuă explorarea cu un configurator:</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
                        <Link href="/configurator/banner" className="group bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all hover:shadow-xl hover:-translate-y-1">
                            <Printer className="text-emerald-600 mb-3 group-hover:scale-110 transition-transform" />
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Banner PVC</h3>
                            <p className="text-[10px] text-slate-500">Publicitate outdoor</p>
                        </Link>

                        <Link href="/configurator/canvas" className="group bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-purple-500 transition-all hover:shadow-xl hover:-translate-y-1">
                            <ImageIcon className="text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Tablouri Canvas</h3>
                            <p className="text-[10px] text-slate-500">Decor personalizat</p>
                        </Link>

                        <Link href="/configurator/fonduri-eu" className="group bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all hover:shadow-xl hover:-translate-y-1">
                            <Sparkles className="text-emerald-600 mb-3 group-hover:scale-110 transition-transform" />
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Fonduri UE</h3>
                            <p className="text-[10px] text-slate-500">Kituri vizibilitate</p>
                        </Link>

                        <Link href="/configurator/autocolante" className="group bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 transition-all hover:shadow-xl hover:-translate-y-1">
                            <LayoutGrid className="text-amber-600 mb-3 group-hover:scale-110 transition-transform" />
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Autocolante</h3>
                            <p className="text-[10px] text-slate-500">Orice formă/mărime</p>
                        </Link>
                    </div>

                    <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/" className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all">
                            <Home size={18} /> Acasă
                        </Link>
                        <Link href="/shop" className="flex items-center gap-2 bg-white border border-slate-200 text-slate-900 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all">
                            Vezi tot catalogul <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

