import "./StatCard.css";

function StatCard({ icon, value, label, variant = "default" }) {
    return (
        <div className={`stat-card stat-card--${variant}`}>
            <div className="stat-card-icon">{icon}</div>
            <div className="stat-card-content">
                <div className="stat-card-value">{value}</div>
                <div className="stat-card-label">{label}</div>
            </div>
        </div>
    );
}

export default StatCard;
