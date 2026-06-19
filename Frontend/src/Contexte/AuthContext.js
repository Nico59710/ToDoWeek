import React from 'react';

/**
 * Contexte d'authentification global de l'application
 * Contient les informations de l'utilisateur et les fonctions pour les modifier
 */
const AuthContext = React.createContext({
    // ====== États d'authentification ======
    // État: indique si l'utilisateur est connecté
    isLogged: false,
    // Fonction: met à jour l'état de connexion
    setIsLogged: () => { },
    
    // État: rôle de l'utilisateur (ex: admin, utilisateur, parent, enfant)
    role: "",
    // Fonction: met à jour le rôle de l'utilisateur
    setRole: () => { },
    
    // État: ID unique de l'utilisateur
    userId: "",
    // Fonction: met à jour l'ID de l'utilisateur
    setUserId: () => { },
    
    // État: email de l'utilisateur
    mail: "",
    // Fonction: met à jour l'email de l'utilisateur
    setMail: () => { },
    


    
    // ====== Données utilisateur ======
    // État: liste des familles auxquelles l'utilisateur appartient
    families: [],
    // Fonction: met à jour la liste des familles
    setFamilies: () => { },
    
    // État: objet contenant les informations complètes de l'utilisateur
    user: {},
    // Fonction: met à jour les informations de l'utilisateur
    setUser: () => { },
    
    // État: liste des tâches assignées à l'utilisateur
    tasksByUserId: [],
    // Fonction: met à jour la liste des tâches de l'utilisateur
    setTasksByUserId: () => { },

    // ====== Permissions ======
    // État: permissions de l'utilisateur dans la famille sélectionnée { create_task: true, ... }
    permissions: {},
    // Fonction: vérifie si l'utilisateur a le droit d'effectuer une action
    // L'admin système retourne toujours true sans consulter la BDD
    can: () => false,
});

export default AuthContext;