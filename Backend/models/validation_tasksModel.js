import { db } from '../config/db.js';

// CREATE
export async function createValidationTaskModel(
  validated_at,
  validated_by,
  duration,
  is_active,
  family_id,
  task_id
) {
  const add = `
    INSERT INTO validation_tasks (
      validated_at,
      validated_by,
      duration,
      is_active,
      family_id,
      task_id
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.query(add, [
    validated_at,
    validated_by,
    duration,
    is_active,
    family_id,
    task_id
  ]);

  return result;
}

// READ - all
export async function getAllValidationTasksModel() {
  const select = `
    SELECT * FROM validation_tasks
  `;

  const [result] = await db.query(select);
  return result;
}

// READ - by id
export async function getValidationTaskByIdModel(id) {
  const select = `
    SELECT * FROM validation_tasks
    WHERE validation_task_id = ?
  `;

  const [result] = await db.query(select, [id]);
  return result[0];
}

// UPDATE
export async function updateValidationTaskByIdModel(
  validation_task_id,
  validated_at,
  validated_by,
  duration,
  is_active,
  family_id,
  task_id
) {
  const update = `
    UPDATE validation_tasks
    SET
      validated_at = ?,
      validated_by = ?,
      duration = ?,
      is_active = ?,
      family_id = ?,
      task_id = ?
    WHERE validation_task_id = ?
  `;

  const [result] = await db.query(update, [
    validated_at,
    validated_by,
    duration,
    is_active,
    family_id,
    task_id,
    validation_task_id
  ]);

  return result;
}

// DELETE
export async function deleteValidationTaskByIdModel(id) {
  const deleteQuery = `
    UPDATE validation_tasks
    SET is_active = 0
    WHERE validation_task_id = ?
  `;

  const [result] = await db.query(deleteQuery, [id]);
  return result;
}