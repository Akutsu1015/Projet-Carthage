import { addExercises } from "./registry";
import type { Exercise } from "./registry";

const exercises: Exercise[] = [
  // === TABLEAUX & STRINGS (1-5) ===
  {
    id: "cpp_21",
    type: "intro",
    category: "Tableaux",
    title: "Tableaux en C",
    description: "Les tableaux stockent plusieurs valeurs du même type de manière contiguë en mémoire.",
    content: `<h3>📊 Tableaux en C</h3>
<pre><code>// Déclaration et initialisation
int scores[5] = {90, 85, 72, 98, 66};
char nom[20] = "Aelita";

// Accès par index (commence à 0)
printf("%d\\n", scores[0]); // 90
scores[2] = 100; // modification

// Taille d'un tableau
int taille = sizeof(scores) / sizeof(scores[0]); // 5

// Parcours
for (int i = 0; i < 5; i++) {
    printf("%d ", scores[i]);
}</code></pre>
<p>⚠️ En C, les tableaux n'ont <strong>pas de vérification de bornes</strong>. Dépasser la taille = comportement indéfini !</p>`,
  },
  {
    id: "cpp_22",
    type: "code",
    category: "Tableaux",
    title: "Trouver le maximum",
    description: "Parcourez un tableau pour trouver la valeur maximale.",
    instruction: "Créez une fonction <code>int trouver_max(int arr[], int taille)</code> qui retourne la plus grande valeur du tableau. Testez avec <code>{42, 17, 99, 8, 53}</code>.",
    code_template: `#include <stdio.h>

int trouver_max(int arr[], int taille) {
    // Trouvez le maximum
}

int main() {
    int arr[] = {42, 17, 99, 8, 53};
    printf("Max: %d\\n", trouver_max(arr, 5));
    return 0;
}`,
    solution: `#include <stdio.h>

int trouver_max(int arr[], int taille) {
    int max = arr[0];
    for (int i = 1; i < taille; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}

int main() {
    int arr[] = {42, 17, 99, 8, 53};
    printf("Max: %d\\n", trouver_max(arr, 5));
    return 0;
}`,
    tests: [
      { type: "contains", expected: "int trouver_max" },
      { type: "contains", expected: "arr[0]" },
      { type: "contains", expected: "if (arr[i] > max)" },
      { type: "contains", expected: "return max" },
    ],
    hint: "Initialisez max avec arr[0], puis comparez chaque élément.",
  },
  {
    id: "cpp_23",
    type: "code",
    category: "Tableaux",
    title: "Inverser un tableau",
    description: "Inversez les éléments d'un tableau en place.",
    instruction: "Créez <code>void inverser(int arr[], int taille)</code> qui inverse le tableau en place en échangeant les éléments symétriques. Testez avec <code>{1, 2, 3, 4, 5}</code>.",
    code_template: `#include <stdio.h>

void inverser(int arr[], int taille) {
    // Inversez en place
}

int main() {
    int arr[] = {1, 2, 3, 4, 5};
    inverser(arr, 5);
    for (int i = 0; i < 5; i++) printf("%d ", arr[i]);
    return 0;
}`,
    solution: `#include <stdio.h>

void inverser(int arr[], int taille) {
    for (int i = 0; i < taille / 2; i++) {
        int temp = arr[i];
        arr[i] = arr[taille - 1 - i];
        arr[taille - 1 - i] = temp;
    }
}

int main() {
    int arr[] = {1, 2, 3, 4, 5};
    inverser(arr, 5);
    for (int i = 0; i < 5; i++) printf("%d ", arr[i]);
    return 0;
}`,
    tests: [
      { type: "contains", expected: "taille / 2" },
      { type: "contains", expected: "int temp = arr[i]" },
      { type: "contains", expected: "arr[taille - 1 - i]" },
    ],
    hint: "Échangez arr[i] et arr[taille-1-i] pour i de 0 à taille/2.",
  },
  {
    id: "cpp_24",
    type: "code",
    category: "Tableaux",
    title: "Manipulation de strings",
    description: "Travaillez avec les chaînes de caractères en C.",
    instruction: "Créez une fonction <code>int longueur(char str[])</code> qui retourne la longueur d'une chaîne (sans compter le '\\0' final). Implémentez-la <strong>sans utiliser strlen</strong>.",
    code_template: `#include <stdio.h>

int longueur(char str[]) {
    // Comptez les caractères jusqu'au \\0
}

int main() {
    printf("%d\\n", longueur("Lyoko")); // 5
    return 0;
}`,
    solution: `#include <stdio.h>

int longueur(char str[]) {
    int len = 0;
    while (str[len] != '\\0') {
        len++;
    }
    return len;
}

int main() {
    printf("%d\\n", longueur("Lyoko")); // 5
    return 0;
}`,
    tests: [
      { type: "contains", expected: "int longueur(char str[])" },
      { type: "contains", expected: "while (str[len] != '\\0')" },
      { type: "contains", expected: "len++" },
      { type: "contains", expected: "return len" },
    ],
    hint: "Parcourez char par char jusqu'à trouver '\\0' (le terminateur null).",
  },
  {
    id: "cpp_25",
    type: "quiz",
    category: "Tableaux",
    title: "Chaînes en C",
    description: "Comment sont stockées les chaînes de caractères en C ?",
    options: [
      "Comme un objet String avec des méthodes intégrées",
      "Comme un tableau de char terminé par un caractère null '\\0'",
      "Comme une liste chaînée de caractères",
      "Comme un type primitif natif du langage",
    ],
    correct: 1,
    explanation: "En C, une chaîne est simplement un tableau de char terminé par le caractère null '\\0'. \"Hello\" occupe 6 octets : 'H','e','l','l','o','\\0'. C'est pourquoi il faut toujours prévoir un caractère supplémentaire pour le terminateur.",
  },
  // === POINTEURS (6-12) ===
  {
    id: "cpp_26",
    type: "intro",
    category: "Pointeurs",
    title: "Les Pointeurs",
    description: "Les pointeurs sont le concept le plus puissant (et redouté) du C.",
    content: `<h3>🎯 Pointeurs — Adresses mémoire</h3>
<p>Un <strong>pointeur</strong> est une variable qui stocke l'<strong>adresse mémoire</strong> d'une autre variable.</p>
<pre><code>int x = 42;
int *ptr = &x;  // ptr pointe vers x

printf("%d\\n", x);     // 42 (valeur)
printf("%p\\n", &x);    // 0x7fff... (adresse)
printf("%p\\n", ptr);   // même adresse
printf("%d\\n", *ptr);  // 42 (déréférencement)

*ptr = 100;  // modifie x via le pointeur !
printf("%d\\n", x); // 100</code></pre>
<p>Opérateurs clés :</p>
<ul>
<li><code>&</code> — "adresse de" (donne l'adresse d'une variable)</li>
<li><code>*</code> — "déréférencement" (accède à la valeur pointée)</li>
</ul>`,
  },
  {
    id: "cpp_27",
    type: "code",
    category: "Pointeurs",
    title: "Premier pointeur",
    description: "Déclarez et utilisez un pointeur.",
    instruction: "Déclarez un <code>int x = 42</code> et un pointeur <code>int *ptr</code> qui pointe vers <code>x</code>. Affichez la valeur de <code>x</code>, l'adresse de <code>x</code>, et la valeur pointée par <code>ptr</code> (via déréférencement).",
    code_template: `#include <stdio.h>

int main() {
    // Déclarez x et ptr, affichez
    return 0;
}`,
    solution: `#include <stdio.h>

int main() {
    int x = 42;
    int *ptr = &x;

    printf("Valeur: %d\\n", x);
    printf("Adresse: %p\\n", (void*)&x);
    printf("Via pointeur: %d\\n", *ptr);
    return 0;
}`,
    tests: [
      { type: "contains", expected: "int *ptr = &x" },
      { type: "contains", expected: "*ptr" },
      { type: "contains", expected: "&x" },
    ],
    hint: "&x donne l'adresse, *ptr accède à la valeur pointée.",
  },
  {
    id: "cpp_28",
    type: "code",
    category: "Pointeurs",
    title: "Swap avec pointeurs",
    description: "Échangez deux variables via des pointeurs.",
    instruction: "Créez une fonction <code>void swap(int *a, int *b)</code> qui échange les valeurs de deux variables en utilisant les pointeurs. Testez avec <code>x = 10, y = 20</code>.",
    code_template: `#include <stdio.h>

void swap(int *a, int *b) {
    // Échangez les valeurs
}

int main() {
    int x = 10, y = 20;
    printf("Avant: x=%d, y=%d\\n", x, y);
    swap(&x, &y);
    printf("Après: x=%d, y=%d\\n", x, y);
    return 0;
}`,
    solution: `#include <stdio.h>

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int x = 10, y = 20;
    printf("Avant: x=%d, y=%d\\n", x, y);
    swap(&x, &y);
    printf("Après: x=%d, y=%d\\n", x, y);
    return 0;
}`,
    tests: [
      { type: "contains", expected: "void swap(int *a, int *b)" },
      { type: "contains", expected: "int temp = *a" },
      { type: "contains", expected: "*a = *b" },
      { type: "contains", expected: "*b = temp" },
      { type: "contains", expected: "swap(&x, &y)" },
    ],
    hint: "Déréférencez avec * pour accéder aux valeurs, passez les adresses avec & à l'appel.",
  },
  {
    id: "cpp_29",
    type: "quiz",
    category: "Pointeurs",
    title: "Pointeurs et tableaux",
    description: "Quelle est la relation entre pointeurs et tableaux en C ?",
    options: [
      "Ils n'ont aucun rapport",
      "Le nom d'un tableau est un pointeur vers son premier élément",
      "Un pointeur est un tableau de taille 1",
      "On ne peut pas utiliser de pointeurs avec des tableaux",
    ],
    correct: 1,
    explanation: "En C, le nom d'un tableau est converti en pointeur vers son premier élément. arr[i] est équivalent à *(arr + i). C'est pourquoi on peut passer un tableau à une fonction qui attend un pointeur.",
  },
  {
    id: "cpp_30",
    type: "code",
    category: "Pointeurs",
    title: "Arithmétique de pointeurs",
    description: "Parcourez un tableau avec l'arithmétique de pointeurs.",
    instruction: "Parcourez un tableau <code>int arr[] = {10, 20, 30, 40, 50}</code> en utilisant un <strong>pointeur</strong> au lieu d'un index. Utilisez <code>ptr++</code> pour avancer dans le tableau.",
    code_template: `#include <stdio.h>

int main() {
    int arr[] = {10, 20, 30, 40, 50};
    int *ptr = arr;
    // Parcourez avec le pointeur
    return 0;
}`,
    solution: `#include <stdio.h>

int main() {
    int arr[] = {10, 20, 30, 40, 50};
    int *ptr = arr;

    for (int i = 0; i < 5; i++) {
        printf("%d ", *ptr);
        ptr++;
    }
    printf("\\n");
    return 0;
}`,
    tests: [
      { type: "contains", expected: "int *ptr = arr" },
      { type: "contains", expected: "*ptr" },
      { type: "contains", expected: "ptr++" },
    ],
    hint: "*ptr donne la valeur courante, ptr++ avance au prochain élément du tableau.",
  },
  {
    id: "cpp_31",
    type: "code",
    category: "Pointeurs",
    title: "Pointeur NULL",
    description: "Gérez les pointeurs NULL en sécurité.",
    instruction: "Créez une fonction <code>void afficher_safe(int *ptr)</code> qui vérifie si le pointeur est <code>NULL</code> avant de déréférencer. Si NULL, affichez <strong>Pointeur NULL !</strong>, sinon affichez la valeur.",
    code_template: `#include <stdio.h>
#include <stdlib.h>

void afficher_safe(int *ptr) {
    // Vérifiez NULL avant de déréférencer
}

int main() {
    int x = 42;
    afficher_safe(&x);
    afficher_safe(NULL);
    return 0;
}`,
    solution: `#include <stdio.h>
#include <stdlib.h>

void afficher_safe(int *ptr) {
    if (ptr == NULL) {
        printf("Pointeur NULL !\\n");
    } else {
        printf("Valeur: %d\\n", *ptr);
    }
}

int main() {
    int x = 42;
    afficher_safe(&x);
    afficher_safe(NULL);
    return 0;
}`,
    tests: [
      { type: "contains", expected: "if (ptr == NULL)" },
      { type: "contains", expected: "Pointeur NULL" },
      { type: "contains", expected: "*ptr" },
    ],
    hint: "Toujours vérifier ptr == NULL avant de déréférencer pour éviter les segfaults.",
  },
  {
    id: "cpp_32",
    type: "code",
    category: "Pointeurs",
    title: "Pointeur de pointeur",
    description: "Comprenez les pointeurs à double indirection.",
    instruction: "Déclarez un <code>int x = 5</code>, un <code>int *ptr = &x</code> et un <code>int **pptr = &ptr</code>. Affichez la valeur de <code>x</code> via les trois moyens : directement, via <code>*ptr</code> et via <code>**pptr</code>.",
    code_template: `#include <stdio.h>

int main() {
    // Déclarez x, ptr, pptr et affichez
    return 0;
}`,
    solution: `#include <stdio.h>

int main() {
    int x = 5;
    int *ptr = &x;
    int **pptr = &ptr;

    printf("Direct: %d\\n", x);
    printf("Via ptr: %d\\n", *ptr);
    printf("Via pptr: %d\\n", **pptr);
    return 0;
}`,
    tests: [
      { type: "contains", expected: "int *ptr = &x" },
      { type: "contains", expected: "int **pptr = &ptr" },
      { type: "contains", expected: "**pptr" },
    ],
    hint: "int ** est un pointeur vers un pointeur. **pptr déréférence deux fois pour atteindre la valeur.",
  },
  // === ALLOCATION DYNAMIQUE (13-17) ===
  {
    id: "cpp_33",
    type: "intro",
    category: "Mémoire dynamique",
    title: "Allocation dynamique",
    description: "malloc et free permettent de gérer la mémoire manuellement.",
    content: `<h3>🧠 Mémoire dynamique — malloc & free</h3>
<p>L'allocation dynamique permet de réserver de la mémoire <strong>à l'exécution</strong> :</p>
<pre><code>#include &lt;stdlib.h&gt;

// Allouer un entier
int *p = (int*)malloc(sizeof(int));
*p = 42;

// Allouer un tableau de 10 entiers
int *arr = (int*)malloc(10 * sizeof(int));

// Toujours vérifier !
if (arr == NULL) {
    printf("Erreur d'allocation !\\n");
    return 1;
}

// Utiliser...
arr[0] = 100;

// TOUJOURS libérer la mémoire !
free(p);
free(arr);</code></pre>
<p>⚠️ Oublier <code>free()</code> = <strong>fuite mémoire</strong>. Utiliser après <code>free()</code> = <strong>use-after-free</strong> (bug critique).</p>`,
  },
  {
    id: "cpp_34",
    type: "code",
    category: "Mémoire dynamique",
    title: "malloc et free basique",
    description: "Allouez et libérez de la mémoire dynamiquement.",
    instruction: "Allouez dynamiquement un tableau de <code>5 int</code> avec <code>malloc</code>. Vérifiez si l'allocation a réussi. Remplissez avec les carrés (1, 4, 9, 16, 25), affichez, puis libérez avec <code>free</code>.",
    code_template: `#include <stdio.h>
#include <stdlib.h>

int main() {
    // Allouez, remplissez, affichez, libérez
    return 0;
}`,
    solution: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int *arr = (int*)malloc(5 * sizeof(int));
    if (arr == NULL) {
        printf("Erreur d'allocation\\n");
        return 1;
    }

    for (int i = 0; i < 5; i++) {
        arr[i] = (i + 1) * (i + 1);
    }

    for (int i = 0; i < 5; i++) {
        printf("%d ", arr[i]);
    }
    printf("\\n");

    free(arr);
    return 0;
}`,
    tests: [
      { type: "contains", expected: "malloc(5 * sizeof(int))" },
      { type: "contains", expected: "if (arr == NULL)" },
      { type: "contains", expected: "free(arr)" },
    ],
    hint: "malloc(n * sizeof(type)) alloue, vérifiez NULL, utilisez, puis free() pour libérer.",
  },
  {
    id: "cpp_35",
    type: "code",
    category: "Mémoire dynamique",
    title: "calloc et realloc",
    description: "Utilisez calloc pour initialiser à zéro et realloc pour redimensionner.",
    instruction: "Allouez un tableau de <code>3 int</code> avec <code>calloc</code> (initialisé à 0). Remplissez-le. Puis redimensionnez-le à <code>5 int</code> avec <code>realloc</code>, ajoutez 2 éléments, et libérez.",
    code_template: `#include <stdio.h>
#include <stdlib.h>

int main() {
    // calloc, remplir, realloc, compléter, free
    return 0;
}`,
    solution: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int *arr = (int*)calloc(3, sizeof(int));
    if (!arr) return 1;

    arr[0] = 10; arr[1] = 20; arr[2] = 30;

    arr = (int*)realloc(arr, 5 * sizeof(int));
    if (!arr) return 1;

    arr[3] = 40; arr[4] = 50;

    for (int i = 0; i < 5; i++) printf("%d ", arr[i]);
    printf("\\n");

    free(arr);
    return 0;
}`,
    tests: [
      { type: "contains", expected: "calloc(3, sizeof(int))" },
      { type: "contains", expected: "realloc(arr, 5 * sizeof(int))" },
      { type: "contains", expected: "free(arr)" },
    ],
    hint: "calloc(count, size) alloue et initialise à 0. realloc(ptr, newSize) redimensionne.",
  },
  {
    id: "cpp_36",
    type: "quiz",
    category: "Mémoire dynamique",
    title: "Fuites mémoire",
    description: "Quel code provoque une fuite mémoire ?",
    options: [
      "int *p = malloc(sizeof(int)); free(p);",
      "int *p = malloc(sizeof(int)); p = malloc(sizeof(int)); free(p);",
      "int x = 42; int *p = &x;",
      "int *p = calloc(1, sizeof(int)); free(p);",
    ],
    correct: 1,
    explanation: "La deuxième option alloue une première zone, puis réassigne p à une deuxième zone SANS libérer la première. La première allocation est perdue (fuite mémoire) car on n'a plus de référence vers elle.",
  },
  {
    id: "cpp_37",
    type: "code",
    category: "Mémoire dynamique",
    title: "Tableau dynamique redimensionnable",
    description: "Implémentez un tableau qui grandit automatiquement.",
    instruction: "Créez une structure <code>DynArray</code> avec <code>int *data</code>, <code>int size</code> et <code>int capacity</code>. Implémentez <code>init</code>, <code>push</code> (qui double la capacité si plein) et <code>destroy</code>.",
    code_template: `#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int *data;
    int size;
    int capacity;
} DynArray;

void init(DynArray *a, int cap) {
    // Initialisez
}

void push(DynArray *a, int val) {
    // Ajoutez, doublez si nécessaire
}

void destroy(DynArray *a) {
    // Libérez
}`,
    solution: `#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int *data;
    int size;
    int capacity;
} DynArray;

void init(DynArray *a, int cap) {
    a->data = (int*)malloc(cap * sizeof(int));
    a->size = 0;
    a->capacity = cap;
}

void push(DynArray *a, int val) {
    if (a->size >= a->capacity) {
        a->capacity *= 2;
        a->data = (int*)realloc(a->data, a->capacity * sizeof(int));
    }
    a->data[a->size++] = val;
}

void destroy(DynArray *a) {
    free(a->data);
    a->data = NULL;
    a->size = 0;
    a->capacity = 0;
}`,
    tests: [
      { type: "contains", expected: "typedef struct" },
      { type: "contains", expected: "a->data = (int*)malloc" },
      { type: "contains", expected: "a->capacity *= 2" },
      { type: "contains", expected: "realloc" },
      { type: "contains", expected: "free(a->data)" },
    ],
    hint: "init: malloc + set size=0. push: if full, capacity*=2 + realloc. destroy: free + NULL.",
  },
  // === STRUCTURES (18-20) ===
  {
    id: "cpp_38",
    type: "intro",
    category: "Structures",
    title: "Les Structures (struct)",
    description: "Les structures permettent de grouper des données de types différents.",
    content: `<h3>🏗️ Structures — Types composites</h3>
<pre><code>// Définition
typedef struct {
    char nom[50];
    int niveau;
    float xp;
} Guerrier;

// Création
Guerrier ulrich = {"Ulrich", 42, 1500.5f};

// Accès aux champs
printf("%s niveau %d\\n", ulrich.nom, ulrich.niveau);

// Via pointeur (->)
Guerrier *ptr = &ulrich;
printf("%s\\n", ptr->nom); // équivaut à (*ptr).nom</code></pre>`,
  },
  {
    id: "cpp_39",
    type: "code",
    category: "Structures",
    title: "Créer une structure",
    description: "Définissez et utilisez une structure.",
    instruction: "Créez une structure <code>Exercice</code> avec <code>int id</code>, <code>char titre[100]</code>, <code>int difficulte</code> et <code>int complete</code> (0 ou 1). Créez une instance, remplissez-la et affichez ses champs.",
    code_template: `#include <stdio.h>
#include <string.h>

// Définissez la structure Exercice

int main() {
    // Créez et affichez un exercice
    return 0;
}`,
    solution: `#include <stdio.h>
#include <string.h>

typedef struct {
    int id;
    char titre[100];
    int difficulte;
    int complete;
} Exercice;

int main() {
    Exercice ex;
    ex.id = 1;
    strcpy(ex.titre, "Hello World");
    ex.difficulte = 1;
    ex.complete = 0;

    printf("Exercice #%d: %s (diff: %d, %s)\\n",
           ex.id, ex.titre, ex.difficulte,
           ex.complete ? "terminé" : "en cours");
    return 0;
}`,
    tests: [
      { type: "contains", expected: "typedef struct" },
      { type: "contains", expected: "char titre[100]" },
      { type: "contains", expected: "Exercice ex" },
      { type: "contains", expected: "ex.id" },
      { type: "contains", expected: "strcpy" },
    ],
    hint: "typedef struct { ... } NomType; pour définir. Accès avec le point : ex.champ.",
  },
  {
    id: "cpp_40",
    type: "code",
    category: "Structures",
    title: "Tableau de structures",
    description: "Gérez un tableau de structures.",
    instruction: "Créez un tableau de 3 <code>Guerrier</code> et une fonction <code>void afficher_equipe(Guerrier equipe[], int n)</code> qui affiche chaque guerrier. Remplissez avec Ulrich (niv 42), Yumi (niv 38) et Odd (niv 35).",
    code_template: `#include <stdio.h>
#include <string.h>

typedef struct {
    char nom[50];
    int niveau;
} Guerrier;

void afficher_equipe(Guerrier equipe[], int n) {
    // Affichez chaque guerrier
}

int main() {
    // Créez l'équipe et affichez
    return 0;
}`,
    solution: `#include <stdio.h>
#include <string.h>

typedef struct {
    char nom[50];
    int niveau;
} Guerrier;

void afficher_equipe(Guerrier equipe[], int n) {
    for (int i = 0; i < n; i++) {
        printf("%s - Niveau %d\\n", equipe[i].nom, equipe[i].niveau);
    }
}

int main() {
    Guerrier equipe[3];
    strcpy(equipe[0].nom, "Ulrich"); equipe[0].niveau = 42;
    strcpy(equipe[1].nom, "Yumi"); equipe[1].niveau = 38;
    strcpy(equipe[2].nom, "Odd"); equipe[2].niveau = 35;

    afficher_equipe(equipe, 3);
    return 0;
}`,
    tests: [
      { type: "contains", expected: "Guerrier equipe[3]" },
      { type: "contains", expected: "equipe[i].nom" },
      { type: "contains", expected: "equipe[i].niveau" },
      { type: "contains", expected: "afficher_equipe(equipe, 3)" },
    ],
    hint: "Déclarez un tableau de struct, accédez avec equipe[i].champ.",
  },
];

addExercises("cpp", exercises);
