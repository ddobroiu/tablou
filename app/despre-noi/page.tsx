import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Award, Users, ShieldCheck, Zap, Factory, Target } from 'lucide-react';
import { siteConfig } from '@/lib/siteConfig';

export const metadata: Metadata = {
    title: 'Despre Noi Romania',
    description: 'Peste 10 ani de experiență, echipamente de ultimă generație și o echipă pasionată de print digital și producție publicitară la cel mai înalt nivel.',
    alternates: {
        canonical: '/despre-noi',
    },
};

export default function AboutPage() {
    const breadcrumbItems = [
        { label: 'Despre Noi', href: '/despre-noi' }
    ];

    return (
        <div className="pt-24 pb-20 min-h-screen bg-slate-50">
            <div className="container mx-auto px-4 !max-w-7xl">
                <Breadcrumbs items={breadcrumbItems} />

                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
                    <div className="space-y-6">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs uppercase tracking-widest">
                            Tablou.net
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight tracking-tighter">
                            Nu suntem doar o <span className="text-emerald-500">tipografie.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium">
                            Suntem partenerul tău tehnologic în producția publicitară. De la un singur banner până la campanii naționale, redefinim modul în care afacerile din România interacționează cu printul de mari și mici dimensiuni.
                        </p>
                        <div className="flex gap-4 pt-4 text-emerald-600 font-bold">
                            <div className="flex items-center gap-2">
                                <Award size={24} />
                                <span>10+ Ani Experiență</span>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                                <Users size={24} />
                                <span>Echipă Specializată</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative aspect-square lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-200">
                        <Image 
                            src="/products/banner/banner-2.webp" 
                            alt="Echipa și Tehnologia Tablou" 
                            fill 
                            priority 
                            className="object-cover mix-blend-overlay opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/40 to-emerald-900/40"></div>
                        <div className="absolute bottom-8 left-8 right-8 text-white">
                            <h3 className="text-2xl font-black mb-2">Pasiune pentru Detalii</h3>
                            <p className="text-white/80 text-sm">Fiecare mp de panză sau material este verificat manual înainte de ambalare.</p>
                        </div>
                    </div>
                </div>

                {/* Istoric/Misiune */}
                <div className="bg-white rounded-3xl p-8 md:p-16 shadow-lg border border-slate-100 mb-24 relative overflow-hidden">
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-50 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none"></div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
                        <div>
                            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-6">
                                <ShieldCheck size={24} />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 mb-6">Misiunea Noastră</h2>
                            <div className="prose prose-slate prose-p:leading-relaxed text-slate-600">
                                <p>
                                    Când am fondat Tablou, am observat o problemă majoră în industria tipografică: timpii uriași de așteptare pentru cererile de ofertă și opacitatea prețurilor. Misiunea noastră este să aducem o **transparență absolută** și eficiență maximă procesului de print B2B și B2C din România.
                                </p>
                                <p>
                                    Cu ajutorul **Sistemului nostru de Configurare Smart**, am reușit să punem puterea calculului de preț direct în mâna vizitatorului, cu precizie de milimetru, combinând prețul instant cu tehnologie industrială de finețe. 
                                </p>
                            </div>
                        </div>
                        <div>
                            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                                <Factory size={24} />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 mb-6">Tehnologie Proprie</h2>
                            <div className="prose prose-slate prose-p:leading-relaxed text-slate-600">
                                <p>
                                    Controlul absolut al calității nu poate fi atins externalizând producția. Acesta a fost motivul consolidării **parcului nostru tipografic interior**, dotat cu imprimante industriale care folosesc cerneluri UV și Latex ecologice. 
                                </p>
                                <ul className="space-y-2 mt-4 marker:text-emerald-500 font-medium">
                                    <li>Verificare DTP manuală (Pre-press gratuit) la fiecare lucrare</li>
                                    <li>Culori ICC calibrate profesional</li>
                                    <li>Termosudare și asamblare automată pentru rezistență crescută</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Echipa și Valorile */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter">
                        Oamenii din spatele <span className="text-emerald-500">mașinilor</span>
                    </h2>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        Tehnologia face producția, dar oamenii fac calitatea. Din departamentul DTP și până la finisaj manual (customer support, pre-press sau finisor industrial), echipa noastră pune pasiune de 10+ ani în domeniu.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    {[
                        { 
                            t: "1. Respect față de Client", 
                            d: "Răspundem la e-mail-uri sau la telefon rapid. Dacă o lucrare nu este gata la timp sau un fișier este greșit, comunicăm imediat. Timpul fiecăruia este vital.",
                            i: <Zap className="text-emerald-500" size={32} />
                        },
                        { 
                            t: "2. Focus Tehnic (E-E-A-T)", 
                            d: "Ne educăm constant. Cunoaștem limitele de tensiune ale autocolantului, densitatea polimerului sau nivelul punctului de raster pentru pre-press la nivel teoretic și practic.",
                            i: <Target className="text-blue-500" size={32} />
                        },
                        { 
                            t: "3. Soluții la Cheie", 
                            d: "Nu abandonăm clientul după ridicarea facturii. Venim cu soluții tehnice din stocuri proprii pentru montaje ușoare pe orice sistem, respectând termenele de lansări ale agențiilor.",
                            i: <Award className="text-orange-500" size={32} />
                        }
                    ].map((v, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:border-emerald-500 transition-all group">
                            <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-2xl mb-6 group-hover:bg-emerald-50 transition-colors">
                                {v.i}
                            </div>
                            <h4 className="text-xl font-black text-slate-900 mb-4">{v.t}</h4>
                            <p className="text-slate-600 leading-relaxed text-sm">{v.d}</p>
                        </div>
                    ))}
                </div>

                {/* Final CTA */}
                <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#10b98122_0%,transparent_70%)] pointer-events-none"></div>
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tighter">Lucrează cu Profesioniști</h2>
                        <p className="text-slate-400 mb-8 text-lg">Indiferent dacă ești o firmă mare de retail sau antreprenor aflat la început, standardele de tipar rămân aceleași.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/configuratoare" className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-500/20">
                                Explorează Produsele
                            </Link>
                            <a href={`tel:${siteConfig.phone.replace(/\\s+/g, '').replace(/^0/, '+40')}`} className="px-8 py-4 bg-white/10 hover:bg-white text-white hover:text-slate-900 border border-white/20 hover:border-white font-bold rounded-xl transition-all">
                                Contactează-ne
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
