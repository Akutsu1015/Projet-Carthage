import Database from "better-sqlite3";
import path from "path";
import crypto from "crypto";
import { ALL_CHALLENGES } from "./battle-challenges";

/* ═══ DATABASE SINGLETON ═══ */

const DB_PATH = path.join(process.cwd(), "data", "carthage.db");

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) {
    // Ensure data directory exists
    const fs = require("fs");
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    _db = new Database(DB_PATH);
    _db.pragma("journal_mode = WAL");
    _db.pragma("foreign_keys = ON");
    initTables(_db);
  }
  return _db;
}

/* ═══ SCHEMA — ALL TABLES ═══ */

function initTables(db: Database.Database) {
  db.exec(`
    -- ═══ USERS ═══
    CREATE TABLE IF NOT EXISTS users (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      username      TEXT    NOT NULL UNIQUE COLLATE NOCASE,
      email         TEXT    NOT NULL UNIQUE COLLATE NOCASE,
      display_name  TEXT    NOT NULL,
      password_hash TEXT,
      avatar_type   TEXT    DEFAULT 'initials',
      avatar_value  TEXT    DEFAULT '',
      avatar_color  TEXT    DEFAULT '#00d4ff',
      xp            INTEGER DEFAULT 0,
      level         INTEGER DEFAULT 1,
      streak        INTEGER DEFAULT 0,
      best_streak   INTEGER DEFAULT 0,
      auth_provider TEXT    DEFAULT 'local',
      created_at    TEXT    DEFAULT (datetime('now')),
      last_login    TEXT    DEFAULT (datetime('now'))
    );

    -- ═══ SESSIONS ═══
    CREATE TABLE IF NOT EXISTS sessions (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token      TEXT    NOT NULL UNIQUE,
      created_at TEXT    DEFAULT (datetime('now')),
      expires_at TEXT    NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
    CREATE INDEX IF NOT EXISTS idx_sessions_user  ON sessions(user_id);

    -- ═══ EXERCISE PROGRESS ═══
    CREATE TABLE IF NOT EXISTS exercise_progress (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      module_id    TEXT    NOT NULL,
      exercise_id  TEXT    NOT NULL,
      completed_at TEXT    DEFAULT (datetime('now')),
      UNIQUE(user_id, module_id, exercise_id)
    );
    CREATE INDEX IF NOT EXISTS idx_progress_user   ON exercise_progress(user_id);
    CREATE INDEX IF NOT EXISTS idx_progress_module ON exercise_progress(user_id, module_id);

    -- ═══ USER BADGES ═══
    CREATE TABLE IF NOT EXISTS user_badges (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      badge_id  TEXT    NOT NULL,
      earned_at TEXT    DEFAULT (datetime('now')),
      UNIQUE(user_id, badge_id)
    );
    CREATE INDEX IF NOT EXISTS idx_badges_user ON user_badges(user_id);

    -- ═══ USER SETTINGS ═══
    CREATE TABLE IF NOT EXISTS user_settings (
      user_id       INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      sound_enabled INTEGER DEFAULT 1,
      sound_volume  REAL    DEFAULT 0.5,
      theme         TEXT    DEFAULT 'dark'
    );

    -- ═══ EMAIL VERIFICATION ═══
    CREATE TABLE IF NOT EXISTS email_verifications (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token      TEXT    NOT NULL UNIQUE,
      created_at TEXT    DEFAULT (datetime('now')),
      expires_at TEXT    NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_email_verify_token ON email_verifications(token);

    -- ═══ LEAGUE SYSTEM (Sololearn-style) ═══
    CREATE TABLE IF NOT EXISTS league_weeks (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      week_start  TEXT    NOT NULL UNIQUE,
      week_end    TEXT    NOT NULL,
      finalized   INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS league_members (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      week_id     INTEGER NOT NULL REFERENCES league_weeks(id) ON DELETE CASCADE,
      user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      league      TEXT    NOT NULL DEFAULT 'bronze',
      weekly_xp   INTEGER DEFAULT 0,
      rank        INTEGER DEFAULT 0,
      promoted    INTEGER DEFAULT 0,
      demoted     INTEGER DEFAULT 0,
      UNIQUE(week_id, user_id)
    );
    CREATE INDEX IF NOT EXISTS idx_league_week   ON league_members(week_id);
    CREATE INDEX IF NOT EXISTS idx_league_user   ON league_members(user_id);
    CREATE INDEX IF NOT EXISTS idx_league_league ON league_members(week_id, league);
  `);

  // Add email_verified column if missing (migration-safe)
  try {
    db.exec(`ALTER TABLE users ADD COLUMN email_verified INTEGER DEFAULT 0`);
  } catch {
    // Column already exists — ignore
  }

  // Add league column to users if missing
  try {
    db.exec(`ALTER TABLE users ADD COLUMN league TEXT DEFAULT 'bronze'`);
  } catch {
    // Column already exists — ignore
  }

  // Add ranked battle columns to users if missing
  try { db.exec(`ALTER TABLE users ADD COLUMN ranked_points INTEGER DEFAULT 1000`); } catch { }
  try { db.exec(`ALTER TABLE users ADD COLUMN battle_wins INTEGER DEFAULT 0`); } catch { }
  try { db.exec(`ALTER TABLE users ADD COLUMN battle_losses INTEGER DEFAULT 0`); } catch { }

  // Add role column for admin dashboard
  try { db.exec(`ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'`); } catch { }

  // Auto-seed admin accounts
  try {
    const adminEmails = ["bapt6126@outlook.com"];
    const adminUsernames = ["Franz"];
    for (const email of adminEmails) {
      db.prepare(`UPDATE users SET role = 'admin' WHERE email = ? AND role != 'admin'`).run(email.toLowerCase().trim());
    }
    for (const username of adminUsernames) {
      db.prepare(`UPDATE users SET role = 'admin' WHERE username = ? AND role != 'admin'`).run(username.toLowerCase().trim());
    }
  } catch { /* ignore */ }

  // ═══ Analytics tables ═══
  db.exec(`
    CREATE TABLE IF NOT EXISTS page_views (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      path        TEXT    NOT NULL,
      referrer    TEXT    DEFAULT '',
      user_agent  TEXT    DEFAULT '',
      session_id  TEXT    NOT NULL,
      user_id     INTEGER DEFAULT NULL,
      duration_ms INTEGER DEFAULT 0,
      created_at  TEXT    DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_pv_path   ON page_views(path);
    CREATE INDEX IF NOT EXISTS idx_pv_date    ON page_views(date(created_at));
    CREATE INDEX IF NOT EXISTS idx_pv_session ON page_views(session_id);

    CREATE TABLE IF NOT EXISTS visit_sessions (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id  TEXT    NOT NULL UNIQUE,
      user_id     INTEGER DEFAULT NULL,
      ip_hash     TEXT    DEFAULT '',
      pages       INTEGER DEFAULT 1,
      duration_ms INTEGER DEFAULT 0,
      first_page  TEXT    DEFAULT '',
      created_at  TEXT    DEFAULT (datetime('now')),
      updated_at  TEXT    DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_vs_session ON visit_sessions(session_id);
    CREATE INDEX IF NOT EXISTS idx_vs_date    ON visit_sessions(date(created_at));

    CREATE TABLE IF NOT EXISTS banned_ips (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      ip          TEXT    NOT NULL UNIQUE,
      reason      TEXT    DEFAULT '',
      banned_by   INTEGER DEFAULT NULL,
      created_at  TEXT    DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_banned_ip ON banned_ips(ip);

    -- ═══ CERTIFICATIONS ═══
    CREATE TABLE IF NOT EXISTS certifications (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      module_id       TEXT    NOT NULL,
      verification_code TEXT  NOT NULL UNIQUE,
      score           INTEGER NOT NULL,
      max_score       INTEGER NOT NULL,
      stripe_session_id TEXT  DEFAULT '',
      paid            INTEGER DEFAULT 0,
      issued_at       TEXT    DEFAULT (datetime('now')),
      UNIQUE(user_id, module_id)
    );
    CREATE INDEX IF NOT EXISTS idx_cert_user   ON certifications(user_id);
    CREATE INDEX IF NOT EXISTS idx_cert_module  ON certifications(module_id);
    CREATE INDEX IF NOT EXISTS idx_cert_code    ON certifications(verification_code);

    CREATE TABLE IF NOT EXISTS certification_attempts (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      module_id       TEXT    NOT NULL,
      score           INTEGER NOT NULL,
      max_score       INTEGER NOT NULL,
      answers         TEXT    DEFAULT '{}',
      passed          INTEGER DEFAULT 0,
      created_at      TEXT    DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_attempt_user  ON certification_attempts(user_id);
    CREATE INDEX IF NOT EXISTS idx_attempt_module ON certification_attempts(user_id, module_id);

    -- ═══ CODE EXECUTION LOG ═══
    -- Anti-abuse + analytics for the Piston-backed /api/db/execute endpoint.
    CREATE TABLE IF NOT EXISTS execution_log (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id     INTEGER REFERENCES users(id) ON DELETE SET NULL,
      ip          TEXT,
      language    TEXT    NOT NULL,
      exit_code   INTEGER,
      code_len    INTEGER NOT NULL DEFAULT 0,
      duration_ms INTEGER NOT NULL DEFAULT 0,
      error       TEXT,
      created_at  TEXT    DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_execlog_user ON execution_log(user_id, created_at);
    CREATE INDEX IF NOT EXISTS idx_execlog_ip   ON execution_log(ip, created_at);
    CREATE INDEX IF NOT EXISTS idx_execlog_when ON execution_log(created_at);

    -- ═══ DAILY CHALLENGE ═══
    -- One curated exercise per UTC day. Solving it grants bonus XP + a streak counter.
    CREATE TABLE IF NOT EXISTS daily_challenges (
      day         TEXT    PRIMARY KEY,                  -- 'YYYY-MM-DD'
      module_id   TEXT    NOT NULL,
      exercise_id TEXT    NOT NULL,
      created_at  TEXT    DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS daily_completions (
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      day        TEXT    NOT NULL,
      solved_at  TEXT    DEFAULT (datetime('now')),
      duration_s INTEGER DEFAULT 0,
      PRIMARY KEY (user_id, day)
    );
    CREATE INDEX IF NOT EXISTS idx_daily_user ON daily_completions(user_id, day);
  `);

  // Initialize battle & playground tables
  initBattleAndPlaygroundTables(db);
}

