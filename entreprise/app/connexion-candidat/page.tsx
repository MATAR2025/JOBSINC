import type { Metadata } from 'next';
import { Suspense } from 'react';
import CandidateHeader from '@/components/candidate/CandidateHeader';
import CandidateLoginForm from '@/components/candidate/CandidateLoginForm';

export const metadata: Metadata = { title: 'Connexion candidat — JOBSINC' };
export default function ConnexionCandidatPage() {
  return <><CandidateHeader /><Suspense fallback={<div className="login-candidate-tip"><div className="empty-state">Chargement…</div></div>}><CandidateLoginForm /></Suspense></>;
}