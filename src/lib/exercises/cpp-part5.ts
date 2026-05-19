import { addExercises } from "./registry";
import type { Exercise } from "./registry";

const exercises: Exercise[] = [
  // === POINTEURS AVANCÉS (81-85) ===
  {
    id: "cpp_81",
    type: "intro",
    category: "Pointeurs avancés",
    title: "Pointeurs intelligents C++",
    description: "Gérez la mémoire automatiquement.",
    content: `<h3>🧠 Smart Pointers</h3>
<p>Les smart pointers gèrent la mémoire automatiquement, évitant les fuites.</p>
<pre><code>#include &lt;memory&gt;

// unique_ptr — propriété exclusive
auto p = std::make_unique&lt;int&gt;(42);
// auto p2 = p; // ❌ Erreur ! Non copiable
auto p2 = std::move(p); // ✅ Transfert de propriété

// shared_ptr — propriété partagée
auto s1 = std::make_shared&lt;std::string&gt;("Hello");
auto s2 = s1; // ✅ Compteur de référence = 2
// Libéré quand le dernier shared_ptr est détruit

// weak_ptr — référence non-possédante
std::weak_ptr&lt;int&gt; w = s1;
if (auto locked = w.lock()) {
    // L'objet existe encore
}</code></pre>`,
  },
  {
    id: "cpp_82",
    type: "code",
    category: "Pointeurs avancés",
    title: "unique_ptr",
    description: "Utilisez unique_ptr pour la propriété exclusive.",
    instruction: "Créez une classe <code>Guerrier</code> avec nom et pv. Créez un <code>unique_ptr&lt;Guerrier&gt;</code> avec <code>make_unique</code>. Transférez la propriété avec <code>std::move</code> à une fonction <code>combattre()</code> qui affiche les infos.",
    code_template: `#include <iostream>
#include <memory>
#include <string>

// Classe Guerrier + unique_ptr
`,
    solution: `#include <iostream>
#include <memory>
#include <string>

class Guerrier {
public:
    std::string nom;
    int pv;
    Guerrier(std::string n, int p) : nom(n), pv(p) {}
    ~Guerrier() { std::cout << nom << " détruit" << std::endl; }
};

void combattre(std::unique_ptr<Guerrier> g) {
    std::cout << g->nom << " combat ! PV: " << g->pv << std::endl;
}

int main() {
    auto g = std::make_unique<Guerrier>("Aelita", 100);
    combattre(std::move(g));
    // g est maintenant nullptr
    return 0;
}`,
    tests: [
      { expected: "make_unique<Guerrier>", type: "contains" },
      { expected: "std::move", type: "contains" },
      { expected: "unique_ptr<Guerrier>", type: "contains" },
    ],
  },
  {
    id: "cpp_83",
    type: "code",
    category: "Pointeurs avancés",
    title: "shared_ptr",
    description: "Partagez la propriété d'un objet.",
    instruction: "Créez une classe <code>Ressource</code> qui affiche un message dans son destructeur. Créez 3 <code>shared_ptr</code> pointant vers la même Ressource. Affichez le <code>use_count()</code> à chaque étape. Vérifiez que la Ressource n'est détruite qu'une fois.",
    code_template: `#include <iostream>
#include <memory>

// shared_ptr avec compteur de références
`,
    solution: `#include <iostream>
#include <memory>

class Ressource {
public:
    std::string nom;
    Ressource(std::string n) : nom(n) {
        std::cout << "Ressource " << nom << " créée" << std::endl;
    }
    ~Ressource() {
        std::cout << "Ressource " << nom << " détruite" << std::endl;
    }
};

int main() {
    auto r1 = std::make_shared<Ressource>("Data");
    std::cout << "Count: " << r1.use_count() << std::endl;
    
    auto r2 = r1;
    std::cout << "Count: " << r1.use_count() << std::endl;
    
    {
        auto r3 = r1;
        std::cout << "Count: " << r1.use_count() << std::endl;
    }
    std::cout << "Count: " << r1.use_count() << std::endl;
    
    return 0;
}`,
    tests: [
      { expected: "make_shared<Ressource>", type: "contains" },
      { expected: "use_count()", type: "contains" },
      { expected: "make_shared", type: "contains" },
    ],
  },
  {
    id: "cpp_84",
    type: "quiz",
    category: "Pointeurs avancés",
    title: "unique_ptr vs shared_ptr",
    description: "Lequel choisir ?",
    options: [
      "Toujours utiliser shared_ptr",
      "unique_ptr par défaut (plus léger), shared_ptr quand plusieurs propriétaires sont nécessaires",
      "shared_ptr par défaut, unique_ptr pour l'optimisation",
      "Il n'y a pas de différence de performance",
    ],
    correct: 1,
    explanation: "unique_ptr n'a aucun overhead (même taille qu'un raw pointer). shared_ptr a un compteur de références atomique (overhead mémoire + synchronisation). Utilisez unique_ptr par défaut, et shared_ptr uniquement quand la propriété doit réellement être partagée.",
  },
  {
    id: "cpp_85",
    type: "code",
    category: "Pointeurs avancés",
    title: "RAII pattern",
    description: "Gérez les ressources avec RAII.",
    instruction: "Créez une classe <code>FileGuard</code> qui ouvre un fichier dans le constructeur et le ferme dans le destructeur (RAII). Ajoutez <code>write()</code> et <code>isOpen()</code>. Utilisez-la dans un bloc pour démontrer la fermeture automatique.",
    code_template: `#include <iostream>
#include <fstream>
#include <string>

// FileGuard avec RAII
`,
    solution: `#include <iostream>
#include <fstream>
#include <string>

class FileGuard {
    std::ofstream file;
    std::string filename;
public:
    FileGuard(const std::string& name) : filename(name), file(name) {
        if (!file.is_open()) throw std::runtime_error("Cannot open " + name);
        std::cout << "Fichier " << name << " ouvert" << std::endl;
    }
    ~FileGuard() {
        if (file.is_open()) {
            file.close();
            std::cout << "Fichier " << filename << " fermé" << std::endl;
        }
    }
    void write(const std::string& data) { file << data << std::endl; }
    bool isOpen() const { return file.is_open(); }
};

int main() {
    {
        FileGuard fg("test.txt");
        fg.write("Hello RAII");
        fg.write("Automatic cleanup");
    } // Fichier fermé automatiquement ici
    std::cout << "Fin du programme" << std::endl;
    return 0;
}`,
    tests: [
      { expected: "class FileGuard", type: "contains" },
      { expected: "~FileGuard()", type: "contains" },
      { expected: "file.close()", type: "contains" },
    ],
  },

  // === TEMPLATES AVANCÉS (86-90) ===
  {
    id: "cpp_86",
    type: "intro",
    category: "Templates avancés",
    title: "Templates avancés",
    description: "Métaprogrammation et templates variadiques.",
    content: `<h3>🧬 Templates avancés</h3>
<pre><code>// Template variadique
template&lt;typename... Args&gt;
void print(Args... args) {
    ((std::cout &lt;&lt; args &lt;&lt; " "), ...);
    std::cout &lt;&lt; std::endl;
}
print(1, "hello", 3.14); // 1 hello 3.14

// constexpr — calcul à la compilation
constexpr int factorial(int n) {
    return n <= 1 ? 1 : n * factorial(n - 1);
}
constexpr int f10 = factorial(10); // Calculé à la compilation !

// SFINAE / concepts (C++20)
template&lt;typename T&gt;
concept Numeric = std::is_arithmetic_v&lt;T&gt;;

template&lt;Numeric T&gt;
T add(T a, T b) { return a + b; }

// if constexpr — branchement à la compilation
template&lt;typename T&gt;
std::string stringify(T val) {
    if constexpr (std::is_same_v&lt;T, std::string&gt;)
        return val;
    else
        return std::to_string(val);
}</code></pre>`,
  },
  {
    id: "cpp_87",
    type: "code",
    category: "Templates avancés",
    title: "Template variadique",
    description: "Créez une fonction qui accepte n'importe quel nombre d'arguments.",
    instruction: "Créez une fonction template variadique <code>sum()</code> qui additionne tous ses arguments (de types potentiellement différents). Utilisez un fold expression <code>(... + args)</code>. Testez avec des int, double et float mélangés.",
    code_template: `#include <iostream>

// Fonction sum variadique
`,
    solution: `#include <iostream>

template<typename... Args>
auto sum(Args... args) {
    return (... + args);
}

int main() {
    std::cout << sum(1, 2, 3) << std::endl;           // 6
    std::cout << sum(1.5, 2.5, 3.0) << std::endl;     // 7.0
    std::cout << sum(1, 2.5, 3.0f) << std::endl;      // 6.5
    return 0;
}`,
    tests: [
      { expected: "template<typename... Args>", type: "contains" },
      { expected: "(... + args)", type: "contains" },
      { expected: "auto sum", type: "contains" },
    ],
  },
  {
    id: "cpp_88",
    type: "code",
    category: "Templates avancés",
    title: "constexpr factorial",
    description: "Calculez à la compilation.",
    instruction: "Créez une fonction <code>constexpr</code> qui calcule la factorielle. Utilisez <code>static_assert</code> pour vérifier le résultat à la compilation. Affichez aussi le résultat à l'exécution.",
    code_template: `#include <iostream>

// constexpr factorial + static_assert
`,
    solution: `#include <iostream>

constexpr long long factorial(int n) {
    long long result = 1;
    for (int i = 2; i <= n; i++) result *= i;
    return result;
}

int main() {
    constexpr auto f10 = factorial(10);
    static_assert(f10 == 3628800, "10! doit être 3628800");
    
    constexpr auto f5 = factorial(5);
    static_assert(f5 == 120, "5! doit être 120");
    
    std::cout << "10! = " << f10 << std::endl;
    std::cout << "5! = " << f5 << std::endl;
    return 0;
}`,
    tests: [
      { expected: "constexpr", type: "contains" },
      { expected: "static_assert", type: "contains" },
      { expected: "factorial", type: "contains" },
    ],
  },
  {
    id: "cpp_89",
    type: "quiz",
    category: "Templates avancés",
    title: "Concepts C++20",
    description: "À quoi servent les concepts ?",
    code_snippet: `template<typename T>
concept Sortable = requires(T a) {
    { a < a } -> std::convertible_to<bool>;
};`,
    options: [
      "À créer des interfaces comme en Java",
      "À contraindre les types acceptés par un template avec des messages d'erreur clairs",
      "À remplacer les classes virtuelles",
      "À optimiser les performances",
    ],
    correct: 1,
    explanation: "Les concepts C++20 permettent de spécifier des contraintes sur les types template. Avant les concepts, un type invalide causait des erreurs cryptiques. Avec les concepts, l'erreur est claire : 'T ne satisfait pas le concept Sortable'. Ils remplacent élégamment SFINAE.",
  },
  {
    id: "cpp_90",
    type: "code",
    category: "Templates avancés",
    title: "if constexpr",
    description: "Branchement à la compilation.",
    instruction: "Créez une fonction template <code>toString(T val)</code> qui utilise <code>if constexpr</code> pour : retourner directement si T est un string, appeler <code>std::to_string</code> si T est numérique, ou retourner <strong>\"[unknown]\"</strong> sinon.",
    code_template: `#include <iostream>
#include <string>
#include <type_traits>

// toString avec if constexpr
`,
    solution: `#include <iostream>
#include <string>
#include <type_traits>

template<typename T>
std::string toString(T val) {
    if constexpr (std::is_same_v<T, std::string>) {
        return val;
    } else if constexpr (std::is_arithmetic_v<T>) {
        return std::to_string(val);
    } else {
        return "[unknown]";
    }
}

int main() {
    std::cout << toString(42) << std::endl;
    std::cout << toString(3.14) << std::endl;
    std::cout << toString(std::string("hello")) << std::endl;
    return 0;
}`,
    tests: [
      { expected: "if constexpr", type: "contains" },
      { expected: "std::is_same_v", type: "contains" },
      { expected: "std::is_arithmetic_v", type: "contains" },
    ],
  },

  // === STL AVANCÉ (91-96) ===
  {
    id: "cpp_91",
    type: "intro",
    category: "STL avancé",
    title: "STL — Algorithmes et conteneurs avancés",
    description: "Maîtrisez la Standard Template Library.",
    content: `<h3>📚 STL avancé</h3>
<pre><code>#include &lt;algorithm&gt;
#include &lt;numeric&gt;
#include &lt;ranges&gt;  // C++20

std::vector&lt;int&gt; v = {5, 3, 1, 4, 2};

// Algorithmes classiques
std::sort(v.begin(), v.end());
auto it = std::find(v.begin(), v.end(), 3);
int sum = std::accumulate(v.begin(), v.end(), 0);
std::transform(v.begin(), v.end(), v.begin(), [](int x) { return x * 2; });

// C++20 Ranges
auto pairs = v | std::views::filter([](int x) { return x % 2 == 0; })
               | std::views::transform([](int x) { return x * x; });

// std::optional (C++17)
std::optional&lt;int&gt; trouver(const std::vector&lt;int&gt;& v, int val) {
    auto it = std::find(v.begin(), v.end(), val);
    if (it != v.end()) return *it;
    return std::nullopt;
}

// std::variant (C++17) — union sûre
std::variant&lt;int, std::string, double&gt; val = "hello";
auto s = std::get&lt;std::string&gt;(val);</code></pre>`,
  },
  {
    id: "cpp_92",
    type: "code",
    category: "STL avancé",
    title: "Algorithmes STL",
    description: "Utilisez les algorithmes de la STL.",
    instruction: "Créez un vecteur de 10 entiers aléatoires. Utilisez les algorithmes STL pour : trier, trouver le min/max, calculer la somme, compter les pairs, et filtrer les > 50 dans un nouveau vecteur. Affichez chaque résultat.",
    code_template: `#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>

// Algorithmes STL en action
`,
    solution: `#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>

int main() {
    std::vector<int> v = {73, 28, 91, 45, 12, 67, 34, 88, 56, 19};
    
    std::sort(v.begin(), v.end());
    std::cout << "Trié: ";
    for (int x : v) std::cout << x << " ";
    std::cout << std::endl;
    
    auto [minIt, maxIt] = std::minmax_element(v.begin(), v.end());
    std::cout << "Min: " << *minIt << ", Max: " << *maxIt << std::endl;
    
    int sum = std::accumulate(v.begin(), v.end(), 0);
    std::cout << "Somme: " << sum << std::endl;
    
    int pairs = std::count_if(v.begin(), v.end(), [](int x) { return x % 2 == 0; });
    std::cout << "Pairs: " << pairs << std::endl;
    
    std::vector<int> grands;
    std::copy_if(v.begin(), v.end(), std::back_inserter(grands), [](int x) { return x > 50; });
    std::cout << "Grands (>50): ";
    for (int x : grands) std::cout << x << " ";
    std::cout << std::endl;
    
    return 0;
}`,
    tests: [
      { expected: "std::sort", type: "contains" },
      { expected: "std::accumulate", type: "contains" },
      { expected: "std::count_if", type: "contains" },
      { expected: "std::copy_if", type: "contains" },
    ],
  },
  {
    id: "cpp_93",
    type: "code",
    category: "STL avancé",
    title: "std::optional",
    description: "Gérez les valeurs optionnelles.",
    instruction: "Créez une fonction <code>std::optional&lt;int&gt; parseInt(const std::string&amp; s)</code> qui tente de parser un string en int. Retournez <code>std::nullopt</code> si le parsing échoue. Testez avec des valeurs valides et invalides, en utilisant <code>.has_value()</code> et <code>.value_or()</code>.",
    code_template: `#include <iostream>
#include <optional>
#include <string>

// parseInt avec std::optional
`,
    solution: `#include <iostream>
#include <optional>
#include <string>

std::optional<int> parseInt(const std::string& s) {
    try {
        size_t pos;
        int result = std::stoi(s, &pos);
        if (pos == s.length()) return result;
        return std::nullopt;
    } catch (...) {
        return std::nullopt;
    }
}

int main() {
    auto a = parseInt("42");
    auto b = parseInt("hello");
    auto c = parseInt("123abc");
    
    std::cout << "42: " << a.value_or(-1) << std::endl;
    std::cout << "hello: " << b.value_or(-1) << std::endl;
    std::cout << "123abc: " << c.value_or(-1) << std::endl;
    
    if (a.has_value()) {
        std::cout << "Parsed: " << *a << std::endl;
    }
    return 0;
}`,
    tests: [
      { expected: "std::optional<int>", type: "contains" },
      { expected: "std::nullopt", type: "contains" },
      { expected: "has_value()", type: "contains" },
      { expected: "value_or", type: "contains" },
    ],
  },
  {
    id: "cpp_94",
    type: "code",
    category: "STL avancé",
    title: "std::map avancé",
    description: "Opérations avancées sur les maps.",
    instruction: "Créez un <code>std::map&lt;std::string, int&gt;</code> de scores. Utilisez <code>insert_or_assign</code> pour ajouter/mettre à jour, <code>try_emplace</code> pour n'insérer que si absent, itérez avec structured bindings, et utilisez <code>std::max_element</code> pour trouver le meilleur score.",
    code_template: `#include <iostream>
#include <map>
#include <string>
#include <algorithm>

// std::map avancé
`,
    solution: `#include <iostream>
#include <map>
#include <string>
#include <algorithm>

int main() {
    std::map<std::string, int> scores;
    
    scores.insert_or_assign("Aelita", 95);
    scores.insert_or_assign("Yumi", 88);
    scores.insert_or_assign("Odd", 72);
    scores.insert_or_assign("Aelita", 98); // Met à jour
    
    scores.try_emplace("Ulrich", 85);
    scores.try_emplace("Aelita", 50); // N'insère PAS (existe déjà)
    
    for (const auto& [nom, score] : scores) {
        std::cout << nom << ": " << score << std::endl;
    }
    
    auto best = std::max_element(scores.begin(), scores.end(),
        [](const auto& a, const auto& b) { return a.second < b.second; });
    std::cout << "Meilleur: " << best->first << " (" << best->second << ")" << std::endl;
    
    return 0;
}`,
    tests: [
      { expected: "insert_or_assign", type: "contains" },
      { expected: "try_emplace", type: "contains" },
      { expected: "auto& [nom, score]", type: "contains" },
      { expected: "max_element", type: "contains" },
    ],
  },
  {
    id: "cpp_95",
    type: "quiz",
    category: "STL avancé",
    title: "std::variant vs union",
    description: "Pourquoi préférer std::variant ?",
    options: [
      "variant est plus rapide",
      "variant est type-safe, sait quel type est actif, et appelle les destructeurs correctement",
      "union supporte plus de types",
      "Il n'y a pas de différence",
    ],
    correct: 1,
    explanation: "std::variant est une union discriminée type-safe. Contrairement à union, variant sait quel type est actuellement stocké, vérifie les accès à la compilation, et appelle les destructeurs/constructeurs correctement. std::visit permet un pattern matching exhaustif sur les types.",
  },
  {
    id: "cpp_96",
    type: "code",
    category: "STL avancé",
    title: "std::variant et std::visit",
    description: "Union sûre avec pattern matching.",
    instruction: "Créez un <code>std::variant&lt;int, double, std::string&gt;</code>. Écrivez une fonction <code>describe</code> qui utilise <code>std::visit</code> avec un lambda surchargé pour décrire le contenu selon le type. Testez avec les 3 types.",
    code_template: `#include <iostream>
#include <variant>
#include <string>

// std::variant + std::visit
`,
    solution: `#include <iostream>
#include <variant>
#include <string>

template<class... Ts> struct overloaded : Ts... { using Ts::operator()...; };
template<class... Ts> overloaded(Ts...) -> overloaded<Ts...>;

using Value = std::variant<int, double, std::string>;

std::string describe(const Value& v) {
    return std::visit(overloaded{
        [](int i) { return "Entier: " + std::to_string(i); },
        [](double d) { return "Décimal: " + std::to_string(d); },
        [](const std::string& s) { return "Texte: " + s; },
    }, v);
}

int main() {
    Value v1 = 42;
    Value v2 = 3.14;
    Value v3 = std::string("Aelita");
    
    std::cout << describe(v1) << std::endl;
    std::cout << describe(v2) << std::endl;
    std::cout << describe(v3) << std::endl;
    return 0;
}`,
    tests: [
      { expected: "std::variant", type: "contains" },
      { expected: "std::visit", type: "contains" },
      { expected: "overloaded", type: "contains" },
    ],
  },

  // === MULTITHREADING (97-101) ===
  {
    id: "cpp_97",
    type: "intro",
    category: "Multithreading",
    title: "Multithreading C++",
    description: "Programmation concurrente moderne.",
    content: `<h3>🔄 Multithreading C++</h3>
<pre><code>#include &lt;thread&gt;
#include &lt;mutex&gt;
#include &lt;future&gt;

// Thread simple
std::thread t([]() { std::cout &lt;&lt; "Hello thread!" &lt;&lt; std::endl; });
t.join();

// Mutex pour protéger les données partagées
std::mutex mtx;
void safe_print(const std::string& msg) {
    std::lock_guard&lt;std::mutex&gt; lock(mtx);
    std::cout &lt;&lt; msg &lt;&lt; std::endl;
}

// std::async — future/promise
auto future = std::async(std::launch::async, []() {
    return 42;  // Calcul dans un autre thread
});
int result = future.get(); // Attend le résultat

// Atomic — opérations thread-safe sans mutex
std::atomic&lt;int&gt; counter{0};
counter.fetch_add(1); // Thread-safe</code></pre>`,
  },
  {
    id: "cpp_98",
    type: "code",
    category: "Multithreading",
    title: "Threads et mutex",
    description: "Protégez les données partagées.",
    instruction: "Créez un compteur partagé entre 4 threads. Chaque thread incrémente le compteur 10000 fois. Utilisez un <code>std::mutex</code> avec <code>std::lock_guard</code> pour protéger l'accès. Vérifiez que le résultat final est 40000.",
    code_template: `#include <iostream>
#include <thread>
#include <mutex>
#include <vector>

// Compteur thread-safe avec mutex
`,
    solution: `#include <iostream>
#include <thread>
#include <mutex>
#include <vector>

int counter = 0;
std::mutex mtx;

void increment(int times) {
    for (int i = 0; i < times; i++) {
        std::lock_guard<std::mutex> lock(mtx);
        counter++;
    }
}

int main() {
    std::vector<std::thread> threads;
    for (int i = 0; i < 4; i++) {
        threads.emplace_back(increment, 10000);
    }
    for (auto& t : threads) t.join();
    
    std::cout << "Counter: " << counter << std::endl; // 40000
    return 0;
}`,
    tests: [
      { expected: "std::mutex", type: "contains" },
      { expected: "std::lock_guard", type: "contains" },
      { expected: "std::thread", type: "contains" },
      { expected: "t.join()", type: "contains" },
    ],
  },
  {
    id: "cpp_99",
    type: "code",
    category: "Multithreading",
    title: "std::async et futures",
    description: "Exécutez des calculs en parallèle.",
    instruction: "Utilisez <code>std::async</code> pour lancer 3 calculs en parallèle (somme de 1 à N pour N=1M, 2M, 3M). Récupérez les résultats avec <code>.get()</code>. Mesurez le temps total avec <code>chrono</code>.",
    code_template: `#include <iostream>
#include <future>
#include <chrono>

// Calculs parallèles avec async
`,
    solution: `#include <iostream>
#include <future>
#include <chrono>

long long sumTo(long long n) {
    long long sum = 0;
    for (long long i = 1; i <= n; i++) sum += i;
    return sum;
}

int main() {
    auto start = std::chrono::high_resolution_clock::now();
    
    auto f1 = std::async(std::launch::async, sumTo, 1000000);
    auto f2 = std::async(std::launch::async, sumTo, 2000000);
    auto f3 = std::async(std::launch::async, sumTo, 3000000);
    
    std::cout << "Sum 1M: " << f1.get() << std::endl;
    std::cout << "Sum 2M: " << f2.get() << std::endl;
    std::cout << "Sum 3M: " << f3.get() << std::endl;
    
    auto end = std::chrono::high_resolution_clock::now();
    auto ms = std::chrono::duration_cast<std::chrono::milliseconds>(end - start).count();
    std::cout << "Temps: " << ms << "ms" << std::endl;
    
    return 0;
}`,
    tests: [
      { expected: "std::async", type: "contains" },
      { expected: ".get()", type: "contains" },
      { expected: "std::launch::async", type: "contains" },
      { expected: "chrono", type: "contains" },
    ],
  },
  {
    id: "cpp_100",
    type: "quiz",
    category: "Multithreading",
    title: "Race condition",
    description: "Qu'est-ce qu'une race condition ?",
    options: [
      "Un programme qui s'exécute trop vite",
      "Quand plusieurs threads accèdent à des données partagées sans synchronisation, causant des résultats imprévisibles",
      "Un deadlock entre deux threads",
      "Un thread qui ne termine jamais",
    ],
    correct: 1,
    explanation: "Une race condition survient quand le résultat dépend de l'ordre d'exécution des threads, qui est non-déterministe. Par exemple, deux threads qui lisent-modifient-écrivent la même variable peuvent perdre des mises à jour. La solution : mutex, atomic, ou structures lock-free.",
  },
  {
    id: "cpp_101",
    type: "code",
    category: "Multithreading",
    title: "std::atomic",
    description: "Opérations atomiques sans mutex.",
    instruction: "Refaites l'exercice du compteur partagé entre 4 threads, mais cette fois avec <code>std::atomic&lt;int&gt;</code> au lieu d'un mutex. Comparez la simplicité du code. Vérifiez que le résultat est toujours correct.",
    code_template: `#include <iostream>
#include <thread>
#include <atomic>
#include <vector>

// Compteur atomique
`,
    solution: `#include <iostream>
#include <thread>
#include <atomic>
#include <vector>

std::atomic<int> counter{0};

void increment(int times) {
    for (int i = 0; i < times; i++) {
        counter.fetch_add(1, std::memory_order_relaxed);
    }
}

int main() {
    std::vector<std::thread> threads;
    for (int i = 0; i < 4; i++) {
        threads.emplace_back(increment, 10000);
    }
    for (auto& t : threads) t.join();
    
    std::cout << "Counter: " << counter.load() << std::endl; // 40000
    return 0;
}`,
    tests: [
      { expected: "std::atomic<int>", type: "contains" },
      { expected: "fetch_add", type: "contains" },
      { expected: "counter.load()", type: "contains" },
    ],
  },

  // === MOVE SEMANTICS (102-104) ===
  {
    id: "cpp_102",
    type: "intro",
    category: "Move Semantics",
    title: "Move Semantics",
    description: "Transférez les ressources au lieu de les copier.",
    content: `<h3>🚀 Move Semantics</h3>
<pre><code>class Buffer {
    int* data;
    size_t size;
public:
    // Constructeur
    Buffer(size_t s) : size(s), data(new int[s]) {}
    
    // Copy constructor (coûteux)
    Buffer(const Buffer& other) : size(other.size), data(new int[other.size]) {
        std::copy(other.data, other.data + size, data);
    }
    
    // Move constructor (rapide !)
    Buffer(Buffer&& other) noexcept : data(other.data), size(other.size) {
        other.data = nullptr;
        other.size = 0;
    }
    
    // Move assignment
    Buffer& operator=(Buffer&& other) noexcept {
        if (this != &other) {
            delete[] data;
            data = other.data;
            size = other.size;
            other.data = nullptr;
            other.size = 0;
        }
        return *this;
    }
    
    ~Buffer() { delete[] data; }
};</code></pre>`,
  },
  {
    id: "cpp_103",
    type: "code",
    category: "Move Semantics",
    title: "Move constructor",
    description: "Implémentez le move pour une classe.",
    instruction: "Créez une classe <code>DynArray</code> avec un tableau dynamique. Implémentez le move constructor et move assignment. Ajoutez un compteur statique de copies et moves. Démontrez que le move est utilisé avec <code>std::move</code>.",
    code_template: `#include <iostream>
#include <utility>

// DynArray avec move semantics
`,
    solution: `#include <iostream>
#include <utility>

class DynArray {
    int* data;
    size_t sz;
public:
    static int copies, moves;
    
    DynArray(size_t n) : sz(n), data(new int[n]{}) {
        std::cout << "Construct " << sz << std::endl;
    }
    
    // Copy
    DynArray(const DynArray& o) : sz(o.sz), data(new int[o.sz]) {
        std::copy(o.data, o.data + sz, data);
        copies++;
        std::cout << "Copy " << sz << std::endl;
    }
    
    // Move
    DynArray(DynArray&& o) noexcept : data(o.data), sz(o.sz) {
        o.data = nullptr; o.sz = 0;
        moves++;
        std::cout << "Move " << sz << std::endl;
    }
    
    ~DynArray() { delete[] data; }
    size_t size() const { return sz; }
};

int DynArray::copies = 0;
int DynArray::moves = 0;

int main() {
    DynArray a(1000000);
    DynArray b = std::move(a); // Move, pas copy !
    std::cout << "Copies: " << DynArray::copies << ", Moves: " << DynArray::moves << std::endl;
    return 0;
}`,
    tests: [
      { expected: "DynArray(DynArray&& o) noexcept", type: "contains" },
      { expected: "std::move", type: "contains" },
      { expected: "o.data = nullptr", type: "contains" },
    ],
  },
  {
    id: "cpp_104",
    type: "quiz",
    category: "Move Semantics",
    title: "Quand le move est-il utilisé ?",
    description: "Dans quels cas le compilateur utilise-t-il le move ?",
    options: [
      "Toujours automatiquement",
      "Quand on utilise std::move, quand on retourne une variable locale, et pour les temporaires (rvalues)",
      "Uniquement avec std::move explicite",
      "Le move n'est jamais automatique",
    ],
    correct: 1,
    explanation: "Le move est utilisé : 1) avec std::move() explicite, 2) pour les temporaires (rvalues, ex: f() retourne un objet), 3) quand on retourne une variable locale (NRVO/RVO peut même éliminer le move). Le compilateur ne move jamais automatiquement une lvalue nommée — il faut std::move.",
  },

  // === LAMBDA ET FONCTIONNEL (105-108) ===
  {
    id: "cpp_105",
    type: "intro",
    category: "Lambdas avancés",
    title: "Lambdas et programmation fonctionnelle",
    description: "Utilisez les lambdas C++ modernes.",
    content: `<h3>λ Lambdas C++</h3>
<pre><code>// Lambda basique
auto add = [](int a, int b) { return a + b; };

// Capture par référence
int total = 0;
auto acc = [&total](int x) { total += x; };

// Generic lambda (C++14)
auto print = [](auto x) { std::cout &lt;&lt; x &lt;&lt; std::endl; };

// Lambda avec init capture (C++14)
auto timer = [start = std::chrono::steady_clock::now()]() {
    auto now = std::chrono::steady_clock::now();
    return std::chrono::duration_cast&lt;std::chrono::milliseconds&gt;(now - start).count();
};

// Immediately invoked lambda
int result = [](int x) { return x * x; }(5); // 25

// Lambda récursive avec std::function
std::function&lt;int(int)&gt; fib = [&fib](int n) -&gt; int {
    return n &lt;= 1 ? n : fib(n-1) + fib(n-2);
};</code></pre>`,
  },
  {
    id: "cpp_106",
    type: "code",
    category: "Lambdas avancés",
    title: "Pipeline fonctionnel",
    description: "Créez un pipeline de transformations.",
    instruction: "Créez une fonction <code>pipeline</code> qui prend un vecteur d'int et applique une chaîne de lambdas : filtrer les positifs, les multiplier par 2, garder ceux < 100, et les trier. Retournez le résultat.",
    code_template: `#include <iostream>
#include <vector>
#include <algorithm>

// Pipeline fonctionnel avec lambdas
`,
    solution: `#include <iostream>
#include <vector>
#include <algorithm>

std::vector<int> pipeline(std::vector<int> data) {
    // Filtrer positifs
    auto end = std::remove_if(data.begin(), data.end(),
        [](int x) { return x <= 0; });
    data.erase(end, data.end());
    
    // Multiplier par 2
    std::transform(data.begin(), data.end(), data.begin(),
        [](int x) { return x * 2; });
    
    // Garder < 100
    end = std::remove_if(data.begin(), data.end(),
        [](int x) { return x >= 100; });
    data.erase(end, data.end());
    
    // Trier
    std::sort(data.begin(), data.end());
    
    return data;
}

int main() {
    auto result = pipeline({-5, 30, 10, 60, -2, 45, 5, 80});
    for (int x : result) std::cout << x << " ";
    std::cout << std::endl;
    return 0;
}`,
    tests: [
      { expected: "std::transform", type: "contains" },
      { expected: "std::remove_if", type: "contains" },
      { expected: "std::sort", type: "contains" },
      { expected: "pipeline", type: "contains" },
    ],
  },
  {
    id: "cpp_107",
    type: "code",
    category: "Lambdas avancés",
    title: "Callback et std::function",
    description: "Passez des fonctions en paramètre.",
    instruction: "Créez une classe <code>EventEmitter</code> qui permet de s'abonner à des événements nommés avec des callbacks <code>std::function&lt;void(const std::string&amp;)&gt;</code>. Implémentez <code>on(event, callback)</code> et <code>emit(event, data)</code>.",
    code_template: `#include <iostream>
#include <functional>
#include <map>
#include <vector>
#include <string>

// EventEmitter avec std::function
`,
    solution: `#include <iostream>
#include <functional>
#include <map>
#include <vector>
#include <string>

class EventEmitter {
    using Callback = std::function<void(const std::string&)>;
    std::map<std::string, std::vector<Callback>> listeners;
public:
    void on(const std::string& event, Callback cb) {
        listeners[event].push_back(std::move(cb));
    }
    
    void emit(const std::string& event, const std::string& data = "") {
        if (listeners.count(event)) {
            for (const auto& cb : listeners[event]) {
                cb(data);
            }
        }
    }
};

int main() {
    EventEmitter emitter;
    emitter.on("login", [](const std::string& user) {
        std::cout << "Bienvenue " << user << std::endl;
    });
    emitter.on("login", [](const std::string& user) {
        std::cout << "Log: " << user << " connecté" << std::endl;
    });
    emitter.emit("login", "Aelita");
    return 0;
}`,
    tests: [
      { expected: "class EventEmitter", type: "contains" },
      { expected: "std::function", type: "contains" },
      { expected: "void on(", type: "contains" },
      { expected: "void emit(", type: "contains" },
    ],
  },
  {
    id: "cpp_108",
    type: "quiz",
    category: "Lambdas avancés",
    title: "Capture modes",
    description: "Que fait [=] vs [&] dans un lambda ?",
    options: [
      "[=] capture tout par référence, [&] par valeur",
      "[=] capture tout par valeur (copie), [&] capture tout par référence",
      "Ils font la même chose",
      "[=] n'existe pas en C++",
    ],
    correct: 1,
    explanation: "[=] capture toutes les variables utilisées par copie (valeur). [&] capture tout par référence. On peut mélanger : [=, &x] capture tout par copie sauf x par référence. Attention : capturer par référence une variable locale peut causer un dangling reference si le lambda survit au scope.",
  },

  // === FICHIERS ET I/O (109-111) ===
  {
    id: "cpp_109",
    type: "code",
    category: "Fichiers C++",
    title: "Sérialisation binaire",
    description: "Écrivez et lisez des données binaires.",
    instruction: "Créez un struct <code>Player</code> (char name[32], int level, float xp). Écrivez un tableau de Players en binaire avec <code>ofstream::write</code>. Relisez-les avec <code>ifstream::read</code>. Affichez les données.",
    code_template: `#include <iostream>
#include <fstream>
#include <cstring>

// Sérialisation binaire Player
`,
    solution: `#include <iostream>
#include <fstream>
#include <cstring>

struct Player {
    char name[32];
    int level;
    float xp;
};

int main() {
    // Écriture
    Player players[] = {
        {"Aelita", 10, 5000.0f},
        {"Yumi", 8, 3200.0f},
        {"Odd", 7, 2800.0f},
    };
    
    std::ofstream out("players.dat", std::ios::binary);
    int count = 3;
    out.write(reinterpret_cast<char*>(&count), sizeof(count));
    out.write(reinterpret_cast<char*>(players), sizeof(players));
    out.close();
    
    // Lecture
    std::ifstream in("players.dat", std::ios::binary);
    int n;
    in.read(reinterpret_cast<char*>(&n), sizeof(n));
    Player loaded[3];
    in.read(reinterpret_cast<char*>(loaded), sizeof(Player) * n);
    in.close();
    
    for (int i = 0; i < n; i++) {
        std::cout << loaded[i].name << " Lv" << loaded[i].level
                  << " XP:" << loaded[i].xp << std::endl;
    }
    return 0;
}`,
    tests: [
      { expected: "std::ios::binary", type: "contains" },
      { expected: "reinterpret_cast", type: "contains" },
      { expected: "write(", type: "contains" },
      { expected: "read(", type: "contains" },
    ],
  },
  {
    id: "cpp_110",
    type: "code",
    category: "Fichiers C++",
    title: "String streams",
    description: "Formatez des chaînes avec stringstream.",
    instruction: "Utilisez <code>std::ostringstream</code> pour construire un rapport formaté de scores (nom, score, pourcentage). Utilisez <code>std::istringstream</code> pour parser une chaîne CSV \"nom,score\" en struct. Affichez les résultats.",
    code_template: `#include <iostream>
#include <sstream>
#include <string>
#include <iomanip>
#include <vector>

// String streams : format et parsing
`,
    solution: `#include <iostream>
#include <sstream>
#include <string>
#include <iomanip>
#include <vector>

struct Score {
    std::string nom;
    int score;
};

std::string buildReport(const std::vector<Score>& scores, int max) {
    std::ostringstream oss;
    oss << std::left << std::setw(15) << "Nom"
        << std::setw(8) << "Score"
        << "Pourcentage" << std::endl;
    oss << std::string(35, '-') << std::endl;
    for (const auto& s : scores) {
        double pct = 100.0 * s.score / max;
        oss << std::left << std::setw(15) << s.nom
            << std::setw(8) << s.score
            << std::fixed << std::setprecision(1) << pct << "%" << std::endl;
    }
    return oss.str();
}

Score parseCSV(const std::string& line) {
    std::istringstream iss(line);
    Score s;
    std::getline(iss, s.nom, ',');
    iss >> s.score;
    return s;
}

int main() {
    auto s1 = parseCSV("Aelita,95");
    auto s2 = parseCSV("Yumi,88");
    std::cout << buildReport({s1, s2}, 100);
    return 0;
}`,
    tests: [
      { expected: "ostringstream", type: "contains" },
      { expected: "istringstream", type: "contains" },
      { expected: "setw(", type: "contains" },
      { expected: "getline(", type: "contains" },
    ],
  },
  {
    id: "cpp_111",
    type: "quiz",
    category: "Fichiers C++",
    title: "RAII et fichiers",
    description: "Pourquoi ne pas utiliser fopen/fclose en C++ ?",
    options: [
      "fopen est plus lent",
      "fstream utilise RAII : le fichier est fermé automatiquement dans le destructeur, même en cas d'exception",
      "fopen ne fonctionne pas en C++",
      "Il n'y a pas de différence",
    ],
    correct: 1,
    explanation: "fstream suit le principe RAII : le destructeur ferme automatiquement le fichier. Avec fopen/fclose, un oubli de fclose ou une exception entre les deux cause une fuite de ressource. fstream est aussi type-safe et supporte les opérateurs << et >>.",
  },

  // === DESIGN PATTERNS (112-116) ===
  {
    id: "cpp_112",
    type: "intro",
    category: "Design Patterns",
    title: "Design Patterns en C++",
    description: "Patterns classiques adaptés au C++ moderne.",
    content: `<h3>🏛️ Design Patterns C++</h3>
<pre><code>// Singleton (thread-safe C++11)
class Config {
public:
    static Config& instance() {
        static Config inst;
        return inst;
    }
    Config(const Config&) = delete;
    void operator=(const Config&) = delete;
private:
    Config() = default;
};

// Observer
class Subject {
    std::vector&lt;std::function&lt;void()&gt;&gt; observers;
public:
    void subscribe(std::function&lt;void()&gt; fn) { observers.push_back(fn); }
    void notify() { for (auto& fn : observers) fn(); }
};

// Strategy
template&lt;typename Strategy&gt;
class Sorter {
    Strategy strategy;
public:
    void sort(std::vector&lt;int&gt;& data) { strategy(data); }
};</code></pre>`,
  },
  {
    id: "cpp_113",
    type: "code",
    category: "Design Patterns",
    title: "Singleton thread-safe",
    description: "Implémentez un Singleton moderne.",
    instruction: "Créez un Singleton <code>Logger</code> thread-safe avec la technique Meyers (static local). Supprimez le copy constructor et assignment. Ajoutez <code>log(level, message)</code> qui affiche avec timestamp.",
    code_template: `#include <iostream>
#include <string>
#include <chrono>
#include <ctime>

// Logger Singleton
`,
    solution: `#include <iostream>
#include <string>
#include <chrono>
#include <ctime>

class Logger {
public:
    static Logger& instance() {
        static Logger inst;
        return inst;
    }
    
    Logger(const Logger&) = delete;
    Logger& operator=(const Logger&) = delete;
    
    void log(const std::string& level, const std::string& msg) {
        auto now = std::chrono::system_clock::now();
        auto time = std::chrono::system_clock::to_time_t(now);
        std::cout << "[" << std::ctime(&time) << level << "] " << msg << std::endl;
    }
    
private:
    Logger() { std::cout << "Logger initialisé" << std::endl; }
};

int main() {
    Logger::instance().log("INFO", "Application démarrée");
    Logger::instance().log("WARN", "Mémoire faible");
    return 0;
}`,
    tests: [
      { expected: "static Logger& instance()", type: "contains" },
      { expected: "Logger(const Logger&) = delete", type: "contains" },
      { expected: "void log(", type: "contains" },
    ],
  },
  {
    id: "cpp_114",
    type: "code",
    category: "Design Patterns",
    title: "Observer pattern",
    description: "Implémentez le pattern Observer.",
    instruction: "Créez une classe <code>Signal&lt;Args...&gt;</code> template qui permet de connecter des callbacks et d'émettre des signaux. Implémentez <code>connect(callback)</code> et <code>emit(args...)</code>. Testez avec un signal <code>Signal&lt;std::string, int&gt;</code>.",
    code_template: `#include <iostream>
#include <functional>
#include <vector>
#include <string>

// Signal/Slot pattern (Observer)
`,
    solution: `#include <iostream>
#include <functional>
#include <vector>
#include <string>

template<typename... Args>
class Signal {
    using Slot = std::function<void(Args...)>;
    std::vector<Slot> slots;
public:
    void connect(Slot slot) {
        slots.push_back(std::move(slot));
    }
    
    void emit(Args... args) {
        for (auto& slot : slots) {
            slot(args...);
        }
    }
};

int main() {
    Signal<std::string, int> onScore;
    
    onScore.connect([](const std::string& name, int score) {
        std::cout << "UI: " << name << " = " << score << std::endl;
    });
    onScore.connect([](const std::string& name, int score) {
        std::cout << "Log: Nouveau score pour " << name << std::endl;
    });
    
    onScore.emit("Aelita", 95);
    return 0;
}`,
    tests: [
      { expected: "class Signal", type: "contains" },
      { expected: "void connect(Slot", type: "contains" },
      { expected: "void emit(Args... args)", type: "contains" },
    ],
  },
  {
    id: "cpp_115",
    type: "quiz",
    category: "Design Patterns",
    title: "CRTP",
    description: "Qu'est-ce que le Curiously Recurring Template Pattern ?",
    code_snippet: `template<typename Derived>
class Base {
public:
    void interface() {
        static_cast<Derived*>(this)->implementation();
    }
};
class Impl : public Base<Impl> {
public:
    void implementation() { /*...*/ }
};`,
    options: [
      "Un bug de compilation",
      "Un pattern où une classe hérite d'un template paramétré par elle-même, pour du polymorphisme statique (sans vtable)",
      "Un raccourci pour les constructeurs",
      "Un pattern déprécié en C++ moderne",
    ],
    correct: 1,
    explanation: "Le CRTP permet le polymorphisme statique : la résolution se fait à la compilation, pas à l'exécution. C'est plus rapide que le polymorphisme dynamique (virtual) car il n'y a pas de vtable/indirection. Utilisé dans les bibliothèques de performance (Eigen, etc.).",
  },
  {
    id: "cpp_116",
    type: "code",
    category: "Design Patterns",
    title: "Strategy avec templates",
    description: "Implémentez Strategy sans virtual.",
    instruction: "Créez un template <code>Processor&lt;Strategy&gt;</code> qui applique une stratégie de traitement sur un vecteur. Créez 3 stratégies : <code>DoubleStrategy</code>, <code>SquareStrategy</code>, <code>NegateStrategy</code>. Chacune a un <code>operator()(int)</code>. Testez les 3.",
    code_template: `#include <iostream>
#include <vector>

// Strategy pattern avec templates
`,
    solution: `#include <iostream>
#include <vector>

struct DoubleStrategy {
    int operator()(int x) const { return x * 2; }
};

struct SquareStrategy {
    int operator()(int x) const { return x * x; }
};

struct NegateStrategy {
    int operator()(int x) const { return -x; }
};

template<typename Strategy>
class Processor {
    Strategy strategy;
public:
    std::vector<int> process(const std::vector<int>& data) {
        std::vector<int> result;
        result.reserve(data.size());
        for (int x : data) result.push_back(strategy(x));
        return result;
    }
};

int main() {
    std::vector<int> data = {1, 2, 3, 4, 5};
    
    auto doubled = Processor<DoubleStrategy>{}.process(data);
    auto squared = Processor<SquareStrategy>{}.process(data);
    
    for (int x : doubled) std::cout << x << " ";
    std::cout << std::endl;
    for (int x : squared) std::cout << x << " ";
    std::cout << std::endl;
    return 0;
}`,
    tests: [
      { expected: "template<typename Strategy>", type: "contains" },
      { expected: "DoubleStrategy", type: "contains" },
      { expected: "SquareStrategy", type: "contains" },
      { expected: "operator()(int", type: "contains" },
    ],
  },

  // === PROJET FINAL (117-120) ===
  {
    id: "cpp_117",
    type: "code",
    category: "Projet final",
    title: "Conteneur générique",
    description: "Créez votre propre conteneur STL-like.",
    instruction: "Créez une classe template <code>RingBuffer&lt;T, N&gt;</code> (buffer circulaire de taille fixe). Implémentez <code>push(T)</code>, <code>pop()</code>, <code>front()</code>, <code>size()</code>, <code>empty()</code>, <code>full()</code>. Quand plein, push écrase le plus ancien.",
    code_template: `#include <iostream>
#include <array>
#include <stdexcept>

// RingBuffer — buffer circulaire
`,
    solution: `#include <iostream>
#include <array>
#include <stdexcept>

template<typename T, size_t N>
class RingBuffer {
    std::array<T, N> data;
    size_t head = 0, tail = 0, count = 0;
public:
    void push(const T& val) {
        data[tail] = val;
        tail = (tail + 1) % N;
        if (count == N) head = (head + 1) % N;
        else count++;
    }
    
    T pop() {
        if (empty()) throw std::runtime_error("Buffer vide");
        T val = data[head];
        head = (head + 1) % N;
        count--;
        return val;
    }
    
    const T& front() const {
        if (empty()) throw std::runtime_error("Buffer vide");
        return data[head];
    }
    
    size_t size() const { return count; }
    bool empty() const { return count == 0; }
    bool full() const { return count == N; }
};

int main() {
    RingBuffer<int, 3> rb;
    rb.push(1); rb.push(2); rb.push(3);
    rb.push(4); // Écrase 1
    std::cout << rb.pop() << std::endl; // 2
    std::cout << rb.size() << std::endl; // 2
    return 0;
}`,
    tests: [
      { expected: "class RingBuffer", type: "contains" },
      { expected: "void push", type: "contains" },
      { expected: "T pop()", type: "contains" },
      { expected: "% N", type: "contains" },
    ],
  },
  {
    id: "cpp_118",
    type: "code",
    category: "Projet final",
    title: "Thread pool",
    description: "Créez un pool de threads.",
    instruction: "Créez une classe <code>ThreadPool</code> qui maintient un vecteur de threads workers. Implémentez <code>submit(task)</code> qui ajoute une tâche dans une queue thread-safe. Les workers prennent les tâches de la queue. Implémentez <code>shutdown()</code>.",
    code_template: `#include <iostream>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <queue>
#include <functional>
#include <vector>

// ThreadPool
`,
    solution: `#include <iostream>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <queue>
#include <functional>
#include <vector>

class ThreadPool {
    std::vector<std::thread> workers;
    std::queue<std::function<void()>> tasks;
    std::mutex mtx;
    std::condition_variable cv;
    bool stopped = false;
public:
    ThreadPool(size_t n) {
        for (size_t i = 0; i < n; i++) {
            workers.emplace_back([this]() {
                while (true) {
                    std::function<void()> task;
                    {
                        std::unique_lock<std::mutex> lock(mtx);
                        cv.wait(lock, [this] { return stopped || !tasks.empty(); });
                        if (stopped && tasks.empty()) return;
                        task = std::move(tasks.front());
                        tasks.pop();
                    }
                    task();
                }
            });
        }
    }
    
    void submit(std::function<void()> task) {
        { std::lock_guard<std::mutex> lock(mtx); tasks.push(std::move(task)); }
        cv.notify_one();
    }
    
    void shutdown() {
        { std::lock_guard<std::mutex> lock(mtx); stopped = true; }
        cv.notify_all();
        for (auto& w : workers) w.join();
    }
    
    ~ThreadPool() { if (!stopped) shutdown(); }
};

int main() {
    ThreadPool pool(4);
    for (int i = 0; i < 8; i++) {
        pool.submit([i]() {
            std::cout << "Task " << i << " on thread " << std::this_thread::get_id() << std::endl;
        });
    }
    pool.shutdown();
    return 0;
}`,
    tests: [
      { expected: "class ThreadPool", type: "contains" },
      { expected: "void submit", type: "contains" },
      { expected: "condition_variable", type: "contains" },
      { expected: "void shutdown()", type: "contains" },
    ],
  },
  {
    id: "cpp_119",
    type: "quiz",
    category: "Projet final",
    title: "C++ moderne — Best practices",
    description: "Quel principe est fondamental en C++ moderne ?",
    options: [
      "Utiliser new/delete directement",
      "Préférer la pile au tas, les smart pointers au raw, et les algorithmes STL aux boucles manuelles",
      "Toujours utiliser malloc/free",
      "Éviter les templates pour la simplicité",
    ],
    correct: 1,
    explanation: "Le C++ moderne privilégie : stack over heap, RAII, smart pointers (jamais new/delete direct), move semantics, algorithmes STL, constexpr pour les calculs compiletime, et les concepts pour des templates propres. Le but : zéro fuite mémoire, code sûr et performant.",
  },
  {
    id: "cpp_120",
    type: "code",
    category: "Projet final",
    title: "Mini ECS",
    description: "Créez un Entity Component System.",
    instruction: "Créez un mini ECS : une classe <code>Entity</code> (juste un ID), un <code>ComponentStore&lt;T&gt;</code> template qui stocke des composants par entity ID, et un <code>World</code> qui gère les entités. Testez avec des composants Position{x,y} et Health{hp}.",
    code_template: `#include <iostream>
#include <unordered_map>
#include <vector>
#include <string>

// Mini Entity Component System
`,
    solution: `#include <iostream>
#include <unordered_map>
#include <vector>
#include <string>

using EntityId = uint32_t;

template<typename T>
class ComponentStore {
    std::unordered_map<EntityId, T> data;
public:
    void add(EntityId id, T component) { data[id] = std::move(component); }
    T* get(EntityId id) { auto it = data.find(id); return it != data.end() ? &it->second : nullptr; }
    void remove(EntityId id) { data.erase(id); }
    auto begin() { return data.begin(); }
    auto end() { return data.end(); }
};

struct Position { float x, y; };
struct Health { int hp; };

class World {
    EntityId nextId = 0;
public:
    ComponentStore<Position> positions;
    ComponentStore<Health> healths;
    
    EntityId createEntity() { return nextId++; }
};

int main() {
    World world;
    auto player = world.createEntity();
    world.positions.add(player, {10.0f, 20.0f});
    world.healths.add(player, {100});
    
    auto enemy = world.createEntity();
    world.positions.add(enemy, {50.0f, 30.0f});
    world.healths.add(enemy, {50});
    
    if (auto* pos = world.positions.get(player)) {
        std::cout << "Player: " << pos->x << ", " << pos->y << std::endl;
    }
    if (auto* hp = world.healths.get(player)) {
        std::cout << "HP: " << hp->hp << std::endl;
    }
    return 0;
}`,
    tests: [
      { expected: "ComponentStore", type: "contains" },
      { expected: "struct Position", type: "contains" },
      { expected: "class World", type: "contains" },
      { expected: "createEntity()", type: "contains" },
    ],
  },
];

addExercises("cpp", exercises);
