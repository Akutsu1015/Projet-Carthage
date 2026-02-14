import { addExercises } from ".";
import type { Exercise } from "@/app/exercises/[module]/exercise-client";

const exercises: Exercise[] = [
  // === TEMPLATES (1-4) ===
  {
    id: "cpp_61",
    type: "intro",
    category: "Templates",
    title: "Templates C++",
    description: "Les templates permettent de créer du code générique.",
    content: `<h3>🔧 Templates — Programmation générique</h3>
<pre><code>// Fonction template
template &lt;typename T&gt;
T maximum(T a, T b) {
    return (a > b) ? a : b;
}

maximum(3, 7);       // int → 7
maximum(3.14, 2.72); // double → 3.14

// Classe template
template &lt;typename T&gt;
class Stack {
    std::vector&lt;T&gt; data;
public:
    void push(T val) { data.push_back(val); }
    T pop() { T v = data.back(); data.pop_back(); return v; }
};

Stack&lt;int&gt; intStack;
Stack&lt;std::string&gt; strStack;</code></pre>`,
  },
  {
    id: "cpp_62",
    type: "code",
    category: "Templates",
    title: "Fonction template",
    description: "Créez une fonction générique.",
    instruction: "Créez une fonction template <code>minimum(T a, T b)</code> qui retourne le plus petit des deux. Testez avec des int et des double.",
    code_template: `#include <iostream>

// Fonction template minimum

int main() {
    std::cout << minimum(5, 3) << std::endl;
    std::cout << minimum(3.14, 2.72) << std::endl;
    return 0;
}`,
    solution: `#include <iostream>

template <typename T>
T minimum(T a, T b) {
    return (a < b) ? a : b;
}

int main() {
    std::cout << minimum(5, 3) << std::endl;
    std::cout << minimum(3.14, 2.72) << std::endl;
    return 0;
}`,
    tests: [
      { type: "contains", expected: "template <typename T>" },
      { type: "contains", expected: "T minimum(T a, T b)" },
      { type: "contains", expected: "(a < b) ? a : b" },
    ],
    hint: "template <typename T> avant la fonction, utilisez T comme type paramétré.",
  },
  {
    id: "cpp_63",
    type: "code",
    category: "Templates",
    title: "Classe template",
    description: "Créez une classe générique Pair.",
    instruction: "Créez une classe template <code>Pair&lt;T, U&gt;</code> avec deux membres <code>first</code> (T) et <code>second</code> (U), un constructeur, et une méthode <code>display()</code>.",
    code_template: `#include <iostream>
#include <string>

// Classe template Pair

int main() {
    Pair<std::string, int> p("Ulrich", 42);
    p.display();
    return 0;
}`,
    solution: `#include <iostream>
#include <string>

template <typename T, typename U>
class Pair {
public:
    T first;
    U second;

    Pair(T f, U s) : first(f), second(s) {}

    void display() {
        std::cout << first << ": " << second << std::endl;
    }
};

int main() {
    Pair<std::string, int> p("Ulrich", 42);
    p.display();
    return 0;
}`,
    tests: [
      { type: "contains", expected: "template <typename T, typename U>" },
      { type: "contains", expected: "class Pair" },
      { type: "contains", expected: "T first" },
      { type: "contains", expected: "U second" },
    ],
    hint: "template <typename T, typename U> pour deux types. Pair<string, int> à l'instanciation.",
  },
  {
    id: "cpp_64",
    type: "quiz",
    category: "Templates",
    title: "Templates vs void*",
    description: "Pourquoi préférer les templates aux void* du C ?",
    options: [
      "Les templates sont plus lents à l'exécution",
      "Les templates offrent la sécurité des types à la compilation, les void* non",
      "Les void* sont plus modernes que les templates",
      "Il n'y a aucune différence pratique",
    ],
    correct: 1,
    explanation: "Les templates génèrent du code typé à la compilation : toute erreur de type est détectée avant l'exécution. Les void* perdent l'information de type et nécessitent des casts manuels, source de bugs difficiles à trouver.",
  },
  // === STL CONTAINERS (5-12) ===
  {
    id: "cpp_65",
    type: "intro",
    category: "STL",
    title: "La STL — Standard Template Library",
    description: "La STL fournit des conteneurs et algorithmes prêts à l'emploi.",
    content: `<h3>📚 STL — Conteneurs essentiels</h3>
<pre><code>#include &lt;vector&gt;    // tableau dynamique
#include &lt;map&gt;       // dictionnaire clé/valeur
#include &lt;set&gt;       // ensemble unique
#include &lt;queue&gt;     // file d'attente
#include &lt;algorithm&gt; // sort, find, etc.

// vector — le plus utilisé
std::vector&lt;int&gt; v = {1, 2, 3};
v.push_back(4);
v.size(); // 4
v[0];     // 1

// map — clé/valeur
std::map&lt;std::string, int&gt; scores;
scores["Ulrich"] = 95;

// Boucle range-based (C++11)
for (auto &item : v) {
    std::cout &lt;&lt; item;
}</code></pre>`,
  },
  {
    id: "cpp_66",
    type: "code",
    category: "STL",
    title: "std::vector",
    description: "Utilisez le conteneur dynamique le plus courant.",
    instruction: "Créez un <code>std::vector&lt;int&gt;</code> avec les valeurs 10, 20, 30. Ajoutez 40 et 50 avec <code>push_back</code>. Affichez la taille et parcourez avec une boucle range-based <code>for (auto &v : vec)</code>.",
    code_template: `#include <iostream>
#include <vector>

int main() {
    // Créez, ajoutez, parcourez
    return 0;
}`,
    solution: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> vec = {10, 20, 30};
    vec.push_back(40);
    vec.push_back(50);

    std::cout << "Taille: " << vec.size() << std::endl;
    for (auto &v : vec) {
        std::cout << v << " ";
    }
    std::cout << std::endl;
    return 0;
}`,
    tests: [
      { type: "contains", expected: "std::vector<int>" },
      { type: "contains", expected: "push_back" },
      { type: "contains", expected: "vec.size()" },
      { type: "contains", expected: "for (auto &v : vec)" },
    ],
    hint: "vector<int> v = {1,2,3}; v.push_back(4); for (auto &x : v) { ... }",
  },
  {
    id: "cpp_67",
    type: "code",
    category: "STL",
    title: "std::map",
    description: "Utilisez un dictionnaire clé/valeur.",
    instruction: "Créez une <code>std::map&lt;std::string, int&gt;</code> avec les scores de 3 guerriers. Parcourez avec une boucle range-based et affichez <strong>nom: score</strong> pour chaque entrée.",
    code_template: `#include <iostream>
#include <map>
#include <string>

int main() {
    // Créez la map et parcourez
    return 0;
}`,
    solution: `#include <iostream>
#include <map>
#include <string>

int main() {
    std::map<std::string, int> scores;
    scores["Ulrich"] = 95;
    scores["Yumi"] = 88;
    scores["Odd"] = 72;

    for (auto &[name, score] : scores) {
        std::cout << name << ": " << score << std::endl;
    }
    return 0;
}`,
    tests: [
      { type: "contains", expected: "std::map<std::string, int>" },
      { type: "contains", expected: "scores[\"Ulrich\"]" },
      { type: "contains", expected: "for (auto &" },
    ],
    hint: "map[key] = value pour insérer. for (auto &[k, v] : map) pour itérer (C++17).",
  },
  {
    id: "cpp_68",
    type: "code",
    category: "STL",
    title: "Algorithmes STL",
    description: "Utilisez les algorithmes de <algorithm>.",
    instruction: "Créez un vector <code>{5, 2, 8, 1, 9, 3}</code>. Utilisez <code>std::sort</code> pour le trier, <code>std::find</code> pour chercher 8, et <code>std::count_if</code> pour compter les éléments > 4.",
    code_template: `#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> v = {5, 2, 8, 1, 9, 3};
    // sort, find, count_if
    return 0;
}`,
    solution: `#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> v = {5, 2, 8, 1, 9, 3};

    std::sort(v.begin(), v.end());
    for (auto &x : v) std::cout << x << " ";
    std::cout << std::endl;

    auto it = std::find(v.begin(), v.end(), 8);
    if (it != v.end()) std::cout << "Trouvé: " << *it << std::endl;

    int count = std::count_if(v.begin(), v.end(), [](int x) { return x > 4; });
    std::cout << "Éléments > 4: " << count << std::endl;
    return 0;
}`,
    tests: [
      { type: "contains", expected: "std::sort(v.begin(), v.end())" },
      { type: "contains", expected: "std::find(v.begin(), v.end(), 8)" },
      { type: "contains", expected: "std::count_if" },
      { type: "contains", expected: "[](int x)" },
    ],
    hint: "Les algorithmes STL prennent des itérateurs begin()/end(). count_if utilise un lambda.",
  },
  {
    id: "cpp_69",
    type: "quiz",
    category: "STL",
    title: "vector vs array vs list",
    description: "Quand utiliser std::vector ?",
    options: [
      "Uniquement pour les petits tableaux de taille fixe",
      "Quand on a besoin d'un tableau dynamique avec accès rapide par index",
      "Uniquement pour les chaînes de caractères",
      "Quand on fait beaucoup d'insertions au milieu",
    ],
    correct: 1,
    explanation: "std::vector est le conteneur par défaut en C++ : il offre un accès O(1) par index, une taille dynamique, et un stockage contigu en mémoire (bon pour le cache). Pour des insertions fréquentes au milieu, std::list est préférable.",
  },
  {
    id: "cpp_70",
    type: "code",
    category: "STL",
    title: "std::set et std::queue",
    description: "Utilisez d'autres conteneurs STL.",
    instruction: "Créez un <code>std::set&lt;int&gt;</code> et insérez les valeurs 5, 3, 8, 3, 1 (les doublons sont ignorés). Affichez les éléments (triés automatiquement). Puis créez une <code>std::queue&lt;std::string&gt;</code>, enfilez 3 noms, et défilez-les un par un.",
    code_template: `#include <iostream>
