import { useContext, useEffect, useState } from "react";
import { createTask, getRoomsByFamilyId, getTasksByFamilyId, getMembersByFamilyId, updateTaskStatus, assignTask, UpdateTask, deleteTask } from "../services/service";
import TasksCard from "../components/cards/Index";
import "./task.css"
import AuthContext from "../Contexte/AuthContext";

function TasksPage() {
    const { isLogged, role, families, userId, selectedFamily, can } = useContext(AuthContext);

    const [showForm, setShowForm] = useState(false);
    const [modifForm, setModifForm] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);

    const [tasks, setTasks] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [members, setMembers] = useState([]);
    const [period, setPeriod] = useState("semaine"); // aujourd'hui, semaine, mois

    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        priority: "moyenne",
        due_date: "",
        task_points: 0,
        status: "à faire",
        is_active: 1,
        room_id: "",
        recurrence_type: "",
        recurrence_value: "",
        attributed_to: ""
    });

    // recuperation des tâches, pièces et membres
    useEffect(() => {
        if (!selectedFamily) return;
        fetchTasks();
        fetchRooms();
        fetchMembers();
    }, [selectedFamily]);

    const fetchTasks = async () => {
        try {
            const response = await getTasksByFamilyId(selectedFamily?.family_id);
            setTasks(response.data);
        } catch (error) { console.error(error); }
    }

    const fetchRooms = async () => {
        try {
            const response = await getRoomsByFamilyId(selectedFamily?.family_id);
            setRooms(response.data);
        } catch (error) { console.error(error); }
    }

    const fetchMembers = async () => {
        try {
            const response = await getMembersByFamilyId(selectedFamily?.family_id);
            setMembers(response.data);
        } catch (error) { console.error(error); }
    }

    // Création d'une nouvelle tâche
    const handleCreateTask = async (e) => {
        e.preventDefault();
        // la galère ici : plusieurs états étaient "" alors que SQL voulais un retour "null" le piege : ici fonction asynchrone donc losque je faisait juste setNewTask ({ ...newTask, due_date : null}) il continué d'envoyer ""
        try {
            const taskToCreate = {
                ...newTask,
                due_date: newTask.due_date === "" ? null : newTask.due_date,
                recurrence_type: newTask.recurrence_type === "" ? null : newTask.recurrence_type,
                recurrence_value: newTask.recurrence_value === "" ? null : newTask.recurrence_value,
                room_id: newTask.room_id === "" ? null : newTask.room_id,
                attributed_to: newTask.attributed_to === "" ? null : Number(newTask.attributed_to),
                family_id: selectedFamily?.family_id,
                created_by: userId
            };
            await createTask(taskToCreate);
            alert("Tâche créée !");
            setShowForm(false);
            setNewTask({ title: "", description: "", priority: "moyenne", due_date: "", task_points: 0, status: "à faire", is_active: 1, room_id: "", recurrence_type: "", recurrence_value: "", attributed_to: "" });
            fetchTasks();
        } catch (error) {
            console.error(error);
            alert("Erreur : " + error.message);
        }
    }

    // filter les tâches 
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filteredTasks = tasks.filter(task => {
        if (!task.due_date) return true;
        const due = new Date(task.due_date);
        if (period === "aujourd'hui") return due.toDateString() === today.toDateString();
        if (period === "semaine") {
            const endOfWeek = new Date(today);
            endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
            return due >= today && due <= endOfWeek;
        }
        if (period === "mois") return due.getMonth() === today.getMonth() && due.getFullYear() === today.getFullYear();
        return true;
    });

    const unassignedTasks = filteredTasks.filter(t => t.attributed_to === null && t.status !== "en attente" && t.status !== "validé");
    const tasksByMember = (memberId) => filteredTasks.filter(t => Number(t.attributed_to) === Number(memberId) && t.status !== "en attente" && t.status !== "validé");
    const tasksToValidate = tasks.filter(t => t.status === "en attente");

    // Prendre ou attribuer une tâche (memberId optionnel, sinon utilisateur courant)
    const handleAssign = async (task, memberId) => {
        try {
            await assignTask(task.task_id, memberId ?? userId);
            fetchTasks();
        } catch (error) {
            console.error(error);
            alert("Erreur : " + error.message);
        }
    }

    // Soumettre une tâche à validation
    const handleSubmitValidation = async (task) => {
        try {
            await updateTaskStatus(task.task_id, {
                status: "en attente",
                user_id: task.attributed_to,
                points: 0,
                family_id: selectedFamily?.family_id
            });
            fetchTasks();
        } catch (error) {
            console.error(error);
            alert("Erreur : " + error.message);
        }
    }

    // se désengager d'une tâche
    const handleAnnule = async (task) => {
        try {
            await assignTask(task.task_id, null);
            fetchTasks();
        } catch (error) {
            console.error(error);
            alert("Erreur : " + error.message);
        }
    }

    // Validation des tasks
    const handleValidateTask = async (task, status) => {
        try {
            await updateTaskStatus(task.task_id, {
                status: status,
                user_id: task.attributed_to,
                points: task.task_points,
                family_id: selectedFamily?.family_id
            });
            alert(status === "validé" ? "Tâche validée ! Points attribués ✅" : "Tâche refusée ❌");
            fetchTasks();
        } catch (error) {
            console.error(error);
            alert("Erreur : " + error.message);
        }
    }

    // Supprimer une tâche
    const handleDeleteTask = async (task) => {
        if (!window.confirm(`Supprimer "${task.title}" ?`)) return;
        try {
            await deleteTask(task.task_id);
            fetchTasks();
        } catch (error) {
            console.error(error);
            alert("Erreur : " + error.message);
        }
    }

    // Ouvrir le formulaire de modification pré-rempli
    const handleOpenModifForm = (task) => {
        setTaskToEdit(task);
        setNewTask({
            title: task.title ?? "",
            description: task.description ?? "",
            priority: task.priority ?? "moyenne",
            due_date: task.due_date ? task.due_date.slice(0, 10) : "",
            task_points: task.task_points ?? 0,
            status: task.status ?? "à faire",
            is_active: task.is_active ?? 1,
            room_id: task.room_id ?? "",
            recurrence_type: task.recurrence_type ?? "",
            recurrence_value: task.recurrence_value ?? "",
            attributed_to: task.attributed_to ?? ""
        });
        setShowForm(false);
        setModifForm(true);
    };

    // Soumettre la modification
    const handleModifTask = async (e) => {
        e.preventDefault();
        try {
            await UpdateTask(taskToEdit.task_id, {
                ...newTask,
                due_date: newTask.due_date === "" ? null : newTask.due_date,
                recurrence_type: newTask.recurrence_type === "" ? null : newTask.recurrence_type,
                recurrence_value: newTask.recurrence_value === "" ? null : newTask.recurrence_value,
                room_id: newTask.room_id === "" ? null : newTask.room_id,
                attributed_to: newTask.attributed_to === "" ? null : Number(newTask.attributed_to),
                family_id: selectedFamily?.family_id,
                created_by: userId
            });
            alert("Tâche modifiée !");
            setModifForm(false);
            setTaskToEdit(null);
            setNewTask({ title: "", description: "", priority: "moyenne", due_date: "", task_points: 0, status: "à faire", is_active: 1, room_id: "", recurrence_type: "", recurrence_value: "" });
            fetchTasks();
        } catch (error) {
            console.error(error);
            alert("Erreur : " + error.message);
        }
    };

    return (
        <>
            {(isLogged && role !== "temp") ? (
                <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h1>Tâches</h1>
                        {can("create_task") && <button onClick={() => setShowForm(!showForm)}>+ Ajouter une tâche</button>}
                    </div>

                    {/* Onglets de période */}
                    <div className="btns">
                        <button className={period === "toutes" ? "activebtn" : ""} onClick={() => setPeriod("toutes")}>Toutes</button>
                        <button className={period === "aujourd'hui" ? "activebtn" : ""} onClick={() => setPeriod("aujourd'hui")}>Aujourd'hui</button>
                        <button className={period === "semaine" ? "activebtn" : ""} onClick={() => setPeriod("semaine")}>Cette semaine</button>
                        <button className={period === "mois" ? "activebtn" : ""} onClick={() => setPeriod("mois")}>Ce mois</button>
                        {can("validate_task") && (
                            <button className="validebtn" onClick={() => setPeriod("validation")}>
                                ✅ À valider {tasksToValidate.length > 0 && `(${tasksToValidate.length})`}
                            </button>
                        )}
                    </div>

                    {/* Formulaire création tâche */}
                    {showForm ? (
                        <form onSubmit={handleCreateTask}>
                            <h3>Création d'une nouvelle tâche</h3>
                            <div><label>Titre : <input value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} required /></label></div>
                            <div><label>Description : <input value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} /></label></div>
                            <div>
                                <label>Priorité :
                                    <select value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}>
                                        <option value="basse">Basse</option>
                                        <option value="moyenne">Moyenne</option>
                                        <option value="haute">Haute</option>
                                    </select>
                                </label>
                            </div>
                            <div><label>Date limite : <input type="date" value={newTask.due_date} onChange={e => setNewTask({ ...newTask, due_date: e.target.value })} /></label></div>
                            <div><label>Points : <input type="number" value={newTask.task_points} onChange={e => setNewTask({ ...newTask, task_points: e.target.value })} /></label></div>
                            <div>
                                <label>Pièce :
                                    <select value={newTask.room_id} onChange={e => setNewTask({ ...newTask, room_id: e.target.value })}>
                                        <option value="">-- Sélectionner une pièce --</option>
                                        {rooms.map(room => <option key={room.room_id} value={room.room_id}>{room.name}</option>)}
                                    </select>
                                </label>
                            </div>
                            <div>
                                <label>Attribuer à :
                                    <select value={newTask.attributed_to} onChange={e => setNewTask({ ...newTask, attributed_to: e.target.value })}>
                                        <option value="">-- Non attribué --</option>
                                        {members.map(m => <option key={m.user_id} value={m.user_id}>{m.first_name}</option>)}
                                    </select>
                                </label>
                            </div>
                            <div>
                                <label>Récurrence :
                                    <select value={newTask.recurrence_type} onChange={e => setNewTask({ ...newTask, recurrence_type: e.target.value })}>
                                        <option value="">-- Pas de récurrence --</option>
                                        <option value="jours">Jours</option>
                                        <option value="semaine">Semaine</option>
                                        <option value="mois">Mois</option>
                                        <option value="années">Années</option>
                                    </select>
                                </label>
                            </div>
                            {newTask.recurrence_type && (
                                <div><label>Tous les combien : <input type="number" min="1" value={newTask.recurrence_value} onChange={e => setNewTask({ ...newTask, recurrence_value: e.target.value })} placeholder={`ex: 2 ${newTask.recurrence_type}`} /></label></div>
                            )}
                            <button type="submit">Créer la tâche</button>
                            <button type="button" onClick={() => setShowForm(false)}>Annuler</button>
                        </form>
                    ) :
                        // formulaire de modification de la tâche
                        (modifForm && (
                            <form onSubmit={handleModifTask}>
                                <h3>Modification de : {taskToEdit?.title}</h3>
                                <div><label>Titre : <input value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} required /></label></div>
                                <div><label>Description : <input value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} /></label></div>
                                <div>
                                    <label>Priorité :
                                        <select value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}>
                                            <option value="basse">Basse</option>
                                            <option value="moyenne">Moyenne</option>
                                            <option value="haute">Haute</option>
                                        </select>
                                    </label>
                                </div>
                                <div><label>Date limite : <input type="date" value={newTask.due_date} onChange={e => setNewTask({ ...newTask, due_date: e.target.value })} /></label></div>
                                <div><label>Points : <input type="number" value={newTask.task_points} onChange={e => setNewTask({ ...newTask, task_points: e.target.value })} /></label></div>
                                <div>
                                    <label>Pièce :
                                        <select value={newTask.room_id} onChange={e => setNewTask({ ...newTask, room_id: e.target.value })}>
                                            <option value="">-- Sélectionner une pièce --</option>
                                            {rooms.map(room => <option key={room.room_id} value={room.room_id}>{room.name}</option>)}
                                        </select>
                                    </label>
                                </div>
                                <div>
                                    <label>Récurrence :
                                        <select value={newTask.recurrence_type} onChange={e => setNewTask({ ...newTask, recurrence_type: e.target.value })}>
                                            <option value="">-- Pas de récurrence --</option>
                                            <option value="jours">Jours</option>
                                            <option value="semaine">Semaine</option>
                                            <option value="mois">Mois</option>
                                            <option value="années">Années</option>
                                        </select>
                                    </label>
                                </div>
                                {newTask.recurrence_type && (
                                    <div><label>Tous les combien : <input type="number" min="1" value={newTask.recurrence_value} onChange={e => setNewTask({ ...newTask, recurrence_value: e.target.value })} placeholder={`ex: 2 ${newTask.recurrence_type}`} /></label></div>
                                )}
                                <div>
                                    <label>Attribuer à :
                                        <select value={newTask.attributed_to} onChange={e => setNewTask({ ...newTask, attributed_to: e.target.value })}>
                                            <option value="">-- Non attribué --</option>
                                            {members.map(m => <option key={m.user_id} value={m.user_id}>{m.first_name}</option>)}
                                        </select>
                                    </label>
                                </div>
                                <button type="submit">Modifier la tâche</button>
                                <button type="button" onClick={() => setModifForm(false)}>Annuler</button>
                            </form>
                        ))}

                    {/* Tableau Kanban */}
                    {period !== "validation" && (
                        <div style={{ display: "flex", gap: "15px", overflowX: "auto", marginTop: "20px" }}>

                            {/* Colonne À attribuer */}
                            <div style={{ minWidth: "200px", background: "#f0f0f0", padding: "10px", borderRadius: "8px" }}>
                                <h3>À attribuer ({unassignedTasks.length})</h3>
                                {unassignedTasks.length > 0 ? (
                                    unassignedTasks.map(task => <TasksCard key={task.task_id} task={task} members={can("assign_task") ? members : null} onAssign={can("assign_task") ? handleAssign : null} onUpdate={can("edit_task") ? handleOpenModifForm : null} onDelete={can("delete_task") ? handleDeleteTask : null} />)
                                ) : (
                                    <p>Aucune tâche</p>
                                )}
                            </div>

                            {/* Colonnes par membre */}
                            {members.map(member => (
                                <div key={member.user_id} style={{ minWidth: "200px", background: "#f0f0f0", padding: "10px", borderRadius: "8px" }}>
                                    <h3>{member.first_name} ({tasksByMember(member.user_id).length})</h3>
                                    {tasksByMember(member.user_id).length > 0 ? (
                                        tasksByMember(member.user_id).map(task => <TasksCard key={task.task_id} task={task} onAnnule={handleAnnule} onUpdate={can("edit_task") ? handleOpenModifForm : null} onSubmitValidation={can("submit_task") ? handleSubmitValidation : null} onDelete={can("delete_task") ? handleDeleteTask : null} />)
                                    ) : (
                                        <p>Aucune tâche</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Page validation */}
                    {period === "validation" && (
                        <div style={{ marginTop: "20px" }}>
                            <h2>Tâches à valider</h2>
                            {tasksToValidate.length > 0 ? (
                                tasksToValidate.map(task => (
                                    <div key={task.task_id} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                                        <TasksCard task={task} />
                                        <div>
                                            <button onClick={() => handleValidateTask(task, "validé")}>✅ Valider</button>
                                            <button onClick={() => handleValidateTask(task, "à faire")}>❌ Refuser</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>Aucune tâche à valider.</p>
                            )}
                        </div>
                    )}
                </>
            ) : (
                <p>Vous n'avez pas les droits pour afficher les tâches</p>
            )}
        </>
    )
}

export default TasksPage;