/* ═══ PASSWORD HASHING ═══ */

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const result = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(result, "hex"));
}

/* ═══ SESSION TOKEN ═══ */

export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/* ═══ USER CRUD ═══ */

export interface DbUser {
  id: number;
  username: string;
  email: string;
  display_name: string;
  password_hash: string | null;
  avatar_type: string;
  avatar_value: string;
  avatar_color: string;
  xp: number;
  level: number;
  streak: number;
  best_streak: number;
  auth_provider: string;
  email_verified: number;
  ranked_points: number;
  battle_wins: number;
  battle_losses: number;
  role: string;
  created_at: string;
  last_login: string;
}

export function createUser(username: string, email: string, password: string, displayName: string): DbUser {
  const db = getDb();
  const hash = hashPassword(password);
  const initials = (displayName || username).substring(0, 2).toUpperCase();

  const stmt = db.prepare(`
    INSERT INTO users (username, email, display_name, password_hash, avatar_type, avatar_value, avatar_color)
    VALUES (?, ?, ?, ?, 'initials', ?, '#00d4ff')
  `);
  const result = stmt.run(username.toLowerCase().trim(), email.toLowerCase().trim(), displayName, hash, initials);

  // Create default settings
  db.prepare(`INSERT INTO user_settings (user_id) VALUES (?)`).run(result.lastInsertRowid);

  return getUserById(Number(result.lastInsertRowid))!;
}

export function createOAuthUser(email: string, displayName: string, provider: string, avatarUrl?: string): DbUser {
  const db = getDb();
  // Generate a unique username from email
  let username = email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "");
  if (username.length < 3) username = username + "user";
  // Ensure uniqueness
  let finalUsername = username;
  let counter = 1;
  while (getUserByUsername(finalUsername)) {
    finalUsername = `${username}${counter}`;
    counter++;
  }

  const initials = (displayName || finalUsername).substring(0, 2).toUpperCase();
  const avatarType = avatarUrl ? "image" : "initials";
  const avatarValue = avatarUrl || initials;

  const stmt = db.prepare(`
    INSERT INTO users (username, email, display_name, password_hash, avatar_type, avatar_value, avatar_color, auth_provider, email_verified)
    VALUES (?, ?, ?, NULL, ?, ?, '#00d4ff', ?, 1)
  `);
  const result = stmt.run(finalUsername, email.toLowerCase().trim(), displayName, avatarType, avatarValue, provider);

  // Create default settings
  db.prepare(`INSERT INTO user_settings (user_id) VALUES (?)`).run(result.lastInsertRowid);

  return getUserById(Number(result.lastInsertRowid))!;
}

export function getUserById(id: number): DbUser | null {
  const db = getDb();
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id) as DbUser | null;
}

export function getUserByUsername(username: string): DbUser | null {
  const db = getDb();
  return db.prepare("SELECT * FROM users WHERE username = ? COLLATE NOCASE").get(username.toLowerCase().trim()) as DbUser | null;
}

export function getUserByEmail(email: string): DbUser | null {
  const db = getDb();
  return db.prepare("SELECT * FROM users WHERE email = ? COLLATE NOCASE").get(email.toLowerCase().trim()) as DbUser | null;
}

export function updateUserXp(userId: number, xpToAdd: number): { xp: number; level: number } {
  const db = getDb();
  const user = getUserById(userId);
  if (!user) throw new Error("User not found");
  const newXp = user.xp + xpToAdd;
  const newLevel = Math.floor(newXp / 1000) + 1;
  db.prepare("UPDATE users SET xp = ?, level = ?, last_login = datetime('now') WHERE id = ?").run(newXp, newLevel, userId);
  return { xp: newXp, level: newLevel };
}

export function updateUserStreak(userId: number, streak: number): void {
  const db = getDb();
  const user = getUserById(userId);
  if (!user) return;
  const bestStreak = Math.max(user.best_streak, streak);
  db.prepare("UPDATE users SET streak = ?, best_streak = ? WHERE id = ?").run(streak, bestStreak, userId);
}

export function updateUserAvatar(userId: number, type: string, value: string, color: string): void {
  const db = getDb();
  db.prepare("UPDATE users SET avatar_type = ?, avatar_value = ?, avatar_color = ? WHERE id = ?").run(type, value, color, userId);
}

/** Update the user's public bio. Truncated to 280 chars (Twitter-style). */
export function updateUserBio(userId: number, bio: string): void {
  const db = getDb();
  const clean = (bio || "").slice(0, 280);
  db.prepare("UPDATE users SET bio = ? WHERE id = ?").run(clean, userId);
}

export function updateLastLogin(userId: number): void {
  const db = getDb();
  db.prepare("UPDATE users SET last_login = datetime('now') WHERE id = ?").run(userId);
}

export function upgradeUserFromOAuth(userId: number, provider: string): void {
  const db = getDb();
  db.prepare("UPDATE users SET email_verified = 1, auth_provider = ?, last_login = datetime('now') WHERE id = ?").run(provider, userId);
}

/* ═══ SESSION CRUD ═══ */

export function createSession(userId: number): string {
  const db = getDb();
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days
  db.prepare("INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)").run(userId, token, expiresAt);
  return token;
}

export function getSessionUser(token: string): DbUser | null {
  const db = getDb();
  const session = db.prepare(`
    SELECT s.user_id FROM sessions s
    WHERE s.token = ? AND s.expires_at > datetime('now')
  `).get(token) as { user_id: number } | null;
  if (!session) return null;
  return getUserById(session.user_id);
}

export function deleteSession(token: string): void {
  const db = getDb();
  db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
}

/** Revoke every active session for a user — useful for "logout from all devices". */
export function deleteAllSessionsForUser(userId: number): number {
  const db = getDb();
  const r = db.prepare("DELETE FROM sessions WHERE user_id = ?").run(userId);
  return r.changes;
}

/** Drop expired sessions. Called from a background interval below to keep the table small. */
export function purgeExpiredSessions(): number {
  const db = getDb();
  const r = db.prepare("DELETE FROM sessions WHERE expires_at <= datetime('now')").run();
  return r.changes;
}

/* ═══ DAILY CHALLENGE ═══ */

interface DailyChallengeRow {
  day: string;
  module_id: string;
  exercise_id: string;
}

/**
 * Get (and lazily create) today's challenge. We pick a deterministic exercise
 * based on the date, so all users see the same one for that day.
 */