#include <set>
#include <queue>
#include <string>

int main() {
    // set + queue
    return 0;
}`,
    solution: `#include <iostream>
#include <set>
#include <queue>
#include <string>

int main() {
    std::set<int> s;
    s.insert(5); s.insert(3); s.insert(8); s.insert(3); s.insert(1);
    for (auto &x : s) std::cout << x << " ";
    std::cout << std::endl;

    std::queue<std::string> q;
    q.push("Ulrich"); q.push("Yumi"); q.push("Odd");
    while (!q.empty()) {
        std::cout << q.front() << std::endl;
        q.pop();
    }
    return 0;
}`,
    tests: [
      { type: "contains", expected: "std::set<int>" },
      { type: "contains", expected: "s.insert(" },
      { type: "contains", expected: "std::queue<std::string>" },
      { type: "contains", expected: "q.push(" },
      { type: "contains", expected: "q.front()" },
      { type: "contains", expected: "q.pop()" },
    ],
    hint: "set.insert() ajoute (unique + trié). queue: push() enfile, front() lit, pop() défile.",
  },
  {
    id: "cpp_71",
    type: "code",
    category: "STL",
    title: "Itérateurs",
    description: "Parcourez un conteneur avec des itérateurs.",
    instruction: "Créez un <code>std::vector&lt;std::string&gt;</code> avec des noms de secteurs. Parcourez avec un itérateur explicite (<code>std::vector&lt;std::string&gt;::iterator</code>) et affichez chaque élément.",
    code_template: `#include <iostream>
