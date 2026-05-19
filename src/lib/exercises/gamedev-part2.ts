import { addExercises } from "./registry";
import type { Exercise } from "./registry";

// Chapitre 2 — Mouvement & Contrôles (exercices 6-10)
const exercises: Exercise[] = [
  {
    id: "gd_c2_e1",
    title: "Contrôles clavier",
    category: "Mouvement",
    description: "Déplace un carré avec les touches fléchées du clavier !",
    instruction: `Crée un objet <code>keys</code> vide. Écoute les événements <code>keydown</code> et <code>keyup</code> pour stocker quelles touches sont appuyées. Dans la boucle de jeu, déplace le joueur selon les touches : ArrowLeft et ArrowRight.`,
    code_template: `const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let playerX = 280;
const playerY = 340;
const speed = 4;

const keys = {};

// Écoute keydown : quand une touche est appuyée, keys[e.key] = true
window.addEventListener("keydown", (e) => {
  // Complète ici
});

// Écoute keyup : quand relâchée, keys[e.key] = false
window.addEventListener("keyup", (e) => {
  // Complète ici
});

function gameLoop() {
  ctx.fillStyle = "#0a0a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#00ff88";
  ctx.fillRect(0, 360, canvas.width, 40);

  // Si keys["ArrowLeft"], déplace playerX de -speed
  // Si keys["ArrowRight"], déplace playerX de +speed

  ctx.fillStyle = "#00d4ff";
  ctx.fillRect(playerX, playerY, 30, 30);
  requestAnimationFrame(gameLoop);
}
gameLoop();
`,
    solution: `const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let playerX = 280;
const playerY = 340;
const speed = 4;
const keys = {};
window.addEventListener("keydown", (e) => { keys[e.key] = true; });
window.addEventListener("keyup", (e) => { keys[e.key] = false; });
function gameLoop() {
  ctx.fillStyle = "#0a0a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#00ff88";
  ctx.fillRect(0, 360, canvas.width, 40);
  if (keys["ArrowLeft"]) playerX -= speed;
  if (keys["ArrowRight"]) playerX += speed;
  ctx.fillStyle = "#00d4ff";
  ctx.fillRect(playerX, playerY, 30, 30);
  requestAnimationFrame(gameLoop);
}
gameLoop();`,
    tests: [
      { type: "contains", expected: "keydown" },
      { type: "contains", expected: "keyup" },
      { type: "contains", expected: "ArrowLeft" },
      { type: "contains", expected: "ArrowRight" },
    ],
    hint: "keys[e.key] = true dans keydown, false dans keyup",
  },
  {
    id: "gd_c2_e2",
    title: "Limites de l'écran",
    category: "Mouvement",
    description: "Empêche ton personnage de sortir du canvas !",
    instruction: `Après avoir déplacé le joueur avec les flèches, ajoute des <strong>bornes</strong> : utilise <code>Math.max</code> et <code>Math.min</code> pour que playerX reste entre 0 et canvas.width - 30.`,
    code_template: `const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let playerX = 280;
const speed = 4;
const keys = {};
window.addEventListener("keydown", (e) => { keys[e.key] = true; });
window.addEventListener("keyup", (e) => { keys[e.key] = false; });

function gameLoop() {
  ctx.fillStyle = "#0a0a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (keys["ArrowLeft"]) playerX -= speed;
  if (keys["ArrowRight"]) playerX += speed;

  // Empêche de sortir à gauche (playerX minimum = 0)
  // Empêche de sortir à droite (playerX maximum = canvas.width - 30)

  ctx.fillStyle = "#00d4ff";
  ctx.fillRect(playerX, 340, 30, 30);
  requestAnimationFrame(gameLoop);
}
gameLoop();
`,
    solution: `const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let playerX = 280;
const speed = 4;
const keys = {};
window.addEventListener("keydown", (e) => { keys[e.key] = true; });
window.addEventListener("keyup", (e) => { keys[e.key] = false; });
function gameLoop() {
  ctx.fillStyle = "#0a0a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (keys["ArrowLeft"]) playerX -= speed;
  if (keys["ArrowRight"]) playerX += speed;
  playerX = Math.max(0, playerX);
  playerX = Math.min(canvas.width - 30, playerX);
  ctx.fillStyle = "#00d4ff";
  ctx.fillRect(playerX, 340, 30, 30);
  requestAnimationFrame(gameLoop);
}
gameLoop();`,
    tests: [
      { type: "contains", expected: "Math.max" },
      { type: "contains", expected: "Math.min" },
    ],
    hint: "Math.max(0, playerX) renvoie le plus grand entre 0 et playerX",
  },
  {
    id: "gd_c2_e3",
    title: "Mouvement 4 directions",
    category: "Mouvement",
    description: "Déplace librement dans les 4 directions — explore Lyoko !",
    instruction: `Ajoute le mouvement vertical : le joueur peut aussi aller en haut (<code>ArrowUp</code>) et en bas (<code>ArrowDown</code>). Ajoute les contrôles et les bornes verticales !`,
    code_template: `const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let playerX = 280, playerY = 180;
const size = 30, speed = 4;
const keys = {};
window.addEventListener("keydown", (e) => { keys[e.key] = true; });
window.addEventListener("keyup", (e) => { keys[e.key] = false; });

function gameLoop() {
  ctx.fillStyle = "#0a0a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (keys["ArrowLeft"]) playerX -= speed;
  if (keys["ArrowRight"]) playerX += speed;
  // Ajoute ArrowUp (playerY -= speed) et ArrowDown (playerY += speed)

  // Bornes horizontales
  playerX = Math.max(0, Math.min(canvas.width - size, playerX));
  // Ajoute les bornes verticales pour playerY

  ctx.fillStyle = "#00d4ff";
  ctx.fillRect(playerX, playerY, size, size);
  requestAnimationFrame(gameLoop);
}
gameLoop();
`,
    solution: `const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let playerX = 280, playerY = 180;
const size = 30, speed = 4;
const keys = {};
window.addEventListener("keydown", (e) => { keys[e.key] = true; });
window.addEventListener("keyup", (e) => { keys[e.key] = false; });
function gameLoop() {
  ctx.fillStyle = "#0a0a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (keys["ArrowLeft"]) playerX -= speed;
  if (keys["ArrowRight"]) playerX += speed;
  if (keys["ArrowUp"]) playerY -= speed;
  if (keys["ArrowDown"]) playerY += speed;
  playerX = Math.max(0, Math.min(canvas.width - size, playerX));
  playerY = Math.max(0, Math.min(canvas.height - size, playerY));
  ctx.fillStyle = "#00d4ff";
  ctx.fillRect(playerX, playerY, size, size);
  requestAnimationFrame(gameLoop);
}
gameLoop();`,
    tests: [
      { type: "contains", expected: "ArrowUp" },
      { type: "contains", expected: "ArrowDown" },
    ],
    hint: "ArrowUp = playerY diminue (vers le haut), ArrowDown = playerY augmente",
  },
  {
    id: "gd_c2_e4",
    title: "Charger un sprite",
    category: "Mouvement",
    description: "Remplace le carré par Ulrich — le vrai héros de Lyoko !",
    instruction: `Charge l'image d'Ulrich avec <code>new Image()</code> et un data URI SVG. Quand l'image est chargée (<code>onload</code>), lance la boucle de jeu. Utilise <code>ctx.drawImage(img, x, y, w, h)</code> pour dessiner le sprite.`,
    code_template: `const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let playerX = 280, playerY = 300;
const keys = {};
window.addEventListener("keydown", (e) => { keys[e.key] = true; });
window.addEventListener("keyup", (e) => { keys[e.key] = false; });

const SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 48"><rect x="10" y="0" width="12" height="14" rx="6" fill="#fcd34d"/><rect x="4" y="14" width="24" height="20" rx="3" fill="#fbbf24"/><rect x="8" y="34" width="7" height="14" rx="2" fill="#92400e"/><rect x="17" y="34" width="7" height="14" rx="2" fill="#92400e"/><circle cx="13" cy="7" r="1.5" fill="#1e293b"/><circle cx="19" cy="7" r="1.5" fill="#1e293b"/></svg>';

const img = new Image();
img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(SVG);

img.onload = () => {
  function gameLoop() {
    ctx.fillStyle = "#0a0a2e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#00ff88";
    ctx.fillRect(0, 360, canvas.width, 40);
    if (keys["ArrowLeft"]) playerX -= 4;
    if (keys["ArrowRight"]) playerX += 4;
    playerX = Math.max(0, Math.min(canvas.width - 48, playerX));

    // Dessine le sprite avec ctx.drawImage(img, playerX, playerY, 48, 72)

    requestAnimationFrame(gameLoop);
  }
  gameLoop();
};
`,
    solution: `const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let playerX = 280, playerY = 300;
const keys = {};
window.addEventListener("keydown", (e) => { keys[e.key] = true; });
window.addEventListener("keyup", (e) => { keys[e.key] = false; });
const SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 48"><rect x="10" y="0" width="12" height="14" rx="6" fill="#fcd34d"/><rect x="4" y="14" width="24" height="20" rx="3" fill="#fbbf24"/><rect x="8" y="34" width="7" height="14" rx="2" fill="#92400e"/><rect x="17" y="34" width="7" height="14" rx="2" fill="#92400e"/><circle cx="13" cy="7" r="1.5" fill="#1e293b"/><circle cx="19" cy="7" r="1.5" fill="#1e293b"/></svg>';
const img = new Image();
img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(SVG);
img.onload = () => {
  function gameLoop() {
    ctx.fillStyle = "#0a0a2e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#00ff88";
    ctx.fillRect(0, 360, canvas.width, 40);
    if (keys["ArrowLeft"]) playerX -= 4;
    if (keys["ArrowRight"]) playerX += 4;
    playerX = Math.max(0, Math.min(canvas.width - 48, playerX));
    ctx.drawImage(img, playerX, playerY, 48, 72);
    requestAnimationFrame(gameLoop);
  }
  gameLoop();
};`,
    tests: [
      { type: "contains", expected: "drawImage" },
      { type: "contains", expected: "new Image" },
    ],
    hint: "ctx.drawImage(image, x, y, largeur, hauteur) dessine l'image",
  },
  {
    id: "gd_c2_e5",
    title: "Gravité et saut",
    category: "Mouvement",
    description: "Ajoute la gravité et le saut — Ulrich peut voler !",
    instruction: `Ajoute <code>vy = 0</code> (vitesse verticale) et <code>gravity = 0.5</code>. Chaque frame : vy += gravity, playerY += vy. Si le joueur touche le sol, remet playerY et vy à 0. Appuie sur ArrowUp pour sauter (<code>vy = -10</code>).`,
    code_template: `const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let playerX = 280, playerY = 290;
let vy = 0;
const gravity = 0.5;
const sol = 290;
const keys = {};
window.addEventListener("keydown", (e) => { keys[e.key] = true; });
window.addEventListener("keyup", (e) => { keys[e.key] = false; });

function gameLoop() {
  ctx.fillStyle = "#0a0a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#00ff88";
  ctx.fillRect(0, 360, canvas.width, 40);

  // Horizontal
  if (keys["ArrowLeft"]) playerX -= 4;
  if (keys["ArrowRight"]) playerX += 4;
  playerX = Math.max(0, Math.min(canvas.width - 30, playerX));

  // Saut : si ArrowUp ET playerY >= sol, alors vy = -10

  // Applique la gravité : vy += gravity

  // Applique la vitesse verticale : playerY += vy

  // Empêche de passer sous le sol : si playerY >= sol, playerY = sol et vy = 0

  ctx.fillStyle = "#fbbf24";
  ctx.fillRect(playerX, playerY, 30, 60);
  requestAnimationFrame(gameLoop);
}
gameLoop();
`,
    solution: `const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let playerX = 280, playerY = 290;
let vy = 0;
const gravity = 0.5;
const sol = 290;
const keys = {};
window.addEventListener("keydown", (e) => { keys[e.key] = true; });
window.addEventListener("keyup", (e) => { keys[e.key] = false; });
function gameLoop() {
  ctx.fillStyle = "#0a0a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#00ff88";
  ctx.fillRect(0, 360, canvas.width, 40);
  if (keys["ArrowLeft"]) playerX -= 4;
  if (keys["ArrowRight"]) playerX += 4;
  playerX = Math.max(0, Math.min(canvas.width - 30, playerX));
  if (keys["ArrowUp"] && playerY >= sol) vy = -10;
  vy += gravity;
  playerY += vy;
  if (playerY >= sol) { playerY = sol; vy = 0; }
  ctx.fillStyle = "#fbbf24";
  ctx.fillRect(playerX, playerY, 30, 60);
  requestAnimationFrame(gameLoop);
}
gameLoop();`,
    tests: [
      { type: "match", expected: "vy\\s*=\\s*-10" },
      { type: "match", expected: "vy\\s*\\+=\\s*gravity" },
      { type: "match", expected: "playerY\\s*\\+=\\s*vy" },
    ],
    hint: "La gravité tire vers le bas : vy += gravity rend vy de plus en plus positif",
  },
];

addExercises("gamedev", exercises);
