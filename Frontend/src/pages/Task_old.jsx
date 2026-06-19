import { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar/Index";
import { createTask, getRoomsByFamilyId, getTasksByFamilyId } from "../services/service";
import TasksCard from "../components/cards/Index";
import { NavLink } from "react-router-dom";
import "./task.css"
import { jwtDecode } from "jwt-decode";
import AuthContext from "../Contexte/AuthContext";


function TasksPage() {
    // context global : verification du role et de la connexion
    const { isLogged, role, families, userId, selectedFamily } = useContext(AuthContext);

    // Formulaire nouvelle tâche
    const [showForm, setShowForm] = useState(false);
    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        priority: "moyenne",
        due_date: "",
        task_points: 0,
        status: "à faire",
        is_active: 1,
        room_id: "",
        recurrence_type: "",  // heure, jour , semaine, ect...
        recurrence_value: ""  // valeur de la récurrence
    });

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await createTask({
                ...newTask,
                family_id: selectedFamily?.family_id,
                created_by: userId
            });
            alert("Tâche créée !");
            setShowForm(false);
            setNewTask({ title: "", description: "", priority: "moyenne", due_date: "", task_points: 0, status: "à faire", is_active: 1 });
            // Rafraîchir la liste
            const response = await getTasksByFamilyId(selectedFamily?.family_id);
            setTasks(response.data);
        } catch (error) {
            console.error(error);
            alert("Erreur : " + error.message);
        }
    }

    //récuperation des pièces par familles
    const [rooms, setRooms] = useState([]);
    useEffect(() => {
        if (!families.length) return;
        const fetchRooms = async () => {
            try {
                const response = await getRoomsByFamilyId(selectedFamily?.family_id);
                setRooms(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchRooms();
    }, [selectedFamily]);

    // recupération de la liste des tâches de la famille du user connecté
    const [tasks, setTasks] = useState([]);
    useEffect(() => {
        if (!families.length) return;
        const FetchTasksByFamilyId = async () => {
            try {
                const id = selectedFamily?.family_id
                const response = await getTasksByFamilyId(id);
                setTasks(response.data);
                console.log("tâches par famille :", response.data);
            } catch (error) {
                console.error(error);
            }
        }
        FetchTasksByFamilyId();
    }, [selectedFamily])



    const [assigned, setAssigned] = useState("à faire")

    return (
        <>
            {(isLogged && role !== "temp") ? (
                <>
                    <h1>Tâches</h1>
                    <h3>Gérer toutes les tâches de la maison</h3>
                    <div className="btns">
                        <button className={assigned === "à faire" ? "activebtn" : ""} onClick={() => { setAssigned("à faire") }}>A faire</button>
                        <button className={assigned === "à attribuer" ? "activebtn" : ""} onClick={() => { setAssigned("à attribuer") }}>A attribuer</button>
                        <button className={assigned === "à valider" ? "activebtn" : ""} onClick={() => { setAssigned("à valider") }}>A valider</button>
                        <button onClick={() => setShowForm(!showForm)}>
                            + Ajouter une tâche
                        </button>

                        {showForm && (
                            <form onSubmit={handleCreateTask}>
                                <div>
                                    <label>Titre :
                                        <input value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} required />
                                    </label>
                                </div>
                                <div>
                                    <label>Description :
                                        <input value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} />
                                    </label>
                                </div>
                                <div>
                                    <label>Priorité :
                                        <select value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}>
                                            <option value="basse">Basse</option>
                                            <option value="moyenne">Moyenne</option>
                                            <option value="haute">Haute</option>
                                        </select>
                                    </label>
                                </div>
                                <div>
                                    <label>Date limite :
                                        <input type="date" value={newTask.due_date} onChange={e => setNewTask({ ...newTask, due_date: e.target.value })} />
                                    </label>
                                </div>
                                <div>
                                    <label>Points :
                                        <input type="number" value={newTask.task_points} onChange={e => setNewTask({ ...newTask, task_points: e.target.value })} />
                                    </label>
                                </div>
                                <div>
                                    <label>Pièce :
                                        <select value={newTask.room_id} onChange={e => setNewTask({ ...newTask, room_id: e.target.value })}>
                                            <option value="">-- Sélectionner une pièce --</option>
                                            {rooms.map((room) => (
                                                <option key={room.room_id} value={room.room_id}>
                                                    {room.name}
                                                </option>
                                            ))}
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

                                {/* Affiche le champ valeur seulement si une récurrence est sélectionnée */}
                                {newTask.recurrence_type && (
                                    <div>
                                        <label>Tous les combien :
                                            <input
                                                type="number"
                                                min="1"
                                                value={newTask.recurrence_value}
                                                onChange={e => setNewTask({ ...newTask, recurrence_value: e.target.value })}
                                                placeholder={`ex: 2 ${newTask.recurrence_type}`}
                                            />
                                        </label>
                                    </div>
                                )}
                                <button type="submit">Créer la tâche</button>
                                <button type="button" onClick={() => setShowForm(false)}>Annuler</button>
                            </form>
                        )}
                    </div>

                    <h1>{assigned ? assigned.charAt(0).toUpperCase() + assigned.slice(1) : ""}</h1>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", alignItems: "flex-start" }}>
                        {tasks.map((task) => (
                            (assigned === "à faire" && task.attributed_to !== null) && <TasksCard
                                key={task.task_id}
                                task={task}
                            />
                        ))}
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", alignItems: "flex-start" }}>
                        {tasks.map((task) => (
                            (assigned === "à attribuer" && task.attributed_to === null) && <TasksCard
                                key={task.task_id}
                                task={task}
                            />
                        ))}
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", alignItems: "flex-start" }}>
                        {tasks.map((task) => (
                            (assigned === "à valider" && task.status === "en attente") && <TasksCard
                                key={task.task_id}
                                task={task}
                            />
                        ))}
                    </div>
                </>) : (<p>
                    "Vous n'avez pas les droits pour afficher les taches"
                </p>)}
        </>
    )
}

export default TasksPage;

