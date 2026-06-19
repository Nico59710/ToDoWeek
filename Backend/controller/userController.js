import * as userModel from '../models/userModel.js';
import bcrypt from 'bcrypt';
import { loginModel, createUserModel } from '../models/userModel.js';
import jwt from "jsonwebtoken";


//CREATE
export async function createUserController(req, res) {
    try {
        const { email, password, last_name, first_name, avatar_url, points, is_active, created_at, updated_at, role_id } = req.body;
        const exist = await loginModel(email)
        if (exist.length > 0) {
            return res.status(400).json({ error: 'Email déjà utilisé' });
        }
        if (!email.includes('@')) {
            return res.status(400).json({ error: 'Email invalide' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
        }
        const password_hash = await bcrypt.hash(password, 10);
        const result = await createUserModel(email, password_hash, last_name, first_name, avatar_url, points, is_active, created_at, updated_at, role_id);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Echec de la création de l\'utilisateur' });
        console.log(error);
    }
}

//READ
export async function getAllUsersController(req, res) {
    try {
        const result = await userModel.getAllUsersModel();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Echec de la récupération des utilisateurs' });
    }
}

export async function getUserByIdController(req, res) {
    const { id } = req.params;
    try {
        const result = await userModel.getUserByIdModel(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Echec de la récupération de l\'utilisateur' });
    }
}

//UPDATE
export async function updateUserByIdController(req, res) {
    const { id } = req.params;
    const { role_id } = req.body;
    try {
        const result = await userModel.updateRoleByUserIdModel(id, role_id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Echec de la mise à jour de l\'utilisateur' });
    }
}

//DELETE
export async function deleteUserByIdController(req, res) {
    const { id } = req.params;
    try {
        const result = await userModel.deleteUserByIdModel(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Echec de la suppression de l\'utilisateur' });
    }
}

//Mise à jour des informations du USER
export async function updateUserProfileController(req, res) {
    const { id } = req.params;
    const { first_name, last_name, email, avatar_url, password } = req.body;
    if (!first_name || first_name.trim() === "") {
        return res.status(400).json({ error: "Le prénom est obligatoire" });
    }
    try {
        let hashedPassword = password ? await bcrypt.hash(password, 10) : null;
        await userModel.updateUserProfileModel(id, first_name, last_name, email, hashedPassword, avatar_url);

        // Récupérer le user mis à jour
        const user = await userModel.getUserByIdModel(id);

        // Générer un nouveau token
        const token = jwt.sign(
            {
                email: user[0].email,
                role: user[0].role,
                user_id: user[0].user_id,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Echec de la mise à jour du profil' });
        console.log(error);
    }
}