'use client';

import { useEffect, useRef } from 'react';

export default function AdminModal({ open, title, children, footer, onClose }: { open: boolean; title: string; children: React.ReactNode; footer?: React.ReactNode; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (!open) return; closeRef.current?.focus(); function escape(event: KeyboardEvent) { if (event.key === 'Escape') onClose(); } document.addEventListener('keydown', escape); return () => document.removeEventListener('keydown', escape); }, [open, onClose]);
  if (!open) return null;
  return <div className="admin-modal-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title"><div className="admin-modal-heading"><h2 id="admin-modal-title">{title}</h2><button ref={closeRef} onClick={onClose} aria-label="Fermer">×</button></div><div className="admin-modal-body">{children}</div>{footer ? <footer>{footer}</footer> : null}</section></div>;
}
