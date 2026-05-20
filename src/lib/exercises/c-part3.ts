import { addExercises } from "./registry";
import type { Exercise } from "./registry";

/**
 * Module C — Part 3 : chaînes de caractères, structures, récursion.
 */
const exercises: Exercise[] = [
  {
    id: "c_14",
    type: "code",
    category: "Chaînes",
    title: "strlen",
    description: "Mesurer une chaîne de caractères.",
    instruction: `Affichez la longueur de <code>"Code Lyoko"</code> avec <code>strlen</code>. N'oubliez pas <code>#include &lt;string.h&gt;</code>.`,
    code_template: `#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    const char *s = "Code Lyoko";\n    // Afficher strlen(s)\n    return 0;\n}\n`,
    solution: `#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    const char *s = "Code Lyoko";\n    printf("%zu\\n", strlen(s));\n    return 0;\n}\n`,
    tests: [
      { type: "contains", expected: "strlen" },
      { type: "output", expected_output: "10" },
    ],
  },
  {
    id: "c_15",
    type: "code",
    category: "Chaînes",
    title: "strcpy",
    description: "Copier une chaîne.",
    instruction: `Copiez <code>"Aelita"</code> dans le buffer <code>dst</code> et affichez-le.`,
    code_template: `#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    char dst[20];\n    // strcpy puis printf\n    return 0;\n}\n`,
    solution: `#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    char dst[20];\n    strcpy(dst, "Aelita");\n    printf("%s\\n", dst);\n    return 0;\n}\n`,
    tests: [
      { type: "contains", expected: "strcpy" },
      { type: "output", expected_output: "Aelita" },
    ],
  },
  {
    id: "c_16",
    type: "code",
    category: "Chaînes",
    title: "Comparer deux chaînes",
    description: "Utiliser strcmp.",
    instruction: `Comparez <code>"XANA"</code> et <code>"xana"</code> avec <code>strcmp</code>. Si elles sont identiques (retour 0), affichez <code>Egales</code>, sinon <code>Differentes</code>.`,
    code_template: `#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    const char *a = "XANA";\n    const char *b = "xana";\n    // strcmp + if\n    return 0;\n}\n`,
    solution: `#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    const char *a = "XANA";\n    const char *b = "xana";\n    if (strcmp(a, b) == 0) printf("Egales\\n");\n    else printf("Differentes\\n");\n    return 0;\n}\n`,
    tests: [
      { type: "contains", expected: "strcmp" },
      { type: "output", expected_output: "Differentes" },
    ],
    hint: "strcmp est sensible à la casse.",
  },
  {
    id: "c_17",
    type: "quiz",
    category: "Structures",
    title: "Définir une struct",
    content: `<p>Quelle syntaxe déclare correctement une structure <code>Point</code> ?</p>`,
    options: [
      "class Point { int x; int y; };",
      "struct Point { int x; int y; };",
      "type Point = { int x; int y; };",
      "Point = { x: int, y: int };",
    ],
    correct: 1,
    explanation: "En C, on utilise <code>struct Nom { …membres… };</code> — la classe n'existe pas (c'est du C++).",
  },
  {
    id: "c_18",
    type: "code",
    category: "Structures",
    title: "Premier struct",
    description: "Définir et initialiser une struct.",
    instruction: `Définissez <code>struct Point { int x; int y; };</code>, créez <code>Point p = {3, 4}</code> puis affichez <code>p.x</code> et <code>p.y</code> séparés par un espace.`,
    code_template: `#include <stdio.h>\n\nstruct Point {\n    // membres\n};\n\nint main(void) {\n    // initialiser et afficher\n    return 0;\n}\n`,
    solution: `#include <stdio.h>\n\nstruct Point { int x; int y; };\n\nint main(void) {\n    struct Point p = {3, 4};\n    printf("%d %d\\n", p.x, p.y);\n    return 0;\n}\n`,
    tests: [
      { type: "contains", expected: "struct Point" },
      { type: "output", expected_output: "3 4" },
    ],
  },
  {
    id: "c_19",
    type: "code",
    category: "Récursion",
    title: "Factorielle récursive",
    description: "Implémenter n! par récursion.",
    instruction: `Définissez <code>int factorielle(int n)</code> récursive, puis affichez <code>factorielle(6)</code>. Rappel : 0! = 1, n! = n × (n-1)!.`,
    code_template: `#include <stdio.h>\n\nint factorielle(int n) {\n    // récursion\n    return 0;\n}\n\nint main(void) {\n    printf("%d\\n", factorielle(6));\n    return 0;\n}\n`,
    solution: `#include <stdio.h>\n\nint factorielle(int n) {\n    if (n <= 1) return 1;\n    return n * factorielle(n - 1);\n}\n\nint main(void) {\n    printf("%d\\n", factorielle(6));\n    return 0;\n}\n`,
    tests: [
      { type: "contains", expected: "factorielle(n - 1)" },
      { type: "output", expected_output: "720" },
    ],
  },
  {
    id: "c_20",
    type: "code",
    category: "Récursion",
    title: "Fibonacci",
    description: "Calculer fib(n) par récursion naïve.",
    instruction: `Implémentez <code>int fib(int n)</code> récursif où fib(0)=0, fib(1)=1, fib(n) = fib(n-1) + fib(n-2). Affichez <code>fib(10)</code>.`,
    code_template: `#include <stdio.h>\n\nint fib(int n) {\n    // votre code\n    return 0;\n}\n\nint main(void) {\n    printf("%d\\n", fib(10));\n    return 0;\n}\n`,
    solution: `#include <stdio.h>\n\nint fib(int n) {\n    if (n < 2) return n;\n    return fib(n-1) + fib(n-2);\n}\n\nint main(void) {\n    printf("%d\\n", fib(10));\n    return 0;\n}\n`,
    tests: [
      { type: "contains", expected: "fib(n" },
      { type: "output", expected_output: "55" },
    ],
  },
  {
    id: "c_21",
    type: "code",
    category: "Pointeurs",
    title: "Échanger deux entiers",
    description: "Classique : swap par pointeur.",
    instruction: `Définissez <code>void swap(int *a, int *b)</code> qui échange les valeurs, puis testez avec <code>x=1, y=2</code> et affichez <code>x y</code> après swap.`,
    code_template: `#include <stdio.h>\n\nvoid swap(int *a, int *b) {\n    // votre code\n}\n\nint main(void) {\n    int x = 1, y = 2;\n    swap(&x, &y);\n    printf("%d %d\\n", x, y);\n    return 0;\n}\n`,
    solution: `#include <stdio.h>\n\nvoid swap(int *a, int *b) {\n    int t = *a;\n    *a = *b;\n    *b = t;\n}\n\nint main(void) {\n    int x = 1, y = 2;\n    swap(&x, &y);\n    printf("%d %d\\n", x, y);\n    return 0;\n}\n`,
    tests: [
      { type: "regex", expected: "\\*a\\s*=\\s*\\*b" },
      { type: "output", expected_output: "2 1" },
    ],
  },
];

addExercises("c", exercises);
