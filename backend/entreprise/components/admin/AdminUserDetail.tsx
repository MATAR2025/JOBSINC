'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AdminUserRecord, getAdminUser } from '@/lib/admin-api';

export default function AdminUserDetail({ id }: { id: string }) {
  const [user, setUser] = useState<AdminUserRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => { let active = true; getAdminUser(id).then((result) => { if (active) setUser(result); }).catch(() => { if (active) setError(true); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [id]);
  if (loading) return <div className="admin-detail-loading">Chargement du profil utilisateur…</div>;
  if (error || !user) return <section className="admin-placeholder"><p className="admin-kicker">Utilisateur</p><h2>Profil indisponible</h2><p>Le détail nécessite un endpoint Admin utilisateur configuré et accessible.</p><Link className="admin-button admin-button-secondary" href="/admin/users">Retour aux utilisateurs</Link></section>;
  return <section className="admin-user-detail"><Link className="admin-back-link" href="/admin/users">← Tous les utilisateurs</Link><div className="admin-detail-heading"><div className="admin-detail-avatar">{String(user.name || user.firstName || user.email || '?').slice(0, 1).toUpperCase()}</div><div><p className="admin-kicker">Profil utilisateur</p><h2>{user.name || [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Utilisateur'}</h2><p>{user.email || 'Email non disponible'}</p></div></div><div className="admin-detail-grid"><div className="admin-card admin-detail-card"><p className="admin-kicker">Informations</p><dl><dt>Rôle</dt><dd>{user.role || user.userType || '—'}</dd><dt>Statut</dt><dd>{user.status || '—'}</dd><dt>Téléphone</dt><dd>{user.phone || '—'}</dd><dt>Entreprise</dt><dd>{user.company || user.companyName || '—'}</dd><dt>Inscription</dt><dd>{user.createdAt || user.registeredAt || '—'}</dd><dt>Dernière activité</dt><dd>{user.lastActivity || user.lastLogin || '—'}</dd></dl></div><div className="admin-card admin-detail-card"><p className="admin-kicker">Actions administratives</p><div className="admin-detail-empty"><strong>Aucune action disponible.</strong><span>Les boutons de suspension, réactivation ou désactivation seront affichés uniquement si les permissions et endpoints backend existent.</span></div></div></div></section>;
}
