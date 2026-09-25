import React from "react";
import { spintax } from "@/lib/seo/spintax";

// Intrebarile frecvente de pe pagina produs × localitate. Toate raspunsurile sunt in HTML
// (<details>), ca Google sa le vada, iar aceleasi texte merg in datele structurate FAQPage.

type Props = { productTitle: string; locName: string; judetName: string };

export function getLocalFaqs({ productTitle, locName, judetName }: Props) {
    const produs = productTitle.toLowerCase();
    const seed = `${locName}-${productTitle}`;
    return [
        {
            question: `Livrați ${produs} în ${locName}?`,
            answer: spintax(`{Da, livrăm ${produs} în ${locName} și în tot județul ${judetName}.|Da, trimitem prin curier direct la adresa ta din ${locName}.} {Coletul ajunge de regulă în 24-48 de ore de la finalizarea producției.|Producem în 1-3 zile lucrătoare, apoi curierul îl aduce la ușă.}`, `${seed}-q1`),
        },
        {
            question: `Cât costă livrarea în județul ${judetName}?`,
            answer: spintax(`{Costul transportului apare în coș, înainte să plasezi comanda.|Vezi costul exact al livrării imediat ce adaugi produsul în coș.} {Poți plăti cu cardul, prin transfer sau ramburs, la curier.|Plata se poate face și la livrare, când primești coletul.}`, `${seed}-q2`),
        },
        {
            question: `Pot primi factură pe firmă în ${locName}?`,
            answer: spintax(`{Da, emitem factură pentru firme, PFA și instituții.|Da, orice comandă vine cu factură fiscală.} {Completezi datele firmei la finalizarea comenzii.|Datele firmei le poți salva în cont pentru comenzile următoare.}`, `${seed}-q3`),
        },
        {
            question: "Cum știu că grafica mea iese bine?",
            answer: `În configurator vezi grafica pe dimensiunea aleasă, o poți poziționa și primești un semnal dacă rezoluția e prea mică. Dacă nu ai grafică, o facem noi.`,
        },
    ];
}

export function LocalFaq(props: Props) {
    return (
        <div className="w-full divide-y divide-slate-200">
            {getLocalFaqs(props).map((f, i) => (
                <details key={f.question} className="group py-4" open={i === 0}>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold tracking-tight text-slate-900 hover:text-emerald-600">
                        {f.question}
                        <span className="text-emerald-600 transition group-open:rotate-45" aria-hidden>+</span>
                    </summary>
                    <p className="mt-2 text-base leading-relaxed text-slate-600">{f.answer}</p>
                </details>
            ))}
        </div>
    );
}
