import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Playground Code en Ligne — Éditeur de code gratuit",
  description:
    "Testez et exécutez du code directement dans votre navigateur. Playground multi-langage gratuit : JavaScript, Python, HTML, CSS et plus. Aucune installation requise.",
  keywords: [
    "playground code en ligne",
    "éditeur de code en ligne",
    "exécuter du code en ligne",
    "tester du code en ligne",
    "compilateur en ligne",
    "IDE en ligne gratuit",
    "éditeur JavaScript en ligne",
    "éditeur Python en ligne",
  ],
  openGraph: {
    title: "Playground Code en Ligne — PROJET CARTHAGE",
    description: "Testez et exécutez du code directement dans votre navigateur. Gratuit, sans installation.",
  },
};

export default function PlaygroundLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
