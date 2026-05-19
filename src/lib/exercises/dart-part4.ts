import { addExercises } from "./registry";
import type { Exercise } from "./registry";

const exercises: Exercise[] = [
  // === CLASSES AVANCÉES (81-85) ===
  {
    id: "dart_81",
    type: "intro",
    category: "Classes avancées",
    title: "Classes avancées en Dart",
    description: "Approfondissez la POO en Dart.",
    content: `<h3>🏗️ Classes avancées</h3>
<p>Dart offre des fonctionnalités POO puissantes :</p>
<pre><code>// Classe abstraite
abstract class Forme {
  double aire();
  double perimetre();
}

// Factory constructor
class Logger {
  static final Logger _instance = Logger._internal();
  factory Logger() => _instance;
  Logger._internal();
}

// Getters et Setters
class Temperature {
  double _celsius;
  Temperature(this._celsius);
  double get fahrenheit => _celsius * 9 / 5 + 32;
  set celsius(double val) => _celsius = val;
}

// Operator overloading
class Vecteur {
  final double x, y;
  Vecteur(this.x, this.y);
  Vecteur operator +(Vecteur v) => Vecteur(x + v.x, y + v.y);
}</code></pre>`,
  },
  {
    id: "dart_82",
    type: "code",
    category: "Classes avancées",
    title: "Classe abstraite",
    description: "Créez une hiérarchie avec une classe abstraite.",
    instruction: "Créez une classe abstraite <code>Forme</code> avec une méthode abstraite <code>double aire()</code>. Créez une classe <code>Cercle</code> qui étend Forme avec un champ <code>rayon</code> et implémente <code>aire()</code> (pi * r²). Créez un Cercle de rayon 5 et affichez son aire avec <code>print</code>.",
    code_template: `// Classe abstraite Forme et Cercle
import 'dart:math';

`,
    solution: `import 'dart:math';

abstract class Forme {
  double aire();
}

class Cercle extends Forme {
  double rayon;
  Cercle(this.rayon);
  
  @override
  double aire() => pi * rayon * rayon;
}

void main() {
  var c = Cercle(5);
  print(c.aire());
}`,
    tests: [
      { expected: "abstract class Forme", type: "contains" },
      { expected: "class Cercle extends Forme", type: "contains" },
      { expected: "aire()", type: "contains" },
    ],
  },
  {
    id: "dart_83",
    type: "code",
    category: "Classes avancées",
    title: "Factory constructor",
    description: "Implémentez le pattern Singleton.",
    instruction: "Créez une classe <code>AppConfig</code> avec un factory constructor qui retourne toujours la même instance (Singleton). Ajoutez une propriété <code>String appName</code>. Vérifiez avec <code>identical()</code> que deux appels retournent le même objet.",
    code_template: `// Singleton avec factory constructor

`,
    solution: `class AppConfig {
  static final AppConfig _instance = AppConfig._internal();
  String appName = 'Projet Carthage';
  
  factory AppConfig() => _instance;
  AppConfig._internal();
}

void main() {
  var a = AppConfig();
  var b = AppConfig();
  print(identical(a, b)); // true
  print(a.appName);
}`,
    tests: [
      { expected: "factory AppConfig", type: "contains" },
      { expected: "_instance", type: "contains" },
      { expected: "identical", type: "contains" },
    ],
  },
  {
    id: "dart_84",
    type: "code",
    category: "Classes avancées",
    title: "Operator overloading",
    description: "Surchargez un opérateur.",
    instruction: "Créez une classe <code>Vecteur2D</code> avec <code>double x</code> et <code>double y</code>. Surchargez l'opérateur <code>+</code> pour additionner deux vecteurs et <code>toString()</code> pour afficher <strong>Vecteur(x, y)</strong>. Testez avec Vecteur2D(3, 4) + Vecteur2D(1, 2).",
    code_template: `// Classe Vecteur2D avec operator +

`,
    solution: `class Vecteur2D {
  final double x, y;
  Vecteur2D(this.x, this.y);
  
  Vecteur2D operator +(Vecteur2D v) => Vecteur2D(x + v.x, y + v.y);
  
  @override
  String toString() => 'Vecteur($x, $y)';
}

void main() {
  var v = Vecteur2D(3, 4) + Vecteur2D(1, 2);
  print(v); // Vecteur(4.0, 6.0)
}`,
    tests: [
      { expected: "operator +", type: "contains" },
      { expected: "class Vecteur2D", type: "contains" },
      { expected: "toString()", type: "contains" },
    ],
  },
  {
    id: "dart_85",
    type: "quiz",
    category: "Classes avancées",
    title: "Constructeur nommé",
    description: "À quoi sert un constructeur nommé en Dart ?",
    code_snippet: `class Point {
  double x, y;
  Point(this.x, this.y);
  Point.origin() : x = 0, y = 0;
  Point.fromJson(Map<String, double> json)
    : x = json['x']!, y = json['y']!;
}`,
    options: [
      "C'est un constructeur qui ne prend pas de paramètres",
      "C'est un constructeur alternatif avec un nom spécifique pour différentes façons de créer l'objet",
      "C'est un constructeur privé",
      "C'est un alias pour le constructeur par défaut",
    ],
    correct: 1,
    explanation: "Les constructeurs nommés permettent de définir plusieurs constructeurs dans une même classe, chacun avec un nom explicite décrivant comment l'objet est créé. Par exemple Point.origin() et Point.fromJson() offrent des façons différentes de créer un Point.",
  },

  // === MIXINS ET EXTENSIONS (86-90) ===
  {
    id: "dart_86",
    type: "intro",
    category: "Mixins et Extensions",
    title: "Mixins et Extensions",
    description: "Réutilisez du code sans héritage classique.",
    content: `<h3>🧩 Mixins</h3>
<p>Les mixins permettent de <strong>partager du comportement</strong> entre classes sans héritage multiple.</p>
<pre><code>mixin Nageur {
  void nager() => print('Je nage !');
}

mixin Volant {
  void voler() => print('Je vole !');
}

class Canard with Nageur, Volant {
  void sePresenter() => print('Je suis un canard');
}

var d = Canard();
d.nager();  // Je nage !
d.voler();  // Je vole !</code></pre>

<h3>🔌 Extensions</h3>
<p>Ajoutez des méthodes à des types existants :</p>
<pre><code>extension StringUtils on String {
  String get reversed => split('').reversed.join('');
  bool get isEmail => contains('@') && contains('.');
}

print('hello'.reversed);    // olleh
print('a@b.c'.isEmail);     // true</code></pre>`,
  },
  {
    id: "dart_87",
    type: "code",
    category: "Mixins et Extensions",
    title: "Créer un mixin",
    description: "Partagez du comportement avec un mixin.",
    instruction: "Créez un mixin <code>Serializable</code> avec une méthode <code>String toJson()</code> qui retourne <strong>'{\"type\": \"[runtimeType]\"}'</strong>. Créez une classe <code>User</code> avec un <code>String name</code> qui utilise ce mixin. Testez.",
    code_template: `// Mixin Serializable et classe User

`,
    solution: `mixin Serializable {
  String toJson() => '{"type": "$runtimeType"}';
}

class User with Serializable {
  String name;
  User(this.name);
}

void main() {
  var u = User('Aelita');
  print(u.toJson());
}`,
    tests: [
      { expected: "mixin Serializable", type: "contains" },
      { expected: "with Serializable", type: "contains" },
      { expected: "toJson()", type: "contains" },
    ],
  },
  {
    id: "dart_88",
    type: "code",
    category: "Mixins et Extensions",
    title: "Extension de type",
    description: "Ajoutez des méthodes à un type existant.",
    instruction: "Créez une extension <code>IntUtils</code> sur <code>int</code> avec : une propriété <code>bool get estPair</code>, une méthode <code>int factorielle()</code>. Testez avec <code>print(6.estPair)</code> et <code>print(5.factorielle())</code>.",
    code_template: `// Extension sur int

`,
    solution: `extension IntUtils on int {
  bool get estPair => this % 2 == 0;
  
  int factorielle() {
    if (this <= 1) return 1;
    return this * (this - 1).factorielle();
  }
}

void main() {
  print(6.estPair);       // true
  print(5.factorielle()); // 120
}`,
    tests: [
      { expected: "extension IntUtils on int", type: "contains" },
      { expected: "estPair", type: "contains" },
      { expected: "factorielle()", type: "contains" },
    ],
  },
  {
    id: "dart_89",
    type: "quiz",
    category: "Mixins et Extensions",
    title: "Mixin vs Héritage",
    description: "Quelle est la différence clé ?",
    options: [
      "Les mixins sont plus lents que l'héritage",
      "On peut utiliser plusieurs mixins mais hériter d'une seule classe",
      "Les mixins ne peuvent pas avoir de méthodes",
      "L'héritage est déprécié en Dart",
    ],
    correct: 1,
    explanation: "Dart ne supporte que l'héritage simple (une seule classe parent avec 'extends'), mais vous pouvez combiner autant de mixins que vous voulez avec 'with'. Les mixins permettent la réutilisation horizontale du code sans les problèmes de l'héritage multiple.",
  },
  {
    id: "dart_90",
    type: "code",
    category: "Mixins et Extensions",
    title: "Extension sur String",
    description: "Enrichissez le type String.",
    instruction: "Créez une extension <code>StringPower</code> sur <code>String</code> avec : <code>String get capitalize</code> (première lettre en majuscule), <code>int get wordCount</code> (nombre de mots). Testez avec <strong>\"hello world from dart\"</strong>.",
    code_template: `// Extension sur String

`,
    solution: `extension StringPower on String {
  String get capitalize =>
    isEmpty ? '' : '\${this[0].toUpperCase()}\${substring(1)}';
  
  int get wordCount => trim().split(RegExp(r'\\s+')).length;
}

void main() {
  var s = 'hello world from dart';
  print(s.capitalize);  // Hello world from dart
  print(s.wordCount);   // 4
}`,
    tests: [
      { expected: "extension StringPower on String", type: "contains" },
      { expected: "capitalize", type: "contains" },
      { expected: "wordCount", type: "contains" },
    ],
  },

  // === NULL SAFETY (91-95) ===
  {
    id: "dart_91",
    type: "intro",
    category: "Null Safety",
    title: "Null Safety en Dart",
    description: "Gérez les valeurs null en toute sécurité.",
    content: `<h3>🛡️ Sound Null Safety</h3>
<p>Depuis Dart 2.12, le système de types distingue les types <strong>nullable</strong> et <strong>non-nullable</strong>.</p>
<pre><code>// Non-nullable — ne peut jamais être null
String nom = 'Aelita';
// nom = null; // ❌ Erreur de compilation !

// Nullable — peut être null
String? surnom = null;
surnom = 'Princesse';

// Opérateurs null-aware
print(surnom?.length);      // 9 (accès sécurisé)
print(surnom ?? 'Inconnu');  // Princesse (valeur par défaut)
surnom ??= 'Default';        // Assigne si null

// Assertion non-null (! bang operator)
String sûr = surnom!;       // ⚠ Crash si null à l'exécution

// Late initialization
late String config;
// ... plus tard dans le code
config = 'loaded';

// Collection avec null safety
List&lt;String?&gt; avecNulls = ['a', null, 'b'];
List&lt;String&gt; sansNulls = avecNulls.whereType&lt;String&gt;().toList();</code></pre>`,
  },
  {
    id: "dart_92",
    type: "code",
    category: "Null Safety",
    title: "Types nullable",
    description: "Manipulez des valeurs nullable.",
    instruction: "Créez une fonction <code>String saluer(String? nom)</code> qui retourne <strong>\"Bonjour [nom] !\"</strong> si nom n'est pas null, sinon <strong>\"Bonjour visiteur !\"</strong>. Utilisez l'opérateur <code>??</code>. Testez avec <code>\"Aelita\"</code> et <code>null</code>.",
    code_template: `// Fonction saluer avec null safety

`,
    solution: `String saluer(String? nom) {
  return 'Bonjour \${nom ?? "visiteur"} !';
}

void main() {
  print(saluer('Aelita')); // Bonjour Aelita !
  print(saluer(null));      // Bonjour visiteur !
}`,
    tests: [
      { expected: "String?", type: "contains" },
      { expected: "??", type: "contains" },
      { expected: "saluer(", type: "contains" },
    ],
  },
  {
    id: "dart_93",
    type: "code",
    category: "Null Safety",
    title: "Cascade null-aware",
    description: "Chaînez des appels sur des valeurs nullable.",
    instruction: "Créez une classe <code>Profil</code> avec <code>String? bio</code> et <code>int? age</code>. Créez une fonction <code>String decrire(Profil? p)</code> qui utilise <code>?.</code> et <code>??</code> pour retourner <strong>\"Bio: [bio], Age: [age]\"</strong> avec des valeurs par défaut \"N/A\" et 0.",
    code_template: `// Classe Profil avec null safety

`,
    solution: `class Profil {
  String? bio;
  int? age;
  Profil({this.bio, this.age});
}

String decrire(Profil? p) {
  return 'Bio: \${p?.bio ?? "N/A"}, Age: \${p?.age ?? 0}';
}

void main() {
  print(decrire(Profil(bio: 'Dev', age: 25)));
  print(decrire(Profil()));
  print(decrire(null));
}`,
    tests: [
      { expected: "String? bio", type: "contains" },
      { expected: "?.", type: "contains" },
      { expected: "??", type: "contains" },
    ],
  },
  {
    id: "dart_94",
    type: "quiz",
    category: "Null Safety",
    title: "Late keyword",
    description: "Quand utiliser 'late' en Dart ?",
    code_snippet: `class Service {
  late final Database db;
  
  void init() {
    db = Database.connect('localhost');
  }
}`,
    options: [
      "Pour rendre une variable nullable",
      "Pour différer l'initialisation d'une variable non-nullable",
      "Pour rendre une variable constante",
      "Pour déclarer une variable asynchrone",
    ],
    correct: 1,
    explanation: "Le mot-clé 'late' permet de déclarer une variable non-nullable qui sera initialisée plus tard. Le compilateur fait confiance au développeur que la variable sera assignée avant la première lecture. Si elle est lue avant d'être assignée, une LateInitializationError sera levée.",
  },
  {
    id: "dart_95",
    type: "code",
    category: "Null Safety",
    title: "Filtrer les nulls",
    description: "Nettoyez une collection de valeurs nullable.",
    instruction: "Créez une liste <code>List&lt;int?&gt; notes = [15, null, 18, null, 12, null, 20]</code>. Filtrez les valeurs null avec <code>.whereType&lt;int&gt;()</code>, calculez la moyenne des notes non-null, et affichez-la.",
    code_template: `// Filtrer les nulls d'une liste

`,
    solution: `void main() {
  List<int?> notes = [15, null, 18, null, 12, null, 20];
  var validNotes = notes.whereType<int>().toList();
  var moyenne = validNotes.reduce((a, b) => a + b) / validNotes.length;
  print('Moyenne: $moyenne');
}`,
    tests: [
      { expected: "List<int?>", type: "contains" },
      { expected: "whereType<int>", type: "contains" },
      { expected: "moyenne", type: "contains" },
    ],
  },

  // === GENERICS (96-100) ===
  {
    id: "dart_96",
    type: "intro",
    category: "Génériques",
    title: "Génériques en Dart",
    description: "Écrivez du code réutilisable et type-safe.",
    content: `<h3>🧬 Génériques</h3>
<pre><code>// Classe générique
class Boite&lt;T&gt; {
  T contenu;
  Boite(this.contenu);
  T ouvrir() => contenu;
}

var boiteInt = Boite&lt;int&gt;(42);
var boiteStr = Boite&lt;String&gt;('Hello');

// Fonction générique
T premier&lt;T&gt;(List&lt;T&gt; liste) => liste.first;

// Contraintes
class Cache&lt;T extends Comparable&gt; {
  final List&lt;T&gt; _items = [];
  void ajouter(T item) => _items.add(item);
  T max() => _items.reduce((a, b) => a.compareTo(b) > 0 ? a : b);
}

// Multi-type
class Paire&lt;A, B&gt; {
  final A premier;
  final B second;
  Paire(this.premier, this.second);
}</code></pre>`,
  },
  {
    id: "dart_97",
    type: "code",
    category: "Génériques",
    title: "Classe générique Result",
    description: "Créez un type Result pour gérer succès/erreur.",
    instruction: "Créez une classe <code>Result&lt;T&gt;</code> avec deux factory constructors : <code>Result.success(T data)</code> et <code>Result.error(String message)</code>. Ajoutez les propriétés <code>T? data</code>, <code>String? error</code>, <code>bool isSuccess</code>. Testez les deux cas.",
    code_template: `// Classe Result<T> avec factory constructors

`,
    solution: `class Result<T> {
  final T? data;
  final String? error;
  final bool isSuccess;
  
  Result._({this.data, this.error, required this.isSuccess});
  
  factory Result.success(T data) =>
    Result._(data: data, isSuccess: true);
  
  factory Result.error(String message) =>
    Result._(error: message, isSuccess: false);
}

void main() {
  var ok = Result<int>.success(42);
  var err = Result<int>.error('Not found');
  print('\${ok.isSuccess}: \${ok.data}');
  print('\${err.isSuccess}: \${err.error}');
}`,
    tests: [
      { expected: "class Result<T>", type: "contains" },
      { expected: "factory Result.success", type: "contains" },
      { expected: "factory Result.error", type: "contains" },
    ],
  },
  {
    id: "dart_98",
    type: "code",
    category: "Génériques",
    title: "Fonction générique",
    description: "Écrivez une fonction de recherche générique.",
    instruction: "Créez une fonction <code>T? trouver&lt;T&gt;(List&lt;T&gt; liste, bool Function(T) test)</code> qui retourne le premier élément satisfaisant le test, ou null. Testez avec une liste d'entiers en cherchant le premier nombre > 10.",
    code_template: `// Fonction générique trouver

`,
    solution: `T? trouver<T>(List<T> liste, bool Function(T) test) {
  for (var item in liste) {
    if (test(item)) return item;
  }
  return null;
}

void main() {
  var nombres = [3, 7, 11, 15, 2];
  var result = trouver(nombres, (n) => n > 10);
  print(result); // 11
}`,
    tests: [
      { expected: "T? trouver<T>", type: "contains" },
      { expected: "bool Function(T)", type: "contains" },
      { expected: "return null", type: "contains" },
    ],
  },
  {
    id: "dart_99",
    type: "quiz",
    category: "Génériques",
    title: "Contrainte générique",
    description: "Que signifie 'extends' dans un type générique ?",
    code_snippet: `class Trieur<T extends Comparable<T>> {
  List<T> trier(List<T> items) => items..sort();
}`,
    options: [
      "T doit être une sous-classe de Comparable",
      "T hérite automatiquement de Comparable",
      "T est une constante",
      "T ne peut être qu'un type numérique",
    ],
    correct: 0,
    explanation: "La contrainte 'T extends Comparable<T>' signifie que T doit implémenter l'interface Comparable. Cela garantit que les objets de type T peuvent être comparés entre eux, ce qui est nécessaire pour le tri.",
  },
  {
    id: "dart_100",
    type: "code",
    category: "Génériques",
    title: "Cache générique",
    description: "Créez un cache typé avec expiration.",
    instruction: "Créez une classe <code>Cache&lt;T&gt;</code> avec un <code>Map&lt;String, T&gt; _store</code>. Implémentez <code>void set(String key, T value)</code>, <code>T? get(String key)</code>, et <code>bool has(String key)</code>. Testez avec un Cache de strings.",
    code_template: `// Classe Cache<T>

`,
    solution: `class Cache<T> {
  final Map<String, T> _store = {};
  
  void set(String key, T value) => _store[key] = value;
  T? get(String key) => _store[key];
  bool has(String key) => _store.containsKey(key);
}

void main() {
  var cache = Cache<String>();
  cache.set('user', 'Aelita');
  print(cache.has('user'));  // true
  print(cache.get('user')); // Aelita
  print(cache.get('none')); // null
}`,
    tests: [
      { expected: "class Cache<T>", type: "contains" },
      { expected: "Map<String, T>", type: "contains" },
      { expected: "set(String key, T value)", type: "contains" },
    ],
  },

  // === ASYNC AVANCÉ (101-105) ===
  {
    id: "dart_101",
    type: "intro",
    category: "Async avancé",
    title: "Streams et Futures avancées",
    description: "Maîtrisez l'asynchronisme en Dart.",
    content: `<h3>🌊 Streams</h3>
<p>Les Streams sont des séquences de valeurs asynchrones, comme des Futures qui émettent plusieurs valeurs.</p>
<pre><code>// Créer un Stream
Stream&lt;int&gt; compter(int max) async* {
  for (int i = 1; i <= max; i++) {
    await Future.delayed(Duration(seconds: 1));
    yield i;
  }
}

// Écouter un Stream
await for (var n in compter(5)) {
  print(n); // 1, 2, 3, 4, 5
}

// StreamController
var controller = StreamController&lt;String&gt;();
controller.stream.listen((data) => print(data));
controller.add('Hello');
controller.add('World');

// Stream transformations
compter(10)
  .where((n) => n.isEven)
  .map((n) => n * n)
  .listen(print); // 4, 16, 36, 64, 100</code></pre>`,
  },
  {
    id: "dart_102",
    type: "code",
    category: "Async avancé",
    title: "Générateur async",
    description: "Créez un Stream avec async*.",
    instruction: "Créez une fonction <code>Stream&lt;int&gt; fibonacci(int n)</code> qui utilise <code>async*</code> et <code>yield</code> pour émettre les n premiers nombres de Fibonacci. Écoutez le stream avec <code>await for</code> et affichez chaque nombre.",
    code_template: `// Générateur Stream Fibonacci

`,
    solution: `Stream<int> fibonacci(int n) async* {
  int a = 0, b = 1;
  for (int i = 0; i < n; i++) {
    yield a;
    var temp = a + b;
    a = b;
    b = temp;
  }
}

void main() async {
  await for (var n in fibonacci(10)) {
    print(n);
  }
}`,
    tests: [
      { expected: "Stream<int>", type: "contains" },
      { expected: "async*", type: "contains" },
      { expected: "yield", type: "contains" },
      { expected: "await for", type: "contains" },
    ],
  },
  {
    id: "dart_103",
    type: "code",
    category: "Async avancé",
    title: "Future.wait",
    description: "Exécutez des futures en parallèle.",
    instruction: "Créez une fonction <code>Future&lt;String&gt; charger(String nom, int ms)</code> qui attend <code>ms</code> millisecondes puis retourne <strong>\"[nom] chargé\"</strong>. Lancez 3 chargements en parallèle avec <code>Future.wait</code> et affichez tous les résultats.",
    code_template: `// Futures parallèles avec Future.wait

`,
    solution: `Future<String> charger(String nom, int ms) async {
  await Future.delayed(Duration(milliseconds: ms));
  return '$nom chargé';
}

void main() async {
  var results = await Future.wait([
    charger('Images', 500),
    charger('Données', 300),
    charger('Config', 100),
  ]);
  for (var r in results) print(r);
}`,
    tests: [
      { expected: "Future<String>", type: "contains" },
      { expected: "Future.wait", type: "contains" },
      { expected: "Future.delayed", type: "contains" },
    ],
  },
  {
    id: "dart_104",
    type: "quiz",
    category: "Async avancé",
    title: "Stream vs Future",
    description: "Quelle est la différence fondamentale ?",
    options: [
      "Un Stream est plus rapide qu'une Future",
      "Une Future produit une seule valeur, un Stream produit une séquence de valeurs",
      "Un Stream est synchrone, une Future est asynchrone",
      "Il n'y a pas de différence",
    ],
    correct: 1,
    explanation: "Une Future représente une valeur unique qui sera disponible dans le futur. Un Stream représente une séquence de valeurs asynchrones qui arrivent au fil du temps. Pensez à Future comme une promesse unique et Stream comme un flux continu de données.",
  },
  {
    id: "dart_105",
    type: "code",
    category: "Async avancé",
    title: "Stream transformations",
    description: "Transformez un stream avec les opérateurs.",
    instruction: "Créez un <code>Stream&lt;int&gt;</code> qui émet les nombres de 1 à 20. Chaînez <code>.where()</code> pour garder les multiples de 3, <code>.map()</code> pour les mettre au carré, et <code>.take(4)</code> pour limiter à 4 résultats. Écoutez et affichez.",
    code_template: `// Stream avec transformations chaînées

`,
    solution: `Stream<int> nombres() async* {
  for (int i = 1; i <= 20; i++) yield i;
}

void main() async {
  await for (var n in nombres()
    .where((n) => n % 3 == 0)
    .map((n) => n * n)
    .take(4)) {
    print(n);
  }
}`,
    tests: [
      { expected: ".where(", type: "contains" },
      { expected: ".map(", type: "contains" },
      { expected: ".take(", type: "contains" },
      { expected: "async*", type: "contains" },
    ],
  },

  // === ERROR HANDLING (106-110) ===
  {
    id: "dart_106",
    type: "intro",
    category: "Gestion d'erreurs",
    title: "Gestion d'erreurs en Dart",
    description: "Gérez les exceptions proprement.",
    content: `<h3>🛡️ Exceptions en Dart</h3>
<pre><code>// Try / Catch / Finally
try {
  var result = 10 ~/ 0; // Division entière par zéro
} on IntegerDivisionByZeroException {
  print('Division par zéro !');
} on FormatException catch (e) {
  print('Format invalide: \$e');
} catch (e, stackTrace) {
  print('Erreur: \$e');
  print(stackTrace);
} finally {
  print('Toujours exécuté');
}

// Exception personnalisée
class ApiException implements Exception {
  final String message;
  final int statusCode;
  ApiException(this.message, this.statusCode);
  @override
  String toString() => 'ApiException(\$statusCode): \$message';
}

// Lancer une exception
throw ApiException('Non trouvé', 404);

// Async error handling
Future&lt;void&gt; charger() async {
  try {
    var data = await fetchData();
  } catch (e) {
    print('Erreur de chargement: \$e');
  }
}</code></pre>`,
  },
  {
    id: "dart_107",
    type: "code",
    category: "Gestion d'erreurs",
    title: "Exception personnalisée",
    description: "Créez votre propre type d'exception.",
    instruction: "Créez une classe <code>ValidationException</code> qui implémente <code>Exception</code> avec un <code>String field</code> et un <code>String message</code>. Créez une fonction <code>validerAge(int age)</code> qui throw si age < 0 ou > 150. Testez avec try/catch.",
    code_template: `// Exception personnalisée ValidationException

`,
    solution: `class ValidationException implements Exception {
  final String field;
  final String message;
  ValidationException(this.field, this.message);
  
  @override
  String toString() => 'Validation($field): $message';
}

void validerAge(int age) {
  if (age < 0) throw ValidationException('age', 'Doit être positif');
  if (age > 150) throw ValidationException('age', 'Trop élevé');
  print('Age valide: $age');
}

void main() {
  try {
    validerAge(25);
    validerAge(-5);
  } on ValidationException catch (e) {
    print(e);
  }
}`,
    tests: [
      { expected: "class ValidationException implements Exception", type: "contains" },
      { expected: "throw ValidationException", type: "contains" },
      { expected: "on ValidationException catch", type: "contains" },
    ],
  },
  {
    id: "dart_108",
    type: "code",
    category: "Gestion d'erreurs",
    title: "Try/catch async",
    description: "Gérez les erreurs dans du code asynchrone.",
    instruction: "Créez une fonction <code>Future&lt;String&gt; fetchUser(int id)</code> qui retourne <strong>\"User [id]\"</strong> si id > 0, sinon throw une <code>ArgumentError</code>. Appelez-la dans un try/catch avec les ids 1 et -1.",
    code_template: `// Try/catch async

`,
    solution: `Future<String> fetchUser(int id) async {
  await Future.delayed(Duration(milliseconds: 100));
  if (id <= 0) throw ArgumentError('ID invalide: $id');
  return 'User $id';
}

void main() async {
  try {
    print(await fetchUser(1));
    print(await fetchUser(-1));
  } on ArgumentError catch (e) {
    print('Erreur: $e');
  }
}`,
    tests: [
      { expected: "Future<String> fetchUser", type: "contains" },
      { expected: "throw ArgumentError", type: "contains" },
      { expected: "on ArgumentError catch", type: "contains" },
    ],
  },
  {
    id: "dart_109",
    type: "quiz",
    category: "Gestion d'erreurs",
    title: "on vs catch",
    description: "Quelle est la différence entre 'on' et 'catch' ?",
    options: [
      "Il n'y a pas de différence",
      "'on' filtre par type d'exception, 'catch' capture l'objet exception",
      "'catch' est plus rapide que 'on'",
      "'on' est déprécié en Dart moderne",
    ],
    correct: 1,
    explanation: "Le mot-clé 'on' filtre par type d'exception spécifique (on FormatException). Le mot-clé 'catch' capture l'objet exception pour l'utiliser (catch (e)). On peut combiner les deux : 'on FormatException catch (e)' pour filtrer par type ET accéder à l'objet.",
  },
  {
    id: "dart_110",
    type: "code",
    category: "Gestion d'erreurs",
    title: "Rethrow",
    description: "Relancez une exception après traitement.",
    instruction: "Créez une fonction <code>void traiter(String data)</code> qui parse un int avec <code>int.parse(data)</code> dans un try/catch. Si ça échoue, affichez <strong>\"Log: erreur de parsing\"</strong> puis <code>rethrow</code> l'exception. Appelez traiter dans un autre try/catch dans main.",
    code_template: `// Rethrow après logging

`,
    solution: `void traiter(String data) {
  try {
    var n = int.parse(data);
    print('Résultat: $n');
  } catch (e) {
    print('Log: erreur de parsing');
    rethrow;
  }
}

void main() {
  try {
    traiter('abc');
  } catch (e) {
    print('Main catch: $e');
  }
}`,
    tests: [
      { expected: "rethrow", type: "contains" },
      { expected: "int.parse", type: "contains" },
      { expected: "Log: erreur de parsing", type: "contains" },
    ],
  },
];

addExercises("dart", exercises);
