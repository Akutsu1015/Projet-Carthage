import { redirect } from "next/navigation";
import { getTodaysChallenge } from "@/lib/db";

/**
 * Server-side redirect to today's daily challenge. Used as the PWA shortcut
 * target and as a stable URL for "défi du jour" links.
 */
export default function DailyPage() {
  const challenge = getTodaysChallenge();
  if (!challenge) redirect("/exercises");
  redirect(`/exercises/${challenge.module_id}?daily=${challenge.day}`);
}
