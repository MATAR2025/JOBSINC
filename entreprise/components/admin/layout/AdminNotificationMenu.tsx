'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAdminResource } from '@/lib/admin-api';

import { markAdminNotificationsRead } from '@/lib/admin-api';

type AdminNotice = { id?: string | number; title?: string; message?: string; body?: string; category?: string; link?: string | null; read?: boolean; createdAt?: string };

function dateLabel(value?: string) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function rowContent(item: AdminNotice) {
  return <>
    <span className={`admin-notification-dot ${item.read ? 'is-read' : ''}`} />
    <div><span className="admin-notification-title">{item.title || 'Notification'}</span>{item.message || item.body ? <span className="admin-notification-body">{String(item.message || item.body).slice(0, 90)}{String(item.message || item.body).length > 90 ? '…' : ''}</span> : null}</div>
    <time>{dateLabel(item.createdAt)}</time>
  </>;
}

export default function AdminNotificationMenu() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<AdminNotice[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      getAdminResource('notifications').then((result) => { if (active) { setItems((result as AdminNotice[]) || []); setLoading(false); } }).catch(() => { if (active) setLoading(false); });
    }, 0);
    return () => { active = false; window.clearTimeout(timer); };
  }, []);
  async function markAllRead() {
    try { await markAdminNotificationsRead(); setItems((current) => current.map((item) => ({ ...item, read: true }))); } catch { /* état local conservé */ }
  }
  const unread = items.filter((item) => !item.read).length;
  return <div className="admin-notification-wrap"><button className="admin-icon-button" onClick={() => setOpen((value) => !value)} aria-label={`Ouvrir les notifications${unread ? `, ${unread} non lues` : ''}`} aria-expanded={open}>○{unread > 0 ? <span className="admin-notification-badge">{unread}</span> : null}</button>{open ? <div className="admin-notification-dropdown"><strong>Notifications<small>{items.length} enregistrées</small></strong>{!loading && unread > 0 ? <button className="admin-notification-markall" onClick={() => void markAllRead()}>Tout marquer comme lu</button> : null}{loading ? <p className="admin-notification-empty">Chargement…</p> : items.length ? <div className="admin-notification-list">{items.slice(0, 8).map((item) => item.link ? <Link className="admin-notification-item admin-notification-item-link" href={item.link} key={item.id || (item as { title?: string }).title} tabIndex={0}>{rowContent(item)}</Link> : <div className="admin-notification-item" key={item.id || (item as { title?: string }).title}>{rowContent(item)}</div>)}</div> : <p className="admin-notification-empty">Aucune notification pour le moment.</p>}<Link className="admin-notification-link" href="/admin/notifications">Voir toutes les notifications</Link></div> : null}</div>;
}