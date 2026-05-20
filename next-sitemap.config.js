/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://gamematcher.fr",
  generateRobotsTxt: false, // We have a custom one
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ["/api/*", "/dashboard", "/login", "/register", "/en/dashboard", "/en/login", "/en/register"],
  alternateRefs: [
    {
      href: 'https://gamematcher.fr/en',
      hreflang: 'en',
    },
    {
      href: 'https://gamematcher.fr',
      hreflang: 'fr',
    },
  ],
  additionalPaths: async () => [
    { loc: "/", changefreq: "daily", priority: 1.0 },
    { loc: "/en", changefreq: "daily", priority: 1.0 },
    { loc: "/exercises/frontend", changefreq: "weekly", priority: 0.9 },
    { loc: "/en/exercises/frontend", changefreq: "weekly", priority: 0.9 },
    { loc: "/exercises/javascript", changefreq: "weekly", priority: 0.9 },
    { loc: "/en/exercises/javascript", changefreq: "weekly", priority: 0.9 },
    { loc: "/exercises/python", changefreq: "weekly", priority: 0.9 },
    { loc: "/en/exercises/python", changefreq: "weekly", priority: 0.9 },
    { loc: "/exercises/csharp", changefreq: "weekly", priority: 0.9 },
    { loc: "/en/exercises/csharp", changefreq: "weekly", priority: 0.9 },
    { loc: "/exercises/dart", changefreq: "weekly", priority: 0.9 },
    { loc: "/en/exercises/dart", changefreq: "weekly", priority: 0.9 },
    { loc: "/badges", changefreq: "monthly", priority: 0.5 },
    { loc: "/en/badges", changefreq: "monthly", priority: 0.5 },
  ],
};
