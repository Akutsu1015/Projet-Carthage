import { addExercises } from "./registry";
import type { Exercise } from "./registry";

const exercises: Exercise[] = [
  // === DUOLINGO SYSTEM (Intro, Quiz, Puzzle) ===
  {
    id: "cs_intro_0",
    type: "intro",
    title: "Bienvenue en C# !",
    description: "Le langage phare de Microsoft.",
    content: "<p>Bienvenue dans votre formation <strong>C#</strong> ! Le C# (prononcé C-Sharp) est le langage principal de l'écosystème .NET, largement utilisé pour les logiciels professionnels et les jeux avec Unity.</p><p>Préparez-vous à écrire du code élégant et robuste pour vos prochaines applications système.</p><p>Prêt ?</p>",
    category: "Général",
    code_example: "Console.WriteLine(\"Lancement...\");\n// Voici comment on affiche un message en C#",
  },
  {
    id: "cs_quiz_0",
    type: "quiz",
    title: "Tester vos connaissances",
    instruction: "Quel est l'un des usages principaux du langage C# ?",
    options: [
      "Créer des pages web uniquement structurées en HTML",
      "Développer des applications d'entreprise et des jeux vidéo (notamment avec Unity)",
      "Programmer des puces de cartes mères bas niveau",
      "Exécuter des commandes dans un terminal Linux"
    ],
    correct: 1,
    explanation: "Parfait ! Le C# est le pilier de la plateforme .NET pour le logiciel et le langage principal du moteur de jeu Unity.",
    category: "Général",
  },
  {
    id: "cs_puzzle_0",
    type: "puzzle",
    title: "Premier puzzle C#",
    instruction: "Remettez le code en ordre pour afficher du texte dans la console :",
    pieces: ["Console", ".", "WriteLine", "(", "\"Hello\"", ")", ";"],
    hint: "Syntaxe : Console.WriteLine(\"...\");",
    category: "Général",
  },

  // === INTRODUCTION C# (1-5) ===
  {
    id: "cs_1",
    type: "intro",
    category: "Introduction C#",
    title: "Bienvenue en C#",
    description: "C# est un langage moderne, orienté objet, créé par Microsoft.",
    content: `<h3>💜 C# — Le langage de l'écosystème .NET</h3>
<p>C# (prononcé "C sharp") est un langage <strong>moderne</strong>, <strong>fortement typé</strong> et <strong>orienté objet</strong> créé par Anders Hejlsberg chez Microsoft en 2000.</p>
<ul>
<li><strong>Polyvalent</strong> — Applications desktop, web, mobile, jeux (Unity), cloud, IA</li>
<li><strong>Écosystème .NET</strong> — Framework puissant avec des milliers de bibliothèques</li>
<li><strong>Moderne</strong> — Async/await, pattern matching, LINQ, records, nullable types</li>
<li><strong>Performant</strong> — Compilé en IL puis JIT, proche des performances C++</li>
</ul>
<pre><code>using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("Hello, World!");
    }
}</code></pre>`,
  },
  {
    id: "cs_2",
    type: "quiz",
    category: "Introduction C#",
    title: "Qu'est-ce que C# ?",
    description: "Testez vos connaissances sur le langage C#.",
    options: [
      "Un langage de script comme JavaScript",
      "Un langage orienté objet créé par Microsoft pour .NET",
      "Une version améliorée du langage C",
      "Un langage uniquement utilisé pour les jeux vidéo",
    ],
    correct: 1,
    explanation: "C# est un langage orienté objet créé par Microsoft en 2000, conçu pour la plateforme .NET. Bien qu'il soit populaire pour les jeux via Unity, il est utilisé dans de nombreux domaines : web, desktop, mobile, cloud.",
  },
  {
    id: "cs_3",
    type: "code",
    category: "Introduction C#",
    title: "Hello World en C#",
    description: "Écrivez votre premier programme C#.",
    instruction: "Écrivez un programme C# qui affiche <strong>Hello, World!</strong> dans la console avec <code>Console.WriteLine</code>.",
    code_template: `using System;

class Program
{
    static void Main()
    {
        // Affichez Hello, World! ici
    }
}`,
    solution: `using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("Hello, World!");
    }
}`,
    tests: [
      { expected: 'Console.WriteLine("Hello, World!")', type: "contains" },
    ],
  },
  {
    id: "cs_4",
    type: "quiz",
    category: "Introduction C#",
    title: "Méthode d'affichage",
    description: "Quelle méthode permet d'afficher du texte en C# ?",
    options: [
      "print()",
      "System.out.println()",
      "Console.WriteLine()",
      "echo()",
    ],
    correct: 2,
    explanation: "En C#, on utilise Console.WriteLine() pour afficher du texte dans la console avec un retour à la ligne. Console.Write() affiche sans retour à la ligne.",
  },
  {
    id: "cs_5",
    type: "code",
    category: "Introduction C#",
    title: "Commentaires en C#",
    description: "Apprenez à commenter votre code.",
    instruction: "Ajoutez un commentaire sur une ligne <code>// Mon premier programme</code> avant le <code>Console.WriteLine</code>, puis affichez <strong>Bonjour C#</strong>.",
    code_template: `using System;

class Program
{
    static void Main()
    {

    }
}`,
    solution: `using System;

class Program
{
    static void Main()
    {
        // Mon premier programme
        Console.WriteLine("Bonjour C#");
    }
}`,
    tests: [
      { expected: "// Mon premier programme", type: "contains" },
      { expected: 'Console.WriteLine("Bonjour C#")', type: "contains" },
    ],
  },

  // === VARIABLES ET TYPES (6-10) ===
  {
    id: "cs_6",
    type: "intro",
    category: "Variables et types",
    title: "Les types en C#",
    description: "C# est un langage fortement typé avec des types valeur et référence.",
    content: `<h3>📦 Types de données en C#</h3>
<p>C# distingue les <strong>types valeur</strong> (stockés sur la pile) et les <strong>types référence</strong> (sur le tas).</p>
<h4>Types valeur courants :</h4>
<pre><code>int age = 25;           // Entier 32 bits
double prix = 19.99;    // Décimal 64 bits
float pi = 3.14f;       // Décimal 32 bits
bool actif = true;      // Booléen
char lettre = 'A';      // Caractère Unicode
decimal salaire = 3500.50m; // Précision décimale</code></pre>
<h4>Types référence courants :</h4>
<pre><code>string nom = "Alice";   // Chaîne de caractères
int[] notes = {15, 18}; // Tableau
object obj = 42;        // Type universel</code></pre>
<p>Le mot-clé <code>var</code> permet l'inférence de type :</p>
<pre><code>var message = "Salut"; // Le compilateur déduit string</code></pre>`,
  },
  {
    id: "cs_7",
    type: "code",
    category: "Variables et types",
    title: "Déclarer des variables",
    description: "Déclarez et affichez des variables typées.",
    instruction: "Déclarez un <code>string nom</code> avec la valeur <strong>\"Lyoko\"</strong>, un <code>int niveau</code> avec la valeur <strong>5</strong>, puis affichez <strong>Guerrier Lyoko niveau 5</strong> en utilisant l'interpolation de chaînes <code>$\"...\"</code>.",
    code_template: `using System;

class Program
{
    static void Main()
    {
        // Déclarez vos variables ici


        // Affichez avec interpolation
    }
}`,
    solution: `using System;

class Program
{
    static void Main()
    {
        string nom = "Lyoko";
        int niveau = 5;
        Console.WriteLine($"Guerrier {nom} niveau {niveau}");
    }
}`,
    tests: [
      { expected: 'string nom', type: "contains" },
      { expected: 'int niveau', type: "contains" },
      { expected: 'Console.WriteLine($"', type: "contains" },
    ],
  },
  {
    id: "cs_8",
    type: "quiz",
    category: "Variables et types",
    title: "Type pour les décimaux précis",
    description: "Quel type utiliser pour des calculs financiers en C# ?",
    options: [
      "float — décimal rapide",
      "double — décimal standard",
      "decimal — haute précision décimale",
      "int — entier uniquement",
    ],
    correct: 2,
    explanation: "Le type decimal offre une précision de 28 chiffres significatifs et est idéal pour les calculs financiers où les erreurs d'arrondi sont inacceptables. Il utilise le suffixe 'm' : decimal prix = 19.99m;",
  },
  {
    id: "cs_9",
    type: "code",
    category: "Variables et types",
    title: "Conversion de types",
    description: "Convertissez entre différents types.",
    instruction: "Déclarez <code>string ageTexte = \"25\"</code>, convertissez-le en <code>int age</code> avec <code>int.Parse()</code>, ajoutez 5 ans, puis affichez <strong>Dans 5 ans : 30</strong>.",
    code_template: `using System;

class Program
{
    static void Main()
    {
        string ageTexte = "25";
        // Convertissez et calculez

    }
}`,
    solution: `using System;

class Program
{
    static void Main()
    {
        string ageTexte = "25";
        int age = int.Parse(ageTexte);
        Console.WriteLine($"Dans 5 ans : {age + 5}");
    }
}`,
    tests: [
      { expected: "int.Parse", type: "contains" },
      { expected: "Dans 5 ans", type: "contains" },
    ],
  },
  {
    id: "cs_10",
    type: "code",
    category: "Variables et types",
    title: "Constantes",
    description: "Utilisez le mot-clé const.",
    instruction: "Déclarez une constante <code>const double PI = 3.14159</code>, un <code>double rayon = 5</code>, calculez l'aire (PI * rayon * rayon) et affichez-la avec <code>Console.WriteLine</code>.",
    code_template: `using System;

class Program
{
    static void Main()
    {
        // Déclarez PI et rayon, calculez l'aire

    }
}`,
    solution: `using System;

class Program
{
    static void Main()
    {
        const double PI = 3.14159;
        double rayon = 5;
        double aire = PI * rayon * rayon;
        Console.WriteLine(aire);
    }
}`,
    tests: [
      { expected: "const double PI", type: "contains" },
      { expected: "rayon * rayon", type: "contains" },
    ],
  },

  // === CONDITIONS (11-15) ===
  {
    id: "cs_11",
    type: "intro",
    category: "Conditions",
    title: "Les conditions en C#",
    description: "Contrôlez le flux de votre programme.",
    content: `<h3>🔀 Structures conditionnelles</h3>
<p>C# offre plusieurs structures pour contrôler le flux d'exécution :</p>
<pre><code>// if / else if / else
int score = 85;
if (score >= 90)
    Console.WriteLine("Excellent !");
else if (score >= 70)
    Console.WriteLine("Bien !");
else
    Console.WriteLine("À améliorer");

// Opérateur ternaire
string result = score >= 70 ? "Réussi" : "Échoué";

// switch (classique)
int jour = 3;
switch (jour)
{
    case 1: Console.WriteLine("Lundi"); break;
    case 2: Console.WriteLine("Mardi"); break;
    default: Console.WriteLine("Autre"); break;
}

// switch expression (C# 8+)
string nomJour = jour switch
{
    1 => "Lundi",
    2 => "Mardi",
    _ => "Autre"
};</code></pre>`,
  },
  {
    id: "cs_12",
    type: "code",
    category: "Conditions",
    title: "Vérification d'âge",
    description: "Utilisez if/else pour vérifier une condition.",
    instruction: "Déclarez <code>int age = 17</code>. Si l'âge est >= 18, affichez <strong>Majeur</strong>, sinon affichez <strong>Mineur</strong>.",
    code_template: `using System;

class Program
{
    static void Main()
    {
        int age = 17;
        // Vérifiez et affichez

    }
}`,
    solution: `using System;

class Program
{
    static void Main()
    {
        int age = 17;
        if (age >= 18)
            Console.WriteLine("Majeur");
        else
            Console.WriteLine("Mineur");
    }
}`,
    tests: [
      { expected: "if", type: "contains" },
      { expected: "else", type: "contains" },
      { expected: "Mineur", type: "contains" },
    ],
  },
  {
    id: "cs_13",
    type: "code",
    category: "Conditions",
    title: "Switch expression",
    description: "Utilisez le switch expression moderne.",
    instruction: "Déclarez <code>int note = 16</code>. Utilisez un <strong>switch expression</strong> pour assigner une mention à une variable <code>string mention</code> : >= 16 → <strong>\"Très bien\"</strong>, >= 14 → <strong>\"Bien\"</strong>, >= 12 → <strong>\"Assez bien\"</strong>, sinon <strong>\"Passable\"</strong>. Affichez la mention.",
    code_template: `using System;

class Program
{
    static void Main()
    {
        int note = 16;
        // Utilisez switch expression avec when

    }
}`,
    solution: `using System;

class Program
{
    static void Main()
    {
        int note = 16;
        string mention = note switch
        {
            >= 16 => "Très bien",
            >= 14 => "Bien",
            >= 12 => "Assez bien",
            _ => "Passable"
        };
        Console.WriteLine(mention);
    }
}`,
    tests: [
      { expected: "switch", type: "contains" },
      { expected: "Très bien", type: "contains" },
      { expected: "=>", type: "contains" },
    ],
  },
  {
    id: "cs_14",
    type: "quiz",
    category: "Conditions",
    title: "Opérateur null-coalescent",
    description: "Que fait l'opérateur ?? en C# ?",
    code_snippet: `string? nom = null;
string affichage = nom ?? "Inconnu";`,
    options: [
      "Il compare deux valeurs",
      "Il retourne la valeur de gauche si elle n'est pas null, sinon celle de droite",
      "Il convertit null en 0",
      "Il lance une exception si la valeur est null",
    ],
    correct: 1,
    explanation: "L'opérateur ?? (null-coalescent) retourne l'opérande gauche s'il n'est pas null, sinon l'opérande droit. Ici, comme nom est null, affichage vaudra \"Inconnu\".",
  },
  {
    id: "cs_15",
    type: "code",
    category: "Conditions",
    title: "Opérateur ternaire",
    description: "Simplifiez une condition avec l'opérateur ternaire.",
    instruction: "Déclarez <code>int temperature = 35</code>. Utilisez l'opérateur ternaire pour assigner <strong>\"Canicule\"</strong> si >= 30, sinon <strong>\"Normal\"</strong> à une variable <code>string meteo</code>. Affichez le résultat.",
    code_template: `using System;

class Program
{
    static void Main()
    {
        int temperature = 35;
        // Opérateur ternaire

    }
}`,
    solution: `using System;

class Program
{
    static void Main()
    {
        int temperature = 35;
        string meteo = temperature >= 30 ? "Canicule" : "Normal";
        Console.WriteLine(meteo);
    }
}`,
    tests: [
      { expected: "?", type: "contains" },
      { expected: "Canicule", type: "contains" },
      { expected: "Normal", type: "contains" },
    ],
  },

  // === BOUCLES (16-20) ===
  {
    id: "cs_16",
    type: "intro",
    category: "Boucles",
    title: "Les boucles en C#",
    description: "Répétez des instructions efficacement.",
    content: `<h3>🔁 Boucles en C#</h3>
<pre><code>// for — quand on connaît le nombre d'itérations
for (int i = 0; i < 5; i++)
    Console.WriteLine(i);

// foreach — pour parcourir une collection
string[] noms = {"Aelita", "Yumi", "Odd"};
foreach (string nom in noms)
    Console.WriteLine(nom);

// while — tant qu'une condition est vraie
int compteur = 0;
while (compteur < 3)
{
    Console.WriteLine(compteur);
    compteur++;
}

// do...while — au moins une exécution
do
{
    Console.WriteLine("Exécuté au moins une fois");
} while (false);</code></pre>`,
  },
  {
    id: "cs_17",
    type: "code",
    category: "Boucles",
    title: "Boucle for",
    description: "Affichez les nombres de 1 à 10.",
    instruction: "Utilisez une boucle <code>for</code> pour afficher les nombres de <strong>1 à 10</strong>, chacun sur une ligne.",
    code_template: `using System;

class Program
{
    static void Main()
    {
        // Boucle for de 1 à 10

    }
}`,
    solution: `using System;

class Program
{
    static void Main()
    {
        for (int i = 1; i <= 10; i++)
        {
            Console.WriteLine(i);
        }
    }
}`,
    tests: [
      { expected: "for", type: "contains" },
      { expected: "<= 10", type: "contains" },
      { expected: "Console.WriteLine", type: "contains" },
    ],
  },
  {
    id: "cs_18",
    type: "code",
    category: "Boucles",
    title: "Foreach sur un tableau",
    description: "Parcourez un tableau avec foreach.",
    instruction: "Déclarez un tableau <code>string[] guerriers = {\"Aelita\", \"Yumi\", \"Ulrich\", \"Odd\"}</code>. Utilisez <code>foreach</code> pour afficher chaque nom.",
    code_template: `using System;

class Program
{
    static void Main()
    {
        // Déclarez le tableau et parcourez-le

    }
}`,
    solution: `using System;

class Program
{
    static void Main()
    {
        string[] guerriers = {"Aelita", "Yumi", "Ulrich", "Odd"};
        foreach (string nom in guerriers)
        {
            Console.WriteLine(nom);
        }
    }
}`,
    tests: [
      { expected: "string[] guerriers", type: "contains" },
      { expected: "foreach", type: "contains" },
    ],
  },
  {
    id: "cs_19",
    type: "quiz",
    category: "Boucles",
    title: "Différence while vs do...while",
    description: "Quelle est la différence clé ?",
    options: [
      "while est plus rapide que do...while",
      "do...while exécute le bloc au moins une fois, while peut ne jamais l'exécuter",
      "do...while ne supporte pas de condition",
      "Il n'y a aucune différence",
    ],
    correct: 1,
    explanation: "La boucle do...while vérifie la condition APRÈS l'exécution du bloc, garantissant au moins une exécution. La boucle while vérifie AVANT, donc le bloc peut ne jamais s'exécuter si la condition est fausse dès le départ.",
  },
  {
    id: "cs_20",
    type: "code",
    category: "Boucles",
    title: "Table de multiplication",
    description: "Générez une table de multiplication.",
    instruction: "Déclarez <code>int n = 7</code>. Utilisez une boucle <code>for</code> de 1 à 10 pour afficher la table de multiplication de 7 au format <strong>7 x 1 = 7</strong>, <strong>7 x 2 = 14</strong>, etc.",
    code_template: `using System;

class Program
{
    static void Main()
    {
        int n = 7;
        // Table de multiplication

    }
}`,
    solution: `using System;

class Program
{
    static void Main()
    {
        int n = 7;
        for (int i = 1; i <= 10; i++)
        {
            Console.WriteLine($"{n} x {i} = {n * i}");
        }
    }
}`,
    tests: [
      { expected: "for", type: "contains" },
      { expected: "n * i", type: "contains" },
      { expected: "Console.WriteLine", type: "contains" },
    ],
  },
];

addExercises("csharp", exercises);
