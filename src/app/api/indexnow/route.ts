import { NextResponse } from "next/server";

const INDEXNOW_KEY = "bd8c93df7f31b67adf73b9b05a749c2a";
const HOST = "https://gamematcher.fr";

const MODULES = [
  "frontend", "javascript", "python", "csharp",
  "dart", "react", "nodejs", "cpp",
];

const ALL_URLS = [
  HOST,
  `${HOST}/exercises`,
  `${HOST}/battle`,
  `${HOST}/leaderboard`,
  `${HOST}/badges`,
  `${HOST}/playground`,
  `${HOST}/login`,
  `${HOST}/register`,
  ...MODULES.map((m) => `${HOST}/exercises/${m}`),
];

// POST /api/indexnow — manually trigger IndexNow submission
export async function POST() {
  const engines = [
    "https://api.indexnow.org/indexnow",
    "https://www.bing.com/indexnow",
    "https://yandex.com/indexnow",
  ];

  const results: Record<string, number> = {};

  for (const engine of engines) {
    try {
      const res = await fetch(engine, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          host: "gamematcher.fr",
          key: INDEXNOW_KEY,
          keyLocation: `${HOST}/${INDEXNOW_KEY}.txt`,
          urlList: ALL_URLS,
        }),
      });
      results[engine] = res.status;
    } catch {
      results[engine] = 0;
    }
  }

  return NextResponse.json({ success: true, results });
}

// GET /api/indexnow — status check
export async function GET() {
  return NextResponse.json({
    key: INDEXNOW_KEY,
    urls: ALL_URLS.length,
    keyFileUrl: `${HOST}/${INDEXNOW_KEY}.txt`,
  });
}
