import { addExercises } from ".";
import type { Exercise } from "@/app/exercises/[module]/exercise-client";

// @ts-nocheck — Auto-converted from exercises-part1.js
const exercises: Exercise[] = [
    // === PREMIERS PAS (1-10) ===
    {
      id: "s1_e1",
      title: "Hello World",
      description: "Votre premier programme Python - affichez 'Hello, World!'",
      instruction:
        "Utilisez la fonction print() pour afficher le message 'Hello, World!' dans la console",
      help_steps: [
        "1. Tapez 'print(' pour commencer",
        '2. Ajoutez des guillemets doubles ""',
        "3. Écrivez le message entre les guillemets",
        "4. Fermez avec la parenthèse )",
      ],
      code_template: `# Exercice 1: Hello World
# Affichez le message "Hello, World!"
# Utilisez la fonction print()

`,
      solution: `print("Hello, World!")`,
      tests: [{ input: "", expected_output: "Hello, World!" }],
    },
    {
      id: "s1_e2",
      title: "Hello avec votre nom",
      description: "Personnalisez le message de bienvenue",
      instruction:
        "Affichez un message de bienvenue personnalisé avec votre nom en utilisant print()",
      help_steps: [
        "1. Utilisez print() comme dans l'exercice précédent",
        "2. Remplacez le contenu par votre nom",
        "3. Format: 'Hello, VotreNom!'",
        "4. N'oubliez pas les guillemets",
      ],
      code_template: `# Exercice 2: Hello personnalisé
# Affichez "Hello, [votre nom]!"
# Remplacez [votre nom] par votre vrai nom

`,
      solution: `print("Hello, Alice!")`,
      tests: [{ input: "", expected_output: "Hello, Alice!" }],
    },
    {
      id: "s1_e3",
      title: "Messages multiples",
      description: "Afficher plusieurs messages avec print()",
      instruction: "Affichez 3 messages différents sur 3 lignes séparées",
      help_steps: [
        "1. Utilisez 3 instructions print() séparées",
        "2. Chaque print() affiche un message différent",
        "3. Les messages apparaîtront sur des lignes séparées",
      ],
      code_template: `# Exercice 3: Plusieurs print()
# Affichez 3 messages différents sur 3 lignes
# Message 1: "Bonjour"
# Message 2: "Je apprends Python"
# Message 3: "C'est génial!"

`,
      solution: `print("Bonjour")
print("Je apprends Python")
print("C'est génial!")`,
      tests: [{ input: "", expected_output: "Bonjour" }],
    },
    {
      id: "s1_e4",
      title: "Commentaires",
      description: "Utiliser les commentaires pour documenter le code",
      instruction:
        "Ajoutez des commentaires pour expliquer chaque ligne de code",
      help_steps: [
        "1. Utilisez # pour commencer un commentaire",
        "2. Ajoutez un commentaire au-dessus de chaque print()",
        "3. Expliquez ce que fait chaque ligne",
      ],
      code_template: `# Exercice 4: Les commentaires
# Ajoutez un commentaire au-dessus de chaque print()
# pour expliquer ce que fait chaque ligne

print("Python est facile")
print("Les commentaires aident à comprendre")
`,
      solution: `# Affichage d'un message positif
print("Python est facile")
# Explication de l'utilité des commentaires
print("Les commentaires aident à comprendre")`,
      tests: [{ input: "", expected_output: "Python est facile" }],
    },
    {
      id: "s1_e5",
      title: "Guillemets simples vs doubles",
      description: "Découvrir les différents types de guillemets",
      instruction:
        "Utilisez les guillemets doubles et simples pour afficher du texte",
      help_steps: [
        '1. Les guillemets doubles : "texte"',
        "2. Les guillemets simples : 'texte'",
        "3. Utilisez \\' pour échapper une apostrophe",
      ],
      code_template: `# Exercice 5: Types de guillemets
# Affichez le même message avec guillemets doubles puis simples
# Message: Python c'est super

`,
      solution: `print("Python c'est super")
print('Python c\\'est super')`,
      tests: [{ input: "", expected_output: "Python c'est super" }],
    },
    {
      id: "s1_e6",
      title: "Caractères d'échappement",
      description: "Utiliser \\n pour les sauts de ligne",
      instruction: "Affichez plusieurs lignes en une seule instruction print()",
      help_steps: [
        "1. \\n crée un saut de ligne",
        "2. Placez \\n entre les mots dans une chaîne",
        "3. Une seule instruction print() peut afficher plusieurs lignes",
      ],
      code_template: `# Exercice 6: Saut de ligne
# Affichez en UNE seule instruction print():
# Ligne 1: "Première ligne"
# Ligne 2: "Deuxième ligne"
# Utilisez \\n

`,
      solution: `print("Première ligne\\nDeuxième ligne")`,
      tests: [{ input: "", expected_output: "Première ligne" }],
    },
    {
      id: "s1_e7",
      title: "Tabulations",
      description: "Utiliser \\t pour l'indentation",
      instruction: "Créez un menu indenté avec des tabulations",
      help_steps: [
        "1. \\t crée une tabulation (indentation)",
        "2. Utilisez \\t entre le numéro et le texte",
        "3. Cela aligne le texte proprement",
      ],
      code_template: `# Exercice 7: Tabulations
# Affichez un menu indenté avec \\t:
# 1.	Python
# 2.	JavaScript
# 3.	Java

`,
      solution: `print("1.\\tPython")
print("2.\\tJavaScript")
print("3.\\tJava")`,
      tests: [{ input: "", expected_output: "1.	Python" }],
    },
    {
      id: "s1_e8",
      title: "Print avec séparateur",
      description: "Utiliser le paramètre sep de print()",
      instruction:
        "Affichez plusieurs éléments avec un séparateur personnalisé",
      help_steps: [
        "1. print() peut prendre plusieurs arguments",
        "2. Le paramètre sep= définit le séparateur",
        '3. Exemple: print("A", "B", sep="-")',
      ],
      code_template: `# Exercice 8: Séparateur personnalisé
# Affichez "A-B-C-D" en une seule instruction
# Utilisez print("A", "B", "C", "D", sep="-")

`,
      solution: `print("A", "B", "C", "D", sep="-")`,
      tests: [{ input: "", expected_output: "A-B-C-D" }],
    },
    {
      id: "s1_e9",
      title: "Print sans saut de ligne",
      description: "Utiliser le paramètre end de print()",
      instruction: "Affichez du texte sur la même ligne avec plusieurs print()",
      help_steps: [
        "1. Par défaut, print() ajoute un saut de ligne",
        "2. Le paramètre end= change ce comportement",
        '3. end=" " ajoute un espace au lieu du saut de ligne',
      ],
      code_template: `# Exercice 9: Sans saut de ligne
# Affichez "Hello" puis "World" sur la même ligne
# Utilisez end="" ou end=" "

`,
      solution: `print("Hello", end=" ")
print("World")`,
      tests: [{ input: "", expected_output: "Hello World" }],
    },
    {
      id: "s1_e10",
      title: "ASCII Art simple",
      description: "Créer un dessin simple avec print()",
      instruction: "Dessinez un smiley simple avec des caractères",
      help_steps: [
        "1. Utilisez des caractères simples : :, -, )",
        "2. Combinez-les pour former un visage",
        "3. Attention aux espaces pour le centrage",
      ],
      code_template: `# Exercice 10: ASCII Art
# Dessinez un smiley simple:
#  :-)
# Utilisez print()

`,
      solution: `print(" :-)")`,
      tests: [{ input: "", expected_output: " :-)" }],
    },

    // === VARIABLES DE BASE (11-25) ===
    {
      id: "s1_e11",
      title: "Première variable",
      description: "Créer et afficher une variable",
      instruction: "Créez une variable contenant votre nom et affichez-la",
      help_steps: [
        "1. nom_de_variable = valeur",
        "2. Utilisez des guillemets pour le texte",
        "3. print(nom_de_variable) pour afficher",
      ],
      code_template: `# Exercice 11: Première variable
# Créez une variable 'nom' avec votre nom
# Affichez-la avec print()

`,
      solution: `nom = "Alice"
print(nom)`,
      tests: [{ input: "", expected_output: "Alice" }],
    },
    {
      id: "s1_e12",
      title: "Variable nombre",
      description: "Créer une variable numérique",
      instruction: "Créez une variable contenant un nombre et affichez-la",
      help_steps: [
        "1. Les nombres n'ont pas besoin de guillemets",
        "2. age = 25 (pas de guillemets)",
        "3. Les nombres peuvent être utilisés dans les calculs",
      ],
      code_template: `# Exercice 12: Variable nombre
# Créez une variable 'age' avec votre âge
# Affichez-la

`,
      solution: `age = 25
print(age)`,
      tests: [{ input: "", expected_output: "25" }],
    },
    {
      id: "s1_e13",
      title: "Plusieurs variables",
      description: "Créer plusieurs variables de types différents",
      instruction:
        "Créez des variables de types différents (texte, nombre, décimal)",
      help_steps: [
        '1. Texte: nom = "Alice"',
        "2. Nombre entier: age = 30",
        "3. Nombre décimal: taille = 1.75",
      ],
      code_template: `# Exercice 13: Types variés
# Créez: nom (texte), age (nombre), taille (décimal)
# Affichez chaque variable

`,
      solution: `nom = "Bob"
age = 30
taille = 1.75
print(nom)
print(age)
print(taille)`,
      tests: [{ input: "", expected_output: "Bob" }],
    },
    {
      id: "s1_e14",
      title: "Réassignation",
      description: "Modifier la valeur d'une variable",
      instruction: "Changez la valeur d'une variable et observez le résultat",
      help_steps: [
        "1. Créez une variable avec une valeur",
        "2. Affichez-la",
        "3. Changez sa valeur",
        "4. Affichez-la à nouveau",
      ],
      code_template: `# Exercice 14: Changer une variable
# Créez score = 10
# Affichez-le
# Changez score = 20
# Affichez-le à nouveau

`,
      solution: `score = 10
print(score)
score = 20
print(score)`,
      tests: [{ input: "", expected_output: "10" }],
    },
    {
      id: "s1_e15",
      title: "Noms de variables",
      description: "Utiliser des noms de variables descriptifs",
      instruction: "Créez des variables avec des noms clairs et descriptifs",
      help_steps: [
        "1. Utilisez des noms qui décrivent le contenu",
        "2. prix_produit au lieu de p",
        "3. Séparez les mots avec des underscore _",
      ],
      code_template: `# Exercice 15: Noms descriptifs
# Créez des variables avec des noms clairs:
# - prix d'un produit
# - quantité en stock
# - nom du produit
# Affichez-les

`,
      solution: `prix_produit = 19.99
quantite_stock = 50
nom_produit = "Ordinateur"
print(nom_produit)
print(prix_produit)
print(quantite_stock)`,
      tests: [{ input: "", expected_output: "Ordinateur" }],
    },
    {
      id: "s1_e16",
      title: "Variables avec underscore",
      description: "Convention de nommage Python avec _",
      instruction: "Respectez la convention snake_case de Python",
      help_steps: [
        "1. Python utilise la convention snake_case",
        "2. Mots séparés par des underscores _",
        "3. Tout en minuscules: premier_nom",
      ],
      code_template: `# Exercice 16: Convention snake_case
# Créez ces variables (respectez la convention):
# - premier nom
# - nom de famille
# - date de naissance
# Affichez-les

`,
      solution: `premier_nom = "Jean"
nom_de_famille = "Dupont"
date_de_naissance = "1990-01-01"
print(premier_nom)
print(nom_de_famille)
print(date_de_naissance)`,
      tests: [{ input: "", expected_output: "Jean" }],
    },
    {
      id: "s1_e17",
      title: "Copie de variables",
      description: "Copier la valeur d'une variable dans une autre",
      instruction: "Créez une variable et copiez sa valeur dans une autre",
      help_steps: [
        "1. Créez une variable originale",
        "2. Assignez sa valeur à une nouvelle variable",
        "3. Les deux variables auront la même valeur",
      ],
      code_template: `# Exercice 17: Copie de variables
# Créez original = "Python"
# Créez copie = original
# Affichez les deux

`,
      solution: `original = "Python"
copie = original
print(original)
print(copie)`,
      tests: [{ input: "", expected_output: "Python" }],
    },
    {
      id: "s1_e18",
      title: "Échange de variables",
      description: "Échanger les valeurs de deux variables",
      instruction: "Échangez les valeurs de deux variables en Python",
      help_steps: [
        "1. Python permet l'échange direct: a, b = b, a",
        "2. Créez deux variables avec des valeurs différentes",
        "3. Échangez leurs valeurs en une ligne",
      ],
      code_template: `# Exercice 18: Échange
# a = 5, b = 10
# Échangez leurs valeurs
# Affichez a et b après échange

`,
      solution: `a = 5
b = 10
a, b = b, a
print(a)
print(b)`,
      tests: [{ input: "", expected_output: "10" }],
    },
    {
      id: "s1_e19",
      title: "Variables constantes",
      description: "Convention pour les constantes (MAJUSCULES)",
      instruction: "Créez des constantes avec la convention Python",
      help_steps: [
        "1. Les constantes s'écrivent en MAJUSCULES",
        "2. Séparez les mots avec des underscores",
        "3. Exemple: PI = 3.14159",
      ],
      code_template: `# Exercice 19: Constantes
# Créez des constantes (convention MAJUSCULES):
# - PI = 3.14159
# - VITESSE_LUMIERE = 299792458
# Affichez-les

`,
      solution: `PI = 3.14159
VITESSE_LUMIERE = 299792458
print(PI)
print(VITESSE_LUMIERE)`,
      tests: [{ input: "", expected_output: "3.14159" }],
    },
    {
      id: "s1_e20",
      title: "Type d'une variable",
      description: "Utiliser type() pour connaître le type",
      instruction: "Découvrez le type de vos variables avec type()",
      help_steps: [
        "1. type(variable) retourne le type",
        "2. <class 'str'> = texte (string)",
        "3. <class 'int'> = nombre entier",
      ],
      code_template: `# Exercice 20: Fonction type()
# Créez: texte = "Hello", nombre = 42
# Affichez le type de chaque variable avec type()

`,
      solution: `texte = "Hello"
nombre = 42
print(type(texte))
print(type(nombre))`,
      tests: [{ input: "", expected_output: "<class 'str'>" }],
    },
    {
      id: "s1_e21",
      title: "Variables booléennes",
      description: "Créer des variables True/False",
      instruction: "Utilisez les valeurs booléennes True et False",
      help_steps: [
        "1. True = vrai (attention à la majuscule)",
        "2. False = faux (attention à la majuscule)",
        "3. Pas de guillemets pour les booléens",
      ],
      code_template: `# Exercice 21: Booléens
# Créez: est_majeur = True, a_permis = False
# Affichez-les

`,
      solution: `est_majeur = True
a_permis = False
print(est_majeur)
print(a_permis)`,
      tests: [{ input: "", expected_output: "True" }],
    },
    {
      id: "s1_e22",
      title: "Variable None",
      description: "Utiliser None pour une valeur vide",
      instruction: "Découvrez la valeur spéciale None de Python",
      help_steps: [
        "1. None représente l'absence de valeur",
        "2. C'est différent de 0 ou d'une chaîne vide",
        "3. Utilisé quand on n'a pas encore de valeur",
      ],
      code_template: `# Exercice 22: Valeur None
# Créez: resultat = None
# Affichez-la et son type

`,
      solution: `resultat = None
print(resultat)
print(type(resultat))`,
      tests: [{ input: "", expected_output: "None" }],
    },
    {
      id: "s1_e23",
      title: "Variables globales",
      description: "Créer des variables au niveau global",
      instruction: "Créez plusieurs variables globales pour votre application",
      help_steps: [
        "1. Variables créées au niveau principal du script",
        "2. Accessibles partout dans le programme",
        "3. Utilisez des noms descriptifs",
      ],
      code_template: `# Exercice 23: Variables globales
# Créez plusieurs variables globales:
# - APPLICATION_NAME = "MonApp"
# - VERSION = "1.0"
# - AUTHOR = "VotreNom"
# Affichez-les

`,
      solution: `APPLICATION_NAME = "MonApp"
VERSION = "1.0"
AUTHOR = "Alice"
print(APPLICATION_NAME)
print(VERSION)
print(AUTHOR)`,
      tests: [{ input: "", expected_output: "MonApp" }],
    },
    {
      id: "s1_e24",
      title: "Affectation multiple",
      description: "Assigner plusieurs variables en une ligne",
      instruction: "Créez plusieurs variables en une seule ligne",
      help_steps: [
        "1. x, y, z = 1, 2, 3",
        "2. Les valeurs sont assignées dans l'ordre",
        "3. Pratique pour initialiser plusieurs variables",
      ],
      code_template: `# Exercice 24: Affectation multiple
# En une seule ligne, créez:
# x = 1, y = 2, z = 3
# Affichez-les

`,
      solution: `x, y, z = 1, 2, 3
print(x)
print(y)
print(z)`,
      tests: [{ input: "", expected_output: "1" }],
    },
    {
      id: "s1_e25",
      title: "Même valeur multiple",
      description: "Assigner la même valeur à plusieurs variables",
      instruction: "Donnez la même valeur à plusieurs variables simultanément",
      help_steps: [
        "1. a = b = c = valeur",
        "2. Toutes les variables auront la même valeur",
        "3. Pratique pour l'initialisation",
      ],
      code_template: `# Exercice 25: Même valeur
# Assignez la valeur 0 à trois variables: a, b, c
# En une seule ligne
# Affichez-les

`,
      solution: `a = b = c = 0
print(a)
print(b)
print(c)`,
      tests: [{ input: "", expected_output: "0" }],
    },
  ];

addExercises("python", exercises);
