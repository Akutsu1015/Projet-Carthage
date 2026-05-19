import { flexNormalize, flexContains, flexValueEqual } from "@/lib/flexible-compare";

/**
 * Shared code-exercise validation logic used by both exercise clients.
 *
 * Why this file exists:
 *   The previous validation logic had three bugs that allowed wrong answers
 *   to be accepted as correct, across all blocks (fullstack, mobile, desktop):
 *
 *   1. The `output` test type (used by ~114 JavaScript exercises) was not
 *      handled at all in the enhanced client → any code validated.
 *   2. `strictContains` vacuously returned `true` whenever the expected
 *      string contained `<` and `>` but no full `<tag>…</tag>` pair
 *      (e.g. `<h1>`, `</div>`, `#include <stdio.h>`, `std::vector<int>`) →
 *      those tests always passed.
 *   3. Unknown test types and empty `tests` arrays silently passed.
 *
 *   This module fixes all three and keeps the client and API route in sync.
 */

export interface ExerciseTest {
  type?: string;
  expected?: string;
  expected_output?: string;
  input?: string;
  message?: string;
  [k: string]: unknown;
}

export interface ValidateResult {
  pass: boolean;
  failReason?: string;
}

/** Normalize code for fuzzy comparison (case, whitespace, HTML-tag spacing). */
export function normalizeCode(s: string): string {
  let n = flexNormalize(s);
  n = n.replace(/>\s+/g, ">").replace(/\s+</g, "<").replace(/\s+>/g, ">").replace(/<\s+/g, "<");
  return n;
}

/**
 * Strict "contains" check.
 *
 *   1. Baseline: the normalized `expected` string MUST be found as a
 *      substring of the normalized user code.
 *   2. Relaxation: when `expected` wraps content in paired HTML tags
 *      (`<tag …>content</tag>`), the content is also accepted if it
 *      appears inside any tag of the same name in the user code — this
 *      lets users format their HTML slightly differently (extra attributes,
 *      line breaks) while still being considered correct.
 *
 * Critically, if `expected` contains `<` and `>` but NO full tag pair
 * (opening tag alone, closing tag alone, generic like `std::vector<int>`,
 * preprocessor include like `#include <stdio.h>`), the function falls back
 * to the strict substring check rather than vacuously returning `true`.
 */
export function strictContains(userCode: string, expected: string): boolean {
  const normUser = normalizeCode(userCode);
  const normExpected = normalizeCode(expected);

  if (normUser.includes(normExpected)) return true;

  // Flexible HTML matching only when `expected` has full <tag>…</tag> pairs.
  if (expected.includes("<") && expected.includes(">")) {
    const tagMatches = Array.from(
      expected.matchAll(/<(\w+)(?:\s[^>]*)?>([^]*?)<\/\1>/gi)
    );
    if (tagMatches.length === 0) return false; // No full tags → strict substring only

    for (const match of tagMatches) {
      const fullTag = match[0];
      const tagName = match[1];
      const tagContent = match[2];
      if (normUser.includes(normalizeCode(fullTag))) continue;

      const userTagRe = new RegExp(
        `<${tagName}(?:\\s[^>]*)?>([^]*?)</${tagName}>`,
        "gi"
      );
      let found = false;
      let userMatch: RegExpExecArray | null;
      while ((userMatch = userTagRe.exec(userCode)) !== null) {
        if (flexNormalize(userMatch[1]).includes(flexNormalize(tagContent))) {
          found = true;
          break;
        }
      }
      if (!found) return false;
    }
    return true;
  }

  return false;
}

/** Modules whose code we can execute safely in the browser sandbox. */
const JS_EXECUTABLE_MODULES = new Set(["javascript", "react", "nodejs"]);

/**
 * Strip single-line and block comments from source so that a string appearing
 * only in a comment is not mistaken for actual code.
 *
 *   - `//…` and `/* … *​/` for JS-family, C, C++, C#, Dart
 *   - `#…` for Python
 *   - `<!-- … -->` for HTML
 *
 * Strings inside quoted literals are preserved. This is deliberately
 * permissive — good enough to stop a code template whose comment
 * literally contains the expected answer from trivially passing.
 */
