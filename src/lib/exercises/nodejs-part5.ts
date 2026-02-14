import { addExercises } from ".";
import type { Exercise } from "@/app/exercises/[module]/exercise-client";

const exercises: Exercise[] = [
  // === STREAMS (81-85) ===
  {
    id: "node_81",
    type: "intro",
    category: "Streams",
    title: "Streams Node.js",
    description: "Traitez de grandes quantités de données efficacement.",
    content: `<h3>🌊 Streams</h3>
<p>Les Streams permettent de traiter des données <strong>morceau par morceau</strong> sans tout charger en mémoire.</p>
<pre><code>const fs = require('fs');
const { Transform, pipeline } = require('stream');

// Readable stream (lecture)
const readable = fs.createReadStream('gros-fichier.txt', { encoding: 'utf8' });

// Writable stream (écriture)
const writable = fs.createWriteStream('output.txt');

// Pipe : connecter lecture → écriture
readable.pipe(writable);

// Transform stream (modification en transit)
const upper = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase());
  }
});

// Pipeline avec gestion d'erreurs
pipeline(readable, upper, writable, (err) => {
  if (err) console.error('Pipeline échoué:', err);
  else console.log('Pipeline terminé');
});</code></pre>`,
  },
  {
    id: "node_82",
    type: "code",
    category: "Streams",
    title: "Lire un fichier en stream",
    description: "Lisez un gros fichier sans surcharger la mémoire.",
    instruction: "Créez un <code>Readable stream</code> avec <code>fs.createReadStream</code> pour lire un fichier. Écoutez les events <code>'data'</code> (comptez les chunks), <code>'end'</code> (affichez le total), et <code>'error'</code>.",
    code_template: `const fs = require('fs');

// Lecture par stream
`,
    solution: `const fs = require('fs');

const stream = fs.createReadStream('data.txt', { encoding: 'utf8', highWaterMark: 1024 });
let chunks = 0;
let totalSize = 0;

stream.on('data', (chunk) => {
  chunks++;
  totalSize += chunk.length;
  console.log(\`Chunk \${chunks}: \${chunk.length} caractères\`);
});

stream.on('end', () => {
  console.log(\`Terminé: \${chunks} chunks, \${totalSize} caractères total\`);
});

stream.on('error', (err) => {
  console.error('Erreur:', err.message);
});`,
    tests: [
      { expected: "createReadStream", type: "contains" },
      { expected: "on('data'", type: "contains" },
      { expected: "on('end'", type: "contains" },
      { expected: "on('error'", type: "contains" },
    ],
  },
  {
    id: "node_83",
    type: "code",
    category: "Streams",
    title: "Transform stream",
    description: "Transformez des données en transit.",
    instruction: "Créez un <code>Transform</code> stream qui convertit chaque ligne en JSON : chaque ligne <strong>\"nom,age\"</strong> devient <strong>{\"nom\":\"...\",\"age\":...}</strong>. Utilisez <code>pipeline</code> pour connecter un ReadStream → Transform → WriteStream.",
    code_template: `const { Transform, pipeline } = require('stream');
const fs = require('fs');

// Transform CSV vers JSON
`,
    solution: `const { Transform, pipeline } = require('stream');
const fs = require('fs');

const csvToJson = new Transform({
  transform(chunk, encoding, callback) {
    const lines = chunk.toString().split('\\n').filter(l => l.trim());
    const json = lines.map(line => {
      const [nom, age] = line.split(',');
      return JSON.stringify({ nom: nom.trim(), age: parseInt(age) });
    }).join('\\n') + '\\n';
    callback(null, json);
  }
});

pipeline(
  fs.createReadStream('users.csv'),
  csvToJson,
  fs.createWriteStream('users.json'),
  (err) => {
    if (err) console.error('Erreur:', err);
    else console.log('Conversion terminée');
  }
);`,
    tests: [
      { expected: "new Transform", type: "contains" },
      { expected: "transform(chunk", type: "contains" },
      { expected: "pipeline(", type: "contains" },
      { expected: "callback(null", type: "contains" },
    ],
  },
  {
    id: "node_84",
    type: "quiz",
    category: "Streams",
    title: "Types de streams",
    description: "Quels sont les 4 types de streams en Node.js ?",
    options: [
      "Input, Output, Error, Log",
      "Readable, Writable, Duplex, Transform",
      "Read, Write, Pipe, Close",
      "Buffer, String, Object, Binary",
    ],
    correct: 1,
    explanation: "Node.js a 4 types de streams : Readable (lecture), Writable (écriture), Duplex (lecture ET écriture, comme une socket TCP), et Transform (Duplex qui modifie les données en transit, comme la compression gzip).",
  },
  {
    id: "node_85",
    type: "code",
    category: "Streams",
    title: "Stream HTTP",
    description: "Streamez une réponse HTTP.",
    instruction: "Créez un serveur HTTP qui stream un gros fichier en réponse au lieu de le charger entièrement en mémoire. Utilisez <code>fs.createReadStream</code> pipé dans <code>res</code>. Gérez l'erreur 404 si le fichier n'existe pas.",
    code_template: `const http = require('http');
const fs = require('fs');
const path = require('path');

// Serveur avec streaming de fichier
`,
    solution: `const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  const filePath = path.join(__dirname, 'public', req.url);
  
  const stream = fs.createReadStream(filePath);
  
  stream.on('error', (err) => {
    if (err.code === 'ENOENT') {
      res.writeHead(404);
      res.end('Fichier non trouvé');
    } else {
      res.writeHead(500);
      res.end('Erreur serveur');
    }
  });
  
  stream.pipe(res);
});

server.listen(3000, () => console.log('Serveur stream sur :3000'));`,
    tests: [
      { expected: "createReadStream", type: "contains" },
      { expected: ".pipe(res)", type: "contains" },
      { expected: "stream.on('error'", type: "contains" },
    ],
  },

  // === WORKER THREADS (86-88) ===
  {
    id: "node_86",
    type: "intro",
    category: "Worker Threads",
    title: "Worker Threads",
    description: "Exécutez du code CPU-intensif en parallèle.",
    content: `<h3>🔧 Worker Threads</h3>
<p>Node.js est single-threaded, mais les <strong>Worker Threads</strong> permettent d'exécuter du code CPU-intensif dans des threads séparés.</p>
<pre><code>const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
  // Thread principal
  const worker = new Worker(__filename, { workerData: 1000000 });
  worker.on('message', (result) => console.log('Résultat:', result));
  worker.on('error', (err) => console.error(err));
} else {
  // Worker thread
  const n = workerData;
  let sum = 0;
  for (let i = 0; i < n; i++) sum += i;
  parentPort.postMessage(sum);
}</code></pre>`,
  },
  {
    id: "node_87",
    type: "code",
    category: "Worker Threads",
    title: "Worker simple",
    description: "Déléguez un calcul lourd à un Worker.",
    instruction: "Créez un fichier qui utilise <code>Worker</code> pour calculer les nombres premiers jusqu'à N dans un thread séparé. Le main thread envoie N au worker, le worker calcule et renvoie le résultat via <code>postMessage</code>.",
    code_template: `const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

// Calcul de nombres premiers dans un Worker
`,
    solution: `const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
  console.log('Main: lancement du worker...');
  const worker = new Worker(__filename, { workerData: 100000 });
  
  worker.on('message', (primes) => {
    console.log(\`Main: \${primes.length} nombres premiers trouvés\`);
  });
  worker.on('error', console.error);
  worker.on('exit', (code) => console.log('Worker terminé, code:', code));
} else {
  const max = workerData;
  const primes = [];
  for (let n = 2; n <= max; n++) {
    let isPrime = true;
    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) { isPrime = false; break; }
    }
    if (isPrime) primes.push(n);
  }
  parentPort.postMessage(primes);
}`,
    tests: [
      { expected: "new Worker", type: "contains" },
      { expected: "isMainThread", type: "contains" },
      { expected: "parentPort.postMessage", type: "contains" },
      { expected: "workerData", type: "contains" },
    ],
  },
  {
    id: "node_88",
    type: "quiz",
    category: "Worker Threads",
    title: "Worker Threads vs Cluster",
    description: "Quelle est la différence ?",
    options: [
      "Aucune différence",
      "Worker Threads partagent la mémoire dans un même processus; Cluster crée des processus séparés",
      "Cluster est plus rapide",
      "Worker Threads sont dépréciés",
    ],
    correct: 1,
    explanation: "Worker Threads créent des threads dans le même processus Node.js, avec accès à la mémoire partagée (SharedArrayBuffer). Le module Cluster crée des processus Node.js séparés (forks), chacun avec sa propre mémoire, idéal pour utiliser tous les cœurs CPU d'un serveur HTTP.",
  },

  // === SÉCURITÉ (89-93) ===
  {
    id: "node_89",
    type: "intro",
    category: "Sécurité",
    title: "Sécurité Node.js",
    description: "Protégez vos applications web.",
    content: `<h3>🔒 Sécurité</h3>
<pre><code>// Helmet — Headers HTTP sécurisés
const helmet = require('helmet');
app.use(helmet());

// Rate limiting
const rateLimit = require('express-rate-limit');
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// CORS
const cors = require('cors');
app.use(cors({ origin: 'https://monsite.fr' }));

// Validation des entrées
const { body, validationResult } = require('express-validator');
app.post('/user',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors);
  }
);

// Hachage de mot de passe
const bcrypt = require('bcrypt');
const hash = await bcrypt.hash(password, 12);
const match = await bcrypt.compare(password, hash);

// Protection CSRF, XSS, SQL Injection...</code></pre>`,
  },
  {
    id: "node_90",
    type: "code",
    category: "Sécurité",
    title: "Hachage de mot de passe",
    description: "Hachez et vérifiez des mots de passe.",
    instruction: "Créez deux fonctions async : <code>hashPassword(password)</code> qui retourne le hash bcrypt (salt rounds: 12), et <code>verifyPassword(password, hash)</code> qui retourne true/false. Testez les deux.",
    code_template: `const bcrypt = require('bcrypt');

// Fonctions de hachage
`,
    solution: `const bcrypt = require('bcrypt');

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// Test
(async () => {
  const hash = await hashPassword('MonMotDePasse123');
  console.log('Hash:', hash);
  
  const valid = await verifyPassword('MonMotDePasse123', hash);
  console.log('Valide:', valid); // true
  
  const invalid = await verifyPassword('mauvais', hash);
  console.log('Invalide:', invalid); // false
})();`,
    tests: [
      { expected: "bcrypt.hash", type: "contains" },
      { expected: "bcrypt.compare", type: "contains" },
      { expected: "async function hashPassword", type: "contains" },
    ],
  },
  {
    id: "node_91",
    type: "code",
    category: "Sécurité",
    title: "Rate Limiter",
    description: "Limitez les requêtes par IP.",
    instruction: "Créez un middleware Express <code>rateLimiter</code> maison (sans bibliothèque) qui limite chaque IP à 10 requêtes par minute. Utilisez un <code>Map</code> pour stocker les compteurs. Retournez 429 si la limite est dépassée.",
    code_template: `// Rate limiter middleware maison

`,
    solution: `const requestCounts = new Map();

function rateLimiter(maxRequests = 10, windowMs = 60000) {
  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    
    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    const record = requestCounts.get(ip);
    
    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
      return next();
    }
    
    record.count++;
    if (record.count > maxRequests) {
      return res.status(429).json({ error: 'Trop de requêtes, réessayez plus tard.' });
    }
    
    next();
  };
}

module.exports = rateLimiter;`,
    tests: [
      { expected: "rateLimiter", type: "contains" },
      { expected: "429", type: "contains" },
      { expected: "Map()", type: "contains" },
      { expected: "req.ip", type: "contains" },
    ],
  },
  {
    id: "node_92",
    type: "code",
    category: "Sécurité",
    title: "Validation d'entrées",
    description: "Validez et assainissez les données utilisateur.",
    instruction: "Créez une fonction <code>validateUser(data)</code> qui valide un objet {email, password, username}. Vérifiez : email valide (regex), password >= 8 chars avec au moins 1 chiffre, username 3-20 chars alphanumérique. Retournez <code>{valid, errors}</code>.",
    code_template: `// Fonction de validation utilisateur

`,
    solution: `function validateUser(data) {
  const errors = [];
  
  // Email
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.push('Email invalide');
  }
  
  // Password
  if (!data.password || data.password.length < 8) {
    errors.push('Mot de passe: minimum 8 caractères');
  } else if (!/\\d/.test(data.password)) {
    errors.push('Mot de passe: doit contenir au moins un chiffre');
  }
  
  // Username
  if (!data.username || data.username.length < 3 || data.username.length > 20) {
    errors.push('Username: entre 3 et 20 caractères');
  } else if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
    errors.push('Username: uniquement lettres, chiffres et _');
  }
  
  return { valid: errors.length === 0, errors };
}

module.exports = validateUser;`,
    tests: [
      { expected: "validateUser", type: "contains" },
      { expected: "emailRegex", type: "contains" },
      { expected: "errors.push", type: "contains" },
      { expected: "valid:", type: "contains" },
    ],
  },
  {
    id: "node_93",
    type: "quiz",
    category: "Sécurité",
    title: "Injection SQL",
    description: "Comment se protéger de l'injection SQL ?",
    options: [
      "Mettre les requêtes en majuscules",
      "Utiliser des requêtes préparées (parameterized queries) au lieu de concaténer les entrées",
      "Limiter la longueur des entrées",
      "Utiliser HTTPS",
    ],
    correct: 1,
    explanation: "Les requêtes préparées (ou parameterized queries) séparent le SQL des données. Au lieu de `SELECT * FROM users WHERE email = '${email}'` (vulnérable), on écrit `SELECT * FROM users WHERE email = ?` avec le paramètre passé séparément. La DB traite les données comme des valeurs, jamais comme du SQL.",
  },

  // === BASES DE DONNÉES (94-99) ===
  {
    id: "node_94",
    type: "intro",
    category: "Bases de données",
    title: "Bases de données avec Node.js",
    description: "Connectez-vous à des bases de données.",
    content: `<h3>🗄️ Bases de données</h3>
<pre><code>// SQLite avec better-sqlite3
const Database = require('better-sqlite3');
const db = new Database('app.db');
db.exec('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)');
db.prepare('INSERT INTO users (name) VALUES (?)').run('Aelita');
const users = db.prepare('SELECT * FROM users').all();

// MongoDB avec Mongoose
const mongoose = require('mongoose');
await mongoose.connect('mongodb://localhost/mydb');
const User = mongoose.model('User', { name: String, email: String });
await User.create({ name: 'Aelita', email: 'a@lyoko.fr' });
const users = await User.find({ name: /Ael/ });

// PostgreSQL avec pg
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [1]);

// Redis
const redis = require('redis');
const client = redis.createClient();
await client.set('session:123', JSON.stringify(user), { EX: 3600 });</code></pre>`,
  },
  {
    id: "node_95",
    type: "code",
    category: "Bases de données",
    title: "CRUD SQLite",
    description: "Opérations CRUD avec SQLite.",
    instruction: "Créez un module avec <code>better-sqlite3</code> qui initialise une table <code>tasks</code> (id, title, done). Implémentez <code>createTask(title)</code>, <code>getAllTasks()</code>, <code>toggleTask(id)</code>, <code>deleteTask(id)</code>.",
    code_template: `const Database = require('better-sqlite3');

// Module CRUD tasks
`,
    solution: `const Database = require('better-sqlite3');
const db = new Database('tasks.db');

db.exec(\`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER DEFAULT 0
  )
\`);

function createTask(title) {
  const stmt = db.prepare('INSERT INTO tasks (title) VALUES (?)');
  const result = stmt.run(title);
  return { id: result.lastInsertRowid, title, done: false };
}

function getAllTasks() {
  return db.prepare('SELECT * FROM tasks ORDER BY id DESC').all();
}

function toggleTask(id) {
  db.prepare('UPDATE tasks SET done = NOT done WHERE id = ?').run(id);
}

function deleteTask(id) {
  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
}

module.exports = { createTask, getAllTasks, toggleTask, deleteTask };`,
    tests: [
      { expected: "better-sqlite3", type: "contains" },
      { expected: "createTask", type: "contains" },
      { expected: "getAllTasks", type: "contains" },
      { expected: "toggleTask", type: "contains" },
      { expected: "deleteTask", type: "contains" },
    ],
  },
  {
    id: "node_96",
    type: "code",
    category: "Bases de données",
    title: "Mongoose Schema",
    description: "Définissez un modèle MongoDB.",
    instruction: "Créez un schéma Mongoose <code>User</code> avec : name (String, requis), email (String, unique, requis, validé), password (String, requis, min 8), level (Number, défaut 1), createdAt (Date, défaut now). Ajoutez une méthode d'instance <code>toPublicJSON()</code> qui exclut le password.",
    code_template: `const mongoose = require('mongoose');

// Schéma User Mongoose
`,
    solution: `const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\\S+@\\S+\\.\\S+$/, 'Email invalide'],
  },
  password: { type: String, required: true, minlength: 8 },
  level: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
});

userSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    level: this.level,
    createdAt: this.createdAt,
  };
};

const User = mongoose.model('User', userSchema);
module.exports = User;`,
    tests: [
      { expected: "mongoose.Schema", type: "contains" },
      { expected: "required: true", type: "contains" },
      { expected: "toPublicJSON", type: "contains" },
      { expected: "mongoose.model", type: "contains" },
    ],
  },
  {
    id: "node_97",
    type: "code",
    category: "Bases de données",
    title: "Pool de connexions",
    description: "Gérez les connexions PostgreSQL.",
    instruction: "Créez un module de pool PostgreSQL avec <code>pg</code>. Implémentez des fonctions <code>query(text, params)</code>, <code>getUser(id)</code>, <code>createUser(name, email)</code>, et <code>close()</code>. Utilisez les requêtes paramétrisées pour la sécurité.",
    code_template: `const { Pool } = require('pg');

// Module PostgreSQL avec pool
`,
    solution: `const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost/mydb',
  max: 20,
});

async function query(text, params) {
  const result = await pool.query(text, params);
  return result.rows;
}

async function getUser(id) {
  const rows = await query('SELECT * FROM users WHERE id = $1', [id]);
  return rows[0] || null;
}

async function createUser(name, email) {
  const rows = await query(
    'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
    [name, email]
  );
  return rows[0];
}

async function close() {
  await pool.end();
}

module.exports = { query, getUser, createUser, close };`,
    tests: [
      { expected: "new Pool", type: "contains" },
      { expected: "$1", type: "contains" },
      { expected: "async function getUser", type: "contains" },
      { expected: "pool.end()", type: "contains" },
    ],
  },
  {
    id: "node_98",
    type: "quiz",
    category: "Bases de données",
    title: "ORM vs Query Builder vs Raw SQL",
    description: "Quand utiliser quoi ?",
    options: [
      "Toujours utiliser un ORM",
      "ORM pour le CRUD simple, Query Builder pour les requêtes complexes, Raw SQL pour l'optimisation fine",
      "Raw SQL est toujours le meilleur choix",
      "Les Query Builders sont dépréciés",
    ],
    correct: 1,
    explanation: "Les ORMs (Mongoose, Prisma) sont pratiques pour le CRUD et les relations simples. Les Query Builders (Knex.js) offrent plus de flexibilité pour les requêtes complexes. Le Raw SQL donne un contrôle total pour les optimisations de performance. En pratique, on mélange souvent les trois dans un même projet.",
  },
  {
    id: "node_99",
    type: "code",
    category: "Bases de données",
    title: "Migrations",
    description: "Gérez les évolutions du schéma.",
    instruction: "Créez un système de migration simple : une fonction <code>runMigrations(db)</code> qui vérifie une table <code>migrations</code> pour savoir quelles migrations ont été exécutées, puis exécute les nouvelles. Chaque migration est un objet {id, name, sql}.",
    code_template: `// Système de migration SQLite simple

`,
    solution: `function runMigrations(db) {
  db.exec(\`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      executed_at TEXT DEFAULT (datetime('now'))
    )
  \`);

  const migrations = [
    { id: 1, name: 'create_users', sql: \`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
      )
    \`},
    { id: 2, name: 'add_user_level', sql: \`
      ALTER TABLE users ADD COLUMN level INTEGER DEFAULT 1
    \`},
  ];

  const executed = db.prepare('SELECT id FROM migrations').all().map(r => r.id);

  for (const migration of migrations) {
    if (!executed.includes(migration.id)) {
      db.exec(migration.sql);
      db.prepare('INSERT INTO migrations (id, name) VALUES (?, ?)').run(migration.id, migration.name);
      console.log(\`Migration \${migration.id}: \${migration.name} ✓\`);
    }
  }
}

module.exports = runMigrations;`,
    tests: [
      { expected: "runMigrations", type: "contains" },
      { expected: "CREATE TABLE IF NOT EXISTS migrations", type: "contains" },
      { expected: "executed.includes", type: "contains" },
    ],
  },

  // === MICROSERVICES (100-103) ===
  {
    id: "node_100",
    type: "intro",
    category: "Microservices",
    title: "Architecture Microservices",
    description: "Découpez votre application en services indépendants.",
    content: `<h3>🏗️ Microservices</h3>
<p>Au lieu d'un monolithe, découpez en <strong>services indépendants</strong> qui communiquent entre eux.</p>
<pre><code>// Service Auth (port 3001)
app.post('/auth/login', async (req, res) => { ... });
app.get('/auth/verify', async (req, res) => { ... });

// Service Users (port 3002)
app.get('/users/:id', async (req, res) => { ... });

// API Gateway (port 3000) — Point d'entrée unique
app.use('/auth', proxy('http://localhost:3001'));
app.use('/users', proxy('http://localhost:3002'));

// Communication inter-services
// 1. HTTP/REST — Simple mais couplé
const user = await fetch('http://user-service/users/123');

// 2. Message Queue (RabbitMQ, Redis Pub/Sub)
publisher.publish('user.created', JSON.stringify(user));
subscriber.subscribe('user.created', (msg) => { ... });

// 3. gRPC — Performant et typé
</code></pre>`,
  },
  {
    id: "node_101",
    type: "code",
    category: "Microservices",
    title: "Service REST autonome",
    description: "Créez un micro-service isolé.",
    instruction: "Créez un service <code>TaskService</code> autonome sur le port 3002 avec Express. Il gère des tasks en mémoire avec les routes : GET /tasks, POST /tasks, DELETE /tasks/:id. Ajoutez un middleware de health check GET /health.",
    code_template: `const express = require('express');

// Task microservice
`,
    solution: `const express = require('express');
const app = express();
app.use(express.json());

let tasks = [];
let nextId = 1;

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'task-service', uptime: process.uptime() });
});

app.get('/tasks', (req, res) => {
  res.json({ success: true, data: tasks });
});

app.post('/tasks', (req, res) => {
  const task = { id: nextId++, title: req.body.title, done: false };
  tasks.push(task);
  res.status(201).json({ success: true, data: task });
});

app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  tasks = tasks.filter(t => t.id !== id);
  res.json({ success: true });
});

app.listen(3002, () => console.log('Task service on :3002'));`,
    tests: [
      { expected: "/health", type: "contains" },
      { expected: "GET", type: "contains" },
      { expected: "POST", type: "contains" },
      { expected: "DELETE", type: "contains" },
    ],
  },
  {
    id: "node_102",
    type: "code",
    category: "Microservices",
    title: "Event Emitter pour pub/sub",
    description: "Communication inter-services locale.",
    instruction: "Créez un <code>EventBus</code> basé sur <code>EventEmitter</code> qui sert de bus de messages entre services. Implémentez <code>publish(event, data)</code>, <code>subscribe(event, handler)</code>, et <code>unsubscribe(event, handler)</code>. Testez avec un événement 'user.created'.",
    code_template: `const EventEmitter = require('events');

// EventBus pour communication inter-services
`,
    solution: `const EventEmitter = require('events');

class EventBus extends EventEmitter {
  publish(event, data) {
    console.log(\`[EventBus] Publish: \${event}\`);
    this.emit(event, data);
  }

  subscribe(event, handler) {
    console.log(\`[EventBus] Subscribe: \${event}\`);
    this.on(event, handler);
  }

  unsubscribe(event, handler) {
    this.off(event, handler);
  }
}

const bus = new EventBus();

// Service A publie
bus.subscribe('user.created', (user) => {
  console.log('Email service: envoi bienvenue à', user.email);
});

bus.subscribe('user.created', (user) => {
  console.log('Analytics: nouvel utilisateur', user.name);
});

// Service B souscrit
bus.publish('user.created', { name: 'Aelita', email: 'aelita@lyoko.fr' });`,
    tests: [
      { expected: "class EventBus extends EventEmitter", type: "contains" },
      { expected: "publish(event", type: "contains" },
      { expected: "subscribe(event", type: "contains" },
      { expected: "user.created", type: "contains" },
    ],
  },
  {
    id: "node_103",
    type: "quiz",
    category: "Microservices",
    title: "Monolithe vs Microservices",
    description: "Quand passer aux microservices ?",
    options: [
      "Toujours commencer par des microservices",
      "Commencer par un monolithe, migrer vers les microservices quand l'équipe/le projet grandit et que des parties ont besoin de scaler indépendamment",
      "Les microservices sont toujours meilleurs",
      "Les monolithes sont dépréciés",
    ],
    correct: 1,
    explanation: "Commencez TOUJOURS par un monolithe bien structuré. Les microservices ajoutent de la complexité (réseau, déploiement, monitoring, cohérence des données). Migrez vers les microservices quand : l'équipe grandit, des parties ont besoin de scaler différemment, ou le monolithe devient ingérable.",
  },

  // === GRAPHQL (104-107) ===
  {
    id: "node_104",
    type: "intro",
    category: "GraphQL",
    title: "GraphQL avec Node.js",
    description: "Une alternative moderne aux APIs REST.",
    content: `<h3>📊 GraphQL</h3>
<p>GraphQL permet au client de demander <strong>exactement</strong> les données dont il a besoin.</p>
<pre><code>const { ApolloServer, gql } = require('apollo-server');

// Schéma
const typeDefs = gql\`
  type User {
    id: ID!
    name: String!
    email: String!
    level: Int!
  }
  type Query {
    user(id: ID!): User
    users: [User!]!
  }
  type Mutation {
    createUser(name: String!, email: String!): User!
  }
\`;

// Resolvers
const resolvers = {
  Query: {
    user: (_, { id }) => users.find(u => u.id === id),
    users: () => users,
  },
  Mutation: {
    createUser: (_, { name, email }) => {
      const user = { id: String(users.length + 1), name, email, level: 1 };
      users.push(user);
      return user;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => console.log('GraphQL:', url));</code></pre>`,
  },
  {
    id: "node_105",
    type: "code",
    category: "GraphQL",
    title: "Schéma GraphQL",
    description: "Définissez un schéma et des resolvers.",
    instruction: "Créez un schéma GraphQL pour un système de guerriers avec : type <code>Guerrier</code> (id, nom, niveau, xp), Query <code>guerrier(id)</code> et <code>guerriers</code>, Mutation <code>createGuerrier(nom)</code> et <code>levelUp(id)</code>. Implémentez les resolvers avec des données en mémoire.",
    code_template: `// Schéma GraphQL + Resolvers pour guerriers

`,
    solution: `const typeDefs = \`
  type Guerrier {
    id: ID!
    nom: String!
    niveau: Int!
    xp: Int!
  }
  type Query {
    guerrier(id: ID!): Guerrier
    guerriers: [Guerrier!]!
  }
  type Mutation {
    createGuerrier(nom: String!): Guerrier!
    levelUp(id: ID!): Guerrier
  }
\`;

const guerriers = [
  { id: '1', nom: 'Aelita', niveau: 10, xp: 5000 },
  { id: '2', nom: 'Yumi', niveau: 8, xp: 3200 },
];

const resolvers = {
  Query: {
    guerrier: (_, { id }) => guerriers.find(g => g.id === id),
    guerriers: () => guerriers,
  },
  Mutation: {
    createGuerrier: (_, { nom }) => {
      const g = { id: String(guerriers.length + 1), nom, niveau: 1, xp: 0 };
      guerriers.push(g);
      return g;
    },
    levelUp: (_, { id }) => {
      const g = guerriers.find(g => g.id === id);
      if (g) { g.niveau++; g.xp += 500; }
      return g;
    },
  },
};

module.exports = { typeDefs, resolvers };`,
    tests: [
      { expected: "type Guerrier", type: "contains" },
      { expected: "type Query", type: "contains" },
      { expected: "type Mutation", type: "contains" },
      { expected: "resolvers", type: "contains" },
    ],
  },
  {
    id: "node_106",
    type: "quiz",
    category: "GraphQL",
    title: "REST vs GraphQL",
    description: "Quel est l'avantage principal de GraphQL ?",
    options: [
      "GraphQL est toujours plus rapide",
      "Le client demande exactement les champs dont il a besoin, évitant over-fetching et under-fetching",
      "GraphQL n'a pas besoin de serveur",
      "GraphQL remplace les bases de données",
    ],
    correct: 1,
    explanation: "GraphQL résout le problème du over-fetching (recevoir trop de données) et under-fetching (devoir faire plusieurs requêtes). Le client spécifie exactement les champs nécessaires dans la requête. Un seul endpoint gère toutes les requêtes, contrairement aux multiples endpoints REST.",
  },
  {
    id: "node_107",
    type: "code",
    category: "GraphQL",
    title: "DataLoader",
    description: "Optimisez les requêtes N+1.",
    instruction: "Créez un <code>DataLoader</code> simplifié : une classe qui batch les requêtes. Implémentez <code>load(id)</code> qui retourne une Promise, et un mécanisme qui regroupe les ids demandés dans un même tick pour les charger en une seule requête batch.",
    code_template: `// DataLoader simplifié pour batching

`,
    solution: `class SimpleDataLoader {
  constructor(batchFn) {
    this.batchFn = batchFn;
    this.queue = [];
    this.scheduled = false;
  }

  load(id) {
    return new Promise((resolve, reject) => {
      this.queue.push({ id, resolve, reject });
      if (!this.scheduled) {
        this.scheduled = true;
        process.nextTick(() => this.executeBatch());
      }
    });
  }

  async executeBatch() {
    const batch = this.queue.splice(0);
    this.scheduled = false;
    const ids = batch.map(item => item.id);
    try {
      const results = await this.batchFn(ids);
      batch.forEach((item, i) => item.resolve(results[i]));
    } catch (err) {
      batch.forEach(item => item.reject(err));
    }
  }
}

// Usage
const userLoader = new SimpleDataLoader(async (ids) => {
  console.log('Batch load:', ids);
  return ids.map(id => ({ id, name: \`User \${id}\` }));
});`,
    tests: [
      { expected: "class SimpleDataLoader", type: "contains" },
      { expected: "load(id)", type: "contains" },
      { expected: "executeBatch", type: "contains" },
      { expected: "process.nextTick", type: "contains" },
    ],
  },

  // === DOCKER & DÉPLOIEMENT (108-111) ===
  {
    id: "node_108",
    type: "intro",
    category: "Docker & Deploy",
    title: "Docker pour Node.js",
    description: "Conteneurisez votre application.",
    content: `<h3>🐳 Docker</h3>
<pre><code># Dockerfile pour Node.js
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]

# .dockerignore
node_modules
.env
.git

# docker-compose.yml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://db:5432/mydb
    depends_on:
      - db
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=mydb
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:</code></pre>`,
  },
  {
    id: "node_109",
    type: "code",
    category: "Docker & Deploy",
    title: "Dockerfile optimisé",
    description: "Écrivez un Dockerfile multi-stage.",
    instruction: "Écrivez un Dockerfile multi-stage : stage 1 (build) installe les dépendances et compile TypeScript, stage 2 (production) copie uniquement le build et les dépendances de production. Utilisez <code>node:20-alpine</code> comme image de base.",
    code_template: `# Dockerfile multi-stage pour Node.js TypeScript

`,
    solution: `# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=builder /app/dist ./dist
EXPOSE 3000
USER node
CMD ["node", "dist/server.js"]`,
    tests: [
      { expected: "FROM node:20-alpine AS builder", type: "contains" },
      { expected: "FROM node:20-alpine", type: "contains" },
      { expected: "COPY --from=builder", type: "contains" },
      { expected: "USER node", type: "contains" },
    ],
  },
  {
    id: "node_110",
    type: "quiz",
    category: "Docker & Deploy",
    title: "Multi-stage build",
    description: "Pourquoi utiliser un multi-stage build ?",
    options: [
      "Pour accélérer le développement",
      "Pour réduire la taille de l'image finale en excluant les devDependencies et fichiers sources",
      "Pour supporter plusieurs systèmes d'exploitation",
      "Pour le debug uniquement",
    ],
    correct: 1,
    explanation: "Un multi-stage build permet de construire l'application dans un premier stage (avec tous les outils de dev) puis de ne copier que le résultat final dans l'image de production. L'image finale est beaucoup plus petite car elle ne contient pas les devDependencies, le code source TypeScript, etc.",
  },
  {
    id: "node_111",
    type: "code",
    category: "Docker & Deploy",
    title: "Health check endpoint",
    description: "Créez un endpoint de monitoring.",
    instruction: "Créez un endpoint GET <code>/health</code> complet qui retourne : le statut du serveur, l'uptime, l'utilisation mémoire (<code>process.memoryUsage()</code>), la version Node, et l'état de la connexion DB. Retournez 503 si un check échoue.",
    code_template: `// Endpoint health check complet

`,
    solution: `function healthCheck(db) {
  return (req, res) => {
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      version: process.version,
      memory: {
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024) + 'MB',
        heap: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
      },
      database: 'unknown',
    };
    
    try {
      db.prepare('SELECT 1').get();
      health.database = 'connected';
    } catch (err) {
      health.database = 'disconnected';
      health.status = 'degraded';
    }
    
    const statusCode = health.status === 'ok' ? 200 : 503;
    res.status(statusCode).json(health);
  };
}

module.exports = healthCheck;`,
    tests: [
      { expected: "healthCheck", type: "contains" },
      { expected: "process.memoryUsage()", type: "contains" },
      { expected: "process.uptime()", type: "contains" },
      { expected: "503", type: "contains" },
    ],
  },

  // === TESTING (112-115) ===
  {
    id: "node_112",
    type: "intro",
    category: "Tests Node.js",
    title: "Tests avec Jest",
    description: "Testez vos APIs et fonctions.",
    content: `<h3>🧪 Tests Node.js</h3>
<pre><code>// Test unitaire avec Jest
describe('Calculator', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(add(1, 2)).toBe(3);
  });
  
  test('throws on division by zero', () => {
    expect(() => divide(10, 0)).toThrow('Division by zero');
  });
});

// Test d'API avec supertest
const request = require('supertest');
describe('GET /api/users', () => {
  it('returns 200 and array', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

// Mock
jest.mock('./database');
const db = require('./database');
db.getUser.mockResolvedValue({ id: 1, name: 'Test' });</code></pre>`,
  },
  {
    id: "node_113",
    type: "code",
    category: "Tests Node.js",
    title: "Tests unitaires",
    description: "Testez des fonctions utilitaires.",
    instruction: "Créez une fonction <code>parseQueryString(qs)</code> qui parse une query string (sans le '?') en objet. Écrivez des tests Jest pour : une query normale, des valeurs vides, une chaîne vide, et des caractères encodés.",
    code_template: `// parseQueryString + tests Jest

`,
    solution: `function parseQueryString(qs) {
  if (!qs) return {};
  return qs.split('&').reduce((acc, pair) => {
    const [key, value] = pair.split('=');
    acc[decodeURIComponent(key)] = decodeURIComponent(value || '');
    return acc;
  }, {});
}

// Tests
// describe('parseQueryString', () => {
//   test('parse simple query', () => {
//     expect(parseQueryString('name=Aelita&level=10'))
//       .toEqual({ name: 'Aelita', level: '10' });
//   });
//   test('handles empty value', () => {
//     expect(parseQueryString('key=')).toEqual({ key: '' });
//   });
//   test('handles empty string', () => {
//     expect(parseQueryString('')).toEqual({});
//   });
//   test('decodes URI components', () => {
//     expect(parseQueryString('name=hello%20world'))
//       .toEqual({ name: 'hello world' });
//   });
// });

module.exports = parseQueryString;`,
    tests: [
      { expected: "parseQueryString", type: "contains" },
      { expected: "split('&')", type: "contains" },
      { expected: "decodeURIComponent", type: "contains" },
      { expected: "toEqual", type: "contains" },
    ],
  },
  {
    id: "node_114",
    type: "code",
    category: "Tests Node.js",
    title: "Test d'API",
    description: "Testez vos routes Express.",
    instruction: "Créez une mini API Express avec GET /users et POST /users. Écrivez des tests avec <code>supertest</code> : vérifiez le status 200 pour GET, 201 pour POST avec body valide, et 400 pour POST sans body requis.",
    code_template: `const express = require('express');
// const request = require('supertest');

// API + tests
`,
    solution: `const express = require('express');
const app = express();
app.use(express.json());

const users = [];

app.get('/users', (req, res) => {
  res.json({ success: true, data: users });
});

app.post('/users', (req, res) => {
  if (!req.body.name || !req.body.email) {
    return res.status(400).json({ success: false, error: 'name et email requis' });
  }
  const user = { id: users.length + 1, ...req.body };
  users.push(user);
  res.status(201).json({ success: true, data: user });
});

// Tests avec supertest
// const request = require('supertest');
// describe('Users API', () => {
//   test('GET /users returns 200', async () => {
//     const res = await request(app).get('/users');
//     expect(res.status).toBe(200);
//     expect(res.body.success).toBe(true);
//   });
//   test('POST /users creates user', async () => {
//     const res = await request(app).post('/users')
//       .send({ name: 'Aelita', email: 'a@lyoko.fr' });
//     expect(res.status).toBe(201);
//     expect(res.body.data.name).toBe('Aelita');
//   });
//   test('POST /users returns 400 without name', async () => {
//     const res = await request(app).post('/users').send({});
//     expect(res.status).toBe(400);
//   });
// });

module.exports = app;`,
    tests: [
      { expected: "app.get('/users'", type: "contains" },
      { expected: "app.post('/users'", type: "contains" },
      { expected: "status(400)", type: "contains" },
      { expected: "status(201)", type: "contains" },
    ],
  },
  {
    id: "node_115",
    type: "quiz",
    category: "Tests Node.js",
    title: "Mocking",
    description: "Pourquoi mocker les dépendances dans les tests ?",
    options: [
      "Pour accélérer les tests en évitant les appels réseau et DB réels",
      "Pour rendre les tests plus lents mais plus réalistes",
      "Le mocking est déconseillé",
      "Pour tester uniquement la base de données",
    ],
    correct: 0,
    explanation: "Le mocking isole le code testé de ses dépendances (DB, API externes, filesystem). Les tests sont plus rapides, fiables et reproductibles. On mock les I/O et on teste la logique. Les tests d'intégration (sans mock) vérifient que tout fonctionne ensemble.",
  },

  // === ARCHITECTURE AVANCÉE (116-120) ===
  {
    id: "node_116",
    type: "intro",
    category: "Architecture",
    title: "Architecture Node.js à grande échelle",
    description: "Structurez des projets Node.js professionnels.",
    content: `<h3>🏗️ Architecture</h3>
<pre><code>src/
├── config/          // Configuration
│   ├── database.js
│   └── env.js
├── middleware/       // Express middlewares
│   ├── auth.js
│   ├── validate.js
│   └── errorHandler.js
├── routes/          // Définition des routes
│   └── userRoutes.js
├── controllers/     // Logique de route
│   └── userController.js
├── services/        // Logique métier
│   └── userService.js
├── models/          // Modèles de données
│   └── User.js
├── utils/           // Helpers
├── __tests__/       // Tests
└── server.js        // Point d'entrée</code></pre>
<p>Principes :</p>
<ul>
<li><strong>Séparation des couches</strong> — Routes → Controllers → Services → Models</li>
<li><strong>Injection de dépendances</strong> — Testabilité</li>
<li><strong>Error handling centralisé</strong> — Un middleware attrape tout</li>
</ul>`,
  },
  {
    id: "node_117",
    type: "code",
    category: "Architecture",
    title: "Error handler centralisé",
    description: "Gérez toutes les erreurs en un point.",
    instruction: "Créez une classe <code>AppError</code> qui étend Error avec un <code>statusCode</code> et <code>isOperational</code>. Créez un middleware Express <code>errorHandler</code> qui catch toutes les erreurs, log les erreurs serveur, et retourne une réponse JSON cohérente.",
    code_template: `// AppError + Error handler middleware

`,
    solution: `class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Erreur interne du serveur';
  
  if (!err.isOperational) {
    console.error('ERREUR NON-OPÉRATIONNELLE:', err);
  }
  
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

module.exports = { AppError, errorHandler };`,
    tests: [
      { expected: "class AppError extends Error", type: "contains" },
      { expected: "statusCode", type: "contains" },
      { expected: "isOperational", type: "contains" },
      { expected: "errorHandler", type: "contains" },
    ],
  },
  {
    id: "node_118",
    type: "code",
    category: "Architecture",
    title: "Service Layer",
    description: "Séparez la logique métier.",
    instruction: "Créez un <code>UserService</code> class avec les méthodes : <code>async create(data)</code> (valide + hash password + insert DB), <code>async findById(id)</code>, <code>async authenticate(email, password)</code>. Le service lance des <code>AppError</code> pour les erreurs métier.",
    code_template: `// UserService — couche métier

`,
    solution: `class UserService {
  constructor(db, hasher) {
    this.db = db;
    this.hasher = hasher;
  }

  async create({ name, email, password }) {
    if (!name || !email || !password) {
      throw new AppError('Champs requis manquants', 400);
    }
    
    const existing = this.db.findByEmail(email);
    if (existing) throw new AppError('Email déjà utilisé', 409);
    
    const hash = await this.hasher.hash(password, 12);
    return this.db.insert({ name, email, password: hash });
  }

  async findById(id) {
    const user = this.db.findById(id);
    if (!user) throw new AppError('Utilisateur non trouvé', 404);
    return user;
  }

  async authenticate(email, password) {
    const user = this.db.findByEmail(email);
    if (!user) throw new AppError('Identifiants invalides', 401);
    
    const valid = await this.hasher.compare(password, user.password);
    if (!valid) throw new AppError('Identifiants invalides', 401);
    
    return user;
  }
}

module.exports = UserService;`,
    tests: [
      { expected: "class UserService", type: "contains" },
      { expected: "async create", type: "contains" },
      { expected: "async authenticate", type: "contains" },
      { expected: "throw new AppError", type: "contains" },
    ],
  },
  {
    id: "node_119",
    type: "quiz",
    category: "Architecture",
    title: "Controller vs Service",
    description: "Quel est le rôle de chaque couche ?",
    options: [
      "Ils font la même chose",
      "Controller gère HTTP (req/res), Service contient la logique métier pure (réutilisable, testable)",
      "Service gère HTTP, Controller gère la DB",
      "Controller est côté client, Service côté serveur",
    ],
    correct: 1,
    explanation: "Le Controller est la couche HTTP : il extrait les données de req, appelle le Service, et formate la réponse res. Le Service contient la logique métier pure, sans dépendance à Express. Cela rend le Service réutilisable (CLI, WebSocket, etc.) et facilement testable unitairement.",
  },
  {
    id: "node_120",
    type: "code",
    category: "Architecture",
    title: "Projet final — API complète",
    description: "Assemblez une API structurée.",
    instruction: "Créez une mini API structurée avec : un <code>AppError</code>, un middleware <code>errorHandler</code>, un <code>authMiddleware</code>, un controller <code>userController</code>, et les routes montées sur un Router Express. Le tout exporté proprement.",
    code_template: `const express = require('express');

// API complète structurée
`,
    solution: `const express = require('express');
const app = express();
app.use(express.json());

// Error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

// Auth middleware
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new AppError('Non authentifié', 401);
  req.userId = 'user_from_token';
  next();
}

// Controller
const userController = {
  getProfile: (req, res) => {
    res.json({ success: true, data: { id: req.userId, name: 'Aelita' } });
  },
  getAll: (req, res) => {
    res.json({ success: true, data: [] });
  },
};

// Routes
const router = express.Router();
router.get('/users', userController.getAll);
router.get('/profile', authMiddleware, userController.getProfile);
app.use('/api', router);

// Error handler (doit être dernier)
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({ success: false, error: err.message });
});

module.exports = app;`,
    tests: [
      { expected: "class AppError", type: "contains" },
      { expected: "authMiddleware", type: "contains" },
      { expected: "userController", type: "contains" },
      { expected: "express.Router()", type: "contains" },
    ],
  },
];

addExercises("nodejs", exercises);
