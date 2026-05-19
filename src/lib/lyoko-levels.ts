/**
 * Lyoko Levels — 30 progressive levels for CodeCombat-style GameDev module.
 *
 * Grid legend:
 *   . = empty floor
 *   # = wall (indestructible)
 *   H = hero start
 *   B = Blok (2 HP)
 *   K = Kankrelat (1 HP)
 *   T = Tower (objective)
 *   P = Pickup (collectible)
 */

import type { LevelDef } from "./lyoko-engine";

// ════════════════════════════════════════════════
// CHAPITRE 1 — Premiers Pas sur Lyoko (1-5)
// Commandes: avancer(), tournerDroite(), tournerGauche()
// ════════════════════════════════════════════════

const level1: LevelDef = {
    id: 1, chapter: 1,
    title: "Virtualisation !",
    description: "Apprends à déplacer ton héros sur le terrain de Lyoko.",
    story: "Tu viens d'être virtualisé sur Lyoko ! Jérémie t'a repéré une tour à désactiver. Avance droit devant toi pour l'atteindre.",
    grid: [
        "............",
        "............",
        "............",
        "H.......T...",
        "............",
        "............",
        "............",
        "............",
    ],
    objectives: [{ type: "reach_tower", description: "Atteins la tour de Lyoko" }],
    availableCommands: ["avancer"],
    codeTemplate: `// Utilise avancer() pour te déplacer vers la droite
// La tour est à 8 cases devant toi !

avancer();
avancer();
// Continue...`,
    hints: [
        "La tour est à 8 cases vers la droite",
        "Utilise avancer() 8 fois",
        "Tu peux aussi utiliser repeter(8, function() { avancer(); })"
    ],
    solution: `repeter(8, function() {
  avancer();
});`,
};

const level2: LevelDef = {
    id: 2, chapter: 1,
    title: "Premier virage",
    description: "Apprends à tourner pour changer de direction.",
    story: "Le chemin tourne ! Utilise tournerDroite() pour changer de direction, puis continue à avancer.",
    grid: [
        "............",
        "............",
        "............",
        "H....#######",
        ".....T......",
        "............",
        "............",
        "............",
    ],
    objectives: [{ type: "reach_tower", description: "Atteins la tour" }],
    availableCommands: ["avancer", "tournerDroite"],
    codeTemplate: `// Avance jusqu'au mur, puis tourne à droite !

avancer();
// ...`,
    hints: [
        "Avance 5 fois vers la droite",
        "Puis tournerDroite() pour regarder vers le bas",
        "Puis avancer() une fois"
    ],
    solution: `repeter(5, function() {
  avancer();
});
tournerDroite();
avancer();`,
};

const level3: LevelDef = {
    id: 3, chapter: 1,
    title: "Le Labyrinthe simple",
    description: "Combine avancer et tourner pour naviguer dans un couloir.",
    story: "Un couloir en forme de L. Tourne deux fois pour rejoindre la tour !",
    grid: [
        "#####.......",
        "#...#.......",
        "#.H.#.......",
        "#...########",
        "#...........",
        "#..........T",
        "#...........",
        "############",
    ],
    objectives: [{ type: "reach_tower", description: "Atteins la tour" }],
    availableCommands: ["avancer", "tournerDroite", "tournerGauche"],
    codeTemplate: `// Navigue dans le couloir en L !
// Tu commences en regardant vers la droite.

`,
    hints: [
        "D'abord, descends : tournerDroite() puis avancer() 2 fois",
        "Ensuite, tournerGauche() et avancer() vers la droite",
        "La tour est tout au bout à droite"
    ],
    solution: `tournerDroite();
avancer();
avancer();
tournerGauche();
repeter(9, function() {
  avancer();
});`,
};

const level4: LevelDef = {
    id: 4, chapter: 1,
    title: "Le Zigzag",
    description: "Navigue dans un chemin en zigzag.",
    story: "XANA a déformé le terrain ! Le chemin zigzague, mais la tour est au bout.",
    grid: [
        "H...########",
        "####.......#",
        "#..........#",
        "#.##########",
        "#...........",
        "##########.#",
        "#..........#",
        "#.T.########",
    ],
    objectives: [{ type: "reach_tower", description: "Atteins la tour" }],
    availableCommands: ["avancer", "tournerDroite", "tournerGauche"],
    codeTemplate: `// Le chemin zigzague ! Suis-le attentivement.

`,
    hints: [
        "Avance 4 fois, tourne à droite 2 fois (demi-tour relatif : droite + droite = retour)",
        "Non ! tournerDroite() puis avancer() pour descendre",
        "Observe le pattern : droite, bas, gauche, bas, droite..."
    ],
    solution: `repeter(4, function() { avancer(); });
tournerDroite();
avancer();
avancer();
tournerDroite();
repeter(9, function() { avancer(); });
tournerDroite();
avancer();
avancer();
tournerDroite();
repeter(9, function() { avancer(); });
tournerDroite();
avancer();
avancer();
tournerDroite();
avancer();`,
};

