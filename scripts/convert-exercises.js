/**
 * Script to convert exercise JS files from the original project
 * to TypeScript modules for the Next.js project.
 * 
 * Usage: node scripts/convert-exercises.js
 */
const fs = require("fs");
const path = require("path");

const SOURCE_DIR = path.resolve("c:/xampp/htdocs/formation_code/js/modules");
const DEST_DIR = path.resolve(__dirname, "../src/lib/exercises");

// Map of source file patterns to module IDs
const FILE_MAP = [
  // Frontend (fe_*) → "frontend"
  { pattern: "exercises-frontend-part", moduleId: "frontend", parts: 5 },
  // JavaScript (js_*) → "javascript"
  { pattern: "exercises-js-part", moduleId: "javascript", parts: 4 },
  // Python (py_*) → "python"
  { pattern: "exercises-part", moduleId: "python", parts: 5 },
  // Dart (dart_*) → "dart"
  { pattern: "exercises-dart-part", moduleId: "dart", parts: 3 },
];

function extractExercises(fileContent) {
  // Find the exercises array in the file
  // Try multiple patterns: const exercises = [...], const exercisesPart1 = [...]
  const patterns = [
    /const exercises\s*=\s*\[/,
    /const exercisesPart\d+\s*=\s*\[/,
    /const exercicesPart\d+\s*=\s*\[/,
    /const exercisesPartOne\s*=\s*\[/,
  ];
  
  let startMatch = null;
  for (const pat of patterns) {
    startMatch = fileContent.match(pat);
    if (startMatch) break;
  }
  if (!startMatch) return null;

  const startIdx = startMatch.index + startMatch[0].length - 1; // position of '['
  
  // Find the matching closing bracket
  let depth = 0;
  let endIdx = startIdx;
  for (let i = startIdx; i < fileContent.length; i++) {
    if (fileContent[i] === "[") depth++;
    else if (fileContent[i] === "]") {
      depth--;
      if (depth === 0) {
        endIdx = i + 1;
        break;
      }
    }
  }

  return fileContent.substring(startIdx, endIdx);
}

function convertFile(srcFile, moduleId, partNum) {
  const srcPath = path.join(SOURCE_DIR, srcFile);
  if (!fs.existsSync(srcPath)) {
    console.log(`  ⚠ Skipping ${srcFile} (not found)`);
    return null;
  }

  const content = fs.readFileSync(srcPath, "utf8");
  const exercisesArray = extractExercises(content);
  
  if (!exercisesArray) {
    console.log(`  ⚠ Could not extract exercises from ${srcFile}`);
    return null;
  }

  // Count exercises
  const idMatches = exercisesArray.match(/id:\s*["']/g);
  const count = idMatches ? idMatches.length : 0;

  const tsContent = `import { addExercises } from ".";
import type { Exercise } from "@/app/exercises/[module]/exercise-client";

// @ts-nocheck — Auto-converted from ${srcFile}
const exercises: Exercise[] = ${exercisesArray};

addExercises("${moduleId}", exercises);
`;

  return { content: tsContent, count };
}

// Main
console.log("🔄 Converting exercise files...\n");

for (const { pattern, moduleId, parts } of FILE_MAP) {
  console.log(`📦 Module: ${moduleId}`);
  let totalCount = 0;

  for (let i = 1; i <= parts; i++) {
    const srcFile = `${pattern}${i}.js`;
    const destFile = `${moduleId}-part${i}.ts`;
    const destPath = path.join(DEST_DIR, destFile);

    const result = convertFile(srcFile, moduleId, i);
    if (result) {
      fs.writeFileSync(destPath, result.content, "utf8");
      totalCount += result.count;
      console.log(`  ✅ ${srcFile} → ${destFile} (${result.count} exercises)`);
    }
  }

  console.log(`  📊 Total: ${totalCount} exercises for ${moduleId}\n`);
}

console.log("✅ Conversion complete!");
console.log("\n📝 Don't forget to update exercise-client.tsx imports!");
