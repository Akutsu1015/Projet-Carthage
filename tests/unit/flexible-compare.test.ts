import { describe, it, expect } from "vitest";
import { flexNormalize, flexEqual, flexContains, flexValueEqual } from "@/lib/flexible-compare";

describe("flexNormalize", () => {
  it("trims and lowercases", () => {
    expect(flexNormalize("  Hello World  ")).toBe("hello world");
  });
  it("collapses internal whitespace", () => {
    expect(flexNormalize("a   b\tc\nd")).toBe("a b c d");
  });
  it("removes space before punctuation", () => {
    expect(flexNormalize("Hello !")).toBe("hello!");
    expect(flexNormalize("Salut , ami .")).toBe("salut, ami.");
  });
  it("normalizes smart quotes", () => {
    expect(flexNormalize("'curly' “double”")).toBe("'curly' \"double\"");
  });
});

describe("flexEqual", () => {
  it("ignores case and whitespace", () => {
    expect(flexEqual("Hello World", "  HELLO   world  ")).toBe(true);
  });
  it("rejects different content", () => {
    expect(flexEqual("hello", "world")).toBe(false);
  });
});

describe("flexContains", () => {
  it("substring after normalization", () => {
    expect(flexContains("The Quick brown FOX", "quick brown")).toBe(true);
  });
  it("no false positive", () => {
    expect(flexContains("hello", "world")).toBe(false);
  });
});

describe("flexValueEqual", () => {
  it("numeric equivalence: 5 vs 5.0", () => {
    expect(flexValueEqual("5", "5.0")).toBe(true);
  });
  it("preserves -10 ≠ 0 (regression guard)", () => {
    expect(flexValueEqual("-10", "0")).toBe(false);
  });
  it("boolean true/false strict", () => {
    expect(flexValueEqual("true", "true")).toBe(true);
    expect(flexValueEqual("true", "false")).toBe(false);
  });
  it("JSON array deep equality", () => {
    expect(flexValueEqual("[1, 2, 3]", "[1,2,3]")).toBe(true);
    expect(flexValueEqual("[1, 2, 3]", "[1,2,4]")).toBe(false);
  });
  it("JSON object key-order independent", () => {
    expect(flexValueEqual('{"a":1,"b":2}', '{"b": 2, "a": 1}')).toBe(true);
  });
  it("strips surrounding quotes", () => {
    expect(flexValueEqual('"hello"', "hello")).toBe(true);
  });
  it("rejects fundamentally different strings", () => {
    expect(flexValueEqual("apple", "banana")).toBe(false);
  });
});
