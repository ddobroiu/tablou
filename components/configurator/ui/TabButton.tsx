import React from "react";

interface TabButtonProps {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

export const TabButton = ({ active, onClick, children }: TabButtonProps) => (
    <button
        type="button"
        onClick={onClick}
        className={`px-4 py-2 text-sm font-semibold transition-colors rounded-t-lg ${active
            ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50"
            : "text-gray-500 hover:text-gray-800"
            }`}
    >
        {children}
    </button>
);
