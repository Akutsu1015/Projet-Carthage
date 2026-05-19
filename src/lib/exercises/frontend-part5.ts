import { addExercises } from "./registry";
import type { Exercise } from "./registry";

// @ts-nocheck — Auto-converted from exercises-frontend-part5.js
const exercises: Exercise[] = [
    // ─── JS DOM INTRO ────────────────────────────────────────────
    {
      id: "fe_201", type: "intro", category: "JS DOM - Introduction",
      title: "JavaScript et le DOM",
      description: "Manipuler la page web avec JavaScript.",
      content: `
        <h5 style="color:#f7df1e;">⚡ JavaScript & le DOM</h5>
        <p>Le <strong>DOM</strong> (Document Object Model) est la représentation en arbre de la page HTML. JavaScript peut le manipuler pour :</p>
        <ul>
          <li><strong>Sélectionner</strong> des éléments</li>
          <li><strong>Modifier</strong> le contenu, les styles, les attributs</li>
          <li><strong>Créer/supprimer</strong> des éléments</li>
          <li><strong>Écouter</strong> des événements (clic, clavier, scroll...)</li>
        </ul>
        <h6>Méthodes de sélection :</h6>
        <ul>
          <li><code>document.getElementById('id')</code></li>
          <li><code>document.querySelector('.class')</code></li>
          <li><code>document.querySelectorAll('p')</code></li>
        </ul>
      `
    },
    {
      id: "fe_202", type: "quiz", category: "JS DOM - Introduction",
      title: "Sélection DOM",
      instruction: "Quelle méthode sélectionne le PREMIER élément correspondant à un sélecteur CSS ?",
      options: ["document.querySelector()", "document.getElementById()", "document.querySelectorAll()", "document.getElement()"],
      correct: 0,
      explanation: "querySelector() retourne le premier élément qui correspond au sélecteur CSS donné."
    },
    {
      id: "fe_203", type: "code", category: "JS DOM - Introduction",
      title: "Sélectionner un élément",
      description: "Utilisez querySelector pour sélectionner un élément.",
      instruction: "Écrivez du JavaScript qui sélectionne l'élément avec l'id <strong>title</strong> et stocke-le dans une variable <code>const title</code>.",
      language: "JavaScript",
      code_template: "",
      tests: [
        { type: "contains", expected: "const title" },
        { type: "contains", expected: "document.querySelector" },
        { type: "contains", expected: "#title" }
      ],
      hint: "const title = document.querySelector('#title');"
    },
    {
      id: "fe_204", type: "intro", category: "JS DOM - Manipulation",
      title: "Modifier le DOM",
      description: "Changer le contenu et les styles.",
      content: `
        <h5 style="color:#f7df1e;">✏️ Modifier le DOM</h5>
        <h6>Contenu :</h6>
        <ul>
          <li><code>element.textContent = 'texte'</code> — Texte brut</li>
          <li><code>element.innerHTML = '&lt;b&gt;HTML&lt;/b&gt;'</code> — Contenu HTML</li>
        </ul>
        <h6>Styles :</h6>
        <ul>
          <li><code>element.style.color = 'red'</code> — Style inline</li>
          <li><code>element.classList.add('active')</code> — Ajouter une classe</li>
          <li><code>element.classList.remove('hidden')</code> — Retirer une classe</li>
          <li><code>element.classList.toggle('dark')</code> — Basculer une classe</li>
        </ul>
        <h6>Attributs :</h6>
        <ul>
          <li><code>element.setAttribute('href', 'url')</code></li>
          <li><code>element.getAttribute('data-id')</code></li>
        </ul>
      `
    },
    {
      id: "fe_205", type: "quiz", category: "JS DOM - Manipulation",
      title: "textContent vs innerHTML",
      instruction: "Quelle est la différence entre <code>textContent</code> et <code>innerHTML</code> ?",
      options: [
        "textContent insère du texte brut, innerHTML interprète le HTML",
        "textContent est plus lent que innerHTML",
        "innerHTML ne fonctionne que sur les div",
        "Il n'y a aucune différence"
      ],
      correct: 0,
      explanation: "textContent traite tout comme du texte. innerHTML parse et rend le HTML."
    },
    {
      id: "fe_206", type: "code", category: "JS DOM - Manipulation",
      title: "Modifier le texte",
      description: "Changez le contenu d'un élément.",
      instruction: "Sélectionnez l'élément <code>#message</code> et changez son <code>textContent</code> en <strong>Bonjour le monde !</strong>.",
      language: "JavaScript",
      code_template: "",
      tests: [
        { type: "contains", expected: "document.querySelector" },
        { type: "contains", expected: "#message" },
        { type: "contains", expected: "textContent" },
        { type: "contains", expected: "Bonjour le monde !" }
      ],
      hint: "document.querySelector('#message').textContent = 'Bonjour le monde !';"
    },
    {
      id: "fe_207", type: "puzzle", category: "JS DOM - Manipulation",
      title: "Ajouter une classe",
      description: "Reconstituez le code pour ajouter une classe.",
      pieces: ["const btn", "= document.querySelector('.btn');", "btn.classList", ".add('active');", "btn.style.color", "= 'white';"],
      hint: "Sélectionner, ajouter une classe, changer le style."
    },
    {
      id: "fe_208", type: "code", category: "JS DOM - Manipulation",
      title: "Toggle de classe",
      description: "Basculez une classe sur un élément.",
      instruction: "Sélectionnez <code>#menu</code> et utilisez <code>classList.toggle('open')</code> pour basculer la classe.",
      language: "JavaScript",
      code_template: "",
      tests: [
        { type: "contains", expected: "querySelector" },
        { type: "contains", expected: "#menu" },
        { type: "contains", expected: "classList.toggle" },
        { type: "contains", expected: "'open'" }
      ],
      hint: "document.querySelector('#menu').classList.toggle('open');"
    },
    // ─── Événements ──────────────────────────────────────────────
    {
      id: "fe_209", type: "intro", category: "JS DOM - Événements",
      title: "Les événements JavaScript",
      description: "Réagir aux actions de l'utilisateur.",
      content: `
        <h5 style="color:#f7df1e;">🖱️ Les événements</h5>
        <p>Les événements permettent de réagir aux actions utilisateur :</p>
        <h6>Événements courants :</h6>
        <ul>
          <li><code>click</code> — Clic souris</li>
          <li><code>dblclick</code> — Double clic</li>
          <li><code>mouseover</code> / <code>mouseout</code> — Survol</li>
          <li><code>keydown</code> / <code>keyup</code> — Clavier</li>
          <li><code>submit</code> — Envoi de formulaire</li>
          <li><code>input</code> — Saisie dans un champ</li>
          <li><code>scroll</code> — Défilement</li>
          <li><code>load</code> — Chargement terminé</li>
        </ul>
      `,
      code_example: `const btn = document.querySelector('#btn');\n\nbtn.addEventListener('click', function(event) {\n  console.log('Bouton cliqué !');\n  event.target.textContent = 'Cliqué !';\n});`
    },
    {
      id: "fe_210", type: "quiz", category: "JS DOM - Événements",
      title: "addEventListener",
      instruction: "Quelle méthode est recommandée pour écouter un événement ?",
      options: ["addEventListener()", "onclick = ...", "attachEvent()", "onEvent()"],
      correct: 0,
      explanation: "addEventListener() est la méthode moderne. onclick est plus ancien et limité à un seul handler."
    },
    {
      id: "fe_211", type: "code", category: "JS DOM - Événements",
      title: "Écouter un clic",
      description: "Ajoutez un écouteur de clic.",
      instruction: "Sélectionnez <code>#btn</code> et ajoutez un <code>addEventListener('click', ...)</code> qui change le <code>textContent</code> du bouton en <strong>Cliqué !</strong>.",
      language: "JavaScript",
      code_template: "",
      tests: [
        { type: "contains", expected: "querySelector" },
        { type: "contains", expected: "#btn" },
        { type: "contains", expected: "addEventListener" },
        { type: "contains", expected: "'click'" },
        { type: "contains", expected: "textContent" },
        { type: "contains", expected: "Cliqué !" }
      ],
      hint: "document.querySelector('#btn').addEventListener('click', function() { this.textContent = 'Cliqué !'; });"
    },
    {
      id: "fe_212", type: "puzzle", category: "JS DOM - Événements",
      title: "Formulaire submit",
      description: "Reconstituez un handler de formulaire.",
      pieces: ["const form = document.querySelector('#form');", "form.addEventListener('submit',", "function(e) {", "  e.preventDefault();", "  const name = document.querySelector('#name').value;", "  console.log('Bonjour ' + name);", "});"],
      hint: "Sélectionner le form, écouter submit, preventDefault, lire la valeur."
    },
    // ─── Créer des éléments ──────────────────────────────────────
    {
      id: "fe_213", type: "intro", category: "JS DOM - Création",
      title: "Créer des éléments DOM",
      description: "Ajouter dynamiquement du contenu.",
      content: `
        <h5 style="color:#f7df1e;">🔨 Créer des éléments</h5>
        <ul>
          <li><code>document.createElement('tag')</code> — Créer un élément</li>
          <li><code>parent.appendChild(element)</code> — Ajouter en fin</li>
          <li><code>parent.prepend(element)</code> — Ajouter au début</li>
          <li><code>parent.insertBefore(new, ref)</code> — Insérer avant</li>
          <li><code>element.remove()</code> — Supprimer</li>
          <li><code>parent.removeChild(element)</code> — Supprimer un enfant</li>
        </ul>
      `,
      code_example: `const li = document.createElement('li');\nli.textContent = 'Nouvel élément';\nli.classList.add('item');\ndocument.querySelector('ul').appendChild(li);`
    },
    {
      id: "fe_214", type: "code", category: "JS DOM - Création",
      title: "Créer un élément",
      description: "Créez et ajoutez un paragraphe.",
      instruction: "Créez un élément <code>p</code> avec <code>document.createElement</code>, donnez-lui le texte <strong>Nouveau paragraphe</strong> et ajoutez-le au <code>#container</code> avec <code>appendChild</code>.",
      language: "JavaScript",
      code_template: "",
      tests: [
        { type: "contains", expected: "document.createElement" },
        { type: "contains", expected: "'p'" },
        { type: "contains", expected: "textContent" },
        { type: "contains", expected: "Nouveau paragraphe" },
        { type: "contains", expected: "appendChild" }
      ],
      hint: "const p = document.createElement('p'); p.textContent = '...'; container.appendChild(p);"
    },
    {
      id: "fe_215", type: "quiz", category: "JS DOM - Création",
      title: "Supprimer un élément",
      instruction: "Quelle est la méthode la plus simple pour supprimer un élément du DOM ?",
      options: ["element.remove()", "element.delete()", "element.destroy()", "document.remove(element)"],
      correct: 0,
      explanation: "element.remove() supprime l'élément du DOM. Simple et moderne."
    },
    // ─── LocalStorage ────────────────────────────────────────────
    {
      id: "fe_216", type: "intro", category: "JS DOM - Storage",
      title: "LocalStorage",
      description: "Stocker des données dans le navigateur.",
      content: `
        <h5 style="color:#f7df1e;">💾 LocalStorage</h5>
        <p>LocalStorage permet de stocker des données persistantes dans le navigateur :</p>
        <ul>
          <li><code>localStorage.setItem('clé', 'valeur')</code> — Stocker</li>
          <li><code>localStorage.getItem('clé')</code> — Lire</li>
          <li><code>localStorage.removeItem('clé')</code> — Supprimer</li>
          <li><code>localStorage.clear()</code> — Tout effacer</li>
        </ul>
        <p><strong>Important :</strong> LocalStorage ne stocke que des <strong>strings</strong>. Pour les objets :</p>
      `,
      code_example: `// Stocker un objet\nconst user = { name: 'Alice', age: 25 };\nlocalStorage.setItem('user', JSON.stringify(user));\n\n// Lire un objet\nconst data = JSON.parse(localStorage.getItem('user'));\nconsole.log(data.name); // 'Alice'`
    },
    {
      id: "fe_217", type: "quiz", category: "JS DOM - Storage",
      title: "Stocker un objet",
      instruction: "Comment stocker un objet JavaScript dans localStorage ?",
      options: [
        "JSON.stringify() avant setItem()",
        "Directement avec setItem()",
        "Avec localStorage.setObject()",
        "En convertissant en array d'abord"
      ],
      correct: 0,
      explanation: "localStorage ne stocke que des strings. Il faut JSON.stringify() pour les objets."
    },
    {
      id: "fe_218", type: "code", category: "JS DOM - Storage",
      title: "Sauvegarder dans localStorage",
      description: "Stockez et lisez des données.",
      instruction: "Stockez la valeur <strong>dark</strong> avec la clé <strong>theme</strong> dans localStorage, puis lisez-la dans une variable <code>const theme</code>.",
      language: "JavaScript",
      code_template: "",
      tests: [
        { type: "contains", expected: "localStorage.setItem" },
        { type: "contains", expected: "'theme'" },
        { type: "contains", expected: "'dark'" },
        { type: "contains", expected: "localStorage.getItem" },
        { type: "contains", expected: "const theme" }
      ],
      hint: "localStorage.setItem('theme', 'dark'); const theme = localStorage.getItem('theme');"
    },
    // ─── Fetch API ───────────────────────────────────────────────
    {
      id: "fe_219", type: "intro", category: "JS DOM - Fetch API",
      title: "Fetch API",
      description: "Faire des requêtes HTTP.",
      content: `
        <h5 style="color:#f7df1e;">🌐 Fetch API</h5>
        <p>Fetch permet de faire des requêtes HTTP depuis JavaScript :</p>
      `,
      code_example: `// GET request\nfetch('https://api.example.com/data')\n  .then(response => response.json())\n  .then(data => console.log(data))\n  .catch(error => console.error('Erreur:', error));\n\n// Avec async/await\nasync function getData() {\n  try {\n    const response = await fetch('https://api.example.com/data');\n    const data = await response.json();\n    console.log(data);\n  } catch (error) {\n    console.error('Erreur:', error);\n  }\n}`
    },
    {
      id: "fe_220", type: "quiz", category: "JS DOM - Fetch API",
      title: "Fetch retourne",
      instruction: "Que retourne <code>fetch()</code> ?",
      options: ["Une Promise", "Les données directement", "Un objet XMLHttpRequest", "Un callback"],
      correct: 0,
      explanation: "fetch() retourne une Promise qui se résout avec un objet Response."
    },
    {
      id: "fe_221", type: "puzzle", category: "JS DOM - Fetch API",
      title: "Requête Fetch",
      description: "Reconstituez une requête fetch.",
      pieces: ["fetch('https://api.example.com/users')", ".then(response =>", "  response.json())", ".then(data => {", "  console.log(data);", "})", ".catch(err =>", "  console.error(err));"],
      hint: "fetch() → .then(response.json()) → .then(data) → .catch(err)"
    },
    // ─── PROJET : Todo App ───────────────────────────────────────
    {
      id: "fe_222", type: "intro", category: "Projet - Todo App",
      title: "Projet : Todo App",
      description: "Construisez une application de tâches complète !",
      content: `
        <h5 style="color:#10b981;">🚀 Projet : Todo App</h5>
        <p>Dans les prochains niveaux, vous allez construire une <strong>Todo App</strong> complète :</p>
        <ul>
          <li>✅ Structure HTML avec formulaire et liste</li>
          <li>🎨 Style CSS avec animations</li>
          <li>⚡ JavaScript pour ajouter/supprimer/cocher des tâches</li>
          <li>💾 Sauvegarde dans localStorage</li>
          <li>🔍 Filtrage (toutes, actives, complétées)</li>
        </ul>
        <p>C'est un projet classique qui combine tout ce que vous avez appris !</p>
      `
    },
    {
      id: "fe_223", type: "code", category: "Projet - Todo App",
      title: "Todo : Structure HTML",
      description: "Créez la structure HTML de la Todo App.",
      instruction: "Créez un <code>div#app</code> contenant un <code>h1</code> (<strong>Mes Tâches</strong>), un <code>form#todo-form</code> avec un <code>input#todo-input</code> (type text, placeholder 'Nouvelle tâche') et un <code>button</code> (type submit, texte 'Ajouter'), puis un <code>ul#todo-list</code> vide.",
      language: "HTML",
      code_template: "",
      tests: [
        { type: "contains", expected: 'id="app"' },
        { type: "contains", expected: "<h1>Mes Tâches</h1>" },
        { type: "contains", expected: 'id="todo-form"' },
        { type: "contains", expected: 'id="todo-input"' },
        { type: "contains", expected: 'type="text"' },
        { type: "contains", expected: 'id="todo-list"' }
      ],
      hint: "div#app > h1 + form#todo-form > input + button + ul#todo-list"
    },
    {
      id: "fe_224", type: "code", category: "Projet - Todo App",
      title: "Todo : Style CSS",
      description: "Stylisez la Todo App.",
      instruction: "Stylisez <code>#app</code> avec <code>max-width: 500px</code>, <code>margin: 2rem auto</code> et <code>font-family: sans-serif</code>. Stylisez <code>#todo-input</code> avec <code>padding: 0.5rem</code> et <code>width: 70%</code>.",
      language: "CSS",
      code_template: "",
      tests: [
        { type: "contains", expected: "#app" },
        { type: "contains", expected: "max-width: 500px" },
        { type: "contains", expected: "margin: 2rem auto" },
        { type: "contains", expected: "#todo-input" },
        { type: "contains", expected: "padding: 0.5rem" },
        { type: "contains", expected: "width: 70%" }
      ],
      hint: "#app { ... } #todo-input { ... }"
    },
    {
      id: "fe_225", type: "code", category: "Projet - Todo App",
      title: "Todo : Ajouter une tâche",
      description: "JavaScript pour ajouter des tâches.",
      instruction: "Écrivez le JS : sélectionnez <code>#todo-form</code>, écoutez <code>submit</code>, faites <code>e.preventDefault()</code>, récupérez la valeur de <code>#todo-input</code>, créez un <code>li</code> avec cette valeur et ajoutez-le à <code>#todo-list</code>.",
      language: "JavaScript",
      code_template: "",
      tests: [
        { type: "contains", expected: "addEventListener" },
        { type: "contains", expected: "'submit'" },
        { type: "contains", expected: "preventDefault" },
        { type: "contains", expected: "createElement('li')" },
        { type: "contains", expected: "appendChild" }
      ],
      hint: "form.addEventListener('submit', (e) => { e.preventDefault(); const li = ...; list.appendChild(li); });"
    },
    {
      id: "fe_226", type: "code", category: "Projet - Todo App",
      title: "Todo : Supprimer une tâche",
      description: "Ajoutez un bouton de suppression.",
      instruction: "Après avoir créé le <code>li</code>, créez un <code>button</code> avec le texte <strong>X</strong>, ajoutez un <code>addEventListener('click', ...)</code> qui appelle <code>li.remove()</code>, puis ajoutez le bouton au <code>li</code> avec <code>appendChild</code>.",
      language: "JavaScript",
      code_template: "",
      tests: [
        { type: "contains", expected: "createElement('button')" },
        { type: "contains", expected: "'X'" },
        { type: "contains", expected: "addEventListener" },
        { type: "contains", expected: "'click'" },
        { type: "contains", expected: ".remove()" },
        { type: "contains", expected: "appendChild" }
      ],
      hint: "const delBtn = document.createElement('button'); delBtn.textContent = 'X'; delBtn.addEventListener('click', () => li.remove()); li.appendChild(delBtn);"
    },
    {
      id: "fe_227", type: "code", category: "Projet - Todo App",
      title: "Todo : Cocher une tâche",
      description: "Toggle la classe 'done' au clic sur la tâche.",
      instruction: "Ajoutez un <code>addEventListener('click', ...)</code> sur le <code>li</code> qui fait <code>classList.toggle('done')</code>.",
      language: "JavaScript",
      code_template: "",
      tests: [
        { type: "contains", expected: "addEventListener" },
        { type: "contains", expected: "'click'" },
        { type: "contains", expected: "classList.toggle" },
        { type: "contains", expected: "'done'" }
      ],
      hint: "li.addEventListener('click', () => li.classList.toggle('done'));"
    },
    {
      id: "fe_228", type: "code", category: "Projet - Todo App",
      title: "Todo : Sauvegarder",
      description: "Sauvegardez les tâches dans localStorage.",
      instruction: "Créez une fonction <code>saveTodos()</code> qui récupère tous les <code>li</code> de <code>#todo-list</code>, extrait leur <code>textContent</code> dans un tableau, et le sauvegarde avec <code>localStorage.setItem('todos', JSON.stringify(todos))</code>.",
      language: "JavaScript",
      code_template: "",
      tests: [
        { type: "contains", expected: "function saveTodos" },
        { type: "contains", expected: "querySelectorAll" },
        { type: "contains", expected: "JSON.stringify" },
        { type: "contains", expected: "localStorage.setItem" },
        { type: "contains", expected: "'todos'" }
      ],
      hint: "function saveTodos() { const items = document.querySelectorAll('#todo-list li'); ... localStorage.setItem('todos', JSON.stringify(todos)); }"
    },
    // ─── PROJET : Theme Switcher ─────────────────────────────────
    {
      id: "fe_229", type: "intro", category: "Projet - Theme Switcher",
      title: "Projet : Theme Switcher",
      description: "Créez un système de thème clair/sombre.",
      content: `
        <h5 style="color:#7c3aed;">🌓 Projet : Theme Switcher</h5>
        <p>Vous allez créer un <strong>toggle de thème</strong> complet :</p>
        <ul>
          <li>🎨 Variables CSS pour les couleurs</li>
          <li>🔘 Bouton toggle avec icône</li>
          <li>⚡ JavaScript pour basculer le thème</li>
          <li>💾 Sauvegarde du choix dans localStorage</li>
          <li>🖥️ Détection du thème système avec prefers-color-scheme</li>
        </ul>
      `
    },
    {
      id: "fe_230", type: "code", category: "Projet - Theme Switcher",
      title: "Theme : Variables CSS",
      description: "Définissez les variables de thème.",
      instruction: "Créez les variables dans <code>:root</code> : <code>--bg: #ffffff</code>, <code>--text: #333333</code>, <code>--primary: #3498db</code>. Puis dans <code>[data-theme='dark']</code> : <code>--bg: #1a1a2e</code>, <code>--text: #e2e8f0</code>, <code>--primary: #00d4ff</code>.",
      language: "CSS",
      code_template: "",
      tests: [
        { type: "contains", expected: ":root" },
        { type: "contains", expected: "--bg: #ffffff" },
        { type: "contains", expected: "--text: #333333" },
        { type: "contains", expected: "[data-theme='dark']" },
        { type: "contains", expected: "--bg: #1a1a2e" },
        { type: "contains", expected: "--text: #e2e8f0" }
      ],
      hint: ":root { --bg: ...; } [data-theme='dark'] { --bg: ...; }"
    },
    {
      id: "fe_231", type: "code", category: "Projet - Theme Switcher",
      title: "Theme : Toggle JS",
      description: "JavaScript pour basculer le thème.",
      instruction: "Sélectionnez <code>#theme-toggle</code>, écoutez <code>click</code>. Dans le handler, utilisez <code>document.documentElement.getAttribute('data-theme')</code> pour lire le thème actuel, basculez entre 'light' et 'dark' avec <code>setAttribute</code>, et sauvegardez dans <code>localStorage</code>.",
      language: "JavaScript",
      code_template: "",
      tests: [
        { type: "contains", expected: "#theme-toggle" },
        { type: "contains", expected: "addEventListener" },
        { type: "contains", expected: "getAttribute" },
        { type: "contains", expected: "data-theme" },
        { type: "contains", expected: "setAttribute" },
        { type: "contains", expected: "localStorage" }
      ],
      hint: "Lisez le thème actuel, inversez-le, appliquez avec setAttribute, sauvegardez."
    },
    // ─── PROJET : Modal Component ────────────────────────────────
    {
      id: "fe_232", type: "intro", category: "Projet - Composants",
      title: "Projet : Modal personnalisé",
      description: "Créez un composant modal sans framework.",
      content: `
        <h5 style="color:#ef4444;">🪟 Projet : Modal Component</h5>
        <p>Créez un modal (popup) réutilisable en HTML/CSS/JS pur :</p>
        <ul>
          <li>📐 Structure HTML : overlay + contenu</li>
          <li>🎨 CSS : centrage, animation d'apparition</li>
          <li>⚡ JS : ouvrir/fermer, clic sur overlay pour fermer</li>
          <li>⌨️ Touche Escape pour fermer</li>
        </ul>
      `
    },
    {
      id: "fe_233", type: "code", category: "Projet - Composants",
      title: "Modal : HTML",
      description: "Structure HTML du modal.",
      instruction: "Créez un <code>div#modal-overlay</code> (classe <code>hidden</code>) contenant un <code>div.modal-content</code> avec un <code>button.modal-close</code> (texte <strong>&times;</strong>), un <code>h2</code> (<strong>Mon Modal</strong>) et un <code>p</code> (<strong>Contenu du modal</strong>).",
      language: "HTML",
      code_template: "",
      tests: [
        { type: "contains", expected: 'id="modal-overlay"' },
        { type: "contains", expected: "hidden" },
        { type: "contains", expected: 'class="modal-content"' },
        { type: "contains", expected: 'class="modal-close"' },
        { type: "contains", expected: "Mon Modal" }
      ],
      hint: "#modal-overlay.hidden > .modal-content > .modal-close + h2 + p"
    },
    {
      id: "fe_234", type: "code", category: "Projet - Composants",
      title: "Modal : CSS",
      description: "Stylisez le modal avec overlay.",
      instruction: "Stylisez <code>#modal-overlay</code> avec <code>position: fixed</code>, <code>top: 0; left: 0; width: 100%; height: 100%</code>, <code>background: rgba(0,0,0,0.5)</code>, <code>display: flex; justify-content: center; align-items: center</code>. Ajoutez <code>.hidden { display: none; }</code>.",
      language: "CSS",
      code_template: "",
      tests: [
        { type: "contains", expected: "#modal-overlay" },
        { type: "contains", expected: "position: fixed" },
        { type: "contains", expected: "rgba(0,0,0,0.5)" },
        { type: "contains", expected: "display: flex" },
        { type: "contains", expected: ".hidden" },
        { type: "contains", expected: "display: none" }
      ],
      hint: "#modal-overlay { position: fixed; ... display: flex; ... } .hidden { display: none; }"
    },
    {
      id: "fe_235", type: "code", category: "Projet - Composants",
      title: "Modal : JavaScript",
      description: "Ouvrir et fermer le modal.",
      instruction: "Créez une fonction <code>openModal()</code> qui retire la classe <code>hidden</code> de <code>#modal-overlay</code>, et <code>closeModal()</code> qui l'ajoute. Ajoutez un listener sur <code>.modal-close</code> qui appelle <code>closeModal()</code>.",
      language: "JavaScript",
      code_template: "",
      tests: [
        { type: "contains", expected: "function openModal" },
        { type: "contains", expected: "function closeModal" },
        { type: "contains", expected: "classList" },
        { type: "contains", expected: "'hidden'" },
        { type: "contains", expected: ".modal-close" },
        { type: "contains", expected: "addEventListener" }
      ],
      hint: "function openModal() { overlay.classList.remove('hidden'); } function closeModal() { overlay.classList.add('hidden'); }"
    },
    // ─── PROJET : Responsive Portfolio ───────────────────────────
    {
      id: "fe_236", type: "intro", category: "Projet - Portfolio",
      title: "Projet : Portfolio Responsive",
      description: "Construisez un portfolio complet !",
      content: `
        <h5 style="color:#00d4ff;">💼 Projet Final : Portfolio Responsive</h5>
        <p>Les derniers niveaux vous guident dans la création d'un <strong>portfolio professionnel</strong> :</p>
        <ul>
          <li>📐 Layout avec CSS Grid et Flexbox</li>
          <li>🎨 Design moderne avec glassmorphism</li>
          <li>📱 Responsive mobile-first</li>
          <li>✨ Animations et transitions</li>
          <li>🌓 Mode sombre/clair</li>
          <li>⚡ JavaScript interactif</li>
        </ul>
      `
    },
    {
      id: "fe_237", type: "code", category: "Projet - Portfolio",
      title: "Portfolio : Navbar",
      description: "Créez la navbar du portfolio.",
      instruction: "Créez un <code>&lt;nav&gt;</code> avec la classe <code>navbar</code> contenant un <code>a.logo</code> (<strong>MonPortfolio</strong>) et un <code>ul.nav-links</code> avec 4 <code>li > a</code> : <strong>Accueil</strong>, <strong>Projets</strong>, <strong>Compétences</strong>, <strong>Contact</strong>.",
      language: "HTML",
      code_template: "",
      tests: [
        { type: "contains", expected: 'class="navbar"' },
        { type: "contains", expected: 'class="logo"' },
        { type: "contains", expected: "MonPortfolio" },
        { type: "contains", expected: 'class="nav-links"' },
        { type: "contains", expected: "Accueil" },
        { type: "contains", expected: "Projets" },
        { type: "contains", expected: "Contact" }
      ],
      hint: "nav.navbar > a.logo + ul.nav-links > li > a × 4"
    },
    {
      id: "fe_238", type: "code", category: "Projet - Portfolio",
      title: "Portfolio : Hero Section",
      description: "Créez la section hero.",
      instruction: "Créez une <code>section.hero</code> contenant un <code>h1</code> (<strong>Développeur Front-End</strong>), un <code>p.subtitle</code> (<strong>Passionné par le web moderne</strong>) et un <code>a.btn</code> (<strong>Voir mes projets</strong>).",
      language: "HTML",
      code_template: "",
      tests: [
        { type: "contains", expected: 'class="hero"' },
        { type: "contains", expected: "Développeur Front-End" },
        { type: "contains", expected: 'class="subtitle"' },
        { type: "contains", expected: 'class="btn"' },
        { type: "contains", expected: "Voir mes projets" }
      ],
      hint: "section.hero > h1 + p.subtitle + a.btn"
    },
    {
      id: "fe_239", type: "code", category: "Projet - Portfolio",
      title: "Portfolio : Grille de projets",
      description: "CSS Grid pour les cartes de projets.",
      instruction: "Stylisez <code>.projects-grid</code> avec <code>display: grid</code>, <code>grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))</code>, <code>gap: 2rem</code> et <code>padding: 2rem</code>.",
      language: "CSS",
      code_template: ".projects-grid {\n\n}",
      tests: [
        { type: "contains", expected: "display: grid" },
        { type: "contains", expected: "repeat(auto-fit, minmax(300px, 1fr))" },
        { type: "contains", expected: "gap: 2rem" },
        { type: "contains", expected: "padding: 2rem" }
      ],
      hint: "4 propriétés dans .projects-grid { }."
    },
    {
      id: "fe_240", type: "code", category: "Projet - Portfolio",
      title: "Portfolio : Carte projet",
      description: "Stylisez une carte de projet.",
      instruction: "Stylisez <code>.project-card</code> avec <code>background: rgba(255,255,255,0.05)</code>, <code>border-radius: 12px</code>, <code>overflow: hidden</code>, <code>transition: transform 0.3s ease</code>. Et <code>.project-card:hover</code> avec <code>transform: translateY(-5px)</code>.",
      language: "CSS",
      code_template: "",
      tests: [
        { type: "contains", expected: ".project-card" },
        { type: "contains", expected: "border-radius: 12px" },
        { type: "contains", expected: "overflow: hidden" },
        { type: "contains", expected: "transition" },
        { type: "contains", expected: ":hover" },
        { type: "contains", expected: "translateY(-5px)" }
      ],
      hint: ".project-card { ... } .project-card:hover { transform: translateY(-5px); }"
    },
    {
      id: "fe_241", type: "code", category: "Projet - Portfolio",
      title: "Portfolio : Section compétences",
      description: "Barres de progression pour les compétences.",
      instruction: "Créez une <code>section.skills</code> avec un <code>h2</code> (<strong>Compétences</strong>) et un <code>div.skill</code> contenant un <code>span.skill-name</code> (<strong>HTML/CSS</strong>) et un <code>div.skill-bar</code> avec un <code>div.skill-fill</code> ayant <code>style=\"width: 90%\"</code>.",
      language: "HTML",
      code_template: "",
      tests: [
        { type: "contains", expected: 'class="skills"' },
        { type: "contains", expected: "Compétences" },
        { type: "contains", expected: 'class="skill"' },
        { type: "contains", expected: 'class="skill-name"' },
        { type: "contains", expected: "HTML/CSS" },
        { type: "contains", expected: 'class="skill-bar"' },
        { type: "contains", expected: 'class="skill-fill"' }
      ],
      hint: "section.skills > h2 + div.skill > span.skill-name + div.skill-bar > div.skill-fill"
    },
    {
      id: "fe_242", type: "code", category: "Projet - Portfolio",
      title: "Portfolio : Formulaire contact",
      description: "Créez le formulaire de contact.",
      instruction: "Créez un <code>form.contact-form</code> avec 3 champs : <code>input</code> (type text, placeholder 'Nom'), <code>input</code> (type email, placeholder 'Email'), <code>textarea</code> (placeholder 'Message') et un <code>button</code> (type submit, texte 'Envoyer').",
      language: "HTML",
      code_template: "",
      tests: [
        { type: "contains", expected: 'class="contact-form"' },
        { type: "contains", expected: 'type="text"' },
        { type: "contains", expected: 'type="email"' },
        { type: "contains", expected: "<textarea" },
        { type: "contains", expected: 'type="submit"' },
        { type: "contains", expected: "Envoyer" }
      ],
      hint: "form.contact-form > input + input + textarea + button"
    },
    {
      id: "fe_243", type: "code", category: "Projet - Portfolio",
      title: "Portfolio : Responsive navbar",
      description: "Media query pour la navbar mobile.",
      instruction: "Écrivez une media query <code>@media (max-width: 768px)</code> qui change <code>.nav-links</code> en <code>flex-direction: column</code>, <code>display: none</code> et <code>.nav-links.active</code> en <code>display: flex</code>.",
      language: "CSS",
      code_template: "",
      tests: [
        { type: "contains", expected: "@media" },
        { type: "contains", expected: "max-width: 768px" },
        { type: "contains", expected: ".nav-links" },
        { type: "contains", expected: "flex-direction: column" },
        { type: "contains", expected: "display: none" },
        { type: "contains", expected: ".nav-links.active" },
        { type: "contains", expected: "display: flex" }
      ],
      hint: "@media (max-width: 768px) { .nav-links { display: none; ... } .nav-links.active { display: flex; } }"
    },
    {
      id: "fe_244", type: "code", category: "Projet - Portfolio",
      title: "Portfolio : Hamburger menu JS",
      description: "JavaScript pour le menu hamburger.",
      instruction: "Sélectionnez <code>.hamburger</code> et <code>.nav-links</code>. Ajoutez un listener <code>click</code> sur le hamburger qui fait <code>navLinks.classList.toggle('active')</code>.",
      language: "JavaScript",
      code_template: "",
      tests: [
        { type: "contains", expected: ".hamburger" },
        { type: "contains", expected: ".nav-links" },
        { type: "contains", expected: "addEventListener" },
        { type: "contains", expected: "'click'" },
        { type: "contains", expected: "classList.toggle" },
        { type: "contains", expected: "'active'" }
      ],
      hint: "hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));"
    },
    {
      id: "fe_245", type: "code", category: "Projet - Portfolio",
      title: "Portfolio : Scroll animation",
      description: "Animation au défilement.",
      instruction: "Créez un <code>IntersectionObserver</code> qui ajoute la classe <code>visible</code> quand un élément <code>.fade-in</code> entre dans le viewport. Observez tous les <code>.fade-in</code>.",
      language: "JavaScript",
      code_template: "",
      tests: [
        { type: "contains", expected: "IntersectionObserver" },
        { type: "contains", expected: "classList.add" },
        { type: "contains", expected: "'visible'" },
        { type: "contains", expected: ".fade-in" },
        { type: "contains", expected: "observe" }
      ],
      hint: "const observer = new IntersectionObserver((entries) => { entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }); }); document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));"
    },
    // ─── Niveaux finaux : Bonnes pratiques ───────────────────────
    {
      id: "fe_246", type: "intro", category: "Bonnes Pratiques",
      title: "Accessibilité (a11y)",
      description: "Rendre votre site accessible à tous.",
      content: `
        <h5 style="color:#10b981;">♿ Accessibilité Web</h5>
        <p>L'accessibilité garantit que votre site est utilisable par tous :</p>
        <ul>
          <li><strong>alt</strong> sur toutes les images</li>
          <li><strong>Labels</strong> sur tous les champs de formulaire</li>
          <li><strong>Contraste</strong> suffisant (ratio 4.5:1 minimum)</li>
          <li><strong>Navigation clavier</strong> — tabindex, focus visible</li>
          <li><strong>ARIA</strong> — roles, aria-label, aria-hidden</li>
          <li><strong>HTML sémantique</strong> — header, nav, main, footer</li>
          <li><strong>Skip links</strong> — Lien pour sauter la navigation</li>
        </ul>
      `
    },
    {
      id: "fe_247", type: "quiz", category: "Bonnes Pratiques",
      title: "Ratio de contraste",
      instruction: "Quel est le ratio de contraste minimum recommandé (WCAG AA) pour le texte normal ?",
      options: ["4.5:1", "2:1", "3:1", "7:1"],
      correct: 0,
      explanation: "WCAG AA exige un ratio de 4.5:1 pour le texte normal et 3:1 pour le texte large."
    },
    {
      id: "fe_248", type: "intro", category: "Bonnes Pratiques",
      title: "Performance Front-End",
      description: "Optimiser la vitesse de chargement.",
      content: `
        <h5 style="color:#f59e0b;">⚡ Performance</h5>
        <ul>
          <li><strong>Images</strong> — Formats modernes (WebP, AVIF), lazy loading</li>
          <li><strong>CSS</strong> — Minifier, critical CSS inline</li>
          <li><strong>JS</strong> — defer/async, code splitting, tree shaking</li>
          <li><strong>Fonts</strong> — font-display: swap, preload</li>
          <li><strong>Cache</strong> — Headers de cache, service workers</li>
          <li><strong>Outils</strong> — Lighthouse, PageSpeed Insights, WebPageTest</li>
        </ul>
      `
    },
    {
      id: "fe_249", type: "quiz", category: "Bonnes Pratiques",
      title: "Attribut loading='lazy'",
      instruction: "Que fait <code>loading=\"lazy\"</code> sur une image ?",
      options: [
        "L'image n'est chargée que quand elle approche du viewport",
        "L'image est chargée en basse qualité",
        "L'image est chargée en dernier",
        "L'image est mise en cache"
      ],
      correct: 0,
      explanation: "loading='lazy' diffère le chargement de l'image jusqu'à ce qu'elle soit proche du viewport."
    },
    {
      id: "fe_250", type: "intro", category: "Bonnes Pratiques",
      title: "Félicitations ! Module terminé !",
      description: "Vous avez complété les 250 niveaux !",
      content: `
        <h5 style="color:#00d4ff;">🎉 FÉLICITATIONS !</h5>
        <p>Vous avez complété les <strong>250 niveaux</strong> du module Front-End !</p>
        <div style="background:linear-gradient(135deg,rgba(0,212,255,0.1),rgba(124,58,237,0.1));border-radius:12px;padding:1.5rem;margin:1rem 0;">
          <h6>📊 Ce que vous maîtrisez maintenant :</h6>
          <ul>
            <li>✅ <strong>HTML</strong> — Structure, sémantique, formulaires, multimédia</li>
            <li>✅ <strong>CSS</strong> — Flexbox, Grid, animations, responsive, variables</li>
            <li>✅ <strong>Bootstrap</strong> — Grille, composants, utilitaires</li>
            <li>✅ <strong>Bulma</strong> — Colonnes, composants, formulaires</li>
            <li>✅ <strong>SCSS</strong> — Variables, nesting, mixins, fonctions, boucles, architecture</li>
            <li>✅ <strong>JS DOM</strong> — Sélection, manipulation, événements, fetch, localStorage</li>
            <li>✅ <strong>Projets</strong> — Todo App, Theme Switcher, Modal, Portfolio</li>
          </ul>
        </div>
        <p style="font-size:1.1rem;text-align:center;margin-top:1.5rem;">
          <strong>🚀 Vous êtes prêt pour le développement front-end professionnel !</strong>
        </p>
      `
    }
  ];

addExercises("frontend", exercises);
