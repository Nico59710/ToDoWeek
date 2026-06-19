import { db } from '../config/db.js';

//CREATE
export async function createUserModel(email, password_hash, last_name, first_name, avatar_url, points, updated_at) {
    const add = 'INSERT INTO users (email,password_hash,last_name,first_name,avatar_url,points,updated_at) VALUES (?,?,?,?,?,?,?)';
    const [result] = await db.query(add, [email, password_hash, last_name, first_name, avatar_url, points, updated_at]);
    return result
}

//READ
export async function getAllUsersModel() {
    const select = 'SELECT * FROM users';
    const [result] = await db.query(select);
    return result
}
export async function getUserByIdModel(id) {
    const select = 'SELECT * FROM users WHERE user_id = ?';
    const [result] = await db.query(select, [id]);
    return result;
}

export async function loginModel(email) {
    const select = "SELECT * FROM users u JOIN roles r ON r.role_id = u.role_id WHERE email=?";
    const [result] = await db.query(select, [email]);
    return result;
}

//UPDATE
export async function updateRoleByUserIdModel(id, role_id) {
    const query = 'UPDATE users SET role_id = ? WHERE user_id = ?';
    const [result] = await db.query(query, [role_id, id]);
    return result;
}

//DELETE
export async function deleteUserByIdModel(id) {
    const deleteQuery = 'UPDATE users SET is_active = 0 WHERE user_id = ?';
    const [result] = await db.query(deleteQuery, [id]);
    return result
}

//Mise à jour des informations du USER
export async function updateUserProfileModel(id, first_name, last_name, email, password_hash, avatar_url) {
    // Si un nouveau mot de passe est fourni, on l'inclut dans la requête
    if (password_hash) {
        const query = `
            UPDATE users 
            SET first_name = ?, last_name = ?, email = ?, avatar_url = ?, password_hash = ?
            WHERE user_id = ?
        `;
        const [result] = await db.query(query, [first_name, last_name, email, avatar_url, password_hash, id]);
        return result;
    }

    // Sinon on ne touche pas au mot de passe
    const query = `
        UPDATE users 
        SET first_name = ?, last_name = ?, email = ?, avatar_url = ?
        WHERE user_id = ?
    `;
    const [result] = await db.query(query, [first_name, last_name, email, avatar_url, id]);
    return result;
}


