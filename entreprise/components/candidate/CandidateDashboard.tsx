'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Icon from '@/components/ui/Icon';
import logo from '@/components/layout/logo.png';
import { candidateAssetUrl, CandidateNotification, clearSession, getNotifications, getSessionUser, markAllNotificationsRead, markNotificationRead } from '@/lib/candidate-api';

type CandidateNavIcon = 'grid' | 'briefcase' | 'users' | 'mail' | 'pin';
const navItems: Array<[string, string, CandidateNavIcon]> = [
  ['Vue d’ensemble', '/espace-candidat', 'grid'],
  ['Offres d’emploi', '/offres', 'briefcase'],
  ['Mes candidatures', '/mes-candidatures', 'users'],
  ['Messages', '/mes-messages', 'mail'],
  ['Mon profil', '/mon-profil', 'pin'],
];

export default function CandidateDashboard({ title, children }: { title: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<CandidateNotification[]>([]);
  const [bellOpen, setBellOpen] = useState(false);

  const refreshNotifications = () => getNotifications().then((result) => setNotifications(result.data)).catch(() => {});

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    refreshNotifications();
    return () => cancelAnimationFrame(id);
  }, []);

  const user = mounted ? getSessionUser() : null;
  const displayName = user?.candidate ? `${user.candidate.firstName} ${user.candidate.lastName}`.trim() : user?.email || '';
  const avatarUrl = user?.candidate?.avatarUrl ? candidateAssetUrl(user.candidate.avatarUrl) : null;
  const unread = notifications.filter((item) => !item.read).length;

  function logout() { clearSession(); window.location.assign('/'); }
  function markRead(id: string) { markNotificationRead(id).then(refreshNotifications).catch(() => {}); }
  function markAll() { markAllNotificationsRead().then(refreshNotifications).catch(() => {}); }
  function toggleMenu() { if (window.innerWidth < 900) setMobileOpen(true); else setCollapsed((current) => !current); }

  return (
    <div className={`dashboard-shell ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <aside className={`dashboard-sidebar ${collapsed ? 'is-collapsed' : ''} ${mobileOpen ? 'is-mobile-open' : ''}`}>
        <div className="dashboard-brand">
          <Link href="/espace-candidat" aria-label="JOBSINC accueil"><Image className="dashboard-brand-logo" src={logo} alt="JOBSINC" width={34} height={34} priority />{!collapsed && <span>JOB<span>SINC</span></span>}</Link>
          <button type="button" className="sidebar-close" onClick={() => setMobileOpen(false)} aria-label="Fermer le menu">×</button>
        </div>
        <nav className="dashboard-nav" aria-label="Espace candidat">
          <div className="dashboard-nav-group">
            <span className="dashboard-nav-label">{!collapsed && 'Navigation'}</span>
            {navItems.map(([label, href, icon]) => {
              const active = pathname === href || (href !== '/espace-candidat' && pathname.startsWith(`${href}/`));
              return <Link key={href} href={href} className={`dashboard-nav-link ${active ? 'active' : ''}`} onClick={() => setMobileOpen(false)} title={collapsed ? label : undefined} aria-current={active ? 'page' : undefined}><Icon name={icon} size={18} />{!collapsed && <span>{label}</span>}</Link>;
            })}
          </div>
        </nav>
        <div className="dashboard-user">
          <div className="dashboard-avatar">{avatarUrl ? <Image src={avatarUrl} alt={displayName} width={34} height={34} unoptimized /> : (displayName.slice(0, 1).toUpperCase() || 'C')}</div>
          {!collapsed && <div className="dashboard-user-copy"><strong>{displayName || 'Candidat'}</strong><span>Candidat</span></div>}
          {!collapsed && <button type="button" className="dashboard-logout" onClick={logout} aria-label="Se déconnecter">↗</button>}
        </div>
      </aside>
      <div className="dashboard-surface">
        <header className="dashboard-header">
          <div className="dashboard-header-left">
            <button type="button" className="dashboard-menu-button" onClick={toggleMenu} aria-label="Ouvrir le menu"><span /><span /><span /></button>
            <span>{title}</span>
          </div>
          <div className="dashboard-header-actions">
            <button type="button" className="notification-button" aria-label={`${unread} notification${unread > 1 ? 's' : ''}`} aria-expanded={bellOpen} onClick={() => setBellOpen((open) => !open)}><Icon name="mail" size={18} />{unread > 0 && <b>{unread}</b>}</button>
            {bellOpen && (
              <div className="notification-popover">
                {unread > 0 ? notifications.filter((item) => !item.read).slice(0, 6).map((item) => (
                  <Link href={item.link || '/mes-messages'} key={item.id} onClick={() => markRead(item.id)}><strong>{item.title}</strong>{item.body && <span>{item.body}</span>}</Link>
                )) : <p>Aucune nouvelle notification</p>}
                <div className="notification-popover-footer">
                  {unread > 0 && <button type="button" onClick={markAll}>Tout marquer comme lu</button>}
                  <Link href="/mes-messages">Voir tous les messages</Link>
                </div>
              </div>
            )}
            <div className="header-user"><span>{displayName || 'Votre espace'}</span><div className="header-avatar">{displayName.slice(0, 1).toUpperCase() || 'C'}</div></div>
          </div>
        </header>
        <div className="dashboard-content">{children}</div>
      </div>
      {mobileOpen && <button type="button" className="dashboard-overlay" aria-label="Fermer le menu" onClick={() => setMobileOpen(false)} />}
    </div>
  );
}