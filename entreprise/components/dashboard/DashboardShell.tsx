'use client';

import { useState } from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';
import { DashboardProvider, useDashboard } from './DashboardContext';
import DashboardAuthGuard from './DashboardAuthGuard';

export default function DashboardShell({ children, user, notifications }: { children: React.ReactNode; user?: { name?: string; role?: string; avatar?: string | null }; notifications?: Array<{ label?: string; read?: boolean }> }) {
  return <DashboardAuthGuard><DashboardProvider><DashboardFrame>{children}</DashboardFrame></DashboardProvider></DashboardAuthGuard>;
}

function DashboardFrame({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false); const [mobileOpen, setMobileOpen] = useState(false); const { data } = useDashboard();
  const user = data?.user ? { name: data.user.name || [data.user.firstName, data.user.lastName].filter(Boolean).join(' '), role: data.user.role, avatar: data.user.avatar } : undefined;
  return <div className={`dashboard-shell ${collapsed ? 'sidebar-collapsed' : ''}`}><DashboardSidebar collapsed={collapsed} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} user={user} /><div className="dashboard-surface"><DashboardHeader title="Vue d’ensemble" onMenu={() => { if (window.innerWidth < 900) setMobileOpen(true); else setCollapsed((current) => !current); }} user={user} notifications={data?.notifications} /><div className="dashboard-content">{children}</div></div>{mobileOpen && <button type="button" className="dashboard-overlay" aria-label="Fermer le menu" onClick={() => setMobileOpen(false)} />}</div>;
}
