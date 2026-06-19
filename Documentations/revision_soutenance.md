# Révisions soutenance — Maison au top

Sujets à maîtriser et savoir expliquer à l'oral.

---

## 1. Le JWT et `AuthService.getRole()`

### C'est quoi un JWT ?

Un JWT (JSON Web Token) est une chaîne encodée en base64 qui contient des données signées par le serveur. Il ressemble à ça :

```
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJlbWFpbCI6Ii4uLiIsInJvbGUiOiJhZG1pbiJ9.SIGNATURE
```

Il est composé de 3 parties séparées par des `.` :
- **Header** : algorithme de signature
- **Payload** : les données (claims) — `user_id`, `email`, `role`, `exp`
- **Signature** : garantit que le token n'a pas été falsifié

### Comment on l'utilise dans le projet ?

À la connexion, le backend génère un JWT et le retourne. Le frontend le stocke dans `localStorage` :

```js
localStorage.setItem('token', token)
```

`AuthService.js` le relit à chaque besoin via `jwtDecode()` :

```js
function getRole() {
    if (isConnected()) {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);  // décode le payload base64
        return decodedToken.role;               // retourne "admin", "membre", "temp"...
    }
    return "";
}
```

`jwtDecode` ne vérifie PAS la signature — il lit juste le payload. La vérification de signature se fait côté backend à chaque requête.

### Pourquoi `role === "admin"` dans `can()` est fiable ?

Le `role` dans le JWT est le **rôle système** (colonne `users.role_id`), défini par le backend au moment du login. Il ne change que si le backend régénère un token (ex : `PUT /users/profile/:id`).

Ce n'est PAS le rôle familial (`users_families.role_id` = papa, maman, enfant…). Ces deux systèmes sont distincts :

| Concept | Table | Exemples | Usage |
|---|---|---|---|
| Rôle système | `users` | `admin`, `membre`, `temp` | Accès global à l'app |
| Rôle familial | `users_families` | `papa`, `maman`, `enfant` | Permissions dans une famille |

Donc dans `can()` :
```js
const can = (action) => {
    if (role === "admin") return true;   // admin système → tous les droits
    return permissions[action] === true; // sinon → vérifie la BDD
};
```

`role === "admin"` ici désigne le créateur/propriétaire de l'app/famille. C'est le JWT qui fait foi.

---

## 2. `useEffect` — dépendances, `.then/.catch`

### C'est quoi `useEffect` ?

`useEffect` permet d'exécuter du code en dehors du rendu React : appels API, abonnements, timers. Il s'exécute **après** que le composant est affiché dans le DOM.

```js
useEffect(() => {
    // code à exécuter
}, [dépendances]);
```

### Les règles des dépendances

| Tableau de dépendances | Comportement |
|---|---|
| Absent | Se relance à chaque rendu |
| `[]` vide | Se lance une seule fois au montage |
| `[valeur]` | Se relance chaque fois que `valeur` change |
| `[a, b]` | Se relance si `a` OU `b` change |

### L'exemple de `Membres.jsx`

```js
useEffect(() => {
    if (selectedFamily) {                           // garde : si pas de famille, on sort
        getRolesByFamilyId(selectedFamily.family_id) // appel API → retourne une Promise
            .then(res => setFamilyRoles(res.data))   // si succès : stocke les rôles
            .catch(err => console.error(err));        // si erreur : log sans planter
    }
}, [selectedFamily]); // se relance à chaque changement de famille sélectionnée
```

**Pourquoi `.then/.catch` et pas `async/await` ici ?**

`useEffect` ne peut pas recevoir une fonction `async` directement (ça crée un bug de Promise non gérée). Il y a deux façons de faire :

**Option A — `.then/.catch`** (utilisée ici) :
```js
useEffect(() => {
    getRolesByFamilyId(id).then(res => setState(res.data)).catch(err => console.error(err));
}, [selectedFamily]);
```

