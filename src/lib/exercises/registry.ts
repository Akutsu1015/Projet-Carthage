/**
 * Exercise data registry — singleton store.
 *
 * This file is intentionally separated from index.ts to avoid
 * Turbopack treating it as an async loader module (which happens
 * when index.ts is dynamically imported via await import()).
 *
 * Both addExercises() (called by part files) and getExercises()
 * (called by the component) MUST import from this same file
 * to share the same registry singleton.
 */

export interface Exercise {
    id: string;
    type?: "intro" | "quiz" | "puzzle" | "code";
    category?: string;
    title: string;
    description?: string;
    content?: string;
    code_example?: string;
    language?: string;
    options?: string[];
    correct?: number;
    explanation?: string;
    instruction?: string;
    pieces?: string[];
    hint?: string;
    code_template?: string;
    solution?: string;
    tests?: { type?: string; expected?: string; message?: string; input?: string; expected_output?: string;[k: string]: unknown }[];
    help_steps?: string[];
    preview?: string;
    [key: string]: unknown;
}

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
