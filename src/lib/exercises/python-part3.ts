import { addExercises } from ".";
import type { Exercise } from "@/app/exercises/[module]/exercise-client";

// @ts-nocheck — Auto-converted from exercises-part3.js
const exercises: Exercise[] = [
    // === BOOLÉENS ET COMPARAISONS (51-65) ===
    {
      id: "s1_e51",
      title: "Comparaisons de base",
      description: "Utiliser ==, !=, <, >, <=, >=",
      instruction: "Comparez deux nombres avec tous les opérateurs disponibles",
      help_steps: [
        "1. == teste l'égalité",
        "2. != teste la différence",
        "3. < > <= >= comparent les valeurs",
        "4. Résultat = True ou False",
      ],
      code_template: `# Exercice 51: Comparaisons
# a = 10, b = 20
# Testez toutes les comparaisons possibles

`,
      solution: `a = 10
b = 20
print(a == b)
print(a != b)
print(a < b)
print(a > b)`,
      tests: [{ input: "", expected_output: "False" }],
    },
    {
      id: "s1_e52",
      title: "Opérateurs logiques",
      description: "Utiliser and, or, not",
      instruction:
        "Combinez des valeurs booléennes avec les opérateurs logiques",
      help_steps: [
        "1. and = ET logique (les deux doivent être vrais)",
        "2. or = OU logique (au moins un doit être vrai)",
        "3. not = NON logique (inverse la valeur)",
      ],
      code_template: `# Exercice 52: Logique
# a = True, b = False
# Testez: a and b, a or b, not a

`,
      solution: `a = True
b = False
print(a and b)
print(a or b)
print(not a)`,
      tests: [{ input: "", expected_output: "False" }],
    },
    {
      id: "s1_e53",
      title: "Conditions complexes",
      description: "Combiner plusieurs conditions",
      instruction: "Créez une condition complexe avec plusieurs critères",
      help_steps: [
        "1. Combinez avec and/or",
        "2. age >= 18 and salaire >= 2000",
        "3. Les deux conditions doivent être vraies",
      ],
      code_template: `# Exercice 53: Conditions multiples
# age = 25, salaire = 3000
# Vérifiez si age >= 18 AND salaire >= 2000

`,
      solution: `age = 25
salaire = 3000
resultat = age >= 18 and salaire >= 2000
print(resultat)`,
      tests: [{ input: "", expected_output: "True" }],
    },
    {
      id: "s1_e54",
      title: "Appartenance",
      description: "Utiliser in et not in",
      instruction: "Vérifiez la présence d'un élément dans une collection",
      help_steps: [
        "1. in vérifie si un élément est présent",
        "2. not in vérifie l'absence",
        "3. Fonctionne avec chaînes, listes, etc.",
      ],
      code_template: `# Exercice 54: Appartenance
# voyelles = "aeiou"
# lettre = "e"
# Vérifiez si lettre est dans voyelles

`,
      solution: `voyelles = "aeiou"
lettre = "e"
print(lettre in voyelles)
print(lettre not in voyelles)`,
      tests: [{ input: "", expected_output: "True" }],
    },
    {
      id: "s1_e55",
      title: "Comparaison de chaînes",
      description: "Comparer des textes",
      instruction: "Comparez des mots par ordre alphabétique",
      help_steps: [
        "1. Python compare l'ordre alphabétique",
        '2. "a" < "b" est True',
        "3. Sensible à la casse (majuscules < minuscules)",
      ],
      code_template: `# Exercice 55: Comparaison texte
# mot1 = "chat", mot2 = "chien"
# Comparez-les avec ==, <, >

`,
      solution: `mot1 = "chat"
mot2 = "chien"
print(mot1 == mot2)
print(mot1 < mot2)
print(mot1 > mot2)`,
      tests: [{ input: "", expected_output: "False" }],
    },

    // === LISTES DE BASE (56-75) ===
    {
      id: "s1_e56",
      title: "Création de listes",
      description: "Créer différents types de listes",
      instruction: "Créez plusieurs listes avec différents types de données",
      help_steps: [
        "1. [élément1, élément2, élément3]",
        "2. Peut contenir des textes, nombres, etc.",
        "3. Les éléments sont séparés par des virgules",
      ],
      code_template: `# Exercice 56: Listes
# Créez une liste de fruits
# Créez une liste de nombres
# Affichez-les

`,
      solution: `fruits = ["pomme", "banane", "orange"]
nombres = [1, 2, 3, 4, 5]
print(fruits)
print(nombres)`,
      tests: [{ input: "", expected_output: "['pomme', 'banane', 'orange']" }],
    },
    {
      id: "s1_e57",
      title: "Accès aux éléments",
      description: "Accéder aux éléments d'une liste",
      instruction: "Affichez différents éléments d'une liste par leur index",
      help_steps: [
        "1. liste[0] = premier élément",
        "2. liste[1] = deuxième élément",
        "3. liste[-1] = dernier élément",
      ],
      code_template: `# Exercice 57: Accès
# couleurs = ["rouge", "vert", "bleu"]
# Affichez le premier, deuxième et dernier élément

`,
      solution: `couleurs = ["rouge", "vert", "bleu"]
print(couleurs[0])
print(couleurs[1])
print(couleurs[-1])`,
      tests: [{ input: "", expected_output: "rouge" }],
    },
    {
      id: "s1_e58",
      title: "Modification d'éléments",
      description: "Changer la valeur d'un élément",
      instruction: "Modifiez un élément spécifique de la liste",
      help_steps: [
        "1. liste[index] = nouvelle_valeur",
        "2. L'élément à cet index est remplacé",
        "3. La liste est modifiée en place",
      ],
      code_template: `# Exercice 58: Modification
# animaux = ["chat", "chien", "poisson"]
# Changez "poisson" en "oiseau"
# Affichez la liste

`,
      solution: `animaux = ["chat", "chien", "poisson"]
animaux[2] = "oiseau"
print(animaux)`,
      tests: [{ input: "", expected_output: "['chat', 'chien', 'oiseau']" }],
    },
    {
      id: "s1_e59",
      title: "Ajout d'éléments",
      description: "Ajouter des éléments avec append()",
      instruction: "Ajoutez de nouveaux éléments à une liste existante",
      help_steps: [
        "1. .append(élément) ajoute à la fin",
        "2. La liste grandit d'un élément",
        "3. Modifie la liste originale",
      ],
      code_template: `# Exercice 59: Ajout
# langages = ["Python", "Java"]
# Ajoutez "JavaScript" avec append()
# Affichez la liste

`,
      solution: `langages = ["Python", "Java"]
langages.append("JavaScript")
print(langages)`,
      tests: [
        { input: "", expected_output: "['Python', 'Java', 'JavaScript']" },
      ],
    },
    {
      id: "s1_e60",
      title: "Suppression d'éléments",
      description: "Supprimer des éléments avec remove()",
      instruction: "Retirez un élément spécifique de la liste",
      help_steps: [
        "1. .remove(élément) supprime la première occurrence",
        "2. L'élément doit exister dans la liste",
        "3. La liste devient plus petite",
      ],
      code_template: `# Exercice 60: Suppression
# nombres = [1, 2, 3, 2, 4]
# Supprimez le premier 2 avec remove()
# Affichez la liste

`,
      solution: `nombres = [1, 2, 3, 2, 4]
nombres.remove(2)
print(nombres)`,
      tests: [{ input: "", expected_output: "[1, 3, 2, 4]" }],
    },
    {
      id: "s1_e61",
      title: "Longueur d'une liste",
      description: "Utiliser len() sur une liste",
      instruction: "Comptez le nombre d'éléments dans une liste",
      help_steps: [
        "1. len(liste) retourne le nombre d'éléments",
        "2. Utile pour savoir la taille",
        "3. Fonctionne avec tous les types de collections",
      ],
      code_template: `# Exercice 61: Longueur
# courses = ["pain", "lait", "œufs", "beurre"]
# Affichez le nombre d'articles avec len()

`,
      solution: `courses = ["pain", "lait", "œufs", "beurre"]
print(len(courses))`,
      tests: [{ input: "", expected_output: "4" }],
    },
    {
      id: "s1_e62",
      title: "Concaténation de listes",
      description: "Joindre des listes avec +",
      instruction: "Combinez plusieurs listes en une seule",
      help_steps: [
        "1. liste1 + liste2 joint les listes",
        "2. Crée une nouvelle liste",
        "3. Les listes originales ne changent pas",
      ],
      code_template: `# Exercice 62: Concaténation
# partie1 = [1, 2, 3]
# partie2 = [4, 5, 6]
# Créez complete = partie1 + partie2

`,
      solution: `partie1 = [1, 2, 3]
partie2 = [4, 5, 6]
complete = partie1 + partie2
print(complete)`,
      tests: [{ input: "", expected_output: "[1, 2, 3, 4, 5, 6]" }],
    },
    {
      id: "s1_e63",
      title: "Répétition de listes",
      description: "Répéter une liste avec *",
      instruction: "Créez une liste répétée plusieurs fois",
      help_steps: [
        "1. liste * n répète la liste n fois",
        "2. [0] * 5 = [0, 0, 0, 0, 0]",
        "3. Utile pour initialiser",
      ],
      code_template: `# Exercice 63: Répétition
# motif = ["a", "b"]
# Créez répété = motif répété 3 fois

`,
      solution: `motif = ["a", "b"]
repete = motif * 3
print(repete)`,
      tests: [{ input: "", expected_output: "['a', 'b', 'a', 'b', 'a', 'b']" }],
    },
    {
      id: "s1_e64",
      title: "Tranches de listes",
      description: "Extraire des portions de liste",
      instruction: "Utilisez le slicing pour extraire des parties",
      help_steps: [
        "1. liste[1:4] = éléments 1 à 3",
        "2. liste[:3] = du début à l'index 3",
        "3. liste[2:] = de l'index 2 à la fin",
      ],
      code_template: `# Exercice 64: Slicing de listes
# nombres = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
# Affichez les éléments 2 à 5
# Affichez les 3 premiers
# Affichez les 3 derniers

`,
      solution: `nombres = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
print(nombres[2:6])
print(nombres[:3])
print(nombres[-3:])`,
      tests: [{ input: "", expected_output: "[2, 3, 4, 5]" }],
    },
    {
      id: "s1_e65",
      title: "Recherche dans une liste",
      description: "Vérifier la présence avec in",
      instruction: "Cherchez si un élément existe dans une liste",
      help_steps: [
        "1. élément in liste retourne True/False",
        "2. Recherche la première occurrence",
        "3. Fonctionne avec tous types d'éléments",
      ],
      code_template: `# Exercice 65: Recherche
# inventaire = ["clés", "téléphone", "portefeuille"]
# Vérifiez si "téléphone" est dans l'inventaire
# Vérifiez si "lunettes" est dans l'inventaire

`,
      solution: `inventaire = ["clés", "téléphone", "portefeuille"]
print("téléphone" in inventaire)
print("lunettes" in inventaire)`,
      tests: [{ input: "", expected_output: "True" }],
    },
    {
      id: "s1_e66",
      title: "Index d'un élément",
      description: "Trouver la position avec index()",
      instruction: "Trouvez l'index d'un élément dans la liste",
      help_steps: [
        "1. .index(élément) retourne la position",
        "2. Commence à compter de 0",
        "3. Erreur si l'élément n'existe pas",
      ],
      code_template: `# Exercice 66: Index
# alphabet = ["a", "b", "c", "d", "e"]
# Trouvez l'index de "c"
# Trouvez l'index de "e"

`,
      solution: `alphabet = ["a", "b", "c", "d", "e"]
print(alphabet.index("c"))
print(alphabet.index("e"))`,
      tests: [{ input: "", expected_output: "2" }],
    },
    {
      id: "s1_e67",
      title: "Compter les occurrences",
      description: "Utiliser count() pour compter",
      instruction: "Comptez combien de fois un élément apparaît",
      help_steps: [
        "1. .count(élément) compte les occurrences",
        "2. Retourne 0 si l'élément n'existe pas",
        "3. Utile pour analyser les données",
      ],
      code_template: `# Exercice 67: Compter
# lettres = ["a", "b", "a", "c", "a", "b"]
# Comptez combien de "a"
# Comptez combien de "b"

`,
      solution: `lettres = ["a", "b", "a", "c", "a", "b"]
print(lettres.count("a"))
print(lettres.count("b"))`,
      tests: [{ input: "", expected_output: "3" }],
    },
    {
      id: "s1_e68",
      title: "Inverser une liste",
      description: "Utiliser reverse() pour inverser",
      instruction: "Inversez l'ordre des éléments dans une liste",
      help_steps: [
        "1. .reverse() inverse la liste en place",
        "2. Le premier devient le dernier",
        "3. Modifie la liste originale",
      ],
      code_template: `# Exercice 68: Inversion
# sequence = [1, 2, 3, 4, 5]
# Inversez la liste avec reverse()
# Affichez le résultat

`,
      solution: `sequence = [1, 2, 3, 4, 5]
sequence.reverse()
print(sequence)`,
      tests: [{ input: "", expected_output: "[5, 4, 3, 2, 1]" }],
    },
    {
      id: "s1_e69",
      title: "Trier une liste",
      description: "Utiliser sort() pour trier",
      instruction: "Triez une liste par ordre croissant",
      help_steps: [
        "1. .sort() trie par ordre croissant",
        "2. Modifie la liste en place",
        "3. Fonctionne avec nombres et textes",
      ],
      code_template: `# Exercice 69: Tri
# desordonne = [3, 1, 4, 1, 5, 9, 2]
# Triez la liste avec sort()
# Affichez le résultat

`,
      solution: `desordonne = [3, 1, 4, 1, 5, 9, 2]
desordonne.sort()
print(desordonne)`,
      tests: [{ input: "", expected_output: "[1, 1, 2, 3, 4, 5, 9]" }],
    },
    {
      id: "s1_e70",
      title: "Copie de liste",
      description: "Créer une copie avec copy()",
      instruction: "Créez une copie indépendante d'une liste",
      help_steps: [
        "1. .copy() crée une nouvelle liste",
        "2. Les modifications n'affectent pas l'originale",
        "3. Important pour éviter les effets de bord",
      ],
      code_template: `# Exercice 70: Copie
# original = ["rouge", "vert", "bleu"]
# Créez copie = original.copy()
# Modifiez copie[0] = "jaune"
# Affichez les deux listes

`,
      solution: `original = ["rouge", "vert", "bleu"]
copie = original.copy()
copie[0] = "jaune"
print(original)
print(copie)`,
      tests: [{ input: "", expected_output: "['rouge', 'vert', 'bleu']" }],
    },
    {
      id: "s1_e71",
      title: "Liste vide",
      description: "Créer et manipuler une liste vide",
      instruction: "Commencez avec une liste vide et ajoutez des éléments",
      help_steps: [
        "1. [] crée une liste vide",
        "2. .append() pour ajouter des éléments",
        "3. La liste grandit au fur et à mesure",
      ],
      code_template: `# Exercice 71: Liste vide
# Créez panier = []
# Ajoutez "pain", "lait", "œufs"
# Affichez le panier final

`,
      solution: `panier = []
panier.append("pain")
panier.append("lait")
panier.append("œufs")
print(panier)`,
      tests: [{ input: "", expected_output: "['pain', 'lait', 'œufs']" }],
    },
    {
      id: "s1_e72",
      title: "Insertion à une position",
      description: "Utiliser insert() pour insérer",
      instruction: "Insérez un élément à une position spécifique",
      help_steps: [
        "1. .insert(index, élément)",
        "2. L'élément est inséré à la position donnée",
        "3. Les autres éléments sont décalés",
      ],
      code_template: `# Exercice 72: Insertion
# liste = ["a", "c", "d"]
# Insérez "b" à l'index 1
# Affichez la liste

`,
      solution: `liste = ["a", "c", "d"]
liste.insert(1, "b")
print(liste)`,
      tests: [{ input: "", expected_output: "['a', 'b', 'c', 'd']" }],
    },
    {
      id: "s1_e73",
      title: "Suppression par index",
      description: "Utiliser pop() pour supprimer",
      instruction: "Supprimez un élément par sa position",
      help_steps: [
        "1. .pop(index) supprime et retourne l'élément",
        "2. .pop() sans argument supprime le dernier",
        "3. Utile pour récupérer l'élément supprimé",
      ],
      code_template: `# Exercice 73: Pop
# stack = ["premier", "deuxième", "troisième"]
# Supprimez le dernier élément avec pop()
# Affichez l'élément supprimé et la liste

`,
      solution: `stack = ["premier", "deuxième", "troisième"]
supprime = stack.pop()
print(supprime)
print(stack)`,
      tests: [{ input: "", expected_output: "troisième" }],
    },
    {
      id: "s1_e74",
      title: "Extension de liste",
      description: "Utiliser extend() pour ajouter plusieurs éléments",
      instruction: "Ajoutez plusieurs éléments d'un coup à une liste",
      help_steps: [
        "1. .extend(autre_liste) ajoute tous les éléments",
        "2. Différent de .append() qui ajoute un élément",
        "3. Plus efficace que plusieurs .append()",
      ],
      code_template: `# Exercice 74: Extension
# base = [1, 2, 3]
# extension = [4, 5, 6]
# Étendez base avec extension
# Affichez base

`,
      solution: `base = [1, 2, 3]
extension = [4, 5, 6]
base.extend(extension)
print(base)`,
      tests: [{ input: "", expected_output: "[1, 2, 3, 4, 5, 6]" }],
    },
    {
      id: "s1_e75",
      title: "Vider une liste",
      description: "Utiliser clear() pour vider",
      instruction: "Supprimez tous les éléments d'une liste",
      help_steps: [
        "1. .clear() supprime tous les éléments",
        "2. La liste devient vide []",
        "3. Plus rapide que del liste[:]",
      ],
      code_template: `# Exercice 75: Vider
# donnees = ["a", "b", "c", "d", "e"]
# Videz la liste avec clear()
# Affichez la liste et sa longueur

`,
      solution: `donnees = ["a", "b", "c", "d", "e"]
donnees.clear()
print(donnees)
print(len(donnees))`,
      tests: [{ input: "", expected_output: "[]" }],
    },
  ];

addExercises("python", exercises);
