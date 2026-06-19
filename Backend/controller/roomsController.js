import * as roomsModel from '../models/roomModel.js';
import { login } from './authController.js';

// CREATE
export async function createRoomController(req, res) {
  const { name, color, created_by, created_at, updated_at, is_active, family_id } = req.body;

  try {
    const result = await roomsModel.createRoomModel(
      name,
      color,
      created_by,
      created_at,
      updated_at,
      is_active,
      family_id
    );

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec de la création de la room' });
    console.log(error);

  }
}

// READ
export async function getAllRoomsController(req, res) {
  try {
    const result = await roomsModel.getAllRoomsModel();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec de la récupération des rooms' });
  }
}

export async function getRoomByIdController(req, res) {
  const { id } = req.params;

  try {
    const result = await roomsModel.getRoomByIdModel(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec de la récupération de la room' });
  }
}

//READ - by family_id
export async function getRoomsByFamilyIdController(req, res) {
    const { id } = req.params;
    try {
        const result = await roomsModel.getRoomsByFamilyIdModel(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Échec de la récupération des rooms' });
    }
}

// UPDATE
export async function updateRoomByIdController(req, res) {
  const { id } = req.params;
  const { name, color, created_by, created_at, updated_at, is_active, family_id } = req.body;

  try {
    const result = await roomsModel.updateRoomByIdModel(
      id,
      name,
      color,
      created_by,
      created_at,
      updated_at,
      is_active,
      family_id
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec de la mise à jour de la room' });
  }
}

// DELETE
export async function deleteRoomByIdController(req, res) {
  const { id } = req.params;

  try {
    const result = await roomsModel.deleteRoomByIdModel(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec de la suppression de la room' });
  }
}