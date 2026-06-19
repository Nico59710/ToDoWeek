import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";

function Planning() {
    return (
        <div style={{ padding: "32px 36px" }}>
            <PageHeader title="Planning" subtitle="Calendrier des tâches récurrentes" />
            <div style={{ background: "var(--surface)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", border: "1.5px solid var(--border)" }}>
                <EmptyState
                    icon="🗓️"
                    title="Bientôt disponible"
                    description="La vue planning avec calendrier hebdomadaire et récurrences arrive dans une prochaine version."
                />
            </div>
        </div>
    );
}
export default Planning;
