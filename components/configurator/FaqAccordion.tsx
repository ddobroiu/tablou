"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { QA } from "@/types/configurator";

type Props = {
    qa: QA[];
};

export default function FaqAccordion({ qa }: Props) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="space-y-3">
            {qa.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:border-indigo-300 transition-colors">
                    <button
                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50 transition-colors"
                    >
                        <span className="font-bold text-gray-800 text-sm sm:text-base pr-4">{item.question}</span>
                        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`} />
                    </button>
                    <div className={`grid transition-all duration-300 ease-in-out ${openIndex === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                        <div className="overflow-hidden">
                            <div className="p-4 pt-0 text-sm text-gray-600 border-t border-gray-100 bg-gray-50/50">
                                {item.answer}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
