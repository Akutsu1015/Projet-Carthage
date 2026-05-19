"use client";

import { useEffect, useState } from "react";
import { Flame, AlertTriangle, PartyPopper } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useTranslation } from "@/lib/translation-context";

type NotifType = "danger" | "celebrate" | null;

export function StreakReminder() {
    const { user } = useAuth();
    const { lang } = useTranslation();
    const [visible, setVisible] = useState(false);
    const [notifType, setNotifType] = useState<NotifType>(null);

    useEffect(() => {
        if (!user) return;

        const key = `streak_reminder_${new Date().toISOString().slice(0, 10)}`;
        if (localStorage.getItem(key)) return; // already shown today

        // Determine notification type
        let type: NotifType = null;
        if (user.streak >= 7) {
            type = "celebrate";
        } else if (user.streak >= 1) {
            // Check if they already coded today from activity log
            const today = new Date().toISOString().slice(0, 10);
            try {
                const raw = localStorage.getItem("activity_log_v1");
                const log = raw ? JSON.parse(raw) : {};
                if (!log[today]) type = "danger";
            } catch { /* ignore */ }
        }

        if (!type) return;
        setNotifType(type);
        setVisible(true);
        localStorage.setItem(key, "1");

        const timeout = setTimeout(() => setVisible(false), 6000);
        return () => clearTimeout(timeout);
    }, [user]);

    if (!visible || !notifType || !user) return null;

    const configs = {
        danger: {
            icon: AlertTriangle,
            bg: "border-xana-red/30 bg-xana-red/[0.08]",
            iconColor: "text-xana-red",
            title: lang === "fr" ? "⚠️ Streak en danger !" : "⚠️ Streak in danger!",
            message: lang === "fr"
                ? `Votre streak de ${user.streak} jour${user.streak > 1 ? "s" : ""} expire bientôt. Complétez un exercice pour le maintenir !`
                : `Your ${user.streak}-day streak is about to expire. Complete an exercise to keep it!`,
        },
        celebrate: {
            icon: PartyPopper,
            bg: "border-carthage-gold/30 bg-carthage-gold/[0.08]",
            iconColor: "text-carthage-gold",
            title: lang === "fr" ? `🔥 ${user.streak} jours de streak !` : `🔥 ${user.streak}-day streak!`,
            message: lang === "fr"
                ? "Impressionnant ! Continuez sur cette lancée, guerrier de Lyoko !"
                : "Impressive! Keep it up, Lyoko warrior!",
        },
    };

    const cfg = configs[notifType];
    const Icon = cfg.icon;

    return (
        <div
            className={`fixed top-20 left-1/2 z-[150] -translate-x-1/2 transition-all duration-500 ${visible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"
                }`}
        >
            <div className={`flex items-center gap-3 rounded-xl border px-5 py-3 shadow-xl backdrop-blur-sm ${cfg.bg}`}>
                <Icon size={20} className={cfg.iconColor} />
                <div>
                    <p className="text-sm font-bold text-white">{cfg.title}</p>
                    <p className="text-xs text-white/50">{cfg.message}</p>
                </div>
                <button
                    onClick={() => setVisible(false)}
                    className="ml-2 rounded p-1 text-white/30 hover:text-white/60"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}
