import { db } from '../config/db.js';

// CREATE
export async function createRoomModel(
  name,
  color,
  created_by,
  created_at,
  updated_at,
  is_active,
  family_id
) {
  const add = `
    INSERT INTO rooms (
      name,
      color,
      created_by,      
      family_id
    )
    VALUES (?, ?, ?, ?)
  `;

  const [result] = await db.query(add, [
    name,
    color,
    created_by,
    family_id
  ]);

  return result;
}

// READ - all
export async function getAllRoomsModel() {
  const select = `
    SELECT * FROM rooms
  `;

  const [result] = await db.query(select);
  return result;
}

// READ - by id
export async function getRoomByIdModel(id) {
  const select = `
    SELECT * FROM rooms
    WHERE room_id = ?
  `;

  const [result] = await db.query(select, [id]);
  return result[0];
}

// READ - by family_id
export async function getRoomsByFamilyIdModel(family_id) {
  const select = 'SELECT * FROM rooms WHERE family_id = ? AND is_active = 1';
  const [result] = await db.query(select, [family_id]);
  return result;
}

// UPDATE
export async function updateRoomByIdModel(
  room_id,
  name,
  color,
  created_by,
  created_at,
  updated_at,
  is_active,
  family_id
) {
  const update = `
    UPDATE rooms
    SET
      name = ?,
      color = ?,
      created_by = ?,
      created_at = ?,
      updated_at = ?,
      is_active = ?,
      family_id = ?
    WHERE room_id = ?
  `;

  const [result] = await db.query(update, [
    name,
    color,
    created_by,
    created_at,
    updated_at,
    is_active,
    family_id,
    room_id
  ]);

  return result;
}

// DELETE
export async function deleteRoomByIdModel(id) {
  const deleteQuery = `
    UPDATE rooms
    SET is_active = 0
    WHERE room_id = ?
  `;

  const [result] = await db.query(deleteQuery, [id]);
  return result;
}