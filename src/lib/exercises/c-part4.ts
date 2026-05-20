import { addExercises } from "./registry";
import type { Exercise } from "./registry";

/**
 * Module C — Part 4 : préprocesseur, fichiers, algorithmes classiques.
 */
const exercises: Exercise[] = [
  {
    id: "c_22",
    type: "code",
    category: "Préprocesseur",
    title: "Macro #define",
    description: "Définir une constante de compilation.",
    instruction: `Définissez la macro <code>#define PI 3.14</code> puis affichez <code>PI</code> avec <code>printf("%.2f\\n", PI);</code>.`,
    code_template: `#include <stdio.h>\n// Définissez PI ici\n\nint main(void) {\n    printf("%.2f\\n", PI);\n    return 0;\n}\n`,
    solution: `#include <stdio.h>\n#define PI 3.14\n\nint main(void) {\n    printf("%.2f\\n", PI);\n    return 0;\n}\n`,
    tests: [
      { type: "regex", expected: "#define\\s+PI" },
      { type: "output", expected_output: "3.14" },
    ],
  },
  {
    id: "c_23",
    type: "code",
    category: "Préprocesseur",
    title: "Macro avec paramètre",
    description: "Macro fonction inline.",
    instruction: `Définissez <code>#define SQR(x) ((x)*(x))</code> puis affichez <code>SQR(5)</code>.`,
    code_template: `#include <stdio.h>\n// SQR ici\n\nint main(void) {\n    printf("%d\\n", SQR(5));\n    return 0;\n}\n`,
    solution: `#include <stdio.h>\n#define SQR(x) ((x)*(x))\n\nint main(void) {\n    printf("%d\\n", SQR(5));\n    return 0;\n}\n`,
    tests: [
      { type: "regex", expected: "#define\\s+SQR" },
      { type: "output", expected_output: "25" },
    ],
    hint: "Les parenthèses autour de x sont essentielles : SQR(1+2) doit donner 9, pas 5.",
  },
  {
    id: "c_24",
    type: "code",
    category: "Tableaux",
    title: "Inverser un tableau",
    description: "In-place reversal.",
    instruction: `Inversez <code>{1, 2, 3, 4, 5}</code> en place puis affichez les éléments séparés par un espace.`,
    code_template: `#include <stdio.h>\n\nint main(void) {\n    int arr[] = {1, 2, 3, 4, 5};\n    int n = 5;\n    // Inverser\n    for (int i = 0; i < n; i++) printf("%d ", arr[i]);\n    printf("\\n");\n    return 0;\n}\n`,
    solution: `#include <stdio.h>\n\nint main(void) {\n    int arr[] = {1, 2, 3, 4, 5};\n    int n = 5;\n    for (int i = 0, j = n - 1; i < j; i++, j--) {\n        int t = arr[i]; arr[i] = arr[j]; arr[j] = t;\n    }\n    for (int i = 0; i < n; i++) printf("%d ", arr[i]);\n    printf("\\n");\n    return 0;\n}\n`,
    tests: [
      { type: "output", expected_output: "5 4 3 2 1" },
    ],
  },
  {
    id: "c_25",
    type: "code",
    category: "Algorithmes",
    title: "Recherche linéaire",
    description: "Trouver l'indice d'un élément.",
    instruction: `Cherchez la valeur <code>42</code> dans <code>{10, 20, 30, 42, 50}</code> et affichez son indice (0-based). Si absent, affichez <code>-1</code>.`,
    code_template: `#include <stdio.h>\n\nint main(void) {\n    int arr[] = {10, 20, 30, 42, 50};\n    int target = 42;\n    int idx = -1;\n    // Boucle\n    printf("%d\\n", idx);\n    return 0;\n}\n`,
    solution: `#include <stdio.h>\n\nint main(void) {\n    int arr[] = {10, 20, 30, 42, 50};\n    int target = 42;\n    int idx = -1;\n    for (int i = 0; i < 5; i++) if (arr[i] == target) { idx = i; break; }\n    printf("%d\\n", idx);\n    return 0;\n}\n`,
    tests: [
      { type: "output", expected_output: "3" },
    ],
  },
  {
    id: "c_26",
    type: "code",
    category: "Algorithmes",
    title: "Compter les voyelles",
    description: "Manipulation de chaîne caractère par caractère.",
    instruction: `Comptez les voyelles (aeiouAEIOU) dans <code>"Code Lyoko"</code> et affichez le total.`,
    code_template: `#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    const char *s = "Code Lyoko";\n    int count = 0;\n    // Boucle\n    printf("%d\\n", count);\n    return 0;\n}\n`,
    solution: `#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    const char *s = "Code Lyoko";\n    int count = 0;\n    for (int i = 0; s[i] != '\\0'; i++) {\n        char c = s[i];\n        if (c=='a'||c=='e'||c=='i'||c=='o'||c=='u'||c=='A'||c=='E'||c=='I'||c=='O'||c=='U') count++;\n    }\n    printf("%d\\n", count);\n    return 0;\n}\n`,
    tests: [
      { type: "output", expected_output: "4" },
    ],
  },
  {
    id: "c_27",
    type: "code",
    category: "Algorithmes",
    title: "Tri à bulles",
    description: "Implémenter un bubble sort.",
    instruction: `Triez <code>{5, 2, 8, 1, 4}</code> en ordre croissant et affichez le résultat (séparé par espaces).`,
    code_template: `#include <stdio.h>\n\nint main(void) {\n    int arr[] = {5, 2, 8, 1, 4};\n    int n = 5;\n    // Bubble sort\n    for (int i = 0; i < n; i++) printf("%d ", arr[i]);\n    printf("\\n");\n    return 0;\n}\n`,
    solution: `#include <stdio.h>\n\nint main(void) {\n    int arr[] = {5, 2, 8, 1, 4};\n    int n = 5;\n    for (int i = 0; i < n - 1; i++)\n        for (int j = 0; j < n - i - 1; j++)\n            if (arr[j] > arr[j+1]) { int t = arr[j]; arr[j] = arr[j+1]; arr[j+1] = t; }\n    for (int i = 0; i < n; i++) printf("%d ", arr[i]);\n    printf("\\n");\n    return 0;\n}\n`,
    tests: [
      { type: "output", expected_output: "1 2 4 5 8" },
    ],
  },
  {
    id: "c_28",
    type: "code",
    category: "Récursion",
    title: "Somme récursive",
    description: "Somme de 1 à n par récursion.",
    instruction: `Écrivez <code>int somme(int n)</code> récursif qui retourne 1+2+...+n. Affichez <code>somme(100)</code>.`,
    code_template: `#include <stdio.h>\n\nint somme(int n) {\n    // récursion\n    return 0;\n}\n\nint main(void) {\n    printf("%d\\n", somme(100));\n    return 0;\n}\n`,
    solution: `#include <stdio.h>\n\nint somme(int n) {\n    if (n <= 0) return 0;\n    return n + somme(n - 1);\n}\n\nint main(void) {\n    printf("%d\\n", somme(100));\n    return 0;\n}\n`,
    tests: [
      { type: "regex", expected: "somme\\(n\\s*-\\s*1\\)" },
      { type: "output", expected_output: "5050" },
    ],
  },
  {
    id: "c_29",
    type: "code",
    category: "Algorithmes",
    title: "Palindrome",
    description: "Vérifier si une chaîne se lit à l'envers.",
    instruction: `Vérifiez si <code>"radar"</code> est un palindrome. Affichez <code>Oui</code> ou <code>Non</code>.`,
    code_template: `#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    const char *s = "radar";\n    // Vérifier\n    return 0;\n}\n`,
    solution: `#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    const char *s = "radar";\n    int n = strlen(s);\n    int palindrome = 1;\n    for (int i = 0; i < n / 2; i++) if (s[i] != s[n - 1 - i]) { palindrome = 0; break; }\n    printf("%s\\n", palindrome ? "Oui" : "Non");\n    return 0;\n}\n`,
    tests: [
      { type: "output", expected_output: "Oui" },
    ],
  },
  {
    id: "c_30",
    type: "code",
    category: "Algorithmes",
    title: "PGCD (Euclide)",
    description: "Plus grand commun diviseur.",
    instruction: `Implémentez l'algorithme d'Euclide : <code>int pgcd(int a, int b)</code>. Affichez <code>pgcd(48, 36)</code>.`,
    code_template: `#include <stdio.h>\n\nint pgcd(int a, int b) {\n    // Euclide\n    return 0;\n}\n\nint main(void) {\n    printf("%d\\n", pgcd(48, 36));\n    return 0;\n}\n`,
    solution: `#include <stdio.h>\n\nint pgcd(int a, int b) {\n    return b == 0 ? a : pgcd(b, a % b);\n}\n\nint main(void) {\n    printf("%d\\n", pgcd(48, 36));\n    return 0;\n}\n`,
    tests: [
      { type: "output", expected_output: "12" },
    ],
    hint: "pgcd(a, b) = pgcd(b, a%b) ; cas de base : b == 0 → retourner a.",
  },
];

addExercises("c", exercises);
