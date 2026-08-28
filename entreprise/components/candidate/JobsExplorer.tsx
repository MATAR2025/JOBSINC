'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useEffect } from 'react';
import { CandidateJob, fetchJobs } from '@/lib/candidate-api';
import Icon from '@/components/ui/Icon';

function JobCard({ job }: { job: CandidateJob }) {
  const company = typeof job.company === 'object' && job.company !== null ? job.company : undefined;
  const salary = job.salaryMin || job.salaryMax ? `${job.currency || ''} ${job.salaryMin ? Number(job.salaryMin).toLocaleString('fr-FR') : ''}${job.salaryMin && job.salaryMax ? ' – ' : ''}${job.salaryMax ? Number(job.salaryMax).toLocaleString('fr-FR') : ''}`.trim() : null;
  const deadline = job.deadline ? new Date(job.deadline) : null;

  return (
    <Link href={`/offres/${job.id}`} className="cand-job">
      <div className="cand-job-company">{company?.name || 'Entreprise JOBSINC'}</div>
      <h3>{job.title}</h3>
      <div className="cand-job-meta">
        {job.location && <span><Icon name="pin" size={13} />{job.location}</span>}
        {job.contractType && <span><Icon name="briefcase" size={13} />{job.contractType}</span>}
        {job.workMode && <span><Icon name="target" size={13} />{job.workMode}</span>}
        {salary && <span><strong style={{ color: 'var(--navy)' }}>{salary}</strong></span>}
      </div>
      <div className="cand-job-foot">
        <span>{job.publishedAt ? new Date(job.publishedAt).toLocaleDateString('fr-FR') : 'Nouvelle offre'}{deadline && !Number.isNaN(deadline.getTime()) ? ` · Candidates avant le ${deadline.toLocaleDateString('fr-FR')}` : ''}</span>
        <span className="cand-job-link">Voir l’offre <Icon name="arrow" size={14} /></span>
      </div>
    </Link>
  );
}

export default function JobsExplorer() {
  const [jobs, setJobs] = useState<CandidateJob[]>([]);
  const [query, setQuery] = useState('');
  const [contract, setContract] = useState('');
  const [workMode, setWorkMode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    fetchJobs()
      .then((data) => { if (active) setJobs(data); })
      .catch(() => { if (active) setError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((job) => {
      if (q && ![job.title, job.location, job.description, job.skills].some((v) => v?.toLowerCase().includes(q))) return false;
      if (contract && job.contractType !== contract && job.jobType !== contract) return false;
      if (workMode && job.workMode !== workMode) return false;
      return true;
    });
  }, [jobs, query, contract, workMode]);

  return (
    <div className="dashboard-overview">
      <div className="dashboard-page-heading">
        <div><span className="dashboard-eyebrow">La bonne opportunité vous attend</span><h1>Explorez les offres du moment</h1><p>Recherchez par poste, ville ou compétence, filtrez par type de contrat et postulez en quelques clics.</p></div>
      </div>
      <div className="cand-toolbar" style={{ marginBottom: 18 }}>
        <div className="cand-search">
          <Icon name="search" size={16} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Titre, ville, compétence…" aria-label="Rechercher une offre" />
        </div>
        <div className="cand-filters">
          <select value={contract} onChange={(e) => setContract(e.target.value)} aria-label="Type de contrat">
            <option value="">Tous les contrats</option>
            <option value="CDD">CDD</option>
            <option value="Temps plein">Temps plein</option>
            <option value="Temps partiel">Temps partiel</option>
            <option value="Stage">Stage</option>
            <option value="Freelance">Freelance</option>
          </select>
          <select value={workMode} onChange={(e) => setWorkMode(e.target.value)} aria-label="Mode de travail">
            <option value="">Tous les modes</option>
            <option value="Présentiel">Présentiel</option>
            <option value="Hybride">Hybride</option>
            <option value="Télétravail">Télétravail</option>
          </select>
        </div>
      </div>
      {loading ? (
        <div className="dashboard-state"><span>Chargement des offres…</span></div>
      ) : error ? (
        <div className="dashboard-state dashboard-error"><strong>Les offres sont momentanément indisponibles.</strong><span>Réessayez dans quelques instants.</span></div>
      ) : filtered.length === 0 ? (
        <div className="dashboard-state"><span>Aucune offre ne correspond à votre recherche.</span><span>Essayez d’élargir vos critères.</span></div>
      ) : (
        <div className="cand-jobs">{filtered.map((job) => <JobCard key={job.id} job={job} />)}</div>
      )}
    </div>
  );
}