import { addExercises } from "./registry";
import type { Exercise } from "./registry";

/**
 * Module C — Part 1 : bases du langage C pur.
 * À séparer progressivement du module C++ (cpp-part*).
 */
const exercises: Exercise[] = [
  {
    id: "c_intro_0",
    type: "intro",
    category: "Introduction C",
    title: "Bienvenue en C",
    content: `<p>Le langage <strong>C</strong> (1972, Dennis Ritchie) est le grand-père de la programmation moderne. Il alimente les noyaux Linux, Windows, macOS, Git, Python, Redis…</p>
<p>Pourquoi apprendre le C en 2026 ? Parce qu'il enseigne ce que tous les langages cachent : la mémoire, les pointeurs, le système.</p>`,
  },
  {
    id: "c_1",
    type: "code",
    category: "Introduction C",
    title: "Hello, World!",
    description: "Votre premier programme en C.",
    instruction: `Affichez <code>Hello, World!</code> avec <code>printf</code>. N'oubliez pas <code>#include &lt;stdio.h&gt;</code>.`,
    code_template: `#include <stdio.h>\n\nint main(void) {\n    // Votre code ici\n    return 0;\n}\n`,
    solution: `#include <stdio.h>\n\nint main(void) {\n    printf("Hello, World!\\n");\n    return 0;\n}\n`,
    tests: [
      { type: "contains", expected: "#include <stdio.h>" },
      { type: "contains", expected: "printf" },
      { type: "output", expected_output: "Hello, World!" },
    ],
    hint: "printf(\"Hello, World!\\n\");",
  },
  {
    id: "c_2",
    type: "code",
    category: "Variables & Types",
    title: "Première variable",
    description: "Déclarez un entier et affichez-le.",
    instruction: `Créez une variable <code>int age = 25;</code> puis affichez-la avec <code>printf("Age: %d\\n", age);</code>.`,
    code_template: `#include <stdio.h>\n\nint main(void) {\n    // Déclarez 'age' ici\n    return 0;\n}\n`,
    solution: `#include <stdio.h>\n\nint main(void) {\n    int age = 25;\n    printf("Age: %d\\n", age);\n    return 0;\n}\n`,
    tests: [
      { type: "contains", expected: "int age" },
      { type: "regex", expected: "printf\\([^)]*%d" },
      { type: "output", expected_output: "Age: 25" },
    ],
  },
  {
    id: "c_3",
    type: "code",
    category: "Variables & Types",
    title: "Addition entière",
    description: "Calculez la somme de deux entiers.",
    instruction: `Déclarez <code>a = 7</code> et <code>b = 13</code>, affichez leur somme avec <code>printf("%d\\n", a + b);</code>.`,
    code_template: `#include <stdio.h>\n\nint main(void) {\n    int a = 7;\n    int b = 13;\n    // Affichez la somme\n    return 0;\n}\n`,
    solution: `#include <stdio.h>\n\nint main(void) {\n    int a = 7, b = 13;\n    printf("%d\\n", a + b);\n    return 0;\n}\n`,
    tests: [
      { type: "output", expected_output: "20" },
    ],
  },
  {
    id: "c_4",
    type: "quiz",
    category: "Pointeurs",
    title: "Comprendre l'opérateur &",
    content: `<p>Que retourne <code>&x</code> en C, si <code>x</code> est une variable ?</p>`,
    options: [
      "La valeur de x",
      "L'adresse mémoire de x",
      "Une copie de x",
      "Une erreur de compilation",
    ],
    correct: 1,
    explanation: "L'opérateur &amp; retourne l'<strong>adresse mémoire</strong> de la variable, qu'on peut stocker dans un pointeur.",
  },
  {
    id: "c_5",
    type: "code",
    category: "Pointeurs",
    title: "Premier pointeur",
    description: "Déréférencer un pointeur sur un entier.",
    instruction: `Créez <code>int n = 42;</code>, un pointeur <code>int *p = &amp;n;</code>, puis affichez <code>*p</code> avec <code>printf("%d\\n", *p);</code>.`,
    code_template: `#include <stdio.h>\n\nint main(void) {\n    int n = 42;\n    // Pointeur ici\n    return 0;\n}\n`,
    solution: `#include <stdio.h>\n\nint main(void) {\n    int n = 42;\n    int *p = &n;\n    printf("%d\\n", *p);\n    return 0;\n}\n`,
    tests: [
      { type: "regex", expected: "int\\s*\\*\\s*p\\s*=" },
      { type: "regex", expected: "\\*p" },
      { type: "output", expected_output: "42" },
    ],
    hint: "int *p = &n;  puis  printf(\"%d\\n\", *p);",
  },
];

addExercises("c", exercises);
