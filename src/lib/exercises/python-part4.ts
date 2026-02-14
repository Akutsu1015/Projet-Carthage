import { addExercises } from ".";
import type { Exercise } from "@/app/exercises/[module]/exercise-client";

// @ts-nocheck — Auto-converted from exercises-part4.js
const exercises: Exercise[] = [
    // === CONDITIONS IF/ELSE (76-85) ===
    {
      id: "s1_e76",
      title: "Première condition if",
      description: "Utiliser if pour une condition simple",
      instruction: "Créez votre première condition avec if",
      help_steps: [
        "1. if condition:",
        "2. Attention à l'indentation (4 espaces)",
        "3. Le : à la fin de la ligne if",
        "4. Le code indenté s'exécute si vrai",
      ],
      code_template: `# Exercice 76: Première condition
# age = 18
# Si age >= 18, affichez "Majeur"

`,
      solution: `age = 18
if age >= 18:
    print("Majeur")`,
      tests: [{ input: "", expected_output: "Majeur" }],
    },
    {
      id: "s1_e77",
      title: "Condition if/else",
      description: "Ajouter une alternative avec else",
      instruction: "Utilisez if/else pour gérer deux cas",
      help_steps: [
        "1. if condition:",
        "2.     code si vrai",
        "3. else:",
        "4.     code si faux",
      ],
      code_template: `# Exercice 77: If/Else
# age = 16
# Si age >= 18: "Majeur", sinon: "Mineur"

`,
      solution: `age = 16
if age >= 18:
    print("Majeur")
else:
    print("Mineur")`,
      tests: [{ input: "", expected_output: "Mineur" }],
    },
    {
      id: "s1_e78",
      title: "Conditions multiples elif",
      description: "Utiliser elif pour plusieurs conditions",
      instruction: "Créez une échelle de notes avec elif",
      help_steps: [
        "1. if première_condition:",
        "2. elif deuxième_condition:",
        "3. elif troisième_condition:",
        "4. else: (cas par défaut)",
      ],
      code_template: `# Exercice 78: Elif
# note = 85
# >= 90: "Excellent", >= 80: "Bien", >= 60: "Passable", sinon: "Échec"

`,
      solution: `note = 85
if note >= 90:
    print("Excellent")
elif note >= 80:
    print("Bien")
elif note >= 60:
    print("Passable")
else:
    print("Échec")`,
      tests: [{ input: "", expected_output: "Bien" }],
    },
    {
      id: "s1_e79",
      title: "Conditions avec and",
      description: "Combiner plusieurs conditions avec and",
      instruction: "Vérifiez plusieurs critères simultanément",
      help_steps: [
        "1. if condition1 and condition2:",
        "2. Toutes les conditions doivent être vraies",
        "3. Utilisez des parenthèses pour clarifier",
      ],
      code_template: `# Exercice 79: Conditions AND
# age = 25, revenus = 3000
# Si age >= 18 ET revenus >= 2000: "Crédit approuvé"
# Sinon: "Crédit refusé"

`,
      solution: `age = 25
revenus = 3000
if age >= 18 and revenus >= 2000:
    print("Crédit approuvé")
else:
    print("Crédit refusé")`,
      tests: [{ input: "", expected_output: "Crédit approuvé" }],
    },
    {
      id: "s1_e80",
      title: "Conditions avec or",
      description: "Utiliser or pour des alternatives",
      instruction: "Vérifiez si au moins une condition est vraie",
      help_steps: [
        "1. if condition1 or condition2:",
        "2. Au moins une condition doit être vraie",
        "3. or = OU logique",
      ],
      code_template: `# Exercice 80: Conditions OR
# jour = "samedi"
# Si jour == "samedi" OU jour == "dimanche": "Weekend"
# Sinon: "Jour de semaine"

`,
      solution: `jour = "samedi"
if jour == "samedi" or jour == "dimanche":
    print("Weekend")
else:
    print("Jour de semaine")`,
      tests: [{ input: "", expected_output: "Weekend" }],
    },
    {
      id: "s1_e81",
      title: "Condition avec not",
      description: "Inverser une condition avec not",
      instruction: "Utilisez not pour inverser une logique",
      help_steps: [
        "1. not inverse True/False",
        "2. if not condition:",
        "3. Plus lisible que if condition == False:",
      ],
      code_template: `# Exercice 81: NOT
# connecte = False
# Si NOT connecte: "Veuillez vous connecter"
# Sinon: "Bienvenue"

`,
      solution: `connecte = False
if not connecte:
    print("Veuillez vous connecter")
else:
    print("Bienvenue")`,
      tests: [{ input: "", expected_output: "Veuillez vous connecter" }],
    },
    {
      id: "s1_e82",
      title: "Conditions imbriquées",
      description: "Mettre des if dans des if",
      instruction: "Créez des conditions à plusieurs niveaux",
      help_steps: [
        "1. Un if peut contenir d'autres if",
        "2. Attention à l'indentation (4, 8, 12 espaces...)",
        "3. Chaque niveau a sa propre indentation",
      ],
      code_template: `# Exercice 82: If imbriqués
# age = 20, permis = True
# Si age >= 18:
#   Si permis == True: "Peut conduire"
#   Sinon: "Doit passer le permis"
# Sinon: "Trop jeune"

`,
      solution: `age = 20
permis = True
if age >= 18:
    if permis == True:
        print("Peut conduire")
    else:
        print("Doit passer le permis")
else:
    print("Trop jeune")`,
      tests: [{ input: "", expected_output: "Peut conduire" }],
    },
    {
      id: "s1_e83",
      title: "Condition avec in",
      description: "Vérifier l'appartenance avec in",
      instruction: "Utilisez in dans une condition",
      help_steps: [
        "1. if élément in collection:",
        "2. Fonctionne avec listes, chaînes, etc.",
        "3. Plus élégant que plusieurs ==",
      ],
      code_template: `# Exercice 83: Condition IN
# couleur = "rouge"
# couleurs_primaires = ["rouge", "bleu", "jaune"]
# Si couleur dans couleurs_primaires: "Couleur primaire"
# Sinon: "Couleur secondaire"

`,
      solution: `couleur = "rouge"
couleurs_primaires = ["rouge", "bleu", "jaune"]
if couleur in couleurs_primaires:
    print("Couleur primaire")
else:
    print("Couleur secondaire")`,
      tests: [{ input: "", expected_output: "Couleur primaire" }],
    },
    {
      id: "s1_e84",
      title: "Validation d'entrée",
      description: "Valider des données avec des conditions",
      instruction: "Vérifiez si un mot de passe est valide",
      help_steps: [
        "1. Combinez plusieurs critères",
        "2. len() pour la longueur",
        "3. and pour toutes les conditions",
      ],
      code_template: `# Exercice 84: Validation
# mot_de_passe = "Python123"
# Valide si longueur >= 8 ET contient "1"
# Affichez "Valide" ou "Invalide"

`,
      solution: `mot_de_passe = "Python123"
if len(mot_de_passe) >= 8 and "1" in mot_de_passe:
    print("Valide")
else:
    print("Invalide")`,
      tests: [{ input: "", expected_output: "Valide" }],
    },
    {
      id: "s1_e85",
      title: "Condition ternaire",
      description: "Condition courte en une ligne",
      instruction: "Utilisez l'opérateur ternaire de Python",
      help_steps: [
        "1. variable = valeur_si_vrai if condition else valeur_si_faux",
        "2. Plus compact qu'un if/else complet",
        "3. À utiliser pour des cas simples",
      ],
      code_template: `# Exercice 85: Opérateur ternaire
# age = 17
# Utilisez l'opérateur ternaire pour assigner:
# statut = "Majeur" si age >= 18, sinon "Mineur"
# Affichez statut

`,
      solution: `age = 17
statut = "Majeur" if age >= 18 else "Mineur"
print(statut)`,
      tests: [{ input: "", expected_output: "Mineur" }],
    },

    // === BOUCLES DE BASE (86-95) ===
    {
      id: "s1_e86",
      title: "Première boucle for",
      description: "Itérer sur une liste avec for",
      instruction: "Parcourez une liste avec une boucle for",
      help_steps: [
        "1. for élément in liste:",
        "2. Attention à l'indentation",
        "3. élément prend chaque valeur tour à tour",
      ],
      code_template: `# Exercice 86: Boucle for
# fruits = ["pomme", "banane", "orange"]
# Affichez chaque fruit avec for

`,
      solution: `fruits = ["pomme", "banane", "orange"]
for fruit in fruits:
    print(fruit)`,
      tests: [{ input: "", expected_output: "pomme" }],
    },
    {
      id: "s1_e87",
      title: "Boucle for avec range",
      description: "Utiliser range() pour générer des nombres",
      instruction: "Comptez de 1 à 5 avec range()",
      help_steps: [
        "1. range(5) génère 0, 1, 2, 3, 4",
        "2. range(1, 6) génère 1, 2, 3, 4, 5",
        "3. for i in range():",
      ],
      code_template: `# Exercice 87: For avec range
# Affichez les nombres de 1 à 5
# Utilisez for i in range(1, 6)

`,
      solution: `for i in range(1, 6):
    print(i)`,
      tests: [{ input: "", expected_output: "1" }],
    },
    {
      id: "s1_e88",
      title: "Boucle while",
      description: "Répéter tant qu'une condition est vraie",
      instruction: "Comptez avec une boucle while",
      help_steps: [
        "1. while condition:",
        "2. N'oubliez pas de modifier la variable",
        "3. Attention aux boucles infinies !",
      ],
      code_template: `# Exercice 88: Boucle while
# Comptez de 1 à 3 avec while
# compteur = 1, tant que compteur <= 3

`,
      solution: `compteur = 1
while compteur <= 3:
    print(compteur)
    compteur += 1`,
      tests: [{ input: "", expected_output: "1" }],
    },
    {
      id: "s1_e89",
      title: "Accumulation dans une boucle",
      description: "Calculer une somme avec une boucle",
      instruction: "Additionnez les nombres de 1 à 10",
      help_steps: [
        "1. Initialisez somme = 0",
        "2. for nombre in range(1, 11):",
        "3. somme += nombre (ajouter à la somme)",
      ],
      code_template: `# Exercice 89: Accumulation
# Calculez la somme de 1 + 2 + 3 + ... + 10
# Utilisez une boucle for et une variable somme

`,
      solution: `somme = 0
for nombre in range(1, 11):
    somme += nombre
print(somme)`,
      tests: [{ input: "", expected_output: "55" }],
    },
    {
      id: "s1_e90",
      title: "Boucle avec break",
      description: "Sortir d'une boucle avec break",
      instruction: "Arrêtez la boucle quand vous trouvez un élément",
      help_steps: [
        "1. break sort immédiatement de la boucle",
        "2. Utile pour les recherches",
        "3. La boucle s'arrête complètement",
      ],
      code_template: `# Exercice 90: Break
# nombres = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
# Cherchez le nombre 5
# Quand vous le trouvez, affichez "Trouvé!" et sortez avec break

`,
      solution: `nombres = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
for nombre in nombres:
    if nombre == 5:
        print("Trouvé!")
        break`,
      tests: [{ input: "", expected_output: "Trouvé!" }],
    },
    {
      id: "s1_e91",
      title: "Boucle avec continue",
      description: "Passer à l'itération suivante avec continue",
      instruction: "Affichez seulement les nombres pairs",
      help_steps: [
        "1. continue passe à l'itération suivante",
        "2. Le reste du code de la boucle est ignoré",
        "3. Utilisez % 2 == 0 pour tester les pairs",
      ],
      code_template: `# Exercice 91: Continue
# Affichez les nombres de 1 à 10
# Mais sautez les nombres impairs avec continue
# (affichez seulement 2, 4, 6, 8, 10)

`,
      solution: `for i in range(1, 11):
    if i % 2 != 0:
        continue
    print(i)`,
      tests: [{ input: "", expected_output: "2" }],
    },
    {
      id: "s1_e92",
      title: "Boucles imbriquées",
      description: "Mettre une boucle dans une boucle",
      instruction:
        "Créez une table de multiplication avec des boucles imbriquées",
      help_steps: [
        "1. for i in range(): (boucle externe)",
        "2.     for j in range(): (boucle interne)",
        "3. Attention à l'indentation",
      ],
      code_template: `# Exercice 92: Boucles imbriquées
# Affichez la table de multiplication de 1 à 3
# Format: "1 x 1 = 1", "1 x 2 = 2", etc.

`,
      solution: `for i in range(1, 4):
    for j in range(1, 4):
        print(f"{i} x {j} = {i * j}")`,
      tests: [{ input: "", expected_output: "1 x 1 = 1" }],
    },
    {
      id: "s1_e93",
      title: "Énumération avec enumerate",
      description: "Obtenir l'index et la valeur avec enumerate",
      instruction: "Affichez l'index et la valeur de chaque élément",
      help_steps: [
        "1. enumerate() donne l'index et la valeur",
        "2. for index, valeur in enumerate(liste):",
        "3. L'index commence à 0 par défaut",
      ],
      code_template: `# Exercice 93: Enumerate
# animaux = ["chat", "chien", "oiseau"]
# Affichez: "0: chat", "1: chien", "2: oiseau"
# Utilisez enumerate()

`,
      solution: `animaux = ["chat", "chien", "oiseau"]
for index, animal in enumerate(animaux):
    print(f"{index}: {animal}")`,
      tests: [{ input: "", expected_output: "0: chat" }],
    },
    {
      id: "s1_e94",
      title: "Parcours de chaîne",
      description: "Itérer sur les caractères d'une chaîne",
      instruction: "Parcourez chaque caractère d'un mot",
      help_steps: [
        "1. for caractère in chaîne:",
        "2. Les chaînes sont itérables comme les listes",
        "3. Chaque caractère est traité séparément",
      ],
      code_template: `# Exercice 94: Parcours de chaîne
# mot = "Python"
# Affichez chaque lettre sur une ligne séparée

`,
      solution: `mot = "Python"
for lettre in mot:
    print(lettre)`,
      tests: [{ input: "", expected_output: "P" }],
    },
    {
      id: "s1_e95",
      title: "Création de liste avec boucle",
      description: "Construire une liste avec une boucle",
      instruction: "Créez une liste des carrés de 1 à 5",
      help_steps: [
        "1. Commencez avec une liste vide",
        "2. for i in range():",
        "3. .append() pour ajouter chaque carré",
      ],
      code_template: `# Exercice 95: Construction de liste
# Créez une liste contenant [1, 4, 9, 16, 25]
# (les carrés de 1, 2, 3, 4, 5)
# Utilisez une boucle et .append()

`,
      solution: `carres = []
for i in range(1, 6):
    carres.append(i * i)
print(carres)`,
      tests: [{ input: "", expected_output: "[1, 4, 9, 16, 25]" }],
    },
  ];

addExercises("python", exercises);
