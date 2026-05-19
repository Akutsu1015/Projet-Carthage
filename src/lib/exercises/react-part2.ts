import { addExercises } from "./registry";
import type { Exercise } from "./registry";

const exercises: Exercise[] = [
  // === useState (1-10) ===
  {
    id: "react_21",
    type: "intro",
    category: "useState",
    title: "Le Hook useState",
    description: "useState est le hook le plus utilisé — il permet de gérer l'état local d'un composant.",
    content: `<h3>🔄 useState — Gérer l'état</h3>
<p><code>useState</code> retourne un tableau avec deux éléments :</p>
<pre><code>const [count, setCount] = useState(0);
// count = la valeur actuelle (0 au départ)
// setCount = la fonction pour la modifier</code></pre>
<p>Règles des Hooks :</p>
<ul>
<li>Toujours appeler les hooks au <strong>niveau racine</strong> du composant</li>
<li><strong>Jamais</strong> dans des conditions, boucles ou fonctions imbriquées</li>
<li>Les hooks commencent toujours par <code>use</code></li>
</ul>
<p>Quand on appelle <code>setCount(newValue)</code>, React <strong>re-rend</strong> le composant avec la nouvelle valeur.</p>`,
  },
  {
    id: "react_22",
    type: "code",
    category: "useState",
    title: "Compteur simple",
    description: "Créez un compteur avec useState.",
    instruction: "Créez un composant <code>Counter</code> qui utilise <code>useState(0)</code> pour gérer un compteur. Affichez la valeur dans un <code>&lt;p&gt;</code> et ajoutez un <code>&lt;button&gt;</code> qui incrémente le compteur au clic avec <code>onClick</code>.",
    code_template: `import { useState } from 'react';

function Counter() {
  // Déclarez le state ici

  return (
    <div>
      {/* Affichez le compteur et le bouton */}
    </div>
  );
}`,
    solution: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}`,
    tests: [
      { type: "contains", expected: "useState(0)" },
      { type: "contains", expected: "setCount" },
      { type: "contains", expected: "onClick" },
      { type: "contains", expected: "{count}" },
    ],
    hint: "Déstructurez useState : const [count, setCount] = useState(0);",
    help_steps: [
      "Déclarez : const [count, setCount] = useState(0);",
      "Affichez {count} dans un <p>",
      "Ajoutez onClick={() => setCount(count + 1)} sur le bouton",
    ],
  },
  {
    id: "react_23",
    type: "quiz",
    category: "useState",
    title: "Mettre à jour le state",
    description: "Comment met-on à jour le state correctement ?",
    options: [
      "count = count + 1",
      "this.setState({ count: count + 1 })",
      "setCount(count + 1)",
      "useState(count + 1)",
    ],
    correct: 2,
    explanation: "On utilise la fonction setter retournée par useState. Modifier directement la variable (count = ...) ne déclenche pas de re-rendu. setCount() est la seule façon correcte de mettre à jour le state.",
  },
  {
    id: "react_24",
    type: "code",
    category: "useState",
    title: "Toggle boolean",
    description: "Basculez une valeur booléenne avec useState.",
    instruction: "Créez un composant <code>Toggle</code> avec un state <code>isOn</code> initialisé à <code>false</code>. Affichez un <code>&lt;button&gt;</code> qui affiche <strong>ON</strong> ou <strong>OFF</strong> selon l'état, et qui bascule la valeur au clic.",
    code_template: `import { useState } from 'react';

function Toggle() {
  // State booléen ici

  return (
    // Bouton qui bascule
  );
}`,
    solution: `import { useState } from 'react';

function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <button onClick={() => setIsOn(!isOn)}>
      {isOn ? "ON" : "OFF"}
    </button>
  );
}`,
    tests: [
      { type: "contains", expected: "useState(false)" },
      { type: "contains", expected: "setIsOn" },
      { type: "contains", expected: "!isOn" },
      { type: "contains", expected: "ON" },
      { type: "contains", expected: "OFF" },
    ],
    hint: "Utilisez setIsOn(!isOn) pour basculer, et un ternaire pour afficher ON ou OFF.",
  },
  {
    id: "react_25",
    type: "code",
    category: "useState",
    title: "State avec objet",
    description: "Gérez un objet dans le state.",
    instruction: "Créez un composant <code>Profile</code> avec un state <code>user</code> initialisé à <code>{ name: 'Jérémie', xp: 0 }</code>. Affichez le nom dans un <code>&lt;h2&gt;</code> et l'XP dans un <code>&lt;p&gt;</code>. Ajoutez un bouton <strong>+10 XP</strong> qui augmente l'XP de 10 en utilisant le <strong>spread operator</strong>.",
    code_template: `import { useState } from 'react';

