import { useState } from "react";
import Avatar from "../ui/Avatar";
import "./Index.css";

const STATUS_MAP = {
    "à faire":    { label: "À faire",    cls: "task-status--todo" },
    "en attente": { label: "En attente", cls: "task-status--pending" },
    "validé":     { label: "Validé",     cls: "task-status--validated" },
};

function TasksCard({ task, members, onAssign, onAnnule, onUpdate, onDelete, onSubmitValidation }) {
    const [selectedMember, setSelectedMember] = useState("");

    const status = STATUS_MAP[task.status] ?? { label: task.status, cls: "task-status--todo" };
    const hasActions = onSubmitValidation || onAnnule || onUpdate || onDelete;

    return (
        <div className="task-card" data-priority={task.priority}>

            {/* ── Corps ── */}
            <div className="task-card-main">
                {/* Titre + statut */}
                <div className="task-card-top">
                    <h3 className="task-card-title">{task.title}</h3>
                    <span className={`task-status-badge ${status.cls}`}>{status.label}</span>
                </div>

                {/* Description */}
                {task.description && (
                    <p className="task-card-desc">{task.description}</p>
                )}

                {/* Chips meta */}
                <div className="task-card-meta">
                    {task.due_date && (
                        <span className="task-meta-chip task-meta-chip--date">
                            📅 {new Date(task.due_date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                        </span>
                    )}
                    <span className={`task-meta-chip task-meta-chip--${task.priority}`}>
                        {task.priority === "haute" ? "🔴" : task.priority === "basse" ? "🟢" : "🟡"} {task.priority}
                    </span>
                    {task.task_points > 0 && (
                        <span className="task-meta-chip task-meta-chip--points">⭐ {task.task_points} pts</span>
                    )}
                </div>

                {/* Assigné à */}
                {task.first_name && (
                    <div className="task-card-assignee">
                        <Avatar firstName={task.first_name} lastName={task.last_name ?? ""} size="xs" />
                        <span className="task-card-assignee-name">{task.first_name}</span>
                    </div>
                )}
            </div>

            {/* ── Panel attribution ── */}
            {onAssign && !task.attributed_to && (
                <div className="task-card-assign-panel">
                    <button className="tca-btn tca-btn--take" onClick={() => onAssign(task)}>
                        ＋ Prendre
                    </button>
                    {members?.length > 0 && (
                        <div className="task-card-assign-row">
                            <select
                                className="task-card-assign-select"
                                value={selectedMember}
                                onChange={e => setSelectedMember(e.target.value)}
                            >
                                <option value="">-- Attribuer à --</option>
                                {members.map(m => (
                                    <option key={m.user_id} value={m.user_id}>{m.first_name}</option>
                                ))}
                            </select>
                            <button
                                className="tca-btn tca-btn--take"
                                disabled={!selectedMember}
                                style={{ opacity: selectedMember ? 1 : 0.4 }}
                                onClick={() => { onAssign(task, Number(selectedMember)); setSelectedMember(""); }}
                            >
                                ↗
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* ── Boutons d'action ── */}
            {hasActions && (
                <div className="task-card-actions">
                    {onSubmitValidation && task.attributed_to && task.status !== "en attente" && (
                        <button className="tca-btn tca-btn--submit" onClick={() => onSubmitValidation(task)}>
                            ✅ Soumettre
                        </button>
                    )}
                    {onAnnule && task.attributed_to && (
                        <button className="tca-btn tca-btn--cancel" onClick={() => onAnnule(task)}>
                            ↩ Annuler
                        </button>
                    )}
                    {onUpdate && (
                        <button className="tca-btn tca-btn--edit" onClick={() => onUpdate(task)}>
                            ✏️
                        </button>
                    )}
                    {onDelete && (
                        <button className="tca-btn tca-btn--delete" onClick={() => onDelete(task)}>
                            🗑
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default TasksCard;
