export function AdminSkeleton({ className = '' }: { className?: string }) { return <span className={`admin-skeleton ${className}`} aria-hidden="true" />; }
export function AdminSpinner() { return <span className="admin-spinner" role="status" aria-label="Chargement" />; }
export function AdminCardSkeleton() { return <div className="admin-card admin-card-skeleton"><AdminSkeleton /><AdminSkeleton className="is-short" /></div>; }
export function AdminTableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) { return <div className="admin-table-skeleton-grid">{Array.from({ length: rows }).map((_, row) => <div key={row}>{Array.from({ length: columns }).map((__, column) => <AdminSkeleton key={column} />)}</div>)}</div>; }
