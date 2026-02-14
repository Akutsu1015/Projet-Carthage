"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  Code, Heart, Eye, ArrowLeft, Share2, Copy, Check,
  Loader2, FileCode, Palette, Braces, ExternalLink,
} from "lucide-react";

type EditorTab = "html" | "css" | "js";

export default function CreationViewPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [creation, setCreation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<EditorTab>("html");
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/db/playground?id=${id}`, { credentials: "include" });
        const data = await res.json();
        if (data.success) setCreation(data.creation);
      } catch { /* ignore */ }
      setLoading(false);
    }
    load();
  }, [id]);

  useEffect(() => {
    if (!creation || !iframeRef.current) return;
    const doc = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>${creation.css_code || ""}</style></head>
<body>${creation.html_code || ""}
<script>${creation.js_code || ""}<\/script></body></html>`;
    iframeRef.current.srcdoc = doc;
  }, [creation]);

  const handleLike = async () => {
    if (!user || !creation) return;
    try {
      const res = await fetch("/api/db/playground", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "like", id: creation.id }),
      });
      const data = await res.json();
      if (data.success) {
        setCreation((prev: any) => ({ ...prev, liked: data.liked, likes: data.likes }));
      }
    } catch { /* ignore */ }
  };

  const handleCopy = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-lyoko-purple" />
      </div>
    );
  }

  if (!creation) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Code className="h-16 w-16 text-white/10" />
        <p className="text-white/40">Création introuvable</p>
        <Link href="/playground" className="text-sm text-lyoko-purple hover:underline">← Retour à la galerie</Link>
      </div>
    );
  }

  const TABS: { key: EditorTab; label: string; icon: React.ElementType; color: string }[] = [
    { key: "html", label: "HTML", icon: FileCode, color: "#e34c26" },
    { key: "css", label: "CSS", icon: Palette, color: "#264de4" },
    { key: "js", label: "JS", icon: Braces, color: "#f7df1e" },
  ];

  const codeMap: Record<EditorTab, string> = {
    html: creation.html_code || "",
    css: creation.css_code || "",
    js: creation.js_code || "",
  };

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="border-b border-white/5 bg-dark-surface px-4 py-4 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Link href="/playground" className="mb-3 inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70">
            <ArrowLeft size={14} /> Retour à la galerie
          </Link>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1">
              <h1 className="font-display text-xl font-bold text-white">{creation.title}</h1>
              {creation.description && <p className="mt-1 text-sm text-white/50">{creation.description}</p>}
            </div>

            {/* Author */}
            <div className="flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ background: creation.author?.avatarColor || "#00d4ff" }}
              >
                {creation.author?.avatarType === "initials" ? creation.author?.avatarValue : creation.author?.displayName?.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-white/80">{creation.author?.displayName}</p>
                <p className="text-xs text-white/30">@{creation.author?.username} · Nv.{creation.author?.level}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${
                  creation.liked
                    ? "border-xana-red/30 bg-xana-red/10 text-xana-red"
                    : "border-white/10 text-white/50 hover:border-xana-red/20 hover:text-xana-red"
                }`}
              >
                <Heart size={14} fill={creation.liked ? "currentColor" : "none"} /> {creation.likes}
              </button>
              <span className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-white/40">
                <Eye size={14} /> {creation.views}
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-lg border border-lyoko-blue/30 bg-lyoko-blue/10 px-3 py-1.5 text-sm font-medium text-lyoko-blue transition-all hover:bg-lyoko-blue/20"
              >
                {copied ? <><Check size={13} /> Copié !</> : <><Share2 size={13} /> Partager</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content: Preview + Code */}
      <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8">
        <div className="flex gap-4" style={{ height: "calc(100vh - 280px)", minHeight: 400 }}>
          {/* Preview */}
          <div className="flex w-1/2 flex-col overflow-hidden rounded-xl border border-white/10">
            <div className="flex items-center gap-2 border-b border-white/5 bg-dark-surface px-3 py-1.5">
              <Eye size={13} className="text-lyoko-blue" />
              <span className="text-[0.7rem] font-medium text-white/50">Aperçu</span>
            </div>
            <div className="flex-1 bg-white">
              <iframe
                ref={iframeRef}
                title="creation-preview"
                sandbox="allow-scripts allow-modals"
                className="h-full w-full border-0"
              />
            </div>
          </div>

          {/* Code viewer */}
          <div className="flex w-1/2 flex-col overflow-hidden rounded-xl border border-white/10">
            <div className="flex border-b border-white/5 bg-dark-surface">
              {TABS.map(({ key, label, icon: Icon, color }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-all ${
                    activeTab === key ? "border-b-2 text-white" : "text-white/40 hover:text-white/60"
                  }`}
                  style={activeTab === key ? { borderColor: color, color } : {}}
                >
                  <Icon size={13} /> {label}
                </button>
              ))}
            </div>
            <pre className="flex-1 overflow-auto bg-dark-bg p-4 font-mono text-[0.8rem] leading-relaxed text-white/85">
              <code>{codeMap[activeTab]}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