export function getTodaysChallenge(): DailyChallengeRow | null {
  const db = getDb();
  const day = new Date().toISOString().slice(0, 10);
  const existing = db.prepare("SELECT * FROM daily_challenges WHERE day = ?").get(day) as DailyChallengeRow | undefined;
  if (existing) return existing;

  // No challenge yet — pick a (module, exercise) deterministically from progress data.
  // Reuse the most-popular module among signed-up users; falls back to "python".
  const popular = db.prepare(
    `SELECT module_id, COUNT(*) c FROM exercise_progress
     GROUP BY module_id ORDER BY c DESC LIMIT 5`
  ).all() as { module_id: string; c: number }[];
  const moduleId = popular[0]?.module_id || "python";

  // Choose an arbitrary "code" exercise id for the day — caller's UI is responsible
  // for resolving the exercise from the in-memory registry.
  const exerciseId = `${moduleId}-daily-${day}`;
  db.prepare("INSERT OR REPLACE INTO daily_challenges (day, module_id, exercise_id) VALUES (?, ?, ?)")
    .run(day, moduleId, exerciseId);
  return { day, module_id: moduleId, exercise_id: exerciseId };
}

/** Mark today's daily as completed for this user (idempotent). */
export function completeDailyChallenge(userId: number, durationS: number): { newlyCompleted: boolean; streak: number } {
  const db = getDb();
  const day = new Date().toISOString().slice(0, 10);
  const r = db.prepare(
    "INSERT OR IGNORE INTO daily_completions (user_id, day, duration_s) VALUES (?, ?, ?)"
  ).run(userId, day, durationS);
  const newlyCompleted = r.changes > 0;
  return { newlyCompleted, streak: getDailyStreak(userId) };
}

/** Count consecutive days ending today (or yesterday) where the user completed the daily. */
export function getDailyStreak(userId: number): number {
  const db = getDb();
  const rows = db.prepare(
    `SELECT day FROM daily_completions WHERE user_id = ?
     AND day >= date('now', '-60 day') ORDER BY day DESC`
  ).all(userId) as { day: string }[];
  if (rows.length === 0) return 0;
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  let cursor = rows[0].day === today ? today : rows[0].day === yesterday ? yesterday : null;
  if (!cursor) return 0;
  let streak = 0;
  for (const r of rows) {
    if (r.day === cursor) {
      streak++;
      cursor = new Date(new Date(cursor).getTime() - 86_400_000).toISOString().slice(0, 10);
    } else break;
  }
  return streak;
}

// Run an hourly cleanup of expired sessions (and expired email verifications).
// Guarded against multiple inits via globalThis.
if (typeof globalThis !== "undefined" && !(globalThis as any).__carthage_sessionPurger) {
  (globalThis as any).__carthage_sessionPurger = setInterval(() => {
    try {
      const n = purgeExpiredSessions();
      getDb().prepare("DELETE FROM email_verifications WHERE expires_at <= datetime('now')").run();
      if (n > 0) console.log(`[sessions] purged ${n} expired`);
    } catch (e) {
      console.error("[sessions] purge failed", e);
    }
  }, 3600_000);
}

export function deleteUserSessions(userId: number): void {
  const db = getDb();
  db.prepare("DELETE FROM sessions WHERE user_id = ?").run(userId);
}

/* ═══ EXERCISE PROGRESS CRUD ═══ */

export function addExerciseProgress(userId: number, moduleId: string, exerciseId: string): boolean {
  const db = getDb();
  try {
    db.prepare(`
      INSERT OR IGNORE INTO exercise_progress (user_id, module_id, exercise_id)
      VALUES (?, ?, ?)
    `).run(userId, moduleId, exerciseId);
    return true;
  } catch {
    return false;
  }
}

export function getExerciseProgress(userId: number): Record<string, string[]> {
  const db = getDb();
  const rows = db.prepare(`
    SELECT module_id, exercise_id FROM exercise_progress WHERE user_id = ? ORDER BY completed_at
  `).all(userId) as { module_id: string; exercise_id: string }[];

  const progress: Record<string, string[]> = {};
  for (const row of rows) {
    if (!progress[row.module_id]) progress[row.module_id] = [];
    progress[row.module_id].push(row.exercise_id);
  }
  return progress;
}

export function getModuleProgress(userId: number, moduleId: string): string[] {
  const db = getDb();
  const rows = db.prepare(`
    SELECT exercise_id FROM exercise_progress WHERE user_id = ? AND module_id = ? ORDER BY completed_at
  `).all(userId, moduleId) as { exercise_id: string }[];
  return rows.map((r) => r.exercise_id);
}

export function getCompletedCount(userId: number): number {
  const db = getDb();
  const row = db.prepare("SELECT COUNT(*) as count FROM exercise_progress WHERE user_id = ?").get(userId) as { count: number };
  return row.count;
}

/* ═══ BADGES CRUD ═══ */

export function addBadge(userId: number, badgeId: string): boolean {
  const db = getDb();
  try {
    db.prepare("INSERT OR IGNORE INTO user_badges (user_id, badge_id) VALUES (?, ?)").run(userId, badgeId);
    return true;
  } catch {
    return false;
  }
}

export function getUserBadges(userId: number): string[] {
  const db = getDb();
  const rows = db.prepare("SELECT badge_id FROM user_badges WHERE user_id = ? ORDER BY earned_at").all(userId) as { badge_id: string }[];
  return rows.map((r) => r.badge_id);
}

/* ═══ EMAIL VERIFICATION ═══ */

export function createEmailVerification(userId: number): string {
  const db = getDb();
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours
  // Remove any existing verification for this user
  db.prepare("DELETE FROM email_verifications WHERE user_id = ?").run(userId);
  db.prepare("INSERT INTO email_verifications (user_id, token, expires_at) VALUES (?, ?, ?)").run(userId, token, expiresAt);
  return token;
}

export function verifyEmailToken(token: string): DbUser | null {
  const db = getDb();
  const row = db.prepare(`
    SELECT user_id FROM email_verifications
    WHERE token = ? AND expires_at > datetime('now')
  `).get(token) as { user_id: number } | null;

  if (!row) return null;

  // Mark user as verified
  db.prepare("UPDATE users SET email_verified = 1 WHERE id = ?").run(row.user_id);
  // Delete the verification token
  db.prepare("DELETE FROM email_verifications WHERE token = ?").run(token);

  return getUserById(row.user_id);
}

export function isEmailVerified(userId: number): boolean {
  const user = getUserById(userId);
  return user ? user.email_verified === 1 : false;
}

/* ═══ CODE BATTLE & PLAYGROUND TABLES ═══ */