const level5: LevelDef = {
    id: 5, chapter: 1,
    title: "Le Raccourci",
    description: "Trouve le chemin le plus court vers la tour.",
    story: "Deux chemins mènent à la tour. Choisis le plus court !",
    grid: [
        "............",
        ".H...####...",
        ".....#..#...",
        ".....#..#...",
        ".....#..T...",
        ".....#......",
        ".....#......",
        "............",
    ],
    objectives: [{ type: "reach_tower", description: "Atteins la tour" }],
    availableCommands: ["avancer", "tournerDroite", "tournerGauche"],
    codeTemplate: `// Deux chemins possibles !
// Essaie de trouver le plus court.

`,
    hints: [
        "Le chemin par le haut est plus court",
        "Avance 6 fois, tourne à droite, avance 3 fois, tourne à droite, avance 2 fois",
        "Il faut contourner le mur par le haut"
    ],
    solution: `repeter(6, function() { avancer(); });
tournerDroite();
repeter(3, function() { avancer(); });
tournerDroite();
avancer();
avancer();`,
};

// ════════════════════════════════════════════════
// CHAPITRE 2 — Navigation Avancée (6-10)
// Commandes: + repeter()
// ════════════════════════════════════════════════

const level6: LevelDef = {
    id: 6, chapter: 2,
    title: "repeter()",
    description: "Utilise la boucle repeter() pour écrire moins de code.",
    story: "Jérémie a une astuce : au lieu d'écrire avancer() 10 fois, utilise repeter() !",
    grid: [
        "............",
        "............",
        "............",
        "H..........T",
        "............",
        "............",
        "............",
        "............",
    ],
    objectives: [{ type: "reach_tower", description: "Atteins la tour" }],
    availableCommands: ["avancer", "repeter"],
    codeTemplate: `// Au lieu d'écrire avancer() 11 fois...
// Utilise repeter(n, function() { ... })

repeter(11, function() {
  // Que mettre ici ?
});`,
    hints: [
        "repeter(11, function() { avancer(); })",
        "Le nombre dans repeter correspond au nombre de répétitions",
    ],
    solution: `repeter(11, function() {
  avancer();
});`,
};

const level7: LevelDef = {
    id: 7, chapter: 2,
    title: "Boucles et Virages",
    description: "Combine repeter() avec des virages.",
    story: "Le terrain forme un carré. Fais le tour complet pour ramasser tous les items !",
    grid: [
        "............",
        ".P...P......",
        "............",
        "............",
        ".H...P......",
        "............",
        "............",
        "............",
    ],
    objectives: [{ type: "collect_all", description: "Ramasse tous les objets" }],
    availableCommands: ["avancer", "tournerDroite", "tournerGauche", "repeter"],
    codeTemplate: `// Fais le tour du carré pour ramasser les 3 objets !
// P = objet à ramasser (tu les ramasses automatiquement en marchant dessus)

`,
    hints: [
        "Les objets forment un L : un en haut, un au coin, un à droite",
        "Monte, va à droite, puis descends",
        "Utilise tournerGauche() pour aller vers le haut"
    ],
    solution: `tournerGauche();
repeter(3, function() { avancer(); });
tournerDroite();
repeter(4, function() { avancer(); });
tournerDroite();
repeter(3, function() { avancer(); });`,
};

const level8: LevelDef = {
    id: 8, chapter: 2,
    title: "Le Couloir en Spirale",
    description: "Navigue dans une spirale pour atteindre le centre.",
    story: "La tour est cachée au centre d'une spirale. Suis le couloir !",
    grid: [
        "H...........",
        "##########.#",
        "..........#.",
        ".########.#.",
        ".#....T.#.#.",
        ".#.######.#.",
        ".#........#.",
        ".##########.",
    ],
    objectives: [{ type: "reach_tower", description: "Atteins la tour au centre" }],
    availableCommands: ["avancer", "tournerDroite", "tournerGauche", "repeter"],
    codeTemplate: `// Suis le couloir en spirale !
// Le pattern se répète : avancer, tourner...

`,
    hints: [
        "Le pattern est : avancer longtemps, tournerDroite(), avancer, tournerDroite()...",
        "Chaque segment est un peu plus court que le précédent",
    ],
    solution: `repeter(11, function() { avancer(); });
tournerDroite();
repeter(7, function() { avancer(); });
tournerDroite();
repeter(9, function() { avancer(); });
tournerDroite();
repeter(5, function() { avancer(); });
tournerDroite();
repeter(5, function() { avancer(); });`,
};

const level9: LevelDef = {
    id: 9, chapter: 2,
    title: "Pattern Répétitif",
    description: "Utilise repeter() pour un pattern qui se répète.",
    story: "Le chemin zigzague de façon régulière. Trouve le pattern et utilise repeter() !",
    grid: [
        "H...........",
        ".########...",
        "..........#.",
        ".########.#.",
        "..........#.",
        ".########.#.",
        "..........#.",
        ".######.T.#.",
    ],
    objectives: [{ type: "reach_tower", description: "Atteins la tour" }],
    availableCommands: ["avancer", "tournerDroite", "tournerGauche", "repeter"],
    codeTemplate: `// Le zigzag se répète 3 fois !
// Trouve le pattern de base, puis utilise repeter(3, ...)

`,
    hints: [
        "Le pattern de base : avancer 10, tournerDroite, avancer 1, tournerDroite",
        "Mais en fait c'est : droite long, descente, gauche long, descente",
    ],
    solution: `repeter(3, function() {
  repeter(10, function() { avancer(); });
  tournerDroite();
  avancer();
  tournerDroite();
  repeter(8, function() { avancer(); });
  tournerGauche();
  avancer();
  tournerGauche();
});
repeter(7, function() { avancer(); });`,
};

