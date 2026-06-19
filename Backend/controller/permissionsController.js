import { getPermissionsByRoleIdModel, updatePermissionsModel, getPermissionsByUserAndFamilyModel } from '../models/roles_permissionsModel.js';

// READ — permissions d'un rôle
export async function getPermissionsByRoleIdController(req, res) {
    const { role_id } = req.params;
    try {
        const result = await getPermissionsByRoleIdModel(role_id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Échec de la récupération des permissions' });
        console.log(error);
    }
}

// UPDATE — met à jour les permissions d'un rôle
// Body attendu : { permissions: [{ action: "create_task", allowed: true }, ...] }
export async function updatePermissionsController(req, res) {
    const { role_id } = req.params;
    const { permissions } = req.body;
    try {
        await updatePermissionsModel(role_id, permissions);
        res.status(200).json({ message: 'Permissions mises à jour' });
    } catch (error) {
        res.status(500).json({ error: 'Échec de la mise à jour des permissions' });
        console.log(error);
    }
}

// READ — permissions de l'utilisateur connecté dans une famille donnée
// Retourne un objet { create_task: true, delete_task: false, ... }
export async function getPermissionsByUserAndFamilyController(req, res) {
    const { user_id, family_id } = req.params;
    try {
        const rows = await getPermissionsByUserAndFamilyModel(user_id, family_id);
        const result = {};
        rows.forEach(row => result[row.action] = row.allowed === 1);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Échec de la récupération des permissions utilisateur' });
        console.log(error);
    }
}
