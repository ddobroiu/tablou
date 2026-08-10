import React from 'react';
import Link from 'next/link';
import { siteConfig } from '@/lib/siteConfig';

export const metadata = {
  title: "Politică de Retur și Garanție - Tablou",
  description: "Află condițiile de retur și garanție pentru produsele Tablou. Dreptul de retragere pentru produsele personalizate conform OUG 34/2014.",
};

export default function PoliticaReturPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(5,150,105,0.05)_0%,transparent_70%)] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="text-center mb-16 lg:mb-20">
          <h1 className="text-4xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter uppercase italic leading-none">
            Retur <span className="text-emerald-600">&</span> Garanție
          </h1>
          <div className="h-1.5 w-24 bg-emerald-600 mx-auto rounded-full shadow-lg mb-8"></div>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Informații clare despre dreptul de retragere, garanție și condițiile de returnare pentru produsele noastre.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 lg:p-16 rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-slate-800 mb-12 relative overflow-hidden">
          <div className="bg-rose-50 dark:bg-rose-950/20 p-8 rounded-3xl border border-rose-100 dark:border-rose-900/40 mb-12">
            <h2 className="text-xl font-black text-rose-800 dark:text-rose-400 mb-4 uppercase tracking-tighter italic flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              Important: Produse Personalizate
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
              Conform Art. 16, lit. c din OUG 34/2014, produsele realizate după specificațiile prezentate de consumator sau personalizate clar sunt exceptate de la dreptul de retragere.
            </p>
            <p className="text-rose-700 dark:text-rose-500 text-[10px] font-black uppercase tracking-widest italic leading-relaxed">
              DACĂ GRAFICA ESTE ÎNCĂRCATĂ DE DVS., PRODUSUL NU POATE FI RETURNAT DECÂT PENTRU DEFECTE DE FABRICAȚIE.
            </p>
          </div>

          <div className="space-y-12 prose dark:prose-invert max-w-none 
            prose-headings:text-slate-900 prose-headings:dark:text-white prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-headings:tracking-tighter
            prose-p:text-slate-700 prose-p:dark:text-slate-400 prose-p:leading-relaxed
            prose-strong:text-slate-900 prose-strong:dark:text-white prose-strong:font-black
            prose-li:text-slate-700 prose-li:dark:text-slate-400
          ">
            <section>
              <h2 className="text-2xl lg:text-3xl border-l-4 border-emerald-600 pl-6">01. Dreptul de Retragere</h2>
              <p>
                Pentru produsele din stoc (standard, nepersonalizate), aveți dreptul de a vă retrage din contract fără penalități, în termen de 14 zile calendaristice de la primirea comenzii.
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none pl-0">
                  <li className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
                      <span className="text-emerald-600 font-bold block mb-1">Stare Produs</span>
                      Trebuie să fie în ambalajul original, fără urme de utilizare.
                  </li>
                  <li className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
                      <span className="text-emerald-600 font-bold block mb-1">Cumpărător</span>
                      Cheltuielile de transport pentru retur sunt suportate de dvs.
                  </li>
              </ul>
              <div className="not-prose mt-8 p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                <p className="text-slate-700 dark:text-slate-300 text-sm mb-4">
                  Pentru a vă exercita dreptul de retragere, completați formularul online dedicat — este cea mai rapidă modalitate și primiți instant o confirmare pe email cu conținutul cererii, data și ora transmiterii.
                </p>
                <a href="/retragere-contract" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-sm uppercase tracking-widest transition-colors">
                  Retrage-te din contract
                </a>
              </div>
            </section>

            <section>
              <h2 className="text-2xl lg:text-3xl border-l-4 border-emerald-600 pl-6">02. Garanția de Calitate</h2>
              <p>
                Dacă produsul primit prezintă un defect de material, print sau asamblare, Tablou se angajează să refacă comanda gratuit.
              </p>
              <p> Vă rugăm să ne înștiințați în scris, la <a href={`mailto:${siteConfig.business.contact.email}`} className="text-emerald-600 font-bold">{siteConfig.business.contact.email}</a>, în primele 48 de ore de la primirea coletului, atașând dovezi foto/video ale defectului semnalat.</p>
            </section>

            <section>
              <h2 className="text-2xl lg:text-3xl border-l-4 border-emerald-600 pl-6">03. Anularea Comenzii</h2>
              <p>
                O comandă personalizată care a intrat deja în procesul de producție nu mai poate fi anulată sau rambursată, deoarece materialele folosite sunt deja consumate conform cerințelor dvs.
              </p>
            </section>
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="btn-outline px-10 py-5">
             Înapoi la prima pagină
          </Link>
        </div>
      </div>
    </main>
  );
}
