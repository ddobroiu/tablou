import React from "react";
import { ChevronDown } from "lucide-react";

interface AccordionStepProps {
    stepNumber: number;
    title: string;
    summary: string;
    isOpen: boolean;
    onClick: () => void;
    children: React.ReactNode;
    isLast?: boolean;
}

export const AccordionStep = ({
    stepNumber,
    title,
    summary,
    isOpen,
    onClick,
    children,
    isLast = false
}: AccordionStepProps) => (
    <div className="relative pl-12">
        <div className="absolute top-5 left-0 flex flex-col items-center h-full">
            <span className={`flex items-center justify-center w-8 h-8 rounded-full text-md font-bold transition-colors ${isOpen ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                {stepNumber}
            </span>
            {!isLast && <div className="w-px grow bg-gray-200 mt-2"></div>}
        </div>
        <div className="flex-1">
            <button
                type="button"
                className="w-full flex items-center justify-between py-5 text-left"
                onClick={onClick}
            >
                <div>
                    <h2 className="text-lg font-bold text-gray-800">{title}</h2>
                    {!isOpen && <p className="text-sm text-gray-500 truncate">{summary}</p>}
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
            </button>
            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100 pb-5" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">{children}</div>
            </div>
        </div>
    </div>
);
