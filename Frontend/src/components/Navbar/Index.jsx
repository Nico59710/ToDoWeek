import logo from "../../assets/logo+titre-remove.png";
import "./Index.css"
import { NavLink } from "react-router-dom";
import AuthContext from "../../Contexte/AuthContext";
import { useContext, useEffect, useState } from "react";
import { getFamiliesByUserId } from "../../services/service";



function Navbar() {
    const { isLogged, role, mail, userId, families, selectedFamily, setSelectedFamily } = useContext(AuthContext);


    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <img src={logo} alt="Logo" className="logo" />

                <h2>Maison au top</h2>
                <p>                    {mail}                </p>
                <p>                    {role}                </p>
                {families.length > 1 ? (
                    <select
                        value={selectedFamily?.family_id || ""}
                        onChange={e => setSelectedFamily(families.find(f => f.family_id === parseInt(e.target.value)))}
                    >
                        {families.map((family) => (
                            <option key={family.family_id} value={family.family_id}>
                                {family.name}
                            </option>
                        ))}
                    </select>
                ) : families.length === 1 ? (
                    <p>{families[0].name}</p>
                ) : null}
            </div>

            <nav>
                <div className="nav-links">
                    <NavLink to="/" className={({ isActive }) => isActive ? "active" : "nav-links"}
                    >
                        🏠 Accueil
                    </NavLink>

                    <NavLink to="/tasks" className={({ isActive }) => isActive ? "active" : "nav-links"}
                    >
                        📋 Tâches
                    </NavLink>

                    <NavLink to="/members" className={({ isActive }) => isActive ? "active" : "nav-links"}>
                        👥 Membres
                    </NavLink>

                    <NavLink to="/settings" className={({ isActive }) => isActive ? "active" : "nav-links"}>
                        ⚙️ Paramètres
                    </NavLink>

                    <NavLink to="/planning" className={({ isActive }) => isActive ? "active" : "nav-links"}>
                        🗓️ Planning
                    </NavLink>

                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : "nav-links"}>
                        📊 Tableau de bord
                    </NavLink>

                    <NavLink to="/rewards" className={({ isActive }) => isActive ? "active" : "nav-links"}>
                        🏆 Récompenses
                    </NavLink>
                </div>
            </nav>

            <div className="sidebar-footer">
                <h1>FOOTER à completer</h1>
                <ul className="footer-links">
                    <li>
                        <a href="/help">❓ Aide</a>
                    </li>
                    <li>
                        <a href="/contact">📞 Contact</a>
                    </li>
                    <li>
                        <a href="/terms">📜 Conditions d'utilisation</a>
                    </li>
                    <li>
                        <a href="/privacy">🔒 Politique de confidentialité</a>
                    </li>
                </ul>
            </div>
        </aside>
    );
}

export default Navbar;