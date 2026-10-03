import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { nationalCoverage } from "@/lib/seo/nationalCoverage";
import { printGuide } from "@/lib/seo/printGuide";
import { getFromPrice } from "@/lib/seo/fromPrice";
import { CONFIGURATORS_REGISTRY } from "@/lib/configurators-registry";
import { JUDETE_FULL_DATA } from "@/lib/localitati";
import { Breadcrumbs } from "@/components/seo/LocalitySeo";

const coverage = nationalCoverage(siteConfig.url);
const guide = printGuide(siteConfig.url);
export const metadata: Metadata = {
  title: `${coverage.title} | ${siteConfig.name}`,
  description: `${coverage.intro} Compară produsele și prețurile, pregătește fișierul și verifică livrarea.`.slice(0, 160),
  alternates: { canonical: `${siteConfig.url}/print-romania` },
  robots: { index: true, follow: true },
};

export default function NationalPrintPage() {
  return <main className="bg-white pb-16 pt-24 text-slate-900">
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <Breadcrumbs siteUrl={siteConfig.url} items={[{ name: "Acasă", href: "/" }, { name: "Print cu livrare în România" }]} className="mb-6 flex gap-2 text-sm text-slate-600" />
      <p className="text-sm font-semibold text-emerald-700">{siteConfig.name} · comandă online</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">{coverage.title}</h1>
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-600">{coverage.intro}</p>
      <section className="mt-10">
        <h2 className="text-2xl font-bold">Alege produsul și verifică prețul</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {guide.choices.map(choice => {
            const config = CONFIGURATORS_REGISTRY.find(p => p.id === choice.product);
            const from = getFromPrice([choice.product]);
            return <article key={choice.product} className="rounded-2xl border border-slate-200 p-5">
              <h3 className="text-lg font-semibold">{choice.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{choice.when}</p>
              {from && <p className="mt-4 text-sm"><strong>de la {from.text}/buc</strong><span className="mt-1 block text-xs text-slate-600">{from.basis}</span></p>}
              <Link href={`/configurator/${config?.slug || choice.product}`} className="mt-5 inline-flex rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white">Configurează produsul</Link>
            </article>;
          })}
        </div>
        <Link href="/ghid-print" className="mt-6 inline-block font-semibold underline">Compară materialele și pregătirea fișierelor</Link>
      </section>
      <section className="mt-12 rounded-2xl bg-slate-50 p-6 sm:p-8">
        <h2 className="text-2xl font-bold">De la fișier la adresa de livrare</h2>
        <p className="mt-4 leading-relaxed text-slate-700">{coverage.check}</p>
        <ol className="mt-5 list-decimal space-y-3 pl-5 text-slate-700">
          <li>Alegi produsul, dimensiunea și cantitatea în configurator.</li>
          <li>Încarci fișierul și verifici încadrarea înainte de comandă.</li>
          <li>Introduci adresa completă; costul transportului și opțiunile disponibile se verifică la finalizarea comenzii.</li>
          <li>Verifici termenul produsului. Pentru o dată fixă de eveniment, confirmă posibilitatea livrării înainte de plată.</li>
        </ol>
        <p className="mt-5 text-sm text-slate-600">Livrăm prin curier în România. Acoperirea include și localitățile care nu au o pagină dedicată în Google. Paginile județelor și localităților descriu livrarea, nu existența unui atelier sau a unei echipe de montaj în fiecare zonă.</p>
        <div className="mt-5 flex flex-wrap gap-5"><Link href="/livrare" className="font-semibold underline">Costuri și condiții de livrare</Link><Link href="/contact" className="font-semibold underline">Verifică o comandă cu termen fix</Link></div>
      </section>
      <section className="mt-12">
        <h2 className="text-2xl font-bold">Găsește județul și localitatea pentru livrare</h2>
        <p className="mt-3 max-w-3xl text-slate-600">Alege județul pentru a vedea localitățile din director. Poți comanda și pentru o adresă care nu apare între orașele evidențiate; folosești același configurator și verifici adresa în comandă.</p>
        <nav aria-label="Directorul județelor pentru livrare" className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {JUDETE_FULL_DATA.map(j => <Link key={j.slug} href={`/judet/${j.slug}`} className="rounded-xl border border-slate-200 p-3 text-sm font-semibold hover:border-emerald-600">{j.name}</Link>)}
        </nav>
      </section>
    </div>
  </main>;
}
