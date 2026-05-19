"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useTranslation } from "@/lib/translation-context";
import { useRouter } from "next/navigation";
import {
  Shield, Award, CheckCircle2, XCircle, Clock, ArrowRight,
  Lock, BookOpen, Star, CreditCard, ChevronRight,
} from "lucide-react";
import Link from "next/link";

interface ExamInfo { moduleId: string; moduleName: string; price: number; questionCount: number; }
interface CertInfo { id: number; module_id: string; score: number; max_score: number; verification_code: string; paid: number; issued_at: string; }
interface Question { id: number; question: string; options: string[]; }

type Step = "list" | "exam" | "result" | "payment" | "success";

export default function CertificationPage() {
  const { user, isLoading } = useAuth();
  const { lang, t } = useTranslation();
  const router = useRouter();
  const params = useSearchParams();
  const [exams, setExams] = useState<ExamInfo[]>([]);
  const [certifications, setCertifications] = useState<CertInfo[]>([]);
  const [step, setStep] = useState<Step>("list");
  const [selectedExam, setSelectedExam] = useState<ExamInfo | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState<{ attemptId: number; score: number; maxScore: number; passed: boolean; results: Record<number, boolean> } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
  }, [isLoading, user, router]);

  useEffect(() => {
    if (user) fetchExams();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (params.get("success")) setStep("success");
  }, [params]);

  const fetchExams = async () => {
    try {
      const res = await fetch("/api/certification?action=exams", { credentials: "include" });
      const data = await res.json();
      if (data.success) { setExams(data.exams); setCertifications(data.certifications); }
    } catch {}
  };

  const startExam = async (exam: ExamInfo) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/certification?action=exam&moduleId=${exam.moduleId}`, { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setSelectedExam(exam);
        setQuestions(data.exam.questions);
        setAnswers({});
        setCurrentQ(0);
        setTimeLeft(exam.questionCount * 60); // 1 min per question
        setStep("exam");
      }
    } catch {}
    setLoading(false);
  };

  // Timer
  useEffect(() => {
    if (step !== "exam" || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timer); submitExam(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, timeLeft]);

  const submitExam = async () => {
    if (!selectedExam) return;
    setLoading(true);
    try {
      const res = await fetch("/api/certification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "submit", moduleId: selectedExam.moduleId, answers }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data);
        setStep("result");
      }
    } catch {}
    setLoading(false);
  };

  const startPayment = async () => {
    if (!selectedExam || !result) return;
    setLoading(true);
    try {
      const res = await fetch("/api/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "checkout", moduleId: selectedExam.moduleId, attemptId: result.attemptId }),
      });
      const data = await res.json();
      if (data.success && data.url) {
        window.location.href = data.url;
      }
    } catch {}
    setLoading(false);
  };

  if (isLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-950"><div className="animate-pulse text-cyan-400 font-[family-name:var(--font-orbitron)]">{t("common.loading")}</div></div>;
  }

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
  const moduleColors: Record<string, string> = {
    frontend: "from-orange-500/20 to-red-500/20 border-orange-500/30",
    javascript: "from-yellow-500/20 to-amber-500/20 border-yellow-500/30",
    python: "from-blue-500/20 to-indigo-500/20 border-blue-500/30",
    react: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30",
    nodejs: "from-green-500/20 to-emerald-500/20 border-green-500/30",
    csharp: "from-purple-500/20 to-violet-500/20 border-purple-500/30",
    cpp: "from-pink-500/20 to-rose-500/20 border-pink-500/30",
    dart: "from-sky-500/20 to-blue-500/20 border-sky-500/30",
  };
  const moduleIcons: Record<string, string> = {
    frontend: "🌐", javascript: "⚡", python: "🐍", react: "⚛️",
    nodejs: "🟢", csharp: "💜", cpp: "⚙️", dart: "🎯",
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <Shield className="w-14 h-14 text-cyan-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold font-[family-name:var(--font-orbitron)] text-cyan-400">{t("certification.title")}</h1>
          <p className="text-gray-400 mt-2">{t("certification.description")}</p>
        </div>

        {/* ═══ SUCCESS ═══ */}
        {step === "success" && (
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-8 text-center mb-8">
            <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-400 mb-2">{t("certification.exam_passed")}</h2>
            <p className="text-gray-300 mb-4">{t("certification.success_desc")}</p>
            <div className="flex justify-center gap-3">
              <Link href="/dashboard" className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-sm font-medium transition-colors">{t("dashboard.title")}</Link>
              <button onClick={() => { setStep("list"); fetchExams(); }} className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors">{t("certification.my_certifications")}</button>
            </div>
          </div>
        )}

        {/* ═══ EXAM ═══ */}
        {step === "exam" && selectedExam && questions.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">{selectedExam.moduleName}</h2>
                <p className="text-sm text-gray-400">Question {currentQ + 1} / {questions.length}</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-yellow-400" />
                <span className={`font-mono ${timeLeft < 60 ? "text-red-400" : "text-white"}`}>{formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-800 rounded-full h-2 mb-8">
              <div className="bg-cyan-500 rounded-full h-2 transition-all" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
            </div>

            {/* Question */}
            <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-medium text-white mb-6">{questions[currentQ].question}</h3>
              <div className="space-y-3">
                {questions[currentQ].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setAnswers({ ...answers, [questions[currentQ].id]: i })}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                      answers[questions[currentQ].id] === i
                        ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                        : "border-gray-700 bg-gray-800/40 text-gray-300 hover:border-gray-600"
                    }`}
                  >
                    <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span> {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
                disabled={currentQ === 0}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-30 rounded-lg text-sm transition-colors"
              >
                {t("certification.prev_btn")}
              </button>
              {currentQ < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQ(currentQ + 1)}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-sm font-medium transition-colors"
                >
                  {t("certification.next_btn")}
                </button>
              ) : (
                <button
                  onClick={submitExam}
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-30 rounded-lg text-sm font-medium transition-colors"
                >
                  {t("certification.finish_btn")}
                </button>
              )}
            </div>
          </div>
        )}

        {/* ═══ RESULT ═══ */}
        {step === "result" && result && selectedExam && (
          <div className="text-center">
            <div className={`inline-flex p-6 rounded-full mb-6 ${result.passed ? "bg-green-500/20" : "bg-red-500/20"}`}>
              {result.passed ? <CheckCircle2 className="w-16 h-16 text-green-400" /> : <XCircle className="w-16 h-16 text-red-400" />}
            </div>
            <h2 className="text-2xl font-bold mb-2">{result.passed ? t("certification.passed_msg") : t("certification.failed_msg")}</h2>
            <p className="text-gray-400 mb-6">
              {t("certification.score")} : <span className="text-white font-bold">{result.score}/{result.maxScore}</span> ({Math.round(result.score / result.maxScore * 100)}%)
              — {t("certification.passing_threshold")}
            </p>

            {/* Results per question */}
            <div className="bg-gray-800/40 border border-gray-700/30 rounded-xl p-6 mb-6 text-left">
              <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">{t("certification.results_detail")}</h3>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, i) => (
                  <div key={q.id} className={`p-2 rounded text-center text-sm ${result.results[q.id] ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                    #{i + 1} {result.results[q.id] ? "✓" : "✗"}
                  </div>
                ))}
              </div>
            </div>

            {result.passed && (
              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2">
                  <Award className="w-5 h-5 text-cyan-400" />
                  {lang === "fr" ? "Obtenez votre certificat officiel" : "Get your official certificate"}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {t("certification.info_desc")}
                </p>
                <button
                  onClick={startPayment}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:opacity-30 rounded-lg font-medium transition-all shadow-[0_4px_20px_rgba(0,212,255,0.3)]"
                >
                  <CreditCard className="w-4 h-4 inline mr-2" />
                  {t("certification.get_certificate")} — {selectedExam.price}€
                </button>
              </div>
            )}

            <button onClick={() => { setStep("list"); fetchExams(); }} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors">
              {t("certification.back_to")} {t("certification.title").toLowerCase()}
            </button>
          </div>
        )}

        {/* ═══ LIST ═══ */}
        {step === "list" && (
          <div>
            {/* My certifications */}
            {certifications.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-cyan-400" />{t("certification.my_certifications")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {certifications.map((c) => (
                    <div key={c.id} className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white">{moduleIcons[c.module_id] || "📘"} {c.module_id}</span>
                        <span className="text-xs text-green-400 bg-green-500/20 px-2 py-0.5 rounded">{t("certification.certified_badge")}</span>
                      </div>
                      <p className="text-sm text-gray-400">{t("certification.score")} : {c.score}/{c.max_score} ({Math.round(c.score / c.max_score * 100)}%)</p>
                      <p className="text-xs text-gray-500 mt-1">Code : <span className="font-mono text-cyan-400">{c.verification_code}</span></p>
                      <p className="text-xs text-gray-500">{new Date(c.issued_at).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available exams */}
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-cyan-400" />{lang === "fr" ? `${t("certification.title")} disponibles` : `Available ${t("certification.title").toLowerCase()}s`}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exams.map((exam) => {
                const alreadyCertified = certifications.some(c => c.module_id === exam.moduleId);
                return (
                  <div key={exam.moduleId} className={`bg-gradient-to-br ${moduleColors[exam.moduleId] || "from-gray-500/20 to-gray-500/20 border-gray-500/30"} rounded-xl p-5`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{moduleIcons[exam.moduleId] || "📘"}</span>
                      <div>
                        <h3 className="font-semibold text-white">{exam.moduleName}</h3>
                        <p className="text-xs text-gray-400">{exam.questionCount} questions — {t("certification.passing_threshold")}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-bold text-white">{exam.price}€</span>
                        <span className="text-xs text-gray-500">{lang === "fr" ? "/ certificat" : "/ certificate"}</span>
                      </div>
                      {alreadyCertified ? (
                        <span className="text-xs text-green-400 bg-green-500/20 px-3 py-1.5 rounded-lg">{t("certification.already_certified")}</span>
                      ) : (
                        <button
                          onClick={() => startExam(exam)}
                          disabled={loading}
                          className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-30 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                        >
                          {t("certification.start_exam")} <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Info box */}
            <div className="mt-8 bg-gray-800/40 border border-gray-700/30 rounded-xl p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2"><Lock className="w-4 h-4 text-cyan-400" />{t("certification.how_it_works_title")}</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p>{t("certification.step_1")}</p>
                <p>{t("certification.step_2")}</p>
                <p>{t("certification.step_3")}</p>
                <p>{t("certification.step_4")}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
