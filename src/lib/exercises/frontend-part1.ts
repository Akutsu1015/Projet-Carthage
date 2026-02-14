import { addExercises } from ".";
import type { Exercise } from "@/app/exercises/[module]/exercise-client";

// @ts-nocheck — Auto-converted from exercises-frontend-part1.js
const exercises: Exercise[] = [
    // ─── INTRO: Qu'est-ce que le HTML ? ──────────────────────────
    {
      id: "fe_1", type: "intro", category: "HTML - Introduction",
      title: "Bienvenue dans le Front-End !",
      description: "Découvrez le monde du développement web front-end.",
      content: `
        <h5 style="color:#00d4ff;">🌐 Le Front-End, c'est quoi ?</h5>
        <p>Le <strong>front-end</strong> (ou côté client) est tout ce que l'utilisateur voit et avec quoi il interagit dans un navigateur web.</p>
        <p>Il repose sur <strong>3 piliers</strong> :</p>
        <ul>
          <li><strong>HTML</strong> — La structure (le squelette)</li>
          <li><strong>CSS</strong> — Le style (l'apparence)</li>
          <li><strong>JavaScript</strong> — L'interactivité (le comportement)</li>
        </ul>
        <p>Dans ce module de <strong>250 niveaux</strong>, vous allez maîtriser ces 3 technologies + Bootstrap, Bulma et SCSS !</p>
        <div style="background:rgba(0,212,255,0.1);border-radius:8px;padding:1rem;margin-top:1rem;">
          <strong>🎮 Votre parcours :</strong><br>
          Niveaux 1-50 : HTML • Niveaux 51-100 : CSS • Niveaux 101-150 : Bootstrap & Bulma<br>
          Niveaux 151-200 : SCSS & CSS Avancé • Niveaux 201-250 : JS DOM & Projets
        </div>
      `
    },
    {
      id: "fe_2", type: "intro", category: "HTML - Introduction",
      title: "Qu'est-ce que le HTML ?",
      description: "HTML = HyperText Markup Language",
      content: `
        <h5 style="color:#e34c26;">📄 HTML — Le langage de structure du web</h5>
        <p><strong>HTML</strong> (HyperText Markup Language) est le langage qui définit la <em>structure</em> d'une page web.</p>
        <p>Il utilise des <strong>balises</strong> (tags) pour organiser le contenu :</p>
        <ul>
          <li><code>&lt;h1&gt;</code> — Titre principal</li>
          <li><code>&lt;p&gt;</code> — Paragraphe</li>
          <li><code>&lt;img&gt;</code> — Image</li>
          <li><code>&lt;a&gt;</code> — Lien</li>
        </ul>
        <p>Chaque balise a une <strong>ouverture</strong> et une <strong>fermeture</strong> :</p>
      `,
      code_example: `<h1>Mon titre</h1>\n<p>Mon paragraphe</p>`
    },
    // ─── QUIZ: Structure de base ─────────────────────────────────
    {
      id: "fe_3", type: "quiz", category: "HTML - Introduction",
      title: "Que signifie HTML ?",
      description: "Testez vos connaissances sur la signification de HTML.",
      instruction: "Quelle est la signification correcte de l'acronyme HTML ?",
      options: [
        "Hyper Text Markup Language",
        "High Tech Modern Language",
        "Hyper Transfer Markup Language",
        "Home Tool Markup Language"
      ],
      correct: 0,
      explanation: "HTML signifie HyperText Markup Language — le langage de balisage hypertexte."
    },
    {
      id: "fe_4", type: "quiz", category: "HTML - Introduction",
      title: "Rôle du HTML",
      description: "Comprendre le rôle du HTML dans le web.",
      instruction: "Quel est le rôle principal du HTML ?",
      options: [
        "Définir la structure et le contenu d'une page web",
        "Styliser les éléments visuels",
        "Gérer les bases de données",
        "Créer des animations"
      ],
      correct: 0,
      explanation: "HTML définit la structure et le contenu. Le CSS gère le style et JS l'interactivité."
    },
    // ─── PUZZLE: Premier document HTML ───────────────────────────
    {
      id: "fe_5", type: "puzzle", category: "HTML - Structure de base",
      title: "Structure HTML de base",
      description: "Reconstituez la structure minimale d'un document HTML.",
      instruction: "Remettez les blocs dans l'ordre pour former un document HTML valide.",
      pieces: [
        "<!DOCTYPE html>",
        "<html>",
        "<head>",
        "<title>Ma page</title>",
        "</head>",
        "<body>",
        "<h1>Bonjour</h1>",
        "</body>",
        "</html>"
      ],
      hint: "Un document HTML commence par <!DOCTYPE html> et se termine par </html>."
    },
    // ─── CODE: Premier HTML ──────────────────────────────────────
    {
      id: "fe_6", type: "code", category: "HTML - Structure de base",
      title: "Votre premier HTML",
      description: "Écrivez un titre h1 contenant 'Bonjour le monde'.",
      instruction: "Créez une balise <code>&lt;h1&gt;</code> qui contient le texte <strong>Bonjour le monde</strong>.",
      language: "HTML",
      code_template: "<h1></h1>",
      tests: [
        { type: "contains", expected: "<h1>" },
        { type: "contains", expected: "Bonjour le monde" },
        { type: "contains", expected: "</h1>" }
      ],
      hint: "Écrivez le texte entre les balises ouvrante et fermante.",
      help_steps: ["La balise h1 s'écrit : <h1>texte</h1>", "Remplacez 'texte' par 'Bonjour le monde'"]
    },
    {
      id: "fe_7", type: "intro", category: "HTML - Structure de base",
      title: "Les balises HTML",
      description: "Comprendre la syntaxe des balises.",
      content: `
        <h5 style="color:#e34c26;">🏷️ Les balises HTML</h5>
        <p>Une balise HTML a cette structure :</p>
        <ul>
          <li><strong>Balise ouvrante</strong> : <code>&lt;nom&gt;</code></li>
          <li><strong>Contenu</strong> : texte ou autres balises</li>
          <li><strong>Balise fermante</strong> : <code>&lt;/nom&gt;</code></li>
        </ul>
        <p>Certaines balises sont <strong>auto-fermantes</strong> (pas de contenu) :</p>
        <ul>
          <li><code>&lt;br&gt;</code> — Retour à la ligne</li>
          <li><code>&lt;hr&gt;</code> — Ligne horizontale</li>
          <li><code>&lt;img src="..." alt="..."&gt;</code> — Image</li>
        </ul>
      `,
      code_example: `<p>Ceci est un <strong>paragraphe</strong></p>\n<br>\n<img src="photo.jpg" alt="Une photo">`
    },
    {
      id: "fe_8", type: "quiz", category: "HTML - Structure de base",
      title: "Balise fermante",
      description: "Identifier la bonne syntaxe de fermeture.",
      instruction: "Quelle est la balise fermante correcte pour <code>&lt;p&gt;</code> ?",
      options: ["</p>", "<p/>", "<//p>", "p>"],
      correct: 0,
      explanation: "La balise fermante utilise un slash avant le nom : </p>"
    },
    {
      id: "fe_9", type: "quiz", category: "HTML - Structure de base",
      title: "Balise auto-fermante",
      description: "Reconnaître les balises auto-fermantes.",
      instruction: "Laquelle de ces balises est auto-fermante (pas de balise fermante) ?",
      options: ["<br>", "<p>", "<div>", "<span>"],
      correct: 0,
      explanation: "<br> est auto-fermante car elle n'a pas de contenu — c'est juste un retour à la ligne."
    },
    {
      id: "fe_10", type: "code", category: "HTML - Structure de base",
      title: "Paragraphe HTML",
      description: "Créez un paragraphe avec du texte.",
      instruction: "Écrivez un paragraphe <code>&lt;p&gt;</code> contenant : <strong>Le HTML est facile à apprendre.</strong>",
      language: "HTML",
      code_template: "",
      tests: [
        { type: "contains", expected: "<p>" },
        { type: "contains", expected: "Le HTML est facile à apprendre." },
        { type: "contains", expected: "</p>" }
      ],
      hint: "Utilisez <p>votre texte</p>"
    },
    // ─── Titres h1-h6 ───────────────────────────────────────────
    {
      id: "fe_11", type: "intro", category: "HTML - Titres & Texte",
      title: "Les titres h1 à h6",
      description: "Les 6 niveaux de titres en HTML.",
      content: `
        <h5 style="color:#e34c26;">📝 Les niveaux de titres</h5>
        <p>HTML propose <strong>6 niveaux de titres</strong>, de h1 (le plus important) à h6 (le moins important) :</p>
        <div style="background:#1a1a2e;padding:1rem;border-radius:8px;margin:1rem 0;">
          <h1 style="color:#fff;margin:0;">h1 - Titre principal</h1>
          <h2 style="color:#ddd;margin:0;">h2 - Sous-titre</h2>
          <h3 style="color:#bbb;margin:0;">h3 - Section</h3>
          <h4 style="color:#999;margin:0;">h4 - Sous-section</h4>
          <h5 style="color:#777;margin:0;">h5 - Détail</h5>
          <h6 style="color:#555;margin:0;">h6 - Petit détail</h6>
        </div>
        <p><strong>Règle :</strong> Utilisez un seul <code>&lt;h1&gt;</code> par page, puis des h2, h3, etc. pour la hiérarchie.</p>
      `
    },
    {
      id: "fe_12", type: "quiz", category: "HTML - Titres & Texte",
      title: "Le titre le plus important",
      instruction: "Quelle balise représente le titre le plus important ?",
      options: ["<h1>", "<h6>", "<title>", "<header>"],
      correct: 0,
      explanation: "<h1> est le titre le plus important. <h6> est le moins important."
    },
    {
      id: "fe_13", type: "puzzle", category: "HTML - Titres & Texte",
      title: "Hiérarchie des titres",
      description: "Ordonnez les titres du plus important au moins important.",
      instruction: "Placez les balises dans l'ordre hiérarchique correct.",
      pieces: ["<h1>Titre principal</h1>", "<h2>Sous-titre</h2>", "<h3>Section</h3>", "<p>Contenu du texte</p>"],
      hint: "h1 est le plus important, puis h2, h3, et enfin le paragraphe."
    },
    {
      id: "fe_14", type: "code", category: "HTML - Titres & Texte",
      title: "Créer des titres",
      description: "Écrivez un h1 et un h2.",
      instruction: "Créez un <code>&lt;h1&gt;</code> avec <strong>Mon Site</strong> et un <code>&lt;h2&gt;</code> avec <strong>Bienvenue</strong>.",
      language: "HTML",
      code_template: "",
      tests: [
        { type: "contains", expected: "<h1>Mon Site</h1>" },
        { type: "contains", expected: "<h2>Bienvenue</h2>" }
      ],
      hint: "Écrivez les deux balises l'une après l'autre."
    },
    // ─── Formatage de texte ──────────────────────────────────────
    {
      id: "fe_15", type: "intro", category: "HTML - Titres & Texte",
      title: "Formatage du texte",
      description: "Gras, italique, souligné et plus.",
      content: `
        <h5 style="color:#e34c26;">✏️ Formater le texte en HTML</h5>
        <p>HTML offre plusieurs balises pour formater le texte :</p>
        <ul>
          <li><code>&lt;strong&gt;</code> ou <code>&lt;b&gt;</code> — <strong>Gras</strong></li>
          <li><code>&lt;em&gt;</code> ou <code>&lt;i&gt;</code> — <em>Italique</em></li>
          <li><code>&lt;u&gt;</code> — <u>Souligné</u></li>
          <li><code>&lt;mark&gt;</code> — <mark>Surligné</mark></li>
          <li><code>&lt;del&gt;</code> — <del>Barré</del></li>
          <li><code>&lt;small&gt;</code> — <small>Petit texte</small></li>
          <li><code>&lt;code&gt;</code> — <code>Code inline</code></li>
        </ul>
        <p><strong>Conseil :</strong> Préférez <code>&lt;strong&gt;</code> à <code>&lt;b&gt;</code> car il a une valeur sémantique (importance).</p>
      `
    },
    {
      id: "fe_16", type: "quiz", category: "HTML - Titres & Texte",
      title: "Texte en gras",
      instruction: "Quelle balise rend le texte en <strong>gras</strong> avec une valeur sémantique ?",
      options: ["<strong>", "<b>", "<bold>", "<fat>"],
      correct: 0,
      explanation: "<strong> indique un texte important (gras + sémantique). <b> est juste visuel."
    },
    {
      id: "fe_17", type: "code", category: "HTML - Titres & Texte",
      title: "Texte formaté",
      description: "Combinez gras et italique.",
      instruction: "Écrivez un paragraphe contenant : <strong>HTML</strong> est <em>génial</em> (HTML en gras, génial en italique).",
      language: "HTML",
      code_template: "<p></p>",
      tests: [
        { type: "contains", expected: "<strong>HTML</strong>" },
        { type: "contains", expected: "<em>génial</em>" }
      ],
      hint: "Utilisez <strong> pour le gras et <em> pour l'italique."
    },
    {
      id: "fe_18", type: "puzzle", category: "HTML - Titres & Texte",
      title: "Paragraphe formaté",
      description: "Reconstituez un paragraphe avec du texte en gras.",
      pieces: ["<p>", "Le ", "<strong>", "HTML", "</strong>", " est super", "</p>"],
      hint: "Le texte 'HTML' doit être entre les balises <strong>."
    },
    // ─── Listes ──────────────────────────────────────────────────
    {
      id: "fe_19", type: "intro", category: "HTML - Listes",
      title: "Les listes HTML",
      description: "Listes ordonnées et non ordonnées.",
      content: `
        <h5 style="color:#e34c26;">📋 Les listes en HTML</h5>
        <p>Il existe 3 types de listes :</p>
        <h6>Liste non ordonnée (<code>&lt;ul&gt;</code>) :</h6>
        <ul><li>Élément 1</li><li>Élément 2</li></ul>
        <h6>Liste ordonnée (<code>&lt;ol&gt;</code>) :</h6>
        <ol><li>Premier</li><li>Deuxième</li></ol>
        <h6>Liste de définitions (<code>&lt;dl&gt;</code>) :</h6>
        <p>Utilisée pour des termes et leurs définitions.</p>
      `,
      code_example: `<ul>\n  <li>Pomme</li>\n  <li>Banane</li>\n</ul>\n\n<ol>\n  <li>Étape 1</li>\n  <li>Étape 2</li>\n</ol>`
    },
    {
      id: "fe_20", type: "quiz", category: "HTML - Listes",
      title: "Liste à puces",
      instruction: "Quelle balise crée une liste à puces (non ordonnée) ?",
      options: ["<ul>", "<ol>", "<li>", "<list>"],
      correct: 0,
      explanation: "<ul> = unordered list (liste non ordonnée). <ol> = ordered list (liste ordonnée)."
    },
    {
      id: "fe_21", type: "puzzle", category: "HTML - Listes",
      title: "Liste non ordonnée",
      description: "Reconstituez une liste à puces.",
      pieces: ["<ul>", "<li>HTML</li>", "<li>CSS</li>", "<li>JavaScript</li>", "</ul>"],
      hint: "Les éléments <li> vont à l'intérieur de <ul>."
    },
    {
      id: "fe_22", type: "code", category: "HTML - Listes",
      title: "Créer une liste ordonnée",
      description: "Écrivez une liste numérotée.",
      instruction: "Créez une liste ordonnée <code>&lt;ol&gt;</code> avec 3 éléments : <strong>Apprendre HTML</strong>, <strong>Apprendre CSS</strong>, <strong>Apprendre JS</strong>.",
      language: "HTML",
      code_template: "",
      tests: [
        { type: "contains", expected: "<ol>" },
        { type: "contains", expected: "<li>Apprendre HTML</li>" },
        { type: "contains", expected: "<li>Apprendre CSS</li>" },
        { type: "contains", expected: "<li>Apprendre JS</li>" },
        { type: "contains", expected: "</ol>" }
      ],
      hint: "Utilisez <ol> avec des <li> à l'intérieur."
    },
    // ─── Liens ───────────────────────────────────────────────────
    {
      id: "fe_23", type: "intro", category: "HTML - Liens & Images",
      title: "Les liens hypertextes",
      description: "Créer des liens avec la balise <a>.",
      content: `
        <h5 style="color:#e34c26;">🔗 Les liens en HTML</h5>
        <p>La balise <code>&lt;a&gt;</code> (anchor) crée un lien hypertexte :</p>
        <ul>
          <li><code>href</code> — L'URL de destination</li>
          <li><code>target="_blank"</code> — Ouvrir dans un nouvel onglet</li>
          <li><code>title</code> — Texte au survol</li>
        </ul>
        <p>Types de liens :</p>
        <ul>
          <li><strong>Externe</strong> : <code>href="https://google.com"</code></li>
          <li><strong>Interne</strong> : <code>href="page2.html"</code></li>
          <li><strong>Ancre</strong> : <code>href="#section"</code></li>
          <li><strong>Email</strong> : <code>href="mailto:test@mail.com"</code></li>
        </ul>
      `,
      code_example: `<a href="https://google.com" target="_blank">Visiter Google</a>`
    },
    {
      id: "fe_24", type: "quiz", category: "HTML - Liens & Images",
      title: "Attribut href",
      instruction: "Quel attribut de la balise <code>&lt;a&gt;</code> définit l'URL de destination ?",
      options: ["href", "src", "link", "url"],
      correct: 0,
      explanation: "href (Hypertext REFerence) définit l'URL de destination d'un lien."
    },
    {
      id: "fe_25", type: "code", category: "HTML - Liens & Images",
      title: "Créer un lien",
      description: "Écrivez un lien vers Google.",
      instruction: "Créez un lien vers <code>https://google.com</code> avec le texte <strong>Aller sur Google</strong>.",
      language: "HTML",
      code_template: "",
      tests: [
        { type: "contains", expected: '<a href="https://google.com"' },
        { type: "contains", expected: "Aller sur Google" },
        { type: "contains", expected: "</a>" }
      ],
      hint: 'Syntaxe : <a href="url">texte</a>'
    },
    {
      id: "fe_26", type: "puzzle", category: "HTML - Liens & Images",
      title: "Lien hypertexte",
      description: "Reconstituez un lien HTML.",
      pieces: ['<a href="https://example.com"', ' target="_blank">', 'Cliquez ici', '</a>'],
      hint: "Le lien commence par <a, puis les attributs, le texte, et </a>."
    },
    // ─── Images ──────────────────────────────────────────────────
    {
      id: "fe_27", type: "intro", category: "HTML - Liens & Images",
      title: "Les images en HTML",
      description: "Insérer des images avec <img>.",
      content: `
        <h5 style="color:#e34c26;">🖼️ Les images en HTML</h5>
        <p>La balise <code>&lt;img&gt;</code> est <strong>auto-fermante</strong> et nécessite 2 attributs :</p>
        <ul>
          <li><code>src</code> — Le chemin de l'image (obligatoire)</li>
          <li><code>alt</code> — Le texte alternatif (obligatoire pour l'accessibilité)</li>
        </ul>
        <p>Attributs optionnels :</p>
        <ul>
          <li><code>width</code> / <code>height</code> — Dimensions</li>
          <li><code>loading="lazy"</code> — Chargement différé</li>
        </ul>
      `,
      code_example: `<img src="chat.jpg" alt="Un chat mignon" width="300">`
    },
    {
      id: "fe_28", type: "quiz", category: "HTML - Liens & Images",
      title: "Attribut obligatoire d'image",
      instruction: "Quel attribut est obligatoire pour l'accessibilité d'une image ?",
      options: ["alt", "title", "width", "class"],
      correct: 0,
      explanation: "L'attribut alt fournit un texte alternatif pour les lecteurs d'écran et si l'image ne charge pas."
    },
    {
      id: "fe_29", type: "code", category: "HTML - Liens & Images",
      title: "Insérer une image",
      description: "Créez une balise image.",
      instruction: "Insérez une image avec <code>src=\"logo.png\"</code> et <code>alt=\"Logo du site\"</code>.",
      language: "HTML",
      code_template: "",
      tests: [
        { type: "contains", expected: '<img' },
        { type: "contains", expected: 'src="logo.png"' },
        { type: "contains", expected: 'alt="Logo du site"' }
      ],
      hint: 'Syntaxe : <img src="chemin" alt="description">'
    },
    {
      id: "fe_30", type: "quiz", category: "HTML - Liens & Images",
      title: "Image cliquable",
      instruction: "Comment rendre une image cliquable (lien) ?",
      options: [
        "Entourer <img> avec <a>",
        "Ajouter href à <img>",
        "Utiliser <link> autour de <img>",
        "Ajouter onclick à <img>"
      ],
      correct: 0,
      explanation: "On entoure l'image avec un lien : <a href='url'><img src='...' alt='...'></a>"
    },
    // ─── Tableaux ────────────────────────────────────────────────
    {
      id: "fe_31", type: "intro", category: "HTML - Tableaux",
      title: "Les tableaux HTML",
      description: "Créer des tableaux avec <table>.",
      content: `
        <h5 style="color:#e34c26;">📊 Les tableaux en HTML</h5>
        <p>Structure d'un tableau :</p>
        <ul>
          <li><code>&lt;table&gt;</code> — Le conteneur du tableau</li>
          <li><code>&lt;thead&gt;</code> — En-tête du tableau</li>
          <li><code>&lt;tbody&gt;</code> — Corps du tableau</li>
          <li><code>&lt;tr&gt;</code> — Ligne (table row)</li>
          <li><code>&lt;th&gt;</code> — Cellule d'en-tête (table header)</li>
          <li><code>&lt;td&gt;</code> — Cellule de données (table data)</li>
        </ul>
      `,
      code_example: `<table>\n  <thead>\n    <tr>\n      <th>Nom</th>\n      <th>Age</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Alice</td>\n      <td>25</td>\n    </tr>\n  </tbody>\n</table>`
    },
    {
      id: "fe_32", type: "quiz", category: "HTML - Tableaux",
      title: "Cellule d'en-tête",
      instruction: "Quelle balise représente une cellule d'en-tête dans un tableau ?",
      options: ["<th>", "<td>", "<thead>", "<header>"],
      correct: 0,
      explanation: "<th> = table header (cellule d'en-tête, texte en gras et centré par défaut)."
    },
    {
      id: "fe_33", type: "puzzle", category: "HTML - Tableaux",
      title: "Tableau simple",
      description: "Reconstituez un tableau HTML.",
      pieces: ["<table>", "<tr>", "<th>Nom</th>", "<th>Age</th>", "</tr>", "<tr>", "<td>Bob</td>", "<td>30</td>", "</tr>", "</table>"],
      hint: "Un tableau commence par <table>, puis des lignes <tr> avec des cellules."
    },
    {
      id: "fe_34", type: "code", category: "HTML - Tableaux",
      title: "Créer un tableau",
      description: "Écrivez un tableau simple.",
      instruction: "Créez un tableau avec une ligne d'en-tête (<code>Produit</code>, <code>Prix</code>) et une ligne de données (<code>Pomme</code>, <code>2€</code>).",
      language: "HTML",
      code_template: "<table>\n\n</table>",
      tests: [
        { type: "contains", expected: "<th>Produit</th>" },
        { type: "contains", expected: "<th>Prix</th>" },
        { type: "contains", expected: "<td>Pomme</td>" },
        { type: "contains", expected: "<td>2€</td>" }
      ],
      hint: "Utilisez <tr> pour les lignes, <th> pour les en-têtes, <td> pour les données."
    },
    // ─── Formulaires ─────────────────────────────────────────────
    {
      id: "fe_35", type: "intro", category: "HTML - Formulaires",
      title: "Les formulaires HTML",
      description: "Collecter des données utilisateur.",
      content: `
        <h5 style="color:#e34c26;">📝 Les formulaires</h5>
        <p>Les formulaires permettent de collecter des données :</p>
        <ul>
          <li><code>&lt;form&gt;</code> — Conteneur du formulaire</li>
          <li><code>&lt;input&gt;</code> — Champ de saisie</li>
          <li><code>&lt;textarea&gt;</code> — Zone de texte multi-lignes</li>
          <li><code>&lt;select&gt;</code> — Liste déroulante</li>
          <li><code>&lt;button&gt;</code> — Bouton</li>
          <li><code>&lt;label&gt;</code> — Étiquette d'un champ</li>
        </ul>
        <p>Types d'input courants : <code>text</code>, <code>email</code>, <code>password</code>, <code>number</code>, <code>checkbox</code>, <code>radio</code>, <code>submit</code>.</p>
      `,
      code_example: `<form>\n  <label for="nom">Nom :</label>\n  <input type="text" id="nom" name="nom">\n  <button type="submit">Envoyer</button>\n</form>`
    },
    {
      id: "fe_36", type: "quiz", category: "HTML - Formulaires",
      title: "Type d'input pour email",
      instruction: "Quel type d'input est spécifique aux adresses email ?",
      options: ['type="email"', 'type="mail"', 'type="address"', 'type="text"'],
      correct: 0,
      explanation: 'type="email" active la validation automatique du format email par le navigateur.'
    },
    {
      id: "fe_37", type: "puzzle", category: "HTML - Formulaires",
      title: "Formulaire de connexion",
      description: "Reconstituez un formulaire de connexion.",
      pieces: [
        "<form>",
        '<label>Email :</label>',
        '<input type="email" name="email">',
        '<label>Mot de passe :</label>',
        '<input type="password" name="mdp">',
        '<button type="submit">Connexion</button>',
        "</form>"
      ],
      hint: "Un formulaire contient des labels, des inputs et un bouton submit."
    },
    {
      id: "fe_38", type: "code", category: "HTML - Formulaires",
      title: "Champ de saisie",
      description: "Créez un input text avec un label.",
      instruction: "Créez un <code>&lt;label&gt;</code> avec le texte <strong>Prénom :</strong> et un <code>&lt;input&gt;</code> de type <strong>text</strong> avec <code>name=\"prenom\"</code>.",
      language: "HTML",
      code_template: "",
      tests: [
        { type: "contains", expected: "<label>" },
        { type: "contains", expected: "Prénom :" },
        { type: "contains", expected: 'type="text"' },
        { type: "contains", expected: 'name="prenom"' }
      ],
      hint: "Utilisez <label>texte</label> puis <input type=\"text\" name=\"prenom\">."
    },
    {
      id: "fe_39", type: "quiz", category: "HTML - Formulaires",
      title: "Bouton submit",
      instruction: "Quel attribut de <code>&lt;button&gt;</code> permet d'envoyer le formulaire ?",
      options: ['type="submit"', 'action="submit"', 'role="submit"', 'method="submit"'],
      correct: 0,
      explanation: 'type="submit" sur un bouton déclenche l\'envoi du formulaire.'
    },
    {
      id: "fe_40", type: "code", category: "HTML - Formulaires",
      title: "Liste déroulante",
      description: "Créez un select avec des options.",
      instruction: "Créez un <code>&lt;select&gt;</code> avec <code>name=\"pays\"</code> et 3 options : <strong>France</strong>, <strong>Belgique</strong>, <strong>Suisse</strong>.",
      language: "HTML",
      code_template: "",
      tests: [
        { type: "contains", expected: '<select' },
        { type: "contains", expected: 'name="pays"' },
        { type: "contains", expected: "<option" },
        { type: "contains", expected: "France</option>" },
        { type: "contains", expected: "Belgique</option>" },
        { type: "contains", expected: "Suisse</option>" }
      ],
      hint: "Utilisez <select> avec des <option> à l'intérieur."
    },
    // ─── Sémantique HTML5 ────────────────────────────────────────
    {
      id: "fe_41", type: "intro", category: "HTML - Sémantique HTML5",
      title: "HTML5 Sémantique",
      description: "Les balises sémantiques de HTML5.",
      content: `
        <h5 style="color:#e34c26;">🏗️ HTML5 Sémantique</h5>
        <p>HTML5 a introduit des balises <strong>sémantiques</strong> qui donnent du sens à la structure :</p>
        <ul>
          <li><code>&lt;header&gt;</code> — En-tête de page/section</li>
          <li><code>&lt;nav&gt;</code> — Navigation</li>
          <li><code>&lt;main&gt;</code> — Contenu principal</li>
          <li><code>&lt;article&gt;</code> — Article indépendant</li>
          <li><code>&lt;section&gt;</code> — Section thématique</li>
          <li><code>&lt;aside&gt;</code> — Contenu latéral</li>
          <li><code>&lt;footer&gt;</code> — Pied de page</li>
          <li><code>&lt;figure&gt;</code> / <code>&lt;figcaption&gt;</code> — Figure avec légende</li>
        </ul>
        <p><strong>Avantages :</strong> Meilleur SEO, accessibilité, lisibilité du code.</p>
      `
    },
    {
      id: "fe_42", type: "quiz", category: "HTML - Sémantique HTML5",
      title: "Balise de navigation",
      instruction: "Quelle balise sémantique HTML5 est utilisée pour la navigation ?",
      options: ["<nav>", "<menu>", "<navigation>", "<links>"],
      correct: 0,
      explanation: "<nav> est la balise sémantique pour les blocs de navigation."
    },
    {
      id: "fe_43", type: "puzzle", category: "HTML - Sémantique HTML5",
      title: "Structure sémantique",
      description: "Ordonnez les balises sémantiques d'une page.",
      pieces: ["<header>", "<nav>", "</nav>", "</header>", "<main>", "<article>", "</article>", "</main>", "<footer>", "</footer>"],
      hint: "Header en haut, main au milieu, footer en bas."
    },
    {
      id: "fe_44", type: "code", category: "HTML - Sémantique HTML5",
      title: "Structure sémantique",
      description: "Créez une structure de page sémantique.",
      instruction: "Créez un <code>&lt;header&gt;</code> contenant un <code>&lt;h1&gt;Mon Blog&lt;/h1&gt;</code>, puis un <code>&lt;main&gt;</code> contenant un <code>&lt;p&gt;Bienvenue&lt;/p&gt;</code>.",
      language: "HTML",
      code_template: "",
      tests: [
        { type: "contains", expected: "<header>" },
        { type: "contains", expected: "<h1>Mon Blog</h1>" },
        { type: "contains", expected: "</header>" },
        { type: "contains", expected: "<main>" },
        { type: "contains", expected: "<p>Bienvenue</p>" },
        { type: "contains", expected: "</main>" }
      ],
      hint: "Imbriquez h1 dans header, et p dans main."
    },
    // ─── Attributs & Méta ────────────────────────────────────────
    {
      id: "fe_45", type: "intro", category: "HTML - Attributs & Méta",
      title: "Les attributs HTML",
      description: "Comprendre les attributs des balises.",
      content: `
        <h5 style="color:#e34c26;">⚙️ Les attributs HTML</h5>
        <p>Les attributs ajoutent des informations aux balises :</p>
        <ul>
          <li><code>id</code> — Identifiant unique</li>
          <li><code>class</code> — Classe(s) CSS</li>
          <li><code>style</code> — Style inline</li>
          <li><code>title</code> — Info-bulle au survol</li>
          <li><code>data-*</code> — Données personnalisées</li>
          <li><code>hidden</code> — Masquer un élément</li>
          <li><code>lang</code> — Langue du contenu</li>
        </ul>
        <p>Les attributs s'écrivent dans la balise ouvrante : <code>&lt;tag attribut="valeur"&gt;</code></p>
      `
    },
    {
      id: "fe_46", type: "quiz", category: "HTML - Attributs & Méta",
      title: "Attribut unique",
      instruction: "Quel attribut doit être unique sur toute la page ?",
      options: ["id", "class", "name", "style"],
      correct: 0,
      explanation: "L'attribut id doit être unique. class peut être réutilisée sur plusieurs éléments."
    },
    {
      id: "fe_47", type: "code", category: "HTML - Attributs & Méta",
      title: "Attributs id et class",
      description: "Ajoutez des attributs à un div.",
      instruction: "Créez un <code>&lt;div&gt;</code> avec <code>id=\"container\"</code> et <code>class=\"main-box\"</code> contenant le texte <strong>Contenu</strong>.",
      language: "HTML",
      code_template: "",
      tests: [
        { type: "contains", expected: 'id="container"' },
        { type: "contains", expected: 'class="main-box"' },
        { type: "contains", expected: "Contenu" },
        { type: "contains", expected: "</div>" }
      ],
      hint: 'Syntaxe : <div id="..." class="...">texte</div>'
    },
    // ─── Multimédia ──────────────────────────────────────────────
    {
      id: "fe_48", type: "intro", category: "HTML - Multimédia",
      title: "Audio et Vidéo HTML5",
      description: "Intégrer du multimédia.",
      content: `
        <h5 style="color:#e34c26;">🎬 Audio et Vidéo en HTML5</h5>
        <p>HTML5 permet d'intégrer nativement de l'audio et de la vidéo :</p>
        <h6>Vidéo :</h6>
        <pre style="background:#1a1a2e;padding:0.8rem;border-radius:6px;"><code>&lt;video src="film.mp4" controls width="640"&gt;
  Votre navigateur ne supporte pas la vidéo.
&lt;/video&gt;</code></pre>
        <h6>Audio :</h6>
        <pre style="background:#1a1a2e;padding:0.8rem;border-radius:6px;"><code>&lt;audio src="musique.mp3" controls&gt;
  Votre navigateur ne supporte pas l'audio.
&lt;/audio&gt;</code></pre>
        <p>Attributs utiles : <code>controls</code>, <code>autoplay</code>, <code>loop</code>, <code>muted</code>.</p>
      `
    },
    {
      id: "fe_49", type: "quiz", category: "HTML - Multimédia",
      title: "Attribut controls",
      instruction: "Que fait l'attribut <code>controls</code> sur une balise <code>&lt;video&gt;</code> ?",
      options: [
        "Affiche les contrôles de lecture (play, pause, volume)",
        "Limite la durée de la vidéo",
        "Empêche le téléchargement",
        "Active le mode plein écran"
      ],
      correct: 0,
      explanation: "L'attribut controls affiche les boutons de lecture, pause, volume, etc."
    },
    {
      id: "fe_50", type: "code", category: "HTML - Multimédia",
      title: "Intégrer une vidéo",
      description: "Créez une balise vidéo.",
      instruction: "Créez une balise <code>&lt;video&gt;</code> avec <code>src=\"intro.mp4\"</code>, l'attribut <code>controls</code> et <code>width=\"640\"</code>.",
      language: "HTML",
      code_template: "",
      tests: [
        { type: "contains", expected: "<video" },
        { type: "contains", expected: 'src="intro.mp4"' },
        { type: "contains", expected: "controls" },
        { type: "contains", expected: 'width="640"' }
      ],
      hint: '<video src="fichier.mp4" controls width="640"></video>'
    }
  ];

addExercises("frontend", exercises);
