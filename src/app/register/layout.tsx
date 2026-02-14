import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inscription",
  description: "Créez votre compte PROJET CARTHAGE et commencez à apprendre la programmation dans l'univers de Code Lyoko.",
  robots: { index: false, follow: false },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
