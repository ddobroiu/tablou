import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import Script from 'next/script';

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Acasa",
                "item": "https://www.tablou.net"
            },
            ...items.map((item, index) => ({
                "@type": "ListItem",
                "position": index + 2,
                "name": item.label,
                "item": item.href.startsWith('http') ? item.href : `https://www.tablou.net${item.href}`
            }))
        ]
    };

    return (
        <nav className="w-full max-w-full relative mb-6 pb-2 scrollbar-hide overflow-hidden" aria-label="Breadcrumb">
            <Script
                id="breadcrumbs-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ol className="flex items-center flex-wrap gap-y-2 whitespace-normal break-words py-1">
                <li className="inline-flex items-center">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors p-1"
                    >
                        <Home size={16} className="sm:mr-2" />
                        <span className="hidden sm:inline">Acasa</span>
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index}>
                        <div className="flex items-center">
                            <ChevronRight size={14} className="text-gray-400 mx-1 shrink-0" />
                            <Link
                                href={item.href}
                                className={`ml-1 text-xs font-medium transition-colors p-1 ${index === items.length - 1
                                        ? "text-emerald-600 font-bold"
                                        : "text-gray-700 hover:text-emerald-600"
                                    }`}
                                aria-current={index === items.length - 1 ? "page" : undefined}
                            >
                                {item.label}
                            </Link>
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    );
}