const level10: LevelDef = {
    id: 10, chapter: 2,
    title: "Course d'obstacles",
    description: "Navigue entre les murs pour ramasser tous les items.",
    story: "Des items sont dispersés entre les murs. Collecte-les tous !",
    grid: [
        "H.P.#.P.....",
        "....#.......",
        ".##.#.##.P..",
        "....#.......",
        ".P..#...#...",
        "....#...#...",
        ".##.....#.P.",
        "............",
    ],
    objectives: [{ type: "collect_all", description: "Ramasse les 5 objets" }],
    availableCommands: ["avancer", "tournerDroite", "tournerGauche", "repeter"],
    codeTemplate: `// 5 objets à trouver entre les murs !
// Planifie ton chemin attentivement.

`,
    hints: [
        "Commence par le P en (2,0)",
        "Il faut naviguer autour des murs #",
    ],
    solution: `avancer();
avancer();
tournerDroite();
repeter(4, function() { avancer(); });
tournerGauche();
repeter(3, function() { avancer(); });
tournerGauche();
repeter(2, function() { avancer(); });
tournerDroite();
avancer();
avancer();
tournerDroite();
repeter(4, function() { avancer(); });
tournerDroite();
repeter(4, function() { avancer(); });
tournerDroite();
avancer();`,
};

// ════════════════════════════════════════════════
// CHAPITRE 3 — Combat XANA (11-15)
// Commandes: + frapper()
// ════════════════════════════════════════════════

const level11: LevelDef = {
    id: 11, chapter: 3,
    title: "Premier Ennemi",
    description: "Apprends à combattre un Kankrelat.",
    story: "Un Kankrelat bloque le chemin ! Approche-toi et utilise frapper() pour le détruire.",
    grid: [
        "............",
        "............",
        "............",
        "H...K...T...",
        "............",
        "............",
        "............",
        "............",
    ],
    objectives: [
        { type: "kill_all", description: "Détruis le Kankrelat" },
        { type: "reach_tower", description: "Atteins la tour" },
    ],
    availableCommands: ["avancer", "frapper"],
    codeTemplate: `// Le Kankrelat (K) est à 4 cases devant toi.
// Approche-toi (3 cases) puis frapper() !
// Un Kankrelat meurt en 1 coup.

avancer();
avancer();
avancer();
frapper();
// Continue vers la tour...`,
    hints: [
        "frapper() attaque la case DEVANT toi",
        "Avance 3 fois, frappe, puis avance encore pour la tour",
    ],
    solution: `repeter(3, function() { avancer(); });
frapper();
repeter(4, function() { avancer(); });`,
};

const level12: LevelDef = {
    id: 12, chapter: 3,
    title: "Le Blok Résistant",
    description: "Les Bloks ont 2 PV — il faut frapper deux fois !",
    story: "Attention, ce Blok est plus résistant qu'un Kankrelat. Il faut le frapper DEUX fois !",
    grid: [
        "............",
        "............",
        "............",
        "H....B..T...",
        "............",
        "............",
        "............",
        "............",
    ],
    objectives: [
        { type: "kill_all", description: "Détruis le Blok" },
        { type: "reach_tower", description: "Atteins la tour" },
    ],
    availableCommands: ["avancer", "frapper"],
    codeTemplate: `// Le Blok (B) a 2 PV !
// frapper() deux fois pour le détruire.

`,
    hints: [
        "Avance 4 fois pour te placer devant le Blok",
        "Frappe 2 fois : frapper(); frapper();",
        "Puis avance pour passer et atteindre la tour",
    ],
    solution: `repeter(4, function() { avancer(); });
frapper();
frapper();
repeter(3, function() { avancer(); });`,
};

const level13: LevelDef = {
    id: 13, chapter: 3,
    title: "Attaque Multi-Direction",
    description: "Détruis des ennemis dans plusieurs directions.",
    story: "Les ennemis t'encerclent ! Tu devras tourner et frapper dans différentes directions.",
    grid: [
        "............",
        "............",
        ".....K......",
        "..K..H..B...",
        ".....K......",
        "............",
        "..........T.",
        "............",
    ],
    objectives: [
        { type: "kill_all", description: "Détruis tous les ennemis" },
        { type: "reach_tower", description: "Atteins la tour" },
    ],
    availableCommands: ["avancer", "tournerDroite", "tournerGauche", "frapper"],
    codeTemplate: `// 3 Kankrelats et 1 Blok autour de toi !
// Tourne et frappe dans chaque direction.

// Le Blok est à droite (2 PV)
frapper();
frapper();

// Le Kankrelat est en haut
tournerGauche();
frapper();

// Continue...`,
    hints: [
        "Tu es au centre. Frappe à droite (Blok×2), en haut, à gauche et en bas",
        "Après avoir tout tué, navigue vers la tour en (10,6)",
    ],
    solution: `frapper();
frapper();
tournerGauche();
frapper();
tournerGauche();
frapper();
tournerGauche();
frapper();
tournerDroite();
tournerDroite();
repeter(5, function() { avancer(); });
tournerDroite();
repeter(3, function() { avancer(); });`,
};

