import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Suivez votre progression, vos XP, vos badges et vos streaks sur PROJET CARTHAGE.",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
