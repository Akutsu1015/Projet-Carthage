import { addExercises } from ".";
import type { Exercise } from "@/app/exercises/[module]/exercise-client";

// @ts-nocheck — Auto-converted from exercises-dart-part2.js
const exercises: Exercise[] = [
    // ─── INTRO: Flutter ────────────────────────────────────────────
    {
      id: "dart_26", type: "intro", category: "Flutter - Introduction",
      title: "Bienvenue dans Flutter !",
      description: "Découvrez le framework UI de Google.",
      content: `
        <h5 style="color:#02569B;">🦋 Flutter — Créez de belles apps</h5>
        <p><strong>Flutter</strong> est un framework qui permet de créer des applications pour :</p>
        <ul>
          <li>📱 <strong>Android</strong> et <strong>iOS</strong></li>
          <li>🌐 <strong>Web</strong></li>
          <li>💻 <strong>Desktop</strong> (Windows, macOS, Linux)</li>
        </ul>
        <p>Le principe fondamental : <strong>tout est un Widget</strong>. Un bouton, un texte, une mise en page — tout est un widget.</p>
        <div style="background:rgba(2,86,155,0.1);border-radius:8px;padding:1rem;margin-top:1rem;">
          <strong>💡 Activez l'émulateur Android</strong> (bouton vert en haut) pour voir le rendu de vos exercices en temps réel !
        </div>
      `
    },
    {
      id: "dart_27", type: "intro", category: "Flutter - Introduction",
      title: "Structure d'une app Flutter",
      description: "Comprendre la structure de base.",
      content: `
        <h5 style="color:#02569B;">📐 Structure d'une app Flutter</h5>
        <p>Une application Flutter minimale contient :</p>
        <ol>
          <li><code>main()</code> — Point d'entrée qui appelle <code>runApp()</code></li>
          <li><code>MaterialApp</code> — Widget racine qui configure le thème et la navigation</li>
          <li><code>Scaffold</code> — Structure de page avec AppBar, body, etc.</li>
          <li><strong>Vos widgets</strong> — Le contenu de votre app</li>
        </ol>
      `,
      code_example: "import 'package:flutter/material.dart';\n\nvoid main() {\n  runApp(MaterialApp(\n    home: Scaffold(\n      appBar: AppBar(title: Text('Mon App')),\n      body: Center(\n        child: Text('Bonjour Flutter!'),\n      ),\n    ),\n  ));\n}"
    },
    {
      id: "dart_28", type: "quiz", category: "Flutter - Introduction",
      title: "Principe fondamental",
      description: "Le concept clé de Flutter.",
      instruction: "Quel est le principe fondamental de Flutter ?",
      options: [
        "Tout est un Widget",
        "Tout est un fichier",
        "Tout est une classe abstraite",
        "Tout est un stream"
      ],
      correct: 0,
      explanation: "En Flutter, tout élément visuel est un Widget : textes, boutons, layouts, pages entières."
    },
    {
      id: "dart_29", type: "puzzle", category: "Flutter - Premiers Widgets",
      title: "App Flutter minimale",
      description: "Reconstituez une application Flutter minimale.",
      instruction: "Remettez les blocs dans le bon ordre pour créer une app Flutter basique.",
      pieces: [
        "import 'package:flutter/material.dart';",
        "void main() {",
        "  runApp(",
        "    MaterialApp(",
        "      home: Scaffold(",
        "        body: Center(child: Text('Hello!')),",
        "      ),",
        "    ),",
        "  );",
        "}"
      ],
      hint: "L'import vient en premier, puis main() appelle runApp() avec MaterialApp > Scaffold > body.",
      simulator_render: `<div style="display:flex;flex-direction:column;height:100%;background:#fafafa;font-family:'Inter',sans-serif;">
        <div style="background:#6200EE;color:#fff;padding:12px 16px;font-size:0.85rem;font-weight:600;">Flutter App</div>
        <div style="flex:1;display:flex;align-items:center;justify-content:center;">
          <span style="font-size:1rem;color:#333;">Hello!</span>
        </div>
      </div>`
    },
    // ─── Widgets de base ───────────────────────────────────────────
    {
      id: "dart_30", type: "intro", category: "Flutter - Premiers Widgets",
      title: "Widgets de base",
      description: "Text, Container, Icon, Image.",
      content: `
        <h5 style="color:#02569B;">🧩 Les widgets de base</h5>
        <table style="width:100%;border-collapse:collapse;margin:1rem 0;">
          <tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
            <td style="padding:0.5rem;"><code>Text('...')</code></td>
            <td>Affiche du texte</td>
          </tr>
          <tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
            <td style="padding:0.5rem;"><code>Icon(Icons.star)</code></td>
            <td>Affiche une icône Material</td>
          </tr>
          <tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
            <td style="padding:0.5rem;"><code>Container(...)</code></td>
            <td>Boîte avec padding, margin, couleur, taille</td>
          </tr>
          <tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
            <td style="padding:0.5rem;"><code>Image.asset('...')</code></td>
            <td>Affiche une image locale</td>
          </tr>
          <tr>
            <td style="padding:0.5rem;"><code>ElevatedButton(...)</code></td>
            <td>Bouton avec élévation</td>
          </tr>
        </table>
      `
    },
    {
      id: "dart_31", type: "quiz", category: "Flutter - Premiers Widgets",
      title: "Widget Text",
      description: "Utiliser le widget Text.",
      instruction: "Comment afficher le texte 'Bonjour' en Flutter ?",
      options: [
        "Text('Bonjour')",
        "print('Bonjour')",
        "Label('Bonjour')",
        "TextView('Bonjour')"
      ],
      correct: 0,
      explanation: "En Flutter, le widget Text() affiche du texte à l'écran."
    },
    {
      id: "dart_32", type: "puzzle", category: "Flutter - Premiers Widgets",
      title: "Container avec style",
      description: "Créez un Container avec couleur et padding.",
      instruction: "Reconstituez un Container stylisé contenant un texte.",
      pieces: [
        "Container(",
        "  color: Colors.blue,",
        "  padding: EdgeInsets.all(16),",
        "  child: Text(",
        "    'Projet Carthage',",
        "    style: TextStyle(color: Colors.white),",
        "  ),",
        ")"
      ],
      hint: "Container prend color, padding, et child. Le Text a un style avec TextStyle.",
      simulator_render: `<div style="display:flex;flex-direction:column;height:100%;background:#fafafa;font-family:'Inter',sans-serif;">
        <div style="background:#6200EE;color:#fff;padding:12px 16px;font-size:0.85rem;font-weight:600;">Mon App</div>
        <div style="flex:1;display:flex;align-items:flex-start;justify-content:flex-start;padding:16px;">
          <div style="background:#2196F3;color:#fff;padding:16px;border-radius:4px;font-size:0.9rem;">Projet Carthage</div>
        </div>
      </div>`
    },
    // ─── Layouts ───────────────────────────────────────────────────
    {
      id: "dart_33", type: "intro", category: "Flutter - Layouts",
      title: "Layouts en Flutter",
      description: "Row, Column, Stack — organiser vos widgets.",
      content: `
        <h5 style="color:#02569B;">📏 Les layouts</h5>
        <p>Flutter organise les widgets avec des <strong>widgets de layout</strong> :</p>
        <ul>
          <li><code>Row</code> — Aligne les enfants <strong>horizontalement</strong></li>
          <li><code>Column</code> — Aligne les enfants <strong>verticalement</strong></li>
          <li><code>Stack</code> — Superpose les enfants les uns sur les autres</li>
          <li><code>Center</code> — Centre un enfant</li>
          <li><code>Padding</code> — Ajoute de l'espace autour d'un enfant</li>
          <li><code>Expanded</code> — Remplit l'espace disponible</li>
        </ul>
      `,
      code_example: "Column(\n  children: [\n    Text('Ligne 1'),\n    Text('Ligne 2'),\n    Row(\n      children: [\n        Icon(Icons.star),\n        Text('Étoile'),\n      ],\n    ),\n  ],\n)"
    },
    {
      id: "dart_34", type: "quiz", category: "Flutter - Layouts",
      title: "Row vs Column",
      description: "Différence entre Row et Column.",
      instruction: "Quel widget aligne ses enfants <strong>verticalement</strong> ?",
      options: ["Column", "Row", "Stack", "ListView"],
      correct: 0,
      explanation: "Column aligne verticalement (de haut en bas), Row aligne horizontalement (de gauche à droite)."
    },
    {
      id: "dart_35", type: "puzzle", category: "Flutter - Layouts",
      title: "Column avec widgets",
      description: "Créez une Column contenant un titre, un texte et un bouton.",
      instruction: "Reconstituez une Column avec 3 enfants.",
      pieces: [
        "Column(",
        "  mainAxisAlignment: MainAxisAlignment.center,",
        "  children: [",
        "    Text('Bienvenue', style: TextStyle(fontSize: 24)),",
        "    SizedBox(height: 16),",
        "    Text('Apprenez Flutter avec Projet Carthage'),",
        "    SizedBox(height: 16),",
        "    ElevatedButton(",
        "      onPressed: () {},",
        "      child: Text('Commencer'),",
        "    ),",
        "  ],",
        ")"
      ],
      hint: "Column prend mainAxisAlignment et children. SizedBox ajoute de l'espace entre les widgets.",
      simulator_render: `<div style="display:flex;flex-direction:column;height:100%;background:#fafafa;font-family:'Inter',sans-serif;">
        <div style="background:#6200EE;color:#fff;padding:12px 16px;font-size:0.85rem;font-weight:600;">Mon App</div>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px;gap:16px;">
          <span style="font-size:1.3rem;font-weight:700;color:#333;">Bienvenue</span>
          <span style="font-size:0.85rem;color:#666;">Apprenez Flutter avec Projet Carthage</span>
          <button style="background:#6200EE;color:#fff;border:none;padding:10px 24px;border-radius:4px;font-size:0.85rem;cursor:pointer;">Commencer</button>
        </div>
      </div>`
    },
    {
      id: "dart_36", type: "puzzle", category: "Flutter - Layouts",
      title: "Row avec icônes",
      description: "Créez une Row avec des icônes et du texte.",
      instruction: "Reconstituez une Row contenant une icône étoile et un texte.",
      pieces: [
        "Row(",
        "  mainAxisAlignment: MainAxisAlignment.center,",
        "  children: [",
        "    Icon(Icons.star, color: Colors.amber),",
        "    SizedBox(width: 8),",
        "    Text('Favori'),",
        "  ],",
        ")"
      ],
      hint: "Row prend children avec des widgets alignés horizontalement. SizedBox(width:) ajoute un espace horizontal.",
      simulator_render: `<div style="display:flex;flex-direction:column;height:100%;background:#fafafa;font-family:'Inter',sans-serif;">
        <div style="background:#6200EE;color:#fff;padding:12px 16px;font-size:0.85rem;font-weight:600;">Mon App</div>
        <div style="flex:1;display:flex;align-items:center;justify-content:center;gap:8px;">
          <span style="color:#FFC107;font-size:1.3rem;">★</span>
          <span style="font-size:0.95rem;color:#333;">Favori</span>
        </div>
      </div>`
    },
    // ─── StatelessWidget & StatefulWidget ──────────────────────────
    {
      id: "dart_37", type: "intro", category: "Flutter - State Management",
      title: "Stateless vs Stateful",
      description: "Comprendre les deux types de widgets.",
      content: `
        <h5 style="color:#02569B;">🔄 StatelessWidget vs StatefulWidget</h5>
        <p>Flutter a deux types de widgets :</p>
        <table style="width:100%;border-collapse:collapse;margin:1rem 0;">
          <tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
            <td style="padding:0.5rem;font-weight:700;color:#4CAF50;">StatelessWidget</td>
            <td>Ne change <strong>jamais</strong> après sa création. Ex: un texte fixe, une icône.</td>
          </tr>
          <tr>
            <td style="padding:0.5rem;font-weight:700;color:#FF9800;">StatefulWidget</td>
            <td>Peut <strong>changer</strong> au fil du temps. Ex: un compteur, un formulaire. Utilise <code>setState()</code>.</td>
          </tr>
        </table>
      `,
      code_example: "class MonCompteur extends StatefulWidget {\n  @override\n  _MonCompteurState createState() => _MonCompteurState();\n}\n\nclass _MonCompteurState extends State<MonCompteur> {\n  int compteur = 0;\n\n  @override\n  Widget build(BuildContext context) {\n    return ElevatedButton(\n      onPressed: () => setState(() => compteur++),\n      child: Text('Compteur: $compteur'),\n    );\n  }\n}"
    },
    {
      id: "dart_38", type: "quiz", category: "Flutter - State Management",
      title: "setState()",
      description: "Comprendre setState().",
      instruction: "À quoi sert <code>setState()</code> dans un StatefulWidget ?",
      options: [
        "Notifier Flutter de reconstruire le widget avec les nouvelles données",
        "Sauvegarder l'état dans une base de données",
        "Créer un nouvel état initial",
        "Supprimer l'état actuel"
      ],
      correct: 0,
      explanation: "setState() dit à Flutter que l'état a changé et qu'il faut reconstruire (rebuild) le widget."
    },
    {
      id: "dart_39", type: "puzzle", category: "Flutter - State Management",
      title: "StatefulWidget compteur",
      description: "Reconstituez un widget compteur avec setState.",
      instruction: "Remettez les blocs dans le bon ordre pour créer un compteur qui s'incrémente.",
      pieces: [
        "class Compteur extends StatefulWidget {",
        "  @override",
        "  _CompteurState createState() => _CompteurState();",
        "}",
        "class _CompteurState extends State<Compteur> {",
        "  int count = 0;",
        "  @override",
        "  Widget build(BuildContext context) {",
        "    return ElevatedButton(",
        "      onPressed: () => setState(() => count++),",
        "      child: Text('Count: $count'),",
        "    );",
        "  }",
        "}"
      ],
      hint: "StatefulWidget crée un State. Le State contient les données et build(). setState() déclenche un rebuild.",
      simulator_render: `<div style="display:flex;flex-direction:column;height:100%;background:#fafafa;font-family:'Inter',sans-serif;">
        <div style="background:#6200EE;color:#fff;padding:12px 16px;font-size:0.85rem;font-weight:600;">Compteur App</div>
        <div style="flex:1;display:flex;align-items:center;justify-content:center;">
          <button style="background:#6200EE;color:#fff;border:none;padding:12px 28px;border-radius:4px;font-size:1rem;cursor:pointer;">Count: 0</button>
        </div>
      </div>`
    },
    // ─── Navigation ────────────────────────────────────────────────
    {
      id: "dart_40", type: "intro", category: "Flutter - Navigation",
      title: "Navigation entre pages",
      description: "Navigator.push et Navigator.pop.",
      content: `
        <h5 style="color:#02569B;">🗺️ Navigation</h5>
        <p>Flutter utilise un <strong>Navigator</strong> basé sur une pile (stack) :</p>
        <ul>
          <li><code>Navigator.push()</code> — Ajoute une page sur la pile (aller vers)</li>
          <li><code>Navigator.pop()</code> — Retire la page du dessus (retour)</li>
        </ul>
      `,
      code_example: "// Aller vers une nouvelle page\nNavigator.push(\n  context,\n  MaterialPageRoute(\n    builder: (context) => SecondePage(),\n  ),\n);\n\n// Retour à la page précédente\nNavigator.pop(context);"
    },
    {
      id: "dart_41", type: "quiz", category: "Flutter - Navigation",
      title: "Navigator.pop()",
      description: "Comprendre Navigator.pop().",
      instruction: "Que fait <code>Navigator.pop(context)</code> ?",
      options: [
        "Retourne à la page précédente",
        "Ferme l'application",
        "Ouvre une nouvelle page",
        "Rafraîchit la page actuelle"
      ],
      correct: 0,
      explanation: "Navigator.pop() retire la page actuelle de la pile et revient à la page précédente."
    },
    {
      id: "dart_42", type: "puzzle", category: "Flutter - Navigation",
      title: "Navigation push",
      description: "Reconstituez un Navigator.push.",
      instruction: "Remettez les blocs dans le bon ordre pour naviguer vers une nouvelle page.",
      pieces: [
        "ElevatedButton(",
        "  onPressed: () {",
        "    Navigator.push(",
        "      context,",
        "      MaterialPageRoute(",
        "        builder: (context) => DetailPage(),",
        "      ),",
        "    );",
        "  },",
        "  child: Text('Voir détails'),",
        ")"
      ],
      hint: "Le bouton déclenche Navigator.push() avec un MaterialPageRoute qui construit la page cible."
    },
    // ─── ListView & ListTile ───────────────────────────────────────
    {
      id: "dart_43", type: "intro", category: "Flutter - Listes",
      title: "Listes scrollables",
      description: "ListView et ListTile pour afficher des listes.",
      content: `
        <h5 style="color:#02569B;">📋 Listes avec ListView</h5>
        <p><code>ListView</code> crée une liste scrollable. <code>ListTile</code> est un widget pratique pour les éléments de liste :</p>
        <ul>
          <li><code>leading</code> — Widget à gauche (icône, avatar)</li>
          <li><code>title</code> — Titre principal</li>
          <li><code>subtitle</code> — Sous-titre</li>
          <li><code>trailing</code> — Widget à droite</li>
        </ul>
      `,
      code_example: "ListView(\n  children: [\n    ListTile(\n      leading: Icon(Icons.person),\n      title: Text('Ulrich'),\n      subtitle: Text('Guerrier de Lyoko'),\n      trailing: Icon(Icons.arrow_forward),\n    ),\n    ListTile(\n      leading: Icon(Icons.person),\n      title: Text('Yumi'),\n      subtitle: Text('Maîtresse des éventails'),\n    ),\n  ],\n)"
    },
    {
      id: "dart_44", type: "puzzle", category: "Flutter - Listes",
      title: "ListView avec ListTile",
      description: "Créez une liste de héros Code Lyoko.",
      instruction: "Reconstituez une ListView avec deux ListTile.",
      pieces: [
        "ListView(",
        "  children: [",
        "    ListTile(",
        "      leading: Icon(Icons.shield),",
        "      title: Text('Ulrich'),",
        "      subtitle: Text('Sabre laser'),",
        "    ),",
        "    ListTile(",
        "      leading: Icon(Icons.auto_awesome),",
        "      title: Text('Aelita'),",
        "      subtitle: Text('Champs d\\'énergie'),",
        "    ),",
        "  ],",
        ")"
      ],
      hint: "ListView contient children avec des ListTile. Chaque ListTile a leading, title, subtitle.",
      simulator_render: `<div style="display:flex;flex-direction:column;height:100%;background:#fafafa;font-family:'Inter',sans-serif;">
        <div style="background:#6200EE;color:#fff;padding:12px 16px;font-size:0.85rem;font-weight:600;">Héros Lyoko</div>
        <div style="flex:1;overflow-y:auto;">
          <div style="display:flex;align-items:center;padding:12px 16px;border-bottom:1px solid #eee;">
            <span style="font-size:1.2rem;margin-right:12px;">🛡️</span>
            <div><div style="font-weight:600;color:#333;font-size:0.9rem;">Ulrich</div><div style="color:#888;font-size:0.75rem;">Sabre laser</div></div>
          </div>
          <div style="display:flex;align-items:center;padding:12px 16px;border-bottom:1px solid #eee;">
            <span style="font-size:1.2rem;margin-right:12px;">✨</span>
            <div><div style="font-weight:600;color:#333;font-size:0.9rem;">Aelita</div><div style="color:#888;font-size:0.75rem;">Champs d'énergie</div></div>
          </div>
        </div>
      </div>`
    },
    // ─── Formulaires ───────────────────────────────────────────────
    {
      id: "dart_45", type: "intro", category: "Flutter - Formulaires",
      title: "Formulaires et saisie",
      description: "TextField, Form et validation.",
      content: `
        <h5 style="color:#02569B;">📝 Saisie utilisateur</h5>
        <ul>
          <li><code>TextField</code> — Champ de saisie texte</li>
          <li><code>TextEditingController</code> — Contrôle et lit la valeur du champ</li>
          <li><code>Form</code> + <code>TextFormField</code> — Formulaire avec validation</li>
        </ul>
      `,
      code_example: "final controller = TextEditingController();\n\nTextField(\n  controller: controller,\n  decoration: InputDecoration(\n    labelText: 'Votre nom',\n    border: OutlineInputBorder(),\n  ),\n)"
    },
    {
      id: "dart_46", type: "quiz", category: "Flutter - Formulaires",
      title: "TextEditingController",
      description: "Comprendre le contrôleur de texte.",
      instruction: "Comment lire la valeur saisie dans un TextField avec un TextEditingController ?",
      options: [
        "controller.text",
        "controller.value",
        "controller.getText()",
        "controller.input"
      ],
      correct: 0,
      explanation: "La propriété .text du TextEditingController contient la valeur actuelle du champ."
    },
    {
      id: "dart_47", type: "puzzle", category: "Flutter - Formulaires",
      title: "TextField avec contrôleur",
      description: "Créez un champ de saisie avec un contrôleur.",
      pieces: [
        "final nameController = TextEditingController();",
        "",
        "Column(",
        "  children: [",
        "    TextField(",
        "      controller: nameController,",
        "      decoration: InputDecoration(labelText: 'Nom'),",
        "    ),",
        "    ElevatedButton(",
        "      onPressed: () => print(nameController.text),",
        "      child: Text('Valider'),",
        "    ),",
        "  ],",
        ")"
      ],
      hint: "Déclarez le contrôleur d'abord, puis utilisez-le dans TextField et lisez .text dans le bouton."
    },
    // ─── Thème & Style ─────────────────────────────────────────────
    {
      id: "dart_48", type: "intro", category: "Flutter - Thème & Style",
      title: "Thèmes et styles",
      description: "Personnaliser l'apparence de votre app.",
      content: `
        <h5 style="color:#02569B;">🎨 Thèmes Flutter</h5>
        <p>Flutter utilise <code>ThemeData</code> pour définir l'apparence globale :</p>
        <ul>
          <li><code>primarySwatch</code> — Couleur principale</li>
          <li><code>brightness</code> — Mode clair ou sombre</li>
          <li><code>textTheme</code> — Styles de texte globaux</li>
        </ul>
      `,
      code_example: "MaterialApp(\n  theme: ThemeData(\n    primarySwatch: Colors.deepPurple,\n    brightness: Brightness.dark,\n  ),\n  home: MonApp(),\n)"
    },
    {
      id: "dart_49", type: "quiz", category: "Flutter - Thème & Style",
      title: "Mode sombre",
      description: "Activer le mode sombre.",
      instruction: "Comment activer le mode sombre dans Flutter ?",
      options: [
        "brightness: Brightness.dark dans ThemeData",
        "darkMode: true dans MaterialApp",
        "Theme.dark() dans main()",
        "setDarkMode() dans initState()"
      ],
      correct: 0,
      explanation: "On utilise brightness: Brightness.dark dans ThemeData pour activer le mode sombre."
    },
    {
      id: "dart_50", type: "puzzle", category: "Flutter - Thème & Style",
      title: "App avec thème personnalisé",
      description: "Créez une MaterialApp avec un thème sombre violet.",
      pieces: [
        "MaterialApp(",
        "  theme: ThemeData(",
        "    primarySwatch: Colors.deepPurple,",
        "    brightness: Brightness.dark,",
        "  ),",
        "  home: Scaffold(",
        "    appBar: AppBar(title: Text('Carthage')),",
        "    body: Center(child: Text('Mode sombre!')),",
        "  ),",
        ")"
      ],
      hint: "MaterialApp prend un theme (ThemeData) et un home (Scaffold).",
      simulator_render: `<div style="display:flex;flex-direction:column;height:100%;background:#121212;font-family:'Inter',sans-serif;">
        <div style="background:#7C4DFF;color:#fff;padding:12px 16px;font-size:0.85rem;font-weight:600;">Carthage</div>
        <div style="flex:1;display:flex;align-items:center;justify-content:center;">
          <span style="font-size:0.95rem;color:#e0e0e0;">Mode sombre!</span>
        </div>
      </div>`
    },
    // ─── Packages & Assets ─────────────────────────────────────────
    {
      id: "dart_51", type: "intro", category: "Flutter - Assets & Packages",
      title: "Assets et images",
      description: "Intégrer des images et assets dans Flutter.",
      content: `
        <h5 style="color:#02569B;">🖼️ Assets</h5>
        <p>Pour utiliser des images dans Flutter :</p>
        <ol>
          <li>Placez les images dans un dossier <code>assets/</code></li>
          <li>Déclarez-les dans <code>pubspec.yaml</code></li>
          <li>Utilisez <code>Image.asset('assets/image.png')</code></li>
        </ol>
        <div style="background:rgba(2,86,155,0.1);border-radius:8px;padding:1rem;margin-top:1rem;">
          <strong>💡 Pour le projet Endless Runner :</strong> Les assets graphiques (personnage, obstacles, décors) seront <strong>déjà fournis</strong>. Vous n'aurez qu'à écrire le code !
        </div>
      `
    },
    {
      id: "dart_52", type: "quiz", category: "Flutter - Assets & Packages",
      title: "Déclarer un asset",
      description: "Où déclarer les assets dans Flutter ?",
      instruction: "Dans quel fichier déclare-t-on les assets d'un projet Flutter ?",
      options: [
        "pubspec.yaml",
        "main.dart",
        "AndroidManifest.xml",
        "assets.json"
      ],
      correct: 0,
      explanation: "Les assets sont déclarés dans pubspec.yaml sous la section flutter > assets."
    },
    // ─── Animations ────────────────────────────────────────────────
    {
      id: "dart_53", type: "intro", category: "Flutter - Animations",
      title: "Animations en Flutter",
      description: "AnimatedContainer, Hero, et animations implicites.",
      content: `
        <h5 style="color:#02569B;">🎬 Animations</h5>
        <p>Flutter offre des animations simples et puissantes :</p>
        <ul>
          <li><strong>Implicites</strong> : <code>AnimatedContainer</code>, <code>AnimatedOpacity</code> — changent automatiquement</li>
          <li><strong>Hero</strong> : Transition fluide d'un widget entre deux pages</li>
          <li><strong>Explicites</strong> : <code>AnimationController</code> pour un contrôle total</li>
        </ul>
        <p>Pour un jeu comme l'Endless Runner, on utilisera un <strong>game loop</strong> avec <code>Ticker</code> pour des animations fluides à 60 FPS.</p>
      `
    },
    {
      id: "dart_54", type: "quiz", category: "Flutter - Animations",
      title: "AnimatedContainer",
      description: "Comprendre les animations implicites.",
      instruction: "Que fait AnimatedContainer quand on change ses propriétés ?",
      options: [
        "Il anime automatiquement la transition entre l'ancien et le nouvel état",
        "Il affiche une erreur",
        "Il se reconstruit instantanément sans animation",
        "Il nécessite un AnimationController"
      ],
      correct: 0,
      explanation: "AnimatedContainer anime automatiquement les changements de taille, couleur, padding, etc."
    },
    {
      id: "dart_55", type: "intro", category: "Flutter - Animations",
      title: "Prêt pour le projet !",
      description: "Récapitulatif avant le projet Endless Runner.",
      content: `
        <h5 style="color:#02569B;">🚀 Récapitulatif — Prêt pour le projet !</h5>
        <p>Vous maîtrisez maintenant les bases de <strong>Dart</strong> et <strong>Flutter</strong> :</p>
        <ul>
          <li>✅ Variables, types, fonctions, classes en Dart</li>
          <li>✅ Widgets de base : Text, Container, Icon, Button</li>
          <li>✅ Layouts : Row, Column, Stack, ListView</li>
          <li>✅ State management : StatelessWidget, StatefulWidget, setState()</li>
          <li>✅ Navigation, formulaires, thèmes, assets, animations</li>
        </ul>
        <div style="background:rgba(255,34,68,0.1);border:1px solid rgba(255,34,68,0.2);border-radius:8px;padding:1rem;margin-top:1rem;">
          <strong style="color:#ff2244;">🎮 Prochaine étape : Projet Endless Runner !</strong><br>
          Vous allez construire un <strong>vrai jeu mobile</strong> étape par étape. Les assets graphiques sont déjà fournis — concentrez-vous sur le code !<br>
          <strong>Activez l'émulateur Android</strong> pour voir votre jeu prendre vie en temps réel.
        </div>
      `
    }
  ];

addExercises("dart", exercises);
