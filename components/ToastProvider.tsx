"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
    title?: string;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType, duration?: number, title?: string) => void;
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
    warning: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: ToastType = "info", duration: number = 4000, title?: string) => {
        const id = Math.random().toString(36).substring(7);
        const newToast: Toast = { id, message, type, duration, title };

        setToasts((prev) => [...prev, newToast]);

        if (duration > 0) {
            setTimeout(() => removeToast(id), duration);
        }
    }, [removeToast]);

    const success = useCallback((message: string, duration = 4000) => {
        showToast(message, "success", duration, "Succes");
    }, [showToast]);

    const error = useCallback((message: string, duration = 5000) => {
        showToast(message, "error", duration, "Eroare");
    }, [showToast]);

    const info = useCallback((message: string, duration = 4000) => {
        showToast(message, "info", duration, "Info");
    }, [showToast]);

    const warning = useCallback((message: string, duration = 4000) => {
        showToast(message, "warning", duration, "Atenție");
    }, [showToast]);

    return (
        <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within ToastProvider");
    }
    return context;
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none sm:max-w-sm w-full font-sans">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
    const icons = {
        success: <div className="bg-emerald-100 p-1.5 rounded-full"><CheckCircle className="w-5 h-5 text-emerald-600" /></div>,
        error: <div className="bg-red-100 p-1.5 rounded-full"><AlertCircle className="w-5 h-5 text-red-600" /></div>,
        warning: <div className="bg-amber-100 p-1.5 rounded-full"><AlertTriangle className="w-5 h-5 text-amber-600" /></div>,
        info: <div className="bg-emerald-100 p-1.5 rounded-full"><Info className="w-5 h-5 text-emerald-600" /></div>,
    };

    const borders = {
        success: "border-l-4 border-l-emerald-500",
        error: "border-l-4 border-l-red-500",
        warning: "border-l-4 border-l-amber-500",
        info: "border-l-4 border-l-emerald-500",
    };

    return (
        <div
            className={`pointer-events-auto flex items-start gap-4 px-5 py-4 w-full bg-white rounded-lg shadow-2xl shadow-slate-200/50 border border-slate-100 backdrop-blur-md animate-in slide-in-from-bottom-5 fade-in duration-300 relative overflow-hidden group ${borders[toast.type]}`}
        >
            <div className="shrink-0 mt-0.5">
                {icons[toast.type]}
            </div>
            <div className="flex-1 min-w-0">
                {toast.title && <h4 className="font-bold text-slate-900 text-sm mb-0.5 leading-none">{toast.title}</h4>}
                <p className="text-sm text-slate-600 leading-snug">{toast.message}</p>
            </div>
            <button
                onClick={() => onRemove(toast.id)}
                className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors p-1"
                aria-label="Close"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}

