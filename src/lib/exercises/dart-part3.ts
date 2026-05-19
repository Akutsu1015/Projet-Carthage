import { addExercises } from "./registry";
import type { Exercise } from "./registry";

// @ts-nocheck — Auto-converted from exercises-dart-part3.js
const exercises: Exercise[] = [
    // ─── INTRO: Le projet ──────────────────────────────────────────
    {
      id: "dart_56", type: "intro", category: "Endless Runner - Setup",
      title: "Projet : Endless Runner !",
      description: "Construisez un vrai jeu mobile étape par étape.",
      content: `
        <h5 style="color:#ff2244;">🎮 Projet Final : Endless Runner</h5>
        <p>Vous allez construire un <strong>jeu Endless Runner</strong> complet en Flutter !</p>
        <p>Le personnage court automatiquement. Le joueur doit <strong>sauter</strong> pour éviter les obstacles et <strong>collecter des pièces</strong> pour augmenter son score.</p>
        <div style="background:rgba(0,212,255,0.1);border-radius:8px;padding:1rem;margin:1rem 0;">
          <strong>🎨 Assets fournis :</strong>
          <ul style="margin:0.5rem 0 0;">
            <li>🏃 <strong>Personnage</strong> — Robot Lyoko animé</li>
            <li>🚧 <strong>Obstacles</strong> — Blocs XANA</li>
            <li>🪙 <strong>Pièces</strong> — Pièces Carthage</li>
            <li>🌍 <strong>Décor</strong> — Sol et ciel de Lyoko</li>
          </ul>
          <p style="margin:0.5rem 0 0;font-size:0.85rem;">Tous les assets graphiques sont <strong>déjà intégrés</strong>. Concentrez-vous uniquement sur le code !</p>
        </div>
        <div style="background:rgba(255,34,68,0.1);border-radius:8px;padding:1rem;">
          <strong>📱 Émulateur requis :</strong> Activez l'émulateur Android (bouton vert) pour voir votre jeu prendre vie au fur et à mesure !
        </div>
      `
    },
    // ─── Étape 1 : Structure du projet ─────────────────────────────
    {
      id: "dart_57", type: "puzzle", category: "Endless Runner - Setup",
      title: "Structure du jeu",
      description: "Créez la structure de base du projet de jeu.",
      instruction: "Reconstituez la structure de base d'un jeu Flutter avec un Scaffold et un fond coloré.",
      pieces: [
        "import 'package:flutter/material.dart';",
        "void main() => runApp(EndlessRunnerApp());",
        "class EndlessRunnerApp extends StatelessWidget {",
        "  @override",
        "  Widget build(BuildContext context) {",
        "    return MaterialApp(",
        "      title: 'Endless Runner',",
        "      theme: ThemeData.dark(),",
        "      home: GameScreen(),",
        "    );",
        "  }",
        "}"
      ],
      hint: "Import d'abord, puis main(), puis la classe StatelessWidget avec build() qui retourne MaterialApp.",
      runner_step: 0
    },
    {
      id: "dart_58", type: "puzzle", category: "Endless Runner - Setup",
      title: "GameScreen — Le widget du jeu",
      description: "Créez le StatefulWidget principal du jeu.",
      instruction: "Reconstituez le widget GameScreen qui sera le conteneur principal du jeu.",
      pieces: [
        "class GameScreen extends StatefulWidget {",
        "  @override",
        "  _GameScreenState createState() => _GameScreenState();",
        "}",
        "class _GameScreenState extends State<GameScreen> {",
        "  @override",
        "  Widget build(BuildContext context) {",
        "    return Scaffold(",
        "      body: Stack(children: []),",
        "    );",
        "  }",
        "}"
      ],
      hint: "StatefulWidget crée un State. Le State utilise build() pour retourner un Scaffold avec un Stack.",
      runner_step: 0
    },
    // ─── Étape 2 : Le décor (fond + sol) ───────────────────────────
    {
      id: "dart_59", type: "intro", category: "Endless Runner - Décor",
      title: "Étape 1 : Le décor",
      description: "Créer le fond et le sol du jeu.",
      content: `
        <h5 style="color:#00d4ff;">🌌 Le décor du jeu</h5>
        <p>Notre jeu a besoin de :</p>
        <ul>
          <li><strong>Un fond</strong> — Ciel étoilé de Lyoko (gradient sombre)</li>
          <li><strong>Un sol</strong> — Terrain vert qui défile</li>
        </ul>
        <p>On utilise un <code>Stack</code> pour superposer les éléments. Le fond est en arrière-plan, le sol en bas.</p>
        <p>L'asset du sol est <strong>déjà fourni</strong> en SVG. Il suffit de le positionner !</p>
      `
    },
    {
      id: "dart_60", type: "puzzle", category: "Endless Runner - Décor",
      title: "Fond du jeu",
      description: "Créez le fond gradient du jeu.",
      instruction: "Reconstituez le Container qui affiche le fond étoilé.",
      pieces: [
        "Container(",
        "  decoration: BoxDecoration(",
        "    gradient: LinearGradient(",
        "      begin: Alignment.topCenter,",
        "      end: Alignment.bottomCenter,",
        "      colors: [",
        "        Color(0xFF1a1a3e),",
        "        Color(0xFF2d1b69),",
        "        Color(0xFF4a1942),",
        "      ],",
        "    ),",
        "  ),",
        ")"
      ],
      hint: "Container > BoxDecoration > LinearGradient avec begin, end et colors.",
      runner_step: 1
    },
    {
      id: "dart_61", type: "puzzle", category: "Endless Runner - Décor",
      title: "Sol du jeu",
      description: "Positionnez le sol en bas de l'écran.",
      instruction: "Reconstituez le Positioned qui place le sol en bas de l'écran.",
      pieces: [
        "Positioned(",
        "  bottom: 0,",
        "  left: 0,",
        "  right: 0,",
        "  height: 60,",
        "  child: Container(",
        "    decoration: BoxDecoration(",
        "      color: Color(0xFF3a6b1e),",
        "      border: Border(top: BorderSide(color: Color(0xFF4a8c2a), width: 3)),",
        "    ),",
        "  ),",
        ")"
      ],
      hint: "Positioned avec bottom:0 place l'élément en bas. Le Container a une couleur verte et une bordure haute.",
      runner_step: 1
    },
    // ─── Étape 3 : Le personnage ───────────────────────────────────
    {
      id: "dart_62", type: "intro", category: "Endless Runner - Personnage",
      title: "Étape 2 : Le personnage",
      description: "Ajouter le robot-héros qui court.",
      content: `
        <h5 style="color:#00d4ff;">🏃 Le personnage</h5>
        <p>Notre héros est un <strong>robot Lyoko</strong>. Il est positionné à gauche de l'écran et peut <strong>sauter</strong>.</p>
        <p>On a besoin de :</p>
        <ul>
          <li>Une variable <code>characterY</code> pour sa position verticale</li>
          <li>Une variable <code>isJumping</code> pour savoir s'il saute</li>
          <li>L'asset SVG du personnage (déjà fourni)</li>
        </ul>
      `
    },
    {
      id: "dart_63", type: "puzzle", category: "Endless Runner - Personnage",
      title: "Variables du personnage",
      description: "Déclarez les variables d'état du personnage.",
      instruction: "Reconstituez les déclarations de variables dans le State du jeu.",
      pieces: [
        "double characterY = 0;",
        "double characterX = 50;",
        "bool isJumping = false;",
        "double jumpVelocity = 0;",
        "final double gravity = 0.8;",
        "final double jumpForce = -12.0;",
        "final double groundY = 0;"
      ],
      hint: "characterY pour la position verticale, isJumping pour l'état, gravity et jumpForce pour la physique.",
      runner_step: 2
    },
    {
      id: "dart_64", type: "puzzle", category: "Endless Runner - Personnage",
      title: "Afficher le personnage",
      description: "Positionnez le personnage sur l'écran.",
      instruction: "Reconstituez le widget Positioned qui affiche le personnage.",
      pieces: [
        "Positioned(",
        "  bottom: 60 + characterY,",
        "  left: characterX,",
        "  child: SizedBox(",
        "    width: 40,",
        "    height: 50,",
        "    child: Image.asset('assets/runner_character.svg'),",
        "  ),",
        ")"
      ],
      hint: "bottom: 60 + characterY place le personnage au-dessus du sol (60px). left: characterX le positionne horizontalement.",
      runner_step: 2
    },
    // ─── Étape 4 : Le saut ─────────────────────────────────────────
    {
      id: "dart_65", type: "intro", category: "Endless Runner - Physique",
      title: "Étape 3 : Le saut",
      description: "Implémenter la physique du saut.",
      content: `
        <h5 style="color:#00d4ff;">🦘 Physique du saut</h5>
        <p>Le saut utilise une <strong>simulation de gravité</strong> simple :</p>
        <ol>
          <li>Quand le joueur touche l'écran → <code>jumpVelocity = jumpForce</code> (négatif = vers le haut)</li>
          <li>À chaque frame → <code>characterY += jumpVelocity</code></li>
          <li>La gravité tire vers le bas → <code>jumpVelocity += gravity</code></li>
          <li>Quand <code>characterY &lt;= 0</code> → le personnage est au sol</li>
        </ol>
        <p>On utilise un <code>Timer.periodic</code> ou un <code>Ticker</code> pour le game loop à ~60 FPS.</p>
      `
    },
    {
      id: "dart_66", type: "puzzle", category: "Endless Runner - Physique",
      title: "Fonction de saut",
      description: "Créez la fonction qui déclenche le saut.",
      instruction: "Reconstituez la méthode jump() qui fait sauter le personnage.",
      pieces: [
        "void jump() {",
        "  if (!isJumping) {",
        "    setState(() {",
        "      isJumping = true;",
        "      jumpVelocity = jumpForce;",
        "    });",
        "  }",
        "}"
      ],
      hint: "On ne peut sauter que si on n'est pas déjà en train de sauter. setState() met à jour l'état.",
      runner_step: 2
    },
    {
      id: "dart_67", type: "puzzle", category: "Endless Runner - Physique",
      title: "Game Loop — Mise à jour",
      description: "Créez la boucle de jeu qui met à jour la physique.",
      instruction: "Reconstituez la méthode updateGame() appelée à chaque frame.",
      pieces: [
        "void updateGame() {",
        "  setState(() {",
        "    if (isJumping) {",
        "      characterY += jumpVelocity;",
        "      jumpVelocity += gravity;",
        "      if (characterY <= 0) {",
        "        characterY = 0;",
        "        isJumping = false;",
        "        jumpVelocity = 0;",
        "      }",
        "    }",
        "  });",
        "}"
      ],
      hint: "On applique la vélocité à Y, puis la gravité à la vélocité. Si Y <= 0, on est au sol.",
      runner_step: 2
    },
    {
      id: "dart_68", type: "puzzle", category: "Endless Runner - Physique",
      title: "Détecter le tap",
      description: "Ajoutez la détection du toucher pour sauter.",
      instruction: "Reconstituez le GestureDetector qui enveloppe le jeu.",
      pieces: [
        "GestureDetector(",
        "  onTap: () {",
        "    jump();",
        "  },",
        "  child: Stack(",
        "    children: [",
        "      backgroundWidget,",
        "      groundWidget,",
        "      characterWidget,",
        "    ],",
        "  ),",
        ")"
      ],
      hint: "GestureDetector enveloppe le Stack du jeu. onTap appelle jump().",
      runner_step: 2
    },
    // ─── Étape 5 : Les obstacles ───────────────────────────────────
    {
      id: "dart_69", type: "intro", category: "Endless Runner - Obstacles",
      title: "Étape 4 : Les obstacles",
      description: "Ajouter des obstacles XANA qui défilent.",
      content: `
        <h5 style="color:#ff2244;">🚧 Les obstacles XANA</h5>
        <p>Les obstacles sont des <strong>blocs XANA</strong> qui arrivent de la droite et défilent vers la gauche.</p>
        <ul>
          <li>Chaque obstacle a une position <code>x</code> qui diminue à chaque frame</li>
          <li>Quand un obstacle sort de l'écran (x &lt; -30), il est recyclé à droite</li>
          <li>L'asset SVG de l'obstacle est <strong>déjà fourni</strong></li>
        </ul>
      `
    },
    {
      id: "dart_70", type: "puzzle", category: "Endless Runner - Obstacles",
      title: "Classe Obstacle",
      description: "Créez la classe qui représente un obstacle.",
      instruction: "Reconstituez la classe Obstacle avec ses propriétés.",
      pieces: [
        "class Obstacle {",
        "  double x;",
        "  double width;",
        "  double height;",
        "  bool passed = false;",
        "",
        "  Obstacle({",
        "    required this.x,",
        "    this.width = 30,",
        "    this.height = 40,",
        "  });",
        "}"
      ],
      hint: "La classe a x (position), width, height et passed (pour le score).",
      runner_step: 3
    },
    {
      id: "dart_71", type: "puzzle", category: "Endless Runner - Obstacles",
      title: "Déplacer les obstacles",
      description: "Faites défiler les obstacles vers la gauche.",
      instruction: "Reconstituez la logique de déplacement des obstacles dans le game loop.",
      pieces: [
        "for (var obstacle in obstacles) {",
        "  obstacle.x -= gameSpeed;",
        "  if (obstacle.x < -obstacle.width) {",
        "    obstacle.x = screenWidth + Random().nextInt(200).toDouble();",
        "    obstacle.passed = false;",
        "  }",
        "}"
      ],
      hint: "Chaque obstacle se déplace vers la gauche (x -= speed). S'il sort de l'écran, on le replace à droite.",
      runner_step: 3
    },
    {
      id: "dart_72", type: "puzzle", category: "Endless Runner - Obstacles",
      title: "Afficher un obstacle",
      description: "Positionnez un obstacle sur l'écran.",
      instruction: "Reconstituez le widget Positioned pour afficher un obstacle.",
      pieces: [
        "...obstacles.map((obs) => Positioned(",
        "  bottom: 60,",
        "  left: obs.x,",
        "  child: SizedBox(",
        "    width: obs.width,",
        "    height: obs.height,",
        "    child: Image.asset('assets/runner_obstacle.svg'),",
        "  ),",
        ")).toList(),"
      ],
      hint: "On utilise le spread operator (...) pour ajouter tous les obstacles au Stack. Chaque obstacle est un Positioned.",
      runner_step: 3
    },
    // ─── Étape 6 : Collisions ──────────────────────────────────────
    {
      id: "dart_73", type: "intro", category: "Endless Runner - Collisions",
      title: "Étape 5 : Collisions",
      description: "Détecter les collisions entre le personnage et les obstacles.",
      content: `
        <h5 style="color:#ff2244;">💥 Détection de collisions</h5>
        <p>On utilise une <strong>collision AABB</strong> (Axis-Aligned Bounding Box) simple :</p>
        <p>Deux rectangles se chevauchent si :</p>
        <ul>
          <li><code>rect1.left &lt; rect2.right</code></li>
          <li><code>rect1.right &gt; rect2.left</code></li>
          <li><code>rect1.top &lt; rect2.bottom</code></li>
          <li><code>rect1.bottom &gt; rect2.top</code></li>
        </ul>
      `
    },
    {
      id: "dart_74", type: "puzzle", category: "Endless Runner - Collisions",
      title: "Fonction de collision",
      description: "Créez la fonction qui détecte les collisions.",
      instruction: "Reconstituez la méthode checkCollision().",
      pieces: [
        "bool checkCollision(Obstacle obs) {",
        "  double charLeft = characterX;",
        "  double charRight = characterX + 40;",
        "  double charBottom = 60 + characterY;",
        "  double charTop = charBottom + 50;",
        "  double obsLeft = obs.x;",
        "  double obsRight = obs.x + obs.width;",
        "  double obsTop = 60 + obs.height;",
        "  return charRight > obsLeft &&",
        "    charLeft < obsRight &&",
        "    charBottom < obsTop &&",
        "    charTop > 60;",
        "}"
      ],
      hint: "On compare les bords du personnage avec ceux de l'obstacle. Si tous les tests passent, il y a collision.",
      runner_step: 3
    },
    {
      id: "dart_75", type: "puzzle", category: "Endless Runner - Collisions",
      title: "Game Over",
      description: "Gérez le game over quand il y a collision.",
      instruction: "Reconstituez la logique de game over.",
      pieces: [
        "void handleCollisions() {",
        "  for (var obs in obstacles) {",
        "    if (checkCollision(obs)) {",
        "      setState(() {",
        "        isGameOver = true;",
        "        gameTimer?.cancel();",
        "      });",
        "      break;",
        "    }",
        "  }",
        "}"
      ],
      hint: "On parcourt les obstacles. Si collision détectée, on met isGameOver à true et on arrête le timer.",
      runner_step: 3
    },
    // ─── Étape 7 : Score et pièces ─────────────────────────────────
    {
      id: "dart_76", type: "intro", category: "Endless Runner - Score",
      title: "Étape 6 : Score et pièces",
      description: "Ajouter un système de score et des pièces à collecter.",
      content: `
        <h5 style="color:#fbbf24;">🪙 Score et pièces</h5>
        <p>Le score augmente de deux façons :</p>
        <ul>
          <li><strong>+1 point</strong> par obstacle évité (quand l'obstacle passe derrière le personnage)</li>
          <li><strong>+5 points</strong> par pièce collectée</li>
        </ul>
        <p>Les pièces flottent en l'air et disparaissent quand le personnage les touche.</p>
      `
    },
    {
      id: "dart_77", type: "puzzle", category: "Endless Runner - Score",
      title: "Afficher le score",
      description: "Créez le widget d'affichage du score.",
      instruction: "Reconstituez le Positioned qui affiche le score en haut à droite.",
      pieces: [
        "Positioned(",
        "  top: 40,",
        "  right: 16,",
        "  child: Container(",
        "    padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),",
        "    decoration: BoxDecoration(",
        "      color: Colors.black45,",
        "      borderRadius: BorderRadius.circular(16),",
        "    ),",
        "    child: Text(",
        "      'Score: $score',",
        "      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),",
        "    ),",
        "  ),",
        ")"
      ],
      hint: "Positioned en haut à droite, Container avec fond semi-transparent, Text avec le score.",
      runner_step: 4
    },
    {
      id: "dart_78", type: "puzzle", category: "Endless Runner - Score",
      title: "Collecter une pièce",
      description: "Détectez et collectez les pièces.",
      instruction: "Reconstituez la logique de collecte des pièces.",
      pieces: [
        "void checkCoinCollection() {",
        "  coins.removeWhere((coin) {",
        "    bool collected = checkCoinCollision(coin);",
        "    if (collected) {",
        "      setState(() {",
        "        score += 5;",
        "      });",
        "    }",
        "    return collected;",
        "  });",
        "}"
      ],
      hint: "removeWhere supprime les pièces collectées. Si collision, on ajoute 5 au score.",
      runner_step: 5
    },
    // ─── Étape 8 : Écran Game Over et restart ──────────────────────
    {
      id: "dart_79", type: "puzzle", category: "Endless Runner - Finalisation",
      title: "Écran Game Over",
      description: "Créez l'écran de fin de partie.",
      instruction: "Reconstituez le widget d'écran Game Over avec le score final et un bouton rejouer.",
      pieces: [
        "if (isGameOver) Container(",
        "  color: Colors.black54,",
        "  child: Center(",
        "    child: Column(",
        "      mainAxisSize: MainAxisSize.min,",
        "      children: [",
        "        Text('GAME OVER', style: TextStyle(fontSize: 32, color: Colors.red, fontWeight: FontWeight.bold)),",
        "        SizedBox(height: 16),",
        "        Text('Score: $score', style: TextStyle(fontSize: 24, color: Colors.white)),",
        "        SizedBox(height: 24),",
        "        ElevatedButton(onPressed: restartGame, child: Text('Rejouer')),",
        "      ],",
        "    ),",
        "  ),",
        ")"
      ],
      hint: "Un Container semi-transparent recouvre le jeu. Column centre le texte GAME OVER, le score et le bouton.",
      runner_step: 5,
      simulator_render_success: `<div style="display:flex;flex-direction:column;height:100%;position:relative;background:linear-gradient(180deg,#1a1a3e 0%,#2d1b69 40%,#4a1942 100%);font-family:'Inter',sans-serif;">
        <div style="position:absolute;bottom:0;left:0;width:100%;height:60px;background:#3a6b1e;border-top:3px solid #4a8c2a;"></div>
        <div style="position:absolute;inset:0;background:rgba(0,0,0,0.6);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;">
          <span style="font-size:1.5rem;font-weight:900;color:#ff2244;font-family:'Orbitron',sans-serif;">GAME OVER</span>
          <span style="font-size:1.1rem;color:#fff;">Score: 42</span>
          <button style="background:#6200EE;color:#fff;border:none;padding:10px 28px;border-radius:8px;font-size:0.9rem;cursor:pointer;margin-top:8px;">Rejouer</button>
        </div>
      </div>`
    },
    {
      id: "dart_80", type: "puzzle", category: "Endless Runner - Finalisation",
      title: "Fonction Restart",
      description: "Créez la fonction qui relance le jeu.",
      instruction: "Reconstituez la méthode restartGame() qui remet tout à zéro.",
      pieces: [
        "void restartGame() {",
        "  setState(() {",
        "    score = 0;",
        "    characterY = 0;",
        "    isJumping = false;",
        "    isGameOver = false;",
        "    jumpVelocity = 0;",
        "    obstacles = generateObstacles();",
        "    coins = generateCoins();",
        "  });",
        "  startGameLoop();",
        "}"
      ],
      hint: "On remet toutes les variables à leur état initial dans setState(), puis on relance le game loop.",
      runner_step: 5,
      simulator_render_success: `<div style="display:flex;flex-direction:column;height:100%;position:relative;background:linear-gradient(180deg,#1a1a3e 0%,#2d1b69 40%,#4a1942 100%);font-family:'Inter',sans-serif;overflow:hidden;">
        <div style="position:absolute;top:10px;right:10px;color:#fff;font-family:'Orbitron',monospace;font-size:0.7rem;background:rgba(0,0,0,0.4);padding:4px 10px;border-radius:12px;">Score: 0</div>
        <div style="position:absolute;bottom:0;left:0;width:100%;height:60px;background:linear-gradient(0deg,#2d5016,#3a6b1e);border-top:3px solid #4a8c2a;"></div>
        <svg viewBox="0 0 40 50" style="position:absolute;bottom:60px;left:20%;width:40px;height:50px;">
          <rect x="12" y="0" width="16" height="16" rx="4" fill="#00d4ff"/>
          <circle cx="17" cy="7" r="2" fill="#fff"/><circle cx="27" cy="7" r="2" fill="#fff"/>
          <rect x="10" y="18" width="20" height="20" rx="3" fill="#0099cc"/>
          <rect x="12" y="38" width="7" height="12" rx="2" fill="#006699"/>
          <rect x="21" y="38" width="7" height="12" rx="2" fill="#006699"/>
        </svg>
        <div style="position:absolute;bottom:5px;left:50%;transform:translateX(-50%);font-size:0.55rem;color:rgba(255,255,255,0.3);">🎮 Jeu prêt — Tapez pour sauter !</div>
      </div>`
    }
  ];

addExercises("dart", exercises);
