/**
 * Flexible comparison utility for exercise and battle validation.
 * Normalizes whitespace, punctuation spacing, quotes, and casing
 * so that equivalent results are accepted regardless of minor formatting differences.
 */

/**
 * Normalize a string for flexible comparison:
 * - Trim
 * - Collapse all whitespace to single space
 * - Remove spaces before punctuation: "Hello !" → "Hello!"
 * - Remove spaces after opening and before closing brackets/parens
 * - Normalize quotes: ' → ' and " → "
 * - Lowercase
 */
export function flexNormalize(s: string): string {
  return s
    .trim()
    .replace(/\s+/g, " ")                    // collapse whitespace
    .replace(/\s+([!?.,;:)\]}>])/g, "$1")    // remove space BEFORE punctuation
    .replace(/([(\[{<])\s+/g, "$1")          // remove space AFTER opening brackets
    .replace(/\s+([)\]}>])/g, "$1")          // remove space BEFORE closing brackets
    .replace(/[''`]/g, "'")                   // normalize single quotes
    .replace(/[""]/g, '"')                    // normalize double quotes
    .toLowerCase();
}

/**
 * Flexible string comparison.
 * Returns true if both strings are equivalent after normalization.
 */
export function flexEqual(a: string, b: string): boolean {
  return flexNormalize(a) === flexNormalize(b);
}

/**
 * Flexible "contains" check.
 * Returns true if normalized `haystack` contains normalized `needle`.
 */
export function flexContains(haystack: string, needle: string): boolean {
  return flexNormalize(haystack).includes(flexNormalize(needle));
}

/**
 * Flexible comparison for code output values (battle tests, console.log output, etc.)
 * Handles: strings, numbers, booleans, arrays, objects.
 * - For strings: flexEqual
 * - For numbers: numeric equality (parseFloat)
 * - For booleans: string "true"/"false" match
 * - For arrays/objects: JSON-normalized comparison
 */
export function flexValueEqual(got: string, expected: string): boolean {
  const g = got.trim();
  const e = expected.trim();

  // Exact match (fast path)
  if (g === e) return true;

  // Normalized string match
  if (flexNormalize(g) === flexNormalize(e)) return true;

  // Numeric comparison: "5" === "5.0" === " 5 "
  const gNum = parseFloat(g);
  const eNum = parseFloat(e);
  if (!isNaN(gNum) && !isNaN(eNum) && gNum === eNum) return true;

  // Boolean comparison: "true" / "false"
  if ((g === "true" || g === "false") && (e === "true" || e === "false")) {
    return g === e;
  }

  // JSON comparison for arrays/objects: normalize and compare
  try {
    const gParsed = JSON.parse(g);
    const eParsed = JSON.parse(e);
    if (deepFlexEqual(gParsed, eParsed)) return true;
  } catch { /* not JSON, skip */ }

  // Strip surrounding quotes and compare
  const stripQuotes = (s: string) => s.replace(/^["']|["']$/g, "");
  if (flexNormalize(stripQuotes(g)) === flexNormalize(stripQuotes(e))) return true;

  return false;
}

/**
 * Deep flexible equality for parsed JSON values.
 * Arrays: same length, each element flexEqual.
 * Objects: same keys, each value flexEqual.
 * Primitives: loose comparison.
 */
function deepFlexEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;

  // Both null/undefined
  if (a == null && b == null) return true;
  if (a == null || b == null) return false;

  // Numbers
  if (typeof a === "number" && typeof b === "number") return a === b;

  // Booleans
  if (typeof a === "boolean" && typeof b === "boolean") return a === b;

  // Strings
  if (typeof a === "string" && typeof b === "string") return flexNormalize(a) === flexNormalize(b);

  // Arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => deepFlexEqual(v, b[i]));
  }

  // Objects
  if (typeof a === "object" && typeof b === "object") {
    const aKeys = Object.keys(a as Record<string, unknown>).sort();
    const bKeys = Object.keys(b as Record<string, unknown>).sort();
    if (aKeys.length !== bKeys.length) return false;
    if (!aKeys.every((k, i) => k === bKeys[i])) return false;
    return aKeys.every(k => deepFlexEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]));
  }

  // Fallback: string comparison
  return flexNormalize(String(a)) === flexNormalize(String(b));
}
