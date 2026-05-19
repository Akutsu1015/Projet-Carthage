/**
 * Lyoko Engine — CodeCombat-style game engine for the GameDev module.
 *
 * Grid-based game where the player writes JavaScript commands
 * (avancer, tourner, frapper, etc.) to control a Code Lyoko hero
 * on a 2D canvas.
 */

import {
    ULRICH_SVG, AELITA_SVG, ODD_SVG, YUMI_SVG,
    BLOK_SVG, KANKRELAT_SVG, TOWER_SVG,
    STAR_SVG, svgDataUri,
} from "./game-sprites";

// ═══════════════ TYPES ═══════════════

export type Direction = "right" | "left" | "up" | "down";
export type HeroId = "ulrich" | "aelita" | "odd" | "yumi";
export type CellType =
    | "empty"
    | "wall"       // indestructible obstacle
    | "enemy"      // Blok or Kankrelat
    | "tower"      // objective to reach
    | "pickup"     // item to collect
    | "hero";      // hero start position

export interface Enemy {
    id: string;
    type: "blok" | "kankrelat";
    x: number;
    y: number;
    hp: number;
    alive: boolean;
}

export interface LevelDef {
    id: number;
    chapter: number;
    title: string;
    description: string;
    story: string;       // narrative text
    grid: string[];      // rows of chars: . = empty, # = wall, B = blok, K = kankrelat, T = tower, P = pickup, H = hero start
    heroId?: HeroId;
    objectives: Objective[];
    availableCommands: string[];
    codeTemplate: string;
    hints: string[];
    solution: string;
    maxCommands?: number; // optional command limit for challenge
}

export interface Objective {
    type: "reach_tower" | "kill_all" | "kill_count" | "collect_all" | "survive";
    description: string;
    count?: number;
}

export type CommandType =
    | "avancer"
    | "reculer"
    | "tournerGauche"
    | "tournerDroite"
    | "frapper"
    | "ramasser"
    | "attendre";

export interface GameCommand {
    type: CommandType;
    line?: number; // source line for highlighting
}

export interface GameState {
    heroX: number;
    heroY: number;
    heroDir: Direction;
    heroHp: number;
    heroMaxHp: number;
    enemies: Enemy[];
    collected: number;
    totalPickups: number;
    towerReached: boolean;
    steps: number;
    maxSteps: number;
    status: "idle" | "running" | "success" | "failure";
    message: string;
    log: string[];
    currentCommandIdx: number;
    commands: GameCommand[];
}

// ═══════════════ CONSTANTS ═══════════════

export const COLS = 12;
export const ROWS = 8;
export const CELL_SIZE = 50;
export const CANVAS_W = COLS * CELL_SIZE;
export const CANVAS_H = ROWS * CELL_SIZE;

const HERO_SVGS: Record<HeroId, string> = {
    ulrich: ULRICH_SVG,
    aelita: AELITA_SVG,
    odd: ODD_SVG,
    yumi: YUMI_SVG,
};

const DIR_DX: Record<Direction, number> = { right: 1, left: -1, up: 0, down: 0 };
const DIR_DY: Record<Direction, number> = { right: 0, left: 0, up: -1, down: 1 };

const TURN_LEFT: Record<Direction, Direction> = { right: "up", up: "left", left: "down", down: "right" };
const TURN_RIGHT: Record<Direction, Direction> = { right: "down", down: "left", left: "up", up: "right" };

// ═══════════════ IMAGE CACHE ═══════════════

const imageCache: Record<string, HTMLImageElement> = {};

function loadSvgImage(key: string, svg: string): Promise<HTMLImageElement> {
    if (imageCache[key]) return Promise.resolve(imageCache[key]);
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => { imageCache[key] = img; resolve(img); };
        img.onerror = () => resolve(img); // fallback
        img.src = svgDataUri(svg);
    });
}

export async function preloadSprites(): Promise<void> {
    await Promise.all([
        loadSvgImage("ulrich", ULRICH_SVG),
        loadSvgImage("aelita", AELITA_SVG),
        loadSvgImage("odd", ODD_SVG),
        loadSvgImage("blok", BLOK_SVG),
        loadSvgImage("kankrelat", KANKRELAT_SVG),
        loadSvgImage("tower", TOWER_SVG),
        loadSvgImage("star", STAR_SVG),
    ]);
}

// ═══════════════ GRID PARSING ═══════════════

