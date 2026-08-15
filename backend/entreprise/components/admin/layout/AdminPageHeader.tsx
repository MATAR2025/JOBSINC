import AdminBreadcrumbs from './AdminBreadcrumbs';

export default function AdminPageHeader({ title, description, actions, badge }: { title: string; description?: string; actions?: React.ReactNode; badge?: React.ReactNode }) {
  return <div className="admin-page-header"><div><AdminBreadcrumbs /><div className="admin-page-header-title"><h2>{title}</h2>{badge}</div>{description ? <p>{description}</p> : null}</div>{actions ? <div className="admin-page-header-actions">{actions}</div> : null}</div>;
}
