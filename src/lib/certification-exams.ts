/**
 * Certification exam questions per module.
 * Each module has 15 questions; a passing score is 10/15 (67%).
 * Questions are multiple-choice with 4 options each.
 */

export interface CertQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number; // 0-3 index
}

export interface CertExam {
  moduleId: string;
  moduleName: string;
  price: number; // in EUR
  stripePriceId: string; // Stripe price ID
  questions: CertQuestion[];
}

const EXAMS: CertExam[] = [
  {
    moduleId: "frontend",
    moduleName: "HTML & CSS",
    price: 49,
    stripePriceId: "price_1TYsuuPH9TwBFjLwiK7Zc8VD",
    questions: [
      { id: 1, question: "Quelle balise définit le titre principal d'une page HTML ?", options: ["<title>", "<h1>", "<header>", "<head>"], correct: 1 },
      { id: 2, question: "Quelle propriété CSS change la couleur du texte ?", options: ["font-color", "text-color", "color", "foreground"], correct: 2 },
      { id: 3, question: "Comment inclure un fichier CSS externe ?", options: ["<style src>", "<link rel='stylesheet'>", "<css>", "<import>"], correct: 1 },
      { id: 4, question: "Quelle est la valeur par défaut de position en CSS ?", options: ["relative", "absolute", "static", "fixed"], correct: 2 },
      { id: 5, question: "Quelle balise crée un lien hypertexte ?", options: ["<link>", "<a>", "<href>", "<url>"], correct: 1 },
      { id: 6, question: "Comment centrer un élément block horizontalement ?", options: ["text-align: center", "margin: 0 auto", "align: center", "float: center"], correct: 1 },
      { id: 7, question: "Quelle propriété définit l'espacement intérieur d'un élément ?", options: ["margin", "spacing", "padding", "border"], correct: 2 },
      { id: 8, question: "Quelle balise crée une liste non ordonnée ?", options: ["<ol>", "<ul>", "<li>", "<list>"], correct: 1 },
      { id: 9, question: "Quelle unité CSS est relative à la taille de la police de l'élément parent ?", options: ["px", "rem", "em", "%"], correct: 2 },
      { id: 10, question: "Comment rendre un élément invisible mais garder sa place ?", options: ["display: none", "visibility: hidden", "opacity: 0", "position: absolute"], correct: 1 },
      { id: 11, question: "Quelle balise définit les métadonnées d'une page ?", options: ["<body>", "<meta>", "<head>", "<title>"], correct: 2 },
      { id: 12, question: "Quel sélecteur CSS cible un élément par son ID ?", options: [".id", "#id", "*id", "@id"], correct: 1 },
      { id: 13, question: "Quelle propriété CSS crée un flexbox ?", options: ["display: flex", "display: block", "display: grid", "display: inline"], correct: 0 },
      { id: 14, question: "Quelle balise insère une image ?", options: ["<img>", "<image>", "<pic>", "<src>"], correct: 0 },
      { id: 15, question: "Quelle propriété définit la largeur de la bordure ?", options: ["border-width", "border-size", "border-thickness", "border-length"], correct: 0 },
    ],
  },
  {
    moduleId: "javascript",
    moduleName: "JavaScript",
    price: 49,
    stripePriceId: "price_1TYsuxPH9TwBFjLwx5oAdiw6",
    questions: [
      { id: 1, question: "Quel mot-clé déclare une variable non réassignable ?", options: ["var", "let", "const", "static"], correct: 2 },
      { id: 2, question: "Que retourne typeof null ?", options: ["'null'", "'undefined'", "'object'", "'boolean'"], correct: 2 },
      { id: 3, question: "Quelle méthode ajoute un élément à la fin d'un tableau ?", options: ["push()", "pop()", "shift()", "unshift()"], correct: 0 },
      { id: 4, question: "Comment convertir une chaîne en nombre entier ?", options: ["Number.toInt()", "parseInt()", "int()", "toNumber()"], correct: 1 },
      { id: 5, question: "Quelle est la sortie de : console.log(2 + '2') ?", options: ["4", "22", "NaN", "Error"], correct: 1 },
      { id: 6, question: "Quelle méthode parcourt chaque élément d'un tableau ?", options: ["map()", "forEach()", "filter()", "Toutes ces réponses"], correct: 3 },
      { id: 7, question: "Comment créer une fonction fléchée ?", options: ["function => {}", "() => {}", "fn() {}", "lambda() {}"], correct: 1 },
      { id: 8, question: "Que fait le mot-clé 'async' ?", options: ["Rend la fonction synchrone", "Indique une fonction retournant une Promise", "Bloque l'exécution", "Crée un thread"], correct: 1 },
      { id: 9, question: "Quelle méthode transforme un JSON en objet JS ?", options: ["JSON.parse()", "JSON.stringify()", "JSON.decode()", "JSON.toObject()"], correct: 0 },
      { id: 10, question: "Comment accéder à la propriété 'name' d'un objet ?", options: ["obj.name", "obj->name", "obj[name]", "Les réponses 1 et 3"], correct: 3 },
      { id: 11, question: "Quelle est la portée de 'let' ?", options: ["Globale", "De fonction", "De bloc", "De module"], correct: 2 },
      { id: 12, question: "Que retourne [1,2,3].filter(x => x > 1) ?", options: ["[1]", "[2, 3]", "[1, 2]", "true"], correct: 1 },
      { id: 13, question: "Comment vérifier si un tableau inclut une valeur ?", options: ["has()", "includes()", "contains()", "indexOf()"], correct: 1 },
      { id: 14, question: "Qu'est-ce que le destructuring ?", options: ["Détruire un objet", "Extraire des valeurs d'un tableau/objet", "Supprimer une variable", "Casser une boucle"], correct: 1 },
      { id: 15, question: "Quelle méthode retourne une Promise après un délai ?", options: ["setTimeout()", "delay()", "sleep()", "wait()"], correct: 0 },
    ],
  },
  {
    moduleId: "python",
    moduleName: "Python",
    price: 49,
    stripePriceId: "price_1TYsuzPH9TwBFjLw07NQIS3S",
    questions: [
      { id: 1, question: "Comment définir une fonction en Python ?", options: ["function f():", "def f():", "fn f():", "func f():"], correct: 1 },
      { id: 2, question: "Quel type est immuable en Python ?", options: ["list", "dict", "tuple", "set"], correct: 2 },
      { id: 3, question: "Comment insérer un élément à la fin d'une liste ?", options: ["insert()", "add()", "append()", "push()"], correct: 2 },
      { id: 4, question: "Que retourne len([1,2,3]) ?", options: ["2", "3", "4", "Error"], correct: 1 },
      { id: 5, question: "Comment créer un dictionnaire ?", options: ["dict = []", "dict = {}", "dict = ()", "dict = <>"], correct: 1 },
      { id: 6, question: "Quel mot-clé gère les exceptions ?", options: ["catch", "handle", "except", "rescue"], correct: 2 },
      { id: 7, question: "Comment écrire un commentaire sur une ligne ?", options: ["// comment", "# comment", "/* comment */", "-- comment"], correct: 1 },
      { id: 8, question: "Que fait range(5) ?", options: ["Crée [0,1,2,3,4]", "Crée [1,2,3,4,5]", "Crée [0,1,2,3,4,5]", "Erreur"], correct: 0 },
      { id: 9, question: "Comment ouvrir un fichier en lecture ?", options: ["open(f, 'r')", "read(f)", "fopen(f)", "file(f, 'read')"], correct: 0 },
      { id: 10, question: "Quelle méthode convertit une chaîne en minuscules ?", options: [".lower()", ".toLower()", ".min()", ".downcase()"], correct: 0 },
      { id: 11, question: "Comment créer une classe ?", options: ["class Name:", "struct Name:", "type Name:", "object Name:"], correct: 0 },
      { id: 12, question: "Que signifie 'self' dans une méthode ?", options: ["La classe", "L'instance courante", "Le module", "Le parent"], correct: 1 },
      { id: 13, question: "Comment importer un module ?", options: ["include math", "import math", "require math", "using math"], correct: 1 },
      { id: 14, question: "Quel opérateur est la puissance ?", options: ["^", "**", "pow", "%%"], correct: 1 },
      { id: 15, question: "Comment créer une liste par compréhension ?", options: ["[x for x in range(5)]", "list(range(5))", "map(range(5))", "for x in 5: [x]"], correct: 0 },
    ],
  },
  {
    moduleId: "react",
    moduleName: "React",
    price: 59,
    stripePriceId: "price_1TYsv3PH9TwBFjLwBG9sLWhC",
    questions: [
      { id: 1, question: "Quel hook gère l'état local ?", options: ["useEffect", "useState", "useRef", "useContext"], correct: 1 },
      { id: 2, question: "Comment passer des données d'un parent à un enfant ?", options: ["State", "Props", "Context", "Redux"], correct: 1 },
      { id: 3, question: "Quel hook exécute un effet de bord ?", options: ["useState", "useMemo", "useEffect", "useCallback"], correct: 2 },
      { id: 4, question: "Comment créer un composant React ?", options: ["class Component", "function Component()", "Les deux", "component create()"], correct: 2 },
      { id: 5, question: "Quelle méthode rend un composant dans le DOM ?", options: ["ReactDOM.render()", "React.mount()", "Component.show()", "React.display()"], correct: 0 },
      { id: 6, question: "Comment optimiser un calcul coûteux ?", options: ["useEffect", "useMemo", "useRef", "useState"], correct: 1 },
      { id: 7, question: "Que fait le hook useRef ?", options: ["Gère l'état", "Crée une référence persistante", "Exécute un effet", "Mémorise une fonction"], correct: 1 },
      { id: 8, question: "Comment partager l'état entre composants distants ?", options: ["Props", "Context API", "useState", "useEffect"], correct: 1 },
      { id: 9, question: "Qu'est-ce que JSX ?", options: ["Un langage serveur", "Une syntaxe XML pour React", "Un framework CSS", "Un bundler"], correct: 1 },
      { id: 10, question: "Comment empêcher un re-rendu inutile d'un composant enfant ?", options: ["shouldComponentUpdate", "React.memo", "useEffect", "useCallback"], correct: 1 },
      { id: 11, question: "Quel hook mémorise une fonction ?", options: ["useMemo", "useCallback", "useRef", "useEffect"], correct: 1 },
      { id: 12, question: "Comment gérer un formulaire contrôlé ?", options: ["value + onChange", "bind + submit", "ref + validate", "state + dispatch"], correct: 0 },
      { id: 13, question: "Qu'est-ce qu'un fragment React ?", options: ["Un composant", "Un wrapper sans DOM", "Un hook", "Un provider"], correct: 1 },
      { id: 14, question: "Comment lister des éléments avec une clé ?", options: ["key={index}", "key={item.id}", "Les deux fonctionnent", "Pas besoin de clé"], correct: 1 },
      { id: 15, question: "Quelle est la différence entre useEffect et useLayoutEffect ?", options: ["Aucune", "useLayoutEffect est synchrone", "useEffect est synchrone", "useLayoutEffect est async"], correct: 1 },
    ],
  },
  {
    moduleId: "nodejs",
    moduleName: "Node.js",
    price: 59,
    stripePriceId: "price_1TYsv6PH9TwBFjLw7Yv7MaHm",
    questions: [
      { id: 1, question: "Quel module crée un serveur HTTP ?", options: ["http", "server", "express", "net"], correct: 0 },
      { id: 2, question: "Comment lire un fichier de manière asynchrone ?", options: ["fs.readFileSync()", "fs.readFile()", "fs.read()", "fs.openFile()"], correct: 1 },
      { id: 3, question: "Quel objet contient les paramètres de requête en Express ?", options: ["req.params", "req.query", "Les deux", "req.body"], correct: 2 },
      { id: 4, question: "Comment exporter un module ?", options: ["export default", "module.exports", "export =", "return"], correct: 1 },
      { id: 5, question: "Quelle méthode Express gère les requêtes POST ?", options: ["app.get()", "app.post()", "app.put()", "app.send()"], correct: 1 },
      { id: 6, question: "Qu'est-ce que le middleware en Express ?", options: ["Un routeur", "Une fonction entre requête et réponse", "Un template", "Un logger"], correct: 1 },
      { id: 7, question: "Comment installer un package localement ?", options: ["npm install pkg", "npm global pkg", "npm add -g pkg", "npm save pkg"], correct: 0 },
      { id: 8, question: "Quel fichier liste les dépendances ?", options: ["package.json", "node_modules", "npm.config", "install.json"], correct: 0 },
      { id: 9, question: "Comment gérer les variables d'environnement ?", options: ["process.env", "env.get()", "config.env", "settings.env"], correct: 0 },
      { id: 10, question: "Qu'est-ce que npm run ?", options: ["Un installateur", "Un exécuteur de scripts", "Un compilateur", "Un bundler"], correct: 1 },
      { id: 11, question: "Comment créer un stream lisible ?", options: ["fs.createReadStream()", "fs.readStream()", "new Stream()", "fs.openStream()"], correct: 0 },
      { id: 12, question: "Quel framework est le plus populaire pour les API REST ?", options: ["Koa", "Express", "Fastify", "Hapi"], correct: 1 },
      { id: 13, question: "Comment parser le body JSON en Express ?", options: ["bodyParser()", "express.json()", "JSON.parse(req)", "req.json()"], correct: 1 },
      { id: 14, question: "Que fait next() dans un middleware ?", options: ["Termine la requête", "Passe au middleware suivant", "Redémarre", "Envoie la réponse"], correct: 1 },
      { id: 15, question: "Comment démarrer un projet Node.js ?", options: ["node start", "npm init", "node init", "npm begin"], correct: 1 },
    ],
  },
  {
    moduleId: "csharp",
    moduleName: "C# .NET",
    price: 59,
    stripePriceId: "price_1TYsv8PH9TwBFjLwSybcIwBO",
    questions: [
      { id: 1, question: "Comment déclarer une variable entière ?", options: ["int x = 5;", "var x: int = 5;", "integer x = 5;", "let x = 5;"], correct: 0 },
      { id: 2, question: "Quel mot-clé définit une classe ?", options: ["struct", "class", "type", "object"], correct: 1 },
      { id: 3, question: "Comment gérer les exceptions ?", options: ["try/catch", "if/error", "handle/except", "begin/rescue"], correct: 0 },
      { id: 4, question: "Qu'est-ce qu'une propriété auto-implémentée ?", options: ["public int X { get; set; }", "public int X;", "int X()", "property X"], correct: 0 },
      { id: 5, question: "Quel est le type pour une chaîne de caractères ?", options: ["String", "string", "Les deux", "text"], correct: 2 },
      { id: 6, question: "Comment créer une liste générique ?", options: ["List<int>", "Array<int>", "int[]", "Collection<int>"], correct: 0 },
      { id: 7, question: "Quel mot-clé empêche l'héritage ?", options: ["static", "sealed", "abstract", "private"], correct: 1 },
      { id: 8, question: "Qu'est-ce que LINQ ?", options: ["Un ORM", "Un langage de requête intégré", "Un framework", "Un serveur"], correct: 1 },
      { id: 9, question: "Comment itérer sur une collection ?", options: ["for each", "foreach", "iterate", "loop"], correct: 1 },
      { id: 10, question: "Qu'est-ce qu'un delegate ?", options: ["Un événement", "Un pointeur de fonction", "Une interface", "Un type anonyme"], correct: 1 },
      { id: 11, question: "Comment créer une méthode asynchrone ?", options: ["async Task", "await void", "promise", "deferred"], correct: 0 },
      { id: 12, question: "Quel modificateur rend un membre accessible partout ?", options: ["private", "protected", "internal", "public"], correct: 3 },
      { id: 13, question: "Qu'est-ce que l'injection de dépendances ?", options: ["Un pattern de création", "Inversion de contrôle", "Un framework", "Un test"], correct: 1 },
      { id: 14, question: "Comment lire un fichier texte ?", options: ["File.Read()", "File.ReadAllText()", "StreamReader.New()", "fs.readFile()"], correct: 1 },
      { id: 15, question: "Qu'est-ce qu'un record en C# 9+ ?", options: ["Un type référence immuable", "Un log", "Une base de données", "Un struct"], correct: 0 },
    ],
  },
  {
    moduleId: "cpp",
    moduleName: "C/C++",
    price: 59,
    stripePriceId: "price_1TYsvAPH9TwBFjLwg2pbn9Km",
    questions: [
      { id: 1, question: "Comment allouer dynamiquement un entier en C++ ?", options: ["malloc(sizeof(int))", "new int", "int alloc()", "alloc(int)"], correct: 1 },
      { id: 2, question: "Quelle bibliothèque pour std::cout ?", options: ["<stdio.h>", "<iostream>", "<console>", "<print>"], correct: 1 },
      { id: 3, question: "Comment déclarer un pointeur ?", options: ["int &x", "int *x", "int x*", "ptr<int> x"], correct: 1 },
      { id: 4, question: "Qu'est-ce qu'une référence ?", options: ["Un pointeur null", "Un alias vers une variable", "Une copie", "Un type"], correct: 1 },
      { id: 5, question: "Comment définir une classe en C++ ?", options: ["class Name { }", "struct Name { }", "object Name { }", "type Name { }"], correct: 0 },
      { id: 6, question: "Qu'est-ce qu'un constructeur ?", options: ["Un destructeur", "Une méthode d'initialisation", "Un opérateur", "Un accesseur"], correct: 1 },
      { id: 7, question: "Quel mot-clé empêche la modification ?", options: ["static", "const", "final", "readonly"], correct: 1 },
      { id: 8, question: "Qu'est-ce qu'un smart pointer ?", options: ["Un pointeur intelligent", "Un pointeur brut", "Un pointeur nul", "Un itérateur"], correct: 0 },
      { id: 9, question: "Comment inclure un fichier d'en-tête standard ?", options: ["#include <header>", "import header", "require header", "using header"], correct: 0 },
      { id: 10, question: "Quelle est la sortie de : cout << 5/2 ?", options: ["2.5", "2", "3", "Erreur"], correct: 1 },
      { id: 11, question: "Qu'est-ce que la STL ?", options: ["Standard Template Library", "Simple Type Language", "Static Type Linker", "Standard Type Logic"], correct: 0 },
      { id: 12, question: "Comment parcourir un vecteur en C++ moderne ?", options: ["for (auto& x : vec)", "for each (x in vec)", "vec.forEach()", "for (x of vec)"], correct: 0 },
      { id: 13, question: "Qu'est-ce que virtual permet ?", options: ["Le polymorphisme", "L'encapsulation", "L'abstraction", "La compilation"], correct: 0 },
      { id: 14, question: "Comment gérer la mémoire en C ?", options: ["new/delete", "malloc/free", "alloc/release", "create/destroy"], correct: 1 },
      { id: 15, question: "Qu'est-ce qu'un namespace ?", options: ["Une classe", "Un espace de noms", "Un package", "Un module"], correct: 1 },
    ],
  },
  {
    moduleId: "dart",
    moduleName: "Dart & Flutter",
    price: 59,
    stripePriceId: "price_1TYsvDPH9TwBFjLwQDoQBL4T",
    questions: [
      { id: 1, question: "Comment déclarer une variable finale ?", options: ["final x = 5", "const x = 5", "var x = 5", "let x = 5"], correct: 0 },
      { id: 2, question: "Quel widget est la base d'une app Flutter ?", options: ["StatelessWidget", "Widget", "Component", "View"], correct: 0 },
      { id: 3, question: "Comment créer un widget avec état ?", options: ["StatelessWidget", "StatefulWidget", "StatefulView", "DynamicWidget"], correct: 1 },
      { id: 4, question: "Qu'est-ce que le hot reload ?", options: ["Redémarrage complet", "Mise à jour instantanée du code", "Compilation", "Déploiement"], correct: 1 },
      { id: 5, question: "Comment naviguer entre les pages ?", options: ["Navigator.push()", "Router.go()", "Navigation.move()", "Page.switch()"], correct: 0 },
      { id: 6, question: "Quel type Dart est nullable par défaut en Dart 3 ?", options: ["Tous les types", "Aucun (null safety)", "String", "int"], correct: 1 },
      { id: 7, question: "Comment créer une colonne de widgets ?", options: ["Column()", "Row()", "Stack()", "List()"], correct: 0 },
      { id: 8, question: "Qu'est-ce qu'un Future ?", options: ["Un type", "Une promesse asynchrone", "Un widget", "Un état"], correct: 1 },
      { id: 9, question: "Comment attendre un Future ?", options: ["wait()", "await", "then()", "Les réponses 2 et 3"], correct: 3 },
      { id: 10, question: "Quel package est essentiel pour HTTP ?", options: ["http", "dio", "fetch", "request"], correct: 0 },
      { id: 11, question: "Comment gérer l'état global ?", options: ["setState", "Provider/Riverpod", "Context", "Props"], correct: 1 },
      { id: 12, question: "Qu'est-ce qu'un Stream ?", options: ["Une liste", "Un flux d'événements asynchrones", "Un fichier", "Un widget"], correct: 1 },
      { id: 13, question: "Comment styliser un texte ?", options: ["TextStyle()", "CSS", "Style()", "Font()"], correct: 0 },
      { id: 14, question: "Quel widget défile verticalement ?", options: ["Column", "ListView", "Row", "Container"], correct: 1 },
      { id: 15, question: "Comment tester un widget ?", options: ["testWidgets()", "unit()", "assert()", "verify()"], correct: 0 },
    ],
  },
];

export function getExam(moduleId: string): CertExam | undefined {
  return EXAMS.find(e => e.moduleId === moduleId);
}

export function getAllExams(): CertExam[] {
  return EXAMS;
}

export function gradeExam(moduleId: string, answers: Record<number, number>): { score: number; maxScore: number; passed: boolean; results: Record<number, boolean> } {
  const exam = getExam(moduleId);
  if (!exam) return { score: 0, maxScore: 0, passed: false, results: {} };
  let score = 0;
  const results: Record<number, boolean> = {};
  for (const q of exam.questions) {
    const correct = answers[q.id] === q.correct;
    results[q.id] = correct;
    if (correct) score++;
  }
  return { score, maxScore: exam.questions.length, passed: score >= Math.ceil(exam.questions.length * 0.67), results };
}

export const PASSING_PERCENT = 67;
