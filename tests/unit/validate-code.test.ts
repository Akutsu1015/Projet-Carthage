import { describe, it, expect } from "vitest";
import { validateCode, strictContains, normalizeCode } from "@/lib/exercises/validate-code";

describe("normalizeCode", () => {
  it("lowercases and trims whitespace", () => {
    expect(normalizeCode("  Hello  WORLD  ")).toBe("hello world");
  });
  it("collapses spaces around opening angle brackets", () => {
    expect(normalizeCode("< div > content")).toBe("<div>content");
  });
});

describe("strictContains", () => {
  it("matches substring", () => {
    expect(strictContains("print('hello')", "hello")).toBe(true);
  });
  it("rejects non-substring", () => {
    expect(strictContains("print('hello')", "world")).toBe(false);
  });
  it("accepts paired tag with different attributes", () => {
    expect(strictContains("<h1 class='x'>Hi</h1>", "<h1>Hi</h1>")).toBe(true);
  });
  it("falls back to strict for orphan opening tag", () => {
    // <h1> alone (no closing) — must be strict substring, not vacuous true
    expect(strictContains("<h1 id='a'>Hi</h1>", "<h1>")).toBe(false);
    expect(strictContains("<h1>plain", "<h1>")).toBe(true);
  });
  it("falls back to strict for include statements (no full tag pair)", () => {
    // #include <stdio.h> should not vacuously match
    expect(strictContains("int main(){}", "#include <stdio.h>")).toBe(false);
    expect(strictContains("#include <stdio.h>\nint main(){}", "#include <stdio.h>")).toBe(true);
  });
  it("falls back to strict for C++ generics", () => {
    expect(strictContains("int x = 1;", "std::vector<int>")).toBe(false);
    expect(strictContains("std::vector<int> v;", "std::vector<int>")).toBe(true);
  });
});

describe("validateCode — contains type", () => {
  it("accepts code containing expected", () => {
    const r = validateCode("print('hello')", [{ type: "contains", expected: "print" }], "python");
    expect(r.pass).toBe(true);
  });
  it("rejects code missing expected", () => {
    const r = validateCode("x = 1", [{ type: "contains", expected: "print" }], "python");
    expect(r.pass).toBe(false);
  });
  it("ignores content inside comments (Python)", () => {
    // The hint is inside a comment; the user has NOT actually written print()
    const r = validateCode("# print('hello')\nx = 1", [{ expected: "print" }], "python");
    expect(r.pass).toBe(false);
  });
  it("ignores content inside comments (C++)", () => {
    const r = validateCode("// cout << \"hi\";\nint main(){}", [{ expected: "cout" }], "cpp");
    expect(r.pass).toBe(false);
  });
  it("does NOT strip comments when the expected itself starts with a comment marker", () => {
    // cs_5 case: exercise asks to write a comment
    const r = validateCode("// my comment\nint x;", [{ expected: "// my comment" }], "csharp");
    expect(r.pass).toBe(true);
  });
});

describe("validateCode — not_contains type", () => {
  it("accepts when expected is absent", () => {
    const r = validateCode("let x=1;", [{ type: "not_contains", expected: "var " }], "javascript");
    expect(r.pass).toBe(true);
  });
  it("rejects when expected is present", () => {
    const r = validateCode("var x=1;", [{ type: "not_contains", expected: "var " }], "javascript");
    expect(r.pass).toBe(false);
  });
});

describe("validateCode — match/regex type", () => {
  it("accepts matching regex", () => {
    const r = validateCode("const x = 42;", [{ type: "regex", expected: "const\\s+\\w+\\s*=" }], "javascript");
    expect(r.pass).toBe(true);
  });
  it("rejects non-matching regex", () => {
    const r = validateCode("let x = 42;", [{ type: "regex", expected: "const\\s+\\w+" }], "javascript");
    expect(r.pass).toBe(false);
  });
  it("rejects invalid regex gracefully", () => {
    const r = validateCode("x", [{ type: "regex", expected: "[" }], "javascript");
    expect(r.pass).toBe(false);
  });
});

describe("validateCode — output type", () => {
  it("executes JS and matches stdout", () => {
    const r = validateCode("console.log('Hello, World!')", [{ type: "output", expected: "Hello, World!" }], "javascript");
    expect(r.pass).toBe(true);
  });
  it("distinguishes -10 from 0 (no naive substring)", () => {
    // Bug regression: "0" must NOT match a line printing "-10"
    const r = validateCode("console.log(-10)", [{ type: "output", expected: "0" }], "javascript");
    expect(r.pass).toBe(false);
  });
  it("rejects code that throws", () => {
    const r = validateCode("throw new Error('boom')", [{ type: "output", expected: "x" }], "javascript");
    expect(r.pass).toBe(false);
  });
  it("for Python: checks string literal contains expected", () => {
    // Python can't execute in browser → fallback to literal check
    const r = validateCode("print('Hello, World!')", [{ type: "output", expected: "Hello, World!" }], "python");
    expect(r.pass).toBe(true);
  });
  it("for Python: handles \\n escape in string literal", () => {
    const r = validateCode("print('a\\nb')", [{ type: "output", expected: "a\nb" }], "python");
    expect(r.pass).toBe(true);
  });
});

describe("validateCode — defensive cases", () => {
  it("empty tests array fails (never silently passes)", () => {
    const r = validateCode("x", [], "python");
    expect(r.pass).toBe(false);
  });
  it("undefined tests fails", () => {
    const r = validateCode("x", undefined, "python");
    expect(r.pass).toBe(false);
  });
  it("unknown test type falls back to contains semantics", () => {
    const r = validateCode("print('x')", [{ type: "fancy_new_type", expected: "print" }], "python");
    expect(r.pass).toBe(true);
    const r2 = validateCode("x=1", [{ type: "fancy_new_type", expected: "print" }], "python");
    expect(r2.pass).toBe(false);
  });
  it("test without expected is informational (skipped)", () => {
    // A test missing expected should not block; only test with expected counts
    const r = validateCode("print('x')", [{ type: "contains" } as any, { expected: "print" }], "python");
    expect(r.pass).toBe(true);
  });
});
