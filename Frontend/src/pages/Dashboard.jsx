import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";

function Dashboard() {
    return (
        <div style={{ padding: "32px 36px" }}>
            <PageHeader title="Tableau de bord" subtitle="Vue d'ensemble de l'activité familiale" />
            <div style={{ background: "var(--surface)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", border: "1.5px solid var(--border)" }}>
                <EmptyState
                    icon="📊"
                    title="Bientôt disponible"
                    description="Le tableau de bord avec graphiques, statistiques et classements arrive dans une prochaine version."
                />
            </div>
        </div>
    );
}
export default Dashboard;
