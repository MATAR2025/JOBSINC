'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Icon from '@/components/ui/Icon';
import { CandidateApplication, CandidateProfile, getNotifications, getSessionUser, fetchMyApplications, fetchProfile, candidateAssetUrl } from '@/lib/candidate-api';

const STATUS_ICONS: Record<string, string> = {
  RECEIVED: 'mail',
  UNDER_REVIEW: 'search',
  INTERVIEW: 'users',
  ACCEPTED: 'check',
  REJECTED: 'spark',
};

export default function CandidateHome() {
  const [apps, setApps] = useState<CandidateApplication[]>([]);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [unread, setUnread] = useState(0);
  const [userName, setUserName] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([fetchMyApplications(), getNotifications(), fetchProfile().catch(() => null)])
      .then(([applications, notifications, candidateProfile]) => {
        const sessionUser = getSessionUser();
        if (!active) return;
        setUserName(sessionUser?.candidate?.firstName || sessionUser?.email?.split('@')[0] || '');
        setApps(applications);
        setUnread(notifications.unreadCount);
        setProfile(candidateProfile);
      })
      .catch(() => {})
      .finally(() => { if (active) setLoaded(true); });
    return () => { active = false; };
  }, []);

  const firstName = userName || 'candidat';
  const missingCv = !profile?.cvUrl;
  const cvUrl = candidateAssetUrl(profile?.cvUrl);

  const stats: Array<[string, string, string, number]> = [
    ['applications', 'Candidatures envoyées', 'users', apps.length],
    ['interviews', 'En entretien', 'chart', apps.filter((app) => app.status === 'INTERVIEW').length],
    ['accepted', 'Acceptées', 'check', apps.filter((app) => app.status === 'ACCEPTED').length],
    ['messages', 'Messages non lus', 'mail', unread],
  ];

  const actions = [
    { href: '/offres', label: 'Explorer les offres', hint: 'Découvrez les nouvelles opportunités', count: null as null | number },
    { href: '/mes-messages', label: 'Voir mes messages', hint: 'Suivez vos échanges avec les recruteurs', count: unread },
    { href: '/mon-profil', label: missingCv ? 'Ajouter mon CV' : 'Gérer mon profil', hint: missingCv ? 'Renforcez votre candidature' : 'Complétez vos informations', count: null },
  ];

  return (
    <div className="dashboard-overview">
      <div className="dashboard-page-heading">
        <div><span className="dashboard-eyebrow">Espace candidat</span><h1>Bonjour, {firstName}</h1><p>Voici ce qui se passe avec vos candidatures.</p></div>
        <Link href="/offres" className="button button-primary"><span>+</span> Explorer les offres</Link>
      </div>
      {!loaded ? (
        <div className="dashboard-state"><span>Chargement de votre espace…</span></div>
      ) : (
        <>
          <div className="dashboard-stat-grid">
            {stats.map(([key, label, icon, count]) => (
              <div className="dashboard-stat-card" key={key}>
                <div className="stat-card-top"><span>{label}</span><i><Icon name={icon as 'users' | 'chart' | 'check' | 'mail'} size={17} /></i></div>
                <strong>{count}</strong>
                <small>Votre activité candidat</small>
              </div>
            ))}
          </div>

          <div className="dashboard-main-grid">
            <section className="dashboard-panel activity-panel">
              <div className="panel-heading">
                <div><span className="dashboard-eyebrow">Suivi</span><h2>Mes dernières candidatures</h2></div>
                <Link href="/mes-candidatures" className="button button-outline button-small">Toutes mes candidatures</Link>
              </div>
              {apps.length === 0 ? (
                <div className="dashboard-state"><span>Vous n’avez pas encore postulé. Explorez les offres pour commencer.</span><Link href="/offres" className="button button-outline button-small">Voir les offres</Link></div>
              ) : (
                <div className="home-app-list">
                  {apps.slice(0, 4).map((app) => (
                    <Link href={`/offres/${app.job?.id}`} className="home-app-row" key={app.id}>
                      <div className="home-app-copy">
                        <strong>{app.job?.title || 'Offre'}</strong>
                        <span>{app.job?.company?.name || 'Entreprise'} · envoyée le {new Date(app.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <span className={`app-status ${app.status.toLowerCase()}`}><Icon name={(STATUS_ICONS[app.status] || 'mail') as 'mail' | 'search' | 'users' | 'check' | 'spark'} size={12} />{app.statusLabel || app.status}</span>
                    </Link>
                  ))}
                </div>
              )}
              {apps.length > 0 && cvUrl && (
                <div className="home-cv-link"><Icon name="check" size={14} />Votre CV est en ligne : <a href={cvUrl} target="_blank" rel="noreferrer">consulter</a></div>
              )}
            </section>

            <section className="dashboard-panel action-panel">
              <div className="panel-heading">
                <div><span className="dashboard-eyebrow">Priorités</span><h2>Actions utiles</h2></div>
              </div>
              <div className="action-list">
                {actions.map((action, index) => (
                  <Link href={action.href} key={index}>
                    <span className="action-dot" />
                    <span>{action.label}<small style={{ display: 'block', fontWeight: 400 }}>{action.hint}</small></span>
                    {typeof action.count === 'number' && action.count > 0 && <b>{action.count}</b>}
                    <Icon name="arrow" size={15} />
                  </Link>
                ))}
                {missingCv && <div className="home-tip"><Icon name="spark" size={15} />Ajouter votre CV augmentera vos chances d’être contacté.</div>}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}