import { NextRequest, NextResponse } from "next/server";
import { getExercises } from "@/lib/exercises/registry";
import { MODULES } from "@/lib/constants";

// Eagerly import all module parts so `getExercises()` returns everything.
// Search is a one-shot lookup, so the lazy loader isn't appropriate here.
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
import "@/lib/exercises/cpp-part6";
import "@/lib/exercises/csharp-part1";
import "@/lib/exercises/csharp-part2";
import "@/lib/exercises/csharp-part3";
import "@/lib/exercises/csharp-part4";
import "@/lib/exercises/csharp-part5";
import "@/lib/exercises/csharp-part6";
import "@/lib/exercises/c-part1";
import "@/lib/exercises/c-part2";
import "@/lib/exercises/c-part3";
import "@/lib/exercises/c-part4";

interface SearchHit {
  moduleId: string;
  moduleName: string;
  moduleColor: string;
  exerciseId: string;
  title: string;
  category?: string;
  type?: string;
  snippet?: string;
}

function normalize(s: string): string {
  return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export async function GET(req: NextRequest) {
  const q = (new URL(req.url).searchParams.get("q") || "").trim();
  if (q.length < 2) return NextResponse.json({ success: true, hits: [], total: 0 });
  if (q.length > 100) return NextResponse.json({ success: false, error: "Query too long" }, { status: 400 });

  const needle = normalize(q);
  const hits: SearchHit[] = [];

  for (const mod of MODULES) {
    const exercises = getExercises(mod.id);
    for (const ex of exercises) {
      const hay = normalize(`${ex.title} ${ex.description || ""} ${ex.category || ""}`);
      if (!hay.includes(needle)) continue;
      hits.push({
        moduleId: mod.id,
        moduleName: mod.name,
        moduleColor: mod.color,
        exerciseId: ex.id,
        title: ex.title,
        category: ex.category,
        type: ex.type,
      });
      if (hits.length >= 50) break;
    }
    if (hits.length >= 50) break;
  }

  return NextResponse.json({ success: true, hits, total: hits.length });
}
