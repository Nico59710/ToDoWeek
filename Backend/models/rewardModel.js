import { db } from '../config/db.js';

// CREATE
export async function createRewardModel(
  reward_point,
  reward_name,
  reward_duration,
  reward_created_by,
  reward_created_at,
  reward_updated_at,
  reward_is_active,
  reward_description,
  reward_type_id,
  family_id
) {
  const add = `
    INSERT INTO rewards (
      reward_point,
      reward_name,
      reward_duration,
      reward_created_by,
      reward_created_at,
      reward_updated_at,
      reward_is_active,
      reward_description,
      reward_type_id,
      family_id
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.query(add, [
    reward_point,
    reward_name,
    reward_duration,
    reward_created_by,
    reward_created_at,
    reward_updated_at,
    reward_is_active,
    reward_description,
    reward_type_id,
    family_id
  ]);

  return result;
}

// READ - all
export async function getAllRewardsModel() {
  const select = `
    SELECT * FROM rewards
  `;

  const [result] = await db.query(select);
  return result;
}

// READ - by id
export async function getRewardByIdModel(id) {
  const select = `
    SELECT * FROM rewards
    WHERE reward_id = ?
  `;

  const [result] = await db.query(select, [id]);
  return result[0];
}

// UPDATE
export async function updateRewardByIdModel(
  reward_id,
  reward_point,
  reward_name,
  reward_duration,
  reward_created_by,
  reward_created_at,
  reward_updated_at,
  reward_is_active,
  reward_description,
  reward_type_id,
  family_id
) {
  const update = `
    UPDATE rewards
    SET
      reward_point = ?,
      reward_name = ?,
      reward_duration = ?,
      reward_created_by = ?,
      reward_created_at = ?,
      reward_updated_at = ?,
      reward_is_active = ?,
      reward_description = ?,
      reward_type_id = ?,
      family_id = ?
    WHERE reward_id = ?
  `;

  const [result] = await db.query(update, [
    reward_point,
    reward_name,
    reward_duration,
    reward_created_by,
    reward_created_at,
    reward_updated_at,
    reward_is_active,
    reward_description,
    reward_type_id,
    family_id,
    reward_id
  ]);

  return result;
}

// DELETE
export async function deleteRewardByIdModel(id) {
  const deleteQuery = `
    UPDATE rewards
    SET is_active = 0
    WHERE reward_id = ?
  `;

  const [result] = await db.query(deleteQuery, [id]);
  return result;
}