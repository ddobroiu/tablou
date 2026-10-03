import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { printGuide } from "@/lib/seo/printGuide";
import { getLocalProductFacts } from "@/lib/seo/localProductFacts";
import { getFromPrice } from "@/lib/seo/fromPrice";
import { LocalSizePrices } from "@/components/seo/LocalSizePrices";
import { Breadcrumbs } from "@/components/seo/LocalitySeo";
import { CONFIGURATORS_REGISTRY } from "@/lib/configurators-registry";

const guide = printGuide(siteConfig.url);
export const metadata: Metadata = {
  title: `${guide.title} | ${siteConfig.name}`,
  description: guide.description,
  alternates: { canonical: `${siteConfig.url}/ghid-print` },
  robots: { index: true, follow: true },
  openGraph: { title: guide.title, description: guide.description, url: `${siteConfig.url}/ghid-print`, type: "website" },
};

export default function PrintGuidePage() {
  return (
    <main className="bg-white pb-16 pt-24 text-slate-900">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Breadcrumbs siteUrl={siteConfig.url} items={[{ name: "Acasă", href: "/" }, { name: "Ghid de print" }]} className="mb-6 flex gap-2 text-sm text-slate-600" />
        <p className="text-sm font-semibold text-emerald-700">{siteConfig.name} · alegerea produsului</p>
        <h1 className="mt-3 max-w-4xl text-3xl font-bold tracking-tight sm:text-5xl">{guide.title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-600">{guide.intro}</p>
        <nav aria-label="Produse din ghid" className="mt-6 flex flex-wrap gap-3">
          {guide.choices.map((choice) => <a key={choice.product} href={`#${choice.product}`} className="rounded-full border border-slate-200 px-4 py-2 text-sm hover:border-emerald-600">{choice.title}</a>)}
        </nav>
        <div className="mt-10 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <caption className="bg-slate-50 p-4 text-left font-semibold">Compară utilizarea și prețul de pornire</caption>
            <thead><tr><th className="p-4">Produs</th><th className="p-4">Când îl alegi</th><th className="p-4">Preț și baza calculului</th></tr></thead>
            <tbody>{guide.choices.map((choice) => {
              const from = getFromPrice([choice.product]);
              return <tr key={choice.product} className="border-t border-slate-200"><th scope="row" className="p-4"><a href={`#${choice.product}`} className="underline">{choice.title}</a></th><td className="p-4 text-slate-600">{choice.when}</td><td className="p-4">{from ? <><strong>de la {from.text}/buc</strong><span className="mt-1 block text-xs text-slate-600">{from.basis}</span></> : "Vezi prețul în configurator"}</td></tr>;
            })}</tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-slate-600">Prețurile sunt calculate cu grafica ta, din același motor folosit la comandă. Materialul, finisarea și cantitatea modifică totalul; costul livrării se verifică la finalizarea comenzii.</p>
        {guide.choices.map((choice) => {
          const facts = getLocalProductFacts([choice.product])?.facts;
          const config = CONFIGURATORS_REGISTRY.find((p) => p.id === choice.product);
          return <section key={choice.product} id={choice.product} className="scroll-mt-24 border-b border-slate-200 py-12">
            <h2 className="text-2xl font-bold">{choice.title}</h2>
            <p className="mt-3 text-lg text-slate-600">{choice.when}</p>
            {facts && <><p className="mt-4 leading-relaxed">{facts.what}</p><ul className="my-6 grid gap-3 sm:grid-cols-2">{facts.specs.map((spec) => <li key={spec} className="rounded-xl bg-slate-50 p-4 text-sm">{spec}</li>)}</ul><h3 className="mt-6 font-semibold">Fișierul pentru print</h3><p className="mt-2 text-slate-600">{facts.artwork}</p></>}
            <h3 className="mt-6 font-semibold">Ce verifici înainte să comanzi</h3><p className="mt-2 text-slate-600">{choice.check}</p>
            <div className="mt-6"><LocalSizePrices productIds={[choice.product]} /></div>
            <Link href={config?.slug ? `/configurator/${config.slug}` : `/configurator/${choice.product}`} className="inline-flex rounded-xl bg-emerald-700 px-6 py-3 font-semibold text-white">Configurează {choice.title.toLowerCase()}</Link>
          </section>;
        })}
        <section className="mt-12 rounded-2xl bg-slate-50 p-6 sm:p-8">
          <h2 className="text-2xl font-bold">Pregătește comanda</h2>
          <ol className="mt-5 list-decimal space-y-3 pl-5 text-slate-700">{guide.checklist.map((item) => <li key={item}>{item}</li>)}</ol>
          <h3 className="mt-8 font-semibold">Comandă online, cu livrare</h3>
          <p className="mt-2 text-slate-600">Livrăm prin curier în România. Pentru o adresă din altă localitate, produsul și prețul de producție se aleg în același configurator. Paginile de livrare nu reprezintă ateliere sau sedii în fiecare oraș.</p>
          <div className="mt-5 flex flex-wrap gap-5"><Link href="/livrare" className="font-semibold underline">Termene și livrare</Link><Link href="/judet" className="font-semibold underline">Alege județul</Link><Link href="/contact" className="font-semibold underline">Întreabă despre comanda ta</Link></div>
        </section>
      </div>
    </main>
  );
}
