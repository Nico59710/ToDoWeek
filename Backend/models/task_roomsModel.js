import { db } from '../config/db.js';

// CREATE 
export async function createTaskRoomModel(room_id, task_id, is_active) {
    const add = `
    INSERT INTO task_rooms (room_id, task_id, is_active)
    VALUES (?, ?, ?)
  `;

    const [result] = await db.query(add, [
        room_id,
        task_id,
        is_active
    ]);

    return result;
}

// READ 
export async function getAllTaskRoomsModel() {
    const select = `
    SELECT * FROM task_rooms
  `;

    const [result] = await db.query(select);
    return result;
}

// READ - by composite key
export async function getTaskRoomModel(room_id, task_id) {
    const select = `
    SELECT * FROM task_rooms
    WHERE room_id = ? AND task_id = ?
  `;

    const [result] = await db.query(select, [room_id, task_id]);
    return result[0];
}

// UPDATE
export async function updateTaskRoomModel(room_id, task_id, is_active) {
    const update = `
    UPDATE task_rooms
    SET is_active = ?
    WHERE room_id = ? AND task_id = ?
  `;

    const [result] = await db.query(update, [
        is_active,
        room_id,
        task_id
    ]);

    return result;
}

// DELETE
export async function deleteTaskRoomModel(room_id, task_id) {
    const deleteQuery = `
    UPDATE task_rooms
    SET is_active = 0
    WHERE room_id = ? AND task_id = ?
  `;

    const [result] = await db.query(deleteQuery, [
        room_id,
        task_id
    ]);

    return result;
}