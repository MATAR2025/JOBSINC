'use client';

import { useState } from 'react';
import Icon from '@/components/ui/Icon';

export default function DashboardHeader({ title, onMenu, user, notifications }: { title: string; onMenu: () => void; user?: { name?: string; avatar?: string | null }; notifications?: Array<{ label?: string; read?: boolean }> }) {
  const [open, setOpen] = useState(false); const unread = notifications?.filter((item) => !item.read).length || 0;
  return <header className="dashboard-header"><div className="dashboard-header-left"><button type="button" className="dashboard-menu-button" onClick={onMenu} aria-label="Ouvrir le menu"><span /><span /><span /></button><span>{title}</span></div><div className="dashboard-header-actions"><button type="button" className="notification-button" aria-label={`${unread} notification${unread > 1 ? 's' : ''}`} aria-expanded={open} onClick={() => setOpen(!open)}><Icon name="mail" size={18} />{unread > 0 && <b>{unread}</b>}</button>{open && <div className="notification-popover">{unread ? notifications?.filter((item) => !item.read).map((item, index) => <p key={index}>{item.label || 'Nouvelle notification'}</p>) : <p>Aucune nouvelle notification</p>}</div>}<div className="header-user"><span>{user?.name || 'Votre espace'}</span><div className="header-avatar">{user?.name?.slice(0, 1).toUpperCase() || 'E'}</div></div></div></header>;
}
