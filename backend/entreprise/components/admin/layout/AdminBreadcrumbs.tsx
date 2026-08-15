'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const names: Record<string, string> = { admin: 'Administration', users: 'Utilisateurs', candidates: 'Candidats', employees: 'Employés', companies: 'Entreprises', administrators: 'Administrateurs', jobs: 'Offres', applications: 'Candidatures', interviews: 'Entretiens', recruitments: 'Recrutements', moderation: 'Modération', reports: 'Rapports', analytics: 'Analyse', activity: 'Activité', sessions: 'Sessions', security: 'Sécurité', notifications: 'Notifications', system: 'Système', maintenance: 'Maintenance', settings: 'Paramètres' };
export default function AdminBreadcrumbs() { const pathname = usePathname(); const parts = pathname.split('/').filter(Boolean); return <nav className="admin-breadcrumbs" aria-label="Fil d’Ariane">{parts.map((part, index) => { const href = `/${parts.slice(0, index + 1).join('/')}`; return <span key={href}>{index ? '›' : null}{index === parts.length - 1 ? <strong>{names[part] || 'Détail'}</strong> : <Link href={href}>{names[part] || part}</Link>}</span>; })}</nav>; }
