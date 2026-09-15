import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

/**
 * "Idei de cadou" strip: three canvas projects that clients order again and
 * again, each pointing at the configurator route that solves it. Replaces the
 * old partner/ecosystem carousel, which linked out to other domains and said
 * nothing about what Tablou.net sells.
 */
const IDEAS = [
    {
        href: "/configurator/canvas-nunta",
        eyebrow: "Tablou de nuntă",
        title: "Poza de la primul dans, pentru dormitor",
        text: "Un singur tablou portret, 60×80 sau 80×120 cm, cu ramă albă sau fără. Cel mai comandat cadou de aniversare a căsătoriei și cel mai des dat de nași după nuntă.",
        image: "/products/canvas/canvas-3.webp",
        alt: "Tablou canvas portret cu fotografie de la nuntă, montat în dormitor",
    },
    {
        href: "/configurator/canvas",
        eyebrow: "Set de 3 pentru living",
        title: "O poză de vacanță, tăiată în trei panouri",
        text: "Trei canvasuri de 40×60 cm, montate la 3-5 cm unul de altul, acoperă peretele de deasupra canapelei fără să coste cât un tablou de 150 cm. Configuratorul taie poza pentru tine.",
        image: "/products/canvas/canvas-4.webp",
        alt: "Set de trei tablouri canvas cu același peisaj, pe peretele din living",
    },
    {
        href: "/configurator/canvas-colaj-foto",
        eyebrow: "Colaj de familie",
        title: "Toți nepoții pe un singur tablou, pentru bunici",
        text: "Alegi 6, 9 sau 12 poze, colajul se aranjează automat, iar tu mai muți doar ce vrei. Format pătrat 60×60 sau landscape 90×60 cm, ambalat pentru cadou și livrat direct la ei.",
        image: "/products/canvas/canvas-2.webp",
        alt: "Colaj foto de familie printat pe canvas pătrat",
    },
];

export default function PromoSection() {
    return (
        <section className="bg-[#FBF7F2] py-16 md:py-20">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="max-w-2xl mb-10">
                    <p className="text-[#B8385A] font-semibold uppercase tracking-[0.15em] text-xs mb-3">Idei de cadou</p>
                    <h2 className="font-[family-name:var(--font-fraunces)] text-3xl md:text-4xl text-stone-900">Trei tablouri pe care le comandă din nou aceiași clienți.</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
                    {IDEAS.map((s) => (
                        <Link
                            key={s.href}
                            href={s.href}
                            className="group flex flex-col rounded-2xl overflow-hidden border border-stone-200 bg-white hover:border-[#B8385A]/50 hover:shadow-lg transition-all"
                        >
                            <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-200">
                                <Image
                                    src={s.image}
                                    alt={s.alt}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    loading="lazy"
                                />
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                                <p className="text-[#B8385A] text-[11px] font-bold uppercase tracking-widest mb-2">{s.eyebrow}</p>
                                <h3 className="text-stone-900 text-lg font-bold leading-snug mb-3">{s.title}</h3>
                                <p className="text-stone-600 text-sm leading-relaxed flex-1">{s.text}</p>
                                <span className="inline-flex items-center gap-2 text-[#B8385A] font-semibold text-sm mt-5 group-hover:gap-3 transition-all">
                                    Începe cu poza ta <ArrowRight size={16} />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
