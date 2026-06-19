import { db } from '../config/db.js';

// Seed : crée 14 lignes dans roles_permissions pour un rôle (toutes à false)
export async function seedPermissionsForRoleModel(role_id) {
    const query = `
        INSERT INTO roles_permissions (role_id, permission_id, allowed)
        SELECT ?, id, 0
        FROM permissions
        WHERE is_active = 1
    `;
    const [result] = await db.query(query, [role_id]);
    return result;
}

// Récupère les permissions d'un rôle
export async function getPermissionsByRoleIdModel(role_id) {
    const query = `
        SELECT p.action, rp.allowed
        FROM roles_permissions rp
        JOIN permissions p ON rp.permission_id = p.id
        WHERE rp.role_id = ? AND rp.is_active = 1 AND p.is_active = 1
    `;
    const [result] = await db.query(query, [role_id]);
    return result;
}

// Met à jour les permissions d'un rôle — reçoit un tableau [{ action, allowed }]
export async function updatePermissionsModel(role_id, permissions) {
    const [permRows] = await db.query('SELECT id, action FROM permissions WHERE is_active = 1');
    const permMap = {};
    permRows.forEach(p => permMap[p.action] = p.id);

    for (const { action, allowed } of permissions) {
        const permId = permMap[action];
        if (!permId) continue;
        await db.query(
            'UPDATE roles_permissions SET allowed = ? WHERE role_id = ? AND permission_id = ? AND is_active = 1',
            [allowed ? 1 : 0, role_id, permId]
        );
    }
}

// Soft-delete toutes les permissions d'un rôle
export async function softDeletePermissionsByRoleIdModel(role_id) {
    const query = 'UPDATE roles_permissions SET is_active = 0 WHERE role_id = ?';
    const [result] = await db.query(query, [role_id]);
    return result;
}

// Réactive toutes les permissions d'un rôle
export async function reactivatePermissionsByRoleIdModel(role_id) {
    const query = 'UPDATE roles_permissions SET is_active = 1 WHERE role_id = ?';
    const [result] = await db.query(query, [role_id]);
    return result;
}

// Récupère les permissions de l'utilisateur connecté dans une famille donnée
export async function getPermissionsByUserAndFamilyModel(user_id, family_id) {
    const query = `
        SELECT p.action, rp.allowed
        FROM users_families uf
        JOIN roles_permissions rp ON uf.role_id = rp.role_id
        JOIN permissions p ON rp.permission_id = p.id
        WHERE uf.user_id = ? AND uf.family_id = ?
          AND uf.is_active = 1 AND rp.is_active = 1 AND p.is_active = 1
    `;
    const [result] = await db.query(query, [user_id, family_id]);
    return result;
}
