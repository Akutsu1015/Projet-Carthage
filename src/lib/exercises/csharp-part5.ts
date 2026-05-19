import { addExercises } from "./registry";
import type { Exercise } from "./registry";

const exercises: Exercise[] = [
  // === LINQ AVANCÉ (81-86) ===
  {
    id: "cs_81",
    type: "intro",
    category: "LINQ avancé",
    title: "LINQ — Techniques avancées",
    description: "Maîtrisez les requêtes complexes.",
    content: `<h3>🔍 LINQ avancé</h3>
<pre><code>// Join
var result = from u in users
             join o in orders on u.Id equals o.UserId
             select new { u.Name, o.Total };

// SelectMany — aplatir
var allTags = posts.SelectMany(p => p.Tags);

// Aggregate
var csv = names.Aggregate((a, b) => a + ", " + b);

// Lookup
var lookup = users.ToLookup(u => u.City);
var parisiens = lookup["Paris"];

// Zip
var pairs = names.Zip(scores, (n, s) => $"{n}: {s}");

// Chunk (C# 13)
var pages = items.Chunk(10); // Groupes de 10</code></pre>`,
  },
  {
    id: "cs_82",
    type: "code",
    category: "LINQ avancé",
    title: "Join LINQ",
    description: "Joignez deux collections.",
    instruction: "Créez deux listes : <code>guerriers</code> (Id, Nom) et <code>scores</code> (GuerrierId, Points). Utilisez <code>.Join()</code> pour combiner les deux et afficher chaque guerrier avec son score.",
    code_template: `using System;
using System.Linq;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        // Join entre guerriers et scores

    }
}`,
    solution: `using System;
using System.Linq;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        var guerriers = new[] {
            new { Id = 1, Nom = "Aelita" },
            new { Id = 2, Nom = "Yumi" },
            new { Id = 3, Nom = "Odd" },
        };
        var scores = new[] {
            new { GuerrierId = 1, Points = 95 },
            new { GuerrierId = 2, Points = 88 },
            new { GuerrierId = 3, Points = 72 },
        };
        var result = guerriers.Join(scores,
            g => g.Id, s => s.GuerrierId,
            (g, s) => new { g.Nom, s.Points });
        foreach (var r in result)
            Console.WriteLine($"{r.Nom}: {r.Points} pts");
    }
}`,
    tests: [
      { expected: ".Join(", type: "contains" },
      { expected: "GuerrierId", type: "contains" },
      { expected: "foreach", type: "contains" },
    ],
  },
  {
    id: "cs_83",
    type: "code",
    category: "LINQ avancé",
    title: "SelectMany",
    description: "Aplatissez des collections imbriquées.",
    instruction: "Créez une liste de classes contenant chacune une liste d'élèves. Utilisez <code>.SelectMany()</code> pour obtenir une seule liste de tous les élèves. Affichez chaque élève avec sa classe.",
    code_template: `using System;
using System.Linq;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        // SelectMany pour aplatir

    }
}`,
    solution: `using System;
using System.Linq;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        var classes = new[] {
            new { Nom = "6eA", Eleves = new[] { "Aelita", "Yumi" } },
            new { Nom = "6eB", Eleves = new[] { "Odd", "Ulrich" } },
            new { Nom = "6eC", Eleves = new[] { "William", "Sissi" } },
        };
        var tous = classes.SelectMany(
            c => c.Eleves,
            (c, e) => new { Classe = c.Nom, Eleve = e });
        foreach (var x in tous)
            Console.WriteLine($"{x.Eleve} ({x.Classe})");
    }
}`,
    tests: [
      { expected: ".SelectMany(", type: "contains" },
      { expected: "Eleves", type: "contains" },
      { expected: "foreach", type: "contains" },
    ],
  },
  {
    id: "cs_84",
    type: "code",
    category: "LINQ avancé",
    title: "Aggregate et Zip",
    description: "Agrégation personnalisée et combinaison.",
    instruction: "Utilisez <code>.Aggregate()</code> pour concaténer une liste de noms en une seule chaîne séparée par <strong>\", \"</strong>. Utilisez <code>.Zip()</code> pour combiner deux tableaux (noms et scores) en paires. Affichez les deux résultats.",
    code_template: `using System;
using System.Linq;

class Program
{
    static void Main()
    {
        // Aggregate et Zip

    }
}`,
    solution: `using System;
using System.Linq;

class Program
{
    static void Main()
    {
        string[] noms = {"Aelita", "Yumi", "Odd", "Ulrich"};
        int[] scores = {95, 88, 72, 85};
        
        string liste = noms.Aggregate((a, b) => a + ", " + b);
        Console.WriteLine(liste);
        
        var paires = noms.Zip(scores, (n, s) => $"{n}: {s} pts");
        foreach (var p in paires)
            Console.WriteLine(p);
    }
}`,
    tests: [
      { expected: ".Aggregate(", type: "contains" },
      { expected: ".Zip(", type: "contains" },
    ],
  },
  {
    id: "cs_85",
    type: "quiz",
    category: "LINQ avancé",
    title: "IQueryable vs IEnumerable",
    description: "Quelle est la différence ?",
    options: [
      "Aucune différence",
      "IQueryable traduit les requêtes en SQL (ou autre), IEnumerable les exécute en mémoire",
      "IEnumerable est plus rapide",
      "IQueryable est déprécié",
    ],
    correct: 1,
    explanation: "IEnumerable exécute les opérations LINQ en mémoire (LINQ to Objects). IQueryable traduit les expressions en requêtes (SQL via Entity Framework par exemple) exécutées côté serveur. Utilisez IQueryable pour les requêtes DB afin que le filtrage se fasse côté serveur, pas en mémoire.",
  },
  {
    id: "cs_86",
    type: "code",
    category: "LINQ avancé",
    title: "Requête complexe",
    description: "Combinez plusieurs opérations LINQ.",
    instruction: "Créez une liste de produits (Nom, Catégorie, Prix, Stock). Écrivez une requête LINQ qui : filtre les produits en stock, les groupe par catégorie, calcule la moyenne de prix par catégorie, trie par prix moyen décroissant, et affiche le résultat.",
    code_template: `using System;
using System.Linq;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        // Requête LINQ complexe

    }
}`,
    solution: `using System;
using System.Linq;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        var produits = new[] {
            new { Nom = "Laptop", Categorie = "Tech", Prix = 999.0, Stock = 5 },
            new { Nom = "Souris", Categorie = "Tech", Prix = 29.0, Stock = 50 },
            new { Nom = "Bureau", Categorie = "Meuble", Prix = 450.0, Stock = 3 },
            new { Nom = "Chaise", Categorie = "Meuble", Prix = 200.0, Stock = 0 },
            new { Nom = "Écran", Categorie = "Tech", Prix = 350.0, Stock = 12 },
            new { Nom = "Lampe", Categorie = "Meuble", Prix = 45.0, Stock = 20 },
        };
        
        var result = produits
            .Where(p => p.Stock > 0)
            .GroupBy(p => p.Categorie)
            .Select(g => new { Categorie = g.Key, PrixMoyen = g.Average(p => p.Prix), Count = g.Count() })
            .OrderByDescending(x => x.PrixMoyen);
        
        foreach (var r in result)
            Console.WriteLine($"{r.Categorie}: {r.PrixMoyen:F2}€ moy. ({r.Count} produits)");
    }
}`,
    tests: [
      { expected: ".Where(", type: "contains" },
      { expected: ".GroupBy(", type: "contains" },
      { expected: ".Average(", type: "contains" },
      { expected: ".OrderByDescending(", type: "contains" },
    ],
  },

  // === CLASSES AVANCÉES (87-92) ===
  {
    id: "cs_87",
    type: "intro",
    category: "POO avancée",
    title: "POO avancée en C#",
    description: "Patterns et techniques avancés.",
    content: `<h3>🏗️ POO avancée</h3>
<pre><code>// Classe sealed — non-héritable
sealed class Singleton { }

// Classe static — utilitaire
static class MathHelper {
    public static double Clamp(double v, double min, double max)
        => Math.Max(min, Math.Min(max, v));
}

// Indexeur
class Matrix {
    double[,] data;
    public double this[int row, int col] {
        get => data[row, col];
        set => data[row, col] = value;
    }
}

// Deconstruct
class Point {
    public double X { get; }
    public double Y { get; }
    public void Deconstruct(out double x, out double y)
        => (x, y) = (X, Y);
}
var (px, py) = new Point(3, 4);

// Extension methods
static class StringExt {
    public static bool IsNullOrEmpty(this string? s) 
        => string.IsNullOrEmpty(s);
}</code></pre>`,
  },
  {
    id: "cs_88",
    type: "code",
    category: "POO avancée",
    title: "Extension methods",
    description: "Ajoutez des méthodes à des types existants.",
    instruction: "Créez une classe statique <code>CollectionExtensions</code> avec : une extension <code>Shuffle&lt;T&gt;()</code> sur <code>IList&lt;T&gt;</code> qui mélange aléatoirement, et <code>SecondMax()</code> sur <code>IEnumerable&lt;int&gt;</code> qui retourne le 2e plus grand. Testez les deux.",
    code_template: `using System;
using System.Collections.Generic;
using System.Linq;

// Extension methods
`,
    solution: `using System;
using System.Collections.Generic;
using System.Linq;

static class CollectionExtensions
{
    private static Random rng = new();
    
    public static void Shuffle<T>(this IList<T> list)
    {
        for (int i = list.Count - 1; i > 0; i--)
        {
            int j = rng.Next(i + 1);
            (list[i], list[j]) = (list[j], list[i]);
        }
    }
    
    public static int SecondMax(this IEnumerable<int> source)
    {
        return source.Distinct().OrderByDescending(x => x).Skip(1).First();
    }
}

class Program
{
    static void Main()
    {
        var names = new List<string> { "Aelita", "Yumi", "Odd", "Ulrich" };
        names.Shuffle();
        Console.WriteLine(string.Join(", ", names));
        
        var nums = new[] { 5, 3, 9, 1, 9, 7 };
        Console.WriteLine($"Second max: {nums.SecondMax()}");
    }
}`,
    tests: [
      { expected: "static class CollectionExtensions", type: "contains" },
      { expected: "this IList<T>", type: "contains" },
      { expected: "this IEnumerable<int>", type: "contains" },
    ],
  },
  {
    id: "cs_89",
    type: "code",
    category: "POO avancée",
    title: "Indexeur et Deconstruct",
    description: "Créez un conteneur avec accès par index.",
    instruction: "Créez une classe <code>Grid&lt;T&gt;</code> avec un indexeur <code>this[int row, int col]</code>, les propriétés <code>Rows</code> et <code>Cols</code>, et un <code>Deconstruct</code> qui retourne (Rows, Cols). Testez avec une grille 3x3 de strings.",
    code_template: `using System;

// Classe Grid<T> avec indexeur
`,
    solution: `using System;

class Grid<T>
{
    private T[,] data;
    public int Rows { get; }
    public int Cols { get; }
    
    public Grid(int rows, int cols)
    {
        Rows = rows;
        Cols = cols;
        data = new T[rows, cols];
    }
    
    public T this[int row, int col]
    {
        get => data[row, col];
        set => data[row, col] = value;
    }
    
    public void Deconstruct(out int rows, out int cols)
    {
        rows = Rows;
        cols = Cols;
    }
}

class Program
{
    static void Main()
    {
        var grid = new Grid<string>(3, 3);
        grid[0, 0] = "Aelita";
        grid[1, 1] = "XANA";
        grid[2, 2] = "Lyoko";
        
        Console.WriteLine(grid[0, 0]);
        Console.WriteLine(grid[1, 1]);
        
        var (rows, cols) = grid;
        Console.WriteLine($"Taille: {rows}x{cols}");
    }
}`,
    tests: [
      { expected: "this[int row, int col]", type: "contains" },
      { expected: "void Deconstruct", type: "contains" },
      { expected: "class Grid<T>", type: "contains" },
    ],
  },
  {
    id: "cs_90",
    type: "code",
    category: "POO avancée",
    title: "IDisposable et using",
    description: "Gérez les ressources proprement.",
    instruction: "Créez une classe <code>DatabaseConnection</code> qui implémente <code>IDisposable</code>. Le constructeur affiche <strong>\"Connexion ouverte\"</strong>, Dispose affiche <strong>\"Connexion fermée\"</strong>. Ajoutez une méthode <code>Query(string sql)</code>. Utilisez avec un bloc <code>using</code>.",
    code_template: `using System;

// DatabaseConnection avec IDisposable
`,
    solution: `using System;

class DatabaseConnection : IDisposable
{
    private bool disposed = false;
    
    public DatabaseConnection()
    {
        Console.WriteLine("Connexion ouverte");
    }
    
    public string Query(string sql)
    {
        if (disposed) throw new ObjectDisposedException(nameof(DatabaseConnection));
        return $"Résultat de: {sql}";
    }
    
    public void Dispose()
    {
        if (!disposed)
        {
            Console.WriteLine("Connexion fermée");
            disposed = true;
        }
    }
}

class Program
{
    static void Main()
    {
        using (var db = new DatabaseConnection())
        {
            Console.WriteLine(db.Query("SELECT * FROM users"));
        }
        // Connexion automatiquement fermée ici
    }
}`,
    tests: [
      { expected: ": IDisposable", type: "contains" },
      { expected: "public void Dispose()", type: "contains" },
      { expected: "using (var db", type: "contains" },
    ],
  },
  {
    id: "cs_91",
    type: "quiz",
    category: "POO avancée",
    title: "Sealed vs Static",
    description: "Quelle est la différence ?",
    options: [
      "Aucune différence",
      "sealed empêche l'héritage mais permet l'instanciation; static empêche l'instanciation et l'héritage",
      "static empêche l'héritage uniquement",
      "sealed est pour les méthodes, static pour les classes",
    ],
    correct: 1,
    explanation: "Une classe sealed peut être instanciée mais pas héritée (utile pour empêcher l'extension). Une classe static ne peut être ni instanciée ni héritée — elle ne contient que des membres statiques (utile pour les utilitaires comme Math, Console, etc.).",
  },
  {
    id: "cs_92",
    type: "code",
    category: "POO avancée",
    title: "Classe abstraite complète",
    description: "Créez une hiérarchie avec template method.",
    instruction: "Créez une classe abstraite <code>DataExporter</code> avec un template method <code>Export(data)</code> qui appelle dans l'ordre : <code>Validate()</code>, <code>Transform()</code>, <code>Write()</code>. Les 3 sont abstraites. Créez <code>JsonExporter</code> et <code>CsvExporter</code> qui implémentent les 3 méthodes.",
    code_template: `using System;
using System.Collections.Generic;

// Template Method pattern
`,
    solution: `using System;
using System.Collections.Generic;

abstract class DataExporter
{
    public void Export(List<string> data)
    {
        Validate(data);
        var transformed = Transform(data);
        Write(transformed);
        Console.WriteLine("Export terminé !");
    }
    protected abstract void Validate(List<string> data);
    protected abstract string Transform(List<string> data);
    protected abstract void Write(string output);
}

class JsonExporter : DataExporter
{
    protected override void Validate(List<string> data)
    {
        if (data.Count == 0) throw new Exception("Données vides");
    }
    protected override string Transform(List<string> data)
        => "[" + string.Join(",", data.Select(d => $"\"{d}\"")) + "]";
    protected override void Write(string output)
        => Console.WriteLine($"JSON: {output}");
}

class CsvExporter : DataExporter
{
    protected override void Validate(List<string> data) { }
    protected override string Transform(List<string> data)
        => string.Join(",", data);
    protected override void Write(string output)
        => Console.WriteLine($"CSV: {output}");
}

class Program
{
    static void Main()
    {
        var data = new List<string> { "Aelita", "Yumi", "Odd" };
        new JsonExporter().Export(data);
        new CsvExporter().Export(data);
    }
}`,
    tests: [
      { expected: "abstract class DataExporter", type: "contains" },
      { expected: "class JsonExporter : DataExporter", type: "contains" },
      { expected: "class CsvExporter : DataExporter", type: "contains" },
      { expected: "protected abstract", type: "contains" },
    ],
  },

  // === ASYNC AVANCÉ (93-97) ===
  {
    id: "cs_93",
    type: "intro",
    category: "Async avancé",
    title: "Async/Await avancé",
    description: "Patterns asynchrones complexes.",
    content: `<h3>⚡ Async avancé</h3>
<pre><code>// Cancellation Token
async Task LongOperation(CancellationToken ct)
{
    for (int i = 0; i < 100; i++)
    {
        ct.ThrowIfCancellationRequested();
        await Task.Delay(100, ct);
    }
}
var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));
await LongOperation(cts.Token);

// IAsyncEnumerable (C# 8)
async IAsyncEnumerable&lt;int&gt; GenerateAsync()
{
    for (int i = 0; i < 10; i++)
    {
        await Task.Delay(100);
        yield return i;
    }
}
await foreach (var item in GenerateAsync()) { }

// Channel — producteur/consommateur
var channel = Channel.CreateUnbounded&lt;string&gt;();
await channel.Writer.WriteAsync("data");
var item = await channel.Reader.ReadAsync();</code></pre>`,
  },
  {
    id: "cs_94",
    type: "code",
    category: "Async avancé",
    title: "CancellationToken",
    description: "Annulez des opérations longues.",
    instruction: "Créez une méthode <code>async Task CountAsync(CancellationToken ct)</code> qui compte de 1 à 100 avec un délai de 100ms entre chaque. Utilisez un <code>CancellationTokenSource</code> avec un timeout de 2 secondes. Gérez l'annulation avec try/catch.",
    code_template: `using System;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    // Méthode avec CancellationToken

    static async Task Main()
    {
        // Testez avec timeout

    }
}`,
    solution: `using System;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    static async Task CountAsync(CancellationToken ct)
    {
        for (int i = 1; i <= 100; i++)
        {
            ct.ThrowIfCancellationRequested();
            Console.WriteLine($"Compteur: {i}");
            await Task.Delay(100, ct);
        }
    }

    static async Task Main()
    {
        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(2));
        try
        {
            await CountAsync(cts.Token);
        }
        catch (OperationCanceledException)
        {
            Console.WriteLine("Opération annulée !");
        }
    }
}`,
    tests: [
      { expected: "CancellationToken", type: "contains" },
      { expected: "ThrowIfCancellationRequested", type: "contains" },
      { expected: "CancellationTokenSource", type: "contains" },
      { expected: "OperationCanceledException", type: "contains" },
    ],
  },
  {
    id: "cs_95",
    type: "code",
    category: "Async avancé",
    title: "IAsyncEnumerable",
    description: "Streamez des données asynchrones.",
    instruction: "Créez une méthode <code>async IAsyncEnumerable&lt;int&gt; FibonacciAsync(int count)</code> qui yield les nombres de Fibonacci un par un avec un délai de 200ms. Consommez avec <code>await foreach</code>.",
    code_template: `using System;
using System.Collections.Generic;
using System.Threading.Tasks;

class Program
{
    // IAsyncEnumerable Fibonacci

    static async Task Main()
    {
        // await foreach

    }
}`,
    solution: `using System;
using System.Collections.Generic;
using System.Threading.Tasks;

class Program
{
    static async IAsyncEnumerable<int> FibonacciAsync(int count)
    {
        int a = 0, b = 1;
        for (int i = 0; i < count; i++)
        {
            await Task.Delay(200);
            yield return a;
            (a, b) = (b, a + b);
        }
    }

    static async Task Main()
    {
        await foreach (var n in FibonacciAsync(10))
        {
            Console.Write($"{n} ");
        }
        Console.WriteLine();
    }
}`,
    tests: [
      { expected: "async IAsyncEnumerable<int>", type: "contains" },
      { expected: "yield return", type: "contains" },
      { expected: "await foreach", type: "contains" },
    ],
  },
  {
    id: "cs_96",
    type: "code",
    category: "Async avancé",
    title: "Semaphore pour limiter la concurrence",
    description: "Limitez le nombre de tâches parallèles.",
    instruction: "Créez une méthode qui lance 20 téléchargements simulés en parallèle, mais limitez à 3 simultanés avec <code>SemaphoreSlim</code>. Chaque téléchargement prend un temps aléatoire. Affichez le début et la fin de chaque tâche.",
    code_template: `using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

class Program
{
    // Téléchargements limités avec SemaphoreSlim

    static async Task Main()
    {

    }
}`,
    solution: `using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

class Program
{
    static SemaphoreSlim semaphore = new(3);
    
    static async Task DownloadAsync(int id)
    {
        await semaphore.WaitAsync();
        try
        {
            Console.WriteLine($"[{DateTime.Now:ss.fff}] Start #{id}");
            await Task.Delay(Random.Shared.Next(500, 1500));
            Console.WriteLine($"[{DateTime.Now:ss.fff}] Done  #{id}");
        }
        finally
        {
            semaphore.Release();
        }
    }

    static async Task Main()
    {
        var tasks = new List<Task>();
        for (int i = 1; i <= 20; i++)
            tasks.Add(DownloadAsync(i));
        await Task.WhenAll(tasks);
        Console.WriteLine("Tout terminé !");
    }
}`,
    tests: [
      { expected: "SemaphoreSlim", type: "contains" },
      { expected: "WaitAsync()", type: "contains" },
      { expected: "Release()", type: "contains" },
      { expected: "Task.WhenAll", type: "contains" },
    ],
  },
  {
    id: "cs_97",
    type: "quiz",
    category: "Async avancé",
    title: "ConfigureAwait",
    description: "Que fait ConfigureAwait(false) ?",
    options: [
      "Annule la tâche",
      "Évite de capturer le contexte de synchronisation, améliorant les performances dans les bibliothèques",
      "Rend la tâche synchrone",
      "Force l'exécution sur le thread principal",
    ],
    correct: 1,
    explanation: "Par défaut, await capture le SynchronizationContext et reprend sur le même thread (important pour l'UI). ConfigureAwait(false) dit 'je n'ai pas besoin de revenir sur le même thread', ce qui évite un overhead. Recommandé dans les bibliothèques, pas dans le code UI.",
  },

  // === DESIGN PATTERNS (98-103) ===
  {
    id: "cs_98",
    type: "intro",
    category: "Design Patterns",
    title: "Design Patterns en C#",
    description: "Patterns classiques en C# moderne.",
    content: `<h3>🏛️ Design Patterns</h3>
<pre><code>// Builder
var user = new UserBuilder()
    .WithName("Aelita")
    .WithEmail("aelita@lyoko.fr")
    .WithLevel(10)
    .Build();

// Repository
interface IRepository&lt;T&gt; where T : class
{
    Task&lt;T?&gt; GetByIdAsync(int id);
    Task&lt;IEnumerable&lt;T&gt;&gt; GetAllAsync();
    Task AddAsync(T entity);
    Task DeleteAsync(int id);
}

// Observer avec events
class StockWatcher
{
    public event Action&lt;string, decimal&gt;? PriceChanged;
    public void UpdatePrice(string stock, decimal price)
        => PriceChanged?.Invoke(stock, price);
}

// Strategy avec DI
interface ISortStrategy { void Sort(List&lt;int&gt; data); }
class QuickSort : ISortStrategy { ... }
class MergeSort : ISortStrategy { ... }
// services.AddSingleton&lt;ISortStrategy, QuickSort&gt;();</code></pre>`,
  },
  {
    id: "cs_99",
    type: "code",
    category: "Design Patterns",
    title: "Builder pattern",
    description: "Créez un builder fluent.",
    instruction: "Créez un <code>QueryBuilder</code> qui construit des requêtes SQL de manière fluide : <code>.Select(\"*\")</code>, <code>.From(\"users\")</code>, <code>.Where(\"level > 5\")</code>, <code>.OrderBy(\"name\")</code>, <code>.Limit(10)</code>, <code>.Build()</code>. Chaque méthode retourne <code>this</code>.",
    code_template: `using System;
using System.Collections.Generic;

// QueryBuilder fluent
`,
    solution: `using System;
using System.Collections.Generic;

class QueryBuilder
{
    private string select = "*";
    private string from = "";
    private List<string> wheres = new();
    private string orderBy = "";
    private int? limit;

    public QueryBuilder Select(string cols) { select = cols; return this; }
    public QueryBuilder From(string table) { from = table; return this; }
    public QueryBuilder Where(string condition) { wheres.Add(condition); return this; }
    public QueryBuilder OrderBy(string col) { orderBy = col; return this; }
    public QueryBuilder Limit(int n) { limit = n; return this; }

    public string Build()
    {
        var sql = $"SELECT {select} FROM {from}";
        if (wheres.Count > 0) sql += " WHERE " + string.Join(" AND ", wheres);
        if (!string.IsNullOrEmpty(orderBy)) sql += $" ORDER BY {orderBy}";
        if (limit.HasValue) sql += $" LIMIT {limit}";
        return sql;
    }
}

class Program
{
    static void Main()
    {
        var query = new QueryBuilder()
            .Select("name, level")
            .From("users")
            .Where("level > 5")
            .Where("active = 1")
            .OrderBy("level DESC")
            .Limit(10)
            .Build();
        Console.WriteLine(query);
    }
}`,
    tests: [
      { expected: "class QueryBuilder", type: "contains" },
      { expected: "return this", type: "contains" },
      { expected: "public string Build()", type: "contains" },
    ],
  },
  {
    id: "cs_100",
    type: "code",
    category: "Design Patterns",
    title: "Repository pattern",
    description: "Abstrahez l'accès aux données.",
    instruction: "Créez une interface <code>IRepository&lt;T&gt;</code> avec GetById, GetAll, Add, Update, Delete. Créez <code>InMemoryRepository&lt;T&gt;</code> qui stocke en mémoire avec un Dictionary. T doit avoir une propriété Id (via une interface <code>IEntity</code>).",
    code_template: `using System;
using System.Collections.Generic;
using System.Linq;

// Repository pattern générique
`,
    solution: `using System;
using System.Collections.Generic;
using System.Linq;

interface IEntity { int Id { get; set; } }

interface IRepository<T> where T : IEntity
{
    T? GetById(int id);
    IEnumerable<T> GetAll();
    void Add(T entity);
    void Update(T entity);
    void Delete(int id);
}

class InMemoryRepository<T> : IRepository<T> where T : IEntity
{
    private readonly Dictionary<int, T> store = new();
    private int nextId = 1;

    public T? GetById(int id) => store.GetValueOrDefault(id);
    public IEnumerable<T> GetAll() => store.Values;
    public void Add(T entity) { entity.Id = nextId++; store[entity.Id] = entity; }
    public void Update(T entity) { store[entity.Id] = entity; }
    public void Delete(int id) { store.Remove(id); }
}

class User : IEntity
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
}

class Program
{
    static void Main()
    {
        IRepository<User> repo = new InMemoryRepository<User>();
        repo.Add(new User { Name = "Aelita" });
        repo.Add(new User { Name = "Yumi" });
        foreach (var u in repo.GetAll())
            Console.WriteLine($"{u.Id}: {u.Name}");
    }
}`,
    tests: [
      { expected: "interface IRepository<T>", type: "contains" },
      { expected: "class InMemoryRepository<T> : IRepository<T>", type: "contains" },
      { expected: "interface IEntity", type: "contains" },
    ],
  },
  {
    id: "cs_101",
    type: "code",
    category: "Design Patterns",
    title: "Observer avec events",
    description: "Implémentez le pattern Observer.",
    instruction: "Créez une classe <code>GameEventSystem</code> avec des events typés : <code>event Action&lt;string&gt; OnPlayerJoin</code>, <code>event Action&lt;string, int&gt; OnScoreChange</code>, <code>event Action OnGameOver</code>. Créez des méthodes qui déclenchent ces events. Abonnez des handlers.",
    code_template: `using System;

// Observer avec events C#
`,
    solution: `using System;

class GameEventSystem
{
    public event Action<string>? OnPlayerJoin;
    public event Action<string, int>? OnScoreChange;
    public event Action? OnGameOver;
    
    public void PlayerJoins(string name) => OnPlayerJoin?.Invoke(name);
    public void UpdateScore(string name, int score) => OnScoreChange?.Invoke(name, score);
    public void EndGame() => OnGameOver?.Invoke();
}

class Program
{
    static void Main()
    {
        var events = new GameEventSystem();
        
        events.OnPlayerJoin += name => Console.WriteLine($">>> {name} a rejoint !");
        events.OnScoreChange += (name, score) => Console.WriteLine($"Score: {name} = {score}");
        events.OnGameOver += () => Console.WriteLine("=== GAME OVER ===");
        
        events.PlayerJoins("Aelita");
        events.PlayerJoins("Yumi");
        events.UpdateScore("Aelita", 100);
        events.UpdateScore("Yumi", 85);
        events.EndGame();
    }
}`,
    tests: [
      { expected: "event Action<string>", type: "contains" },
      { expected: "?.Invoke(", type: "contains" },
      { expected: "OnPlayerJoin +=", type: "contains" },
    ],
  },
  {
    id: "cs_102",
    type: "quiz",
    category: "Design Patterns",
    title: "Dependency Injection",
    description: "Pourquoi utiliser l'injection de dépendances ?",
    options: [
      "Pour rendre le code plus complexe",
      "Pour découpler les composants, faciliter les tests (mock) et respecter SOLID",
      "Pour accélérer l'exécution",
      "Pour remplacer les interfaces",
    ],
    correct: 1,
    explanation: "L'injection de dépendances (DI) découple les classes de leurs dépendances concrètes. Au lieu de créer ses dépendances, une classe les reçoit via son constructeur. Cela permet : le remplacement facile (mock pour les tests), le respect du principe d'inversion de dépendance (SOLID), et une meilleure modularité.",
  },
  {
    id: "cs_103",
    type: "code",
    category: "Design Patterns",
    title: "Strategy pattern",
    description: "Choisissez un algorithme à l'exécution.",
    instruction: "Créez une interface <code>ICompression</code> avec <code>byte[] Compress(string data)</code>. Créez 3 implémentations : <code>NoCompression</code>, <code>SimpleCompression</code> (supprime les espaces), <code>HeavyCompression</code> (garde uniquement les consonnes). Créez une classe <code>FileProcessor</code> qui reçoit la stratégie par DI.",
    code_template: `using System;
using System.Linq;
using System.Text;

// Strategy pattern
`,
    solution: `using System;
using System.Linq;
using System.Text;

interface ICompression
{
    byte[] Compress(string data);
    string Name { get; }
}

class NoCompression : ICompression
{
    public string Name => "None";
    public byte[] Compress(string data) => Encoding.UTF8.GetBytes(data);
}

class SimpleCompression : ICompression
{
    public string Name => "Simple";
    public byte[] Compress(string data) => Encoding.UTF8.GetBytes(data.Replace(" ", ""));
}

class HeavyCompression : ICompression
{
    public string Name => "Heavy";
    public byte[] Compress(string data)
    {
        var consonnes = new string(data.Where(c => !"aeiouAEIOU ".Contains(c)).ToArray());
        return Encoding.UTF8.GetBytes(consonnes);
    }
}

class FileProcessor
{
    private readonly ICompression compression;
    public FileProcessor(ICompression compression) => this.compression = compression;
    
    public void Process(string data)
    {
        var result = compression.Compress(data);
        Console.WriteLine($"[{compression.Name}] {data.Length} -> {result.Length} bytes");
    }
}

class Program
{
    static void Main()
    {
        string data = "Bienvenue sur le Projet Carthage";
        new FileProcessor(new NoCompression()).Process(data);
        new FileProcessor(new SimpleCompression()).Process(data);
        new FileProcessor(new HeavyCompression()).Process(data);
    }
}`,
    tests: [
      { expected: "interface ICompression", type: "contains" },
      { expected: "class FileProcessor", type: "contains" },
      { expected: "private readonly ICompression", type: "contains" },
    ],
  },

  // === TESTS (104-107) ===
  {
    id: "cs_104",
    type: "intro",
    category: "Tests C#",
    title: "Tests unitaires en C#",
    description: "Testez votre code avec xUnit.",
    content: `<h3>🧪 Tests C#</h3>
<pre><code>using Xunit;

public class CalculatorTests
{
    [Fact]
    public void Add_ReturnsCorrectSum()
    {
        var calc = new Calculator();
        Assert.Equal(5, calc.Add(2, 3));
    }

    [Theory]
    [InlineData(2, 3, 5)]
    [InlineData(-1, 1, 0)]
    [InlineData(0, 0, 0)]
    public void Add_WithMultipleInputs(int a, int b, int expected)
    {
        Assert.Equal(expected, new Calculator().Add(a, b));
    }

    [Fact]
    public void Divide_ByZero_ThrowsException()
    {
        Assert.Throws&lt;DivideByZeroException&gt;(
            () => new Calculator().Divide(10, 0)
        );
    }
}</code></pre>`,
  },
  {
    id: "cs_105",
    type: "code",
    category: "Tests C#",
    title: "Tests xUnit basiques",
    description: "Écrivez des tests pour un service.",
    instruction: "Créez une classe <code>StringHelper</code> avec <code>Reverse(string)</code>, <code>IsPalindrome(string)</code>, <code>CountWords(string)</code>. Écrivez des tests xUnit avec [Fact] et [Theory] pour chaque méthode.",
    code_template: `using System;
using System.Linq;

// StringHelper + tests xUnit
`,
    solution: `using System;
using System.Linq;

class StringHelper
{
    public string Reverse(string s) => new string(s.Reverse().ToArray());

    public bool IsPalindrome(string s)
    {
        var clean = s.ToLower().Replace(" ", "");
        return clean == Reverse(clean);
    }

    public int CountWords(string s)
        => s.Split(' ', StringSplitOptions.RemoveEmptyEntries).Length;
}

public class StringHelperTests
{
    private readonly StringHelper helper = new();

    [Fact]
    public void Reverse_ReversesString()
        => Assert.Equal("atileA", helper.Reverse("Aelita"));

    [Theory]
    [InlineData("kayak", true)]
    [InlineData("hello", false)]
    [InlineData("A man a plan a canal Panama", true)]
    public void IsPalindrome_DetectsCorrectly(string input, bool expected)
        => Assert.Equal(expected, helper.IsPalindrome(input));

    [Theory]
    [InlineData("Hello World", 2)]
    [InlineData("", 0)]
    [InlineData("  spaces  ", 1)]
    public void CountWords_CountsCorrectly(string input, int expected)
        => Assert.Equal(expected, helper.CountWords(input));
}`,
    tests: [
      { expected: "class StringHelper", type: "contains" },
      { expected: "Reverse(", type: "contains" },
      { expected: "IsPalindrome(", type: "contains" },
      { expected: "Assert.Equal", type: "contains" },
    ],
  },
  {
    id: "cs_106",
    type: "code",
    category: "Tests C#",
    title: "Mock avec interface",
    description: "Testez avec des dépendances mockées.",
    instruction: "Créez une interface <code>IEmailService</code> avec <code>bool Send(string to, string subject)</code>. Créez <code>UserRegistration</code> qui dépend de IEmailService. Créez un <code>MockEmailService</code> pour tester que l'inscription envoie bien un email.",
    code_template: `using System;
using System.Collections.Generic;

// Mock pattern pour tests
`,
    solution: `using System;
using System.Collections.Generic;

interface IEmailService
{
    bool Send(string to, string subject);
}

class UserRegistration
{
    private readonly IEmailService emailService;
    public UserRegistration(IEmailService emailService)
        => this.emailService = emailService;
    
    public bool Register(string email, string password)
    {
        if (string.IsNullOrEmpty(email) || password.Length < 8)
            return false;
        return emailService.Send(email, "Bienvenue !");
    }
}

class MockEmailService : IEmailService
{
    public List<(string To, string Subject)> SentEmails { get; } = new();
    public bool Send(string to, string subject)
    {
        SentEmails.Add((to, subject));
        return true;
    }
}

// Test
// [Fact]
// public void Register_SendsWelcomeEmail()
// {
//     var mock = new MockEmailService();
//     var reg = new UserRegistration(mock);
//     reg.Register("aelita@lyoko.fr", "password123");
//     Assert.Single(mock.SentEmails);
//     Assert.Equal("Bienvenue !", mock.SentEmails[0].Subject);
// }`,
    tests: [
      { expected: "interface IEmailService", type: "contains" },
      { expected: "class MockEmailService : IEmailService", type: "contains" },
      { expected: "SentEmails", type: "contains" },
    ],
  },
  {
    id: "cs_107",
    type: "quiz",
    category: "Tests C#",
    title: "Fact vs Theory",
    description: "Quelle est la différence en xUnit ?",
    options: [
      "Aucune différence",
      "[Fact] teste un seul cas, [Theory] teste plusieurs cas avec [InlineData] paramétrisé",
      "[Theory] est pour les tests async",
      "[Fact] est déprécié",
    ],
    correct: 1,
    explanation: "[Fact] marque un test qui s'exécute une fois avec des données fixes. [Theory] marque un test paramétrisé qui s'exécute plusieurs fois avec différentes données fournies par [InlineData], [MemberData], ou [ClassData]. Utilisez Theory pour les tests qui suivent le même pattern avec des entrées différentes.",
  },

  // === PERFORMANCE ET SPAN (108-111) ===
  {
    id: "cs_108",
    type: "intro",
    category: "Performance",
    title: "Performance et Span<T>",
    description: "Optimisez votre code C#.",
    content: `<h3>⚡ Performance C#</h3>
<pre><code>// Span&lt;T&gt; — vue mémoire sans allocation
Span&lt;int&gt; slice = stackalloc int[100];
slice[0] = 42;

// ReadOnlySpan pour les chaînes
ReadOnlySpan&lt;char&gt; name = "Aelita Schaeffer".AsSpan();
ReadOnlySpan&lt;char&gt; first = name[..6]; // "Aelita" — zéro allocation !

// Benchmark avec Stopwatch
var sw = Stopwatch.StartNew();
// ... code à mesurer ...
sw.Stop();
Console.WriteLine($"Elapsed: {sw.ElapsedMilliseconds}ms");

// ArrayPool — réutilisation de tableaux
var pool = ArrayPool&lt;byte&gt;.Shared;
byte[] buffer = pool.Rent(1024);
try { /* utiliser buffer */ }
finally { pool.Return(buffer); }

// String.Create pour éviter les allocations
string result = string.Create(10, 0, (span, state) => {
    for (int i = 0; i &lt; span.Length; i++)
        span[i] = (char)('A' + i);
});</code></pre>`,
  },
  {
    id: "cs_109",
    type: "code",
    category: "Performance",
    title: "Span<T> en action",
    description: "Manipulez la mémoire efficacement.",
    instruction: "Créez une méthode <code>int CountChar(ReadOnlySpan&lt;char&gt; text, char c)</code> qui compte les occurrences d'un caractère sans allocation. Créez une méthode <code>void ReverseInPlace(Span&lt;int&gt; data)</code> qui inverse un tableau sur place. Testez les deux.",
    code_template: `using System;

class Program
{
    // Méthodes avec Span

    static void Main()
    {
        // Testez

    }
}`,
    solution: `using System;

class Program
{
    static int CountChar(ReadOnlySpan<char> text, char c)
    {
        int count = 0;
        foreach (char ch in text)
            if (ch == c) count++;
        return count;
    }
    
    static void ReverseInPlace(Span<int> data)
    {
        for (int i = 0, j = data.Length - 1; i < j; i++, j--)
            (data[i], data[j]) = (data[j], data[i]);
    }

    static void Main()
    {
        ReadOnlySpan<char> text = "Aelita sur Lyoko".AsSpan();
        Console.WriteLine($"Nombre de 'a': {CountChar(text, 'a')}");
        
        int[] arr = {1, 2, 3, 4, 5};
        ReverseInPlace(arr);
        Console.WriteLine(string.Join(", ", arr));
    }
}`,
    tests: [
      { expected: "ReadOnlySpan<char>", type: "contains" },
      { expected: "Span<int>", type: "contains" },
      { expected: "CountChar(", type: "contains" },
      { expected: "ReverseInPlace(", type: "contains" },
    ],
  },
  {
    id: "cs_110",
    type: "code",
    category: "Performance",
    title: "Benchmark avec Stopwatch",
    description: "Mesurez les performances.",
    instruction: "Créez un benchmark qui compare 3 façons de concaténer 10000 strings : <code>string +=</code>, <code>StringBuilder</code>, et <code>string.Join</code>. Mesurez le temps de chaque avec <code>Stopwatch</code> et affichez les résultats.",
    code_template: `using System;
using System.Diagnostics;
using System.Text;
using System.Linq;

class Program
{
    static void Main()
    {
        // Benchmark de concaténation

    }
}`,
    solution: `using System;
using System.Diagnostics;
using System.Text;
using System.Linq;

class Program
{
    static void Main()
    {
        const int N = 10000;
        
        var sw = Stopwatch.StartNew();
        string s = "";
        for (int i = 0; i < N; i++) s += i.ToString();
        sw.Stop();
        Console.WriteLine($"string +=     : {sw.ElapsedMilliseconds}ms");
        
        sw.Restart();
        var sb = new StringBuilder();
        for (int i = 0; i < N; i++) sb.Append(i);
        string s2 = sb.ToString();
        sw.Stop();
        Console.WriteLine($"StringBuilder : {sw.ElapsedMilliseconds}ms");
        
        sw.Restart();
        string s3 = string.Join("", Enumerable.Range(0, N));
        sw.Stop();
        Console.WriteLine($"string.Join   : {sw.ElapsedMilliseconds}ms");
    }
}`,
    tests: [
      { expected: "Stopwatch", type: "contains" },
      { expected: "StringBuilder", type: "contains" },
      { expected: "string.Join", type: "contains" },
      { expected: "ElapsedMilliseconds", type: "contains" },
    ],
  },
  {
    id: "cs_111",
    type: "quiz",
    category: "Performance",
    title: "Span vs Array",
    description: "Quel est l'avantage de Span<T> ?",
    options: [
      "Span est plus rapide pour les allocations",
      "Span offre une vue sans allocation sur un segment de mémoire (array, stack, string) sans copier les données",
      "Span remplace les tableaux dans tous les cas",
      "Span est uniquement pour les types numériques",
    ],
    correct: 1,
    explanation: "Span<T> est une vue sur un segment contigu de mémoire. Il peut pointer vers un array, la pile (stackalloc), ou une portion de string sans copier les données. C'est zéro-allocation, ce qui réduit la pression sur le GC. Limitation : Span est un ref struct, il ne peut pas être stocké sur le heap.",
  },

  // === ASP.NET AVANCÉ (112-116) ===
  {
    id: "cs_112",
    type: "intro",
    category: "ASP.NET avancé",
    title: "ASP.NET Core avancé",
    description: "Construisez des APIs professionnelles.",
    content: `<h3>🌐 ASP.NET Core avancé</h3>
<pre><code>// Middleware personnalisé
app.Use(async (context, next) => {
    var sw = Stopwatch.StartNew();
    await next();
    sw.Stop();
    context.Response.Headers["X-Response-Time"] = $"{sw.ElapsedMilliseconds}ms";
});

// Filters
public class ValidateModelAttribute : ActionFilterAttribute {
    public override void OnActionExecuting(ActionExecutingContext ctx) {
        if (!ctx.ModelState.IsValid)
            ctx.Result = new BadRequestObjectResult(ctx.ModelState);
    }
}

// Background service
public class CleanupService : BackgroundService {
    protected override async Task ExecuteAsync(CancellationToken ct) {
        while (!ct.IsCancellationRequested) {
            await CleanExpiredTokens();
            await Task.Delay(TimeSpan.FromHours(1), ct);
        }
    }
}

// SignalR — temps réel
public class ChatHub : Hub {
    public async Task SendMessage(string user, string msg)
        => await Clients.All.SendAsync("ReceiveMessage", user, msg);
}</code></pre>`,
  },
  {
    id: "cs_113",
    type: "code",
    category: "ASP.NET avancé",
    title: "Middleware personnalisé",
    description: "Créez un middleware de logging.",
    instruction: "Créez un middleware <code>RequestLoggingMiddleware</code> qui log chaque requête : méthode HTTP, chemin, temps de réponse, et status code. Utilisez le pattern standard avec <code>RequestDelegate next</code> et <code>InvokeAsync</code>.",
    code_template: `using System.Diagnostics;
using Microsoft.AspNetCore.Http;

// Middleware de logging
`,
    solution: `using System.Diagnostics;
using Microsoft.AspNetCore.Http;

class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;

    public RequestLoggingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var sw = Stopwatch.StartNew();
        var method = context.Request.Method;
        var path = context.Request.Path;

        try
        {
            await _next(context);
        }
        finally
        {
            sw.Stop();
            var status = context.Response.StatusCode;
            Console.WriteLine($"[{DateTime.UtcNow:HH:mm:ss}] {method} {path} → {status} ({sw.ElapsedMilliseconds}ms)");
        }
    }
}

// Usage: app.UseMiddleware<RequestLoggingMiddleware>();`,
    tests: [
      { expected: "class RequestLoggingMiddleware", type: "contains" },
      { expected: "RequestDelegate", type: "contains" },
      { expected: "InvokeAsync", type: "contains" },
      { expected: "Stopwatch", type: "contains" },
    ],
  },
  {
    id: "cs_114",
    type: "code",
    category: "ASP.NET avancé",
    title: "Background Service",
    description: "Exécutez des tâches en arrière-plan.",
    instruction: "Créez un <code>BackgroundService</code> nommé <code>HealthCheckService</code> qui vérifie l'état du système toutes les 30 secondes. Il log l'utilisation mémoire et le nombre de threads actifs. Respectez le CancellationToken.",
    code_template: `using Microsoft.Extensions.Hosting;
using System.Diagnostics;

// Background service de health check
`,
    solution: `using Microsoft.Extensions.Hosting;
using System.Diagnostics;

class HealthCheckService : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        Console.WriteLine("HealthCheck service démarré");
        
        while (!ct.IsCancellationRequested)
        {
            var process = Process.GetCurrentProcess();
            var memoryMB = process.WorkingSet64 / 1024 / 1024;
            var threads = process.Threads.Count;
            
            Console.WriteLine($"[Health] Mémoire: {memoryMB}MB | Threads: {threads} | {DateTime.UtcNow:HH:mm:ss}");
            
            try
            {
                await Task.Delay(TimeSpan.FromSeconds(30), ct);
            }
            catch (TaskCanceledException)
            {
                break;
            }
        }
        
        Console.WriteLine("HealthCheck service arrêté");
    }
}

// Usage: builder.Services.AddHostedService<HealthCheckService>();`,
    tests: [
      { expected: "class HealthCheckService : BackgroundService", type: "contains" },
      { expected: "ExecuteAsync(CancellationToken", type: "contains" },
      { expected: "ct.IsCancellationRequested", type: "contains" },
    ],
  },
  {
    id: "cs_115",
    type: "code",
    category: "ASP.NET avancé",
    title: "SignalR Hub",
    description: "Communication temps réel.",
    instruction: "Créez un <code>GameHub</code> SignalR avec les méthodes : <code>JoinRoom(string room)</code>, <code>LeaveRoom(string room)</code>, <code>SendToRoom(string room, string message)</code>. Override <code>OnConnectedAsync</code> et <code>OnDisconnectedAsync</code> pour loguer les connexions.",
    code_template: `using Microsoft.AspNetCore.SignalR;

// GameHub SignalR
`,
    solution: `using Microsoft.AspNetCore.SignalR;

class GameHub : Hub
{
    public async Task JoinRoom(string room)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, room);
        await Clients.Group(room).SendAsync("SystemMessage", $"{Context.ConnectionId} a rejoint {room}");
    }

    public async Task LeaveRoom(string room)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, room);
        await Clients.Group(room).SendAsync("SystemMessage", $"{Context.ConnectionId} a quitté {room}");
    }

    public async Task SendToRoom(string room, string message)
    {
        await Clients.Group(room).SendAsync("ReceiveMessage", Context.ConnectionId, message);
    }

    public override async Task OnConnectedAsync()
    {
        Console.WriteLine($"Connecté: {Context.ConnectionId}");
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? ex)
    {
        Console.WriteLine($"Déconnecté: {Context.ConnectionId}");
        await base.OnDisconnectedAsync(ex);
    }
}

// Usage: app.MapHub<GameHub>("/gamehub");`,
    tests: [
      { expected: "class GameHub : Hub", type: "contains" },
      { expected: "JoinRoom", type: "contains" },
      { expected: "Groups.AddToGroupAsync", type: "contains" },
      { expected: "Clients.Group", type: "contains" },
    ],
  },
  {
    id: "cs_116",
    type: "quiz",
    category: "ASP.NET avancé",
    title: "Middleware pipeline",
    description: "Dans quel ordre les middlewares s'exécutent-ils ?",
    options: [
      "En parallèle",
      "Dans l'ordre d'enregistrement (FIFO), formant un pipeline où chaque middleware peut court-circuiter",
      "Dans l'ordre inverse",
      "L'ordre n'a pas d'importance",
    ],
    correct: 1,
    explanation: "Les middlewares forment un pipeline séquentiel. Chaque middleware reçoit la requête, peut la modifier, appeler next() pour passer au suivant, puis modifier la réponse au retour. L'ordre est crucial : l'authentification doit être avant l'autorisation, le CORS avant tout, etc.",
  },

  // === PROJET FINAL (117-120) ===
  {
    id: "cs_117",
    type: "code",
    category: "Projet final",
    title: "Service avec DI complet",
    description: "Architecture en couches avec DI.",
    instruction: "Créez un service complet avec 3 couches : <code>IUserRepository</code> (interface données), <code>UserService</code> (logique métier), et l'enregistrement DI. UserService valide, hash le mot de passe (simulé), et appelle le repository. Montrez l'enregistrement avec AddScoped/AddSingleton.",
    code_template: `using System;
using System.Collections.Generic;

// Architecture en couches avec DI
`,
    solution: `using System;
using System.Collections.Generic;

record UserDto(string Name, string Email, string Password);
record User(int Id, string Name, string Email, string PasswordHash);

interface IUserRepository
{
    User? GetByEmail(string email);
    User Create(string name, string email, string hash);
}

interface IHasher
{
    string Hash(string input);
}

class UserService
{
    private readonly IUserRepository repo;
    private readonly IHasher hasher;
    
    public UserService(IUserRepository repo, IHasher hasher)
    {
        this.repo = repo;
        this.hasher = hasher;
    }
    
    public User Register(UserDto dto)
    {
        if (string.IsNullOrEmpty(dto.Email)) throw new Exception("Email requis");
        if (dto.Password.Length < 8) throw new Exception("Mot de passe trop court");
        if (repo.GetByEmail(dto.Email) != null) throw new Exception("Email déjà utilisé");
        
        var hash = hasher.Hash(dto.Password);
        return repo.Create(dto.Name, dto.Email, hash);
    }
}

// DI Registration:
// builder.Services.AddScoped<IUserRepository, SqlUserRepository>();
// builder.Services.AddSingleton<IHasher, BcryptHasher>();
// builder.Services.AddScoped<UserService>();`,
    tests: [
      { expected: "interface IUserRepository", type: "contains" },
      { expected: "interface IHasher", type: "contains" },
      { expected: "class UserService", type: "contains" },
      { expected: "private readonly IUserRepository", type: "contains" },
    ],
  },
  {
    id: "cs_118",
    type: "code",
    category: "Projet final",
    title: "API REST complète",
    description: "Construisez une API REST structurée.",
    instruction: "Créez une API minimale ASP.NET Core complète pour un système de tâches avec : validation, error handling, pagination (skip/take), recherche par texte, et filtrage par statut. Utilisez les Results helpers.",
    code_template: `// API REST complète avec validation et pagination

`,
    solution: `record TaskItem(int Id, string Title, bool Done, DateTime CreatedAt);
record CreateTaskDto(string Title);

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var tasks = new List<TaskItem>();
int nextId = 1;

app.MapGet("/tasks", (int? skip, int? take, string? search, bool? done) =>
{
    IEnumerable<TaskItem> query = tasks;
    if (done.HasValue) query = query.Where(t => t.Done == done);
    if (!string.IsNullOrEmpty(search)) query = query.Where(t => t.Title.Contains(search, StringComparison.OrdinalIgnoreCase));
    var total = query.Count();
    var items = query.Skip(skip ?? 0).Take(take ?? 20).ToList();
    return Results.Ok(new { total, items });
});

app.MapGet("/tasks/{id}", (int id) =>
    tasks.FirstOrDefault(t => t.Id == id) is TaskItem t
        ? Results.Ok(t)
        : Results.NotFound(new { error = "Tâche non trouvée" }));

app.MapPost("/tasks", (CreateTaskDto dto) =>
{
    if (string.IsNullOrWhiteSpace(dto.Title))
        return Results.BadRequest(new { error = "Titre requis" });
    var task = new TaskItem(nextId++, dto.Title, false, DateTime.UtcNow);
    tasks.Add(task);
    return Results.Created($"/tasks/{task.Id}", task);
});

app.MapPatch("/tasks/{id}/toggle", (int id) =>
{
    var idx = tasks.FindIndex(t => t.Id == id);
    if (idx < 0) return Results.NotFound();
    tasks[idx] = tasks[idx] with { Done = !tasks[idx].Done };
    return Results.Ok(tasks[idx]);
});

app.MapDelete("/tasks/{id}", (int id) =>
{
    var removed = tasks.RemoveAll(t => t.Id == id);
    return removed > 0 ? Results.NoContent() : Results.NotFound();
});

app.Run();`,
    tests: [
      { expected: "MapGet", type: "contains" },
      { expected: "MapPost", type: "contains" },
      { expected: "MapDelete", type: "contains" },
      { expected: "Results.BadRequest", type: "contains" },
      { expected: "skip", type: "contains" },
    ],
  },
  {
    id: "cs_119",
    type: "quiz",
    category: "Projet final",
    title: ".NET vs autres stacks",
    description: "Quand choisir .NET ?",
    options: [
      ".NET est toujours le meilleur choix",
      "Pour les apps d'entreprise, les APIs performantes, le gaming (Unity), et quand l'écosystème Microsoft est déjà en place",
      ".NET n'est utile que pour Windows",
      ".NET est uniquement pour le backend",
    ],
    correct: 1,
    explanation: ".NET excelle dans : les applications d'entreprise (EF Core, Identity, SignalR), les APIs haute performance (Kestrel est un des serveurs les plus rapides), le gaming (Unity utilise C#), les apps cross-platform (MAUI). Depuis .NET Core, il tourne sur Linux, macOS et dans Docker.",
  },
  {
    id: "cs_120",
    type: "code",
    category: "Projet final",
    title: "Projet final — Chat temps réel",
    description: "Assemblez tous les concepts.",
    instruction: "Créez la structure d'un serveur de chat temps réel avec : un record <code>ChatMessage</code>, un service <code>IChatService</code> avec l'historique en mémoire, un Hub SignalR <code>ChatHub</code>, et l'enregistrement DI + endpoints. Montrez l'architecture complète.",
    code_template: `// Serveur de chat temps réel complet

`,
    solution: `record ChatMessage(string User, string Text, DateTime Timestamp);

interface IChatService
{
    void AddMessage(ChatMessage msg);
    IEnumerable<ChatMessage> GetHistory(int count = 50);
}

class InMemoryChatService : IChatService
{
    private readonly List<ChatMessage> messages = new();
    private readonly object lockObj = new();

    public void AddMessage(ChatMessage msg)
    {
        lock (lockObj) { messages.Add(msg); }
    }

    public IEnumerable<ChatMessage> GetHistory(int count = 50)
    {
        lock (lockObj) { return messages.TakeLast(count).ToList(); }
    }
}

class ChatHub : Hub
{
    private readonly IChatService chat;
    public ChatHub(IChatService chat) => this.chat = chat;

    public async Task SendMessage(string user, string text)
    {
        var msg = new ChatMessage(user, text, DateTime.UtcNow);
        chat.AddMessage(msg);
        await Clients.All.SendAsync("NewMessage", msg);
    }

    public Task<IEnumerable<ChatMessage>> GetHistory()
        => Task.FromResult(chat.GetHistory());
}

// Program.cs:
builder.Services.AddSingleton<IChatService, InMemoryChatService>();
builder.Services.AddSignalR();
app.MapHub<ChatHub>("/chat");
app.MapGet("/api/history", (IChatService chat) => chat.GetHistory());`,
    tests: [
      { expected: "record ChatMessage", type: "contains" },
      { expected: "interface IChatService", type: "contains" },
      { expected: "class InMemoryChatService : IChatService", type: "contains" },
      { expected: "ChatHub", type: "contains" },
    ],
  },
];

addExercises("csharp", exercises);
