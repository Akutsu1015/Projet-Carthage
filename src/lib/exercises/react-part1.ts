import { addExercises } from "./registry";
import type { Exercise } from "./registry";

const exercises: Exercise[] = [
  // === DUOLINGO SYSTEM (Intro, Quiz, Puzzle) ===
  {
    id: "react_intro_0",
    type: "intro",
    title: "Bienvenue sur React !",
    description: "La bibliothèque UI la plus populaire.",
    content: "<p>Bienvenue dans votre formation <strong>React</strong> ! React, créé par Facebook, révolutionne la façon de créer des interfaces utilisateur pour le web.</p><p>L'idée principale est de diviser l'interface en petits éléments réutilisables appelés <strong>composants</strong>.</p><p>Prêt à découvrir cette nouvelle façon de penser le code frontend ?</p>",
    category: "Général",
    code_example: "export default function App() {\n  return <h1>Hello React!</h1>;\n}",
  },
  {
    id: "react_quiz_0",
    type: "quiz",
    title: "Vérifions les bases",
    instruction: "Quel est le concept central fondamental de React ?",
    options: [
      "Une énorme fonction unique qui gère tout l'écran",
      "Un système pour écrire des requêtes de base de données en SQL",
      "Des composants indépendants et réutilisables qui forment l'interface",
      "Une bibliothèque strictement réservée au backend"
    ],
    correct: 2,
    explanation: "Exact ! React fonctionne sur un système modulaire de composants qui gèrent chacun leur propre état.",
    category: "Général",
  },
  {
    id: "react_puzzle_0",
    type: "puzzle",
    title: "Premier puzzle React",
    instruction: "Remettez en ordre la structure d'un composant basique en JSX :",
    pieces: ["export", "default function", "App()", "{", "return <p>Yo</p>;", "}"],
    hint: " export default function App() { ... }",
    category: "Général",
  },

  // === JSX FONDAMENTAUX (1-5) ===
  {
    id: "react_1",
    type: "intro",
    category: "JSX Fondamentaux",
    title: "Bienvenue dans React",
    description: "React est une bibliothèque JavaScript créée par Facebook pour construire des interfaces utilisateur.",
    content: `<h3>🚀 React — La bibliothèque UI du web moderne</h3>
<p>React permet de créer des interfaces utilisateur <strong>composables</strong> et <strong>réactives</strong>.</p>
<ul>
<li><strong>Composants</strong> — Des blocs réutilisables qui encapsulent UI + logique</li>
<li><strong>JSX</strong> — Une syntaxe qui mélange HTML et JavaScript</li>
<li><strong>Virtual DOM</strong> — React met à jour uniquement ce qui change, ultra-performant</li>
<li><strong>Hooks</strong> — Des fonctions pour gérer l'état et les effets de bord</li>
</ul>
<p>Dans ce module, vous apprendrez à maîtriser React depuis les bases jusqu'aux concepts avancés.</p>`,
  },
  {
    id: "react_2",
    type: "quiz",
    category: "JSX Fondamentaux",
    title: "Qu'est-ce que React ?",
    description: "Testez vos connaissances sur React.",
    options: [
      "Un framework CSS pour le design responsive",
      "Une bibliothèque JavaScript pour construire des interfaces utilisateur",
      "Un langage de programmation backend",
      "Un système de gestion de base de données",
    ],
    correct: 1,
    explanation: "React est une bibliothèque JavaScript (library) créée par Meta/Facebook pour construire des interfaces utilisateur composables et réactives.",
  },
  {
    id: "react_3",
    type: "quiz",
    category: "JSX Fondamentaux",
    title: "Que signifie JSX ?",
    description: "JSX est au cœur de React.",
    options: [
      "JavaScript XML — une extension de syntaxe pour écrire du HTML dans JavaScript",
      "Java Syntax Extension — du Java dans le navigateur",
      "JSON Extended Syntax — un format de données amélioré",
      "JavaScript Extra — des fonctions supplémentaires pour JS",
    ],
    correct: 0,
    explanation: "JSX signifie JavaScript XML. C'est une extension de syntaxe qui permet d'écrire du HTML directement dans le code JavaScript. Le JSX est ensuite compilé en appels React.createElement().",
  },
  {
    id: "react_4",
    type: "code",
    category: "JSX Fondamentaux",
    title: "Premier composant JSX",
    description: "Créez votre premier élément JSX qui affiche un titre.",
    instruction: "Créez une constante <code>element</code> contenant un élément JSX <code>&lt;h1&gt;</code> avec le texte <strong>Bonjour React</strong>.",
    code_template: `// Créez un élément JSX h1
const element = `,
    solution: `const element = <h1>Bonjour React</h1>;`,
    tests: [
      { type: "contains", expected: "<h1>" },
      { type: "contains", expected: "Bonjour React" },
      { type: "contains", expected: "</h1>" },
    ],
    hint: "En JSX, vous pouvez écrire du HTML directement : const element = <h1>Texte</h1>;",
    help_steps: [
      "Le JSX ressemble à du HTML mais vit dans du JavaScript",
      "Écrivez : const element = <h1>Bonjour React</h1>;",
    ],
  },
  {
    id: "react_5",
    type: "code",
    category: "JSX Fondamentaux",
    title: "JSX avec expressions",
    description: "Insérez une expression JavaScript dans du JSX.",
    instruction: "Créez une variable <code>name</code> avec la valeur <code>'Lyoko'</code>, puis un élément JSX <code>&lt;p&gt;</code> qui affiche <strong>Bienvenue, Lyoko !</strong> en utilisant des accolades <code>{}</code> pour insérer la variable.",
    code_template: `const name = 'Lyoko';
const element = `,
    solution: `const name = 'Lyoko';
const element = <p>Bienvenue, {name} !</p>;`,
    tests: [
      { type: "contains", expected: "const name" },
      { type: "contains", expected: "{name}" },
      { type: "contains", expected: "<p>" },
    ],
    hint: "En JSX, utilisez {expression} pour insérer du JavaScript dans le HTML.",
    help_steps: [
      "Les accolades {} permettent d'insérer n'importe quelle expression JS dans du JSX",
      "Écrivez : const element = <p>Bienvenue, {name} !</p>;",
    ],
  },
  // === COMPOSANTS FONCTIONNELS (6-10) ===
  {
    id: "react_6",
    type: "intro",
    category: "Composants",
    title: "Les composants React",
    description: "Les composants sont les briques fondamentales de toute application React.",
    content: `<h3>🧩 Composants — Les briques de React</h3>
<p>Un composant React est une <strong>fonction JavaScript</strong> qui retourne du JSX.</p>
<pre><code>function Welcome() {
  return &lt;h1&gt;Bonjour !&lt;/h1&gt;;
}</code></pre>
<p>Règles importantes :</p>
<ul>
<li>Le nom d'un composant commence toujours par une <strong>majuscule</strong></li>
<li>Un composant retourne un <strong>seul élément racine</strong> (ou un Fragment <code>&lt;&gt;...&lt;/&gt;</code>)</li>
<li>Les composants sont <strong>réutilisables</strong> — utilisez-les comme des balises HTML : <code>&lt;Welcome /&gt;</code></li>
</ul>`,
  },
  {
    id: "react_7",
    type: "code",
    category: "Composants",
    title: "Créer un composant",
    description: "Créez votre premier composant fonctionnel React.",
    instruction: "Créez un composant fonctionnel <code>Header</code> qui retourne un <code>&lt;header&gt;</code> contenant un <code>&lt;h1&gt;</code> avec le texte <strong>Projet Carthage</strong>.",
    code_template: `function Header() {
  // Retournez un header avec un h1
}`,
    solution: `function Header() {
  return (
    <header>
      <h1>Projet Carthage</h1>
    </header>
  );
}`,
    tests: [
      { type: "contains", expected: "function Header" },
      { type: "contains", expected: "return" },
      { type: "contains", expected: "<header>" },
      { type: "contains", expected: "<h1>" },
      { type: "contains", expected: "Projet Carthage" },
    ],
    hint: "Un composant est une fonction qui retourne du JSX avec return().",
    help_steps: [
      "Utilisez return() avec des parenthèses pour du JSX multi-lignes",
      "Imbriquez <h1> dans <header>",
    ],
  },
  {
    id: "react_8",
    type: "quiz",
    category: "Composants",
    title: "Nom de composant",
    description: "Quelle est la convention de nommage des composants React ?",
    options: [
      "Tout en minuscules : mycomponent",
      "camelCase : myComponent",
      "PascalCase : MyComponent",
      "snake_case : my_component",
    ],
    correct: 2,
    explanation: "Les composants React doivent commencer par une majuscule (PascalCase). React distingue les éléments HTML natifs (minuscules) des composants personnalisés (majuscules).",
  },
  {
    id: "react_9",
    type: "puzzle",
    category: "Composants",
    title: "Assemblez un composant",
    description: "Remettez dans l'ordre les morceaux pour former un composant React valide.",
    pieces: [
      "function Card() {",
      "  return (",
      "    <div className=\"card\">",
      "      <h2>Titre</h2>",
      "    </div>",
      "  );",
      "}",
    ],
  },
  {
    id: "react_10",
    type: "code",
    category: "Composants",
    title: "Composant avec Fragment",
    description: "Utilisez un Fragment pour retourner plusieurs éléments.",
    instruction: "Créez un composant <code>UserInfo</code> qui retourne un <code>&lt;h2&gt;</code> avec <strong>Aelita</strong> et un <code>&lt;p&gt;</code> avec <strong>Gardienne de Lyoko</strong>, enveloppés dans un Fragment <code>&lt;&gt;...&lt;/&gt;</code>.",
    code_template: `function UserInfo() {
  return (

  );
}`,
    solution: `function UserInfo() {
  return (
    <>
      <h2>Aelita</h2>
      <p>Gardienne de Lyoko</p>
    </>
  );
}`,
    tests: [
      { type: "contains", expected: "<>" },
      { type: "contains", expected: "</>" },
      { type: "contains", expected: "Aelita" },
      { type: "contains", expected: "Gardienne de Lyoko" },
    ],
    hint: "Les Fragments <> </> permettent de grouper des éléments sans ajouter de nœud DOM.",
  },
  // === PROPS (11-15) ===
  {
    id: "react_11",
    type: "intro",
    category: "Props",
    title: "Les Props",
    description: "Les props permettent de passer des données à un composant.",
    content: `<h3>📦 Props — Passer des données aux composants</h3>
<p>Les <strong>props</strong> (propriétés) sont des arguments passés aux composants React.</p>
<pre><code>function Welcome({ name }) {
  return &lt;h1&gt;Bonjour, {name} !&lt;/h1&gt;;
}

// Utilisation :
&lt;Welcome name="Jérémie" /&gt;</code></pre>
<p>Les props sont :</p>
<ul>
<li><strong>En lecture seule</strong> — un composant ne modifie jamais ses propres props</li>
<li><strong>Typables</strong> — avec TypeScript, on peut définir les types attendus</li>
<li><strong>Déstructurables</strong> — on extrait les valeurs dans les paramètres de la fonction</li>
</ul>`,
  },
  {
    id: "react_12",
    type: "code",
    category: "Props",
    title: "Composant avec props",
    description: "Créez un composant qui accepte des props.",
    instruction: "Créez un composant <code>Greeting</code> qui accepte une prop <code>name</code> et retourne un <code>&lt;h1&gt;</code> affichant <strong>Bonjour, {name} !</strong>.",
    code_template: `function Greeting({ name }) {
  // Retournez un h1 avec le message
}`,
    solution: `function Greeting({ name }) {
  return <h1>Bonjour, {name} !</h1>;
}`,
    tests: [
      { type: "contains", expected: "function Greeting" },
      { type: "contains", expected: "{name}" },
      { type: "contains", expected: "return" },
      { type: "contains", expected: "Bonjour" },
    ],
    hint: "Déstructurez la prop dans les paramètres : ({ name }) puis utilisez {name} dans le JSX.",
  },
  {
    id: "react_13",
    type: "code",
    category: "Props",
    title: "Props multiples",
    description: "Passez plusieurs props à un composant.",
    instruction: "Créez un composant <code>UserCard</code> qui accepte <code>name</code> et <code>level</code> et retourne un <code>&lt;div&gt;</code> contenant un <code>&lt;h3&gt;</code> avec le nom et un <code>&lt;p&gt;</code> avec <strong>Niveau: {level}</strong>.",
    code_template: `function UserCard({ name, level }) {
  return (
    <div>

    </div>
  );
}`,
    solution: `function UserCard({ name, level }) {
  return (
    <div>
      <h3>{name}</h3>
      <p>Niveau: {level}</p>
    </div>
  );
}`,
    tests: [
      { type: "contains", expected: "{name}" },
      { type: "contains", expected: "{level}" },
      { type: "contains", expected: "Niveau:" },
      { type: "contains", expected: "<h3>" },
    ],
    hint: "Déstructurez { name, level } et utilisez-les dans le JSX avec des accolades.",
  },
  {
    id: "react_14",
    type: "quiz",
    category: "Props",
    title: "Props en lecture seule",
    description: "Peut-on modifier les props dans un composant ?",
    options: [
      "Oui, on peut les modifier librement avec props.name = 'nouveau'",
      "Non, les props sont en lecture seule (read-only)",
      "Oui, mais seulement avec this.props.name = 'nouveau'",
      "Oui, avec la méthode props.set('name', 'nouveau')",
    ],
    correct: 1,
    explanation: "Les props sont immuables. Un composant ne doit jamais modifier ses propres props. Pour des données modifiables, on utilise le state (useState).",
  },
  {
    id: "react_15",
    type: "code",
    category: "Props",
    title: "Props avec valeur par défaut",
    description: "Donnez une valeur par défaut à une prop.",
    instruction: "Créez un composant <code>Badge</code> qui accepte <code>color</code> avec une valeur par défaut <code>'blue'</code> et retourne un <code>&lt;span&gt;</code> avec <code>className</code> égal à <code>badge-{color}</code> et le texte <strong>Badge</strong>.",
    code_template: `function Badge({ color = 'blue' }) {
  return (

  );
}`,
    solution: `function Badge({ color = 'blue' }) {
  return (
    <span className={\`badge-\${color}\`}>Badge</span>
  );
}`,
    tests: [
      { type: "contains", expected: "color = 'blue'" },
      { type: "contains", expected: "className" },
      { type: "contains", expected: "Badge" },
      { type: "contains", expected: "<span" },
    ],
    hint: "Utilisez les template literals avec `` et ${} pour construire le className dynamiquement.",
  },
  // === RENDU CONDITIONNEL & LISTES (16-20) ===
  {
    id: "react_16",
    type: "intro",
    category: "Rendu conditionnel",
    title: "Affichage conditionnel",
    description: "React permet d'afficher différents éléments selon des conditions.",
    content: `<h3>🔀 Rendu conditionnel en React</h3>
<p>Plusieurs façons d'afficher du contenu conditionnellement :</p>
<pre><code>// Opérateur ternaire
{isLoggedIn ? &lt;Dashboard /&gt; : &lt;Login /&gt;}

// Opérateur && (court-circuit)
{hasNotif && &lt;NotifBadge /&gt;}

// if/else classique dans le corps de la fonction
if (loading) return &lt;Spinner /&gt;;
return &lt;Content /&gt;;</code></pre>`,
  },
  {
    id: "react_17",
    type: "code",
    category: "Rendu conditionnel",
    title: "Ternaire dans le JSX",
    description: "Utilisez l'opérateur ternaire pour un rendu conditionnel.",
    instruction: "Créez un composant <code>Status</code> qui accepte <code>isOnline</code> (boolean) et retourne un <code>&lt;span&gt;</code> affichant <strong>En ligne</strong> si <code>isOnline</code> est vrai, sinon <strong>Hors ligne</strong>.",
    code_template: `function Status({ isOnline }) {
  return (
    <span>
      {/* Utilisez un ternaire ici */}
    </span>
  );
}`,
    solution: `function Status({ isOnline }) {
  return (
    <span>
      {isOnline ? "En ligne" : "Hors ligne"}
    </span>
  );
}`,
    tests: [
      { type: "contains", expected: "isOnline" },
      { type: "contains", expected: "?" },
      { type: "contains", expected: ":" },
      { type: "contains", expected: "En ligne" },
      { type: "contains", expected: "Hors ligne" },
    ],
    hint: "La syntaxe ternaire : {condition ? 'si vrai' : 'si faux'}",
  },
  {
    id: "react_18",
    type: "code",
    category: "Rendu conditionnel",
    title: "Opérateur && (et logique)",
    description: "Affichez un élément uniquement si une condition est vraie.",
    instruction: "Créez un composant <code>Alert</code> qui accepte <code>message</code> (string ou null) et affiche un <code>&lt;div className=\"alert\"&gt;</code> avec le message <strong>uniquement si message est truthy</strong>.",
    code_template: `function Alert({ message }) {
  return (
    <div>
      {/* Affichez l'alerte seulement si message existe */}
    </div>
  );
}`,
    solution: `function Alert({ message }) {
  return (
    <div>
      {message && <div className="alert">{message}</div>}
    </div>
  );
}`,
    tests: [
      { type: "contains", expected: "message &&" },
      { type: "contains", expected: "className=\"alert\"" },
      { type: "contains", expected: "{message}" },
    ],
    hint: "L'opérateur && : {condition && <Element />} — n'affiche l'élément que si la condition est truthy.",
  },
  {
    id: "react_19",
    type: "code",
    category: "Listes & Keys",
    title: "Afficher une liste avec map",
    description: "Utilisez .map() pour rendre une liste d'éléments.",
    instruction: "Créez un composant <code>WarriorList</code> qui contient un tableau <code>warriors</code> = <code>['Ulrich', 'Yumi', 'Odd', 'Aelita']</code> et retourne un <code>&lt;ul&gt;</code> avec un <code>&lt;li key={name}&gt;</code> pour chaque guerrier.",
    code_template: `function WarriorList() {
  const warriors = ['Ulrich', 'Yumi', 'Odd', 'Aelita'];
  return (
    <ul>
      {/* Mappez le tableau ici */}
    </ul>
  );
}`,
    solution: `function WarriorList() {
  const warriors = ['Ulrich', 'Yumi', 'Odd', 'Aelita'];
  return (
    <ul>
      {warriors.map((name) => (
        <li key={name}>{name}</li>
      ))}
    </ul>
  );
}`,
    tests: [
      { type: "contains", expected: ".map(" },
      { type: "contains", expected: "key={" },
      { type: "contains", expected: "<li" },
      { type: "contains", expected: "Ulrich" },
    ],
    hint: "Utilisez array.map(item => <li key={item}>{item}</li>) pour transformer un tableau en liste JSX.",
  },
  {
    id: "react_20",
    type: "quiz",
    category: "Listes & Keys",
    title: "Pourquoi les keys ?",
    description: "Pourquoi React a besoin de l'attribut key sur les éléments d'une liste ?",
    options: [
      "Pour le style CSS de chaque élément",
      "Pour identifier de manière unique chaque élément et optimiser le re-rendu",
      "C'est obligatoire en HTML standard",
      "Pour trier automatiquement les éléments",
    ],
    correct: 1,
    explanation: "Les keys aident React à identifier quels éléments ont changé, été ajoutés ou supprimés. Elles doivent être uniques parmi les éléments frères pour permettre un re-rendu efficace via le Virtual DOM.",
  },
];

addExercises("react", exercises);
