type Node = { angle: number; ring: number; label: string; alert?: boolean };

const NODES: Node[] = [
  { angle: 18, ring: 1, label: "AELITA" },
  { angle: 142, ring: 1, label: "JEREMIE" },
  { angle: 268, ring: 1, label: "SCIPIO" },
  { angle: 60, ring: 2, label: "RANGE-04", alert: true },
  { angle: 160, ring: 2, label: "RANGE-12" },
  { angle: 240, ring: 2, label: "RANGE-08" },
  { angle: 330, ring: 2, label: "RANGE-19" },
  { angle: 22, ring: 3, label: "NODE-117" },
  { angle: 88, ring: 3, label: "NODE-241" },
  { angle: 178, ring: 3, label: "NODE-318" },
  { angle: 256, ring: 3, label: "NODE-402" },
  { angle: 312, ring: 3, label: "NODE-549" },
];

const RING_RADII = [60, 120, 184];

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function NetworkViewport() {
  const cx = 240;
  const cy = 240;
  return (
    <svg viewBox="0 0 480 480" className="w-full h-full" aria-hidden>
      <defs>
        <radialGradient id="carthage-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--carthage-text)" stopOpacity="0.18" />
          <stop offset="60%" stopColor="var(--carthage-text)" stopOpacity="0.04" />
          <stop offset="100%" stopColor="var(--carthage-text)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g stroke="var(--carthage-line-strong)" strokeWidth="0.5" fill="none">
        <line x1="0" y1={cy} x2="480" y2={cy} />
        <line x1={cx} y1="0" x2={cx} y2="480" />
        <line x1="0" y1="0" x2="480" y2="480" strokeDasharray="2 6" opacity="0.4" />
        <line x1="480" y1="0" x2="0" y2="480" strokeDasharray="2 6" opacity="0.4" />
      </g>

      <circle cx={cx} cy={cy} r="220" fill="url(#carthage-core)" />

      {RING_RADII.map((r, i) => (
        <circle
          key={r}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="var(--carthage-line-strong)"
          strokeWidth="0.5"
          strokeDasharray={i === 0 ? "none" : i === 1 ? "1 3" : "1 6"}
        />
      ))}

      <g className="radar" style={{ transformOrigin: `${cx}px ${cy}px` }}>
        <line
          x1={cx}
          y1={cy}
          x2={cx + 220}
          y2={cy}
          stroke="var(--carthage-text)"
          strokeWidth="0.5"
          opacity="0.5"
        />
      </g>

      <circle cx={cx} cy={cy} r="20" fill="none" stroke="var(--carthage-text)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r="3" fill="var(--carthage-text)" />
      <text
        x={cx}
        y={cy + 38}
        textAnchor="middle"
        fontSize="9"
        letterSpacing="2"
        fill="var(--carthage-muted)"
        fontFamily="var(--font-mono)"
      >
        CARTHAGE / CORE
      </text>

      {NODES.map((n, i) => {
        const r = RING_RADII[n.ring - 1];
        const { x, y } = polar(cx, cy, r, n.angle);
        const stroke = n.alert ? "var(--carthage-alert)" : "var(--carthage-text)";
        return (
          <g key={i}>
            <line
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke="var(--carthage-line)"
              strokeWidth="0.5"
            />
            <rect
              x={x - 3}
              y={y - 3}
              width="6"
              height="6"
              fill="var(--carthage-bg)"
              stroke={stroke}
              strokeWidth="1"
              className={n.alert ? "blink" : undefined}
            />
            <text
              x={x + 8}
              y={y + 3}
              fontSize="8"
              letterSpacing="1.5"
              fill={n.alert ? "var(--carthage-alert)" : "var(--carthage-faint)"}
              fontFamily="var(--font-mono)"
            >
              {n.label}
            </text>
          </g>
        );
      })}

      <g fill="none" stroke="var(--carthage-line-strong)" strokeWidth="0.5">
        <path d="M 12 12 L 12 28 M 12 12 L 28 12" />
        <path d="M 468 12 L 468 28 M 468 12 L 452 12" />
        <path d="M 12 468 L 12 452 M 12 468 L 28 468" />
        <path d="M 468 468 L 468 452 M 468 468 L 452 468" />
      </g>
    </svg>
  );
}
