import { db } from '../config/db.js';

// CREATE (liaison user ↔ family)
export async function createUserFamilyModel(family_id, user_id, role) {
  const add = `
    INSERT INTO users_families (family_id, user_id , role_id)
    VALUES (?,?,?)
  `;

  const [result] = await db.query(add, [
    family_id,
    user_id,
    role

  ]);

  return result;
}

// READ - all
export async function getAllUsersFamiliesModel() {
  const select = `
    SELECT * FROM users_families
  `;

  const [result] = await db.query(select);
  return result;
}

// READ - by composite key
export async function getUserFamilyModel(family_id, user_id) {
  const select = `
    SELECT * FROM users_families
    WHERE family_id = ? AND user_id = ?
  `;

  const [result] = await db.query(select, [family_id, user_id]);
  return result[0];
}

// READ - by user_id
export async function getUserFamiliesByUserIdModel(user_id) {
  const select = 'SELECT f.name FROM FAMILIES f JOIN users_families uf ON f.family_id=uf.family_id WHERE uf.user_id=?';
  const [result] = await db.query(select, [user_id]);
  return result;
}

// Récupérer les membres d'une famille 
export async function getMembersByFamilyIdModel(family_ID) {
  const select = `
    SELECT u.user_id, u.first_name, u.last_name, uf.points, uf.role_id, r.role, f.name
    FROM users_families uf
    JOIN users u ON u.user_id = uf.user_id
    LEFT JOIN roles r ON uf.role_id = r.role_id
    JOIN families f ON f.family_id = uf.family_id
    WHERE uf.is_active = 1 AND uf.family_id = ?
  `; 

  const [result] = await db.query(select, [family_ID])
  return result;
}

// UPDATE
export async function updateUserFamilyModel(family_id, user_id, is_active) {
  const update = `
    UPDATE users_families
    SET is_active = ?
    WHERE family_id = ? AND user_id = ?
  `;

  const [result] = await db.query(update, [
    is_active,
    family_id,
    user_id
  ]);

  return result;
}

// DELETE
export async function deleteUserFamilyModel(family_id, user_id) {
  const deleteQuery = `
    UPDATE users_families
    SET is_active = 0
    WHERE family_id = ? AND user_id = ?
  `;

  const [result] = await db.query(deleteQuery, [
    family_id,
    user_id
  ]);

  return result;
}

// Rejoindre une famille via code d'invitation (status: pending)
export async function joinFamilyByCodeModel(invite_code, user_id) {
  const select = 'SELECT family_id FROM families WHERE invite_code = ?';
  const [family] = await db.query(select, [invite_code]);

  if (family.length === 0) return null;
  const family_id = family[0].family_id;

  const [exist] = await db.query('SELECT is_active FROM users_families WHERE user_id = ? AND family_id = ?;',
    [user_id, family_id])

  if (exist.length > 0) {
    const update = 'UPDATE users_families SET is_active = 0, status = "pending" WHERE user_id = ? AND family_id = ?';
    const [result] = await db.query(update, [user_id, family_id])
    return { family_id, message: "Demande envoyée, en attente de validation" };
  }
  const insert = 'INSERT INTO users_families (family_id, user_id, role_id, status,is_active) VALUES (?, ?, 2, "pending",0)';
  await db.query(insert, [family_id, user_id]);
  return { family_id, message: "Demande envoyée, en attente de validation" };

}




// Récupérer les demandes en attente pour une famille
export async function getPendingRequestsModel(family_id) {
  const select = `
        SELECT uf.user_id, u.first_name, u.last_name, u.email
        FROM users_families uf
        JOIN users u ON uf.user_id = u.user_id
        WHERE uf.family_id = ? AND uf.status = "pending"
    `;
  const [result] = await db.query(select, [family_id]);
  return result;
}

// Accepter ou refuser une demande
export async function updateRequestStatusModel(family_id, user_id, status) {
  // Si accepté → membre confirmé + invite_code supprimé (code à usage unique)
  if (status === "accepted") {
    const update = 'UPDATE users_families SET status = ?, role_id = 5 , is_active = 1 WHERE family_id = ? AND user_id = ?';
    await db.query(update, [status, family_id, user_id]);

    // Met à jour le rôle système de l'utilisateur
    await db.query('UPDATE users SET role_id = 5 WHERE user_id = ?', [user_id]);

    // Invalide le code d'invitation → plus personne ne peut l'utiliser
    const [result] = await db.query('UPDATE families SET invite_code = NULL WHERE family_id = ?', [family_id]);
    return result;
  }
  // Si refusé → supprime la ligne pour permettre une nouvelle tentative + invalide le code
  if (status === "refused") {
    await db.query('DELETE FROM users_families WHERE family_id = ? AND user_id = ?', [family_id, user_id]);
    const [result] = await db.query('UPDATE families SET invite_code = NULL WHERE family_id = ?', [family_id]);
    return result;
  }
}

// Changer le rôle d'un membre dans une famille
export async function updateMemberRoleModel(family_id, user_id, role_id) {
  const query = 'UPDATE users_families SET role_id = ? WHERE family_id = ? AND user_id = ? AND is_active = 1';
  const [result] = await db.query(query, [role_id, family_id, user_id]);
  return result;
}

// Compter les familles actives d'un user
export async function countActiveFamiliesByUserIdModel(user_id) {
  const [result] = await db.query(
    'SELECT COUNT(*) as count FROM users_families WHERE user_id = ? AND is_active = 1',
    [user_id]
  );
  return result[0].count;
}

// Ajout de points à un USER par famille
export async function addPointsToUserFamilyModel(user_id, family_id, points) {
  const query = 'UPDATE users_families SET points = points + ? WHERE user_id = ? AND family_id = ?';
  const [result] = await db.query(query, [points, user_id, family_id]);
  return result;
}