**Option B — fonction async interne** (équivalente) :
```js
useEffect(() => {
    const load = async () => {
        try {
            const res = await getRolesByFamilyId(id);
            setState(res.data);
        } catch (err) {
            console.error(err);
        }
    };
    load();
}, [selectedFamily]);
```

Les deux font exactement la même chose. L'option B est plus lisible quand il y a plusieurs appels enchaînés.

---

## 3. Logiques de filtre dans `Task.jsx`

### Vue d'ensemble

La page Tasks reçoit **toutes** les tâches de la famille depuis l'API, puis les filtre côté frontend selon la période et le statut.

```js
const tasks = [...]; // toutes les tâches de la famille (depuis l'API)
```

### Filtre 1 : `filteredTasks` — par période

```js
const today = new Date();
today.setHours(0, 0, 0, 0); // minuit aujourd'hui (pour comparer les dates sans l'heure)

const filteredTasks = tasks.filter(task => {
    if (!task.due_date) return true; // pas de date limite → toujours visible

    const due = new Date(task.due_date);

    if (period === "aujourd'hui")
        return due.toDateString() === today.toDateString(); // même jour

    if (period === "semaine") {
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (7 - today.getDay())); // dimanche prochain
        return due >= today && due <= endOfWeek;
    }

    if (period === "mois")
        return due.getMonth() === today.getMonth()       // même mois
            && due.getFullYear() === today.getFullYear(); // même année

    return true; // period === "toutes"
});
```

**Point clé :** `today.getDay()` retourne 0 (dimanche) à 6 (samedi). `7 - today.getDay()` donne le nombre de jours jusqu'au prochain dimanche.

### Filtre 2 : `unassignedTasks` — non attribuées

```js
const unassignedTasks = filteredTasks.filter(t =>
    t.attributed_to === null        // personne n'a pris la tâche
    && t.status !== "en attente"    // pas en cours de validation
    && t.status !== "validé"        // pas déjà terminée
);
```

Ces tâches apparaissent dans la colonne "À attribuer" du Kanban.

### Filtre 3 : `tasksByMember` — tâches d'un membre

```js
const tasksByMember = (memberId) => filteredTasks.filter(t =>
    Number(t.attributed_to) === Number(memberId) // même ID (Number() évite les comparaisons string/int)
    && t.status !== "en attente"
    && t.status !== "validé"
);
```

Appelée pour chaque membre : `tasksByMember(member.user_id)`. Retourne les tâches en cours de ce membre.

### Filtre 4 : `tasksToValidate` — en attente de validation

```js
const tasksToValidate = tasks.filter(t => t.status === "en attente");
// Note : utilise `tasks` (pas filteredTasks) — on veut TOUTES les tâches à valider
// indépendamment de la période affichée
```

Ces tâches apparaissent dans l'onglet "À valider" (visible uniquement si `can("validate_task")`).

---

## 4. Récurrence — `calculateNextDate` et le flow de validation

### Le flow complet quand on valide une tâche

Quand l'admin clique "Valider" sur une tâche, le frontend appelle :

```js
PUT /tasks/:id/status
Body: { status: "validé", user_id, points, family_id }
```

Le controller `updateTaskStatusController` fait alors **3 choses dans l'ordre** :

```js
// 1. Met à jour le statut
await taskModel.updateTaskStatusModel(id, status);

// 2. Si validée → ajoute les points au membre dans sa famille
if (status === "validé" && user_id && points && family_id) {
    await users_familiesModel.addPointsToUserFamilyModel(user_id, family_id, points);
}

// 3. Si validée ET récurrente → remet la tâche à "à faire" avec la prochaine date
if (status === "validé") {
    const task = await taskModel.getTaskByIdModel(id);
    if (task.recurrence_type && task.recurrence_value) {
        const nextDate = calculateNextDate(task.due_date, task.recurrence_type, task.recurrence_value);
        await taskModel.resetTaskForRecurrenceModel(id, nextDate);
    }
}
```

### `calculateNextDate` — calcul de la prochaine échéance