#include <vector>
#include <string>

int main() {
    std::vector<std::string> secteurs = {"Forêt", "Montagne", "Désert", "Glace", "Carthage"};
    // Parcourez avec un itérateur
    return 0;
}`,
    solution: `#include <iostream>
#include <vector>
#include <string>

int main() {
    std::vector<std::string> secteurs = {"Forêt", "Montagne", "Désert", "Glace", "Carthage"};

    for (std::vector<std::string>::iterator it = secteurs.begin(); it != secteurs.end(); ++it) {
        std::cout << *it << std::endl;
    }
    return 0;
}`,
    tests: [
      { type: "contains", expected: "::iterator it" },
      { type: "contains", expected: "secteurs.begin()" },
      { type: "contains", expected: "secteurs.end()" },
      { type: "contains", expected: "*it" },
    ],
    hint: "iterator it = v.begin(); it != v.end(); ++it — *it déréférence l'itérateur.",
  },
  {
    id: "cpp_72",
    type: "code",
    category: "STL",
    title: "unordered_map pour le cache",
    description: "Utilisez une hash map pour un cache performant.",
    instruction: "Créez un <code>std::unordered_map&lt;int, std::string&gt;</code> comme cache d'exercices. Ajoutez 3 entrées (id → titre). Vérifiez si un id existe avec <code>count()</code> ou <code>find()</code> avant d'y accéder.",
    code_template: `#include <iostream>
