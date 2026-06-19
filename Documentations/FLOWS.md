# Flows utilisateur — Maison au top

Flows complets pour chaque action : déclencheur → appels API → BDD → mise à jour frontend.

*Dernière mise à jour : 2026-06-19*

---

## Rôles système (JWT)

| Rôle | Description |
|---|---|
| `temp` | Utilisateur inscrit sans famille |
| `membre` | Utilisateur dans une ou plusieurs familles |
| `admin` | Propriétaire d'une famille — tous les droits |

---

## 1. FLOWS COMMUNS (tous rôles)

### 1.1 Inscription
**Page :** `/` — Homepage
**Prérequis :** Aucun

1. Remplir : email, mot de passe (≥ 6 car.), prénom (≥ 2 car.), nom (≥ 2 car.)
2. **Validations frontend** avant appel API : longueur de chaque champ
3. **API :** `POST /users { email, password, first_name, last_name }`
   → hash du mot de passe (bcrypt) + INSERT dans `users` avec `role_id = "temp"`
4. Si succès → connexion automatique : `POST /login` avec les mêmes identifiants
5. JWT stocké dans `localStorage`, contexte global mis à jour
6. **Résultat :** `role = "temp"` → écran onboarding (créer / rejoindre une famille)

**Erreurs gérées :**
- 409 → email déjà utilisé
- 400 → champs invalides

---

### 1.2 Connexion
**Page :** `/` — Homepage
**Prérequis :** Avoir un compte

1. Remplir email + mot de passe → "Se connecter"
2. **API :** `POST /login { email, password }`
   → `bcrypt.compare()` + génération d'un JWT signé `{ user_id, email, role, exp }`
3. `localStorage.setItem('token', ...)` + `axios.defaults.headers.Authorization = "Bearer ..."`
4. `jwtDecode(token)` → `setIsLogged(true)` + `setRole()` + `setUserId()` + `setMail()`
5. `useEffect` déclenché → 3 fetches en parallèle :
   - `GET /users/:id` → `setUser()`
   - `GET /families/user/:id` → `setFamilies()`
   - `GET /tasks/user/:id` → `setTasksByUserId()`
6. `AuthProvider` sélectionne la première famille → fetch des permissions
7. **Résultat :** accès à l'application selon le rôle

**Erreurs gérées :**
- 401/403 → "Email ou mot de passe incorrect"

---

### 1.3 Déconnexion
**Page :** `/` — Homepage
**Prérequis :** Être connecté

1. Cliquer "Déconnexion"
2. `localStorage.removeItem('token')`
3. Reset du contexte global : `isLogged=false`, `userId=""`, `role=""`, `families=[]`, etc.
4. **Résultat :** retour à l'écran connexion/inscription — aucun appel API

---

### 1.4 Modifier son profil
**Page :** `/settings`
**Prérequis :** Être connecté

1. Modifier les champs : prénom, nom, email, mot de passe (optionnel), avatar URL
2. **API :** `PUT /users/profile/:userId { first_name, last_name, email, avatar_url, password | null }`
   → UPDATE users (COALESCE — ne modifie que les champs fournis)
   → Si email ou nom changé : génère un nouveau JWT
3. `localStorage.setItem('token', response.data.token)`
4. `jwtDecode()` → `setRole()` + `setMail()` + `setUserId()`
5. **Résultat :** profil mis à jour, token rafraîchi

---

### 1.5 Changer de famille active
**Composant :** Navbar (select famille)
**Prérequis :** Appartenir à plusieurs familles

1. Cliquer sur le sélecteur de famille dans la Navbar
2. `setSelectedFamily(famille choisie)` dans le contexte global
3. `useEffect` sur `[selectedFamily]` dans `AuthProvider` → fetch des nouvelles permissions
4. `useEffect` sur `[selectedFamily]` dans chaque page → refetch des données
5. **Résultat :** toutes les pages rechargent leurs données pour la nouvelle famille

---

## 2. FLOWS ONBOARDING (role "temp")

### 2.1 Créer une famille
**Page :** `/` — Homepage (section temp)
**Prérequis :** `role = "temp"`