const level14: LevelDef = {
    id: 14, chapter: 3,
    title: "Le Couloir des Gardes",
    description: "Traverse un couloir gardé par des ennemis.",
    story: "Un couloir rempli de Kankrelats mène à la tour. Frappe-les un par un !",
    grid: [
        "############",
        "#..........#",
        "#.H.K.K.K.T#",
        "#..........#",
        "############",
        "............",
        "............",
        "............",
    ],
    objectives: [
        { type: "kill_all", description: "Détruis tous les Kankrelats" },
        { type: "reach_tower", description: "Atteins la tour" },
    ],
    availableCommands: ["avancer", "frapper", "repeter"],
    codeTemplate: `// 3 Kankrelats entre toi et la tour !
// Pattern : avancer, frapper, avancer, frapper...

`,
    hints: [
        "Le pattern se répète : avancer() puis frapper()",
        "repeter(3, function() { avancer(); frapper(); })",
        "Puis avance une dernière fois pour la tour",
    ],
    solution: `repeter(3, function() {
  avancer();
  frapper();
});
repeter(3, function() { avancer(); });`,
};

const level15: LevelDef = {
    id: 15, chapter: 3,
    title: "Bloks et Kankrelats",
    description: "Combats un mélange d'ennemis — certains plus résistants !",
    story: "XANA a envoyé ses meilleures troupes. Les Bloks nécessitent 2 coups, les Kankrelats 1 seul.",
    grid: [
        "............",
        ".H..B..K..T.",
        "............",
        "............",
        ".........K..",
        "......B.....",
        "............",
        "............",
    ],
    objectives: [
        { type: "kill_all", description: "Détruis tous les ennemis" },
        { type: "reach_tower", description: "Atteins la tour" },
    ],
    availableCommands: ["avancer", "tournerDroite", "tournerGauche", "frapper", "repeter"],
    codeTemplate: `// Bloks (B) = 2 PV, Kankrelats (K) = 1 PV
// Planifie ton parcours pour tous les éliminer !

`,
    hints: [
        "Commence par le Blok à droite (frappe 2 fois)",
        "Puis le Kankrelat plus loin (frappe 1 fois)",
        "Enfin, descends pour les deux derniers avant de revenir à la tour",
    ],
    solution: `repeter(3, function() { avancer(); });
frapper();
frapper();
repeter(3, function() { avancer(); });
frapper();
repeter(3, function() { avancer(); });
tournerDroite();
repeter(3, function() { avancer(); });
tournerDroite();
avancer();
frapper();
tournerDroite();
repeter(4, function() { avancer(); });
frapper();
frapper();
tournerGauche();
tournerGauche();
repeter(4, function() { avancer(); });
tournerGauche();
repeter(4, function() { avancer(); });
tournerGauche();
repeter(5, function() { avancer(); });`,
};

// ════════════════════════════════════════════════
// CHAPITRE 4 — Conditions (16-20)
// Commandes: + si / sinon (via if/else)
// ════════════════════════════════════════════════

const level16: LevelDef = {
    id: 16, chapter: 4,
    title: "Les Conditions",
    description: "Utilise if/else pour prendre des décisions.",
    story: "Jérémie a programmé un scanner : tu peux maintenant détecter les ennemis devant toi avec siEnnemi() !",
    grid: [
        "............",
        "............",
        "............",
        "H..K....T...",
        "............",
        "............",
        "............",
        "............",
    ],
    objectives: [
        { type: "kill_all", description: "Détruis le Kankrelat" },
        { type: "reach_tower", description: "Atteins la tour" },
    ],
    availableCommands: ["avancer", "frapper", "repeter"],
    codeTemplate: `// Avance et frappe si tu rencontres un ennemi !
// Pour l'instant, on sait où est l'ennemi.

repeter(8, function() {
  // Avance vers la tour
  // Si un ennemi bloque, frappe-le d'abord !
  avancer();
});`,
    hints: [
        "L'ennemi est à la position 3, tu ne peux pas avancer dessus",
        "Avance 2 fois, frappe, puis avance 5 fois jusqu'à la tour",
    ],
    solution: `avancer();
avancer();
frapper();
repeter(5, function() { avancer(); });`,
};

const level17: LevelDef = {
    id: 17, chapter: 4,
    title: "Choix du chemin",
    description: "Choisis le bon chemin selon les obstacles.",
    story: "Deux couloirs : un avec des ennemis, un avec des murs. Choisis le plus efficace !",
    grid: [
        "######T#####",
        "#..........#",
        "#.####.###.#",
        "#.#K...#...#",
        "#.#.K..#.#.#",
        "#.####.#.#.#",
        "#......#...#",
        "#.H########.",
    ],
    objectives: [{ type: "reach_tower", description: "Atteins la tour" }],
    availableCommands: ["avancer", "tournerDroite", "tournerGauche", "frapper", "repeter"],
    codeTemplate: `// Trouve le chemin vers la tour en haut !
// Il y a des ennemis ET des murs.

`,
    hints: [
        "Le chemin par la gauche a des ennemis, par la droite des murs",
        "Par la droite : monte, tourne à droite...",
    ],
    solution: `tournerGauche();
repeter(6, function() { avancer(); });
tournerDroite();
repeter(5, function() { avancer(); });`,
};

