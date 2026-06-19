const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Maison au top — API",
        version: "1.0.0",
        description: "Documentation de l'API REST du projet de gestion de tâches familiales",
    },
    servers: [{ url: "http://localhost:3000" }],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
        schemas: {
            User: {
                type: "object",
                properties: {
                    user_id: { type: "integer" },
                    email: { type: "string" },
                    first_name: { type: "string" },
                    last_name: { type: "string" },
                    avatar_url: { type: "string" },
                    role_id: { type: "integer" },
                },
            },
            Family: {
                type: "object",
                properties: {
                    family_id: { type: "integer" },
                    name: { type: "string" },
                    owner_user_id: { type: "integer" },
                    invite_code: { type: "string" },
                },
            },
            Task: {
                type: "object",
                properties: {
                    task_id: { type: "integer" },
                    title: { type: "string" },
                    description: { type: "string" },
                    priority: { type: "string", enum: ["basse", "moyenne", "haute"] },
                    status: { type: "string", enum: ["à faire", "en cours", "en attente", "validé"] },
                    due_date: { type: "string", format: "date" },
                    task_points: { type: "integer" },
                    attributed_to: { type: "integer", nullable: true },
                    family_id: { type: "integer" },
                    room_id: { type: "integer", nullable: true },
                    recurrence_type: { type: "string", nullable: true },
                    recurrence_value: { type: "integer", nullable: true },
                    created_by: { type: "integer" },
                    is_active: { type: "integer" },
                },
            },
            Room: {
                type: "object",
                properties: {
                    room_id: { type: "integer" },
                    name: { type: "string" },
                    color: { type: "string" },
                    family_id: { type: "integer" },
                    created_by: { type: "integer" },
                    is_active: { type: "integer" },
                },
            },
            Role: {
                type: "object",
                properties: {
                    role_id: { type: "integer" },
                    role: { type: "string" },
                    family_id: { type: "integer", nullable: true },
                    is_active: { type: "integer" },
                },
            },
            Permission: {
                type: "object",
                description: "Table de référence des 14 actions possibles dans l'application",
                properties: {
                    id: { type: "integer" },
                    action: { type: "string", example: "create_task" },
                    is_active: { type: "boolean" },
                },
            },
            RolePermission: {
                type: "object",
                description: "Table d'association entre un rôle et une permission",
                properties: {
                    id: { type: "integer" },
                    role_id: { type: "integer" },
                    permission_id: { type: "integer" },
                    allowed: { type: "boolean" },
                    is_active: { type: "boolean" },
                },
            },
            UserFamily: {
                type: "object",
                properties: {
                    user_id: { type: "integer" },
                    family_id: { type: "integer" },
                    role_id: { type: "integer" },
                    status: { type: "string", enum: ["pending", "accepted", "refused"] },
                },
            },
        },
    },
    security: [{ bearerAuth: [] }],
    paths: {

        // ==================== AUTH ====================
        "/login": {
            post: {
                tags: ["Auth"],
                summary: "Connexion utilisateur",
                security: [],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["email", "password"],
                                properties: {
                                    email: { type: "string" },
                                    password: { type: "string" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: "Token JWT retourné", content: { "application/json": { schema: { type: "object", properties: { token: { type: "string" } } } } } },
                    401: { description: "Identifiants incorrects" },
                },
            },
        },

        // ==================== USERS ====================
        "/users": {
            post: {
                tags: ["Users"],
                summary: "Créer un utilisateur",
                security: [],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["email", "password", "first_name", "last_name"],
                                properties: {
                                    email: { type: "string" },
                                    password: { type: "string", minLength: 6 },
                                    first_name: { type: "string" },
                                    last_name: { type: "string" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: { description: "Utilisateur créé" },
                    409: { description: "Email déjà utilisé" },
                },
            },
            get: {
                tags: ["Users"],
                summary: "Récupérer tous les utilisateurs",
                responses: {
                    200: { description: "Liste des utilisateurs" },
                },
            },
        },
        "/users/{id}": {
            get: {
                tags: ["Users"],
                summary: "Récupérer un utilisateur par ID",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                responses: { 200: { description: "Utilisateur trouvé" }, 404: { description: "Introuvable" } },
            },
            put: {
                tags: ["Users"],
                summary: "Mettre à jour le rôle système d'un utilisateur",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: { type: "object", properties: { role_id: { type: "integer" } } },
                        },
                    },
                },
                responses: { 200: { description: "Rôle mis à jour" } },
            },
            delete: {
                tags: ["Users"],
                summary: "Supprimer un utilisateur",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                responses: { 200: { description: "Utilisateur supprimé" } },
            },
        },
        "/users/profile/{id}": {
            put: {
                tags: ["Users"],
                summary: "Mettre à jour le profil d'un utilisateur",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    first_name: { type: "string" },
                                    last_name: { type: "string" },
                                    email: { type: "string" },
                                    password: { type: "string" },
                                    avatar_url: { type: "string" },
                                },
                            },
                        },
                    },
                },
                responses: { 200: { description: "Profil mis à jour" } },
            },
        },

        // ==================== FAMILIES ====================
        "/families": {
            post: {
                tags: ["Families"],
                summary: "Créer une famille",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["name", "owner_user_id"],
                                properties: {
                                    name: { type: "string" },
                                    owner_user_id: { type: "integer" },
                                },
                            },
                        },
                    },
                },
                responses: { 201: { description: "Famille créée", content: { "application/json": { schema: { type: "object", properties: { family_id: { type: "integer" } } } } } } },
            },
            get: {
                tags: ["Families"],
                summary: "Récupérer toutes les familles",
                responses: { 200: { description: "Liste des familles" } },
            },
        },
        "/families/{id}": {
            get: {
                tags: ["Families"],
                summary: "Récupérer une famille par ID",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                responses: { 200: { description: "Famille trouvée" } },
            },
            put: {
                tags: ["Families"],
                summary: "Renommer une famille",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: { type: "object", properties: { name: { type: "string" } } },
                        },
                    },
                },
                responses: { 200: { description: "Famille mise à jour" } },
            },
            delete: {
                tags: ["Families"],
                summary: "Supprimer une famille",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                responses: { 200: { description: "Famille supprimée" } },
            },
        },
        "/families/user/{id}": {
            get: {
                tags: ["Families"],
                summary: "Récupérer les familles d'un utilisateur",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                responses: { 200: { description: "Liste des familles de l'utilisateur" } },
            },
        },
        "/families/owner/{id}": {
            get: {
                tags: ["Families"],
                summary: "Récupérer les familles d'un propriétaire",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                responses: { 200: { description: "Liste des familles" } },
            },
        },
        "/families/{id}/invite": {
            post: {
                tags: ["Families"],
                summary: "Générer un code d'invitation",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                responses: { 200: { description: "Code généré", content: { "application/json": { schema: { type: "object", properties: { invite_code: { type: "string" } } } } } } },
            },
        },

        // ==================== USER-FAMILIES ====================
        "/user-families": {
            post: {
                tags: ["User-Families"],
                summary: "Ajouter un utilisateur à une famille",
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["user_id", "family_id"],
                                properties: {
                                    user_id: { type: "integer" },
                                    family_id: { type: "integer" },
                                    role_id: { type: "integer" },
                                },
                            },
                        },
                    },
                },
                responses: { 201: { description: "Utilisateur ajouté" } },
            },
        },
        "/user-families/join": {
            post: {
                tags: ["User-Families"],
                summary: "Rejoindre une famille via un code d'invitation",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["invite_code", "user_id"],
                                properties: {
                                    invite_code: { type: "string" },
                                    user_id: { type: "integer" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: "Demande envoyée en attente de validation" },
                    400: { description: "Code invalide ou expiré" },
                },
            },
        },
        "/user-families/members/{family_id}": {
            get: {
                tags: ["User-Families"],
                summary: "Récupérer les membres d'une famille",
                parameters: [{ name: "family_id", in: "path", required: true, schema: { type: "integer" } }],
                responses: { 200: { description: "Liste des membres" } },
            },
        },
        "/user-families/pending/{family_id}": {
            get: {
                tags: ["User-Families"],
                summary: "Récupérer les demandes en attente pour une famille",
                parameters: [{ name: "family_id", in: "path", required: true, schema: { type: "integer" } }],
                responses: { 200: { description: "Liste des demandes en attente" } },
            },
        },
        "/user-families/status/{family_id}/{user_id}": {
            put: {
                tags: ["User-Families"],
                summary: "Accepter ou refuser une demande d'adhésion",
                parameters: [
                    { name: "family_id", in: "path", required: true, schema: { type: "integer" } },
                    { name: "user_id", in: "path", required: true, schema: { type: "integer" } },
                ],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: { type: "object", properties: { status: { type: "string", enum: ["accepted", "refused"] } } },
                        },
                    },
                },
                responses: { 200: { description: "Statut mis à jour" } },
            },
        },
        "/user-families/role/{family_id}/{user_id}": {
            put: {
                tags: ["User-Families"],
                summary: "Changer le rôle familial d'un membre",
                description: "Met à jour users_families.role_id pour ce membre dans cette famille (rôle familial : papa, maman, enfant…). Distinct du rôle système (users.role_id).",
                parameters: [
                    { name: "family_id", in: "path", required: true, schema: { type: "integer" } },
                    { name: "user_id", in: "path", required: true, schema: { type: "integer" } },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { type: "object", required: ["role_id"], properties: { role_id: { type: "integer" } } },
                        },
                    },
                },
                responses: { 200: { description: "Rôle familial mis à jour" } },
            },
        },
        "/user-families/{family_id}/{user_id}": {
            delete: {
                tags: ["User-Families"],
                summary: "Retirer un membre d'une famille (ou quitter)",
                description: "Soft delete de la liaison. Si c'était la dernière famille active de l'utilisateur, son rôle système repasse à 'temp'.",
                parameters: [
                    { name: "family_id", in: "path", required: true, schema: { type: "integer" } },
                    { name: "user_id", in: "path", required: true, schema: { type: "integer" } },
                ],
                responses: { 200: { description: "Membre retiré" } },
            },
        },

        // ==================== TASKS ====================
        "/tasks": {
            post: {
                tags: ["Tasks"],
                summary: "Créer une tâche",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["title", "family_id", "created_by"],
                                properties: {
                                    title: { type: "string" },
                                    description: { type: "string" },
                                    priority: { type: "string", enum: ["basse", "moyenne", "haute"] },
                                    due_date: { type: "string", format: "date", nullable: true },
                                    task_points: { type: "integer" },
                                    status: { type: "string" },
                                    is_active: { type: "integer" },
                                    room_id: { type: "integer", nullable: true },
                                    recurrence_type: { type: "string", nullable: true },
                                    recurrence_value: { type: "integer", nullable: true },
                                    attributed_to: { type: "integer", nullable: true },
                                    family_id: { type: "integer" },
                                    created_by: { type: "integer" },
                                },
                            },
                        },
                    },
                },
                responses: { 201: { description: "Tâche créée" } },
            },
            get: {
                tags: ["Tasks"],
                summary: "Récupérer toutes les tâches",
                responses: { 200: { description: "Liste des tâches" } },
            },
        },
        "/tasks/{id}": {
            get: {
                tags: ["Tasks"],
                summary: "Récupérer une tâche par ID",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                responses: { 200: { description: "Tâche trouvée" } },
            },
            put: {
                tags: ["Tasks"],
                summary: "Modifier une tâche",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/Task" } } } },
                responses: { 200: { description: "Tâche modifiée" } },
            },
            delete: {
                tags: ["Tasks"],
                summary: "Supprimer une tâche",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                responses: { 200: { description: "Tâche supprimée" } },
            },
        },
        "/tasks/user/{id}": {
            get: {
                tags: ["Tasks"],
                summary: "Récupérer les tâches d'un utilisateur",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                responses: { 200: { description: "Liste des tâches de l'utilisateur" } },
            },
        },
        "/tasks/family/{id}": {
            get: {
                tags: ["Tasks"],
                summary: "Récupérer les tâches d'une famille",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                responses: { 200: { description: "Liste des tâches de la famille" } },
            },
        },
        // ==================== PERMISSIONS ====================
        "/permissions/role/{role_id}": {
            get: {
                tags: ["Permissions"],
                summary: "Récupérer les permissions d'un rôle",
                description: "Retourne les 14 permissions du rôle via un JOIN roles_permissions → permissions",
                parameters: [{ name: "role_id", in: "path", required: true, schema: { type: "integer" } }],
                responses: {
                    200: {
                        description: "Liste des 14 permissions du rôle",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            action: { type: "string", example: "create_task" },
                                            allowed: { type: "boolean" },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            put: {
                tags: ["Permissions"],
                summary: "Mettre à jour les permissions d'un rôle",
                parameters: [{ name: "role_id", in: "path", required: true, schema: { type: "integer" } }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    permissions: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                action: { type: "string", example: "create_task" },
                                                allowed: { type: "boolean" },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                responses: { 200: { description: "Permissions mises à jour" } },
            },
        },
        "/permissions/user/{user_id}/family/{family_id}": {
            get: {
                tags: ["Permissions"],
                summary: "Récupérer les permissions de l'utilisateur dans une famille",
                description: "Retourne un objet clé/valeur via un JOIN users_families → roles_permissions → permissions. L'admin système reçoit toujours tous les droits côté frontend sans appeler cette route.",
                parameters: [
                    { name: "user_id", in: "path", required: true, schema: { type: "integer" } },
                    { name: "family_id", in: "path", required: true, schema: { type: "integer" } },
                ],
                responses: {
                    200: {
                        description: "Objet de permissions { action: boolean }",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    example: {
                                        create_task: true,
                                        edit_task: true,
                                        delete_task: false,
                                        validate_task: false,
                                        invite_member: false,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },

        "/tasks/{id}/status": {
            put: {
                tags: ["Tasks"],
                summary: "Mettre à jour le statut d'une tâche",
                description: "Si status='validé' : attribue les points au membre. Si la tâche est récurrente (recurrence_type + recurrence_value), remet automatiquement son statut à 'à faire' avec la prochaine due_date calculée.",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status: { type: "string", enum: ["à faire", "en cours", "en attente", "validé"] },
                                    user_id: { type: "integer" },
                                    points: { type: "integer" },
                                    family_id: { type: "integer" },
                                },
                            },
                        },
                    },
                },
                responses: { 200: { description: "Statut mis à jour" } },
            },
        },
        "/tasks/{id}/assign": {
            put: {
                tags: ["Tasks"],
                summary: "Attribuer une tâche à un utilisateur",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: { attributed_to: { type: "integer", nullable: true } },
                            },
                        },
                    },
                },
                responses: { 200: { description: "Tâche attribuée" } },
            },
        },

        // ==================== ROOMS ====================
        "/rooms": {
            post: {
                tags: ["Rooms"],
                summary: "Créer une pièce",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["name", "family_id", "created_by"],
                                properties: {
                                    name: { type: "string" },
                                    color: { type: "string" },
                                    family_id: { type: "integer" },
                                    created_by: { type: "integer" },
                                    is_active: { type: "integer" },
                                },
                            },
                        },
                    },
                },
                responses: { 201: { description: "Pièce créée" } },
            },
            get: {
                tags: ["Rooms"],
                summary: "Récupérer toutes les pièces",
                responses: { 200: { description: "Liste des pièces" } },
            },
        },
        "/rooms/{id}": {
            get: {
                tags: ["Rooms"],
                summary: "Récupérer une pièce par ID",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                responses: { 200: { description: "Pièce trouvée" } },
            },
            put: {
                tags: ["Rooms"],
                summary: "Modifier une pièce",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: { type: "object", properties: { name: { type: "string" }, color: { type: "string" } } },
                        },
                    },
                },
                responses: { 200: { description: "Pièce modifiée" } },
            },
            delete: {
                tags: ["Rooms"],
                summary: "Supprimer une pièce",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                responses: { 200: { description: "Pièce supprimée" } },
            },
        },
        "/rooms/family/{id}": {
            get: {
                tags: ["Rooms"],
                summary: "Récupérer les pièces d'une famille",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                responses: { 200: { description: "Liste des pièces de la famille" } },
            },
        },

        // ==================== ROLES ====================
        "/roles": {
            post: {
                tags: ["Roles"],
                summary: "Créer un rôle familial",
                description: "Crée le rôle et génère automatiquement ses 14 permissions à false. Si un rôle du même nom existait déjà (is_active=0), il est réactivé avec ses anciennes permissions.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["role", "family_id"],
                                properties: {
                                    role: { type: "string", example: "papa" },
                                    is_active: { type: "integer", example: 1 },
                                    family_id: { type: "integer" },
                                },
                            },
                        },
                    },
                },
                responses: { 201: { description: "Rôle créé ou réactivé" } },
            },
            get: {
                tags: ["Roles"],
                summary: "Récupérer tous les rôles",
                responses: { 200: { description: "Liste des rôles" } },
            },
        },
        "/roles/family/{family_id}": {
            get: {
                tags: ["Roles"],
                summary: "Récupérer les rôles d'une famille",
                parameters: [{ name: "family_id", in: "path", required: true, schema: { type: "integer" } }],
                responses: { 200: { description: "Liste des rôles actifs de la famille" } },
            },
        },
        "/roles/{id}": {
            get: {
                tags: ["Roles"],
                summary: "Récupérer un rôle par ID",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                responses: { 200: { description: "Rôle trouvé" } },
            },
            put: {
                tags: ["Roles"],
                summary: "Modifier un rôle",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: { type: "object", properties: { name: { type: "string" } } },
                        },
                    },
                },
                responses: { 200: { description: "Rôle modifié" } },
            },
            delete: {
                tags: ["Roles"],
                summary: "Supprimer un rôle",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                responses: { 200: { description: "Rôle supprimé" } },
            },
        },
    },
};

export default swaggerDefinition;
