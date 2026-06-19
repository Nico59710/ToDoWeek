import * as rewardModel from '../models/rewardModel.js';

// CREATE
export async function createRewardController(
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

    const [result] = await connection.execute(add, [
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

// READ ALL
export async function getAllRewardsController() {
    const select = `SELECT * FROM rewards`;

    const [rows] = await connection.execute(select);

    return rows;
}

// READ BY ID
export async function getRewardByIdController(id) {
    const select = `
    SELECT * FROM rewards
    WHERE reward_id = ?
  `;

    const [rows] = await connection.execute(select, [id]);

    return rows[0];
}

// UPDATE
export async function updateRewardByIdController(
    id,
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

    const [result] = await connection.execute(update, [
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
        id
    ]);

    return result;
}

// DELETE
export async function deleteRewardByIdController(id) {
    const deleteQuery = `
    DELETE FROM rewards
    WHERE reward_id = ?
  `;

    const [result] = await connection.execute(deleteQuery, [id]);

    return result;
}