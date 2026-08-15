export default function AdminPagination({ page, totalPages, totalItems, onPageChange }: { page: number; totalPages: number; totalItems?: number; onPageChange: (page: number) => void }) {
  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, index) => index + 1);
  return <div className="admin-pagination"><span>{totalItems ?? 0} résultat{totalItems === 1 ? '' : 's'}</span><div><button disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Précédent</button>{pages.map((item) => <button className={page === item ? 'is-current' : ''} key={item} onClick={() => onPageChange(item)}>{item}</button>)}<button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>Suivant</button></div></div>;
}
