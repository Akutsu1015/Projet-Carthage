import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Battle Code en Ligne — Défiez d'autres développeurs en temps réel",
  description:
    "Affrontez d'autres développeurs en temps réel dans des défis de programmation. Mode casual et ranked avec classement ELO. Challenges JavaScript, Python, C#, C++ et plus. 100% gratuit.",
  keywords: [
    "battle code en ligne",
    "défi programmation en ligne",
    "compétition de code",
    "coding challenge",
    "défi code temps réel",
    "battle programmation",
    "challenge développeur",
    "coding game multijoueur",
  ],
  openGraph: {
    title: "Battle Code en Ligne — PROJET CARTHAGE",
    description: "Affrontez d'autres développeurs en temps réel dans des défis de programmation. 100% gratuit.",
  },
};

export default function BattleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
