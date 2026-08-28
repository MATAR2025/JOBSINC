'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { assetUrl, CompanyApplicationDetail, getApplicationDetail, updateApplicationStatus } from '@/lib/api';
import InterviewScheduler from '@/components/dashboard/InterviewScheduler';

const actions = [
  { status: 'UNDER_REVIEW', label: 'En cours d’examen', className: 'button-primary' },
  { status: 'INTERVIEW', label: 'Planifier un entretien', className: 'button-interview' },
  { status: 'ACCEPTED', label: 'Accepter', className: 'button-success' },
  { status: 'REJECTED', label: 'Refuser', className: 'button-danger' },
];

export default function ApplicationDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<CompanyApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  const load = () => {
    setLoading(true);
    setMissing(false);
    getApplicationDetail(id)
      .then((data) => setDetail(data))
      .catch(() => setMissing(true))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    const timer = window.setTimeout(load, 0);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function changeStatus(status: string) {
    if (!detail?.id || busy) return;
    setBusy(true);
    setNotice('');
    try {
      const updated = await updateApplicationStatus(detail.id, status);
      setDetail((current) => current ? { ...current, status: updated.status, statusLabel: updated.statusLabel } : current);
      setNotice('Statut de la candidature mis à jour.');
    } catch (err) {
      setNotice(err instanceof Error ? `Erreur : ${err.message}` : 'Impossible de mettre à jour le statut.');
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <section className="application-detail-page"><div className="dashboard-panel job-detail-skeleton" /></section>;
  if (missing || !detail) return <section className="application-detail-page"><div className="dashboard-panel"><div className="jobs-empty"><h2>Cette candidature n’est pas disponible.</h2><p>Elle ne fait pas partie des candidatures accessibles pour cette entreprise.</p><Link href="/dashboard/applications" className="button button-outline">Retour aux candidatures</Link></div></div></section>;

  const candidate = detail.candidate;
  const name = candidate ? `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim() : 'Candidat';
  const initials = name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'C';
  const avatar = candidate?.avatarUrl ? assetUrl(candidate.avatarUrl) : null;
  const location = [candidate?.city, candidate?.country].filter(Boolean).join(', ') || null;
  const skills = (candidate?.skills || '').split(',').map((skill) => skill.trim()).filter(Boolean);

  return (
    <section className="application-detail-page">
      <Link href="/dashboard/applications" className="back-link">← Retour aux candidatures</Link>
      <div className="application-detail-header">
        <div className="candidate-avatar large">
          {avatar ? <Image src={avatar} alt="" width={58} height={58} /> : initials}
        </div>
        <div>
          <span className="dashboard-eyebrow">Profil candidat</span>
          <h1>{name}</h1>
          <p>{detail.job?.title || 'Poste non renseigné'}{detail.job?.location ? ` · ${detail.job.location}` : ''}</p>
        </div>
        <div className="application-status">{detail.statusLabel || detail.status || 'Statut non renseigné'}</div>
      </div>

      <div className="job-detail-grid">
        <div className="dashboard-panel">
          <h2>Informations candidat</h2>
          <div className="job-detail-meta">
            <div><span>Email</span><strong>{candidate?.email || '--'}</strong></div>
            <div><span>Téléphone</span><strong>{candidate?.phone || '--'}</strong></div>
            <div><span>Localisation</span><strong>{location || '--'}</strong></div>
            <div><span>Date de candidature</span><strong>{detail.createdAt ? new Date(detail.createdAt).toLocaleDateString('fr-FR') : '--'}</strong></div>
          </div>
          {skills.length > 0 && (
            <>
              <h2 style={{ marginTop: 22 }}>Compétences</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {skills.map((skill) => <span key={skill} style={{ display: 'inline-flex', padding: '6px 10px', borderRadius: 999, background: '#eef5fb', color: '#3b6284', fontSize: 11, fontWeight: 700 }}>{skill}</span>)}
              </div>
            </>
          )}
          {detail.cvUrl && (
            <p style={{ marginTop: 18 }}>
              <a className="action-link" href={assetUrl(detail.cvUrl) || undefined} target="_blank" rel="noreferrer">Consulter le CV de ce candidat</a>
            </p>
          )}
        </div>

        <div className="dashboard-panel">
          <h2>Lettre de motivation</h2>
          {detail.coverLetter ? <p className="detail-muted" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{detail.coverLetter}</p> : <p className="detail-muted">Aucune lettre de motivation rédigée.</p>}
          {detail.coverLetterUrl && (
            <p style={{ marginTop: 14 }}>
              <a className="action-link" href={assetUrl(detail.coverLetterUrl) || undefined} target="_blank" rel="noreferrer">Lettre de motivation jointe</a>
            </p>
          )}
        </div>
      </div>

      <div className="dashboard-panel" style={{ marginTop: 14 }}>
        <h2>Actions</h2>
        {notice && <div className="detail-muted" style={{ margin: '0 0 14px', color: notice.startsWith('Erreur') ? '#b2433c' : 'var(--green)' }}>{notice}</div>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {actions.map((action) => {
            const isCurrent = detail.status === action.status;
            return (
              <button key={action.status} type="button" className={`button ${isCurrent ? action.className : 'button-outline'}`} style={{ opacity: busy ? .6 : 1 }} disabled={busy} onClick={() => changeStatus(action.status)}>
                {action.label}
              </button>
            );
          })}
        </div>
      </div>

      {detail.status === 'INTERVIEW' && <InterviewScheduler applicationId={detail.id || id} interview={detail.interview} onReload={load} />}
    </section>
  );
}