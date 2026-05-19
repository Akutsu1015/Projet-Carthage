"use client";

import { useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════
// PARTICLE BURST EFFECT - Explosion de particules magiques
// ═══════════════════════════════════════════════════════════════

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  rotation: number;
  rotationSpeed: number;
  shape: "circle" | "star" | "diamond" | "square";
}

export function triggerParticleBurst(
  x: number,
  y: number,
  options: {
    count?: number;
    colors?: string[];
    spread?: number;
    speed?: number;
    size?: { min: number; max: number };
    shapes?: ("circle" | "star" | "diamond" | "square")[];
  } = {}
) {
  const event = new CustomEvent("particleBurst", {
    detail: { x, y, ...options },
  });
  window.dispatchEvent(event);
}

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | undefined>(undefined);

  const createParticle = (
    x: number,
    y: number,
    colors: string[],
    spread: number,
    speed: number,
    size: { min: number; max: number },
    shapes: ("circle" | "star" | "diamond" | "square")[]
  ): Particle => {
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * speed * spread;
    const particleSize = size.min + Math.random() * (size.max - size.min);
    const life = 60 + Math.random() * 40;

    return {
      x,
      y,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity - Math.random() * 3,
      size: particleSize,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      life,
      maxLife: life,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleBurst = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { x, y, count = 30, colors = ["#00d4ff", "#00ff88", "#fbbf24", "#a855f7"], spread = 1, speed = 5, size = { min: 2, max: 6 }, shapes = ["circle", "star"] } = customEvent.detail;

      for (let i = 0; i < count; i++) {
        particlesRef.current.push(createParticle(x, y, colors, spread, speed, size, shapes));
      }
    };

    window.addEventListener("particleBurst", handleBurst);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // gravity
        p.vx *= 0.98; // air resistance
        p.life--;
        p.rotation += p.rotationSpeed;
        p.alpha = Math.max(0, p.life / p.maxLife);

        if (p.life <= 0) return false;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        switch (p.shape) {
          case "circle":
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            ctx.fill();
            break;
          case "star":
            drawStar(ctx, 0, 0, 5, p.size, p.size / 2);
            break;
          case "diamond":
            ctx.beginPath();
            ctx.moveTo(0, -p.size);
            ctx.lineTo(p.size, 0);
            ctx.lineTo(0, p.size);
            ctx.lineTo(-p.size, 0);
            ctx.closePath();
            ctx.fill();
            break;
          case "square":
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            break;
        }

        ctx.restore();
        return true;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("particleBurst", handleBurst);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [createParticle]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number
) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fill();
}

// ═══════════════════════════════════════════════════════════════
// FLOATING TEXT EFFECT - Texte qui flotte et disparaît
// ═══════════════════════════════════════════════════════════════

export function triggerFloatingText(
  x: number,
  y: number,
  text: string,
  options: {
    color?: string;
    size?: number;
    duration?: number;
    offsetY?: number;
  } = {}
) {
  const event = new CustomEvent("floatingText", {
    detail: { x, y, text, ...options },
  });
  window.dispatchEvent(event);
}

