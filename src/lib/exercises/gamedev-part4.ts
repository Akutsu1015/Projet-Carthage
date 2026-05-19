import { addExercises } from "./registry";
import type { Exercise } from "./registry";

// Chapitre 4 — Combat & Collisions (exercices 16-20)
const exercises: Exercise[] = [
    {
        id: "gd_c4_e1",
        title: "Tirer un projectile",
        category: "Combat",
        description: "Ulrich lance une flèche laser — appuie sur Espace !",
        instruction: `Quand le joueur appuie sur <code>Space</code>, crée un projectile (objet avec x, y, vitesse) et ajoute-le à un tableau <code>bullets</code>. Dans la boucle de jeu, déplace chaque projectile vers la droite et dessine-le.`,
        code_template: `const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let playerX = 50, playerY = 180;
const bullets = [];
const keys = {};
window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
  // ✏️ Si e.key === " " (espace), ajoute un projectile
  // bullets.push({ x: playerX + 30, y: playerY + 15, vx: 8 })
});
window.addEventListener("keyup", (e) => { keys[e.key] = false; });

function gameLoop() {
  ctx.fillStyle = "#0a0a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Joueur
  if (keys["ArrowUp"]) playerY -= 4;
  if (keys["ArrowDown"]) playerY += 4;
  playerY = Math.max(0, Math.min(canvas.height - 30, playerY));
  ctx.fillStyle = "#fbbf24";
  ctx.fillRect(playerX, playerY, 30, 30);

  // ✏️ Pour chaque bullet : déplace (b.x += b.vx), dessine (rect vert 12×4)
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    // ✏️ Déplace le projectile
    // ✏️ Dessine-le en vert (#00ff88)
    // ✏️ Supprime si hors écran (b.x > canvas.width)
  }

  requestAnimationFrame(gameLoop);
}
gameLoop();
`,
        solution: `const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let playerX = 50, playerY = 180;
const bullets = [];
const keys = {};
window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
  if (e.key === " ") { bullets.push({ x: playerX + 30, y: playerY + 15, vx: 8 }); }
});
window.addEventListener("keyup", (e) => { keys[e.key] = false; });
function gameLoop() {
  ctx.fillStyle = "#0a0a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (keys["ArrowUp"]) playerY -= 4;
  if (keys["ArrowDown"]) playerY += 4;
  playerY = Math.max(0, Math.min(canvas.height - 30, playerY));
  ctx.fillStyle = "#fbbf24";
  ctx.fillRect(playerX, playerY, 30, 30);
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.x += b.vx;
    ctx.fillStyle = "#00ff88";
    ctx.fillRect(b.x, b.y, 12, 4);
    if (b.x > canvas.width) bullets.splice(i, 1);
  }
  requestAnimationFrame(gameLoop);
}
gameLoop();`,
        tests: [
            { type: "contains", expected: "bullets.push" },
            { type: "match", expected: "b\\.x\\s*\\+=\\s*b\\.vx" },
        ],
        hint: "Chaque projectile est un objet {x, y, vx}. Push dans le tableau quand espace.",
    },
    {
        id: "gd_c4_e2",
        title: "Détection de collision AABB",
        category: "Combat",
        description: "Apprends la technique AABB — la base de tout jeu !",
        instruction: `Crée une fonction <code>collides(a, b)</code> qui retourne <code>true</code> si deux rectangles se chevauchent. Condition AABB : <code>a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y</code>.`,
        code_template: `const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Rectangle A (bleu, contrôlable)
let a = { x: 50, y: 180, w: 40, h: 40 };
// Rectangle B (rouge, fixe)
let b = { x: 300, y: 180, w: 50, h: 50 };

const keys = {};
window.addEventListener("keydown", (e) => { keys[e.key] = true; });
window.addEventListener("keyup", (e) => { keys[e.key] = false; });

// ✏️ Crée la fonction collides(a, b) qui retourne true si collision
function collides(a, b) {
  // ✏️ Retourne le test AABB
}

function gameLoop() {
  ctx.fillStyle = "#0a0a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (keys["ArrowLeft"]) a.x -= 3;
  if (keys["ArrowRight"]) a.x += 3;
  if (keys["ArrowUp"]) a.y -= 3;
  if (keys["ArrowDown"]) a.y += 3;

  const hit = collides(a, b);

  ctx.fillStyle = hit ? "#ff2244" : "#00d4ff";
  ctx.fillRect(a.x, a.y, a.w, a.h);
  ctx.fillStyle = "#ff2244";
  ctx.fillRect(b.x, b.y, b.w, b.h);

  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText(hit ? "💥 COLLISION !" : "Déplace le carré bleu →", 20, 30);

  requestAnimationFrame(gameLoop);
}
gameLoop();
`,
        solution: `const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let a = { x: 50, y: 180, w: 40, h: 40 };
let b = { x: 300, y: 180, w: 50, h: 50 };
const keys = {};
window.addEventListener("keydown", (e) => { keys[e.key] = true; });
window.addEventListener("keyup", (e) => { keys[e.key] = false; });
function collides(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
function gameLoop() {
  ctx.fillStyle = "#0a0a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (keys["ArrowLeft"]) a.x -= 3;
  if (keys["ArrowRight"]) a.x += 3;
  if (keys["ArrowUp"]) a.y -= 3;
  if (keys["ArrowDown"]) a.y += 3;
  const hit = collides(a, b);
  ctx.fillStyle = hit ? "#ff2244" : "#00d4ff";
  ctx.fillRect(a.x, a.y, a.w, a.h);
  ctx.fillStyle = "#ff2244";
  ctx.fillRect(b.x, b.y, b.w, b.h);
  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText(hit ? "💥 COLLISION !" : "Déplace le carré bleu →", 20, 30);
  requestAnimationFrame(gameLoop);
}
gameLoop();`,
        tests: [
            { type: "match", expected: "a\\.x\\s*<\\s*b\\.x\\s*\\+\\s*b\\.w" },
            { type: "contains", expected: "return" },
        ],
        hint: "AABB = Axis-Aligned Bounding Box. Deux rectangles se chevauchent si AUCUN des 4 côtés ne les sépare.",
        help_steps: [
            "1. <code>return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;</code>",
        ],
    },
    {
        id: "gd_c4_e3",
        title: "Détruire les Bloks",
        category: "Combat",
        description: "Tire sur les Bloks — détruis-les avec tes projectiles !",
        instruction: `Combine projectiles + collision AABB : quand un projectile touche un ennemi, supprime les deux du tableau. Ajoute 3 ennemis Bloks à des positions différentes.`,
        code_template: `const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let px = 50, py = 180;
const bullets = [];
const enemies = [
  { x: 400, y: 100, w: 40, h: 40, alive: true },
  { x: 450, y: 200, w: 40, h: 40, alive: true },
  { x: 500, y: 300, w: 40, h: 40, alive: true },
];
const keys = {};
window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
  if (e.key === " ") bullets.push({ x: px + 30, y: py + 12, w: 12, h: 4 });
});
window.addEventListener("keyup", (e) => { keys[e.key] = false; });

function collides(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function gameLoop() {
  ctx.fillStyle = "#0a0a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (keys["ArrowUp"]) py -= 4;
  if (keys["ArrowDown"]) py += 4;
  py = Math.max(0, Math.min(360, py));
  ctx.fillStyle = "#fbbf24";
  ctx.fillRect(px, py, 30, 30);

  // Projectiles
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].x += 8;
    ctx.fillStyle = "#00ff88";
    ctx.fillRect(bullets[i].x, bullets[i].y, 12, 4);
    if (bullets[i].x > 600) { bullets.splice(i, 1); continue; }

    // ✏️ Pour chaque ennemi vivant, teste la collision avec ce projectile
    // Si collision → enemy.alive = false, supprime le bullet
    for (const e of enemies) {
      if (e.alive && collides(bullets[i], e)) {
        // ✏️ Marque l'ennemi comme mort et supprime le projectile
      }
    }
  }

  // Dessine les ennemis vivants
  for (const e of enemies) {
    if (!e.alive) continue;
    ctx.fillStyle = "#6b7280";
    ctx.fillRect(e.x, e.y, e.w, e.h);
    ctx.fillStyle = "#ff2244";
    ctx.beginPath();
    ctx.arc(e.x + 20, e.y + 20, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "white";
  ctx.font = "14px Arial";
  ctx.fillText("Espace = Tirer  |  Ennemis: " + enemies.filter(e => e.alive).length, 20, 25);
  requestAnimationFrame(gameLoop);
}
gameLoop();
`,
        solution: `const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let px = 50, py = 180;
const bullets = [];
const enemies = [
  { x: 400, y: 100, w: 40, h: 40, alive: true },
  { x: 450, y: 200, w: 40, h: 40, alive: true },
  { x: 500, y: 300, w: 40, h: 40, alive: true },
];
const keys = {};
window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
  if (e.key === " ") bullets.push({ x: px + 30, y: py + 12, w: 12, h: 4 });
});
window.addEventListener("keyup", (e) => { keys[e.key] = false; });
function collides(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
function gameLoop() {
  ctx.fillStyle = "#0a0a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (keys["ArrowUp"]) py -= 4;
  if (keys["ArrowDown"]) py += 4;
  py = Math.max(0, Math.min(360, py));
  ctx.fillStyle = "#fbbf24";
  ctx.fillRect(px, py, 30, 30);
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].x += 8;
    ctx.fillStyle = "#00ff88";
    ctx.fillRect(bullets[i].x, bullets[i].y, 12, 4);
    if (bullets[i].x > 600) { bullets.splice(i, 1); continue; }
    for (const e of enemies) {
      if (e.alive && collides(bullets[i], e)) {
        e.alive = false;
        bullets.splice(i, 1);
        break;
      }
    }
  }
  for (const e of enemies) {
    if (!e.alive) continue;
    ctx.fillStyle = "#6b7280";
    ctx.fillRect(e.x, e.y, e.w, e.h);
    ctx.fillStyle = "#ff2244";
    ctx.beginPath();
    ctx.arc(e.x + 20, e.y + 20, 8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "white";
  ctx.font = "14px Arial";
  ctx.fillText("Espace = Tirer  |  Ennemis: " + enemies.filter(e => e.alive).length, 20, 25);
  requestAnimationFrame(gameLoop);
}
gameLoop();`,
        tests: [
            { type: "match", expected: "e\\.alive\\s*=\\s*false" },
            { type: "contains", expected: "collides" },
        ],
        hint: "Quand un projectile touche un ennemi : e.alive = false puis bullets.splice(i, 1) et break",
    },
    {
        id: "gd_c4_e4",
        title: "Points de vie ennemis",
        category: "Combat",
        description: "Les Bloks ont maintenant des PV — il faut les toucher plusieurs fois !",
        instruction: `Donne à chaque ennemi <code>hp: 3</code>. Quand un projectile touche, réduis hp de 1 au lieu de tuer directement. L'ennemi meurt quand hp atteint 0. Affiche les PV au-dessus de chaque ennemi.`,
        code_template: `const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let px = 50, py = 180;
const bullets = [];
const enemies = [
  { x: 400, y: 150, w: 50, h: 50, hp: 3 },
  { x: 480, y: 280, w: 50, h: 50, hp: 3 },
];
const keys = {};
window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
  if (e.key === " ") bullets.push({ x: px + 30, y: py + 12, w: 12, h: 4 });
});
window.addEventListener("keyup", (e) => { keys[e.key] = false; });
function collides(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
function gameLoop() {
  ctx.fillStyle = "#0a0a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (keys["ArrowUp"]) py -= 4;
  if (keys["ArrowDown"]) py += 4;
  py = Math.max(0, Math.min(360, py));
  ctx.fillStyle = "#fbbf24";
  ctx.fillRect(px, py, 30, 30);

  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].x += 8;
    ctx.fillStyle = "#00ff88";
    ctx.fillRect(bullets[i].x, bullets[i].y, 12, 4);
    if (bullets[i].x > 600) { bullets.splice(i, 1); continue; }
    for (const e of enemies) {
      // ✏️ Si hp > 0 et collision → réduis hp de 1, supprime le bullet
      if (e.hp > 0 && collides(bullets[i], e)) {
        // ✏️ Complète ici
      }
    }
  }

  for (const e of enemies) {
    if (e.hp <= 0) continue;
    ctx.fillStyle = "#6b7280";
    ctx.fillRect(e.x, e.y, e.w, e.h);
    ctx.fillStyle = "#ff2244";
    ctx.beginPath();
    ctx.arc(e.x + 25, e.y + 25, 10, 0, Math.PI * 2);
    ctx.fill();
    // ✏️ Affiche les PV au-dessus : ctx.fillText("HP: " + e.hp, ...)
  }

  requestAnimationFrame(gameLoop);
}
gameLoop();
`,
        solution: `const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let px = 50, py = 180;
const bullets = [];
const enemies = [
  { x: 400, y: 150, w: 50, h: 50, hp: 3 },
  { x: 480, y: 280, w: 50, h: 50, hp: 3 },
];
const keys = {};
window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
  if (e.key === " ") bullets.push({ x: px + 30, y: py + 12, w: 12, h: 4 });
});
window.addEventListener("keyup", (e) => { keys[e.key] = false; });
function collides(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
function gameLoop() {
  ctx.fillStyle = "#0a0a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (keys["ArrowUp"]) py -= 4;
  if (keys["ArrowDown"]) py += 4;
  py = Math.max(0, Math.min(360, py));
  ctx.fillStyle = "#fbbf24";
  ctx.fillRect(px, py, 30, 30);
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].x += 8;
    ctx.fillStyle = "#00ff88";
    ctx.fillRect(bullets[i].x, bullets[i].y, 12, 4);
    if (bullets[i].x > 600) { bullets.splice(i, 1); continue; }
    for (const e of enemies) {
      if (e.hp > 0 && collides(bullets[i], e)) {
        e.hp--;
        bullets.splice(i, 1);
        break;
      }
    }
  }
  for (const e of enemies) {
    if (e.hp <= 0) continue;
    ctx.fillStyle = "#6b7280";
    ctx.fillRect(e.x, e.y, e.w, e.h);
    ctx.fillStyle = "#ff2244";
    ctx.beginPath();
    ctx.arc(e.x + 25, e.y + 25, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.font = "10px Arial";
    ctx.fillText("HP: " + e.hp, e.x + 10, e.y - 5);
  }
  requestAnimationFrame(gameLoop);
}
gameLoop();`,
        tests: [
            { type: "match", expected: "e\\.hp--" },
            { type: "match", expected: "fillText.*HP" },
        ],
        hint: "e.hp-- réduit les points de vie de 1",
    },
    {
        id: "gd_c4_e5",
        title: "Le joueur peut être touché",
        category: "Combat",
        description: "Les ennemis ripostent — gère les dégâts du joueur !",
        instruction: `Donne au joueur <code>playerHp = 5</code>. Chaque ennemi tire un projectile rouge toutes les 90 frames. Si un projectile ennemi touche le joueur, réduis playerHp. Affiche la barre de vie du joueur en haut.`,
        code_template: `const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let px = 50, py = 180, playerHp = 5;
const bullets = [];
const enemyBullets = [];
const enemies = [{ x: 500, y: 180, w: 50, h: 50, hp: 5 }];
let frame = 0;
const keys = {};
window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
  if (e.key === " ") bullets.push({ x: px + 30, y: py + 12, w: 12, h: 4 });
});
window.addEventListener("keyup", (e) => { keys[e.key] = false; });
function collides(a, b) { return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; }

function gameLoop() {
  ctx.fillStyle = "#0a0a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (keys["ArrowUp"]) py -= 4;
  if (keys["ArrowDown"]) py += 4;
  py = Math.max(0, Math.min(360, py));

  // ✏️ Si frame % 90 === 0, chaque ennemi vivant tire un projectile rouge
  // enemyBullets.push({ x: e.x, y: e.y + 25, w: 10, h: 4 })
  if (frame % 90 === 0) {
    for (const e of enemies) {
      if (e.hp > 0) {
        // ✏️ Ajoute un projectile ennemi ici
      }
    }
  }

  // Projectiles joueur
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].x += 8;
    ctx.fillStyle = "#00ff88";
    ctx.fillRect(bullets[i].x, bullets[i].y, 12, 4);
    if (bullets[i].x > 600) { bullets.splice(i, 1); continue; }
    for (const e of enemies) {
      if (e.hp > 0 && collides(bullets[i], e)) { e.hp--; bullets.splice(i, 1); break; }
    }
  }

  // ✏️ Projectiles ennemis : déplace vers la gauche, teste collision avec joueur
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    enemyBullets[i].x -= 5;
    ctx.fillStyle = "#ff2244";
    ctx.fillRect(enemyBullets[i].x, enemyBullets[i].y, 10, 4);
    if (enemyBullets[i].x < 0) { enemyBullets.splice(i, 1); continue; }
    // ✏️ Si collision avec joueur {x:px,y:py,w:30,h:30}, réduis playerHp
  }

  // Joueur
  ctx.fillStyle = "#fbbf24";
  ctx.fillRect(px, py, 30, 30);
  // Ennemis
  for (const e of enemies) {
    if (e.hp <= 0) continue;
    ctx.fillStyle = "#6b7280";
    ctx.fillRect(e.x, e.y, e.w, e.h);
  }
  // HUD
  ctx.fillStyle = "#374151";
  ctx.fillRect(20, 15, 100, 12);
  ctx.fillStyle = "#00ff88";
  ctx.fillRect(20, 15, (playerHp / 5) * 100, 12);
  ctx.fillStyle = "white";
  ctx.font = "10px Arial";
  ctx.fillText("PV: " + playerHp, 25, 25);

  frame++;
  requestAnimationFrame(gameLoop);
}
gameLoop();
`,
        solution: `const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let px = 50, py = 180, playerHp = 5;
const bullets = [];
const enemyBullets = [];
const enemies = [{ x: 500, y: 180, w: 50, h: 50, hp: 5 }];
let frame = 0;
const keys = {};
window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
  if (e.key === " ") bullets.push({ x: px + 30, y: py + 12, w: 12, h: 4 });
});
window.addEventListener("keyup", (e) => { keys[e.key] = false; });
function collides(a, b) { return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; }
function gameLoop() {
  ctx.fillStyle = "#0a0a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (keys["ArrowUp"]) py -= 4;
  if (keys["ArrowDown"]) py += 4;
  py = Math.max(0, Math.min(360, py));
  if (frame % 90 === 0) {
    for (const e of enemies) {
      if (e.hp > 0) enemyBullets.push({ x: e.x, y: e.y + 25, w: 10, h: 4 });
    }
  }
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].x += 8;
    ctx.fillStyle = "#00ff88";
    ctx.fillRect(bullets[i].x, bullets[i].y, 12, 4);
    if (bullets[i].x > 600) { bullets.splice(i, 1); continue; }
    for (const e of enemies) {
      if (e.hp > 0 && collides(bullets[i], e)) { e.hp--; bullets.splice(i, 1); break; }
    }
  }
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    enemyBullets[i].x -= 5;
    ctx.fillStyle = "#ff2244";
    ctx.fillRect(enemyBullets[i].x, enemyBullets[i].y, 10, 4);
    if (enemyBullets[i].x < 0) { enemyBullets.splice(i, 1); continue; }
    if (collides(enemyBullets[i], { x: px, y: py, w: 30, h: 30 })) { playerHp--; enemyBullets.splice(i, 1); }
  }
  ctx.fillStyle = "#fbbf24";
  ctx.fillRect(px, py, 30, 30);
  for (const e of enemies) {
    if (e.hp <= 0) continue;
    ctx.fillStyle = "#6b7280";
    ctx.fillRect(e.x, e.y, e.w, e.h);
  }
  ctx.fillStyle = "#374151";
  ctx.fillRect(20, 15, 100, 12);
  ctx.fillStyle = "#00ff88";
  ctx.fillRect(20, 15, (playerHp / 5) * 100, 12);
  ctx.fillStyle = "white";
  ctx.font = "10px Arial";
  ctx.fillText("PV: " + playerHp, 25, 25);
  frame++;
  requestAnimationFrame(gameLoop);
}
gameLoop();`,
        tests: [
            { type: "contains", expected: "enemyBullets.push" },
            { type: "match", expected: "playerHp--" },
        ],
        hint: "Les projectiles ennemis vont vers la gauche (x -= 5). Teste la collision avec le joueur.",
    },
];

addExercises("gamedev", exercises);
