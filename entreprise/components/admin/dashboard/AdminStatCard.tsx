import Icon from '@/components/ui/Icon';
import { AdminCardSkeleton } from '../ui/AdminSkeleton';

export default function AdminStatCard({ value, label, icon = 'chart', trend, trendDirection = 'neutral', description, loading = false }: { value?: React.ReactNode; label: string; icon?: 'grid' | 'users' | 'briefcase' | 'mail' | 'chart' | 'target' | 'lock' | 'spark'; trend?: string; trendDirection?: 'up' | 'down' | 'neutral'; description?: string; loading?: boolean }) {
  if (loading) return <AdminCardSkeleton />;
  return <article className="admin-card admin-stat-card admin-stat-card-reusable"><span className="admin-stat-icon"><Icon name={icon} size={17} /></span><span>{label}</span><strong>{value ?? '--'}</strong>{trend ? <small className={`admin-stat-trend is-${trendDirection}`}>{trend}</small> : null}{description ? <small>{description}</small> : null}</article>;
}
