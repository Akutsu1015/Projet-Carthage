/**
 * Socket.IO Battle Matchmaking Server
 * Runs alongside Next.js on a separate port (3002)
 * Handles: ranked/casual matchmaking queues, battle room sync, real-time events
 */

const { createServer } = require("http");
const { Server } = require("socket.io");
const Database = require("better-sqlite3");
const path = require("path");
const crypto = require("crypto");

const PORT = process.env.BATTLE_PORT || 3002;
const DB_PATH = path.join(__dirname, "data", "carthage.db");

// ═══ Database connection ═══
let db;
function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
  }
  return db;
}

// ═══ Auth helper: validate session token ═══
function getUserByToken(token) {
  if (!token) return null;
  const d = getDb();
  const session = d.prepare(
    "SELECT user_id FROM sessions WHERE token = ? AND expires_at > datetime('now')"
  ).get(token);
  if (!session) return null;
  return d.prepare(
    "SELECT id, username, display_name, avatar_type, avatar_value, avatar_color, level, ranked_points, battle_wins, battle_losses FROM users WHERE id = ?"
  ).get(session.user_id);
}

// ═══ Matchmaking queues ═══
// { ranked: { easy: [], medium: [], hard: [] }, casual: { easy: [], medium: [], hard: [] } }
const queues = {
  ranked: { easy: [], medium: [], hard: [] },
  casual: { easy: [], medium: [], hard: [] },
};

// Active battle rooms: battleId -> { players: [socket1, socket2], startedAt, ... }
const battleRooms = new Map();

// Socket -> user mapping
const socketUsers = new Map();

// ═══ Create HTTP + Socket.IO server ═══
const httpServer = createServer((req, res) => {
  // Health check endpoint
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      status: "ok",
      queues: {
        ranked: { easy: queues.ranked.easy.length, medium: queues.ranked.medium.length, hard: queues.ranked.hard.length },
        casual: { easy: queues.casual.easy.length, medium: queues.casual.medium.length, hard: queues.casual.hard.length },
      },
      rooms: battleRooms.size,
    }));
    return;
  }
  res.writeHead(404);
  res.end();
});

const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://gamematcher.fr",
      "https://www.gamematcher.fr",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingInterval: 10000,
  pingTimeout: 5000,
});

// ═══ Middleware: authenticate socket connections ═══
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Authentication required"));
  const user = getUserByToken(token);
  if (!user) return next(new Error("Invalid session"));
  socket.user = user;
  next();
});

// ═══ Helper: create battle in DB ═══
function createBattleInDb(creatorId, opponentId, mode, difficulty) {
  const d = getDb();
  // Pick random challenge for this difficulty
  const challenge = d.prepare(
    "SELECT * FROM battle_challenges WHERE difficulty = ? ORDER BY RANDOM() LIMIT 1"
  ).get(difficulty);
  if (!challenge) return null;

  const id = crypto.randomBytes(8).toString("hex");
  d.prepare(`
    INSERT INTO code_battles (id, challenge_id, creator_id, opponent_id, mode, difficulty, status, started_at)
    VALUES (?, ?, ?, ?, ?, ?, 'active', datetime('now'))
  `).run(id, challenge.id, creatorId, opponentId, mode, difficulty);

  return { id, challenge, battleId: id };
}

// ═══ Helper: remove user from all queues ═══
function removeFromQueues(socketId) {
  for (const mode of ["ranked", "casual"]) {
    for (const diff of ["easy", "medium", "hard"]) {
      queues[mode][diff] = queues[mode][diff].filter((e) => e.socketId !== socketId);
    }
  }
}

// ═══ Helper: try to match two players ═══
function tryMatch(mode, difficulty) {
  const queue = queues[mode][difficulty];
  if (queue.length < 2) return;

  // Match first two in queue
  const p1 = queue.shift();
  const p2 = queue.shift();

  // Create battle in DB
  const result = createBattleInDb(p1.user.id, p2.user.id, mode, difficulty);
  if (!result) {
    // Put them back
    queue.unshift(p2);
    queue.unshift(p1);
    return;
  }

  const { id: battleId, challenge } = result;
  const roomId = `battle:${battleId}`;

  // Join both sockets to room
  p1.socket.join(roomId);
  p2.socket.join(roomId);

  // Store room info
  battleRooms.set(battleId, {
    roomId,
    players: [p1, p2],
    startedAt: Date.now(),
    challenge,
  });

  // Notify both players
  const matchData = {
    battleId,
    mode,
    difficulty,
    challenge: {
      id: challenge.id,
      title: challenge.title,
      description: challenge.description,
      template: challenge.template,
      tests: JSON.parse(challenge.tests),
      time_limit: challenge.time_limit,
    },
    players: [
      { id: p1.user.id, displayName: p1.user.display_name, username: p1.user.username, avatarType: p1.user.avatar_type, avatarValue: p1.user.avatar_value, avatarColor: p1.user.avatar_color, level: p1.user.level, rankedPoints: p1.user.ranked_points },
      { id: p2.user.id, displayName: p2.user.display_name, username: p2.user.username, avatarType: p2.user.avatar_type, avatarValue: p2.user.avatar_value, avatarColor: p2.user.avatar_color, level: p2.user.level, rankedPoints: p2.user.ranked_points },
    ],
  };

  p1.socket.emit("match-found", matchData);
  p2.socket.emit("match-found", matchData);

  console.log(`[MATCH] ${mode}/${difficulty}: ${p1.user.display_name} vs ${p2.user.display_name} → battle ${battleId}`);
}

