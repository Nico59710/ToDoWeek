import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import AuthService from "../services/AuthService";
import { getFamiliesByUserId, getPermissionsByUserAndFamily } from "../services/service";

// Composant provider qui fournit le contexte d'authentification à toute l'application
export function AuthProvider({ children }) {

    // États pour gérer les informations d'authentification de l'utilisateur
    const [isLogged, setIsLogged] = useState(AuthService.isConnected()); // État de connexion
    const [role, setRole] = useState(AuthService.getRole()); // Rôle de l'utilisateur
    const [mail, setMail] = useState(AuthService.getMail()); // Email de l'utilisateur
    const [userId, setUserId] = useState(AuthService.getUserId()); // ID de l'utilisateur

    // États pour stocker les données liées à l'utilisateur
    const [families, setFamilies] = useState([]); // Liste des familles de l'utilisateur
    const [user, setUser] = useState({}); // Informations de l'utilisateur
    const [tasksByUserId, setTasksByUserId] = useState([]); // Liste des tâches de l'utilisateur
    const [selectedFamily, setSelectedFamily] = useState(null);
    const [permissions, setPermissions] = useState({});


    // Effet pour charger les familles de l'utilisateur au montage du composant ou quand userId change
    useEffect(() => {
        const loadFamilies = async () => {
            // Ne charger que si l'utilisateur est connecté et a un ID
            if (!isLogged || !userId) return;

            try {
                // Appel API pour récupérer les familles de l'utilisateur
                const res = await getFamiliesByUserId(userId);
                setFamilies(res.data); // Mise à jour de l'état avec les données reçues
            } catch (err) {
                // Gestion des erreurs en cas d'échec de la requête
                console.error(err);
            }
        };

        loadFamilies();
    }, [isLogged, userId]); // Se réexécute quand isLogged ou userId change

    // Quand les familles sont chargées, sélectionne la première par défaut
    useEffect(() => {
        if (families.length > 0 && !selectedFamily) {
            setSelectedFamily(families[0]);
        }
    }, [families]);

    // Charge les permissions de l'utilisateur dans la famille sélectionnée
    // L'admin système a toujours tous les droits — pas besoin d'appeler l'API
    useEffect(() => {
        const loadPermissions = async () => {
            if (!selectedFamily || !userId) return;
            if (role === "admin") {
                setPermissions({});
                return;
            }
            try {
                const res = await getPermissionsByUserAndFamily(userId, selectedFamily.family_id);
                setPermissions(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        loadPermissions();
    }, [selectedFamily, userId]);

    // L'admin système a toujours tous les droits sans vérifier la BDD
    // TODO: RÉVISER — vérifier que role === "admin" correspond bien au rôle système
    // et pas à un rôle familial. Voir AuthService.getRole() pour confirmer la source.
    const can = (action) => {
        if (role === "admin") return true;
        return permissions[action] === true;
    };

    // Fournit le contexte d'authentification à tous les composants enfants
    return (
        <AuthContext.Provider
            // Objet value contenant tous les états et setter pour l'authentification
            value={{
                isLogged, // État: l'utilisateur est connecté
                setIsLogged, // Fonction pour changer l'état de connexion
                role, // État: rôle de l'utilisateur
                setRole, // Fonction pour changer le rôle
                mail, // État: email de l'utilisateur
                setMail, // Fonction pour changer l'email
                userId, // État: ID de l'utilisateur
                setUserId, // Fonction pour changer l'ID
                families, // État: liste des familles
                setFamilies, // Fonction pour changer la liste des familles
                user, // État: informations de l'utilisateur
                setUser, // Fonction pour changer les informations de l'utilisateur
                tasksByUserId, // État: liste des tâches de l'utilisateur
                setTasksByUserId, // Fonction pour changer la liste des tâches
                selectedFamily, // Choix de la famille selectionné dans la navbar (1er famille par defaut)
                setSelectedFamily, // fonction pour carger les familles dans la navbar
                permissions, // Permissions de l'utilisateur dans la famille sélectionnée
                can, // Vérifie si l'utilisateur peut effectuer une action
            }}
        >
            {children} {/* Affiche les composants enfants qui utiliseront ce contexte */}
        </AuthContext.Provider>
    );
}