#include <unordered_map>
#include <string>

int main() {
    // Cache d'exercices avec unordered_map
    return 0;
}`,
    solution: `#include <iostream>
#include <unordered_map>
#include <string>

int main() {
    std::unordered_map<int, std::string> cache;
    cache[1] = "Hello World";
    cache[2] = "Variables";
    cache[3] = "Boucles";

    int searchId = 2;
    if (cache.count(searchId)) {
        std::cout << "Trouvé: " << cache[searchId] << std::endl;
    } else {
        std::cout << "Non trouvé" << std::endl;
    }
    return 0;
}`,
    tests: [
      { type: "contains", expected: "std::unordered_map<int, std::string>" },
      { type: "contains", expected: "cache.count(" },
      { type: "contains", expected: "cache[" },
    ],
    hint: "unordered_map est une hash map O(1). count(key) retourne 0 ou 1.",
  },
  // === C++ MODERNE (13-17) ===
  {
    id: "cpp_73",
    type: "intro",
    category: "C++ Moderne",
    title: "C++ Moderne (C++11/14/17/20)",
    description: "Le C++ moderne apporte des fonctionnalités qui simplifient le code.",
    content: `<h3>✨ C++ Moderne — Fonctionnalités clés</h3>
<pre><code>// auto — déduction de type
auto x = 42;         // int
auto name = "hello"s; // std::string

// Lambda
auto square = [](int x) { return x * x; };

// Smart pointers (plus de new/delete manuels !)
auto ptr = std::make_unique&lt;int&gt;(42);
auto shared = std::make_shared&lt;Player&gt;("Aelita");

// Structured bindings (C++17)
auto [name, score] = std::make_pair("Ulrich", 95);

// std::optional (C++17)
std::optional&lt;int&gt; findUser(int id) {
    if (found) return user;
    return std::nullopt;
}</code></pre>`,
  },
  {
    id: "cpp_74",
    type: "code",
    category: "C++ Moderne",
    title: "Lambdas",
    description: "Créez et utilisez des fonctions lambda.",
    instruction: "Créez un vector d'entiers. Utilisez <code>std::sort</code> avec un lambda pour trier en ordre <strong>décroissant</strong>. Puis utilisez <code>std::for_each</code> avec un lambda pour afficher chaque élément.",
    code_template: `#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> v = {3, 1, 4, 1, 5, 9, 2, 6};
    // Tri décroissant + affichage avec lambdas
    return 0;
}`,
    solution: `#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> v = {3, 1, 4, 1, 5, 9, 2, 6};

    std::sort(v.begin(), v.end(), [](int a, int b) { return a > b; });

    std::for_each(v.begin(), v.end(), [](int x) {
        std::cout << x << " ";
    });
    std::cout << std::endl;
    return 0;
}`,
    tests: [
      { type: "contains", expected: "[](int a, int b) { return a > b; }" },
      { type: "contains", expected: "std::for_each" },
      { type: "contains", expected: "[](int x)" },
    ],
    hint: "Lambda : [captures](params) { body }. a > b pour le tri décroissant.",
  },
  {
    id: "cpp_75",
    type: "code",
    category: "C++ Moderne",
    title: "Smart pointers",
    description: "Utilisez unique_ptr au lieu de new/delete.",
    instruction: "Créez une classe <code>Warrior</code> simple. Utilisez <code>std::make_unique</code> pour créer un guerrier, et <code>std::make_shared</code> pour un guerrier partagé. Montrez que la mémoire est libérée automatiquement.",
    code_template: `#include <iostream>
