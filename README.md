# Maison au top

Application web de gestion de tâches ménagères pour les familles. Chaque membre de la famille peut créer, s'attribuer et valider des tâches, gagner des points, et gérer les rôles et permissions au sein de la famille.

---

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | React 19 + Vite 8 + React Router 7 |
| Backend | Node.js + Express 5 |
| Base de données | MySQL |
| Auth | JWT (jsonwebtoken) + bcrypt |
| HTTP client | Axios |
| Documentation API | Swagger UI |

---

## Structure du projet

```
TodoWeek/
├── Frontend/          # Application React
├── Backend/           # API REST Express
└── Documentations/    # MCD, MLD, cahier des charges, flows, révisions
```

---

## Prérequis

- Node.js ≥ 18
- MySQL ≥ 8
- npm

---

## Installation

### Backend

```bash
cd Backend
npm install
```

Créer un fichier `.env` à la racine du dossier `Backend` :

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=ton_mot_de_passe
DB_NAME=todoweed
JWT_SECRET=ton_secret_jwt
PORT=3000
```

Lancer le script SQL pour créer les tables :
```bash
# Importer Documentations/script LDD.txt dans MySQL
```

Démarrer le serveur :
```bash
npm start   # nodemon app.js — redémarrage automatique
```

L'API est disponible sur `http://localhost:3000`  
La documentation Swagger est sur `http://localhost:3000/api-docs`

---

### Frontend

```bash
cd Frontend
npm install
npm run dev   # démarre sur http://localhost:5173
```

#### Commandes disponibles

```bash
npm run dev      # serveur de développement (HMR)
npm run build    # build de production
npm run preview  # prévisualiser le build
npm run lint     # ESLint
```

---

## Fonctionnalités

### Authentification
- Inscription avec validation des champs (email, mot de passe ≥ 6 car.)
- Connexion via JWT stocké en `localStorage`
- Connexion automatique après inscription
- Déconnexion (reset complet du contexte)

### Familles
- Créer une famille (devient admin)
- Rejoindre via code d'invitation (demande en attente de validation)
- Renommer ou supprimer la famille
- Changer de famille active (multi-famille supporté)

### Tâches — Kanban
- Créer, modifier, supprimer des tâches (soft delete)
- Attribuer une tâche à un membre ou s'auto-assigner
- Filtrer par période : aujourd'hui / semaine / mois / toutes
- Soumettre une tâche à validation
- Valider ou refuser une tâche (l'admin valide, les points sont crédités)
- Récurrence automatique : la tâche se remet à "à faire" avec la prochaine date calculée

### Membres
- Voir la liste des membres et leur profil (tâches, points)
- Inviter via code (usage unique)
- Accepter ou refuser les demandes d'adhésion
- Retirer un membre ou quitter la famille
- Changer le rôle familial d'un membre

### Pièces
- Créer, modifier, supprimer les pièces de la maison
- Associer une pièce à une tâche lors de la création

### Rôles & Permissions
- Créer des rôles familiaux personnalisés (papa, maman, enfant…)
- Configurer les 14 permissions par rôle via une grille interactive
- Attribution d'un rôle à chaque membre de la famille
- Soft-delete avec réactivation intelligente (restaure les anciennes permissions)

### Paramètres
- Modifier son profil (prénom, nom, email, mot de passe, avatar)
- Gérer les pièces et les rôles (section admin)

---

## Architecture

### Base de données (tables principales)

| Table | Description |
|---|---|
| `users` | Comptes utilisateurs + rôle système (`temp` / `membre` / `admin`) |
| `families` | Familles avec code d'invitation |
| `users_families` | Association user ↔ famille + rôle familial + points + statut |
| `tasks` | Tâches avec statut, priorité, récurrence, attribution |
| `rooms` | Pièces de la maison |
| `roles` | Rôles familiaux personnalisés par famille |
| `permissions` | Référentiel des 14 actions possibles |
| `roles_permissions` | Association rôle ↔ permission + allowed (Many-to-Many) |

### Système de permissions

Chaque membre a un rôle familial (`users_families.role_id`). Ce rôle est lié à des permissions via la table d'association `roles_permissions`.

```
users_families ──> roles ──< roles_permissions >── permissions
```

La fonction `can("action")` dans le contexte React vérifie les permissions en temps réel. L'admin système (`role = "admin"` dans le JWT) a toujours tous les droits sans consulter la BDD.

### Auth flow

```
Login → POST /login → JWT → localStorage
JWT → jwtDecode → AuthContext (role, userId, mail)
selectedFamily change → GET /permissions/user/:id/family/:id → can()
```

### Routes frontend

| Chemin | Page |
|---|---|
| `/` | Homepage (login, inscription, onboarding) |
| `/tasks` | Kanban des tâches |
| `/planning` | Planning (à venir) |
| `/members` | Gestion des membres |
| `/dashboard` | Dashboard (à venir) |
| `/rewards` | Récompenses (à venir) |
| `/settings` | Paramètres profil, pièces, rôles |

### Routes API principales

```
POST   /login
POST   /users                          Inscription
GET    /users/:id
PUT    /users/profile/:id

GET    /families/user/:id
POST   /families
PUT    /families/:id
DELETE /families/:id
POST   /families/:id/invite

POST   /user-families/join
PUT    /user-families/status/:fId/:uId
PUT    /user-families/role/:fId/:uId
DELETE /user-families/:fId/:uId

GET    /tasks/family/:id
POST   /tasks
PUT    /tasks/:id
PUT    /tasks/:id/status
PUT    /tasks/:id/assign
DELETE /tasks/:id

GET    /rooms/family/:id
POST   /rooms
PUT    /rooms/:id
DELETE /rooms/:id

GET    /roles/family/:id
POST   /roles
DELETE /roles/:id

GET    /permissions/role/:roleId
PUT    /permissions/role/:roleId
GET    /permissions/user/:userId/family/:familyId
```

---

## Documentation

| Fichier | Contenu |
|---|---|
| `Documentations/FLOWS.md` | Flows complets de toutes les features (API + BDD + frontend) |
| `Documentations/revision_soutenance.md` | Cours sur les sujets techniques à maîtriser |
| `Documentations/cahier des charge.md` | Cahier des charges du projet |
| `Documentations/MCD.loo` | Modèle Conceptuel de Données |
| `Documentations/MLD textuel.txt` | Modèle Logique de Données |
