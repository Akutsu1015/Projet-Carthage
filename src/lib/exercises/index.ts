/**
 * Exercise data registry.
 * 
 * Exercise data files register themselves here via addExercises().
 * The exercise engine reads from getExercises().
 */

import type { Exercise } from "@/app/exercises/[module]/exercise-client";

const registry: Record<string, Exercise[]> = {};

export function addExercises(moduleId: string, exercises: Exercise[]) {
  if (!registry[moduleId]) registry[moduleId] = [];
  registry[moduleId].push(...exercises);
}

export function getExercises(moduleId: string): Exercise[] {
  return registry[moduleId] || [];
}

export function getAllModuleIds(): string[] {
  return Object.keys(registry);
}