const level18: LevelDef = {
    id: 18, chapter: 4,
    title: "Patrouille",
    description: "Explore et nettoie une zone de tous ses ennemis.",
    story: "XANA a infesté cette zone. Élimine tous les monstres !",
    grid: [
        "............",
        "..K...K.....",
        "............",
        "..H.........",
        "............",
        "..K...K.....",
        "............",
        "............",
    ],
    objectives: [{ type: "kill_all", description: "Détruis les 4 Kankrelats" }],
    availableCommands: ["avancer", "tournerDroite", "tournerGauche", "frapper", "repeter"],
    codeTemplate: `// 4 Kankrelats aux coins d'un carré.
// Fais le tour et élimine-les tous !

`,
    hints: [
        "Monte de 2, frappe le K en (2,1)",
        "Avance vers la droite pour le K en (6,1)",
        "Descends pour les deux du bas",
    ],
    solution: `tournerGauche();
avancer();
frapper();
tournerDroite();
repeter(4, function() { avancer(); });
tournerDroite();
frapper();
avancer();
repeter(4, function() { avancer(); });
tournerDroite();
frapper();
avancer();
tournerDroite();
repeter(4, function() { avancer(); });
tournerDroite();
frapper();`,
};

const level19: LevelDef = {
    id: 19, chapter: 4,
    title: "Le Piège de XANA",
    description: "Navigue dans un labyrinthe piégé avec des ennemis.",
    story: "XANA a piégé un labyrinthe avec des monstres aux intersections. Sois prudent !",
    grid: [
        "H...#.......",
        "###.#.###.#.",
        "....#.#.T.#.",
        ".####.#.###.",
        "..........#.",
        ".####.####..",
        "....#.......",
        "............",
    ],
    objectives: [{ type: "reach_tower", description: "Atteins la tour" }],
    availableCommands: ["avancer", "tournerDroite", "tournerGauche", "frapper", "repeter"],
    codeTemplate: `// Labyrinthe complexe ! Planifie ton chemin.

`,
    hints: [
        "Suis le chemin libre : droite, bas, droite...",
        "Pas d'ennemis cette fois, juste de la navigation",
    ],
    solution: `repeter(3, function() { avancer(); });
tournerDroite();
repeter(2, function() { avancer(); });
tournerGauche();
avancer();
tournerDroite();
repeter(2, function() { avancer(); });
tournerGauche();
repeter(2, function() { avancer(); });
tournerGauche();
avancer();
avancer();`,
};

const level20: LevelDef = {
    id: 20, chapter: 4,
    title: "Mission Mixte",
    description: "Combat, collecte et navigation combinés.",
    story: "Mission complète : élimine les ennemis, ramasse les items ET atteins la tour !",
    grid: [
        "H..P..K.....",
        "............",
        "...###......",
        "...#P.B.....",
        "...###......",
        "............",
        "......P..T..",
        "............",
    ],
    objectives: [
        { type: "kill_all", description: "Détruis tous les ennemis" },
        { type: "collect_all", description: "Ramasse tous les objets" },
        { type: "reach_tower", description: "Atteins la tour" },
    ],
    availableCommands: ["avancer", "tournerDroite", "tournerGauche", "frapper", "repeter"],
    codeTemplate: `// Mission triple :
// 1. Élimine tous les ennemis
// 2. Ramasse tous les objets (P)
// 3. Atteins la tour (T)

`,
    hints: [
        "Commence par ramasser P en (3,0) et tuer K en (6,0)",
        "Descends pour le Blok et le P",
        "Finis par le P en bas et la tour",
    ],
    solution: `repeter(3, function() { avancer(); });
repeter(2, function() { avancer(); });
frapper();
tournerDroite();
repeter(3, function() { avancer(); });
tournerDroite();
avancer();
frapper();
frapper();
tournerGauche();
tournerGauche();
avancer();
tournerGauche();
repeter(2, function() { avancer(); });
tournerDroite();
repeter(3, function() { avancer(); });
avancer();`,
};

// ════════════════════════════════════════════════
// CHAPITRE 5 — Fonctions (21-25)
// Commandes: fonctions personnalisées
// ════════════════════════════════════════════════

const level21: LevelDef = {
    id: 21, chapter: 5,
    title: "Créer ses Fonctions",
    description: "Définis ta propre fonction pour simplifier le code.",
    story: "Jérémie t'apprend à créer des fonctions ! Définis faireUnL() pour naviguer plus efficacement.",
    grid: [
        "H...#.......",
        "....#.......",
        "....#.......",
        "....#..T....",
        "............",
        "............",
        "............",
        "............",
    ],
    objectives: [{ type: "reach_tower", description: "Atteins la tour" }],
    availableCommands: ["avancer", "tournerDroite", "tournerGauche", "repeter"],
    codeTemplate: `// Définis une fonction pour faire un virage + avancer !
function virageEtAvance() {
  tournerDroite();
  repeter(3, function() { avancer(); });
  tournerGauche();
}

// Utilise ta fonction maintenant !
repeter(4, function() { avancer(); });
// ...`,
    hints: [
        "Avance 4 fois vers la droite, puis descends de 3 cases",
        "Puis tournerGauche() et avance 3 fois vers la droite",
    ],
    solution: `repeter(4, function() { avancer(); });
tournerDroite();
repeter(3, function() { avancer(); });
tournerGauche();
repeter(3, function() { avancer(); });`,
};

