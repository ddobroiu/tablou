import React from "react";
import Link from "next/link";
import { getAllPosts } from "@/lib/blogPosts";
import Image from "next/image";
import { headers } from "next/headers";

export const metadata = {
    title: "Blog - Sfaturi de Print și Publicitate",
    description: "Ghiduri practice, noutăți din industria tiparului și sfaturi pentru materialele tale publicitare. Află cum să alegi cele mai bune soluții de print.",
    keywords: ['blog print', 'sfaturi publicitate', 'ghiduri tipar', 'noutati marketing', 'tablou'],
    alternates: {
        canonical: '/blog',
    },
    openGraph: {
        title: "Blog - Sfaturi de Print și Publicitate",
        description: "Ghiduri practice, noutăți din industria tiparului și sfaturi pentru materialele tale publicitare.",
        type: "website",
        images: ["/products/banner/banner-1.webp"], // Fallback safe image
    }
};

export default async function BlogPage() {
    const headersList = await headers();
    const host = headersList.get('host') || '';

    let source = 'Tablou.net';
    if (host.includes('prynt')) source = 'prynt.ro';
    else if (host.includes('euprint')) source = 'euprint.ro';
    else if (host.includes('adbanner')) source = 'adbanner.ro';
    else if (host.includes('tablou')) source = 'tablou.net';
    else if (host.includes('visionboard')) source = 'visionboard.ro';

    console.log(`[BlogPage] Host: ${host}, Source: ${source}`);


    const allPosts = getAllPosts();
    const posts = allPosts.filter(p => !p.source || p.source === source);

    return (
        <main className="min-h-screen pt-24 pb-16 bg-slate-50">
            <div className="container mx-auto px-4 md:px-8">
                <header className="max-w-3xl mx-auto text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Blog & Noutăți</h1>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Ghiduri practice, idei de promovare și noutăți.
                        Te ajutăm să transformi fiecare proiect într-un succes.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <article
                            key={post.slug}
                            className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col group"
                        >
                            <Link href={`/blog/${post.slug}`} className="block">
                                <div className="relative h-56 bg-slate-200 overflow-hidden">
                                    {post.hero ? (
                                        <Image
                                            src={post.hero}
                                            alt={post.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-400 to-emerald-600">
                                            <span className="text-white font-bold text-xl px-6 text-center">{post.title}</span>
                                        </div>
                                    )}
                                </div>
                            </Link>

                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex gap-2 mb-3 flex-wrap">
                                    {post.tags.slice(0, 3).map((tag) => (
                                        <span key={tag} className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
                                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                                </h2>
                                <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
                                    {post.description}
                                </p>
                                <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                                    <span className="text-xs text-slate-400 font-medium">
                                        {new Date(post.date).toLocaleDateString("ro-RO")}
                                    </span>
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        className="text-sm font-bold text-slate-900 hover:text-emerald-600 transition-colors flex items-center gap-1"
                                    >
                                        Citește articolul
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </main>
    );
}

