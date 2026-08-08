"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CONFIGURATORS_REGISTRY } from "@/lib/configurators-registry";

export default function MasterConfigurator() {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8 relative z-10 w-full">
            {CONFIGURATORS_REGISTRY.map((config) => (
                <Link
                    key={config.id}
                    href={config.url || `/configurator/${config.slug}`}
                    className="group relative flex flex-col items-center text-center rounded-[2.5rem] border border-slate-200/60 transition-all duration-500 overflow-hidden hover:border-emerald-400 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.15)] hover:-translate-y-2 bg-white h-full"
                >
                    <div className="w-full aspect-square relative bg-slate-50 dark:bg-slate-800 border-b border-slate-100 flex items-center justify-center overflow-hidden">
                        {config.image ? (
                            <Image
                                src={config.image}
                                alt={config.name}
                                fill
                                className="object-contain p-6 md:p-12 transition-transform duration-700 group-hover:scale-110"
                                sizes="(max-width: 768px) 50vw, 25vw"
                                priority={CONFIGURATORS_REGISTRY.indexOf(config) < 6}
                            />
                        ) : (
                          <div className="w-full h-full bg-slate-200 animate-pulse flex items-center justify-center text-slate-400 font-black uppercase text-[10px] tracking-widest">Imagine Lipsă</div>
                        )}
                        <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/[0.03] transition-colors duration-500" />
                    </div>

                    <div className="p-4 md:p-8 w-full flex-1 flex flex-col items-center justify-center bg-white relative">
                        <h4 className="font-black text-sm md:text-lg leading-tight tracking-tight transition-all duration-300 text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 group-hover:scale-105 uppercase italic tracking-tighter">
                            {config.name}
                        </h4>
                        <div className="mt-2 md:mt-4 w-8 h-1 md:h-1.5 bg-slate-100 rounded-full group-hover:w-16 group-hover:bg-emerald-500 transition-all duration-700" />
                    </div>
                </Link>
            ))}
        </div>
    );
}
