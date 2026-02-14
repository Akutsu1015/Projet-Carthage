import { HeroSection } from "@/components/home/hero-section";
import { StorySection } from "@/components/home/story-section";
import { MissionsSection } from "@/components/home/missions-section";
import { ModulesSection } from "@/components/home/modules-section";
import { FeaturesSection } from "@/components/home/features-section";
import { CtaSection } from "@/components/home/cta-section";

function FAQJsonLd() {
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Est-ce que Projet Carthage est vraiment gratuit ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Oui, Projet Carthage est 100% gratuit, sans abonnement, sans pub et sans frais cachés. Tous les 1100+ exercices, le battle code en ligne et l'assistant IA sont accessibles gratuitement.",
        },
      },
      {
        "@type": "Question",
        name: "Quels langages de programmation peut-on apprendre ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Vous pouvez apprendre HTML, CSS, JavaScript, Python, React, Node.js, C#, C++, Dart et Flutter à travers 8 modules et plus de 1100 exercices interactifs.",
        },
      },
      {
        "@type": "Question",
        name: "Faut-il installer un logiciel pour coder ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Non, tout se fait directement dans votre navigateur. L'éditeur de code intégré et le playground permettent d'écrire et d'exécuter du code sans rien installer.",
        },
      },
      {
        "@type": "Question",
        name: "C'est quoi le Battle Code ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Le Battle Code est un mode compétitif où vous affrontez d'autres développeurs en temps réel sur des défis de programmation. Il existe un mode casual et un mode ranked avec classement ELO.",
        },
      },
      {
        "@type": "Question",
        name: "Est-ce adapté aux débutants ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolument ! Chaque module commence par les bases et progresse graduellement. Un assistant IA (Jérémie Belpois) est disponible pour vous aider si vous bloquez sur un exercice.",
        },
      },
      {
        "@type": "Question",
        name: "Comment fonctionne le système de progression ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Chaque exercice complété vous rapporte de l'XP. Vous débloquez des badges, montez de niveau et grimpez dans le classement global. Le système gamifié rend l'apprentissage motivant.",
        },
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
    />
  );
}

function CoursesJsonLd() {
  const courses = [
    { name: "Formation HTML & CSS Gratuite", desc: "250 exercices interactifs pour maîtriser le front-end", url: "https://gamematcher.fr/exercises/frontend" },
    { name: "Formation JavaScript Gratuite", desc: "102 exercices pour maîtriser JavaScript ES6+", url: "https://gamematcher.fr/exercises/javascript" },
    { name: "Formation Python Gratuite", desc: "120 exercices : bases, POO, data science", url: "https://gamematcher.fr/exercises/python" },
    { name: "Formation React Gratuite", desc: "120 exercices : hooks, Router, Context, Next.js", url: "https://gamematcher.fr/exercises/react" },
    { name: "Formation Node.js Gratuite", desc: "120 exercices : Express, API REST, WebSocket", url: "https://gamematcher.fr/exercises/nodejs" },
    { name: "Formation C# .NET Gratuite", desc: "120 exercices : POO, LINQ, ASP.NET Core", url: "https://gamematcher.fr/exercises/csharp" },
    { name: "Formation C/C++ Gratuite", desc: "120 exercices : pointeurs, mémoire, STL, threads", url: "https://gamematcher.fr/exercises/cpp" },
    { name: "Formation Dart & Flutter Gratuite", desc: "150 exercices : widgets, state, architecture", url: "https://gamematcher.fr/exercises/dart" },
  ];
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: courses.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Course",
        name: c.name,
        description: c.desc,
        url: c.url,
        provider: { "@type": "Organization", name: "Projet Carthage", url: "https://gamematcher.fr" },
        isAccessibleForFree: true,
        inLanguage: "fr",
        educationalLevel: "Beginner to Advanced",
        teaches: c.desc,
      },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StorySection />
      <MissionsSection />
      <ModulesSection />
      <FeaturesSection />
      <CtaSection />
      <FAQJsonLd />
      <CoursesJsonLd />
    </>
  );
}
