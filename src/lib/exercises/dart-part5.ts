import { addExercises } from ".";
import type { Exercise } from "@/app/exercises/[module]/exercise-client";

const exercises: Exercise[] = [
  // === COLLECTIONS AVANCÉES (111-115) ===
  {
    id: "dart_111",
    type: "intro",
    category: "Collections avancées",
    title: "Collections avancées en Dart",
    description: "Maîtrisez les opérations sur les collections.",
    content: `<h3>📦 Collections avancées</h3>
<pre><code>// Spread operator
var base = [1, 2, 3];
var etendu = [0, ...base, 4]; // [0, 1, 2, 3, 4]

// Collection if / for
var promo = true;
var prix = [10, 20, if (promo) 5];

var carres = [for (var i in [1,2,3]) i * i]; // [1, 4, 9]

// Map operations
var scores = {'Aelita': 95, 'Yumi': 88};
var bonus = scores.map((k, v) => MapEntry(k, v + 10));

// Iterable methods
var noms = ['Aelita', 'Yumi', 'Odd', 'Ulrich'];
noms.any((n) => n.startsWith('A'));   // true
noms.every((n) => n.length > 2);     // true
noms.fold(0, (sum, n) => sum + n.length); // total chars

// Unmodifiable
var constant = List.unmodifiable([1, 2, 3]);
// constant.add(4); // ❌ Runtime error</code></pre>`,
  },
  {
    id: "dart_112",
    type: "code",
    category: "Collections avancées",
    title: "Spread et collection if",
    description: "Utilisez les opérateurs de collection modernes.",
    instruction: "Créez une fonction <code>List&lt;String&gt; buildMenu(bool isAdmin)</code> qui retourne une liste avec <strong>[\"Accueil\", \"Profil\"]</strong> toujours, plus <strong>\"Admin\"</strong> seulement si isAdmin est true (utilisez collection if). Testez avec true et false.",
    code_template: `// Collection if pour menu conditionnel

`,
    solution: `List<String> buildMenu(bool isAdmin) {
  return [
    'Accueil',
    'Profil',
    if (isAdmin) 'Admin',
  ];
}

void main() {
  print(buildMenu(true));  // [Accueil, Profil, Admin]
  print(buildMenu(false)); // [Accueil, Profil]
}`,
    tests: [
      { expected: "if (isAdmin)", type: "contains" },
      { expected: "List<String>", type: "contains" },
      { expected: "buildMenu(true)", type: "contains" },
    ],
  },
  {
    id: "dart_113",
    type: "code",
    category: "Collections avancées",
    title: "Collection for + fold",
    description: "Générez et agrégez des collections.",
    instruction: "Utilisez <code>collection for</code> pour créer une liste des carrés de 1 à 10 : <code>[for (var i = 1; i <= 10; i++) i * i]</code>. Puis utilisez <code>.fold()</code> pour calculer la somme de tous les carrés. Affichez la liste et la somme.",
    code_template: `// Collection for et fold

`,
    solution: `void main() {
  var carres = [for (var i = 1; i <= 10; i++) i * i];
  var somme = carres.fold(0, (sum, n) => sum + n);
  print(carres);
  print('Somme: $somme');
}`,
    tests: [
      { expected: "for (var i", type: "contains" },
      { expected: ".fold(", type: "contains" },
      { expected: "i * i", type: "contains" },
    ],
  },
  {
    id: "dart_114",
    type: "code",
    category: "Collections avancées",
    title: "Map avancé",
    description: "Transformez un Map avec des opérations.",
    instruction: "Créez un <code>Map&lt;String, int&gt;</code> de scores. Utilisez <code>.entries.where()</code> pour filtrer les scores > 80, puis <code>.map()</code> pour transformer en <code>Map&lt;String, String&gt;</code> avec le format <strong>\"[score] pts\"</strong>. Affichez le résultat.",
    code_template: `// Opérations avancées sur Map

`,
    solution: `void main() {
  var scores = {'Aelita': 95, 'Yumi': 88, 'Odd': 72, 'Ulrich': 85};
  
  var topScores = Map.fromEntries(
    scores.entries
      .where((e) => e.value > 80)
      .map((e) => MapEntry(e.key, '\${e.value} pts'))
  );
  
  topScores.forEach((k, v) => print('$k: $v'));
}`,
    tests: [
      { expected: ".entries", type: "contains" },
      { expected: ".where(", type: "contains" },
      { expected: "MapEntry", type: "contains" },
    ],
  },
  {
    id: "dart_115",
    type: "quiz",
    category: "Collections avancées",
    title: "Spread operator",
    description: "Que fait l'opérateur ... (spread) ?",
    code_snippet: `var a = [1, 2];
var b = [0, ...a, 3];
var c = [0, ...?nullableList, 3];`,
    options: [
      "Il copie la référence de la liste",
      "Il décompresse les éléments d'une collection dans une autre",
      "Il trie la liste",
      "Il supprime les doublons",
    ],
    correct: 1,
    explanation: "L'opérateur spread (...) décompresse tous les éléments d'une collection et les insère dans une autre. La variante ...? (null-aware spread) gère les collections nullable en les ignorant si null au lieu de lever une erreur.",
  },

  // === ENUMS AVANCÉS (116-118) ===
  {
    id: "dart_116",
    type: "intro",
    category: "Enums avancés",
    title: "Enums enrichis (Dart 2.17+)",
    description: "Les enums Dart peuvent avoir des champs et méthodes.",
    content: `<h3>🏷️ Enums enrichis</h3>
<p>Depuis Dart 2.17, les enums peuvent contenir des <strong>champs</strong>, des <strong>constructeurs</strong> et des <strong>méthodes</strong>.</p>
<pre><code>enum Planete {
  mercure(diametre: 4879, distanceSoleil: 57.9),
  venus(diametre: 12104, distanceSoleil: 108.2),
  terre(diametre: 12756, distanceSoleil: 149.6),
  mars(diametre: 6792, distanceSoleil: 227.9);
  
  final double diametre;     // km
  final double distanceSoleil; // millions km
  
  const Planete({required this.diametre, required this.distanceSoleil});
  
  bool get estHabitable => this == terre;
  String get info => '\$name: \${diametre}km';
}

var p = Planete.terre;
print(p.info);          // terre: 12756.0km
print(p.estHabitable);  // true</code></pre>`,
  },
  {
    id: "dart_117",
    type: "code",
    category: "Enums avancés",
    title: "Enum avec données",
    description: "Créez un enum enrichi.",
    instruction: "Créez un enum <code>Difficulte</code> avec les valeurs <strong>facile</strong>(1, \"Vert\"), <strong>moyen</strong>(2, \"Orange\"), <strong>difficile</strong>(3, \"Rouge\"). Ajoutez les champs <code>int niveau</code> et <code>String couleur</code>. Ajoutez une méthode <code>String get label</code> qui retourne le nom avec le niveau. Affichez toutes les difficultés.",
    code_template: `// Enum Difficulte enrichi

`,
    solution: `enum Difficulte {
  facile(niveau: 1, couleur: 'Vert'),
  moyen(niveau: 2, couleur: 'Orange'),
  difficile(niveau: 3, couleur: 'Rouge');
  
  final int niveau;
  final String couleur;
  
  const Difficulte({required this.niveau, required this.couleur});
  
  String get label => '$name (niveau $niveau)';
}

void main() {
  for (var d in Difficulte.values) {
    print('\${d.label} - \${d.couleur}');
  }
}`,
    tests: [
      { expected: "enum Difficulte", type: "contains" },
      { expected: "final int niveau", type: "contains" },
      { expected: "const Difficulte", type: "contains" },
    ],
  },
  {
    id: "dart_118",
    type: "quiz",
    category: "Enums avancés",
    title: "Enum vs classe",
    description: "Quand préférer un enum enrichi à une classe ?",
    options: [
      "Toujours utiliser des enums au lieu de classes",
      "Quand l'ensemble de valeurs est fixe et connu à la compilation",
      "Quand on a besoin d'héritage",
      "Les enums enrichis sont dépréciés",
    ],
    correct: 1,
    explanation: "Les enums enrichis sont idéaux quand vous avez un ensemble fixe et fini de valeurs connues à la compilation (couleurs, statuts, niveaux, etc.). Si l'ensemble de valeurs est dynamique ou si vous avez besoin d'héritage, une classe reste plus appropriée.",
  },

  // === PATTERNS DART 3 (119-123) ===
  {
    id: "dart_119",
    type: "intro",
    category: "Patterns Dart 3",
    title: "Patterns et Records (Dart 3)",
    description: "Les nouveautés majeures de Dart 3.",
    content: `<h3>🎯 Patterns Dart 3</h3>
<pre><code>// Records — tuples nommés
var point = (x: 3, y: 4);
print(point.x); // 3

(String, int) personne = ('Aelita', 25);
var (nom, age) = personne; // Destructuring

// Pattern matching dans switch
String decrire(Object obj) => switch (obj) {
  int n when n > 0 => 'Positif: \$n',
  int n             => 'Négatif ou zéro: \$n',
  String s          => 'Texte: \$s',
  (int a, int b)    => 'Tuple: \$a, \$b',
  _                 => 'Inconnu',
};

// If-case
var data = {'name': 'Aelita', 'level': 10};
if (data case {'name': String n, 'level': int l}) {
  print('\$n niveau \$l');
}

// Sealed classes
sealed class Forme {}
class Cercle extends Forme { final double r; Cercle(this.r); }
class Carre extends Forme { final double c; Carre(this.c); }

double aire(Forme f) => switch (f) {
  Cercle(r: var r) => 3.14 * r * r,
  Carre(c: var c) => c * c,
};</code></pre>`,
  },
  {
    id: "dart_120",
    type: "code",
    category: "Patterns Dart 3",
    title: "Records et destructuring",
    description: "Utilisez les records Dart 3.",
    instruction: "Créez une fonction <code>(String, int, bool) getUser()</code> qui retourne un record avec <strong>(\"Aelita\", 25, true)</strong>. Dans main, destructurez le résultat dans 3 variables <code>nom</code>, <code>age</code>, <code>actif</code> et affichez-les.",
    code_template: `// Records et destructuring

`,
    solution: `(String, int, bool) getUser() {
  return ('Aelita', 25, true);
}

void main() {
  var (nom, age, actif) = getUser();
  print('$nom, $age ans, actif: $actif');
}`,
    tests: [
      { expected: "(String, int, bool)", type: "contains" },
      { expected: "var (nom, age, actif)", type: "contains" },
      { expected: "getUser()", type: "contains" },
    ],
  },
  {
    id: "dart_121",
    type: "code",
    category: "Patterns Dart 3",
    title: "Switch expression avec patterns",
    description: "Utilisez le pattern matching dans un switch.",
    instruction: "Créez une fonction <code>String decrire(Object val)</code> qui utilise un <strong>switch expression</strong> pour retourner : pour int > 0 → <strong>\"Positif\"</strong>, int <= 0 → <strong>\"Zéro ou négatif\"</strong>, String → <strong>\"Texte: [val]\"</strong>, List → <strong>\"Liste de [length] éléments\"</strong>, sinon → <strong>\"Inconnu\"</strong>.",
    code_template: `// Switch expression avec patterns

`,
    solution: `String decrire(Object val) => switch (val) {
  int n when n > 0 => 'Positif',
  int() => 'Zéro ou négatif',
  String s => 'Texte: $s',
  List l => 'Liste de \${l.length} éléments',
  _ => 'Inconnu',
};

void main() {
  print(decrire(42));
  print(decrire(-3));
  print(decrire('Hello'));
  print(decrire([1, 2, 3]));
}`,
    tests: [
      { expected: "switch (val)", type: "contains" },
      { expected: "int n when", type: "contains" },
      { expected: "String s =>", type: "contains" },
      { expected: "_ =>", type: "contains" },
    ],
  },
  {
    id: "dart_122",
    type: "code",
    category: "Patterns Dart 3",
    title: "Sealed class",
    description: "Créez un type algébrique avec sealed.",
    instruction: "Créez une <code>sealed class Resultat</code>. Créez <code>class Succes extends Resultat</code> avec <code>String data</code> et <code>class Erreur extends Resultat</code> avec <code>String message</code>. Créez une fonction <code>String traiter(Resultat r)</code> avec un switch expression exhaustif.",
    code_template: `// Sealed class Resultat

`,
    solution: `sealed class Resultat {}
class Succes extends Resultat { final String data; Succes(this.data); }
class Erreur extends Resultat { final String message; Erreur(this.message); }

String traiter(Resultat r) => switch (r) {
  Succes(data: var d) => 'OK: $d',
  Erreur(message: var m) => 'ERREUR: $m',
};

void main() {
  print(traiter(Succes('données chargées')));
  print(traiter(Erreur('timeout')));
}`,
    tests: [
      { expected: "sealed class Resultat", type: "contains" },
      { expected: "class Succes extends Resultat", type: "contains" },
      { expected: "switch (r)", type: "contains" },
    ],
  },
  {
    id: "dart_123",
    type: "quiz",
    category: "Patterns Dart 3",
    title: "Sealed vs abstract",
    description: "Quelle est la différence entre sealed et abstract ?",
    options: [
      "Aucune différence",
      "sealed restreint les sous-types au même fichier et permet au compilateur de vérifier l'exhaustivité du switch",
      "abstract est plus moderne que sealed",
      "sealed empêche l'instanciation, abstract non",
    ],
    correct: 1,
    explanation: "Une classe sealed ne peut être étendue/implémentée que dans le même fichier. Cela permet au compilateur de connaître tous les sous-types possibles et de vérifier que votre switch expression couvre tous les cas (exhaustivité), sans avoir besoin d'un cas par défaut.",
  },

  // === ISOLATES (124-126) ===
  {
    id: "dart_124",
    type: "intro",
    category: "Isolates",
    title: "Isolates — Parallélisme en Dart",
    description: "Exécutez du code en parallèle avec les Isolates.",
    content: `<h3>🔄 Isolates</h3>
<p>Dart est single-threaded mais supporte le <strong>parallélisme</strong> via les Isolates — des workers isolés avec leur propre mémoire.</p>
<pre><code>import 'dart:isolate';

// Compute — API simple pour un calcul isolé
var result = await Isolate.run(() {
  // Ce code tourne dans un isolate séparé
  var sum = 0;
  for (var i = 0; i < 1000000; i++) sum += i;
  return sum;
});

// Communication via SendPort/ReceivePort
var receivePort = ReceivePort();
await Isolate.spawn((SendPort port) {
  port.send('Hello depuis l\\'isolate !');
}, receivePort.sendPort);

receivePort.listen((message) {
  print(message);
});</code></pre>`,
  },
  {
    id: "dart_125",
    type: "code",
    category: "Isolates",
    title: "Isolate.run",
    description: "Exécutez un calcul lourd dans un Isolate.",
    instruction: "Utilisez <code>Isolate.run()</code> pour calculer la somme des nombres de 1 à 1 000 000 dans un isolate séparé. Affichez le résultat. N'oubliez pas l'import <code>dart:isolate</code>.",
    code_template: `import 'dart:isolate';

// Calcul dans un Isolate

`,
    solution: `import 'dart:isolate';

void main() async {
  var result = await Isolate.run(() {
    var sum = 0;
    for (var i = 1; i <= 1000000; i++) sum += i;
    return sum;
  });
  print('Somme: $result');
}`,
    tests: [
      { expected: "Isolate.run", type: "contains" },
      { expected: "dart:isolate", type: "contains" },
      { expected: "await", type: "contains" },
    ],
  },
  {
    id: "dart_126",
    type: "quiz",
    category: "Isolates",
    title: "Isolate vs Thread",
    description: "Quelle est la particularité des Isolates ?",
    options: [
      "Les Isolates partagent la mémoire comme les threads",
      "Les Isolates ont leur propre mémoire isolée et communiquent par messages",
      "Les Isolates sont plus lents que les threads",
      "Les Isolates ne peuvent pas retourner de valeur",
    ],
    correct: 1,
    explanation: "Contrairement aux threads classiques, les Isolates ont leur propre espace mémoire isolé. Ils ne partagent rien et communiquent uniquement par passage de messages (SendPort/ReceivePort). Cela élimine les problèmes de concurrence (race conditions, deadlocks) par design.",
  },

  // === FLUTTER WIDGETS AVANCÉS (127-133) ===
  {
    id: "dart_127",
    type: "intro",
    category: "Flutter avancé",
    title: "Widgets avancés Flutter",
    description: "Maîtrisez les widgets complexes.",
    content: `<h3>🎨 Widgets Flutter avancés</h3>
<pre><code>// CustomPainter — Dessin personnalisé
class CirclePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    var paint = Paint()
      ..color = Colors.blue
      ..style = PaintingStyle.fill;
    canvas.drawCircle(
      Offset(size.width / 2, size.height / 2),
      50, paint
    );
  }
  @override
  bool shouldRepaint(covariant CustomPainter old) => false;
}

// AnimationController
late AnimationController _ctrl;
_ctrl = AnimationController(
  duration: Duration(seconds: 2),
  vsync: this,
)..repeat(reverse: true);

// Hero animation (entre deux pages)
Hero(
  tag: 'avatar',
  child: CircleAvatar(backgroundImage: AssetImage('avatar.png')),
)

// Sliver — Scroll personnalisé
CustomScrollView(
  slivers: [
    SliverAppBar(expandedHeight: 200, floating: true),
    SliverList(delegate: SliverChildListDelegate([...])),
  ],
)</code></pre>`,
  },
  {
    id: "dart_128",
    type: "code",
    category: "Flutter avancé",
    title: "CustomPainter",
    description: "Dessinez sur un Canvas.",
    instruction: "Créez un <code>CustomPainter</code> nommé <code>GridPainter</code> qui dessine une grille de lignes horizontales et verticales avec un espacement de 20 pixels. Utilisez-le dans un widget <code>CustomPaint</code>.",
    code_template: `import 'package:flutter/material.dart';

// GridPainter

`,
    solution: `import 'package:flutter/material.dart';

class GridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    var paint = Paint()
      ..color = Colors.white24
      ..strokeWidth = 0.5;
    
    for (double x = 0; x < size.width; x += 20) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), paint);
    }
    for (double y = 0; y < size.height; y += 20) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), paint);
    }
  }
  
  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}`,
    tests: [
      { expected: "class GridPainter extends CustomPainter", type: "contains" },
      { expected: "void paint(Canvas canvas, Size size)", type: "contains" },
      { expected: "canvas.drawLine", type: "contains" },
    ],
  },
  {
    id: "dart_129",
    type: "code",
    category: "Flutter avancé",
    title: "AnimatedBuilder",
    description: "Créez une animation fluide.",
    instruction: "Créez un widget <code>PulsingCircle</code> (StatefulWidget) qui utilise un <code>AnimationController</code> pour animer l'opacité d'un cercle de 0.3 à 1.0 en boucle (repeat avec reverse). Utilisez <code>AnimatedBuilder</code>.",
    code_template: `import 'package:flutter/material.dart';

// Widget PulsingCircle avec animation

`,
    solution: `import 'package:flutter/material.dart';

class PulsingCircle extends StatefulWidget {
  @override
  State<PulsingCircle> createState() => _PulsingCircleState();
}

class _PulsingCircleState extends State<PulsingCircle>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  
  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: Duration(seconds: 2),
      vsync: this,
    )..repeat(reverse: true);
  }
  
  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
  
  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Opacity(
          opacity: 0.3 + (_controller.value * 0.7),
          child: Container(
            width: 100,
            height: 100,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.blue,
            ),
          ),
        );
      },
    );
  }
}`,
    tests: [
      { expected: "AnimationController", type: "contains" },
      { expected: "AnimatedBuilder", type: "contains" },
      { expected: "SingleTickerProviderStateMixin", type: "contains" },
      { expected: "repeat(reverse: true)", type: "contains" },
    ],
  },
  {
    id: "dart_130",
    type: "quiz",
    category: "Flutter avancé",
    title: "Slivers",
    description: "Quand utiliser CustomScrollView avec des Slivers ?",
    options: [
      "Pour des listes simples uniquement",
      "Pour combiner différents comportements de scroll dans une seule vue scrollable",
      "Pour remplacer ListView dans tous les cas",
      "Slivers sont dépréciés en Flutter moderne",
    ],
    correct: 1,
    explanation: "CustomScrollView avec Slivers permet de combiner différents comportements de scroll : SliverAppBar (barre qui se collapse), SliverGrid, SliverList, etc. dans une seule vue scrollable cohérente. C'est essentiel pour les UI complexes avec scroll.",
  },
  {
    id: "dart_131",
    type: "code",
    category: "Flutter avancé",
    title: "InheritedWidget",
    description: "Partagez des données dans l'arbre de widgets.",
    instruction: "Créez un <code>InheritedWidget</code> nommé <code>ThemeProvider</code> qui partage une couleur primaire. Ajoutez une méthode statique <code>of(BuildContext context)</code> pour y accéder depuis les widgets enfants.",
    code_template: `import 'package:flutter/material.dart';

// InheritedWidget ThemeProvider

`,
    solution: `import 'package:flutter/material.dart';

class ThemeProvider extends InheritedWidget {
  final Color primaryColor;
  
  const ThemeProvider({
    required this.primaryColor,
    required Widget child,
    Key? key,
  }) : super(key: key, child: child);
  
  static ThemeProvider of(BuildContext context) {
    return context.dependOnInheritedWidgetOfExactType<ThemeProvider>()!;
  }
  
  @override
  bool updateShouldNotify(ThemeProvider oldWidget) {
    return primaryColor != oldWidget.primaryColor;
  }
}`,
    tests: [
      { expected: "class ThemeProvider extends InheritedWidget", type: "contains" },
      { expected: "static ThemeProvider of(BuildContext context)", type: "contains" },
      { expected: "updateShouldNotify", type: "contains" },
    ],
  },
  {
    id: "dart_132",
    type: "code",
    category: "Flutter avancé",
    title: "StreamBuilder",
    description: "Construisez un UI réactif avec un Stream.",
    instruction: "Créez un Stream qui émet un compteur toutes les secondes. Utilisez un <code>StreamBuilder</code> pour afficher la valeur courante avec gestion des états : loading, data, error.",
    code_template: `import 'package:flutter/material.dart';

// StreamBuilder avec compteur

`,
    solution: `import 'package:flutter/material.dart';

Stream<int> compteur() async* {
  for (int i = 0; ; i++) {
    await Future.delayed(Duration(seconds: 1));
    yield i;
  }
}

class CompteurWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return StreamBuilder<int>(
      stream: compteur(),
      builder: (context, snapshot) {
        if (snapshot.hasError) {
          return Text('Erreur: \${snapshot.error}');
        }
        if (!snapshot.hasData) {
          return CircularProgressIndicator();
        }
        return Text(
          '\${snapshot.data}',
          style: TextStyle(fontSize: 48),
        );
      },
    );
  }
}`,
    tests: [
      { expected: "StreamBuilder<int>", type: "contains" },
      { expected: "snapshot.hasError", type: "contains" },
      { expected: "snapshot.hasData", type: "contains" },
      { expected: "async*", type: "contains" },
    ],
  },
  {
    id: "dart_133",
    type: "quiz",
    category: "Flutter avancé",
    title: "Keys en Flutter",
    description: "Quand faut-il utiliser des Keys ?",
    options: [
      "Toujours sur chaque widget",
      "Quand Flutter doit différencier des widgets de même type dans une liste dynamique",
      "Uniquement pour les StatelessWidget",
      "Les Keys sont optionnelles et jamais nécessaires",
    ],
    correct: 1,
    explanation: "Les Keys aident Flutter à identifier les widgets quand l'arbre change. Elles sont essentielles quand vous réordonnez, ajoutez ou supprimez des éléments dans une liste (ListView.builder). Sans Keys, Flutter peut réutiliser le mauvais State pour un widget, causant des bugs visuels.",
  },

  // === STATE MANAGEMENT (134-138) ===
  {
    id: "dart_134",
    type: "intro",
    category: "State Management",
    title: "Gestion d'état en Flutter",
    description: "Les patterns de gestion d'état.",
    content: `<h3>📊 State Management</h3>
<p>Flutter offre plusieurs approches pour gérer l'état :</p>
<pre><code>// 1. setState — simple et local
setState(() { counter++; });

// 2. Provider — recommandé par Flutter
class CounterModel extends ChangeNotifier {
  int _count = 0;
  int get count => _count;
  void increment() { _count++; notifyListeners(); }
}

// Dans le widget tree
ChangeNotifierProvider(
  create: (_) => CounterModel(),
  child: MyApp(),
)

// Consommer
Consumer&lt;CounterModel&gt;(
  builder: (ctx, model, child) => Text('\${model.count}'),
)

// 3. ValueNotifier — léger
var counter = ValueNotifier&lt;int&gt;(0);
ValueListenableBuilder(
  valueListenable: counter,
  builder: (ctx, value, _) => Text('\$value'),
)</code></pre>`,
  },
  {
    id: "dart_135",
    type: "code",
    category: "State Management",
    title: "ChangeNotifier",
    description: "Créez un modèle réactif.",
    instruction: "Créez une classe <code>TodoModel</code> qui extends <code>ChangeNotifier</code> avec une <code>List&lt;String&gt; _todos</code>, un getter <code>todos</code>, une méthode <code>add(String todo)</code> et <code>remove(int index)</code>. Appelez <code>notifyListeners()</code> après chaque modification.",
    code_template: `import 'package:flutter/foundation.dart';

// TodoModel avec ChangeNotifier

`,
    solution: `import 'package:flutter/foundation.dart';

class TodoModel extends ChangeNotifier {
  final List<String> _todos = [];
  
  List<String> get todos => List.unmodifiable(_todos);
  int get count => _todos.length;
  
  void add(String todo) {
    _todos.add(todo);
    notifyListeners();
  }
  
  void remove(int index) {
    _todos.removeAt(index);
    notifyListeners();
  }
}`,
    tests: [
      { expected: "class TodoModel extends ChangeNotifier", type: "contains" },
      { expected: "notifyListeners()", type: "contains" },
      { expected: "List<String> get todos", type: "contains" },
    ],
  },
  {
    id: "dart_136",
    type: "code",
    category: "State Management",
    title: "ValueNotifier",
    description: "Gestion d'état minimaliste.",
    instruction: "Créez un <code>ValueNotifier&lt;int&gt; score</code> initialisé à 0. Créez un widget qui utilise <code>ValueListenableBuilder</code> pour afficher le score et deux boutons +10 et -5 pour le modifier.",
    code_template: `import 'package:flutter/material.dart';

// ValueNotifier score widget

`,
    solution: `import 'package:flutter/material.dart';

class ScoreWidget extends StatelessWidget {
  final score = ValueNotifier<int>(0);
  
  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        ValueListenableBuilder<int>(
          valueListenable: score,
          builder: (context, value, child) {
            return Text('Score: $value', style: TextStyle(fontSize: 32));
          },
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              onPressed: () => score.value += 10,
              child: Text('+10'),
            ),
            ElevatedButton(
              onPressed: () => score.value -= 5,
              child: Text('-5'),
            ),
          ],
        ),
      ],
    );
  }
}`,
    tests: [
      { expected: "ValueNotifier<int>", type: "contains" },
      { expected: "ValueListenableBuilder", type: "contains" },
      { expected: "score.value", type: "contains" },
    ],
  },
  {
    id: "dart_137",
    type: "quiz",
    category: "State Management",
    title: "Provider vs setState",
    description: "Quand utiliser Provider au lieu de setState ?",
    options: [
      "Toujours utiliser Provider",
      "Quand l'état doit être partagé entre plusieurs widgets non parents-enfants",
      "setState est déprécié",
      "Provider est uniquement pour les grandes applications",
    ],
    correct: 1,
    explanation: "setState est parfait pour l'état local d'un seul widget. Provider est recommandé quand l'état doit être partagé entre plusieurs widgets dans différentes branches de l'arbre, évitant le 'prop drilling'. Pour un état simple et local, setState reste le bon choix.",
  },
  {
    id: "dart_138",
    type: "code",
    category: "State Management",
    title: "BLoC pattern simplifié",
    description: "Séparez la logique métier de l'UI.",
    instruction: "Créez une classe <code>AuthBloc</code> avec un <code>StreamController&lt;bool&gt;</code> pour l'état d'authentification. Ajoutez <code>Stream&lt;bool&gt; get isAuthenticated</code>, <code>void login()</code>, <code>void logout()</code>, et <code>void dispose()</code>.",
    code_template: `import 'dart:async';

// AuthBloc avec StreamController

`,
    solution: `import 'dart:async';

class AuthBloc {
  final _authController = StreamController<bool>.broadcast();
  bool _isLoggedIn = false;
  
  Stream<bool> get isAuthenticated => _authController.stream;
  bool get currentState => _isLoggedIn;
  
  void login() {
    _isLoggedIn = true;
    _authController.add(true);
  }
  
  void logout() {
    _isLoggedIn = false;
    _authController.add(false);
  }
  
  void dispose() {
    _authController.close();
  }
}`,
    tests: [
      { expected: "class AuthBloc", type: "contains" },
      { expected: "StreamController<bool>", type: "contains" },
      { expected: "Stream<bool> get isAuthenticated", type: "contains" },
      { expected: "dispose()", type: "contains" },
    ],
  },

  // === TESTS (139-142) ===
  {
    id: "dart_139",
    type: "intro",
    category: "Tests",
    title: "Tests en Dart",
    description: "Écrivez des tests unitaires et de widgets.",
    content: `<h3>🧪 Tests en Dart</h3>
<pre><code>import 'package:test/test.dart';

// Test unitaire
void main() {
  group('Calculatrice', () {
    test('addition', () {
      expect(2 + 3, equals(5));
    });

    test('division par zéro', () {
      expect(() => 10 ~/ 0, throwsA(isA&lt;IntegerDivisionByZeroException&gt;()));
    });
  });

  // Matchers
  expect(42, isPositive);
  expect([1, 2, 3], contains(2));
  expect('hello', startsWith('he'));
  expect({'a': 1}, containsPair('a', 1));
}

// Widget test
testWidgets('Counter increments', (tester) async {
  await tester.pumpWidget(MyApp());
  expect(find.text('0'), findsOneWidget);
  await tester.tap(find.byIcon(Icons.add));
  await tester.pump();
  expect(find.text('1'), findsOneWidget);
});</code></pre>`,
  },
  {
    id: "dart_140",
    type: "code",
    category: "Tests",
    title: "Tests unitaires",
    description: "Écrivez des tests pour une classe.",
    instruction: "Créez une classe <code>Panier</code> avec <code>List&lt;double&gt; articles</code>, <code>void ajouter(double prix)</code>, <code>double get total</code>, <code>int get count</code>. Écrivez 3 tests avec <code>group</code> : ajouter un article, calculer le total, panier vide = 0.",
    code_template: `// Classe Panier + tests

`,
    solution: `class Panier {
  final List<double> _articles = [];
  
  void ajouter(double prix) => _articles.add(prix);
  double get total => _articles.fold(0, (sum, p) => sum + p);
  int get count => _articles.length;
}

// Tests
// import 'package:test/test.dart';
// void main() {
//   group('Panier', () {
//     test('ajouter un article', () {
//       var p = Panier();
//       p.ajouter(9.99);
//       expect(p.count, equals(1));
//     });
//     test('calcul du total', () {
//       var p = Panier();
//       p.ajouter(10);
//       p.ajouter(20);
//       expect(p.total, equals(30));
//     });
//     test('panier vide', () {
//       var p = Panier();
//       expect(p.total, equals(0));
//     });
//   });
// }`,
    tests: [
      { expected: "class Panier", type: "contains" },
      { expected: "void ajouter", type: "contains" },
      { expected: "get total", type: "contains" },
      { expected: "expect", type: "contains" },
    ],
  },
  {
    id: "dart_141",
    type: "quiz",
    category: "Tests",
    title: "Types de tests Flutter",
    description: "Quels sont les 3 types de tests en Flutter ?",
    options: [
      "Unitaire, Widget, Intégration",
      "Unitaire, Fonctionnel, Performance",
      "Smoke, Regression, E2E",
      "Mock, Stub, Spy",
    ],
    correct: 0,
    explanation: "Flutter définit 3 niveaux de tests : les tests unitaires (logique pure), les tests de widgets (UI individuelle, avec pump), et les tests d'intégration (app complète sur un appareil/émulateur). Le ratio recommandé est beaucoup d'unitaires, quelques widgets, peu d'intégration.",
  },
  {
    id: "dart_142",
    type: "code",
    category: "Tests",
    title: "Mock et test async",
    description: "Testez du code asynchrone.",
    instruction: "Créez une classe <code>ApiClient</code> avec <code>Future&lt;String&gt; fetchName(int id)</code> qui retourne <strong>\"User [id]\"</strong> après un délai. Écrivez un test async qui vérifie le résultat pour id = 42.",
    code_template: `// ApiClient + test async

`,
    solution: `class ApiClient {
  Future<String> fetchName(int id) async {
    await Future.delayed(Duration(milliseconds: 100));
    if (id <= 0) throw Exception('ID invalide');
    return 'User $id';
  }
}

// Test
// import 'package:test/test.dart';
// void main() {
//   test('fetchName returns user', () async {
//     var client = ApiClient();
//     var name = await client.fetchName(42);
//     expect(name, equals('User 42'));
//   });
//   test('fetchName throws on invalid id', () {
//     var client = ApiClient();
//     expect(client.fetchName(-1), throwsException);
//   });
// }`,
    tests: [
      { expected: "class ApiClient", type: "contains" },
      { expected: "Future<String> fetchName", type: "contains" },
      { expected: "expect", type: "contains" },
      { expected: "async", type: "contains" },
    ],
  },

  // === ARCHITECTURE & BONNES PRATIQUES (143-150) ===
  {
    id: "dart_143",
    type: "intro",
    category: "Architecture",
    title: "Architecture d'app Flutter",
    description: "Structurez vos projets Flutter.",
    content: `<h3>🏗️ Architecture recommandée</h3>
<pre><code>lib/
├── main.dart
├── app.dart
├── models/        // Modèles de données
│   └── user.dart
├── services/      // Logique métier & API
│   └── auth_service.dart
├── providers/     // State management
│   └── auth_provider.dart
├── screens/       // Pages
│   ├── home_screen.dart
│   └── login_screen.dart
├── widgets/       // Composants réutilisables
│   └── custom_button.dart
├── utils/         // Helpers
│   └── validators.dart
└── constants/     // Constantes
    └── colors.dart</code></pre>
<p>Principes clés :</p>
<ul>
<li><strong>Séparation des responsabilités</strong> — UI ≠ logique ≠ données</li>
<li><strong>Immutabilité</strong> — Préférez les objets immuables</li>
<li><strong>Injection de dépendances</strong> — Testabilité</li>
<li><strong>Composition</strong> — Petits widgets réutilisables</li>
</ul>`,
  },
  {
    id: "dart_144",
    type: "code",
    category: "Architecture",
    title: "Modèle immuable",
    description: "Créez un modèle de données propre.",
    instruction: "Créez une classe immuable <code>User</code> avec <code>final String id, name, email</code> et <code>final int level</code>. Ajoutez un <code>factory User.fromJson(Map&lt;String, dynamic&gt;)</code>, une méthode <code>Map&lt;String, dynamic&gt; toJson()</code>, et une méthode <code>User copyWith()</code> pour les modifications.",
    code_template: `// Modèle User immuable avec fromJson, toJson, copyWith

`,
    solution: `class User {
  final String id;
  final String name;
  final String email;
  final int level;
  
  const User({
    required this.id,
    required this.name,
    required this.email,
    this.level = 1,
  });
  
  factory User.fromJson(Map<String, dynamic> json) => User(
    id: json['id'],
    name: json['name'],
    email: json['email'],
    level: json['level'] ?? 1,
  );
  
  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'email': email,
    'level': level,
  };
  
  User copyWith({String? name, String? email, int? level}) => User(
    id: id,
    name: name ?? this.name,
    email: email ?? this.email,
    level: level ?? this.level,
  );
}`,
    tests: [
      { expected: "class User", type: "contains" },
      { expected: "factory User.fromJson", type: "contains" },
      { expected: "Map<String, dynamic> toJson()", type: "contains" },
      { expected: "User copyWith", type: "contains" },
    ],
  },
  {
    id: "dart_145",
    type: "code",
    category: "Architecture",
    title: "Service API",
    description: "Créez un service d'accès aux données.",
    instruction: "Créez une classe abstraite <code>UserRepository</code> avec <code>Future&lt;User&gt; getById(String id)</code> et <code>Future&lt;List&lt;User&gt;&gt; getAll()</code>. Créez une implémentation <code>MockUserRepository</code> qui retourne des données de test.",
    code_template: `// Repository pattern

`,
    solution: `abstract class UserRepository {
  Future<User> getById(String id);
  Future<List<User>> getAll();
}

class MockUserRepository implements UserRepository {
  final _users = [
    User(id: '1', name: 'Aelita', email: 'aelita@lyoko.fr', level: 10),
    User(id: '2', name: 'Yumi', email: 'yumi@lyoko.fr', level: 8),
  ];
  
  @override
  Future<User> getById(String id) async {
    return _users.firstWhere((u) => u.id == id);
  }
  
  @override
  Future<List<User>> getAll() async {
    return List.unmodifiable(_users);
  }
}`,
    tests: [
      { expected: "abstract class UserRepository", type: "contains" },
      { expected: "class MockUserRepository implements UserRepository", type: "contains" },
      { expected: "Future<User> getById", type: "contains" },
      { expected: "Future<List<User>> getAll", type: "contains" },
    ],
  },
  {
    id: "dart_146",
    type: "quiz",
    category: "Architecture",
    title: "Composition vs Héritage",
    description: "Quel principe Flutter privilégie-t-il ?",
    options: [
      "L'héritage profond de widgets",
      "La composition — assembler des petits widgets pour en créer des complexes",
      "Les classes monolithiques",
      "Les fonctions globales",
    ],
    correct: 1,
    explanation: "Flutter encourage la composition : créer de petits widgets simples et les assembler. Au lieu d'hériter d'un widget complexe, on compose des widgets simples ensemble. C'est plus flexible, testable et maintenable.",
  },
  {
    id: "dart_147",
    type: "code",
    category: "Architecture",
    title: "Widget réutilisable",
    description: "Créez un composant UI configurable.",
    instruction: "Créez un widget <code>ActionCard</code> qui prend un <code>String title</code>, un <code>String subtitle</code>, un <code>IconData icon</code>, une <code>Color color</code>, et un <code>VoidCallback onTap</code>. Rendez-le visuellement élégant avec des coins arrondis et une ombre.",
    code_template: `import 'package:flutter/material.dart';

// Widget ActionCard réutilisable

`,
    solution: `import 'package:flutter/material.dart';

class ActionCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;
  
  const ActionCard({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.color,
    required this.onTap,
    Key? key,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: EdgeInsets.all(16),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          color: color.withOpacity(0.1),
          border: Border.all(color: color.withOpacity(0.3)),
        ),
        child: Row(
          children: [
            Icon(icon, color: color, size: 32),
            SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: TextStyle(fontWeight: FontWeight.bold)),
                Text(subtitle, style: TextStyle(color: Colors.grey)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}`,
    tests: [
      { expected: "class ActionCard extends StatelessWidget", type: "contains" },
      { expected: "required this.title", type: "contains" },
      { expected: "GestureDetector", type: "contains" },
      { expected: "BorderRadius.circular", type: "contains" },
    ],
  },
  {
    id: "dart_148",
    type: "code",
    category: "Architecture",
    title: "Routing déclaratif",
    description: "Configurez la navigation nommée.",
    instruction: "Créez une configuration de routes avec <code>Map&lt;String, WidgetBuilder&gt;</code> pour 3 pages : <strong>/</strong> (HomePage), <strong>/profil</strong> (ProfilPage), <strong>/settings</strong> (SettingsPage). Configurez dans MaterialApp.",
    code_template: `import 'package:flutter/material.dart';

// Configuration de routes

`,
    solution: `import 'package:flutter/material.dart';

class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: Text('Accueil')),
    body: Center(
      child: ElevatedButton(
        onPressed: () => Navigator.pushNamed(context, '/profil'),
        child: Text('Mon Profil'),
      ),
    ),
  );
}

class ProfilPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: Text('Profil')),
  );
}

class SettingsPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: Text('Paramètres')),
  );
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) => MaterialApp(
    routes: {
      '/': (context) => HomePage(),
      '/profil': (context) => ProfilPage(),
      '/settings': (context) => SettingsPage(),
    },
  );
}`,
    tests: [
      { expected: "routes:", type: "contains" },
      { expected: "Navigator.pushNamed", type: "contains" },
      { expected: "class HomePage", type: "contains" },
    ],
  },
  {
    id: "dart_149",
    type: "quiz",
    category: "Architecture",
    title: "Gestion des dépendances",
    description: "Comment gérer les packages en Dart/Flutter ?",
    options: [
      "npm install comme en JavaScript",
      "pubspec.yaml avec 'dart pub get' ou 'flutter pub get'",
      "pip install comme en Python",
      "gradle comme en Android natif",
    ],
    correct: 1,
    explanation: "Dart utilise pubspec.yaml pour déclarer les dépendances et pub.dev comme registre de packages. On ajoute les dépendances dans la section 'dependencies:' puis on lance 'dart pub get' (ou 'flutter pub get' pour Flutter) pour les installer.",
  },
  {
    id: "dart_150",
    type: "code",
    category: "Architecture",
    title: "Projet final — App complète",
    description: "Assemblez tous les concepts.",
    instruction: "Créez la structure d'une mini app de notes avec : un modèle <code>Note</code> (id, title, content, createdAt), un <code>NoteService</code> avec CRUD en mémoire, et le widget principal <code>NoteListScreen</code> qui affiche la liste avec un FAB pour ajouter.",
    code_template: `import 'package:flutter/material.dart';

// Modèle Note + Service + Screen

`,
    solution: `import 'package:flutter/material.dart';

class Note {
  final String id;
  final String title;
  final String content;
  final DateTime createdAt;
  Note({required this.id, required this.title, required this.content, DateTime? createdAt})
    : createdAt = createdAt ?? DateTime.now();
}

class NoteService {
  final List<Note> _notes = [];
  List<Note> getAll() => List.unmodifiable(_notes);
  void add(String title, String content) {
    _notes.add(Note(id: DateTime.now().toString(), title: title, content: content));
  }
  void delete(String id) => _notes.removeWhere((n) => n.id == id);
}

class NoteListScreen extends StatefulWidget {
  @override
  State<NoteListScreen> createState() => _NoteListScreenState();
}

class _NoteListScreenState extends State<NoteListScreen> {
  final _service = NoteService();
  
  @override
  Widget build(BuildContext context) {
    var notes = _service.getAll();
    return Scaffold(
      appBar: AppBar(title: Text('Mes Notes')),
      body: ListView.builder(
        itemCount: notes.length,
        itemBuilder: (ctx, i) => ListTile(
          title: Text(notes[i].title),
          subtitle: Text(notes[i].content),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          setState(() => _service.add('Note', 'Contenu'));
        },
        child: Icon(Icons.add),
      ),
    );
  }
}`,
    tests: [
      { expected: "class Note", type: "contains" },
      { expected: "class NoteService", type: "contains" },
      { expected: "class NoteListScreen", type: "contains" },
      { expected: "FloatingActionButton", type: "contains" },
    ],
  },
];

addExercises("dart", exercises);
