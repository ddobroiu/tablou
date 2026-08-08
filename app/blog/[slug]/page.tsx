import React from "react";
import { getPostBySlug, POSTS } from "@/lib/blogPosts";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import ArticleSchema from "@/components/ArticleSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return POSTS.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) return { title: "Articol negăsit" };

    return {
        title: `${post.title} | Blog Tablou.net`,
        description: post.description,
        openGraph: {
            title: post.title,
            description: post.description,
            type: "article",
            publishedTime: post.date,
            authors: [post.author || "Echipa Tablou"],
            images: post.hero ? [{ url: post.hero, width: 1200, height: 630, alt: post.title }] : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.description,
            images: post.hero ? [post.hero] : undefined,
        }
    };
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    return (
        <main className="min-h-screen pt-24 pb-20 bg-white">
            <BreadcrumbSchema
                items={[
                    { name: "Acasă", item: "/" },
                    { name: "Blog", item: "/blog" },
                    { name: post.title, item: `/blog/${post.slug}` }
                ]}
            />
            <ArticleSchema
                title={post.title}
                description={post.description}
                datePublished={post.date}
                authorName={post.author || "Echipa Tablou"}
                image={post.hero || "/logo.png"}
                url={`/blog/${post.slug}`}
            />
            <div className="container mx-auto px-4 md:px-8">
                {/* Back to blog */}
                <div className="max-w-3xl mx-auto mb-8">
                    <Link href="/blog" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-emerald-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Înapoi la blog
                    </Link>
                </div>

                <article className="max-w-3xl mx-auto">
                    {/* Header */}
                    <header className="mb-10">
                        <div className="flex gap-2 mb-4">
                            {post.tags.map((tag) => (
                                <span key={tag} className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-6">
                            {post.title}
                        </h1>
                        <div className="flex items-center gap-4 text-sm text-slate-500 pb-8 border-b border-slate-100">
                            <span className="font-bold text-slate-900">{post.author}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span>{new Date(post.date).toLocaleDateString("ro-RO")}</span>
                        </div>
                    </header>

                    {/* Hero Image */}
                    {post.hero && (
                        <div className="relative h-[400px] w-full rounded-3xl overflow-hidden mb-12 shadow-2xl">
                            <Image
                                src={post.hero}
                                alt={post.title}
                                fill
                                priority={true}
                                sizes="(max-width: 1024px) 100vw, 1024px"
                                className="object-cover"
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div
                        className="prose prose-slate lg:prose-xl prose-headings:font-black prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-emerald-600 prose-a:font-bold prose-a:no-underline hover:prose-a:underline"
                        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
                    />

                    {/* CTA SECTION */}
                    <div className="mt-16 p-8 md:p-12 bg-slate-900 rounded-[2rem] text-white overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/20 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none group-hover:bg-emerald-600/30 transition-colors"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] -ml-32 -mb-32 pointer-events-none group-hover:bg-indigo-600/20 transition-colors"></div>

                        <div className="relative z-10 text-center">
                            <h3 className="text-2xl md:text-3xl font-black mb-4">Ești gata să transformi ideile în materiale reale?</h3>
                            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                                Folosește configuratoarele noastre online pentru a obține preț instant și a plasa comanda în câteva minute.
                            </p>

                            <div className="flex flex-wrap justify-center gap-3">
                                {[
                                    { label: "Bannere", href: "/configurator/banner" },
                                    { label: "Autocolante", href: "/configurator/autocolante" },
                                    { label: "Afișe", href: "/configurator/afise" },
                                    { label: "Canvas", href: "/configurator/canvas" },
                                    { label: "Roll-up", href: "/configurator/rollup" },
                                    { label: "Plexiglass", href: "/materiale/plexiglass" }
                                ].map((cta) => (
                                    <Link
                                        key={cta.href}
                                        href={cta.href}
                                        className="px-6 py-3 bg-white/10 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all hover:scale-105"
                                    >
                                        {cta.label}
                                    </Link>
                                ))}
                                <Link
                                    href="/shop"
                                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all hover:scale-105 shadow-lg shadow-emerald-600/20"
                                >
                                    Toate produsele
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Related Articles or Newsletter? */}
                    {/* Share Button */}
                    <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h4 className="font-bold text-slate-900 mb-1 italic">Te-a ajutat acest articol?</h4>
                            <p className="text-sm text-slate-400">Împărtășește-l cu prietenii tăi!</p>
                        </div>
                        <div className="flex gap-4">
                            <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                            </button>
                        </div>
                    </div>

                    {/* Related Post Section */}
                    {POSTS.filter(p => p.slug !== post.slug && p.tags.some(t => post.tags.includes(t))).length > 0 && (
                        <div className="mt-24">
                            <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                <span className="w-8 h-1 bg-emerald-500 rounded-full"></span>
                                Articole Similare
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {POSTS.filter(p => p.slug !== post.slug && p.tags.some(t => post.tags.includes(t))).slice(0, 2).map((rp) => (
                                    <Link key={rp.slug} href={`/blog/${rp.slug}`} className="group block">
                                        <div className="relative h-48 rounded-2xl overflow-hidden mb-4">
                                            <Image src={rp.hero || "/logo.png"} alt={rp.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                            <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors"></div>
                                        </div>
                                        <h4 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-tight">
                                            {rp.title}
                                        </h4>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </article>
            </div>
        </main>
    );
}
