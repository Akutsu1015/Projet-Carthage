import { addExercises } from "./registry";
import type { Exercise } from "./registry";

// @ts-nocheck — Auto-converted from exercises-frontend-part2.js
const exercises: Exercise[] = [
    // ─── INTRO CSS ───────────────────────────────────────────────
    {
      id: "fe_51", type: "intro", category: "CSS - Introduction",
      title: "Bienvenue dans le CSS !",
      description: "Découvrez le langage qui stylise le web.",
      content: `
        <h5 style="color:#264de4;">🎨 CSS — Cascading Style Sheets</h5>
        <p><strong>CSS</strong> contrôle l'apparence visuelle des pages web :</p>
        <ul>
          <li><strong>Couleurs</strong> — texte, fond, bordures</li>
          <li><strong>Typographie</strong> — polices, tailles, espacement</li>
          <li><strong>Mise en page</strong> — Flexbox, Grid, positionnement</li>
          <li><strong>Animations</strong> — transitions, keyframes</li>
          <li><strong>Responsive</strong> — adaptation mobile/tablette</li>
        </ul>
        <p>3 façons d'ajouter du CSS :</p>
        <ol>
          <li><strong>Inline</strong> : <code>style="color:red;"</code></li>
          <li><strong>Interne</strong> : <code>&lt;style&gt;</code> dans le <code>&lt;head&gt;</code></li>
          <li><strong>Externe</strong> : fichier <code>.css</code> lié avec <code>&lt;link&gt;</code></li>
        </ol>
      `
    },
    {
      id: "fe_52", type: "quiz", category: "CSS - Introduction",
      title: "Que signifie CSS ?",
      instruction: "Quelle est la signification de l'acronyme CSS ?",
      options: ["Cascading Style Sheets", "Creative Style System", "Computer Style Sheets", "Colorful Style Sheets"],
      correct: 0,
      explanation: "CSS = Cascading Style Sheets (feuilles de style en cascade)."
    },
    {
      id: "fe_53", type: "intro", category: "CSS - Sélecteurs",
      title: "Les sélecteurs CSS",
      description: "Cibler les éléments HTML.",
      content: `
        <h5 style="color:#264de4;">🎯 Les sélecteurs CSS</h5>
        <p>Les sélecteurs permettent de cibler les éléments à styliser :</p>
        <ul>
          <li><code>element</code> — Toutes les balises (ex: <code>p</code>, <code>h1</code>)</li>
          <li><code>.classe</code> — Par classe (ex: <code>.btn</code>)</li>
          <li><code>#id</code> — Par identifiant (ex: <code>#header</code>)</li>
          <li><code>element.classe</code> — Combiné (ex: <code>p.intro</code>)</li>
          <li><code>parent enfant</code> — Descendant (ex: <code>div p</code>)</li>
          <li><code>parent > enfant</code> — Enfant direct</li>
          <li><code>*</code> — Sélecteur universel</li>
        </ul>
      `,
      code_example: `/* Par balise */\np { color: blue; }\n\n/* Par classe */\n.important { font-weight: bold; }\n\n/* Par id */\n#titre { font-size: 2rem; }`
    },
    {
      id: "fe_54", type: "quiz", category: "CSS - Sélecteurs",
      title: "Sélecteur de classe",
      instruction: "Comment sélectionne-t-on un élément avec la classe <code>menu</code> en CSS ?",
      options: [".menu", "#menu", "menu", "*menu"],
      correct: 0,
      explanation: "Le point (.) précède le nom de classe. Le dièse (#) est pour les id."
    },
    {
      id: "fe_55", type: "puzzle", category: "CSS - Sélecteurs",
      title: "Règle CSS complète",
      description: "Reconstituez une règle CSS.",
      pieces: ["h1", " {", "  color: red;", "  font-size: 2rem;", "}"],
      hint: "Une règle CSS : sélecteur { propriété: valeur; }"
    },
    {
      id: "fe_56", type: "code", category: "CSS - Sélecteurs",
      title: "Sélecteur et couleur",
      description: "Écrivez une règle CSS pour les paragraphes.",
      instruction: "Écrivez une règle CSS qui donne la couleur <strong>blue</strong> à tous les éléments <code>p</code>.",
      language: "CSS",
      code_template: "",
      tests: [
        { type: "contains", expected: "p" },
        { type: "contains", expected: "{" },
        { type: "contains", expected: "color" },
        { type: "contains", expected: "blue" },
        { type: "contains", expected: "}" }
      ],
      hint: "Syntaxe : p { color: blue; }"
    },
    {
      id: "fe_57", type: "quiz", category: "CSS - Sélecteurs",
      title: "Sélecteur d'id",
      instruction: "Comment sélectionne-t-on l'élément avec <code>id=\"header\"</code> ?",
      options: ["#header", ".header", "header", "@header"],
      correct: 0,
      explanation: "Le dièse (#) sélectionne par id."
    },
    {
      id: "fe_58", type: "quiz", category: "CSS - Sélecteurs",
      title: "Spécificité CSS",
      instruction: "Quel sélecteur a la plus haute spécificité ?",
      options: ["#monId", ".maClasse", "div", "*"],
      correct: 0,
      explanation: "Spécificité : #id (100) > .class (10) > element (1) > * (0)."
    },
    // ─── Couleurs ────────────────────────────────────────────────
    {
      id: "fe_59", type: "intro", category: "CSS - Couleurs & Fonds",
      title: "Les couleurs en CSS",
      description: "Noms, hex, rgb, hsl.",
      content: `
        <h5 style="color:#264de4;">🌈 Les couleurs en CSS</h5>
        <p>Plusieurs formats de couleurs :</p>
        <ul>
          <li><strong>Noms</strong> : <code>red</code>, <code>blue</code>, <code>tomato</code></li>
          <li><strong>Hexadécimal</strong> : <code>#ff0000</code>, <code>#00f</code></li>
          <li><strong>RGB</strong> : <code>rgb(255, 0, 0)</code></li>
          <li><strong>RGBA</strong> : <code>rgba(255, 0, 0, 0.5)</code> (avec transparence)</li>
          <li><strong>HSL</strong> : <code>hsl(0, 100%, 50%)</code></li>
        </ul>
        <p>Propriétés de couleur :</p>
        <ul>
          <li><code>color</code> — Couleur du texte</li>
          <li><code>background-color</code> — Couleur de fond</li>
          <li><code>border-color</code> — Couleur de bordure</li>
          <li><code>opacity</code> — Transparence globale (0 à 1)</li>
        </ul>
      `
    },
    {
      id: "fe_60", type: "quiz", category: "CSS - Couleurs & Fonds",
      title: "Code hexadécimal",
      instruction: "Quel code hexadécimal représente le blanc ?",
      options: ["#ffffff", "#000000", "#ff0000", "#00ff00"],
      correct: 0,
      explanation: "#ffffff = blanc (toutes les composantes au max). #000000 = noir."
    },
    {
      id: "fe_61", type: "code", category: "CSS - Couleurs & Fonds",
      title: "Fond et texte",
      description: "Stylisez un body avec couleur de fond et texte.",
      instruction: "Écrivez une règle CSS pour <code>body</code> avec <code>background-color: #1a1a2e</code> et <code>color: white</code>.",
      language: "CSS",
      code_template: "",
      tests: [
        { type: "contains", expected: "body" },
        { type: "contains", expected: "background-color" },
        { type: "contains", expected: "#1a1a2e" },
        { type: "contains", expected: "color" },
        { type: "contains", expected: "white" }
      ],
      hint: "body { background-color: ...; color: ...; }"
    },
    {
      id: "fe_62", type: "puzzle", category: "CSS - Couleurs & Fonds",
      title: "Dégradé CSS",
      description: "Reconstituez un dégradé linéaire.",
      pieces: [".hero {", "  background:", "  linear-gradient(", "    135deg,", "    #667eea,", "    #764ba2", "  );", "}"],
      hint: "linear-gradient prend un angle et des couleurs."
    },
    // ─── Typographie ─────────────────────────────────────────────
    {
      id: "fe_63", type: "intro", category: "CSS - Typographie",
      title: "La typographie CSS",
      description: "Polices, tailles et espacement.",
      content: `
        <h5 style="color:#264de4;">🔤 Typographie en CSS</h5>
        <p>Propriétés typographiques essentielles :</p>
        <ul>
          <li><code>font-family</code> — Police (ex: <code>'Arial', sans-serif</code>)</li>
          <li><code>font-size</code> — Taille (px, rem, em, %)</li>
          <li><code>font-weight</code> — Graisse (100-900, bold, normal)</li>
          <li><code>font-style</code> — Style (normal, italic)</li>
          <li><code>line-height</code> — Interligne</li>
          <li><code>letter-spacing</code> — Espacement des lettres</li>
          <li><code>text-align</code> — Alignement (left, center, right, justify)</li>
          <li><code>text-decoration</code> — Décoration (underline, none, line-through)</li>
          <li><code>text-transform</code> — Casse (uppercase, lowercase, capitalize)</li>
        </ul>
        <p><strong>Unités recommandées :</strong> <code>rem</code> pour les tailles (relative à la racine), <code>em</code> pour l'espacement relatif.</p>
      `
    },
    {
      id: "fe_64", type: "quiz", category: "CSS - Typographie",
      title: "Unité rem",
      instruction: "À quoi est relative l'unité <code>rem</code> ?",
      options: ["À la taille de police de l'élément racine (html)", "À la taille de police du parent", "À la largeur de la fenêtre", "À la résolution de l'écran"],
      correct: 0,
      explanation: "rem = root em, relative à la taille de police de <html> (16px par défaut)."
    },
    {
      id: "fe_65", type: "code", category: "CSS - Typographie",
      title: "Styliser un titre",
      description: "Appliquez des styles typographiques.",
      instruction: "Stylisez <code>h1</code> avec <code>font-family: 'Arial', sans-serif</code>, <code>font-size: 2.5rem</code> et <code>text-align: center</code>.",
      language: "CSS",
      code_template: "h1 {\n\n}",
      tests: [
        { type: "contains", expected: "font-family" },
        { type: "contains", expected: "Arial" },
        { type: "contains", expected: "font-size" },
        { type: "contains", expected: "2.5rem" },
        { type: "contains", expected: "text-align" },
        { type: "contains", expected: "center" }
      ],
      hint: "Ajoutez chaque propriété sur une ligne dans le bloc h1 { }."
    },
    // ─── Box Model ───────────────────────────────────────────────
    {
      id: "fe_66", type: "intro", category: "CSS - Box Model",
      title: "Le Box Model",
      description: "Comprendre le modèle de boîte CSS.",
      content: `
        <h5 style="color:#264de4;">📦 Le Box Model CSS</h5>
        <p>Chaque élément HTML est une <strong>boîte</strong> composée de 4 couches :</p>
        <div style="text-align:center;margin:1rem 0;">
          <div style="background:rgba(239,68,68,0.2);padding:1rem;border-radius:8px;display:inline-block;">
            <strong>Margin</strong> (marge extérieure)
            <div style="background:rgba(245,158,11,0.2);padding:1rem;border-radius:6px;margin-top:0.5rem;">
              <strong>Border</strong> (bordure)
              <div style="background:rgba(16,185,129,0.2);padding:1rem;border-radius:4px;margin-top:0.5rem;">
                <strong>Padding</strong> (marge intérieure)
                <div style="background:rgba(0,212,255,0.2);padding:0.8rem;border-radius:4px;margin-top:0.5rem;">
                  <strong>Content</strong> (contenu)
                </div>
              </div>
            </div>
          </div>
        </div>
        <p><strong>Astuce :</strong> Utilisez <code>box-sizing: border-box</code> pour inclure padding et border dans la largeur.</p>
      `,
      code_example: `* {\n  box-sizing: border-box;\n}\n\n.box {\n  width: 300px;\n  padding: 20px;\n  border: 2px solid #333;\n  margin: 10px;\n}`
    },
    {
      id: "fe_67", type: "quiz", category: "CSS - Box Model",
      title: "Ordre du Box Model",
      instruction: "De l'extérieur vers l'intérieur, quel est l'ordre correct du Box Model ?",
      options: [
        "Margin → Border → Padding → Content",
        "Padding → Border → Margin → Content",
        "Border → Margin → Content → Padding",
        "Content → Padding → Border → Margin"
      ],
      correct: 0,
      explanation: "De l'extérieur : Margin (marge) → Border (bordure) → Padding (rembourrage) → Content."
    },
    {
      id: "fe_68", type: "code", category: "CSS - Box Model",
      title: "Padding et Margin",
      description: "Appliquez du padding et du margin.",
      instruction: "Stylisez <code>.card</code> avec <code>padding: 20px</code>, <code>margin: 10px</code> et <code>border: 1px solid #ccc</code>.",
      language: "CSS",
      code_template: ".card {\n\n}",
      tests: [
        { type: "contains", expected: "padding" },
        { type: "contains", expected: "20px" },
        { type: "contains", expected: "margin" },
        { type: "contains", expected: "10px" },
        { type: "contains", expected: "border" },
        { type: "contains", expected: "1px solid #ccc" }
      ],
      hint: "Ajoutez les 3 propriétés dans le bloc .card { }."
    },
    {
      id: "fe_69", type: "quiz", category: "CSS - Box Model",
      title: "box-sizing: border-box",
      instruction: "Que fait <code>box-sizing: border-box</code> ?",
      options: [
        "Inclut padding et border dans la largeur/hauteur totale",
        "Ajoute une bordure automatique",
        "Centre l'élément dans sa boîte parente",
        "Supprime les marges par défaut"
      ],
      correct: 0,
      explanation: "border-box fait que width/height incluent padding et border, facilitant le dimensionnement."
    },
    // ─── Display & Position ──────────────────────────────────────
    {
      id: "fe_70", type: "intro", category: "CSS - Display & Position",
      title: "Display CSS",
      description: "block, inline, inline-block, none, flex, grid.",
      content: `
        <h5 style="color:#264de4;">📐 La propriété display</h5>
        <p>La propriété <code>display</code> contrôle comment un élément est affiché :</p>
        <ul>
          <li><code>block</code> — Prend toute la largeur, retour à la ligne (div, p, h1...)</li>
          <li><code>inline</code> — S'insère dans le flux, pas de largeur/hauteur (span, a, strong...)</li>
          <li><code>inline-block</code> — Inline mais accepte largeur/hauteur</li>
          <li><code>none</code> — Masque complètement l'élément</li>
          <li><code>flex</code> — Active Flexbox (mise en page flexible)</li>
          <li><code>grid</code> — Active CSS Grid (grille)</li>
        </ul>
      `
    },
    {
      id: "fe_71", type: "quiz", category: "CSS - Display & Position",
      title: "Élément block",
      instruction: "Quel élément est <code>display: block</code> par défaut ?",
      options: ["<div>", "<span>", "<a>", "<strong>"],
      correct: 0,
      explanation: "<div> est un élément block par défaut. <span>, <a>, <strong> sont inline."
    },
    {
      id: "fe_72", type: "intro", category: "CSS - Display & Position",
      title: "Position CSS",
      description: "static, relative, absolute, fixed, sticky.",
      content: `
        <h5 style="color:#264de4;">📍 La propriété position</h5>
        <ul>
          <li><code>static</code> — Par défaut, flux normal</li>
          <li><code>relative</code> — Décalé par rapport à sa position normale</li>
          <li><code>absolute</code> — Positionné par rapport au parent positionné le plus proche</li>
          <li><code>fixed</code> — Fixé par rapport à la fenêtre (ne bouge pas au scroll)</li>
          <li><code>sticky</code> — Hybride : normal puis fixé au scroll</li>
        </ul>
        <p>Avec position (sauf static), on utilise <code>top</code>, <code>right</code>, <code>bottom</code>, <code>left</code> et <code>z-index</code>.</p>
      `,
      code_example: `.navbar {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  z-index: 1000;\n}`
    },
    {
      id: "fe_73", type: "quiz", category: "CSS - Display & Position",
      title: "Position fixed",
      instruction: "Quelle position garde un élément fixe même quand on scrolle ?",
      options: ["fixed", "absolute", "relative", "sticky"],
      correct: 0,
      explanation: "fixed positionne par rapport à la fenêtre, l'élément ne bouge pas au scroll."
    },
    {
      id: "fe_74", type: "code", category: "CSS - Display & Position",
      title: "Navbar fixe",
      description: "Créez une navbar fixe en haut.",
      instruction: "Stylisez <code>.navbar</code> avec <code>position: fixed</code>, <code>top: 0</code>, <code>width: 100%</code> et <code>z-index: 1000</code>.",
      language: "CSS",
      code_template: ".navbar {\n\n}",
      tests: [
        { type: "contains", expected: "position: fixed" },
        { type: "contains", expected: "top: 0" },
        { type: "contains", expected: "width: 100%" },
        { type: "contains", expected: "z-index: 1000" }
      ],
      hint: "Ajoutez les 4 propriétés dans le bloc .navbar { }."
    },
    // ─── Flexbox ─────────────────────────────────────────────────
    {
      id: "fe_75", type: "intro", category: "CSS - Flexbox",
      title: "Introduction à Flexbox",
      description: "La mise en page flexible.",
      content: `
        <h5 style="color:#264de4;">💪 Flexbox</h5>
        <p>Flexbox est un système de mise en page <strong>unidimensionnel</strong> (ligne ou colonne) :</p>
        <h6>Sur le conteneur (parent) :</h6>
        <ul>
          <li><code>display: flex</code> — Active Flexbox</li>
          <li><code>flex-direction</code> — row | column | row-reverse | column-reverse</li>
          <li><code>justify-content</code> — Alignement axe principal (flex-start, center, space-between...)</li>
          <li><code>align-items</code> — Alignement axe secondaire (stretch, center, flex-start...)</li>
          <li><code>flex-wrap</code> — wrap | nowrap</li>
          <li><code>gap</code> — Espacement entre les éléments</li>
        </ul>
        <h6>Sur les enfants :</h6>
        <ul>
          <li><code>flex-grow</code> — Proportion de croissance</li>
          <li><code>flex-shrink</code> — Proportion de rétrécissement</li>
          <li><code>flex-basis</code> — Taille de base</li>
          <li><code>align-self</code> — Alignement individuel</li>
        </ul>
      `
    },
    {
      id: "fe_76", type: "quiz", category: "CSS - Flexbox",
      title: "Centrer avec Flexbox",
      instruction: "Quelles propriétés centrent un élément horizontalement ET verticalement avec Flexbox ?",
      options: [
        "justify-content: center; align-items: center;",
        "text-align: center; vertical-align: middle;",
        "margin: auto; padding: auto;",
        "float: center; clear: both;"
      ],
      correct: 0,
      explanation: "justify-content centre sur l'axe principal, align-items sur l'axe secondaire."
    },
    {
      id: "fe_77", type: "puzzle", category: "CSS - Flexbox",
      title: "Conteneur Flex centré",
      description: "Reconstituez un conteneur Flex centré.",
      pieces: [".container {", "  display: flex;", "  justify-content: center;", "  align-items: center;", "  height: 100vh;", "}"],
      hint: "display: flex active Flexbox, puis on centre sur les deux axes."
    },
    {
      id: "fe_78", type: "code", category: "CSS - Flexbox",
      title: "Layout Flex horizontal",
      description: "Créez un layout avec 3 colonnes.",
      instruction: "Stylisez <code>.row</code> avec <code>display: flex</code>, <code>gap: 20px</code> et <code>justify-content: space-between</code>.",
      language: "CSS",
      code_template: ".row {\n\n}",
      tests: [
        { type: "contains", expected: "display: flex" },
        { type: "contains", expected: "gap: 20px" },
        { type: "contains", expected: "justify-content: space-between" }
      ],
      hint: "3 propriétés dans le bloc .row { }."
    },
    {
      id: "fe_79", type: "quiz", category: "CSS - Flexbox",
      title: "flex-direction: column",
      instruction: "Que fait <code>flex-direction: column</code> ?",
      options: [
        "Empile les éléments verticalement",
        "Crée des colonnes de tableau",
        "Divise l'écran en colonnes égales",
        "Aligne le texte en colonnes"
      ],
      correct: 0,
      explanation: "flex-direction: column change l'axe principal en vertical (empile les enfants)."
    },
    // ─── CSS Grid ────────────────────────────────────────────────
    {
      id: "fe_80", type: "intro", category: "CSS - Grid",
      title: "Introduction à CSS Grid",
      description: "La mise en page en grille.",
      content: `
        <h5 style="color:#264de4;">🔲 CSS Grid</h5>
        <p>CSS Grid est un système de mise en page <strong>bidimensionnel</strong> (lignes ET colonnes) :</p>
        <h6>Sur le conteneur :</h6>
        <ul>
          <li><code>display: grid</code> — Active Grid</li>
          <li><code>grid-template-columns</code> — Définit les colonnes</li>
          <li><code>grid-template-rows</code> — Définit les lignes</li>
          <li><code>gap</code> — Espacement</li>
          <li><code>grid-template-areas</code> — Zones nommées</li>
        </ul>
        <p>Unité spéciale : <code>fr</code> (fraction de l'espace disponible).</p>
      `,
      code_example: `.grid {\n  display: grid;\n  grid-template-columns: 1fr 2fr 1fr;\n  gap: 20px;\n}`
    },
    {
      id: "fe_81", type: "quiz", category: "CSS - Grid",
      title: "Unité fr",
      instruction: "Que représente l'unité <code>fr</code> en CSS Grid ?",
      options: [
        "Une fraction de l'espace disponible",
        "Un pixel fixe",
        "Un pourcentage de la fenêtre",
        "La taille de la police"
      ],
      correct: 0,
      explanation: "fr = fraction. 1fr 2fr 1fr divise l'espace en 4 parts (1+2+1)."
    },
    {
      id: "fe_82", type: "code", category: "CSS - Grid",
      title: "Grille 3 colonnes",
      description: "Créez une grille à 3 colonnes égales.",
      instruction: "Stylisez <code>.grid</code> avec <code>display: grid</code>, <code>grid-template-columns: 1fr 1fr 1fr</code> et <code>gap: 15px</code>.",
      language: "CSS",
      code_template: ".grid {\n\n}",
      tests: [
        { type: "contains", expected: "display: grid" },
        { type: "contains", expected: "grid-template-columns" },
        { type: "contains", expected: "1fr 1fr 1fr" },
        { type: "contains", expected: "gap: 15px" }
      ],
      hint: "3 propriétés dans le bloc .grid { }."
    },
    {
      id: "fe_83", type: "puzzle", category: "CSS - Grid",
      title: "Layout Grid complet",
      description: "Reconstituez un layout Grid.",
      pieces: [".layout {", "  display: grid;", '  grid-template-columns: 250px 1fr;', "  grid-template-rows: auto 1fr auto;", "  gap: 10px;", "  min-height: 100vh;", "}"],
      hint: "Un layout classique : sidebar fixe + contenu flexible."
    },
    // ─── Responsive ──────────────────────────────────────────────
    {
      id: "fe_84", type: "intro", category: "CSS - Responsive",
      title: "Le Responsive Design",
      description: "Adapter le site à tous les écrans.",
      content: `
        <h5 style="color:#264de4;">📱 Responsive Design</h5>
        <p>Le responsive design adapte la mise en page à la taille de l'écran :</p>
        <h6>Media Queries :</h6>
        <pre style="background:#1a1a2e;padding:0.8rem;border-radius:6px;"><code>@media (max-width: 768px) {
  .container { flex-direction: column; }
}</code></pre>
        <h6>Breakpoints courants :</h6>
        <ul>
          <li><code>576px</code> — Mobile</li>
          <li><code>768px</code> — Tablette</li>
          <li><code>992px</code> — Desktop</li>
          <li><code>1200px</code> — Large desktop</li>
        </ul>
        <p><strong>Mobile-first :</strong> Commencez par le mobile, puis ajoutez des styles pour les grands écrans avec <code>min-width</code>.</p>
      `
    },
    {
      id: "fe_85", type: "quiz", category: "CSS - Responsive",
      title: "Media Query",
      instruction: "Quelle media query cible les écrans de 768px ou moins ?",
      options: [
        "@media (max-width: 768px)",
        "@media (min-width: 768px)",
        "@screen (width: 768px)",
        "@responsive (768px)"
      ],
      correct: 0,
      explanation: "@media (max-width: 768px) s'applique quand la largeur est ≤ 768px."
    },
    {
      id: "fe_86", type: "code", category: "CSS - Responsive",
      title: "Media Query mobile",
      description: "Écrivez une media query pour mobile.",
      instruction: "Écrivez une media query pour les écrans de <strong>max-width: 576px</strong> qui change <code>.grid</code> en <code>grid-template-columns: 1fr</code>.",
      language: "CSS",
      code_template: "",
      tests: [
        { type: "contains", expected: "@media" },
        { type: "contains", expected: "max-width: 576px" },
        { type: "contains", expected: ".grid" },
        { type: "contains", expected: "grid-template-columns: 1fr" }
      ],
      hint: "@media (max-width: 576px) { .grid { ... } }"
    },
    // ─── Transitions & Animations ────────────────────────────────
    {
      id: "fe_87", type: "intro", category: "CSS - Animations",
      title: "Transitions CSS",
      description: "Animer les changements de propriétés.",
      content: `
        <h5 style="color:#264de4;">✨ Transitions CSS</h5>
        <p>Les transitions animent le passage d'un état à un autre :</p>
        <ul>
          <li><code>transition-property</code> — Quelle propriété animer</li>
          <li><code>transition-duration</code> — Durée (ex: 0.3s)</li>
          <li><code>transition-timing-function</code> — Courbe (ease, linear, ease-in-out)</li>
          <li><code>transition-delay</code> — Délai avant le début</li>
        </ul>
        <p>Raccourci : <code>transition: propriété durée courbe délai</code></p>
      `,
      code_example: `.btn {\n  background: blue;\n  transition: all 0.3s ease;\n}\n\n.btn:hover {\n  background: darkblue;\n  transform: translateY(-2px);\n}`
    },
    {
      id: "fe_88", type: "quiz", category: "CSS - Animations",
      title: "Transition au survol",
      instruction: "Quelle pseudo-classe déclenche un style au survol de la souris ?",
      options: [":hover", ":active", ":focus", ":visited"],
      correct: 0,
      explanation: ":hover s'active quand la souris survole l'élément."
    },
    {
      id: "fe_89", type: "code", category: "CSS - Animations",
      title: "Bouton avec transition",
      description: "Créez un bouton avec effet hover.",
      instruction: "Stylisez <code>.btn</code> avec <code>transition: all 0.3s ease</code> et <code>.btn:hover</code> avec <code>transform: scale(1.05)</code>.",
      language: "CSS",
      code_template: ".btn {\n\n}\n\n.btn:hover {\n\n}",
      tests: [
        { type: "contains", expected: "transition" },
        { type: "contains", expected: "0.3s" },
        { type: "contains", expected: ":hover" },
        { type: "contains", expected: "transform" },
        { type: "contains", expected: "scale(1.05)" }
      ],
      hint: "Mettez transition sur .btn et transform sur .btn:hover."
    },
    {
      id: "fe_90", type: "intro", category: "CSS - Animations",
      title: "Animations @keyframes",
      description: "Créer des animations complexes.",
      content: `
        <h5 style="color:#264de4;">🎬 Animations @keyframes</h5>
        <p>Les keyframes permettent des animations plus complexes :</p>
        <pre style="background:#1a1a2e;padding:0.8rem;border-radius:6px;"><code>@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.element {
  animation: fadeIn 0.5s ease forwards;
}</code></pre>
        <p>Propriétés d'animation : <code>animation-name</code>, <code>animation-duration</code>, <code>animation-iteration-count</code>, <code>animation-direction</code>.</p>
      `
    },
    {
      id: "fe_91", type: "puzzle", category: "CSS - Animations",
      title: "Animation keyframes",
      description: "Reconstituez une animation CSS.",
      pieces: ["@keyframes pulse {", "  0% { transform: scale(1); }", "  50% { transform: scale(1.1); }", "  100% { transform: scale(1); }", "}", ".icon {", "  animation: pulse 2s infinite;", "}"],
      hint: "D'abord @keyframes avec les étapes, puis l'application sur .icon."
    },
    {
      id: "fe_92", type: "code", category: "CSS - Animations",
      title: "Animation de fondu",
      description: "Créez une animation fadeIn.",
      instruction: "Créez un <code>@keyframes fadeIn</code> allant de <code>opacity: 0</code> à <code>opacity: 1</code>, puis appliquez-le sur <code>.card</code> avec <code>animation: fadeIn 0.5s ease</code>.",
      language: "CSS",
      code_template: "",
      tests: [
        { type: "contains", expected: "@keyframes fadeIn" },
        { type: "contains", expected: "opacity: 0" },
        { type: "contains", expected: "opacity: 1" },
        { type: "contains", expected: "animation: fadeIn" }
      ],
      hint: "@keyframes fadeIn { from { ... } to { ... } } puis .card { animation: ... }"
    },
    // ─── Pseudo-classes & Pseudo-éléments ────────────────────────
    {
      id: "fe_93", type: "intro", category: "CSS - Pseudo-classes",
      title: "Pseudo-classes et pseudo-éléments",
      description: "Cibler des états et créer du contenu.",
      content: `
        <h5 style="color:#264de4;">🎭 Pseudo-classes & Pseudo-éléments</h5>
        <h6>Pseudo-classes (état) :</h6>
        <ul>
          <li><code>:hover</code> — Survol souris</li>
          <li><code>:focus</code> — Élément focalisé</li>
          <li><code>:active</code> — Élément cliqué</li>
          <li><code>:first-child</code> / <code>:last-child</code> — Premier/dernier enfant</li>
          <li><code>:nth-child(n)</code> — Nième enfant</li>
          <li><code>:not(selector)</code> — Négation</li>
        </ul>
        <h6>Pseudo-éléments (contenu) :</h6>
        <ul>
          <li><code>::before</code> — Contenu avant l'élément</li>
          <li><code>::after</code> — Contenu après l'élément</li>
          <li><code>::first-line</code> — Première ligne</li>
          <li><code>::placeholder</code> — Texte placeholder d'un input</li>
        </ul>
      `
    },
    {
      id: "fe_94", type: "quiz", category: "CSS - Pseudo-classes",
      title: "Pseudo-élément ::before",
      instruction: "Quelle propriété est obligatoire pour que <code>::before</code> fonctionne ?",
      options: ["content", "display", "position", "width"],
      correct: 0,
      explanation: "::before et ::after nécessitent la propriété content (même vide : content: '')."
    },
    {
      id: "fe_95", type: "code", category: "CSS - Pseudo-classes",
      title: "Décoration avec ::after",
      description: "Ajoutez un élément décoratif.",
      instruction: "Stylisez <code>.title::after</code> avec <code>content: ''</code>, <code>display: block</code>, <code>width: 50px</code>, <code>height: 3px</code> et <code>background: #00d4ff</code>.",
      language: "CSS",
      code_template: ".title::after {\n\n}",
      tests: [
        { type: "contains", expected: "content" },
        { type: "contains", expected: "display: block" },
        { type: "contains", expected: "width: 50px" },
        { type: "contains", expected: "height: 3px" },
        { type: "contains", expected: "background: #00d4ff" }
      ],
      hint: "5 propriétés dans le bloc .title::after { }."
    },
    // ─── Variables CSS ───────────────────────────────────────────
    {
      id: "fe_96", type: "intro", category: "CSS - Variables & Avancé",
      title: "Les variables CSS",
      description: "Custom Properties pour un code maintenable.",
      content: `
        <h5 style="color:#264de4;">🔧 Variables CSS (Custom Properties)</h5>
        <p>Les variables CSS permettent de stocker des valeurs réutilisables :</p>
        <pre style="background:#1a1a2e;padding:0.8rem;border-radius:6px;"><code>:root {
  --primary: #00d4ff;
  --bg-dark: #0a0a1a;
  --radius: 8px;
}

.btn {
  background: var(--primary);
  border-radius: var(--radius);
}</code></pre>
        <p><strong>Avantages :</strong> Changez une valeur à un seul endroit, thèmes faciles, code DRY.</p>
      `
    },
    {
      id: "fe_97", type: "quiz", category: "CSS - Variables & Avancé",
      title: "Syntaxe variable CSS",
      instruction: "Comment déclare-t-on une variable CSS ?",
      options: ["--nom-variable: valeur;", "$nom-variable: valeur;", "@nom-variable: valeur;", "var nom-variable = valeur;"],
      correct: 0,
      explanation: "Les variables CSS utilisent le préfixe -- et se lisent avec var(--nom)."
    },
    {
      id: "fe_98", type: "code", category: "CSS - Variables & Avancé",
      title: "Définir des variables",
      description: "Créez des variables CSS dans :root.",
      instruction: "Déclarez dans <code>:root</code> : <code>--primary: #3498db</code> et <code>--text: #333</code>. Puis utilisez-les dans <code>body</code> avec <code>color: var(--text)</code>.",
      language: "CSS",
      code_template: ":root {\n\n}\n\nbody {\n\n}",
      tests: [
        { type: "contains", expected: "--primary: #3498db" },
        { type: "contains", expected: "--text: #333" },
        { type: "contains", expected: "var(--text)" }
      ],
      hint: "Déclarez avec -- dans :root, utilisez avec var() dans body."
    },
    {
      id: "fe_99", type: "puzzle", category: "CSS - Variables & Avancé",
      title: "Thème avec variables",
      description: "Reconstituez un système de thème CSS.",
      pieces: [":root {", "  --bg: #ffffff;", "  --text: #333333;", "}", "[data-theme='dark'] {", "  --bg: #1a1a2e;", "  --text: #e2e8f0;", "}"],
      hint: ":root définit le thème clair, [data-theme='dark'] le thème sombre."
    },
    {
      id: "fe_100", type: "quiz", category: "CSS - Variables & Avancé",
      title: "Récap CSS",
      instruction: "Quelle propriété CSS permet de créer un layout bidimensionnel (lignes ET colonnes) ?",
      options: ["display: grid", "display: flex", "display: table", "display: block"],
      correct: 0,
      explanation: "CSS Grid est bidimensionnel (lignes + colonnes). Flexbox est unidimensionnel."
    }
  ];

addExercises("frontend", exercises);
