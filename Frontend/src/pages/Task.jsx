import { useContext, useEffect, useState } from "react";
import { createTask, getRoomsByFamilyId, getTasksByFamilyId, getMembersByFamilyId, updateTaskStatus, assignTask, UpdateTask, deleteTask } from "../services/service";
import TasksCard from "../components/cards/Index";
import Modal from "../components/ui/Modal";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";
import "./task.css";
import AuthContext from "../Contexte/AuthContext";

const emptyTask = {
    title: "", description: "", priority: "moyenne",
    due_date: "", task_points: 0, status: "à faire",
    is_active: 1, room_id: "", recurrence_type: "", recurrence_value: "", attributed_to: ""
};

/* ── Formulaire partagé création / modification ── */
function TaskForm({ values, onChange, rooms, members }) {
    return (
        <div className="task-form-grid">
            <div className="task-form-group full-width">
                <label>Titre *</label>
                <input value={values.title} onChange={e => onChange({ ...values, title: e.target.value })} required placeholder="Nom de la tâche..." />
            </div>
            <div className="task-form-group full-width">
                <label>Description</label>
                <input value={values.description} onChange={e => onChange({ ...values, description: e.target.value })} placeholder="Détails optionnels..." />
            </div>
            <div className="task-form-group">
                <label>Priorité</label>
                <select value={values.priority} onChange={e => onChange({ ...values, priority: e.target.value })}>
                    <option value="basse">🟢 Basse</option>
                    <option value="moyenne">🟡 Moyenne</option>
                    <option value="haute">🔴 Haute</option>
                </select>
            </div>
            <div className="task-form-group">
                <label>Date limite</label>
                <input type="date" value={values.due_date} onChange={e => onChange({ ...values, due_date: e.target.value })} />
            </div>
            <div className="task-form-group">
                <label>Points</label>
                <input type="number" min="0" value={values.task_points} onChange={e => onChange({ ...values, task_points: e.target.value })} />
            </div>
            <div className="task-form-group">
                <label>Pièce</label>
                <select value={values.room_id} onChange={e => onChange({ ...values, room_id: e.target.value })}>
                    <option value="">-- Aucune pièce --</option>
                    {rooms.map(r => <option key={r.room_id} value={r.room_id}>{r.name}</option>)}
                </select>
            </div>
            <div className="task-form-group">
                <label>Attribuer à</label>
                <select value={values.attributed_to} onChange={e => onChange({ ...values, attributed_to: e.target.value })}>
                    <option value="">-- Non attribué --</option>
                    {members.map(m => <option key={m.user_id} value={m.user_id}>{m.first_name} {m.last_name}</option>)}
                </select>
            </div>
            <div className="task-form-group">
                <label>Récurrence</label>
                <select value={values.recurrence_type} onChange={e => onChange({ ...values, recurrence_type: e.target.value })}>
                    <option value="">-- Aucune --</option>
                    <option value="jours">Jours</option>
                    <option value="semaine">Semaine</option>
                    <option value="mois">Mois</option>
                    <option value="années">Années</option>
                </select>
            </div>
            {values.recurrence_type && (
                <div className="task-form-group full-width">
                    <label>Tous les combien</label>
                    <input type="number" min="1" value={values.recurrence_value} onChange={e => onChange({ ...values, recurrence_value: e.target.value })} placeholder={`ex: 2 ${values.recurrence_type}`} />
                </div>
            )}
        </div>
    );
}

/* ══════════════════════════════════
   Page principale
   ══════════════════════════════════ */
