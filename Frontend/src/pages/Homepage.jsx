import { useContext, useEffect, useState } from "react";
import { addUserToFammily, createNewFamily, createUser, getFamiliesByUserId, getTasksByUserId, getUserById, loginUser, updateUserRole, joinFamily } from "../services/service";
import { jwtDecode } from "jwt-decode";
import AuthContext from "../Contexte/AuthContext";
import axios from "axios";
import TasksCard from "../components/cards/Index";
import StatCard from "../components/ui/StatCard";
import "./Homepage.css";




function Homepage() {
    // Context global stockage des infos de connexion et de role
    const { setIsLogged, setRole, setMail, setUserId, setFamilies, setUser, setTasksByUserId } = useContext(AuthContext);

    //Utilisation du contexte global
    const { isLogged, role, mail, userId, families, user, tasksByUserId } = useContext(AuthContext);

    const [loginFlipped, setLoginFlipped] = useState(false);
    const [registerFlipped, setRegisterFlipped] = useState(false);

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
        <div className="homepage">
            {isLogged ? (
                role === "temp" ? (
                    /* ── Onboarding : créer ou rejoindre une famille ── */
                    <>
                        <div className="hero">
                            <h1>Bienvenue <span>{user?.first_name}</span> !</h1>
                            <p>Pour commencer, crée ta famille ou rejoins-en une avec un code d'invitation.</p>
                        </div>
                        <div className="onboarding-layout">
                            <button className="btn-logout" onClick={handleLogout}>Déconnexion</button>
                            <div className="onboarding-cards">
                                <div className="onboarding-card">
                                    <h3>Créer une famille</h3>
                                    <form onSubmit={handleNewFamily}>
                                        <div className="form-group">
                                            <label>Nom de la famille</label>
                                            <input value={newFamily} onChange={e => setNewFamily(e.target.value)} placeholder="Ex : Les Dupont" required />
                                        </div>
                                        <button className="btn-primary" type="submit">Créer la famille</button>
                                    </form>
                                </div>
                                <div className="onboarding-card">
                                    <h3>Rejoindre une famille</h3>
                                    <form onSubmit={handleJoinFamily}>
                                        <div className="form-group">
                                            <label>Code d'invitation</label>
                                            <input value={inviteCode} onChange={e => setInviteCode(e.target.value)} placeholder="Colle le code ici" required />
                                        </div>
                                        <button className="btn-primary" type="submit">Rejoindre</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    /* ── Dashboard homepage : membre connecté ── */
                    <div className="home-layout">
                        {/* Header */}
                        <div className="home-header">
                            <div>
                                <h1>Bonjour, <span>{user?.first_name}</span> 👋</h1>
                                <p>Voici un résumé de votre activité.</p>
                            </div>
                            <button className="btn-logout" onClick={handleLogout}>Déconnexion</button>
                        </div>

                        {/* Stats */}
                        <div className="home-stats">
                            <StatCard icon="📋" value={tasksByUserId.length} label="Tâches assignées" variant="primary" />
                            <StatCard icon="✅" value={tasksByUserId.filter(t => t.status === "validé").length} label="Validées" variant="success" />
                            <StatCard icon="⏳" value={tasksByUserId.filter(t => t.status === "en attente").length} label="En attente" variant="warning" />
                            <StatCard icon="👨‍👩‍👧" value={families.length} label={families.length > 1 ? "Familles" : "Famille"} variant="default" />
                        </div>

                        {/* Tâches */}
                        <div className="home-section">
                            <h2>Mes tâches assignées</h2>
                            {tasksByUserId.length > 0 ? (
                                <div className="home-tasks-grid">
                                    {tasksByUserId.map((task) => (
                                        <TasksCard key={task.task_id} task={task} />
                                    ))}
                                </div>
                            ) : (
                                <p className="no-tasks">Rien à faire pour l'instant ! 🎉</p>
                            )}
                        </div>
                    </div>
                )
            ) : (
                /* ── Écran de connexion / inscription ── */
                <>
                    <div className="hero">
                        <h1><span>Maison au top</span> 🏠</h1>
                        <p>Gérez les tâches ménagères en famille — attribuez, suivez et récompensez les efforts de chacun.</p>
                    </div>
                    <div className="auth-cards">

                        {/* ── Carte connexion ── */}
                        <div className="flip-card-wrapper login">
                            <div className={`flip-card-inner ${loginFlipped ? "flipped" : ""}`}>
                                {/* Face avant */}
                                <div className="flip-card-front" onClick={() => setLoginFlipped(true)}>
                                    <div className="flip-front-icon">🔑</div>
                                    <h2>Connexion</h2>
                                    <p>Accédez à votre espace famille</p>
                                    <span className="flip-hint">Cliquer pour continuer →</span>
                                </div>
                                {/* Face arrière */}
                                <div className="flip-card-back">
                                    <button className="flip-back-btn" onClick={() => setLoginFlipped(false)}>← Retour</button>
                                    <h2>Connexion</h2>
                                    <form onSubmit={handleLogin}>
                                        <div className="form-group">
                                            <label>Email</label>
                                            <input type="email" value={email} onChange={e => { setEmail(e.target.value); setLoginError(""); }} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Mot de passe</label>
                                            <input type="password" value={password} onChange={e => { setPassword(e.target.value); setLoginError(""); }} required />
                                        </div>
                                        {loginError && <p className="form-error">{loginError}</p>}
                                        <button className="btn-login" type="submit">Se connecter</button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* ── Carte inscription ── */}
                        <div className="flip-card-wrapper register">
                            <div className={`flip-card-inner ${registerFlipped ? "flipped" : ""}`}>
                                {/* Face avant */}
                                <div className="flip-card-front" onClick={() => setRegisterFlipped(true)}>
                                    <div className="flip-front-icon">🏠</div>
                                    <h2>Créer un compte</h2>
                                    <p>Rejoignez l'aventure en famille</p>
                                    <span className="flip-hint">Cliquer pour continuer →</span>
                                </div>
                                {/* Face arrière */}
                                <div className="flip-card-back">
                                    <button className="flip-back-btn" onClick={() => setRegisterFlipped(false)}>← Retour</button>
                                    <h2>Créer un compte</h2>
                                    <form onSubmit={handleRegister}>
                                        <div className="form-group">
                                            <label>Prénom</label>
                                            <input value={regFirstName} onChange={e => setRegFirstName(e.target.value)} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Nom</label>
                                            <input value={regLastName} onChange={e => setRegLastName(e.target.value)} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Email</label>
                                            <input type="email" value={regEmail} onChange={e => { setRegEmail(e.target.value); setRegisterError(""); }} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Mot de passe</label>
                                            <input type="password" value={regPassword} onChange={e => { setRegPassword(e.target.value); setRegisterError(""); }} required />
                                            <p className="form-hint">6 caractères minimum</p>
                                        </div>
                                        {registerError && <p className="form-error">{registerError}</p>}
                                        <button className="btn-register" type="submit">Créer mon compte</button>
                                    </form>
                                </div>
                            </div>
                        </div>

                    </div>
                </>
            )}
        </div>
    );
}
export default Homepage;
