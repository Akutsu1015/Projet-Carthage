"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import {
    parseLevel, parseCode, executeStep,
    type GameState, type HeroId,
} from "@/lib/lyoko-engine";
import { LYOKO_LEVELS, CHAPTERS } from "@/lib/lyoko-levels";
import { useSound } from "@/lib/sound-manager";
import LyokoStage3D from "./lyoko-stage-3d";
import FranzCodePlayer from "@/components/franzcode-player";
import { motion, AnimatePresence } from "framer-motion";

// Update v2.0 - Forced Cache Bust
// ═══════════════ STYLES (CODE LYOKO SUPERCOMPUTER) ═══════════════

const lyokoTheme = {
    bg: "#021206", // Deep oceanic green-black
    gridLines: "rgba(0, 255, 102, 0.15)",
    borderPrimary: "#00ff66", // The iconic pure green
    borderHighlight: "#ffaa00", // The active/warning orange 
    borderAlert: "#ff2244", // XANA red
    textPrimary: "#e0ffe0", // Pale green text
    textCyan: "#00d4ff", // Less used, mainly for Lyoko world elements
    panelBg: "rgba(0, 20, 10, 0.95)", // Solid dark green panels (no blur)
};

const styles = {
    wrapper: {
        display: "flex",
        flexDirection: "column" as const,
        height: "100vh",
        backgroundColor: lyokoTheme.bg,
        backgroundImage: `linear-gradient(${lyokoTheme.gridLines} 1px, transparent 1px), linear-gradient(90deg, ${lyokoTheme.gridLines} 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
        color: lyokoTheme.textPrimary,
        fontFamily: "'Share Tech Mono', 'Fira Code', monospace", // Technical font
        overflow: "hidden",
    },
    topBar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 24px",
        background: lyokoTheme.panelBg,
        borderBottom: `2px solid ${lyokoTheme.borderPrimary}`,
        gap: "12px",
        flexShrink: 0,
        boxShadow: `0 0 15px ${lyokoTheme.gridLines}`,
    },
    topBarLeft: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
    },
    backBtn: {
        background: "transparent",
        border: `1px solid ${lyokoTheme.borderHighlight}`,
        color: lyokoTheme.borderHighlight,
        padding: "6px 14px",
        cursor: "pointer",
        fontSize: "14px",
        textTransform: "uppercase" as const,
        fontWeight: "bold",
        transition: "all 0.1s",
    },
    levelTitle: {
        fontSize: "18px",
        fontWeight: 700,
        color: lyokoTheme.borderPrimary,
        textTransform: "uppercase" as const,
        letterSpacing: "1px",
    },
    chapterBadge: {
        padding: "4px 12px",
        border: `1px solid ${lyokoTheme.borderPrimary}`,
        color: lyokoTheme.borderPrimary,
        fontSize: "12px",
        fontWeight: "bold",
        textTransform: "uppercase" as const,
        backgroundColor: "rgba(0, 255, 102, 0.1)",
    },
    main: {
        display: "flex",
        flex: 1,
        overflow: "hidden",
        padding: "16px",
        gap: "16px",
    },
    // Left panel = game canvas
    leftPanel: {
        display: "flex",
        flexDirection: "column" as const,
        width: "50%",
        border: `2px solid ${lyokoTheme.borderHighlight}`, // Orange border for the active 3D window
        background: "#000",
        position: "relative" as const,
    },
    windowHeader: {
        background: lyokoTheme.borderHighlight,
        color: "#000",
        padding: "4px 12px",
        fontSize: "12px",
        fontWeight: "bold",
        textTransform: "uppercase" as const,
        display: "flex",
        justifyContent: "space-between",
        letterSpacing: "0.5px", // Added to force CSS rebuild
    },
    canvasWrap: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative" as const,
    },
    gameControls: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        padding: "16px",
        borderTop: `1px solid ${lyokoTheme.borderHighlight}`,
        background: lyokoTheme.panelBg,
    },
    btnPrimary: {
        background: lyokoTheme.borderPrimary,
        color: "#000",
        border: `2px solid ${lyokoTheme.borderPrimary}`,
        padding: "8px 24px",
        fontWeight: "bold",
        textTransform: "uppercase" as const,
        cursor: "pointer",
        fontSize: "14px",
        transition: "background 0.1s",
        fontFamily: "inherit",
    },
    btnSecondary: {
        background: "transparent",
        color: lyokoTheme.borderPrimary,
        border: `2px solid ${lyokoTheme.borderPrimary}`,
        padding: "8px 16px",
        textTransform: "uppercase" as const,
        fontWeight: "bold",
        cursor: "pointer",
        fontSize: "13px",
        transition: "all 0.1s",
        fontFamily: "inherit",
    },
    btnSuccess: {
        background: "#fff",
        color: "#000",
        border: "2px solid #fff",
        padding: "8px 24px",
        fontWeight: "bold",
        textTransform: "uppercase" as const,
        cursor: "pointer",
        fontSize: "14px",
        fontFamily: "inherit",
        boxShadow: "0 0 10px #fff",
    },
    // Right panel = code editor
    rightPanel: {
        display: "flex",
        flexDirection: "column" as const,
        width: "50%",
        gap: "16px",
    },
    // Story / Mission Box
    storyBox: {
        padding: "16px",
        background: lyokoTheme.panelBg,
        border: `2px solid ${lyokoTheme.borderPrimary}`,
        fontSize: "14px",
        lineHeight: 1.6,
        maxHeight: "120px",
        overflow: "auto",
        flexShrink: 0,
        position: "relative" as const,
    },
    storyHeader: {
        color: lyokoTheme.borderPrimary,
        fontSize: "10px",
        textTransform: "uppercase" as const,
        marginBottom: "8px",
        opacity: 0.8,
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    objectivesBox: {
        padding: "12px",
        background: lyokoTheme.panelBg,
        border: `1px solid ${lyokoTheme.gridLines}`,
        display: "flex",
        gap: "8px",
        flexWrap: "wrap" as const,
        flexShrink: 0,
    },
    objectiveTag: {
        padding: "4px 12px",
        border: `1px solid rgba(255,255,255,0.2)`,
        fontSize: "12px",
        textTransform: "uppercase" as const,
        fontWeight: "bold",
    },
    editorArea: {
        flex: 1,
        display: "flex",
        flexDirection: "column" as const,
        background: lyokoTheme.panelBg,
        border: `2px solid ${lyokoTheme.borderPrimary}`,
    },
    editorLabel: {
        padding: "6px 16px",
        background: lyokoTheme.borderPrimary,
        color: "#000",
        fontSize: "12px",
        fontWeight: "bold",
        textTransform: "uppercase" as const,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexShrink: 0,
    },
    textarea: {
        flex: 1,
        background: "transparent",
        color: lyokoTheme.textPrimary,
        border: "none",
        padding: "16px",
        fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', monospace",
        fontSize: "16px",
        lineHeight: 1.5,
        resize: "none" as const,
        outline: "none",
        tabSize: 4,
        width: "100%",
    },
    consoleBox: {
        borderTop: `2px dashed ${lyokoTheme.gridLines}`,
        padding: "12px 16px",
        height: "160px",
        overflow: "auto",
        background: "#000", // Pure black for console
        fontFamily: "'Fira Code', monospace",
        fontSize: "13px",
        lineHeight: 1.4,
        flexShrink: 0,
    },
    consoleLine: {
        color: lyokoTheme.borderPrimary,
        margin: 0,
    },
    commandsHelp: {
        padding: "12px",
        borderTop: `1px solid ${lyokoTheme.gridLines}`,
        display: "flex",
        gap: "8px",
        flexWrap: "wrap" as const,
        fontSize: "12px",
        flexShrink: 0,
        background: lyokoTheme.panelBg,
    },
    cmdTag: {
        padding: "4px 8px",
        border: `1px solid ${lyokoTheme.borderHighlight}`,
        color: lyokoTheme.borderHighlight,
        fontFamily: "monospace",
        textTransform: "uppercase" as const,
    },
    // Modals
    overlay: {
        position: "fixed" as const,
        inset: 0,
        background: "rgba(0,0,0,0.9)", // Dark, not blurry
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        backgroundImage: `linear-gradient(${lyokoTheme.gridLines} 2px, transparent 2px), linear-gradient(90deg, ${lyokoTheme.gridLines} 2px, transparent 2px)`,
        backgroundSize: "60px 60px",
    },
    levelSelector: {
        background: lyokoTheme.panelBg,
        padding: "32px",
        maxWidth: "800px",
        width: "90%",
        maxHeight: "85vh",
        overflow: "auto",
        border: `4px solid ${lyokoTheme.borderPrimary}`,
        boxShadow: `0 0 30px ${lyokoTheme.gridLines}`,
    },
    chapterTitle: {
        fontSize: "20px",
        fontWeight: "bold",
        marginBottom: "16px",
        marginTop: "32px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        textTransform: "uppercase" as const,
        color: lyokoTheme.borderHighlight,
        borderBottom: `2px solid ${lyokoTheme.borderHighlight}`,
        paddingBottom: "8px",
    },
    levelBtn: {
        padding: "12px 16px",
        border: `1px solid rgba(0, 255, 102, 0.3)`,
        background: "transparent",
        color: lyokoTheme.textPrimary,
        cursor: "pointer",
        textAlign: "left" as const,
        width: "100%",
        marginBottom: "8px",
        fontSize: "14px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        textTransform: "uppercase" as const,
        fontFamily: "inherit",
    },
    levelBtnCompleted: {
        borderColor: lyokoTheme.borderPrimary,
        background: "rgba(0, 255, 102, 0.15)",
    },
    levelBtnCurrent: {
        borderColor: lyokoTheme.borderHighlight,
        background: "rgba(255, 170, 0, 0.15)",
        boxShadow: `0 0 10px rgba(255, 170, 0, 0.3)`,
    },
    levelNum: {
        width: "32px",
        height: "32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        fontSize: "14px",
        flexShrink: 0,
        border: `1px solid rgba(0,255,102,0.5)`,
    },
};

// ═══════════════ JÉRÉMIE INTRO ═══════════════

const JEREMIE_SCRIPT = [
    {
        text: "Brice… tu es là ? Ne perdons pas de temps. XANA vient d'activer une tour dans le Secteur Forêt. Ses programmes ennemis envahissent Lyoko.",
        sub: "Contact établi — Jérémie Belpois, Superordinateur",
    },
    {
        text: "Pour reprogrammer la tour et stopper XANA, tu dois utiliser les commandes de déplacement. Mon superordinateur traduit ton code JavaScript directement en ordres pour nos guerriers sur Lyoko.",
        sub: "Protocole de virtualisation actif",
    },
    {
        text: "Voici comment ça marche : utilise les fonctions disponibles — avancer(), tournerGauche(), tournerDroite() — et enchaîne-les pour atteindre la tour. Tu peux aussi inclure des boucles !",
        sub: "Manuel de combat — Lyoko v4.2",
    },
    {
        text: "XANA se renforce de seconde en seconde. Code ton programme, exécute-le, et analyse les résultats en console. Le monde réel en dépend. Bonne chance… Jérémie, terminé.",
        sub: "⚡ Alerte : tour activée — niveau d'urgence CRITIQUE",
    },
];

function JeremieIntro({ onDone }: { onDone: () => void }) {
    const [step, setStep] = useState(0);
    const [displayed, setDisplayed] = useState("");
    const [done, setDone] = useState(false);

    // Typewriter effect
    useEffect(() => {
        setDisplayed("");
        setDone(false);
        const full = JEREMIE_SCRIPT[step].text;
        let i = 0;
        const iv = setInterval(() => {
            if (i < full.length) {
                setDisplayed(full.slice(0, i + 1));
                i++;
            } else {
                clearInterval(iv);
                setDone(true);
            }
        }, 22);
        return () => clearInterval(iv);
    }, [step]);

    const next = () => {
        if (!done) { setDisplayed(JEREMIE_SCRIPT[step].text); setDone(true); return; }
        if (step < JEREMIE_SCRIPT.length - 1) setStep(s => s + 1);
        else onDone();
    };

    const current = JEREMIE_SCRIPT[step];
    const isLast = step === JEREMIE_SCRIPT.length - 1;

    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.92)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            backdropFilter: "blur(6px)",
        }}>
            {/* Scanlines overlay */}
            <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,100,0.03) 2px, rgba(0,255,100,0.03) 4px)",
            }} />

            <div style={{
                maxWidth: "780px", width: "90%", position: "relative",
            }}>
                {/* Top bar — Code Lyoko style terminal */}
                <div style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    marginBottom: "20px",
                    padding: "8px 16px",
                    background: "rgba(0,20,10,0.9)",
                    border: "1px solid #00ff66",
                    borderRadius: "8px 8px 0 0",
                }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff4444", boxShadow: "0 0 6px #ff4444" }} />
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ffaa00", boxShadow: "0 0 6px #ffaa00" }} />
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00ff66", boxShadow: "0 0 6px #00ff66" }} />
                    <span style={{ marginLeft: "8px", color: "#00ff66", fontSize: "12px", fontFamily: "monospace", opacity: 0.7 }}>
                        SUPERORDINATEUR :: CONNEXION SÉCURISÉE — LYOKO
                    </span>
                    <button
                        onClick={onDone}
                        style={{
                            marginLeft: "auto", background: "none",
                            border: "none", color: "rgba(255,255,255,0.3)",
                            cursor: "pointer", fontSize: "11px",
                        }}
                    >
                        Passer l&apos;intro ›
                    </button>
                </div>

                {/* Main dialogue box */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                    }}
                    style={{
                        background: "rgba(0,15,6,0.98)",
                        border: "1px solid #00ff66",
                        borderTop: "none",
                        borderRadius: "0 0 8px 8px",
                        padding: "28px 32px 24px",
                        boxShadow: "0 0 40px rgba(0,255,100,0.15)",
                    }}>
                    {/* Character row */}
                    <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
                        {/* Jérémie portrait */}
                        <div style={{
                            flexShrink: 0,
                            width: "90px", textAlign: "center",
                        }}>
                            <div style={{
                                width: "80px", height: "80px",
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #001a08 60%, #003311)",
                                border: "2px solid #00ff66",
                                boxShadow: "0 0 16px rgba(0,255,100,0.4)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "36px",
                                margin: "0 auto 8px",
                                animation: "jeremiePulse 2s ease-in-out infinite",
                            }}>
                                🧑‍💻
                            </div>
                            <div style={{ color: "#00ff66", fontSize: "12px", fontWeight: 700 }}>JÉRÉMIE</div>
                            <div style={{ color: "rgba(0,255,100,0.5)", fontSize: "10px" }}>Superordinateur</div>
                            {/* Progress dots */}
                            <div style={{ display: "flex", gap: "4px", justifyContent: "center", marginTop: "12px" }}>
                                {JEREMIE_SCRIPT.map((_, i) => (
                                    <div key={i} style={{
                                        width: "6px", height: "6px", borderRadius: "50%",
                                        background: i === step ? "#00ff66" : i < step ? "rgba(0,255,100,0.35)" : "rgba(255,255,255,0.1)",
                                        boxShadow: i === step ? "0 0 8px #00ff66" : "none",
                                        transition: "all 0.3s",
                                    }} />
                                ))}
                            </div>
                        </div>

                        {/* Dialogue */}
                        <div style={{ flex: 1 }}>
                            <div style={{
                                color: "#e8ffe8",
                                fontSize: "16px",
                                lineHeight: 1.7,
                                minHeight: "96px",
                                fontStyle: "italic",
                                letterSpacing: "0.01em",
                            }}>
                                &ldquo;{displayed}{!done && <span style={{ borderRight: "2px solid #00ff66", animation: "cursorBlink 0.7s steps(1) infinite", marginLeft: "1px" }}>&nbsp;</span>}&rdquo;
                            </div>
                            <div style={{
                                marginTop: "12px",
                                color: "rgba(0,255,100,0.5)",
                                fontSize: "11px",
                                fontFamily: "monospace",
                                borderLeft: "2px solid rgba(0,255,100,0.3)",
                                paddingLeft: "8px",
                            }}>
                                {current.sub}
                            </div>
                        </div>
                    </div>

                    {/* Action button */}
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
                        <button
                            onClick={next}
                            style={{
                                padding: "10px 28px",
                                background: done ? "rgba(0,255,100,0.15)" : "transparent",
                                border: `1px solid ${done ? "#00ff66" : "rgba(0,255,100,0.3)"}`,
                                color: done ? "#00ff66" : "rgba(0,255,100,0.4)",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "14px",
                                fontWeight: 600,
                                transition: "all 0.2s",
                                boxShadow: done ? "0 0 16px rgba(0,255,100,0.2)" : "none",
                            }}
                        >
                            {isLast && done ? "🚀 Commencer la mission" : done ? "Suivant →" : "..."}
                        </button>
                    </div>
                </motion.div>

                {/* Decorative scanner line */}
                <div style={{
                    position: "absolute", top: 0, left: 0, right: 0,
                    height: "2px",
                    background: "linear-gradient(90deg, transparent 0%, #00ff66 50%, transparent 100%)",
                    opacity: 0.6,
                    animation: "scanLine 3s linear infinite",
                }} />
            </div>

            <style>{`
                @keyframes cursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }
                @keyframes jeremiePulse { 0%,100%{box-shadow:0 0 16px rgba(0,255,100,0.4)} 50%{box-shadow:0 0 32px rgba(0,255,100,0.8)} }
                @keyframes scanLine { 0%{top:0} 100%{top:100%} }
            `}</style>
        </div>
    );
}

// ═══════════════ VICTORY OVERLAY ═══════════════

function VictoryOverlay({ onNext, onRestart }: { onNext: () => void; onRestart: () => void }) {
    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 9998,
            background: "rgba(0,10,2,0.85)",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(8px)",
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                style={{
                    background: "rgba(0,20,10,0.95)",
                    border: "2px solid #00ff88",
                    borderRadius: "16px",
                    padding: "40px",
                    textAlign: "center" as const,
                    boxShadow: "0 0 60px rgba(0,255,136,0.4)",
                    maxWidth: "420px",
                    width: "90%",
                }}>
                <div style={{ fontSize: "70px", marginBottom: "24px", animation: "bounce 2s infinite" }}>🏆</div>
                <h2 style={{ color: "#00ff88", fontSize: "32px", margin: "0 0 12px", fontWeight: 900, letterSpacing: "1px" }}>TOUR DÉSACTIVÉE</h2>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "17px", marginBottom: "36px", lineHeight: 1.6 }}>
                    Excellent travail ! Le code est purifié et XANA a perdu le contrôle de ce secteur.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <button
                        onClick={onNext}
                        style={{
                            padding: "16px",
                            background: "linear-gradient(135deg, #00ff88, #00cc66)",
                            color: "#000",
                            border: "none",
                            borderRadius: "12px",
                            fontWeight: 800,
                            fontSize: "18px",
                            cursor: "pointer",
                            boxShadow: "0 0 25px rgba(0,255,136,0.5)",
                            transition: "transform 0.2s, box-shadow 0.2s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.03)"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
                    >
                        Niveau Suivant →
                    </button>
                    <button
                        onClick={onRestart}
                        style={{
                            padding: "12px",
                            background: "rgba(255,255,255,0.06)",
                            color: "rgba(255,255,255,0.7)",
                            border: "1px solid rgba(255,255,255,0.15)",
                            borderRadius: "12px",
                            fontSize: "15px",
                            cursor: "pointer",
                            transition: "all 0.2s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "white"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
                    >
                        🔄 Rejouer le niveau
                    </button>
                </div>
            </motion.div>
            <style>{`
               @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
           `}</style>
        </div>
    );
}

// ═══════════════ DEVELOPMENT LOCK ═══════════════

function DevelopmentLock({ onUnlock }: { onUnlock: () => void }) {
    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 10000,
            background: "rgba(0,0,0,0.95)",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(20px)",
        }}>
            <div style={{
                background: "rgba(40,0,5,0.9)",
                border: "2px solid #ff0044",
                borderRadius: "16px",
                padding: "40px",
                textAlign: "center" as const,
                boxShadow: "0 0 60px rgba(255,0,68,0.3)",
                maxWidth: "500px",
                width: "90%",
                position: "relative",
                overflow: "hidden",
            }}>
                {/* XANA Eye background deco */}
                <div style={{
                    position: "absolute", top: "-50px", right: "-50px",
                    fontSize: "150px", opacity: 0.1, color: "#ff0044",
                    filter: "blur(10px)",
                }}>👁️</div>

                <div style={{ fontSize: "60px", marginBottom: "20px" }}>⚠️</div>
                <h2 style={{ color: "#ff0044", fontSize: "28px", margin: "0 0 16px", fontWeight: 900, letterSpacing: "2px" }}>ACCÈS RESTREINT</h2>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "16px", marginBottom: "32px", lineHeight: 1.6 }}>
                    Ce module de virtualisation est actuellement en phase de développement critique.<br />
                    <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>
                        Le Superordinateur nécessite une optimisation du compilateur avant son exploitation finale.
                    </span>
                </p>
                <button
                    onClick={onUnlock}
                    style={{
                        padding: "14px 28px",
                        background: "transparent",
                        color: "#ff0044",
                        border: "1px solid #ff0044",
                        borderRadius: "8px",
                        fontWeight: 700,
                        fontSize: "14px",
                        cursor: "pointer",
                        transition: "all 0.3s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,0,68,0.1)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(255,0,68,0.3)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.boxShadow = "none"; }}
                >
                    🔓 Débloquer (Mode Développeur)
                </button>
            </div>
        </div>
    );
}

// ═══════════════ SPEED SETTINGS ═══════════════

const SPEEDS = [
    { label: "×1", ms: 400 },
    { label: "×2", ms: 200 },
    { label: "×4", ms: 100 },
];

// ═══════════════ COMPONENT ═══════════════

interface Props {
    moduleId: string;
}

export default function GameDevClient({ moduleId }: Props) {
    const consoleRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { play } = useSound();

    // Module Lock
    const [isLocked, setIsLocked] = useState(true);

    // Intro Jérémie — shown only once per session
    const [showIntro, setShowIntro] = useState(() => {
        try { return !localStorage.getItem("lyoko_intro_seen"); } catch { return true; }
    });
    const handleIntroClose = () => {
        setShowIntro(false);
        try { localStorage.setItem("lyoko_intro_seen", "1"); } catch { /* ignore */ }
    };

    // Persistent state
    const [completedLevels, setCompletedLevels] = useState<Set<number>>(new Set());
    const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
    const [showLevelSelector, setShowLevelSelector] = useState(false);
    const [showSolution, setShowSolution] = useState(false);
    const [heroId] = useState<HeroId>("ulrich");
    const [speedIdx, setSpeedIdx] = useState(0);

    // Game state
    const [code, setCode] = useState("");
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [prevState, setPrevState] = useState<GameState | null>(null);
    const [animProgress, setAnimProgress] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [isRunning, setIsRunning] = useState(false);

    const level = LYOKO_LEVELS[currentLevelIdx];
    const chapter = CHAPTERS.find(c => c.id === level.chapter);

    // ── Load completed levels from localStorage ──
    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem("lyoko_completed") || "[]");
            setCompletedLevels(new Set(saved));
        } catch { /* ignore */ }
    }, []);

    // ── Save completed levels ──
    const saveCompleted = useCallback((newSet: Set<number>) => {
        setCompletedLevels(newSet);
        localStorage.setItem("lyoko_completed", JSON.stringify([...newSet]));
    }, []);


    // ── Init level ──
    useEffect(() => {
        const state = parseLevel(level);
        setGameState(state);
        setPrevState(null);
        setCode(level.codeTemplate);
        setError(null);
        setIsRunning(false);
        setAnimProgress(1);
        if (timerRef.current) clearTimeout(timerRef.current);
    }, [currentLevelIdx, level]);


    // ── Auto-scroll console ──
    useEffect(() => {
        if (consoleRef.current) {
            consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
        }
    }, [gameState?.log.length]);

    // ── Execute next step ──
    const stepForward = useCallback(() => {
        if (!gameState || gameState.status !== "idle" && gameState.status !== "running") return;

        setGameState(prev => {
            if (!prev) return prev;
            const next = executeStep(prev, level);
            setPrevState(prev);
            setAnimProgress(0);

            // Animate
            const startTime = Date.now();
            const duration = SPEEDS[speedIdx].ms;
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const p = Math.min(1, elapsed / duration);
                setAnimProgress(p);
                if (p < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);

            // Play move sound
            play("tick");

            // Check if level is won
            if (next.status === "success") {
                setIsRunning(false);
                play("success");
                const newCompleted = new Set(completedLevels);
                newCompleted.add(level.id);
                saveCompleted(newCompleted);

                // Also save to the standard exercise progress format
                try {
                    const key = `gamedev_completed_exercises`;
                    const existing = JSON.parse(localStorage.getItem(key) || "[]");
                    if (!existing.includes(`gamedev_${level.id}`)) {
                        existing.push(`gamedev_${level.id}`);
                        localStorage.setItem(key, JSON.stringify(existing));
                    }
                } catch { /* ignore */ }
            } else if (next.status === "failure") {
                setIsRunning(false);
                play("error");
            }

            return next;
        });
    }, [gameState, level, speedIdx, completedLevels, saveCompleted, play]);

    // ── Run all commands ──
    const runCode = useCallback(() => {
        const { commands, error: parseError } = parseCode(code);
        if (parseError) {
            setError(parseError);
            play("error");
            return;
        }

        setError(null);
        play("codeRun");
        const freshState = parseLevel(level);
        freshState.commands = commands;
        freshState.status = "running";
        freshState.currentCommandIdx = -1;
        setGameState(freshState);
        setPrevState(null);
        setIsRunning(true);

        // Step through commands with delays
        let stepIdx = 0;
        const stepThrough = () => {
            if (stepIdx >= commands.length) return;
            stepIdx++;
            // Trigger state update by calling stepForward
            setGameState(prev => {
                if (!prev || prev.status === "success" || prev.status === "failure") return prev;
                const next = executeStep(prev, level);
                setPrevState(prev);
                setAnimProgress(0);

                const startTime = Date.now();
                const duration = SPEEDS[speedIdx].ms;
                const animate = () => {
                    const elapsed = Date.now() - startTime;
                    const p = Math.min(1, elapsed / duration);
                    setAnimProgress(p);
                    if (p < 1) requestAnimationFrame(animate);
                };
                requestAnimationFrame(animate);

                if (next.status === "success") {
                    setIsRunning(false);
                    play("success");
                    const newCompleted = new Set(completedLevels);
                    newCompleted.add(level.id);
                    saveCompleted(newCompleted);
                    try {
                        const key = `gamedev_completed_exercises`;
                        const existing = JSON.parse(localStorage.getItem(key) || "[]");
                        if (!existing.includes(`gamedev_${level.id}`)) {
                            existing.push(`gamedev_${level.id}`);
                            localStorage.setItem(key, JSON.stringify(existing));
                        }
                    } catch { /* ignore */ }
                } else if (next.status === "failure") {
                    setIsRunning(false);
                    play("error");
                } else {
                    play("tick");
                    timerRef.current = setTimeout(stepThrough, SPEEDS[speedIdx].ms + 50);
                }

                return next;
            });
        };

        timerRef.current = setTimeout(stepThrough, 300);
    }, [code, level, speedIdx, completedLevels, saveCompleted, play]);

    // ── Reset level ──
    const resetLevel = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        play("reset");
        const state = parseLevel(level);
        setGameState(state);
        setPrevState(null);
        setIsRunning(false);
        setAnimProgress(1);
        setError(null);
    }, [level, play]);

    // ── Next level ──
    const nextLevel = useCallback(() => {
        if (currentLevelIdx < LYOKO_LEVELS.length - 1) {
            setCurrentLevelIdx(prev => prev + 1);
        }
    }, [currentLevelIdx]);

    // ── Keyboard shortcut ──
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                e.preventDefault();
                if (!isRunning) runCode();
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [isRunning, runCode]);


    return (
        <div style={styles.wrapper}>
            <FranzCodePlayer />

            {/* ── Development Lock ── */}
            {isLocked && <DevelopmentLock onUnlock={() => setIsLocked(false)} />}

            {/* ── Jérémie Intro Overlay ── */}
            {showIntro && <JeremieIntro onDone={handleIntroClose} />}

            {/* ── Victory Overlay ── */}
            {gameState?.status === "success" && (
                <VictoryOverlay onNext={nextLevel} onRestart={resetLevel} />
            )}

            {/* ── Top Bar ── */}
            <div style={styles.topBar}>
                <div style={styles.topBarLeft}>
                    <button
                        style={styles.backBtn}
                        onClick={() => window.history.back()}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "#00d4ff"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
                    >
                        ← Retour
                    </button>
                    <span style={styles.levelTitle}>
                        Niveau {level.id} — {level.title}
                    </span>
                    <span
                        style={{
                            ...styles.chapterBadge,
                            background: `${chapter?.color || "#00d4ff"}20`,
                            color: chapter?.color || "#00d4ff",
                            border: `1px solid ${chapter?.color || "#00d4ff"}40`,
                        }}
                    >
                        Ch.{level.chapter} · {chapter?.title}
                    </span>
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
                        {completedLevels.size}/30 complétés
                    </span>
                    <button
                        style={styles.btnSecondary}
                        onClick={() => setShowLevelSelector(true)}
                    >
                        📋 Niveaux
                    </button>
                </div>
            </div>

            {/* ── Main Content ── */}
            <div style={styles.main}>
                {/* Left: Game Canvas */}
                <div style={styles.leftPanel}>
                    <div style={styles.canvasWrap}>
                        <LyokoStage3D
                            gameState={gameState}
                            level={level}
                            heroId={heroId}
                            animProgress={animProgress}
                            prevState={prevState || undefined}
                        />
                    </div>
                    <div style={styles.gameControls}>
                        {gameState?.status === "success" ? (
                            <>
                                <button style={styles.btnSuccess} onClick={nextLevel}>
                                    Niveau suivant →
                                </button>
                                <button style={styles.btnSecondary} onClick={resetLevel}>
                                    🔄 Rejouer
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    style={{
                                        ...styles.btnPrimary,
                                        opacity: isRunning ? 0.5 : 1,
                                        cursor: isRunning ? "not-allowed" : "pointer",
                                    }}
                                    onClick={runCode}
                                    disabled={isRunning}
                                >
                                    ▶ Exécuter
                                </button>
                                <button style={styles.btnSecondary} onClick={resetLevel}>
                                    ⏹ Reset
                                </button>
                                <div style={{ display: "flex", gap: "4px" }}>
                                    {SPEEDS.map((sp, i) => (
                                        <button
                                            key={sp.label}
                                            style={{
                                                ...styles.btnSecondary,
                                                padding: "6px 10px",
                                                fontSize: "11px",
                                                background: i === speedIdx ? "rgba(0,212,255,0.2)" : undefined,
                                                borderColor: i === speedIdx ? "#00d4ff" : undefined,
                                                color: i === speedIdx ? "#00d4ff" : "rgba(255,255,255,0.5)",
                                            }}
                                            onClick={() => setSpeedIdx(i)}
                                        >
                                            {sp.label}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Right: Code Editor */}
                <div style={styles.rightPanel}>
                    {/* Story */}
                    <div style={styles.storyBox}>
                        <span style={{ color: "#00d4ff", fontWeight: 600 }}>📖 </span>
                        {level.story}
                    </div>

                    {/* Objectives */}
                    <div style={styles.objectivesBox}>
                        {level.objectives.map((obj, i) => {
                            const done =
                                (obj.type === "reach_tower" && gameState?.towerReached) ||
                                (obj.type === "kill_all" && gameState?.enemies.every(e => !e.alive)) ||
                                (obj.type === "collect_all" && gameState && gameState.collected >= gameState.totalPickups) ||
                                false;
                            return (
                                <span
                                    key={i}
                                    style={{
                                        ...styles.objectiveTag,
                                        background: done ? "rgba(0,255,136,0.15)" : "rgba(255,255,255,0.06)",
                                        color: done ? "#00ff88" : "rgba(255,255,255,0.6)",
                                        border: `1px solid ${done ? "rgba(0,255,136,0.3)" : "rgba(255,255,255,0.1)"}`,
                                        textDecoration: done ? "line-through" : "none",
                                    }}
                                >
                                    {done ? "✓" : "○"} {obj.description}
                                </span>
                            );
                        })}
                    </div>

                    {/* Editor */}
                    <div style={styles.editorArea}>
                        <div style={styles.editorLabel}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <span>💻 Code JavaScript</span>
                                <button
                                    style={{
                                        ...styles.btnSecondary,
                                        padding: "2px 8px",
                                        fontSize: "10px",
                                        border: showSolution ? "1px solid #00d4ff" : undefined,
                                        color: showSolution ? "#00d4ff" : undefined,
                                    }}
                                    onClick={() => {
                                        play("click");
                                        setShowSolution(!showSolution);
                                    }}
                                >
                                    {showSolution ? "Masquer Solution" : "Voir Solution"}
                                </button>
                            </div>
                            <span style={{ fontWeight: 400, textTransform: "none" }}>
                                Ctrl+Entrée pour exécuter
                            </span>
                        </div>
                        <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column" }}>
                            <textarea
                                style={styles.textarea}
                                value={code}
                                onChange={e => setCode(e.target.value)}
                                spellCheck={false}
                                placeholder="// Écris ton code ici..."
                            />
                            {showSolution && (
                                <div style={{
                                    position: "absolute",
                                    inset: 0,
                                    background: "rgba(13, 17, 23, 0.95)",
                                    padding: "16px",
                                    fontSize: "14px",
                                    fontFamily: "monospace",
                                    color: "#00ff88",
                                    overflow: "auto",
                                    whiteSpace: "pre-wrap",
                                    border: "1px solid rgba(0, 255, 136, 0.3)",
                                    zIndex: 10,
                                }}>
                                    <div style={{ marginBottom: "10px", color: "rgba(255,255,255,0.4)", fontSize: "12px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "4px" }}>
                                        💡 Solution suggérée :
                                    </div>
                                    {level.solution}
                                    <button
                                        style={{
                                            position: "absolute",
                                            top: "10px",
                                            right: "10px",
                                            background: "rgba(255,255,255,0.1)",
                                            border: "none",
                                            color: "white",
                                            borderRadius: "4px",
                                            padding: "2px 6px",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => setShowSolution(false)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div style={{
                            padding: "8px 16px",
                            background: "rgba(255,34,68,0.1)",
                            borderTop: "1px solid rgba(255,34,68,0.3)",
                            color: "#ff6b7f",
                            fontSize: "13px",
                            fontFamily: "monospace",
                        }}>
                            ❌ {error}
                        </div>
                    )}

                    {/* Console */}
                    <div ref={consoleRef} style={styles.consoleBox}>
                        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", marginBottom: "4px" }}>
                            📟 Console
                        </div>
                        {gameState?.log.map((line, i) => (
                            <p key={i} style={styles.consoleLine}>{line}</p>
                        ))}
                        {gameState?.log.length === 0 && (
                            <p style={{ ...styles.consoleLine, fontStyle: "italic" }}>
                                Clique sur Exécuter pour voir le résultat...
                            </p>
                        )}
                    </div>

                    {/* Available commands */}
                    <div style={styles.commandsHelp}>
                        <span style={{ color: "rgba(255,255,255,0.3)", marginRight: "4px" }}>
                            Commandes :
                        </span>
                        {level.availableCommands.map(cmd => (
                            <span key={cmd} style={styles.cmdTag}>
                                {cmd}()
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Level Selector Overlay ── */}
            <AnimatePresence>
                {showLevelSelector && (
                    <div style={styles.overlay} onClick={() => setShowLevelSelector(false)}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            style={styles.levelSelector}
                            onClick={e => e.stopPropagation()}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <h2 style={{ fontSize: "22px", fontWeight: 700, color: lyokoTheme.borderPrimary, margin: 0 }}>
                                    ⚔️ Niveaux — Guerrier de Lyoko
                                </h2>
                                <button
                                    style={{ ...styles.btnSecondary, padding: "4px 10px" }}
                                    onClick={() => setShowLevelSelector(false)}
                                >
                                    ✕
                                </button>
                            </div>
                            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", marginTop: "8px" }}>
                                {completedLevels.size}/30 niveaux complétés
                            </p>

                            {CHAPTERS.map(ch => (
                                <div key={ch.id}>
                                    <div style={styles.chapterTitle}>
                                        <span style={{
                                            width: "8px", height: "8px", borderRadius: "50%",
                                            background: ch.color, display: "inline-block",
                                        }} />
                                        <span style={{ color: ch.color }}>
                                            Chapitre {ch.id} — {ch.title}
                                        </span>
                                        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", fontWeight: 400 }}>
                                            {ch.description}
                                        </span>
                                    </div>
                                    {ch.levels.map(lvlId => {
                                        const lvl = LYOKO_LEVELS[lvlId - 1];
                                        const completed = completedLevels.has(lvlId);
                                        const isCurrent = currentLevelIdx === lvlId - 1;
                                        return (
                                            <button
                                                key={lvlId}
                                                style={{
                                                    ...styles.levelBtn,
                                                    ...(completed ? styles.levelBtnCompleted : {}),
                                                    ...(isCurrent ? styles.levelBtnCurrent : {}),
                                                }}
                                                onClick={() => {
                                                    setCurrentLevelIdx(lvlId - 1);
                                                    setShowLevelSelector(false);
                                                }}
                                                onMouseEnter={e => {
                                                    if (!isCurrent) e.currentTarget.style.background = "rgba(0,255,102,0.08)";
                                                }}
                                                onMouseLeave={e => {
                                                    if (!isCurrent && !completed) e.currentTarget.style.background = "transparent";
                                                    else if (completed && !isCurrent) e.currentTarget.style.background = "rgba(0,255,102,0.15)";
                                                }}
                                            >
                                                <span style={{
                                                    ...styles.levelNum,
                                                    background: completed ? lyokoTheme.borderPrimary : isCurrent ? lyokoTheme.borderHighlight : "rgba(0,255,102,0.1)",
                                                    color: completed || isCurrent ? "#000" : lyokoTheme.borderPrimary,
                                                }}>
                                                    {completed ? "✓" : lvlId}
                                                </span>
                                                <div>
                                                    <div style={{ fontWeight: 600 }}>{lvl.title}</div>
                                                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>
                                                        {lvl.description}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