function Profile() {
  const [user, setUser] = useState({ name: 'Jérémie', xp: 0 });

  return (
    <div>
      {/* Affichez name, xp et le bouton */}
    </div>
  );
}`,
    solution: `import { useState } from 'react';

function Profile() {
  const [user, setUser] = useState({ name: 'Jérémie', xp: 0 });

  return (
    <div>
      <h2>{user.name}</h2>
      <p>XP: {user.xp}</p>
      <button onClick={() => setUser({ ...user, xp: user.xp + 10 })}>+10 XP</button>
    </div>
  );
}`,
    tests: [
      { type: "contains", expected: "useState({ name:" },
      { type: "contains", expected: "{user.name}" },
      { type: "contains", expected: "{user.xp}" },
      { type: "contains", expected: "...user" },
    ],
    hint: "Pour modifier un objet dans le state, utilisez le spread : setUser({ ...user, xp: user.xp + 10 })",
  },
  {
    id: "react_26",
    type: "quiz",
    category: "useState",
    title: "Pourquoi le spread operator ?",
    description: "Pourquoi utilise-t-on { ...user, xp: newXp } au lieu de simplement modifier user.xp ?",
    options: [
      "C'est juste une convention, les deux fonctionnent",
      "React compare les références d'objets — il faut créer un nouvel objet pour déclencher un re-rendu",
      "Le spread operator est plus rapide en performance",
      "Sans spread, le code ne compile pas",
    ],
    correct: 1,
    explanation: "React utilise la comparaison de référence (===) pour détecter les changements. Si vous mutez l'objet existant, la référence ne change pas et React ne re-rend pas le composant. Il faut créer un nouvel objet.",
  },
  {
    id: "react_27",
    type: "code",
    category: "useState",
    title: "State avec tableau",
    description: "Gérez un tableau dans le state.",
    instruction: "Créez un composant <code>TodoList</code> avec un state <code>todos</code> initialisé à <code>['Apprendre React']</code>. Affichez les todos dans un <code>&lt;ul&gt;</code> et ajoutez un bouton <strong>Ajouter</strong> qui ajoute <code>'Nouveau todo'</code> au tableau.",
    code_template: `import { useState } from 'react';

function TodoList() {
  const [todos, setTodos] = useState(['Apprendre React']);

  return (
    <div>
      {/* Liste et bouton d'ajout */}
    </div>
  );
}`,
    solution: `import { useState } from 'react';

