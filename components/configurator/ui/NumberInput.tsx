import React from "react";
import { Plus, Minus } from "lucide-react";

interface NumberInputProps {
    label: string;
    value: number;
    onChange: (v: number) => void;
    step?: number;
}

export const NumberInput = ({ label, value, onChange, step = 10 }: NumberInputProps) => {
    const inc = (d: number) => onChange(Math.max(1, value + d));

    return (
        <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
            <div className="flex">
                <button
                    type="button"
                    onClick={() => inc(-step)}
                    className="p-3 bg-gray-100 rounded-l-lg hover:bg-gray-200"
                    aria-label={`Scade ${label.toLowerCase()}`}
                >
                    <Minus size={16} />
                </button>
                <input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full text-center border-y border-gray-200 focus:outline-none"
                    min="1"
                />
                <button
                    type="button"
                    onClick={() => inc(step)}
                    className="p-3 bg-gray-100 rounded-r-lg hover:bg-gray-200"
                    aria-label={`Creşte ${label.toLowerCase()}`}
                >
                    <Plus size={16} />
                </button>
            </div>
        </div>
    );
};
