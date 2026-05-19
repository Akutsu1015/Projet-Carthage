/**
 * Bulk convert expected_output → contains for Python exercise files.
 */
import fs from "fs";
import path from "path";

const DIR = path.resolve("src/lib/exercises");
const FILES = ["python-part2.ts", "python-part3.ts", "python-part4.ts", "python-part5.ts"];

let totalConv = 0;

for (const f of FILES) {
  const fp = path.join(DIR, f);
  let content = fs.readFileSync(fp, "utf-8");
  let count = 0;
  
  // Replace { input: "", expected_output: "X" } → { type: "contains", expected: "X" }
  content = content.replace(
    /\{\s*input:\s*""\s*,\s*expected_output:\s*"([^"]*?)"\s*\}/g,
    (match, expected) => {
      count++;
      return `{ type: "contains", expected: "${expected}" }`;
    }
  );
  
  // Replace { input: "", expected_output: 'X' } → { type: "contains", expected: 'X' }
  content = content.replace(
    /\{\s*input:\s*""\s*,\s*expected_output:\s*'([^']*?)'\s*\}/g,
    (match, expected) => {
      count++;
      return `{ type: "contains", expected: '${expected}' }`;
    }
  );

  fs.writeFileSync(fp, content, "utf-8");
  console.log(`${f}: ${count} conversions`);
  totalConv += count;
}

console.log(`\nTotal: ${totalConv} conversions`);
