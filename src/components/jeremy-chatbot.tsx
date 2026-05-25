"use client";
// Force cache bust: v3.5 - Prevent window auto-scroll on chat open

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Loader2, Minimize2, Maximize2, Trash2, GraduationCap } from "lucide-react";
import JeremyAvatar from "./jeremy-avatar";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ExerciseContext {
  title?: string;
  module?: string;
  instruction?: string;
  level?: number;
  code?: string;
  error?: string;
}

interface JeremyChatbotProps {
  exerciseContext?: ExerciseContext;
}

export default function JeremyChatbot({ exerciseContext }: JeremyChatbotProps) {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [profMode, setProfMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jeremy-prof-mode") === "true";
    }
    return false;
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (open && !minimized) inputRef.current?.focus({ preventScroll: true });
  }, [open, minimized]);

  useEffect(() => {
    localStorage.setItem("jeremy-prof-mode", profMode.toString());
  }, [profMode]);

  // Dynamically inject custom bottom paddings to the exercise container so that the scrollable area ends above the chatbot
  useEffect(() => {
    const mainScrollable = document.getElementById("exercise-content-scroll");
    if (!mainScrollable) return;

    // Remove existing paddings to avoid duplication
    mainScrollable.classList.remove("pb-16", "pb-14", "pb-[340px]");

    if (!open) {
      mainScrollable.classList.add("pb-16"); // when chatbot bar is closed (but broad bar is present)
    } else if (minimized) {
      mainScrollable.classList.add("pb-14"); // when chatbot is minimized (thin bar)
    } else {
      mainScrollable.classList.add("pb-[340px]"); // when chatbot is fully open
    }

    return () => {
      mainScrollable.classList.remove("pb-16", "pb-14", "pb-[340px]");
    };
  }, [open, minimized]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setSpeaking(true);

    try {
      const res = await fetch("/api/db/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ messages: newMessages, exerciseContext, profMode }),
      });
      const data = await res.json();
      if (data.success && data.reply) {
        setMessages([...newMessages, { role: "assistant", content: data.reply }]);
      } else {
        setMessages([...newMessages, { role: "assistant", content: data.error || "Le supercalculateur a planté... Réessaie !" }]);
      }
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Connexion perdue avec le supercalculateur... Vérifie ta connexion !" }]);
    }
    setLoading(false);
    setTimeout(() => setSpeaking(false), 500);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Render markdown-lite (bold, code blocks, inline code)
  const renderContent = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```|`[^`]+`|\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        const code = part.slice(3, -3).replace(/^\w+\n/, "");
        return (
          <pre key={i} className="my-1.5 overflow-x-auto rounded-lg bg-black/40 p-2 text-xs text-lyoko-green">
            <code>{code}</code>
          </pre>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return <code key={i} className="rounded bg-white/10 px-1 py-0.5 text-xs text-carthage-gold">{part.slice(1, -1)}</code>;
      }
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  // Floating button when closed (takes full width at bottom-0)
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-between border-t border-lyoko-blue/30 bg-dark-card/95 px-6 py-3 shadow-2xl backdrop-blur-xl transition-all hover:bg-dark-card/80"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <JeremyAvatar size={32} />
            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-dark-card bg-lyoko-green" />
          </div>
          <div className="text-left">
            <span className="text-xs font-bold text-white">Jérémie Belpois</span>
            <span className="mx-2 text-white/30">|</span>
            <span className="text-[10px] text-lyoko-green">Supercalculateur prêt - Cliquez pour ouvrir le terminal d&apos;assistance</span>
          </div>
        </div>
        <div className="rounded bg-lyoko-blue/10 px-2 py-1 text-[10px] font-bold text-lyoko-blue">
          OUVRIR
        </div>
      </button>
    );
  }

  // Minimized state (bar at the bottom)
  if (minimized) {
    return (
      <div className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-between border-t border-lyoko-blue/30 bg-dark-card/95 px-6 py-2 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <JeremyAvatar size={24} speaking={speaking} />
          <span className="text-xs font-bold text-white">Terminal Jérémie</span>
          <span className="text-[10px] text-white/40">Minimisé</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setMinimized(false)} className="rounded p-1 text-white/50 hover:bg-white/10 hover:text-white" title="Agrandir">
            <Maximize2 size={14} />
          </button>
          <button onClick={() => { setOpen(false); setMinimized(false); }} className="rounded p-1 text-white/50 hover:bg-white/10 hover:text-xana-red" title="Fermer">
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  // Full terminal banner at the bottom (full width)
  return (
    <div className="fixed bottom-0 left-0 z-50 flex w-full h-[320px] max-h-[50dvh] flex-col overflow-hidden border-t border-lyoko-blue/30 bg-dark-card/95 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 bg-gradient-to-r from-lyoko-blue/10 to-transparent px-6 py-2.5">
        <div className="flex items-center gap-3">
          <JeremyAvatar size={32} speaking={speaking} />
          <div>
            <div className="text-xs font-bold text-white">Terminal d&apos;assistance de Jérémie Belpois</div>
            <div className="text-[9px] text-lyoko-green">
              {loading ? "Analyse du supercalculateur en cours..." : "Supercalculateur connecté à Lyoko"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setProfMode(!profMode)}
            className={`rounded p-1.5 transition-all ${profMode ? "bg-lyoko-green/20 text-lyoko-green" : "text-white/30 hover:bg-white/10 hover:text-white"}`}
            title={profMode ? "Mode Prof activé (Explications simples)" : "Activer le mode Prof"}
          >
            <GraduationCap size={14} />
          </button>
          <button onClick={clearChat} className="rounded p-1.5 text-white/30 hover:bg-white/10 hover:text-white" title="Effacer la conversation">
            <Trash2 size={14} />
          </button>
          <button onClick={() => setMinimized(true)} className="rounded p-1.5 text-white/30 hover:bg-white/10 hover:text-white" title="Minimiser">
            <Minimize2 size={14} />
          </button>
          <button onClick={() => setOpen(false)} className="rounded p-1.5 text-white/30 hover:bg-white/10 hover:text-xana-red" title="Fermer">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-3" style={{ minHeight: "80px" }}>
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-4 text-center">
            <div className="flex items-center gap-4">
              <JeremyAvatar size={56} />
              <div className="text-left">
                <p className="text-xs font-medium text-white">Besoin d&apos;aide sur cet exercice ?</p>
                <p className="mt-0.5 text-[11px] text-white/50 max-w-xl">
                  Je peux t&apos;expliquer les concepts ou analyser ton code sans te donner la réponse directe. Choisis une option ou écris-moi ci-dessous !
                </p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-1">
              {["Je comprends pas l'exercice", "J'ai une erreur", "Explique-moi le concept", "Donne-moi un indice"].map((q) => (
                <button
                  key={q}
                  onClick={() => { setInput(q); }}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] text-white/60 transition-all hover:border-lyoko-blue/30 hover:bg-lyoko-blue/10 hover:text-white"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="mr-2 mt-0.5 flex-shrink-0">
                <JeremyAvatar size={24} speaking={loading && i === messages.length - 1} />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${msg.role === "user"
                ? "bg-lyoko-blue/20 text-white"
                : "bg-white/5 text-white/90"
                }`}
            >
              {msg.role === "assistant" ? renderContent(msg.content) : msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="mb-3 flex justify-start">
            <div className="mr-2 mt-0.5 flex-shrink-0">
              <JeremyAvatar size={24} speaking={true} />
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs text-white/50">
              <Loader2 size={11} className="animate-spin" />
              Jérémie réfléchit...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white/5 px-6 py-2 bg-black/10">
        <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-1.5">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Demande une explication ou un indice à Jérémie..."
            className="flex-1 bg-transparent text-xs text-white outline-none placeholder:text-white/30"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="rounded-lg bg-lyoko-blue/20 p-1.5 text-lyoko-blue transition-all hover:bg-lyoko-blue/30 disabled:opacity-30"
          >
            <Send size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
