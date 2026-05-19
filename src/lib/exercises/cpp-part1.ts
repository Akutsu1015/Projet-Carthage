import { addExercises } from "./registry";
import type { Exercise } from "./registry";

const exercises: Exercise[] = [
  // === DUOLINGO SYSTEM (Intro, Quiz, Puzzle) ===
  {
    id: "cpp_intro_0",
    type: "intro",
    title: "Bienvenue en C++ !",
    description: "La puissance brute au service de la performance.",
    content: "<p>Bienvenue dans la formation <strong>C/C++</strong> ! Ici, on se rapproche du métal : ce langage est utilisé lorsque la vitesse et la gestion de la mémoire sont primordiales (Jeux vidéo AAA, systèmes d'exploitation, moteurs temps réel).</p><p>Préparez-vous à compiler des programmes ultra performants.</p>",
    category: "Général",
    code_example: "#include <iostream>\n\nint main() {\n  std::cout << \"Ready!\" << std::endl;\n  return 0;\n}",
  },
  {
    id: "cpp_quiz_0",
    type: "quiz",
    title: "Tester vos connaissances",
    instruction: "Quel est le plus grand avantage du C++ par rapport à JavaScript ou Python ?",
    options: [
      "Il s'exécute directement dans le navigateur sans installation",
      "Il est beaucoup plus simple à apprendre",
      "Il offre un contrôle direct sur la mémoire et une vitesse d'exécution inégalée",
      "Il ne permet de créer que des pages web"
    ],
    correct: 2,
    explanation: "C'est exact ! C++ est un langage compilé, très proche du processeur, offrant des performances maximales essentielles pour les jeux ou logiciels de haute volée.",
    category: "Général",
  },
  {
    id: "cpp_puzzle_0",
    type: "puzzle",
    title: "Premier puzzle C++",
    instruction: "Reconstituez la structure minimale d'un programme C++ :",
    pieces: ["int main()", "{", "return 0;", "}"],
    hint: "La fonction principale s'appelle `main` et retourne 0 à la fin.",
    category: "Général",
  },

  // === INTRODUCTION AU C (1-5) ===
  {
    id: "cpp_1",
    type: "intro",
    category: "Introduction C",
    title: "Bienvenue en C",
    description: "Le langage C est le fondement de la programmation système.",
    content: `<h3>⚙️ C — Le langage de la machine</h3>
<p>Le C est un langage <strong>compilé</strong>, <strong>bas niveau</strong> et <strong>ultra-performant</strong>, créé en 1972 par Dennis Ritchie.</p>
<ul>
<li><strong>Fondation</strong> — Linux, Windows, macOS, Python, Git... sont écrits en C</li>
<li><strong>Performance</strong> — Accès direct à la mémoire, pas de garbage collector</li>
<li><strong>Portabilité</strong> — Compile sur quasi toutes les architectures</li>
<li><strong>Apprentissage</strong> — Comprendre le C, c'est comprendre comment fonctionne un ordinateur</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    printf("Hello, World!\\n");
    return 0;
}</code></pre>`,
  },
  {
    id: "cpp_2",
    type: "quiz",
    category: "Introduction C",
    title: "Qu'est-ce que le C ?",
    description: "Testez vos connaissances sur le langage C.",
    options: [
      "Un langage interprété comme Python",
      "Un langage compilé, bas niveau, créé en 1972",
      "Un framework web pour créer des sites internet",
      "Un langage uniquement utilisé sur les vieux ordinateurs",
    ],
    correct: 1,
    explanation: "Le C est un langage compilé créé par Dennis Ritchie aux Bell Labs en 1972. Il reste l'un des langages les plus utilisés au monde, notamment pour les systèmes d'exploitation, les drivers, l'embarqué et les logiciels haute performance.",
  },
  {
    id: "cpp_3",
    type: "code",
    category: "Introduction C",
    title: "Hello World en C",
    description: "Écrivez votre premier programme C.",
    instruction: "Écrivez un programme C complet qui affiche <strong>Hello, World!</strong> suivi d'un retour à la ligne avec <code>printf</code>. N'oubliez pas <code>#include &lt;stdio.h&gt;</code> et <code>return 0;</code>.",
    code_template: `// Votre premier programme C
`,
    solution: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
    tests: [
      { type: "contains", expected: "#include <stdio.h>" },
      { type: "contains", expected: "int main()" },
      { type: "contains", expected: "printf(" },
      { type: "contains", expected: "Hello, World!" },
      { type: "contains", expected: "return 0" },
    ],
    hint: "#include <stdio.h> pour printf, int main() { ... return 0; } comme structure de base.",
    help_steps: [
      "Commencez par #include <stdio.h>",
      "Déclarez la fonction main : int main() {",
      "Utilisez printf(\"Hello, World!\\n\");",
      "Terminez avec return 0; et }",
    ],
  },
  {
    id: "cpp_4",
    type: "quiz",
    category: "Introduction C",
    title: "Compilation",
    description: "Comment compile-t-on un fichier C ?",
    options: [
      "python hello.c",
      "gcc hello.c -o hello",
      "node hello.c",
      "run hello.c",
    ],
    correct: 1,
    explanation: "gcc (GNU Compiler Collection) est le compilateur C standard. gcc hello.c -o hello compile le fichier source hello.c en un exécutable nommé hello. On l'exécute ensuite avec ./hello.",
  },
  {
    id: "cpp_5",
    type: "puzzle",
    category: "Introduction C",
    title: "Structure d'un programme C",
    description: "Remettez dans l'ordre un programme C valide.",
    pieces: [
      "#include <stdio.h>",
      "",
      "int main() {",
      "    printf(\"Bonjour !\\n\");",
      "    return 0;",
      "}",
    ],
  },
  // === VARIABLES & TYPES (6-10) ===
  {
    id: "cpp_6",
    type: "intro",
    category: "Variables & Types",
    title: "Variables et types en C",
    description: "Le C est un langage fortement typé — chaque variable a un type défini.",
    content: `<h3>📊 Types de données en C</h3>
<pre><code>// Entiers
int age = 25;           // 4 octets, -2G à +2G
short s = 100;          // 2 octets
long l = 1000000L;      // 8 octets
unsigned int u = 42;    // sans signe (positif uniquement)

// Décimaux
float pi = 3.14f;       // 4 octets, ~7 chiffres
double precise = 3.14159265; // 8 octets, ~15 chiffres

// Caractères
char lettre = 'A';      // 1 octet (code ASCII)

// Booléen (C99+)
#include &lt;stdbool.h&gt;
bool actif = true;</code></pre>
<p>En C, il n'y a <strong>pas de type string natif</strong>. On utilise des tableaux de char : <code>char name[] = "Lyoko";</code></p>`,
  },
  {
    id: "cpp_7",
    type: "code",
    category: "Variables & Types",
    title: "Déclarer des variables",
    description: "Déclarez et affichez des variables de différents types.",
    instruction: "Déclarez un <code>int age = 14</code>, un <code>float score = 95.5f</code>, un <code>char grade = 'A'</code> et une chaîne <code>char name[] = \"Aelita\"</code>. Affichez-les avec <code>printf</code> en utilisant les bons spécificateurs (<code>%d, %f, %c, %s</code>).",
    code_template: `#include <stdio.h>

int main() {
    // Déclarez les variables et affichez-les
    return 0;
}`,
    solution: `#include <stdio.h>

int main() {
    int age = 14;
    float score = 95.5f;
    char grade = 'A';
    char name[] = "Aelita";

    printf("Nom: %s, Age: %d, Score: %.1f, Grade: %c\\n", name, age, score, grade);
    return 0;
}`,
    tests: [
      { type: "contains", expected: "int age" },
      { type: "contains", expected: "float score" },
      { type: "contains", expected: "char grade" },
      { type: "contains", expected: "char name[]" },
      { type: "contains", expected: "%d" },
      { type: "contains", expected: "%s" },
    ],
    hint: "Spécificateurs printf : %d (int), %f (float), %c (char), %s (string/char[]).",
  },
  {
    id: "cpp_8",
    type: "quiz",
    category: "Variables & Types",
    title: "Taille des types",
    description: "Combien d'octets occupe un int sur la plupart des systèmes modernes ?",
    options: [
      "1 octet",
      "2 octets",
      "4 octets",
      "8 octets",
    ],
    correct: 2,
    explanation: "Sur la plupart des systèmes 32/64 bits, un int occupe 4 octets (32 bits), permettant de stocker des valeurs de -2 147 483 648 à 2 147 483 647. On peut vérifier avec sizeof(int).",
  },
  {
    id: "cpp_9",
    type: "code",
    category: "Variables & Types",
    title: "Constantes et sizeof",
    description: "Utilisez const et sizeof.",
    instruction: "Déclarez une constante <code>PI</code> de type <code>const double</code> avec la valeur <code>3.14159265</code>. Affichez la taille en octets de <code>int</code>, <code>double</code> et <code>char</code> avec <code>sizeof</code>.",
    code_template: `#include <stdio.h>

int main() {
    // Constante PI + sizeof
    return 0;
}`,
    solution: `#include <stdio.h>

int main() {
    const double PI = 3.14159265;
    printf("PI = %f\\n", PI);
    printf("int: %zu octets\\n", sizeof(int));
    printf("double: %zu octets\\n", sizeof(double));
    printf("char: %zu octet\\n", sizeof(char));
    return 0;
}`,
    tests: [
      { type: "contains", expected: "const double PI" },
      { type: "contains", expected: "sizeof(int)" },
      { type: "contains", expected: "sizeof(double)" },
      { type: "contains", expected: "sizeof(char)" },
    ],
    hint: "const type NOM = valeur; pour les constantes. sizeof(type) retourne la taille en octets.",
  },
  {
    id: "cpp_10",
    type: "code",
    category: "Variables & Types",
    title: "Entrée utilisateur",
    description: "Lisez une entrée avec scanf.",
    instruction: "Demandez à l'utilisateur son <code>age</code> (int) et son <code>nom</code> (char[50]) avec <code>scanf</code>, puis affichez <strong>Bonjour {nom}, vous avez {age} ans</strong>.",
    code_template: `#include <stdio.h>

int main() {
    int age;
    char nom[50];
    // Lisez l'entrée et affichez
    return 0;
}`,
    solution: `#include <stdio.h>

int main() {
    int age;
    char nom[50];

    printf("Votre nom: ");
    scanf("%s", nom);
    printf("Votre age: ");
    scanf("%d", &age);

    printf("Bonjour %s, vous avez %d ans\\n", nom, age);
    return 0;
}`,
    tests: [
      { type: "contains", expected: "scanf(\"%s\", nom)" },
      { type: "contains", expected: "scanf(\"%d\", &age)" },
      { type: "contains", expected: "printf(" },
    ],
    hint: "scanf(\"%s\", nom) pour les strings (pas de &), scanf(\"%d\", &age) pour les int (avec &).",
  },
  // === CONDITIONS & BOUCLES (11-15) ===
  {
    id: "cpp_11",
    type: "intro",
    category: "Contrôle de flux",
    title: "Conditions et boucles",
    description: "Le contrôle de flux en C est similaire à la plupart des langages.",
    content: `<h3>🔄 Contrôle de flux en C</h3>
<pre><code>// Conditions
if (score >= 90) {
    printf("Excellent !\\n");
} else if (score >= 70) {
    printf("Bien\\n");
} else {
    printf("À améliorer\\n");
}

// Switch
switch (grade) {
    case 'A': printf("Top"); break;
    case 'B': printf("Bien"); break;
    default: printf("OK");
}

// Boucles
for (int i = 0; i < 10; i++) { ... }
while (condition) { ... }
do { ... } while (condition);</code></pre>`,
  },
  {
    id: "cpp_12",
    type: "code",
    category: "Contrôle de flux",
    title: "Conditions if/else",
    description: "Écrivez des conditions pour classifier un score.",
    instruction: "Écrivez un programme qui prend un <code>int score = 85</code> et affiche : <strong>S</strong> si >= 90, <strong>A</strong> si >= 80, <strong>B</strong> si >= 70, <strong>C</strong> si >= 60, sinon <strong>F</strong>.",
    code_template: `#include <stdio.h>

int main() {
    int score = 85;
    // Classifiez le score
    return 0;
}`,
    solution: `#include <stdio.h>

int main() {
    int score = 85;

    if (score >= 90) {
        printf("S\\n");
    } else if (score >= 80) {
        printf("A\\n");
    } else if (score >= 70) {
        printf("B\\n");
    } else if (score >= 60) {
        printf("C\\n");
    } else {
        printf("F\\n");
    }
    return 0;
}`,
    tests: [
      { type: "contains", expected: "if (score >= 90)" },
      { type: "contains", expected: "else if" },
      { type: "contains", expected: "else {" },
    ],
    hint: "Chaînez les if/else if du plus grand au plus petit.",
  },
  {
    id: "cpp_13",
    type: "code",
    category: "Contrôle de flux",
    title: "Boucle for",
    description: "Utilisez une boucle for pour afficher les nombres.",
    instruction: "Écrivez une boucle <code>for</code> qui affiche les nombres de <code>1</code> à <code>10</code>, un par ligne.",
    code_template: `#include <stdio.h>

int main() {
    // Boucle de 1 à 10
    return 0;
}`,
    solution: `#include <stdio.h>

int main() {
    for (int i = 1; i <= 10; i++) {
        printf("%d\\n", i);
    }
    return 0;
}`,
    tests: [
      { type: "contains", expected: "for (int i = 1; i <= 10; i++)" },
      { type: "contains", expected: "printf(\"%d\\n\", i)" },
    ],
    hint: "for (int i = 1; i <= 10; i++) { printf(\"%d\\n\", i); }",
  },
  {
    id: "cpp_14",
    type: "code",
    category: "Contrôle de flux",
    title: "Boucle while et somme",
    description: "Calculez une somme avec une boucle while.",
    instruction: "Calculez la somme des nombres de <code>1</code> à <code>100</code> avec une boucle <code>while</code>. Affichez le résultat (devrait être <strong>5050</strong>).",
    code_template: `#include <stdio.h>

int main() {
    int sum = 0;
    int i = 1;
    // Boucle while pour calculer la somme
    return 0;
}`,
    solution: `#include <stdio.h>

int main() {
    int sum = 0;
    int i = 1;
    while (i <= 100) {
        sum += i;
        i++;
    }
    printf("Somme: %d\\n", sum);
    return 0;
}`,
    tests: [
      { type: "contains", expected: "while (i <= 100)" },
      { type: "contains", expected: "sum += i" },
      { type: "contains", expected: "i++" },
    ],
    hint: "while (i <= 100) { sum += i; i++; } — accumulez dans sum.",
  },
  {
    id: "cpp_15",
    type: "code",
    category: "Contrôle de flux",
    title: "Switch/case",
    description: "Utilisez switch pour un menu.",
    instruction: "Écrivez un <code>switch</code> sur une variable <code>int choix = 2</code> qui affiche : 1 → <strong>Démarrer</strong>, 2 → <strong>Charger</strong>, 3 → <strong>Quitter</strong>, sinon → <strong>Choix invalide</strong>.",
    code_template: `#include <stdio.h>

int main() {
    int choix = 2;
    // Switch sur choix
    return 0;
}`,
    solution: `#include <stdio.h>

int main() {
    int choix = 2;
    switch (choix) {
        case 1: printf("Démarrer\\n"); break;
        case 2: printf("Charger\\n"); break;
        case 3: printf("Quitter\\n"); break;
        default: printf("Choix invalide\\n");
    }
    return 0;
}`,
    tests: [
      { type: "contains", expected: "switch (choix)" },
      { type: "contains", expected: "case 1:" },
      { type: "contains", expected: "case 2:" },
      { type: "contains", expected: "break;" },
      { type: "contains", expected: "default:" },
    ],
    hint: "switch (var) { case val: action; break; default: ... } — n'oubliez pas les break !",
  },
  // === FONCTIONS (16-20) ===
  {
    id: "cpp_16",
    type: "intro",
    category: "Fonctions",
    title: "Les fonctions en C",
    description: "Les fonctions permettent de découper le code en blocs réutilisables.",
    content: `<h3>🧩 Fonctions en C</h3>
<pre><code>// Déclaration (prototype)
int add(int a, int b);

// Définition
int add(int a, int b) {
    return a + b;
}

// Fonction sans retour
void greet(char name[]) {
    printf("Bonjour %s !\\n", name);
}

// Appel
int result = add(3, 5);  // 8
greet("Jérémie");</code></pre>
<p>En C, les arguments sont passés <strong>par valeur</strong> (copie). Pour modifier une variable, on passe un <strong>pointeur</strong>.</p>`,
  },
  {
    id: "cpp_17",
    type: "code",
    category: "Fonctions",
    title: "Fonction avec retour",
    description: "Créez une fonction qui retourne une valeur.",
    instruction: "Créez une fonction <code>int max(int a, int b)</code> qui retourne le plus grand des deux nombres. Testez-la dans main avec <code>max(42, 17)</code>.",
    code_template: `#include <stdio.h>

// Fonction max

int main() {
    printf("Max: %d\\n", max(42, 17));
    return 0;
}`,
    solution: `#include <stdio.h>

int max(int a, int b) {
    return (a > b) ? a : b;
}

int main() {
    printf("Max: %d\\n", max(42, 17));
    return 0;
}`,
    tests: [
      { type: "contains", expected: "int max(int a, int b)" },
      { type: "contains", expected: "return" },
      { type: "contains", expected: "max(42, 17)" },
    ],
    hint: "return (a > b) ? a : b; — l'opérateur ternaire est concis pour ce cas.",
  },
  {
    id: "cpp_18",
    type: "code",
    category: "Fonctions",
    title: "Fonction récursive",
    description: "Créez une fonction récursive pour la factorielle.",
    instruction: "Créez <code>int factorielle(int n)</code> de manière récursive : si <code>n <= 1</code>, retournez <code>1</code>, sinon retournez <code>n * factorielle(n - 1)</code>. Testez avec <code>factorielle(5)</code> (doit donner 120).",
    code_template: `#include <stdio.h>

// Fonction factorielle récursive

int main() {
    printf("5! = %d\\n", factorielle(5));
    return 0;
}`,
    solution: `#include <stdio.h>

int factorielle(int n) {
    if (n <= 1) return 1;
    return n * factorielle(n - 1);
}

int main() {
    printf("5! = %d\\n", factorielle(5));
    return 0;
}`,
    tests: [
      { type: "contains", expected: "int factorielle(int n)" },
      { type: "contains", expected: "if (n <= 1) return 1" },
      { type: "contains", expected: "n * factorielle(n - 1)" },
    ],
    hint: "Cas de base : n <= 1 → 1. Cas récursif : n * factorielle(n-1).",
  },
  {
    id: "cpp_19",
    type: "code",
    category: "Fonctions",
    title: "Fonction void",
    description: "Créez une fonction qui ne retourne rien.",
    instruction: "Créez une fonction <code>void afficher_tableau(int arr[], int taille)</code> qui affiche tous les éléments d'un tableau séparés par des espaces. Testez avec un tableau <code>{10, 20, 30, 40, 50}</code>.",
    code_template: `#include <stdio.h>

// Fonction afficher_tableau

int main() {
    int arr[] = {10, 20, 30, 40, 50};
    afficher_tableau(arr, 5);
    return 0;
}`,
    solution: `#include <stdio.h>

void afficher_tableau(int arr[], int taille) {
    for (int i = 0; i < taille; i++) {
        printf("%d ", arr[i]);
    }
    printf("\\n");
}

int main() {
    int arr[] = {10, 20, 30, 40, 50};
    afficher_tableau(arr, 5);
    return 0;
}`,
    tests: [
      { type: "contains", expected: "void afficher_tableau(int arr[], int taille)" },
      { type: "contains", expected: "for (int i = 0; i < taille; i++)" },
      { type: "contains", expected: "arr[i]" },
    ],
    hint: "void signifie pas de retour. En C, les tableaux ne connaissent pas leur taille — passez-la en paramètre.",
  },
  {
    id: "cpp_20",
    type: "quiz",
    category: "Fonctions",
    title: "Passage par valeur",
    description: "Que se passe-t-il quand on passe une variable à une fonction en C ?",
    options: [
      "La fonction reçoit la variable originale et peut la modifier",
      "La fonction reçoit une copie — modifier le paramètre ne change pas l'original",
      "La variable est automatiquement convertie en pointeur",
      "La fonction ne peut pas recevoir de variables, seulement des constantes",
    ],
    correct: 1,
    explanation: "En C, les arguments sont passés par VALEUR : la fonction reçoit une copie. Pour modifier l'original, il faut passer un pointeur (l'adresse mémoire) avec & et *.",
  },
];

addExercises("cpp", exercises);
