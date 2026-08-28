'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Icon from '@/components/ui/Icon';
import { getCompanyNotifications, markAllCompanyNotificationsRead, markCompanyNotificationRead } from '@/lib/api';

type BellItem = { id?: string | number; label?: string; body?: string | null; link?: string | null; read?: boolean };

export default function DashboardHeader({ title, onMenu, user, notifications }: { title: string; onMenu: () => void; user?: { name?: string; avatar?: string | null }; notifications?: Array<{ label?: string; read?: boolean }> }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<BellItem[]>(() => (notifications || []).map((item) => ({ label: item.label, read: item.read })));
  const unread = items.filter((item) => !item.read).length;

  const refresh = () => getCompanyNotifications().then((result) => setItems(result.data.map((item) => ({ id: item.id, label: item.title, body: item.body, link: item.link, read: item.read })))).catch(() => {});

  useEffect(() => { refresh(); }, []);

  function markRead(id?: string | number) { if (id == null) return; markCompanyNotificationRead(id).then(refresh).catch(() => {}); }
  function markAll() { markAllCompanyNotificationsRead().then(refresh).catch(() => {}); }
  function toggle() { setOpen((current) => !current); }

  return <header className="dashboard-header"><div className="dashboard-header-left"><button type="button" className="dashboard-menu-button" onClick={onMenu} aria-label="Ouvrir le menu"><span /><span /><span /></button><span>{title}</span></div><div className="dashboard-header-actions"><button type="button" className="notification-button" aria-label={`${unread} notification${unread > 1 ? 's' : ''}`} aria-expanded={open} onClick={toggle}><Icon name="mail" size={18} />{unread > 0 && <b>{unread}</b>}</button>{open && <div className="notification-popover">{unread > 0 ? items.filter((item) => !item.read).slice(0, 6).map((item) => <Link href={item.link || '/dashboard'} key={item.id ?? item.label} onClick={() => markRead(item.id)}><strong>{item.label || 'Nouvelle notification'}</strong>{item.body && <span>{item.body}</span>}</Link>) : <p>Aucune nouvelle notification</p>}<div className="notification-popover-footer">{unread > 0 && <button type="button" onClick={markAll}>Tout marquer comme lu</button>}<Link href="/dashboard/applications">Voir les candidatures</Link></div></div>}<div className="header-user"><span>{user?.name || 'Votre espace'}</span><div className="header-avatar">{user?.name?.slice(0, 1).toUpperCase() || 'E'}</div></div></div></header>;
}