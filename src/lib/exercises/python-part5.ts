import { addExercises } from ".";
import type { Exercise } from "@/app/exercises/[module]/exercise-client";

// @ts-nocheck — Auto-converted from exercises-part5.js
const exercises: Exercise[] = [
    // === FONCTIONS DE BASE (96-110) ===
    {
      id: "s1_e96",
      title: "Première fonction",
      description: "Créer une fonction simple",
      instruction: "Définissez votre première fonction avec def",
      help_steps: [
        "1. def nom_fonction():",
        "2. Attention à l'indentation dans la fonction",
        "3. Appelez la fonction avec nom_fonction()",
      ],
      code_template: `# Exercice 96: Première fonction
# Créez une fonction dire_bonjour() qui affiche "Bonjour!"
# Appelez ensuite cette fonction

`,
      solution: `def dire_bonjour():
    print("Bonjour!")

dire_bonjour()`,
      tests: [{ input: "", expected_output: "Bonjour!" }],
    },
    {
      id: "s1_e97",
      title: "Fonction avec paramètre",
      description: "Passer des arguments à une fonction",
      instruction: "Créez une fonction qui accepte un paramètre",
      help_steps: [
        "1. def fonction(paramètre):",
        "2. Utilisez le paramètre dans la fonction",
        "3. Appelez avec fonction(valeur)",
      ],
      code_template: `# Exercice 97: Paramètre
# Créez une fonction saluer(nom) qui affiche "Bonjour [nom]!"
# Appelez-la avec saluer("Alice")

`,
      solution: `def saluer(nom):
    print(f"Bonjour {nom}!")

saluer("Alice")`,
      tests: [{ input: "", expected_output: "Bonjour Alice!" }],
    },
    {
      id: "s1_e98",
      title: "Fonction avec return",
      description: "Retourner une valeur avec return",
      instruction: "Créez une fonction qui retourne un résultat",
      help_steps: [
        "1. return valeur (pour retourner)",
        "2. resultat = fonction() (pour récupérer)",
        "3. print(resultat) pour afficher",
      ],
      code_template: `# Exercice 98: Return
# Créez une fonction doubler(nombre) qui retourne nombre * 2
# Appelez-la avec 5 et affichez le résultat

`,
      solution: `def doubler(nombre):
    return nombre * 2

resultat = doubler(5)
print(resultat)`,
      tests: [{ input: "", expected_output: "10" }],
    },
    {
      id: "s1_e99",
      title: "Fonction avec plusieurs paramètres",
      description: "Utiliser plusieurs paramètres",
      instruction: "Créez une fonction avec plusieurs arguments",
      help_steps: [
        "1. def fonction(param1, param2, param3):",
        "2. Séparez les paramètres par des virgules",
        "3. Respectez l'ordre lors de l'appel",
      ],
      code_template: `# Exercice 99: Plusieurs paramètres
# Créez une fonction additionner(a, b) qui retourne a + b
# Testez avec additionner(3, 7)

`,
      solution: `def additionner(a, b):
    return a + b

resultat = additionner(3, 7)
print(resultat)`,
      tests: [{ input: "", expected_output: "10" }],
    },
    {
      id: "s1_e100",
      title: "Paramètre par défaut",
      description: "Définir des valeurs par défaut",
      instruction: "Créez une fonction avec un paramètre optionnel",
      help_steps: [
        "1. def fonction(param=valeur_défaut):",
        "2. Le paramètre devient optionnel",
        "3. Utilisé si aucune valeur n'est fournie",
      ],
      code_template: `# Exercice 100: Valeur par défaut
# Créez une fonction puissance(nombre, exposant=2)
# Par défaut, calcule le carré
# Testez puissance(4) et puissance(2, 3)

`,
      solution: `def puissance(nombre, exposant=2):
    return nombre ** exposant

print(puissance(4))
print(puissance(2, 3))`,
      tests: [{ input: "", expected_output: "16" }],
    },
    {
      id: "s1_e101",
      title: "Variables locales",
      description: "Comprendre la portée des variables",
      instruction: "Explorez les variables locales et globales",
      help_steps: [
        "1. Variables dans la fonction = locales",
        "2. Variables hors fonction = globales",
        "3. Local masque global si même nom",
      ],
      code_template: `# Exercice 101: Variables locales
# x = 10 (global)
# Créez une fonction test() qui:
# - crée x = 5 (local)
# - affiche x
# Appelez test() puis affichez x global

`,
      solution: `x = 10

def test():
    x = 5
    print(x)

test()
print(x)`,
      tests: [{ input: "", expected_output: "5" }],
    },
    {
      id: "s1_e102",
      title: "Fonction avec documentation",
      description: "Documenter une fonction avec docstring",
      instruction: "Ajoutez une documentation à votre fonction",
      help_steps: [
        '1. Première ligne après def: """Description"""',
        "2. Triple guillemets pour documentation",
        "3. Accessible avec help(fonction)",
      ],
      code_template: `# Exercice 102: Documentation
# Créez une fonction aire_rectangle(longueur, largeur)
# Ajoutez une docstring qui explique ce qu'elle fait
# Retournez longueur * largeur

`,
      solution: `def aire_rectangle(longueur, largeur):
    """Calcule l'aire d'un rectangle"""
    return longueur * largeur

print(aire_rectangle(5, 3))`,
      tests: [{ input: "", expected_output: "15" }],
    },
    {
      id: "s1_e103",
      title: "Fonction récursive simple",
      description: "Une fonction qui s'appelle elle-même",
      instruction: "Créez une fonction récursive pour calculer une factorielle",
      help_steps: [
        "1. Cas de base (condition d'arrêt)",
        "2. Cas récursif (fonction s'appelle)",
        "3. factoriel(n) = n * factoriel(n-1)",
      ],
      code_template: `# Exercice 103: Récursion
# Créez factoriel(n):
# Si n <= 1: retourner 1
# Sinon: retourner n * factoriel(n-1)
# Testez avec factoriel(4)

`,
      solution: `def factoriel(n):
    if n <= 1:
        return 1
    else:
        return n * factoriel(n - 1)

print(factoriel(4))`,
      tests: [{ input: "", expected_output: "24" }],
    },
    {
      id: "s1_e104",
      title: "Arguments nommés",
      description: "Appeler une fonction avec des arguments nommés",
      instruction: "Utilisez les arguments par nom pour plus de clarté",
      help_steps: [
        "1. fonction(paramètre=valeur)",
        "2. Ordre n'a plus d'importance",
        "3. Plus lisible pour beaucoup de paramètres",
      ],
      code_template: `# Exercice 104: Arguments nommés
# Créez présenter(nom, age, ville)
# Affichez "Je suis [nom], [age] ans, de [ville]"
# Appelez avec arguments nommés dans un ordre différent

`,
      solution: `def presenter(nom, age, ville):
    print(f"Je suis {nom}, {age} ans, de {ville}")

presenter(ville="Paris", nom="Alice", age=25)`,
      tests: [
        { input: "", expected_output: "Je suis Alice, 25 ans, de Paris" },
      ],
    },
    {
      id: "s1_e105",
      title: "Fonction lambda",
      description: "Créer des fonctions courtes avec lambda",
      instruction: "Utilisez lambda pour une fonction en une ligne",
      help_steps: [
        "1. lambda paramètres: expression",
        "2. Retourne automatiquement l'expression",
        "3. Pour des fonctions très simples",
      ],
      code_template: `# Exercice 105: Lambda
# Créez une fonction lambda qui calcule le carré d'un nombre
# Stockez-la dans la variable carré
# Testez avec carré(6)

`,
      solution: `carre = lambda x: x ** 2
print(carre(6))`,
      tests: [{ input: "", expected_output: "36" }],
    },

    // === CONCEPTS AVANCÉS (106-120) ===
    {
      id: "s1_e106",
      title: "List comprehension",
      description: "Créer des listes de façon concise",
      instruction: "Utilisez une list comprehension pour créer une liste",
      help_steps: [
        "1. [expression for item in iterable]",
        "2. Plus compact qu'une boucle for",
        "3. [x*2 for x in range(5)]",
      ],
      code_template: `# Exercice 106: List comprehension
# Créez une liste des carrés de 1 à 5
# Utilisez [x**2 for x in range(1, 6)]
# Affichez la liste

`,
      solution: `carres = [x**2 for x in range(1, 6)]
print(carres)`,
      tests: [{ input: "", expected_output: "[1, 4, 9, 16, 25]" }],
    },
    {
      id: "s1_e107",
      title: "Dictionnaire de base",
      description: "Créer et utiliser un dictionnaire",
      instruction: "Découvrez les dictionnaires Python",
      help_steps: [
        "1. {clé: valeur, clé2: valeur2}",
        "2. dict[clé] pour accéder",
        "3. dict[clé] = nouvelle_valeur pour modifier",
      ],
      code_template: `# Exercice 107: Dictionnaire
# Créez un dictionnaire personne avec:
# nom: "Alice", age: 25, ville: "Paris"
# Affichez personne["nom"]

`,
      solution: `personne = {"nom": "Alice", "age": 25, "ville": "Paris"}
print(personne["nom"])`,
      tests: [{ input: "", expected_output: "Alice" }],
    },
    {
      id: "s1_e108",
      title: "Méthodes de dictionnaire",
      description: "Utiliser les méthodes des dictionnaires",
      instruction: "Explorez les méthodes keys(), values(), items()",
      help_steps: [
        "1. .keys() pour les clés",
        "2. .values() pour les valeurs",
        "3. .items() pour les paires clé-valeur",
      ],
      code_template: `# Exercice 108: Méthodes dict
# notes = {"math": 15, "physique": 18, "chimie": 12}
# Affichez toutes les matières avec .keys()
# Affichez toutes les notes avec .values()

`,
      solution: `notes = {"math": 15, "physique": 18, "chimie": 12}
print(list(notes.keys()))
print(list(notes.values()))`,
      tests: [{ input: "", expected_output: "['math', 'physique', 'chimie']" }],
    },
    {
      id: "s1_e109",
      title: "Gestion d'erreurs try/except",
      description: "Gérer les erreurs avec try/except",
      instruction: "Protégez votre code contre les erreurs",
      help_steps: [
        "1. try: code_risqué",
        "2. except: code_si_erreur",
        "3. Le programme continue même en cas d'erreur",
      ],
      code_template: `# Exercice 109: Try/Except
# Essayez de convertir "abc" en nombre avec int()
# Utilisez try/except pour capturer l'erreur
# Affichez "Conversion impossible" si erreur

`,
      solution: `try:
    nombre = int("abc")
    print(nombre)
except:
    print("Conversion impossible")`,
      tests: [{ input: "", expected_output: "Conversion impossible" }],
    },
    {
      id: "s1_e110",
      title: "Importation de modules",
      description: "Utiliser des modules Python",
      instruction: "Importez et utilisez le module math",
      help_steps: [
        "1. import nom_module",
        "2. module.fonction() pour utiliser",
        "3. Accès aux fonctions du module",
      ],
      code_template: `# Exercice 110: Import
# Importez le module math
# Utilisez math.sqrt(16) pour calculer la racine carrée
# Affichez le résultat

`,
      solution: `import math
resultat = math.sqrt(16)
print(resultat)`,
      tests: [{ input: "", expected_output: "4.0" }],
    },
    {
      id: "s1_e111",
      title: "Fonction avec *args",
      description: "Accepter un nombre variable d'arguments",
      instruction: "Créez une fonction qui prend plusieurs arguments",
      help_steps: [
        "1. def fonction(*args):",
        "2. args devient un tuple",
        "3. for arg in args: pour parcourir",
      ],
      code_template: `# Exercice 111: *args
# Créez une fonction moyenne(*nombres)
# Qui calcule la moyenne de tous les nombres passés
# Testez avec moyenne(10, 15, 20)

`,
      solution: `def moyenne(*nombres):
    return sum(nombres) / len(nombres)

print(moyenne(10, 15, 20))`,
      tests: [{ input: "", expected_output: "15.0" }],
    },
    {
      id: "s1_e112",
      title: "Générateur simple",
      description: "Créer un générateur avec yield",
      instruction: "Découvrez les générateurs Python",
      help_steps: [
        "1. yield au lieu de return",
        "2. La fonction devient un générateur",
        "3. for item in générateur() pour utiliser",
      ],
      code_template: `# Exercice 112: Générateur
# Créez un générateur compter(n) qui yield 1, 2, ..., n
# Utilisez for i in compter(3): print(i)

`,
      solution: `def compter(n):
    for i in range(1, n + 1):
        yield i

for i in compter(3):
    print(i)`,
      tests: [{ input: "", expected_output: "1" }],
    },
    {
      id: "s1_e113",
      title: "Classe simple",
      description: "Créer votre première classe",
      instruction: "Définissez une classe avec des attributs",
      help_steps: [
        "1. class NomClasse:",
        "2. def __init__(self, paramètres):",
        "3. self.attribut = valeur",
      ],
      code_template: `# Exercice 113: Première classe
# Créez une classe Voiture avec __init__(self, marque, modele)
# Créez une instance: ma_voiture = Voiture("Toyota", "Corolla")
# Affichez ma_voiture.marque

`,
      solution: `class Voiture:
    def __init__(self, marque, modele):
        self.marque = marque
        self.modele = modele

ma_voiture = Voiture("Toyota", "Corolla")
print(ma_voiture.marque)`,
      tests: [{ input: "", expected_output: "Toyota" }],
    },
    {
      id: "s1_e114",
      title: "Méthode de classe",
      description: "Ajouter des méthodes à une classe",
      instruction: "Créez une méthode pour votre classe",
      help_steps: [
        "1. def methode(self, paramètres):",
        "2. Toujours self comme premier paramètre",
        "3. instance.methode() pour appeler",
      ],
      code_template: `# Exercice 114: Méthode
# Ajoutez une méthode demarrer() à la classe Voiture
# Elle affiche "La voiture démarre"
# Créez une instance et appelez demarrer()

`,
      solution: `class Voiture:
    def __init__(self, marque):
        self.marque = marque
    
    def demarrer(self):
        print("La voiture démarre")

ma_voiture = Voiture("Toyota")
ma_voiture.demarrer()`,
      tests: [{ input: "", expected_output: "La voiture démarre" }],
    },
    {
      id: "s1_e115",
      title: "Fichier texte simple",
      description: "Lire et écrire dans un fichier",
      instruction: "Manipulez des fichiers avec open()",
      help_steps: [
        "1. with open('fichier.txt', 'w') as f:",
        "2. f.write('contenu') pour écrire",
        "3. with open('fichier.txt', 'r') as f: pour lire",
      ],
      code_template: `# Exercice 115: Fichiers
# Écrivez "Hello World" dans un fichier test.txt
# Puis relisez et affichez le contenu
# Utilisez with open()

`,
      solution: `with open('test.txt', 'w') as f:
    f.write('Hello World')

with open('test.txt', 'r') as f:
    contenu = f.read()
    print(contenu)`,
      tests: [{ input: "", expected_output: "Hello World" }],
    },
    {
      id: "s1_e116",
      title: "Format de chaîne avancé",
      description: "Utiliser format() avec des spécifications",
      instruction: "Formatez des nombres avec précision",
      help_steps: [
        "1. {:.2f} pour 2 décimales",
        "2. {:>10} pour aligner à droite",
        "3. Plus de contrôle sur l'affichage",
      ],
      code_template: `# Exercice 116: Format avancé
# prix = 19.999
# Affichez "Prix: 20.00€" en utilisant format()
# Arrondissez à 2 décimales

`,
      solution: `prix = 19.999
print("Prix: {:.2f}€".format(prix))`,
      tests: [{ input: "", expected_output: "Prix: 20.00€" }],
    },
    {
      id: "s1_e117",
      title: "Set (ensemble)",
      description: "Utiliser les ensembles pour des éléments uniques",
      instruction: "Découvrez les sets Python",
      help_steps: [
        "1. {élément1, élément2} ou set()",
        "2. Pas de doublons automatiquement",
        "3. .add() pour ajouter",
      ],
      code_template: `# Exercice 117: Set
# Créez un set couleurs avec "rouge", "vert", "rouge"
# Affichez le set (observez qu'il n'y a qu'un seul "rouge")
# Ajoutez "bleu" avec .add()

`,
      solution: `couleurs = {"rouge", "vert", "rouge"}
print(couleurs)
couleurs.add("bleu")
print(couleurs)`,
      tests: [{ input: "", expected_output: "{'rouge', 'vert'}" }],
    },
    {
      id: "s1_e118",
      title: "Compréhension de dictionnaire",
      description: "Créer des dictionnaires avec comprehension",
      instruction: "Utilisez la dict comprehension",
      help_steps: [
        "1. {clé: valeur for item in iterable}",
        "2. Comme list comprehension mais pour dict",
        "3. Très puissant et concis",
      ],
      code_template: `# Exercice 118: Dict comprehension
# Créez un dictionnaire {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}
# (nombres et leurs carrés de 1 à 5)
# Utilisez {x: x**2 for x in range(1, 6)}

`,
      solution: `carres = {x: x**2 for x in range(1, 6)}
print(carres)`,
      tests: [
        { input: "", expected_output: "{1: 1, 2: 4, 3: 9, 4: 16, 5: 25}" },
      ],
    },
    {
      id: "s1_e119",
      title: "Décorateur simple",
      description: "Comprendre les décorateurs de base",
      instruction: "Créez un décorateur simple",
      help_steps: [
        "1. def decorateur(fonction):",
        "2. def wrapper(): ...",
        "3. @decorateur avant la fonction",
      ],
      code_template: `# Exercice 119: Décorateur
# Créez un décorateur debug qui affiche "Appel de fonction"
# Appliquez-le à une fonction simple avec @debug

`,
      solution: `def debug(fonction):
    def wrapper():
        print("Appel de fonction")
        fonction()
    return wrapper

@debug
def dire_hello():
    print("Hello")

dire_hello()`,
      tests: [{ input: "", expected_output: "Appel de fonction" }],
    },
    {
      id: "s1_e120",
      title: "Projet final - Mini calculatrice",
      description: "Intégrer tous les concepts appris",
      instruction: "Créez une calculatrice avec toutes vos connaissances",
      help_steps: [
        "1. Fonctions pour +, -, *, /",
        "2. Boucle while pour le menu",
        "3. Try/except pour les erreurs",
        "4. Conditions pour les choix",
      ],
      code_template: `# Exercice 120: PROJET FINAL
# Créez une mini-calculatrice avec:
# - Fonctions add(), subtract(), multiply(), divide()
# - Menu avec choix 1-4
# - Gestion des erreurs
# - Boucle pour continuer

`,
      solution: `def add(x, y):
    return x + y

def subtract(x, y):
    return x - y

def multiply(x, y):
    return x * y

def divide(x, y):
    return x / y

print("Calculatrice")
print("1. Addition")
print("2. Soustraction")
print("3. Multiplication")
print("4. Division")

choice = input("Choisissez (1/2/3/4): ")
num1 = float(input("Premier nombre: "))
num2 = float(input("Deuxième nombre: "))

if choice == '1':
    print(f"Résultat: {add(num1, num2)}")
elif choice == '2':
    print(f"Résultat: {subtract(num1, num2)}")
elif choice == '3':
    print(f"Résultat: {multiply(num1, num2)}")
elif choice == '4':
    print(f"Résultat: {divide(num1, num2)}")`,
      tests: [{ input: "", expected_output: "Calculatrice" }],
    },
  ];

addExercises("python", exercises);