const level22: LevelDef = {
    id: 22, chapter: 5,
    title: "Fonction d'Attaque",
    description: "Crée une fonction qui approche et attaque un ennemi.",
    story: "Crée une fonction approcheetfrappe() qui s'approche d'un pas et frappe !",
    grid: [
        "............",
        "............",
        "H.K..K..K.T.",
        "............",
        "............",
        "............",
        "............",
        "............",
    ],
    objectives: [
        { type: "kill_all", description: "Élimine les 3 Kankrelats" },
        { type: "reach_tower", description: "Atteins la tour" },
    ],
    availableCommands: ["avancer", "frapper", "repeter"],
    codeTemplate: `// Crée une fonction pour approcher et attaquer !
function approcheetfrappe() {
  avancer();
  frapper();
}

// Utilise-la 3 fois pour les 3 Kankrelats
repeter(3, function() {
  approcheetfrappe();
  avancer(); // passe sur la case vide
});`,
    hints: [
        "Le pattern : avancer vers l'ennemi, frapper, avancer sur sa case",
        "approcheetfrappe() + avancer() à répéter 3 fois",
    ],
    solution: `function approcheetfrappe() {
  avancer();
  frapper();
}
repeter(3, function() {
  approcheetfrappe();
  avancer();
});
avancer();`,
};

const level23: LevelDef = {
    id: 23, chapter: 5,
    title: "Patrouille Optimisée",
    description: "Utilise des fonctions pour patrouiller efficacement.",
    story: "Crée une fonction de patrouille qui nettoie un couloir entier !",
    grid: [
        "H.K.K.K.....",
        "###########.",
        "..........K.",
        ".###########",
        ".K.K.K.....T",
        "............",
        "............",
        "............",
    ],
    objectives: [
        { type: "kill_all", description: "Élimine tous les Kankrelats" },
        { type: "reach_tower", description: "Atteins la tour" },
    ],
    availableCommands: ["avancer", "tournerDroite", "tournerGauche", "frapper", "repeter"],
    codeTemplate: `// Deux couloirs avec des Kankrelats !
// Pattern identique dans chaque couloir.

function nettoyerCouloir() {
  repeter(3, function() {
    avancer();
    frapper();
    avancer();
  });
}

// Couloir du haut
nettoyerCouloir();
// Comment atteindre le couloir du bas ?`,
    hints: [
        "Après le 1er couloir : tournerDroite, avancer 2, tournerDroite",
        "Le 2ème couloir est en sens inverse",
    ],
    solution: `function combatAvance() {
  avancer();
  frapper();
  avancer();
}
repeter(3, function() { combatAvance(); });
tournerDroite();
avancer();
avancer();
tournerDroite();
repeter(3, function() { combatAvance(); });
tournerGauche();
avancer();
avancer();
tournerGauche();
repeter(3, function() { combatAvance(); });
repeter(5, function() { avancer(); });`,
};

const level24: LevelDef = {
    id: 24, chapter: 5,
    title: "Le Nettoyeur de Zone",
    description: "Nettoie une grille d'ennemis systématiquement.",
    story: "Une zone 4×4 infestée de Kankrelats. Crée un pattern de nettoyage !",
    grid: [
        "............",
        "..K.K.K.K...",
        "............",
        "..K.K.K.K...",
        "............",
        "........T...",
        "............",
        "H...........",
    ],
    objectives: [
        { type: "kill_all", description: "Tous les Kankrelats éliminés" },
        { type: "reach_tower", description: "Atteins la tour" },
    ],
    availableCommands: ["avancer", "tournerDroite", "tournerGauche", "frapper", "repeter"],
    codeTemplate: `// 8 Kankrelats en grille !
// Crée un pattern de nettoyage efficace.

`,
    hints: [
        "Monte jusqu'à la première rangée et nettoie de gauche à droite",
        "Descends et nettoie la seconde rangée",
    ],
    solution: `tournerGauche();
repeter(6, function() { avancer(); });
tournerDroite();
avancer();
repeter(4, function() {
  avancer();
  frapper();
  avancer();
});
tournerDroite();
avancer();
avancer();
tournerDroite();
repeter(4, function() {
  avancer();
  frapper();
  avancer();
});
tournerGauche();
avancer();
tournerGauche();
repeter(6, function() { avancer(); });`,
};

