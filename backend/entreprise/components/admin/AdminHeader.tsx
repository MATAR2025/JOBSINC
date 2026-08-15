'use client';

import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/Icon';
import { AdminUser } from '@/lib/admin-api';
import AdminGlobalSearch from './layout/AdminGlobalSearch';
import AdminNotificationMenu from './layout/AdminNotificationMenu';
import AdminUserMenu from './layout/AdminUserMenu';

const titles: Record<string, string> = { '/admin': 'Vue d’ensemble', '/admin/users': 'Tous les utilisateurs', '/admin/candidates': 'Candidats', '/admin/employees': 'Employés', '/admin/companies': 'Entreprises / recruteurs', '/admin/administrators': 'Administrateurs', '/admin/jobs': 'Offres', '/admin/applications': 'Candidatures', '/admin/interviews': 'Entretiens', '/admin/recruitments': 'Recrutements', '/admin/reports': 'Signalements', '/admin/moderation': 'Modération', '/admin/analytics': 'Statistiques', '/admin/activity': 'Activité', '/admin/notifications': 'Notifications', '/admin/security': 'Sécurité', '/admin/system': 'Santé du système', '/admin/settings': 'Paramètres' };

export default function AdminHeader({ user, onMenu, onLogout }: { user: AdminUser; onMenu: () => void; onLogout: () => void }) {
  const pathname = usePathname();
  return <header className="admin-header"><div className="admin-header-title"><button className="admin-menu-button" onClick={onMenu} aria-label="Ouvrir la navigation"><Icon name="grid" size={20} /></button><div><span>Administration JOBSINC</span><h1>{titles[pathname] || 'Administration'}</h1></div></div><div className="admin-header-actions"><AdminGlobalSearch /><AdminNotificationMenu /><AdminUserMenu user={user} onLogout={onLogout} /></div></header>;
}
