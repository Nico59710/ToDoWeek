import { useState } from "react";
import "./Index.css";

function TasksCard({ task, members, onAssign, onAnnule, onUpdate, onSubmitValidation, onDelete }) {
    const [selectedMember, setSelectedMember] = useState("");

    return (
        <div className="tasks-card">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Statut : {task.status}</p>
            <p>Priorité : {task.priority}</p>
            <p>Échéance : {task.due_date ? new Date(task.due_date).toLocaleDateString() : "—"}</p>
            <p>Assigné à : {task.first_name ?? "Non attribué"}</p>
            <p>Points : {task.task_points}</p>
            {onAssign && !task.attributed_to && (
                <>
                    <button onClick={() => onAssign(task)}>Prendre la tâche</button>
                    {members?.length > 0 && (
                        <div>
                            <select value={selectedMember} onChange={e => setSelectedMember(e.target.value)}>
                                <option value="">-- Attribuer à --</option>
                                {members.map(m => (
                                    <option key={m.user_id} value={m.user_id}>{m.first_name}</option>
                                ))}
                            </select>
                            <button
                                disabled={!selectedMember}
                                onClick={() => onAssign(task, Number(selectedMember))}
                            >
                                Attribuer
                            </button>
                        </div>
                    )}
                </>
            )}
            {onSubmitValidation && task.attributed_to && task.status !== "en attente" && (
                <button onClick={() => onSubmitValidation(task)}>Soumettre à validation</button>
            )}
            {onAnnule && task.attributed_to && (
                <button onClick={() => onAnnule(task)}>annuler la tâche</button>
            )}
            {onUpdate && (
                <button onClick={() => onUpdate(task)}>modifier la tâche</button>
            )}
            {onDelete && (
                <button onClick={() => onDelete(task)} style={{ color: "red" }}>Supprimer</button>
            )}
        </div>
    )
}

export default TasksCard;