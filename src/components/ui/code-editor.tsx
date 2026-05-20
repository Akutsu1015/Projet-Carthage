"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import type { OnMount } from "@monaco-editor/react";

const Monaco = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const MODULE_LANG: Record<string, string> = {
  frontend: "html",
  javascript: "javascript",
  react: "javascript",
  nodejs: "javascript",
  python: "python",
  cpp: "cpp",
  csharp: "csharp",
  dart: "dart",
};

interface Props {
  value: string;
  onChange: (v: string) => void;
  moduleId: string;
  onRun?: () => void;
  className?: string;
  minHeight?: number;
}

function EditorLoading() {
  return (
    <div className="flex h-full items-center justify-center text-xs text-white/30">
      Chargement...
    </div>
  );
}

export function CodeEditor({ value, onChange, moduleId, onRun, className, minHeight = 240 }: Props) {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const onRunRef = useRef(onRun);

  useEffect(() => {
    onRunRef.current = onRun;
  }, [onRun]);

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monaco.editor.defineTheme("carthage-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#0a0a14",
        "editor.foreground": "#e0e6f0",
        "editorLineNumber.foreground": "#3a3a55",
        "editorLineNumber.activeForeground": "#00d4ff",
        "editor.selectionBackground": "#1f3a5f",
        "editorCursor.foreground": "#00ff88",
        "editor.lineHighlightBackground": "#12121e",
      },
    });
    monaco.editor.setTheme("carthage-dark");
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRunRef.current?.();
    });
  };

  const language = MODULE_LANG[moduleId] || "plaintext";

  return (
    <div
      className={className}
      style={{ position: "relative", minHeight, height: minHeight, flex: "1 1 auto" }}
    >
      <div style={{ position: "absolute", inset: 0 }}>
        <Monaco
          height="100%"
          language={language}
          value={value}
          onChange={(v) => onChange(v ?? "")}
          onMount={handleMount}
          theme="vs-dark"
          loading={<EditorLoading />}
          options={{
            fontSize: 13,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            padding: { top: 10, bottom: 10 },
            tabSize: 2,
            insertSpaces: true,
            automaticLayout: true,
            renderLineHighlight: "line",
            wordWrap: "on",
            contextmenu: false,
            quickSuggestions: { other: true, comments: false, strings: false },
          }}
        />
      </div>
    </div>
  );
}
