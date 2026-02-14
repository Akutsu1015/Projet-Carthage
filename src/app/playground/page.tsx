"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  Code, Plus, Save, Share2, Eye, Heart, Trash2, Edit3,
  Loader2, Globe, Lock, RefreshCw, ChevronRight, ExternalLink,
  FileCode, Palette, Braces, LogIn, X, Check, Search,
  Play, Terminal, ChevronDown,
} from "lucide-react";

type Tab = "editor" | "code" | "gallery" | "my";
type EditorTab = "html" | "css" | "js";

const LANG_LIST: { key: string; name: string; icon: string; color: string; template: string }[] = [
  { key: "javascript", name: "JavaScript", icon: "JS", color: "#f7df1e", template: 'console.log("Hello, World!");' },
  { key: "typescript", name: "TypeScript", icon: "TS", color: "#3178c6", template: 'const greeting: string = "Hello, World!";\nconsole.log(greeting);' },
  { key: "python", name: "Python", icon: "PY", color: "#3776ab", template: 'print("Hello, World!")' },
  { key: "java", name: "Java", icon: "JV", color: "#ed8b00", template: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}' },
  { key: "c", name: "C", icon: "C", color: "#555555", template: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}' },
  { key: "cpp", name: "C++", icon: "C+", color: "#00599c", template: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}' },
  { key: "csharp", name: "C#", icon: "C#", color: "#68217a", template: 'using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}' },
  { key: "go", name: "Go", icon: "GO", color: "#00add8", template: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}' },
  { key: "rust", name: "Rust", icon: "RS", color: "#dea584", template: 'fn main() {\n    println!("Hello, World!");\n}' },
  { key: "ruby", name: "Ruby", icon: "RB", color: "#cc342d", template: 'puts "Hello, World!"' },
  { key: "php", name: "PHP", icon: "PH", color: "#777bb4", template: '<?php\necho "Hello, World!\\n";\n?>' },
  { key: "swift", name: "Swift", icon: "SW", color: "#f05138", template: 'print("Hello, World!")' },
  { key: "kotlin", name: "Kotlin", icon: "KT", color: "#7f52ff", template: 'fun main() {\n    println("Hello, World!")\n}' },
  { key: "dart", name: "Dart", icon: "DT", color: "#0175c2", template: 'void main() {\n  print("Hello, World!");\n}' },
  { key: "lua", name: "Lua", icon: "LU", color: "#000080", template: 'print("Hello, World!")' },
  { key: "perl", name: "Perl", icon: "PL", color: "#39457e", template: 'print "Hello, World!\\n";' },
  { key: "r", name: "R", icon: "R", color: "#276dc3", template: 'cat("Hello, World!\\n")' },
  { key: "bash", name: "Bash", icon: "SH", color: "#4eaa25", template: 'echo "Hello, World!"' },
  { key: "sql", name: "SQL", icon: "SQ", color: "#e38c00", template: 'SELECT "Hello, World!" AS greeting;' },
];

