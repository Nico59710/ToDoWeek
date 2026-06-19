# 📄 Cahier des Charges – Application de Gestion des Tâches Familiales (V1)

---

# 1. Introduction

## 1.1 Contexte
L’entreprise CLIENT souhaite développer une application permettant d’organiser et de gérer les tâches ménagères au sein d’un foyer.

L’objectif est de faciliter la répartition des tâches, améliorer le suivi et encourager la participation des enfants dans la vie familiale.

L’application est pensée comme une plateforme **multi-familles (SaaS)**, accessible via web et mobile.

---

## 1.2 Objectifs

### 1.2 Objectifs principaux
- Améliorer la répartition des tâches ménagères
- Éviter les oublis et désorganisation
- Structurer la vie familiale quotidienne
- Suivre les tâches réalisées
- Motiver les enfants via un système de points

### 1.3 Objectifs secondaires
- Simplifier la communication familiale
- Centraliser les tâches du foyer
- Favoriser l’autonomie des enfants
- Visualiser les tâches prioritaires

---

## 1.4 Périmètre

### ✔️ Inclus dans la V1
- Web (React)
- Mobile (React Native)
- Backend Node.js
- API REST Express
- Base de données MySQL
- Authentification
- Gestion familles / rôles
- Tâches + points
- Planning familial
- Notifications

### ❌ Exclu de la V1
- IA
- objets connectés
- chat avancé
- application desktop
- synchronisation domotique

---

# 2. Organisation du projet

## 2.1 Méthodologie
Méthode Agile avec itérations et livraisons progressives.

---

## 2.2 Phases du projet

| Phase | Description |
|------|-------------|
| 1 | Analyse & conception |
| 2 | Backend |
| 3 | Frontend |
| 4 | Mobile |
| 5 | Tests |
| 6 | Déploiement |

---

# 3. Spécifications Fonctionnelles

## 3.1 Modules principaux

### Gestion des tâches
- Création des tâches
- Modification des tâches
- Gestion des priorités
- Gestion des récurrences
- Gestion des catégories

### Gestion familiale
- Gestion des foyers
- Gestion des membres
- Gestion des rôles
- Multi-familles

### Planning & calendrier
- Vue calendrier
- Vue hebdomadaire
- Gestion des échéances

### Notifications
- Notifications de retard
- Notifications d’attribution
- Notifications de validation

### Gamification
- Attribution de points
- Leaderboard optionnel
- Récompenses définies par les parents

### Gestion des pièces
- Cuisine
- Salon
- Chambre
- Salle de bain
- ...

---

## 3.2 Workflow utilisateur

Création de la tâche → Assignation à un membre → Réalisation de la tâche → Soumission "terminée" → Validation par un parent → Attribution des points

---

## 3.3 Rôles & permissions

### Parent
- Gestion complète du foyer
- Validation des tâches
- Gestion des récompenses

### Enfant
- Consultation des tâches
- Validation des tâches réalisées
- Consultation des points

---

## 3.4 Usage et supports

### 📱 Mobile
- Usage individuel
- Consultation rapide
- Validation des tâches

### 🌐 Web
- Administration du foyer
- Gestion avancée

### 🖥️ Dashboard familial
- Affichage tablette murale
- Consultation collective

⚠️ La tablette murale n’est pas obligatoire.

---

# 4. Spécifications techniques

## 4.1 Technologies utilisées

| Élément | Technologie |
|---|---|
| Frontend Web | React |
| Mobile | React Native |
| Backend | Node.js |
| API | Express.js |
| Base de données | MySQL |

---

## 4.2 Architecture backend

### 🧠 Architecture en couches (MVC + API REST)

#### Models
- Représentation des entités
- Relations entre les tables
- Validation des données

#### Controllers
- Gestion des requêtes HTTP
- Retour des réponses API

#### Views
- Remplacées par React / React Native

---

### ⚙️ API (Node.js / Express)

#### Routes
- GET
- POST
- PUT
- DELETE

#### Services
- Logique métier
- Gestion des points
- Gestion des validations

#### Middlewares
- Authentification JWT
- Gestion des permissions
- Gestion des erreurs

---

### 🔁 Architecture globale

Frontend (React / React Responsive)  
→ API REST (Node.js / Express)  
→ Controllers → Services → Models  
→ Base de données MySQL  

📌 Architecture en couches permettant une séparation claire des responsabilités.

---

## 4.3 🔐 Sécurité
- JWT
- Refresh Token
- RBAC (parent / enfant)
- Protection des routes

---

## 4.4 📡 Offline-first
- stockage local
- synchronisation automatique
- gestion des conflits
- fonctionnement hors-ligne partiel

---

# 5. Base de données

## 5.1 Tables principales
- USERS
- FAMILIES
- TASKS
- CATEGORIES
- REWARD_RULES
- NOTIFICATIONS
- INVITATIONS
- PIECES

---

## 5.2 Description des entités

### USERS
- informations utilisateur
- rôle
- points

### TASKS
- titre
- description
- priorité
- statut
- date limite

### PIECES
- zones du foyer
- catégorisation des tâches

---

# 6. Interface

## 6.1 Charte graphique

### 🎨 Palette principale — “Family Dashboard Moderne”

| Usage | Aperçu | Nom de la couleur | Code HEX |
|---|---|---|---|
| Primary | 🟪 | Indigo | `#4F46E5` |
| Secondary | 🟩 | Vert succès | `#22C55E` |
| Accent | 🟨 | Orange doux | `#F59E0B` |
| Background | ⬜ | Gris très clair | `#F8FAFC` |
| Cards | ⬜ | Blanc | `#FFFFFF` |
| Texte principal | ⬛ | Bleu foncé / Slate | `#1E293B` |

---

### 🧠 Direction visuelle
- Interface moderne et familiale
- Design épuré
- Navigation simple
- Optimisation tablette et mobile

---

### ✍️ Typographie
- Police principale : Inter
- Style moderne et responsive

---

## 6.2 Écrans principaux

### 🔐 Authentification
- Connexion
- Inscription
- Mot de passe oublié

### 🏠 Dashboard
- Résumé des tâches
- Points utilisateur
- Activité familiale

### 📋 Gestion des tâches
- Liste des tâches
- Création / modification

### 📅 Calendrier
- Vue mensuelle
- Vue hebdomadaire

### 👨‍👩‍👧 Famille
- Gestion des membres
- Invitations

### 🎮 Récompenses & points
- Historique des points
- Récompenses disponibles

### ⚙️ Paramètres
- Profil utilisateur
- Préférences notifications

---

# 7. Tests

## 7.1 Types de tests
- tests API
- tests permissions
- tests unitaires
- tests fonctionnels
- tests responsive

---

# 8. Maintenance & évolutions

## 8.1 Maintenance V1
- correction bugs
- ajustements mineurs
- optimisation performances

---

## 8.2 Évolutivité future
- nouvelles fonctionnalités
- versions futures (V2, V3)
- gamification avancée
- notifications push

---

⚠️ Ce document concerne uniquement la version 1 (V1).