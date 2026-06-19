import * as taskRoomsModel from '../models/task_roomsModel.js';

// CREATE
export async function createTaskRoomController(req, res) {
  const { room_id, task_id, is_active } = req.body;

  try {
    const result = await taskRoomsModel.createTaskRoomModel(room_id, task_id, is_active);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec de la création task_room' });
  }
}

// READ
export async function getAllTaskRoomsController(req, res) {
  try {
    const result = await taskRoomsModel.getAllTaskRoomsModel();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec de la récupération task_rooms' });
  }
}

// READ ONE
export async function getTaskRoomController(req, res) {
  const { room_id, task_id } = req.params;

  try {
    const result = await taskRoomsModel.getTaskRoomModel(room_id, task_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec récupération task_room' });
  }
}

// UPDATE
export async function updateTaskRoomController(req, res) {
  const { room_id, task_id } = req.params;
  const { is_active } = req.body;

  try {
    const result = await taskRoomsModel.updateTaskRoomModel(room_id, task_id, is_active);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec mise à jour task_room' });
  }
}

// DELETE
export async function deleteTaskRoomController(req, res) {
  const { room_id, task_id } = req.params;

  try {
    const result = await taskRoomsModel.deleteTaskRoomModel(room_id, task_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec suppression task_room' });
  }
}