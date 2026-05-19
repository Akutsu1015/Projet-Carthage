"use client";

import { useEffect, useState } from "react";
import { Zap, Flame } from "lucide-react";

export interface XpToastData {
    id: number;
    amount: number;
    combo?: number; // multiplier (1 = normal, 2 = x2, etc.)
    label?: string; // e.g. "Bonne réponse !" or "Vitesse!" 
}

interface Props {
    toasts: XpToastData[];
    onRemove: (id: number) => void;
}

function SingleToast({ toast, onRemove }: { toast: XpToastData; onRemove: () => void }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Fade in
        const t1 = setTimeout(() => setVisible(true), 20);
        // Fade out
        const t2 = setTimeout(() => setVisible(false), 1600);
        // Remove
        const t3 = setTimeout(() => onRemove(), 2000);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isCombo = toast.combo && toast.combo >= 2;

    return (
        <div
            className="pointer-events-none flex flex-col items-center gap-1 transition-all duration-500"
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(-8px) scale(1)" : "translateY(20px) scale(0.7)",
            }}
        >
            {isCombo && (
                <div className="flex items-center gap-1 rounded-full border border-xana-red/40 bg-xana-red/15 px-3 py-0.5 text-xs font-bold text-xana-red shadow-[0_0_12px_rgba(255,34,68,0.3)]">
                    <Flame size={11} className="animate-pulse" />
                    COMBO ×{toast.combo}
                </div>
            )}
            <div
                className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold shadow-2xl ${isCombo
                        ? "border-xana-red/30 bg-dark-surface text-xana-red shadow-[0_0_20px_rgba(255,34,68,0.25)]"
                        : "border-lyoko-green/30 bg-dark-surface text-lyoko-green shadow-[0_0_20px_rgba(0,255,136,0.2)]"
                    }`}
            >
                <Zap size={14} className={isCombo ? "text-xana-red" : "text-carthage-gold"} style={{ fill: "currentColor" }} />
                +{toast.amount} XP
                {toast.label && <span className="text-xs font-normal opacity-70">{toast.label}</span>}
            </div>
        </div>
    );
}

export function XpToastContainer({ toasts, onRemove }: Props) {
    return (
        <div className="pointer-events-none fixed bottom-24 left-1/2 z-[200] flex -translate-x-1/2 flex-col-reverse items-center gap-2">
            {toasts.map((t) => (
                <SingleToast key={t.id} toast={t} onRemove={() => onRemove(t.id)} />
            ))}
        </div>
    );
}
