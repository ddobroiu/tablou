// Pagina de dezabonare din emailurile automate. FIȘIER IDENTIC PE TOATE CELE 6 SITE-URI DE PRINT.
import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = { title: "Dezabonare", robots: { index: false, follow: false } };

export default async function Page({ searchParams }: { searchParams: Promise<{ id?: string; gata?: string }> }) {
    const { id, gata } = await searchParams;
    return (
        <main className="min-h-[60vh] flex items-center justify-center px-4 py-16">
            <div className="max-w-md w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                {gata === "1" ? (
                    <>
                        <h1 className="text-2xl font-bold text-slate-900">Te-ai dezabonat</h1>
                        <p className="mt-3 text-slate-600">Nu mai primești emailuri automate de la {siteConfig.name}. Emailurile despre comenzile tale (confirmare, factură, livrare) vin în continuare.</p>
                    </>
                ) : gata === "0" ? (
                    <>
                        <h1 className="text-2xl font-bold text-slate-900">Linkul nu mai e valabil</h1>
                        <p className="mt-3 text-slate-600">Scrie-ne la {siteConfig.email} și te scoatem din listă.</p>
                    </>
                ) : (
                    <form action="/api/mail/dezabonare" method="post">
                        <h1 className="text-2xl font-bold text-slate-900">Dezabonare</h1>
                        <p className="mt-3 text-slate-600">Nu mai vrei emailuri cu oferte și reamintiri de la {siteConfig.name}?</p>
                        <input type="hidden" name="id" value={id || ""} />
                        <button type="submit" className="mt-6 w-full rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800">
                            Da, dezabonează-mă
                        </button>
                    </form>
                )}
            </div>
        </main>
    );
}
