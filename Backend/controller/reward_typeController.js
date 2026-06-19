import * as rewardTypeModel from '../models/reward_typesModel.js';

// CREATE
export async function createRewardTypeController(req, res) {
  const { name, is_active, created_by } = req.body;

  try {
    const result = await rewardTypeModel.createRewardTypeModel(name, is_active, created_by);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec de la création du type de récompense' });
  }
}

// READ
export async function getAllRewardTypesController(req, res) {
  try {
    const result = await rewardTypeModel.getAllRewardTypesModel();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec de la récupération des types de récompense' });
  }
}

export async function getRewardTypeByIdController(req, res) {
  const { id } = req.params;

  try {
    const result = await rewardTypeModel.getRewardTypeByIdModel(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec de la récupération du type de récompense' });
  }
}

// UPDATE
export async function updateRewardTypeByIdController(req, res) {
  const { id } = req.params;
  const { name, is_active, created_by } = req.body;

  try {
    const result = await rewardTypeModel.updateRewardTypeByIdModel(id, name, is_active, created_by);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec de la mise à jour du type de récompense' });
  }
}

// DELETE
export async function deleteRewardTypeByIdController(req, res) {
  const { id } = req.params;

  try {
    const result = await rewardTypeModel.deleteRewardTypeByIdModel(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec de la suppression du type de récompense' });
  }
}
