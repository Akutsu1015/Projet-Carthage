import { addExercises } from ".";
import type { Exercise } from "@/app/exercises/[module]/exercise-client";

const exercises: Exercise[] = [
  // === useRef (1-4) ===
  {
    id: "react_41",
    type: "intro",
    category: "useRef",
    title: "Le Hook useRef",
    description: "useRef permet de stocker une valeur mutable qui persiste entre les rendus.",
    content: `<h3>📌 useRef — Référence persistante</h3>
<p><code>useRef</code> crée un objet <code>{ current: valeur }</code> qui persiste entre les rendus <strong>sans déclencher de re-rendu</strong>.</p>
<pre><code>// Référence à un élément DOM
const inputRef = useRef(null);
&lt;input ref={inputRef} /&gt;
inputRef.current.focus(); // focus l'input

// Stocker une valeur mutable
const countRef = useRef(0);
countRef.current++; // pas de re-rendu</code></pre>
<p>Cas d'usage typiques :</p>
<ul>
<li>Accéder à un <strong>élément DOM</strong> (focus, scroll, mesure)</li>
<li>Stocker un <strong>timer ID</strong> (setInterval/setTimeout)</li>
<li>Conserver une <strong>valeur précédente</strong> sans re-rendu</li>
</ul>`,
  },
  {
    id: "react_42",
    type: "code",
    category: "useRef",
    title: "Focus un input avec useRef",
    description: "Utilisez useRef pour donner le focus à un champ de saisie.",
    instruction: "Créez un composant <code>AutoFocus</code> avec un <code>useRef</code>. Au montage (<code>useEffect</code> + <code>[]</code>), donnez le focus à l'input via <code>inputRef.current.focus()</code>.",
    code_template: `import { useRef, useEffect } from 'react';

function AutoFocus() {
  // Créez la ref et focusez au montage

  return <input ref={/* ref ici */} placeholder="Auto-focus" />;
}`,
    solution: `import { useRef, useEffect } from 'react';

function AutoFocus() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return <input ref={inputRef} placeholder="Auto-focus" />;
}`,
    tests: [
      { type: "contains", expected: "useRef(null)" },
      { type: "contains", expected: "inputRef.current.focus()" },
      { type: "contains", expected: "ref={inputRef}" },
      { type: "contains", expected: "useEffect" },
    ],
    hint: "useRef(null) crée la ref, attachez-la avec ref={inputRef}, puis .current.focus() dans useEffect.",
  },
  {
    id: "react_43",
    type: "quiz",
    category: "useRef",
    title: "useRef vs useState",
    description: "Quelle est la différence majeure entre useRef et useState ?",
    options: [
      "useRef est plus rapide que useState",
      "Modifier useRef.current ne provoque pas de re-rendu, contrairement à useState",
      "useRef ne peut stocker que des éléments DOM",
      "useState est déprécié en faveur de useRef",
    ],
    correct: 1,
    explanation: "La différence clé est que modifier ref.current ne déclenche PAS de re-rendu, tandis que setState provoque un re-rendu. useRef est idéal pour les valeurs qui changent fréquemment sans affecter le rendu visuel.",
  },
  {
    id: "react_44",
    type: "code",
    category: "useRef",
    title: "Stocker la valeur précédente",
    description: "Utilisez useRef pour garder trace de la valeur précédente du state.",
    instruction: "Créez un composant <code>PreviousValue</code> avec un state <code>count</code> et une ref <code>prevCountRef</code>. Utilisez <code>useEffect</code> pour stocker la valeur précédente après chaque rendu. Affichez <strong>Actuel: {count}, Précédent: {prevCountRef.current}</strong>.",
    code_template: `import { useState, useEffect, useRef } from 'react';

function PreviousValue() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef(0);

  // Stockez la valeur précédente dans useEffect

  return (
    <div>
      <p>Actuel: {count}, Précédent: {prevCountRef.current}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}`,
    solution: `import { useState, useEffect, useRef } from 'react';

function PreviousValue() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef(0);

  useEffect(() => {
    prevCountRef.current = count;
  }, [count]);

  return (
    <div>
      <p>Actuel: {count}, Précédent: {prevCountRef.current}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}`,
    tests: [
      { type: "contains", expected: "useRef(0)" },
      { type: "contains", expected: "prevCountRef.current = count" },
      { type: "contains", expected: "[count]" },
    ],
    hint: "useEffect s'exécute APRÈS le rendu, donc prevCountRef.current affiche l'ancienne valeur pendant le rendu, puis est mis à jour.",
  },
  // === useContext (5-8) ===
  {
    id: "react_45",
    type: "intro",
    category: "useContext",
    title: "Le Hook useContext",
    description: "useContext permet de partager des données globales sans prop drilling.",
    content: `<h3>🌍 useContext — État global</h3>
<p>Le <strong>Context</strong> résout le problème du "prop drilling" — passer des props à travers de nombreux niveaux de composants.</p>
<pre><code>// 1. Créer le contexte
const ThemeContext = createContext('light');

// 2. Fournir la valeur (Provider)
&lt;ThemeContext.Provider value="dark"&gt;
  &lt;App /&gt;
&lt;/ThemeContext.Provider&gt;

// 3. Consommer la valeur (useContext)
function Button() {
  const theme = useContext(ThemeContext);
  return &lt;button className={theme}&gt;Click&lt;/button&gt;;
}</code></pre>`,
  },
  {
    id: "react_46",
    type: "code",
    category: "useContext",
    title: "Créer et utiliser un Context",
    description: "Implémentez un thème avec Context.",
    instruction: "Créez un <code>ThemeContext</code> avec <code>createContext('light')</code>. Puis créez un composant <code>ThemedButton</code> qui utilise <code>useContext(ThemeContext)</code> pour lire le thème et l'afficher dans un <code>&lt;button&gt;</code> : <strong>Thème: {theme}</strong>.",
    code_template: `import { createContext, useContext } from 'react';

// Créez le contexte

function ThemedButton() {
  // Consommez le contexte
  return <button>Thème: {/* thème ici */}</button>;
}`,
    solution: `import { createContext, useContext } from 'react';

const ThemeContext = createContext('light');

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button>Thème: {theme}</button>;
}`,
    tests: [
      { type: "contains", expected: "createContext(" },
      { type: "contains", expected: "useContext(ThemeContext)" },
      { type: "contains", expected: "Thème:" },
      { type: "contains", expected: "{theme}" },
    ],
    hint: "createContext(defaultValue) crée le contexte, useContext(Context) lit la valeur.",
  },
  {
    id: "react_47",
    type: "code",
    category: "useContext",
    title: "Provider avec state",
    description: "Créez un Provider qui partage un state modifiable.",
    instruction: "Créez un <code>UserContext</code> et un composant <code>UserProvider</code> qui englobe ses <code>children</code> avec un <code>UserContext.Provider</code>. Le provider gère un state <code>user</code> et expose <code>{ user, setUser }</code> via value.",
    code_template: `import { createContext, useState } from 'react';

const UserContext = createContext(null);

function UserProvider({ children }) {
  // State + Provider
}`,
    solution: `import { createContext, useState } from 'react';

const UserContext = createContext(null);

function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}`,
    tests: [
      { type: "contains", expected: "UserContext.Provider" },
      { type: "contains", expected: "value={{ user, setUser }}" },
      { type: "contains", expected: "{children}" },
      { type: "contains", expected: "useState(null)" },
    ],
    hint: "Le Provider enveloppe {children} et partage value={{ user, setUser }}.",
  },
  {
    id: "react_48",
    type: "quiz",
    category: "useContext",
    title: "Quand utiliser Context ?",
    description: "Quand le Context est-il recommandé ?",
    options: [
      "Pour toutes les props, même entre composants parent-enfant directs",
      "Pour des données globales : thème, authentification, langue",
      "Uniquement pour les couleurs CSS",
      "Pour remplacer complètement Redux/Zustand",
    ],
    correct: 1,
    explanation: "Context est idéal pour des données globales qui changent rarement (thème, auth, locale). Pour du state complexe avec beaucoup de mises à jour, des solutions comme Zustand ou Redux sont plus performantes.",
  },
  // === useMemo & useCallback (9-12) ===
  {
    id: "react_49",
    type: "intro",
    category: "Performance",
    title: "useMemo & useCallback",
    description: "Optimisez les performances avec la mémoïsation.",
    content: `<h3>⚡ Mémoïsation — Optimiser les performances</h3>
<p><code>useMemo</code> mémorise une <strong>valeur calculée</strong> :</p>
<pre><code>const sorted = useMemo(() => {
  return items.sort((a, b) => a - b);
}, [items]); // recalcule seulement si items change</code></pre>
<p><code>useCallback</code> mémorise une <strong>fonction</strong> :</p>
<pre><code>const handleClick = useCallback(() => {
  setCount(count + 1);
}, [count]); // nouvelle référence seulement si count change</code></pre>
<p>⚠️ N'optimisez pas prématurément ! Utilisez ces hooks uniquement quand le profiling montre un problème de performance.</p>`,
  },
  {
    id: "react_50",
    type: "code",
    category: "Performance",
    title: "useMemo pour calcul coûteux",
    description: "Mémorisez un calcul coûteux.",
    instruction: "Créez un composant <code>ExpensiveList</code> qui reçoit un tableau <code>items</code> et un <code>filter</code>. Utilisez <code>useMemo</code> pour filtrer les items uniquement quand <code>items</code> ou <code>filter</code> changent.",
    code_template: `import { useMemo } from 'react';

function ExpensiveList({ items, filter }) {
  // Mémorisez le filtrage

  return (
    <ul>
      {filtered.map(item => <li key={item}>{item}</li>)}
    </ul>
  );
}`,
    solution: `import { useMemo } from 'react';

function ExpensiveList({ items, filter }) {
  const filtered = useMemo(() => {
    return items.filter(item => item.includes(filter));
  }, [items, filter]);

  return (
    <ul>
      {filtered.map(item => <li key={item}>{item}</li>)}
    </ul>
  );
}`,
    tests: [
      { type: "contains", expected: "useMemo(" },
      { type: "contains", expected: ".filter(" },
      { type: "contains", expected: "[items, filter]" },
    ],
    hint: "useMemo(() => calcul, [dépendances]) ne recalcule que si les dépendances changent.",
  },
  {
    id: "react_51",
    type: "code",
    category: "Performance",
    title: "useCallback pour fonction stable",
    description: "Stabilisez une référence de fonction.",
    instruction: "Créez un composant <code>Parent</code> avec un state <code>count</code>. Utilisez <code>useCallback</code> pour mémoiser une fonction <code>increment</code> qui appelle <code>setCount(prev => prev + 1)</code>. Passez-la à un composant enfant <code>&lt;Child onClick={increment} /&gt;</code>.",
    code_template: `import { useState, useCallback } from 'react';

function Parent() {
  const [count, setCount] = useState(0);

  // Mémorisez la fonction increment

  return (
    <div>
      <p>{count}</p>
      <Child onClick={increment} />
    </div>
  );
}`,
    solution: `import { useState, useCallback } from 'react';

function Parent() {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  return (
    <div>
      <p>{count}</p>
      <Child onClick={increment} />
    </div>
  );
}`,
    tests: [
      { type: "contains", expected: "useCallback(" },
      { type: "contains", expected: "setCount(prev => prev + 1)" },
      { type: "contains", expected: ", [])" },
      { type: "contains", expected: "onClick={increment}" },
    ],
    hint: "useCallback(() => fn, [deps]) stabilise la référence de la fonction entre les rendus.",
  },
  {
    id: "react_52",
    type: "quiz",
    category: "Performance",
    title: "useMemo vs useCallback",
    description: "Quelle est la différence ?",
    options: [
      "useMemo est pour les composants de classe, useCallback pour les fonctionnels",
      "useMemo mémorise une valeur, useCallback mémorise une fonction",
      "useMemo est synchrone, useCallback est asynchrone",
      "Il n'y a aucune différence, ce sont des alias",
    ],
    correct: 1,
    explanation: "useMemo(() => value, deps) retourne la valeur mémorisée. useCallback(fn, deps) retourne la fonction mémorisée. useCallback(fn, deps) est équivalent à useMemo(() => fn, deps).",
  },
  // === Custom Hooks (13-16) ===
  {
    id: "react_53",
    type: "intro",
    category: "Custom Hooks",
    title: "Custom Hooks",
    description: "Créez vos propres hooks pour réutiliser de la logique.",
    content: `<h3>🔧 Custom Hooks — Logique réutilisable</h3>
<p>Un custom hook est une <strong>fonction qui commence par 'use'</strong> et peut appeler d'autres hooks.</p>
<pre><code>function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);
  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  const reset = () => setCount(initial);
  return { count, increment, decrement, reset };
}

// Utilisation
function App() {
  const { count, increment, reset } = useCounter(10);
  // ...
}</code></pre>
<p>Avantages : <strong>séparation des concerns</strong>, <strong>testabilité</strong>, <strong>réutilisabilité</strong>.</p>`,
  },
  {
    id: "react_54",
    type: "code",
    category: "Custom Hooks",
    title: "Hook useToggle",
    description: "Créez un custom hook pour gérer un booléen.",
    instruction: "Créez un custom hook <code>useToggle</code> qui accepte une valeur initiale (false par défaut). Il retourne <code>[value, toggle]</code> — la valeur et une fonction pour la basculer.",
    code_template: `import { useState } from 'react';

function useToggle(initial = false) {
  // Implémentez le hook
}`,
    solution: `import { useState } from 'react';

function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = () => setValue(prev => !prev);
  return [value, toggle];
}`,
    tests: [
      { type: "contains", expected: "function useToggle" },
      { type: "contains", expected: "useState(initial)" },
      { type: "contains", expected: "!prev" },
      { type: "contains", expected: "return [value, toggle]" },
    ],
    hint: "Utilisez useState + une fonction toggle qui inverse la valeur, puis retournez les deux.",
  },
  {
    id: "react_55",
    type: "code",
    category: "Custom Hooks",
    title: "Hook useLocalStorage",
    description: "Créez un hook qui synchronise le state avec localStorage.",
    instruction: "Créez <code>useLocalStorage(key, initialValue)</code> qui lit la valeur depuis localStorage au montage, et la met à jour dans localStorage à chaque changement.",
    code_template: `import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  // 1. Lisez la valeur initiale depuis localStorage
  // 2. Sauvegardez dans localStorage quand la valeur change
  // 3. Retournez [value, setValue]
}`,
    solution: `import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}`,
    tests: [
      { type: "contains", expected: "function useLocalStorage" },
      { type: "contains", expected: "localStorage.getItem" },
      { type: "contains", expected: "localStorage.setItem" },
      { type: "contains", expected: "JSON.parse" },
      { type: "contains", expected: "JSON.stringify" },
    ],
    hint: "Initialisez le state avec une fonction lazy : useState(() => { ... }). Synchronisez avec useEffect.",
  },
  {
    id: "react_56",
    type: "code",
    category: "Custom Hooks",
    title: "Hook useWindowSize",
    description: "Créez un hook qui retourne la taille de la fenêtre.",
    instruction: "Créez <code>useWindowSize()</code> qui retourne <code>{ width, height }</code> et se met à jour quand la fenêtre est redimensionnée. N'oubliez pas le cleanup du listener.",
    code_template: `import { useState, useEffect } from 'react';

function useWindowSize() {
  // Implémentez le hook
}`,
    solution: `import { useState, useEffect } from 'react';

function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}`,
    tests: [
      { type: "contains", expected: "function useWindowSize" },
      { type: "contains", expected: "window.innerWidth" },
      { type: "contains", expected: "addEventListener" },
      { type: "contains", expected: "removeEventListener" },
      { type: "contains", expected: "return size" },
    ],
    hint: "addEventListener('resize', handler) au montage, removeEventListener dans le cleanup.",
  },
  // === Patterns avancés (17-20) ===
  {
    id: "react_57",
    type: "code",
    category: "Patterns",
    title: "Composition de composants",
    description: "Utilisez children pour la composition.",
    instruction: "Créez un composant <code>Card</code> qui accepte <code>title</code> et <code>children</code>. Il retourne un <code>&lt;div className=\"card\"&gt;</code> avec un <code>&lt;h3&gt;</code> pour le titre et <code>{children}</code> pour le contenu.",
    code_template: `function Card({ title, children }) {
  return (
    // Structure de carte
  );
}`,
    solution: `function Card({ title, children }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      {children}
    </div>
  );
}`,
    tests: [
      { type: "contains", expected: "{ title, children }" },
      { type: "contains", expected: "{title}" },
      { type: "contains", expected: "{children}" },
      { type: "contains", expected: "className=\"card\"" },
    ],
    hint: "children est une prop spéciale qui contient tout ce qui est imbriqué dans le composant.",
  },
  {
    id: "react_58",
    type: "code",
    category: "Patterns",
    title: "Render props",
    description: "Passez une fonction de rendu en tant que prop.",
    instruction: "Créez un composant <code>MouseTracker</code> qui suit la position de la souris et appelle <code>render({ x, y })</code> pour déléguer l'affichage au parent.",
    code_template: `import { useState, useEffect } from 'react';

function MouseTracker({ render }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  // Suivez la souris

  return render(pos);
}`,
    solution: `import { useState, useEffect } from 'react';

function MouseTracker({ render }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return render(pos);
}`,
    tests: [
      { type: "contains", expected: "mousemove" },
      { type: "contains", expected: "addEventListener" },
      { type: "contains", expected: "removeEventListener" },
      { type: "contains", expected: "render(pos)" },
    ],
    hint: "addEventListener('mousemove', handler) pour suivre la souris, puis passez la position à render().",
  },
  {
    id: "react_59",
    type: "quiz",
    category: "Patterns",
    title: "React.memo",
    description: "Que fait React.memo ?",
    options: [
      "Il mémorise les résultats d'une fonction de calcul",
      "Il empêche un composant de re-rendre si ses props n'ont pas changé",
      "Il remplace useMemo dans les composants fonctionnels",
      "Il stocke les composants dans le localStorage",
    ],
    correct: 1,
    explanation: "React.memo est un HOC (Higher-Order Component) qui enveloppe un composant et le re-rend uniquement si ses props ont changé (comparaison superficielle). C'est l'équivalent de shouldComponentUpdate pour les composants fonctionnels.",
  },
  {
    id: "react_60",
    type: "code",
    category: "Patterns",
    title: "Formulaire complet",
    description: "Gérez un formulaire avec plusieurs champs.",
    instruction: "Créez un composant <code>LoginForm</code> avec un state objet <code>{ email: '', password: '' }</code>. Créez une fonction <code>handleChange</code> qui utilise <code>e.target.name</code> pour mettre à jour le bon champ. Affichez deux inputs et un bouton submit.",
    code_template: `import { useState } from 'react';

function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });

  // Fonction handleChange générique

  return (
    <form>
      {/* Deux inputs + bouton */}
    </form>
  );
}`,
    solution: `import { useState } from 'react';

function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <form>
      <input name="email" value={form.email} onChange={handleChange} />
      <input name="password" type="password" value={form.password} onChange={handleChange} />
      <button type="submit">Connexion</button>
    </form>
  );
}`,
    tests: [
      { type: "contains", expected: "[e.target.name]" },
      { type: "contains", expected: "e.target.value" },
      { type: "contains", expected: "...form" },
      { type: "contains", expected: "name=\"email\"" },
      { type: "contains", expected: "name=\"password\"" },
    ],
    hint: "Utilisez [e.target.name]: e.target.value avec le spread operator pour gérer plusieurs champs avec une seule fonction.",
  },
];

addExercises("react", exercises);
