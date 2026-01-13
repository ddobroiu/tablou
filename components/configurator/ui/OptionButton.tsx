import React from "react";

interface OptionButtonProps {
    active: boolean;
    onClick: () => void;
    title: string;
    subtitle?: string;
}

export const OptionButton = ({ active, onClick, title, subtitle }: OptionButtonProps) => (
    <button
        type="button"
        onClick={onClick}
        className={`w-full text-left p-3 rounded-lg border-2 transition-all text-sm ${active
            ? "border-blue-600 bg-blue-50"
            : "border-gray-300 bg-white hover:border-gray-400"
            }`}
    >
        <div className="font-bold text-gray-800">{title}</div>
        {subtitle && <div className="text-xs text-gray-600 mt-1">{subtitle}</div>}
    </button>
);
