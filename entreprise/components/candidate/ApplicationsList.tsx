'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CandidateApplication, CandidateInterview, candidateAssetUrl, fetchMyApplications } from '@/lib/candidate-api';
import Icon from '@/components/ui/Icon';
import InterviewChooser from '@/components/candidate/InterviewChooser';

const STATUS_ICONS: Record<string, string> = {
  RECEIVED: 'mail',
  UNDER_REVIEW: 'search',
  INTERVIEW: 'users',
  ACCEPTED: 'check',
  REJECTED: 'spark',
};

const formatConfirmed = (iso: string) => new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));

function locationToShow(app: CandidateApplication): { label: string; mapsUrl?: string | null } | null {
  if (app.status === 'INTERVIEW' && app.interview?.companyLocation?.label) {
    return { label: app.interview.companyLocation.label, mapsUrl: app.interview.companyLocation.mapsUrl };
  }
  if (app.status === 'ACCEPTED' && app.job?.company) {
    const label = [app.job.company.address, app.job.company.city, app.job.company.country].filter(Boolean).join(', ') || app.job.location;
    if (!label && !app.job.company.mapsUrl) return null;
    return { label: label || 'Siège de l’entreprise', mapsUrl: app.job.company.mapsUrl };
  }
  return null;
}

export default function ApplicationsList() {
  const [apps, setApps] = useState<CandidateApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    fetchMyApplications()
      .then((data) => { if (active) setApps(data); })
      .catch(() => { if (active) setError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  function updateInterview(applicationId: string, next: CandidateInterview) {
    setApps((current) => current.map((app) => (app.id === applicationId ? { ...app, interview: next } : app)));
  }

  return (
    <div className="dashboard-overview">
      <div className="dashboard-page-heading">
        <div><span className="dashboard-eyebrow">Votre suivi</span><h1>Mes candidatures</h1><p>Suivez l’état de vos candidatures : reçue, en cours d’examen, entretien, acceptée ou refusée.</p></div>
        <Link href="/offres" className="button button-primary"><span>+</span> Explorer les offres</Link>
      </div>
      {loading ? (
        <div className="dashboard-state"><span>Chargement de vos candidatures…</span></div>
      ) : error ? (
        <div className="dashboard-state dashboard-error"><strong>Impossible de charger vos candidatures.</strong><span>Réessayez dans quelques instants.</span></div>
      ) : apps.length === 0 ? (
        <div className="dashboard-state"><span>Aucune candidature pour le moment. Explorez les offres disponibles et postulez dès maintenant.</span><Link href="/offres" className="button button-outline button-small">Voir les offres</Link></div>
      ) : (
        <div className="app-list">
          {apps.map((app) => {
            const interview = app.interview;
            const confirmedSlot = interview?.status === 'CONFIRMED' ? interview.slots?.find((slot) => slot.id === interview.confirmedSlotId) : null;
            const location = locationToShow(app);
            return (
              <article className="app-card" key={app.id}>
                <div className="app-card-top">
                  <div>
                    <div className="app-card-company">{app.job?.company?.name || 'Entreprise'}</div>
                    <h3>{app.job?.title}</h3>
                  </div>
                  <span className={`app-status ${app.status.toLowerCase()}`}>
                    <Icon name={(STATUS_ICONS[app.status] || 'mail') as 'mail' | 'search' | 'users' | 'check' | 'spark'} size={13} />
                    {app.statusLabel || app.status}
                  </span>
                </div>
                <div className="app-card-meta">
                  {app.job?.location && <span><Icon name="pin" size={13} />{app.job.location}</span>}
                  {app.job?.contractType && <span><Icon name="briefcase" size={13} />{app.job.contractType}</span>}
                  <span>Envoyée le {new Date(app.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
                {location && (
                  <div className="app-location"><Icon name="pin" size={14} /><span>{location.label}</span>{location.mapsUrl && <a href={location.mapsUrl} target="_blank" rel="noreferrer">Ouvrir dans Google Maps</a>}</div>
                )}
                {app.coverLetter && <div className="app-cover"><strong style={{ display: 'block', marginBottom: 6, color: 'var(--navy)' }}>Votre lettre de motivation</strong><span style={{ whiteSpace: 'pre-line' }}>{app.coverLetter}</span></div>}
                {interview && app.status === 'INTERVIEW' && (
                  <div className="app-cover">
                    {confirmedSlot ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 10, background: '#e9f8f3', border: '1px solid #bfe8d8' }}>
                        <Icon name="check" size={15} />
                        <strong style={{ color: 'var(--green)', fontWeight: 700 }}>Entretien confirmé : {formatConfirmed(confirmedSlot.startAt)}</strong>
                      </div>
                    ) : (
                      <InterviewChooser applicationId={app.id} interview={interview} onConfirmed={(next) => updateInterview(app.id, next)} />
                    )}
                  </div>
                )}
                <div className="cand-job-foot" style={{ marginTop: 16, paddingTop: 14 }}>
                  <Link href={`/offres/${app.job?.id}`} className="cand-job-link">Voir l’offre <Icon name="arrow" size={14} /></Link>
                  {app.cvUrl && <a href={candidateAssetUrl(app.cvUrl) || undefined} target="_blank" rel="noreferrer" className="cand-job-link">Voir mon CV</a>}
                  {app.coverLetterUrl && <a href={candidateAssetUrl(app.coverLetterUrl) || undefined} target="_blank" rel="noreferrer" className="cand-job-link">Voir ma lettre de motivation</a>}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}