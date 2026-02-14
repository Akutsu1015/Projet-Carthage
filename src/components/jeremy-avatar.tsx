"use client";

import { useEffect, useState } from "react";

interface JeremyAvatarProps {
  size?: number;
  speaking?: boolean;
  className?: string;
}

export default function JeremyAvatar({ size = 120, speaking = false, className = "" }: JeremyAvatarProps) {
  const [blink, setBlink] = useState(false);
  const [breathe, setBreathe] = useState(0);

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Breathing animation
  useEffect(() => {
    let frame: number;
    let t = 0;
    const animate = () => {
      t += 0.03;
      setBreathe(Math.sin(t) * 2);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const eyeHeight = blink ? 0.5 : 4;
  const eyeRy = blink ? 0.3 : 4;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 220"
      className={className}
      style={{ filter: "drop-shadow(0 4px 12px rgba(0,212,255,0.3))" }}
    >
      <defs>
        <linearGradient id="jeremy-hair" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5d76e" />
          <stop offset="100%" stopColor="#d4a017" />
        </linearGradient>
        <linearGradient id="jeremy-shirt" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4a90d9" />
          <stop offset="100%" stopColor="#2c5f8a" />
        </linearGradient>
        <linearGradient id="jeremy-skin" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fdd9b5" />
          <stop offset="100%" stopColor="#f5c396" />
        </linearGradient>
        <radialGradient id="jeremy-glasses-lens" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e8f4ff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#b8d8f8" stopOpacity="0.3" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Body group with breathing */}
      <g transform={`translate(0, ${breathe * 0.5})`}>

        {/* Neck */}
        <rect x="90" y="130" width="20" height="15" rx="5" fill="url(#jeremy-skin)" />

        {/* Body / Shirt — blue turtleneck like Jeremy */}
        <g transform={`translate(0, ${breathe * 0.3})`}>
          {/* Torso */}
          <path d="M60 145 Q60 140 70 138 L130 138 Q140 140 140 145 L145 200 L55 200 Z" fill="url(#jeremy-shirt)" />
          {/* Collar */}
          <path d="M80 138 Q100 148 120 138" fill="none" stroke="#3a7bc8" strokeWidth="2" />
          <path d="M82 140 Q100 150 118 140" fill="none" stroke="#3a7bc8" strokeWidth="1.5" />

          {/* Left arm */}
          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              values={speaking ? "0 70 145;-8 70 145;0 70 145;5 70 145;0 70 145" : "0 70 145;-3 70 145;0 70 145"}
              dur={speaking ? "0.8s" : "3s"}
              repeatCount="indefinite"
            />
            <path d="M68 145 Q50 155 42 180 Q40 188 48 190" fill="url(#jeremy-shirt)" stroke="#2c5f8a" strokeWidth="1" />
            {/* Hand */}
            <ellipse cx="48" cy="190" rx="8" ry="6" fill="url(#jeremy-skin)" />
          </g>

          {/* Right arm */}
          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              values={speaking ? "0 130 145;8 130 145;0 130 145;-5 130 145;0 130 145" : "0 130 145;3 130 145;0 130 145"}
              dur={speaking ? "0.7s" : "3.5s"}
              repeatCount="indefinite"
            />
            <path d="M132 145 Q150 155 158 180 Q160 188 152 190" fill="url(#jeremy-shirt)" stroke="#2c5f8a" strokeWidth="1" />
            {/* Hand */}
            <ellipse cx="152" cy="190" rx="8" ry="6" fill="url(#jeremy-skin)" />
          </g>
        </g>

        {/* Head group */}
        <g>
          {/* Head shape */}
          <ellipse cx="100" cy="90" rx="42" ry="48" fill="url(#jeremy-skin)" />

          {/* Hair — blonde, spiky like Jeremy */}
          <path d="M58 85 Q58 40 100 35 Q142 40 142 85 Q140 60 125 55 Q115 50 100 48 Q85 50 75 55 Q60 60 58 85 Z" fill="url(#jeremy-hair)" />
          {/* Hair spikes */}
          <path d="M70 50 Q65 30 75 38 Q72 25 85 35" fill="url(#jeremy-hair)" />
          <path d="M95 42 Q92 22 100 30 Q105 20 108 32 Q112 22 110 42" fill="url(#jeremy-hair)" />
          <path d="M125 48 Q130 28 122 38 Q128 25 118 35" fill="url(#jeremy-hair)" />
          {/* Side hair */}
          <path d="M58 85 Q52 70 58 60 Q55 75 62 80" fill="url(#jeremy-hair)" />
          <path d="M142 85 Q148 70 142 60 Q145 75 138 80" fill="url(#jeremy-hair)" />

          {/* Ears */}
          <ellipse cx="58" cy="90" rx="6" ry="8" fill="url(#jeremy-skin)" />
          <ellipse cx="142" cy="90" rx="6" ry="8" fill="url(#jeremy-skin)" />

          {/* Glasses frame — round like Jeremy's */}
          <g stroke="#4a4a4a" strokeWidth="2.5" fill="none">
            {/* Left lens frame */}
            <circle cx="82" cy="88" r="16" />
            {/* Right lens frame */}
            <circle cx="118" cy="88" r="16" />
            {/* Bridge */}
            <path d="M98 88 L102 88" />
            {/* Temple arms */}
            <path d="M66 86 L58 84" />
            <path d="M134 86 L142 84" />
          </g>

          {/* Lens reflection */}
          <circle cx="82" cy="88" r="14" fill="url(#jeremy-glasses-lens)" />
          <circle cx="118" cy="88" r="14" fill="url(#jeremy-glasses-lens)" />

          {/* Eyes behind glasses */}
          <ellipse cx="82" cy="89" rx="4" ry={eyeRy} fill="#2c3e50">
            <animate attributeName="ry" values={`${eyeRy};${eyeRy}`} dur="0.15s" />
          </ellipse>
          <ellipse cx="118" cy="89" rx="4" ry={eyeRy} fill="#2c3e50">
            <animate attributeName="ry" values={`${eyeRy};${eyeRy}`} dur="0.15s" />
          </ellipse>
          {/* Eye shine */}
          {!blink && (
            <>
              <circle cx="84" cy="87" r="1.5" fill="white" opacity="0.8" />
              <circle cx="120" cy="87" r="1.5" fill="white" opacity="0.8" />
            </>
          )}

          {/* Eyebrows */}
          <path d="M70 76 Q82 72 94 76" fill="none" stroke="#c9a030" strokeWidth="2" strokeLinecap="round" />
          <path d="M106 76 Q118 72 130 76" fill="none" stroke="#c9a030" strokeWidth="2" strokeLinecap="round" />

          {/* Nose */}
          <path d="M98 95 Q100 100 102 95" fill="none" stroke="#e8b88a" strokeWidth="1.5" strokeLinecap="round" />

          {/* Mouth */}
          {speaking ? (
            <g>
              <ellipse cx="100" cy="110" rx="8" ry="5" fill="#c0392b">
                <animate attributeName="ry" values="5;3;6;4;5" dur="0.4s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="100" cy="108" rx="6" ry="2" fill="white" opacity="0.3" />
            </g>
          ) : (
            <path d="M90 108 Q100 115 110 108" fill="none" stroke="#c0392b" strokeWidth="2" strokeLinecap="round" />
          )}

          {/* Blush */}
          <ellipse cx="70" cy="100" rx="8" ry="4" fill="#ffb3b3" opacity="0.25" />
          <ellipse cx="130" cy="100" rx="8" ry="4" fill="#ffb3b3" opacity="0.25" />
        </g>
      </g>

      {/* Subtle glow effect when speaking */}
      {speaking && (
        <circle cx="100" cy="110" r="95" fill="none" stroke="#00d4ff" strokeWidth="1" opacity="0.3">
          <animate attributeName="r" values="90;95;90" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
        </circle>
      )}
    </svg>
  );
}
