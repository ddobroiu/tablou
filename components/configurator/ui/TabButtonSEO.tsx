import React from "react";

interface TabButtonSEOProps {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

export const TabButtonSEO = ({ active, onClick, children }: TabButtonSEOProps) => (
    <button
        onClick={onClick}
        className={`flex-1 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${active
            ? 'border-emerald-500 text-emerald-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
    >
        {children}
    </button>
);
