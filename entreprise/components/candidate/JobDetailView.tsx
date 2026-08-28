'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CandidateApplication, CandidateJob, fetchJob, fetchMyApplications, getSessionToken } from '@/lib/candidate-api';
import Icon from '@/components/ui/Icon';

export default function JobDetailView({ jobId }: { jobId: string }) {
  const [job, setJob] = useState<CandidateJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let active = true;
    fetchJob(jobId)
      .then((data) => { if (active) setJob(data); })
      .catch(() => { if (active) setError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [jobId]);

  useEffect(() => {
    if (!getSessionToken()) return;
    let active = true;
    fetchMyApplications()
      .then((apps: CandidateApplication[]) => { if (active) setAppliedJobIds(new Set(apps.map((app) => app.job?.id).filter((id): id is string => Boolean(id)))); })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const company = typeof job?.company === 'object' && job?.company !== null ? job.company : undefined;
  const isApplied = appliedJobIds.has(jobId);
  const meta = [
    job?.location && ['pin', job.location],
    job?.contractType && ['briefcase', job.contractType],
    job?.workMode && ['target', job.workMode],
    job?.experience && ['chart', job.experience],
  ].filter(Boolean) as Array<['pin' | 'briefcase' | 'target' | 'chart', string]>;
  const salary = job?.salaryMin || job?.salaryMax ? `${job.currency || ''} ${job.salaryMin ? Number(job.salaryMin).toLocaleString('fr-FR') : ''}${job.salaryMin && job.salaryMax ? ' – ' : ''}${job.salaryMax ? Number(job.salaryMax).toLocaleString('fr-FR') : ''}`.trim() : null;
  const skills = job?.skills?.split(',').map((s) => s.trim()).filter(Boolean) || [];

  return (
    <div className="dashboard-overview">
      <div className="dashboard-page-heading">
        <div><span className="dashboard-eyebrow">Offres d’emploi</span><h1>Détail de l’offre</h1><p>Découvrez la mission, les missions principales et les compétences recherchées.</p></div>
        <Link href="/offres" className="button button-outline"><Icon name="arrow" size={15} /> Toutes les offres</Link>
      </div>
      {loading ? (
        <div className="dashboard-state"><span>Chargement de l’offre…</span></div>
      ) : error || !job ? (
        <div className="dashboard-state"><span>Cette offre n’est pas disponible. Elle a peut-être été pourvue ou n’est plus publiée.</span><Link href="/offres" className="button button-outline button-small">Voir toutes les offres</Link></div>
      ) : (
        <div className="cand-detail">
          <article className="cand-detail-head">
            <div className="eyebrow" style={{ marginBottom: 12 }}>{company?.name || 'Entreprise JOBSINC'}</div>
            <h1>{job.title}</h1>
            <div className="cand-job-meta">{meta.map(([icon, label]) => <span key={icon + label}><Icon name={icon} size={14} />{label}</span>)}{salary && <span><strong style={{ color: 'var(--navy)' }}>{salary}</strong></span>}</div>
            {(job.department || job.experience) && <p style={{ marginTop: 14, color: 'var(--muted)', fontSize: 13 }}>{[job.department, job.experience].filter(Boolean).join(' · ')}</p>}
          </article>

          {job.description && (
            <section className="cand-section"><h2>Description du poste</h2><p>{job.description}</p></section>
          )}
          {job.responsibilities && (
            <section className="cand-section"><h2>Missions principales</h2><ul>{job.responsibilities.split(/\r?\n/).filter((line) => line.trim()).map((line, i) => <li key={i}>{line.replace(/^[-•*]\s*/, '')}</li>)}</ul></section>
          )}
          {skills.length > 0 && (
            <section className="cand-section"><h2>Compétences recherchées</h2><div className="cand-skills">{skills.map((skill) => <span key={skill} className="cand-chip">{skill}</span>)}</div></section>
          )}
        </div>
      )}

      {job && !error && (
        <div className="cand-apply-bar">
          <div className="container cand-apply-inner">
            <div className="cand-apply-meta"><strong>{job.title}</strong>{job.location ? ` · ${job.location}` : ''}</div>
            {isApplied ? (
              <Link href="/mes-candidatures" className="button button-outline">Voir ma candidature</Link>
            ) : (
              <Link href={getSessionToken() ? `/offres/${job.id}/postuler` : `/connexion-candidat?redirect=${encodeURIComponent(`/offres/${job.id}/postuler`)}`} className="button button-primary">Postuler maintenant</Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}