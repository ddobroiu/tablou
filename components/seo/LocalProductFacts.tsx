import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { getLocalProductFacts } from "@/lib/seo/localProductFacts";

// Secțiunea „ce primești” de pe paginile produs × localitate: fapte despre produs,
// utilizări, pașii comenzii și diferența față de produsul cu care e confundat.
// Fiecare site are propriile titluri și ordinea proprie a blocurilor.

type Block = "specs" | "uses" | "steps";
type Voice = { title: string; uses: string; steps: string; order: Block[] };

const VOICES: Record<string, Voice> = {
  AdBanner: { title: "{produs} pentru {loc}: ce primești", uses: "Unde se folosește", steps: "Cum comanzi din {loc}", order: ["specs", "uses", "steps"] },
  EuPrint: { title: "Specificații {produs}, comenzi din {loc}", uses: "Pentru ce se comandă", steps: "Pașii comenzii", order: ["specs", "steps", "uses"] },
  HomePrint: { title: "Cum arată {produs} comandat din {loc}", uses: "Idei de folosire", steps: "Cum ajunge la tine", order: ["uses", "specs", "steps"] },
  Prynt: { title: "{produs} livrat în {loc}, pe scurt", uses: "Pentru ce îl aleg clienții", steps: "Comanda, pas cu pas", order: ["uses", "specs", "steps"] },
  ShopPrint: { title: "Detalii {produs} pentru {loc}", uses: "Utilizări", steps: "Cum comanzi", order: ["specs", "uses", "steps"] },
  Tablou: { title: "{produs} în {loc}: ce trebuie să știi", uses: "Ce poți face cu el", steps: "De la fișier la ușa ta", order: ["uses", "steps", "specs"] },
};

type Props = {
  productIds: Array<string | undefined | null>;
  productTitle: string;
  locName: string;
  judetSlug: string;
  locSlug: string;
  configUrl: string;
};

export function LocalProductFacts({ productIds, productTitle, locName, judetSlug, locSlug, configUrl }: Props) {
  const found = getLocalProductFacts(productIds);
  if (!found) return null;
  const { facts } = found;
  const v = VOICES[siteConfig.name] || VOICES.ShopPrint;
  const fill = (s: string) => s.replace("{produs}", productTitle).replace("{loc}", locName);

  const blocks: Record<Block, React.ReactNode> = {
    specs: (
      <ul key="specs" className="grid gap-2 sm:grid-cols-2">
        {facts.specs.map((s) => (
          <li key={s} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">{s}</li>
        ))}
      </ul>
    ),
    uses: (
      <div key="uses">
        <h3 className="mb-2 text-lg font-bold text-slate-900">{v.uses}</h3>
        <p className="text-slate-700">
          {productTitle} se comandă de obicei pentru {facts.uses.slice(0, -1).join(", ")}
          {facts.uses.length > 1 ? ` sau ${facts.uses[facts.uses.length - 1]}` : facts.uses[0]}.
        </p>
      </div>
    ),
    steps: (
      <div key="steps">
        <h3 className="mb-2 text-lg font-bold text-slate-900">{fill(v.steps)}</h3>
        <ol className="list-decimal space-y-1 pl-5 text-slate-700">
          <li>
            Alegi dimensiunea sau formatul și materialul în <Link href={configUrl} className="font-semibold underline">configurator</Link>; prețul se calculează pe loc.
          </li>
          <li>{facts.artwork}</li>
          <li>Plătești cu cardul, prin transfer bancar sau ramburs, la curier. Factura se emite pe persoană fizică sau pe firmă.</li>
          <li>Comanda ajunge în {locName} în 2-4 zile lucrătoare, prin curier, la adresă sau la un punct de ridicare.</li>
        </ol>
      </div>
    ),
  };

  return (
    <section className="border-t border-slate-100 bg-slate-50 py-16">
      <div className="mx-auto max-w-4xl space-y-8 px-4">
        <div>
          <h2 className="mb-3 text-2xl font-black tracking-tight text-slate-900 md:text-3xl">{fill(v.title)}</h2>
          <p className="text-lg text-slate-700">{facts.what}</p>
        </div>
        {v.order.map((b) => blocks[b])}
        {facts.related && (
          <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700">
            {facts.related.text}{" "}
            <Link href={`/judet/${judetSlug}/${locSlug}/${facts.related.slug}`} className="font-semibold underline">
              Vezi {facts.related.name} în {locName}
            </Link>
            .
          </p>
        )}
      </div>
    </section>
  );
}
