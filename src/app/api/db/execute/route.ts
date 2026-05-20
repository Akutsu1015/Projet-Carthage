import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/api-auth";
import { getDb } from "@/lib/db";

function logExecution(params: {
  userId: number | null;
  ip: string;
  language: string;
  exitCode: number | null;
  codeLen: number;
  durationMs: number;
  error: string | null;
}) {
  try {
    getDb().prepare(
      `INSERT INTO execution_log (user_id, ip, language, exit_code, code_len, duration_ms, error)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(params.userId, params.ip, params.language, params.exitCode, params.codeLen, params.durationMs, params.error);
  } catch (e) {
    console.error("[execute] log failed:", e);
  }
}

// Public Piston (emkc.org) became whitelist-only on 2026-02-15.
// Default to a self-hosted instance on localhost:2000 (see docker-compose.piston.yml).
// Override with PISTON_URL env var to point at any Piston-compatible API.
const PISTON_URL = process.env.PISTON_URL || "http://localhost:2000/api/v2";

// Per-user / per-IP cooldown (anti-burst, beyond the global IP rate-limit in middleware).
const COOLDOWN_MS = 2000;
const DAILY_LIMIT = 300;
const lastExecAt = new Map<string, number>();
const dailyCount = new Map<string, { day: string; count: number }>();
const inFlight = new Set<string>();

function today() {
  return new Date().toISOString().slice(0, 10);
}

function rateLimitUser(key: string): { ok: true } | { ok: false; status: number; error: string; retryAfter?: number } {
  const now = Date.now();
  const last = lastExecAt.get(key);
  if (last && now - last < COOLDOWN_MS) {
    return { ok: false, status: 429, error: "Trop rapide, attendez 2 secondes.", retryAfter: Math.ceil((COOLDOWN_MS - (now - last)) / 1000) };
  }
  const d = today();
  const q = dailyCount.get(key);
  if (q && q.day === d && q.count >= DAILY_LIMIT) {
    return { ok: false, status: 429, error: `Quota journalier atteint (${DAILY_LIMIT} exécutions). Reviens demain.` };
  }
  if (inFlight.has(key)) {
    return { ok: false, status: 429, error: "Une exécution est déjà en cours." };
  }
  return { ok: true };
}

function recordExec(key: string) {
  const now = Date.now();
  lastExecAt.set(key, now);
  const d = today();
  const q = dailyCount.get(key);
  if (!q || q.day !== d) dailyCount.set(key, { day: d, count: 1 });
  else q.count++;
}

// Language configs: piston language name + version
const LANGUAGES: Record<string, { piston: string; version: string; name: string }> = {
  javascript: { piston: "javascript", version: "18.15.0", name: "JavaScript" },
  typescript: { piston: "typescript", version: "5.0.3", name: "TypeScript" },
  python: { piston: "python", version: "3.10.0", name: "Python" },
  java: { piston: "java", version: "15.0.2", name: "Java" },
  c: { piston: "c", version: "10.2.0", name: "C" },
  cpp: { piston: "c++", version: "10.2.0", name: "C++" },
  csharp: { piston: "csharp", version: "6.12.0", name: "C#" },
  go: { piston: "go", version: "1.16.2", name: "Go" },
  rust: { piston: "rust", version: "1.68.2", name: "Rust" },
  ruby: { piston: "ruby", version: "3.0.1", name: "Ruby" },
  php: { piston: "php", version: "8.2.3", name: "PHP" },
  swift: { piston: "swift", version: "5.3.3", name: "Swift" },
  kotlin: { piston: "kotlin", version: "1.8.20", name: "Kotlin" },
  dart: { piston: "dart", version: "2.19.6", name: "Dart" },
  lua: { piston: "lua", version: "5.4.4", name: "Lua" },
  perl: { piston: "perl", version: "5.36.0", name: "Perl" },
  r: { piston: "r", version: "4.1.1", name: "R" },
  bash: { piston: "bash", version: "5.2.0", name: "Bash" },
  sql: { piston: "sqlite3", version: "3.36.0", name: "SQL" },
};

export async function GET() {
  // Return available languages
  const langs = Object.entries(LANGUAGES).map(([key, { name }]) => ({ key, name }));
  return NextResponse.json({ success: true, languages: langs });
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "ip:unknown";
  const key = user ? `user:${user.id}` : `ip:${ip}`;

  const gate = rateLimitUser(key);
  if (!gate.ok) {
    return NextResponse.json(
      { success: false, error: gate.error },
      { status: gate.status, headers: gate.retryAfter ? { "Retry-After": String(gate.retryAfter) } : undefined }
    );
  }

  inFlight.add(key);
  const t0 = Date.now();
  let logLang = "";
  let logCodeLen = 0;
  let logExitCode: number | null = null;
  let logError: string | null = null;
  try {
    const { language, code, stdin } = await req.json();
    logLang = String(language || "");
    logCodeLen = typeof code === "string" ? code.length : 0;

    if (!language || !code) {
      return NextResponse.json({ success: false, error: "Langue et code requis" }, { status: 400 });
    }

    if (typeof code === "string" && code.length > 50_000) {
      return NextResponse.json({ success: false, error: "Code trop long (max 50 000 caractères)." }, { status: 413 });
    }
    if (typeof stdin === "string" && stdin.length > 10_000) {
      return NextResponse.json({ success: false, error: "Stdin trop long (max 10 000 caractères)." }, { status: 413 });
    }

    const lang = LANGUAGES[language];
    if (!lang) {
      return NextResponse.json({ success: false, error: `Langue "${language}" non supportée` }, { status: 400 });
    }

    recordExec(key);

    // Determine file extension
    const extMap: Record<string, string> = {
      javascript: "js", typescript: "ts", python: "py", java: "java",
      c: "c", cpp: "cpp", csharp: "cs", go: "go", rust: "rs",
      ruby: "rb", php: "php", swift: "swift", kotlin: "kt", dart: "dart",
      lua: "lua", perl: "pl", r: "r", bash: "sh", sql: "sql",
    };

    const res = await fetch(`${PISTON_URL}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: lang.piston,
        version: lang.version,
        files: [{ name: `main.${extMap[language] || "txt"}`, content: code }],
        stdin: stdin || "",
        compile_timeout: 10000,
        run_timeout: 10000,
        compile_memory_limit: -1,
        run_memory_limit: -1,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      logError = `piston ${res.status}`;
      return NextResponse.json({ success: false, error: `Erreur Piston: ${res.status} ${text}` }, { status: 502 });
    }

    const data = await res.json();

    const output = data.run?.output || "";
    const stderr = data.run?.stderr || "";
    const compileOutput = data.compile?.output || "";
    const compileStderr = data.compile?.stderr || "";
    const exitCode = data.run?.code ?? -1;
    logExitCode = exitCode;

    return NextResponse.json({
      success: true,
      output: output.slice(0, 10000),
      stderr: (stderr || compileStderr).slice(0, 5000),
      compileOutput: (compileOutput).slice(0, 5000),
      exitCode,
      language: lang.name,
    });
  } catch (e: any) {
    logError = e?.message || "unknown";
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  } finally {
    inFlight.delete(key);
    logExecution({
      userId: user?.id ?? null,
      ip,
      language: logLang,
      exitCode: logExitCode,
      codeLen: logCodeLen,
      durationMs: Date.now() - t0,
      error: logError,
    });
  }
}