function stripComments(source: string, moduleId: string): string {
  const isPy = moduleId === "python";
  const isHtml = moduleId === "frontend";
  let out = "";
  let i = 0;
  let inStr: string | null = null;
  let esc = false;
  while (i < source.length) {
    const c = source[i];
    const n = source[i + 1];
    if (inStr) {
      if (esc) { esc = false; out += c; i++; continue; }
      if (c === "\\") { esc = true; out += c; i++; continue; }
      if (c === inStr) inStr = null;
      out += c; i++; continue;
    }
    if (!isPy && c === "/" && n === "/") {
      while (i < source.length && source[i] !== "\n") i++;
      continue;
    }
    if (!isPy && c === "/" && n === "*") {
      i += 2;
      while (i < source.length && !(source[i] === "*" && source[i + 1] === "/")) i++;
      i += 2;
      continue;
    }
    if (isPy && c === "#") {
      while (i < source.length && source[i] !== "\n") i++;
      continue;
    }
    if (isHtml && c === "<" && source.startsWith("<!--", i)) {
      const end = source.indexOf("-->", i + 4);
      i = end === -1 ? source.length : end + 3;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") { inStr = c; out += c; i++; continue; }
    out += c;
    i++;
  }
  return out;
}

/**
 * Extract string literal contents from source code.
 * Handles single/double-quoted strings and backtick templates.
 * Returns the *unescaped* content of each string (e.g. \t → tab, \n → newline).
 * This lets us compare expected output against what the code would actually print.
 */
function extractStringLiterals(source: string): string[] {
  const literals: string[] = [];
  let i = 0;
  while (i < source.length) {
    const c = source[i];
    if (c === '"' || c === "'" || c === "`") {
      const quote = c;
      i++; // skip opening quote
      let content = "";
      while (i < source.length && source[i] !== quote) {
        if (source[i] === "\\" && i + 1 < source.length) {
          const next = source[i + 1];
          // Common escape sequences
          switch (next) {
            case "n": content += "\n"; i += 2; break;
            case "t": content += "\t"; i += 2; break;
            case "r": content += "\r"; i += 2; break;
            case "\\": content += "\\"; i += 2; break;
            case "'": content += "'"; i += 2; break;
            case '"': content += '"'; i += 2; break;
            case "`": content += "`"; i += 2; break;
            default: content += source[i] + source[i + 1]; i += 2; break;
          }
        } else {
          content += source[i];
          i++;
        }
      }
      i++; // skip closing quote
      literals.push(content);
    } else {
      i++;
    }
  }
  return literals;
}

/** Run untrusted JS in a sandboxed `new Function` and capture console.log output. */
function executeJsInSandbox(code: string): string | null {
  try {
    const logs: string[] = [];
    const fakeConsole = {
      log: (...args: unknown[]) =>
        logs.push(
          args
            .map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a)))
            .join(" ")
        ),
      warn: () => {},
      error: () => {},
      info: () => {},
    };
    // Minimal localStorage mock for JS exercises that use it
    const store: Record<string, string> = {};
    const fakeLocalStorage = {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => { store[key] = value; },
      removeItem: (key: string) => { delete store[key]; },
      clear: () => { for (const k in store) delete store[k]; },
      get length() { return Object.keys(store).length; },
      key: (i: number) => Object.keys(store)[i] ?? null,
    };
    const fn = new Function("console", "localStorage", code);
    fn(fakeConsole, fakeLocalStorage);
    return logs.join("\n");
  } catch {
    return null;
  }
}

/**
 * Validate user code against the exercise's `tests` array.
 *
 * Supported test types:
 *   - `contains` (default when `expected` is set) — strictContains check
 *   - `not_contains` — strictContains must NOT match
 *   - `match` / `regex` / `code_match` — regex test against source
 *   - `exact` — flexNormalize equality
 *   - `output` — for JS modules: actually run the code and compare output;
 *                for other modules: fall back to source substring check
 *                (Python/Dart/C++/C# can't run in the browser sandbox).
 *
 * Unknown types default to `contains` semantics rather than silently passing.
 * An exercise with no tests is considered a failure (defensive).
 */
