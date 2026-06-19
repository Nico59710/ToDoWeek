import { useContext, useEffect, useState } from "react";
import AuthContext from "../Contexte/AuthContext";
import { createRoom, deleteRoom, getRoomsByFamilyId, updateRoom, updateUserById, getRolesByFamilyId, createRole, deleteRole, getPermissionsByRoleId, updatePermissions } from "../services/service";
import { jwtDecode } from "jwt-decode";
import PageHeader from "../components/ui/PageHeader";
import "./Settings.css";

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

    // Pièces
    const [rooms, setRooms] = useState([]);
    const [newRoom, setNewRoom] = useState({ name: "", color: "#6366f1" });
    const [editingRoom, setEditingRoom] = useState(null);

    // Rôles & permissions
    const [roles, setRoles] = useState([]);
    const [newRoleName, setNewRoleName] = useState("");
    const [selectedRole, setSelectedRole] = useState(null);
    const [permissions, setPermissions] = useState([]);

    useEffect(() => {
        if (families.length > 0) fetchRooms();
    }, [selectedFamily]);

    useEffect(() => {
        if (selectedFamily) fetchRoles();
    }, [selectedFamily]);

    const fetchRooms = async () => {
        try {
            const response = await getRoomsByFamilyId(selectedFamily?.family_id);
            setRooms(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await getRolesByFamilyId(selectedFamily.family_id);
            setRoles(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (!firstName.trim()) { alert("Le prénom est obligatoire"); return; }
        try {
            const response = await updateUserById(userId, {
                first_name: firstName,
                last_name: lastName,
                email: email,
                avatar_url: avatarUrl,
                password: password || null
            });
            localStorage.setItem('token', response.data.token);
            const decodedToken = jwtDecode(response.data.token);
            setRole(decodedToken.role);
            setMail(decodedToken.email);
            setUserId(decodedToken.user_id);
            alert("Profil mis à jour !");
        } catch (error) {
            alert("Erreur : " + error.message);
        }
    };

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
            setNewRoom({ name: "", color: "#6366f1" });
            fetchRooms();
        } catch (error) {
            alert("Erreur : " + error.message);
        }
    };

    const handleDeleteRoom = async (roomId) => {
        if (!confirm("Supprimer cette pièce ?")) return;
        try {
            await deleteRoom(roomId);
            fetchRooms();
        } catch (error) {
            alert("Erreur : " + error.message);
        }
    };

    const handleUpdateRoom = async (e) => {
        e.preventDefault();
        try {
            await updateRoom(editingRoom.room_id, { name: editingRoom.name, color: editingRoom.color });
            setEditingRoom(null);
            fetchRooms();
        } catch (error) {
            alert("Erreur : " + error.message);
        }
    };

    const handleCreateRole = async (e) => {
        e.preventDefault();
        if (!newRoleName.trim()) return;
        try {
            await createRole({ role: newRoleName.trim(), family_id: selectedFamily.family_id, is_active: 1 });
            setNewRoleName("");
            fetchRoles();
        } catch (error) {
            alert("Erreur : " + error.message);
        }
    };

    const handleDeleteRole = async (roleId) => {
        if (!window.confirm("Supprimer ce rôle ?")) return;
        try {
            await deleteRole(roleId);
            if (selectedRole?.role_id === roleId) setSelectedRole(null);
            fetchRoles();
        } catch (error) {
            alert("Erreur : " + error.message);
        }
    };

    const handleSelectRole = async (r) => {
        if (selectedRole?.role_id === r.role_id) {
            setSelectedRole(null);
            setPermissions([]);
            return;
        }
        try {
            const response = await getPermissionsByRoleId(r.role_id);
            setSelectedRole(r);
            setPermissions(response.data);
        } catch (error) {
            alert("Erreur : " + error.message);
        }
    };

    const handleTogglePermission = (action) => {
        setPermissions(prev =>
            prev.map(p => p.action === action ? { ...p, allowed: !p.allowed } : p)
        );
    };

    const handleSavePermissions = async () => {
        try {
            await updatePermissions(selectedRole.role_id, permissions);
            alert("Permissions enregistrées !");
        } catch (error) {
            alert("Erreur : " + error.message);
        }
    };

    return (
        <div className="settings-page">
            <PageHeader title="Paramètres" subtitle="Profil, pièces et permissions" />

            {/* ── Profil ── */}
            <div className="settings-section">
                <div className="settings-section-header">
                    <h2 className="settings-section-title">Mon profil</h2>
                </div>
                <div className="settings-section-body">
                    <form onSubmit={handleUpdateProfile} className="profile-form">
                        <div className="profile-form-group">
                            <label>Prénom</label>
                            <input value={firstName} onChange={e => setFirstName(e.target.value)} required />
                        </div>
                        <div className="profile-form-group">
                            <label>Nom</label>
                            <input value={lastName} onChange={e => setLastName(e.target.value)} />
                        </div>
                        <div className="profile-form-group">
                            <label>Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div className="profile-form-group">
                            <label>Nouveau mot de passe</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Laisser vide pour ne pas changer" />
                        </div>
                        <div className="profile-form-group full-width">
                            <label>URL de l'avatar</label>
                            <input value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} placeholder="https://..." />
                        </div>
                        <div className="profile-form-actions">
                            <button type="submit" className="btn btn-primary">Sauvegarder</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* ── Pièces de la maison ── */}
            <div className="settings-section">
                <div className="settings-section-header">
                    <h2 className="settings-section-title">Pièces de la maison</h2>
                </div>
                <div className="settings-section-body">
                    {rooms.length > 0 ? (
                        <div className="rooms-grid">
                            {rooms.map((room) => (
                                <div key={room.room_id} className="room-card">
                                    {editingRoom?.room_id === room.room_id ? (
                                        <form onSubmit={handleUpdateRoom} className="room-edit-form">
                                            <input
                                                type="text"
                                                value={editingRoom.name}
                                                onChange={e => setEditingRoom({ ...editingRoom, name: e.target.value })}
                                            />
                                            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                                <input
                                                    type="color"
                                                    value={editingRoom.color}
                                                    onChange={e => setEditingRoom({ ...editingRoom, color: e.target.value })}
                                                />
                                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Sauvegarder</button>
                                                <button type="button" className="btn btn-secondary" onClick={() => setEditingRoom(null)}>Annuler</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <>
                                            <div className="room-card-name">
                                                <span className="room-color-dot" style={{ background: room.color }} />
                                                {room.name}
                                            </div>
                                            <div className="room-card-actions">
                                                {can("create_room") && (
                                                    <button
                                                        style={{ background: "var(--primary-light)", color: "var(--primary)" }}
                                                        onClick={() => setEditingRoom(room)}
                                                    >
                                                        Modifier
                                                    </button>
                                                )}
                                                {can("delete_room") && (
                                                    <button
                                                        style={{ background: "var(--danger-light)", color: "var(--danger)" }}
                                                        onClick={() => handleDeleteRoom(room.room_id)}
                                                    >
                                                        Supprimer
                                                    </button>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="empty-state">Aucune pièce configurée.</p>
                    )}

                    {can("create_room") && (
                        <form onSubmit={handleCreateRoom} className="room-create-form">
                            <h4>Ajouter une pièce</h4>
                            <div className="room-create-row">
                                <input
                                    type="text"
                                    value={newRoom.name}
                                    onChange={e => setNewRoom({ ...newRoom, name: e.target.value })}
                                    placeholder="Nom de la pièce..."
                                    required
                                />
                                <input
                                    type="color"
                                    value={newRoom.color}
                                    onChange={e => setNewRoom({ ...newRoom, color: e.target.value })}
                                    title="Couleur"
                                />
                                <button type="submit" className="btn btn-primary">Ajouter</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* ── Rôles & permissions ── */}
            {can("manage_roles") && (
                <div className="settings-section">
                    <div className="settings-section-header">
                        <h2 className="settings-section-title">Rôles de la famille</h2>
                    </div>
                    <div className="settings-section-body">
                        <div className="roles-list">
                            {roles.map(r => (
                                <div key={r.role_id} className={`role-item${selectedRole?.role_id === r.role_id ? " open" : ""}`}>
                                    <div className="role-item-header" onClick={() => handleSelectRole(r)}>
                                        <span className="role-item-name">{r.role}</span>
                                        <div className="role-item-actions">
                                            <button
                                                className="btn btn-danger"
                                                style={{ padding: "4px 10px", fontSize: "0.75rem" }}
                                                onClick={ev => { ev.stopPropagation(); handleDeleteRole(r.role_id); }}
                                            >
                                                Supprimer
                                            </button>
                                            <span className="role-item-chevron">▼</span>
                                        </div>
                                    </div>

                                    {selectedRole?.role_id === r.role_id && (
                                        <div className="permissions-panel">
                                            <div className="permissions-grid">
                                                {permissions.map(p => (
                                                    <div
                                                        key={p.action}
                                                        className={`permission-row${p.allowed ? " allowed" : ""}`}
                                                        onClick={() => handleTogglePermission(p.action)}
                                                    >
                                                        <span className="permission-label">{ACTION_LABELS[p.action] || p.action}</span>
                                                        <div className="permission-toggle">
                                                            {p.allowed ? "✓" : ""}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="permissions-save-row">
                                                <button className="btn btn-primary" onClick={handleSavePermissions}>
                                                    Enregistrer les permissions
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleCreateRole} className="new-role-form">
                            <input
                                placeholder="Nom du nouveau rôle (ex : Papa)"
                                value={newRoleName}
                                onChange={e => setNewRoleName(e.target.value)}
                            />
                            <button type="submit" className="btn btn-primary">Créer</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Settings;
