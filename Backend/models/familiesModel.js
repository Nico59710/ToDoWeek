import { db } from '../config/db.js';

// CREATE
export async function createFamilyModel(
  name,
  owner_user_id,
  invite_code,

  avatar_url
) {
  const add = `
    INSERT INTO families (
      name,
      owner_user_id,
      invite_code,      
      avatar_url
    )
    VALUES (?, ?, ?, ?)
  `;

  const [result] = await db.query(add, [
    name,
    owner_user_id,
    invite_code,
    avatar_url
  ]);

  return {
    family_id : result.insertId
  };
}

// READ - all
export async function getAllFamiliesModel() {
  const select = `
    SELECT * FROM families
  `;

  const [result] = await db.query(select);
  return result;
}

// READ - by family id
export async function getFamilyByIdModel(id) {
  const select = `
    SELECT * FROM families
    WHERE family_id = ?
  `;

  const [result] = await db.query(select, [id]);
  return result[0];
}

// READ - by ownerID and name
export async function getFamilyByOwnerAndNameModel(owner, name) {
  const select = `
    SELECT family_id FROM families
    WHERE owner_user_id = ? 
    AND name =?
  `;

  const [result] = await db.query(select, [owner, name]);
  return result[0];
}

// READ - by user id
export async function getFamilyByUserIdModel(id) {
  const select = `
    SELECT * FROM families f
    JOIN users_families uf ON 
    uf.family_id = f.family_id
    JOIN users u ON
    uf.user_id = u.user_id
    WHERE u.user_id = ?
  `;
  const [result] = await db.query(select, [id]);
  return result;
}

// READ - by owner id
export async function getFamilyByOwnerIdModel(id) {
  const select = `
    SELECT family_id,name FROM families     
    WHERE owner_user_id = ?
  `;
  const [result] = await db.query(select, [id]);
  return result;
}


// UPDATE
export async function updateFamilyByIdModel(
  family_id,
  name,
  owner_user_id,
  invite_code,
  is_active,
  avatar_url
) {
  const update = `
    UPDATE families
    SET
      name = COALESCE(?, name),
      owner_user_id = COALESCE(?, owner_user_id),
      invite_code = COALESCE(?, invite_code),
      is_active = COALESCE(?, is_active),
      avatar_url = COALESCE(?, avatar_url)
    WHERE family_id = ?
  `;

  const [result] = await db.query(update, [
    name,
    owner_user_id,
    invite_code,
    is_active,
    avatar_url,
    family_id
  ]);

  return result;
}

// DELETE
export async function deleteFamilyByIdModel(id) {
  const deleteQuery = `
    UPDATE families
    SET is_active = 0 , INVITE_code =""
    WHERE family_id = ?
  `;

  const [result] = await db.query(deleteQuery, [id]);
  return result;
}

// Generation d'un code aléatoir pour les invités
export async function updateFamilyInviteCodeModel(id, invite_code) {
    const query = 'UPDATE families SET invite_code = ? WHERE family_id = ?';
    const [result] = await db.query(query, [invite_code, id]);
    return result;
}