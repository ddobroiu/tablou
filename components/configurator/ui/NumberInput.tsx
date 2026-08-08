"use client";

import React, { useEffect, useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";

interface NumberInputProps {
    label: string;
    value: number;
    onChange: (v: number) => void;
    step?: number;
    min?: number;
}

export const NumberInput = ({ label, value, onChange, step = 1, min = 1 }: NumberInputProps) => {
    const [text, setText] = useState(String(value));
    const isEditingRef = useRef(false);

    useEffect(() => {
        if (!isEditingRef.current) {
            setText(String(value));
        }
    }, [value]);

    const commit = (raw: string) => {
        const trimmed = raw.trim();
        if (trimmed === "") {
            onChange(min);
            setText(String(min));
            return;
        }
        const parsed = parseInt(trimmed, 10);
        const next = Number.isFinite(parsed) && parsed > 0 ? Math.max(min, parsed) : min;
        onChange(next);
        setText(String(next));
    };

    const inc = (d: number) => {
        isEditingRef.current = false;
        const next = Math.max(min, value + d);
        onChange(next);
        setText(String(next));
    };

    return (
        <div>
            {label ? <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{label}</label> : null}
            <div className="flex">
                <button
                    type="button"
                    onClick={() => inc(-step)}
                    disabled={value <= min}
                    className="p-3 bg-gray-100 rounded-l-lg hover:bg-gray-200 disabled:opacity-50"
                    aria-label={`Scade ${label.toLowerCase()}`}
                >
                    <Minus size={16} />
                </button>
                <input
                    type="text"
                    inputMode="numeric"
                    value={text}
                    onFocus={(e) => {
                        isEditingRef.current = true;
                        e.target.select();
                    }}
                    onChange={(e) => {
                        const v = e.target.value;
                        if (v === "" || /^\d+$/.test(v)) {
                            setText(v);
                        }
                    }}
                    onBlur={() => {
                        isEditingRef.current = false;
                        commit(text);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            isEditingRef.current = false;
                            commit(text);
                            (e.target as HTMLInputElement).blur();
                        }
                    }}
                    className="w-full text-center border-y border-gray-200 dark:border-slate-800 focus:outline-none"
                />
                <button
                    type="button"
                    onClick={() => inc(step)}
                    className="p-3 bg-gray-100 rounded-r-lg hover:bg-gray-200"
                    aria-label={`Crește ${label.toLowerCase()}`}
                >
                    <Plus size={16} />
                </button>
            </div>
        </div>
    );
};
