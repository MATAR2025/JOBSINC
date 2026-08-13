'use client';

export default function AdminDrawer({ open, title, children, onClose }: { open: boolean; title: string; children: React.ReactNode; onClose: () => void }) {
  if (!open) return null;
  return <div className="admin-drawer-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><aside className="admin-drawer" role="dialog" aria-modal="true" aria-labelledby="admin-drawer-title"><div><h2 id="admin-drawer-title">{title}</h2><button onClick={onClose} aria-label="Fermer">×</button></div>{children}</aside></div>;
}
