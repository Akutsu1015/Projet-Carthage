"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Loader2, Minimize2, Maximize2, Trash2 } from "lucide-react";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (open && !minimized) inputRef.current?.focus();
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
        body: JSON.stringify({ messages: newMessages, exerciseContext }),
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

  // Floating button when closed
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 group flex items-center gap-3 rounded-2xl border border-lyoko-blue/30 bg-dark-card/95 px-4 py-3 shadow-2xl shadow-lyoko-blue/20 backdrop-blur-xl transition-all hover:scale-105 hover:border-lyoko-blue/50 hover:shadow-lyoko-blue/30"
      >
        <div className="relative">
          <JeremyAvatar size={44} />
          <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-dark-card bg-lyoko-green" />
        </div>
        <div className="text-left">
          <div className="text-xs font-bold text-white">Jérémie Belpois</div>
          <div className="text-[10px] text-white/50">Assistant IA</div>
        </div>
      </button>
    );
  }

  // Minimized state
  if (minimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl border border-lyoko-blue/30 bg-dark-card/95 px-4 py-2 shadow-2xl backdrop-blur-xl">
        <JeremyAvatar size={32} speaking={speaking} />
        <span className="text-xs font-bold text-white">Jérémie</span>
        <button onClick={() => setMinimized(false)} className="ml-2 rounded p-1 text-white/50 hover:bg-white/10 hover:text-white">
          <Maximize2 size={14} />
        </button>
        <button onClick={() => { setOpen(false); setMinimized(false); }} className="rounded p-1 text-white/50 hover:bg-white/10 hover:text-xana-red">
          <X size={14} />
        </button>
      </div>
    );
  }

  // Full chat window
  return (
    <div className="fixed bottom-6 right-6 z-50 flex w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-lyoko-blue/20 bg-dark-card/95 shadow-2xl shadow-lyoko-blue/10 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/5 bg-gradient-to-r from-lyoko-blue/10 to-transparent px-4 py-3">
        <JeremyAvatar size={40} speaking={speaking} />
        <div className="flex-1">
          <div className="text-sm font-bold text-white">Jérémie Belpois</div>
          <div className="text-[10px] text-lyoko-green">
            {loading ? "Analyse en cours..." : "Supercalculateur en ligne"}
          </div>
        </div>
        <button onClick={clearChat} className="rounded p-1.5 text-white/30 hover:bg-white/10 hover:text-white" title="Effacer la conversation">
          <Trash2 size={14} />
        </button>
        <button onClick={() => setMinimized(true)} className="rounded p-1.5 text-white/30 hover:bg-white/10 hover:text-white">
          <Minimize2 size={14} />
        </button>
        <button onClick={() => setOpen(false)} className="rounded p-1.5 text-white/30 hover:bg-white/10 hover:text-xana-red">
          <X size={14} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3" style={{ maxHeight: "400px", minHeight: "200px" }}>
        {messages.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <JeremyAvatar size={80} />
            <div>
              <p className="text-sm font-medium text-white">Salut ! C&apos;est Jérémie.</p>
              <p className="mt-1 text-xs text-white/50">
                J&apos;ai mon supercalculateur prêt ! Dis-moi sur quoi tu bloques et on va résoudre ça ensemble.
              </p>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-1.5">
              {["Je comprends pas l'exercice", "J'ai une erreur", "Explique-moi le concept", "Donne-moi un indice"].map((q) => (
                <button
                  key={q}
                  onClick={() => { setInput(q); }}
                  className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-white/60 transition-all hover:border-lyoko-blue/30 hover:bg-lyoko-blue/10 hover:text-white"
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
              <div className="mr-2 mt-1 flex-shrink-0">
                <JeremyAvatar size={28} speaking={loading && i === messages.length - 1} />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                msg.role === "user"
                  ? "rounded-br-sm bg-lyoko-blue/20 text-white"
                  : "rounded-bl-sm bg-white/5 text-white/90"
              }`}
            >
              {msg.role === "assistant" ? renderContent(msg.content) : msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="mb-3 flex justify-start">
            <div className="mr-2 mt-1 flex-shrink-0">
              <JeremyAvatar size={28} speaking={true} />
            </div>
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm bg-white/5 px-3 py-2 text-xs text-white/50">
              <Loader2 size={12} className="animate-spin" />
              Jérémie réfléchit...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white/5 px-3 py-2">
        <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Demande à Jérémie..."
            className="flex-1 bg-transparent text-xs text-white outline-none placeholder:text-white/30"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="rounded-lg bg-lyoko-blue/20 p-1.5 text-lyoko-blue transition-all hover:bg-lyoko-blue/30 disabled:opacity-30"
          >
            <Send size={14} />
          </button>
        </div>
        <p className="mt-1 text-center text-[9px] text-white/20">
          Jérémie ne donne pas les solutions — il guide !
        </p>
      </div>
    </div>
  );
}