// Migration-safe: add tables if they don't exist
function initBattleAndPlaygroundTables(db: Database.Database) {
  db.exec(`
    -- ═══ BATTLE CHALLENGES (pool of problems) ═══
    CREATE TABLE IF NOT EXISTS battle_challenges (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT    NOT NULL,
      description TEXT    NOT NULL,
      language    TEXT    NOT NULL DEFAULT 'javascript',
      difficulty  TEXT    NOT NULL DEFAULT 'easy',
      template    TEXT    NOT NULL DEFAULT '',
      tests       TEXT    NOT NULL DEFAULT '[]',
      time_limit  INTEGER NOT NULL DEFAULT 300
    );

    -- ═══ CODE BATTLES (matches) ═══
    CREATE TABLE IF NOT EXISTS code_battles (
      id            TEXT    PRIMARY KEY,
      challenge_id  INTEGER REFERENCES battle_challenges(id),
      creator_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      opponent_id   INTEGER REFERENCES users(id) ON DELETE CASCADE,
      mode          TEXT    NOT NULL DEFAULT 'casual',
      difficulty    TEXT    NOT NULL DEFAULT 'easy',
      status        TEXT    NOT NULL DEFAULT 'waiting',
      creator_code  TEXT    DEFAULT '',
      opponent_code TEXT    DEFAULT '',
      creator_time  INTEGER DEFAULT NULL,
      opponent_time INTEGER DEFAULT NULL,
      winner_id     INTEGER REFERENCES users(id),
      ranked_delta  INTEGER DEFAULT 0,
      created_at    TEXT    DEFAULT (datetime('now')),
      started_at    TEXT,
      finished_at   TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_battles_creator  ON code_battles(creator_id);
    CREATE INDEX IF NOT EXISTS idx_battles_opponent ON code_battles(opponent_id);
    CREATE INDEX IF NOT EXISTS idx_battles_status   ON code_battles(status);

    -- ═══ CODE CREATIONS (playground) ═══
    CREATE TABLE IF NOT EXISTS code_creations (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title       TEXT    NOT NULL,
      description TEXT    DEFAULT '',
      html_code   TEXT    DEFAULT '',
      css_code    TEXT    DEFAULT '',
      js_code     TEXT    DEFAULT '',
      is_public   INTEGER DEFAULT 0,
      likes       INTEGER DEFAULT 0,
      views       INTEGER DEFAULT 0,
      created_at  TEXT    DEFAULT (datetime('now')),
      updated_at  TEXT    DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_creations_user   ON code_creations(user_id);
    CREATE INDEX IF NOT EXISTS idx_creations_public ON code_creations(is_public);

    -- ═══ CREATION LIKES ═══
    CREATE TABLE IF NOT EXISTS creation_likes (
      user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      creation_id INTEGER NOT NULL REFERENCES code_creations(id) ON DELETE CASCADE,
      created_at  TEXT    DEFAULT (datetime('now')),
      PRIMARY KEY (user_id, creation_id)
    );
  `);

  // Seed 500 battle challenges if fewer than 100 exist
  const count = db.prepare("SELECT COUNT(*) as c FROM battle_challenges").get() as { c: number };
  if (count.c < 100) {
    // Clear old challenges and reseed
    db.prepare("DELETE FROM battle_challenges").run();
    const stmt = db.prepare("INSERT INTO battle_challenges (title, description, language, difficulty, template, tests, time_limit) VALUES (?, ?, ?, ?, ?, ?, ?)");
    const insertAll = db.transaction(() => {
      for (const c of ALL_CHALLENGES) {
        stmt.run(c.title, c.description, "javascript", c.difficulty, c.template, JSON.stringify(c.tests), c.time_limit);
      }
    });
    insertAll();
  }

  // Add mode/difficulty/ranked_delta columns to code_battles if missing
  try { db.exec(`ALTER TABLE code_battles ADD COLUMN mode TEXT NOT NULL DEFAULT 'casual'`); } catch { }
  try { db.exec(`ALTER TABLE code_battles ADD COLUMN difficulty TEXT NOT NULL DEFAULT 'easy'`); } catch { }
  try { db.exec(`ALTER TABLE code_battles ADD COLUMN ranked_delta INTEGER DEFAULT 0`); } catch { }
  // Anti-cheat signals captured at submit time (JSON).
  try { db.exec(`ALTER TABLE code_battles ADD COLUMN creator_flags TEXT DEFAULT NULL`); } catch { }
  try { db.exec(`ALTER TABLE code_battles ADD COLUMN opponent_flags TEXT DEFAULT NULL`); } catch { }
  // Profile bio (Twitter-style, 280 chars max).
  try { db.exec(`ALTER TABLE users ADD COLUMN bio TEXT DEFAULT ''`); } catch { }
  // Push notification subscriptions (JSON per user).
  try { db.exec(`ALTER TABLE users ADD COLUMN push_subscription TEXT DEFAULT NULL`); } catch { }
}

/* ═══ BATTLE HELPERS ═══ */

export interface BattleChallenge {
  id: number; title: string; description: string; language: string;
  difficulty: string; template: string; tests: string; time_limit: number;
}

export interface CodeBattle {
  id: string; challenge_id: number; creator_id: number; opponent_id: number | null;
  mode: string; difficulty: string; status: string; creator_code: string; opponent_code: string;
  creator_time: number | null; opponent_time: number | null;
  winner_id: number | null; ranked_delta: number;
  created_at: string; started_at: string | null; finished_at: string | null;
}

export function getRandomChallenge(difficulty?: string): BattleChallenge {
  const db = getDb();
  const q = difficulty
    ? db.prepare("SELECT * FROM battle_challenges WHERE difficulty = ? ORDER BY RANDOM() LIMIT 1").get(difficulty)
    : db.prepare("SELECT * FROM battle_challenges ORDER BY RANDOM() LIMIT 1").get();
  return q as BattleChallenge;
}

export function getAllChallenges(): BattleChallenge[] {
  const db = getDb();
  return db.prepare("SELECT * FROM battle_challenges ORDER BY difficulty, id").all() as BattleChallenge[];
}

export function createBattle(creatorId: number, opts: { challengeId?: number; difficulty?: string; mode?: string } = {}): CodeBattle {
  const db = getDb();
  const mode = opts.mode || "casual";
  const diff = opts.difficulty || "easy";
  const challenge = opts.challengeId
    ? db.prepare("SELECT * FROM battle_challenges WHERE id = ?").get(opts.challengeId) as BattleChallenge
    : getRandomChallenge(diff);
  const id = crypto.randomBytes(8).toString("hex");
  db.prepare(`
    INSERT INTO code_battles (id, challenge_id, creator_id, mode, difficulty, status)
    VALUES (?, ?, ?, ?, ?, 'waiting')
  `).run(id, challenge.id, creatorId, mode, diff);
  return db.prepare("SELECT * FROM code_battles WHERE id = ?").get(id) as CodeBattle;
}

export function joinBattle(battleId: string, userId: number): CodeBattle | null {
  const db = getDb();
  const battle = db.prepare("SELECT * FROM code_battles WHERE id = ?").get(battleId) as CodeBattle | null;
  if (!battle || battle.status !== "waiting" || battle.creator_id === userId) return null;
  db.prepare("UPDATE code_battles SET opponent_id = ?, status = 'active', started_at = datetime('now') WHERE id = ?").run(userId, battleId);
  return db.prepare("SELECT * FROM code_battles WHERE id = ?").get(battleId) as CodeBattle;
}

/* ═══ JAVASCRIPT CODE VALIDATION ═══ */

export interface ValidationResult {
  passed: boolean;
  results: { input: string; expected: string; actual: string; passed: boolean }[];
  error?: string;
}

export function validateJavaScriptCode(code: string, tests: { input: string; expected: string }[]): ValidationResult {
  const results: { input: string; expected: string; actual: string; passed: boolean }[] = [];
  
  for (const test of tests) {
    try {
      // Create a safe evaluation context
      const func = new Function('input', `
        ${code}
        return eval(input);
      `);
      
      const actual = String(func(test.input));
      const expected = test.expected;
      const passed = actual === expected;
      
      results.push({ input: test.input, expected, actual, passed });
      
      if (!passed) {
        return { passed: false, results };
      }
    } catch (error: any) {
      return { 
        passed: false, 
        results: [{ input: test.input, expected: test.expected, actual: error.message, passed: false }],
        error: error.message 
      };
    }
  }
  
  return { passed: true, results };
}

