import { db } from '../config/db.js';

// CREATE
export async function createRewardTypeModel(name, is_active, created_by) {
    const add = `
    INSERT INTO reward_types (name, is_active, created_by)
    VALUES (?, ?, ?)
  `;
    const [result] = await db.query(add, [name, is_active, created_by]);
    return result;
}

// READ
export async function getAllRewardTypesModel() {
    const select = `
    SELECT * FROM reward_types
  `;
    const [result] = await db.query(select);
    return result;
}

// READ
export async function getRewardTypeByIdModel(id) {
    const select = `
    SELECT * FROM reward_types
    WHERE reward_type_id = ?
  `;
    const [result] = await db.query(select, [id]);
    return result[0];
}

// UPDATE
export async function updateRewardTypeByIdModel(reward_type_id, name, is_active, created_by) {
    const update = `
    UPDATE reward_types
    SET name = ?, is_active = ?, created_by = ?
    WHERE reward_type_id = ?
  `;
    const [result] = await db.query(update, [
        name,
        is_active,
        created_by,
        reward_type_id
    ]);
    return result;
}

// DELETE
export async function deleteRewardTypeByIdModel(id) {
    const deleteQuery = `
    UPDATE reward_types
    SET is_active = 0
    WHERE reward_type_id = ?
  `;
    const [result] = await db.query(deleteQuery, [id]);
    return result;
}