export function parseLevel(level: LevelDef): GameState {
    let heroX = 0, heroY = 0;
    const enemies: Enemy[] = [];
    let totalPickups = 0;
    let enemyIdx = 0;

    for (let r = 0; r < level.grid.length; r++) {
        const row = level.grid[r];
        for (let c = 0; c < row.length; c++) {
            const ch = row[c];
            if (ch === "H") { heroX = c; heroY = r; }
            if (ch === "B") {
                enemies.push({ id: `enemy_${enemyIdx++}`, type: "blok", x: c, y: r, hp: 2, alive: true });
            }
            if (ch === "K") {
                enemies.push({ id: `enemy_${enemyIdx++}`, type: "kankrelat", x: c, y: r, hp: 1, alive: true });
            }
            if (ch === "P") totalPickups++;
        }
    }

    return {
        heroX, heroY,
        heroDir: "right",
        heroHp: 5,
        heroMaxHp: 5,
        enemies,
        collected: 0,
        totalPickups,
        towerReached: false,
        steps: 0,
        maxSteps: 200,
        status: "idle",
        message: "",
        log: [],
        currentCommandIdx: -1,
        commands: [],
    };
}

// ═══════════════ CODE PARSER ═══════════════

/**
 * Parses user code and extracts a flat list of GameCommands.
 * Supports: avancer(), reculer(), tournerGauche(), tournerDroite(),
 *           frapper(), ramasser(), attendre()
 *           repeter(n, function() { ... })
 */
export function parseCode(code: string): { commands: GameCommand[]; error: string | null } {
    const commands: GameCommand[] = [];
    const lines = code.split("\n");

    // Build a safe sandbox environment
    const avancer = (line?: number) => commands.push({ type: "avancer", line });
    const reculer = (line?: number) => commands.push({ type: "reculer", line });
    const tournerGauche = (line?: number) => commands.push({ type: "tournerGauche", line });
    const tournerDroite = (line?: number) => commands.push({ type: "tournerDroite", line });
    const frapper = (line?: number) => commands.push({ type: "frapper", line });
    const ramasser = (line?: number) => commands.push({ type: "ramasser", line });
    const attendre = (line?: number) => commands.push({ type: "attendre", line });
    const repeter = (n: number, fn: () => void) => {
        for (let i = 0; i < Math.min(n, 100); i++) fn();
    };

    // Instrument code to pass line numbers
    let instrumentedCode = "";
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        // Replace function calls with line-numbered versions
        line = line.replace(/\bavancer\s*\(\s*\)/g, `avancer(${i + 1})`);
        line = line.replace(/\breculer\s*\(\s*\)/g, `reculer(${i + 1})`);
        line = line.replace(/\btournerGauche\s*\(\s*\)/g, `tournerGauche(${i + 1})`);
        line = line.replace(/\btournerDroite\s*\(\s*\)/g, `tournerDroite(${i + 1})`);
        line = line.replace(/\bfrapper\s*\(\s*\)/g, `frapper(${i + 1})`);
        line = line.replace(/\bramasser\s*\(\s*\)/g, `ramasser(${i + 1})`);
        line = line.replace(/\battendre\s*\(\s*\)/g, `attendre(${i + 1})`);
        instrumentedCode += line + "\n";
    }

    try {
        // Create a sandboxed function with available commands
        const fn = new Function(
            "avancer", "reculer", "tournerGauche", "tournerDroite",
            "frapper", "ramasser", "attendre", "repeter",
            instrumentedCode
        );
        fn(avancer, reculer, tournerGauche, tournerDroite, frapper, ramasser, attendre, repeter);
    } catch (e) {
        return { commands: [], error: `Erreur de syntaxe: ${(e as Error).message}` };
    }

    if (commands.length === 0) {
        return { commands: [], error: "Aucune commande détectée. Écris avancer(), tournerDroite(), etc." };
    }

    if (commands.length > 500) {
        return { commands: [], error: "Trop de commandes (max 500). Utilise repeter() pour simplifier !" };
    }

    return { commands, error: null };
}

// ═══════════════ STEP EXECUTION ═══════════════

function getCell(level: LevelDef, x: number, y: number): string {
    if (y < 0 || y >= level.grid.length) return "#";
    if (x < 0 || x >= level.grid[y].length) return "#";
    return level.grid[y][x];
}

