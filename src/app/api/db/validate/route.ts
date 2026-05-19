import { NextRequest, NextResponse } from "next/server";
import { getExercises } from "@/lib/exercises/registry";
import { flexNormalize, flexContains } from "@/lib/flexible-compare";

// Import exercises to populate registry
import "@/lib/exercises/frontend-part1";
import "@/lib/exercises/frontend-part2";
import "@/lib/exercises/frontend-part3";
import "@/lib/exercises/frontend-part4";
import "@/lib/exercises/frontend-part5";
import "@/lib/exercises/javascript-part1";
import "@/lib/exercises/javascript-part2";
import "@/lib/exercises/javascript-part3";
import "@/lib/exercises/javascript-part4";
import "@/lib/exercises/python-part1";
import "@/lib/exercises/python-part2";
import "@/lib/exercises/python-part3";
import "@/lib/exercises/python-part4";
import "@/lib/exercises/python-part5";
import "@/lib/exercises/dart-part1";
import "@/lib/exercises/dart-part2";
import "@/lib/exercises/dart-part3";
import "@/lib/exercises/dart-part4";
import "@/lib/exercises/dart-part5";
import "@/lib/exercises/react-part1";
import "@/lib/exercises/react-part2";
import "@/lib/exercises/react-part3";
import "@/lib/exercises/react-part4";
import "@/lib/exercises/react-part5";
import "@/lib/exercises/nodejs-part1";
import "@/lib/exercises/nodejs-part2";
import "@/lib/exercises/nodejs-part3";
import "@/lib/exercises/nodejs-part4";
import "@/lib/exercises/nodejs-part5";
import "@/lib/exercises/cpp-part1";
import "@/lib/exercises/cpp-part2";
import "@/lib/exercises/cpp-part3";
import "@/lib/exercises/cpp-part4";
import "@/lib/exercises/cpp-part5";
import "@/lib/exercises/csharp-part1";
import "@/lib/exercises/csharp-part2";
import "@/lib/exercises/csharp-part3";
import "@/lib/exercises/csharp-part4";
import "@/lib/exercises/csharp-part5";

const PISTON_URL = "https://emkc.org/api/v2/piston";
const EXECUTE_LANGS: Record<string, { piston: string; version: string }> = {
  javascript: { piston: "javascript", version: "18.15.0" },
  python: { piston: "python", version: "3.10.0" },
  csharp: { piston: "csharp", version: "6.12.0" },
  dart: { piston: "dart", version: "2.19.6" },
  cpp: { piston: "c++", version: "10.2.0" },
};
const EXT_MAP: Record<string, string> = {
  javascript: "js", python: "py", csharp: "cs", dart: "dart", cpp: "cpp",
};

/**
 * POST /api/db/validate
 * Body: { moduleId, level, code }
 * Validates user code against exercise tests (same logic as web).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { moduleId, level, code } = body;

    if (!moduleId || !level || code === undefined) {
      return NextResponse.json({ success: false, error: "moduleId, level et code requis" }, { status: 400 });
    }

    const exercises = getExercises(moduleId);
    const idx = parseInt(String(level), 10) - 1;
    if (idx < 0 || idx >= exercises.length) {
      return NextResponse.json({ success: false, error: "Exercice introuvable" }, { status: 404 });
    }

    const ex = exercises[idx];
    const tests = ex.tests || [];

    const normalizeCode = (s: string) => {
      let n = flexNormalize(s);
      n = n.replace(/>\s+/g, ">").replace(/\s+</g, "<").replace(/\s+>/g, ">").replace(/<\s+/g, "<");
      return n;
    };

    const htmlContains = (norm: string, val: string): boolean => {
      if (norm.includes(val)) return true;
      const tagMatch = val.match(/^<(\w+)(?:\s[^>]*)?>(.+?)<\/\1>$/);
      if (tagMatch) {
        const [, tag, content] = tagMatch;
        const re = new RegExp(`<${tag}(?:\\s[^>]*)?>([^]*?)</${tag}>`, "gi");
        let m;
        while ((m = re.exec(norm)) !== null) {
          if (m[1].includes(content)) return true;
        }
      }
      return false;
    };

    const normalized = normalizeCode(code);
    let allPass = true;
    let failReason = "";

    for (const test of tests) {
      const expected = test.expected || (test as { expected_output?: string }).expected_output || "";
      if (!expected) continue;

      const val = normalizeCode(expected);
      const hasExpectedOutput = !!(test as { expected_output?: string }).expected_output;
      const ttype = (test.type as string) || (hasExpectedOutput ? "output" : "contains");

      if (ttype === "contains") {
        if (!htmlContains(normalized, val) && !flexContains(code, expected)) {
          allPass = false;
          failReason = `Attendu: "${expected}"`;
          break;
        }
      } else if (ttype === "not_contains") {
        if (htmlContains(normalized, val)) {
          allPass = false;
          failReason = "Ce contenu ne doit pas apparaître";
          break;
        }
      } else if (ttype === "match" || ttype === "regex" || ttype === "code_match") {
        // Regex tests always run against raw source — the pattern may
        // explicitly check for comment syntax (e.g. ^//)
        try {
          if (!new RegExp(expected, "i").test(code)) {
            allPass = false;
            failReason = "Le motif attendu n'est pas trouvé";
            break;
          }
        } catch {
          allPass = false;
          failReason = "Motif invalide";
          break;
        }
      } else if (ttype === "exact") {
        if (normalized !== val && flexNormalize(code) !== flexNormalize(expected)) {
          allPass = false;
          failReason = "Correspondance exacte requise";
          break;
        }
      } else if (ttype === "output") {
        // Execute via Piston for Python, JS, etc.
        const lang = getExecuteLanguage(moduleId);
        if (!lang) {
          // Fallback: check source (e.g. frontend)
          if (!flexContains(code, expected) && !normalized.includes(val)) {
            allPass = false;
            failReason = `Attendu dans la sortie: "${expected}"`;
            break;
          }
          continue;
        }

        const output = await executeCode(code, lang);
        if (output === null) {
          allPass = false;
          failReason = "Erreur d'exécution du code";
          break;
        }

        const expectedOut = expected || (test as { expected_output?: string }).expected_output || "";
        if (!flexContains(output, expectedOut) && !normalizeCode(output).includes(normalizeCode(expectedOut))) {
          allPass = false;
          failReason = `Sortie attendue: "${expectedOut}"`;
          break;
        }
      }
    }

    return NextResponse.json({
      success: allPass,
      exerciseId: ex.id,
      error: allPass ? undefined : (failReason || "Réponse incorrecte"),
    });
  } catch (err) {
    console.error("Validate API error:", err);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}

function getExecuteLanguage(moduleId: string): string | null {
  const map: Record<string, string> = {
    javascript: "javascript",
    react: "javascript",
    nodejs: "javascript",
    python: "python",
    csharp: "csharp",
    dart: "dart",
    cpp: "cpp",
  };
  return map[moduleId] || null;
}

async function executeCode(code: string, language: string): Promise<string | null> {
  const cfg = EXECUTE_LANGS[language];
  if (!cfg) return null;

  try {
    const ext = EXT_MAP[language] || "txt";
    const res = await fetch(`${PISTON_URL}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: cfg.piston,
        version: cfg.version,
        files: [{ name: `main.${ext}`, content: code }],
        stdin: "",
        compile_timeout: 10000,
        run_timeout: 10000,
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const out = data.run?.output || "";
    const err = data.run?.stderr || data.compile?.stderr || "";
    return out + (err ? `\n${err}` : "");
  } catch {
    return null;
  }
}
