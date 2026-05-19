import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  getSessionUser, createCertification, markCertificationPaid,
} from "@/lib/db";
import { getTokenFromRequest } from "@/lib/api-auth";
import { getExam } from "@/lib/certification-exams";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, { apiVersion: "2026-04-22.dahlia" }) : null;

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://gamematcher.fr";

/* ═══ POST — create checkout session ═══ */

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ success: false, error: "Non authentifié." }, { status: 401 });
    const dbUser = getSessionUser(token);
    if (!dbUser) return NextResponse.json({ success: false, error: "Session invalide." }, { status: 401 });

    const body = await req.json();
    const { action } = body;

    if (action === "checkout") {
      if (!stripe) return NextResponse.json({ success: false, error: "Stripe non configuré." }, { status: 500 });
      const { moduleId, attemptId } = body;
      const exam = getExam(moduleId);
      if (!exam) return NextResponse.json({ success: false, error: "Module inconnu." }, { status: 400 });

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [{
          price: exam.stripePriceId,
          quantity: 1,
        }],
        metadata: {
          userId: String(dbUser.id),
          moduleId,
          attemptId: String(attemptId || ""),
        },
        success_url: `${APP_URL}/certification?success=true&module=${moduleId}`,
        cancel_url: `${APP_URL}/certification?canceled=true`,
      });

      return NextResponse.json({ success: true, url: session.url });
    }

    return NextResponse.json({ success: false, error: "Action inconnue." }, { status: 400 });
  } catch (err) {
    console.error("[Stripe API] error:", err);
    return NextResponse.json({ success: false, error: "Erreur serveur." }, { status: 500 });
  }
}
