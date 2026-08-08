import React from 'react';

export const metadata = {
    title: "Termeni și condiții",
    description: "Vezi termenii și condițiile de utilizare și procesare comenzi pe Tablou.net.",
};

export default function TermeniPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-gray-100 px-4 pb-12 pt-28">
            <div className="max-w-3xl mx-auto rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow p-8">
                <h1 className="text-3xl font-bold mb-6">Termeni și Condiții Generale de Vânzare</h1>
                <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg border border-red-200 dark:border-red-800 mb-6">
                    <p className="text-lg text-red-800 dark:text-red-300 font-semibold mb-2">
                        Document legal conform: <strong>OUG 34/2014</strong> (drepturile consumatorilor), <strong>Legea 449/2003</strong> (vânzarea de bunuri de consum), <strong>Codul Civil</strong> român.
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-400">
                        <strong>Operator economic:</strong> CULOAREA DIN VIATA SA SRL | <strong>CUI:</strong> 44820819 | <strong>J20/1108/2021</strong><br />
                        <strong>Sediul:</strong> Sat Topliceni, Buzău, România | <strong>Autorizare ONRC:</strong> Validă
                    </p>
                </div>

                <h2 className="text-xl font-semibold mt-6 mb-2">1. Informații generale</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Tablou.net este o platformă online care oferă servicii de tipar digital și producție publicitară. Prețurile afișate includ TVA, iar comenzile sunt procesate doar după confirmarea plății sau acceptarea comenzii.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">2. Comenzi și livrare</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Termenul standard de livrare este 24–48h din momentul confirmării comenzii. Livrarea se face prin DPD România. Tablou.net nu este responsabil pentru întârzierile datorate firmelor de curierat.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">3. Plată și facturare</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Plata se poate efectua online (card bancar), prin ordin de plată sau ramburs. Facturile sunt emise automat pe baza datelor furnizate de client.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">4. Drepturi de autor</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Clientul este responsabil de drepturile asupra imaginilor, textelor sau designului încărcat pentru tipar. Tablou.net nu își asumă răspunderea pentru conținutul trimis de client.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">5. Drepturi Consumatori (OUG 34/2014)</h2>
                <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-800 mb-4">
                    <p className="text-green-900 dark:text-green-300"><strong>Drept de retragere (14 zile):</strong></p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-green-800 dark:text-green-400">
                        <li><strong>Produse standard:</strong> Drept de retragere 14 zile calendaristice fără penalități</li>
                        <li><strong>EXCEPȚIE - Produse personalizate:</strong> Art. 16(c) OUG 34/2014 - Nu beneficiază de dreptul de retragere (realizate după specificațiile consumatorului)</li>
                        <li><strong>Procedura:</strong> Notificare prin email la contact@Tablou.net cu formularul de retragere</li>
                        <li><strong>Costuri returnare:</strong> Suportate de consumator, cu excepția produselor defecte</li>
                    </ul>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800 mb-4">
                    <p className="text-emerald-900 dark:text-emerald-300"><strong>Garanția de conformitate (24 luni - Legea 449/2003):</strong></p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-emerald-800 dark:text-emerald-400">
                        <li>Reclamații calitate: <strong>Maximum 48h</strong> de la primire (cu fotografii)</li>
                        <li>Defecte aparente: Notificare imediată la contact@Tablou.net</li>
                        <li>Remedii: Reparație, înlocuire, reducere preț, rezoluțiunea contractului</li>
                        <li>Garanție comercială suplimentară: 6 luni pentru defecte de imprimare</li>
                    </ul>
                </div>

                <h2 className="text-xl font-semibold mt-6 mb-2">6. Comunicare și Suport (AI & WhatsApp)</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Prin acceptarea acestor termeni, sunteți de acord ca Tablou.net să vă contacteze prin e-mail, SMS sau aplicații de mesagerie (WhatsApp) pentru notificări legate de comandă.
                </p>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                    De asemenea, luați la cunoștință că serviciul nostru de suport poate utiliza asistenți virtuali (AI) pentru a răspunde solicitărilor dvs. în timp real. Deși depunem toate eforturile pentru acuratețea informațiilor, răspunsurile generate de AI pot conține uneori erori. Vă recomandăm să verificați informațiile critice cu un operator uman.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">7. Soluționarea Litigiilor și Jurisdicția</h2>
                <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-4">
                    <p className="text-yellow-900 dark:text-yellow-300"><strong>Soluționarea alternativă a litigiilor (SAL):</strong></p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-yellow-800 dark:text-yellow-400">
                        <li><strong>ANPC SAL:</strong> <a href="https://anpc.ro/ce-este-sal/" target="_blank" className="underline">anpc.ro/ce-este-sal</a></li>
                        <li><strong>Platforma SOL (UE):</strong> <a href="https://consumer-redress.ec.europa.eu/index_ro" target="_blank" className="underline">ec.europa.eu/consumers/redress</a></li>
                        <li><strong>Mediere comercială:</strong> Camera de Comerț București</li>
                        <li><strong>Jurisdicția:</strong> Instanțele române, legea română aplicabilă</li>
                        <li><strong>Consumatori UE:</strong> Pot alege jurisdicția țării de reședință</li>
                    </ul>
                </div>

                <h2 className="text-xl font-semibold mt-6 mb-2">8. Contact și Informații Legale</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <p><strong>Contact comercial:</strong></p>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                            Email: <a href="mailto:contact@Tablou.net" className="text-emerald-600 underline">contact@Tablou.net</a><br />
                            Tel: <a href="tel:0750473111" className="text-emerald-600 underline">0750 473 111</a><br />
                            Program: L–V 9:00–18:00<br />
                            WhatsApp: Disponibil pe site
                        </p>
                    </div>
                    <div>
                        <p><strong>Contact legal/reclamații:</strong></p>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                            Email: contact@Tablou.net<br />
                            Returns: contact@Tablou.net<br />
                            DPO: contact@Tablou.net<br />
                            Adresa: Jud. Buzău, Sat Topliceni, Com. Topliceni, G Topliceni, nr. 214
                        </p>
                    </div>
                </div>

                <div className="mt-8 border-t dark:border-slate-700 pt-6">
                    <p className="text-xs text-slate-500 text-center mb-4">
                        <strong>Document actualizat:</strong> 23.12.2025 |
                        <strong>Versiunea:</strong> 3.1 |
                        <strong>Conformitate:</strong> OUG 34/2014, Legea 449/2003, GDPR, Codul Civil român
                    </p>
                    <div className="text-center">
                        <a href="/" className="inline-block px-6 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow transition transform hover:-translate-y-0.5">Înapoi la prima pagină</a>
                    </div>
                </div>
            </div>
        </main>
    );
}

