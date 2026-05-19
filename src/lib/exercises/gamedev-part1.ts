import { addExercises } from "./registry";
import type { Exercise } from "./registry";

// Chapitre 1 — Le Canvas & la Boucle de Jeu (exercices 1-5)
const exercises: Exercise[] = [
    {
        id: "gd_c1_e1",
        title: "Ton premier Canvas",
        category: "Le Canvas",
        description: "Crée un canvas et dessine un rectangle — le début de ton jeu !",
        instruction: `Sélectionne le canvas avec <code>document.getElementById("game")</code>, récupère le contexte 2D avec <code>getContext("2d")</code>, puis dessine un rectangle bleu de 50×50 à la position (100, 100) avec <code>ctx.fillRect()</code>.`,
        code_template: `// 1. Récupère le canvas
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// 2. Choisis la couleur bleue
ctx.fillStyle = "#00d4ff";

// 3. Dessine un rectangle à (100, 100) de taille 50x50
// ✏️ Écris ctx.fillRect(x, y, largeur, hauteur)
`,
        solution: `const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
ctx.fillStyle = "#00d4ff";
ctx.fillRect(100, 100, 50, 50);`,
        tests: [
            { type: "contains", expected: "fillRect" },
            { type: "contains", expected: 'getElementById("game")' },
        ],
        hint: "fillRect prend 4 arguments : x, y, largeur, hauteur",
        help_steps: [
            "1. Le canvas est déjà récupéré pour toi",
            "2. La couleur est déjà définie à #00d4ff",
            '3. Écris <code>ctx.fillRect(100, 100, 50, 50);</code>',
        ],
    },
    {
        id: "gd_c1_e2",
        title: "Dessiner le décor",
        category: "Le Canvas",
        description: "Dessine un ciel nocturne et un sol — le territoire de Lyoko !",
        instruction: `Dessine un fond noir pour le ciel (couvre tout le canvas 600×400), puis un sol vert <code>#00ff88</code> en bas (rectangle de 0, 350 à 600×50). Astuce : utilise <code>canvas.width</code> et <code>canvas.height</code>.`,
        code_template: `const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// 1. Dessine le ciel noir (tout le canvas)
ctx.fillStyle = "#0a0a2e";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// 2. Dessine le sol vert en bas
// ✏️ Change la couleur à "#00ff88" et dessine un rect de 50px de haut en bas
`,
        solution: `const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
ctx.fillStyle = "#0a0a2e";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "#00ff88";
ctx.fillRect(0, 350, canvas.width, 50);`,
        tests: [
            { type: "contains", expected: "#00ff88" },
            { type: "match", expected: "fillRect.*350" },
        ],
        hint: "Le sol commence à y=350 et fait 50px de haut (350+50=400 = hauteur du canvas)",
    },
    {
        id: "gd_c1_e3",
        title: "Dessiner des étoiles",
        category: "Le Canvas",
        description: "Ajoute des étoiles au ciel avec des cercles — utilise arc() !",
        instruction: `Après le fond noir, dessine 3 étoiles blanches à des positions différentes. Utilise <code>ctx.beginPath()</code>, <code>ctx.arc(x, y, rayon, 0, Math.PI * 2)</code> et <code>ctx.fill()</code> pour chaque étoile.`,
        code_template: `const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Fond
ctx.fillStyle = "#0a0a2e";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Étoiles blanches
ctx.fillStyle = "white";

// Étoile 1 à (50, 30) rayon 2
ctx.beginPath();
ctx.arc(50, 30, 2, 0, Math.PI * 2);
ctx.fill();

// ✏️ Dessine 2 autres étoiles à (200, 80) et (450, 50)
`,
        solution: `const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
ctx.fillStyle = "#0a0a2e";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "white";
ctx.beginPath();
ctx.arc(50, 30, 2, 0, Math.PI * 2);
ctx.fill();
ctx.beginPath();
ctx.arc(200, 80, 2, 0, Math.PI * 2);
ctx.fill();
ctx.beginPath();
ctx.arc(450, 50, 2, 0, Math.PI * 2);
ctx.fill();`,
        tests: [
            { type: "match", expected: "arc.*200.*80" },
            { type: "match", expected: "arc.*450.*50" },
        ],
        hint: "Chaque étoile nécessite beginPath(), arc(), puis fill()",
    },
    {
        id: "gd_c1_e4",
        title: "La boucle de jeu",
        category: "Le Canvas",
        description: "Anime un rectangle qui bouge — la magie de requestAnimationFrame !",
        instruction: `Crée une variable <code>x = 0</code>, puis une fonction <code>gameLoop()</code> qui : 1) efface le canvas, 2) dessine un carré bleu à la position x, 3) incrémente x de 2, 4) rappelle <code>requestAnimationFrame(gameLoop)</code>. Appelle <code>gameLoop()</code> pour lancer l'animation.`,
        code_template: `const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let x = 0;

function gameLoop() {
  // 1. Efface tout le canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 2. Dessine un carré bleu à (x, 180)
  ctx.fillStyle = "#00d4ff";
  ctx.fillRect(x, 180, 30, 30);

  // 3. Déplace vers la droite
  // ✏️ Incrémente x de 2

  // 4. Relance l'animation
  // ✏️ Appelle requestAnimationFrame(gameLoop)
}

// ✏️ Lance la boucle !
`,
        solution: `const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let x = 0;
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#00d4ff";
  ctx.fillRect(x, 180, 30, 30);
  x += 2;
  requestAnimationFrame(gameLoop);
}
gameLoop();`,
        tests: [
            { type: "contains", expected: "requestAnimationFrame" },
            { type: "contains", expected: "clearRect" },
            { type: "match", expected: "x\\s*\\+=\\s*2" },
        ],
        hint: "requestAnimationFrame(gameLoop) rappelle la fonction ~60 fois par seconde",
        help_steps: [
            "1. Ajoute <code>x += 2;</code> après le fillRect",
            "2. Ajoute <code>requestAnimationFrame(gameLoop);</code> à la fin de la fonction",
            "3. Appelle <code>gameLoop();</code> après la définition de la fonction",
        ],
    },
    {
        id: "gd_c1_e5",
        title: "Un carré qui rebondit",
        category: "Le Canvas",
        description: "Fais rebondir le carré sur les bords du canvas !",
        instruction: `Modifie la boucle de jeu : ajoute une variable <code>vitesse = 3</code>. Dans la boucle, déplace x avec <code>x += vitesse</code>. Si le carré touche le bord droit (<code>x + 30 >= canvas.width</code>) ou gauche (<code>x <= 0</code>), inverse la vitesse : <code>vitesse = -vitesse</code>.`,
        code_template: `const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let x = 50;
let vitesse = 3;

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Fond
  ctx.fillStyle = "#0a0a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Carré
  ctx.fillStyle = "#00d4ff";
  ctx.fillRect(x, 180, 30, 30);

  // ✏️ Déplace le carré avec : x += vitesse

  // ✏️ Si x + 30 >= canvas.width OU x <= 0, inverse la vitesse

  requestAnimationFrame(gameLoop);
}
gameLoop();
`,
        solution: `const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let x = 50;
let vitesse = 3;
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0a0a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#00d4ff";
  ctx.fillRect(x, 180, 30, 30);
  x += vitesse;
  if (x + 30 >= canvas.width || x <= 0) {
    vitesse = -vitesse;
  }
  requestAnimationFrame(gameLoop);
}
gameLoop();`,
        tests: [
            { type: "match", expected: "x\\s*\\+=\\s*vitesse" },
            { type: "match", expected: "vitesse\\s*=\\s*-\\s*vitesse" },
        ],
        hint: "Inverser la vitesse = changer son signe. Si vitesse = 3, -vitesse = -3.",
        help_steps: [
            "1. Ajoute <code>x += vitesse;</code>",
            "2. Ajoute <code>if (x + 30 >= canvas.width || x <= 0) { vitesse = -vitesse; }</code>",
        ],
    },
];

addExercises("gamedev", exercises);
