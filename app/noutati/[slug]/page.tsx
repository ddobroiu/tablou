import React from "react";
import { getPostBySlug, POSTS } from "@/lib/blogPosts";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Share2, Calendar, User, ChevronRight } from "lucide-react";
import ArticleSchema from "@/components/ArticleSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    // Only generate params for posts tagged with 'noutati'
    return POSTS.filter(p => p.tags.includes('noutati')).map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) return { title: "Articol negăsit" };

    return {
        title: `${post.title} | Noutăți Tablou.net`,
        description: post.description,
        openGraph: {
            title: post.title,
            description: post.description,
            type: "article",
            publishedTime: post.date,
            authors: [post.author || "Echipa Tablou"],
            images: post.hero ? [{ url: post.hero, width: 1200, height: 630, alt: post.title }] : [{ url: "/logo.png", width: 1200, height: 630, alt: "Tablou Logo" }],
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.description,
            images: post.hero ? [post.hero] : ["/logo.png"],
        }
    };
}

export default async function NoutatiPostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post || !post.tags.includes('noutati')) {
        notFound();
    }

    return (
        <main className="min-h-screen pt-32 pb-24 bg-white">
            <BreadcrumbSchema
                items={[
                    { name: "Acasă", item: "/" },
                    { name: "Noutăți", item: "/noutati" },
                    { name: post.title, item: `/noutati/${post.slug}` }
                ]}
            />
            <ArticleSchema
                title={post.title}
                description={post.description}
                datePublished={post.date}
                authorName={post.author || "Echipa Tablou"}
                image={post.hero || "/logo.png"}
                url={`/noutati/${post.slug}`}
            />
            
            <div className="container mx-auto px-6 !max-w-4xl">
                {/* Back Link */}
                <div className="mb-12">
                    <Link 
                        href="/noutati" 
                        className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-emerald-600 transition-all group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Înapoi la Noutăți
                    </Link>
                </div>

                <article>
                    {/* Header Details */}
                    <header className="mb-12">
                        <div className="flex flex-wrap gap-2 mb-6">
                            {post.tags.map((tag) => (
                                <span key={tag} className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-950 leading-[1.1] mb-8 tracking-tight">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 py-6 border-y border-slate-100">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                    <User size={16} />
                                </div>
                                <span className="font-bold text-slate-900">{post.author || "Echipa Tablou"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-emerald-500" />
                                <span>{new Date(post.date).toLocaleDateString("ro-RO", { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                        </div>
                    </header>

                    {/* Hero Image Section */}
                    {post.hero && (
                        <div className="relative aspect-video w-full rounded-[3rem] overflow-hidden mb-16 shadow-2xl">
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

                    {/* Main Content Render */}
                    <div
                        className="prose prose-slate prose-lg md:prose-xl !max-w-none 
                        prose-headings:font-black prose-headings:text-slate-900 prose-headings:tracking-tight 
                        prose-p:text-slate-600 prose-p:leading-relaxed
                        prose-strong:text-slate-900 prose-strong:font-bold
                        prose-a:text-emerald-600 prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                        prose-li:text-slate-600
                        prose-table:border prose-table:rounded-xl prose-table:overflow-hidden prose-table:shadow-sm"
                        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
                    />

                    {/* Footer / CTA Block */}
                    <div className="mt-20 p-12 md:p-16 bg-gradient-to-br from-slate-900 to-slate-950 rounded-[3rem] text-white relative overflow-hidden group border border-slate-800 shadow-2xl">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none group-hover:bg-emerald-500/15 transition-colors duration-700"></div>
                        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] -ml-40 -mb-40 pointer-events-none group-hover:bg-indigo-500/15 transition-colors duration-700"></div>

                        <div className="relative z-10 text-center">
                            <h3 className="text-3xl font-black mb-6 leading-tight">Vrei rezultate profesionale pentru afacerea ta?</h3>
                            <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                                Fiecare material pe care îl producem trece printr-un control strict de calitate. Configurați-vă produsul acum și beneficiați de consultanță gratuită.
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                                {[
                                    { label: "Bannere", href: "/configurator/banner" },
                                    { label: "Autocolante", href: "/configurator/autocolante" },
                                    { label: "Afișe", href: "/configurator/afise" },
                                    { label: "Tablouri", href: "/configurator/canvas" },
                                    { label: "Roll-up", href: "/configurator/rollup" },
                                    { label: "Solicită Ofertă", href: "/contact", primary: true }
                                ].map((cta) => (
                                    <Link
                                        key={cta.href}
                                        href={cta.href}
                                        className={`px-4 py-4 rounded-2xl text-sm font-black transition-all hover:scale-[1.03] flex items-center justify-center gap-2 ${
                                            cta.primary 
                                            ? "bg-emerald-500 hover:bg-emerald-400 text-white shadow-xl shadow-emerald-500/20" 
                                            : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                                        }`}
                                    >
                                        {cta.label}
                                        {cta.primary && <ChevronRight size={16} />}
                                    </Link>
                                ))}
                            </div>
                            <Link href="/shop" className="text-white/50 hover:text-emerald-400 font-bold transition-colors">
                                Vizitează magazinul complet →
                            </Link>
                        </div>
                    </div>

                    {/* Post-reading Interaction */}
                    <div className="mt-20 pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 bg-slate-50/50 p-8 rounded-[2rem]">
                        <div className="text-center md:text-left">
                            <h4 className="font-black text-slate-900 mb-2">Ți-a plăcut acest material?</h4>
                            <p className="text-slate-500">Distribuie-l colegilor sau prietenilor tăi pentru a-i ajuta.</p>
                        </div>
                        <div className="flex gap-4">
                            <button className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 border border-slate-200 rounded-2xl font-black hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 transition-all shadow-sm">
                                <Share2 size={18} />
                                Distribuie Articolul
                            </button>
                        </div>
                    </div>
                </article>
            </div>
        </main>
    );
}