export default function PlaygroundPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("gallery");
  const [editorTab, setEditorTab] = useState<EditorTab>("html");

  // Editor state (HTML/CSS/JS)
  const [editId, setEditId] = useState<number | null>(null);
  const [title, setTitle] = useState("Ma création");
  const [description, setDescription] = useState("");
  const [html, setHtml] = useState('<div class="container">\n  <h1>Hello World!</h1>\n  <p>Bienvenue sur le Playground</p>\n  <button id="btn">Cliquez-moi</button>\n</div>');
  const [css, setCss] = useState('.container {\n  font-family: system-ui, sans-serif;\n  max-width: 600px;\n  margin: 40px auto;\n  padding: 20px;\n  text-align: center;\n}\n\nh1 {\n  color: #00d4ff;\n  font-size: 2rem;\n}\n\nbutton {\n  background: linear-gradient(135deg, #00d4ff, #00ff88);\n  border: none;\n  padding: 12px 24px;\n  border-radius: 8px;\n  font-weight: bold;\n  cursor: pointer;\n  font-size: 1rem;\n  color: #0a0a14;\n  transition: transform 0.2s;\n}\n\nbutton:hover {\n  transform: scale(1.05);\n}');
  const [js, setJs] = useState('document.getElementById("btn").addEventListener("click", () => {\n  alert("Bravo ! 🎉");\n});');
  const [isPublic, setIsPublic] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Code playground state (multi-language)
  const [codeLang, setCodeLang] = useState("javascript");
  const [codeContent, setCodeContent] = useState(LANG_LIST[0].template);
  const [codeStdin, setCodeStdin] = useState("");
  const [codeOutput, setCodeOutput] = useState("");
  const [codeError, setCodeError] = useState("");
  const [codeRunning, setCodeRunning] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [langSearch, setLangSearch] = useState("");
  const codeTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Gallery state
  const [creations, setCreations] = useState<any[]>([]);
  const [myCreations, setMyCreations] = useState<any[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [sort, setSort] = useState<"recent" | "popular">("recent");
  const [searchQuery, setSearchQuery] = useState("");

  // Preview (HTML/CSS/JS)
  const updatePreview = useCallback(() => {
    if (!iframeRef.current) return;
    const doc = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>${css}</style></head>
<body>${html}
<script>${js}<\/script></body></html>`;
    iframeRef.current.srcdoc = doc;
  }, [html, css, js]);

  useEffect(() => {
    const timer = setTimeout(updatePreview, 500);
    return () => clearTimeout(timer);
  }, [updatePreview]);

  // Run code (multi-language)
  const runCode = async () => {
    setCodeRunning(true);
    setCodeOutput("");
    setCodeError("");
    try {
      const res = await fetch("/api/db/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: codeLang, code: codeContent, stdin: codeStdin }),
      });
      const data = await res.json();
      if (data.success) {
        setCodeOutput(data.output || "");
        if (data.stderr) setCodeError(data.stderr);
        if (data.compileOutput && data.exitCode !== 0) setCodeError(prev => (prev ? prev + "\n" : "") + data.compileOutput);
      } else {
        setCodeError(data.error || "Erreur inconnue");
      }
    } catch (e: any) {
      setCodeError(e.message || "Erreur réseau");
    }
    setCodeRunning(false);
  };

  const switchLang = (key: string) => {
    setCodeLang(key);
    const lang = LANG_LIST.find(l => l.key === key);
    if (lang) setCodeContent(lang.template);
    setCodeOutput("");
    setCodeError("");
    setShowLangPicker(false);
    setLangSearch("");
  };

  const currentLang = LANG_LIST.find(l => l.key === codeLang) || LANG_LIST[0];

  // Fetch gallery
  const fetchGallery = useCallback(async () => {
    setGalleryLoading(true);
    try {
      const res = await fetch(`/api/db/playground?sort=${sort}`, { credentials: "include" });
      const data = await res.json();
      if (data.success) setCreations(data.creations || []);
    } catch { /* ignore */ }
    setGalleryLoading(false);
  }, [sort]);

  const fetchMyCreations = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/db/playground?action=my", { credentials: "include" });
      const data = await res.json();
      if (data.success) setMyCreations(data.creations || []);
    } catch { /* ignore */ }
  }, [user]);

  useEffect(() => {
    if (tab === "gallery") fetchGallery();
    if (tab === "my") fetchMyCreations();
  }, [tab, fetchGallery, fetchMyCreations]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSaveMsg("");
    try {
      const body: any = {
        action: editId ? "update" : "create",
        title, description, html, css, js, isPublic,
      };
      if (editId) body.id = editId;
      const res = await fetch("/api/db/playground", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        if (!editId && data.creation) setEditId(data.creation.id);
        setSaveMsg("Sauvegardé !");
        setTimeout(() => setSaveMsg(""), 2000);
        fetchMyCreations();
      } else {
        setSaveMsg(data.error || "Erreur");
      }
    } catch { setSaveMsg("Erreur réseau"); }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette création ?")) return;
    try {
      await fetch("/api/db/playground", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "delete", id }),
      });
      fetchMyCreations();
      if (editId === id) {
        setEditId(null);
        setTitle("Ma création");
        setDescription("");
        setHtml("");
        setCss("");
        setJs("");
      }
    } catch { /* ignore */ }
  };

  const handleLike = async (id: number) => {
    if (!user) return;
    try {
      const res = await fetch("/api/db/playground", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "like", id }),
      });
      const data = await res.json();
      if (data.success) {
        setCreations(prev => prev.map(c => c.id === id ? { ...c, liked: data.liked, likes: data.likes } : c));
      }
    } catch { /* ignore */ }
  };

  const loadCreation = (c: any) => {
    setEditId(c.id);
    setTitle(c.title);
    setDescription(c.description || "");
    setHtml(c.html_code || "");
    setCss(c.css_code || "");
    setJs(c.js_code || "");
    setIsPublic(!!c.is_public);
    setTab("editor");
  };

  const newCreation = () => {
    setEditId(null);
    setTitle("Ma création");
    setDescription("");
    setHtml('<div class="container">\n  <h1>Hello World!</h1>\n  <p>Bienvenue sur le Playground</p>\n  <button id="btn">Cliquez-moi</button>\n</div>');
    setCss('.container {\n  font-family: system-ui, sans-serif;\n  max-width: 600px;\n  margin: 40px auto;\n  padding: 20px;\n  text-align: center;\n}\n\nh1 {\n  color: #00d4ff;\n  font-size: 2rem;\n}\n\nbutton {\n  background: linear-gradient(135deg, #00d4ff, #00ff88);\n  border: none;\n  padding: 12px 24px;\n  border-radius: 8px;\n  font-weight: bold;\n  cursor: pointer;\n  font-size: 1rem;\n  color: #0a0a14;\n  transition: transform 0.2s;\n}\n\nbutton:hover {\n  transform: scale(1.05);\n}');
    setJs('document.getElementById("btn").addEventListener("click", () => {\n  alert("Bravo ! 🎉");\n});');
    setIsPublic(true);
    setTab("editor");
  };

  const EDITOR_TABS: { key: EditorTab; label: string; icon: React.ElementType; color: string }[] = [
    { key: "html", label: "HTML", icon: FileCode, color: "#e34c26" },
    { key: "css", label: "CSS", icon: Palette, color: "#264de4" },
    { key: "js", label: "JS", icon: Braces, color: "#f7df1e" },
  ];

  const codeValues: Record<EditorTab, string> = { html, css, js };
  const codeSetters: Record<EditorTab, (v: string) => void> = { html: setHtml, css: setCss, js: setJs };

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero */}
      <div className="border-b border-lyoko-purple/15 bg-gradient-to-br from-dark-surface to-dark-bg py-8">
        <div className="mx-auto max-w-6xl px-4 text-center lg:px-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-lyoko-purple/30 bg-lyoko-purple/10 px-4 py-1.5 text-sm font-semibold text-lyoko-purple">
            <Code size={16} /> Code Playground
          </div>
          <h1 className="mb-2 font-display text-3xl font-extrabold md:text-4xl">
            <span className="bg-gradient-to-r from-lyoko-purple to-lyoko-blue bg-clip-text text-transparent">
              Créez, partagez, inspirez
            </span>
          </h1>
          <p className="mx-auto max-w-xl text-sm text-white/50">
            Éditeur multi-langage avec exécution en direct · HTML/CSS/JS · 19 langages de programmation
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8">
        {/* Tabs */}
        <div className="mb-5 flex items-center gap-3 border-b border-white/5 pb-3">
          <button onClick={() => setTab("code")} className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${tab === "code" ? "bg-lyoko-blue/15 text-lyoko-blue" : "text-white/50 hover:text-white/70"}`}>
            <Terminal size={16} /> Code
          </button>
          <button onClick={() => setTab("editor")} className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${tab === "editor" ? "bg-lyoko-purple/15 text-lyoko-purple" : "text-white/50 hover:text-white/70"}`}>
            <Code size={16} /> HTML/CSS/JS
          </button>
          <button onClick={() => setTab("gallery")} className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${tab === "gallery" ? "bg-lyoko-purple/15 text-lyoko-purple" : "text-white/50 hover:text-white/70"}`}>
            <Globe size={16} /> Galerie
          </button>
          {user && (
            <button onClick={() => setTab("my")} className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${tab === "my" ? "bg-lyoko-purple/15 text-lyoko-purple" : "text-white/50 hover:text-white/70"}`}>
              <Edit3 size={16} /> Mes créations
            </button>
          )}
          <div className="flex-1" />
          {user && (
            <button onClick={newCreation} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-lyoko-purple to-lyoko-blue px-5 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(168,85,247,0.3)]">
              <Plus size={16} /> Nouvelle création
            </button>
          )}
        </div>

        {/* ═══ CODE PLAYGROUND TAB ═══ */}
        {tab === "code" && (
          <div className="flex flex-col" style={{ height: "calc(100vh - 280px)", minHeight: 450 }}>
            {/* Top bar: language picker + run */}
            <div className="mb-3 flex items-center gap-3">
              {/* Language picker */}
              <div className="relative">
                <button
                  onClick={() => setShowLangPicker(!showLangPicker)}
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white transition-all hover:border-white/20"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded text-[0.6rem] font-bold text-white" style={{ background: currentLang.color }}>
                    {currentLang.icon}
                  </span>
                  {currentLang.name}
                  <ChevronDown size={14} className="text-white/40" />
                </button>

                {showLangPicker && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => { setShowLangPicker(false); setLangSearch(""); }} />
                    <div className="absolute left-0 top-full z-50 mt-1 w-64 rounded-xl border border-white/10 bg-dark-surface shadow-2xl">
                      <div className="border-b border-white/5 p-2">
                        <input
                          autoFocus
                          value={langSearch}
                          onChange={e => setLangSearch(e.target.value)}
                          placeholder="Rechercher un langage..."
                          className="w-full rounded-lg border border-white/10 bg-dark-bg px-3 py-1.5 text-sm text-white placeholder:text-white/30 focus:outline-none"
                        />
                      </div>
                      <div className="max-h-64 overflow-y-auto p-1">
                        {LANG_LIST
                          .filter(l => !langSearch || l.name.toLowerCase().includes(langSearch.toLowerCase()))
                          .map(l => (
                            <button
                              key={l.key}
                              onClick={() => switchLang(l.key)}
                              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-all hover:bg-white/5 ${codeLang === l.key ? "bg-lyoko-blue/10 text-lyoko-blue" : "text-white/70"}`}
                            >
                              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded text-[0.55rem] font-bold text-white" style={{ background: l.color }}>
                                {l.icon}
                              </span>
                              {l.name}
                              {codeLang === l.key && <Check size={14} className="ml-auto text-lyoko-blue" />}
                            </button>
                          ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex-1" />

              <button
                onClick={runCode}
                disabled={codeRunning || !codeContent.trim()}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-lyoko-green to-lyoko-blue px-5 py-2 text-sm font-semibold text-dark-bg transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
              >
                {codeRunning ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                {codeRunning ? "Exécution..." : "Exécuter"}
              </button>
            </div>

            {/* Split: Code editor + Output */}
            <div className="flex flex-1 gap-3 overflow-hidden">
              {/* Code editor */}
              <div className="flex w-1/2 flex-col overflow-hidden rounded-xl border border-white/10">
                <div className="flex items-center justify-between border-b border-white/5 bg-dark-surface px-4 py-1.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded text-[0.5rem] font-bold text-white" style={{ background: currentLang.color }}>
                      {currentLang.icon}
                    </span>
                    <span className="font-mono text-[0.7rem] text-white/40">main</span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-xana-red/60" />
                    <div className="h-2 w-2 rounded-full bg-carthage-gold/60" />
                    <div className="h-2 w-2 rounded-full bg-lyoko-green/60" />
                  </div>
                </div>
                <textarea
                  ref={codeTextareaRef}
                  value={codeContent}
                  onChange={e => setCodeContent(e.target.value)}
                  spellCheck={false}
                  className="flex-1 resize-none bg-dark-bg p-4 font-mono text-[0.8rem] leading-relaxed text-white/90 focus:outline-none"
                  onKeyDown={e => {
                    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                      e.preventDefault();
                      runCode();
                    }
                    if (e.key === "Tab") {
                      e.preventDefault();
                      const t = e.currentTarget;
                      const s = t.selectionStart;
                      setCodeContent(codeContent.substring(0, s) + "  " + codeContent.substring(t.selectionEnd));
                      setTimeout(() => { t.selectionStart = t.selectionEnd = s + 2; }, 0);
                    }
                  }}
                />
                {/* Stdin */}
                <div className="border-t border-white/5">
                  <div className="flex items-center gap-2 bg-dark-surface px-3 py-1">
                    <Terminal size={11} className="text-white/30" />
                    <span className="text-[0.65rem] text-white/30">stdin (entrée)</span>
                  </div>
                  <textarea
                    value={codeStdin}
                    onChange={e => setCodeStdin(e.target.value)}
                    placeholder="Entrée standard (optionnel)..."
                    rows={2}
                    spellCheck={false}
                    className="w-full resize-none bg-dark-bg px-4 py-2 font-mono text-[0.75rem] text-white/70 placeholder:text-white/20 focus:outline-none"
                  />
                </div>
              </div>

              {/* Output */}
              <div className="flex w-1/2 flex-col overflow-hidden rounded-xl border border-white/10">
                <div className="flex items-center gap-2 border-b border-white/5 bg-dark-surface px-4 py-1.5">
                  <Terminal size={13} className="text-lyoko-green" />
                  <span className="text-[0.7rem] font-medium text-white/50">Sortie</span>
                  {codeRunning && <Loader2 size={12} className="animate-spin text-lyoko-blue" />}
                </div>
                <div className="flex-1 overflow-auto bg-dark-bg p-4">
                  {!codeOutput && !codeError && !codeRunning && (
                    <div className="flex h-full items-center justify-center text-center">
                      <div>
                        <Play size={32} className="mx-auto mb-2 text-white/10" />
                        <p className="text-sm text-white/30">Cliquez sur Exécuter ou Ctrl+Entrée</p>
                        <p className="mt-1 text-xs text-white/20">19 langages disponibles</p>
                      </div>
                    </div>
                  )}
                  {codeOutput && (
                    <pre className="whitespace-pre-wrap font-mono text-[0.8rem] leading-relaxed text-lyoko-green">{codeOutput}</pre>
                  )}
                  {codeError && (
                    <pre className="mt-2 whitespace-pre-wrap font-mono text-[0.75rem] leading-relaxed text-xana-red">{codeError}</pre>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ EDITOR TAB ═══ */}
        {tab === "editor" && (
          <div>
            {/* Title + controls */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre de la création"
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-lyoko-purple/40 focus:outline-none"
              />
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optionnel)"
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-lyoko-purple/40 focus:outline-none"
              />
              <button
                onClick={() => setIsPublic(!isPublic)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                  isPublic ? "border-lyoko-green/30 bg-lyoko-green/10 text-lyoko-green" : "border-white/10 text-white/40"
                }`}
              >
                {isPublic ? <Globe size={13} /> : <Lock size={13} />}
                {isPublic ? "Public" : "Privé"}
              </button>
              {user ? (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-lyoko-purple px-4 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  {editId ? "Mettre à jour" : "Sauvegarder"}
                </button>
              ) : (
                <Link href="/login" className="flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-xs text-white/60 hover:text-lyoko-purple">
                  <LogIn size={13} /> Connectez-vous pour sauvegarder
                </Link>
              )}
              {saveMsg && (
                <span className={`text-xs font-medium ${saveMsg === "Sauvegardé !" ? "text-lyoko-green" : "text-xana-red"}`}>
                  {saveMsg === "Sauvegardé !" && <Check size={12} className="mr-1 inline" />}
                  {saveMsg}
                </span>
              )}
            </div>

            {/* Split: Editor + Preview */}
            <div className="flex gap-4" style={{ height: "calc(100vh - 320px)", minHeight: 400 }}>
              {/* Code editor */}
              <div className="flex w-1/2 flex-col overflow-hidden rounded-xl border border-white/10">
                {/* Editor tabs */}
                <div className="flex border-b border-white/5 bg-dark-surface">
                  {EDITOR_TABS.map(({ key, label, icon: Icon, color }) => (
                    <button
                      key={key}
                      onClick={() => setEditorTab(key)}
                      className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-all ${
                        editorTab === key ? "border-b-2 text-white" : "text-white/40 hover:text-white/60"
                      }`}
                      style={editorTab === key ? { borderColor: color, color } : {}}
                    >
                      <Icon size={13} /> {label}
                    </button>
                  ))}
                  <div className="flex-1" />
                  <div className="flex items-center gap-1.5 pr-3">
                    <div className="h-2 w-2 rounded-full bg-xana-red/60" />
                    <div className="h-2 w-2 rounded-full bg-carthage-gold/60" />
                    <div className="h-2 w-2 rounded-full bg-lyoko-green/60" />
                  </div>
                </div>
                <textarea
                  value={codeValues[editorTab]}
                  onChange={(e) => codeSetters[editorTab](e.target.value)}
                  spellCheck={false}
                  className="flex-1 resize-none bg-dark-bg p-4 font-mono text-[0.8rem] leading-relaxed text-white/90 focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Tab") {
                      e.preventDefault();
                      const t = e.currentTarget;
                      const s = t.selectionStart;
                      const val = codeValues[editorTab];
                      codeSetters[editorTab](val.substring(0, s) + "  " + val.substring(t.selectionEnd));
                      setTimeout(() => { t.selectionStart = t.selectionEnd = s + 2; }, 0);
                    }
                  }}
                />
              </div>

              {/* Preview */}
              <div className="flex w-1/2 flex-col overflow-hidden rounded-xl border border-white/10">
                <div className="flex items-center justify-between border-b border-white/5 bg-dark-surface px-3 py-1.5">
                  <div className="flex items-center gap-2">
                    <Eye size={13} className="text-lyoko-blue" />
                    <span className="text-[0.7rem] font-medium text-white/50">Aperçu en direct</span>
                  </div>
                  <button onClick={updatePreview} className="rounded p-1 text-white/30 hover:text-white/60">
                    <RefreshCw size={12} />
                  </button>
                </div>
                <div className="flex-1 bg-white">
                  <iframe
                    ref={iframeRef}
                    title="playground-preview"
                    sandbox="allow-scripts allow-modals"
                    className="h-full w-full border-0"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ GALLERY TAB ═══ */}
        {tab === "gallery" && (
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une création..."
                  className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-3 text-sm text-white placeholder:text-white/30 focus:border-lyoko-purple/40 focus:outline-none"
                />
              </div>
              <button onClick={() => setSort("recent")} className={`rounded-lg px-3 py-2 text-xs font-medium ${sort === "recent" ? "bg-lyoko-purple/15 text-lyoko-purple" : "text-white/40"}`}>
                Récent
              </button>
              <button onClick={() => setSort("popular")} className={`rounded-lg px-3 py-2 text-xs font-medium ${sort === "popular" ? "bg-lyoko-purple/15 text-lyoko-purple" : "text-white/40"}`}>
                Populaire
              </button>
            </div>

            {galleryLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-lyoko-purple" />
              </div>
            ) : creations.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
                <Code className="mx-auto mb-3 h-12 w-12 text-white/10" />
                <p className="text-sm text-white/40">Aucune création partagée</p>
                <p className="mt-1 text-xs text-white/25">Soyez le premier à partager !</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {creations
                  .filter(c => !searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.author?.displayName?.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((c: any) => (
                  <CreationCard key={c.id} creation={c} onLike={() => handleLike(c.id)} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══ MY CREATIONS TAB ═══ */}
        {tab === "my" && user && (
          <div>
            {myCreations.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
                <Code className="mx-auto mb-3 h-12 w-12 text-white/10" />
                <p className="text-sm text-white/40">Vous n&apos;avez pas encore de création</p>
                <button onClick={newCreation} className="mt-3 text-sm text-lyoko-purple hover:underline">
                  Créer ma première création →
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {myCreations.map((c: any) => (
                  <div key={c.id} className="group rounded-2xl border border-white/8 bg-white/[0.02] transition-all hover:border-lyoko-purple/20">
                    {/* Mini preview */}
                    <div className="h-36 overflow-hidden rounded-t-2xl bg-white">
                      <iframe
                        srcDoc={`<!DOCTYPE html><html><head><style>body{margin:0;transform:scale(0.5);transform-origin:0 0;width:200%;height:200%;}${c.css_code || ""}</style></head><body>${c.html_code || ""}<script>${c.js_code || ""}<\/script></body></html>`}
                        title={c.title}
                        sandbox="allow-scripts"
                        className="h-[200%] w-[200%] origin-top-left scale-50 border-0 pointer-events-none"
                      />
                    </div>
                    <div className="p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-white">{c.title}</h3>
                        <span className={`flex items-center gap-1 text-xs ${c.is_public ? "text-lyoko-green" : "text-white/30"}`}>
                          {c.is_public ? <Globe size={11} /> : <Lock size={11} />}
                          {c.is_public ? "Public" : "Privé"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-white/40">
                        <span className="flex items-center gap-1"><Heart size={11} /> {c.likes}</span>
                        <span className="flex items-center gap-1"><Eye size={11} /> {c.views}</span>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button onClick={() => loadCreation(c)} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-lyoko-purple/30 bg-lyoko-purple/10 py-1.5 text-xs font-medium text-lyoko-purple hover:bg-lyoko-purple/20">
                          <Edit3 size={12} /> Modifier
                        </button>
                        <button onClick={() => handleDelete(c.id)} className="rounded-lg border border-xana-red/20 p-1.5 text-xana-red/50 hover:bg-xana-red/10 hover:text-xana-red">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CreationCard({ creation: c, onLike }: { creation: any; onLike: () => void }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] transition-all hover:border-lyoko-purple/20">
      {/* Mini preview */}
      <Link href={`/playground/${c.id}`} className="block h-40 overflow-hidden bg-white">
        <iframe
          srcDoc={`<!DOCTYPE html><html><head><style>body{margin:0;transform:scale(0.5);transform-origin:0 0;width:200%;height:200%;}${c.css_code || ""}</style></head><body>${c.html_code || ""}<script>${c.js_code || ""}<\/script></body></html>`}
          title={c.title}
          sandbox="allow-scripts"
          className="h-[200%] w-[200%] origin-top-left scale-50 border-0 pointer-events-none"
        />
      </Link>
      <div className="p-4">
        <Link href={`/playground/${c.id}`}>
          <h3 className="mb-1 text-sm font-semibold text-white hover:text-lyoko-purple">{c.title}</h3>
        </Link>
        {c.description && <p className="mb-2 text-xs text-white/40 line-clamp-2">{c.description}</p>}

        {/* Author */}
        <div className="mb-3 flex items-center gap-2">
          <div
            className="flex h-5 w-5 items-center justify-center rounded-full text-[0.5rem] font-bold text-white"
            style={{ background: c.author?.avatarColor || "#00d4ff" }}
          >
            {c.author?.avatarType === "initials" ? c.author?.avatarValue : c.author?.displayName?.substring(0, 2).toUpperCase()}
          </div>
          <span className="text-xs text-white/50">{c.author?.displayName}</span>
          <span className="rounded bg-white/5 px-1.5 py-0.5 text-[0.6rem] text-white/30">Nv.{c.author?.level}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3">
          <button onClick={onLike} className={`flex items-center gap-1 text-xs transition-colors ${c.liked ? "text-xana-red" : "text-white/30 hover:text-xana-red"}`}>
            <Heart size={13} fill={c.liked ? "currentColor" : "none"} /> {c.likes}
          </button>
          <span className="flex items-center gap-1 text-xs text-white/30">
            <Eye size={13} /> {c.views}
          </span>
          <div className="flex-1" />
          <Link href={`/playground/${c.id}`} className="flex items-center gap-1 text-xs text-lyoko-purple hover:underline">
            Voir <ExternalLink size={11} />
          </Link>
        </div>
      </div>
    </div>
  );
}
