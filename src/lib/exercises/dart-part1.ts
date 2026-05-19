import { addExercises } from "./registry";
import type { Exercise } from "./registry";

// @ts-nocheck — Auto-converted from exercises-dart-part1.js
const exercises: Exercise[] = [
    // === DUOLINGO SYSTEM (Intro, Quiz, Puzzle) ===
    {
      id: "dart_intro_0",
      type: "intro",
      title: "Bienvenue en Dart !",
      description: "Le langage derrière Flutter.",
      content: "<p>Bienvenue dans votre formation <strong>Dart</strong> ! Conçu par Google, Dart est un langage moderne, pensé pour le développement d'interfaces fluides et rapides.</p><p>Associé au framework Flutter, Dart permet de créer des applications mobiles natives pour iOS et Android à partir d'un seul code !</p><p>Commençons l'aventure mobile.</p>",
      category: "Général",
      code_example: "void main() {\n  print(\"Prêt ! \");\n}",
    },
    {
      id: "dart_quiz_0",
      type: "quiz",
      title: "Tester vos connaissances",
      instruction: "Pourquoi Dart est-il particulièrement populaire aujourd'hui ?",
      options: [
        "Parce qu'il remplace le langage Python en Intelligence Artificielle",
        "Parce que c'est le seul langage accepté sur les serveurs Google",
        "Parce qu'il est le langage du framework Flutter pour faire des applications mobiles hybrides",
        "Parce qu'il sert à styliser les pages web comme le CSS"
      ],
      correct: 2,
      explanation: "Exact ! Dart a connu un essor incroyable grâce à Flutter, qui permet de faire des applications pour iOS, Android et le Web depuis la même base de code.",
      category: "Général",
    },
    {
      id: "dart_puzzle_0",
      type: "puzzle",
      title: "Premier puzzle Dart",
      instruction: "Construisez la fonction principale d'un programme Dart :",
      pieces: ["void", "main", "()", "{", "}", "print(\"Hi\");"],
      hint: "Syntaxe : void main() { code; }",
      category: "Général",
    },

    // ─── INTRO: Bienvenue ──────────────────────────────────────────
    {
      id: "dart_1", type: "intro", category: "Dart - Introduction",
      title: "Bienvenue dans Dart & Flutter !",
      description: "Découvrez le monde du développement mobile avec Dart et Flutter.",
      content: `
        <h5 style="color:#0175C2;">📱 Dart & Flutter, c'est quoi ?</h5>
        <p><strong>Dart</strong> est un langage de programmation créé par Google, optimisé pour construire des interfaces utilisateur rapides sur toutes les plateformes.</p>
        <p><strong>Flutter</strong> est un framework UI qui utilise Dart pour créer des applications <em>nativement compilées</em> pour mobile, web et desktop à partir d'un seul code source.</p>
        <div style="background:rgba(2,86,155,0.1);border-radius:8px;padding:1rem;margin-top:1rem;">
          <strong>🎮 Votre parcours (~80 niveaux) :</strong><br>
          Niveaux 1-25 : <strong>Dart</strong> — Syntaxe, variables, fonctions, classes<br>
          Niveaux 26-55 : <strong>Flutter</strong> — Widgets, layouts, navigation, état<br>
          Niveaux 56-80 : <strong>Projet Endless Runner</strong> — Construisez un vrai jeu mobile !
        </div>
        <p class="mt-3"><strong>💡 Astuce :</strong> Les exercices puzzle et code sont connectés à l'<strong>émulateur Android</strong> intégré. Activez-le avec le bouton vert en haut !</p>
      `
    },
    {
      id: "dart_2", type: "intro", category: "Dart - Introduction",
      title: "Qu'est-ce que Dart ?",
      description: "Dart — Le langage derrière Flutter",
      content: `
        <h5 style="color:#0175C2;">🎯 Dart — Un langage moderne et performant</h5>
        <p><strong>Dart</strong> est un langage :</p>
        <ul>
          <li><strong>Fortement typé</strong> — Détecte les erreurs avant l'exécution</li>
          <li><strong>Orienté objet</strong> — Tout est un objet</li>
          <li><strong>Compilé AOT & JIT</strong> — Rapide en production, rechargement à chaud en dev</li>
          <li><strong>Null-safe</strong> — Protection contre les erreurs null</li>
        </ul>
        <p>Dart ressemble à <strong>Java</strong>, <strong>C#</strong> et <strong>JavaScript</strong>. Si vous connaissez l'un de ces langages, vous serez vite à l'aise !</p>
      `,
      code_example: `void main() {\n  print('Hello, Dart!');\n}`
    },
    // ─── QUIZ: Bases Dart ──────────────────────────────────────────
    {
      id: "dart_3", type: "quiz", category: "Dart - Introduction",
      title: "Qui a créé Dart ?",
      description: "Testez vos connaissances sur l'origine de Dart.",
      instruction: "Quelle entreprise a créé le langage Dart ?",
      options: ["Google", "Apple", "Microsoft", "Facebook"],
      correct: 0,
      explanation: "Dart a été créé par Google et présenté en 2011. Il est le langage principal de Flutter."
    },
    {
      id: "dart_4", type: "quiz", category: "Dart - Introduction",
      title: "Rôle de Flutter",
      description: "Comprendre ce qu'est Flutter.",
      instruction: "Qu'est-ce que Flutter ?",
      options: [
        "Un framework UI pour créer des apps multiplateformes",
        "Un système d'exploitation mobile",
        "Un langage de programmation",
        "Un éditeur de code"
      ],
      correct: 0,
      explanation: "Flutter est un framework UI open-source de Google pour créer des apps compilées nativement à partir d'un seul code."
    },
    {
      id: "dart_5", type: "quiz", category: "Dart - Introduction",
      title: "Point d'entrée Dart",
      description: "Connaître le point d'entrée d'un programme Dart.",
      instruction: "Quelle fonction est le point d'entrée de tout programme Dart ?",
      options: ["main()", "start()", "init()", "run()"],
      correct: 0,
      explanation: "Comme en C, Java ou C#, la fonction main() est le point d'entrée de tout programme Dart.",
      code_snippet: "void main() {\n  // Le programme commence ici\n}"
    },
    // ─── PUZZLE: Premier programme Dart ─────────────────────────────
    {
      id: "dart_6", type: "puzzle", category: "Dart - Syntaxe de base",
      title: "Hello World en Dart",
      description: "Reconstituez votre premier programme Dart.",
      instruction: "Remettez les blocs dans le bon ordre pour écrire un programme Dart qui affiche 'Hello, World!'.",
      pieces: [
        "void main() {",
        "  print('Hello, World!');",
        "}"
      ],
      hint: "Un programme Dart commence par void main() { et se termine par }."
    },
    // ─── INTRO: Variables ──────────────────────────────────────────
    {
      id: "dart_7", type: "intro", category: "Dart - Variables & Types",
      title: "Variables en Dart",
      description: "Déclarer et utiliser des variables.",
      content: `
        <h5 style="color:#0175C2;">📦 Les variables en Dart</h5>
        <p>En Dart, il y a plusieurs façons de déclarer des variables :</p>
        <table style="width:100%;border-collapse:collapse;margin:1rem 0;">
          <tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
            <td style="padding:0.5rem;"><code>var</code></td>
            <td>Type inféré automatiquement</td>
          </tr>
          <tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
            <td style="padding:0.5rem;"><code>String</code>, <code>int</code>, <code>double</code>, <code>bool</code></td>
            <td>Type explicite</td>
          </tr>
          <tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
            <td style="padding:0.5rem;"><code>final</code></td>
            <td>Valeur assignée une seule fois (runtime)</td>
          </tr>
          <tr>
            <td style="padding:0.5rem;"><code>const</code></td>
            <td>Constante de compilation</td>
          </tr>
        </table>
      `,
      code_example: "var nom = 'Aelita';      // String inféré\nint age = 14;             // int explicite\nfinal ville = 'Paris';    // ne peut pas changer\nconst pi = 3.14159;       // constante"
    },
    {
      id: "dart_8", type: "quiz", category: "Dart - Variables & Types",
      title: "Mot-clé var",
      description: "Comprendre le mot-clé var en Dart.",
      instruction: "Que fait le mot-clé <code>var</code> en Dart ?",
      options: [
        "Déclare une variable avec un type inféré automatiquement",
        "Déclare une constante",
        "Déclare une variable globale",
        "Déclare une variable qui peut changer de type"
      ],
      correct: 0,
      explanation: "var laisse Dart deviner le type à partir de la valeur assignée. Une fois le type inféré, il ne peut plus changer."
    },
    {
      id: "dart_9", type: "puzzle", category: "Dart - Variables & Types",
      title: "Déclarer des variables",
      description: "Reconstituez un programme qui déclare et affiche des variables.",
      instruction: "Remettez les blocs dans le bon ordre.",
      pieces: [
        "void main() {",
        "  String nom = 'Ulrich';",
        "  int age = 15;",
        "  print('$nom a $age ans');",
        "}"
      ],
      hint: "Les déclarations de variables viennent avant leur utilisation dans print()."
    },
    {
      id: "dart_10", type: "code", category: "Dart - Variables & Types",
      title: "Votre première variable",
      description: "Déclarez une variable String et affichez-la.",
      instruction: "Déclarez une variable <code>nom</code> de type <code>String</code> avec la valeur <code>'Yumi'</code>, puis affichez-la avec <code>print()</code>.",
      language: "Dart",
      code_template: "void main() {\n  // Déclarez la variable nom ici\n  \n  // Affichez-la\n  \n}",
      tests: [
        { type: "contains", expected: "String nom" },
        { type: "contains", expected: "'Yumi'" },
        { type: "contains", expected: "print(nom)" }
      ],
      hint: "Syntaxe : String nom = 'Yumi'; puis print(nom);",
      help_steps: [
        "Utilisez String nom = 'Yumi'; pour déclarer",
        "Utilisez print(nom); pour afficher",
        "Le code complet : String nom = 'Yumi'; print(nom);"
      ]
    },
    // ─── INTRO: Types de données ───────────────────────────────────
    {
      id: "dart_11", type: "intro", category: "Dart - Variables & Types",
      title: "Types de données en Dart",
      description: "Les types fondamentaux du langage Dart.",
      content: `
        <h5 style="color:#0175C2;">🔢 Les types fondamentaux</h5>
        <ul>
          <li><code>int</code> — Nombres entiers : <code>42</code>, <code>-7</code></li>
          <li><code>double</code> — Nombres décimaux : <code>3.14</code>, <code>-0.5</code></li>
          <li><code>String</code> — Texte : <code>'Bonjour'</code> ou <code>"Bonjour"</code></li>
          <li><code>bool</code> — Booléen : <code>true</code> ou <code>false</code></li>
          <li><code>List</code> — Liste ordonnée : <code>[1, 2, 3]</code></li>
          <li><code>Map</code> — Paires clé-valeur : <code>{'nom': 'Odd', 'age': 15}</code></li>
        </ul>
        <p><strong>Interpolation de chaînes :</strong> Utilisez <code>$variable</code> ou <code>\${expression}</code> dans une String.</p>
      `,
      code_example: "String prenom = 'Jérémie';\nint score = 100;\nprint('$prenom a un score de $score');\n// Affiche: Jérémie a un score de 100"
    },
    {
      id: "dart_12", type: "quiz", category: "Dart - Variables & Types",
      title: "Interpolation de chaînes",
      description: "Comprendre l'interpolation en Dart.",
      instruction: "Quel est le résultat de ce code ?",
      code_snippet: "String hero = 'Aelita';\nint level = 5;\nprint('$hero est niveau $level');",
      options: [
        "Aelita est niveau 5",
        "$hero est niveau $level",
        "Aelita est niveau level",
        "Erreur de compilation"
      ],
      correct: 0,
      explanation: "L'interpolation $ remplace la variable par sa valeur dans la chaîne."
    },
    {
      id: "dart_13", type: "code", category: "Dart - Variables & Types",
      title: "Calculs et affichage",
      description: "Effectuez un calcul et affichez le résultat.",
      instruction: "Déclarez deux variables <code>int a = 15</code> et <code>int b = 25</code>, calculez leur somme dans une variable <code>somme</code>, et affichez <code>'La somme est $somme'</code>.",
      language: "Dart",
      code_template: "void main() {\n  // Déclarez a et b\n  \n  // Calculez la somme\n  \n  // Affichez le résultat\n  \n}",
      tests: [
        { type: "contains", expected: "int a = 15" },
        { type: "contains", expected: "int b = 25" },
        { type: "match", expected: "somme\\s*=\\s*a\\s*\\+\\s*b" },
        { type: "contains", expected: "print(" }
      ],
      hint: "Déclarez int a = 15; int b = 25; int somme = a + b; puis print('La somme est $somme');",
      help_steps: [
        "Commencez par int a = 15;",
        "Puis int b = 25;",
        "Calculez : int somme = a + b;",
        "Affichez : print('La somme est $somme');"
      ]
    },
    // ─── INTRO: Conditions ─────────────────────────────────────────
    {
      id: "dart_14", type: "intro", category: "Dart - Conditions & Boucles",
      title: "Conditions en Dart",
      description: "if, else if, else et l'opérateur ternaire.",
      content: `
        <h5 style="color:#0175C2;">🔀 Les conditions</h5>
        <p>Dart utilise les mêmes structures conditionnelles que Java/C# :</p>
        <ul>
          <li><code>if (condition) { ... }</code></li>
          <li><code>else if (condition) { ... }</code></li>
          <li><code>else { ... }</code></li>
          <li><strong>Ternaire :</strong> <code>condition ? valeurVrai : valeurFaux</code></li>
        </ul>
        <p>Les opérateurs de comparaison : <code>==</code>, <code>!=</code>, <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code></p>
      `,
      code_example: "int score = 85;\nif (score >= 90) {\n  print('Excellent');\n} else if (score >= 70) {\n  print('Bien');\n} else {\n  print('À améliorer');\n}"
    },
    {
      id: "dart_15", type: "quiz", category: "Dart - Conditions & Boucles",
      title: "Résultat d'une condition",
      description: "Prédire le résultat d'un if/else.",
      instruction: "Qu'affiche ce code ?",
      code_snippet: "int x = 10;\nif (x > 5) {\n  print('Grand');\n} else {\n  print('Petit');\n}",
      options: ["Grand", "Petit", "10", "Erreur"],
      correct: 0,
      explanation: "x vaut 10, qui est supérieur à 5, donc la condition est vraie et 'Grand' est affiché."
    },
    {
      id: "dart_16", type: "puzzle", category: "Dart - Conditions & Boucles",
      title: "Condition if/else",
      description: "Reconstituez une condition if/else en Dart.",
      instruction: "Remettez les blocs dans le bon ordre pour créer une condition qui teste si un nombre est positif.",
      pieces: [
        "void main() {",
        "  int nombre = 7;",
        "  if (nombre > 0) {",
        "    print('Positif');",
        "  } else {",
        "    print('Négatif ou nul');",
        "  }",
        "}"
      ],
      hint: "La structure est : void main() { déclaration; if (condition) { ... } else { ... } }"
    },
    // ─── INTRO: Boucles ────────────────────────────────────────────
    {
      id: "dart_17", type: "intro", category: "Dart - Conditions & Boucles",
      title: "Boucles en Dart",
      description: "for, while et for-in.",
      content: `
        <h5 style="color:#0175C2;">🔄 Les boucles</h5>
        <p>Dart supporte 3 types de boucles :</p>
        <ul>
          <li><code>for (int i = 0; i &lt; n; i++)</code> — Boucle classique</li>
          <li><code>while (condition)</code> — Tant que la condition est vraie</li>
          <li><code>for (var item in liste)</code> — Parcourir une collection</li>
        </ul>
      `,
      code_example: "// Boucle for classique\nfor (int i = 1; i <= 5; i++) {\n  print('Tour $i');\n}\n\n// Boucle for-in\nvar heros = ['Ulrich', 'Yumi', 'Odd'];\nfor (var h in heros) {\n  print(h);\n}"
    },
    {
      id: "dart_18", type: "puzzle", category: "Dart - Conditions & Boucles",
      title: "Boucle for",
      description: "Reconstituez une boucle for qui compte de 1 à 5.",
      instruction: "Remettez les blocs dans le bon ordre.",
      pieces: [
        "void main() {",
        "  for (int i = 1; i <= 5; i++) {",
        "    print('Compteur: $i');",
        "  }",
        "}"
      ],
      hint: "La boucle for commence par for (init; condition; incrémentation) { ... }"
    },
    {
      id: "dart_19", type: "code", category: "Dart - Conditions & Boucles",
      title: "Boucle et condition",
      description: "Combinez boucle et condition.",
      instruction: "Écrivez une boucle <code>for</code> qui parcourt les nombres de 1 à 10 et affiche <code>'Pair'</code> si le nombre est pair, <code>'Impair'</code> sinon. Utilisez <code>i % 2 == 0</code> pour tester la parité.",
      language: "Dart",
      code_template: "void main() {\n  for (int i = 1; i <= 10; i++) {\n    // Testez si i est pair ou impair\n    \n  }\n}",
      tests: [
        { type: "contains", expected: "i % 2 == 0" },
        { type: "contains", expected: "print(" },
        { type: "match", expected: "if\\s*\\(" }
      ],
      hint: "Utilisez if (i % 2 == 0) { print('Pair'); } else { print('Impair'); }",
      help_steps: [
        "Dans la boucle, ajoutez un if",
        "La condition est : i % 2 == 0",
        "Si vrai : print('Pair'); sinon : print('Impair');"
      ]
    },
    // ─── INTRO: Fonctions ──────────────────────────────────────────
    {
      id: "dart_20", type: "intro", category: "Dart - Fonctions",
      title: "Fonctions en Dart",
      description: "Déclarer et utiliser des fonctions.",
      content: `
        <h5 style="color:#0175C2;">⚡ Les fonctions</h5>
        <p>En Dart, les fonctions sont des citoyens de première classe :</p>
        <ul>
          <li>Elles ont un <strong>type de retour</strong> (ou <code>void</code>)</li>
          <li>Elles peuvent avoir des <strong>paramètres optionnels</strong></li>
          <li>Elles supportent les <strong>fonctions fléchées</strong> (<code>=></code>)</li>
        </ul>
      `,
      code_example: "// Fonction classique\nString saluer(String nom) {\n  return 'Bonjour, $nom!';\n}\n\n// Fonction fléchée\nint doubler(int n) => n * 2;\n\nvoid main() {\n  print(saluer('Aelita'));  // Bonjour, Aelita!\n  print(doubler(21));       // 42\n}"
    },
    {
      id: "dart_21", type: "quiz", category: "Dart - Fonctions",
      title: "Fonction fléchée",
      description: "Comprendre la syntaxe fléchée.",
      instruction: "Que retourne cette fonction ?",
      code_snippet: "int carre(int n) => n * n;\nprint(carre(5));",
      options: ["25", "10", "5", "Erreur"],
      correct: 0,
      explanation: "La fonction fléchée => n * n retourne n au carré. 5 * 5 = 25."
    },
    {
      id: "dart_22", type: "puzzle", category: "Dart - Fonctions",
      title: "Créer une fonction",
      description: "Reconstituez une fonction qui calcule l'aire d'un rectangle.",
      instruction: "Remettez les blocs dans le bon ordre pour créer et appeler une fonction.",
      pieces: [
        "double aire(double largeur, double hauteur) {",
        "  return largeur * hauteur;",
        "}",
        "",
        "void main() {",
        "  double resultat = aire(5.0, 3.0);",
        "  print('Aire: $resultat');",
        "}"
      ],
      hint: "La fonction doit être déclarée avant main(), puis appelée dans main()."
    },
    // ─── INTRO: Classes ────────────────────────────────────────────
    {
      id: "dart_23", type: "intro", category: "Dart - Classes & Objets",
      title: "Classes en Dart",
      description: "Programmation orientée objet avec Dart.",
      content: `
        <h5 style="color:#0175C2;">🧱 Les classes</h5>
        <p>Dart est un langage <strong>orienté objet</strong>. Tout est un objet, même les nombres !</p>
        <ul>
          <li><strong>Classe</strong> = modèle (blueprint)</li>
          <li><strong>Objet</strong> = instance d'une classe</li>
          <li><strong>Propriétés</strong> = données de l'objet</li>
          <li><strong>Méthodes</strong> = fonctions de l'objet</li>
        </ul>
      `,
      code_example: "class Guerrier {\n  String nom;\n  int pointsDeVie;\n\n  Guerrier(this.nom, this.pointsDeVie);\n\n  void attaquer() {\n    print('$nom attaque !');\n  }\n}\n\nvoid main() {\n  var ulrich = Guerrier('Ulrich', 100);\n  ulrich.attaquer(); // Ulrich attaque !\n}"
    },
    {
      id: "dart_24", type: "puzzle", category: "Dart - Classes & Objets",
      title: "Créer une classe",
      description: "Reconstituez une classe Personnage avec un constructeur.",
      instruction: "Remettez les blocs dans le bon ordre pour créer une classe et l'instancier.",
      pieces: [
        "class Personnage {",
        "  String nom;",
        "  int niveau;",
        "  Personnage(this.nom, this.niveau);",
        "  void sePresenter() {",
        "    print('Je suis $nom, niveau $niveau');",
        "  }",
        "}",
        "",
        "void main() {",
        "  var hero = Personnage('Odd', 10);",
        "  hero.sePresenter();",
        "}"
      ],
      hint: "La classe est déclarée en premier avec ses propriétés, constructeur et méthodes, puis instanciée dans main()."
    },
    {
      id: "dart_25", type: "quiz", category: "Dart - Classes & Objets",
      title: "Constructeur Dart",
      description: "Comprendre les constructeurs en Dart.",
      instruction: "Que fait <code>this.nom</code> dans le constructeur <code>Personnage(this.nom, this.niveau)</code> ?",
      options: [
        "Assigne automatiquement le paramètre à la propriété nom",
        "Crée une nouvelle variable locale nom",
        "Appelle la méthode nom()",
        "Retourne la valeur de nom"
      ],
      correct: 0,
      explanation: "En Dart, this.nom dans le constructeur est un raccourci qui assigne automatiquement le paramètre à la propriété de l'instance."
    }
  ];

addExercises("dart", exercises);
