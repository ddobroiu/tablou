import React from "react";
import Link from "next/link";
import { getAllPosts } from "@/lib/blogPosts";
import Image from "next/image";
import { headers } from "next/headers";
import { ArrowRight, Newspaper, Bookmark, Clock } from "lucide-react";

export const metadata = {
    title: "Noutăți și Articole SEO",
    description: "Rămâi la curent cu ultimele noutăți din industria tiparului, ghiduri SEO pentru print și sfaturi practice pentru afacerea ta. Dimensiuni A3, A4 și multe alte resurse utile.",
    keywords: ['noutati print', 'articole seo', 'dimensiuni hartie', 'ghid print a4', 'tablou noutati'],
    alternates: {
        canonical: '/noutati',
    },
    openGraph: {
        title: "Noutăți și Articole SEO",
        description: "Ultimele noutăți din industria tiparului și ghiduri SEO pentru afacerea ta.",
        type: "website",
        images: ["/logo.png"],
    }
};

export default async function NoutatiPage() {
    const headersList = await headers();
    const host = headersList.get('host') || '';

    let source = 'Tablou.net';
    if (host.includes('prynt')) source = 'prynt.ro';
    else if (host.includes('euprint')) source = 'euprint.ro';
    else if (host.includes('adbanner')) source = 'adbanner.ro';
    else if (host.includes('tablou')) source = 'tablou.net';
    else if (host.includes('visionboard')) source = 'visionboard.ro';

    const allPosts = getAllPosts();
    // Filter by source and by 'noutati' tag (to keep it clean) or just show all relevant to tablou
    const posts = allPosts.filter(p => (!p.source || p.source === source) && p.tags.includes('noutati'));

    return (
        <main className="min-h-screen pt-32 pb-20 bg-slate-50">
            {/* Hero Section */}
            <section className="container mx-auto px-6 mb-16">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-6">
                        <Newspaper size={14} />
                        <span>Resurse & Noutăți</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
                        Centrul de <span className="text-emerald-600">Cunoaștere</span> Tablou
                    </h1>
                    <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                        Ghiduri practice, specificații tehnice și noutăți din universul printului digital. 
                        Învățăm împreună cum să obținem cele mai bune rezultate.
                    </p>
                </div>
            </section>

            {/* Articles Grid */}
            <div className="container mx-auto px-6 !max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {posts.length > 0 ? posts.map((post) => (
                        <article
                            key={post.slug}
                            className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-100 flex flex-col"
                        >
                            {/* Card Image Wrapper */}
                            <Link href={`/noutati/${post.slug}`} className="block relative h-64 overflow-hidden">
                                {post.hero ? (
                                    <Image
                                        src={post.hero}
                                        alt={post.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center p-8 text-center relative overflow-hidden">
                                        {/* Abstract Decorations */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
                                        
                                        <span className="text-white font-black text-xl leading-snug z-10">{post.title}</span>
                                    </div>
                                )}
                                <div className="absolute top-4 left-4 z-20">
                                    <span className="bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                                        SEO Article
                                    </span>
                                </div>
                            </Link>

                            {/* Content */}
                            <div className="p-8 flex flex-col flex-grow">
                                <div className="flex items-center gap-4 text-xs text-slate-400 mb-4 font-medium">
                                    <div className="flex items-center gap-1.5 text-emerald-600">
                                        <Bookmark size={14} />
                                        {post.tags[0]}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={14} />
                                        {new Date(post.date).toLocaleDateString("ro-RO")}
                                    </div>
                                </div>

                                <h2 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors leading-tight">
                                    <Link href={`/noutati/${post.slug}`}>{post.title}</Link>
                                </h2>
                                
                                <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3">
                                    {post.description}
                                </p>

                                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                                    <Link
                                        href={`/noutati/${post.slug}`}
                                        className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-emerald-600 transition-colors group/btn"
                                    >
                                        Vezi tot articolul
                                        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </article>
                    )) : (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-slate-400 font-medium">Momentan nu există articole în această secțiune.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Newsletter / CTA Section */}
            <section className="container mx-auto px-6 mt-20 !max-w-5xl">
                <div className="bg-slate-900 rounded-[3rem] p-12 md:p-16 text-center relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent"></div>
                    
                    <h3 className="text-3xl font-black text-white mb-6 relative z-10">Ai un proiect special în minte?</h3>
                    <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto relative z-10">
                        Indiferent de dimensiune sau complexitate, echipa noastră te poate ajuta să transformi ideile în materiale palpabile de înaltă calitate.
                    </p>
                    <Link 
                        href="/contact" 
                        className="inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-white font-black px-10 py-5 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-emerald-500/20 relative z-10"
                    >
                        Contactează-ne acum
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </section>
        </main>
    );
}
