"use client";

import { useState, useCallback, useEffect, createContext, useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextValue {
    toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => { } });

export function useToast() {
    return useContext(ToastContext);
}

const ICONS: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
    error: <XCircle className="w-4 h-4 text-rose-500 shrink-0" />,
    info: <Info className="w-4 h-4 text-indigo-500 shrink-0" />,
};

const STYLES: Record<ToastType, string> = {
    success: "border-emerald-200 bg-white dark:bg-card",
    error: "border-rose-200 bg-white dark:bg-card",
    info: "border-indigo-200 bg-white dark:bg-card",
};

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
    useEffect(() => {
        const t = setTimeout(() => onRemove(toast.id), 4000);
        return () => clearTimeout(t);
    }, [toast.id, onRemove]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-xl shadow-black/10 backdrop-blur-xl min-w-[240px] max-w-xs ${STYLES[toast.type]}`}
        >
            {ICONS[toast.type]}
            <span className="text-xs font-bold text-foreground flex-1 leading-snug">{toast.message}</span>
            <button
                onClick={() => onRemove(toast.id)}
                className="text-muted-foreground hover:text-foreground transition-colors ml-1 shrink-0"
            >
                <X className="w-3.5 h-3.5" />
            </button>
        </motion.div>
    );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const remove = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const toast = useCallback((message: string, type: ToastType = "info") => {
        const id = Math.random().toString(36).slice(2);
        setToasts(prev => [...prev.slice(-4), { id, message, type }]);
    }, []);

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-[200] flex flex-col gap-2 items-end">
                <AnimatePresence mode="popLayout">
                    {toasts.map(t => (
                        <ToastItem key={t.id} toast={t} onRemove={remove} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}