1. Saisir le nom de la famille → "Créer la famille"
2. **API 1 :** `POST /families { name, owner_user_id }` → INSERT families → retourne `family_id`
3. **API 2 :** `POST /user-families { user_id, family_id, role: 1 }` → lie l'user à la famille (role_id=admin)
4. **API 3 :** `PUT /users/:id { role_id: 5 }` → UPDATE users : `role_id = "membre"` (plus "temp")
5. **Re-login automatique :** `POST /login` → nouveau JWT avec `role = "membre"`
6. `setRole("membre")` → la navbar et les routes apparaissent
7. **Résultat :** famille créée, accès complet à l'application

---

### 2.2 Rejoindre une famille
**Page :** `/` — Homepage (section temp)
**Prérequis :** `role = "temp"`, avoir un code d'invitation

1. Saisir le code d'invitation → "Rejoindre la famille"
2. **API :** `POST /user-families/join { invite_code, user_id }`
   → vérifie que le code existe et correspond à une famille active
   → Si première fois : `INSERT users_families` avec `status = "pending"`
   → Si déjà connu (a quitté) : `UPDATE is_active = 1, status = "pending"`
   → Le code reste valide pour d'autres (invalidé seulement à l'acceptation/refus)
3. **Résultat :** demande envoyée, l'user reste `role = "temp"` jusqu'à acceptation admin

**Erreurs gérées :**
- Code invalide / famille supprimée → message d'erreur

---

## 3. FLOWS TÂCHES

### 3.1 Créer une tâche
**Page :** `/tasks` — permission : `can("create_task")`

1. Cliquer "+ Ajouter une tâche" → formulaire s'ouvre
2. Remplir : titre (obligatoire), description, priorité, date limite, points, pièce, membre assigné, récurrence
3. **Transformation des champs vides en `null`** (SQL rejette `""` pour les FK et dates) :
   ```js
   due_date: value === "" ? null : value
   room_id: value === "" ? null : value
   attributed_to: value === "" ? null : Number(value)
   ```
4. **API :** `POST /tasks { title, description, priority, due_date, task_points, status: "à faire", room_id, recurrence_type, recurrence_value, attributed_to, family_id, created_by }`
   → INSERT tasks
5. Reset formulaire + `fetchTasks()`
6. **Résultat :** tâche dans "À attribuer" ou dans la colonne du membre si assignée

---

### 3.2 Modifier une tâche
**Page :** `/tasks`

1. Cliquer "Modifier" sur une carte → formulaire pré-rempli s'ouvre
   ```js
   due_date: task.due_date ? task.due_date.slice(0, 10) : "" // format YYYY-MM-DD
   ```
2. Modifier les champs souhaités → "Modifier la tâche"
3. **API :** `PUT /tasks/:id { ...tous les champs, family_id, created_by }`
   → UPDATE tasks avec COALESCE (protège les valeurs existantes)
   → `attributed_to` toujours inclus pour éviter qu'il soit effacé
4. `setModifForm(false)` + `fetchTasks()`
5. **Résultat :** tâche mise à jour, kanban rafraîchi

---

### 3.3 Attribuer une tâche à un membre
**Page :** `/tasks` — permission : `can("assign_task")`

- **Depuis "À attribuer"** : select membre → `handleAssign(task, memberId)`
- **Auto-assignation** : "Prendre la tâche" → `handleAssign(task, userId)`

**API :** `PUT /tasks/:id/assign { attributed_to: memberId }`
→ UPDATE tasks SET attributed_to = ?

**Résultat :** tâche déplacée dans la colonne du membre

---

### 3.4 Se désengager d'une tâche
**Page :** `/tasks` — colonne d'un membre

1. Cliquer "Annuler" sur une tâche qui t'est attribuée
2. **API :** `PUT /tasks/:id/assign { attributed_to: null }`
   → UPDATE tasks SET attributed_to = NULL
3. **Résultat :** tâche repart dans "À attribuer"

---

### 3.5 Soumettre une tâche à validation
**Page :** `/tasks` — colonne d'un membre — permission : `can("submit_task")`

1. Cliquer "Soumettre à validation"
2. **API :** `PUT /tasks/:id/status { status: "en attente", user_id: attributed_to, points: 0, family_id }`
   → UPDATE tasks SET status = "en attente"
