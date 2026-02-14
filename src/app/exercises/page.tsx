import type { Metadata } from "next";
import { MODULES } from "@/lib/constants";
import { BookOpen } from "lucide-react";
import { AvailableModuleCards, UpcomingModuleCards } from "./module-cards";

export const metadata: Metadata = {
  title: "Modules d'exercices",
  description: "Tous les modules d'exercices de PROJET CARTHAGE : Front-End, JavaScript, Python, Dart & Flutter et plus. 792+ exercices interactifs gamifiés.",
  openGraph: {
    title: "Modules d'exercices – PROJET CARTHAGE",
    description: "792+ exercices interactifs pour apprendre à coder dans l'univers de Code Lyoko.",
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
