import type { Metadata } from "next";
import { MODULES } from "@/lib/constants";
import { BookOpen } from "lucide-react";
import { AvailableModuleCards, UpcomingModuleCards } from "./module-cards";

export const metadata: Metadata = {
  title: "1100+ Exercices de Programmation Gratuits — HTML, JS, Python, React, C#, C++",
  description:
    "Pratiquez avec 1100+ exercices de code interactifs et gratuits. 8 modules : HTML/CSS, JavaScript, Python, React, Node.js, C#, C++, Dart & Flutter. Progressez du débutant au confirmé avec XP, badges et correction automatique.",
  keywords: [
    "exercices de programmation",
    "exercices de code gratuit",
    "exercices de code en ligne",
    "exercices JavaScript",
    "exercices Python",
    "exercices HTML CSS",
    "exercices React",
    "exercices Node.js",
    "exercices C#",
    "exercices C++",
    "exercices Dart Flutter",
    "pratiquer le code en ligne",
    "s'entraîner à coder",
  ],
  openGraph: {
    title: "1100+ Exercices de Programmation Gratuits — PROJET CARTHAGE",
    description: "Pratiquez avec 1100+ exercices de code interactifs et gratuits. 8 modules, du débutant au confirmé.",
  },
};

export default function ExercisesIndexPage() {
  const available = MODULES.filter((m) => m.available);
  const totalLevels = available.reduce((sum, m) => sum + m.levels, 0);

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="border-b border-lyoko-blue/10 bg-gradient-to-br from-dark-surface to-dark-bg py-12">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-lyoko-blue/20 to-lyoko-green/20">
            <BookOpen className="h-7 w-7 text-lyoko-blue" />
          </div>
          <h1 className="mb-2 font-display text-3xl font-extrabold tracking-wider">
            <span className="bg-gradient-to-r from-lyoko-blue to-lyoko-green bg-clip-text text-transparent">
              MODULES D&apos;EXERCICES
            </span>
          </h1>
          <p className="mx-auto max-w-xl text-sm text-white/50">
            {available.length} modules disponibles · {totalLevels} exercices interactifs · Quiz, puzzles et code
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <h2 className="mb-6 font-display text-lg font-bold text-white">
          Modules disponibles
        </h2>
        <AvailableModuleCards />
        <UpcomingModuleCards />
      </div>
    </div>
  );
}
