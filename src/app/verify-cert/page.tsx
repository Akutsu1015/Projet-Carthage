"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Shield, CheckCircle2, XCircle, Search } from "lucide-react";

interface CertInfo {
  username: string;
  displayName: string;
  moduleId: string;
  score: number;
  maxScore: number;
  issuedAt: string;
  paid: number;
}

export default function VerifyCertPage() {
  const params = useSearchParams();
  const [code, setCode] = useState(params.get("code") || "");
  const [cert, setCert] = useState<CertInfo | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const verify = async (c?: string) => {
    const codeToUse = c || code;
    if (!codeToUse) return;
    setLoading(true);
    setError("");
    setCert(null);
    try {
      const res = await fetch(`/api/certification?action=verify&code=${encodeURIComponent(codeToUse)}`);
      const data = await res.json();
      if (data.success) {
        setCert(data.certificate);
      } else {
        setError(data.error || "Certificat introuvable");
      }
    } catch {
      setError("Erreur de connexion");
    }
    setLoading(false);
  };

  useEffect(() => {
    const c = params.get("code");
    if (c) { setCode(c); verify(c); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const moduleNames: Record<string, string> = {
    frontend: "HTML & CSS", javascript: "JavaScript", python: "Python",
    react: "React", nodejs: "Node.js", csharp: "C# .NET", cpp: "C/C++", dart: "Dart & Flutter",
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <Shield className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold font-[family-name:var(--font-orbitron)] text-cyan-400">Vérification de certificat</h1>
          <p className="text-sm text-gray-400 mt-2">Projet Carthage — Certification officielle</p>
        </div>

        <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-6 mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Code de vérification (ex: a1b2c3d4e5f6g7h8)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 font-mono"
              onKeyDown={(e) => e.key === "Enter" && verify()}
            />
            <button
              onClick={() => verify()}
              disabled={loading || !code}
              className="px-4 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-30 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center text-gray-400 animate-pulse">Vérification en cours...</div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <p className="text-red-400 font-medium">{error}</p>
          </div>
        )}

        {cert && (
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-6">
            <div className="text-center mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-white">Certificat valide</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Détenteur</span>
                <span className="text-white font-medium">{cert.displayName} (@{cert.username})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Module</span>
                <span className="text-cyan-400 font-medium">{moduleNames[cert.moduleId] || cert.moduleId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Score</span>
                <span className="text-white font-medium">{cert.score}/{cert.maxScore} ({Math.round(cert.score / cert.maxScore * 100)}%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Date d&apos;émission</span>
                <span className="text-white">{new Date(cert.issuedAt).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Statut</span>
                <span className="text-green-400 font-medium">✓ Certifié</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
