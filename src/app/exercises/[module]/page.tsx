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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { module: moduleId } = await params;
  const mod = MODULES.find((m) => m.id === moduleId);
  if (!mod) return {};
  return {
    title: `Exercices ${mod.name}`,
    description: `${mod.description}. Apprenez ${mod.name} avec ${mod.levels} exercices interactifs gamifiés sur PROJET CARTHAGE.`,
    openGraph: {
      title: `Exercices ${mod.name} – PROJET CARTHAGE`,
      description: mod.description,
    },
  };
}

export default async function ExercisePage({ params }: Props) {
  const { module: moduleId } = await params;
  const mod = MODULES.find((m) => m.id === moduleId);
  if (!mod || !mod.available) notFound();

  return <ExerciseClient moduleId={mod.id} moduleName={mod.name} moduleColor={mod.color} moduleLevels={mod.levels} />;
}
