import logo from "../../assets/logo+titre-remove.png";
import "./Index.css";
import { NavLink } from "react-router-dom";
import AuthContext from "../../Contexte/AuthContext";
import { useContext } from "react";
import Avatar from "../ui/Avatar";

const NAV_LINKS = [
    { to: "/",         icon: "🏠", label: "Accueil" },
    { to: "/tasks",    icon: "📋", label: "Tâches" },
    { to: "/members",  icon: "👥", label: "Membres" },
    { to: "/planning", icon: "🗓️", label: "Planning" },
    { to: "/dashboard",icon: "📊", label: "Tableau de bord" },
    { to: "/rewards",  icon: "🏆", label: "Récompenses" },
];

function Navbar() {
    const { isLogged, role, mail, families, selectedFamily, setSelectedFamily, user } = useContext(AuthContext);

    return (
        <aside className="sidebar">

            {/* ── Branding ── */}
            <div className="sidebar-header">
                <div className="sidebar-brand">
                    <img src={logo} alt="Logo" className="sidebar-logo" />
                    <div>
                        <div className="sidebar-brand-name">Maison <span>au top</span></div>
                    </div>
                </div>
            </div>

            {/* ── User info ── */}
            {isLogged && (
                <div className="sidebar-user-block">
                    <Avatar
                        firstName={user?.first_name ?? mail?.split("@")[0] ?? ""}
                        lastName={user?.last_name ?? ""}
                        size="md"
                    />
                    <div className="sidebar-user-info">
                        <span className="sidebar-user-name">
                            {user?.first_name ? `${user.first_name} ${user.last_name ?? ""}` : mail}
                        </span>
                        <span className="sidebar-user-mail">{mail}</span>
                        {role && <span className="sidebar-role-badge">{role}</span>}
                    </div>
                </div>
            )}

            {/* ── Famille ── */}
            {isLogged && families.length > 0 && (
                <div className="sidebar-family">
                    <p className="sidebar-family-label">Famille active</p>
                    {families.length > 1 ? (
                        <select
                            value={selectedFamily?.family_id ?? ""}
                            onChange={e => setSelectedFamily(families.find(f => f.family_id === parseInt(e.target.value)))}
                        >
                            {families.map(f => (
                                <option key={f.family_id} value={f.family_id}>{f.name}</option>
                            ))}
                        </select>
                    ) : (
                        <div className="sidebar-family-name">{families[0].name}</div>
                    )}
                </div>
            )}

            {/* ── Navigation ── */}
            <nav className="sidebar-nav">
                <span className="nav-section-label">Navigation</span>
                {NAV_LINKS.map(({ to, icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === "/"}
                        className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                    >
                        <span className="nav-link-icon">{icon}</span>
                        <span className="nav-link-label">{label}</span>
                    </NavLink>
                ))}

                <span className="nav-section-label" style={{ marginTop: "8px" }}>Compte</span>
                <NavLink to="/settings" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
                    <span className="nav-link-icon">⚙️</span>
                    <span className="nav-link-label">Paramètres</span>
                </NavLink>
            </nav>

            {/* ── Footer ── */}
            <div className="sidebar-footer">
                <p className="sidebar-footer-text">© 2026 Maison au top</p>
            </div>

        </aside>
    );
}

export default Navbar;
