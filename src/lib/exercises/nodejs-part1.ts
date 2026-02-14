import { addExercises } from ".";
import type { Exercise } from "@/app/exercises/[module]/exercise-client";

const exercises: Exercise[] = [
  // === INTRODUCTION NODE.JS (1-5) ===
  {
    id: "node_1",
    type: "intro",
    category: "Introduction",
    title: "Bienvenue dans Node.js",
    description: "Node.js permet d'exécuter du JavaScript côté serveur.",
    content: `<h3>🖥️ Node.js — JavaScript côté serveur</h3>
<p>Node.js est un <strong>environnement d'exécution JavaScript</strong> basé sur le moteur V8 de Chrome.</p>
<ul>
<li><strong>Non-bloquant</strong> — Modèle I/O asynchrone et event-driven</li>
<li><strong>npm</strong> — Le plus grand registre de packages au monde</li>
<li><strong>Full-stack JS</strong> — Même langage front et back</li>
<li><strong>Rapide</strong> — Idéal pour les APIs, temps réel, microservices</li>
</ul>
<pre><code>// hello.js
console.log("Hello depuis Node.js !");
// Exécuter : node hello.js</code></pre>`,
  },
  {
    id: "node_2",
    type: "quiz",
    category: "Introduction",
    title: "Qu'est-ce que Node.js ?",
    description: "Testez vos connaissances de base sur Node.js.",
    options: [
      "Un framework frontend comme React",
      "Un environnement d'exécution JavaScript côté serveur basé sur V8",
      "Un langage de programmation différent de JavaScript",
      "Un système de gestion de base de données",
    ],
    correct: 1,
    explanation: "Node.js est un runtime JavaScript côté serveur, construit sur le moteur V8 de Google Chrome. Il permet d'utiliser JavaScript pour créer des serveurs web, des outils CLI, des APIs, etc.",
  },
  {
    id: "node_3",
    type: "code",
    category: "Introduction",
    title: "Hello Node.js",
    description: "Écrivez votre premier script Node.js.",
    instruction: "Utilisez <code>console.log()</code> pour afficher <strong>Bienvenue sur le serveur Lyoko !</strong>.",
    code_template: `// Affichez le message de bienvenue
`,
    solution: `console.log("Bienvenue sur le serveur Lyoko !");`,
    tests: [
      { type: "contains", expected: "console.log" },
      { type: "contains", expected: "Bienvenue sur le serveur Lyoko" },
    ],
    hint: "console.log() fonctionne exactement comme dans le navigateur.",
  },
  {
    id: "node_4",
    type: "quiz",
    category: "Introduction",
    title: "Modèle de Node.js",
    description: "Quel modèle d'exécution utilise Node.js ?",
    options: [
      "Multi-thread synchrone",
      "Single-thread avec event loop (non-bloquant)",
      "Multi-processus parallèle",
      "Thread pool fixe de 100 threads",
    ],
    correct: 1,
    explanation: "Node.js utilise un seul thread avec une event loop. Les opérations I/O (fichiers, réseau, BDD) sont déléguées au système et un callback est appelé quand elles sont terminées. C'est ce qui le rend très efficace pour les serveurs.",
  },
  {
    id: "node_5",
    type: "code",
    category: "Introduction",
    title: "Variables d'environnement",
    description: "Accédez aux variables d'environnement avec process.env.",
    instruction: "Créez une constante <code>port</code> qui lit la variable d'environnement <code>PORT</code> avec <code>process.env.PORT</code>, avec une valeur par défaut de <code>3000</code>. Affichez <strong>Serveur sur le port {port}</strong>.",
    code_template: `// Lisez le port depuis les variables d'environnement
const port = 
console.log()`,
    solution: `const port = process.env.PORT || 3000;
console.log(\`Serveur sur le port \${port}\`);`,
    tests: [
      { type: "contains", expected: "process.env.PORT" },
      { type: "contains", expected: "|| 3000" },
      { type: "contains", expected: "Serveur sur le port" },
    ],
    hint: "process.env.PORT || 3000 donne le port de l'environnement ou 3000 par défaut.",
  },
  // === MODULES (6-10) ===
  {
    id: "node_6",
    type: "intro",
    category: "Modules",
    title: "Les modules Node.js",
    description: "Node.js utilise un système de modules pour organiser le code.",
    content: `<h3>📦 Modules — Organiser le code</h3>
<p>Deux systèmes de modules :</p>
<h4>CommonJS (CJS) — le classique</h4>
<pre><code>// math.js
module.exports = { add: (a, b) => a + b };

// app.js
const { add } = require('./math');</code></pre>
<h4>ES Modules (ESM) — le moderne</h4>
<pre><code>// math.mjs (ou "type": "module" dans package.json)
export const add = (a, b) => a + b;

// app.mjs
import { add } from './math.mjs';</code></pre>
<p>Modules intégrés : <code>fs</code>, <code>path</code>, <code>http</code>, <code>os</code>, <code>crypto</code>, <code>events</code>...</p>`,
  },
  {
    id: "node_7",
    type: "code",
    category: "Modules",
    title: "Exporter un module (CJS)",
    description: "Créez un module avec module.exports.",
    instruction: "Créez un module qui exporte un objet avec deux fonctions : <code>add(a, b)</code> qui retourne <code>a + b</code> et <code>multiply(a, b)</code> qui retourne <code>a * b</code>.",
    code_template: `// math.js — Exportez les fonctions

module.exports = {

};`,
    solution: `module.exports = {
  add: (a, b) => a + b,
  multiply: (a, b) => a * b,
};`,
    tests: [
      { type: "contains", expected: "module.exports" },
      { type: "contains", expected: "add" },
      { type: "contains", expected: "a + b" },
      { type: "contains", expected: "multiply" },
      { type: "contains", expected: "a * b" },
    ],
    hint: "module.exports = { nomFn: (params) => résultat, ... }",
  },
  {
    id: "node_8",
    type: "code",
    category: "Modules",
    title: "Importer un module (CJS)",
    description: "Utilisez require pour importer un module.",
    instruction: "Importez les fonctions <code>add</code> et <code>multiply</code> depuis le module <code>'./math'</code> avec require et destructuring. Affichez le résultat de <code>add(5, 3)</code> et <code>multiply(4, 7)</code>.",
    code_template: `// Importez depuis ./math

// Affichez les résultats`,
    solution: `const { add, multiply } = require('./math');

console.log(add(5, 3));
console.log(multiply(4, 7));`,
    tests: [
      { type: "contains", expected: "require('./math')" },
      { type: "contains", expected: "{ add, multiply }" },
      { type: "contains", expected: "console.log" },
    ],
    hint: "const { fn1, fn2 } = require('./module'); — destructuring à l'import.",
  },
  {
    id: "node_9",
    type: "code",
    category: "Modules",
    title: "ES Modules",
    description: "Utilisez la syntaxe import/export moderne.",
    instruction: "Réécrivez l'export et l'import en ES Modules. Exportez <code>greet</code> comme export nommé et <code>farewell</code> comme export par défaut.",
    code_template: `// greetings.mjs
// Export nommé + export par défaut

// app.mjs
// Importez les deux`,
    solution: `// greetings.mjs
export const greet = (name) => \`Bonjour, \${name} !\`;
const farewell = (name) => \`Au revoir, \${name} !\`;
export default farewell;

// app.mjs
import farewell, { greet } from './greetings.mjs';`,
    tests: [
      { type: "contains", expected: "export const greet" },
      { type: "contains", expected: "export default" },
      { type: "contains", expected: "import farewell" },
      { type: "contains", expected: "{ greet }" },
    ],
    hint: "export const fn = ... (nommé), export default fn (par défaut). Import : import default, { nommé } from '...'",
  },
  {
    id: "node_10",
    type: "quiz",
    category: "Modules",
    title: "require vs import",
    description: "Quelle est la différence principale ?",
    options: [
      "require est plus rapide que import",
      "import est synchrone, require est asynchrone",
      "require est CommonJS (dynamique, synchrone), import est ESM (statique, asynchrone)",
      "Il n'y a aucune différence",
    ],
    correct: 2,
    explanation: "require() est le système CommonJS : il charge les modules de manière synchrone et peut être appelé n'importe où. import est le système ES Modules : les imports sont analysés statiquement (avant l'exécution) et supportent le tree-shaking.",
  },
  // === FILE SYSTEM (11-15) ===
  {
    id: "node_11",
    type: "intro",
    category: "File System",
    title: "Le module fs",
    description: "Le module fs permet de lire et écrire des fichiers.",
    content: `<h3>📂 fs — Système de fichiers</h3>
<p>Node.js fournit le module <code>fs</code> pour manipuler les fichiers :</p>
<pre><code>const fs = require('fs');

// Synchrone (bloquant)
const data = fs.readFileSync('file.txt', 'utf8');

// Asynchrone avec callback
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});

// Asynchrone avec Promises (recommandé)
const fsPromises = require('fs').promises;
const data = await fsPromises.readFile('file.txt', 'utf8');</code></pre>`,
  },
  {
    id: "node_12",
    type: "code",
    category: "File System",
    title: "Lire un fichier (sync)",
    description: "Lisez un fichier de manière synchrone.",
    instruction: "Utilisez <code>fs.readFileSync</code> pour lire le contenu de <code>'config.json'</code> en UTF-8. Parsez le JSON et affichez le résultat.",
    code_template: `const fs = require('fs');

// Lisez et parsez config.json`,
    solution: `const fs = require('fs');

const raw = fs.readFileSync('config.json', 'utf8');
const config = JSON.parse(raw);
console.log(config);`,
    tests: [
      { type: "contains", expected: "fs.readFileSync" },
      { type: "contains", expected: "'config.json'" },
      { type: "contains", expected: "'utf8'" },
      { type: "contains", expected: "JSON.parse" },
    ],
    hint: "fs.readFileSync(path, 'utf8') retourne une string, puis JSON.parse() pour convertir en objet.",
  },
  {
    id: "node_13",
    type: "code",
    category: "File System",
    title: "Écrire un fichier",
    description: "Écrivez des données dans un fichier.",
    instruction: "Créez un objet <code>data</code> avec <code>{ name: 'XANA', power: 9000 }</code>. Utilisez <code>fs.writeFileSync</code> pour l'écrire dans <code>'enemy.json'</code> en JSON formaté (avec indentation de 2 espaces).",
    code_template: `const fs = require('fs');

const data = { name: 'XANA', power: 9000 };
// Écrivez dans enemy.json`,
    solution: `const fs = require('fs');

const data = { name: 'XANA', power: 9000 };
fs.writeFileSync('enemy.json', JSON.stringify(data, null, 2));`,
    tests: [
      { type: "contains", expected: "fs.writeFileSync" },
      { type: "contains", expected: "'enemy.json'" },
      { type: "contains", expected: "JSON.stringify(data, null, 2)" },
    ],
    hint: "JSON.stringify(obj, null, 2) produit du JSON formaté avec 2 espaces d'indentation.",
  },
  {
    id: "node_14",
    type: "code",
    category: "File System",
    title: "Lire un fichier (async/await)",
    description: "Lisez un fichier de manière asynchrone avec les promises.",
    instruction: "Utilisez <code>fs.promises.readFile</code> avec <code>async/await</code> pour lire <code>'data.txt'</code>. Enveloppez dans un try/catch et affichez le contenu ou l'erreur.",
    code_template: `const fs = require('fs').promises;

async function loadData() {
  // Lisez data.txt avec try/catch
}

loadData();`,
    solution: `const fs = require('fs').promises;

async function loadData() {
  try {
    const content = await fs.readFile('data.txt', 'utf8');
    console.log(content);
  } catch (err) {
    console.error('Erreur:', err.message);
  }
}

loadData();`,
    tests: [
      { type: "contains", expected: "await fs.readFile" },
      { type: "contains", expected: "try {" },
      { type: "contains", expected: "catch (err)" },
      { type: "contains", expected: "'utf8'" },
    ],
    hint: "await fs.readFile(path, 'utf8') dans un try/catch pour gérer les erreurs.",
  },
  {
    id: "node_15",
    type: "code",
    category: "File System",
    title: "Lister un répertoire",
    description: "Listez les fichiers d'un répertoire.",
    instruction: "Utilisez <code>fs.readdirSync</code> pour lister les fichiers du répertoire courant <code>'.'</code>. Filtrez uniquement les fichiers <code>.js</code> et affichez-les.",
    code_template: `const fs = require('fs');

// Listez les fichiers .js du répertoire courant`,
    solution: `const fs = require('fs');

const files = fs.readdirSync('.');
const jsFiles = files.filter(f => f.endsWith('.js'));
console.log(jsFiles);`,
    tests: [
      { type: "contains", expected: "fs.readdirSync" },
      { type: "contains", expected: ".filter(" },
      { type: "contains", expected: ".endsWith('.js')" },
    ],
    hint: "readdirSync('.') retourne un tableau de noms, filtrez avec .filter(f => f.endsWith('.js')).",
  },
  // === PATH & OS (16-20) ===
  {
    id: "node_16",
    type: "intro",
    category: "Modules natifs",
    title: "path & os",
    description: "Modules utilitaires pour les chemins et le système.",
    content: `<h3>🛤️ path — Manipulation de chemins</h3>
<pre><code>const path = require('path');

path.join('/users', 'lyoko', 'data.json')
// → '/users/lyoko/data.json'

path.resolve('src', 'index.js')
// → '/absolute/path/src/index.js'

path.extname('script.js')  // → '.js'
path.basename('/a/b/c.txt') // → 'c.txt'
path.dirname('/a/b/c.txt')  // → '/a/b'</code></pre>
<h3>💻 os — Informations système</h3>
<pre><code>const os = require('os');
os.platform()  // 'win32', 'linux', 'darwin'
os.cpus()      // infos sur les processeurs
os.totalmem()  // mémoire totale en octets
os.homedir()   // répertoire home de l'utilisateur</code></pre>`,
  },
  {
    id: "node_17",
    type: "code",
    category: "Modules natifs",
    title: "Construire un chemin",
    description: "Utilisez path.join pour construire des chemins.",
    instruction: "Utilisez <code>path.join</code> pour construire le chemin <code>__dirname</code> + <code>'data'</code> + <code>'users.json'</code>. Affichez le résultat.",
    code_template: `const path = require('path');

// Construisez le chemin vers data/users.json`,
    solution: `const path = require('path');

const filePath = path.join(__dirname, 'data', 'users.json');
console.log(filePath);`,
    tests: [
      { type: "contains", expected: "path.join" },
      { type: "contains", expected: "__dirname" },
      { type: "contains", expected: "'data'" },
      { type: "contains", expected: "'users.json'" },
    ],
    hint: "path.join() concatène des segments de chemin avec le bon séparateur selon l'OS.",
  },
  {
    id: "node_18",
    type: "code",
    category: "Modules natifs",
    title: "Informations fichier",
    description: "Extrayez des informations d'un chemin de fichier.",
    instruction: "Pour le chemin <code>'/server/logs/access-2024.log'</code>, utilisez <code>path</code> pour extraire et afficher le <strong>nom de fichier</strong> (<code>basename</code>), l'<strong>extension</strong> (<code>extname</code>) et le <strong>répertoire</strong> (<code>dirname</code>).",
    code_template: `const path = require('path');
const filePath = '/server/logs/access-2024.log';

// Extrayez basename, extname, dirname`,
    solution: `const path = require('path');
const filePath = '/server/logs/access-2024.log';

console.log(path.basename(filePath));
console.log(path.extname(filePath));
console.log(path.dirname(filePath));`,
    tests: [
      { type: "contains", expected: "path.basename" },
      { type: "contains", expected: "path.extname" },
      { type: "contains", expected: "path.dirname" },
    ],
    hint: "basename = nom du fichier, extname = extension, dirname = répertoire parent.",
  },
  {
    id: "node_19",
    type: "code",
    category: "Modules natifs",
    title: "Infos système avec os",
    description: "Récupérez des informations sur le système.",
    instruction: "Utilisez le module <code>os</code> pour afficher la <strong>plateforme</strong> (<code>os.platform()</code>), le <strong>nombre de CPUs</strong> (<code>os.cpus().length</code>) et la <strong>mémoire totale en Mo</strong> (<code>Math.round(os.totalmem() / 1024 / 1024)</code>).",
    code_template: `const os = require('os');

// Affichez plateforme, CPUs, mémoire`,
    solution: `const os = require('os');

console.log('Plateforme:', os.platform());
console.log('CPUs:', os.cpus().length);
console.log('Mémoire:', Math.round(os.totalmem() / 1024 / 1024), 'Mo');`,
    tests: [
      { type: "contains", expected: "os.platform()" },
      { type: "contains", expected: "os.cpus()" },
      { type: "contains", expected: "os.totalmem()" },
    ],
    hint: "os.platform(), os.cpus().length, os.totalmem() / 1024 / 1024 pour les Mo.",
  },
  {
    id: "node_20",
    type: "quiz",
    category: "Modules natifs",
    title: "path.join vs path.resolve",
    description: "Quelle est la différence entre path.join et path.resolve ?",
    options: [
      "Il n'y a aucune différence",
      "join concatène des segments, resolve retourne toujours un chemin absolu",
      "resolve est plus rapide que join",
      "join fonctionne uniquement sur Windows",
    ],
    correct: 1,
    explanation: "path.join() concatène simplement les segments avec le bon séparateur. path.resolve() traite les segments de droite à gauche et retourne toujours un chemin absolu, comme si on faisait des 'cd' successifs.",
  },
];

addExercises("nodejs", exercises);
