export default function AdminBadge({ children, variant = 'neutral' }: { children: React.ReactNode; variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' }) {
  return <span className={`admin-badge admin-badge-${variant}`}>{children}</span>;
}
