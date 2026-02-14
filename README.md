# PROJET CARTHAGE — Next.js

Plateforme de formation au code immersive, inspirée de **Code Lyoko**. Migrée depuis HTML/CSS/JS/PHP vers **Next.js 16** avec TypeScript, TailwindCSS et Framer Motion.

## Stack Technique

| Technologie | Rôle |
|---|---|
| **Next.js 16** (App Router) | Framework React avec SSR/SSG |
| **TypeScript** | Typage strict |
| **TailwindCSS v4** | Styles utilitaires optimisés |
| **Framer Motion** | Animations fluides |
| **Lucide React** | Icônes SVG optimisées |
| **next-sitemap** | Génération automatique sitemap.xml |

## SEO & Performance

- **SSG** sur toutes les pages publiques (homepage, exercices)
- **JSON-LD** structured data (WebSite + Course ItemList)
- **OpenGraph** + Twitter Cards metadata
- **robots.txt** + **sitemap.xml** automatique
- **next/font** — fonts auto-optimisées (Orbitron, Inter, Share Tech Mono)
- **next/image** — images AVIF/WebP avec lazy loading
- **React Compiler** activé
- **Security headers** (X-Content-Type-Options, X-Frame-Options, etc.)

## Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage (SSG)
│   ├── layout.tsx            # Root layout + JSON-LD + metadata
│   ├── login/                # Connexion (OAuth + email)
│   ├── register/             # Inscription
│   ├── dashboard/            # Dashboard utilisateur
│   ├── badges/               # Badges & succès
│   ├── exercises/[module]/   # Modules d'exercices (SSG par module)
│   └── api/auth/             # API proxy vers backend PHP
├── components/
│   ├── home/                 # Sections homepage (Hero, Story, Missions...)
│   ├── layout/               # Navbar, Footer
│   └── ui/                   # ParticlesCanvas, ScrollReveal
└── lib/
    ├── constants.ts           # Modules, blocs, couleurs, SEO
    ├── auth-context.tsx       # AuthProvider (localStorage + API)
    └── exercises/             # Registre des données d'exercices
```

## Démarrage

```bash
# 1. Installer les dépendances
npm install

# 2. Copier la config environnement
cp .env.example .env.local

# 3. Lancer en développement
npm run dev

# 4. Build production
npm run build

# 5. Lancer en production
npm start
```

## Migration des exercices

Les données d'exercices sont chargées via le **registre** (`src/lib/exercises/`). Pour migrer les exercices existants :

1. Créer un fichier par partie (ex: `frontend-part1.ts`)
2. Importer et appeler `addExercises("moduleId", exercises)`
3. Importer le fichier dans `exercise-client.tsx`

Voir `src/lib/exercises/frontend-sample.ts` comme exemple.

## Auth

L'authentification supporte 3 modes :
- **localStorage** — fonctionnel sans backend
- **API PHP** — proxy via `/api/auth` vers le backend XAMPP existant
- **OAuth** (Discord + Google) — via le backend PHP

## Déploiement

Compatible Vercel, Netlify, ou tout hébergeur Node.js.

```bash
npm run build  # Build + sitemap
npm start      # Production server
```
