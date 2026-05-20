"use client";

import { useState } from "react";
import { Check } from "lucide-react";

const COLORS = [
  "#00d4ff", // lyoko-blue (Aelita)
  "#00ff88", // lyoko-green
  "#a855f7", // lyoko-purple (Yumi)
  "#ff2244", // xana-red
  "#fbbf24", // carthage-gold (Jérémie)
  "#fb923c", // orange (Odd)
  "#f472b6", // pink
  "#94a3b8", // gray
];

interface Props {
  initialValue: string;        // current initials
  initialColor: string;        // current color hex
  displayName: string;         // to derive default initials
  onSaved?: (next: { value: string; color: string }) => void;
}

/**
 * Lightweight avatar customization: pick 2-3 letters + a color from the
 * Lyoko palette. Persists to /api/db/user updateAvatar.
 */
export function AvatarEditor({ initialValue, initialColor, displayName, onSaved }: Props) {
  const defaultInitials = displayName.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase() || "??";
  const [value, setValue] = useState(initialValue || defaultInitials);
  const [color, setColor] = useState(initialColor || COLORS[0]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/db/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateAvatar", type: "initials", value: value.toUpperCase().slice(0, 3), color }),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        onSaved?.({ value, color });
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-5">
        {/* Preview */}
        <div
          className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full border-2 font-display text-2xl font-bold"
          style={{ borderColor: color, color, background: `${color}1a` }}
        >
          {value.toUpperCase().slice(0, 3) || "??"}
        </div>

        <div className="flex-1 space-y-2">
          <label className="block text-xs uppercase tracking-wide text-white/40">Initiales (1-3 lettres)</label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value.replace(/[^A-Za-z]/g, "").slice(0, 3))}
            maxLength={3}
            className="w-32 rounded-lg border border-white/10 bg-dark-bg px-3 py-2 font-mono text-sm uppercase text-white focus:border-lyoko-blue/40 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs uppercase tracking-wide text-white/40">Couleur</label>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`relative h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
                c === color ? "border-white" : "border-white/20"
              }`}
              style={{ background: c }}
              aria-label={`Couleur ${c}`}
            >
              {c === color && <Check size={14} className="absolute inset-0 m-auto text-dark-bg" />}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="flex items-center gap-2 rounded-lg bg-lyoko-blue/20 px-4 py-2 text-sm font-semibold text-lyoko-blue hover:bg-lyoko-blue/30 disabled:opacity-50"
      >
        {saved ? (<><Check size={14} /> Enregistré</>) : (saving ? "Enregistrement…" : "Enregistrer")}
      </button>
    </div>
  );
}