export function submitBattleSolution(
  battleId: string,
  userId: number,
  code: string,
  _clientTimeMs: number,
  flags: unknown = null
): CodeBattle | null {
  const db = getDb();
  const battle = db.prepare("SELECT * FROM code_battles WHERE id = ?").get(battleId) as CodeBattle | null;
  if (!battle || battle.status !== "active") return null;

  // Enforce that the submitter is a participant
  if (userId !== battle.creator_id && userId !== battle.opponent_id) return null;

  // ── Anti-cheat: compute timeMs server-side from `started_at`, ignore client value ──
  // If clientTimeMs is far below the server elapsed, trust the server (anti time-spoof).
  // If above, also trust the server (client clock can drift, but the floor is what matters
  // for ranked leaderboards).
  let serverTimeMs = 0;
  if (battle.started_at) {
    serverTimeMs = Math.max(0, Date.now() - new Date(battle.started_at + "Z").getTime());
  }
  // Sanity floor: anything under 1 second is humanly impossible and almost certainly
  // a timing exploit or race condition. Reject hard.
  if (serverTimeMs < 1000) return null;
  const timeMs = serverTimeMs;

  // Get the challenge tests
  const challenge = db.prepare("SELECT * FROM battle_challenges WHERE id = ?").get(battle.challenge_id) as BattleChallenge | null;
  if (!challenge) return null;

  // Validate the code against tests
  const tests = JSON.parse(challenge.tests) as { input: string; expected: string }[];
  const validation = validateJavaScriptCode(code, tests);

  // Persist the submission + flags, regardless of pass/fail
  const flagsJson = flags ? JSON.stringify(flags).slice(0, 4000) : null;
  if (userId === battle.creator_id) {
    db.prepare("UPDATE code_battles SET creator_code = ?, creator_time = ?, creator_flags = COALESCE(?, creator_flags) WHERE id = ?")
      .run(code, timeMs, flagsJson, battleId);
  } else {
    db.prepare("UPDATE code_battles SET opponent_code = ?, opponent_time = ?, opponent_flags = COALESCE(?, opponent_flags) WHERE id = ?")
      .run(code, timeMs, flagsJson, battleId);
  }

  if (!validation.passed) return null;

  // First correct submission wins immediately!
  const winnerId = userId;
  const loserId = winnerId === battle.creator_id ? battle.opponent_id! : battle.creator_id;

  let delta = 0;
  if (battle.mode === "ranked") {
    const winner = getUserById(winnerId);
    const loser = getUserById(loserId);
    const wPts = winner?.ranked_points ?? 1000;
    const lPts = loser?.ranked_points ?? 1000;
    const expectedW = 1 / (1 + Math.pow(10, (lPts - wPts) / 400));
    delta = Math.round(32 * (1 - expectedW));
    if (delta < 5) delta = 5;
    db.prepare("UPDATE users SET ranked_points = ranked_points + ?, battle_wins = battle_wins + 1 WHERE id = ?").run(delta, winnerId);
    db.prepare("UPDATE users SET ranked_points = MAX(0, ranked_points - ?), battle_losses = battle_losses + 1 WHERE id = ?").run(delta, loserId);
  } else {
    db.prepare("UPDATE users SET battle_wins = battle_wins + 1 WHERE id = ?").run(winnerId);
    db.prepare("UPDATE users SET battle_losses = battle_losses + 1 WHERE id = ?").run(loserId);
  }

  db.prepare("UPDATE code_battles SET status = 'finished', winner_id = ?, ranked_delta = ?, finished_at = datetime('now') WHERE id = ?").run(winnerId, delta, battleId);
  return db.prepare("SELECT * FROM code_battles WHERE id = ?").get(battleId) as CodeBattle;
}

export function forfeitBattle(battleId: string, forfeiterId: number): CodeBattle | null {
  const db = getDb();
  const battle = db.prepare("SELECT * FROM code_battles WHERE id = ?").get(battleId) as CodeBattle | null;
  if (!battle || battle.status !== "active") return null;
  if (forfeiterId !== battle.creator_id && forfeiterId !== battle.opponent_id) return null;

  const loserId = forfeiterId;
  const winnerId = loserId === battle.creator_id ? battle.opponent_id! : battle.creator_id;

  let delta = 0;
  if (battle.mode === "ranked") {
    const winner = getUserById(winnerId);
    const loser = getUserById(loserId);
    const wPts = winner?.ranked_points ?? 1000;
    const lPts = loser?.ranked_points ?? 1000;
    const expectedW = 1 / (1 + Math.pow(10, (lPts - wPts) / 400));
    delta = Math.round(32 * (1 - expectedW));
    if (delta < 5) delta = 5;
    db.prepare("UPDATE users SET ranked_points = ranked_points + ?, battle_wins = battle_wins + 1 WHERE id = ?").run(delta, winnerId);
    db.prepare("UPDATE users SET ranked_points = MAX(0, ranked_points - ?), battle_losses = battle_losses + 1 WHERE id = ?").run(delta, loserId);
  } else {
    db.prepare("UPDATE users SET battle_wins = battle_wins + 1 WHERE id = ?").run(winnerId);
    db.prepare("UPDATE users SET battle_losses = battle_losses + 1 WHERE id = ?").run(loserId);
  }

  db.prepare("UPDATE code_battles SET status = 'finished', winner_id = ?, ranked_delta = ?, finished_at = datetime('now') WHERE id = ?").run(winnerId, delta, battleId);
  return db.prepare("SELECT * FROM code_battles WHERE id = ?").get(battleId) as CodeBattle;
}

export function getBattle(battleId: string): CodeBattle | null {
  const db = getDb();
  return db.prepare("SELECT * FROM code_battles WHERE id = ?").get(battleId) as CodeBattle | null;
}

export function getBattleWithDetails(battleId: string) {
  const db = getDb();
  const battle = getBattle(battleId);
  if (!battle) return null;
  const challenge = db.prepare("SELECT * FROM battle_challenges WHERE id = ?").get(battle.challenge_id) as BattleChallenge;
  const creator = getUserById(battle.creator_id);
  const opponent = battle.opponent_id ? getUserById(battle.opponent_id) : null;
  const winner = battle.winner_id ? getUserById(battle.winner_id) : null;
  return { battle, challenge, creator, opponent, winner };
}

export function getWaitingBattles(excludeUserId?: number): Array<CodeBattle & { creator_name: string; creator_avatar_type: string; creator_avatar_value: string; creator_avatar_color: string; creator_level: number; challenge_title: string; challenge_difficulty: string; challenge_time_limit: number }> {
  const db = getDb();
  const q = excludeUserId
    ? db.prepare(`
        SELECT cb.*, u.display_name as creator_name, u.avatar_type as creator_avatar_type, u.avatar_value as creator_avatar_value, u.avatar_color as creator_avatar_color, u.level as creator_level,
               bc.title as challenge_title, bc.difficulty as challenge_difficulty, bc.time_limit as challenge_time_limit
        FROM code_battles cb
        JOIN users u ON u.id = cb.creator_id
        JOIN battle_challenges bc ON bc.id = cb.challenge_id
        WHERE cb.status = 'waiting' AND cb.creator_id != ?
        ORDER BY cb.created_at DESC LIMIT 20
      `).all(excludeUserId)
    : db.prepare(`
        SELECT cb.*, u.display_name as creator_name, u.avatar_type as creator_avatar_type, u.avatar_value as creator_avatar_value, u.avatar_color as creator_avatar_color, u.level as creator_level,
               bc.title as challenge_title, bc.difficulty as challenge_difficulty, bc.time_limit as challenge_time_limit
        FROM code_battles cb
        JOIN users u ON u.id = cb.creator_id
        JOIN battle_challenges bc ON bc.id = cb.challenge_id
        WHERE cb.status = 'waiting'
        ORDER BY cb.created_at DESC LIMIT 20
      `).all();
  return q as any[];
}

export function getUserBattleHistory(userId: number, limit = 20): any[] {
  const db = getDb();
  return db.prepare(`
    SELECT cb.*, bc.title as challenge_title, bc.difficulty as challenge_difficulty,
           u1.display_name as creator_name, u2.display_name as opponent_name
    FROM code_battles cb
    JOIN battle_challenges bc ON bc.id = cb.challenge_id
    JOIN users u1 ON u1.id = cb.creator_id
    LEFT JOIN users u2 ON u2.id = cb.opponent_id
    WHERE (cb.creator_id = ? OR cb.opponent_id = ?) AND cb.status = 'finished'
    ORDER BY cb.finished_at DESC LIMIT ?
  `).all(userId, userId, limit);
}

export function cancelBattle(battleId: string, userId: number): boolean {
  const db = getDb();
  const battle = getBattle(battleId);
  if (!battle || battle.creator_id !== userId || battle.status !== "waiting") return false;
  db.prepare("DELETE FROM code_battles WHERE id = ?").run(battleId);
  return true;
}

/* ═══ RANKED LEADERBOARD ═══ */

export function getRankedLeaderboard(limit = 50): any[] {
  const db = getDb();
  return db.prepare(`
    SELECT id, username, display_name, avatar_type, avatar_value, avatar_color, level,
           ranked_points, battle_wins, battle_losses
    FROM users
    WHERE battle_wins + battle_losses > 0
    ORDER BY ranked_points DESC
    LIMIT ?
  `).all(limit);
}

export function getUserBattleStats(userId: number): { ranked_points: number; battle_wins: number; battle_losses: number; rank: number } {
  const db = getDb();
  const user = db.prepare("SELECT ranked_points, battle_wins, battle_losses FROM users WHERE id = ?").get(userId) as any;
  if (!user) return { ranked_points: 1000, battle_wins: 0, battle_losses: 0, rank: 0 };
  const rank = (db.prepare("SELECT COUNT(*) as c FROM users WHERE ranked_points > ? AND (battle_wins + battle_losses) > 0").get(user.ranked_points) as { c: number }).c + 1;
  return { ...user, rank };
}

