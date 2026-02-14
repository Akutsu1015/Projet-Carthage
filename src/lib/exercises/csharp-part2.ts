import { addExercises } from ".";
import type { Exercise } from "@/app/exercises/[module]/exercise-client";

const exercises: Exercise[] = [
  // === MÉTHODES (21-25) ===
  {
    id: "cs_21",
    type: "intro",
    category: "Méthodes",
    title: "Les méthodes en C#",
    description: "Organisez votre code avec des méthodes.",
    content: `<h3>🔧 Méthodes en C#</h3>
<p>Les méthodes permettent de <strong>découper</strong> votre code en blocs réutilisables.</p>
<pre><code>// Méthode avec type de retour
static int Additionner(int a, int b)
{
    return a + b;
}

// Méthode void (pas de retour)
static void Saluer(string nom)
{
    Console.WriteLine($"Bonjour {nom} !");
}

// Paramètres optionnels
static void Afficher(string msg, int fois = 1)
{
    for (int i = 0; i < fois; i++)
        Console.WriteLine(msg);
}

// Expression body (méthode courte)
static double Carre(double x) => x * x;

// Paramètres out
static bool TryDivide(int a, int b, out double result)
{
    if (b == 0) { result = 0; return false; }
    result = (double)a / b;
    return true;
}</code></pre>`,
  },
  {
    id: "cs_22",
    type: "code",
    category: "Méthodes",
    title: "Méthode statique",
    description: "Créez une méthode qui calcule.",
    instruction: "Créez une méthode <code>static int Max(int a, int b)</code> qui retourne le plus grand des deux nombres. Dans Main, appelez-la avec (15, 23) et affichez le résultat.",
    code_template: `using System;

class Program
{
    // Créez la méthode Max ici


    static void Main()
    {
        // Appelez Max et affichez

    }
}`,
    solution: `using System;

class Program
{
    static int Max(int a, int b)
    {
        return a > b ? a : b;
    }

    static void Main()
    {
        Console.WriteLine(Max(15, 23));
    }
}`,
    tests: [
      { expected: "static int Max", type: "contains" },
      { expected: "return", type: "contains" },
      { expected: "Max(15, 23)", type: "contains" },
    ],
  },
  {
    id: "cs_23",
    type: "code",
    category: "Méthodes",
    title: "Paramètres optionnels",
    description: "Utilisez des valeurs par défaut.",
    instruction: "Créez une méthode <code>static void Saluer(string nom, string salutation = \"Bonjour\")</code> qui affiche <strong>[salutation], [nom] !</strong>. Appelez-la deux fois : une fois avec juste <strong>\"Aelita\"</strong> et une fois avec <strong>\"Yumi\"</strong> et <strong>\"Salut\"</strong>.",
    code_template: `using System;

class Program
{
    // Méthode Saluer avec paramètre optionnel


    static void Main()
    {
        // Deux appels

    }
}`,
    solution: `using System;

class Program
{
    static void Saluer(string nom, string salutation = "Bonjour")
    {
        Console.WriteLine($"{salutation}, {nom} !");
    }

    static void Main()
    {
        Saluer("Aelita");
        Saluer("Yumi", "Salut");
    }
}`,
    tests: [
      { expected: 'salutation = "Bonjour"', type: "contains" },
      { expected: 'Saluer("Aelita")', type: "contains" },
      { expected: '"Salut"', type: "contains" },
    ],
  },
  {
    id: "cs_24",
    type: "quiz",
    category: "Méthodes",
    title: "Expression body",
    description: "Que signifie la syntaxe => dans une méthode ?",
    code_snippet: `static double Carre(double x) => x * x;`,
    options: [
      "C'est une méthode lambda anonyme",
      "C'est une syntaxe courte pour une méthode à une seule expression",
      "C'est un opérateur de comparaison",
      "C'est une méthode asynchrone",
    ],
    correct: 1,
    explanation: "La syntaxe => (expression body) permet d'écrire une méthode à une seule expression de manière concise. Elle est équivalente à écrire { return x * x; } mais en plus court.",
  },
  {
    id: "cs_25",
    type: "code",
    category: "Méthodes",
    title: "Méthode avec tableau",
    description: "Passez un tableau en paramètre.",
    instruction: "Créez une méthode <code>static double Moyenne(int[] notes)</code> qui calcule et retourne la moyenne. Dans Main, appelez-la avec <code>{12, 15, 18, 14, 16}</code> et affichez le résultat.",
    code_template: `using System;

class Program
{
    // Méthode Moyenne


    static void Main()
    {
        int[] notes = {12, 15, 18, 14, 16};
        // Calculez et affichez la moyenne

    }
}`,
    solution: `using System;

class Program
{
    static double Moyenne(int[] notes)
    {
        int somme = 0;
        foreach (int n in notes)
            somme += n;
        return (double)somme / notes.Length;
    }

    static void Main()
    {
        int[] notes = {12, 15, 18, 14, 16};
        Console.WriteLine(Moyenne(notes));
    }
}`,
    tests: [
      { expected: "static double Moyenne", type: "contains" },
      { expected: "notes.Length", type: "contains" },
      { expected: "return", type: "contains" },
    ],
  },

  // === CLASSES ET OBJETS (26-32) ===
  {
    id: "cs_26",
    type: "intro",
    category: "POO — Classes",
    title: "Programmation Orientée Objet",
    description: "Les piliers de la POO en C#.",
    content: `<h3>🏗️ Classes et Objets en C#</h3>
<p>La POO est au cœur de C#. Tout est basé sur des <strong>classes</strong> et des <strong>objets</strong>.</p>
<pre><code>class Guerrier
{
    // Propriétés
    public string Nom { get; set; }
    public int PointsDeVie { get; set; }
    public int Attaque { get; private set; }

    // Constructeur
    public Guerrier(string nom, int pv, int atk)
    {
        Nom = nom;
        PointsDeVie = pv;
        Attaque = atk;
    }

    // Méthode
    public void Combattre(Guerrier ennemi)
    {
        ennemi.PointsDeVie -= Attaque;
        Console.WriteLine($"{Nom} attaque {ennemi.Nom} ! PV restants : {ennemi.PointsDeVie}");
    }

    // Override ToString
    public override string ToString() => $"{Nom} (PV: {PointsDeVie}, ATK: {Attaque})";
}

// Utilisation
var aelita = new Guerrier("Aelita", 100, 25);
Console.WriteLine(aelita); // Aelita (PV: 100, ATK: 25)</code></pre>`,
  },
  {
    id: "cs_27",
    type: "code",
    category: "POO — Classes",
    title: "Première classe",
    description: "Créez votre première classe C#.",
    instruction: "Créez une classe <code>Personnage</code> avec les propriétés <code>public string Nom { get; set; }</code> et <code>public int Niveau { get; set; }</code>, un constructeur, et une méthode <code>public void Presenter()</code> qui affiche <strong>Je suis [Nom], niveau [Niveau]</strong>. Créez une instance avec <strong>\"Aelita\"</strong> et <strong>10</strong>, puis appelez <code>Presenter()</code>.",
    code_template: `using System;

// Créez la classe Personnage


class Program
{
    static void Main()
    {
        // Créez une instance et appelez Presenter()

    }
}`,
    solution: `using System;

class Personnage
{
    public string Nom { get; set; }
    public int Niveau { get; set; }

    public Personnage(string nom, int niveau)
    {
        Nom = nom;
        Niveau = niveau;
    }

    public void Presenter()
    {
        Console.WriteLine($"Je suis {Nom}, niveau {Niveau}");
    }
}

class Program
{
    static void Main()
    {
        Personnage p = new Personnage("Aelita", 10);
        p.Presenter();
    }
}`,
    tests: [
      { expected: "class Personnage", type: "contains" },
      { expected: "public string Nom", type: "contains" },
      { expected: "Presenter()", type: "contains" },
      { expected: "new Personnage", type: "contains" },
    ],
  },
  {
    id: "cs_28",
    type: "code",
    category: "POO — Classes",
    title: "Encapsulation",
    description: "Protégez les données avec l'encapsulation.",
    instruction: "Créez une classe <code>CompteBancaire</code> avec un champ privé <code>private decimal solde</code>, un constructeur prenant le solde initial, une méthode <code>public void Deposer(decimal montant)</code> et une méthode <code>public decimal GetSolde()</code>. Dans Main, créez un compte avec 1000, déposez 500, puis affichez le solde.",
    code_template: `using System;

// Classe CompteBancaire


class Program
{
    static void Main()
    {
        // Testez votre classe

    }
}`,
    solution: `using System;

class CompteBancaire
{
    private decimal solde;

    public CompteBancaire(decimal soldeInitial)
    {
        solde = soldeInitial;
    }

    public void Deposer(decimal montant)
    {
        solde += montant;
    }

    public decimal GetSolde()
    {
        return solde;
    }
}

class Program
{
    static void Main()
    {
        CompteBancaire compte = new CompteBancaire(1000);
        compte.Deposer(500);
        Console.WriteLine(compte.GetSolde());
    }
}`,
    tests: [
      { expected: "private decimal solde", type: "contains" },
      { expected: "public void Deposer", type: "contains" },
      { expected: "new CompteBancaire", type: "contains" },
    ],
  },
  {
    id: "cs_29",
    type: "quiz",
    category: "POO — Classes",
    title: "Propriétés auto-implémentées",
    description: "Que fait cette syntaxe en C# ?",
    code_snippet: `public string Nom { get; private set; }`,
    options: [
      "Nom est une variable publique modifiable",
      "Nom peut être lu de partout mais modifié uniquement dans la classe",
      "Nom est une constante",
      "Nom est accessible uniquement dans la classe",
    ],
    correct: 1,
    explanation: "La propriété auto-implémentée avec 'get; private set;' permet la lecture publique (get) mais restreint l'écriture (set) à l'intérieur de la classe uniquement. C'est un pattern d'encapsulation très courant en C#.",
  },
  {
    id: "cs_30",
    type: "code",
    category: "POO — Classes",
    title: "Héritage",
    description: "Créez une hiérarchie de classes.",
    instruction: "Créez une classe de base <code>Animal</code> avec <code>public string Nom { get; set; }</code> et une méthode <code>public virtual void Parler()</code> qui affiche <strong>...</strong>. Créez une classe <code>Chien</code> qui hérite de Animal et <code>override</code> Parler() pour afficher <strong>Woof!</strong>. Dans Main, créez un Chien nommé <strong>\"Rex\"</strong> et appelez <code>Parler()</code>.",
    code_template: `using System;

// Classes Animal et Chien


class Program
{
    static void Main()
    {
        // Testez

    }
}`,
    solution: `using System;

class Animal
{
    public string Nom { get; set; }

    public Animal(string nom)
    {
        Nom = nom;
    }

    public virtual void Parler()
    {
        Console.WriteLine("...");
    }
}

class Chien : Animal
{
    public Chien(string nom) : base(nom) { }

    public override void Parler()
    {
        Console.WriteLine("Woof!");
    }
}

class Program
{
    static void Main()
    {
        Chien rex = new Chien("Rex");
        rex.Parler();
    }
}`,
    tests: [
      { expected: "class Animal", type: "contains" },
      { expected: "class Chien : Animal", type: "contains" },
      { expected: "override", type: "contains" },
      { expected: "virtual", type: "contains" },
    ],
  },
  {
    id: "cs_31",
    type: "code",
    category: "POO — Classes",
    title: "Interfaces",
    description: "Définissez un contrat avec une interface.",
    instruction: "Créez une interface <code>ICombattant</code> avec <code>string Nom { get; }</code> et <code>int Attaquer()</code>. Créez une classe <code>Mage</code> qui implémente cette interface. Dans Main, créez un Mage et affichez ses dégâts.",
    code_template: `using System;

// Interface ICombattant et classe Mage


class Program
{
    static void Main()
    {
        // Testez

    }
}`,
    solution: `using System;

interface ICombattant
{
    string Nom { get; }
    int Attaquer();
}

class Mage : ICombattant
{
    public string Nom { get; }

    public Mage(string nom)
    {
        Nom = nom;
    }

    public int Attaquer()
    {
        return 30;
    }
}

class Program
{
    static void Main()
    {
        Mage m = new Mage("Aelita");
        Console.WriteLine($"{m.Nom} inflige {m.Attaquer()} dégâts");
    }
}`,
    tests: [
      { expected: "interface ICombattant", type: "contains" },
      { expected: "class Mage : ICombattant", type: "contains" },
      { expected: "Attaquer()", type: "contains" },
    ],
  },
  {
    id: "cs_32",
    type: "quiz",
    category: "POO — Classes",
    title: "Classe abstraite vs Interface",
    description: "Quelle est la différence principale ?",
    options: [
      "Aucune différence, ce sont des synonymes",
      "Une classe abstraite peut avoir du code implémenté, une interface définit uniquement un contrat",
      "Une interface peut avoir des constructeurs, pas une classe abstraite",
      "On ne peut hériter que d'une interface",
    ],
    correct: 1,
    explanation: "Une classe abstraite peut contenir du code implémenté et des champs, tandis qu'une interface définit un contrat (méthodes, propriétés) sans implémentation (bien que C# 8+ permette des méthodes par défaut dans les interfaces). Une classe ne peut hériter que d'une seule classe mais peut implémenter plusieurs interfaces.",
  },

  // === STRUCTS, ENUMS, RECORDS (33-36) ===
  {
    id: "cs_33",
    type: "intro",
    category: "Types avancés",
    title: "Structs, Enums et Records",
    description: "Découvrez les types spéciaux de C#.",
    content: `<h3>🧩 Types spéciaux</h3>
<h4>Enum — Ensemble de constantes nommées :</h4>
<pre><code>enum Couleur { Rouge, Vert, Bleu }
Couleur c = Couleur.Rouge;</code></pre>
<h4>Struct — Type valeur léger :</h4>
<pre><code>struct Point
{
    public double X { get; }
    public double Y { get; }
    public Point(double x, double y) { X = x; Y = y; }
}</code></pre>
<h4>Record — Type immuable avec égalité par valeur (C# 9+) :</h4>
<pre><code>record Joueur(string Nom, int Score);
var j1 = new Joueur("Aelita", 100);
var j2 = j1 with { Score = 200 }; // Copie modifiée</code></pre>`,
  },
  {
    id: "cs_34",
    type: "code",
    category: "Types avancés",
    title: "Enum en action",
    description: "Utilisez un enum pour modéliser un état.",
    instruction: "Créez un enum <code>Statut</code> avec les valeurs <strong>Actif</strong>, <strong>Inactif</strong>, <strong>Banni</strong>. Déclarez une variable <code>Statut statut = Statut.Actif</code>, puis utilisez un switch pour afficher <strong>Utilisateur actif</strong> si Actif, <strong>Utilisateur inactif</strong> si Inactif, <strong>Utilisateur banni</strong> si Banni.",
    code_template: `using System;

// Enum Statut


class Program
{
    static void Main()
    {
        // Utilisez l'enum avec un switch

    }
}`,
    solution: `using System;

enum Statut { Actif, Inactif, Banni }

class Program
{
    static void Main()
    {
        Statut statut = Statut.Actif;
        switch (statut)
        {
            case Statut.Actif:
                Console.WriteLine("Utilisateur actif");
                break;
            case Statut.Inactif:
                Console.WriteLine("Utilisateur inactif");
                break;
            case Statut.Banni:
                Console.WriteLine("Utilisateur banni");
                break;
        }
    }
}`,
    tests: [
      { expected: "enum Statut", type: "contains" },
      { expected: "Statut.Actif", type: "contains" },
      { expected: "switch", type: "contains" },
    ],
  },
  {
    id: "cs_35",
    type: "code",
    category: "Types avancés",
    title: "Record immuable",
    description: "Utilisez les records C# 9.",
    instruction: "Déclarez un <code>record Guerrier(string Nom, int Niveau, int Xp)</code>. Créez une instance <strong>(\"Ulrich\", 5, 1200)</strong>, puis créez une copie avec <code>with</code> en changeant le Niveau à <strong>6</strong>. Affichez les deux.",
    code_template: `using System;

// Record Guerrier


class Program
{
    static void Main()
    {
        // Créez et copiez

    }
}`,
    solution: `using System;

record Guerrier(string Nom, int Niveau, int Xp);

class Program
{
    static void Main()
    {
        var g1 = new Guerrier("Ulrich", 5, 1200);
        var g2 = g1 with { Niveau = 6 };
        Console.WriteLine(g1);
        Console.WriteLine(g2);
    }
}`,
    tests: [
      { expected: "record Guerrier", type: "contains" },
      { expected: "with", type: "contains" },
      { expected: "new Guerrier", type: "contains" },
    ],
  },
  {
    id: "cs_36",
    type: "quiz",
    category: "Types avancés",
    title: "Struct vs Class",
    description: "Quelle est la différence fondamentale ?",
    options: [
      "Les structs sont plus rapides pour les gros objets",
      "Les structs sont des types valeur (pile), les classes sont des types référence (tas)",
      "Les structs supportent l'héritage, pas les classes",
      "Il n'y a pas de différence en C#",
    ],
    correct: 1,
    explanation: "Les structs sont des types valeur stockés sur la pile (stack), copiés par valeur. Les classes sont des types référence stockés sur le tas (heap), copiés par référence. Les structs sont idéaux pour les petites structures de données immuables (Point, Color, etc.).",
  },

  // === GESTION D'ERREURS (37-40) ===
  {
    id: "cs_37",
    type: "intro",
    category: "Gestion d'erreurs",
    title: "Exceptions en C#",
    description: "Gérez les erreurs proprement.",
    content: `<h3>🛡️ Try / Catch / Finally</h3>
<pre><code>try
{
    int result = 10 / 0; // Erreur !
}
catch (DivideByZeroException ex)
{
    Console.WriteLine($"Erreur : {ex.Message}");
}
catch (Exception ex)
{
    Console.WriteLine($"Erreur générale : {ex.Message}");
}
finally
{
    Console.WriteLine("Toujours exécuté");
}

// Lancer une exception
static void Valider(int age)
{
    if (age < 0)
        throw new ArgumentException("L'âge ne peut pas être négatif");
}

// Null checking
string? nom = null;
Console.WriteLine(nom?.Length ?? 0); // 0 (pas d'exception)</code></pre>`,
  },
  {
    id: "cs_38",
    type: "code",
    category: "Gestion d'erreurs",
    title: "Try/Catch basique",
    description: "Attrapez une exception.",
    instruction: "Dans un bloc <code>try/catch</code>, tentez de convertir <code>\"abc\"</code> en int avec <code>int.Parse</code>. Si ça échoue (FormatException), affichez <strong>Erreur : format invalide</strong>.",
    code_template: `using System;

class Program
{
    static void Main()
    {
        // Try/catch sur int.Parse("abc")

    }
}`,
    solution: `using System;

class Program
{
    static void Main()
    {
        try
        {
            int n = int.Parse("abc");
        }
        catch (FormatException)
        {
            Console.WriteLine("Erreur : format invalide");
        }
    }
}`,
    tests: [
      { expected: "try", type: "contains" },
      { expected: "catch", type: "contains" },
      { expected: 'int.Parse("abc")', type: "contains" },
      { expected: "format invalide", type: "contains" },
    ],
  },
  {
    id: "cs_39",
    type: "code",
    category: "Gestion d'erreurs",
    title: "Exception personnalisée",
    description: "Lancez votre propre exception.",
    instruction: "Créez une méthode <code>static void Retirer(decimal solde, decimal montant)</code> qui <code>throw</code> une <code>InvalidOperationException</code> avec le message <strong>\"Solde insuffisant\"</strong> si montant > solde, sinon affiche le nouveau solde. Testez avec (100, 150) dans un try/catch.",
    code_template: `using System;

class Program
{
    // Méthode Retirer


    static void Main()
    {
        // Testez avec try/catch

    }
}`,
    solution: `using System;

class Program
{
    static void Retirer(decimal solde, decimal montant)
    {
        if (montant > solde)
            throw new InvalidOperationException("Solde insuffisant");
        Console.WriteLine($"Nouveau solde : {solde - montant}");
    }

    static void Main()
    {
        try
        {
            Retirer(100, 150);
        }
        catch (InvalidOperationException ex)
        {
            Console.WriteLine(ex.Message);
        }
    }
}`,
    tests: [
      { expected: "throw new InvalidOperationException", type: "contains" },
      { expected: "Solde insuffisant", type: "contains" },
      { expected: "try", type: "contains" },
    ],
  },
  {
    id: "cs_40",
    type: "quiz",
    category: "Gestion d'erreurs",
    title: "Bloc finally",
    description: "Quand est exécuté le bloc finally ?",
    options: [
      "Uniquement si une exception est levée",
      "Uniquement si aucune exception n'est levée",
      "Toujours, qu'il y ait exception ou non",
      "Jamais, il est déprécié en C# moderne",
    ],
    correct: 2,
    explanation: "Le bloc finally est TOUJOURS exécuté, qu'une exception soit levée ou non. Il est typiquement utilisé pour libérer des ressources (fermer des fichiers, des connexions, etc.). En C# moderne, on préfère souvent le pattern 'using' qui est équivalent.",
  },
];

addExercises("csharp", exercises);
