import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createCertification, getCertificationAttempt } from "@/lib/db";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, { apiVersion: "2026-04-22.dahlia" }) : null;

/* ═══ POST — Stripe webhook ═══ */

export async function POST(req: NextRequest) {
  try {
    if (!stripe) return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });

    const body = await req.text();
    const sig = req.headers.get("stripe-signature");
    if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

    const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = Number(session.metadata?.userId);
      const moduleId = session.metadata?.moduleId;
      const attemptId = Number(session.metadata?.attemptId) || 0;

      if (!userId || !moduleId) {
        console.error("[Webhook] Missing metadata in session:", session.id);
        return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
      }

      // Get attempt score
      let score = 0;
      let maxScore = 15;
      if (attemptId) {
        const attempt = getCertificationAttempt(attemptId) as { score: number; max_score: number } | undefined;
        if (attempt) {
          score = attempt.score;
          maxScore = attempt.max_score;
        }
      }

      createCertification(userId, moduleId, score, maxScore, session.id);
      console.log(`[Webhook] Certification created for user ${userId}, module ${moduleId}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("[Webhook] Error:", err.message);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
