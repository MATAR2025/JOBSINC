'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Icon from '@/components/ui/Icon';
import { getJob, isApiConfigured, PublicJob } from '@/lib/api';

export default function PublicJobDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<PublicJob | null>(null);
  const [loading, setLoading] = useState(isApiConfigured());
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isApiConfigured()) { setLoading(false); setError(true); return; }
    let active = true;
    getJob(id).then((data) => { if (active) setJob(data); }).catch(() => { if (active) setError(true); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  const meta = [
    job?.location && ['pin', job.location],
    job?.contractType && ['briefcase', job.contractType],
    job?.workMode && ['target', job.workMode],
    job?.experience && ['chart', job.experience],
    job?.deadline && ['spark', `Candidatez avant le ${new Date(job.deadline).toLocaleDateString('fr-FR')}`],
  ].filter(Boolean) as Array<['pin' | 'briefcase' | 'target' | 'chart' | 'spark', string]>;
  const salary = job?.salaryMin || job?.salaryMax ? `${job.salaryMin ? `${job.currency || ''} ${Number(job.salaryMin).toLocaleString('fr-FR')}` : ''}${job.salaryMin && job.salaryMax ? ' – ' : ''}${job.salaryMax ? `${job.currency || ''} ${Number(job.salaryMax).toLocaleString('fr-FR')}` : ''}`.trim() : null;

  return <><Header /><main><section className="section" style={{ paddingTop: 60 }}><div className="container" style={{ maxWidth: 880 }}>
    {loading ? <div className="empty-state">Chargement de l’offre…</div>
      : error || !job ? <div className="empty-state"><h3 style={{ color: 'var(--navy)', marginBottom: 10 }}>Cette offre n’est pas disponible.</h3><p>Elle a peut-être été pourvue ou n’est plus publiée.</p><div style={{ marginTop: 22 }}><Link href="/" className="button button-outline">Retour à l’accueil</Link></div></div>
        : <>
          <Link href="/#jobs" className="back-link" style={{ display: 'inline-flex', marginBottom: 26 }}>← Toutes les offres</Link>
          <article className="feature" style={{ padding: 34 }}>
            <div className="eyebrow">{job.company || 'Entreprise JOBSINC'}</div>
            <h1 style={{ margin: '12px 0', fontSize: 'clamp(28px,4vw,42px)', letterSpacing: '-.04em', color: 'var(--navy)' }}>{job.title}</h1>
            <div className="job-meta" style={{ flexWrap: 'wrap' }}>{meta.map(([icon, label]) => <span key={icon + label}><Icon name={icon} size={14} />{label}</span>)}{salary && <span><strong>{salary}</strong></span>}</div>
            {job.department && <p style={{ marginTop: 14, color: 'var(--muted)', fontSize: 13 }}>Département : {job.department}</p>}
          </article>
          {job.description && <div className="feature" style={{ marginTop: 16, padding: 34 }}><h2 style={{ marginBottom: 14 }}>Description du poste</h2><p style={{ whiteSpace: 'pre-line', lineHeight: 1.75, color: 'var(--muted)' }}>{job.description}</p></div>}
          {Array.isArray(job.responsibilities) && job.responsibilities.length > 0 && <div className="feature" style={{ marginTop: 16, padding: 34 }}><h2 style={{ marginBottom: 14 }}>Missions principales</h2><ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.9, color: 'var(--muted)' }}>{job.responsibilities.map((item: string, index: number) => <li key={index}>{item}</li>)}</ul></div>}
          {Array.isArray(job.skills) && job.skills.length > 0 && <div className="feature" style={{ marginTop: 16, padding: 34 }}><h2 style={{ marginBottom: 14 }}>Compétences recherchées</h2><div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>{job.skills.map((skill: string) => <span key={skill} style={{ padding: '7px 12px', borderRadius: 999, background: '#e8f7fa', color: 'var(--blue)', fontWeight: 700, fontSize: 12 }}>{skill}</span>)}</div></div>}
          <div style={{ marginTop: 30 }}><Link href="/register" className="button button-primary">Créer un compte entreprise sur JOBSINC</Link></div>
        </>}
  </div></section></main><Footer /></>;
}
