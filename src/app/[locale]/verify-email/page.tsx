"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useTranslation } from "@/lib/translation-context";
import {
  CheckCircle, XCircle, Loader2, ArrowRight, Mail, RefreshCw,
} from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-dark-bg"><Loader2 className="h-8 w-8 animate-spin text-lyoko-blue" /></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const { t } = useTranslation();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMsg(t("verify.no_token"));
      return;
    }

    async function verify() {
      try {
        const res = await fetch(`/api/db/auth/verify-email?token=${token}`);
        const data = await res.json();

        if (data.success) {
          setStatus("success");
          // Refresh the auth context to reflect verified status
          await refreshUser();
        } else {
          setStatus("error");
          setErrorMsg(data.error || t("verify.invalid_token"));
        }
      } catch {
        setStatus("error");
        setErrorMsg(t("verify.email_error_network"));
      }
    }

    verify();
  }, [token, refreshUser, t]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-dark-bg px-4">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-2.5">
          <Image src="/images/carthage_logo.png" alt="" width={40} height={40} className="drop-shadow-[0_0_12px_rgba(0,212,255,0.4)]" />
          <span className="font-display text-sm font-bold tracking-[2px] text-lyoko-blue">PROJET CARTHAGE</span>
        </div>

        {/* Loading */}
        {status === "loading" && (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-10">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-lyoko-blue/10 border border-lyoko-blue/20">
              <Loader2 size={28} className="animate-spin text-lyoko-blue" />
            </div>
            <h1 className="mb-2 font-display text-xl font-bold text-white">{t("verify.email_verifying")}</h1>
            <p className="text-sm text-white/40">{t("verify.email_validating")}</p>
          </div>
        )}

        {/* Success */}
        {status === "success" && (
          <div className="rounded-2xl border border-lyoko-green/20 bg-lyoko-green/[0.03] p-10">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-lyoko-green/10 border border-lyoko-green/20">
              <CheckCircle size={28} className="text-lyoko-green" />
            </div>
            <h1 className="mb-2 font-display text-xl font-bold text-white">{t("verify.email_verified")}</h1>
            <p className="mb-6 text-sm text-white/40">
              {t("verify.email_success_desc")}
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center gap-2 rounded-xl bg-lyoko-green px-8 py-3 font-display text-sm font-bold text-dark-bg shadow-[0_4px_20px_rgba(0,255,136,0.2)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,255,136,0.3)]"
            >
              {t("verify.btn_dashboard")} <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div className="rounded-2xl border border-xana-red/20 bg-xana-red/[0.03] p-10">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-xana-red/10 border border-xana-red/20">
              <XCircle size={28} className="text-xana-red" />
            </div>
            <h1 className="mb-2 font-display text-xl font-bold text-white">{t("verify.email_failed")}</h1>
            <p className="mb-6 text-sm text-white/40">{errorMsg}</p>
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-lyoko-blue px-8 py-3 font-display text-sm font-bold text-white shadow-[0_4px_20px_rgba(0,212,255,0.2)] transition-all hover:-translate-y-0.5"
              >
                {t("verify.btn_login")} <ArrowRight size={16} />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] px-8 py-3 text-sm font-medium text-white/50 transition-all hover:border-white/15 hover:text-white/70"
              >
                {t("verify.btn_register")}
              </Link>
            </div>
          </div>
        )}

        {/* Back */}
        <div className="mt-6">
          <Link href="/" className="text-xs text-white/25 transition-colors hover:text-white/50">
            {t("verify.back_home")}
          </Link>
        </div>
      </div>
    </div>
  );
}
