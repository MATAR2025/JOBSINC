import AdminButton from './AdminButton';

export default function AdminEmptyState({ title, description, action }: { title: string; description?: string; action?: { label: string; onClick: () => void } }) {
  return <div className="admin-empty-state admin-empty-state-box"><div className="admin-empty-icon">○</div><strong>{title}</strong>{description ? <p>{description}</p> : null}{action ? <AdminButton variant="secondary" onClick={action.onClick}>{action.label}</AdminButton> : null}</div>;
}