function TodoList() {
  const [todos, setTodos] = useState(['Apprendre React']);

  return (
    <div>
      <ul>
        {todos.map((todo, i) => <li key={i}>{todo}</li>)}
      </ul>
      <button onClick={() => setTodos([...todos, 'Nouveau todo'])}>Ajouter</button>
    </div>
  );
}`,
    tests: [
      { type: "contains", expected: "useState([" },
      { type: "contains", expected: ".map(" },
      { type: "contains", expected: "[...todos" },
      { type: "contains", expected: "setTodos" },
    ],
    hint: "Pour ajouter à un tableau : setTodos([...todos, 'nouvel item'])",
  },
  {
    id: "react_28",
    type: "puzzle",
    category: "useState",
    title: "Assemblez un compteur",
    description: "Remettez dans l'ordre les morceaux pour créer un compteur React.",
    pieces: [
      "import { useState } from 'react';",
      "function Counter() {",
      "  const [count, setCount] = useState(0);",
      "  return (",
      "    <button onClick={() => setCount(count + 1)}>",
      "      Clics: {count}",
      "    </button>",
      "  );",
      "}",
    ],
  },
  {
    id: "react_29",
    type: "code",
    category: "useState",
    title: "Mise à jour fonctionnelle",
    description: "Utilisez la forme fonctionnelle de setState.",
    instruction: "Créez un composant <code>SafeCounter</code> avec un compteur. Le bouton doit incrémenter en utilisant la <strong>forme fonctionnelle</strong> : <code>setCount(prev =&gt; prev + 1)</code> pour éviter les problèmes de closure.",
    code_template: `import { useState } from 'react';

function SafeCounter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => /* mise à jour fonctionnelle */}>
      {count}
    </button>
  );
}`,
    solution: `import { useState } from 'react';

function SafeCounter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(prev => prev + 1)}>
      {count}
    </button>
  );
}`,
    tests: [
      { type: "contains", expected: "prev =>" },
      { type: "contains", expected: "prev + 1" },
      { type: "contains", expected: "setCount" },
    ],
    hint: "setCount(prev => prev + 1) utilise la valeur précédente du state, garantissant l'exactitude même avec des mises à jour groupées.",
  },
  {
    id: "react_30",
    type: "code",
    category: "useState",
    title: "Input contrôlé",
    description: "Créez un champ de saisie contrôlé par le state.",
    instruction: "Créez un composant <code>SearchBar</code> avec un state <code>query</code> (chaîne vide). Affichez un <code>&lt;input&gt;</code> dont la <code>value</code> est liée au state et qui met à jour le state via <code>onChange</code>. Affichez aussi un <code>&lt;p&gt;</code> avec <strong>Recherche: {query}</strong>.",
    code_template: `import { useState } from 'react';

function SearchBar() {
  const [query, setQuery] = useState('');

  return (
    <div>
      {/* Input contrôlé + affichage */}
    </div>
  );
}`,
    solution: `import { useState } from 'react';

function SearchBar() {
  const [query, setQuery] = useState('');

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <p>Recherche: {query}</p>
    </div>
  );
}`,
    tests: [
      { type: "contains", expected: "value={query}" },
      { type: "contains", expected: "onChange" },
      { type: "contains", expected: "e.target.value" },
      { type: "contains", expected: "setQuery" },
    ],
    hint: "Un input contrôlé : value={state} + onChange={(e) => setState(e.target.value)}",
  },
  // === useEffect (11-20) ===
  {
    id: "react_31",
    type: "intro",
    category: "useEffect",
    title: "Le Hook useEffect",
    description: "useEffect permet d'exécuter des effets de bord dans les composants fonctionnels.",
    content: `<h3>⚡ useEffect — Effets de bord</h3>
<p><code>useEffect</code> s'exécute <strong>après le rendu</strong> du composant.</p>
<pre><code>// S'exécute à chaque rendu
useEffect(() => { console.log('Rendu !'); });

// S'exécute une seule fois (montage)
useEffect(() => { fetchData(); }, []);

// S'exécute quand 'count' change
useEffect(() => { document.title = count; }, [count]);

// Cleanup (démontage)
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id); // nettoyage
}, []);</code></pre>`,
  },
  {
    id: "react_32",
    type: "code",
    category: "useEffect",
    title: "Effect au montage",
    description: "Exécutez du code une seule fois au montage du composant.",
    instruction: "Créez un composant <code>WelcomeLog</code> qui utilise <code>useEffect</code> avec un tableau de dépendances vide <code>[]</code> pour afficher <code>console.log('Composant monté')</code> une seule fois au chargement.",
    code_template: `import { useEffect } from 'react';

