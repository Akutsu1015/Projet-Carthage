import { addExercises } from ".";
import type { Exercise } from "@/app/exercises/[module]/exercise-client";

// @ts-nocheck — Auto-converted from exercises-part2.js
const exercises: Exercise[] = [
    // === CHAÎNES DE CARACTÈRES (26-40) ===
    {
      id: "s1_e26",
      title: "Longueur d'une chaîne",
      description: "Utiliser len() pour la longueur",
      instruction:
        "Calculez et affichez la longueur d'une chaîne de caractères",
      help_steps: [
        "1. len(chaine) retourne le nombre de caractères",
        "2. Les espaces comptent comme des caractères",
        "3. print(len(message)) pour afficher",
      ],
      code_template: `# Exercice 26: Longueur avec len()
# Créez: message = "Python est génial"
# Affichez sa longueur avec len()

`,
      solution: `message = "Python est génial"
print(len(message))`,
      tests: [{ input: "", expected_output: "18" }],
    },
    {
      id: "s1_e27",
      title: "Accès aux caractères",
      description: "Accéder à un caractère par son index",
      instruction: "Accédez au premier et dernier caractère d'un mot",
      help_steps: [
        "1. mot[0] = premier caractère (index 0)",
        "2. mot[-1] = dernier caractère",
        "3. Les index négatifs comptent depuis la fin",
      ],
      code_template: `# Exercice 27: Index des caractères
# mot = "Python"
# Affichez le premier caractère (index 0)
# Affichez le dernier caractère (index -1)

`,
      solution: `mot = "Python"
print(mot[0])
print(mot[-1])`,
      tests: [{ input: "", expected_output: "P" }],
    },
    {
      id: "s1_e28",
      title: "Tranches de chaînes",
      description: "Extraire une partie d'une chaîne",
      instruction: "Découpez une phrase en plusieurs parties",
      help_steps: [
        "1. phrase[:7] = du début au 7e caractère",
        "2. phrase[8:] = du 8e caractère à la fin",
        "3. Les tranches (slicing) permettent d'extraire des portions",
      ],
      code_template: `# Exercice 28: Slicing
# phrase = "Bonjour tout le monde"
# Affichez les 7 premiers caractères
# Affichez du 8e caractère à la fin

`,
      solution: `phrase = "Bonjour tout le monde"
print(phrase[:7])
print(phrase[8:])`,
      tests: [{ input: "", expected_output: "Bonjour" }],
    },
    {
      id: "s1_e29",
      title: "Concaténation",
      description: "Joindre des chaînes avec +",
      instruction: "Assemblez plusieurs chaînes pour former un nom complet",
      help_steps: [
        "1. + joint les chaînes ensemble",
        '2. N\'oubliez pas les espaces : " "',
        '3. prenom + " " + nom',
      ],
      code_template: `# Exercice 29: Concaténation
# prenom = "Alice", nom = "Martin"
# Créez nom_complet = prenom + " " + nom
# Affichez nom_complet

`,
      solution: `prenom = "Alice"
nom = "Martin"
nom_complet = prenom + " " + nom
print(nom_complet)`,
      tests: [{ input: "", expected_output: "Alice Martin" }],
    },
    {
      id: "s1_e30",
      title: "Répétition de chaînes",
      description: "Répéter une chaîne avec *",
      instruction: "Créez un rire en répétant un motif",
      help_steps: [
        "1. * répète une chaîne plusieurs fois",
        '2. "Ha" * 5 = "HaHaHaHaHa"',
        "3. Utile pour créer des motifs",
      ],
      code_template: `# Exercice 30: Répétition
# motif = "Ha"
# Créez rire = motif répété 5 fois
# Affichez rire

`,
      solution: `motif = "Ha"
rire = motif * 5
print(rire)`,
      tests: [{ input: "", expected_output: "HaHaHaHaHa" }],
    },
    {
      id: "s1_e31",
      title: "Majuscules et minuscules",
      description: "Utiliser upper() et lower()",
      instruction: "Convertissez un texte en majuscules et minuscules",
      help_steps: [
        "1. .upper() convertit en MAJUSCULES",
        "2. .lower() convertit en minuscules",
        "3. Les méthodes se placent après la variable",
      ],
      code_template: `# Exercice 31: Casse
# texte = "Python"
# Affichez en majuscules avec upper()
# Affichez en minuscules avec lower()

`,
      solution: `texte = "Python"
print(texte.upper())
print(texte.lower())`,
      tests: [{ input: "", expected_output: "PYTHON" }],
    },
    {
      id: "s1_e32",
      title: "Capitalisation",
      description: "Utiliser capitalize() et title()",
      instruction: "Appliquez différents styles de capitalisation",
      help_steps: [
        "1. .capitalize() met la 1ère lettre en majuscule",
        "2. .title() met chaque mot en majuscule",
        "3. Utile pour formatter des noms",
      ],
      code_template: `# Exercice 32: Capitalisation
# phrase = "bonjour le monde"
# Affichez avec capitalize() (1ère lettre majuscule)
# Affichez avec title() (chaque mot commence par majuscule)

`,
      solution: `phrase = "bonjour le monde"
print(phrase.capitalize())
print(phrase.title())`,
      tests: [{ input: "", expected_output: "Bonjour le monde" }],
    },
    {
      id: "s1_e33",
      title: "Recherche dans une chaîne",
      description: "Utiliser in pour vérifier la présence",
      instruction:
        "Vérifiez si certains caractères sont présents dans un email",
      help_steps: [
        '1. "@" in email retourne True ou False',
        "2. in vérifie la présence d'une sous-chaîne",
        "3. Sensible à la casse",
      ],
      code_template: `# Exercice 33: Recherche
# email = "alice@example.com"
# Vérifiez si "@" est dans email
# Vérifiez si "gmail" est dans email

`,
      solution: `email = "alice@example.com"
print("@" in email)
print("gmail" in email)`,
      tests: [{ input: "", expected_output: "True" }],
    },
    {
      id: "s1_e34",
      title: "Remplacement",
      description: "Utiliser replace() pour remplacer du texte",
      instruction: "Remplacez un mot dans une phrase",
      help_steps: [
        '1. .replace("ancien", "nouveau")',
        "2. Remplace toutes les occurrences",
        "3. N'affecte pas la chaîne originale",
      ],
      code_template: `# Exercice 34: Remplacement
# phrase = "J'aime les pommes"
# Remplacez "pommes" par "oranges"
# Affichez le résultat

`,
      solution: `phrase = "J'aime les pommes"
nouvelle_phrase = phrase.replace("pommes", "oranges")
print(nouvelle_phrase)`,
      tests: [{ input: "", expected_output: "J'aime les oranges" }],
    },
    {
      id: "s1_e35",
      title: "Suppression d'espaces",
      description: "Utiliser strip() pour supprimer les espaces",
      instruction: "Nettoyez une chaîne en supprimant les espaces inutiles",
      help_steps: [
        "1. .strip() supprime les espaces au début et à la fin",
        "2. N'affecte pas les espaces à l'intérieur",
        "3. Utile pour nettoyer les saisies utilisateur",
      ],
      code_template: `# Exercice 35: Strip
# texte = "  Python  "
# Supprimez les espaces au début et à la fin
# Affichez le résultat entre guillemets

`,
      solution: `texte = "  Python  "
texte_propre = texte.strip()
print('"' + texte_propre + '"')`,
      tests: [{ input: "", expected_output: '"Python"' }],
    },
    {
      id: "s1_e36",
      title: "Division d'une chaîne",
      description: "Utiliser split() pour diviser",
      instruction: "Séparez une liste de couleurs",
      help_steps: [
        '1. .split(",") divise sur les virgules',
        "2. Retourne une liste d'éléments",
        "3. Chaque partie devient un élément séparé",
      ],
      code_template: `# Exercice 36: Split
# phrase = "rouge,vert,bleu"
# Divisez par les virgules avec split()
# Affichez le résultat

`,
      solution: `phrase = "rouge,vert,bleu"
couleurs = phrase.split(",")
print(couleurs)`,
      tests: [{ input: "", expected_output: "['rouge', 'vert', 'bleu']" }],
    },
    {
      id: "s1_e37",
      title: "Joindre des éléments",
      description: "Utiliser join() pour assembler",
      instruction: "Assemblez une liste de mots en phrase",
      help_steps: [
        '1. " ".join(liste) joint avec des espaces',
        "2. Le séparateur vient avant .join()",
        "3. Inverse de split()",
      ],
      code_template: `# Exercice 37: Join
# mots = ["Python", "est", "formidable"]
# Joignez-les avec des espaces
# Affichez le résultat

`,
      solution: `mots = ["Python", "est", "formidable"]
phrase = " ".join(mots)
print(phrase)`,
      tests: [{ input: "", expected_output: "Python est formidable" }],
    },
    {
      id: "s1_e38",
      title: "Formatage avec format()",
      description: "Utiliser la méthode format()",
      instruction: "Créez un message formaté avec des variables",
      help_steps: [
        "1. {} sont des espaces réservés",
        "2. .format(var1, var2) remplit les {}",
        "3. L'ordre des variables compte",
      ],
      code_template: `# Exercice 38: Format()
# nom = "Alice", age = 25
# Utilisez format() pour afficher:
# "Je suis Alice et j'ai 25 ans"

`,
      solution: `nom = "Alice"
age = 25
message = "Je suis {} et j'ai {} ans".format(nom, age)
print(message)`,
      tests: [{ input: "", expected_output: "Je suis Alice et j'ai 25 ans" }],
    },
    {
      id: "s1_e39",
      title: "F-strings",
      description: "Utiliser les f-strings pour le formatage",
      instruction: "Utilisez la syntaxe moderne f-string",
      help_steps: [
        '1. f"texte {variable}" (f devant les guillemets)',
        "2. Variables directement dans les {}",
        "3. Plus lisible que format()",
      ],
      code_template: `# Exercice 39: F-strings
# produit = "ordinateur", prix = 599.99
# Utilisez f-string pour afficher:
# "Le ordinateur coûte 599.99€"

`,
      solution: `produit = "ordinateur"
prix = 599.99
message = f"Le {produit} coûte {prix}€"
print(message)`,
      tests: [{ input: "", expected_output: "Le ordinateur coûte 599.99€" }],
    },
    {
      id: "s1_e40",
      title: "Caractères spéciaux",
      description: "Utiliser les séquences d'échappement",
      instruction: "Affichez du texte contenant des guillemets",
      help_steps: [
        "1. Utilisez des guillemets simples pour entourer les doubles",
        '2. Ou utilisez \\" pour échapper',
        "3. Choisissez la méthode la plus lisible",
      ],
      code_template: `# Exercice 40: Échappement
# Affichez: Il a dit: "Python est génial!"
# Utilisez les bons caractères d'échappement

`,
      solution: `print('Il a dit: "Python est génial!"')`,
      tests: [{ input: "", expected_output: 'Il a dit: "Python est génial!"' }],
    },

    // === OPÉRATIONS ARITHMÉTIQUES (41-50) ===
    {
      id: "s1_e41",
      title: "Opérations de base",
      description: "Addition, soustraction, multiplication, division",
      instruction: "Effectuez les quatre opérations arithmétiques de base",
      help_steps: [
        "1. + pour addition",
        "2. - pour soustraction",
        "3. * pour multiplication",
        "4. / pour division",
      ],
      code_template: `# Exercice 41: Opérations arithmétiques
# a = 10, b = 3
# Calculez et affichez: a+b, a-b, a*b, a/b

`,
      solution: `a = 10
b = 3
print(a + b)
print(a - b)
print(a * b)
print(a / b)`,
      tests: [{ input: "", expected_output: "13" }],
    },
    {
      id: "s1_e42",
      title: "Division entière et modulo",
      description: "Utiliser // et % pour division entière et reste",
      instruction: "Découvrez la division entière et le modulo",
      help_steps: [
        "1. // donne la partie entière de la division",
        "2. % donne le reste de la division",
        "3. 17 // 5 = 3, 17 % 5 = 2",
      ],
      code_template: `# Exercice 42: Division spéciale
# a = 17, b = 5
# Calculez division entière (//) et modulo (%)
# Affichez les résultats

`,
      solution: `a = 17
b = 5
print(a // b)
print(a % b)`,
      tests: [{ input: "", expected_output: "3" }],
    },
    {
      id: "s1_e43",
      title: "Puissance",
      description: "Utiliser ** pour l'exponentiation",
      instruction: "Calculez des puissances avec l'opérateur **",
      help_steps: [
        "1. ** est l'opérateur de puissance",
        "2. 2 ** 8 = 2 à la puissance 8",
        "3. Plus rapide que multiplier plusieurs fois",
      ],
      code_template: `# Exercice 43: Puissance
# Calculez 2 puissance 8
# Calculez 3 puissance 4
# Affichez les résultats

`,
      solution: `print(2 ** 8)
print(3 ** 4)`,
      tests: [{ input: "", expected_output: "256" }],
    },
    {
      id: "s1_e44",
      title: "Ordre des opérations",
      description: "Comprendre la priorité des opérateurs",
      instruction: "Observez l'effet des parenthèses sur les calculs",
      help_steps: [
        "1. Multiplication avant addition (priorité)",
        "2. Parenthèses changent l'ordre",
        "3. (2 + 3) se calcule d'abord",
      ],
      code_template: `# Exercice 44: Priorité
# Calculez: 2 + 3 * 4
# Calculez: (2 + 3) * 4
# Observez la différence

`,
      solution: `print(2 + 3 * 4)
print((2 + 3) * 4)`,
      tests: [{ input: "", expected_output: "14" }],
    },
    {
      id: "s1_e45",
      title: "Nombres flottants",
      description: "Travailler avec les décimaux",
      instruction: "Effectuez des calculs avec des nombres décimaux",
      help_steps: [
        "1. Les nombres avec points sont des float",
        "2. 3.14 + 2.7 = calcul avec décimales",
        "3. Résultat peut avoir plusieurs décimales",
      ],
      code_template: `# Exercice 45: Nombres décimaux
# a = 3.14, b = 2.7
# Calculez leur somme, différence, produit

`,
      solution: `a = 3.14
b = 2.7
print(a + b)
print(a - b)
print(a * b)`,
      tests: [{ input: "", expected_output: "5.84" }],
    },
    {
      id: "s1_e46",
      title: "Conversion de types",
      description: "Convertir entre int, float, str",
      instruction: "Convertissez des données d'un type à l'autre",
      help_steps: [
        "1. int() convertit en nombre entier",
        "2. float() convertit en nombre décimal",
        "3. str() convertit en texte",
      ],
      code_template: `# Exercice 46: Conversion
# texte = "42"
# Convertissez en entier puis en flottant
# Affichez les types avec type()

`,
      solution: `texte = "42"
entier = int(texte)
flottant = float(texte)
print(entier)
print(flottant)
print(type(entier))`,
      tests: [{ input: "", expected_output: "42" }],
    },
    {
      id: "s1_e47",
      title: "Arrondi",
      description: "Utiliser round() pour arrondir",
      instruction: "Arrondissez un nombre décimal",
      help_steps: [
        "1. round(nombre) arrondit à l'entier le plus proche",
        "2. round(nombre, 2) arrondit à 2 décimales",
        "3. Utile pour l'affichage de prix",
      ],
      code_template: `# Exercice 47: Arrondi
# nombre = 3.14159
# Arrondissez à 2 décimales
# Arrondissez à l'entier le plus proche

`,
      solution: `nombre = 3.14159
print(round(nombre, 2))
print(round(nombre))`,
      tests: [{ input: "", expected_output: "3.14" }],
    },
    {
      id: "s1_e48",
      title: "Valeur absolue",
      description: "Utiliser abs() pour la valeur absolue",
      instruction: "Calculez la valeur absolue de nombres",
      help_steps: [
        "1. abs() supprime le signe négatif",
        "2. abs(-15) = 15",
        "3. abs(10) = 10 (déjà positif)",
      ],
      code_template: `# Exercice 48: Valeur absolue
# negatif = -15
# positif = 10
# Affichez leurs valeurs absolues

`,
      solution: `negatif = -15
positif = 10
print(abs(negatif))
print(abs(positif))`,
      tests: [{ input: "", expected_output: "15" }],
    },
    {
      id: "s1_e49",
      title: "Min et Max",
      description: "Utiliser min() et max()",
      instruction: "Trouvez le minimum et maximum d'une série de nombres",
      help_steps: [
        "1. min() trouve la plus petite valeur",
        "2. max() trouve la plus grande valeur",
        "3. Peut prendre plusieurs arguments",
      ],
      code_template: `# Exercice 49: Min/Max
# Trouvez le minimum et maximum de: 5, 12, 3, 18, 7
# Utilisez min() et max()

`,
      solution: `print(min(5, 12, 3, 18, 7))
print(max(5, 12, 3, 18, 7))`,
      tests: [{ input: "", expected_output: "3" }],
    },
    {
      id: "s1_e50",
      title: "Somme et moyenne",
      description: "Calculer somme et moyenne",
      instruction: "Calculez la somme et la moyenne de notes",
      help_steps: [
        "1. sum(liste) additionne tous les éléments",
        "2. len(liste) compte les éléments",
        "3. moyenne = somme / nombre d'éléments",
      ],
      code_template: `# Exercice 50: Statistiques
# notes = [15, 18, 12, 16]
# Calculez la somme avec sum()
# Calculez la moyenne

`,
      solution: `notes = [15, 18, 12, 16]
total = sum(notes)
moyenne = total / len(notes)
print(total)
print(moyenne)`,
      tests: [{ input: "", expected_output: "61" }],
    },
  ];

addExercises("python", exercises);
