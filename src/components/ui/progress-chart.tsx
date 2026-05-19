"use client";

import { useEffect, useState, useRef } from "react";
import { TrendingUp } from "lucide-react";

const STORAGE_KEY = "activity_log_v1";

function getDateKey(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getLast30Days(): string[] {
    const days: string[] = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        days.push(getDateKey(d));
    }
    return days;
}

function formatDateShort(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

/* ═══ COMPONENT ═══ */
export function ProgressChart() {
    const [log, setLog] = useState<Record<string, number>>({});
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    const days = getLast30Days();

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) setLog(JSON.parse(raw));
        } catch { /* ignore */ }
    }, []);

    // Chart dimensions
    const W = 700;
    const H = 180;
    const PADDING = { top: 20, right: 20, bottom: 30, left: 35 };
    const chartW = W - PADDING.left - PADDING.right;
    const chartH = H - PADDING.top - PADDING.bottom;

    // Data points
    const values = days.map((d) => log[d] || 0);
    const maxVal = Math.max(...values, 1);

    // Scale
    const xScale = (i: number) => PADDING.left + (i / (days.length - 1)) * chartW;
    const yScale = (v: number) => PADDING.top + chartH - (v / maxVal) * chartH;

    // Line path
    const linePoints = values.map((v, i) => `${xScale(i)},${yScale(v)}`).join(" ");

    // Area path (for gradient fill)
    const areaPath = `M ${xScale(0)},${yScale(values[0])} ` +
        values.map((v, i) => `L ${xScale(i)},${yScale(v)}`).join(" ") +
        ` L ${xScale(values.length - 1)},${PADDING.top + chartH} L ${xScale(0)},${PADDING.top + chartH} Z`;

    // Smooth line using cardinal spline
    const smoothLine = (() => {
        const pts = values.map((v, i) => ({ x: xScale(i), y: yScale(v) }));
        if (pts.length < 2) return "";
        let d = `M ${pts[0].x},${pts[0].y}`;
        for (let i = 0; i < pts.length - 1; i++) {
            const p0 = pts[Math.max(0, i - 1)];
            const p1 = pts[i];
            const p2 = pts[Math.min(pts.length - 1, i + 1)];
            const p3 = pts[Math.min(pts.length - 1, i + 2)];
            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;
            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;
            d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
        }
        return d;
    })();

    // Smooth area
    const smoothArea = smoothLine +
        ` L ${xScale(values.length - 1)},${PADDING.top + chartH} L ${xScale(0)},${PADDING.top + chartH} Z`;

    // Y-axis ticks
    const yTicks = [0, Math.round(maxVal / 2), maxVal];

    // X-axis labels (show every 5th + last)
    const xLabels = days.filter((_, i) => i % 7 === 0 || i === days.length - 1);

    // Total this period
    const totalPeriod = values.reduce((a, b) => a + b, 0);
    const avgPerDay = (totalPeriod / 30).toFixed(1);

    return (
        <div className="mb-8 rounded-2xl border border-white/8 bg-white/[0.02] p-5">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-lyoko-blue" />
                    <span className="font-display text-sm font-bold text-white">
                        Progression
                    </span>
                    <span className="text-xs text-white/40">30 derniers jours</span>
                </div>
                <div className="flex gap-4 text-right text-xs text-white/40">
                    <span>
                        <span className="font-bold text-white">{totalPeriod}</span> exercices
                    </span>
                    <span>
                        <span className="font-bold text-white">{avgPerDay}</span> /jour
                    </span>
                </div>
            </div>

            {/* Chart */}
            <div className="relative w-full overflow-hidden" style={{ aspectRatio: `${W}/${H}` }}>
                <svg
                    ref={svgRef}
                    viewBox={`0 0 ${W} ${H}`}
                    className="h-full w-full"
                    preserveAspectRatio="xMidYMid meet"
                    onMouseLeave={() => setHoveredIdx(null)}
                >
                    <defs>
                        {/* Area gradient */}
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
                        </linearGradient>
                        {/* Line gradient */}
                        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#00d4ff" />
                            <stop offset="100%" stopColor="#00ff88" />
                        </linearGradient>
                    </defs>

                    {/* Grid lines */}
                    {yTicks.map((tick, i) => (
                        <g key={i}>
                            <line
                                x1={PADDING.left}
                                y1={yScale(tick)}
                                x2={W - PADDING.right}
                                y2={yScale(tick)}
                                stroke="rgba(255,255,255,0.06)"
                                strokeDasharray="4,4"
                            />
                            <text
                                x={PADDING.left - 8}
                                y={yScale(tick) + 4}
                                textAnchor="end"
                                fill="rgba(255,255,255,0.25)"
                                fontSize="10"
                                fontFamily="var(--font-mono)"
                            >
                                {tick}
                            </text>
                        </g>
                    ))}

                    {/* X labels */}
                    {xLabels.map((dateStr) => {
                        const idx = days.indexOf(dateStr);
                        return (
                            <text
                                key={dateStr}
                                x={xScale(idx)}
                                y={H - 6}
                                textAnchor="middle"
                                fill="rgba(255,255,255,0.25)"
                                fontSize="9"
                                fontFamily="var(--font-mono)"
                            >
                                {formatDateShort(dateStr)}
                            </text>
                        );
                    })}

                    {/* Area fill */}
                    <path d={smoothArea} fill="url(#areaGrad)" />

                    {/* Line */}
                    <path
                        d={smoothLine}
                        fill="none"
                        stroke="url(#lineGrad)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ filter: "drop-shadow(0 0 6px rgba(0,212,255,0.4))" }}
                    />

                    {/* Data points (only show dots on hover zones) */}
                    {values.map((v, i) => (
                        <g key={i}>
                            {/* Hover zone */}
                            <rect
                                x={xScale(i) - chartW / days.length / 2}
                                y={PADDING.top}
                                width={chartW / days.length}
                                height={chartH}
                                fill="transparent"
                                onMouseEnter={() => setHoveredIdx(i)}
                            />
                            {/* Dot */}
                            {(hoveredIdx === i || (v > 0 && hoveredIdx === null && (i === values.length - 1))) && (
                                <>
                                    <circle
                                        cx={xScale(i)}
                                        cy={yScale(v)}
                                        r={5}
                                        fill="#0a1628"
                                        stroke="#00d4ff"
                                        strokeWidth={2}
                                        style={{ filter: "drop-shadow(0 0 4px rgba(0,212,255,0.5))" }}
                                    />
                                    {/* Tooltip */}
                                    <g>
                                        <rect
                                            x={xScale(i) - 40}
                                            y={yScale(v) - 32}
                                            width={80}
                                            height={22}
                                            rx={6}
                                            fill="#0f1f3a"
                                            stroke="rgba(0,212,255,0.3)"
                                            strokeWidth={1}
                                        />
                                        <text
                                            x={xScale(i)}
                                            y={yScale(v) - 18}
                                            textAnchor="middle"
                                            fill="#00d4ff"
                                            fontSize="10"
                                            fontWeight="bold"
                                            fontFamily="var(--font-mono)"
                                        >
                                            {v} ex · {formatDateShort(days[i])}
                                        </text>
                                    </g>
                                </>
                            )}
                        </g>
                    ))}
                </svg>
            </div>
        </div>
    );
}
