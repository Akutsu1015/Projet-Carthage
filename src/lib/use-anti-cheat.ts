"use client";

import { useEffect, useRef, useCallback, useState } from "react";

export interface AntiCheatFlags {
  tabSwitches: number;
  pasteCount: number;
  largePastes: number;
  suspiciousSpeed: boolean;
  devToolsOpened: boolean;
  flagged: boolean;
  flags: string[];
}

const LARGE_PASTE_THRESHOLD = 50; // chars pasted at once considered suspicious
const MIN_SOLVE_TIME_MS = 5000;   // solving in <5s is suspicious
const MAX_TAB_SWITCHES = 5;       // more than 5 tab switches = flagged
const MAX_LARGE_PASTES = 2;       // more than 2 large pastes = flagged

export function useAntiCheat(active: boolean) {
  const [flags, setFlags] = useState<AntiCheatFlags>({
    tabSwitches: 0,
    pasteCount: 0,
    largePastes: 0,
    suspiciousSpeed: false,
    devToolsOpened: false,
    flagged: false,
    flags: [],
  });

  const tabSwitchRef = useRef(0);
  const pasteCountRef = useRef(0);
  const largePasteRef = useRef(0);
  const devToolsRef = useRef(false);
  const startTimeRef = useRef(Date.now());

  // Reset on activation
  useEffect(() => {
    if (active) {
      tabSwitchRef.current = 0;
      pasteCountRef.current = 0;
      largePasteRef.current = 0;
      devToolsRef.current = false;
      startTimeRef.current = Date.now();
      setFlags({
        tabSwitches: 0, pasteCount: 0, largePastes: 0,
        suspiciousSpeed: false, devToolsOpened: false,
        flagged: false, flags: [],
      });
    }
  }, [active]);

  // Detect tab/window switching
  useEffect(() => {
    if (!active) return;

    const handleVisibility = () => {
      if (document.hidden) {
        tabSwitchRef.current++;
        updateFlags();
      }
    };

    const handleBlur = () => {
      tabSwitchRef.current++;
      updateFlags();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
    };
  }, [active]);

  // Detect paste events
  useEffect(() => {
    if (!active) return;

    const handlePaste = (e: ClipboardEvent) => {
      pasteCountRef.current++;
      const text = e.clipboardData?.getData("text") || "";
      if (text.length >= LARGE_PASTE_THRESHOLD) {
        largePasteRef.current++;
      }
      updateFlags();
    };

    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [active]);

  // Detect DevTools via resize heuristic + debugger timing
  useEffect(() => {
    if (!active) return;

    const checkDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;
      if (widthThreshold || heightThreshold) {
        if (!devToolsRef.current) {
          devToolsRef.current = true;
          updateFlags();
        }
      }
    };

    const interval = setInterval(checkDevTools, 2000);
    return () => clearInterval(interval);
  }, [active]);

  // Prevent right-click context menu during battle
  useEffect(() => {
    if (!active) return;
    const handler = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", handler);
    return () => document.removeEventListener("contextmenu", handler);
  }, [active]);

  const updateFlags = useCallback(() => {
    const flagList: string[] = [];

    if (tabSwitchRef.current > MAX_TAB_SWITCHES) {
      flagList.push("tab_switching");
    }
    if (largePasteRef.current > MAX_LARGE_PASTES) {
      flagList.push("copy_paste");
    }
    if (devToolsRef.current) {
      flagList.push("devtools");
    }

    setFlags({
      tabSwitches: tabSwitchRef.current,
      pasteCount: pasteCountRef.current,
      largePastes: largePasteRef.current,
      suspiciousSpeed: false,
      devToolsOpened: devToolsRef.current,
      flagged: flagList.length > 0,
      flags: flagList,
    });
  }, []);

  // Check speed at submission time
  const checkSubmitSpeed = useCallback(() => {
    const elapsed = Date.now() - startTimeRef.current;
    const isSuspicious = elapsed < MIN_SOLVE_TIME_MS;

    const flagList: string[] = [];
    if (tabSwitchRef.current > MAX_TAB_SWITCHES) flagList.push("tab_switching");
    if (largePasteRef.current > MAX_LARGE_PASTES) flagList.push("copy_paste");
    if (devToolsRef.current) flagList.push("devtools");
    if (isSuspicious) flagList.push("speed_hack");

    const finalFlags: AntiCheatFlags = {
      tabSwitches: tabSwitchRef.current,
      pasteCount: pasteCountRef.current,
      largePastes: largePasteRef.current,
      suspiciousSpeed: isSuspicious,
      devToolsOpened: devToolsRef.current,
      flagged: flagList.length > 0,
      flags: flagList,
    };

    setFlags(finalFlags);
    return finalFlags;
  }, []);

  return { flags, checkSubmitSpeed };
}
