import { addExercises } from ".";
import type { Exercise } from "@/app/exercises/[module]/exercise-client";

const exercises: Exercise[] = [
  // === HTTP NATIF (1-5) ===
  {
    id: "node_21",
    type: "intro",
    category: "HTTP",
    title: "Le module http",
    description: "Node.js permet de créer un serveur HTTP sans aucune dépendance.",
    content: `<h3>🌐 http — Serveur web natif</h3>
<p>Le module <code>http</code> intégré permet de créer un serveur web :</p>
<pre><code>const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World!');
});

server.listen(3000, () => {
  console.log('Serveur sur http://localhost:3000');
});</code></pre>
<p><code>req</code> = requête (URL, méthode, headers), <code>res</code> = réponse (status, body).</p>`,
  },
  {
    id: "node_22",
    type: "code",
    category: "HTTP",
    title: "Serveur HTTP basique",
    description: "Créez un serveur HTTP qui répond 'Bienvenue sur Lyoko !'.",
    instruction: "Créez un serveur HTTP avec <code>http.createServer</code> qui répond avec le status <code>200</code>, le header <code>Content-Type: text/plain</code> et le body <strong>Bienvenue sur Lyoko !</strong>. Écoutez sur le port <code>3000</code>.",
    code_template: `const http = require('http');

const server = http.createServer((req, res) => {
  // Répondez ici
});

server.listen(3000);`,
    solution: `const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bienvenue sur Lyoko !');
});

server.listen(3000);`,
    tests: [
      { type: "contains", expected: "http.createServer" },
      { type: "contains", expected: "res.writeHead(200" },
      { type: "contains", expected: "res.end(" },
      { type: "contains", expected: "server.listen(3000" },
    ],
    hint: "res.writeHead(status, headers) puis res.end(body) pour envoyer la réponse.",
  },
  {
    id: "node_23",
    type: "code",
    category: "HTTP",
    title: "Réponse JSON",
    description: "Envoyez une réponse JSON depuis le serveur.",
    instruction: "Créez un serveur qui répond avec du JSON : <code>{ status: 'ok', message: 'Connexion établie' }</code> et le Content-Type <code>application/json</code>.",
    code_template: `const http = require('http');

const server = http.createServer((req, res) => {
  const data = { status: 'ok', message: 'Connexion établie' };
  // Répondez en JSON
});

server.listen(3000);`,
    solution: `const http = require('http');

const server = http.createServer((req, res) => {
  const data = { status: 'ok', message: 'Connexion établie' };
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
});

server.listen(3000);`,
    tests: [
      { type: "contains", expected: "application/json" },
      { type: "contains", expected: "JSON.stringify" },
      { type: "contains", expected: "res.end(" },
    ],
    hint: "Content-Type: application/json + JSON.stringify(obj) pour convertir l'objet.",
  },
  {
    id: "node_24",
    type: "code",
    category: "HTTP",
    title: "Routage simple",
    description: "Gérez plusieurs routes avec req.url.",
    instruction: "Créez un serveur avec 3 routes : <code>/</code> → <strong>Accueil</strong>, <code>/api</code> → JSON <code>{ api: true }</code>, sinon <strong>404</strong>.",
    code_template: `const http = require('http');

const server = http.createServer((req, res) => {
  // Routage basé sur req.url
});

server.listen(3000);`,
    solution: `const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Accueil');
  } else if (req.url === '/api') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ api: true }));
  } else {
    res.writeHead(404);
    res.end('404');
  }
});

server.listen(3000);`,
    tests: [
      { type: "contains", expected: "req.url" },
      { type: "contains", expected: "'/'" },
      { type: "contains", expected: "'/api'" },
      { type: "contains", expected: "404" },
    ],
    hint: "Utilisez if/else if sur req.url pour le routage.",
  },
  {
    id: "node_25",
    type: "quiz",
    category: "HTTP",
    title: "Codes de status HTTP",
    description: "Quel code indique une création réussie ?",
    options: [
      "200 OK",
      "201 Created",
      "204 No Content",
      "301 Moved Permanently",
    ],
    correct: 1,
    explanation: "201 Created est le code standard pour indiquer qu'une ressource a été créée avec succès (typiquement après un POST). 200 est le succès générique, 204 signifie succès sans contenu, 301 est une redirection permanente.",
  },
  // === EXPRESS (6-15) ===
  {
    id: "node_26",
    type: "intro",
    category: "Express",
    title: "Express.js",
    description: "Express est le framework web le plus populaire pour Node.js.",
    content: `<h3>🚀 Express — Framework web minimaliste</h3>
<pre><code>const express = require('express');
const app = express();

app.use(express.json()); // parser le JSON

app.get('/', (req, res) => {
  res.send('Hello Express !');
});

app.get('/api/users', (req, res) => {
  res.json([{ id: 1, name: 'Jérémie' }]);
});

app.post('/api/users', (req, res) => {
  res.status(201).json(req.body);
});

app.listen(3000);</code></pre>
<p>Installation : <code>npm install express</code></p>`,
  },
  {
    id: "node_27",
    type: "code",
    category: "Express",
    title: "Serveur Express basique",
    description: "Créez un serveur Express avec une route GET.",
    instruction: "Créez un serveur Express avec une route <code>GET /</code> qui renvoie <strong>Bienvenue sur l'API Carthage</strong> et écoutez sur le port <code>3000</code>.",
    code_template: `const express = require('express');
const app = express();

// Route GET /

// Démarrage du serveur`,
    solution: `const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Bienvenue sur l\\'API Carthage');
});

app.listen(3000);`,
    tests: [
      { type: "contains", expected: "express()" },
      { type: "contains", expected: "app.get('/'," },
      { type: "contains", expected: "res.send(" },
      { type: "contains", expected: "app.listen(3000)" },
    ],
    hint: "app.get(path, handler) + res.send(text) pour les réponses texte.",
  },
  {
    id: "node_28",
    type: "code",
    category: "Express",
    title: "Route JSON",
    description: "Renvoyez du JSON avec res.json().",
    instruction: "Créez une route <code>GET /api/warriors</code> qui renvoie un tableau JSON de guerriers : <code>[{ name: 'Ulrich', sector: 'Forêt' }, { name: 'Yumi', sector: 'Montagne' }]</code>.",
    code_template: `const express = require('express');
const app = express();

// Route GET /api/warriors

app.listen(3000);`,
    solution: `const express = require('express');
const app = express();

app.get('/api/warriors', (req, res) => {
  res.json([
    { name: 'Ulrich', sector: 'Forêt' },
    { name: 'Yumi', sector: 'Montagne' },
  ]);
});

app.listen(3000);`,
    tests: [
      { type: "contains", expected: "app.get('/api/warriors'" },
      { type: "contains", expected: "res.json(" },
      { type: "contains", expected: "Ulrich" },
    ],
    hint: "res.json() envoie automatiquement du JSON avec le bon Content-Type.",
  },
  {
    id: "node_29",
    type: "code",
    category: "Express",
    title: "Route POST avec body",
    description: "Recevez des données JSON via POST.",
    instruction: "Activez le middleware <code>express.json()</code>, puis créez une route <code>POST /api/warriors</code> qui lit <code>req.body</code> et renvoie le guerrier créé avec le status <code>201</code>.",
    code_template: `const express = require('express');
const app = express();

// Middleware JSON

// Route POST /api/warriors

app.listen(3000);`,
    solution: `const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/warriors', (req, res) => {
  const warrior = req.body;
  res.status(201).json(warrior);
});

app.listen(3000);`,
    tests: [
      { type: "contains", expected: "express.json()" },
      { type: "contains", expected: "app.post('/api/warriors'" },
      { type: "contains", expected: "req.body" },
      { type: "contains", expected: "status(201)" },
    ],
    hint: "app.use(express.json()) pour parser le body, req.body contient les données, res.status(201).json(data).",
  },
  {
    id: "node_30",
    type: "code",
    category: "Express",
    title: "Paramètres d'URL",
    description: "Utilisez les paramètres dynamiques dans les routes.",
    instruction: "Créez une route <code>GET /api/warriors/:id</code> qui lit <code>req.params.id</code> et renvoie <code>{ id: req.params.id, message: 'Guerrier trouvé' }</code>.",
    code_template: `const express = require('express');
const app = express();

// Route avec paramètre :id

app.listen(3000);`,
    solution: `const express = require('express');
const app = express();

app.get('/api/warriors/:id', (req, res) => {
  res.json({ id: req.params.id, message: 'Guerrier trouvé' });
});

app.listen(3000);`,
    tests: [
      { type: "contains", expected: "/:id" },
      { type: "contains", expected: "req.params.id" },
      { type: "contains", expected: "res.json(" },
    ],
    hint: ":id dans la route, puis req.params.id dans le handler pour lire la valeur.",
  },
  {
    id: "node_31",
    type: "code",
    category: "Express",
    title: "Query parameters",
    description: "Lisez les paramètres de requête.",
    instruction: "Créez une route <code>GET /api/search</code> qui lit <code>req.query.q</code> et renvoie <code>{ query: q, results: [] }</code>. Si <code>q</code> est absent, renvoyez un status <code>400</code> avec <code>{ error: 'Paramètre q requis' }</code>.",
    code_template: `const express = require('express');
const app = express();

// Route GET /api/search avec query param

app.listen(3000);`,
    solution: `const express = require('express');
const app = express();

app.get('/api/search', (req, res) => {
  const q = req.query.q;
  if (!q) {
    return res.status(400).json({ error: 'Paramètre q requis' });
  }
  res.json({ query: q, results: [] });
});

app.listen(3000);`,
    tests: [
      { type: "contains", expected: "req.query.q" },
      { type: "contains", expected: "status(400)" },
      { type: "contains", expected: "Paramètre q requis" },
      { type: "contains", expected: "res.json(" },
    ],
    hint: "req.query contient les paramètres après le ? dans l'URL. Vérifiez si q existe avant de répondre.",
  },
  {
    id: "node_32",
    type: "quiz",
    category: "Express",
    title: "req.params vs req.query",
    description: "Quelle est la différence ?",
    options: [
      "params est pour GET, query est pour POST",
      "params vient de la route (/users/:id), query vient de l'URL (?key=val)",
      "Il n'y a aucune différence",
      "query est plus sécurisé que params",
    ],
    correct: 1,
    explanation: "req.params contient les segments dynamiques de la route (ex: /users/:id → req.params.id). req.query contient les paramètres de requête après le ? (ex: /search?q=test → req.query.q).",
  },
  {
    id: "node_33",
    type: "code",
    category: "Express",
    title: "CRUD complet",
    description: "Implémentez un CRUD basique pour des warriors.",
    instruction: "Créez les 4 routes CRUD pour un tableau <code>warriors</code> en mémoire : <code>GET /api/warriors</code> (lister), <code>POST</code> (créer), <code>PUT /:id</code> (modifier), <code>DELETE /:id</code> (supprimer).",
    code_template: `const express = require('express');
const app = express();
app.use(express.json());

let warriors = [{ id: 1, name: 'Ulrich' }];
let nextId = 2;

// GET - lister
// POST - créer
// PUT - modifier
// DELETE - supprimer

app.listen(3000);`,
    solution: `const express = require('express');
const app = express();
app.use(express.json());

let warriors = [{ id: 1, name: 'Ulrich' }];
let nextId = 2;

app.get('/api/warriors', (req, res) => {
  res.json(warriors);
});

app.post('/api/warriors', (req, res) => {
  const w = { id: nextId++, ...req.body };
  warriors.push(w);
  res.status(201).json(w);
});

app.put('/api/warriors/:id', (req, res) => {
  const idx = warriors.findIndex(w => w.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Non trouvé' });
  warriors[idx] = { ...warriors[idx], ...req.body };
  res.json(warriors[idx]);
});

app.delete('/api/warriors/:id', (req, res) => {
  warriors = warriors.filter(w => w.id !== Number(req.params.id));
  res.status(204).end();
});

app.listen(3000);`,
    tests: [
      { type: "contains", expected: "app.get('/api/warriors'" },
      { type: "contains", expected: "app.post(" },
      { type: "contains", expected: "app.put(" },
      { type: "contains", expected: "app.delete(" },
      { type: "contains", expected: "status(201)" },
    ],
    hint: "GET = lister, POST = créer avec status 201, PUT = modifier, DELETE = supprimer avec status 204.",
  },
  {
    id: "node_34",
    type: "puzzle",
    category: "Express",
    title: "Assemblez une route Express",
    description: "Remettez les morceaux dans l'ordre pour créer une route Express.",
    pieces: [
      "app.get('/api/users/:id',",
      "  (req, res) => {",
      "    const id = req.params.id;",
      "    const user = users.find(u => u.id === Number(id));",
      "    if (!user) return res.status(404).json({ error: 'Non trouvé' });",
      "    res.json(user);",
      "  }",
      ");",
    ],
  },
  {
    id: "node_35",
    type: "code",
    category: "Express",
    title: "Router Express",
    description: "Organisez les routes avec express.Router().",
    instruction: "Créez un <code>express.Router()</code> pour les routes <code>/api/warriors</code>. Ajoutez <code>GET /</code> et <code>POST /</code> sur le router, puis montez-le sur l'app avec <code>app.use('/api/warriors', router)</code>.",
    code_template: `const express = require('express');
const app = express();
app.use(express.json());

// Créez et configurez le router

// Montez le router

app.listen(3000);`,
    solution: `const express = require('express');
const app = express();
app.use(express.json());

const router = express.Router();

router.get('/', (req, res) => {
  res.json([{ id: 1, name: 'Ulrich' }]);
});

router.post('/', (req, res) => {
  res.status(201).json(req.body);
});

app.use('/api/warriors', router);

app.listen(3000);`,
    tests: [
      { type: "contains", expected: "express.Router()" },
      { type: "contains", expected: "router.get(" },
      { type: "contains", expected: "router.post(" },
      { type: "contains", expected: "app.use('/api/warriors', router)" },
    ],
    hint: "express.Router() crée un mini-routeur, montez-le avec app.use(prefix, router).",
  },
  // === MIDDLEWARE (16-20) ===
  {
    id: "node_36",
    type: "intro",
    category: "Middleware",
    title: "Les middlewares Express",
    description: "Les middlewares sont des fonctions qui s'exécutent entre la requête et la réponse.",
    content: `<h3>🔗 Middleware — Pipeline de traitement</h3>
<pre><code>// Middleware = function(req, res, next)
app.use((req, res, next) => {
  console.log(\`\${req.method} \${req.url}\`);
  next(); // passe au middleware suivant
});

// Middleware intégrés
app.use(express.json());        // parse le body JSON
app.use(express.static('public')); // fichiers statiques

// Middleware tiers
app.use(cors());    // Cross-Origin
app.use(helmet());  // sécurité headers
app.use(morgan('dev')); // logging</code></pre>
<p>L'ordre des middleware est <strong>crucial</strong> — ils s'exécutent dans l'ordre de déclaration.</p>`,
  },
  {
    id: "node_37",
    type: "code",
    category: "Middleware",
    title: "Logger middleware",
    description: "Créez un middleware qui logue chaque requête.",
    instruction: "Créez un middleware <code>logger</code> qui affiche <code>[TIMESTAMP] METHOD /path</code> pour chaque requête. Utilisez <code>new Date().toISOString()</code> pour le timestamp. N'oubliez pas <code>next()</code>.",
    code_template: `const express = require('express');
const app = express();

// Middleware logger

app.get('/', (req, res) => res.send('OK'));
app.listen(3000);`,
    solution: `const express = require('express');
const app = express();

app.use((req, res, next) => {
  console.log(\`[\${new Date().toISOString()}] \${req.method} \${req.url}\`);
  next();
});

app.get('/', (req, res) => res.send('OK'));
app.listen(3000);`,
    tests: [
      { type: "contains", expected: "app.use(" },
      { type: "contains", expected: "req.method" },
      { type: "contains", expected: "req.url" },
      { type: "contains", expected: "next()" },
    ],
    hint: "app.use((req, res, next) => { ... next(); }) — toujours appeler next() pour continuer.",
  },
  {
    id: "node_38",
    type: "code",
    category: "Middleware",
    title: "Auth middleware",
    description: "Créez un middleware d'authentification.",
    instruction: "Créez un middleware <code>authMiddleware</code> qui vérifie la présence d'un header <code>Authorization</code>. Si absent, renvoyez <code>401</code> avec <code>{ error: 'Non autorisé' }</code>. Sinon, appelez <code>next()</code>.",
    code_template: `function authMiddleware(req, res, next) {
  // Vérifiez le header Authorization
}`,
    solution: `function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(401).json({ error: 'Non autorisé' });
  }
  next();
}`,
    tests: [
      { type: "contains", expected: "req.headers.authorization" },
      { type: "contains", expected: "status(401)" },
      { type: "contains", expected: "Non autorisé" },
      { type: "contains", expected: "next()" },
    ],
    hint: "req.headers.authorization contient le header. Sans header → 401, avec header → next().",
  },
  {
    id: "node_39",
    type: "code",
    category: "Middleware",
    title: "Error middleware",
    description: "Créez un middleware de gestion d'erreurs.",
    instruction: "Créez un middleware d'erreur Express (4 paramètres : <code>err, req, res, next</code>) qui logue l'erreur et renvoie <code>500</code> avec <code>{ error: 'Erreur interne du serveur' }</code>.",
    code_template: `const express = require('express');
const app = express();

app.get('/crash', (req, res) => {
  throw new Error('Boom !');
});

// Middleware d'erreur (doit être le dernier)

app.listen(3000);`,
    solution: `const express = require('express');
const app = express();

app.get('/crash', (req, res) => {
  throw new Error('Boom !');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

app.listen(3000);`,
    tests: [
      { type: "contains", expected: "(err, req, res, next)" },
      { type: "contains", expected: "console.error" },
      { type: "contains", expected: "status(500)" },
      { type: "contains", expected: "Erreur interne" },
    ],
    hint: "Un middleware d'erreur a 4 paramètres (err, req, res, next). Il doit être déclaré APRÈS toutes les routes.",
  },
  {
    id: "node_40",
    type: "quiz",
    category: "Middleware",
    title: "Ordre des middlewares",
    description: "Pourquoi l'ordre des middleware est-il important ?",
    options: [
      "Il n'est pas important, Express les trie automatiquement",
      "Ils s'exécutent dans l'ordre de déclaration, donc un logger doit être avant les routes",
      "Les middleware POST s'exécutent avant les GET",
      "Express exécute tous les middlewares en parallèle",
    ],
    correct: 1,
    explanation: "Express exécute les middlewares dans l'ordre exact de leur déclaration (app.use). Un logger doit être en premier, le parser JSON avant les routes POST, et le middleware d'erreur en dernier.",
  },
];

addExercises("nodejs", exercises);
