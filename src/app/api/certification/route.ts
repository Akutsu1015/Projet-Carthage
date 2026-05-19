import { NextRequest, NextResponse } from "next/server";
import {
  getSessionUser, createCertificationAttempt, getUserCertifications,
  getCertificationByCode, getCertificationAttempts,
} from "@/lib/db";
import { getTokenFromRequest } from "@/lib/api-auth";
import { getExam, gradeExam, getAllExams } from "@/lib/certification-exams";

/* ═══ GET ═══ */

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl;
    const action = url.searchParams.get("action") || "exams";

    // Public: verify a certificate
    if (action === "verify") {
      const code = url.searchParams.get("code") || "";
      if (!code) return NextResponse.json({ success: false, error: "Code requis." }, { status: 400 });
      const cert = getCertificationByCode(code) as { username: string; display_name: string; module_id: string; score: number; max_score: number; issued_at: string; paid: number } | undefined;
      if (!cert) return NextResponse.json({ success: false, error: "Certificat introuvable." }, { status: 404 });
      return NextResponse.json({
        success: true,
        certificate: {
          username: cert.username,
          displayName: cert.display_name,
          moduleId: cert.module_id,
          score: cert.score,
          maxScore: cert.max_score,
          issuedAt: cert.issued_at,
          paid: cert.paid,
        },
      });
    }

    // Auth required
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ success: false, error: "Non authentifié." }, { status: 401 });
    const dbUser = getSessionUser(token);
    if (!dbUser) return NextResponse.json({ success: false, error: "Session invalide." }, { status: 401 });

    if (action === "exams") {
      const exams = getAllExams().map(e => ({ moduleId: e.moduleId, moduleName: e.moduleName, price: e.price, questionCount: e.questions.length }));
      const certs = getUserCertifications(dbUser.id);
      return NextResponse.json({ success: true, exams, certifications: certs });
    }

    if (action === "exam") {
      const moduleId = url.searchParams.get("moduleId") || "";
      const exam = getExam(moduleId);
      if (!exam) return NextResponse.json({ success: false, error: "Module inconnu." }, { status: 400 });
      // Return questions without correct answers
      const questions = exam.questions.map(q => ({ id: q.id, question: q.question, options: q.options }));
      return NextResponse.json({ success: true, exam: { moduleId: exam.moduleId, moduleName: exam.moduleName, price: exam.price, questions } });
    }

    if (action === "attempts") {
      const moduleId = url.searchParams.get("moduleId") || "";
      const attempts = getCertificationAttempts(dbUser.id, moduleId);
      return NextResponse.json({ success: true, attempts });
    }

    return NextResponse.json({ success: false, error: "Action inconnue." }, { status: 400 });
  } catch (err) {
    console.error("[Cert API] GET error:", err);
    return NextResponse.json({ success: false, error: "Erreur serveur." }, { status: 500 });
  }
}

/* ═══ POST — submit exam answers ═══ */

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ success: false, error: "Non authentifié." }, { status: 401 });
    const dbUser = getSessionUser(token);
    if (!dbUser) return NextResponse.json({ success: false, error: "Session invalide." }, { status: 401 });

    const body = await req.json();
    const { action } = body;

    if (action === "submit") {
      const { moduleId, answers } = body;
      if (!moduleId || !answers) return NextResponse.json({ success: false, error: "moduleId et answers requis." }, { status: 400 });

      const result = gradeExam(moduleId, answers);
      const attempt = createCertificationAttempt(dbUser.id, moduleId, result.score, result.maxScore, answers, result.passed);

      return NextResponse.json({
        success: true,
        attemptId: attempt.id,
        score: result.score,
        maxScore: result.maxScore,
        passed: result.passed,
        results: result.results,
      });
    }

    return NextResponse.json({ success: false, error: "Action inconnue." }, { status: 400 });
  } catch (err) {
    console.error("[Cert API] POST error:", err);
    return NextResponse.json({ success: false, error: "Erreur serveur." }, { status: 500 });
  }
}