const level25: LevelDef = {
    id: 25, chapter: 5,
    title: "Mission d'Élite",
    description: "Combine toutes les compétences pour une mission complexe.",
    story: "Mission d'élite : collecte, combat et navigation. Montre ce que tu sais faire !",
    grid: [
        "...#.P......",
        ".H.#........",
        "...#..B.....",
        "...#..#.....",
        ".P.#..#.K...",
        "...#..#.....",
        "...#..#..P..",
        "...#..#..T..",
    ],
    objectives: [
        { type: "kill_all", description: "Élimine tous les ennemis" },
        { type: "collect_all", description: "Ramasse tous les objets" },
        { type: "reach_tower", description: "Atteins la tour" },
    ],
    availableCommands: ["avancer", "tournerDroite", "tournerGauche", "frapper", "repeter"],
    codeTemplate: `// Mission d'élite complète !
// Objectifs : tout éliminer, tout ramasser, atteindre la tour.

`,
    hints: [
        "Commence par descendre chercher le P en (1,4)",
        "Puis monte chercher le P en (5,0)",
        "Combat le Blok, puis le Kankrelat, puis finis par la tour",
    ],
    solution: `tournerDroite();
repeter(3, function() { avancer(); });
tournerGauche();
tournerGauche();
repeter(6, function() { avancer(); });
tournerGauche();
repeter(3, function() { avancer(); });
tournerDroite();
avancer();
frapper();
frapper();
repeter(2, function() { avancer(); });
frapper();
repeter(2, function() { avancer(); });
tournerDroite();
avancer();`,
};

// ════════════════════════════════════════════════
// CHAPITRE 6 — Boss XANA (26-30)
// Tout combiné + boss final
// ════════════════════════════════════════════════

const level26: LevelDef = {
    id: 26, chapter: 6,
    title: "Avant-Poste XANA",
    description: "Pénètre dans le territoire de XANA.",
    story: "Tu t'approches du cœur de XANA. Les défenses se renforcent !",
    grid: [
        "H.........K.",
        ".#########..",
        "..........K.",
        ".#########..",
        "..........K.",
        ".#########..",
        "..........K.",
        "..........T.",
    ],
    objectives: [
        { type: "kill_all", description: "Élimine toutes les sentinelles" },
        { type: "reach_tower", description: "Active la tour" },
    ],
    availableCommands: ["avancer", "tournerDroite", "tournerGauche", "frapper", "repeter"],
    codeTemplate: `// 4 Kankrelats gardent le chemin en zigzag.
// Optimise avec repeter() !

`,
    hints: [
        "Pattern : avancer 10 fois, frapper, tourner, avancer 1, tourner",
    ],
    solution: `repeter(4, function() {
  repeter(9, function() { avancer(); });
  frapper();
  tournerDroite();
  avancer();
  tournerDroite();
  repeter(9, function() { avancer(); });
  tournerGauche();
  avancer();
  tournerGauche();
});`,
};

const level27: LevelDef = {
    id: 27, chapter: 6,
    title: "Forteresse de Bloks",
    description: "Une forteresse gardée par des Bloks résistants.",
    story: "Les Bloks forment un mur de défense. Chacun nécessite 2 coups !",
    grid: [
        "............",
        "............",
        "....BBBBB...",
        "....B...B...",
        ".H..B.T.B...",
        "....B...B...",
        "....BBBBB...",
        "............",
    ],
    objectives: [
        { type: "reach_tower", description: "Atteins la tour au centre" },
    ],
    availableCommands: ["avancer", "tournerDroite", "tournerGauche", "frapper", "repeter"],
    codeTemplate: `// La forteresse a une entrée !
// Cherche un passage ou force-le.

`,
    hints: [
        "Il faut percer le mur de Bloks",
        "Chaque Blok nécessite 2 coups : frapper(); frapper();",
        "Le chemin le plus court : perce un seul Blok et entre",
    ],
    solution: `repeter(3, function() { avancer(); });
frapper();
frapper();
avancer();
frapper();
frapper();
avancer();`,
};

const level28: LevelDef = {
    id: 28, chapter: 6,
    title: "L'Arène",
    description: "Combat tous les ennemis dans l'arène de XANA.",
    story: "XANA t'a piégé dans son arène ! Élimine toutes ses créatures pour en sortir.",
    grid: [
        "############",
        "#H.........#",
        "#..K...B...#",
        "#..........#",
        "#...B...K..#",
        "#..........#",
        "#..K...B..T#",
        "############",
    ],
    objectives: [
        { type: "kill_all", description: "Élimine tous les ennemis de l'arène" },
        { type: "reach_tower", description: "Active la tour de sortie" },
    ],
    availableCommands: ["avancer", "tournerDroite", "tournerGauche", "frapper", "repeter"],
    codeTemplate: `// 3 Kankrelats et 3 Bloks dans l'arène !
// Planifie un chemin efficace.

`,
    hints: [
        "Commence par le K le plus proche en (3,2)",
        "Puis le B en (7,2), etc.",
        "Les Bloks prennent 2 coups chacun",
    ],
    solution: `avancer();
avancer();
tournerDroite();
frapper();
tournerGauche();
repeter(4, function() { avancer(); });
tournerDroite();
frapper();
frapper();
avancer();
avancer();
tournerDroite();
avancer();
frapper();
frapper();
tournerGauche();
repeter(2, function() { avancer(); });
tournerDroite();
frapper();
tournerGauche();
repeter(2, function() { avancer(); });
tournerDroite();
frapper();
frapper();
avancer();
tournerDroite();
frapper();
repeter(3, function() { avancer(); });`,
};

