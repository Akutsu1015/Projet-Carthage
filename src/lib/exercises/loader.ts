/**
 * Lazy loader for exercise modules.
 *
 * Each module is a set of part files (e.g. python-part1, python-part2…) that
 * self-register into the registry on import. By loading only the requested
 * module on the client, we avoid shipping ~40 part files in the initial bundle.
 */

const PARTS: Record<string, () => Promise<unknown>[]> = {
  frontend: () => [
    import("./frontend-part1"),
    import("./frontend-part2"),
    import("./frontend-part3"),
    import("./frontend-part4"),
    import("./frontend-part5"),
  ],
  javascript: () => [
    import("./javascript-part1"),
    import("./javascript-part2"),
    import("./javascript-part3"),
    import("./javascript-part4"),
  ],
  python: () => [
    import("./python-part1"),
    import("./python-part2"),
    import("./python-part3"),
    import("./python-part4"),
    import("./python-part5"),
  ],
  dart: () => [
    import("./dart-part1"),
    import("./dart-part2"),
    import("./dart-part3"),
    import("./dart-part4"),
    import("./dart-part5"),
  ],
  react: () => [
    import("./react-part1"),
    import("./react-part2"),
    import("./react-part3"),
    import("./react-part4"),
    import("./react-part5"),
  ],
  nodejs: () => [
    import("./nodejs-part1"),
    import("./nodejs-part2"),
    import("./nodejs-part3"),
    import("./nodejs-part4"),
    import("./nodejs-part5"),
  ],
  cpp: () => [
    import("./cpp-part1"),
    import("./cpp-part2"),
    import("./cpp-part3"),
    import("./cpp-part4"),
    import("./cpp-part5"),
    import("./cpp-part6"),
  ],
  csharp: () => [
    import("./csharp-part1"),
    import("./csharp-part2"),
    import("./csharp-part3"),
    import("./csharp-part4"),
    import("./csharp-part5"),
    import("./csharp-part6"),
  ],
  c: () => [
    import("./c-part1"),
    import("./c-part2"),
    import("./c-part3"),
    import("./c-part4"),
  ],
};

const loaded = new Set<string>();

export async function loadModule(moduleId: string): Promise<void> {
  if (loaded.has(moduleId)) return;
  const factory = PARTS[moduleId];
  if (!factory) return;
  await Promise.all(factory());
  loaded.add(moduleId);
}
