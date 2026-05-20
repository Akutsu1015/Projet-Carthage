import path from "node:path";
import fs from "node:fs";
import { getDb } from "@/lib/db";

const BACKUP_DIR = process.env.BACKUP_DIR || path.join(process.cwd(), "data", "backups");
const RETENTION_DAYS = parseInt(process.env.BACKUP_RETENTION_DAYS || "14", 10);

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

/**
 * Take an online SQLite backup using better-sqlite3's `backup()` API. This
 * is safer than copying the file (handles WAL + concurrent writers).
 * Output is a single file: `carthage-YYYY-MM-DDTHH.db`.
 */
export async function takeBackup(): Promise<{ path: string; bytes: number }> {
  ensureDir(BACKUP_DIR);
  const stamp = new Date().toISOString().replace(/:\d+\.\d+Z$/, "").replace(/[:T]/g, "-").slice(0, 16);
  const out = path.join(BACKUP_DIR, `carthage-${stamp}.db`);
  await getDb().backup(out);
  const { size } = fs.statSync(out);
  return { path: out, bytes: size };
}

/** Delete backup files older than RETENTION_DAYS. */
export function purgeOldBackups(): number {
  if (!fs.existsSync(BACKUP_DIR)) return 0;
  const cutoff = Date.now() - RETENTION_DAYS * 86_400_000;
  let removed = 0;
  for (const name of fs.readdirSync(BACKUP_DIR)) {
    if (!name.startsWith("carthage-") || !name.endsWith(".db")) continue;
    const p = path.join(BACKUP_DIR, name);
    try {
      const stat = fs.statSync(p);
      if (stat.mtimeMs < cutoff) { fs.unlinkSync(p); removed++; }
    } catch { /* ignore */ }
  }
  return removed;
}

/** Listing for admin UI. */
export function listBackups(): { name: string; bytes: number; mtime: string }[] {
  if (!fs.existsSync(BACKUP_DIR)) return [];
  return fs.readdirSync(BACKUP_DIR)
    .filter((n) => n.startsWith("carthage-") && n.endsWith(".db"))
    .map((name) => {
      const p = path.join(BACKUP_DIR, name);
      const st = fs.statSync(p);
      return { name, bytes: st.size, mtime: new Date(st.mtimeMs).toISOString() };
    })
    .sort((a, b) => b.mtime.localeCompare(a.mtime));
}