#include <memory>
#include <string>

class Warrior {
public:
    std::string name;
    Warrior(std::string n) : name(n) {
        std::cout << name << " créé" << std::endl;
    }
    ~Warrior() {
        std::cout << name << " détruit" << std::endl;
    }
};

int main() {
    // unique_ptr et shared_ptr
    return 0;
}`,
    solution: `#include <iostream>
#include <memory>
#include <string>

class Warrior {
public:
    std::string name;
    Warrior(std::string n) : name(n) {
        std::cout << name << " créé" << std::endl;
    }
    ~Warrior() {
        std::cout << name << " détruit" << std::endl;
    }
};

int main() {
    {
        auto unique = std::make_unique<Warrior>("Ulrich");
        std::cout << "Unique: " << unique->name << std::endl;
    } // automatiquement détruit ici

    auto shared1 = std::make_shared<Warrior>("Yumi");
    auto shared2 = shared1; // 2 références
    std::cout << "Refs: " << shared1.use_count() << std::endl;
    return 0;
}`,
    tests: [
      { type: "contains", expected: "std::make_unique<Warrior>" },
      { type: "contains", expected: "std::make_shared<Warrior>" },
      { type: "contains", expected: "unique->name" },
      { type: "contains", expected: "use_count()" },
    ],
    hint: "make_unique = propriétaire unique (pas de copie). make_shared = propriété partagée (compteur de refs).",
  },
  {
    id: "cpp_76",
    type: "quiz",
    category: "C++ Moderne",
    title: "unique_ptr vs shared_ptr",
    description: "Quand utiliser unique_ptr vs shared_ptr ?",
    options: [
      "Toujours shared_ptr, c'est plus flexible",
      "unique_ptr par défaut (propriété unique), shared_ptr quand plusieurs propriétaires sont nécessaires",
      "unique_ptr pour les int, shared_ptr pour les objets",
      "Il n'y a aucune différence de performance",
    ],
    correct: 1,
    explanation: "Règle : unique_ptr par défaut (zéro overhead, propriétaire unique). shared_ptr seulement quand la propriété partagée est vraiment nécessaire (compteur de références atomique = léger coût). weak_ptr pour les références non-propriétaires.",
  },
  {
    id: "cpp_77",
    type: "code",
    category: "C++ Moderne",
    title: "auto et structured bindings",
    description: "Utilisez les fonctionnalités C++17.",
    instruction: "Créez une fonction qui retourne un <code>std::pair&lt;std::string, int&gt;</code>. Utilisez <code>auto</code> et les <strong>structured bindings</strong> (<code>auto [name, score] = ...</code>) pour récupérer les valeurs.",
    code_template: `#include <iostream>
#include <string>
#include <utility>

// Fonction qui retourne un pair

int main() {
    // Structured binding
    return 0;
}`,
    solution: `#include <iostream>
#include <string>
#include <utility>

auto getTopPlayer() -> std::pair<std::string, int> {
    return {"Ulrich", 95};
}

