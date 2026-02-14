import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MODULES } from "@/lib/constants";
import { ExerciseClient } from "./exercise-client";

interface Props {
  params: Promise<{ module: string }>;
}

export async function generateStaticParams() {
  return MODULES.filter((m) => m.available).map((m) => ({ module: m.id }));
}

const MODULE_SEO: Record<string, { title: string; desc: string; kw: string[] }> = {
  frontend: {
    title: "Cours HTML CSS Gratuit — 250 Exercices Interactifs",
    desc: "Apprenez HTML, CSS, Bootstrap, SCSS et le DOM JavaScript avec 250 exercices interactifs gratuits. Formation front-end complète du débutant au confirmé. Créez vos premières pages web.",
    kw: ["apprendre HTML", "apprendre CSS", "cours HTML CSS gratuit", "exercices HTML CSS", "formation front-end", "apprendre le front-end", "Bootstrap tutorial", "SCSS exercices", "formation HTML CSS gratuite", "créer un site web"],
  },
  javascript: {
    title: "Cours JavaScript Gratuit — 102 Exercices Interactifs",
    desc: "Maîtrisez JavaScript avec 102 exercices interactifs gratuits. Variables, fonctions, DOM, ES6+, async/await, closures, prototypes. Du débutant au développeur confirmé.",
    kw: ["apprendre JavaScript", "apprendre JavaScript gratuitement", "cours JavaScript gratuit", "exercices JavaScript", "formation JavaScript", "tutoriel JavaScript", "JavaScript débutant", "exercices JS en ligne", "apprendre JS"],
  },
  python: {
    title: "Cours Python Gratuit — 120 Exercices Interactifs",
    desc: "Apprenez Python avec 120 exercices interactifs gratuits. Bases, POO, data science, automatisation, algorithmes. Formation Python complète pour débutants et confirmés.",
    kw: ["apprendre Python", "apprendre Python gratuitement", "cours Python gratuit", "exercices Python", "formation Python", "tutoriel Python", "Python débutant", "exercices Python en ligne", "apprendre Python en ligne"],
  },
  csharp: {
    title: "Cours C# .NET Gratuit — 120 Exercices Interactifs",
    desc: "Maîtrisez C# et .NET avec 120 exercices interactifs gratuits. POO, LINQ, ASP.NET Core, Entity Framework, Blazor. Formation C# complète du débutant au développeur .NET.",
    kw: ["apprendre C#", "cours C# gratuit", "exercices C#", "formation C#", "apprendre .NET", "formation .NET gratuite", "ASP.NET Core", "C# débutant", "exercices C# en ligne"],
  },
  dart: {
    title: "Cours Dart & Flutter Gratuit — 150 Exercices Interactifs",
    desc: "Apprenez Dart et Flutter avec 150 exercices interactifs gratuits. Widgets, state management, architecture, tests. Créez des applications mobiles multiplateformes.",
    kw: ["apprendre Dart", "apprendre Flutter", "cours Flutter gratuit", "exercices Dart Flutter", "formation Flutter", "formation Dart", "développement mobile Flutter", "Flutter débutant", "créer une app mobile"],
  },
  react: {
    title: "Cours React Gratuit — 120 Exercices Interactifs",
    desc: "Maîtrisez React avec 120 exercices interactifs gratuits. JSX, composants, hooks, Router, Context, Next.js, patterns avancés. Formation React complète.",
    kw: ["apprendre React", "cours React gratuit", "exercices React", "formation React", "tutoriel React", "React hooks", "React débutant", "Next.js", "apprendre React en ligne"],
  },
  nodejs: {
    title: "Cours Node.js Gratuit — 120 Exercices Interactifs",
    desc: "Apprenez Node.js avec 120 exercices interactifs gratuits. Express, API REST, WebSocket, JWT, bases de données, microservices, GraphQL. Formation back-end complète.",
    kw: ["apprendre Node.js", "cours Node.js gratuit", "exercices Node.js", "formation Node.js", "Express.js", "API REST", "Node.js débutant", "formation back-end", "apprendre le back-end"],
  },
  cpp: {
    title: "Cours C/C++ Gratuit — 120 Exercices Interactifs",
    desc: "Maîtrisez C et C++ avec 120 exercices interactifs gratuits. Pointeurs, mémoire, STL, templates, threads, smart pointers. Formation programmation système complète.",
    kw: ["apprendre C++", "apprendre C", "cours C++ gratuit", "exercices C++", "formation C++", "pointeurs C", "C++ débutant", "programmation système", "exercices C en ligne"],
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { module: moduleId } = await params;
  const mod = MODULES.find((m) => m.id === moduleId);
  if (!mod) return {};
  const seo = MODULE_SEO[moduleId];
  return {
    title: seo?.title || `Exercices ${mod.name} — ${mod.levels} Exercices Gratuits`,
    description: seo?.desc || `${mod.description}. Apprenez ${mod.name} avec ${mod.levels} exercices interactifs gamifiés sur PROJET CARTHAGE.`,
    keywords: seo?.kw || [],
    openGraph: {
      title: `${seo?.title || `Exercices ${mod.name}`} | PROJET CARTHAGE`,
      description: seo?.desc || mod.description,
    },
  };
}

export default async function ExercisePage({ params }: Props) {
  const { module: moduleId } = await params;
  const mod = MODULES.find((m) => m.id === moduleId);
  if (!mod || !mod.available) notFound();

  return <ExerciseClient moduleId={mod.id} moduleName={mod.name} moduleColor={mod.color} moduleLevels={mod.levels} />;
}
