# PROJET CARTHAGE

> Plateforme d'apprentissage du code 100% gratuite, immersive et gamifiée, inspirée de l'univers de **Code Lyoko**.

**[gamematcher.fr](https://gamematcher.fr)**

---

## Fonctionnalités

### 1100+ exercices interactifs

8 modules couvrant le développement web, mobile et desktop :

| Module | Exercices | Contenu |
|---|---|---|
| **Front-End** | 250 | HTML, CSS, Bootstrap, SCSS, DOM |
| **JavaScript** | 102 | ES6+, async, closures, prototypes |
| **Python** | 120 | Bases, POO, data science, automatisation |
| **Dart & Flutter** | 150 | Widgets, state, architecture, tests |
| **React** | 120 | Hooks, Router, Context, Next.js, patterns |
| **Node.js** | 120 | Express, WebSocket, JWT, streams, GraphQL |
| **C / C++** | 120 | Pointeurs, mémoire, STL, templates, threads |
| **C# .NET** | 120 | POO, LINQ, ASP.NET Core, EF Core, Blazor |

### Battle Code en ligne

Affrontez d'autres joueurs en temps réel sur des défis de code :
- Matchmaking par difficulté (facile, moyen, difficile)
- Modes casual et ranked avec classement ELO
- Timer et soumission en temps réel via Socket.IO
- Système anti-triche (détection changement d'onglet, copier-coller, DevTools)

### Assistant IA — Jérémie Belpois

Un chatbot IA intégré aux pages d'exercices, propulsé par **Mistral AI** :
- Personnalité de Jérémie Belpois (Code Lyoko)
- Guide l'apprenant sans donner la solution
- Contexte automatique de l'exercice en cours

### Autres fonctionnalités

- **Dashboard** avec progression, XP et statistiques
- **Système de badges** et succès
- **Playground** multi-langage avec exécution de code
- **Leaderboard** global
- **Authentification** (email + Google OAuth)
- **Vérification email** via SMTP
- **Anti-DDoS / Rate limiting** middleware
- **SEO** complet (SSG, JSON-LD, OpenGraph, sitemap)

---

## Stack technique

| Technologie | Rôle |
|---|---|
| **Next.js 16** (App Router) | Framework React SSR/SSG |
| **TypeScript** | Typage strict |
| **TailwindCSS v4** | Styles utilitaires |
| **SQLite** (better-sqlite3) | Base de données embarquée |
| **Socket.IO** | Battles en temps réel |
| **Mistral AI** | Chatbot assistant |
| **Lucide React** | Icônes SVG |
| **Nodemailer** | Emails transactionnels |

---

## Installation

### Prérequis

- **Node.js** 20+
- **npm** 9+

### Démarrage rapide

```bash
# 1. Cloner le repo
git clone https://github.com/Akutsu1015/Projet-Carthage.git
cd Projet-Carthage

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
cp .env.example .env.local
# Remplir les valeurs dans .env.local (voir section Configuration)

# 4. Lancer en développement
npm run dev

# 5. Lancer le serveur de battle (optionnel)
node battle-server.js
```

L'app sera accessible sur `http://localhost:3000`.

### Configuration (.env.local)

| Variable | Description | Requis |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | URL de l'app (ex: `http://localhost:3000`) | Oui |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | Non |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Secret | Non |
| `SMTP_HOST` | Serveur SMTP | Non |
| `SMTP_PORT` | Port SMTP | Non |
| `SMTP_USER` | Email SMTP | Non |
| `SMTP_PASS` | Mot de passe SMTP | Non |
| `SMTP_FROM` | Adresse expéditeur | Non |
| `MISTRAL_API_KEY` | Clé API Mistral (chatbot) | Non |

> L'app fonctionne sans aucune variable d'environnement. Les fonctionnalités optionnelles (OAuth, email, chatbot) s'activent automatiquement quand les clés sont fournies.

---

## Structure du projet

```
├── battle-server.js              # Serveur Socket.IO (battles temps réel)
├── src/
│   ├── app/
│   │   ├── page.tsx              # Homepage
│   │   ├── layout.tsx            # Layout racine + SEO
│   │   ├── login/                # Connexion
│   │   ├── register/             # Inscription
│   │   ├── dashboard/            # Dashboard utilisateur
│   │   ├── badges/               # Badges & succès
│   │   ├── exercises/[module]/   # Exercices interactifs
│   │   ├── battle/[id]/          # Arène de battle
│   │   ├── playground/           # Playground multi-langage
│   │   ├── leaderboard/          # Classement
│   │   └── api/db/               # API routes (auth, battle, chat, etc.)
│   ├── components/
│   │   ├── home/                 # Sections homepage
│   │   ├── layout/               # Navbar, Footer
│   │   ├── jeremy-avatar.tsx     # Avatar animé SVG
│   │   └── jeremy-chatbot.tsx    # Chatbot IA
│   └── lib/
│       ├── db.ts                 # Base de données SQLite
│       ├── constants.ts          # Configuration modules
│       ├── auth-context.tsx      # Authentification
│       ├── battle-challenges.ts  # Défis de battle
│       ├── flexible-compare.ts   # Validation flexible
│       ├── mailer.ts             # Emails
│       ├── middleware.ts         # Rate limiting & anti-bot
│       ├── use-anti-cheat.ts     # Hook anti-triche
│       ├── use-battle-socket.ts  # Hook Socket.IO
│       └── exercises/            # 1100+ exercices (37 fichiers)
└── public/
    └── images/                   # Assets (logo, favicon, etc.)
```

---

## Contribuer

Les contributions sont les bienvenues ! Voici comment participer :

1. **Fork** le repo
2. Créez une branche (`git checkout -b feature/ma-feature`)
3. Commitez vos changements (`git commit -m "Add: ma feature"`)
4. Pushez (`git push origin feature/ma-feature`)
5. Ouvrez une **Pull Request**

### Idées de contributions

- Ajouter de nouveaux exercices dans les modules existants
- Créer de nouveaux modules (Go, Rust, Java, PHP...)
- Améliorer l'UI/UX
- Traduire la plateforme (anglais, arabe...)
- Corriger des bugs
- Améliorer l'accessibilité

### Ajouter des exercices

Les exercices sont dans `src/lib/exercises/`. Pour en ajouter :

1. Créer ou modifier un fichier (ex: `python-part6.ts`)
2. Utiliser `addExercises("moduleId", exercises)` pour les enregistrer
3. Importer le fichier dans `exercise-client.tsx`

---

## Déploiement

```bash
# Build production
npm run build

# Lancer
npm start

# Battle server (port 3002)
node battle-server.js
```

Compatible avec tout hébergeur Node.js (VPS, Vercel, Railway, etc.).

---

## Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

Fait avec ❤️ pour sauver le monde — inspiré par Code Lyoko.
