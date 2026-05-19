/**
 * Exercise validation script — tests every exercise's solution against its own tests.
 * Run: node scripts/validate-exercises.mjs
 */
import { validateCode } from "../src/lib/exercises/validate-code.ts";

// We need to import all exercise modules to populate the registry
// Since this is ESM + TS, we'll use a different approach: read the registry after importing

// Dynamic import approach
const exerciseFiles = [
  "../src/lib/exercises/frontend-part1.ts",
  "../src/lib/exercises/frontend-part2.ts",
  "../src/lib/exercises/frontend-part3.ts",
  "../src/lib/exercises/frontend-part4.ts",
  "../src/lib/exercises/frontend-part5.ts",
  "../src/lib/exercises/javascript-part1.ts",
  "../src/lib/exercises/javascript-part2.ts",
  "../src/lib/exercises/javascript-part3.ts",
  "../src/lib/exercises/javascript-part4.ts",
  "../src/lib/exercises/python-part1.ts",
  "../src/lib/exercises/python-part2.ts",
  "../src/lib/exercises/python-part3.ts",
  "../src/lib/exercises/python-part4.ts",
  "../src/lib/exercises/python-part5.ts",
  "../src/lib/exercises/dart-part1.ts",
  "../src/lib/exercises/dart-part2.ts",
  "../src/lib/exercises/dart-part3.ts",
  "../src/lib/exercises/dart-part4.ts",
  "../src/lib/exercises/dart-part5.ts",
  "../src/lib/exercises/react-part1.ts",
  "../src/lib/exercises/react-part2.ts",
  "../src/lib/exercises/react-part3.ts",
  "../src/lib/exercises/react-part4.ts",
  "../src/lib/exercises/react-part5.ts",
  "../src/lib/exercises/nodejs-part1.ts",
  "../src/lib/exercises/nodejs-part2.ts",
  "../src/lib/exercises/nodejs-part3.ts",
  "../src/lib/exercises/nodejs-part4.ts",
  "../src/lib/exercises/nodejs-part5.ts",
  "../src/lib/exercises/cpp-part1.ts",
  "../src/lib/exercises/cpp-part2.ts",
  "../src/lib/exercises/cpp-part3.ts",
  "../src/lib/exercises/cpp-part4.ts",
  "../src/lib/exercises/cpp-part5.ts",
  "../src/lib/exercises/cpp-part6.ts",
  "../src/lib/exercises/csharp-part1.ts",
  "../src/lib/exercises/csharp-part2.ts",
  "../src/lib/exercises/csharp-part3.ts",
  "../src/lib/exercises/csharp-part4.ts",
  "../src/lib/exercises/csharp-part5.ts",
  "../src/lib/exercises/csharp-part6.ts",
  "../src/lib/exercises/gamedev-part1.ts",
  "../src/lib/exercises/gamedev-part2.ts",
  "../src/lib/exercises/gamedev-part3.ts",
  "../src/lib/exercises/gamedev-part4.ts",
  "../src/lib/exercises/gamedev-part5.ts",
  "../src/lib/exercises/gamedev-part6.ts",
];

async function main() {
  // Import all exercise modules to populate the registry
  for (const f of exerciseFiles) {
    try { await import(f); } catch (e) { console.warn(`Failed to import ${f}: ${e.message}`); }
  }

  const { getExercises } = await import("../src/lib/exercises/registry.ts");

  const modules = ["frontend", "javascript", "python", "dart", "react", "nodejs", "cpp", "csharp", "gamedev"];
  let totalExercises = 0;
  let totalFailed = 0;
  const failures = [];

  for (const mod of modules) {
    const exercises = getExercises(mod);
    if (!exercises || exercises.length === 0) {
      console.log(`\n📦 ${mod}: NO EXERCISES FOUND`);
      continue;
    }

    let modFailed = 0;
    console.log(`\n📦 ${mod}: ${exercises.length} exercises`);

    for (let i = 0; i < exercises.length; i++) {
      const ex = exercises[i];
      totalExercises++;
      const solution = ex.solution || "";

      if (!solution.trim()) {
        console.log(`  ⚠ #${i + 1} "${ex.title}" — NO SOLUTION`);
        continue;
      }

      const result = validateCode(solution, ex.tests, mod);
      if (!result.pass) {
        modFailed++;
        totalFailed++;
        failures.push({ module: mod, level: i + 1, title: ex.title, reason: result.failReason, solution: solution.substring(0, 80) });
        console.log(`  ❌ #${i + 1} "${ex.title}" — ${result.failReason}`);
      }
    }

    if (modFailed === 0) {
      console.log(`  ✅ All ${exercises.length} exercises pass`);
    } else {
      console.log(`  ❌ ${modFailed}/${exercises.length} exercises FAIL`);
    }
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log(`TOTAL: ${totalExercises} exercises, ${totalFailed} failures`);
  if (failures.length > 0) {
    console.log(`\nFAILURES SUMMARY:`);
    for (const f of failures) {
      console.log(`  ${f.module} #${f.level} "${f.title}": ${f.reason}`);
    }
  }
}

main().catch(console.error);
