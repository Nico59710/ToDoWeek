import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Index";
import AuthContext from "../Contexte/AuthContext";
import { generateInviteCode, getMembersByFamilyId, getPendingRequests, updateRequestStatus, removeMemberFromFamily, deleteFamily, updateFamily, getTasksByUserId, getRolesByFamilyId, updateMemberRole } from "../services/service";

function Members() {
    const { role, userId, families, selectedFamily, setFamilies, setSelectedFamily, setRole, can } = useContext(AuthContext);
    const navigate = useNavigate();

    const [inviteCode, setInviteCode] = useState("");
    const [pendingRequests, setPendingRequests] = useState([]);
    const [showRenameForm, setShowRenameForm] = useState(false);
    const [newFamilyName, setNewFamilyName] = useState("");
    const [selectedMemberProfile, setSelectedMemberProfile] = useState(null);
    const [memberTasks, setMemberTasks] = useState([]);


    // Rôles disponibles dans la famille (pour le select d'assignation)
    const [familyRoles, setFamilyRoles] = useState([]);

    // useEffect = se déclenche automatiquement quand [selectedFamily] change
    // Si l'utilisateur switche de famille, on recharge les rôles de la nouvelle famille
    // getRolesByFamilyId → appel API → GET /roles/family/:id
    // .then(res => ...) → si succès : on stocke les rôles dans le state familyRoles
    // .catch(err => ...) → si erreur : on l'affiche dans la console sans planter l'app
    useEffect(() => {
        if (selectedFamily) {                                      // vérifie qu'une famille est bien sélectionnée
            getRolesByFamilyId(selectedFamily.family_id)           // appel API avec l'id de la famille active
                .then(res => setFamilyRoles(res.data))             // stocke le tableau de rôles reçu
                .catch(err => console.error(err));                 // log l'erreur sans bloquer le rendu
        }
    }, [selectedFamily]); // dépendance : se relance à chaque changement de selectedFamily

    // Change le rôle d'un membre dans la famille
    const handleUpdateMemberRole = async (member, roleId) => {
        try {
            await updateMemberRole(selectedFamily.family_id, member.user_id, roleId);
            fetchMembers();
        } catch (error) {
            alert("Erreur : " + error.message);
        }
    };

    // recuperation des membre d'une famille
    const [members, setMembers] = useState([]);
    const fetchMembers = async () => {
        try {
            const familyId = selectedFamily?.family_id;
            const response = await getMembersByFamilyId(familyId);
            setMembers(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    // Récupérer les demandes en attente au chargement
    useEffect(() => {
        if (selectedFamily) {
            fetchMembers();        
            if (can("accept_member")) {
                fetchPendingRequests();
            }
        }
        ;
    }, [role, selectedFamily]);

    const fetchPendingRequests = async () => {
        try {
            const familyId = selectedFamily?.family_id;
            const response = await getPendingRequests(familyId);
            setPendingRequests(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    const handleGenerateCode = async () => {
        try {
            const familyId = selectedFamily?.family_id;
            const response = await generateInviteCode(familyId);
            setInviteCode(response.data.invite_code);
        } catch (error) {
            alert("Erreur : " + error.message);
        }
    }

    const handleAnnuledCode = () => {
        setInviteCode("");
    }

    // Voir le profil d'un membre
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
    }

    // Renommer la famille (admin uniquement)
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
    }

    // Supprimer la famille (admin uniquement)
    const handleDeleteFamily = async () => {
        if (!window.confirm(`Supprimer définitivement la famille "${selectedFamily?.name}" ? Cette action est irréversible.`)) return;
        try {
            await deleteFamily(selectedFamily?.family_id);
            const updatedFamilies = families.filter(f => f.family_id !== selectedFamily?.family_id);
            setFamilies(updatedFamilies);
            setSelectedFamily(updatedFamilies.length > 0 ? updatedFamilies[0] : null);
            // L'admin n'a plus de famille → retour à l'onboarding
            if (updatedFamilies.length === 0) { setRole("temp"); navigate("/"); }
        } catch (error) {
            alert("Erreur : " + error.message);
        }
    }

    // Quitter la famille (pour les membres non-admin)
    const handleLeaveFamily = async () => {
        if (!window.confirm(`Quitter la famille "${selectedFamily?.name}" ?`)) return;
        try {
            await removeMemberFromFamily(selectedFamily?.family_id, userId);
            const updatedFamilies = families.filter(f => f.family_id !== selectedFamily?.family_id);
            setFamilies(updatedFamilies);
            setSelectedFamily(updatedFamilies.length > 0 ? updatedFamilies[0] : null);
            // Plus de famille → retour à l'écran d'onboarding sans re-login
            if (updatedFamilies.length === 0) { setRole("temp"); navigate("/"); }
        } catch (error) {
            alert("Erreur : " + error.message);
        }
    }

    // Retirer un membre de la famille
    const handleRemoveMember = async (member) => {
        if (!window.confirm(`Retirer ${member.first_name} ${member.last_name} de la famille ?`)) return;
        try {
            await removeMemberFromFamily(selectedFamily?.family_id, member.user_id);
            fetchMembers();
        } catch (error) {
            alert("Erreur : " + error.message);
        }
    }

    // Accepter ou refuser une demande
    const handleRequestStatus = async (requestUserId, status) => {
        try {
            const familyId = selectedFamily?.family_id;
            await updateRequestStatus(familyId, requestUserId, status);
            alert(status === "accepted" ? "Membre accepté !" : "Membre refusé.");
            fetchPendingRequests();
            fetchMembers(); // rafraîchit la liste des membres si accepté
        } catch (error) {
            alert("Erreur : " + error.message);
        }
    }

    return (
        <>
            {families.length > 0 ? (
                role !== "temp" ? (
                    <>
                        {/* Liste des membres */}
                        <section>
                            <h3>Membres de la famille</h3>
                            {members.length > 0 ? (
                                <ul>
                                    {members.map((member) => (
                                        <li key={member.user_id}>
                                            <span>{member.first_name} {member.last_name} — Role : {member.role}</span>
                                            {/* Select de rôle — visible si permission manage_roles, pas sur sa propre ligne */}
                                            {can("manage_roles") && member.user_id !== userId && familyRoles.length > 0 && (
                                                <select
                                                    value={member.role_id ?? ""}
                                                    onChange={e => handleUpdateMemberRole(member, e.target.value)}
                                                    style={{ marginLeft: "10px" }}
                                                >
                                                    {familyRoles.map(r => (
                                                        <option key={r.role_id} value={r.role_id}>{r.role}</option>
                                                    ))}
                                                </select>
                                            )}
                                            <button
                                                onClick={() => handleViewProfile(member)}
                                                style={{ marginLeft: "10px" }}
                                            >
                                                {selectedMemberProfile?.user_id === member.user_id ? "Fermer" : "Voir le profil"}
                                            </button>
                                            {can("remove_member") && member.user_id !== userId && (
                                                <button
                                                    onClick={() => handleRemoveMember(member)}
                                                    style={{ marginLeft: "10px", color: "red" }}
                                                >
                                                    Retirer
                                                </button>
                                            )}
                                            {selectedMemberProfile?.user_id === member.user_id && (
                                                <div style={{ marginTop: "8px", padding: "10px", background: "#e8f0fe", borderRadius: "8px" }}>
                                                    <p><strong>Points totaux :</strong> {selectedMemberProfile.points ?? "—"}</p>
                                                    <p><strong>Tâches en cours :</strong></p>
                                                    {memberTasks.length > 0 ? (
                                                        <ul>
                                                            {memberTasks.map(task => (
                                                                <li key={task.task_id}>
                                                                    {task.title} — <em>{task.status}</em>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p>Aucune tâche.</p>
                                                    )}
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Aucun membre trouvé.</p>
                            )}
                        </section>

                        {/* Bouton quitter la famille - membres uniquement */}
                        {role !== "admin" && (
                            <button
                                onClick={handleLeaveFamily}
                                style={{ color: "red", marginBottom: "10px" }}
                            >
                                Quitter la famille
                            </button>
                        )}

                        {/* Bouton invitation */}
                        {can("invite_member") && (
                            <>
                                <button onClick={handleGenerateCode}>
                                    + Inviter quelqu'un dans la famille
                                </button>
                                <button onClick={handleAnnuledCode}>
                                    Annuler
                                </button>
                                {inviteCode && (
                                    <div>
                                        <p>
                                            Code d'invitation : <strong>{inviteCode}</strong>
                                        </p>
                                        <button onClick={() => navigator.clipboard.writeText(inviteCode)}>
                                            Copier le code
                                        </button>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Demandes en attente */}
                        {can("accept_member") && (
                            <section>
                                <h3>Demandes en attente</h3>
                                {pendingRequests.length > 0 ? (
                                    <ul>
                                        {pendingRequests.map((request) => (
                                            <li key={request.user_id}>
                                                {request.first_name} {request.last_name} —{" "}
                                                {request.email}
                                                <button onClick={() => handleRequestStatus(request.user_id, "accepted")}>
                                                    Accepter
                                                </button>
                                                <button onClick={() => handleRequestStatus(request.user_id, "refused")}>
                                                    Refuser
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>Aucune demande en attente.</p>
                                )}
                            </section>
                        )}

                        {/* Renommer la famille */}
                        {can("rename_family") && (
                            <section>
                                {showRenameForm ? (
                                    <form onSubmit={handleRenameFamily} style={{ marginTop: "20px" }}>
                                        <input
                                            value={newFamilyName}
                                            onChange={e => setNewFamilyName(e.target.value)}
                                            placeholder={selectedFamily?.name}
                                            required
                                        />
                                        <button type="submit">Valider</button>
                                        <button type="button" onClick={() => { setShowRenameForm(false); setNewFamilyName(""); }}>Annuler</button>
                                    </form>
                                ) : (
                                    <button onClick={() => setShowRenameForm(true)} style={{ marginTop: "20px" }}>
                                        Renommer la famille
                                    </button>
                                )}
                            </section>
                        )}

                        {/* Supprimer la famille */}
                        {can("delete_family") && (
                            <button onClick={handleDeleteFamily} style={{ color: "red", marginTop: "10px" }}>
                                Supprimer la famille
                            </button>
                        )}
                    </>
                ) : (
                    <p>Connectez-vous</p>
                )
            ) : (
                <p>Pas de famille trouvée</p>
            )}
        </>
    );
}

export default Members;