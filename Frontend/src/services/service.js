import axios from "axios";

// Recuperation de toutes les tasks
export function getAllTasks() {
    return axios.get("http://localhost:3000/tasks")
}

// Recuperation du user by Id
export function getUserById(id) {
    return axios.get(`http://localhost:3000/users/${id}`)
}

// Recuperation des tâches via l'Id du USER
export function getTasksByUserId(id) {
    return axios.get(`http://localhost:3000/tasks/user/${id}`)
}

// Authentifiacation user (login)
export function loginUser(login) {
    return axios.post("http://localhost:3000/login", login)
}

//Creation new user 
export function createUser(register) {
    return axios.post("http://localhost:3000/users", register)
}

//Recuperation des familles par USER
export function getFamiliesByUserId(id) {
    return axios.get(`http://localhost:3000/families/user/${id}`)
}

//Recuperation des familles par OWNER
export function getFamiliesByOwnerId(id) {
    return axios.get(`http://localhost:3000/families/owner/${id}`)
}

//Recuperation du family_id par OWNER et name
export function getFamiliesByOwnerIdAndName(reg) {
    return axios.get("http://localhost:3000/families/owner/name", {
        params: reg
    })
}

//Ajout d'un User à une famille
export function addUserToFammily(regUser) {
    return axios.post("http://localhost:3000/user-families", regUser)
}

//Recuperation des tâches par famille 
export function getTasksByFamilyId(id) {
    return axios.get(`http://localhost:3000/tasks/family/${id}`)
}

//Creation nouvelle famille 
export function createNewFamily(regFamily) {
    return axios.post("http://localhost:3000/families", regFamily)
}

// Générer un code d'invitation pour une famille
export function generateInviteCode(familyId) {
    return axios.post(`http://localhost:3000/families/${familyId}/invite`);
}

// mise a jour du role du USER
export function updateUserRole(id, role_id) {
    return axios.put(`http://localhost:3000/users/${id}`, role_id)
}

// Rejoindre une famille via un code d'invitation
// Envoie une demande en statut "pending" en attente de validation par l'admin
export function joinFamily(data) {
    return axios.post("http://localhost:3000/user-families/join", data);
}

// Récupérer les demandes en attente pour une famille
export function getPendingRequests(familyId) {
    return axios.get(`http://localhost:3000/user-families/pending/${familyId}`);
}

// Accepter ou refuser une demande
export function updateRequestStatus(familyId, userId, status) {
    return axios.put(`http://localhost:3000/user-families/status/${familyId}/${userId}`, { status });
}

// Récupérer les membres d'une famille
export function getMembersByFamilyId(familyId) {
    return axios.get(`http://localhost:3000/user-families/members/${familyId}`);
}

// Mettre à jour le profil utilisateur
export function updateUserById(id, userData) {
    return axios.put(`http://localhost:3000/users/profile/${id}`, userData);
}

// Créer une nouvelle tâche
export function createTask(task) {
    return axios.post("http://localhost:3000/tasks", task);
}

// Récupérer les rooms d'une famille
export function getRoomsByFamilyId(familyId) {
    return axios.get(`http://localhost:3000/rooms/family/${familyId}`);
}

// Créer une nouvelle pièce
export function createRoom(room) {
    return axios.post("http://localhost:3000/rooms", room);
}

// Supprimer une pièce
export function deleteRoom(roomId) {
    return axios.delete(`http://localhost:3000/rooms/${roomId}`);
}

// Modifier une pièce
export function updateRoom(roomId, room) {
    return axios.put(`http://localhost:3000/rooms/${roomId}`, room);
}

// Mettre à jour le statut d'une tâche
export function updateTaskStatus(taskId, data) {
    return axios.put(`http://localhost:3000/tasks/${taskId}/status`, data);
}

// Attribuer une tâche à un utilisateur
export function assignTask(taskId, userId) {
    return axios.put(`http://localhost:3000/tasks/${taskId}/assign`, { attributed_to: userId });
}

//Modification d'une tâche
export function UpdateTask(taskId, data) {
    return axios.put(`http://localhost:3000/tasks/${taskId}`, data);
}

// Supprimer une tâche
export function deleteTask(taskId) {
    return axios.delete(`http://localhost:3000/tasks/${taskId}`);
}

// Retirer un membre d'une famille
export function removeMemberFromFamily(familyId, memberId) {
    return axios.delete(`http://localhost:3000/user-families/${familyId}/${memberId}`);
}

// Supprimer une famille
export function deleteFamily(familyId) {
    return axios.delete(`http://localhost:3000/families/${familyId}`);
}

// Renommer une famille
export function updateFamily(familyId, data) {
    return axios.put(`http://localhost:3000/families/${familyId}`, data);
}

// Récupérer les rôles d'une famille
export function getRolesByFamilyId(familyId) {
    return axios.get(`http://localhost:3000/roles/family/${familyId}`);
}

// Créer un rôle dans une famille
export function createRole(data) {
    return axios.post('http://localhost:3000/roles', data);
}

// Supprimer un rôle
export function deleteRole(roleId) {
    return axios.delete(`http://localhost:3000/roles/${roleId}`);
}

// Récupérer les permissions d'un rôle
export function getPermissionsByRoleId(roleId) {
    return axios.get(`http://localhost:3000/permissions/role/${roleId}`);
}

// Mettre à jour les permissions d'un rôle
export function updatePermissions(roleId, permissions) {
    return axios.put(`http://localhost:3000/permissions/role/${roleId}`, { permissions });
}

// Récupérer les permissions de l'utilisateur connecté dans une famille
export function getPermissionsByUserAndFamily(userId, familyId) {
    return axios.get(`http://localhost:3000/permissions/user/${userId}/family/${familyId}`);
}

// Changer le rôle d'un membre dans une famille
export function updateMemberRole(familyId, userId, roleId) {
    return axios.put(`http://localhost:3000/user-families/role/${familyId}/${userId}`, { role_id: roleId });
}