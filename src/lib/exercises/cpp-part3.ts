import { addExercises } from ".";
import type { Exercise } from "@/app/exercises/[module]/exercise-client";

const exercises: Exercise[] = [
  // === FICHIERS & PRÉPROCESSEUR (1-5) ===
  {
    id: "cpp_41",
    type: "intro",
    category: "Fichiers",
    title: "Fichiers en C",
    description: "Le C permet de lire et écrire des fichiers avec FILE*.",
    content: `<h3>📂 Fichiers en C</h3>
<pre><code>#include &lt;stdio.h&gt;

// Écrire dans un fichier
FILE *f = fopen("data.txt", "w");
if (f != NULL) {
    fprintf(f, "Hello fichier !\\n");
    fclose(f);
}

// Lire un fichier
FILE *f = fopen("data.txt", "r");
char ligne[256];
while (fgets(ligne, sizeof(ligne), f)) {
    printf("%s", ligne);
}
fclose(f);</code></pre>
<p>Modes : <code>"r"</code> lecture, <code>"w"</code> écriture (écrase), <code>"a"</code> ajout, <code>"rb"/"wb"</code> binaire.</p>`,
  },
  {
    id: "cpp_42",
    type: "code",
    category: "Fichiers",
    title: "Écrire dans un fichier",
    description: "Écrivez des données dans un fichier texte.",
    instruction: "Ouvrez le fichier <code>scores.txt</code> en écriture. Écrivez 3 lignes avec <code>fprintf</code> : <strong>Ulrich:95</strong>, <strong>Yumi:88</strong>, <strong>Odd:72</strong>. Fermez le fichier.",
    code_template: `#include <stdio.h>

int main() {
    // Ouvrez, écrivez, fermez
    return 0;
}`,
    solution: `#include <stdio.h>

int main() {
    FILE *f = fopen("scores.txt", "w");
    if (f == NULL) {
        printf("Erreur d'ouverture\\n");
        return 1;
    }

    fprintf(f, "Ulrich:95\\n");
    fprintf(f, "Yumi:88\\n");
    fprintf(f, "Odd:72\\n");

    fclose(f);
    printf("Fichier écrit !\\n");
    return 0;
}`,
    tests: [
      { type: "contains", expected: "fopen(\"scores.txt\", \"w\")" },
      { type: "contains", expected: "fprintf(f," },
      { type: "contains", expected: "fclose(f)" },
      { type: "contains", expected: "f == NULL" },
    ],
    hint: "fopen(path, mode) ouvre, fprintf(file, format, ...) écrit, fclose(file) ferme.",
  },
  {
    id: "cpp_43",
    type: "code",
    category: "Fichiers",
    title: "Lire un fichier",
    description: "Lisez un fichier ligne par ligne.",
    instruction: "Ouvrez <code>scores.txt</code> en lecture. Lisez chaque ligne avec <code>fgets</code> et affichez-la. Gérez l'erreur si le fichier n'existe pas.",
    code_template: `#include <stdio.h>

int main() {
    // Ouvrez, lisez ligne par ligne, fermez
    return 0;
}`,
    solution: `#include <stdio.h>

int main() {
    FILE *f = fopen("scores.txt", "r");
    if (f == NULL) {
        printf("Fichier introuvable\\n");
        return 1;
    }

    char ligne[256];
    while (fgets(ligne, sizeof(ligne), f)) {
        printf("%s", ligne);
    }

    fclose(f);
    return 0;
}`,
    tests: [
      { type: "contains", expected: "fopen(\"scores.txt\", \"r\")" },
      { type: "contains", expected: "fgets(ligne, sizeof(ligne), f)" },
      { type: "contains", expected: "fclose(f)" },
    ],
    hint: "fgets(buffer, taille, file) lit une ligne. Bouclez tant que fgets retourne non-NULL.",
  },
  {
    id: "cpp_44",
    type: "quiz",
    category: "Préprocesseur",
    title: "Le préprocesseur C",
    description: "Que fait #define en C ?",
    options: [
      "Il déclare une variable globale",
      "Il crée une macro de substitution textuelle avant la compilation",
      "Il importe un module externe",
      "Il définit un type personnalisé",
    ],
    correct: 1,
    explanation: "#define crée une macro : le préprocesseur remplace chaque occurrence par le texte défini AVANT la compilation. #define MAX 100 remplace tous les MAX par 100. #define CARRE(x) ((x)*(x)) crée une macro-fonction.",
  },
  {
    id: "cpp_45",
    type: "code",
    category: "Préprocesseur",
    title: "Macros et guards",
    description: "Utilisez les directives du préprocesseur.",
    instruction: "Créez un header guard avec <code>#ifndef/#define/#endif</code> pour un fichier <code>warrior.h</code>. Définissez une macro <code>MAX_LEVEL 100</code> et une structure <code>Warrior</code>.",
    code_template: `// warrior.h — Avec header guard et macros
`,
    solution: `#ifndef WARRIOR_H
#define WARRIOR_H

#define MAX_LEVEL 100

typedef struct {
    char name[50];
    int level;
    int hp;
} Warrior;

#endif`,
    tests: [
      { type: "contains", expected: "#ifndef WARRIOR_H" },
      { type: "contains", expected: "#define WARRIOR_H" },
      { type: "contains", expected: "#define MAX_LEVEL 100" },
      { type: "contains", expected: "typedef struct" },
      { type: "contains", expected: "#endif" },
    ],
    hint: "#ifndef GUARD / #define GUARD / ... / #endif empêche les inclusions multiples.",
  },
  // === INTRODUCTION AU C++ (6-10) ===
  {
    id: "cpp_46",
    type: "intro",
    category: "C++ Bases",
    title: "Du C au C++",
    description: "Le C++ est une extension du C avec la programmation orientée objet.",
    content: `<h3>🚀 C++ — C avec des super-pouvoirs</h3>
<p>Le C++ ajoute au C :</p>
<ul>
<li><strong>Classes & objets</strong> — Programmation orientée objet</li>
<li><strong>Références</strong> — Alternative sûre aux pointeurs</li>
<li><strong>Surcharge</strong> — Fonctions et opérateurs</li>
<li><strong>Templates</strong> — Programmation générique</li>
<li><strong>STL</strong> — Bibliothèque standard (vector, map, string...)</li>
<li><strong>Exceptions</strong> — try/catch/throw</li>
</ul>
<pre><code>#include &lt;iostream&gt;
#include &lt;string&gt;

int main() {
    std::string name = "Aelita";
    std::cout &lt;&lt; "Bonjour " &lt;&lt; name &lt;&lt; " !" &lt;&lt; std::endl;
    return 0;
}</code></pre>
<p>Compilation : <code>g++ fichier.cpp -o programme</code></p>`,
  },
  {
    id: "cpp_47",
    type: "code",
    category: "C++ Bases",
    title: "Hello C++",
    description: "Écrivez votre premier programme C++.",
    instruction: "Écrivez un programme C++ avec <code>iostream</code> qui affiche <strong>Bienvenue dans le supercalculateur !</strong> en utilisant <code>std::cout</code>.",
    code_template: `// Premier programme C++
`,
    solution: `#include <iostream>

int main() {
    std::cout << "Bienvenue dans le supercalculateur !" << std::endl;
    return 0;
}`,
    tests: [
      { type: "contains", expected: "#include <iostream>" },
      { type: "contains", expected: "std::cout" },
      { type: "contains", expected: "<<" },
      { type: "contains", expected: "Bienvenue dans le supercalculateur" },
    ],
    hint: "#include <iostream> pour cout. std::cout << \"texte\" << std::endl;",
  },
  {
    id: "cpp_48",
    type: "code",
    category: "C++ Bases",
    title: "std::string",
    description: "Utilisez les strings C++ au lieu des char[].",
    instruction: "Créez deux <code>std::string</code> : <code>prenom = \"Jérémie\"</code> et <code>nom = \"Belpois\"</code>. Concaténez-les avec <code>+</code>, affichez le nom complet et sa longueur avec <code>.length()</code>.",
    code_template: `#include <iostream>
#include <string>

int main() {
    // Strings + concaténation + longueur
    return 0;
}`,
    solution: `#include <iostream>
#include <string>

int main() {
    std::string prenom = "Jérémie";
    std::string nom = "Belpois";
    std::string complet = prenom + " " + nom;

    std::cout << complet << std::endl;
    std::cout << "Longueur: " << complet.length() << std::endl;
    return 0;
}`,
    tests: [
      { type: "contains", expected: "std::string prenom" },
      { type: "contains", expected: "prenom + \" \" + nom" },
      { type: "contains", expected: ".length()" },
    ],
    hint: "std::string supporte + pour la concaténation et .length() pour la taille.",
  },
  {
    id: "cpp_49",
    type: "code",
    category: "C++ Bases",
    title: "Références C++",
    description: "Utilisez les références comme alternative aux pointeurs.",
    instruction: "Créez une fonction <code>void doubler(int &val)</code> qui double la valeur passée <strong>par référence</strong>. Testez avec une variable <code>x = 21</code> — après l'appel, x devrait valoir 42.",
    code_template: `#include <iostream>

// Fonction doubler par référence

int main() {
    int x = 21;
    // Appelez doubler
    std::cout << x << std::endl; // devrait afficher 42
    return 0;
}`,
    solution: `#include <iostream>

void doubler(int &val) {
    val *= 2;
}

int main() {
    int x = 21;
    doubler(x);
    std::cout << x << std::endl;
    return 0;
}`,
    tests: [
      { type: "contains", expected: "void doubler(int &val)" },
      { type: "contains", expected: "val *= 2" },
      { type: "contains", expected: "doubler(x)" },
    ],
    hint: "int &val est une référence — modifier val modifie directement la variable originale. Pas besoin de & à l'appel.",
  },
  {
    id: "cpp_50",
    type: "quiz",
    category: "C++ Bases",
    title: "Référence vs Pointeur",
    description: "Quelle est la différence entre une référence et un pointeur ?",
    options: [
      "Aucune différence, ce sont des synonymes",
      "Une référence est un alias qui doit être initialisé et ne peut pas être NULL, un pointeur peut être réassigné et être NULL",
      "Les références sont plus lentes que les pointeurs",
      "Les pointeurs ne fonctionnent qu'en C, pas en C++",
    ],
    correct: 1,
    explanation: "Une référence (&) est un alias permanent vers une variable : elle DOIT être initialisée, ne peut pas être NULL, et ne peut pas être réassignée. Un pointeur (*) peut être NULL, réassigné, et utilise &/* pour l'adresse/déréférencement.",
  },
  // === CLASSES (11-16) ===
  {
    id: "cpp_51",
    type: "intro",
    category: "Classes",
    title: "Classes en C++",
    description: "Les classes sont le fondement de la POO en C++.",
    content: `<h3>🏛️ Classes — Programmation Orientée Objet</h3>
<pre><code>class Warrior {
private:
    std::string name;
    int level;
    int hp;

public:
    // Constructeur
    Warrior(std::string n, int lvl)
        : name(n), level(lvl), hp(100) {}

    // Méthodes
    void attack() {
        std::cout &lt;&lt; name &lt;&lt; " attaque !" &lt;&lt; std::endl;
    }

    // Getter
    std::string getName() const { return name; }

    // Setter
    void setLevel(int lvl) { level = lvl; }
};

// Utilisation
Warrior w("Ulrich", 42);
w.attack();</code></pre>`,
  },
  {
    id: "cpp_52",
    type: "code",
    category: "Classes",
    title: "Première classe",
    description: "Créez votre première classe C++.",
    instruction: "Créez une classe <code>Scanner</code> avec un attribut privé <code>std::string sector</code>, un constructeur qui prend le secteur en paramètre, et une méthode <code>scan()</code> qui affiche <strong>Scan du secteur {sector}...</strong>.",
    code_template: `#include <iostream>
#include <string>

class Scanner {
    // Attributs et méthodes
};

int main() {
    Scanner s("Forêt");
    s.scan();
    return 0;
}`,
    solution: `#include <iostream>
#include <string>

class Scanner {
private:
    std::string sector;

public:
    Scanner(std::string s) : sector(s) {}

    void scan() {
        std::cout << "Scan du secteur " << sector << "..." << std::endl;
    }
};

int main() {
    Scanner s("Forêt");
    s.scan();
    return 0;
}`,
    tests: [
      { type: "contains", expected: "class Scanner" },
      { type: "contains", expected: "private:" },
      { type: "contains", expected: "public:" },
      { type: "contains", expected: "Scanner(std::string s)" },
      { type: "contains", expected: "void scan()" },
    ],
    hint: "class Nom { private: attributs; public: constructeur + méthodes; };",
  },
  {
    id: "cpp_53",
    type: "code",
    category: "Classes",
    title: "Getters et Setters",
    description: "Encapsulez les données avec des accesseurs.",
    instruction: "Créez une classe <code>Player</code> avec <code>name</code> (string) et <code>xp</code> (int, privé). Ajoutez un getter <code>getXp()</code> const, un setter <code>addXp(int amount)</code> qui refuse les valeurs négatives, et une méthode <code>display()</code>.",
    code_template: `#include <iostream>
#include <string>

class Player {
    // Implémentez
};`,
    solution: `#include <iostream>
#include <string>

class Player {
private:
    std::string name;
    int xp;

public:
    Player(std::string n) : name(n), xp(0) {}

    int getXp() const { return xp; }

    void addXp(int amount) {
        if (amount > 0) xp += amount;
    }

    void display() const {
        std::cout << name << " - XP: " << xp << std::endl;
    }
};`,
    tests: [
      { type: "contains", expected: "int getXp() const" },
      { type: "contains", expected: "void addXp(int amount)" },
      { type: "contains", expected: "if (amount > 0)" },
      { type: "contains", expected: "void display() const" },
    ],
    hint: "const après une méthode signifie qu'elle ne modifie pas l'objet. Validez les entrées dans les setters.",
  },
  {
    id: "cpp_54",
    type: "code",
    category: "Classes",
    title: "Surcharge d'opérateurs",
    description: "Surchargez l'opérateur + pour une classe.",
    instruction: "Créez une classe <code>Vec2</code> avec <code>float x, y</code>. Surchargez l'opérateur <code>+</code> pour additionner deux vecteurs et l'opérateur <code><<</code> pour l'affichage avec cout.",
    code_template: `#include <iostream>

class Vec2 {
public:
    float x, y;

    Vec2(float x, float y) : x(x), y(y) {}

    // Surcharge de +
    // Surcharge de <<
};`,
    solution: `#include <iostream>

class Vec2 {
public:
    float x, y;

    Vec2(float x, float y) : x(x), y(y) {}

    Vec2 operator+(const Vec2 &other) const {
        return Vec2(x + other.x, y + other.y);
    }

    friend std::ostream& operator<<(std::ostream &os, const Vec2 &v) {
        os << "(" << v.x << ", " << v.y << ")";
        return os;
    }
};`,
    tests: [
      { type: "contains", expected: "operator+(const Vec2 &other)" },
      { type: "contains", expected: "return Vec2(x + other.x, y + other.y)" },
      { type: "contains", expected: "friend std::ostream& operator<<" },
    ],
    hint: "operator+ retourne un nouveau Vec2. operator<< est un friend pour accéder aux membres.",
  },
  {
    id: "cpp_55",
    type: "quiz",
    category: "Classes",
    title: "Constructeur et destructeur",
    description: "Quand le destructeur est-il appelé ?",
    options: [
      "Quand on appelle delete manuellement uniquement",
      "Automatiquement quand l'objet sort de sa portée (scope)",
      "Jamais, le garbage collector s'en charge",
      "Uniquement au redémarrage du programme",
    ],
    correct: 1,
    explanation: "Le destructeur (~ClassName) est appelé automatiquement quand un objet sort de sa portée (fin de bloc {}, fin de fonction). Pour les objets alloués avec new, il est appelé lors du delete. Le C++ n'a PAS de garbage collector.",
  },
  {
    id: "cpp_56",
    type: "code",
    category: "Classes",
    title: "Destructeur et RAII",
    description: "Gérez les ressources avec un destructeur.",
    instruction: "Créez une classe <code>FileHandler</code> qui ouvre un fichier dans le constructeur et le ferme dans le destructeur. C'est le pattern <strong>RAII</strong> (Resource Acquisition Is Initialization).",
    code_template: `#include <iostream>
#include <cstdio>

class FileHandler {
private:
    FILE *file;
public:
    // Constructeur : ouvre le fichier
    // Destructeur : ferme le fichier
    // Méthode write
};`,
    solution: `#include <iostream>
#include <cstdio>

class FileHandler {
private:
    FILE *file;

public:
    FileHandler(const char *path, const char *mode) {
        file = fopen(path, mode);
        if (!file) std::cerr << "Erreur ouverture" << std::endl;
    }

    ~FileHandler() {
        if (file) {
            fclose(file);
            std::cout << "Fichier fermé" << std::endl;
        }
    }

    void write(const char *text) {
        if (file) fprintf(file, "%s", text);
    }
};`,
    tests: [
      { type: "contains", expected: "FileHandler(const char *path" },
      { type: "contains", expected: "~FileHandler()" },
      { type: "contains", expected: "fclose(file)" },
      { type: "contains", expected: "fopen(path, mode)" },
    ],
    hint: "RAII : acquérir dans le constructeur, libérer dans le destructeur. L'objet gère sa propre ressource.",
  },
  // === HÉRITAGE (17-20) ===
  {
    id: "cpp_57",
    type: "intro",
    category: "Héritage",
    title: "L'héritage en C++",
    description: "L'héritage permet de créer des classes spécialisées à partir de classes existantes.",
    content: `<h3>🧬 Héritage — Spécialisation</h3>
<pre><code>class Entity {
protected:
    std::string name;
    int hp;
public:
    Entity(std::string n, int h) : name(n), hp(h) {}
    virtual void display() {
        std::cout &lt;&lt; name &lt;&lt; " HP:" &lt;&lt; hp;
    }
    virtual ~Entity() = default;
};

class Warrior : public Entity {
    int attack;
public:
    Warrior(std::string n, int h, int a)
        : Entity(n, h), attack(a) {}

    void display() override {
        Entity::display();
        std::cout &lt;&lt; " ATK:" &lt;&lt; attack;
    }
};</code></pre>
<p><code>virtual</code> + <code>override</code> = polymorphisme. <code>protected</code> = accessible aux classes filles.</p>`,
  },
  {
    id: "cpp_58",
    type: "code",
    category: "Héritage",
    title: "Héritage simple",
    description: "Créez une hiérarchie de classes.",
    instruction: "Créez une classe de base <code>Shape</code> avec <code>name</code> et une méthode virtuelle <code>area()</code> retournant 0. Créez <code>Circle</code> (avec <code>radius</code>) et <code>Rectangle</code> (avec <code>width, height</code>) qui héritent et implémentent <code>area()</code>.",
    code_template: `#include <iostream>
#include <cmath>

class Shape {
    // Classe de base
};

class Circle : public Shape {
    // Hérite de Shape
};

class Rectangle : public Shape {
    // Hérite de Shape
};`,
    solution: `#include <iostream>
#include <cmath>

class Shape {
protected:
    std::string name;
public:
    Shape(std::string n) : name(n) {}
    virtual double area() const { return 0; }
    virtual ~Shape() = default;
};

class Circle : public Shape {
    double radius;
public:
    Circle(double r) : Shape("Cercle"), radius(r) {}
    double area() const override { return M_PI * radius * radius; }
};

class Rectangle : public Shape {
    double width, height;
public:
    Rectangle(double w, double h) : Shape("Rectangle"), width(w), height(h) {}
    double area() const override { return width * height; }
};`,
    tests: [
      { type: "contains", expected: "class Shape" },
      { type: "contains", expected: "virtual double area()" },
      { type: "contains", expected: "class Circle : public Shape" },
      { type: "contains", expected: "class Rectangle : public Shape" },
      { type: "contains", expected: "override" },
    ],
    hint: "virtual dans la base, override dans les dérivées. Appelez le constructeur parent avec : Shape(n).",
  },
  {
    id: "cpp_59",
    type: "code",
    category: "Héritage",
    title: "Polymorphisme",
    description: "Utilisez le polymorphisme avec des pointeurs de base.",
    instruction: "Créez un tableau de <code>Shape*</code> contenant un <code>Circle</code> et un <code>Rectangle</code>. Parcourez le tableau et appelez <code>area()</code> sur chaque élément — le polymorphisme choisit la bonne implémentation.",
    code_template: `int main() {
    // Tableau de Shape* avec Circle et Rectangle
    // Parcourez et affichez les aires
    // N'oubliez pas de delete !
    return 0;
}`,
    solution: `int main() {
    Shape* shapes[2];
    shapes[0] = new Circle(5.0);
    shapes[1] = new Rectangle(4.0, 6.0);

    for (int i = 0; i < 2; i++) {
        std::cout << "Aire: " << shapes[i]->area() << std::endl;
        delete shapes[i];
    }
    return 0;
}`,
    tests: [
      { type: "contains", expected: "Shape* shapes" },
      { type: "contains", expected: "new Circle" },
      { type: "contains", expected: "new Rectangle" },
      { type: "contains", expected: "shapes[i]->area()" },
      { type: "contains", expected: "delete shapes[i]" },
    ],
    hint: "new pour allouer, -> pour appeler via pointeur, delete pour libérer. Le virtual fait le reste.",
  },
  {
    id: "cpp_60",
    type: "quiz",
    category: "Héritage",
    title: "Classe abstraite",
    description: "Comment rendre une classe abstraite en C++ ?",
    options: [
      "En ajoutant le mot-clé abstract devant la classe",
      "En déclarant au moins une méthode virtuelle pure (= 0)",
      "En mettant tous les membres en private",
      "Les classes abstraites n'existent pas en C++",
    ],
    correct: 1,
    explanation: "Une classe avec au moins une méthode virtuelle pure (virtual void fn() = 0;) est abstraite : elle ne peut pas être instanciée. Les classes dérivées DOIVENT implémenter toutes les méthodes pures.",
  },
];

addExercises("cpp", exercises);
