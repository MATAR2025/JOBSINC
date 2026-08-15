'use client';

import AdminEmptyState from '../ui/AdminEmptyState';
import AdminErrorState from '../ui/AdminErrorState';
import { AdminTableSkeleton } from '../ui/AdminSkeleton';

export type AdminColumn<T> = { key: string; label: string; render?: (row: T) => React.ReactNode };
export default function AdminDataTable<T extends { id?: string | number }>({ columns, rows, loading, error, emptyTitle = 'Aucun résultat trouvé.', onRetry, onRowClick }: { columns: AdminColumn<T>[]; rows: T[]; loading?: boolean; error?: boolean; emptyTitle?: string; onRetry?: () => void; onRowClick?: (row: T) => void }) {
  if (loading) return <div className="admin-card admin-table-wrap"><AdminTableSkeleton columns={columns.length} /></div>;
  if (error) return <div className="admin-card"><AdminErrorState onRetry={onRetry} /></div>;
  if (!rows.length) return <div className="admin-card"><AdminEmptyState title={emptyTitle} description="Les données apparaîtront lorsqu’elles seront fournies par l’API." /></div>;
  return <div className="admin-card admin-table-wrap"><table className="admin-table"><thead><tr>{columns.map((column) => <th key={column.key}>{column.label}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={row.id || index} onClick={() => onRowClick?.(row)}>{columns.map((column) => <td key={column.key}>{column.render ? column.render(row) : String((row as Record<string, unknown>)[column.key] ?? '—')}</td>)}</tr>)}</tbody></table></div>;
}