```js
function calculateNextDate(dueDate, type, value) {
    const date = dueDate ? new Date(dueDate) : new Date(); // part de la due_date ou d'aujourd'hui
    const n = parseInt(value);                              // convertit "2" en nombre 2

    if (type === "jours")   date.setDate(date.getDate() + n);         // +n jours
    else if (type === "semaine") date.setDate(date.getDate() + n * 7); // +n semaines
    else if (type === "mois")    date.setMonth(date.getMonth() + n);   // +n mois
    else if (type === "années")  date.setFullYear(date.getFullYear() + n); // +n ans

    return date.toISOString().slice(0, 10); // retourne "2026-07-15" (format SQL DATE)
}
```

**Exemple concret :**
- Tâche "Vider les poubelles", `due_date = "2026-06-19"`, `recurrence_type = "semaine"`, `recurrence_value = 1`
- `calculateNextDate("2026-06-19", "semaine", 1)` → `"2026-06-26"`
- La tâche repart à zéro avec `status = "à faire"` et `due_date = "2026-06-26"`

### `resetTaskForRecurrenceModel` — le reset en BDD

Ce modèle fait une seule UPDATE :
```sql
UPDATE tasks SET status = 'à faire', due_date = ? WHERE task_id = ?
```

La tâche n'est pas supprimée et recréée — elle est réinitialisée. C'est le soft-reset.

---

## 5. Architecture du système de permissions

### Les deux niveaux

```
Niveau 1 — Rôle système (JWT)
  users.role_id → "admin" | "membre" | "temp"
  Défini une fois à l'inscription, change rarement

Niveau 2 — Permissions familiales (BDD)
  permissions(id, action)           ← 14 actions fixes
  roles_permissions(role_id, permission_id, allowed)  ← table d'association
  users_families(user_id, family_id, role_id)         ← quel rôle familial a le user
```

### La requête SQL clé — 3 JOINs

```sql
SELECT p.action, rp.allowed
FROM users_families uf
JOIN roles_permissions rp ON uf.role_id = rp.role_id   -- rôle familial du user
JOIN permissions p ON rp.permission_id = p.id           -- action correspondante
WHERE uf.user_id = ? AND uf.family_id = ?
  AND uf.is_active = 1 AND rp.is_active = 1 AND p.is_active = 1
```

**Lecture :** "Pour cet utilisateur dans cette famille → trouve son rôle familial → récupère les permissions de ce rôle → retourne les actions avec leur état autorisé/refusé"

### Le résultat transformé côté backend

```js
// Le controller transforme le tableau SQL en objet clé/valeur :
const result = {};
rows.forEach(row => result[row.action] = row.allowed === 1);
// → { create_task: true, delete_task: false, validate_task: false, ... }
```

### `can()` côté frontend

```js
const can = (action) => {
    if (role === "admin") return true;       // admin système → bypass total
    return permissions[action] === true;      // sinon → vérifie l'objet permissions
};
```

Le `permissions` est chargé dans `AuthProvider` à chaque changement de `selectedFamily`.

### Ce qu'il faut savoir expliquer à l'oral

1. Pourquoi deux tables (`permissions` + `roles_permissions`) au lieu d'une seule ?
   → Normalisation SGBDR : les 14 actions sont définies une fois dans `permissions`, pas répétées pour chaque rôle. `roles_permissions` est la table de liaison Many-to-Many entre `roles` et `permissions`.

2. Pourquoi l'admin système bypass `can()` sans aller en BDD ?
   → L'admin est le créateur de la famille, son identité est dans le JWT signé par le serveur. Pas besoin de vérifier la BDD — c'est plus performant et c'est une règle métier immuable.

3. Que se passe-t-il si l'utilisateur change de famille ?
   → `selectedFamily` change → le `useEffect` dans `AuthProvider` se déclenche → nouvel appel `GET /permissions/user/:id/family/:id` → `setPermissions()` met à jour l'état → tous les composants qui appellent `can()` se re-rendent automatiquement.
