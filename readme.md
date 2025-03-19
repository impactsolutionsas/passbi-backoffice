# BackOfficePassBI

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

> Une application fullstack Next.js moderne avec une architecture modulaire respectant les principes SOLID et le couplage faible.

## 🚀 Caractéristiques

- **Architecture modulaire** : Organisation par domaines fonctionnels
- **Fullstack** : Gestion du backend et frontend sous un même toit
- **TypeScript** : Typage fort pour une meilleure fiabilité
- **API Routes** : API REST intégrée avec Next.js
- **Tests automatisés** : Couverture complète avec Jest et Cypress
- **Documentation** : Documentation complète avec VitePress
- **État global** : Gestion d'état avec Zustand
- **Formulaires** : Validation avec Zod et React Hook Form
- **Base de données** : ORM avec Prisma
- **Authentification** : Système complet avec NextAuth.js
- **UI Components** : Bibliothèque de composants avec Storybook

## 📋 Prérequis

- Node.js (v18+)
- npm ou yarn
- PostgreSQL (ou autre base de données supportée par Prisma)

## 🛠️ Installation

```bash
# Cloner le dépôt
git clone https://github.com/votre-organisation/backofficepassbi.git
cd backofficepassbi

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local

# Générer les clients Prisma
npm run db:generate

# Exécuter les migrations
npm run db:migrate

# Démarrer le serveur de développement
npm run dev
```

## 📊 Structure du projet

La structure du projet suit une architecture modulaire basée sur les domaines fonctionnels :

```
src/
├── modules/       # Modules fonctionnels (auth, users, etc.)
├── core/          # Éléments partagés
├── pages/         # Pages Next.js
├── styles/        # Styles globaux
├── config/        # Configuration
└── lib/           # Bibliothèques et wrappers
```

### Modules

Chaque module est autonome et contient tous les éléments nécessaires à son fonctionnement :

- `api/` : Routes API spécifiques au module
- `components/` : Composants UI spécifiques au module
- `hooks/` : Hooks React spécifiques au module
- `services/` : Services spécifiques au module
- `types/` : Types TypeScript spécifiques au module
- `utils/` : Utilitaires spécifiques au module

## 🧪 Tests

```bash
# Exécuter tous les tests
npm test

# Exécuter les tests avec mode watch
npm run test:watch

# Exécuter les tests avec couverture
npm run test:coverage

# Exécuter les tests end-to-end