import AdminButton from './AdminButton';

export default function AdminErrorState({ title = 'Impossible de charger les données.', description = 'Une erreur est survenue. Réessayez dans quelques instants.', onRetry, onBack }: { title?: string; description?: string; onRetry?: () => void; onBack?: () => void }) {
  return <div className="admin-error-state"><div className="admin-error-icon">!</div><strong>{title}</strong><p>{description}</p><div>{onRetry ? <AdminButton onClick={onRetry}>Réessayer</AdminButton> : null}{onBack ? <AdminButton variant="ghost" onClick={onBack}>Retour</AdminButton> : null}</div></div>;
}
