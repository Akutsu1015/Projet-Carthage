"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search as SearchIcon, X, Code, BookOpen, Puzzle, CircleDot } from "lucide-react";

interface Hit {
  moduleId: string;
  moduleName: string;
  moduleColor: string;
  exerciseId: string;
  title: string;
  category?: string;
  type?: string;
}

const TYPE_ICONS: Record<string, any> = { intro: BookOpen, quiz: CircleDot, puzzle: Puzzle, code: Code };

/**
 * Cmd/Ctrl-K global exercise search. Modal overlay, debounced fetch.
 */
export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Cmd+K or Ctrl+K — but yield to Monaco editor and form
  // inputs, where Ctrl+K is a heavy chord prefix (delete line, comment, etc.).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        const t = e.target as HTMLElement | null;
        const inEditor = t && (
          t.closest?.(".monaco-editor") ||
          t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.isContentEditable
        );
        if (inEditor) return; // let the editor handle its own Ctrl+K
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Focus the input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQ("");
      setHits([]);
    }
  }, [open]);

  // Debounced fetch
  useEffect(() => {
    if (q.length < 2) { setHits([]); return; }
    setLoading(true);
    const ac = new AbortController();
    const t = setTimeout(() => {
      fetch(`/api/db/search?q=${encodeURIComponent(q)}`, { signal: ac.signal })
        .then((r) => r.json())
        .then((d) => { if (d.success) setHits(d.hits); })
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 200);
    return () => { clearTimeout(t); ac.abort(); };
  }, [q]);

  return (
    <>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-white/40 transition-colors hover:border-white/20 hover:text-white/70"
        title="Rechercher (Ctrl+K)"
      >
        <SearchIcon size={13} />
        <span>Rechercher…</span>
        <kbd className="ml-1 rounded bg-white/10 px-1.5 py-0.5 text-[0.65rem] font-mono">Ctrl K</kbd>
      </button>

      {/* Mobile trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="md:hidden rounded-lg p-2 text-white/60 hover:text-white"
        aria-label="Rechercher"
      >
        <SearchIcon size={16} />
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-start justify-center bg-black/60 px-4 pt-[10vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-dark-bg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <SearchIcon size={16} className="text-white/40" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher un exercice…"
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded p-1 text-white/40 hover:bg-white/5 hover:text-white"
                aria-label="Fermer"
              >
                <X size={14} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {q.length >= 2 && (
                <div className="px-4 py-2 text-[0.7rem] uppercase tracking-wide text-white/30">
                  {loading ? "Recherche…" : `${hits.length} résultat${hits.length > 1 ? "s" : ""}`}
                </div>
              )}
              {q.length < 2 && (
                <div className="p-8 text-center text-sm text-white/30">
                  Tapez au moins 2 caractères…
                </div>
              )}
              {hits.map((h) => {
                const Icon = TYPE_ICONS[h.type || "code"] || Code;
                return (
                  <Link
                    key={`${h.moduleId}:${h.exerciseId}`}
                    href={`/exercises/${h.moduleId}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 border-t border-white/5 px-4 py-3 hover:bg-white/[0.03]"
                  >
                    <span
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                      style={{ background: `${h.moduleColor}1a`, color: h.moduleColor }}
                    >
                      <Icon size={14} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-white">{h.title}</div>
                      <div className="text-xs text-white/40">
                        <span style={{ color: h.moduleColor }}>{h.moduleName}</span>
                        {h.category && <> · {h.category}</>}
                      </div>
                    </div>
                  </Link>
                );
              })}
              {q.length >= 2 && hits.length === 0 && !loading && (
                <div className="p-8 text-center text-sm text-white/30">
                  Aucun résultat pour « {q} »
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
