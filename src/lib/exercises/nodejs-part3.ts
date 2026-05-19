import { addExercises } from "./registry";
import type { Exercise } from "./registry";

const exercises: Exercise[] = [
  // === PROMESSES & ASYNC/AWAIT (1-8) ===
  {
    id: "node_41",
    type: "intro",
    category: "Async",
    title: "Programmation asynchrone",
    description: "Node.js excelle dans les opérations asynchrones non-bloquantes.",
    content: `<h3>⏱️ Async — Le cœur de Node.js</h3>
<p>Node.js est <strong>non-bloquant</strong> : les opérations I/O (fichiers, réseau, BDD) ne bloquent pas le thread principal.</p>
<h4>3 façons de gérer l'asynchrone :</h4>
<pre><code>// 1. Callbacks (ancien)
fs.readFile('f.txt', (err, data) => { ... });

// 2. Promises
fetch('/api').then(res => res.json()).then(data => ...);

// 3. Async/Await (recommandé)
const data = await fetch('/api').then(r => r.json());</code></pre>`,
  },
  {
    id: "node_42",
    type: "code",
    category: "Async",
    title: "Créer une Promise",
    description: "Créez une promesse qui se résout après un délai.",
    instruction: "Créez une fonction <code>delay(ms)</code> qui retourne une <code>new Promise</code> se résolvant après <code>ms</code> millisecondes avec <code>setTimeout</code>.",
    code_template: `function delay(ms) {
  // Retournez une Promise
}`,
    solution: `function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}`,
    tests: [
      { type: "contains", expected: "new Promise" },
      { type: "contains", expected: "setTimeout" },
      { type: "contains", expected: "resolve" },
    ],
    hint: "new Promise((resolve) => setTimeout(resolve, ms)) crée un délai promisifié.",
  },
  {
    id: "node_43",
    type: "code",
    category: "Async",
    title: "Promise.all",
    description: "Exécutez plusieurs promesses en parallèle.",
    instruction: "Créez 3 promesses qui simulent des appels API avec des délais différents. Utilisez <code>Promise.all()</code> pour les exécuter en parallèle et affichez tous les résultats.",
    code_template: `async function fetchAll() {
  const fetchUsers = delay(100).then(() => ['Ulrich', 'Yumi']);
  const fetchScores = delay(200).then(() => [95, 88]);
  const fetchBadges = delay(150).then(() => ['Gold', 'Silver']);

  // Exécutez en parallèle avec Promise.all
}`,
    solution: `async function fetchAll() {
  const fetchUsers = delay(100).then(() => ['Ulrich', 'Yumi']);
  const fetchScores = delay(200).then(() => [95, 88]);
  const fetchBadges = delay(150).then(() => ['Gold', 'Silver']);

  const [users, scores, badges] = await Promise.all([fetchUsers, fetchScores, fetchBadges]);
  console.log(users, scores, badges);
}`,
    tests: [
      { type: "contains", expected: "Promise.all" },
      { type: "contains", expected: "await" },
      { type: "contains", expected: "[users, scores, badges]" },
    ],
    hint: "const [a, b, c] = await Promise.all([promA, promB, promC]) exécute tout en parallèle.",
  },
  {
    id: "node_44",
    type: "quiz",
    category: "Async",
    title: "Promise.all vs Promise.allSettled",
    description: "Quelle est la différence ?",
    options: [
      "Aucune différence",
      "Promise.all échoue si une seule promesse échoue, allSettled attend toutes les promesses",
      "allSettled est plus rapide",
      "Promise.all exécute en séquence, allSettled en parallèle",
    ],
    correct: 1,
    explanation: "Promise.all rejette immédiatement si une promesse échoue (fail-fast). Promise.allSettled attend que toutes les promesses soient terminées (fulfilled ou rejected) et retourne un tableau avec le status de chacune.",
  },
  {
    id: "node_45",
    type: "code",
    category: "Async",
    title: "Try/catch avec async/await",
    description: "Gérez les erreurs dans du code asynchrone.",
    instruction: "Créez une fonction <code>fetchUser(id)</code> async qui simule un appel API. Si l'id est <code>0</code>, rejetez avec <code>'Utilisateur non trouvé'</code>. Appelez la fonction dans un try/catch.",
    code_template: `function fetchUser(id) {
  return new Promise((resolve, reject) => {
    // Résolvez ou rejetez selon l'id
  });
}

async function main() {
  // Appelez fetchUser avec try/catch
}`,
    solution: `function fetchUser(id) {
  return new Promise((resolve, reject) => {
    if (id === 0) reject('Utilisateur non trouvé');
    else resolve({ id, name: 'Warrior' });
  });
}

async function main() {
  try {
    const user = await fetchUser(0);
    console.log(user);
  } catch (err) {
    console.error('Erreur:', err);
  }
}`,
    tests: [
      { type: "contains", expected: "reject(" },
      { type: "contains", expected: "resolve(" },
      { type: "contains", expected: "try {" },
      { type: "contains", expected: "catch (err)" },
      { type: "contains", expected: "await fetchUser" },
    ],
    hint: "reject() pour l'erreur, resolve() pour le succès. try/catch entoure l'await.",
  },
  {
    id: "node_46",
    type: "code",
    category: "Async",
    title: "Promisifier un callback",
    description: "Convertissez une fonction callback en Promise.",
    instruction: "Créez <code>readFilePromise(path)</code> qui enveloppe <code>fs.readFile</code> dans une <code>new Promise</code>. Résolvez avec les données ou rejetez avec l'erreur.",
    code_template: `const fs = require('fs');

function readFilePromise(path) {
  // Enveloppez fs.readFile dans une Promise
}`,
    solution: `const fs = require('fs');

function readFilePromise(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}`,
    tests: [
      { type: "contains", expected: "new Promise" },
      { type: "contains", expected: "fs.readFile" },
      { type: "contains", expected: "reject(err)" },
      { type: "contains", expected: "resolve(data)" },
    ],
    hint: "Enveloppez le callback dans new Promise((resolve, reject) => { ... }).",
  },
  {
    id: "node_47",
    type: "code",
    category: "Async",
    title: "Boucle async séquentielle",
    description: "Exécutez des opérations async en séquence dans une boucle.",
    instruction: "Créez une fonction <code>processItems(items)</code> qui itère sur un tableau et appelle <code>await processOne(item)</code> pour chaque élément <strong>séquentiellement</strong> (pas en parallèle).",
    code_template: `async function processOne(item) {
  await delay(100);
  console.log('Traité:', item);
}

async function processItems(items) {
  // Traitez chaque item séquentiellement
}`,
    solution: `async function processOne(item) {
  await delay(100);
  console.log('Traité:', item);
}

async function processItems(items) {
  for (const item of items) {
    await processOne(item);
  }
}`,
    tests: [
      { type: "contains", expected: "for (const item of items)" },
      { type: "contains", expected: "await processOne(item)" },
    ],
    hint: "for...of avec await dans le corps exécute chaque itération séquentiellement.",
  },
  {
    id: "node_48",
    type: "quiz",
    category: "Async",
    title: "L'Event Loop",
    description: "Quel est l'ordre d'exécution de ce code ?",
    options: [
      "A → B → C",
      "A → C → B",
      "C → A → B",
      "B → A → C",
    ],
    explanation: "L'event loop exécute d'abord le code synchrone (A), puis les microtasks (promesses = C), puis les macrotasks (setTimeout = B). Donc : A → C → B.",
    correct: 1,
  },
  // === EVENTS & STREAMS (9-13) ===
  {
    id: "node_49",
    type: "intro",
    category: "Events",
    title: "EventEmitter",
    description: "Node.js est fondé sur un système d'événements.",
    content: `<h3>📡 EventEmitter — Communication par événements</h3>
<pre><code>const EventEmitter = require('events');
const emitter = new EventEmitter();

// Écouter un événement
emitter.on('xana-attack', (sector) => {
  console.log(\`Attaque XANA dans le secteur \${sector} !\`);
});

// Émettre un événement
emitter.emit('xana-attack', 'Forêt');
// → "Attaque XANA dans le secteur Forêt !"

// Une seule fois
emitter.once('login', (user) => { ... });</code></pre>
<p>Beaucoup de modules Node.js héritent de EventEmitter : <code>http.Server</code>, <code>fs.ReadStream</code>, <code>net.Socket</code>...</p>`,
  },
  {
    id: "node_50",
    type: "code",
    category: "Events",
    title: "Créer un EventEmitter",
    description: "Utilisez EventEmitter pour gérer des événements.",
    instruction: "Créez un <code>EventEmitter</code>, ajoutez un listener sur l'événement <code>'alert'</code> qui affiche <code>Alerte: {message}</code>, puis émettez l'événement avec le message <strong>XANA détecté</strong>.",
    code_template: `const EventEmitter = require('events');
const emitter = new EventEmitter();

// Écoutez 'alert' et émettez`,
    solution: `const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.on('alert', (message) => {
  console.log(\`Alerte: \${message}\`);
});

emitter.emit('alert', 'XANA détecté');`,
    tests: [
      { type: "contains", expected: "emitter.on('alert'" },
      { type: "contains", expected: "emitter.emit('alert'" },
      { type: "contains", expected: "XANA détecté" },
    ],
    hint: "emitter.on(event, callback) pour écouter, emitter.emit(event, data) pour émettre.",
  },
  {
    id: "node_51",
    type: "code",
    category: "Events",
    title: "Classe avec EventEmitter",
    description: "Créez une classe qui hérite de EventEmitter.",
    instruction: "Créez une classe <code>Scanner</code> qui étend <code>EventEmitter</code>. Ajoutez une méthode <code>scan(sector)</code> qui émet l'événement <code>'found'</code> avec le secteur scanné.",
    code_template: `const EventEmitter = require('events');

class Scanner extends EventEmitter {
  // Méthode scan qui émet 'found'
}`,
    solution: `const EventEmitter = require('events');

class Scanner extends EventEmitter {
  scan(sector) {
    console.log(\`Scan du secteur \${sector}...\`);
    this.emit('found', sector);
  }
}`,
    tests: [
      { type: "contains", expected: "extends EventEmitter" },
      { type: "contains", expected: "this.emit('found'" },
      { type: "contains", expected: "scan(sector)" },
    ],
    hint: "extends EventEmitter, puis this.emit() dans la méthode pour émettre des événements.",
  },
  {
    id: "node_52",
    type: "intro",
    category: "Streams",
    title: "Les Streams",
    description: "Les streams traitent les données par morceaux au lieu de tout charger en mémoire.",
    content: `<h3>🌊 Streams — Traitement par flux</h3>
<p>Les streams sont essentiels pour traiter de <strong>gros fichiers</strong> sans saturer la mémoire :</p>
<pre><code>const fs = require('fs');

// Lire par morceaux
const readable = fs.createReadStream('big-file.txt');
readable.on('data', (chunk) => { ... });
readable.on('end', () => { ... });

// Écrire par morceaux
const writable = fs.createWriteStream('output.txt');
writable.write('Données...');
writable.end();

// Pipe : connecter un flux à un autre
readable.pipe(writable);</code></pre>
<p>4 types de streams : Readable, Writable, Duplex, Transform.</p>`,
  },
  {
    id: "node_53",
    type: "code",
    category: "Streams",
    title: "Lire un fichier avec stream",
    description: "Utilisez un ReadStream pour lire un gros fichier.",
    instruction: "Créez un <code>ReadStream</code> pour <code>'data.log'</code>. Comptez le nombre de morceaux (chunks) reçus et affichez le total à la fin.",
    code_template: `const fs = require('fs');

const stream = fs.createReadStream('data.log');
let chunks = 0;

// Comptez les chunks et affichez le total`,
    solution: `const fs = require('fs');

const stream = fs.createReadStream('data.log');
let chunks = 0;

stream.on('data', (chunk) => {
  chunks++;
});

stream.on('end', () => {
  console.log(\`Total: \${chunks} morceaux\`);
});`,
    tests: [
      { type: "contains", expected: "createReadStream" },
      { type: "contains", expected: "stream.on('data'" },
      { type: "contains", expected: "stream.on('end'" },
      { type: "contains", expected: "chunks++" },
    ],
    hint: "'data' émet chaque morceau, 'end' signale la fin du flux.",
  },
  // === NPM & PACKAGES (14-17) ===
  {
    id: "node_54",
    type: "intro",
    category: "npm",
    title: "npm — Gestionnaire de packages",
    description: "npm est le plus grand registre de packages JavaScript au monde.",
    content: `<h3>📦 npm — Packages et dépendances</h3>
<pre><code># Initialiser un projet
npm init -y

# Installer un package
npm install express        # dépendance
npm install -D nodemon     # dépendance de dev

# Scripts dans package.json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest"
  }
}

# Exécuter un script
npm run dev
npm start  // raccourci pour "start"</code></pre>
<p>Fichiers importants :</p>
<ul>
<li><code>package.json</code> — Métadonnées + dépendances</li>
<li><code>package-lock.json</code> — Versions exactes verrouillées</li>
<li><code>node_modules/</code> — Packages installés (gitignore !)</li>
</ul>`,
  },
  {
    id: "node_55",
    type: "code",
    category: "npm",
    title: "package.json",
    description: "Créez un fichier package.json.",
    instruction: "Créez un <code>package.json</code> avec le nom <code>lyoko-api</code>, version <code>1.0.0</code>, script <code>start</code> qui exécute <code>node server.js</code> et script <code>dev</code> qui exécute <code>nodemon server.js</code>.",
    code_template: `{
  // Complétez le package.json
}`,
    solution: `{
  "name": "lyoko-api",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}`,
    tests: [
      { type: "contains", expected: "\"name\": \"lyoko-api\"" },
      { type: "contains", expected: "\"version\": \"1.0.0\"" },
      { type: "contains", expected: "\"start\": \"node server.js\"" },
      { type: "contains", expected: "\"dev\": \"nodemon server.js\"" },
    ],
    hint: "Un package.json est un fichier JSON avec name, version, scripts, dependencies...",
  },
  {
    id: "node_56",
    type: "quiz",
    category: "npm",
    title: "dependencies vs devDependencies",
    description: "Quelle est la différence ?",
    options: [
      "Aucune, c'est juste de l'organisation",
      "dependencies sont pour la production, devDependencies uniquement pour le développement",
      "devDependencies s'installent plus vite",
      "dependencies sont gratuites, devDependencies sont payantes",
    ],
    correct: 1,
    explanation: "dependencies (npm install express) sont nécessaires en production. devDependencies (npm install -D nodemon) ne sont installées qu'en développement et exclues avec npm install --production.",
  },
  {
    id: "node_57",
    type: "code",
    category: "npm",
    title: "Fichier .env avec dotenv",
    description: "Gérez les variables d'environnement avec dotenv.",
    instruction: "Utilisez le package <code>dotenv</code> pour charger les variables depuis un fichier <code>.env</code>. Lisez <code>DB_HOST</code>, <code>DB_PORT</code> et <code>SECRET</code> depuis <code>process.env</code>.",
    code_template: `// Chargez dotenv et lisez les variables

const config = {
  // host, port, secret depuis process.env
};

console.log(config);`,
    solution: `require('dotenv').config();

const config = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  secret: process.env.SECRET,
};

console.log(config);`,
    tests: [
      { type: "contains", expected: "dotenv" },
      { type: "contains", expected: "process.env.DB_HOST" },
      { type: "contains", expected: "process.env.DB_PORT" },
      { type: "contains", expected: "process.env.SECRET" },
    ],
    hint: "require('dotenv').config() charge le .env, puis process.env.VAR pour accéder.",
  },
  // === SÉCURITÉ & BONNES PRATIQUES (18-20) ===
  {
    id: "node_58",
    type: "quiz",
    category: "Sécurité",
    title: "Sécurité des API",
    description: "Quelle pratique est la PLUS importante pour sécuriser une API Node.js ?",
    options: [
      "Utiliser des noms de routes cryptiques",
      "Valider et assainir toutes les entrées utilisateur",
      "Utiliser uniquement des requêtes GET",
      "Stocker les mots de passe en clair pour faciliter la récupération",
    ],
    correct: 1,
    explanation: "La validation des entrées est CRUCIALE. Toutes les données venant du client doivent être validées et assainies pour prévenir les injections SQL, XSS, et autres attaques. Utilisez des bibliothèques comme Joi ou Zod.",
  },
  {
    id: "node_59",
    type: "code",
    category: "Sécurité",
    title: "Validation avec Joi",
    description: "Validez les données d'entrée avec un schéma.",
    instruction: "Créez un schéma Joi pour valider un utilisateur : <code>name</code> (string, requis, min 2), <code>email</code> (email valide, requis), <code>age</code> (number, min 13, max 120).",
    code_template: `const Joi = require('joi');

const userSchema = Joi.object({
  // Définissez le schéma
});`,
    solution: `const Joi = require('joi');

const userSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  age: Joi.number().min(13).max(120),
});`,
    tests: [
      { type: "contains", expected: "Joi.object" },
      { type: "contains", expected: "Joi.string().min(2).required()" },
      { type: "contains", expected: "Joi.string().email().required()" },
      { type: "contains", expected: "Joi.number().min(13).max(120)" },
    ],
    hint: "Joi.string().min(n).required(), Joi.string().email(), Joi.number().min(n).max(n).",
  },
  {
    id: "node_60",
    type: "code",
    category: "Sécurité",
    title: "Hacher un mot de passe",
    description: "Utilisez bcrypt pour sécuriser les mots de passe.",
    instruction: "Créez deux fonctions : <code>hashPassword(password)</code> qui retourne le hash bcrypt avec 10 salt rounds, et <code>verifyPassword(password, hash)</code> qui compare et retourne un booléen.",
    code_template: `const bcrypt = require('bcrypt');

async function hashPassword(password) {
  // Hachez le mot de passe
}

async function verifyPassword(password, hash) {
  // Vérifiez le mot de passe
}`,
    solution: `const bcrypt = require('bcrypt');

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}`,
    tests: [
      { type: "contains", expected: "bcrypt.hash(password, 10)" },
      { type: "contains", expected: "bcrypt.compare(password, hash)" },
      { type: "contains", expected: "async function hashPassword" },
      { type: "contains", expected: "async function verifyPassword" },
    ],
    hint: "bcrypt.hash(pwd, saltRounds) pour hacher, bcrypt.compare(pwd, hash) pour vérifier.",
  },
];

addExercises("nodejs", exercises);
