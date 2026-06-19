import { useContext, useEffect, useState } from "react";
import AuthContext from "../Contexte/AuthContext";
import { createRoom, deleteRoom, getRoomsByFamilyId, updateRoom, updateUserById, getRolesByFamilyId, createRole, deleteRole, getPermissionsByRoleId, updatePermissions } from "../services/service";
import { jwtDecode } from "jwt-decode";

// Traduction des actions en français pour l'affichage dans la grille
const ACTION_LABELS = {
    create_task: "Créer une tâche",
    edit_task: "Modifier une tâche",
    delete_task: "Supprimer une tâche",
    assign_task: "Attribuer une tâche",
    submit_task: "Soumettre à validation",
    validate_task: "Valider une tâche",
    create_room: "Créer une pièce",
    delete_room: "Supprimer une pièce",
    invite_member: "Inviter un membre",
    remove_member: "Retirer un membre",
    accept_member: "Accepter une demande",
    manage_roles: "Gérer les rôles",
    rename_family: "Renommer la famille",
    delete_family: "Supprimer la famille",
};

function Settings() {
    const { userId, user, role, setRole, setMail, setUserId, families, selectedFamily, can } = useContext(AuthContext);
    const [firstName, setFirstName] = useState(user?.first_name || "");
    const [lastName, setLastName] = useState(user?.last_name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [password, setPassword] = useState("");
    const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || "");


    //Ajout d'une nouvelle piece 
    const [rooms, setRooms] = useState([]);
    const [newRoom, setNewRoom] = useState({ name: "", color: "#000000" });

    useEffect(() => {
        if (families.length > 0) fetchRooms();
    }, [selectedFamily]);

    const fetchRooms = async () => {
        try {
            const response = await getRoomsByFamilyId(selectedFamily?.family_id);
            setRooms(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        try {
            await createRoom({
                name: newRoom.name,
                color: newRoom.color,
                created_by: userId,
                is_active: 1,
                family_id: selectedFamily?.family_id
            });
            alert("Pièce ajoutée !");
            setNewRoom({ name: "", color: "#000000" });
            fetchRooms();
        } catch (error) {
            console.error(error);
            alert("Erreur : " + error.message);
        }
    }


    //Mise à jour du profil 
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (!firstName.trim()) {
            alert("Le prénom est obligatoire");
            return;
        }
        try {
            const response = await updateUserById(userId, {
                first_name: firstName,
                last_name: lastName,
                email: email,
                avatar_url: avatarUrl,
                password: password || null
            });

            // Stocker le nouveau token
            localStorage.setItem('token', response.data.token);
            const decodedToken = jwtDecode(response.data.token);
            setRole(decodedToken.role);
            setMail(decodedToken.email);
            setUserId(decodedToken.user_id);

            alert("Profil mis à jour !");
        } catch (error) {
            console.error(error);
            alert("Erreur : " + error.message);
        }
    }

    //supprimer une piece 
    const handleDeleteRoom = async (roomId) => {
        if (!confirm("Supprimer cette pièce ?")) return;
        try {
            await deleteRoom(roomId);
            fetchRooms();
        } catch (error) {
            alert("Erreur : " + error.message);
        }
    }

    // --- GESTION DES RÔLES ---
    const [roles, setRoles] = useState([]);
    const [newRoleName, setNewRoleName] = useState("");
    // Rôle sélectionné pour afficher sa grille de permissions
    const [selectedRole, setSelectedRole] = useState(null);
    // Permissions du rôle sélectionné : tableau de { action, allowed }
    const [permissions, setPermissions] = useState([]);

    // Charge les rôles de la famille quand la famille change
    useEffect(() => {
        if (selectedFamily) fetchRoles();
    }, [selectedFamily]);

    const fetchRoles = async () => {
        try {
            const response = await getRolesByFamilyId(selectedFamily.family_id);
            setRoles(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    // Crée un nouveau rôle et génère ses 14 permissions automatiquement (côté back)
    const handleCreateRole = async (e) => {
        e.preventDefault();
        if (!newRoleName.trim()) return;
        try {
            await createRole({
                role: newRoleName.trim(),
                family_id: selectedFamily.family_id,
                is_active: 1
            });
            setNewRoleName("");
            fetchRoles();
        } catch (error) {
            alert("Erreur : " + error.message);
        }
    };

    // Supprime un rôle (soft-delete) et ses permissions associées
    const handleDeleteRole = async (roleId) => {
        if (!window.confirm("Supprimer ce rôle ?")) return;
        try {
            await deleteRole(roleId);
            // Si le rôle supprimé était sélectionné, on ferme la grille
            if (selectedRole?.role_id === roleId) setSelectedRole(null);
            fetchRoles();
        } catch (error) {
            alert("Erreur : " + error.message);
        }
    };

    // Charge les permissions d'un rôle et affiche la grille
    const handleSelectRole = async (role) => {
        // Si on clique sur le rôle déjà ouvert → fermer la grille
        if (selectedRole?.role_id === role.role_id) {
            setSelectedRole(null);
            setPermissions([]);
            return;
        }
        try {
            const response = await getPermissionsByRoleId(role.role_id);
            setSelectedRole(role);
            setPermissions(response.data);
        } catch (error) {
            alert("Erreur : " + error.message);
        }
    };

    // Coche / décoche une permission dans la grille (mise à jour locale uniquement)
    const handleTogglePermission = (action) => {
        setPermissions(prev =>
            prev.map(p => p.action === action ? { ...p, allowed: !p.allowed } : p)
        );
    };

    // Envoie toutes les permissions modifiées au backend
    const handleSavePermissions = async () => {
        try {
            await updatePermissions(selectedRole.role_id, permissions);
            alert("Permissions enregistrées !");
        } catch (error) {
            alert("Erreur : " + error.message);
        }
    };

    //modifier une piece
    const [editingRoom, setEditingRoom] = useState(null)
    const handleUpdateRoom = async (e) => {
        e.preventDefault();
        try {
            await updateRoom(editingRoom.room_id, {
                name: editingRoom.name,
                color: editingRoom.color
            });
            alert("Pièce mise à jour !");
            setEditingRoom(null);
            fetchRooms();
        } catch (error) {
            alert("Erreur : " + error.message);
        }
    }

    return (
        <>
            <h2>Paramètres du profil</h2>
            <form onSubmit={handleUpdateProfile}>
                <div>
                    <label>
                        Prénom :
                        <input value={firstName} onChange={e => setFirstName(e.target.value)} />
                    </label>
                </div>
                <div>
                    <label>
                        Nom :
                        <input value={lastName} onChange={e => setLastName(e.target.value)} />
                    </label>
                </div>
                <div>
                    <label>
                        Email :
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                    </label>
                </div>
                <div>
                    <label>
                        Mot de passe :
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                    </label>
                </div>
                <div>
                    <label>
                        Avatar URL :
                        <input value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} />
                    </label>
                </div>
                <button type="submit">Sauvegarder</button>
            </form>
            <hr />
            
            <h2>Pièces de la maison</h2>

            <ul>
                {rooms.map((room) => (
                    <li key={room.room_id}>
                        {editingRoom?.room_id === room.room_id ? (
                            // Formulaire de modification
                            <form onSubmit={handleUpdateRoom}>
                                <input
                                    value={editingRoom.name}
                                    onChange={e => setEditingRoom({ ...editingRoom, name: e.target.value })}
                                />
                                <input
                                    type="color"
                                    value={editingRoom.color}
                                    onChange={e => setEditingRoom({ ...editingRoom, color: e.target.value })}
                                />
                                <button type="submit">Sauvegarder</button>
                                <button type="button" onClick={() => setEditingRoom(null)}>Annuler</button>
                            </form>
                        ) : (
                            // Affichage normal
                            <>
                                <span style={{ color: room.color }}>■</span> {room.name}
                                {can("create_room") && <button onClick={() => setEditingRoom(room)}> Modifier</button>}
                                {can("delete_room") && <button onClick={() => handleDeleteRoom(room.room_id)}> Supprimer</button>}
                            </>
                        )}
                    </li>
                ))}
            </ul>

            {can("create_room") && (
                <form onSubmit={handleCreateRoom}>
                    <div>
                        <label>Nom de la pièce :
                            <input value={newRoom.name} onChange={e => setNewRoom({ ...newRoom, name: e.target.value })} required />
                        </label>
                    </div>
                    <div>
                        <label>Couleur :
                            <input type="color" value={newRoom.color} onChange={e => setNewRoom({ ...newRoom, color: e.target.value })} />
                        </label>
                    </div>
                    <button type="submit">Ajouter la pièce</button>
                </form>
            )}

            {/* Section rôles — visible si permission manage_roles */}
            {can("manage_roles") && (
                <>
                    <hr />
                    <h2>Rôles de la famille</h2>

                    {/* Liste des rôles existants */}
                    <ul>
                        {roles.map(r => (
                            <li key={r.role_id}>
                                <button onClick={() => handleSelectRole(r)}>
                                    {r.role} {selectedRole?.role_id === r.role_id ? "▲" : "▼"}
                                </button>
                                <button onClick={() => handleDeleteRole(r.role_id)} style={{ color: "red", marginLeft: "8px" }}>
                                    Supprimer
                                </button>

                                {/* Grille de permissions — s'affiche sous le rôle sélectionné */}
                                {selectedRole?.role_id === r.role_id && (
                                    <div style={{ marginTop: "10px" }}>
                                        <table>
                                            <tbody>
                                                {permissions.map(p => (
                                                    <tr key={p.action}>
                                                        <td>{ACTION_LABELS[p.action] || p.action}</td>
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                checked={!!p.allowed}
                                                                onChange={() => handleTogglePermission(p.action)}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <button onClick={handleSavePermissions}>Enregistrer</button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>

                    {/* Formulaire de création d'un nouveau rôle */}
                    <form onSubmit={handleCreateRole}>
                        <input
                            placeholder="Nom du rôle (ex: Papa)"
                            value={newRoleName}
                            onChange={e => setNewRoleName(e.target.value)}
                        />
                        <button type="submit">Créer le rôle</button>
                    </form>
                </>
            )}
        </>
    )
}
export default Settings;