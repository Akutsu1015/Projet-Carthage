import type { Metadata } from "next";

import { getTranslations } from "next-intl/server";
import { SITE } from "@/lib/constants";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata_pages" });
  return {
    title: t("battle_title"),
    description: t("battle_description"),
    keywords: [
      "battle code en ligne",
      "défi programmation en ligne",
      "compétition de code",
      "coding challenge",
      "défi code temps réel",
      "battle programmation",
      "challenge développeur",
      "coding game multijoueur",
    ],
    openGraph: {
      title: t("battle_og_title"),
      description: t("battle_description"),
    },
  };
}

export default function BattleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
