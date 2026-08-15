'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AdminUser, getAdminUserLabel } from '@/lib/admin-api';
export default function AdminUserMenu({ user, onLogout }: { user: AdminUser; onLogout: () => void }) { const [open, setOpen] = useState(false); return <div className="admin-user-menu"><button className="admin-user-trigger" onClick={() => setOpen((value) => !value)} aria-expanded={open}><span className="admin-header-avatar">{getAdminUserLabel(user).slice(0, 1).toUpperCase()}</span><span>{getAdminUserLabel(user)}</span><b>⌄</b></button>{open ? <div className="admin-user-dropdown"><strong>{getAdminUserLabel(user)}</strong><small>{user.role || 'Administrateur'}</small><Link href="/admin/settings">Paramètres</Link><button onClick={onLogout}>Déconnexion</button></div> : null}</div>; }
