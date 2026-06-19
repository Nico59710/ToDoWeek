import * as taskModel from '../models/taskModel.js';
import * as users_familiesModel from '../models/users_familiesModel.js';

// CREATE
export async function createTaskController(req, res) {
  const {
    title,
    description,
    status,
    priority,
    due_date,
    recurrence_type,
    recurrence_value,
    task_points,
    category_id,
    room_id,
    family_id,
    attributed_to,
    created_by
  } = req.body;

  try {
    const result = await taskModel.createTaskModel(
      title,
      description,
      status,
      priority,
      due_date,
      recurrence_type,
      recurrence_value,
      task_points,
      category_id,
      room_id,
      family_id,
      attributed_to,
      created_by
    );
    res.status(201).json(result);
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: 'Échec de la création de la tâche' });
  }
}

// READ
export async function getAllTasksController(req, res) {
  try {
    const result = await taskModel.getAllTasksModel();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec de la récupération des tâches' });
  }
}
//READ tasks by user ID
export async function getTaskByUserIdController(req, res) {
  const { id } = req.params;
  try {
    const result = await taskModel.getTasksByUserIdModel(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec de la récupération de la tâche' });
  }
}
//READ tasks by family ID 
export async function getTaskByFamilyIdController(req, res) {
  const { id } = req.params;
  try {
    const result = await taskModel.getTasksByFamilyIdModel(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec de la récupération des tâche de la famille' });
  }
}
export async function getTaskByIdController(req, res) {
  const { id } = req.params;
  try {
    const result = await taskModel.getTaskByIdModel(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec de la récupération de la tâche' });
  }
}

// UPDATE
export async function updateTaskByIdController(req, res) {
  const { id } = req.params;
  const {
    title,
    description,
    status,
    priority,
    due_date,
    recurrence_type,
    recurrence_value,
    task_points,
    category_id,
    is_active,
    room_id,
    family_id,
    attributed_to,
    created_by
  } = req.body;

  try {
    const result = await taskModel.updateTaskByIdModel(
      id,
      title,
      description,
      status,
      priority,
      due_date,
      recurrence_type,
      recurrence_value,
      task_points,
      category_id,
      is_active,
      room_id,
      family_id,
      attributed_to,
      created_by
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec de la mise à jour de la tâche' });
    console.log(error);
    
  }
}

function calculateNextDate(dueDate, type, value) {
  const date = dueDate ? new Date(dueDate) : new Date();
  const n = parseInt(value);
  if (type === "jours")   date.setDate(date.getDate() + n);
  else if (type === "semaine") date.setDate(date.getDate() + n * 7);
  else if (type === "mois")    date.setMonth(date.getMonth() + n);
  else if (type === "années")  date.setFullYear(date.getFullYear() + n);
  return date.toISOString().slice(0, 10);
}

// Mise a jour du statut d'une tâche et ajout des points au USERS
export async function updateTaskStatusController(req, res) {
  const { id } = req.params;
  const { status, user_id, points, family_id } = req.body;
  try {
    await taskModel.updateTaskStatusModel(id, status);

    // Si validée → attribuer les points au membre
    if (status === "validé" && user_id && points && family_id) {
      await users_familiesModel.addPointsToUserFamilyModel(user_id, family_id, points);
    }

    // Si validée et récurrente → reset pour le prochain cycle (status + due_date)
    if (status === "validé") {
      const task = await taskModel.getTaskByIdModel(id);
      if (task.recurrence_type && task.recurrence_value) {
        const nextDate = calculateNextDate(task.due_date, task.recurrence_type, task.recurrence_value);
        await taskModel.resetTaskForRecurrenceModel(id, nextDate);
      }
    }

    res.status(200).json({ message: "Statut mis à jour" });
  } catch (error) {
    res.status(500).json({ error: "Échec mise à jour statut" });
    console.log(error);
  }
}

//Mise à jour de l'attribution d'une tâche 
export async function updateAttributeTaskController(req, res) {
  const { id } = req.params;
  const { attributed_to } = req.body;
  try {
    const result = await taskModel.updateAttributeTaskModel(id, attributed_to);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Échec de l'attribution de la tâche" });
    console.log(error);
  }
}

// DELETE
export async function deleteTaskByIdController(req, res) {
  const { id } = req.params;
  try {
    const result = await taskModel.deleteTaskByIdModel(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Échec de la suppression de la tâche' });
  }
}