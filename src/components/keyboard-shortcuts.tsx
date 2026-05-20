"use client";

import { useEffect, useState } from "react";
import { X, Keyboard } from "lucide-react";

const SHORTCUTS: { keys: string[]; description: string; context?: string }[] = [
  { keys: ["Ctrl", "K"], description: "Ouvrir la recherche globale" },
  { keys: ["?"], description: "Afficher cette aide", context: "global" },
  { keys: ["Esc"], description: "Fermer un modal" },
  { keys: ["Ctrl", "Enter"], description: "Lancer / valider le code", context: "Éditeur" },
  { keys: ["S"], description: "Aller au prochain exercice non-complété", context: "Exercices" },
  { keys: ["F"], description: "Mode Focus (plein-écran)", context: "Exercices" },
];

/**
 * Global "?" key opens a cheat-sheet of available keyboard shortcuts.
 * Ignored when the user is typing in an input / textarea / contenteditable.
 */
export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) { setOpen(false); return; }
      if (e.key !== "?") return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      // Ignore when Monaco is focused
      if (t && t.closest?.(".monaco-editor")) return;
      e.preventDefault();
      setOpen((o) => !o);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  // Group by context
  const byContext: Record<string, typeof SHORTCUTS> = {};
  for (const s of SHORTCUTS) {
    const ctx = s.context || "Général";
    (byContext[ctx] ||= []).push(s);
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-dark-bg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4">
          <Keyboard size={16} className="text-lyoko-blue" />
          <h2 className="font-display text-base font-bold">Raccourcis clavier</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="ml-auto rounded p-1 text-white/40 hover:bg-white/5 hover:text-white"
            aria-label="Fermer"
          >
            <X size={14} />
          </button>
        </div>
        <div className="max-h-[70vh] space-y-5 overflow-y-auto p-5">
          {Object.entries(byContext).map(([ctx, list]) => (
            <div key={ctx}>
              <h3 className="mb-2 text-[0.65rem] uppercase tracking-wider text-white/40">{ctx}</h3>
              <div className="space-y-1.5">
                {list.map((s, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 hover:bg-white/[0.03]">
                    <span className="text-sm text-white/80">{s.description}</span>
                    <div className="flex gap-1">
                      {s.keys.map((k) => (
                        <kbd
                          key={k}
                          className="rounded border border-white/20 bg-white/10 px-2 py-0.5 font-mono text-[0.7rem] text-white"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-white/5 bg-white/[0.02] px-5 py-2 text-center text-[0.65rem] text-white/30">
          Appuie sur <kbd className="rounded bg-white/10 px-1 py-0.5 font-mono">?</kbd> à tout moment pour revoir cette aide.
        </div>
      </div>
    </div>
  );
}
