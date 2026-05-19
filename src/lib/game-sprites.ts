/**
 * Game Sprites — Code Lyoko themed SVG sprites for Game Dev exercises
 * These are inline SVG strings that can be drawn onto a Canvas via Image elements.
 */

// ── Ulrich (Yellow samurai) ──
export const ULRICH_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 48" width="32" height="48">
  <defs><linearGradient id="ug" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fbbf24"/><stop offset="100%" stop-color="#b45309"/></linearGradient></defs>
  <rect x="10" y="0" width="12" height="14" rx="6" fill="#fcd34d" stroke="#92400e" stroke-width="0.5"/>
  <rect x="4" y="14" width="24" height="20" rx="3" fill="url(#ug)" stroke="#92400e" stroke-width="0.5"/>
  <rect x="2" y="16" width="6" height="14" rx="2" fill="#fbbf24"/>
  <rect x="24" y="16" width="6" height="14" rx="2" fill="#fbbf24"/>
  <line x1="28" y1="16" x2="32" y2="10" stroke="#a3a3a3" stroke-width="1.5" stroke-linecap="round"/>
  <rect x="8" y="34" width="7" height="14" rx="2" fill="#92400e"/>
  <rect x="17" y="34" width="7" height="14" rx="2" fill="#92400e"/>
  <circle cx="13" cy="7" r="1.5" fill="#1e293b"/>
  <circle cx="19" cy="7" r="1.5" fill="#1e293b"/>
</svg>`;

// ── Aelita (Pink guardian) ──
export const AELITA_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 48" width="32" height="48">
  <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f472b6"/><stop offset="100%" stop-color="#be185d"/></linearGradient></defs>
  <rect x="10" y="0" width="12" height="14" rx="6" fill="#fda4af" stroke="#9f1239" stroke-width="0.5"/>
  <path d="M8 4 Q16 -4 24 4" fill="#f472b6" stroke="#be185d" stroke-width="0.5"/>
  <rect x="4" y="14" width="24" height="20" rx="3" fill="url(#ag)" stroke="#9f1239" stroke-width="0.5"/>
  <rect x="2" y="16" width="6" height="12" rx="2" fill="#f472b6"/>
  <rect x="24" y="16" width="6" height="12" rx="2" fill="#f472b6"/>
  <circle cx="11" cy="26" r="3" fill="#ec4899" opacity="0.4"/>
  <circle cx="21" cy="26" r="3" fill="#ec4899" opacity="0.4"/>
  <rect x="8" y="34" width="7" height="14" rx="2" fill="#9f1239"/>
  <rect x="17" y="34" width="7" height="14" rx="2" fill="#9f1239"/>
  <circle cx="13" cy="7" r="1.5" fill="#1e293b"/>
  <circle cx="19" cy="7" r="1.5" fill="#1e293b"/>
</svg>`;

// ── Odd (Purple cat) ──
export const ODD_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 48" width="32" height="48">
  <defs><linearGradient id="og" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#c084fc"/><stop offset="100%" stop-color="#7c3aed"/></linearGradient></defs>
  <rect x="10" y="2" width="12" height="13" rx="6" fill="#e9d5ff" stroke="#6d28d9" stroke-width="0.5"/>
  <polygon points="10,4 7,0 10,2" fill="#c084fc"/>
  <polygon points="22,4 25,0 22,2" fill="#c084fc"/>
  <rect x="4" y="14" width="24" height="18" rx="3" fill="url(#og)" stroke="#6d28d9" stroke-width="0.5"/>
  <rect x="0" y="16" width="6" height="12" rx="2" fill="#c084fc"/>
  <rect x="26" y="16" width="6" height="12" rx="2" fill="#c084fc"/>
  <rect x="9" y="32" width="6" height="16" rx="2" fill="#6d28d9"/>
  <rect x="17" y="32" width="6" height="16" rx="2" fill="#6d28d9"/>
  <circle cx="13" cy="8" r="1.5" fill="#fbbf24"/>
  <circle cx="19" cy="8" r="1.5" fill="#fbbf24"/>
  <path d="M13 12 Q16 14 19 12" fill="none" stroke="#6d28d9" stroke-width="0.5"/>
</svg>`;

// ── Yumi (Black geisha) ──
export const YUMI_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 48" width="32" height="48">
  <defs><linearGradient id="yg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4b5563"/><stop offset="100%" stop-color="#111827"/></linearGradient></defs>
  <rect x="10" y="0" width="12" height="14" rx="6" fill="#f9fafb" stroke="#111827" stroke-width="0.5"/>
  <path d="M8 2 Q16 -2 24 2" fill="#111827"/>
  <rect x="4" y="14" width="24" height="20" rx="3" fill="url(#yg)" stroke="#111827" stroke-width="0.5"/>
  <rect x="2" y="16" width="6" height="14" rx="2" fill="#374151"/>
  <rect x="24" y="16" width="6" height="14" rx="2" fill="#374151"/>
  <rect x="8" y="34" width="7" height="14" rx="2" fill="#111827"/>
  <rect x="17" y="34" width="7" height="14" rx="2" fill="#111827"/>
  <circle cx="13" cy="7" r="1.5" fill="#111827"/>
  <circle cx="19" cy="7" r="1.5" fill="#111827"/>
</svg>`;

