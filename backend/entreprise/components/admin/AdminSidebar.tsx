'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import logo from '@/components/layout/logo.png';
import Icon from '@/components/ui/Icon';
import { AdminUser, getAdminUserLabel } from '@/lib/admin-api';
import { adminNavigation } from './admin-navigation';


export default function AdminSidebar({ user, collapsed, mobileOpen, onClose, onToggle, onLogout }: { user: AdminUser; collapsed: boolean; mobileOpen: boolean; onClose: () => void; onToggle: () => void; onLogout: () => void }) {
  const pathname = usePathname();
  return <aside className={`admin-sidebar ${collapsed ? 'is-collapsed' : ''} ${mobileOpen ? 'is-mobile-open' : ''}`}>
    <div className="admin-brand"><Link href="/admin" onClick={onClose}><Image src={logo} alt="JOBSINC" width={136} height={42} priority /></Link><button className="admin-sidebar-toggle" onClick={onToggle} aria-label={collapsed ? 'Développer la navigation' : 'Réduire la navigation'}>{collapsed ? '›' : '‹'}</button></div>
    <nav className="admin-nav" aria-label="Navigation administration">
      {adminNavigation.map((group) => <div className="admin-nav-group" key={group.label}><p className="admin-nav-label">{group.label}</p>{group.items.map((item) => { const active = item.href === '/admin' ? pathname === item.href : pathname.startsWith(item.href); return <Link key={item.href} href={item.href} onClick={onClose} className={`admin-nav-item ${active ? 'is-active' : ''}`} aria-current={active ? 'page' : undefined} title={collapsed ? item.label : undefined}><Icon name={item.icon} size={18} /><span>{item.label}</span></Link>; })}</div>)}
    </nav>
    <div className="admin-user-card"><div className="admin-avatar">{getAdminUserLabel(user).slice(0, 1).toUpperCase()}</div><div className="admin-user-copy"><strong>{getAdminUserLabel(user)}</strong><span>{user.role || 'Administrateur'}</span></div><button onClick={onLogout} aria-label="Se déconnecter" title="Se déconnecter">↗</button></div>
  </aside>;
}