export function FloatingTextContainer() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFloatingText = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { x, y, text, color = "#00ff88", size = 16, duration = 1500, offsetY = -50 } = customEvent.detail;

      const el = document.createElement("div");
      el.textContent = text;
      el.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        color: ${color};
        font-size: ${size}px;
        font-weight: bold;
        pointer-events: none;
        z-index: 10000;
        text-shadow: 0 0 20px ${color}80;
        transition: all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
        transform: translate(-50%, -50%);
      `;

      containerRef.current?.appendChild(el);

      requestAnimationFrame(() => {
        el.style.transform = `translate(-50%, calc(-50% + ${offsetY}px)) scale(1.2)`;
        el.style.opacity = "0";
      });

      setTimeout(() => el.remove(), duration);
    };

    window.addEventListener("floatingText", handleFloatingText);
    return () => window.removeEventListener("floatingText", handleFloatingText);
  }, []);

  return <div ref={containerRef} className="pointer-events-none" />;
}

// ═══════════════════════════════════════════════════════════════
// RIPPLE EFFECT - Onde circulaire au clic
// ═══════════════════════════════════════════════════════════════

export function triggerRipple(x: number, y: number, color: string = "#00d4ff") {
  const event = new CustomEvent("ripple", {
    detail: { x, y, color },
  });
  window.dispatchEvent(event);
}

export function RippleContainer() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleRipple = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { x, y, color } = customEvent.detail;

      const ripple = document.createElement("div");
      ripple.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: ${color}40;
        border: 2px solid ${color};
        pointer-events: none;
        z-index: 9998;
        transform: translate(-50%, -50%);
        animation: rippleExpand 0.6s ease-out forwards;
      `;

      const style = document.createElement("style");
      style.textContent = `
        @keyframes rippleExpand {
          to {
            width: 100px;
            height: 100px;
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);

      containerRef.current?.appendChild(ripple);
      setTimeout(() => {
        ripple.remove();
        style.remove();
      }, 600);
    };

    window.addEventListener("ripple", handleRipple);
    return () => window.removeEventListener("ripple", handleRipple);
  }, []);

  return <div ref={containerRef} className="pointer-events-none" />;
}

// ═══════════════════════════════════════════════════════════════
// GLOW EFFECT - Effet de lueur pulsante
// ═══════════════════════════════════════════════════════════════

export function GlowBorder({
  children,
  color = "#00d4ff",
  intensity = "medium",
  className = "",
}: {
  children: React.ReactNode;
  color?: string;
  intensity?: "low" | "medium" | "high";
  className?: string;
}) {
  const intensityMap = {
    low: { blur: "10px", spread: "2px", opacity: 0.3 },
    medium: { blur: "20px", spread: "4px", opacity: 0.5 },
    high: { blur: "40px", spread: "8px", opacity: 0.7 },
  };

  const { blur, spread, opacity } = intensityMap[intensity];

  return (
    <div className={`relative ${className}`}>
      <div
        className="absolute inset-0 rounded-inherit animate-pulse"
        style={{
          background: color,
          filter: `blur(${blur})`,
          opacity,
          transform: "scale(1.02)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SHINE EFFECT - Reflet lumineux qui traverse
// ═══════════════════════════════════════════════════════════════

export function ShineEffect({
  children,
  className = "",
  duration = 2,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
          animation: `shine ${duration}s ease-in-out ${delay}s infinite`,
        }}
      />
      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          50%, 100% { transform: translateX(100%); }
        }
      `}</style>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// BOUNCE SCALE - Animation de rebond
// ═══════════════════════════════════════════════════════════════

export function BounceScale({
  children,
  active = false,
  className = "",
}: {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`transition-transform ${className}`}
      style={{
        animation: active ? "bounceScale 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)" : "none",
      }}
    >
      <style>{`
        @keyframes bounceScale {
          0% { transform: scale(1); }
          40% { transform: scale(1.15); }
          60% { transform: scale(0.95); }
          80% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// FLIP CARD - Carte qui se retourne
// ═══════════════════════════════════════════════════════════════

export function FlipCard({
  front,
  back,
  isFlipped = false,
  className = "",
}: {
  front: React.ReactNode;
  back: React.ReactNode;
  isFlipped?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`} style={{ perspective: "1000px" }}>
      <div
        className="relative w-full h-full transition-transform duration-600"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <div
          className="absolute inset-0 backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          {front}
        </div>
        <div
          className="absolute inset-0 backface-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {back}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CONFETTI RAIN - Pluie de confettis
// ═══════════════════════════════════════════════════════════════

export function triggerConfettiRain(
  options: {
    count?: number;
    colors?: string[];
    duration?: number;
  } = {}
) {
  const event = new CustomEvent("confettiRain", {
    detail: { ...options },
  });
  window.dispatchEvent(event);
}

export function ConfettiRainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const confettiRef = useRef<
    { x: number; y: number; color: string; size: number; speed: number; wobble: number }[]
  >([]);
  const rafRef = useRef<number | undefined>(undefined);
  const isRunningRef = useRef<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleConfettiRain = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { count = 100, colors = ["#00d4ff", "#00ff88", "#fbbf24", "#a855f7", "#ff2244"], duration = 3000 } = customEvent.detail;

      for (let i = 0; i < count; i++) {
        confettiRef.current.push({
          x: Math.random() * canvas.width,
          y: -20 - Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 5 + Math.random() * 10,
          speed: 2 + Math.random() * 4,
          wobble: Math.random() * Math.PI * 2,
        });
      }

      isRunningRef.current = true;
      setTimeout(() => {
        isRunningRef.current = false;
      }, duration);
    };

    window.addEventListener("confettiRain", handleConfettiRain);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (confettiRef.current.length > 0 || isRunningRef.current) {
        confettiRef.current = confettiRef.current.filter((c) => {
          c.y += c.speed;
          c.wobble += 0.1;
          c.x += Math.sin(c.wobble) * 2;

          ctx.fillStyle = c.color;
          ctx.fillRect(c.x, c.y, c.size, c.size * 0.6);

          return c.y < canvas.height + 20;
        });
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("confettiRain", handleConfettiRain);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9998]"
    />
  );
}