const level29: LevelDef = {
    id: 29, chapter: 6,
    title: "Dernière Ligne Droite",
    description: "Le dernier obstacle avant XANA.",
    story: "Jérémie : 'Plus qu'un seul niveau ! La tour finale est juste derrière cette ligne de défense !'",
    grid: [
        "H..B..B..B..",
        "..........B.",
        "..B..B..B...",
        "...........B",
        "..B..B..B...",
        "..........B.",
        "..B..B..B..T",
        "............",
    ],
    objectives: [
        { type: "kill_all", description: "Perce la défense de XANA" },
        { type: "reach_tower", description: "Atteins la tour finale" },
    ],
    availableCommands: ["avancer", "tournerDroite", "tournerGauche", "frapper", "repeter"],
    codeTemplate: `// Le champ de bataille final !
// Beaucoup de Bloks... utilise repeter() et des fonctions !

function percerBlok() {
  frapper();
  frapper();
  avancer();
}

// À toi de jouer...`,
    hints: [
        "Les Bloks sont en pattern régulier",
        "Perce un chemin en ligne droite et en zigzag",
    ],
    solution: `function percerBlok() {
  frapper();
  frapper();
  avancer();
}
repeter(2, function() { avancer(); });
repeter(3, function() {
  percerBlok();
  repeter(2, function() { avancer(); });
});
tournerDroite();
avancer();
percerBlok();
tournerDroite();
repeter(2, function() { avancer(); });
repeter(3, function() {
  percerBlok();
  repeter(2, function() { avancer(); });
});
tournerDroite();
avancer();
percerBlok();
tournerDroite();
repeter(2, function() { avancer(); });
repeter(3, function() {
  percerBlok();
  repeter(2, function() { avancer(); });
});`,
};

const level30: LevelDef = {
    id: 30, chapter: 6,
    title: "⚡ Le Cœur de XANA ⚡",
    description: "Le boss final ! Désactive le cœur de XANA !",
    story: "Tu y es ! Le cœur de XANA est devant toi, protégé par ses plus puissants serviteurs. Aelita compte sur toi pour désactiver la tour finale et sauver Lyoko !",
    grid: [
        "###.T.###...",
        "###...###...",
        "#.B.B.B.#...",
        "#.......#...",
        "#..B.B..#...",
        "#.......#...",
        "#.B.B.B.#...",
        "###.H.###...",
    ],
    objectives: [
        { type: "kill_all", description: "Détruis toutes les défenses de XANA" },
        { type: "reach_tower", description: "Désactive le cœur de XANA" },
    ],
    availableCommands: ["avancer", "tournerDroite", "tournerGauche", "frapper", "repeter"],
    codeTemplate: `// ⚡ BOSS FINAL — Le Cœur de XANA ⚡
//
// 9 Bloks défendent le cœur !
// Chaque Blok = 2 PV
//
// La tour est tout en haut au centre.
// C'est le moment de montrer tout ce que tu as appris !

function percerBlok() {
  frapper();
  frapper();
  avancer();
}

// À toi de jouer, guerrier de Lyoko !`,
    hints: [
        "Tu commences en bas au centre, la tour est en haut au centre",
        "Nettoie la rangée du bas, monte, nettoie le milieu, monte, nettoie le haut",
        "Les Bloks sont positionnés symétriquement",
    ],
    solution: `function percerBlok() {
  frapper();
  frapper();
  avancer();
}
tournerGauche();
avancer();
percerBlok();
avancer();
percerBlok();
tournerDroite();
tournerDroite();
repeter(4, function() { avancer(); });
percerBlok();
tournerGauche();
avancer();
avancer();
tournerGauche();
avancer();
percerBlok();
avancer();
percerBlok();
tournerGauche();
avancer();
avancer();
tournerGauche();
avancer();
percerBlok();
avancer();
percerBlok();
tournerDroite();
tournerDroite();
repeter(4, function() { avancer(); });
percerBlok();
tournerGauche();
avancer();
avancer();`,
};

// ═══════════════ EXPORT ═══════════════

export const LYOKO_LEVELS: LevelDef[] = [
    level1, level2, level3, level4, level5,
    level6, level7, level8, level9, level10,
    level11, level12, level13, level14, level15,
    level16, level17, level18, level19, level20,
    level21, level22, level23, level24, level25,
    level26, level27, level28, level29, level30,
];

export const CHAPTERS = [
    { id: 1, title: "Premiers Pas sur Lyoko", description: "Apprends à te déplacer", color: "#00d4ff", levels: [1, 2, 3, 4, 5] },
    { id: 2, title: "Navigation Avancée", description: "Maîtrise repeter()", color: "#00ff88", levels: [6, 7, 8, 9, 10] },
    { id: 3, title: "Combat XANA", description: "Apprends à combattre", color: "#ff2244", levels: [11, 12, 13, 14, 15] },
    { id: 4, title: "Conditions", description: "Prends des décisions", color: "#fbbf24", levels: [16, 17, 18, 19, 20] },
    { id: 5, title: "Fonctions", description: "Crée tes fonctions", color: "#c084fc", levels: [21, 22, 23, 24, 25] },
    { id: 6, title: "Boss XANA", description: "Le combat final", color: "#f472b6", levels: [26, 27, 28, 29, 30] },
];
