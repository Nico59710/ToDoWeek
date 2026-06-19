import * as validationTasksModel from '../models/validation_tasksModel.js';

// CREATE
export async function createValidationTaskController(req, res) {
  const {
    validated_at,
    validated_by,
    duration,
    is_active,
    family_id,
    task_id
  } = req.body;

  try {
    const result = await validationTasksModel.createValidationTaskModel(
      validated_at,
      validated_by,
      duration,
      is_active,
      family_id,
      task_id
    );

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec création validation task' });
  }
}

// READ
export async function getAllValidationTasksController(req, res) {
  try {
    const result = await validationTasksModel.getAllValidationTasksModel();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec récupération validation tasks' });
  }
}

export async function getValidationTaskByIdController(req, res) {
  const { id } = req.params;

  try {
    const result = await validationTasksModel.getValidationTaskByIdModel(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec récupération validation task' });
  }
}

// UPDATE
export async function updateValidationTaskByIdController(req, res) {
  const { id } = req.params;
  const {
    validated_at,
    validated_by,
    duration,
    is_active,
    family_id,
    task_id
  } = req.body;

  try {
    const result = await validationTasksModel.updateValidationTaskByIdModel(
      id,
      validated_at,
      validated_by,
      duration,
      is_active,
      family_id,
      task_id
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec update validation task' });
  }
}

// DELETE
export async function deleteValidationTaskByIdController(req, res) {
  const { id } = req.params;

  try {
    const result = await validationTasksModel.deleteValidationTaskByIdModel(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec suppression validation task' });
  }
}