export function executeStep(state: GameState, level: LevelDef): GameState {
    const s = { ...state, enemies: state.enemies.map(e => ({ ...e })), log: [...state.log] };
    if (s.currentCommandIdx >= s.commands.length - 1) {
        // All commands executed — check objectives
        s.status = checkObjectives(s, level) ? "success" : "failure";
        if (s.status === "failure" && !s.message) {
            s.message = "Objectifs non atteints. Essaie encore !";
        }
        if (s.status === "success") {
            s.message = "🎉 Niveau réussi !";
        }
        return s;
    }

    s.currentCommandIdx++;
    const cmd = s.commands[s.currentCommandIdx];
    s.steps++;

    if (s.steps > s.maxSteps) {
        s.status = "failure";
        s.message = "Trop d'étapes ! Optimise ton code.";
        return s;
    }

    switch (cmd.type) {
        case "avancer": {
            const nx = s.heroX + DIR_DX[s.heroDir];
            const ny = s.heroY + DIR_DY[s.heroDir];
            const cell = getCell(level, nx, ny);
            if (cell === "#" || nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) {
                s.log.push(`💥 Impossible d'avancer — mur !`);
                s.heroHp--;
                if (s.heroHp <= 0) { s.status = "failure"; s.message = "💀 Tu as perdu tous tes PV !"; }
            } else {
                const enemyHere = s.enemies.find(e => e.alive && e.x === nx && e.y === ny);
                if (enemyHere) {
                    s.log.push(`💥 Un ennemi bloque le passage ! Utilise frapper() d'abord.`);
                } else {
                    s.heroX = nx;
                    s.heroY = ny;
                    s.log.push(`→ Avance vers (${nx}, ${ny})`);

                    // Check tower
                    if (cell === "T") {
                        s.towerReached = true;
                        s.log.push("🗼 Tour de Lyoko atteinte !");
                    }
                    // Check pickup
                    if (cell === "P") {
                        s.log.push("⭐ Objet ramassé automatiquement !");
                        s.collected++;
                    }
                }
            }
            break;
        }
        case "reculer": {
            const backDir: Direction = { right: "left", left: "right", up: "down", down: "up" }[s.heroDir] as Direction;
            const nx = s.heroX + DIR_DX[backDir];
            const ny = s.heroY + DIR_DY[backDir];
            const cell = getCell(level, nx, ny);
            if (cell === "#" || nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) {
                s.log.push(`💥 Impossible de reculer — mur !`);
            } else {
                s.heroX = nx;
                s.heroY = ny;
                s.log.push(`← Recule vers (${nx}, ${ny})`);
            }
            break;
        }
        case "tournerGauche":
            s.heroDir = TURN_LEFT[s.heroDir];
            s.log.push(`↰ Tourne à gauche → regarde ${s.heroDir}`);
            break;
        case "tournerDroite":
            s.heroDir = TURN_RIGHT[s.heroDir];
            s.log.push(`↱ Tourne à droite → regarde ${s.heroDir}`);
            break;
        case "frapper": {
            const ax = s.heroX + DIR_DX[s.heroDir];
            const ay = s.heroY + DIR_DY[s.heroDir];
            const target = s.enemies.find(e => e.alive && e.x === ax && e.y === ay);
            if (target) {
                target.hp--;
                if (target.hp <= 0) {
                    target.alive = false;
                    s.log.push(`⚔️ ${target.type === "blok" ? "Blok" : "Kankrelat"} détruit !`);
                } else {
                    s.log.push(`⚔️ ${target.type === "blok" ? "Blok" : "Kankrelat"} touché ! (PV: ${target.hp})`);
                }
            } else {
                s.log.push(`⚔️ Frappe dans le vide...`);
            }
            break;
        }
        case "ramasser": {
            const cell = getCell(level, s.heroX, s.heroY);
            if (cell === "P") {
                s.collected++;
                s.log.push("⭐ Objet ramassé !");
            } else {
                s.log.push("Rien à ramasser ici.");
            }
            break;
        }
        case "attendre":
            s.log.push("⏳ Attente...");
            break;
    }

    return s;
}

// ═══════════════ OBJECTIVES CHECK ═══════════════

function checkObjectives(state: GameState, level: LevelDef): boolean {
    for (const obj of level.objectives) {
        switch (obj.type) {
            case "reach_tower":
                if (!state.towerReached) return false;
                break;
            case "kill_all":
                if (state.enemies.some(e => e.alive)) return false;
                break;
            case "kill_count":
                if (state.enemies.filter(e => !e.alive).length < (obj.count || 0)) return false;
                break;
            case "collect_all":
                if (state.collected < state.totalPickups) return false;
                break;
            case "survive":
                if (state.heroHp <= 0) return false;
                break;
        }
    }
    return true;
}

// ═══════════════ CANVAS RENDERING ═══════════════

const TERRAIN_COLORS = {
    bg: "#0a0a2e",
    grid: "rgba(0, 212, 255, 0.06)",
    gridLine: "rgba(0, 212, 255, 0.12)",
    wall: "#1e293b",
    wallStroke: "#334155",
    pickup: "#fbbf24",
    floor: "rgba(0, 212, 255, 0.03)",
};