export function validateCode(
  code: string,
  tests: ExerciseTest[] | undefined,
  moduleId: string
): ValidateResult {
  if (!tests || tests.length === 0) {
    return { pass: false, failReason: "Aucun test défini pour cet exercice." };
  }

  // Strip comments so that a template whose comments literally contain the
  // expected keywords/output (very common in Python and C++ exercises)
  // doesn't trivially validate. Quoted strings are preserved.
  const codeNoComments = stripComments(code, moduleId);
  const normalizedNoComments = normalizeCode(codeNoComments);

  /** Some exercises (e.g. `cs_5` "Commentaires en C#") explicitly ask the
   *  learner to write a comment. When the expected string itself starts
   *  with a comment marker, we must check the *raw* source — otherwise
   *  our own comment-stripping removes what we're supposed to be verifying. */
  const expectedIsCommentLike = (s: string): boolean =>
    /^\s*(?:\/\/|\/\*|#|<!--)/.test(s);
  const pickSource = (expected: string): string =>
    expectedIsCommentLike(expected) ? code : codeNoComments;

  /** Single-value output match: split output into lines and compare each with
   *  `flexValueEqual` so that e.g. expected "0" is NOT accepted when the
   *  program prints "-10" (which naively contains the character "0"). */
  const outputMatchesValue = (output: string, expected: string): boolean => {
    const lines = output.split(/\r?\n/);
    if (lines.some((l) => flexValueEqual(l, expected))) return true;
    // For multi-line expected values, fall back to substring
    if (expected.includes("\n")) {
      return normalizeCode(output).includes(normalizeCode(expected));
    }
    return false;
  };

  for (const test of tests) {
    const expected =
      (typeof test.expected === "string" && test.expected) ||
      (typeof test.expected_output === "string" && test.expected_output) ||
      "";
    if (!expected) continue; // purely informational tests

    // Default type resolution: if `expected_output` is present and no explicit
    // type, assume "output". Otherwise assume "contains".
    const ttype =
      (typeof test.type === "string" && test.type) ||
      (test.expected_output ? "output" : "contains");

    const source = pickSource(expected);

    if (ttype === "contains") {
      if (!strictContains(source, expected)) {
        return { pass: false, failReason: `Attendu : "${expected}"` };
      }
    } else if (ttype === "not_contains") {
      if (strictContains(source, expected)) {
        return {
          pass: false,
          failReason: `Ce contenu ne doit pas apparaître : "${expected}"`,
        };
      }
    } else if (ttype === "match" || ttype === "regex" || ttype === "code_match") {
      // Regex tests always run against raw source — the pattern may be
      // explicitly checking for comment syntax (e.g. ^//) which would be
      // stripped by stripComments, causing a false negative.
      let re: RegExp;
      try {
        re = new RegExp(expected, "i");
      } catch {
        return { pass: false, failReason: "Motif invalide." };
      }
      if (!re.test(code)) {
        return { pass: false, failReason: "Le motif attendu n'est pas trouvé." };
      }
    } else if (ttype === "exact") {
      const normSrc = expectedIsCommentLike(expected)
        ? normalizeCode(code)
        : normalizedNoComments;
      const flexSrc = expectedIsCommentLike(expected)
        ? flexNormalize(code)
        : flexNormalize(codeNoComments);
      if (
        flexSrc !== flexNormalize(expected) &&
        normSrc !== normalizeCode(expected)
      ) {
        return { pass: false, failReason: "Correspondance exacte requise." };
      }
    } else if (ttype === "output") {
      if (JS_EXECUTABLE_MODULES.has(moduleId)) {
        const out = executeJsInSandbox(code);
        if (out === null) {
          return { pass: false, failReason: "Erreur d'exécution du code." };
        }
        if (!outputMatchesValue(out, expected)) {
          return { pass: false, failReason: `Sortie attendue : "${expected}"` };
        }
      } else {
        // Non-executable here (Python/Dart/C++/C# etc.): we can't actually
        // run the code client-side, so we approximate by checking that the
        // expected output appears in the user's string literals.
        // 1. Check if the expected output is a substring of any extracted
        //    string literal (handles escape sequences like \t, \n).
        // 2. Fall back to flexContains on the raw source for non-string
        //    outputs (numbers, booleans, etc.).
        const literals = extractStringLiterals(codeNoComments);
        const foundInLiteral = literals.some(lit =>
          outputMatchesValue(lit, expected) || flexContains(lit, expected)
        );
        const foundInSource = flexContains(codeNoComments, expected);
        if (!foundInLiteral && !foundInSource) {
          return { pass: false, failReason: `Sortie attendue : "${expected}"` };
        }
      }
    } else {
      // Unknown type: fall back to strict contains (never silently pass)
      if (!strictContains(source, expected)) {
        return { pass: false, failReason: `Attendu : "${expected}"` };
      }
    }
  }

  return { pass: true };
}