// ═══ Socket event handlers ═══
io.on("connection", (socket) => {
  const user = socket.user;
  socketUsers.set(socket.id, user);
  console.log(`[CONNECT] ${user.display_name} (${user.id})`);

  // ─── Join matchmaking queue ───
  socket.on("queue-join", ({ mode, difficulty }) => {
    if (!["ranked", "casual"].includes(mode)) return;
    if (!["easy", "medium", "hard"].includes(difficulty)) return;

    // Remove from any existing queue first
    removeFromQueues(socket.id);

    const entry = { socketId: socket.id, socket, user, joinedAt: Date.now() };
    queues[mode][difficulty].push(entry);

    socket.emit("queue-joined", {
      mode,
      difficulty,
      position: queues[mode][difficulty].length,
      queueSize: queues[mode][difficulty].length,
    });

    console.log(`[QUEUE] ${user.display_name} joined ${mode}/${difficulty} (${queues[mode][difficulty].length} in queue)`);

    // Try to match immediately
    tryMatch(mode, difficulty);
  });

  // ─── Leave matchmaking queue ───
  socket.on("queue-leave", () => {
    removeFromQueues(socket.id);
    socket.emit("queue-left");
    console.log(`[QUEUE] ${user.display_name} left queue`);
  });

  // ─── Get queue status ───
  socket.on("queue-status", () => {
    socket.emit("queue-info", {
      ranked: { easy: queues.ranked.easy.length, medium: queues.ranked.medium.length, hard: queues.ranked.hard.length },
      casual: { easy: queues.casual.easy.length, medium: queues.casual.medium.length, hard: queues.casual.hard.length },
    });
  });

  // ─── Join battle room (for friends mode or reconnect) ───
  socket.on("battle-join", ({ battleId }) => {
    const roomId = `battle:${battleId}`;
    socket.join(roomId);
    socket.emit("battle-joined", { battleId });
  });

  // ─── Submit solution in battle (relay only, no DB writes) ───
  socket.on("battle-submit", ({ battleId, timeMs, passed }) => {
    const roomId = `battle:${battleId}`;
    if (passed) {
      // Notify opponent that this player finished
      socket.to(roomId).emit("opponent-submitted", {
        userId: user.id,
        displayName: user.display_name,
        timeMs,
      });
      console.log(`[SUBMIT] ${user.display_name} submitted battle ${battleId} in ${timeMs}ms`);
    }
  });

  // ─── Relay battle-finished from API to socket room ───
  socket.on("battle-finished-relay", ({ battleId, winnerId, loserId, rankedDelta, mode, forfeit }) => {
    const roomId = `battle:${battleId}`;
    io.to(roomId).emit("battle-finished", {
      battleId,
      winnerId,
      loserId,
      rankedDelta: rankedDelta || 0,
      mode,
      forfeit: !!forfeit,
    });
    battleRooms.delete(battleId);
    console.log(`[FINISH] Battle ${battleId}: winner=${winnerId} forfeit=${!!forfeit}`);
  });

  // ─── Player gave up (relay only, no DB writes) ───
  socket.on("battle-forfeit", ({ battleId }) => {
    // Just log — the actual forfeit is handled by the API
    // The client calls the API which does the DB write, then emits battle-finished-relay
    console.log(`[FORFEIT] ${user.display_name} forfeiting battle ${battleId} (handled by API)`);
  });

  // ─── Disconnect ───
  socket.on("disconnect", () => {
    removeFromQueues(socket.id);
    socketUsers.delete(socket.id);
    console.log(`[DISCONNECT] ${user.display_name}`);
  });
});

// ═══ Periodic queue status broadcast ═══
setInterval(() => {
  io.emit("queue-info", {
    ranked: { easy: queues.ranked.easy.length, medium: queues.ranked.medium.length, hard: queues.ranked.hard.length },
    casual: { easy: queues.casual.easy.length, medium: queues.casual.medium.length, hard: queues.casual.hard.length },
  });
}, 5000);

// ═══ Start server ═══
httpServer.listen(PORT, () => {
  console.log(`⚔️  Battle Server running on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
});
