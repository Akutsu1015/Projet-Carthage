import { NextRequest, NextResponse } from "next/server";

const PISTON_URL = "https://emkc.org/api/v2/piston";

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
  try {
    const { language, code, stdin } = await req.json();

    if (!language || !code) {
      return NextResponse.json({ success: false, error: "Langue et code requis" }, { status: 400 });
    }

    const lang = LANGUAGES[language];
    if (!lang) {
      return NextResponse.json({ success: false, error: `Langue "${language}" non supportée` }, { status: 400 });
    }

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
      return NextResponse.json({ success: false, error: `Erreur Piston: ${res.status} ${text}` }, { status: 502 });
    }

    const data = await res.json();

    const output = data.run?.output || "";
    const stderr = data.run?.stderr || "";
    const compileOutput = data.compile?.output || "";
    const compileStderr = data.compile?.stderr || "";
    const exitCode = data.run?.code ?? -1;

    return NextResponse.json({
      success: true,
      output: output.slice(0, 10000),
      stderr: (stderr || compileStderr).slice(0, 5000),
      compileOutput: (compileOutput).slice(0, 5000),
      exitCode,
      language: lang.name,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
