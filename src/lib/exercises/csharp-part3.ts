import { addExercises } from "./registry";
import type { Exercise } from "./registry";

const exercises: Exercise[] = [
  // === COLLECTIONS (41-45) ===
  {
    id: "cs_41",
    type: "intro",
    category: "Collections",
    title: "Collections en C#",
    description: "Manipulez des données avec les collections .NET.",
    content: `<h3>📚 Collections .NET</h3>
<p>C# offre des collections génériques puissantes dans <code>System.Collections.Generic</code>.</p>
<pre><code>// List<T> — Liste dynamique
List&lt;string&gt; noms = new() { "Aelita", "Yumi", "Odd" };
noms.Add("Ulrich");
noms.Remove("Odd");
Console.WriteLine(noms.Count); // 3

// Dictionary<TKey, TValue> — Clé/Valeur
Dictionary&lt;string, int&gt; scores = new()
{
    ["Aelita"] = 95,
    ["Yumi"] = 88,
};
scores["Odd"] = 72;

// HashSet<T> — Valeurs uniques
HashSet&lt;int&gt; ids = new() { 1, 2, 3, 2, 1 };
Console.WriteLine(ids.Count); // 3

// Queue<T> et Stack<T>
Queue&lt;string&gt; file = new();
file.Enqueue("Premier");
Stack&lt;string&gt; pile = new();
pile.Push("Dernier");</code></pre>`,
  },
  {
    id: "cs_42",
    type: "code",
    category: "Collections",
    title: "List<T> basique",
    description: "Manipulez une liste générique.",
    instruction: "Créez une <code>List&lt;string&gt;</code> avec les noms <strong>\"Aelita\"</strong>, <strong>\"Yumi\"</strong>, <strong>\"Odd\"</strong>. Ajoutez <strong>\"Ulrich\"</strong>, supprimez <strong>\"Odd\"</strong>, puis affichez chaque nom avec <code>foreach</code>.",
    code_template: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        // Créez et manipulez la liste

    }
}`,
    solution: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        List<string> noms = new() { "Aelita", "Yumi", "Odd" };
        noms.Add("Ulrich");
        noms.Remove("Odd");
        foreach (string nom in noms)
            Console.WriteLine(nom);
    }
}`,
    tests: [
      { expected: "List<string>", type: "contains" },
      { expected: ".Add(", type: "contains" },
      { expected: ".Remove(", type: "contains" },
      { expected: "foreach", type: "contains" },
    ],
  },
  {
    id: "cs_43",
    type: "code",
    category: "Collections",
    title: "Dictionary",
    description: "Utilisez un dictionnaire clé/valeur.",
    instruction: "Créez un <code>Dictionary&lt;string, int&gt;</code> avec <strong>\"Aelita\" → 95</strong>, <strong>\"Yumi\" → 88</strong>, <strong>\"Odd\" → 72</strong>. Parcourez-le avec <code>foreach</code> et affichez chaque paire au format <strong>[Clé] : [Valeur]</strong>.",
    code_template: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        // Dictionnaire et parcours

    }
}`,
    solution: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        Dictionary<string, int> scores = new()
        {
            ["Aelita"] = 95,
            ["Yumi"] = 88,
            ["Odd"] = 72,
        };
        foreach (var pair in scores)
            Console.WriteLine($"{pair.Key} : {pair.Value}");
    }
}`,
    tests: [
      { expected: "Dictionary<string, int>", type: "contains" },
      { expected: "foreach", type: "contains" },
      { expected: "pair.Key", type: "contains" },
    ],
  },
  {
    id: "cs_44",
    type: "quiz",
    category: "Collections",
    title: "Quelle collection choisir ?",
    description: "Vous devez stocker des éléments uniques sans ordre particulier.",
    options: [
      "List<T> — liste ordonnée avec doublons",
      "Dictionary<TKey, TValue> — paires clé/valeur",
      "HashSet<T> — ensemble de valeurs uniques",
      "Queue<T> — file d'attente FIFO",
    ],
    correct: 2,
    explanation: "HashSet<T> est la collection idéale pour stocker des éléments uniques. Elle ne permet pas les doublons et offre des opérations O(1) pour l'ajout, la suppression et la recherche. Elle ne préserve pas l'ordre d'insertion.",
  },
  {
    id: "cs_45",
    type: "code",
    category: "Collections",
    title: "Stack — Pile LIFO",
    description: "Utilisez une pile pour inverser un mot.",
    instruction: "Créez une <code>Stack&lt;char&gt;</code>. Poussez chaque caractère du mot <strong>\"XANA\"</strong> dans la pile, puis dépiler (<code>Pop</code>) et afficher chaque caractère pour inverser le mot.",
    code_template: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        string mot = "XANA";
        // Utilisez une Stack pour inverser

    }
}`,
    solution: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        string mot = "XANA";
        Stack<char> pile = new();
        foreach (char c in mot)
            pile.Push(c);
        while (pile.Count > 0)
            Console.Write(pile.Pop());
        Console.WriteLine();
    }
}`,
    tests: [
      { expected: "Stack<char>", type: "contains" },
      { expected: "Push", type: "contains" },
      { expected: "Pop", type: "contains" },
    ],
  },

  // === LINQ (46-52) ===
  {
    id: "cs_46",
    type: "intro",
    category: "LINQ",
    title: "LINQ — Language Integrated Query",
    description: "Requêtez vos données avec élégance.",
    content: `<h3>🔍 LINQ — Le superpouvoir de C#</h3>
<p>LINQ permet d'écrire des <strong>requêtes</strong> directement en C#, sur n'importe quelle collection.</p>
<pre><code>using System.Linq;

int[] nombres = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };

// Filtrer
var pairs = nombres.Where(n => n % 2 == 0);

// Transformer
var carres = nombres.Select(n => n * n);

// Trier
var tries = nombres.OrderByDescending(n => n);

// Agréger
int somme = nombres.Sum();
double moy = nombres.Average();
int max = nombres.Max();

// Chaîner les opérations
var result = nombres
    .Where(n => n > 3)
    .Select(n => n * 2)
    .OrderBy(n => n)
    .ToList();

// Syntaxe de requête (alternative)
var query = from n in nombres
            where n % 2 == 0
            orderby n descending
            select n * 10;</code></pre>`,
  },
  {
    id: "cs_47",
    type: "code",
    category: "LINQ",
    title: "Filtrer avec Where",
    description: "Filtrez une collection avec LINQ.",
    instruction: "Créez un tableau <code>int[] nombres = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}</code>. Utilisez <code>.Where()</code> pour récupérer les nombres pairs, puis affichez-les avec <code>foreach</code>.",
    code_template: `using System;
using System.Linq;

class Program
{
    static void Main()
    {
        int[] nombres = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
        // Filtrez les pairs avec LINQ

    }
}`,
    solution: `using System;
using System.Linq;

class Program
{
    static void Main()
    {
        int[] nombres = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
        var pairs = nombres.Where(n => n % 2 == 0);
        foreach (var n in pairs)
            Console.WriteLine(n);
    }
}`,
    tests: [
      { expected: ".Where(", type: "contains" },
      { expected: "% 2 == 0", type: "contains" },
      { expected: "foreach", type: "contains" },
    ],
  },
  {
    id: "cs_48",
    type: "code",
    category: "LINQ",
    title: "Select et OrderBy",
    description: "Transformez et triez avec LINQ.",
    instruction: "Avec le tableau <code>string[] noms = {\"Yumi\", \"Aelita\", \"Odd\", \"Ulrich\"}</code>, utilisez LINQ pour trier par ordre alphabétique, mettre en majuscules avec <code>.Select(n => n.ToUpper())</code>, puis affichez le résultat.",
    code_template: `using System;
using System.Linq;

class Program
{
    static void Main()
    {
        string[] noms = {"Yumi", "Aelita", "Odd", "Ulrich"};
        // Triez et transformez en majuscules

    }
}`,
    solution: `using System;
using System.Linq;

class Program
{
    static void Main()
    {
        string[] noms = {"Yumi", "Aelita", "Odd", "Ulrich"};
        var result = noms.OrderBy(n => n).Select(n => n.ToUpper());
        foreach (var nom in result)
            Console.WriteLine(nom);
    }
}`,
    tests: [
      { expected: ".OrderBy(", type: "contains" },
      { expected: ".Select(", type: "contains" },
      { expected: "ToUpper()", type: "contains" },
    ],
  },
  {
    id: "cs_49",
    type: "quiz",
    category: "LINQ",
    title: "Exécution différée",
    description: "Quand une requête LINQ est-elle exécutée ?",
    code_snippet: `var result = nombres.Where(n => n > 5);
nombres[0] = 100;
foreach (var n in result)
    Console.Write(n + " ");`,
    options: [
      "Au moment de l'appel .Where()",
      "Au moment du foreach (exécution différée)",
      "Au moment de la déclaration de result",
      "Jamais, LINQ est compilé en amont",
    ],
    correct: 1,
    explanation: "LINQ utilise l'exécution différée (deferred execution). La requête n'est exécutée qu'au moment de l'itération (foreach, ToList(), etc.). Donc le changement nombres[0] = 100 sera pris en compte car il est fait avant le foreach.",
  },
  {
    id: "cs_50",
    type: "code",
    category: "LINQ",
    title: "Agrégations LINQ",
    description: "Calculez des statistiques avec LINQ.",
    instruction: "Avec <code>int[] scores = {85, 92, 78, 96, 88, 73, 95}</code>, utilisez LINQ pour afficher : la somme (<code>.Sum()</code>), la moyenne (<code>.Average()</code>), le max (<code>.Max()</code>), et le nombre de scores > 80 (<code>.Count(s => s > 80)</code>).",
    code_template: `using System;
using System.Linq;

class Program
{
    static void Main()
    {
        int[] scores = {85, 92, 78, 96, 88, 73, 95};
        // Affichez somme, moyenne, max, count > 80

    }
}`,
    solution: `using System;
using System.Linq;

class Program
{
    static void Main()
    {
        int[] scores = {85, 92, 78, 96, 88, 73, 95};
        Console.WriteLine($"Somme : {scores.Sum()}");
        Console.WriteLine($"Moyenne : {scores.Average()}");
        Console.WriteLine($"Max : {scores.Max()}");
        Console.WriteLine($"Scores > 80 : {scores.Count(s => s > 80)}");
    }
}`,
    tests: [
      { expected: ".Sum()", type: "contains" },
      { expected: ".Average()", type: "contains" },
      { expected: ".Max()", type: "contains" },
      { expected: ".Count(", type: "contains" },
    ],
  },
  {
    id: "cs_51",
    type: "code",
    category: "LINQ",
    title: "GroupBy LINQ",
    description: "Regroupez des éléments.",
    instruction: "Créez une liste de tuples <code>(string Nom, string Equipe)</code> avec : (\"Aelita\", \"Lyoko\"), (\"Yumi\", \"Lyoko\"), (\"XANA\", \"Ennemi\"), (\"William\", \"Ennemi\"). Utilisez <code>.GroupBy(p => p.Equipe)</code> pour regrouper et afficher chaque groupe.",
    code_template: `using System;
using System.Linq;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        var personnages = new List<(string Nom, string Equipe)>
        {
            ("Aelita", "Lyoko"),
            ("Yumi", "Lyoko"),
            ("XANA", "Ennemi"),
            ("William", "Ennemi"),
        };
        // GroupBy Equipe et affichez

    }
}`,
    solution: `using System;
using System.Linq;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        var personnages = new List<(string Nom, string Equipe)>
        {
            ("Aelita", "Lyoko"),
            ("Yumi", "Lyoko"),
            ("XANA", "Ennemi"),
            ("William", "Ennemi"),
        };
        var groupes = personnages.GroupBy(p => p.Equipe);
        foreach (var groupe in groupes)
        {
            Console.WriteLine($"Équipe {groupe.Key} :");
            foreach (var p in groupe)
                Console.WriteLine($"  - {p.Nom}");
        }
    }
}`,
    tests: [
      { expected: ".GroupBy(", type: "contains" },
      { expected: "groupe.Key", type: "contains" },
      { expected: "foreach", type: "contains" },
    ],
  },
  {
    id: "cs_52",
    type: "quiz",
    category: "LINQ",
    title: "First vs FirstOrDefault",
    description: "Quelle est la différence ?",
    options: [
      "Aucune différence",
      "First lance une exception si vide, FirstOrDefault retourne la valeur par défaut",
      "FirstOrDefault est plus lent que First",
      "First retourne le dernier élément",
    ],
    correct: 1,
    explanation: "First() lance une InvalidOperationException si la séquence est vide ou aucun élément ne correspond. FirstOrDefault() retourne la valeur par défaut du type (null pour les référence, 0 pour int, etc.) dans ces cas. Utilisez FirstOrDefault quand l'absence de résultat est possible.",
  },

  // === ASYNC/AWAIT (53-56) ===
  {
    id: "cs_53",
    type: "intro",
    category: "Async / Await",
    title: "Programmation asynchrone",
    description: "Exécutez des tâches sans bloquer le programme.",
    content: `<h3>⚡ Async / Await en C#</h3>
<p>C# a été pionnier dans l'intégration d'async/await (2012), avant JavaScript et Python.</p>
<pre><code>// Méthode asynchrone
async Task&lt;string&gt; TelechargerAsync(string url)
{
    using HttpClient client = new();
    string contenu = await client.GetStringAsync(url);
    return contenu;
}

// Utilisation
async Task Main()
{
    string page = await TelechargerAsync("https://example.com");
    Console.WriteLine(page.Length);
}

// Exécuter plusieurs tâches en parallèle
async Task ChargerTout()
{
    Task&lt;string&gt; t1 = TelechargerAsync("url1");
    Task&lt;string&gt; t2 = TelechargerAsync("url2");
    string[] results = await Task.WhenAll(t1, t2);
}

// Task.Delay (équivalent de setTimeout)
await Task.Delay(1000); // Pause 1 seconde</code></pre>`,
  },
  {
    id: "cs_54",
    type: "code",
    category: "Async / Await",
    title: "Première méthode async",
    description: "Écrivez une méthode asynchrone.",
    instruction: "Créez une méthode <code>static async Task SaluerAsync(string nom)</code> qui attend 1 seconde avec <code>await Task.Delay(1000)</code> puis affiche <strong>Bonjour [nom] !</strong>. Appelez-la dans Main avec <strong>\"Aelita\"</strong>.",
    code_template: `using System;
using System.Threading.Tasks;

class Program
{
    // Méthode async


    static async Task Main()
    {
        // Appelez SaluerAsync

    }
}`,
    solution: `using System;
using System.Threading.Tasks;

class Program
{
    static async Task SaluerAsync(string nom)
    {
        await Task.Delay(1000);
        Console.WriteLine($"Bonjour {nom} !");
    }

    static async Task Main()
    {
        await SaluerAsync("Aelita");
    }
}`,
    tests: [
      { expected: "async Task SaluerAsync", type: "contains" },
      { expected: "await Task.Delay", type: "contains" },
      { expected: "await SaluerAsync", type: "contains" },
    ],
  },
  {
    id: "cs_55",
    type: "code",
    category: "Async / Await",
    title: "Tâches parallèles",
    description: "Exécutez des tâches en parallèle.",
    instruction: "Créez une méthode <code>static async Task&lt;string&gt; ChargerAsync(string nom, int delai)</code> qui attend <code>delai</code> ms puis retourne <strong>\"[nom] chargé\"</strong>. Dans Main, lancez 3 tâches en parallèle (\"Module A\" 1000ms, \"Module B\" 500ms, \"Module C\" 800ms) avec <code>Task.WhenAll</code> et affichez les résultats.",
    code_template: `using System;
using System.Threading.Tasks;

class Program
{
    // Méthode ChargerAsync


    static async Task Main()
    {
        // Lancez 3 tâches en parallèle

    }
}`,
    solution: `using System;
using System.Threading.Tasks;

class Program
{
    static async Task<string> ChargerAsync(string nom, int delai)
    {
        await Task.Delay(delai);
        return $"{nom} chargé";
    }

    static async Task Main()
    {
        var resultats = await Task.WhenAll(
            ChargerAsync("Module A", 1000),
            ChargerAsync("Module B", 500),
            ChargerAsync("Module C", 800)
        );
        foreach (var r in resultats)
            Console.WriteLine(r);
    }
}`,
    tests: [
      { expected: "async Task<string>", type: "contains" },
      { expected: "Task.WhenAll", type: "contains" },
      { expected: "await", type: "contains" },
    ],
  },
  {
    id: "cs_56",
    type: "quiz",
    category: "Async / Await",
    title: "Task vs Thread",
    description: "Quelle est la différence entre Task et Thread en C# ?",
    options: [
      "Task est plus ancien que Thread",
      "Task utilise le ThreadPool et gère l'asynchronisme, Thread crée un thread OS dédié",
      "Thread supporte async/await, pas Task",
      "Il n'y a aucune différence",
    ],
    correct: 1,
    explanation: "Task utilise le ThreadPool géré par .NET pour exécuter du travail de manière asynchrone. Un Thread crée un thread OS dédié, plus coûteux. Task est le choix recommandé en C# moderne car il est plus léger, supporte async/await, et gère mieux les ressources.",
  },

  // === FICHIERS ET I/O (57-60) ===
  {
    id: "cs_57",
    type: "intro",
    category: "Fichiers et I/O",
    title: "Manipulation de fichiers",
    description: "Lisez et écrivez des fichiers en C#.",
    content: `<h3>📁 Fichiers en C#</h3>
<p>Le namespace <code>System.IO</code> offre des méthodes simples et puissantes.</p>
<pre><code>using System.IO;

// Écrire tout le contenu
File.WriteAllText("fichier.txt", "Bonjour Lyoko !");

// Lire tout le contenu
string contenu = File.ReadAllText("fichier.txt");

// Écrire ligne par ligne
File.WriteAllLines("noms.txt", new[] { "Aelita", "Yumi" });

// Lire ligne par ligne
string[] lignes = File.ReadAllLines("noms.txt");

// Ajouter à un fichier
File.AppendAllText("log.txt", "Nouvelle entrée\\n");

// Vérifier l'existence
if (File.Exists("fichier.txt"))
    Console.WriteLine("Le fichier existe");

// StreamWriter pour gros fichiers
using (StreamWriter sw = new("rapport.txt"))
{
    sw.WriteLine("Ligne 1");
    sw.WriteLine("Ligne 2");
} // Automatiquement fermé grâce à using</code></pre>`,
  },
  {
    id: "cs_58",
    type: "code",
    category: "Fichiers et I/O",
    title: "Écrire et lire un fichier",
    description: "Manipulez un fichier texte.",
    instruction: "Utilisez <code>File.WriteAllText</code> pour écrire <strong>\"Bienvenue sur Lyoko\"</strong> dans <strong>\"message.txt\"</strong>. Puis lisez le contenu avec <code>File.ReadAllText</code> et affichez-le.",
    code_template: `using System;
using System.IO;

class Program
{
    static void Main()
    {
        // Écrire puis lire

    }
}`,
    solution: `using System;
using System.IO;

class Program
{
    static void Main()
    {
        File.WriteAllText("message.txt", "Bienvenue sur Lyoko");
        string contenu = File.ReadAllText("message.txt");
        Console.WriteLine(contenu);
    }
}`,
    tests: [
      { expected: "File.WriteAllText", type: "contains" },
      { expected: "File.ReadAllText", type: "contains" },
      { expected: "Bienvenue sur Lyoko", type: "contains" },
    ],
  },
  {
    id: "cs_59",
    type: "code",
    category: "Fichiers et I/O",
    title: "Using et StreamWriter",
    description: "Utilisez le pattern using pour écrire un fichier.",
    instruction: "Utilisez un bloc <code>using</code> avec un <code>StreamWriter</code> pour écrire 3 lignes dans <strong>\"guerriers.txt\"</strong> : <strong>Aelita</strong>, <strong>Yumi</strong>, <strong>Ulrich</strong>. Puis lisez et affichez avec <code>File.ReadAllLines</code>.",
    code_template: `using System;
using System.IO;

class Program
{
    static void Main()
    {
        // Écrivez avec StreamWriter + using

        // Lisez et affichez

    }
}`,
    solution: `using System;
using System.IO;

class Program
{
    static void Main()
    {
        using (StreamWriter sw = new("guerriers.txt"))
        {
            sw.WriteLine("Aelita");
            sw.WriteLine("Yumi");
            sw.WriteLine("Ulrich");
        }

        string[] lignes = File.ReadAllLines("guerriers.txt");
        foreach (string ligne in lignes)
            Console.WriteLine(ligne);
    }
}`,
    tests: [
      { expected: "using", type: "contains" },
      { expected: "StreamWriter", type: "contains" },
      { expected: "File.ReadAllLines", type: "contains" },
    ],
  },
  {
    id: "cs_60",
    type: "quiz",
    category: "Fichiers et I/O",
    title: "Le pattern using",
    description: "Que fait le mot-clé 'using' avec un StreamWriter ?",
    options: [
      "Il importe un namespace",
      "Il appelle automatiquement Dispose() à la fin du bloc pour libérer les ressources",
      "Il rend le StreamWriter plus rapide",
      "Il empêche les exceptions",
    ],
    correct: 1,
    explanation: "Le mot-clé 'using' en C# garantit que la méthode Dispose() sera appelée à la fin du bloc, même en cas d'exception. Cela libère les ressources (ferme le fichier, la connexion, etc.). C'est équivalent à un try/finally avec Dispose().",
  },
];

addExercises("csharp", exercises);
