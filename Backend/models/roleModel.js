import { db } from '../config/db.js';

// CREATE — vérifie d'abord si ce nom de rôle a déjà existé dans cette famille
// Si oui → réactive la ligne existante (pour retrouver la config d'avant)
// Si non → crée une nouvelle ligne
export async function createRoleModel(role, is_active, family_id) {
  // Cherche un rôle du même nom dans cette famille, actif ou non
  const [existing] = await db.query(
    'SELECT role_id FROM roles WHERE role = ? AND family_id = ?',
    [role, family_id]
  );

  if (existing.length > 0) {
    // Rôle déjà connu → on le réactive simplement
    await db.query('UPDATE roles SET is_active = 1 WHERE role_id = ?', [existing[0].role_id]);
    return { insertId: existing[0].role_id, reactivated: true };
  }

  // Rôle jamais créé → insertion normale
  const [result] = await db.query(
    'INSERT INTO roles (role, is_active, family_id) VALUES (?, ?, ?)',
    [role, is_active, family_id]
  );
  return result;
}

// READ
export async function getAllRolesModel() {
  const query = 'SELECT * FROM roles';
  const [result] = await db.query(query);
  return result;
}

// READ — rôles actifs d'une famille spécifique
export async function getRolesByFamilyIdModel(family_id) {
  const query = 'SELECT * FROM roles WHERE family_id = ? AND is_active = 1';
  const [result] = await db.query(query, [family_id]);
  return result;
}

export async function getRoleByIdModel(id) {
  const query = 'SELECT * FROM roles WHERE role_id = ?';
  const [result] = await db.query(query, [id]);
  return result[0];
}

// UPDATE
export async function updateRoleByIdModel(role_id, role, is_active, created_by, family_id) {
  const query = 'UPDATE roles SET role = ?, is_active = ?, created_by = ?, family_id = ? WHERE role_id = ?';
  const [result] = await db.query(query, [role, is_active, created_by, family_id, role_id]);
  return result;
}

// DELETE
export async function deleteRoleByIdModel(id) {
  const query = 'UPDATE roles SET is_active = 0 WHERE role_id = ?';
  const [result] = await db.query(query, [id]);
  return result;
}