import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { loginModel } from '../models/userModel.js';

// Fonction d'authentification pour un utilisateur
export async function login(req, res) {
    try {
        // Récupère les informations d'identification du corps de la requête
        const { email, password } = req.body;

        // Vérifie si l'email et le mot de passe sont présents dans le corps de la requête
        if (!email || !password) {
            return res.status(400).json({ error: 'Email et mot de passe requis' });
        }

        // Vérification que l'email est valide (contient un @)
        if (!email.includes('@')) {
            return res.status(400).json({ error: 'Email invalide' });
        }

        // Recherche de l'utilisateur dans la base de données par son email
        const user = await loginModel(email);

        // Si aucun utilisateur n'est trouvé, on retourne un message d'erreur
        if (user.length === 0) {
            return res.status(400).json({ error: 'Email ou mot de passe incorrect' });
        }

        // Vérification du mot de passe entré par l'utilisateur avec le hash stocké en base de données
        const validPassword = await bcrypt.compare(password, user[0].password_hash);

        // Si les mots de passe ne correspondent pas, on retourne un message d'erreur
        if (!validPassword) {
            return res.status(400).json({ error: 'Email ou mot de passe incorrect' });
        }

        // Génération du token JWT avec l'email et le rôle de l'utilisateur
        const token = jwt.sign(
            {
                email: user[0].email,
                role: user[0].role,
                user_id : user[0].user_id,
            },
            process.env.JWT_SECRET,  // Clé secrète utilisée pour signer le token
            { expiresIn: '1h' }      // Le token expirera dans 1 heure
        );

        // Envoi du token au client dans la réponse JSON
        res.json({ token });
        
    } catch (error) {
        // Affiche l'erreur dans le terminal et retourne un message d'erreur à l'utilisateur
        console.error(error);
        res.status(500).json({ error: 'Échec de la connexion' });
    }
}