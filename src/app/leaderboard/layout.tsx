import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Classement des Développeurs — Leaderboard",
  description:
    "Consultez le classement des meilleurs développeurs sur PROJET CARTHAGE. Comparez votre progression, vos XP et votre rang avec la communauté. Grimpez dans le classement en complétant des exercices et en gagnant des battles.",
  keywords: [
    "classement développeurs",
    "leaderboard programmation",
    "classement code",
    "meilleurs développeurs",
    "ranking programmation",
  ],
  openGraph: {
    title: "Classement des Développeurs — PROJET CARTHAGE",
    description: "Consultez le classement des meilleurs développeurs. Comparez votre progression avec la communauté.",
  },
};

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
