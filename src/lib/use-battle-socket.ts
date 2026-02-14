"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

const BATTLE_SERVER_URL = typeof window !== "undefined"
  ? (window.location.hostname === "localhost"
    ? "http://localhost:3002"
    : "https://gamematcher.fr")
  : "";

export type QueueInfo = {
  ranked: { easy: number; medium: number; hard: number };
  casual: { easy: number; medium: number; hard: number };
};

export type MatchData = {
  battleId: string;
  mode: string;
  difficulty: string;
  challenge: {
    id: number;
    title: string;
    description: string;
    template: string;
    tests: { input: string; expected: string }[];
    time_limit: number;
  };
  players: {
    id: number;
    displayName: string;
    username: string;
    avatarType: string;
    avatarValue: string;
    avatarColor: string;
    level: number;
    rankedPoints: number;
  }[];
};

export type BattleFinished = {
  battleId: string;
  winnerId: number;
  loserId: number;
  creatorTime?: number;
  opponentTime?: number;
  rankedDelta: number;
  mode: string;
  forfeit?: boolean;
};

export function useBattleSocket(sessionToken?: string | null) {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [inQueue, setInQueue] = useState(false);
  const [queueMode, setQueueMode] = useState<string | null>(null);
  const [queueDifficulty, setQueueDifficulty] = useState<string | null>(null);
  const [queueInfo, setQueueInfo] = useState<QueueInfo | null>(null);
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [battleFinished, setBattleFinished] = useState<BattleFinished | null>(null);
  const [opponentSubmitted, setOpponentSubmitted] = useState<{ userId: number; displayName: string; timeMs: number } | null>(null);
  const [token, setToken] = useState<string | null>(sessionToken ?? null);

  // Fetch session token from API (httpOnly cookie can't be read client-side)
  useEffect(() => {
    if (token) return;
    fetch("/api/db/battle-token", { credentials: "include" })
      .then(r => r.json())
      .then(d => { if (d.success && d.token) setToken(d.token); })
      .catch(() => {});
  }, [token]);

  useEffect(() => {
    if (!token) return;

    const socket = io(BATTLE_SERVER_URL, {
      path: "/battle-ws/socket.io",
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => { setConnected(false); setInQueue(false); });

    socket.on("queue-joined", (data) => {
      setInQueue(true);
      setQueueMode(data.mode);
      setQueueDifficulty(data.difficulty);
    });

    socket.on("queue-left", () => {
      setInQueue(false);
      setQueueMode(null);
      setQueueDifficulty(null);
    });

    socket.on("queue-info", (info: QueueInfo) => setQueueInfo(info));

    socket.on("match-found", (data: MatchData) => {
      setInQueue(false);
      setMatchData(data);
      setBattleFinished(null);
      setOpponentSubmitted(null);
    });

    socket.on("opponent-submitted", (data) => setOpponentSubmitted(data));

    socket.on("battle-finished", (data: BattleFinished) => setBattleFinished(data));

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  const joinQueue = useCallback((mode: string, difficulty: string) => {
    socketRef.current?.emit("queue-join", { mode, difficulty });
  }, []);

  const leaveQueue = useCallback(() => {
    socketRef.current?.emit("queue-leave");
    setInQueue(false);
  }, []);

  const submitSolution = useCallback((battleId: string, code: string, timeMs: number, passed: boolean) => {
    socketRef.current?.emit("battle-submit", { battleId, code, timeMs, passed });
  }, []);

  const forfeit = useCallback((battleId: string) => {
    socketRef.current?.emit("battle-forfeit", { battleId });
  }, []);

  const joinBattleRoom = useCallback((battleId: string) => {
    socketRef.current?.emit("battle-join", { battleId });
  }, []);

  const relayFinish = useCallback((data: { battleId: string; winnerId: number; loserId: number; rankedDelta: number; mode: string; forfeit?: boolean }) => {
    socketRef.current?.emit("battle-finished-relay", data);
  }, []);

  const resetMatch = useCallback(() => {
    setMatchData(null);
    setBattleFinished(null);
    setOpponentSubmitted(null);
  }, []);

  return {
    connected,
    inQueue,
    queueMode,
    queueDifficulty,
    queueInfo,
    matchData,
    battleFinished,
    opponentSubmitted,
    joinQueue,
    leaveQueue,
    submitSolution,
    forfeit,
    joinBattleRoom,
    relayFinish,
    resetMatch,
  };
}