export function getChallengeCount(): { easy: number; medium: number; hard: number; total: number } {
  const db = getDb();
  const easy = (db.prepare("SELECT COUNT(*) as c FROM battle_challenges WHERE difficulty = 'easy'").get() as { c: number }).c;
  const medium = (db.prepare("SELECT COUNT(*) as c FROM battle_challenges WHERE difficulty = 'medium'").get() as { c: number }).c;
  const hard = (db.prepare("SELECT COUNT(*) as c FROM battle_challenges WHERE difficulty = 'hard'").get() as { c: number }).c;
  return { easy, medium, hard, total: easy + medium + hard };
}

/* ═══ PLAYGROUND HELPERS ═══ */

export interface CodeCreation {
  id: number; user_id: number; title: string; description: string;
  html_code: string; css_code: string; js_code: string;
  is_public: number; likes: number; views: number;
  created_at: string; updated_at: string;
}

export function createCreation(userId: number, title: string, description: string, html: string, css: string, js: string, isPublic: boolean): CodeCreation {
  const db = getDb();
  const result = db.prepare(`
    INSERT INTO code_creations (user_id, title, description, html_code, css_code, js_code, is_public)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(userId, title, description, html, css, js, isPublic ? 1 : 0);
  return db.prepare("SELECT * FROM code_creations WHERE id = ?").get(result.lastInsertRowid) as CodeCreation;
}

export function updateCreation(id: number, userId: number, data: { title?: string; description?: string; html_code?: string; css_code?: string; js_code?: string; is_public?: boolean }): CodeCreation | null {
  const db = getDb();
  const existing = db.prepare("SELECT * FROM code_creations WHERE id = ? AND user_id = ?").get(id, userId) as CodeCreation | null;
  if (!existing) return null;
  const updates: string[] = [];
  const values: any[] = [];
  if (data.title !== undefined) { updates.push("title = ?"); values.push(data.title); }
  if (data.description !== undefined) { updates.push("description = ?"); values.push(data.description); }
  if (data.html_code !== undefined) { updates.push("html_code = ?"); values.push(data.html_code); }
  if (data.css_code !== undefined) { updates.push("css_code = ?"); values.push(data.css_code); }
  if (data.js_code !== undefined) { updates.push("js_code = ?"); values.push(data.js_code); }
  if (data.is_public !== undefined) { updates.push("is_public = ?"); values.push(data.is_public ? 1 : 0); }
  if (updates.length === 0) return existing;
  updates.push("updated_at = datetime('now')");
  values.push(id, userId);
  db.prepare(`UPDATE code_creations SET ${updates.join(", ")} WHERE id = ? AND user_id = ?`).run(...values);
  return db.prepare("SELECT * FROM code_creations WHERE id = ?").get(id) as CodeCreation;
}

export function deleteCreation(id: number, userId: number): boolean {
  const db = getDb();
  const result = db.prepare("DELETE FROM code_creations WHERE id = ? AND user_id = ?").run(id, userId);
  return result.changes > 0;
}

export function getCreation(id: number): (CodeCreation & { username: string; display_name: string; avatar_type: string; avatar_value: string; avatar_color: string; level: number }) | null {
  const db = getDb();
  return db.prepare(`
    SELECT cc.*, u.username, u.display_name, u.avatar_type, u.avatar_value, u.avatar_color, u.level
    FROM code_creations cc JOIN users u ON u.id = cc.user_id
    WHERE cc.id = ?
  `).get(id) as any;
}

export function getPublicCreations(page = 1, limit = 12, sort: "recent" | "popular" = "recent"): { creations: any[]; total: number } {
  const db = getDb();
  const offset = (page - 1) * limit;
  const total = (db.prepare("SELECT COUNT(*) as c FROM code_creations WHERE is_public = 1").get() as { c: number }).c;
  const orderBy = sort === "popular" ? "cc.likes DESC, cc.views DESC" : "cc.created_at DESC";
  const creations = db.prepare(`
    SELECT cc.*, u.username, u.display_name, u.avatar_type, u.avatar_value, u.avatar_color, u.level
    FROM code_creations cc JOIN users u ON u.id = cc.user_id
    WHERE cc.is_public = 1
    ORDER BY ${orderBy}
    LIMIT ? OFFSET ?
  `).all(limit, offset);
  return { creations, total };
}

export function getUserCreations(userId: number): CodeCreation[] {
  const db = getDb();
  return db.prepare("SELECT * FROM code_creations WHERE user_id = ? ORDER BY updated_at DESC").all(userId) as CodeCreation[];
}

export function toggleCreationLike(userId: number, creationId: number): { liked: boolean; likes: number } {
  const db = getDb();
  const existing = db.prepare("SELECT 1 FROM creation_likes WHERE user_id = ? AND creation_id = ?").get(userId, creationId);
  if (existing) {
    db.prepare("DELETE FROM creation_likes WHERE user_id = ? AND creation_id = ?").run(userId, creationId);
    db.prepare("UPDATE code_creations SET likes = MAX(0, likes - 1) WHERE id = ?").run(creationId);
  } else {
    db.prepare("INSERT OR IGNORE INTO creation_likes (user_id, creation_id) VALUES (?, ?)").run(userId, creationId);
    db.prepare("UPDATE code_creations SET likes = likes + 1 WHERE id = ?").run(creationId);
  }
  const creation = db.prepare("SELECT likes FROM code_creations WHERE id = ?").get(creationId) as { likes: number };
  return { liked: !existing, likes: creation.likes };
}

export function hasUserLiked(userId: number, creationId: number): boolean {
  const db = getDb();
  return !!db.prepare("SELECT 1 FROM creation_likes WHERE user_id = ? AND creation_id = ?").get(userId, creationId);
}

export function incrementCreationViews(creationId: number): void {
  const db = getDb();
  db.prepare("UPDATE code_creations SET views = views + 1 WHERE id = ?").run(creationId);
}

/* ═══ FULL USER DATA (for auth context) ═══ */

/* ═══ LEAGUE SYSTEM ═══ */

const LEAGUES = ["bronze", "silver", "gold", "platinum", "diamond", "master", "legendary"] as const;
export type LeagueName = (typeof LEAGUES)[number];

const LEAGUE_META: Record<LeagueName, { name: string; color: string; icon: string; minPromote: number; maxDemote: number }> = {
  bronze: { name: "Bronze", color: "#cd7f32", icon: "🥉", minPromote: 3, maxDemote: 0 },
  silver: { name: "Argent", color: "#c0c0c0", icon: "🥈", minPromote: 3, maxDemote: 3 },
  gold: { name: "Or", color: "#ffd700", icon: "🥇", minPromote: 3, maxDemote: 3 },
  platinum: { name: "Platine", color: "#00d4ff", icon: "💎", minPromote: 3, maxDemote: 3 },
  diamond: { name: "Diamant", color: "#a855f7", icon: "💠", minPromote: 3, maxDemote: 3 },
  master: { name: "Maître", color: "#ff2244", icon: "🔥", minPromote: 3, maxDemote: 3 },
  legendary: { name: "Légendaire", color: "#fbbf24", icon: "👑", minPromote: 0, maxDemote: 3 },
};

export { LEAGUES, LEAGUE_META };

function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function getCurrentWeek(): { id: number; week_start: string; week_end: string } {
  const db = getDb();
  const monday = getMonday(new Date());
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  const weekStart = monday.toISOString().slice(0, 10);
  const weekEnd = sunday.toISOString().slice(0, 10);

  let week = db.prepare("SELECT * FROM league_weeks WHERE week_start = ?").get(weekStart) as { id: number; week_start: string; week_end: string } | undefined;
  if (!week) {
    const result = db.prepare("INSERT INTO league_weeks (week_start, week_end) VALUES (?, ?)").run(weekStart, weekEnd);
    week = { id: Number(result.lastInsertRowid), week_start: weekStart, week_end: weekEnd };
  }
  return week;
}

export function ensureLeagueMember(userId: number): void {
  const db = getDb();
  const week = getCurrentWeek();
  const existing = db.prepare("SELECT id FROM league_members WHERE week_id = ? AND user_id = ?").get(week.id, userId);
  if (!existing) {
    const user = getUserById(userId);
    const league = (user as unknown as { league?: string })?.league || "bronze";
    db.prepare("INSERT OR IGNORE INTO league_members (week_id, user_id, league, weekly_xp) VALUES (?, ?, ?, 0)").run(week.id, userId, league);
  }
}

export function addWeeklyXp(userId: number, amount: number): void {
  const db = getDb();
  ensureLeagueMember(userId);
  const week = getCurrentWeek();
  db.prepare("UPDATE league_members SET weekly_xp = weekly_xp + ? WHERE week_id = ? AND user_id = ?").run(amount, week.id, userId);
}

export interface LeaderboardEntry {
  rank: number;
  userId: number;
  username: string;
  displayName: string;
  avatarType: string;
  avatarValue: string;
  avatarColor: string;
  weeklyXp: number;
  totalXp: number;
  level: number;
  league: string;
  promoted: number;
  demoted: number;
}

export function getLeaderboard(userId: number): {
  league: LeagueName;
  weekStart: string;
  weekEnd: string;
  members: LeaderboardEntry[];
  userRank: number;
  daysLeft: number;
  promotionZone: number;
  demotionZone: number;
} {
  const db = getDb();
  const week = getCurrentWeek();
  ensureLeagueMember(userId);

  const userLeague = (db.prepare("SELECT league FROM league_members WHERE week_id = ? AND user_id = ?").get(week.id, userId) as { league: string })?.league || "bronze";

  const members = db.prepare(`
    SELECT lm.weekly_xp, lm.league, lm.promoted, lm.demoted,
           u.id as user_id, u.username, u.display_name, u.avatar_type, u.avatar_value, u.avatar_color, u.xp, u.level
    FROM league_members lm
    JOIN users u ON u.id = lm.user_id
    WHERE lm.week_id = ? AND lm.league = ?
    ORDER BY lm.weekly_xp DESC, u.xp DESC
  `).all(week.id, userLeague) as Array<{
    weekly_xp: number; league: string; promoted: number; demoted: number;
    user_id: number; username: string; display_name: string; avatar_type: string; avatar_value: string; avatar_color: string; xp: number; level: number;
  }>;

  const entries: LeaderboardEntry[] = members.map((m, i) => ({
    rank: i + 1,
    userId: m.user_id,
    username: m.username,
    displayName: m.display_name,
    avatarType: m.avatar_type,
    avatarValue: m.avatar_value,
    avatarColor: m.avatar_color,
    weeklyXp: m.weekly_xp,
    totalXp: m.xp,
    level: m.level,
    league: m.league,
    promoted: m.promoted,
    demoted: m.demoted,
  }));

  const userRank = entries.findIndex(e => e.userId === userId) + 1;
  const meta = LEAGUE_META[userLeague as LeagueName] || LEAGUE_META.bronze;
  const now = new Date();
  const weekEnd = new Date(week.week_end + "T23:59:59");
  const daysLeft = Math.max(0, Math.ceil((weekEnd.getTime() - now.getTime()) / 86400000));

  return {
    league: userLeague as LeagueName,
    weekStart: week.week_start,
    weekEnd: week.week_end,
    members: entries,
    userRank,
    daysLeft,
    promotionZone: meta.minPromote,
    demotionZone: meta.maxDemote,
  };
}

export function getGlobalLeaderboard(limit = 50): Array<{
  rank: number; userId: number; username: string; displayName: string;
  avatarType: string; avatarValue: string; avatarColor: string;
  xp: number; level: number; league: string; exerciseCount: number;
}> {
  const db = getDb();
  const rows = db.prepare(`
    SELECT u.id, u.username, u.display_name, u.avatar_type, u.avatar_value, u.avatar_color, u.xp, u.level, u.league,
           (SELECT COUNT(*) FROM exercise_progress WHERE user_id = u.id) as exercise_count
    FROM users u
    WHERE u.xp > 0
    ORDER BY u.xp DESC
    LIMIT ?
  `).all(limit) as Array<{
    id: number; username: string; display_name: string; avatar_type: string; avatar_value: string; avatar_color: string;
    xp: number; level: number; league: string; exercise_count: number;
  }>;

  return rows.map((r, i) => ({
    rank: i + 1,
    userId: r.id,
    username: r.username,
    displayName: r.display_name,
    avatarType: r.avatar_type,
    avatarValue: r.avatar_value,
    avatarColor: r.avatar_color,
    xp: r.xp,
    level: r.level,
    league: r.league || "bronze",
    exerciseCount: r.exercise_count,
  }));
}

/* ═══ FULL USER DATA (for auth context) ═══ */

export function getFullUserData(userId: number) {
  const user = getUserById(userId);
  if (!user) return null;
  const progress = getExerciseProgress(userId);
  const badges = getUserBadges(userId);
  const completedCount = getCompletedCount(userId);

  const userData = {
    id: String(user.id),
    username: user.username,
    displayName: user.display_name,
    email: user.email,
    emailVerified: user.email_verified === 1,
    avatar: user.avatar_type === "image"
      ? { type: "image" as const, url: user.avatar_value }
      : user.avatar_type === "initials"
        ? { type: "initials" as const, initials: user.avatar_value, color: user.avatar_color }
        : null,
    xp: user.xp,
    level: user.level,
    streak: user.streak,
    progress,
    badges,
    stats: {
      totalExercises: 1102,
      completedExercises: completedCount,
      totalTime: 0,
      bestStreak: user.best_streak,
    },
    authProvider: user.auth_provider,
    role: user.role || 'user',
    createdAt: user.created_at,
    lastLogin: user.last_login,
  };
  console.log(`[DB] getFullUserData for ${userId} success.`);
  return userData;
}

/* ═══ ADMIN FUNCTIONS ═══ */

export function getAdminStats() {
  const db = getDb();
  const totalUsers = (db.prepare("SELECT COUNT(*) as c FROM users").get() as { c: number }).c;
  const totalExercises = (db.prepare("SELECT COUNT(*) as c FROM exercise_progress").get() as { c: number }).c;
  const totalBattles = (db.prepare("SELECT COUNT(*) as c FROM code_battles").get() as { c: number }).c;
  const totalBadges = (db.prepare("SELECT COUNT(*) as c FROM user_badges").get() as { c: number }).c;
  const totalXp = (db.prepare("SELECT COALESCE(SUM(xp), 0) as s FROM users").get() as { s: number }).s;
  const todayLogins = (db.prepare("SELECT COUNT(*) as c FROM users WHERE date(last_login) = date('now')").get() as { c: number }).c;
  const newUsersToday = (db.prepare("SELECT COUNT(*) as c FROM users WHERE date(created_at) = date('now')").get() as { c: number }).c;
  const verifiedUsers = (db.prepare("SELECT COUNT(*) as c FROM users WHERE email_verified = 1").get() as { c: number }).c;
  return { totalUsers, totalExercises, totalBattles, totalBadges, totalXp, todayLogins, newUsersToday, verifiedUsers };
}

export function getAllUsers(limit = 50, offset = 0) {
  const db = getDb();
  const users = db.prepare(`
    SELECT u.id, u.username, u.email, u.display_name, u.xp, u.level, u.streak,
           u.role, u.auth_provider, u.email_verified, u.created_at, u.last_login,
           (SELECT COUNT(*) FROM exercise_progress WHERE user_id = u.id) as exercises_completed
    FROM users u
    ORDER BY u.xp DESC
    LIMIT ? OFFSET ?
  `).all(limit, offset);
  const total = (db.prepare("SELECT COUNT(*) as c FROM users").get() as { c: number }).c;
  return { users, total };
}

export function setUserRole(userId: number, role: string): boolean {
  const db = getDb();
  try {
    db.prepare("UPDATE users SET role = ? WHERE id = ?").run(role, userId);
    return true;
  } catch {
    return false;
  }
}

export function deleteUser(userId: number): boolean {
  const db = getDb();
  try {
    db.prepare("DELETE FROM sessions WHERE user_id = ?").run(userId);
    db.prepare("DELETE FROM exercise_progress WHERE user_id = ?").run(userId);
    db.prepare("DELETE FROM user_badges WHERE user_id = ?").run(userId);
    db.prepare("DELETE FROM user_settings WHERE user_id = ?").run(userId);
    db.prepare("DELETE FROM email_verifications WHERE user_id = ?").run(userId);
    db.prepare("DELETE FROM users WHERE id = ?").run(userId);
    return true;
  } catch {
    return false;
  }
}

export function searchUsers(query: string) {
  const db = getDb();
  const like = `%${query}%`;
  return db.prepare(`
    SELECT u.id, u.username, u.email, u.display_name, u.xp, u.level, u.role,
           u.auth_provider, u.email_verified, u.created_at, u.last_login,
           (SELECT COUNT(*) FROM exercise_progress WHERE user_id = u.id) as exercises_completed
    FROM users u
    WHERE u.username LIKE ? OR u.email LIKE ? OR u.display_name LIKE ?
    ORDER BY u.xp DESC
    LIMIT 20
  `).all(like, like, like);
}

/* ═══ ANALYTICS ═══ */

export function trackPageView(path: string, sessionId: string, userId: number | null, referrer: string, userAgent: string) {
  const db = getDb();
  db.prepare(`INSERT INTO page_views (path, referrer, user_agent, session_id, user_id) VALUES (?, ?, ?, ?, ?)`).run(path, referrer, userAgent, sessionId, userId);
  // Upsert visit session
  const existing = db.prepare(`SELECT id, pages, duration_ms FROM visit_sessions WHERE session_id = ?`).get(sessionId) as { id: number; pages: number; duration_ms: number } | undefined;
  if (existing) {
    db.prepare(`UPDATE visit_sessions SET pages = pages + 1, updated_at = datetime('now') WHERE session_id = ?`).run(sessionId);
  } else {
    db.prepare(`INSERT INTO visit_sessions (session_id, user_id, first_page) VALUES (?, ?, ?)`).run(sessionId, userId, path);
  }
}

export function updateSessionDuration(sessionId: string, durationMs: number) {
  const db = getDb();
  db.prepare(`UPDATE visit_sessions SET duration_ms = ? WHERE session_id = ?`).run(durationMs, sessionId);
}

export function getAnalyticsStats() {
  const db = getDb();
  const today = new Date().toISOString().slice(0, 10);
  const totalViews = (db.prepare("SELECT COUNT(*) as c FROM page_views").get() as { c: number }).c;
  const todayViews = (db.prepare("SELECT COUNT(*) as c FROM page_views WHERE date(created_at) = ?").get(today) as { c: number }).c;
  const totalSessions = (db.prepare("SELECT COUNT(*) as c FROM visit_sessions").get() as { c: number }).c;
  const todaySessions = (db.prepare("SELECT COUNT(*) as c FROM visit_sessions WHERE date(created_at) = ?").get(today) as { c: number }).c;
  const avgDuration = (db.prepare("SELECT COALESCE(AVG(duration_ms), 0) as a FROM visit_sessions WHERE duration_ms > 0").get() as { a: number }).a;
  const avgPages = (db.prepare("SELECT COALESCE(AVG(pages), 0) as a FROM visit_sessions").get() as { a: number }).a;
  return { totalViews, todayViews, totalSessions, todaySessions, avgDuration: Math.round(avgDuration), avgPages: Math.round(avgPages * 10) / 10 };
}

export function getTopPages(limit = 20) {
  const db = getDb();
  return db.prepare(`
    SELECT path, COUNT(*) as views,
           COUNT(DISTINCT session_id) as unique_visitors
    FROM page_views
    GROUP BY path
    ORDER BY views DESC
    LIMIT ?
  `).all(limit);
}

export function getRecentVisits(limit = 50) {
  const db = getDb();
  return db.prepare(`
    SELECT pv.path, pv.created_at, vs.duration_ms, vs.pages,
           u.username, u.display_name
    FROM page_views pv
    LEFT JOIN visit_sessions vs ON pv.session_id = vs.session_id
    LEFT JOIN users u ON vs.user_id = u.id
    ORDER BY pv.created_at DESC
    LIMIT ?
  `).all(limit);
}

export function getDailyViews(days = 14) {
  const db = getDb();
  return db.prepare(`
    SELECT date(created_at) as date, COUNT(*) as views,
           COUNT(DISTINCT session_id) as visitors
    FROM page_views
    WHERE date(created_at) >= date('now', '-' || ? || ' days')
    GROUP BY date(created_at)
    ORDER BY date
  `).all(days);
}

/* ═══ BANNED IPS ═══ */

export function getBannedIps() {
  const db = getDb();
  return db.prepare(`
    SELECT b.id, b.ip, b.reason, b.created_at, u.username as banned_by_name
    FROM banned_ips b
    LEFT JOIN users u ON b.banned_by = u.id
    ORDER BY b.created_at DESC
  `).all();
}

export function banIp(ip: string, reason: string, bannedBy: number | null): boolean {
  const db = getDb();
  try {
    db.prepare(`INSERT OR IGNORE INTO banned_ips (ip, reason, banned_by) VALUES (?, ?, ?)`).run(ip, reason, bannedBy);
    return true;
  } catch { return false; }
}

export function unbanIp(ip: string): boolean {
  const db = getDb();
  try {
    db.prepare(`DELETE FROM banned_ips WHERE ip = ?`).run(ip);
    return true;
  } catch { return false; }
}

export function isIpBanned(ip: string): boolean {
  const db = getDb();
  return (db.prepare(`SELECT 1 FROM banned_ips WHERE ip = ?`).get(ip) as undefined | { 1: number }) !== undefined;
}

/* ═══ ADMIN CREATE USER ═══ */

export function adminCreateUser(username: string, email: string, password: string, displayName: string, role: string): DbUser | null {
  const db = getDb();
  try {
    const hash = hashPassword(password);
    const initials = (displayName || username).substring(0, 2).toUpperCase();
    const stmt = db.prepare(`
      INSERT INTO users (username, email, display_name, password_hash, avatar_type, avatar_value, avatar_color, role, email_verified)
      VALUES (?, ?, ?, ?, 'initials', ?, '#00d4ff', ?, 1)
    `);
    const result = stmt.run(username.toLowerCase().trim(), email.toLowerCase().trim(), displayName, hash, initials, role);
    db.prepare(`INSERT INTO user_settings (user_id) VALUES (?)`).run(result.lastInsertRowid);
    return getUserById(Number(result.lastInsertRowid));
  } catch { return null; }
}

/* ═══ CERTIFICATIONS ═══ */

export function createCertificationAttempt(userId: number, moduleId: string, score: number, maxScore: number, answers: Record<number, number>, passed: boolean) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO certification_attempts (user_id, module_id, score, max_score, answers, passed)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(userId, moduleId, score, maxScore, JSON.stringify(answers), passed ? 1 : 0);
  return { id: Number(result.lastInsertRowid), score, maxScore, passed };
}

export function getCertificationAttempt(attemptId: number) {
  const db = getDb();
  return db.prepare("SELECT * FROM certification_attempts WHERE id = ?").get(attemptId);
}

export function getCertificationAttempts(userId: number, moduleId: string) {
  const db = getDb();
  return db.prepare("SELECT * FROM certification_attempts WHERE user_id = ? AND module_id = ? ORDER BY created_at DESC").all(userId, moduleId);
}

export function createCertification(userId: number, moduleId: string, score: number, maxScore: number, stripeSessionId?: string) {
  const db = getDb();
  const verificationCode = crypto.randomBytes(8).toString("hex");
  try {
    const stmt = db.prepare(`
      INSERT INTO certifications (user_id, module_id, verification_code, score, max_score, stripe_session_id, paid)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(userId, moduleId, verificationCode, score, maxScore, stripeSessionId || "", stripeSessionId ? 1 : 0);
    return { verificationCode, score, maxScore };
  } catch {
    // Already certified for this module — update score if better
    try {
      db.prepare(`UPDATE certifications SET score = ?, max_score = ?, verification_code = ? WHERE user_id = ? AND module_id = ?`)
        .run(score, maxScore, verificationCode, userId, moduleId);
      return { verificationCode, score, maxScore };
    } catch { return null; }
  }
}

export function markCertificationPaid(stripeSessionId: string) {
  const db = getDb();
  const cert = db.prepare("SELECT * FROM certifications WHERE stripe_session_id = ?").get(stripeSessionId) as { id: number; user_id: number; module_id: string } | undefined;
  if (!cert) return null;
  db.prepare("UPDATE certifications SET paid = 1 WHERE id = ?").run(cert.id);
  return cert;
}

export function getCertificationByCode(code: string) {
  const db = getDb();
  return db.prepare(`
    SELECT c.*, u.username, u.display_name, u.email
    FROM certifications c
    JOIN users u ON c.user_id = u.id
    WHERE c.verification_code = ?
  `).get(code);
}

export function getUserCertifications(userId: number) {
  const db = getDb();
  return db.prepare("SELECT * FROM certifications WHERE user_id = ? ORDER BY issued_at DESC").all(userId);
}

export function getAllCertifications() {
  const db = getDb();
  return db.prepare(`
    SELECT c.*, u.username, u.display_name, u.email
    FROM certifications c
    JOIN users u ON c.user_id = u.id
    ORDER BY c.issued_at DESC
  `).all();
}
