import { addExercises } from ".";
import type { Exercise } from "@/app/exercises/[module]/exercise-client";

const exercises: Exercise[] = [
  // === GÉNÉRIQUES (61-64) ===
  {
    id: "cs_61",
    type: "intro",
    category: "Génériques",
    title: "Les génériques en C#",
    description: "Écrivez du code réutilisable avec les types génériques.",
    content: `<h3>🧬 Génériques</h3>
<p>Les génériques permettent de créer des classes et méthodes qui fonctionnent avec <strong>n'importe quel type</strong>, tout en gardant la sécurité du typage.</p>
<pre><code>// Classe générique
class Coffre&lt;T&gt;
{
    private T contenu;
    public void Ranger(T item) => contenu = item;
    public T Ouvrir() => contenu;
}

var coffreOr = new Coffre&lt;int&gt;();
coffreOr.Ranger(1000);

var coffreArme = new Coffre&lt;string&gt;();
coffreArme.Ranger("Épée laser");

// Méthode générique
static T Max&lt;T&gt;(T a, T b) where T : IComparable&lt;T&gt;
{
    return a.CompareTo(b) > 0 ? a : b;
}

// Contraintes
class Repository&lt;T&gt; where T : class, new()
{
    public T Creer() => new T();
}</code></pre>`,
  },
  {
    id: "cs_62",
    type: "code",
    category: "Génériques",
    title: "Classe générique",
    description: "Créez une classe générique Pile.",
    instruction: "Créez une classe <code>Pile&lt;T&gt;</code> avec un champ <code>private List&lt;T&gt; items</code>, une méthode <code>Push(T item)</code>, une méthode <code>T Pop()</code> qui retire et retourne le dernier élément, et <code>int Count</code>. Testez avec des strings.",
    code_template: `using System;
using System.Collections.Generic;

// Classe générique Pile<T>


class Program
{
    static void Main()
    {
        // Testez votre Pile<string>

    }
}`,
    solution: `using System;
using System.Collections.Generic;

class Pile<T>
{
    private List<T> items = new();

    public void Push(T item) => items.Add(item);

    public T Pop()
    {
        T item = items[items.Count - 1];
        items.RemoveAt(items.Count - 1);
        return item;
    }

    public int Count => items.Count;
}

class Program
{
    static void Main()
    {
        Pile<string> pile = new();
        pile.Push("Aelita");
        pile.Push("Yumi");
        Console.WriteLine(pile.Pop());
        Console.WriteLine(pile.Count);
    }
}`,
    tests: [
      { expected: "class Pile<T>", type: "contains" },
      { expected: "Push(T", type: "contains" },
      { expected: "Pop()", type: "contains" },
    ],
  },
  {
    id: "cs_63",
    type: "code",
    category: "Génériques",
    title: "Méthode générique",
    description: "Créez une méthode générique de recherche.",
    instruction: "Créez une méthode <code>static int Trouver&lt;T&gt;(T[] tableau, T cible)</code> qui retourne l'index de <code>cible</code> dans le tableau (ou -1 si absent), en utilisant <code>EqualityComparer&lt;T&gt;.Default.Equals()</code>. Testez avec un tableau de strings.",
    code_template: `using System;
using System.Collections.Generic;

class Program
{
    // Méthode générique Trouver


    static void Main()
    {
        string[] noms = {"Aelita", "Yumi", "Odd", "Ulrich"};
        Console.WriteLine(Trouver(noms, "Odd"));
        Console.WriteLine(Trouver(noms, "XANA"));
    }
}`,
    solution: `using System;
using System.Collections.Generic;

class Program
{
    static int Trouver<T>(T[] tableau, T cible)
    {
        for (int i = 0; i < tableau.Length; i++)
        {
            if (EqualityComparer<T>.Default.Equals(tableau[i], cible))
                return i;
        }
        return -1;
    }

    static void Main()
    {
        string[] noms = {"Aelita", "Yumi", "Odd", "Ulrich"};
        Console.WriteLine(Trouver(noms, "Odd"));
        Console.WriteLine(Trouver(noms, "XANA"));
    }
}`,
    tests: [
      { expected: "static int Trouver<T>", type: "contains" },
      { expected: "EqualityComparer", type: "contains" },
      { expected: "return -1", type: "contains" },
    ],
  },
  {
    id: "cs_64",
    type: "quiz",
    category: "Génériques",
    title: "Contraintes génériques",
    description: "Que signifie 'where T : IComparable<T>' ?",
    code_snippet: `static T Max<T>(T a, T b) where T : IComparable<T>
    => a.CompareTo(b) > 0 ? a : b;`,
    options: [
      "T doit être un type numérique",
      "T doit implémenter l'interface IComparable<T>",
      "T doit être une classe, pas une struct",
      "T doit avoir un constructeur sans paramètre",
    ],
    correct: 1,
    explanation: "La contrainte 'where T : IComparable<T>' signifie que le type T doit implémenter l'interface IComparable<T>, ce qui garantit la présence de la méthode CompareTo(). Cela permet au compilateur de vérifier à la compilation que T supporte la comparaison.",
  },

  // === DELEGATES, EVENTS, LAMBDA (65-68) ===
  {
    id: "cs_65",
    type: "intro",
    category: "Delegates et Events",
    title: "Delegates, Events et Lambda",
    description: "Les fonctions comme données en C#.",
    content: `<h3>📡 Delegates et Events</h3>
<p>Les delegates sont des <strong>types qui représentent des références à des méthodes</strong>.</p>
<pre><code>// Delegate prédéfinis
Action&lt;string&gt; afficher = msg => Console.WriteLine(msg);
Func&lt;int, int, int&gt; additionner = (a, b) => a + b;
Predicate&lt;int&gt; estPair = n => n % 2 == 0;

// Utilisation
afficher("Salut !");          // Salut !
int somme = additionner(3, 4); // 7
bool pair = estPair(6);        // true

// Events — Pattern Observer
class Alarme
{
    public event Action&lt;string&gt;? AlerteDeclenche;

    public void Detecter(string menace)
    {
        Console.WriteLine($"Menace détectée : {menace}");
        AlerteDeclenche?.Invoke(menace);
    }
}

var alarme = new Alarme();
alarme.AlerteDeclenche += msg => Console.WriteLine($"⚠️ ALERTE : {msg}");
alarme.Detecter("XANA");</code></pre>`,
  },
  {
    id: "cs_66",
    type: "code",
    category: "Delegates et Events",
    title: "Func et Action",
    description: "Utilisez les delegates prédéfinis.",
    instruction: "Déclarez un <code>Func&lt;int, int, int&gt; multiplier</code> avec une lambda qui multiplie deux nombres. Déclarez une <code>Action&lt;string&gt; crier</code> qui affiche le message en majuscules. Testez les deux.",
    code_template: `using System;

class Program
{
    static void Main()
    {
        // Déclarez Func et Action avec des lambdas

    }
}`,
    solution: `using System;

class Program
{
    static void Main()
    {
        Func<int, int, int> multiplier = (a, b) => a * b;
        Action<string> crier = msg => Console.WriteLine(msg.ToUpper());

        Console.WriteLine(multiplier(6, 7));
        crier("alerte xana");
    }
}`,
    tests: [
      { expected: "Func<int, int, int>", type: "contains" },
      { expected: "Action<string>", type: "contains" },
      { expected: "=>", type: "contains" },
    ],
  },
  {
    id: "cs_67",
    type: "code",
    category: "Delegates et Events",
    title: "Event personnalisé",
    description: "Créez un système d'événements.",
    instruction: "Créez une classe <code>Minuteur</code> avec un event <code>public event Action? TempsEcoule</code> et une méthode <code>public void Demarrer()</code> qui affiche <strong>Tic... Tac...</strong> puis déclenche l'event. Dans Main, abonnez une lambda qui affiche <strong>⏰ Terminé !</strong> et démarrez le minuteur.",
    code_template: `using System;

// Classe Minuteur


class Program
{
    static void Main()
    {
        // Créez, abonnez et démarrez

    }
}`,
    solution: `using System;

class Minuteur
{
    public event Action? TempsEcoule;

    public void Demarrer()
    {
        Console.WriteLine("Tic... Tac...");
        TempsEcoule?.Invoke();
    }
}

class Program
{
    static void Main()
    {
        Minuteur m = new();
        m.TempsEcoule += () => Console.WriteLine("Terminé !");
        m.Demarrer();
    }
}`,
    tests: [
      { expected: "event Action", type: "contains" },
      { expected: "TempsEcoule", type: "contains" },
      { expected: "+=", type: "contains" },
      { expected: "Invoke()", type: "contains" },
    ],
  },
  {
    id: "cs_68",
    type: "quiz",
    category: "Delegates et Events",
    title: "Predicate<T>",
    description: "À quoi sert Predicate<T> ?",
    code_snippet: `Predicate<int> estPositif = n => n > 0;
List<int> nombres = new() { -3, -1, 0, 2, 5 };
var positifs = nombres.FindAll(estPositif);`,
    options: [
      "Il transforme chaque élément de la liste",
      "Il trie la liste",
      "Il représente une fonction qui prend un T et retourne un bool",
      "Il compte les éléments de la liste",
    ],
    correct: 2,
    explanation: "Predicate<T> est un delegate qui représente une fonction prenant un paramètre de type T et retournant un bool. Il est couramment utilisé avec les méthodes de recherche comme List.FindAll(), List.Find(), List.Exists(), etc.",
  },

  // === PATTERN MATCHING (69-72) ===
  {
    id: "cs_69",
    type: "intro",
    category: "Pattern Matching",
    title: "Pattern Matching en C#",
    description: "Décomposez et testez des valeurs avec élégance.",
    content: `<h3>🎯 Pattern Matching</h3>
<p>C# offre un pattern matching puissant qui s'enrichit à chaque version.</p>
<pre><code>// Type pattern
object obj = "Hello";
if (obj is string s)
    Console.WriteLine(s.Length);

// Switch avec patterns
string Classifier(object val) => val switch
{
    int n when n > 0 => "Positif",
    int n when n < 0 => "Négatif",
    int => "Zéro",
    string s => $"Texte: {s}",
    null => "Null",
    _ => "Inconnu"
};

// Property pattern
record Point(int X, int Y);
string Quadrant(Point p) => p switch
{
    { X: > 0, Y: > 0 } => "Q1",
    { X: < 0, Y: > 0 } => "Q2",
    { X: < 0, Y: < 0 } => "Q3",
    { X: > 0, Y: < 0 } => "Q4",
    _ => "Axe"
};

// List pattern (C# 11)
int[] arr = {1, 2, 3};
if (arr is [1, _, 3])
    Console.WriteLine("Match !");</code></pre>`,
  },
  {
    id: "cs_70",
    type: "code",
    category: "Pattern Matching",
    title: "Switch avec type pattern",
    description: "Classifiez des objets par type.",
    instruction: "Créez une méthode <code>static string Decrire(object obj)</code> qui utilise un <strong>switch expression</strong> avec des patterns de type : retourne <strong>\"Entier: [n]\"</strong> pour int, <strong>\"Texte: [s]\"</strong> pour string, <strong>\"Décimal: [d]\"</strong> pour double, et <strong>\"Inconnu\"</strong> sinon. Testez avec 42, \"Aelita\", et 3.14.",
    code_template: `using System;

class Program
{
    // Méthode Decrire avec pattern matching


    static void Main()
    {
        Console.WriteLine(Decrire(42));
        Console.WriteLine(Decrire("Aelita"));
        Console.WriteLine(Decrire(3.14));
    }
}`,
    solution: `using System;

class Program
{
    static string Decrire(object obj) => obj switch
    {
        int n => $"Entier: {n}",
        string s => $"Texte: {s}",
        double d => $"Décimal: {d}",
        _ => "Inconnu"
    };

    static void Main()
    {
        Console.WriteLine(Decrire(42));
        Console.WriteLine(Decrire("Aelita"));
        Console.WriteLine(Decrire(3.14));
    }
}`,
    tests: [
      { expected: "switch", type: "contains" },
      { expected: "int n =>", type: "contains" },
      { expected: "string s =>", type: "contains" },
      { expected: "_ =>", type: "contains" },
    ],
  },
  {
    id: "cs_71",
    type: "code",
    category: "Pattern Matching",
    title: "Property pattern",
    description: "Utilisez les patterns de propriétés.",
    instruction: "Créez un record <code>Guerrier(string Nom, int Pv, int Atk)</code>. Créez une méthode <code>static string Evaluer(Guerrier g)</code> qui utilise un switch expression avec property patterns : PV > 80 et ATK > 20 → <strong>\"Élite\"</strong>, PV > 50 → <strong>\"Solide\"</strong>, sinon → <strong>\"Faible\"</strong>. Testez.",
    code_template: `using System;

record Guerrier(string Nom, int Pv, int Atk);

class Program
{
    // Méthode Evaluer avec property pattern


    static void Main()
    {
        Console.WriteLine(Evaluer(new Guerrier("Aelita", 90, 25)));
        Console.WriteLine(Evaluer(new Guerrier("Odd", 60, 15)));
        Console.WriteLine(Evaluer(new Guerrier("Kiwi", 30, 5)));
    }
}`,
    solution: `using System;

record Guerrier(string Nom, int Pv, int Atk);

class Program
{
    static string Evaluer(Guerrier g) => g switch
    {
        { Pv: > 80, Atk: > 20 } => "Élite",
        { Pv: > 50 } => "Solide",
        _ => "Faible"
    };

    static void Main()
    {
        Console.WriteLine(Evaluer(new Guerrier("Aelita", 90, 25)));
        Console.WriteLine(Evaluer(new Guerrier("Odd", 60, 15)));
        Console.WriteLine(Evaluer(new Guerrier("Kiwi", 30, 5)));
    }
}`,
    tests: [
      { expected: "switch", type: "contains" },
      { expected: "Pv: > 80", type: "contains" },
      { expected: "Élite", type: "contains" },
    ],
  },
  {
    id: "cs_72",
    type: "quiz",
    category: "Pattern Matching",
    title: "Discard pattern",
    description: "Que représente '_' dans un switch expression ?",
    options: [
      "Une variable nommée underscore",
      "Le cas par défaut qui capture tout ce qui n'a pas matché",
      "Un commentaire",
      "Une erreur de syntaxe",
    ],
    correct: 1,
    explanation: "Le discard pattern '_' dans un switch expression représente le cas par défaut (default). Il capture tout ce qui n'a été matché par aucun autre pattern. C'est l'équivalent du 'default:' dans un switch classique.",
  },

  // === ASP.NET & PROJET FINAL (73-80) ===
  {
    id: "cs_73",
    type: "intro",
    category: ".NET Avancé",
    title: "Écosystème .NET",
    description: "Découvrez la puissance de .NET.",
    content: `<h3>🌐 L'écosystème .NET</h3>
<p>.NET est un framework <strong>cross-platform</strong> et <strong>open-source</strong> pour construire tout type d'application.</p>
<ul>
<li><strong>ASP.NET Core</strong> — Applications web, APIs REST, temps réel (SignalR)</li>
<li><strong>Entity Framework Core</strong> — ORM pour bases de données</li>
<li><strong>MAUI</strong> — Applications desktop et mobile multiplateformes</li>
<li><strong>Blazor</strong> — UI web en C# (au lieu de JavaScript)</li>
<li><strong>ML.NET</strong> — Machine Learning</li>
<li><strong>Unity</strong> — Jeux vidéo (moteur #1 mondial)</li>
</ul>
<pre><code>// API REST minimale avec ASP.NET Core
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => "Hello Lyoko !");

app.MapGet("/guerriers", () => new[]
{
    new { Nom = "Aelita", Niveau = 10 },
    new { Nom = "Yumi", Niveau = 8 },
});

app.Run();</code></pre>`,
  },
  {
    id: "cs_74",
    type: "code",
    category: ".NET Avancé",
    title: "API REST minimale",
    description: "Créez une API avec ASP.NET minimal.",
    instruction: "Écrivez une API minimale ASP.NET Core qui a : une route GET <code>/</code> retournant <strong>\"Projet Carthage API\"</strong>, et une route GET <code>/status</code> retournant un objet anonyme <code>new { Status = \"OK\", Version = \"1.0\" }</code>.",
    code_template: `// API minimale ASP.NET Core
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Ajoutez vos routes ici


app.Run();`,
    solution: `var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => "Projet Carthage API");
app.MapGet("/status", () => new { Status = "OK", Version = "1.0" });

app.Run();`,
    tests: [
      { expected: 'MapGet("/",', type: "contains" },
      { expected: 'MapGet("/status"', type: "contains" },
      { expected: "Projet Carthage API", type: "contains" },
    ],
  },
  {
    id: "cs_75",
    type: "code",
    category: ".NET Avancé",
    title: "Entity Framework — Modèle",
    description: "Définissez un modèle pour EF Core.",
    instruction: "Créez une classe <code>Guerrier</code> avec <code>public int Id { get; set; }</code>, <code>public string Nom { get; set; }</code>, <code>public int Niveau { get; set; }</code>, <code>public int Xp { get; set; }</code>. Créez un <code>DbContext</code> nommé <code>LyokoContext</code> avec un <code>DbSet&lt;Guerrier&gt;</code>.",
    code_template: `using Microsoft.EntityFrameworkCore;

// Classe Guerrier


// DbContext
`,
    solution: `using Microsoft.EntityFrameworkCore;

class Guerrier
{
    public int Id { get; set; }
    public string Nom { get; set; } = "";
    public int Niveau { get; set; }
    public int Xp { get; set; }
}

class LyokoContext : DbContext
{
    public DbSet<Guerrier> Guerriers { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
        => options.UseSqlite("Data Source=lyoko.db");
}`,
    tests: [
      { expected: "class Guerrier", type: "contains" },
      { expected: "public int Id", type: "contains" },
      { expected: ": DbContext", type: "contains" },
      { expected: "DbSet<Guerrier>", type: "contains" },
    ],
  },
  {
    id: "cs_76",
    type: "quiz",
    category: ".NET Avancé",
    title: "Blazor vs JavaScript",
    description: "Quel est l'avantage principal de Blazor ?",
    options: [
      "Blazor est plus rapide que JavaScript dans tous les cas",
      "Blazor permet d'écrire des UI web en C# au lieu de JavaScript",
      "Blazor remplace complètement HTML et CSS",
      "Blazor ne fonctionne que sur Windows",
    ],
    correct: 1,
    explanation: "Blazor permet aux développeurs C# de créer des interfaces web interactives en C# au lieu de JavaScript. Il existe en deux modes : Blazor Server (logique sur le serveur via SignalR) et Blazor WebAssembly (code C# compilé en WASM, exécuté dans le navigateur).",
  },
  {
    id: "cs_77",
    type: "code",
    category: ".NET Avancé",
    title: "Dependency Injection",
    description: "Utilisez l'injection de dépendances .NET.",
    instruction: "Créez une interface <code>IMessageService</code> avec <code>string GetMessage()</code>. Implémentez-la dans <code>LyokoMessageService</code> qui retourne <strong>\"Bienvenue sur Lyoko !\"</strong>. Montrez l'enregistrement dans le DI container avec <code>builder.Services.AddSingleton</code>.",
    code_template: `// Interface et implémentation


// Enregistrement DI (dans Program.cs)
// var builder = WebApplication.CreateBuilder(args);
// ...
`,
    solution: `interface IMessageService
{
    string GetMessage();
}

class LyokoMessageService : IMessageService
{
    public string GetMessage() => "Bienvenue sur Lyoko !";
}

// Enregistrement DI (dans Program.cs)
// builder.Services.AddSingleton<IMessageService, LyokoMessageService>();`,
    tests: [
      { expected: "interface IMessageService", type: "contains" },
      { expected: ": IMessageService", type: "contains" },
      { expected: "GetMessage()", type: "contains" },
      { expected: "Bienvenue sur Lyoko", type: "contains" },
    ],
  },
  {
    id: "cs_78",
    type: "code",
    category: ".NET Avancé",
    title: "Sérialisation JSON",
    description: "Convertissez des objets en JSON.",
    instruction: "Créez un record <code>Joueur(string Nom, int Score, bool Actif)</code>. Créez une instance <strong>(\"Aelita\", 9500, true)</strong>. Sérialisez avec <code>JsonSerializer.Serialize</code> (avec options indentées) et affichez le JSON.",
    code_template: `using System;
using System.Text.Json;

// Record Joueur


class Program
{
    static void Main()
    {
        // Créez et sérialisez

    }
}`,
    solution: `using System;
using System.Text.Json;

record Joueur(string Nom, int Score, bool Actif);

class Program
{
    static void Main()
    {
        var joueur = new Joueur("Aelita", 9500, true);
        var options = new JsonSerializerOptions { WriteIndented = true };
        string json = JsonSerializer.Serialize(joueur, options);
        Console.WriteLine(json);
    }
}`,
    tests: [
      { expected: "record Joueur", type: "contains" },
      { expected: "JsonSerializer.Serialize", type: "contains" },
      { expected: "WriteIndented = true", type: "contains" },
    ],
  },
  {
    id: "cs_79",
    type: "quiz",
    category: ".NET Avancé",
    title: "Middleware ASP.NET",
    description: "Qu'est-ce qu'un middleware dans ASP.NET Core ?",
    options: [
      "Un composant UI comme un bouton",
      "Un logiciel qui connecte la base de données",
      "Un composant dans le pipeline HTTP qui traite les requêtes/réponses",
      "Un outil de débogage uniquement",
    ],
    correct: 2,
    explanation: "Un middleware ASP.NET Core est un composant dans le pipeline de traitement HTTP. Chaque requête passe par une chaîne de middlewares (logging, authentification, CORS, routing, etc.) qui peuvent traiter ou modifier la requête/réponse avant de passer au suivant.",
  },
  {
    id: "cs_80",
    type: "code",
    category: ".NET Avancé",
    title: "Projet final — CRUD API",
    description: "Construisez une API CRUD complète.",
    instruction: "Créez une API minimale ASP.NET Core avec un <code>List&lt;Guerrier&gt;</code> en mémoire et 4 routes : GET <code>/guerriers</code> (liste tous), GET <code>/guerriers/{id}</code> (par id), POST <code>/guerriers</code> (ajouter), DELETE <code>/guerriers/{id}</code> (supprimer). Utilisez un record <code>Guerrier(int Id, string Nom, int Niveau)</code>.",
    code_template: `// record Guerrier


// var builder = WebApplication.CreateBuilder(args);
// var app = builder.Build();

// Liste en mémoire

// Routes CRUD


// app.Run();`,
    solution: `record Guerrier(int Id, string Nom, int Niveau);

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var guerriers = new List<Guerrier>
{
    new(1, "Aelita", 10),
    new(2, "Yumi", 8),
    new(3, "Ulrich", 9),
};

app.MapGet("/guerriers", () => guerriers);

app.MapGet("/guerriers/{id}", (int id) =>
    guerriers.FirstOrDefault(g => g.Id == id) is Guerrier g
        ? Results.Ok(g)
        : Results.NotFound());

app.MapPost("/guerriers", (Guerrier g) =>
{
    guerriers.Add(g);
    return Results.Created($"/guerriers/{g.Id}", g);
});

app.MapDelete("/guerriers/{id}", (int id) =>
{
    var g = guerriers.FirstOrDefault(g => g.Id == id);
    if (g is null) return Results.NotFound();
    guerriers.Remove(g);
    return Results.NoContent();
});

app.Run();`,
    tests: [
      { expected: "record Guerrier", type: "contains" },
      { expected: 'MapGet("/guerriers"', type: "contains" },
      { expected: 'MapPost("/guerriers"', type: "contains" },
      { expected: 'MapDelete("/guerriers/{id}"', type: "contains" },
    ],
  },
];

addExercises("csharp", exercises);
