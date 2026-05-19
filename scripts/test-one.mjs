import { validateCode } from "../src/lib/exercises/validate-code.ts";

// Test a single exercise
const code = `print("A", "B", "C", "D", sep="-")`;
const tests = [{ type: "output", expected: "A-B-C-D" }];
const r = validateCode(code, tests, "python");
console.log("Result:", JSON.stringify(r));

// Test python #23 type()
const code2 = `texte = "Hello"
nombre = 42
print(type(texte))
print(type(nombre))`;
const tests2 = [{ type: "output", expected: "<class 'str'>" }];
const r2 = validateCode(code2, tests2, "python");
console.log("Result2:", JSON.stringify(r2));

// Test python #29 len()
const code3 = `message = "Bonjour le monde"
print(len(message))`;
const tests3 = [{ type: "output", expected: "18" }];
const r3 = validateCode(code3, tests3, "python");
console.log("Result3:", JSON.stringify(r3));
