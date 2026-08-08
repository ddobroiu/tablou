import React from 'react';

export const metadata = {
    title: "Politica de Cookies",
    description: "Află cum folosim cookies pe site-ul Tablou.net, inclusiv pentru Chat AI și WhatsApp, pentru o experiență optimă.",
};

export default function PoliticaCookiesPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-gray-100 px-4 pb-12 pt-28">
            <div className="max-w-3xl mx-auto rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow p-8">
                <h1 className="text-3xl font-bold mb-6">Politica de Cookies și Tehnologii de Urmărire</h1>
                <div className="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800 mb-6">
                    <p className="text-lg text-emerald-800 dark:text-emerald-300 font-semibold mb-2">
                        Conformitate legală: <strong>ePrivacy Directive 2002/58/EC</strong>, <strong>GDPR Art. 7</strong>, <strong>Legea 506/2004</strong> (România)
                    </p>
                    <p className="text-sm text-emerald-700 dark:text-emerald-400">
                        <strong>Operatorul:</strong> CULOAREA DIN VIATA SA SRL | <strong>CUI:</strong> 44820819 | <strong>Baza legală:</strong> Consimțământul expres (Art. 6(1)(a) GDPR) și interesul legitim (Art. 6(1)(f) GDPR)
                    </p>
                </div>

                <h2 className="text-xl font-semibold mt-6 mb-2">Ce sunt cookies?</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Cookies sunt fișiere mici de text stocate pe dispozitivul tău (computer, telefon, tabletă) atunci când vizitezi un site web. Ele ajută la funcționarea corectă a site-ului, la personalizarea conținutului și la analizarea traficului. Pe lângă cookies, putem folosi și &quot;Local Storage&quot; pentru a salva preferințele tale direct în browser.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">Categorii de Cookies și Tehnologii Utilizate</h2>

                <div className="space-y-4">
                    <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-800">
                        <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">🔒 COOKIES ESENȚIALE (Fără consimțământ necesar)</h3>
                        <p className="text-sm text-green-700 dark:text-green-400 mb-2"><strong>Baza legală:</strong> Interes legitim (Art. 6(1)(f) GDPR) - necesare pentru funcționarea serviciului</p>
                        <ul className="list-disc pl-5 text-sm text-green-700 dark:text-green-400 space-y-1">
                            <li><strong>Securitate și autentificare:</strong> CSRF tokens, session cookies, login state</li>
                            <li><strong>Coș de cumpărături:</strong> Menținerea produselor și configurațiilor</li>
                            <li><strong>Preferinte tehnice:</strong> Limba, valuta, setări de accesibilitate</li>
                            <li><strong>Perioada de stocare:</strong> Session sau max. 30 zile</li>
                        </ul>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">🎯 COOKIES FUNCȚIONALE (Consimțământ necesar)</h3>
                        <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-2"><strong>Baza legală:</strong> Consimțământ expres (Art. 6(1)(a) GDPR)</p>
                        <ul className="list-disc pl-5 text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                            <li><strong>Asistent AI:</strong> Istoricul conversației, contextul și preferinte chatbot (LocalStorage)</li>
                            <li><strong>WhatsApp Integration:</strong> Status interațiune, sesiune suport</li>
                            <li><strong>Personalizare avansată:</strong> Tema întunecată/luminoasă, layout preferat</li>
                            <li><strong>Perioada de stocare:</strong> 90 zile sau până la retragerea consimțământului</li>
                        </ul>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                        <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">📊 COOKIES ANALITICE (Consimțământ necesar)</h3>
                        <p className="text-sm text-purple-700 dark:text-purple-400 mb-2"><strong>Baza legală:</strong> Consimțământ expres (Art. 6(1)(a) GDPR)</p>
                        <ul className="list-disc pl-5 text-sm text-purple-700 dark:text-purple-400 space-y-1">
                            <li><strong>Analiză trafic:</strong> Pagini vizitate, timp petrecut, surse de trafic</li>
                            <li><strong>Optimizare performanță:</strong> Viteză încărcare, erori JavaScript</li>
                            <li><strong>A/B Testing:</strong> Testarea de interfete și funcționalități</li>
                            <li><strong>Furnizorii de servicii:</strong> Google Analytics, Hotjar (dacă este utilizat)</li>
                            <li><strong>Perioada de stocare:</strong> 24 luni maximum</li>
                        </ul>
                    </div>
                </div>

                <h2 className="text-xl font-semibold mt-6 mb-2">Cookies pentru Chat AI și WhatsApp</h2>
                <div className="text-slate-600 dark:text-slate-400 mb-4 space-y-3">
                    <p>
                        Pentru a vă oferi suport rapid și eficient, site-ul nostru integrează funcționalități de chat avansate:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            <strong className="text-slate-900 dark:text-white">Asistentul AI (Chatbot):</strong> Utilizăm tehnologii de stocare (precum Local Storage) pentru a salva istoricul conversației dumneavoastră cu asistentul nostru virtual. Acest lucru vă permite să navigați pe diferite pagini ale site-ului fără a pierde contextul discuției sau răspunsurile primite.
                        </li>
                        <li>
                            <strong className="text-slate-900 dark:text-white">WhatsApp Widget:</strong> Integrarea butonului de WhatsApp poate utiliza cookies pentru a facilita deschiderea aplicației și pentru a iniția conversația direct cu echipa noastră de suport, reținând uneori dacă ați interacționat anterior cu acest widget.
                        </li>
                    </ul>
                </div>

                <h2 className="text-xl font-semibold mt-6 mb-2">Gestionarea Consimțământului și Controlul Cookies</h2>

                <div className="bg-slate-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
                    <h3 className="font-semibold mb-2">🎛️ Opțiuni de control disponibile:</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p><strong>Prin site-ul nostru:</strong></p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Banner de consimțământ la prima vizită</li>
                                <li>Centră de preferințe cookies (butonul din footer)</li>
                                <li>Retragerea consimțământului oricând</li>
                                <li>Granularităte pe categorii</li>
                            </ul>
                        </div>
                        <div>
                            <p><strong>Prin browser:</strong></p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Setări cookies în browser (Chrome, Firefox, Safari, Edge)</li>
                                <li>Mod privat/incognito</li>
                                <li>Extensii pentru blocarea cookies</li>
                                <li>Ștergere periodică a istoricului</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg border border-red-200 dark:border-red-800 mb-4">
                    <p className="text-red-800 dark:text-red-300 font-semibold mb-2">⚠️ Impact dezactivare cookies:</p>
                    <ul className="text-sm text-red-700 dark:text-red-400 list-disc pl-5 space-y-1">
                        <li><strong>Cookies esențiale:</strong> Site-ul nu va funcționa corect (login, coș cumpărături)</li>
                        <li><strong>Cookies funcționale:</strong> Pierderea istoricului AI, resetarea preferințelor</li>
                        <li><strong>Cookies analitice:</strong> Nu affectă funcționarea, dar ne limită capacitatea de optimizare</li>
                    </ul>
                </div>

                <h2 className="text-xl font-semibold mt-6 mb-2">Transferuri Internaționale și Terţi</h2>
                <div className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg border border-orange-200 dark:border-orange-800 mb-4">
                    <p><strong>🌍 Servicii terțe cu cookies:</strong></p>
                    <ul className="text-sm text-orange-700 dark:text-orange-400 list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Google (Analytics, Fonts):</strong> SUA - Adequate Decision și Standard Contractual Clauses</li>
                        <li><strong>Meta/WhatsApp:</strong> Irlanda (UE) - Transfer intra-UE</li>
                        <li><strong>Stripe (plăți):</strong> Irlanda (UE) - Certificare PCI DSS</li>
                        <li><strong>Cloudinary (imagini):</strong> SUA - Standard Contractual Clauses</li>
                        <li><strong>Vercel (hosting):</strong> SUA - Standard Contractual Clauses</li>
                    </ul>
                </div>

                <h2 className="text-xl font-semibold mt-6 mb-2">Drepturile Dumneavoastră și Contact</h2>
                <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                        <p><strong>Drepturile GDPR:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Accesul la datele prelucrate prin cookies</li>
                            <li>Rectificarea și ștergerea datelor</li>
                            <li>Restricționarea prelucrării</li>
                            <li>Portabilitatea datelor</li>
                            <li>Opunerea și retragerea consimțământului</li>
                        </ul>
                    </div>
                    <div>
                        <p><strong>Contact:</strong></p>
                        <p>Email: <a href="mailto:contact@Tablou.net" className="text-emerald-600 underline">contact@Tablou.net</a><br />
                            Cookies: <a href="mailto:contact@Tablou.net" className="text-emerald-600 underline">contact@Tablou.net</a><br />
                            <strong>ANSPDCP:</strong> <a href="https://dataprotection.ro" target="_blank" className="text-emerald-600 underline">dataprotection.ro</a></p>
                    </div>
                </div>

                <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Pentru detalii complete despre prelucrarea datelor personale, consultați <a href="/confidentialitate" className="text-emerald-600 underline hover:text-emerald-800 transition-colors">Politica de confidențialitate</a>.
                </p>

                <div className="mt-8 border-t dark:border-slate-700 pt-6">
                    <p className="text-xs text-slate-500 text-center mb-4">
                        <strong>Actualizat:</strong> 23.12.2025 |
                        <strong>Versiune:</strong> 2.1 |
                        <strong>Conformitate:</strong> ePrivacy Directive, GDPR, Legea 506/2004 (RO)
                    </p>
                    <div className="text-center">
                        <a href="/" className="inline-block px-6 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow transition transform hover:-translate-y-0.5">
                            Înapoi la prima pagină
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
}

