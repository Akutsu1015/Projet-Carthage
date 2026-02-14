import { addExercises } from ".";
import type { Exercise } from "@/app/exercises/[module]/exercise-client";

const exercises: Exercise[] = [
  // === JWT & AUTH (1-5) ===
  {
    id: "node_61",
    type: "intro",
    category: "Authentification",
    title: "JWT — JSON Web Tokens",
    description: "Les JWT permettent d'authentifier les utilisateurs de manière stateless.",
    content: `<h3>🔐 JWT — Authentification stateless</h3>
<p>Un JWT est un token signé qui contient des données (claims) :</p>
<pre><code>// Structure : header.payload.signature
// eyJhbGciOi... (encodé en Base64)

const jwt = require('jsonwebtoken');

// Créer un token
const token = jwt.sign(
  { userId: 42, role: 'admin' },
  'secret_key',
  { expiresIn: '24h' }
);

// Vérifier un token
const decoded = jwt.verify(token, 'secret_key');
// → { userId: 42, role: 'admin', iat: ..., exp: ... }</code></pre>`,
  },
  {
    id: "node_62",
    type: "code",
    category: "Authentification",
    title: "Générer un JWT",
    description: "Créez une fonction qui génère un token JWT.",
    instruction: "Créez <code>generateToken(user)</code> qui utilise <code>jwt.sign</code> pour créer un token avec <code>{ id: user.id, email: user.email }</code>, une clé secrète depuis <code>process.env.JWT_SECRET</code> et une expiration de <code>7d</code>.",
    code_template: `const jwt = require('jsonwebtoken');

function generateToken(user) {
  // Générez le token
}`,
    solution: `const jwt = require('jsonwebtoken');

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}`,
    tests: [
      { type: "contains", expected: "jwt.sign(" },
      { type: "contains", expected: "user.id" },
      { type: "contains", expected: "user.email" },
      { type: "contains", expected: "process.env.JWT_SECRET" },
      { type: "contains", expected: "expiresIn" },
    ],
    hint: "jwt.sign(payload, secret, options) crée le token. Utilisez process.env pour le secret.",
  },
  {
    id: "node_63",
    type: "code",
    category: "Authentification",
    title: "Middleware JWT",
    description: "Créez un middleware qui vérifie le JWT.",
    instruction: "Créez un middleware <code>verifyToken</code> qui extrait le token du header <code>Authorization: Bearer TOKEN</code>, le vérifie avec <code>jwt.verify</code>, et attache le payload à <code>req.user</code>. Renvoyez <code>401</code> si invalide.",
    code_template: `const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  // Extrayez et vérifiez le token
}`,
    solution: `const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token manquant' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token invalide' });
  }
}`,
    tests: [
      { type: "contains", expected: "req.headers.authorization" },
      { type: "contains", expected: "split(' ')[1]" },
      { type: "contains", expected: "jwt.verify" },
      { type: "contains", expected: "req.user = decoded" },
      { type: "contains", expected: "status(401)" },
    ],
    hint: "Extrayez le token avec split(' ')[1], vérifiez dans un try/catch, attachez à req.user.",
  },
  {
    id: "node_64",
    type: "code",
    category: "Authentification",
    title: "Route de login",
    description: "Créez une route de connexion complète.",
    instruction: "Créez une route <code>POST /api/login</code> qui : vérifie l'email/password, compare le mot de passe avec bcrypt, génère un JWT si valide, et renvoie <code>{ token }</code>.",
    code_template: `app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  // 1. Trouvez l'utilisateur
  // 2. Vérifiez le mot de passe
  // 3. Générez le token
  // 4. Répondez
});`,
    solution: `app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Mot de passe incorrect' });

  const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});`,
    tests: [
      { type: "contains", expected: "bcrypt.compare" },
      { type: "contains", expected: "jwt.sign" },
      { type: "contains", expected: "status(401)" },
      { type: "contains", expected: "res.json({ token" },
    ],
    hint: "Trouvez l'user, vérifiez avec bcrypt.compare, générez le JWT, renvoyez le token.",
  },
  {
    id: "node_65",
    type: "quiz",
    category: "Authentification",
    title: "Stocker un JWT",
    description: "Où stocker un JWT côté client de la manière la plus sécurisée ?",
    options: [
      "Dans un cookie avec les flags HttpOnly, Secure et SameSite",
      "Dans le localStorage",
      "Dans une variable globale window.token",
      "Dans l'URL en query parameter",
    ],
    correct: 0,
    explanation: "Un cookie HttpOnly + Secure + SameSite=Strict est la méthode la plus sécurisée : il est inaccessible par JavaScript (anti-XSS), envoyé uniquement en HTTPS, et protégé contre le CSRF. Le localStorage est vulnérable aux attaques XSS.",
  },
  // === API REST AVANCÉE (6-12) ===
  {
    id: "node_66",
    type: "intro",
    category: "API REST",
    title: "Bonnes pratiques REST",
    description: "Construisez des APIs REST professionnelles.",
    content: `<h3>📐 API REST — Architecture et conventions</h3>
<p>Conventions de nommage :</p>
<pre><code>GET    /api/users          → Lister
GET    /api/users/:id       → Détail
POST   /api/users           → Créer
PUT    /api/users/:id       → Remplacer
PATCH  /api/users/:id       → Modifier partiellement
DELETE /api/users/:id       → Supprimer</code></pre>
<p>Bonnes pratiques :</p>
<ul>
<li><strong>Noms au pluriel</strong> : /users, pas /user</li>
<li><strong>Codes HTTP corrects</strong> : 200, 201, 204, 400, 401, 404, 500</li>
<li><strong>Pagination</strong> : ?page=1&limit=20</li>
<li><strong>Filtrage</strong> : ?status=active&role=admin</li>
<li><strong>Versioning</strong> : /api/v1/users</li>
</ul>`,
  },
  {
    id: "node_67",
    type: "code",
    category: "API REST",
    title: "Pagination",
    description: "Implémentez la pagination sur une liste.",
    instruction: "Créez une route <code>GET /api/exercises</code> qui accepte <code>?page=1&limit=10</code>. Retournez un objet avec <code>data</code> (les items paginés), <code>page</code>, <code>limit</code>, <code>total</code> et <code>totalPages</code>.",
    code_template: `app.get('/api/exercises', (req, res) => {
  const allExercises = [...]; // 100 exercices

  // Implémentez la pagination
});`,
    solution: `app.get('/api/exercises', (req, res) => {
  const allExercises = [...]; // 100 exercices
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const start = (page - 1) * limit;
  const data = allExercises.slice(start, start + limit);

  res.json({
    data,
    page,
    limit,
    total: allExercises.length,
    totalPages: Math.ceil(allExercises.length / limit),
  });
});`,
    tests: [
      { type: "contains", expected: "req.query.page" },
      { type: "contains", expected: "req.query.limit" },
      { type: "contains", expected: ".slice(" },
      { type: "contains", expected: "Math.ceil" },
      { type: "contains", expected: "totalPages" },
    ],
    hint: "start = (page-1) * limit, slice(start, start+limit) pour la portion, Math.ceil(total/limit) pour les pages.",
  },
  {
    id: "node_68",
    type: "code",
    category: "API REST",
    title: "Validation du body",
    description: "Validez les données avant de les traiter.",
    instruction: "Créez un middleware <code>validateUser</code> qui vérifie que <code>req.body</code> contient <code>name</code> (string, min 2 chars) et <code>email</code> (contient @). Renvoyez <code>400</code> avec des erreurs détaillées si invalide.",
    code_template: `function validateUser(req, res, next) {
  const errors = [];
  const { name, email } = req.body;

  // Validez name et email
  
  if (errors.length) return res.status(400).json({ errors });
  next();
}`,
    solution: `function validateUser(req, res, next) {
  const errors = [];
  const { name, email } = req.body;

  if (!name || name.length < 2) {
    errors.push('Le nom doit contenir au moins 2 caractères');
  }
  if (!email || !email.includes('@')) {
    errors.push('Email invalide');
  }

  if (errors.length) return res.status(400).json({ errors });
  next();
}`,
    tests: [
      { type: "contains", expected: "errors.push(" },
      { type: "contains", expected: "name.length < 2" },
      { type: "contains", expected: "email.includes('@')" },
      { type: "contains", expected: "status(400)" },
      { type: "contains", expected: "next()" },
    ],
    hint: "Vérifiez chaque champ, accumulez les erreurs, renvoyez 400 s'il y en a, sinon next().",
  },
  {
    id: "node_69",
    type: "code",
    category: "API REST",
    title: "CORS middleware",
    description: "Configurez les headers CORS manuellement.",
    instruction: "Créez un middleware CORS qui ajoute les headers <code>Access-Control-Allow-Origin: *</code>, <code>Access-Control-Allow-Methods: GET,POST,PUT,DELETE</code> et <code>Access-Control-Allow-Headers: Content-Type,Authorization</code>. Répondez <code>204</code> aux requêtes OPTIONS (preflight).",
    code_template: `function corsMiddleware(req, res, next) {
  // Ajoutez les headers CORS
}`,
    solution: `function corsMiddleware(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
}`,
    tests: [
      { type: "contains", expected: "Access-Control-Allow-Origin" },
      { type: "contains", expected: "Access-Control-Allow-Methods" },
      { type: "contains", expected: "Access-Control-Allow-Headers" },
      { type: "contains", expected: "req.method === 'OPTIONS'" },
    ],
    hint: "res.setHeader() pour chaque header CORS, et gérez le preflight OPTIONS avec 204.",
  },
  {
    id: "node_70",
    type: "code",
    category: "API REST",
    title: "Rate limiting",
    description: "Limitez le nombre de requêtes par IP.",
    instruction: "Créez un middleware <code>rateLimiter</code> qui autorise max <code>100</code> requêtes par IP par fenêtre de <code>15 minutes</code>. Utilisez un <code>Map</code> pour stocker les compteurs. Renvoyez <code>429</code> si dépassé.",
    code_template: `const requests = new Map();

function rateLimiter(req, res, next) {
  const ip = req.ip;
  // Implémentez le rate limiting
}`,
    solution: `const requests = new Map();
const WINDOW = 15 * 60 * 1000;
const MAX = 100;

function rateLimiter(req, res, next) {
  const ip = req.ip;
  const now = Date.now();

  if (!requests.has(ip)) {
    requests.set(ip, { count: 1, start: now });
    return next();
  }

  const record = requests.get(ip);
  if (now - record.start > WINDOW) {
    requests.set(ip, { count: 1, start: now });
    return next();
  }

  record.count++;
  if (record.count > MAX) {
    return res.status(429).json({ error: 'Trop de requêtes' });
  }
  next();
}`,
    tests: [
      { type: "contains", expected: "new Map()" },
      { type: "contains", expected: "req.ip" },
      { type: "contains", expected: "status(429)" },
      { type: "contains", expected: "record.count" },
    ],
    hint: "Stockez {count, start} par IP. Si la fenêtre est dépassée, réinitialisez. Si le count dépasse le max, 429.",
  },
  {
    id: "node_71",
    type: "quiz",
    category: "API REST",
    title: "Idempotence",
    description: "Quelles méthodes HTTP sont idempotentes ?",
    options: [
      "Uniquement GET",
      "GET, PUT, DELETE (mais pas POST)",
      "POST et PUT",
      "Toutes les méthodes sont idempotentes",
    ],
    correct: 1,
    explanation: "GET, PUT et DELETE sont idempotentes : les appeler plusieurs fois produit le même résultat. POST n'est PAS idempotent : chaque appel peut créer une nouvelle ressource. PATCH est généralement non-idempotent.",
  },
  {
    id: "node_72",
    type: "code",
    category: "API REST",
    title: "Error handler global",
    description: "Centralisez la gestion des erreurs.",
    instruction: "Créez une classe <code>AppError</code> qui étend <code>Error</code> avec un <code>statusCode</code>. Puis un middleware d'erreur global qui renvoie le bon status et message JSON.",
    code_template: `class AppError extends Error {
  // statusCode + message
}

function errorHandler(err, req, res, next) {
  // Gérez AppError et erreurs génériques
}`,
    solution: `class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Erreur interne du serveur',
  });
}`,
    tests: [
      { type: "contains", expected: "extends Error" },
      { type: "contains", expected: "this.statusCode" },
      { type: "contains", expected: "err.statusCode || 500" },
      { type: "contains", expected: "res.status(statusCode)" },
    ],
    hint: "Étendez Error avec un statusCode, puis utilisez-le dans le middleware pour le bon code HTTP.",
  },
  // === WEBSOCKETS & TEMPS RÉEL (13-16) ===
  {
    id: "node_73",
    type: "intro",
    category: "WebSocket",
    title: "WebSockets avec Socket.io",
    description: "Les WebSockets permettent une communication bidirectionnelle en temps réel.",
    content: `<h3>⚡ WebSocket — Temps réel</h3>
<pre><code>// Serveur
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('Utilisateur connecté');

  socket.on('message', (data) => {
    io.emit('message', data); // broadcast
  });

  socket.on('disconnect', () => {
    console.log('Utilisateur déconnecté');
  });
});

// Client
const socket = io('http://localhost:3000');
socket.emit('message', 'Hello !');
socket.on('message', (data) => console.log(data));</code></pre>`,
  },
  {
    id: "node_74",
    type: "code",
    category: "WebSocket",
    title: "Serveur Socket.io",
    description: "Créez un serveur WebSocket basique.",
    instruction: "Configurez Socket.io sur un serveur HTTP. Écoutez l'événement <code>'connection'</code>, puis <code>'chat-message'</code> sur chaque socket. Broadcastez les messages à tous les clients connectés avec <code>io.emit</code>.",
    code_template: `const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer();
const io = new Server(server);

// Gérez les connexions et messages

server.listen(3000);`,
    solution: `const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer();
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('Connecté:', socket.id);

  socket.on('chat-message', (msg) => {
    io.emit('chat-message', msg);
  });

  socket.on('disconnect', () => {
    console.log('Déconnecté:', socket.id);
  });
});

server.listen(3000);`,
    tests: [
      { type: "contains", expected: "io.on('connection'" },
      { type: "contains", expected: "socket.on('chat-message'" },
      { type: "contains", expected: "io.emit('chat-message'" },
      { type: "contains", expected: "socket.on('disconnect'" },
    ],
    hint: "io.on('connection') pour les nouvelles connexions, socket.on() pour les événements, io.emit() pour broadcaster.",
  },
  {
    id: "node_75",
    type: "code",
    category: "WebSocket",
    title: "Rooms Socket.io",
    description: "Utilisez les rooms pour des channels séparés.",
    instruction: "Quand un client émet <code>'join-room'</code> avec un nom de room, faites-le rejoindre avec <code>socket.join(room)</code>. Quand il émet <code>'room-message'</code>, broadcastez uniquement à la room avec <code>io.to(room).emit</code>.",
    code_template: `io.on('connection', (socket) => {
  // Gérez join-room et room-message
});`,
    solution: `io.on('connection', (socket) => {
  socket.on('join-room', (room) => {
    socket.join(room);
    socket.to(room).emit('user-joined', socket.id);
  });

  socket.on('room-message', ({ room, message }) => {
    io.to(room).emit('room-message', { user: socket.id, message });
  });
});`,
    tests: [
      { type: "contains", expected: "socket.join(room)" },
      { type: "contains", expected: "io.to(room).emit" },
      { type: "contains", expected: "socket.on('join-room'" },
      { type: "contains", expected: "socket.on('room-message'" },
    ],
    hint: "socket.join(room) pour rejoindre, io.to(room).emit() pour envoyer à la room.",
  },
  {
    id: "node_76",
    type: "quiz",
    category: "WebSocket",
    title: "HTTP vs WebSocket",
    description: "Quelle est la différence fondamentale ?",
    options: [
      "WebSocket est plus sécurisé que HTTP",
      "HTTP est requête-réponse, WebSocket est bidirectionnel et persistant",
      "WebSocket remplace complètement HTTP",
      "HTTP est plus rapide que WebSocket",
    ],
    correct: 1,
    explanation: "HTTP est un protocole requête-réponse : le client envoie une requête, le serveur répond, la connexion se ferme. WebSocket maintient une connexion persistante et bidirectionnelle, permettant au serveur d'envoyer des données au client sans qu'il les demande.",
  },
  // === TESTS & DÉPLOIEMENT (17-20) ===
  {
    id: "node_77",
    type: "code",
    category: "Tests",
    title: "Test unitaire avec Jest",
    description: "Écrivez un test unitaire pour une fonction.",
    instruction: "Écrivez des tests Jest pour une fonction <code>add(a, b)</code> : testez <code>add(2, 3) === 5</code>, <code>add(-1, 1) === 0</code>, et que <code>add('a', 1)</code> lance une erreur.",
    code_template: `const { add } = require('./math');

describe('add', () => {
  // Écrivez les tests
});`,
    solution: `const { add } = require('./math');

describe('add', () => {
  test('additionne deux nombres positifs', () => {
    expect(add(2, 3)).toBe(5);
  });

  test('additionne un négatif et un positif', () => {
    expect(add(-1, 1)).toBe(0);
  });

  test('lance une erreur pour des non-nombres', () => {
    expect(() => add('a', 1)).toThrow();
  });
});`,
    tests: [
      { type: "contains", expected: "describe(" },
      { type: "contains", expected: "test(" },
      { type: "contains", expected: "expect(" },
      { type: "contains", expected: ".toBe(" },
      { type: "contains", expected: ".toThrow()" },
    ],
    hint: "describe() groupe les tests, test() définit un cas, expect().toBe() vérifie le résultat.",
  },
  {
    id: "node_78",
    type: "code",
    category: "Tests",
    title: "Test d'API avec supertest",
    description: "Testez une route Express avec supertest.",
    instruction: "Écrivez un test qui fait un <code>GET /api/warriors</code>, vérifie que le status est <code>200</code>, que le Content-Type contient <code>json</code> et que le body est un tableau.",
    code_template: `const request = require('supertest');
const app = require('./app');

describe('GET /api/warriors', () => {
  // Testez la route
});`,
    solution: `const request = require('supertest');
const app = require('./app');

describe('GET /api/warriors', () => {
  test('retourne 200 et un tableau JSON', async () => {
    const res = await request(app)
      .get('/api/warriors')
      .expect(200)
      .expect('Content-Type', /json/);

    expect(Array.isArray(res.body)).toBe(true);
  });
});`,
    tests: [
      { type: "contains", expected: "request(app)" },
      { type: "contains", expected: ".get('/api/warriors')" },
      { type: "contains", expected: ".expect(200)" },
      { type: "contains", expected: "Array.isArray" },
    ],
    hint: "request(app).get(path).expect(status) pour tester les routes. res.body contient la réponse.",
  },
  {
    id: "node_79",
    type: "quiz",
    category: "Déploiement",
    title: "Déployer un serveur Node.js",
    description: "Quelle est la meilleure pratique pour le déploiement ?",
    options: [
      "Exécuter node server.js directement en production",
      "Utiliser un process manager (PM2) et un reverse proxy (Nginx)",
      "Toujours déployer sur localhost",
      "Copier node_modules sur le serveur",
    ],
    correct: 1,
    explanation: "En production, utilisez PM2 pour gérer le processus (redémarrage auto, cluster, logs) et Nginx comme reverse proxy (SSL, load balancing, static files). Ne copiez jamais node_modules : faites npm install sur le serveur.",
  },
  {
    id: "node_80",
    type: "quiz",
    category: "Déploiement",
    title: "Récapitulatif Node.js",
    description: "Quelle affirmation sur Node.js est VRAIE ?",
    options: [
      "Node.js utilise plusieurs threads par défaut pour gérer les requêtes",
      "Express est la seule façon de créer un serveur HTTP en Node.js",
      "Node.js est idéal pour les applications I/O intensives grâce à son event loop non-bloquant",
      "Les callbacks sont la seule façon de gérer l'asynchrone en Node.js",
    ],
    correct: 2,
    explanation: "Node.js excelle dans les applications I/O (APIs, temps réel, streaming) grâce à son event loop single-thread non-bloquant. On peut créer des serveurs sans Express (module http natif), utiliser async/await au lieu de callbacks, et le worker_threads module permet le multi-threading si nécessaire.",
  },
];

addExercises("nodejs", exercises);