export function renderFrame(
    ctx: CanvasRenderingContext2D,
    state: GameState,
    level: LevelDef,
    heroId: HeroId,
    animProgress: number, // 0-1 for smooth animation between steps
    prevState?: GameState,
): void {
    const w = CANVAS_W;
    const h = CANVAS_H;

    // ── Background ──
    ctx.fillStyle = TERRAIN_COLORS.bg;
    ctx.fillRect(0, 0, w, h);

    // ── Grid lines ──
    ctx.strokeStyle = TERRAIN_COLORS.gridLine;
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) {
        ctx.beginPath();
        ctx.moveTo(x * CELL_SIZE, 0);
        ctx.lineTo(x * CELL_SIZE, h);
        ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * CELL_SIZE);
        ctx.lineTo(w, y * CELL_SIZE);
        ctx.stroke();
    }

    // ── Terrain cells ──
    for (let r = 0; r < level.grid.length; r++) {
        for (let c = 0; c < level.grid[r].length; c++) {
            const ch = level.grid[r][c];
            const cx = c * CELL_SIZE;
            const cy = r * CELL_SIZE;

            if (ch === "#") {
                // Wall
                ctx.fillStyle = TERRAIN_COLORS.wall;
                ctx.fillRect(cx + 2, cy + 2, CELL_SIZE - 4, CELL_SIZE - 4);
                ctx.strokeStyle = TERRAIN_COLORS.wallStroke;
                ctx.lineWidth = 1;
                ctx.strokeRect(cx + 2, cy + 2, CELL_SIZE - 4, CELL_SIZE - 4);
                // XANA eye pattern on wall
                ctx.fillStyle = "#ff2244";
                ctx.globalAlpha = 0.2;
                ctx.beginPath();
                ctx.arc(cx + CELL_SIZE / 2, cy + CELL_SIZE / 2, 6, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }

            if (ch === "P") {
                // Pickup — glowing orb
                const pulse = 0.7 + 0.3 * Math.sin(Date.now() / 300);
                ctx.fillStyle = TERRAIN_COLORS.pickup;
                ctx.globalAlpha = pulse;
                ctx.beginPath();
                ctx.arc(cx + CELL_SIZE / 2, cy + CELL_SIZE / 2, 8, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
                // Glow
                ctx.shadowColor = "#fbbf24";
                ctx.shadowBlur = 12;
                ctx.beginPath();
                ctx.arc(cx + CELL_SIZE / 2, cy + CELL_SIZE / 2, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            if (ch === "T") {
                // Tower
                const towerImg = imageCache["tower"];
                if (towerImg) {
                    ctx.drawImage(towerImg, cx + 10, cy - 15, 30, 65);
                } else {
                    ctx.fillStyle = "#00d4ff";
                    ctx.globalAlpha = 0.6;
                    ctx.fillRect(cx + 15, cy + 5, 20, 40);
                    ctx.globalAlpha = 1;
                }
                // Glow effect
                ctx.shadowColor = "#00d4ff";
                ctx.shadowBlur = 15;
                ctx.fillStyle = "transparent";
                ctx.fillRect(cx + 15, cy + 5, 20, 40);
                ctx.shadowBlur = 0;
            }
        }
    }

    // ── Enemies ──
    for (const enemy of state.enemies) {
        if (!enemy.alive) continue;
        const ex = enemy.x * CELL_SIZE;
        const ey = enemy.y * CELL_SIZE;
        const imgKey = enemy.type;
        const img = imageCache[imgKey];

        if (img) {
            const sw = enemy.type === "blok" ? 40 : 32;
            const sh = enemy.type === "blok" ? 40 : 24;
            ctx.drawImage(img, ex + (CELL_SIZE - sw) / 2, ey + (CELL_SIZE - sh) / 2, sw, sh);
        } else {
            ctx.fillStyle = enemy.type === "blok" ? "#6b7280" : "#8b5e3c";
            ctx.fillRect(ex + 8, ey + 8, CELL_SIZE - 16, CELL_SIZE - 16);
        }

        // HP bar
        if (enemy.hp > 0) {
            const maxHp = enemy.type === "blok" ? 2 : 1;
            const barW = CELL_SIZE - 16;
            ctx.fillStyle = "#374151";
            ctx.fillRect(ex + 8, ey + 2, barW, 4);
            ctx.fillStyle = "#ff2244";
            ctx.fillRect(ex + 8, ey + 2, barW * (enemy.hp / maxHp), 4);
        }
    }

    // ── Hero ──
    let drawX = state.heroX * CELL_SIZE;
    let drawY = state.heroY * CELL_SIZE;

    // Smooth animation from previous position
    if (prevState && animProgress < 1) {
        const px = prevState.heroX * CELL_SIZE;
        const py = prevState.heroY * CELL_SIZE;
        drawX = px + (drawX - px) * easeOutCubic(animProgress);
        drawY = py + (drawY - py) * easeOutCubic(animProgress);
    }

    const heroImg = imageCache[heroId];
    if (heroImg) {
        ctx.save();
        const centerX = drawX + CELL_SIZE / 2;
        const centerY = drawY + CELL_SIZE / 2;
        ctx.translate(centerX, centerY);

        // Flip/rotate based on direction
        if (state.heroDir === "left") ctx.scale(-1, 1);
        else if (state.heroDir === "up") ctx.rotate(-Math.PI / 2);
        else if (state.heroDir === "down") ctx.rotate(Math.PI / 2);

        ctx.drawImage(heroImg, -16, -24, 32, 48);
        ctx.restore();
    } else {
        ctx.fillStyle = "#fbbf24";
        ctx.fillRect(drawX + 8, drawY + 4, CELL_SIZE - 16, CELL_SIZE - 8);
        // Direction indicator
        ctx.fillStyle = "#000";
        const arrowX = drawX + CELL_SIZE / 2 + DIR_DX[state.heroDir] * 10;
        const arrowY = drawY + CELL_SIZE / 2 + DIR_DY[state.heroDir] * 10;
        ctx.beginPath();
        ctx.arc(arrowX, arrowY, 4, 0, Math.PI * 2);
        ctx.fill();
    }

    // ── Attack animation ──
    if (prevState && state.commands[state.currentCommandIdx]?.type === "frapper" && animProgress < 0.7) {
        const ax = state.heroX + DIR_DX[state.heroDir];
        const ay = state.heroY + DIR_DY[state.heroDir];
        const slashX = ax * CELL_SIZE + CELL_SIZE / 2;
        const slashY = ay * CELL_SIZE + CELL_SIZE / 2;
        const slashAlpha = 1 - animProgress / 0.7;

        ctx.globalAlpha = slashAlpha;
        ctx.strokeStyle = "#00ff88";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(slashX, slashY, 15 + animProgress * 20, -Math.PI / 4, Math.PI / 4);
        ctx.stroke();
        ctx.globalAlpha = 1;
    }

    // ── HUD ──
    // HP bar
    const hpBarW = 120;
    const hpBarH = 10;
    const hpBarX = 10;
    const hpBarY = h - 20;
    ctx.fillStyle = "#374151";
    ctx.fillRect(hpBarX, hpBarY, hpBarW, hpBarH);
    const hpPct = state.heroHp / state.heroMaxHp;
    ctx.fillStyle = hpPct > 0.5 ? "#00ff88" : hpPct > 0.25 ? "#fbbf24" : "#ff2244";
    ctx.fillRect(hpBarX, hpBarY, hpBarW * hpPct, hpBarH);
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1;
    ctx.strokeRect(hpBarX, hpBarY, hpBarW, hpBarH);

    // HP text
    ctx.fillStyle = "white";
    ctx.font = "bold 10px monospace";
    ctx.fillText(`PV: ${state.heroHp}/${state.heroMaxHp}`, hpBarX + hpBarW + 8, hpBarY + 9);

    // Step counter
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "10px monospace";
    ctx.textAlign = "right";
    ctx.fillText(
        `Étape ${state.currentCommandIdx + 1}/${state.commands.length}`,
        w - 10,
        h - 10,
    );
    ctx.textAlign = "start";

    // Status overlay
    if (state.status === "success") {
        ctx.fillStyle = "rgba(0, 255, 136, 0.15)";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#00ff88";
        ctx.font = "bold 28px 'Inter', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("✅ NIVEAU RÉUSSI !", w / 2, h / 2 - 10);
        ctx.font = "14px 'Inter', sans-serif";
        ctx.fillStyle = "white";
        ctx.fillText(state.message, w / 2, h / 2 + 20);
        ctx.textAlign = "start";
    } else if (state.status === "failure") {
        ctx.fillStyle = "rgba(255, 34, 68, 0.15)";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#ff2244";
        ctx.font = "bold 28px 'Inter', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("❌ ÉCHEC", w / 2, h / 2 - 10);
        ctx.font = "14px 'Inter', sans-serif";
        ctx.fillStyle = "white";
        ctx.fillText(state.message, w / 2, h / 2 + 20);
        ctx.textAlign = "start";
    }
}

// ═══════════════ HELPERS ═══════════════

function easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
}