3. **Résultat :** tâche disparaît du kanban, apparaît dans l'onglet "À valider"

---

### 3.6 Valider ou refuser une tâche
**Page :** `/tasks` — onglet "À valider" — permission : `can("validate_task")`

1. Cliquer "✅ Valider" ou "❌ Refuser"
2. **API :** `PUT /tasks/:id/status { status, user_id, points, family_id }`

**Backend — 3 actions dans l'ordre :**
```
1. UPDATE tasks SET status = ?

2. Si status = "validé" :
   UPDATE users_families SET points = points + task_points
   (crédite les points au membre dans cette famille)

3. Si status = "validé" ET tâche récurrente :
   calculateNextDate(due_date, recurrence_type, recurrence_value)
   UPDATE tasks SET status = "à faire", due_date = nextDate
   (la tâche repart automatiquement pour le prochain cycle)
```

**Calcul de la prochaine date :**
```js
if (type === "jours")   date.setDate(date.getDate() + n)
if (type === "semaine") date.setDate(date.getDate() + n * 7)
if (type === "mois")    date.setMonth(date.getMonth() + n)
if (type === "années")  date.setFullYear(date.getFullYear() + n)
```

**Résultat :**
- Validée → points crédités, tâche "validée" (ou reset si récurrente)
- Refusée → tâche repart en "à faire" dans le kanban, aucun point

---

### 3.7 Supprimer une tâche
**Page :** `/tasks` — permission : `can("delete_task")`

1. Cliquer "Supprimer" → confirmation "Supprimer X ?"
2. **API :** `DELETE /tasks/:id`
   → UPDATE tasks SET is_active = 0 (soft delete — données conservées)
3. **Résultat :** tâche disparaît du kanban

---

### 3.8 Filtres du kanban

```
filteredTasks   → filtre par période (aujourd'hui / semaine / mois / toutes)
unassignedTasks → filteredTasks WHERE attributed_to = null ET status ∉ { en attente, validé }
tasksByMember   → filteredTasks WHERE attributed_to = memberId ET status ∉ { en attente, validé }
tasksToValidate → tasks (pas filteredTasks) WHERE status = "en attente"
```

`tasksToValidate` utilise `tasks` sans filtre de période pour ne rater aucune validation.

---

## 4. FLOWS MEMBRES

### 4.1 Inviter quelqu'un
**Page :** `/members` — permission : `can("invite_member")`

1. Cliquer "+ Inviter quelqu'un"
2. **API :** `POST /families/:id/invite`
   → génère un code 6 caractères aléatoires (ex: "A3KZ9P")
   → UPDATE families SET invite_code = "A3KZ9P"
3. Code affiché + bouton "Copier" (`navigator.clipboard.writeText`)
4. **Résultat :** code à partager — valide jusqu'à l'acceptation/refus de la prochaine demande

---

### 4.2 Accepter / refuser une demande
**Page :** `/members` — section "Demandes en attente" — permission : `can("accept_member")`

