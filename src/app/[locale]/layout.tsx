import type { Metadata, Viewport } from "next";
import { Inter, Orbitron, Share_Tech_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AuthProvider } from "@/lib/auth-context";
import { VideoTransitionProvider } from "@/components/video-transition";
import { SoundProvider } from "@/lib/sound-manager";
import { ThemeProvider } from "next-themes";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { ServiceWorkerRegister } from "@/components/sw-register";
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";
import { PushToaster } from "@/components/push-toaster";
import { TranslationProvider } from "@/lib/translation-context";
import { SITE } from "@/lib/constants";
import "../globals.css";

import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";

/* ═══ FONTS ═══ */
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-share-tech-mono",
  display: "swap",
});

/* ═══ SEO METADATA ═══ */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  
  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: t("title"),
      template: `%s | ${SITE.name}`,
    },
    description: t("description"),
    keywords: SITE.keywords,
    authors: [{ name: SITE.creator }],
    creator: SITE.creator,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
    },
    openGraph: {
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      url: SITE.url,
      siteName: SITE.name,
      title: t("title"),
      description: t("description"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    verification: {
      google: "5T4rUXOgOwSWX4O8V59GpdlRZvaUZkehEgaNJqXIGG4",
    },
    alternates: {
      canonical: SITE.url,
      languages: {
        fr: `${SITE.url}`,
        en: `${SITE.url}/en`,
      },
    },
    manifest: "/manifest.json",
    icons: {
      icon: "/images/favicon.png",
      apple: "/images/favicon.png",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#00d4ff",
  width: "device-width",
  initialScale: 1,
};

/* ═══ JSON-LD ═══ */
async function JsonLd({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "metadata" });
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    description: t("description"),
    inLanguage: locale,
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: `${SITE.url}/images/carthage_logo.png` },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.url}/exercises/{search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

async function OrganizationJsonLd({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "metadata" });
  const data = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Projet Carthage",
    url: SITE.url,
    logo: `${SITE.url}/images/carthage_logo.png`,
    description: t("description"),
    sameAs: [
      "https://github.com/Akutsu1015/Projet-Carthage",
    ],
    areaServed: { "@type": "Country", name: "France" },
    knowsLanguage: ["fr", "en"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Formations gratuites en programmation",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Course", name: "Formation HTML & CSS" }, price: "0", priceCurrency: "EUR" },
        { "@type": "Offer", itemOffered: { "@type": "Course", name: "Formation JavaScript" }, price: "0", priceCurrency: "EUR" },
        { "@type": "Offer", itemOffered: { "@type": "Course", name: "Formation Python" }, price: "0", priceCurrency: "EUR" },
        { "@type": "Offer", itemOffered: { "@type": "Course", name: "Formation React" }, price: "0", priceCurrency: "EUR" },
        { "@type": "Offer", itemOffered: { "@type": "Course", name: "Formation Node.js" }, price: "0", priceCurrency: "EUR" },
        { "@type": "Offer", itemOffered: { "@type": "Course", name: "Formation C# .NET" }, price: "0", priceCurrency: "EUR" },
        { "@type": "Offer", itemOffered: { "@type": "Course", name: "Formation C/C++" }, price: "0", priceCurrency: "EUR" },
        { "@type": "Offer", itemOffered: { "@type": "Course", name: "Formation Dart & Flutter" }, price: "0", priceCurrency: "EUR" },
      ],
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* ═══ ROOT LAYOUT ═══ */
export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head />
      <body
        className={`${inter.variable} ${orbitron.variable} ${shareTechMono.variable} scanlines font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} themes={["dark", "light"]}>
          <NextIntlClientProvider messages={messages}>
            <TranslationProvider initialLang={locale as 'fr' | 'en'}>
              <AuthProvider>
                <AnalyticsTracker />
                <ServiceWorkerRegister />
                <KeyboardShortcuts />
                <PushToaster />
                <SoundProvider>
                  <VideoTransitionProvider>
                    <Navbar />
                    <main>{children}</main>
                    <Footer />
                  </VideoTransitionProvider>
                </SoundProvider>
              </AuthProvider>
            </TranslationProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
        <JsonLd locale={locale} />
        <OrganizationJsonLd locale={locale} />
      </body>
    </html>
  );
}
