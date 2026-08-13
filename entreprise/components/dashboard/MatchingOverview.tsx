'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import Icon from '@/components/ui/Icon';
import { getMatching } from '@/lib/api';

type Match = { id?: string | number; candidateName?: string; name?: string; jobTitle?: string; title?: string; score?: number; matchScore?: number; location?: string; skills?: string[] };
function initials(name: string) { return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'C'; }

export default function MatchingOverview() {
  const [matches, setMatches] = useState<Match[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(false);
  const load = useCallback(() => { setLoading(true); setError(false); getMatching().then((response) => { if (Array.isArray(response)) setMatches(response); else setMatches(response?.data || response?.results || []); }).catch(() => setError(true)).finally(() => setLoading(false)); }, []);
  useEffect(() => { load(); }, [load]);
  return <section className="matching-page"><div className="dashboard-page-heading"><div><span className="dashboard-eyebrow">Décision assistée</span><h1>Matching des talents</h1><p>Identifiez les profils les plus proches de vos besoins.</p></div><Link href="/dashboard/jobs" className="button button-outline"><Icon name="briefcase" size={16} /> Voir mes offres</Link></div>{error ? <div className="dashboard-state dashboard-error"><strong>Impossible de charger les recommandations.</strong><button type="button" className="button button-outline button-small" onClick={load}>Réessayer</button></div> : loading ? <div className="matching-grid">{[1, 2, 3].map((item) => <div className="match-card matching-skeleton" key={item} />)}</div> : matches.length === 0 ? <div className="dashboard-panel"><div className="matching-empty"><div className="matching-empty-icon"><Icon name="target" size={25} /></div><h2>Aucun matching disponible pour le moment.</h2><p>Les recommandations apparaîtront ici lorsque les données de vos offres et des candidats seront disponibles.</p><Link href="/dashboard/jobs/new" className="button button-primary">Créer une offre</Link></div></div> : <div className="matching-grid">{matches.map((match, index) => { const name = match.name || match.candidateName || 'Candidat'; const score = match.matchScore ?? match.score; return <article className="match-card" key={match.id || index}><div className="match-card-top"><div className="candidate-avatar">{initials(name)}</div><div><h2>{name}</h2><p>{match.title || match.jobTitle || 'Poste non renseigné'}</p></div>{typeof score === 'number' && <strong className="match-score">{score}%</strong>}</div><div className="match-meta">{match.location && <span><Icon name="pin" size={14} />{match.location}</span>}{match.skills?.slice(0, 3).map((skill) => <span key={skill}>{skill}</span>)}</div><Link href={`/dashboard/applications/${match.id || ''}`} className="job-link">Voir la candidature <Icon name="arrow" size={14} /></Link></article>; })}</div>}</section>;
}
