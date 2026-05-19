import { addExercises } from "./registry";
import type { Exercise } from "./registry";

// Chapitre 3 — Sprites & Animations (exercices 11-15)
const exercises: Exercise[] = [
    {
        id: "gd_c3_e1",
        title: "Dessiner Aelita",
        category: "Sprites",
        description: "Charge et dessine Aelita — la gardienne de Lyoko !",
        instruction: `Charge le sprite SVG d'Aelita via <code>new Image()</code> et dessine-le sur le canvas. Aelita doit apparaître au centre de l'écran (x=276, y=280) en taille 48×72.`,
        code_template: `const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const AELITA = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 48"><defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f472b6"/><stop offset="100%" stop-color="#be185d"/></linearGradient></defs><rect x="10" y="0" width="12" height="14" rx="6" fill="#fda4af"/><path d="M8 4 Q16 -4 24 4" fill="#f472b6"/><rect x="4" y="14" width="24" height="20" rx="3" fill="url(#ag)"/><rect x="8" y="34" width="7" height="14" rx="2" fill="#9f1239"/><rect x="17" y="34" width="7" height="14" rx="2" fill="#9f1239"/><circle cx="13" cy="7" r="1.5" fill="#1e293b"/><circle cx="19" cy="7" r="1.5" fill="#1e293b"/></svg>';

// ✏️ Crée l'image et définis son src
const img = new Image();
img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(AELITA);

img.onload = () => {
  // Fond
  ctx.fillStyle = "#0a0a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#00ff88";
  ctx.fillRect(0, 360, canvas.width, 40);

  // ✏️ Dessine Aelita avec ctx.drawImage(img, 276, 280, 48, 72)
};
`,
        solution: `const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const AELITA = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 48"><defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f472b6"/><stop offset="100%" stop-color="#be185d"/></linearGradient></defs><rect x="10" y="0" width="12" height="14" rx="6" fill="#fda4af"/><path d="M8 4 Q16 -4 24 4" fill="#f472b6"/><rect x="4" y="14" width="24" height="20" rx="3" fill="url(#ag)"/><rect x="8" y="34" width="7" height="14" rx="2" fill="#9f1239"/><rect x="17" y="34" width="7" height="14" rx="2" fill="#9f1239"/><circle cx="13" cy="7" r="1.5" fill="#1e293b"/><circle cx="19" cy="7" r="1.5" fill="#1e293b"/></svg>';
const img = new Image();
img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(AELITA);
img.onload = () => {
  ctx.fillStyle = "#0a0a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#00ff88";
  ctx.fillRect(0, 360, canvas.width, 40);
  ctx.drawImage(img, 276, 280, 48, 72);
};`,
        tests: [
            { type: "contains", expected: "drawImage" },
            { type: "contains", expected: "276" },
        ],
        hint: "ctx.drawImage(img, x, y, largeur, hauteur) dessine un sprite",
    },
    {
        id: "gd_c3_e2",
        title: "Plusieurs sprites",
        category: "Sprites",
        description: "Affiche Ulrich et un Blok face à face — le combat approche !",
        instruction: `Charge deux sprites (Ulrich à gauche, Blok à droite) et dessine-les dans la scène. Ulrich à (100, 288) en 48×72 et le Blok à (450, 310) en 60×60.`,
        code_template: `const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const ULRICH = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 48"><rect x="10" y="0" width="12" height="14" rx="6" fill="#fcd34d"/><rect x="4" y="14" width="24" height="20" rx="3" fill="#fbbf24"/><rect x="8" y="34" width="7" height="14" rx="2" fill="#92400e"/><rect x="17" y="34" width="7" height="14" rx="2" fill="#92400e"/><circle cx="13" cy="7" r="1.5" fill="#1e293b"/><circle cx="19" cy="7" r="1.5" fill="#1e293b"/></svg>';
const BLOK = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect x="2" y="2" width="36" height="36" rx="4" fill="#6b7280" stroke="#111827"/><circle cx="20" cy="20" r="8" fill="none" stroke="#ff2244" stroke-width="1.5"/><circle cx="20" cy="20" r="3" fill="#ff2244"/></svg>';

let loaded = 0;
const imgUlrich = new Image();
const imgBlok = new Image();

function draw() {
  ctx.fillStyle = "#0a0a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#00ff88";
  ctx.fillRect(0, 360, canvas.width, 40);

  // ✏️ Dessine Ulrich à (100, 288) taille 48×72
  // ✏️ Dessine le Blok à (450, 310) taille 60×60
}

function onLoad() {
  loaded++;
  if (loaded === 2) draw();
}
imgUlrich.onload = onLoad;
imgBlok.onload = onLoad;
imgUlrich.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(ULRICH);
imgBlok.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(BLOK);
`,
        solution: `const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const ULRICH = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 48"><rect x="10" y="0" width="12" height="14" rx="6" fill="#fcd34d"/><rect x="4" y="14" width="24" height="20" rx="3" fill="#fbbf24"/><rect x="8" y="34" width="7" height="14" rx="2" fill="#92400e"/><rect x="17" y="34" width="7" height="14" rx="2" fill="#92400e"/><circle cx="13" cy="7" r="1.5" fill="#1e293b"/><circle cx="19" cy="7" r="1.5" fill="#1e293b"/></svg>';
const BLOK = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect x="2" y="2" width="36" height="36" rx="4" fill="#6b7280" stroke="#111827"/><circle cx="20" cy="20" r="8" fill="none" stroke="#ff2244" stroke-width="1.5"/><circle cx="20" cy="20" r="3" fill="#ff2244"/></svg>';
let loaded = 0;
const imgUlrich = new Image();
const imgBlok = new Image();
function draw() {
  ctx.fillStyle = "#0a0a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#00ff88";
  ctx.fillRect(0, 360, canvas.width, 40);
  ctx.drawImage(imgUlrich, 100, 288, 48, 72);
  ctx.drawImage(imgBlok, 450, 310, 60, 60);
}
function onLoad() { loaded++; if (loaded === 2) draw(); }
imgUlrich.onload = onLoad;
imgBlok.onload = onLoad;
imgUlrich.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(ULRICH);
imgBlok.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(BLOK);`,
        tests: [
            { type: "match", expected: "drawImage.*imgUlrich" },
            { type: "match", expected: "drawImage.*imgBlok" },
        ],
        hint: "Utilise ctx.drawImage pour chaque sprite — deux appels séparés",
    },
    {
        id: "gd_c3_e3",
        title: "Animation frame par frame",
        category: "Sprites",
        description: "Fais clignoter le symbole de XANA sur le Blok — il s'active !",
        instruction: `Utilise un compteur <code>frame</code> qui s'incrémente à chaque boucle. Alterne la couleur du Blok : si <code>frame % 30 < 15</code>, dessine le cercle en rouge, sinon en blanc. C'est le principe de l'animation frame-by-frame.`,
        code_template: `const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let frame = 0;

function gameLoop() {
  ctx.fillStyle = "#0a0a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Dessine le Blok (carré gris)
  ctx.fillStyle = "#6b7280";
  ctx.fillRect(270, 170, 60, 60);

  // ✏️ Si frame % 30 < 15, utilise la couleur "#ff2244", sinon "white"
  // ✏️ Dessine le cercle XANA (rayon 12) au centre du Blok (300, 200)

  ctx.beginPath();
  ctx.arc(300, 200, 12, 0, Math.PI * 2);
  ctx.fill();

  frame++;
  requestAnimationFrame(gameLoop);
}
gameLoop();
`,
        solution: `const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let frame = 0;
function gameLoop() {
  ctx.fillStyle = "#0a0a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#6b7280";
  ctx.fillRect(270, 170, 60, 60);
  ctx.fillStyle = frame % 30 < 15 ? "#ff2244" : "white";
  ctx.beginPath();
  ctx.arc(300, 200, 12, 0, Math.PI * 2);
  ctx.fill();
  frame++;
  requestAnimationFrame(gameLoop);
}
gameLoop();`,
        tests: [
            { type: "match", expected: "frame\\s*%\\s*30" },
            { type: "contains", expected: "#ff2244" },
        ],
        hint: "L'opérateur % (modulo) permet de créer un cycle : frame % 30 va de 0 à 29 en boucle",
    },
    {
        id: "gd_c3_e4",
        title: "HUD — Barre de vie",
        category: "Sprites",
        description: "Affiche une barre de vie comme dans un vrai jeu !",
        instruction: `Dessine une barre de vie en haut à gauche : un fond gris de 200×20, rempli en vert proportionnellement aux PV. Si <code>pv = 70</code> et <code>pvMax = 100</code>, la barre verte fait <code>(pv/pvMax) * 200 = 140px</code>.`,
        code_template: `const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const pvMax = 100;
let pv = 70;

function gameLoop() {
  ctx.fillStyle = "#0a0a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // ✏️ Fond de la barre (gris foncé, position 20,20, taille 200×20)
  ctx.fillStyle = "#374151";
  ctx.fillRect(20, 20, 200, 20);

  // ✏️ Barre de vie verte, largeur proportionnelle aux PV
  // Largeur = (pv / pvMax) * 200
  ctx.fillStyle = "#00ff88";
  // ✏️ Écris le fillRect ici

  // Label
  ctx.fillStyle = "white";
  ctx.font = "12px Arial";
  ctx.fillText("PV: " + pv + "/" + pvMax, 25, 35);

  requestAnimationFrame(gameLoop);
}
gameLoop();
`,
        solution: `const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const pvMax = 100;
let pv = 70;
function gameLoop() {
  ctx.fillStyle = "#0a0a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#374151";
  ctx.fillRect(20, 20, 200, 20);
  ctx.fillStyle = "#00ff88";
  ctx.fillRect(20, 20, (pv / pvMax) * 200, 20);
  ctx.fillStyle = "white";
  ctx.font = "12px Arial";
  ctx.fillText("PV: " + pv + "/" + pvMax, 25, 35);
  requestAnimationFrame(gameLoop);
}
gameLoop();`,
        tests: [
            { type: "match", expected: "pv\\s*/\\s*pvMax" },
            { type: "match", expected: "fillRect.*20.*20.*200" },
        ],
        hint: "(pv / pvMax) * 200 donne la largeur proportionnelle de la barre verte",
    },
    {
        id: "gd_c3_e5",
        title: "Effet de particules",
        category: "Sprites",
        description: "Crée un effet de particules quand Aelita utilise ses pouvoirs !",
        instruction: `Crée un tableau <code>particles</code>. À chaque frame, ajoute une particule à la position du joueur avec une vitesse aléatoire. Dessine chaque particule (petit cercle rose), réduis son alpha (opacité), et supprime-la quand elle disparaît.`,
        code_template: `const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const particles = [];
let frame = 0;

function gameLoop() {
  ctx.fillStyle = "#0a0a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // ✏️ Crée une particule toutes les 3 frames
  if (frame % 3 === 0) {
    particles.push({
      x: 300,
      y: 200,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      alpha: 1,
      size: 2 + Math.random() * 3,
    });
  }

  // ✏️ Pour chaque particule : déplace-la, réduis l'alpha, dessine-la
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= 0.02;

    if (p.alpha <= 0) {
      // ✏️ Supprime la particule avec particles.splice(i, 1)
      continue;
    }

    // ✏️ Dessine la particule (cercle rose avec globalAlpha)
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = "#f472b6";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  frame++;
  requestAnimationFrame(gameLoop);
}
gameLoop();
`,
        solution: `const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const particles = [];
let frame = 0;
function gameLoop() {
  ctx.fillStyle = "#0a0a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (frame % 3 === 0) {
    particles.push({ x: 300, y: 200, vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4, alpha: 1, size: 2 + Math.random() * 3 });
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= 0.02;
    if (p.alpha <= 0) { particles.splice(i, 1); continue; }
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = "#f472b6";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  frame++;
  requestAnimationFrame(gameLoop);
}
gameLoop();`,
        tests: [
            { type: "contains", expected: "particles.splice" },
            { type: "contains", expected: "globalAlpha" },
        ],
        hint: "splice(i, 1) supprime 1 élément à l'index i du tableau",
    },
];

addExercises("gamedev", exercises);
