import { addExercises } from ".";
import type { Exercise } from "@/app/exercises/[module]/exercise-client";

const exercises: Exercise[] = [
  // === HOOKS AVANCÉS (81-86) ===
  {
    id: "react_81",
    type: "intro",
    category: "Hooks avancés",
    title: "Hooks personnalisés avancés",
    description: "Créez des hooks réutilisables et puissants.",
    content: `<h3>🪝 Hooks avancés</h3>
<pre><code>// useDebounce — retarder une valeur
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// useLocalStorage — persistance
function useLocalStorage(key, initialValue) {
  const [stored, setStored] = useState(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });
  const setValue = (value) => {
    setStored(value);
    localStorage.setItem(key, JSON.stringify(value));
  };
  return [stored, setValue];
}

// useMediaQuery — responsive
function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);
  return matches;
}</code></pre>`,
  },
  {
    id: "react_82",
    type: "code",
    category: "Hooks avancés",
    title: "useDebounce",
    description: "Créez un hook de debounce.",
    instruction: "Créez un hook <code>useDebounce(value, delay)</code> qui retourne la valeur retardée. Utilisez <code>useState</code> et <code>useEffect</code> avec <code>setTimeout</code> et cleanup. Créez un composant <code>SearchBar</code> qui l'utilise pour retarder la recherche de 500ms.",
    code_template: `import { useState, useEffect } from 'react';

// Hook useDebounce + composant SearchBar
`,
    solution: `import { useState, useEffect } from 'react';

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function SearchBar() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  
  useEffect(() => {
    if (debouncedQuery) {
      console.log('Recherche:', debouncedQuery);
    }
  }, [debouncedQuery]);

  return <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Rechercher..." />;
}`,
    tests: [
      { expected: "useDebounce", type: "contains" },
      { expected: "setTimeout", type: "contains" },
      { expected: "clearTimeout", type: "contains" },
    ],
  },
  {
    id: "react_83",
    type: "code",
    category: "Hooks avancés",
    title: "useLocalStorage",
    description: "Persistez l'état dans localStorage.",
    instruction: "Créez un hook <code>useLocalStorage(key, initialValue)</code> qui synchronise un state avec localStorage. Il doit lire la valeur initiale depuis localStorage (JSON.parse) et écrire à chaque changement (JSON.stringify). Retournez <code>[value, setValue]</code>.",
    code_template: `import { useState } from 'react';

// Hook useLocalStorage
`,
    solution: `import { useState } from 'react';

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [storedValue, setValue];
}`,
    tests: [
      { expected: "useLocalStorage", type: "contains" },
      { expected: "localStorage.getItem", type: "contains" },
      { expected: "localStorage.setItem", type: "contains" },
      { expected: "JSON.parse", type: "contains" },
    ],
  },
  {
    id: "react_84",
    type: "code",
    category: "Hooks avancés",
    title: "useFetch",
    description: "Créez un hook de requête HTTP.",
    instruction: "Créez un hook <code>useFetch(url)</code> qui retourne <code>{data, loading, error}</code>. Utilisez useEffect pour fetch les données, gérez l'annulation avec AbortController, et les 3 états (loading, success, error).",
    code_template: `import { useState, useEffect } from 'react';

// Hook useFetch
`,
    solution: `import { useState, useEffect } from 'react';

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    
    fetch(url, { signal: controller.signal })
      .then(res => res.json())
      .then(data => { setData(data); setLoading(false); })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}`,
    tests: [
      { expected: "useFetch", type: "contains" },
      { expected: "AbortController", type: "contains" },
      { expected: "loading", type: "contains" },
      { expected: "controller.abort()", type: "contains" },
    ],
  },
  {
    id: "react_85",
    type: "quiz",
    category: "Hooks avancés",
    title: "Règles des Hooks",
    description: "Quelle règle est fondamentale pour les hooks ?",
    options: [
      "Les hooks doivent être dans des classes",
      "Les hooks doivent toujours être appelés au même niveau, jamais dans des conditions ou boucles",
      "Les hooks ne fonctionnent qu'avec TypeScript",
      "Les hooks doivent commencer par 'get'",
    ],
    correct: 1,
    explanation: "Les hooks doivent être appelés au top level du composant, jamais dans des conditions, boucles ou fonctions imbriquées. React s'appuie sur l'ordre d'appel des hooks pour les identifier entre les rendus. Briser cette règle cause des bugs subtils.",
  },
  {
    id: "react_86",
    type: "code",
    category: "Hooks avancés",
    title: "useReducer avancé",
    description: "Gérez un état complexe avec useReducer.",
    instruction: "Créez un reducer pour un panier d'achat avec les actions <strong>ADD_ITEM</strong>, <strong>REMOVE_ITEM</strong>, <strong>CLEAR</strong>. L'état contient <code>items</code> (tableau) et <code>total</code>. Créez le composant <code>Cart</code> qui utilise ce reducer.",
    code_template: `import { useReducer } from 'react';

// Reducer panier + composant Cart
`,
    solution: `import { useReducer } from 'react';

const initialState = { items: [], total: 0 };

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        items: [...state.items, action.payload],
        total: state.total + action.payload.price,
      };
    case 'REMOVE_ITEM':
      const item = state.items.find(i => i.id === action.payload);
      return {
        items: state.items.filter(i => i.id !== action.payload),
        total: state.total - (item?.price || 0),
      };
    case 'CLEAR':
      return initialState;
    default:
      return state;
  }
}

function Cart() {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  return (
    <div>
      <p>Total: {state.total}€</p>
      <button onClick={() => dispatch({ type: 'ADD_ITEM', payload: { id: 1, name: 'Item', price: 10 } })}>Ajouter</button>
      <button onClick={() => dispatch({ type: 'CLEAR' })}>Vider</button>
    </div>
  );
}`,
    tests: [
      { expected: "useReducer", type: "contains" },
      { expected: "ADD_ITEM", type: "contains" },
      { expected: "REMOVE_ITEM", type: "contains" },
      { expected: "dispatch", type: "contains" },
    ],
  },

  // === CONTEXT API AVANCÉ (87-90) ===
  {
    id: "react_87",
    type: "intro",
    category: "Context avancé",
    title: "Context API — Patterns avancés",
    description: "Architecturez votre état global avec Context.",
    content: `<h3>🌐 Context API avancé</h3>
<pre><code>// Pattern: Context + Reducer + Custom Hook
const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, dispatch] = useReducer(themeReducer, 'dark');
  const value = useMemo(() => ({ theme, dispatch }), [theme]);
  return &lt;ThemeContext.Provider value={value}&gt;{children}&lt;/ThemeContext.Provider&gt;;
}

function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be within ThemeProvider');
  return ctx;
}

// Pattern: Separate state and dispatch contexts
const StateCtx = createContext();
const DispatchCtx = createContext();

// Pattern: Compound components
function Tabs({ children }) {
  const [active, setActive] = useState(0);
  return &lt;TabContext.Provider value={{ active, setActive }}&gt;
    {children}
  &lt;/TabContext.Provider&gt;;
}
Tabs.Tab = function Tab({ index, children }) {
  const { active, setActive } = useContext(TabContext);
  return &lt;button onClick={() => setActive(index)}&gt;{children}&lt;/button&gt;;
};</code></pre>`,
  },
  {
    id: "react_88",
    type: "code",
    category: "Context avancé",
    title: "Auth Context complet",
    description: "Créez un contexte d'authentification.",
    instruction: "Créez un <code>AuthContext</code> avec <code>AuthProvider</code> qui gère un state user (null ou objet). Implémentez <code>login(email, password)</code>, <code>logout()</code>, et <code>isAuthenticated</code>. Créez un hook <code>useAuth()</code> avec validation.",
    code_template: `import { createContext, useContext, useState } from 'react';

// Auth Context complet
`,
    solution: `import { createContext, useContext, useState, useMemo } from 'react';

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const userData = { id: '1', email, name: email.split('@')[0] };
    setUser(userData);
  };

  const logout = () => setUser(null);

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    login,
    logout,
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be within AuthProvider');
  return ctx;
}`,
    tests: [
      { expected: "createContext", type: "contains" },
      { expected: "AuthProvider", type: "contains" },
      { expected: "useAuth", type: "contains" },
      { expected: "isAuthenticated", type: "contains" },
    ],
  },
  {
    id: "react_89",
    type: "code",
    category: "Context avancé",
    title: "Theme Context avec toggle",
    description: "Créez un système de thème.",
    instruction: "Créez un <code>ThemeProvider</code> avec un state <code>theme</code> ('light' ou 'dark') et une fonction <code>toggleTheme</code>. Le hook <code>useTheme()</code> retourne <code>{theme, toggleTheme, isDark}</code>. Persistez le thème dans localStorage.",
    code_template: `import { createContext, useContext, useState } from 'react';

// Theme Context avec persistance
`,
    solution: `import { createContext, useContext, useState, useMemo } from 'react';

const ThemeContext = createContext(null);

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      return next;
    });
  };

  const value = useMemo(() => ({
    theme,
    toggleTheme,
    isDark: theme === 'dark',
  }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be within ThemeProvider');
  return ctx;
}`,
    tests: [
      { expected: "ThemeProvider", type: "contains" },
      { expected: "useTheme", type: "contains" },
      { expected: "toggleTheme", type: "contains" },
      { expected: "localStorage", type: "contains" },
    ],
  },
  {
    id: "react_90",
    type: "quiz",
    category: "Context avancé",
    title: "Performance Context",
    description: "Comment optimiser un Context qui change souvent ?",
    options: [
      "Mettre tout l'état dans un seul Context",
      "Séparer state et dispatch dans deux Contexts différents pour éviter les re-renders inutiles",
      "Ne jamais utiliser Context",
      "Utiliser useEffect au lieu de Context",
    ],
    correct: 1,
    explanation: "Quand un Context change, tous les consumers re-rendent. Séparer state et dispatch en deux Contexts fait que les composants qui dispatch seulement (sans lire le state) ne re-rendent pas. Utiliser useMemo sur la value du Context aide aussi.",
  },

  // === PERFORMANCE (91-96) ===
  {
    id: "react_91",
    type: "intro",
    category: "Performance",
    title: "Optimisation React",
    description: "Rendez vos apps React ultra-rapides.",
    content: `<h3>⚡ Performance React</h3>
<pre><code>// React.memo — éviter les re-renders
const ExpensiveList = React.memo(({ items }) => {
  return items.map(item => &lt;Item key={item.id} {...item} /&gt;);
});

// useMemo — mémoriser un calcul coûteux
const sorted = useMemo(
  () => items.sort((a, b) => a.score - b.score),
  [items]
);

// useCallback — stabiliser une fonction
const handleClick = useCallback((id) => {
  setItems(prev => prev.filter(i => i.id !== id));
}, []);

// Lazy loading
const HeavyComponent = React.lazy(() => import('./Heavy'));
&lt;Suspense fallback={&lt;Spinner /&gt;}&gt;
  &lt;HeavyComponent /&gt;
&lt;/Suspense&gt;

// useTransition — basse priorité
const [isPending, startTransition] = useTransition();
startTransition(() => {
  setSearchResults(filterData(query));
});</code></pre>`,
  },
  {
    id: "react_92",
    type: "code",
    category: "Performance",
    title: "React.memo",
    description: "Prévenez les re-renders inutiles.",
    instruction: "Créez un composant <code>UserCard</code> enveloppé dans <code>React.memo</code> qui affiche le nom et l'email d'un utilisateur. Ajoutez un <code>console.log('render UserCard')</code> pour vérifier les re-renders. Créez un parent avec un compteur qui incrémente sans re-render UserCard.",
    code_template: `import { useState, memo } from 'react';

// UserCard avec React.memo + Parent
`,
    solution: `import { useState, memo } from 'react';

const UserCard = memo(function UserCard({ name, email }) {
  console.log('render UserCard');
  return (
    <div style={{ border: '1px solid #333', padding: 16, borderRadius: 8 }}>
      <h3>{name}</h3>
      <p>{email}</p>
    </div>
  );
});

function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <UserCard name="Aelita" email="aelita@lyoko.fr" />
    </div>
  );
}`,
    tests: [
      { expected: "memo(", type: "contains" },
      { expected: "console.log", type: "contains" },
      { expected: "UserCard", type: "contains" },
    ],
  },
  {
    id: "react_93",
    type: "code",
    category: "Performance",
    title: "useMemo et useCallback",
    description: "Mémorisez calculs et fonctions.",
    instruction: "Créez un composant qui a une liste de 1000 nombres. Utilisez <code>useMemo</code> pour filtrer et trier les nombres pairs (calcul coûteux). Utilisez <code>useCallback</code> pour une fonction <code>handleDelete</code> stable passée à un composant enfant memo-isé.",
    code_template: `import { useState, useMemo, useCallback, memo } from 'react';

// Composant optimisé avec useMemo + useCallback
`,
    solution: `import { useState, useMemo, useCallback, memo } from 'react';

const NumberItem = memo(({ value, onDelete }) => {
  return <li>{value} <button onClick={() => onDelete(value)}>X</button></li>;
});

function NumberList() {
  const [numbers, setNumbers] = useState(() =>
    Array.from({ length: 1000 }, (_, i) => i + 1)
  );
  const [filter, setFilter] = useState('');

  const filtered = useMemo(() => {
    return numbers
      .filter(n => n % 2 === 0)
      .sort((a, b) => b - a)
      .slice(0, 20);
  }, [numbers]);

  const handleDelete = useCallback((value) => {
    setNumbers(prev => prev.filter(n => n !== value));
  }, []);

  return (
    <div>
      <ul>{filtered.map(n => <NumberItem key={n} value={n} onDelete={handleDelete} />)}</ul>
    </div>
  );
}`,
    tests: [
      { expected: "useMemo(", type: "contains" },
      { expected: "useCallback(", type: "contains" },
      { expected: "memo(", type: "contains" },
    ],
  },
  {
    id: "react_94",
    type: "code",
    category: "Performance",
    title: "React.lazy et Suspense",
    description: "Chargez des composants à la demande.",
    instruction: "Utilisez <code>React.lazy</code> pour importer dynamiquement un composant <code>Dashboard</code>. Enveloppez-le dans <code>Suspense</code> avec un fallback de chargement. Affichez un bouton qui toggle l'affichage du Dashboard.",
    code_template: `import { useState, Suspense, lazy } from 'react';

// Lazy loading avec Suspense
`,
    solution: `import { useState, Suspense, lazy } from 'react';

const Dashboard = lazy(() => import('./Dashboard'));

function App() {
  const [show, setShow] = useState(false);
  return (
    <div>
      <button onClick={() => setShow(s => !s)}>
        {show ? 'Fermer' : 'Ouvrir'} Dashboard
      </button>
      {show && (
        <Suspense fallback={<div>Chargement...</div>}>
          <Dashboard />
        </Suspense>
      )}
    </div>
  );
}`,
    tests: [
      { expected: "lazy(", type: "contains" },
      { expected: "Suspense", type: "contains" },
      { expected: "fallback=", type: "contains" },
      { expected: "import(", type: "contains" },
    ],
  },
  {
    id: "react_95",
    type: "quiz",
    category: "Performance",
    title: "Quand utiliser useMemo ?",
    description: "Dans quel cas useMemo est-il justifié ?",
    options: [
      "Pour chaque variable du composant",
      "Uniquement pour des calculs coûteux qui dépendent de valeurs changeantes",
      "Pour remplacer useState",
      "Pour les appels API",
    ],
    correct: 1,
    explanation: "useMemo est utile pour des calculs coûteux (tri, filtre de grandes listes, etc.) qui seraient recalculés à chaque render. Pour des opérations simples, useMemo ajoute de l'overhead sans bénéfice. Ne pas abuser : profiler d'abord, optimiser ensuite.",
  },
  {
    id: "react_96",
    type: "code",
    category: "Performance",
    title: "Virtualisation de liste",
    description: "Affichez des milliers d'éléments efficacement.",
    instruction: "Créez un composant <code>VirtualList</code> qui affiche seulement les éléments visibles d'une liste de 10000 items. Utilisez un conteneur scrollable avec position absolute pour les items. Calculez les items visibles basé sur scrollTop et la hauteur du conteneur.",
    code_template: `import { useState, useRef, useCallback } from 'react';

// Liste virtualisée simple
`,
    solution: `import { useState, useRef, useCallback } from 'react';

function VirtualList({ items, itemHeight = 40, containerHeight = 400 }) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  const visibleItems = items.slice(startIndex, endIndex);

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  return (
    <div ref={containerRef} onScroll={handleScroll}
      style={{ height: containerHeight, overflow: 'auto', position: 'relative' }}>
      <div style={{ height: items.length * itemHeight }}>
        {visibleItems.map((item, i) => (
          <div key={startIndex + i} style={{
            position: 'absolute',
            top: (startIndex + i) * itemHeight,
            height: itemHeight,
            width: '100%',
          }}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}`,
    tests: [
      { expected: "VirtualList", type: "contains" },
      { expected: "scrollTop", type: "contains" },
      { expected: "position: 'absolute'", type: "contains" },
      { expected: "startIndex", type: "contains" },
    ],
  },

  // === FORMULAIRES AVANCÉS (97-100) ===
  {
    id: "react_97",
    type: "intro",
    category: "Formulaires avancés",
    title: "Formulaires React avancés",
    description: "Gérez des formulaires complexes.",
    content: `<h3>📝 Formulaires avancés</h3>
<pre><code>// Hook de formulaire personnalisé
function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return { values, errors, touched, handleChange, handleBlur, reset, setErrors };
}

// Composant contrôlé avec validation
function Input({ name, label, error, ...props }) {
  return (
    &lt;div&gt;
      &lt;label&gt;{label}&lt;/label&gt;
      &lt;input name={name} {...props} /&gt;
      {error && &lt;span className="error"&gt;{error}&lt;/span&gt;}
    &lt;/div&gt;
  );
}</code></pre>`,
  },
  {
    id: "react_98",
    type: "code",
    category: "Formulaires avancés",
    title: "Hook useForm",
    description: "Créez un hook de formulaire complet.",
    instruction: "Créez un hook <code>useForm(initialValues, validate)</code> qui retourne values, errors, touched, handleChange, handleBlur, handleSubmit, isValid. La fonction validate reçoit les values et retourne un objet d'erreurs. handleSubmit appelle validate avant d'exécuter le callback.",
    code_template: `import { useState, useCallback } from 'react';

// Hook useForm complet
`,
    solution: `import { useState, useCallback } from 'react';

function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    if (validate) {
      const errs = validate({ ...values, [name]: e.target.value });
      setErrors(errs);
    }
  }, [values, validate]);

  const handleSubmit = useCallback((callback) => (e) => {
    e.preventDefault();
    const errs = validate ? validate(values) : {};
    setErrors(errs);
    if (Object.keys(errs).length === 0) callback(values);
  }, [values, validate]);

  const isValid = Object.keys(errors).length === 0;

  return { values, errors, touched, handleChange, handleBlur, handleSubmit, isValid };
}`,
    tests: [
      { expected: "useForm", type: "contains" },
      { expected: "handleChange", type: "contains" },
      { expected: "handleBlur", type: "contains" },
      { expected: "handleSubmit", type: "contains" },
      { expected: "validate", type: "contains" },
    ],
  },
  {
    id: "react_99",
    type: "code",
    category: "Formulaires avancés",
    title: "Formulaire multi-étapes",
    description: "Créez un formulaire wizard.",
    instruction: "Créez un composant <code>Wizard</code> avec 3 étapes (nom, email, confirmation). Gérez l'état avec <code>useState</code> pour le step courant et les données du formulaire. Ajoutez les boutons Précédent/Suivant/Valider.",
    code_template: `import { useState } from 'react';

// Formulaire multi-étapes
`,
    solution: `import { useState } from 'react';

function Wizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ nom: '', email: '', message: '' });

  const steps = [
    <div key="step1">
      <h3>Étape 1: Identité</h3>
      <input placeholder="Nom" value={data.nom} onChange={e => setData({...data, nom: e.target.value})} />
    </div>,
    <div key="step2">
      <h3>Étape 2: Contact</h3>
      <input placeholder="Email" value={data.email} onChange={e => setData({...data, email: e.target.value})} />
    </div>,
    <div key="step3">
      <h3>Confirmation</h3>
      <p>Nom: {data.nom}</p>
      <p>Email: {data.email}</p>
    </div>,
  ];

  return (
    <div>
      <div>Étape {step + 1} / {steps.length}</div>
      {steps[step]}
      <div>
        {step > 0 && <button onClick={() => setStep(s => s - 1)}>Précédent</button>}
        {step < steps.length - 1
          ? <button onClick={() => setStep(s => s + 1)}>Suivant</button>
          : <button onClick={() => alert(JSON.stringify(data))}>Valider</button>}
      </div>
    </div>
  );
}`,
    tests: [
      { expected: "step", type: "contains" },
      { expected: "Précédent", type: "contains" },
      { expected: "Suivant", type: "contains" },
      { expected: "Valider", type: "contains" },
    ],
  },
  {
    id: "react_100",
    type: "quiz",
    category: "Formulaires avancés",
    title: "Controlled vs Uncontrolled",
    description: "Quelle est la différence ?",
    options: [
      "Aucune différence en React",
      "Controlled: React gère la valeur via state. Uncontrolled: le DOM gère la valeur via ref",
      "Uncontrolled est déprécié",
      "Controlled est plus lent",
    ],
    correct: 1,
    explanation: "Un composant controlled a sa valeur contrôlée par React via state (value + onChange). Un uncontrolled laisse le DOM gérer la valeur et on la lit via ref quand nécessaire. Controlled est recommandé pour la majorité des cas car il donne un contrôle total.",
  },

  // === PATTERNS AVANCÉS (101-106) ===
  {
    id: "react_101",
    type: "intro",
    category: "Patterns avancés",
    title: "Design Patterns React",
    description: "Patterns d'architecture courants.",
    content: `<h3>🏛️ Patterns React</h3>
<pre><code>// Render Props
function MouseTracker({ render }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return &lt;div onMouseMove={e => setPos({x: e.clientX, y: e.clientY})}&gt;
    {render(pos)}
  &lt;/div&gt;;
}

// HOC — Higher-Order Component
function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { user } = useAuth();
    if (!user) return &lt;Navigate to="/login" /&gt;;
    return &lt;Component {...props} user={user} /&gt;;
  };
}

// Compound Components
&lt;Select&gt;
  &lt;Select.Option value="a"&gt;Option A&lt;/Select.Option&gt;
  &lt;Select.Option value="b"&gt;Option B&lt;/Select.Option&gt;
&lt;/Select&gt;

// Forwarding Refs
const FancyInput = forwardRef((props, ref) => (
  &lt;input ref={ref} className="fancy" {...props} /&gt;
));</code></pre>`,
  },
  {
    id: "react_102",
    type: "code",
    category: "Patterns avancés",
    title: "Higher-Order Component",
    description: "Créez un HOC d'authentification.",
    instruction: "Créez un HOC <code>withLoading(Component)</code> qui affiche un spinner quand <code>props.loading</code> est true, sinon rend le Component. Testez avec un composant <code>UserList</code>.",
    code_template: `import React from 'react';

// HOC withLoading
`,
    solution: `import React from 'react';

function withLoading(Component) {
  return function WithLoadingComponent({ loading, ...props }) {
    if (loading) {
      return <div style={{ textAlign: 'center', padding: 40 }}>Chargement...</div>;
    }
    return <Component {...props} />;
  };
}

function UserList({ users }) {
  return (
    <ul>
      {users.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
}

const UserListWithLoading = withLoading(UserList);

// Usage: <UserListWithLoading loading={true} users={[]} />`,
    tests: [
      { expected: "withLoading", type: "contains" },
      { expected: "loading", type: "contains" },
      { expected: "...props", type: "contains" },
      { expected: "Component", type: "contains" },
    ],
  },
  {
    id: "react_103",
    type: "code",
    category: "Patterns avancés",
    title: "Render Props",
    description: "Partagez de la logique avec render props.",
    instruction: "Créez un composant <code>Toggle</code> qui gère un état on/off et expose <code>{on, toggle}</code> via une prop <code>render</code> (render prop pattern). Utilisez-le pour créer un bouton toggle et un texte conditionnel.",
    code_template: `import { useState } from 'react';

// Composant Toggle avec render prop
`,
    solution: `import { useState } from 'react';

function Toggle({ render }) {
  const [on, setOn] = useState(false);
  const toggle = () => setOn(prev => !prev);
  return render({ on, toggle });
}

function App() {
  return (
    <Toggle render={({ on, toggle }) => (
      <div>
        <button onClick={toggle}>{on ? 'ON' : 'OFF'}</button>
        {on && <p>Le contenu est visible !</p>}
      </div>
    )} />
  );
}`,
    tests: [
      { expected: "render({", type: "contains" },
      { expected: "Toggle", type: "contains" },
      { expected: "toggle", type: "contains" },
    ],
  },
  {
    id: "react_104",
    type: "code",
    category: "Patterns avancés",
    title: "Compound Components",
    description: "Créez des composants composés.",
    instruction: "Créez un composant <code>Accordion</code> avec des sous-composants <code>Accordion.Item</code> et <code>Accordion.Content</code>. L'Accordion gère quel item est ouvert via Context. Cliquer sur un Item toggle son Content.",
    code_template: `import { createContext, useContext, useState } from 'react';

// Accordion compound component
`,
    solution: `import { createContext, useContext, useState } from 'react';

const AccordionContext = createContext();

function Accordion({ children }) {
  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (index) => setOpenIndex(prev => prev === index ? null : index);
  return (
    <AccordionContext.Provider value={{ openIndex, toggle }}>
      <div>{children}</div>
    </AccordionContext.Provider>
  );
}

Accordion.Item = function AccordionItem({ index, title, children }) {
  const { openIndex, toggle } = useContext(AccordionContext);
  const isOpen = openIndex === index;
  return (
    <div style={{ borderBottom: '1px solid #333' }}>
      <button onClick={() => toggle(index)} style={{ width: '100%', padding: 12, textAlign: 'left' }}>
        {title} {isOpen ? '▲' : '▼'}
      </button>
      {isOpen && <div style={{ padding: 12 }}>{children}</div>}
    </div>
  );
};`,
    tests: [
      { expected: "AccordionContext", type: "contains" },
      { expected: "Accordion.Item", type: "contains" },
      { expected: "openIndex", type: "contains" },
      { expected: "toggle", type: "contains" },
    ],
  },
  {
    id: "react_105",
    type: "quiz",
    category: "Patterns avancés",
    title: "Hooks vs HOC vs Render Props",
    description: "Quel pattern est recommandé en React moderne ?",
    options: [
      "HOC est toujours le meilleur choix",
      "Render Props est la seule bonne approche",
      "Les Hooks personnalisés remplacent la plupart des cas d'utilisation de HOC et Render Props",
      "Les trois sont équivalents et interchangeables",
    ],
    correct: 2,
    explanation: "Les Hooks personnalisés sont devenus le pattern dominant car ils sont plus simples, composables, et n'ajoutent pas de niveaux dans l'arbre de composants (wrapper hell). HOC et Render Props restent utiles dans certains cas, mais les hooks couvrent 90% des besoins de réutilisation de logique.",
  },
  {
    id: "react_106",
    type: "code",
    category: "Patterns avancés",
    title: "Error Boundary",
    description: "Attrapez les erreurs de rendu.",
    instruction: "Créez un composant classe <code>ErrorBoundary</code> avec <code>getDerivedStateFromError</code> et <code>componentDidCatch</code>. Affichez un fallback UI en cas d'erreur avec un bouton 'Réessayer' qui reset l'état.",
    code_template: `import React from 'react';

// Error Boundary (composant classe)
`,
    solution: `import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, textAlign: 'center' }}>
          <h2>Quelque chose s'est mal passé</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Réessayer
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}`,
    tests: [
      { expected: "class ErrorBoundary", type: "contains" },
      { expected: "getDerivedStateFromError", type: "contains" },
      { expected: "componentDidCatch", type: "contains" },
      { expected: "hasError", type: "contains" },
    ],
  },

  // === NEXT.JS / SSR (107-110) ===
  {
    id: "react_107",
    type: "intro",
    category: "Next.js & SSR",
    title: "React côté serveur avec Next.js",
    description: "Découvrez le rendu serveur et Next.js.",
    content: `<h3>🌐 Next.js & SSR</h3>
<p>Next.js est le framework React le plus populaire, avec rendu serveur et génération statique.</p>
<pre><code>// Server Component (par défaut dans App Router)
async function PostsPage() {
  const posts = await fetch('https://api.example.com/posts');
  return &lt;PostList posts={posts} /&gt;;
}

// Client Component
'use client';
function Counter() {
  const [count, setCount] = useState(0);
  return &lt;button onClick={() => setCount(c + 1)}&gt;{count}&lt;/button&gt;;
}

// API Route
export async function GET(request) {
  return Response.json({ message: 'Hello' });
}

// Metadata
export const metadata = {
  title: 'Mon App',
  description: 'Description SEO',
};

// Dynamic routing: app/posts/[id]/page.tsx
export default function PostPage({ params }) {
  return &lt;Post id={params.id} /&gt;;
}</code></pre>`,
  },
  {
    id: "react_108",
    type: "code",
    category: "Next.js & SSR",
    title: "Server Component",
    description: "Créez un Server Component Next.js.",
    instruction: "Créez un Server Component <code>UsersPage</code> qui fetch des utilisateurs depuis une API et affiche une liste. C'est un composant async (pas de 'use client'). Ajoutez les métadonnées SEO avec <code>export const metadata</code>.",
    code_template: `// Next.js Server Component (app/users/page.tsx)

`,
    solution: `// Next.js Server Component (app/users/page.tsx)
export const metadata = {
  title: 'Utilisateurs - Projet Carthage',
  description: 'Liste des utilisateurs de la plateforme',
};

async function UsersPage() {
  const res = await fetch('https://api.example.com/users', { cache: 'no-store' });
  const users = await res.json();
  
  return (
    <div>
      <h1>Utilisateurs</h1>
      <ul>
        {users.map(u => (
          <li key={u.id}>{u.name} — {u.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default UsersPage;`,
    tests: [
      { expected: "async function UsersPage", type: "contains" },
      { expected: "await fetch", type: "contains" },
      { expected: "export const metadata", type: "contains" },
    ],
  },
  {
    id: "react_109",
    type: "code",
    category: "Next.js & SSR",
    title: "API Route Next.js",
    description: "Créez un endpoint API.",
    instruction: "Créez une API Route Next.js avec un <code>GET</code> qui retourne une liste de guerriers en JSON, et un <code>POST</code> qui ajoute un guerrier. Utilisez les Route Handlers de l'App Router (<code>NextRequest</code>, <code>NextResponse</code>).",
    code_template: `// Next.js API Route (app/api/guerriers/route.ts)
import { NextRequest, NextResponse } from 'next/server';

`,
    solution: `import { NextRequest, NextResponse } from 'next/server';

const guerriers = [
  { id: 1, nom: 'Aelita', niveau: 10 },
  { id: 2, nom: 'Yumi', niveau: 8 },
];

export async function GET() {
  return NextResponse.json({ success: true, data: guerriers });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const nouveau = { id: guerriers.length + 1, ...body };
  guerriers.push(nouveau);
  return NextResponse.json({ success: true, data: nouveau }, { status: 201 });
}`,
    tests: [
      { expected: "export async function GET", type: "contains" },
      { expected: "export async function POST", type: "contains" },
      { expected: "NextResponse.json", type: "contains" },
    ],
  },
  {
    id: "react_110",
    type: "quiz",
    category: "Next.js & SSR",
    title: "Server vs Client Components",
    description: "Quelle est la différence dans Next.js App Router ?",
    options: [
      "Il n'y a pas de différence",
      "Server Components tournent côté serveur, n'incluent pas de JS client, et peuvent être async. Client Components utilisent 'use client' et supportent les hooks/events",
      "Client Components sont plus rapides",
      "Server Components ne peuvent pas afficher de HTML",
    ],
    correct: 1,
    explanation: "Dans l'App Router de Next.js, les composants sont Server par défaut : ils tournent sur le serveur, peuvent être async, accèdent directement à la DB, et n'envoient pas de JS au client. Les Client Components (marqués 'use client') supportent useState, useEffect, les event handlers, et tournent aussi côté client.",
  },

  // === TESTING REACT (111-114) ===
  {
    id: "react_111",
    type: "intro",
    category: "Tests React",
    title: "Tester des composants React",
    description: "Écrivez des tests pour vos composants.",
    content: `<h3>🧪 Tests React</h3>
<pre><code>import { render, screen, fireEvent } from '@testing-library/react';

// Test basique
test('affiche le titre', () => {
  render(&lt;Header title="Bonjour" /&gt;);
  expect(screen.getByText('Bonjour')).toBeInTheDocument();
});

// Test d'interaction
test('incrémente le compteur', () => {
  render(&lt;Counter /&gt;);
  const btn = screen.getByRole('button', { name: /incrémenter/i });
  fireEvent.click(btn);
  expect(screen.getByText('1')).toBeInTheDocument();
});

// Test async
test('charge les données', async () => {
  render(&lt;UserList /&gt;);
  expect(screen.getByText('Chargement...')).toBeInTheDocument();
  const user = await screen.findByText('Aelita');
  expect(user).toBeInTheDocument();
});

// Test hook personnalisé
import { renderHook, act } from '@testing-library/react';
test('useCounter', () => {
  const { result } = renderHook(() => useCounter());
  act(() => result.current.increment());
  expect(result.current.count).toBe(1);
});</code></pre>`,
  },
  {
    id: "react_112",
    type: "code",
    category: "Tests React",
    title: "Test de composant",
    description: "Testez un composant avec Testing Library.",
    instruction: "Écrivez des tests pour un composant <code>TodoItem</code> qui affiche un texte et un bouton 'Supprimer'. Testez : le texte s'affiche, le callback onDelete est appelé au clic. Utilisez <code>render</code>, <code>screen</code>, <code>fireEvent</code>.",
    code_template: `import { render, screen, fireEvent } from '@testing-library/react';

// Tests pour TodoItem
`,
    solution: `import { render, screen, fireEvent } from '@testing-library/react';

function TodoItem({ text, onDelete }) {
  return (
    <div>
      <span>{text}</span>
      <button onClick={onDelete}>Supprimer</button>
    </div>
  );
}

test('affiche le texte du todo', () => {
  render(<TodoItem text="Apprendre React" onDelete={() => {}} />);
  expect(screen.getByText('Apprendre React')).toBeInTheDocument();
});

test('appelle onDelete au clic', () => {
  const mockDelete = jest.fn();
  render(<TodoItem text="Test" onDelete={mockDelete} />);
  fireEvent.click(screen.getByText('Supprimer'));
  expect(mockDelete).toHaveBeenCalledTimes(1);
});`,
    tests: [
      { expected: "render(", type: "contains" },
      { expected: "screen.getByText", type: "contains" },
      { expected: "fireEvent.click", type: "contains" },
      { expected: "expect(", type: "contains" },
    ],
  },
  {
    id: "react_113",
    type: "code",
    category: "Tests React",
    title: "Test de hook personnalisé",
    description: "Testez un hook avec renderHook.",
    instruction: "Créez un hook <code>useToggle(initial)</code> qui retourne <code>[value, toggle]</code>. Écrivez des tests avec <code>renderHook</code> et <code>act</code> : valeur initiale false, toggle passe à true, re-toggle revient à false.",
    code_template: `import { renderHook, act } from '@testing-library/react';
import { useState, useCallback } from 'react';

// Hook useToggle + tests
`,
    solution: `import { renderHook, act } from '@testing-library/react';
import { useState, useCallback } from 'react';

function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue(v => !v), []);
  return [value, toggle];
}

test('valeur initiale false', () => {
  const { result } = renderHook(() => useToggle());
  expect(result.current[0]).toBe(false);
});

test('toggle passe à true', () => {
  const { result } = renderHook(() => useToggle());
  act(() => result.current[1]());
  expect(result.current[0]).toBe(true);
});

test('double toggle revient à false', () => {
  const { result } = renderHook(() => useToggle());
  act(() => result.current[1]());
  act(() => result.current[1]());
  expect(result.current[0]).toBe(false);
});`,
    tests: [
      { expected: "renderHook", type: "contains" },
      { expected: "act(", type: "contains" },
      { expected: "useToggle", type: "contains" },
      { expected: "result.current", type: "contains" },
    ],
  },
  {
    id: "react_114",
    type: "quiz",
    category: "Tests React",
    title: "Queries Testing Library",
    description: "Quelle query utiliser pour trouver un élément ?",
    options: [
      "getById — toujours utiliser les IDs",
      "getByRole — le plus accessible, simule comment l'utilisateur trouve les éléments",
      "querySelector — comme en vanilla JS",
      "getByClassName — trouver par classe CSS",
    ],
    correct: 1,
    explanation: "Testing Library recommande getByRole comme query principale car elle reflète l'accessibilité : comment un utilisateur (ou un screen reader) trouve les éléments. Les autres queries (getByText, getByLabelText, etc.) sont aussi utiles. Évitez les IDs et classes.",
  },

  // === ARCHITECTURE & BONNES PRATIQUES (115-120) ===
  {
    id: "react_115",
    type: "intro",
    category: "Architecture",
    title: "Architecture React à grande échelle",
    description: "Structurez des projets React professionnels.",
    content: `<h3>🏗️ Architecture React</h3>
<pre><code>src/
├── components/        // Composants réutilisables
│   ├── ui/            // Boutons, Input, Modal...
│   └── layout/        // Header, Footer, Sidebar
├── features/          // Feature-based modules
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── context/
│   └── dashboard/
├── hooks/             // Hooks globaux
├── contexts/          // Contexts globaux
├── services/          // API calls
├── utils/             // Helpers
├── types/             // TypeScript types
└── constants/</code></pre>
<p>Principes :</p>
<ul>
<li><strong>Feature-based</strong> — Grouper par fonctionnalité</li>
<li><strong>Composition</strong> — Petits composants composés</li>
<li><strong>Colocation</strong> — Tests et styles près du composant</li>
<li><strong>Single Responsibility</strong> — Un composant = une chose</li>
</ul>`,
  },
  {
    id: "react_116",
    type: "code",
    category: "Architecture",
    title: "Service API typé",
    description: "Créez un service API propre.",
    instruction: "Créez un module <code>apiService</code> avec une fonction <code>api(endpoint, options)</code> qui centralise les appels fetch avec gestion des erreurs, base URL, et headers. Ajoutez des méthodes <code>get</code>, <code>post</code>, <code>put</code>, <code>del</code>.",
    code_template: `// Service API centralisé
const BASE_URL = '/api';

`,
    solution: `const BASE_URL = '/api';

async function api(endpoint, options = {}) {
  const res = await fetch(BASE_URL + endpoint, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Erreur API');
  }
  return res.json();
}

const apiService = {
  get: (endpoint) => api(endpoint),
  post: (endpoint, data) => api(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint, data) => api(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  del: (endpoint) => api(endpoint, { method: 'DELETE' }),
};

export default apiService;`,
    tests: [
      { expected: "BASE_URL", type: "contains" },
      { expected: "async function api", type: "contains" },
      { expected: "get:", type: "contains" },
      { expected: "post:", type: "contains" },
    ],
  },
  {
    id: "react_117",
    type: "code",
    category: "Architecture",
    title: "Composant UI réutilisable",
    description: "Créez un Button configurable.",
    instruction: "Créez un composant <code>Button</code> avec les props : <code>variant</code> ('primary'|'secondary'|'danger'), <code>size</code> ('sm'|'md'|'lg'), <code>loading</code>, <code>disabled</code>, <code>children</code>, et <code>onClick</code>. Appliquez des styles dynamiques basés sur les props.",
    code_template: `// Composant Button réutilisable

`,
    solution: `function Button({ variant = 'primary', size = 'md', loading, disabled, children, onClick }) {
  const variants = {
    primary: { background: '#00d4ff', color: '#000' },
    secondary: { background: 'transparent', color: '#fff', border: '1px solid #333' },
    danger: { background: '#ff2244', color: '#fff' },
  };
  const sizes = { sm: { padding: '6px 12px', fontSize: 12 }, md: { padding: '10px 20px', fontSize: 14 }, lg: { padding: '14px 28px', fontSize: 16 } };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{ ...variants[variant], ...sizes[size], borderRadius: 8, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1 }}
    >
      {loading ? 'Chargement...' : children}
    </button>
  );
}`,
    tests: [
      { expected: "variant", type: "contains" },
      { expected: "size", type: "contains" },
      { expected: "loading", type: "contains" },
      { expected: "disabled", type: "contains" },
    ],
  },
  {
    id: "react_118",
    type: "code",
    category: "Architecture",
    title: "Custom Hook useApi",
    description: "Combinez fetch + state + loading + error.",
    instruction: "Créez un hook <code>useApi()</code> qui retourne une fonction <code>execute(endpoint, options)</code> plus les états <code>{data, loading, error}</code>. L'exécution est manuelle (pas automatique au mount). Gérez les 3 états proprement.",
    code_template: `import { useState, useCallback } from 'react';

// Hook useApi avec exécution manuelle
`,
    solution: `import { useState, useCallback } from 'react';

function useApi() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(endpoint, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
      });
      if (!res.ok) throw new Error('Erreur ' + res.status);
      const result = await res.json();
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, execute };
}`,
    tests: [
      { expected: "useApi", type: "contains" },
      { expected: "execute", type: "contains" },
      { expected: "setLoading", type: "contains" },
      { expected: "finally", type: "contains" },
    ],
  },
  {
    id: "react_119",
    type: "quiz",
    category: "Architecture",
    title: "Principe de composition",
    description: "Pourquoi la composition est-elle centrale en React ?",
    options: [
      "Parce que React ne supporte pas l'héritage",
      "Parce qu'assembler des petits composants spécialisés est plus flexible et maintenable que l'héritage",
      "Pour des raisons de performance uniquement",
      "C'est juste une convention, pas un principe",
    ],
    correct: 1,
    explanation: "React recommande la composition plutôt que l'héritage. De petits composants spécialisés qui s'assemblent (via children, props, render props) sont plus flexibles, testables et réutilisables que des hiérarchies de classes. Même la documentation officielle de React dit : 'Nous n'avons trouvé aucun cas où l'héritage est recommandé'.",
  },
  {
    id: "react_120",
    type: "code",
    category: "Architecture",
    title: "Projet final — Dashboard",
    description: "Assemblez tous les concepts.",
    instruction: "Créez un composant <code>Dashboard</code> qui utilise : un <strong>hook personnalisé</strong> useDashboardData pour fetch les données, <strong>useMemo</strong> pour les statistiques calculées, un <strong>Context</strong> pour le thème, et des <strong>sous-composants</strong> (StatCard, ActivityList). Structure modulaire et propre.",
    code_template: `import { useState, useEffect, useMemo, createContext, useContext } from 'react';

// Dashboard complet avec hooks, context, memo
`,
    solution: `import { useState, useEffect, useMemo, createContext, useContext } from 'react';

function useDashboardData() {
  const [data, setData] = useState({ stats: [], activities: [] });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setData({
        stats: [{ label: 'Exercices', value: 42 }, { label: 'XP', value: 1050 }],
        activities: [{ id: 1, text: 'Exercice React terminé', time: 'Il y a 2h' }],
      });
      setLoading(false);
    }, 500);
  }, []);
  return { data, loading };
}

function StatCard({ label, value }) {
  return <div style={{ padding: 16, border: '1px solid #333', borderRadius: 12 }}>
    <div style={{ fontSize: 24, fontWeight: 'bold' }}>{value}</div>
    <div style={{ fontSize: 12, opacity: 0.6 }}>{label}</div>
  </div>;
}

function Dashboard() {
  const { data, loading } = useDashboardData();
  const totalXp = useMemo(() => data.stats.reduce((s, stat) => s + stat.value, 0), [data.stats]);

  if (loading) return <div>Chargement...</div>;
  return (
    <div>
      <h1>Dashboard (Total: {totalXp})</h1>
      <div style={{ display: 'flex', gap: 16 }}>
        {data.stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>
      <ul>{data.activities.map(a => <li key={a.id}>{a.text} — {a.time}</li>)}</ul>
    </div>
  );
}`,
    tests: [
      { expected: "useDashboardData", type: "contains" },
      { expected: "useMemo", type: "contains" },
      { expected: "StatCard", type: "contains" },
      { expected: "Dashboard", type: "contains" },
    ],
  },
];

addExercises("react", exercises);
