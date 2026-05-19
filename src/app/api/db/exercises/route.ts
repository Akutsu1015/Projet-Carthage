import { NextRequest, NextResponse } from "next/server";
import { getExercises } from "@/lib/exercises/registry";
import { MODULES } from "@/lib/constants";

// Import all exercise modules to populate the registry (server-side)
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

/**
 * GET /api/db/exercises?module=frontend&level=1
 * Returns a single exercise for mobile (SoloLearn-style).
 * level is 1-based.
 *
 * GET /api/db/exercises?module=frontend
 * Returns module metadata + count (for mobile sync).
 */
export async function GET(req: NextRequest) {
  try {
    const moduleId = req.nextUrl.searchParams.get("module");
    const levelParam = req.nextUrl.searchParams.get("level");

    if (!moduleId) {
      return NextResponse.json({ success: false, error: "module requis" }, { status: 400 });
    }

    const mod = MODULES.find((m) => m.id === moduleId);
    if (!mod || !mod.available) {
      return NextResponse.json({ success: false, error: "Module inconnu" }, { status: 404 });
    }

    const exercises = getExercises(moduleId);
    if (exercises.length === 0) {
      return NextResponse.json({ success: false, error: "Aucun exercice pour ce module" }, { status: 404 });
    }

    // Sans level : retourner métadonnées
    if (!levelParam) {
      return NextResponse.json({
        success: true,
        moduleId,
        moduleName: mod.name,
        totalExercises: exercises.length,
        levels: mod.levels,
      });
    }

    const level = parseInt(levelParam, 10);
    if (isNaN(level) || level < 1 || level > exercises.length) {
      return NextResponse.json({ success: false, error: "level invalide" }, { status: 400 });
    }

    const ex = exercises[level - 1];
    if (!ex) {
      return NextResponse.json({ success: false, error: "Exercice introuvable" }, { status: 404 });
    }

    // Format simplifié pour mobile (éviter données trop lourdes)
    const mobileExercise = {
      id: ex.id,
      type: ex.type || "code",
      title: ex.title,
      description: ex.description,
      instruction: ex.instruction,
      content: ex.content,
      category: ex.category,
      code_template: ex.code_template,
      options: ex.options,
      correct: ex.correct,
      explanation: ex.explanation,
      pieces: ex.pieces,
      hint: ex.hint,
      help_steps: ex.help_steps,
      preview: ex.preview,
      tests: ex.tests,
      language: getLanguageForModule(moduleId),
    };

    return NextResponse.json({
      success: true,
      exercise: mobileExercise,
      level,
      totalExercises: exercises.length,
      nextLevel: level < exercises.length ? level + 1 : null,
    });
  } catch (err) {
    console.error("Exercises API error:", err);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}

function getLanguageForModule(moduleId: string): string {
  const map: Record<string, string> = {
    frontend: "html",
    javascript: "javascript",
    python: "python",
    csharp: "csharp",
    dart: "dart",
    react: "javascript",
    nodejs: "javascript",
    cpp: "cpp",
  };
  return map[moduleId] || "javascript";
}
