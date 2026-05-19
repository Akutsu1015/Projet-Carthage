"use client";

import { useEffect, useState, useRef } from "react";
import { Sparkles, ArrowUp } from "lucide-react";
import { useTranslation } from "@/lib/translation-context";

interface LevelUpProps {
    level: number;
    onClose: () => void;
}

export function LevelUpAnimation({ level, onClose }: LevelUpProps) {
    const { lang } = useTranslation();
    const [phase, setPhase] = useState<"enter" | "show" | "exit">("enter");
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Auto-close after animation
    useEffect(() => {
        const t1 = setTimeout(() => setPhase("show"), 100);
        const t2 = setTimeout(() => setPhase("exit"), 3500);
        const t3 = setTimeout(onClose, 4200);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, [onClose]);

    // Particle system
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles: { x: number; y: number; vx: number; vy: number; size: number; color: string; alpha: number; life: number }[] = [];
        const colors = ["#00d4ff", "#00ff88", "#fbbf24", "#a855f7", "#ff2244"];

        // Create burst particles
        for (let i = 0; i < 120; i++) {
            const angle = (Math.PI * 2 * i) / 120 + Math.random() * 0.5;
            const speed = 2 + Math.random() * 6;
            particles.push({
                x: canvas.width / 2,
                y: canvas.height / 2,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2,
                size: 2 + Math.random() * 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 1,
                life: 60 + Math.random() * 60,
            });
        }

        let frame: number;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let alive = false;
            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.06; // gravity
                p.life--;
                p.alpha = Math.max(0, p.life / 120);
                if (p.life <= 0) continue;
                alive = true;
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
            if (alive) frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, []);

    return (
        <div
            className={`fixed inset-0 z-[200] flex items-center justify-center transition-all duration-700 ${phase === "enter" ? "bg-black/0" : phase === "show" ? "bg-black/70" : "bg-black/0 pointer-events-none"
                }`}
            onClick={onClose}
        >
            <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" />

            <div
                className={`relative z-10 flex flex-col items-center transition-all duration-700 ${phase === "enter" ? "scale-50 opacity-0" : phase === "show" ? "scale-100 opacity-100" : "scale-150 opacity-0"
                    }`}
            >
                {/* Glow ring */}
                <div className="absolute -inset-20 rounded-full bg-[radial-gradient(circle,rgba(0,212,255,0.15)_0%,transparent_70%)] animate-pulse" />

                {/* Level badge */}
                <div className="relative mb-4">
                    <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-lyoko-blue bg-gradient-to-br from-dark-bg to-dark-surface shadow-[0_0_60px_rgba(0,212,255,0.4),0_0_120px_rgba(0,212,255,0.15)]">
                        <span className="font-display text-5xl font-black text-lyoko-blue drop-shadow-[0_0_20px_rgba(0,212,255,0.8)]">
                            {level}
                        </span>
                    </div>
                    <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-carthage-gold shadow-[0_0_15px_rgba(251,191,36,0.5)]">
                        <ArrowUp size={16} className="text-dark-bg" />
                    </div>
                </div>

                {/* Text */}
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="text-carthage-gold" size={20} />
                    <span className="font-display text-sm font-bold tracking-[6px] uppercase text-carthage-gold">
                        Level Up
                    </span>
                    <Sparkles className="text-carthage-gold" size={20} />
                </div>

                <h2 className="font-display text-3xl font-black text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                    {lang === "fr" ? `Niveau ${level} atteint !` : `Level ${level} reached!`}
                </h2>

                <p className="mt-2 text-sm text-white/50">
                    {lang === "fr" ? "Continuez votre progression, guerrier de Lyoko" : "Continue your progress, Lyoko warrior"}
                </p>
            </div>
        </div>
    );
}
