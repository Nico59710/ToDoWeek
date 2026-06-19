import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../Contexte/AuthContext";
import { generateInviteCode, getMembersByFamilyId, getPendingRequests, updateRequestStatus, removeMemberFromFamily, deleteFamily, updateFamily, getTasksByUserId, getRolesByFamilyId, updateMemberRole } from "../services/service";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";
import "./Membres.css";

function Members() {
    const { role, userId, families, selectedFamily, setFamilies, setSelectedFamily, setRole, can } = useContext(AuthContext);
    const navigate = useNavigate();

    const [inviteCode, setInviteCode] = useState("");
    const [showInviteSection, setShowInviteSection] = useState(false);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [showRenameForm, setShowRenameForm] = useState(false);
    const [newFamilyName, setNewFamilyName] = useState("");
    const [selectedMemberProfile, setSelectedMemberProfile] = useState(null);
    const [memberTasks, setMemberTasks] = useState([]);
    const [familyRoles, setFamilyRoles] = useState([]);
    const [members, setMembers] = useState([]);

    useEffect(() => {
        if (selectedFamily) {
            getRolesByFamilyId(selectedFamily.family_id)
                .then(res => setFamilyRoles(res.data))
                .catch(err => console.error(err));
        }
    }, [selectedFamily]);

    const handleUpdateMemberRole = async (member, roleId) => {
        try {
            await updateMemberRole(selectedFamily.family_id, member.user_id, roleId);
            fetchMembers();
        } catch (error) {
            alert("Erreur : " + error.message);
        }
    };

    const fetchMembers = async () => {
        try {
            const response = await getMembersByFamilyId(selectedFamily?.family_id);
            setMembers(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchPendingRequests = async () => {
        try {
            const response = await getPendingRequests(selectedFamily?.family_id);
            setPendingRequests(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (selectedFamily) {
            fetchMembers();
            if (can("accept_member")) fetchPendingRequests();
        }
    }, [role, selectedFamily]);

    const handleGenerateCode = async () => {
        try {
            const response = await generateInviteCode(selectedFamily?.family_id);
            setInviteCode(response.data.invite_code);
            setShowInviteSection(true);
        } catch (error) {
            alert("Erreur : " + error.message);
        }
    };

    const handleAnnuledCode = () => {
        setInviteCode("");
        setShowInviteSection(false);
    };

    const handleViewProfile = async (member) => {
        if (selectedMemberProfile?.user_id === member.user_id) {
            setSelectedMemberProfile(null);
            setMemberTasks([]);
            return;
        }
        try {
            const response = await getTasksByUserId(member.user_id);
            setMemberTasks(response.data);
            setSelectedMemberProfile(member);
        } catch (error) {
            console.error(error);
        }
    };

    const handleRenameFamily = async (e) => {
        e.preventDefault();
        if (!newFamilyName.trim()) return;
        try {
            await updateFamily(selectedFamily?.family_id, { name: newFamilyName.trim() });
            const updatedFamilies = families.map(f =>
                f.family_id === selectedFamily?.family_id ? { ...f, name: newFamilyName.trim() } : f
            );
            setFamilies(updatedFamilies);
            setSelectedFamily({ ...selectedFamily, name: newFamilyName.trim() });
            setShowRenameForm(false);
            setNewFamilyName("");
        } catch (error) {
            alert("Erreur : " + error.message);
        }
    };

    const handleDeleteFamily = async () => {
        if (!window.confirm(`Supprimer définitivement la famille "${selectedFamily?.name}" ? Cette action est irréversible.`)) return;
        try {
            await deleteFamily(selectedFamily?.family_id);
            const updatedFamilies = families.filter(f => f.family_id !== selectedFamily?.family_id);
            setFamilies(updatedFamilies);
            setSelectedFamily(updatedFamilies.length > 0 ? updatedFamilies[0] : null);
            if (updatedFamilies.length === 0) { setRole("temp"); navigate("/"); }
        } catch (error) {
            alert("Erreur : " + error.message);
        }
    };

    const handleLeaveFamily = async () => {
        if (!window.confirm(`Quitter la famille "${selectedFamily?.name}" ?`)) return;
        try {
            await removeMemberFromFamily(selectedFamily?.family_id, userId);
            const updatedFamilies = families.filter(f => f.family_id !== selectedFamily?.family_id);
            setFamilies(updatedFamilies);
            setSelectedFamily(updatedFamilies.length > 0 ? updatedFamilies[0] : null);
            if (updatedFamilies.length === 0) { setRole("temp"); navigate("/"); }
        } catch (error) {
            alert("Erreur : " + error.message);
        }
    };

    const handleRemoveMember = async (member) => {
        if (!window.confirm(`Retirer ${member.first_name} ${member.last_name} de la famille ?`)) return;
        try {
            await removeMemberFromFamily(selectedFamily?.family_id, member.user_id);
            fetchMembers();
        } catch (error) {
            alert("Erreur : " + error.message);
        }
    };

    const handleRequestStatus = async (requestUserId, status) => {
        try {
            await updateRequestStatus(selectedFamily?.family_id, requestUserId, status);
            alert(status === "accepted" ? "Membre accepté !" : "Membre refusé.");
            fetchPendingRequests();
            fetchMembers();
        } catch (error) {
            alert("Erreur : " + error.message);
        }
    };

    if (families.length === 0) {
        return (
            <div className="members-page">
                <EmptyState icon="👨‍👩‍👧" title="Aucune famille" description="Rejoignez ou créez une famille pour voir les membres." />
            </div>
        );
    }

    if (role === "temp") {
        return (
            <div className="members-page">
                <EmptyState icon="🔒" title="Accès refusé" description="Connectez-vous et rejoignez une famille pour voir les membres." />
            </div>
        );
    }

    return (
        <div className="members-page">
            <PageHeader title="Membres" subtitle={`Famille ${selectedFamily?.name}`} />

            {/* ── Grille des membres ── */}
            <div className="members-grid">
                {members.map((member) => (
                    <div key={member.user_id} className="member-card">
                        <div className="member-card-body">
                            <div className="member-card-avatar">
                                {member.first_name?.[0]?.toUpperCase()}{member.last_name?.[0]?.toUpperCase()}
                            </div>
                            <div className="member-card-name">
                                {member.first_name} {member.last_name}
                            </div>
                            <span className="badge badge-primary">{member.role}</span>

                            {can("manage_roles") && member.user_id !== userId && familyRoles.length > 0 && (
                                <select
                                    className="member-card-role-select"
                                    value={member.role_id ?? ""}
                                    onChange={e => handleUpdateMemberRole(member, e.target.value)}
                                >
                                    {familyRoles.map(r => (
                                        <option key={r.role_id} value={r.role_id}>{r.role}</option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div className="member-card-actions">
                            <button
                                className="btn-profile"
                                onClick={() => handleViewProfile(member)}
                            >
                                {selectedMemberProfile?.user_id === member.user_id ? "Fermer" : "Profil"}
                            </button>
                            {can("remove_member") && member.user_id !== userId && (
                                <button
                                    className="btn-remove"
                                    onClick={() => handleRemoveMember(member)}
                                >
                                    Retirer
                                </button>
                            )}
                        </div>

                        {selectedMemberProfile?.user_id === member.user_id && (
                            <div className="member-profile-panel" style={{ margin: "0 12px 12px" }}>
                                <h4>Profil de {member.first_name}</h4>
                                <p><strong>Points :</strong> {selectedMemberProfile.points ?? "—"}</p>
                                <p style={{ marginTop: "8px", fontWeight: 700, fontSize: "0.82rem" }}>Tâches :</p>
                                {memberTasks.length > 0 ? (
                                    <ul className="member-tasks-list">
                                        {memberTasks.map(task => (
                                            <li key={task.task_id}>
                                                {task.title} — <em>{task.status}</em>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>Aucune tâche.</p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* ── Invitation ── */}
            {can("invite_member") && (
                <div className="invite-section">
                    <h3>Inviter un membre</h3>
                    <div className="invite-actions">
                        <button className="btn btn-primary" onClick={handleGenerateCode}>
                            + Générer un code d'invitation
                        </button>
                        {showInviteSection && (
                            <button className="btn btn-secondary" onClick={handleAnnuledCode}>
                                Annuler
                            </button>
                        )}
                    </div>
                    {inviteCode && (
                        <div className="invite-code-display">
                            <span className="invite-code-value">{inviteCode}</span>
                            <button
                                className="btn btn-secondary"
                                onClick={() => navigator.clipboard.writeText(inviteCode)}
                            >
                                Copier
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* ── Demandes en attente ── */}
            {can("accept_member") && (
                <div className="members-section">
                    <h3>Demandes en attente
                        {pendingRequests.length > 0 && (
                            <span className="badge badge-warning" style={{ marginLeft: "10px" }}>
                                {pendingRequests.length}
                            </span>
                        )}
                    </h3>
                    {pendingRequests.length > 0 ? (
                        <ul className="pending-list">
                            {pendingRequests.map((request) => (
                                <li key={request.user_id} className="pending-item">
                                    <div className="pending-item-info">
                                        <span className="pending-item-name">{request.first_name} {request.last_name}</span>
                                        <span className="pending-item-email">{request.email}</span>
                                    </div>
                                    <div className="pending-item-actions">
                                        <button className="btn-accept" onClick={() => handleRequestStatus(request.user_id, "accepted")}>Accepter</button>
                                        <button className="btn-refuse" onClick={() => handleRequestStatus(request.user_id, "refused")}>Refuser</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="empty-state">Aucune demande en attente.</p>
                    )}
                </div>
            )}

            {/* ── Renommer la famille ── */}
            {can("rename_family") && (
                <div className="members-section">
                    <h3>Gestion de la famille</h3>
                    {showRenameForm ? (
                        <form onSubmit={handleRenameFamily} className="rename-form">
                            <input
                                value={newFamilyName}
                                onChange={e => setNewFamilyName(e.target.value)}
                                placeholder={selectedFamily?.name}
                                required
                            />
                            <button className="btn btn-primary" type="submit">Valider</button>
                            <button className="btn btn-secondary" type="button" onClick={() => { setShowRenameForm(false); setNewFamilyName(""); }}>Annuler</button>
                        </form>
                    ) : (
                        <button className="btn btn-secondary" onClick={() => setShowRenameForm(true)}>
                            ✏️ Renommer la famille
                        </button>
                    )}
                </div>
            )}

            {/* ── Danger zone ── */}
            <div className="danger-zone">
                <h3>Zone dangereuse</h3>
                <div className="danger-zone-actions">
                    {role !== "admin" && (
                        <button className="btn btn-danger" onClick={handleLeaveFamily}>
                            Quitter la famille
                        </button>
                    )}
                    {can("delete_family") && (
                        <button className="btn btn-danger" onClick={handleDeleteFamily}>
                            🗑 Supprimer la famille
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Members;
