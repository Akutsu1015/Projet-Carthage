"use client";

import { useState } from "react";
import { Check, X, Pencil } from "lucide-react";
import { useTranslation } from "@/lib/translation-context";

interface Props {
  initial: string;
  /** Called after save succeeds, with the new bio. */
  onSaved?: (bio: string) => void;
}

/**
 * Inline bio editor. Renders as plain text with a pencil icon until clicked.
 * 280 chars max, debounced char counter, ESC cancels.
 */
export function BioEditor({ initial, onSaved }: Props) {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initial || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remaining = 280 - value.length;

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/db/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateBio", bio: value }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Erreur");
      onSaved?.(value);
      setEditing(false);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (!editing) {
    return (
      <div className="group flex items-start gap-2">
        <p className="flex-1 text-sm text-white/70">
          {value || <span className="italic text-white/30">{t("settings_components.bio_empty")}</span>}
        </p>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="rounded p-1 text-white/30 transition-colors hover:bg-white/5 hover:text-white/70 opacity-0 group-hover:opacity-100"
          aria-label="Modifier la bio"
        >
          <Pencil size={13} />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value.slice(0, 280))}
        onKeyDown={(e) => {
          if (e.key === "Escape") { setEditing(false); setValue(initial || ""); }
          if ((e.ctrlKey || e.metaKey) && e.key === "Enter") void save();
        }}
        rows={3}
        autoFocus
        placeholder={t("settings_components.bio_placeholder")}
        className="w-full resize-y rounded-lg border border-white/10 bg-dark-bg p-3 text-sm text-white placeholder:text-white/30 focus:border-lyoko-blue/40 focus:outline-none"
      />
      <div className="flex items-center justify-between">
        <span className={`text-xs ${remaining < 20 ? "text-xana-red" : "text-white/40"}`}>{remaining}</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => { setEditing(false); setValue(initial || ""); }}
            disabled={saving}
            className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:bg-white/5"
          >
            <X size={13} /> {t("settings_components.cancel")}
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="flex items-center gap-1 rounded-lg bg-lyoko-blue/20 px-3 py-1.5 text-xs font-semibold text-lyoko-blue hover:bg-lyoko-blue/30 disabled:opacity-50"
          >
            <Check size={13} /> {saving ? t("settings_components.saving") : t("settings_components.save")}
          </button>
        </div>
      </div>
      {error && <p className="text-xs text-xana-red">{error}</p>}
    </div>
  );
}
