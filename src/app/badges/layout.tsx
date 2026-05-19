import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Badges & Succès",
  description: "Débloquez des badges en progressant dans les modules de PROJET CARTHAGE. Système de récompenses gamifié.",
};

export default function BadgesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
