import { addExercises } from ".";
import type { Exercise } from "@/app/exercises/[module]/exercise-client";

// @ts-nocheck — Auto-converted from exercises-frontend-part4.js
const exercises: Exercise[] = [
    // ─── SCSS INTRO ──────────────────────────────────────────────
    {
      id: "fe_151", type: "intro", category: "SCSS - Introduction",
      title: "Bienvenue dans SCSS !",
      description: "Le superpouvoir du CSS.",
      content: `
        <h5 style="color:#cf649a;">💎 SCSS — Sassy CSS</h5>
        <p><strong>SCSS</strong> (Sassy CSS) est un préprocesseur CSS qui ajoute des fonctionnalités puissantes :</p>
        <ul>
          <li><strong>Variables</strong> — <code>$primary: #3498db;</code></li>
          <li><strong>Nesting</strong> — Imbriquer les sélecteurs</li>
          <li><strong>Mixins</strong> — Blocs de code réutilisables</li>
          <li><strong>Fonctions</strong> — Calculs et manipulations</li>
          <li><strong>Partials & Import</strong> — Organisation modulaire</li>
          <li><strong>Héritage</strong> — <code>@extend</code></li>
          <li><strong>Boucles & Conditions</strong> — <code>@for</code>, <code>@each</code>, <code>@if</code></li>
        </ul>
        <p>SCSS est compilé en CSS standard. Le navigateur ne lit que le CSS final.</p>
        <div style="background:rgba(207,100,154,0.1);padding:1rem;border-radius:8px;margin-top:1rem;">
          <strong>💡 SCSS vs Sass :</strong> SCSS utilise les accolades et points-virgules (comme CSS). Sass utilise l'indentation.
        </div>
      `
    },
    {
      id: "fe_152", type: "quiz", category: "SCSS - Introduction",
      title: "SCSS vs CSS",
      instruction: "Quelle est la principale différence entre SCSS et CSS ?",
      options: [
        "SCSS est un préprocesseur qui ajoute variables, nesting et mixins au CSS",
        "SCSS remplace complètement le CSS",
        "SCSS est un langage de programmation complet",
        "SCSS ne fonctionne que dans Chrome"
      ],
      correct: 0,
      explanation: "SCSS est compilé en CSS. Il ajoute des fonctionnalités mais produit du CSS standard."
    },
    // ─── Variables SCSS ──────────────────────────────────────────
    {
      id: "fe_153", type: "intro", category: "SCSS - Variables",
      title: "Variables SCSS",
      description: "Stocker des valeurs réutilisables.",
      content: `
        <h5 style="color:#cf649a;">📦 Variables SCSS</h5>
        <p>Les variables SCSS utilisent le préfixe <code>$</code> :</p>
        <ul>
          <li>Couleurs : <code>$primary: #3498db;</code></li>
          <li>Tailles : <code>$font-size-base: 16px;</code></li>
          <li>Espacements : <code>$spacing: 1rem;</code></li>
          <li>Breakpoints : <code>$mobile: 576px;</code></li>
        </ul>
        <p><strong>Différence avec CSS :</strong> Les variables SCSS (<code>$var</code>) sont compilées et disparaissent du CSS final. Les variables CSS (<code>--var</code>) restent dans le CSS et sont dynamiques.</p>
      `,
      code_example: `$primary: #3498db;\n$radius: 8px;\n$shadow: 0 2px 10px rgba(0,0,0,0.1);\n\n.btn {\n  background: $primary;\n  border-radius: $radius;\n  box-shadow: $shadow;\n}`
    },
    {
      id: "fe_154", type: "quiz", category: "SCSS - Variables",
      title: "Syntaxe variable SCSS",
      instruction: "Comment déclare-t-on une variable en SCSS ?",
      options: ["$nom: valeur;", "--nom: valeur;", "@nom: valeur;", "var nom = valeur;"],
      correct: 0,
      explanation: "SCSS utilise $ pour les variables. CSS utilise --. Less utilise @."
    },
    {
      id: "fe_155", type: "code", category: "SCSS - Variables",
      title: "Définir des variables SCSS",
      description: "Créez des variables et utilisez-les.",
      instruction: "Déclarez <code>$primary: #e74c3c;</code> et <code>$radius: 12px;</code> puis utilisez-les dans <code>.card</code> avec <code>background: $primary;</code> et <code>border-radius: $radius;</code>.",
      language: "SCSS",
      code_template: "",
      tests: [
        { type: "contains", expected: "$primary: #e74c3c" },
        { type: "contains", expected: "$radius: 12px" },
        { type: "contains", expected: "background: $primary" },
        { type: "contains", expected: "border-radius: $radius" }
      ],
      hint: "Déclarez les variables en haut, puis utilisez-les avec $ dans .card { }."
    },
    // ─── Nesting ─────────────────────────────────────────────────
    {
      id: "fe_156", type: "intro", category: "SCSS - Nesting",
      title: "Le Nesting SCSS",
      description: "Imbriquer les sélecteurs.",
      content: `
        <h5 style="color:#cf649a;">🪆 Nesting (Imbrication)</h5>
        <p>Le nesting permet d'imbriquer les sélecteurs comme la structure HTML :</p>
        <div style="display:flex;gap:1rem;flex-wrap:wrap;">
          <div style="flex:1;min-width:200px;">
            <h6>CSS classique :</h6>
            <pre style="background:#1a1a2e;padding:0.8rem;border-radius:6px;font-size:0.8rem;"><code>.nav { ... }
.nav ul { ... }
.nav ul li { ... }
.nav ul li a { ... }
.nav ul li a:hover { ... }</code></pre>
          </div>
          <div style="flex:1;min-width:200px;">
            <h6>SCSS avec nesting :</h6>
            <pre style="background:#1a1a2e;padding:0.8rem;border-radius:6px;font-size:0.8rem;"><code>.nav {
  ul {
    li {
      a {
        &:hover { ... }
      }
    }
  }
}</code></pre>
          </div>
        </div>
        <p><strong>&amp;</strong> référence le sélecteur parent. Utile pour <code>:hover</code>, <code>::before</code>, <code>.modifier</code>.</p>
      `
    },
    {
      id: "fe_157", type: "quiz", category: "SCSS - Nesting",
      title: "Le symbole &",
      instruction: "Que représente <code>&</code> dans le nesting SCSS ?",
      options: ["Le sélecteur parent", "Le sélecteur enfant", "Le sélecteur universel", "Un opérateur logique"],
      correct: 0,
      explanation: "& référence le sélecteur parent. .btn { &:hover { } } compile en .btn:hover { }."
    },
    {
      id: "fe_158", type: "puzzle", category: "SCSS - Nesting",
      title: "Nesting SCSS",
      description: "Reconstituez du SCSS avec nesting.",
      pieces: [".card {", "  padding: 1rem;", "  .card-title {", "    font-size: 1.5rem;", "  }", "  .card-body {", "    color: #666;", "  }", "  &:hover {", "    box-shadow: 0 4px 12px rgba(0,0,0,0.1);", "  }", "}"],
      hint: ".card contient .card-title, .card-body et &:hover imbriqués."
    },
    {
      id: "fe_159", type: "code", category: "SCSS - Nesting",
      title: "Nesting avec &",
      description: "Écrivez du SCSS avec imbrication.",
      instruction: "Écrivez un bloc <code>.btn</code> avec <code>padding: 0.5rem 1rem;</code> et à l'intérieur <code>&:hover</code> avec <code>opacity: 0.8;</code> et <code>&.btn-large</code> avec <code>font-size: 1.2rem;</code>.",
      language: "SCSS",
      code_template: ".btn {\n\n}",
      tests: [
        { type: "contains", expected: "padding: 0.5rem 1rem" },
        { type: "contains", expected: "&:hover" },
        { type: "contains", expected: "opacity: 0.8" },
        { type: "contains", expected: "&.btn-large" },
        { type: "contains", expected: "font-size: 1.2rem" }
      ],
      hint: "Imbriquez &:hover et &.btn-large dans .btn { }."
    },
    // ─── Mixins ──────────────────────────────────────────────────
    {
      id: "fe_160", type: "intro", category: "SCSS - Mixins",
      title: "Les Mixins SCSS",
      description: "Blocs de code réutilisables.",
      content: `
        <h5 style="color:#cf649a;">🔧 Mixins</h5>
        <p>Les mixins sont des blocs de styles réutilisables, avec ou sans paramètres :</p>
      `,
      code_example: `// Déclaration\n@mixin flex-center {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n// Avec paramètres\n@mixin button($bg, $color: white) {\n  background: $bg;\n  color: $color;\n  padding: 0.5rem 1rem;\n  border-radius: 4px;\n}\n\n// Utilisation\n.container {\n  @include flex-center;\n}\n\n.btn-primary {\n  @include button(#3498db);\n}`
    },
    {
      id: "fe_161", type: "quiz", category: "SCSS - Mixins",
      title: "Inclure un mixin",
      instruction: "Comment utilise-t-on un mixin en SCSS ?",
      options: ["@include nom-du-mixin;", "@use nom-du-mixin;", "@apply nom-du-mixin;", "@mixin nom-du-mixin;"],
      correct: 0,
      explanation: "@mixin déclare, @include utilise. @mixin flex-center { } → @include flex-center;"
    },
    {
      id: "fe_162", type: "code", category: "SCSS - Mixins",
      title: "Créer un mixin",
      description: "Déclarez et utilisez un mixin.",
      instruction: "Créez un <code>@mixin shadow($size)</code> avec <code>box-shadow: 0 $size $size*2 rgba(0,0,0,0.1);</code> puis utilisez-le dans <code>.card</code> avec <code>@include shadow(4px);</code>.",
      language: "SCSS",
      code_template: "",
      tests: [
        { type: "contains", expected: "@mixin shadow" },
        { type: "contains", expected: "box-shadow" },
        { type: "contains", expected: "@include shadow" }
      ],
      hint: "@mixin shadow($size) { ... } puis .card { @include shadow(4px); }"
    },
    {
      id: "fe_163", type: "puzzle", category: "SCSS - Mixins",
      title: "Mixin responsive",
      description: "Reconstituez un mixin de media query.",
      pieces: ["@mixin mobile {", "  @media (max-width: 768px) {", "    @content;", "  }", "}", ".grid {", "  display: grid;", "  @include mobile {", "    display: block;", "  }", "}"],
      hint: "@content permet de passer du contenu au mixin."
    },
    // ─── Extend ──────────────────────────────────────────────────
    {
      id: "fe_164", type: "intro", category: "SCSS - Extend & Fonctions",
      title: "L'héritage avec @extend",
      description: "Partager des styles entre sélecteurs.",
      content: `
        <h5 style="color:#cf649a;">🧬 @extend — Héritage de styles</h5>
        <p><code>@extend</code> permet à un sélecteur d'hériter des styles d'un autre :</p>
      `,
      code_example: `%btn-base {\n  padding: 0.5rem 1rem;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n}\n\n.btn-primary {\n  @extend %btn-base;\n  background: #3498db;\n  color: white;\n}\n\n.btn-danger {\n  @extend %btn-base;\n  background: #e74c3c;\n  color: white;\n}`
    },
    {
      id: "fe_165", type: "quiz", category: "SCSS - Extend & Fonctions",
      title: "Placeholder selector",
      instruction: "Que fait le sélecteur <code>%placeholder</code> en SCSS ?",
      options: [
        "Définit un bloc de styles qui n'est compilé que s'il est @extend",
        "Crée une variable globale",
        "Définit un commentaire spécial",
        "Crée un mixin sans paramètre"
      ],
      correct: 0,
      explanation: "%placeholder n'apparaît pas dans le CSS final sauf s'il est @extend par un autre sélecteur."
    },
    {
      id: "fe_166", type: "code", category: "SCSS - Extend & Fonctions",
      title: "Utiliser @extend",
      description: "Créez un placeholder et étendez-le.",
      instruction: "Créez un <code>%card-base</code> avec <code>padding: 1rem;</code> et <code>border-radius: 8px;</code>. Puis créez <code>.card-primary</code> qui <code>@extend %card-base;</code> et ajoute <code>background: #3498db;</code>.",
      language: "SCSS",
      code_template: "",
      tests: [
        { type: "contains", expected: "%card-base" },
        { type: "contains", expected: "padding: 1rem" },
        { type: "contains", expected: "border-radius: 8px" },
        { type: "contains", expected: "@extend %card-base" },
        { type: "contains", expected: "background: #3498db" }
      ],
      hint: "%card-base { ... } puis .card-primary { @extend %card-base; background: ...; }"
    },
    // ─── Fonctions SCSS ──────────────────────────────────────────
    {
      id: "fe_167", type: "intro", category: "SCSS - Extend & Fonctions",
      title: "Fonctions SCSS",
      description: "Fonctions intégrées et personnalisées.",
      content: `
        <h5 style="color:#cf649a;">⚡ Fonctions SCSS</h5>
        <h6>Fonctions intégrées :</h6>
        <ul>
          <li><code>lighten($color, 20%)</code> — Éclaircir</li>
          <li><code>darken($color, 10%)</code> — Assombrir</li>
          <li><code>mix($color1, $color2, 50%)</code> — Mélanger</li>
          <li><code>percentage(0.5)</code> — Convertir en %</li>
          <li><code>round($number)</code> — Arrondir</li>
        </ul>
        <h6>Fonctions personnalisées :</h6>
      `,
      code_example: `@function rem($px) {\n  @return $px / 16 * 1rem;\n}\n\nh1 {\n  font-size: rem(32); // 2rem\n  color: lighten(#333, 20%);\n}`
    },
    {
      id: "fe_168", type: "quiz", category: "SCSS - Extend & Fonctions",
      title: "Fonction lighten",
      instruction: "Que fait <code>lighten(#333, 20%)</code> en SCSS ?",
      options: [
        "Éclaircit la couleur #333 de 20%",
        "Assombrit la couleur de 20%",
        "Ajoute 20% d'opacité",
        "Augmente la saturation de 20%"
      ],
      correct: 0,
      explanation: "lighten() augmente la luminosité d'une couleur du pourcentage donné."
    },
    {
      id: "fe_169", type: "code", category: "SCSS - Extend & Fonctions",
      title: "Fonction personnalisée",
      description: "Créez une fonction SCSS.",
      instruction: "Créez une fonction <code>@function spacing($multiplier)</code> qui retourne <code>$multiplier * 8px</code>. Utilisez-la dans <code>.box</code> avec <code>padding: spacing(2);</code>.",
      language: "SCSS",
      code_template: "",
      tests: [
        { type: "contains", expected: "@function spacing" },
        { type: "contains", expected: "@return" },
        { type: "contains", expected: "8px" },
        { type: "contains", expected: "padding: spacing(2)" }
      ],
      hint: "@function spacing($m) { @return $m * 8px; } puis .box { padding: spacing(2); }"
    },
    // ─── Boucles & Conditions ────────────────────────────────────
    {
      id: "fe_170", type: "intro", category: "SCSS - Boucles & Conditions",
      title: "Boucles et conditions SCSS",
      description: "@for, @each, @while, @if.",
      content: `
        <h5 style="color:#cf649a;">🔄 Boucles et Conditions</h5>
        <h6>@for :</h6>
        <pre style="background:#1a1a2e;padding:0.8rem;border-radius:6px;"><code>@for $i from 1 through 5 {
  .col-#{$i} { width: 20% * $i; }
}</code></pre>
        <h6>@each :</h6>
        <pre style="background:#1a1a2e;padding:0.8rem;border-radius:6px;"><code>$colors: (primary: #3498db, danger: #e74c3c);
@each $name, $color in $colors {
  .btn-#{$name} { background: $color; }
}</code></pre>
        <h6>@if :</h6>
        <pre style="background:#1a1a2e;padding:0.8rem;border-radius:6px;"><code>@mixin theme($dark: false) {
  @if $dark {
    background: #1a1a2e; color: white;
  } @else {
    background: white; color: #333;
  }
}</code></pre>
      `
    },
    {
      id: "fe_171", type: "quiz", category: "SCSS - Boucles & Conditions",
      title: "Interpolation SCSS",
      instruction: "Que fait <code>#{$variable}</code> en SCSS ?",
      options: [
        "Interpole la variable dans un sélecteur ou une propriété",
        "Crée un commentaire avec la variable",
        "Convertit la variable en string",
        "Supprime la variable"
      ],
      correct: 0,
      explanation: "#{} permet d'insérer une variable dans un sélecteur, un nom de propriété ou une valeur string."
    },
    {
      id: "fe_172", type: "code", category: "SCSS - Boucles & Conditions",
      title: "Boucle @for",
      description: "Générez des classes avec une boucle.",
      instruction: "Écrivez une boucle <code>@for $i from 1 through 4</code> qui génère des classes <code>.mt-#{$i}</code> avec <code>margin-top: $i * 0.25rem;</code>.",
      language: "SCSS",
      code_template: "",
      tests: [
        { type: "contains", expected: "@for $i from 1 through 4" },
        { type: "contains", expected: ".mt-#{$i}" },
        { type: "contains", expected: "margin-top" }
      ],
      hint: "@for $i from 1 through 4 { .mt-#{$i} { margin-top: $i * 0.25rem; } }"
    },
    {
      id: "fe_173", type: "puzzle", category: "SCSS - Boucles & Conditions",
      title: "Boucle @each",
      description: "Reconstituez une boucle @each.",
      pieces: ["$sizes: sm 576px, md 768px, lg 992px;", "@each $name, $width in $sizes {", "  @media (min-width: $width) {", "    .container-#{$name} {", "      max-width: $width;", "    }", "  }", "}"],
      hint: "@each itère sur une liste de paires nom/valeur."
    },
    // ─── Partials & Import ───────────────────────────────────────
    {
      id: "fe_174", type: "intro", category: "SCSS - Organisation",
      title: "Partials et @use",
      description: "Organiser son code SCSS.",
      content: `
        <h5 style="color:#cf649a;">📁 Organisation SCSS</h5>
        <p>Les <strong>partials</strong> sont des fichiers SCSS préfixés par <code>_</code> :</p>
        <pre style="background:#1a1a2e;padding:0.8rem;border-radius:6px;"><code>scss/
├── _variables.scss
├── _mixins.scss
├── _base.scss
├── _components.scss
├── _layout.scss
└── main.scss</code></pre>
        <p>Dans <code>main.scss</code> :</p>
        <pre style="background:#1a1a2e;padding:0.8rem;border-radius:6px;"><code>@use 'variables';
@use 'mixins';
@use 'base';
@use 'components';
@use 'layout';</code></pre>
        <p><strong>@use</strong> (moderne) remplace <strong>@import</strong> (déprécié). @use crée un namespace.</p>
      `
    },
    {
      id: "fe_175", type: "quiz", category: "SCSS - Organisation",
      title: "Partials SCSS",
      instruction: "Comment nomme-t-on un fichier partial SCSS ?",
      options: ["Avec un underscore : _fichier.scss", "Avec un tiret : -fichier.scss", "Avec .partial : fichier.partial.scss", "Avec @ : @fichier.scss"],
      correct: 0,
      explanation: "Les partials commencent par _ (ex: _variables.scss). Ils ne sont pas compilés seuls."
    },
    // ─── CSS Avancé : Clamp, calc, min/max ───────────────────────
    {
      id: "fe_176", type: "intro", category: "CSS Avancé - Fonctions",
      title: "Fonctions CSS modernes",
      description: "calc(), clamp(), min(), max().",
      content: `
        <h5 style="color:#264de4;">🧮 Fonctions CSS modernes</h5>
        <ul>
          <li><code>calc()</code> — Calculs mixtes : <code>width: calc(100% - 250px);</code></li>
          <li><code>min()</code> — Plus petite valeur : <code>width: min(90%, 1200px);</code></li>
          <li><code>max()</code> — Plus grande valeur : <code>font-size: max(16px, 1.2vw);</code></li>
          <li><code>clamp()</code> — Valeur entre min et max : <code>font-size: clamp(1rem, 2.5vw, 3rem);</code></li>
        </ul>
        <p><strong>clamp(min, preferred, max)</strong> est parfait pour la typographie responsive !</p>
      `
    },
    {
      id: "fe_177", type: "quiz", category: "CSS Avancé - Fonctions",
      title: "Fonction clamp()",
      instruction: "Que fait <code>font-size: clamp(1rem, 2.5vw, 3rem)</code> ?",
      options: [
        "La taille sera entre 1rem (min) et 3rem (max), préférant 2.5vw",
        "La taille sera exactement 2.5vw",
        "La taille sera 1rem + 2.5vw + 3rem",
        "La taille sera la moyenne des 3 valeurs"
      ],
      correct: 0,
      explanation: "clamp(min, preferred, max) : la valeur préférée est utilisée tant qu'elle reste entre min et max."
    },
    {
      id: "fe_178", type: "code", category: "CSS Avancé - Fonctions",
      title: "Typographie responsive",
      description: "Utilisez clamp() pour la typographie.",
      instruction: "Stylisez <code>h1</code> avec <code>font-size: clamp(1.5rem, 4vw, 3.5rem)</code> et <code>.container</code> avec <code>width: min(90%, 1200px)</code>.",
      language: "CSS",
      code_template: "",
      tests: [
        { type: "contains", expected: "clamp(1.5rem, 4vw, 3.5rem)" },
        { type: "contains", expected: "min(90%, 1200px)" }
      ],
      hint: "h1 { font-size: clamp(...); } .container { width: min(...); }"
    },
    // ─── CSS Avancé : Aspect-ratio, object-fit ───────────────────
    {
      id: "fe_179", type: "intro", category: "CSS Avancé - Propriétés",
      title: "Propriétés CSS modernes",
      description: "aspect-ratio, object-fit, backdrop-filter...",
      content: `
        <h5 style="color:#264de4;">🆕 Propriétés CSS modernes</h5>
        <ul>
          <li><code>aspect-ratio: 16/9;</code> — Ratio fixe</li>
          <li><code>object-fit: cover;</code> — Image qui remplit son conteneur</li>
          <li><code>backdrop-filter: blur(10px);</code> — Flou d'arrière-plan (glassmorphism)</li>
          <li><code>scroll-behavior: smooth;</code> — Défilement fluide</li>
          <li><code>scroll-snap-type</code> — Accrochage au scroll</li>
          <li><code>container queries</code> — Media queries basées sur le conteneur</li>
        </ul>
      `
    },
    {
      id: "fe_180", type: "quiz", category: "CSS Avancé - Propriétés",
      title: "object-fit: cover",
      instruction: "Que fait <code>object-fit: cover</code> sur une image ?",
      options: [
        "L'image remplit le conteneur en gardant ses proportions (peut être coupée)",
        "L'image est étirée pour remplir le conteneur",
        "L'image est centrée sans redimensionnement",
        "L'image est répétée pour remplir le conteneur"
      ],
      correct: 0,
      explanation: "cover remplit le conteneur en gardant le ratio, quitte à couper les bords."
    },
    {
      id: "fe_181", type: "code", category: "CSS Avancé - Propriétés",
      title: "Image responsive",
      description: "Stylisez une image avec object-fit.",
      instruction: "Stylisez <code>.hero-img</code> avec <code>width: 100%</code>, <code>height: 400px</code>, <code>object-fit: cover</code> et <code>border-radius: 12px</code>.",
      language: "CSS",
      code_template: ".hero-img {\n\n}",
      tests: [
        { type: "contains", expected: "width: 100%" },
        { type: "contains", expected: "height: 400px" },
        { type: "contains", expected: "object-fit: cover" },
        { type: "contains", expected: "border-radius: 12px" }
      ],
      hint: "4 propriétés dans .hero-img { }."
    },
    // ─── Glassmorphism ───────────────────────────────────────────
    {
      id: "fe_182", type: "intro", category: "CSS Avancé - Tendances",
      title: "Glassmorphism",
      description: "L'effet verre dépoli en CSS.",
      content: `
        <h5 style="color:#264de4;">🪟 Glassmorphism</h5>
        <p>Le glassmorphism crée un effet de verre dépoli :</p>
        <div style="background:rgba(255,255,255,0.1);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.2);border-radius:12px;padding:1.5rem;margin:1rem 0;">
          <p style="margin:0;">Ceci est un exemple de glassmorphism !</p>
        </div>
        <p>Propriétés clés :</p>
        <ul>
          <li><code>background: rgba(255,255,255,0.1)</code> — Fond semi-transparent</li>
          <li><code>backdrop-filter: blur(10px)</code> — Flou d'arrière-plan</li>
          <li><code>border: 1px solid rgba(255,255,255,0.2)</code> — Bordure subtile</li>
          <li><code>border-radius</code> — Coins arrondis</li>
        </ul>
      `
    },
    {
      id: "fe_183", type: "code", category: "CSS Avancé - Tendances",
      title: "Carte glassmorphism",
      description: "Créez un effet glassmorphism.",
      instruction: "Stylisez <code>.glass-card</code> avec <code>background: rgba(255,255,255,0.1)</code>, <code>backdrop-filter: blur(10px)</code>, <code>border: 1px solid rgba(255,255,255,0.2)</code> et <code>border-radius: 16px</code>.",
      language: "CSS",
      code_template: ".glass-card {\n\n}",
      tests: [
        { type: "contains", expected: "rgba(255,255,255,0.1)" },
        { type: "contains", expected: "backdrop-filter: blur(10px)" },
        { type: "contains", expected: "rgba(255,255,255,0.2)" },
        { type: "contains", expected: "border-radius: 16px" }
      ],
      hint: "4 propriétés pour l'effet glassmorphism."
    },
    // ─── CSS Grid Avancé ─────────────────────────────────────────
    {
      id: "fe_184", type: "intro", category: "CSS Avancé - Grid",
      title: "CSS Grid Avancé",
      description: "grid-template-areas, auto-fit, minmax.",
      content: `
        <h5 style="color:#264de4;">🔲 Grid Avancé</h5>
        <h6>grid-template-areas :</h6>
        <pre style="background:#1a1a2e;padding:0.8rem;border-radius:6px;"><code>.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 250px 1fr;
}
.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }</code></pre>
        <h6>Auto-fit responsive :</h6>
        <pre style="background:#1a1a2e;padding:0.8rem;border-radius:6px;"><code>.grid {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}</code></pre>
      `
    },
    {
      id: "fe_185", type: "quiz", category: "CSS Avancé - Grid",
      title: "auto-fit vs auto-fill",
      instruction: "Que fait <code>repeat(auto-fit, minmax(300px, 1fr))</code> ?",
      options: [
        "Crée autant de colonnes que possible (min 300px), les étire pour remplir l'espace",
        "Crée exactement 300 colonnes",
        "Crée une seule colonne de 300px",
        "Répète le contenu automatiquement"
      ],
      correct: 0,
      explanation: "auto-fit crée le max de colonnes possibles (min 300px) et les étire avec 1fr."
    },
    {
      id: "fe_186", type: "code", category: "CSS Avancé - Grid",
      title: "Grille auto-responsive",
      description: "Créez une grille qui s'adapte automatiquement.",
      instruction: "Stylisez <code>.auto-grid</code> avec <code>display: grid</code>, <code>grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))</code> et <code>gap: 1.5rem</code>.",
      language: "CSS",
      code_template: ".auto-grid {\n\n}",
      tests: [
        { type: "contains", expected: "display: grid" },
        { type: "contains", expected: "repeat(auto-fit, minmax(250px, 1fr))" },
        { type: "contains", expected: "gap: 1.5rem" }
      ],
      hint: "3 propriétés dans .auto-grid { }."
    },
    // ─── SCSS Maps ───────────────────────────────────────────────
    {
      id: "fe_187", type: "intro", category: "SCSS - Maps & Listes",
      title: "Maps SCSS",
      description: "Structures de données clé-valeur.",
      content: `
        <h5 style="color:#cf649a;">🗺️ Maps SCSS</h5>
        <p>Les maps sont des collections clé-valeur :</p>
      `,
      code_example: `$colors: (\n  primary: #3498db,\n  success: #2ecc71,\n  danger: #e74c3c,\n  warning: #f39c12\n);\n\n// Accéder à une valeur\n.btn-primary {\n  background: map-get($colors, primary);\n}\n\n// Boucler sur la map\n@each $name, $color in $colors {\n  .text-#{$name} { color: $color; }\n}`
    },
    {
      id: "fe_188", type: "quiz", category: "SCSS - Maps & Listes",
      title: "map-get()",
      instruction: "Comment accède-t-on à la valeur 'primary' dans une map SCSS ?",
      options: ["map-get($map, primary)", "$map[primary]", "$map.primary", "get($map, primary)"],
      correct: 0,
      explanation: "map-get($map, $key) retourne la valeur associée à la clé dans la map."
    },
    {
      id: "fe_189", type: "code", category: "SCSS - Maps & Listes",
      title: "Générer des classes avec une map",
      description: "Utilisez @each avec une map.",
      instruction: "Créez une map <code>$sizes: (sm: 0.875rem, md: 1rem, lg: 1.25rem)</code> puis une boucle <code>@each</code> qui génère <code>.text-#{$name}</code> avec <code>font-size: $size;</code>.",
      language: "SCSS",
      code_template: "",
      tests: [
        { type: "contains", expected: "$sizes:" },
        { type: "contains", expected: "sm:" },
        { type: "contains", expected: "@each" },
        { type: "contains", expected: ".text-#{$name}" },
        { type: "contains", expected: "font-size: $size" }
      ],
      hint: "$sizes: (sm: ..., md: ..., lg: ...); @each $name, $size in $sizes { ... }"
    },
    // ─── CSS Avancé : Container Queries ──────────────────────────
    {
      id: "fe_190", type: "intro", category: "CSS Avancé - Container Queries",
      title: "Container Queries",
      description: "Media queries basées sur le conteneur.",
      content: `
        <h5 style="color:#264de4;">📦 Container Queries</h5>
        <p>Les container queries permettent de styliser un élément en fonction de la taille de son <strong>conteneur</strong> (pas de la fenêtre) :</p>
      `,
      code_example: `.card-wrapper {\n  container-type: inline-size;\n  container-name: card;\n}\n\n@container card (min-width: 400px) {\n  .card {\n    display: flex;\n    flex-direction: row;\n  }\n}\n\n@container card (max-width: 399px) {\n  .card {\n    display: block;\n  }\n}`
    },
    {
      id: "fe_191", type: "quiz", category: "CSS Avancé - Container Queries",
      title: "Container vs Media Query",
      instruction: "Quelle est la différence entre container queries et media queries ?",
      options: [
        "Container queries se basent sur le conteneur parent, media queries sur la fenêtre",
        "Container queries sont plus rapides",
        "Media queries sont dépréciées",
        "Il n'y a aucune différence"
      ],
      correct: 0,
      explanation: "Container queries réagissent à la taille du conteneur, media queries à la taille de la fenêtre."
    },
    // ─── CSS Avancé : Logical Properties ─────────────────────────
    {
      id: "fe_192", type: "intro", category: "CSS Avancé - Propriétés logiques",
      title: "Propriétés logiques CSS",
      description: "Pour l'internationalisation (RTL/LTR).",
      content: `
        <h5 style="color:#264de4;">🌍 Propriétés logiques</h5>
        <p>Les propriétés logiques s'adaptent à la direction du texte (LTR/RTL) :</p>
        <table style="width:100%;border-collapse:collapse;margin:1rem 0;">
          <tr style="border-bottom:1px solid rgba(255,255,255,0.1);"><th style="padding:0.4rem;text-align:left;">Physique</th><th style="padding:0.4rem;">Logique</th></tr>
          <tr style="border-bottom:1px solid rgba(255,255,255,0.05);"><td style="padding:0.4rem;">margin-left</td><td style="padding:0.4rem;">margin-inline-start</td></tr>
          <tr style="border-bottom:1px solid rgba(255,255,255,0.05);"><td style="padding:0.4rem;">margin-right</td><td style="padding:0.4rem;">margin-inline-end</td></tr>
          <tr style="border-bottom:1px solid rgba(255,255,255,0.05);"><td style="padding:0.4rem;">padding-top</td><td style="padding:0.4rem;">padding-block-start</td></tr>
          <tr style="border-bottom:1px solid rgba(255,255,255,0.05);"><td style="padding:0.4rem;">width</td><td style="padding:0.4rem;">inline-size</td></tr>
          <tr><td style="padding:0.4rem;">height</td><td style="padding:0.4rem;">block-size</td></tr>
        </table>
      `
    },
    {
      id: "fe_193", type: "quiz", category: "CSS Avancé - Propriétés logiques",
      title: "margin-inline",
      instruction: "À quoi correspond <code>margin-inline: auto</code> ?",
      options: [
        "margin-left: auto; margin-right: auto; (centrage horizontal)",
        "margin-top: auto; margin-bottom: auto;",
        "margin sur tous les côtés",
        "margin uniquement en mode inline"
      ],
      correct: 0,
      explanation: "margin-inline = margin-left + margin-right en LTR. Centrage horizontal avec auto."
    },
    // ─── SCSS Architecture ───────────────────────────────────────
    {
      id: "fe_194", type: "intro", category: "SCSS - Architecture",
      title: "Architecture SCSS : 7-1 Pattern",
      description: "Organiser un projet SCSS professionnel.",
      content: `
        <h5 style="color:#cf649a;">🏗️ Architecture 7-1</h5>
        <p>Le pattern 7-1 organise le SCSS en 7 dossiers + 1 fichier principal :</p>
        <pre style="background:#1a1a2e;padding:0.8rem;border-radius:6px;"><code>scss/
├── abstracts/    (variables, mixins, fonctions)
│   ├── _variables.scss
│   └── _mixins.scss
├── base/         (reset, typographie)
│   ├── _reset.scss
│   └── _typography.scss
├── components/   (boutons, cartes, formulaires)
├── layout/       (header, footer, grid)
├── pages/        (styles spécifiques par page)
├── themes/       (thèmes clair/sombre)
├── vendors/      (librairies externes)
└── main.scss     (imports de tout)</code></pre>
      `
    },
    {
      id: "fe_195", type: "quiz", category: "SCSS - Architecture",
      title: "Dossier abstracts",
      instruction: "Que contient le dossier <code>abstracts/</code> dans le pattern 7-1 ?",
      options: [
        "Variables, mixins et fonctions (pas de CSS direct)",
        "Les styles de base et le reset",
        "Les composants UI",
        "Les styles spécifiques aux pages"
      ],
      correct: 0,
      explanation: "abstracts/ contient les outils SCSS (variables, mixins, fonctions) qui ne produisent pas de CSS seuls."
    },
    // ─── CSS Avancé : Cascade Layers ─────────────────────────────
    {
      id: "fe_196", type: "intro", category: "CSS Avancé - Cascade Layers",
      title: "Cascade Layers (@layer)",
      description: "Contrôler l'ordre de la cascade CSS.",
      content: `
        <h5 style="color:#264de4;">🎚️ @layer — Cascade Layers</h5>
        <p><code>@layer</code> permet de contrôler l'ordre de priorité des styles :</p>
      `,
      code_example: `/* Déclarer l'ordre des layers */\n@layer reset, base, components, utilities;\n\n@layer reset {\n  * { margin: 0; padding: 0; box-sizing: border-box; }\n}\n\n@layer base {\n  body { font-family: sans-serif; }\n}\n\n@layer components {\n  .btn { padding: 0.5rem 1rem; }\n}\n\n@layer utilities {\n  .mt-1 { margin-top: 0.25rem !important; }\n}`
    },
    {
      id: "fe_197", type: "quiz", category: "CSS Avancé - Cascade Layers",
      title: "@layer priorité",
      instruction: "Dans <code>@layer reset, base, components</code>, quel layer a la plus haute priorité ?",
      options: ["components (le dernier)", "reset (le premier)", "base (le milieu)", "Tous ont la même priorité"],
      correct: 0,
      explanation: "Le dernier layer déclaré a la plus haute priorité. components > base > reset."
    },
    // ─── Exercices mixtes avancés ────────────────────────────────
    {
      id: "fe_198", type: "puzzle", category: "SCSS - Grille & Mixins avancés",
      title: "Système de grille SCSS",
      description: "Reconstituez un mixin de grille.",
      pieces: ["@mixin grid($cols, $gap: 1rem) {", "  display: grid;", "  grid-template-columns: repeat($cols, 1fr);", "  gap: $gap;", "}", ".products {", "  @include grid(3, 2rem);", "}"],
      hint: "Le mixin grid prend le nombre de colonnes et le gap en paramètres."
    },
    {
      id: "fe_199", type: "code", category: "CSS Avancé - Dark Mode",
      title: "Dark mode avec prefers-color-scheme",
      description: "Détectez le thème système.",
      instruction: "Écrivez une media query <code>@media (prefers-color-scheme: dark)</code> qui change <code>body</code> avec <code>background: #1a1a2e</code> et <code>color: #e2e8f0</code>.",
      language: "CSS",
      code_template: "",
      tests: [
        { type: "contains", expected: "prefers-color-scheme: dark" },
        { type: "contains", expected: "background: #1a1a2e" },
        { type: "contains", expected: "color: #e2e8f0" }
      ],
      hint: "@media (prefers-color-scheme: dark) { body { ... } }"
    },
    {
      id: "fe_200", type: "quiz", category: "SCSS - Récap",
      title: "Récap SCSS & CSS Avancé",
      instruction: "Quel est l'avantage principal de SCSS par rapport au CSS natif ?",
      options: [
        "Variables $, nesting, mixins, fonctions et boucles pour un code DRY et maintenable",
        "SCSS est plus rapide à exécuter dans le navigateur",
        "SCSS ne nécessite pas de compilation",
        "SCSS remplace complètement le besoin de CSS"
      ],
      correct: 0,
      explanation: "SCSS ajoute des fonctionnalités de programmation au CSS pour un code plus organisé et maintenable."
    }
  ];

addExercises("frontend", exercises);