// ── Blok (cubic XANA monster) ──
export const BLOK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#6b7280"/><stop offset="100%" stop-color="#374151"/></linearGradient></defs>
  <rect x="2" y="2" width="36" height="36" rx="4" fill="url(#bg)" stroke="#111827" stroke-width="1"/>
  <circle cx="20" cy="20" r="8" fill="none" stroke="#ff2244" stroke-width="1.5"/>
  <circle cx="20" cy="20" r="3" fill="#ff2244"/>
  <line x1="20" y1="12" x2="20" y2="8" stroke="#ff2244" stroke-width="1"/>
  <line x1="20" y1="28" x2="20" y2="32" stroke="#ff2244" stroke-width="1"/>
  <line x1="12" y1="20" x2="8" y2="20" stroke="#ff2244" stroke-width="1"/>
  <line x1="28" y1="20" x2="32" y2="20" stroke="#ff2244" stroke-width="1"/>
</svg>`;

// ── Kankrelat (small XANA bug) ──
export const KANKRELAT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 24" width="32" height="24">
  <ellipse cx="16" cy="14" rx="12" ry="8" fill="#8b5e3c" stroke="#5c3a1e" stroke-width="0.5"/>
  <circle cx="16" cy="8" r="6" fill="#a0714f" stroke="#5c3a1e" stroke-width="0.5"/>
  <circle cx="16" cy="8" r="2.5" fill="#ff2244"/>
  <line x1="4" y1="14" x2="0" y2="20" stroke="#5c3a1e" stroke-width="1"/>
  <line x1="6" y1="18" x2="2" y2="24" stroke="#5c3a1e" stroke-width="1"/>
  <line x1="28" y1="14" x2="32" y2="20" stroke="#5c3a1e" stroke-width="1"/>
  <line x1="26" y1="18" x2="30" y2="24" stroke="#5c3a1e" stroke-width="1"/>
</svg>`;

// ── Tour de Lyoko ──
export const TOWER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 80" width="30" height="80">
  <defs><linearGradient id="tg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#00d4ff" stop-opacity="0.8"/><stop offset="100%" stop-color="#0050aa" stop-opacity="0.6"/></linearGradient></defs>
  <rect x="8" y="0" width="14" height="80" rx="7" fill="url(#tg)" stroke="#00d4ff" stroke-width="0.5" opacity="0.8"/>
  <ellipse cx="15" cy="78" rx="15" ry="3" fill="#00d4ff" opacity="0.3"/>
  <rect x="12" y="10" width="6" height="3" rx="1" fill="white" opacity="0.5"/>
  <rect x="12" y="20" width="6" height="3" rx="1" fill="white" opacity="0.4"/>
  <rect x="12" y="30" width="6" height="3" rx="1" fill="white" opacity="0.3"/>
  <rect x="12" y="40" width="6" height="3" rx="1" fill="white" opacity="0.3"/>
  <rect x="12" y="50" width="6" height="3" rx="1" fill="white" opacity="0.2"/>
</svg>`;

// ── Projectile (energy bolt) ──
export const PROJECTILE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 8" width="16" height="8">
  <defs><linearGradient id="pg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#00ff88" stop-opacity="0"/><stop offset="100%" stop-color="#00ff88"/></linearGradient></defs>
  <ellipse cx="12" cy="4" rx="4" ry="3" fill="#00ff88"/>
  <rect x="0" y="2" width="12" height="4" rx="2" fill="url(#pg)"/>
</svg>`;

// ── Étoile background ──
export const STAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 4" width="4" height="4">
  <circle cx="2" cy="2" r="1" fill="white"/>
</svg>`;

/**
 * Helper: returns an encoded data URI from an SVG string
 */
export function svgDataUri(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Full sprite library for use in exercise templates
 */
export const GAME_SPRITES = {
  ulrich: { svg: ULRICH_SVG, width: 32, height: 48 },
  aelita: { svg: AELITA_SVG, width: 32, height: 48 },
  odd: { svg: ODD_SVG, width: 32, height: 48 },
  yumi: { svg: YUMI_SVG, width: 32, height: 48 },
  blok: { svg: BLOK_SVG, width: 40, height: 40 },
  kankrelat: { svg: KANKRELAT_SVG, width: 32, height: 24 },
  tower: { svg: TOWER_SVG, width: 30, height: 80 },
  projectile: { svg: PROJECTILE_SVG, width: 16, height: 8 },
  star: { svg: STAR_SVG, width: 4, height: 4 },
} as const;
