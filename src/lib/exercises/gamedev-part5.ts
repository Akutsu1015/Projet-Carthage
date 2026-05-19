import { addExercises } from "./registry";
import type { Exercise } from "./registry";

// Chapitre 5 — Ennemis & IA (exercices 21-25)
const exercises: Exercise[] = [
    {
        id: "gd_c5_e1",
        title: "Ennemi patrouilleur",
        category: "Intelligence Artificielle",
        description: "Un Kankrelat patrouille de gauche à droite !",
        instruction: `Crée un ennemi qui va-et-vient entre x=300 et x=500. Utilise <code>enemy.dir</code> et inverse-le aux bornes avec <code>enemy.dir *= -1</code>.`,
        code_template: `const canvas = document.getElementById("game");\nconst ctx = canvas.getContext("2d");\nconst enemy = { x: 400, y: 200, w: 40, h: 30, speed: 2, dir: 1 };\nfunction gameLoop() {\n  ctx.fillStyle = "#0a0a2e";\n  ctx.fillRect(0, 0, canvas.width, canvas.height);\n  // ✏️ enemy.x += enemy.speed * enemy.dir\n  // ✏️ if (enemy.x >= 500 || enemy.x <= 300) enemy.dir *= -1\n  ctx.fillStyle = "#8b5e3c";\n  ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);\n  ctx.fillStyle = "#ff2244";\n  ctx.beginPath(); ctx.arc(enemy.x+20, enemy.y+10, 6, 0, Math.PI*2); ctx.fill();\n  requestAnimationFrame(gameLoop);\n}\ngameLoop();`,
        solution: `const canvas = document.getElementById("game");\nconst ctx = canvas.getContext("2d");\nconst enemy = { x: 400, y: 200, w: 40, h: 30, speed: 2, dir: 1 };\nfunction gameLoop() {\n  ctx.fillStyle = "#0a0a2e";\n  ctx.fillRect(0, 0, canvas.width, canvas.height);\n  enemy.x += enemy.speed * enemy.dir;\n  if (enemy.x >= 500 || enemy.x <= 300) enemy.dir *= -1;\n  ctx.fillStyle = "#8b5e3c";\n  ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);\n  ctx.fillStyle = "#ff2244";\n  ctx.beginPath(); ctx.arc(enemy.x+20, enemy.y+10, 6, 0, Math.PI*2); ctx.fill();\n  requestAnimationFrame(gameLoop);\n}\ngameLoop();`,
        tests: [{ type: "match", expected: "dir\\s*\\*=\\s*-1" }],
        hint: "dir *= -1 inverse la direction",
    },
    {
        id: "gd_c5_e2",
        title: "Ennemi poursuiveur",
        category: "Intelligence Artificielle",
        description: "Le Blok te traque — il se rapproche de toi !",
        instruction: `L'ennemi compare sa position à celle du joueur. Si <code>enemy.x < px</code> → avance. Si <code>enemy.x > px</code> → recule. Pareil pour Y.`,
        code_template: `const canvas = document.getElementById("game");\nconst ctx = canvas.getContext("2d");\nlet px = 280, py = 180;\nconst enemy = { x: 50, y: 50, speed: 1.5 };\nconst keys = {};\nwindow.addEventListener("keydown", (e) => { keys[e.key] = true; });\nwindow.addEventListener("keyup", (e) => { keys[e.key] = false; });\nfunction gameLoop() {\n  ctx.fillStyle = "#0a0a2e";\n  ctx.fillRect(0, 0, canvas.width, canvas.height);\n  if (keys["ArrowLeft"]) px -= 4;\n  if (keys["ArrowRight"]) px += 4;\n  if (keys["ArrowUp"]) py -= 4;\n  if (keys["ArrowDown"]) py += 4;\n  // ✏️ Si enemy.x < px → enemy.x += enemy.speed (et inversement)\n  // ✏️ Si enemy.y < py → enemy.y += enemy.speed (et inversement)\n  ctx.fillStyle = "#fbbf24";\n  ctx.fillRect(px, py, 30, 30);\n  ctx.fillStyle = "#6b7280";\n  ctx.fillRect(enemy.x, enemy.y, 40, 40);\n  requestAnimationFrame(gameLoop);\n}\ngameLoop();`,
        solution: `const canvas = document.getElementById("game");\nconst ctx = canvas.getContext("2d");\nlet px = 280, py = 180;\nconst enemy = { x: 50, y: 50, speed: 1.5 };\nconst keys = {};\nwindow.addEventListener("keydown", (e) => { keys[e.key] = true; });\nwindow.addEventListener("keyup", (e) => { keys[e.key] = false; });\nfunction gameLoop() {\n  ctx.fillStyle = "#0a0a2e";\n  ctx.fillRect(0, 0, canvas.width, canvas.height);\n  if (keys["ArrowLeft"]) px -= 4;\n  if (keys["ArrowRight"]) px += 4;\n  if (keys["ArrowUp"]) py -= 4;\n  if (keys["ArrowDown"]) py += 4;\n  if (enemy.x < px) enemy.x += enemy.speed;\n  if (enemy.x > px) enemy.x -= enemy.speed;\n  if (enemy.y < py) enemy.y += enemy.speed;\n  if (enemy.y > py) enemy.y -= enemy.speed;\n  ctx.fillStyle = "#fbbf24";\n  ctx.fillRect(px, py, 30, 30);\n  ctx.fillStyle = "#6b7280";\n  ctx.fillRect(enemy.x, enemy.y, 40, 40);\n  requestAnimationFrame(gameLoop);\n}\ngameLoop();`,
        tests: [{ type: "match", expected: "enemy\\.x\\s*<\\s*px" }, { type: "match", expected: "enemy\\.y\\s*<\\s*py" }],
        hint: "Compare chaque axe séparément",
    },
    {
        id: "gd_c5_e3",
        title: "Spawner de vagues",
        category: "Intelligence Artificielle",
        description: "Les ennemis arrivent par vagues !",
        instruction: `Toutes les 120 frames, ajoute 3 ennemis à droite avec <code>enemies.push()</code>. Chaque ennemi avance vers la gauche. Supprime-les quand ils sortent.`,
        code_template: `const canvas = document.getElementById("game");\nconst ctx = canvas.getContext("2d");\nconst enemies = [];\nlet frame = 0, wave = 0;\nfunction gameLoop() {\n  ctx.fillStyle = "#0a0a2e";\n  ctx.fillRect(0, 0, canvas.width, canvas.height);\n  if (frame % 120 === 0) {\n    wave++;\n    for (let i = 0; i < 3; i++) {\n      // ✏️ enemies.push({ x: 600, y: Math.random()*350, speed: 1+Math.random()*2 })\n    }\n  }\n  for (let i = enemies.length-1; i >= 0; i--) {\n    const e = enemies[i];\n    e.x -= e.speed;\n    ctx.fillStyle = "#6b7280";\n    ctx.fillRect(e.x, e.y, 35, 35);\n    // ✏️ if (e.x < -40) enemies.splice(i, 1)\n  }\n  ctx.fillStyle = "white"; ctx.font = "14px Arial";\n  ctx.fillText("Vague: "+wave+" | Ennemis: "+enemies.length, 20, 25);\n  frame++;\n  requestAnimationFrame(gameLoop);\n}\ngameLoop();`,
        solution: `const canvas = document.getElementById("game");\nconst ctx = canvas.getContext("2d");\nconst enemies = [];\nlet frame = 0, wave = 0;\nfunction gameLoop() {\n  ctx.fillStyle = "#0a0a2e";\n  ctx.fillRect(0, 0, canvas.width, canvas.height);\n  if (frame % 120 === 0) {\n    wave++;\n    for (let i = 0; i < 3; i++) {\n      enemies.push({ x: 600, y: Math.random()*350, speed: 1+Math.random()*2 });\n    }\n  }\n  for (let i = enemies.length-1; i >= 0; i--) {\n    const e = enemies[i];\n    e.x -= e.speed;\n    ctx.fillStyle = "#6b7280";\n    ctx.fillRect(e.x, e.y, 35, 35);\n    if (e.x < -40) enemies.splice(i, 1);\n  }\n  ctx.fillStyle = "white"; ctx.font = "14px Arial";\n  ctx.fillText("Vague: "+wave+" | Ennemis: "+enemies.length, 20, 25);\n  frame++;\n  requestAnimationFrame(gameLoop);\n}\ngameLoop();`,
        tests: [{ type: "contains", expected: "enemies.push" }, { type: "contains", expected: "enemies.splice" }],
        hint: "Push crée, splice supprime",
    },
    {
        id: "gd_c5_e4",
        title: "Machine à états",
        category: "Intelligence Artificielle",
        description: "Le Blok a un cerveau — patrol, chase, attack !",
        instruction: `Selon la distance au joueur : < 80 → "attack", < 200 → "chase", sinon → "patrol". Le patrol va-et-vient, le chase poursuit, l'attack reste sur place.`,
        code_template: `const canvas = document.getElementById("game");\nconst ctx = canvas.getContext("2d");\nlet px = 100, py = 200;\nconst enemy = { x: 400, y: 200, state: "patrol", dir: 1 };\nconst keys = {};\nwindow.addEventListener("keydown", (e) => { keys[e.key] = true; });\nwindow.addEventListener("keyup", (e) => { keys[e.key] = false; });\nfunction dist(x1,y1,x2,y2) { return Math.sqrt((x2-x1)**2+(y2-y1)**2); }\nfunction gameLoop() {\n  ctx.fillStyle = "#0a0a2e";\n  ctx.fillRect(0, 0, canvas.width, canvas.height);\n  if (keys["ArrowLeft"]) px -= 4;\n  if (keys["ArrowRight"]) px += 4;\n  if (keys["ArrowUp"]) py -= 4;\n  if (keys["ArrowDown"]) py += 4;\n  const d = dist(px, py, enemy.x, enemy.y);\n  // ✏️ Si d < 80 → "attack", sinon si d < 200 → "chase", sinon → "patrol"\n  if (enemy.state === "patrol") { enemy.x += 1.5*enemy.dir; if (enemy.x>500||enemy.x<300) enemy.dir*=-1; }\n  else if (enemy.state === "chase") {\n    // ✏️ Poursuit le joueur\n  }\n  const colors = { patrol: "#6b7280", chase: "#d97706", attack: "#ff2244" };\n  ctx.fillStyle = colors[enemy.state]; ctx.fillRect(enemy.x, enemy.y, 40, 40);\n  ctx.fillStyle = "#fbbf24"; ctx.fillRect(px, py, 25, 25);\n  ctx.fillStyle = "white"; ctx.font = "14px Arial";\n  ctx.fillText("État: "+enemy.state, 20, 25);\n  requestAnimationFrame(gameLoop);\n}\ngameLoop();`,
        solution: `const canvas = document.getElementById("game");\nconst ctx = canvas.getContext("2d");\nlet px = 100, py = 200;\nconst enemy = { x: 400, y: 200, state: "patrol", dir: 1 };\nconst keys = {};\nwindow.addEventListener("keydown", (e) => { keys[e.key] = true; });\nwindow.addEventListener("keyup", (e) => { keys[e.key] = false; });\nfunction dist(x1,y1,x2,y2) { return Math.sqrt((x2-x1)**2+(y2-y1)**2); }\nfunction gameLoop() {\n  ctx.fillStyle = "#0a0a2e";\n  ctx.fillRect(0, 0, canvas.width, canvas.height);\n  if (keys["ArrowLeft"]) px -= 4;\n  if (keys["ArrowRight"]) px += 4;\n  if (keys["ArrowUp"]) py -= 4;\n  if (keys["ArrowDown"]) py += 4;\n  const d = dist(px, py, enemy.x, enemy.y);\n  if (d < 80) enemy.state = "attack";\n  else if (d < 200) enemy.state = "chase";\n  else enemy.state = "patrol";\n  if (enemy.state === "patrol") { enemy.x += 1.5*enemy.dir; if (enemy.x>500||enemy.x<300) enemy.dir*=-1; }\n  else if (enemy.state === "chase") {\n    if (enemy.x < px) enemy.x += 2;\n    if (enemy.x > px) enemy.x -= 2;\n    if (enemy.y < py) enemy.y += 2;\n    if (enemy.y > py) enemy.y -= 2;\n  }\n  const colors = { patrol: "#6b7280", chase: "#d97706", attack: "#ff2244" };\n  ctx.fillStyle = colors[enemy.state]; ctx.fillRect(enemy.x, enemy.y, 40, 40);\n  ctx.fillStyle = "#fbbf24"; ctx.fillRect(px, py, 25, 25);\n  ctx.fillStyle = "white"; ctx.font = "14px Arial";\n  ctx.fillText("État: "+enemy.state, 20, 25);\n  requestAnimationFrame(gameLoop);\n}\ngameLoop();`,
        tests: [{ type: "match", expected: "state\\s*=\\s*\"attack\"" }, { type: "match", expected: "state\\s*=\\s*\"chase\"" }],
        hint: "Teste la distance avec des if/else if",
    },
    {
        id: "gd_c5_e5",
        title: "Tir en éventail",
        category: "Intelligence Artificielle",
        description: "Le boss tire 3 projectiles en éventail !",
        instruction: `Toutes les 60 frames, tire 3 projectiles avec des angles différents (-0.5, 0, 0.5 radians). Utilise <code>Math.cos</code> et <code>Math.sin</code>.`,
        code_template: `const canvas = document.getElementById("game");\nconst ctx = canvas.getContext("2d");\nconst boss = { x: 500, y: 180 };\nconst bullets = [];\nlet frame = 0;\nfunction gameLoop() {\n  ctx.fillStyle = "#0a0a2e";\n  ctx.fillRect(0, 0, canvas.width, canvas.height);\n  if (frame % 60 === 0) {\n    const angles = [-0.5, 0, 0.5];\n    for (const a of angles) {\n      // ✏️ bullets.push({ x: boss.x, y: boss.y+30, vx: Math.cos(Math.PI+a)*4, vy: Math.sin(Math.PI+a)*4 })\n    }\n  }\n  for (let i = bullets.length-1; i >= 0; i--) {\n    const b = bullets[i]; b.x += b.vx; b.y += b.vy;\n    ctx.fillStyle = "#ff2244"; ctx.beginPath(); ctx.arc(b.x, b.y, 4, 0, Math.PI*2); ctx.fill();\n    if (b.x<-10||b.x>610||b.y<-10||b.y>410) bullets.splice(i,1);\n  }\n  ctx.fillStyle = "#4b0082"; ctx.fillRect(boss.x, boss.y, 60, 60);\n  frame++;\n  requestAnimationFrame(gameLoop);\n}\ngameLoop();`,
        solution: `const canvas = document.getElementById("game");\nconst ctx = canvas.getContext("2d");\nconst boss = { x: 500, y: 180 };\nconst bullets = [];\nlet frame = 0;\nfunction gameLoop() {\n  ctx.fillStyle = "#0a0a2e";\n  ctx.fillRect(0, 0, canvas.width, canvas.height);\n  if (frame % 60 === 0) {\n    const angles = [-0.5, 0, 0.5];\n    for (const a of angles) {\n      bullets.push({ x: boss.x, y: boss.y+30, vx: Math.cos(Math.PI+a)*4, vy: Math.sin(Math.PI+a)*4 });\n    }\n  }\n  for (let i = bullets.length-1; i >= 0; i--) {\n    const b = bullets[i]; b.x += b.vx; b.y += b.vy;\n    ctx.fillStyle = "#ff2244"; ctx.beginPath(); ctx.arc(b.x, b.y, 4, 0, Math.PI*2); ctx.fill();\n    if (b.x<-10||b.x>610||b.y<-10||b.y>410) bullets.splice(i,1);\n  }\n  ctx.fillStyle = "#4b0082"; ctx.fillRect(boss.x, boss.y, 60, 60);\n  frame++;\n  requestAnimationFrame(gameLoop);\n}\ngameLoop();`,
        tests: [{ type: "contains", expected: "Math.cos" }, { type: "contains", expected: "bullets.push" }],
        hint: "Math.cos donne la composante X, Math.sin la composante Y",
    },
];

addExercises("gamedev", exercises);
