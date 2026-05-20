import { addExercises } from "./registry";
import type { Exercise } from "./registry";

/**
 * Module C — Part 2 : contrôle de flux, fonctions, tableaux.
 */
const exercises: Exercise[] = [
  {
    id: "c_6",
    type: "code",
    category: "Contrôle de flux",
    title: "Condition if/else",
    description: "Tester la parité d'un nombre.",
    instruction: `Affichez <code>Pair</code> si <code>n % 2 == 0</code>, sinon <code>Impair</code>. La variable <code>n = 7</code> est déjà déclarée.`,
    code_template: `#include <stdio.h>\n\nint main(void) {\n    int n = 7;\n    // Votre code ici\n    return 0;\n}\n`,
    solution: `#include <stdio.h>\n\nint main(void) {\n    int n = 7;\n    if (n % 2 == 0) printf("Pair\\n");\n    else printf("Impair\\n");\n    return 0;\n}\n`,
    tests: [
      { type: "contains", expected: "if" },
      { type: "output", expected_output: "Impair" },
    ],
    hint: "if (n % 2 == 0) ... else ...",
  },
  {
    id: "c_7",
    type: "code",
    category: "Contrôle de flux",
    title: "Boucle for",
    description: "Afficher les entiers de 1 à 5.",
    instruction: `Utilisez une boucle <code>for</code> qui affiche les entiers de 1 à 5, un par ligne.`,
    code_template: `#include <stdio.h>\n\nint main(void) {\n    // Votre boucle ici\n    return 0;\n}\n`,
    solution: `#include <stdio.h>\n\nint main(void) {\n    for (int i = 1; i <= 5; i++) {\n        printf("%d\\n", i);\n    }\n    return 0;\n}\n`,
    tests: [
      { type: "regex", expected: "for\\s*\\(" },
      { type: "output", expected_output: "1\n2\n3\n4\n5" },
    ],
  },
  {
    id: "c_8",
    type: "code",
    category: "Contrôle de flux",
    title: "Boucle while",
    description: "Compter à rebours de 3 à 1.",
    instruction: `Avec une boucle <code>while</code>, affichez <code>3</code>, <code>2</code>, <code>1</code> sur trois lignes.`,
    code_template: `#include <stdio.h>\n\nint main(void) {\n    int n = 3;\n    // Boucle while\n    return 0;\n}\n`,
    solution: `#include <stdio.h>\n\nint main(void) {\n    int n = 3;\n    while (n > 0) {\n        printf("%d\\n", n);\n        n--;\n    }\n    return 0;\n}\n`,
    tests: [
      { type: "contains", expected: "while" },
      { type: "output", expected_output: "3\n2\n1" },
    ],
  },
  {
    id: "c_9",
    type: "code",
    category: "Fonctions",
    title: "Fonction add",
    description: "Déclarer et appeler une fonction.",
    instruction: `Écrivez <code>int add(int a, int b)</code> qui retourne <code>a + b</code>, puis affichez <code>add(10, 32)</code>.`,
    code_template: `#include <stdio.h>\n\n// Définissez add ici\n\nint main(void) {\n    printf("%d\\n", /* appel ici */ 0);\n    return 0;\n}\n`,
    solution: `#include <stdio.h>\n\nint add(int a, int b) {\n    return a + b;\n}\n\nint main(void) {\n    printf("%d\\n", add(10, 32));\n    return 0;\n}\n`,
    tests: [
      { type: "regex", expected: "int\\s+add\\s*\\(" },
      { type: "contains", expected: "return a + b" },
      { type: "output", expected_output: "42" },
    ],
  },
  {
    id: "c_10",
    type: "code",
    category: "Tableaux",
    title: "Premier tableau",
    description: "Parcourir un tableau d'entiers.",
    instruction: `Créez <code>int arr[] = {10, 20, 30};</code> puis affichez la <strong>somme</strong> avec une boucle for.`,
    code_template: `#include <stdio.h>\n\nint main(void) {\n    int arr[] = {10, 20, 30};\n    int sum = 0;\n    // Parcours\n    return 0;\n}\n`,
    solution: `#include <stdio.h>\n\nint main(void) {\n    int arr[] = {10, 20, 30};\n    int sum = 0;\n    for (int i = 0; i < 3; i++) sum += arr[i];\n    printf("%d\\n", sum);\n    return 0;\n}\n`,
    tests: [
      { type: "output", expected_output: "60" },
    ],
  },
  {
    id: "c_11",
    type: "code",
    category: "Tableaux",
    title: "Max d'un tableau",
    description: "Trouver l'élément maximum.",
    instruction: `Trouvez et affichez le maximum de <code>{3, 7, 2, 9, 4}</code>.`,
    code_template: `#include <stdio.h>\n\nint main(void) {\n    int arr[] = {3, 7, 2, 9, 4};\n    int max = arr[0];\n    // Trouver le max\n    return 0;\n}\n`,
    solution: `#include <stdio.h>\n\nint main(void) {\n    int arr[] = {3, 7, 2, 9, 4};\n    int max = arr[0];\n    for (int i = 1; i < 5; i++) if (arr[i] > max) max = arr[i];\n    printf("%d\\n", max);\n    return 0;\n}\n`,
    tests: [
      { type: "output", expected_output: "9" },
    ],
  },
  {
    id: "c_12",
    type: "quiz",
    category: "Mémoire dynamique",
    title: "malloc & free",
    content: `<p>Quelle fonction libère la mémoire allouée par <code>malloc</code> ?</p>`,
    options: ["delete", "free", "dealloc", "release"],
    correct: 1,
    explanation: "En C, on libère avec <code>free(ptr)</code>. Oublier de libérer = fuite mémoire.",
  },
  {
    id: "c_13",
    type: "code",
    category: "Mémoire dynamique",
    title: "Allocation dynamique",
    description: "Allouer un entier sur le tas.",
    instruction: `Allouez un <code>int</code> avec <code>malloc(sizeof(int))</code>, assignez la valeur <code>99</code>, affichez-le, puis libérez avec <code>free</code>.`,
    code_template: `#include <stdio.h>\n#include <stdlib.h>\n\nint main(void) {\n    // Allouer, assigner, afficher, libérer\n    return 0;\n}\n`,
    solution: `#include <stdio.h>\n#include <stdlib.h>\n\nint main(void) {\n    int *p = malloc(sizeof(int));\n    *p = 99;\n    printf("%d\\n", *p);\n    free(p);\n    return 0;\n}\n`,
    tests: [
      { type: "contains", expected: "malloc" },
      { type: "contains", expected: "free" },
      { type: "output", expected_output: "99" },
    ],
    hint: "int *p = malloc(sizeof(int));  *p = 99;  printf(\"%d\\n\", *p);  free(p);",
  },
];

addExercises("c", exercises);