function WelcomeLog() {
  // useEffect au montage

  return <p>Vérifiez la console</p>;
}`,
    solution: `import { useEffect } from 'react';

function WelcomeLog() {
  useEffect(() => {
    console.log('Composant monté');
  }, []);

  return <p>Vérifiez la console</p>;
}`,
    tests: [
      { type: "contains", expected: "useEffect(" },
      { type: "contains", expected: "console.log" },
      { type: "contains", expected: "Composant monté" },
      { type: "contains", expected: ", [])" },
    ],
    hint: "useEffect(() => { ... }, []) — le tableau vide [] signifie 'exécuter une seule fois au montage'.",
  },
  {
    id: "react_33",
    type: "quiz",
    category: "useEffect",
    title: "Tableau de dépendances",
    description: "Que se passe-t-il si on omet le tableau de dépendances ?",
    options: [
      "L'effect ne s'exécute jamais",
      "L'effect s'exécute une seule fois",
      "L'effect s'exécute à chaque rendu du composant",
      "L'effect s'exécute uniquement au démontage",
    ],
    correct: 2,
    explanation: "Sans tableau de dépendances, useEffect s'exécute après chaque rendu. Avec [] il s'exécute une fois. Avec [dep1, dep2] il s'exécute quand ces dépendances changent.",
  },
  {
    id: "react_34",
    type: "code",
    category: "useEffect",
    title: "Effect avec dépendance",
    description: "Réagissez au changement d'une valeur de state.",
    instruction: "Créez un composant <code>TitleUpdater</code> avec un state <code>count</code>. Utilisez <code>useEffect</code> avec <code>[count]</code> comme dépendance pour mettre à jour <code>document.title</code> avec <code>`Compteur: ${count}`</code>.",
    code_template: `import { useState, useEffect } from 'react';

function TitleUpdater() {
  const [count, setCount] = useState(0);

  // Effect qui met à jour le titre du document

  return (
    <button onClick={() => setCount(count + 1)}>
      Compteur: {count}
    </button>
  );
}`,
    solution: `import { useState, useEffect } from 'react';