function TasksPage() {
    const { isLogged, role, userId, selectedFamily, can } = useContext(AuthContext);

    const [modalMode, setModalMode] = useState(null); // null | "create" | "edit"
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [taskValues, setTaskValues] = useState(emptyTask);

    const [tasks, setTasks] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [members, setMembers] = useState([]);
    const [period, setPeriod] = useState("semaine");

    useEffect(() => {
        if (!selectedFamily) return;
        fetchTasks(); fetchRooms(); fetchMembers();
    }, [selectedFamily]);

    const fetchTasks   = async () => { try { const r = await getTasksByFamilyId(selectedFamily?.family_id);  setTasks(r.data);   } catch(e) { console.error(e); } };
    const fetchRooms   = async () => { try { const r = await getRoomsByFamilyId(selectedFamily?.family_id);  setRooms(r.data);   } catch(e) { console.error(e); } };
    const fetchMembers = async () => { try { const r = await getMembersByFamilyId(selectedFamily?.family_id); setMembers(r.data); } catch(e) { console.error(e); } };

    const cleanValues = (v) => ({
        ...v,
        due_date:         v.due_date || null,
        recurrence_type:  v.recurrence_type || null,
        recurrence_value: v.recurrence_value || null,
        room_id:          v.room_id || null,
        attributed_to:    v.attributed_to ? Number(v.attributed_to) : null,
        family_id:        selectedFamily?.family_id,
        created_by:       userId
    });

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await createTask(cleanValues(taskValues));
            closeModal(); fetchTasks();
        } catch(e) { alert("Erreur : " + e.message); }
    };

    const handleModifTask = async (e) => {
        e.preventDefault();
        try {
            await UpdateTask(taskToEdit.task_id, cleanValues(taskValues));
            closeModal(); fetchTasks();
        } catch(e) { alert("Erreur : " + e.message); }
    };

    const openCreate = () => { setTaskValues(emptyTask); setModalMode("create"); };

    const openEdit = (task) => {
        setTaskToEdit(task);
        setTaskValues({
            title:            task.title ?? "",
            description:      task.description ?? "",
            priority:         task.priority ?? "moyenne",
            due_date:         task.due_date ? task.due_date.slice(0, 10) : "",
            task_points:      task.task_points ?? 0,
            status:           task.status ?? "à faire",
            is_active:        task.is_active ?? 1,
            room_id:          task.room_id ?? "",
            recurrence_type:  task.recurrence_type ?? "",
            recurrence_value: task.recurrence_value ?? "",
            attributed_to:    task.attributed_to ?? ""
        });
        setModalMode("edit");
    };

    const closeModal = () => { setModalMode(null); setTaskToEdit(null); setTaskValues(emptyTask); };

    const handleAssign = async (task, memberId) => {
        try { await assignTask(task.task_id, memberId ?? userId); fetchTasks(); }
        catch(e) { alert("Erreur : " + e.message); }
    };

    const handleSubmitValidation = async (task) => {
        try {
            await updateTaskStatus(task.task_id, { status: "en attente", user_id: task.attributed_to, points: 0, family_id: selectedFamily?.family_id });
            fetchTasks();
        } catch(e) { alert("Erreur : " + e.message); }
    };

    const handleAnnule = async (task) => {
        try { await assignTask(task.task_id, null); fetchTasks(); }
        catch(e) { alert("Erreur : " + e.message); }
    };

    const handleValidateTask = async (task, status) => {
        try {
            await updateTaskStatus(task.task_id, { status, user_id: task.attributed_to, points: task.task_points, family_id: selectedFamily?.family_id });
            fetchTasks();
        } catch(e) { alert("Erreur : " + e.message); }
    };

    const handleDeleteTask = async (task) => {
        if (!window.confirm(`Supprimer "${task.title}" ?`)) return;
        try { await deleteTask(task.task_id); fetchTasks(); }
        catch(e) { alert("Erreur : " + e.message); }
    };

    /* ── Filtres ── */
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filteredTasks = tasks.filter(task => {
        if (!task.due_date) return true;
        const due = new Date(task.due_date);
        if (period === "aujourd'hui") return due.toDateString() === today.toDateString();
        if (period === "semaine") { const end = new Date(today); end.setDate(today.getDate() + (7 - today.getDay())); return due >= today && due <= end; }
        if (period === "mois") return due.getMonth() === today.getMonth() && due.getFullYear() === today.getFullYear();
        return true;
    });

    const unassigned      = filteredTasks.filter(t => t.attributed_to === null && t.status !== "en attente" && t.status !== "validé");
    const byMember        = (id) => filteredTasks.filter(t => Number(t.attributed_to) === Number(id) && t.status !== "en attente" && t.status !== "validé");
    const toValidate      = tasks.filter(t => t.status === "en attente");

    if (!isLogged || role === "temp") {
        return (
            <div className="tasks-page">
                <EmptyState icon="🔒" title="Accès refusé" description="Vous n'avez pas les droits pour afficher les tâches." />
            </div>
        );
    }

    return (
        <div className="tasks-page">

            {/* ── Header ── */}
            <PageHeader
                title="Tâches"
                subtitle={selectedFamily?.name}
                action={can("create_task") && (
                    <button className="btn btn-primary" onClick={openCreate}>
                        + Nouvelle tâche
                    </button>
                )}
            />

            {/* ── Onglets période ── */}
            <div className="btns">
                {["toutes", "aujourd'hui", "semaine", "mois"].map(p => (
                    <button key={p} className={period === p ? "activebtn" : ""} onClick={() => setPeriod(p)}>
                        {p === "toutes" ? "Toutes" : p === "aujourd'hui" ? "Aujourd'hui" : p === "semaine" ? "Cette semaine" : "Ce mois"}
                    </button>
                ))}
                {can("validate_task") && (
                    <button className={period === "validation" ? "validebtn activebtn" : "validebtn"} onClick={() => setPeriod("validation")}>
                        ✅ À valider {toValidate.length > 0 && <span className="kanban-column-count" style={{ marginLeft: 4 }}>{toValidate.length}</span>}
                    </button>
                )}
            </div>

            {/* ── Kanban ── */}
            {period !== "validation" && (
                <div className="kanban-board">
                    {/* Colonne non attribuée */}
                    <div className="kanban-column">
                        <div className="kanban-column-header">
                            Non attribuées
                            <span className="kanban-column-count">{unassigned.length}</span>
                        </div>
                        <div className="kanban-column-body">
                            {unassigned.length > 0 ? unassigned.map(task => (
                                <TasksCard key={task.task_id} task={task}
                                    members={can("assign_task") ? members : null}
                                    onAssign={can("assign_task") ? handleAssign : null}
                                    onUpdate={can("edit_task") ? openEdit : null}
                                    onDelete={can("delete_task") ? handleDeleteTask : null}
                                />
                            )) : (
                                <p className="empty-state">Aucune tâche</p>
                            )}
                        </div>
                    </div>

                    {/* Colonnes par membre */}
                    {members.map(member => (
                        <div key={member.user_id} className="kanban-column">
                            <div className="kanban-column-header">
                                {member.first_name}
                                <span className="kanban-column-count">{byMember(member.user_id).length}</span>
                            </div>
                            <div className="kanban-column-body">
                                {byMember(member.user_id).length > 0 ? byMember(member.user_id).map(task => (
                                    <TasksCard key={task.task_id} task={task}
                                        onAnnule={handleAnnule}
                                        onUpdate={can("edit_task") ? openEdit : null}
                                        onSubmitValidation={can("submit_task") ? handleSubmitValidation : null}
                                        onDelete={can("delete_task") ? handleDeleteTask : null}
                                    />
                                )) : (
                                    <p className="empty-state">Aucune tâche</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Page validation ── */}
            {period === "validation" && (
                <div className="validation-page">
                    <h2>Tâches soumises à validation</h2>
                    {toValidate.length > 0 ? (
                        <div className="validation-list">
                            {toValidate.map(task => (
                                <div key={task.task_id} className="validation-item">
                                    <div className="validation-item-info">
                                        <span className="validation-item-title">{task.title}</span>
                                        <span className="validation-item-meta">
                                            {task.first_name && `Soumis par ${task.first_name}`}
                                            {task.task_points > 0 && ` · ⭐ ${task.task_points} pts`}
                                        </span>
                                    </div>
                                    <div className="validation-actions">
                                        <button className="btn btn-primary" style={{ background: "#dcfce7", color: "#16a34a" }}
                                            onClick={() => handleValidateTask(task, "validé")}>
                                            ✅ Valider
                                        </button>
                                        <button className="btn btn-danger" onClick={() => handleValidateTask(task, "à faire")}>
                                            ❌ Refuser
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState icon="✅" title="Tout est à jour !" description="Aucune tâche en attente de validation." />
                    )}
                </div>
            )}

            {/* ── Modal création ── */}
            <Modal
                isOpen={modalMode === "create"}
                onClose={closeModal}
                title="Nouvelle tâche"
                footer={
                    <>
                        <button className="btn btn-secondary" onClick={closeModal}>Annuler</button>
                        <button className="btn btn-primary" form="task-form-create" type="submit">Créer la tâche</button>
                    </>
                }
            >
                <form id="task-form-create" onSubmit={handleCreateTask}>
                    <TaskForm values={taskValues} onChange={setTaskValues} rooms={rooms} members={members} />
                </form>
            </Modal>

            {/* ── Modal modification ── */}
            <Modal
                isOpen={modalMode === "edit"}
                onClose={closeModal}
                title={`Modifier : ${taskToEdit?.title}`}
                footer={
                    <>
                        <button className="btn btn-secondary" onClick={closeModal}>Annuler</button>
                        <button className="btn btn-primary" form="task-form-edit" type="submit">Enregistrer</button>
                    </>
                }
            >
                <form id="task-form-edit" onSubmit={handleModifTask}>
                    <TaskForm values={taskValues} onChange={setTaskValues} rooms={rooms} members={members} />
                </form>
            </Modal>

        </div>
    );
}

export default TasksPage;
