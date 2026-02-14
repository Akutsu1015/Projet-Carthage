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
  try { db.exec(`ALTER TABLE users ADD COLUMN ranked_points INTEGER DEFAULT 1000`); } catch {}
  try { db.exec(`ALTER TABLE users ADD COLUMN battle_wins INTEGER DEFAULT 0`); } catch {}
  try { db.exec(`ALTER TABLE users ADD COLUMN battle_losses INTEGER DEFAULT 0`); } catch {}

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

export function updateLastLogin(userId: number): void {
  const db = getDb();
  db.prepare("UPDATE users SET last_login = datetime('now') WHERE id = ?").run(userId);
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
  try { db.exec(`ALTER TABLE code_battles ADD COLUMN mode TEXT NOT NULL DEFAULT 'casual'`); } catch {}
  try { db.exec(`ALTER TABLE code_battles ADD COLUMN difficulty TEXT NOT NULL DEFAULT 'easy'`); } catch {}
  try { db.exec(`ALTER TABLE code_battles ADD COLUMN ranked_delta INTEGER DEFAULT 0`); } catch {}
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

export function submitBattleSolution(battleId: string, userId: number, code: string, timeMs: number): CodeBattle | null {
  const db = getDb();
  const battle = db.prepare("SELECT * FROM code_battles WHERE id = ?").get(battleId) as CodeBattle | null;
  if (!battle || battle.status !== "active") return null;

  // Save the submission
  if (userId === battle.creator_id) {
    db.prepare("UPDATE code_battles SET creator_code = ?, creator_time = ? WHERE id = ?").run(code, timeMs, battleId);
  } else if (userId === battle.opponent_id) {
    db.prepare("UPDATE code_battles SET opponent_code = ?, opponent_time = ? WHERE id = ?").run(code, timeMs, battleId);
  } else return null;

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
  bronze:    { name: "Bronze",    color: "#cd7f32", icon: "🥉", minPromote: 3, maxDemote: 0 },
  silver:    { name: "Argent",    color: "#c0c0c0", icon: "🥈", minPromote: 3, maxDemote: 3 },
  gold:      { name: "Or",        color: "#ffd700", icon: "🥇", minPromote: 3, maxDemote: 3 },
  platinum:  { name: "Platine",   color: "#00d4ff", icon: "💎", minPromote: 3, maxDemote: 3 },
  diamond:   { name: "Diamant",   color: "#a855f7", icon: "💠", minPromote: 3, maxDemote: 3 },
  master:    { name: "Maître",    color: "#ff2244", icon: "🔥", minPromote: 3, maxDemote: 3 },
  legendary: { name: "Légendaire",color: "#fbbf24", icon: "👑", minPromote: 0, maxDemote: 3 },
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

  return {
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
    createdAt: user.created_at,
    lastLogin: user.last_login,
  };
}
