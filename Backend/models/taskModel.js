import { db } from '../config/db.js';

// CREATE
export async function createTaskModel(
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
) {
    const add = `
    INSERT INTO tasks (
      title, description, status, priority, due_date,
      recurrence_type, recurrence_value, task_points, category_id,
      room_id, family_id, attributed_to, created_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

    const [result] = await db.query(add, [
        title, description, status, priority, due_date,
        recurrence_type, recurrence_value, task_points, category_id,
        room_id, family_id, attributed_to, created_by
    ]);

    return result;
}

// READ
export async function getAllTasksModel() {
    const select = 'SELECT * FROM tasks t LEFT JOIN users u ON t.attributed_to = u.user_id';
    const [result] = await db.query(select);
    return result;
}

//READ tasks by user ID
export async function getTasksByUserIdModel(id) {
    const select = 'SELECT * FROM users u JOIN tasks t ON t.attributed_to=u.user_id WHERE u.user_id = ? AND t.is_active = 1';
    const [result] = await db.query(select, [id]);
    return result;
}

//READ tasks by family ID — is_active=0 conservé en BDD pour l'historique futur
export async function getTasksByFamilyIdModel(id) {
    const select = 'SELECT t.*, u.* FROM tasks t LEFT JOIN users u ON t.attributed_to = u.user_id WHERE t.family_id = ? AND t.is_active = 1';
    const [result] = await db.query(select, [id]);
    return result;
}

//READ task by ID
export async function getTaskByIdModel(id) {
    const select = 'SELECT * FROM tasks WHERE task_id = ?';
    const [result] = await db.query(select, [id]);
    return result[0];
}

// UPDATE
export async function updateTaskByIdModel(
    task_id,
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
) {
    const update = `
    UPDATE tasks SET
      title = COALESCE(?, title),
      description = COALESCE(?, description),
      status = COALESCE(?, status),
      priority = COALESCE(?, priority),
      due_date = COALESCE(?, due_date),
      recurrence_type = COALESCE(?, recurrence_type),
      recurrence_value = COALESCE(?, recurrence_value),
      task_points = COALESCE(?, task_points),
      category_id = COALESCE(?, category_id),
      updated_at = NOW(),
      is_active = COALESCE(?, is_active),
      room_id = COALESCE(?, room_id),
      family_id = COALESCE(?, family_id),
      attributed_to = COALESCE(?, attributed_to),
      created_by = COALESCE(?, created_by)
    WHERE task_id = ?
  `;

    const [result] = await db.query(update, [
        title, description, status, priority, due_date,
        recurrence_type, recurrence_value, task_points, category_id,
        is_active, room_id, family_id, attributed_to, created_by,
        task_id
    ]);

    return result;
}

// Mise a jour du statut de la tâche
export async function updateTaskStatusModel(id, status) {
    const query = 'UPDATE tasks SET status = ? WHERE task_id = ?';
    const [result] = await db.query(query, [status, id]);
    return result;
}

//Mise à jour de l'attribution d'une tâche 
export async function updateAttributeTaskModel(id, attributed_to) {
    const query = 'UPDATE tasks SET attributed_to = ? WHERE task_id = ?';
    const [result] = await db.query(query, [attributed_to, id]);
    return result;
}


// Remet une tâche récurrente à "à faire" avec la prochaine date d'échéance
export async function resetTaskForRecurrenceModel(task_id, next_due_date) {
    const query = 'UPDATE tasks SET status = "à faire", due_date = ? WHERE task_id = ?';
    const [result] = await db.query(query, [next_due_date, task_id]);
    return result;
}

// DELETE
export async function deleteTaskByIdModel(id) {
    const deleteQuery = 'UPDATE tasks SET is_active = 0 WHERE task_id = ?';
    const [result] = await db.query(deleteQuery, [id]);
    return result;
}