1. Voir les demandes en attente
2. Cliquer "Accepter" ou "Refuser"
3. **API :** `PUT /user-families/status/:familyId/:userId { status: "accepted" | "refused" }`
   → UPDATE users_families SET status = ?
   → Si accepté : UPDATE families SET invite_code = NULL (code invalidé)
   → Si accepté : UPDATE users SET role_id = "membre" (l'user quitte "temp")
4. `fetchPendingRequests()` + `fetchMembers()`
5. **Résultat :** membre rejoint la famille ou demande refusée

---

### 4.3 Voir le profil d'un membre
**Page :** `/members`
**Prérequis :** Appartenir à une famille

1. Cliquer "Voir le profil" sur un membre
2. **API :** `GET /tasks/user/:memberId`
3. Panneau inline s'ouvre : points du membre (`uf.points`) + liste de ses tâches
4. Re-clic → ferme le panneau
5. **Résultat :** profil visible sans navigation

---

### 4.4 Changer le rôle familial d'un membre
**Page :** `/members` — permission : `can("manage_roles")`

1. Select déroulant sur la ligne du membre (visible si `can("manage_roles")` ET pas sa propre ligne)
2. Choisir un rôle dans la liste des rôles de la famille
3. **API :** `PUT /user-families/role/:familyId/:userId { role_id }`
   → UPDATE users_families SET role_id = ? (rôle FAMILIAL, pas le rôle système)
4. `fetchMembers()`
5. **Résultat :** rôle familial mis à jour (les permissions du membre changent immédiatement)

**Important :** modifie `users_families.role_id` (papa/maman/enfant) — PAS `users.role_id` (admin/membre/temp).

---

### 4.5 Retirer un membre
**Page :** `/members` — permission : `can("remove_member")` — pas sur sa propre ligne

1. Cliquer "Retirer" → confirmation
2. **API :** `DELETE /user-families/:familyId/:memberId`
   → UPDATE users_families SET is_active = 0
   → Si c'était sa dernière famille : UPDATE users SET role_id = "temp"
3. `fetchMembers()`
4. **Résultat :** membre retiré de la famille

---

### 4.6 Quitter une famille
**Page :** `/members` — visible si `role !== "admin"`

1. Cliquer "Quitter la famille" → confirmation
2. **API :** `DELETE /user-families/:familyId/:userId` (même route que "retirer")
3. `families` mis à jour (filtre la famille quittée)
4. Si d'autres familles → première famille sélectionnée
5. Si plus aucune famille → `setRole("temp")` + `navigate("/")` → écran onboarding sans re-login
6. **Résultat :** l'utilisateur quitte la famille

---

## 5. FLOWS FAMILLE

### 5.1 Renommer la famille
**Page :** `/members` — permission : `can("rename_family")`

1. Cliquer "Renommer la famille" → formulaire inline
2. Saisir le nouveau nom → "Valider"
3. **API :** `PUT /families/:id { name: newName }`
   → UPDATE families SET name = COALESCE(?, name)
4. Mise à jour locale directe (pas de re-fetch) :
   `setFamilies(...)` + `setSelectedFamily({ ...selectedFamily, name: newName })`
5. **Résultat :** nom mis à jour dans la navbar et partout dans l'app

---

### 5.2 Supprimer la famille
**Page :** `/members` — permission : `can("delete_family")`

1. Cliquer "Supprimer la famille" → confirmation (message irréversible)
2. **API :** `DELETE /families/:id`
   → UPDATE families SET is_active = 0
3. `families` mis à jour (filtre la famille supprimée)
4. Si d'autres familles → première sélectionnée
5. Si plus aucune famille → `setRole("temp")` + `navigate("/")`
6. **Résultat :** famille supprimée — les membres et tâches restent en BDD (soft delete)

---

## 6. FLOWS PIÈCES

### 6.1 Créer une pièce
**Page :** `/settings` — permission : `can("create_room")`

1. Formulaire : nom + couleur → "Ajouter la pièce"
2. **API :** `POST /rooms { name, color, created_by, is_active: 1, family_id }`
   → INSERT rooms
3. `fetchRooms()`
4. **Résultat :** pièce disponible dans le formulaire de création de tâche

---

### 6.2 Modifier une pièce
**Page :** `/settings`

1. Cliquer "Modifier" → formulaire inline pré-rempli
2. Modifier nom et/ou couleur → "Sauvegarder"
3. **API :** `PUT /rooms/:id { name, color }`
   → UPDATE rooms SET name = ?, color = ?
4. `setEditingRoom(null)` + `fetchRooms()`

---

### 6.3 Supprimer une pièce
**Page :** `/settings` — permission : `can("delete_room")`

1. Cliquer "Supprimer" → confirmation
2. **API :** `DELETE /rooms/:id`
   → UPDATE rooms SET is_active = 0
3. `fetchRooms()`

---

## 7. FLOWS RÔLES & PERMISSIONS

### 7.1 Créer un rôle
**Page :** `/settings` — permission : `can("manage_roles")`

1. Saisir le nom du rôle → "Créer le rôle"
2. **API :** `POST /roles { role: "papa", family_id, is_active: 1 }`

**Backend — logique de réactivation intelligente :**
```
→ Cherche si ce nom a déjà existé dans cette famille (is_active = 0 aussi)
  - Si oui → UPDATE roles SET is_active = 1 + UPDATE roles_permissions SET is_active = 1
             (restaure les permissions d'avant la suppression)
  - Si non → INSERT roles + INSERT roles_permissions (14 lignes, toutes à false) :
             INSERT INTO roles_permissions (role_id, permission_id, allowed)
             SELECT ?, id, 0 FROM permissions WHERE is_active = 1
```

3. `fetchRoles()`
4. **Résultat :** rôle disponible avec 14 permissions à configurer

---

### 7.2 Configurer les permissions d'un rôle
**Page :** `/settings` — permission : `can("manage_roles")`

**Charger la grille :**
1. Cliquer sur un rôle dans la liste
2. **API :** `GET /permissions/role/:role_id`
   → `SELECT p.action, rp.allowed FROM roles_permissions rp JOIN permissions p ON rp.permission_id = p.id`
3. Grille de 14 cases à cocher affichée

**Modifier (local uniquement) :**
4. Cocher / décocher → `setPermissions()` (mise à jour locale, pas encore en BDD)

**Sauvegarder :**
5. Cliquer "Enregistrer"
6. **API :** `PUT /permissions/role/:role_id { permissions: [{ action, allowed }, ...] }`
   → Pour chaque permission :
   `UPDATE roles_permissions rp JOIN permissions p ... SET rp.allowed = ? WHERE p.action = ?`

---

### 7.3 Supprimer un rôle
**Page :** `/settings` — permission : `can("manage_roles")`

1. Cliquer "Supprimer" sur un rôle → confirmation
2. **API :** `DELETE /roles/:id`
   → UPDATE roles SET is_active = 0
   → UPDATE roles_permissions SET is_active = 0 WHERE role_id = ?
3. Si ce rôle était sélectionné → `setSelectedRole(null)` (ferme la grille)
4. `fetchRoles()`
5. **Résultat :** rôle et permissions soft-deletés (récupérables si le rôle est recréé avec le même nom)

---

## 8. SYSTÈME DE PERMISSIONS — Architecture

### Tables

| Table | Rôle |
|---|---|
| `permissions` | Référentiel des 14 actions (fixe) |
| `roles_permissions` | Association Many-to-Many rôle ↔ permission + allowed |
| `users_families` | Lie un user à une famille avec son rôle familial |

### Les 14 actions

| Action | Description |
|---|---|
| `create_task` | Créer une tâche |
| `edit_task` | Modifier une tâche |
| `delete_task` | Supprimer une tâche |
| `assign_task` | Attribuer une tâche |
| `submit_task` | Soumettre à validation |
| `validate_task` | Valider une tâche |
| `create_room` | Créer une pièce |
| `delete_room` | Supprimer une pièce |
| `invite_member` | Générer un code d'invitation |
| `remove_member` | Retirer un membre |
| `accept_member` | Accepter une demande |
| `manage_roles` | Gérer les rôles et permissions |
| `rename_family` | Renommer la famille |
| `delete_family` | Supprimer la famille |

### Exemple de grille

| Action | Papa | Maman | Ado | Enfant |
|---|:---:|:---:|:---:|:---:|
| `create_task` | ✅ | ✅ | ✅ | ❌ |
| `validate_task` | ✅ | ✅ | ❌ | ❌ |
| `delete_task` | ✅ | ✅ | ❌ | ❌ |
| `invite_member` | ✅ | ✅ | ❌ | ❌ |
| `manage_roles` | ✅ | ❌ | ❌ | ❌ |
| `delete_family` | ✅ | ❌ | ❌ | ❌ |

### Chargement des permissions (AuthProvider)

```
selectedFamily change
→ Si role === "admin" : setPermissions({}) — pas de fetch
→ Sinon : GET /permissions/user/:userId/family/:familyId
  → SELECT p.action, rp.allowed
    FROM users_families uf
    JOIN roles_permissions rp ON uf.role_id = rp.role_id
    JOIN permissions p ON rp.permission_id = p.id
    WHERE uf.user_id = ? AND uf.family_id = ?
  ← { create_task: true, delete_task: false, ... }
  → setPermissions(res.data)

can("action") = role === "admin" ? true : permissions[action] === true
```