int main() {
    auto [name, score] = getTopPlayer();
    std::cout << name << ": " << score << std::endl;
    return 0;
}`,
    tests: [
      { type: "contains", expected: "std::pair<std::string, int>" },
      { type: "contains", expected: "auto [name, score]" },
      { type: "contains", expected: "return {" },
    ],
    hint: "auto [a, b] = pair déstructure automatiquement. Trailing return type : auto fn() -> Type.",
  },
  // === EXCEPTIONS & PROJET (18-20) ===
  {
    id: "cpp_78",
    type: "code",
    category: "Exceptions",
    title: "Gestion d'erreurs avec exceptions",
    description: "Utilisez try/catch/throw pour gérer les erreurs.",
    instruction: "Créez une fonction <code>divide(double a, double b)</code> qui lance une <code>std::runtime_error</code> si b est 0. Appelez-la dans un try/catch et affichez le message d'erreur.",
    code_template: `#include <iostream>
#include <stdexcept>

double divide(double a, double b) {
    // Lancez une exception si b == 0
}

int main() {
    // try/catch
    return 0;
}`,
    solution: `#include <iostream>
#include <stdexcept>

double divide(double a, double b) {
    if (b == 0) throw std::runtime_error("Division par zéro !");
    return a / b;
}

int main() {
    try {
        std::cout << divide(10, 3) << std::endl;
        std::cout << divide(10, 0) << std::endl;
    } catch (const std::runtime_error &e) {
        std::cerr << "Erreur: " << e.what() << std::endl;
    }
    return 0;
}`,
    tests: [
      { type: "contains", expected: "throw std::runtime_error" },
      { type: "contains", expected: "try {" },
      { type: "contains", expected: "catch (const std::runtime_error &e)" },
      { type: "contains", expected: "e.what()" },
    ],
    hint: "throw exception pour lancer, try/catch pour attraper, e.what() pour le message.",
  },
  {
    id: "cpp_79",
    type: "code",
    category: "Projet",
    title: "Mini-projet : Inventaire RPG",
    description: "Combinez classes, STL et C++ moderne.",
    instruction: "Créez une classe <code>Item</code> (name, power) et une classe <code>Inventory</code> qui utilise un <code>std::vector&lt;Item&gt;</code>. Ajoutez <code>add</code>, <code>remove</code> et <code>display</code>. Utilisez <code>auto</code> et range-based for.",
    code_template: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

class Item {
    // name + power
};

class Inventory {
    // vector<Item> + add/remove/display
};`,
    solution: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

class Item {
public:
    std::string name;
    int power;
    Item(std::string n, int p) : name(n), power(p) {}
};

class Inventory {
    std::vector<Item> items;
public:
    void add(const Item &item) {
        items.push_back(item);
    }

    void remove(const std::string &name) {
        items.erase(
            std::remove_if(items.begin(), items.end(),
                [&name](const Item &i) { return i.name == name; }),
            items.end()
        );
    }

    void display() const {
        for (auto &item : items) {
            std::cout << item.name << " (+" << item.power << ")" << std::endl;
        }
    }
};`,
    tests: [
      { type: "contains", expected: "class Item" },
      { type: "contains", expected: "class Inventory" },
      { type: "contains", expected: "std::vector<Item>" },
      { type: "contains", expected: "push_back" },
      { type: "contains", expected: "std::remove_if" },
      { type: "contains", expected: "for (auto &item : items)" },
    ],
    hint: "vector.push_back pour ajouter, erase-remove idiom pour supprimer, range-for pour afficher.",
  },
  {
    id: "cpp_80",
    type: "quiz",
    category: "Projet",
    title: "Récapitulatif C/C++",
    description: "Testez vos connaissances globales.",
    options: [
      "Le C++ est incompatible avec le C — on ne peut pas mélanger les deux",
      "En C++ moderne, on n'a plus jamais besoin de new/delete grâce aux smart pointers",
      "Le C est plus rapide que le C++ dans tous les cas",
      "Les templates C++ sont évalués à l'exécution comme les génériques Java",
    ],
    correct: 1,
    explanation: "En C++ moderne, les smart pointers (unique_ptr, shared_ptr) remplacent new/delete dans la quasi-totalité des cas, éliminant les fuites mémoire et les use-after-free. Le C++ est largement compatible avec le C, et les templates sont résolus à la compilation (pas à l'exécution).",
  },
];

addExercises("cpp", exercises);