function TitleUpdater() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`Compteur: \${count}\`;
  }, [count]);

  return (
    <button onClick={() => setCount(count + 1)}>
      Compteur: {count}
    </button>
  );
}`,
    tests: [
      { type: "contains", expected: "useEffect(" },
      { type: "contains", expected: "document.title" },
      { type: "contains", expected: "[count]" },
    ],
    hint: "useEffect(() => { document.title = ... }, [count]) — s'exécute quand count change.",
  },
  {
    id: "react_35",
    type: "code",
    category: "useEffect",
    title: "Cleanup function",
    description: "Nettoyez les ressources avec la fonction de retour de useEffect.",
    instruction: "Créez un composant <code>Timer</code> qui utilise <code>useEffect</code> pour démarrer un <code>setInterval</code> chaque seconde et le nettoyer avec <code>clearInterval</code> dans la fonction de retour.",
    code_template: `import { useState, useEffect } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // Démarrez l'intervalle et retournez le cleanup
  }, []);

  return <p>Temps: {seconds}s</p>;
}`,
    solution: `import { useState, useEffect } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return <p>Temps: {seconds}s</p>;
}`,
    tests: [
      { type: "contains", expected: "setInterval" },
      { type: "contains", expected: "clearInterval" },
      { type: "contains", expected: "return ()" },
    ],
    hint: "Retournez une fonction depuis useEffect pour le cleanup : return () => clearInterval(id);",
  },
  {
    id: "react_36",
    type: "puzzle",
    category: "useEffect",
    title: "Assemblez un useEffect",
    description: "Remettez dans l'ordre pour créer un effect avec fetch au montage.",
    pieces: [
      "useEffect(() => {",
      "  fetch('/api/data')",
      "    .then(res => res.json())",
      "    .then(data => setData(data));",
      "}, []);",
    ],
  },
  {
    id: "react_37",
    type: "code",
    category: "useEffect",
    title: "Fetch de données",
    description: "Chargez des données depuis une API au montage.",
    instruction: "Créez un composant <code>DataLoader</code> avec un state <code>data</code> (null) et <code>loading</code> (true). Au montage, faites un <code>fetch('/api/warriors')</code>, parsez le JSON, mettez à jour <code>data</code> et passez <code>loading</code> à false.",
    code_template: `import { useState, useEffect } from 'react';

function DataLoader() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch au montage

  if (loading) return <p>Chargement...</p>;
  return <pre>{JSON.stringify(data)}</pre>;
}`,
    solution: `import { useState, useEffect } from 'react';

function DataLoader() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/warriors')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement...</p>;
  return <pre>{JSON.stringify(data)}</pre>;
}`,
    tests: [
      { type: "contains", expected: "useEffect(" },
      { type: "contains", expected: "fetch(" },
      { type: "contains", expected: "setData" },
      { type: "contains", expected: "setLoading(false)" },
      { type: "contains", expected: ", [])" },
    ],
    hint: "fetch().then(res => res.json()).then(data => { setData(data); setLoading(false); })",
  },
  {
    id: "react_38",
    type: "quiz",
    category: "useEffect",
    title: "Boucle infinie avec useEffect",
    description: "Quel code provoque une boucle infinie ?",
    options: [
      "useEffect(() => { setCount(1); }, []);",
      "useEffect(() => { setCount(count + 1); }, [count]);",
      "useEffect(() => { console.log(count); }, [count]);",
      "useEffect(() => { setCount(1); }, [someOtherValue]);",
    ],
    correct: 1,
    explanation: "setCount(count + 1) avec [count] en dépendance crée une boucle : le count change → l'effect se relance → le count change → ... à l'infini. La option A ne boucle pas car elle met toujours 1 (pas de changement après le premier).",
  },
  {
    id: "react_39",
    type: "code",
    category: "useEffect",
    title: "Debounce avec useEffect",
    description: "Implémentez un debounce sur une recherche.",
    instruction: "Créez un composant <code>DebouncedSearch</code> avec un state <code>query</code> et <code>debouncedQuery</code>. Utilisez <code>useEffect</code> pour mettre à jour <code>debouncedQuery</code> après 500ms quand <code>query</code> change, avec un cleanup qui annule le timeout.",
    code_template: `import { useState, useEffect } from 'react';

function DebouncedSearch() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Effect avec debounce

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <p>Recherche: {debouncedQuery}</p>
    </div>
  );
}`,
    solution: `import { useState, useEffect } from 'react';

function DebouncedSearch() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <p>Recherche: {debouncedQuery}</p>
    </div>
  );
}`,
    tests: [
      { type: "contains", expected: "setTimeout" },
      { type: "contains", expected: "clearTimeout" },
      { type: "contains", expected: "[query]" },
      { type: "contains", expected: "setDebouncedQuery" },
    ],
    hint: "setTimeout + clearTimeout dans le cleanup de useEffect = debounce.",
  },
  {
    id: "react_40",
    type: "quiz",
    category: "useEffect",
    title: "Ordre d'exécution",
    description: "Dans quel ordre s'exécutent ces éléments ?",
    options: [
      "useEffect → render → cleanup",
      "render → useEffect → (au prochain rendu: cleanup → useEffect)",
      "cleanup → render → useEffect",
      "render → cleanup → useEffect",
    ],
    correct: 1,
    explanation: "Le composant se rend d'abord (render), puis useEffect s'exécute. Lors du prochain rendu, le cleanup du useEffect précédent s'exécute avant le nouvel useEffect.",
  },
];

addExercises("react", exercises);
