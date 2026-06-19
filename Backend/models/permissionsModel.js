import { db } from '../config/db.js';

// Récupère toutes les permissions de référence (les 14 actions)
export async function getAllPermissionsModel() {
    const query = 'SELECT * FROM permissions WHERE is_active = 1';
    const [result] = await db.query(query);
    return result;
}
