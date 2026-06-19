import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";

function Rewards() {
    return (
        <div style={{ padding: "32px 36px" }}>
            <PageHeader title="Récompenses" subtitle="Système de points et récompenses" />
            <div style={{ background: "var(--surface)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", border: "1.5px solid var(--border)" }}>
                <EmptyState
                    icon="🏆"
                    title="Bientôt disponible"
                    description="Le système de récompenses avec cadeaux, badges et classement familial arrive dans une prochaine version."
                />
            </div>
        </div>
    );
}
export default Rewards;
