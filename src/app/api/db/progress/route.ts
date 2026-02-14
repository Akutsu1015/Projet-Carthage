import { NextRequest, NextResponse } from "next/server";
import {
  getSessionUser, addExerciseProgress, getExerciseProgress,
  getModuleProgress, updateUserXp, getFullUserData, addWeeklyXp,
} from "@/lib/db";

/* ═══ POST — save exercise completion ═══ */

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("carthage_session")?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "Non authentifié." }, { status: 401 });
    }

    const dbUser = getSessionUser(token);
    if (!dbUser) {
      return NextResponse.json({ success: false, error: "Session invalide." }, { status: 401 });
    }

    const body = await req.json();
    const { moduleId, exerciseId, xp } = body;

    if (!moduleId || !exerciseId) {
      return NextResponse.json({ success: false, error: "moduleId et exerciseId requis." }, { status: 400 });
    }

    // Save progress
    const added = addExerciseProgress(dbUser.id, moduleId, exerciseId);

    // Add XP if new completion
    if (added && xp) {
      updateUserXp(dbUser.id, Number(xp));
      addWeeklyXp(dbUser.id, Number(xp));
    }

    const userData = getFullUserData(dbUser.id);
    return NextResponse.json({ success: true, user: userData });
  } catch (err) {
    console.error("Progress API error:", err);
    return NextResponse.json({ success: false, error: "Erreur serveur." }, { status: 500 });
  }
}

/* ═══ GET — get progress ═══ */

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("carthage_session")?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "Non authentifié." }, { status: 401 });
    }

    const dbUser = getSessionUser(token);
    if (!dbUser) {
      return NextResponse.json({ success: false, error: "Session invalide." }, { status: 401 });
    }

    const moduleId = req.nextUrl.searchParams.get("module");

    if (moduleId) {
      const exercises = getModuleProgress(dbUser.id, moduleId);
      return NextResponse.json({ success: true, moduleId, exercises });
    }

    const progress = getExerciseProgress(dbUser.id);
    return NextResponse.json({ success: true, progress });
  } catch (err) {
    console.error("Progress GET error:", err);
    return NextResponse.json({ success: false, error: "Erreur serveur." }, { status: 500 });
  }
}
