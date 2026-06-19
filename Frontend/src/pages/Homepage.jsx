import { useContext, useEffect, useState } from "react";
import { addUserToFammily, createNewFamily, createUser, getAllTasks, getFamiliesByOwnerId, getFamiliesByOwnerIdAndName, getFamiliesByUserId, getTasksByUserId, getUserById, loginUser, updateUserRole, joinFamily } from "../services/service";
import { jwtDecode } from "jwt-decode";
import AuthContext from "../Contexte/AuthContext";
import axios from "axios";
import TasksCard from "../components/cards/Index";




function Homepage() {
    // Context global stockage des infos de connexion et de role
    const { setIsLogged, setRole, setMail, setUserId, setFamilies, setUser, setTasksByUserId } = useContext(AuthContext);

    //Utilisation du contexte global
    const { isLogged, role, mail, userId, families, user, tasksByUserId } = useContext(AuthContext);


    // Login state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const login = {
        email: email,
        password: password
    };

    // Register state
    const [regEmail, setRegEmail] = useState("");
    const [regPassword, setRegPassword] = useState("");
    const [regFirstName, setRegFirstName] = useState("");
    const [regLastName, setRegLastName] = useState("");
    const [registerError, setRegisterError] = useState("");
    const register = {
        email: regEmail,
        password: regPassword,
        first_name: regFirstName,
        last_name: regLastName
    }




    // Gestion des connexions
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError("");
        try {
            const response = await loginUser(login);
            localStorage.setItem('token', response.data.token);
            axios.defaults.headers.Authorization = "Bearer " + response.data.token;
            const decodedToken = jwtDecode(response.data.token);
            setIsLogged(true);
            setRole(decodedToken.role);
            setUserId(decodedToken.user_id);
            setMail(decodedToken.email);
        } catch (error) {
            const status = error.response?.status;
            if (status === 401 || status === 403) {
                setLoginError("Email ou mot de passe incorrect.");
            } else {
                setLoginError("Une erreur est survenue, veuillez réessayer.");
            }
        }
    }



    // Gestion des inscriptions
    const handleRegister = async (e) => {
        e.preventDefault();
        setRegisterError("");

        if (regFirstName.trim().length < 2) {
            setRegisterError("Le prénom doit contenir au moins 2 caractères.");
            return;
        }
        if (regLastName.trim().length < 2) {
            setRegisterError("Le nom doit contenir au moins 2 caractères.");
            return;
        }
        if (regPassword.length < 6) {
            setRegisterError("Le mot de passe doit contenir au moins 6 caractères.");
            return;
        }

        try {
            await createUser(register);
            // Connexion automatique → redirige vers l'écran famille (role "temp")
            const response = await loginUser({ email: regEmail, password: regPassword });
            localStorage.setItem('token', response.data.token);
            axios.defaults.headers.Authorization = "Bearer " + response.data.token;
            const decodedToken = jwtDecode(response.data.token);
            setIsLogged(true);
            setRole(decodedToken.role);
            setUserId(decodedToken.user_id);
            setMail(decodedToken.email);
        } catch (error) {
            const status = error.response?.status;
            if (status === 409) {
                setRegisterError("Cette adresse email est déjà utilisée.");
            } else if (status === 400) {
                setRegisterError("Informations invalides, vérifiez les champs.");
            } else {
                setRegisterError("Une erreur est survenue, veuillez réessayer.");
            }
        }
    };

    // vérification de l'appartenance à une famille via l'ID dans le token 
    const fetchFamiliesUsers = async () => {
        try {
            const response = await getFamiliesByUserId(userId)
            setFamilies(response.data)
            console.log("famille trouvée :", response.data);

        } catch (error) {
            console.error(error)
        }
    }

    // Récupération des infos du USER connecté via l'ID dans le token 
    const fetchUserById = async () => {
        try {
            const response = await getUserById(userId);
            console.log("user connecté :", response.data);
            setUser(response.data[0]);
        } catch (error) {
            console.error(error);
        }
    }

    // recupération de la liste des tâches du USER connecté via l'ID dans le token
    const fetchTasksById = async () => {
        try {
            const response = await getTasksByUserId(userId);
            console.log("tâche du user :", response.data);
            setTasksByUserId(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    // Creation nouvelle famille 
    const [newFamily, setNewFamily] = useState("");
    const handleNewFamily = async (e) => {
        console.log("handleNewFamily appelé");
        e.preventDefault();

        console.log("newFamily:", newFamily);
        console.log("userId:", userId);

        if (!newFamily) {
            alert("Veuillez remplir tous les champs");
            return;
        }

        const registerFamily = {
            name: newFamily,
            owner_user_id: userId
        }

        try {
            const response = await createNewFamily(registerFamily);
            const familyId = response.data.family_id;
            await addUserToFammily({ user_id: userId, family_id: familyId, role: 1 });
            await updateUserRole(userId, { role_id: 5 })

            const newTokenResponse = await loginUser({ email, password }); // re-login
            localStorage.setItem('token', newTokenResponse.data.token);
            const decodedToken = jwtDecode(newTokenResponse.data.token);
            setRole(decodedToken.role);
            alert('Famille créée avec succès !');
        } catch (error) {
            console.error("Erreur:", error);
            alert("Erreur : " + error.message);
        }
    }

    // Rejoindre une famille
    const [inviteCode, setInviteCode] = useState("");

    const handleJoinFamily = async (e) => {
        e.preventDefault();
        try {
            await joinFamily({ invite_code: inviteCode, user_id: userId });
            alert("Demande envoyée ! En attente de validation par l'admin.");
            setInviteCode("");
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.error || "Code invalide ou expiré");
        }
    }

    //Déconnexion 
    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLogged(false);
        setUserId("");
        setMail("");
        setRole("");
        setUser("");
        setFamilies([]);
        setTasksByUserId([]);
    }

    useEffect(() => {
        if (!isLogged || !userId) return;
        fetchUserById(userId)
        fetchFamiliesUsers(userId);
        fetchTasksById(userId)
    }, [isLogged, userId]);

    return (
        <>
            <h1>Bienvenue sur Maison au top !</h1>
            <p>Votre application de gestion de tâches ménagères pour une maison organisée et harmonieuse.</p>
            <p>Gérez facilement les tâches, attribuez-les à vos proches, suivez les progrès et récompensez les efforts pour une maison au top !</p>
            {mail}
            <hr />

            {isLogged ? (
                role === "temp" ? (
                    <>
                        <h1>Bienvenue {user?.first_name} !</h1>
                        <button onClick={handleLogout}>Deconnexion</button>
                        <section>
                            <h3>creer une famille</h3>

                            <form onSubmit={handleNewFamily}>
                                <div>
                                    <label>
                                        Nom de la famille:
                                        <input value={newFamily} onChange={e => setNewFamily(e.target.value)} required />
                                    </label>
                                </div>
                                <div>
                                    <button type="submit">Créer la famille</button>
                                </div>
                            </form>

                            <h3>Rejoindre une famille</h3>
                            <form onSubmit={handleJoinFamily}>
                                <div>
                                    <label>
                                        Entrer le code d'invitation :
                                        <input
                                            value={inviteCode}
                                            onChange={e => setInviteCode(e.target.value)}
                                            required
                                        />
                                    </label>
                                </div>
                                <div>
                                    <button type="submit">Rejoindre la famille</button>
                                </div>
                            </form>
                        </section>
                    </>) : (
                    <>
                        <h1>Bienvenue {user?.first_name} !</h1>
                        <button onClick={handleLogout}>Deconnexion</button>

                        <section>
                            <h2>Mes infos</h2>

                            <div>Famille(s) :
                                {families.length > 0 ? (
                                    <ul>
                                        {families.map((family) => (
                                            <li key={family.family_id}>
                                                {family.name}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>Aucune famille trouvée.</p>
                                )}
                            </div>

                            <div>
                                {tasksByUserId.length > 0 ? (
                                    <>
                                        <p>Mes taches attribuées :</p>
                                        {tasksByUserId.map((task) => (
                                            <TasksCard
                                                key={task.task_id}
                                                task={task}
                                            />
                                        ))}
                                    </>
                                ) : (
                                    <p>Rien à faire !</p>
                                )}
                            </div>
                        </section>
                    </>
                )) : (
                <>
                    <section>
                        <h2>Connexion</h2>
                        <form onSubmit={handleLogin}>
                            <div>
                                <label>
                                    Email:
                                    <input type="email" value={email} onChange={e => { setEmail(e.target.value); setLoginError(""); }} required />
                                </label>
                            </div>
                            <div>
                                <label>
                                    Mot de passe:
                                    <input type="password" value={password} onChange={e => { setPassword(e.target.value); setLoginError(""); }} required />
                                </label>
                            </div>
                            {loginError && <p style={{ color: "red", margin: "4px 0" }}>{loginError}</p>}
                            <div>
                                <button type="submit">Se connecter</button>
                            </div>
                        </form>
                    </section>

                    <hr />

                    <section>
                        <h2>Inscription</h2>
                        <form onSubmit={handleRegister}>
                            <div>
                                <label>
                                    Email:
                                    <input type="email" value={regEmail} onChange={e => { setRegEmail(e.target.value); setRegisterError(""); }} required />
                                </label>
                            </div>
                            <div>
                                <label>
                                    Mot de passe:
                                    <input type="password" value={regPassword} onChange={e => { setRegPassword(e.target.value); setRegisterError(""); }} required />
                                </label>
                                <small style={{ color: "#888" }}>6 caractères minimum</small>
                            </div>
                            <div>
                                <label>
                                    Prénom:
                                    <input value={regFirstName} onChange={e => setRegFirstName(e.target.value)} required />
                                </label>
                            </div>
                            <div>
                                <label>
                                    Nom:
                                    <input value={regLastName} onChange={e => setRegLastName(e.target.value)} required />
                                </label>
                            </div>
                            {registerError && <p style={{ color: "red", margin: "4px 0" }}>{registerError}</p>}
                            <div>
                                <button type="submit">S'inscrire</button>
                            </div>
                        </form>
                    </section>
                </>)
            }
        </>
    );
}
export default Homepage;
