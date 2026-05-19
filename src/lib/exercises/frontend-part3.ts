import { addExercises } from "./registry";
import type { Exercise } from "./registry";

// @ts-nocheck — Auto-converted from exercises-frontend-part3.js
const exercises: Exercise[] = [
    // ─── BOOTSTRAP INTRO ─────────────────────────────────────────
    {
      id: "fe_101", type: "intro", category: "Bootstrap - Introduction",
      title: "Bienvenue dans Bootstrap !",
      description: "Le framework CSS le plus populaire.",
      content: `
        <h5 style="color:#7952b3;">🅱️ Bootstrap — Le framework CSS #1</h5>
        <p><strong>Bootstrap</strong> est un framework CSS qui fournit :</p>
        <ul>
          <li><strong>Grille responsive</strong> — Système de 12 colonnes</li>
          <li><strong>Composants</strong> — Boutons, cartes, modals, navbars...</li>
          <li><strong>Utilitaires</strong> — Classes pour margin, padding, display, flexbox...</li>
          <li><strong>JavaScript</strong> — Composants interactifs (dropdown, carousel...)</li>
        </ul>
        <p>Pour l'utiliser, ajoutez le CDN dans votre <code>&lt;head&gt;</code> :</p>
      `,
      code_example: `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">\n<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>`
    },
    {
      id: "fe_102", type: "quiz", category: "Bootstrap - Introduction",
      title: "Système de grille Bootstrap",
      instruction: "Combien de colonnes comporte le système de grille Bootstrap ?",
      options: ["12", "10", "16", "8"],
      correct: 0,
      explanation: "Bootstrap utilise un système de grille à 12 colonnes."
    },
    {
      id: "fe_103", type: "intro", category: "Bootstrap - Grille",
      title: "La grille Bootstrap",
      description: "Conteneurs, lignes et colonnes.",
      content: `
        <h5 style="color:#7952b3;">📐 Le système de grille</h5>
        <p>La grille Bootstrap se compose de 3 niveaux :</p>
        <ol>
          <li><code>.container</code> — Conteneur centré (ou <code>.container-fluid</code> pour pleine largeur)</li>
          <li><code>.row</code> — Ligne (flexbox)</li>
          <li><code>.col-*</code> — Colonnes (1 à 12)</li>
        </ol>
        <h6>Breakpoints :</h6>
        <ul>
          <li><code>col-</code> — Toujours</li>
          <li><code>col-sm-</code> — ≥576px</li>
          <li><code>col-md-</code> — ≥768px</li>
          <li><code>col-lg-</code> — ≥992px</li>
          <li><code>col-xl-</code> — ≥1200px</li>
        </ul>
      `,
      code_example: `<div class="container">\n  <div class="row">\n    <div class="col-md-4">Colonne 1</div>\n    <div class="col-md-4">Colonne 2</div>\n    <div class="col-md-4">Colonne 3</div>\n  </div>\n</div>`
    },
    {
      id: "fe_104", type: "puzzle", category: "Bootstrap - Grille",
      title: "Grille 3 colonnes",
      description: "Reconstituez une grille Bootstrap à 3 colonnes.",
      pieces: ['<div class="container">', '<div class="row">', '<div class="col-md-4">A</div>', '<div class="col-md-4">B</div>', '<div class="col-md-4">C</div>', '</div>', '</div>'],
      hint: "container > row > col-md-4 (3 × 4 = 12)."
    },
    {
      id: "fe_105", type: "code", category: "Bootstrap - Grille",
      title: "Grille 2 colonnes",
      description: "Créez une grille avec sidebar et contenu.",
      instruction: "Créez un <code>container</code> avec un <code>row</code> contenant une colonne <code>col-md-3</code> (sidebar) et une <code>col-md-9</code> (contenu).",
      language: "HTML",
      code_template: "",
      tests: [
        { type: "contains", expected: 'class="container"' },
        { type: "contains", expected: 'class="row"' },
        { type: "contains", expected: "col-md-3" },
        { type: "contains", expected: "col-md-9" }
      ],
      hint: "3 + 9 = 12 colonnes. Imbriquez container > row > cols."
    },
    {
      id: "fe_106", type: "quiz", category: "Bootstrap - Grille",
      title: "Colonnes responsives",
      instruction: "Que signifie <code>col-lg-6</code> ?",
      options: [
        "6 colonnes à partir de 992px, pleine largeur en dessous",
        "6 colonnes sur tous les écrans",
        "6 pixels de large sur grands écrans",
        "6% de la largeur sur grands écrans"
      ],
      correct: 0,
      explanation: "col-lg-6 = 6 colonnes (50%) à partir de 992px. En dessous, l'élément prend 100%."
    },
    // ─── Bootstrap Composants ────────────────────────────────────
    {
      id: "fe_107", type: "intro", category: "Bootstrap - Composants",
      title: "Les boutons Bootstrap",
      description: "Boutons stylisés avec des classes.",
      content: `
        <h5 style="color:#7952b3;">🔘 Boutons Bootstrap</h5>
        <p>Bootstrap fournit des classes de boutons prêtes à l'emploi :</p>
        <ul>
          <li><code>.btn</code> — Classe de base (obligatoire)</li>
          <li><code>.btn-primary</code> — Bleu</li>
          <li><code>.btn-secondary</code> — Gris</li>
          <li><code>.btn-success</code> — Vert</li>
          <li><code>.btn-danger</code> — Rouge</li>
          <li><code>.btn-warning</code> — Jaune</li>
          <li><code>.btn-outline-*</code> — Variantes avec contour</li>
          <li><code>.btn-lg</code> / <code>.btn-sm</code> — Tailles</li>
        </ul>
      `,
      code_example: `<button class="btn btn-primary">Primary</button>\n<button class="btn btn-outline-danger btn-lg">Danger Large</button>\n<a href="#" class="btn btn-success">Lien bouton</a>`
    },
    {
      id: "fe_108", type: "code", category: "Bootstrap - Composants",
      title: "Bouton Bootstrap",
      description: "Créez un bouton primary.",
      instruction: "Créez un <code>&lt;button&gt;</code> avec les classes <code>btn btn-primary</code> et le texte <strong>Cliquez-moi</strong>.",
      language: "HTML",
      code_template: "",
      tests: [
        { type: "contains", expected: "<button" },
        { type: "contains", expected: "btn btn-primary" },
        { type: "contains", expected: "Cliquez-moi" }
      ],
      hint: '<button class="btn btn-primary">texte</button>'
    },
    {
      id: "fe_109", type: "intro", category: "Bootstrap - Composants",
      title: "Les cartes Bootstrap",
      description: "Composant card pour afficher du contenu.",
      content: `
        <h5 style="color:#7952b3;">🃏 Les cartes (Cards)</h5>
        <p>Le composant <code>.card</code> est très polyvalent :</p>
      `,
      code_example: `<div class="card" style="width: 18rem;">\n  <img src="image.jpg" class="card-img-top" alt="...">\n  <div class="card-body">\n    <h5 class="card-title">Titre</h5>\n    <p class="card-text">Description...</p>\n    <a href="#" class="btn btn-primary">Voir plus</a>\n  </div>\n</div>`
    },
    {
      id: "fe_110", type: "puzzle", category: "Bootstrap - Composants",
      title: "Carte Bootstrap",
      description: "Reconstituez une carte Bootstrap.",
      pieces: ['<div class="card">', '<div class="card-body">', '<h5 class="card-title">Mon titre</h5>', '<p class="card-text">Description</p>', '<a href="#" class="btn btn-primary">Action</a>', '</div>', '</div>'],
      hint: "card > card-body > titre + texte + bouton."
    },
    {
      id: "fe_111", type: "code", category: "Bootstrap - Composants",
      title: "Carte complète",
      description: "Créez une carte Bootstrap.",
      instruction: "Créez une <code>card</code> avec un <code>card-body</code> contenant un <code>card-title</code> (<strong>Projet</strong>) et un <code>card-text</code> (<strong>Mon premier projet</strong>).",
      language: "HTML",
      code_template: "",
      tests: [
        { type: "contains", expected: 'class="card"' },
        { type: "contains", expected: 'class="card-body"' },
        { type: "contains", expected: 'class="card-title"' },
        { type: "contains", expected: "Projet" },
        { type: "contains", expected: 'class="card-text"' },
        { type: "contains", expected: "Mon premier projet" }
      ],
      hint: "Imbriquez card > card-body > h5.card-title + p.card-text."
    },
    // ─── Bootstrap Navbar ────────────────────────────────────────
    {
      id: "fe_112", type: "intro", category: "Bootstrap - Navigation",
      title: "La Navbar Bootstrap",
      description: "Barre de navigation responsive.",
      content: `
        <h5 style="color:#7952b3;">🧭 Navbar Bootstrap</h5>
        <p>La navbar Bootstrap est responsive par défaut :</p>
        <ul>
          <li><code>.navbar</code> — Conteneur principal</li>
          <li><code>.navbar-expand-lg</code> — S'étend à partir de lg</li>
          <li><code>.navbar-dark</code> / <code>.navbar-light</code> — Thème</li>
          <li><code>.navbar-brand</code> — Logo/nom du site</li>
          <li><code>.navbar-toggler</code> — Bouton hamburger mobile</li>
          <li><code>.navbar-nav</code> — Liste de liens</li>
          <li><code>.nav-item</code> / <code>.nav-link</code> — Éléments de nav</li>
        </ul>
      `,
      code_example: `<nav class="navbar navbar-expand-lg navbar-dark bg-dark">\n  <div class="container">\n    <a class="navbar-brand" href="#">MonSite</a>\n    <div class="navbar-nav">\n      <a class="nav-link" href="#">Accueil</a>\n      <a class="nav-link" href="#">Contact</a>\n    </div>\n  </div>\n</nav>`
    },
    {
      id: "fe_113", type: "quiz", category: "Bootstrap - Navigation",
      title: "Navbar responsive",
      instruction: "Quelle classe rend la navbar responsive (hamburger sur mobile) ?",
      options: ["navbar-expand-lg", "navbar-responsive", "navbar-mobile", "navbar-collapse"],
      correct: 0,
      explanation: "navbar-expand-lg affiche les liens à partir de lg, hamburger en dessous."
    },
    {
      id: "fe_114", type: "code", category: "Bootstrap - Navigation",
      title: "Navbar simple",
      description: "Créez une navbar Bootstrap.",
      instruction: "Créez une <code>&lt;nav&gt;</code> avec les classes <code>navbar navbar-expand-lg navbar-dark bg-dark</code> contenant un <code>navbar-brand</code> avec le texte <strong>MonSite</strong>.",
      language: "HTML",
      code_template: "",
      tests: [
        { type: "contains", expected: "<nav" },
        { type: "contains", expected: "navbar navbar-expand-lg" },
        { type: "contains", expected: "navbar-dark bg-dark" },
        { type: "contains", expected: "navbar-brand" },
        { type: "contains", expected: "MonSite" }
      ],
      hint: '<nav class="navbar navbar-expand-lg navbar-dark bg-dark"><a class="navbar-brand" href="#">MonSite</a></nav>'
    },
    // ─── Bootstrap Utilitaires ───────────────────────────────────
    {
      id: "fe_115", type: "intro", category: "Bootstrap - Utilitaires",
      title: "Classes utilitaires Bootstrap",
      description: "Spacing, display, text, flex...",
      content: `
        <h5 style="color:#7952b3;">🛠️ Classes utilitaires</h5>
        <p>Bootstrap offre des centaines de classes utilitaires :</p>
        <h6>Spacing (m = margin, p = padding) :</h6>
        <ul>
          <li><code>m-3</code> — margin: 1rem</li>
          <li><code>p-2</code> — padding: 0.5rem</li>
          <li><code>mt-4</code> — margin-top: 1.5rem</li>
          <li><code>px-3</code> — padding horizontal</li>
          <li><code>mx-auto</code> — centrage horizontal</li>
        </ul>
        <h6>Display :</h6>
        <ul>
          <li><code>d-flex</code>, <code>d-none</code>, <code>d-block</code></li>
          <li><code>d-md-flex</code> — flex à partir de md</li>
        </ul>
        <h6>Texte :</h6>
        <ul>
          <li><code>text-center</code>, <code>text-end</code></li>
          <li><code>fw-bold</code>, <code>fs-4</code></li>
        </ul>
      `
    },
    {
      id: "fe_116", type: "quiz", category: "Bootstrap - Utilitaires",
      title: "Classe de margin",
      instruction: "Que fait la classe <code>mt-3</code> en Bootstrap ?",
      options: [
        "Ajoute un margin-top de 1rem",
        "Ajoute un margin total de 3px",
        "Définit la taille du texte à 3",
        "Ajoute un margin de 3rem"
      ],
      correct: 0,
      explanation: "m = margin, t = top, 3 = 1rem. Les valeurs vont de 0 à 5."
    },
    {
      id: "fe_117", type: "code", category: "Bootstrap - Utilitaires",
      title: "Centrer avec utilitaires",
      description: "Utilisez les classes utilitaires pour centrer.",
      instruction: "Créez un <code>&lt;div&gt;</code> avec les classes <code>d-flex justify-content-center align-items-center</code> et <code>p-4</code>.",
      language: "HTML",
      code_template: "",
      tests: [
        { type: "contains", expected: "d-flex" },
        { type: "contains", expected: "justify-content-center" },
        { type: "contains", expected: "align-items-center" },
        { type: "contains", expected: "p-4" }
      ],
      hint: "Combinez les classes dans l'attribut class du div."
    },
    {
      id: "fe_118", type: "puzzle", category: "Bootstrap - Utilitaires",
      title: "Alerte Bootstrap",
      description: "Reconstituez une alerte Bootstrap.",
      pieces: ['<div', ' class="alert alert-success"', ' role="alert">', '<strong>Bravo !</strong>', ' Opération réussie.', '</div>'],
      hint: "alert + alert-success + role='alert' + contenu."
    },
    // ─── Bootstrap Formulaires ───────────────────────────────────
    {
      id: "fe_119", type: "intro", category: "Bootstrap - Formulaires",
      title: "Formulaires Bootstrap",
      description: "Formulaires stylisés automatiquement.",
      content: `
        <h5 style="color:#7952b3;">📝 Formulaires Bootstrap</h5>
        <p>Bootstrap stylise les formulaires avec des classes simples :</p>
        <ul>
          <li><code>.form-control</code> — Inputs et textareas</li>
          <li><code>.form-label</code> — Labels</li>
          <li><code>.form-select</code> — Select/dropdown</li>
          <li><code>.form-check</code> — Checkboxes et radios</li>
          <li><code>.mb-3</code> — Espacement entre les champs</li>
          <li><code>.form-floating</code> — Labels flottants</li>
        </ul>
      `,
      code_example: `<div class="mb-3">\n  <label class="form-label">Email</label>\n  <input type="email" class="form-control" placeholder="nom@exemple.com">\n</div>`
    },
    {
      id: "fe_120", type: "code", category: "Bootstrap - Formulaires",
      title: "Champ Bootstrap",
      description: "Créez un champ de formulaire Bootstrap.",
      instruction: "Créez un <code>div.mb-3</code> contenant un <code>label.form-label</code> (<strong>Nom</strong>) et un <code>input.form-control</code> de type <strong>text</strong>.",
      language: "HTML",
      code_template: "",
      tests: [
        { type: "contains", expected: 'class="mb-3"' },
        { type: "contains", expected: 'class="form-label"' },
        { type: "contains", expected: "Nom" },
        { type: "contains", expected: 'class="form-control"' },
        { type: "contains", expected: 'type="text"' }
      ],
      hint: "div.mb-3 > label.form-label + input.form-control"
    },
    // ─── BULMA INTRO ─────────────────────────────────────────────
    {
      id: "fe_121", type: "intro", category: "Bulma - Introduction",
      title: "Bienvenue dans Bulma !",
      description: "Un framework CSS moderne et léger.",
      content: `
        <h5 style="color:#00d1b2;">🎨 Bulma — CSS Framework moderne</h5>
        <p><strong>Bulma</strong> est un framework CSS pur (pas de JavaScript) :</p>
        <ul>
          <li><strong>Flexbox-based</strong> — Tout est basé sur Flexbox</li>
          <li><strong>Modulaire</strong> — Importez seulement ce dont vous avez besoin</li>
          <li><strong>Responsive</strong> — Mobile-first</li>
          <li><strong>Pas de JS</strong> — CSS uniquement, vous choisissez votre JS</li>
        </ul>
        <p>Différences avec Bootstrap :</p>
        <ul>
          <li>Bulma est <strong>CSS-only</strong> (pas de JS inclus)</li>
          <li>Syntaxe de classes plus <strong>lisible</strong> (is-primary, is-large...)</li>
          <li>Basé sur <strong>Flexbox</strong> nativement</li>
        </ul>
      `,
      code_example: `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">`
    },
    {
      id: "fe_122", type: "quiz", category: "Bulma - Introduction",
      title: "Bulma vs Bootstrap",
      instruction: "Quelle est la principale différence entre Bulma et Bootstrap ?",
      options: [
        "Bulma est CSS-only, Bootstrap inclut du JavaScript",
        "Bulma est payant, Bootstrap est gratuit",
        "Bulma utilise Grid, Bootstrap utilise Flexbox",
        "Bulma est plus ancien que Bootstrap"
      ],
      correct: 0,
      explanation: "Bulma est purement CSS, pas de JavaScript. Bootstrap inclut des composants JS."
    },
    // ─── Bulma Colonnes ──────────────────────────────────────────
    {
      id: "fe_123", type: "intro", category: "Bulma - Colonnes",
      title: "Les colonnes Bulma",
      description: "Système de colonnes Flexbox.",
      content: `
        <h5 style="color:#00d1b2;">📐 Colonnes Bulma</h5>
        <p>Bulma utilise un système de colonnes basé sur Flexbox :</p>
        <ul>
          <li><code>.columns</code> — Conteneur de colonnes</li>
          <li><code>.column</code> — Une colonne (auto-sizing)</li>
          <li><code>.is-half</code> — 50%</li>
          <li><code>.is-one-third</code> — 33%</li>
          <li><code>.is-one-quarter</code> — 25%</li>
          <li><code>.is-4</code> — 4/12 colonnes</li>
        </ul>
      `,
      code_example: `<div class="columns">\n  <div class="column is-one-third">Sidebar</div>\n  <div class="column">Contenu principal</div>\n</div>`
    },
    {
      id: "fe_124", type: "puzzle", category: "Bulma - Colonnes",
      title: "Colonnes Bulma",
      description: "Reconstituez un layout Bulma.",
      pieces: ['<div class="columns">', '<div class="column is-4">Sidebar</div>', '<div class="column is-8">Contenu</div>', '</div>'],
      hint: "columns > column is-4 + column is-8 (4+8=12)."
    },
    {
      id: "fe_125", type: "code", category: "Bulma - Colonnes",
      title: "3 colonnes Bulma",
      description: "Créez 3 colonnes égales.",
      instruction: "Créez un <code>div.columns</code> contenant 3 <code>div.column</code> avec les textes <strong>A</strong>, <strong>B</strong>, <strong>C</strong>.",
      language: "HTML",
      code_template: "",
      tests: [
        { type: "contains", expected: 'class="columns"' },
        { type: "match", expected: 'class="column".*class="column".*class="column"', flags: "s" }
      ],
      hint: "columns > 3 × column. Les colonnes Bulma sont auto-sizing par défaut."
    },
    // ─── Bulma Composants ────────────────────────────────────────
    {
      id: "fe_126", type: "intro", category: "Bulma - Composants",
      title: "Boutons Bulma",
      description: "Les boutons dans Bulma.",
      content: `
        <h5 style="color:#00d1b2;">🔘 Boutons Bulma</h5>
        <p>Syntaxe des boutons Bulma :</p>
        <ul>
          <li><code>.button</code> — Classe de base</li>
          <li><code>.is-primary</code> — Turquoise</li>
          <li><code>.is-link</code> — Bleu</li>
          <li><code>.is-info</code> — Cyan</li>
          <li><code>.is-success</code> — Vert</li>
          <li><code>.is-warning</code> — Jaune</li>
          <li><code>.is-danger</code> — Rouge</li>
          <li><code>.is-large</code> / <code>.is-small</code> — Tailles</li>
          <li><code>.is-outlined</code> — Contour</li>
          <li><code>.is-rounded</code> — Arrondi</li>
        </ul>
      `,
      code_example: `<button class="button is-primary">Primary</button>\n<button class="button is-danger is-outlined">Danger</button>\n<button class="button is-success is-large is-rounded">Success</button>`
    },
    {
      id: "fe_127", type: "code", category: "Bulma - Composants",
      title: "Bouton Bulma",
      description: "Créez un bouton Bulma.",
      instruction: "Créez un <code>&lt;button&gt;</code> avec les classes <code>button is-primary is-large</code> et le texte <strong>Démarrer</strong>.",
      language: "HTML",
      code_template: "",
      tests: [
        { type: "contains", expected: "<button" },
        { type: "contains", expected: "button is-primary is-large" },
        { type: "contains", expected: "Démarrer" }
      ],
      hint: '<button class="button is-primary is-large">Démarrer</button>'
    },
    {
      id: "fe_128", type: "quiz", category: "Bulma - Composants",
      title: "Classe Bulma vs Bootstrap",
      instruction: "Comment s'écrit un bouton primary en Bulma vs Bootstrap ?",
      options: [
        "Bulma: button is-primary / Bootstrap: btn btn-primary",
        "Bulma: btn-primary / Bootstrap: button is-primary",
        "Les deux utilisent la même syntaxe",
        "Bulma: primary-btn / Bootstrap: btn-primary"
      ],
      correct: 0,
      explanation: "Bulma utilise 'is-*' (is-primary), Bootstrap utilise 'btn-*' (btn-primary)."
    },
    // ─── Bulma Card & Box ────────────────────────────────────────
    {
      id: "fe_129", type: "intro", category: "Bulma - Composants",
      title: "Cards et Box Bulma",
      description: "Conteneurs de contenu Bulma.",
      content: `
        <h5 style="color:#00d1b2;">🃏 Cards et Box</h5>
        <p><strong>Box</strong> — Conteneur simple avec ombre :</p>
        <pre style="background:#1a1a2e;padding:0.8rem;border-radius:6px;"><code>&lt;div class="box"&gt;Contenu&lt;/div&gt;</code></pre>
        <p><strong>Card</strong> — Composant structuré :</p>
      `,
      code_example: `<div class="card">\n  <div class="card-content">\n    <p class="title">Titre</p>\n    <p class="subtitle">Sous-titre</p>\n    <div class="content">Texte du contenu...</div>\n  </div>\n</div>`
    },
    {
      id: "fe_130", type: "puzzle", category: "Bulma - Composants",
      title: "Card Bulma",
      description: "Reconstituez une carte Bulma.",
      pieces: ['<div class="card">', '<div class="card-content">', '<p class="title">Mon Projet</p>', '<div class="content">', '<p>Description du projet</p>', '</div>', '</div>', '</div>'],
      hint: "card > card-content > title + content."
    },
    // ─── Bulma Hero ──────────────────────────────────────────────
    {
      id: "fe_131", type: "intro", category: "Bulma - Layout",
      title: "Le Hero Bulma",
      description: "Section héro pleine largeur.",
      content: `
        <h5 style="color:#00d1b2;">🦸 Le composant Hero</h5>
        <p>Le Hero est une bannière pleine largeur :</p>
        <ul>
          <li><code>.hero</code> — Conteneur</li>
          <li><code>.hero-body</code> — Corps du hero</li>
          <li><code>.is-primary</code> / <code>.is-dark</code> — Couleur</li>
          <li><code>.is-medium</code> / <code>.is-large</code> / <code>.is-fullheight</code> — Taille</li>
        </ul>
      `,
      code_example: `<section class="hero is-primary is-medium">\n  <div class="hero-body">\n    <p class="title">Bienvenue</p>\n    <p class="subtitle">Sur mon site</p>\n  </div>\n</section>`
    },
    {
      id: "fe_132", type: "code", category: "Bulma - Layout",
      title: "Hero Bulma",
      description: "Créez un hero Bulma.",
      instruction: "Créez une <code>&lt;section&gt;</code> avec les classes <code>hero is-dark is-large</code> contenant un <code>hero-body</code> avec un <code>title</code> (<strong>Mon App</strong>).",
      language: "HTML",
      code_template: "",
      tests: [
        { type: "contains", expected: "hero is-dark is-large" },
        { type: "contains", expected: 'class="hero-body"' },
        { type: "contains", expected: 'class="title"' },
        { type: "contains", expected: "Mon App" }
      ],
      hint: "section.hero.is-dark.is-large > div.hero-body > p.title"
    },
    // ─── Bulma Navbar ────────────────────────────────────────────
    {
      id: "fe_133", type: "intro", category: "Bulma - Navigation",
      title: "Navbar Bulma",
      description: "Barre de navigation Bulma.",
      content: `
        <h5 style="color:#00d1b2;">🧭 Navbar Bulma</h5>
        <p>Structure de la navbar Bulma :</p>
        <ul>
          <li><code>.navbar</code> — Conteneur</li>
          <li><code>.navbar-brand</code> — Logo + burger</li>
          <li><code>.navbar-menu</code> — Menu (caché sur mobile)</li>
          <li><code>.navbar-start</code> — Liens à gauche</li>
          <li><code>.navbar-end</code> — Liens à droite</li>
          <li><code>.navbar-item</code> — Élément de navigation</li>
        </ul>
      `,
      code_example: `<nav class="navbar is-dark">\n  <div class="navbar-brand">\n    <a class="navbar-item" href="#">MonSite</a>\n  </div>\n  <div class="navbar-menu">\n    <div class="navbar-start">\n      <a class="navbar-item" href="#">Accueil</a>\n    </div>\n  </div>\n</nav>`
    },
    {
      id: "fe_134", type: "quiz", category: "Bulma - Navigation",
      title: "Navbar Bulma structure",
      instruction: "Dans Bulma, où place-t-on les liens de navigation principaux ?",
      options: ["navbar-start", "navbar-brand", "navbar-end", "navbar-links"],
      correct: 0,
      explanation: "navbar-start contient les liens principaux (à gauche). navbar-end pour les liens à droite."
    },
    // ─── Bulma Formulaires ───────────────────────────────────────
    {
      id: "fe_135", type: "intro", category: "Bulma - Formulaires",
      title: "Formulaires Bulma",
      description: "Champs de formulaire Bulma.",
      content: `
        <h5 style="color:#00d1b2;">📝 Formulaires Bulma</h5>
        <p>Bulma utilise des classes spécifiques pour les formulaires :</p>
        <ul>
          <li><code>.field</code> — Conteneur d'un champ</li>
          <li><code>.label</code> — Étiquette</li>
          <li><code>.control</code> — Wrapper de l'input</li>
          <li><code>.input</code> — Champ texte</li>
          <li><code>.textarea</code> — Zone de texte</li>
          <li><code>.select</code> — Liste déroulante</li>
          <li><code>.checkbox</code> — Case à cocher</li>
        </ul>
      `,
      code_example: `<div class="field">\n  <label class="label">Nom</label>\n  <div class="control">\n    <input class="input" type="text" placeholder="Votre nom">\n  </div>\n</div>`
    },
    {
      id: "fe_136", type: "code", category: "Bulma - Formulaires",
      title: "Champ Bulma",
      description: "Créez un champ de formulaire Bulma.",
      instruction: "Créez un <code>div.field</code> contenant un <code>label.label</code> (<strong>Email</strong>) et un <code>div.control</code> avec un <code>input.input</code> de type <strong>email</strong>.",
      language: "HTML",
      code_template: "",
      tests: [
        { type: "contains", expected: 'class="field"' },
        { type: "contains", expected: 'class="label"' },
        { type: "contains", expected: "Email" },
        { type: "contains", expected: 'class="control"' },
        { type: "contains", expected: 'class="input"' },
        { type: "contains", expected: 'type="email"' }
      ],
      hint: "field > label + control > input"
    },
    // ─── Bulma Notification & Message ────────────────────────────
    {
      id: "fe_137", type: "quiz", category: "Bulma - Notifications",
      title: "Notification Bulma",
      instruction: "Quelle classe Bulma crée une notification colorée ?",
      options: ["notification", "alert", "message", "toast"],
      correct: 0,
      explanation: 'Bulma utilise .notification (ex: <div class="notification is-success">).'
    },
    {
      id: "fe_138", type: "code", category: "Bulma - Notifications",
      title: "Notification Bulma",
      description: "Créez une notification.",
      instruction: "Créez un <code>div</code> avec les classes <code>notification is-warning</code> contenant le texte <strong>Attention : vérifiez vos données.</strong>",
      language: "HTML",
      code_template: "",
      tests: [
        { type: "contains", expected: "notification is-warning" },
        { type: "contains", expected: "Attention" }
      ],
      hint: '<div class="notification is-warning">texte</div>'
    },
    // ─── Comparaison Bootstrap vs Bulma ──────────────────────────
    {
      id: "fe_139", type: "intro", category: "Bootstrap vs Bulma",
      title: "Bootstrap vs Bulma : Comparaison",
      description: "Quand utiliser l'un ou l'autre ?",
      content: `
        <h5 style="color:#7952b3;">⚔️ Bootstrap vs Bulma</h5>
        <table style="width:100%;border-collapse:collapse;margin:1rem 0;">
          <tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
            <th style="padding:0.5rem;text-align:left;">Critère</th>
            <th style="padding:0.5rem;color:#7952b3;">Bootstrap</th>
            <th style="padding:0.5rem;color:#00d1b2;">Bulma</th>
          </tr>
          <tr style="border-bottom:1px solid rgba(255,255,255,0.05);"><td style="padding:0.5rem;">JavaScript</td><td style="padding:0.5rem;">Inclus</td><td style="padding:0.5rem;">Aucun</td></tr>
          <tr style="border-bottom:1px solid rgba(255,255,255,0.05);"><td style="padding:0.5rem;">Grille</td><td style="padding:0.5rem;">12 colonnes</td><td style="padding:0.5rem;">Flexbox natif</td></tr>
          <tr style="border-bottom:1px solid rgba(255,255,255,0.05);"><td style="padding:0.5rem;">Syntaxe</td><td style="padding:0.5rem;">btn-primary</td><td style="padding:0.5rem;">is-primary</td></tr>
          <tr style="border-bottom:1px solid rgba(255,255,255,0.05);"><td style="padding:0.5rem;">Taille</td><td style="padding:0.5rem;">~25KB CSS</td><td style="padding:0.5rem;">~20KB CSS</td></tr>
          <tr><td style="padding:0.5rem;">Communauté</td><td style="padding:0.5rem;">Très large</td><td style="padding:0.5rem;">Croissante</td></tr>
        </table>
        <p><strong>Conseil :</strong> Bootstrap pour des projets complets avec JS intégré, Bulma pour du CSS pur avec votre propre JS.</p>
      `
    },
    {
      id: "fe_140", type: "quiz", category: "Bootstrap vs Bulma",
      title: "Choix du framework",
      instruction: "Vous avez besoin d'un modal et d'un carousel avec JS intégré. Quel framework choisir ?",
      options: ["Bootstrap", "Bulma", "Les deux conviennent", "Aucun des deux"],
      correct: 0,
      explanation: "Bootstrap inclut du JS pour les composants interactifs. Bulma est CSS-only."
    },
    // ─── Exercices mixtes Bootstrap/Bulma ────────────────────────
    {
      id: "fe_141", type: "puzzle", category: "Bootstrap - Composants avancés",
      title: "Modal Bootstrap",
      description: "Reconstituez la structure d'un modal Bootstrap.",
      pieces: ['<div class="modal">', '<div class="modal-dialog">', '<div class="modal-content">', '<div class="modal-header">', '<h5 class="modal-title">Titre</h5>', '</div>', '<div class="modal-body">Contenu</div>', '</div>', '</div>', '</div>'],
      hint: "modal > modal-dialog > modal-content > modal-header + modal-body."
    },
    {
      id: "fe_142", type: "code", category: "Bootstrap - Composants avancés",
      title: "Badge Bootstrap",
      description: "Créez des badges Bootstrap.",
      instruction: "Créez un <code>&lt;span&gt;</code> avec les classes <code>badge bg-primary</code> contenant <strong>Nouveau</strong>.",
      language: "HTML",
      code_template: "",
      tests: [
        { type: "contains", expected: "<span" },
        { type: "contains", expected: "badge bg-primary" },
        { type: "contains", expected: "Nouveau" }
      ],
      hint: '<span class="badge bg-primary">Nouveau</span>'
    },
    {
      id: "fe_143", type: "quiz", category: "Bulma - Composants avancés",
      title: "Bulma Tile",
      instruction: "Quel composant Bulma permet de créer des layouts en grille 2D sans CSS Grid ?",
      options: ["tile", "grid", "layout", "panel"],
      correct: 0,
      explanation: "Le composant .tile de Bulma permet des layouts 2D basés sur Flexbox."
    },
    {
      id: "fe_144", type: "code", category: "Bulma - Composants avancés",
      title: "Tags Bulma",
      description: "Créez des tags Bulma.",
      instruction: "Créez un <code>div.tags</code> contenant 3 <code>span.tag</code> : <strong>HTML</strong> (is-info), <strong>CSS</strong> (is-success), <strong>JS</strong> (is-warning).",
      language: "HTML",
      code_template: "",
      tests: [
        { type: "contains", expected: 'class="tags"' },
        { type: "contains", expected: "tag is-info" },
        { type: "contains", expected: "HTML" },
        { type: "contains", expected: "tag is-success" },
        { type: "contains", expected: "CSS" },
        { type: "contains", expected: "tag is-warning" },
        { type: "contains", expected: "JS" }
      ],
      hint: 'div.tags > span.tag.is-info + span.tag.is-success + span.tag.is-warning'
    },
    {
      id: "fe_145", type: "puzzle", category: "Bootstrap - Composants avancés",
      title: "Accordion Bootstrap",
      description: "Reconstituez un élément d'accordion.",
      pieces: ['<div class="accordion-item">', '<h2 class="accordion-header">', '<button class="accordion-button">Section 1</button>', '</h2>', '<div class="accordion-collapse">', '<div class="accordion-body">Contenu</div>', '</div>', '</div>'],
      hint: "accordion-item > accordion-header > button + accordion-collapse > accordion-body."
    },
    {
      id: "fe_146", type: "code", category: "Bulma - Layout avancé",
      title: "Footer Bulma",
      description: "Créez un footer Bulma.",
      instruction: "Créez un <code>&lt;footer&gt;</code> avec la classe <code>footer</code> contenant un <code>div.content.has-text-centered</code> avec un <code>&lt;p&gt;</code> : <strong>© 2024 MonSite</strong>.",
      language: "HTML",
      code_template: "",
      tests: [
        { type: "contains", expected: '<footer class="footer"' },
        { type: "contains", expected: "content has-text-centered" },
        { type: "contains", expected: "© 2024 MonSite" }
      ],
      hint: 'footer.footer > div.content.has-text-centered > p'
    },
    {
      id: "fe_147", type: "quiz", category: "Bootstrap - Responsive",
      title: "Responsive Bootstrap",
      instruction: "Quelle classe cache un élément uniquement sur mobile (<576px) ?",
      options: ["d-none d-sm-block", "d-sm-none", "hidden-mobile", "d-block d-sm-none"],
      correct: 0,
      explanation: "d-none cache partout, d-sm-block le réaffiche à partir de sm (576px)."
    },
    {
      id: "fe_148", type: "code", category: "Bootstrap - Composants avancés",
      title: "Liste groupée Bootstrap",
      description: "Créez une list-group.",
      instruction: "Créez un <code>ul.list-group</code> avec 3 <code>li.list-group-item</code> : <strong>Élément 1</strong>, <strong>Élément 2</strong>, <strong>Élément 3</strong>.",
      language: "HTML",
      code_template: "",
      tests: [
        { type: "contains", expected: 'class="list-group"' },
        { type: "contains", expected: 'class="list-group-item"' },
        { type: "contains", expected: "Élément 1" },
        { type: "contains", expected: "Élément 2" },
        { type: "contains", expected: "Élément 3" }
      ],
      hint: "ul.list-group > li.list-group-item × 3"
    },
    {
      id: "fe_149", type: "quiz", category: "Bulma - Composants avancés",
      title: "Bulma Modifiers",
      instruction: "Comment Bulma nomme-t-elle ses classes de modification (couleur, taille) ?",
      options: ["Préfixe is- (ex: is-primary, is-large)", "Préfixe btn- (ex: btn-primary)", "Suffixe -primary (ex: button-primary)", "Préfixe has- (ex: has-primary)"],
      correct: 0,
      explanation: "Bulma utilise is-* pour les modifiers (is-primary, is-large, is-rounded...)."
    },
    {
      id: "fe_150", type: "quiz", category: "Bootstrap vs Bulma",
      title: "Récap Frameworks CSS",
      instruction: "Quel avantage principal offrent les frameworks CSS comme Bootstrap et Bulma ?",
      options: [
        "Développement rapide avec des composants prêts à l'emploi",
        "Meilleure performance que le CSS natif",
        "Ils remplacent complètement le besoin de CSS personnalisé",
        "Ils sont obligatoires pour le développement web"
      ],
      correct: 0,
      explanation: "Les frameworks accélèrent le développement avec des composants et utilitaires prédéfinis."
    }
  ];

addExercises("frontend", exercises);
