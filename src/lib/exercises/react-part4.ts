import { addExercises } from ".";
import type { Exercise } from "@/app/exercises/[module]/exercise-client";

const exercises: Exercise[] = [
  // === REACT ROUTER (1-5) ===
  {
    id: "react_61",
    type: "intro",
    category: "React Router",
    title: "Navigation avec React Router",
    description: "React Router permet de créer des applications multi-pages (SPA) avec React.",
    content: `<h3>🗺️ React Router — Navigation SPA</h3>
<p>React Router transforme votre app en <strong>Single Page Application</strong> avec navigation côté client.</p>
<pre><code>import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    &lt;BrowserRouter&gt;
      &lt;nav&gt;
        &lt;Link to="/"&gt;Accueil&lt;/Link&gt;
        &lt;Link to="/about"&gt;À propos&lt;/Link&gt;
      &lt;/nav&gt;
      &lt;Routes&gt;
        &lt;Route path="/" element={&lt;Home /&gt;} /&gt;
        &lt;Route path="/about" element={&lt;About /&gt;} /&gt;
        &lt;Route path="/user/:id" element={&lt;User /&gt;} /&gt;
      &lt;/Routes&gt;
    &lt;/BrowserRouter&gt;
  );
}</code></pre>`,
  },
  {
    id: "react_62",
    type: "code",
    category: "React Router",
    title: "Routes de base",
    description: "Configurez des routes simples avec React Router.",
    instruction: "Créez un composant <code>App</code> avec <code>BrowserRouter</code>, <code>Routes</code> et deux <code>Route</code> : <code>/</code> pour <code>&lt;Home /&gt;</code> et <code>/dashboard</code> pour <code>&lt;Dashboard /&gt;</code>. Ajoutez des <code>Link</code> de navigation.",
    code_template: `import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    // Configurez le routeur
  );
}`,
    solution: `import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Accueil</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}`,
    tests: [
      { type: "contains", expected: "<BrowserRouter>" },
      { type: "contains", expected: "<Routes>" },
      { type: "contains", expected: "<Route path=\"/\"" },
      { type: "contains", expected: "<Link to=" },
    ],
    hint: "BrowserRouter > nav avec Link + Routes avec Route path='...' element={<Composant />}",
  },
  {
    id: "react_63",
    type: "code",
    category: "React Router",
    title: "Route dynamique avec useParams",
    description: "Lisez les paramètres d'URL avec useParams.",
    instruction: "Créez un composant <code>UserProfile</code> qui utilise <code>useParams()</code> pour extraire un paramètre <code>id</code> de l'URL et affiche <strong>Profil utilisateur #{id}</strong> dans un <code>&lt;h1&gt;</code>.",
    code_template: `import { useParams } from 'react-router-dom';

function UserProfile() {
  // Extrayez le paramètre id
  return <h1>Profil utilisateur #{/* id */}</h1>;
}`,
    solution: `import { useParams } from 'react-router-dom';

function UserProfile() {
  const { id } = useParams();
  return <h1>Profil utilisateur #{id}</h1>;
}`,
    tests: [
      { type: "contains", expected: "useParams()" },
      { type: "contains", expected: "{ id }" },
      { type: "contains", expected: "{id}" },
    ],
    hint: "const { id } = useParams() extrait le :id défini dans la route.",
  },
  {
    id: "react_64",
    type: "code",
    category: "React Router",
    title: "Navigation programmatique",
    description: "Naviguez avec useNavigate.",
    instruction: "Créez un composant <code>LoginButton</code> qui utilise <code>useNavigate()</code> pour rediriger vers <code>/dashboard</code> quand on clique sur le bouton <strong>Se connecter</strong>.",
    code_template: `import { useNavigate } from 'react-router-dom';

function LoginButton() {
  // Utilisez useNavigate
  return <button>Se connecter</button>;
}`,
    solution: `import { useNavigate } from 'react-router-dom';

function LoginButton() {
  const navigate = useNavigate();
  return <button onClick={() => navigate('/dashboard')}>Se connecter</button>;
}`,
    tests: [
      { type: "contains", expected: "useNavigate()" },
      { type: "contains", expected: "navigate('/dashboard')" },
      { type: "contains", expected: "onClick" },
    ],
    hint: "const navigate = useNavigate(); puis navigate('/path') au clic.",
  },
  {
    id: "react_65",
    type: "quiz",
    category: "React Router",
    title: "Link vs balise <a>",
    description: "Pourquoi utiliser Link au lieu d'une balise <a> ?",
    options: [
      "Link a un meilleur style par défaut",
      "Link empêche le rechargement complet de la page et fait une navigation côté client",
      "Link est obligatoire, les balises <a> ne fonctionnent pas en React",
      "Link charge les pages plus rapidement depuis le serveur",
    ],
    correct: 1,
    explanation: "Link utilise l'API History du navigateur pour naviguer sans recharger la page. Cela préserve le state de l'application, évite de re-télécharger les ressources, et offre une navigation instantanée.",
  },
  // === GESTION D'ÉTAT AVANCÉE (6-10) ===
  {
    id: "react_66",
    type: "intro",
    category: "useReducer",
    title: "Le Hook useReducer",
    description: "useReducer est une alternative à useState pour les logiques d'état complexes.",
    content: `<h3>🎛️ useReducer — État structuré</h3>
<p><code>useReducer</code> fonctionne comme Redux : <strong>action → reducer → nouvel état</strong>.</p>
<pre><code>function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT': return { count: state.count + 1 };
    case 'DECREMENT': return { count: state.count - 1 };
    case 'RESET': return { count: 0 };
    default: return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return (
    &lt;&gt;
      &lt;p&gt;{state.count}&lt;/p&gt;
      &lt;button onClick={() =&gt; dispatch({ type: 'INCREMENT' })}&gt;+&lt;/button&gt;
    &lt;/&gt;
  );
}</code></pre>`,
  },
  {
    id: "react_67",
    type: "code",
    category: "useReducer",
    title: "Compteur avec useReducer",
    description: "Implémentez un compteur avec useReducer.",
    instruction: "Créez un <code>reducer</code> qui gère les actions <code>INCREMENT</code>, <code>DECREMENT</code> et <code>RESET</code>. Puis un composant <code>Counter</code> qui utilise <code>useReducer</code> avec un state initial <code>{ count: 0 }</code>.",
    code_template: `import { useReducer } from 'react';

function reducer(state, action) {
  // Gérez INCREMENT, DECREMENT, RESET
}

function Counter() {
  // useReducer + boutons
}`,
    solution: `import { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT': return { count: state.count + 1 };
    case 'DECREMENT': return { count: state.count - 1 };
    case 'RESET': return { count: 0 };
    default: return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <div>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </div>
  );
}`,
    tests: [
      { type: "contains", expected: "switch (action.type)" },
      { type: "contains", expected: "useReducer(reducer" },
      { type: "contains", expected: "dispatch({ type:" },
      { type: "contains", expected: "INCREMENT" },
      { type: "contains", expected: "DECREMENT" },
    ],
    hint: "Un reducer est un switch/case sur action.type qui retourne le nouvel état.",
  },
  {
    id: "react_68",
    type: "code",
    category: "useReducer",
    title: "Todo reducer",
    description: "Gérez une liste de todos avec useReducer.",
    instruction: "Créez un reducer pour des todos qui gère <code>ADD_TODO</code> (ajoute au tableau) et <code>TOGGLE_TODO</code> (bascule le champ <code>done</code> d'un todo par son <code>id</code>).",
    code_template: `function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      // Ajoutez le todo depuis action.payload
    case 'TOGGLE_TODO':
      // Basculez done pour l'id action.payload
    default:
      return state;
  }
}`,
    solution: `function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, action.payload];
    case 'TOGGLE_TODO':
      return state.map(todo =>
        todo.id === action.payload ? { ...todo, done: !todo.done } : todo
      );
    default:
      return state;
  }
}`,
    tests: [
      { type: "contains", expected: "case 'ADD_TODO'" },
      { type: "contains", expected: "[...state, action.payload]" },
      { type: "contains", expected: "case 'TOGGLE_TODO'" },
      { type: "contains", expected: "...todo, done: !todo.done" },
    ],
    hint: "ADD: [...state, newItem]. TOGGLE: state.map() avec spread sur le todo ciblé.",
  },
  {
    id: "react_69",
    type: "quiz",
    category: "useReducer",
    title: "useState vs useReducer",
    description: "Quand préférer useReducer à useState ?",
    options: [
      "Toujours, useReducer est plus performant",
      "Quand le state a une logique de mise à jour complexe avec plusieurs sous-valeurs",
      "Uniquement pour les nombres et compteurs",
      "Quand on utilise TypeScript",
    ],
    correct: 1,
    explanation: "useReducer est préférable quand : le state est un objet complexe, les mises à jour dépendent de l'état précédent, ou il y a beaucoup d'actions différentes. Pour un state simple (string, boolean, number), useState suffit.",
  },
  {
    id: "react_70",
    type: "code",
    category: "useReducer",
    title: "Reducer + Context",
    description: "Combinez useReducer avec Context pour un état global.",
    instruction: "Créez un <code>AppContext</code> et un <code>AppProvider</code> qui combine <code>useReducer</code> avec <code>Context.Provider</code> pour partager <code>state</code> et <code>dispatch</code> globalement.",
    code_template: `import { createContext, useReducer } from 'react';

const AppContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER': return { ...state, user: action.payload };
    default: return state;
  }
}

function AppProvider({ children }) {
  // Combinez useReducer + Provider
}`,
    solution: `import { createContext, useReducer } from 'react';

const AppContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER': return { ...state, user: action.payload };
    default: return state;
  }
}

function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { user: null });

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}`,
    tests: [
      { type: "contains", expected: "useReducer(reducer" },
      { type: "contains", expected: "AppContext.Provider" },
      { type: "contains", expected: "value={{ state, dispatch }}" },
      { type: "contains", expected: "{children}" },
    ],
    hint: "useReducer fournit [state, dispatch], passez les deux dans la value du Provider.",
  },
  // === SUSPENSE & ERROR BOUNDARIES (11-14) ===
  {
    id: "react_71",
    type: "intro",
    category: "Suspense",
    title: "React Suspense",
    description: "Suspense permet de gérer le chargement asynchrone de composants.",
    content: `<h3>⏳ Suspense — Chargement élégant</h3>
<p><code>Suspense</code> affiche un fallback pendant le chargement :</p>
<pre><code>import { Suspense, lazy } from 'react';

// Chargement paresseux (code splitting)
const Dashboard = lazy(() => import('./Dashboard'));

function App() {
  return (
    &lt;Suspense fallback={&lt;Spinner /&gt;}&gt;
      &lt;Dashboard /&gt;
    &lt;/Suspense&gt;
  );
}</code></pre>
<p>Avantages :</p>
<ul>
<li><strong>Code splitting</strong> — charge les composants à la demande</li>
<li><strong>UX améliorée</strong> — affiche un indicateur de chargement</li>
<li><strong>Data fetching</strong> — avec les frameworks (Next.js, Remix)</li>
</ul>`,
  },
  {
    id: "react_72",
    type: "code",
    category: "Suspense",
    title: "Lazy loading avec Suspense",
    description: "Chargez un composant de manière paresseuse.",
    instruction: "Utilisez <code>React.lazy()</code> pour importer dynamiquement un composant <code>HeavyChart</code> depuis <code>'./HeavyChart'</code>. Enveloppez-le dans <code>Suspense</code> avec un fallback <code>&lt;p&gt;Chargement du graphique...&lt;/p&gt;</code>.",
    code_template: `import { Suspense, lazy } from 'react';

// Import paresseux du composant

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      {/* Suspense + composant lazy */}
    </div>
  );
}`,
    solution: `import { Suspense, lazy } from 'react';

const HeavyChart = lazy(() => import('./HeavyChart'));

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<p>Chargement du graphique...</p>}>
        <HeavyChart />
      </Suspense>
    </div>
  );
}`,
    tests: [
      { type: "contains", expected: "lazy(() => import(" },
      { type: "contains", expected: "<Suspense fallback={" },
      { type: "contains", expected: "<HeavyChart" },
      { type: "contains", expected: "Chargement" },
    ],
    hint: "const Component = lazy(() => import('./path')); puis <Suspense fallback={...}><Component /></Suspense>",
  },
  {
    id: "react_73",
    type: "quiz",
    category: "Suspense",
    title: "Error Boundaries",
    description: "Comment gérer les erreurs de rendu en React ?",
    options: [
      "Avec un try/catch dans le JSX",
      "Avec un composant Error Boundary (componentDidCatch / getDerivedStateFromError)",
      "Avec useEffect et un state d'erreur",
      "Les erreurs sont automatiquement gérées par React",
    ],
    correct: 1,
    explanation: "Les Error Boundaries sont des composants de classe qui utilisent componentDidCatch ou getDerivedStateFromError pour attraper les erreurs pendant le rendu. Les try/catch ne fonctionnent pas pour les erreurs de rendu JSX.",
  },
  {
    id: "react_74",
    type: "code",
    category: "Suspense",
    title: "Error Boundary basique",
    description: "Créez un composant Error Boundary.",
    instruction: "Créez un composant de classe <code>ErrorBoundary</code> avec <code>getDerivedStateFromError</code> qui met <code>hasError</code> à true, et un rendu conditionnel qui affiche <strong>Quelque chose s'est mal passé</strong> en cas d'erreur, sinon affiche <code>this.props.children</code>.",
    code_template: `import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // getDerivedStateFromError + render
}`,
    solution: `import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <p>Quelque chose s'est mal passé</p>;
    }
    return this.props.children;
  }
}`,
    tests: [
      { type: "contains", expected: "getDerivedStateFromError" },
      { type: "contains", expected: "hasError: true" },
      { type: "contains", expected: "this.state.hasError" },
      { type: "contains", expected: "this.props.children" },
    ],
    hint: "getDerivedStateFromError retourne le nouvel état. Dans render(), affichez un fallback si hasError est true.",
  },
  // === TYPESCRIPT AVEC REACT (15-17) ===
  {
    id: "react_75",
    type: "intro",
    category: "TypeScript",
    title: "React + TypeScript",
    description: "TypeScript apporte la sécurité des types à vos composants React.",
    content: `<h3>🔒 TypeScript — React typé</h3>
<pre><code>// Typer les props
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return &lt;button className={variant} onClick={onClick}&gt;{label}&lt;/button&gt;;
}

// Typer le state
const [count, setCount] = useState&lt;number&gt;(0);
const [user, setUser] = useState&lt;User | null&gt;(null);

// Typer les events
const handleChange = (e: React.ChangeEvent&lt;HTMLInputElement&gt;) => {
  setQuery(e.target.value);
};</code></pre>`,
  },
  {
    id: "react_76",
    type: "code",
    category: "TypeScript",
    title: "Props typées",
    description: "Définissez une interface pour les props d'un composant.",
    instruction: "Créez une interface <code>AvatarProps</code> avec <code>src</code> (string), <code>alt</code> (string) et <code>size</code> (number, optionnel, défaut 40). Créez un composant <code>Avatar</code> typé qui retourne une <code>&lt;img&gt;</code>.",
    code_template: `// Interface pour les props

function Avatar(/* props typées */) {
  return <img />;
}`,
    solution: `interface AvatarProps {
  src: string;
  alt: string;
  size?: number;
}

function Avatar({ src, alt, size = 40 }: AvatarProps) {
  return <img src={src} alt={alt} width={size} height={size} />;
}`,
    tests: [
      { type: "contains", expected: "interface AvatarProps" },
      { type: "contains", expected: "src: string" },
      { type: "contains", expected: "size?: number" },
      { type: "contains", expected: ": AvatarProps" },
    ],
    hint: "Définissez l'interface, puis typez les props : function Component({ ... }: Interface) { ... }",
  },
  {
    id: "react_77",
    type: "code",
    category: "TypeScript",
    title: "Événements typés",
    description: "Typez les gestionnaires d'événements.",
    instruction: "Créez un composant <code>SearchInput</code> avec un input. Typez le gestionnaire <code>onChange</code> avec <code>React.ChangeEvent&lt;HTMLInputElement&gt;</code> et le <code>onSubmit</code> du formulaire avec <code>React.FormEvent&lt;HTMLFormElement&gt;</code>.",
    code_template: `import { useState } from 'react';

function SearchInput() {
  const [query, setQuery] = useState('');

  // Typez les handlers

  return (
    <form>
      <input value={query} />
    </form>
  );
}`,
    solution: `import { useState } from 'react';

function SearchInput() {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(query);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={query} onChange={handleChange} />
    </form>
  );
}`,
    tests: [
      { type: "contains", expected: "React.ChangeEvent<HTMLInputElement>" },
      { type: "contains", expected: "React.FormEvent<HTMLFormElement>" },
      { type: "contains", expected: "e.preventDefault()" },
    ],
    hint: "ChangeEvent<HTMLInputElement> pour les inputs, FormEvent<HTMLFormElement> pour les forms.",
  },
  // === PROJET FINAL (18-20) ===
  {
    id: "react_78",
    type: "code",
    category: "Projet",
    title: "Composant Card complet",
    description: "Créez un composant Card réutilisable et stylé.",
    instruction: "Créez un composant <code>ExerciseCard</code> qui accepte <code>title</code>, <code>description</code>, <code>difficulty</code> ('easy'|'medium'|'hard') et <code>completed</code> (boolean). Affichez un badge de difficulté coloré et une icône de complétion.",
    code_template: `const COLORS = { easy: 'green', medium: 'orange', hard: 'red' };

function ExerciseCard({ title, description, difficulty, completed }) {
  return (
    // Carte complète
  );
}`,
    solution: `const COLORS = { easy: 'green', medium: 'orange', hard: 'red' };

function ExerciseCard({ title, description, difficulty, completed }) {
  return (
    <div className="card">
      <div className="card-header">
        <h3>{title}</h3>
        {completed && <span className="check">✓</span>}
      </div>
      <p>{description}</p>
      <span style={{ color: COLORS[difficulty] }}>
        {difficulty.toUpperCase()}
      </span>
    </div>
  );
}`,
    tests: [
      { type: "contains", expected: "{title}" },
      { type: "contains", expected: "{description}" },
      { type: "contains", expected: "completed" },
      { type: "contains", expected: "COLORS[difficulty]" },
    ],
    hint: "Utilisez COLORS[difficulty] pour la couleur dynamique et un rendu conditionnel pour le check.",
  },
  {
    id: "react_79",
    type: "code",
    category: "Projet",
    title: "Hook useExercises",
    description: "Créez un hook personnalisé pour gérer les exercices.",
    instruction: "Créez un hook <code>useExercises</code> qui gère un tableau d'exercices, un index courant, et expose <code>{ current, next, prev, total, index }</code>.",
    code_template: `import { useState } from 'react';

function useExercises(exercises) {
  // Gérez l'index et exposez les méthodes
}`,
    solution: `import { useState } from 'react';

function useExercises(exercises) {
  const [index, setIndex] = useState(0);

  const current = exercises[index];
  const total = exercises.length;
  const next = () => setIndex(i => Math.min(i + 1, total - 1));
  const prev = () => setIndex(i => Math.max(i - 1, 0));

  return { current, next, prev, total, index };
}`,
    tests: [
      { type: "contains", expected: "function useExercises" },
      { type: "contains", expected: "useState(0)" },
      { type: "contains", expected: "exercises[index]" },
      { type: "contains", expected: "Math.min" },
      { type: "contains", expected: "Math.max" },
    ],
    hint: "Gérez un index avec useState, limitez avec Math.min/max, retournez un objet avec les méthodes.",
  },
  {
    id: "react_80",
    type: "quiz",
    category: "Projet",
    title: "Récapitulatif React",
    description: "Testez vos connaissances globales sur React.",
    options: [
      "React est un framework full-stack qui gère le frontend et le backend",
      "Les hooks ne peuvent être utilisés que dans les composants de classe",
      "React utilise un Virtual DOM pour optimiser les mises à jour du DOM réel",
      "En React, on modifie directement le DOM avec document.querySelector",
    ],
    correct: 2,
    explanation: "React maintient un Virtual DOM (une copie légère du DOM réel) pour calculer les différences (diffing) et appliquer uniquement les changements nécessaires au DOM réel (reconciliation). C'est ce qui rend React performant.",
  },
];

addExercises("react", exercises);
