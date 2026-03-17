# Portfolio - Jérémy Duc

Portfolio de développeur web full-stack construit avec **Nuxt 3** (frontend) et **Hono** (backend), orchestré avec **Docker**.

## Stack technique

### Frontend
- **Nuxt 3** — Framework Vue.js avec SSR
- **TailwindCSS** — Styling utility-first
- **GSAP** — Animations haute performance
- **Lenis** — Smooth scroll
- **Lucide Icons** — Icônes modernes
- **VueUse** — Composables utilitaires

### Backend
- **Hono** — Framework web ultrarapide TypeScript
- **Zod** — Validation des données
- **CORS** — Gestion cross-origin
- **tsx** — Exécution TypeScript en développement

### DevOps
- **Docker & Docker Compose** — Conteneurisation
- **GitHub Actions** — CI/CD (lint, build, deploy)

## Démarrage rapide

### Prérequis
- Docker & Docker Compose
- Node.js 20+ (pour le développement local sans Docker)

### Avec Docker (recommandé)

```bash
# Cloner le projet
git clone https://github.com/jeremyduc/portfolio.git
cd portfolio

# Lancer en développement
docker compose up --build

# Frontend : http://localhost:11500
# Backend  : http://localhost:11501
```

### Sans Docker

```bash
# Backend
cd backend
npm install
cp .env.example .env
npm run dev

# Frontend (dans un autre terminal)
cd frontend
npm install
npm run dev
```

## Structure du projet

```
portfolio/
├── frontend/                 # Nuxt 3
│   ├── assets/css/          # Styles globaux
│   ├── components/          # Composants Vue
│   │   ├── sections/        # Sections de la page
│   │   ├── CustomCursor.vue
│   │   ├── TheNavbar.vue
│   │   └── TheFooter.vue
│   ├── composables/         # Composables (API, animations)
│   ├── layouts/             # Layouts Nuxt
│   ├── pages/               # Pages
│   ├── plugins/             # Plugins (GSAP, Lenis)
│   └── public/              # Assets statiques
├── backend/                  # Hono
│   └── src/
│       ├── server.ts        # Point d'entrée
│       ├── app.ts           # Configuration Hono
│       └── routes/          # Routes API (projects, contact, about)
├── .github/workflows/        # GitHub Actions
│   ├── ci.yml               # CI (lint, build, docker)
│   └── deploy.yml           # Déploiement automatique
├── docker-compose.yml        # Dev
└── docker-compose.prod.yml   # Production
```

## Ports

| Service  | Port local | Port container |
|----------|-----------|----------------|
| Frontend | 11500     | 3000           |
| Backend  | 11501     | 3333           |

## CI/CD

### Pipeline CI (`.github/workflows/ci.yml`)
- **Lint** frontend et backend en parallèle
- **Build** frontend et backend
- **Docker build** des images de production

### Pipeline Deploy (`.github/workflows/deploy.yml`)
- Build et push des images Docker vers GitHub Container Registry
- Déploiement automatique via SSH sur le serveur

### Secrets GitHub à configurer
- `DEPLOY_HOST` — IP/hostname du serveur
- `DEPLOY_USER` — Utilisateur SSH
- `DEPLOY_SSH_KEY` — Clé SSH privée
- `DEPLOY_PATH` — Chemin du projet sur le serveur

## Production

```bash
# Déployer en production
docker compose -f docker-compose.prod.yml up -d --build
```

## Licence

MIT - Jérémy Duc
